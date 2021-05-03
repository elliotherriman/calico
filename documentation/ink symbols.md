### Introduction

This is a simple, incomplete guide to inkle's ink. Although the ink documentation is comprehensive, it's also hard to navigate, and borderline impossible to just search for a simple to figure out what it means. This is a mostly complete list of all those symbols, which you can easily search for here, and then click to expand for more details.

Right now, most of the details you'll find will simply be links to the original documentation. My plan is to expand that shortly, but... sleep beckons, and I'd rather let people use a half finished version than nothing at all.

### Content

<p><details><summary>Includes <code>INCLUDE</code></summary>

Learn more [here](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#script-files-can-be-combined).

</details></p>

<p><details><summary>Text</summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#the-simplest-ink-script

</details></p>

<p><details><summary>Tags <code>#</code> <code>:</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#tags

</details></p>

<p><details><summary>Choices <code>*</code> <code>**</code> <code>***</code> </summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#2-choices

</details></p>

<p><details><summary>Sticky choices <code>+</code> <code>++</code> <code>+++</code> </summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#sticky-choices

</details></p> 

<p><details><summary>Fallback choices <code>*</code> <code>-></code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#fallback-choices

</details></p>

<p><details><summary>Suppress choice text <code>*</code> <code>[]</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#suppressing-choice-text

</details></p>

<p><details><summary>Glue <code><></code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#glue

</details></p>

<p><details><summary>Gathers <code>-</code> <code>--</code> <code>---</code> </summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#1-gathers

</details></p>

<p><details><summary>Alternatives <code>{}</code> <code>|</code> <code>&</code> <code>!</code> <code>~</code></summary>

have to "*\ " choices if you want to start them with a sequence

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#sequences-cycles-and-other-alternatives

<p><details><summary>Sequences <code>{}</code> <code>|</code></summary>



</details></p>

<p><details><summary>Cycles <code>{}</code> <code>|</code> <code>&</code></summary>



</details></p>

<p><details><summary>Once-only sequences <code>{}</code> <code>|</code> <code>!</code></summary>



</details></p>

<p><details><summary>Shuffles <code>{}</code> <code>|</code> <code>~</code></summary>



</details></p>

</details></p>

<p><details><summary>Knots <code>==</code> <code>===</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#pieces-of-content-are-called-knots

</details></p>

<p><details><summary>Stitches <code>=</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#knots-can-be-subdivided

</details></p>

<p><details><summary>Labelled gathers <code>-</code> <code>()</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#gathers-and-options-can-be-labelled

</details></p>

<p><details><summary>Labelled choices <code>*</code> <code>()</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#advanced-all-options-can-be-labelled

</details></p>

<p><details><summary>Diverts <code>-></code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#4-diverts

</details></p>

<p><details><summary>Tunnels <code>-></code> <code>-></code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#1-tunnels

</details></p>

<p><details><summary>Threads <code><-</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#2-threads

</details></p>

<p><details><summary>Done <code>-> DONE</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#using---done

</details></p>

<p><details><summary>End <code>-> END</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#advanced-a-knottier-hello-world

</details></p>

<p><details><summary>Comments <code>//</code> <code>/* */</code> </summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#comments

</details></p>

<p><details><summary>Escape character <code>\</code></summary>



</details></p>

---

### Variables

<p><details><summary>Variables <code>VAR</code> <code>=</code></summary>

distinguish types
	integer, floating point (decimal), content, or a story address.

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#defining-global-variables

</details></p>

<p><details><summary>Constants <code>CONST</code> <code>=</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#global-constants

</details></p>

<p><details><summary>Lists <code>LIST</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#1-basic-lists

</details></p>

<p><details><summary>Print variable as text <code>{}</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#printing-variables

</details></p>

<p><details><summary>Code lines<code>~</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#2-logic

</details></p>

<p><details><summary>Set variable to <code>~</code> <code>=</code></summary>



</details></p>

<p><details><summary>Temporary variables <code>~</code> <code>temp</code> <code>VAR</code> <code>=</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#4-temporary-variables

</details></p>

<p><details><summary>Mathematical operations <code>~</code> <code>=</code> <code>+</code> <code>-</code> <code>+=</code> <code>-=</code> <code>*</code> <code>/</code> <code>%</code> <code>mod</code> <code>++</code> <code>--</code> <code>INT()</code> <code>FLOAT()</code> <code>FLOOR()</code> <code>POW()</code> <code>RANDOM()</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#mathematics

<p><details><summary>	Add <code>~</code> <code>+</code></summary>



</details></p>

<p><details><summary>	Subtract <code>~</code> <code>-</code></summary>



</details></p>

<p><details><summary>	Add and assign <code>~</code> <code>+=</code></summary>



</details></p>

<p><details><summary>	Subtract and assign <code>~</code> <code>-=</code></summary>



</details></p>

<p><details><summary>	Multiply <code>~</code> <code>*</code></summary>



</details></p>

<p><details><summary>	Divide <code>~</code> <code>/</code></summary>



</details></p>

<p><details><summary>	Modulo, remainder <code>~</code> <code>%</code> <code>mod</code></summary>



</details></p>

<p><details><summary>	Increment variable <code>~</code> <code>++</code></summary>

has additional meaning in other languages, but here, is literally just identical to +=

</details></p>

<p><details><summary>	Decrement variable <code>~</code> <code>--</code></summary>

has additional meaning in other languages, but here, is literally just identical to -=

</details></p>

<p><details><summary>	Round numbers <code>INT()</code> <code>FLOAT()</code> <code>FLOOR()</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#advanced-int-floor-and-float

</details></p>

<p><details><summary>	X to the power of Y <code>POW()</code></summary>



</details></p>

<p><details><summary>Generate a random number <code>RANDOM()</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#randommin-max

</details></p>

</details></p>

---

### Conditionals

<p><details><summary>Conditional content <code>{}</code> <code>:</code> <code>|</code> <code>-</code> <code>else</code></summary>

one line if
https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#conditional-text

one line if else
https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#conditional-text

multi line if
https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#a-simple-if

if, else
https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#a-simple-if

if, else if, else 
https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#extended-ifelse-ifelse-blocks

switch statements
https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#switch-blocks

</details></p>
	
<p><details><summary>Conditional choices <code>*</code> <code>{}</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#conditional-choices

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#advanced-multiple-conditions

</details></p>

---

### Comparisons

<p><details><summary>Is equal to <code>==</code></summary>



</details></p>

<p><details><summary>Is less than <code><</code></summary>



</details></p>

<p><details><summary>Is greater than <code>></code></summary>



</details></p>

<p><details><summary>Is less than or equal to <code><=</code></summary>



</details></p>

<p><details><summary>Is greater than or equal to <code>>=</code></summary>



</details></p>

<p><details><summary>Not <code>!</code> <code>not</code></summary>

use not instead of !, otherwise compiler may see text as once only list

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#logical-operators-and-and-or

</details></p>

<p><details><summary>And <code>&&</code> <code>and</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#logical-operators-and-and-or

</details></p>

<p><details><summary>Or <code>||</code> <code>or</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#logical-operators-and-and-or

</details></p>

---

### Functions

<p><details><summary>Functions <code>==</code> <code>===</code> <code>FUNCTION</code> <code>()</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#5-functions

</details></p>

<p><details><summary>Return value from function <code>~</code> <code>return</code></summary>



</details></p>

<p><details><summary>Game queries <code>()</code> <code>CHOICE_COUNT()</code> <code>TURNS()</code> <code>TURNS_SINCE()</code> <code>-></code> <code>SEED_RANDOM()</code> </summary> 

<p><details><summary>Count available choices <code>CHOICE_COUNT()</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#choice_count

</details></p> 

<p><details><summary>Count turns played so far <code>TURNS()</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#turns

</details></p> 

<p><details><summary>Turns since labelled content <code>TURNS_SINCE()</code> <code>-></code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#turns_since--knot

</details></p>

<p><details><summary>Set the random number generator's seed <code>SEED_RANDOM()</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#seed_random

</details></p>

</details></p> 

<p><details><summary>External functions <code>EXTERNAL</code> <code>()</code></summary>

https://github.com/inkle/ink/blob/master/Documentation/RunningYourInk.md#external-functions

</details></p>
