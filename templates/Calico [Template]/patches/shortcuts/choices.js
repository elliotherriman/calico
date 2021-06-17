var credits = {
	emoji: "🔢",
	name: "Choice shortcuts",
	version: "1.0",
	description: ["A template for binding shortcuts to choices."],
	licences: {
		self: "2021 Elliot Herriman",
	}
}

var options = {
	choices_keys: [],
	choices_mustbeonscreen: true,
	choices_onlyifnomodifierkeys: true,
}

function chooseChoice(event, story, num, onlyIfNoModifierKeys = story.options.choices_onlyifnomodifierkeys, onlyIfOnlyChoice = false)
{
	if (onlyIfNoModifierKeys && 
		(event.getModifierState("Control") || event.getModifierState("Alt") || 
		event.getModifierState("OS") || event.getModifierState("Meta") || 
		event.getModifierState("Win") || event.getModifierState("Fn")))
	{
		return;
	}

	var currentChoices = story.innerdiv.querySelectorAll(".choice > a");
	
	if (!currentChoices || currentChoices.length - 1 < num || onlyIfOnlyChoice && currentChoices.length > 1) 
	{
		return;
	}

	// choose the choice by simulating click on link
	var el = currentChoices[num];

	// make sure the element is at least... half on screen?
	// technically this doesn't account for the element being off
	// and Above the screen, but... that's fine
	if (story.options.choices_mustbeonscreen || (el.offsetTop + el.offsetHeight / 2 < story.outerdiv.scrollTop + window.innerHeight))
	{
		el.click();
	}	
}

// simple function that lets you bind a shortcut to choose choices
// for a story. if a story isn't provided, and the patch hasn't been
// applied yet, then the shortcuts you add here will be bound then
function add(story, key, num, onlyIfNoModifierKeys, onlyIfOnlyChoice)
{
	if (arguments.length < 5)
	{
		return options.choices_keys.push(arguments);
	}
	Shortcuts.add(key, (event) => 
	{
		chooseChoice(event, story, num, onlyIfNoModifierKeys, onlyIfOnlyChoice);
	});
}

// bind all the number keys to select the corresponding choices
Patches.add(function()
{
	this.options.choices_keys.forEach((shortcut) => 
	{
		add(this, shortcut[0], shortcut[1], shortcut[2], shortcut[3])
	})

}, options, credits);

export default {options: options, credits: credits, add: add};