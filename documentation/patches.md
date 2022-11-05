# Patches

Patches are simple (or complex) tweaks that you can import into a project to change how the core engine behaves. You can read more [here](https://github.com/elliotherriman/calico/blob/main/documentation/getting%20started.md#importing-patches).

Generally, patches require minimal configuration after you've imported them. That said, a select few require some extra tweaking to run properly. This document aims to cover all of these cases, but if you're having difficulty getting a patch to work, feel free to contact me on [Twitter](https://twitter.com/elliotherriman).

## memorycard.js

If you're using `memorycard.js` in conjunction with any tags that make persistent changes — for example, tags that trigger audio, or tags that change the background of your game — then those changes will normally be lost if the player reloads the window.

To avoid this, you can add persistent tags to `options.memorycard_applymostrecenttag` from your `project.js`. This will attempt to find the most recent instance of each given tag, and process it.

```js
options.memorycard_applymostrecenttag.push("play", "resume", "pause", "stop");
```

## parallaxframes.js

While `parallaxframes.js` will run without configuration, it won't display properly without some custom CSS code.

The following code was used in Winter. Feel free to edit the `height` and `min-height` variables to suit.

```css

.frame
{
	width: 100%;
	height: calc(100vw * 0.2);
	overflow: hidden;
	position: relative;
}

.frameLayer
{
	position: absolute;
	width: 120%;
	display: block;
	top: -9999px;
	bottom: -9999px;
	left: -9999px;
	right: -9999px;
	margin: auto;
	max-width: auto;
}

/* css for mobile */
@media (hover:none), (hover:on-demand) 
{ 
	.frame 
	{ 
		min-height: calc(100vmax * 0.25);
	}
	.frameLayer
	{
		width: 150%;
	}
}
```

## preload.js

`preload.js` will automatically attempt to preload files detected in `image` and `background` tags. To preload files found in other tags, you'll need to add those tags yourself.

The following code will allow preloading of files from a number of audio and image tags.

```js
options.preload_tags.audio.push("play", "pause", "resume", "stop");
options.preload_tags.image.push("frame");
```

You can also add tags to `options.preload_tags.other` through the same method. 

The distinction between audio, image, and other types of files is used to simplify project structure (allowing you to put the relevant files in `defaultaudiolocation` and `defaultimagelocation`), and to simplify your ink (unspecified audio and image file types will default to `defaultaudioformat` and `defaultimageformat` respectively).

## shortcuts/choices.js

`choices.js` is a patch that simplifies binding shortcuts to choices. Impossible inputs (such as trying to select the fourth choice when there are only two) will be ignored.

The following code will allow the player to select choices via the number keys. `1` corresponds to the first choice, `2` the second, and so forth.

```js
for (var i = 0; i < 9; i++)
{
	choices.add((i+1).toString(), i, true);
}
```

You can also use the following code to allow the player to continue the story via the `spacebar`, but only if there's a single choice.

```js
choices.add(" ", 0, true, true);
```

## shorthandclasstags.js

To create a shorthand class tag, you'll need to add it to `options.shorthandclasstags_tags`. 

```js
options.shorthandclasstags_tags = ["red"];
```

You'll also need to add a corresponding CSS class. 

```css
.red
{
	color: #f76e6a !important;
}
```

## stepback.js

While `stepback.js` does add the ability to step forwards and backwards, the central functions `stepBack()` and `stepForwards()` won't run unless you call them from elsewhere, generally by binding them to a keypress or GUI element.

The following code binds the keys "Q" to `stepBack()` and "E" to `stepForwards()`.

```js
Patches.add(function() 
{
	Shortcuts.add("q", this.stepBack);
	Shortcuts.add("e", this.stepForwards);
});
```