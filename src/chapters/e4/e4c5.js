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
  const SECS = {      // 99 of 149 MEASURED from their takes; the other 50 PROVISIONAL (words / 2.3 s)
    /* Master Zavier (the player) */
    'q5o1': 9.05, 'q5o2': 2.41, 'q5w1': 1.43, 'q5w2': 2.49, 'q5w3': 2.25, 'q5w4': 1.05, 'q5h1': 5.05, 'q5h2': 3.13,
    'q5h3': 4.01, 'q5h4': 1.5, 'q5h5': 1.53, 'q5p1': 2.97, 'q5c0': 5.22, 'q5c1': 5.22, 'q5c3': 1.74, 'q5c2': 1.74,
    'q5b1': 1.37, 'q5b2': 4.65, 'q5t1': 7.13, 'q5A1': 0.91, 'q5A2': 5.21, 'q5B1': 2.01, 'q5B2': 1.85, 'q5C1': 6.73,
    'q5D1': 4.81, 'q5z1': 3.13, 'q5A': 6.01, 'q5B': 4.97, 'q5C': 4.97, 'q5D': 4.33,
    /* Grandmaster Pho */
    'ph5w1': 5.69, 'ph5w2': 5.53, 'ph5w3': 2.81, 'ph5w4': 1.69, 'ph5w5': 8.23, 'ph5w6': 1.2, 'ph5w7': 3.44,
    'ph5d1': 1.56, 'ph5d2': 7.53, 'ph5h1': 1.37, 'ph5h2': 2.17, 'ph5h3': 7.29, 'ph5h4': 4.89, 'ph5h5': 1.37,
    'ph5h6': 1.69, 'ph5h7': 1.27, 'ph5v1': 5.05, 'ph5v2': 3.56, 'ph5p1': 4.57, 'ph5p2': 6.09, 'ph5f1': 0.43,
    'ph5f2': 3.04, 'ph5f3': 6.09, 'ph5f4': 0.43, 'ph5f5': 3.48, 'ph5f6': 1.74, 'ph5f7': 2.61, 'ph5f8': 2.17,
    'ph5f9': 2.61, 'ph5f10': 5.22, 'ph5na1': 3.04, 'ph5na2': 1.74, 'ph5na3': 0.87, 'ph5nb1': 1.74, 'ph5nb2': 1.3,
    'ph5nc1': 3.04, 'ph5nc2': 2.61, 'ph5nc3': 1.3, 'ph5nd1': 2.17, 'ph5nd2': 3.04, 'ph5nd3': 0.43, 'ph5ne1': 4.35,
    'ph5nf2': 2.17, 'ph5nf3': 0.43, 'ph5ng1': 3.48, 'ph5ng2': 2.17, 'ph5nh2': 0.43, 'ph5ni1': 1.74, 'ph5ni2': 1.3,
    'ph5g1': 0.43, 'ph5g2': 3.91, 'ph5g3': 2.61, 'ph5c1': 2.17, 'ph5c2': 2.61, 'ph5c3': 1.3, 'ph5c4': 3.04,
    'ph5l1': 2.17, 'ph5l2': 2.61, 'ph5b1': 1.51, 'ph5b2': 6.89, 'ph5b3': 7.45, 'ph5b4': 8.81, 'ph5b5': 7.13,
    'ph5b6': 1, 'ph5t1': 0.84, 'ph5t2': 0.97, 'ph5t3': 4.65, 'ph5t4': 8.27, 'ph5t5': 1.2, 'ph5t6': 3.05,
    'ph5A1': 5.21, 'ph5A2': 6.89, 'ph5B1': 8.44, 'ph5C1': 2.14, 'ph5C2': 4.17, 'ph5D1': 4.09, 'ph5D2': 6.17,
    /* Ton, the follower who carries the Naga stick */
    'tn5o1': 4.17, 'tn5w1': 0.97, 'tn5w2': 1.76, 'tn5w3': 1.45, 'tn5w4': 2.81, 'tn5c0': 3.48, 'tn5c1': 2.61,
    'tn5c2': 1.74, 'tn5c3': 1.3, 'tn5b1': 7.13,
    /* Jun, the second follower */
    'ju5o1': 5.48, 'ju5w1': 3.77, 'ju5w2': 2.17, 'ju5c1': 3.48, 'ju5c2': 2.17, 'ju5b1': 4.88,
    /* Mr Koh, the devotee */
    'ko5d1': 3.63, 'ko5d2': 10.89, 'ko5d3': 5.21, 'ko5d4': 5.03, 'ko5p1': 1.45, 'ko5c1': 3.91, 'ko5c2': 3.04,
    'ko5b1': 4.01,
    /* The collector */
    'co5t1': 3.68, 'co5t2': 10.81, 'co5t3': 2.91, 'co5t4': 2.11, 'co5t5': 4.12, 'co5t6': 3.21, 'co5t7': 2.81,
    'co5A1': 2.65, 'co5A2': 3.13, 'co5B1': 3.69, 'co5B2': 3.45, 'co5B3': 2.38, 'co5B4': 2.41, 'co5B5': 1.85,
    'co5C1': 1.9, 'co5C2': 1.89, 'co5D1': 7.05, 'co5z1': 2.53
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

    /* THE WORLD (masters/v28.0/parts/b_world.js; docs/V28.0-WORLD.md): units metres, y up, the origin at the middle of
       the lift's doors on the walkway's floor. He begins a step outside the lift, looking down the walkway (a turn of 0
       looks toward -z); the decision's anchor is the low table in case three's room, a pocket world 240 m along +z. The
       bounds hold both (what he walks is held by walls: stage.keepIn names it). */
    spawn:     { x: 0, y: 1.62, z: 0.25, rot: 0 },
    shrine:    { x: 0, z: 240.0 },               // the engine's anchor (ghost: null): the collector's table, the chapter's pile
    ghostHome: { x: 0, z: 240.0 },
    bounds:    { minX: -13.0, maxX: 2.5, minZ: -16.5, maxZ: 243.0 },

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
      'p5zavier', 'p5zavierh', 'w5nagastaff', 'p5koh', 'p5kohm', 'p5kohh', 'p5jun', 'p5junm', 'p5junh', 'w5rail',
      'w5walklight', 'w5grating', 'w5liftpanel', 'w5gate', 'w5gatepost', 'w5planter', 'w5planter2', 'w5walllamp',
      'w5slippers', 'w5frontdoor', 'w5shoecab', 'w5curtain', 'w5sofa', 'w5lowtable', 'w5tvconsole', 'w5oldchair',
      'w5floorlamp', 'w5tablelamp', 'w5wallclock', 'w5dintable', 'w5dinchair', 'w5pendant', 'w5sideboard', 'w5frame',
      'w5bagopen', 'w5bagtied', 'w5threadreel', 'w5staffwrap', 'w5staffcloth', 'w5duffel', 'w5clothtable',
      'w5padcase', 'w5cushion', 'w5altarshelf', 'w5ceilfan',
      /* <<< this chapter's own keys <<< */
      /* the estate's trees on the lawn below the walkway (chapter 4's: declared, reuseInEpisode) */
      'w4angsana', 'w4foxpalm',
      /* TODO-WORLD, when each is cast (the plan's 9): Grandmaster Pho (`pho`) and Ton (`e4ton`), each a declared reuse in
         the episode (reuseInEpisode); Jun, Mr Koh, the collector, the nine, the Naga; the things of the home and the room */
    ],
    /* FRESH (chaptertest): what this chapter takes from the chapters before it, declared (Chad, v17.4) */
    reuse: {},
    reuseInEpisode: { w4angsana: "chapter 4's angsana trees, on the estate's lawn five storeys below the walkway", w4foxpalm: "chapter 4's foxtail palms, round the estate's pool" },
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
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, cnv, loadImageTexture,
            assetBytes, rescueTextures, getState, startDecision, worldSfx, warmSounds, soundOff, unifySkeletons,
            makeHellNote, HEAD_RE } = ctx;

    /* (the v21.1 TDZ law: everything a builder or a frame asks for is declared up here, before anything is built) */
    const owned = [];
    let alive = true;
    const parsedGlb = new Map();
    let parsePend = 0;                                   // (R51: models being unpacked now: stage.ready waits for none)
    const madeTex = [];
    const tex = (t) => { madeTex.push(t); return t; };
    const noteTex = tex(makeHellNote());                  // the contract wants one (the engine's note prop reads it at boot)
    const mats = [];
    const M = (o) => { const m = new THREE.MeshStandardMaterial(o); mats.push(m); return m; };
    const B = (o) => { const m = new THREE.MeshBasicMaterial(o); mats.push(m); return m; };   // unlit: a glow, a painted layer
    /* ONE PASS FOR A FLAT CARD (v26.11, the speed-ups' first: no memory made and thrown away each frame). three draws a
       see-through two-sided material in two passes, its back faces and then its front faces, and looks its program up
       again before each (renderObject sets material.needsUpdate both times: two look-ups a card a frame, each a
       hundred-field object built and thrown away, and a draw that paints nothing). A card that is ONE FLAT FACE is wholly
       front or wholly back to any eye, so of the two passes one draws nothing and the other draws every triangle in the
       geometry's own order; one pass (forceSinglePass) draws the same triangles in the same order, and an unlit material
       that reads no normal (MeshBasicMaterial with no envMap) shades them the same. Only such cards are given it, where
       they are made (the sun's rays, the taper's flame, the place to kneel), and each is checked when the world is built
       (onePassCheck): a material given it whose every user is not one flat plain card is drawn as three draws it, and the
       console says so. `?opt=onePass:0` draws all of them as three does: the proof compares the two pixel for pixel. */
    const ONEPASS = !ctx.opt || ctx.opt('onePass');
    /* NO LIST MADE AND THROWN AWAY EACH FRAME (v26.11): where a frame made a new list or a new turn to hold numbers it had
       (a hand's resting finger turns, two lists joined to walk them), it keeps one and fills it again: the same numbers
       copied into it in the same order, so every turn laid after it is the same to the bit. `?opt=noGarbage:0` makes
       them anew as before (the proof compares every bone of every body, the two ways) */
    let NOGARB = !ctx.opt || ctx.opt('noGarbage');                   // (a probe turns it over in one page: stage.garb)
    /* A BONE'S ANGLES WORKED OUT WHEN THEY ARE READ (v26.11, the speed-ups' second: the bones' arithmetic without the
       machinery's overhead). three keeps every object's turn twice, as a quaternion and as three angles, and each time the
       quaternion changes it works the angles out again at once (Object3D's onQuaternionChange: a rotation matrix and an
       arcsine and two arctangents). A body's bones turn thousands of times a frame (every take writes each one, every pose
       laid after it turns it again) and nothing ever reads their angles: the matrices are made from the quaternion. So a
       bone's quaternion only marks its angles stale, and they are worked out, by three's own setFromQuaternion on the same
       quaternion, the moment anything reads or writes any of them: every read gives the very numbers the old way held, and
       a write to one angle finds the others as the old way had them. Proved by every angle read both ways after the same
       turns (stage.lazyProof) and every bone compared. `?opt=lazyRot:0` leaves three's way */
    const LAZYROT = !ctx.opt || ctx.opt('lazyRot');
    const FASTTWINS = !ctx.opt || ctx.opt('fastTwins');               // (the seams' twins found by whole-number cells: twinsFast)
    const FASTSKIN = !ctx.opt || ctx.opt('fastSkin');                 // (a posed vertex with each bone's matrix made once a pose: skinVertex)
    const SHEETONCE = !ctx.opt || ctx.opt('sheetOnce');               // (a body's sheet set up once, never uploaded again for nothing: c_cast.js sheetOf)
    const KEEPSHARED = !ctx.opt || ctx.opt('keepShared');             // (a film's full body gives back only what no other body draws: c_cast.js fullOff)
    function lazyRot(o) { if (LAZYROT) lazyInstall(o); }
    const LAZY = new WeakSet();
    function lazyInstall(o) {
      const q = o.quaternion, e = o.rotation;
      if (!q || !e || LAZY.has(e)) return;
      let dirty = false, x = e._x, y = e._y, z = e._z, order = e._order;
      const sync = () => { dirty = false; e.setFromQuaternion(q, undefined, false); };
      Object.defineProperty(e, '_x', { get() { if (dirty) sync(); return x; }, set(v) { if (dirty) sync(); x = v; }, configurable: true });
      Object.defineProperty(e, '_y', { get() { if (dirty) sync(); return y; }, set(v) { if (dirty) sync(); y = v; }, configurable: true });
      Object.defineProperty(e, '_z', { get() { if (dirty) sync(); return z; }, set(v) { if (dirty) sync(); z = v; }, configurable: true });
      Object.defineProperty(e, '_order', { get() { if (dirty) sync(); return order; }, set(v) { if (dirty) sync(); order = v; }, configurable: true });
      LAZY.add(e);
      q._onChange(() => { dirty = true; });
    }
    /* (a probe's: the angles back to three's own way on this object, the numbers as they stand) */
    function lazyUninstall(o) {
      const q = o.quaternion, e = o.rotation;
      if (!q || !e || !LAZY.has(e)) return;
      const x = e._x, y = e._y, z = e._z, order = e._order;
      delete e._x; delete e._y; delete e._z; delete e._order;
      e._x = x; e._y = y; e._z = z; e._order = order;
      LAZY.delete(e);
      q._onChange(() => { e.setFromQuaternion(q, undefined, false); });
    }
    /* (the proof, for a probe: pairs of objects, one turned the old way and one the new, put through the same long string
       of turns and reads, every read and every quaternion compared bit for bit; then every bone of every body read
       against its angles worked out afresh from its quaternion. Answers the count of numbers compared and of those
       that differed) */
    function lazyProof(seed = 1, steps = 4000) {
      let r = seed >>> 0; const rnd = () => ((r = (r * 1664525 + 1013904223) >>> 0) / 4294967296);
      const same = (a, b) => Object.is(a, b);
      let n = 0, bad = 0; const chk = (a, b) => { n++; if (!same(a, b)) bad++; };
      const A = [], Bq = [];
      for (let i = 0; i < 6; i++) { const a = new THREE.Object3D(), b = new THREE.Object3D(); lazyInstall(b); A.push(a); Bq.push(b); }
      const tq = new THREE.Quaternion(), te = new THREE.Euler(), ax = new THREE.Vector3(), arr = [0, 0, 0, 0], orders = ['XYZ', 'YXZ', 'ZXY', 'ZYX', 'YZX', 'XZY'];
      for (let k = 0; k < steps; k++) {
        const i = Math.floor(rnd() * A.length), a = A[i], b = Bq[i], op = Math.floor(rnd() * 12);
        const v = [rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1], ang = (rnd() * 2 - 1) * 3.2;
        tq.set(v[0], v[1], v[2], v[3]).normalize();
        for (const o of [a, b]) {
          if (op === 0) o.quaternion.copy(tq);
          else if (op === 1) o.quaternion.slerp(tq, 0.37);
          else if (op === 2) o.quaternion.premultiply(tq);
          else if (op === 3) { arr[0] = tq.x; arr[1] = tq.y; arr[2] = tq.z; arr[3] = tq.w; o.quaternion.fromArray(arr); }
          else if (op === 4) o.rotation.x = ang;
          else if (op === 5) o.rotation.y = ang;
          else if (op === 6) o.rotation.set(ang, -ang * 0.5, ang * 0.25, orders[k % 6]);
          else if (op === 7) o.rotation.reorder(orders[(k + 3) % 6]);
          else if (op === 8) o.quaternion.setFromAxisAngle(ax.set(v[0], v[1], v[2]).normalize(), ang);
          else if (op === 9) o.rotateY(ang);
          else if (op === 10) o.quaternion.invert();
          else o.lookAt(v[0] * 5, v[1] * 5, v[2] * 5);
        }
        if (rnd() < 0.5) { chk(a.rotation.x, b.rotation.x); chk(a.rotation.y, b.rotation.y); chk(a.rotation.z, b.rotation.z); chk(a.rotation.order, b.rotation.order); }
        chk(a.quaternion.x, b.quaternion.x); chk(a.quaternion.y, b.quaternion.y); chk(a.quaternion.z, b.quaternion.z); chk(a.quaternion.w, b.quaternion.w);
      }
      for (let i = 0; i < A.length; i++) { const a = A[i], b = Bq[i]; const ea = a.rotation.toArray(), eb = b.rotation.toArray(); for (let j = 0; j < 4; j++) chk(ea[j], eb[j]);
        a.updateMatrix(); b.updateMatrix(); for (let j = 0; j < 16; j++) chk(a.matrix.elements[j], b.matrix.elements[j]); }
      let bones = 0, boneBad = 0;
      world.traverse(o => { if (!o.isBone || !LAZY.has(o.rotation)) return; bones++; te.setFromQuaternion(o.quaternion, o.rotation.order, false);
        if (!same(te.x, o.rotation.x) || !same(te.y, o.rotation.y) || !same(te.z, o.rotation.z)) boneBad++; });
      return { compared: n, differed: bad, lazyBones: bones, bonesDiffering: boneBad };
    }
    function flatCard(g) {
      const p = g && g.attributes && g.attributes.position; if (!p || (g.morphAttributes && g.morphAttributes.position)) return false;
      const ix = g.index ? g.index.array : null, n = ix ? ix.length : p.count;
      let have = false, nx = 0, ny = 0, nz = 0, ax = 0, ay = 0, az = 0, off = 0, size = 0;
      for (let t = 0; t + 2 < n; t += 3) {
        const a = ix ? ix[t] : t, b = ix ? ix[t + 1] : t + 1, c = ix ? ix[t + 2] : t + 2;
        const Ax = p.getX(a), Ay = p.getY(a), Az = p.getZ(a), ux = p.getX(b) - Ax, uy = p.getY(b) - Ay, uz = p.getZ(b) - Az, wx = p.getX(c) - Ax, wy = p.getY(c) - Ay, wz = p.getZ(c) - Az;
        const cx = uy * wz - uz * wy, cy = uz * wx - ux * wz, cz = ux * wy - uy * wx, L = Math.hypot(cx, cy, cz);
        if (!(L > 1e-12)) continue;
        if (!have) { nx = cx / L; ny = cy / L; nz = cz / L; ax = Ax; ay = Ay; az = Az; have = true; }
        if ((cx * nx + cy * ny + cz * nz) / L < 0.999999) return false;                    // (a triangle facing another way)
        for (let k = 0; k < 3; k++) { const X = Ax + (k === 1 ? ux : k === 2 ? wx : 0), Y = Ay + (k === 1 ? uy : k === 2 ? wy : 0), Z = Az + (k === 1 ? uz : k === 2 ? wz : 0);
          off = Math.max(off, Math.abs((X - ax) * nx + (Y - ay) * ny + (Z - az) * nz)); size = Math.max(size, Math.hypot(X - ax, Y - ay, Z - az)); }
      }
      return have && off <= 1e-6 * Math.max(size, 1e-6);
    }
    function onePassCheck() {
      const users = new Map();
      world.traverse(o => { if (!o.material) return; for (const m of [].concat(o.material)) if (m && m.forceSinglePass) { if (!users.has(m)) users.set(m, []); users.get(m).push(o); } });
      for (const [m, os] of users) {
        const bad = !m.isMeshBasicMaterial || !!m.envMap ? m.type : (os.find(o => !o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || o.isBatchedMesh || !flatCard(o.geometry)) || null);
        if (!bad) continue;
        m.forceSinglePass = false;
        console.warn('onePass: a material given one pass is drawn in two (' + (typeof bad === 'string' ? bad : (bad.name || bad.type) + ' is not one flat plain card') + ')');
      }
      return users.size;
    }
    const wallNow = () => performance.now() / 1000;
    const have = (key) => DATA.assets.includes(key);      // a thing is asked for only once its file is in the build
    const waiting = new Set();                            // the keys the world names that have not landed yet (stage.info)
    const c01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v), smo = (k) => k * k * (3 - 2 * k), sgk = (t, a, b) => c01((t - a) / (b - a));
    const lp = (a, b, k) => a + (b - a) * k, lp3 = (a, b, k) => [lp(a[0], b[0], k), lp(a[1], b[1], k), lp(a[2], b[2], k)];
    const angTo = (a, b) => Math.atan2(Math.sin(b - a), Math.cos(b - a));
    const isNarrow = () => camera.aspect < 1;
    const TOUCHY = !!((window.matchMedia && matchMedia('(pointer: coarse)').matches) || 'ontouchstart' in window);   // (the engine's HAS_TOUCH: which words a brief gives)

    /* ================================================================ THE WORLD (the tracker's M6; the plan's 8.1, 8.2, 9.4)
       docs/V28.0-WORLD.md has every number below written out with its reason. Units metres, y up. THE ORIGIN is the middle
       of the lift's doors on the walkway's floor, where the opening film puts him down: the walkway runs from there along
       -z (a turn of 0 looks down it), turns to -x at its end, and reaches Mr Koh's gate; his court runs from the gate along
       +z to his front doors; his living and dining room is behind them. Case three's room is a pocket world 240 m along
       +z, past the lens's far plane (160 m) from everything of the home, so neither is ever drawn from the other (v8.9).
       Every thing in it is a real model made for this chapter (masters/v28.0/props/RECORD.md), placed by its own size;
       what is painted here is only what a builder pours or paints (floors, walls, slabs, glass, the estate's faces). No
       lamp is added on screen (v15.1): the lamps' light is painted. */
    const WALK = { x0: -0.95, x1: 0.95, z0: -15.9, z1: 1.2, turnZ: -14.0, endX: -12.3, soffit: 2.75, slab: 0.20, edge: 1.0 };
    /* the walkway is a block's third storey (a storey 2.95 m): the estate's ground 5.9 m below its floor */
    const STOREY = 2.95, GROUND_Y = -2 * STOREY;
    /* HIS COURT (the plan's 8.1: 5.2 m by 8.4 m, open to the sky; the fight's ground, its 5.6) */
    const COURT = { x0: -11.1, x1: -5.9, z0: -14.0, z1: -5.6, wallTop: 3.0 * STOREY };
    const GATE = { x: -8.5, w: 1.248, h: 1.40, post: 0.417, frontH: 1.5 };
    /* HIS HOUSE: the front wall on the court's far side; the L-shaped living and dining room behind it (7.2 m across) */
    const HOUSE = { face: -5.6, ceil: 2.70, wall: 0.12 };
    const LIVING = { x0: -12.3, x1: -5.1, z0: -5.5, z1: -1.6 };
    const DINING = { x0: -12.3, x1: -8.5, z0: -1.6, z1: 1.6 };
    const DOOR_FRONT = { x0: -8.9, x1: -8.1, h: 2.10 };
    const WIN_A = { x0: -10.95, x1: -10.0, sill: 0.85, head: 2.10 };    // the front windows on the court, either side of the door
    const WIN_B = { x0: -7.0, x1: -6.05, sill: 0.85, head: 2.10 };      // (narrow, so the shoe cabinet stands between WIN_A and the door)
    const TERRACE = { z0: -4.7, z1: -2.6, h: 2.15, out: -13.8 };         // the terrace doors in the living room's west wall
    /* CASE THREE'S ROOM (the plan's 8.2): about 4 m by 5 m, upstairs, in daylight */
    const ROOM = { x0: -2.0, x1: 2.0, z0: 237.5, z1: 242.5, ceil: 2.80, cx: 0, cz: 240.0 };
    const LIFT = { x0: -0.8, x1: 0.8, z0: 1.35, z1: 2.85, h: 2.35, door: 0.45 };
    const EYE = 1.62;

    const world = new THREE.Group(); world.name = 'e4c5'; scene.add(world);
    const solids = [];
    const matProxy = M({ color: 0x8d7a66, roughness: 0.9 });
    /* a thing he cannot walk through: a box, never drawn (collision is a column from the floor: v5.03) */
    const solidBox = (w, h, d, x, y, z, ry = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matProxy);
      m.position.set(x, y, z); m.rotation.y = ry; m.visible = false; world.add(m); solids.push(m); return m;
    };
    /* a solid by its two corners on the floor */
    const solidXZ = (x0, z0, x1, z1, h = 2.2) => solidBox(Math.abs(x1 - x0), h, Math.abs(z1 - z0), (x0 + x1) / 2, h / 2, (z0 + z1) / 2);

    /* ------------------------------------------------- one parse per asset, many of one, a model stood (chapter 3's own,
       as chapter 4 copied them), and the merged pieces of what never moves */
    function parseOnce(key) {
      if (!parsedGlb.has(key)) {
        parsedGlb.set(key, assetBytes(key).then(BUF => new Promise((res, rej) =>
          new GLTFLoader().parse(BUF, '', (gltf) => {
            rescueTextures(gltf, BUF);
            if (unifySkeletons) unifySkeletons(gltf.scene);
            mendTwins(key, gltf.scene);
            res({ scene: gltf.scene, animations: gltf.animations });
          }, rej))));
      }
      const pr = parsedGlb.get(key); parsePend++;
      pr.then(() => setTimeout(() => { parsePend--; }, 0), () => { parsePend--; });
      return pr;
    }
    /* (v24.17) Chad's Nang Kwak is bronze, about 0.8 metal by its own metal-roughness sheet, and a metal shows only what
       it reflects: under the scene's environment at 0.05 she drew as a black silhouette on the tray and the altar
       (photographed), where the bag's own view shows her warm bronze. The pickup's lift (v24.16), held to her metal: the
       material is shared by her two copies, so both read as the same piece */
    /* (v24.29) THE LIFT IS DRAWN NOW (tools/patchthree.mjs: three ignored a material's envMapIntensity under the scene's
       environment, so the 10 written here never reached a pixel and she stayed the black silhouette above). Drawn as
       written, 10 x 0.05 = 0.5 of the room washed the shop's bronze and gold to pale silver; photographed on a phone at
       0.05 / 0.08 / 0.12 / 0.18 / 0.25 the images read bronze-gold at 0.12-0.18 and pale from 0.25 — episode 3's own
       bracket for its Buddha images (BUDDHA_ENV 0.15) — so a piece takes 3 (0.15). A vehicle's paint and chrome take k 2
       (0.1: silver reads silver and red red, where 0.18 up washed the sedan white) */
    function bronzeLift(o, k = 3) { for (const mt of [].concat(o.material)) if (mt && mt.metalnessMap && 'envMapIntensity' in mt) mt.envMapIntensity = k; }
    /* (v24.22) MANY OF ONE MODEL: a real model stood at many places as InstancedMeshes — one per mesh of the file, the
       file's own node transform folded into every instance — so a shop full of stock costs a draw a kind a place, never a
       draw a piece. `list`: [{ x, y, z, ry, rx, rz, s }] in `parent`'s frame, turned ry about y, then rx about its own x
       (a lean back, a lying down), then rz about its own z. Its gold, bronze and copper are metal and show only what they
       reflect: the pickup's lift (bronzeLift). The instances are `owned`, so dispose frees their buffers */
    const _mq = new THREE.Quaternion(), _me = new THREE.Euler(0, 0, 0, 'YXZ'), _mp = new THREE.Vector3(), _ms = new THREE.Vector3(), _mm = new THREE.Matrix4();
    /* (v24.22) NEAR AND FAR. A stock file carries its piece twice: `<key>_near` as it was made, `<key>_far` a light level
       of the same surface (a cased piece's front baked onto its own geometry, tools/planarfar.mjs; a statue cut by
       tools/lodpair.mjs). Each place stands both and draws the near level only while its nearest piece would fill more
       than STOCK_NEAR of the frame's height (`stockLod`, every frame World S is shown): measured on the first build, the
       phone's widest look into the shop drew 406k triangles, three quarters of them pieces a few pixels tall at their
       full 2–12k. A file with no levels stands as it is, always */
    const stockLods = [], STOCK_NEAR = 0.04;
    /* (v24.36) `done`, if given, is handed every InstancedMesh made, once they stand (the samnak's cabinets shake theirs
       with the room and put their stand-ins away); without it, as before */
    function manyOf(key, list, parent, size = 0.06, done = null) {
      if (!list.length) return;
      parseOnce(key).then(({ scene: src }) => {
        if (!alive) return;
        src.updateMatrixWorld(true);
        const lv = { near: [], far: [] }, made = [];
        src.traverse(o => {
          if (!o.isMesh) return;
          const mat = o.material.clone(); mats.push(mat); bronzeLift({ material: mat });
          const im = new THREE.InstancedMesh(o.geometry, mat, list.length);
          list.forEach((it, i) => {
            _me.set(it.rx || 0, it.ry || 0, it.rz || 0, 'YXZ'); _mq.setFromEuler(_me);
            _mm.compose(_mp.set(it.x, it.y, it.z), _mq, _ms.setScalar(it.s || 1)).multiply(o.matrixWorld);
            im.setMatrixAt(i, _mm);
          });
          im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere();
          im.castShadow = false; im.receiveShadow = true; im.name = 'stock:' + key;
          parent.add(im); owned.push(im); made.push(im);
          if (/_far$/.test(o.name)) lv.far.push(im); else if (/_near$/.test(o.name)) lv.near.push(im);
        });
        if (lv.near.length && lv.far.length) {
          /* the place's sphere in the world: the middle of its pieces and the farthest of them from it; and the size of
             its pieces on the shelf (the file's own height times their largest scale) */
          const c = new THREE.Vector3(); for (const it of list) c.add(_mp.set(it.x, it.y, it.z)); c.divideScalar(list.length);
          let r = 0; for (const it of list) r = Math.max(r, c.distanceTo(_mp.set(it.x, it.y, it.z)));
          parent.updateMatrixWorld(true); parent.localToWorld(c);
          const sMax = list.reduce((a, it) => Math.max(a, it.s || 1), 0);
          for (const im of lv.near) im.visible = false;                  // the far level until the first frame asks
          stockLods.push({ near: lv.near, far: lv.far, c, r: r + 0.05, size: size * sMax, on: false });
        }
        if (done) done(made);
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
    }
    const _sl = new THREE.Vector3();
    function stockLod() {
      if (!stockLods.length) return;
      camera.getWorldPosition(_sl);
      const span = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      for (const L of stockLods) {
        const d = Math.max(0.05, _sl.distanceTo(L.c) - L.r), on = L.size / (d * span) > STOCK_NEAR;
        if (on === L.on) continue;
        L.on = on;
        for (const im of L.near) im.visible = on;
        for (const im of L.far) im.visible = !on;
      }
    }
    /* A SEAM'S TWINS MOVE AS ONE (v24.5, found by the photographs of Pong's head: a hair-thin dark line ran across the
       room's floor from behind his arm to the far wall). One vertex of his trousers, at his right hip, is weighted wholly
       to his LEFT KNEE while its two twins at the same place (a seam's copies) follow his hips — sat cross-legged, his
       knee carries it a metre off and three triangles of a 2 cm cap stretch into a needle across the floor. Twins at one
       place must deform as one: a vertex whose twins agree on a bone it carries no weight on at all takes their weights.
       Once a file, on the parse every clone shares; how many each file needed is kept (`stage.mends`) */
    const twinMends = {};
    function mendTwins(key, root) {
      let n = 0;
      root.traverse(m => {
        if (!m.isSkinnedMesh) return;
        const g = m.geometry, pa = g.attributes.position, si = g.attributes.skinIndex, sw = g.attributes.skinWeight;
        if (!pa || !si || !sw) return;
        let mine = 0;
        g.computeBoundingBox(); const bb = g.boundingBox;
        const tol = 1.5e-3 * Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y, bb.max.z - bb.min.z);   // ~2.5 mm on a body
        const bones = m.skeleton ? m.skeleton.bones : [], near = (a, b2) => { const A = bones[a], B = bones[b2];
          return !A || !B || A === B || A.parent === B || B.parent === A; };   // a joint's own boundary is never mended
        if (!(tol > 0)) return;
        const fast = FASTTWINS ? twinsFast(pa, si, sw, tol, near) : -1;
        if (fast >= 0) { n += fast; mine += fast; }
        else {
          const cell = (v) => Math.floor(v / tol), cells = new Map(), K = (a, b2, c) => a + ',' + b2 + ',' + c;
          for (let i = 0; i < pa.count; i++) {
            const k = K(cell(pa.getX(i)), cell(pa.getY(i)), cell(pa.getZ(i)));
            let c = cells.get(k); if (!c) cells.set(k, c = []); c.push(i);
          }
          const dom = (i) => { let k = 0; for (let q = 1; q < 4; q++) if (sw.getComponent(i, q) > sw.getComponent(i, k)) k = q; return si.getComponent(i, k); };
          const weightOn = (i, bone) => { let w = 0; for (let q = 0; q < 4; q++) if (si.getComponent(i, q) === bone) w += sw.getComponent(i, q); return w; };
          for (let i = 0; i < pa.count; i++) {
            const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i), cx = cell(x), cy = cell(y), cz = cell(z), tw = [];
            for (let a = -1; a <= 1; a++) for (let b2 = -1; b2 <= 1; b2++) for (let c = -1; c <= 1; c++) {
              const l = cells.get(K(cx + a, cy + b2, cz + c)); if (!l) continue;
              for (const j of l) if (j !== i && Math.hypot(pa.getX(j) - x, pa.getY(j) - y, pa.getZ(j) - z) <= tol) tw.push(j);
            }
            if (tw.length < 2) continue;
            const d0 = dom(tw[0]);
            if (!tw.every(j => dom(j) === d0) || weightOn(i, d0) > 0 || near(dom(i), d0)) continue;
            for (let q = 0; q < 4; q++) { si.setComponent(i, q, si.getComponent(tw[0], q)); sw.setComponent(i, q, sw.getComponent(tw[0], q)); }
            n++; mine++;
          }
        }
        if (mine) { si.needsUpdate = true; sw.needsUpdate = true; }
      });
      if (n) twinMends[key] = n;
    }

    /* (v26.11, FASTTWINS: the speed-ups' third, the load's own work. The search above built a text key for every vertex and
       twenty-seven more for its neighbours' cells, on every vertex of every body file: 31 of the 96 seconds this box took
       to reach play. Here the same cells, of the same Math.floor(v / tol), are keyed by one exact whole number (the three
       cell numbers in mixed radix over the file's own range of cells, -0 the same as 0 as the text was), each cell's list
       in the vertices' own order, the neighbours visited in the same order, each position read once (the same doubles
       getX gives), the same distance test: so every vertex finds the same twins in the same order and is mended with the
       same weights. A file with a coordinate that is not a finite number takes the search above. `?opt=fastTwins:0`
       takes it always; the proof hashes every mended skin both ways (stage.twinHash)) */
    function twinsFast(pa, si, sw, tol, near) {
      const N = pa.count, X = new Float64Array(N), Y = new Float64Array(N), Z = new Float64Array(N), C = new Float64Array(3 * N);
      let x0 = Infinity, y0 = Infinity, z0 = Infinity, x1 = -Infinity, y1 = -Infinity, z1 = -Infinity;
      for (let i = 0; i < N; i++) {
        const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i);
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) return -1;
        X[i] = x; Y[i] = y; Z[i] = z;
        const cx = Math.floor(x / tol), cy = Math.floor(y / tol), cz = Math.floor(z / tol);
        C[3 * i] = cx; C[3 * i + 1] = cy; C[3 * i + 2] = cz;
        if (cx < x0) x0 = cx; if (cx > x1) x1 = cx; if (cy < y0) y0 = cy; if (cy > y1) y1 = cy; if (cz < z0) z0 = cz; if (cz > z1) z1 = cz;
      }
      if (!(N > 0)) return 0;
      const sy = y1 - y0 + 3, sz = z1 - z0 + 3;
      if (!((x1 - x0 + 3) * sy * sz < 4503599627370496)) return -1;          // (2^52: every key an exact whole number)
      const key = (a, b2, c) => ((a - x0 + 1) * sy + (b2 - y0 + 1)) * sz + (c - z0 + 1);
      const cells = new Map();
      for (let i = 0; i < N; i++) { const k = key(C[3 * i], C[3 * i + 1], C[3 * i + 2]); let c = cells.get(k); if (!c) cells.set(k, c = []); c.push(i); }
      const dom = (i) => { let k = 0; for (let q = 1; q < 4; q++) if (sw.getComponent(i, q) > sw.getComponent(i, k)) k = q; return si.getComponent(i, k); };
      const weightOn = (i, bone) => { let w = 0; for (let q = 0; q < 4; q++) if (si.getComponent(i, q) === bone) w += sw.getComponent(i, q); return w; };
      /* (a neighbour's key is the vertex's own plus a fixed whole number, in the old order: a, then b2, then c, each -1 to
         1; and the distance test is decided by the squares where they are clear of tol by a millionth of a millionth,
         Math.hypot only in between, so every decision is Math.hypot's own) */
      const syz = sy * sz, OFF = [], t2 = tol * tol, t2lo = t2 * (1 - 1e-9), t2hi = t2 * (1 + 1e-9);
      for (let a = -1; a <= 1; a++) for (let b2 = -1; b2 <= 1; b2++) for (let c = -1; c <= 1; c++) OFF.push(a * syz + b2 * sz + c);
      let mine = 0; const tw = [];
      for (let i = 0; i < N; i++) {
        const x = X[i], y = Y[i], z = Z[i], kc = key(C[3 * i], C[3 * i + 1], C[3 * i + 2]); tw.length = 0;
        for (let o = 0; o < 27; o++) {
          const l = cells.get(kc + OFF[o]); if (!l) continue;
          for (const j of l) { if (j === i) continue; const dx = X[j] - x, dy = Y[j] - y, dz = Z[j] - z, q = dx * dx + dy * dy + dz * dz;
            if (q > t2hi) continue; if (q < t2lo || Math.hypot(dx, dy, dz) <= tol) tw.push(j); }
        }
        if (tw.length < 2) continue;
        const d0 = dom(tw[0]);
        if (!tw.every(j => dom(j) === d0) || weightOn(i, d0) > 0 || near(dom(i), d0)) continue;
        for (let q = 0; q < 4; q++) { si.setComponent(i, q, si.getComponent(tw[0], q)); sw.setComponent(i, q, sw.getComponent(tw[0], q)); }
        mine++;
      }
      return mine;
    }

    /* ------------------------------------------------- the flat's surfaces (none from a picture yet: every one is
       painted below; the table stays so the copied loaders read their own) */
    const SURF = {};
    const surfTex = new Map();
    function surfLoad(name) {
      if (!surfTex.has(name)) {
        const key = 'w4t_' + name;
        if (!have(key)) { waiting.add(key); surfTex.set(name, Promise.resolve(null)); }
        else surfTex.set(name, loadImageTexture(key, SURF[name][1]).then(t => { if (t && alive) madeTex.push(t); return alive ? t : null; }).catch(() => null));
      }
      return surfTex.get(name);
    }
    /* a material of a surface. o: tile [u, v] metres (or one number), mirror 'u' | 'v' | 'uv', clamp (one picture, laid
       once: its piece is drawn with tile = its own size), tint, basic (unlit), cut (its holes cut out), and whatever else
       a material takes */
    function surf(name, o = {}) {
      const { tile = 1, mirror = '', tint = null, gain = null, basic = false, cut = false, clampV = false, clamp = false, ...rest } = o;
      const lift = (c) => { if (gain != null) { const k = Array.isArray(gain) ? gain : [gain, gain, gain]; c.r *= k[0]; c.g *= k[1]; c.b *= k[2]; } return c; };
      const avg = lift(new THREE.Color(SURF[name][0])); if (tint != null) avg.multiply(new THREE.Color(tint));
      const base = { color: avg, ...rest };
      if (!basic) { if (base.roughness == null) base.roughness = 0.9; if (base.metalness == null) base.metalness = 0; }
      if (cut) { base.alphaTest = 0.5; base.side = THREE.DoubleSide; }
      const m = basic ? B(base) : M(base);
      surfLoad(name).then(t0 => {
        if (!t0 || !alive) return;
        const t = t0.clone(); t.needsUpdate = true; madeTex.push(t);
        const tu = Array.isArray(tile) ? tile[0] : tile, tv = Array.isArray(tile) ? tile[1] : tile;
        t.wrapS = clamp ? THREE.ClampToEdgeWrapping : /u/.test(mirror) ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping;
        t.wrapT = clamp || clampV ? THREE.ClampToEdgeWrapping : /v/.test(mirror) ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping;
        t.repeat.set(1 / tu, -1 / tv); t.offset.set(0, 1);
        m.map = t; lift(m.color.set(tint != null ? tint : 0xffffff)); m.needsUpdate = true;
      });
      return m;
    }
    /* a surface's picture with its own holes and ONE flat colour (a fretwork painted pale grey: the cut-out is the
       picture's, the paint is not). The picture is drawn once onto a canvas and filled through its own alpha */
    function surfFlat(name, css, o = {}) {
      const { tile = 1, clampV = false, clamp = false, ...rest } = o;
      const m = M({ color: css, roughness: 0.85, metalness: 0, alphaTest: 0.5, side: THREE.DoubleSide, ...rest });
      surfLoad(name).then(t0 => {
        if (!t0 || !alive || !t0.image) return;
        const im = t0.image, c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
        const x = c.getContext('2d'); x.drawImage(im, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = '#ffffff'; x.fillRect(0, 0, c.width, c.height);
        const t = tex(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; t.flipY = false;
        const tu = Array.isArray(tile) ? tile[0] : tile, tv = Array.isArray(tile) ? tile[1] : tile;
        t.wrapS = clamp ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping; t.wrapT = clamp || clampV ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
        t.repeat.set(1 / tu, -1 / tv); t.offset.set(0, 1); m.map = t; m.needsUpdate = true;
      });
      return m;
    }

    /* ------------------------------------------------- what never moves is merged, one mesh a material
       quad(): a flat four-cornered piece, a → b its u and a → d its v, both in metres (front: a, b, c, d anticlockwise).
       box(): six of them. geo(): any three geometry, its own UVs scaled. flush() makes the meshes. */
    const batches = new Map();
    const batchOf = (mat) => { let b = batches.get(mat); if (!b) batches.set(mat, b = { mat, p: [], n: [], u: [] }); return b; };
    function quad(mat, a, b, c, d, u0 = 0, v0 = 0) {
      const Bt = batchOf(mat);
      const ax = b[0] - a[0], ay = b[1] - a[1], az = b[2] - a[2], dx = d[0] - a[0], dy = d[1] - a[1], dz = d[2] - a[2];
      const lu = Math.hypot(ax, ay, az), lv = Math.hypot(dx, dy, dz);
      let nx = ay * dz - az * dy, ny = az * dx - ax * dz, nz = ax * dy - ay * dx; const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
      const P = [a, b, c, a, c, d], U = [[u0, v0], [u0 + lu, v0], [u0 + lu, v0 + lv], [u0, v0], [u0 + lu, v0 + lv], [u0, v0 + lv]];
      for (let i = 0; i < 6; i++) { Bt.p.push(P[i][0], P[i][1], P[i][2]); Bt.n.push(nx, ny, nz); Bt.u.push(U[i][0], U[i][1]); }
    }
    /* a triangle (a gable's end), its UVs the wall's own metres from a */
    function tri(mat, a, b, c, u0 = 0, v0 = 0) {
      const Bt = batchOf(mat);
      const ax = b[0] - a[0], ay = b[1] - a[1], az = b[2] - a[2], dx = c[0] - a[0], dy = c[1] - a[1], dz = c[2] - a[2];
      let nx = ay * dz - az * dy, ny = az * dx - ax * dz, nz = ax * dy - ay * dx; const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
      const lu = Math.hypot(ax, az) || Math.hypot(ax, ay, az), hu = Math.hypot(dx, dz);
      const U = [[u0, v0], [u0 + lu, v0 + ay], [u0 + hu, v0 + dy]];
      [a, b, c].forEach((p, i) => { Bt.p.push(p[0], p[1], p[2]); Bt.n.push(nx, ny, nz); Bt.u.push(U[i][0], U[i][1]); });
    }
    /* a flat piece of any number of corners (anticlockwise from its front), its UVs true metres: u along its first edge,
       v up the piece. A hip roof's trapezoid drawn as a quad() would squeeze its tiles toward the hip. */
    function planar(mat, pts, u0 = 0, v0 = 0) {
      const Bt = batchOf(mat), a = pts[0], b = pts[1], c = pts[2];
      const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], ul = Math.hypot(ux, uy, uz) || 1, ex = ux / ul, ey = uy / ul, ez = uz / ul;
      let nx = uy * (c[2] - a[2]) - uz * (c[1] - a[1]), ny = uz * (c[0] - a[0]) - ux * (c[2] - a[2]), nz = ux * (c[1] - a[1]) - uy * (c[0] - a[0]);
      const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
      const vx = ny * ez - nz * ey, vy = nz * ex - nx * ez, vz = nx * ey - ny * ex;
      for (let i = 1; i < pts.length - 1; i++) for (const q of [pts[0], pts[i], pts[i + 1]]) {
        const dx = q[0] - a[0], dy = q[1] - a[1], dz = q[2] - a[2];
        Bt.p.push(q[0], q[1], q[2]); Bt.n.push(nx, ny, nz); Bt.u.push(u0 + dx * ex + dy * ey + dz * ez, v0 + dx * vx + dy * vy + dz * vz);
      }
    }
    const floor = (mat, x0, z0, x1, z1, y = 0) => quad(mat, [x0, y, z1], [x1, y, z1], [x1, y, z0], [x0, y, z0], x0, -z1);
    /* an upright piece from (x0, z0) to (x1, z1): it faces the left of that way (west to east faces south) */
    const wall = (mat, x0, z0, x1, z1, y0, y1, u0 = 0) => quad(mat, [x0, y0, z0], [x1, y0, z1], [x1, y1, z1], [x0, y1, z0], u0, y0);
    function box(mat, cx, cy, cz, w, h, d, ry = 0, top = mat, skipBottom = true) {
      const c = Math.cos(ry), s = Math.sin(ry), hw = w / 2, hh = h / 2, hd = d / 2;
      const P = (lx, ly, lz) => [cx + lx * c + lz * s, cy + ly, cz - lx * s + lz * c];
      const a = P(-hw, -hh, hd), b = P(hw, -hh, hd), e = P(hw, -hh, -hd), f = P(-hw, -hh, -hd);
      const a1 = P(-hw, hh, hd), b1 = P(hw, hh, hd), e1 = P(hw, hh, -hd), f1 = P(-hw, hh, -hd);
      quad(mat, a, b, b1, a1, 0, cy - hh); quad(mat, b, e, e1, b1, 0, cy - hh); quad(mat, e, f, f1, e1, 0, cy - hh); quad(mat, f, a, a1, f1, 0, cy - hh);
      quad(top, a1, b1, e1, f1);
      if (!skipBottom) quad(mat, f, e, b, a);
    }
    const _gm = new THREE.Matrix4(), _gv = new THREE.Vector3(), _gn = new THREE.Matrix3();
    function geo(mat, g0, m4, su = 1, sv = 1) {
      const g = g0.index ? g0.toNonIndexed() : g0, Bt = batchOf(mat);
      const pa = g.attributes.position, na = g.attributes.normal, ua = g.attributes.uv;
      _gn.getNormalMatrix(m4);
      for (let i = 0; i < pa.count; i++) {
        _gv.fromBufferAttribute(pa, i).applyMatrix4(m4); Bt.p.push(_gv.x, _gv.y, _gv.z);
        _gv.fromBufferAttribute(na, i).applyMatrix3(_gn).normalize(); Bt.n.push(_gv.x, _gv.y, _gv.z);
        Bt.u.push(ua ? ua.getX(i) * su : 0, ua ? ua.getY(i) * sv : 0);
      }
      if (g !== g0) g.dispose(); g0.dispose();
    }
    /* an upright round post from the ground (or y0) to y1 */
    function post(mat, x, z, r, y0, y1, sides = 8, r1 = r) {
      geo(mat, new THREE.CylinderGeometry(r1, r, y1 - y0, sides, 1, true), _gm.makeTranslation(x, (y0 + y1) / 2, z), 2 * Math.PI * r, y1 - y0);
    }
    /* a straight round bar between two points */
    const _ba = new THREE.Vector3(), _bb = new THREE.Vector3(), _bq = new THREE.Quaternion(), _bu = new THREE.Vector3(0, 1, 0), _bs = new THREE.Vector3(1, 1, 1);
    function bar(mat, a, b, r, sides = 6) {
      _ba.set(a[0], a[1], a[2]); _bb.set(b[0], b[1], b[2]);
      const len = _ba.distanceTo(_bb); if (len < 1e-4) return;
      _bq.setFromUnitVectors(_bu, _bb.clone().sub(_ba).normalize());
      _gm.compose(_ba.clone().add(_bb).multiplyScalar(0.5), _bq, _bs);
      geo(mat, new THREE.CylinderGeometry(r, r, len, sides, 1, true), _gm, 2 * Math.PI * r, len);
    }
    function flush(parent = world) {
      for (const Bt of batches.values()) {
        if (!Bt.p.length) continue;
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(Bt.p, 3));
        g.setAttribute('normal', new THREE.Float32BufferAttribute(Bt.n, 3));
        g.setAttribute('uv', new THREE.Float32BufferAttribute(Bt.u, 2));
        g.computeBoundingSphere(); g.computeBoundingBox();
        const m = new THREE.Mesh(g, Bt.mat); m.receiveShadow = false; m.castShadow = false; m.matrixAutoUpdate = false; m.updateMatrix();
        parent.add(m); owned.push(m);
      }
      batches.clear();
    }

    /* (a seeded stream, v6.15: every scatter in this chapter is the same scatter on every run. `rng` is at the file's
       foot, beside the drawn surfaces that also use it) */

    /* ------------------------------------------------- a model stood once (a tree, a seat, the parasol)
       Prepped in real metres with its origin on its base's middle (v13.1), so a place is a place; `h` fits one that
       was not (a tree from an earlier chapter) to a height. Answers the group at once; the model lands in it. */
    function stand(key, x, y, z, ry = 0, o = {}) {
      const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; (o.parent || world).add(g);
      if (!have(key)) { waiting.add(key); return g; }
      parseOnce(key).then(({ scene: src }) => {
        if (!alive) return;
        const m = src.clone(true);
        m.traverse(q => { if (q.isMesh) { q.castShadow = false; q.receiveShadow = false; q.material = q.material.clone(); mats.push(q.material); bronzeLift(q, o.lift || 3); } });
        if (o.h) { m.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(m); const k = o.h / Math.max(1e-3, bb.max.y - bb.min.y);
          m.scale.multiplyScalar(k); m.position.y -= bb.min.y * k; m.position.x -= (bb.min.x + bb.max.x) / 2 * k; m.position.z -= (bb.min.z + bb.max.z) / 2 * k; }
        if (o.s) m.scale.multiplyScalar(o.s);
        g.add(m); g.userData.model = m;
        if (o.done) o.done(m, g);
        /* a file of TWO LEVELS (props/lods.sh: nodes <key>_near and <key>_far over the same vertices): the far one is
           drawn until the piece stands taller than a twenty-fifth of the screen (lodTick, the measure many() uses) */
        const near = [], far = []; m.traverse(q => { if (q.isMesh) { if (/_far$/.test(q.name)) far.push(q); else if (/_near$/.test(q.name)) near.push(q); } });
        /* (o.near: a copy that is only ever seen close, in his hands: its full level always, and no place in the world
           for lodTick to measure) */
        if (near.length && far.length && o.near) { for (const q of far) q.visible = false; }
        else if (near.length && far.length) { g.updateWorldMatrix(true, true); const bb = new THREE.Box3().setFromObject(m), c = bb.getCenter(new THREE.Vector3());
          for (const q of near) q.visible = false;
          standLods.push({ near, far, c, r: 0, size: Math.max(0.05, bb.max.y - bb.min.y), on: false, g, moves: !!o.moves }); }
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
      return g;
    }
    /* every two-level thing's level, from the lens: called every frame of play, and by a film on its own clock (a cut
       chooses from the cut's own lens: v24.22). stockLod is many()'s (the copied one); this is stand()'s, the same rule */
    const standLods = [], _sl2 = new THREE.Vector3();
    function lodTick() {
      stockLod();
      if (!standLods.length) return;
      camera.getWorldPosition(_sl2);
      const span = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      for (const L of standLods) { if (L.g && L.moves) L.g.getWorldPosition(L.c).y += L.size / 2;                // (a thing the play carries about is measured where it is now)
        const d = Math.max(0.05, _sl2.distanceTo(L.c)), on = L.size / (d * span) > STOCK_NEAR;
        if (on === L.on) continue; L.on = on;
        for (const q of L.near) q.visible = on; for (const q of L.far) q.visible = !on; }
    }
    /* A HUE TURNED in a material (one soda bottle in red, orange and green; one small candle in pink and blue): the
       picture's own colour is turned about the grey axis before the light falls on it, so whites, blacks and greys
       stay as they are. A program of its own for each angle (compiled under the curtain with the rest: v14.15) */
    function hueTurn(mat, deg) {
      const a = deg * Math.PI / 180, uHue = { value: new THREE.Vector2(Math.cos(a), Math.sin(a)) };
      mat.onBeforeCompile = (sh) => { sh.uniforms.uHue = uHue;
        sh.fragmentShader = 'uniform vec2 uHue;\n' + sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n{ vec3 hk = vec3(0.57735); vec3 hv = diffuseColor.rgb; diffuseColor.rgb = hv * uHue.x + cross(hk, hv) * uHue.y + hk * dot(hk, hv) * (1.0 - uHue.x); }'); };
      mat.customProgramCacheKey = () => 'hueTurn';
      mat.needsUpdate = true;
    }
    /* many of one thing (the copied manyOf), asked for only once its file is in the build */
    function many(key, list, parent = world, size = 0.3, done = null) {
      if (!list.length) return;
      if (!have(key)) { waiting.add(key); return; }
      manyOf(key, list, parent, size, done);
    }


    /* ================================================================ THE SURFACES (painted: each at its real size, so a
       metre of wall is a metre of its picture; the merged pieces' UVs are metres) */
    const rep = (t, tu, tv) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1 / tu, 1 / tv); return t; };
    /* a quad whose picture is laid on it once, whole (a plate, a sign): UVs 0..1 */
    function quadUV(mat, a, b, c, d) { const Bt = batchOf(mat); let nx = (b[1] - a[1]) * (d[2] - a[2]) - (b[2] - a[2]) * (d[1] - a[1]), ny = (b[2] - a[2]) * (d[0] - a[0]) - (b[0] - a[0]) * (d[2] - a[2]), nz = (b[0] - a[0]) * (d[1] - a[1]) - (b[1] - a[1]) * (d[0] - a[0]);
      const nl = Math.hypot(nx, ny, nz) || 1; const P = [a, b, c, a, c, d], U = [[0, 0], [1, 0], [1, 1], [0, 0], [1, 1], [0, 1]];
      for (let i = 0; i < 6; i++) { Bt.p.push(P[i][0], P[i][1], P[i][2]); Bt.n.push(nx / nl, ny / nl, nz / nl); Bt.u.push(U[i][0], U[i][1]); } }
    const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
    const pic = (c, tu, tv, aniso = 8) => { const t = tex(done(THREE, c, true)); rep(t, tu, tv); t.anisotropy = aniso; return t; };
    /* square tiles: `n` a side in the picture, their colour varied a little, their grout */
    function tiles(W, n, base, grout, seed, vary = 0.08, speck = 0) {
      const [c, x] = canvas(W, W), r = rng(seed), T = W / n, [R, G, Bl] = base;
      x.fillStyle = grout; x.fillRect(0, 0, W, W);
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const k = 1 - vary / 2 + r() * vary;
        x.fillStyle = `rgb(${(R * k) | 0},${(G * k) | 0},${(Bl * k) | 0})`; x.fillRect(i * T + 1.5, j * T + 1.5, T - 3, T - 3);
        for (let s = 0; s < speck; s++) { x.fillStyle = r() < 0.5 ? 'rgba(60,55,50,0.22)' : 'rgba(255,255,250,0.22)';
          x.fillRect(i * T + 2 + r() * (T - 4), j * T + 2 + r() * (T - 4), 1 + r() * 1.5, 1 + r() * 1.5); }
      }
      return c;
    }
    /* plaster painted: even, a few soft spots under 1 % (chapter 4's R36 measure: more read as damp) */
    function paint(hex, seed) {
      const [c, x] = canvas(256, 256), r = rng(seed);
      x.fillStyle = hex; x.fillRect(0, 0, 256, 256);
      for (let s = 0; s < 110; s++) { const cx = r() * 256, cy = r() * 256, q = 8 + r() * 26, dark = r() < 0.5;
        const g = x.createRadialGradient(cx, cy, 0, cx, cy, q); g.addColorStop(0, dark ? 'rgba(0,0,0,0.008)' : 'rgba(255,255,255,0.01)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        x.fillStyle = g; x.fillRect(cx - q, cy - q, q * 2, q * 2); }
      return c;
    }
    /* the walkway's floor: 300 mm homogeneous tiles, a warm grey, speckled (a 1980s condominium's common corridor) */
    const mWalkFloor = M({ map: pic(tiles(512, 4, [176, 166, 152], '#6e665c', 28501, 0.07, 500), 1.2, 1.2), roughness: 0.55 });
    /* the walkway's slab over it, its edge and the parapets' faces: the block's paint, a warm white with a grey band */
    const mSoffit = M({ color: 0xd9d4c8, roughness: 0.95 });
    const mFace = M({ map: pic(paint('#e7e1d3', 28502), 1.4, 1.4), roughness: 0.92 });
    const mBand = M({ color: 0x8f8a82, roughness: 0.85 });
    /* the court's paving: 400 mm concrete pavers, grey-beige, a darker path of 300 mm pavers down its middle */
    const mPave = M({ map: pic(tiles(512, 4, [168, 160, 146], '#5a554e', 28503, 0.12, 900), 1.6, 1.6), roughness: 0.9 });
    const mPath = M({ map: pic(tiles(512, 4, [138, 128, 116], '#4c463f', 28504, 0.10, 700), 1.2, 1.2), roughness: 0.85 });
    /* the court's walls: his own and his neighbours', the block's paint */
    const mCourtWall = M({ map: pic(paint('#ddd5c4', 28505), 1.4, 1.4), roughness: 0.93 });
    /* inside: 600 mm polished beige marble-look tiles (the period's), walls a pale warm paint, a plaster ceiling */
    const mFloorIn = (() => { const [c, x] = canvas(512, 512), r = rng(28506);
      x.fillStyle = '#6d6052'; x.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const k = 0.95 + r() * 0.08;
        x.fillStyle = `rgb(${(214 * k) | 0},${(200 * k) | 0},${(178 * k) | 0})`; x.fillRect(i * 256 + 1.5, j * 256 + 1.5, 253, 253);
        for (let v = 0; v < 14; v++) { x.strokeStyle = `rgba(${150 + r() * 40},${130 + r() * 30},${110 + r() * 20},${0.10 + r() * 0.12})`; x.lineWidth = 0.6 + r() * 1.6;
          x.beginPath(); let px = i * 256 + r() * 256, py = j * 256 + r() * 256; x.moveTo(px, py);
          for (let s = 0; s < 6; s++) { px += (r() - 0.3) * 60; py += (r() - 0.5) * 50; x.lineTo(Math.max(i * 256 + 2, Math.min(i * 256 + 254, px)), Math.max(j * 256 + 2, Math.min(j * 256 + 254, py))); }
          x.stroke(); } }
      return M({ map: pic(c, 1.2, 1.2), roughness: 0.32 }); })();
    const mWallIn = M({ map: pic(paint('#e3d9c6', 28507), 1.4, 1.4), roughness: 0.92 });
    const mCeil = M({ color: 0xe8e4da, roughness: 0.95, emissive: 0x262420 });
    const mSkirt = M({ color: 0x5a4636, roughness: 0.6 });
    const mVeneer = (() => { const [c, x] = canvas(128, 256), r = rng(28508);
      x.fillStyle = '#7d5a3e'; x.fillRect(0, 0, 128, 256);
      for (let i = 0; i < 80; i++) { x.strokeStyle = `rgba(${30 + r() * 30},${18 + r() * 14},10,${0.18 + r() * 0.2})`; x.lineWidth = 1 + r() * 2;
        const xx = r() * 128; x.beginPath(); x.moveTo(xx, 0); x.bezierCurveTo(xx + r() * 8 - 4, 80, xx + r() * 8 - 4, 170, xx + r() * 6 - 3, 256); x.stroke(); }
      return M({ map: pic(c, 0.9, 2.1), roughness: 0.55 }); })();
    const mAlu = M({ color: 0xb9bcbd, roughness: 0.4, metalness: 0.5 });
    const mGlass = M({ color: 0x9aa6b4, roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.16, depthWrite: false });
    const mGlassDay = M({ color: 0xcfe0ee, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.18, depthWrite: false });
    /* the lift: brushed steel, its floor a grey rubber, its ceiling a lit panel (painted light) */
    const mSteel = (() => { const [c, x] = canvas(256, 256), r = rng(28509);
      x.fillStyle = '#9da2a6'; x.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '255,255,255' : '40,44,48'},${0.04 + r() * 0.06})`; x.fillRect(0, r() * 256, 256, 1); }
      return M({ map: pic(c, 0.6, 0.6), roughness: 0.4, metalness: 0.15 }); })();
    const mRubber = M({ map: pic(tiles(128, 8, [70, 72, 74], '#3c3e40', 28510, 0.05), 0.4, 0.4), roughness: 0.9 });
    const mLit = B({ color: 0xf6f3ea });
    /* the receiving room: pale grey vinyl planks, white walls, a white ceiling */
    const mRoomFloor = (() => { const [c, x] = canvas(512, 512), r = rng(28511);
      x.fillStyle = '#7a776f'; x.fillRect(0, 0, 512, 512);
      for (let j = 0; j < 8; j++) { let px = -r() * 300; while (px < 512) { const L = 180 + r() * 260, k = 0.93 + r() * 0.1;
        x.fillStyle = `rgb(${(188 * k) | 0},${(182 * k) | 0},${(170 * k) | 0})`; x.fillRect(px + 1, j * 64 + 1, L - 2, 62);
        for (let s = 0; s < 6; s++) { x.strokeStyle = `rgba(120,112,100,${0.08 + r() * 0.08})`; x.beginPath(); const yy = j * 64 + 6 + r() * 52; x.moveTo(px + 2, yy); x.lineTo(px + L - 2, yy + (r() - 0.5) * 4); x.stroke(); }
        px += L; } }
      return M({ map: pic(c, 1.6, 1.6), roughness: 0.6 }); })();
    const mRoomWall = M({ map: pic(paint('#ecebe5', 28512), 1.4, 1.4), roughness: 0.93 });

    /* ---------------------------------------------- walls with their openings (chapter 4's wallX / wallZ: a wall's
       thickness drawn, so an opening shows its reveal; each piece a solid where it stands on walkable floor) */
    function wallX(mat, zc, d, x0, x1, opens = [], y0 = 0, y1 = 2.7, solid = true) {
      const cuts = opens.slice().sort((a, b) => a.x0 - b.x0); let at = x0;
      const piece = (a, b, ya, yb, sol) => { if (b - a < 0.005 || yb - ya < 0.005) return;
        box(mat, (a + b) / 2, (ya + yb) / 2, zc, b - a, yb - ya, d, 0, mat, false);
        if (sol && solid) solidBox(b - a, Math.max(1.2, yb - ya), d, (a + b) / 2, Math.max(0.6, (ya + yb) / 2), zc); };
      for (const o of cuts) { piece(at, o.x0, y0, y1, true); piece(o.x0, o.x1, y0, o.y0, o.y0 > 0.6); piece(o.x0, o.x1, o.y1, y1, false); at = o.x1; }
      piece(at, x1, y0, y1, true);
    }
    function wallZ(mat, xc, d, z0, z1, opens = [], y0 = 0, y1 = 2.7, solid = true) {
      const cuts = opens.slice().sort((a, b) => a.z0 - b.z0); let at = z0;
      const piece = (a, b, ya, yb, sol) => { if (b - a < 0.005 || yb - ya < 0.005) return;
        box(mat, xc, (ya + yb) / 2, (a + b) / 2, d, yb - ya, b - a, 0, mat, false);
        if (sol && solid) solidBox(d, Math.max(1.2, yb - ya), b - a, xc, Math.max(0.6, (ya + yb) / 2), (a + b) / 2); };
      for (const o of cuts) { piece(at, o.z0, y0, y1, true); piece(o.z0, o.z1, y0, o.y0, o.y0 > 0.6); piece(o.z0, o.z1, o.y1, y1, false); at = o.z1; }
      piece(at, z1, y0, y1, true);
    }
    /* a window's aluminium frame and its glass, in a wall along x (z its middle) or along z (x its middle) */
    const glass = [];
    function windowX(o, zc, d, mat = mGlass) {
      const w = o.x1 - o.x0, h = o.head - o.sill, fr = 0.04, xm = (o.x0 + o.x1) / 2;
      box(mAlu, xm, o.sill + fr / 2, zc, w, fr, d * 0.6); box(mAlu, xm, o.head - fr / 2, zc, w, fr, d * 0.6);
      box(mAlu, o.x0 + fr / 2, (o.sill + o.head) / 2, zc, fr, h, d * 0.6); box(mAlu, o.x1 - fr / 2, (o.sill + o.head) / 2, zc, fr, h, d * 0.6);
      box(mAlu, xm, (o.sill + o.head) / 2, zc, 0.035, h, d * 0.5);
      glass.push({ mat, a: [o.x0, o.sill, zc], b: [o.x1, o.sill, zc], c: [o.x1, o.head, zc], d: [o.x0, o.head, zc] });
    }
    function windowZ(o, xc, d, mat = mGlass) {
      const w = o.z1 - o.z0, h = o.head - o.sill, fr = 0.04, zm = (o.z0 + o.z1) / 2;
      box(mAlu, xc, o.sill + fr / 2, zm, d * 0.6, fr, w); box(mAlu, xc, o.head - fr / 2, zm, d * 0.6, fr, w);
      box(mAlu, xc, (o.sill + o.head) / 2, o.z0 + fr / 2, d * 0.6, h, fr); box(mAlu, xc, (o.sill + o.head) / 2, o.z1 - fr / 2, d * 0.6, h, fr);
      box(mAlu, xc, (o.sill + o.head) / 2, zm, d * 0.5, h, 0.035);
      glass.push({ mat, a: [xc, o.sill, o.z1], b: [xc, o.sill, o.z0], c: [xc, o.head, o.z0], d: [xc, o.head, o.z1] });
    }

    /* ================================================================ THE WALKWAY (the plan's 4.1 and 8.1)
       An open walkway along the block's face, 1.9 m wide, covered by the storey above's slab (its soffit 2.75 m), open
       on its outer side over the estate behind a balustrade (w5rail, 2 m sections stretched to fit each run), its lights
       on the soffit every 4 m (w5walklight); along its inner side the other homes' walls and gates. It begins at the lift's
       doors in its end wall, runs 15.2 m along -z, turns to -x and runs 9.5 m to his gate. A drain's grating at its outer
       edge 8.7 m from the lift, where water has stood (the decoy of 4.1). */
    function buildWalkway() {
      const W = WALK, s = W.soffit;
      /* the floor of both runs, to the slab's outer edge (the balustrade stands on it) */
      floor(mWalkFloor, W.x0, W.z0 + 0.0, W.edge, W.z1);
      floor(mWalkFloor, W.endX, W.z0, W.x0, W.turnZ);
      /* the soffit (the storey above's walkway) and the slab's edge outside the balustrade; and the slab's underside seen
         from the estate below */
      const ceilQ = (x0, z0, x1, z1, y) => quad(mSoffit, [x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]);
      ceilQ(W.x0, W.z0, W.edge, W.z1, s); ceilQ(W.endX, W.z0, W.x0, W.turnZ, s);
      box(mFace, W.edge + 0.06, s + 0.1, (W.z0 + W.z1) / 2 - 0.03, 0.12, 0.4, W.z1 - W.z0 + 0.06);           // the slab's edge above, run 1
      box(mFace, (W.endX + W.edge) / 2 + 0.03, s + 0.1, W.z0 - 0.06, W.edge - W.endX + 0.06, 0.4, 0.12);       // and run 2
      box(mBand, W.edge + 0.06, -0.15, (W.z0 + W.z1) / 2 - 0.03, 0.12, 0.3, W.z1 - W.z0 + 0.06);              // this storey's slab edge below
      box(mBand, (W.endX + W.edge) / 2 + 0.03, -0.15, W.z0 - 0.06, W.edge - W.endX + 0.06, 0.3, 0.12);
      /* the walkway's own collision: the balustrade's line and the walkway's ends */
      solidXZ(W.edge - 0.20, W.z0 - 0.3, W.edge + 0.3, W.z1 + 0.2);
      solidXZ(W.endX - 0.3, W.z0 - 0.3, W.edge + 0.3, W.z0 + 0.10);
      /* THE INNER SIDE of run 1 (x -0.95): the neighbours' homes, a wall of the block's paint with one other home's gate
         and its court's low wall (the condominium's pattern: every home behind its own court) */
      wallZ(mFace, W.x0 - 0.1, 0.2, W.turnZ, W.z1, [{ z0: -6.6, z1: -5.35, y0: 0, y1: 1.4 }], 0, s);
      /* (a neighbour's gate, shut: painted iron bars in its opening; its court is not walked) */
      for (let z = -6.55; z < -5.4; z += 0.12) bar(mBand, [W.x0 - 0.1, 0.02, z], [W.x0 - 0.1, 1.38, z], 0.009, 5);
      for (const y of [0.1, 0.7, 1.35]) bar(mBand, [W.x0 - 0.1, y, -6.6], [W.x0 - 0.1, y, -5.35], 0.012, 5);
      solidXZ(W.x0 - 0.2, -6.6, W.x0, -5.35);
      /* (behind it, its court: a strip of its paving and its far wall in shade, so the bars stand against a place) */
      floor(mPave, W.x0 - 2.4, -6.6, W.x0 - 0.2, -5.35, -0.002);
      wallZ(M({ color: 0x9a9284, roughness: 0.95 }), W.x0 - 2.4, 0.1, -6.7, -5.25, [], 0, 2.6, false);
      wallX(mCourtWall, -6.65, 0.1, W.x0 - 2.4, W.x0 - 0.2, [], 0, 2.6, false); wallX(mCourtWall, -5.3, 0.1, W.x0 - 2.4, W.x0 - 0.2, [], 0, 2.6, false);
      /* THE INNER SIDE of run 2 (z -14.0): the corner's wall, the neighbours' court wall, his gate between its posts, his
         court's low front wall, and the end wall */
      wallX(mFace, W.turnZ + 0.1, 0.2, COURT.x1 + 0.1, W.x0 - 0.2, [{ x0: -3.8, x1: -2.55, y0: 0, y1: 1.4 }], 0, s);   // (x0 < x1: the walk test found it missing)
      /* (a second neighbour's gate in it, shut: its bars, and its court's strip behind) */
      for (let x = -3.75; x < -2.6; x += 0.12) bar(mBand, [x, 0.02, W.turnZ + 0.1], [x, 1.38, W.turnZ + 0.1], 0.009, 5);
      for (const y of [0.1, 0.7, 1.35]) bar(mBand, [-3.8, y, W.turnZ + 0.1], [-2.55, y, W.turnZ + 0.1], 0.012, 5);
      solidXZ(-3.8, W.turnZ, -2.55, W.turnZ + 0.2);
      floor(mPave, -3.8, W.turnZ + 0.2, -2.55, W.turnZ + 2.4, -0.002);
      wallX(M({ color: 0x9a9284, roughness: 0.95 }), W.turnZ + 2.4, 0.1, -3.9, -2.45, [], 0, 2.6, false);
      wallZ(mCourtWall, -3.85, 0.1, W.turnZ + 0.2, W.turnZ + 2.4, [], 0, 2.6, false); wallZ(mCourtWall, -2.5, 0.1, W.turnZ + 0.2, W.turnZ + 2.4, [], 0, 2.6, false);
      wallX(mFace, W.turnZ + 0.1, 0.2, W.endX - 0.2, COURT.x0 - 0.1, [], 0, s);
      const gp = GATE.w / 2 + GATE.post / 2 + 0.005;
      const gl = GATE.x - gp - GATE.post / 2, gr = GATE.x + gp + GATE.post / 2;
      wallX(mCourtWall, W.turnZ + 0.1, 0.2, COURT.x0 - 0.1, gl, [], 0, GATE.frontH);
      wallX(mCourtWall, W.turnZ + 0.1, 0.2, gr, COURT.x1 + 0.1, [], 0, GATE.frontH);
      box(mBand, (COURT.x0 + gl) / 2 - 0.05, GATE.frontH + 0.03, W.turnZ + 0.1, gl - COURT.x0 + 0.1, 0.06, 0.26);      // the copings
      box(mBand, (gr + COURT.x1) / 2 + 0.05, GATE.frontH + 0.03, W.turnZ + 0.1, COURT.x1 - gr + 0.1, 0.06, 0.26);
      /* above his court's low wall the walkway is open to the court: the storey above's slab ends at the court's line */
      wallZ(mFace, W.endX - 0.1, 0.2, W.z0, W.turnZ + 0.2, [], 0, s);                                          // the walkway's west end
      /* the end wall at the lift (z 1.2): the lift's doors in it (LIFT.door each side of the middle) */
      wallX(mFace, W.z1 + 0.075, 0.15, W.x0 - 0.2, W.edge + 0.12, [{ x0: -LIFT.door, x1: LIFT.door, y0: 0, y1: 2.1 }], 0, s);
      solidXZ(-LIFT.door, W.z1, LIFT.door, W.z1 + 0.15);                                                         // the doors, shut in play
      /* the lift's hall: its call button and the storey's number over the doors (painted, as a builder's plate is) */
      const plate = (() => { const [c, x] = canvas(256, 128); x.fillStyle = '#9aa0a5'; x.fillRect(0, 0, 256, 128);
        x.fillStyle = '#1e2024'; x.fillRect(84, 14, 88, 100); x.fillStyle = '#d65b2c'; x.font = 'bold 80px Arial, Helvetica, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('3', 128, 66);
        return B({ map: tex(done(THREE, c, false)) }); })();
      quadUV(plate, [0.25, 2.18, W.z1 - 0.002], [-0.25, 2.18, W.z1 - 0.002], [-0.25, 2.43, W.z1 - 0.002], [0.25, 2.43, W.z1 - 0.002]);
      box(mSteel, 0.66, 1.15, W.z1 - 0.01, 0.09, 0.16, 0.02);
      box(B({ color: 0xffe9b0 }), 0.66, 1.17, W.z1 - 0.022, 0.03, 0.03, 0.006);
      /* the storeys below, seen over the balustrade: each a band of parapet and the slab's edge */
      for (let st = 1; st <= 2; st++) { const y = -st * STOREY;
        box(mFace, W.edge + 0.06, y + 0.5, (W.z0 + W.z1) / 2, 0.15, 1.3, W.z1 - W.z0);
        box(mFace, (W.endX + W.edge) / 2, y + 0.5, W.z0 - 0.06, W.edge - W.endX, 1.3, 0.15);
        box(mBand, W.edge + 0.07, y - 0.15, (W.z0 + W.z1) / 2, 0.13, 0.3, W.z1 - W.z0);
        box(mBand, (W.endX + W.edge) / 2, y - 0.15, W.z0 - 0.07, W.edge - W.endX, 0.3, 0.13); }
      /* and the storeys above: their parapets over the slab's edge, to the roof (a six-storey block) */
      for (let st = 1; st <= 3; st++) { const y = st * STOREY;
        box(mFace, W.edge + 0.06, y + 0.5, (W.z0 + W.z1) / 2, 0.15, 1.1, W.z1 - W.z0);
        box(mFace, (W.endX + W.edge) / 2, y + 0.5, W.z0 - 0.06, W.edge - W.endX, 1.1, 0.15);
        box(mBand, W.edge + 0.07, y + 1.1, (W.z0 + W.z1) / 2, 0.16, 0.06, W.z1 - W.z0);
        box(mBand, (W.endX + W.edge) / 2, y + 1.1, W.z0 - 0.07, W.edge - W.endX, 0.06, 0.16);
        if (st < 3) { box(mFace, W.edge + 0.06, y + STOREY - 0.1, (W.z0 + W.z1) / 2, 0.12, 0.4, W.z1 - W.z0);
          box(mFace, (W.endX + W.edge) / 2, y + STOREY - 0.1, W.z0 - 0.06, W.edge - W.endX, 0.4, 0.12); } }
    }

    /* ================================================================ HIS COURT AND HIS HOUSE (the plan's 4.2, 4.3, 8.1) */
    function buildCourt() {
      const C = COURT, H = HOUSE;
      /* the paving, and its path from the gate to the door (300 mm pavers, a shade darker) */
      floor(mPave, C.x0, C.z0, C.x1, C.z1);
      floor(mPath, GATE.x - 0.6, C.z0 + 0.05, GATE.x + 0.6, C.z1 - 0.05, 0.004);
      /* the court's side walls, his and his neighbour's, up to the block's roof: the court is open to the sky */
      wallZ(mCourtWall, C.x0 - 0.1, 0.2, C.z0, H.face, [], 0, C.wallTop);
      wallZ(mCourtWall, C.x1 + 0.1, 0.2, C.z0, H.face, [], 0, C.wallTop);
      /* the storeys over the house: its face continues up from the front wall to the roof, with the upper homes' windows
         (their glass dark, a curtain behind; painted) */
      const upWin = (() => { const [c, x] = canvas(256, 256), r = rng(28520);
        x.fillStyle = '#ddd5c4'; x.fillRect(0, 0, 256, 256);
        x.fillStyle = '#8f8a82'; x.fillRect(0, 232, 256, 24);
        x.fillStyle = '#c9c1b0'; x.fillRect(40, 64, 176, 124);
        x.fillStyle = '#2a2f38'; x.fillRect(46, 70, 164, 112);
        x.fillStyle = r() < 0.5 ? 'rgba(236,196,128,0.55)' : 'rgba(150,170,200,0.25)'; x.fillRect(50, 74, 76, 104);
        x.fillStyle = '#b9bcbd'; x.fillRect(126, 70, 4, 112);
        return B({ map: pic(c, C.x1 - C.x0, STOREY, 4) }); })();
      for (let st = 1; st <= 2; st++) { const y = st * STOREY;
        quad(upWin, [C.x1, y, H.face - 0.21], [C.x0, y, H.face - 0.21], [C.x0, y + STOREY, H.face - 0.21], [C.x1, y + STOREY, H.face - 0.21], 0, y); }
      box(mBand, (C.x0 + C.x1) / 2, STOREY - 0.13, H.face - 0.12, C.x1 - C.x0, 0.26, 0.08);
      /* the roof's coping round the court's top, against the sky */
      box(mBand, C.x0 - 0.1, C.wallTop + 0.1, (C.z0 + H.face) / 2, 0.3, 0.2, H.face - C.z0);
      box(mBand, C.x1 + 0.1, C.wallTop + 0.1, (C.z0 + H.face) / 2, 0.3, 0.2, H.face - C.z0);
      box(mBand, (C.x0 + C.x1) / 2, C.wallTop + 0.1, H.face - 0.1, C.x1 - C.x0 + 0.4, 0.2, 0.3);
      /* HIS FRONT WALL (z -5.6): the door in the middle, a window either side, curtains drawn behind both */
      wallX(mCourtWall, H.face - 0.1, 0.2, LIVING.x0 - 0.1, LIVING.x1 + 0.1, [
        { x0: WIN_A.x0, x1: WIN_A.x1, y0: WIN_A.sill, y1: WIN_A.head },
        { x0: DOOR_FRONT.x0, x1: DOOR_FRONT.x1, y0: 0, y1: DOOR_FRONT.h },
        { x0: WIN_B.x0, x1: WIN_B.x1, y0: WIN_B.sill, y1: WIN_B.head }], 0, STOREY);
      windowX(WIN_A, H.face - 0.1, 0.2); windowX(WIN_B, H.face - 0.1, 0.2);
      /* the walls' feet: a grey plinth 15 cm high round the court (a builder's waterproof band), standing 1 cm proud */
      box(mBand, C.x0 + 0.005, 0.075, (C.z0 + H.face) / 2, 0.03, 0.15, H.face - C.z0 - 0.2);
      box(mBand, C.x1 - 0.005, 0.075, (C.z0 + H.face) / 2, 0.03, 0.15, H.face - C.z0 - 0.2);
      box(mBand, (C.x0 + DOOR_FRONT.x0) / 2, 0.075, H.face - 0.205, DOOR_FRONT.x0 - C.x0, 0.15, 0.03);
      box(mBand, (DOOR_FRONT.x1 + C.x1) / 2, 0.075, H.face - 0.205, C.x1 - DOOR_FRONT.x1, 0.15, 0.03);
      box(mBand, (C.x0 + C.x1) / 2, 0.075, C.z0 + 0.205, C.x1 - C.x0, 0.15, 0.03);
      /* on his side wall (the west, his bedroom wing) its window, its grille and its curtain drawn behind the glass; on his
         neighbour's (the east) a high louvred vent: painted, as their faces are seen across the court and never reached */
      const winCard = (() => { const [c, x] = canvas(256, 256);
        x.fillStyle = '#b9bcbd'; x.fillRect(0, 0, 256, 256); x.fillStyle = '#4a4438'; x.fillRect(10, 10, 236, 236);
        const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, 'rgba(232,206,160,0.9)'); g.addColorStop(1, 'rgba(196,168,124,0.9)'); x.fillStyle = g; x.fillRect(14, 14, 228, 228);
        x.strokeStyle = 'rgba(120,96,70,0.35)'; for (let i = 0; i < 18; i++) { x.beginPath(); x.moveTo(20 + i * 12.5, 14); x.lineTo(20 + i * 12.5, 242); x.stroke(); }
        x.fillStyle = '#b9bcbd'; x.fillRect(124, 10, 8, 236);
        x.fillStyle = '#e6e6e0'; for (let i = 0; i < 9; i++) x.fillRect(20 + i * 27, 6, 5, 244); x.fillRect(6, 120, 244, 6);
        return B({ map: tex(done(THREE, c, false)) }); })();
      quadUV(winCard, [C.x0 + 0.012, 1.0, -7.7], [C.x0 + 0.012, 1.0, -9.1], [C.x0 + 0.012, 2.15, -9.1], [C.x0 + 0.012, 2.15, -7.7]);
      box(mBand, C.x0 + 0.04, 0.98, -8.4, 0.06, 0.04, 1.5);
      const vent = (() => { const [c, x] = canvas(128, 64); x.fillStyle = '#9e978a'; x.fillRect(0, 0, 128, 64);
        for (let j = 0; j < 7; j++) { x.fillStyle = '#3a3630'; x.fillRect(6, 6 + j * 8, 116, 4); x.fillStyle = '#c9c2b2'; x.fillRect(6, 10 + j * 8, 116, 2); }
        return B({ map: tex(done(THREE, c, false)) }); })();
      quadUV(vent, [C.x1 - 0.012, 2.2, -10.4], [C.x1 - 0.012, 2.2, -9.4], [C.x1 - 0.012, 2.7, -9.4], [C.x1 - 0.012, 2.7, -10.4]);
      /* the door's frame: its jambs and head in dark timber, 7 cm wide on the court's face, covering the leaf's edges
         (the leaf's hinge edge came back ragged: the frame covers it, RECORD.md 8) */
      const mJamb = M({ color: 0x3a2618, roughness: 0.6 });
      box(mJamb, DOOR_FRONT.x0 + 0.02, DOOR_FRONT.h / 2, H.face - 0.215, 0.11, DOOR_FRONT.h, 0.035);
      box(mJamb, DOOR_FRONT.x1 - 0.02, DOOR_FRONT.h / 2, H.face - 0.215, 0.11, DOOR_FRONT.h, 0.035);
      box(mJamb, (DOOR_FRONT.x0 + DOOR_FRONT.x1) / 2, DOOR_FRONT.h + 0.03, H.face - 0.215, DOOR_FRONT.x1 - DOOR_FRONT.x0 + 0.14, 0.09, 0.035);
      box(mJamb, (DOOR_FRONT.x0 + DOOR_FRONT.x1) / 2, 0.012, H.face - 0.1, DOOR_FRONT.x1 - DOOR_FRONT.x0, 0.024, 0.22);   // the threshold
      /* the step of the house's floor over the court's is none: one level (the walk test floods it whole) */
    }

    function buildHouse() {
      const H = HOUSE, L = LIVING, D = DINING, t = H.wall, h = H.ceil;
      floor(mFloorIn, L.x0, L.z0, L.x1, L.z1); floor(mFloorIn, D.x0, D.z0, D.x1, D.z1);
      floor(mFloorIn, DOOR_FRONT.x0, H.face - 0.2, DOOR_FRONT.x1, L.z0, 0.001);
      const ceilQ = (x0, z0, x1, z1) => quad(mCeil, [x0, h, z0], [x1, h, z0], [x1, h, z1], [x0, h, z1]);
      ceilQ(L.x0, L.z0 - 0.1, L.x1, L.z1); ceilQ(D.x0, D.z0, D.x1, D.z1);
      /* the front wall's inside face (its paint) round the openings */
      const zi = L.z0 + 0.002, skin = (x0, x1, y0, y1) => quad(mWallIn, [x0, y0, zi], [x1, y0, zi], [x1, y1, zi], [x0, y1, zi], x0, y0);
      skin(L.x0, WIN_A.x0, 0, h); skin(WIN_A.x1, DOOR_FRONT.x0, 0, h); skin(DOOR_FRONT.x1, WIN_B.x0, 0, h); skin(WIN_B.x1, L.x1, 0, h);
      skin(WIN_A.x0, WIN_A.x1, 0, WIN_A.sill); skin(WIN_A.x0, WIN_A.x1, WIN_A.head, h); skin(WIN_B.x0, WIN_B.x1, 0, WIN_B.sill); skin(WIN_B.x0, WIN_B.x1, WIN_B.head, h);
      skin(DOOR_FRONT.x0, DOOR_FRONT.x1, DOOR_FRONT.h, h);
      /* the living room's east wall (x -5.1), its north wall (z -1.6) with the bedrooms' door (shut), the dining room's
         east wall (x -8.5) with the kitchen's door (shut), its north wall (z 1.6), and the west wall (x -12.3) with the
         terrace doors in the living room's part and a window in the dining room's */
      wallZ(mWallIn, L.x1 + t / 2, t, L.z0 - 0.1, L.z1 + t / 2, [], 0, h);
      wallX(mWallIn, L.z1 + t / 2, t, D.x1 - t / 2, L.x1 + t, [{ x0: -6.15, x1: -5.35, y0: 0, y1: 2.1 }], 0, h);
      wallZ(mWallIn, D.x1 + t / 2, t, L.z1, D.z1 + t, [{ z0: 0.25, z1: 1.05, y0: 0, y1: 2.1 }], 0, h);
      wallX(mWallIn, D.z1 + t / 2, t, D.x0 - t, D.x1 + t, [], 0, h);
      const WIN_D = { z0: -0.75, z1: 0.75, sill: 0.9, head: 2.1 };
      wallZ(mWallIn, L.x0 - t / 2, t, L.z0 - 0.1, D.z1 + t, [
        { z0: TERRACE.z0, z1: TERRACE.z1, y0: 0, y1: TERRACE.h },
        { z0: WIN_D.z0, z1: WIN_D.z1, y0: WIN_D.sill, y1: WIN_D.head }], 0, h);
      windowZ(WIN_D, L.x0 - t / 2, t);
      /* the shut doors: a veneer leaf in each opening (painted; nobody opens them), and what stops him there */
      box(mVeneer, -5.75, 1.05, L.z1 + 0.005, 0.8, 2.1, 0.04); solidXZ(-6.15, L.z1 - 0.05, -5.35, L.z1 + 0.1);
      box(mVeneer, D.x1 + 0.005, 1.05, 0.65, 0.04, 2.1, 0.8); solidXZ(D.x1 - 0.05, 0.25, D.x1 + 0.1, 1.05);
      /* THE TERRACE DOORS: two sliding glass leaves in aluminium; the terrace beyond (1.5 m, its parapet), never walked */
      { const xc = L.x0 - t / 2, z0 = TERRACE.z0, z1 = TERRACE.z1, hh = TERRACE.h;
        box(mAlu, xc, hh - 0.02, (z0 + z1) / 2, t * 0.7, 0.04, z1 - z0); box(mAlu, xc, 0.02, (z0 + z1) / 2, t * 0.7, 0.04, z1 - z0);
        box(mAlu, xc, hh / 2, z0 + 0.02, t * 0.7, hh, 0.04); box(mAlu, xc, hh / 2, z1 - 0.02, t * 0.7, hh, 0.04); box(mAlu, xc, hh / 2, (z0 + z1) / 2, t * 0.7, hh, 0.05);
        glass.push({ mat: mGlass, a: [xc, 0.04, z1], b: [xc, 0.04, z0], c: [xc, hh - 0.04, z0], d: [xc, hh - 0.04, z1] });
        solidXZ(xc - 0.1, z0, xc + 0.06, z1);
        floor(mWalkFloor, TERRACE.out, z0 - 0.6, xc - t / 2, z1 + 0.6, -0.02);
        box(mFace, TERRACE.out - 0.08, 0.5, (z0 + z1) / 2, 0.15, 1.0, z1 - z0 + 1.2);
        box(mFace, (TERRACE.out + xc) / 2, 0.5, z0 - 0.6, xc - TERRACE.out, 1.0, 0.15);
        box(mFace, (TERRACE.out + xc) / 2, 0.5, z1 + 0.6, xc - TERRACE.out, 1.0, 0.15);
        quad(mSoffit, [TERRACE.out, h + 0.05, z1 + 0.6], [xc, h + 0.05, z1 + 0.6], [xc, h + 0.05, z0 - 0.6], [TERRACE.out, h + 0.05, z0 - 0.6]); }
      /* the skirting (100 mm of dark timber) round the rooms' walls */
      const sk = (a, b) => wall(mSkirt, a[0], a[1], b[0], b[1], 0, 0.1);
      sk([L.x1 - 0.006, L.z0], [L.x1 - 0.006, L.z1 - 0.006]); sk([L.x1 - 0.006, L.z1 - 0.006], [-5.35, L.z1 - 0.006]);
      sk([-6.15, L.z1 - 0.006], [D.x1 + 0.006, L.z1 - 0.006]);
      /* the house's outer faces seen from the estate past the terrace (its west end): the block's paint, to the roof */
      box(mFace, TERRACE.out - 0.08, h + 0.3 + (STOREY * 3 - h) / 2, (TERRACE.z0 + TERRACE.z1) / 2, 0.15, STOREY * 3 - h, TERRACE.z1 - TERRACE.z0 + 1.2);   // the terrace above's parapets, to the roof
      box(mBand, (TERRACE.out + L.x0) / 2, h + 0.15, (TERRACE.z0 + TERRACE.z1) / 2, L.x0 - TERRACE.out + 0.2, 0.3, TERRACE.z1 - TERRACE.z0 + 1.2);
    }

    /* ================================================================ THE ESTATE ROUND THE BLOCK (seen past the
       balustrade and from the terrace): its ground 5.9 m below, its lawn, its pool, its paths, the other blocks of the
       same condominium round it (six storeys, the same paint, every home's windows its own: lit warm, cool, or dark at
       dusk), and the city's haze. Painted light only (v9.4). Seeded (v6.15): the same estate every run. */
    function buildEstate() {
      const G = GROUND_Y;
      const mGrass = B({ fog: true, map: (() => { const [c, x] = canvas(256, 256), r = rng(28530);
        x.fillStyle = '#3d4a28'; x.fillRect(0, 0, 256, 256);
        for (let s = 0; s < 4000; s++) { x.fillStyle = `rgba(${50 + r() * 40},${70 + r() * 40},${28 + r() * 20},0.5)`; x.fillRect(r() * 256, r() * 256, 2, 2); }
        return pic(c, 5, 5); })() });
      const mDeck = B({ color: 0x8e8574, fog: true });
      const mPool = B({ fog: true, map: (() => { const [c, x] = canvas(256, 256), r = rng(28531);
        const g = x.createLinearGradient(0, 0, 256, 256); g.addColorStop(0, '#3f7f98'); g.addColorStop(1, '#2d6a86'); x.fillStyle = g; x.fillRect(0, 0, 256, 256);
        for (let s = 0; s < 60; s++) { x.strokeStyle = `rgba(230,240,255,${0.05 + r() * 0.08})`; x.beginPath(); const yy = r() * 256; x.moveTo(0, yy); x.bezierCurveTo(80, yy + 8, 170, yy - 8, 256, yy + 4); x.stroke(); }
        return pic(c, 6, 6); })() });
      floor(mGrass, -90, -80, 80, 40, G);
      floor(mDeck, 4, -40, 28, -18, G + 0.02); floor(mPool, 7, -37, 25, -24, G + 0.04);
      floor(mDeck, -40, -26, 4, -21, G + 0.02); floor(mDeck, 4, -18, 8, 20, G + 0.02);
      /* the block itself, seen from below and beyond: its body under the walkway down to the ground, its void deck */
      box(mFace, -6, (G - 0.35) / 2, -6, 10, -G - 0.35, 16);
      /* the other blocks: a six-storey slab of homes, each storey's band and its windows, from an atlas of households */
      const NW = 8, atlas = (() => { const [c, x] = canvas(1024, 1024), r = rng(28532), cw = 1024 / 4, ch = 1024 / 4;
        x.fillStyle = '#e2dccd'; x.fillRect(0, 0, 1024, 1024);
        for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const ox = i * cw, oy = j * ch;
          x.fillStyle = '#8f8a82'; x.fillRect(ox, oy + ch - 26, cw, 26);                                         // the slab's band
          x.fillStyle = '#cfc8b8'; x.fillRect(ox, oy + ch - 70, cw, 44);                                         // the balcony's parapet
          for (const wx of [0.12, 0.56]) { const lit = r(), col = lit < 0.35 ? '#f0c27a' : lit < 0.5 ? '#c9d8ec' : lit < 0.58 ? '#7f97d6' : '#2a2e36';
            x.fillStyle = '#5f5a52'; x.fillRect(ox + wx * cw - 3, oy + 34, cw * 0.32 + 6, ch * 0.5 + 6);
            x.fillStyle = col; x.fillRect(ox + wx * cw, oy + 37, cw * 0.32, ch * 0.5);
            if (lit < 0.58) { x.fillStyle = 'rgba(0,0,0,0.18)'; for (let k = 0; k < 6; k++) x.fillRect(ox + wx * cw + k * cw * 0.055, oy + 37, 3, ch * 0.5); }
            x.fillStyle = '#b9bcbd'; x.fillRect(ox + wx * cw + cw * 0.155, oy + 37, 3, ch * 0.5); } }
        const t = tex(done(THREE, c, false)); t.anisotropy = 8; return B({ map: t, fog: true }); })();
      const BAYW = 7.0, mFaceD = B({ color: 0xcfc8b8, fog: true, side: THREE.DoubleSide });
      const slab = (x0, z0, x1, z1, storeys, seed) => {
        const r = rng(seed), L = Math.hypot(x1 - x0, z1 - z0), ax = (x1 - x0) / L, az = (z1 - z0) / L, nb = Math.max(1, Math.round(L / BAYW)), bw = L / nb;
        const P = (u, y, w = 0) => [x0 + ax * u + az * w, y, z0 + az * u - ax * w];
        for (let st = 0; st < storeys; st++) for (let i = 0; i < nb; i++) { const y = G + st * STOREY, k = (r() * 16) | 0, ci = k % 4, cj = (k / 4) | 0;
          const u0 = ci / 4, u1 = (ci + 1) / 4, v0 = 1 - (cj + 1) / 4, v1 = 1 - cj / 4;
          const a = P(i * bw, y), b = P((i + 1) * bw, y), c = P((i + 1) * bw, y + STOREY), d = P(i * bw, y + STOREY), Bt = batchOf(atlas);
          const PP = [a, b, c, a, c, d], U = [[u0, v0], [u1, v0], [u1, v1], [u0, v0], [u1, v1], [u0, v1]];
          for (let q = 0; q < 6; q++) { Bt.p.push(PP[q][0], PP[q][1], PP[q][2]); Bt.n.push(-az, 0, ax); Bt.u.push(U[q][0], U[q][1]); } }
        const top = G + storeys * STOREY, dp = 12;
        const e0 = P(0, 0), e1 = P(L, 0), b0 = P(0, 0, dp), b1 = P(L, 0, dp);
        quad(mFaceD, [b0[0], G, b0[2]], [e0[0], G, e0[2]], [e0[0], top, e0[2]], [b0[0], top, b0[2]]);
        quad(mFaceD, [e1[0], G, e1[2]], [b1[0], G, b1[2]], [b1[0], top, b1[2]], [e1[0], top, e1[2]]);
        quad(mFaceD, [e0[0], top, e0[2]], [e1[0], top, e1[2]], [b1[0], top, b1[2]], [b0[0], top, b0[2]]);
        const c0 = P(-0.3, top - 0.1, 0.3), c1 = P(L + 0.3, top - 0.1, 0.3);
        box(mBand, (c0[0] + c1[0]) / 2, top + 0.5, (c0[2] + c1[2]) / 2, Math.abs(c1[0] - c0[0]) || 0.4, 1.2, Math.abs(c1[2] - c0[2]) || 0.4);
      };
      /* (each slab's face turned toward the walkway: P's w is out of its face) */
      slab(36, -30, 36, 22, 6, 28541);          // east, across the pool, its face to the west
      slab(-30, -52, 26, -52, 6, 28542);        // south, beyond the deck
      slab(-44, 12, -44, -40, 6, 28543);        // west, seen from the terrace
      /* the estate's trees on the lawn (chapter 4's real models of Singapore's street trees: declared, reuseInEpisode) */
      /* (each a model of ~28,000 triangles: a few where they are seen, past the balustrade and the terrace, in cells of
         24 m, each cell its own instanced mesh culled by its own sphere: the phone's budget, the plan's 13) */
      const TREES = [], PALMS = [], tr = rng(28544);
      for (const [x, z] of [[17, -11], [24, -4], [18, 9], [30, 4], [-14, -30], [-28, -24], [6, -46], [-34, 2]])
        TREES.push({ x: x + (tr() - 0.5) * 2, y: G, z: z + (tr() - 0.5) * 2, ry: tr() * 6.28, s: 0.75 + tr() * 0.25 });
      for (const [x, z] of [[5, -20], [27, -21], [5, -41], [27, -41], [-20, -22]])
        PALMS.push({ x, y: G, z, ry: tr() * 6.28, s: 0.85 + tr() * 0.2 });
      const cells = (list) => { const m = new Map(); for (const it of list) { const k = Math.floor(it.x / 24) + ',' + Math.floor(it.z / 24); if (!m.has(k)) m.set(k, []); m.get(k).push(it); } return [...m.values()]; };
      for (const c of cells(TREES)) many('w4angsana', c, world, 0.03);
      for (const c of cells(PALMS)) many('w4foxpalm', c, world, 0.03);
    }

    /* ================================================================ THE LIFT CAR (the opening film: through his eyes,
       no chapter has stood him in one). Behind the walkway's end wall: brushed steel, a grey rubber floor, a lit panel
       over, the car's panel of buttons (w5liftpanel) on its right wall, and its two doors, which slide (liftDoors) */
    const liftDoorL = new THREE.Group(), liftDoorR = new THREE.Group();
    function buildLift() {
      const Lf = LIFT;
      floor(mRubber, Lf.x0, Lf.z0 - 0.15, Lf.x1, Lf.z1);
      quad(mLit, [Lf.x0 + 0.25, Lf.h - 0.01, Lf.z0 + 0.25], [Lf.x1 - 0.25, Lf.h - 0.01, Lf.z0 + 0.25], [Lf.x1 - 0.25, Lf.h - 0.01, Lf.z1 - 0.25], [Lf.x0 + 0.25, Lf.h - 0.01, Lf.z1 - 0.25]);
      quad(mSteel, [Lf.x0, Lf.h, Lf.z0 - 0.15], [Lf.x1, Lf.h, Lf.z0 - 0.15], [Lf.x1, Lf.h, Lf.z1], [Lf.x0, Lf.h, Lf.z1]);
      wall(mSteel, Lf.x0, Lf.z1, Lf.x0, Lf.z0 - 0.15, 0, Lf.h);
      wall(mSteel, Lf.x1, Lf.z0 - 0.15, Lf.x1, Lf.z1, 0, Lf.h);
      wall(mSteel, Lf.x1, Lf.z1, Lf.x0, Lf.z1, 0, Lf.h);
      /* its handrail on the back wall */
      bar(mSteel, [Lf.x0 + 0.1, 0.92, Lf.z1 - 0.06], [Lf.x1 - 0.1, 0.92, Lf.z1 - 0.06], 0.02, 8);
      /* the doors: two steel leaves in the end wall's opening, each LIFT.door wide; liftDoors(k) slides them apart */
      for (const [g, s] of [[liftDoorL, -1], [liftDoorR, 1]]) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(LIFT.door + 0.02, 2.1, 0.04), mSteel); m.position.set(s * LIFT.door / 2, 1.05, 0); g.add(m);
        g.position.set(0, 0, WALK.z1 + 0.06); world.add(g); owned.push(m.geometry); }
      stand('w5liftpanel', Lf.x1 - 0.03, 0.55, Lf.z0 + 0.35, -Math.PI / 2);
    }
    function liftDoors(k) { const s = Math.max(0, Math.min(1, k)) * (LIFT.door + 0.02); liftDoorL.position.x = -s; liftDoorR.position.x = s; }

    /* ================================================================ CASE THREE'S ROOM (the plan's 4.7 and 8.2)
       Where Grandmaster Pho receives people when he is in Singapore: a plain upstairs room, 4 m by 5 m, in daylight. A low
       table covered with a white cloth in its middle (w5clothtable, 1.2 m by 0.70 m), Grandmaster Pho's cushion behind it
       with the empty altar shelf on the wall behind him (w5altarshelf), the collector's at its west end, the student's
       across from his teacher; one window on its east wall (the afternoon in it: the street's shophouses across); a
       ceiling fan over the table (w5ceilfan); the door in its south wall, shut. */
    function buildRoom() {
      const R = ROOM, h = R.ceil, t = 0.12;
      floor(mRoomFloor, R.x0, R.z0, R.x1, R.z1);
      quad(M({ color: 0xf2f0ea, roughness: 0.95, emissive: 0x3a3a36 }), [R.x0, h, R.z0], [R.x1, h, R.z0], [R.x1, h, R.z1], [R.x0, h, R.z1]);
      const WIN = { z0: 239.0, z1: 241.0, sill: 0.95, head: 2.15 };
      wallZ(mRoomWall, R.x1 + t / 2, t, R.z0 - t, R.z1 + t, [{ z0: WIN.z0, z1: WIN.z1, y0: WIN.sill, y1: WIN.head }], 0, h);
      windowZ(WIN, R.x1 + t / 2, t, mGlassDay);
      wallZ(mRoomWall, R.x0 - t / 2, t, R.z0 - t, R.z1 + t, [], 0, h);
      wallX(mRoomWall, R.z1 + t / 2, t, R.x0 - t, R.x1 + t, [], 0, h);
      wallX(mRoomWall, R.z0 - t / 2, t, R.x0 - t, R.x1 + t, [{ x0: -1.6, x1: -0.75, y0: 0, y1: 2.1 }], 0, h);
      box(mVeneer, -1.175, 1.05, R.z0 - 0.005, 0.85, 2.1, 0.04); solidXZ(-1.6, R.z0 - 0.12, -0.75, R.z0 + 0.04);
      const sk = (a, b) => wall(mSkirt, a[0], a[1], b[0], b[1], 0, 0.08);
      sk([R.x0 + 0.006, R.z1 - 0.006], [R.x0 + 0.006, R.z0 + 0.006]); sk([R.x1 - 0.006, R.z0 + 0.006], [R.x1 - 0.006, R.z1 - 0.006]);
      sk([R.x1 - 0.006, R.z1 - 0.006], [R.x0 + 0.006, R.z1 - 0.006]);
      /* the afternoon in the window: a row of shophouses across the street, 14 m off, and the sky over them (geometry
         with perspective, never a painted sheet on the glass: v8.9) */
      const shop = (() => { const [c, x] = canvas(1024, 512), r = rng(28550);
        const cols = ['#e9d7a9', '#cfe0d6', '#f0c7b4', '#dfe3ea', '#e8d0e0', '#f2e6c8'];
        for (let i = 0; i < 6; i++) { const ox = i * 170.67; x.fillStyle = cols[i]; x.fillRect(ox, 0, 171, 512);
          x.fillStyle = 'rgba(0,0,0,0.12)'; x.fillRect(ox, 0, 4, 512);
          for (const wx of [0.18, 0.62]) { x.fillStyle = '#6d4b33'; x.fillRect(ox + wx * 171, 60, 44, 120); x.fillStyle = '#2b2d30'; x.fillRect(ox + wx * 171 + 5, 66, 34, 108);
            x.fillStyle = '#6d4b33'; for (let k = 0; k < 6; k++) x.fillRect(ox + wx * 171 + 5, 70 + k * 18, 34, 3); }
          x.fillStyle = '#7f8188'; x.fillRect(ox, 236, 171, 30);
          x.fillStyle = '#3a3532'; x.fillRect(ox + 10, 270, 151, 242); x.fillStyle = '#b84a2c'; x.fillRect(ox, 0, 171, 14); }
        const tt = tex(done(THREE, c, false)); tt.anisotropy = 8; return B({ map: tt, fog: true }); })();
      const SX = R.x1 + 14;
      quad(shop, [SX, -6, 252], [SX, -6, 228], [SX, 7.0, 228], [SX, 7.0, 252]);
      box(B({ color: 0x8e3a26, fog: true }), SX - 0.2, 7.25, 240, 0.8, 0.5, 24);
      floor(B({ color: 0x55565a, fog: true }), R.x1 + 0.2, 226, SX, 254, -6.0);
      box(mRoomWall, R.x1 + 0.2, -3.0, 240, 0.2, 6.0, 5.2);
    }

    /* the glass of every window, drawn last (see-through: after the opaque) */
    function buildGlass() { for (const g of glass) quad(g.mat, g.a, g.b, g.c, g.d); }

    buildWalkway();
    buildCourt();
    buildHouse();
    buildEstate();
    buildLift();
    buildRoom();
    buildGlass();
    flush(world);

    /* ================================================================ THE THINGS (masters/v28.0/props/RECORD.md: each one
       made once, prepared in metres on its base's middle, its front along +z; every number is a place). With the mends
       taken here at no credits (Chad's rule: keep, mend here, or pay for another; mending here is the default): */
    const DEG = Math.PI / 180;
    const C3 = new THREE.Color();
    /* THE ROSEWOOD, darkened at runtime (RECORD.md: every "dark rosewood" thing came back a bright saturated red): the
       picture's own colour turned 16 degrees toward orange about the grey axis (hueTurn) and darkened, so its grain and
       wear stay and its red becomes a dark reddish brown. His files untouched (v12.4 holds it for his; it costs nothing) */
    function rosewood(m) { m.traverse(q => { if (!q.isMesh) return; for (const mt of [].concat(q.material)) { if (!mt || !mt.color) continue;
      mt.color.multiply(C3.set(0xa88c7e)); hueTurn(mt, 16); } }); }
    /* the case's foam (RECORD.md 7): its pits drew as black mirrors. Matte: no shine and no metal, the whole case */
    function matte(m) { m.traverse(q => { if (!q.isMesh) return; for (const mt of [].concat(q.material)) { if (!mt) continue;
      if ('metalness' in mt) { mt.metalness = 0; mt.metalnessMap = null; } if ('roughness' in mt) { mt.roughness = 0.92; mt.roughnessMap = null; } mt.needsUpdate = true; } }); }
    /* a model stood and SCALED on its own axes (a table to its plan's size), then mended */
    function place(key, x, y, z, ry, o = {}) {
      const g = stand(key, x, y, z, ry, { done: (m) => { if (o.wood) rosewood(m); if (o.matte) matte(m); if (o.done) o.done(m); } });
      if (o.sx || o.sy || o.sz) g.scale.set(o.sx || 1, o.sy || 1, o.sz || 1);
      if (o.name) g.name = o.name;
      return g;
    }
    /* MANY OF ONE THING, each stretched along its own x (the balustrade's 2 m sections fitted to each run): manyOf's own
       way (one InstancedMesh a mesh of the file, the file's transform folded in), with a scale per instance */
    function manyX(key, list, chunk = 3) {
      if (!have(key)) { waiting.add(key); return; }
      parseOnce(key).then(({ scene: src }) => {
        if (!alive) return;
        src.updateMatrixWorld(true);
        src.traverse(o => { if (!o.isMesh) return;
          const mat = o.material.clone(); mats.push(mat);
          /* (in pieces of `chunk`, each culled by its own sphere: one mesh for both runs was all of them in every frame) */
          for (let c0 = 0; c0 < list.length; c0 += chunk) { const part = list.slice(c0, c0 + chunk);
          const im = new THREE.InstancedMesh(o.geometry, mat, part.length);
          part.forEach((it, i) => { _me.set(0, it.ry || 0, 0, 'YXZ'); _mq.setFromEuler(_me);
            _mm.compose(_mp.set(it.x, it.y, it.z), _mq, _ms.set(it.sx || 1, 1, 1)).multiply(o.matrixWorld); im.setMatrixAt(i, _mm); });
          im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); im.name = 'stock:' + key;
          world.add(im); owned.push(im); } });
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
    }
    const things = {};
    /* --- the walkway: the balustrade along both runs (each run's sections stretched to fill it: run 1 nine of 1.883 m,
       run 2 seven of 1.871 m), its lights on the soffit every 4 m (as they came: the rim up against the soffit, the ribbed
       dome below it), the drain's grating at the edge (as it came: put to Chad) */
    { const R = [], W = WALK, rz0 = W.z0 + 0.15, rz1 = W.z1, n1 = 9, L1 = (rz1 - rz0) / n1;
      for (let i = 0; i < n1; i++) R.push({ x: W.edge - 0.09, y: 0, z: rz1 - (i + 0.5) * L1, ry: -Math.PI / 2, sx: L1 / 2.0 });
      const rx0 = W.endX, rx1 = W.edge - 0.16, n2 = 7, L2 = (rx1 - rx0) / n2;
      for (let i = 0; i < n2; i++) R.push({ x: rx0 + (i + 0.5) * L2, y: 0, z: W.z0 + 0.09, ry: 0, sx: L2 / 2.0 });
      manyX('w5rail', R); }
    { const L = [];
      for (let z = -0.8; z > WALK.z0 + 0.5; z -= 4.0) L.push({ x: 0.0, y: WALK.soffit - 0.168, z, ry: 0 });
      for (let x = -3.2; x > WALK.endX + 0.5; x -= 4.0) L.push({ x, y: WALK.soffit - 0.168, z: (WALK.z0 + WALK.turnZ) / 2, ry: 0 });
      many('w5walklight', L, world, 0.2); things.walkLights = L; }
    const DRAIN = { x: WALK.edge - 0.33, z: -8.7 };
    things.grating = place('w5grating', DRAIN.x, 0.0, DRAIN.z, Math.PI / 2, { name: 'grating' });
    /* --- his gate between its posts (the gate swings on its left post into the court: shut on the walkway, open from the
       hunt on: gateOpen); the posts' caps a bright terracotta, as made */
    const gp = GATE.w / 2 + GATE.post / 2 + 0.005;
    place('w5gatepost', GATE.x - gp, 0, WALK.turnZ + 0.1, 0);
    place('w5gatepost', GATE.x + gp, 0, WALK.turnZ + 0.1, 0);
    solidXZ(GATE.x - gp - 0.21, WALK.turnZ - 0.11, GATE.x - gp + 0.21, WALK.turnZ + 0.31);
    solidXZ(GATE.x + gp - 0.21, WALK.turnZ - 0.11, GATE.x + gp + 0.21, WALK.turnZ + 0.31);
    const gateHinge = new THREE.Group(); gateHinge.position.set(GATE.x - GATE.w / 2, 0, WALK.turnZ + 0.1); world.add(gateHinge);
    things.gate = place('w5gate', GATE.w / 2, 0, 0, 0, { name: 'gate' });
    world.remove(things.gate); gateHinge.add(things.gate);
    const gateShut = solidXZ(GATE.x - GATE.w / 2, WALK.turnZ, GATE.x + GATE.w / 2, WALK.turnZ + 0.2);
    const gateOpenLeaf = solidXZ(GATE.x - GATE.w / 2 - 0.08, WALK.turnZ + 0.15, GATE.x - GATE.w / 2 + 0.12, WALK.turnZ + 0.15 + GATE.w);
    function gateOpen(k) { gateHinge.rotation.y = -Math.max(0, Math.min(1, k)) * 92 * DEG; }
    /* --- the court: the two planters along its sides near the gate (each 2 m long, turned to run along the court),
       SUNK into the paving until their ragged bottoms are hidden (RECORD.md 3: the first 15 cm, the second 25 cm); the
       two wall lamps either side of his door; a pair of slippers by it */
    const PLANT_Z = -11.7;
    place('w5planter', COURT.x1 - 0.373 - 0.02, -0.15, PLANT_Z, Math.PI / 2, { name: 'planterL' });        // (his LEFT, walking in)
    place('w5planter2', COURT.x0 + 0.413 + 0.02, -0.25, PLANT_Z, -Math.PI / 2, { name: 'planterR' });
    solidXZ(COURT.x1 - 0.76, PLANT_Z - 1.0, COURT.x1, PLANT_Z + 1.0, 1.4);
    solidXZ(COURT.x0, PLANT_Z - 1.0, COURT.x0 + 0.84, PLANT_Z + 1.0, 1.4);
    place('w5walllamp', DOOR_FRONT.x0 - 0.38, 1.55, HOUSE.face - 0.2 - 0.074, Math.PI, { name: 'courtLampL' });
    place('w5walllamp', DOOR_FRONT.x1 + 0.38, 1.55, HOUSE.face - 0.2 - 0.074, Math.PI, { name: 'courtLampR' });
    place('w5slippers', DOOR_FRONT.x0 - 0.12, 0.0, HOUSE.face - 0.55, Math.PI + 12 * DEG, { name: 'slippers' });
    /* --- his front door, hung in its frame: the leaf's hinge edge (its +x, ragged) on the frame's west jamb, which covers
       it; shut on the walkway, open from the hunt (doorOpen) */
    const doorHinge = new THREE.Group(); doorHinge.position.set(DOOR_FRONT.x0 + 0.005, 0, HOUSE.face - 0.1); world.add(doorHinge);
    things.door = place('w5frontdoor', 0.395, 0, 0, Math.PI, { name: 'frontdoor', wood: true });
    world.remove(things.door); doorHinge.add(things.door);
    function doorOpen(k) { doorHinge.rotation.y = -Math.max(0, Math.min(1, k)) * 100 * DEG; }
    solidXZ(DOOR_FRONT.x0 - 0.05, HOUSE.face - 0.05, DOOR_FRONT.x0 + 0.08, HOUSE.face + 0.75);                 // the leaf, open, along the wall
    /* --- inside, by the door: the shoe cabinet against the front wall, west of the door, scaled to 0.35 m deep and
       darkened (RECORD.md 4; its ragged edges stay); the place under it is the first stain's */
    const SHOE = { x: (WIN_A.x1 + DOOR_FRONT.x0) / 2, z: LIVING.z0 + 0.175 + 0.01 };
    place('w5shoecab', SHOE.x, 0, SHOE.z, 0, { name: 'shoecab', wood: true, sz: 0.35 / 0.53 });
    solidXZ(SHOE.x - 0.45, LIVING.z0, SHOE.x + 0.45, SHOE.z + 0.18, 1.06);
    /* --- the curtains: drawn over both front windows, each window two curtains a little apart and one a hand behind
       the other (RECORD.md 1: the cloth's two slits are each covered by the other's cloth), their rails 5 cm under the
       ceiling; and one gathered beside the terrace doors, pushed to the side */
    /* (a drawn curtain is lit from the room: its back glows a little in the lamps' warmth, seen from the court at dusk) */
    const lamplit = (m) => m.traverse(q => { if (q.isMesh) for (const mt of [].concat(q.material)) if (mt && mt.emissive) { mt.emissive.set(0x2a2824); if (mt.map) mt.emissiveMap = mt.map; } });
    for (const Wn of [WIN_A, WIN_B]) { const xm = (Wn.x0 + Wn.x1) / 2;
      place('w5curtain', xm - 0.07, HOUSE.ceil - 2.40 - 0.05 + 0.04, LIVING.z0 + 0.16, 0, { sx: 0.82, done: lamplit });
      place('w5curtain', xm + 0.09, HOUSE.ceil - 2.40 - 0.05, LIVING.z0 + 0.26, 0, { sx: 0.80, done: lamplit }); }
    place('w5curtain', LIVING.x0 + 0.2, HOUSE.ceil - 2.40 - 0.05, TERRACE.z1 + 0.42, Math.PI / 2, { sx: 0.55 });
    /* --- the living room: the sofa facing the television across the low table, the old armchair at the table's north
       end (where his nose is once behind the truth: 4.3), the floor lamp by the sofa's end, the television's console on
       the east wall with a table lamp at each end, the wall clock and a framed picture on the north wall */
    const SOFA = { x: -8.62, z: -3.62 }, TV = { x: LIVING.x1 - 0.36, z: -3.62 }, TABLE = { x: -7.28, z: -3.62 }, ARM = { x: -7.25, z: -2.18 };
    things.sofa = place('w5sofa', SOFA.x, 0, SOFA.z, Math.PI / 2, { name: 'sofa' });
    solidXZ(SOFA.x - 0.44, SOFA.z - 1.05, SOFA.x + 0.44, SOFA.z + 1.05, 0.8);
    place('w5lowtable', TABLE.x, 0, TABLE.z, Math.PI / 2, { name: 'lowtable', wood: true });
    solidXZ(TABLE.x - 0.38, TABLE.z - 0.6, TABLE.x + 0.38, TABLE.z + 0.6, 0.36);
    place('w5tvconsole', TV.x, 0, TV.z, -Math.PI / 2, { name: 'tvconsole', wood: true });
    solidXZ(TV.x - 0.36, TV.z - 0.9, LIVING.x1, TV.z + 0.9, 1.2);
    things.armchair = place('w5oldchair', ARM.x, 0, ARM.z, Math.PI, { name: 'armchair' });
    solidXZ(ARM.x - 0.47, ARM.z - 0.42, ARM.x + 0.47, ARM.z + 0.42, 0.82);
    things.floorLamp = place('w5floorlamp', SOFA.x - 0.05, 0, SOFA.z + 1.38, 0, { name: 'floorlamp' });
    solidXZ(SOFA.x - 0.3, SOFA.z + 1.12, SOFA.x + 0.2, SOFA.z + 1.64, 1.5);
    const CON_TOP = 0.40;                                                                                     // the console's top (photographed)
    things.lampTV1 = place('w5tablelamp', TV.x, CON_TOP, TV.z - 0.72, 0, { name: 'tablelamp1' });
    things.lampTV2 = place('w5tablelamp', TV.x, CON_TOP, TV.z + 0.72, 0, { name: 'tablelamp2' });
    place('w5wallclock', -6.15, 1.42, LIVING.z1 - 0.06 - 0.062, Math.PI, { name: 'wallclock', wood: true });
    /* --- the dining room: the table (scaled to 0.75 m tall) and four chairs round it, the pendant over it, the sideboard
       against its north wall, a framed picture over it */
    const DT = { x: -10.4, z: 0.0 };
    place('w5dintable', DT.x, 0, DT.z, 0, { name: 'dintable', wood: true, sy: 0.75 / 0.873 });
    solidXZ(DT.x - 0.75, DT.z - 0.75, DT.x + 0.75, DT.z + 0.75, 0.75);
    for (const [dx, dz, ry] of [[0, -0.78, 0], [0, 0.78, Math.PI], [-0.78, 0, Math.PI / 2], [0.78, 0, -Math.PI / 2]])
      place('w5dinchair', DT.x + dx, 0, DT.z + dz, ry, { wood: true });
    things.pendant = place('w5pendant', DT.x, HOUSE.ceil - 0.45 - 0.35, DT.z, 0, { name: 'pendant' });
    place('w5sideboard', DT.x, 0, DINING.z1 - 0.06 - 0.283, Math.PI, { name: 'sideboard', wood: true });
    solidXZ(DT.x - 0.85, DINING.z1 - 0.65, DT.x + 0.85, DINING.z1, 1.0);
    /* the pictures in their frames (w5frame's white card is the chapter's to fill): ink landscapes, mountains and water,
       painted here (a Chinese home of the period; nobody in them: no face is drawn into the world) */
    function inkLandscape(seed) {
      const [c, x] = canvas(512, 340), r = rng(seed);
      x.fillStyle = '#efe7d4'; x.fillRect(0, 0, 512, 340);
      for (let layer = 0; layer < 4; layer++) { const base = 120 + layer * 55, a = 0.18 + layer * 0.16;
        x.fillStyle = `rgba(40,42,44,${a})`; x.beginPath(); x.moveTo(0, 340);
        for (let px = 0; px <= 512; px += 16) x.lineTo(px, base - Math.abs(Math.sin(px * 0.011 * (layer + 1) + r() * 0.4)) * (90 - layer * 14) - r() * 10);
        x.lineTo(512, 340); x.fill(); }
      x.fillStyle = 'rgba(160,40,30,0.85)'; x.fillRect(452, 30, 22, 30);
      return B({ map: tex(done(THREE, c, false)) });
    }
    function framed(x, y, z, ry, seed) {
      place('w5frame', x, y, z, ry, { wood: false });
      const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; world.add(g);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 0.33), inkLandscape(seed)); m.position.set(0, 0.2305, 0.0255); g.add(m); owned.push(m.geometry);
    }
    framed(ARM.x, 1.45, LIVING.z1 - 0.06 - 0.024, Math.PI, 28561);
    framed(DT.x, 1.5, DINING.z1 - 0.06 - 0.024, Math.PI, 28562);
    /* --- THE RITE'S THINGS, made ready and put away (the films and the play show them where their story puts them; each
       a handle on the stage: stage.things): the black bag open and tied, the reel of white thread (set down on its ball:
       RECORD.md 6, its loose end into the paving), the wrapped staff, its cloth, the Naga stick, Jun's duffel */
    const away = (key, name, o = {}) => { const g = place(key, 0, 0, 0, 0, Object.assign({ name }, o)); g.visible = false; things[name] = g; return g; };
    away('w5bagopen', 'bagOpen'); away('w5bagtied', 'bagTied'); away('w5threadreel', 'threadReel');
    things.threadReel.userData.sink = -0.015;
    away('w5staffwrap', 'staffWrap'); away('w5staffcloth', 'staffCloth'); away('w5nagastaff', 'nagaStaff'); away('w5duffel', 'duffel');
    /* where each is set when it is set down (the plan's 4.4): the bag on the paving before the doorway, the reel beside it */
    const RITE = { bag: { x: GATE.x + 0.35, z: HOUSE.face - 1.35 }, reel: { x: GATE.x - 0.35, z: HOUSE.face - 1.2 }, duffel: { x: DOOR_FRONT.x1 + 0.9, z: HOUSE.face - 0.45 } };
    function setDown(name, at, ry = 0) { const g = things[name]; if (!g) return; g.position.set(at.x, g.userData.sink || 0, at.z); g.rotation.y = ry; g.visible = true; }
    /* --- case three's room: the table and its cloth (scaled to 0.70 m deep), the collector's padded case on it (matte),
       the cushions, the altar shelf (empty, as asked) on the wall behind Grandmaster Pho, the ceiling fan */
    const R = ROOM;
    place('w5clothtable', R.cx, 0, R.cz, 0, { name: 'clothtable', sz: 0.70 / 0.976 });
    solidXZ(R.cx - 0.66, R.cz - 0.40, R.cx + 0.66, R.cz + 0.40, 0.34);
    things.padcase = place('w5padcase', R.cx - 0.36, 0.34, R.cz - 0.05, 18 * DEG, { name: 'padcase', matte: true });
    const SEAT = { pho: { x: R.cx, z: R.cz + 0.78 }, him: { x: R.cx, z: R.cz - 0.80 }, collector: { x: R.cx - 0.98, z: R.cz - 0.05 } };
    place('w5cushion', SEAT.pho.x, 0, SEAT.pho.z, 0); place('w5cushion', SEAT.him.x, 0, SEAT.him.z, 0); place('w5cushion', SEAT.collector.x, 0, SEAT.collector.z, 0);
    place('w5altarshelf', R.cx, 1.55, R.z1 - 0.2, Math.PI, { name: 'altarshelf', wood: true });
    things.fan = place('w5ceilfan', R.cx, R.ceil - 0.52, R.cz, 0, { name: 'ceilfan' });

    /* ================================================================ THE LAMPS' LIGHT (painted: v9.4, v15.1)
       Each lamp's glow (a soft card over its shade, drawn over what stands at its depth: v25.5) and its pool on the floor,
       wall or ceiling; lamp(i, k) sets one by k (0 off, 1 on: the fourth lamp of 4.2 flickers by the play's hand); the
       court's two wall lamps are lit for the night (courtLamps(k)) */
    const glowTex = (() => { const [c, x] = canvas(128, 128); const g = x.createRadialGradient(64, 64, 2, 64, 64, 62);
      g.addColorStop(0, 'rgba(255,236,196,1)'); g.addColorStop(0.35, 'rgba(255,214,150,0.45)'); g.addColorStop(1, 'rgba(255,200,130,0)');
      x.fillStyle = g; x.fillRect(0, 0, 128, 128); return tex(done(THREE, c, false)); })();
    const lights = [];
    function lightAt(x, y, z, size, pool) {
      const mat = new THREE.SpriteMaterial({ map: glowTex, color: 0xffe2b4, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.85 }); mats.push(mat);
      const sp = new THREE.Sprite(mat); sp.position.set(x, y, z); sp.scale.set(size, size, 1); world.add(sp);
      let pm = null;
      if (pool) { pm = new THREE.MeshBasicMaterial({ map: glowTex, color: 0xffd9a0, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.32, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }); mats.push(pm);
        const q = new THREE.Mesh(new THREE.PlaneGeometry(pool.w, pool.h), pm); q.position.set(pool.x, pool.y, pool.z); q.rotation.set(pool.rx || 0, pool.ry || 0, 0); world.add(q); owned.push(q.geometry); }
      const L = { sp, mat, pm, k: 1, o0: mat.opacity, p0: pm ? pm.opacity : 0 }; lights.push(L); return L;
    }
    lightAt(SOFA.x - 0.05, 1.42, SOFA.z + 1.38, 0.55, { x: SOFA.x, y: 0.006, z: SOFA.z + 1.2, w: 2.4, h: 2.4, rx: -Math.PI / 2 });
    lightAt(TV.x, CON_TOP + 0.38, TV.z - 0.72, 0.42, { x: TV.x - 0.02, y: 1.3, z: TV.z - 0.72, w: 1.4, h: 1.4, ry: -Math.PI / 2 });
    lightAt(TV.x, CON_TOP + 0.38, TV.z + 0.72, 0.42, { x: TV.x - 0.02, y: 1.3, z: TV.z + 0.72, w: 1.4, h: 1.4, ry: -Math.PI / 2 });
    lightAt(DT.x, HOUSE.ceil - 0.62, DT.z, 0.6, { x: DT.x, y: 0.758, z: DT.z, w: 1.6, h: 1.6, rx: -Math.PI / 2 });
    const courtL = [lightAt(DOOR_FRONT.x0 - 0.38, 1.86, HOUSE.face - 0.3, 0.38, { x: DOOR_FRONT.x0 - 0.38, y: 1.6, z: HOUSE.face - 0.212, w: 1.6, h: 1.6 }),
                    lightAt(DOOR_FRONT.x1 + 0.38, 1.86, HOUSE.face - 0.3, 0.38, { x: DOOR_FRONT.x1 + 0.38, y: 1.6, z: HOUSE.face - 0.212, w: 1.6, h: 1.6 })];
    function lamp(i, k) { const L = lights[i]; if (!L) return; L.k = k; L.mat.opacity = L.o0 * k; if (L.pm) L.pm.opacity = L.p0 * k; L.sp.visible = k > 0.01; }
    function courtLamps(k) { for (const L of courtL) { L.mat.opacity = L.o0 * k; if (L.pm) L.pm.opacity = L.p0 * k; L.sp.visible = k > 0.01; } }

    /* ================================================================ WHERE EACH PHASE PUTS THINGS AND PEOPLE
       (the plan's 4: each phase a save, and a Continue lands at its start). Every place is named here, so a film, the
       play and the walk test read one table. `at` is where he stands at the phase's start (and where a film hands him
       back); a person's station is where that person stands while that phase is played. Mr Koh's and Jun's are cast by
       the world (b_xpeople.js); Grandmaster Pho's, Ton's and the collector's are MARKED for their builders. */
    const STATION = {
      walk:  { at: { x: 0, z: 0.25, ry: 0 },
               pho: { x: 0.05, z: -2.7, ry: Math.PI }, ton: { x: -0.5, z: -1.15, ry: 0.35 }, jun: { x: 0.42, z: -1.45, ry: -0.3 },
               koh: { x: -9.0, z: -4.4, ry: Math.PI } },
      hunt:  { at: { x: -7.9, z: -5.05, ry: Math.PI + 0.2 },
               pho: { x: -9.6, z: -4.6, ry: -Math.PI / 2 }, ton: { x: -7.4, z: -12.6, ry: Math.PI }, jun: { x: -9.4, z: -8.4, ry: 0.4 },
               koh: { x: -9.85, z: -2.25, ry: Math.PI * 0.85 } },
      /* the cleansing: he in the court (the fight's own start is the fight's), the three in the doorway behind the thread */
      fight: { at: { x: -8.5, z: -10.6, ry: Math.PI },
               pho: { x: -8.0, z: -11.4, ry: Math.PI }, ton: { x: -9.12, z: -4.95, ry: Math.PI }, jun: { x: -7.88, z: -4.95, ry: Math.PI },
               koh: { x: -8.5, z: -4.7, ry: Math.PI } },
      /* case three: seated across the table from his teacher (the play seats him) */
      table: { at: { x: SEAT.him.x, z: SEAT.him.z, ry: Math.PI },
               pho: { x: SEAT.pho.x, z: SEAT.pho.z, ry: Math.PI }, collector: { x: SEAT.collector.x, z: SEAT.collector.z, ry: Math.PI / 2 },
               jun: { x: 1.45, z: 238.15, ry: -0.8 }, koh: null, ton: null }
    };
    STATION.ask = STATION.table;
    const DRAIN_SPOT = DRAIN;
    /* ================================================================ THE PEOPLE: chapter 3's machinery, as chapter 4 copied
       it and mended it (its c_people.js and its EDITS: one skeleton and several skins a person, the takes at weights, the
       films' poses by the clock, the feet set down by their own lowest contact, the head's and the shoulders' restraint,
       the hands laid by numbers, the levels by the lens; and a look as a neck makes it, R86 and R87), and its posture
       laws for a body sat or stood up straight (c_scast.js: Grandmaster Pho's, R42, R64, R76, R77, R88). Every one of its
       laws was learned on those chapters' bodies; see its own notes. The one change (assemble.py EDITS): the bodies this
       chapter made are keyed p5. The ground under every one is this chapter's floor (flatGround). */
    /* ================================================================ THE PEOPLE (the plan's §3.3, §6.1; the tracker's §5)
       Every body here was made for this chapter end to end (a reference on white in an A pose, Meshy at its highest
       settings, its rig with fingers, the library's takes and written ones: masters/v26.0/make.sh §1 to §3), prepped in
       real metres with its feet on the origin and its face along +z. Nobody is a block figure: a person is not drawn at
       all until its model has landed (v21.16).

       A PERSON is a group with the rig cloned into it and one mixer. Its takes all run, each at a weight; `take()` names
       the one that should be full and the rest ease out. A take may hold the body off its own origin (v25.5: measured
       per take, at its first moment), so each is brought back onto the person's spot as its weight rises. In a film a
       person is posed by the film's clock (`pose()`: the take and the moment, absolute, so a seek lands on the same
       picture: v6.4); in play the wall clock runs them.

       ONE SKELETON, SEVERAL SKINS (the tracker's §5 "The levels"). A person's file holds the body drawn from near by;
       `<key>m` and `<key>f` are the same body rebuilt lighter (Meshy's own remesh at 8,000 and 2,500 triangles, the
       rig laid on each by tools/riglod.mjs), and `<key>h` is the generator's own model with every triangle: for the two
       he speaks to face to face, and since v26.4 for the four seated masters and the woman lighting the candles (Chad, 13
       Nov 2026, of the brown hermit drawn from his 30,665-triangle body where he stood over him: "Why is the brown lersi
       so blocky here"; "30k triangles up close should never have been allowed"; and, told what a full body costs a
       phone: "Only the important people like ton, candle lighter female, seated masters, pho, and those that already are
       built this way can retain."). A crowd's driver takes none: its members never draw one.
       Each lighter or fuller skin is bound to the near body's own bones by name, so it
       wears every take and costs no skeleton; which one is drawn is chosen every frame from the lens (and so at a cut
       from the cut's own lens: v24.22), with a little slack so a person standing on a boundary does not flicker. */
    const people = [];
    /* NO SHRUNKEN COPIES OF A GENERATED BODY'S PAINT (v5.11's law, found again on 12 Nov: photographed on a phone's frame,
       every dark head on the turf was speckled white, a child's most of all). A generated body's sheet is hundreds of
       small patches packed edge to edge, each padded into its neighbours: black hair lies flush against white cloth.
       Every shrunken copy of the sheet averages one patch with the next, so a head drawn small is sampled from white
       and black mixed, along every seam of its hair. Plain sampling of the sheet itself never reaches past a texel,
       and the padding makes that texel the patch's own colour. Every body this chapter made (keys e4...), at every
       level; Chad's own models (Grandmaster Pho, the monk) are as he gave them and are not touched. */
    const NOMIP = /^p5/;
    /* v26.1 · A SHEET LAID OUT AGAIN WITH ROOM BETWEEN ITS CHARTS IS DRAWN WITH MIPMAPS (Chad, 12 Nov 2026: the faces
       "absolutely butchered", "really bad" on a 720p phone, "absolutely horrendous" on his own phone). Drawn without them, a
       face with more texels than the phone has pixels was SAMPLED: it sparkled and crawled as anything moved, and a still
       picture hides that. Every level of every body this chapter made is now baked into a sheet with a margin round each
       chart (masters/v26.0/people.sh REPAINT, tools/repaint.py), named `repainted`: such a sheet takes mipmaps and a
       little anisotropy, because averaging it can no longer bleed one chart into the next (v5.11's own answer). A sheet of
       any other name is drawn as it was. */
    /* (and A FACE BAKED ON A SHEET OF ITS OWN, `detail` (v26.3, Ton's: Chad, 13 Nov 2026, "the male character that the player
       keeps talking to, his face is too low res and compressed and blocky looking, improve it"). His full model kept the
       generator's flush charts (the repaint overlapped on its 310,000 triangles), so it was drawn without mipmaps, and from
       where he is talked to his face had three texels a pixel, sampled. His head's charts are baked by Blender into a 2048
       sheet of their own with a gutter round each (tools/rebake.py DETHANDS=0, masters/v26.3/make.sh), 1.6 times the
       texels, so it takes mipmaps as a repainted sheet does. Grandmaster Pho's own `detail` is his and is not touched) */
    /* A POSED VERTEX WITH EACH BONE'S MATRIX MADE ONCE A POSE (v26.11, FASTSKIN: the speed-ups' third, the load's own
       work). three's getVertexPosition multiplies a bone's world matrix by its inverse bind for every weight of every
       vertex it is asked for, and the chapter asks for every vertex of every body, at every moment it measures (the
       feet on the ground, the seats, the shins, the room round a body: several seconds of the load on this box). The
       product is the same sixteen numbers for every vertex of one pose, so it is made once a pose and a bone, by the
       same multiplyMatrices, and every vertex then takes three's own steps with it in the same order: the same base
       position (Mesh's, morphs and all), the same bind, the same weighted sum, the same inverse. `?opt=fastSkin:0` asks
       three every time; the proof reads every vertex of every body both ways (stage.skinProof) */
    const _svI = new THREE.Vector4(), _svW = new THREE.Vector4(), _svB = new THREE.Vector4(), _sv4 = new THREE.Vector4(), _svMats = new WeakMap();
    function skinMats(q) {
      const S = q.skeleton, bones = S.bones, inv = S.boneInverses;
      let L = _svMats.get(q); if (!L || L.length !== bones.length) { L = bones.map(() => new THREE.Matrix4()); _svMats.set(q, L); }
      for (let b = 0; b < bones.length; b++) L[b].multiplyMatrices(bones[b].matrixWorld, inv[b]);
      return L;
    }
    function skinVertex(q, i, target, L) {
      THREE.Mesh.prototype.getVertexPosition.call(q, i, target);
      const g = q.geometry;
      _svI.fromBufferAttribute(g.attributes.skinIndex, i); _svW.fromBufferAttribute(g.attributes.skinWeight, i);
      _svB.set(target.x, target.y, target.z, 1); target.set(0, 0, 0);
      _svB.applyMatrix4(q.bindMatrix);
      for (let k = 0; k < 4; k++) { const w = _svW.getComponent(k); if (w !== 0) { const b = _svI.getComponent(k); target.addScaledVector(_sv4.copy(_svB).applyMatrix4(L[b]), w); } }
      return target.applyMatrix4(q.bindMatrixInverse);
    }
    /* (v26.11: ONCE. A body made for one film borrows the near body's sheet (addLevel), and setting it up again asked the
       chip for a second upload of the same picture with the same settings, at the film's start. A sheet this has already
       set, whose settings are still the ones it set, is left as it is: what is on the chip is what that upload would have
       put there. `?opt=sheetOnce:0` sets it again as before) */
    const SHEETED = new WeakSet();
    function sheetOf(key, t) {
      if (t.name === 'repainted' || (t.name === 'detail' && NOMIP.test(key))) {
        if (SHEETONCE && SHEETED.has(t) && t.generateMipmaps === true && t.minFilter === THREE.LinearMipmapLinearFilter && t.anisotropy === 4) return t;
        t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.anisotropy = 4; t.needsUpdate = true; SHEETED.add(t); return t; }
      if (!NOMIP.test(key)) return t;
      if (SHEETONCE && SHEETED.has(t) && t.generateMipmaps === false && t.minFilter === THREE.LinearFilter) return t;
      SHEETED.add(t);
      return noMip(THREE, t);
    }
    /* (the children's runs and their skip too: c_crowd.js) */
    const WALKS = /^(walkdance|Run_02|Run_03|Walking)$/;                                 // (the takes that travel: the dancers' walk-dance, the children's two runs)
    /* (the full model's reach was 2.7 m until 12 Nov. Photographed at 2.55 m at both levels, on a phone's frame and a
       desktop's, magnified: no difference to be seen at that distance, and the full model is 310,000 triangles. At
       2.2 m (taken up inside 2.05, let go past 2.35, measured from the lens) it is drawn where he has walked up to
       talk, which is what it was made for: the view from his place in the line, where the woman at the bench stood
       inside the old reach, went from 832,000 triangles to 563,000. It was NOT the spawn's weight, as I first wrote:
       from the spawn Ton was already outside the old reach's own taking-up (2.51 m from the lens). That was the
       sandals behind him: c_zfx.js) */
    /* (v26.1: the near body drawn to 7 m, where it was 5.4, and the mid to 14, where it was 11.5: Chad, 12 Nov 2026, "even on
       the phone, i want a higher rendering budget". Each body's paint is laid out with margins and drawn with mipmaps
       now (sheetOf, above), and the face has three times the robe's share of each sheet: where the near body hands over,
       its face is drawn at about the mid body's own detail, so nothing pops; measured on the brown hermit, 1,091 texels a
       metre on the near face and 186 on the mid's, against a phone's 166 pixels a metre of a face at 7 m) */
    const LEVELS = [['h', 2.2], ['', 7.0], ['m', 14], ['f', Infinity]];         // each skin's suffix and how far it is drawn to
    const _pv = new THREE.Vector3(), _pq = new THREE.Quaternion(), _lens = new THREE.Vector3();
    /* the soft dark under a body (a phone draws no shadows, so a contact shadow is painted: v9.3) */
    const blobTex = (() => { const [c, x] = cnv(64); const g = x.createRadialGradient(32, 32, 2, 32, 32, 31);
      x.clearRect(0, 0, 64, 64);
      g.addColorStop(0, 'rgba(0,0,0,0.62)'); g.addColorStop(0.55, 'rgba(0,0,0,0.3)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return tex(done(THREE, c, false)); })();
    const blobGeo = new THREE.PlaneGeometry(1, 1); blobGeo.rotateX(-Math.PI / 2);        // (dispose() finds it through the world, as it finds every geometry)
    const blobMat = B({ map: blobTex, transparent: true, depthWrite: false, opacity: 0.8, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const blob = (parent, w = 0.85, d = 0.7) => { const m = new THREE.Mesh(blobGeo, blobMat); m.position.y = 0.014; m.scale.set(w, 1, d); m.renderOrder = 2; parent.add(m); return m; };

    /* A WALK THAT IS NOT A LOOP, MADE ONE (o.loops: { take: [from, to, blend] }). A written take (text-to-motion) starts
       from standing and stops in mid-stride: played round, it jumps at its end. So one whole cycle of it is cut out, from
       a heel's strike to the same heel's next (tools/probes/gait.mjs reads the strikes), where the pace has settled; the
       hips' travel over that cycle is taken out evenly (the group travels: WALKS, below), and over the last `blend`
       seconds every joint is eased onto what it was doing one cycle earlier, so the end IS the start. v5.20: what is
       missing is made from what the file has. */
    const _lqa = new THREE.Quaternion(), _lqb = new THREE.Quaternion();
    function loopOf(clip, t0, t1, blend) {
      const L = t1 - t0, N = Math.max(8, Math.round(L * 30)), times = new Float32Array(N + 1); let travel = null;
      for (let i = 0; i <= N; i++) times[i] = L * i / N;
      const tracks = clip.tracks.map(tr => { const n = tr.getValueSize(), it = tr.createInterpolant(new Float32Array(n)), isQ = /\.quaternion$/.test(tr.name), hip = /Hips\.position$/.test(tr.name);
        const at = (t) => Array.from(it.evaluate(Math.max(0, Math.min(clip.duration, t))));
        const a0 = hip ? at(t0) : null, a1 = hip ? at(t1) : null;
        if (hip) travel = [a1[0] - a0[0], a1[2] - a0[2]];
        const val = (t) => { const v = at(t); if (hip) { const k = (t - t0) / L; v[0] -= (a1[0] - a0[0]) * k; v[2] -= (a1[2] - a0[2]) * k; } return v; };
        const out = new Float32Array((N + 1) * n);
        for (let i = 0; i <= N; i++) { const a = val(t0 + times[i]), w = blend > 0 ? smo(c01((times[i] - (L - blend)) / blend)) : 0;
          if (w > 0) { const b = val(t0 + times[i] - L);
            if (isQ) { _lqa.fromArray(a).slerp(_lqb.fromArray(b), w).toArray(a); } else for (let k = 0; k < n; k++) a[k] += (b[k] - a[k]) * w; }
          out.set(a, i * n); }
        return new tr.constructor(tr.name, times, out); });
      const made = new THREE.AnimationClip(clip.name, L, tracks); made.travel = travel;
      return made;
    }
    /* THE CROSS-LEGGED SEAT (v26.18: Chad, 16 Nov 2026, the morning's meeting moved inside the main hall: "Grandmaster pho
       is seated inside the main hall, waiting for the player", its inside "exactly the same as the photos"; in his
       photographs 2 to 4 of it the master sits cross-legged on the dais, in white, his lower cloth smooth over both
       knees, his right hand over the front of his lap, his left in it). o.cross seats a body so, from what its own
       file has (v5.20), and it is asked for by one person only, the hall's Grandmaster Pho: the bench's is a person of
       his own and is exactly as he was. Every step was photographed in the pose lab before the next was built, and
       three first tries were refused by photograph (the tracker's log, docs/V26.18-E4C3-HALL.md):
       1. THE TAKES ARE MIXED (crossTakes). His own floor take cannot be drawn close: its robe below the waist is a
          slab with a torn notch (one tube of cloth cannot wrap two crossed legs: v24.47), and it leans back 23
          degrees. So his hips, his legs and the bones of his robe below the waist are HELD at one moment of it
          (K.low at K.at), and everything above comes from a bench take, as it moves. His spine is given the turn that
          keeps his trunk as the bench take has it IN THE WORLD (the two takes hold his hips 27 degrees apart), and
          then his trunk is stood upright and square: over the stretch named (t0 to t1) its own frame is read (his
          left, his spine's line, his front) and turned onto a trunk leaning `lean` degrees forward (measured: his
          bench rest leans 16.5 degrees forward, 5.5 to his left and is turned 8; his bench talk leans back 6).
       2. HIS ROBE IS ENDED IN A LEVEL HEM, K.hem over the cushion (crossHem): his robe below the waist is a skin of its
          own and is not drawn; of his main skin, his legs are not drawn, nor any triangle wholly under the hem (his
          arms aside); a low point of a triangle that crosses the hem is brought up onto it, where the pose has it,
          and set back through its own skinning (a point his robe's waist bone carried is given to his spine: the hem
          is of one piece with his trunk, and NO point of him is his hip bone's). An ARM is what an arm's bones carry
          AND stands within a hand's breadth of the arm's own line: the cloth that hangs from his left arm is carried
          by it too, and is cloth. Hidden by "any point the robe carries", icicles 8 cm long hung from him.
       3. THE CLOTH OVER HIS LEGS IS MADE (masters/v26.18/pho/lapcloth.py, in Blender, on his skin as the game poses
          it; K.lap its key): laid taut on a ring under the hem and on his legs, then let settle. Its top leans with
          his trunk: it is bound here to his spine and his hips, each point's share of his spine read off its height
          under the ring and its way out from his waist's middle (so nothing rides on an attribute a pack might
          drop). It takes his robe's own look (o.look, after this), so the two are one white.
       4. HIS HANDS REST ON THE CLOTH (crossHands), by numbers read off photograph 3: where each palm's middle lies,
          the way its fingers run, how far down the cloth's fall they may follow it, where its elbow stands.
       His hip joint rides K.hips over the cushion's top (the lowest of his legs 6 mm over it), and the person's
       group stands ON the cushion's top: put() him there with its height. */
    const CROSS_LOW = /^(mixamorig:?)?(Hips|(Left|Right)(UpLeg|Leg|Foot|Toe\w*)|(Left|Right)LegGraft\w*|Skirt\w*|Cloth\w*)\./;
    const _cxA = new THREE.Vector3(), _cxB = new THREE.Vector3();
    function crossTakes(P, animations, K) {
      const Lw = animations.find(c => c.name === K.low); if (!Lw) { console.warn(P.key + ': no take ' + K.low + ' to sit cross-legged in'); return; }
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const held = [], hipQ = new THREE.Quaternion();
      for (const t of Lw.tracks) { if (!CROSS_LOW.test(t.name)) continue; const v = Array.from(t.createInterpolant(new Float32Array(t.getValueSize())).evaluate(K.at)); held.push([t, v]); if (/Hips\.quaternion$/.test(t.name)) hipQ.fromArray(v); }
      const nk = bone('Neck'), sp = bone('Spine'), la = bone('LeftArm'), ra = bone('RightArm');
      P.group.updateWorldMatrix(true, false);
      for (const name in K.takes) { const U = animations.find(c => c.name === name), A0 = P.acts[name], F = K.takes[name];
        if (!U || !A0) { console.warn(P.key + ': no take ' + name + ' to sit cross-legged with'); continue; }
        const fix = new THREE.Quaternion();
        if (nk && sp && la && ra && P.hips && P.hips.parent) { const u = new THREE.Vector3(), s = new THREE.Vector3(), N = 9, t0 = F.t0 || 0, t1 = F.t1 != null ? F.t1 : U.duration;
          for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
          for (let i = 0; i < N; i++) { A0.time = t0 + (t1 - t0) * i / (N - 1); P.mixer.update(0); P.group.updateWorldMatrix(false, true);
            nk.getWorldPosition(_cxA); P.group.worldToLocal(_cxA); sp.getWorldPosition(_cxB); P.group.worldToLocal(_cxB); u.add(_cxA.sub(_cxB).normalize());
            la.getWorldPosition(_cxA); P.group.worldToLocal(_cxA); ra.getWorldPosition(_cxB); P.group.worldToLocal(_cxB); s.add(_cxA.sub(_cxB).normalize()); }
          A0.setEffectiveWeight(0);
          u.normalize(); s.addScaledVector(u, -s.dot(u)).normalize(); const f = new THREE.Vector3().crossVectors(s, u).normalize(), Ln = (F.lean || 0) * Math.PI / 180;
          const M0 = new THREE.Matrix4().makeBasis(s, u, f), M1 = new THREE.Matrix4().makeBasis(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, Math.cos(Ln), Math.sin(Ln)), new THREE.Vector3(0, -Math.sin(Ln), Math.cos(Ln)));
          const Rg = new THREE.Quaternion().setFromRotationMatrix(M1.multiply(M0.transpose())), aw = new THREE.Quaternion(), gw = new THREE.Quaternion();
          P.hips.parent.getWorldQuaternion(aw); P.group.getWorldQuaternion(gw); const c = aw.invert().multiply(gw); fix.copy(c).multiply(Rg).multiply(c.clone().invert()); }
        const tracks = U.tracks.filter(t => !CROSS_LOW.test(t.name)).map(t => t.clone());
        for (const [t, v] of held) tracks.push(new t.constructor(t.name, [0, U.duration], v.concat(v)));
        const hT = U.tracks.find(t => /Hips\.quaternion$/.test(t.name)), sT = tracks.find(t => /Spine\.quaternion$/.test(t.name));
        if (hT && sT) { const it = hT.createInterpolant(new Float32Array(4)), inv = hipQ.clone().invert(), a = new THREE.Quaternion(), b = new THREE.Quaternion(), vals = sT.values;
          /* (F.sway: on a bench his hips rock as he talks and all of him goes with them; cross-legged his seat is planted, and
             the whole of that rocking, given to his spine, swayed his trunk 15 degrees each way: so his hips' turn is taken
             only `sway` of the way from its middle over the take) */
          const mid = new THREE.Quaternion(), sway = F.sway != null ? F.sway : 1;
          if (sway < 1) { const acc = [0, 0, 0, 0], M = 24; for (let i = 0; i < M; i++) { a.fromArray(it.evaluate(U.duration * i / (M - 1))); if (i && a.x * acc[0] + a.y * acc[1] + a.z * acc[2] + a.w * acc[3] < 0) a.set(-a.x, -a.y, -a.z, -a.w); acc[0] += a.x; acc[1] += a.y; acc[2] += a.z; acc[3] += a.w; } mid.fromArray(acc).normalize(); }
          for (let i = 0; i < sT.times.length; i++) { a.fromArray(it.evaluate(sT.times[i])); if (sway < 1) a.copy(b.copy(mid).slerp(a, sway)); b.fromArray(vals, i * 4); a.multiply(b).premultiply(fix).premultiply(inv).normalize();
            if (i && (a.x * vals[i * 4 - 4] + a.y * vals[i * 4 - 3] + a.z * vals[i * 4 - 2] + a.w * vals[i * 4 - 1]) < 0) a.set(-a.x, -a.y, -a.z, -a.w);
            a.toArray(vals, i * 4); } }
        A0.stop(); P.mixer.uncacheAction(A0.getClip());
        const clip = new THREE.AnimationClip(name, U.duration, tracks), A = P.mixer.clipAction(clip); A.enabled = true; A.setEffectiveWeight(0); A.play(); P.acts[name] = A; P.w[name] = 0; }
    }
    /* (his hands on the cloth: `top` is the cloth's height under a point of his own frame) */
    function crossHands(P, spec, top) {
      const A = armsOf(P), R = {}, rep = {}; P.restHands = null; if (!A) return null;
      const loc = (b, out) => { b.getWorldPosition(out); return P.group.worldToLocal(out); };
      for (const [sd, sg] of [['L', 1], ['R', -1]]) { const a = A[sd], sp = spec[sd]; if (!sp) continue;
        hingeOf(a, sg);
        const d = new THREE.Vector3(Math.sin(sp.yaw), 0, Math.cos(sp.yaw)), e = 0.03, x = sp.x, z = sp.z, y = top(x, z);
        if (!(y > -1)) { console.warn(P.key + ': no cloth under his ' + sd + ' hand at ' + x + ', ' + z); continue; }
        const sl = Math.max(-(sp.slope != null ? sp.slope : 0.4), Math.min(0.2, (top(x + d.x * e, z + d.z * e) - top(x - d.x * e, z - d.z * e)) / (2 * e)));
        const gx = (top(x + 0.03, z) - top(x - 0.03, z)) / 0.06, gz = (top(x, z + 0.03) - top(x, z - 0.03)) / 0.06;
        if (!isFinite(sl) || !isFinite(gx) || !isFinite(gz)) { console.warn(P.key + ': the cloth ends under his ' + sd + ' hand'); continue; }
        const f = new THREE.Vector3(d.x, sl, d.z).normalize(), n = new THREE.Vector3(gx, -1, gz).normalize(); n.addScaledVector(f, -n.dot(f)).normalize();
        const HM = a.fingers ? null : handAxes(P, A, sd), PALM = sp.palm != null ? sp.palm : (HM ? HM.len * 0.45 : a.palm), OFF = sp.off != null ? sp.off : (HM ? Math.max(0.015, HM.depth) : 0.022);
        const Cp = new THREE.Vector3(x, y + (sp.lift || 0), z), W = Cp.clone().addScaledVector(f, -PALM).addScaledVector(n, -OFF);
        const Sh = loc(a.up, new THREE.Vector3()), lu = loc(a.fore, new THREE.Vector3()).distanceTo(Sh), lf = loc(a.hand, new THREE.Vector3()).distanceTo(loc(a.fore, new THREE.Vector3()));
        R[sd] = { W, pdir: new THREE.Vector3().fromArray(sp.pole).normalize(), f, n, fing: [] };
        if (sp.follow) { const fl = sp.follow.map(nm => P.bone[nm]).filter(b => b && b.parent === a.up.parent).map(b => ({ b, q: new THREE.Quaternion(), on: false })); if (fl.length) R[sd].fol = fl; }
        if (HM) { R[sd].fL = HM.fL; R[sd].nL = HM.nL; R[sd].aL = HM.aL; }
        rep[sd] = { palm: [x, +y.toFixed(3), z], wrist: W.toArray().map(q => +q.toFixed(3)), reach: +(W.distanceTo(Sh) / (lu + lf)).toFixed(3), slope: +sl.toFixed(2) }; }
      P.restHands = { how: 'lap', R, hold: spec.hold || null }; return rep;
    }
    /* (his robe's hem, cut in the pose he stands in now) */
    function crossHem(P, q, HEM) {
      const g = q.geometry, pos = g.attributes.position, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, idx = g.index, n = pos.count, v = new THREE.Vector3(), bones = q.skeleton.bones;
      if (!pos || !si || !sw || !idx) return null;
      const sideB = bones.map(b => /^(mixamorig:?)?Left(Arm|ForeArm|Hand)/.test(b.name) ? 1 : (/^(mixamorig:?)?Right(Arm|ForeArm|Hand)/.test(b.name) ? 2 : 0));
      const legB = bones.map(b => /(UpLeg|Leg|Foot|Toe)/.test(b.name)), robeB = bones.map(b => /^(Skirt|Cloth)/.test(b.name)), spineI = bones.findIndex(b => /^(mixamorig:?)?Spine$/.test(b.name));
      P.group.updateWorldMatrix(true, true); P.group.updateMatrixWorld(true);
      const SM = skinMats(q), toG = new THREE.Matrix4().copy(P.group.matrixWorld).invert().multiply(q.matrixWorld), A = armsOf(P), w3 = new THREE.Vector3(), w4 = new THREE.Vector3(), w5 = new THREE.Vector3();
      const line = (sd) => { const a = A && A[sd]; if (!a) return null; const pts = [a.up, a.fore, a.hand].map(b => P.group.worldToLocal(b.getWorldPosition(new THREE.Vector3()))), tip = a.hand.children.find(c => c.isBone);
        if (tip) pts.push(P.group.worldToLocal(tip.getWorldPosition(new THREE.Vector3()))); return pts; };
      const LN = [null, line('L'), line('R')], RAD = [0.085, 0.085, 0.1];
      const near = (p, pts) => { if (!pts) return true; for (let k = 0; k < pts.length - 1; k++) { const a = pts[k], ab = w3.copy(pts[k + 1]).sub(a), t = c01(ab.dot(w4.copy(p).sub(a)) / ab.lengthSq()); if (w5.copy(a).addScaledVector(ab, t).distanceTo(p) < RAD[k]) return true; } return false; };
      const V = new Float32Array(n * 3), Y = new Float32Array(n), arm = new Uint8Array(n), leg = new Uint8Array(n), robe = new Uint8Array(n), below = new Uint8Array(n);
      for (let i = 0; i < n; i++) { skinVertex(q, i, v, SM); V[i * 3] = v.x; V[i * 3 + 1] = v.y; V[i * 3 + 2] = v.z; v.applyMatrix4(toG); Y[i] = v.y; const aw = [0, 0, 0]; let lw = 0, rw = 0;
        for (let c = 0; c < 4; c++) { const j = si.getComponent(i, c), w = sw.getComponent(i, c); if (sideB[j]) aw[sideB[j]] += w; else if (legB[j]) lw += w; else if (robeB[j]) rw += w; }
        const sd = aw[1] >= aw[2] ? 1 : 2; arm[i] = aw[sd] > 0.5 && near(v, LN[sd]) ? 1 : 0; leg[i] = lw > 0.5 ? 1 : 0; robe[i] = rw > 0.5 ? 1 : 0; below[i] = !arm[i] && (leg[i] || robe[i] || Y[i] < HEM) ? 1 : 0; }
      const a = idx.array, out = new a.constructor(a.length), acc = new Float64Array(n * 5); let m = 0, cut = 0;
      for (let i = 0; i < a.length; i += 3) { const T = [a[i], a[i + 1], a[i + 2]], nb = below[T[0]] + below[T[1]] + below[T[2]];
        if (nb === 3 || (leg[T[0]] && leg[T[1]] && leg[T[2]])) continue;
        out[m++] = T[0]; out[m++] = T[1]; out[m++] = T[2]; if (!nb) continue; cut++;
        for (const p of T) if (below[p]) for (const u of T) if (!below[u] && Y[u] >= HEM) { acc[p * 5] += V[u * 3]; acc[p * 5 + 1] += V[u * 3 + 1]; acc[p * 5 + 2] += V[u * 3 + 2]; acc[p * 5 + 3] += Y[u]; acc[p * 5 + 4] += 1; } }
      /* (a triangle with a low point that nothing it keeps can bring up is not drawn either: the cloth that ran from his sleeve to his robe below the waist) */
      let m2 = 0, dropped = 0; for (let i = 0; i < m; i += 3) { const T0 = out[i], T1 = out[i + 1], T2 = out[i + 2];
        if ((below[T0] && !acc[T0 * 5 + 4]) || (below[T1] && !acc[T1 * 5 + 4]) || (below[T2] && !acc[T2 * 5 + 4])) { dropped++; continue; } out[m2++] = T0; out[m2++] = T1; out[m2++] = T2; }
      const copyOf = (at) => { const c2 = new THREE.BufferAttribute(new at.array.constructor(n * at.itemSize), at.itemSize, at.normalized); for (let i = 0; i < n; i++) for (let k = 0; k < at.itemSize; k++) c2.setComponent(i, k, at.getComponent(i, k)); return c2; };
      const p2 = copyOf(pos), si2 = copyOf(si), sw2 = copyOf(sw), Mq = new THREE.Matrix4(), Mb = new THREE.Matrix4(), e = new Float64Array(16); let moved = 0, given = 0;
      for (let p = 0; p < n; p++) { const c = acc[p * 5 + 4]; if (!c) continue; const my = acc[p * 5 + 3] / c, k = c01((HEM - Y[p]) / Math.max(1e-6, my - Y[p]));
        v.set(V[p * 3] + (acc[p * 5] / c - V[p * 3]) * k, V[p * 3 + 1] + (acc[p * 5 + 1] / c - V[p * 3 + 1]) * k, V[p * 3 + 2] + (acc[p * 5 + 2] / c - V[p * 3 + 2]) * k);
        e.fill(0);
        if (robe[p] && spineI >= 0) { const E0 = SM[spineI].elements; for (let x = 0; x < 16; x++) e[x] = E0[x]; si2.setXYZW(p, spineI, 0, 0, 0); sw2.setXYZW(p, 1, 0, 0, 0); given++; }
        else for (let c2 = 0; c2 < 4; c2++) { const w = sw.getComponent(p, c2); if (!w) continue; const E0 = SM[si.getComponent(p, c2)].elements; for (let x = 0; x < 16; x++) e[x] += E0[x] * w; }
        Mb.fromArray(e); Mq.copy(q.bindMatrixInverse).multiply(Mb).multiply(q.bindMatrix).invert(); v.applyMatrix4(Mq); p2.setXYZ(p, v.x, v.y, v.z); moved++; }
      const g2 = new THREE.BufferGeometry(); for (const k in g.attributes) g2.setAttribute(k, k === 'position' ? p2 : (k === 'skinIndex' ? si2 : (k === 'skinWeight' ? sw2 : g.attributes[k])));
      g2.setIndex(new THREE.BufferAttribute(out.slice(0, m2), 1)); g2.boundingSphere = g.boundingSphere; g2.boundingBox = g.boundingBox; q.geometry = g2;
      return { drawn: m2 / 3, of: a.length / 3, crossing: cut, moved, given, dropped };
    }
    function crossDress(P, K, lap) {
      const skins = P.lv[1], bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const spine = bone('Spine'), rest = K.ref[0]; if (!skins || !spine || !P.hips || !P.acts[rest]) { console.warn(P.key + ': cannot be seated cross-legged (no skin, spine, hips or rest)'); return; }
      const rep = P.crossRep = {};
      /* (his rest, as he will sit in it) */
      for (const k in P.acts) { P.w[k] = k === rest ? 1 : 0; P.acts[k].setEffectiveWeight(P.w[k]); }
      P.acts[rest].time = K.ref[1]; personSettle(P); P.mixer.update(0); P.group.updateWorldMatrix(true, true); P.group.updateMatrixWorld(true);
      const robe = skins.find(q => /\(both sides\)$/.test([].concat(q.material)[0].name)), main = skins.find(q => !/\)$/.test([].concat(q.material)[0].name));
      if (robe) { if (robe.parent) robe.parent.remove(robe); skins.splice(skins.indexOf(robe), 1); }
      /* (the cloth: its points in his own frame, in metres, whatever the pack did to the file's numbers) */
      let top = () => -Infinity;
      /* (HIS BEADS: Chad, 16 Nov 2026, of this seat: "The beads get cut off". His two black strands close in a V on his
         robe below the waist, which is not drawn here: so the cloth's file carries them on again from the hem, his own
         beads laid over the cloth in a hanging loop (masters/v26.18/pho/beadtail.py: a mesh named 'beads', its points
         in his own frame, its coordinates his body sheet's). It is drawn with his body's own material and bound as the
         cloth is; a hand rests on the cloth, so the beads are not part of `top`.) */
      if (lap) { let src = null, beads = null; lap.scene.updateMatrixWorld(true);
        lap.scene.traverse(q => { if (!q.isMesh) return; if (/beads/i.test(q.name) || (q.parent && /beads/i.test(q.parent.name))) beads = beads || q; else src = src || q; });
        const C = 0.015, cells = new Map(), gI = new THREE.Matrix4().copy(P.group.matrixWorld).invert(), inv = [spine, P.hips].map(b => new THREE.Matrix4().multiplyMatrices(gI, b.matrixWorld).invert());
        for (const [from, material, name] of [[src, src && src.material, 'lap'], [beads, main && [].concat(main.material)[0], 'beads']]) { if (!from || !material || (name === 'beads' && !P.lap)) continue;
          const g0 = from.geometry, p0 = g0.attributes.position, n0 = g0.attributes.normal, n = p0.count, pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), si = new Uint8Array(n * 4), sw = new Float32Array(n * 4);
          const v = new THREE.Vector3(), nm = new THREE.Matrix3().getNormalMatrix(from.matrixWorld);
          for (let i = 0; i < n; i++) { v.fromBufferAttribute(p0, i).applyMatrix4(from.matrixWorld); pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z;
            if (name === 'lap') { const ck = Math.round(v.x / C) * 4096 + Math.round(v.z / C), cy = cells.get(ck); if (cy === undefined || v.y > cy) cells.set(ck, v.y); }
            const w = smo(c01((v.y - (K.ringY - K.reach)) / K.reach)) * (1 - smo(c01((Math.hypot(v.x - K.middle[0], v.z - K.middle[1]) - 0.2) / 0.1)));
            si[i * 4 + 1] = 1; sw[i * 4] = w; sw[i * 4 + 1] = 1 - w;
            if (n0) { v.fromBufferAttribute(n0, i).applyMatrix3(nm).normalize(); nor[i * 3] = v.x; nor[i * 3 + 1] = v.y; nor[i * 3 + 2] = v.z; } }
          const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); if (n0) g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
          if (g0.attributes.uv) g.setAttribute('uv', g0.attributes.uv); g.setIndex(g0.index); g.setAttribute('skinIndex', new THREE.BufferAttribute(si, 4)); g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4));
          if (!n0) g.computeVertexNormals();
          const mesh = new THREE.SkinnedMesh(g, material); mesh.castShadow = false; mesh.receiveShadow = false; mesh.frustumCulled = false; mesh.name = name;
          P.model.add(mesh); mesh.bind(new THREE.Skeleton([spine, P.hips], inv.map(m4 => m4.clone())), new THREE.Matrix4()); skins.push(mesh); P[name] = mesh;
          rep[name] = { points: n, triangles: g0.index ? g0.index.count / 3 : n / 3 }; }
        if (P.lap) top = (x, z) => { const a = Math.round(x / C), b = Math.round(z / C); let best = -Infinity; for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) { const y = cells.get((a + dx) * 4096 + (b + dz)); if (y !== undefined && y > best) best = y; } return best; }; }
      else console.warn(P.key + ': the cloth over his legs has not landed: he is drawn without it');
      P.crossTop = top;
      if (K.hands && P.lap) { rep.hands = crossHands(P, K.hands, top); if (P.restHands) restHandsLay(P); P.group.updateWorldMatrix(true, true); }
      if (main && K.hem != null) rep.hem = crossHem(P, main, K.hem);
      armsBack(P); P.cross = K;
    }
    function mkPerson(key, x, z, ry, o = {}) {
      const P = { key, o, group: new THREE.Group(), ready: false, acts: {}, w: {}, off: {}, offY: {}, cur: o.take || 'Idle_3', fade: 0.4, win: o.win || null,
                  mixer: null, model: null, head: null, hips: null, bone: {}, lv: [null, null, null, null], lvNow: -1, force: null, members: [],
                  hidden: !!o.hidden, driver: !!o.driver, filmT: null, rate: o.rate || 1, phase: o.phase || 0, clock: (o.phase || 0) * 10, then: [],
                  span: null, gaze: null, gazeK: 0, rest: { take: o.take || 'Idle_3', win: o.win ? Object.assign({}, o.win) : null }, talkTake: o.talk || null, actN: 0 };
      P.group.position.set(x, o.y || 0, z); P.group.rotation.y = ry; P.group.visible = false; (o.parent || world).add(P.group);
      people.push(P);
      if (!have(key)) { waiting.add(key); return P; }
      if (o.cross && o.cross.lap && !have(o.cross.lap)) waiting.add(o.cross.lap);
      (o.cross && o.cross.lap && have(o.cross.lap) ? Promise.all([parseOnce(key), parseOnce(o.cross.lap)]).then(([body, lap]) => { P.lapSrc = lap; return body; }) : parseOnce(key)).then(({ scene: src, animations }) => {
        if (!alive) return;
        const m = cloneSkinned(src), skins = [];
        m.traverse(q => {
          if (q.isSkinnedMesh) { q.castShadow = false; q.receiveShadow = false; q.frustumCulled = false; skins.push(q); }
          if (q.isBone) { P.bone[q.name] = q; lazyRot(q); if (/^(mixamorig:?)?Head$/.test(q.name)) P.head = q; if (/^(mixamorig:?)?Hips$/.test(q.name)) P.hips = q; }
        });
        if (o.s) m.scale.multiplyScalar(o.s);
        for (const q of skins) for (const mm of [].concat(q.material)) if (mm && mm.map) sheetOf(key, mm.map);
        P.group.add(m); P.model = m; P.lv[1] = skins;
        P.mixer = new THREE.AnimationMixer(m);
        for (const clip0 of animations) {
          let clip = clip0;
          if (o.loops && o.loops[clip0.name]) clip = loopOf(clip0, o.loops[clip0.name][0], o.loops[clip0.name][1], o.loops[clip0.name][2]);
          /* a walk is walked ON THE SPOT here: the group is what travels (so a path is a path), and the take's own
             travel over the ground is taken out of its hips (their sway and their rise kept) */
          if (WALKS.test(clip.name)) { if (clip === clip0) clip = clip0.clone(); const tr0 = clip.tracks.find(t => /Hips\.position$/.test(t.name));
            if (tr0) { const v = tr0.values, n = v.length / 3, x0 = v[0], z0 = v[2], x1 = v[(n - 1) * 3], z1 = v[(n - 1) * 3 + 2];
              for (let i = 0; i < n; i++) { const k = n > 1 ? i / (n - 1) : 0; v[i * 3] -= (x1 - x0) * k; v[i * 3 + 2] -= (z1 - z0) * k; }
              /* (what was taken out, over the take's length, in the hips' own frame: a loop cut from a longer take has
                 handed on its share. A take that really travels is paced by this, exactly: `pace`, below) */
              (P.travel = P.travel || {})[clip.name] = [(clip.travel ? clip.travel[0] : 0) + (x1 - x0), (clip.travel ? clip.travel[1] : 0) + (z1 - z0)]; } }
          const a = P.mixer.clipAction(clip); a.enabled = true; a.setEffectiveWeight(0); a.play(); P.acts[clip.name] = a; P.w[clip.name] = 0;
        }
        /* A TAKE MADE FROM TWO (o.mix: [[name, upper, lower, at]]): the upper body of one take on the legs of another, held
           at one of its moments. Two of the written takes are right above the waist and wrong below it (the arms rising
           wide of photograph 12 kneel with the shins in the air: the tracker's §5), and a body's own grounded kneel is
           already in its file (v5.20: what is missing is made from what the file has). Hips and legs from `lower` at
           `at` seconds, held; everything above from `upper`, as it moves */
        if (o.mix) for (const [name, up, low, at] of o.mix) { const U = animations.find(c => c.name === up), L = animations.find(c => c.name === low);
          if (!U || !L) { console.warn(key + ': no take to mix ' + name + ' from (' + up + ', ' + low + ')'); continue; }
          const LOWER = /^(Hips|(Left|Right)(UpLeg|Leg|Foot|Toe\w*))\./, tracks = U.tracks.filter(t => !LOWER.test(t.name)).map(t => t.clone());
          for (const t of L.tracks) { if (!LOWER.test(t.name)) continue; const n = t.getValueSize(), T = t.times; let i = 0; while (i < T.length - 1 && T[i + 1] <= (at || 0)) i++;
            const v = Array.from(t.values.slice(i * n, i * n + n)); tracks.push(new t.constructor(t.name, [0, U.duration], v.concat(v))); }
          const clip = new THREE.AnimationClip(name, U.duration, tracks), a = P.mixer.clipAction(clip); a.enabled = true; a.setEffectiveWeight(0); a.play(); P.acts[name] = a; P.w[name] = 0; }
        if (o.cross) crossTakes(P, animations, o.cross);
        /* where each take holds the hips at its first moment (or at its window's start), from the person's own spot */
        if (P.hips) { const base = {};
          for (const name in P.acts) { for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
            P.acts[name].time = P.win && P.win[name] ? P.win[name][0] : 0; P.mixer.update(0); P.group.updateWorldMatrix(true, true);
            P.hips.getWorldPosition(_pv); P.group.worldToLocal(_pv); base[name] = [_pv.x, _pv.z, _pv.y]; }
          const ref = o.centre ? [0, 0] : (base[o.ref || 'Idle_3'] || [0, 0]);    // centre: the hips themselves on the spot (a sitter on his seat)
          for (const name in base) P.off[name] = (o.keepOff && o.keepOff.test(name)) ? [0, 0] : [base[name][0] - ref[0], base[name][1] - ref[1]];
          /* A SITTER'S SEAT (o.seat: { y: the seat's top, over: how far the hips ride above it, takes: which takes sit }):
             every sitting take holds the hips at its own height (measured: Grandmaster Pho's talk sits 3 cm lower than
             his rest), so each is brought to the one height the seat asks for, and changing take never lifts him off
             it or sinks him through it (v16.8) */
          if (o.seat) for (const name in base) if (!o.seat.takes || o.seat.takes.test(name)) P.offY[name] = base[name][2] - (o.seat.y + (o.seat.over != null ? o.seat.over : 0.1)); }
        /* SEATED BY HIS OWN BODY (Chad, 12 Nov 2026, of the monks: "their body is clipping through the seats"; v16.8: a
           sitter is seated on his posed skin). A hip joint held a fixed way over a seat seats nobody: where a rig's hip
           joints ride in its body is the rig's own (Chad's monk's sit 17 cm over his knees in every seated take he
           has, Grandmaster Pho's 6: tools/probes/sitread.mjs), and so is how long its legs are. The three monks sat
           with their hips at the middle of a chair 0.93 m deep, their shins coming down through its seat and their
           soles a hand's length under the ground. Two ways, each read from the take posed at its window's start:
           o.seat.legs ({ edge, r, apron, sole }): a man on a CHAIR. He is set down by his SOLES (the lowest of what
             rides his feet stands `sole` from the ground: a seated man's feet reach the floor, whatever the seat),
             and brought forward until his SHINS (knee joint to ankle joint, read at the seat's top and at the foot of
             its apron) stand a calf's half-thickness `r` past the seat's front face, `edge` ahead of his spot. What
             is drawn of a robe below his thighs lies in the seat, as cloth does.
           o.seat.floor ({ sink }): a man sitting CROSS-LEGGED on a seat's top, in a take made for the floor: the
             lowest of all his skin (its second hundredth: the crossed ankles go under, as episode 3's cushion has
             them) is set `sink` into the seat's top.
           (updateMatrixWorld, not updateWorldMatrix: only the former is a skinned mesh's own, and it is there that
           the matrix a posed point is brought back through is made again. Without it every point came back in the
           world's frame and was moved by the group once more: a first build of this seated the monks metres from their
           chairs, caught by the boot check's printed numbers) */
        if (P.hips && o.seat && (o.seat.legs || o.seat.floor || o.seat.down) && skins[0] && skins[0].skeleton) for (const name in P.acts) { if (o.seat.takes && !o.seat.takes.test(name)) continue;
          for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
          P.acts[name].time = P.win && P.win[name] ? P.win[name][0] : 0; P.mixer.update(0); P.model.position.set(0, 0, 0); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true);
          const ys = [], feet = [];
          for (const q of skins) { const pos = q.geometry.attributes.position, si = q.geometry.attributes.skinIndex, sw = q.geometry.attributes.skinWeight; if (!pos || !si || !sw || !q.skeleton) continue;
            const foot = q.skeleton.bones.map(b => /^(mixamorig:?)?(Left|Right)(Foot|Toe\w*)$/.test(b.name));
            const SM = FASTSKIN ? skinMats(q) : null;
            for (let i = 0; i < pos.count; i++) { if (SM) skinVertex(q, i, _pv, SM); else q.getVertexPosition(i, _pv); _pv.applyMatrix4(q.matrixWorld); P.group.worldToLocal(_pv); ys.push(_pv.y);
              let fw = 0; for (let c = 0; c < 4; c++) if (foot[si.getComponent(i, c)]) fw += sw.getComponent(i, c); if (fw >= 0.5) feet.push(_pv.y); } }
          if (ys.length < 30) { console.warn(key + ': too little skin to seat him by'); continue; }
          /* (his spot in the model's own frame: what `centre` or `ref` set for this take) */
          const oz = P.off[name] ? P.off[name][1] : 0, rec = {}; let lift = 0, fwd = 0;
          if (o.seat.floor) { ys.sort((u, v2) => u - v2); const low = ys[Math.floor(ys.length * 0.02)]; lift = (o.seat.y - (o.seat.floor.sink != null ? o.seat.floor.sink : 0.01)) - low; rec.low = +low.toFixed(3); }
          else if (o.seat.down) { const keepLegs = P.restLegs, r = seatDown(P, name, o.seat, skins); if (!r) { P.restLegs = keepLegs; continue; }
            P.restLegs = keepLegs && name !== (o.take || 'Idle_3') ? keepLegs : r.legs; P.offY[name] = -r.lift; P.off[name] = [P.off[name] ? P.off[name][0] : 0, oz - r.fwd];
            (P.seated = P.seated || {})[name] = r.rep; continue; }
          else { const K = o.seat.legs, bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
            if (!feet.length) { console.warn(key + ': nothing rides his feet to set him down by'); continue; }
            let sole = Infinity; for (const y of feet) if (y < sole) sole = y;
            lift = (K.sole != null ? K.sole : -0.005) - sole;
            let back = Infinity, thigh = Infinity;
            for (const sd of ['Left', 'Right']) { const kn = bone(sd + 'Leg'), an = bone(sd + 'Foot'); if (!kn || !an) continue;
              kn.getWorldPosition(_pv); P.group.worldToLocal(_pv); const ky = _pv.y + lift, kz = _pv.z - oz;
              an.getWorldPosition(_pv); P.group.worldToLocal(_pv); const ay = _pv.y + lift, az = _pv.z - oz;
              P.hips.getWorldPosition(_pv); P.group.worldToLocal(_pv); thigh = Math.min(thigh, (ky + _pv.y + lift) / 2 - o.seat.y);
              for (const h of [o.seat.y, o.seat.y - (K.apron != null ? K.apron : 0.14)]) { const t = ky > ay ? Math.max(0, Math.min(1, (ky - h) / (ky - ay))) : 0; back = Math.min(back, kz + t * (az - kz)); } }
            if (!(back < Infinity)) { console.warn(key + ': no knees and ankles to seat him by'); continue; }
            fwd = Math.max(0, K.edge + (K.r != null ? K.r : 0.055) - back);
            rec.sole = +sole.toFixed(3); rec.back = +back.toFixed(3); rec.thigh = +thigh.toFixed(3);
            /* (a thigh's own half-thickness is some 8 cm: an axis nearer the seat than 4 is a body in the wood) */
            if (thigh < 0.04) console.warn(key + ': set down by his soles, his thighs lie in the seat (their axis ' + (thigh * 100).toFixed(0) + ' cm over it): this seat is too high for this take'); }
          if (!(Math.abs(lift) < 0.8) || fwd > 0.45) { console.warn(key + ': the seat read from his body is not a seat (up ' + lift.toFixed(2) + ' m, forward ' + fwd.toFixed(2) + ' m): left on his hips'); continue; }
          P.offY[name] = -lift; P.off[name] = [P.off[name] ? P.off[name][0] : 0, oz - fwd];
          rec.lift = +lift.toFixed(3); rec.fwd = +fwd.toFixed(3); (P.seated = P.seated || {})[name] = rec; }
        /* FEET ON THE GROUND (Chad, 13 Nov 2026: "You didn't notice many masters have their feet sunk clipping into the
           ground?"). A take holds a body at its own height, and a take made on another body (the library's, a written
           one) keeps that body's hips: on legs of another length the soles go under the ground. Measured by
           tools/probes/feetscan.mjs at the morning's start: 57 of 67 people had a foot more than a centimetre under
           the turf, the standing cast 3 to 6 cm, the crowd to 6. So every take that does not sit is set down by the
           body's own lowest contact over the part of it that is played (its window, or the whole take): a STANDING
           take by its soles (what rides the feet), a LOW one (a kneel, a bow to the ground: the hips at under 0.75 of
           their standing height, so a man kneeling upright counts) by the lowest of all its skin. It is set GROUND_SOLE into the ground under the
           person's spot (a body sinks a little into what it rests on, v9.3). This is the measure SINK and the dancers'
           o.sink took by hand, each once on one body, and it replaces them where it is made (groundTakes, below) */
        if (P.hips && o.seat && o.seat.rise && skins[0] && skins[0].skeleton) riseCurve(P, o.seat.rise, skins);
        if (P.hips && skins[0] && skins[0].skeleton) groundTakes(P, skins);
        if (o.headDamp) headDampInit(P);
        if (o.shoulders !== null) shouldersInit(P);
        if (o.upright) uprightInit(P);
        if (o.armRest) armRestInit(P);
        if (o.knees) kneesInit(P);
        if (o.armOut) armOutInit(P);
        /* THE GROUND A WALK OR A RUN COVERS IN A SECOND (o.pace: asked for by whoever moves the group, who drives the take's
           rate from the ground covered: v7.1). The library's walks and runs come on the spot (their hips travel nowhere:
           measured, a few millimetres a second), so the pace is read from the foot that is down: under a body that stays
           where it is, a planted foot goes back at the pace the body would go forward. Each foot at thirty-two moments of
           the take, in the person's own frame; a foot is down while it is within 3.5 cm of the lowest either reaches.
           A TAKE THAT TRAVELS (the dancers' written walk: nine tenths of a metre in the two seconds kept of it) is not read that way: its pace is the
           travel taken out of its hips over its length, exactly, and `heading` the way that travel went from the body's
           own front (this walk goes 21 degrees to her left). Moved at that pace along that line, the hips do over the
           ground just what the take had them do, and a planted foot stays where it was planted. Read from the foot
           that is down, this slow walk gave half its pace (0.21 m a second for 0.46: the foot is flat while the body
           waits over it, and the body's advance comes as the heel lifts), and the file crossed with every foot
           sliding back a hand's length a step: measured in the game on 12 Nov, a planted foot 17 cm in one stance */
        if (o.pace) { const LF = P.bone.LeftFoot || P.bone['mixamorig:LeftFoot'], RF = P.bone.RightFoot || P.bone['mixamorig:RightFoot'];
          if (LF && RF) for (const name in P.acts) { if (!WALKS.test(name)) continue;
            const A = P.acts[name], d = A.getClip().duration, N = 32, F = [[], []];
            const tv = P.travel && P.travel[name];
            if (tv && P.hips && P.hips.parent) { const par = P.hips.parent; P.group.updateWorldMatrix(true, true);
              _pv.set(tv[0], 0, tv[1]); par.localToWorld(_pv); P.group.worldToLocal(_pv); const ax = _pv.x, az = _pv.z;
              _pv.set(0, 0, 0); par.localToWorld(_pv); P.group.worldToLocal(_pv);
              const dx = ax - _pv.x, dz = az - _pv.z, sp = Math.hypot(dx, dz) / d;
              if (sp > 0.05) { (P.pace = P.pace || {})[name] = sp; (P.heading = P.heading || {})[name] = Math.atan2(dx, dz); continue; } }
            for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
            for (let i = 0; i <= N; i++) { A.time = Math.min(d - 1e-4, d * i / N); P.mixer.update(0); P.group.updateWorldMatrix(true, true);
              [LF, RF].forEach((b, j) => { b.getWorldPosition(_pv); P.group.worldToLocal(_pv); F[j].push([_pv.y, _pv.z]); }); }
            let lo = Infinity; for (const f of F) for (const q of f) lo = Math.min(lo, q[0]);
            let back = 0, n = 0; for (const f of F) for (let i = 0; i < N; i++) if (f[i][0] < lo + 0.035 && f[i + 1][0] < lo + 0.035) { back += f[i][1] - f[i + 1][1]; n++; }
            if (n > 2 && back > 0) (P.pace = P.pace || {})[name] = back / (n * d / N); } }
        if (!P.acts[P.cur]) { console.warn(key + ' has no take ' + P.cur + ' (it has: ' + Object.keys(P.acts).join(', ') + ')'); P.cur = Object.keys(P.acts)[0]; }
        for (const k in P.acts) { P.w[k] = k === P.cur ? 1 : 0; P.acts[k].setEffectiveWeight(P.w[k]); P.acts[k].time = (P.phase * P.acts[k].getClip().duration) % P.acts[k].getClip().duration; }
        /* (for a look: which way the face looks, from the head's BIND turn, never from the bone's own axes: v6.8. Every
           body here is prepped with its face along +z in its bind pose, so the head's turn since its bind, applied to
           +z, is the face's direction now) */
        if (P.head && skins[0] && skins[0].skeleton) { const sk = skins[0].skeleton, bi = sk.bones.indexOf(P.head);
          if (bi >= 0) { const bm = new THREE.Matrix4().copy(sk.boneInverses[bi]).invert().premultiply(skins[0].bindMatrix);
            P.headRest = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(bm)).invert(); } }
        P.ready = true; P.group.visible = !P.hidden && !P.driver;
        if (!P.driver && !o.noBlob) P.blob = blob(P.group, o.blobW || 0.85, o.blobD || 0.7);
        personSettle(P); windowTime(P); P.mixer.update(0);
        if (o.cross) { crossDress(P, o.cross, P.lapSrc || null); personSettle(P); windowTime(P); P.mixer.update(0); }
        if (o.handsOn) restHands(P, o.handsOn);
        if (ctx.cullBySphere && !P.driver) ctx.cullBySphere(P.group, 0, 0.9, 0, 1.9);
        for (const M0 of P.members) memberSkin(M0, 1);
        if (o.look) o.look(m);
        if (o.skins !== false) for (const i of [0, 2, 3]) if (i || (!P.driver && !o.fullFilm)) addLevel(P, i);
        if (o.fullFilm && have(P.key + LEVELS[0][0])) parseOnce(P.key + LEVELS[0][0]).catch(() => {});
        const L = P.then; P.then = []; for (const f of L) f(P);
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
      return P;
    }
    /* one more skin of a person, bound to the bones the near body already has */
    function addLevel(P, i) {
      const named = P.o.skins && P.o.skins[i], key = named || (P.o.skins ? null : P.key + LEVELS[i][0]);
      if (!key) return;
      if (!have(key)) { if (i !== 0 || named) waiting.add(key); return; }
      parseOnce(key).then(({ scene: src }) => {
        if (!alive || !P.model) return;
        const made = [];
        src.traverse(sm => { if (!sm.isSkinnedMesh) return;
          const bones = sm.skeleton.bones.map(b => P.bone[b.name]);
          if (bones.some(b => !b)) { console.warn(key + ': a bone of it is not on ' + P.key); return; }
          let mat = sm.material;
          if (!mat.map) { let near = null; for (const q of P.lv[1]) for (const nm of [].concat(q.material)) if (nm.name === mat.name) near = nm; if (near) mat = near; }
          if (mat.map) sheetOf(P.key, mat.map);
          const mesh = new THREE.SkinnedMesh(sm.geometry, mat);
          mesh.castShadow = false; mesh.receiveShadow = false; mesh.frustumCulled = false; mesh.visible = false;
          P.model.add(mesh); mesh.bind(new THREE.Skeleton(bones, sm.skeleton.boneInverses), sm.bindMatrix); made.push(mesh); });
        if (!made.length) return;
        P.lv[i] = made; P.lvNow = -1;
        if (ctx.cullBySphere && !P.driver) ctx.cullBySphere(P.group, 0, 0.9, 0, 1.9);
        for (const M0 of P.members) memberSkin(M0, i);
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
    }
    /* (v26.8, Chad, 13 Nov 2026, of the woman raising her bai sri to the brown hermit, with my picture of it: "look at how
       bad and blocky the arms look , are these the full res models?"; they were not, and his answer to the two who go up:
       "Yes, full models", for those close film shots only) A FULL BODY FOR ONE FILM (o.fullFilm): read with the chapter, so
       nothing is decoded while the world is on screen, but laid on the bones only when the film that brings it close
       begins, and given back when it ends (its buffers and its own sheets out of the phone's graphics memory: about 50 MB
       each, v26.5's measure). The film first shows it after a black (the festival's second half begins under the cut's
       black), so its upload is never on screen. A sheet the full body borrows from the near one is not given back */
    function fullOn(P) { if (P && P.o.fullFilm && !P.lv[0]) whenReady(P, () => { if (!P.lv[0]) addLevel(P, 0); }); }
    /* (v26.11: AND NOTHING ANOTHER BODY DRAWS. A full body is read once a file and shared (parseOnce), so the film's two
       share their shapes and sheets with whoever else wears the same body at full detail all chapter (a man of the
       waiting line wears the second one's, e4devc): given back as the film ended, they were taken off the chip under him
       too, and put back on it, on screen, the next time the player walked up to him. What any other body draws, at any
       level, is kept now, as the near body's own always was; what is this body's alone is given back as before. Nothing
       drawn changes. `?opt=keepShared:0` gives everything back as before) */
    function fullOff(P) {
      if (!P || !P.o.fullFilm || !P.lv[0]) return;
      const near = new Set(); for (const q of P.lv[1] || []) for (const mt of [].concat(q.material)) near.add(mt);
      const keep = new Set();
      if (KEEPSHARED) for (const Q of people) if (Q !== P) for (const L of Q.lv) if (L) for (const q of L) {
        keep.add(q.geometry); for (const mt of [].concat(q.material)) { keep.add(mt); for (const k in mt) { const v = mt[k]; if (v && v.isTexture) keep.add(v); } } }
      for (const m of P.lv[0]) { P.model.remove(m); if (!keep.has(m.geometry)) m.geometry.dispose();
        for (const mt of [].concat(m.material)) if (!near.has(mt) && !keep.has(mt)) for (const k in mt) { const v = mt[k]; if (v && v.isTexture && !keep.has(v)) v.dispose(); } }
      P.lv[0] = null; P.lvNow = -1;
      /* (and the cull's list of the body's meshes read again without them: v26.8, the engine gives a re-registered
         body its own masks back first) */
      if (ctx.cullBySphere && !P.driver) ctx.cullBySphere(P.group, 0, 0.9, 0, 1.9);
    }
    const whenReady = (P, fn) => { if (!P) return; if (P.ready) fn(P); else P.then.push(fn); };
    /* the model slid so the body stands on the person's spot whatever its takes' own offsets, by their weights */
    /* (and set down: two written takes hold the whole body a few centimetres over the ground, measured on a devotee) */
    const SINK = { prostrate: 0.046, offer: 0.049 };
    /* FEET ON THE GROUND, read (mkPerson, above). For each take a body has that does not sit: the lowest of what touches
       the ground over the part of it that is played, and the height that sets that GROUND_SOLE under the person's spot
       (P.offY, with P.grounded saying it was read; P.groundRep keeps what was read, for a probe: feet, all, hips as a
       share of their standing height, low, off). The skin is read where it stands furthest out: of each bone's share of
       it, the points furthest along 64 ways (the feet's) or 14 (the rest's), because the lowest point of a posed body is
       one of its outermost, so a body is read at a thousand points and not at its tens of thousands, each exactly posed
       (getVertexPosition), at GROUND_N moments of a window or GROUND_NW of a whole take. Bodies of one file wearing a
       take in one window share a reading (groundMemo): a crowd of drivers costs it once */
    const GROUND_SOLE = -0.003, GROUND_N = 8, GROUND_NW = 12, GROUND_LOW = 0.75, groundMemo = new Map(), groundPts = new Map();
    const _grV = new THREE.Vector3(), _grI = new THREE.Matrix4(), _grM = new THREE.Matrix4();
    function sphereDirs(n) { const out = [], g = Math.PI * (3 - Math.sqrt(5)); for (let i = 0; i < n; i++) { const y = 1 - 2 * (i + 0.5) / n, r = Math.sqrt(1 - y * y), a = g * i; out.push([Math.cos(a) * r, y, Math.sin(a) * r]); } return out; }
    const DIRS_FOOT = sphereDirs(64), DIRS_BODY = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].concat([-1, 1].flatMap(x => [-1, 1].flatMap(y => [-1, 1].map(z => [x / Math.sqrt(3), y / Math.sqrt(3), z / Math.sqrt(3)]))));
    function groundPoints(P, skins) {
      if (groundPts.has(P.key)) return groundPts.get(P.key);
      /* (each point is kept as WHICH skin and which of its vertices, never the skin itself: every person of one file shares
         this list, and read through the first one's mesh, a crowd's driver was read in somebody else's pose: v26.2) */
      const out = { foot: [], body: [] };
      for (let si0 = 0; si0 < skins.length; si0++) { const q = skins[si0], pos = q.geometry.attributes.position, si = q.geometry.attributes.skinIndex, sw = q.geometry.attributes.skinWeight; if (!pos || !si || !sw || !q.skeleton) continue;
        const foot = q.skeleton.bones.map(b => /^(mixamorig:?)?(Left|Right)(Foot|Toe\w*)$/.test(b.name)), best = new Map();
        for (let i = 0; i < pos.count; i++) { let bj = -1, bw = -1, fw = 0;
          for (let c = 0; c < 4; c++) { const w = sw.getComponent(i, c), j = si.getComponent(i, c); if (w > bw) { bw = w; bj = j; } if (foot[j]) fw += w; }
          const isF = fw >= 0.5, key2 = bj * 2 + (isF ? 1 : 0), D = isF ? DIRS_FOOT : DIRS_BODY;
          let B = best.get(key2); if (!B) best.set(key2, B = { f: isF, v: new Float64Array(D.length).fill(-Infinity), i: new Int32Array(D.length).fill(-1) });
          const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
          for (let d = 0; d < D.length; d++) { const u = x * D[d][0] + y * D[d][1] + z * D[d][2]; if (u > B.v[d]) { B.v[d] = u; B.i[d] = i; } } }
        for (const B of best.values()) { const seen = new Set(); for (const i of B.i) if (i >= 0 && !seen.has(i)) { seen.add(i); (B.f ? out.foot : out.body).push([si0, i]); } } }
      groundPts.set(P.key, out); return out;
    }
    function groundTakes(P, skins) {
      const o = P.o, seatT = (nm) => !!o.seat && (!o.seat.takes || o.seat.takes.test(nm));
      const sk = skins[0].skeleton, hi = sk.bones.indexOf(P.hips); if (hi < 0) return;
      P.model.position.set(0, 0, 0);
      const poseAt = (A, t) => { A.time = t; P.mixer.update(0); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true); _grI.copy(P.group.matrixWorld).invert(); };
      const only = (name) => { for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0); };
      const momentsOf = (name) => { const A = P.acts[name], d = A.getClip().duration, W = P.win && P.win[name], N = W ? GROUND_N : GROUND_NW, ts = [];
        for (let i = 0; i < N; i++) ts.push(W ? ((W[0] + W[1] * i / (N - 1)) % d + d) % d : Math.min(d - 1e-3, d * i / (N - 1)));
        return ts; };
      /* (the hips' standing height: the highest they stand in any of this body's takes that do not sit. Read from the
         bind pose it came out at 2 to 15 cm on these files, and every take was left as it was: v26.2's first build) */
      let standH = groundPts.has(P.key + '|H') ? groundPts.get(P.key + '|H') : -Infinity;
      if (!(standH > -Infinity)) { for (const name in P.acts) { if (seatT(name)) continue; only(name);
          for (const t of momentsOf(name)) { poseAt(P.acts[name], t); standH = Math.max(standH, P.hips.getWorldPosition(_grV).applyMatrix4(_grI).y); } }
        groundPts.set(P.key + '|H', standH); }
      if (!(standH > 0.3)) { if (standH > -Infinity) console.warn(P.key + ': no standing height to read its takes against (' + standH.toFixed(2) + ')'); return; }
      const PTS = groundPoints(P, skins);
      const lowOf = (list) => { let m = Infinity; const mats = new Map(), sms = new Map();
        for (const [k, i] of list) { const q = skins[k]; if (!q) continue; let M = mats.get(q); if (!M) { M = new THREE.Matrix4().multiplyMatrices(_grI, q.matrixWorld); mats.set(q, M); }
          if (FASTSKIN) { let SM = sms.get(q); if (!SM) { SM = skinMats(q).map(x => x.clone()); sms.set(q, SM); } skinVertex(q, i, _grV, SM); } else q.getVertexPosition(i, _grV);
          _grV.applyMatrix4(M); if (_grV.y < m) m = _grV.y; } return m; };
      for (const name in P.acts) { if (seatT(name)) continue;
        const A = P.acts[name], d = A.getClip().duration, W = P.win && P.win[name], memo = P.key + '|' + name + '|' + (W ? W[0] + ',' + W[1] : '');
        let R = groundMemo.get(memo);
        if (!R) { const ts = momentsOf(name); only(name);
          let hipsLo = Infinity; for (const t of ts) { poseAt(A, t); hipsLo = Math.min(hipsLo, P.hips.getWorldPosition(_grV).applyMatrix4(_grI).y); }
          const low = hipsLo < GROUND_LOW * standH; let feet = Infinity, all = Infinity;
          for (let n = 0; n < ts.length; n++) { poseAt(A, ts[n]); feet = Math.min(feet, lowOf(PTS.foot));
            if (low || n === 0) all = Math.min(all, feet, lowOf(PTS.body)); }
          const contact = low ? all : feet;
          R = { feet: +feet.toFixed(4), all: +all.toFixed(4), hips: +(hipsLo / standH).toFixed(2), low, off: +(contact - GROUND_SOLE).toFixed(4) };
          if (!(Math.abs(R.off) < 0.2)) { console.warn(P.key + ': ' + name + ' read as standing ' + R.off.toFixed(3) + ' m off the ground: left as it was'); R.skip = true; }
          groundMemo.set(memo, R); }
        (P.groundRep = P.groundRep || {})[name] = R;
        if (R.skip) continue;
        P.offY[name] = R.off; (P.grounded = P.grounded || {})[name] = true; }
    }
    /* A RISE FROM A SEAT, on the ground (o.seat.rise: the name of the take he stands up in). Seated he is set on his seat
       by his bottom and his legs are laid down to the ground (seatDown); stood up he is set down by his soles, as any
       standing take is. Between, the take's own hips say how far he has risen: at each of 25 moments of it the height his
       hips have climbed from where he sits to the highest they reach, eased, takes him from the one height to the other
       (P.rise[name], read in personSettle at the take's own moment). Grandmaster Pho rises from his bench in play and in
       the films: on his seat's height his soles stood 7 cm under the ground the whole way up */
    function riseCurve(P, name, skins) {
      const A = P.acts[name]; if (!A || !(P.offY[name] != null)) return;
      const PTS = groundPoints(P, skins), d = A.getClip().duration, N = 25, ts = [], hs = [], fs = [];
      for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
      P.model.position.set(0, 0, 0);
      for (let i = 0; i < N; i++) { const t = Math.min(d - 1e-3, d * i / (N - 1)); A.time = t; P.mixer.update(0); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true);
        _grI.copy(P.group.matrixWorld).invert(); let m = Infinity;
        const sms = FASTSKIN ? new Map() : null;
        for (const [k, j] of PTS.foot) { const q = skins[k]; if (!q) continue; _grM.multiplyMatrices(_grI, q.matrixWorld);
          if (sms) { let SM = sms.get(q); if (!SM) { SM = skinMats(q).map(x => x.clone()); sms.set(q, SM); } skinVertex(q, j, _grV, SM); } else q.getVertexPosition(j, _grV);
          _grV.applyMatrix4(_grM); if (_grV.y < m) m = _grV.y; }
        ts.push(t); hs.push(P.hips.getWorldPosition(_grV).applyMatrix4(_grI).y); fs.push(m); }
      const W = P.win && P.win[name], t0 = W ? W[0] : 0; let h0 = hs[0]; for (let i = 0; i < N; i++) if (ts[i] <= t0) h0 = hs[i];
      const h1 = Math.max(...hs), seat = P.offY[name], off = [];
      if (!(h1 - h0 > 0.15)) { console.warn(P.key + ': ' + name + ' does not rise (' + (h1 - h0).toFixed(2) + ' m): left on its seat'); return; }
      const ks = [];
      for (let i = 0; i < N; i++) { const u = Math.max(0, Math.min(1, ((hs[i] - h0) / (h1 - h0) - 0.15) / 0.7)), k = u * u * (3 - 2 * u);
        off.push(seat + k * ((fs[i] - GROUND_SOLE) - seat)); ks.push(k); }
      (P.rise = P.rise || {})[name] = { ts, off, k: ks };
      (P.groundRep = P.groundRep || {})[name] = { seat: +seat.toFixed(4), stood: +(fs[N - 1] - GROUND_SOLE).toFixed(4), rise: +(h1 - h0).toFixed(3) };
    }
    /* HEAD TURNS RESTRAINED (o.headDamp: { take: [k, reference take] }; Chad, 13 Nov 2026: "for the audience looking left
       and right, i think the angle to left and right is too extreme, and can be slightly restrained", and "When
       grandmaster pho talks, his head also moves too much to the right, i think the head movement can be greatly
       restrained"). Measured (tools/probes/headturn.mjs): the kneel's look round swept the face from 54 degrees to one
       side to 61 to the other, and Grandmaster Pho's talk turned his face up to 56 degrees to his right. So while a take
       named here is worn, the turns of the upper chest, the neck and the head are laid `k` of the way from a reference to
       where the take puts them: the reference is that take's own middle (the mean of those turns over its window: the look
       round about its centre) or another take's (his talk about his rest, which faces his front). The motion is the
       take's, smaller, and nothing else moves. Laid after the mixer has posed the body every frame (the mixer writes those
       turns again each frame), in play and in a film's pose alike, before a look (gaze) is laid over it */
    const _hdQ = new THREE.Quaternion();
    function headDampInit(P) {
      const D = P.o.headDamp, bones = [];
      for (const nm of ['Spine2', 'Neck', 'Head']) { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) { bones.push(P.bone[n]); break; } }
      if (!D || !bones.length) return;
      const meanOf = (name) => { const A = P.acts[name]; if (!A) return null; const d = A.getClip().duration, W = P.win && P.win[name], N = 24, acc = bones.map(() => [0, 0, 0, 0]), first = [];
        for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
        for (let i = 0; i < N; i++) { A.time = W ? ((W[0] + W[1] * i / (N - 1)) % d + d) % d : d * i / N; P.mixer.update(0);
          bones.forEach((b, j) => { const q = b.quaternion; if (i === 0) first[j] = q.clone();
            const s = q.x * first[j].x + q.y * first[j].y + q.z * first[j].z + q.w * first[j].w < 0 ? -1 : 1; acc[j][0] += q.x * s; acc[j][1] += q.y * s; acc[j][2] += q.z * s; acc[j][3] += q.w * s; }); }
        return acc.map(v => new THREE.Quaternion(v[0], v[1], v[2], v[3]).normalize()); };
      P.hd = { bones, take: {} };
      for (const name in D) { const spec = [].concat(D[name]), M = P.acts[name] ? meanOf(spec[1] || name) : null; if (M) P.hd.take[name] = { k: +spec[0], M }; }
    }
    function headDampLay(P) {
      const H = P.hd; if (!H) return;
      let best = null, bw = 0, cut = 0;
      for (const n in H.take) { const w = P.w[n] || 0; if (w > 0) { cut += w * (1 - H.take[n].k); if (w > bw) { bw = w; best = n; } } }
      if (!best || !(cut > 1e-4)) return;
      const M = H.take[best].M, kk = 1 - Math.min(1, cut);
      if (NOGARB) { const L = H.bones; for (let j = 0; j < L.length; j++) { const b = L[j]; _hdQ.copy(b.quaternion); b.quaternion.copy(M[j]).slerp(_hdQ, kk); } }
      else H.bones.forEach((b, j) => { _hdQ.copy(b.quaternion); b.quaternion.copy(M[j]).slerp(_hdQ, kk); });
      H.bones[0].updateWorldMatrix(false, true);
    }
    /* THE SHOULDERS LET DOWN (o.shoulders: { take: k }; v26.8, Chad, 13 Nov 2026: "ton's natural resting posture while
       standing, has his shoulders very raised and tensed up, make it look more natural"). Measured (tools/probes/
       jointscan.mjs: the collar bone's rise from its root at the neck out to the shoulder joint, against the body's own A
       pose, its neutral): the library's stand, laid on these bodies, holds both collar bones 27 to 49 degrees over their
       neutral, a full shrug (Ton 37 and 49), on everyone who wears it: it was made on a body whose arms begin level, and
       its collar bones came over raised. So while a take named here is worn, each collar bone is laid `k` of the way from
       where the take holds it to its bind pose with the take's own motion about its middle kept (the mean of its turn over
       the take's window: a breath that lifts the shoulders still lifts them), and the upper arm is given back its turn
       against the collar bone's parent, so the arm hangs and swings exactly as the take has it and only the shoulder
       comes down. Laid after the mixer and before any hand is laid (a hand on a thing reaches from the shoulder as it now
       is), taken off by armsBack() before the mixer runs again (v11.5) */
    /* (v26.8, Chad, the same evening, when the same shrug had been measured on everyone else who stands and left for his
       word: "there are also many other standing audience models all with the same raised shoulder problem, fix all of
       them the way you fixed Ton. All of them." So it is every body's: the stand and the talk let down wherever a body has
       them, unless it says `shoulders: null`) */
    const STAND_SH = { Idle_3: 1, Stand_and_Chat: 1 };
    const _sdq = new THREE.Quaternion(), _sdq2 = new THREE.Quaternion();
    function shouldersInit(P) {
      const asked = P.o.shoulders !== undefined, D = asked ? P.o.shoulders : STAND_SH; if (!D) return;
      if (!Object.keys(D).some(n => P.acts[n])) return;
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const S = [];
      for (const S0 of ['Left', 'Right']) { const cl = bone(S0 + 'Shoulder'), up = bone(S0 + 'Arm'); if (!cl || !up || up.parent !== cl) continue;
        const qb = bindLocal(P, cl); if (qb) S.push({ cl, up, qb, scl: new THREE.Quaternion(), sup: new THREE.Quaternion(), M: {}, fol: cl.children.filter(c => c.isBone && c !== up && /^Drape/.test(c.name)).map(b => ({ b, sv: new THREE.Quaternion() })) }); }
      if (!S.length) { if (asked) console.warn(P.key + ': o.shoulders asked, and no collar bone with its upper arm under it'); return; }
      /* (each take's middle turn of each collar bone, over the window the take is worn in: headDampInit's measure) */
      for (const name in D) { const A = P.acts[name]; if (!A) continue; const d = A.getClip().duration, W = (P.o.shWin && P.o.shWin[name]) || (P.win && P.win[name]), N = 24, acc = S.map(() => [0, 0, 0, 0]), first = [];
        for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
        for (let i = 0; i < N; i++) { A.time = W ? ((W[0] + W[1] * i / (N - 1)) % d + d) % d : d * i / N; P.mixer.update(0);
          S.forEach((R, j) => { const q = R.cl.quaternion; if (i === 0) first[j] = q.clone();
            const sg = q.x * first[j].x + q.y * first[j].y + q.z * first[j].z + q.w * first[j].w < 0 ? -1 : 1; acc[j][0] += q.x * sg; acc[j][1] += q.y * sg; acc[j][2] += q.z * sg; acc[j][3] += q.w * sg; }); }
        S.forEach((R, j) => { R.M[name] = new THREE.Quaternion(acc[j][0], acc[j][1], acc[j][2], acc[j][3]).normalize(); }); }
      P.shd = { S, take: Object.assign({}, D), on: false };
    }
    function shouldersLay(P) {
      const H = P.shd; if (!H) return;
      let best = null, bw = 0, k = 0;
      for (const n in H.take) { const w = P.w[n] || 0; if (w > 0 && H.S[0].M[n]) { k += w * H.take[n]; if (w > bw) { bw = w; best = n; } } }
      if (!best || !(k > 1e-4)) return;
      k = Math.min(1, k);
      for (const R of H.S) {
        R.scl.copy(R.cl.quaternion); R.sup.copy(R.up.quaternion);
        /* the collar bone: its bind pose, with the take's motion about its middle laid on it; k of the way there */
        _sdq.copy(R.M[best]).invert().premultiply(R.cl.quaternion); _sdq2.copy(R.qb).multiply(_sdq);
        R.cl.quaternion.slerp(_sdq2, k);
        /* the upper arm: the same turn against the collar bone's parent as before (old collar * old arm = new collar * new arm) */
        R.up.quaternion.copy(R.cl.quaternion).invert().multiply(R.scl).multiply(R.sup);
        for (const F of R.fol || []) { F.sv.copy(F.b.quaternion); F.b.quaternion.copy(R.cl.quaternion).invert().multiply(R.scl).multiply(F.sv); }
        R.cl.updateWorldMatrix(false, true);
      }
      H.on = true;
    }
    function riseOff(R, t, which = 'off') {
      const ts = R.ts, V = R[which], n = ts.length; if (t <= ts[0]) return V[0]; if (t >= ts[n - 1]) return V[n - 1];
      let i = 1; while (i < n - 1 && ts[i] < t) i++; const u = (t - ts[i - 1]) / (ts[i] - ts[i - 1]); return V[i - 1] + (V[i] - V[i - 1]) * u;
    }
    function personSettle(P) {
      if (!P.model) return; let ox = 0, oz = 0, oy = 0, rk = 0;
      /* (o.sink: a body's own measure for a take: the same written walk lays one dancer's feet 2.5 cm under the turf and
         the other's 1 cm over it: gait.mjs, each ankle against where it stands at rest) */
      const SK = P.o.sink;
      for (const k in P.w) { const w = P.w[k], f = P.off[k]; if (w > 0 && f) { ox += f[0] * w; oz += f[1] * w; }
        const sk = P.grounded && P.grounded[k] ? 0 : (SK && SK[k] != null ? SK[k] : SINK[k]); if (w > 0 && sk) oy += sk * w;
        const oyk = P.rise && P.rise[k] ? riseOff(P.rise[k], P.acts[k].time) : P.offY[k]; if (w > 0 && oyk) oy += oyk * w;
        if (w > 0 && P.rise && P.rise[k]) rk += w * riseOff(P.rise[k], P.acts[k].time, 'k'); }
      P.riseK = rk;
      P.model.position.x = -ox; P.model.position.z = -oz; P.model.position.y = -oy;
    }
    /* A WINDOW of a take (o.win: { take: [from, length, seconds] }): a take that is right only for part of its length is
       played back and forth inside that part, eased at both ends (the seated idle leans far forward for five of its ten
       seconds: only its upright ends are a master's rest). The window may run past the take's end: it wraps.
       THERE AND BACK TAKES `seconds` (Chad, 12 Nov 2026: "grandmaster pho is bobbing and bouncing too much in his
       passive pose, slow down the bobbing significantly"). Unsaid, it is twice the window's own length, the take's own
       pace: and a SHORT window at the take's own pace is a bob (his rest was 0.3 s of a take there and back every
       0.6 s: his head at 15 cm a second, measured by tools/probes/windowread.mjs; held half risen on 0.28 s of the rise
       it went 16 cm there and back every 0.56 s). A window that is a REST says its seconds. */
    function windowTime(P) {
      if (!P.win) return;
      for (const name in P.win) { const A = P.acts[name]; if (!A || !(P.w[name] > 0)) continue;
        const W = P.win[name], [from, len] = W, d = A.getClip().duration, u = (P.clock / (W[2] > 0 ? W[2] : len * 2)) % 1, k = 0.5 - 0.5 * Math.cos(u * 2 * Math.PI);
        A.time = (((from + k * len) % d) + d) % d; A.timeScale = 0; }
    }
    /* which take a person wears from now on (eased over `fade` seconds); `restart` begins it at its start */
    function take(P, name, fade = 0.4, restart = false) {
      if (!P) return false;
      if (!P.ready) { P.cur = name; P.then.push(() => take(P, name, 0, restart)); return true; }
      if (!P.acts[name]) { console.warn(P.key + ' has no take ' + name); return false; }
      if (restart || P.cur !== name) { if (restart || P.w[name] < 0.01) P.acts[name].time = 0; }
      if (P.span && P.span.name !== name) P.span = null;
      if (!(P.win && P.win[name]) && !(P.span && P.span.name === name)) P.acts[name].timeScale = 1;       // (a take once windowed runs again when its window is gone)
      P.cur = name; P.fade = fade; P.filmT = null;
      if (!(fade > 0)) { for (const k in P.acts) { P.w[k] = k === name ? 1 : 0; P.acts[k].setEffectiveWeight(P.w[k]); } personSettle(P); }
      return true;
    }
    /* a film's pose: this take at this moment of its own length (held at its end, or wrapped if `loop`), absolutely */
    /* (a take a body does not have fails silently and the man stands as he was: v11.2. A film that asks for one is
       told so once, in the console, where every probe of this chapter reads it) */
    const _noTake = new Set();
    function noTake(P, name) { const k = P.key + ':' + name; if (_noTake.has(k)) return; _noTake.add(k); console.warn(P.key + ' has no take ' + name + ' (a film asked for it; it has: ' + Object.keys(P.acts).join(', ') + ')'); }
    /* (v26.8: an optional THIRD take, name3 at k3 from t3, so a body blended between two takes can go on into a third
       from exactly where it stands: the brown hermit sits up at 0.42 of his laying-on take, and at the petals the
       film switched to the whole of it in one frame, his lean jumping from about ten degrees to twenty-five. Absent,
       every weight is what it was) */
    function pose(P, name, t, loop = false, name2 = null, k2 = 0, t2 = 0, name3 = null, k3 = 0, t3 = 0) {
      if (!P || !P.ready) return;
      if (!P.acts[name]) { noTake(P, name); return; }
      if (name2 && !P.acts[name2]) noTake(P, name2);
      if (name3 && !P.acts[name3]) noTake(P, name3);
      for (const k in P.acts) { const w = k === name ? 1 - (name2 ? k2 : 0) - (name3 ? k3 : 0) : (k === name2 ? k2 : (k === name3 ? k3 : 0)); P.w[k] = w; P.acts[k].setEffectiveWeight(w); }
      const A = P.acts[name], d = A.getClip().duration; A.time = loop ? ((t % d) + d) % d : Math.max(0, Math.min(d - 1e-3, t));
      if (name2 && P.acts[name2]) { const A2 = P.acts[name2], d2 = A2.getClip().duration; A2.time = Math.max(0, Math.min(d2 - 1e-3, t2)); }
      if (name3 && P.acts[name3]) { const A3 = P.acts[name3], d3 = A3.getClip().duration; A3.time = Math.max(0, Math.min(d3 - 1e-3, t3)); }
      P.cur = name; P.filmT = t; armsBack(P); personSettle(P); P.mixer.update(0);
      if (P.hd) headDampLay(P);
      if (P.upr) uprightLay(P);
      if (P.arst) armRestLay(P);
      if (P.upr) uprightArmsLay(P);
      if (P.knees) kneesLay(P);
      if (P.aout) armOutLay(P);
      if (P.shd) shouldersLay(P);
      if (P.restLegs) seatLegsLay(P);
      if (P.restHands && !(P.layK > 0)) restHandsLay(P);
      if (!P.htLate) handsTrue(P);
    }
    /* (v26.18: a person put somewhere stands on the floor that is there: the hall's is 0.48 m up, its steps between; on the
       ground of the Wai Kru that is 0, as it was) */
    function put(P, x, z, ry, y = flatGround(x, z)) { if (!P) return; P.group.position.set(x, y, z); if (ry != null) P.group.rotation.y = ry; }
    const faceTo = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);                 // the turn that faces a +z-facing body at a point
    /* every frame of play: weights eased on the wall clock, takes run, bodies settled */
    function peopleTick(wdt, live) {
      for (const P of people) {
        if (!P.ready || (!P.group.visible && !P.driver) || (P.driver && P.idle)) continue;
        if (P.filmT != null && !live) continue;                                  // a film holds its people where it posed them
        if (P.filmT != null) { P.filmT = null; }
        let moved = false;
        for (const k in P.acts) { const to = k === P.cur ? 1 : 0, w = P.w[k];
          if (w !== to) { const st = P.fade > 0 ? wdt / P.fade : 1; P.w[k] = to > w ? Math.min(to, w + st) : Math.max(to, w - st); P.acts[k].setEffectiveWeight(P.w[k]); moved = true; } }
        if (moved) personSettle(P);
        P.clock += wdt * P.rate; windowTime(P);
        if (P.span) spanTick(P, wdt);
        if (P.rise) personSettle(P);
        armsBack(P);
        P.mixer.update(wdt * P.rate);
        if (P.hd) headDampLay(P);
        if (P.upr) uprightLay(P);
        if (P.arst) armRestLay(P);
        if (P.upr) uprightArmsLay(P);
        if (P.knees) kneesLay(P);
        if (P.aout) armOutLay(P);
        if (P.shd) shouldersLay(P);
        if (P.gaze || P.gazeK > 0) gazeTick(P, wdt);
        if (P.lay || P.layK > 0) layTick(P, wdt);
        if (P.restLegs) seatLegsLay(P);
        if (P.restHands && !(P.layK > 0)) restHandsLay(P);
        if (!P.htLate) handsTrue(P);
      }
    }
    /* A TAKE PLAYED ONCE between two of its own moments, over `secs` seconds, eased at both ends (t1 may be before t0:
       a rise played backwards is a sitting down), then HELD on a small window at its end (o.hold: seconds of the take,
       back and forth from where it stopped; negative runs back; o.holdSecs: how long that takes there and back, where
       the hold is a stillness and not a beat) or handed on (o.then). A rise from a seat, a throw, a
       bow. Its window and its end are the person's own state, so reset() need only name a take again. */
    function span(P, name, t0, t1, secs, o = {}) {
      if (!P) return;
      whenReady(P, () => { if (!P.acts[name]) { console.warn(P.key + ' has no take ' + name); return; }
        if (P.win && P.win[name]) delete P.win[name];
        P.span = { name, t0, t1, secs: Math.max(0.05, secs), u: 0, hold: o.hold != null ? o.hold : 0, holdSecs: o.holdSecs > 0 ? o.holdSecs : 0, then: o.then || null, n: ++P.actN };
        take(P, name, o.fade != null ? o.fade : 0.4); P.acts[name].time = t0; P.acts[name].timeScale = 0; });
    }
    function spanTick(P, wdt) {
      const Sp = P.span, A = P.acts[Sp.name]; if (!A) { P.span = null; return; }
      Sp.u = Math.min(1, Sp.u + wdt / Sp.secs);                                 // (wall seconds, whatever the person's own rate: a bow is in time with the ground)
      const d = A.getClip().duration; A.time = Math.max(0, Math.min(d - 1e-3, Sp.t0 + (Sp.t1 - Sp.t0) * smo(Sp.u))); A.timeScale = 0;
      if (Sp.u < 1) return;
      P.span = null;
      if (Sp.hold) { (P.win = P.win || {})[Sp.name] = Sp.holdSecs > 0 ? [Sp.t1, Sp.hold, Sp.holdSecs] : [Sp.t1, Sp.hold]; P.clock = 0; }
      if (Sp.then) Sp.then(P);
    }
    /* a take with a window of its own from now on (a pose held: both hands laid forward), or with none (it runs whole);
       `secs`, where said, is how long the window takes there and back (windowTime) */
    function hold(P, name, from, len, fade = 0.5, secs = 0) {
      if (!P) return;
      whenReady(P, () => { if (!P.acts[name]) return; P.span = null; ++P.actN;
        if (len == null) { if (P.win) delete P.win[name]; } else { (P.win = P.win || {})[name] = secs > 0 ? [from, len, secs] : [from, len]; P.clock = 0; }
        take(P, name, fade); if (len == null) P.acts[name].timeScale = 1; });
    }
    /* back to the take a person was built in, and its window */
    function rest(P, fade = 0.6) {
      if (!P) return;
      whenReady(P, () => { P.span = null; ++P.actN; const R = P.rest;
        if (R.win && R.win[R.take]) { (P.win = P.win || {})[R.take] = R.win[R.take]; P.clock = 0; }
        take(P, R.take, fade); });
    }
    /* a person who speaks plays his talking take from the line's own start, and goes back to rest after it (v11.4);
       whatever he is given to do meanwhile wins (the act's number has moved on) */
    function talk(P, secs, name) {
      if (!P) return;
      whenReady(P, () => { const tk = name || P.talkTake; if (!tk || !P.acts[tk]) return;
        if (P.win && P.win[tk]) delete P.win[tk];
        P.span = null; const n = ++P.actN; take(P, tk, 0.35); P.acts[tk].timeScale = 1;
        after(Math.max(0.4, secs - 0.15), () => { if (P.actN === n) rest(P, 0.5); }); });
    }
    /* A LOOK (v6.9): the head eased onto a point (or the lens) within a neck's reach, laid on after the mixer has
       written the take and so never stacked (the take writes the head again before the next look is laid). The face's
       own direction is the head's turn since its bind (headRest), not the bone's axes. */
    const _lkq = new THREE.Quaternion(), _lkq2 = new THREE.Quaternion(), _lkq3 = new THREE.Quaternion(), _lkv = new THREE.Vector3(), _lkv2 = new THREE.Vector3(), _lkz = new THREE.Vector3();
    function gaze(P, target, o = {}) { if (!P) return; P.gaze = target ? { target, reach: o.reach != null ? o.reach : 0.75, secs: o.secs || 0.9, down: o.down != null ? o.down : 0.03 } : null; if (!target) P.gazeOut = o.secs || 0.9; }
    function gazeTick(P, wdt) {
      const G = P.gaze, secs = G ? G.secs : (P.gazeOut || 0.9);
      P.gazeK = G ? Math.min(1, P.gazeK + wdt / secs) : Math.max(0, P.gazeK - wdt / secs);
      const L = G || P.gazeLast; if (G) P.gazeLast = G;
      if (!L || !(P.gazeK > 0) || !P.head || !P.headRest) return;
      lookSave(P);
      const tg = L.target === 'lens' ? camera.getWorldPosition(_lkv2) : _lkv2.set(L.target[0], L.target[1], L.target[2]);
      P.group.updateWorldMatrix(true, true);
      P.head.getWorldPosition(_lkv); P.head.getWorldQuaternion(_lkq);
      /* the face's direction now, in the world: the head's turn since its bind, applied to +z */
      _lkz.set(0, 0, 1).applyQuaternion(P.headRest).applyQuaternion(_lkq).normalize();
      _lkv2.sub(_lkv); _lkv2.y -= L.down * _lkv2.length(); _lkv2.normalize();
      const ang = Math.acos(Math.max(-1, Math.min(1, _lkz.dot(_lkv2)))); if (ang < 1e-3) return;
      natLook(P, _lkz, _lkv2, smo(P.gazeK), L.reach, _lkq);
    }
    /* a film's look: the head turned onto a point (or the lens) by k, now, with no clock of its own (after pose()) */
    function lookNow(P, target, k = 1, reach = 0.75, down = 0.03) {
      if (!P || !P.ready || !P.head || !P.headRest || !(k > 0)) return;
      lookSave(P);
      const tg = target === 'lens' ? camera.getWorldPosition(_lkv2) : _lkv2.set(target[0], target[1], target[2]);
      P.group.updateWorldMatrix(true, true);
      P.head.getWorldPosition(_lkv); P.head.getWorldQuaternion(_lkq);
      _lkz.set(0, 0, 1).applyQuaternion(P.headRest).applyQuaternion(_lkq).normalize();
      tg.sub(_lkv); tg.y -= down * tg.length(); tg.normalize();
      const ang = Math.acos(Math.max(-1, Math.min(1, _lkz.dot(tg)))); if (ang < 1e-3) return;
      natLook(P, _lkz, tg, smo(c01(k)), reach, _lkq);
    }
    /* HANDS LAID ON A THING (photograph 5: the kneeling man raises his bai sri in both hands and the seated master "has
       both his hands on it too": that is the empowerment, Chad's §0). A take holds a body's hands where that body's own
       motion puts them, and no two takes of two bodies put four hands on one bowl. So the BOWL is the truth and the
       hands go to it: each arm solved as two bones onto its wrist's place, the elbow down and out (v24.21's solver,
       below), and the hand turned so its palm lies on the thing with its fingers along it. Laid on after the take has
       posed the body, and UNDONE before the mixer runs again (the v11.5 law: the mixer writes a bone only when its
       take's value changes, so a turn left in a bone would be turned again from itself).
       A hand's own axes are MEASURED on the body, once (v25.3: "each hand's own surface and thumb side"), from its
       bind pose: armsOf. */
    const _ia = new THREE.Vector3(), _ib = new THREE.Vector3(), _ic = new THREE.Vector3(), _it = new THREE.Vector3(), _ie = new THREE.Vector3(),
          _ipo = new THREE.Vector3(), _iu = new THREE.Vector3(), _iv = new THREE.Vector3(), _ig = new THREE.Vector3(),
          _iqa = new THREE.Quaternion(), _iqb = new THREE.Quaternion(), _iqp = new THREE.Quaternion();
    function armTo(a, target, pole) {
      a.up.updateWorldMatrix(true, true);
      a.up.getWorldPosition(_ia); a.fore.getWorldPosition(_ib); a.hand.getWorldPosition(_ic);
      const la = _ia.distanceTo(_ib), lb = _ib.distanceTo(_ic);
      _it.copy(target).sub(_ia); let d = _it.length(); if (d < 1e-5 || la < 1e-5 || lb < 1e-5) return;
      _it.divideScalar(d); d = THREE.MathUtils.clamp(d, Math.abs(la - lb) + 1e-3, la + lb - 1e-3);
      _ipo.copy(pole).sub(_ia); _ipo.addScaledVector(_it, -_ipo.dot(_it)); if (_ipo.lengthSq() < 1e-10) return; _ipo.normalize();
      const ca = THREE.MathUtils.clamp((la * la + d * d - lb * lb) / (2 * la * d), -1, 1), sa = Math.sqrt(1 - ca * ca);
      _ie.copy(_ia).addScaledVector(_it, la * ca).addScaledVector(_ipo, la * sa);
      _iu.copy(_ib).sub(_ia).normalize(); _iv.copy(_ie).sub(_ia).normalize();
      _iqa.setFromUnitVectors(_iu, _iv); a.up.getWorldQuaternion(_iqb); _iqa.multiply(_iqb);
      a.up.parent.getWorldQuaternion(_iqp); a.up.quaternion.copy(_iqa.premultiply(_iqp.invert()));
      a.up.updateWorldMatrix(false, true);
      a.fore.getWorldPosition(_ib); a.hand.getWorldPosition(_ic);
      _iu.copy(_ic).sub(_ib).normalize(); _iv.copy(target).sub(_ib).normalize();
      _iqa.setFromUnitVectors(_iu, _iv); a.fore.getWorldQuaternion(_iqb); _iqa.multiply(_iqb);
      a.fore.parent.getWorldQuaternion(_iqp); a.fore.quaternion.copy(_iqa.premultiply(_iqp.invert()));
      a.fore.updateWorldMatrix(false, true);
    }
    const ARMS = { L: ['LeftArm', 'LeftForeArm', 'LeftHand'], R: ['RightArm', 'RightForeArm', 'RightHand'] };
    const _hb = new THREE.Vector3(), _hf = new THREE.Vector3(), _hn = new THREE.Vector3(), _ha = new THREE.Vector3(), _hW = new THREE.Vector3(), _hP = new THREE.Vector3(),
          _hL = new THREE.Vector3(), _hm = new THREE.Matrix4(), _hm2 = new THREE.Matrix4(), _hq = new THREE.Quaternion(), _hq2 = new THREE.Quaternion();
    function armsOf(P) {
      if (P.arms !== undefined) return P.arms;
      P.arms = null;
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const skins = P.lv[1]; if (!skins || !skins.length) return null;
      /* (a bone's place and turn in the bind pose, from whichever skin is bound to it) */
      const bindOf = (b) => { if (!b) return null; for (const sm of skins) { const i = sm.skeleton.bones.indexOf(b); if (i >= 0) return new THREE.Matrix4().copy(sm.skeleton.boneInverses[i]).invert(); } return null; };
      const at = (b) => { const m = bindOf(b); return m ? new THREE.Vector3().setFromMatrixPosition(m) : null; };
      const out = {}, v = new THREE.Vector3();
      for (const sd of ['L', 'R']) {
        const S0 = sd === 'L' ? 'Left' : 'Right', side = sd === 'L' ? 1 : -1;
        const up = bone(S0 + 'Arm'), fore = bone(S0 + 'ForeArm'), hand = bone(S0 + 'Hand'); if (!up || !fore || !hand) return null;
        const mh = bindOf(hand), ph = at(hand), pf = at(fore); if (!mh || !ph || !pf) return null;
        let f, nrm, palm;
        const pMid = at(bone(S0 + 'HandMiddle1')), pOut = at(bone(S0 + 'HandPinky1')) || at(bone(S0 + 'HandRing1')), pIn = at(bone(S0 + 'HandIndex1')) || pMid;
        if (pMid && pOut && pIn) {
          /* A RIG WITH FINGERS: the fingers' line runs from the wrist to the middle finger's root; across the palm runs
             from the little finger's root to the first finger's; the palm faces their cross (a left hand held out flat,
             fingers along +x and thumb to +z, faces down: +x cross +z; a right hand is its mirror) */
          f = pMid.clone().sub(ph); palm = 0.55 * f.length(); f.normalize();
          const ac = pIn.clone().sub(pOut); ac.addScaledVector(f, -ac.dot(f)).normalize();
          nrm = new THREE.Vector3().crossVectors(f, ac).multiplyScalar(side).normalize();
        } else {
          /* A RIG WITH NONE: the forearm's line carried on; the palm's normal is the thin axis of the skin the hand bone
             carries, about that line, signed to face down and in (as an A pose or a T pose holds a palm) */
          f = ph.clone().sub(pf).normalize();
          const u = new THREE.Vector3(0, 1, 0); if (Math.abs(f.y) > 0.9) u.set(0, 0, 1); u.addScaledVector(f, -u.dot(f)).normalize(); const w = new THREE.Vector3().crossVectors(f, u);
          let n = 0, su = 0, sw = 0, suu = 0, sww = 0, suw = 0, len = 0;
          for (const sm of skins) { const hi = sm.skeleton.bones.indexOf(hand), g = sm.geometry, pos = g.attributes.position, si = g.attributes.skinIndex, sk = g.attributes.skinWeight; if (hi < 0 || !si || !sk) continue;
            for (let i = 0; i < pos.count; i++) { let wt = 0; for (let j = 0; j < 4; j++) if (si.getComponent(i, j) === hi) wt += sk.getComponent(i, j);
              if (wt < 0.6) continue;
              v.fromBufferAttribute(pos, i).applyMatrix4(sm.bindMatrix).sub(ph); const a = v.dot(u), b = v.dot(w); len = Math.max(len, v.dot(f));
              n++; su += a; sw += b; suu += a * a; sww += b * b; suw += a * b; } }
          if (n < 12) { console.warn(P.key + ': the ' + sd + ' hand has no fingers and no skin of its own to measure'); return null; }
          const cuu = suu / n - (su / n) * (su / n), cww = sww / n - (sw / n) * (sw / n), cuw = suw / n - (su / n) * (sw / n), th = 0.5 * Math.atan2(2 * cuw, cuu - cww) + Math.PI / 2;
          nrm = u.clone().multiplyScalar(Math.cos(th)).addScaledVector(w, Math.sin(th)).normalize();
          const ref = nrm.x * -side - nrm.y;                                     // (down and in: the left hand is at +x of a body that faces +z)
          if (Math.abs(ref) < 0.2) console.warn(P.key + ': the ' + sd + ' palm faces neither down nor in at rest (' + ref.toFixed(2) + '): its side is a guess');
          if (ref < 0) nrm.negate();
          palm = 0.3 * Math.max(0.12, Math.min(0.24, len));
        }
        const ri = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(mh)).invert();
        const fL = f.clone().applyQuaternion(ri), nL = nrm.clone().applyQuaternion(ri), aL = new THREE.Vector3().crossVectors(nL, fL);
        out[sd] = { up, fore, hand, fL, nL, aL, palm, side, fingers: !!(pMid && pOut && pIn), wrote: false, qUp: new THREE.Quaternion(), qFore: new THREE.Quaternion(), qHand: new THREE.Quaternion() };
      }
      P.arms = out; return out;
    }
    /* (before a body's mixer runs: what was laid on its arms is taken off) */
    function armsBack(P) { lookBack(P); const HT0 = P.ht; if (HT0 && HT0.on) { for (const R of HT0.W) if (R.on) { R.fore.quaternion.copy(R.sf); R.hand.quaternion.copy(R.sh); R.on = false; }
        for (const R of HT0.J) if (R.on) { R.b.quaternion.copy(R.sv); R.on = false; }
        for (const R of HT0.K) if (R.on) { R.b.quaternion.copy(R.sv); R.on = false; } HT0.on = false; }
      const LG = P.restLegs; if (LG && LG.wrote) { for (const sd in LG.R) { const r = LG.R[sd]; r.up.quaternion.copy(r.qUp); r.fore.quaternion.copy(r.qFore); r.foot.quaternion.copy(r.qFoot);
        if (r.gUp) r.gUp.quaternion.copy(r.qGUp); if (r.gLow) r.gLow.quaternion.copy(r.qGLow); } LG.wrote = false; }
      const A = P.arms; if (A) for (const sd in A) { const a = A[sd];
      if (a.curled) { for (const F of a.fing) F.b.quaternion.copy(F.q); if (a.fingRest) { for (const F of a.fingRest) F.b.quaternion.copy(F.q); a.fingRest = null; } a.curled = false; }
      if (!a.wrote) continue; a.up.quaternion.copy(a.qUp); a.fore.quaternion.copy(a.qFore); a.hand.quaternion.copy(a.qHand); a.wrote = false; }
      const RH0 = P.restHands; if (RH0) for (const sd in RH0.R) { const fl = RH0.R[sd].fol; if (fl) for (const F of fl) if (F.on) { F.b.quaternion.copy(F.q); F.on = false; } }
      /* (the shoulders let down were laid first, under every hand: so they are taken off last) */
      const SH = P.shd; if (SH && SH.on) { for (const R of SH.S) { R.cl.quaternion.copy(R.scl); R.up.quaternion.copy(R.sup); if (R.fol) for (const F of R.fol) F.b.quaternion.copy(F.sv); } SH.on = false; }
      const AO = P.aout; if (AO && AO.on) { for (const R of AO.B) R.b.quaternion.copy(R.sv); AO.on = false; }
      const KN = P.knees; if (KN && KN.on) { KN.hips.position.copy(KN.hp); for (const R of KN.B) R.b.quaternion.copy(R.sv); KN.on = false; }
      const UP = P.upr; if (UP && UP.armsOn) { for (const A of UP.arms) A.b.quaternion.copy(A.sv); UP.armsOn = false; }
      const AR = P.arst; if (AR && AR.on) { for (const R of AR.B) R.b.quaternion.copy(R.sv); AR.on = false; }
      if (UP && UP.on) { for (const R of UP.B) R.b.quaternion.copy(R.sv); UP.on = false; } }
    /* A HAND CLOSED ROUND A THING (the woman with the taper): each finger's three joints turned by `th` radians toward
       the palm's own facing, about the hand's own measured across-axis as it lies in the world now. Laid on after
       handTo() and taken off by armsBack() before the mixer runs again, as every laid pose is (v11.5). A rig with no
       finger bones is left as it is. */
    function curlFingers(P, sd, th) {
      const As = P && P.ready ? armsOf(P) : null, a = As && As[sd]; if (!a) return;
      if (!a.fing) { a.fing = []; const S0 = sd === 'L' ? 'Left' : 'Right';
        for (const f of ['Index', 'Middle', 'Ring', 'Pinky']) for (let i = 1; i <= 3; i++) { const b = P.bone[S0 + 'Hand' + f + i] || P.bone['mixamorig:' + S0 + 'Hand' + f + i]; if (b) a.fing.push({ b, q: new THREE.Quaternion(), i }); } }
      if (!a.fing.length) return;
      if (!a.curled) { for (const F of a.fing) F.q.copy(F.b.quaternion); a.curled = true; }
      a.hand.getWorldQuaternion(_hq); _hf.copy(a.fL).applyQuaternion(_hq); _hn.copy(a.nL).applyQuaternion(_hq); _ha.crossVectors(_hf, _hn).normalize();
      for (const F of a.fing) { _hq.setFromAxisAngle(_ha, th * (F.i === 3 ? 0.7 : 1)); F.b.parent.getWorldQuaternion(_hq2);
        /* world' = turn * world, so local' = parentWorld^-1 * turn * parentWorld * local */
        F.b.quaternion.premultiply(_hq2).premultiply(_hq).premultiply(_hq2.invert()); }
    }
    /* (v26.11, NOGARB) a hand's resting turns, kept before a pose is laid on them: ONE list a hand and a caller (`key`),
       its turns copied in again each time (the same numbers a new list held: q copied from the bone as clone() made it;
       `i` the joint's own, or the one given), where a new list and a new turn for each joint were made every frame */
    function restList(a, key, from, i1) {
      let L = a[key];
      if (!L || L.length !== from.length) { L = a[key] = from.map(F => ({ b: F.b, q: new THREE.Quaternion(), i: 0 })); }
      for (let j = 0; j < from.length; j++) { const F = from[j], R = L[j]; R.b = F.b; R.q.copy(F.b.quaternion); R.i = i1 > 0 ? i1 : F.i; }
      return L;
    }
    /* (v26.8) A HAND OPENED ROUND A THING HELD FROM BELOW (photograph 5: the kneeling man's fingers spread up the bowl's
       sides, straight and a little bent, where the woman's take left hers closed in fists against it, Chad: "the arms of
       the female ... dont look very natural and abit awkward while holding the bai sri"): each finger's and the thumb's
       joints laid at the body's own A pose (open, relaxed: the generated people were made in it), then the four fingers
       bent toward the palm by `curl` radians at their three joints (the bowl's curve), about the hand's own across-axis.
       Laid after handTo() and taken off by armsBack() before the mixer runs again (the same bookkeeping curlFingers
       keeps). A rig with no finger bones is left as it is */
    function fingersOpen(P, sd, k = 1, curl = [0.18, 0.22, 0.12]) {
      const As = P && P.ready ? armsOf(P) : null, a = As && As[sd]; if (!a || !(k > 0)) return;
      if (!a.fing) { a.fing = []; const S0 = sd === 'L' ? 'Left' : 'Right';
        for (const f of ['Index', 'Middle', 'Ring', 'Pinky']) for (let i = 1; i <= 3; i++) { const b = P.bone[S0 + 'Hand' + f + i] || P.bone['mixamorig:' + S0 + 'Hand' + f + i]; if (b) a.fing.push({ b, q: new THREE.Quaternion(), i }); } }
      if (!a.thumb) { a.thumb = []; const S0 = sd === 'L' ? 'Left' : 'Right';
        for (let i = 1; i <= 3; i++) { const b = P.bone[S0 + 'HandThumb' + i] || P.bone['mixamorig:' + S0 + 'HandThumb' + i]; if (b) a.thumb.push({ b, q: new THREE.Quaternion(), i }); } }
      if (!a.fing.length) return;
      if (!a.curled) { for (const F of a.fing) F.q.copy(F.b.quaternion); a.fingRest = NOGARB ? restList(a, 'frT', a.thumb, 0) : a.thumb.map(F => ({ b: F.b, q: F.b.quaternion.clone(), i: F.i })); a.curled = true; }
      if (NOGARB) { for (const F of a.fing) { if (!F.qb) F.qb = bindLocal(P, F.b) || F.b.quaternion.clone(); F.b.quaternion.copy(F.qb); }
        for (const F of a.thumb) { if (!F.qb) F.qb = bindLocal(P, F.b) || F.b.quaternion.clone(); F.b.quaternion.copy(F.qb); } }
      else for (const F of a.fing.concat(a.thumb)) { if (!F.qb) F.qb = bindLocal(P, F.b) || F.b.quaternion.clone(); F.b.quaternion.copy(F.qb); }
      a.hand.updateWorldMatrix(true, true);
      a.hand.getWorldQuaternion(_hq); _hf.copy(a.fL).applyQuaternion(_hq); _hn.copy(a.nL).applyQuaternion(_hq); _ha.crossVectors(_hf, _hn).normalize();
      for (const F of a.fing) { _hq.setFromAxisAngle(_ha, curl[F.i - 1] || 0); F.b.parent.getWorldQuaternion(_hq2);
        F.b.quaternion.premultiply(_hq2).premultiply(_hq).premultiply(_hq2.invert()); F.b.updateWorldMatrix(false, true); }
      /* (part of the way, while the hold begins or ends: each joint eased from the take's own) */
      if (k < 0.999) { for (const F of a.fing) { _hq.copy(F.b.quaternion); F.b.quaternion.copy(F.q).slerp(_hq, k); }
        for (const F of a.fingRest) { _hq.copy(F.b.quaternion); F.b.quaternion.copy(F.q).slerp(_hq, k); }
        a.hand.updateWorldMatrix(false, true); }
    }
    /* ONE HAND onto a thing, by k: its palm's middle at `at` (a point of the thing's surface), its fingers along `f`,
       its palm facing `n` (into the thing). o: { back: how far behind the palm's middle the wrist is, in metres (the
       hand's own measure unless said); off: how far the wrist stands off the surface; out, down: the elbow's side,
       from the shoulder } */
    function handTo(P, sd, at, f, n, k = 1, o = {}) {
      const As = P && P.ready ? armsOf(P) : null, a = As && As[sd]; if (!a || !(k > 0)) return false;
      if (!a.wrote) { a.qUp.copy(a.up.quaternion); a.qFore.copy(a.fore.quaternion); a.qHand.copy(a.hand.quaternion); a.wrote = true; }
      P.group.updateWorldMatrix(true, true);
      const ks = smo(c01(k));
      _hf.set(f[0], f[1], f[2]).normalize(); _hn.set(n[0], n[1], n[2]); _hn.addScaledVector(_hf, -_hn.dot(_hf)).normalize();
      _hW.set(at[0], at[1], at[2]).addScaledVector(_hf, -(o.back != null ? o.back : a.palm)).addScaledVector(_hn, -(o.off != null ? o.off : 0.022));
      a.hand.getWorldPosition(_hb); _hW.set(lp(_hb.x, _hW.x, ks), lp(_hb.y, _hW.y, ks), lp(_hb.z, _hW.z, ks));
      a.up.getWorldPosition(_hP); P.group.getWorldQuaternion(_hq); _hL.set(1, 0, 0).applyQuaternion(_hq);
      _hP.addScaledVector(_hL, a.side * (o.out != null ? o.out : 0.3)); _hP.y -= (o.down != null ? o.down : 0.32);
      /* (o.aft: the elbow drawn behind the body too, for a hand held at the hip: the woman with the taper. Absent, nothing moves) */
      if (o.aft) { _hL.set(0, 0, 1).applyQuaternion(_hq); _hP.addScaledVector(_hL, -o.aft); }
      armTo(a, _hW, _hP);
      _ha.crossVectors(_hn, _hf); _hm.makeBasis(_ha, _hn, _hf); _hm2.makeBasis(a.aL, a.nL, a.fL).transpose(); _hm.multiply(_hm2); _hq.setFromRotationMatrix(_hm);
      a.hand.parent.getWorldQuaternion(_hq2); _hq.premultiply(_hq2.invert());
      if (ks < 0.999) a.hand.quaternion.slerp(_hq, ks); else a.hand.quaternion.copy(_hq);
      a.hand.updateWorldMatrix(false, true);
      return true;
    }
    /* both hands, from a grip (baiGrip below) */
    function handsTo(P, grip, k = 1) { if (!grip) return; for (const sd of ['L', 'R']) if (grip[sd]) handTo(P, sd, grip[sd].at, grip[sd].f, grip[sd].n, k, grip[sd]); }
    /* WHERE TWO HANDS LIE ON A BAI SRI that stands at `c` (the middle of its foot, in the world) drawn at size s, for a
       body at `from` (so "forward" is from the body to the bowl). ON it (a master's: the palms down and in on the tiers
       of marigold above the bowl's rim, the fingers forward and a little down) or UNDER it (the one who offers it: the
       palms up and in under the bowl's swell, the fingers forward and up). The bowl's measures are the model's own
       (tools/probes/bands.mjs: the foot 0.09 m wide, the swell 0.13 at 0.15 m, the rim 0.19 at 0.21, tiers above) */
    function baiGrip(c, s, from, how = 'on') {
      const fx = c[0] - from[0], fz = c[2] - from[1], d = Math.hypot(fx, fz) || 1, F = [fx / d, fz / d], Lf = [F[1], -F[0]], out = {};
      for (const [sd, sg] of [['L', 1], ['R', -1]]) {
        if (how === 'on') { const r = 0.128 * s, y = 0.285 * s;
          out[sd] = { at: [c[0] + Lf[0] * sg * r - F[0] * 0.035, c[1] + y, c[2] + Lf[1] * sg * r - F[1] * 0.035],
                      f: [F[0] * 0.9 - Lf[0] * sg * 0.32, -0.3, F[1] * 0.9 - Lf[1] * sg * 0.32], n: [-Lf[0] * sg * 0.62, -0.78, -Lf[1] * sg * 0.62], out: 0.3, down: 0.3 }; }
        else { const r = 0.112 * s, y = 0.105 * s;
          out[sd] = { at: [c[0] + Lf[0] * sg * r - F[0] * 0.03, c[1] + y, c[2] + Lf[1] * sg * r - F[1] * 0.03],
                      f: [F[0] * 0.85 - Lf[0] * sg * 0.22, 0.48, F[1] * 0.85 - Lf[1] * sg * 0.22], n: [-Lf[0] * sg * 0.8, 0.55, -Lf[1] * sg * 0.8], out: 0.22, down: 0.4 }; }
      }
      return out;
    }
    /* WHERE TWO HANDS CARRY A TRAY that stands at `c` (the middle of its foot, in the world), its foot r in radius, for a
       body at `from`: the palms up under its foot at either side, the fingers forward and a little in */
    function trayGrip(c, r, from) {
      const fx = c[0] - from[0], fz = c[2] - from[1], d = Math.hypot(fx, fz) || 1, F = [fx / d, fz / d], Lf = [F[1], -F[0]], out = {};
      for (const [sd, sg] of [['L', 1], ['R', -1]])
        out[sd] = { at: [c[0] + Lf[0] * sg * r * 0.84 - F[0] * 0.03, c[1] - 0.004, c[2] + Lf[1] * sg * r * 0.84 - F[1] * 0.03],
                    f: [F[0] * 0.92 - Lf[0] * sg * 0.3, 0.1, F[1] * 0.92 - Lf[1] * sg * 0.3], n: [-Lf[0] * sg * 0.25, 0.95, -Lf[1] * sg * 0.25], out: 0.2, down: 0.42 };
      return out;
    }
    /* in play: a body's hands eased onto a grip and off it again (a grip may be a function, answering where the thing
       is now); in a film handsTo() is called by the film's own clock */
    function lay(P, grip, o = {}) { if (!P) return; if (grip) { P.lay = { grip, secs: o.secs || 0.8 }; P.layLast = P.lay; } else { P.lay = null; P.layOut = o.secs || 0.8; } }
    function layTick(P, wdt) {
      const G = P.lay, secs = G ? G.secs : (P.layOut || 0.8);
      P.layK = G ? Math.min(1, (P.layK || 0) + wdt / secs) : Math.max(0, (P.layK || 0) - wdt / secs);
      const L = G || P.layLast; if (!L || !(P.layK > 0)) return;
      handsTo(P, typeof L.grip === 'function' ? L.grip() : L.grip, P.layK);
    }
    /* HIS HANDS AT REST (o.handsOn; Chad, 12 Nov 2026, of the three monks as they first went live: "Look at the arms
       and hands of those monks, its completely unacceptable, how did that pass your review?"). MINE, both times: a
       seated take lays a body's hands where the body it was made on had its thighs, and on these robed bodies they went
       into the cloth; my first fix sent each palm flat onto the lap whatever the arm had to do (the wrists broke back,
       the elbows flared, the fingers stood stiff: claws), and my second moved the take's own arm as little as it could
       (the take's fingers closed into fists on the robe; Chad's monk's hands hung in the air before his knees). Both
       went past me in small pictures; and my third, the first laid as below, sent both elbows back and IN, inside his
       flank, the forearms out through the roll of his robe at the waist (an elbow bent toward a point behind the wrist,
       and by the shortest arc), seen only when the pictures were opened full size. So a rest is now DESIGNED as a body
       rests, and every one is photographed full size, high res, from before him, from each side and close on each
       hand, before it is built on (tracker §15.5).
       how 'lap': THE PALMS ON THE THIGHS, THE ELBOWS AT HIS SIDES. Each palm's middle on what is drawn of his lap (his
         body without his arms, read as heights up to 30 cm over his hip joints: `top`), wherever along the thigh leaves
         the reach from shoulder to wrist `ratio` of the arm's length (0.87, an elbow bent as an arm at rest bends it),
         the thigh's middle preferred where it cannot be had (or at `at`, if given); `out` to its outer side. The elbow
         behind the line from shoulder to wrist and below it, turned out from his side a step at a time until the upper
         arm and the forearm, each swept at its own thickness, clear what is drawn of him; the arm solved about its own
         elbow's hinge, read off his take (armHinge). The fingers carried on along the forearm's own line seen from
         above, a quarter of the way toward the thigh's, following the cloth's slope, the palm facing the cloth; the
         wrist `off` above it. Fingers with bones are his file's own at rest (the bind pose: a relaxed open hand), each
         joint curled by `curl` toward the palm, the little finger most. Measured once, on the take he rests in at its
         window's start, and reported (P.restRep: where, the reach, how far turned out, the wrist's bend).
       A HAND OF ONE PIECE (Chad's monk: no finger bones; each hand is his scan's, open, the fingers spread and a little
         cupped: tools/probes/handaxes.mjs, and photographed) is laid the same way by its own measured axes (handAxes).
         Palms joined before his chest were tried first, episode 3's solve and then one of mine, and refused by
         photograph: open spread fingers cannot press flat, and from in front the two hands showed as two open palms
         side by side.
       Laid every frame after the mixer has posed him, and taken off before it runs again (armsBack: the v11.5 law) */
    const _rhA = new THREE.Vector3(), _rhB = new THREE.Vector3(), _rhC = new THREE.Vector3(), _rhD = new THREE.Vector3(), _rhQ = new THREE.Quaternion(), _rhQ2 = new THREE.Quaternion();
    const FINGERS = ['Index', 'Middle', 'Ring', 'Pinky'];
    /* (a bone's turn in its parent in the bind pose, from the skin's own inverse binds) */
    function bindLocal(P, b) {
      for (const sm of P.lv[1] || []) { const sk = sm.skeleton, i = sk.bones.indexOf(b), ip = b.parent ? sk.bones.indexOf(b.parent) : -1; if (i < 0 || ip < 0) continue;
        const m = new THREE.Matrix4().copy(sk.boneInverses[ip]).multiply(new THREE.Matrix4().copy(sk.boneInverses[i]).invert());     // (the parent's bind inverted, times this bone's bind)
        const q = new THREE.Quaternion(); m.decompose(new THREE.Vector3(), q, new THREE.Vector3()); return q; }
      return null;
    }
    /* A MAN SITTING ON A CHAIR AS PHOTOGRAPH 2'S MONKS SIT (o.seat.down: { y, sink, edge, r, apron, sole }): his bottom
       on the seat, his feet flat on the ground below his knees, whatever take he sits in. Chad's monk's chair-sits
       perch, made for a seat some 8 cm higher than this chair's (his hip joints 17 cm over his knees, his thighs sloping
       thirty-three degrees: sitread.mjs), so set down by his soles his bottom hung over the seat, and set on the seat his
       feet went under the ground. So his bottom is set on the seat (the second hundredth of the skin his hips and
       thighs carry, `sink` into it), and each LEG is solved as two bones (armTo, the arms' own solver) from his hip
       joint to where the take puts that ankle, on the ground (its sole `sole` from it), the knee forward; each foot
       keeps the turn the take gives it in the world. Then he is brought forward until his shins, between the seat's
       top and the foot of its apron, stand `r` past its front face (`edge` ahead of his spot), feet and all. Laid every
       frame after the mixer has posed him and taken off before it runs again (armsBack), as a hand's grip is */
    function seatDown(P, name, SE, skins) {
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const v = new THREE.Vector3(), loc = (b) => { b.getWorldPosition(v); return P.group.worldToLocal(v.clone()); };
      const under = [], feet = { Left: [], Right: [] };
      for (const q of skins) { const pos = q.geometry.attributes.position, si = q.geometry.attributes.skinIndex, sw = q.geometry.attributes.skinWeight; if (!pos || !si || !sw || !q.skeleton) continue;
        const role = q.skeleton.bones.map(b => /^(mixamorig:?)?(Hips|(Left|Right)UpLeg)$/.test(b.name) ? 'U' : /^(mixamorig:?)?Left(Foot|Toe\w*)$/.test(b.name) ? 'Left' : /^(mixamorig:?)?Right(Foot|Toe\w*)$/.test(b.name) ? 'Right' : '');
        const SM = FASTSKIN ? skinMats(q) : null;
        for (let i = 0; i < pos.count; i++) { const w = { U: 0, Left: 0, Right: 0 }; for (let c = 0; c < 4; c++) { const r = role[si.getComponent(i, c)]; if (r) w[r] += sw.getComponent(i, c); }
          if (w.U < 0.5 && w.Left < 0.5 && w.Right < 0.5) continue; if (SM) skinVertex(q, i, v, SM); else q.getVertexPosition(i, v); v.applyMatrix4(q.matrixWorld); P.group.worldToLocal(v);
          if (w.U >= 0.5) under.push([v.y, v.z, v.x]); else feet[w.Left >= 0.5 ? 'Left' : 'Right'].push([v.x, v.y, v.z]); } }
      const H = loc(P.hips), K = SE.down, legs = { R: {}, wrote: false, keepKnee: K.knees === 'keep', tuck: K.tuck !== false };
      /* (his bottom: `hipOver` under his hip joints. Read from his skin it cannot be: his scan is his robe, and what
         hangs lowest under his hips in a seated take is the robe's skirt, 24 to 31 cm down (measured twice, and lifted
         off the chair both times: photographed). A seated man's hip joints stand some 12 to 15 cm over the seat
         (measured on the two new monks in the library's chair-sit: 15, in thick robes) */
      const bottom = H.y - (K.hipOver != null ? K.hipOver : 0.13), drop = bottom - (SE.y - (K.sink != null ? K.sink : 0.01));
      for (const S0 of ['Left', 'Right']) { const up = bone(S0 + 'UpLeg'), fore = bone(S0 + 'Leg'), foot = bone(S0 + 'Foot'); if (!up || !fore || !foot || !feet[S0].length) { console.warn(P.key + ': no ' + S0 + ' leg to seat'); return null; }
        const A0 = loc(foot), K0 = loc(fore);
        let sole = Infinity; for (const q of feet[S0]) if (q[1] < sole) sole = q[1];
        let footQ = P.group.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(foot.getWorldQuaternion(new THREE.Quaternion()));
        /* A FOOT LAID FLAT (K.flat: v26.2 debug, the masters' feet on the ground). A chair-sit made for a higher seat
           holds the foot toe down; set on the ground as the take has it, the foot stood on its toes. So the foot is turned
           about its own breadth until the lowest of its heel and the lowest of its toes are level (the sole flat on the
           ground), the turn taken at the ankle, and the ankle set by the sole so turned */
        if (K.flat) { const toe = bone(S0 + 'ToeBase'), T0 = toe ? loc(toe) : null;
          if (T0) { const fd = new THREE.Vector3(T0.x - A0.x, 0, T0.z - A0.z); if (fd.lengthSq() > 1e-6) { fd.normalize();
            let s0 = Infinity, s1 = -Infinity; for (const q of feet[S0]) { const u = (q[0] - A0.x) * fd.x + (q[2] - A0.z) * fd.z; if (u < s0) s0 = u; if (u > s1) s1 = u; }
            const span = s1 - s0, heel = [0, Infinity], toes = [0, Infinity];
            for (const q of feet[S0]) { const u = (q[0] - A0.x) * fd.x + (q[2] - A0.z) * fd.z;
              if (u < s0 + 0.3 * span && q[1] < heel[1]) { heel[0] = u; heel[1] = q[1]; } if (u > s1 - 0.3 * span && q[1] < toes[1]) { toes[0] = u; toes[1] = q[1]; } }
            if (span > 0.08 && heel[1] < Infinity && toes[1] < Infinity && toes[0] - heel[0] > 0.05) {
              const d3 = new THREE.Vector3().copy(fd).multiplyScalar(toes[0] - heel[0]); d3.y = toes[1] - heel[1]; d3.normalize();
              const qF = new THREE.Quaternion().setFromUnitVectors(d3, fd); footQ = qF.clone().multiply(footQ);
              sole = Infinity; const pv = new THREE.Vector3();
              for (const q of feet[S0]) { pv.set(q[0] - A0.x, q[1] - A0.y, q[2] - A0.z).applyQuaternion(qF); if (pv.y + A0.y < sole) sole = pv.y + A0.y; }
              (legs.flat = legs.flat || {})[S0] = +(Math.atan2(d3.y, Math.hypot(d3.x, d3.z)) * 180 / Math.PI).toFixed(1); } } } }
        /* (the ankle where the take has it across the ground, its sole on it; the knee's pole well ahead of the take's knee) */
        legs.R[S0] = { up, fore, foot, ank: new THREE.Vector3(A0.x, A0.y - sole + (K.sole != null ? K.sole : -0.005), A0.z), pole: new THREE.Vector3(K0.x * 1.15, K0.y + 0.1, K0.z + 0.6),
          footQ, qUp: new THREE.Quaternion(), qFore: new THREE.Quaternion(), qFoot: new THREE.Quaternion(),
          /* (a body whose legs are a graft on bones of their own beside its own legs: Grandmaster Pho's, leggraft.mjs,
             thigh and shin hung from his hips. They are turned as his own legs are turned, or his shins would stay
             where the take has them while his feet went where the seat lays them) */
          gUp: bone(S0 + 'LegGraftUp'), gLow: bone(S0 + 'LegGraftLow'), qGUp: new THREE.Quaternion(), qGLow: new THREE.Quaternion() }; }
      /* lowered by `drop`: the targets in the group's frame are where the ground is, so they do not move with him */
      P.restLegs = legs; P.model.position.set(0, -drop, 0); P.group.updateMatrixWorld(true); seatLegsLay(P);
      /* forward until the shins clear the seat's front face */
      let back = Infinity; const apron = K.apron != null ? K.apron : 0.14;
      for (const S0 in legs.R) { const r = legs.R[S0], Kn = loc(r.fore), An = loc(r.foot);
        for (const h of [SE.y, SE.y - apron]) { const t = Kn.y > An.y ? Math.max(0, Math.min(1, (Kn.y - h) / (Kn.y - An.y))) : 0; back = Math.min(back, Kn.z + t * (An.z - Kn.z) - H.z); } }
      const fwd = Math.max(0, K.edge + (K.r != null ? K.r : 0.055) - back);
      /* (measured with his model at the group's origin; played, it stands where `centre` puts his hips, `off`, and
         `fwd` further forward: the feet go with him) */
      const off = P.off[name] || [0, 0];
      for (const S0 in legs.R) { const r = legs.R[S0]; r.ank.x -= off[0]; r.ank.z += fwd - off[1]; r.pole.x -= off[0]; r.pole.z += fwd - off[1]; }
      armsBack(P); P.model.position.set(0, 0, 0); P.group.updateMatrixWorld(true);
      return { legs, lift: -drop, fwd, rep: { bottom: +bottom.toFixed(3), drop: +drop.toFixed(3), fwd: +fwd.toFixed(3), shins: +back.toFixed(3), flat: legs.flat || null } };
    }
    /* A KNEEL LAID ON THE FLOOR (v26.18). The kneel the woman who serves him and Ton wear in the hall was made on
       another body, and on theirs it knelt with the shins in the air: measured in the lab, her knees 13 and 16 cm over
       the tile, her ankles 15 and 17, the whole body held up on the tips of her toes behind her (the lowest of her skin),
       and the same on Ton. A real kneel sits back on the heels: the knees on the floor in front, the shins flat along it,
       the tops of the feet flat behind, the hips a little over the heels. So the body is let down (`drop`), the take's
       thigh kept to its own heading in plan and brought down until the knee is on the floor, the shin laid flat back
       along its own heading, and the foot turned to point back along the floor: the legs laid by the seated legs' own
       layer (seatLegsLay, armTo), only while the kneel is worn (P.kneelTakes, seatShare). Measured at the window's middle
       of the take; its own legs barely move across the window (the knees 2 cm) */
    function kneelLegs(P, name = 'seiza', K = {}) {
      if (!P || !P.ready || !P.acts[name] || !P.hips || P.kneelTakes) return null;
      const drop = K.drop != null ? K.drop : 0.09, kneeY = K.knee != null ? K.knee : 0.065, ankY = K.ankle != null ? K.ankle : 0.065, toeY = K.toe != null ? K.toe : 0.055;
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      armsBack(P);
      const W = P.win && P.win[name], A = P.acts[name], d = A.getClip().duration, w0 = {};
      for (const k in P.acts) { w0[k] = P.acts[k].getEffectiveWeight(); P.acts[k].setEffectiveWeight(k === name ? 1 : 0); }
      const t0 = A.time; A.time = W ? (((W[0] + W[1] / 2) % d) + d) % d : d / 2; P.mixer.update(0);
      const m0 = P.model.position.clone(); P.model.position.set(0, 0, 0); P.group.updateMatrixWorld(true);
      const inv = new THREE.Matrix4().copy(P.group.matrixWorld).invert(), gq = P.group.getWorldQuaternion(new THREE.Quaternion()).invert();
      const loc = (b) => b.getWorldPosition(new THREE.Vector3()).applyMatrix4(inv);
      const legs = { R: {}, kneel: true }, rep = {};
      for (const S0 of ['Left', 'Right']) {
        const up = bone(S0 + 'UpLeg'), fore = bone(S0 + 'Leg'), foot = bone(S0 + 'Foot'), toe = bone(S0 + 'ToeBase');
        if (!up || !fore || !foot || !toe) { console.warn(P.key + ': no ' + S0 + ' leg to kneel'); legs.R = null; break; }
        const H = loc(up), Kn = loc(fore), An = loc(foot), Tn = loc(toe);
        const L1 = H.distanceTo(Kn), L2 = Kn.distanceTo(An), L3 = An.distanceTo(Tn);
        H.y -= drop;
        const th = new THREE.Vector2(Kn.x - H.x, Kn.z - H.z).normalize(), dy1 = H.y - kneeY, r1 = Math.sqrt(Math.max(0, L1 * L1 - dy1 * dy1));
        const knee = new THREE.Vector3(H.x + th.x * r1, kneeY, H.z + th.y * r1);
        const sh = new THREE.Vector2(An.x - Kn.x, An.z - Kn.z).normalize(), dy2 = kneeY - ankY, r2 = Math.sqrt(Math.max(0, L2 * L2 - dy2 * dy2));
        const ank = new THREE.Vector3(knee.x + sh.x * r2, ankY, knee.z + sh.y * r2);
        const ft = new THREE.Vector2(Tn.x - An.x, Tn.z - An.z).normalize(), dy3 = ankY - toeY, r3 = Math.sqrt(Math.max(0, L3 * L3 - dy3 * dy3));
        const vNow = new THREE.Vector3().subVectors(Tn, An).normalize(), vNew = new THREE.Vector3(ft.x * r3, toeY - ankY, ft.y * r3).normalize();
        const footQ = new THREE.Quaternion().setFromUnitVectors(vNow, vNew).multiply(gq.clone().multiply(foot.getWorldQuaternion(new THREE.Quaternion())));
        /* (the pole points out from the hip-to-ankle line through the knee wanted, so the solve puts the knee there and
           nowhere lower: a pole set under and before it drew the knees 2 cm into the tile, measured in the hall) */
        const ax = new THREE.Vector3().subVectors(ank, H).normalize(), foot0 = H.clone().addScaledVector(ax, new THREE.Vector3().subVectors(knee, H).dot(ax));
        const pole = knee.clone().addScaledVector(new THREE.Vector3().subVectors(knee, foot0).normalize(), 0.5);
        legs.R[S0] = { up, fore, foot, ank, pole, footQ,
          qUp: new THREE.Quaternion(), qFore: new THREE.Quaternion(), qFoot: new THREE.Quaternion(), gUp: null, gLow: null, qGUp: new THREE.Quaternion(), qGLow: new THREE.Quaternion() };
        rep[S0] = { kneeWas: +Kn.y.toFixed(3), ankleWas: +An.y.toFixed(3), toeWas: +Tn.y.toFixed(3), knee: [knee.x, knee.z].map(v => +v.toFixed(3)), ankle: [ank.x, ank.z].map(v => +v.toFixed(3)) };
      }
      A.time = t0; for (const k in P.acts) P.acts[k].setEffectiveWeight(w0[k]); P.model.position.copy(m0); P.mixer.update(0); P.group.updateMatrixWorld(true);
      if (!legs.R) return null;
      P.offY[name] = (P.offY[name] || 0) + drop; P.restLegs = legs; P.kneelTakes = new RegExp('^' + name + '$');
      personSettle(P); P.kneelRep = rep; return rep;
    }
    /* THE KNEELERS' HANDS ON THEIR THIGHS (v26.18). Laid on the floor, the kneel's own arms hung straight down past the
       thighs to the tile, photographed from her side and front in the hall: a woman kneeling to serve, and Ton kneeling
       beside the mat, rest their hands on their thighs. The seated people's own layer lays them (restHands, 'lap': the
       hands on what the body offers under them), solved in the kneel at its window's middle and drawn only while the
       kneel is worn (`only`), with the kneeling crowd's own options (c_crowd.js KNEEL_HANDS: the wrist solved against
       its forearm; the monks' options left her wrists 35 degrees toward the thumb, jointscan) */
    function kneelHands(P, name = 'seiza', K = { how: 'lap', out: 0.035, inner: 0, turn: 0.2 }) {
      if (!P || !P.ready || !P.acts[name] || !P.kneelTakes) return null;
      const W = P.win && P.win[name], A = P.acts[name], d = A.getClip().duration, w0 = {}, pw0 = Object.assign({}, P.w);
      for (const k in P.acts) { w0[k] = P.acts[k].getEffectiveWeight(); P.acts[k].setEffectiveWeight(k === name ? 1 : 0); }
      for (const k in P.w) P.w[k] = 0; P.w[name] = 1;
      const t0 = A.time; A.time = W ? (((W[0] + W[1] / 2) % d) + d) % d : d / 2; P.mixer.update(0); personSettle(P); P.group.updateMatrixWorld(true);
      const r = restHands(P, K);
      if (P.restHands) P.restHands.only = new RegExp('^' + name + '$');
      armsBack(P); A.time = t0; for (const k in P.acts) P.acts[k].setEffectiveWeight(w0[k]);
      for (const k in P.w) delete P.w[k]; Object.assign(P.w, pw0); P.mixer.update(0); personSettle(P); P.group.updateMatrixWorld(true);
      return r;
    }
    const _slA = new THREE.Vector3(), _slB = new THREE.Vector3(), _slQ = new THREE.Quaternion();
    const _slQ1 = new THREE.Quaternion(), _slQ2 = new THREE.Quaternion(), _slQ3 = new THREE.Quaternion(), _slQ4 = new THREE.Quaternion(), _slQd = new THREE.Quaternion(), _slQp = new THREE.Quaternion();
    /* (how far he wears a take that SITS, by the takes' weights: a seated man's legs are laid only while he sits. In the
       late afternoon's photograph the masters stand in Idle_3, and laid there their feet were pinned to where they
       sit: v26.2 debug. A fade between a seat and a stand lays them that share of the way) */
    const _slT = new THREE.Quaternion();
    function seatShare(P) { if (P.kneelTakes) { let k = 0; for (const n in P.w) if (P.kneelTakes.test(n)) k += P.w[n]; return Math.min(1, k); }
      const so = P.o.seat; if (!so || !so.takes) return 1 - (P.riseK || 0); let k = 0; for (const n in P.w) if (so.takes.test(n)) k += P.w[n]; return Math.min(1, k) * (1 - (P.riseK || 0)); }
    /* THE SHIN SWUNG, THE KNEE KEPT (o.seat.down.knees 'keep': Grandmaster Pho). His robe below the waist is cloth baked
       round each take's own thighs (robesim, robeshell: v24.47), so legs laid from the hip (armTo) lifted his knees
       through it: skin through the white, photographed (v26.2 debug). So his thigh stays as the take has it and only the
       shin turns about the knee, the ankle brought to the height the seat lays it at, kept to the take's own reach
       aside, the rest of its reach forward or (`tuck`) back under the seat: a man sitting with his feet drawn in */
    const _skK = new THREE.Vector3(), _skA = new THREE.Vector3(), _skF = new THREE.Vector3(), _skL = new THREE.Vector3(), _skN = new THREE.Vector3(), _skQ = new THREE.Quaternion(), _skP = new THREE.Quaternion();
    function shinTo(r, yT, tuck) {
      r.fore.getWorldPosition(_skK); r.foot.getWorldPosition(_skA);
      const L = _skK.distanceTo(_skA); if (!(L > 1e-4)) return;
      const dy = Math.max(-L + 1e-4, Math.min(L - 1e-4, yT - _skK.y));
      _skF.set(0, 0, 1).applyQuaternion(_slQ); _skF.y = 0; _skF.normalize();            // (the body's front, flat)
      const ax = _skA.x - _skK.x, az = _skA.z - _skK.z, along = ax * _skF.x + az * _skF.z;
      _skL.set(ax - along * _skF.x, 0, az - along * _skF.z);                            // (the take's reach aside, kept)
      const room = L * L - dy * dy - _skL.lengthSq(), c = room > 0 ? Math.sqrt(room) * (tuck ? -1 : Math.sign(along) || 1) : 0;
      _skN.set(_skK.x + _skL.x + _skF.x * c, _skK.y + dy, _skK.z + _skL.z + _skF.z * c);
      _skA.sub(_skK).normalize(); _skN.sub(_skK).normalize();
      _skQ.setFromUnitVectors(_skA, _skN); r.fore.getWorldQuaternion(_skP); _skQ.multiply(_skP);
      r.fore.parent.getWorldQuaternion(_skP); r.fore.quaternion.copy(_skP.invert().multiply(_skQ)); r.fore.updateWorldMatrix(false, true);
    }
    function seatLegsLay(P) {
      const LG = P.restLegs; if (!LG) return;
      const share = seatShare(P); if (!(share > 0.001)) return;
      P.group.updateWorldMatrix(true, true); P.group.getWorldQuaternion(_slQ);
      for (const S0 in LG.R) { const r = LG.R[S0];
        if (!LG.wrote) { r.qUp.copy(r.up.quaternion); r.qFore.copy(r.fore.quaternion); r.qFoot.copy(r.foot.quaternion);
          if (r.gUp) r.qGUp.copy(r.gUp.quaternion); if (r.gLow) r.qGLow.copy(r.gLow.quaternion); }
        if (r.gUp) { r.up.getWorldQuaternion(_slQ1); r.fore.getWorldQuaternion(_slQ2); r.gUp.getWorldQuaternion(_slQ3); if (r.gLow) r.gLow.getWorldQuaternion(_slQ4); }
        _slA.copy(r.ank); P.group.localToWorld(_slA); _slB.copy(r.pole); P.group.localToWorld(_slB);
        if (LG.keepKnee) shinTo(r, _slA.y, LG.tuck); else armTo({ up: r.up, fore: r.fore, hand: r.foot }, _slA, _slB);
        r.foot.parent.getWorldQuaternion(_hq2); _hq.copy(_slQ).multiply(r.footQ); r.foot.quaternion.copy(_hq2.invert().multiply(_hq)); r.foot.updateWorldMatrix(false, true);
        /* (a graft's thigh turned in the world as his own thigh was, and its shin as his own shin: D = after x before^-1) */
        if (r.gUp) { r.up.getWorldQuaternion(_slQd).multiply(_slQ1.invert()); _slQ3.premultiply(_slQd);
          r.gUp.parent.getWorldQuaternion(_slQp); r.gUp.quaternion.copy(_slQp.invert().multiply(_slQ3)); r.gUp.updateWorldMatrix(false, true);
          if (r.gLow) { r.fore.getWorldQuaternion(_slQd).multiply(_slQ2.invert()); _slQ4.premultiply(_slQd);
            r.gLow.parent.getWorldQuaternion(_slQp); r.gLow.quaternion.copy(_slQp.invert().multiply(_slQ4)); r.gLow.updateWorldMatrix(false, true); } }
        /* (part of the way, while he goes from sitting to standing or back: each turn eased from the take's own) */
        if (share < 0.999) { for (const [b, q0] of [[r.up, r.qUp], [r.fore, r.qFore], [r.foot, r.qFoot], [r.gUp, r.qGUp], [r.gLow, r.qGLow]]) { if (!b) continue;
            _slT.copy(b.quaternion); b.quaternion.copy(q0).slerp(_slT, share); }
          r.up.updateWorldMatrix(false, true); if (r.gUp) r.gUp.updateWorldMatrix(false, true); } }
      LG.wrote = true;
    }
    /* A HAND OF ONE PIECE, MEASURED (tools/probes/handaxes.mjs reads the same from the file): its skin in the hand bone's
       own bind frame, and its three axes (the longest is the fingers' line, signed toward the tip bone; the shortest, the
       palm's facing, signed toward his middle as his arms hang at his sides in the bind pose); how long the hand is
       along its fingers and how far the palm's skin stands from the bone. Chad's monk's tip bone lies 27 to 31 degrees
       off his fingers' line: laid by it, his two hands met only at the heels, in a V */
    function handAxes(P, A, sd) {
      const a = A[sd], hand = a.hand, tip = hand.children.find(ch => ch.isBone), pts = [], S0 = sd === 'L' ? 'Left' : 'Right', v = new THREE.Vector3(); let ri = null;
      for (const o of P.lv[1] || []) { if (!o.skeleton) continue; const bi = o.skeleton.bones.indexOf(hand), ti = tip ? o.skeleton.bones.indexOf(tip) : -1, sI = o.geometry.attributes.skinIndex, sW = o.geometry.attributes.skinWeight; if (bi < 0 || !sI || !sW) continue;
        const bw = new THREE.Matrix4().copy(o.skeleton.boneInverses[bi]).invert(); if (!ri) ri = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(bw)).invert();
        const pos = o.geometry.attributes.position, bwI = o.skeleton.boneInverses[bi];
        for (let i = 0; i < pos.count; i++) { let w = 0; for (let k = 0; k < 4; k++) { const j = sI.getComponent(i, k); if (j === bi || (ti >= 0 && j === ti)) w += sW.getComponent(i, k); } if (w < 0.6) continue;
          v.fromBufferAttribute(pos, i).applyMatrix4(o.bindMatrix).applyMatrix4(bwI); pts.push(v.clone()); } }
      if (pts.length < 30 || !ri) { console.warn(P.key + ': too little skin on his ' + S0 + ' hand to measure'); return null; }
      const mean = new THREE.Vector3(); for (const q of pts) mean.add(q); mean.multiplyScalar(1 / pts.length);
      const Cv = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; for (const q of pts) { const d = [q.x - mean.x, q.y - mean.y, q.z - mean.z]; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) Cv[r][c] += d[r] * d[c]; }
      const axes = []; for (let e = 0; e < 3; e++) { let x = [0.3 + e, 0.7, 0.2 - e];
        for (let it = 0; it < 300; it++) { x = [0, 1, 2].map(r => Cv[r][0] * x[0] + Cv[r][1] * x[1] + Cv[r][2] * x[2]); const l = Math.hypot(x[0], x[1], x[2]) || 1; x = x.map(u => u / l); }
        const lam = [0, 1, 2].reduce((sm, r) => sm + (Cv[r][0] * x[0] + Cv[r][1] * x[1] + Cv[r][2] * x[2]) * x[r], 0); axes.push(new THREE.Vector3(x[0], x[1], x[2]));
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) Cv[r][c] -= lam * x[r] * x[c]; }
      const fL = axes[0].clone(); if (tip ? fL.dot(tip.position) < 0 : fL.dot(a.fL) < 0) fL.negate();
      let len = 0; for (const q of pts) len = Math.max(len, q.dot(fL));
      const nL = axes[2].clone().addScaledVector(fL, -axes[2].dot(fL)).normalize();
      { const bw = nL.clone().applyQuaternion(ri.clone().invert()); if (bw.x * (S0 === 'Left' ? 1 : -1) > 0) nL.negate(); }
      const ds = pts.map(q => q.dot(nL)).sort((x, y) => x - y);
      return { fL, nL, aL: new THREE.Vector3().crossVectors(nL, fL).normalize(), len, depth: ds[Math.floor(ds.length * 0.97)] };
    }
    function restHands(P, K = {}) {
      const A = P && P.ready ? armsOf(P) : null, skins = P.lv[1]; P.restHands = null; P.restRep = null;
      if (!A || !skins || !skins.length) return null;
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      armsBack(P); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true);
      if (P.upr) { uprightLay(P); P.group.updateMatrixWorld(true); }
      /* (his legs where his seat lays them: the lap the hands lie on is theirs) */
      if (P.restLegs) { seatLegsLay(P); P.group.updateMatrixWorld(true); }
      /* (the take's own turns kept, so that what is solved here is taken off again: armsBack) */
      for (const sd in A) { const a = A[sd]; a.qUp.copy(a.up.quaternion); a.qFore.copy(a.fore.quaternion); a.qHand.copy(a.hand.quaternion); a.wrote = true; }
      const loc = (b, out) => { b.getWorldPosition(out); return P.group.worldToLocal(out); };
      const R = {}, rep = {};
      /* how 'lap': his body without his arms, as heights over the ground on a grid in his own frame */
      const CELL = 0.012, X0 = -0.6, Z0 = -0.6, NX = 100, NZ = 112, H = new Float32Array(NX * NZ).fill(-Infinity), v = new THREE.Vector3();
      /* (and the same points in cells of 3 cm, so an arm can be swept through him at its own thickness: clearSeg) */
      const VC = 0.03, vox = new Map(), vk = (x, y, z) => ((Math.floor(x / VC) + 512) * 1024 + (Math.floor(y / VC) + 512)) * 1024 + (Math.floor(z / VC) + 512);
      /* (the heights are his LAP's: nothing over his hip joints by more than 30 cm is read into them. Sought nearer his
         hips, a palm's place came under his face, and the highest thing drawn there was his nose) */
      const hipB = bone('Hips'), LAPTOP = hipB ? loc(hipB, new THREE.Vector3()).y + 0.3 : Infinity;
      for (const q of skins) { const pos = q.geometry.attributes.position, si = q.geometry.attributes.skinIndex, sw = q.geometry.attributes.skinWeight; if (!pos || !si || !sw || !q.skeleton) continue;
        const arm = q.skeleton.bones.map(b => /(Shoulder|Arm|Hand)|^Drape/.test(b.name));
        const SM = FASTSKIN ? skinMats(q) : null;
        for (let i = 0; i < pos.count; i++) { let a = 0; for (let c = 0; c < 4; c++) if (arm[si.getComponent(i, c)]) a += sw.getComponent(i, c); if (a > 0.3) continue;
          if (SM) skinVertex(q, i, v, SM); else q.getVertexPosition(i, v); v.applyMatrix4(q.matrixWorld); P.group.worldToLocal(v);
          { const k = vk(v.x, v.y, v.z); let L = vox.get(k); if (!L) vox.set(k, L = []); L.push(v.x, v.y, v.z); }
          if (v.y > LAPTOP) continue;
          const cx = Math.round((v.x - X0) / CELL), cz = Math.round((v.z - Z0) / CELL); if (cx < 0 || cz < 0 || cx >= NX || cz >= NZ) continue; if (v.y > H[cz * NX + cx]) H[cz * NX + cx] = v.y; } }
      const H2 = new Float32Array(NX * NZ); for (let cz = 0; cz < NZ; cz++) for (let cx = 0; cx < NX; cx++) { let m = -Infinity; for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) { const x = cx + dx, z = cz + dz; if (x >= 0 && z >= 0 && x < NX && z < NZ && H[z * NX + x] > m) m = H[z * NX + x]; } H2[cz * NX + cx] = m; }
      const top = (x, z) => { const cx = Math.round((x - X0) / CELL), cz = Math.round((z - Z0) / CELL); return cx < 0 || cz < 0 || cx >= NX || cz >= NZ ? -Infinity : H2[cz * NX + cx]; };
      const OUT = K.out != null ? K.out : 0.01, TURN = K.turn != null ? K.turn : 0.2, OFF0 = K.off != null ? K.off : 0.022, RATIO = K.ratio != null ? K.ratio : 0.87;
      const CURL = K.curl || [0.22, 0.38, 0.22], SPREAD = [1.0, 1.06, 1.14, 1.24];
      /* (is anything drawn of him within r of p? and is a segment clear of him at that thickness, from `from` of its
         length on, a ball of radius skipR about skipC aside: the cloth a palm lies on) */
      const nearBody = (p, r) => { const n = Math.ceil(r / VC), cx = Math.floor(p.x / VC), cy = Math.floor(p.y / VC), cz = Math.floor(p.z / VC), r2 = r * r;
        for (let dx = -n; dx <= n; dx++) for (let dy = -n; dy <= n; dy++) for (let dz = -n; dz <= n; dz++) {
          const L = vox.get(((cx + dx + 512) * 1024 + (cy + dy + 512)) * 1024 + (cz + dz + 512)); if (!L) continue;
          for (let i = 0; i < L.length; i += 3) { const x = L[i] - p.x, y = L[i + 1] - p.y, z = L[i + 2] - p.z; if (x * x + y * y + z * z < r2) return true; } }
        return false; };
      const clearSeg = (A0, B0, r, from, skipC, skipR) => { const p = new THREE.Vector3();
        for (let s = 0; s <= 12; s++) { const u = from + (1 - from) * s / 12; p.lerpVectors(A0, B0, u); if (skipC && p.distanceTo(skipC) < skipR) continue; if (nearBody(p, r)) return false; }
        return true; };
      for (const [sd, S0, sg] of [['L', 'Left', 1], ['R', 'Right', -1]]) {
        const a = A[sd], bu = bone(S0 + 'UpLeg'), bk = bone(S0 + 'Leg'); if (!bu || !bk) continue;
        const U = loc(bu, new THREE.Vector3()), Kn = loc(bk, new THREE.Vector3()), Sh = loc(a.up, new THREE.Vector3()), E0 = loc(a.fore, new THREE.Vector3()), W0 = loc(a.hand, new THREE.Vector3());
        const la = Sh.distanceTo(E0), lb = E0.distanceTo(W0), th = new THREE.Vector3(Kn.x - U.x, 0, Kn.z - U.z).normalize(), across = new THREE.Vector3(th.z, 0, -th.x); if (across.x * sg < 0) across.negate();
        const HM = a.fingers ? null : handAxes(P, A, sd), PALM = HM ? HM.len * 0.45 : a.palm, OFF = HM ? Math.max(0.015, HM.depth) : OFF0;
        const phi = -sg * TURN, fh = new THREE.Vector3(th.x * Math.cos(phi) + th.z * Math.sin(phi), 0, -th.x * Math.sin(phi) + th.z * Math.cos(phi));
        let best = null;
        /* (WHERE ON THE THIGH. With `at`, the palm there or as near it as his arm reaches. Without, wherever along the
           thigh leaves his elbow bent as a resting arm is bent: the reach from his shoulder to his wrist `ratio` of the
           arm's whole length (0.87: about 120 degrees inside the elbow). At a fixed share of the thigh, the long arms of
           the two monks made here reached their knees all but straight: photographed full size, 12 Nov) */
        /* (the hand's frame with its palm's middle at Cp and its fingers toward d seen from above: the fingers following
           the cloth's slope along d, the palm facing the cloth. A hand at rest lies within twenty degrees of level along
           its fingers, and its palm within twenty-five of facing straight down: the cloth's slope is followed only that far) */
        const frameAt = (Cp, d) => { const e = 0.03, cx = Cp.x, cz = Cp.z, sl = (top(cx + d.x * e, cz + d.z * e) - top(cx - d.x * e, cz - d.z * e)) / (2 * e), gx = (top(cx + 0.025, cz) - top(cx - 0.025, cz)) / 0.05, gz = (top(cx, cz + 0.025) - top(cx, cz - 0.025)) / 0.05;
          if (!isFinite(sl) || !isFinite(gx) || !isFinite(gz)) return null;
          const f = new THREE.Vector3(d.x, Math.max(-0.36, Math.min(0.15, sl)), d.z).normalize(), nS = new THREE.Vector3(-gx, 1, -gz).normalize();
          if (nS.y < Math.cos(0.44)) { const hz = Math.hypot(nS.x, nS.z) || 1; nS.set(nS.x / hz * Math.sin(0.44), Math.cos(0.44), nS.z / hz * Math.sin(0.44)); }
          /* (K.palmUp, v26.6: THE PALM TURNED UP, the hand's back on the cloth, for a body whose take holds its forearms
             rolled palm up: the hermit in the pale yellow shawl's wrists stood wrung 56 to 77 degrees at every setting of
             a palm laid down. A seated sage's hands rest so on his knees as often as palm down. Absent, all as it was) */
          const n = K.palmUp ? nS.clone() : nS.clone().negate(); n.addScaledVector(f, -n.dot(f)).normalize();
          /* (K.palmTilt, v26.6: { L, R } radians, the palm turned about the fingers' line toward his middle, the hand on its
             little finger's edge that much: a resting hand lies so as often as flat, and the forearm turns that much less.
             Absent, flat as before) */
          const tilt = K.palmTilt && K.palmTilt[sd]; if (tilt) n.applyAxisAngle(f, sg * (K.palmUp ? -tilt : tilt)).normalize();
          return { f, n, W: Cp.clone().addScaledVector(f, -PALM).addScaledVector(n, K.palmUp ? OFF : -OFF) }; };
        const ts = K.at != null ? Array.from({ length: 13 }, (_, k) => K.at - 0.04 * k) : Array.from({ length: 15 }, (_, k) => 0.28 + 0.04 * k);
        for (const t of ts) {
          /* (on the CREST of what is drawn over the thigh: the highest point across its line within six centimetres of
             `out`, the inner one where two are within 4 mm. Laid where the robe falls away down the thigh's outer side,
             a hand followed that slope and hung down it, fingers to the floor: photographed on monk B's left, 12 Nov) */
          /* (`inner`: how far toward his middle the crest may be sought. On a robe that drapes one lap over both knees the
             crest is between them, and both hands went to it, one on the other: photographed on Chad's monk) */
          let cx = 0, cz = 0, cy = -Infinity;
          for (let o = -(K.inner != null ? K.inner : 0.06); o <= 0.0601; o += 0.01) { const x = U.x + (Kn.x - U.x) * t + across.x * (OUT + o), z = U.z + (Kn.z - U.z) * t + across.z * (OUT + o), y = top(x, z); if (y > cy + 0.004) { cx = x; cz = z; cy = y; } }
          if (!(cy > 0.05)) continue;
          const Cp = new THREE.Vector3(cx, cy, cz), fr = frameAt(Cp, fh); if (!fr) continue;
          const { f, n, W } = fr, dS = W.distanceTo(Sh);
          if (dS > la + lb - 0.012 || dS < Math.abs(la - lb) + 0.03) continue;
          /* (and nearer the thigh's middle where the reach cannot be had: where every place on it left his arm straighter
             than that, the nearest to his shoulder was his hip crease, and his elbow went out to his side as a hand on a
             hip does: Chad's monk's right, photographed full size, 12 Nov) */
          const score = K.at != null ? 0 : Math.abs(dS / (la + lb) - RATIO) + 0.25 * Math.abs(t - 0.55);
          if (!best || score < best.score) best = { t, Cp, W, f, n, score, ratio: dS / (la + lb) };
          if (K.at != null) break; }
        if (!best) { console.warn(P.key + ': his ' + S0 + ' hand cannot reach his thigh: left as the take has it'); continue; }
        /* (his elbow's HINGE, read off the take he rests in. The takes on these rigs keep the forearm in one plane of the
           upper arm's frame, 0.0 degrees out of it at every key (masters/v25.3/measure/hinge.cjs, run on each monk's
           file: the tracker's §15.3), so one flexed moment names it; and the forearm's turn about its own line is kept as
           the take has it, as theirs never roll it) */
        if (!a.hinge) { const uL = a.fore.position.clone().normalize(), dL = a.hand.position.clone().normalize().applyQuaternion(a.fore.quaternion);
          const h = new THREE.Vector3().crossVectors(uL, dL); if (h.length() < 0.08) h.set(0.8, 0, sg > 0 ? -0.6 : 0.6); h.normalize();
          const flex = Math.atan2(new THREE.Vector3().crossVectors(uL, dL).dot(h), uL.dot(dL));
          a.hinge = { uL, h, rest: new THREE.Quaternion().setFromAxisAngle(h, -flex).multiply(a.fore.quaternion) }; }
        /* THE ELBOW (12 Nov, the first pictures of it seen full size: both elbows had gone back and IN, inside his flank,
           and each forearm came out through the roll of his robe at his waist). An arm at rest has its elbow behind the
           line from the shoulder to the wrist and below it, turned out from the side only as far as it must be: so it is
           turned out from straight behind a step at a time until the upper arm and the forearm, each swept at its own
           thickness, pass clear of what is drawn of him without his arms (the cloth under the palm aside). The arm is
           then solved as an arm, about its own elbow's hinge (armHinge) */
        const back = th.clone().negate();
        const findElbow = (Wt, Cpt) => { const T = Wt.clone().sub(Sh).normalize(), dW = Math.min(Sh.distanceTo(Wt), la + lb - 1e-3), ca = (la * la + dW * dW - lb * lb) / (2 * la * dW), sa = Math.sqrt(Math.max(0, 1 - ca * ca));
          let B = across.clone();
          for (let psi = 0.35; psi <= 1.56; psi += 0.087) {
            const Bp = back.clone().multiplyScalar(Math.cos(psi)).addScaledVector(across, Math.sin(psi)); Bp.y -= 0.4;
            Bp.addScaledVector(T, -Bp.dot(T)); if (Bp.lengthSq() < 1e-8) continue; B = Bp.normalize();
            const E = Sh.clone().addScaledVector(T, la * ca).addScaledVector(B, la * sa);
            if (clearSeg(Sh, E, 0.045, 0.3) && clearSeg(E, Wt, 0.035, 0, Cpt, 0.12)) return { pdir: B, psi, E, clear: true }; }
          return { pdir: B, psi: 1.56, E: Sh.clone().addScaledVector(T, la * ca).addScaledVector(B, la * sa), clear: false }; };
        let el = findElbow(best.W, best.Cp);
        /* (THE HAND ALONG ITS FOREARM: its fingers carried on along the forearm's own line seen from above, a quarter of
           the way toward the thigh's, and the elbow found again for that wrist. Laid along the thigh while the forearm came
           in from his side, each wrist was bent sideways, by up to fifty degrees: photographed full size, 12 Nov) */
        /* (K.along, v26.7: the forearm's share of that line; K.alongIt, how many times the step is taken, the elbow
           found again for each new wrist; K.handYaw { L, R }, radians the line is then turned about the upright before
           the hand is laid along it. At a quarter toward the thigh, the hermit in the pale yellow shawl's left hand,
           palm up, stood bent 35 degrees toward its little finger, the end of a real wrist's range (jointscan, v26.7's
           build); the whole way along the forearm four times over, the elbow moved each time and left the wrist bent 38
           to 47 degrees toward the thumb and the forearm wrung 115 to 122. Absent, a share of 0.75 and one step, as before) */
        { const SH = K.along != null ? K.along : 0.75, IT = K.alongIt || 1, YW = K.handYaw && K.handYaw[sd];
          for (let it = 0; it < IT; it++) { const fa = best.W.clone().sub(el.E); fa.y = 0;
            if (!(fa.lengthSq() > 1e-6)) break; const d2 = fa.normalize().multiplyScalar(SH).addScaledVector(th, 1 - SH); d2.y = 0; d2.normalize();
            if (YW) d2.applyAxisAngle(new THREE.Vector3(0, 1, 0), YW); const fr = frameAt(best.Cp, d2);
            if (!(fr && fr.W.distanceTo(Sh) < la + lb - 0.012)) break; best.f = fr.f; best.n = fr.n; best.W = fr.W; el = findElbow(best.W, best.Cp); } }
        /* (K.flexMax, v26.3: THE WRIST KEPT NEAR STRAIGHT. The brown hermit's body is short from hip to shoulder, so his
           elbow hangs at the height of his knees and his forearm climbs to them; his hand, laid along the cloth where it
           falls away over the knee, was bent down at the wrist 40 degrees (measured, tools/probes/jointscan.mjs; a real
           man's palm rests on top of the knee with the wrist near straight and only the fingers curving down over it:
           masters/v26.3/make.sh). So the hand is turned up about its own across-axis, its palm's middle where it was,
           until it bends toward the palm no more than flexMax from the forearm's line, the elbow found again each time) */
        const flexHold = () => { for (let it = 0; it < 4; it++) {
          const e = best.W.clone().sub(el.E).normalize(), f = best.f, n = best.n, ne = n.clone().addScaledVector(e, -n.dot(e)); if (ne.lengthSq() < 1e-8) break; ne.normalize();
          const flex = Math.atan2(f.dot(ne), f.dot(e)); if (flex <= K.flexMax + 0.005) break;
          const ax = new THREE.Vector3().crossVectors(n, f).normalize(), q = new THREE.Quaternion().setFromAxisAngle(ax, flex - K.flexMax);
          best.f = f.clone().applyQuaternion(q).normalize(); best.n = n.clone().applyQuaternion(q).normalize();
          best.W = best.Cp.clone().addScaledVector(best.f, -PALM).addScaledVector(best.n, K.palmUp ? OFF : -OFF);
          el = findElbow(best.W, best.Cp); } };
        if (K.flexMax != null) flexHold();
        /* (K.wristSolve, v26.7: THE HAND'S LINE SOLVED AGAINST ITS FOREARM. Laid along a line of fixed shares (above),
           the hermit in the pale yellow shawl's left wrist, palm up, stood 35 degrees toward its little finger; a whole
           share, 40 the same way; turned 26 degrees by hand either way, 35 toward the thumb or 50 toward the little
           finger, the forearm wrung past its range (jointscan, v26.7): each new wrist moves the elbow found for it. So
           the hand's line over the cloth is tried every four degrees within sixty either side of where it stands, the
           elbow found for each, and the one kept whose wrist is nearest straight with its forearm turned within a
           forearm's range and its elbow clear of him, each measured as tools/probes/jointscan.mjs measures it) */
        /* (K.flexAfter, v26.8: THE WRIST KEPT NEAR STRAIGHT WHILE ITS LINE IS SOLVED. wristSolve lays the hand again along the
           cloth's slope for each line it tries and lets the wrist bend toward the palm up to 25 degrees; on a body whose rest
           holds it to flexMax (the brown hermit's, v26.3) each line tried is held to flexMax first, its elbow found again,
           and only then measured. Held after the pick instead, the hold moved his elbow and undid the pick: his left wrist
           stood 25 to 34 degrees toward its little finger, worse than the 20 to 27 it was mended for (jointscan, v26.9's
           first build). holdOf is flexHold's own turn, on a line being tried. Absent, all as it was) */
        const holdOf = (fr, e0) => { let f = fr.f, n = fr.n, W = fr.W, e1 = e0;
          for (let it = 0; it < 4; it++) { const e = W.clone().sub(e1.E).normalize(), ne = n.clone().addScaledVector(e, -n.dot(e)); if (ne.lengthSq() < 1e-8) break; ne.normalize();
            const flex = Math.atan2(f.dot(ne), f.dot(e)); if (flex <= K.flexMax + 0.005) break;
            const ax = new THREE.Vector3().crossVectors(n, f).normalize(), q = new THREE.Quaternion().setFromAxisAngle(ax, flex - K.flexMax);
            f = f.clone().applyQuaternion(q).normalize(); n = n.clone().applyQuaternion(q).normalize();
            W = best.Cp.clone().addScaledVector(f, -PALM).addScaledVector(n, K.palmUp ? OFF : -OFF); e1 = findElbow(W, best.Cp); }
          return { fr: { f, n, W }, el: e1 }; };
        if (K.wristSolve) { const wsUp = new THREE.Vector3(0, 1, 0), wsD0 = new THREE.Vector3(best.f.x, 0, best.f.z), DG = 180 / Math.PI;
          if (wsD0.lengthSq() > 1e-8) { wsD0.normalize(); let wsPick = null;
            for (let wsK = -15; wsK <= 15; wsK++) { let wsFr = frameAt(best.Cp, wsD0.clone().applyAxisAngle(wsUp, wsK * 4 / DG)); if (!wsFr || wsFr.W.distanceTo(Sh) >= la + lb - 0.012) continue;
              let wsEl = findElbow(wsFr.W, best.Cp); if (!wsEl.clear) continue;
              if (K.flexAfter && K.flexMax != null) { const wsH = holdOf(wsFr, wsEl); wsFr = wsH.fr; wsEl = wsH.el; if (!wsEl.clear) continue; }
              const wsE = wsFr.W.clone().sub(wsEl.E).normalize(), wsU = wsEl.E.clone().sub(Sh).normalize(), wsRad = new THREE.Vector3().crossVectors(wsFr.n, wsFr.f).multiplyScalar(sg);
              const wsRe = wsRad.clone().addScaledVector(wsE, -wsRad.dot(wsE)).normalize(), wsNe = wsFr.n.clone().addScaledVector(wsE, -wsFr.n.dot(wsE)).normalize();
              const wsDev = Math.atan2(wsFr.f.dot(wsRe), wsFr.f.dot(wsE)) * DG, wsFlex = Math.atan2(wsFr.f.dot(wsNe), wsFr.f.dot(wsE)) * DG;
              const wsMed = new THREE.Vector3().crossVectors(wsU, wsE).normalize().multiplyScalar(sg), wsDn = wsU.clone().addScaledVector(wsE, -wsU.dot(wsE)).normalize();
              const wsTurn = Math.atan2(wsNe.dot(wsDn), wsNe.dot(wsMed)) * DG;
              const wsC = Math.max(0, Math.abs(wsDev) - 8) ** 2 + 2 * Math.max(0, Math.abs(wsTurn) - 85) ** 2 + Math.max(0, Math.abs(wsFlex) - 25) ** 2 + 0.01 * wsK * wsK;
              if (!wsPick || wsC < wsPick.c) wsPick = { c: wsC, fr: wsFr, el: wsEl, dev: wsDev, turn: wsTurn, flex: wsFlex, yaw: wsK * 4 }; }
            if (wsPick) { best.f = wsPick.fr.f; best.n = wsPick.fr.n; best.W = wsPick.fr.W; el = wsPick.el;
              best.solve = { yaw: wsPick.yaw, dev: +wsPick.dev.toFixed(1), turn: +wsPick.turn.toFixed(1), flex: +wsPick.flex.toFixed(1) }; } } }
        if (!el.clear) console.warn(P.key + ': his ' + S0 + ' arm finds no way clear of his body: laid turned out as far as was tried');
        const pdir = el.pdir, psiAt = el.psi;
        /* the fingers: his file's own at rest, each joint curled toward the palm about the hand's own across-axis,
           worked out once in the hand's own frame */
        /* (K.gather, v26.3: THE FINGERS TOGETHER. A hand at rest on a knee holds its fingers side by side; the brown
           hermit's file rests them apart, and laid from it his fingers stood 12 to 16 degrees apart, gaps a rake's:
           Chad, 13 Nov 2026, "You dont see the problem with the hands and fingers?". Each finger's first joint is turned
           about the palm's facing toward the middle finger's line, by `gather` of what it stands apart at rest) */
        let gat = null;
        if (K.gather) { const mh = bindWorldOf(P, a.hand); if (mh) { const rh = new THREE.Quaternion(); mh.decompose(new THREE.Vector3(), rh, new THREE.Vector3()); rh.invert();
          const dirOf = (fn) => { const b1 = bone(S0 + 'Hand' + fn + '1'), b2 = bone(S0 + 'Hand' + fn + '2'), m1 = b1 && bindWorldOf(P, b1), m2 = b2 && bindWorldOf(P, b2); if (!m1 || !m2) return null;
            const dd = new THREE.Vector3().setFromMatrixPosition(m2).sub(new THREE.Vector3().setFromMatrixPosition(m1)).applyQuaternion(rh); return Math.atan2(dd.dot(a.aL), dd.dot(a.fL)); };
          const tl = FINGERS.map(dirOf), tm = tl[1]; if (tm != null) gat = tl.map(t0 => t0 == null ? 0 : -K.gather * (t0 - tm));
          /* (K.converge: TOUCHING, NOT ONLY PARALLEL. Drawn together to his middle finger's line, his fingers lay side by
             side with a gap between each, being thinner than his knuckles are apart (photographed, v26.3, after the
             scan read them 0 to 2 degrees apart). A resting hand's fingers aim a little in, at a point some way before
             the middle knuckle, and touch: each finger's first joint is turned to aim at that point, K.converge metres
             before the middle knuckle along the middle finger's line) */
          if (K.converge && tm != null) { const kn = (fn) => { const b1 = bone(S0 + 'Hand' + fn + '1'), m1 = b1 && bindWorldOf(P, b1); return m1 ? new THREE.Vector3().setFromMatrixPosition(m1) : null; };
            const pm = kn('Middle'), ph0 = new THREE.Vector3().setFromMatrixPosition(mh); if (pm) {
              const toH = (w) => w.clone().sub(ph0).applyQuaternion(rh), pmH = toH(pm);
              const cH = pmH.clone().addScaledVector(a.fL, Math.cos(tm) * K.converge).addScaledVector(a.aL, Math.sin(tm) * K.converge);
              gat = FINGERS.map((fn, fi) => { const pk = kn(fn); if (!pk || tl[fi] == null) return 0; const dd = cH.clone().sub(toH(pk)); return Math.atan2(dd.dot(a.aL), dd.dot(a.fL)) - tl[fi]; }); } } } }
        /* (a finger's three turns at a curl of k times CURL: kept, so that K.drape can find each finger's own) */
        const fingerQs = (fi, k) => { const out = []; let rel = new THREE.Quaternion(); const ax = a.aL.clone();
          for (let j = 1; j <= 3; j++) { const b = bone(S0 + 'Hand' + FINGERS[fi] + j); if (!b) break; const q0 = bindLocal(P, b); if (!q0) break;
            /* (this joint's parent turned in the hand's frame is `rel`; the across-axis in that parent's frame) */
            /* (toward the palm is a turn the other way about the across-axis: armsOf's aL is the palm's facing crossed
               with the fingers' line, and a finger turned about the fingers' line crossed with the palm's facing goes
               toward the palm) */
            const axP = ax.clone().applyQuaternion(rel.clone().invert()).normalize(), ang = CURL[j - 1] * SPREAD[fi] * k;
            const qj = new THREE.Quaternion().setFromAxisAngle(axP, -ang);
            if (j === 1 && gat) qj.multiply(new THREE.Quaternion().setFromAxisAngle(a.nL, gat[fi]));
            qj.multiply(q0);
            out.push({ b, q: qj, fi }); rel = rel.multiply(qj); }
          return out; };
        const fing = []; for (let fi = 0; fi < FINGERS.length; fi++) fing.push(...fingerQs(fi, 1));
        /* (K.thumb 'bind', v26.7: THE THUMB AS HIS FILE RESTS IT. A take's thumb is posed for the hand it was made with,
           and a palm turned up carries it with the palm: the hermit in the pale yellow shawl's thumbs stood lifted 42
           degrees off his palms and turned across them, toward his little fingers, pointing up (measured; the reference
           picture's lie out beside the palm, barely lifted). His file's own rest has each thumb 26 degrees out from his
           index finger and 11 to 18 off the palm: laid so, joint by joint, while the rest is laid. Absent, the take's) */
        if (K.thumb === 'bind') for (let j = 1; j <= 3; j++) { const b = bone(S0 + 'HandThumb' + j), q0 = b && bindLocal(P, b); if (q0) fing.push({ b, q: q0, fi: -1 }); }
        R[sd] = { W: best.W, pdir, f: best.f, n: best.n, fing, fingerQs };
        if (K.follow && K.follow[sd]) { const fl = K.follow[sd].map(nm => P.bone[nm]).filter(b => b && b.parent === a.up.parent).map(b => ({ b, q: new THREE.Quaternion(), on: false })); if (fl.length) R[sd].fol = fl; else console.warn(P.key + ': K.follow names no brother of his ' + sd + ' upper arm'); }
        /* (a hand of one piece is laid by its own measured axes: armsOf's, for a hand with no finger bones, is the
           forearm's line carried on) */
        if (!a.fingers) { const m = handAxes(P, A, sd); if (m) { R[sd].fL = m.fL; R[sd].nL = m.nL; R[sd].aL = m.aL; } }
        rep[sd] = { at: +best.t.toFixed(2), reach: +best.ratio.toFixed(3), turnedOut: +(psiAt * 180 / Math.PI).toFixed(0), palm: best.Cp.toArray().map(u => +u.toFixed(3)) }; if (best.solve) rep[sd].solve = best.solve; }
      P.restHands = { how: 'lap', R }; P.restRep = rep;
      /* (once laid, the elbow and the wrist's bend are read and reported: what a picture of it must agree with) */
      restHandsLay(P); P.group.updateMatrixWorld(true);
      /* (K.drape, v26.3: EACH FINGER CURLED UNTIL ITS TIP RESTS ON WHAT IS DRAWN OF HIS LAP, r over it: a palm on top of a
         knee has its fingers curving down over the kneecap's front, each as far as it reaches the cloth, no further and no
         less. Found finger by finger by halving, on the curl from 0.3 to `max` times CURL) */
      if (K.drape && !K.palmUp) { for (const sd in R) { const S0 = sd === 'L' ? 'Left' : 'Right', r = R[sd]; if (!r.fingerQs) continue; const kk = [];
          for (let fi = 0; fi < FINGERS.length; fi++) {
            const t4 = bone(S0 + 'Hand' + FINGERS[fi] + '4'), t3 = bone(S0 + 'Hand' + FINGERS[fi] + '3'); if (!t3) { kk.push(null); continue; }
            const tipAt = (out) => { if (t4) t4.getWorldPosition(out); else { t3.getWorldPosition(out); const e3 = t3.matrixWorld.elements; out.add(new THREE.Vector3(e3[4], e3[5], e3[6]).normalize().multiplyScalar(0.02)); } return P.group.worldToLocal(out); };
            const tryK = (kv) => { const qs = r.fingerQs(fi, kv); for (const F of qs) F.b.quaternion.copy(F.q); if (qs[0]) qs[0].b.updateWorldMatrix(false, true); const tp = tipAt(new THREE.Vector3()); return tp.y - top(tp.x, tp.z) - (K.drape.r != null ? K.drape.r : 0.008); };
            if (!isFinite(tryK(1))) { kk.push(null); for (const F of r.fing) if (F.fi === fi) F.b.quaternion.copy(F.q); continue; }
            let lo = K.drape.min != null ? K.drape.min : 0.3, hi = K.drape.max || 2, k = 1;
            for (let it = 0; it < 12; it++) { k = 0.5 * (lo + hi); const gk = tryK(k); if (!isFinite(gk)) break; if (gk > 0) lo = k; else hi = k; }
            kk.push(+k.toFixed(2)); r.fing = r.fing.filter(F => F.fi !== fi).concat(r.fingerQs(fi, k)); }
          rep[sd].drape = kk; }
        restHandsLay(P); P.group.updateMatrixWorld(true); }
      for (const sd in R) { const a = A[sd]; loc(a.up, _rhA); loc(a.fore, _rhB); loc(a.hand, _rhC);
        const fa = _rhC.clone().sub(_rhB).normalize(), bend = Math.acos(Math.max(-1, Math.min(1, fa.dot(R[sd].f)))) * 180 / Math.PI;
        rep[sd].elbow = _rhB.toArray().map(u => +u.toFixed(3)); rep[sd].elbowOut = +((Math.abs(_rhB.x) - Math.abs(_rhA.x))).toFixed(3); rep[sd].wristBend = +bend.toFixed(0); }
      armsBack(P); P.group.updateMatrixWorld(true); return rep;
    }
    /* AN ARM SOLVED AS AN ARM (v25.3's law; episode 4 chapter 2's armSolve, made for any rig whose hinge has been read):
       the elbow on the pole's side of the reach, the upper arm's line run to it with its hinge square to the arm's plane
       (so the shoulder rolls, as a shoulder does), and the forearm flexed about that hinge onto the wrist, its turn about
       its own line kept as the take has it. armTo (chapter 1's) turns each bone by the shortest arc, which bends an
       elbow sideways, out of its hinge: the monks' first rest */
    const _ahS = new THREE.Vector3(), _ahE = new THREE.Vector3(), _ahW = new THREE.Vector3(), _ahT = new THREE.Vector3(), _ahP = new THREE.Vector3(),
          _ahU = new THREE.Vector3(), _ahH = new THREE.Vector3(), _ahZ = new THREE.Vector3(), _ahV = new THREE.Vector3(), _ahZl = new THREE.Vector3(),
          _ahM = new THREE.Matrix4(), _ahM2 = new THREE.Matrix4(), _ahQ = new THREE.Quaternion(), _ahQp = new THREE.Quaternion();
    /* AN ELBOW'S HINGE read off the pose its arm stands in now (the takes on these rigs keep the forearm in one plane of the
       upper arm's frame: masters/v25.3/measure/hinge.cjs), as restHands reads it for the monks; kept on the arm. Read
       before anything is laid on the arm (v26.1, for the woman with the taper) */
    /* (v26.1: `hm`, a hinge MEASURED off another of the body's takes, in the upper arm's own frame. One who stands with her
       arms straight gives no hinge from her rest, and the guess put her elbow's crease 16 degrees off the one her own
       takes bend it about) */
    function hingeOf(a, sg, hm) {
      if (a.hinge) return a.hinge;
      const uL = a.fore.position.clone().normalize(), dL = a.hand.position.clone().normalize().applyQuaternion(a.fore.quaternion);
      const h = hm ? new THREE.Vector3().fromArray(hm) : new THREE.Vector3().crossVectors(uL, dL);
      if (hm) h.addScaledVector(uL, -h.dot(uL)); else if (h.length() < 0.08) h.set(0.8, 0, sg > 0 ? -0.6 : 0.6);
      h.normalize();
      const flex = Math.atan2(new THREE.Vector3().crossVectors(uL, dL).dot(h), uL.dot(dL));
      a.hinge = { uL, h, rest: new THREE.Quaternion().setFromAxisAngle(h, -flex).multiply(a.fore.quaternion) };
      return a.hinge;
    }
    /* (the class of v26.1's first taper: a point that is not a number never reaches a bone. Once NaN is written into an
       arm it stays there, for the take does not write it back, and the arm is not drawn; so it is refused, and said) */
    const armBad = new Set();
    function armHinge(a, target, pdir) {
      if (!(Number.isFinite(target.x + target.y + target.z) && Number.isFinite(pdir.x + pdir.y + pdir.z))) {
        if (!armBad.has(a)) { armBad.add(a); console.warn('armHinge: a target that is not a number, refused'); } return; }
      const G = a.hinge; if (!G) { armTo(a, target, _ahP.copy(target).add(pdir)); return; }
      a.up.updateWorldMatrix(true, true);
      a.up.getWorldPosition(_ahS); a.fore.getWorldPosition(_ahE); a.hand.getWorldPosition(_ahW);
      const la = _ahS.distanceTo(_ahE), lb = _ahE.distanceTo(_ahW);
      _ahT.copy(target).sub(_ahS); const d0 = _ahT.length(); if (d0 < 1e-5 || la < 1e-5 || lb < 1e-5) return;
      _ahT.divideScalar(d0); const d = THREE.MathUtils.clamp(d0, Math.abs(la - lb) + 1e-3, la + lb - 1e-3);
      _ahP.copy(pdir).addScaledVector(_ahT, -pdir.dot(_ahT)); if (_ahP.lengthSq() < 1e-10) return; _ahP.normalize();
      const ca = THREE.MathUtils.clamp((la * la + d * d - lb * lb) / (2 * la * d), -1, 1), sa = Math.sqrt(1 - ca * ca);
      _ahU.copy(_ahT).multiplyScalar(ca).addScaledVector(_ahP, sa);                       // the upper arm's line
      _ahH.crossVectors(_ahP, _ahT).normalize(); _ahZ.crossVectors(_ahU, _ahH);           // its hinge, flexion positive
      _ahV.copy(_ahT).multiplyScalar(d).addScaledVector(_ahU, -la).normalize();          // the forearm's line
      _ahZl.crossVectors(G.uL, G.h);
      _ahM.makeBasis(_ahU, _ahH, _ahZ); _ahM2.makeBasis(G.uL, G.h, _ahZl).transpose(); _ahM.multiply(_ahM2);
      _ahQ.setFromRotationMatrix(_ahM); a.up.parent.getWorldQuaternion(_ahQp); a.up.quaternion.copy(_ahQ.premultiply(_ahQp.invert()));
      a.up.updateWorldMatrix(false, true);
      a.fore.quaternion.setFromAxisAngle(G.h, Math.acos(THREE.MathUtils.clamp(_ahU.dot(_ahV), -1, 1))).multiply(G.rest);
      a.fore.updateWorldMatrix(false, true);
    }
    /* (every frame, after the take has posed him) */
    /* (laid while he RESTS, by the rest take's weight: v26.3, the brown hermit, whose films bless with his hands (handson,
       petals, palmover) out of the same rest. A body with one take, the monks, rests in it always) */
    const _rhT = new THREE.Quaternion();
    function restHandsLay(P) {
      const RH = P.restHands, A = RH ? armsOf(P) : null; if (!A) return;
      const rt = P.rest && P.rest.take; let share = rt && P.w[rt] != null ? Math.min(1, P.w[rt]) : 1;
      /* (v26.18: the takes a rest's hands stay laid through too. The hall's Grandmaster Pho talks with his hands in his lap:
         his talk is a bench's, and its left hand, which lay on his thigh there, hung in the air over his crossed legs) */
      if (RH.hold) for (const k in P.w) if (k !== rt && RH.hold.test(k)) share = Math.min(1, share + P.w[k]);
      /* (v26.18: hands laid for one take only (a kneel), whatever the person's rest is: kneelHands) */
      if (RH.only) { share = 0; for (const k in P.w) if (RH.only.test(k)) share += P.w[k]; share = Math.min(1, share); }
      if (!(share > 0.001)) return;
      P.group.updateWorldMatrix(true, true); P.group.getWorldQuaternion(_rhQ);
      for (const sd in RH.R) { const a = A[sd], r = RH.R[sd];
        if (!a.wrote) { a.qUp.copy(a.up.quaternion); a.qFore.copy(a.fore.quaternion); a.qHand.copy(a.hand.quaternion); a.wrote = true; }
        _rhA.copy(r.W); P.group.localToWorld(_rhA); _rhB.copy(r.pdir).applyQuaternion(_rhQ);
        armHinge(a, _rhA, _rhB);
        _rhC.copy(r.f).applyQuaternion(_rhQ); _rhD.copy(r.n).applyQuaternion(_rhQ);
        _ha.crossVectors(_rhD, _rhC); _hm.makeBasis(_ha, _rhD, _rhC); _hm2.makeBasis(r.aL || a.aL, r.nL || a.nL, r.fL || a.fL).transpose(); _hm.multiply(_hm2); _hq.setFromRotationMatrix(_hm);
        a.hand.parent.getWorldQuaternion(_hq2); a.hand.quaternion.copy(_hq2.invert().multiply(_hq)); a.hand.updateWorldMatrix(false, true);
        if (r.fing.length) { if (!a.fing) a.fing = []; if (!a.curled) { a.fingRest = NOGARB ? restList(a, 'frR', r.fing, 1) : r.fing.map(F => ({ b: F.b, q: F.b.quaternion.clone(), i: 1 })); a.curled = true; }
          for (const F of r.fing) F.b.quaternion.copy(F.q); }
        /* (part of the way, while a gesture fades in or out: each turn eased from the take's own) */
        if (share < 0.999) { if (NOGARB) { _rhT.copy(a.up.quaternion); a.up.quaternion.copy(a.qUp).slerp(_rhT, share);
            _rhT.copy(a.fore.quaternion); a.fore.quaternion.copy(a.qFore).slerp(_rhT, share);
            _rhT.copy(a.hand.quaternion); a.hand.quaternion.copy(a.qHand).slerp(_rhT, share); }
          else for (const [b, q0] of [[a.up, a.qUp], [a.fore, a.qFore], [a.hand, a.qHand]]) { _rhT.copy(b.quaternion); b.quaternion.copy(q0).slerp(_rhT, share); }
          if (a.fingRest) for (const F of a.fingRest) { _rhT.copy(F.b.quaternion); F.b.quaternion.copy(F.q).slerp(_rhT, share); }
          a.up.updateWorldMatrix(false, true); }
        /* (v26.18: bones that carry cloth hanging from this arm, and are its upper arm's brothers (his sleeve's drape), are
           given the turn the laying gave the upper arm: left as the take had them, the sleeve stood where the take's arm
           was and the laid arm came through it) */
        if (r.fol) { _rhT.copy(a.qUp).invert().premultiply(a.up.quaternion);
          for (const F of r.fol) { if (!F.on) { F.q.copy(F.b.quaternion); F.on = true; } F.b.quaternion.copy(F.q).premultiply(_rhT); } } }
    }
    /* THE HANDS HELD TRUE (v26.3: Chad, 13 Nov 2026, "You dont see the problem with the hands and fingers?", and of my
       answer, "Stop pretending you know what is the problem"). MEASURED on every person (tools/probes/jointscan.mjs),
       two faults that no real hand makes:
       1. FINGERS BENT SIDEWAYS at their middle and end joints, which are hinges (the brown hermit's grip in v26.2: 54 to
          70 degrees; the hermit in white, the master in white and two of the crowd's bodies in their takes, 30 to 50):
          a take made on another body and carried over by turns puts a finger's bend into a joint whose rest stands
          differently. Each such joint keeps only its turn about its own hinge (the knuckles' line as the body stands at
          rest, in the joint's parent's frame), and never bends backward past HT.back.
       2. A HAND WRUNG ROUND ON ITS FOREARM (my lap rest for the brown hermit: 77 and 111 degrees; the seated takes, 50 to
          64): a rig with no twist bones carries the forearm's whole turn at the wrist, and the skin there twists like a
          sweet's wrapper (the taper woman's, v26.3's first fix of her arm). A forearm turns along its length, so HT.roll of
          the hand's turn about the forearm's line beyond HT.free is laid on the forearm, about its own line, and the hand
          turned back by as much: the hand stays exactly where and as it was.
       3. A FINGER ROLLED ON ITS OWN LINE at its knuckle, which no finger does more than a few degrees: what a take
          carried over by turns leaves there turns the whole finger's bend aside. Its knuckle keeps its bend and its
          spread, and loses the roll.
       Laid last of a body's lays, on every body drawn and on a crowd's drivers (whose bones its members wear; a first
       pass laid it on the near skins only, and the joint scan, which reads every body from wherever it stands, read the
       far ones unmended), and taken off before the mixer runs again (armsBack: the v11.5 law). A body whose
       arm is laid after the people's own tick (the taper woman's, taperTick) says so (P.htLate) and is held true there,
       after it: laid under that lay, the wrist's share would be saved as that lay's rest and laid again every frame */
    const HT = { free: 25 * Math.PI / 180, roll: 0.5, back: -5 * Math.PI / 180 };
    const _htQ = new THREE.Quaternion(), _htQ2 = new THREE.Quaternion();
    function bindWorldOf(P, b) { for (const sm of P.lv[1] || []) { const i = sm.skeleton.bones.indexOf(b); if (i >= 0) return new THREE.Matrix4().copy(sm.skeleton.boneInverses[i]).invert(); } return null; }
    function handsTrueInit(P) {
      P.ht = null; const out = { J: [], W: [], K: [], on: false };
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      for (const [S0, side] of [['Left', 1], ['Right', -1]]) {
        const hand = bone(S0 + 'Hand'), fore = bone(S0 + 'ForeArm'); if (!hand || !fore) continue;
        /* (the wrist: the forearm's line in its own frame, and the hand's turn in it at rest) */
        const qh0 = bindLocal(P, hand);
        if (qh0 && hand.parent === fore && hand.position.lengthSq() > 1e-10) out.W.push({ fore, hand, qh0, ax: hand.position.clone().normalize(), sf: new THREE.Quaternion(), sh: new THREE.Quaternion(), on: false });
        /* (the fingers: the knuckles' line and the palm's facing at rest, in the bind's world) */
        const at = (n) => { const b = bone(S0 + 'Hand' + n), m = b ? bindWorldOf(P, b) : null; return m ? new THREE.Vector3().setFromMatrixPosition(m) : null; };
        const pI = at('Index1'), pM = at('Middle1'), pK = at('Pinky1') || at('Ring1'), mh = bindWorldOf(P, hand); if (!pI || !pM || !pK || !mh) continue;
        const ph = new THREE.Vector3().setFromMatrixPosition(mh), f = pM.clone().sub(ph).normalize(), kl = pI.clone().sub(pK); kl.addScaledVector(f, -kl.dot(f)).normalize();
        const nrm = new THREE.Vector3().crossVectors(f, kl).multiplyScalar(side).normalize();
        for (const fn of ['Index', 'Middle', 'Ring', 'Pinky']) {
          const k1 = bone(S0 + 'Hand' + fn + '1'), k2 = bone(S0 + 'Hand' + fn + '2'), q1 = k1 && bindLocal(P, k1);
          if (k1 && k2 && q1 && k2.parent === k1 && k2.position.lengthSq() > 1e-12) out.K.push({ b: k1, q0: q1, ax: k2.position.clone().normalize(), sv: new THREE.Quaternion(), on: false }); }
        for (const fn of ['Index', 'Middle', 'Ring', 'Pinky']) for (let j = 2; j <= 3; j++) {
          const b = bone(S0 + 'Hand' + fn + j); if (!b || !b.parent) continue;
          const q0 = bindLocal(P, b), mp = bindWorldOf(P, b.parent); if (!q0 || !mp) continue;
          const rp = new THREE.Quaternion(); mp.decompose(new THREE.Vector3(), rp, new THREE.Vector3()); rp.invert();
          const u = b.position.clone(); if (u.lengthSq() < 1e-12) continue; u.normalize();
          const ax = kl.clone().applyQuaternion(rp); ax.addScaledVector(u, -ax.dot(u)); if (ax.lengthSq() < 1e-8) continue; ax.normalize();
          /* (which way about it closes the finger: its next bone turned a little about it, against the palm's facing) */
          const ch = b.children.find(x => x.isBone), c = (ch && ch.position.lengthSq() > 1e-12 ? ch.position.clone() : new THREE.Vector3(0, 1, 0)).normalize().applyQuaternion(q0);
          const np = nrm.clone().applyQuaternion(rp), sg = Math.sign(new THREE.Vector3().crossVectors(ax, c).dot(np)) || 1;
          out.J.push({ b, q0, ax, sg, max: (j === 2 ? 115 : 95) * Math.PI / 180, sv: new THREE.Quaternion(), on: false }); }
      }
      if (out.J.length || out.W.length || out.K.length) P.ht = out;
    }
    function handsTrue(P) {
      if (P.ht === undefined) handsTrueInit(P);
      const H = P.ht; if (!H || H.on) return;
      H.on = true;
      /* 0. each knuckle: its turn from the rest with its roll about the finger's own line taken out (swing kept) */
      for (const R of H.K) { const b = R.b; R.sv.copy(b.quaternion); R.on = true;
        _htQ.copy(R.q0).invert().multiply(b.quaternion);                                         // (its turn from the rest, in its own frame)
        const d = _htQ.x * R.ax.x + _htQ.y * R.ax.y + _htQ.z * R.ax.z, tl = Math.hypot(d, _htQ.w); if (!(tl > 1e-9)) continue;
        _htQ2.set(R.ax.x * d / tl, R.ax.y * d / tl, R.ax.z * d / tl, _htQ.w / tl);                // (the roll)
        b.quaternion.copy(R.q0).multiply(_htQ.multiply(_htQ2.invert())); }
      /* 1. each finger's middle and end joint: only its turn about its own hinge, from the rest */
      for (const R of H.J) { const b = R.b; R.sv.copy(b.quaternion); R.on = true;
        _htQ.copy(R.q0).invert(); _htQ2.copy(b.quaternion).multiply(_htQ);                       // (its turn from the rest, in its parent's frame)
        const d = _htQ2.x * R.ax.x + _htQ2.y * R.ax.y + _htQ2.z * R.ax.z;
        let ang = 2 * Math.atan2(d, _htQ2.w); if (ang > Math.PI) ang -= 2 * Math.PI; if (ang < -Math.PI) ang += 2 * Math.PI;
        const fl = Math.max(HT.back, Math.min(R.max, ang * R.sg));
        b.quaternion.setFromAxisAngle(R.ax, fl * R.sg).multiply(R.q0); }
      /* 2. the hand's turn about the forearm's line, shared with the forearm */
      for (const R of H.W) { R.sf.copy(R.fore.quaternion); R.sh.copy(R.hand.quaternion); R.on = true;
        _htQ.copy(R.qh0).invert(); _htQ2.copy(R.hand.quaternion).multiply(_htQ);                // (the hand's turn from its rest, in the forearm's frame)
        const d = _htQ2.x * R.ax.x + _htQ2.y * R.ax.y + _htQ2.z * R.ax.z;
        let tw = 2 * Math.atan2(d, _htQ2.w); if (tw > Math.PI) tw -= 2 * Math.PI; if (tw < -Math.PI) tw += 2 * Math.PI;
        if (Math.abs(tw) <= HT.free) continue;
        const mv = HT.roll * tw;
        _htQ.setFromAxisAngle(R.ax, mv); R.fore.quaternion.multiply(_htQ);
        _htQ.setFromAxisAngle(R.ax, -mv); R.hand.quaternion.premultiply(_htQ); }
    }
    /* the middle of a person's two hands, in the world (what a raised bowl is stood on) */
    const HANDS = { L: /^(mixamorig:?)?LeftHand$/, R: /^(mixamorig:?)?RightHand$/ };
    function handsMid(P, out) {
      if (!P || !P.ready) return null;
      if (!P.handL) for (const n in P.bone) { if (HANDS.L.test(n)) P.handL = P.bone[n]; if (HANDS.R.test(n)) P.handR = P.bone[n]; }
      if (!P.handL || !P.handR) return null;
      P.group.updateWorldMatrix(true, true);
      P.handL.getWorldPosition(out); P.handR.getWorldPosition(_lkv); return out.add(_lkv).multiplyScalar(0.5);
    }
    /* where a take would hold a person's hands at one of its moments, in the person's own frame (measured, then the
       take the person wears is put back): a body is stood where two pairs of hands can meet on one bowl */
    function handsAt(P, name, t, out, sd) {
      if (!P || !P.ready || !P.acts[name]) return null;
      armsBack(P);
      const keep = {}; for (const k in P.acts) { keep[k] = [P.acts[k].getEffectiveWeight(), P.acts[k].time]; P.acts[k].setEffectiveWeight(k === name ? 1 : 0); }
      const w0 = Object.assign({}, P.w); for (const k in P.w) P.w[k] = k === name ? 1 : 0;
      P.acts[name].time = t; personSettle(P); P.mixer.update(0);
      const ok = handsMid(P, out); if (ok && sd) (sd === 'L' ? P.handL : P.handR).getWorldPosition(out);      // (sd: that one hand, not the middle of the two)
      if (ok) P.group.worldToLocal(out);
      for (const k in P.acts) { P.acts[k].setEffectiveWeight(keep[k][0]); P.acts[k].time = keep[k][1]; }
      Object.assign(P.w, w0); personSettle(P); P.mixer.update(0);
      return ok ? out : null;
    }

    /* THE CROWD (the tracker's §12). Forty-odd people cannot each have a skeleton on a phone. Each of the eight devotee
       bodies has a few DRIVERS instead: a person nobody sees, with its mixer, wearing one take at one phase. A MEMBER of
       the crowd is that body's skins drawn again from the driver's bones, wherever the member sits (three's detached
       bind mode: the pose comes from the bones, the place from the member's own group; episode 1 chapter 3's crowd,
       v5.21). So the whole crowd breathes, sways and bows on a score of mixers. A driver stands at the world's origin,
       unturned, or every member would be thrown by its place. */
    const crowd = [];
    function mkDriver(key, o = {}) { return mkPerson(key, 0, 0, 0, Object.assign({ driver: true }, o)); }
    function mkMember(D, x, z, ry, o = {}) {
      const s = o.s || 1, M0 = { D, group: new THREE.Group(), lv: [null, null, null, null], lvNow: -1, s, o };
      M0.group.position.set(x, o.y || 0, z); M0.group.rotation.y = ry; M0.group.scale.set(o.mirror ? -s : s, s, s); (o.parent || world).add(M0.group);
      if (!o.noBlob) M0.blob = blob(M0.group, (o.blobW || 0.95) / s, (o.blobD || 0.9) / s);
      crowd.push(M0); D.members.push(M0);
      for (let i = 1; i < 4; i++) if (D.lv[i]) memberSkin(M0, i);
      return M0;
    }
    function memberSkin(M0, i) {
      const src = M0.D.lv[i]; if (!src || M0.lv[i]) return;
      M0.lv[i] = src.map(sm => { const c = sm.clone(); c.bindMode = 'detached'; c.bindMatrix.identity(); c.bindMatrixInverse.identity();
        c.frustumCulled = false; c.visible = false; M0.group.add(c); return c; });
      M0.lvNow = -1;
      if (ctx.cullBySphere) ctx.cullBySphere(M0.group, 0, 0.75, 0, 1.6);         // a sitter or a stander, and room for a bow
    }

    /* WHICH SKIN IS DRAWN, every frame, from the lens. b: a boundary is crossed only 7 % past it (no flicker). A missing
       skin is stood in for by the next fuller one that is there. `force` (a film's close shot) names a level outright. */
    function levelFor(now, d, max) {
      let lv = 0;
      for (let i = 0; i < 3; i++) { const b = LEVELS[i][1]; if (now > i ? !(d < b * 0.93) : d > b * 1.07) lv++; }
      return Math.max(lv, max);
    }
    function showLevel(X, want) {
      let k = want; while (k > 1 && !X.lv[k]) k--;                                // the far skins fall back on the near one
      if (!X.lv[k]) k = 1;
      if (!X.lv[k]) return;
      if (k === X.lvShown && X.lvNow === want) return;
      for (let i = 0; i < 4; i++) if (X.lv[i]) for (const m of X.lv[i]) m.visible = i === k;
      X.lvShown = k; X.lvNow = want;
    }
    /* (v26.8: A LEVEL BY THE SIZE ON THE SCREEN. A level was chosen by the distance from the lens alone, so a film's narrow
       lens drew a man far off as big as one beside him and gave him the far man's body: the brown hermit, 2.3 m from the
       lens at the festival's bai sri through a 26 to 45 degree lens, as big on the screen as a man 0.7 to 1.3 m away in
       play's 72, drawn from his 30,000 triangles where his full model is made for that (Chad: "look at how bad and blocky
       the arms look , are these the full res models?"). The distance is now read through the lens: times the lens's
       half-height against play's. Play's own lens reads exactly as before) */
    const LENS0 = Math.tan(72 * Math.PI / 360);
    function peopleLevels(cam = camera) {
      cam.getWorldPosition(_lens);
      const lk = Math.tan((cam.fov || 72) * Math.PI / 360) / LENS0;
      for (const P of people) { if (!P.ready || P.driver) { if (P.driver && P.ready && P.lvShown !== -2) { for (let i = 0; i < 4; i++) if (P.lv[i]) for (const m of P.lv[i]) m.visible = false; P.lvShown = -2; } continue; }
        if (!P.group.visible) continue;
        /* (o.lodK: a child is two thirds of a grown body's height, and is drawn at each level two thirds as far) */
        const g = P.group.position, d = lk * Math.hypot(g.x - _lens.x, g.y + 1.0 - _lens.y, g.z - _lens.z) / (P.o.lodK || 1);
        showLevel(P, P.force != null ? P.force : levelFor(P.lvNow < 0 ? 3 : P.lvNow, d, P.lv[0] ? 0 : 1)); }
      for (const M0 of crowd) { if (!M0.group.visible || !M0.D.ready) continue;
        const g = M0.group.position, d = lk * Math.hypot(g.x - _lens.x, g.y + 0.8 - _lens.y, g.z - _lens.z);
        showLevel(M0, levelFor(M0.lvNow < 0 ? 3 : M0.lvNow, d, 1)); }
    }

    /* THE CAST OF DAY ONE AND DAY TWO. Who they are is the plan's §3.3. Each stands or sits where the photographs put
       their kind: the masters under their tents on the west side, the monks under the east one, Grandmaster Pho under the
       gold. (The crowd, the dancers and those who go up are placed by the play and the films.) */
    /* A LOOK AS A NECK MAKES IT (R86, R87; Chad, 19 Nov: "neck is too bent", of Amma standing in ending A, and "yellow
       woman's head is too bent and unnatural", of Mala in ending B's floor shot). Two faults, both measured in the code:
       1. A look was laid on the head after the mixer and never taken off. The mixer writes a bone only when its take's
          value changes (the v11.5 law), so on a take run to its end and held (her rise; a kneel held), the head kept the
          last frame's look and the next was laid on top: in a few frames the head swung all the way onto its mark,
          whatever the reach (Amma's chin up into her son's face; Mala's head down onto her mother's). Now each look is
          kept with what it turned (lookSave) and taken off before the next pose is written (lookBack, from armsBack, the
          undo before the mixer), and laid again from the take's own pose.
       2. A look was the shortest turn of the head bone onto its mark, up to 0.9 rad at one joint: a look down and to one
          side is a turn about a slanted axis, which TIPS the head over (Mala's, nearly on its side). Now a look is a turn
          about the chest's own up and a nod over the face's own side axis, never a tip; the turn held within the
          caller's reach and 57 degrees of the chest, the nod within 19 up and 31 down of the chest's level (a real
          neck's comfortable range, inside its full one: flexion and extension about 45 each, rotation about 60 to 80;
          the AAOS's normal values, an elderly neck less); and the neck takes two fifths of it, the head the rest, so the
          bend is spread over the neck as a body's is, not folded at the skull. A reach over 1 rad is a spirit's (the
          one on her back looks at the lens): it keeps the shortest turn. */
    const LOOK_UP = 0.33, LOOK_DOWN = 0.55, LOOK_YAW = 1.0, LOOK_NECK = 0.4;
    const _nlA = new THREE.Vector3(), _nlB = new THREE.Vector3(), _nlU = new THREE.Vector3(), _nlF = new THREE.Vector3(), _nlR = new THREE.Vector3(),
          _nlq = new THREE.Quaternion(), _nlq2 = new THREE.Quaternion(), _nlq3 = new THREE.Quaternion(), _nlq4 = new THREE.Quaternion();
    function neckOf(P) { const p = P.head && P.head.parent; return p && p.isBone && /Neck$/.test(p.name) ? p : null; }
    function lookSave(P) {
      let L = P.lkSave;
      if (!L) { const nb = neckOf(P); L = P.lkSave = { on: false, h: new THREE.Quaternion(), nb, n: new THREE.Quaternion() }; }
      if (L.on) { P.head.quaternion.copy(L.h); if (L.nb) L.nb.quaternion.copy(L.n); }     // (laid again with no pose between: from the same pose)
      else { L.h.copy(P.head.quaternion); if (L.nb) L.n.copy(L.nb.quaternion); L.on = true; }
    }
    function lookBack(P) { const L = P.lkSave; if (!L || !L.on) return; P.head.quaternion.copy(L.h); if (L.nb) L.nb.quaternion.copy(L.n); L.on = false; }
    /* a bone's bind turn, inverted (as headRest): its turn since its bind, applied to +z and +y, is where it faces and its up */
    function boneRest(P, b) {
      if (!b) return null; P.bRest = P.bRest || new Map(); if (P.bRest.has(b)) return P.bRest.get(b);
      let q = null;
      P.group.traverse((o) => { if (q || !o.isSkinnedMesh || !o.skeleton) return; const i = o.skeleton.bones.indexOf(b); if (i < 0) return;
        const m = new THREE.Matrix4().copy(o.skeleton.boneInverses[i]).invert().premultiply(o.bindMatrix);
        q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(m)).invert(); });
      P.bRest.set(b, q); return q;
    }
    /* f: where the face looks now (world), g: where it is asked to (world, unit), s: how far (0..1), hq: the head's world
       turn before this look */
    function natLook(P, f, g, s, reach, hq) {
      const head = P.head, neck = neckOf(P), chest = neck ? neck.parent : head.parent;
      if (reach > 1) {                                       // (a spirit's: the shortest turn, at the head)
        const a = Math.acos(Math.max(-1, Math.min(1, f.dot(g)))); if (a < 1e-3) return;
        _nlq3.setFromUnitVectors(f, g); _nlq2.identity().slerp(_nlq3, s * Math.min(1, reach / a));
        head.parent.getWorldQuaternion(_nlq3); head.quaternion.copy(_nlq3.invert().multiply(_nlq2).multiply(hq)); return;
      }
      const cr = boneRest(P, chest);
      if (cr && chest) { chest.getWorldQuaternion(_nlq); _nlq.multiply(cr); } else P.group.getWorldQuaternion(_nlq);
      _nlF.set(0, 0, 1).applyQuaternion(_nlq); _nlU.set(0, 1, 0).applyQuaternion(_nlq); _nlR.crossVectors(_nlU, _nlF).normalize();
      const yawOf = (v) => Math.atan2(v.dot(_nlR), v.dot(_nlF)), nodOf = (v) => Math.asin(Math.max(-1, Math.min(1, v.dot(_nlU))));
      const fy = yawOf(f), fn = nodOf(f), gy = yawOf(g), gn = nodOf(g), ym = Math.max(LOOK_YAW, reach);
      let dy = Math.atan2(Math.sin(gy - fy), Math.cos(gy - fy)); dy = Math.max(-reach, Math.min(reach, dy));
      dy = Math.max(-ym, Math.min(ym, fy + dy)) - fy;
      let dn = Math.max(-LOOK_DOWN, Math.min(LOOK_UP, gn)) - fn; dn = Math.max(-reach, Math.min(reach, dn));
      dy *= s; dn *= s; if (Math.abs(dy) < 1e-4 && Math.abs(dn) < 1e-4) return;
      _nlq2.setFromAxisAngle(_nlU, dy);                       // the turn, about the chest's up
      _nlA.copy(f).applyQuaternion(_nlq2); _nlB.crossVectors(_nlA, _nlU);
      if (_nlB.lengthSq() < 1e-8) _nlB.copy(_nlR); _nlB.normalize();
      _nlq3.setFromAxisAngle(_nlB, dn).multiply(_nlq2);       // then the nod, about the turned face's side: never a tip
      if (neck && neck.parent) {
        neck.getWorldQuaternion(_nlq4); _nlq.identity().slerp(_nlq3, LOOK_NECK); _nlq4.premultiply(_nlq);   // the neck's share
        neck.parent.getWorldQuaternion(_nlq2); neck.quaternion.copy(_nlq2.invert().multiply(_nlq4));
        _nlq2.copy(_nlq3).multiply(hq); head.quaternion.copy(_nlq4.invert().multiply(_nlq2));          // the head: the whole, less the neck's
      } else {
        _nlq2.copy(_nlq3).multiply(hq); head.parent.getWorldQuaternion(_nlq4); head.quaternion.copy(_nlq4.invert().multiply(_nlq2));
      }
    }
    /* A BODY SAT OR STOOD UP STRAIGHT (o.upright; R42, Chad, 18 Nov 2026: "From the very start of the intro cutscene to the
       gameplay and to the ending cutscene, grandmaster pho has some animations and poses that look unnatural and overly
       hunched with shoulders tightened upwards. Fix it so that he looks more natural."). MEASURED first (tools/probes/
       posture.mjs, on his own body in the takes this chapter has him wear): seated at rest, the first moment of his rise
       from a seat (his hands on his knees) leans his trunk 17.7 degrees forward of the vertical with his neck 27.6 forward,
       the stoop of a man about to push himself up, held as if it were his sitting; his seated talk lifts both collar bones
       25 to 28 degrees over his rest (7.8 and 8.4 cm). A man sitting upright on a stool with his hands on his knees holds
       his trunk within ten degrees of the vertical. So while a take named in o.upright is worn, its trunk is turned back
       about the body's own left-right line by that take's `trunk` degrees (shared out over the three spine bones, so the
       back stays a curve) and its neck by its `head` degrees, weighted by the take's weight (a take fading in or out
       takes its share): a CONSTANT turn per take, so every breath and gesture of the take moves as it did about the new
       stance. Laid after the mixer and the head's damping, before the shoulders and the hands (a hand laid on a knee
       reaches from the shoulder as it now stands: restHands lays it after), taken off by armsBack() before the mixer runs
       again (v11.5), and laid for restHands' own measure of the arms (assemble.py) */
    const _upA = new THREE.Vector3(), _upF = new THREE.Vector3(), _upQ = new THREE.Quaternion(), _upQp = new THREE.Quaternion(), _upV = new THREE.Vector3();
    /* (`hips`: the pelvis turned back about its own joint as a man sits up on his sit bones, each thigh given back the turn
       so his legs lie where they lay (the bow's own way, c_story.js); the whole trunk goes with it as one, so a lean of
       the hips is a lean of the trunk degree for degree. `trunk`: the spine's three bones, shared out. `head`: the neck) */
    function uprightInit(P) {
      const find = (re) => { for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const B = [find(/Spine$/), find(/Spine1$/), find(/Spine2$/)], neck = find(/Neck$/), hips = find(/Hips$/), legs = [find(/LeftUpLeg$/), find(/RightUpLeg$/)];
      if (B.some(b => !b) || !neck || !hips || legs.some(b => !b)) { console.warn(P.key + ': o.upright asked, and its spine is not all there'); return; }
      /* (R88: the head and the collar bones too, for a take that names `chest`, `nod` or `clav`) */
      const head = find(/Head$/), clL = find(/LeftShoulder$/), clR = find(/RightShoulder$/);
      P.upr = { hips, legs, spine: B, neck, head, clL, clR, B: [hips].concat(legs, B, [neck], [head, clL, clR].filter(Boolean)).map(b => ({ b, sv: new THREE.Quaternion() })), take: Object.assign({}, P.o.upright), on: false };
      /* (R88: the upper arms, and the drape that hangs beside the left one from the same collar bone, for a take that names `arms`) */
      const arms = [find(/^(mixamorig:?)?LeftArm$/), find(/^(mixamorig:?)?RightArm$/)].filter(Boolean);
      const drapes = clL ? clL.children.filter(c => c.isBone && /^Drape/.test(c.name)) : [];
      P.upr.arms = arms.concat(drapes).map(b => ({ b, sv: new THREE.Quaternion(), pw: new THREE.Quaternion() })); P.upr.ka = 0; P.upr.armsOn = false;
    }
    const _upW0 = new THREE.Quaternion(), _upW1 = new THREE.Quaternion(), _upD = new THREE.Quaternion();
    function uprightLay(P) {
      const U = P.upr; if (!U) return;
      let tr = 0, hd = 0, hp = 0, ch = 0, nd = 0, cl = 0, cr = 0, ka = 0, dl = 0, dr = 0;
      for (const n in U.take) { const w = P.w[n] || 0, T = U.take[n]; if (w > 0) { tr += w * (T.trunk || 0); hd += w * (T.head || 0); hp += w * (T.hips || 0);
        ch += w * (T.chest || 0); nd += w * (T.nod || 0); cl += w * (T.clavL || 0); cr += w * (T.clavR || 0); ka += w * (T.arms || 0); dl += w * (T.dropL || 0); dr += w * (T.dropR || 0); } }
      U.ka = Math.min(1, ka);
      if (Math.abs(tr) < 1e-3 && Math.abs(hd) < 1e-3 && Math.abs(hp) < 1e-3 && Math.abs(ch) < 1e-3 && Math.abs(nd) < 1e-3 && Math.abs(cl) < 1e-3 && Math.abs(cr) < 1e-3 && Math.abs(dl) < 1e-3 && Math.abs(dr) < 1e-3) return;
      for (const R of U.B) R.sv.copy(R.b.quaternion);
      U.on = true;
      P.group.updateWorldMatrix(true, false); P.group.getWorldQuaternion(_upQ);
      _upF.set(0, 0, 1).applyQuaternion(_upQ); _upF.y = 0; _upF.normalize();
      _upA.set(0, 1, 0).cross(_upF).normalize();                       // (a turn about it by a positive angle leans the body forward)
      /* (R88: where each upper arm hangs from before the back is turned: uprightArmsLay hangs it from there again) */
      if (U.ka > 1e-3) for (const A of U.arms) A.b.parent.getWorldQuaternion(A.pw);
      const turn = (b, deg) => { b.parent.updateWorldMatrix(true, false); b.parent.getWorldQuaternion(_upQp);
        _upV.copy(_upA).applyQuaternion(_upQp.invert()); _upQ.setFromAxisAngle(_upV, deg * Math.PI / 180); b.quaternion.premultiply(_upQ); b.updateWorldMatrix(false, true); };
      if (Math.abs(hp) >= 1e-3) { U.hips.getWorldQuaternion(_upW0); turn(U.hips, hp); U.hips.getWorldQuaternion(_upW1);
        _upD.copy(_upW1).invert().multiply(_upW0);                      // (each thigh's turn given back: new hips^-1 * old hips)
        for (const L of U.legs) { L.quaternion.premultiply(_upD); L.updateWorldMatrix(false, true); } }
      if (Math.abs(tr) >= 1e-3) for (const b of U.spine) turn(b, tr / 3);
      /* (R88: the upper back opened: the last two spine bones turned back, two thirds and one third, so the curve between
         the lower back and the upper eases as a back straightening does, not at one joint) */
      if (Math.abs(ch) >= 1e-3) { turn(U.spine[1], ch / 3); turn(U.spine[2], ch * 2 / 3); }
      if (Math.abs(hd) >= 1e-3) turn(U.neck, hd);
      if (Math.abs(nd) >= 1e-3 && U.head) turn(U.head, nd);
      /* (R88: a collar bone drawn back: turned about the vertical, its arm's top carried back with it; a positive turn takes
         either side back) */
      const clav = (b, deg, sgn) => { if (!b || Math.abs(deg) < 1e-3) return; b.parent.updateWorldMatrix(true, false); b.parent.getWorldQuaternion(_upQp);
        _upV.set(0, 1, 0).applyQuaternion(_upQp.invert()); _upQ.setFromAxisAngle(_upV, sgn * deg * Math.PI / 180); b.quaternion.premultiply(_upQ); b.updateWorldMatrix(false, true); };
      clav(U.clL, cl, 1); clav(U.clR, cr, -1);
      /* (R93, Chad, 19 Nov 2026: "And relax his shoulders by moving it down very slightly": each collar bone turned down
         about the body's forward line by `dropL` and `dropR` degrees, its shoulder going down with it; the arms are hung
         again from where the collar bones stood before (uprightArmsLay), so they hang as they did) */
      const drop = (b, deg, sgn) => { if (!b || Math.abs(deg) < 1e-3) return; b.parent.updateWorldMatrix(true, false); b.parent.getWorldQuaternion(_upQp);
        _upV.copy(_upF).applyQuaternion(_upQp.invert()); _upQ.setFromAxisAngle(_upV, sgn * deg * Math.PI / 180); b.quaternion.premultiply(_upQ); b.updateWorldMatrix(false, true); };
      drop(U.clL, dl, -1); drop(U.clR, dr, 1);
    }
    /* THE ARMS LEFT HANGING WHERE THE TAKE HUNG THEM (R88, Chad, 19 Nov 2026: "grandmaster pho's shoulders are still too
       bent forward, make it more natural"). A back straightened by the upright lay carries both upper arms with it, the
       hands swung forward of his thighs: photographed from his side on build 34 at the order to take the holy water, his
       left forearm out ahead of his leg and its hand open before it, as no man stands at ease (a hanging arm hangs by its
       weight, whatever his back does). So where a take names `arms` (by its weight), each upper arm, and the drape that
       hangs beside the left one from the same collar bone, is hung again from where its collar bone stood before the lay
       turned it: the arm keeps the turn it has now (the take's, or the rest the arm's hold gave it), only the turn the lay
       put on the back above it is taken away, so every gesture of the take keeps its aim in the room. Laid after the arm's
       hold and before the knees, the arm let out and the shoulders (which hold the upper arm where it then stands), and
       taken off by armsBack() before the arm's hold is (v11.5) */
    function uprightArmsLay(P) {
      const U = P.upr; if (!U || !U.on || !(U.ka > 1e-3) || !U.arms.length) return;
      for (const A of U.arms) { A.b.parent.getWorldQuaternion(_upQp);
        _upQ.copy(_upQp).invert().multiply(A.pw).multiply(A.b.quaternion);   // (the arm's own turn, hung from where its collar bone stood)
        A.sv.copy(A.b.quaternion); A.b.quaternion.slerp(_upQ, U.ka); }
      for (const A of U.arms) A.b.updateWorldMatrix(false, true);
      U.armsOn = true;
    }
    /* AN ARM HELD AT ITS REST under its cloth (o.armRest; R77, Chad, 18 Nov 2026: "his arms and hands keep clipping into
       his robes in many of his poses"). Grandmaster Pho's left arm is under the drape of his robe, and the drape hangs from
       his collar bone on two bones of its own (DrapeArm, DrapeHang: tools/robeskin.mjs's DRAPE family) baked to follow
       the arm in each take; in his standing talk the take's left hand comes up and in, and the drape, which follows it
       only part of the way, opens on his forearm (photographed: the close's word to the family, skin showing through the
       white at his left side). While a take named in o.armRest.takes is worn, the arm's bones and the drape's are laid at
       their turns in his rest (o.armRest.from: a take and its moment, where the drape covers the arm whole), by that take's
       weight: his left hand hangs at his side under the cloth and his right talks. Laid after the upright lay, taken off
       by armsBack() before the mixer runs again (v11.5). Measured once, from the rest take, when the body lands */
    function armRestInit(P) {
      const O = P.o.armRest, A = P.acts[O.from[0]]; if (!A) { console.warn(P.key + ': o.armRest asked, and no rest take ' + O.from[0]); return; }
      const B = []; for (const n in P.bone) if (O.re.test(n)) B.push({ b: P.bone[n], q: new THREE.Quaternion(), sv: new THREE.Quaternion() });
      if (!B.length) { console.warn(P.key + ': o.armRest asked, and no bone answers it'); return; }
      const keep = {}; for (const k in P.acts) keep[k] = [P.acts[k].time, P.acts[k].getEffectiveWeight()];
      for (const k in P.acts) P.acts[k].setEffectiveWeight(k === O.from[0] ? 1 : 0);
      A.time = Math.min(A.getClip().duration - 1e-3, O.from[1]); P.mixer.update(0);
      for (const R of B) R.q.copy(R.b.quaternion);
      for (const k in keep) { P.acts[k].time = keep[k][0]; P.acts[k].setEffectiveWeight(keep[k][1]); }
      P.mixer.update(0);
      const up = B.find(R => /LeftArm$/.test(R.b.name));
      P.arst = { B, top: up ? up.b.parent : B[0].b.parent, take: Object.assign({}, O.takes), on: false };
    }
    function armRestLay(P) {
      const H = P.arst; if (!H) return;
      let k = 0; for (const n in H.take) k += (P.w[n] || 0) * H.take[n];
      if (!(k > 1e-4)) return;
      k = Math.min(1, k);
      for (const R of H.B) { R.sv.copy(R.b.quaternion); R.b.quaternion.slerp(R.q, k); }
      H.top.updateWorldMatrix(false, true);                // (the collar bone: the arm and the drape both hang from it)
      H.on = true;
    }
    /* HIS LEFT ARM LET HANG A LITTLE OUT FROM HIS SIDE, STANDING (o.armOut; R77, Chad, 18 Nov 2026: "his arms and hands
       keep clipping into his robes in many of his poses"). Photographed standing in the blessing (build 25, four sides,
       the robe's back faces in red, the pixels read back): his left hand hung through the folds of the robe at his hip,
       a strip of white across it seen from his left, and his own forearm showed in a gap of the drape at his waist. Not my
       upright lay (taken off, more of the forearm showed) nor the drape's hanging band (swung 8 and 15 degrees out, back
       and forward on the live build: the strip stayed, it is the robe at his hip). His whole left arm with the drape over
       it (DrapeArm, DrapeHang: the upper arm's brothers under his collar bone), turned out about his forward line, was
       tried at 4, 7 and 10 degrees: at 7 the hand hangs clear of the robe and nothing of it crosses it, the forearm bare
       from the sleeve to the hand, as a robed man's arm hangs at ease (at 4 a streak of the drape still lay on the forearm;
       10 bought nothing more). Laid while a take named in o.armOut.takes is worn (inside its window: the standing end of
       his rise), by its weight, after the knees and before the shoulders (which hold the upper arm where it then stands),
       and taken off by armsBack() before the mixer runs again (v11.5) */
    const _aoQ = new THREE.Quaternion(), _aoP = new THREE.Quaternion(), _aoV = new THREE.Vector3(), _aoR = new THREE.Quaternion();
    function armOutInit(P) {
      const O = P.o.armOut; let up = null;
      for (const n in P.bone) if (/^(mixamorig:?)?LeftArm$/.test(n)) up = P.bone[n];
      if (!up) { console.warn(P.key + ': o.armOut asked, and no left upper arm'); return; }
      const B = [up].concat((O.follow || []).map(n => P.bone[n]).filter(b => b && b.parent === up.parent)).map(b => ({ b, sv: new THREE.Quaternion() }));
      P.aout = { B, take: Object.assign({}, O.takes), win: O.win || {}, rad: (O.deg || 0) * Math.PI / 180, on: false };
    }
    function armOutLay(P) {
      const H = P.aout; if (!H) return;
      let k = 0;
      for (const n in H.take) { const w = P.w[n] || 0; if (!(w > 0)) continue; const W = H.win[n], A = P.acts[n];
        if (W && A && (A.time < W[0] || A.time > W[1])) continue; k += w * H.take[n]; }
      if (!(k > 1e-4)) return;
      k = Math.min(1, k);
      P.group.updateWorldMatrix(true, false); P.group.getWorldQuaternion(_aoQ);
      _aoV.set(0, 0, 1).applyQuaternion(_aoQ);                    // (his forward: a turn about it by a positive angle takes his left arm out)
      const par = H.B[0].b.parent; par.updateWorldMatrix(true, false); par.getWorldQuaternion(_aoP);
      _aoV.applyQuaternion(_aoP.invert());                         // (in the collar bone's frame, which all of them hang from)
      _aoR.setFromAxisAngle(_aoV.normalize(), H.rad * k);
      for (const R of H.B) { R.sv.copy(R.b.quaternion); R.b.quaternion.premultiply(_aoR); }
      par.updateWorldMatrix(false, true);
      H.on = true;
    }
    /* KNEES STRAIGHT STANDING (o.knees; R76, Chad, 18 Nov 2026: "his knees seem bent even when standing"). MEASURED
       (tools/probes/posture.mjs, KNEE, on 21u): standing at rest the legs that are seen (the grafted ones,
       tools/leggraft.mjs) are bent 9.8 and 11.7 degrees, in his talk 12.7 and 12.2; a man standing at ease holds his knees
       within about 5 (the group photograph of the masters at the Wai Kru, masters/v26.0/ref/waikru-8: every one standing
       straight). Near straight a knee's bend is all in the last millimetres of the leg's reach (from 12 degrees to 4 the
       hip rises 4 mm), so while a take named in o.knees is worn (inside its window) his hips are lifted by what brings
       each grafted knee to `bend` degrees, by the take's weight, and both legs reach again to where his feet stood: his
       rig's (which carries his feet) and the grafted one (which is seen), each knee bending forward, each foot keeping
       its turn. Laid after the arm's hold, taken off by armsBack() before the mixer runs again (v11.5) */
    const _kA = new THREE.Vector3(), _kB = new THREE.Vector3(), _kC = new THREE.Vector3(), _kP = new THREE.Vector3(), _kF = new THREE.Vector3(), _kQ = new THREE.Quaternion();
    const _kD = new THREE.Vector3();
    function kneesInit(P) {
      const O = P.o.knees, bone = (re) => { for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const hips = bone(/^(mixamorig:?)?Hips$/), S = [];
      for (const sd of ['Left', 'Right']) {
        const up = bone(new RegExp('^(mixamorig:?)?' + sd + 'UpLeg$')), leg = bone(new RegExp('^(mixamorig:?)?' + sd + 'Leg$')), foot = bone(new RegExp('^(mixamorig:?)?' + sd + 'Foot$'));
        const gu = bone(new RegExp('^' + sd + 'LegGraftUp$')), gl = bone(new RegExp('^' + sd + 'LegGraftLow$'));
        if (!up || !leg || !foot || !gu || !gl) { console.warn(P.key + ': o.knees asked, and the ' + sd + ' legs are not all there'); return; }
        /* (the grafted shin's end, at the ankle it was solved to reach: his foot, measured in the shin's own frame) */
        P.group.updateWorldMatrix(true, true); foot.getWorldPosition(_kA); const gEnd = new THREE.Object3D(); gl.add(gEnd); gl.worldToLocal(gEnd.position.copy(_kA));
        S.push({ up, leg, foot, gu, gl, gEnd, T: new THREE.Vector3(), Q: new THREE.Quaternion() });
      }
      if (!hips) return;
      const B = []; for (const sd of S) for (const b of [sd.up, sd.leg, sd.foot, sd.gu, sd.gl]) B.push({ b, sv: new THREE.Quaternion() });
      P.knees = { hips, S, B, hp: new THREE.Vector3(), take: Object.assign({}, O.takes), win: O.win || {}, bend: (O.bend != null ? O.bend : 4) * Math.PI / 180, max: O.max || 0.012, on: false,
        own: O.own != null ? O.own * Math.PI / 180 : null };
    }
    function kneesLay(P) {
      const K = P.knees; if (!K) return;
      let k = 0;
      for (const n in K.take) { const w = P.w[n] || 0; if (!(w > 0)) continue; const W = K.win[n], A = P.acts[n];
        if (W && A && (A.time < W[0] || A.time > W[1])) continue; k += w * K.take[n]; }
      if (!(k > 1e-4)) return;
      k = Math.min(1, k);
      P.group.updateWorldMatrix(true, true);
      let lift = Infinity;
      for (const sd of K.S) {
        sd.foot.getWorldPosition(sd.T); sd.foot.getWorldQuaternion(sd.Q);
        sd.gu.getWorldPosition(_kA); sd.gl.getWorldPosition(_kB); sd.gEnd.getWorldPosition(_kC);
        const a = _kA.distanceTo(_kB), b = _kB.distanceTo(_kC), d = _kA.distanceTo(_kC);
        if (!(d > 0.2)) return;
        const bend = Math.PI - Math.acos(THREE.MathUtils.clamp((a * a + b * b - d * d) / (2 * a * b), -1, 1));
        if (bend > 0.6) return;                                    // (not standing: a knee bent past 34 degrees is left as the take has it)
        const want = Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(K.bend)), up = (_kA.y - _kC.y) / d;
        lift = Math.min(lift, Math.max(0, (want - d) / Math.max(0.5, up)));
      }
      lift = Math.min(lift, K.max) * k;
      if (!(lift > 1e-5) && K.own == null) return;
      if (!(lift > 1e-5)) lift = 0;
      for (const R of K.B) R.sv.copy(R.b.quaternion); K.hp.copy(K.hips.position);
      K.on = true;
      K.hips.getWorldPosition(_kA); _kA.y += lift; K.hips.parent.worldToLocal(_kA); K.hips.position.copy(_kA); K.hips.updateWorldMatrix(false, true);
      const ry = P.group.rotation.y; _kF.set(Math.sin(ry), 0, Math.cos(ry));
      for (const sd of K.S) {
        sd.leg.getWorldPosition(_kP); _kP.addScaledVector(_kF, 0.5);
        /* (R92: his own legs, which his robe follows, are 3.6 to 4.5 cm longer than the grafted ones that are seen, so at
           the same hips and ankles they stood bent 21.6 and 31.1 degrees, the robe pushed forward at the knees, while the
           grafted legs stood at 5.9 and 7.4: measured at the order to take the holy water on build 37. The grafted legs
           cannot reach further, so his hips stay; his own legs reach their ankles on down along the leg until they stand
           at `own` degrees, the ankles the robe's hem hangs from going down with them) */
        let T = sd.T;
        if (K.own != null) { sd.up.getWorldPosition(_kA); const a = _kA.distanceTo(sd.leg.getWorldPosition(_kB)), b = _kB.distanceTo(sd.foot.getWorldPosition(_kC)),
            d = _kA.distanceTo(sd.T), want = Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(K.own));
          if (d > 0.2 && d < want) T = _kD.copy(sd.T).sub(_kA).multiplyScalar(1 + (want / d - 1) * k).add(_kA); }
        armTo({ up: sd.up, fore: sd.leg, hand: sd.foot }, T, _kP);
        sd.foot.parent.getWorldQuaternion(_kQ); sd.foot.quaternion.copy(_kQ.invert().multiply(sd.Q)); sd.foot.updateWorldMatrix(false, true);
        sd.gl.getWorldPosition(_kP); _kP.addScaledVector(_kF, 0.5);
        armTo({ up: sd.gu, fore: sd.gl, hand: sd.gEnd }, sd.T, _kP);
      }
    }

    /* ---------------------------------------------- the ground: one level everywhere he walks (the walkway, the court,
       the house and case three's room are each flat, and at one height: the walk test floods them whole) */
    function flatGround(x, z) { return 0; }

    /* ================================================================ THE CAST THE WORLD STANDS (the plan's 9.1;
       masters/v28.0/people/RECORD.md). MR KOH and JUN, each made here end to end, at three levels: the near body with
       his takes, the mid body beyond the second step, and every triangle of him within 2.2 m (v26.5: the story turns on
       both, and each is spoken to face to face). Each stands at his station for the phase (STATION), resting in his
       stand; each talks in his own take (headturn to be measured before a film directs it). Grandmaster Pho, Ton and the
       collector are cast by their builders (the play, the fight, the films): their stations are marked in STATION. */
    const cast = {};
    cast.koh = mkPerson('p5koh', STATION.hunt.koh.x, STATION.hunt.koh.z, STATION.hunt.koh.ry, { take: 'Idle_3', phase: 0.35,
      talk: 'Talk_with_Hands_Open', skins: { 0: 'p5kohh', 2: 'p5kohm' }, blobW: 0.85, blobD: 0.65 });
    cast.jun = mkPerson('p5jun', STATION.walk.jun.x, STATION.walk.jun.z, STATION.walk.jun.ry, { take: 'Idle_3', phase: 0.6,
      talk: 'Talk_with_Right_Hand_Open', skins: { 0: 'p5junh', 2: 'p5junm' }, blobW: 0.8, blobD: 0.6 });

    /* the collector's place at the table, MARKED (his rig is being mended: people/RECORD.md 3): an invisible stand-in
       of no shape, the handle a film or the play finds him by, until his body is cast */
    const collectorMark = new THREE.Object3D(); collectorMark.name = 'collector (marked)';
    collectorMark.position.set(STATION.table.collector.x, 0, STATION.table.collector.z); collectorMark.rotation.y = STATION.table.collector.ry; world.add(collectorMark);

    /* ================================================================ THE WORLD'S PHASES (the hooks: c_story.js book()
       and applyPhase() call worldPhase, d_play.js's frame calls worldFrame, its reset worldReset)
       The gate: shut on the walkway (he presses at it: 4.1), open from the hunt on (Mr Koh opens it in his film: 4.2), shut
       again for the cleansing (the court is closed; the camera never passes it: 5.6), and as it is when he is in case
       three's room. His door: shut on the walkway, open after. The court's lamps: lit from the cleansing (night). Each
       change is made on a phase's turn, which a film or a Continue's curtain covers (v24.12). */
    let worldAt = null;
    const blockOf = (solid) => (S && S.blockers) ? S.blockers[solids.indexOf(solid)] : null;
    const block0 = new Map();
    function blockOn(solid, on) {
      const b = blockOf(solid); if (!b) return;
      if (!block0.has(solid)) block0.set(solid, b.clone());
      if (on) b.copy(block0.get(solid)); else b.makeEmpty();
    }
    function standAt(P, st) {
      if (!P) return;
      if (!st) { P.hidden = true; P.group.visible = false; return; }
      P.hidden = false; put(P, st.x, st.z, st.ry);
      if (P.ready) P.group.visible = true;
    }
    function worldPhase(p, place = true) {
      const st = STATION[p] || STATION.walk; worldAt = p;
      const shut = p === 'walk' || p === 'fight';
      gateOpen(shut ? 0 : 1); blockOn(gateShut, shut); blockOn(gateOpenLeaf, !shut);
      doorOpen(p === 'walk' ? 0 : 1);
      courtLamps(p === 'fight' ? 1 : 0);
      liftDoors(0);
      standAt(cast.koh, st.koh); standAt(cast.jun, st.jun);
      if (place && st.at && p !== 'ask') { yaw.position.set(st.at.x, EYE, st.at.z); yaw.rotation.y = st.at.ry; pitch.rotation.x = -0.04; }
    }
    function worldFrame(wdt, st) {
      peopleTick(wdt, st !== 'cine');
      if (st !== 'cine') { peopleLevels(); lodTick(); }
    }
    function worldReset() { worldAt = null; for (const L of lights) lamp(lights.indexOf(L), 1); worldPhase('walk', false); }
    /* ready only once every model is unpacked and every body that has landed is set up: all of it under the curtain
       (chapter 4's R51; v14.15) */
    function worldReady() { return parsePend === 0 && people.every(P => P.ready || !have(P.key)); }
    /* the sky stands over him: over case three's room when he is in it (240 m off: the dome is 150 m), else the origin */
    function worldSkyAt() { return yaw.position.z > 120 ? { x: ROOM.cx, z: ROOM.cz } : null; }

    /* WHERE A SCENE CHANGE PUTS HIM DOWN (walktest floods from each): the hunt's start in his living room (the devotee's
       film leaves him there), and his seat in case three's room (the collector's film) */
    const ARRIVALS = [
      { what: 'the living room, where the devotee\'s film leaves him', x: STATION.hunt.at.x, z: STATION.hunt.at.z },
      { what: 'case three\'s room, where the collector\'s film seats him', x: STATION.table.at.x, z: STATION.table.at.z }
    ];
    /* THE GROUND HE IS KEPT ON (stage.keepIn): the walkway, his court and his two rooms; and case three's room */
    const KEEP = { what: 'the walkway, his court and home, and case three\'s room', boxes: [
      { minX: WALK.x0, maxX: WALK.edge, minZ: WALK.z0, maxZ: WALK.z1 },
      { minX: WALK.endX, maxX: WALK.x0, minZ: WALK.z0, maxZ: WALK.turnZ + 0.1 },
      { minX: COURT.x0, maxX: COURT.x1, minZ: COURT.z0, maxZ: HOUSE.face },
      { minX: LIVING.x0, maxX: LIVING.x1, minZ: HOUSE.face - 0.2, maxZ: LIVING.z1 },
      { minX: DINING.x0, maxX: DINING.x1, minZ: DINING.z0, maxZ: DINING.z1 },
      { minX: ROOM.x0, maxX: ROOM.x1, minZ: ROOM.z0, maxZ: ROOM.z1 } ] };
    /* EACH LATER GROUND, walked by the walk test (v26.18): the home with its gate open (the hunt), the court shut for the
       cleansing, and case three's room. Each put in place as a Continue lands (the phase set) */
    const GROUNDS = [
      { what: 'the home with its gate open (the hunt)', enter: () => { if (S && S.setPhase) S.setPhase('hunt'); }, ready: () => worldAt === 'hunt' && worldReady() },
      { what: 'the court shut for the cleansing', enter: () => { if (S && S.setPhase) S.setPhase('fight'); }, ready: () => worldAt === 'fight' && worldReady() },
      { what: 'case three\'s room (the table)', enter: () => { if (S && S.setPhase) S.setPhase('table'); }, ready: () => worldAt === 'table' && worldReady() }
    ];

    /* EACH THING TO PRESS IS TRIED BY THE WALK TEST IN THE GROUND IT BELONGS TO (v26.18 `ground`): the stains in the hunt's
       ground (the gate open), the cleansing in the court shut, the pieces in case three's room; the gate on the first
       frame. d_play.js hands the stage its hotspots through this (a hotspot the play adds later is tagged by its id) */
    const GROUND_OF = { stain1: GROUNDS[0].what, stain2: GROUNDS[0].what, stain3: GROUNDS[0].what, armchair: GROUNDS[0].what,
                        cleanse: GROUNDS[1].what, pieces: GROUNDS[2].what };
    function worldHotspots(list) { for (const h of list) if (h && GROUND_OF[h.id] && !h.ground) h.ground = GROUND_OF[h.id]; return list; }

    /* WHERE THE SKELETON'S STAND-INS LIE (each at the height a mark is read at: v7.5), now the story's own places: the
       gate between its posts (from the walkway), the floor under the shoe cabinet, the left planter's foot, the threshold
       between the gate posts, the court's middle, and the table's pieces */
    const SPOT = {
      gate:   { x: GATE.x, y: 1.4, z: WALK.turnZ - 0.7 },
      stain1: { x: SHOE.x, y: 0.9, z: SHOE.z + 0.55 },
      stain2: { x: COURT.x1 - 0.95, y: 0.9, z: PLANT_Z },
      stain3: { x: GATE.x, y: 0.9, z: WALK.turnZ + 0.35 },
      court:  { x: GATE.x, y: 1.4, z: -9.6 },
      pieces: { x: ROOM.cx, y: 0.9, z: ROOM.cz }
    };
    /* (the stage's plan handle: the places a probe or a builder reads) */
    const FLOOR = { WALK, COURT, GATE, HOUSE, LIVING, DINING, ROOM, LIFT, STATION, RITE, DRAIN: DRAIN_SPOT, SEAT, things, setDown, lamp, courtLamps, liftDoors, gateOpen, doorOpen, cast };

    /* ====================================================== THE DRAWN SURFACES' HELPERS (chapter 3's own, as chapter 4's) */
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function done(THREE, c, rep) {
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
    return t;
  }
  function noMip(THREE, t) { t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.needsUpdate = true; return t; }

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
      phase = p; play.found = new Set(); worldPhase(p);           // (the world's hook: b_xpeople.js)
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
      worldPhase(R.p);                                         // (the world's hook: a Continue lands at the phase's start)
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
      worldFrame(wdt, st);                                     // (the world's hook: its people and levels)
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
      storyReset(); worldReset();
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
      ready: () => worldReady(),
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => 0 },
      drum: null, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: null,
      skyAt: () => worldSkyAt(),
      /* TODO-WORLD: where a scene change puts him down (`arrivals`), the ground he is kept on (`keepIn`), each later
         ground for the walk test (`grounds`: the court at night, the receiving room), and the floor's height (`groundAt`) */
      arrivals: ARRIVALS, keepIn: KEEP, grounds: GROUNDS, groundAt: flatGround, things: FLOOR.things,
      get phase() { return phase; },
      setPhase, applyPhase,
      presets: PRESETS,
      plan: { FLOOR, SPOT },
      info: () => ({ phase, mark: mark(), t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard], until: +speak.until.toFixed(2),
                     pending: speak.pending ? speak.pending.name : null, applied: booted, busy: play.busy, decOpen }),
      sayLine, queueLine, queueFn, queueGap, dayClock, after,
      /* (a probe's handle on the script as the chapter holds it) */
      script: { SECS, LINES, SAID },
      hotspots: worldHotspots(hotspots),                         // (the world's: each tagged with the ground the walk test tries it in)
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
