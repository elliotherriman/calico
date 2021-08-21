/** 

	========================================
	STORYLET FUNCTIONS
	========================================
	An extension library for Ink.
	
	If you have any issues, feel free to hit me up on Twitter.

		https://twitter.com/elliotherriman

	WHAT IS A STORYLET?

		To quote Em Short, "Storylet systems are a way of organizing narrative content with more flexibility than the typical branching narrative."

		You can read more here: https://emshort.blog/2019/11/29/storylets-you-want-them/

	CREATING STORYLETS

		Storylets are knots that are tagged with the tag "#storylet". Storylets must contain a stitch named "text", and may also contain additional stitches.
		
		If you're not familiar with those things, that's *very* fair. I'd suggest reading this introduction to Ink.

			https://www.inklestudios.com/ink/web-tutorial/

	STORYLET CATEGORIES

		Instead of using "#storylet" to create a storylet, you can create a categorised storylet using a tag in the form of--
		
			#storylet: yourCategory 
		
	ACCESSING STORYLETS

		Storylets can be accessed using tunnels, like so.
		
			-> openStorylets ->

		Alternatively, you can use the following to only search for storylets within a certain category.
			
			-> filteredStorylets(category) ->

	CONTINUING AFTERWARDS

		If you end a storylet's "text" stitch with "->->", then once chosen, it will show all the content in the "text" stitch, and then continue to the line after the tunnel that called it.
		
		Alternatively, you can end the "text" stitch with "-> DONE" if you want the story to end there.

	STORYLET STRUCTURE

		=== storyletName
		
		#storylet
		
		or
		
		#storylet: category

		= open
		Determines whether the storylet is available. 
		
		Must end with an expression wrapped in curly brackets that evaluates to true or false. Like so--

		{x && y}
		
		or
		
		{x + y > z}

		or

		{x()}

		= urgency
		Determines the priority of this storylet. When you tell the engine to visit a storylet, it will randomly select from amongst all storylets with the highest priority found.

		Must end with a number wrapped in curly brackets. Like so--

		{x} 
		
		or

		{x - 3}

		or

		{x()}

		= exclusivity
		Functions similarly to urgency, but it has a higher priority. A knot with exclusivity 3 and urgency 1 will be chosen over a knot with exclusivity 0 and urgency 9.

		Like urgency, must end with a number wrapped in curly brackets.

		= text
		The content of the stitch. If this stitch doesn't exist, then the storylet won't be imported.
		
		The last line of this stitch should either be "->->" or "-> DONE". Choosing neither may cause the Ink compiler to complain.

	OPTIONAL STITCHES

		"text" is the only mandatory stitch. All others are optional.

		If a storylet doesn't have a stitch called "urgency" or "exclusivity", then it will have an urgency or exclusivity of 0. If a storylet doesn't have a stitch called "open", it will always be considered available.

		Excluding "text", none of a storylet's stitches should contain diverts or choices or text. They also shouldn't contain more than one instance of a value inside those curly brackets.

	USEFUL METHODS FOR CHECKING OPENNESS 

		These are things that you can include in a storylet's "open" stitch that may be useful.

		To check if you've visited a storylet's content before.

			{storylet.text}

		To check if you've visited a storylet more than x times.

			{storylet.text > x}

		To check if you've visited a storylet within the past x turns.

			{TURNS_SINCE(-> storylet.text) <= x}

	JUMPING TO A SPECIFIC STORYLET

		You can jump directly to a storylet's content by diverting or tunneling to its address. For example, you can jump to a storylet called "ocean" with the line...

			-> ocean.text ->

		Unfortunately, I don't think you can evaluate another storylet's openness or urgency or exlusivity from inside Ink. But if you figure that out, please let me know!
*/

== openStorylets
/** 
	Call with...

	-> openStorylets ->
*/ 
~ temp divert = _openStorylets()
-> divert -> 
->->  
 
== filteredStorylets(category)
/** 
	Call with...

	-> filteredStorylets(category) ->
*/
~ temp divert = _filteredStorylets(category)
-> divert -> 
->-> 

EXTERNAL _openStorylets() 
EXTERNAL _filteredStorylets(category)

/** FALLBACK FUNCTIONS

Since Inky doesn't support external functions, your storylets won't show up in Inky's preview player. That's just an inherent limitation of Inky as an app, and it's one that I can't easily hack away — despite trying.

So we have to use fallback functions. Rather than fetching and displaying a storylet, Inky will just... not do that. It'll continue as if you never called a storylet.

The obvious issue here is playtesting. You can't do that organically. So, if you want to test out your storylets, you'll need to either... 

    Run the HTML file in your browser.
    
	Use Catmint to run the HTML file. 
    
	    https://elliotherriman.itch.io/catmint
	
	Replace the contents of these functions with something that roughly approximates the storylet selection process. 
	
		A very simple version that doesn't support availability, urgency, or exclusivity could look like...
	
		{shuffle:
			- -> storylet1 ->
			- -> storylet2 ->
			- -> storylet3 ->
		}

		A more comprehensive version would require you to implement all that logic inside the function. And that wouldn't even account for urgency and exclusivity. Which sucks, and it's why I built this tool in the first place.
*/

== function _openStorylets()
~ return -> _storyletsEmptyDivert

== function _filteredStorylets(category)
~ return -> _storyletsEmptyDivert

== _storyletsEmptyDivert
->->

/* ========================================== */