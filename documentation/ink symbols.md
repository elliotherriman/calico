# Ink Symbols

## Introduction

This is a simple, incomplete guide to inkle's ink. Although the ink documentation is comprehensive, it's also hard to navigate, and borderline impossible to just search for a symbol to figure out what it means. This is a mostly complete list of all those symbols, which you can easily search for here, and then click to expand for more details.

Right now, most of the details you'll find will simply be links to the original documentation. My plan is to expand that shortly, but... sleep beckons, and I'd rather let people use a half finished version than nothing at all.

## Content

- [Includes `INCLUDE`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#script-files-can-be-combined)
- [Text](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#the-simplest-ink-script)
- [Tags `#` `:`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#tags)
- [Choices `*` `**` `***`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#2-choices)
- [Sticky choices `+` `++` `+++`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#sticky-choices)
- [Fallback choices `*` `->`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#fallback-choices)
- [Suppress choice text `*` `[]`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#suppressing-choice-text)
- [Glue `<>`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#glue)
- [Gathers `-` `--` `---`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#1-gathers)
- [Alternatives `{}` `|` `&` `!` `~`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#sequences-cycles-and-other-alternatives)  
  have to "*\ " choices if you want to start them with a sequence
- Sequences `{}` `|`
- Cycles `{}` `|` `&`
- Once-only sequences `{}` `|` `!`
- Shuffles `{}` `|` `~`
- [Knots `==` `===`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#pieces-of-content-are-called-knots)
- [Stitches `=`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#knots-can-be-subdivided)
- [Labelled gathers `-` `()`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#gathers-and-options-can-be-labelled)
- [Labelled choices `*` `()`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#advanced-all-options-can-be-labelled)
- [Diverts `->`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#4-diverts)
- [Tunnels `->` `->`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#1-tunnels)
- [Threads `<-`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#2-threads)
- [Done `-> DONE`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#using---done)
- [End `-> END`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#advanced-a-knottier-hello-world)
- [Comments `//` `/**/`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#comments)
- Escape character `\`

---

## Variables

- [Variables `VAR` `=`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#defining-global-variables)  
  distinguish types: integer, floating point (decimal), content, or a story address.
- [Constants `CONST` `=`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#global-constants)
- [Lists `LIST`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#1-basic-lists)
- [Print variable as text `{}`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#printing-variables)
- [Code lines`~`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#2-logic)
- Set variable to `~` `=`
- [Temporary variables `~` `temp` `VAR` `=`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#4-temporary-variables)
- [Mathematical operations `~` `=` `+` `-` `+=` `-=` `*` `/` `%` `mod` `++` `--` `INT()` `FLOAT()` `FLOOR()` `POW()` `RANDOM()`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#mathematics)
  - Add `~` `+`
  - Subtract `~` `-`
  - Add and assign `~` `+=`
  - Subtract and assign `~` `-=`
  - Multiply `~` `*`
  - Divide `~` `/`
  - Modulo, remainder `~` `%` `mod`
  - Increment variable `~` `++`  
    has additional meaning in other languages, but here, is literally just identical to +=
  - Decrement variable `~` `--`  
    has additional meaning in other languages, but here, is literally just identical to -=
  - [Round numbers `INT()` `FLOAT()` `FLOOR()`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#advanced-int-floor-and-float)
  - X to the power of Y `POW()`
  - [Generate a random number `RANDOM()`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#randommin-max)

---

## Conditionals

- Conditional content `{}` `:` `|` `-` `else`  
  - [one line if](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#conditional-text)
  - [one line if else](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#conditional-text)
  - [multi line if](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#a-simple-if)
  - [if, else](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#a-simple-if)
  - [if, else if, else](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#extended-ifelse-ifelse-blocks)
  - [switch statements](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#switch-blocks)
- Conditional choices `*` `{}`
  - [Basic](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#conditional-choices)
  - [Advanced](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#advanced-multiple-conditions)

---

## Comparisons

- Is equal to `==`
- Is less than `<`
- Is greater than `>`
- Is less than or equal to `<=`
- Is greater than or equal to `>=`
- [Not `!` `not`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#logical-operators-and-and-or)  
  use `not` instead of `!`, otherwise compiler may see text as once only list
- [And `&&` `and`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#logical-operators-and-and-or)
- [Or `||` `or`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#logical-operators-and-and-or)

---

## Functions

- [Functions `==` `===` `FUNCTION` `()`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#5-functions)
- Return value from function `~` `return`
- Game queries `()` `CHOICE_COUNT()` `TURNS()` `TURNS_SINCE()` `->` `SEED_RANDOM()`
  - [Count available choices `CHOICE_COUNT()`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#choice_count)
  - [Count turns played so far `TURNS()`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#turns)
  - [Turns since labelled content `TURNS_SINCE()` `->`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#turns_since--knot)
  - [Set the random number generator's seed `SEED_RANDOM()`](https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#seed_random)
- [External functions `EXTERNAL` `()`](https://github.com/inkle/ink/blob/master/Documentation/RunningYourInk.md#external-functions)
