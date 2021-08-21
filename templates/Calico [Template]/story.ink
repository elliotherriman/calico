// IMPORT THE STORYLET LIBRARY
// (WE NEED TO IMPORT SOMETHING INTO THE ENGINE TOO)
INCLUDE patches/storylets.ink

// ========================================
// THE BASICS
// ========================================
/*

This is the most basic version of a storylet in ink.

	== storylet
	#storylet

	= text
	[text inside your storylet]
	->->

Each storylet needs to have a stitch called "text".
The text stitch of each knot should end with either... 
	"->->", if you want the story to continue after your initial tunnel
	"-> DONE", if you want the text to end there.

Storylets can also have stitches called "open", "urgency", "exclusivity".
To give a storylet openness, urgency, or exclusivity, simply print that value between two curly brackets in the relevant stitch.

If a storylet doesn't have an open stitch, it is always available.
If a storylet doesn't have an urgency stitch, then its urgency is 0.
If a storylet doesn't have an exclusivity stitch, then its exclusivity is 0.

I've included a more comprehensive explanation in "storylets.ink".
*/

// ========================================
// HOW TO CALL STORYLETS
// ========================================

// JUMP TO A STORYLET
 -> openStorylets ->

// JUMP TO A STORYLET WITHIN A SPECIFIC CATEGORY
 -> filteredStorylets("category") ->

// CONTINUE AFTERWARDS
AND WE'RE BACK!
-> DONE

// PLEASE KEEP IN MIND THAT STORYLETS WILL NOT WORK IN INKY'S PREVIEW PLAYER.
// THEY'LL ONLY WORK ONCE YOU'VE IMPORTED YOUR STORY INTO THE WEB PLAYER.
// I TRIED TO MAKE IT HAPPEN BUT UNFORTUNATELY IT WOULD BE A LOT OF WORK,
// AND I'M VERY, VERY TIRED.

// ========================================
// SAMPLE STORYLETS
// ========================================
// By default, you should see storylet3, and then storylet1 or storylet2, and then the message above.
// You can change that by tweaking the urgency and exclusivity of each knot.

=== storylet1
#storylet: category

VAR x = true
VAR y = true
VAR z = 3

-> DONE

= open
{x && y}
-> DONE

= urgency
~ temp _urgency = 0
{z > 2: 
	~ _urgency = z
}
{_urgency}  
-> DONE

= text
You've reached the first storylet!
->->
  
=== storylet2
#storylet: category
-> DONE 

= urgency
{3} 
-> DONE

= text
This is storylet two!
->->
 
=== storylet3
#storylet 
-> DONE

= exclusivity
{3}
-> DONE 

= text
Storylet three!
- 
->->