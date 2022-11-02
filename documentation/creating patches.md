# Patches

Calico is designed to be extremely customisable. There are a few options that you can change by default — but if you want to really change things up, you can modify and extend the core  engine itself by using patches.

This is a document covering how to create your own patches. More information on how to *use* patches can be found [here](https://github.com/elliotherriman/calico/blob/main/documentation/getting%20started.Importing%20patches).

## Why make patches?

Great question! Patches can be used to customise your game. Do you want to add custom tags? Make your fonts do fancy things?Run DOOM? Patches can let you do that!

Technically speaking, you don’t need to use a patch to add custom code to your project. Every Calico project has a `project.js` (or equivalent) — and while this is usually used to import patches and set options, it can also used to run code that’s specific to the project itself.

That said, if you’re expecting to reuse any amount of custom code in future projects, it may be worth converting it into a patch. Patches are simple to import — usually just requiring one or two lines of code — and can easily be customised, both before the game starts and while the game is running.

## Developing patches

### Getting started

The best place to start is with Calico's handy patch template! Just duplicate the file named `template.js` inside the patches folder, and start editing.

### The structure of a patch

Patches need a few things in order to function.

#### Credits and licences

Calico will automatically credit patch authors (and libraries used, if set up correctly) by printing metadata to the console. To set this up, edit the `credits` object in your patch.

```js

var credits = {
	emoji: "📄",
	name: "Convert markdown to HTML",
	author: "Elliot Herriman",
	version: "1.1",
	description: "Allows the use of markdown in your ink, which is converted to HTML at runtime.",
	licences: {
		self: "2021",
		mit: {
			"showdown" : "2018 ShowdownJS"
		}
	}
}

```

The `licences` object will automatically print an MIT licence for this patch to the browser console, using the year provided in `self`. It will also print a licence for any key value pairs in `mit`, where the key is the library's name, and the value is everything following "Copyright (c) " in the MIT licence. 

If you need to credit code using a different license, you can add it to the `licenses` object. For example, if you wanted to credit a fictional (as far as I know) library called "Aardvark" that's been released under The Unlicense, your `licenses` object should look like this.

```js
var credits = {
	licences: 
	{
		self: "2021",
		"The Unlicense": {
			"Aardvark" : "[The full text of The Unlicense]"
		}
	}
}
```

To be very, very clear — you would also need to replace `[The full text of The Unlicense]` with the full text of The Unlicense. 

Including the full text of a license may require you to escape quotation marks (`'` and `"`) by using `\` (`\'` and `\"`).

#### Options

If you want users to be able to alter your patch's behaviour at runtime, you can add options to the `options` object.

Options should be prefaced with a consistent and unique prefix, in the form of `patchname_variable`. Any options not formatted in this way may be overwritten by other patches.

#### Initialisation

Your patch is loaded into Calico using the following code.

```js
Patches.add(function(content)
{
	// code to run once the patch is applied
}, options, credits);
```

Once your patch is loaded, all options will be automatically copied over to target story object, and any code located in the above function will run. Some patches won't have any code inside that function — that's totally fine — but you can't remove the `add` call itself without breaking things.

Two notable variables will be available to you inside this initialisation function: `this`, and `content`. 

`this` represents the story object that your patch is being added to. From here, you can access `this.options`, `this.innerdiv`, and so forth. Be aware, though, that `this` is a special keyword which sometimes refers to other things — particularly if you declare new functions within the initialisation code. You can read more [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this).

`content` represents the raw text of your ink file. This will probably be an unparsed JSON string.

#### Exports

In order to access a patch's variables and functions from another file, you'll need to use exports.

```js
export default {options: options, credits: credits};
```

If a variable or function in your patch isn't exported, you won't be able to access it from elsewhere — including from `project.js` or any other patches. Calico expects both `options` and `credits` to be accessible externally, so editing the previous line of code may have unexpected effects.

The easiest way to export functions and variables is by adding them to `export default`. For example, `storage.js` exports the functions `get`, `set`, `remove`, and `clear`.

```js
export default {options: options, credits: credits, get: get, set: set, remove: remove, clear: clear}
```

This allows the patch `memorycard.js` to call those functions, which it uses to store and retrieve save data.

```js
import storage from"./storage.js";
```
```js
var save = storage.get(id, format);
```
```js
storage.set(id, JSON.stringify(save), format);
```

### Triggering code

As mentioned above, patches can run code immediately upon being loaded.

```js
Patches.add(function(content)
{
	// code to run once the patch is applied
}, options, credits);
```

But it's also possible to run code *later*, in response to events.

#### Tags

You can trigger code in response to an ink tag. To add custom tags, you'll need to define them using either the `Tags` or `Parser` classes. Tags added to the `Tags` class will apply before or after a line has been assembled. Tags added to the `Parser` class will apply while a line is being assembled.

In either case, Calico expects both a string to represent the tag, and a callback. When writing the string, don't include the `#`. For the tag `#example`, you would write `"example"`.

```js
Tags.add("restart",
		function(story)
		{
			// clear the story container, restart everything
			story.restart();
		});
```

The following example is from `shorthandclasstags.js`, and illustrates how to use the `Parser` to define custom tags.

```js
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
```

#### Patterns

You can use the `Parser` class to match patterns in each line of text. To do so, call `Parser.pattern()` with a regex pattern annd associated callback.

#### Events

It's possible to trigger code in response to certain events — for example, once the game is finished loading, or every time a certain tag is found.

You can read more about events (and find a complete list of them) [here](https://github.com/elliotherriman/calico/blob/main/documentation/events.md).

You'll need to define event listeners inside the `Patches.add` callback. For example, you can use the following code to trigger code whenever the ink story restarts.

```js
Patches.add(function()
{	
	this.outerdiv.addEventListener("story restarting", (event) => 
	{
		// your code here
	});
}, options, credits);
```

#### Other ways

This section outlines a few ways to trigger code — but you have the entire language of Javascript at your disposal. You're very much encouraged to experiment and make mistakes until you find something neat that works!