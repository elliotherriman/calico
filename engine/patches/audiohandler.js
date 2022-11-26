// -----------------------------------
// patch template
// -----------------------------------

var credits = {
	emoji: "🎧",
	name: "Audio Handler",
	author: "Green Clovers",
	version: "1.0",
	description: "A simple patch that allows users to use the #music and #sfx tags.",
	licences: {
		self: "2021",
	}
};

var options = {};

let music_player = document.createElement("audio");
let sfx_player = document.createElement("audio");



Tags.add("music", (story, property) =>
	 {
		// make sure a file name was provided
		if (!typeof property === "string" || !property.trim())
		{
			console.warn("(#music) no file was provided.");
			return;
		}
		//If the player writes stop, stop the music.
		if (property.toLowerCase() === "stop")
		{
			music_player.pause();
			return;
		}
		// if the image provided isn't a URL,
		if (!property.startsWith("http"))
		{
			// ensure our file has a file extension
			property = addFileType(property, story.options.defaultaudioformat, story.options.defaultaudiolocation);
		}
		music_player.src = property;
		music_player.loop = true;

		music_player.play();
	});

Tags.add("sfx", (story, property)=>
	 {
		// make sure a file name was provided
		if (!typeof property === "string" || !property.trim())
		{
			console.warn("(#sfx) no file was provided.");
			return;
		}

		// if the image provided isn't a URL,
		if (!property.startsWith("http"))
		{
			// ensure our file has a file extension
			property = addFileType(property, story.options.defaultaudioformat, story.options.defaultaudiolocation);
		}

		sfx_player.src = property;
		sfx_player.loop = false;

		sfx_player.play();
	});



Patches.add(function()
{
	this.outerdiv.addEventListener("story ready", (event) =>
	{
		this.outerdiv.appendChild(music_player);
		this.outerdiv.appendChild(sfx_player);
	});
});

export default {options: options, credits: credits};
