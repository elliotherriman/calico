VAR savings = 50

You're late to work, so you...

<- storylets(0)
* -> 
	Actually, no, you don't do anything. You just stay in bed.
-

=== subway
	# storylet
	{savings < 2.70: -> DONE}

	* Take the subway
	-

	-> work

=== cab
	# storylet
	{savings < 25: -> DONE}

	* Take a cab
	-

	-> work

=== work

	Yeah, you should've stayed in bed.

=== storylets(index)

	{index < 0: -> DONE}
	~ temp cc = CHOICE_COUNT()
	~ temp storylet = get_storylet(index)
	<- storylet

	{CHOICE_COUNT() == cc: <- storylets(index+1)}

EXTERNAL get_storylet(index)