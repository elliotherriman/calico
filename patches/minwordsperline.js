// -----------------------------------
// minimum words per line
// -----------------------------------
// ensures that if a line would break (i.e. what happens when you hit enter in
// a text editor), it will always have more than one word on the second line.
//
// so if a line break was inserted || there
// this ensures that the two lines would become
//		so if a line break was
// 		inserted there
// just because it looks a little nicer, honestly. i mean, it doesn't matter,
// not really, but these sort of little aesthetic considerations are what
// set apart good developers from great ones
//
// not that i'm calling myself a great developer. you've seen how i code.
// also, this may not be compatible with inline HTML. like, custom classes and
// spans that are in the physical ink. i'm not sure how to neatly avoid that?
// please feel free to pull request this

var credits = {
	emoji: "📝",
	name: "Minimum words per line",
	author: "Elliot Herriman",
	version: "1.0",
	description: "Prevent lines from breaking in a way that only leaves one (or more) word(s) on the next line.",
	licences: {
		self: "2021",
	}
}

var options = {
	// the minimum number of words per line
	minwordsperline_length: 2,
};

function applyMinLength(event)
{
	var line = event.detail.line || event.detail.choice

	// if there's any text that also includes a space
	if (line.text && line.text.trim().includes(" "))
	{
		// skip the first html tag so we don't have to worry 
		// var endOfTag = line.text.indexOf(">") + 1;
		// minLineLength sets how many times the last space is replaced, 
		// thereby setting the minimum length of a line
		for (var i = 1; i < event.detail.story.options.minwordsperline_length; i++)
		{
			// takes the last space in the line (that comes before other words)
			// and replaces it with a non breaking space, which is a character 
			// that looks like a space, but won't let the words on either side
			// break onto separate lines
			line.text = line.text.replace(/ (?!<\/span>\s*$)(([^ <>]| <\/span>|<[^>]+>)*)$/, "&nbsp;$1");
		}
	}
}

Patches.add(function()
{
	this.outerdiv.addEventListener("passage line", (event) =>
	{
		applyMinLength(event);
	});

	this.outerdiv.addEventListener("passage choice", (event) =>
	{
		applyMinLength(event);
	});

}, options, credits);

export default {options: options, credits: credits};