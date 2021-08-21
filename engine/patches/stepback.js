import history from "./history.js"

var credits = {
	emoji: "⏳",
	name: "Rewind story",
	author: "Elliot Herriman",
	version: "1.0",
	description: "Allow the player to rewind the story to a previous passage.",
	licences: {
		self: "2021",
	}
}

var options = {
	// let the player go forwards as well as backwards
	// (you can go forward once for every time you've
	// called backwards, basically sugarcube's behaviour)
	stepback_enabled: true,
	stepback_stepforwards: true,
};

Story.prototype.stepForwards = function()
{
	if (this.state != Story.states.waiting ||
		!this.options.stepback_stepforwards) return;
	
	history.load(this, this.ink.state.currentTurnIndex + 2, 
		this.innerdiv.querySelector(".choice"), this.clear);
}

Story.prototype.stepBack = function()
{
	if (this.state != Story.states.waiting ||
		!this.options.stepback_enabled) return;

	history.load(this, this.ink.state.currentTurnIndex, 
		this.innerdiv.firstElementChild, () => 
	{
		this.outerdiv.addEventListener("render start", (event) =>
		{
			event.detail.queue.contents[0].delay = 0;
		}, {once: true});

		this.clear();
	});
}

Patches.add(function()
{	

}, options, credits);

export default {options: options, credits: credits};