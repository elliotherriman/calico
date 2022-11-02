# Events

Calico offers a large number of custom events that you can use to tweak the engine's functionality. If you're unfamiliar with Javascript events, you can read more [here](https://developer.mozilla.org/en-US/docs/Web/Events).

## Responding To Events

To listen for an event, you can use `addEventListener`, and any other related Javascript functions, on the expected DOM target.

By default, events will be sent to the `window` object, but most events manually override this to target their parent story's `outerdiv`.

If your code isn't working, make sure you're using the right target.

As long as your code doesn't contain any asynchronous code, Calico will wait until your code has finished execution before continuing.

## Arguments

Many events include arguments that can be accessed through `event.detail`, like so.

```js
Patches.add(function()
{
	this.outerdiv.addEventListener("passage line", (event) =>
	{
		console.log(event.detail.line);
	});
});
```

As a general rule, if an argument is an object, then any changes you make to it will persist in Calico's core loop. For example, this would allow you to alter any or every line of text that Calico processes.

Conversely, if an argument is not an object — a string, a number, a boolean, and so forth — then any changes you make will not persist when Calico resumes execution.

## Targeting `outerdiv`

If you look over existing patches, you may find that Calico targets a story's `outerdiv` using both `this.outerdiv` and `story.outerdiv`. These are functionally the same thing — `this` is used when inside a story's function, and `story` is used when a story has been passed into the current function as an argument.

# List Of Events

All the events contained in the core Calico engine. I'll try to fill in descriptions of each event and their arguments as soon as possible.

### Story Events

Events that concern your story overall, and its inner and outer divs.

**Name**: "story ready"
<br>
**Arguments**: story
<br>
**Target**: `outerdiv`

**Name**: "story clearing"
<br>
**Arguments**: story, delay, howMany
<br>
**Target**: `outerdiv`

**Name**: "story restarting"
<br>
**Arguments**: story
<br>
**Target**: `outerdiv`

**Name**: "story setheight"
<br>
**Arguments**: story, old, new
<br>
**Target**: `outerdiv`

### Passage Events

Events that concern the current ink passage — all text and data from the start of the story or the player's last input, until the end of the story, or the next available choice.

**Name**: "passage start"
<br>
**Arguments**: story
<br>
**Target**: `outerdiv`

**Name**: "passage line"
<br>
**Arguments**: story, line
<br>
**Target**: `outerdiv`

**Name**: "passage line element"
<br>
**Arguments**: story, element, line
<br>
**Target**: `outerdiv`

**Name**: "passage choice"
<br>
**Arguments**: story, choice
<br>
**Target**: `outerdiv`

**Name**: "passage choice element"
<br>
**Arguments**: story, choice, element
<br>
**Target**: `outerdiv`

**Name**: "passage end"
<br>
**Arguments**: story, choice
<br>
**Target**: `outerdiv`

### Queue Events

Events that concern the queue of elements to be rendered.

**Name**: "queue clear"
<br>
**Arguments**: queue, old
<br>
**Target**: `outerdiv`

**Name**: "queue setdelay"
<br>
**Arguments**: new, old, queue
<br>
**Target**: `outerdiv`

**Name**: "queue setlinebyline"
<br>
**Arguments**: value, queue
<br>
**Target**: `outerdiv`

**Name**: "queue push"
<br>
**Arguments**: element, queue
<br>
**Target**: `outerdiv`

### Element Events

Events that concern individual lines of text, images, and other HTML elements.

**Name**: "element addclass"
<br>
**Arguments**: element, class, queue
<br>
**Target**: `outerdiv`

**Name**: "element adddelay"
<br>
**Arguments**: element, delay, story, queue
<br>
**Target**: `window`

**Name**: "element setproperty"
<br>
**Arguments**: element, story, property, new, old, queue
<br>
**Target**: `outerdiv`

**Name**: "element added"
<br>
**Arguments**: element, story, queue
<br>
**Target**: `outerdiv`

**Name**: "element show"
<br>
**Arguments**: element, story, queue
<br>
**Target**: `outerdiv`

**Name**: "element rendered"
<br>
**Arguments**: element, story, queue
<br>
**Target**: `outerdiv`

**Name**: "element hide"
<br>
**Arguments**: element, story, queue
<br>
**Target**: `outerdiv`

**Name**: "element remove"
<br>
**Arguments**: element, story, queue
<br>
**Target**: `outerdiv`

### Render Events

Events that concern the render process, performed by the queue.

**Name**: "render start"
<br>
**Arguments**: story, queue, target
<br>
**Target**: `outerdiv`

**Name**: "render finished"
<br>
**Arguments**: story, queue, target
<br>
**Target**: `outerdiv`

**Name**: "render interrupted"
<br>
**Arguments**: story, queue, index, target
<br>
**Target**: `outerdiv`

### Tags Events

Events that concern ink tags.

**Name**: "tags add"
<br>
**Arguments**: name, function
<br>
**Target**: `window`

**Name**: "tags process"
<br>
**Arguments**: story, tag
<br>
**Target**: `outerdiv`

**Name**: "tags matched"
<br>
**Arguments**: story, tag, property
<br>
**Target**: `outerdiv`

**Name**: "tags option"
<br>
**Arguments**: story, variable, new, old
<br>
**Target**: `outerdiv`

**Name**: "tags unhandled"
<br>
**Arguments**: tag, property
<br>
**Target**: `outerdiv`

### Parser Events

Events that concern inline ink tags, and text parsing.

**Name**: "parser add tag"
<br>
**Arguments**: tag, function
<br>
**Target**: `window`

**Name**: "parser add pattern"
<br>
**Arguments**: pattern, function
<br>
**Target**: `window`

**Name**: "parser process"
<br>
**Arguments**: line
<br>
**Target**: `outerdiv`

**Name**: "parser matched tag"
<br>
**Arguments**: tag, arguments, function, line
<br>
**Target**: `outerdiv`

**Name**: "parser matched pattern"
<br>
**Arguments**: pattern, function, line, tags
<br>
**Target**: `outerdiv`

### Text Animation Events

Events that concern text animations.

**Name**: "textanimation create"
<br>
**Arguments**: name, effect
<br>
**Target**: `window`

**Name**: "textanimation apply"
<br>
**Arguments**: element, name, effect
<br>
**Target**: `outerdiv`

### Shortcuts Events

Events that concern keyboard shortcuts.

**Name**: "shortcuts add"
<br>
**Arguments**: string, callback, type
<br>
**Target**: `window`

**Name**: "shortcuts remove"
<br>
**Arguments**: string, callback, type
<br>
**Target**: `window`

**Name**: "shortcuts process"
<br>
**Arguments**: type, input, event
<br>
**Target**: `window`

### Window Events

Events that concern the browser window.

**Name**: "window resized"
<br>
**Target**: `window`
