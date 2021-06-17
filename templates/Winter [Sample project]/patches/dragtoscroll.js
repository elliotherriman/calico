// -----------------------------------
// click and drag to scroll
// -----------------------------------

var credits = 
{
	emoji: "🐁",
	name: "Drag to scroll",
	version: "1.0",
	description: ["Click and drag the page to scroll."],
	licences: {
		self: "2021 Elliot Herriman",
	}
}

var options = 
{
	// if false, will prevent dragging by scrolling vertically
	dragtoscroll_vertical: true,
	// if false, will prevent dragging by scrolling horizontally
	dragtoscroll_horizontal: false,
	// modifies how far the page scrolls relative to the mouse distance
	dragtoscroll_verticalmodifier: 0.9,
	dragtoscroll_horizontalmodifier: 0.9,
}

// where the mouse was at the start of the scroll
var mouseStartPos;

// fired when the player clicks, telling the page to allow drag scrolling
function dragMouseClick(story, event) 
{
	// set initial positions
	var divStartPos = {x: story.outerdiv.scrollLeft, y: story.outerdiv.scrollTop};
	mouseStartPos = {x: event.clientX, y: event.clientY};

	// define the function here so we can remove it later
	var dragMouse = dragMouseMove.bind(story, divStartPos);

	// update things when we move the mouse
	document.addEventListener('mousemove', dragMouse);
	// stop doing things when we release the drag
	document.addEventListener('mouseup', function()
		{ 
			document.removeEventListener('mousemove', dragMouse);
		});
};

// update scroll position each time the mouse moves
// removed once the mouse is unclicked
function dragMouseMove(divStartPos, event) 
{  
	if (!event.buttons == 1)
	{
		document.removeEventListener('mousemove', dragMouseMove);
		return;
	}

	if (this.options.dragtoscroll_vertical) 
	{
		this.outerdiv.scrollTop = (divStartPos.y - this.options.dragtoscroll_verticalmodifier * (event.clientY - mouseStartPos.y));
	}
	
	if (this.options.dragtoscroll_horizontal)
	{
		this.outerdiv.scrollLeft = (divStartPos.x - this.options.dragtoscroll_horizontalmodifier * (event.clientX - mouseStartPos.x));
	}
};

Patches.add(function()
{
	// bind handler for when you click 
	document.addEventListener('mousedown', (event) =>
	{
		dragMouseClick(this, event) 
	});
}, options, credits);

export default {options: options, credits: credits};