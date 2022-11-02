Ink is a language used to write interactive fiction.

Ink has comprehensive [official documentation](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#writing-with-ink) available, but it's also dense, and at times, hard to navigate. This guide is my attempt to organise and simplify down the essentials of ink into a much smaller document.

If this guide feels overwhelming to you, or you get confused over anything, please let me know — it's a work in progress, and I want to make it as accessible as possible.

<p><details>
<summary><b>Table of contents</b></summary><p>
	
- [The Basics](#the-basics)
  - [Text](#text)
  - [Choices](#choices)
  	- [Creating a choice](#basics-choices)
  	- [Multiple choices](#basics-choices-multiple)
  	- [Marking the end of choices](#basics-choices-gathers)
  	- [Controlling how a choice appears as text](#basics-choices-text)
  	- [Nested choices](#basics-choices-nested)
  	- [Reusable choices](#basics-choices-sticky)
  	- [Labelled choices](#basics-choices-labels)
  	- [Conditional choices](#basics-choices-conditional)
  	- [Fallback choices](#basics-choices-fallback)
  - [Gathers](#gathers)
  	- [Using gathers](#basics-gathers)
  	- [Nested gathers](#basics-gathers-nested)
  	- [Labelled gathers](#basics-gathers-labels)
  - [Glue](#glue)
  	- [Using glue](#basics-glue)
  - [Tags](#tags)
  	- [Using tags](#basics-tags)
  	- [Processing order](#basics-tags-order)
  	- [Styling text](#basics-tags-styling)
  - [Comments](#comments)
  	- [Using comments](#basics-tags)
  
</p></details></p>

## The Basics

### Text

Most of what you'll find in an `.ink` file will look like regular text. If you type out a few words and run your game, those words will be rendered to the screen.

Ink will treat everything you write as if it's plain text, *unless* it sees a symbol that indicates otherwise. There are a lot of symbols, like `*` or `~` or `{` and `}`, each with a particular meaning that depends on the context in which it's used. For example, the character `*` might tell ink to display a choice, or multiply two numbers together, or just show a "*" as regular text, based entirely on its context.

If you want to use a character that would otherwise be interpreted as a symbol, you can add a `\` before that character to escape it (a programming term that I've never really understood).

The rest of this guide will cover these symbols. and how you can best use them. 

### Choices

If you want to add branching paths to your story, or even just to control the pacing in a linear game, you can use choices. These are little lines of text that the player can click to continue the story.

**Important:** Make sure you've read this entire section, and understand the purpose and importance of gathers before jumping into writing a story. Your game will behave *very* strangely if you forget to include gathers after your choices.

<p>
<a name="basics-choices"></a>
<details>
<summary><b>Creating a choice</b></summary>
<br>

To add a choice to your story, start a line with `*`.

```
This is regular text.

* This is a choice!

	This is more text.
```

If you run the passage above, you will see the following.

```
This is regular text.

This is a choice!
```

The last line will, in Calico, look visually distinct. If you click it, it will fade out...

```
This is regular text.
```

And then it will fade in again as regular text, along with any text that comes afterwards.

```
This is regular text.

This is a choice!

This is more text.
```

</details></p>
<p>
<a name="basics-choices-multiple"></a>
<details>
<summary><b>Multiple choices</b></summary>
<br>

It's common, though by no means necessary, to offer the player multiple choices. Sometimes these choices will branch the story significantly, and other times they will lead to the exact same result immediately. Either one is more than fine.

Here's how you do it.

```
* A choice!
	And text that follows.

* A second choice...
	Which also has text after.

* Or a solitary third choice?
```

Any content that comes after a choice, but before another choice or a [gather](#gathers) is considered exclusive to that choice. In the above example, if the player clicks the first choice, it will remove the other choices, and show them...

 ```
 A choice!
 And text that follows.
 ```

Clicking the third choice will likewise remove the other choices, but only show "`Or a solitary third choice?`".

</details></p>

<p>
<a name="basics-choices-gathers"></a>
<details>
<summary><b>Marking the end of choices</b></summary>
<br>

Consider the following.

```
* First choice
	
	Text that's exclusive to the first choice.

* Second choice
```

How does that differ meaningfully from this next passage?

```
* The only choice available, because this is a linear game

[just pretend there's like, a hundred lines of prose here]

* Another solitary choice
```

The answer is... it doesn't. At all. Ink will see those as the same thing. If you render the second passage, you will see this--

```
The only choice available, because this is a linear game
Another solitary choice
```

Which is obviously not what we wanted. It's happening because ink didn't see a `-`, known as a gather, and assumed that all the text in between the two choices was meant to be exclusive to the first.

To fix the example above, we just add a `-` after our first choice. 

```
* The only choice available, because this is a linear game
-

[just pretend there's like, a hundred lines of prose here]

* Another solitary choice
```

Feel free to jump ahead if you want to read up on [gathers](#gathers), but we'll get there soon enough either way. First, there're a few more things to cover about choices.

</details></p>

<p>
<a name="basics-choices-text"></a>
<details>
<summary><b>Controlling how a choice appears as text</b></summary>
<br>

Clicking a choice will remove it, and all other choices, from the page. That choice will then be shown as regular text, along with any content that comes after that choice.

As you've seen in the sections above, you can make content exclusive to a choice. But you can also control how the choice itself shows up as plain text by using `[` and `]`.

At its simplest, if you wrap a choice in square brackets, it won't show up after you click it.

```
This is regular text.

* [This is a choice!]

	This is more text.
```

So once you've clicked the choice, the above would render as...

```
This is regular text.

This is more text.
```

But there's way more we can do with this. Technically, what's happening behind the scenes is that ink is dividing your choice into three sections — what's inside the brackets, and what comes before and after them.

Anything before or inside the brackets will be shown before the choice is chosen.

Anything before and after the brackets will be shown after the choice is chosen.

To use an example from [Winter](https://communistsister.itch.io/winter), 

```
* Winter's eyes widen very slightly[.], and I realise just what I could do to her.
```

This choice will render as...

```
Winter's eyes widen very slightly.
```

But when clicked, the text that replaces it will look like this.

```
Winter's eyes widen very slightly, and I realise just what I could do to her.
```

You may also be able to use [#glue](#gathers) (`<>`), depending on the situation, to similar effects.

</details></p>

<p>
<a name="basics-choices-nested"></a>
<details>
<summary><b>Nested choices</b></summary>
<br>

Sometimes, you might want to include choices that are exclusive to other choices. That's easy. You just add an extra `*`.

```
* A choice, and...
	
	Text that shows up after the first choice.
	
	** A second choice!
		
		And text that shows up after the second choice.
	--
-
```

For each level of depth, you'll need to add an extra `*`. You'll also need to add an extra `-`, if you want to use a gather inside that first choice.

</details></p>

Everything that's left in this section on choices is a little more advanced, and probably won't be necessary if you're just interested in writing a simple story. Feel free to skip ahead to the next section, and come back later once you're more familiar with the basics.

<p>
<a name="basics-choices-sticky"></a>
<details>
<summary><b>Reusable choices</b></summary>
<br>

By default, each choice can only be taken once. If you expect a player to revisit a section, you can use something called a sticky choice, created with `+` instead of `*` , that can be used an infinite number of times.

Like regular choices and gathers, you can nest a sticky choice inside another choice by adding an extra `+` for each level of depth.

</details></p>

<p>
<a name="basics-choices-labels"></a>
<details>
<summary><b>Labelled choices</b></summary>
<br>

By using `(` and `)`, you can label a choice using a single word made of alphanumeric characters and underscores. Labels aren't shown to the player, but are instead used like knots and stitches.

```
* (webbLaunch) That's finally goin' up?
```

By adding a label to a choice, you can conveniently create a way of tracking whether a particular choice was chosen.

```
* (ask) "What am I meant to do with this sword?"
* "Stick 'em with the sharp bit, right?"
-

You adjust your grip on the hilt {ask: nervously|expertly}.
```

You can also use a choice label as a divert target.

```
-> ask

* (ask) "What am I meant to do with this sword?"
```

Diverting to a choice will tell ink that it's been visited, which means `*` choices will be removed, even if they weren't explicitly chosen.

Diverting to a choice will also show the choice as plain text, after accounting for text suppressed using `[` and `]`.

</details></p>

<p>
<a name="basics-choices-conditional"></a>
<details>
<summary><b>Conditional choices</b></summary>
<br>

You can use inline conditionals to determine whether a choice should be available to the player.

```
= eight

* (drank) I drink.[] It's not very good wine.
	-> eight
* {not drank} I hesitate.[] She makes a little drinking motion with her hand.
	-> eight
* {drank} I take another swig. #clear
-
```

If you're using both a conditional and a label, make sure you put the label first.

```
* (drankTooMuch) {drank} You drink again.
```

</details></p>

<p>
<a name="basics-choices-fallback"></a>
<details>
<summary><b>Fallback choices</b></summary>
<br>

Since some choices can disappear (if you use `*`), or never appear (if you use conditionals), the player might find themselves in a situation where they don't have any choices left to click.

One solution involves using `+` to create sticky choices, but you can also use fallback choices. These are automatically chosen by ink if no other choice is available to the player, and don't contain any text.

Fallback choices look like this.

```
* ->
	Fallback text.
-
```

Or they look like this, if you want them to immediately divert.

```
* -> finale
```

The official ink documentation has a [good example](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#example-of-a-fallback-choice), which I've included here.

```
=== find_help ===

	You search desperately for a friendly face in the crowd. 
	*	The woman in the hat[?] pushes you roughly aside. -> find_help
	*	The man with the briefcase[?] looks disgusted as you stumble past him. -> find_help 
	*	->
		But it is too late: you collapse onto the station platform. This is the end.
		-> END
```

Fallback choices can also be sticky.

```
=== conversation_loop 
	*	[Talk about the weather] -> chat_weather 
	*	[Talk about the children] -> chat_children 
	+	-> sit_in_silence_again
```

</details></p>

### Gathers

Once ink finds a choice, it will look ahead and collect as many choices as it can to show the player, only stopping once it finds a gather (`-`) or runs out of content. 

Including a gather is really, really important if you want to distinguish between text that's exclusive to a choice, and text that should come after any choice is chosen.

<p>
<a name="basics-gathers"></a>
<details>
<summary><b>Using gathers</b></summary>
<br>

Take a look at the following example.
```
* A choice
	Exclusive text
* A second choice
	More exclusive text
- // a gather
Text that will show up either way.

* A final choice.
```

If the gather was omitted, ink would show the following to the player.

```
A choice
A second choice
A final choice
```

And by clicking the second choice, the player would see...

```
A second choice
More exclusive text
Text that will show up either way
```
</details></p>

<p>
<a name="basics-gathers-nested"></a>
<details>
<summary><b>Nested gathers</b></summary>
<br>

Like regular (`*`) and sticky (`+`) choices, gathers can be nested within choices. You'll just need to add an extra `-` for each level of depth.

```
* A choice, and...
	
	Text that shows up after the first choice.
	
	** A second choice!
		
		And text that shows up after the second choice.
	--
-
```

</details></p>

<p>
<a name="basics-gathers-labels"></a>
<details>
<summary><b>Labelled gathers</b></summary>
<br>

You can add a label to gathers in the same way you can add them to choices. Just add a name (that only contains letters, numbers, and underscores) in brackets after a gather.

```
- (goHome)
```

A labelled gather can follow a block of choices, but it can also be anywhere else. Ink won't tell you off, even if you include a dozen gathers in a story that doesn't have a single choice.

Labelling choices allows us to divert to that line from elsewhere in the story, which can be much more convenient than breaking your story up into progressively smaller knots and stitches. 

Also, it lets you test that label like a variable to see if it's been visited.

Keep in mind, if you're labelling a nested gather, it needs to have one more `-` than the level above it, otherwise ink will see that as the end of that choice block.

```
* A choice

	** A nested choice
	-- (label)
-
```

</details></p>

### Glue
By default, if you have text on two different lines in your `.ink` file, it will render as two different lines in your game. If you want to combine them, you can use glue (`<>`).

<p>
<a name="basics-glue"></a>
<details>
<summary><b>Using glue</b></summary>
<br>

To glue two lines together, add glue to the end of the first line, or the start of the second.

```
First line...
<> second line.

Third, <>
and fourth!
```

Which will produce...

```
First line... second line.
Third, and fourth!
```

Glue can appear at the start of one line *and* at the end of the next, too. The following is totally fine.

```
One, <>
two, <>
<> three!
```

Which produces...

```
One, two, three!
```

Glue will persist across diverts, and will also apply to choices.

Keep in mind, though, that there's no way to remove glue from a line. You can't separate them.

</details></p>

### Tags

Tags are used to add invisible information to a line. When Calico reaches that line, it will process your tag without ever showing it to the player.

Tags are frequently used to do things like inserting images, playing music, or clearing the page of previous passages. You can see a list of tags that Calico currently supports, along with a guide on how to create your own, over [here](https://github.com/elliotherriman/calico/blob/main/documentation/tags.md).

<p>
<a name="basics-tags"></a>
<details>
<summary><b>Using tags</b></summary>
<br>

Tags are marked with a `#`, and any text after is seen as part of that tag. You can include a "#" in your story by escaping it, like so "\#".

```
A line of text, that includes a \#, and also a... #tag
```

```
A line of text, that includes a #, and also a...
```

You can add several tags to the same line by delimiting with ``#``:

```
I ran out of the door #image: door.png #delay: 500
```

</details></p>
<p>
<a name="basics-tags-order"></a>
<details>
<summary><b>Processing order</b></summary>
<br>

Take the following example.

```
#tag1
Text #tag2
```

In Calico, `#tag1` will be processed before "Text", and "Text" will be processed before `#tag2`. 

This is in contrast to other implementations of ink, where both tags would be processed before the text.

If you prefer the old behaviour, the patch `forcetagsbeforeline.js` will ensure all tags run before a line is processed.

</details></p>
<p>
<a name="basics-tags-arguments"></a>
<details>
<summary><b>Arguments and options</b></summary>
<br>

Some tags expect arguments, which Calico will process alongside the tag.

```
#tag: value
```

Some patches include tags that support multiple values, like so--

```
#tag: value, value2, value3
```

Some patches also support options, which by convention are separated with a "|". For example, in `musicplayer.js`, you can apply a custom `fadein` value by supplying it as an option.

```
#play: file | fadein: 1000
```

</details></p>
<p>
<a name="basics-tags-styling"></a>
<details>
<summary><b>Styling text</b></summary>
<br>

Calico technically has two ways of processing tags. Tags added to the `Tags` class will apply before or after a line has been assembled. Tags added to the `Parser` class will apply while a line is being assembled.

This makes Parser tags really, really handy for styling text, allowing you to easily set the font, colour, and any other CSS properties for a word or line.

</details></p>
<p>
<a name="basics-tags-list"></a>
<details>
<summary><b>List of tags</b></summary>
<br>

You can see a list of tags that Calico supports out of the box [here](https://github.com/elliotherriman/calico/blob/main/documentation/tags.md).
</details></p>

### Comments

If you want to leave notes inside your ink, you can create a comment by prepending text with `//`.

<p>
<a name="basics-tags"></a>
<details>
<summary><b>Using comments</b></summary>
<br>

Any line that starts appears after `//` won't be shown to the player. Unlike tags, comments are automatically removed by the compiler, and won't show up in your exported `.json` file. 

```
// here's some text that won't show up
And here's some text that will!
```

This applies to instances of `//` anywhere in a line.

```
And here's some text *will* show up... // and a comment that won't
```

</details></p>
