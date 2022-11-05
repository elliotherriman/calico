// -----------------------------------
// click and drag to scroll
// -----------------------------------

var credits = 
{
	emoji: "🐁",
	name: "Drag to scroll",
	version: "1.1",
	description: ["Click and drag the page to scroll."],
	licences: {
		self: "2021 Elliot Herriman",
	}
}

var options = 
{
	dragtoscroll_loadatstart: true,
	// if false, will prevent dragging by scrolling vertically
	dragtoscroll_vertical: true,
	// if false, will prevent dragging by scrolling horizontally
	dragtoscroll_horizontal: false,
	// modifies how far the page scrolls relative to the mouse distance
	dragtoscroll_verticalmodifier: 0.9,
	dragtoscroll_horizontalmodifier: 0.9,
}

// fired when the player clicks, telling the page to allow drag scrolling
function dragMouseClick(target, options, event) 
{
	// set initial positions
	var divStartPos = {x: target.scrollLeft, y: target.scrollTop};
	target.mouseStartPos = {x: event.clientX, y: event.clientY};

	// define the function here so we can remove it later
	var dragMouse = dragMouseMove.bind(null, target, options, divStartPos);

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
function dragMouseMove(target, options, divStartPos, event) 
{  
	if (!event.buttons == 1)
	{
		target.removeEventListener('mousemove', dragMouseMove);
		return;
	}

	if (options.dragtoscroll_vertical) 
	{
		target.scrollTop = (divStartPos.y - options.dragtoscroll_verticalmodifier * (event.clientY - target.mouseStartPos.y));
	}
	
	if (options.dragtoscroll_horizontal)
	{
		target.scrollLeft = (divStartPos.x - options.dragtoscroll_horizontalmodifier * (event.clientX - target.mouseStartPos.x));
	}
};

function Bind(target, options)
{
	target.mouseStartPos = {};

	// bind handler for when you click 
	target.addEventListener('mousedown', (event) =>
	{
		dragMouseClick(target, options, event) 
	});
}

Patches.add(function()
{
	if (!this.options.dragtoscroll_loadatstart) return;

	Bind(this.outerdiv, this.options);
	
}, options, credits);

export default {options: options, credits: credits, bind: Bind};