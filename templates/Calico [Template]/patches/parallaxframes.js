// -----------------------------------
// parallax frames
// -----------------------------------
// as used in winter (https://pizzapranks.itch.io/indiepocalypse-15)

// creates a box with one or more images layered inside. the images will move 
// around as the mouse does, and if there's more than one layer, it will create 
// a parallax effect. also works with touchscreen-y devices!
//
// #frame: image:6, image2, image3.gif:4.5 | height:0.2

var credits = {
	emoji: "💀",
	name: "Parallax frames",
	author: "Elliot Herriman",
	version: "1.0",
	description: "Binds a tag that creates a parallax effect from layered images.",
	licences: { self: "2021" }
}

var options = {}

// tracks the last known location of the mouse
var lastMousePosition;
// a list of all our frames
var framelist = [];

// necessary for frames to play nicely with ios when hosted on itch.io
// has something to do with the fact that itch hosts all games in a
// virtual webpage within a webpage (called an iframe)
if (window.isMobile) { document.addEventListener("touchmove", {}); }

// start watching mouse movements so we can parallax frames
window.addEventListener(window.isMobile ? "touchmove" : "mousemove", (event) =>
{
	// store mouse position for later
	lastMousePosition = event;						
	
	// if we have frames, move them
	if (framelist.length) 
	{
		// get half page width and height
		let width = window.innerWidth / 2;
		let height = window.innerHeight / 2;
		
		// update all the frames
		framelist.forEach((frame) => { updateFrame(frame, width, height) });
	}
});

function updateFrame(frame, width = window.innerWidth / 2, height = window.innerHeight / 2)
{
	// make sure the player's moved the mouse ever
	if (lastMousePosition)
	{
		// get our mouse position as a percentage
		var targetX = (width - lastMousePosition.pageX) / width; 
		var targetY = (height - lastMousePosition.pageY) / height;
		
		for (var i = 0; i < frame.layers.length; i++)
		{						
			// offset functions are expensive, and values only change when window resizes, so we keep track of whether we need to do this
			if (frame.dirty)
			{	
				// get the maximum distance we can travel on each axis
				var x = Math.abs(frame.layers[i].offsetWidth - frame.div.offsetWidth) / 2;
				var y = Math.abs(frame.layers[i].offsetHeight - frame.div.offsetHeight) / 2;

				// somehow a necessary check? it ensures that the frame 
				// won't be fed incorrect values (i.e. 9999-1) if this is
				// called before the frame is added to the story container
				if ((x != 0 || y != 0) && x > -9998 && y < 9998)
				{
					// subtract one so the edge of the image doesn't show up
					frame.stepX = x - 1;
					frame.stepY = y - 1;
					frame.dirty = false;
				}
			}
		
			// apply the offset
			// make targetx or targety negative to invert directions
			frame.layers[i].style.transform = "translateX(" + (targetX * frame.stepX * frame.layers[i].step) + "px) translateY(" + (targetY * frame.stepY * frame.layers[i].step) + "px)";
		};
	}
}

// tell each frame to update its layers if you resize the window
window.addEventListener("window resized", () => 
	{ 
		framelist.forEach((frame) => { frame.dirty = true; })
	});

// create tag handler for frame
Tags.add("frame", function(story, property)
{
	// create the frame, a list of its layers, a div to store it in,
	// and mark that we want to update it next loop
	var frame = {
		// list of all images in frame
		layers: [], 
		// html element corresponding to this frame
		div: document.createElement('p'), 
		// whether we should update values (expensive) next loop
		dirty: true, 
		// how far we can move in each direction
		step: 0,
	};

	frame.div.classList.add("frame");
	
	property = getTagOptions(property);

	if (property.options.height)
	{
		frame.div.style.height = property.options.height;
	}	
	
	// split the text into layer names
	for (let i = 0; i < property.value.length; i++)
	{
		// create the image element
		var layer = document.createElement('img');	
		
		// set how much each layer moves so we have a parallax
		if (property.value[i][1] && !isNaN(property.value[i][1]))
		{
			layer.step = 1 / parseFloat(property.value[i][1]);
		}
		else
		{
			layer.step = 1 / (i + 1);
		}

		// stop the player from being able to drag the image, since css only
		// solutions don't seem to work on firefox?
		layer.addEventListener("mousedown", (event) => event.preventDefault());

		// tell the CSS to style this as a frame layer
		layer.classList.add("frameLayer");

		// tell the layer to use our provided image, making sure it has a file type
		layer.src = addFileType(property.value[i][0], story.options.defaultimageformat, story.options.defaultimagelocation);
		
		// make sure it's rendered above the last layer
		layer.style.zIndex = i+1;
		
		// files away layer to handle later
		frame.layers.push(layer);
		
		// and add it to the frame's div
		frame.div.appendChild(layer);
	}

	// add it to our manager
	framelist.push(frame);
	
	// add the div to the queue
	story.queue.push(frame.div);
	// and tell the queue to update the frame's starting position
	// once the div is added to the page
	story.queue.onAdded(() => { updateFrame(frame); });
	// todo test if this even works
	// when it's cleared, we remove it from the frame manager
	story.queue.onRemove(() => { removeFromArray(frame, framelist); });
});

Patches.add(null, options, credits);

export default {options: options, credits: credits}
