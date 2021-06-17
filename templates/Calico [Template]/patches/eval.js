// -----------------------------------
// eval
// -----------------------------------

var credits = {
	emoji: "🤖",
	name: "eval()",
	author: "Elliot Herriman",
	version: "1.0",
	description: ["Allows you to execute Javascript directly from your ink.", "This patch is highly irresponsible in like four different ways."],
	licences: {
		self: "2021",
	}
}

var options = {};

// runs everything after the ":" as javascript
// this wasn't included by default, as it provides more
// than a few opportunities for mischief. let's call it
// a feature for Advanced Users.
//
// no, but, like, seriously. there is almost always a better way
// to do what you're trying to do than eval. unless you understand
// that, unless you're sure, please go ask someone for help. this
// is almost Definitely the wrong solution for your problem

Tags.add("eval",
		function(story, property)
		{
			// make sure we have something to execute
			if (property.trim())
			{			
				eval.bind(story)(property);
			}
		});

Patches.add(null, options, credits);

export default {options: options, credits: credits};