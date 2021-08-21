// -----------------------------------
// keep track of the story's history
// -----------------------------------

var credits = {
	emoji: "📚",
	name: "History",
	author: "Elliot Herriman",
	version: "1.0",
	description: ["Helper patch that store a record of the player's choices as they play, allowing other patches to do things like save, rewind, or reload the game."],
	licences: {
		self: "2021",
	}
}

var options = {};

// go back one passage
function load(story, index, el, callback)
{	
	// make suer we have a history object
	story.history.choices = story.history.choices || [];

	var missedTags = [];
	
	// make sure we have choices
	// for some reason length was Always returning true
	// so we just check if the first element exists
	if (story.history.choices)
	{
		// cancel if we don't have a state to load
		if (index < 0 || index > story.history.choices.length) return false;
		
		// reset the story to the start
		story.ink.ResetState();
		
		// and restore the story's original seed, so any randomness 
		// this time will be the same as randomness last time
		story.ink.state.storySeed = story.history.initialSeed;
		
		// quickly catch up to where we were
		var choice;
		for (var i = 0; i < index; i++)
		{
			while (story.ink.canContinue)
			{
				story.ink.Continue();
				story.ink.state.currentTags.forEach((t) => missedTags.push(t));
			}
			
			choice = story.ink.currentChoices[story.history.choices[i]];
			
			if (!choice) break;
			
			story.ink.ChooseChoiceIndex(choice.index);
		}

		notify("story loaded state", {story: story, state: story.ink.state, lastChoice: choice, tags: missedTags}, story.outerdiv);

		// if it doesn't exist, cancel and start the story
		if (!el) 
		{
			story.state = Story.states.idle;
			story.continue();
			return;
		}
		
		// make sure the story can't continue until we're ready
		story.state = Story.states.locked;

		// set up a callback
		Element.addCallback(el, "onRemove", () => 
		{
			// reset our queue
			story.queue.reset();
			// mark that we can start a new loop
			story.state = Story.states.idle;
			// and continue
			story.continue();
		});

		callback();
	}
}

Patches.add(function()
{	
	// create our history object if it doesn't already exist
	this.history = this.history || {};
	// create a container for our history
	this.history.choices = [];
	// back up our story's initial seed
	this.history.initialSeed = this.ink.state.storySeed;

	this.outerdiv.addEventListener("story restarting", (event) => 
	{
		this.history.choices = [];
	});

	// at the end of each passage,
	this.outerdiv.addEventListener("passage end", (event) =>
	{
		// if we're in a rewound state,
		if (this.history.choices.length - 1 > this.ink.state.currentTurnIndex)
		{
			// remove all states from the end that we no longer need,
			this.history.choices.splice(this.ink.state.currentTurnIndex+1);
		}
		// then store it in our history
		this.history.choices.push(event.detail.choice.index);
	});	

}, options, credits);

export default {options: options, credits: credits, load: load};