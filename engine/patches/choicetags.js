// -----------------------------------
// choice tags
// -----------------------------------

var credits = {
	emoji: "🏷",
	name: "Choice tags",
	author: "Elliot Herriman",
	version: "1.0",
	description: "Applies style tags to choices.",
	licences: {
		self: "2021",
	}
}

var options = {
	// only include tags that are registered in the lexer class
	// probably unnecessary, since this is all handled for you
	// in style.process(), but i wanted to include the option
	choicetags_checkiflexertag: false,
};

Patches.add(function()
{
	this.outerdiv.addEventListener("passage choice", (event) =>
	{
		// get an array of all the content that this choice leads to
		var contentAfterChoice = event.detail.story.ink.PointerAtPath(event.detail.choice.targetPath).container._content;

		// create an array to store any tags we find
		event.detail.choice.tags = [];

		// check every entry to see if it's a tag, breaking if we encounter
		// other kinds of content
		for (var i = 0; i < contentAfterChoice.length; i++)
		{
			// if it has a text property, then it's a tag
			if (contentAfterChoice[i].text != null)
			{
				// and if we don't want to check if it's a style tag,
				// (or if we do, and it is a style tag after all,)
				if (!this.options.choicetags_checkifstyletag || contentAfterChoice[i].text in style.tags)
				{
					// we add it to the list!
					event.detail.choice.tags.push(contentAfterChoice[i].text);
				}
			}
			// if it's string and not glued, or if linebreak, 
			// then tag wasn't on the same line as the choice,
			else if (typeof contentAfterChoice[i].value === "string" && contentAfterChoice[i]._isNewline) 
			{
				// so we can stop searching
				break;
			}
		}
	});

	this.outerdiv.addEventListener("passage choice element", (event) =>
	{
		event.detail.choice.tags.forEach((tag) => 
		{ 
			if (tag.trim().toLowerCase().startsWith("class"))
			{
				Tags.process(this, tag, true); 
			}
		});
	});

}, options, credits);

export default {options: options, credits: credits};