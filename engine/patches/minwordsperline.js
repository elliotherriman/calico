// -----------------------------------
// minimum words per line
// -----------------------------------
// ensures that if a line would a widow make (character from overwatch),
// or an orphan make (a single word on the final line of a multi-line
// paragrhaph), it no longer does that.

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

var credits = {
	emoji: "📝",
	name: "Minimum words per line",
	author: "qt-dork and Elliot Herriman",
	version: "1.1",
	description: "Prevent lines from breaking in a way that only leaves one (or more) word(s) on the next line.",
	licences: {
		self: "2021",
	}
}

var options = {
	// the minimum number of words per line
	minwordsperline_length: 2,
};

function noOrphans(textItems, length) {
	// Find the second to last word
	// Stick a span right before the second to last word
	textItems[textItems.length - length] = `<span style='white-space: nowrap'>` + textItems[textItems.length - 2];
	// Stick a closing span right after the last word
	textItems[textItems.length - 1] = textItems[textItems.length - 1] + `</span>`;

	return textItems;
}

function applyMinLength(story, line)
{
	// Rough function layout

	let replacement = '';

	// Split words/tags into array
	// NOTE: This trims leading/trailing whitespace, so if you're
	// using that intentionally then whoops
	let textItems = line.text.trim().replace(/&nbsp;/g, ' ').split(/ (?=[^>]*(?:<|$))/);

	// Check if the array is shorter than the length
	if (textItems.length < story.options.minwordsperline_length) {
		return;
	}

	// Maybe check if the array already has the span???????

	// Run orphan function
	textItems = noOrphans(textItems, story.options.minwordsperline_length);

	// Recombine the array
	replacement = textItems.join(' ');

	// Set the line equal to the new line
	line.text = replacement;
}

Patches.add(function()
{
	// trigger this in response to us finding a text line,
	this.outerdiv.addEventListener("passage line", (event) =>
	{
		applyMinLength(event.detail.story, event.detail.line);
	});

	// or a choice line
	this.outerdiv.addEventListener("passage choice", (event) =>
	{
		applyMinLength(event.detail.story, event.detail.choice);
	});

}, options, credits);

export default {options: options, credits: credits};