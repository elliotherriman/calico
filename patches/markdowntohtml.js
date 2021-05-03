// -----------------------------------
// convert markdown to HTML
// -----------------------------------
// basically just lets you write with italics and bold without being miserable
// keep in mind that, as with all replacements, the order in which they're 
// bound is somewhat important. if italics were bound before bold, then
// instead of **bold** being <b>bold</b>, it would be <i>*bold*</i>

var options = {};

// **bold**
const bold = /\*\*(.*)\*\*/gi
// *italics*
const italics = /\*(.*)\*/gi
// [text](url)
const link = /\[(.*?)\]\((.*?)\)/gi

Lexer.pattern(bold, function(line) 
				{
					line.text = line.text.replace(bold, "<b>$1</b>");
				});

Lexer.pattern(italics, function(line) 
				{
					line.text = line.text.replace(italics, "<i>$1</i>");
				});


Lexer.pattern(link, function(line) 
				{
					line.text = line.text.replace(link, "<a href='$2'>$1</a>");
				});

var credits = {
	emoji: "📄",
	name: "Convert markdown to HTML",
	author: "Elliot Herriman",
	version: "1.0",
	description: "Allows the use of markdown in your ink, which is converted to HTML at runtime.",
	licences: {
		self: "2021",
	}
}

Patches.add(null, options, credits);

export default {options: options, credits: credits};