import memorycard from "./memorycard.js"

// -----------------------------------
// persistent saves
// -----------------------------------

var credits = {
	emoji: "💽",
	name: "Autosave",
	author: "Elliot Herriman",
	version: "1.0",
	description: "Automatically save the story's state.",
	licences: {
		self: "2021",
	}
}

var options = 
{
	autosave_enabled: true,
};

Patches.add(function()
{
	this.outerdiv.addEventListener("passage start", (event) =>
	{
		if (this.options.autosave_enabled) memorycard.save(event.detail.story);
	});

	this.outerdiv.addEventListener("story restarting", (event) =>
	{
		if (this.options.autosave_enabled) memorycard.save(event.detail.story);
	});

	this.outerdiv.addEventListener("story ready", (event) =>
	{
		if (this.options.autosave_enabled) 
		{	
			memorycard.load(event.detail.story);
			
			this.outerdiv.addEventListener("render start", (event) =>
			{
				event.detail.queue.contents[0].delay = 0;
			}, {once: true});
		}
	});

}, options, credits);

export default {options: options, credits: credits};