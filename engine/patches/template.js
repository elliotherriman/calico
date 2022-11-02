// -----------------------------------
// patch template
// -----------------------------------

var credits = {
	emoji: "",
	name: "name",
	author: "author",
	version: "1.0",
	description: "description",
	licences: {
		self: "2021",
	}
}

var options = {
	patchname_variable: true,
};

Patches.add(function(content)
{
	
}, options, credits);

export default {options: options, credits: credits};