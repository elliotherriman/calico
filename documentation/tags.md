# Tags

Calico contains several functional tags you can use by default, and makes it easy to define and add more. 

A tag indicates to Calico that you want the engine to do something - maybe you want it to set a background image, delay the appearance of a particular line, clear the screen, or something else.

## Options
More information on how to use tags can be found [here](https://github.com/elliotherriman/calico/blob/main/documentation/getting%20started.md#tags).

Some tags can be customised via options, which by convention are separated with a ">>". For example, in `musicplayer.js`, you can delay a track by using the `delay` option.

```
#play: act4 >> delay: 500
```

## Default Tags

A list of tags offered by Calico's core engine.

### #class
This tag allows you to add a CSS class or classes to the attached line. If you attach CSS styling, this will allow you to customize the appearance of specific lines in the text using a simple tag in ink.

The class tag can be after text on the same line, or on the line after text.

You can apply several classes by adding them separated by spaces.

```
I ran out of the door #class: center
Down the street
#class: rocky center
And tripped over the package #class goblin falcon mango
```

### #image

Adds an image to your story as its own paragraph. 

Calico will look for images in `defaultimagelocation` — by default, a folder called "images" at the root of your project. You can override this by starting your image's name with "./".

 If no image format is given, Calico will fall back to `defaultimagetype`, which by default is ".png".

```
I ran out of the door.
#image: door.png 	// ./images/door.png
#image: package 	// ./images/package.png
#image: postman.gif	// ./images/postman.gif
#image: ./street 	// ./street.png
```

### #background

Works very similarly to `#image`, but instead of placing the image as a paragraph, it sets it as the background of your story's outerdiv.

Example:

```
I ran out of the door #background: door.png
```

### #clear

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

The clear tag is typically used immediately following a choice. 

If the clear tag is included on the same line as a choice, Calico will clear the page's text and the choice at the same time.

```
* choice #clear
-
```

If the clear tag appears on a line after the choice, Calico will first clear the choice, pause, and then clear the rest of the text.

```
* choice
- 
#clear
```

You may wish to use `[` and `]` to wrap your choice's text.

You can also use `#clear` in the middle of a passage. Upon reaching a clear tag, Calico will briefly pause, then remove any text on screen, and continue with the rest of the passage.

### #restart

Starts the story over from the beginning. Clears all text and images, but does not clear background images.

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

### #delay

This tag will add a delay before the text it's attached to appears. 

If a delay tag appears on its own line, or on a line with only other tags, it will add a delay before the next line of text appears. 

The delay is counted in milliseconds.

```
I ran out the door #delay: 500
Down the street
#delay: 1000
And tripped over the package
```

### #linebyline

`#linebyline` will cause Calico to halt after rendering each line, and wait until ``queue.render`` is called again before continuing.

If no argument is provided, line-by-line mode will be toggled. With a ``true`` or ``false`` argument, you can control its behaviour directly.

## Custom Tags

You can define custom tags by calling `Tags.add`. Tags are shared globally, which means two stories running in one game would share the same tags.

`Tags.add` expects two arguments — the tag's name as a string, and the callback to be executed if Calico finds that tag.

If that tag is matched via `Tags.process`, your callback will be executed with the following arguments.

```js
Story story // the story this tag was found in.`
string property // any text found after a ":" in the tag
boolean isAfterText // whether this tag is being executed before or after the current text line
```

Your callback can contain a return value, but it won't be processed. Instead, if you want to make changes to a line, you can access it through the story object's queue.

This is the current code for Calico's class tag.

```js
Tags.add("class", function(story, property) 
			{
				// don't do anything if the class is empty
				if (!property) 
					return;
				
				// if there's multiple classes separated by spaces, 
				// add all of them to the element
				story.queue.addClass(property.split(" "));				
			});
```
