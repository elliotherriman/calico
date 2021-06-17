# Events

Calico offers a large number of custom events that you can use to tweak the engine's functionality. If you're unfamiliar with Javascript events, you can read more [here](https://developer.mozilla.org/en-US/docs/Web/Events).

## Responding To Events

To listen for an event, you can use `addEventListener`, and any other related Javascript functions, on the expected DOM target.

By default, events will be sent to the `window` object, but most events manually override this to target their parent story's `outerdiv`. 

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
**Arguments**: story
**Target**: `outerdiv`

**Name**: "story clearing"
**Arguments**: story, delay, howMany
**Target**: `outerdiv`

**Name**: "story restarting"
**Arguments**: story
**Target**: `outerdiv`

**Name**: "story setheight"
**Arguments**: story, old, new
**Target**: `outerdiv`

### Passage Events

Events that concern the current ink passage — all text and data from the start of the story or the player's last input, until the end of the story, or the next available choice.

**Name**: "passage start"
**Arguments**: story
**Target**: `outerdiv`

**Name**: "passage line"
**Arguments**: story, line
**Target**: `outerdiv`

**Name**: "passage line element"
**Arguments**: story, element, line
**Target**: `outerdiv`

**Name**: "passage choice"
**Arguments**: story, choice
**Target**: `outerdiv`

**Name**: "passage choice element"
**Arguments**: story, choice, element
**Target**: `outerdiv`

**Name**: "passage end"
**Arguments**: story, choice
**Target**: `outerdiv`

### Queue Events

Events that concern the queue of elements to be rendered.

**Name**: "queue clear"
**Arguments**: queue, old
**Target**: `outerdiv`

**Name**: "queue setdelay"
**Arguments**: new, old, queue
**Target**: `outerdiv`

**Name**: "queue setlinebyline"
**Arguments**: value, queue
**Target**: `outerdiv`

**Name**: "queue push"
**Arguments**: element, queue
**Target**: `outerdiv`

### Element Events

Events that concern individual lines of text, images, and other HTML elements.

**Name**: "element addclass"
**Arguments**: element, class, queue
**Target**: `outerdiv`

**Name**: "element adddelay"
**Arguments**: element, delay, story, queue
**Target**: `window`

**Name**: "element setproperty"
**Arguments**: element, story, property, new, old, queue
**Target**: `outerdiv`

**Name**: "element added"
**Arguments**: element, story, queue
**Target**: `outerdiv`

**Name**: "element show"
**Arguments**: element, story, queue
**Target**: `outerdiv`

**Name**: "element rendered"
**Arguments**: element, story, queue
**Target**: `outerdiv`

**Name**: "element hide"
**Arguments**: element, story, queue
**Target**: `outerdiv`

**Name**: "element remove"
**Arguments**: element, story, queue
**Target**: `outerdiv`

### Render Events

Events that concern the render process, performed by the queue.

**Name**: "render start"
**Arguments**: story, queue, target
**Target**: `outerdiv`

**Name**: "render finished"
**Arguments**: story, queue, target
**Target**: `outerdiv`

**Name**: "render interrupted"
**Arguments**: story, queue, index, target
**Target**: `outerdiv`

### Tags Events

Events that concern ink tags.

**Name**: "tags add"
**Arguments**: name, function
**Target**: `window`

**Name**: "tags process"
**Arguments**: story, tag
**Target**: `outerdiv`

**Name**: "tags matched"
**Arguments**: story, tag, property
**Target**: `outerdiv`

**Name**: "tags option"
**Arguments**: story, variable, new, old
**Target**: `outerdiv`

**Name**: "tags unhandled"
**Arguments**: tag, property
**Target**: `outerdiv`

### Lexer Events

Events that concern inline ink tags, and text parsing.

**Name**: "lexer add tag"
**Arguments**: tag, function
**Target**: `window`

**Name**: "lexer add pattern"
**Arguments**: pattern, function
**Target**: `window`

**Name**: "lexer process"
**Arguments**: line
**Target**: `outerdiv`

**Name**: "lexer matched tag"
**Arguments**: tag, arguments, function, line
**Target**: `outerdiv`

**Name**: "lexer matched pattern"
**Arguments**: pattern, function, line, tags
**Target**: `outerdiv`

### Text Animation Events

Events that concern text animations.

**Name**: "textanimation create"
**Arguments**: name, effect
**Target**: `window`

**Name**: "textanimation apply"
**Arguments**: element, name, effect
**Target**: `outerdiv`

### Shortcuts Events

Events that concern keyboard shortcuts.

**Name**: "shortcuts add"
**Arguments**: string, callback, type
**Target**: `window`

**Name**: "shortcuts remove"
**Arguments**: string, callback, type
**Target**: `window`

**Name**: "shortcuts process"
**Arguments**: type, input, event
**Target**: `window`

### Window Events

Events that concern the browser window.

**Name**: "window resized"
**Target**: `window`