// -----------------------------------
// force tags before line
// -----------------------------------
// if you have an ink story that was written for the vanilla web player, 
// then you've probably written your tags in a way that assumes 
// they'll all be processed before any text on that line. 
// if that's the case, and you don't want to edit your ink to run it in here, 
// then this will force all tags to be processed before the line

var credits = {
	emoji: "🧳",
	name: "Always process tags before text",
	author: "Elliot Herriman",
	version: "1.0",
	description: "Forces all tags to execute before each line, to ensure compatibility with stories written for the vanilla web player.",
	licences: {
		self: "2021",
	}
}

var options = { };

Patches.add(function()
{
	this.outerdiv.addEventListener("passage line processed", (event) =>
	{
		event.detail.line.tags.before = event.detail.line.before.concat(event.detail.line.tags.after);
		event.detail.line.tags.after = [];
	});

}, options, credits);

export default {options: options, credits: credits};