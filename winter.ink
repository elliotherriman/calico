#title: Winter
#author: Freya Campbell & Elliot Herriman

{
	- isMobile() && not get("seenHeadphonesWarning"):
	
		It looks like you're on a phone or tablet.
		
		Depending on your device, you may not be able to hear music unless you use headphones, or turn off silent mode.
  
		* [Continue] #clear
			~ set("seenHeadphonesWarning", true)
			#restart
			-> DONE
			
	- else: 
		-> mainmenu
}
 
=== mainmenu

#frame: cover_bg1:4, cover_bg2:2, cover_fg1:0, cover_fg2:0
#class: menu

- (menu)
* [Begin] #clear
* Content Warnings
	#class: menu
    Sexual content.
    Anxiety, trauma.
    Skull imagery.
	-> menu

* [Controls]

	Navigate using the mouse.

	#class: menu
	
	Scroll down as you would any web page. You can also click and drag to scroll.

	You can select choices using your mouse, the number keys, or "z", "x", and "c". 
	
	If there's only one choice, you can use the spacebar.

	Press "q" and "e" to step forwards and backwards between passages.

	-> menu

* [Credits] #clear
    
	-> credits
-

-> actOne

== actOne
#play: act1party

* [ACT ONE]
-

Two years, four months, maybe a few days.

Over a hundred miles.

Why is she *here?*

#frame: party1_bg:5, party1_fg:7

* Why is she at this party?
- 

I didn't move here just to avoid her, but - well, it was a contributing factor.

I didn't expect to see her here tonight.

I'm-- I'm not prepared.

-> one

= one

* (runaway) [Run away.]
    I'm morbidly curious.
    
    I can't bring myself to run away.
    
    A moth drawn to a miserable flame.
    -> one

* {runaway} [Cry.]
    I don't think I can summon tears.
    
    That's not the feeling inside me right now.
    
    I just feel guilty.
    -> one

* [Say hi.]
    #clear 
	-> two

= two
#frame: party2_bg:5, party2_fg, party2_fg2:3, party4_fg3_shadow:-13, party4_fg3:3.5

There are enough people between me and her that I can get a bit closer without feeling obvious.

She is standing by the window, dancing in a low-energy way.

I have no idea what I can say to her.

* "Hey, remember me?["] Sorry I made you scared of me." #red
* "Hey, sorry about before.["] I didn't mean to scare you." #red
* "I really liked you, please talk to me." #red
- 

"I miss you." #red

Perhaps I would be better off just throwing myself to the floor.

God, she's smiling.

Maybe she doesn't even remember me.
- (test)
Just chalks me up as another weirdo who wanted to fuck her.
#frame: party3_bg:3, party3_fg1:4, party3_fg2:6, party3_fg3:8
...

* Oh god[.], she looks happy. #clear
-

He's touching her waist and saying something, and I'm just standing here thinking about whether I'm a creep.

Maybe if I was still a guy then it would have been fine.

You expect that kinda shit from a guy, right?

She's touching him back.

#frame: party2_bg:2, party2_fg:4, party4_fg2:4.5, party4_fg3:7

* [I feel sick.] #clear
* [I can't watch this.] #clear
- 

-> three

= three
#frame: party2_bg:4, party4_fg2:7

I feel sick.

I can't watch this.

* [I'm out of here.] #clear
#delay: 1000
-> four

= four
"Hey." #winter

-

#frame: corridor_bg:3, corridor_fg:5

* Someone is talking to me.
- 

I turn and I look at her.

I think "her" is right, anyway.

There is no face for me to tell.

Not... that it's necessarily reliable.

I just sense an energy,

an energy despite the matte off-white bone that stares back at me, deep dark eye sockets in a pallid skull.

Maybe my drugs have started fucking up again.

I shouldn't have drunk...

"Wanna get out of here?" #winter

* "Do I know you?" #red

    "Not yet." #winter
    
    "But I know you." #winter
    
    "I can see the shadow that follows you." #winter
    
    "And you can see me too, can't you?" #winter

* "I'm leaving on my own." #red
    
    "Are you sure?" #winter
    
    She's staring past my shoulder.

    I can feel her gaze on my shadow like two points of pressure.
    
    ** "...no." #red

    ** "I'm leaving." #red

        She falters and takes a step closer.
    
        "Wait." #winter
    
        "I mean..." #winter
    
-
"Girls like us should stick together, you know?" #winter

I don't want to stick together I don't want to talk I want to go home and feel sorry for myself.

-> five

= five

* "I have no idea what you mean." #red

* "Like us?" #red
- 

"It takes one to know one." #winter

"You pass very well for someone functional and right." #winter

"If you hadn't nearly started crying when looking at that girl, I wouldn't have even known." #winter

"I love your boots, by the way." #winter

* (fuckYou) "Fuck you." #red
    "That's the spirit. You don't have to pretend to be good." #winter

    I struggle to think of something to respond.    
    
* (dontKnowMe) "You don't know anything about me." #red
    
    "No?" #winter
    I don't answer.
    
* [(Say nothing.)]
    
- After a moment she clears her throat.

"Never mind. I have wine. A whole bottle, see?" #winter

She holds it up conspiratorially.

Somehow, I get the impression of her winking.

-> six

= six
* "Why should I go anywhere with you?" #red

    She sighs and looks over her shoulder.

    "This party sucks, and you look like you want to cry." #winter

    "Let's get pissed and vent together." #winter

    ** "I don't want to cry." #red
    
        She looks at me silently for a moment.
    
        Neither of us says anything for a second.
    
        I am suddenly, absolutely sure that she wants to cry too.
    
        *** "...whatever." #red

    ** "...fine." #red
    
    -- (wantToCry)
    
    -> seven
    

* (stole) "...where did you get that?" #red
    "I took it." #winter

    "It's a house party, it's there to be drunk." #red

    She shrugs, as if that makes it better.
    -> six

* [(Take the {stole:stolen }wine.)]
    I snatch the bottle from her.

    {stole:
        "For the record, I don't condone this." #red

        "Then I guess I'm drinking for two." #winter

        "I didn't say that." #red

    }
    -> seven

= seven
"Let's just fuck off already." #red

{ six.wantToCry: 
    "I don't want to cry where everyone can see me." #red 
}

Her jaw opens slightly in a horrible impression of a grin without skin.

* ["I know JUST the place."] #winter
- #clear
// black screen

#play: act1park

Then we're on a bench, in a quiet section of the park I didn't even know existed. #test

#frame: park_bg:3, park_fg:4

She opens the bottle of wine with practice, chucking the cork over her shoulder, and takes a swig.

When she hands it to me, there's somehow lipstick on the rim.

-> eight

= eight

* (drank) I drink.[] It's not very good wine.
-> eight
* {not drank}I hesitate.[] She makes a little drinking motion with her hand.
-> eight
* {drank} I take another swig. #clear

- "So what's your name, girl with two shadows?" #winter

I hand the bottle back to her.

"...Meredith." #red

I brace for a laugh, but it doesn't come.

#frame: park_bg:3, park_fg:3.5

She cocks her head to the side and makes a hmmm noise.

"Nice name. Cute, old fashioned." #winter

"Bit of a mouthful to say every time, though." #winter

"I-- " #red

"Merry, maybe..." #winter

She takes a swig of wine and pulls a face.

"No, Merry doesn't suit you. I'm going to call you Red." #winter

* ["You're not."] #red #clear
-

She looks at me, some sparkle visible in her eye sockets.

I think I'm getting used to her lack of a face. 

Almost.

"Whatever you say, Red. Why were you about to cry back there?" #winter

I think I haven't hit her just because of the sheer affront of her questions.

{not six.wantToCry: I hate that she knows that. That I'm so obvious, so easy to read.}

"Why should I spill my guts to some random faceless girl in the park. I still don't even know your name." #red

She waggles the bottle of wine at me teasingly.

"Gimme that." #red

* She lets it go without protest, and I raise it to my lips. #clear
-

// visuals that suit a monologue

"You {five.dontKnowMe: said|think} I don't know you, Red. And maybe you're right." #winter

"But I can guess." #winter

"There's something about yourself that you can't live with. Some part you think abhorrent, to be hidden away from sight." #winter

"Only, hiding it inside wasn't enough. You could feel it in there still, burning away like a hot coal." #winter

"Some hot black little lump inside you like a smouldering heart." #winter

"You hated it, hated it so much that one day you wrenched that fucker free from yourself." #winter

"And ever since then, you've told yourself you feel better. But you don't really believe that, do you?" #winter

"It's not a good absence. It's not like excising a tumour, it's something more vital." #winter

* ["You cut out your heart and now it beats at the door of your soul."] #winter #clear
-

She stops talking as I stare, dumbfounded, bottle of wine still raised halfway to my lips.

#frame: park_bg2:3, park_fg2:4

Rummaging in her coat pocket, she pulls out a pack of cigarettes and lights one casually, clamping it somehow between her teeth.

"That's how I feel, anyway." #winter

"And my name's Winter. So now we're uneven. You gotta tell me about yourself now." #winter

"Fag?" #winter

-> nine

= nine



* ...
    
-> nine

* "Something like that." #red

    She laughs and drops the cigarette, managing to catch it just before it hits the ground.
    
    "See, you *do* have a sense of humour." #winter
    
    "So go on, then. Drink and talk." #winter

* "No, I don't smoke." #red

    "Good girl. Smart. Your loss." #winter
    
    "Might as well just talk, then." #winter
- 

I take another swig of the bad wine whilst I try to process what she said to me.

I feel like she's told me some secret, sticky part of herself,

but like she's told me nothing at all, too.

"The girl in the party was... not really an ex." #red

* ["We--"] #red #clear 
-
#frame: park_bg4:3

I black out as the shadow talks through me, giving its own monologue.

When I snap back, Red is finishing her cigarette, and I mumble the last few words.

"...and, um, we haven't talked... since." #red

And now she's happily dancing with some guy and I'm,

I'm...

* I'm going to drink more wine.

    I take another swig of the wine.
    
    It's still awful.

* I'm going to cry.
    -- (goingToCry)

    I can feel my chest get tight.
    
    I really don't want Winter to see me cry but I don't think I have a choice unless I just run away now.
- 

I hand her the bottle and bring my knees up to my chest, heels resting on the edge of the bench.

"So where does the shadow come in?" #winter

#frame: park_bg2:2, corridor_fg3:3, park_fg2:4	

I {goingToCry:*want* to cry now|fully expected to cry}, but Winter's constant pushiness isn't leaving time.

I'm angry that she keeps asking, and spiteful enough to tell her.

I wonder if she'll call me a █████ too.

"What is it that you're afraid of, Red?" #winter

#delay: 2000

* "Attraction." #red #clear

* "Lust." #red #clear

* "Myself." #red #clear
-

"I'm scared of what I wanted to do to her... still want to do." #red

"And not just her, but others. Girls I knew before or who I see maybe once, and just... think about idly." #red

"Girls aren't meant to have these thoughts, are we? Especially when we're trans." #red

"We're meant to leave that behind. Just be nice and, like, receptive. Inoffensive and unproblematic." #red

"But I think about how I want to touch or hurt or fuck her and I'm just..." #red

"...I can't do it. I can't do it, but I want to." #red

"I feel like I'm trespassing, unwanted and imposing, but *I can't stop wanting to.*" #red

"And what used to be just some awful black part of my heart has just grown and grown until it was always *there*, looking over my shoulder." #red

"I'm scared. I'm scared of the part of me that follows." #red

I rest my head on my knees and try to keep myself very, very still.

* I've said too much. 
* I've *been* too much.
-

The urge inside is to either stop moving forever, or else to flail and throw myself into the duck pond.

Before I can commit to running away, Winter takes a deep breath and nods.

"That's wild." #winter

#frame: park_bg2:2, park_fg2:3

I look over my knees at Winter's expression.

She looks... pleased.

* "'That's wild'?" #red #clear

* "Fuck you, too." #red #clear

    "{five.fuckYou:So you say. }You wound me, Red." #winter
    
* [(Say nothing.)] #clear
-

"I mean, we're almost exact opposites, you and I." #winter

"You're scared of being attracted to someone, and everything that entails." #winter

"And I'm... it's *being attractive to people* I can't stand." #winter

#frame: park_bg4:3

"I don't know how to make myself feel vulnerable, or to tolerate someone's eyes on me." #winter

"What's that phrase... the mortifying ordeal of being known?" #winter

"I want to, but there's armour I can't take off. Baggage that I can't put down." #winter

I look at her as she talks, her body language shrinking and the casual arrogance from earlier falling off like melting snow.

She cradles the wine in her hands, bottle nearly empty, and laughs.

"You know what we have to do, Red?" #winter

* "I have no idea[."] what we have to do." #red #clear
* "What?["] And why 'we'?" #red #clear
- 

"We should help each other." #winter

"We're complimentary. You have a hangup about attraction to people, and I-- I don't." #winter

"I can show you. Teach you." #winter

"And you... can show me what it looks like to be comfortable in your own skin, comfortable being looked at." #winter

I uncurl my legs and look at her, processing what she says.

* "You're-- you're not suggesting we date after talking for fifteen minutes." #red
-

"Not dating. Just helping each other." #winter

"I have someone I like already, and..." #winter

"I want to be attractive for him." #winter

"And you have someone you like, right? The girl from earlier?" #winter

As if that was ever a relationship that could happen again.

Could or *should* happen again. I've burned that bridge and I've known that for a long time.

But... 

I want to reconcile this part of myself.

Something about Winter's intensity makes me trust her. Makes me want to trust her.

So I say it.

* "Okay." #red #clear

* "How do we do it?" #red #clear
- 

Winter leans down to put the bottle of wine on the ground, out the way.

Then she reaches out to me-- 

#frame: park_bg4:3, corridor_fg3:4, park_fg2:5

No. She reaches out to my shadow.

I can almost feel when her fingers touch my other self's cheek.

Like a memory of being touched, or a whisper of a breeze.

"Can I kiss you?" #winter

#delay: 3500

* "Yes." #red #clear
    She grins tipsily and leans in to kiss me - to kiss the other me.
    
    It feels strange to watch her do so, white bone against black shadow.
    
    I can feel something warm on my lips, but it's barely there.
    
    I just stare at her for a second, so close to me, feeling something twist in my stomach.

    Then she draws back and wipes her mouth briefly with the back of her hand.
    
    Blood? No, lipstick. Lipstick smeared across teeth.

* "No." #red #clear
    She draws back, letting her fingers run down my shadow's neck before they stop.
    
    My own shoulder feels electric, and I twitch away from it.
    
    "I won't kiss you, then. For now." #winter
    
    "If we're doing this, I'll get to kiss you some time." #winter

    I look at her, stare right into the depths of her eyes. Dark and hollow and sparkling.

* [(Kiss her first)] #clear
    A thought flashes through my mind, of climbing on top of her and pinning her to the bench. 
    
    But I could never, *would* never, 
	
	** I know I'm not meant to feel these things, and--
    --
- 

* [And then the shadow takes over again, and I black out.] #clear
-

#stop | duration: 150

-> actTwo

== actTwo

#delay: 2500

#play: act2 | delay: 1500

* [ACT TWO]
-

"What do you mean, you don't cook?" #red

Winter shrugs and pours herself another glass of wine, cigarette between her teeth. 

"I just don't. If I eat proper food I buy it." #winter

"I like restaurant food." #winter

#frame: bedroom_bg1:4, bedroom_fg1:10, bedroom_fg2:8, bedroom_fg4:-10

I look at her dumbfounded. She must be spending as much on takeout as I do on rent.

* "How the hell do you afford it?" #red

    "We aren't all broke PhD students, Red. I'm not *that* much of a stereotype." #winter

    "I only spend a day a week on studies. The rest is programming." #winter

    "You should take it up, honestly. Pays great." #winter

    ** "Really?" #red
    
        "Sure. Flexible hours, work from home... it's a good gig." #winter  
        
        "I could teach you the basics sometime, if you want." #winter
        
    ** "I'm not a stereotype." #red
    
        "We both are. That's the joke. Girls like us, we're broke or we're programmers. Or both." #winter
        
        "Or baristas, I guess. When I first came out, I tried to make it work at Starbucks, because they cover all the big surgeries, but--" #winter

* "That seems so lazy." #red

    She stares at me for a moment. Frowning, maybe?
    
    "I just have different priorities." #winter

    "I prefer to..." #winter
    
* "I'd miss cooking." #red

    She grins, and leans against the counter.
    
    "You're welcome to cook for me." #winter

- 

"Or... hmm. Maybe that's getting too personal." #winter

She slowly waves a finger at me to tell me off.

"Besides, you didn't come here to criticise my cooking, did you?" #winter

* "No." #red #clear

* "Well..." #red #clear
    She shakes her head in mock disapproval.
- 

"Tell me what we're doing this time." #winter

#frame: bedroom_bg1:4, bedroom_fg1:10, bedroom_fg2:8, bedroom_fg3:3.5

She takes a seat in the depths of her sofa, and sips her wine, watching me.

* ["So..."] #red
* ["...There's this girl."] #red
-

I tell her about Lilly.

I tell her about the girl in my lecture who's sat next to me twice now, and asked me out for coffee once.

We haven't gone yet; it's tomorrow.

* "And what do you want to do with her?" #winter #clear
-

As I talk, we start our little dance again.

I can't remember how many times it's been now - six, seven maybe.

The memories of each visit are so hard to pin down, just wisps of half-remembered touch.

Winter lets me talk. And as I do, she performs whatever I say on my shadow, the fuzzy half-feeling of it rippling through me, as if muffled through cloth.

She never seems self-conscious as I tell her things to do, never questions them. 

But I never let myself look at her for too long.

Gradually, my shadow seems to... change.

It still looks like me in silhouette, but it's like there's another person layered over.

* I have the horrible feeling it's Lilly. #clear
-

#frame: park_bg4:6

Part of me feels guilt for this play-act we perform,

all mixed up with the guilt I feel for having any feelings in the first place.

I thought maybe it would start to go away, after we did this a few times, but it's barely made a dent.

Instead it just feels I've made Winter culpable for my desires, too.

* [Which feels...] ...
- #clear

Winter senses something is wrong, and turns her attention from my shadow to me.

"Do you want to stop?" #winter

For a moment it's difficult to talk with her fingers in my mouth,

but then the fog clears, and I remember she's still only touching my shadow.

* "Yes." #red

* "No.["] I... maybe." #red

    As I say no, I become increasingly sure I mean yes.

* (dontKnow) "I don't know." #red
- 
#clear

Winter draws back, kneeling in front of me on the bed.

#frame: bedroom_bg2:4, bedroom_fg1:8, bedroom_fg2:9, bedroom_fg5:9

Kayfabe has been broken now, and I see the three of us as if from above.

My shadow and Winter backing away from each other, like guilty teens caught in a cupboard,

and myself watching the two of them from barely a foot away.

The clothes Winter picked out for me barely register, until I realise I'm cold.

I've been cold for some time, and never noticed.

"You don't seem as into it today." #winter

* "I'm not.["] #red #clear

* "I{dontKnow:...} don't know.["] #red #clear

* "I'm sorry.["] #red #clear

- <> I don't know about all this." #red

She looks at me for a moment, then starts hunting around for her hoodie.

"You don't think it's working?" #winter

I honestly can't answer. It's difficult to even know what I think.

Everything feels like muddy water.

I curl my knees up to my chest and sit like that for a minute on the bed.

The underwear Winter gave me to wear digs in at the sides, making it harder to breathe.

* "Do you really feel like it's helping you at all?" #red #clear

- 

She turns to look back at me, unsure for a moment.

"Am I getting anything out of this?" #winter 

"Does watching you be comfortable with feeling attractive help *me*?" #winter

#frame: bedroom_bg2:4, bedroom_fg1:8, bedroom_fg2:9, bedroom_fg4:9

I don't feel comfortable. I don't feel anything about it either way. But I don't say it.

Winter's eyes are hollow as she looks at me. They don't burn.

"It's difficult to tell." #winter

"Knowing someone else can do what I can't... isn't having the revelatory effect I thought it might." #winter

I laugh into my knees and let myself unfurl again, lying down and looking at the ceiling.

* Winter sits on the bed again. #clear
- 
#frame: bedroom_bg2:4, bedroom_fg1:8, bedroom_fg2:9, bedroom_fg5:9

"When I watch you fuck my shadow, it feels like there's some... quality, that you have and I don't." #red

"Like someone gave you permission to feel these things. And that makes it alright." #red

I hear her take a sip of water and sigh.

"I suppose *you* gave me permission." #winter

"Maybe that's all it is." #winter

* "I'm glad you can feel that." #red

    "I mean, it's not--" #winter
    
* "You think so?" #red
    
    "Yeah. Maybe." #winter

    "But... it's not just permission to feel good, or take what you want, or impose." #winter

* "I know what consent is." #red

    She laughs then, and I prop myself up on my elbows to watch her do so.

    "You know that's not what I meant." #winter
    
- "It's more like... one partner gives permission to the other. So they can feel vulnerable." #winter 

She looks away.

* "Is there a difference?" #red

    "Yeah, Red." #winter

    "That's not the same as *being</i> vulnerable. It's not the same as feeling <i>safe* being vulnerable." #winter

    "And if you don't get to feel that, if you don't *both* get that..." #winter

* "What if they don't do the same?" #red 

- 

#frame: bedroom_bg2:4, bedroom_fg1:8, bedroom_fg2:9, bedroom_fg5:9

"Then you have something deeply unbalanced." #winter

"One person baring their soft little heart and the other stepping on it like a snail on wet pavement." #winter

I pull a face. And she grins back. She can't help it.

"Are you scared of that?" #red

She doesn't reply straight away.

I can hear the clock ticking as we sit on her bed in silence.

"I mean," #winter

"You have to face your fears, don't you?" #winter

* "So I hear." #red #clear

* "Isn't that what we're doing?" #red #clear

    "Well, yeah, but..." #winter 

    She trails off for a moment, lost for what to say.

* "Do you?" #red #clear
    
	Winter laughs bitterly.

    "Was there any point in this otherwise?" #winter

- She stands up and turns to face me.

"I've got a date." #winter

#frame: bedroom_bg1:3, bedroom_fg1:3.5, bedroom_fg2:4, bedroom_fg4:4

I raise my eyebrows in surprise.

* "A date?" #red
* "You didn't say anything." #red
-

She shrugs. It doesn't come across as nonchalant, so much as evasive.

"That's what this has all been for, right?" #winter

"Guess it *must* be working." #winter

"You let me see how it feels to be comfortable in your own skin, and I put it into practice." #winter

"Is it the guy you mentioned before?" #red

She nods, and holds my gaze defiantly, as if she's waiting for some criticism.

* I don't have anything to say. #clear
-

But just for a moment, I can feel it, as sharp as ice. 

I feel angry and bitter and broken that Winter has found more in our hookups than I have.

That she's going to outpace me and leave me on my own. That this isn't a respite for me, it's not healing me, it's not helping, it's--

#frame: bedroom_bg2:3, bedroom_fg1:3.5, bedroom_fg2:4, bedroom_fg4:3.5

I feel something cold wrap around my hands, as my shadow comes in closer to hug me, embrace me.

* Winter's eyes widen very slightly[.], and I realise just what I could do to her. #clear
- 
In a moment, a sentence or two, I could crush whatever tiny ember of confidence she's trying to keep alive.

Tell her that everything she's begged me for will never work, as if she could really learn to be comfortable from me, learn to love herself from me,

when I can't even keep all of myself together.

But I know the urge is terrible, some monstrous thought that's gone as quickly as it came.

I'm not angry at her, really. Just me.

So I find the words.

...

* ["Good for you."] #red #clear

-> actThree

== actThree

VAR sayNothing = 0

#stop | duration: 250

* [ACT THREE]
-

#play: act3

My phone drags me out of a stupor as it rings.

It's nearly midnight, and my tea has gone cold, forgotten as I drift off.

God, I don't want to talk to her. Not tonight.

But it's nearly midnight. 

And Winter's calling me.

#frame: phone_fg:2

* [(Answer)]I answer the phone.

* [(Ignore)]I try to ignore the call.

    It gets to the sixth ring before I question what I'm doing.
    
    Winter almost never rings me. She hates talking on the phone.

    That, and the time, makes something feel very wrong.
	
	** ["Hello?"] #red #clear
- 
"Hello?" #red

The sound on the other end of the line is... crying.

"Winter? Are you okay?" #red 

There's a pause, and she lets out a shaking breath.

"No." #winter

* "Can I come over?" #winter #clear
-

Winter huddles at the end of my bed, her legs drawn up to her chest.

#frame: bedroom2_bg1:3, bedroom2_fg1:5, bedroom2_fg2:4, bedroom2_fg3:5

I place a glass next to her and join her on the bed. Near, but not close.

"Sorry it's... this. All I've got is cheap vodka." #red

Winter necks it in one, and her shoulders hunch up as she makes a face.

Then she stares down at the empty glass in her hands, and talks.

* So I listen. #clear
-

// winter and boy stare over table

"I went to see the boy, finally. Like I said." #winter

#frame: park_bg4:3, bedroom2_fg1:5

"We had food and some drinks and he seemed... nice." #winter 

"Interested, y'know? He listened to me." #winter

"It felt really good to get that attention." #winter

"And I like him. Liked him. I don't know." #winter

* "What happened?" #red #clear

* [(Say nothing.)] #clear
    ~ sayNothing += 1

-

Winter swallows. 

"We went back to my flat. And he-- we started to make out." #winter

"It felt so good at first to be desired. I felt... confident." #winter

"And he was so complimentary, I thought-- I thought it meant I was attractive." #winter

"I thought I could live with it, if that's how it felt." #winter

* "Go on." #red
* {not sayNothing} [(Say nothing.)] 

	<> I let her keep talking.
    ~ sayNothing += 1
-

"But it felt... wrong, gradually." #winter

"Like he was no longer seeing the person I'd been earlier, talking and flirting and being human, y'know?" #winter

"It felt like he was just looking at me and seeing a trans girl. An archtype-- no, that's too kind a word. A cut of meat that he liked." #winter

"And I wondered if he'd ever seen me as anything different." #winter

* "Winter...["] I'm sorry." #red #clear

* "Did he hurt you?" #red #clear

    "No. Nothing like that. But..." #winter

* {not sayNothing} [(Say nothing.)] #clear
    
	~ sayNothing += 1

- 

"I thought maybe that I had to just endure it. That this is just how it feels, right?" #winter

"I hated it, more and more as it went on, but I couldn't tear myself away, in case I stopped just before it suddenly started to feel right." #winter

"But it never felt right, it never did, and when he finally finished, he couldn't even look at me." #winter

"He didn't look at me the same, even when he left. Like there was a distance, or... like it was an act." #winter

* [(Touch her shoulder.)] I reach out and touch her shoulder.

Winter flinches a little, but doesn't push my hand away.

* "I know what you mean.["] The way someone fronts like they like you, like they want you, as a person. But they..." #red /

    "...yeah." #red

* {not sayNothing} [(Say nothing.)] When I don't respond, Winter looks up at me.


"Tell me I'm wrong about him, Red." #winter

I don't know if I can.

- 
#frame: bedroom2_bg1:3, bedroom2_fg1:5, bedroom2_fg2:4, bedroom2_fg3:5

"You deserve better, Winter." #red

She sniffs and looks at my face for a moment.

"I can still feel his hands on me." #winter

* "Like a drop of dye in water." #winter #clear
-

She grabs my hand suddenly.

#frame: hands2:2

"Can you drown him out for me, Meredith?" #winter

* "What do you mean?" #red #clear

* "'Meredith'?" #red #clear

    She looks down for a second, and somehow I can tell she's blushing.
    
    "I'm being sincere. Using your proper name felt right." #winter
    
    "Look, just--" #winter
    
-
She pulls me towards her by the arm.

Her grip is soft, and bitterly cold. But it's comforting, too. And when my hand reaches her skin... 

Have I ever actually touched her like this?

I can feel my shadow stir next to me, remembering.

"If I have to keep feeling someone's hands on me, I won't mind if it's you, Red." #winter

"You..." #winter

"I don't want to believe you see me the same way he did." #winter

* "I don't." #red

* "I couldn't." #red

-

"Help me forget, then. Please." #winter

"I'll tell you what to do, what-- what he did." #winter

* "Just like the other times. Like did I for you." #winter #clear
-

My shadow guides my hand to her neck, and I don't fight it.

// frame: kiss_winter:3, kiss_shadow:4, kiss_red:5

Winter twitches as my fingertips brush her skin, willing herself to stay still.

"He started with my blouse." #winter

* [(Take it off.)]

    Winter's hands join my own, working with mine to shrug off her blouse.

* [(Tear it off.)]

    I grab her blouse, clumsily pulling it over her head. Her eyes are wide.

    Why can't I let myself want this?

* (hesitate1) [(Hesitate.)]

    Winter watches me for a moment, then takes her blouse off, and lets it fall down the side of the bed.
- 

Her skin is so smooth.

Out the corner of my eye I see her look at my face, watching me, waiting.

"You're pretty. You've never shown me before." #red

"Red..." #winter

- (touch)

* [(Touch her stomach.)] #clear

    I let my fingers drop to her stomach, tracing them along her side.
    
    Where I touch her, Winter instinctively moves away as if I've pushed.
    
    She makes a squashed little noise, and closes her eyes.

* [(Touch her bra.)] #clear

    I let my hand cup her breast through the stretched fabric of her bra.
    
    It's plain, black, a recognisably standard and cautious choice.
    
    I think it's one she had me wear.
    
    Winter takes a breath, and I can feel her chest rise as she does so.

* (hesitate2) [(Wait.)]

    I look up at her, waiting for some kind of sign it's okay.
    
    {hesitate1:"Red, please, I-- I need this."|"Please."} #winter
    
    -> touch

-  

It feels strange to lead this dance.

My shadow wraps itself around me, its hands on the back of my own. I can feel its heart beating through me.

#frame: kiss_winter:3, kiss_shadow:4, kiss_red:3.1

I think about how Winter did this before. To my shadow.

I wonder if that's how she wants me to act, or...

* "How did he touch you?" #red

* "Tell me what to do." #red

- She takes a deep breath, recounting.

"He had rough hands. They never stayed in one place long enough to get used to." #winter

Nothing like Winter's.

- (wheretouch)

* "Did you like that?" #red

    "No." #winter
    
    "When I asked him to touch somewhere, he'd get bored after a minute and move." #winter
    
    "So I stopped asking." #winter
    
    -> wheretouch

* "Is there somewhere you want me to touch you?" #red #clear

- 

Winter hesitates.

Without saying anything, she takes my hand between both of hers, and guides it to her neck.

#frame: kiss_winter:5, kiss_shadow:2, kiss_red:6

I run my thumb along the line where skin turns to bone.

Her breath catches as my fingers trace up her jaw and come to rest on her cheekbone.

* "You're warm." #red
- 

"You know how your shadow felt?" #winter

"Like a real person, soft to the touch." #winter

She raises her own hand to touch my face in return, her thin fingers mirroring mine on her cheek.

Then she shifts her hand to my shadow instead, watching over my shoulder, and touches its cheek.

I feel the fuzzy impression of it again, like static.

* [It feels nice.]
* [It feels strange.]
* [It feels familiar.]
-
#clear

"Do you think it's really part of us?" #winter

"Or is your shadow and my face just some kind of delusion?" #winter

Winter tugs the shadow by the collar, and I fall forward with it, pinning her to the bed.

She takes my hand and hesitantly guides it back to her neck.

* I oblige[.], and she covers her eyes with the back of a hand.

- "I never know if people can't see my skull or if they just don't care." #winter

"Would it be so bad? If they couldn't?" #red

#frame: winterlay:5, hand4:3

She peeks through her fingers at me. 

I've never seen her so fragile.

"I'm scared of someone being attracted to just part of me. To *that* part of me." #winter

"Like I might ruin myself by revealing that I'm human, too, #winter

and it's too much to bear for both of us." #winter

* "You're not ruining yourself." #red 

    "I wish it was so easy as believing you." #winter

* "They might love you for it." #red

    "Could you?" #winter
    
    I don't know how to answer for a moment.
    
    "It feels weird to want you, for something that causes you pain." #red

    "...But I guess I do." #red

* "You'd be vulnerable." #red

    "...Yeah." #winter

    "But that's-- that's okay. You can be that." #red

    She's staring up at me, wordless.

    "I'm giving you that permission, Winter." #red

    She laughs bitterly.
    
    "Can't believe you use my words against me." #winter
    
    "That's not how this works." #winter

    "I can force it if you want." #red #delay: 1000

    I feel her tense beneath me.
    
    "I..." #winter

- 

"Show me, then. Prove it." #winter

She moves her hand away and I meet her gaze.

* It feels like I'm falling[.], #clear
- 
a bird losing its feathers as it tumbles through the sky.

Winter wants the dark part of me, and I want hers.

"If it's a delusion - my shadow and your skull..." #red 
"Then it's one that's real to both of us." #red
She grasps my hand gently again, and guides it higher to her eye socket.

"If it's a delusion..." #winter

"What did you say just now?" #winter

* ["*Would that be so bad*?"] #winter
- #clear

-> actFour
// TODO might write more here or just skip to morning

// okay this is a weird change that i'm not sure about but here's my thinking:
// every other time skip has been an act break, for one.
// and this last bit already feels like a bit of an epilogue, but it 
// also feels like the conceit of the whole story, which makes it more suited
// for an act than an actual epilogue
// and... honestly? i think it's cool that it's an unexpected number of acts
// like, four is a weird number. people expect three. four gives a sense of...
// the ending not being where it should. that this story is going to keep going
// past what we get to see of it. which is what that is. and i kinda like that?

== actFour 

#play: act4 | delay: 500

* [ACT FOUR]
-

I can hear Winter's breathing next to me, and I realise I'm awake.

I open my eyes, and the two of us are in my bed still.

She's asleep, facing away from me, slightly curled up.

And as I start to rise,

I realise I can see her face.

#frame: act4_winter2:4

* Everything feels at peace.
- 

I sit there quietly for a few minutes, watching her sleep.

It's just the two of us.

For the first time, I can't feel my shadow behind me, watching.

It's as if I've carried a backpack for so long I forgot, and then finally took it off.

* [It feels light.]
* [It feels scary.]
- 
#clear

When I eventually get up, Winter doesn't stir.

But as the kettle boils, I hear her.

"...Red?" #winter

I call back, and return with two mugs of coffee.

Winter is sitting, rubbing her eyesockets, her skull once again staring back at me.

// there's been a couple references to her grinning so far, i rly like the idea
// of this ending with a smile, something she couldn't do before?
She's smiling.

* [I don't say anything.]
- 
Where her blouse has fallen open, I can see the bruises on her neck, and my stomach twists a little, satisfaction against guilt.

When I pass her the mug of coffee, my shadow is right back again, cradling my arm like a splint.

* [But it doesn't feel as heavy anymore.]
#clear

#delay: 4000
-> credits

== credits

winter

a game by freya campbell and elliot herriman

writing, art, and music by <a href="https:\/\/twitter.com\/spdrcstl" target="_blank">freya campbell</a>

additional writing, code, and design by <a href="https:\/\/twitter.com\/elliotherriman" target="_blank">elliot herriman</a>

be kind to yourselves 

* [back] #restart
- 
-> END

EXTERNAL isMobile()
EXTERNAL get(property)
EXTERNAL set(property, value)