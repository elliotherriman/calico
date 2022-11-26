/*

	CALICO
	an engine for ink,
	built by elliot herriman
	https://twitter.com/elliotherriman
	https://elliotherriman.itch.io

*/ 

// ===================================
// SETUP
// ===================================
// get everything ready before we start playing the story

// test if the browser is compatible with our code
try { new Function("(a = 0) => a"); } 
catch (e) 
{
	// if not, we let the user know that they might not be able to play the game
	alert ("It looks like your browser isn't fully compatible with this game. You can try to proceed, but things might not work entirely, or at all.");
}

// -----------------------------------
// default options
// -----------------------------------
// these are the options that get loaded into every story
// you can change them all with tags, or you can change them
// in your project file once you've created your game object,
// via "game.options[option] = value;"

var options = 
{
	// delay between removing an old passage, and showing the new passage
	passagedelay: 200.0,
	// delay between each line. if set to 0, all text will appear at once
	linedelay: 50.0,
	// how long it takes for each line to fully appear
	// for fade, usually mostly visible about 50-75% of the way through
	showlength: 500.0,
	// how long it takes for each line to fully fade out
	hidelength: 600.0,
	// how long we wait to make a choice clickable after it's fully rendered
	suppresschoice: 0.0,
	// default file formats that we'll fall back to
	// used in certain tags, like #image
	defaultimageformat: ".png",
	defaultaudioformat: ".mp3",
	// default file locations, relative to your project folder
	defaultimagelocation: "images/",
	defaultaudiolocation: "music/",
	// default text animation 
	textanimation: "fade",
	// enable debug mode to print messages to the console
	// set to true globally with options.debug = true;
	debug: false,
};

// -----------------------------------
// print credits to the dev console
// -----------------------------------
// this is a really dressed up way of including the mandatory software licence 
// stuff while also crediting the contributors of the project etc etc

credit({
	emoji: "🐈",
	name: "Calico",
	version: "2.0.1",
	description: ["An interactive fiction engine built from patchwork and ink stains.", "Want to write a game like this one? Check out the project at https://elliotherriman.itch.io/calico.", "Trans rights are human rights. 🏳️‍⚧✨️"],
	licences: {
		self: "2021 Elliot Herriman",
		mit: {
			"ink" : "2016 inkle Ltd.",
			"inkjs" : "2017 Yannick Lohse"
		}
	}
});

// ===================================
// STORY CODE
// ===================================
// all the code responsible for controlling the story,
// stored in one handy little (big) class

class Story
{
	// immutable list of states the story can exist in
	static get states () 
	{ 
		if (!this._states) 
		{
			this._states = {
				"idle": 0,
				"waiting": 1,
				"active": 2,
				"locked": 3,
			};
		}		
		return this._states;
	}

	// called whenever we create a new story object
	constructor(input, innerdiv = "story", outerdiv = "container")
	{
		// load the ink, and then once that's done,
		this.loadInk(input).then((content) =>
		{
			// create our options, which can be changed later 
			// (either in your project file, or via ink tags)
			this.options = options;
			// define our target HTML elements
			this.innerdiv = document.getElementById(innerdiv);
			this.outerdiv = document.getElementById(outerdiv);

			// create the queue for processed elements that we want to render
			this.queue = new Queue(this, 0);

			// ensure we can refer to this object while we're inside its functions
			bindFunctions(this);

			// apply all our patches
			Patches.apply(this, content);
			
			// apply any external functions
			this.bindExternalFunctions(content);
			
			// mark that the engine's idle, and ready to start looping
			this.state = Story.states.idle;

			this.start();
		});
	}

	// function to load our story into a javascript object
	// you can pass this either either a file path, the raw text of a compiled
	// ink file, or that raw text parsed into a javascript object
	loadInk(input)
	{
		if (typeof input === "string")
		{
			// if we tried loading an ink file,
			if (input.endsWith(".ink"))
			{ 
				// WE CAN DO THIS NOW
				return new Promise((resolve, reject) => 
				{
					// we open up the file,
					fetchText(input)
					// and with that text,
					.then((storyContent) => 
					{
						// (unless something went wrong,)
						if (!storyContent)
						{
							// (in which case we'll throw an error about here,)
							throw throwIntoVoid(console.error, "\"" + input + "\" could not be found.");
						}
						
						// anyway, now we have to search our ink for any INCLUDEs
						let includeFiles = new Set(Array.from(
							storyContent.matchAll(/^\s*INCLUDE (.+\.ink)\s*/gi), m => m["1"]
						));

						// and iterate through the ones we find,
						let includes = {};
						let promises = [];
						includeFiles.forEach(include =>
						{
							// create an array of promises (to make sure things don't get too asynchronous)
							promises.push(new Promise((resolve, reject) =>
							{
								fetchText(include).then(text => 
								{
									// store its contents for later
									includes[include] = text;
									// and mark that we're done
									resolve();
								});
							}));
						});

						// then once, everything is done,
						return Promise.all(promises).then(() => 
						{
							// return an object containing everything we need
							return {storyContent: storyContent, includes: includes};
						});
					}).then((inkData) =>
					{
						// create compiler options so we can set up a filehandler
						let compilerOptions = new inkjs.CompilerOptions();
						// add our includes to the filehandler
						compilerOptions.fileHandler = new inkjs.JsonFileHandler(inkData.includes);

						// then we can use it to create the story object
						this.ink = new inkjs.Compiler(inkData.storyContent, compilerOptions).Compile();
					
						// and return the compiled ink itself in case we need that
						resolve(this.ink.ToJson());
					});
				});
			}
			// if we've been handed a string, it might be the story data, or it 
			// might be a file name that we need to load
			else 
			{
				// so we try to load it as if it's story data
				try
				{
					input = JSON.parse(input);

					return new Promise((resolve, reject) =>
					{
						this.ink = new inkjs.Story(input);
						resolve(input);
					});
				} 
				// and if that breaks, then it was probably a story file
				catch (e) 
				{
					// so...
					return new Promise((resolve, reject) => 
					{
						// we open up the file,
						fetchText(input)
						// and with that text,
						.then((storyContent) => 
						{
							// (unless something went wrong,
							if (!storyContent)
							{
								// (in which case we'll throw an error about here,)
								throw throwIntoVoid(console.error, "\"" + input + "\" could not be found.");
							}
							
							// then we can use it to create the story object
							this.ink = new inkjs.Story(storyContent);
							resolve(storyContent);
						});
					});
				}
			}
		}
		// otherwise, if it's already loaded as an object, we load that
		else if (input.inkVersion)
		{
			// and continue with our code once it's loaded
			return new Promise((resolve, reject) => 
			{ 
				this.ink = new inkjs.Story(input);
				resolve(JSON.stringify(input));
			});
		}
	}

	// automatically detect and bind external functions in your story
	// will work with any function declared at a global level, such as
	// ones inside your project file
	bindExternalFunctions(content)
	{
		// match all the external functions in the ink json,
		new Set(Array.from(
			content.matchAll(/\"x\(\)\":\"(\w+)/gi), m => m["1"]
		)).forEach((match) =>
		{
			// and attempt to bind that to our story. if it doesn't work, 
			// ink.js will throw an error, so we don't need to handle it here
			ExternalFunctions.bind(this, match);
		});
	}

	// starts the story if loaded, or tells it to start once it's loaded
	start() 
	{
		// if we're waiting on any patches, then stop
		if (this.waiting)
		{
			return;
		}
		// if we've marked our story ready, 
		else if (typeof this.state !== "undefined")
		{
			// then we  notify that the story's ready
			notify("story ready", {story: this}, this.outerdiv);

			// and start the story
			this.continue();
		}
		// otherwise,
		else
		{
			// we wait until the story's done,
			this.outerdiv.addEventListener("story ready", () => 
			{ 
				// and then try this again
				this.start();
			}, {once: true});
		}
	}

	// main story loop
	// processes all text, choices, and tags until we reach a point
	// where the story expects user input, or has run out of content
	continue() 
	{	
		// we stop here if the story is already looping
		if (this.state != Story.states.idle)
		{
			return;
		}

		// otherwise, mark that the story object is now active
		this.state = Story.states.active;
		
		this.ink.lastKnownPathString = this.ink.state.currentPathString;
	
		// notify about it
		notify("passage start", {story: this}, this.outerdiv);
	
		// process text lines until we reach a choice, or the end of the story
		while (this.ink.canContinue) 
		{
			// move the story forwards
			this.ink.Continue();
	
			// create the line to store data in
			// since it's an object, we can pass it around via events, and 
			// changing its value there will change it here too. very handy
			// for patching in new code
			var line = {
				text: "",
				tags: { before: [], after: [] }
			};

			
			// we're going to loop through each item in the output stream,
			// which is a list of all the text fragments and tags in this 
			// line). we mark tags as coming before or after text, style 
			// each segment of the line, and finally paste it all together
			let currentText = "";
			let currentTags = [];
			
			// define item iterator here so we don't 
			// have to recreate it every time
			let item;
			let stream = this.ink.state.outputStream;

			// start by going through each item in the stream (backwards)
			for (var i = 0; i < stream.length; i++) 
			{
				// store the item for easy reference
				item = stream[i];

				if (item._commandType == 24)
				{
					let result = this.searchStreamForTag(stream, i);
					i = result.i;
					let currentTag = result.currentTag;

					if (currentTag == "unstyled")
					{
						line.text += currentText;
						currentText = "";
					}
					else if (!currentText.trim())
					{
						// if so, we sort away our tags
						line.tags.before.push(currentTag);
					}
					else
					{
						line.tags.after.push(currentTag);
						currentTags.push(currentTag);
					}
				}
				// if it's text,
				if (item.value)
				{
					if (currentText.length && currentTags.length)
					{
						currentText = Parser.process(this, currentText, currentTags);
						
						currentTags = [];
					}
					
					currentText += item.value;
				}
			}

			line.text += currentText;

			// notify that we've built a line
			notify("passage line", {story: this, line: line}, this.outerdiv);

			// process all tags that come before any story text
			line.tags.before.forEach((tag) => { Tags.process(this, tag, false); });
	
			// if that line has some text,
			if (line.text && line.text.trim())
			{				
				// create a paragraph element to display later
				var paragraphElement = document.createElement('p');
				
				paragraphElement.classList.add("text");
				
				// set the element's content
				paragraphElement.innerHTML = "<span>" + line.text + "</span>";
				
				// and push that element to queue so we can show it later
				this.queue.push(paragraphElement);
				
				// notify that we built a line element
				notify("passage line element", {story: this, element: paragraphElement, line: line}, this.outerdiv);
			}
	
			// process all tags that come after any story text
			line.tags.after.forEach((tag) => { Tags.process(this, tag, true); });
		}
	
		// process all choices available, adding them to the queue	
		this.ink.currentChoices.forEach((choice) =>
		{	
			// notify that we're starting to build a choice
			notify("passage choice", {story: this, choice: choice}, this.outerdiv);

			// create the choice as a paragraph element to show later
			var choiceParagraphElement = document.createElement('p');

			// add "choice" as a class so we can style it in the css
			choiceParagraphElement.classList.add("choice");
			
			// create the link, 
			var choiceAnchorEl = document.createElement("a");
			
			// and set its text, applying tags and patterns
			// BIG IMPORTANT THING TO NOTE: we can't edit the
			// innertext or innerhtml of either of these elements
			// once any of the event listeners are set, otherwise
			// it'll remove those event listeners. you can add to
			// them with +=, but no assigning to them with =
			choiceAnchorEl.innerHTML = Parser.process(this, choice.text, choice.tags);
	
			// hide the weird click glove cursor until the choice is ready
			choiceAnchorEl.style.cursor = "default";

			// prevent it from being dragged
			choiceAnchorEl.setAttribute('draggable', false);

			// and then add the link element to the paragraph element
			choiceParagraphElement.appendChild(choiceAnchorEl);
			
			// queue up the choice to show later
			this.queue.push(choiceParagraphElement);
			
			// tell people that we've built a choice
			notify("passage choice element", {story: this, choice: choice, element: choiceParagraphElement}, this.outerdiv);

			// ensure the choice link doesn't work as an actual link to anything
			choiceAnchorEl.addEventListener("click", function(event) 
			{
				// this just ignores the default action for the link
				// which means... linking to something, it hink/
				event.preventDefault();
			});
			

			// set up function to continue story when the player clicks a choice
			this.queue.onRendered(() =>
			{
				// wait for a moment before letting the player click the choice
				// done to prevent players from skipping past text accidentally
				// think it comes from telltale?
				setTimeout(() =>
				{
					// change the mouse cursor to the click-y hand
					// when you hover over the link, so the player 
					// knows it's active (and also a link)
					choiceAnchorEl.style.cursor = "pointer";
	
					// function that fires when you click the link,
					// telling the story where to go
					choiceAnchorEl.onclick = () => { this.choose(choice, choiceAnchorEl); };

					// how long we're waiting for (this is the standard pattern
					// for timeouts, i won't comment them in future)
				}, this.options["suppresschoice"]);
			});			
		});
			
		// now that everything's ready, we render it all!
		this.queue.render();

		// and we mark that the story is waiting for input
		this.state = Story.states.waiting;
	}

	searchStreamForTag(stream, i)
	{
		let currentTag = "";
		let item;

		for (i + 1; i < stream.length; i++) 
		{
			item = stream[i];

			if (item._commandType == 25)
			{
				break;
			}

			if (item.value)
			{
				currentTag += item.value;
			}
		}

		return {currentTag: currentTag, i: i};
	}

	// called once the player chooses a choice, to process that choice
	// and clean everything up for the next loop
	choose(choice, choiceAnchorEl) 
	{
		if (this.state != Story.states.waiting) return;
		
		this.state = Story.states.locked;

		choiceAnchorEl.onclick = null;
		
		choiceAnchorEl.classList.add("chosen");

		notify("passage end", {story: this, choice: choice}, this.outerdiv);
			
		this.setHeight();

		// tell the story which choice was picked
		this.ink.ChooseChoiceIndex(choice.index);
		
		var el = this.innerdiv.querySelector(".choice");
		if (!el)
		{
			// reset our queue
			this.queue.reset();

			this.state = Story.states.idle;

			// and start the loop over
			this.continue();
		}
		else
		{
			Element.addCallback(el, "onRemove", () => 
			{
				// reset our queue
				this.queue.reset();

				this.state = Story.states.idle;

				// and start the loop over
				this.continue();
			});
		}

		// check ahead to see if we're about to clear, and do so now rather than just
		// removing all our elements-- saves an awkward two stage clearing
		this.lookAheadAndClear(choice);
	}

	// glances at the content ahead, and checks if we're about to clear
	// if we are, then we'll clear right now, instead of clearing the
	// choices and then having to awkwardly wait and then clear the rest
	lookAheadAndClear(choice)
	{
		let stream = this.ink.PointerAtPath(choice.targetPath).container._content;
		let item;

		for (var i = 0; i < stream.length; i++)
		{
			item = stream[i];

			if (item._commandType == 24)
			{
				let result = this.searchStreamForTag(stream, i);
				
				if (result.currentTag == "clear")
				{
					this.clear();
					this.queue.reset(0);
					return;
				}

				i = result.i;
			}
		}
		this.removeElements(":scope > .choice");
	}

	// clears all elements from the story container, and resets the queue
	clear(queueDelay = this.options.hidelength, howMany = undefined)
	{
		// if we don't have anything to clear, we'll just quietly cancel
		if (!this.innerdiv.firstElementChild || !this.innerdiv.childNodes.length || this.innerdiv.firstElementChild.state == Element.states.clearing)
		{
			return;
		}

		// notify that we're starting a clear
		notify("story clearing", {story: this, delay: queueDelay, howMany: howMany}, this.outerdiv);

		Element.addCallback(this.innerdiv.firstElementChild, "onRemove", () => 
			{ 
				this.scrollUp(false); 
			});
		
		// remove all elements in story container
		this.removeElements(":scope > p");

		// then as long as it's not a partial clear,
		// (since we only want to clear the queue at the start of a new loop)
		if (!howMany)
		{
			// reset the queue, and set its delay 
			// (but not if there aren't any elements to clear)
			this.queue.reset(this.innerdiv.childNodes.length ? queueDelay : 0, howMany);
		}
	}

	// remove all elements that match with the selector
	removeElements(selector, howMany = undefined)
	{	
		// find all matching elements in HTML
		var allElements = this.innerdiv.querySelectorAll(selector);

		// if howMany doesn't have a value, then we use a fallback value
		howMany = howMany || allElements.length;

		// loop through the elements
		for(var i = howMany - 1; i >= 0; i--) 
		{
			// grab each element,
			var el = allElements[i];
			
			// make sure it exists still?
			if (!el) continue;

			// and remove it
			Element.hide(el);
		}

		return allElements.length;
	}

	// restart the story without reloading the page
	restart() 
	{
		// notify we're restarting
		notify("story restarting", {story: this}, this.outerdiv);

		// clear everything
		this.clear(this.options["hidelength"]);

		// reset the story
		this.ink.ResetState();
		
		// and start it from the beginning
		this.continue();
	}

	jumpTo(knot)
	{
		this.clear();
		this.ink.ChoosePathString(knot);
		this.state = Story.states.idle;
		this.continue();
	}

	// resets the page's scroll position after an optional delay
	scrollUp(smooth = true)
	{
		this.outerdiv.scrollTo({
			top: 0,
			left: 0,
			behavior: (smooth ? "smooth" : "auto")
		});
	}


	// necessary to stop scroll from jumping once the player clicks a choice,
	// or removes any elements. height will automatically update after the
	// window is resized, or after a new element is added (if there aren't)
	// any other elements to add afterwards)
	setHeight(el)
	{
		// get current height
		let oldHeight = this.innerdiv.style.height || 0;
		
		// get new height from the bottom of the last story element
		// (if there isn't any, then the height is set to the window's)
		let bottomElement = el || this.innerdiv.lastElementChild;

		// if there are no elements, then we'll just give up now
		if (!bottomElement) return;

		// calculate the story's height based on the bottom edge
		// of the last element in the story div
		let newHeight = bottomElement ? 
			bottomElement.offsetTop + bottomElement.offsetHeight + parseFloat(window.getComputedStyle(bottomElement).marginBottom) : window.innerHeight;

		// if new height is less than the window's height,
		// then we'll just set it to the window's height
		newHeight = Math.max(newHeight, this.outerdiv.scrollTop + window.innerHeight);
		
		// and as long as the height's actually changed,
		if (newHeight != this.innerdiv.style.scrollHeight) 
		{
			// we finally update the story container's height
			this.innerdiv.style.height = newHeight + "px";
			
			// and notify about this update
			notify("story setheight", {story: this, old: oldHeight, new: newHeight}, this.outerdiv);
		}
	}

	// return the story's current state
	getState() 
	{
		return this.ink.state;
	}

	// forces the story to wait before starting, until after every patch
	// submitted here tells the story that it's ready. necessary since 
	// javascript won't wait on some code (especially code that imports or 
	// downloads files) before continuing-- it'll just keep going, and
	// let the files load in their own time. this way, we force the story
	// to wait until we've done everything we need to, and *then* we launch it
	waitForPatch(name)
	{
		// create an array if we don't already have one
		this.waiting = this.waiting || [];
		
		// and if our patch's name isn't in there yet,
		if (this.waiting.indexOf(name) === -1) 
		{
			// we add it
			this.waiting.push(name);
		}
	}

	// tell the story that this patch is done, allowing it to start
	// if there aren't any other pending patches
	patchReady(name)
	{
		// create an array if we don't already have one
		this.waiting = this.waiting || [];
		
		// cancel if our patch's name isn't in there
		if (this.waiting.indexOf(name) === -1) 
		{
			return this.start();
		}
		
		// remove the patch from the array
		removeFromArray(name, this.waiting);
		
		// and if there's nothing left in that list
		if (!this.waiting.length)
		{
			// we null it out so the browser doesn't 
			// need to keep it in memory,
			this.waiting = null;

			// and then we try to start our story
			
			this.start();
		}
	}
}


// ================================================
// QUEUE
// ================================================
// class responsible for storing and rendering all the ink text
// you push your text and choices into here, adding custom classes, 
// delays, callbacks, etc. and then you call render() to show it all

class Queue
{
	// called when you create an object from this class
	constructor(story, initialDelay) 
	{
		// we mark which story this queue belongs to, for convenience
		this.story = story;

		// do this to set initial values
		this.reset(initialDelay);
		
		// determines whether or not the story should keep showing text until 
		// it finds a choice, or if it should wait for input after every line
		// useful for visual novel type games
		this.lineByLine = false;

		// and then we tell all the functions in this class that "this" 
		// should apply to the queue object, and not the queue class
		bindFunctions(this);
	}

	// empties out the queue
	reset(initialDelay)
	{
		// clear queue of elements
		this.clear();

		// clear delay, and set it to a new value
		this.setDelay(initialDelay);

		// mark down how many elements are on the page right now, 
		// so we can do a partial clear later
		this.pageElements = this.story.innerdiv.childNodes.length;
	}

	// remove old elements from the queue
	clear()
	{
		notify("queue clear", {queue: this, old: this.contents}, this.story.outerdiv);

		// by declaring a new empty array
		this.contents = [];
	}

	// set the initial delay for when we start rendering each line
	setDelay(delay = this.story.options["passagedelay"])
	{
		
		// if the delay isn't a number,
		if (isNaN(delay))
		{
			// then stop here
			return;
		}
		
		// notify about it
		notify("queue setdelay", {new: delay, old: this.delay, queue: this}, this.story.outerdiv);

		// otherwise, update the delay
		this.delay = parseFloat(delay);
		this.initialDelay = parseFloat(delay);
	}

	// determine whether we should wait for input after every line, or keep
	// rendering until we find a choice
	setLineByLine(bool) 
	{
		// notify about this
		notify("queue setlinebyline", {value: bool, queue: this}, this.story.outerdiv);

		// set value in queue for later elements
		this.lineByLine = bool;

		// then try to update the latest element, 
		// so the game won't render past that
		this.setProperty("continueAfter", !bool);
	}

	// helper function to calculate the exact delay between two elements 
	// if you include the first element, then it will include the queue's
	// initial delay-- otherwise, it'll just be the length from the start
	// of element one to the start of element two
	sumDelay(start = 0, end = this.contents.length - 1)
	{
		// get the initial delay
		var sum = (start == 0 ? this.initialDelay : 0);

		// if the start is less than the end, aaaand
		// if the last element exists,
		if (start < end && this.contents[end])
		{
			// then we loop through them
			for (var i = start; i < end; i++)
			{
				// and increment the sum
				sum += this.contents[i].delay;
			}
			// aaand return the total
			return sum;
		}	
	}

	// add a new element to the queue, so we can render it later
	// returns index of element in queue in case you need to reference it later?
	// not sure why you would, but, y'know, theoretically
	push(el)
	{
		// mark that this element belongs to its queue, in case of multiple 
		// queues which... i haven't explicitly designed for, but i've avoided
		// designing *against*, in case people want to use multiple queues?
		el.parent = this;
		// mark down the index,
		el.index = this.contents.length;
		// set the current line delay now in case that value changes later
		el.delay = (el.index ? this.story.options["linedelay"] : 0);
		// note if we should we render the next line automatically
		el.continueAfter = !this.lineByLine;
		// add callbacks container
		el.callbacks = {};
		// also mark the previous and next elements for convenience
		if (this.contents.length)
		{
			this.contents[this.contents.length - 1].next = el;
			el.previous = this.contents[this.contents.length - 1];
		}
		// and finally mark that this element is queued
		el.state = Element.states.queued;

		// apply any text animation we have
		TextAnimation.apply(this.story, el, this.story.options.textanimation);

		// add element to the queue for later rendering
		this.contents.push(el);

		// notify that we've pushed the element
		notify("queue push", {element: el, queue: this}, this.story.outerdiv);
	}

	// adds a new class to the specified element
	// index defaults to most recent element in queue
	// useful for CSS styling
	addClass(className, index = this.contents.length - 1)
	{	
		// make sure the element and class exists
		if (this.contents[index] && className)
		{
			// notify,
			notify("element addclass", {element: this.contents[index], class: className, queue: this}, this.story.outerdiv);
			
			// and apply the class
			this.contents[index].classList.add(...className);
		}
	}

	// adds a delay before showing the specified element
	// index defaults to most recent element in queue
	addDelay(delay, index = this.contents.length - 1)
	{
		// ensure we're actually using a number here
		if (isNaN(delay))
		{
			// if not, cancel by returning
			return;
		}
		// make sure there are elements in the queue
		else if (this.contents.length) 
		{
			// if the specified element exists,
			if (this.contents[index])
			{
				// notify,
				notify("element adddelay", {element: this.contents[index], delay: delay, story: this.story, queue: this});
				
				// and update the delay
				this.contents[index].delay += delay;
			}
		}
		// if not, 
		else
		{
			// update our initial queue delay
			this.setDelay(this.delay + delay);
		}
	}
	
	setProperty(property, value, index = this.contents.length - 1)
	{
		// convert the property to a string, because otherwise the logic
		// gets really annoyingly verbose otherwise. 
		// if you don't know what any of that means then... yeah honestly 
		// that's fine, don't worry about it. just take pride in the fact 
		// you're probably much more interesting than me
		property = property.toString();

		// check that we can actually set that property
		if (property && typeof value !== undefined && this.contents[index])
		{
			// notify,
			notify("element setproperty", {element: this.contents[index], story: this.story, property: property, new: value, old: this.contents[index][property], queue: this}, this.story.outerdiv);

			// and update
			this.contents[index][property] = value;
		}
	}

	// fires a function once the specified element is added to the story div
	// index defaults to most recent element in queue
	onAdded(callback, index = this.contents.length - 1)
	{
		// make sure element exists
		if (this.contents[index] && this.contents[index].callbacks) 
		{
			// set the callback
			Element.addCallback(this.contents[index], "onAdded", callback.bind(this, index));
		}	
	}

	// fires a function once the specified element starts fading in
	// index defaults to most recent element in queue
	onShow(callback, index = this.contents.length - 1)
	{
		// make sure element exists
		if (this.contents[index] && this.contents[index].callbacks) 
		{
			// set the callback
			Element.addCallback(this.contents[index], "onShow", callback.bind(this, index));
		}	
	}

	// fires a function once the element is fully visible
	// index defaults to most recent element in queue
	onRendered(callback, index = this.contents.length - 1)
	{
		// make sure element exists
		if (this.contents[index] && this.contents[index].callbacks) 
		{
			// set the callback
			Element.addCallback(this.contents[index], "onRendered", callback.bind(this, index));
		}	
	}

	// fires a function once the element starts fading out
	// index defaults to most recent element in queue
	onHide(callback, index = this.contents.length - 1)
	{
		// make sure element exists
		if (this.contents[index] && this.contents[index].callbacks) 
		{
			// set the callback
			Element.addCallback(this.contents[index], "onHide", callback.bind(this, index));
		}	
	}

	// fires a function right before the element is removed
	// index defaults to most recent element in queue
	onRemove(callback, index = this.contents.length - 1)
	{
		// make sure element exists
		if (this.contents[index] && this.contents[index].callbacks) 
		{
			// set the callback
			Element.addCallback(this.contents[index], "onRemove", callback.bind(this, index));
		}
	}

	// renders all elements to the HTML
	// target defaults to storyContainer
	// doesn't automatically clear the queue afterwards
	render(target = this.story.innerdiv)
	{
		// mark down how many elements are on the page right now, 
		// so we can do a partial clear later
		this.pageElements = (target.childNodes || []).length;
		
		// don't try to render if there's nothing to render
		if (!this.contents.length) return;

		if (target && target.firstElementChild && target.firstElementChild.state == Element.states.clearing)
		{
			Element.addCallback(target.firstElementChild, "onRemove", () => { this.render(target)});
			return;
		}
		// notify
		notify("render start", {story: this.story, queue: this, target: target}, this.story.outerdiv);

		// we only do this next bit once per loop, in case the queue is called 
		// a few times due to interrupts (or bugs, sorry, i'm doing my best)
		if (this.contents[0].state == Element.states.queued)
		{
			// once the last element is rendered,
			this.onRendered(() => 
			{
				// and notify that the render is done
				notify("render finished", {story: this.story, queue: this, target: target}, this.story.outerdiv);
			});
		}

		this.onAdded(() => this.story.innerdiv.style.height = "auto");

		// loop through all the elements,
		for (var i = 0; i < this.contents.length; i++) 
		{
			// check if the element has started rendering yet
			if (this.contents[i].state >= Element.states.rendering || this.contents[i].state <= Element.states.clearing)
			{
				// if so, skip
				continue;
			}

			// add the element to the HTML
			target.appendChild(this.contents[i]);
			
			// notify, fire off callbacks, and start animation
			Element.added(this.contents[i]);
			
			// if that element says we should stop after,
			// and that element isn't a choice,
			if (!this.contents[i].continueAfter && !this.contents[i].classList.contains("choice"))
			{
				this.story.setHeight(this.contents[i]);

				// notify that the render didn't complete
				notify("render interrupted", {story: this.story, queue: this, index: i, target: target}, this.story.outerdiv);

				// then we reset the queue's current delay once that last element is done
				this.onRendered(function() 
				{ 
					this.setDelay();
				}, i);
				
				// and stop here, until render gets called again
				return;
			}
		}
	}
}


// ================================================
// ELEMENT
// ================================================
// small helper class for handling elements (i.e. lines, images, etc.)

class Element
{
	// list of states an element can be in
	// so we can test what an element is doing from anywhere
	static get states () 
	{ 
		if (!this._states) 
		{
			this._states = {
				"clearing": -1,
				"queued": 0,
				"added": 1,
				"rendering": 2,
				"done": 3
			}
		}
		return this._states;
	};

	// called when an element is added
	static added(el)
	{
		// if the element's state says it's already added, then cancel
		if (el.state && el.state >= Element.states.added) return;

		// set the state to added
		el.state = Element.states.added;
		
		// hide the element
		el.style.opacity = 0;

		notify("element added", {element: el, story: el.parent.story, queue: el.parent}, el.parent.story.outerdiv);

		// call any callbacks
		if (el.callbacks.onAdded && el.callbacks.onAdded.length)
		{
			el.callbacks.onAdded.forEach((f) => f());
			// and then remove them, bc they take up memory i think?
			el.callbacks.onAdded = null;
		}
		
		// if a text animation has been applied,
		if (el.animation)
		{
			// call it now
			TextAnimation.effects[el.animation.added].added(el);
		}
		// otherwise,
		else
		{
			// we just call the show code
			Element.show(el);
		}
	}

	// called when we first start showing an element
	static show(el)
	{
		// set a timeout, waiting until it's this line's turn to appear
		setTimeout(() =>
		{			
			// if we've already started rendering, cancel
			if (!el || !el.parentNode || (el.state == Element.states.clearing || el.state >= Element.states.rendering)) return;
			
			// mark we're rendering
			el.state = Element.states.rendering;
			
			notify("element show", {element: el, story: el.parent.story, queue: el.parent}, el.parent.story.outerdiv);
			
			// then we do all the callbacks,
			if (el.callbacks.onShow && el.callbacks.onShow.length)
			{
				el.callbacks.onShow.forEach((f) => f());
				// remove those,
				el.callbacks.onShow = null;
			}
			
			// and if there's animation,
			if (el.animation)
			{
				// call that
				TextAnimation.effects[el.animation.show].show(el);
			}
			// otherwise,
			else
			{
				// restore the element's initial opacity value,
				el.style.opacity = "";
				
				// and run the rendered code
				Element.rendered(el);
			}

		}, el.parent.delay + el.delay);
		
		// (also, we update the queue's global delay with this line's value,
		// so the next line will have any relevant delays applied to it)
		el.parent.delay += el.delay;
	}

	// called once an element is done rendering
	static rendered(el)
	{
		// mark it's rendered
		el.state = Element.states.done;
		
		notify("element rendered", {element: el, story: el.parent.story, queue: el.parent}, el.parent.story.outerdiv);

		// do the callbacks,
		if (el.callbacks.onRendered && el.callbacks.onRendered.length)
		{
			el.callbacks.onRendered.forEach((f) => f());
			el.callbacks.onRendered = null;
		}

		// and call any animation
		if (el.animation)
		{
			TextAnimation.effects[el.animation.rendered].rendered(el);
		}
	}

	// called once we start hiding an element
	static hide(el)
	{
		// mark we're clearing it
		el.state = Element.states.clearing;
		
		if (el.parent)
		{
			notify("element hide", {element: el, story: el.parent.story, queue: el.parent}, el.parent.story.outerdiv);
		}

		// do the callbacks,
		if (el.callbacks && el.callbacks.onHide && el.callbacks.onHide.length)
		{
			el.callbacks.onHide.forEach((f) => f());
			el.callbacks.onHide = null;
		}

		// and apply animation
		if (el.animation)
		{
			TextAnimation.effects[el.animation.hide].hide(el);
		}
		else
		{
			Element.remove(el);
		}
	}

	// called to process an element before we remove it,
	// and then also remove that element, yes
	static remove(el)
	{
		// if the element after this one is clearing, but hasn't been removed 
		// yet, we're going to wait for that, and try again once it's done
		if (el.next && el.next.parentNode) 
		{
			el.readyToRemove = true;
			return;
		}

		if (!el.parentNode) return;
		
		clearTimeout(el.transition);

		el.parentNode.removeChild(el);
		
		if (el.parent)
		{
			notify("element remove", {element: el, story: el.parent.story, queue: el.parent}, el.parent.story.outerdiv);
		}
		
		// fire any callbacks bound to el element
		if (el.callbacks && el.callbacks.onRemove && el.callbacks.onRemove.length)
		{
			el.callbacks.onRemove.forEach((f) => f());
			el.callbacks.onRemove = null;
		}

		if (el.previous && el.previous.readyToRemove && el.previous.parentNode)
		{
			Element.remove(el.previous);
		}
	}	

	static addCallback(element, type, callback, unshift = false)
	{
		element.callbacks = element.callbacks || {};
		element.callbacks[type] = element.callbacks[type] || [];
		if (unshift)
		{
			element.callbacks[type].unshift(callback);
		}
		else
		{
			element.callbacks[type].push(callback);
		}
	}
}


// ================================================
// TAGS
// ================================================
// class responsible for getting and processing tags,
// (except for tags that you define in the parser class)

class Tags
{
	// we have to do something like this because safari doesn't
	// support static variables in classes yet >:[
	// basically it just gets the dictionary of functions, 
	// but it'll create one first if it doesn't already exist
	static get functions () 
	{ 
		if (!Tags._functions) Tags._functions = {};
		return Tags._functions;
	};

	// function executed once the story detects that tag
	static add(string, callback)
	{	
		// notify about it
		notify("tags add", {name: string, function: callback});

		// and then add the tag to our dictionary
		Tags.functions[string] = callback;
	}

	// take each tag and decide what to do with it
	static process(story, inputString, isAfterText)
	{
		// if there's no tag, then obviously let's stop here
		if (!inputString) return;
		
		notify("tags process", {story: story, tag: inputString}, story.outerdiv);

		// detect and handles tags of the form "#X" or "#X: Y"
		var splitTag = splitAtCharacter(inputString, ":");
		
		// make sure that there's still a tag?
		// not sure if this is necessary but i'm leavin' it
		if(splitTag)
		{
			// if we've bound a function to that tag,
			if (Tags.functions[splitTag.before])
			{
				// notify about it,
				notify("tags matched", {story: story, tag: splitTag.before, property: splitTag.after}, story.outerdiv);
				// then execute it
				Tags.functions[splitTag.before](story, splitTag.after, isAfterText);
			}
			// otherwise, we check if that value exists in our tag variables
			else if (story.options[splitTag.before])
				{
					// make sure we convert it
					switch (typeof story.options[splitTag.before])
					{
						case "string":
							break;
						
						case "number":
							splitTag.after = parseFloat(splitTag.after);
							break;
						
						case "boolean":
							splitTag.after = !!splitTag.after;
							break;
						
						default:
							splitTag.after = undefined;
					}

					if (splitTag.after !== undefined && splitTag.after !== NaN)
					{
						notify("tags option", {story: story, variable: splitTag.before, new: splitTag.after, old: story.options[splitTag.before]}, story.outerdiv);
						// if so, we update the variable
						story.options[splitTag.before] = splitTag.after;
					}
					else
					{
						console.warn("You tried to change option \"" + splitTag.before + "\", via a tag, but it's not a string, number, or boolean.");
						notify("tags unhandled", {tag: splitTag.before, property: splitTag.after}, story.outerdiv);
					}
				}
			// if not, 
			else if (!(splitTag.before in Tags.functions || splitTag.before in Parser.tags))
			{
				// we notify,
				notify("tags unhandled", {tag: splitTag.before, property: splitTag.after}, story.outerdiv);
			}
		}
	}
}

// ===================================
// INK TAGS
// ===================================
// a list of all the tags that the engine will recognise and process,
// once the story reaches a tag, tags will execute the bound function
//
// more tags can be bound by using style.tag(tagName, function) for tags that 
// style the story text, and tags.add(tagName, function) for everything else

// -----------------------------------
// class
// -----------------------------------
// add a CSS class or classes (separated by spaces) to the last queued element
//
// #class: class

Tags.add("class", 
			function(story, property) 
			{
				// don't do anything if the class is empty
				if (!property) 
					return;
				
				// if there's multiple classes separated by spaces, 
				// add all of them to the element
				story.queue.addClass(property.split(" "));				
			});

// -----------------------------------
// image
// -----------------------------------
// adds an image to the story container
// filetype will default to defaultImageType if none is given
//
// #image: file, or
// #image: file.png

Tags.add("image", 
			function(story, property)
			{
				// make sure a file name was provided
				if (typeof property !== "string" || !property.trim())
				{
					warn.warn("(#image) no file was provided.");
					return;
				}
				
				// create the element
				var imageParagraph = document.createElement("p");
				imageParagraph.className = "image"
				var imageElement = document.createElement("img");

				imageParagraph.appendChild(imageElement);

				// if the image provided isn't a URL,
				if (!property.startsWith("http"))
				{
					// ensure our file has a file extension
					property = addFileType(property, story.options.defaultimageformat, story.options.defaultimagelocation);
				}

				// tell the element to display our file
				imageElement.src = property;

				imageElement.addEventListener("mousedown", (event) => event.preventDefault());

				// make sure the user can't drag it
				// and then queue it up to display later
				story.queue.push(imageParagraph);
			});

// -----------------------------------
// background
// -----------------------------------
// sets background of page to the given image
// filetype will default to defaultImageType if none is given
// 
// #image: file, or
// #image: file.png

Tags.add("background",
			function(story, property)
			{
				// make sure a file name was provided
				if (typeof property !== "string" || !property.trim())
				{
					// remove remove background
					story.outerdiv.style.backgroundImage = "";
					return;
				}

				property = addFileType(property, story.options.defaultimageformat, story.options.defaultimagelocation);

				// if no property is provided, then clear the background
				story.outerdiv.style.backgroundImage = "url("+property+")";
			});

// -----------------------------------
// clear
// -----------------------------------
// clears everything from the page, and cancels any scheduled
// elements that were about to appear on the page

Tags.add("clear",
		function(story)
		{	
			// if we have any elements in the queue, we schedule a partial clear
			if (story.queue.contents.length)
			{			
				// so, when the element is added, 
				story.queue.onAdded(function(index, queue = this)
				{
					// then add a delay before the next element, so the fade looks seamless
					story.queue.setProperty("continueAfter", false, index);
					story.queue.onRemove(function() { story.queue.render() }, index);
				});

				story.queue.onRendered(function(index, queue = this) 
				{
					// wait until our element's displayed
					setTimeout(function()
					{
						// do a partial clear, removing this and all earlier 
						// elements on the page, (adding one to offset) the
						// fact that arrays in javascript start at zero, rather
						// that one, as is the standard in most programming languages
						story.clear(story.options["hidelength"], queue.pageElements + index + 1);
					
					}, story.options["linedelay"]);
				});			
			}
			// otherwise if the queue's empty,
			else
			{
				story.clear(story.options["hidelength"]);
			}
		});

// -----------------------------------
// restart
// -----------------------------------
// starts the story over from the beginning

Tags.add("restart",
		function(story)
		{
			// clear the story container, restart everything
			story.restart();
		});

// -----------------------------------
// delay
// -----------------------------------
// if the tag is on the same line as some text, then it will add a delay 
// before that text is rendered. otherwise, if the line only has tags and
// no text, then it add a delay before the *next* line is rendered
//
// 		line #delay: 1000
// 
// to delay line for one second
//
// 		#delay: 2000
// 		line
//
// to delay line for two seconds

Tags.add("delay",
		function(story, property, afterText)
		{
			// make sure it's a number, first of all. then,
			if (!isNaN(property))
			{
				// if we're calling this after we've queued up our text,
				if (afterText)
				{
					// we delay it normally,
					story.queue.addDelay(parseFloat(property));
				}
				// but if we're calling it *before* we queue our text
				else
				{
					// as far as i'm concerned, at least,
					// it wouldn't read intuitively to have #delay the previous 
					// line, only the same line, or the next line

					// so we wait for the next element to be pushed,
					story.outerdiv.addEventListener("queue push", () => {
						// and we delay that
						story.queue.addDelay(parseFloat(property));
					}, {once: true});
				}
			}
		});
	
// -----------------------------------
// line by line 
// -----------------------------------
// causes the engine to wait for input after every line
// useful for VN style games
// 
// #linebyline 
// will toggle it on and off,
// or you can be more explicit, with
// #linebyline: true
// and
// #linebyline: false
// 
// requires some sort of function to handle restarting the render via an input 

Tags.add("linebyline",
		function(story, property)
		{
			// if nothing was provided, then we toggle it
			if (typeof property === "undefined")
			{
				story.queue.setLineByLine(!story.queue.lineByLine)
			}
			else
			{	// otherwise, update linebyline
				// anything other than "true" is considered false
				story.queue.setLineByLine(property.trim() === "true");
			}
		});

// ================================================
// PARSER
// ================================================
// class to process the text and tags of each line, and execute functions that 
// alter that text, or call functions elsewhere, depending on what it finds

class Parser
{
	// a list of tags and their associate functions
	static get tags () 
	{ 
		if (!Parser._tags) Parser._tags = {};
		return Parser._tags;
	};
	
	// a list of patterns and their associate functions
	static get patterns () 
	{ 
		if (!Parser._patterns) Parser._patterns = [];
		return Parser._patterns;
	};

	static get element ()
	{
		if (!Parser._element) Parser._element = document.createElement("span");
		return Parser._element;
	}
	
	static set element (value)
	{
		Parser._element = value;
	}

	// in the same style as the tags class, this will bind a tag to our 
	// parser class, that'll execute the callback if a line contains that tag
	static tag(tag, callback)
	{
		notify("parser add tag", {tag: tag, function: callback});
		Parser.tags[tag] = callback;
	}

	// binds a function to be executed if our line contains the given pattern
	// that pattern can either be some text, or a regular expression
	static pattern(pattern, callback)
	{
		notify("parser add pattern", {pattern: pattern, function: callback});
		Parser.patterns.push({matcher: pattern, callback: callback});
	}

	// process a string or an element, applying tags and patterns, before
	// returning the updated result
	static process(story, text, tags = [])
	{			
		// cancel if we didn't submit anything
		if (!text) return;

		// create an object to store our line in
		var line = {text: text, tags: tags, classes: []}
		
		// notify, you know the drill
		notify("parser process", {line: line}, story.outerdiv);

		// if we submitted tags, and tags exist to style with,
		if (line.tags.length && Object.keys(Parser.tags).length)
		{
			// process each
			line.tags.forEach(function(tag)
			{
				// split up the tag into tag and property
				tag = splitAtCharacter(tag, ":");

				// if the tag exists in our tags,
				if (tag.before in Parser.tags)
				{
					// notify about the tag and function
					notify("parser matched tag", {tag: tag.before, arguments: tag.after, function: Parser.tags[tag.before], line: line}, story.outerdiv);
					
					// then we process our line with the tag
					Parser.tags[tag.before](line, tag.before, tag.after);
				}
			});
		}

		// if the element has text inside, and there are patterns to match with,
		if (line.text && Parser.patterns.length)
		{
			// go through them all,
			Parser.patterns.forEach(function(pattern)
			{
				// and... okay this is a long line, but we're checking if we 
				// should execute the pattern's function by checking if it
				// actually matches first with the line
				if (typeof pattern.matcher === "string" && line.text.includes(pattern.matcher) || pattern.matcher == RegExp(pattern.matcher) && line.text.match(pattern.matcher))
				{
					// notify here
					notify("parser matched pattern", {pattern: pattern.before, function: Parser.tags[pattern.before], line: line, tags: line.tags}, story.outerdiv);

					// if so, we update the element
					pattern.callback(line);
				}
			});
		}

		// if our tags or patterns applied classes, then
		// we update the line's text now
		if (line.classes.length)
		{
			// we grab a reusable element so we don't have to create
			// like four new ones every line,
			// and reset its class list 
			Parser.element.classList = [];
			
			// then we set the contents to our string
			Parser.element.innerHTML = line.text;
			
			// aaaand add all the classes we found
			Parser.element.classList.add(...line.classes);

			// then we set the line's text to that
			line.text = Parser.element.outerHTML;
		}
		
		// finally, notify,
		notify("parser done", {line: line}, story.outerdiv);
		
		// and return the results
		return line.text;
	}
}


// ================================================
// TEXT ANIMATION
// ================================================
// class used to create and apply text animations and transitions

class TextAnimation
{
	// list of effects
	static get effects () 
	{ 
		if (!TextAnimation._effects) TextAnimation._effects = {};
		return TextAnimation._effects;
	};

	// the default effect
	static get default ()
	{
		if (!TextAnimation._default) 
			TextAnimation._default = "";
		return TextAnimation._default;
	}

	// the default effect again
	// there is an easier way to write this
	// but safari doesn't like it
	static set default (value)
	{
		TextAnimation._default = value;
	}

	// add a new animation
	static add(string, effect)
	{
		// if there's no default yet,
		if (!TextAnimation.default)
		{
			// set it now
			TextAnimation.default = string;
		}

		// notify,
		notify("textanimation create", {name: string, effect: effect});

		// and file it away
		TextAnimation.effects[string] = effect;
	}

	// apply that animation to a line
	static apply(story, element, effect)
	{
		// if we didn't submit an effect,
		if (!effect)
		{
			// set the effect to the default
			effect = TextAnimation.default;
		}

		// as long as we have an element, and the effect exists,
		if (element && TextAnimation.effects[effect])
		{
			// notify we're applying it,
			notify("textanimation apply", {element: element, name: effect, effect: TextAnimation.effects[effect]}, story.outerdiv);		

			// and set the transitions as a property for that element
			element.animation = {
								added: effect,
								show: effect,
								rendered: effect,
								hide: effect,
							};
			// (we're using an object here instead of a string so people can
			// mix and match effects if they want? idk, didn't want to limit it)
		}
	}
}

// define an empty text animation
TextAnimation.add("none", 
	{
		options: { },
		
		added: function() 
		{
			Element.show(this);
		},

		show: function() 
		{
			Element.rendered(this);
		},

		rendered: function()
		{

		},

		hide: function() 
		{
			Element.remove(this);
		},
	}
);

// and a gentle fade in
TextAnimation.add("fade", 
	{
		options: {},
		
		// called after the element is added
		added: function(el) 
		{
			// set its opacity to zero
			el.style.opacity = 0;
	
			// then call the regular show code
			Element.show(el);
		},

		// called after the element is first shown
		show: function(el)
		{
			// if we can transition, then do
			transition(el, "opacity", "", el.parent.story.options.showlength + "ms ease", "0ms").then(() => 
			{
				Element.rendered(el);
			});
		},

		// called once the element is fully visible
		rendered: function(el) 
		{
			
		},

		// called once we begin clearing the element
		hide: function(el) 
		{
			// if we can fade out, then do
			transition(el, "opacity", 0, el.parent.story.options.hidelength + "ms", "0ms").then(() => 
			{ 
				Element.remove(el); 
			});
		},
	}
);


// ================================================
// EXTERNAL FUNCTIONS
// ================================================
// class used to create and bind external functions to your ink story,
// that can then be called from inside your ink

class ExternalFunctions
{
	static get functions () 
	{ 
		if (!ExternalFunctions._functions) ExternalFunctions._functions = {};
		return ExternalFunctions._functions;
	};

	static set functions (value)
	{
		ExternalFunctions._functions = value;
	}

	static add(id, func)
	{
		ExternalFunctions.functions[id] = func;
	}

	static get(id)
	{
		return ExternalFunctions.functions[id];
	}

	static bind(story, id)
	{
		var externalFunction = ExternalFunctions.get(id) || window[id];
		if (externalFunction)
		{
			story.ink.BindExternalFunction(id, externalFunction.bind(story));
		}
	}

	static clear()
	{
		ExternalFunctions.functions = {};
	}
}

// set a simple flag to check if we're on a mobile browser
window.isMobile = (() => {
	var result = false;
	if (window.PointerEvent && ('maxTouchPoints' in navigator)) {
	  // if Pointer Events are supported, just check maxTouchPoints
	  if (navigator.maxTouchPoints > 0) {
		result = true;
	  }
	} else {
	  // no Pointer Events...
	  if (window.matchMedia && window.matchMedia("(any-pointer:coarse)").matches) {
		// check for any-pointer:coarse which mostly means touchscreen
		result = true;
	  } else if (window.TouchEvent || ('ontouchstart' in window)) {
		// last resort - check for exposed touch events API / event handler
		result = true;
	  }
	}
	return result;
  })();
ExternalFunctions.add("isMobile", () => { return window.isMobile });

// ================================================
// SHORTCUTS
// ================================================
// simple class that lets you create new keyboard shortcuts by pairing
// a key with a snippet of code to run when it's pressed

class Shortcuts
{
	// create somewhere to store all the shortcuts
	static get callbacks()
	{
		if (!Shortcuts._callbacks) Shortcuts._callbacks = {};
		return Shortcuts._callbacks;
	}

	// binds a shortcut, using a text identifier, a function, 
	// and an optional "type" of callback. keydown and keyup are probably
	// the important ones, but you could theoretically use others!
	// googling that has been left as an exercise to the reader
	// 
	// see here for the key values: https://keycode.info/
	// (you want the event.key value, wrapped in double quotes)
	// so space would be " ", 9 would be "9", shift would be "Shift",
	static add(string, callback, type = "keydown")
	{
		// makes we have containers to put this in
		Shortcuts.callbacks[type] = Shortcuts.callbacks[type] || {};
		Shortcuts.callbacks[type][string] = Shortcuts.callbacks[type][string] || [];

		// notify about this
		notify("shortcuts add", {string: string, callback: callback, type: type});

		// set the callback
		Shortcuts.callbacks[type][string].push(callback);
	}

	// remove a shortcut
	static remove(string, type = "keydown")
	{
		// if there's nothing to remove,
		if (!Shortcuts.callbacks[type] || !Shortcuts.callbacks[type][string])
		{
			// then cancel
			return;
		}
		
		// otherwise notify,
		notify("shortcuts remove", {string: string, callback: callback, type: type});
		
		// and remove the shortcut from the dictionary
		delete Shortcuts.callbacks[type][string];
	}

	// process input, and decide whether to process that shortcut
	static process(type, input, event)
	{
		// if nothing exists, 
		if (!Shortcuts.callbacks[type] || !Shortcuts.callbacks[type][input])
		{
			// stop here
			return;
		}

		// notify,
		notify("shortcuts process", {type: type, input: input, event: event});

		// and call the function
		Shortcuts.callbacks[type][input].forEach((callback) => callback(event));
	}
}

// you can check to see if other keys are held by accessing the event object
// which is passed to the bound function. event type defaults to keydown, which 
// triggers when a key is pressed, but you can also specify keyup for when 
// a key is released (you can also probably support any kind of event 
// through this, as long as you add event listeners, as below)

// when any key is pressed, check if we should run a function
window.addEventListener("keydown", function (event) 
{
	if (!event.repeat)
	{
		Shortcuts.process("keydown", event.key, event);
	}
	else
	{
		Shortcuts.process("keyheld", event.key, event);
	}
});

// when any key is released, check if we should run a function
window.addEventListener("keyup", function (event) 
{
	Shortcuts.process("keyup", event.key, event);
});

// used to add and apply patches to this engine
class Patches
{
	static get patches () 
	{ 
		if (!Patches._patches) Patches._patches = [];
		return Patches._patches;
	};

	static set patches (value)
	{
		Patches._patches = value;
	}

	// function called in patch files to modify and extend this engine
	// a function is submitted (callback), and once options and credits 
	// are stored for later, we fire that callback and apply its code
	// (to be clear, some patch code may run before now, if it doesn't
	// live inside the call to story.patch in the project file. the code
	// that is included there is put there to ensure it's called once
	// the story object is fully built, and everything else is ready
	static add(callback, patchOptions, credits)
	{
		Object.assign(options, patchOptions);

		Patches.patches.push({
								callback:callback, 
								credits:credits,
							});
	}


	static credit()
	{
		if (Patches.printed) return;

		// then we print all the patch attribution stuff here
		throwIntoVoid(console.groupCollapsed, "🧵 Patches");
		for (var patch in this.patches) 
		{ 
			credit(this.patches[patch].credits); 
		}
		throwIntoVoid(console.groupEnd);

		Patches.printed = true;
	}

	static apply(story, content)
	{
		for (let patch of Patches.patches)
		{
			// if we have a blacklist of patches, we skip binding those
			// to this story. idk if this is useful but hey whatever
			if (patch.credits && patch.credits.name)
			{
				// if you've gone out of your way to blacklist this patch for this story, then cancel
				if (story.excludePatches && patch.credits.name in story.excludePatches) 
				{
					continue;
				}
			}

			// if we have a function to call
			if (patch.callback)
			{
				// then we do that now
				patch.callback.bind(story, content)();
			}
		}

		Patches.credit();
	}
}


// ================================================
// HELPER FUNCTIONS
// ================================================
// assorted functions used in this file and patch files

// a function to grab a text file (asynchronously) and return its contents
function fetchText(fileName)
{
	return new Promise((resolve, reject) =>
	{
		// grab the file
		fetch(fileName)
		.then(response => 
		{
			// then grab that file's contents
			return response.text();
		}).then(text => 
		{
			// return it
			resolve(text)
		});
	});
}

// a function that takes a credits object (from a patch, presumably) 
// and prints out a bunch of messages describing the patch. this is 
// kind of a messy function, but it's really important that it exists.
// properly crediting and including the licences of open source projects
// is an actual legal requirement, and chances are no one's going to chase
// you down if you forget, but this function will handle that all for you.
// the licences will neatly and compactly get printed to the developer console, 
// hidden inside a few folded groups of attribution and description 

// i'm honestly going to skip commenting this, it's messy and hopefully i can
// find a cleaner solution soon, but also i *really* don't want people tweaking
// this unless they know what they're doing
function credit(credits)
{
	const licences = {mit: MIT, isc: ISC, self: self}

	if (credits && credits.name)
	{
		throwIntoVoid(console.groupCollapsed, (credits.emoji ? credits.emoji + " " : "") + credits.name + (credits.version ? " %c[" + credits.version + "]": "%c"), "color: grey");
				
		if (credits.description)
		{
			if (typeof credits.description === "string")
			{
				print(credits.description);
			}
			else
			{
				credits.description.forEach((line) => print(line));
			}
		}
		
		if (credits.licences)
		{
			var licenceTypes = Object.keys(credits.licences).length;

			throwIntoVoid(console.groupCollapsed, (licenceTypes > 1 ? "Licences" : "Licence"));

			for (var type in credits.licences)
			{
				if (typeof credits.licences[type] === "string")
				{
					licence(type);
					continue;
				}

				for (var item in credits.licences[type])
				{	
					licence(type, item);
				}
			}
			throwIntoVoid(console.groupEnd);;					
		}

		throwIntoVoid(console.groupEnd);
	}

	function licence(type, item)
	{
		if (type != "self" || licenceTypes > 1)
		{
			throwIntoVoid(console.groupCollapsed, item || credits.name);
		}

		if (licences[type])
		{
			throwIntoVoid(console.log, licences[type](credits.licences[type][item] || ""));
		}
		else
		{
			throwIntoVoid(console.log, credits.licences[type][item]);
		}
		if (type != "self" || licenceTypes > 1)
		{
			throwIntoVoid(console.groupEnd);
		}
	}

	function print(line)
	{
		if (typeof line == "string")
		{
			throwIntoVoid(console.log, line);
		}
		else if (line.length)
		{
			throwIntoVoid(console.log.apply, line);
		}
	}

	function self()
	{
		return MIT(credits.licences.self + (credits.author ? " " + credits.author : ""));
	}

	function MIT(text)
	{
		if (!text) return;

		return 'Copyright (c) ' + text + '\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.'
	}

	function ISC(text)
	{
		if (!text) return;

		return 'Copyright (c) ' + text + '\n\nPermission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.\n\nTHE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITHREGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY ANDFITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSSOF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHERTORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OFTHIS SOFTWARE.'		
	}
}

// so there's this concept in javascript called "this". and "this" refers to 
// whatever created it, basically. or whatever thing is. calling it, or 
// whatever chunk of code it's in? except sometimes not. sometimes it's none of 
// those things, and it'll refer to something else. 
// look, i don't really understand it myself. point is, this function ensures 
// that for all of an object's functions, "this" will refer to that object. so 
// your story object's functions will treat "this" as a reference to that 
// story. which is neat!
function bindFunctions(target)
{
	// get the prototype of our target
	var prototype = Object.getPrototypeOf(target);

	// get all properties from that, and loop through them
	Object.getOwnPropertyNames(prototype).forEach(function(property)
	{
		// if they aren't our constructor, but they are a function,
		if (property != "constructor" && typeof Object.getOwnPropertyDescriptor(prototype, property).value == "function")
		{
			// bind our target to that function
			target[property] = target[property].bind(target);
		}
	});
};

// splits string at the first occurance of the given character
// useful for splitting up tags
function splitAtCharacter(text, character) 
{
	// if we don't have any text, return nothing?
	if (!text)
	{
		return;
	}

	// find first occurence of character
	var splitIndex = text.indexOf(character);

	// if the text doesn't contain that character,
	if (splitIndex == -1)
	{
		// return it
		return {
					before: text.trim().toLowerCase(),
				};
	}
	// otherwise, 
	else
	{		
		// return it, and the value after
		return {
					before: text.substr(0, splitIndex).trim(),
					after: text.substr(splitIndex+1).trim()
				};
	}
}

// convert's a tag's properties into options and values
// 
// for example,
//
// 		image:6, image2, image3.gif:4.5 >> height:0.2
//
// would return as
//
// 	{
// 		options: {height: "0.2"},
// 		value: [["image", "6"], ["image2"], ["image3.gif", "4.5"]],
// 	}
//
// which isn't a perfect format i'll admit it yeah 
// but it's easier to work with than plain text
function getTagOptions(text) 
{
	if (!text)
	{
		return {options: {}, text: text};
	}

	// if there's a ">>", the tag has a value as well as options
	if (text.indexOf(">>") !== -1)
	{
		// quickly declare options and update text using some magic syntax idk
		var {before: text, after: options} = splitAtCharacter(text, ">>");
	}
	
	// split up all the arguments into arrays of length x
	// where x = the number of ":"s (minus one)
	text = text.split(", ").map(item => item.split(":"));
	
	// if we have options,
	if (options) 
		// then we do something similar, but since the properties
		// don't necessarily need to be in order, we can convert it
		// to an object, which is easier to work with
		options = Object.fromEntries(options.split(", ")
									.map(item => item.split(":")));

	// then we return both (or one?) of these in an object
	return {options: options || {}, value: text}
}

// ensure that the text has a filetype
// passing it "file" and ".png" will return "file.png" 
// passing it "file.jpg" and any fallback will always return "file.jpg"
function addFileType(text, format, directory)
{
	// if there's no full stop in the text,
	// then there's no filetype specified,
	if (text.indexOf(".") == -1)
	{
		// so we append the default filetype
		text += format;
	}
	// and if there's no directory provided, 
	if (directory && !text.startsWith("./"))
	{
		// we add one, and clean up the file path
		text = ("./" + directory + "/" + text).replace("//", "/");
	}
	// and finally return the text
	return text;
}

// returns the file type for a string
// (will return everything after the first full stop)
function getFileType(text) 
{
	var i = text.indexOf(".");
	
	return (i !== -1 ? text.substr(i+1) : -1);
}

// quick helper function to remove a specific item from an array
// i've only used this in one place but it might be helpful for 
// myself or someone later so i split it off into its own function
function removeFromArray(item, array)
{
	// check if it has a position in the array
	var position = array.indexOf(item);
	if (position !== -1) 
	{
		// if so, remove it
  		array.splice(position, 1);
	}
}

// okay this is truly ridiculous
// used to set a transition and then immediately start that transition
// this shouldn't be necessary, but it sometimes is?
//
// example usage:
// element, "opacity", "initial", "500ms ease", "0ms"
// to transition element's opacity to its initial value over 500ms, with an ease
function transition(el, property, value, speed = "0ms", delay = "0ms") 
{  
	// so if we want to set an element's transition and then immediately apply 
	// that transition... obviously, the first step is to set that transition
	el.style.transition = property + " " + speed + " " + delay;
	
	// then we check the current value of our property, because this forces the
	// the browser to process us updating the transition? otherwise, it might
	// not be applied before our value is set, and no transition would happen
	window.getComputedStyle(el)[property];

	// then we apply the value,
	el.style[property] = value;

	// and return a promise to resolve once the transition is done
	return new Promise((resolve, reject) => 
	{
		// either using the usual, modern method
		el.ontransitionend = () => {
			if (el[property] != value) return;
			el.ontransitionend = null; 
			resolve()
		};
		// or a backup, because sometimes the one above just won't work
		setTimeout(resolve, (parseFloat(speed) || 0) + (parseFloat(delay) || 0));
	});
}

// simple function to ensure that a function isn't CONSTANTLY called, like 
// during resizing or scrolling. it'll only fire once debounce hasn't been 
// called in many milliseconds you specify in timeout (by default, 250) 
function debounce(callback, timeout = 250)
{
	// set a timer 
	var timer;
	return function() 
	{
		// clear the timeout
  		clearTimeout(timer);
		// and create a new one
		timer = setTimeout(callback, timeout);
	}
}

// speaking of,
window.addEventListener("resize", debounce(function()
{
	// notify that the window's resized, but only after
	// a reasonable delay to ensure it's not fired constantly
	notify("window resized");
}, 500));

// in javascript, you can tell a function to fire in response to an event
// and those events, conveniently, can be triggered right here. add the name of 
// your event as the first argument, and any data you might need as the second.
//
// 		{mood: "yelling", age: 6, type: "cat"}
//
// or something like that. wrap plain text in quote marks, but only for the 
// value. the key (that bit *before* each ":") shouldn't have any quotation 
// marks around it. these values can be changed by functions that are listening
// for this event, but only if those values are an object
//
// look basically this is like shooting up a flare? and other functions can 
// watch for that flare, and decide it's their turn to do something
// 
// this is important, though. by default, this will shoot a flare to the window,
// which is a global Thing that any javascript can reach. most notifys, though,
// target the outerdiv of a story, to target that story itself.
//
// to call code in response to an event, do something like this--
//
// window.addEventListener("addCharacterToParty", function(event) 
// {
//		console.log(event.details.cat);
//		(and then do other things here)
//		(the line above is not javascript. that's elliot typing words.)
// });
//
// and replace window.addEventListener with whatever target you have. so...
// story.outerdiv.addEventListener, or whatever
// 
// in some cases, you'll need to use (event) => {} instead of function(event) {}
// if you use the full function notation, it'll cause "this" to refer to the
// function. if you use the arrow thing, then "this" will still refer to
// whatever it did before you entered this function
// you can also use something like "cookFood.bind(this, true)"
// this will change the value of "this" inside the function to the first value
// included in bind, with any values after the first becoming arguments
// i wish it could be less complicated sorry y'all :[

function notify(name, details = {}, target = window)
{
	//  alert every other function that this happened
	target.dispatchEvent(new CustomEvent(name, { detail : details }));
	
	// and then print debug messages to the console
	// this'll only print debug messages if you're running this
	// on a local server, to ensure you don't accidentally
	// enable them in the live build, since spitting out
	// hundreds of debug messages can cause occasional frame drops

	if (options.debug && (window.location.protocol=="file:"))
	{
		// if you're testing animations or anything you need smooth
		// or fast, it might be worth temporarily commenting out
		// this next line, since, again, yeah, it can cause some stutters
		console.debug(name, details);
	}
}

// detaches a function from its current context, then runs it
// basically just used to print messages without a line number
function throwIntoVoid(func, ...parameters)
{
	setTimeout(func.bind(console, ...parameters));
}

// takes a function, a search regex, and a replacement string
// will return a new function which is a copy of the original,
// but with the replacement pasted in over top over the search
// every single person i talked to told me not to do this, but
// i went and did it anyway. please behave responsibly.
// (anything you inject at runtime will be less efficient than 
// a native function)
function inject(target, search, replacement, context)
{
	// if (target.startsWith("inkjs.")) return inkjs.inject(target, search, replacement, context);

	if (!target || !search) return;

	var newFunction = (eval(target) || "").toString();

	if (!newFunction) return console.error(target + " couldn't be found.")
	
	if (!search.test(newFunction)) return;
	
	newFunction = deconstructFunction(newFunction.replace(search, replacement));
	// to replace with new Function
	eval(target + " = function(" + newFunction.arguments + ") { " + newFunction.body + "}");
}

// returns the arguments and body of a function, for injecting code
// separated out as a helper function to help y'all test your regexes
function deconstructFunction(target) 
{
	var results = target.toString().match(/^.+\((.*)\)\s+{([^]*)}/i);
	return {arguments: results[1] || "", body: results[2] || ""};
}

// extension method for inkjs that returns the container 
// at the provided path string
inkjs.Story.prototype.ContainerAtPathString = function(path)
{
	let container = this.mainContentContainer;
	
	for (var name of path.split(".")) 
	{
		if (!container.namedContent.has(name)) return null;
		container = container.namedContent.get(name);
	}
	return container;
}

// extension method for inkjs that returns the array of content
// at the provided path string
inkjs.Story.prototype.ContentAtPathString = function(path)
{
	return this.ContainerAtPathString(path).content;
}

// returns the last item in a container in the form of {expression}
// where expression is truthy, a variable assignment, a native opertation, 
// a function call, etc. 
// the knot or stitch shouldn't include any text or diverts, only
// functions and a final return value wrapped in curly brackets ({})
// v much a hack, but necessary for cleanly organised storylets, 
// since you can't return a value from a stitch
inkjs.Story.prototype.EvaluateContainer = function(container)
{
	if (!container) return;

	let content = [].concat(container.content);
	let outputStream = [].concat(this.state._currentFlow.outputStream);

	// check if the container contains an expression, 
	// and if and where we should crop it
	let lastIndex;
	for(let i = container.content.length - 1; i >= 0; i--)
	{
		// commandType 1 (EvalOutput) will remove the value we want
		// from the evaluationStack, so we trim the array to stop that happening
		if(container.content[i].commandType === 1)
		{
			lastIndex = i;
			break;
		}
		lastIndex = -1;
	};
		
	if (lastIndex >= 0)
	{
		// crop the expression now so the result doesn't get removed
		// from the stack in the next step
		container.content.splice(lastIndex);
	}
	
	// then we evaluate it, and return that value from the stack
	let result = this.EvaluateExpression(container);
	
	this.state._currentFlow.outputStream = outputStream;
	container._content = content;

	if (result && result.value) return result.value;
	else return null;
}