## What is ink?

Ink is a language used to write interactive fiction. Head over [here](https://www.inklestudios.com/ink/) to learn more.

## What is Calico?

Calico is an engine for ink games, designed for the web. The general idea is this: you write a story in ink, import it into Calico, tweak some settings, and then upload it to a website like itch.io. Alternatively, you can compile it to a standalone application using something like Electron.

## How do I use Calico?

That's what I'm about to explain, you peanut. But if you're asking how to edit the files we're about to cover... that's a fair question. Inkle offers Inky, an app for writing Ink stories, which you can find [here](https://github.com/inkle/inky/releases/latest). For editing the HTML, CSS, and Javascript, you can always use a basic text editor like Notepad, but if you're comfortable with it, my suggestion would be [Visual Studio Code](https://code.visualstudio.com/download).

## A note, for those of you who can't code

Calico is written in Javascript. And Javascript is a programming language, which for a lot of people, is kind of scary. 

Here are a few things that I hope will reassure you.

You absolutely cannot break your computer by toying with Javascript. It just isn't going to happen. Someone *might* be able to use Javascript steal your personal information, if you visit a suspicious website, I dunno. But you aren't going to break things.

Also? I didn't know Javascript when I started this project. I do know how to code, but I honestly just picked up the basics as I went along.

Calico was designed to ensure you could spend as little time programming as necessary. For the most part, you can copy and paste in lines of code, or tweak existing lines, and that'll serve you perfectly. 

If you try to load up your project and something breaks, there might be an error in your Javascript. If you open up the developer console (through your browser or Catmint), it will show you what went wrong. Then you can Google the error, or message me, or figure it out yourself. But I promise you, you can do this.

Okay, are we ready to go?

Let's do this.

## Setting up Calico

To set up Calico, just download the most recent release from itch.io or Github, and unzip it somewhere convenient. Maybe your desktop, maybe your documents, whatever you're feeling. 

You'll end up with a folder that looks like this.

```
index.html
style.css
ink.js
calico.js
project.js
```

If you upload this zip to itch.io and run it, `index.html` will load as a blank page, apply the style rules in `style.css`, and then boot up the Javascript files that are linked in `index.html` — by default, `ink.js`, `calico.js`, and then `project.js`, in that order. 

`ink.js` takes your compiled ink and handles the logic side of your game. So if you click on a choice, Calico will tell `ink.js` about it, and `ink.js` will hand back the new text.

`calico.js` is the engine itself. It's responsible for taking all the text, tags, and choices from `ink.js` and rendering them to the webpage. It also provides a bunch of extra functionality, allowing you to bind custom tags, keyboard shortcuts, and so on and so forth.

Finally, `project.js` is where everything exclusive to your project exists. This is where you import your ink, change settings, and import patches.

## Creating a new project

A story written in ink is usually stored in a file that ends with the extension `.ink`. Unfortunately, this needs to be compiled into a `.json` file before it can be run by Calico. You can do so by using Inky, the command line tool Inklecate, or [Catmint](https://elliotherriman.itch.io/calico).

Assuming you're using Catmint, you can simply open up `index.html`. Now, every time you make a change to an `.ink` file in your project directory, it automatically compile to a `.json` file with the same name.

`project.js` is set up as a basic template, which means near the bottom of the file, you should find a line like...

```
var story = new Story("story.json");
```

This line alone is technically a complete project file. It will take `story.json`, and attempt to run it as a story.

However, since you're probably working with a `.json` file that isn't called "story", you can simply reword that line to import a different file, like so.

```
var winter = new Story("winter.json");
```

If you want to rename `project.js` to something else, that's totally fine too, just as long as you mirror that change within `index.html`.

## Changing options

Since Calico is technically running in Javascript, you might have to use some Javascript here, but it isn't too tricky. For

All options in Calico are stored in an object called `options`. When you create a story, it will import these options, along with any changes you've made before that point.

Changing an option is as simple as this:

```
options.linedelay = 600.0;
```

Alternatively, if you want to change options for a story that's already been created, you can do it like so:

```
winter.options.linedelay = 600.0;
```

<details>
<summary>For a list of Calico's default options, click here.</summary>
<br>
If you're replacing one of these values, make sure you preserve the format of the original. Numbers should be replaced by numbers, and text surrounded by quotation marks should be replaced by... yeah, you get it. There's a section below on data types if you want to know more.

<br><br>

<code>passagedelay</code>

The delay between removing an old passage, and showing the next passage.

Defaults to `200.0`.

<br><code>linedelay</code>

The delay after each line, before showing the next. If set to zero, all passage will appear at once.

Defaults to `50.0`.

<br><code>showlength</code>

How long it takes for each line to fully appear.

Defaults to `500.0`.

<br><code>hidelength</code>

How long it takes for each line to fully fade out.

Defaults to `600.0`.

<br><code>suppresschoice</code>

By default, Calico will only let the player click on a choice once it's been fully rendered. If `suppresschoice` is great than zero, Calico will add an invisible delay before any choices are enabled.

Defaults to `0.0`.

<br><code>defaultimageformat</code>

The default format for image files. Used for tags that import images if you don't manually specify a file type.

Defaults to `".png"`.

<br><code>defaultaudioformat</code>

The default format for audio files. Used for tags that import audio if you don't manually specify a file type.

Defaults to `".mp3"`.

<br><code>defaultimagelocation</code>

The default location for image files. Used for tags that import images if you don't specify a folder manually.

Defaults to `"images/"`.

<br><code>defaultaudiolocation</code>

The default location for image files. Used for tags that import images if you don't specify a folder manually.

Defaults to `"music/"`.

<br><code>textanimation</code>

The default text animation to use. 

Defaults to `"fade"`.
</details>

## Importing patches

Patches are simple (or complex) tweaks that you can import into a project to change how the core engine behaves. 

Doing so is simple. Just open up your project file, and add a line like this before you create your story.

```
import "./patches/preload.js";
```

That, of course, assumes a couple of things. First of all, that a file called "preload.js" exists inside the `patches` folder inside your project's directory. And secondly, that you actually wanted to import the preload patch. If that *wasn't* what you were trying to import, then you'll have to replace "preload.js" with something else, in the form of...

```
import "./patches/[file].js";
```

Or...

```
import "./patches/[folder]/[file].js";
```

## Patch options
Sometimes patches have options too. By importing a patch, you'll automatically add all of those settings to Calico's default options. By default, all patch options will prefix a short version of their name before each option, to make sure options don't overwrite each other.

So to change a patch's options, you just have to open up the patch file, find the relevant option's name, and then change it like you would any other setting.

Let's put it all together!

```
// import a patch that creates simple tags to apply CSS classes to lines
import "./patches/shorthandclasstags.js";

// "shorthandclasstags.js" includes an option called 
// "shorthandclasstags_tags", which we'll change now
options.shorthandclasstags_tags = ["red", "winter"];

// and finally, we create our game
var winter = new Story("winter.json");
```

## Data types
Here's a brief refresher on some basic Javascript.

When you change an option, Javascript has to guess at what kind of value you're assigning. Speaking roughly, there are a few kinds.

* Numbers.
* Text, also known as strings.
* Lists, also known as arrays.
* Objects, which are like an English to French dictionaries. As in, they're full of values that each correspond to another value, I dunno.

If you don't already know these things, you might be confused. That's fine. That's why I didn't tell you there's more than one kind of number, or that there are a *lot* of other kinds of value. 

Here's what actually mattesr: if an option is already set to one type of value, it's going to expect that same kind of value if you reassign it. So here's how we make sure that happens.

If you're setting a value to a number, that number should only contain the characters 0 through to 9, with a single optional decimal place.

Here's a number, `6`, or another kind of number, `34.7`.

If you're setting a value to text, it should be wrapped in quotes. Either double or single is fine.

For example, `"A line of text"`. 

If you want to add quotes within that line of text, you can prepend them with a backslash, like so, `"A line of \"text"\"`, or use the other kind of quotation marks, `"like 'so'"`.

An array of objects is just a list of other values, separated by commas and wrapped up in square brackets. Let's say we want to make a list of strings. We'd use an array, like so.

`["a", "b", "c", 6]`

"That last one isn't a string!" Correct! Very good! Any data can go into an array. I lied to you, and you passed with flying colours.

And finally, an object looks like this:

`{property: "value"}`

Now, just like we did in the last section, if we want to replace an option? Here's how we do it.

`option.property = value;`

And to break that down...

`option`: the options object (just an English to French dictionary, remember?)
`.property`: the value we're accessing,
` = `: equals, which is how we assign a new value to that property,
`value`: the new value,
`;`: a symbol that marks the end of our line. I think it's usually optional in Javascript, but it's good practice.

The important thing to remember is this.

You absolutely can't break your game or computer by experimenting. That's how you learned, and I know that, because that's how I learned. Just make backups every hour or so, and you'll be absolutely fine. 

## Testing your game
Unfortunately, due to browser security limitations, you won't be able to load `.JSON` files from your file system when opening an `.html` file. 

Which is exactly why I made [Catmint](https://elliotherriman.itch.io/catmint). 

Download that, and boot it up. Click File, click Open, and then find your `index.html`.

I'd recommend importing the autosave patch into your project, which will allow you to reload your project without losing your place, and the step back plugin to allow you to rewind to previous passages. Both make testing so much easier.

## Troubleshooting
If your game doesn't load, then something probably went a little wrong. Which is totally fine! Just click Window, then Toggle Developer Tools. A panel will open, and it'll show you some text. If it's yellow or red, then something's gone wrong. Usually, I just Google whatever message it gives me, and figure it out from there.

If nothing comes up... well, that's a little harder. First, make sure that Catmint and Calico are both working by trying to load a fresh copy of the Calico template. If that's broken, please let me know. If it works, then try commenting out any lines you've recently tweaked from your project file. You can do that by pretending a line with `//`, like so.

```
// import "./patches/preload.js";
```

## Uploading your game to itch.

You're done? Hell yeah, okay.

Select all the files in your project folder, and zip them up.

Create an account on itch if you haven't already, then head [here](https://itch.io/game/new). Give your project a name, a short description, and some cover art. Even if it's a stock image, or just some text on a plain background, it's better tha nothing. 

Change "Kind of project" to "HTML", and upload your newly zipped up project. Under "Embed options", change "Embed in page" to "Click to launch in fullscreen". You can probably select "Mobile friendly", too. 

Then add a description, as many tags as you can think of (particularly "calico"! I want to find your games!), and save your project as a draft. Or as restricted, with a password, if you want to have friends test it. If you don't, though, at least make sure *you* play through your whole story on itch at least once before you make it public. You can always update your game later, it's not hard, but I've always found a couple of problems by taking the time to check.

## Final thoughts
I can feel myself getting less eloquent as I type, so I'm going to stop here. I'm going to come back and add more information on creating custom tags, shortcuts, text animations, patches, all of that noise. But hopefully this is enough to get youa ll started.

I'm [here](https://twitter.com/elliotherriman) on Twitter if you run into any problems at all, or have any questions, or just want to show me what you made.
