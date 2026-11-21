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
  /* (the world's: the plan's 8.1 hours, set from photographs, docs/V28.0-WORLD.md 7) THE HOME IN THE EVENING, for the
     hunt: the sun gone, the last of its warmth low in the west, the sky's blue deepening overhead, the court's lamps lit
     and the homes' windows lit; the light flatter and dimmer than the walkway's dusk */
  const EVENING = sky({
    stops: [[0.00, '#c98a6a'], [0.10, '#9a6f78'], [0.30, '#5a5a82'], [0.60, '#333c68'], [1.00, '#1c2448']],
    bg: 0x3a3a58, fog: [0x4c4860, 0.005],
    hemi: [0xb4b4d4, 0x4a4038, 0.62], key: [0xff9c62, 0.5, -3.0, 0.9, 2.0], fill: [0x7080b8, 0.22],
    stars: 0.06, moon: 0,
    vmHemi: [0xb4b4d4, 0x4a4038, 0.62], vmKey: [0xffa870, 0.42] });
  /* THE RECEIVING ROOM IN THE AFTERNOON, for case three: daylight through one window */
  const DAY = sky({
    stops: [[0.00, '#dfe8f2'], [0.20, '#bcd2ea'], [0.50, '#8fb4de'], [0.80, '#6a98d0'], [1.00, '#5486c4']],
    bg: 0xc8d6e4, fog: [0xc8d6e4, 0.002],
    hemi: [0xf4f8ff, 0xb8a890, 0.95], key: [0xfff2dc, 0.9, 2.0, 3.0, -1.0], fill: [0xb8c8e0, 0.25],
    stars: 0, moon: 0,
    vmHemi: [0xf4f8ff, 0xb8a890, 0.9], vmKey: [0xfff2dc, 0.6] });
  const PRESETS = { DUSK, EVENING, NIGHT, DAY };

  /* LINES BEGIN: written by masters/v28.0/assemble.py from masters/v28.0/script/lines.json (edit that file and
     assemble again: never this block). EVERY LINE THE CHAPTER SPEAKS: its length, its speaker, its place, its words. */
  /* every line's length. PROVISIONAL unless its row in lines.json carries a measured `secs`: a provisional length is
     the line's words / 2.3 a second, and is REPLACED by the take's measured length when the line is voiced (the queue
     books its window by it and every film's times are built from it, so a measured take moves what follows it: v5.15).
     The names are QUOTED on purpose: build.py gives a sound to a chapter's own pack only when the chapter names it in
     quotes (v21.1). */
  const SECS = {      // 99 of 193 MEASURED from their takes; the other 94 PROVISIONAL (words / 2.3 s)
    /* Master Zavier (the player) */
    'q5o1': 9.05, 'q5o2': 2.41, 'q5w1': 1.43, 'q5w2': 2.49, 'q5w3': 2.25, 'q5w4': 1.05, 'q5h1': 5.05, 'q5h2': 3.13,
    'q5h3': 4.01, 'q5h4': 1.5, 'q5h5': 1.53, 'q5p1': 2.97, 'q5c0': 5.22, 'q5c1': 5.22, 'q5c2': 1.74, 'q5c3': 1.74,
    'q5c4': 6.09, 'q5c5': 4.35, 'q5b1': 1.37, 'q5b2': 4.65, 'q5t1': 7.13, 'q5A1': 0.91, 'q5A2': 5.21, 'q5B1': 2.01,
    'q5B2': 1.85, 'q5C1': 6.73, 'q5D1': 4.81, 'q5z1': 3.13, 'q5A': 6.01, 'q5B': 4.97, 'q5C': 4.97, 'q5D': 4.33,
    /* Grandmaster Pho */
    'ph5w1': 5.69, 'ph5w2': 5.53, 'ph5w3': 2.81, 'ph5w4': 1.69, 'ph5w5': 8.23, 'ph5w6': 1.2, 'ph5w7': 3.44,
    'ph5d1': 1.56, 'ph5d2': 7.53, 'ph5h1': 1.37, 'ph5h2': 2.17, 'ph5h3': 7.29, 'ph5h4': 4.89, 'ph5h5': 1.37,
    'ph5h6': 1.69, 'ph5h7': 1.27, 'ph5v1': 5.05, 'ph5v2': 3.56, 'ph5p1': 4.57, 'ph5p2': 6.09, 'ph5f0': 3.91,
    'ph5f1': 0.43, 'ph5f2': 5.22, 'ph5f3': 3.48, 'ph5f4': 0.43, 'ph5f5': 3.04, 'ph5f6': 1.74, 'ph5f7': 1.74,
    'ph5f8': 3.04, 'ph5f9': 4.35, 'ph5f10': 5.22, 'ph5fa': 4.35, 'ph5fc': 4.78, 'ph5fd': 4.35, 'ph5fe': 5.22,
    'ph5fg': 3.91, 'ph5fi': 7.39, 'ph5fj': 4.35, 'ph5fh': 7.39, 'ph5na1': 2.17, 'ph5na2': 2.61, 'ph5na3': 3.48,
    'ph5nb1': 3.04, 'ph5nb2': 1.74, 'ph5nc2': 2.61, 'ph5nc3': 1.3, 'ph5nd1': 3.91, 'ph5nd2': 3.04, 'ph5nd3': 0.43,
    'ph5ne1': 4.35, 'ph5nf2': 2.17, 'ph5nf3': 0.43, 'ph5ng1': 2.61, 'ph5ng2': 2.17, 'ph5nh1': 2.61, 'ph5nh2': 0.43,
    'ph5ni1': 1.74, 'ph5ni2': 1.3, 'ph5nj1': 2.17, 'ph5nj2': 2.17, 'ph5nk1': 3.04, 'ph5nk2': 3.04, 'ph5nl1': 2.17,
    'ph5nl2': 2.17, 'ph5nl3': 3.48, 'ph5nm1': 3.04, 'ph5nn1': 2.17, 'ph5nn2': 2.17, 'ph5no1': 1.74, 'ph5no2': 1.3,
    'ph5np1': 0.87, 'ph5nq1': 1.74, 'ph5nr1': 3.91, 'ph5nr2': 3.91, 'ph5ns2': 2.17, 'ph5ns3': 1.3, 'ph5nt1': 4.35,
    'ph5nt2': 1.74, 'ph5nu1': 3.48, 'ph5nu2': 2.17, 'ph5nv1': 2.17, 'ph5nv2': 2.61, 'ph5nv3': 0.43, 'ph5nw1': 3.48,
    'ph5nw2': 3.48, 'ph5nx1': 2.17, 'ph5nx2': 3.04, 'ph5ny2': 1.74, 'ph5g1': 0.43, 'ph5g2': 3.91, 'ph5g3': 2.61,
    'ph5g4': 3.04, 'ph5ca': 1.3, 'ph5cb': 0.43, 'ph5c1': 2.17, 'ph5c2': 2.61, 'ph5c3': 1.3, 'ph5c4': 3.04,
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
  /* every line's words: key: [who, where in the chapter, the words exactly as said]. The fight's are those of its
     specification (docs/V28.0-FIGHT.md 10). */
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
    'ph5f0': ['pho', 'fight', "We do not destroy them, Zavier. We gather them."],
    'ph5f1': ['pho', 'fight', "FIRE."],
    'ph5f2': ['pho', 'fight', "The fire only chases them away. They hide, and they come back."],
    'ph5f3': ['pho', 'fight', "Only Zavier can find it. Switch to Zavier."],
    'ph5f4': ['pho', 'fight', "BIND."],
    'ph5f5': ['pho', 'fight', "It is bound. Now switch to me."],
    'ph5f6': ['pho', 'fight', "FIRE. Then the BAG."],
    'ph5f7': ['pho', 'fight', "It is hiding. SMELL."],
    'ph5f8': ['pho', 'fight', "There. BIND it, before it sinks again."],
    'ph5f9': ['pho', 'fight', "The golden shockwave is ready. Lend me your cage first."],
    'ph5f10': ['pho', 'fight', "The gold gathers what is bound. The rest, it only drives back."],
    'ph5fa': ['pho', 'fight', "A bound Prai cannot run. Now the fire tires it."],
    'ph5fc': ['pho', 'fight', "Now they all come. BIND them, and I will gather them."],
    'ph5fd': ['pho', 'fight', "BIND one first. The gold gathers only what is bound."],
    'ph5fe': ['pho', 'fight', "They broke the gold. Lend me your cage before I gather it."],
    'ph5fg': ['pho', 'fight', "Do not open yourself for nothing. They feel it."],
    'ph5fi': ['pho', 'fight', "They draw together. The bag cannot take them now. Only the gold, and only what is bound."],
    'ph5fj': ['pho', 'fight', "Three is all you can hold. Let me take one."],
    'ph5fh': ['pho', 'fight', "The last of them cling to the house. Only the gold can take them. BIND them, Zavier."],
    'ph5na1': ['pho', 'fight', "His cage is breaking. FIRE."],
    'ph5na2': ['pho', 'fight', "Chase them off his cage. FIRE."],
    'ph5na3': ['pho', 'fight', "They press at his cage. Switch to Zavier."],
    'ph5nb1': ['pho', 'fight', "Your cage is wearing thin. BIND them."],
    'ph5nb2': ['pho', 'fight', "Hold them still. BIND."],
    'ph5nc2': ['pho', 'fight', "Now. Switch to me, and FIRE."],
    'ph5nc3': ['pho', 'fight', "To me. FIRE."],
    'ph5nd1': ['pho', 'fight', "It is tired. Go to it, and BAG it."],
    'ph5nd2': ['pho', 'fight', "BAG the tired Prai before it rises."],
    'ph5nd3': ['pho', 'fight', "BAG."],
    'ph5ne1': ['pho', 'fight', "The Prai rise again. Bag them while they are tired."],
    'ph5nf2': ['pho', 'fight', "SMELL, Zavier. Find the Prai."],
    'ph5nf3': ['pho', 'fight', "SMELL."],
    'ph5ng1': ['pho', 'fight', "BIND it before it reaches you."],
    'ph5ng2': ['pho', 'fight', "BIND the Prai that comes."],
    'ph5nh1': ['pho', 'fight', "The golden shockwave is ready. SHOCKWAVE."],
    'ph5nh2': ['pho', 'fight', "SHOCKWAVE."],
    'ph5ni1': ['pho', 'fight', "Switch to me. BAG."],
    'ph5ni2': ['pho', 'fight', "To me. BAG."],
    'ph5nj1': ['pho', 'fight', "It is at Zavier. FIRE."],
    'ph5nj2': ['pho', 'fight', "Chase it off him. FIRE."],
    'ph5nk1': ['pho', 'fight', "It slips the fire. Switch to Zavier."],
    'ph5nk2': ['pho', 'fight', "It comes for Zavier. Switch to Zavier."],
    'ph5nl1': ['pho', 'fight', "It is at you. BIND."],
    'ph5nl2': ['pho', 'fight', "BIND the Prai at you."],
    'ph5nl3': ['pho', 'fight', "Switch to me. I will chase it off."],
    'ph5nm1': ['pho', 'fight', "Something is under him. Switch to Zavier."],
    'ph5nn1': ['pho', 'fight', "Something is under you. SMELL."],
    'ph5nn2': ['pho', 'fight', "It is under you. SMELL."],
    'ph5no1': ['pho', 'fight', "Now switch to me."],
    'ph5no2': ['pho', 'fight', "To me. Now."],
    'ph5np1': ['pho', 'fight', "Now. SHOCKWAVE."],
    'ph5nq1': ['pho', 'fight', "It is bound. FIRE."],
    'ph5nr1': ['pho', 'fight', "It will rise again. BIND it, and it cannot."],
    'ph5nr2': ['pho', 'fight', "BIND the tired Prai. Keep it for the bag."],
    'ph5ns2': ['pho', 'fight', "BIND the Prai you found."],
    'ph5ns3': ['pho', 'fight', "Switch to Zavier."],
    'ph5nt1': ['pho', 'fight', "Zavier has found it. Switch to Zavier, and BIND it."],
    'ph5nt2': ['pho', 'fight', "Switch to Zavier. BIND."],
    'ph5nu1': ['pho', 'fight', "Switch to Zavier, and lend me your cage."],
    'ph5nu2': ['pho', 'fight', "Lend me your cage first."],
    'ph5nv1': ['pho', 'fight', "Lend me your cage, Zavier."],
    'ph5nv2': ['pho', 'fight', "The golden shockwave is ready. LEND."],
    'ph5nv3': ['pho', 'fight', "LEND."],
    'ph5nw1': ['pho', 'fight', "That Prai slips the fire. Switch to Zavier."],
    'ph5nw2': ['pho', 'fight', "Only Zavier can hold it. Switch to Zavier."],
    'ph5nx1': ['pho', 'fight', "BIND the one that slips."],
    'ph5nx2': ['pho', 'fight', "BIND it, and the fire will hold."],
    'ph5ny2': ['pho', 'fight', "Switch to Zavier. SMELL."],
    'ph5g1': ['pho', 'fight', "Good."],
    'ph5g2': ['pho', 'fight', "Bind, then fire. That is how it is done."],
    'ph5g3': ['pho', 'fight', "You held. Remember how that felt."],
    'ph5g4': ['pho', 'fight', "You found it, and you held it."],
    'ph5ca': ['pho', 'fight', "Together, Zavier. Now."],
    'ph5cb': ['pho', 'fight', "Together."],
    'ph5c1': ['pho', 'fight', "Three Prai. Do not hurry."],
    'ph5c2': ['pho', 'fight', "The Naga guards. It always has."],
    'ph5c3': ['pho', 'fight', "Bag them. Gently."],
    'ph5c4': ['pho', 'fight', "Come. It is over for you too."],
    'ph5l1': ['pho', 'fight', "Enough. Breathe. We begin again."],
    'ph5l2': ['pho', 'fight', "Breathe. You are safe beside me."],
    'q5c0': ['he', 'fight', "I could see. I could hear. I was not the one standing."],
    'q5c1': ['he', 'fight', "I could hear my own voice, and the words were not mine."],
    'q5c2': ['he', 'fight', "It stood over me."],
    'q5c3': ['he', 'fight', "It had already moved."],
    'q5c4': ['he', 'fight', "I gave my teacher my cage. For a moment there was nothing round me."],
    'q5c5': ['he', 'fight', "My hand rose by itself. And the thing was held."],
    'tn5c0': ['ton', 'fight', "Brother has gone quiet. Look at his lips."],
    'ko5c1': ['koh', 'fight', "Who is he talking to? There is nobody there."],
    'tn5c1': ['ton', 'fight', "Stay behind the thread, Mr Koh."],
    'ju5c1': ['jun', 'fight', "Did you feel that? Like a door slammed."],
    'tn5c2': ['ton', 'fight', "Master. Brother is shaking."],
    'ju5c2': ['jun', 'fight', "The lamps. Master, the lamps."],
    'ko5c2': ['koh', 'fight', "It is... warm. Why is it warm?"],
    'tn5c3': ['ton', 'fight', "Stay there, brother."],
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
    fight: ['ph5f0', 'ph5f1', 'ph5f2', 'ph5f3', 'ph5f4', 'ph5f5', 'ph5f6', 'ph5f7', 'ph5f8', 'ph5f9', 'ph5f10', 'ph5fa', 'ph5fc', 'ph5fd', 'ph5fe', 'ph5fg', 'ph5fi', 'ph5fj', 'ph5fh', 'ph5na1', 'ph5na2', 'ph5na3', 'ph5nb1', 'ph5nb2', 'ph5nc2', 'ph5nc3', 'ph5nd1', 'ph5nd2', 'ph5nd3', 'ph5ne1', 'ph5nf2', 'ph5nf3', 'ph5ng1', 'ph5ng2', 'ph5nh1', 'ph5nh2', 'ph5ni1', 'ph5ni2', 'ph5nj1', 'ph5nj2', 'ph5nk1', 'ph5nk2', 'ph5nl1', 'ph5nl2', 'ph5nl3', 'ph5nm1', 'ph5nn1', 'ph5nn2', 'ph5no1', 'ph5no2', 'ph5np1', 'ph5nq1', 'ph5nr1', 'ph5nr2', 'ph5ns2', 'ph5ns3', 'ph5nt1', 'ph5nt2', 'ph5nu1', 'ph5nu2', 'ph5nv1', 'ph5nv2', 'ph5nv3', 'ph5nw1', 'ph5nw2', 'ph5nx1', 'ph5nx2', 'ph5ny2', 'ph5g1', 'ph5g2', 'ph5g3', 'ph5g4', 'ph5ca', 'ph5cb', 'ph5c1', 'ph5c2', 'ph5c3', 'ph5c4', 'ph5l1', 'ph5l2', 'q5c0', 'q5c1', 'q5c2', 'q5c3', 'q5c4', 'q5c5', 'tn5c0', 'ko5c1', 'tn5c1', 'ju5c1', 'tn5c2', 'ju5c2', 'ko5c2', 'tn5c3'],
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
    /* SPIRIT VISION (chapter 4's fiftieth seam, as chapter 4 tuned it: R61, R105), from the hunt on (the walkway holds it
       shut: "Not yet. First your nose."). Its own sounds wait for this chapter's (another chapter's sound named here would
       leave that chapter's pack): the picture, the wave and the heart's beat on the HUD, silent until then */
    vision: { outSecs: 2.2, inSecs: 1.6, band: 0.27, line: 0.24,
              front: 0x3a96ff, glow: 0.32, burn: 3.2, laid: 0.55, linger: 0.7, detail: 1,
              heart: { bpm: 112, rest: 76, vol: 0, secs: 2.2, restSecs: 4.5 } },
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
      'w5padcase', 'w5cushion', 'w5altarshelf', 'w5ceilfan', 'p5collector', 'p5praicome', 'p5praihide',
      'p5praiheavy', 'p5naga', 'w5wuathanu', 'w5rakyom', 'w5hunphayon',
      /* <<< this chapter's own keys <<< */
      /* the estate's trees on the lawn below the walkway (chapter 4's: declared, reuseInEpisode) */
      'w4angsana', 'w4foxpalm',
      /* (the shared cast, masters/v28.0/parts/c_cast.js: each a declared reuse in the episode, reuseInEpisode) Grandmaster
         Pho and Ton, chapter 3's; the white cloth over his crossed legs and the rite's fan, chapter 3's; the holy-water
         bowls, chapter 4's; and the seven Yin pieces of chapter 1, other men's pieces of the same kinds in the collector's
         rows (the plan's 9.4) */
      'pho', 'e4ton', 'e4tonm', 'e4tonf', 'e4tonh', 'w3pholap', 'w3fan', 'w4waterbowl', 'w4bigbowl',
      'e4kuman', 'e4ngang', 'e4tani', 'e4phraioil', 'e4phraitab', 'e4praicase', 'e4tanitab',
      /* TODO-WORLD, when each is cast (the plan's 9): Grandmaster Pho (`pho`) and Ton (`e4ton`), each a declared reuse in
         the episode (reuseInEpisode); Jun, Mr Koh, the collector, the nine, the Naga; the things of the home and the room */
    ],
    /* FRESH (chaptertest): what this chapter takes from the chapters before it, declared (Chad, v17.4) */
    reuse: {},
    reuseInEpisode: { w4angsana: "chapter 4's angsana trees, on the estate's lawn five storeys below the walkway", w4foxpalm: "chapter 4's foxtail palms, round the estate's pool",
      pho: "Grandmaster Pho, Chad's own model, as chapters 3 and 4 cast him (his look D)",
      e4ton: "Ton, chapter 3's follower: the same man, who works in Singapore (the plan's 9.1)", e4tonm: "Ton's mid body", e4tonf: "Ton's far body", e4tonh: "Ton's full body",
      w3pholap: "the white cloth over Grandmaster Pho's crossed legs, chapter 3's hall: his seat in case three",
      w3fan: "chapter 3's peacock-feather fan, from his own Wai Kru's photographs: the rite's fan (the plan's 16: his photograph was asked and not sent)",
      w4waterbowl: "chapter 4's small silver bowl of holy water: the rite of case three", w4bigbowl: "chapter 4's larger bowl: the rite of case three",
      e4kuman: "chapter 1's Kuman Thong, another man's piece in the collector's rows", e4ngang: "chapter 1's Phra Ngang, in the collector's rows",
      e4tani: "chapter 1's Nang Tani, in the collector's rows", e4phraioil: "chapter 1's phial of oil, in the collector's rows",
      e4phraitab: "chapter 1's powder tablet, in the collector's rows", e4praicase: "chapter 1's cased tablet, in the collector's rows",
      e4tanitab: "chapter 1's Nang Tani tablet, in the collector's rows" },
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
      hotTon: 'Ask Ton',
      hotJun: 'Ask Jun',
      hotDrain: 'Smell the drain',
      hotGate: 'Go to the gate',
      /* said under the reticle when the eye is pressed on the walkway (the engine's visionHeldSay), as his teacher said it */
      visionHeld: 'Not yet. First your nose.',
      // PLAY II · the hunt (the plan's 4.3): the count is derived on the frame from what is found, never stored (v11.6)
      objHunt: 'Find where the smell is strongest. {n}/3',
      objOpen: 'Open Spirit Vision.',
      hotStain: 'Look here',
      // THE CLEANSING (the plan's 5.2, 5.5 and 5.8), as the fight's specification gives them (docs/V28.0-FIGHT.md 11,
      // 21 Nov: R14's kit, BIND, SMELL and LEND beside FIRE, SHOCKWAVE and BAG). Every objective is true whoever is played
      fightTitle: 'THE CLEANSING',
      fightBrief1: 'You play Grandmaster Pho and Master Zavier. Switch between them.',
      fightBrief2: 'Master Zavier binds the Prai and smells out the hidden. Grandmaster Pho fires at the bound and bags the tired.',
      fightBrief3: 'Keep Master Zavier safe. Nine Prai.',
      // the brief names the input for the device he is on (v18.5); no voice ever names one
      fightInTouch: 'Tap the buttons to act, the face to switch. The stick walks.',
      fightInKey: 'Space or a click, Q and E act. F switches. WASD or the arrows walk.',
      objFight1: 'Grandmaster Pho: fire at the Prai.',
      objFight1b: 'It hid. Master Zavier: smell it out.',
      objFight2: 'Master Zavier: bind it.',
      objFight2b: 'Grandmaster Pho: fire at it, then bag it.',
      objFight3: 'Bag the Prai: {n} left',
      objFight3h: 'They cling. Only the golden shockwave takes them: bind them.',
      objFight4: 'Together.',
      objFight6: 'Bag the last three.',
      btnFire: 'FIRE',
      btnShockwave: 'SHOCKWAVE',
      btnBag: 'BAG',
      btnBind: 'BIND',
      btnLend: 'LEND',
      btnSmell: 'SMELL',
      // why a button cannot act now, said on its face (FIGHT.why: the button and the press read the one answer)
      whyFull: 'Three bound',
      whyNone: 'Nothing in reach',
      whyGold: 'Only the gold now',
      whyLendFirst: 'Lend the cage first',
      whyBindFirst: 'Bind one first',
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
      hotLook: 'Look',
      // THE SKELETON'S STAND-INS (TODO-PLAY, TODO-FIGHT): what is pressed in each phase until its play is built. Mine,
      // not the plan's: each goes when the play it stands for is built
      hotCleanse: 'Begin the cleansing'
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
    const mWallIn = M({ map: pic(paint('#e3d9c6', 28507), 1.4, 1.4), roughness: 0.92, emissive: 0x2a2014 });   // (lamp-lit: painted light, v9.4)
    const mCeil = M({ color: 0xe8e4da, roughness: 0.95, emissive: 0x262420 });
    const mSkirt = M({ color: 0x5a4636, roughness: 0.6 });
    const mVeneer = (() => { const [c, x] = canvas(128, 256), r = rng(28508);
      x.fillStyle = '#7d5a3e'; x.fillRect(0, 0, 128, 256);
      for (let i = 0; i < 80; i++) { x.strokeStyle = `rgba(${30 + r() * 30},${18 + r() * 14},10,${0.18 + r() * 0.2})`; x.lineWidth = 1 + r() * 2;
        const xx = r() * 128; x.beginPath(); x.moveTo(xx, 0); x.bezierCurveTo(xx + r() * 8 - 4, 80, xx + r() * 8 - 4, 170, xx + r() * 6 - 3, 256); x.stroke(); }
      return M({ map: pic(c, 0.9, 2.1), roughness: 0.55 }); })();
    const mAlu = M({ color: 0xb9bcbd, roughness: 0.4, metalness: 0.5 });
    /* GLASS: see-through, with the sky's faint reflection laid on it (a picture: brighter at its head, a soft diagonal
       sheen, nearly clear at its foot), so a pane reads as glass from any side and what is behind it reads as behind it */
    const reflTex = (() => { const [c, x] = canvas(128, 256);
      const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, 'rgba(235,240,250,0.95)'); g.addColorStop(0.45, 'rgba(210,220,236,0.42)'); g.addColorStop(1, 'rgba(190,200,215,0.18)');
      x.fillStyle = g; x.fillRect(0, 0, 128, 256);
      x.globalCompositeOperation = 'lighter';
      const s2 = x.createLinearGradient(0, 40, 128, 150); s2.addColorStop(0, 'rgba(255,255,255,0)'); s2.addColorStop(0.5, 'rgba(255,255,255,0.22)'); s2.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = s2; x.beginPath(); x.moveTo(20, 0); x.lineTo(70, 0); x.lineTo(128, 120); x.lineTo(128, 200); x.closePath(); x.fill();
      return tex(done(THREE, c, false)); })();
    const mGlass = M({ color: 0xb4c2d2, map: reflTex, roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.30, depthWrite: false });
    const mGlassDay = M({ color: 0xdce8f2, map: reflTex, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.22, depthWrite: false });
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

    /* A HOME'S WINDOW SEEN FROM OUTSIDE (the storeys over his home, the court's side walls): in the wall's opening its
       aluminium frame and mullion, its glass (the sky's reflection), a ledge under it, and the room behind: a curtain
       drawn 0.32 m in, lit warm, lit by a television, or dark (ROOMS, four kinds dealt by a seeded stream). `axis` 'x':
       a wall along x whose outer face is at z = face, `n` the way it faces (+1 / -1 in z); 'z': along z, face at x. */
    const ROOMS = (() => { const [c, x] = canvas(512, 512), r = rng(28525);
      const kinds = [['#efc68a', '#f8dcae', 0.95], ['#9fb2d8', '#c9d6ee', 0.75], ['#3a3632', '#4c4640', 0.0], ['#e8d2a8', '#fbe8c4', 0.85]];
      kinds.forEach(([a, b2, glow], k) => { const ox = (k % 2) * 256, oy = ((k / 2) | 0) * 256;
        const g = x.createLinearGradient(ox, oy, ox + 256, oy); for (let i = 0; i <= 12; i++) g.addColorStop(i / 12, i % 2 ? a : b2);
        x.fillStyle = g; x.fillRect(ox, oy, 256, 256);
        for (let i = 0; i < 26; i++) { x.fillStyle = `rgba(0,0,0,${0.03 + r() * 0.05})`; x.fillRect(ox + r() * 256, oy, 2 + r() * 6, 256); }
        if (glow) { const rg = x.createRadialGradient(ox + 128, oy + 60, 10, ox + 128, oy + 60, 200); rg.addColorStop(0, `rgba(255,248,230,${0.35 * glow})`); rg.addColorStop(1, 'rgba(0,0,0,0.18)'); x.fillStyle = rg; x.fillRect(ox, oy, 256, 256); }
        x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(ox, oy, 256, 10); });
      const t = tex(done(THREE, c, false)); t.anisotropy = 4; return B({ map: t }); })();
    function quadSub(mat, a, b, c, d, u0, v0, u1, v1) { const Bt = batchOf(mat); let nx = (b[1] - a[1]) * (d[2] - a[2]) - (b[2] - a[2]) * (d[1] - a[1]), ny = (b[2] - a[2]) * (d[0] - a[0]) - (b[0] - a[0]) * (d[2] - a[2]), nz = (b[0] - a[0]) * (d[1] - a[1]) - (b[1] - a[1]) * (d[0] - a[0]);
      const nl = Math.hypot(nx, ny, nz) || 1, P = [a, b, c, a, c, d], U = [[u0, v0], [u1, v0], [u1, v1], [u0, v0], [u1, v1], [u0, v1]];
      for (let i = 0; i < 6; i++) { Bt.p.push(P[i][0], P[i][1], P[i][2]); Bt.n.push(nx / nl, ny / nl, nz / nl); Bt.u.push(U[i][0], U[i][1]); } }
    const roomRng = rng(28526);
    function homeWin(axis, face, n, a0, a1, sill, head, kind = -1) {
      const w = a1 - a0, h = head - sill, fr = 0.05, am = (a0 + a1) / 2, k = kind >= 0 ? kind : Math.floor(roomRng() * 4);
      const u0 = (k % 2) * 0.5, v1 = 1 - ((k / 2) | 0) * 0.5, v0 = v1 - 0.5;
      /* a point at `a` along the wall, height y, `d` outward from the face */
      const P = (a, y, d) => axis === 'x' ? [a, y, face + n * d] : [face + n * d, y, a];
      const bx = (a, y, d, la, ly, ld, mat) => { const c = P(a, y, d); if (axis === 'x') box(mat, c[0], c[1], c[2], la, ly, ld); else box(mat, c[0], c[1], c[2], ld, ly, la); };
      bx(am, sill + fr / 2, -0.06, w, fr, 0.07, mAlu); bx(am, head - fr / 2, -0.06, w, fr, 0.07, mAlu);
      bx(a0 + fr / 2, (sill + head) / 2, -0.06, fr, h, 0.07, mAlu); bx(a1 - fr / 2, (sill + head) / 2, -0.06, fr, h, 0.07, mAlu);
      bx(am, (sill + head) / 2, -0.06, 0.04, h, 0.06, mAlu);
      bx(am, sill - 0.035, 0.04, w + 0.14, 0.07, 0.14, mBand);                                  // the ledge under it
      /* (the order of the corners makes each quad face out: a from the far end along the wall to b) */
      const flip = (axis === 'x') === (n < 0);
      const [aa, ab] = flip ? [a1, a0] : [a0, a1];
      glass.push({ mat: mGlass, a: P(aa, sill, -0.07), b: P(ab, sill, -0.07), c: P(ab, head, -0.07), d: P(aa, head, -0.07) });
      quadSub(ROOMS, P(aa, sill - 0.05, -0.32), P(ab, sill - 0.05, -0.32), P(ab, head + 0.05, -0.32), P(aa, head + 0.05, -0.32), u0, v0, u0 + 0.5, v1);
    }
    const mPipe = M({ color: 0xbdb8ac, roughness: 0.6 });
    /* a downpipe from the ground to the roof, its brackets at every storey */
    function downpipe(x, z, top) { bar(mPipe, [x, 0, z], [x, top, z], 0.045, 8); for (let y = 0.4; y < top; y += STOREY) box(mPipe, x, y + 1.6, z, 0.12, 0.05, 0.12); }

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
      /* THE WALKWAYS ABOVE, as built: each storey's slab over both runs (its underside the soffit of the walkway below
         it), and where the walkway passes his court a balustrade on the court's side too (it runs there as a bridge
         between the court and the outside); the homes' walls along their inner side. From his court, between the
         storeys, the eye meets railings, slabs and soffits, and past them the estate */
      const mSlabTop = M({ color: 0xa69e90, roughness: 0.8 });
      for (let st = 1; st <= 3; st++) { const y = st * STOREY;
        box(mSoffit, (W.x0 - 0.2 + W.edge + 0.12) / 2, y - 0.095, (W.z0 + W.z1) / 2 - 0.06, W.edge + 0.32 - W.x0, 0.19, W.z1 - W.z0 + 0.12, 0, mSlabTop, st === 1);
        box(mSoffit, (W.endX + W.x0 - 0.2) / 2, y - 0.095, (W.z0 + W.turnZ) / 2 - 0.06, W.x0 - 0.2 - W.endX, 0.19, W.turnZ - W.z0 + 0.12, 0, mSlabTop, st === 1);
        if (st < 3) {
          wallZ(mFace, W.x0 - 0.1, 0.2, W.turnZ, W.z1, [], y, y + STOREY - 0.2, false);
          wallX(mFace, W.turnZ + 0.1, 0.2, COURT.x1 + 0.1, W.x0 - 0.2, [], y, y + STOREY - 0.2, false);
          wallX(mFace, W.turnZ + 0.1, 0.2, W.endX - 0.2, COURT.x0 - 0.1, [], y, y + STOREY - 0.2, false);
          box(mBand, (COURT.x0 + COURT.x1) / 2, y + STOREY - 0.32, W.turnZ - 0.06, COURT.x1 - COURT.x0, 0.24, 0.12);   // the slab's edge over the court
        } }
      { const R2 = [], n = 3, L = (COURT.x1 - COURT.x0) / n;
        for (let st = 1; st <= 2; st++) for (let i = 0; i < n; i++) R2.push({ x: COURT.x0 + (i + 0.5) * L, y: st * STOREY, z: W.turnZ - 0.09, ry: 0, sx: L / 2.0 });
        manyX('w5rail', R2, 3); }
    }

    /* ================================================================ HIS COURT AND HIS HOUSE (the plan's 4.2, 4.3, 8.1) */
    function buildCourt() {
      const C = COURT, H = HOUSE;
      /* the paving, and its path from the gate to the door (300 mm pavers, a shade darker) */
      floor(mPave, C.x0, C.z0, C.x1, C.z1);
      floor(mPath, GATE.x - 0.6, C.z0 + 0.05, GATE.x + 0.6, C.z1 - 0.05, 0.004);
      /* THE COURT'S SIDE WALLS, his (west: his bedroom wing) and his neighbour's (east), to the block's roof (the court is
         open to the sky): the block's paint over a tiled dado, a slab band at every storey, and the homes' windows that
         look into the court (his bedroom's at the ground storey behind its grille; two a storey above) */
      const SW = [{ z0: -12.4, z1: -11.2 }, { z0: -8.8, z1: -7.6 }];
      const sideOpens = (ground) => { const o = []; if (ground) o.push({ z0: -9.1, z1: -7.7, y0: 1.0, y1: 2.15 });
        for (let st = 1; st <= 2; st++) for (const q of SW) o.push({ z0: q.z0, z1: q.z1, y0: st * STOREY + 0.9, y1: st * STOREY + 2.1 }); return o; };
      wallZ(mCourtWall, C.x0 - 0.1, 0.2, C.z0, H.face, sideOpens(true), 0, C.wallTop);
      wallZ(mCourtWall, C.x1 + 0.1, 0.2, C.z0, H.face, sideOpens(false), 0, C.wallTop);
      homeWin('z', C.x0, 1, -9.1, -7.7, 1.0, 2.15, 0);
      for (let gz = -9.06; gz < -7.72; gz += 0.11) bar(M({ color: 0xe6e6e0, roughness: 0.5 }), [C.x0 + 0.05, 1.0, gz], [C.x0 + 0.05, 2.15, gz], 0.008, 5);
      for (let st = 1; st <= 2; st++) for (const q of SW) { homeWin('z', C.x0, 1, q.z0, q.z1, st * STOREY + 0.9, st * STOREY + 2.1); homeWin('z', C.x1, -1, q.z0, q.z1, st * STOREY + 0.9, st * STOREY + 2.1); }
      for (let st = 1; st <= 2; st++) { const y = st * STOREY;
        box(mBand, C.x0 + 0.03, y - 0.02, (C.z0 + H.face) / 2, 0.06, 0.22, H.face - C.z0 - 0.05);
        box(mBand, C.x1 - 0.03, y - 0.02, (C.z0 + H.face) / 2, 0.06, 0.22, H.face - C.z0 - 0.05); }
      /* THE STOREYS OVER HIS HOME: the block's face over his front wall, to the roof, built as it stands: two windows a
         storey, each with its frame, glass and ledge and a home behind it, the air-conditioner's ledge between them behind
         its louvred screen, the slab band at each floor, the downpipes at the court's corners, the roof's parapet */
      const FZ = H.face - 0.2;
      const UW = [{ x0: -10.45, x1: -9.25 }, { x0: -7.75, x1: -6.55 }];
      for (let st = 1; st <= 2; st++) { const y = st * STOREY;
        wallX(mCourtWall, H.face - 0.1, 0.2, C.x0, C.x1, UW.map(q => ({ x0: q.x0, x1: q.x1, y0: y + 0.9, y1: y + 2.1 })), y, y + STOREY, false);
        for (const q of UW) homeWin('x', FZ, -1, q.x0, q.x1, y + 0.9, y + 2.1);
        box(mBand, (C.x0 + C.x1) / 2, y - 0.02, FZ - 0.03, C.x1 - C.x0, 0.22, 0.06);
        /* the air-conditioner's ledge: a concrete shelf, its two cheeks and its screen of aluminium louvres */
        const ax = (UW[0].x1 + UW[1].x0) / 2;
        box(mFace, ax, y + 0.32, FZ - 0.3, 0.92, 0.08, 0.6, 0, mFace, false);
        for (const sx of [-0.45, 0.45]) box(mFace, ax + sx, y + 0.8, FZ - 0.3, 0.04, 0.96, 0.6);
        for (let k = 0; k < 8; k++) box(mAlu, ax, y + 0.44 + k * 0.105, FZ - 0.58, 0.88, 0.022, 0.07); }
      downpipe(C.x0 + 0.12, FZ - 0.07, C.wallTop); downpipe(C.x1 - 0.12, FZ - 0.07, C.wallTop);
      /* the roof's parapet over his home's face */
      box(mFace, (C.x0 + C.x1) / 2, C.wallTop + 0.45, FZ + 0.05, C.x1 - C.x0, 0.9, 0.2);
      /* THE DADO: 150 mm ceramic tiles to 0.8 m round the court (its walls, his front wall either side of the door, the
         low front wall's inside), over the plinth, 4 mm proud */
      const mDado = M({ map: pic(tiles(256, 4, [176, 168, 152], '#7c7468', 28527, 0.06, 60), 0.6, 0.6), roughness: 0.35 });
      const dy0 = 0.15, dy1 = 0.8;
      quad(mDado, [C.x0 + 0.004, dy0, H.face], [C.x0 + 0.004, dy0, C.z0 + 0.2], [C.x0 + 0.004, dy1, C.z0 + 0.2], [C.x0 + 0.004, dy1, H.face], 0, dy0);
      quad(mDado, [C.x1 - 0.004, dy0, C.z0 + 0.2], [C.x1 - 0.004, dy0, H.face], [C.x1 - 0.004, dy1, H.face], [C.x1 - 0.004, dy1, C.z0 + 0.2], 0, dy0);
      quad(mDado, [DOOR_FRONT.x0 - 0.06, dy0, FZ - 0.004], [C.x0, dy0, FZ - 0.004], [C.x0, dy1, FZ - 0.004], [DOOR_FRONT.x0 - 0.06, dy1, FZ - 0.004], 0, dy0);
      quad(mDado, [C.x1, dy0, FZ - 0.004], [DOOR_FRONT.x1 + 0.06, dy0, FZ - 0.004], [DOOR_FRONT.x1 + 0.06, dy1, FZ - 0.004], [C.x1, dy1, FZ - 0.004], 0, dy0);
      quad(mDado, [C.x0, dy0, C.z0 + 0.204], [GATE.x - 0.84 - 0.21, dy0, C.z0 + 0.204], [GATE.x - 0.84 - 0.21, dy1, C.z0 + 0.204], [C.x0, dy1, C.z0 + 0.204], 0, dy0);
      quad(mDado, [GATE.x + 0.84 + 0.21, dy0, C.z0 + 0.204], [C.x1, dy0, C.z0 + 0.204], [C.x1, dy1, C.z0 + 0.204], [GATE.x + 0.84 + 0.21, dy1, C.z0 + 0.204], 0, dy0);
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
      /* the lamps' light through the drawn curtains: a soft warm glow between the glass and the cloth (seen from the court
         it is the cloth lit from behind; from the room it is behind the cloth and hidden) */
      { const [c, x] = canvas(128, 128); const g = x.createRadialGradient(64, 48, 4, 64, 64, 80); g.addColorStop(0, 'rgba(255,226,170,0.9)'); g.addColorStop(0.6, 'rgba(255,206,140,0.35)'); g.addColorStop(1, 'rgba(255,200,130,0.05)');
        x.fillStyle = g; x.fillRect(0, 0, 128, 128);
        const mBack = new THREE.MeshBasicMaterial({ map: tex(done(THREE, c, false)), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.45 }); mats.push(mBack);
        for (const Wn of [WIN_A, WIN_B]) quadUV(mBack, [Wn.x1, Wn.sill, H.face + 0.02], [Wn.x0, Wn.sill, H.face + 0.02], [Wn.x0, Wn.head, H.face + 0.02], [Wn.x1, Wn.head, H.face + 0.02]); }
      /* the walls' feet: a grey plinth 15 cm high round the court (a builder's waterproof band), standing 1 cm proud */
      box(mBand, C.x0 + 0.005, 0.075, (C.z0 + H.face) / 2, 0.03, 0.15, H.face - C.z0 - 0.2);
      box(mBand, C.x1 - 0.005, 0.075, (C.z0 + H.face) / 2, 0.03, 0.15, H.face - C.z0 - 0.2);
      box(mBand, (C.x0 + DOOR_FRONT.x0) / 2, 0.075, H.face - 0.205, DOOR_FRONT.x0 - C.x0, 0.15, 0.03);
      box(mBand, (DOOR_FRONT.x1 + C.x1) / 2, 0.075, H.face - 0.205, C.x1 - DOOR_FRONT.x1, 0.15, 0.03);
      box(mBand, (C.x0 + C.x1) / 2, 0.075, C.z0 + 0.205, C.x1 - C.x0, 0.15, 0.03);
      /* on his neighbour's wall (the east) at the ground storey, a high louvred vent (painted: seen across the court) */
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
        const m = new THREE.Mesh(new THREE.BoxGeometry(LIFT.door - 0.004, 2.1, 0.04), mSteel); m.position.set(s * LIFT.door / 2, 1.05, 0); g.add(m);
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
    function buildGlass() { for (const g of glass) quadUV(g.mat, g.a, g.b, g.c, g.d); }

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
    const DRAIN = { x: WALK.edge - 0.42, z: -8.7 };                      // (clear of the balustrade's plinth: clipscan)
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
    /* (hinged at the wall's inner face, so it swings into the room clear of the wall: clipscan found the leaf, hinged in the
       wall's middle, back through the wall and into the shoe cabinet) */
    const doorHinge = new THREE.Group(); doorHinge.position.set(DOOR_FRONT.x0 + 0.005, 0, LIVING.z0 - 0.05); world.add(doorHinge);
    { const mStop = M({ color: 0x3a2618, roughness: 0.6 }), zs = LIVING.z0 - 0.115;      // the door stops, on the court side of the leaf: 3.5 cm over each edge
      box(mStop, DOOR_FRONT.x0 + 0.035, DOOR_FRONT.h / 2, zs, 0.07, DOOR_FRONT.h, 0.03); box(mStop, DOOR_FRONT.x1 - 0.035, DOOR_FRONT.h / 2, zs, 0.07, DOOR_FRONT.h, 0.03);
      box(mStop, (DOOR_FRONT.x0 + DOOR_FRONT.x1) / 2, DOOR_FRONT.h - 0.035, zs, DOOR_FRONT.x1 - DOOR_FRONT.x0, 0.07, 0.03); }
    things.door = place('w5frontdoor', 0.395, 0, 0, Math.PI, { name: 'frontdoor', wood: true });
    world.remove(things.door); doorHinge.add(things.door);
    function doorOpen(k) { doorHinge.rotation.y = -Math.max(0, Math.min(1, k)) * 90 * DEG; }
    solidXZ(DOOR_FRONT.x0 - 0.05, LIVING.z0 - 0.05, DOOR_FRONT.x0 + 0.07, LIVING.z0 + 0.75);                 // the leaf, open, along the wall                 // the leaf, open, along the wall
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
      /* (clipscan: 10 cm apart in z the two cloths crossed; each is 0.195 deep, so 0.22 apart) */
      place('w5curtain', xm - 0.04, HOUSE.ceil - 2.40 - 0.05 + 0.04, LIVING.z0 + 0.10, 0, { sx: 0.72, done: lamplit });
      place('w5curtain', xm + 0.04, HOUSE.ceil - 2.40 - 0.05, LIVING.z0 + 0.32, 0, { sx: 0.70, done: lamplit }); }
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
    /* (the console's top is 0.45 and its television fills it to 0.65 m either side of its middle, measured from the file:
       no table lamp fits on it. The armchair's reading lamp stands beside it; the table lamp is on the sideboard) */
    const ARMLAMP = { x: ARM.x + 0.78, z: ARM.z + 0.12 };
    things.floorLamp2 = place('w5floorlamp', ARMLAMP.x, 0, ARMLAMP.z, 0, { name: 'floorlamp2' });
    solidXZ(ARMLAMP.x - 0.25, ARMLAMP.z - 0.25, ARMLAMP.x + 0.25, ARMLAMP.z + 0.25, 1.5);
    place('w5wallclock', -6.15, 1.42, LIVING.z1 - 0.06 - 0.062, Math.PI, { name: 'wallclock', wood: true });
    /* --- the dining room: the table (scaled to 0.75 m tall) and four chairs round it, the pendant over it, the sideboard
       against its north wall, a framed picture over it */
    const DT = { x: -10.4, z: -0.15 };
    place('w5dintable', DT.x, 0, DT.z, 0, { name: 'dintable', wood: true, sy: 0.75 / 0.873 });
    solidXZ(DT.x - 0.75, DT.z - 0.75, DT.x + 0.75, DT.z + 0.75, 0.75);
    for (const [dx, dz, ry] of [[0, -0.80, 0], [0, 0.70, Math.PI], [-0.80, 0, Math.PI / 2], [0.80, 0, -Math.PI / 2]])
      place('w5dinchair', DT.x + dx, 0, DT.z + dz, ry, { wood: true });
    things.pendant = place('w5pendant', DT.x, HOUSE.ceil - 0.45 - 0.35, DT.z, 0, { name: 'pendant' });
    const SB = { x: -10.4, z: DINING.z1 - 0.06 - 0.283, top: 0.77 };
    place('w5sideboard', SB.x, 0, SB.z, Math.PI, { name: 'sideboard', wood: true });
    /* the table lamp at its east end, clear of the vase (the sideboard's top 0.77 m: the file's measure; turned, its own -x is the world's +x) */
    things.tableLamp = place('w5tablelamp', SB.x + 0.62, SB.top, SB.z + 0.02, 0, { name: 'tablelamp' });
    solidXZ(SB.x - 0.85, DINING.z1 - 0.65, SB.x + 0.85, DINING.z1, 1.0);
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
    framed(SB.x, 1.5, DINING.z1 - 0.06 - 0.024, Math.PI, 28562);
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
    lightAt(ARMLAMP.x, 1.42, ARMLAMP.z, 0.55, { x: ARMLAMP.x - 0.2, y: 0.006, z: ARMLAMP.z - 0.1, w: 2.2, h: 2.2, rx: -Math.PI / 2 });
    lightAt(SB.x + 0.62, SB.top + 0.38, SB.z + 0.02, 0.42, { x: SB.x + 0.62, y: 1.4, z: DINING.z1 - 0.062, w: 1.4, h: 1.4, ry: Math.PI });
    lightAt(DT.x, HOUSE.ceil - 0.62, DT.z, 0.6, { x: DT.x, y: 0.758, z: DT.z, w: 1.6, h: 1.6, rx: -Math.PI / 2 });
    const courtL = [lightAt(DOOR_FRONT.x0 - 0.38, 1.86, HOUSE.face - 0.3, 0.38, { x: DOOR_FRONT.x0 - 0.38, y: 1.6, z: HOUSE.face - 0.212, w: 1.6, h: 1.6, ry: Math.PI }),
                    lightAt(DOOR_FRONT.x1 + 0.38, 1.86, HOUSE.face - 0.3, 0.38, { x: DOOR_FRONT.x1 + 0.38, y: 1.6, z: HOUSE.face - 0.212, w: 1.6, h: 1.6, ry: Math.PI })];
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
    /* (feetscan, LEVEL=1, at every phase: a foot read 1.7 to 1.8 cm under its "floor", and that floor was each body's own
       contact shadow (a flat card 1.4 cm up, which the probe's ray down meets first): lifted 1.2 cm, the reading did not
       move, which proved it. Against the floor itself the soles stand 0.3 to 0.4 cm into it, as the grounding sets them
       (GROUND_SOLE): left as they are) */
    const FEET_LIFT = 0;
    function standAt(P, st) {
      if (!P) return;
      if (!st) { P.hidden = true; P.group.visible = false; return; }
      P.hidden = false; put(P, st.x, st.z, st.ry, FEET_LIFT);
      if (P.ready) P.group.visible = true;
    }
    function worldPhase(p, place = true) {
      const st = STATION[p] || STATION.walk; worldAt = p;
      const shut = p === 'walk' || p === 'fight';
      gateOpen(shut ? 0 : 1); blockOn(gateShut, shut); blockOn(gateOpenLeaf, !shut);
      doorOpen(p === 'walk' ? 0 : 1);
      courtLamps(p === 'hunt' || p === 'fight' ? 1 : 0);                 // (lit from the evening of the hunt on)
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

    /* ================================================================ THE CHAPTER'S SHARED CAST (masters/v28.0/parts/c_cast.js)
       Made by the FILMS helper (M9, 21 Nov 2026) and used by everyone: the play (M7), the fight (M8) and the films (M9).
       Mr Koh and Jun are the world's (b_xpeople.js); everyone else who stands in this chapter is here, ONE BODY EACH, so
       nothing is cast twice (two bodies of one man cost a phone twice and drift apart). Each is a person of chapter 3's
       machinery (mkPerson), posed by the films' clock (pose) and by the play's wall clock (take, hold, rest, talk):
         cast.pho    Grandmaster Pho standing, in his look D (Chad's pick, v24.52: "unlit, except for the robe"), with
                     every posture law chapter 4 learned on his standing body (R42, R64, R76, R77, R88, R92, R93): copied
                     here number for number. The fight drives him (DRIVABLE: his group's transform and his takes only)
         cast.phoS   the same body seated cross-legged on his cushion (case three), chapter 3's hall seat (v26.18)
         cast.ton    Ton, chapter 3's follower (a declared reuse: the same man), his own takes
         cast.zav    MASTER ZAVIER (Chad's R3 and R5: seen in the climax only), his pick, the first body (R10)
         cast.col    the collector (people/RECORD.md 3b: his rig mended here, way B)
         PRAI5       the nine, three bodies, each kind its own, in two looks (Spirit Vision's, and the trance's)
         CAGE5       his Lersi's cage of light (violet: the plan's 11)
         TRANCE5     the trance's look over the court (the plan's 11: a deep blue dark, the lamps down, a low mist, each of
                     the two lit by his own colour), and Grandmaster Pho's gold at his shoulders (gold is his alone, v25.5)
         COURT5      the fight's court frame (FIGHT.NUM's metres) in the world's, one function for everyone
       Nobody is a block figure: a body is not drawn at all until its model has landed (v21.16). */

    /* ---------------------------------------------------------------- GRANDMASTER PHO'S LAWS, copied from chapter 4 as it
       shipped (assemble.py pins its sha1): his robe's flecks, his posture numbers, his look D */
    /* R43 (Chad, 18 Nov 2026: "There are also some skin colour bits on the back of his robe that can be easily seen
       during gameplay"). WRITTEN BY tools/phoflecks.py from assets/pho.glb (sha1 df95bef025b1958c22e20c8e05493e17b86461a8), never by hand:
       48 islands of skin colour lying inside the white of his robe in his body sheet (4096 x 4096), each on a piece of
       robe the game draws (never a piece of skin: build 21z), each grown by 4 texels, and 1350 patches of the empty
       texels beside the robe that hold skin colour (build 24), as runs [row, first cell, cells] of a 1024 x 1024 mask,
       each in the colour of the robe round it (sRGB).
       c_scast.js lookD paints them once and lays them over his sheet; his file is unchanged. */
    const PHO_FLECKS = { size: 1024, f: [
      [254, 253, 246, [21,156,3,22,155,5,23,155,5,24,156,4,25,156,4,26,156,4,27,156,3]],
      [252, 247, 238, [63,898,3,64,898,3,65,898,3,66,899,1]],
      [254, 253, 243, [74,246,4,75,245,6,76,245,6,77,245,7,78,245,7,79,246,6,80,246,6,81,245,7,82,245,7,83,244,8,84,244,9,85,244,9,86,244,9,87,246,7,88,246,7,89,246,8,90,247,6,91,249,4]],
      [254, 253, 241, [87,243,3,88,243,3,89,243,3,90,243,4,91,244,2]],
      [252, 252, 239, [87,891,2,88,890,3,89,890,4,90,890,4,91,890,4,92,891,2]],
      [254, 252, 243, [92,250,3,93,249,5,94,249,5,95,249,5,96,250,4,97,250,3]],
      [221, 219, 216, [94,750,2,95,748,5,96,747,5,97,746,7,98,745,8,99,745,8,100,745,8,101,744,9,102,745,8,103,746,1,103,751,2]],
      [251, 248, 243, [95,180,3,96,179,4,97,178,6,98,178,7,99,179,7,100,181,4,101,182,2]],
      [239, 237, 228, [105,736,3,106,735,5,106,742,1,107,735,9,108,735,10,109,735,10,110,735,9,111,735,8,112,736,6,113,737,5,114,738,4]],
      [252, 251, 243, [206,149,5,207,149,6,208,148,8,209,147,9,210,146,10,211,146,11,212,147,10,213,149,8,214,149,8,215,149,8,216,150,6,217,151,5,218,152,4,219,153,2]],
      [226, 225, 223, [237,955,2,238,954,4,239,953,5,240,952,6,241,952,6,242,952,6,243,953,5,244,953,5,245,954,2]],
      [223, 219, 217, [288,953,8,289,952,10,290,952,10,291,952,10,292,952,9,293,956,1]],
      [253, 251, 245, [309,335,1,310,334,4,311,334,5,312,333,6,313,333,5,314,333,4,315,334,1]],
      [254, 253, 248, [315,331,3,316,330,4,317,329,5,318,329,5,319,328,6,320,329,3]],
      [238, 236, 232, [350,967,3,351,967,6,352,967,6,353,967,6,354,967,7,355,968,5,356,970,2]],
      [251, 250, 244, [358,84,3,359,81,7,360,80,8,361,80,8,362,80,7,363,80,7,364,80,6,365,81,4]],
      [249, 246, 241, [371,1016,2,372,1016,3,373,1016,2]],
      [254, 251, 246, [410,4,3,411,3,6,412,3,7,413,3,7,414,4,6,415,5,5,416,6,3,417,6,3]],
      [255, 253, 247, [418,6,3,419,5,5,420,5,5,421,5,5,422,5,5,423,6,4,424,7,3,425,8,1]],
      [253, 251, 246, [522,925,5,523,924,7,524,924,6,525,924,5,526,924,5,527,926,1]],
      [253, 251, 246, [530,925,5,531,925,6,532,925,5,533,925,4,534,926,2]],
      [247, 246, 236, [568,922,4,569,922,5,570,921,6,571,922,5,572,922,5,573,918,3,573,922,6,574,917,11,575,918,10,576,918,9,577,918,9,578,918,9,579,918,9,580,918,8,581,917,10,582,917,10,583,917,6,583,924,3,584,917,10,585,917,10,586,917,10,587,918,9,588,918,10,589,920,8,590,920,7,591,919,8,592,919,8,593,920,7,594,920,7,595,920,7,596,920,7,597,920,6,598,920,5,599,921,4,600,920,4,601,920,5,602,920,5,603,921,4,604,922,2]],
      [229, 229, 227, [571,732,1,572,731,3,573,731,3,574,730,4,575,730,4,576,731,2]],
      [241, 237, 234, [594,718,2,595,717,4,596,717,4,597,718,2]],
      [212, 205, 202, [598,282,2,599,281,3,600,282,1]],
      [254, 252, 242, [599,918,3,600,917,3,601,917,3,602,917,3,603,917,3]],
      [254, 253, 245, [605,919,1,606,918,3,607,917,5,608,917,5,609,917,5,610,917,5,611,917,5,612,917,5,613,917,5,614,917,5,615,917,5,616,918,4,617,918,4,618,919,3]],
      [254, 253, 243, [607,922,3,608,922,4,609,922,4,610,922,4,611,922,4,612,922,4,613,922,4,614,922,3,615,922,2]],
      [254, 254, 244, [607,234,3,608,233,5,609,232,6,610,231,6,611,229,7,612,227,8,613,226,9,614,226,7,615,225,7,616,223,7,617,221,8,618,220,9,619,219,10,620,218,11,621,216,12,622,215,12,623,215,11,624,215,9,625,217,5,626,218,4,627,218,3]],
      [231, 227, 225, [610,717,5,611,716,6,612,716,6,613,717,1]],
      [253, 253, 242, [610,252,1,611,251,3,612,246,2,612,250,4,613,245,8,614,245,8,615,245,7,616,245,7,617,244,8,618,244,8,619,244,7,620,244,7,621,244,6,622,244,5,623,243,6,624,242,7,625,242,8,626,242,9,627,242,9,628,242,9,629,242,8,630,242,7,631,243,6,632,247,1]],
      [254, 254, 244, [612,235,1,613,235,2,614,233,4,615,233,3]],
      [253, 252, 243, [615,232,1,616,230,4,617,229,4,618,229,3,619,229,2,620,229,1]],
      [202, 196, 195, [619,266,5,620,266,6,621,266,6,622,265,7,623,264,9,624,263,10,625,261,12,626,260,13,627,260,14,628,259,14,629,260,13,630,261,12,631,262,11,632,261,12,633,262,2]],
      [254, 253, 244, [620,922,3,621,921,4,622,921,9,623,920,10,623,931,3,624,919,16,624,936,2,625,919,20,626,919,20,627,919,20,628,920,18,629,920,14,630,920,12,631,920,12,632,920,12,633,919,12,634,918,12,635,918,11,636,918,9,637,918,6,638,919,5,639,919,5,640,919,4,641,920,3]],
      [249, 249, 239, [626,205,1,626,208,3,627,203,9,628,203,9,629,202,10,630,203,8,631,204,6,632,205,3]],
      [250, 249, 239, [642,913,2,643,912,4,644,911,5,645,911,4,646,912,2]],
      [220, 222, 223, [675,925,2,676,924,4,677,925,3,678,925,2]],
      [236, 235, 233, [689,1006,2,690,1004,5,691,1003,6,692,1003,6,693,1003,6,694,1003,5,695,1006,2]],
      [215, 209, 210, [706,1007,3,707,1006,5,708,1007,3]],
      [207, 200, 204, [708,1006,1,709,1007,2]],
      [232, 235, 228, [886,204,2,887,203,4,888,204,3,889,205,1]],
      [232, 231, 227, [893,375,3,894,375,4,895,376,3,896,376,3,897,376,3]],
      [220, 222, 221, [896,402,1,897,401,3,898,401,3]],
      [233, 232, 230, [918,367,2,919,366,4,920,366,4,921,366,4,922,366,4,923,366,4,924,367,2]],
      [240, 239, 230, [933,391,1,934,390,5,935,388,8,936,388,8,937,388,8,938,387,8,939,385,10,940,384,11,941,384,11,942,385,9,943,385,10,944,385,11,945,385,11,946,385,12,947,385,12,948,386,11,949,385,10,950,385,10,951,385,10,952,385,10,953,385,10,954,385,10,955,385,10,956,385,10,957,385,8,958,386,7,959,387,7,960,387,6,961,391,1]],
      [237, 236, 227, [934,385,4,935,384,4,936,384,4,937,384,4,938,384,3]],
      [253, 251, 247, [956,485,3,957,485,5,958,485,6,959,485,6,960,486,5,961,486,4]],
      [255, 254, 255, [0,93,1,1,93,1]],
      [252, 255, 253, [0,171,2,1,171,2,2,172,2,3,172,2,4,172,2,5,173,1,6,173,1,7,173,1,8,173,1]],
      [255, 255, 253, [0,260,1,1,260,2]],
      [253, 254, 249, [1,246,2,2,245,2,3,245,3,4,246,2,5,246,2,6,246,2,7,246,2,8,246,2]],
      [253, 255, 255, [1,128,1,2,127,2,3,128,1,4,128,1]],
      [253, 255, 255, [1,167,2,2,167,2,3,167,2,4,167,2,5,167,2,6,168,1,7,168,1,8,168,2,9,168,2,10,168,1]],
      [255, 254, 253, [1,328,2,2,328,2,3,327,3,4,327,2,5,327,2,6,327,2,7,327,2,8,327,2,9,327,4,10,327,5]],
      [255, 253, 253, [1,435,1,2,435,1,3,435,1,4,435,2,5,435,2,6,435,3,7,435,3,8,435,2,9,435,3,10,436,2]],
      [255, 254, 249, [1,102,2,2,102,3,3,102,3,4,102,2,5,102,2,6,102,2,7,102,2,8,102,2,9,103,1]],
      [250, 253, 249, [1,12,1]],
      [254, 254, 253, [1,463,1,2,462,2,3,462,3,4,463,2,5,463,2,6,463,2,7,462,3,8,463,2,9,462,2]],
      [246, 244, 244, [2,295,1,3,294,2,4,294,2,5,294,2,6,294,2,7,294,2,8,294,2,9,294,2,10,294,1]],
      [251, 255, 252, [2,421,2,3,421,1]],
      [252, 252, 252, [2,431,1,3,431,1,4,431,2,5,431,2,6,431,2,7,431,2,8,431,2]],
      [251, 251, 251, [2,550,1,3,547,1,3,549,2,4,547,4,5,548,3,6,549,2,7,550,1,8,549,2,9,549,2]],
      [253, 253, 251, [2,612,1,3,612,2,4,612,2,5,612,2,6,612,2,7,612,2,8,612,2,9,612,2,10,611,2]],
      [255, 253, 246, [2,475,1,3,474,2]],
      [254, 254, 253, [2,483,1,3,482,2,4,482,4,5,482,3,6,482,2,7,482,2,8,482,2,9,482,2,10,481,3,11,481,2,12,481,3,13,482,2,14,482,2,15,480,4,16,480,4]],
      [254, 255, 253, [2,530,1,3,530,1,4,529,2,5,529,2,6,529,2,7,529,2,8,529,1]],
      [253, 253, 252, [2,617,2,3,615,4,4,615,5,5,615,2,5,618,2,6,615,5,7,615,5,8,615,2,8,618,2,9,615,6,10,615,4]],
      [255, 254, 254, [3,9,1]],
      [253, 254, 253, [3,372,3,4,372,3,5,372,3,6,372,3,7,372,2,8,372,1]],
      [254, 254, 254, [3,396,2]],
      [255, 255, 252, [3,467,1]],
      [253, 255, 255, [3,52,2,4,52,1,5,52,1]],
      [252, 255, 253, [3,57,2,4,57,1]],
      [254, 253, 252, [3,97,1,4,97,2,5,96,3,6,96,1,6,98,1]],
      [253, 254, 253, [3,290,2,4,290,3,5,290,3,6,290,3,7,290,3,8,290,3,9,290,3,10,289,2]],
      [229, 225, 225, [3,333,2,4,332,3]],
      [255, 255, 254, [3,362,1]],
      [253, 255, 255, [3,393,1]],
      [253, 255, 255, [3,634,1,4,634,1]],
      [253, 255, 255, [3,35,1,4,35,1]],
      [254, 255, 252, [3,112,2,4,112,3,5,112,3,6,112,3,7,112,3,8,111,4,9,111,1]],
      [254, 255, 254, [3,262,2,4,262,2,5,262,2,6,262,2,7,262,2,8,262,2,9,262,2,10,259,4]],
      [198, 198, 192, [3,411,1,4,411,1,5,411,1,6,410,2,7,410,2,8,410,2]],
      [254, 254, 254, [3,145,1,4,143,3,5,143,2,6,143,2,7,143,2,8,143,3,9,144,1]],
      [252, 252, 251, [3,182,1,4,182,2,5,182,3,6,183,2,7,183,2,8,183,2,9,183,2]],
      [250, 252, 248, [3,287,1,4,286,2]],
      [252, 255, 254, [3,323,1,4,323,3,5,324,2,6,324,3,7,325,2,8,325,2,9,325,2,10,324,2]],
      [255, 255, 255, [3,445,2,4,445,1]],
      [253, 255, 255, [3,505,1,4,505,1,5,505,1]],
      [252, 255, 254, [3,591,1,4,591,1]],
      [255, 252, 248, [3,780,1,4,780,3,5,780,3,6,781,2,7,781,1,8,780,2,9,781,1]],
      [251, 254, 254, [3,821,1,4,820,2,5,820,2,6,820,2,7,820,2,8,820,2,9,820,2]],
      [254, 254, 249, [3,969,1,4,967,5,5,967,5,6,967,2,6,970,2,7,967,2,7,970,2,8,967,2,8,970,2,9,967,2]],
      [251, 253, 253, [4,135,2,5,136,2,6,136,2]],
      [255, 255, 254, [4,219,1,5,218,2,6,218,2,7,218,2,8,218,2]],
      [214, 213, 217, [4,309,3,5,310,3,6,311,2,7,311,2,8,310,3,9,305,1,9,307,5,10,305,6]],
      [255, 255, 255, [4,345,1]],
      [218, 214, 214, [4,478,3,5,479,2,6,480,1]],
      [255, 254, 252, [4,526,2,5,526,2,6,526,2,7,526,2,8,526,2,9,526,3,10,526,3]],
      [255, 255, 255, [4,761,1]],
      [253, 255, 255, [4,866,1,5,867,1]],
      [252, 255, 252, [4,1008,2,5,1008,1]],
      [255, 255, 255, [4,19,1,5,19,1]],
      [254, 255, 253, [4,252,1,5,252,2,6,252,2,7,252,2,8,252,2,9,252,2]],
      [254, 254, 244, [4,401,2,5,401,2,6,401,3,7,402,2]],
      [233, 234, 230, [4,414,2,5,414,3,6,414,3,7,414,3,8,415,2,9,415,2,10,416,1]],
      [255, 254, 251, [4,514,2,5,514,2,6,514,2,7,513,3,8,513,3,9,513,3,10,514,2]],
      [253, 255, 253, [4,534,1,5,533,1]],
      [254, 254, 251, [4,539,2,5,539,2,6,539,3,7,539,4,8,539,4,9,540,1,9,542,1]],
      [255, 255, 255, [4,569,1]],
      [255, 255, 255, [4,607,1]],
      [255, 255, 255, [4,624,1,5,624,1]],
      [248, 253, 252, [4,700,1]],
      [255, 255, 255, [4,749,1]],
      [209, 207, 205, [4,769,4,5,769,3,6,771,1]],
      [251, 254, 247, [4,979,1,5,978,2,6,978,1]],
      [255, 254, 251, [4,991,3,5,992,2,6,992,2,7,992,2,8,992,2,9,989,5,10,989,4,11,989,2,12,989,2]],
      [254, 255, 251, [4,1013,1,5,1013,2,6,1013,4,7,1013,4,8,1015,4,9,1015,5]],
      [253, 254, 250, [4,14,3,5,14,3,6,14,3,7,14,3,8,14,2,9,14,2]],
      [254, 255, 254, [4,681,1,5,680,3,6,680,2,7,680,2,8,680,2]],
      [255, 255, 253, [4,805,1,5,805,3,6,805,3,7,805,3,8,805,3,9,806,1]],
      [253, 255, 255, [4,813,2,5,813,2,6,813,1,7,813,1,8,813,1]],
      [255, 254, 254, [4,832,1,5,832,2,6,832,2,7,832,2,8,830,4,9,830,4,10,832,2]],
      [253, 254, 253, [4,895,2,5,895,2,6,895,2,7,895,2,8,895,2]],
      [252, 254, 254, [4,929,3,5,929,3,6,930,1]],
      [255, 255, 252, [4,84,1,5,83,2]],
      [254, 254, 253, [4,658,1,5,658,2,6,657,3,7,659,1,8,659,1,9,659,3,10,659,3,11,660,2,12,660,2,13,660,3,14,660,3,15,661,4,16,662,3,17,663,2,18,663,2,19,663,2,20,663,2,21,663,2,22,663,2,23,663,2]],
      [241, 241, 241, [4,836,1,5,836,1]],
      [254, 254, 252, [4,925,1,5,924,2,6,924,2,7,925,1,8,924,2,9,924,4,10,925,3]],
      [253, 255, 253, [4,946,1,5,946,1]],
      [245, 235, 243, [5,517,2]],
      [254, 255, 253, [5,795,2,6,795,2,7,795,2,8,795,2,9,795,4,10,795,6,11,795,2,11,799,3,12,795,2,12,799,3,13,795,3,13,799,3,14,796,2,14,799,2,15,796,5,16,796,4]],
      [239, 238, 241, [5,879,2,6,879,2]],
      [254, 254, 254, [5,917,2,6,918,1,7,918,1,8,918,1]],
      [255, 255, 254, [5,982,2,6,982,2,7,983,1]],
      [254, 254, 254, [5,668,1]],
      [254, 255, 254, [5,710,2,6,709,3,7,709,3,8,710,2,9,710,2,10,710,2]],
      [255, 255, 255, [5,849,1]],
      [254, 254, 250, [5,883,2,6,883,2,7,883,2,8,883,2,9,883,3,10,884,2,11,883,3,12,884,2,13,883,3,14,883,3,15,883,2,16,883,3,17,883,3,18,884,2,19,884,2]],
      [248, 250, 249, [5,889,2,6,889,2]],
      [255, 255, 255, [5,622,1]],
      [253, 255, 254, [5,800,2,6,800,2,7,800,2,8,800,2,9,800,2]],
      [252, 253, 253, [5,823,2,6,823,2,7,823,2,8,823,2,9,823,3,10,823,2]],
      [254, 253, 252, [5,951,1,6,950,2,7,951,2,8,951,1]],
      [253, 255, 255, [5,965,1,6,965,1]],
      [255, 252, 250, [5,999,1]],
      [254, 255, 248, [6,976,1]],
      [255, 254, 254, [6,988,2,7,989,1,8,987,3,9,987,2]],
      [255, 255, 255, [6,830,1,7,830,1]],
      [252, 254, 254, [6,942,2,7,942,2]],
      [179, 169, 170, [6,197,1,7,197,2,8,197,1,9,197,2,10,197,2]],
      [255, 255, 255, [6,596,1,7,596,1]],
      [253, 252, 251, [6,357,1,7,356,3,8,356,3]],
      [253, 253, 253, [6,953,2,7,953,2,8,953,2]],
      [255, 255, 254, [7,500,2,8,500,2,9,500,2,10,501,1]],
      [255, 254, 251, [7,622,1]],
      [254, 254, 254, [7,667,3,8,667,3,9,667,4,10,668,1,11,668,1]],
      [254, 254, 252, [7,418,1,8,418,2,9,418,2,10,418,2]],
      [253, 255, 253, [7,83,2,8,82,3,9,82,1]],
      [199, 191, 183, [7,272,1,8,270,3,9,269,4,10,269,2]],
      [171, 167, 164, [7,467,1]],
      [251, 255, 250, [8,625,2]],
      [253, 254, 253, [8,771,1]],
      [253, 255, 255, [8,964,2]],
      [252, 254, 250, [8,4,1,9,3,2]],
      [252, 255, 254, [8,685,2,9,685,2,10,686,1]],
      [238, 241, 240, [8,835,1]],
      [242, 242, 241, [8,859,1,9,859,1]],
      [253, 254, 253, [8,8,2,9,6,4,10,6,4,11,6,3,12,6,6,13,6,1,13,8,3]],
      [255, 255, 253, [8,318,2,9,319,1]],
      [254, 255, 254, [8,596,2,9,597,2,10,597,2]],
      [255, 255, 254, [9,951,2]],
      [237, 233, 230, [8,478,1,9,477,2]],
      [254, 255, 252, [9,675,7,10,674,8]],
      [255, 255, 253, [9,65,5,10,65,5]],
      [252, 252, 252, [9,212,2,10,212,2]],
      [252, 255, 255, [9,635,2,10,635,2]],
      [226, 227, 229, [9,742,1,10,742,1]],
      [252, 250, 248, [9,749,1]],
      [243, 238, 235, [9,25,3,10,24,4]],
      [253, 255, 255, [9,43,1,10,43,2]],
      [255, 254, 253, [9,141,2,10,141,3]],
      [254, 255, 255, [9,313,4,10,311,5]],
      [255, 255, 253, [9,563,1,10,563,1]],
      [254, 254, 251, [9,580,2,10,580,2]],
      [255, 253, 254, [9,639,3,10,639,3]],
      [252, 255, 255, [9,647,2,10,647,2]],
      [253, 254, 254, [9,703,3,9,707,1,10,703,6,11,707,2,12,707,2,13,707,2,14,707,2,15,707,2,16,707,2,17,707,2,18,707,2,19,707,2,20,708,2,21,708,2,22,708,2]],
      [249, 248, 247, [9,898,5,10,898,6]],
      [255, 255, 255, [9,1013,2,10,1013,1]],
      [248, 248, 248, [9,87,4,10,87,4]],
      [254, 254, 252, [9,139,2,10,139,2]],
      [253, 255, 255, [9,151,2,10,151,3]],
      [254, 255, 253, [9,224,2,10,224,3,11,225,2,12,225,2,13,225,2,14,225,2,15,225,2,16,225,2,17,226,1,18,226,1,19,226,1,20,226,1,21,226,1,22,226,1]],
      [253, 255, 255, [9,346,1]],
      [252, 255, 255, [9,367,1]],
      [253, 255, 253, [9,503,2,10,503,2,10,508,1,11,503,2,11,507,2,12,504,2,12,507,2,13,504,2,13,507,2,14,504,5,15,505,4,16,507,2]],
      [254, 253, 255, [9,590,1,10,590,1]],
      [252, 255, 253, [9,914,2,10,913,3]],
      [254, 254, 252, [9,948,2,10,947,3]],
      [252, 254, 255, [9,12,1,10,12,1]],
      [254, 255, 254, [9,36,2,10,36,3,11,38,1,12,37,2,13,37,2,14,37,2,15,37,2,16,37,1,17,37,1]],
      [253, 255, 255, [9,45,1,10,45,1]],
      [254, 254, 254, [9,54,1]],
      [255, 255, 255, [9,99,1,10,99,4]],
      [254, 254, 252, [9,109,2]],
      [255, 253, 255, [9,115,1,10,115,1]],
      [255, 255, 255, [9,301,1]],
      [255, 255, 255, [9,317,1,10,316,1]],
      [198, 198, 200, [9,443,1]],
      [254, 254, 252, [9,481,1]],
      [255, 255, 253, [9,485,1]],
      [255, 255, 251, [9,559,1,10,559,1]],
      [254, 255, 253, [9,567,2,10,567,2,11,567,2,12,567,2,13,567,2,14,567,3,15,567,3,16,567,3,17,569,1]],
      [253, 255, 253, [9,701,1,10,698,4]],
      [255, 254, 253, [9,729,1,10,724,2,10,728,2,11,724,2,11,728,2,12,723,3,12,728,2,13,723,3,13,728,2,14,723,3,14,728,2,15,724,6,16,725,3]],
      [255, 253, 254, [9,759,2]],
      [253, 255, 254, [9,776,3,10,774,5]],
      [253, 255, 255, [9,792,1]],
      [253, 255, 252, [9,880,1,10,879,2,11,879,1]],
      [255, 255, 255, [9,922,1,10,921,2]],
      [253, 254, 254, [9,964,1,10,963,2,11,963,3,12,964,2,13,964,3,14,965,2]],
      [254, 254, 255, [9,999,1,10,999,1]],
      [246, 246, 234, [10,30,1]],
      [252, 249, 240, [10,33,1,11,33,2]],
      [255, 255, 255, [10,103,1]],
      [242, 243, 242, [10,180,5,11,182,2,12,182,2,13,182,2,14,182,1,15,182,1,16,182,1,17,182,1]],
      [251, 254, 250, [10,188,2]],
      [255, 255, 255, [10,240,1]],
      [255, 255, 252, [10,420,1]],
      [255, 255, 253, [10,424,1]],
      [255, 255, 253, [10,426,1]],
      [254, 254, 254, [10,571,3]],
      [255, 254, 253, [10,592,2,11,592,2,12,592,2,13,592,2,14,591,3,15,590,3,16,590,2,17,589,1]],
      [255, 255, 253, [10,621,1]],
      [252, 252, 249, [10,642,3,11,642,2,12,641,3,13,641,2,14,642,1]],
      [253, 255, 253, [10,657,2,11,657,3,12,658,2,13,658,2,14,658,2,15,658,2,16,658,2,17,658,2,18,658,2,19,658,2,20,658,2,21,658,3,22,659,2]],
      [250, 250, 251, [10,730,2,11,730,2,12,730,2,13,731,2,14,731,1]],
      [255, 253, 254, [10,759,1]],
      [255, 255, 255, [10,773,1]],
      [254, 254, 254, [10,875,1]],
      [252, 255, 254, [10,1004,6]],
      [255, 255, 253, [10,62,1]],
      [253, 255, 255, [10,104,2]],
      [249, 253, 253, [10,165,2,11,165,2,12,165,2,13,165,1]],
      [255, 255, 253, [10,387,1]],
      [255, 255, 253, [10,551,1]],
      [255, 255, 254, [10,565,1]],
      [252, 251, 254, [10,631,1]],
      [251, 253, 255, [10,720,1]],
      [254, 255, 250, [10,757,1]],
      [253, 246, 246, [10,783,1]],
      [255, 255, 253, [10,788,1]],
      [252, 255, 252, [10,841,2]],
      [251, 255, 254, [10,851,1]],
      [246, 246, 246, [10,888,5]],
      [253, 255, 253, [10,912,1]],
      [255, 255, 255, [10,958,1]],
      [255, 255, 254, [10,976,4,11,976,1,12,975,3,13,976,2,14,976,2,15,976,2,16,975,3,17,975,2]],
      [253, 255, 255, [10,985,1]],
      [255, 254, 255, [10,986,1]],
      [253, 255, 253, [10,11,1]],
      [253, 255, 255, [10,178,1]],
      [254, 255, 253, [11,310,1,12,309,2,13,309,2,14,309,2,15,310,1,16,310,2,17,310,2,18,310,2,19,310,2,20,310,2,21,310,2,22,310,2,23,311,2,24,311,4,25,312,3]],
      [253, 255, 254, [10,451,1,11,450,2,12,450,2,13,450,2,14,451,1,15,450,2,16,450,2,17,450,2,18,450,2,19,450,2,20,451,1]],
      [255, 255, 255, [10,538,1]],
      [252, 255, 253, [10,564,1]],
      [255, 253, 254, [10,758,1]],
      [254, 255, 253, [10,825,4,11,825,2,11,828,2,12,825,2,12,828,3,13,825,2,13,829,2,14,825,2,14,829,2,15,825,2,15,829,2,16,825,2,16,829,2,17,825,2,17,828,3,18,825,2,18,828,2,19,825,2]],
      [255, 255, 255, [10,886,2]],
      [253, 255, 254, [11,979,2,12,979,2,13,978,3,14,978,2,15,978,3,16,979,2,17,979,2,18,979,1]],
      [253, 255, 255, [10,984,1]],
      [253, 255, 255, [10,179,1]],
      [251, 255, 255, [10,204,2]],
      [252, 255, 254, [10,337,1,11,337,1]],
      [255, 255, 255, [10,493,1]],
      [253, 255, 253, [10,519,1]],
      [255, 255, 254, [11,864,1]],
      [253, 255, 255, [11,49,1]],
      [252, 255, 255, [11,62,1]],
      [255, 252, 249, [11,65,4,12,65,4,13,67,3,14,68,2]],
      [255, 255, 253, [11,255,1]],
      [253, 254, 254, [11,179,1,12,179,1,13,179,1,14,179,1,15,178,2,16,178,2,17,178,2,18,178,2,19,178,2,20,178,2,21,178,2,21,182,2,22,178,2,22,182,2,23,178,2,23,182,2,24,179,5,25,180,4,26,181,3,27,183,1]],
      [255, 255, 255, [11,486,1,12,486,1]],
      [252, 255, 254, [11,553,1,12,553,2,13,553,2,14,553,2,15,553,2,16,553,5,17,553,6,18,557,1]],
      [247, 243, 232, [11,26,1,12,25,2,13,25,3,14,25,2,15,25,3,16,26,2]],
      [255, 254, 255, [11,608,1]],
      [252, 255, 253, [11,669,1]],
      [200, 201, 196, [11,860,1]],
      [255, 254, 253, [12,149,2,13,149,3,14,149,3,15,150,2,16,150,1]],
      [254, 252, 251, [12,681,3,13,680,4,14,680,3,15,680,1]],
      [253, 255, 254, [12,945,2,13,946,1,14,946,1,15,945,2,16,945,2,17,945,2,18,945,2,19,945,3,20,946,3,21,947,3]],
      [253, 255, 255, [12,48,1]],
      [255, 254, 255, [12,61,1]],
      [252, 254, 255, [12,125,1]],
      [193, 196, 188, [12,425,1]],
      [252, 254, 255, [12,492,1]],
      [254, 255, 254, [12,206,1,13,205,2,14,205,2,15,205,2,16,205,2,17,205,2,18,205,2,19,205,2,20,205,2,21,205,2,22,205,2,23,205,2,24,204,3,25,204,4,26,205,8,27,207,2,27,211,2,28,211,2,29,212,1,30,212,1,31,212,1,32,212,1,33,212,1,34,212,1,35,212,1,36,212,1,37,212,1,38,212,1,39,212,1]],
      [217, 218, 220, [12,703,2,13,702,4,14,704,3,15,705,2,16,704,3,17,705,2,18,705,2,19,705,1]],
      [252, 255, 254, [12,879,1]],
      [252, 254, 252, [13,425,2,14,425,2,15,425,2,16,425,1,17,424,2,18,424,2,19,424,2,20,423,3,21,423,2,22,423,3,23,424,2,24,425,2,25,426,1]],
      [254, 254, 251, [12,436,2,13,436,2,14,436,2,15,435,3,16,435,3,17,435,3,18,436,2,19,436,2,20,436,2,21,434,4,22,434,4,23,433,3,24,433,2]],
      [254, 255, 253, [12,913,4,12,918,2,13,913,10,14,914,4,14,920,3,15,921,2,16,921,2,17,921,2,18,920,3,19,920,2,20,920,2,21,920,2,22,920,2,23,920,2,24,920,2,25,920,3,26,921,2,27,921,2,28,921,2,29,921,2,30,920,3,31,920,2,32,920,3,33,920,2,34,919,3,35,919,2,36,918,2]],
      [255, 255, 253, [13,81,1]],
      [253, 247, 228, [13,34,2,14,34,2]],
      [248, 249, 247, [13,430,2,14,430,4,15,430,5,16,430,3,17,431,2,18,431,1,19,431,1,20,431,1,21,431,2,22,431,2,23,431,2]],
      [252, 255, 254, [13,879,1]],
      [255, 255, 255, [13,959,1]],
      [252, 253, 251, [13,155,1,14,154,2,15,154,2,16,154,2,17,154,2,18,154,2,19,154,2,20,153,3,21,153,2,22,153,2,23,153,2,24,153,3,25,153,3,26,154,2,27,155,1]],
      [253, 255, 255, [13,366,1]],
      [229, 228, 227, [13,717,2,14,717,2]],
      [255, 255, 254, [14,111,2,15,110,3,16,110,2,17,110,2,18,110,2,19,110,2,20,110,2,21,109,3]],
      [255, 255, 255, [14,693,1]],
      [139, 138, 143, [14,186,1]],
      [254, 255, 253, [14,457,3,15,458,2,16,457,3,17,457,3,18,456,3,19,455,3,20,454,3]],
      [254, 254, 254, [14,126,2,15,127,1]],
      [254, 255, 252, [14,367,1]],
      [253, 255, 254, [14,614,2,15,614,3,16,613,3,17,614,2,18,614,1,19,614,1,20,614,2,21,614,2,22,614,2,23,614,3,24,614,3,25,614,2,26,614,2,27,614,2,28,614,2,29,614,2,30,614,2,31,614,2,32,614,2,33,614,1,34,614,1,35,614,1,36,614,1,37,614,1,38,614,1,39,614,1,40,614,2,41,614,2,42,614,2,43,614,2,44,614,2,45,614,2,46,614,1,47,614,1,48,614,1,49,614,1,50,614,1,51,614,2,52,615,1,53,615,1,54,615,1]],
      [253, 255, 255, [14,331,1,15,330,2,16,329,3,17,329,1]],
      [212, 206, 203, [14,782,1,15,780,3,16,781,1]],
      [253, 253, 249, [15,18,1]],
      [253, 255, 255, [15,250,1]],
      [255, 254, 253, [15,279,4,16,278,5,17,277,4,18,277,2]],
      [244, 241, 234, [15,75,2]],
      [254, 254, 252, [15,85,2,16,85,2,17,85,2,18,85,2,19,85,2,20,85,2,21,86,2,22,85,3,23,85,3,24,85,3,25,85,3,26,85,3,27,85,3,28,85,3,29,85,2,30,85,2,31,85,1,32,85,1,33,85,1,34,84,2,35,84,1,36,84,1]],
      [255, 255, 253, [15,183,1]],
      [255, 255, 254, [15,380,3,16,378,5,17,378,2,18,378,2,19,378,2,20,378,2,21,378,5,22,378,6,23,379,1,23,382,2,24,382,2]],
      [253, 255, 255, [15,909,1]],
      [252, 255, 252, [15,753,1]],
      [255, 253, 255, [15,908,1]],
      [255, 255, 255, [16,317,2,17,317,1]],
      [248, 253, 252, [16,472,1]],
      [253, 255, 253, [16,1015,2]],
      [246, 250, 253, [16,473,2,17,473,2]],
      [255, 255, 255, [16,693,1]],
      [251, 249, 247, [16,731,2,17,730,3,18,731,2]],
      [254, 252, 249, [16,757,3,16,761,4,17,757,8,18,757,2,18,760,5,19,756,3,19,764,1,20,756,2,20,764,1,21,756,2,21,764,1,22,756,1]],
      [255, 255, 255, [16,1006,3]],
      [252, 254, 252, [16,384,2,17,384,3,18,384,3,19,384,3,20,384,2,21,384,2,22,384,2,23,384,2]],
      [253, 255, 255, [16,574,1,17,573,1]],
      [255, 255, 253, [17,33,1]],
      [255, 255, 255, [17,807,1]],
      [252, 255, 254, [17,241,2]],
      [254, 255, 254, [17,258,5,18,257,7,19,257,1,19,263,1]],
      [253, 255, 255, [17,337,2,18,338,1]],
      [253, 255, 255, [17,570,1]],
      [253, 255, 253, [17,769,1]],
      [253, 254, 252, [17,838,3,18,838,2,19,837,3,20,837,3,21,838,2,22,838,2,23,838,3,24,838,3,25,838,2,26,838,2,27,838,2,28,838,1,29,838,1,30,838,1,31,838,2,32,839,1]],
      [253, 255, 255, [17,69,1,18,70,1]],
      [253, 255, 255, [17,236,1]],
      [253, 255, 255, [17,326,1]],
      [253, 255, 255, [17,571,1]],
      [253, 255, 255, [17,621,1]],
      [255, 255, 255, [17,833,2,18,833,2,19,833,2,20,833,1]],
      [253, 255, 253, [17,240,1]],
      [253, 254, 254, [17,252,2,18,250,4,19,251,2,20,251,1,21,251,1,22,251,2,23,251,2,24,252,2,25,252,2,26,252,2,27,252,2,28,252,2,29,252,2,30,252,2,31,252,2,32,252,2,33,252,2,34,252,2,35,253,1,36,253,1]],
      [254, 255, 254, [17,285,1,18,285,2,19,285,2,20,285,2,21,285,2,22,285,2,23,285,2,24,285,2,25,285,2,26,285,2,27,284,3,28,284,2,29,284,2,30,284,2,31,283,2,32,283,2,33,283,1]],
      [252, 255, 254, [17,477,1,18,477,1]],
      [248, 251, 248, [18,339,1]],
      [253, 255, 255, [18,420,1,19,420,1]],
      [253, 254, 254, [18,603,2,18,606,2,19,603,5,20,602,5,21,602,2,22,603,2,23,603,2,24,603,2,25,603,2,26,603,2,27,603,2,28,603,2,29,603,2,30,603,2,31,603,2,32,603,4,33,603,5,34,606,2,35,606,2,36,606,3,37,607,2,38,607,2,39,607,2,40,607,2,41,607,2,42,607,2,43,607,2,44,607,2,45,608,1,46,607,2,47,607,2,48,607,2,49,608,1,50,607,2,51,608,1,52,608,1,53,608,1,54,608,1,55,608,1]],
      [255, 255, 251, [18,801,1]],
      [255, 254, 255, [18,474,3,19,474,1]],
      [253, 255, 254, [18,927,1,19,927,1,20,926,2,21,926,1,22,926,1,23,925,2,24,925,2,25,926,2,26,926,2,27,926,2,28,926,1,29,926,1,30,926,2,31,926,1,32,926,1,33,926,2,34,926,2,35,926,2,36,926,2,37,926,1]],
      [255, 255, 253, [18,928,1]],
      [252, 255, 254, [18,907,1,19,907,1,20,907,2,21,907,2,22,907,1,23,907,2,24,907,2,25,907,2]],
      [255, 255, 253, [19,53,2,20,53,3]],
      [252, 251, 248, [19,188,2,20,188,2,21,188,2,22,188,2,23,188,2,24,188,3,25,187,3,26,186,3]],
      [242, 233, 228, [19,525,1]],
      [251, 252, 245, [19,730,2,20,729,2,21,729,1]],
      [253, 255, 255, [19,801,1]],
      [254, 254, 253, [19,941,2,20,939,5,21,938,6,22,942,2,23,943,2,24,944,1]],
      [253, 255, 255, [20,48,1,21,48,1,22,48,2,23,48,2]],
      [255, 254, 255, [20,474,1]],
      [246, 247, 248, [20,717,2,21,717,2,22,716,3,23,716,2,24,717,2,25,717,2,26,717,2,27,717,2,28,718,1]],
      [252, 255, 255, [20,973,1]],
      [254, 255, 255, [20,61,1]],
      [254, 255, 254, [20,290,2,21,289,3,22,289,2,23,289,2,24,289,2,25,289,2,26,289,2,27,289,2,28,288,3,29,288,3,30,288,3,31,289,2,32,289,2,33,289,2,34,289,2,35,289,2,36,289,2]],
      [255, 255, 250, [20,107,1]],
      [255, 255, 255, [20,950,1]],
      [254, 254, 253, [20,101,1,21,101,2,22,101,2,23,101,3,24,102,2,25,102,2,26,103,1,27,103,1,28,103,1]],
      [254, 254, 252, [20,106,1]],
      [253, 255, 255, [20,518,1,21,518,1]],
      [253, 255, 255, [21,121,1]],
      [252, 254, 249, [21,1016,1,22,1015,2,23,1015,2]],
      [253, 255, 255, [21,420,1]],
      [192, 189, 186, [21,734,1,22,733,2]],
      [254, 255, 252, [21,295,1,22,295,1,23,295,1,24,295,1,25,295,1,26,295,1,27,295,1,28,295,1,29,294,2,30,294,2,31,294,2,32,294,2,33,294,1,34,294,1,35,293,2,36,293,2,37,294,2]],
      [253, 255, 255, [22,764,1]],
      [239, 237, 236, [21,863,1,22,862,2]],
      [247, 247, 247, [22,343,1]],
      [253, 255, 255, [22,728,1]],
      [254, 255, 253, [22,771,1,23,771,2,24,771,2,25,771,2,26,771,2,27,771,3,28,772,2,29,771,3,30,771,3,31,771,3,32,771,3,33,771,3,34,771,3,35,771,3,36,771,3,37,771,3,38,771,3,39,771,2,40,771,2,41,771,2,42,771,2,43,771,2,44,771,2,45,771,1,46,771,1,47,770,2,48,770,1,49,770,1,50,770,1]],
      [253, 255, 255, [22,420,1]],
      [255, 255, 255, [22,221,2,23,221,2,24,221,3,25,221,2,26,221,2,27,221,2,28,221,1,29,221,1,30,220,2,31,221,2,32,221,2,33,221,2,34,221,2,35,221,2,36,221,2,37,222,1]],
      [254, 254, 253, [22,890,2,23,891,2,24,891,2,25,891,2,26,891,2,27,891,2,28,891,2,29,891,2,30,892,1,31,892,1,32,891,2,33,890,3,34,891,2,35,891,2,36,891,2,37,891,2,38,892,2,39,892,2,40,892,1,41,892,1,42,892,1]],
      [255, 255, 255, [22,257,1,23,257,2,24,258,2,25,258,2,26,258,3,27,259,2,28,260,1]],
      [255, 254, 255, [22,473,1]],
      [253, 255, 254, [23,198,2,24,198,2]],
      [254, 255, 254, [23,879,1]],
      [255, 255, 255, [23,132,2,24,132,2,25,132,2,26,132,2,27,132,2,28,132,2,29,133,1,30,133,1,31,133,1]],
      [252, 248, 250, [23,525,1,24,524,2]],
      [188, 185, 184, [23,343,2,24,343,2,25,343,2]],
      [255, 254, 255, [23,474,1]],
      [255, 255, 255, [23,833,1,24,833,2,25,833,2,26,833,2,27,832,3,28,832,2,29,832,2,30,832,2,31,833,1,32,833,2,33,833,3,34,834,3,35,835,3]],
      [255, 255, 255, [24,109,1]],
      [253, 255, 255, [24,48,1]],
      [254, 255, 255, [25,109,1,26,109,2,27,110,2,28,110,2,29,110,2,30,110,2,31,110,2,32,110,2,33,110,2,34,110,2,35,110,2,36,110,1]],
      [254, 255, 255, [24,217,2,25,217,2,26,217,2,27,216,3,28,216,3,29,216,2,30,216,2,31,216,2,32,216,2,33,216,2,34,216,2,35,217,1,36,217,1,37,217,1,38,217,1]],
      [253, 255, 253, [24,675,1,25,675,1]],
      [254, 255, 254, [24,935,1,25,934,2,26,934,2,27,935,2,28,935,2,29,935,2,30,935,2,31,935,2,32,935,2,33,936,1,34,935,2,35,935,2]],
      [253, 254, 251, [24,421,2,25,420,5,26,420,7]],
      [253, 255, 254, [24,856,2,25,854,4]],
      [253, 255, 255, [24,879,1]],
      [253, 255, 254, [25,529,4,26,528,6,27,528,2,28,528,2,29,528,2,30,528,1,31,528,2,32,528,3,33,528,3,34,529,3,35,530,2,36,531,1]],
      [194, 185, 181, [25,166,1,26,166,1]],
      [255, 254, 255, [25,858,1]],
      [253, 255, 255, [26,199,1]],
      [255, 254, 255, [26,859,1]],
      [253, 254, 253, [26,359,3,27,358,5,27,365,2,28,356,4,28,361,6,29,356,3,29,362,4,30,356,2,31,356,2,32,356,2,33,356,2,34,356,2,35,357,1,36,357,1,37,357,1,38,357,1,39,357,1]],
      [253, 255, 254, [26,688,1,27,687,3]],
      [253, 255, 255, [26,694,1]],
      [251, 255, 254, [27,185,1]],
      [253, 255, 255, [27,727,1,28,727,1,29,726,2,30,726,2,31,727,1,32,727,1,33,726,2,34,726,2,35,726,2,36,726,2]],
      [253, 255, 255, [27,447,1]],
      [252, 255, 252, [27,810,1,28,809,1]],
      [253, 254, 251, [27,56,1,28,56,1,29,56,1,30,55,2,31,55,2,32,55,2,33,55,3,34,57,2]],
      [255, 254, 255, [27,982,1]],
      [253, 255, 255, [27,879,1,28,879,1]],
      [253, 255, 255, [27,988,1]],
      [255, 255, 253, [28,199,1,29,199,1]],
      [253, 255, 255, [28,539,1]],
      [255, 255, 254, [28,808,1]],
      [254, 254, 254, [28,117,2,29,116,2,30,115,3,31,115,2,32,115,2,33,115,3,34,116,1,35,116,2,36,116,2,37,116,2,38,116,2,39,116,2,40,116,2,41,116,2,42,114,4,43,114,2]],
      [253, 255, 255, [28,988,1]],
      [253, 255, 255, [29,539,1]],
      [252, 255, 255, [29,818,1]],
      [253, 255, 255, [29,989,1]],
      [253, 255, 254, [29,121,1,30,119,3,31,120,1]],
      [253, 255, 253, [29,368,1,30,368,1,31,367,2,32,367,2,33,367,2,34,366,3,35,366,2,36,366,2,37,367,1,38,366,2,39,366,2,40,366,2]],
      [255, 255, 255, [29,200,1,30,200,1]],
      [254, 254, 252, [29,520,1,30,520,2,31,520,2,32,520,2,33,519,3,34,520,2,35,520,2,36,520,2,37,520,2,38,519,3,39,519,3,40,520,2,41,520,2,42,519,3,43,519,3,44,519,3,45,519,2,46,519,1,47,519,1,48,518,2,49,518,1,50,518,1]],
      [253, 254, 254, [29,578,4,30,577,1,30,579,5,31,580,5,32,584,1,33,584,1,34,584,1,35,584,1,36,584,1,37,583,2,38,583,2,39,584,1,40,584,1,41,584,1,42,584,2,43,585,1,44,585,1,45,585,1,46,585,1]],
      [253, 255, 255, [29,982,1,30,982,1]],
      [255, 255, 254, [30,183,1,31,183,2,32,183,2,33,183,2,34,183,2,35,183,2,36,183,2,37,183,2,38,183,2,39,183,2,40,183,2,41,183,2,42,183,2,43,183,2,44,183,2,45,183,2,46,183,2,47,184,1,48,184,1,49,184,1]],
      [254, 255, 254, [30,539,1,31,539,2,32,540,1,33,539,2,34,539,2,35,539,2,36,539,2,37,539,2,38,539,2,39,539,2,40,538,3,41,538,3,41,544,7,41,556,1,42,538,3,42,542,16,43,538,2,43,542,1,43,544,1,43,551,8,44,538,2,44,541,2,44,557,2,45,538,5,46,538,5,47,539,4,48,541,1]],
      [169, 157, 157, [30,1009,2]],
      [255, 255, 255, [30,787,1,31,787,1]],
      [252, 255, 255, [30,983,1]],
      [255, 255, 253, [31,576,1]],
      [255, 255, 255, [31,200,1,32,200,2,33,200,2]],
      [253, 255, 255, [31,562,1,32,562,1,33,562,1,34,562,1,35,562,1,36,562,1,37,562,1]],
      [254, 255, 254, [31,575,1]],
      [250, 248, 228, [31,849,1,32,849,1]],
      [255, 255, 255, [31,983,1,32,984,1]],
      [254, 254, 254, [33,48,1,34,48,1,35,48,1,36,48,2,37,48,2,38,48,2,39,49,4,40,49,8,41,52,4]],
      [255, 255, 253, [33,1011,1]],
      [253, 255, 255, [33,996,1,34,995,2]],
      [254, 255, 253, [34,91,6,35,90,9,36,90,2,36,97,2,37,98,2]],
      [253, 255, 255, [34,846,1,35,846,1]],
      [254, 249, 242, [34,1014,3,35,1014,3,36,1015,2]],
      [253, 255, 255, [34,879,1,35,879,1]],
      [254, 255, 255, [35,137,3,36,136,5,37,135,2,37,139,3,38,134,3,38,140,3,39,134,2,40,134,2,41,135,1,42,136,1]],
      [255, 255, 255, [36,572,1,37,572,1,38,571,2,39,571,1,40,571,1,41,571,1,42,571,1,43,571,1,44,571,1,45,571,1]],
      [255, 255, 255, [36,935,1]],
      [253, 252, 250, [36,86,3,37,85,2]],
      [254, 255, 251, [36,225,3,37,224,4,38,224,4]],
      [253, 255, 255, [36,879,1,37,879,1]],
      [252, 254, 254, [36,920,3,37,919,5,38,922,3,39,924,1]],
      [255, 255, 255, [36,69,1]],
      [255, 255, 253, [36,820,1]],
      [195, 191, 190, [37,995,1]],
      [252, 255, 255, [37,78,1]],
      [252, 255, 254, [37,757,1]],
      [255, 255, 255, [37,888,1]],
      [255, 255, 255, [37,820,1,38,820,1]],
      [253, 255, 255, [38,418,1]],
      [254, 255, 255, [38,789,1,39,789,1,40,789,1,41,789,1,42,789,1,43,789,1,44,789,1]],
      [253, 255, 255, [38,757,1]],
      [255, 255, 254, [38,1014,3,39,1014,3,40,1014,1]],
      [255, 255, 255, [38,888,1,39,888,1]],
      [255, 248, 234, [38,980,1,39,979,2]],
      [253, 255, 253, [39,757,2,40,757,2,41,757,2,42,757,2,43,757,2,44,757,2,45,757,2,46,757,2,47,758,1]],
      [222, 211, 208, [39,999,2]],
      [202, 193, 192, [39,149,1]],
      [253, 255, 255, [39,819,1]],
      [253, 255, 255, [40,356,1]],
      [252, 255, 255, [40,727,1]],
      [255, 255, 255, [40,860,1]],
      [253, 255, 255, [40,1000,1]],
      [253, 255, 255, [41,907,1,42,907,1,43,907,1,44,907,1]],
      [254, 255, 255, [41,943,1,42,942,2,43,942,1,44,942,1,45,941,2,46,941,2,47,941,2,48,941,2,49,941,2,50,941,2,51,941,2,52,942,1]],
      [252, 254, 251, [41,301,5,42,298,8,43,294,7,43,305,2,44,306,1]],
      [253, 255, 254, [41,718,1,42,718,1,43,718,1,44,717,3,45,717,2,46,716,3,47,716,2]],
      [255, 255, 255, [42,562,1]],
      [253, 255, 255, [42,998,2]],
      [253, 255, 254, [42,688,1,43,687,2]],
      [252, 255, 255, [43,84,1]],
      [249, 250, 251, [43,111,2,44,112,2,45,112,1]],
      [253, 255, 255, [43,135,1]],
      [253, 255, 255, [44,446,1]],
      [255, 255, 255, [44,418,1]],
      [255, 255, 255, [44,687,1,45,687,2]],
      [255, 254, 249, [44,47,2,45,47,2,46,47,3]],
      [254, 255, 254, [45,418,1]],
      [255, 255, 253, [45,121,1,46,121,1,47,121,1,48,120,2,49,120,2]],
      [253, 254, 254, [46,417,1]],
      [254, 254, 254, [46,307,3,47,308,7,48,310,9,49,315,4]],
      [253, 255, 255, [46,688,1,47,688,1]],
      [255, 255, 255, [47,200,1]],
      [253, 255, 255, [47,880,1]],
      [254, 255, 254, [47,643,1,48,643,1,49,643,1,50,642,2,51,642,2,52,642,2,53,642,2,54,642,2,55,642,2,56,642,2,57,642,2,58,641,3,59,641,2,60,641,2,61,641,3,62,641,3,63,641,2,64,641,2,65,641,2,66,641,2,67,641,2,68,641,1,69,641,1,70,641,1]],
      [254, 255, 254, [47,891,1,48,891,1]],
      [255, 254, 252, [48,687,2,49,687,2,50,687,2,51,687,2,52,687,2,53,688,1]],
      [255, 255, 253, [48,888,1,49,888,1]],
      [253, 255, 255, [49,621,1,50,621,1,51,621,1,52,621,1,53,620,2,54,620,2,55,620,1,56,620,1,57,620,1,58,620,1]],
      [252, 255, 252, [49,99,2]],
      [255, 255, 255, [50,1016,3,51,1016,2]],
      [255, 255, 255, [50,762,1,51,762,2,52,762,2,53,763,1]],
      [253, 254, 254, [50,773,2,51,770,5,52,771,3]],
      [254, 251, 236, [51,97,2,52,97,3,53,98,1]],
      [254, 252, 250, [51,777,2,52,777,2,53,777,2,54,777,2,55,776,3,56,776,3,57,777,2,58,778,1]],
      [255, 255, 255, [51,1014,2,52,1014,2,53,1013,3]],
      [253, 255, 255, [52,892,1,53,892,1]],
      [253, 255, 255, [53,943,1]],
      [253, 255, 255, [53,944,1]],
      [255, 254, 252, [53,48,2]],
      [253, 255, 254, [54,892,1]],
      [254, 252, 253, [53,1016,1,54,1015,2,55,1014,3]],
      [253, 255, 255, [54,46,1]],
      [254, 255, 254, [54,859,1,55,859,1]],
      [253, 255, 255, [54,887,1,55,887,1]],
      [255, 255, 255, [54,951,1,55,951,1]],
      [254, 253, 251, [55,782,3,56,781,3,57,781,2,58,781,1]],
      [255, 255, 255, [55,200,1]],
      [254, 255, 253, [55,46,1,56,45,2,57,45,1]],
      [255, 255, 255, [55,952,1]],
      [254, 255, 255, [56,608,4,57,609,4,58,610,4,59,612,2]],
      [255, 255, 252, [56,708,3,57,707,4]],
      [255, 254, 251, [57,291,1,58,290,3]],
      [255, 253, 249, [57,851,1,58,850,2,59,850,3,60,851,3]],
      [253, 255, 255, [58,808,1]],
      [253, 255, 255, [58,198,2,59,194,6,60,194,5]],
      [253, 255, 253, [59,576,5,60,575,5]],
      [252, 255, 253, [59,46,1,60,45,5,61,45,1,61,48,1]],
      [254, 255, 250, [60,1016,3,61,1016,3]],
      [255, 254, 233, [60,895,1]],
      [255, 255, 255, [61,193,1]],
      [251, 250, 239, [61,94,1,62,94,1]],
      [252, 254, 252, [62,324,3,63,321,5,64,321,5,65,321,3,66,322,1]],
      [253, 255, 255, [62,809,1]],
      [255, 254, 255, [63,1013,3,64,1014,3]],
      [253, 255, 255, [64,1013,1]],
      [253, 255, 255, [64,809,1]],
      [254, 255, 255, [64,509,1,65,508,2,66,508,2,67,508,1,68,508,2,69,508,2,70,508,2,71,508,2,72,508,2,73,508,2,74,508,2,75,508,2,76,508,2,77,508,2,78,508,2,79,508,2,80,508,2,81,509,1,82,509,1,83,509,1,84,509,1,85,509,1]],
      [254, 250, 231, [64,93,1]],
      [254, 251, 227, [64,905,1,65,905,1]],
      [253, 252, 249, [65,1013,5,66,1016,3,67,1016,3]],
      [252, 255, 254, [65,121,1,66,121,1]],
      [253, 255, 255, [68,136,1,69,135,2,70,135,2,71,134,3,72,134,2,73,134,1]],
      [253, 255, 255, [68,935,1]],
      [253, 254, 254, [70,431,1]],
      [253, 255, 255, [70,935,1]],
      [255, 255, 255, [70,430,1]],
      [255, 255, 255, [70,820,1,71,820,1]],
      [253, 255, 255, [71,935,1]],
      [253, 255, 255, [70,954,1]],
      [253, 255, 253, [71,954,1]],
      [253, 255, 255, [72,935,1]],
      [255, 255, 255, [72,820,1,73,820,1]],
      [253, 255, 255, [73,1016,1]],
      [253, 255, 255, [73,150,1]],
      [253, 255, 255, [73,636,1]],
      [255, 255, 255, [73,797,1]],
      [253, 255, 255, [74,138,2,75,136,3]],
      [253, 255, 255, [74,154,1]],
      [253, 255, 255, [74,1013,1,75,1013,1]],
      [253, 255, 255, [74,796,1]],
      [253, 255, 255, [74,155,1]],
      [253, 255, 255, [75,935,1]],
      [254, 255, 255, [76,80,1]],
      [255, 255, 255, [76,81,1]],
      [253, 255, 253, [76,1016,2]],
      [253, 255, 255, [76,935,1]],
      [253, 255, 255, [77,794,1]],
      [253, 255, 255, [78,422,1]],
      [253, 253, 250, [79,422,1,80,421,2,81,420,2,82,420,2]],
      [252, 255, 255, [81,211,1]],
      [252, 255, 255, [82,212,1]],
      [253, 255, 255, [82,935,1,83,935,2,84,935,2,85,935,2,86,935,1,87,935,1,88,934,2,89,934,2,90,934,2,91,934,2,92,934,1]],
      [252, 255, 255, [83,212,1]],
      [255, 255, 251, [82,121,1]],
      [253, 255, 255, [83,673,1]],
      [253, 255, 254, [83,664,3,84,663,2,85,663,1]],
      [253, 255, 255, [83,674,2]],
      [255, 254, 255, [83,1015,2,84,1013,4,85,1013,4]],
      [253, 255, 255, [85,211,1]],
      [253, 255, 255, [85,659,1]],
      [255, 255, 255, [85,679,1,86,679,2]],
      [253, 255, 255, [86,659,1]],
      [255, 255, 255, [86,115,1]],
      [255, 252, 250, [86,1013,2,87,1013,4,88,1014,3]],
      [253, 254, 253, [87,123,1,88,122,2,89,122,2,90,122,2,91,122,2,92,122,1,93,121,2,94,121,2,95,121,2,96,121,2,97,121,2,98,121,2,99,121,2,100,121,2,101,121,2,102,121,2,103,121,2,104,121,2,105,121,2,106,122,1,107,122,2,108,122,2,109,122,2,110,122,2,111,122,2,112,122,1]],
      [253, 255, 255, [87,211,1,88,211,1]],
      [255, 255, 255, [87,9,1]],
      [252, 255, 254, [87,116,2]],
      [253, 255, 255, [89,199,3]],
      [250, 248, 247, [89,709,1]],
      [254, 254, 253, [90,529,1,91,528,3,92,528,3,93,528,2]],
      [253, 255, 255, [90,189,1]],
      [255, 255, 253, [91,188,1]],
      [255, 254, 250, [92,1017,2]],
      [253, 255, 255, [93,934,1]],
      [254, 254, 251, [94,374,5,95,373,5,96,373,3]],
      [254, 255, 255, [94,775,4,95,774,5,96,774,2,97,774,2,98,774,2,99,774,2,100,774,2,101,774,2,102,774,2,103,774,2,104,774,2,105,774,2,106,774,2,107,774,2,108,774,2,109,768,2,109,775,2,110,768,3,110,774,2,111,768,8,112,770,4]],
      [253, 255, 255, [94,934,1]],
      [253, 255, 255, [96,934,1]],
      [254, 254, 254, [96,744,1,97,744,2]],
      [255, 252, 249, [97,413,1]],
      [250, 251, 248, [98,68,1]],
      [255, 254, 254, [98,743,1,99,743,1]],
      [255, 253, 250, [99,413,1]],
      [253, 255, 255, [99,1017,1]],
      [255, 250, 240, [99,414,1,100,413,1]],
      [254, 255, 252, [99,375,2,100,374,5,101,373,2,101,377,2]],
      [255, 254, 250, [100,742,2]],
      [254, 254, 254, [101,1010,1]],
      [255, 253, 251, [102,1015,2,103,1015,2]],
      [245, 235, 221, [102,414,2,103,413,3]],
      [253, 255, 255, [103,778,1]],
      [255, 255, 255, [103,993,5,104,994,2]],
      [255, 255, 254, [104,316,2,105,307,11,106,304,13,107,304,4]],
      [253, 255, 255, [104,944,1,105,945,2]],
      [255, 251, 247, [105,416,1,106,415,2]],
      [255, 255, 255, [106,374,1]],
      [254, 255, 254, [106,778,1,107,778,1,108,778,1,109,778,1,110,778,1,111,778,1,112,777,2,113,777,2,114,777,2,115,777,2,116,777,2,117,777,1]],
      [253, 255, 254, [106,1010,1,107,1010,2]],
      [255, 255, 255, [107,374,1]],
      [255, 250, 247, [106,417,1,107,417,1]],
      [255, 255, 255, [108,988,2,109,988,2,110,988,2,111,988,2,112,988,2,113,988,2,114,989,1]],
      [255, 255, 255, [109,373,1]],
      [255, 255, 254, [110,999,1,111,998,2,112,998,2,113,998,2,114,998,2,115,998,2,116,998,2,117,998,2,118,998,2,119,998,2,120,998,2,121,997,3,122,997,2,123,997,2,124,997,2,125,997,2,126,998,1]],
      [255, 255, 255, [114,582,2,115,582,1]],
      [255, 255, 253, [114,584,3]],
      [255, 255, 255, [114,580,2,115,580,2]],
      [244, 242, 240, [114,1015,2,115,1014,3,116,1014,3,117,1014,3,118,1014,1]],
      [253, 255, 255, [115,688,1]],
      [255, 255, 255, [115,588,2]],
      [245, 246, 243, [116,414,2,117,414,2]],
      [255, 255, 253, [116,590,2]],
      [255, 255, 255, [116,593,1]],
      [255, 255, 255, [116,592,1]],
      [255, 255, 255, [116,596,2]],
      [255, 255, 255, [117,373,1,118,373,1,119,373,1]],
      [253, 255, 253, [118,777,1]],
      [253, 255, 255, [118,304,1,119,304,1,120,304,1]],
      [248, 244, 229, [118,1015,2,119,1015,3,120,1015,2,121,1015,2]],
      [253, 255, 255, [119,787,1]],
      [252, 255, 250, [120,787,1]],
      [255, 255, 255, [120,374,1,121,374,1]],
      [253, 255, 254, [122,777,1,123,777,1,124,777,1,125,777,1,126,777,1,127,777,1,128,777,1,129,777,1,130,777,1,131,777,1,132,777,1,133,776,2,134,776,2,135,776,1,136,776,1,137,776,2,138,776,2,139,776,2,140,776,2,141,776,2,142,776,2,143,776,2,144,776,1]],
      [253, 255, 255, [123,60,1]],
      [255, 254, 252, [123,991,1,124,991,1,125,990,2,126,990,2,127,990,2,128,990,2,129,990,3,130,990,6,131,990,3,132,990,2]],
      [253, 255, 255, [124,60,1]],
      [255, 255, 255, [124,294,1]],
      [255, 255, 253, [124,1018,1]],
      [253, 255, 255, [125,850,1]],
      [255, 255, 255, [125,155,1]],
      [255, 255, 255, [125,294,1,126,294,1,127,294,1,128,294,1,129,294,2,130,294,2,131,294,2,132,295,1,133,295,1]],
      [252, 255, 253, [125,424,2]],
      [254, 255, 255, [129,59,1]],
      [255, 255, 255, [130,59,1]],
      [254, 250, 242, [130,863,1]],
      [254, 255, 251, [130,1009,3,131,1008,5,131,1014,3,132,1007,10,133,1007,3,133,1012,6,134,1007,7,134,1015,4,135,1008,6,135,1017,2]],
      [253, 255, 255, [130,509,1]],
      [253, 255, 255, [130,563,1,131,563,1]],
      [255, 255, 255, [131,59,1]],
      [255, 252, 251, [131,863,1,132,864,1,133,864,1,134,864,2]],
      [255, 255, 255, [131,374,1]],
      [255, 255, 255, [131,373,1,132,373,1,133,373,1,134,373,1,135,373,1,136,373,1,137,373,1,138,373,1,139,373,1,140,373,1,141,373,1,142,373,2,143,373,2,144,373,2,145,373,2,146,373,2,147,374,2,148,374,2,149,374,2,150,374,2,151,374,2,152,374,2,153,374,2,154,374,2,155,374,2,156,374,2]],
      [253, 255, 255, [131,788,1]],
      [255, 255, 255, [132,431,1]],
      [253, 255, 255, [132,789,1]],
      [252, 255, 255, [132,509,1]],
      [253, 255, 255, [132,563,1]],
      [251, 253, 253, [132,425,2]],
      [253, 255, 255, [132,432,1,133,432,1,134,431,2,135,431,1,136,431,2,137,431,2,138,431,1,139,431,1,140,430,2,141,430,1,142,430,1,143,430,1]],
      [253, 255, 255, [133,563,1]],
      [253, 255, 255, [134,60,1]],
      [255, 255, 255, [134,295,1,135,295,1]],
      [253, 255, 255, [134,563,1]],
      [255, 255, 255, [135,563,1]],
      [255, 247, 236, [135,865,1]],
      [251, 248, 247, [135,27,3,136,21,9,137,21,4,138,20,2,139,21,1,140,21,2,141,20,3,142,19,3,143,18,3,144,18,2,145,17,3,146,17,3,147,17,2,148,16,2,149,12,6,150,9,7,151,9,4,152,8,3,153,7,3,154,7,2]],
      [253, 255, 255, [136,562,2,137,562,2]],
      [252, 252, 251, [136,1016,2,137,1017,2]],
      [255, 254, 247, [136,865,1]],
      [255, 255, 255, [136,295,1,137,295,1]],
      [249, 243, 240, [137,865,1]],
      [250, 251, 237, [137,62,1,138,62,1]],
      [255, 255, 255, [138,563,1]],
      [255, 255, 255, [139,209,1]],
      [255, 255, 253, [139,295,1]],
      [254, 255, 255, [139,563,2,140,563,1,141,563,1]],
      [253, 255, 255, [139,689,1]],
      [255, 252, 237, [140,61,2]],
      [255, 255, 255, [140,209,1]],
      [240, 221, 212, [141,867,1]],
      [253, 255, 255, [142,563,1]],
      [253, 255, 253, [142,695,2]],
      [254, 255, 254, [142,1013,4,143,1013,4,144,1014,3,145,1014,3]],
      [253, 255, 255, [143,563,1]],
      [253, 255, 255, [143,493,1]],
      [253, 255, 255, [144,562,2,145,562,2,146,562,2,147,562,2]],
      [253, 255, 255, [144,492,1,145,492,1]],
      [254, 255, 254, [145,423,1,146,423,2,147,423,2,148,423,2,149,423,2,150,423,2,151,423,2,152,423,2,153,423,2,154,423,2,155,423,3,156,423,3,157,423,3,158,423,3,159,423,3,160,423,3,161,423,3,162,423,3,163,423,3,164,423,2,165,423,2,166,423,1]],
      [254, 255, 254, [145,776,1,146,776,1,147,775,2,148,775,1,149,775,1]],
      [254, 253, 226, [147,64,1]],
      [241, 224, 214, [147,870,1]],
      [253, 255, 253, [147,1017,2]],
      [253, 255, 255, [147,247,1,148,247,2,149,248,2,150,248,2,151,248,2,152,248,2,153,248,2,154,248,2,155,248,1]],
      [253, 255, 255, [147,430,1,148,430,2,149,430,2,150,430,1,151,430,2,152,430,2,153,430,2]],
      [253, 255, 253, [148,562,1,149,562,1]],
      [245, 237, 231, [149,870,1]],
      [252, 254, 252, [149,1017,2]],
      [253, 255, 254, [150,775,1]],
      [253, 255, 253, [150,562,1]],
      [254, 255, 254, [150,607,1,151,607,2,152,607,2,153,607,2,154,607,2,155,607,1,156,607,1]],
      [252, 255, 254, [151,562,1,152,562,1,153,562,2,154,562,2,155,562,2,156,563,2,157,563,2,158,563,2,159,563,1,160,563,1,161,563,1]],
      [252, 248, 227, [151,62,2]],
      [252, 255, 254, [151,492,1]],
      [253, 254, 253, [152,775,2,153,775,2,154,775,2,155,775,3,156,775,3,157,775,2,158,775,2,159,775,3,160,776,2,161,776,3,162,777,2]],
      [253, 255, 255, [152,736,1,153,735,2,154,735,1]],
      [255, 255, 255, [152,303,1,153,303,1]],
      [254, 248, 244, [152,871,1]],
      [255, 255, 251, [153,1014,3,154,1014,3]],
      [252, 255, 248, [153,51,1]],
      [252, 255, 248, [154,50,1]],
      [253, 255, 255, [154,430,1,155,430,2,156,430,2,157,430,1]],
      [255, 255, 252, [154,304,1,155,304,1]],
      [255, 255, 255, [155,735,1,156,734,2,157,735,1,158,735,1,159,735,1,160,734,2,161,734,2,162,734,1]],
      [253, 255, 255, [155,872,1]],
      [252, 252, 238, [156,52,2]],
      [255, 255, 255, [156,304,1,157,304,1,158,304,1,159,304,1]],
      [255, 255, 254, [159,1013,1,160,1013,1]],
      [255, 255, 250, [159,1015,2,160,1014,3,161,1014,3,162,1014,2]],
      [254, 255, 254, [159,651,1,160,651,1,161,651,1,162,651,1,163,651,1,164,650,2,165,650,2,166,650,2,167,650,2,168,650,2,169,650,1,170,649,2,171,649,2,172,649,2,173,649,2,174,649,2,175,649,1,176,649,1,177,649,1,178,649,1,179,649,1,180,649,1,181,649,1,182,649,1,183,649,1,184,649,1,185,649,1]],
      [253, 255, 255, [160,430,1,161,430,2,162,430,1,163,430,1,164,430,1]],
      [255, 255, 253, [160,1008,2]],
      [252, 255, 255, [161,379,1,162,379,1,163,379,1]],
      [253, 255, 255, [162,541,1,163,541,1]],
      [255, 255, 255, [162,299,1]],
      [253, 254, 251, [163,1016,3,164,1016,3]],
      [255, 255, 255, [164,708,1]],
      [255, 255, 255, [164,305,1]],
      [255, 255, 255, [165,306,1]],
      [255, 255, 253, [165,1007,1]],
      [251, 253, 253, [165,379,1]],
      [253, 255, 255, [165,541,1]],
      [255, 255, 255, [166,306,1]],
      [255, 255, 255, [167,306,1]],
      [255, 255, 255, [167,307,1]],
      [255, 255, 253, [167,1007,1]],
      [253, 255, 254, [168,1007,1,169,1007,1,170,1007,1,171,1007,1]],
      [252, 255, 255, [169,74,1]],
      [255, 255, 255, [169,1016,1]],
      [253, 255, 255, [169,75,1]],
      [253, 255, 255, [171,377,2]],
      [253, 255, 255, [173,541,1]],
      [255, 255, 255, [173,656,1]],
      [255, 255, 255, [173,709,1]],
      [255, 255, 255, [174,656,1]],
      [254, 254, 252, [174,1016,3,175,1016,3]],
      [255, 254, 251, [174,541,1,175,541,1,176,541,1]],
      [254, 255, 253, [176,543,3,177,543,4]],
      [255, 255, 255, [176,709,1]],
      [255, 253, 252, [177,878,1,178,878,1]],
      [255, 255, 255, [178,709,1]],
      [248, 255, 255, [178,71,1,179,71,1]],
      [254, 254, 251, [179,1015,2,180,1014,3,181,1014,3]],
      [248, 255, 255, [180,71,1]],
      [255, 255, 255, [181,299,1,182,299,1]],
      [240, 246, 244, [181,70,1,182,70,1]],
      [255, 255, 255, [183,299,1]],
      [255, 254, 254, [184,507,2,185,507,2]],
      [253, 255, 255, [184,655,1]],
      [253, 255, 253, [185,655,1]],
      [249, 255, 255, [186,71,1]],
      [254, 255, 255, [186,656,1,187,656,1]],
      [254, 254, 251, [187,1008,1,188,1008,1,189,1008,1,190,1007,3,191,1007,3,192,1007,2,193,1007,2,194,1007,5,195,1008,4,196,1011,2]],
      [236, 237, 236, [188,506,1]],
      [255, 255, 255, [188,656,1,189,656,1,190,656,1,191,656,1]],
      [255, 255, 253, [188,1013,1,189,1013,1,190,1013,3]],
      [255, 255, 247, [188,867,1]],
      [254, 255, 255, [189,509,1,190,509,1,191,509,1,192,509,1,193,509,1,194,509,1,195,509,1]],
      [251, 246, 228, [189,70,2,190,70,2]],
      [253, 255, 255, [189,919,1,190,920,1]],
      [255, 255, 254, [190,868,2,191,868,2,192,868,2,193,868,2,194,868,2,195,868,2,196,868,2,197,869,1]],
      [245, 241, 220, [191,69,3]],
      [255, 255, 253, [192,127,1]],
      [254, 255, 254, [192,393,5,193,392,4,194,392,2,195,392,2,196,392,2,197,392,2,198,393,2,199,393,2,200,393,2,201,393,2,202,393,2]],
      [255, 255, 255, [192,710,1]],
      [255, 255, 254, [192,398,4]],
      [255, 255, 253, [192,402,2,193,402,2]],
      [253, 254, 250, [192,404,3,193,404,2]],
      [255, 254, 252, [192,407,1,193,406,4,194,408,2]],
      [255, 255, 255, [193,127,2,194,127,2,195,128,2,196,128,2,197,128,2,198,128,2,199,128,2,200,128,2,201,128,2,202,128,2,203,128,2,204,128,2,205,128,2,206,128,2,207,128,2,208,128,1]],
      [255, 255, 255, [196,299,1]],
      [252, 255, 254, [197,915,1,198,914,2,199,914,2,200,914,1]],
      [253, 255, 255, [198,657,1]],
      [253, 255, 255, [199,656,1]],
      [253, 255, 255, [199,723,1]],
      [255, 255, 253, [199,732,1,200,732,1,201,732,1]],
      [253, 255, 254, [200,1014,1,201,1014,3,202,1014,3,203,1015,2]],
      [255, 255, 253, [201,731,1]],
      [255, 255, 255, [201,299,1,202,299,1,203,299,1]],
      [255, 255, 253, [202,730,1]],
      [252, 251, 250, [204,1016,3,205,1013,6,206,1013,5,207,1013,1,207,1016,1]],
      [253, 255, 252, [206,147,2,207,147,1]],
      [255, 255, 255, [209,128,2,210,128,2,211,128,2,212,128,2,213,128,2,214,128,2,215,128,1,216,128,1,217,128,1]],
      [255, 255, 255, [209,1013,1]],
      [255, 255, 255, [210,731,3,211,732,3,212,734,1]],
      [254, 255, 255, [213,735,1,214,735,1]],
      [249, 243, 238, [214,31,1]],
      [249, 243, 238, [214,30,1]],
      [254, 255, 254, [215,299,2,216,299,2,217,299,2,218,299,2,219,299,2,220,299,2,221,299,2,222,299,2,223,299,2,224,299,2,225,299,2,226,299,2,227,299,2,228,299,2,229,299,2,230,299,2,231,299,2,232,299,2,233,299,2,234,299,2,235,299,2,236,299,2]],
      [254, 254, 251, [216,289,6,217,292,4,218,294,2,219,293,3,220,293,2,221,293,2,222,293,2,223,293,2,224,293,3,225,294,2,226,294,2,227,294,2,228,294,3,229,295,3,230,296,2,231,297,1,232,297,2,233,297,2,234,297,2]],
      [254, 254, 252, [216,276,10,217,277,3]],
      [251, 255, 255, [216,286,1]],
      [254, 255, 255, [216,736,1,217,736,2,218,736,2,219,736,2,220,736,2,221,736,2,222,737,1,223,737,1,224,737,1,225,737,1,226,736,2,227,736,2,228,736,2,229,736,2,230,737,1,231,737,1,232,737,1,233,737,1]],
      [254, 253, 254, [217,1011,1]],
      [253, 255, 255, [217,1017,2]],
      [219, 218, 216, [217,59,2]],
      [255, 255, 255, [217,729,1]],
      [253, 255, 255, [217,649,1,218,649,1,219,649,1]],
      [231, 231, 232, [218,59,3,219,60,2,220,60,2,221,60,2]],
      [255, 255, 255, [218,729,1]],
      [253, 255, 254, [221,70,2,222,70,2,223,70,2,224,70,2,225,70,3,226,70,2,227,70,2]],
      [176, 173, 177, [222,61,2,223,61,1]],
      [253, 255, 255, [222,650,1,223,650,1]],
      [238, 236, 244, [223,23,1]],
      [254, 255, 255, [224,650,1,225,650,1]],
      [254, 255, 255, [227,650,1,228,650,1]],
      [242, 230, 223, [227,915,1]],
      [254, 255, 253, [231,1014,3,232,1014,3,233,1015,2]],
      [146, 144, 142, [233,966,2]],
      [234, 235, 236, [234,1012,2]],
      [161, 156, 154, [235,966,2]],
      [254, 254, 254, [235,1013,1]],
      [253, 255, 254, [235,1016,2,236,1016,3,237,1016,4]],
      [223, 222, 220, [236,1013,1]],
      [251, 255, 255, [239,934,1,240,933,2,241,932,2,242,932,2]],
      [254, 255, 254, [239,988,1,240,984,2,240,987,2,241,984,5,242,983,5,243,983,2,244,982,3,245,982,3,246,982,2,247,982,2,248,982,2,249,982,1]],
      [252, 255, 253, [240,1013,2,241,1013,2,242,1013,2,243,1013,2,244,1013,2,245,1013,2,246,1013,2,247,1013,2]],
      [185, 176, 176, [241,1010,3,242,1009,4]],
      [253, 255, 254, [244,988,2,245,988,2,246,988,2,247,989,2,248,984,7,249,983,8]],
      [253, 255, 253, [245,916,1]],
      [255, 255, 254, [247,536,4,248,534,7,249,534,3,249,539,2,250,540,1]],
      [253, 255, 255, [247,1009,1]],
      [252, 255, 254, [247,944,1,248,944,1,249,944,1]],
      [253, 255, 255, [248,430,1]],
      [253, 255, 255, [248,821,1,249,821,1]],
      [253, 255, 253, [248,1009,1]],
      [255, 255, 254, [249,429,1,250,429,1,251,429,1]],
      [255, 255, 253, [249,1009,1,250,1009,1]],
      [253, 255, 255, [251,821,1]],
      [253, 255, 255, [251,430,1,252,430,1]],
      [253, 255, 255, [252,821,1]],
      [254, 255, 253, [253,944,2,254,944,2,255,944,1,256,943,2,257,943,2,258,942,3,259,942,2,260,942,2,261,942,2]],
      [255, 255, 253, [253,1016,2,254,1016,2]],
      [253, 255, 255, [253,821,1]],
      [253, 255, 255, [254,821,1,255,821,1]],
      [255, 255, 254, [255,129,2,256,129,2,257,129,2,258,129,2,259,129,2]],
      [255, 255, 255, [256,474,1]],
      [253, 255, 255, [257,471,2]],
      [253, 255, 255, [257,1014,2,258,1014,2,259,1014,2,260,1014,2]],
      [253, 255, 255, [258,822,1]],
      [255, 255, 255, [260,526,1]],
      [255, 255, 255, [261,525,1]],
      [255, 255, 255, [262,525,1]],
      [251, 253, 252, [262,953,2,263,953,2,264,953,2]],
      [254, 252, 249, [266,517,2,267,515,5,268,515,6,269,519,2]],
      [255, 255, 255, [269,305,1]],
      [254, 255, 254, [269,1010,3,270,1010,1]],
      [255, 250, 243, [269,1013,1,270,1013,1,270,1015,2,271,1014,4,272,1016,1]],
      [251, 252, 252, [270,1017,3,271,1018,2]],
      [255, 255, 253, [270,305,1]],
      [255, 255, 254, [272,632,4,273,633,4,274,634,3,275,636,2]],
      [255, 255, 255, [273,848,1]],
      [253, 255, 254, [273,24,2,274,24,1]],
      [254, 253, 247, [274,1014,3,275,1015,2,276,1014,3]],
      [255, 255, 255, [274,1009,1]],
      [253, 255, 250, [275,15,2,276,15,2,277,15,1]],
      [255, 255, 252, [276,1009,2,277,1009,2]],
      [253, 255, 255, [279,56,1]],
      [254, 254, 252, [280,1017,1]],
      [255, 255, 255, [281,1017,1]],
      [252, 253, 250, [281,1018,1]],
      [254, 255, 255, [281,56,1,282,56,1]],
      [253, 255, 253, [282,1014,1,283,1014,1]],
      [255, 255, 253, [282,1015,2,283,1015,2,284,1015,2]],
      [252, 255, 253, [286,1010,1]],
      [255, 255, 255, [287,1010,1]],
      [254, 255, 255, [291,1010,1,292,1011,1]],
      [253, 255, 255, [294,432,1,295,432,1]],
      [253, 255, 255, [296,432,1]],
      [255, 254, 249, [296,1015,4,297,1016,3]],
      [253, 255, 255, [298,1014,1]],
      [254, 255, 252, [298,1015,5,299,1014,6,300,1014,2]],
      [254, 255, 252, [300,429,2,301,429,2,302,429,2,303,429,2,304,429,2,305,429,2,306,429,4,307,429,4]],
      [255, 255, 255, [300,848,1]],
      [255, 255, 255, [301,849,1,302,849,1,303,849,1]],
      [255, 243, 232, [304,331,1]],
      [255, 255, 255, [304,849,1,305,849,1,306,849,1,307,849,1]],
      [253, 255, 255, [305,822,1,306,822,2,307,822,2,308,822,1]],
      [252, 255, 252, [306,1014,1,307,1014,1]],
      [237, 237, 237, [307,1015,2]],
      [254, 255, 253, [308,1011,2,309,1011,1]],
      [255, 254, 249, [310,1011,1,311,1011,2,312,1011,4,313,1011,3,314,1011,2]],
      [255, 255, 253, [311,1018,2,312,1016,3,313,1016,3,314,1017,2]],
      [255, 255, 255, [313,849,1]],
      [254, 254, 252, [314,319,1,315,319,1]],
      [252, 255, 255, [315,56,1]],
      [253, 255, 255, [316,56,1]],
      [253, 255, 253, [317,304,1]],
      [253, 255, 255, [317,56,1]],
      [253, 255, 255, [318,57,1]],
      [253, 255, 255, [319,57,1]],
      [251, 255, 251, [320,316,2]],
      [252, 255, 252, [321,315,1]],
      [253, 254, 254, [321,314,1]],
      [253, 255, 255, [322,58,1]],
      [254, 253, 250, [327,1014,6,328,1014,6]],
      [253, 255, 255, [329,1014,1]],
      [253, 255, 254, [332,822,1,333,822,2,334,823,1]],
      [253, 255, 255, [333,1017,1]],
      [253, 255, 255, [334,1018,1]],
      [254, 255, 255, [334,1010,1,335,1009,2]],
      [254, 255, 254, [335,969,2,336,967,4,337,965,5,338,964,4]],
      [253, 255, 255, [336,823,1,337,823,1,338,823,1,339,823,1,340,823,1,341,823,1]],
      [255, 255, 255, [336,849,1,337,849,1]],
      [255, 255, 248, [336,1015,2,337,1015,3,338,1015,2]],
      [252, 255, 255, [337,55,1]],
      [255, 255, 255, [337,973,1,338,972,2,339,972,2,340,972,2,341,972,2,342,972,2]],
      [253, 255, 253, [338,54,2]],
      [248, 248, 248, [338,1017,1,339,1016,4]],
      [253, 255, 255, [342,823,1]],
      [254, 254, 252, [342,1010,1,343,1009,2,344,1009,3,345,1009,3,346,1009,2,347,1009,2,348,1009,2]],
      [254, 255, 254, [343,1006,1,344,1006,1,345,1006,1,346,1006,2,347,1006,2,348,1006,2,349,1006,2,350,1006,2,351,1006,2,352,1006,2,353,1006,2,354,1006,2,355,1006,2,356,1006,2,357,1006,2,358,1006,2,359,1006,2,360,1006,2,361,1006,2,362,1005,3,363,1005,3,364,1005,3,365,1006,2,366,1006,2,367,1006,3,367,1013,2,368,1006,9,369,1008,7,370,1008,2]],
      [255, 255, 255, [347,848,1]],
      [254, 255, 255, [347,972,2,348,971,3,349,970,3,350,970,2]],
      [253, 255, 255, [348,823,1,349,823,2]],
      [254, 255, 253, [350,848,1,351,847,2,352,847,1,353,847,1]],
      [253, 255, 255, [350,824,1]],
      [253, 255, 255, [351,824,1]],
      [253, 255, 255, [352,1019,1]],
      [255, 254, 255, [353,1016,2,354,1016,3,355,1017,1]],
      [255, 255, 253, [354,1014,1,355,1013,2,356,1013,2]],
      [255, 254, 251, [360,1016,1,361,1015,2,362,1015,2]],
      [253, 253, 254, [366,1015,1]],
      [252, 251, 252, [366,1017,2,367,1017,3,368,1017,3]],
      [254, 255, 253, [370,1015,2,371,1015,1]],
      [254, 255, 254, [374,1016,2,375,1016,3]],
      [254, 254, 252, [378,1010,4,379,1010,5,380,1010,2,381,1010,2,382,1010,2,383,1010,2,384,1011,4,385,1011,4,386,1013,2]],
      [255, 255, 254, [381,1015,2,382,1015,2,383,1015,2]],
      [246, 242, 243, [391,1014,2,392,1014,2,393,1014,1]],
      [251, 255, 252, [391,1016,1,392,1016,1]],
      [252, 255, 254, [393,1016,1]],
      [252, 255, 253, [400,515,1]],
      [254, 254, 253, [400,1018,1,401,1017,3]],
      [255, 252, 251, [405,1016,3,406,1015,5,407,1017,1]],
      [254, 255, 255, [405,516,1,406,516,1,407,516,1,408,516,1,409,516,1,410,516,1,411,516,1,412,516,1,413,516,1,414,516,1]],
      [253, 252, 250, [406,1012,1,407,1012,1,408,1011,2,409,1010,3,410,1010,3,411,1010,3,412,1010,3,413,1010,3,414,1011,4,415,1011,4,416,1012,3]],
      [249, 247, 245, [408,1015,4,409,1013,4,410,1013,3,411,1013,2,412,1013,2]],
      [241, 240, 240, [413,1014,3,414,1015,2]],
      [255, 250, 242, [421,560,2,422,560,1]],
      [253, 255, 255, [422,1019,1]],
      [251, 254, 252, [423,1016,3,424,1016,2]],
      [255, 255, 255, [426,1012,1]],
      [253, 254, 254, [426,1013,2,427,1013,2,428,1013,2,429,1013,2,430,1013,2,431,1013,2,432,1013,2,433,1013,2,434,1013,2,435,1013,2,436,1013,2,437,1013,2,438,1013,2,439,1013,2,440,1010,5,441,1012,5,442,1014,3]],
      [235, 241, 244, [427,1011,1,428,1010,2,429,1010,2]],
      [247, 245, 244, [427,20,1]],
      [242, 244, 245, [432,1010,2]],
      [255, 255, 249, [433,22,1]],
      [254, 254, 251, [436,868,1,437,867,2,438,867,2,439,867,3,440,867,3,441,867,3,442,868,2,443,868,2,444,869,1,445,869,1,446,869,1,447,869,1]],
      [253, 255, 253, [437,875,1]],
      [252, 255, 254, [437,883,2,438,883,2,439,884,2,440,885,1]],
      [253, 254, 253, [437,1016,4,438,1016,3,439,1016,2]],
      [253, 255, 255, [437,879,1,438,876,4,439,877,2]],
      [255, 255, 253, [437,946,2,438,942,7,439,942,5]],
      [253, 253, 252, [438,949,7,439,949,7]],
      [253, 255, 255, [439,960,1]],
      [255, 253, 246, [439,302,3,440,302,4,441,303,3]],
      [254, 255, 252, [441,885,2,442,884,3,443,884,2,444,884,2,445,884,2,446,885,1,447,885,1]],
      [255, 255, 255, [441,27,1]],
      [255, 255, 247, [443,1017,2,444,1016,3]],
      [253, 255, 255, [444,29,1,445,29,1,446,29,1]],
      [253, 255, 255, [445,942,1]],
      [253, 255, 255, [445,941,1]],
      [255, 255, 253, [446,1004,1]],
      [255, 255, 255, [446,958,2]],
      [253, 255, 254, [446,1014,2,447,1014,2,448,1014,2,449,1014,2]],
      [255, 255, 255, [448,869,1]],
      [255, 255, 255, [449,1004,1]],
      [254, 254, 251, [451,1014,3,452,1014,3,453,1014,3]],
      [254, 255, 252, [451,303,3,452,302,4,453,302,1]],
      [253, 255, 251, [454,1016,2,455,1016,3,456,1016,4]],
      [255, 255, 255, [454,867,1,455,867,1,456,866,2,457,866,1,458,866,1]],
      [255, 255, 255, [454,1004,1,455,1004,1]],
      [253, 255, 255, [457,903,5]],
      [254, 255, 254, [457,902,1,458,902,2,459,902,2,460,902,2,461,901,3,462,901,2,463,901,2,464,901,1]],
      [253, 255, 255, [458,886,2,459,885,2,460,884,3,461,884,2,462,870,5,462,879,8,463,870,17,464,875,4,464,883,4]],
      [254, 255, 251, [458,906,3,459,905,3,460,905,3,461,905,2,462,905,3,463,906,2,464,906,2,465,906,1]],
      [255, 254, 255, [458,1014,2,459,1014,3,460,1014,3,461,1014,3,462,1014,4,463,1016,2,464,1016,2]],
      [242, 239, 238, [461,1004,1,462,1004,1,463,1004,1,464,1004,1]],
      [255, 254, 255, [461,1019,1,462,1018,2]],
      [255, 255, 255, [465,1004,1]],
      [255, 255, 253, [466,1016,2,467,1017,1]],
      [254, 252, 252, [467,1018,1,468,1017,1]],
      [255, 255, 250, [478,996,1]],
      [253, 255, 255, [479,991,1]],
      [255, 254, 254, [479,1004,1]],
      [255, 254, 255, [480,1004,1]],
      [255, 255, 247, [480,1015,2,481,1015,2,482,1015,2,483,1015,2]],
      [250, 250, 243, [485,1015,2,486,1015,2,487,1015,2,488,1016,1]],
      [253, 255, 255, [488,991,2,489,991,2]],
      [253, 255, 255, [488,1004,1]],
      [253, 255, 255, [490,1004,1]],
      [254, 253, 251, [490,996,1,491,996,2,492,995,3,493,995,3,494,996,1,495,996,2,496,996,2,497,996,2,498,997,1]],
      [253, 255, 255, [494,1004,1]],
      [255, 255, 253, [495,1017,3,496,1017,3]],
      [254, 255, 254, [496,1014,2,497,1014,2,498,1014,3,499,1015,2]],
      [200, 197, 198, [503,1009,1,504,1009,1]],
      [250, 231, 221, [504,151,1]],
      [254, 254, 254, [504,1016,3,505,1016,3]],
      [254, 255, 254, [505,1013,2,506,1013,2,507,1012,3,508,1011,4,509,1012,3,510,1013,1]],
      [251, 251, 249, [506,1018,1,507,1017,2]],
      [255, 255, 255, [509,986,1,510,986,1,511,986,1,512,986,1,513,986,2,514,986,2,515,986,1,516,985,2,517,984,2,518,984,2]],
      [251, 242, 233, [510,145,2,511,145,2]],
      [248, 231, 225, [520,918,1]],
      [254, 255, 252, [521,918,1,522,918,1,523,918,1,524,918,2,525,919,1]],
      [254, 255, 254, [521,1013,2,522,1013,2,523,1013,2,524,1013,2,525,1013,2,526,1012,3,527,1011,4]],
      [214, 211, 217, [522,1011,2,523,1010,3,524,1011,2]],
      [253, 255, 255, [524,997,1,525,997,1,526,997,1,527,997,1,528,996,2,529,996,1]],
      [254, 253, 254, [524,1017,2,525,1017,2,526,1017,2]],
      [252, 255, 254, [525,1006,1]],
      [232, 221, 215, [527,1006,1,528,1006,1]],
      [254, 254, 253, [530,996,1,531,995,2,532,995,2,533,995,2,534,995,2,535,995,2,536,995,2,537,995,2,538,993,4,539,992,5,540,992,2,541,992,2]],
      [254, 254, 254, [534,1016,3,535,1016,4,536,1016,3]],
      [247, 250, 248, [539,1006,3,540,1006,3]],
      [250, 253, 250, [541,1011,1,542,1011,1]],
      [255, 254, 255, [541,996,1,542,996,1]],
      [252, 255, 253, [541,998,1]],
      [253, 255, 255, [543,1016,3,544,1016,4,545,1018,2]],
      [249, 249, 249, [548,1015,2,549,1016,1]],
      [253, 255, 255, [548,532,1]],
      [253, 255, 255, [550,1004,1]],
      [255, 255, 255, [551,1004,1]],
      [255, 255, 255, [551,1005,1]],
      [218, 216, 217, [552,569,1]],
      [255, 255, 255, [553,1005,1]],
      [218, 218, 218, [553,569,1]],
      [196, 198, 200, [554,570,1]],
      [253, 255, 255, [554,1017,1]],
      [255, 255, 249, [557,1015,2,558,1015,2,559,1015,2]],
      [255, 255, 250, [560,1015,2,561,1014,3]],
      [254, 253, 255, [561,931,2]],
      [255, 254, 247, [561,1017,3,562,1018,2]],
      [253, 254, 254, [561,887,3,562,886,7,563,885,4]],
      [253, 254, 253, [562,901,8,563,901,8,564,902,1]],
      [253, 255, 255, [563,936,1]],
      [248, 246, 245, [563,576,1]],
      [255, 254, 252, [564,927,1]],
      [252, 254, 253, [564,1017,3,565,1017,3]],
      [252, 251, 252, [565,927,1,566,927,1]],
      [253, 255, 255, [566,936,1,567,936,1]],
      [254, 255, 252, [567,902,1,568,901,2,569,901,2,570,901,2,571,901,2,572,901,2,573,901,2,574,901,2,575,900,3,576,900,1]],
      [254, 250, 233, [567,922,1]],
      [255, 255, 255, [568,997,1]],
      [254, 254, 252, [568,1017,1,569,1016,3,570,1016,2,571,1016,2,572,1017,1]],
      [253, 255, 255, [571,936,1,572,936,2,573,937,1,574,937,1,575,936,2,576,936,1]],
      [255, 255, 255, [572,997,1,573,997,1]],
      [255, 255, 253, [572,560,1]],
      [255, 255, 254, [574,1013,2,575,1013,2,576,1013,3,577,1014,5,578,1014,4]],
      [249, 255, 254, [575,928,1]],
      [253, 255, 255, [577,1011,1]],
      [253, 255, 254, [577,1010,1,578,1010,1,579,1009,2,580,1009,1]],
      [253, 255, 253, [578,560,1]],
      [254, 255, 253, [579,1017,2]],
      [255, 255, 253, [580,1018,1]],
      [248, 251, 251, [580,1014,2,581,1009,7,582,1009,6]],
      [252, 255, 252, [581,915,1,582,915,2,583,915,2]],
      [239, 238, 234, [583,1014,6,584,1014,6,585,1014,3,586,1016,1]],
      [255, 255, 249, [584,915,2]],
      [252, 255, 255, [585,560,1,586,560,1]],
      [253, 255, 254, [585,915,2,586,915,2,587,915,2,588,915,2,589,915,2,590,915,2,591,915,2,592,914,2,593,914,2,594,914,2,595,915,1,596,915,1]],
      [251, 254, 250, [587,1017,2,588,1017,2,589,1017,1]],
      [255, 253, 252, [592,1016,3]],
      [253, 255, 255, [592,996,1,593,996,1]],
      [253, 253, 251, [593,585,1]],
      [255, 253, 249, [593,1014,3,594,1014,3,595,1014,3]],
      [253, 255, 255, [593,564,1]],
      [253, 255, 255, [594,564,1,595,564,1,596,564,1,597,564,1,598,564,1,599,564,1]],
      [253, 255, 255, [597,915,1,598,915,2,599,915,2,600,915,2,601,915,2,602,915,2]],
      [253, 255, 253, [599,889,2,600,889,1]],
      [255, 255, 254, [601,1014,1]],
      [254, 255, 255, [602,893,1,603,893,1,604,892,2,605,892,2,606,891,2,607,891,2,608,891,2]],
      [254, 254, 253, [604,1009,4,605,1009,5,606,1009,1,606,1011,4,607,1009,1,607,1013,2,608,1009,1,608,1013,2,609,1013,2,610,1013,2,611,1013,2,612,1013,2,613,1014,1]],
      [253, 255, 255, [606,502,1]],
      [252, 252, 249, [607,276,1]],
      [251, 253, 255, [608,588,1]],
      [255, 255, 255, [608,883,2]],
      [255, 249, 249, [609,590,1]],
      [254, 255, 255, [609,1009,1,610,1009,1,611,1009,2,612,1010,1]],
      [254, 255, 254, [612,891,1,613,891,1,614,890,2,615,890,3,616,891,2,617,891,2,618,892,1,619,892,1,620,892,1,621,892,1]],
      [254, 255, 255, [612,1016,2,613,1016,4,614,1016,4]],
      [255, 254, 232, [613,733,1,614,733,2,615,734,1]],
      [255, 249, 236, [613,736,1,614,736,1]],
      [255, 249, 236, [614,737,1]],
      [254, 255, 254, [615,1010,1,616,1010,1,617,1010,1,618,1010,1,619,1010,2,620,1010,4,621,1010,4]],
      [254, 253, 248, [615,1015,2,616,1015,3,617,1015,3]],
      [253, 253, 252, [618,1017,2]],
      [253, 255, 255, [619,580,1]],
      [253, 255, 255, [620,1017,2]],
      [253, 255, 255, [620,1015,2]],
      [255, 255, 255, [623,893,1]],
      [252, 254, 251, [624,1014,1,625,1014,3,626,1014,4,627,1014,3,628,1014,2]],
      [255, 250, 245, [625,584,1]],
      [253, 255, 254, [628,1016,3,629,1016,3]],
      [250, 252, 255, [630,258,1,631,258,1]],
      [255, 253, 235, [630,902,2,631,902,2,632,902,1]],
      [254, 254, 252, [630,1015,2,631,1014,3,632,1014,3,633,1014,3]],
      [230, 224, 217, [633,213,1,634,213,2]],
      [253, 255, 253, [633,589,1]],
      [179, 173, 159, [633,212,1,634,212,1,635,212,1]],
      [253, 251, 247, [634,216,1]],
      [253, 255, 255, [635,1005,1]],
      [255, 255, 255, [636,1005,1]],
      [255, 255, 246, [636,199,1]],
      [252, 255, 250, [637,908,1]],
      [252, 254, 249, [638,908,2,639,908,2,640,907,3,641,906,2]],
      [253, 255, 255, [641,801,1]],
      [251, 254, 254, [641,771,1,642,771,1]],
      [254, 255, 253, [642,844,1,643,844,2,643,848,3,644,844,7,645,845,4]],
      [255, 254, 255, [642,1017,2,643,1017,2]],
      [254, 254, 249, [643,839,1,644,839,2,645,839,3,646,839,3,647,839,3,648,839,2,649,839,2,650,839,2,651,839,3,652,840,2,653,841,1]],
      [255, 255, 255, [645,808,1]],
      [250, 250, 250, [645,1014,4,646,1014,4,647,1015,3,648,1017,2]],
      [255, 255, 255, [648,798,2]],
      [253, 254, 251, [650,1016,3,651,1016,4,652,1018,2]],
      [253, 254, 254, [650,796,1,651,796,2,652,796,2,653,795,3,654,796,1,655,796,1,656,796,2,657,796,2,658,796,2]],
      [253, 255, 255, [652,788,1]],
      [253, 255, 255, [653,788,1]],
      [253, 255, 255, [654,788,2,655,788,2,656,788,1,657,788,1]],
      [254, 253, 252, [656,1017,2,657,1017,2]],
      [253, 255, 255, [658,788,2,659,789,1]],
      [253, 253, 249, [664,1015,2,665,1015,4,666,1016,2]],
      [255, 242, 230, [666,756,1]],
      [252, 252, 249, [666,1011,1]],
      [254, 253, 254, [668,1017,2,669,1016,4,670,1016,4]],
      [255, 255, 255, [671,753,1]],
      [254, 255, 253, [672,1016,4,673,1016,4,674,1018,1]],
      [254, 254, 253, [677,870,2,678,871,1,679,871,2,680,871,2,681,871,2]],
      [255, 254, 252, [684,1018,3,685,1018,3]],
      [244, 246, 244, [688,1015,2,689,1015,2,690,1015,2]],
      [253, 255, 255, [689,1018,1,689,1020,1,690,1018,3]],
      [253, 255, 255, [694,956,1]],
      [253, 255, 255, [694,955,1]],
      [255, 250, 239, [694,961,2,695,961,3,696,963,1]],
      [196, 195, 200, [694,1014,2,695,1014,2,696,1012,3,697,1012,1]],
      [255, 252, 245, [695,1018,3,696,1018,3]],
      [255, 255, 255, [696,936,1]],
      [253, 255, 255, [696,949,1]],
      [253, 255, 255, [696,939,2,697,940,2]],
      [249, 255, 255, [696,992,1,697,992,1]],
      [252, 255, 252, [697,1010,1]],
      [255, 255, 255, [697,767,1]],
      [253, 255, 255, [697,942,1]],
      [253, 255, 253, [697,1014,1,698,1013,2,699,1013,2,700,1013,2,701,1013,2,702,1013,2,703,1013,2]],
      [253, 255, 253, [698,1016,2]],
      [250, 249, 232, [698,963,1,699,963,1,700,963,2]],
      [255, 251, 248, [700,759,2,701,759,2,702,759,1]],
      [255, 255, 252, [700,1018,1,701,1016,3,702,1017,2,703,1017,2,704,1017,2]],
      [255, 250, 227, [701,951,1]],
      [255, 253, 252, [702,916,1]],
      [255, 250, 227, [702,952,1]],
      [252, 255, 252, [702,981,1]],
      [241, 240, 243, [702,1010,2,703,1010,2,704,1010,3,705,1011,2,706,1011,3,707,1011,4,708,1013,1]],
      [255, 255, 253, [703,916,1]],
      [255, 255, 253, [703,939,1]],
      [255, 255, 253, [703,915,1]],
      [218, 211, 202, [703,925,1,704,925,1]],
      [255, 252, 235, [703,963,1,704,963,1]],
      [253, 255, 253, [704,966,2]],
      [255, 255, 237, [704,961,2,705,961,1]],
      [255, 255, 255, [704,965,1,705,965,1]],
      [254, 255, 254, [705,696,1,706,688,2,706,693,6,707,686,11,708,685,2,708,690,2]],
      [249, 251, 249, [706,1018,3,707,1018,3]],
      [253, 253, 249, [707,992,3,708,992,3]],
      [255, 255, 253, [707,991,1]],
      [255, 255, 253, [708,989,2]],
      [192, 178, 177, [708,995,2,709,995,2]],
      [255, 255, 255, [709,989,1]],
      [255, 255, 255, [709,987,1]],
      [236, 239, 245, [710,1005,1,711,1006,1]],
      [254, 255, 254, [710,1014,2,711,1014,3,712,1014,3,713,1014,3]],
      [255, 255, 255, [711,985,1]],
      [255, 255, 255, [712,985,1]],
      [254, 253, 255, [712,1018,3]],
      [251, 255, 254, [713,977,1]],
      [251, 255, 254, [713,978,1]],
      [255, 255, 255, [713,985,1,714,985,1]],
      [255, 255, 255, [715,985,1]],
      [255, 254, 252, [715,1016,3,716,1016,3,717,1016,3]],
      [214, 213, 218, [719,1005,1]],
      [253, 253, 252, [719,1016,3,720,1016,3,721,1017,2,722,1017,1]],
      [255, 255, 253, [720,1009,1]],
      [252, 255, 250, [723,958,1]],
      [204, 196, 201, [723,1006,1]],
      [219, 214, 219, [725,1005,2,726,1005,2]],
      [254, 253, 248, [725,1016,3,726,1016,3,727,1016,3,728,1017,2]],
      [246, 252, 255, [727,1005,1,728,1005,1]],
      [252, 254, 250, [731,1015,2,732,1015,2,733,1015,2]],
      [209, 208, 201, [731,759,1]],
      [239, 239, 237, [734,757,1]],
      [254, 252, 253, [734,1018,1]],
      [197, 190, 188, [734,1007,1,735,1007,1]],
      [152, 139, 134, [734,1017,1]],
      [254, 255, 252, [736,1013,1,737,1013,4,738,1014,3,739,1015,2,740,1015,2,741,1014,3,742,1013,4]],
      [253, 252, 253, [736,1017,2]],
      [253, 254, 245, [736,954,2,737,954,2]],
      [255, 252, 234, [740,963,2]],
      [253, 255, 253, [743,1013,1]],
      [254, 250, 231, [745,965,1]],
      [251, 254, 252, [747,978,2,748,978,2,749,977,3,750,977,3,751,978,2]],
      [255, 254, 255, [748,1021,1]],
      [254, 255, 253, [749,1018,3,750,1018,3,751,1018,3,752,1020,1]],
      [255, 255, 255, [751,1013,1,752,1013,1,753,1013,1]],
      [255, 255, 255, [754,1013,1,755,1013,1]],
      [252, 253, 247, [753,1017,2,754,1016,3,755,1016,3,756,1016,3,757,1016,2]],
      [255, 254, 255, [756,1013,1]],
      [255, 255, 253, [757,1013,1]],
      [255, 255, 255, [758,1013,1,759,1013,1,760,1013,1,761,1013,1]],
      [250, 244, 223, [758,973,1,759,974,1]],
      [253, 254, 252, [759,1017,2,760,1016,3,761,1016,3,762,1016,3]],
      [255, 255, 255, [765,1016,1]],
      [254, 254, 254, [770,970,1]],
      [254, 254, 253, [773,1016,2,774,1016,3,775,1016,3]],
      [255, 255, 251, [776,1014,3,777,1013,4,778,1015,2]],
      [254, 254, 253, [779,1016,2,780,1016,3,781,1017,2]],
      [250, 253, 251, [779,1009,4,780,1008,6,781,1012,2,782,1011,3,783,1011,2,784,1011,2,785,1011,1,786,1011,2,787,1011,2]],
      [253, 255, 253, [782,1016,1,783,1016,2,784,1015,2]],
      [255, 255, 252, [783,1018,2,784,1018,3]],
      [255, 255, 255, [786,1015,1]],
      [255, 255, 254, [789,1016,1]],
      [252, 255, 254, [790,1018,1,791,1018,1]],
      [244, 243, 243, [792,968,2,793,968,2]],
      [255, 255, 255, [792,1017,2]],
      [254, 254, 254, [792,1007,1]],
      [255, 255, 255, [792,1019,1,793,1018,2,794,1018,2]],
      [254, 254, 254, [793,1008,1]],
      [255, 255, 255, [793,1007,1]],
      [201, 197, 193, [795,1012,1]],
      [253, 255, 255, [795,1013,1]],
      [255, 255, 255, [797,1019,2,798,1018,3,799,1018,2]],
      [251, 248, 251, [798,1016,2]],
      [233, 221, 213, [804,965,1]],
      [251, 255, 255, [804,1012,1]],
      [253, 255, 253, [805,1020,1,806,1018,3,807,1018,2]],
      [255, 255, 254, [808,1016,2,809,1016,3,810,1017,2]],
      [222, 224, 228, [811,962,3]],
      [253, 254, 252, [813,1016,2,814,1016,2,815,1016,2,816,1016,2,817,1016,1,818,1016,1,819,1016,1]],
      [236, 232, 239, [819,1010,1,820,1009,3,821,1009,3]],
      [254, 255, 255, [820,1007,1,821,1007,2,822,1007,2,823,1007,2,824,1008,2,825,1008,2,826,1008,2,827,1008,1,828,1008,1,829,1008,1,830,1007,2,831,1007,2,832,1007,2,833,1007,2,834,1007,2,835,1007,2,836,1007,2,837,1006,3,838,1006,3,839,1007,2,840,1007,2,841,1007,2,842,1007,1]],
      [254, 255, 254, [821,1013,1,822,1013,1]],
      [251, 252, 252, [823,1017,2,824,1017,2]],
      [254, 255, 255, [824,1013,1,825,1013,1,826,1013,1,827,1013,1]],
      [172, 168, 167, [826,962,1]],
      [253, 255, 255, [829,1013,1,830,1013,1,831,1013,1]],
      [149, 145, 142, [832,961,1]],
      [255, 252, 246, [832,1016,3,833,1016,3,834,1017,2]],
      [255, 254, 247, [841,1018,1,842,1016,3,843,1015,3,844,1015,2,845,1015,2,846,1015,2]],
      [252, 255, 255, [845,783,1,846,782,2,847,782,2,848,782,2,849,782,3,850,782,2,851,782,2,852,782,2,853,782,2]],
      [255, 255, 255, [846,1009,2]],
      [255, 255, 255, [846,876,2,847,873,4,848,874,2]],
      [254, 255, 253, [846,880,1,847,880,5,848,881,4]],
      [254, 254, 252, [847,1011,3,848,1011,4,849,1011,4,850,1011,4,851,1011,4,852,1011,4,853,1011,4,854,1011,4,855,1011,6,856,1010,7,857,1011,7,858,1014,5,859,1016,2]],
      [253, 255, 255, [847,866,1]],
      [253, 255, 255, [847,867,1]],
      [243, 239, 234, [848,955,1]],
      [253, 255, 255, [848,904,1]],
      [253, 255, 255, [848,1018,2]],
      [253, 255, 255, [848,905,1]],
      [255, 254, 250, [851,740,4,852,737,7,853,736,4,853,742,1]],
      [255, 250, 246, [851,765,2,852,764,4,853,764,5]],
      [246, 251, 248, [853,1018,3,854,1018,2]],
      [254, 255, 255, [854,778,3,855,780,1]],
      [255, 255, 255, [854,865,1]],
      [253, 255, 255, [857,870,1]],
      [255, 255, 255, [858,953,1]],
      [171, 164, 157, [859,958,2,860,958,2]],
      [255, 255, 255, [860,952,1]],
      [254, 254, 249, [861,1016,3,862,1016,4,863,1018,3]],
      [247, 247, 247, [865,953,1]],
      [255, 254, 249, [867,1017,1,868,1016,3,869,1016,3]],
      [253, 254, 250, [875,1016,2,876,1016,1]],
      [255, 252, 239, [876,1018,4,877,1018,3,878,1019,1]],
      [252, 252, 251, [879,1018,2,880,1018,3,881,1018,2]],
      [255, 255, 255, [880,918,1]],
      [255, 255, 255, [882,918,1]],
      [255, 255, 255, [883,918,1,884,918,1]],
      [255, 252, 248, [885,1018,3,886,1018,3]],
      [255, 255, 255, [888,919,1]],
      [255, 253, 248, [890,1018,3,891,1018,3]],
      [255, 255, 255, [890,919,1,891,919,1,892,919,1]],
      [253, 253, 251, [892,1017,2,893,1016,3,894,1016,2,895,1016,2]],
      [253, 255, 255, [894,920,1]],
      [254, 254, 254, [895,1018,1]],
      [253, 255, 255, [895,969,1]],
      [253, 255, 255, [896,969,1]],
      [253, 255, 255, [897,969,1]],
      [252, 255, 253, [897,1014,3,898,1014,3,899,1014,3,900,1014,3]],
      [253, 255, 255, [898,970,1]],
      [255, 255, 255, [899,970,1]],
      [255, 251, 249, [900,1018,3,901,1018,3,902,1018,3]],
      [254, 255, 254, [904,968,2,905,967,3,906,967,2,907,966,3,908,966,3,909,966,2,910,966,2,911,966,2,912,966,2,913,966,1,913,969,2,914,965,5,915,965,4]],
      [226, 226, 224, [905,408,1]],
      [253, 255, 251, [906,56,2]],
      [253, 254, 252, [906,1017,2,907,1017,2]],
      [255, 255, 251, [908,1010,2,909,1010,2,910,1010,1,911,1010,1]],
      [255, 255, 253, [909,1016,3,910,1016,3,911,1016,3]],
      [255, 255, 255, [913,1010,1]],
      [200, 202, 201, [913,410,2]],
      [255, 255, 253, [913,1018,1,914,1018,2,915,1017,3,916,1017,2]],
      [255, 255, 255, [914,1010,1,915,1010,1]],
      [252, 255, 255, [914,982,1]],
      [253, 255, 253, [917,1009,1]],
      [254, 254, 254, [918,1017,2,919,1017,2,920,1017,2]],
      [253, 255, 255, [919,1001,1]],
      [255, 255, 255, [920,919,1]],
      [253, 255, 253, [921,1019,1]],
      [253, 255, 253, [921,1020,1]],
      [253, 254, 254, [922,1001,1,923,1000,2,924,1000,2,925,1000,2,926,1000,2,927,999,3,928,999,2,929,999,1,930,999,2,931,999,2,932,999,1,933,998,2,934,999,1,935,999,2,936,998,2,937,999,2,938,999,3,939,999,3,940,999,2,941,999,1,942,999,1]],
      [249, 251, 250, [924,837,1]],
      [248, 246, 230, [924,833,3]],
      [252, 255, 254, [925,837,2]],
      [249, 254, 255, [926,839,1]],
      [254, 251, 247, [926,1016,3,927,1016,3]],
      [253, 255, 255, [927,1020,1]],
      [253, 255, 255, [927,1019,1]],
      [253, 255, 255, [927,1010,1]],
      [252, 255, 255, [928,1018,2,929,1018,3,930,1020,1]],
      [253, 255, 255, [928,1011,1,929,1011,1]],
      [254, 254, 252, [930,1013,1,931,1011,4,932,1011,4,933,1011,2,933,1014,1,934,1011,2,934,1014,1,935,1011,4,936,1011,4,937,1011,4,938,1011,4,939,1011,4,940,1011,6,940,1018,1,941,1012,2,941,1015,3,942,1012,7,943,1011,8,944,1011,4,945,1011,4,946,1012,1,946,1014,1]],
      [253, 255, 255, [931,907,2]],
      [255, 255, 255, [931,686,1]],
      [255, 250, 238, [934,187,1]],
      [255, 255, 251, [934,1018,3,935,1018,3,936,1019,1]],
      [255, 255, 252, [936,1017,2,937,1016,3,938,1016,3]],
      [248, 238, 228, [937,827,2]],
      [254, 252, 232, [942,827,1]],
      [255, 253, 235, [943,195,1]],
      [254, 253, 248, [944,1016,2,945,1016,2,946,1015,3,947,1015,3,948,1015,2,949,1015,2,950,1013,3]],
      [253, 255, 254, [947,1011,2,948,1011,1,949,1011,2,950,1011,2]],
      [254, 255, 253, [952,1015,2,953,1014,3,954,1014,3,955,1013,3,956,1012,3,957,1012,2]],
      [253, 255, 255, [958,864,1]],
      [253, 255, 255, [959,864,2]],
      [254, 254, 252, [959,1017,2,960,1017,2]],
      [253, 255, 255, [961,865,1]],
      [252, 255, 252, [961,1017,1,962,1017,2,963,1018,1]],
      [253, 254, 252, [962,1013,1,963,1011,4,964,1011,4,965,1011,4,966,1011,4,967,1011,4,968,1011,4,969,1011,4,970,1012,4,971,1014,2,972,1014,2,973,1014,1]],
      [253, 255, 255, [962,865,1]],
      [253, 255, 255, [963,1019,1,964,1019,2]],
      [253, 255, 255, [965,865,1]],
      [255, 255, 253, [967,866,1]],
      [255, 255, 250, [967,1018,1,968,1017,2,969,1017,2]],
      [253, 255, 255, [968,866,1]],
      [254, 255, 250, [971,1016,1,972,1016,1,973,1016,1]],
      [255, 255, 255, [971,1018,2,972,1018,3,973,1018,3]],
      [255, 255, 253, [974,866,1,975,866,1]],
      [255, 254, 251, [976,865,1,977,865,1]],
      [252, 255, 250, [978,1014,2,979,1014,3,980,1014,3,981,1014,2]],
      [253, 255, 255, [986,862,1]],
      [253, 255, 255, [986,863,1]],
      [255, 255, 253, [987,1019,1,988,1018,2]],
      [254, 253, 253, [989,1017,2,990,1016,3,991,1016,2,992,1016,3]],
      [236, 235, 233, [997,1014,3,998,1014,3,999,1014,3,1000,1014,3,1001,1014,3,1002,1013,4]],
      [252, 255, 251, [1001,1019,2,1002,1018,3,1003,1018,3]],
      [248, 250, 249, [1004,1017,1]],
      [255, 255, 254, [1005,1016,2,1006,1016,3,1007,1017,3,1008,1018,2]],
      [255, 255, 255, [1006,1009,1,1007,1009,1]],
      [253, 255, 255, [1008,1009,1]],
      [253, 255, 255, [1008,1010,1]],
      [169, 163, 158, [1009,352,1]],
      [255, 252, 248, [1011,1010,1]],
      [255, 255, 255, [1018,955,1]],
      [255, 255, 253, [1021,1014,1,1022,1013,2,1023,1013,2]]
    ] };
    /* chapter 3's numbers for a man set on a seat by his own body (its c_cast.js MASTER_DOWN, PHO_BREATH, PHO_TALK_HEAD,
       each with its reason there): the bottom on the seat, each leg solved down to the floor, the feet laid flat */
    const MASTER_DOWN = { hipOver: 0.11, sink: 0.01, sole: GROUND_SOLE, edge: -9, flat: true };
    const PHO_BREATH = 6;
    /* (R42: his seated rest sat up straight, his pelvis turned back 11 of its 17.7 degrees (to 6.7, a man sitting upright:
       turned at the spine instead, by the same 11 shared out, the trunk came back only 4, measured), his neck as the take
       holds it on the straightened trunk (27.6 less 11: 16.6 forward, his face level); his hands laid on
       his thighs where his arms reach them with the elbow bent (restHands 'lap'), since the trunk's turn carries his
       shoulders back off his knees; his seated talk's shrug let down whole) */
    const PHO_SIT_UPRIGHT = { Sit_to_Stand_Transition_M: { hips: -11, trunk: 0, head: 0 } };
    const PHO_SIT_SHOULDERS = { Sitting_Answering_Questions: 1 };
    /* (R77: the drape over his left arm goes with the arm as his hand is laid on his thigh: assemble.py's K.follow) */
    const PHO_SIT_HANDS = { how: 'lap', follow: { L: ['DrapeArm', 'DrapeHang'] } };
    const PHO_TALK_HEAD = { Sitting_Answering_Questions: [0.3, 'Sit_to_Stand_Transition_M'] };
    /* (standing, his talk's head held as his seated one is: Chad's word on chapter 3's, "greatly restrained", v26.3; its
       head swings 9 cm side to side in its own file: tools/probes/takepath.mjs) */
    const PHO_STAND_HEAD = { Talk_with_Hands_Open: [0.3, 'Sit_to_Stand_Transition_M'] };
    /* (R64, Chad, 18 Nov 2026: "not just pho's sitting posture, but also fix his standing posture, talking posture, and
       other postures he uses in this particular chapter". MEASURED first on his standing body in the takes it wears here
       (tools/probes/posture.mjs, the tracker's log): at rest on the end of his rise his head is held 15.1 degrees back
       of his bind pose's 2.5, in his talk 17.8, a chin raised as if looking down his nose at her (a face tilted up reads
       as disdain, v6.9); his talk lifts his right collar bone 5.3 degrees; his push (the cast's 0.50 to 0.95 s) lifts both
       collar bones 32 and 35 degrees, 9 and 13 cm, his shoulders at his ears. So his neck is turned forward 12 degrees in
       his rest and his talk (back to within a degree of his bind pose), his talk's shoulders let down whole, and his push's
       let down 0.6 of the way, measured over the part of the take he plays: a man who thrusts both hands out does lift
       and bring his shoulders forward, by a little, not to his ears) */
    /* (R76, Chad, 18 Nov 2026: "Grandmaster pho's standing pose and standing talking pose is still hunchbacked and not
       natural". Measured on 21u: his trunk leans 4.3 degrees forward at rest and 5.9 in his talk (8.7 at most); turned
       back by as much, his neck given it back so his face stays where R64 set it) */
    /* (R88, Chad, 19 Nov 2026: "grandmaster pho's shoulders are still too bent forward, make it more natural", with his
       photograph of play from his side. MEASURED on build 33 (tools/probes/posture.mjs LIVE, the blessing, his standing
       body with every lay): his trunk 2.6 degrees from the vertical and his head over his shoulders, but his back bent
       53 degrees between its lower and upper parts, the upper back 20.5 degrees further forward than his own scan's bind
       pose, and his right shoulder's top 10 cm further forward: the rounded back of the photograph. So the upper back is
       opened (`chest`: the last two spine bones turned back), the whole trunk given back the lean that takes away
       (`trunk`), the neck's forward turn eased and the skull's nod given the rest, so his head stays over his shoulders
       and his face where it was (`head`, `nod`), and his right collar bone drawn back (`clavR`). The numbers chosen by
       photographs from his side at several strengths, and measured again: the tracker's log) */
    /* (CHOSEN on build 35's code with the arms' lay (r88b, 19 Nov): photographed from his left at the order to take the holy
       water, four ways, each full size, and laid beside the people standing in line at the offering tables in Chad's own
       photograph 10 of the Wai Kru (upright, the head level over the shoulders, the arms hanging at the sides, the hands
       at the front of the thigh). R76's stance (trunk -4.5, head 16.5) dropped his chin to his chest over a rounded back;
       the opened back without `arms` swung his left forearm out ahead of his thigh, the hand spread (build 34); with
       `arms`, chest -15 and the rest below (V1a) stand as the photograph stands, his upper arm 3.8 degrees behind the
       vertical and his forearm 7.5 forward, the hand at his thigh; chest -20 (V2a) looked the same with his head a
       little further back, and the milder of the two was taken (v22.0: never overshoot). His talk takes the same,
       its own lean kept (its trunk and head one and a half degrees more, as R76 had them)) */
    /* (R93, 19 Nov: his collar bones let down 3 degrees each, "very slightly", standing and talking: chosen beside 5 by
       photographs from his side and from where his shot was taken) */
    const PHO_STAND_UPRIGHT = { Sit_to_Stand_Transition_M: { trunk: 0.5, chest: -15, head: 10, nod: 9, clavR: 10, arms: 1, dropL: 3, dropR: 3 },
      Talk_with_Hands_Open: { trunk: -1, chest: -15, head: 11.5, nod: 9, clavR: 10, arms: 1, dropL: 3, dropR: 3 } };
    /* (R92, 19 Nov: and his own legs, which his robe follows, straightened to 5 degrees at the knee (kneesLay `own`)) */
    const PHO_KNEES = { takes: { Sit_to_Stand_Transition_M: 1, Talk_with_Hands_Open: 1 }, win: { Sit_to_Stand_Transition_M: [5.2, 99] }, bend: 4, max: 0.012, own: 5 };
    const PHO_STAND_SHOULDERS = { Talk_with_Hands_Open: 1, mage_soell_cast_3: 0.6 };
    const PHO_STAND_SHWIN = { mage_soell_cast_3: [0.5, 0.45] };
    /* (R77: his left arm and the drape over it held at his rest's while he talks standing, so the cloth covers the arm) */
    const PHO_ARM_REST = { takes: { Talk_with_Hands_Open: 1 }, from: ['Sit_to_Stand_Transition_M', 6.0],
      re: /^(mixamorig:?)?Left(ForeArm|Hand|Hand(Thumb|Index|Middle|Ring|Pinky)\d)$|^(mixamorig:?)?LeftArm$|^Drape(Arm|Hang)$/ };
    /* (R77: standing, his left arm and the drape over it let hang 7 degrees out from his side, clear of the robe at his hip) */
    const PHO_ARM_OUT = { takes: { Sit_to_Stand_Transition_M: 1, Talk_with_Hands_Open: 1 }, win: { Sit_to_Stand_Transition_M: [5.2, 99] },
      deg: 7, follow: ['DrapeArm', 'DrapeHang'] };
    /* the shoulders let down in every standing and talking take (v26.8, every standing person) */
    const STAND_SHOULDERS = { Idle_3: 1, Stand_and_Chat: 1, Listening_Gesture: 1, Talk_with_Hands_Open: 1, Talk_with_Right_Hand_Open: 1, Walking: 1 };
    /* LOOK D on Grandmaster Pho (Chad's pick, v24.52: "unlit, except for the robe"), chapter 3's own (c_cast.js lookD,
       its reason there): his face, hands and beads laid back at their own colour after the tone mapping, the robe lit.
       `level` is the hour's: under the tube he is lit as the room is (1); by the lamp alone the laid colour is dimmed */
    const phoLook = { k: { value: 1 }, level: { value: 1 }, lift: { value: 0.55 } };
    /* R43 (Chad, 18 Nov 2026: "There are also some skin colour bits on the back of his robe that can be easily seen during
       gameplay"): his body sheet holds small islands of skin colour lying inside the white of the robe, and look D draws
       whatever its test calls skin unlit, so each one stood out of the lit robe as an orange speck (in his file's own lit
       look they show too, fainter). His file is unchanged: the islands (PHO_FLECKS, c_phofleck.js, found in his sheet by
       tools/phoflecks.py) are painted once on a canvas in the colour of the robe round each, and laid over his sheet where
       its colour is read (premultiplied: a cell is the robe's colour, opaque, or nothing). */
    let phoFleckTex = null;
    function phoFleck() {
      if (phoFleckTex) return phoFleckTex;
      const N = PHO_FLECKS.size, cv = document.createElement('canvas'); cv.width = cv.height = N;
      const g = cv.getContext('2d');
      for (const [r, gr, b, R] of PHO_FLECKS.f) { g.fillStyle = `rgb(${r},${gr},${b})`; for (let i = 0; i < R.length; i += 3) g.fillRect(R[i + 1], R[i], R[i + 2], 1); }
      const t = tex(new THREE.CanvasTexture(cv)); t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true;
      return (phoFleckTex = t);
    }
    function lookD(model) {
      model.traverse(q => { if (!q.isMesh) return;
        const list = [].concat(q.material).map(m0 => { const mt = m0.clone(); mats.push(mt); const WHOLE = /\(face and hands\)$/.test(m0.name);
          mt.onBeforeCompile = (sh) => { sh.uniforms.uK = phoLook.k; sh.uniforms.uLevel = phoLook.level; sh.uniforms.uLift = phoLook.lift;
            if (!WHOLE && mt.map) { sh.uniforms.uFleck = { value: phoFleck() };
              sh.fragmentShader = 'uniform sampler2D uFleck;\n' + sh.fragmentShader.replace('#include <map_fragment>',
                '#include <map_fragment>\n{ vec4 fl = texture2D(uFleck, vMapUv); diffuseColor.rgb = diffuseColor.rgb * (1.0 - fl.a) + fl.rgb * diffuse; }'); }
            sh.fragmentShader = 'uniform float uLevel;\nuniform float uK;\nuniform float uLift;\n' + sh.fragmentShader.replace('#include <tonemapping_fragment>', '#include <tonemapping_fragment>\n'
              + (WHOLE ? 'float skn = 1.0;\n' : 'vec3 sc = pow(max(diffuseColor.rgb, vec3(1e-4)), vec3(1.0 / 2.2)); float mxc = max(sc.r, max(sc.g, sc.b)); float skn = smoothstep(0.12, 0.25, (mxc - min(sc.r, min(sc.g, sc.b))) / max(mxc, 1e-4));\n')
              + 'float kS = clamp(uK * skn, 0.0, 1.0); vec3 unl = diffuseColor.rgb * uLevel;\n'
              + 'gl_FragColor.rgb += (1.0 - kS) * uK * uLift * max(vec3(0.0), unl * 0.9 - gl_FragColor.rgb);\n'
              + 'gl_FragColor.rgb = mix(gl_FragColor.rgb, unl, kS);'); };
          mt.customProgramCacheKey = () => 'phoLookD' + (WHOLE ? ':whole' : ':fleck'); return mt; });
        q.material = Array.isArray(q.material) ? list : list[0]; });
    }
    /* and chapter 3's numbers for him seated CROSS-LEGGED on a cushion (its hall, v26.18: masters/v26.18/pho), with the
       white cloth over his crossed legs (w3pholap, a declared reuse) */
    const CROSS = { low: 'Sit_Cross_Legged_on_Floor', at: 1.25, hips: 0.0848, hem: 0.276, ringY: 0.262, reach: 0.08, middle: [-0.0035, -0.1226], lap: 'w3pholap', ref: ['Sit_to_Stand_Transition_M', 0.15],
      takes: { Sit_to_Stand_Transition_M: { lean: 3, t0: 0.02, t1: 0.3 }, Sitting_Answering_Questions: { lean: 1, sway: 0.4 }, Sit_Cheer_with_Left_Hand: { lean: 1, t0: 0, t1: 0.2 } },
      hands: { hold: /^Sitting_Answering_Questions$/, R: { x: -0.19, z: 0.32, yaw: 0.25, slope: 1.2, pole: [-0.35, -0.25, -0.9] }, L: { x: 0.02, z: 0.17, yaw: -1.0, slope: 0.3, pole: [0.8, -0.35, -0.5], follow: ['DrapeArm', 'DrapeHang'] } } };

    /* ---------------------------------------------------------------- THE COURT'S FRAME (the fight's metres, FIGHT.NUM:
       x across, z down it; the doorway and its thread at z -3.0, the gate's end at +3.0) IN THE WORLD'S. The court is
       turned half round from the world (the lens of the fight looks down it toward the house: heading pi), so local +x is
       the world's -x and local +z the world's -z; local z -3.0 is the house's face (-5.7). Every builder reads one frame */
    const COURT5 = { x: -8.5, z: -8.7, heading: Math.PI };
    const courtWorld = (lx, lz) => ({ x: COURT5.x - lx, z: COURT5.z - lz });
    /* where the fight begins (its own rules' places, FIGHT.NUM: read at run time, never at the build, where the rules' part
       is not yet declared): Grandmaster Pho played first, his student before him, the lesson's Prai in the court's middle,
       the other eight at the far end where each will enter from */
    function fightStart() {
      const N = (typeof FIGHT !== 'undefined' && FIGHT && FIGHT.NUM) || { phoAt: [1.15, 2.0], zavAt: [0, 0.7], lessonAt: [0, -1.5], entryAt: [] };
      return { pho: courtWorld(N.phoAt[0], N.phoAt[1]), zav: courtWorld(N.zavAt[0], N.zavAt[1]), lesson: courtWorld(N.lessonAt[0], N.lessonAt[1]),
               entry: (N.entryAt || []).map(a => courtWorld(a[0], a[1])), laid: (N.laidAt || []).map(a => courtWorld(a[0], a[1])) };
    }
    /* the fight's boom, as the engine derives it (main.js tagBoomFor: behind and above the played one's feet, inside the
       chapter's camBox, eased by tagSoft), so a film that hands to the mode ends on exactly its first picture. From the
       chapter's own `tag` declaration when the fight declares it, else the engine's defaults with the court's heading */
    function boomSoft(v, lo, hi, m) {
      if (!(hi > lo)) return (lo + hi) / 2;
      m = Math.max(0, Math.min(m, (hi - lo) / 2));
      if (m <= 0) return Math.max(lo, Math.min(hi, v));
      if (v > hi - m) return hi - m + m * (1 - Math.exp(-(v - (hi - m)) / m));
      if (v < lo + m) return lo + m - m * (1 - Math.exp(-((lo + m) - v) / m));
      return v;
    }
    function boomAt(feet) {
      const d = DATA.tag || {}, portrait = camera.aspect < 1;
      const b0 = Object.assign({ back: 4.0, up: 3.1, pitch: 26 }, d.boom || {}), b = portrait && d.portrait ? Object.assign({}, b0, d.portrait) : b0;
      const h = d.heading != null ? d.heading : COURT5.heading, soft = d.soft != null ? d.soft : 0.6, cb = d.camBox || null;
      const o = { x: feet.x + b.back * Math.sin(h), y: (feet.y || 0) + b.up, z: feet.z + b.back * Math.cos(h) };
      if (cb) { if (Number.isFinite(cb.minX) && Number.isFinite(cb.maxX)) o.x = boomSoft(o.x, cb.minX, cb.maxX, soft);
        if (Number.isFinite(cb.minZ) && Number.isFinite(cb.maxZ)) o.z = boomSoft(o.z, cb.minZ, cb.maxZ, soft);
        if (Number.isFinite(cb.minY) && Number.isFinite(cb.maxY)) o.y = boomSoft(o.y, cb.minY, cb.maxY, soft); }
      o.x = Math.max(DATA.bounds.minX, Math.min(DATA.bounds.maxX, o.x)); o.z = Math.max(DATA.bounds.minZ, Math.min(DATA.bounds.maxZ, o.z));
      return { eye: [o.x, o.y, o.z], heading: h, pitch: -(+b.pitch || 0) * Math.PI / 180, fov: Math.max(20, Math.min(110, +(b.fov || d.fov) || 72)) };
    }

    /* ---------------------------------------------------------------- THE CAST */
    const boneOf = (P, nm) => { if (!P || !P.bone) return null; const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
    const at0 = (p, k) => (STATION[p] && STATION[p][k]) || null;
    /* GRANDMASTER PHO STANDING: chapter 4's standing body exactly (its cast.phoB: the end of his rise from a seat, both
       arms down, there and back in a slow breath; his talk the library's open hands, his head greatly restrained; every
       posture law). His walk is his own file's (never yet seen in a chapter: photographed before it is cast at length) */
    { const S0 = at0('walk', 'pho');
      cast.pho = mkPerson('pho', S0.x, S0.z, S0.ry, { take: 'Sit_to_Stand_Transition_M',
        win: { Sit_to_Stand_Transition_M: [5.85, 0.25, PHO_BREATH] }, skins: false, look: lookD, blobW: 0.9, blobD: 0.8,
        centre: true, talk: 'Talk_with_Hands_Open', headDamp: PHO_STAND_HEAD, pace: true,
        upright: PHO_STAND_UPRIGHT, shoulders: PHO_STAND_SHOULDERS, shWin: PHO_STAND_SHWIN, armRest: PHO_ARM_REST, knees: PHO_KNEES,
        armOut: PHO_ARM_OUT });
      cast.pho.home = { x: S0.x, z: S0.z, ry: S0.ry }; }
    /* GRANDMASTER PHO SEATED CROSS-LEGGED on his cushion behind the low table (case three: the plan's 4.7): chapter 3's hall
       seat, its numbers (CROSS) and its cloth, on this room's cushion (w5cushion: its top 0.12 m) */
    const CUSHION_TOP = 0.12;
    { const S0 = at0('table', 'pho');
      cast.phoS = mkPerson('pho', S0.x, S0.z, S0.ry, { y: CUSHION_TOP, take: 'Sit_to_Stand_Transition_M', centre: true, hidden: true,
        win: { Sit_to_Stand_Transition_M: [0.02, 0.3, PHO_BREATH] }, seat: { y: 0, over: CROSS.hips, takes: /^Sit/ }, skins: false, look: lookD, blobW: 1.05, blobD: 0.85,
        talk: 'Sitting_Answering_Questions', headDamp: PHO_TALK_HEAD, cross: CROSS });
      cast.phoS.home = { x: S0.x, z: S0.z, ry: S0.ry, y: CUSHION_TOP }; }
    /* TON: chapter 3's own casting (a declared reuse: the same man, who works in Singapore), his shoulders let down, his
       look round restrained, his full body drawn to 2.75 m (he is talked to from about 2 m) */
    { const S0 = at0('walk', 'ton');
      cast.ton = mkPerson('e4ton', S0.x, S0.z, S0.ry, { take: 'Idle_3', talk: 'Stand_and_Chat', headDamp: { seiza: [0.35] }, lodK: 1.25,
        shoulders: { Idle_3: 1, Stand_and_Chat: 1, Walking: 1, seiza: 1 }, pace: true, phase: 0.3 });
      cast.ton.home = { x: S0.x, z: S0.z, ry: S0.ry }; }
    /* MASTER ZAVIER (Chad's R3, R5 and R10): seen only from the turn of the preparation to the bag tied (the plan's 4.4 to
       4.6: every other shot is his eyes). His lighter body with his walk, and every triangle of him within 2.2 m and in the
       films' close shots (v26.5). Hidden until a film or the fight shows him. HIS REST AND HIS TRANCE'S TAKES are CAST's to
       make (people/RECORD.md: his file holds only his walk): `restTake` reads whichever he has */
    cast.zav = mkPerson('p5zavier', 0, 0, 0, { take: 'Walking', hidden: true, skins: { 0: 'p5zavierh' }, blobW: 0.8, blobD: 0.6, pace: true,
      shoulders: { Idle_3: 1, Walking: 1 } });
    const zavRest = () => { const P = cast.zav; return P && P.acts && P.acts.Idle_3 ? 'Idle_3' : (P && P.acts && P.acts.trance ? 'trance' : null); };
    /* THE COLLECTOR (people/RECORD.md 3b: one level, his full body, 314,540 triangles: he sits across the table inside
       2.2 m), at his cushion at the table's west end. Seated by his own body on the cushion (o.seat.down: his bottom on
       it, each leg laid down to the floor from there). His file is replaced in place when CAST-2's mend lands */
    { const S0 = at0('table', 'collector');
      cast.col = mkPerson('p5collector', S0.x, S0.z, S0.ry, { take: 'Sitting_Answering_Questions', centre: true, hidden: true, skins: false,
        win: { Sitting_Answering_Questions: [0.2, 1.2, 9] }, talk: 'Sitting_Answering_Questions', blobW: 0.8, blobD: 0.8,
        seat: { y: CUSHION_TOP, takes: /^Sit/, down: Object.assign({}, MASTER_DOWN, { hipOver: 0.1, edge: -9 }) },
        headDamp: { Sitting_Answering_Questions: [0.35, 'Sitting_Answering_Questions'] } });
      cast.col.home = { x: S0.x, z: S0.z, ry: S0.ry }; }

    /* EACH PHASE'S PLACES FOR THEM (the world's STATION, b_world.js): where play stands them and where every film that
       hands to that phase leaves them (v5.25: a film ends with its props where play keeps them). `castAt(p)` is called
       by the world's phase hook; a film calls it in its end() */
    function castAt(p) {
      const st = STATION[p] || STATION.walk;
      const put0 = (P, s) => { if (!P) return; if (!s) { P.hidden = true; P.group.visible = false; return; } P.hidden = false; put(P, s.x, s.z, s.ry, s.y || 0); if (P.ready) P.group.visible = true; };
      const seated = p === 'table' || p === 'ask';
      put0(cast.pho, seated ? null : st.pho);
      put0(cast.phoS, seated ? { x: st.pho.x, z: st.pho.z, ry: st.pho.ry, y: CUSHION_TOP } : null);
      put0(cast.ton, st.ton || null);
      put0(cast.col, seated ? st.collector : null);
      if (cast.zav) { cast.zav.hidden = true; cast.zav.group.visible = false; }
      if (cast.pho && cast.pho.ready) rest(cast.pho, 0); if (cast.ton && cast.ton.ready) rest(cast.ton, 0);
      STICK5.to(p === 'fight' ? 'pho' : 'away');
      PRAI5.home(p); CAGE5.set(null); TRANCE5.set(0);
    }

    /* ---------------------------------------------------------------- THE NAGA STICK IN A HAND (w5nagastaff, made from
       Chad's photograph: R2; 1.40 m on its own foot, its head at the top). It is ONE thing (the world's, stage.things),
       carried by whoever the story gives it to: Ton wrapped (w5staffwrap, on both palms, as a sacred thing is carried),
       Ton unwrapped, held out to his teacher on both palms; Grandmaster Pho upright in his right hand, its foot on the
       paving, its shaft through his hand (laid there from his standing rest and carried by his hand bone after, so it goes
       where his hand goes in every take); and Ton again in both hands after. Never levelled at a person (the plan's 5.3) */
    const STICK_LEN = 1.40;
    const _stA = new THREE.Vector3(), _stB = new THREE.Vector3(), _stM = new THREE.Matrix4(), _stQ = new THREE.Quaternion(), _stS = new THREE.Vector3();
    /* each palm's middle (halfway from its wrist to its middle finger's root, as chapter 3 laid the roll: e4c3 matOnArms) */
    function palmOf(P, sd, out) {
      const hb = boneOf(P, sd + 'Hand'), kb = boneOf(P, sd + 'HandMiddle1');
      if (!hb) return null; hb.getWorldPosition(out); if (kb) out.lerp(kb.getWorldPosition(_stS), 0.5); return out;
    }
    const STICK5 = {
      who: 'away', off: null,
      /* who carries it: 'pho' (upright in his right hand), 'ton' (held out on his palms), 'tonWrap' (wrapped, on his
         palms), 'planted' (standing by itself where it was set: TOGETHER), 'away' */
      to(who) { this.who = who; const g = things.nagaStaff, w = things.staffWrap; if (!g) return;
        if (who === 'pho') { whenReady(cast.pho, (P) => this.inHand(P)); }
        else if (g.parent !== world) { g.updateWorldMatrix(true, false); world.attach(g); }
        g.visible = who === 'pho' || who === 'ton' || who === 'planted';
        if (w) w.visible = who === 'tonWrap'; },
      /* laid in his right hand from his standing rest (once: the offset is kept), and carried by the hand bone */
      inHand(P) {
        const g = things.nagaStaff, hb = boneOf(P, 'RightHand'); if (!g || !hb) return;
        if (!this.off) {
          const keep = {}; for (const k in P.acts) keep[k] = [P.acts[k].time, P.w[k]];
          const cur = P.cur, ft = P.filmT, gp = P.group.position.clone(), gr = P.group.rotation.y;
          pose(P, 'Sit_to_Stand_Transition_M', 5.9); P.group.updateWorldMatrix(true, true);
          const pm = palmOf(P, 'Right', _stA); const foot = _stB.set(pm.x, 0, pm.z);
          /* the stick upright, its foot on the paving under his palm, its Naga's head turned with his front */
          _stM.compose(foot, _stQ.setFromAxisAngle(_stS.set(0, 1, 0), gr), _stS.set(1, 1, 1));
          hb.updateWorldMatrix(true, false); this.off = new THREE.Matrix4().copy(hb.matrixWorld).invert().multiply(_stM);
          for (const k in P.acts) { P.acts[k].time = keep[k][0]; P.w[k] = keep[k][1]; P.acts[k].setEffectiveWeight(keep[k][1]); }
          P.cur = cur; P.filmT = ft; P.group.position.copy(gp); P.group.rotation.y = gr; P.mixer.update(0);
        }
        if (g.parent !== hb) hb.add(g);
        this.off.decompose(g.position, g.quaternion, g.scale); g.visible = true;
      },
      /* laid along both palms of a body (each palm's middle; chapter 3's roll on Ton's 'give'), the thing's own length on
         its local x for the wrapped staff and its local y for the stick; called after the body is posed, every frame */
      onPalms(P, which = 'stick') {
        const g = which === 'wrap' ? things.staffWrap : things.nagaStaff; if (!g || !P || !P.ready) return false;
        if (g.parent !== world) world.attach(g);
        P.group.updateWorldMatrix(true, true);
        const L = palmOf(P, 'Left', _stA), R = palmOf(P, 'Right', _stB); if (!L || !R) return false;
        const dx = R.x - L.x, dz = R.z - L.z, dy = R.y - L.y, hl = Math.hypot(dx, dz), yaw = Math.atan2(-dz, dx);
        const mid = L.clone().add(R).multiplyScalar(0.5); mid.y += 0.02;
        if (which === 'wrap') { g.position.copy(mid); g.rotation.set(0, yaw, Math.atan2(dy, hl), 'YXZ'); }
        else { /* the stick's length is its y: laid down along the palms' line, its head to his left hand's side */
          g.position.set(mid.x, mid.y, mid.z); g.rotation.set(0, yaw, Math.PI / 2 + Math.atan2(dy, hl), 'YXZ');
          g.translateY(-STICK_LEN * 0.5); }
        g.visible = true; return true; },
      /* stood upright by itself at a point (the Naga's film: planted, "the stick stands by itself once planted") */
      plant(x, z, ry = 0) { const g = things.nagaStaff; if (!g) return; if (g.parent !== world) world.attach(g); g.position.set(x, 0, z); g.rotation.set(0, ry, 0); g.visible = true; this.who = 'planted'; }
    };

    /* ---------------------------------------------------------------- THE NINE (the plan's 9.2; people/RECORD.md)
       "Seen as a woman's standing shape, faceless, of black oil with a pale sheen moving over it", each with "a thin pale
       edge of light, so that a black shape reads on a dark court on a phone" (v24.12: never a test of eyesight). Three
       bodies, one for each kind, nine of them: the lesson's and the fight's eight in the rules' own order (FIGHT.NUM
       kinds3: comes, slips, hides, comes, slips, hides, slips, hides), the body each kind wears below.
       TWO LOOKS, one body: (1) IN SPIRIT VISION (the hunt, and the preparation through his eyes): the body moved to the
       vision's layer, laid on the vision's picture as BLACK (its spirit's colour black: the vision lays a colour by its
       own strength, so black reads on its white negative), with a twin of pale light round its edge, shimmering; seen
       nowhere else, and where the wave has reached. (2) IN THE TRANCE (from the turn of the preparation to the bag tied:
       the fight is seen with his senses open, the plan's 5.6): a twin in the world's own layer, near black and oily, its
       edge pale, a sheen sliding down it. Hidden until asked for. The hands stay spread as made (no finger bones): the
       body is drawn as oil and light, not as its paint */
    const PRAI_KINDS = ['comes', 'comes', 'slips', 'hides', 'comes', 'slips', 'hides', 'slips', 'hides'];
    const PRAI_BODY = { comes: 'p5praicome', slips: 'p5praiheavy', hides: 'p5praihide' };
    /* where the nine stand all evening (the hunt: "nine still figures, heads bowed, all facing the doors of the house",
       between where he walks, clear of the path's middle), the court's metres; and where each stands when the fight
       begins (the lesson's in the middle, the others where they enter from) */
    const PRAI_STAND = [[-1.2, 1.9], [0.9, 2.3], [-0.2, 1.2], [1.35, 0.6], [-1.45, 0.15], [0.55, -0.4], [-0.75, -0.95], [1.25, -1.45], [-1.3, -1.9]];
    const PRAI_LOOK = { body: 0x050507, edge: 0xd6dbe8, sheen: 0x9aa2bc };
    const PRAI_EDGE = { color: 0xdfe4f0, fill: 0.0, rim: 1.35, power: 2.6, flicker: 0.45, xray: 0 };
    const PRAI_FILL = { color: 0x000000, fill: 0.92, rim: 0.0, power: 2.0, flicker: 0.0, xray: 0 };
    const PRAI_SHADE = /gl_FragColor\s*=\s*vec4\(\s*normalize\(\s*normal\s*\)\s*\*\s*0\.5\s*\+\s*0\.5\s*,\s*diffuseColor\.a\s*\);/;
    const praiU = { uPT: { value: 0 }, uPBody: { value: new THREE.Color(PRAI_LOOK.body) }, uPEdge: { value: new THREE.Color(PRAI_LOOK.edge) }, uPSheen: { value: new THREE.Color(PRAI_LOOK.sheen) } };
    function praiTranceMat() {
      const m = new THREE.MeshNormalMaterial({ side: THREE.FrontSide }); mats.push(m);
      m.transparent = true; m.depthWrite = true; m.fog = false; m.toneMapped = false;
      const U = Object.assign({ uPA: { value: 1 } }, praiU);
      m.onBeforeCompile = (sh) => { Object.assign(sh.uniforms, U);
        sh.vertexShader = 'varying vec3 vPw;\n' + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\n  vPw = (modelMatrix * vec4(transformed, 1.0)).xyz;');
        const out = sh.fragmentShader.replace(PRAI_SHADE,
          `vec3 pN = normalize(normal); float pf = pow(1.0 - clamp(abs(pN.z), 0.0, 1.0), 2.2);
           float ps = pow(0.5 + 0.5 * sin(vPw.y * 5.0 - uPT * 1.3 + vPw.x * 1.7 + vPw.z * 1.1), 10.0);
           vec3 pc = mix(uPBody, uPEdge, pf * 0.85) + uPSheen * ps * 0.28 * (1.0 - pf);
           gl_FragColor = vec4(pc, uPA * (0.9 + 0.1 * pf));`);
        if (out === sh.fragmentShader) console.warn('e4c5: the Prai\'s trance look found no colour line to write (three changed?)');
        sh.fragmentShader = 'varying vec3 vPw;\nuniform vec3 uPBody, uPEdge, uPSheen;\nuniform float uPT, uPA;\n' + out; };
      m.customProgramCacheKey = () => 'e4c5praiTrance';
      m.userData.U = U; return m;
    }
    const PRAI5 = {
      list: [], mode: 'vision', t: 0,
      /* the nine made: each its body, hidden, its two looks laid on as it lands */
      make() {
        PRAI_KINDS.forEach((kind, i) => {
          const P = mkPerson(PRAI_BODY[kind], 0, 0, 0, { take: 'Idle_3', phase: 0.11 * i, hidden: true, noBlob: true, skins: false, s: 0.97 + 0.02 * (i % 3) });
          P.kind = kind; P.slot = i; P.alpha = 1;
          whenReady(P, (Q) => this.looks(Q));
          this.list.push(P);
        });
      },
      looks(P) {
        if (P.tr) return;
        /* (2) the trance's twins, in the world's layer, made first from the body's own meshes */
        const m = praiTranceMat(), twins = [], list = [];
        P.model.traverse(o => { if (o.isMesh && !o.userData.__svTwin) list.push(o); });
        for (const o of list) { let t;
          if (o.isSkinnedMesh) { t = new THREE.SkinnedMesh(o.geometry, m); t.bind(o.skeleton, o.bindMatrix); } else t = new THREE.Mesh(o.geometry, m);
          t.userData.__svTwin = true; t.userData.__praiTwin = true; t.frustumCulled = false; t.castShadow = false; t.receiveShadow = false; t.visible = false;
          t.position.copy(o.position); t.quaternion.copy(o.quaternion); t.scale.copy(o.scale); o.parent.add(t); twins.push(t); }
        P.tr = { twins, m, on: false };
        /* (1) Spirit Vision's: the body itself to the vision's layer, laid on as black, and a twin of pale light at its
           edge (ctx.spiritAura twins only what the world draws: the body is turned back to the world's layer for the one
           call, then sent to the vision's) */
        if (!ctx.spirit || !ctx.spiritAura || !ctx.visionLayer) return;
        const own = []; P.model.traverse(o => { if (o.isMesh && !o.userData.__svTwin) own.push(o); });
        P.fx = ctx.spirit({ traverse: (f) => own.forEach(f) }, PRAI_FILL);
        for (const o of own) o.layers.set(0);
        P.edge = ctx.spiritAura({ traverse: (f) => own.forEach(f) }, PRAI_EDGE);
        for (const o of own) o.layers.set(ctx.visionLayer);
      },
      /* which look: 'vision' (seen only through Spirit Vision) or 'trance' (the world's, from the turn) */
      look(mode) { this.mode = mode; for (const P of this.list) this.lay(P); },
      lay(P) { if (!P.tr) return; const on = this.mode === 'trance' && P.group.visible;
        if (P.tr.on !== on) { P.tr.on = on; for (const t of P.tr.twins) t.visible = on; } },
      /* a body's strength (0 gone .. 1): both looks */
      alpha(P, a) { P.alpha = a; if (P.tr) P.tr.m.userData.U.uPA.value = a; if (P.fx) P.fx.set('uAlpha', a); if (P.edge) P.edge.set('uAlpha', a); },
      /* each frame (the sheen's own clock: wall time, a cosmetic) */
      tick(wdt) { this.t += wdt; praiU.uPT.value = this.t; for (const P of this.list) this.lay(P); },
      /* where they stand in a phase: in the court all evening (the hunt; the preparation finds them there), at the fight's
         places in the fight, nowhere after it */
      home(p) {
        this.list.forEach((P, i) => {
          const s = PRAI_STAND[i], w = courtWorld(s[0], s[1]);
          if (p === 'hunt' || p === 'fight') { P.hidden = false; put(P, w.x, w.z, faceTo(w.x, w.z, w.x, HOUSE.face)); if (P.ready) { P.group.visible = true; rest(P, 0); } }
          else { P.hidden = true; P.group.visible = false; }
        });
        this.look('vision'); for (const P of this.list) this.alpha(P, 1);
      }
    };
    PRAI5.make();

    /* ---------------------------------------------------------------- HIS LERSI'S CAGE (the plan's 5.3 and 11: "seven thin
       bars of light turning round him", a DRAWING of the Victor's Cage's "seven ramparts" (the text has walls; no line says
       it describes bars), and their ring on the paving; violet, his protection's colour, never gold or white). Its radius
       is the fight's (FIGHT.NUM cageR 1.0). A bar between the lens and him is drawn fainter (the mock: one always crosses
       his body). Painted light only: additive, no light added (v9.4) */
    const CAGE5 = (() => {
      const COL = 0x9b6bff, R = 1.0, H = 2.05, N = 7;
      const g = new THREE.Group(); g.visible = false; world.add(g);
      const spin = new THREE.Group(); g.add(spin);
      const add = (o) => { o.renderOrder = 3; return o; };
      const mBar = new THREE.MeshBasicMaterial({ color: COL, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false }); mats.push(mBar);
      const mGlow = new THREE.MeshBasicMaterial({ color: COL, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false }); mats.push(mGlow);
      const gBar = new THREE.CylinderGeometry(0.012, 0.012, H, 8, 1, true), gGlow = new THREE.CylinderGeometry(0.05, 0.05, H, 10, 1, true); owned.push(gBar, gGlow);
      const bars = [];
      for (let i = 0; i < N; i++) { const a = i / N * Math.PI * 2, b = new THREE.Group(); b.position.set(Math.sin(a) * R, H / 2 + 0.02, Math.cos(a) * R);
        const mb = mBar.clone(), mg = mGlow.clone(); mats.push(mb, mg);
        b.add(add(new THREE.Mesh(gBar, mb)), add(new THREE.Mesh(gGlow, mg))); spin.add(b); bars.push({ b, mb, mg }); }
      /* its ring on the paving, and a soft wider one (the gauge of its strength: the state is on the screen, v8.1) */
      const ringTex = (() => { const [c, x] = canvas(256, 256); const gr = x.createRadialGradient(128, 128, 96, 128, 128, 127);
        gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.55, 'rgba(255,255,255,0.9)'); gr.addColorStop(0.7, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
        x.fillStyle = gr; x.fillRect(0, 0, 256, 256); return tex(done(THREE, c, false)); })();
      const mRing = new THREE.MeshBasicMaterial({ map: ringTex, color: COL, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }); mats.push(mRing);
      const gRing = new THREE.PlaneGeometry(2.7 * R, 2.7 * R); gRing.rotateX(-Math.PI / 2); owned.push(gRing);
      const ring = add(new THREE.Mesh(gRing, mRing)); ring.position.y = 0.012; g.add(ring);
      const _cv = new THREE.Vector3(), _cl = new THREE.Vector3();
      return {
        group: g, R,
        /* the cage at a body's feet: `k` its strength (0 gone .. 1 whole), `t` the clock that turns it (a slow turn: a bar
           a 9 s), `held` the bars standing still (the plan's STEADY / a gripped one), `crack` its breaking (the surge);
           null hides it */
        set(o) {
          if (!o || !(o.k > 0.001)) { g.visible = false; return; }
          g.visible = true; g.position.set(o.x, o.y || 0, o.z);
          spin.rotation.y = o.held ? spin.rotation.y : (o.t || 0) * (Math.PI * 2 / (N * 9));
          camera.getWorldPosition(_cl);
          for (const B of bars) { B.b.getWorldPosition(_cv);
            /* a bar between the lens and him (nearer the lens than his middle, and inside the line to him) drawn fainter */
            const dl = Math.hypot(_cv.x - _cl.x, _cv.z - _cl.z), dm = Math.hypot(o.x - _cl.x, o.z - _cl.z);
            const front = dl < dm - 0.3 ? 0.35 : 1;
            const cr = o.crack ? 0.55 + 0.45 * Math.sin((o.t || 0) * 37 + B.b.position.x * 9) : 1;
            B.mb.opacity = 0.85 * o.k * front * cr; B.mg.opacity = 0.22 * o.k * front * cr;
            B.b.scale.set(0.7 + 0.6 * o.k, 1, 0.7 + 0.6 * o.k); }
          mRing.opacity = 0.7 * o.k;
        }
      };
    })();

    /* ---------------------------------------------------------------- THE TRANCE'S LOOK (the plan's 11): the court's lamps
       down, a deep blue dark, the paving still read; a soft pool of each one's colour painted under his feet (violet his,
       gold his teacher's); a low mist on the paving; and Grandmaster Pho's gold at his shoulders. TRANCE5.set(k) lays it
       on by k (0 none); its light is a preset handed to the kit's daylight (the chapter's own, v4.1) */
    const TRANCE_SKY = Object.assign({ stars: 0.4, moon: 0, sun: 0, clouds: 0 }, {
      stops: [[0.00, '#1a2040'], [0.12, '#141a36'], [0.35, '#0e1330'], [0.65, '#0a0e26'], [1.00, '#060818']],
      bg: 0x0a0e24, fog: [0x0b1028, 0.012],
      hemi: [0x5866b0, 0x141420, 0.55], key: [0x8fa0ff, 0.35, 1.0, 3.0, 1.0], fill: [0x403070, 0.25],
      vmHemi: [0x5866b0, 0x141420, 0.5], vmKey: [0x8fa0ff, 0.3] });
    PRESETS.TRANCE = TRANCE_SKY;
    const TRANCE5 = (() => {
      const g = new THREE.Group(); g.visible = false; world.add(g);
      const soft = (() => { const [c, x] = canvas(128, 128); const gr = x.createRadialGradient(64, 64, 2, 64, 64, 63);
        gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.45, 'rgba(255,255,255,0.4)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
        x.fillStyle = gr; x.fillRect(0, 0, 128, 128); return tex(done(THREE, c, false)); })();
      const pool = (col, size) => { const m = new THREE.MeshBasicMaterial({ map: soft, color: col, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }); mats.push(m);
        const q = new THREE.PlaneGeometry(size, size); q.rotateX(-Math.PI / 2); owned.push(q); const me = new THREE.Mesh(q, m); me.position.y = 0.01; me.renderOrder = 2; g.add(me); return me; };
      const poolZ = pool(0x8a5cff, 2.6), poolP = pool(0xffc860, 2.2);
      /* the mist: a few broad soft cards lying just over the paving, drifting (a seeded set: the same every run, v6.15) */
      const mist = [], r = rng(28590), mMist = new THREE.MeshBasicMaterial({ map: soft, color: 0x8090c8, transparent: true, opacity: 0, depthWrite: false, fog: false, toneMapped: false }); mats.push(mMist);
      for (let i = 0; i < 9; i++) { const q = new THREE.PlaneGeometry(2.4 + r() * 1.6, 1.6 + r() * 1.0); q.rotateX(-Math.PI / 2); owned.push(q);
        const me = new THREE.Mesh(q, mMist); me.position.set(COURT.x0 + 0.6 + r() * (COURT.x1 - COURT.x0 - 1.2), 0.05 + r() * 0.12, COURT.z0 + 1.0 + r() * (HOUSE.face - COURT.z0 - 2.0));
        me.userData.base = me.position.clone(); me.userData.ph = r() * 6.28; me.renderOrder = 2; g.add(me); mist.push(me); }
      /* his gold, at his shoulders: a soft warm light behind them (gold is his alone, v25.5), drawn over what stands at its
         depth (v25.5's law for a card of light among a body) */
      const mGold = new THREE.SpriteMaterial({ map: soft, color: 0xffc860, transparent: true, opacity: 0, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending }); mats.push(mGold);
      const gold = new THREE.Sprite(mGold); gold.scale.set(1.3, 1.0, 1); gold.renderOrder = 4; world.add(gold); gold.visible = false;
      let k0 = 0, gk = 0;
      return {
        get k() { return k0; },
        /* the look at k (0..1): the pools under the two of them where they stand, the mist, and the court's lamps down */
        set(k, t = 0) { k0 = k; g.visible = k > 0.001;
          if (!g.visible) { this.gold(0); return; }
          for (const me of mist) { const b = me.userData.base, ph = me.userData.ph; me.position.set(b.x + Math.sin(t * 0.07 + ph) * 0.4, b.y, b.z + Math.cos(t * 0.05 + ph) * 0.3); }
          mMist.opacity = 0.10 * k;
          courtLamps(1 - 0.85 * k); },
        /* each one's pool where he stands */
        pools(zav, pho, kz, kp) { poolZ.position.set(zav ? zav.x : 0, 0.011, zav ? zav.z : 0); poolZ.material.opacity = (zav ? 0.5 : 0) * kz;
          poolP.position.set(pho ? pho.x : 0, 0.012, pho ? pho.z : 0); poolP.material.opacity = (pho ? 0.45 : 0) * kp; },
        /* his gold at his shoulders, by k, where his body stands (his neck's height, a little behind) */
        gold(k, P = cast.pho) { gk = k; gold.visible = k > 0.001 && P && P.ready && P.group.visible;
          if (!gold.visible) return; const nb = boneOf(P, 'Neck') || P.head; if (nb) nb.getWorldPosition(gold.position); else gold.position.set(P.group.position.x, 1.45, P.group.position.z);
          const ry = P.group.rotation.y; gold.position.x -= Math.sin(ry) * 0.12; gold.position.z -= Math.cos(ry) * 0.12; gold.position.y -= 0.08;
          mGold.opacity = 0.55 * k; }
      };
    })();

    /* ================================================================ THE CLEANSING'S RULES (masters/v28.0/parts/c_fightrules.js)
       The tag-team fight of the plan's 5, REDESIGNED for Chad's R14 (21 Nov 2026): "Zavier needs actual abilities that
       do something or synergize with pho abilities so that it is a real reason to switch back and forth between
       characters for real gameplay. Like an ability to lock a prai in a bubble to stop it from escaping."
       docs/V28.0-FIGHT.md is the specification; THIS PART IS ITS ONE SET OF RULES AND ITS ONE TABLE OF NUMBERS, so what
       is played and what is tested are one function (v8.7): tools/probes/fightsim.mjs loads this very file in Node and
       plays it ten thousand times a simulated player.

       PURE. No page, no THREE, no clock and no randomness of its own (no Date, no performance, no Math.random): a fight
       is ONE PLAIN OBJECT (FIGHT.create), moved on by FIGHT.step(fight, input, dt, io), which answers what happened as a
       list of events for the pictures and the sounds. io.rand is the chapter's seeded stream (v6.15: a replay rewinds
       it), io.secs(key) a line's length (the chapter's SECS). Because the fight is plain data, a retry, a replay and a
       probe's diff all read it as it is (v8.1, v8.2).

       THE IDEA IN FIVE LINES (the spec's 1):
         1. Nothing is destroyed. A Prai is tired, and a tired one is gathered into the black bag: nine to nought.
         2. They come for Master Zavier, whose senses are open. His Lersi's cage of light holds them at its bars, and wears.
         3. Grandmaster Pho's fire only CHASES a free Prai away (it flees and hides, and comes back unseen); it TIRES a Prai
            only once Master Zavier has BOUND it in a bubble (bound, it cannot move, slip, hide or rise again). Only
            Master Zavier SMELLS out the hidden; only Grandmaster Pho BAGS the tired. So every Prai is the pair's work.
         4. The golden SHOCKWAVE gathers every bound Prai at once; while it is gathered they rush to break it, so Master
            Zavier LENDS his teacher his cage for those seconds, and stands with nothing round him. Twice (six left, and
            four) the Prai cling to the house: the bag is shut, and only the gold can take them.
         5. Losing begins the FIGHT again (Chad's R14: "Fight restarts"); nothing is ever played for him.

       HOW THE CHAPTER USES IT (c_story.js, when the fight is built: the tracker's M8):
         const fight = FIGHT.create({ sanity: <his sanity> });      (guard left at 0 in the game: the engine's evCut guards
           the drain events once, below; `guard` is for the simulation, which has no engine, to play the same sum)
         every frame of the mode:  const ev = FIGHT.step(fight, input, dt, { rand, secs: k => SECS[k] });
           input = { act } or { slot } (the button pressed: one a frame, the main one first), { mx, mz } (the stick, by
           the screen: up is -z, down the court), { pick: id } (a tap on a Prai) or { pickCloud: id } (a tap on a stale
           cloud), { sanity } (the engine's own number after its guards, fed back every frame).
           Each event is drawn and sounded by the chapter: { e: 'say', key } is a line of the script (also a caption);
           { e: 'drain', amt } is a cost the chapter passes through kitAward('sanity', -amt, { minigame: true }), so a
           worn piece guards here too (v14.13); { e: 'stage', to } moves the mode (the Naga's film, the card, the end).
         FIGHT.hud(fight) is the screen: each button's face, wait, lock and pulse (v8.1: whatever the fight obeys is on
         the screen); FIGHT.need(fight) what the moment asks for (the pulse, and the prompt's words).
       Only the part's one name, FIGHT, is declared in build(): every other name lives inside it (v6.11). */
    const FIGHT = (() => {
      'use strict';

      /* ------------------------------------------------------------------ THE NUMBERS (the spec's 7: the one table) */
      const NUM = {
        // THE COURT, in metres: x across it, z down it (the house's doorway, and the thread across it, at z -3.0; the
        // gate, and the camera behind and above the one he plays, at +3.0). The play area of the plan's 8.1
        courtX: 1.95, courtZ0: -3.0, courtZ1: 3.0,
        praiIn: 0.2,                          // a Prai keeps this far inside the court's walls
        threadZ: -2.7,                        // and never comes nearer the doorway, or the three behind the thread, than this
        bodyX: 1.6, bodyZ0: -2.3, bodyZ1: 2.6, // where the two of them may stand
        zavAt: [0, 0.7], phoAt: [1.15, 2.0],
        lessonAt: [0, -1.5],                  // where the lesson's Prai stands and strains toward him
        laidAt: [[-1.15, -0.8], [0, -1.35], [1.15, -0.8]],   // where the Naga lays the last three (stage 6)
        entryAt: [[-1.55, -2.45], [1.55, -2.45], [0, -2.5], [-1.75, -1.25], [1.75, -1.25], [-1.1, -2.5], [1.1, -2.5], [0.6, -2.5]],
        entryJitter: 0.25,
        // THE TWO OF THEM
        phoWalk: 1.2, zavWalk: 0.6,           // his own Walking's travel (v26.0); his student is a man led
        apart: 1.45,                          // Grandmaster Pho never stands inside his student's cage (its bars 1.0, and himself)
        switchLock: 0.8,                      // nothing pressed inside it is spent by the one who arrives
        aiFar: 3.0, aiHome: [1.15, 1.3],      // the unplayed Grandmaster Pho walks back beside his student once this far
        // THE CAGE (his Lersi's, round him from the first moment to the last, never pressed for: the case file)
        cageR: 1.0, pressR: 1.3, himR: 0.55, waitR: 2.5, pressMax: 3,
        cageMax: 100, wear: 4, mend: 6, whole: 30,
        // HIS SANITY (the game's own stat)
        drain: 2, gather: 2.0, lostAt: 12, floor: 40, surgeTo: 13, surgeSecs: 3,
        // THE PRAI
        paceCome: 0.6, paceSlip: 0.8, paceHide: 0.55, paceHidden: 0.5, rush: 2.2,
        enterSecs: 1.0, hideAfter: 1.5, weave: 0.9, weaveSecs: 1.8,
        fleeSecs: 1.0, fleePace: 2.5, lurkSecs: 1.5, // a Prai chased away flees, sinks, and lies still a while before it comes on
        // FIRE (Grandmaster Pho's main act)
        fireWait: 1.1, flight: 0.7, fireReach: 5.5, push: 0.7, stopSecs: 0.8, aiFireWait: 3.3,
        ringSecs: 6,                          // a tired Prai's ring closes over this; then it rises again, and hides
        // BAG
        bagReach: 2.5, bagSecs: 1.0,
        // THE GOLDEN SHOCKWAVE (his own R3: "travels as a circle outwards but with long cooldown")
        waveWait: 50, waveBroken: 15, windSecs: 1.5, ringSpeed: 6, ringMax: 7, breakDist: 0.8, throwZ: -2.45, throwStop: 2.0,
        // BIND (Master Zavier's main act: Chad's "lock a prai in a bubble to stop it from escaping")
        bindWait: 3.5, bindReach: 5.5, bubbleSecs: 10, bubbleMax: 3,
        stillMax: 20,                         // the most a bubble stands still in all (the gold's grace, the lent cage, the gold
                                              // gathered and gone out: 8 + 9 + 1.5 + 1.2 is under it)
        bubbleLongest: 30,                    // so a bubble's longest stand: bubbleSecs + stillMax
        lendLongest: 9,                       // a lend, and the gold gathered and loosed under it
        // SMELL (only he finds a Prai that has gone unseen)
        smellWait: 2.5, showSecs: 4.0, staleSecs: 3.0,
        drawSecs: 3.0, drawPace: 2.5, drawWear: 3.0,   // a breath taken for nothing (nothing hidden) draws every free Prai on, faster and harder
        // LEND (his cage over his teacher while the gold is gathered)
        lendSecs: 6.0, lendAfter: 0.3,           // (pressed with the cage lent, the gold keeps the cage round him until it has gone out)
        // STAGE 3, THE FIGHT: the eight left after the lesson, in this order, each at its time while fewer than freeAt
        // allows are free on the court (one at a time once he asks his teacher to lead: after three losses)
        kinds3: ['come', 'slip', 'hide', 'come', 'slip', 'hide', 'slip', 'hide'],
        due3: [0, 12, 26, 42, 58, 74, 90, 106], entryGap: 1.5, leadMax: 1, breather: 8,
        freeAt: [[0, 1], [24, 2]],             // how many may be free on the court at once: one, then two from 24 s
        // HOLD THE LINE, twice: at six left and at four the bag no longer takes them, the gold gathers itself anew
        // (holdSecs), and only it can take them; after a wave that took none, holdRetry. The first hold ends when the gold
        // has gathered; the last, at three. While a hold stands they come on at holdPace (the gathering gold weighs on
        // them), and once the gold is ready a bubble waits goldGrace for it
        holdAt: [6, 4], holdSecs: 40, holdRetry: 12, holdPace: 0.45, goldGrace: 8,
        // STAGES 4 TO 6
        togetherAfter: 1.5, togetherSecs: 1.2, filmGuard: 40,
        // THE VOICE (one at a time, v5.30; a need's prompt never closer than needCap to the last line)
        needAfter: 1.0, urgentAfter: 0.5, needEvery: 12, lineGap: 0.25, needCap: 4.0, colourLate: 4.0, lessonLate: 10.0, holdLate: 30.0,
        // THE FRAME: no step moves the fight more than this (a slow phone gets a slower fight, never a jump)
        dtMax: 0.1
      };

      /* ------------------------------------------------------------------ THE PRAI'S STATES (the spec's 4: the one list)
         Each: is it seen; how long it can stand in it (a timed state: its own end is its exit, and its failure); and
         every state it can go to. A loss puts stage 3's eight back to `waiting` (a reset, not a move). fightsim.mjs fails a
         move that is not listed here, a state entered and never left, and a timed state stood in past its time. A state
         stood in under a LESSON's hold (the first use waits for him) is logged with a star and has no time limit. */
      const STATES = {
        waiting:  { seen: 0, secs: '',           exits: ['entering', 'shape'] },
        entering: { seen: 1, secs: 'enterSecs',  exits: ['coming', 'shape'] },
        coming:   { seen: 1, secs: '',           exits: ['pressing', 'through', 'hidden', 'fleeing', 'bound', 'rushing', 'shape'] },
        pressing: { seen: 1, secs: '',           exits: ['coming', 'through', 'fleeing', 'bound', 'rushing', 'shape'] },
        through:  { seen: 1, secs: '',           exits: ['coming', 'fleeing', 'bound', 'rushing', 'shape'] },
        fleeing:  { seen: 1, secs: 'fleeSecs',   exits: ['hidden', 'shape'] },
        hidden:   { seen: 0, secs: '',           exits: ['shown', 'beneath', 'shape'] },
        beneath:  { seen: 0, secs: '',           exits: ['shown', 'shape'] },
        shown:    { seen: 1, secs: 'showSecs',   exits: ['hidden', 'beneath', 'fleeing', 'bound', 'rushing', 'shape'] },
        bound:    { seen: 1, secs: 'bubbleLongest', exits: ['coming', 'hidden', 'held', 'gathered', 'shape'] },
        held:     { seen: 1, secs: 'bubbleLongest', exits: ['tired', 'drawn', 'gathered', 'shape'] },
        tired:    { seen: 1, secs: 'ringSecs',   exits: ['hidden', 'held', 'drawn', 'shape'] },
        rushing:  { seen: 1, secs: 'windSecs',   exits: ['coming', 'shown', 'hidden', 'bound', 'shape'] },
        drawn:    { seen: 1, secs: 'bagSecs',    exits: ['gathered', 'shape'] },
        gathered: { seen: 0, secs: '',           exits: [] },
        shape:    { seen: 1, secs: '',           exits: ['laid'] },
        laid:     { seen: 1, secs: '',           exits: ['drawn'] }
      };
      /* the fight's own stages (the plan's 5.5: the lesson, the fight, the surge, the Naga, the last three); and the
         fight's own timed things, each with the number that bounds it */
      const STAGES = ['brief', 'learn', 'fight', 'surge', 'naga', 'last', 'lost', 'won'];
      const TIMED = { wind: 'windSecs', lend: 'lendLongest', lock: 'switchLock', fill: 'togetherSecs', naga: 'filmGuard' };

      /* ------------------------------------------------------------------ THE WORDS SAID (keys of masters/v28.0/script/
         lines.json; the words are there, never here). A NEED's three wordings by who is played: the first, other words,
         and the short one that is said from then on (the plan's 7.1). A ONCE line is said at its moment, or dropped if
         the moment has passed (v5.30): its number is its priority (3 a lesson, 2 praise, 0 the colour of the court) */
      const NEEDLINES = {
        Lfire:    { pho: ['ph5f1', 'ph5f1', 'ph5f1'] },
        // the lesson's needs and the fight's are the SAME needs: what the lesson taught, the fight goes on asking in other
        // words (its first wordings are the lesson's own lines, said once there)
        hidden:   { pho: ['ph5f3', 'ph5ny2', 'ph5ns3'], zav: ['ph5f7', 'ph5nf2', 'ph5nf3'] },
        shown:    { pho: ['ph5nt1', 'ph5nt2', 'ph5ns3'], zav: ['ph5f8', 'ph5ns2', 'ph5f4'] },
        bound:    { pho: ['ph5f6', 'ph5nq1', 'ph5f1'], zav: ['ph5f5', 'ph5nc2', 'ph5nc3'] },
        tired:    { pho: ['ph5nd1', 'ph5nd2', 'ph5nd3'], zav: ['ph5ni1', 'ph5ni2', 'ph5ni2'] },
        keep:     { zav: ['ph5nr1', 'ph5nr2', 'ph5f4'] },
        slip:     { pho: ['ph5nw1', 'ph5nw2', 'ph5ns3'], zav: ['ph5nx1', 'ph5nx2', 'ph5f4'] },
        come:     { pho: ['ph5nk2', 'ph5nt2', 'ph5ns3'], zav: ['ph5ng1', 'ph5ng2', 'ph5f4'] },
        // what costs him while it stands: said at once, and short (the words come before the cost: the plan's 7.1)
        press:    { pho: ['ph5na3', 'ph5nt2', 'ph5ns3'], zav: ['ph5nb1', 'ph5nb2', 'ph5f4'] },
        cage:     { pho: ['ph5na1', 'ph5na2', 'ph5f1'] },
        athimF:   { pho: ['ph5nj1', 'ph5nj2', 'ph5f1'] },
        athimS:   { pho: ['ph5nk1', 'ph5nw2', 'ph5ns3'] },
        athimB:   { zav: ['ph5nl1', 'ph5nl2', 'ph5f4'] },
        athimSw:  { zav: ['ph5nl3', 'ph5no2', 'ph5no2'] },
        beneath:  { pho: ['ph5nm1', 'ph5ny2', 'ph5ns3'], zav: ['ph5nn1', 'ph5nn2', 'ph5nf3'] },
        // the golden shockwave
        waveL:    { pho: ['ph5f9', 'ph5nu1', 'ph5ns3'], zav: ['ph5f9', 'ph5nv1', 'ph5nv3'] },
        waveB:    { pho: ['ph5fd', 'ph5nt2', 'ph5ns3'], zav: ['ph5fd', 'ph5f4', 'ph5f4'] },
        waveLend: { pho: ['ph5nu1', 'ph5nu2', 'ph5ns3'], zav: ['ph5nv1', 'ph5nv2', 'ph5nv3'] },
        waveSafe: { pho: ['ph5nh1', 'ph5nh2', 'ph5nh2'] },
        waveGo:   { pho: ['ph5np1', 'ph5nh2', 'ph5nh2'], zav: ['ph5no1', 'ph5no2', 'ph5no2'] },
        together: { pho: ['ph5ca', 'ph5cb', 'ph5cb'], zav: ['ph5ca', 'ph5cb', 'ph5cb'] },
        last:     { pho: ['ph5nd3', 'ph5nd3', 'ph5nd3'] }
      };
      const ONCE = {
        ph5l2: 3, q5c0: 3, ph5f0: 3, ph5f2: 3, ph5fa: 3, ph5fc: 3, ph5f10: 3, ph5fe: 3, ph5fg: 3, ph5fh: 3, ph5fi: 3, ph5fj: 3, ph5ne1: 3, ph5c1: 3, ph5c3: 3, ph5c4: 3,
        ph5g1: 2, ph5g2: 2, ph5g3: 2, ph5g4: 2,
        q5c1: 0, q5c2: 3, q5c3: 0, q5c4: 0, q5c5: 0,
        tn5c0: 0, ko5c1: 0, tn5c1: 0, ju5c1: 0, tn5c2: 0, ju5c2: 3, tn5c3: 0
      };
      /* the needs that cost him while they stand: their prompt is said at once, ahead of praise and colour */
      const URGENT = { athimF: 1, athimS: 1, athimB: 1, athimSw: 1, beneath: 1, cage: 1, press: 1, waveGo: 1 };
      /* (said straight away, never queued: the card has opened and the fight's clock stands still under it) */
      const ONLOSS = 'ph5l1';
      const LINES_SAID = (() => {
        const s = new Set([ONLOSS]);
        for (const id in NEEDLINES) for (const w in NEEDLINES[id]) for (const k of NEEDLINES[id][w]) s.add(k);
        for (const k in ONCE) s.add(k);
        return [...s].sort();
      })();

      /* the three buttons each of them has, and the switch (the plan's 5.6: the same places for both; the pictures change) */
      const SLOT = { pho: { main: 'FIRE', second: 'SHOCKWAVE', third: 'BAG' }, zav: { main: 'BIND', second: 'SMELL', third: 'LEND' } };
      const PHO_ACTS = { FIRE: 1, SHOCKWAVE: 1, BAG: 1 }, ZAV_ACTS = { BIND: 1, SMELL: 1, LEND: 1 };

      /* ------------------------------------------------------------------ small things */
      const dist = (ax, az, bx, bz) => { const dx = ax - bx, dz = az - bz; return Math.sqrt(dx * dx + dz * dz); };
      const isP = (st) => st.who === 'pho';
      const atHim = (p) => p.st === 'through' || p.st === 'beneath' || (p.st === 'shown' && p.at === 2);
      const free = (p) => p.st === 'entering' || p.st === 'coming' || p.st === 'pressing' || p.st === 'through' || p.st === 'fleeing' ||
                          p.st === 'hidden' || p.st === 'beneath' || p.st === 'shown' || p.st === 'rushing';
      const onCourt = (p) => p.st !== 'waiting' && p.st !== 'gathered';
      const seenFree = (p) => p.st === 'coming' || p.st === 'pressing' || p.st === 'through' || p.st === 'shown';
      const bubbles = (st) => { let k = 0; for (const p of st.prai) if (p.st === 'bound' || p.st === 'held') k++; return k; };
      function clampPrai(n, p) {
        const xm = n.courtX - n.praiIn, z0 = Math.max(n.courtZ0 + n.praiIn, n.threadZ), z1 = n.courtZ1 - n.praiIn;
        if (p.x < -xm) p.x = -xm; else if (p.x > xm) p.x = xm;
        if (p.z < z0) p.z = z0; else if (p.z > z1) p.z = z1;
      }
      function clampBody(n, b) {
        if (b.x < -n.bodyX) b.x = -n.bodyX; else if (b.x > n.bodyX) b.x = n.bodyX;
        if (b.z < n.bodyZ0) b.z = n.bodyZ0; else if (b.z > n.bodyZ1) b.z = n.bodyZ1;
      }
      function fresh(id, kind) {
        // at: 0 free in the court, 1 at the cage's bars, 2 at him. hold, a lesson's hold: '' none; 'stand' the lesson's
        // Prai stands where it is; 'hide' it waits under the paving for the first SMELL; 'show' then shown for the first
        // BIND; 'keep' a bubble that stands still until the lesson's bag; 'grace' a bubble that stands still until the
        // first golden shockwave. lurk: a Prai chased away lies still this long before it comes on
        return { id, kind, st: 'waiting', x: 0, z: 0, t: 0, at: 0, ring: 0, bub: 0, stood: 0, show: 0, gath: 0, stop: 0,
                 hideIn: 0, lurk: 0, ph: 0, due: 0, fx: 0, fz: 0, hold: '', was: '' };
      }

      /* ------------------------------------------------------------------ a fight */
      function create(opts) {
        const o = opts || {};
        const n = Object.assign({}, NUM, o.num || {});
        const s0 = Number.isFinite(o.sanity) ? Math.max(0, Math.min(100, o.sanity)) : 100;
        const st = {
          v: 2, n, stage: 'brief', t: 0, stageT: 0, who: 'pho', lock: 0, lockUntil: 0, drawT: 0,
          left: 9, losses: 0, lead: false,
          sanity: s0, open: s0, raised: false, preSurge: 0, guard: Math.max(0, Math.min(0.9, +o.guard || 0)),
          pho: { x: n.phoAt[0], z: n.phoAt[1], fireWait: 0, aiWait: n.aiFireWait, waveWait: n.waveWait, wind: 0, ring: null, draw: 0 },
          zav: { x: n.zavAt[0], z: n.zavAt[1], bindWait: 0, smellWait: 0, look: 0 },
          cage: { str: n.cageMax, broken: false, lent: 0 },
          prai: [], clouds: [], flights: [], nextCloud: 1, lastEntry: -99, together: 0, film: 0,
          firsts: {}, lesson: { wave: '' }, hold: 0, holdsDone: 0, goldAt: -1, seen: { swap: false, bind: false, smell: false, shock: false },
          voice: { until: 0, last: -99, q: [], need: '', needSince: 0, needSaid: -99, count: {} },
          said: {}, cur: null,
          log: { dwell: {}, trans: {}, stage: {}, timed: {} },
          stats: { fires: 0, chased: 0, slipped: 0, binds: 0, smells: 0, lends: 0, waves: 0, broken: 0, bags: 0, byWave: 0,
                   switches: 0, refused: 0, stale: 0, rose: 0, drained: 0, breaks: 0, lines: 0, length: 0 },
          ev: []
        };
        st.prai.push(fresh(1, 'come'));
        for (let i = 0; i < 8; i++) st.prai.push(fresh(2 + i, n.kinds3[i]));
        return st;
      }

      /* ------------------------------------------------------------------ moving between states (every move is logged:
         the longest stand in each state, and every move made, so the simulation reads this file's state list against the
         rules as they ran) */
      function setSt(st, p, to, why) {
        const from = p.st;
        if (from === to) return;
        const L = st.log, key = from + (p.hold ? '*' : '');
        if (!(p.t <= (L.dwell[key] || 0))) L.dwell[key] = p.t;
        const tk = from + '>' + to;
        L.trans[tk] = (L.trans[tk] || 0) + 1;
        p.st = to; p.t = 0;
        if (p.hold === 'show' && to !== 'shown') p.hold = '';      // the lesson's shown Prai has been answered
        st.ev.push({ e: 'state', id: p.id, from, to, why: why || '' });
      }
      /* the same state begun again (the gold shows a Prai already shown), or a lesson's hold let go while the state goes
         on: the stand so far is logged as it was, and its clock starts again */
      function restart(st, p, newHold) {
        const L = st.log, key = p.st + (p.hold ? '*' : '');
        if (!(p.t <= (L.dwell[key] || 0))) L.dwell[key] = p.t;
        p.t = 0; p.hold = newHold;
      }
      function setStage(st, to) {
        const L = st.log;
        if (!(st.stageT <= (L.stage[st.stage] || 0))) L.stage[st.stage] = st.stageT;
        st.stage = to; st.stageT = 0;
        st.ev.push({ e: 'stage', to });
      }
      function timed(st, what, secs) { const L = st.log.timed; if (!(secs <= (L[what] || 0))) L[what] = secs; }

      /* ------------------------------------------------------------------ the voice: one line at a time */
      function sayOnce(st, key, late) {
        if (st.said[key]) return;
        st.said[key] = 1;
        const prio = ONCE[key] === undefined ? 1 : ONCE[key];
        st.voice.q.push({ key, prio, by: st.t + (late !== undefined ? late : (prio >= 2 ? st.n.lessonLate : st.n.colourLate)) });
      }
      function voiceTick(st, io) {
        const v = st.voice, n = st.n, nd = st.cur;
        const id = nd && NEEDLINES[nd.id] && NEEDLINES[nd.id][isP(st) ? 'pho' : 'zav'] ? nd.id : '';
        if (id !== v.need) { v.need = id; v.needSince = st.t; v.needSaid = -99; }
        if (v.q.length) { let w = 0; for (let i = 0; i < v.q.length; i++) if (v.q[i].by >= st.t) v.q[w++] = v.q[i]; v.q.length = w; }
        if (st.t < v.until) return;
        let best = -1;
        for (let i = 0; i < v.q.length; i++) if (best < 0 || v.q[i].prio > v.q[best].prio) best = i;
        // the order: a need that costs him while it stands (said at once, ahead of everything, so the words always come
        // before the cost: the plan's 7.1; and while it stands nothing else begins); then a lesson's line; then praise;
        // then any other need; then the colour of the court
        const urgent = !!(id && (URGENT[id] || (st.hold > 0 && (id === 'waveLend' || id === 'waveSafe'))));   // in a hold the gold is the way out
        const due = !!id && st.t - v.needSince >= (urgent ? n.urgentAfter : n.needAfter) && st.t - v.needSaid >= n.needEvery &&
                    (urgent || st.t - v.last >= n.needCap);
        const qp = best >= 0 ? v.q[best].prio : -1;
        let key = '', fromNeed = false;
        if (urgent) {
          // while something costs him, nothing else is begun: only the words that answer it, when they are due (a lesson's
          // line waits for the moment to pass; it was a long line begun in such a moment that kept the next order unsaid)
          if (!due) return;
          const words = NEEDLINES[id][isP(st) ? 'pho' : 'zav'], c = v.count[id] || 0;
          key = words[Math.min(c, words.length - 1)]; v.count[id] = c + 1; fromNeed = true;
        } else if (qp >= 2 || (qp >= 0 && !due)) { key = v.q[best].key; v.q.splice(best, 1); }
        else if (due) {
          const words = NEEDLINES[id][isP(st) ? 'pho' : 'zav'], c = v.count[id] || 0;
          key = words[Math.min(c, words.length - 1)]; v.count[id] = c + 1; fromNeed = true;
        }
        if (!key) return;
        const secs = (io && io.secs ? +io.secs(key) : 0) || 2.5;
        v.last = st.t; v.until = st.t + secs + n.lineGap;
        if (fromNeed) v.needSaid = st.t;
        st.stats.lines++;
        st.ev.push({ e: 'say', key, need: fromNeed ? id : '' });
        if (key === 'ko5c1') sayOnce(st, 'tn5c1', 3.0);          // Ton answers Mr Koh
      }

      /* ------------------------------------------------------------------ what can be pressed, and why not (the HUD and
         the press read the same answer: a lock is said, never pressed, v21.28; no button is a lie, v14.2) */
      function why(st, act) {
        const n = st.n, P = isP(st), ph = st.pho, z = st.zav;
        if (act === 'START') return st.stage === 'brief' ? '' : 'stage';
        if (act === 'RETRY') return st.stage === 'lost' ? '' : 'stage';
        if (act === 'LEAD') return st.stage === 'lost' && st.losses >= 3 ? '' : 'stage';
        if (act === 'FILMDONE') return st.stage === 'naga' ? '' : 'stage';
        if (act === 'TOGETHER') return st.stage === 'surge' && st.stageT >= n.togetherAfter && !st.together ? '' : 'stage';
        if (st.stage !== 'learn' && st.stage !== 'fight' && st.stage !== 'last') return 'stage';
        if (st.lock > 0) return 'lock';
        if (act === 'SWITCH') return st.seen.swap && st.stage !== 'last' ? '' : 'stage';
        if (PHO_ACTS[act] && !P) return 'notYours';
        if (ZAV_ACTS[act] && P) return 'notYours';
        if (act === 'FIRE') { if (ph.wind > 0 || ph.draw > 0 || st.stage === 'last') return 'busy'; return ph.fireWait > 0 ? 'wait' : ''; }
        if (act === 'BAG') {
          if (ph.wind > 0 || ph.draw > 0 || ph.ring) return 'busy';
          if (!bagTarget(st, 0)) return 'none';
          if (st.stage === 'fight' && st.hold) return 'gold';      // they cling: only the gold takes them now
          return '';
        }
        if (act === 'SHOCKWAVE') {
          if (!st.seen.shock || st.stage !== 'fight') return 'stage';
          if (ph.wind > 0 || ph.ring || ph.draw > 0) return 'busy';
          if (ph.waveWait > 0) return 'wait';
          let any = false; for (const p of st.prai) if (onCourt(p) && p.st !== 'drawn') { any = true; break; }
          if (!any) return 'none';
          if (!st.firsts.wave) { if (!(st.cage.lent > 0)) return 'lendFirst'; if (!bubbles(st)) return 'bindFirst'; }
          return '';
        }
        if (act === 'BIND') {
          if (!st.seen.bind) return 'stage';
          if (z.bindWait > 0) return 'wait';
          if (bubbles(st) >= n.bubbleMax) return 'full';
          return bindTarget(st, 0) ? '' : 'none';
        }
        if (act === 'SMELL') { if (!st.seen.smell) return 'stage'; return z.smellWait > 0 ? 'wait' : ''; }
        if (act === 'LEND') {
          if (!st.seen.shock || st.stage !== 'fight') return 'stage';
          if (ph.wind > 0 || ph.ring) return 'busy';
          if (ph.waveWait > 0) return 'wait';
          return st.cage.lent > 0 ? 'busy' : '';
        }
        return 'stage';
      }
      function refuse(st, act, w) { st.stats.refused++; st.ev.push({ e: 'refused', act, why: w }); }

      /* ------------------------------------------------------------------ the game aims (the plan's 5.6: nothing is aimed
         by hand and nothing is timed; a tap on a Prai picks it). FIRE goes first to a bound Prai (it tires it), then to a
         Prai at him (it chases it off him), then to one at the cage's bars, then to one on its way; a Prai that slips
         the fire, last of all */
      function onFlight(st, id) { for (const f of st.flights) if (f.id === id && !f.ai) return true; return false; }
      function fireTarget(st, pick) {
        const n = st.n, ph = st.pho, z = st.zav;
        let best = null, bs = 1e9;
        for (const p of st.prai) {
          if (pick && p.id !== pick) continue;
          let r;
          if (p.st === 'bound') r = 0;
          else if (p.st === 'through' || (p.st === 'shown' && p.at === 2)) r = p.kind === 'slip' ? 9 : 1;
          else if (p.st === 'pressing') r = p.kind === 'slip' ? 9 : 2;
          else if (p.st === 'coming' || p.st === 'shown') r = p.kind === 'slip' ? 9 : 3;
          else continue;
          if (onFlight(st, p.id)) r += 20;                       // a ball already on its way to it comes last
          const dP = dist(ph.x, ph.z, p.x, p.z);
          if (dP > n.fireReach) continue;
          const s = r * 100 + (r === 0 ? dP : dist(z.x, z.z, p.x, p.z));
          if (s < bs) { bs = s; best = p; }
        }
        return best;
      }
      /* BIND holds, first, what is at him; then what presses his cage (it wears it); then a Prai shown by the smell (it
         will sink); then one that slips the fire; then a tired one whose ring is closing; then the nearest */
      function bindable(p) {
        return p.st === 'coming' || p.st === 'pressing' || p.st === 'through' || p.st === 'shown' || p.st === 'tired' || p.st === 'rushing';
      }
      function bindTarget(st, pick) {
        const n = st.n, z = st.zav;
        let best = null, bs = 1e9;
        for (const p of st.prai) {
          if (pick && p.id !== pick) continue;
          if (!bindable(p)) continue;
          const d = dist(z.x, z.z, p.x, p.z);
          if (d > n.bindReach) continue;
          let r;
          if (atHim(p)) r = 0;
          else if (p.st === 'pressing') r = 1;
          else if (p.st === 'shown') r = 2;
          else if (p.kind === 'slip' && p.st !== 'tired') r = 3;
          else if (p.st === 'tired' && p.ring < n.ringSecs / 2) r = 4;
          else if (p.st === 'rushing') r = 5;
          else if (p.st === 'tired') r = 6;
          else r = 7;
          const s = r * 100 + d;
          if (s < bs) { bs = s; best = p; }
        }
        return best;
      }
      function bagTarget(st, pick) {
        const n = st.n, ph = st.pho;
        let best = null, bs = 1e9;
        for (const p of st.prai) {
          if (pick && p.id !== pick) continue;
          if (p.st !== 'tired' && p.st !== 'held' && p.st !== 'laid') continue;
          const d = dist(ph.x, ph.z, p.x, p.z);
          if (d > n.bagReach) continue;
          if (d < bs) { bs = d; best = p; }
        }
        return best;
      }

      /* ------------------------------------------------------------------ the acts */
      function doAct(st, act, input) {
        const w = why(st, act);
        if (w) {
          refuse(st, act, w);
          if (w === 'full' && st.stage === 'fight') sayOnce(st, 'ph5fj');   // the first BIND his hands cannot make is told, once
          return;
        }
        const n = st.n, ph = st.pho, z = st.zav;
        switch (act) {
          case 'START': begin(st); return;
          case 'RETRY': case 'LEAD': beginFight(st, act === 'LEAD'); return;
          case 'FILMDONE': layThree(st); return;
          case 'TOGETHER': st.together = n.togetherSecs; st.ev.push({ e: 'together' }); return;
          case 'SWITCH':
            st.who = isP(st) ? 'zavier' : 'pho'; st.lock = n.switchLock; st.lockUntil = st.t + n.switchLock; st.stats.switches++;
            if (!isP(st)) { st.seen.bind = true; st.seen.smell = true; }   // his two buttons, the first time he is played
            st.ev.push({ e: 'switch', to: st.who });
            return;
          case 'FIRE': {
            ph.fireWait = n.fireWait; st.stats.fires++;
            let target = null, cloud = 0;
            if (input && input.pickCloud) { for (const c of st.clouds) if (c.id === input.pickCloud) cloud = c.id; }
            if (!cloud) target = (input && input.pick ? fireTarget(st, input.pick) : null) || fireTarget(st, 0);
            const f = { id: target ? target.id : 0, cloud, t: n.flight, ai: false, x: 0, z: 0 };
            if (target) { f.x = target.x; f.z = target.z; }
            else if (cloud) { for (const c of st.clouds) if (c.id === cloud) { f.x = c.x; f.z = c.z; } }
            else { f.x = ph.x * 0.5; f.z = ph.z - 2.2; }       // nothing to aim at: it rises and falls on the open paving
            st.flights.push(f);
            st.ev.push({ e: 'fireball', id: f.id, x: f.x, z: f.z, ai: false });
            if (st.stats.fires === 1) sayOnce(st, 'ko5c1', 8.0);
            return;
          }
          case 'BAG': {
            const p = (input && input.pick ? bagTarget(st, input.pick) : null) || bagTarget(st, 0);
            setSt(st, p, 'drawn', 'bag'); p.hold = ''; ph.draw = n.bagSecs; st.stats.bags++;
            st.ev.push({ e: 'bag', id: p.id });
            return;
          }
          case 'SHOCKWAVE':
            ph.wind = n.windSecs; st.stats.waves++;
            if (st.cage.lent > 0) st.cage.lent = Math.max(st.cage.lent, n.windSecs + n.ringMax / n.ringSpeed + n.lendAfter);   // it stands until the gold is out
            st.ev.push({ e: 'windup' });
            for (const p of st.prai) if (seenFree(p)) { p.was = p.st; p.stop = 0; setSt(st, p, 'rushing', 'the gold gathers'); }
            return;
          case 'BIND': {
            if (input && input.pickCloud) {                     // a bubble closed on a stale cloud holds nothing
              let hit = false; for (const c of st.clouds) if (c.id === input.pickCloud) hit = true;
              if (hit) { z.bindWait = n.bindWait; st.stats.stale++; st.ev.push({ e: 'bind', id: 0, stale: true }); sayOnce(st, 'q5c3'); return; }
            }
            const p = (input && input.pick ? bindTarget(st, input.pick) : null) || bindTarget(st, 0);
            z.bindWait = n.bindWait; st.stats.binds++;
            const lessonShown = p.hold === 'show';
            p.stop = 0; p.bub = n.bubbleSecs; p.stood = 0;
            setSt(st, p, p.st === 'tired' ? 'held' : 'bound', 'bind');
            p.hold = st.stage === 'learn' ? 'keep' : st.lesson.wave === 'pending' ? 'grace' : '';
            if (lessonShown) sayOnce(st, 'ph5g4');
            st.ev.push({ e: 'bind', id: p.id });
            if (st.stats.binds === 1) sayOnce(st, 'q5c5');
            return;
          }
          case 'SMELL': {
            z.smellWait = n.smellWait; st.stats.smells++;
            let k = 0;
            for (const p of st.prai) if (p.st === 'hidden' || p.st === 'beneath') {
              p.show = n.showSecs; if (p.hold === 'hide') p.hold = 'show';
              setSt(st, p, 'shown', 'smell'); k++;
            }
            st.ev.push({ e: 'smell', found: k });
            if (!k && st.stage === 'fight') {                       // opened for nothing, he draws them on: faster and harder, a while
              st.drawT = n.drawSecs; st.ev.push({ e: 'drawn', secs: n.drawSecs });
              sayOnce(st, 'ph5fg');                                 // "Do not open yourself for nothing. They feel it."
            }
            return;
          }
          case 'LEND':
            st.cage.lent = n.lendSecs; st.stats.lends++;
            for (const p of st.prai) if (p.st === 'pressing') { p.gath = n.gather; p.at = 2; setSt(st, p, 'through', 'the cage is lent'); }
            st.ev.push({ e: 'lend' });
            return;
        }
      }

      /* ------------------------------------------------------------------ the stages */
      function enter(st, p, x, z, newHold) {
        p.x = x; p.z = z; clampPrai(st.n, p); p.hold = newHold || ''; p.stop = 0; p.at = 0; p.lurk = 0;
        setSt(st, p, 'entering', 'its turn');
        st.lastEntry = st.stageT;
        st.ev.push({ e: 'enter', id: p.id, kind: p.kind });
      }
      function begin(st) {                                       // START: the lesson, on one Prai
        const n = st.n;
        if (st.sanity < n.floor) { st.sanity = n.floor; st.raised = true; st.ev.push({ e: 'sanity', to: n.floor }); sayOnce(st, 'ph5l2'); }
        st.open = st.sanity;
        setStage(st, 'learn');
        sayOnce(st, 'q5c0'); sayOnce(st, 'ph5f0'); sayOnce(st, 'tn5c0', 14.0);
        enter(st, st.prai[0], n.lessonAt[0], n.lessonAt[1], 'stand');
      }
      function beginFight(st, lead) {                            // stage 3: from the lesson, or begun again after a loss
        const n = st.n, fromLoss = st.stage === 'lost';
        setStage(st, 'fight');
        for (let i = 0; i < 8; i++) { const p = fresh(2 + i, n.kinds3[i]); p.due = n.due3[i]; st.prai[1 + i] = p; }
        st.left = 8; st.lead = !!lead;
        st.cage.str = n.cageMax; st.cage.broken = false; st.cage.lent = 0;
        st.flights.length = 0; st.clouds.length = 0; st.lastEntry = -99; st.drawT = 0; st.goldAt = -1;   // (a breath taken for nothing in the lost fight is not carried into the next)
        const ph = st.pho, z = st.zav;
        ph.wind = 0; ph.ring = null; ph.draw = 0; ph.fireWait = 0; ph.aiWait = n.aiFireWait;
        ph.waveWait = n.waveWait; z.bindWait = 0; z.smellWait = 0;
        st.lesson.wave = st.firsts.wave ? 'done' : ''; st.hold = 0; st.holdsDone = 0;
        if (fromLoss) {
          st.sanity = st.open; st.ev.push({ e: 'sanity', to: st.open });
          st.who = 'pho'; st.lock = 0; st.lockUntil = 0;
          ph.x = n.phoAt[0]; ph.z = n.phoAt[1]; z.x = n.zavAt[0]; z.z = n.zavAt[1];
          st.voice.q.length = 0; st.voice.until = 0; st.voice.need = ''; st.voice.count = {};
        } else sayOnce(st, 'ph5fc');
      }
      function lose(st) {
        setStage(st, 'lost'); st.losses++;
        st.voice.q.length = 0; st.voice.until = 0;
        st.ev.push({ e: 'lost', losses: st.losses });
        st.ev.push({ e: 'say', key: ONLOSS, need: '' });
      }
      function surge(st) {                                       // stage 4: the last three draw together over him
        setStage(st, 'surge');
        st.preSurge = st.sanity;
        const ph = st.pho;
        ph.wind = 0; ph.ring = null; ph.draw = 0; st.cage.lent = 0; st.flights.length = 0; st.clouds.length = 0; st.lock = 0; st.lockUntil = 0; st.drawT = 0;
        for (const p of st.prai) if (p.st !== 'gathered') {
          setSt(st, p, 'shape', 'the surge');
          p.hold = ''; p.bub = 0; p.show = 0; p.stop = 0; p.at = 0; p.gath = 0; p.x = st.zav.x; p.z = st.zav.z - 0.2;
        }
        st.voice.q.length = 0;
        sayOnce(st, 'q5c2'); sayOnce(st, 'ju5c2', 6.0);
        st.ev.push({ e: 'surge' });
      }
      function layThree(st) {                                    // the Naga's film is over: stage 6
        const n = st.n;
        let i = 0;
        for (const p of st.prai) if (p.st === 'shape') {
          const at = n.laidAt[Math.min(i++, n.laidAt.length - 1)];
          p.x = at[0]; p.z = at[1]; setSt(st, p, 'laid', 'the Naga lays it down');
        }
        st.sanity = Math.max(st.sanity, st.preSurge);             // what the surge pressed out of him comes back
        st.ev.push({ e: 'sanity', to: st.sanity });
        st.who = 'pho'; st.lock = 0; st.lockUntil = 0;
        st.pho.x = n.phoAt[0]; st.pho.z = n.phoAt[1]; st.zav.x = n.zavAt[0]; st.zav.z = n.zavAt[1];   // where the film left them
        setStage(st, 'last');
        sayOnce(st, 'ph5c1'); sayOnce(st, 'ph5c3');
      }

      const ph0 = (st) => st.pho;
      function stageTick(st, dt, io) {
        const n = st.n;
        if (st.stage === 'learn') {
          if (st.prai[0].st === 'gathered') beginFight(st, false);
        } else if (st.stage === 'fight') {
          // the next one comes: in its order, at its time, while fewer than freeMax are free; and never a court left empty
          let freeN = 0, present = 0, next = null;
          for (const p of st.prai) { if (free(p)) freeN++; if (onCourt(p) && p.id > 1) present++; if (!next && p.st === 'waiting' && p.id > 1) next = p; }
          if (next) {
            if (present === 0 && next.due > st.stageT + n.breather) next.due = st.stageT + n.breather;
            let cap = 1; for (const [at, k] of n.freeAt) if (st.stageT >= at) cap = k;
            if (st.stageT >= next.due && freeN < (st.lead ? n.leadMax : cap) && st.stageT - st.lastEntry >= n.entryGap) {
              const at = n.entryAt[(next.id - 2) % n.entryAt.length], j = n.entryJitter;
              const r1 = io && io.rand ? io.rand() : 0.5, r2 = io && io.rand ? io.rand() : 0.5;
              enter(st, next, at[0] + (r1 - 0.5) * 2 * j, at[1] + (r2 - 0.5) * j);
            }
          }
          // a hold begins: at six left, and at four (each once a fight)
          if (!st.hold && st.holdsDone < n.holdAt.length && st.left <= n.holdAt[st.holdsDone] && st.left > 3) {
            st.hold = st.holdsDone + 1; st.seen.shock = true;
            if (!(ph0(st).wind > 0) && !ph0(st).ring) ph0(st).waveWait = n.holdSecs;
            st.ev.push({ e: 'hold', n: st.hold, secs: ph0(st).waveWait });
            sayOnce(st, st.hold === n.holdAt.length ? 'ph5fh' : 'ph5fi', n.holdLate);   // the last hold, or the first
          }
          // the golden shockwave is taught the first time it is ready (in the first hold, or its own wait run out)
          if (!st.firsts.wave && !st.lesson.wave && st.pho.waveWait <= 0) {
            st.lesson.wave = 'pending'; st.pho.waveWait = 0; st.seen.shock = true;
            for (const p of st.prai) if ((p.st === 'bound' || p.st === 'held') && !p.hold) restart(st, p, 'grace');
            st.ev.push({ e: 'waveReady', first: true });
          }
          if (st.left <= 3) surge(st);
        } else if (st.stage === 'surge') {
          if (st.preSurge > n.surgeTo && st.stageT <= n.surgeSecs + dt) {
            st.sanity = Math.max(n.surgeTo, st.sanity - (st.preSurge - n.surgeTo) / n.surgeSecs * dt);
          }
          if (st.together > 0) {
            timed(st, 'fill', n.togetherSecs - st.together + dt);
            st.together -= dt;
            if (st.together <= 0) { st.together = 0; setStage(st, 'naga'); st.film = 0; st.ev.push({ e: 'naga' }); }
          }
        } else if (st.stage === 'naga') {
          st.film += dt; timed(st, 'naga', st.film);
          if (st.film >= n.filmGuard) layThree(st);               // a film that never says it ended cannot hold the fight
        } else if (st.stage === 'last') {
          if (st.left <= 0) { setStage(st, 'won'); st.stats.length = st.t; st.ev.push({ e: 'won', sanity: st.sanity }); }
        }
      }

      /* ------------------------------------------------------------------ the bodies */
      function moveBody(st, b, other, speed, mx, mz, dt) {
        const n = st.n;
        let m = Math.sqrt(mx * mx + mz * mz);
        if (!(m > 0.05)) return;
        if (m > 1) { mx /= m; mz /= m; m = 1; }
        const ox = b.x, oz = b.z;
        b.x += mx * speed * dt; b.z += mz * speed * dt;
        clampBody(n, b);
        let dx = b.x - other.x, dz = b.z - other.z, d = Math.sqrt(dx * dx + dz * dz);
        if (d < n.apart) {                                        // he slides round his student's cage, never through it
          if (d < 1e-6) { dx = ox - other.x; dz = oz - other.z; d = Math.sqrt(dx * dx + dz * dz) || 1; }
          b.x = other.x + dx / d * n.apart; b.z = other.z + dz / d * n.apart;
          clampBody(n, b);
          if (dist(b.x, b.z, other.x, other.z) < n.apart - 1e-6) { b.x = ox; b.z = oz; }
        }
      }
      function aiTick(st, dt) {
        const n = st.n, ph = st.pho, z = st.zav;
        if (!isP(st)) {
          // Grandmaster Pho, left alone, keeps the far ones back: now and then a fireball that sets a Prai on its way back a
          // step. It never chases one away (that sends it into hiding: his student's work), never tires one, never bags,
          // never the gold (the plan's 5.7); and he stays beside his student
          ph.aiWait -= dt;
          if (ph.aiWait <= 0 && ph.wind <= 0 && ph.draw <= 0 && st.stage === 'fight') {
            let best = null, bs = 1e9;
            for (const p of st.prai) {
              if (!((p.st === 'coming' || p.st === 'shown') && p.at === 0 && p.kind !== 'slip' && p.stop <= 0)) continue;
              if (dist(ph.x, ph.z, p.x, p.z) > n.fireReach) continue;
              const d = dist(z.x, z.z, p.x, p.z);
              if (d < bs) { bs = d; best = p; }
            }
            if (best) {
              ph.aiWait = n.aiFireWait;
              st.flights.push({ id: best.id, cloud: 0, t: n.flight, ai: true, x: best.x, z: best.z });
              st.ev.push({ e: 'fireball', id: best.id, x: best.x, z: best.z, ai: true });
            }
          }
          if (ph.wind <= 0 && ph.draw <= 0 && dist(ph.x, ph.z, z.x, z.z) > n.aiFar) {
            const hx = z.x + n.aiHome[0], hz = z.z + n.aiHome[1], dx = hx - ph.x, dz = hz - ph.z, d = Math.sqrt(dx * dx + dz * dz);
            if (d > 0.1) moveBody(st, ph, z, n.phoWalk, dx / d, dz / d, dt);
          }
          z.look = 0;
        } else {
          // Master Zavier, left alone: the cage and the murmur go on; his head turns toward a Prai that has hidden
          let best = 0, bs = 1e9;
          for (const p of st.prai) if (p.st === 'hidden' || p.st === 'beneath') { const d = dist(z.x, z.z, p.x, p.z); if (d < bs) { bs = d; best = p.id; } }
          z.look = best;
        }
      }

      /* ------------------------------------------------------------------ the fire in the air, the gold, the ring */
      function pushBack(st, p, by, stop) {
        const z = st.zav, dx = p.x - z.x, dz = p.z - z.z, d = Math.sqrt(dx * dx + dz * dz) || 1;
        p.x += dx / d * by; p.z += dz / d * by; clampPrai(st.n, p);
        p.stop = stop;
      }
      function chase(st, p) {                                    // chased away: it flees to the far side, and sinks there
        const n = st.n, z = st.zav;
        const dx = p.x - z.x, dz = p.z - z.z, d = Math.sqrt(dx * dx + dz * dz) || 1;
        p.fx = Math.max(-(n.courtX - n.praiIn), Math.min(n.courtX - n.praiIn, p.x + dx / d * 1.2));
        p.fz = n.throwZ;
        p.stop = 0; p.at = 0; p.gath = 0; p.show = 0;
        setSt(st, p, 'fleeing', 'the fire chases it away');
        st.stats.chased++;
        if (st.stage === 'learn') st.seen.swap = true;          // the switch appears the moment the lesson first needs it
      }
      function land(st, f) {
        const n = st.n;
        if (f.cloud) { st.stats.stale++; st.ev.push({ e: 'land', id: 0, result: 'stale', x: f.x, z: f.z }); sayOnce(st, 'q5c3'); return; }
        const p = f.id ? st.prai[f.id - 1] : null;
        let result = 'empty';
        if (p && f.ai) {
          if ((p.st === 'coming' || p.st === 'shown') && p.at === 0) { pushBack(st, p, n.push, n.stopSecs); result = 'setback'; }
        } else if (p) {
          if (p.st === 'bound') {                                 // it cannot run: the fire tires it
            p.ring = n.ringSecs; setSt(st, p, 'held', 'fire on a bound one'); result = 'tired';
            if (st.stage === 'learn') sayOnce(st, 'ph5fa');
            else if (!st.firsts.boundFire) { st.firsts.boundFire = true; sayOnce(st, 'ph5g2'); }
          } else if (p.kind === 'slip' && (p.st === 'coming' || p.st === 'pressing' || p.st === 'through' || p.st === 'shown')) {
            result = 'slipped'; st.stats.slipped++;
          } else if (p.st === 'coming' || p.st === 'pressing' || p.st === 'through' || p.st === 'shown') {
            chase(st, p); result = 'chased';
            if (st.stage === 'learn') sayOnce(st, 'ph5f2');
          }
        }
        st.ev.push({ e: 'land', id: f.id, result, x: f.x, z: f.z });
      }
      function flightsTick(st, dt) {
        let w = 0;
        for (let i = 0; i < st.flights.length; i++) {
          const f = st.flights[i];
          f.t -= dt;
          if (f.t <= 0) land(st, f); else st.flights[w++] = f;
        }
        st.flights.length = w;
      }
      function windTick(st, dt) {
        const n = st.n, ph = st.pho;
        if (!(ph.wind > 0)) return;
        const lent = st.cage.lent > 0;
        timed(st, 'wind', n.windSecs - ph.wind + dt);
        ph.wind -= dt;
        let broken = false;
        for (const p of st.prai) {
          if (p.st !== 'rushing') continue;
          const dx = ph.x - p.x, dz = ph.z - p.z, d = Math.sqrt(dx * dx + dz * dz) || 1;
          const stopAt = lent ? n.pressR : n.breakDist * 0.5;
          const stp = Math.min(n.rush * dt, Math.max(0, d - stopAt));
          p.x += dx / d * stp; p.z += dz / d * stp; clampPrai(n, p);
          if (!lent && d - stp <= n.breakDist) broken = true;
        }
        if (broken) {
          ph.wind = 0; ph.waveWait = st.hold ? Math.min(n.waveBroken, n.holdRetry) : n.waveBroken; st.stats.broken++;
          for (const p of st.prai) if (p.st === 'rushing') { setSt(st, p, p.was === 'shown' ? (p.show > 0 ? 'shown' : 'hidden') : 'coming', 'the gold broke'); p.at = 0; }
          st.ev.push({ e: 'broken' });
          st.said.ph5fe = 0; sayOnce(st, 'ph5fe');               // (said each time it happens)
        } else if (ph.wind <= 0) {
          ph.wind = 0; ph.waveWait = st.hold ? n.holdRetry : n.waveWait;
          ph.ring = { r: 0, x: ph.x, z: ph.z, touched: 0, gathered: 0 };
          for (const p of st.prai) if (p.st === 'rushing') { ph.ring.touched |= 1 << p.id; throwBack(st, p, ph.ring); }   // crowded round him: the ring's first instant
          st.ev.push({ e: 'wave', x: ph.x, z: ph.z });
          if (!st.firsts.waveOut) { st.firsts.waveOut = true; sayOnce(st, 'ju5c1', 5.0); }
        }
      }
      /* the ring drives a free Prai back to the far side and stills it there; what was under the paving it shows */
      function throwBack(st, p, circle) {
        const n = st.n, under = p.st === 'hidden' || p.st === 'beneath' || p.st === 'shown' || (p.st === 'rushing' && p.was === 'shown');
        p.x = Math.max(-(n.courtX - n.praiIn), Math.min(n.courtX - n.praiIn, p.x + (p.x - circle.x) * 0.5));
        p.z = n.throwZ; clampPrai(n, p); p.stop = n.throwStop; p.at = 0; p.gath = 0; p.lurk = 0;
        if (under) { p.show = n.showSecs; if (p.st === 'shown') restart(st, p, p.hold); else setSt(st, p, 'shown', 'the gold shows it'); }
        else setSt(st, p, 'coming', 'the gold drives it back');
      }
      function ringTick(st, dt) {
        const n = st.n, ph = st.pho, circle = ph.ring;
        if (!circle) return;
        circle.r += n.ringSpeed * dt;
        let took = false;                                         // the count falls by one a step: a second one the ring has
        for (const p of st.prai) {                                // reached is gathered on the next (one mark, one note, at a time)
          const bit = 1 << p.id;
          if (circle.touched & bit) continue;
          if (p.st === 'waiting' || p.st === 'gathered' || p.st === 'drawn' || p.st === 'entering' || p.st === 'fleeing' || p.st === 'shape' || p.st === 'laid' || p.st === 'tired') continue;
          if (dist(circle.x, circle.z, p.x, p.z) > circle.r) continue;
          if (took && (p.st === 'bound' || p.st === 'held')) continue;
          circle.touched |= bit;
          if (p.st === 'bound' || p.st === 'held') {
            // gathered at once: never past the three the surge waits on, and never the count jumped (the plan's 5.5)
            if (st.stage === 'fight' && st.left - 1 < 3) { if (p.st === 'bound') { p.ring = n.ringSecs; setSt(st, p, 'held', 'the gold'); } continue; }
            setSt(st, p, 'gathered', 'the gold'); p.hold = ''; st.left--; circle.gathered++; st.stats.byWave++; took = true;
            st.ev.push({ e: 'gathered', id: p.id, by: 'wave', left: st.left });
            leftLines(st);
          } else throwBack(st, p, circle);
        }
        if (circle.r >= n.ringMax && !took) {                     // (it goes out only once a step has taken nothing more)
          ph.ring = null;
          if (st.cage.lent > n.lendAfter) st.cage.lent = n.lendAfter;
          if (!st.firsts.wave) {
            st.firsts.wave = true; st.lesson.wave = 'done';
            for (const p of st.prai) if (p.hold === 'grace') restart(st, p, '');
            sayOnce(st, 'ph5f10');
            if (circle.gathered) sayOnce(st, 'ph5g3');
            sayOnce(st, 'q5c4', 14.0);                             // his thought on the first lend, in the relief after the gold
          }
          st.ev.push({ e: 'waveDone', gathered: circle.gathered });
          if (st.hold && st.hold < n.holdAt.length && st.left < n.holdAt[st.hold - 1]) {
            st.holdsDone = st.hold; st.hold = 0; ph.waveWait = n.waveWait;        // the bag opens again; the gold's long wait
            st.ev.push({ e: 'holdEnd' });
          }
        }
      }

      /* ------------------------------------------------------------------ the Prai */
      function towardHim(st, p, pace, stopAt, dt, weave) {
        const z = st.zav, dx = z.x - p.x, dz = z.z - p.z, d = Math.sqrt(dx * dx + dz * dz) || 1e-6;
        if (d <= stopAt + 1e-6) return true;
        const stp = Math.min(pace * dt, d - stopAt);
        p.x += dx / d * stp; p.z += dz / d * stp;
        if (weave) { p.ph += dt; const s = Math.sin(p.ph * 2 * Math.PI / st.n.weaveSecs) * weave * dt; p.x += -dz / d * s; p.z += dx / d * s; }
        clampPrai(st.n, p);
        return dist(z.x, z.z, p.x, p.z) <= stopAt + 1e-3;
      }
      function praiTick(st, dt) {
        const n = st.n, z = st.zav, cage = st.cage, lent = cage.lent > 0, holds = !cage.broken && !lent;
        // a bubble does not run down while the cage is lent, nor while the gold is gathered and goes out, nor, in a hold,
        // for goldGrace seconds from the moment the gold is ready (a bubble never ends in the instant the gold is asked
        // for). In all, a bubble stands still stillMax seconds at most, however often the cage is lent or the gold made
        // ready (a cage lent and lent again, the gold never loosed, had held one bubble 36 s), so a bubble is still a
        // timed thing with a longest stand: bubbleLongest
        const ph = st.pho, goldNow = st.hold > 0 && ph.waveWait <= 0 && !(ph.wind > 0) && !ph.ring;
        if (!goldNow) st.goldAt = -1; else if (!(st.goldAt >= 0)) st.goldAt = st.t;
        const still = lent || ph.wind > 0 || !!ph.ring || (goldNow && st.t - st.goldAt < n.goldGrace);
        const drawn = (st.drawT > 0 ? n.drawPace : 1) * (st.hold ? n.holdPace : 1);   // his senses opened wide draw them on; the gathering gold weighs on them
        let pressing = 0;
        for (const p of st.prai) if (p.st === 'pressing') pressing++;
        for (const p of st.prai) {
          p.t += dt;
          switch (p.st) {
            case 'entering':
              if (p.t >= n.enterSecs) { setSt(st, p, 'coming', 'risen'); if (p.kind === 'hide') p.hideIn = n.hideAfter; }
              break;
            case 'coming': {
              if (p.stop > 0) { p.stop -= dt; break; }
              if (p.hold === 'stand') break;                        // the lesson's Prai strains where it stands
              if (p.kind === 'hide') {
                p.hideIn -= dt;
                if (p.hideIn <= 0) { p.at = 0; p.lurk = 0; setSt(st, p, 'hidden', 'it sinks into the paving'); break; }
              }
              const pace = (p.kind === 'slip' ? n.paceSlip : p.kind === 'hide' ? n.paceHide : n.paceCome) * drawn;
              const wv = p.kind === 'slip' ? n.weave : 0;
              if (!holds) { if (towardHim(st, p, pace, n.himR, dt, wv)) { p.gath = n.gather; p.at = 2; setSt(st, p, 'through', lent ? 'the cage is lent' : 'the cage is broken'); } break; }
              const d = dist(z.x, z.z, p.x, p.z);
              if (pressing >= n.pressMax && d <= n.waitR + 0.05) break;                // three at the bars: the rest wait, in view
              if (towardHim(st, p, pace, n.pressR, dt, wv) && pressing < n.pressMax) { p.at = 1; pressing++; setSt(st, p, 'pressing', 'at the bars'); }
              break;
            }
            case 'pressing':
              break;                                              // (it wears the cage: cageTick)
            case 'through':
              towardHim(st, p, 1.0, n.himR, dt, 0);
              if (p.gath > 0) { p.gath -= dt; if (p.gath <= 0) st.ev.push({ e: 'reach', id: p.id }); }
              break;
            case 'fleeing': {
              const dx = p.fx - p.x, dz = p.fz - p.z, d = Math.sqrt(dx * dx + dz * dz);
              if (d > 1e-3) { const stp = Math.min(n.fleePace * dt, d); p.x += dx / d * stp; p.z += dz / d * stp; clampPrai(n, p); }
              if (p.t >= n.fleeSecs) {
                p.lurk = n.lurkSecs;
                if (st.stage === 'learn') p.hold = 'hide';            // the lesson's Prai waits there for his first SMELL
                setSt(st, p, 'hidden', 'it sinks where it fled');
              }
              break;
            }
            case 'hidden':
              if (p.hold === 'hide') break;
              if (p.lurk > 0) { p.lurk -= dt; break; }
              if (towardHim(st, p, n.paceHidden * drawn, n.himR, dt, 0)) { p.gath = n.gather; p.at = 2; setSt(st, p, 'beneath', 'under him'); }
              break;
            case 'beneath':
              if (p.gath > 0) { p.gath -= dt; if (p.gath <= 0) st.ev.push({ e: 'reach', id: p.id }); }
              break;
            case 'shown':
              if (p.hold !== 'show') p.show -= dt;
              if (p.stop > 0) p.stop -= dt;
              else if (p.hold !== 'show' && p.at !== 2 && !(p.lurk > 0)) { if (towardHim(st, p, n.paceHidden * drawn, n.himR, dt, 0)) { p.at = 2; p.gath = n.gather; } }
              else if (p.lurk > 0) p.lurk -= dt;
              if (p.at === 2 && p.gath > 0) { p.gath -= dt; if (p.gath <= 0) st.ev.push({ e: 'reach', id: p.id }); }
              if (p.show <= 0) {
                st.clouds.push({ id: st.nextCloud++, x: p.x, z: p.z, t: n.staleSecs });   // the smell stays where it was
                setSt(st, p, p.at === 2 ? 'beneath' : 'hidden', 'the smell thins');
              }
              break;
            case 'bound':
              if (p.hold !== 'keep' && p.hold !== 'grace') {
                if (still && p.stood + dt <= n.stillMax + 1e-9) p.stood += dt;
                else { p.bub -= dt; if (p.bub <= 0) { p.bub = 0; unbind(st, p); } }
              }
              break;
            case 'held':
              if (p.hold !== 'keep' && p.hold !== 'grace') {
                if (still && p.stood + dt <= n.stillMax + 1e-9) p.stood += dt;
                else { p.bub -= dt; if (p.bub <= 0) { p.bub = 0; setSt(st, p, 'tired', 'the bubble ends'); p.hold = ''; } }
              }
              break;
            case 'tired':
              p.ring -= dt;
              if (p.ring <= 0) {                                    // it rises again, and slips away into the paving
                p.ring = 0; p.at = 0; p.lurk = 0; st.stats.rose++;
                setSt(st, p, 'hidden', 'it rises again');
                st.ev.push({ e: 'rise', id: p.id });
                if (st.stats.rose === 1) sayOnce(st, 'ph5ne1');
              }
              break;
            case 'drawn':
              if (p.t >= n.bagSecs) {
                setSt(st, p, 'gathered', 'into the bag'); st.left--; st.pho.draw = 0;
                st.ev.push({ e: 'gathered', id: p.id, by: 'bag', left: st.left });
                leftLines(st);
              }
              break;
          }
        }
        // the stale clouds thin and go
        if (st.clouds.length) { let w = 0; for (const c of st.clouds) { c.t -= dt; if (c.t > 0) st.clouds[w++] = c; } st.clouds.length = w; }
      }
      function unbind(st, p) {
        p.at = 0;
        if (p.kind === 'hide') { st.clouds.push({ id: st.nextCloud++, x: p.x, z: p.z, t: st.n.staleSecs }); p.lurk = 0; setSt(st, p, 'hidden', 'the bubble ends: it slips under'); }
        else setSt(st, p, 'coming', 'the bubble ends');
        p.hold = '';
        st.ev.push({ e: 'unbind', id: p.id });
      }
      function leftLines(st) {
        if (st.stage === 'learn') sayOnce(st, 'ph5g1');
        if (st.stage === 'fight' && st.left === 5) sayOnce(st, 'q5c1');
        if (st.stage === 'last' && st.left === 0) sayOnce(st, 'ph5c4');
      }

      /* ------------------------------------------------------------------ the cage, and his sanity */
      function cageTick(st, dt) {
        const n = st.n, c = st.cage;
        if (c.lent > 0) {
          timed(st, 'lend', n.lendSecs - c.lent + dt);
          c.lent -= dt;
          if (c.lent <= 0) { c.lent = 0; st.ev.push({ e: 'lendEnd' }); }
          return;                                                 // round his teacher it is neither worn nor mended
        }
        let pressing = 0, busy = false;
        for (const p of st.prai) { if (p.st === 'pressing') pressing++; if (p.st === 'pressing' || atHim(p)) busy = true; }
        if (!c.broken && pressing) {
          c.str -= n.wear * pressing * dt * (st.drawT > 0 ? n.drawWear : 1);
          if (c.str <= 0) {
            c.str = 0; c.broken = true; st.stats.breaks++;
            for (const p of st.prai) if (p.st === 'pressing') { p.gath = n.gather; p.at = 2; setSt(st, p, 'through', 'the cage breaks'); }
            st.ev.push({ e: 'cageBreak' });
          }
        } else if (!busy && c.str < n.cageMax) {
          c.str = Math.min(n.cageMax, c.str + n.mend * dt);
          if (c.broken && c.str >= n.whole) { c.broken = false; st.ev.push({ e: 'cageWhole' }); }
        }
        if (c.str < 25 && st.stage === 'fight') sayOnce(st, 'tn5c2', 5.0);
      }
      function sanityTick(st, dt) {
        const n = st.n;
        if (st.stage !== 'fight') return;
        let k = 0;
        for (const p of st.prai) if (atHim(p) && p.gath <= 0) k++;
        if (!k) return;
        const amt = n.drain * k * dt * (1 - st.guard);
        st.sanity -= amt; st.stats.drained += amt;
        st.ev.push({ e: 'drain', amt });
        if (st.sanity <= n.lostAt) lose(st);
      }

      /* ------------------------------------------------------------------ WHAT THE MOMENT ASKS FOR (the button that grows
         and shrinks, chapter 4's R47; the words his teacher says, the plan's 7.1). One answer for the screen and the
         voice, from what is on the screen (never a count of seconds): { id, act, target, ready, move }. `ready` false:
         the act is the right one and its wait is nearly over (its ring fills on the button); `move`: walk to the target */
      function need(st) {
        const n = st.n, P = isP(st), ph = st.pho, z = st.zav;
        const mk = (id, act, target, ready, move) => ({ id, act, target: target ? target.id : 0, ready: ready !== false, move: !!move });
        const lock = st.lock > 0;
        switch (st.stage) {
          case 'brief': return mk('start', 'START');
          case 'lost': return mk('retry', 'RETRY');
          case 'won': case 'naga': return null;
          case 'surge': return st.stageT >= n.togetherAfter && !st.together ? mk('together', 'TOGETHER') : null;
          case 'last': {
            if (ph.draw > 0) return null;
            const b = bagTarget(st, 0);
            if (b) return mk('last', 'BAG', b);
            let best = null, bs = 1e9;
            for (const p of st.prai) if (p.st === 'laid') { const d = dist(ph.x, ph.z, p.x, p.z); if (d < bs) { bs = d; best = p; } }
            return best ? mk('last', 'BAG', best, false, true) : null;
          }
          case 'learn': {
            const p = st.prai[0];
            if (p.st === 'entering' || p.st === 'fleeing' || p.st === 'drawn' || p.st === 'gathered') return null;
            if (p.st === 'coming') return P ? mk('Lfire', 'FIRE', p, ph.fireWait <= 0 && !onFlight(st, p.id) && !lock) : null;
            if (p.st === 'hidden') return P ? mk('hidden', 'SWITCH', p, !lock) : mk('hidden', 'SMELL', p, z.smellWait <= 0 && !lock);
            if (p.st === 'shown') return P ? mk('shown', 'SWITCH', p, !lock) : mk('shown', 'BIND', p, z.bindWait <= 0 && !lock);
            if (p.st === 'bound') return P ? mk('bound', 'FIRE', p, ph.fireWait <= 0 && !onFlight(st, p.id) && !lock) : mk('bound', 'SWITCH', p, !lock);
            if (p.st === 'held') return P ? (ph.draw > 0 ? null : bagNeed(st, 'tired', p, mk)) : mk('tired', 'SWITCH', p, !lock);
            return null;
          }
        }
        // ---- stage 3, THE FIGHT: what is on the court, in one pass
        let aHim = null, aHimSlip = null, aBen = null, aBound = null, aTired = null, aKeep = null, aShown = null, aSlip = null,
            aHid = null, aCome = null, aPress = null, aPressCome = null, freeNear = 0, bound = 0, seenN = 0;
        for (const p of st.prai) {
          const s = p.st;
          if (s === 'bound' || s === 'held') bound++;
          if (seenFree(p)) seenN++;
          if (atHim(p) && s !== 'beneath') { if (p.kind === 'slip') { if (!aHimSlip) aHimSlip = p; } else if (!aHim || p.gath < aHim.gath) aHim = p; }
          else if (s === 'beneath') { if (!aBen) aBen = p; }
          else if (s === 'bound') { if (!onFlight(st, p.id) && (!aBound || dist(ph.x, ph.z, p.x, p.z) < dist(ph.x, ph.z, aBound.x, aBound.z))) aBound = p; }
          else if (s === 'tired' || s === 'held') {
            if (!aTired || dist(ph.x, ph.z, p.x, p.z) < dist(ph.x, ph.z, aTired.x, aTired.z)) aTired = p;
            if (s === 'tired' && p.ring < n.ringSecs / 2 && (!aKeep || p.ring < aKeep.ring)) aKeep = p;
          }
          else if (s === 'shown') { if (!aShown || p.show < aShown.show) aShown = p; }
          else if (s === 'hidden') { if (!aHid) aHid = p; }
          else if (s === 'pressing') { if (!aPress) aPress = p; if (p.kind !== 'slip' && !onFlight(st, p.id)) aPressCome = p; }
          else if (s === 'coming' && p.kind === 'slip') { if (!aSlip || dist(z.x, z.z, p.x, p.z) < dist(z.x, z.z, aSlip.x, aSlip.z)) aSlip = p; }
          else if (s === 'coming') { if (!onFlight(st, p.id) && (!aCome || dist(z.x, z.z, p.x, p.z) < dist(z.x, z.z, aCome.x, aCome.z))) aCome = p; }
          if (seenFree(p) && dist(ph.x, ph.z, p.x, p.z) - n.breakDist <= n.rush * n.windSecs) freeNear++;
        }
        const lentGo = st.cage.lent > 0 && ph.waveWait <= 0 && ph.wind <= 0 && !ph.ring;
        const waveReady = st.seen.shock && ph.waveWait <= 0 && ph.wind <= 0 && !ph.ring;
        const worth = (st.hold > 0) ? bound > 0 : (bound > 0 || seenN >= 2);   // in the hold the gold takes only what is bound
        const pending = st.lesson.wave === 'pending' || ((st.hold > 0) && waveReady && !bound);
        const full = bubbles(st) >= n.bubbleMax;
        // the gold first, the moment it is ready with something bound (the lesson's own wave aside): it gathers what is
        // bound and throws back everything else, what is at him included, so nothing else the moment holds is worth more
        const goldFirst = waveReady && bound > 0 && !st.lesson.wave.startsWith('pend');
        const fireOk = ph.fireWait <= 0, bindOk = z.bindWait <= 0 && !full, smellOk = z.smellWait <= 0;
        const bindSoon = !full && z.bindWait <= 1.5, smellSoon = z.smellWait <= 1.5;
        if (P) {
          // GRANDMASTER PHO, PLAYED: what only he can do, first (chase off what is at his student, tire the bound, bag the
          // tired, loose the gold under the lent cage); then send him to his student for what only his student can do
          if (ph.wind > 0 || ph.draw > 0) return null;           // the act in hand finishes first
          if (lentGo) return mk('waveGo', 'SHOCKWAVE');
          if (goldFirst) return freeNear ? mk('waveLend', 'SWITCH', null, !lock) : mk('waveSafe', 'SHOCKWAVE');
          if (aHim) return mk('athimF', 'FIRE', aHim, fireOk && !lock);                    // chase it off him
          if (aHimSlip && !full) return mk('athimS', 'SWITCH', aHimSlip, !lock);
          if (aBen) return mk('beneath', 'SWITCH', aBen, !lock);
          if (waveReady && bound && !st.lesson.wave.startsWith('pend')) return freeNear ? mk('waveLend', 'SWITCH', null, !lock) : mk('waveSafe', 'SHOCKWAVE');
          if (st.lesson.wave === 'pending' && bound) return mk('waveL', 'SWITCH', null, !lock);
          // (in the hold a bound Prai is left bound: still, harmless, and the gold's to gather. Fire would tire it, and a
          // tired one rises again and hides; and the bag is closed)
          if (aBound && !(st.hold > 0)) return dist(ph.x, ph.z, aBound.x, aBound.z) <= n.fireReach ? mk('bound', 'FIRE', aBound, fireOk && !lock) : mk('bound', 'FIRE', aBound, false, true);
          if (aTired && !(st.hold > 0)) return bagNeed(st, 'tired', aTired, mk);
          if (aPressCome && st.cage.str < 35) return mk('cage', 'FIRE', aPressCome, fireOk && !lock);   // the cage nearly gone: chase it off
          if (pending) return bound ? mk('waveL', 'SWITCH', null, !lock) : mk('waveB', 'SWITCH', null, !lock);
          if (aPress && !full) return mk('press', 'SWITCH', aPress, !lock);
          if (aPressCome && full) return mk('cage', 'FIRE', aPressCome, fireOk && !lock);   // his hands are full: chase it off his cage
          if (aShown && !full) return mk('shown', 'SWITCH', aShown, !lock);
          if (waveReady && worth) return freeNear ? mk('waveLend', 'SWITCH', null, !lock) : mk('waveSafe', 'SHOCKWAVE');
          if (aSlip && !full) return mk('slip', 'SWITCH', aSlip, !lock);
          if (aHid) return mk('hidden', 'SWITCH', aHid, !lock);
          if (aCome && !full) return mk('come', 'SWITCH', aCome, !lock);
          return null;
        }
        // MASTER ZAVIER, PLAYED: what is at him, what is under him, what presses his cage; what the smell has shown; the
        // golden shockwave's lesson; what hides and what slips; then back to his teacher for what only his teacher can do
        if (lentGo) return mk('waveGo', 'SWITCH', null, !lock);
        if (goldFirst && !(st.cage.lent > 0)) return mk('waveLend', 'LEND', null, !lock);
        if ((aHim || aHimSlip) && bindSoon) return mk('athimB', 'BIND', aHim || aHimSlip, bindOk && !lock);
        if (aHim) return mk('athimSw', 'SWITCH', aHim, !lock);                // his BIND is far off: his teacher's fire chases it off
        if (aHimSlip && !full) return mk('athimB', 'BIND', aHimSlip, false);   // the fire cannot touch it: his BIND, as soon as it is back
        // (three bubbles already stand: his hands are full, and what frees one is his teacher's fire and bag, below)
        if (aBen && smellSoon) return mk('beneath', 'SMELL', aBen, smellOk && !lock);
        if (waveReady && bound && !(st.cage.lent > 0)) return mk(st.lesson.wave === 'pending' ? 'waveL' : 'waveLend', 'LEND', null, !lock);   // the gold, the way out
        if (aPress && bindSoon) return mk('press', 'BIND', aPress, bindOk && !lock);
        if (aShown && (bindOk || (bindSoon && z.bindWait < aShown.show))) return mk('shown', 'BIND', aShown, bindOk && !lock);
        if (pending) {
          if (!bound) { const t = bindTarget(st, 0); if (t && bindSoon) return mk('waveB', 'BIND', t, bindOk && !lock); }
          else if (!(st.cage.lent > 0)) return mk('waveL', 'LEND', null, !lock);
        }
        if (aHid && smellSoon) return mk('hidden', 'SMELL', aHid, smellOk && !lock);
        if (aSlip && bindSoon) return mk('slip', 'BIND', aSlip, bindOk && !lock);
        if (aBound && !(st.hold > 0)) return mk('bound', 'SWITCH', aBound, !lock);
        if (aTired) {
          if (aKeep && bindOk) return mk('keep', 'BIND', aKeep, !lock);
          if (!(st.hold > 0)) return mk('tired', 'SWITCH', aTired, !lock);
        }
        if (waveReady && worth && !(st.cage.lent > 0)) return mk('waveLend', 'LEND', null, !lock);
        if (aCome && bindSoon) return mk('come', 'BIND', aCome, bindOk && !lock);
        return null;
      }
      /* (in the hold, a Prai that is not bound when the gold goes out is not gathered: the prompts above already bind what
         presses and what comes; the gold's own prompts are waveLend and waveGo) */
      function bagNeed(st, id, p, mk) {
        const n = st.n, ph = st.pho;
        const d = dist(ph.x, ph.z, p.x, p.z);
        return d <= n.bagReach ? mk(id, 'BAG', p, st.lock <= 0 && !ph.ring) : mk(id, 'BAG', p, false, true);
      }

      /* ------------------------------------------------------------------ ONE STEP OF THE FIGHT */
      const NONE = {};
      function step(st, input, dt, io) {
        st.ev.length = 0;
        const n = st.n;
        const inp = input || NONE;
        if (Number.isFinite(inp.sanity)) st.sanity = inp.sanity;   // the engine's own number, after its guards (v14.13)
        dt = Number.isFinite(dt) ? Math.max(0, Math.min(n.dtMax, dt)) : 0;
        let act = inp.act || (inp.slot ? slotAct(st, inp.slot) : '');
        if (st.stage === 'brief' || st.stage === 'lost' || st.stage === 'won') {
          if (act) doAct(st, act, inp);
          if (st.stage === 'brief' || st.stage === 'lost' || st.stage === 'won') { st.cur = need(st); return st.ev; }
          act = '';
        }
        st.t += dt; st.stageT += dt;
        // the waits run on whoever is played (the switch is rewarded: what one began goes on while the other works)
        const ph = st.pho, z = st.zav;
        if (st.lock > 0) { st.lock = st.lockUntil - st.t; if (!(st.lock > 1e-9)) st.lock = 0; timed(st, 'lock', n.switchLock - st.lock); }
        if (st.drawT > 0) st.drawT = Math.max(0, st.drawT - dt);
        if (ph.fireWait > 0) ph.fireWait = Math.max(0, ph.fireWait - dt);
        if (z.bindWait > 0) z.bindWait = Math.max(0, z.bindWait - dt);
        if (z.smellWait > 0) z.smellWait = Math.max(0, z.smellWait - dt);
        if (ph.waveWait > 0 && st.stage === 'fight' && ph.wind <= 0 && !ph.ring) ph.waveWait = Math.max(0, ph.waveWait - dt);
        if (ph.draw > 0) ph.draw = Math.max(0, ph.draw - dt);
        if (act) doAct(st, act, inp);
        // the stick moves the one he plays, by the screen (never while the gold is gathered or the bag is drawing)
        const mx = +inp.mx || 0, mz = +inp.mz || 0;
        if (mx || mz) {
          if (isP(st)) { if (ph.wind <= 0 && ph.draw <= 0) moveBody(st, ph, z, n.phoWalk, mx, mz, dt); }
          else moveBody(st, z, ph, n.zavWalk, mx, mz, dt);
          const b = isP(st) ? ph : z;
          if (b.z < -2.0 && st.stage === 'fight') sayOnce(st, 'tn5c3');   // walked to the doorway where the three stand
        }
        aiTick(st, dt);
        flightsTick(st, dt);
        windTick(st, dt);
        ringTick(st, dt);
        praiTick(st, dt);
        cageTick(st, dt);
        sanityTick(st, dt);
        if (st.stage !== 'lost') stageTick(st, dt, io);
        st.cur = need(st);
        if (st.stage !== 'lost') voiceTick(st, io);
        return st.ev;
      }
      function slotAct(st, slot) {
        if (slot === 'swap') return 'SWITCH';
        if (slot === 'together') return 'TOGETHER';
        const s = SLOT[isP(st) ? 'pho' : 'zav'];
        return s[slot] || '';
      }

      /* ------------------------------------------------------------------ THE SCREEN (the plan's 5.6): each button, its
         face, whether it is on the screen (a button with nothing behind it is not offered: v12.5; a control appears when
         it is first needed), whether it can be pressed and why not (said, never pressed: v21.28), its wait as a ring,
         and whether the moment asks for it */
      function hud(st) {
        const n = st.n, P = isP(st), nd = st.cur, ph = st.pho, z = st.zav;
        const inPlay = st.stage === 'learn' || st.stage === 'fight' || st.stage === 'last';
        const waitOf = (act) => act === 'FIRE' ? ph.fireWait / n.fireWait : act === 'BIND' ? z.bindWait / n.bindWait :
          act === 'SMELL' ? z.smellWait / n.smellWait : (act === 'SHOCKWAVE' || act === 'LEND') ? ph.waveWait / n.waveWait : 0;
        const btn = (slot, act, shown) => {
          const w = shown ? why(st, act) : 'stage';
          return { slot, act, shown: !!shown, live: !w, why: w, wait: Math.max(0, Math.min(1, waitOf(act))), pulse: !!(nd && nd.act === act) };
        };
        const s = SLOT[P ? 'pho' : 'zav'];
        return {
          stage: st.stage, who: st.who, left: st.left, sanity: st.sanity, losses: st.losses,
          cage: { str: st.cage.str / n.cageMax, broken: st.cage.broken, lent: st.cage.lent > 0 },
          objective: objectiveOf(st),
          main: btn('main', s.main, inPlay && (P ? st.stage !== 'last' : st.seen.bind)),
          second: btn('second', s.second, st.stage === 'fight' ? (P ? st.seen.shock : st.seen.smell) : (st.stage === 'learn' && !P && st.seen.smell)),
          third: btn('third', s.third, inPlay && (P ? !!bagTarget(st, 0) : (st.seen.shock && ph.waveWait <= 0 && st.stage === 'fight'))),
          swap: { slot: 'swap', act: 'SWITCH', face: P ? 'zavier' : 'pho', shown: st.seen.swap && (st.stage === 'learn' || st.stage === 'fight'),
                  live: !why(st, 'SWITCH'), why: why(st, 'SWITCH'), wait: st.lock / n.switchLock, pulse: !!(nd && nd.act === 'SWITCH') },
          together: { shown: st.stage === 'surge', live: !why(st, 'TOGETHER'), fill: st.together ? 1 - st.together / n.togetherSecs : 0 },
          retry: { shown: st.stage === 'lost', lead: st.stage === 'lost' && st.losses >= 3 },
          bubbles: bubbles(st)
        };
      }
      function objectiveOf(st) {
        // the words are the chapter's (DATA.words, the sheet's): this names which, and the count it carries
        if (st.stage === 'learn') {
          const p = st.prai[0];
          return { key: p.st === 'coming' || p.st === 'entering' ? 'objFight1' : p.st === 'hidden' || p.st === 'fleeing' ? 'objFight1b'
                       : p.st === 'shown' ? 'objFight2' : 'objFight2b' };
        }
        if (st.stage === 'fight') return st.hold ? { key: 'objFight3h' } : { key: 'objFight3', n: st.left };
        if (st.stage === 'surge') return { key: 'objFight4' };
        if (st.stage === 'last') return { key: 'objFight6' };
        return null;
      }

      return Object.freeze({ NUM, STATES, STAGES, TIMED, NEEDLINES, ONCE, ONLOSS, LINES: LINES_SAID, SLOT,
                             create, step, need, hud, why });
    })();
    /* ================================================================ THE PLAY'S OWN MACHINERY (the tracker's M7; the plan's
       4.1 the walkway, 4.3 the hunt, 4.7 the collector's table). The phases' logic, their orders and their lines are in
       c_story.js; what they stand on is here: SMELL (the chapter's own button, kit.button: the sixty-first seam) and the
       threads it shows; the two followers and their teacher walking the walkway with him; Spirit Vision's strain (chapter
       4's, as it behaved there); the stains, the nine and the three presences, each seen only through Spirit Vision.
       THE PEOPLE are the chapter's shared cast (c_cast.js: cast.pho standing, cast.phoS seated in case three, cast.ton,
       prai[0..8]; Mr Koh and Jun are the world's, b_xpeople.js): the play only places them for its own phases and moves
       them on the walkway. Every one is asked for through `castOf`, so a body that is not cast yet costs its moves and
       never the play. */
    const TOUCH5 = !!((window.matchMedia && matchMedia('(pointer: coarse)').matches) || 'ontouchstart' in window);
    const castOf = (n) => (typeof cast === 'object' && cast && cast[n] && cast[n].group) ? cast[n] : null;
    /* (the nine: c_cast.js's, as cast.prai; none until they are cast) */
    const praiOf = () => (cast && Array.isArray(cast.prai)) ? cast.prai : [];
    const _pv5 = new THREE.Vector3(), _pw5 = new THREE.Vector3(), _hv5 = new THREE.Vector3();
    /* a mark that is pressed by a tap on it on a phone (v12.5): within a share of the screen of the point or of its mark */
    const markHit5 = (posF, frac = 0.1) => function (x, y) {
      const p = posF(), r = Math.min(innerWidth, innerHeight) * frac;
      camera.updateMatrixWorld();
      const pts = [[p.x, p.y, p.z]];
      if (this && this.pos) pts.push([this.pos.x, (this.pos.y ?? 1.0) + (this.markY ?? 0.55), this.pos.z]);
      return pts.some(([px, py, pz]) => { _hv5.set(px, py, pz).project(camera);
        return _hv5.z < 1 && Math.hypot(x - (_hv5.x * 0.5 + 0.5) * innerWidth, y - (-_hv5.y * 0.5 + 0.5) * innerHeight) < r; });
    };
    const myX = () => yaw.position.x, myZ = () => yaw.position.z;
    const distTo = (x, z) => Math.hypot(yaw.position.x - x, yaw.position.z - z);
    const inCourt = (x = myX(), z = myZ(), pad = 0) => x > COURT.x0 - pad && x < COURT.x1 + pad && z > COURT.z0 - pad && z < HOUSE.face + pad;

    /* ---------------------------------------------------------------- THE WALKWAY'S ONE LINE (the plan's 4.1): where
       along it he is (`s`, metres from the lift's doors, round the one turn to his gate) and a point on it, `lat` metres
       toward the inner wall from its middle. The followers walk it in single file on the wall side; the trail runs it */
    const WAY = { turnS: 15.2, gateS: 15.2 + 8.5 };
    function wayS(x, z) { return z > -14.95 ? Math.max(0, 0.25 - z) : WAY.turnS + Math.max(0, -x); }
    function wayAt(s, lat, out) {
      if (s <= WAY.turnS) return out.set(-lat, 0, 0.25 - s);
      return out.set(-(s - WAY.turnS), 0, -14.95 + lat);
    }

    /* ================================================================ SMELL (the plan's 4.1: one press; he breathes in,
       the edges of the picture darken a little, for about three seconds dark threads drift in the air FROM where the
       smell comes, thicker where it is stronger; then he breathes out, two and a half seconds before the next. It costs
       nothing). The button is the chapter's (seam 61), in the right-hand column under the eye, a nose; N on a desktop */
    const SMELL = { threads: 3.4, fade: 0.9, gap: 2.5 };
    SMELL.cycle = SMELL.threads + SMELL.fade + SMELL.gap;
    const smell = { shown: false, t: -1, presses: 0, waitDrawn: -1, pulse: false, onPress: null };
    const noseIcon = (() => { const c = document.createElement('canvas'); c.width = c.height = 96; const x = c.getContext('2d');
      x.strokeStyle = '#f2ece0'; x.lineWidth = 6; x.lineCap = 'round'; x.lineJoin = 'round';
      x.beginPath(); x.moveTo(38, 14); x.bezierCurveTo(36, 34, 26, 50, 22, 60); x.bezierCurveTo(18, 70, 28, 76, 38, 74);
      x.bezierCurveTo(42, 80, 50, 80, 54, 74); x.stroke();
      x.lineWidth = 4.5;
      for (let i = 0; i < 3; i++) { const y0 = 34 + i * 16; x.beginPath(); x.moveTo(62, y0); x.bezierCurveTo(70, y0 - 7, 76, y0 + 7, 86, y0); x.stroke(); }
      return c; })();
    function smellButton(on, o = {}) {
      if (!kit || !kit.button) return;
      if (!on) { if (smell.shown) kit.button('smell', null); smell.shown = false; smell.pulse = false; smell.waitDrawn = -1; return; }
      if (!smell.shown) { smell.shown = true; smell.waitDrawn = -1;
        kit.button('smell', { icon: noseIcon, label: W.btnSmell, key: 'KeyN', wait: 0, pulse: false, onPress: () => { smellPress(); } }); }
      if (o.pulse !== undefined && o.pulse !== smell.pulse) { smell.pulse = !!o.pulse; kit.button('smell', { pulse: smell.pulse }); }
    }
    function smellBusy() { return smell.t >= 0 && smell.t < SMELL.cycle; }
    function smellPress() {
      if (smellBusy() || getState() !== 'play') return false;
      smell.t = 0; smell.presses++;
      if (smell.pulse) smellButton(true, { pulse: false });
      if (kit && kit.chill) kit.chill(0.3, { secs: 0.5, tint: 'sour' });
      threadsSpawn();
      if (smell.onPress) smell.onPress();
      return true;
    }
    function smellTick(wdt) {
      if (smell.t < 0) return;
      const t0 = smell.t; smell.t += wdt;
      if (t0 < SMELL.threads && smell.t >= SMELL.threads && kit && kit.chill) kit.chill(0, { secs: 1.2 });
      if (smell.t >= SMELL.cycle) smell.t = -1;
      if (smell.shown && kit && kit.button) { const w = smell.t < 0 ? 0 : 1 - smell.t / SMELL.cycle;
        if (Math.abs(w - smell.waitDrawn) > 0.012 || (w === 0 && smell.waitDrawn !== 0)) { smell.waitDrawn = w; kit.button('smell', { wait: w }); } }
    }

    /* ---------------------------------------------------------------- THE THREADS: one ribbon a thread, all of them one
       mesh drawn in one call, each a pure function of its own age (a thread flows along its line from its source, its
       tail behind it, a slow wave across it). Spawned at a press, from the places the phase smells of (smellSources) */
    const TH = { N: 170, SEG: 10 };
    const thPos = new Float32Array(TH.N * TH.SEG * 2 * 3), thCol = new Float32Array(TH.N * TH.SEG * 2 * 4);
    const thIdx = [];
    for (let t = 0; t < TH.N; t++) for (let i = 0; i < TH.SEG - 1; i++) { const a = (t * TH.SEG + i) * 2; thIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    const thGeo = new THREE.BufferGeometry();
    thGeo.setAttribute('position', new THREE.BufferAttribute(thPos, 3).setUsage(THREE.DynamicDrawUsage));
    thGeo.setAttribute('color', new THREE.BufferAttribute(thCol, 4).setUsage(THREE.DynamicDrawUsage));
    thGeo.setIndex(thIdx);
    const thMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false });
    const thMesh = new THREE.Mesh(thGeo, thMat); thMesh.frustumCulled = false; thMesh.visible = false; thMesh.renderOrder = 3; thMesh.name = 'smell threads';
    world.add(thMesh);
    const threads = [];
    let thRng = rng(28701);
    /* the colours: the true smell grey-black; the drain's brown; the pieces' smoke grey */
    const TH_COL = { dark: [0.07, 0.065, 0.06, 0.78], drain: [0.30, 0.21, 0.11, 0.62], smoke: [0.16, 0.15, 0.14, 0.62] };
    /* THE TRUE TRAIL (4.1): grey-black and long along the floor, from his court out between the gate's posts, along run 2
       and round the turn, back up run 1 toward the lift; stronger the nearer the gate */
    const TRAIL = [[0.12, 1.0], [0.12, -14.45], [-0.35, -14.92], [-8.15, -14.92], [-8.5, -14.45], [-8.5, -13.2]];
    const trailLen = []; { let L = 0; trailLen.push(0); for (let i = 1; i < TRAIL.length; i++) { L += Math.hypot(TRAIL[i][0] - TRAIL[i - 1][0], TRAIL[i][1] - TRAIL[i - 1][1]); trailLen.push(L); } }
    const TRAIL_L = trailLen[trailLen.length - 1];
    function trailAt(s, out) {
      s = Math.max(0, Math.min(TRAIL_L, s)); let i = 1; while (i < TRAIL.length - 1 && trailLen[i] < s) i++;
      const a = TRAIL[i - 1], b = TRAIL[i], k = (s - trailLen[i - 1]) / Math.max(1e-6, trailLen[i] - trailLen[i - 1]);
      return out.set(a[0] + (b[0] - a[0]) * k, 0, a[1] + (b[1] - a[1]) * k);
    }
    function trailNear(x, z) { let best = 0, bd = 1e9; for (let s = 0; s <= TRAIL_L; s += 0.25) { trailAt(s, _pw5); const d = Math.hypot(_pw5.x - x, _pw5.z - z); if (d < bd) { bd = d; best = s; } } return best; }
    const trailStrength = (s) => 0.16 + 0.84 * Math.pow(Math.max(0, Math.min(1, s / TRAIL_L)), 1.6);
    function addThread(o) { if (threads.length < TH.N) threads.push(Object.assign({ age: -(o.delay || 0), life: 2.2, w: 0.018, a: 0.05, f: 1.6, ph: thRng() * 6.28, col: TH_COL.dark }, o)); }
    /* the places this phase smells of: [{ x, y, z, k, kind, ... }] (k its strength) */
    function threadsSpawn() {
      threads.length = 0; thRng = rng(28701 + smell.presses * 7);
      const R = thRng, me = [myX(), myZ()], src = smellSources(), lean = [];
      let total = 0;
      for (const S0 of src) { S0.wt = S0.k * Math.pow(Math.max(0, 1 - Math.hypot(S0.x - me[0], S0.z - me[1]) / (S0.reach || 11)), 1.3); total += S0.wt; }
      if (phase === 'walk' && play.found.has('t') && play.found.has('j')) {
        /* the trail: threads laid where he can see them, more and darker the nearer the gate */
        const sp = trailNear(me[0], me[1]), k = trailStrength(sp + 4);
        const n = Math.round(46 + 90 * k);
        for (let i = 0; i < n; i++) {
          const s = Math.max(0.3, Math.min(TRAIL_L - 0.2, sp - 2.5 + R() * 13.5)), ks = trailStrength(s);
          if (R() > 0.35 + 0.65 * ks) continue;
          addThread({ trail: true, s0: s + 1.2, v: 0.55 + R() * 0.35, L: 1.0 + R() * 1.4 * ks, lat: (R() - 0.5) * 0.9, h: 0.03 + R() * 0.32,
                      delay: R() * 1.6, life: 1.9 + R() * 0.9, w: 0.014 + 0.02 * ks, a: 0.05 + R() * 0.06, alpha: 0.4 + 0.6 * ks });
        }
      }
      for (const S0 of src) {
        const n = Math.round(Math.min(90, S0.wt * (S0.n || 60)));
        for (let i = 0; i < n; i++) {
          const ox = S0.x + (R() - 0.5) * 2 * (S0.rx || 0.25), oz = S0.z + (R() - 0.5) * 2 * (S0.rz || 0.25), oy = (S0.y || 0) + R() * (S0.ry || 0.05);
          addThread({ O: [ox, oy, oz], D: S0.d || [0, 1, 0], v: (S0.v || 0.25) * (0.75 + R() * 0.5), L: (S0.L || 0.5) * (0.7 + R() * 0.6), delay: R() * 1.5,
                      life: (S0.life || 2.2) * (0.8 + R() * 0.4), w: (S0.w || 0.018) * (0.8 + R() * 0.5), a: S0.a == null ? 0.04 : S0.a, f: S0.f || 1.6,
                      col: S0.col || TH_COL.dark, alpha: Math.min(1, 0.45 + 0.55 * S0.k), grow: S0.grow || 0 });
        }
      }
      /* A WRONG TAP IS STILL A DIRECTION (4.3): where nothing is near, the threads about him come FROM the nearest place
         not yet found, and lean toward it */
      if (total < 0.14 && phase !== 'walk') {
        const q = nearestUnfound();
        if (q) { const dx = me[0] - q.x, dz = me[1] - q.z, L = Math.hypot(dx, dz) || 1, ux = dx / L, uz = dz / L;
          for (let i = 0; i < 34; i++) { const back = 1.2 + R() * 3.2, side = (R() - 0.5) * 2.4;
            addThread({ O: [me[0] - ux * back - uz * side, 0.15 + R() * 1.1, me[1] - uz * back + ux * side], D: [ux, 0.05, uz], v: 0.45 + R() * 0.3, L: 0.7 + R() * 0.6,
                        delay: R() * 1.4, life: 1.8 + R() * 0.6, w: 0.012, alpha: 0.45 }); } }
      }
      thMesh.visible = threads.length > 0;
    }
    function smellSources() {
      if (phase === 'walk') {
        /* the decoy (4.1): a drain's grating at the walkway's edge where water has stood; its threads brown, short, and
           staying where they are */
        return [{ x: FLOOR.DRAIN.x, y: 0.02, z: FLOOR.DRAIN.z, k: 0.8, reach: 8, n: 40, rx: 0.4, rz: 0.2, ry: 0.1, d: [0, 1, 0], v: 0.03, L: 0.22, a: 0.05, f: 2.2, col: TH_COL.drain, life: 2.4, w: 0.016 }];
      }
      if (phase === 'hunt') {
        const f = (c) => play.found.has(c) ? 0.35 : 1;
        return [
          /* under the shoe cabinet by the doors: threads pooling out from under it */
          { x: HUNT5.s1.x, y: 0.02, z: HUNT5.s1.z + 0.12, k: 0.85 * f('s1'), reach: 7, n: 55, rx: 0.32, rz: 0.12, d: [0.0, 0.18, 0.98], v: 0.22, L: 0.45, a: 0.035 },
          /* the court, at the left planter's foot: rising along it */
          { x: HUNT5.s2.x, y: 0.02, z: HUNT5.s2.z, k: 0.85 * f('s2'), reach: 9, n: 60, rx: 0.06, rz: 0.95, d: [-0.12, 0.99, 0], v: 0.26, L: 0.55, a: 0.04 },
          /* between the gate posts: the thickest of all, running to his door */
          { x: HUNT5.s3.x, y: 0.02, z: HUNT5.s3.z, k: 1.0 * f('s3'), reach: 11, n: 90, rx: 0.55, rz: 0.18, d: [0, 0.12, 0.99], v: 0.5, L: 1.2, a: 0.05, w: 0.022 },
          /* the old armchair: threads standing thick over it (his nose is once behind the truth) */
          { x: HUNT5.arm.x, y: 0.5, z: HUNT5.arm.z, k: 0.9 * (play.found.has('a') ? 0.35 : 1), reach: 7, n: 55, rx: 0.28, rz: 0.26, ry: 0.15, d: [0, 1, 0], v: 0.2, L: 0.8, a: 0.05 }
        ];
      }
      if (phase === 'table' || phase === 'ask') {
        /* the pieces themselves, all of them, like smoke from snuffed candles (4.7) */
        const out = [];
        for (const P of TABLE5.pieces) out.push({ x: P.x, y: P.y + 0.03, z: P.z, k: 1, reach: 4, n: 16, rx: 0.02, rz: 0.02, d: [0, 1, 0], v: 0.14, L: 0.32, a: 0.02, f: 1.3, grow: 0.06, col: TH_COL.smoke, life: 2.6, w: 0.009 });
        out.push({ x: TABLE5.caseAt.x, y: TABLE5.caseAt.y, z: TABLE5.caseAt.z, k: 1, reach: 4, n: 40, rx: 0.13, rz: 0.08, d: [0, 1, 0], v: 0.14, L: 0.3, a: 0.02, f: 1.3, grow: 0.06, col: TH_COL.smoke, life: 2.6, w: 0.009 });
        return out;
      }
      return [];
    }
    function nearestUnfound() {
      if (phase !== 'hunt') return null;
      let best = null, bd = 1e9;
      for (const c of STAINS) if (!play.found.has(c)) { const q = HUNT5[c], d = distTo(q.x, q.z); if (d < bd) { bd = d; best = Object.assign({ c }, q); } }
      return best;
    }
    const _ta = new THREE.Vector3(), _tb = new THREE.Vector3(), _tt = new THREE.Vector3(), _tc = new THREE.Vector3(), _ts = new THREE.Vector3(), _tp = new THREE.Vector3(), _tq = new THREE.Vector3();
    function threadPoint(T, u, out) {
      const age = Math.max(0, T.age);
      if (T.trail) {
        const s = T.s0 - T.v * age + u * T.L; trailAt(s, out);
        trailAt(s + 0.05, _tq); const tx = _tq.x - out.x, tz = _tq.z - out.z, tl = Math.hypot(tx, tz) || 1;
        const wv = Math.sin(T.f * age * 1.7 + u * 5.5 + T.ph) * T.a;
        out.x += (-tz / tl) * (T.lat + wv); out.z += (tx / tl) * (T.lat + wv);
        out.y = T.h + Math.sin(T.f * age + u * 4 + T.ph * 1.3) * T.a * 0.7 + u * 0.03;
        return out;
      }
      const D = T.D, d = T.v * age - u * T.L;
      out.set(T.O[0] + D[0] * d, T.O[1] + D[1] * d, T.O[2] + D[2] * d);
      /* the wave across it, in the two directions square to its flow, growing along a rising smoke's length */
      const amp = T.a * (1 + (T.grow || 0) * 20 * Math.max(0, d));
      const w1 = Math.sin(T.f * age * 1.6 + u * 5.0 + T.ph) * amp, w2 = Math.cos(T.f * age * 1.2 + u * 4.0 + T.ph * 0.7) * amp * 0.7;
      if (Math.abs(D[1]) > 0.9) { out.x += w1; out.z += w2; }                   // (a rising one: it sways both ways)
      else { const hl = Math.hypot(D[0], D[2]) || 1; out.x += (-D[2] / hl) * w1; out.z += (D[0] / hl) * w1; out.y += w2 * 0.6; }
      return out;
    }
    function threadsFrame(wdt, st) {
      if (!thMesh.visible) return;
      if (st === 'cine' || smell.t < 0 || !threads.length) { thMesh.visible = false; threads.length = 0; return; }
      const E = smell.t < 0.45 ? smell.t / 0.45 : smell.t < SMELL.threads ? 1 : Math.max(0, 1 - (smell.t - SMELL.threads) / SMELL.fade);
      camera.getWorldPosition(_tc);
      let vi = 0, ci = 0;
      for (let t = 0; t < TH.N; t++) {
        const T = threads[t];
        if (T) T.age += wdt;
        const on = T && T.age > 0 && T.age < T.life;
        const env = on ? Math.min(1, T.age / 0.45) * Math.min(1, (T.life - T.age) / 0.7) * E : 0;
        for (let i = 0; i < TH.SEG; i++) {
          if (!on || env <= 0.002) { for (let k = 0; k < 6; k++) thPos[vi + k] = 0; vi += 6; for (let k = 0; k < 8; k++) thCol[ci + k] = 0; ci += 8; continue; }
          const u = i / (TH.SEG - 1);
          threadPoint(T, u, _ta); threadPoint(T, Math.min(1, u + 0.06), _tb);
          _tt.subVectors(_tb, _ta); _ts.subVectors(_tc, _ta);
          _tp.crossVectors(_tt, _ts); const pl = _tp.length() || 1; const hw = T.w * (1 - 0.55 * u) * 0.5 / pl; _tp.multiplyScalar(hw);
          thPos[vi] = _ta.x + _tp.x; thPos[vi + 1] = _ta.y + _tp.y; thPos[vi + 2] = _ta.z + _tp.z;
          thPos[vi + 3] = _ta.x - _tp.x; thPos[vi + 4] = _ta.y - _tp.y; thPos[vi + 5] = _ta.z - _tp.z; vi += 6;
          const a = env * (T.alpha == null ? 1 : T.alpha) * T.col[3] * Math.pow(Math.sin(Math.PI * Math.min(1, 0.08 + u * 0.92)), 0.6);
          for (let k = 0; k < 2; k++) { thCol[ci] = T.col[0]; thCol[ci + 1] = T.col[1]; thCol[ci + 2] = T.col[2]; thCol[ci + 3] = a; ci += 4; }
        }
      }
      thGeo.attributes.position.needsUpdate = true; thGeo.attributes.color.needsUpdate = true;
    }

    /* ================================================================ THE WALKWAY'S THREE (4.1): Ton, Jun and their
       teacher walk with him, in single file along the wall side, never solid to him (the walkway is 1.9 m wide: a solid
       follower would box him in); they step to the wall as he comes, and when he walks on they follow at a walking pace
       and come to HIM, so he is never sent back. Each walks his own take at the pace of the ground he covers (v7.1).
       Past 40 s of nothing done, his teacher walks on ahead and waits at the gate. */
    const FOLLOW = { gap: 1.5, step: 1.05, wall: 0.55, slack: 0.7 };
    const PHO_GATE = { x: -7.75, z: -14.5 };
    const walkers = { list: [], ahead: false };
    function walkersInit() {
      walkers.list = []; walkers.ahead = false;
      const add = (n, st, rank) => { const P = castOf(n); if (!P) return;
        walkers.list.push({ n, P, rank, s: wayS(st.x, st.z), lat: -st.x, v: 0, moving: false, ahead: false }); };
      add('pho', STATION.walk.pho, 0); add('ton', STATION.walk.ton, 1); add('jun', STATION.walk.jun, 2);
    }
    function walkerMove(W0, tx, tz, wdt, pace) {
      const P = W0.P, g = P.group.position, dx = tx - g.x, dz = tz - g.z, d = Math.hypot(dx, dz);
      if (d < 0.06) { if (W0.moving) { W0.moving = false; W0.v = 0; P.rate = 1; rest(P, 0.35); } return false; }
      if (!W0.moving) { W0.moving = true; P.actN++; take(P, 'Walking', 0.3); gaze(P, null, { secs: 0.5 }); }
      const want = Math.min(pace, 0.6 + d * 1.2);
      W0.v += (want - W0.v) * Math.min(1, wdt * 3.5);
      const st = Math.min(d, W0.v * wdt); g.x += dx / d * st; g.z += dz / d * st;
      P.group.rotation.y += angTo(P.group.rotation.y, Math.atan2(dx, dz)) * Math.min(1, wdt * 5.5);
      P.rate = Math.max(0.5, Math.min(1.35, W0.v / pace));
      return true;
    }
    function walkersTick(wdt) {
      if (phase !== 'walk' || !walkers.list.length) return;
      const sp = wayS(myX(), myZ());
      /* the order of the file along the way: whoever is furthest along goes first (no two in one place) */
      const lst = walkers.list.filter(W0 => W0.P.ready && !W0.ahead).sort((a, b) => b.s - a.s);
      let cap = Infinity;
      for (const W0 of lst) {
        const g = W0.P.group.position;
        W0.s = wayS(g.x, g.z);
        let ts = W0.s, tl = W0.lat;
        const near = Math.abs(sp - W0.s) < 1.9;
        /* he has walked on past: follow, a step and a half behind him and a step behind the one in front */
        if (sp > W0.s + FOLLOW.gap + FOLLOW.slack) { ts = sp - FOLLOW.gap; tl = FOLLOW.wall; }
        else if (near) tl = FOLLOW.wall;                                // (he comes up to him: a step to the wall)
        ts = Math.min(ts, cap); cap = ts - FOLLOW.step;
        wayAt(ts, tl, _pv5);
        const pace = (W0.P.pace && W0.P.pace.Walking) || 1.2;
        const moving = walkerMove(W0, _pv5.x, _pv5.z, wdt, pace);
        if (!moving && !W0.looking && distTo(g.x, g.z) < 7) { W0.looking = true; gaze(W0.P, 'lens', { secs: 0.8, reach: 0.7 }); }
        if (moving) W0.looking = false;
        W0.lat = tl;
      }
      /* his teacher walks on ahead and waits at the gate */
      const ph = walkers.list.find(W0 => W0.n === 'pho' && W0.ahead);
      if (ph && ph.P.ready) { const P = ph.P, pace = (P.pace && P.pace.Walking) || 1.1, g = P.group.position;
        const s = wayS(g.x, g.z), ts = Math.min(WAY.gateS - 0.75, s + 2.0);
        wayAt(ts, s > WAY.turnS - 0.5 ? 0.45 : FOLLOW.wall, _pv5);
        if (s >= WAY.gateS - 1.1) _pv5.set(PHO_GATE.x, 0, PHO_GATE.z);
        if (!walkerMove(ph, _pv5.x, _pv5.z, wdt, pace) && !ph.turned) { ph.turned = true; P.group.rotation.y = faceTo(g.x, g.z, myX(), myZ()); gaze(P, 'lens', { secs: 1, reach: 0.7 }); } }
    }
    function phoWalksAhead() { const W0 = walkers.list.find(w => w.n === 'pho'); if (W0 && !W0.ahead) { W0.ahead = true; W0.turned = false; } }

    /* ================================================================ SPIRIT VISION'S STRAIN (chapter 4's, as it behaved
       there: R95, R96, R128, R129): his heart climbs while his sight is open and settles while it is shut; the ring on
       the eye fills with it, red from its mark, where the eye asks to close; once it is empty after a shut with strain in
       it, the eye asks to open again. Nothing here charges him for looking (4.3: "dread, not damage") */
    const HEAT5 = { up: 1 / 32, down: 1 / 2.8 }, WARN5 = 0.85;
    const sight = { heat: 0, was: false, shutPeak: 0, topArmed: true, restSaid: true, step: -1 };
    const visOpen = () => { const v = kit && kit.vision ? kit.vision() : null; return !!(v && v.on && !v.held); };
    function strainTick(wdt) {
      if (!kit || !kit.vision) return;
      const live = phase === 'hunt' || phase === 'table';
      const v = kit.vision(); if (!v) return;
      const open = v.on && !v.held;
      if (sight.was && !open) { sight.shutPeak = sight.heat; sight.restSaid = false; }
      if (!open || sight.heat < WARN5) sight.topArmed = true;
      sight.was = open;
      sight.heat = Math.max(0, Math.min(1, sight.heat + (open ? HEAT5.up : -HEAT5.down) * wdt));
      const step = !open ? 0 : sight.heat >= 1 ? 3 : sight.heat >= 0.75 ? 2 : sight.heat >= 0.45 ? 1 : 0;
      if (open && step !== sight.step && kit.pulse) { sight.step = step; kit.pulse(step === 3 ? { bpm: 160, secs: 1.2, erratic: 0.4 } : step === 2 ? { bpm: 142, secs: 2 } : step === 1 ? { bpm: 128, secs: 2.5 } : { bpm: 114, secs: 2.4 }); }
      if (!open) sight.step = -1;
      if (kit.visionStrain) kit.visionStrain(live ? sight.heat : null, { warn: WARN5 });
      if (!live || play.busy) return;
      /* (R128, R129) "You're losing control, close your Spirit Vision, and re-open it again." at the top; "When you feel
         better, open your Spirit Vision again." once the ring of a shut made with strain in it is empty, while there is
         still something to look at */
      if (open && sight.heat >= 1 && sight.topArmed && !lineBusy()) { sight.topArmed = false; say('ph5v1'); }
      if (!open && !sight.restSaid && sight.shutPeak >= WARN5 && sight.heat <= 0.02 && sightNeeded() && !lineBusy()) { sight.restSaid = true; say('ph5v2'); }
    }
    /* THE EYE ASKS (chapter 4's two colours): to CLOSE while the ring is red; to OPEN while the order is to look */
    let urgeNow = null;
    function urgeTick() {
      if (!kit || !kit.visionUrge) return;
      const open = visOpen();
      let u = false;
      if (phase === 'hunt' || phase === 'table') {
        if (open && sight.heat >= WARN5) u = 'close';
        else if (!open && sightAsk() && sight.heat <= 0.05 && !play.busy) u = 'open';
      }
      if (u !== urgeNow) { urgeNow = u; kit.visionUrge(u); }
    }

    /* ================================================================ THE HUNT'S PLACES (4.3), each seen only through
       Spirit Vision (ctx.spirit: drawn in the vision's layer, nowhere else): what his sight shows at each of the three
       places the smell is strongest, and nothing at the armchair. The patches are a spill's shape on the floor with a
       faint sheen moving on it; the threshold's with spots in a trail across the court to his doors. */
    const HUNT5 = {
      s1: { x: -9.45, z: -5.12 },                                   // under the shoe cabinet by the doors (inside)
      s2: { x: -6.82, z: -11.7 },                                   // the court, at the left planter's foot (his left as he comes in)
      s3: { x: GATE.x, z: -13.72 },                                 // the threshold between the gate posts
      arm: { x: -7.25, z: -2.18 }                                   // the old armchair
    };
    const STAIN_LOOK = { color: 0x9db36a, fill: 0.34, rim: 0.9, flicker: 0.22, power: 1.6, xray: 0 };
    const stainFx = [];
    function spillShape(seed, rx, rz) {
      const r = rng(seed), sh = new THREE.Shape(), n = 22;
      for (let i = 0; i <= n; i++) { const a = (i % n) / n * Math.PI * 2, k = 0.72 + r() * 0.42 + 0.18 * Math.sin(a * 3 + r());
        const x = Math.cos(a) * rx * k, z = Math.sin(a) * rz * k; if (i === 0) sh.moveTo(x, z); else sh.lineTo(x, z); }
      return sh;
    }
    function stainMesh(seed, x, z, rx, rz, ry = 0, y = 0.012) {
      const g = new THREE.ShapeGeometry(spillShape(seed, rx, rz), 2); g.rotateX(Math.PI / 2);
      const m = new THREE.Mesh(g, matProxy); m.position.set(x, y, z); m.rotation.y = ry; world.add(m); return m;
    }
    function stainsBuild() {
      const grp = new THREE.Group(); grp.name = 'the hunt\'s stains (Spirit Vision only)'; world.add(grp);
      const add = (m) => { world.remove(m); grp.add(m); };
      add(stainMesh(28711, HUNT5.s1.x, HUNT5.s1.z - 0.06, 0.42, 0.26));
      add(stainMesh(28712, HUNT5.s2.x, HUNT5.s2.z, 0.16, 1.0));
      add(stainMesh(28713, HUNT5.s3.x, HUNT5.s3.z, 0.85, 0.3));
      /* the spots in a trail from the threshold across the court to his doors */
      const r = rng(28714);
      for (let z = -13.1; z < HOUSE.face - 0.3; z += 0.55 + r() * 0.35) add(stainMesh(28720 + ((z * 10) | 0), GATE.x + (r() - 0.5) * 0.55, z, 0.07 + r() * 0.07, 0.06 + r() * 0.06, r() * 3));
      grp.visible = false;
      const fx = ctx.spirit ? ctx.spirit(grp, STAIN_LOOK) : null;
      return { grp, fx };
    }
    const stains5 = stainsBuild();
    /* THE NINE, in the court from the moment he arrives (4.3): still, heads bowed, all facing the doors of the house,
       standing between where he has been walking. The three large ones are prai[6..8] (the chapter's cast) */
    const NINE_AT = [[-9.9, -12.9], [-7.2, -12.8], [-8.9, -11.6], [-7.7, -10.4], [-10.0, -10.1], [-8.4, -9.0], [-6.9, -8.2], [-9.6, -7.6], [-8.1, -6.9]];
    function nineStand(on) {
      const L = praiOf();
      L.forEach((P, i) => { if (!P || !P.group) return; const a = NINE_AT[i % NINE_AT.length];
        if (!on) { if (P.group.userData.p7) { P.group.visible = false; P.group.userData.p7 = false; } return; }
        put(P, a[0], a[1], faceTo(a[0], a[1], GATE.x, HOUSE.face)); P.group.userData.p7 = true;
        if (P.ready) P.group.visible = true; else whenReady(P, (Q) => { if (Q.group.userData.p7) Q.group.visible = true; });
        gaze(P, [a[0] + Math.sin(P.group.rotation.y) * 1.1, 0.0, a[1] + Math.cos(P.group.rotation.y) * 1.1], { secs: 0.1, reach: 0.9, down: 0 }); });
    }
    /* whether any of the nine is in the picture within reach: the wave runs out and they are there (4.3: seen the first
       time his sight is open in the court, or with them in front of him through the open door) */
    function nineInView() {
      camera.updateMatrixWorld();
      for (const a of NINE_AT) { if (distTo(a[0], a[1]) > 9) continue; _hv5.set(a[0], 1.1, a[1]).project(camera);
        if (_hv5.z < 1 && Math.abs(_hv5.x) < 0.95 && Math.abs(_hv5.y) < 0.95) return true; }
      return false;
    }

    /* ================================================================ THE COLLECTOR'S TABLE (4.7): his pieces on the white
       cloth, and on three of them the three presences, each a look answered by a press (v21.9). Which presence sits on
       which piece is the game's own picture (docs/research/V28.0-PIECES.md): the ANGRY knot on the charging bull (Wua
       Thanu), the HUNGRY reaching shape on the bottle of oil (Rak Yom), the one LOOKING FOR ENERGY on the bound effigy (Hun
       Phayon). The pieces are the three real models made for them, laid out before him (the films lay them there) */
    const TABLE5 = (() => {
      const R = ROOM, top = 0.345;
      const P = { angry: { x: R.cx - 0.02, y: top, z: R.cz - 0.20, key: 'w5wuathanu', ry: Math.PI + 0.5 },
                  hungry: { x: R.cx + 0.20, y: top, z: R.cz - 0.14, key: 'w5rakyom', ry: Math.PI },
                  energy: { x: R.cx + 0.42, y: top, z: R.cz - 0.22, key: 'w5hunphayon', ry: Math.PI - 0.2 } };
      return { P, pieces: [P.angry, P.hungry, P.energy], caseAt: { x: R.cx - 0.36, y: top + 0.06, z: R.cz - 0.05 } };
    })();
    FLOOR.pieces = TABLE5;
    for (const k of ['angry', 'hungry', 'energy']) { const q = TABLE5.P[k];
      if (!things[q.key]) things[q.key] = place(q.key, q.x, q.y, q.z, q.ry, { name: q.key }); }
    /* the presences: no body and no face (they are not people: a knot, a reaching thinness, a small pale warmth) */
    const PRES_LOOK = {
      angry:  { color: 0xff3a2c, fill: 0.08, rim: 2.2, flicker: 0.45, power: 1.8, xray: 0 },
      hungry: { color: 0x9cff54, fill: 0.05, rim: 2.0, flicker: 0.2, power: 2.0, xray: 0 },
      energy: { color: 0xe4ecff, fill: 0.18, rim: 1.4, flicker: 0.08, power: 2.2, xray: 0 }
    };
    const pres = {};
    (function presencesBuild() {
      const q = TABLE5.P;
      /* ANGRY: a tight, jagged knot that flinches when it is looked at */
      { const g = new THREE.IcosahedronGeometry(0.045, 2), p = g.attributes.position, r = rng(28731);
        for (let i = 0; i < p.count; i++) { const k = 0.7 + r() * 0.65; p.setXYZ(i, p.getX(i) * k, p.getY(i) * k, p.getZ(i) * k); }
        g.computeVertexNormals(); const m = new THREE.Mesh(g, matProxy); const grp = new THREE.Group(); grp.add(m); grp.position.set(q.angry.x, q.angry.y + 0.075, q.angry.z); world.add(grp);
        pres.angry = { grp, m, home: grp.position.clone(), flinch: 0 }; }
      /* HUNGRY: a thin shape bent over its piece, reaching toward the collector's hands (he sits at the table's west end) */
      { const C = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.0, 0.11, 0.01), new THREE.Vector3(-0.05, 0.16, 0.0), new THREE.Vector3(-0.13, 0.13, -0.02), new THREE.Vector3(-0.2, 0.07, -0.03)]);
        const g = new THREE.TubeGeometry(C, 24, 0.011, 6, false), t = g.attributes.position;
        /* (thinning to its reaching end) */
        for (let i = 0; i < t.count; i++) { const seg = Math.floor(i / 7) / 24, k = 1 - 0.75 * seg; const c0 = C.getPoint(Math.min(1, seg)); t.setXYZ(i, c0.x + (t.getX(i) - c0.x) * k, c0.y + (t.getY(i) - c0.y) * k, c0.z + (t.getZ(i) - c0.z) * k); }
        g.computeVertexNormals(); const m = new THREE.Mesh(g, matProxy); const grp = new THREE.Group(); grp.add(m); grp.position.set(q.hungry.x, q.hungry.y + 0.02, q.hungry.z); world.add(grp);
        pres.hungry = { grp, m, home: grp.position.clone() }; }
      /* LOOKING FOR ENERGY: small and pale, drifting toward whoever is nearest: toward HIM as he leans in */
      { const g = new THREE.SphereGeometry(0.032, 16, 12); const m = new THREE.Mesh(g, matProxy); const grp = new THREE.Group(); grp.add(m); grp.position.set(q.energy.x, q.energy.y + 0.12, q.energy.z); world.add(grp);
        pres.energy = { grp, m, home: grp.position.clone() }; }
      for (const k in pres) { pres[k].grp.visible = false; pres[k].fx = ctx.spirit ? ctx.spirit(pres[k].grp, PRES_LOOK[k]) : null; }
    })();
    function presTick(wdt) {
      const on = phase === 'table' || phase === 'ask';
      for (const k in pres) pres[k].grp.visible = on;
      if (!on) return;
      const t = wallClock.t;
      const A = pres.angry; A.flinch = Math.max(0, A.flinch - wdt * 1.6);
      const j = 0.006 + 0.02 * A.flinch;
      A.grp.position.set(A.home.x + Math.sin(t * 23) * j, A.home.y + Math.sin(t * 17 + 1) * j - 0.02 * A.flinch, A.home.z + Math.cos(t * 19) * j);
      A.grp.rotation.set(t * 0.7, t * 1.3, Math.sin(t * 3) * 0.4); A.grp.scale.setScalar(1 - 0.25 * A.flinch);
      const H = pres.hungry; H.grp.rotation.y = 0.15 * Math.sin(t * 0.8); H.grp.rotation.z = 0.1 * Math.sin(t * 1.1 + 0.5);
      /* the one looking for energy drifts toward the nearest warmth: him, and nearer the more he leans in */
      const E = pres.energy; camera.getWorldPosition(_pv5);
      const to = _pw5.set(_pv5.x - E.home.x, _pv5.y - E.home.y, _pv5.z - E.home.z), L = to.length() || 1, k = Math.min(0.16, 0.42 / Math.max(0.5, L)) * 0.6;
      E.grp.position.set(E.home.x + to.x / L * k + Math.sin(t * 0.9) * 0.01, E.home.y + to.y / L * k * 0.5 + Math.sin(t * 1.3) * 0.012, E.home.z + to.z / L * k);
    }
    /* each presence's own place on the screen, for its mark and its tap */
    const presAt = (k) => () => { const g = pres[k].grp.position; return { x: g.x, y: g.y, z: g.z }; };

    /* ================================================================ WHO STANDS WHERE IN THE PLAY'S PHASES (each change
       made as a phase begins, under the film or the curtain that hands to it: v24.12). Grandmaster Pho stands for the
       walkway and the hunt and sits for the table; Ton is with him until the table; the nine stand in the court from the
       hunt on (the fight's own from its brief) */
    function castPhase(p) {
      const st = STATION[p] || STATION.walk, pho = castOf('pho'), phoS = castOf('phoS'), ton = castOf('ton');
      const show = (P, on, at) => { if (!P) return; if (at) put(P, at.x, at.z, at.ry);
        if (on) { if (P.ready) P.group.visible = true; else whenReady(P, (Q) => { Q.group.visible = true; }); } else P.group.visible = false;
        if (on) { rest(P, 0); gaze(P, null); P.rate = 1; } };
      if (p === 'walk' || p === 'hunt') { show(pho, true, st.pho); show(ton, true, st.ton); show(phoS, false); }
      else if (p === 'table' || p === 'ask') { show(pho, false); show(ton, false); show(phoS, true); }
      nineStand(p === 'hunt');
      stains5.grp.visible = p === 'hunt';
      if (p === 'walk') walkersInit(); else walkers.list = [];
    }
    /* his teacher, quietly, already beside him (4.3: "Nine Prai."): a step behind his shoulder, out of the picture, where
       the court has room (a change made where no shot sees it: v24.12) */
    function phoBeside() {
      const P = castOf('pho'); if (!P) return;
      const ry = yaw.rotation.y, fx = -Math.sin(ry), fz = -Math.cos(ry);           // (a turn of 0 looks toward -z)
      for (const side of [1, -1]) {
        const x = myX() + fx * -0.45 + fz * 1.05 * side, z = myZ() + fz * -0.45 - fx * 1.05 * side;
        if (inCourt(x, z, -0.3)) { put(P, x, z, faceTo(x, z, x + fx, z + fz)); return; }
      }
    }

    /* ================================================================ THE PLAY'S FRAME and its reset (d_play.js calls
       both) */
    function playFrame(wdt, st) {
      threadsFrame(wdt, st);
      presTick(wdt);
      if (st !== 'play') return;
      smellTick(wdt);
      walkersTick(wdt);
      strainTick(wdt);
      urgeTick();
    }
    function playReset() {
      smell.t = -1; smell.presses = 0; smell.shown = false; smell.pulse = false; smell.waitDrawn = -1;
      threads.length = 0; thMesh.visible = false;
      walkers.list = []; urgeNow = null;
      Object.assign(sight, { heat: 0, was: false, shutPeak: 0, topArmed: true, restSaid: true, step: -1 });
      stains5.grp.visible = false; nineStand(false);
      pres.angry.flinch = 0;
    }

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
    const RECEIPTS = { walk: ['t', 'j', 'd', 'e'], hunt: ['s1', 's2', 's3', 'a', 'n'], fight: [], table: ['m', 'k1', 'k2', 'k3'], ask: [] };
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
    const LOOK_OF = { walk: 'DUSK', hunt: 'EVENING', fight: 'NIGHT', table: 'DAY', ask: 'DAY' };   // (the world's: the plan's 8.1 hours; EVENING is a_head.js's)
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
    /* a line of the script, by its key. WHO SAYS IT TALKS from the line's own start and rests after it (v11.4): his
       teacher standing or seated, Ton, Jun, Mr Koh (the collector's body is not cast yet; his lines are heard) */
    const TALKER = { pho: () => { const S0 = castOf('phoS'); return S0 && S0.group.visible ? S0 : castOf('pho'); },
                     ton: () => castOf('ton'), jun: () => castOf('jun'), koh: () => castOf('koh') };
    function say(name) {
      const L = LINES[name]; if (!L) { console.warn('e4c5: no line ' + name + ' in the script'); queueLine(name); return; }
      const P = TALKER[L[0]] ? TALKER[L[0]]() : null;
      queueLine(name, P ? () => talk(P, SECS[name] || 2.5) : null);
    }
    /* what follows the lines now queued, once every one of them is done (v21.21); dropped if the phase has been left */
    function andThen(fn) { const run = play.run; queueFn(() => { if (live(run)) fn(); }); }
    /* a voice is speaking, or is waiting to (one voice at a time: v5.30) */
    const lineBusy = () => lineQ.length > 0 || !!speak.pending || dayClock.t < speak.until;
    /* the input, beside the order, for the device he is on (v18.5): no voice ever names one */
    const smellIn = () => TOUCH5 ? W.smellTouch : W.smellKey;

    /* ---------------------------------------------------------------- the orders (one at a time, after the lines that
       hand off to them: v21.21; COMPLETE only for what he did: v8.7; a count going up is not a completion). Each is
       derived on the frame from what is found (v11.6), and the next place is marked once it is the goal (v14.8) */
    function objectiveFor(opts = { complete: false }) {
      if (!kit || play.busy) return;
      let o = null, wp = null;
      if (phase === 'walk') {
        if (!asked()) o = W.objAsk;
        else { o = W.objFollow + '  ·  ' + smellIn(); if (walk5.wp) wp = SPOT.gate; }
      } else if (phase === 'hunt') {
        if (hunt5.pending && !visOpen()) o = W.objOpen;
        else if (stainsFound() < 3 || !play.found.has('n')) o = W.objHunt.replace('{n}', String(stainsFound()));
        if (hunt5.wp) { const q = nearestUnfound(); if (q) wp = { x: q.x, y: 0.9, z: q.z }; }
      } else if (phase === 'fight') { o = W.hotCleanse; wp = SPOT.court; }
      else if (phase === 'table') {
        if (!play.found.has('m')) o = W.objSmell + '  ·  ' + smellIn();
        else if (lookedN() < 3) o = W.objLook;
      }
      kit.objective(o, opts);
      kit.waypoint(wp);
    }
    /* what his sight is asked for: the eye asks to OPEN for it (urgeTick), and "When you feel better" is said only while
       there is still something to look at (strainTick) */
    function sightAsk() {
      if (phase === 'hunt') return !!hunt5.pending;
      if (phase === 'table') return play.found.has('m') && lookedN() < 3 && !play.busy;
      return false;
    }
    function sightNeeded() {
      if (phase === 'hunt') return stainsFound() < 3 || !play.found.has('n');
      if (phase === 'table') return play.found.has('m') && lookedN() < 3;
      return false;
    }

    /* ---------------------------------------------------------------- a film from play, and what it hands to. A film
       the engine will not play (not in play, or no such film) costs the film, never the story: its hand-off runs */
    function film(key, next) {
      const run = play.run, go = () => { if (live(run)) next(); };
      if (!kit || !kit.film || !kit.film(key, { onDone: go })) go();
    }
    /* A NEED'S PROMPTS (the plan's 7.1): while a need stands its line comes round again, never over another voice, in
       turn through its wordings; the times are seconds since the need began, the last one's gap repeating */
    function nagTick(N, live0, sinceT) {
      if (!N || !live0) return;
      const t = dayClock.t - sinceT;
      while (N.i < N.at.length && t >= N.at[N.i][0]) {
        if (play.busy || lineBusy()) return;                      // (it waits for any live voice, and is said then)
        const a = N.at[N.i++];
        if (a[1] === 'pulse') { if (N.pulse) N.pulse(); continue; }
        if (!a[2] || !heard.has(a[1])) say(a[1]);
      }
      if (N.i >= N.at.length && N.every) {
        if (N.next == null) N.next = t + N.every[0];
        if (t >= N.next && !play.busy && !lineBusy()) { say(N.every[1][N.k++ % N.every[1].length]); N.next = t + N.every[0]; }
      }
    }

    /* ================================================================ PLAY I · THE WALKWAY (the plan's 4.1)
       Told: "Something smells. Ask the others." with a mark on Ton and on Jun (a press each, v21.9). Both asked (either
       order), his teacher: "Your nose has opened..." and "Follow it. SMELL." and the SMELL button is his. The eye is not
       offered here: dimmed, and pressed it says why in his teacher's voice, once ("Not yet. First your nose."). The decoy,
       the drain, nine metres on; the true trail on round the turn to the gate; at the gate, the gate's two lines, and the
       devotee's film. RECEIPTS on the phase string: t Ton asked, j Jun asked, d the drain smelled, e the eye's line said */
    const walk5 = { given: -1, best: 0, maxS: 0, idle: 0, wp: false, tonCalled: false, nag: null };
    const asked = () => play.found.has('t') && play.found.has('j');
    function walkBegin() {
      lookAt0(LOOK_OF.walk); castPhase('walk');
      if (kit && kit.vision) { kit.vision(null); kit.vision(false); if (play.found.has('e')) kit.vision({ r: 0 }); }
      Object.assign(walk5, { given: -1, best: wayS(myX(), myZ()), maxS: 0, idle: 0, wp: false, tonCalled: false, nag: null });
      smellButton(false);
      if (asked()) giveSmell();
      objectiveFor();
    }
    function askOne(c, P, lines) {
      if (phase !== 'walk' || play.busy || play.found.has(c)) return false;
      play.busy = true; if (kit) kit.objective(null, { complete: false });
      if (P) { P.group.rotation.y = faceTo(P.group.position.x, P.group.position.z, myX(), myZ()); gaze(P, 'lens', { secs: 0.6, reach: 0.75 }); }
      for (const L of lines) { if (typeof L === 'number') queueGap(L); else say(L); }
      andThen(() => { play.busy = false; got(c);
        if (!asked()) { objectiveFor(); return; }
        play.busy = true;
        say('ph5w1');                                          // "Your nose has opened. They cannot smell it. You can."
        say('ph5w2');                                          // "Do not say what it is yet. Follow it. SMELL."
        andThen(() => { play.busy = false; giveSmell(); objectiveFor(); }); });
      return true;
    }
    function giveSmell() {
      smellButton(true); walk5.given = dayClock.t;
      /* SMELL not pressed: 8 s the button asks and his teacher says it; 20 s again in other words; Ton once; then every
         15 s, in turn (4.1; his R20 of chapter 4: a line "can keep repeating" while the thing is not done) */
      walk5.nag = { i: 0, k: 0, next: null, pulse: () => smellButton(true, { pulse: true }),
                    at: [[8, 'pulse'], [8, 'ph5w6'], [20, 'ph5w7'], [35, 'tn5w4', true]], every: [15, ['ph5w6', 'ph5w7']] };
    }
    function walkTick(wdt) {
      const sp = wayS(myX(), myZ());
      walk5.maxS = Math.max(walk5.maxS, sp);
      /* he walks on past six metres without asking: Ton calls, once; they come to him (walkersTick) */
      if (!asked() && !walk5.tonCalled && sp > 6 && !play.busy && !lineBusy()) { walk5.tonCalled = true; say('tn5w3'); }
      if (walk5.given < 0) return;
      if (smell.presses === 0) nagTick(walk5.nag, true, walk5.given);
      /* nothing done (no step on toward the gate) for 40 s: his teacher walks on ahead and waits at the gate, and the
         gate is marked; the gate is marked too once SMELL has gone unpressed for 20 s (the way on, 4.1) */
      if (sp > walk5.best + 0.5) { walk5.best = sp; walk5.idle = 0; } else walk5.idle += wdt;
      if (!walk5.wp && (walk5.idle > 40 || (smell.presses === 0 && dayClock.t - walk5.given > 20))) { walk5.wp = true; objectiveFor(); }
      if (walk5.idle > 40) phoWalksAhead();
    }
    /* (his first press of the eye on the walkway: shut again at once, his teacher's word, and the eye held dimmed for
       the rest of it; a press after that is answered by the engine with the same words: words.visionHeld) */
    function walkEye() {
      if (!kit || !kit.vision) return;
      kit.vision(false); kit.vision({ r: 0 });
      if (!play.found.has('e')) { got('e'); say('ph5w3'); }  // "Not yet. First your nose."
    }
    function atDrain() {
      if (phase !== 'walk' || play.busy || play.found.has('d')) return false;
      play.busy = true;
      say('q5w2');                                             // "A drain. That one I understand."
      say('ju5w2');                                            // "That one even I can smell."
      say('ph5w4');                                            // "Good. Now the other one."
      andThen(() => { play.busy = false; got('d'); objectiveFor(); });
      return true;
    }
    function atGate() {
      if (phase !== 'walk' || play.busy || walk5.given < 0) return false;
      play.busy = true; if (kit) { kit.objective(null); kit.waypoint(null); }
      say('ph5w5');                                            // "The spiritual sense of your nose is already open. That is why it reached you, and not them."
      say('q5w3');                                             // "We were not even at his door."
      andThen(() => { play.busy = false; book('hunt'); film('devotee', () => huntBegin([])); });
      return true;
    }

    /* ================================================================ PLAY II · THE HUNT (the plan's 4.3)
       Told: "Find where the smell is strongest. 0/3". SMELL shows the way (a place is offered to press once a SMELL has
       shown it, or once the hints mark it); at each, the mark is pressed, the eye asks to be opened, he looks, and says
       what he perceives and where. The nine stand in the court, seen only in Spirit Vision: the first time his sight is
       open in the court (or with them in front of him) the wave runs out and they are there. The armchair: his nose
       behind the truth. All three found and the nine seen: his teacher's belief, and the film of the preparation.
       RECEIPTS: s1 s2 s3 the stains, a the armchair, n the nine seen. The count is derived on the frame, never stored */
    const hunt5 = { pending: null, since: 0, wp: false, shown: new Set(), hints: new Set(), nag: null };
    const PLACE_OF = { s1: { line: 'q5h1', hint: 'ph5h6' }, s2: { line: 'q5h2', hint: 'ph5h5' }, s3: { line: 'q5h3', hint: 'ph5h7' } };
    function huntBegin(found) {
      play.found = new Set(found); lookAt0(LOOK_OF.hunt); castPhase('hunt');
      if (kit && kit.vision) kit.vision(null);
      smellButton(true);
      Object.assign(hunt5, { pending: null, since: dayClock.t, wp: false, nag: null }); hunt5.shown = new Set(); hunt5.hints = new Set();
      objectiveFor();
      if (stainsFound() === 3 && play.found.has('n')) huntDone();
    }
    /* what a SMELL has shown him (the places within the threads' reach of where he stood) */
    function huntSmelled() {
      for (const c of ['s1', 's2', 's3', 'a']) { const q = c === 'a' ? HUNT5.arm : HUNT5[c]; if (distTo(q.x, q.z) < (c === 's3' ? 11 : 7.5)) hunt5.shown.add(c); }
      hunt5.since = dayClock.t;
    }
    function lookHere(c) {
      if (phase !== 'hunt' || play.busy || play.found.has(c)) return false;
      if (!visOpen()) { hunt5.pending = c; objectiveFor(); return true; }   // (the eye asks: urgeTick)
      resolveLook(c); return true;
    }
    function resolveLook(c) {
      hunt5.pending = null; play.busy = true; if (kit) kit.waypoint(null);
      const nineNow = !play.found.has('n') && (inCourt(myX(), myZ(), 0.8) || c === 's2' || c === 's3');
      if (nineNow) nineLines(false);
      if (c === 'a') { say('ph5h4'); say('q5h5'); }           // "Nothing is there now. A smell stays after what made it has gone." / "My nose was sure."
      else say(PLACE_OF[c].line);
      andThen(() => { play.busy = false; got(c); if (nineNow) got('n'); hunt5.wp = false; hunt5.since = dayClock.t;
        if (huntReady()) { huntDone(); return; }
        if (nineNow && stainsFound() < 3) { play.busy = true; say('ph5h2'); andThen(() => { play.busy = false; objectiveFor(); }); return; }
        objectiveFor(); });
    }
    const huntReady = () => stainsFound() === 3 && play.found.has('n');
    /* "Nine Prai." (quietly, already beside him) "They were already there." */
    function nineLines(alone) {
      phoBeside();
      say('ph5h1'); say('q5h4');
      if (!alone) return;
      play.busy = true;
      if (stainsFound() < 3) say('ph5h2');                     // "Now find where it was poured."
      andThen(() => { play.busy = false; got('n'); hunt5.since = dayClock.t; if (huntReady()) huntDone(); else objectiveFor(); });
    }
    function huntTick() {
      const open = visOpen();
      /* a place pressed with his sight shut: it is looked at once his sight is open there; walked away from, let go */
      if (hunt5.pending) { const q = hunt5.pending === 'a' ? HUNT5.arm : HUNT5[hunt5.pending];
        if (distTo(q.x, q.z) > 4.2) { hunt5.pending = null; objectiveFor(); }
        else if (open && !play.busy && !lineBusy()) resolveLook(hunt5.pending); }
      if (open && !play.busy && !play.found.has('n') && (inCourt() || nineInView()) && !lineBusy()) nineLines(true);
      /* the order keeps up with his sight (the ask to open is the order while a place waits for it) */
      if (!play.busy) objectiveFor();
      /* HE IDLES (4.3): 12 s the SMELL button asks; 25 s his teacher names the nearest place by a thing on the screen;
         45 s that place is marked */
      if (play.busy || lineBusy()) return;
      const t = dayClock.t - hunt5.since, q = nearestUnfound();
      if (t > 12) smellButton(true, { pulse: true });
      if (t > 25 && q && !hunt5.hints.has(q.c)) { hunt5.hints.add(q.c); say(PLACE_OF[q.c].hint); }
      if (t > 45 && q && !hunt5.wp) { hunt5.wp = true; hunt5.shown.add(q.c); objectiveFor(); }
    }
    function huntDone() {
      play.busy = true; hunt5.pending = null;
      if (kit) { kit.objective(null); kit.waypoint(null); }
      say('ph5h3');                                            // "I believe somebody poured this here: the oil of nine Prai. I believe it was people who are angry with him."
      andThen(() => { play.busy = false; smellButton(false); book('fight'); film('prepare', () => fightBegin()); });
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

    /* ================================================================ PLAY III · THE COLLECTOR (the plan's 4.7)
       Seated at the table (he looks; he does not walk). Told: "Something smells. SMELL." The threads rise from the
       pieces themselves (his thought). Then: "Open Spirit Vision. Look at the pieces." Three presences, each a look
       answered by a press, in any order. All three looked at: the doctor, heard before anything is decided ("Is it
       these?", his teacher to the man's face, "My wife says the same."), then the collector's question, and the
       decision opens on it. RECEIPTS: m he has smelled the pieces, k1 k2 k3 the three looked at */
    const table5 = { since: 0, smellNag: null, lookNag: null };
    const lookedN = () => ['k1', 'k2', 'k3'].filter(c => play.found.has(c)).length;
    /* seated on his cushion across the table from his teacher: the eye at a seated man's height, the look free about the
       table, his feet still (kit.pose 'lying' is the engine's way to hold the eye low; kit.root keeps him there) */
    const SIT5 = { y: 1.02, span: 1.05, lo: -1.0, hi: 0.5 };
    function seatHim() {
      if (!kit) return;
      yaw.position.set(STATION.table.at.x, yaw.position.y, STATION.table.at.z);
      if (kit.pose) kit.pose('lying', { y: SIT5.y, yaw: STATION.table.at.ry, span: SIT5.span, pitchLo: SIT5.lo, pitchHi: SIT5.hi, secs: 0.05 });
      if (kit.root) kit.root(true);
    }
    function tableBegin(found) {
      play.found = new Set(found); lookAt0(LOOK_OF.table); castPhase('table'); seatHim();
      if (kit && kit.vision) kit.vision(null);
      smellButton(true);
      table5.since = dayClock.t;
      /* SMELL not pressed: 10 s the button asks; 25 s his teacher; then every 15 s (4.7) */
      table5.smellNag = { i: 0, k: 0, next: null, pulse: () => smellButton(true, { pulse: true }), at: [[10, 'pulse'], [25, 'ph5t5']], every: [15, ['ph5t5']] };
      /* his sight not opened once he has smelled them: 30 s "Look, so that you know what you are answering."; every 20 s */
      table5.lookNag = { i: 0, k: 0, next: null, at: [[30, 'ph5t6']], every: [20, ['ph5t6']] };
      objectiveFor();
      if (lookedN() === 3) tableQuestion();
    }
    function tableSmelled() {
      if (phase !== 'table' || play.found.has('m') || play.busy) return;
      play.busy = true;
      const run = play.run;
      after(1.0, () => { if (!live(run)) return; say('q5t1');  // "I caught it too. It was not coming from anywhere in the room. It was coming from them."
        andThen(() => { play.busy = false; got('m'); table5.since = dayClock.t; objectiveFor(); }); });
    }
    function lookPresence(c, line) {
      if (phase !== 'table' || play.busy || play.found.has(c) || !visOpen()) return false;
      play.busy = true;
      if (c === 'k1') pres.angry.flinch = 1;                   // (the angry one flinches when it is looked at)
      say(line);
      andThen(() => { play.busy = false; got(c); if (lookedN() === 3) tableQuestion(); else objectiveFor(); });
      return true;
    }
    function tableQuestion() {
      play.busy = true; if (kit) kit.objective(null);
      const run = play.run;
      after(0.6, () => { if (!live(run)) return;
        say('co5t3');                                          // "Is it these? Is this why I am sick?"
        say('ph5t4');                                          // "Your health: see a doctor. That comes first, whatever we find on this table. Both can be true."
        say('co5t4');                                          // "My wife says the same."
        queueGap(0.6);
        say('co5t5');                                          // "All right. But some of these must be fine. I chose them one by one."
        say('co5t6');                                          // "You. You can tell. Which ones can I keep?"
        andThen(() => { play.busy = false; smellButton(false); if (kit && kit.vision) kit.vision(false); book('ask'); askBegin(); }); });
    }
    function tableTick() {
      if (!play.found.has('m')) nagTick(table5.smellNag, smell.presses === 0 || true, table5.since);
      else if (lookedN() < 3) { const v = kit && kit.vision ? kit.vision() : null; nagTick(table5.lookNag, !(v && v.on) && sight.heat < 0.05, table5.since); }
    }

    /* ================================================================ THE DECISION (the plan's 4.8): he is asking you
       which ones he can keep. Not timed. It opens on his question, and again at the table after a step back (d_play.js:
       the pile is live only while the question stands). Read with his sight open, the eye is shut by the window first
       (6.2); after 30 s without an answer the collector says, once, "Take your time. I am not going anywhere." (wall
       time: the chapter's clock stands still under the window, d_play.js) */
    const ask5 = { wall: 0 };
    function openDecision() {
      decOpen = true;
      if (kit && kit.vision) kit.vision(false);
      if (getState() === 'play') startDecision();
    }
    function askBegin() {
      lookAt0(LOOK_OF.ask); castPhase('ask'); seatHim(); ask5.wall = 0;
      const run = play.run; after(0.6, () => { if (live(run)) openDecision(); });
    }
    function askPatience(wdt) {
      if (phase !== 'ask' || !decOpen || heard.has('co5t7')) return;
      ask5.wall += wdt;
      if (ask5.wall > 30) { heard.add('co5t7'); if (worldSfx && !(soundOff && soundOff())) worldSfx('co5t7', 1, 1, 0); }
    }

    /* ---------------------------------------------------------------- THE THINGS HE CAN PRESS (each offered only in its
       phase, only while no line is handing off, and never once it is done: derived, so a replay needs nothing put back).
       Every one a tap target on a phone (v12.5: its mark, or the thing itself), each tagged with the ground the walk test
       tries it in (v26.18: GROUNDS, b_xpeople.js) */
    const G_WALK = undefined, G_HUNT = GROUNDS[0].what, G_TABLE = GROUNDS[2].what;
    const headOf = (n, y = 1.62) => () => { const P = castOf(n); const g = P ? P.group.position : { x: 0, z: 0 }; return { x: g.x, y, z: g.z }; };
    const hsTon = { id: 'ton', pos: { x: STATION.walk.ton.x, y: 1.55, z: STATION.walk.ton.z }, radius: 2.3, prompt: W.hotTon, markY: 0.3, hits: markHit5(headOf('ton', 1.55), 0.12),
      enabled: () => phase === 'walk' && !play.busy && !play.found.has('t'), onInteract() { return askOne('t', castOf('ton'), ['q5w1', 'tn5w1', 0.7, 'tn5w2']); } };
    const hsJun = { id: 'jun', pos: { x: STATION.walk.jun.x, y: 1.55, z: STATION.walk.jun.z }, radius: 2.3, prompt: W.hotJun, markY: 0.3, hits: markHit5(headOf('jun', 1.55), 0.12),
      enabled: () => phase === 'walk' && !play.busy && !play.found.has('j'), onInteract() { return askOne('j', castOf('jun'), ['q5w1', 'ju5w1']); } };
    const stainSpot = (c, at, y) => ({ id: 'stain' + c.slice(1), pos: { x: at.x, y, z: at.z }, radius: 1.8, prompt: W.hotStain, markY: 0.2, ground: G_HUNT,
      hits: markHit5(() => ({ x: at.x, y: 0.1, z: at.z }), 0.1),
      enabled: () => phase === 'hunt' && !play.busy && !play.found.has(c) && hunt5.shown.has(c) && hunt5.pending !== c, onInteract() { return lookHere(c); } });
    const lookSpot5 = (c, k, line) => ({ id: 'look' + c.slice(1), pos: { x: TABLE5.P[k].x, y: TABLE5.P[k].y, z: TABLE5.P[k].z }, radius: 3, aim: 0.13, pressAim: true,
      markFar: 3, markY: 0.12, prompt: W.hotLook, ground: G_TABLE, hits: markHit5(presAt(k), 0.07),
      enabled: () => phase === 'table' && !play.busy && play.found.has('m') && visOpen() && !play.found.has(c), onInteract() { return lookPresence(c, line); } });
    const hotspots = [hsTon, hsJun,
      { id: 'drain', pos: { x: FLOOR.DRAIN.x, y: 0.9, z: FLOOR.DRAIN.z }, radius: 1.9, prompt: W.hotDrain, markY: 0.1, hits: markHit5(() => ({ x: FLOOR.DRAIN.x, y: 0.05, z: FLOOR.DRAIN.z }), 0.1),
        enabled: () => phase === 'walk' && !play.busy && walk5.given >= 0 && !play.found.has('d'), onInteract() { return atDrain(); } },
      { id: 'gate', pos: SPOT.gate, radius: 2.0, prompt: W.hotGate,
        enabled: () => phase === 'walk' && !play.busy && walk5.given >= 0, onInteract() { return atGate(); } },
      stainSpot('s1', HUNT5.s1, 0.9), stainSpot('s2', HUNT5.s2, 0.9), stainSpot('s3', HUNT5.s3, 0.9),
      { id: 'armchair', pos: { x: HUNT5.arm.x, y: 1.0, z: HUNT5.arm.z }, radius: 1.8, prompt: W.hotStain, markY: 0.2, ground: G_HUNT, hits: markHit5(() => ({ x: HUNT5.arm.x, y: 0.7, z: HUNT5.arm.z }), 0.1),
        enabled: () => phase === 'hunt' && !play.busy && !play.found.has('a') && hunt5.shown.has('a') && hunt5.pending !== 'a', onInteract() { return lookHere('a'); } },
      { id: 'cleanse', pos: SPOT.court, radius: 2.0, prompt: W.hotCleanse,
        enabled: () => phase === 'fight' && !play.busy, onInteract() { return cleanse(); } },
      lookSpot5('k1', 'angry', 'ph5t1'), lookSpot5('k2', 'hungry', 'ph5t2'), lookSpot5('k3', 'energy', 'ph5t3')
    ];

    /* THE PLAY'S FRAME (d_play.js, in play only, after the line queue): the people who walk with him keep their marks; each
       phase's prompts; SMELL told of where he stood */
    function storyTick(wdt) {
      for (const [h, n] of [[hsTon, 'ton'], [hsJun, 'jun']]) { const P = castOf(n); if (P) { h.pos.x = P.group.position.x; h.pos.z = P.group.position.z; } }
      if (phase === 'walk') walkTick(wdt);
      else if (phase === 'hunt') huntTick();
      else if (phase === 'table') tableTick();
    }
    /* what a press of SMELL means in each phase (c_play.js smellPress tells it) */
    smell.onPress = () => {
      if (phase === 'walk') {
        const sp = wayS(myX(), myZ());
        if (walk5.maxS - sp > 4 && sp < 4.5 && !heard.has('q5w4') && !lineBusy()) say('q5w4');   // "Weaker here." (once)
      } else if (phase === 'hunt') huntSmelled();
      else if (phase === 'table') tableSmelled();
    };
    /* the engine tells the stage every time he opens or shuts his sight (stage.onVision) */
    function onVision(on) {
      if (phase === 'walk' && on) { walkEye(); return; }
      if (phase === 'hunt' || phase === 'table') objectiveFor();
    }

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
      if (kit && kit.pose) kit.pose('standing', { secs: 0.05 });
      if (kit && kit.root) kit.root(false);
      smellButton(false); smell.t = -1;
      if (R.p === 'walk') walkBegin();
      else if (R.p === 'hunt') huntBegin(R.found);
      else if (R.p === 'fight') { castPhase('fight'); fightBegin(); }
      else if (R.p === 'table') tableBegin(R.found);
      else askBegin();
    }
    function storyReset() {
      play.run++; play.busy = false; play.found = new Set(); decOpen = false;
      if (kit && kit.captions) kit.captions(null);
      lookAt0('DUSK');
    }
    function storySnap() { return { phase, found: [...play.found], busy: play.busy, decOpen, look: lookName, smell: smell.presses, heat: +sight.heat.toFixed(3), pending: hunt5.pending, wp: walk5.wp || hunt5.wp }; }

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
      playFrame(wdt, st);                                      // (the play's: SMELL's threads, the walkers, the strain: c_play.js)
      if (st === 'decide') askPatience(wdt);                   // (the collector's patience runs on wall time under the window)
      if (st !== 'play') { if (!pausedAt) pausedAt = now; lastWall = 0; return; }
      if (pausedAt) { const away = Math.max(0, now - pausedAt); pausedAt = 0;
        if (speak.voiceTo > dayClock.t) { const cut = Math.min(away, speak.voiceTo - dayClock.t); speak.until -= cut; speak.voiceTo -= cut; } }
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) { booted = true; applyPhase(kit ? kit.getPhase() : null); }
      runTodo(); runSpeak(); runQueue();
      if (booted) storyTick(wdt);
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
      storyReset(); playReset(); worldReset();
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
      setPhase, applyPhase, onVision,
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
