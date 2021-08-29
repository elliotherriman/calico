A quick reference for obscure features in ink.

## WEB PLAYER TAGS

A list of tags that can be used with Inky's native web player. Capitalisation matters. Some of these tags expect a property, in the form of `#TAG: property`.

```
theme
author
AUDIO
AUDIOLOOP
IMAGE
LINK
LINKOPEN
BACKGROUND
CLASS
CLEAR
RESTART
```

## NATIVE FUNCTION CALLS

```
Add : +
Subtract : -
Divide : /
Multiply : *
Mod : %
Negate : _

Equal : ==
Greater : >
Less : <
GreaterThanOrEquals : >=
LessThanOrEquals : <=
NotEquals : !=
Not : !

And : &&
Or : ||

Min : MIN
Max : MAX

Pow : POW
Floor : FLOOR
Ceiling : CEILING
Int : INT
Float : FLOAT

Has : ?
Hasnt : !?
Intersect : ^

ListMin : LIST_MIN
ListMax : LIST_MAX
All : LIST_ALL
Count : LIST_COUNT
ValueOfList : LIST_VALUE
Invert : LIST_INVERT
```

## OPERATIONS WITH PLAIN TEXT ALTERNATIVES

```
&& : and
|| : or
% : mod
? : has
!? : hasnt
```

## OTHER FUNCTIONS

```
CHOICE_COUNT
TURNS_SINCE
TURNS
RANDOM
SEED_RANDOM
LIST_VALUE
LIST_RANDOM
READ_COUNT
```

## CONTROL COMMAND TYPES

Not necessary unless you're doing some truly wild things with the ink runtime.

```
-1 : NotSet
0 : EvalStart
1 : EvalOutput
2 : EvalEnd
3 : Duplicate
4 : PopEvaluatedValue
5 : PopFunction
6 : PopTunnel
7 : BeginString
8 : EndString
9 : NoOp
10 : ChoiceCount
11 : Turns
12 : TurnsSince
13 : Random
14 : SeedRandom
15 : VisitIndex
16 : SequenceShuffleIndex
17 : StartThread
18 : Done
19 : End
20 : ListFromInt
21 : ListRange
22 : ListRandom
23 : ReadCount
24 : TOTAL_VALUES
```