// -----------------------------------
// scroll after choice
// -----------------------------------

var credits = {
	emoji: "⤵️",
	name: "Scroll after choice",
	author: "Elliot Herriman",
	version: "1.1",
	description: ["After choosing a choice, the story will automatically scroll to show the new content."],
	licences: {
		self: "2021",
		mit: {"Original scroll down code" : "2016 inkle Ltd."}
	}
}

// honestly the effect is sometimes choppy
// particularly when printing messages to the console,
// or even when the console's open?
// i'm not totally sure what the exact cause is-- the
// calculation each frame probably adds up, but also
// maybe the core engine code is ineffecient? 
// (chances are, it's both)
// anyway, the effect's mostly fine, just occasionally
// gets a tiny bit choppy. i've found a multiplier of 
// two is usually just about perfect for minimising it

var options = {
	// stop scrolling down (or up) if the user scrolls manually
	// it's probably better left on, but it will sometimes 
	// cause issues on mac trackpads specifically, since there's
	// an OS wide setting to add inertia to your scrolling, but
	// that inertia presents itself as regular scrolling
	// so if you scroll down and hit the bottom and then take a choice,
	// the scroll down here might break because it thinks you're still
	// scrolling regularly?
	scrollafterchoice_breakonuserscroll: true,
	// enable scrolling up, for cases where there are a lot of choices,
	// and the start of the new content ends up being up instead of down
	scrollafterchoice_scrollup: true,
	// minimum duration of scroll animation
	scrollafterchoice_durationbase: 500,
	// how long the scroll will take, relative to the distance
	scrollafterchoice_durationmultiplier: 3,
	// longest possible scroll in ms
	scrollafterchoice_maxduration: 1250,
	// how much space you want above the scroll target 
	// (with 0.2 being 20% of the div's height)
	scrollafterchoice_scrollTargetPadding: 0.2,
}

Story.prototype.scrollAfterChoice = function() 
{
	let lastText = this.queue.contents[0].previousSibling || null;

	var endOfText = (lastText ? lastText.offsetTop + lastText.offsetHeight : 0);

	var div = this.outerdiv;
	var start = div.scrollTop;
	var target = endOfText - window.innerHeight * this.options.scrollafterchoice_scrollTargetPadding;

	if (this.innerdiv.scrollHeight - window.innerHeight - target < 20) 
	{
		target = this.innerdiv.scrollHeight - window.innerHeight;
	}

	if (!this.options.scrollafterchoice_scrollup && target < start) return;

	var duration = Math.min(this.options.scrollafterchoice_durationbase + this.options.scrollafterchoice_durationmultiplier * Math.abs(target - start), this.options.scrollafterchoice_maxduration);

	var pos = div.scrollTop;
	var startTime = null;
	
	var t;
	var lerp;

	notify("story scroll to new content", {story: this, previous: start, target: target});

	var game = this;

	function step(time)
	{
		// make sure start time is defined, if not, use the current time
		startTime = startTime || time;

		// check how far through the animation we are
		t = (time-startTime) / duration;
		
		// if the user's manually scrolled, break
		if (t > 1 || game.options.scrollafterchoice_breakonuserscroll && pos != div.scrollTop) 
		{
			return;
		}

		// do some lerping with that value
		lerp = 3*t*t - 2*t*t*t;
		
		// calculate the new target and scroll to the result
		div.scrollTop = (1.0 - lerp) * start + lerp * target;

		// set the target for later
		pos = div.scrollTop;
		
		// keep going unless it's done
		game.scrollDownAnimation = requestAnimationFrame(step);
	}
	
	if (!game.scrollDownAnimation)
	{
		game.scrollDownAnimation = requestAnimationFrame(step);
	}
}

Patches.add(function()
{
	this.outerdiv.addEventListener("render start", function(event) 
	{
		cancelAnimationFrame(event.detail.story.scrollDownAnimation); 
		event.detail.story.scrollDownAnimation = undefined;
		event.detail.queue.onShow(event.detail.story.scrollAfterChoice, 0);
	});
}, options, credits);

export default {options: options, credits: credits};