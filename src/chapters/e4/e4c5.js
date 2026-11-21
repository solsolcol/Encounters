/* Episode 4 · Chapter 5 · "The House With Nine Prai"
   ---------------------------------------------------------------------------
   THE FIFTH CHAPTER OF CASE FILE 4, "The Teacher In White", AND ITS LAST: S1·14, case two, and S1·15, case three. At a
   devotee's home the sense that opens is his NOSE: he smells what nobody else can, and it leads to nine presences put
   there by somebody's grudge. When the cleansing begins his own Lersi comes to protect him, and for a short while the
   game is played from outside, as a tag team of Grandmaster Pho and Master Zavier. The next afternoon the same stench
   comes off twenty pieces on a table, and a frightened man asks HIM which ones he can keep.

   THIS FILE IS GENERATED (masters/v28.0/assemble.py, from masters/v28.0/parts/*.js and the script,
   masters/v28.0/script/lines.json): edit the parts and the script and assemble again, never this file.
   docs/V28.0-E4C5-PLAN.md is the design (its 0 Chad's words, the contract; its 4 every beat and line; its 5 the fight);
   docs/V28.0-E4C5-BUILD.md is where the build stands.

   WHAT THIS FILE IS TODAY: THE SKELETON (the tracker's M5c). The chapter's data and every word of it are in place;
   its world, its play, its fight and its films are NOT built. What stands in for each is marked where it stands:
     TODO-WORLD   the place (b_world.js: a floor and the dusk; the plan's 8 is what is built there)
     TODO-PLAY    a phase's play (c_story.js: one thing to press in each phase; the plan's 4.1, 4.3, 4.7)
     TODO-FIGHT   the cleansing, the tag team in third person (c_story.js; the plan's 5, and docs/V28.0-FIGHT.md)
     TODO-FILM    a film or an ending (z_tail.js: a few seconds each, each ending as a film must; the plan's 4)
     TODO-VOICE   a line's take and its measured length (lines.json; every length here is PROVISIONAL)
   A line whose take has not landed is spoken silently on its provisional length and shown as a caption, so the
   skeleton can be walked and read from its first frame to its four endings.

   CHAD'S DIRECTION (20 and 21 Nov 2026, the plan's 0): it happens in Singapore; a tag-team battle at the climax, Master
   Zavier and Grandmaster Pho both played in third person, then first person again; Grandmaster Pho with the Naga stick's
   fireballs and a golden shockwave; Master Zavier in defence and support, with abilities that are a real reason to
   switch; the camera behind and above; a loss begins the fight again; build it all; the decision OK; the lines as
   drafted.

   FAIRNESS (the standing rule: no practice and no practitioner is ever the villain). The devotee is a blunt man who
   has quarrelled with people and says so himself; the collector is curious, not a fool; whoever bore the grudge is
   never seen; the nine are not enemies, they were put there, and nothing is destroyed. GOLD is Grandmaster Pho's alone.

   THE ENDING STAYS THAT AFTERNOON: the customer leaves and the bag is sealed. Nothing of what he will become. */

(() => {
  'use strict';

  let S = null;

  /* ---------------------------------------------------- the light (painted, never a lamp added on screen: v15.1)
     TODO-WORLD: three hours of the plan's 8, each a first guess to be set from photographs when its place is built */
  const sky = (o) => Object.assign({ stars: 0, moon: 0, sun: 0, clouds: 0 }, o);
  /* THE WALKWAY AND THE COURT AT DUSK: orange evening light, low, from the west; the sky going violet overhead */
  const DUSK = sky({
    stops: [[0.00, '#f2a25e'], [0.12, '#d98a5c'], [0.35, '#8c6f88'], [0.65, '#4b5479'], [1.00, '#2b3459']],
    bg: 0x6c5a68, fog: [0x8a6a62, 0.004],
    hemi: [0xffd4ac, 0x6a5a50, 0.85], key: [0xffb070, 1.05, -3.0, 1.6, 2.0], fill: [0x8090c0, 0.25],
    stars: 0, moon: 0,
    vmHemi: [0xffd4ac, 0x6a5a50, 0.8], vmKey: [0xffb878, 0.6] });
  /* THE COURT AT NIGHT, for the cleansing: the sky deep blue, two wall lamps (painted when the court is built) */
  const NIGHT = sky({
    stops: [[0.00, '#4a3a3e'], [0.10, '#33303f'], [0.30, '#1f2238'], [0.60, '#141830'], [1.00, '#0b0e22']],
    bg: 0x12142a, fog: [0x12142a, 0.006],
    hemi: [0x7f8cc0, 0x2a2420, 0.5], key: [0xffc890, 0.6, 1.5, 2.2, 1.0], fill: [0x6070a8, 0.2],
    stars: 0.3, moon: 0,
    vmHemi: [0x7f8cc0, 0x2a2420, 0.55], vmKey: [0xffc890, 0.45] });
  /* THE RECEIVING ROOM IN THE AFTERNOON, for case three: daylight through one window */
  const DAY = sky({
    stops: [[0.00, '#dfe8f2'], [0.20, '#bcd2ea'], [0.50, '#8fb4de'], [0.80, '#6a98d0'], [1.00, '#5486c4']],
    bg: 0xc8d6e4, fog: [0xc8d6e4, 0.002],
    hemi: [0xf4f8ff, 0xb8a890, 0.95], key: [0xfff2dc, 0.9, 2.0, 3.0, -1.0], fill: [0xb8c8e0, 0.25],
    stars: 0, moon: 0,
    vmHemi: [0xf4f8ff, 0xb8a890, 0.9], vmKey: [0xfff2dc, 0.6] });
  const PRESETS = { DUSK, NIGHT, DAY };

  /* LINES BEGIN: written by masters/v28.0/assemble.py from masters/v28.0/script/lines.json (edit that file and
     assemble again: never this block). EVERY LINE THE CHAPTER SPEAKS: its length, its speaker, its place, its words. */
  /* every line's length. PROVISIONAL unless its row in lines.json carries a measured `secs`: a provisional length is
     the line's words / 2.3 a second, and is REPLACED by the take's measured length when the line is voiced (the queue
     books its window by it and every film's times are built from it, so a measured take moves what follows it: v5.15).
     The names are QUOTED on purpose: build.py gives a sound to a chapter's own pack only when the chapter names it in
     quotes (v21.1). */
  const SECS = {      // 0 of 149 MEASURED from their takes; the other 149 PROVISIONAL (words / 2.3 s)
    /* Master Zavier (the player) */
    'q5o1': 8.26, 'q5o2': 3.04, 'q5w1': 1.74, 'q5w2': 2.61, 'q5w3': 3.04, 'q5w4': 0.87, 'q5h1': 5.65, 'q5h2': 2.61,
    'q5h3': 5.22, 'q5h4': 1.74, 'q5h5': 1.74, 'q5p1': 3.91, 'q5c0': 5.22, 'q5c1': 5.22, 'q5c3': 1.74, 'q5c2': 1.74,
    'q5b1': 2.17, 'q5b2': 2.61, 'q5t1': 7.83, 'q5A1': 0.43, 'q5A2': 5.22, 'q5B1': 2.61, 'q5B2': 2.17, 'q5C1': 8.7,
    'q5D1': 5.65, 'q5z1': 1.74, 'q5A': 6.52, 'q5B': 5.65, 'q5C': 5.65, 'q5D': 5.22,
    /* Grandmaster Pho */
    'ph5w1': 4.35, 'ph5w2': 4.35, 'ph5w3': 2.17, 'ph5w4': 2.17, 'ph5w5': 7.83, 'ph5w6': 0.43, 'ph5w7': 1.3,
    'ph5d1': 1.74, 'ph5d2': 7.83, 'ph5h1': 0.87, 'ph5h2': 2.61, 'ph5h3': 9.13, 'ph5h4': 5.65, 'ph5h5': 1.3,
    'ph5h6': 1.74, 'ph5h7': 1.3, 'ph5v1': 4.78, 'ph5v2': 3.91, 'ph5p1': 4.78, 'ph5p2': 4.78, 'ph5f1': 0.43,
    'ph5f2': 3.04, 'ph5f3': 6.09, 'ph5f4': 0.43, 'ph5f5': 3.48, 'ph5f6': 1.74, 'ph5f7': 2.61, 'ph5f8': 2.17,
    'ph5f9': 2.61, 'ph5f10': 5.22, 'ph5na1': 3.04, 'ph5na2': 1.74, 'ph5na3': 0.87, 'ph5nb1': 1.74, 'ph5nb2': 1.3,
    'ph5nc1': 3.04, 'ph5nc2': 2.61, 'ph5nc3': 1.3, 'ph5nd1': 2.17, 'ph5nd2': 3.04, 'ph5nd3': 0.43, 'ph5ne1': 4.35,
    'ph5nf2': 2.17, 'ph5nf3': 0.43, 'ph5ng1': 3.48, 'ph5ng2': 2.17, 'ph5nh2': 0.43, 'ph5ni1': 1.74, 'ph5ni2': 1.3,
    'ph5g1': 0.43, 'ph5g2': 3.91, 'ph5g3': 2.61, 'ph5c1': 2.17, 'ph5c2': 2.61, 'ph5c3': 1.3, 'ph5c4': 3.04,
    'ph5l1': 2.17, 'ph5l2': 2.61, 'ph5b1': 1.74, 'ph5b2': 7.83, 'ph5b3': 7.83, 'ph5b4': 9.13, 'ph5b5': 7.39,
    'ph5b6': 0.43, 'ph5t1': 0.43, 'ph5t2': 0.43, 'ph5t3': 4.78, 'ph5t4': 7.83, 'ph5t5': 0.43, 'ph5t6': 3.91,
    'ph5A1': 3.91, 'ph5A2': 7.39, 'ph5B1': 11.3, 'ph5C1': 2.17, 'ph5C2': 3.91, 'ph5D1': 4.78, 'ph5D2': 7.83,
    /* Ton, the follower who carries the Naga stick */
    'tn5o1': 4.35, 'tn5w1': 0.87, 'tn5w2': 0.87, 'tn5w3': 1.74, 'tn5w4': 3.91, 'tn5c0': 3.48, 'tn5c1': 2.61,
    'tn5c2': 1.74, 'tn5c3': 1.3, 'tn5b1': 7.83,
    /* Jun, the second follower */
    'ju5o1': 5.65, 'ju5w1': 2.61, 'ju5w2': 2.61, 'ju5c1': 3.48, 'ju5c2': 2.17, 'ju5b1': 5.22,
    /* Mr Koh, the devotee */
    'ko5d1': 4.78, 'ko5d2': 9.13, 'ko5d3': 6.09, 'ko5d4': 6.52, 'ko5p1': 1.74, 'ko5c1': 3.91, 'ko5c2': 3.04,
    'ko5b1': 4.35,
    /* The collector */
    'co5t1': 3.91, 'co5t2': 13.48, 'co5t3': 3.91, 'co5t4': 2.17, 'co5t5': 6.52, 'co5t6': 3.91, 'co5t7': 3.48,
    'co5A1': 3.04, 'co5A2': 5.22, 'co5B1': 5.65, 'co5B2': 4.35, 'co5B3': 3.04, 'co5B4': 3.91, 'co5B5': 2.17,
    'co5C1': 1.3, 'co5C2': 1.74, 'co5D1': 7.39, 'co5z1': 3.04
  };
  /* every line's words: key: [who, where in the chapter, the words exactly as said]. A row marked FIGHT-DRAFT is a line
     of the fight as the plan's 7.3 drafted it: the fight is being redesigned (R14), so these WILL change, and none is
     voiced before the fight's specification is written. */
  const LINES = {
    'q5o1': ['he', 'open', "Case two. A devotee's home. He had been quarrelling with people outside, and at home he could not rest."],
    'ju5o1': ['jun', 'open', "Mr Koh says the lights keep going off. Electrician came three times already."],
    'tn5o1': ['ton', 'open', "He also says he fights with everybody. His own words."],
    'q5o2': ['he', 'open', "The doors opened, and it hit me."],
    'q5w1': ['he', 'walk', "Do you smell that?"],
    'tn5w1': ['ton', 'walk', "Smell what?"],
    'tn5w2': ['ton', 'walk', "Nothing, brother."],
    'ju5w1': ['jun', 'walk', "Somebody frying fish? No? Then nothing."],
    'ph5w1': ['pho', 'walk', "Your nose has opened. They cannot smell it. You can."],
    'ph5w2': ['pho', 'walk', "Do not say what it is yet. Follow it. SMELL."],
    'ph5w3': ['pho', 'walk', "Not yet. First your nose."],
    'q5w2': ['he', 'walk', "A drain. That one I understand."],
    'ju5w2': ['jun', 'walk', "That one even I can smell."],
    'ph5w4': ['pho', 'walk', "Good. Now the other one."],
    'ph5w5': ['pho', 'walk', "The spiritual sense of your nose is already open. That is why it reached you, and not them."],
    'q5w3': ['he', 'walk', "We were not even at his door."],
    'tn5w3': ['ton', 'walk', "Brother? You all right?"],
    'ph5w6': ['pho', 'walk', "SMELL."],
    'ph5w7': ['pho', 'walk', "Breathe in. SMELL."],
    'tn5w4': ['ton', 'walk', "Mr Koh's is the one at the end, brother."],
    'q5w4': ['he', 'walk', "Weaker here."],
    'ko5d1': ['koh', 'devotee', "Grandmaster. You came. I did not know who else to ask."],
    'ko5d2': ['koh', 'devotee', "At night somebody knocks. Inside the house. I check: nobody. My things move. I lie down, I feel a weight, here."],
    'ko5d3': ['koh', 'devotee', "Three weeks. My workers say I am short-tempered. I say I am not sleeping!"],
    'ko5d4': ['koh', 'devotee', "I know I have a mouth. I have quarrelled with people. More than a few."],
    'ph5d1': ['pho', 'devotee', "We will look first."],
    'ph5d2': ['pho', 'devotee', "Use your nose. Then your Spirit Vision. Tell me what you find, not what you think it is."],
    'q5h1': ['he', 'hunt', "Here, under this. It is dark to me, and the smell is thick."],
    'q5h2': ['he', 'hunt', "The same thing. All along here."],
    'q5h3': ['he', 'hunt', "Here it is strongest. It runs from the gate to his door."],
    'ph5h1': ['pho', 'hunt', "Nine Prai."],
    'q5h4': ['he', 'hunt', "They were already there."],
    'ph5h2': ['pho', 'hunt', "Now find where it was poured."],
    'ph5h3': ['pho', 'hunt', "I believe somebody poured this here: the oil of nine Prai. I believe it was people who are angry with him."],
    'ph5h4': ['pho', 'hunt', "Nothing is there now. A smell stays after what made it has gone."],
    'q5h5': ['he', 'hunt', "My nose was sure."],
    'ph5h5': ['pho', 'hunt', "Try the court."],
    'ph5h6': ['pho', 'hunt', "Try by the door."],
    'ph5h7': ['pho', 'hunt', "Try the gate."],
    'ph5v1': ['pho', 'hunt', "You're losing control, close your Spirit Vision, and re-open it again."],
    'ph5v2': ['pho', 'hunt', "When you feel better, open your Spirit Vision again."],
    'ph5p1': ['pho', 'prepare', "Stay behind the thread. Whatever you hear, do not come out."],
    'ko5p1': ['koh', 'prepare', "What will I hear?"],
    'ph5p2': ['pho', 'prepare', "Stand with me. Do not open to them. Whatever comes, stand."],
    'q5p1': ['he', 'prepare', "And then I was not alone in my body."],
    'ph5f1': ['pho', 'fight', "FIRE."],      /* FIGHT-DRAFT */
    'ph5f2': ['pho', 'fight', "The Prai is tired. Now the BAG."],      /* FIGHT-DRAFT */
    'ph5f3': ['pho', 'fight', "Fire will not tire a large Prai. Zavier must hold it. Switch to Zavier."],      /* FIGHT-DRAFT */
    'ph5f4': ['pho', 'fight', "STEADY."],      /* FIGHT-DRAFT */
    'ph5f5': ['pho', 'fight', "The Prai is gripped. Now switch to me."],      /* FIGHT-DRAFT */
    'ph5f6': ['pho', 'fight', "FIRE. Then the BAG."],      /* FIGHT-DRAFT */
    'ph5f7': ['pho', 'fight', "A Prai is hiding. Zavier: SMELL."],      /* FIGHT-DRAFT */
    'ph5f8': ['pho', 'fight', "There. FIRE, before it moves."],      /* FIGHT-DRAFT */
    'ph5f9': ['pho', 'fight', "The golden shockwave is ready. SHOCKWAVE."],      /* FIGHT-DRAFT */
    'ph5f10': ['pho', 'fight', "The shockwave tires the small Prai. A large Prai must be held."],      /* FIGHT-DRAFT */
    'ph5na1': ['pho', 'fight', "Zavier is weakening. Switch to Zavier. STEADY."],      /* FIGHT-DRAFT */
    'ph5na2': ['pho', 'fight', "Zavier needs you. STEADY."],      /* FIGHT-DRAFT */
    'ph5na3': ['pho', 'fight', "Zavier. STEADY."],      /* FIGHT-DRAFT */
    'ph5nb1': ['pho', 'fight', "You are weakening. STEADY."],      /* FIGHT-DRAFT */
    'ph5nb2': ['pho', 'fight', "Stand firm. STEADY."],      /* FIGHT-DRAFT */
    'ph5nc1': ['pho', 'fight', "The Prai are gripped. Switch to me."],      /* FIGHT-DRAFT */
    'ph5nc2': ['pho', 'fight', "Now. Switch to me, and FIRE."],      /* FIGHT-DRAFT */
    'ph5nc3': ['pho', 'fight', "To me. FIRE."],      /* FIGHT-DRAFT */
    'ph5nd1': ['pho', 'fight', "A Prai is tired. BAG."],      /* FIGHT-DRAFT */
    'ph5nd2': ['pho', 'fight', "BAG the tired Prai before it rises."],      /* FIGHT-DRAFT */
    'ph5nd3': ['pho', 'fight', "BAG."],      /* FIGHT-DRAFT */
    'ph5ne1': ['pho', 'fight', "The Prai rise again. Bag them while they are tired."],      /* FIGHT-DRAFT */
    'ph5nf2': ['pho', 'fight', "SMELL, Zavier. Find the Prai."],      /* FIGHT-DRAFT */
    'ph5nf3': ['pho', 'fight', "SMELL."],      /* FIGHT-DRAFT */
    'ph5ng1': ['pho', 'fight', "A large Prai. It must be held: STEADY."],      /* FIGHT-DRAFT */
    'ph5ng2': ['pho', 'fight', "Hold the large Prai. STEADY."],      /* FIGHT-DRAFT */
    'ph5nh2': ['pho', 'fight', "SHOCKWAVE."],      /* FIGHT-DRAFT */
    'ph5ni1': ['pho', 'fight', "Switch to me. BAG."],      /* FIGHT-DRAFT */
    'ph5ni2': ['pho', 'fight', "To me. BAG."],      /* FIGHT-DRAFT */
    'ph5g1': ['pho', 'fight', "Good."],      /* FIGHT-DRAFT */
    'ph5g2': ['pho', 'fight', "Steady, then fire. That is how it is done."],      /* FIGHT-DRAFT */
    'ph5g3': ['pho', 'fight', "You held. Remember how that felt."],      /* FIGHT-DRAFT */
    'tn5c0': ['ton', 'fight', "Brother has gone quiet. Look at his lips."],      /* FIGHT-DRAFT */
    'ko5c1': ['koh', 'fight', "Who is he talking to? There is nobody there."],      /* FIGHT-DRAFT */
    'tn5c1': ['ton', 'fight', "Stay behind the thread, Mr Koh."],      /* FIGHT-DRAFT */
    'ju5c1': ['jun', 'fight', "Did you feel that? Like a door slammed."],      /* FIGHT-DRAFT */
    'tn5c2': ['ton', 'fight', "Master. Brother is shaking."],      /* FIGHT-DRAFT */
    'ju5c2': ['jun', 'fight', "The lamps. Master, the lamps."],      /* FIGHT-DRAFT */
    'ko5c2': ['koh', 'fight', "It is... warm. Why is it warm?"],      /* FIGHT-DRAFT */
    'tn5c3': ['ton', 'fight', "Stay there, brother."],      /* FIGHT-DRAFT */
    'q5c0': ['he', 'fight', "I could see. I could hear. I was not the one standing."],      /* FIGHT-DRAFT */
    'q5c1': ['he', 'fight', "I could hear my own voice, and the words were not mine."],      /* FIGHT-DRAFT */
    'q5c3': ['he', 'fight', "It had already moved."],      /* FIGHT-DRAFT */
    'ph5c1': ['pho', 'fight', "Three Prai. Do not hurry."],      /* FIGHT-DRAFT */
    'q5c2': ['he', 'fight', "It stood over me."],      /* FIGHT-DRAFT */
    'ph5c2': ['pho', 'fight', "The Naga guards. It always has."],      /* FIGHT-DRAFT */
    'ph5c3': ['pho', 'fight', "Bag them. Gently."],      /* FIGHT-DRAFT */
    'ph5c4': ['pho', 'fight', "Come. It is over for you too."],      /* FIGHT-DRAFT */
    'ph5l1': ['pho', 'fight', "Enough. Breathe. We begin again."],      /* FIGHT-DRAFT */
    'ph5l2': ['pho', 'fight', "Breathe. You are safe beside me."],      /* FIGHT-DRAFT */
    'tn5b1': ['ton', 'bagtied', "Brother. Before he took it from me. It was shaking. In my hands. Like it was spitting fireballs."],
    'q5b1': ['he', 'bagtied', "I believe you felt it."],
    'ko5b1': ['koh', 'bagtied', "It is... lighter. Is it lighter? Or is it me."],
    'ph5b1': ['pho', 'bagtied', "Both can be true."],
    'ph5b2': ['pho', 'bagtied', "Mend what you can with the people you quarrelled with. Not because of tonight. Because it is right."],
    'ph5b3': ['pho', 'bagtied', "And if you still do not sleep, see a doctor. And let the electrician come a fourth time."],
    'q5b2': ['he', 'bagtied', "Grandmaster. The smell. Was it real?"],
    'ph5b4': ['pho', 'bagtied', "You smelled it. They did not. That is a fact about you. It is not yet a fact about that house."],
    'ph5b5': ['pho', 'bagtied', "Your nose is open. Last time it was your sight. An open door is not a skill."],
    'ju5b1': ['jun', 'bagtied', "Master, the man with the collection. He called again. Tomorrow, three o'clock?"],
    'ph5b6': ['pho', 'bagtied', "Tomorrow."],
    'co5t1': ['collector', 'table', "Twenty. Twenty-one, with this one. I started with one."],
    'co5t2': ['collector', 'table', "Lately nothing goes right. I am tired all the time. And there is a smell. At home, in the car. I clean, it comes back. You will think I am mad."],
    'q5t1': ['he', 'table', "I caught it too. It was not coming from anywhere in the room. It was coming from them."],
    'ph5t1': ['pho', 'table', "Angry."],
    'ph5t2': ['pho', 'table', "Hungry."],
    'ph5t3': ['pho', 'table', "This only wants warmth. It does not know where it is."],
    'co5t3': ['collector', 'table', "Is it these? Is this why I am sick?"],
    'ph5t4': ['pho', 'table', "Your health: see a doctor. That comes first, whatever we find on this table. Both can be true."],
    'co5t4': ['collector', 'table', "My wife says the same."],
    'co5t5': ['collector', 'table', "All right. But some of these must be fine. I chose them one by one."],
    'co5t6': ['collector', 'table', "You. You can tell. Which ones can I keep?"],
    'ph5t5': ['pho', 'table', "SMELL."],
    'ph5t6': ['pho', 'table', "Look, so that you know what you are answering."],
    'co5t7': ['collector', 'table', "Take your time. I am not going anywhere."],
    'co5A1': ['collector', 'endA', "All? Even the ones that did nothing?"],
    'q5A1': ['he', 'endA', "All."],
    'co5A2': ['collector', 'endA', "So where do I buy good ones? You have a shop, right?"],
    'ph5A1': ['pho', 'endA', "First learn what you are asking for. Then ask."],
    'ph5A2': ['pho', 'endA', "He gave them up because you said so. You were right. He does not yet know why."],
    'q5A2': ['he', 'endA', "He will buy again. I gave him an answer, and no question."],
    'co5B1': ['collector', 'endB', "This one a dealer in Bangkok sold me. He said it was strong."],
    'co5B2': ['collector', 'endB', "This... came in a lot of five. I never asked."],
    'co5B3': ['collector', 'endB', "I do not know what this is."],
    'co5B4': ['collector', 'endB', "I do not know what half of them are."],
    'co5B5': ['collector', 'endB', "If I ever buy another..."],
    'q5B1': ['he', 'endB', "Ask it those two questions first."],
    'ph5B1': ['pho', 'endB', "You did not tell him what they were. You let him find out that he did not know. That is the only way it stays learned."],
    'q5B2': ['he', 'endB', "He put them down himself."],
    'co5C1': ['collector', 'endC', "Three! Only three."],
    'ph5C1': ['pho', 'endC', "This one. What is it?"],
    'co5C2': ['collector', 'endC', "I... do not know."],
    'ph5C2': ['pho', 'endC', "Nor does he. Your nose is not a certificate."],
    'q5C1': ['he', 'endC', "I sorted his collection by a smell. I would have sent him home with seventeen things neither of us understood."],
    'co5D1': ['collector', 'endD', "Yes. Yes! I know a man. Proper monks' pieces, all blessed. I can have twenty by Friday."],
    'ph5D1': ['pho', 'endD', "Twenty more things you do not understand, in the same case."],
    'ph5D2': ['pho', 'endD', "It is not the kind. A blessed piece kept as he kept these is kept the same way."],
    'q5D1': ['he', 'endD', "I gave him a rule about objects. The trouble was never the objects."],
    'co5z1': ['collector', 'close', "I feel lighter. My head is quieter."],
    'q5z1': ['he', 'close', "Understanding first. Then possession."],
    'q5A': ['he', 'card', "I told him to let them all go. He did, and did not know why."],
    'q5B': ['he', 'card', "I asked him what each one was. He found he did not know."],
    'q5C': ['he', 'card', "I sorted his pieces by a smell. My nose is not a certificate."],
    'q5D': ['he', 'card', "I gave him a rule about kinds. It was never the kind."]
  };
  /* which lines each place says, in the script's order (a film's builder reads its lines from here) */
  const SAID = {
    open: ['q5o1', 'ju5o1', 'tn5o1', 'q5o2'],
    walk: ['q5w1', 'tn5w1', 'tn5w2', 'ju5w1', 'ph5w1', 'ph5w2', 'ph5w3', 'q5w2', 'ju5w2', 'ph5w4', 'ph5w5', 'q5w3', 'tn5w3', 'ph5w6', 'ph5w7', 'tn5w4', 'q5w4'],
    devotee: ['ko5d1', 'ko5d2', 'ko5d3', 'ko5d4', 'ph5d1', 'ph5d2'],
    hunt: ['q5h1', 'q5h2', 'q5h3', 'ph5h1', 'q5h4', 'ph5h2', 'ph5h3', 'ph5h4', 'q5h5', 'ph5h5', 'ph5h6', 'ph5h7', 'ph5v1', 'ph5v2'],
    prepare: ['ph5p1', 'ko5p1', 'ph5p2', 'q5p1'],
    fight: ['ph5f1', 'ph5f2', 'ph5f3', 'ph5f4', 'ph5f5', 'ph5f6', 'ph5f7', 'ph5f8', 'ph5f9', 'ph5f10', 'ph5na1', 'ph5na2', 'ph5na3', 'ph5nb1', 'ph5nb2', 'ph5nc1', 'ph5nc2', 'ph5nc3', 'ph5nd1', 'ph5nd2', 'ph5nd3', 'ph5ne1', 'ph5nf2', 'ph5nf3', 'ph5ng1', 'ph5ng2', 'ph5nh2', 'ph5ni1', 'ph5ni2', 'ph5g1', 'ph5g2', 'ph5g3', 'tn5c0', 'ko5c1', 'tn5c1', 'ju5c1', 'tn5c2', 'ju5c2', 'ko5c2', 'tn5c3', 'q5c0', 'q5c1', 'q5c3', 'ph5c1', 'q5c2', 'ph5c2', 'ph5c3', 'ph5c4', 'ph5l1', 'ph5l2'],
    bagtied: ['tn5b1', 'q5b1', 'ko5b1', 'ph5b1', 'ph5b2', 'ph5b3', 'q5b2', 'ph5b4', 'ph5b5', 'ju5b1', 'ph5b6'],
    table: ['co5t1', 'co5t2', 'q5t1', 'ph5t1', 'ph5t2', 'ph5t3', 'co5t3', 'ph5t4', 'co5t4', 'co5t5', 'co5t6', 'ph5t5', 'ph5t6', 'co5t7'],
    endA: ['co5A1', 'q5A1', 'co5A2', 'ph5A1', 'ph5A2', 'q5A2'],
    endB: ['co5B1', 'co5B2', 'co5B3', 'co5B4', 'co5B5', 'q5B1', 'ph5B1', 'q5B2'],
    endC: ['co5C1', 'ph5C1', 'co5C2', 'ph5C2', 'q5C1'],
    endD: ['co5D1', 'ph5D1', 'ph5D2', 'q5D1'],
    close: ['co5z1', 'q5z1'],
    card: ['q5A', 'q5B', 'q5C', 'q5D']
  };
  /* who speaks, as a caption names them (c_story.js: a line whose take has not landed is shown, not lost) */
  const WHO = { he: "Master Zavier", pho: "Grandmaster Pho", ton: "Ton", jun: "Jun", koh: "Mr Koh", collector: "The collector" };
  /* LINES END */

  /* A FILM'S TIMES are built from SECS (chapter 3's tl, as chapter 4 has it): a list of ['line', gap], [secs] (a pause)
     and ['@mark'] (a named moment); the answer maps every line and mark to its start on the film's own clock, and `end`
     to where the list ends, so the cues and the pictures read the same numbers, and a measured take moves everything
     after it (v5.15). TODO-FILM: every film of this chapter is to be timed this way from SAID and SECS. */
  function tl(start, list) {
    const T = {}; let t = start;
    for (const it of list) {
      if (typeof it[0] === 'number') { t += it[0]; continue; }
      if (it[0][0] === '@') { T[it[0].slice(1)] = t; continue; }
      T[it[0]] = t; t += (SECS[it[0]] || 2.5) + (it[1] || 0);
    }
    T.end = t;
    return T;
  }

  const DATA = {
    id: 5,
    episode: 4,
    /* (the casebook's own title until Chad names one: v23.3) */
    title: 'The House With Nine Prai',
    cardLabel: 'Chapter 5',
    cardTitle: 'The House With Nine Prai',
    /* (DRAFT, mine: the case file's first sentence, as a brief. The plan writes none) */
    brief: 'A devotee’s home at dusk. He has been quarrelling with people outside, and at home he cannot rest. You go with Grandmaster Pho.',
    /* the prompt is the turning point's own picture (the plan's 4.8): the collector looks up, not at the old master: at
       the young man who has been staring at his pieces */
    prompt: 'He is asking you which ones he can keep.',
    /* THE DECISION (the plan's 4.8, Chad's "Ok", R14; its ranks B best, A good, C bad, D worst; not timed). Built on what
       S1·15 alone teaches. Four KINDS of answer and four roads to the same place: an order (A), the case file's own plain
       questions handed to the man (B), the student made his appraiser (C), a rule about kinds of object (D). In none does
       he leave the work, and in every one all twenty go into the bag. Checked against every earlier decision (4.11).
       THE DELTAS are the episode's own for each rank (chapters 2 and 3: best 6/6/18, good 3/6/9, bad -6/3/-9, worst
       -3/0/-18): a default, the plan gives ranks and no numbers.
       EACH `say` (the line under the outcome card, his own terse reflection: v4.91) and EACH `teach` (the case file's own
       sentence first, then what you did) is a DRAFT, mine: the plan writes neither. A `say` is also a spoken line: its
       words are held to the script's (lines.json q5A to q5D) by the assembler. */
    choices: [
      { k: 'A', text: 'None of them. Let them all go.',
        d: { sanity: 3, awareness: 6, wisdom: 9 }, verdict: 'good',
        say: 'I told him to let them all go. He did, and did not know why.',
        teach: 'Do not collect spiritual objects the way people collect ordinary things. You told him to let all of them go, and he did, because you said so. He does not yet know why, and you gave him no question to ask before the next one.' },
      { k: 'B', text: 'Tell me what each one is, and where it came from.',
        d: { sanity: 6, awareness: 6, wisdom: 18 }, verdict: 'best',
        say: 'I asked him what each one was. He found he did not know.',
        teach: 'The real questions are much plainer: what exactly are you bringing into your home, where did it come from, and do you actually understand what you are keeping? You asked him, and he answered them himself. He put them down himself.' },
      { k: 'C', text: 'These three are the worst. The rest feel quiet.',
        d: { sanity: -6, awareness: 3, wisdom: -9 }, verdict: 'bad',
        say: 'I sorted his pieces by a smell. My nose is not a certificate.',
        teach: 'Curiosity is not protection, sensitivity is not mastery, and experiencing something is not the same as understanding it. You sorted another man’s collection by a smell, and would have sent him home with seventeen things neither of you understood.' },
      { k: 'D', text: 'Keep the holy ones. The Yin ones are the trouble.',
        d: { sanity: -3, awareness: 0, wisdom: -18 }, verdict: 'worst', critical: true,
        say: 'I gave him a rule about kinds. It was never the kind.',
        teach: 'The problem here is not simply whether an amulet is Yin or Yang. If you do not understand what you are inviting into your environment, do not bring it home. You gave him a rule about kinds of object, and he was ready to fill the same case again.' }
    ],
    /* THE LESSON CARD (the plan's 4.10, its default 3 until Chad picks: v11.9): S1·14's last sentence, the case file's
       words exactly, and the sentence the episode's own plan closes episode 4 on. No term is added (v11.10). */
    core: 'Cultivation, control, experience and discernment — that is the real path, and there is no shortcut through any of it.',

    /* TODO-WORLD: units metres, y up. The skeleton's ground is one bare floor, 12 m by 16 m: he begins at its near end
       looking down it (a turn of 0 looks toward -z), and the four phases' stand-ins lie along it toward the far end,
       where the decision's anchor is. Every number here is replaced when the plan's 8 is built (the lift landing and
       the walkway, his gate and court, the living and dining room; then the receiving room of case three). */
    spawn:     { x: 0, y: 1.62, z: 6.5, rot: 0 },
    shrine:    { x: 0, z: -6.0 },                // the engine's anchor (ghost: null): the decision's place, the chapter's pile
    ghostHome: { x: 0, z: -6.0 },
    bounds:    { minX: -6, maxX: 6, minZ: -8, maxZ: 8 },

    ghost: null,
    fireLight: null,
    daylight: DUSK,
    /* (the speed-up of v26.11 that chapters 3 and 4 took: a picture's decoded copy let go once it is on the graphics chip) */
    render: { freePictures: true },
    /* (in the run from its first build: Chad's rule of v27.0, every build a full release; never a preview chapter) */

    /* TODO-PLAY, each an engine seam declared when its play is built (the plan's 12): SPIRIT VISION (chapter 4's fiftieth
       seam, with this chapter's own sounds: another chapter's sound named here would leave that chapter's pack), SMELL (a
       HUD button like the eye's, a nose; N on a desktop), and the third-person mode of the fight. Nothing is declared
       until it is played, so no button stands on the screen with nothing behind it. */

    assets: [
      /* the people and the things made for this chapter (masters/v28.0/make.sh): Master Zavier's body, Chad's pick, the
         first of the four made (R10): the lighter body with his walk, and every triangle of him for within 2.2 m and the
         films (v26.5); the Naga stick, from his photograph */
      /* >>> this chapter's own keys: written by masters/v28.0/keys.py (edit its table, not this list) >>> */
      'p5zavier', 'p5zavierh', 'w5nagastaff',
      /* <<< this chapter's own keys <<< */
      /* TODO-WORLD, when each is cast (the plan's 9): Grandmaster Pho (`pho`) and Ton (`e4ton`), each a declared reuse in
         the episode (reuseInEpisode); Jun, Mr Koh, the collector, the nine, the Naga; the things of the home and the room */
    ],
    /* FRESH (chaptertest): what this chapter takes from the chapters before it, declared (Chad, v17.4) */
    reuse: {},
    reuseInEpisode: {},
    placeholders: {},
    items: [],

    musicVol: 0,
    /* THE BEDS: none yet (TODO: the plan's 10; each the chapter's own file, at 0 here and mixed by the place and the beat) */
    ambience: { beds: [] },
    voiceLine: null,

    words: {
      approach: '',
      act: 'E to act',
      actTouch: 'Tap to act',
      interact: 'E to answer',
      interactTouch: 'Tap to answer',
      actLine: 'Press E to answer',
      actLineTouch: 'Tap to answer',
      // PLAY I · the walkway (the plan's 4.1)
      objAsk: 'Something smells. Ask the others.',
      objFollow: 'Follow the smell.',
      /* the input, beside the order, for the device he is on (v18.5): N for the nose; no voice ever names an input */
      smellTouch: 'Tap SMELL',
      smellKey: 'Press N',
      // PLAY II · the hunt (the plan's 4.3): the count is derived on the frame from what is found, never stored (v11.6)
      objHunt: 'Find where the smell is strongest. {n}/3',
      // THE CLEANSING (the plan's 5.2, 5.5 and 5.8) · FIGHT-DRAFT, every one: the fight is being redesigned (R14) and
      // these words change with it
      fightTitle: 'THE CLEANSING',
      fightBrief1: 'You play Grandmaster Pho and Master Zavier. Switch between them.',
      fightBrief2: 'Master Zavier holds the Prai. Grandmaster Pho fires at them and bags them.',
      fightBrief3: 'Keep Master Zavier safe. Nine Prai.',
      objFight1: 'Fire at the Prai. Then bag it.',
      objFight2: 'Switch to Master Zavier. Steady.',
      objFight2b: 'Switch to Grandmaster Pho. Fire. Bag.',
      objFight3: 'Bag the Prai: {n} left',
      objFight6: 'Bag the last three.',
      btnFire: 'FIRE',
      btnShockwave: 'SHOCKWAVE',
      btnBag: 'BAG',
      btnSteady: 'STEADY',
      btnSmell: 'SMELL',
      btnPho: 'PHO',
      btnZavier: 'ZAVIER',
      btnTogether: 'TOGETHER',
      // the card when the fight is lost (the fight begins again, never the chapter: R14)
      lostSay: 'The cleansing was broken.',
      lostAgain: 'BEGIN AGAIN',
      lostLead: 'Let Grandmaster Pho lead',
      // the card between the two cases (the plan's 4.6: the next case, never the future; a day is the plan's own)
      cardNext: 'The next afternoon.',
      // PLAY III · the collector (the plan's 4.7)
      objSmell: 'Something smells. SMELL.',
      objLook: 'Open Spirit Vision. Look at the pieces.',
      // THE SKELETON'S STAND-INS (TODO-PLAY, TODO-FIGHT): what is pressed in each phase until its play is built. Mine,
      // not the plan's: each goes when the play it stands for is built
      hotGate: 'Go to the gate',
      hotStain: 'Look here',
      hotCleanse: 'Begin the cleansing',
      hotPieces: 'Look at the pieces'
    },
    sayPrefix: 'q5'
  };

  function build(ctx) {
    const { THREE, scene, camera, yaw, kit, getState, startDecision, worldSfx, soundOff, makeHellNote } = ctx;

    /* (the v21.1 TDZ law: everything a builder or a frame asks for is declared up here, before anything is built) */
    const owned = [];
    let alive = true;
    const madeTex = [];
    const tex = (t) => { madeTex.push(t); return t; };
    /* the contract wants a note texture (the engine's note prop reads it at boot) */
    const noteTex = tex(makeHellNote ? makeHellNote() : new THREE.DataTexture(new Uint8Array([200, 170, 90, 255]), 1, 1));
    const mats = [];
    const M = (o) => { const m = new THREE.MeshStandardMaterial(o); mats.push(m); return m; };
    const wallNow = () => performance.now() / 1000;
    const world = new THREE.Group(); world.name = 'e4c5'; scene.add(world);

    /* ================================================================ THE WORLD · TODO-WORLD (the plan's 8; M6)
       THE SKELETON'S GROUND: one bare floor the size of the chapter's bounds, lit by the chapter's daylight (the dusk:
       no lamp is added on screen, v15.1). Nothing else is drawn, and nothing here is a place of the story.
       WHAT IS BUILT HERE (the plan's 8.1 and 8.2, and its 9.4 for the things, every one a real model):
         case two   the lift car (the opening film), the lift landing, about 24 m of open walkway with one turn and a
                    drain's grating at its edge, his gate between two posts, his court (5.2 m by 8.4 m, open to the sky:
                    two planters, a path, two wall lamps, the doors), and one L-shaped living and dining room (7.2 m
                    across) with its terrace doors. Dusk on the walkway; the court at dusk, then night for the cleansing.
         case three a room of its own, where Grandmaster Pho receives people in Singapore: about 4 m by 5 m in daylight,
                    a low table and a white cloth, a small altar shelf behind him, one window, a ceiling fan.
       When the places stand: `blockers()` (d_play.js) is their walls and furniture, each a column from the floor;
       `stage.keepIn` names the ground he is kept on, `stage.arrivals` where a scene change puts him down, and
       `stage.grounds` each later ground (the court at night, the receiving room), so walktest floods every one. */
    const FLOOR = { x0: DATA.bounds.minX, x1: DATA.bounds.maxX, z0: DATA.bounds.minZ, z1: DATA.bounds.maxZ };
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(FLOOR.x1 - FLOOR.x0, FLOOR.z1 - FLOOR.z0), M({ color: 0x8a8580, roughness: 0.95, metalness: 0 }));
    floor.name = 'floor'; floor.rotation.x = -Math.PI / 2;
    floor.position.set((FLOOR.x0 + FLOOR.x1) / 2, 0, (FLOOR.z0 + FLOOR.z1) / 2);
    floor.receiveShadow = true;
    world.add(floor);
    /* the solids he cannot walk through: none yet (the bounds hold him on the floor) */
    const solids = [];

    /* WHERE THE STAND-INS LIE along the floor, from the near end to the far (each at the height a mark is read at: v7.5).
       TODO-WORLD: each becomes a place of the story (the gate between its posts; the shoe cabinet, the planter's foot
       and the threshold; the court's middle; the table) */
    const SPOT = {
      gate:   { x: 0, y: 1.4, z: 3.2 },
      stain1: { x: -2.4, y: 1.0, z: 0.8 },
      stain2: { x: 0, y: 1.0, z: -0.4 },
      stain3: { x: 2.4, y: 1.0, z: 0.8 },
      court:  { x: 0, y: 1.4, z: -2.4 },
      pieces: { x: 0, y: 1.0, z: -4.6 }
    };

    /* ================================================================ THE STORY'S SKELETON (the tracker's M5c)
       THE PHASES (the plan's 4: "each a save"): walk -> hunt -> fight -> table -> ask.
         walk   the walkway, from a step outside the lift to his gate (4.1)                              TODO-PLAY
         hunt   the home and its court: the three stains, the armchair, the nine (4.3)                   TODO-PLAY
         fight  THE CLEANSING: the tag team in third person, from its brief (4.5 and the whole of 5)     TODO-FIGHT
         table  the collector's pieces on the white cloth, the next afternoon (4.7)                      TODO-PLAY
         ask    the collector has asked: the decision is open, and opens again after a step back (4.8)
       A Continue lands at the START of its phase (the fight at its brief; after a loss, where the fight's own rules put
       him), and what was found in a phase rides the phase string, as chapter 4's history did: 'hunt:s1,s3' is the hunt
       with two stains found. The phase string is the save's only receipt (v7.3).
       BETWEEN THE PHASES, the films (z_tail.js): the opening before `walk`; `devotee` into the hunt; `prepare` into the
       fight; `together` inside it (the Naga); `bagtied` and then `collector` into the table. The next phase is BOOKED
       before its film begins (a film from play saves first: v21.1), so a game closed in the middle of a film comes back
       at the start of the phase the film hands to.
       IN THIS SKELETON each phase is one thing to press (three in the hunt), and what is pressed says the phase's own
       closing lines and hands on: so the whole chapter can be walked to its four endings, and nothing soft-locks. */
    const W = DATA.words;
    const PHASES = ['walk', 'hunt', 'fight', 'table', 'ask'];
    /* THE RECEIPTS a phase can carry on the phase string (the plan's 4.1, 4.3, 4.7). The skeleton writes the three
       stains; the others are named so that the play built here finds its letters waiting:
         walk   t Ton asked, j Jun asked, d the drain smelled
         hunt   s1 s2 s3 the three stains (the shoe cabinet, the planter's foot, the threshold), a the armchair, n the nine seen
         table  m he has smelled the pieces, k1 k2 k3 the three presences looked at (angry, hungry, looking for energy) */
    const RECEIPTS = { walk: ['t', 'j', 'd'], hunt: ['s1', 's2', 's3', 'a', 'n'], fight: [], table: ['m', 'k1', 'k2', 'k3'], ask: [] };
    const STAINS = ['s1', 's2', 's3'];
    const play = { run: 0, busy: false, found: new Set() };
    let phase = null, booted = false, decOpen = false, lookName = 'DUSK';
    const live = (run) => alive && run === play.run;
    const stainsFound = () => STAINS.filter(c => play.found.has(c)).length;

    function mark() { return (RECEIPTS[phase] || []).filter(c => play.found.has(c)).join(','); }
    function readMark(p0) {
      const [p1, tag = ''] = String(p0 || '').split(':');
      const p = PHASES.includes(p1) ? p1 : 'walk', f = new Set(tag.split(',').filter(Boolean));
      return { p, found: RECEIPTS[p].filter(c => f.has(c)) };
    }
    function saveMark() { if (kit) kit.setPhase(phase + ':' + mark()); }
    /* something found in this phase: its receipt and the save. The order follows from whoever calls (a count going up
       is not a completion, v8.7; the last of a count is, and whatever closes the count says so) */
    function got(c) { play.found.add(c); saveMark(); }
    /* A PHASE BOOKED: the phase string says it from now, with nothing found in it yet; the order that was up is done
       (COMPLETE, for what he did), and the new phase's order waits for whatever hands off to it (v21.21) */
    function book(p) {
      phase = p; play.found = new Set();
      if (kit) { kit.setPhase(p + ':'); kit.objective(null); kit.waypoint(null); }
    }

    /* ---------------------------------------------------------------- the light of each phase (the chapter's own
       presets; TODO-WORLD: the dusk going to night over the court is a tween of the film before the fight) */
    const LOOK_OF = { walk: 'DUSK', hunt: 'DUSK', fight: 'NIGHT', table: 'DAY', ask: 'DAY' };
    function lookAt0(name, secs = 0) { lookName = name; if (kit && kit.daylight) kit.daylight(PRESETS[name] || DUSK, secs); }

    /* ---------------------------------------------------------------- the chapter's clock and its one voice at a time
       (chapter 3's queue, as chapter 4 copies it). The clock runs in play only, on wall time, so a panel stands it
       still while a voice plays on (v21.21); the line queue and every timer of the play run on it. */
    const dayClock = { t: 0 };
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    const heard = new Set();
    const speak = { until: 0, pending: null, voiceTo: 0 };
    function speakReset() { speak.until = 0; speak.pending = null; speak.voiceTo = 0; }
    /* A LINE WHOSE TAKE HAS NOT LANDED IS SHOWN (TODO-VOICE): its words at the foot of the screen for its provisional
       length, under who says them, so the skeleton can be read. It shows ONLY when the line's bytes never came (the
       give-up below): the day a take lands under its key, the line is heard and its caption is gone, with nothing here
       to change. (The fight's own captions, on for every prompt whether or not the sound is, are the fight's: the
       plan's 7.1.) */
    function showLine(name) {
      const L = LINES[name];
      if (!L || !kit || !kit.captions) return;
      kit.captions([{ at: 0, end: (SECS[name] || 2.5) + 0.4, text: L[2], sub: WHO[L[0]] || '' }]);
    }
    /* A LINE IS A BEAT, HEARD OR NOT (e3c3's law): a muted game speaks it silently on its own length, a line whose bytes
       have not landed is held a moment (v8.0) and then spoken silently, so a beat chained on a line never stops */
    function sayLine(name, vol = 1, onStart, pan) {
      if (dayClock.t < speak.until) return false;
      const start = (silent) => { speak.voiceTo = dayClock.t + (SECS[name] || 2.5); speak.until = speak.voiceTo + 0.25; heard.add(name); if (silent) showLine(name); if (onStart) onStart(); };
      if ((soundOff && soundOff()) || !worldSfx) { start(false); return true; }
      if (worldSfx(name, vol, 1, pan)) { start(false); return true; }
      speak.pending = { name, vol, start, pan, give: dayClock.t + 1.6 };
      speak.until = dayClock.t + 0.2;
      return true;
    }
    function runSpeak() {
      const q = speak.pending;
      if (!q || dayClock.t < speak.until) return;
      if (soundOff && soundOff()) { speak.pending = null; q.start(false); return; }
      if (dayClock.t > q.give) { speak.pending = null; q.start(true); return; }
      if (worldSfx(q.name, q.vol, 1, q.pan)) { speak.pending = null; q.start(false); }
      else speak.until = dayClock.t + 0.2;
    }
    const lineQ = [];
    function queueLine(name, onStart, vol = 1, pan = 0) { lineQ.push({ name, onStart, vol, pan }); }
    function queueFn(fn) { lineQ.push({ fn }); }
    function queueGap(gap) { lineQ.push({ gap }); }
    function runQueue() {
      if (!lineQ.length || speak.pending || dayClock.t < speak.until) return;
      const q = lineQ.shift();
      if (q.fn) { q.fn(); return; }
      if (q.gap) { speak.until = dayClock.t + q.gap; return; }
      sayLine(q.name, q.vol, q.onStart, q.pan);
    }
    /* a line of the script, by its key (TODO-PLAY: who says it talks from its own start and rests after: v11.4) */
    function say(name) { if (!LINES[name]) console.warn('e4c5: no line ' + name + ' in the script'); queueLine(name); }
    /* what follows the lines now queued, once every one of them is done (v21.21); dropped if the phase has been left */
    function andThen(fn) { const run = play.run; queueFn(() => { if (live(run)) fn(); }); }

    /* ---------------------------------------------------------------- the orders (one at a time, after the lines that
       hand off to them: v21.21; COMPLETE only for what he did: v8.7). TODO-PLAY: the plan's own orders are in the words
       (objAsk, objFollow with its input, objHunt, objSmell, objLook) and the fight's in its draft; the skeleton shows
       only what its stand-ins can truthfully ask */
    function objectiveFor(opts) {
      if (!kit || play.busy) return;                           // a line is handing off: the order waits for it
      let o = null, wp = null;
      if (phase === 'walk') { o = W.objFollow; wp = SPOT.gate; }
      else if (phase === 'hunt') { if (stainsFound() < 3) o = W.objHunt.replace('{n}', String(stainsFound())); }
      else if (phase === 'fight') { o = W.hotCleanse; wp = SPOT.court; }
      else if (phase === 'table') { o = W.hotPieces; wp = SPOT.pieces; }
      kit.objective(o, opts);
      kit.waypoint(wp);
    }

    /* ---------------------------------------------------------------- a film from play, and what it hands to. A film
       the engine will not play (not in play, or no such film) costs the film, never the story: its hand-off runs */
    function film(key, next) {
      const run = play.run, go = () => { if (live(run)) next(); };
      if (!kit || !kit.film || !kit.film(key, { onDone: go })) go();
    }

    /* ================================================================ PLAY I · THE WALKWAY (the plan's 4.1) · TODO-PLAY
       To be built: the asks of Ton and Jun (q5w1, tn5w1, tn5w2, ju5w1), his teacher's two lines once both are asked
       (ph5w1, ph5w2) and the SMELL button with them; SMELL's threads; the drain, the decoy (q5w2, ju5w2, ph5w4); the
       true trail round the turn to the gate; the eye dimmed and saying why (ph5w3); the prompts while a need stands
       (ph5w6, ph5w7, tn5w3, tn5w4, q5w4); the followers who walk with him and are not solid to him.
       THE STAND-IN: the gate, at the end of the floor. Pressed, it says the gate's own two lines and hands to the
       devotee's film. */
    function walkBegin() { lookAt0(LOOK_OF.walk); objectiveFor({ complete: false }); }
    function atGate() {
      if (phase !== 'walk' || play.busy) return false;
      play.busy = true; if (kit) kit.waypoint(null);
      say('ph5w5');                                            // "The spiritual sense of your nose is already open. That is why it reached you, and not them."
      say('q5w3');                                             // "We were not even at his door."
      andThen(() => { play.busy = false; book('hunt'); film('devotee', () => huntBegin([])); });
      return true;
    }

    /* ================================================================ PLAY II · THE HUNT (the plan's 4.3) · TODO-PLAY
       To be built: SMELL and Spirit Vision at each of the three places (the mark pressed, the eye asked for, he looks, he
       closes: chapter 4's strain, ph5v1 and ph5v2); the nine, seen the first time his Spirit Vision is open in the court
       (ph5h1, q5h4, ph5h2), standing where he must search; the armchair, where his nose is behind the truth (ph5h4,
       q5h5); the hints (ph5h5 to ph5h7); every order of finding walked by a probe before it ships (chapter 4's R137).
       THE STAND-IN: three places on the floor, in any order; each says his own line of what he perceives and where.
       The count on the order is derived on the frame from what is found (v11.6). All three found: his teacher's belief,
       and the film of the preparation. */
    function huntBegin(found) { play.found = new Set(found); lookAt0(LOOK_OF.hunt); objectiveFor({ complete: false }); if (stainsFound() === 3) huntDone(); }
    function findStain(c, line) {
      if (phase !== 'hunt' || play.busy || play.found.has(c)) return false;
      play.busy = true;
      say(line);
      andThen(() => { play.busy = false; got(c); if (stainsFound() === 3) huntDone(); else objectiveFor({ complete: false }); });
      return true;
    }
    function huntDone() {
      play.busy = true; if (kit) { kit.objective(null); kit.waypoint(null); }
      say('ph5h3');                                            // "I believe somebody poured this here: the oil of nine Prai. I believe it was people who are angry with him."
      andThen(() => { play.busy = false; book('fight'); film('prepare', () => fightBegin()); });
    }

    /* ================================================================ THE CLEANSING (the plan's 4.5 and 5) · TODO-FIGHT
       To be built on the engine's third-person seams (the tracker's M4) and the fight's rules (c_fightrules.js, the
       tracker's M3a, when it is here): the brief with its looping picture and START (W.fightTitle, W.fightBrief1 to 3);
       the camera behind and above the played one; Grandmaster Pho with the Naga stick and Master Zavier in his cage;
       the nine; the switch; every prompt of the script's fight lines, each also a caption; the film `together` (the
       Naga) inside it; the loss, which begins the FIGHT again and never the chapter (W.lostSay, W.lostAgain); the mode
       holding the save from its opening until it is left for good, so a Continue lands at the brief.
       THE STAND-IN: one thing to press in the middle of the floor. It passes the fight, says nothing (every line of
       the fight is a draft), and hands to the film of the bag tied, the card of the next afternoon and the collector's
       film in. */
    function fightBegin() { lookAt0(LOOK_OF.fight); objectiveFor({ complete: false }); }
    function cleanse() {
      if (phase !== 'fight' || play.busy) return false;
      book('table');
      film('bagtied', () => film('collector', () => tableBegin([])));
      return true;
    }

    /* ================================================================ PLAY III · THE COLLECTOR (the plan's 4.7) · TODO-PLAY
       To be built: seated at the table (he looks; he does not walk); SMELL, the threads rising from the pieces (q5t1);
       Spirit Vision and the three presences, each a look answered by a press (ph5t1, ph5t2, ph5t3); the doctor, said to
       the man's face before anything is decided, so in every ending (co5t3, ph5t4, co5t4); the prompts (ph5t5, ph5t6);
       then the question.
       THE STAND-IN: the pieces, pressed. The collector looks down at his rows, and up at the student: his two lines,
       and the decision opens on the second. */
    function tableBegin(found) { play.found = new Set(found); lookAt0(LOOK_OF.table); objectiveFor({ complete: false }); }
    function atPieces() {
      if (phase !== 'table' || play.busy) return false;
      play.busy = true; if (kit) kit.waypoint(null);
      say('co5t5');                                            // "All right. But some of these must be fine. I chose them one by one."
      say('co5t6');                                            // "You. You can tell. Which ones can I keep?"
      andThen(() => { play.busy = false; book('ask'); askBegin(); });
      return true;
    }

    /* ================================================================ THE DECISION (the plan's 4.8): he is asking you
       which ones he can keep. Not timed. It opens here, and again at the table after a step back (d_play.js: the pile
       is live only while the question stands). TODO-PLAY: the collector's patience after 30 s (co5t7); the picture
       while he chooses (chapter 4's law: what he is asked about is seen while the choice is made) */
    function openDecision() {
      decOpen = true;
      if (getState() === 'play') startDecision();
    }
    function askBegin() { lookAt0(LOOK_OF.ask); const run = play.run; after(0.6, () => { if (live(run)) openDecision(); }); }

    /* ---------------------------------------------------------------- the things he can press (each offered only in
       its phase, only while no line is handing off, and never once it is done: derived, so a replay needs nothing put
       back). TODO-PLAY: every one is a stand-in */
    const hotspots = [
      { id: 'gate', pos: SPOT.gate, radius: 2.0, prompt: W.hotGate,
        enabled: () => phase === 'walk' && !play.busy, onInteract() { return atGate(); } },
      { id: 'stain1', pos: SPOT.stain1, radius: 1.8, prompt: W.hotStain,
        enabled: () => phase === 'hunt' && !play.busy && !play.found.has('s1'), onInteract() { return findStain('s1', 'q5h1'); } },
      { id: 'stain2', pos: SPOT.stain2, radius: 1.8, prompt: W.hotStain,
        enabled: () => phase === 'hunt' && !play.busy && !play.found.has('s2'), onInteract() { return findStain('s2', 'q5h2'); } },
      { id: 'stain3', pos: SPOT.stain3, radius: 1.8, prompt: W.hotStain,
        enabled: () => phase === 'hunt' && !play.busy && !play.found.has('s3'), onInteract() { return findStain('s3', 'q5h3'); } },
      { id: 'cleanse', pos: SPOT.court, radius: 2.0, prompt: W.hotCleanse,
        enabled: () => phase === 'fight' && !play.busy, onInteract() { return cleanse(); } },
      { id: 'pieces', pos: SPOT.pieces, radius: 2.0, prompt: W.hotPieces,
        enabled: () => phase === 'table' && !play.busy, onInteract() { return atPieces(); } }
    ];

    /* ---------------------------------------------------------------- a phase set from outside (a probe; the walk
       test's later grounds) and a phase applied from the save (a Continue, the selector, a replay: every phase is
       covered, and anything else is the walkway) */
    function setPhase(p) { applyPhase(PHASES.includes(p) ? p : 'walk'); saveMark(); }
    function applyPhase(saved) {
      const R = readMark(saved);
      /* (a jump from one phase to another drops what the last one had queued: its lines, its timers, its busy hand-off:
         the v21.25 law, a phase jump leaves the line queue full) */
      phase = R.p; play.run++; play.busy = false; play.found = new Set(R.found); decOpen = false;
      lineQ.length = 0; speakReset(); dropTodo();
      if (kit && kit.captions) kit.captions(null);
      if (R.p === 'walk') walkBegin();
      else if (R.p === 'hunt') huntBegin(R.found);
      else if (R.p === 'fight') fightBegin();
      else if (R.p === 'table') tableBegin(R.found);
      else askBegin();
    }
    function storyReset() {
      play.run++; play.busy = false; play.found = new Set(); decOpen = false;
      if (kit && kit.captions) kit.captions(null);
      lookAt0('DUSK');
    }
    function storySnap() { return { phase, found: [...play.found], busy: play.busy, decOpen, look: lookName }; }

    /* ================================================================ THE FRAME, AND THE STAGE HANDED TO THE ENGINE */
    const wallClock = { t: 0 };
    let lastWall0 = 0, lastWall = 0, pausedAt = 0;

    /* the decision's anchor (the engine's pile): the collector's table, at the far end of the floor (TODO-WORLD: the
       low table in the receiving room). The decision is opened by the collector's question, never by walking up to
       it; the pile is live only while the question stands, so a decision stepped back from is opened again there */
    const INTERACT_R = 2.6;
    const PILE_POS = new THREE.Vector3(DATA.shrine.x, 0, DATA.shrine.z);
    const pile = new THREE.Group(); pile.position.copy(PILE_POS); world.add(pile);
    const _ndc = new THREE.Vector3();
    const pileLive = () => decOpen && phase === 'ask';
    function pileDist() { return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z); }
    function pileScreen() { camera.updateMatrixWorld(); return _ndc.set(PILE_POS.x, PILE_POS.y + 1.0, PILE_POS.z).project(camera); }
    function pileInView() { if (!pileLive()) return false; const n = pileScreen(); return n.z < 1 && Math.abs(n.x) < 1.1 && Math.abs(n.y) < 1.1; }
    function pointerHitsPile() { return pileLive() && pileDist() < INTERACT_R; }
    function interactPile() { if (!pileLive() || getState() !== 'play') return false; startDecision(); return true; }

    /* THE FRAME (chapter 4's): the chapter's clock runs in play only; a voice plays on under a panel while the clock
       stands still, so its booking comes forward by the time the panel was up, as far as the voice's own end (e3c3's
       v21.21 law); the saved phase is applied on the first frame of play, never before (v9.3) */
    function updateNotes(dt, t) {
      const st = getState();
      const now = wallNow(), raw = lastWall0 ? Math.max(0, now - lastWall0) : 0, wdt = Math.min(0.25, raw); lastWall0 = now;
      wallClock.t += wdt;
      if (st !== 'play') { if (!pausedAt) pausedAt = now; lastWall = 0; return; }
      if (pausedAt) { const away = Math.max(0, now - pausedAt); pausedAt = 0;
        if (speak.voiceTo > dayClock.t) { const cut = Math.min(away, speak.voiceTo - dayClock.t); speak.until -= cut; speak.voiceTo -= cut; } }
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) { booted = true; applyPhase(kit ? kit.getPhase() : null); }
      runTodo(); runSpeak(); runQueue();
    }
    function updatePile() {}
    function updateFire() {}
    function updateSlow() {}

    function snap() { return { phase, story: storySnap() }; }
    function restore() {}
    /* A SAME-CHAPTER REPLAY never runs build() again: everything a run changes is put back here (v8.1) */
    function reset() {
      phase = null; booted = false; dropTodo(); speakReset(); lineQ.length = 0; heard.clear();
      dayClock.t = 0; wallClock.t = 0; lastWall0 = 0; lastWall = 0; pausedAt = 0;
      storyReset();
    }

    /* what he cannot walk through: every solid of the place, a column from the floor (v5.03). TODO-WORLD: none yet */
    function blockers() {
      const out = [];
      for (const s of solids) { s.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(s); bb.expandByScalar(0.14); bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40); out.push(bb); }
      return out;
    }

    function dispose() {
      alive = false;
      const geos = new Set(), ms = new Set();
      world.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) ms.add(m);
      });
      scene.remove(world);
      for (const o of owned) { if (o.parent) o.parent.remove(o); if (o.dispose) o.dispose(); }
      owned.length = 0;
      for (const g of geos) g.dispose();
      for (const m of ms) {
        for (const k of ['map', 'roughnessMap', 'metalnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) if (m[k] && m[k].dispose) m[k].dispose();
        m.dispose();
      }
      for (const m of mats) m.dispose();
      for (const t of madeTex) if (t && t.dispose) t.dispose();
      world.clear();
      S = null;
    }

    return (S = {
      world, noteTex, blockers: blockers(),
      /* TODO-WORLD: true only once every body is ready and no model is still being unpacked, so all of it is done under
         the curtain and warmed before the black lifts (chapter 4's R51; v14.15) */
      ready: () => true,
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => 0 },
      drum: null, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: null,
      skyAt: () => null,
      /* TODO-WORLD: where a scene change puts him down (`arrivals`), the ground he is kept on (`keepIn`), each later
         ground for the walk test (`grounds`: the court at night, the receiving room), and the floor's height (`groundAt`) */
      arrivals: [],
      get phase() { return phase; },
      setPhase, applyPhase,
      presets: PRESETS,
      plan: { FLOOR, SPOT },
      info: () => ({ phase, mark: mark(), t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard], until: +speak.until.toFixed(2),
                     pending: speak.pending ? speak.pending.name : null, applied: booted, busy: play.busy, decOpen }),
      sayLine, queueLine, queueFn, queueGap, dayClock, after,
      /* (a probe's handle on the script as the chapter holds it) */
      script: { SECS, LINES, SAID },
      hotspots,
      updateNotes, updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
    });
  }

  /* ================================================================ THE FILMS AND THE FOUR ENDINGS · TODO-FILM, every one
     EACH IS A STUB: a few seconds of the place as it stands, with no word said and no sound cued, ending as its kind
     must (the opening on its black, the title over it; a film from play back in play with the picture clear; an ending
     on its black, the card over it). So the chapter runs from its first frame to its four cards and nothing soft-locks.
     WHEN ONE IS BUILT: its lines are SAID.<place>, in the script's order; its clock is made by tl() from SECS, so a
     measured take moves everything after it (v5.15); its pictures are the stage's (a `films` handle on the stage, as
     chapter 4's c_ufilm.js) and are a pure function of the film's clock (v6.4); every cue is a literal call of the
     film language's sound verb, with the sound's name in quotes, in the film's own source, so the engine can read it
     and warm it (v10.2, v14.16), and none is written past the film's last track (v12.3). A cue needs its sound in the
     build first (its take in assets/audio, its row in main.js's STING_SAMPLE): chaptertest fails a cue that plays
     nothing, which is why a stub cues none (and why this comment does not spell one out: the scan reads comments too). */
  const STUB = { open: 4.0, film: 3.4, ending: 4.0 };          // seconds; a film from play is past 3.0 so that Skip is offered too

  /* a film from play, as a stub: the picture held where he stands, then play again */
  function stubFilm(c, s, api) {
    const { tr, step, rawK } = api, T = STUB.film;
    tr(0, T, () => {}, rawK);
    step(T, () => {});
  }
  /* an ending, as a stub: the picture held, then its black, which the outcome card lies over */
  function stubEnding(c, s, api) {
    const { tr, step, fade, rawK } = api, T = STUB.ending;
    tr(0, T, () => {}, rawK);
    fade(T - 1.0, T - 0.2, 0, 1);
    step(T, () => {});
    c.endFade = 1; c.keepFade = true;
  }

  /* THE OPENING FILM (the plan's 4.0: dusk; about 65 s; skip from 3 s) · TODO-FILM
     Black, a lift's hum, his thought (q5o1); inside a lift car through his eyes, Grandmaster Pho in white in front of
     him, Ton with something long wrapped in cloth, Jun with a duffel bag (ju5o1, tn5o1); the chime, the doors open on an
     open walkway in orange evening light, one step out and the picture SOURS (q5o2); the title. Play begins where the
     film left him, a step outside the lift. Its lines: SAID.open.
     It begins on black (v4.6) and keeps its black at its end, the title over it (v14.1). */
  function intro(c, s, api) {
    const { tr, step, fade, rawK } = api, T = STUB.open;
    tr(0, T, () => {}, rawK);
    fade(0.5, 1.6, 1, 0);
    fade(T - 0.9, T - 0.2, 0, 1);
    step(T, () => {});
    c.keepFade = true; c.endFade = 1;
  }

  /* THE DEVOTEE (the plan's 4.2: about 45 s), from the gate into the hunt · TODO-FILM
     Mr Koh opens his doors before they reach them, a wai to Grandmaster Pho, awkward and meant; the court crossed, in
     which nothing looks wrong to an ordinary eye and never will; his living room, curtains drawn at dusk, three lamps
     on and a fourth flickering; what has been happening to him, and that he has quarrelled with people (he does not
     say who, and nobody asks); "We will look first."; his teacher's order to the student. Its lines: SAID.devotee. */
  function filmDevotee(c, s, api) { stubFilm(c, s, api); }

  /* THE PREPARATION, AND THE TURN (the plan's 4.4: about 50 s), from the hunt into the fight · TODO-FILM
     Night now. Ton unwraps the Naga stick and Grandmaster Pho takes it; Jun lays the black bag down and draws white
     thread across the doorway, the household behind it; "Stand with me."; the stick set upright, the lamps sink, his
     Spirit Vision opens without his asking and the nine lift their heads; they turn toward the one whose senses are
     open, and come; the picture goes to the one flat colour of his protection (q5p1), a murmur begins; THE CAMERA
     LEAVES HIS EYES, and for the first time in the game Master Zavier is SEEN (Chad's R3 and R5), the picture coming
     to rest exactly where the fight's camera stands, so the film hands to the fight with no cut. Its lines: SAID.prepare. */
  function filmPrepare(c, s, api) { stubFilm(c, s, api); }

  /* TOGETHER (the plan's 5.5, stage 5: 25 s; it cannot be skipped the first time: kit.film's noSkip and
     ctx.sealedBefore, the forty-first seam), the ONE film inside the fight · TODO-FILM, FIGHT-DRAFT
     Grandmaster Pho plants the Naga stick. The Naga rises from its head, ruby and vast, and lays its long body once
     round the court's edge, between the nine and everyone in the court and at its door; the tall shape comes apart
     into its three, and they sink low and lie tired. The fight's mode is left before it and entered again after it,
     under its own fades (the plan's 5.11). NOT YET PLAYED: the stand-in for the fight passes it by. */
  function filmTogether(c, s, api) { stubFilm(c, s, api); }

  /* THE BAG TIED (the plan's 4.6: about 60 s), from the fight to the next afternoon · TODO-FILM
     The last of the nine is in the bag; the cage of light thins and the murmur stops in the middle of a breath; the
     camera goes back INTO his eyes, and the hands in front of him are his own again and shaking. Three shorter
     pictures of the rooms, the bag still open in Grandmaster Pho's hand; ONLY THEN the knot, the bag's own cord, tied
     "tightly" (no sacred string and no chant here: both are case three's); what Ton felt in his hands; Mr Koh's windows
     opened on night air, "Both can be true.", his teacher's two lines to him; at the lift, "Was it real?" and the case
     file's second lesson; the next case seeded; the lift's doors close on black; the card W.cardNext, "The next
     afternoon." Its lines: SAID.bagtied. */
  function filmBagTied(c, s, api) { stubFilm(c, s, api); }

  /* THE COLLECTOR, the film in (the plan's 4.7: 20 s), into the table · TODO-FILM
     Daylight. A low table covered with a white cloth, Grandmaster Pho seated behind it, a ceiling fan turning, the
     afternoon in the window; a man in his thirties sets down a padded case and lays its pieces out himself, quickly,
     the way a man gets rid of something: about twenty, in rows. Its lines: the first two of SAID.table (co5t1, co5t2). */
  function filmCollector(c, s, api) { stubFilm(c, s, api); }

  /* THE FOUR ENDINGS (the plan's 4.9), each a whole story, each ending that afternoon, and in each THE RITE, seen: the
     case file's own. Grandmaster Pho chants low and sprinkles holy water over the pieces with the fan; the film holds
     his Spirit Vision open for the rite's length; as the water touches them the presences cry out and come away from
     the pieces, each leaving the light of the table, thin and far (none is shown destroyed); the pieces are gathered
     into a black bag, sealed with white sacred string and chanted over "so that nothing could escape"; the smell goes
     (co5z1). THE LAST PICTURE, in every ending: the black bag on the white cloth, the string round its neck,
     Grandmaster Pho's hand resting on it, the empty foam case open beside it (q5z1). Then the lesson card.
     Each ending's lines: SAID.endA to SAID.endD, then SAID.close. TODO-FILM: all four, and the rite they share. */
  /* A · "NONE OF THEM. LET THEM ALL GO." (good): the right act and no understanding, an order; he will buy again */
  function scNone(c, s, api) { stubEnding(c, s, api); }
  /* B · "TELL ME WHAT EACH ONE IS, AND WHERE IT CAME FROM." (best): the case file's own plain questions, and the man
     answers them himself; he closes the case's lid and pushes it across the cloth */
  function scTell(c, s, api) { stubEnding(c, s, api); }
  /* C · "THESE THREE ARE THE WORST. THE REST FEEL QUIET." (bad): the student made his appraiser; on a piece already
     packed, something his nose never caught lifts its head */
  function scThree(c, s, api) { stubEnding(c, s, api); }
  /* D · "KEEP THE HOLY ONES. THE YIN ONES ARE THE TROUBLE." (worst): a rule about kinds of object, which the case file
     refuses in its first sentence; he is already counting twenty more on his fingers */
  function scHoly(c, s, api) { stubEnding(c, s, api); }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e4c5 = Object.assign(DATA, {
    build,
    intro,
    films: { devotee: filmDevotee, prepare: filmPrepare, together: filmTogether, bagtied: filmBagTied, collector: filmCollector },
    scenes: [scNone, scTell, scThree, scHoly]
  });
})();
