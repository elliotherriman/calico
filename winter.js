// -----------------------------------
// attempt to preload all files before starting the story
import preload from "./patches/preload.js";

preload.options.preload_tags.audio.push("play", "pause", "resume", "stop");
preload.options.preload_tags.image.push("frame");

// always attempt to break to a new line in a way that
// preserves a minimum number of words per line
import "./patches/minwordsperline.js";
// style choices using tags that appear on the same line
import "./patches/choicetags.js";
// click and drag to scroll the page
import "./patches/dragtoscroll.js";
// convert markdown to HTML tags
import "./patches/markdowntohtml.js"
// -----------------------------------
// enable saving and loading
import memorycard from "./patches/memorycard.js"
memorycard.options.memorycard_applymostrecenttag.push("play", "resume", "pause", "stop");
// -----------------------------------
// preserve the player's position if they reload
import "./patches/autosave.js"
// -----------------------------------
// import media tag stuff for this game
import "./patches/parallaxframes.js"
import "./patches/musicplayer.js"
// -----------------------------------
// import helper patch for binding shortcuts to choices
import choices from "./patches/shortcuts/choices.js";

// bind the number keys to choices
for (var i = 0; i < 9; i++)
{
	choices.add((i+1).toString(), i, true);
}

// bind z, x, and c to the first three shortcuts respectively
["z", "x", "c"].forEach((key, index) => { choices.add(key, index, true) })

// bind spacebar to progress the story,
// provided there's only one choice available
choices.add(" ", 0, true, true);
// -----------------------------------
// bind custom tags that apply CSS styles to a line
import shorthandclasstags from "./patches/shorthandclasstags.js";
// set which tags (and by extension CSS styles) to use
shorthandclasstags.options.shorthandclasstags_tags = ["red", "winter"];
// -----------------------------------
// allow stepping the story forwards and backwards
import "./patches/stepback.js"

Patches.add(function() 
{
	Shortcuts.add("q", this.stepBack);
	Shortcuts.add("e", this.stepForwards);
});
// -----------------------------------

// set our options
options.linedelay = 600.0;
options.passagedelay = 200.0;
options.showlength = 1000.0;
options.hidelength = 750.0;
options.suppresschoice = 0.0;

// create our game
var winter = new Story("winter.json");