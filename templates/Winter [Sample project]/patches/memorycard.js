import history from "./history.js";
import storage from"./storage.js";

// -----------------------------------
// save story state across refreshes
// -----------------------------------

var credits = {
	emoji: "💾",
	name: "Memory Card (8 MB)",
	author: "Elliot Herriman",
	version: "1.0",
	description: "Enables saving and loading the game.",
	licences: {
		self: "2021",
	}
}

var options = {
	memorycard_applymostrecenttag: [],
	memorycard_format: "session",
}

function save(story, id = "save", format = story.options.memorycard_format)
{
	var save = Object.assign({}, story);
	
	save.history.turnIndex = story.ink.state.currentTurnIndex;
	save.ink = undefined;
	save.options = undefined;
	save.queue = undefined;
	save.innerdiv = undefined;
	save.outerdiv = undefined;
	save.watcher = undefined;
	save.externalFunctions = undefined;
	save.state = undefined;

	storage.set(id, JSON.stringify(save), format, story);
}

function load(story, id = "save", format = story.options.memorycard_format)
{
	var save = storage.get(id, format, story);
	if (save) 
	{
		save = JSON.parse(save);
		
		Object.assign(story, save);

		story.ink.state.storySeed = save.history.initialSeed;

		story.ink.state.currentTurnIndex = Math.min(save.history.turnIndex, story.history.choices.length - 1);
		
		story.outerdiv.addEventListener("story loaded state", (event) => 
		{
			applymostrecenttags(story, event.detail.tags);
		}, {once: true});

		history.load(story, story.ink.state.currentTurnIndex+1);
	}
}

function applymostrecenttags(story, input)
{
	input = input.join(" #");

	for (var tag of story.options.memorycard_applymostrecenttag)
	{
		var i = input.lastIndexOf(tag);
		if (i === -1) return;
		
		tag = input.substr(i);
		tag = (tag.split("#")[0]);

		Tags.process(story, tag.trim());
	};
}

window.addEventListener("story patch", () => { if (storage.options.storage_format === "cookies") credits.name = "Memory Card (4 KB)"}, {once: true});

Patches.add(function()
{
	
}, options, credits);

export default {options: options, credits: credits, save: save, load: load};