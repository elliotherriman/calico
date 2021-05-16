// -----------------------------------
// patch template
// -----------------------------------

var credits = {
	emoji: "🧶",
	name: "Storylets",
	author: "Elliot Herriman",
	version: "1.0",
	description: "Enables storylets, as seen in Twine's Harlowe.",
	licences: {
		self: "2021",
	}
}

var options = {};

// Tag any storylet passages with #storylet at the top, and include
// a condition near the top to call "-> DONE" if the storylet isn't
// ready to be shown, like so:

/*

=== subway
	# storylet
	{savings < 2.70: -> DONE}

*/

// Insert the following code into your ink.
/*

=== storylets(index)

{index < 0: -> DONE}
~ temp cc = CHOICE_COUNT()
~ temp storylet = get_storylet(index)
<- storylet

{CHOICE_COUNT() == cc: <- storylets(index+1)}

EXTERNAL get_storylet(index)

*/

// And call it like so...

/*

<- storylets(0)
* -> 
	If you're seeing this text, then there weren't any available storylets.

*/

// You can provide a number greater than zero if you don't want to access
// the first available storylet. A value of 1 will find the second available
// storylet, and so forth.
//
// Make sure you provide a fallback choice, just in case, and remember that
// you'll have to manually divert from storylets if the player clicks a choice.
// Take a look at "./patches/storylets.ink" for an example.

ExternalFunctions.add("get_storylet", function(index)
{ 
	for (var container of this.ink.mainContentContainer.namedContent)
	{
		let tags = this.ink.TagsForContentAtPath(container[0]);

		if (tags && tags.includes("storylet"))
		{
			index -= 1;
			if (index > 0) continue;
			return new inkjs.Path(container[0]);
		}
	}

	this.ink.state.callStack.PopThread();
});

Patches.add(null, options, credits);

export default {options: options, credits: credits};