// -----------------------------------
// fade after choice
// -----------------------------------

var credits = {
	emoji: "⚪",
	name: "Fade after choice",
	author: "Michael Gutman", 
	version: "1.0",
	description: ["After choosing a choice, make previous text partially fade out."],
	licences: {
		self: "2021",
	}
}

var options = {
    // if set to true will start the fade (delay timer) immediately after clicking the choice
    // by default (false) fadeafterchoice waits until the next passage starts to render
    fadeafterchoice_onchoice: false,
    // the target % opacity to fade to between 0 and 100. 100 does nothing. lower numbers make it less visible.
    fadeafterchoice_fadelevel: 30.0,
    // how long it takes to reach the target opacity (fadelevel)
    fadeafterchoice_fadespeed: 200.0,
    // the delay between the new text starting to render (or, if onchoice is true, the choice being made)
    // and the old text starting to fade
    fadeafterchoice_fadedelay: 0.0,
}

Patches.add(function() {
    if (this.options.fadeafterchoice_onchoice) {
        // passage end -> a choice has been made, so we fade out the queue
        this.outerdiv.addEventListener("passage end", (event) => {
            event.detail.story.queue.contents.forEach(p => {
                transition(p, "opacity", this.options.fadeafterchoice_fadelevel + "%", this.options.fadeafterchoice_fadespeed, this.options.fadeafterchoice_fadedelay);
            });
        })
    } else {
        // the queue is cleared when a choice is made, so save that old queue to fade it out 
        this.outerdiv.addEventListener("queue clear", (event) => { event.detail.queue.fadeafterchoice_queue = event.detail.old });

        // when we start to render the next pasasage, fade out everything in the old queue
        this.outerdiv.addEventListener("render start", (event) => {
            event.detail.queue.fadeafterchoice_queue.forEach(p => {
                transition(p, "opacity", this.options.fadeafterchoice_fadelevel + "%", this.options.fadeafterchoice_fadespeed, this.options.fadeafterchoice_fadedelay);
            });
        })
    }

    

}, options, credits)

export default {options: options, credits: credits};