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

//@@LINES

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
    bounds:    { minX: -13.4, maxX: 2.5, minZ: -19.1, maxZ: 243.0 },   // (R46: the walkway's second run out to z -18.5 and x -12.9)

    ghost: null,
    fireLight: null,
    daylight: DUSK,
    /* (the speed-up of v26.11 that chapters 3 and 4 took: a picture's decoded copy let go once it is on the graphics chip) */
    render: { freePictures: true },
    /* SPIRIT VISION (chapter 4's fiftieth seam, as chapter 4 tuned it: R61, R105), from the hunt on (the walkway holds it
       shut: "Not yet. First your nose."), with this chapter's own copies of its sounds (M10: another chapter's sound named
       here would leave that chapter's pack) */
    vision: { outSecs: 2.2, inSecs: 1.6, band: 0.27, line: 0.24,
              front: 0x3a96ff, glow: 0.32, burn: 3.2, laid: 0.55, linger: 0.7, detail: 1,
              heart: { bpm: 112, rest: 76, sound: 'u5heart', vol: 0.55, secs: 2.2, restSecs: 4.5 },
              sound: { on: 'u5vison', off: 'u5visoff', vol: 0.85, bed: ['u5visbed', 0.56], music: ['u5vismus', 0.32], duck: 0.6 } },
    /* (in the run from its first build: Chad's rule of v27.0, every build a full release; never a preview chapter) */
    /* THE TAG MODE (the sixtieth seam, docs/V28.0-SEAMS.md; the fight's camera, the plan's 5.6 and Chad's "Behind and
       above"): the lens 4.0 m behind and 3.1 m above the one he plays, 26 degrees down, always facing down the court
       toward the house (the court's heading: c_cast.js COURT5); it never passes the gate (the storey above's walkway slab
       begins at z -14.0, docs/V28.0-WORLD.md 4: the fight's stop there draws it in along its line, R37) and keeps inside the side
       walls (R41: where the box holds it short of its boom it keeps its height and looks down at him, his head kept where the
       whole boom puts it on the screen, 50 degrees at most: the engine's crane); it glides 0.4 s at a switch; the switch's lock is the rules' own (FIGHT.NUM switchLock, 0.8 s). The bodies'
       paces and discs are the fight's (c_fightstage.js names them as it opens the mode). c_cast.js boomAt reads this same
       declaration, so the preparation's film ends on exactly the mode's first picture */
    tag: { heading: Math.PI, boom: { back: 4.0, up: 3.1, pitch: 26 }, fov: 72,
           /* (R37, 23 Nov: the court now runs to 0.4 m short of the gate's low wall; at its gate end the box's soft line at
              z -13.9 held the lens there while he walked on under it, out of the bottom of the picture. Its z line is let
              out past the walkway, and the fight's own solid at the gate (b_world.js boomStop, the fight's phase only) draws
              the lens in along its line toward his head instead, the mode's own wall rule: was minZ -13.9) */
           /* (R41, 23 Nov: drawn in along its line, the lens came down half a metre behind his head at the gate end and his
              head filled the picture (the live check of build 30: 1.8 m up). The box's z line is the gate's again (the
              walkway's slab begins at -14.0), the stop R37 put there is retired, and the crane keeps the held lens's height
              and turns it down to him, never past 50 degrees: at the court's gate end his whole body stands in the picture
              and the court before him to the house wall. Was minZ -16.6 with the stop) */
           /* (R46: the court 8.0 by 11.0 m, x -12.5..-4.5 and z -16.6..-5.6: the box 0.3 m inside its side walls, its z line
              at the new gate's (the walkway's slab above begins at -16.6), and high enough for the end's pulled-back boom) */
           camBox: { minX: -12.2, maxX: -4.8, minZ: -16.5, maxZ: -6.0, minY: 1.2, maxY: 5.4 }, crane: { max: 50 }, soft: 0.6, glide: 0.4, lock: 0.8,
           /* (R49 and R50, 23 Nov: Chad, "Instead of a round button to switch betwen pho and zavier, i want a switching ui like
              what final fantasy usually has ... aligned to the right of the screen ... On the desktop, press the 'tab' button":
              the switch drawn as the party list, the engine's sixty-eighth seam; its key Tab, was F) */
           party: {},
           /* (R60, 23 Nov: "Show a floating arrow pointing downwards at the character that is currently under control": the
              engine's seventy-first seam, 2.35 m over his feet, half a metre over either head; R75's debug: on a phone it
              stood under the order's box and the count, so the engine brings it down until it clears them, never lower
              than its point at `head`, 1.95 m, just over either head) */
           arrow: { y: 2.35, head: 1.95 },
           radius: 0.45, speed: 1.2, turn: 16, eye: 1.62, keys: { switch: 'Tab' },
           /* (R25, "sluggish, make it faster and more responsive": a body comes to the stick's pace at 18 a second, 90 % of
              it in 0.13 s where the walk's own 7.6 took 0.30 s; full pace at 0.7 of the stick's travel, 36 px of its 52,
              so a thumb's easy push runs; and turns to its walk at 16 a second, where 9 took 0.26 s for 90 %. The
              engine's seam 60 reads ease and reach; one without them walks as before) */
           ease: 18, reach: 0.7 },

    /* TODO-PLAY, each an engine seam declared when its play is built (the plan's 12): SPIRIT VISION (chapter 4's fiftieth
       seam, with this chapter's own sounds: another chapter's sound named here would leave that chapter's pack), SMELL (a
       HUD button like the eye's, a nose; N on a desktop), and the third-person mode of the fight. Nothing is declared
       until it is played, so no button stands on the screen with nothing behind it. */

    assets: [
      /* the people and the things made for this chapter (masters/v28.0/make.sh): Master Zavier's body, Chad's pick, the
         first of the four made (R10): the lighter body with his walk, and every triangle of him for within 2.2 m and the
         films (v26.5); the Naga stick, from his photograph */
      /* >>> this chapter's own keys: written by masters/v28.0/keys.py (edit its table, not this list) >>> */
      'p5zavier', 'p5zavierh', 'w5nagastaff', 'p5portpho', 'p5portzav', 'p5pho', 'p5koh', 'p5kohm', 'p5kohh',
      'p5jun', 'p5junm', 'p5junh', 'w5rail', 'w5walklight', 'w5grating', 'w5liftpanel', 'w5gate', 'w5gatepost',
      'w5planter', 'w5planter2', 'w5walllamp', 'w5slippers', 'w5frontdoor', 'w5shoecab', 'w5curtain', 'w5sofa',
      'w5lowtable', 'w5tvconsole', 'w5oldchair', 'w5tablelamp', 'w5wallclock', 'w5dintable', 'w5dinchair',
      'w5pendant', 'w5sideboard', 'w5frame', 'w5bagopen', 'w5bagtied', 'w5threadreel', 'w5staffwrap', 'w5staffcloth',
      'w5duffel', 'w5clothtable', 'w5padcase', 'w5cushion', 'w5altarshelf', 'w5ceilfan', 'p5collector', 'p5praicome',
      'p5praihide', 'p5praiheavy', 'p5naga', 'w5wuathanu', 'w5rakyom', 'w5hunphayon',
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
      pho: "Grandmaster Pho, Chad's own model, as chapters 3 and 4 cast him (his look D): seated at the table in case three (standing, he is this chapter's copy of it with finger bones on his right hand, p5pho, R26)",
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
    /* THE BEDS, every one at 0 here: the play's mixer (c_psound.js bedsTick) sets each by the place and the beat, a film
       through BED5.film; each found by its name (c_psound.js BED5_SND). The last three are the play's music (R33: M2 the
       walkway, M4 the hunt, M14 the pieces with his sight open, the plan's 10.2) */
    ambience: { beds: [['u5walkbed', 0], ['u5courtbed', 0], ['u5roombed', 0], ['u5fanroom', 0], ['u5sour', 0], ['u5flies', 0], ['u5clock', 0], ['u5lampbuzz', 0], ['u5threads', 0],
                       ['u5m2walk', 0], ['u5m4hunt', 0], ['u5m14sight', 0]] },
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
      // (R66, 23 Nov: his own two sentences, "bounded" written "bound", "or" written "and" and "prai" with the game's
      //  capital, each said to him; R67: then the controls of the device he is on, one to a line, in very direct terms)
      fightBrief1: 'Switch between Grandmaster Pho and Zavier.',
      fightBrief2: 'Use Zavier to bind each Prai, and use Grandmaster Pho to fire at the bound Prai, and then bag them.',
      // the brief names the input for the device he is on (v18.5); no voice ever names one
      fightInTouch: 'Switch: tap a portrait.\nWalk: drag on the left.\nAct: tap the buttons.',
      fightInKey: 'Switch: Tab.\nWalk: WASD or the arrow keys.\nBind and fire: Space or a click.\nShockwave: Q.\nBag and lend: E.',
      objFight1: 'Grandmaster Pho: fire at the Prai.',
      objFight1b: 'It hid. Master Zavier smells it out.',
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
      // (the switch, said and never pressed, until the lesson's first chase shows it: the engine shows it from the first frame)
      whySwitchFirst: 'Fire first',
      whySwitchNow: 'Not now',
      btnPho: 'PHO',
      btnZavier: 'ZAVIER',
      // (R49: the small line over each name on the party list's tiles)
      btnPhoTitle: 'GRANDMASTER',
      btnZavierTitle: 'MASTER',
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
