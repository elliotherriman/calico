// -----------------------------------
// style tags
// -----------------------------------
// adding "x" to this list will let you use the tag "#x" in your ink, which
// acts as shorthand for "#class: x". my only use for these so far has been 
// tagging lines of character dialogue to theme them with unique colours and 
// fonts, but you can use these for anything at all, really.

var credits = {
	emoji: "🏷",
	name: "Shorthand class tags",
	author: "Elliot Herriman",
	version: "1.0",
	description: "Create shorthand tags to quickly add CSS classes to a line. For all tags specified, \"#tag\" will function identically to \"#class: tag\".",
	licences: {
		self: "2021",
	}
}

var options = {
	// "#tag" will function identically to "#class: tag"
	// it's probably better to use [imported object].options.tags.push("tag") 
	// in your project file than it is to add tags here
	shorthandclasstags_tags: [],
};

Patches.add(function()
{
	this.options.shorthandclasstags_tags.forEach(function(tag)
	{
		// don't do anything if the tag's empty
		if (!tag || typeof tag !== "string") 
		{
			return;
		}

		// binds a function to the tag handler
		Parser.tag(tag, function(line, tag, property) 
				{
					// add the tag to the class list
					line.classes.push(tag);
				});
	});	
}, options, credits);

export default {options: options, credits: credits};