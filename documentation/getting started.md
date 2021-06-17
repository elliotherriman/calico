# Getting Started

## What is ink?

Ink is a language used to write interactive fiction. Head over [here](https://www.inklestudios.com/ink/) to learn more, or check out my guide to ink [here](https://github.com/elliotherriman/calico/blob/main/documentation/ink%20guide.md).

## What is Calico?

A story written in ink isn't a complete, standalone game. Not yet. It's not even half of a game, really. It's just text inside of a document. For someone to play what you've written, your story has to be compiled and imported into an engine, which is responsible for handling all the rendering and interactivity. Calico is one of these engines, designed to help you release your games on the web.

Calico doesn't have a user interface, which I know might seem a tiny bit intimidating at first. But in truth, you don't need any experience with programming to build a game in Calico. There's only one file you'll need to worry about, and once you've opened that up, you can import your story, customise the engine, and finalise your project, all just by copying, pasting, and tweaking a few lines of code.

## What will I need?

You could theoretically work with Calico on any device, but I would politely beg you to do so on a computer, if you can manage it.

Inkle offers Inky, an app for writing ink stories, which you can find [here](https://github.com/inkle/inky/releases/latest). 

For editing the HTML, CSS, and Javascript, you can always use a basic text editor like Notepad, but if you're comfortable with it, my suggestion would be [Visual Studio Code](https://code.visualstudio.com/download) — which also has extensions to support writing ink files.

## A note, for those of you who can't code

Calico is written in Javascript. And Javascript is a programming language, which for a lot of people, is kind of scary.

Here are a few things that I hope will reassure you.

You absolutely cannot break your computer by toying with Javascript. It just isn't going to happen. Someone *might* be able to use Javascript steal your personal information, if you visit a suspicious website, I dunno. But you aren't going to break things.

Also? I didn't know Javascript when I started this project. I do know how to code, but I honestly just picked up the basics as I went along.

Calico was designed to ensure you could spend as little time programming as necessary. For the most part, you can copy and paste in lines of code, or tweak existing lines, and that'll serve you perfectly.

Worst case scenario, your project just might not load if you try to open it. But if you open up the developer console (through your browser or Catmint), it'll show you what went wrong. Then you can Google the error, or message me, or just tweak things until they work again.

Okay, are we ready to go?

Let's do this.

## Setting up Calico

To set up Calico, just download the most recent release from itch.io or Github, and unzip it somewhere convenient. Maybe your desktop, maybe your documents, whatever you're feeling.

You'll end up with a folder that looks like this.

```plaintext
index.html
style.css
ink.js
calico.js
project.js
```

If you compress these files into a zip, upload that zip as an HTML project to itch.io, and click play, `index.html` will load as a blank page, apply the style rules in `style.css`, and then boot up the Javascript files that are linked in `index.html` — by default, `ink.js`, `calico.js`, and then `project.js`, in that order.

`ink.js` takes your compiled ink and handles the logic side of your game. So if you click on a choice, Calico will tell `ink.js` about it, and `ink.js` will hand back the new text.

`calico.js` is the engine itself. It's responsible for taking all the text, tags, and choices from `ink.js` and rendering them to the webpage. It also provides a bunch of extra functionality, allowing you to bind custom tags, keyboard shortcuts, and so on and so forth.

Finally, `project.js` is where everything exclusive to your project exists. This is where you import your ink, change settings, and import patches.

## Creating a new project

A story written in ink is usually stored in a file that ends with the extension `.ink`. Unfortunately, this needs to be compiled into a `.json` file before it can be run by Calico. You can do so by using Inky, the command line tool Inklecate, or [Catmint](https://elliotherriman.itch.io/catmint).

Assuming you're using Catmint, you can place your `.ink` files inside the unzipped Calico template folder, and open up `index.html` in Catmint. Now, every time you make a change to one of those `.ink` files, Catmint will automatically compile it to a `.json` file with the same name.

If you're using Inky instead, make sure you export your story via "File", then "Export to JSON...", and place the resulting JSON file inside the Calico folder. If you use "Export for web...", Inky will compile your story inside a `.js` file, rather than a `.json`, and also produce a folder that looks extremely (and I'm sure confusingly) similar to Calico's template.

`project.js` is set up as a basic template, which means near the bottom of the file, you should find a line like...

```js
var story = new Story("story.json");
```

This line alone is technically a complete project file. It will take `story.json`, and attempt to run it as a story.

However, since you're probably working with a `.json` file that isn't called "story", you can simply reword that line to import a different file, like so.

```js
var story = new Story("winter.json");
```

You can rename `var story` to `var winter`, or anything else, just as long as that second word doesn't have any spaces in it. I'd recommend you don't, though, as it can interfere with the engine.

If you want to rename `project.js` to something else, that's totally fine too, just as long as you mirror that change within `index.html`.

## Tags

### Basics of Tags
Calico contains several functional tags you can use by default, and makes it easy to define and add more. A tag indicates to Calico that you want it to do something other than the default behaviour - maybe you want it to display a background image, delay the appearance of a particular line, clear the screen, or something else.

You add a tag in your .ink file in several ways - you can append it to the line like:
```
I ran out of the door #delay: 500
```

You can put it on its own line like:
```
I ran out of the door
#delay: 500
And tripped over the package
```

You can add several tags to the same line by delimiting with ``#``:

```
I ran out of the door #image: door.png #delay: 500
```

And of course you can combine all these together

```
I ran out of the door
#image: door.png #delay: 3000
Down the street
And tripped over the package #delay: 100
Falling until I skinned my knees #delay: 500
#delay: 2000
* Everything went black
```

In general, you'll add a tag using the format #tag: value.

### Out-of-the-box Tags

<details>
  <summary>Click here for a list of the tags that Calico supports out-of-the-box and how to use them </summary>
<br>

#### class
This tag allows you to add a css class or classes to the attached line. If you attach CSS styling, this will allow you to customize the appearance of specific lines in the text using a simple tag in ink! You can apply several classes by adding them separated by spaces.

Note: Does not apply consistently to clickable text at the moment

Examples:

```
I ran out of the door #class: center
Down the street
#class: rocky center
And tripped over the package #class goblin falcon mango
```

#### image

Adds an in-line image. The image should be stored in the default image location. By default this will be the "images" folder in the document root, which you will have to add yourself. If no image format is given, it will default to the filetype specified in the defaultImageType option - png by default.

Example:

```
I ran out of the door
#image: door.png
#image: package
```

#### background

Works very similarly to the "image" tag, but instead of placing it in-line sets it as the background image.

Example:

```
I ran out of the door #background: door.png
```

#### clear

Gracefully removes all text from the screen. It will clean inline images, but not the background image.

Example:

```
I ran out of the door
#image: door.png
Down the street
And tripped over the package
Falling until I skinned my knees
* Everything went black
#clear
```

#### restart

Starts the story over from the beginning. Clears all inline text and images, but does not clear background images.

Example:

```
I ran out of the door
#image: door.png
Down the street
And tripped over the package
Falling until I skinned my knees
* Everything went black#background: door
** Again?
#restart
```

#### delay

This tag will add a delay before the text it's attached to appears. If it's on it's own line or on a line with only other tags, it will add a delay before the next line of text appears. The delay is counted in milliseconds.

```
I ran out the door #delay 500
Down the street
#delay 1000
And tripped over the package
```

#### linebyline

This feature is still under development! If you use it, it will freeze each line until something calls ``queue.render`` to step it forward. As a tag with no argument, it will toggle on and off. With a ``true`` or ``false`` argument, you can control its behaviour directly.

</details>

### Writing Custom Tags

## Importing patches

Patches are simple (or complex) tweaks that you can import into a project to change how the core engine behaves.

Doing so is simple. Just open up your project file, and add a line like this before you create your story.

```js
import "./patches/preload.js";
```

That, of course, assumes a couple of things. First of all, that a file called "preload.js" exists inside the `patches` folder inside your project's directory. And secondly, that you actually wanted to import the preload patch. If that *wasn't* what you were trying to import, then you'll have to replace "preload.js" with something else, in the form of...

```js
import "./patches/[file].js";
```

Or...

```js
import "./patches/[folder]/[file].js";
```

## Changing options

Since Calico is technically running in Javascript, you might have to use some Javascript here, but it isn't too tricky. Usually, all you'll need to do is copy and paste in a line, and maybe tweak in some values, rather than write code yourself. I'll step you through it.

All options in Calico are stored in an object called `options`. When you create a story, it will automatically apply all those options, along with any changes you've made before that point.

Changing an option is as simple as this:

```js
options.linedelay = 600.0;
```

Alternatively, if you want to change options for a story that's already been created, you can do it like so:

```js
winter.options.linedelay = 600.0;
```

<details>
<summary>For a list of Calico's default options, click here.</summary>
<br>

- `passagedelay`  
  The delay between removing an old passage, and showing the next passage.  
  Defaults to `200.0`.
- `linedelay`  
  The delay after each line, before showing the next. If set to zero, the whole passage will appear at once.  
  Defaults to `50.0`.
- `showlength`  
  How long it takes for each line to fully appear.  
  Defaults to `500.0`.
- `hidelength`  
  How long it takes for each line to fully fade out.  
  Defaults to `600.0`.
- `suppresschoice`  
  By default, Calico will only let the player click on a choice once it's been fully rendered. If `suppresschoice` is greater than zero, Calico will add an invisible delay before any choices are enabled.  
  Defaults to `0.0`.
- `defaultimageformat`  
  The default format for image files. Used for tags that import images if you don't manually specify a file type.  
  Defaults to `".png"`.
- `defaultaudioformat`  
  The default format for audio files. Used for tags that import audio if you don't manually specify a file type.  
  Defaults to `".mp3"`.
- `defaultimagelocation`  
  The default location for image files. Used for tags that import images if you don't specify a folder manually.  
  Defaults to `"images/"`.
- `defaultaudiolocation`  
  The default location for image files. Used for tags that import audio if you don't specify a folder manually.  
  Defaults to `"music/"`.
- `textanimation`  
  The default text animation to use.  
  Defaults to `"fade"`.

</details>

Sometimes patches have options too. By importing a patch, you'll automatically add all of those settings to Calico's default options. By default, all patch options will prefix a short version of their name before each option, to make sure options don't overwrite each other.

So to change a patch's options, you just have to open up the patch file, find the relevant option's name, and then change it like you would any other setting.

Let's put it all together!

```js
// import a patch that creates simple tags to apply CSS classes to lines
import "./patches/shorthandclasstags.js";

// "shorthandclasstags.js" includes an option called 
// "shorthandclasstags_tags", which we'll change now
options.shorthandclasstags_tags = ["red", "winter"];

// and finally, we create our game
var winter = new Story("winter.json");
```

<details>
<summary>Having trouble? Still confused? Click here for an explanation of some very basic Javascript.</summary>
<br>
When you change an option, Javascript has to guess at what kind of value you're assigning. Speaking roughly, there are a few kinds.

- Numbers.
- Text, also known as strings.
- Lists, also known as arrays.
- Objects, which is an unordered box of _things_. I say things, because just like arrays, they can contain numbers, strings, arrays, other objects, whatever. Objects are sometimes called dictionaries, because they contain keys (words) that correspond to values (definitions).

If you don't already know these things, you might be confused. That's fine. Here's what actually matters: if an option is already set to one type of value, it's going to expect that same kind of value if you reassign it. So here's how we make sure that happens.

If you're setting a value to a number, that number should only contain the characters 0 through to 9, with a single optional decimal place.

Here's a number, `6`, or another kind of number, `34.7`.

If you're setting a value to text, it should be wrapped in quotes. Either double or single is fine.

For example, `"A line of text"`. If you want to add quotes within that line of text, you can prepend them with a backslash, like so, `"A line of \"text"\"`, or use the other kind of quotation marks, `"like 'so'"`.

Keep in mind, though, that Javascript treats the number `7` and the string `"7"` as different things. You can't do maths with strings. Trying to add two strings, or add a number to a string with `+` will combine them — `7 + 1` will return `8`, but `"7" + 1` will return `"71"`.

An array of objects is just a list of other values, separated by commas and wrapped up in square brackets. Let's say we want to make a list of strings. We'd use an array, like so.

```js
["a", "b", "c", 6]
```

"That last one isn't a string!" Correct! Very good! Any data can go into an array. I lied to you, and you passed with flying colours.

Finally, an object looks like this:

```js
{
	"property": "value",
}
```

Now, just like we did in the last section, if we want to replace an option? Here's how we do it.

```js
option.property = value;
```

And to break that down...

- `option`: the options object (like a dictionary, remember?)
- `.`: how we mark that we're accessing something within that object,
- `property`: the property we're accessing, which corresponds to a value,
- `=`: equals, which is how we assign a new value to that property,
- `value`: the new value,
- `;`: a symbol that marks the end of our line.

</details>

The important thing to remember is this. You absolutely can't break your game or computer by experimenting. That's how you learn, and I know that, because that's how I learned. Just make backups every hour or so, and every time before you do something big, and you'll be absolutely fine.

## Testing your game

Unfortunately, due to browser security limitations, you won't be able to load `.JSON` files from your file system when opening an `.html` file.

Which is exactly why I made [Catmint](https://elliotherriman.itch.io/catmint).

Download that, and boot it up. Click File, click Open, and then find your `index.html`.

I'd recommend importing the autosave patch into your project, which will allow you to reload your project without losing your place, and the step back plugin to allow you to rewind to previous passages. Both make testing so much easier.

## Troubleshooting

If your game doesn't load, then something probably went a little wrong. Which is totally fine! Just click Window, then Toggle Developer Tools. A panel will open, and it'll show you some text. If it's yellow or red, then something's gone wrong. Usually, I just Google whatever message it gives me, and figure it out from there.

If nothing comes up... well, that's a little harder. First, make sure that Catmint and Calico are both working by trying to load a fresh copy of the Calico template. If that's broken, please let me know. If it works, then try commenting out any lines you've recently tweaked from your project file. You can do that by prepending a line with `//`, like so.

```js
// import "./patches/preload.js";
```

## Uploading your game to itch.io

You're done? Hell yeah, okay.

Select all the files in your project folder, and zip them up.

Create an account on itch if you haven't already, then head [here](https://itch.io/game/new). Give your project a name, a short description, and some cover art. Even if it's a stock image, or just some text on a plain background, it's better tha nothing.

Change "Kind of project" to "HTML", and upload your newly zipped up project. Under "Embed options", change "Embed in page" to "Click to launch in fullscreen". That's not mandatory, but it looks and plays much better, I promise. You can probably select "Mobile friendly", too.

Then add a description, as many tags as you can think of (particularly "calico"! I want to find your games!), and save your project as a draft. Or as restricted, with a password, if you want to have friends test it. If you don't, though, at least make sure *you* play through your whole story on itch at least once before you make it public. You can always update your game later, it's not hard, but I've always found a couple of problems by taking the time to check.

## Final thoughts

I can feel myself getting less eloquent as I type, so I'm going to stop here. I'm going to come back and add more information on creating custom tags, shortcuts, text animations, patches, all of that noise. But hopefully this is enough to get you all started.

I'm [here](https://twitter.com/elliotherriman) on Twitter if you run into any problems at all, or have any questions, or just want to show me what you made.
