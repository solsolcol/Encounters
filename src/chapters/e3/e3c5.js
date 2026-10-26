/* Episode 3 · Chapter 5 · "The Children On My Altar"
   ---------------------------------------------------------------------------
   THE FIFTH AND LAST CHAPTER OF CASE FILE 3, "How It All Began" — S1·10,
   "Opening Myself To My Own Kumanthong". While he was still searching for
   answers he began keeping Kumanthong; one night he deliberately opened
   himself to his own, one after another, and each one took him over in its
   own way.

   THE PURPOSE (Chad, 25 Oct 2026 — every line here is held to it): to clear
   the misconception that Kumanthong are yin baby spirits. Those given a home
   at a temple are kept out of compassion — children with nowhere to go,
   believed to help a kind keeper a little while the merit made for them
   carries them on toward a better birth. Keeping them is a promise for life:
   water, a drink, incense and merit, every day; never for greed; never asked
   for anything wrong. They are felt for, never feared. "This is not just
   cheap horror entertainment and jump scare." (docs/V23.0-E3C5-PLAN.md §2.4
   to §2.7.)

   THREE WORLDS (the far plane is 160 m, v8.9: none is ever drawn from another):
   - WORLD R, x 0: his room at night, the altar under the window and the three
     on it — where he cares for them, and where he opens himself to them.
   - WORLD S, x +250: the Golden Mile owner's shop after closing (chapter 4's
     World H, by its own code) — the opening film, the counter where he meets
     them and makes his promise (play), and the epilogue.
   - WORLD M, x −250: a temple — its hall by candlelight (the counter's film
     M) and at first light (ending D). Seen only in films.

   PREVIEW (the forty-second seam): until its sound is recorded (CP11) the
   chapter declares `preview` — registered, out of the run, opened only by a
   ?ch=e3c5 link; its planned sounds are named in `plannedSounds` and stay
   silent until then.

   docs/V23.0-E3C5-PLAN.md is the build's memory, checkpoint by checkpoint. */

(() => {
  'use strict';

  let S = null;

  /* ---------------------------------------------------- the light presets
     The room's light is ALL presets and painted glows — never a new light
     (v15.1: a light count changed on screen builds shaders on screen). Five
     stops each, so the sky tweens between any two (chapter 4's shape). CP4
     and CP5 tune them by photograph; §10.2 lists the rest to come. */
  const SHOP_EVE = {                // WORLD S after hours: half the shop's tubes on, the corridor dimmer
    stops: [[0.00, '#3a3a3e'], [0.12, '#333338'], [0.35, '#2c2c31'], [0.65, '#25252a'], [1.00, '#1e1e22']],
    bg: 0x1e1e22, fog: [0x26262a, 0.006],
    hemi: [0xf4ecdc, 0x4a4036, 0.78], key: [0xfff0d8, 0.62, 2, 8, 4], fill: [0xc8d4f0, 0.24],
    stars: 0, moon: 0, sun: 0, clouds: 0,
    vmHemi: [0xf4ecdc, 0x4a4036, 0.85], vmKey: [0xfff0d8, 0.66]
  };
  const NIGHT = {                   // WORLD R at 22:50: the desk lamp on, the city through the window
    stops: [[0.00, '#141c30'], [0.12, '#10182a'], [0.35, '#0c1222'], [0.65, '#080c18'], [1.00, '#04060e']],
    bg: 0x060a14, fog: [0x060a14, 0.0004],
    hemi: [0xc8bcae, 0x1a1418, 0.55], key: [0xffc890, 0.55, -2, 3, -1], fill: [0x8a9ad0, 0.16],
    stars: 0, moon: 0, sun: 0, clouds: 0,
    vmHemi: [0xc8b8a0, 0x1a1418, 0.6], vmKey: [0xffc888, 0.55]
  };
  /* THE ROOM'S OTHER LIGHTS (§10.2). Each is the whole room's light at one moment; the frame's `look` (below, in
     build) pairs it with the window's state, the desk lamp and the screens, so the picture and its light change as one.
     DEEP is 02:47 (the lamp off, the city nearly dark); DUSK the home film's arrival; DAWN, MORNING and AFTERNOON the
     days of the endings and the home film's weeks; HARSH is C's 03:33 (every light in the room on, flat and white);
     RED, AMBER and BLUE are the three possessions, each child's own colour; SURFACE is COME BACK (dark water, the light
     above). */
  const room = (o) => Object.assign({ stars: 0, moon: 0, sun: 0, clouds: 0 }, o);
  const DEEP = room({
    stops: [[0.00, '#0a0e1a'], [0.12, '#080b16'], [0.35, '#060912'], [0.65, '#04060c'], [1.00, '#020308']],
    bg: 0x030409, fog: [0x030409, 0.0004],
    hemi: [0x6a78a8, 0x0c0a10, 0.30], key: [0x8a9ad8, 0.16, 6, 3, 1], fill: [0x4a5a8a, 0.10],
    vmHemi: [0x7a88b0, 0x0c0a10, 0.42], vmKey: [0x9aa8d8, 0.22] });
  const DUSK = room({
    stops: [[0.00, '#e8a070'], [0.12, '#c08070'], [0.35, '#6a6488'], [0.65, '#2e3a62'], [1.00, '#141c3a']],
    bg: 0x2a2a44, fog: [0x2a2a44, 0.0004],
    hemi: [0xc8b0a8, 0x2a1e1a, 0.62], key: [0xffa070, 0.62, 6, 2, 1], fill: [0x8a90c8, 0.20],
    vmHemi: [0xd0b8a8, 0x2a1e1a, 0.66], vmKey: [0xffa878, 0.56] });
  const DAWN = room({
    stops: [[0.00, '#dcb8a0'], [0.12, '#c8a49a'], [0.35, '#8a8aa0'], [0.65, '#4a5a7a'], [1.00, '#2a3450']],
    bg: 0x5a6078, fog: [0x5a6078, 0.0004],
    hemi: [0xc0c4d8, 0x2a2a30, 0.66], key: [0xffd0b0, 0.48, 6, 2, 1], fill: [0xa8b0d0, 0.22],
    vmHemi: [0xc8ccdc, 0x2a2a30, 0.72], vmKey: [0xffd8b8, 0.50] });
  const MORNING = room({
    stops: [[0.00, '#e8eef4'], [0.12, '#cfe0ee'], [0.35, '#a8c8e4'], [0.65, '#80aad8'], [1.00, '#5a8cc8']],
    bg: 0xa8c4e0, fog: [0xa8c4e0, 0.0004],
    hemi: [0xf4f2ec, 0x6a6458, 1.10], key: [0xfff4e0, 1.00, 6, 5, 2], fill: [0xc8d8f0, 0.36],
    vmHemi: [0xf4f2ec, 0x6a6458, 1.05], vmKey: [0xfff4e0, 0.85] });
  const AFTERNOON = room({
    stops: [[0.00, '#f4dcb0'], [0.12, '#e8d0a8'], [0.35, '#bcd0e0'], [0.65, '#8fb2d4'], [1.00, '#5f8cc0']],
    bg: 0xb8c4d0, fog: [0xb8c4d0, 0.0004],
    hemi: [0xf8ecd8, 0x6a5a48, 1.05], key: [0xffe0b0, 1.05, 6, 3, -2], fill: [0xc8d0e8, 0.32],
    vmHemi: [0xf8ecd8, 0x6a5a48, 1.0], vmKey: [0xffe4b8, 0.9] });
  const HARSH = room({
    stops: [[0.00, '#0a0e1a'], [0.12, '#080b16'], [0.35, '#060912'], [0.65, '#04060c'], [1.00, '#020308']],
    bg: 0x030409, fog: [0x030409, 0.0004],
    hemi: [0xf4f6f8, 0x8a8a8c, 1.35], key: [0xf8faff, 0.55, 0, 6, 0.5], fill: [0xe8eef8, 0.30],
    vmHemi: [0xf4f6f8, 0x8a8a8c, 1.2], vmKey: [0xf8faff, 0.7] });
  const RED = room({
    stops: [[0.00, '#5a1810'], [0.12, '#481208'], [0.35, '#320c06'], [0.65, '#200804'], [1.00, '#120402']],
    bg: 0x180604, fog: [0x2a0a06, 0.012],
    hemi: [0xff6a4a, 0x2a0604, 0.72], key: [0xff8a5a, 0.70, 6, 2, 1], fill: [0xc83a2a, 0.24],
    vmHemi: [0xff7a5a, 0x2a0604, 0.70], vmKey: [0xff9a6a, 0.6] });
  const AMBER = room({
    stops: [[0.00, '#6a4a18'], [0.12, '#5a3a12'], [0.35, '#42280c'], [0.65, '#2a1806'], [1.00, '#160c02']],
    bg: 0x1c1004, fog: [0x2a1a08, 0.010],
    hemi: [0xffc070, 0x2a1806, 0.70], key: [0xffd090, 0.62, 6, 2, 1], fill: [0xc8904a, 0.22],
    vmHemi: [0xffc880, 0x2a1806, 0.70], vmKey: [0xffd898, 0.58] });
  const BLUE = room({
    stops: [[0.00, '#1a2a4a'], [0.12, '#14223e'], [0.35, '#0e1830'], [0.65, '#080e20'], [1.00, '#040612']],
    bg: 0x060a16, fog: [0x0c1428, 0.010],
    hemi: [0x7aa0e0, 0x0a1020, 0.62], key: [0xa8c4ff, 0.42, 6, 3, 1], fill: [0x4a6ab8, 0.24],
    vmHemi: [0x8aaae0, 0x0a1020, 0.62], vmKey: [0xb0c8ff, 0.5] });
  const SURFACE = room({
    stops: [[0.00, '#0a2a3a'], [0.12, '#08222e'], [0.35, '#061a24'], [0.65, '#04121a'], [1.00, '#020a10']],
    bg: 0x020a10, fog: [0x04141e, 0.035],
    hemi: [0x5ab0c8, 0x020608, 0.48], key: [0x9adcf0, 0.40, 0, 8, 0], fill: [0x2a6a8a, 0.18],
    vmHemi: [0x6ab8d0, 0x020608, 0.55], vmKey: [0xa8e0f0, 0.45] });
  const PRESETS = { NIGHT, DEEP, DUSK, DAWN, MORNING, AFTERNOON, HARSH, RED, AMBER, BLUE, SURFACE, SHOP_EVE };

  const DATA = {
    id: 5,
    episode: 3,
    title: 'The Children On My Altar',
    cardLabel: 'Chapter 5',
    cardTitle: 'The Children On My Altar',
    brief: 'Months into your search, the amulet shop owner at Golden Mile asks you to come by after closing. He has three Kumanthong he wants you to meet, and taking them in would be a promise for life.',
    prompt: 'Almost three in the morning. The three are quiet again. You know now what each of them never had, and you promised to look after them for life. What do you do?',
    /* four different KINDS of answer (v21.30; §4.7): to stay inside them, to tell the world, to keep them for what
       they give, to keep caring with his own door shut */
    choices: [
      { k: 'A', text: 'Open yourself to them again — and stay as long as they want.',
        d: { sanity: -18, awareness: -9, wisdom: -27 }, verdict: 'worst', critical: true,
        say: 'I promised to look after them. In the end, there was no one left to do it.',
        teach: 'Loving them is not becoming them. Even with no ill intent on either side, Kumanthong are regarded in traditional belief as Yin while a living person carries Yang, and immersing yourself in them again and again wears away your own balance. Once you are lost, the care and the merit you promised them stop.' },
      { k: 'B', text: 'Post it all on the amulet forum — let everyone know it\'s real.',
        d: { sanity: -9, awareness: 6, wisdom: -12 }, verdict: 'bad',
        say: 'They were children, not a horror story. I showed strangers the way in.',
        teach: 'They are children, not a horror story. You do not need possession, trance or dramatic manifestations to prove a spiritual connection. Told as a thrill, a dangerous experiment becomes an invitation, and strangers take one in without knowing what it asks of them.' },
      { k: 'C', text: 'Talk to them every day — and wish for everything you want.',
        d: { sanity: -15, awareness: -6, wisdom: -18 }, verdict: 'bad',
        say: 'I stopped giving to them. I only kept asking.',
        teach: 'Do not be driven by greed. Kumanthong kept with compassion are kept first for their sake; whatever help they give is a gift, not a wage, and the ones from a temple are believed never to help with anything wrong. Kept for wealth, care turns into a bargain, and the wanting never stops.' },
      { k: 'D', text: 'Keep caring for them — but never open yourself to them again.',
        d: { sanity: 15, awareness: 24, wisdom: 30 }, verdict: 'best',
        say: 'I kept my promise every day, and I kept my own door shut.',
        teach: 'This is loving kindness: you care for them every day, you make merit in their names, and you ask for nothing back, for as long as you live. That merit, it is believed, is what helps them on toward a better birth. Treat the tradition with respect, and stay in control of yourself.' }
    ],
    /* Chad's purpose first, then S1·10's own lesson; the second person; no Pali tag (§2.3 9); its beliefs said as
       beliefs (§2.7) */
    core: 'Kumanthong given a home at a temple are not the trapped, blood-fed spirits of frightening stories. Kept well, they are kept out of compassion: children with nowhere to go, believed to help a kind keeper a little and to be carried toward a better birth by the merit he makes for them. Never keep one for greed or ask one for anything wrong. Take one in only if you can care for it, and make merit for it, for life — and never invite one to enter or take control of you.',

    /* S42: registered, out of the run, until its sound is recorded (CP11 takes this out) */
    preview: true,

    /* units metres, y up. WORLD R (x 0): the room x −1.6…1.6, z −1.8 (the desk wall) … 1.8 (the door wall), the
       window and the altar on the right wall (x 1.6). WORLD S (x +250): chapter 4's World H by its own numbers under
       a group offset — the shop x −4.5…4.5, z −7…0, the corridor z 0…5, the owner's counter along x 2.9…3.5.
       WORLD M (x −250): seen only in films. Play begins at the counter's front, facing the owner (rev 4). */
    spawn:     { x: 250 + 2.30, y: 1.62, z: -2.45, rot: -Math.PI / 2 },
    shrine:    { x: 1.41, z: 0.40 },          // the engine's anchor (ghost: null): the altar under the window
    ghostHome: { x: 1.41, z: 0.40 },
    bounds:    { minX: -262, maxX: 262, minZ: -10, maxZ: 8 },

    /* NO HAUNTING (the eleventh leak): nothing hunts him — he opens the door himself */
    ghost: null,
    fireLight: null,
    daylight: SHOP_EVE,                      // the world the chapter begins in; the room's NIGHT is a tween away

    /* the three kumanthong (CP1: one file each, a near and a far level over the same vertices); CP4 and CP5 add the
       room's and the shop's, and the temple's */
    assets: ['kumanred', 'kumanshy', 'kumanlittle', 'thaikit', 'buddhahd', 'buddhalod', 'slipper'],   // (the room: the kit's fan, rug, fern and garlands; the shelf's small Buddha; his slippers)
    items: [],

    musicVol: 0,
    /* the beds arrive with the sound (CP11): k5shopair and k5mall at the counter, k5nightbed and k5fan in the room,
       k5deep, k5dawnbed, k5under (§9.3) */
    ambience: { beds: [] },
    voiceLine: null,

    /* the sounds the chapter is written against and that are not recorded yet (§9.2–§9.4) — a preview chapter may
       cue them (chaptertest), and each plays nothing until it has a file; CP11 empties this list */
    plannedSounds: [
      // the opening film, the counter, the home film
      'k5bundle', 'k5figset', 'k5bellsfaint', 'k5wind', 'k5pen', 'k5chantlow', 'k5door', 'k5switch', 'k5unwrap', 'k5rain',
      'k5shutter', 'k5shopbell',
      // the offerings
      'k5bag', 'k5bottleout', 'k5ratchet', 'k5stiff', 'k5seal', 'k5hiss', 'k5capoff', 'k5foam', 'k5tear', 'k5slide',
      'k5bubbles', 'k5plip', 'k5bend', 'k5set', 'k5spark', 'k5flick', 'k5catch', 'k5wave', 'k5sand', 'k5wai',
      // the openings and the three possessions
      'k5loosen', 'k5glint', 'k5rise', 'k5enter', 'k5enter2', 'k5leave', 'k5leave2',
      'k5stamp', 'k5rattle', 'k5thud', 'k5slurp', 'k5slam', 'k5bump',
      'k5scurry', 'k5giggle', 'k5peek', 'k5scuttle', 'k5coin', 'k5bonk',
      'k5bells', 'k5hair', 'k5tick', 'k5pull', 'k5surface',
      // the endings
      'k5calm', 'k5koel', 'k5window', 'k5doorbell', 'k5buzz', 'k5wake', 'k5type', 'k5post', 'k5ping', 'k5scroll', 'k5dm',
      'k5delete', 'k5tape', 'k5slip', 'k5pin', 'k5crumple', 'k5tbell', 'k5pour', 'k5ground', 'k5lights',
      // the beds
      'k5nightbed', 'k5deep', 'k5dawnbed', 'k5under', 'k5fan', 'k5shopair', 'k5mall',
      // the music: one lullaby, told five ways
      'k5lullaby', 'k5theme', 'k5care', 'k5night', 'k5red', 'k5shy', 'k5lonely', 'k5climb', 'k5after',
      'k5endA', 'k5endB', 'k5endC', 'k5endD', 'k5epi'
    ],

    words: {
      approach: '',                          // no floating label (v12.5): the orders name what to do
      act: 'E to act',
      actTouch: 'Tap to act',
      interact: 'E to choose what you do',
      interactTouch: 'Tap to choose what you do',
      actLine: 'Press E to choose what you do',
      actLineTouch: 'Tap to choose what you do',
      // THE COUNTER (rev 4)
      objLookBundle: 'Look at what he has brought out',
      objMeet: 'Meet each of them · {n}/3',
      objCard: 'Read his card',
      objPromise: 'Give him your promise',
      objTake: 'Take them home',
      hotBundle: 'What he has brought out',
      hotRed: 'The red one',
      hotShy: 'The shy one',
      hotLittle: 'The little one',
      hotCard: 'His card',
      hotPromise: 'I promise',
      hotBag: 'Take them home',
      // THE ROOM
      objSit: 'Sit with them',
      hotMat: 'Sit with them'
    },
    sayPrefix: 'z5'
  };

  /* every line's length — the plan's ESTIMATE until CP11 measures the takes (the registry's `est` rows); the line
     queue books its window by it, so a voice never starts over another. The names are QUOTED on purpose: build.py
     gives a sound to a chapter's own pack only when the chapter names it in quotes (v21.1) */
  const SECS = {
    /* the opening film, the counter, the home film */ 'z5pro1': 4.6, 'z5yinq': 8.5, 'z5children': 2.6, 'z5promise': 2.0,
      'z5pro2': 4.4, 'z5pro3': 4.2, 'z5pro4': 6.0,
      'ow5hello': 4.2, 'ow5yin': 15.0, 'ow5monk': 17.5, 'ow5red': 8.0, 'ow5shy': 8.5, 'ow5little': 5.5, 'ow5give': 10.0,
      'ow5never': 8.5, 'ow5wrong': 11.5, 'ow5promise': 16.0, 'ow5careful': 4.5,
    /* the offerings */ 'z5water': 2.4, 'z5bag': 4.6, 'z5red': 2.8, 'z5shy': 2.4, 'z5little': 2.4, 'z5stiff': 1.6, 'z5incense': 1.4,
      'z5eat': 3.0, 'z5dedic': 5.0,
    /* the question and the openings */ 'z5wonder': 3.6, 'z5ask': 5.5, 'z5loose': 2.4,
    /* the red one */ 'z5b1': 2.2, 'z5b2': 2.6, 'z5b3': 1.8, 'z5b4': 2.4, 'z5back1': 2.4, 'z5back1b': 3.6, 'z5again1': 1.4,
    /* the shy one */ 'z5s1': 2.4, 'z5s2': 2.2, 'z5s3': 2.0, 'z5s4': 3.4, 'z5back2': 0.6, 'z5back2b': 4.0, 'z5again2': 2.2,
    /* the little one, and come back */ 'z5l1': 2.2, 'z5l2': 2.2, 'z5l3': 2.6, 'z5sob': 2.0, 'z5out': 6.0, 'z5come': 2.6,
      'z5gasp': 3.0, 'z5time': 2.6, 'z5felt': 5.2, 'z5fasc': 3.6,
    /* A */ 'z5A1': 3.4, 'z5A2': 2.8, 'z5A3': 2.2, 'z5Agig': 1.0, 'z5A4': 2.0, 'z5A5': 4.6, 'z5A6': 4.6, 'ma5vm': 6.0,
    /* B */ 'z5B1': 3.0, 'z5B2': 3.4, 'z5B3': 2.6, 'z5B4': 5.0, 'z5B5': 3.8, 'z5B6': 5.8,
    /* C */ 'z5C1': 2.8, 'z5C2': 3.0, 'z5C3': 5.6, 'z5C4': 5.4, 'z5Cevil': 2.8, 'z5Claugh': 2.5, 'z5C5': 3.2, 'z5C6': 4.6, 'z5C7': 4.4,
    /* D */ 'z5D1': 3.4, 'z5D2': 4.0, 'z5D3': 4.4, 'z5D4': 8.0, 'z5D5': 7.0, 'z5D6': 4.4, 'mk5teach': 6.0, 'mk5yatha': 12.12,
    /* the epilogue */ 'z5epi0': 9.0, 'z5epi1': 7.4, 'z5epi2': 3.0, 'z5epi3': 4.2,
    /* the cards */ 'z5A': 4.4, 'z5B': 4.0, 'z5C': 3.0, 'z5D': 3.6
  };

  const smooth = k => k * k * (3 - 2 * k);
  const cl01 = x => Math.max(0, Math.min(1, x));

  function build(ctx) {
    const { THREE, GLTFLoader, scene, camera, yaw, pitch, LOW, kit, cnv,
            assetBytes, rescueTextures, getState, startDecision, worldSfx, warmSounds, soundOff, unifySkeletons } = ctx;

    /* (the v21.1 TDZ law: everything a builder or a frame asks for is declared up here, before anything is built) */
    const owned = [];
    let alive = true;
    const parsedGlb = new Map();
    const madeTex = [];
    const tex = (t) => { madeTex.push(t); return t; };
    const mats = [];
    const M = (o) => { const m = new THREE.MeshStandardMaterial(o); mats.push(m); return m; };
    const B = (o) => { const m = new THREE.MeshBasicMaterial(o); mats.push(m); return m; };   // unlit: a screen, a glow, a painted view
    /* the room's live parts, read and moved by the frame and the films (declared here, before anything is built: the
       v21.1 dead-zone law) */
    const roomLive = { glow: [], bulb: null, screen: null, monitor: null, drawer: null, clockC: null, clockX: null, clockTex: null, clockShown: '',
                       fan: null, fanK: 1, fanA: 0, louvre: null, louvreT: 0, view: null, viewTex: {}, viewState: '', floorGlow: null,
                       embers: [], door: null, corridor: null, tvGlow: null, box: null, boxLid: null, boxKey: null, boxDrum: null, card: null,
                       cups: [], bowls: [], toys: [], drinkAt: [], jug: null, mat: null, yantPrint: null, yantDone: false, receipts: [], kids: null,
                       screenGlow: [], ceilLamp: null, ceilGlow: [], viewSky: null, viewGround: null, pinwheel: null, yantBoard: null,
                       look: null, lookK: { lamp: 1, screens: 1, ceil: 0 } };
    const wallNow = () => performance.now() / 1000;
    let DESK_DRAWER_Z = -1.49;                            // (the drawer's shut place, set where it is built)

    /* ------------------------------------------------------------- the map */
    const SX = 250, MX = -250;                            // WORLD S's and WORLD M's x
    const ROOM  = { x0: -1.6, x1: 1.6, z0: -1.8, z1: 1.8, H: 2.7 };
    const WIN   = { z0: -0.2, z1: 1.0, y0: 0.9, y1: 2.1 };            // on the right wall (x 1.6)
    const ALTAR = { x0: 1.12, x1: 1.60, z0: -0.30, z1: 1.10, top: 0.70, riser: 0.10 };
    /* (CP4, by photograph: the cabinet is 0.48 deep, so the riser stands clear of the window's sill — the first one, at the
       wall, put the sill through the three's legs — and the offerings lie in three rows on the runner in front of each,
       §4.1 1: the cup and the drink at the back, the bowl of sand in the middle, the sweets and the toy at the front) */
    const RISER = { x: 1.47, d: 0.14, z0: -0.14, z1: 0.94 };
    const ROW = { back: 1.345, mid: 1.262, front: 1.175 };
    const MAT   = { x: 0.62, z: 0.40 };                   // where he sits, before the altar, facing it (+x)
    const DESK  = { x0: -1.0, x1: 0.3, z0: -1.8, z1: -1.22, top: 0.74 };
    const BED   = { x0: -1.6, x1: -0.64, z0: -0.6, z1: 1.4, top: 0.48 };   // chapter 4's bed, its head to the back (the films sit on it)
    const DOOR  = { x: 0.9, w: 0.84, h: 2.05 };           // on the front wall (z 1.8)
    const R_ARRIVE = { x: 0.9, z: 1.25 };                 // just inside the door, facing into the room
    const SHOP  = { x0: -4.5, x1: 4.5, z0: -7.0, z1: 0.0, H: 2.9 };   // WORLD S, local (chapter 4's World H numbers)
    const MALL  = { x0: -14, x1: 14, z0: 0.0, z1: 5.0, H: 3.6 };
    const RCNT  = { x0: 2.9, x1: 3.5, z0: -1.0, z1: -3.9, top: 1.0 };   // the owner's counter, its face to −x
    const OWN   = { x: 3.98, z: -2.45 };                  // the owner, behind it, facing −x
    const S_SPAWN = { x: SX + 2.30, z: -2.45 };           // the counter's front, facing him (DATA.spawn)
    /* the three, LEFT to RIGHT as he faces them (he faces +x at both, so left is −z): the red one, the shy one, the
       little one — heights in metres with their bases (§4.1 1) */
    const KIDS = [
      { key: 'red',    asset: 'kumanred',    h: 0.26, slot: 0, preset: 'RED',   lens: 84, motif: 'k5red',    toy: 'car',      capTurns: 1.5, yieldSecs: 4.0 },
      { key: 'shy',    asset: 'kumanshy',    h: 0.20, slot: 1, preset: 'AMBER', lens: 90, motif: 'k5shy',    toy: 'ball',     capTurns: 1.5, yieldSecs: 2.0 },
      { key: 'little', asset: 'kumanlittle', h: 0.24, slot: 2, preset: 'BLUE',  lens: 62, motif: 'k5lonely', toy: 'pinwheel', capTurns: 2.0, yieldSecs: 0.6, auto: true }
    ];
    const ALTAR_Z = [0.05, 0.40, 0.75];                   // each one's place along the riser
    const CNT_Z = [-2.75, -2.45, -2.15];                  // and on the red cloth on the glass
    const KID_LOD = 0.55;                                 // the near level inside this (§6: only for a figure in macro — the mat is 0.88 m off)
    const KID_DIST = 1.25;                                // and the lightest past this (the door, the bed: §6, CP4's measure)

    /* ----------------------------------------------------------- materials */
    const matWallS  = M({ color: 0xf1ece2, roughness: 0.92 });    // WORLD S (CP5 ports chapter 4's World H)
    const matFloorS = M({ color: 0xd8d0c0, roughness: 0.35 });
    const matMall   = M({ color: 0x8a8478, roughness: 0.5 });
    const matWallM  = M({ color: 0xe6dccb, roughness: 0.9 });     // WORLD M (CP5 ports chapter 4's temple)
    const matFloorM = M({ color: 0x9a7a52, roughness: 0.4 });
    const matWood   = M({ color: 0x3e2414, roughness: 0.5 });
    const matRed    = M({ color: 0x8e1d14, roughness: 0.6 });
    const matGlass  = M({ color: 0xbfd8d8, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.35 });
    const matProxy  = M({ color: 0x8d7a66, roughness: 0.9 });

    const world = new THREE.Group();
    scene.add(world);
    const worldR = new THREE.Group(); world.add(worldR);
    const worldS = new THREE.Group(); worldS.position.x = SX; world.add(worldS);   // its own numbers, offset
    const worldM = new THREE.Group(); worldM.position.x = MX; worldM.visible = false; world.add(worldM);

    const walls = [], solids = [];
    const box = (w, h, d, x, y, z, mat, parent = world, cast = true) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z); m.castShadow = cast && !LOW; m.receiveShadow = true;
      parent.add(m); return m;
    };
    const floorAt = (w, d, x, z, mat, parent) => {
      const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
      f.rotation.x = -Math.PI / 2; f.position.set(x, 0, z); f.receiveShadow = true; parent.add(f); return f;
    };
    const ceilAt = (w, d, x, y, z, mat, parent) => {
      const c = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
      c.rotation.x = Math.PI / 2; c.position.set(x, y, z); parent.add(c); return c;
    };

    /* ------------------------------------------------- one parse per asset */
    function parseOnce(key) {
      if (!parsedGlb.has(key)) {
        parsedGlb.set(key, assetBytes(key).then(BUF => new Promise((res, rej) =>
          new GLTFLoader().parse(BUF, '', (gltf) => {
            rescueTextures(gltf, BUF);
            if (unifySkeletons) unifySkeletons(gltf.scene);
            res({ scene: gltf.scene, animations: gltf.animations });
          }, rej))));
      }
      return parsedGlb.get(key);
    }

    /* ================================================ WORLD R · HIS ROOM (CP4)
       Chapter 4's room, by its own code and numbers (its `buildRoom`: the walls round the window, the desk and its
       drawer, the lamp and its painted pool, the laptop, the clocks, the medium's talisman, the bed, the shelf and the
       small Buddha, the door), BUILT OUT for a night of care (§4.1): the altar under the window and the three on it,
       the window's four states, the bed and the desk made real, his ROADEYE cartons, the wardrobe, a ceiling fan, the
       aircon, the calendar and the cork board, the shelf's books, the floor's things, the door onto the dark flat.
       Every light here is painted (v15.1: the light count never changes on screen) — the lamp's pool and its glow up
       the wall, the window's on the floor, the three embers, the screens, the LEDs. The walls are chapter 4's tiled
       planes; what a player walks against is an invisible box behind each (`hidBox`, collision reads it drawn or
       not). */
    const cyl = (r0, r1, h, x, y, z, mat, seg = 14, parent = world) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, h, seg), mat);
      m.position.set(x, y, z); m.castShadow = !LOW; m.receiveShadow = true;
      parent.add(m); return m;
    };
    const hidBox = (w, h, d, x, y, z, parent) => { const m = box(w, h, d, x, y, z, matProxy, parent, false); m.visible = false; return m; };
    const tGlow = tex(makeGlowT(THREE, cnv));
    function glowP(w, h, color, op, x, y, z, rx, ry, parent = worldR) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), B({ map: tGlow, color, transparent: true, opacity: op, depthWrite: false,
        blending: THREE.AdditiveBlending, toneMapped: false, fog: false }));
      m.position.set(x, y, z); m.rotation.set(rx || 0, ry || 0, 0, 'YXZ'); m.renderOrder = 4; m.userData.op = op; parent.add(m); return m;
    }
    function roomClock(str) {
      if (!roomLive.clockC || roomLive.clockShown === str) return;
      roomLive.clockShown = str;
      const x = roomLive.clockX, c = roomLive.clockC;
      x.fillStyle = '#060404'; x.fillRect(0, 0, c.width, c.height);
      x.font = 'bold 84px monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillStyle = 'rgba(255,40,30,0.12)'; x.fillText('88:88', 128, 58);
      x.fillStyle = '#ff3a24'; x.shadowColor = '#ff2a10'; x.shadowBlur = 14; x.fillText(str, 128, 58); x.shadowBlur = 0;
      roomLive.clockTex.needsUpdate = true;
    }
    /* the window's view: four painted states (and the day's), one plane, its map swapped (§4.1 2, V12); behind it the
       state's own sky and ground, so a look up or down through the glass never finds the edge of the painting */
    function setWindow(state) {
      if (!roomLive.view || roomLive.viewState === state) return;
      if (!roomLive.viewTex[state]) roomLive.viewTex[state] = tex(makeWindowT(THREE, cnv, state));
      roomLive.view.material.map = roomLive.viewTex[state]; roomLive.view.material.needsUpdate = true;
      roomLive.viewState = state;
      const S = WIN_STATES[state] || WIN_STATES.night;
      if (roomLive.viewSky) roomLive.viewSky.material.color.set(S.sky[0][1]);
      if (roomLive.viewGround) roomLive.viewGround.material.color.set(S.ground);
      const FG = { dusk: [0xffb27a, 0.12], night: [0x8aa4d8, 0.16], late: [0x6a80b8, 0.10], dawn: [0xd8c8e8, 0.20], day: [0xfff4e0, 0.30] }[state] || [0x8aa4d8, 0.16];
      if (roomLive.floorGlow) { roomLive.floorGlow.material.color.setHex(FG[0]); roomLive.floorGlow.userData.op = FG[1]; }
    }
    /* THE ROOM'S LOOKS (§10.2): a preset of the light, the window's state, the desk lamp (its bulb and its three painted
       glows), the screens and the ceiling lamp, set as one, so the picture and its light change together. The glows ease
       on wall time over the same seconds as the light (the frame, `lookFrame`). */
    const LOOKS = {
      NIGHT:     { win: 'night', lamp: 1,    screens: 1,    ceil: 0 },
      DEEP:      { win: 'late',  lamp: 0,    screens: 0,    ceil: 0 },
      DUSK:      { win: 'dusk',  lamp: 0,    screens: 0,    ceil: 0 },
      DAWN:      { win: 'dawn',  lamp: 0,    screens: 0,    ceil: 0 },
      MORNING:   { win: 'day',   lamp: 0,    screens: 0,    ceil: 0 },
      AFTERNOON: { win: 'day',   lamp: 0,    screens: 0.7,  ceil: 0 },
      HARSH:     { win: 'late',  lamp: 1,    screens: 1,    ceil: 1 },
      RED:       { win: 'night', lamp: 0.25, screens: 0.3,  ceil: 0 },
      AMBER:     { win: 'night', lamp: 0.25, screens: 0.3,  ceil: 0 },
      BLUE:      { win: 'late',  lamp: 0.15, screens: 0.2,  ceil: 0 },
      SURFACE:   { win: 'late',  lamp: 0,    screens: 0,    ceil: 0 }
    };
    function look(name, secs = 0) {
      const L = LOOKS[name];
      if (!L) return;
      if (kit) kit.daylight(PRESETS[name], secs);
      setWindow(L.win);
      const k = roomLive.lookK;
      roomLive.look = { name, from: { lamp: k.lamp, screens: k.screens, ceil: k.ceil }, to: L, t0: wallNow(), secs: Math.max(0, secs) };
      if (!(secs > 0)) lookFrame(true);
    }
    function lookFrame(snapNow) {
      const L = roomLive.look;
      if (!L) return;
      const u = snapNow || !(L.secs > 0) ? 1 : smooth(cl01((wallNow() - L.t0) / L.secs)), k = roomLive.lookK;
      for (const key of ['lamp', 'screens', 'ceil']) k[key] = L.from[key] + (L.to[key] - L.from[key]) * u;
      for (const g of roomLive.glow) g.material.opacity = g.userData.op * k.lamp;
      if (roomLive.bulb) { roomLive.bulb.visible = k.lamp > 0.04; roomLive.bulb.material.color.setRGB(0.05 + 0.95 * k.lamp, 0.05 + 0.89 * k.lamp, 0.05 + 0.73 * k.lamp); }
      for (const s of roomLive.screenGlow) s.material.opacity = s.userData.op * k.screens;
      for (const s of [roomLive.screen, roomLive.monitor]) if (s) s.material.color.setScalar(0.06 + 0.94 * k.screens);
      if (roomLive.ceilLamp) { roomLive.ceilLamp.material.color.setScalar(0.9 + 0.1 * k.ceil); roomLive.ceilLamp.material.emissiveIntensity = 1.4 * k.ceil; }
      for (const g of roomLive.ceilGlow) { g.visible = k.ceil > 0.02; g.material.opacity = g.userData.op * k.ceil; }
      if (roomLive.floorGlow) roomLive.floorGlow.material.opacity = roomLive.floorGlow.userData.op;
      if (u >= 1) roomLive.look = null;
    }
    /* THE THAI KIT (v16.6's file) and CHAD'S BUDDHA (v18.8), chapter 4's own helpers, copied: one parse, every piece a
       clone; `fit` scales a piece so its longest level side spans that many metres */
    const BUDDHA_H = 0.527, BUDDHA_ENV = 0.15, _bMat = new Map();
    function buddhaMat(m) {
      let c = _bMat.get(m);
      if (!c) { c = m.clone(); c.envMap = scene.environment || null; c.envMapIntensity = BUDDHA_ENV; _bMat.set(m, c); owned.push({ dispose: () => c.dispose() }); }
      return c;
    }
    function chadBuddha(g, o) {
      Promise.all([parseOnce('buddhahd'), parseOnce('buddhalod')]).then(([hd, lo]) => {
        if (!alive) return;
        const bb = new THREE.Box3().setFromObject(hd.scene), k = BUDDHA_H / (bb.max.y - bb.min.y), h = BUDDHA_H * (o.s || 1);
        const lod = new THREE.LOD();
        const level = (src, d) => {
          const w = new THREE.Group(); w.scale.setScalar(k); w.position.y = -bb.min.y * k;
          const m = src.clone(true); w.add(m);
          m.traverse(q => { if (!q.isMesh) return; q.castShadow = o.cast !== false && !LOW; q.receiveShadow = true; q.material = buddhaMat(q.material); });
          lod.addLevel(w, d);
        };
        level(lo.scene.getObjectByName('buddha_mid'), 0);
        level(lo.scene.getObjectByName('buddha_far'), 4 * h);
        g.add(lod);
      }).catch(err => { console.warn('buddha failed to load', err); ctx.loadFail && ctx.loadFail('buddhahd', err); });
      return g;
    }
    function thai(name, x, y, z, o = {}) {
      const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = o.ry || 0;
      if (o.s) g.scale.setScalar(o.s);
      (o.parent || world).add(g);
      if (name === 'buddha') return chadBuddha(g, o);
      parseOnce('thaikit').then(gltf => {
        if (!alive) return;
        const src = gltf.scene.getObjectByName('thai_' + name);
        if (!src) throw new Error('thaikit has no thai_' + name);
        const m = src.clone(true);
        m.position.set(0, 0, 0);
        m.traverse(q => {
          if (!q.isMesh) return;
          q.castShadow = o.cast !== false && !LOW; q.receiveShadow = true;
          if (o.tint) { q.material = q.material.clone(); q.material.color.multiply(new THREE.Color(o.tint)); owned.push({ dispose: () => q.material.dispose() }); }
        });
        if (o.fit) {
          m.updateMatrixWorld(true);
          const bb = new THREE.Box3().setFromObject(m), sz = bb.getSize(new THREE.Vector3());
          m.scale.setScalar(o.fit / Math.max(1e-4, Math.max(sz.x, sz.z)));
        }
        g.add(m);
        if (o.then) o.then(g, m);
      }).catch(err => { console.warn('thaikit failed to load', err); ctx.loadFail && ctx.loadFail('thaikit', err); });
      return g;
    }

    function buildRoomR() {
      const R = worldR, W = ROOM.x1 - ROOM.x0, D = ROOM.z1 - ROOM.z0, H = ROOM.H, x0 = ROOM.x0, x1 = ROOM.x1, z0 = ROOM.z0, z1 = ROOM.z1;
      const mWall = M({ map: tex(makeRoomWallT(THREE, cnv)), color: 0xc4ccd2, roughness: 0.94 });
      const mFloor = M({ map: tex(makeTeak(THREE, cnv, 5101)), color: 0xa88a6a, roughness: 0.6 });
      const mCeil = M({ color: 0xe4e6e2, roughness: 0.95 });
      const mWood = M({ map: tex(makeTeak(THREE, cnv, 5107)), color: 0x9a7452, roughness: 0.55 });
      const mWhite = M({ color: 0xeceae4, roughness: 0.6 });
      const mDark = M({ color: 0x1e1e22, roughness: 0.5, metalness: 0.2 });
      const mSteel = M({ color: 0x8a8e94, roughness: 0.35, metalness: 0.7 });
      const mBrass = M({ color: 0xc8a050, roughness: 0.3, metalness: 0.85 });
      const tiled = (w, h, mat, per, x, y, z, ry = 0, rx = 0) => {
        const geo = new THREE.PlaneGeometry(w, h), uv = geo.attributes.uv;
        for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / per, uv.getY(i) * h / per);
        const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, 0, 'YXZ'); m.receiveShadow = false; R.add(m); return m;
      };
      /* ---- the shell (chapter 4's), and behind each wall the box a player walks against */
      tiled(W, D, mFloor, 1.0, 0, 0, 0, 0, -Math.PI / 2);
      tiled(W, D, mCeil, 3.6, 0, H, 0, 0, Math.PI / 2);
      tiled(W, H, mWall, 1.6, 0, H / 2, z0, 0);                                      // the back wall (the desk's)
      tiled(D, H, mWall, 1.6, x0, H / 2, 0, Math.PI / 2);                            // the left (the bed's)
      const WZ0 = WIN.z0, WZ1 = WIN.z1, WY0 = WIN.y0, WY1 = WIN.y1;
      tiled(D, WY0, mWall, 1.6, x1, WY0 / 2, 0, -Math.PI / 2);                       // the right, round its window
      tiled(D, H - WY1, mWall, 1.6, x1, (H + WY1) / 2, 0, -Math.PI / 2);
      tiled(WZ0 - z0, WY1 - WY0, mWall, 1.6, x1, (WY0 + WY1) / 2, (z0 + WZ0) / 2, -Math.PI / 2);
      tiled(z1 - WZ1, WY1 - WY0, mWall, 1.6, x1, (WY0 + WY1) / 2, (WZ1 + z1) / 2, -Math.PI / 2);
      // the front wall, round its door (the door hangs in it, and opens onto the flat's corridor)
      const dL = DOOR.x - DOOR.w / 2, dR = DOOR.x + DOOR.w / 2;
      tiled(dL - x0, H, mWall, 1.6, (x0 + dL) / 2, H / 2, z1, Math.PI);
      tiled(x1 - dR, H, mWall, 1.6, (dR + x1) / 2, H / 2, z1, Math.PI);
      tiled(DOOR.w, H - DOOR.h, mWall, 1.6, DOOR.x, DOOR.h + (H - DOOR.h) / 2, z1, Math.PI);
      for (const [w, d, x, z] of [[W, 0.02, 0, z0 + 0.01], [dL - x0, 0.02, (x0 + dL) / 2, z1 - 0.01], [x1 - dR, 0.02, (dR + x1) / 2, z1 - 0.01],
                                  [0.02, D, x0 + 0.01, 0], [0.02, D, x1 - 0.01, 0]]) box(w, 0.09, d, x, 0.045, z, mWhite, R, false);   // the skirting
      const T = 0.1;
      walls.push(hidBox(W + 2 * T, H, T, 0, H / 2, z0 - T / 2, R));
      walls.push(hidBox(T, H, D, x0 - T / 2, H / 2, 0, R));
      walls.push(hidBox(T, H, D, x1 + T / 2, H / 2, 0, R));
      walls.push(hidBox(dL - x0, H, T, (x0 + dL) / 2, H / 2, z1 + T / 2, R));
      walls.push(hidBox(x1 - dR, H, T, (dR + x1) / 2, H / 2, z1 + T / 2, R));
      walls.push(hidBox(DOOR.w, H, T, DOOR.x, H / 2, z1 + T / 2 + 0.06, R));         // the doorway: he never walks out of it in play
      /* ---- the window: frame, mullion, the grille outside it, the glass, the view (four states), the curtains half
         drawn and tied back, the fern on the sill */
      const fr = M({ color: 0xd8dad6, roughness: 0.4, metalness: 0.3 });
      for (const [w, h, y, z] of [[0.06, WY1 - WY0 + 0.06, (WY0 + WY1) / 2, WZ0], [0.06, WY1 - WY0 + 0.06, (WY0 + WY1) / 2, WZ1], [0.06, 0.05, WY0, (WZ0 + WZ1) / 2],
                                  [0.06, 0.05, WY1, (WZ0 + WZ1) / 2],
                                  // (three panes, not chapter 4's two: its one mullion stood straight behind the shy one, in the
                                  // middle of the altar; these two fall between the three, so each stands in his own pane)
                                  [0.05, WY1 - WY0, (WY0 + WY1) / 2, WZ0 + (WZ1 - WZ0) / 3], [0.05, WY1 - WY0, (WY0 + WY1) / 2, WZ0 + 2 * (WZ1 - WZ0) / 3]]) box(0.06, h, w === 0.06 && h === 0.05 ? WZ1 - WZ0 : w === 0.05 ? 0.04 : 0.06, x1, y, z, fr, R, false);
      box(0.05, 0.025, WZ1 - WZ0 + 0.1, x1 - 0.025, WY0 - 0.012, (WZ0 + WZ1) / 2, M({ color: 0x9a968e, roughness: 0.7 }), R, false);    // the sill (painted concrete; shallow, the three stand in front of it)
      { const gr = M({ color: 0x3a3e44, roughness: 0.5, metalness: 0.6 });                              // the HDB grille, outside the glass
        for (let k = 1; k < 8; k++) box(0.012, WY1 - WY0, 0.012, x1 + 0.05, (WY0 + WY1) / 2, WZ0 + (WZ1 - WZ0) * k / 8, gr, R, false);
        for (const y of [WY0 + 0.03, (WY0 + WY1) / 2, WY1 - 0.03]) box(0.012, 0.012, WZ1 - WZ0, x1 + 0.05, y, (WZ0 + WZ1) / 2, gr, R, false); }
      { const g = new THREE.Mesh(new THREE.PlaneGeometry(WZ1 - WZ0, WY1 - WY0), B({ color: 0x0a1220, transparent: true, opacity: 0.30, depthWrite: false }));
        g.position.set(x1 + 0.01, (WY0 + WY1) / 2, (WZ0 + WZ1) / 2); g.rotation.y = -Math.PI / 2; g.renderOrder = 6; R.add(g);
        const v = new THREE.Mesh(new THREE.PlaneGeometry(14, 9), B({ toneMapped: false, fog: false }));
        v.position.set(x1 + 6.5, 2.4, 0.4); v.rotation.y = -Math.PI / 2; R.add(v); roomLive.view = v;
        // the state's sky above the painting and its ground below it (a glance up or down through the glass from the mat
        // reaches past the painting's edges)
        const sk = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), B({ color: 0x05070f, toneMapped: false, fog: false }));
        sk.position.set(x1 + 6.7, 2.4, 0.4); sk.rotation.y = -Math.PI / 2; R.add(sk); roomLive.viewSky = sk;
        const gd = new THREE.Mesh(new THREE.PlaneGeometry(60, 20), B({ color: 0x06070a, toneMapped: false, fog: false }));
        gd.position.set(x1 + 6.6, -2.1 - 10 + 0.04, 0.4); gd.rotation.y = -Math.PI / 2; R.add(gd); roomLive.viewGround = gd; }
      /* the curtains, tied back at the window's sides and hanging only to the sill: the altar stands under the window
         and the three in front of its lower edge (chapter 4's curtains reached 0.61 m and were drawn half across, which
         here put a curtain in front of the red one and through the altar's top) */
      { const cm = M({ color: 0x7a8aa0, roughness: 0.96, side: THREE.DoubleSide });
        const CY0 = WY0 + 0.03, CY1 = 2.24, CL = CY1 - CY0;
        for (let i = 0; i < 6; i++) { const s = i < 3 ? -1 : 1, k = i % 3;
          const p = new THREE.Mesh(new THREE.PlaneGeometry(0.13, CL), cm);
          p.position.set(x1 - 0.12 - 0.022 * (k % 2), (CY0 + CY1) / 2, s < 0 ? WZ0 - 0.1 + k * 0.05 : WZ1 + 0.1 - k * 0.05);
          p.rotation.y = -Math.PI / 2 + (k % 2 ? 0.5 : -0.5); R.add(p); }
        for (const z of [WZ0 - 0.06, WZ1 + 0.06]) { const tb = cyl(0.012, 0.012, 0.16, x1 - 0.1, 1.25, z, M({ color: 0xc8b07a, roughness: 0.6 }), 8, R); tb.rotation.x = Math.PI / 2; }   // the tie-backs
        box(0.03, 0.03, WZ1 - WZ0 + 0.8, x1 - 0.12, 2.25, (WZ0 + WZ1) / 2, mDark, R, false); }
      thai('fern', 1.40, 0, 1.46, { parent: R, fit: 0.36, cast: false });             // a potted fern in the corner past the altar's end
      solids.push(hidBox(0.34, 0.6, 0.34, 1.40, 0.3, 1.46, R));
      roomLive.floorGlow = glowP(1.4, 1.8, 0x8aa4d8, 0.16, 0.7, 0.012, 0.45, -Math.PI / 2);
      setWindow('night');
      /* ---- THE DESK (chapter 4's), made real: its drawer, the lamp and its pool, the laptop, the second monitor on an
         arm with his dashboard, a dashcam on its stand, a notebook and pen, a mug on a coaster, his phone, the alarm
         clock, a charging cable; the office chair before it */
      const DT = DESK.top, DX0 = DESK.x0, DX1 = DESK.x1, DZ = -1.49;
      box(DX1 - DX0, 0.035, 0.62, (DX0 + DX1) / 2, DT, DZ, mWood, R, false);
      box(0.03, DT, 0.58, DX0 + 0.03, DT / 2, DZ, mWood, R, false);
      box(0.42, DT - 0.04, 0.58, DX1 - 0.21, (DT - 0.04) / 2, DZ, mWood, R, false);
      box(DX1 - 0.42 - (DX0 + 0.045), 0.72, 0.015, (DX1 - 0.42 + DX0 + 0.045) / 2, 0.36, DZ - 0.27, mWood, R, false);
      for (const y of [0.42, 0.22]) box(0.38, 0.17, 0.012, DX1 - 0.21, y, DZ + 0.296, mWood, R, false);
      { const dr = new THREE.Group(); dr.position.set(DX1 - 0.21, 0.6, DZ); R.add(dr); DESK_DRAWER_Z = DZ;
        box(0.38, 0.14, 0.012, 0, 0, 0.296, mWood, dr, false);
        box(0.34, 0.1, 0.5, 0, -0.005, 0.03, M({ color: 0x6a5038, roughness: 0.7 }), dr, false);
        box(0.08, 0.012, 0.02, 0, 0.0, 0.31, M({ color: 0xb8b4a8, roughness: 0.3, metalness: 0.8 }), dr, false);
        roomLive.drawer = dr; }
      solids.push(hidBox(DX1 - DX0, DT, 0.62, (DX0 + DX1) / 2, DT / 2, DZ, R));
      { const L = new THREE.Group(); L.position.set(-0.82, DT + 0.018, -1.62); R.add(L);
        const mg = M({ color: 0x24402e, roughness: 0.35, metalness: 0.4, side: THREE.DoubleSide });
        cyl(0.07, 0.08, 0.025, 0, 0.012, 0, mg, 20, L);
        const a1 = cyl(0.009, 0.009, 0.36, 0.02, 0.19, 0.02, mDark, 8, L); a1.rotation.z = -0.12;
        const a2 = cyl(0.008, 0.008, 0.3, 0.13, 0.38, 0.1, mDark, 8, L); a2.rotation.set(0.6, 0, -0.9);
        const sh = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.13, 20, 1, true), mg); sh.position.set(0.25, 0.37, 0.2); sh.rotation.set(-0.55, 0, 0.35); L.add(sh);
        const bl = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 8), B({ color: 0xfff0c8, toneMapped: false }));
        bl.position.set(0.24, 0.33, 0.21); L.add(bl); roomLive.bulb = bl; }
      roomLive.glow.push(glowP(1.25, 1.0, 0xffcc80, 0.55, -0.42, DT + 0.022, -1.38, -Math.PI / 2));
      roomLive.glow.push(glowP(1.9, 1.6, 0xffc070, 0.32, -0.55, 1.15, z0 + 0.03));     // (in front of the board and the papers, so it lights them too)
      roomLive.glow.push(glowP(0.42, 0.42, 0xfff0c8, 0.6, -0.58, DT + 0.33, -1.42));
      { const lp = new THREE.Group(); lp.position.set(-0.2, DT + 0.018, -1.43); lp.rotation.y = -0.08; R.add(lp);
        box(0.33, 0.014, 0.23, 0, 0.007, 0, M({ color: 0x3a3c40, roughness: 0.4, metalness: 0.5 }), lp, false);
        const hinge = new THREE.Group(); hinge.position.set(0, 0.014, -0.112); hinge.rotation.x = -0.3; lp.add(hinge);
        box(0.33, 0.215, 0.008, 0, 0.108, 0, M({ color: 0x2a2c30, roughness: 0.4, metalness: 0.5 }), hinge, false);
        const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.31, 0.195), B({ map: tex(makeLaptopT(THREE, cnv)), toneMapped: false }));
        scr.position.set(0, 0.108, 0.0045); hinge.add(scr); roomLive.screen = scr;
        roomLive.screenGlow.push(glowP(0.7, 0.5, 0xb8d0ff, 0.12, -0.2, DT + 0.021, -1.2, -Math.PI / 2)); }
      { const mon = new THREE.Group(); mon.position.set(0.12, DT + 0.018, -1.68); mon.rotation.y = -0.18; R.add(mon);   // the second monitor, on its arm
        cyl(0.05, 0.06, 0.02, 0, 0.01, 0, mDark, 16, mon);
        cyl(0.012, 0.012, 0.3, 0, 0.16, 0, mDark, 8, mon);
        box(0.44, 0.27, 0.02, 0, 0.42, 0.03, mDark, mon, false);
        const ms = new THREE.Mesh(new THREE.PlaneGeometry(0.41, 0.24), B({ map: tex(makeDashboardT(THREE, cnv)), toneMapped: false }));
        ms.position.set(0, 0.42, 0.041); mon.add(ms); roomLive.monitor = ms;
        roomLive.screenGlow.push(glowP(0.8, 0.6, 0x8ab0d8, 0.10, 0.08, 1.1, z0 + 0.014)); }
      { const dc = new THREE.Group(); dc.position.set(-0.55, DT + 0.018, -1.25); dc.rotation.y = 0.5; R.add(dc);   // his product sample on its little stand
        cyl(0.012, 0.016, 0.05, 0, 0.025, 0, mDark, 10, dc);
        box(0.07, 0.035, 0.04, 0, 0.068, 0, M({ color: 0x14161a, roughness: 0.3, metalness: 0.5 }), dc, false);
        const lens = cyl(0.012, 0.012, 0.012, 0, 0.068, 0.024, M({ color: 0x0a0c10, roughness: 0.05, metalness: 0.8 }), 14, dc); lens.rotation.x = Math.PI / 2; }
      { const nb = box(0.15, 0.012, 0.21, -0.48, DT + 0.024, -1.36, M({ color: 0x2a3a5a, roughness: 0.8 }), R, false); nb.rotation.y = 0.18;   // a notebook and its pen
        const pen = cyl(0.004, 0.004, 0.14, -0.4, DT + 0.034, -1.34, M({ color: 0x14141a, roughness: 0.3 }), 8, R); pen.rotation.set(Math.PI / 2, 0, 0.6); }
      { const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.036, 0.095, 18), M({ color: 0xe8e2d6, roughness: 0.5 })); mug.position.set(0.17, DT + 0.07, -1.33); R.add(mug);
        cyl(0.05, 0.05, 0.005, 0.17, DT + 0.02, -1.33, M({ color: 0x6a4a2a, roughness: 0.8 }), 20, R);                                   // its coaster
        box(0.075, 0.008, 0.15, 0.06, DT + 0.022, -1.24, M({ color: 0x14161a, roughness: 0.3, metalness: 0.4 }), R, false);              // his phone
        const cab = cyl(0.003, 0.003, 0.5, 0.0, DT + 0.021, -1.32, mWhite, 6, R); cab.rotation.set(0, 0.9, Math.PI / 2);                  // its cable
        const ac = new THREE.Group(); ac.position.set(0.24, DT + 0.018, -1.62); ac.rotation.y = -0.35; R.add(ac);
        cyl(0.05, 0.05, 0.03, 0, 0.065, 0, M({ color: 0xa83a2a, roughness: 0.4, metalness: 0.3 }), 20, ac).rotation.x = Math.PI / 2;
        const face = new THREE.Mesh(new THREE.CircleGeometry(0.042, 24), M({ map: tex(makeAlarmFaceT(THREE, cnv)), roughness: 0.5 })); face.position.set(0, 0.065, 0.016); ac.add(face);
        for (const s of [-1, 1]) { const l = cyl(0.005, 0.005, 0.03, s * 0.03, 0.012, 0, mDark, 6, ac); l.rotation.z = s * 0.4; } }
      { const ch = new THREE.Group(); ch.position.set(-0.32, 0, -0.98); ch.rotation.y = 0.25; R.add(ch);   // the office chair: base, lift, seat, back
        for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; const leg = box(0.28, 0.025, 0.04, Math.cos(a) * 0.13, 0.05, Math.sin(a) * 0.13, mDark, ch, false); leg.rotation.y = -a;
          const w = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), mDark); w.position.set(Math.cos(a) * 0.26, 0.025, Math.sin(a) * 0.26); ch.add(w); }
        cyl(0.025, 0.025, 0.38, 0, 0.25, 0, mSteel, 10, ch);
        box(0.46, 0.07, 0.44, 0, 0.47, 0, M({ color: 0x2a2c30, roughness: 0.85 }), ch, false);
        box(0.42, 0.5, 0.06, 0, 0.8, 0.22, M({ color: 0x2a2c30, roughness: 0.85 }), ch, false);
        solids.push(hidBox(0.5, 0.95, 0.5, 0, 0.475, 0, ch)); }
      /* ---- the medium's talisman over the desk (chapter 4's), and beside it a cloth yant; the CORK BOARD (its sticker,
         an order slip, the row of merit receipts, the printed Sak Yant he chose — placed on the first frame in the room,
         when the bag can be read); the CALENDAR */
      { const tm = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.33), M({ map: tex(makeFuT(THREE, cnv)), roughness: 0.9 })); tm.position.set(0.02, 1.62, z0 + 0.008); tm.rotation.z = 0.03; R.add(tm);
        const pin = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 6), M({ color: 0xc82a20, roughness: 0.4 })); pin.position.set(0.02, 1.77, z0 + 0.012); R.add(pin);
        const yc = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.24), M({ map: tex(makeYantCloth(THREE, cnv, 'gao', 1.2)), roughness: 0.95 })); yc.position.set(0.22, 1.6, z0 + 0.006); yc.rotation.z = -0.02; R.add(yc); }
      { const cb = new THREE.Group(); cb.position.set(-0.52, 1.42, z0 + 0.02); R.add(cb);
        const board = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.44), M({ map: tex(makeCorkT(THREE, cnv)), roughness: 0.95 })); cb.add(board);
        const card = (w, h, t, x, y, rz) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), M({ map: t, roughness: 0.9 })); m.position.set(x, y, 0.003 + Math.abs(x) * 0.001); m.rotation.z = rz; cb.add(m);
          const pn = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 6), M({ color: [0xc82a20, 0x2a6ac8, 0x2a9a4a][(Math.abs(x * 100) | 0) % 3], roughness: 0.4 })); pn.position.set(x, y + h / 2 - 0.012, 0.008); cb.add(pn); return m; };
        card(0.13, 0.05, tex(makeStickerT(THREE, cnv)), -0.25, 0.16, 0.04);
        card(0.08, 0.104, tex(makeOrderSlipT(THREE, cnv)), -0.25, 0.02, -0.06);
        // the receipts: the first (chapter 4's, for the young woman), then one for every Buddha Day since he took them in
        for (let i = 0; i < 7; i++) roomLive.receipts.push(card(0.06, 0.09, tex(makeReceiptT(THREE, cnv, i)), -0.13 + i * 0.065, -0.11 + (i % 2) * 0.012, (i % 3 - 1) * 0.04));
        roomLive.yantBoard = cb; }
      { const cal = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.36), M({ map: tex(makeCalendarT(THREE, cnv)), roughness: 0.85 })); cal.position.set(0.85, 1.5, z0 + 0.008); R.add(cal); }
      /* ---- THE ROADEYE CORNER by the desk: twelve of his cartons, a tape dispenser, a roll of bubble wrap */
      { const tBox = tex(makeDashBox(THREE, cnv)), mBoxF = M({ map: tBox, roughness: 0.85 }), mBoxS = M({ color: 0xb48c5c, roughness: 0.85 });
        const mats6 = [mBoxS, mBoxS, mBoxS, mBoxS, mBoxF, mBoxS];
        const r = rng(5211);
        for (let k = 0; k < 12; k++) {
          const col = k % 3, row = Math.floor(k / 3) % 2, lay = Math.floor(k / 6);
          const b = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.13, 0.16), mats6);
          b.position.set(0.5 + col * 0.205 + (r() - 0.5) * 0.01, 0.065 + row * 0.13, -1.66 + lay * 0.17); b.rotation.y = (r() - 0.5) * 0.06;
          b.castShadow = !LOW; b.receiveShadow = true; R.add(b);
        }
        solids.push(hidBox(0.62, 0.26, 0.34, 0.705, 0.13, -1.58, R));
        const td = box(0.12, 0.06, 0.05, 0.62, 0.29, -1.62, M({ color: 0xc8241c, roughness: 0.5 }), R, false); td.rotation.y = 0.3;           // the tape dispenser, on top
        const bw = cyl(0.12, 0.12, 0.38, 1.02, 0.12, -1.6, M({ color: 0xdfe8ee, roughness: 0.3, transparent: true, opacity: 0.85 }), 20, R); bw.rotation.x = Math.PI / 2; }
      /* ---- THE BED (chapter 4's place), made real: a slatted frame on legs, a mattress in a fitted sheet, two pillows,
         a rumpled blanket, a T-shirt folded at its foot; the bedside table and its red LED clock; the shelf over it with
         its books and the small Buddha */
      { const BX = (BED.x0 + BED.x1) / 2, BZ = (BED.z0 + BED.z1) / 2, mSheet = M({ map: tex(makeWeaveT(THREE, cnv, '#5a6a8a', 5221)), roughness: 0.95 });
        box(0.96, 0.12, 2.0, BX, 0.24, BZ, mWood, R, false);                                                        // the frame
        for (const [dx, dz] of [[-0.44, -0.96], [0.44, -0.96], [-0.44, 0.96], [0.44, 0.96]]) box(0.05, 0.18, 0.05, BX + dx, 0.09, BZ + dz, mWood, R, false);
        box(0.96, 0.5, 0.04, BX, 0.43, BZ - 1.0, mWood, R, false);                                                  // its head
        for (let k = 0; k < 9; k++) box(0.92, 0.012, 0.07, BX, 0.305, BZ - 0.9 + k * 0.225, mWood, R, false);       // the slats, at its sides
        box(0.92, 0.17, 1.96, BX, 0.395, BZ, mSheet, R, false);                                                     // the mattress in its sheet
        const mPil = M({ map: tex(makeWeaveT(THREE, cnv, '#d8dcd6', 5223)), roughness: 0.95 });
        for (const dx of [-0.2, 0.2]) { const pl = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 10), mPil); pl.scale.set(0.95, 0.3, 0.7); pl.position.set(BX + dx, 0.52, BZ - 0.82); pl.rotation.y = dx * 0.4; R.add(pl); }
        const mBl = M({ map: tex(makeWeaveT(THREE, cnv, '#3a4a6a', 5227)), roughness: 0.96 });
        const bl = box(0.94, 0.05, 1.1, BX, 0.5, BZ + 0.35, mBl, R, false); bl.rotation.z = 0.02;
        for (const [dz, rx, h] of [[-0.18, -0.25, 0.08], [-0.05, 0.3, 0.07], [0.08, -0.2, 0.06]]) { const f = box(0.9, h, 0.14, BX + 0.01, 0.52 + h / 3, BZ + dz, mBl, R, false); f.rotation.x = rx; }
        box(0.3, 0.03, 0.24, BX + 0.12, 0.5, BZ + 0.82, M({ map: tex(makeWeaveT(THREE, cnv, '#c8ccd2', 5229)), roughness: 0.95 }), R, false).rotation.y = 0.15;   // a T-shirt, folded
        solids.push(hidBox(0.96, 0.5, 2.0, BX, 0.25, BZ, R)); }
      box(0.4, 0.5, 0.38, x0 + 0.24, 0.25, -1.18, mWood, R, false);
      solids.push(hidBox(0.4, 0.5, 0.38, x0 + 0.24, 0.25, -1.18, R));
      { const ck = new THREE.Group(); ck.position.set(x0 + 0.3, 0.5, -1.1); ck.rotation.y = 0.5; R.add(ck);
        box(0.15, 0.065, 0.06, 0, 0.033, 0, mDark, ck, false);
        const [c, x] = sized(cnv, 256, 112); roomLive.clockC = c; roomLive.clockX = x;
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; tex(t); roomLive.clockTex = t;
        const f = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.055), B({ map: t, toneMapped: false }));
        f.position.set(0, 0.034, 0.031); ck.add(f); roomClock('22:50'); }
      box(1.1, 0.025, 0.22, x0 + 0.13, 1.6, 0.3, mWood, R, false).rotation.y = Math.PI / 2;
      { const titles = [['Amulets of Siam', '#7a2a24', '#e8d8b0'], ['A Handbook of Meditation', '#2a4a6a', '#e8e0c8'], ['Dhamma for Everyone', '#d8c8a0', '#3a2a1a'],
                        ['Starting a Small Business', '#3a5a3a', '#f0e8d0'], ['The Buddha\'s Words', '#6a4a2a', '#f0dca0'], ['Singapore Street Directory', '#c8a83a', '#2a2a2a'],
                        ['Night Market Recipes', '#5a2a4a', '#f0d8e0'], ['Teach Yourself Thai', '#2a6a7a', '#f0f0e0'], ['Kindness', '#8a6a3a', '#f8f0d8']];
        let z = -0.15;
        titles.forEach(([tt, bg, fg], i) => { const h = 0.17 + (i % 4) * 0.018, w = 0.028 + (i % 3) * 0.008;
          const mats6 = [M({ color: bg, roughness: 0.8 }), M({ map: tex(makeSpineT(THREE, cnv, tt, bg, fg)), roughness: 0.8 }), M({ color: 0xe8e0cc, roughness: 0.9 }),
                         M({ color: 0xe8e0cc, roughness: 0.9 }), M({ color: bg, roughness: 0.8 }), M({ color: bg, roughness: 0.8 })];
          const bk = new THREE.Mesh(new THREE.BoxGeometry(0.16, h, w), mats6); bk.position.set(x0 + 0.12, 1.613 + h / 2, z + w / 2); R.add(bk);
          z += w + 0.004; }); }
      thai('buddha', x0 + 0.14, 1.613, 0.6, { s: 0.22, parent: R, cast: false, ry: Math.PI / 2 });
      /* ---- the WARDROBE against the front wall, between the bed's foot and the door, a backpack leaning on it */
      { const wd = new THREE.Group(); wd.position.set(-0.08, 0, z1 - 0.28); R.add(wd);
        const mW = M({ color: 0xd6cec0, roughness: 0.55 });   // (a light laminate, as HDB wardrobes are: in walnut it was a black slab by night)
        box(0.9, 1.9, 0.54, 0, 0.95, 0, mW, wd, false);
        for (const s of [-1, 1]) { box(0.43, 1.78, 0.012, s * 0.222, 0.97, -0.276, mW, wd, false); box(0.012, 0.14, 0.02, s * 0.02, 1.0, -0.29, mBrass, wd, false); }
        solids.push(hidBox(0.9, 1.9, 0.54, 0, 0.95, 0, wd));
        const bp = new THREE.Group(); bp.position.set(0.52, 0, -0.12); bp.rotation.set(0, -0.4, -0.12); wd.add(bp);
        box(0.3, 0.42, 0.16, 0, 0.21, 0, M({ color: 0x2a3a2e, roughness: 0.85 }), bp, false);
        box(0.24, 0.18, 0.05, 0, 0.16, -0.1, M({ color: 0x24302a, roughness: 0.85 }), bp, false); }
      /* ---- the CEILING FAN (the kit's), turning; the AIRCON high over the door, its louvre swinging, its blue LED */
      /* (the kit's fan is 2.40 m across and 1.22 m from its blades to the top of its rod, its origin under the blades —
         measured off the file; at 0.5 it spans 1.2 m, a bedroom's size, and its pivot stands 0.42 m under the ceiling so
         the blades turn at 2.28 m, the rest of its rod going up through the ceiling's canopy) */
      { const fp = new THREE.Group(); fp.position.set(0, H - 0.42, 0.1); R.add(fp);
        thai('ceilfan', 0, 0, 0, { parent: fp, s: 0.5, cast: false, then: (g, m) => { roomLive.fan = m; } });
        cyl(0.07, 0.08, 0.05, 0, H - 0.025, 0.1, mWhite, 16, R); }
      { const acu = new THREE.Group(); acu.position.set(DOOR.x, 2.42, z1 - 0.12); acu.rotation.y = Math.PI; R.add(acu);
        box(0.84, 0.27, 0.2, 0, 0, 0, mWhite, acu, false);
        const lv = new THREE.Group(); lv.position.set(0, -0.12, -0.09); acu.add(lv);
        box(0.74, 0.008, 0.06, 0, 0, -0.03, M({ color: 0xd8d8d2, roughness: 0.5 }), lv, false); roomLive.louvre = lv;
        const led = new THREE.Mesh(new THREE.CircleGeometry(0.005, 10), B({ color: 0x4aa8ff, toneMapped: false })); led.position.set(0.34, -0.06, -0.101); led.rotation.y = Math.PI; acu.add(led);
        glowP(0.05, 0.05, 0x4aa8ff, 0.5, DOOR.x - 0.34, 2.36, z1 - 0.225, 0, Math.PI); }
      /* ---- by the door: a switch and a power socket; the slippers; the laundry basket in the bed's foot corner; a
         small bin under the desk; a cable along the skirting */
      { const pl = M({ color: 0xf2f0ea, roughness: 0.5 });
        box(0.08, 0.12, 0.012, dL - 0.12, 1.3, z1 - 0.006, pl, R, false); box(0.02, 0.04, 0.006, dL - 0.12, 1.3, z1 - 0.014, mWhite, R, false);
        box(0.09, 0.09, 0.012, dL - 0.12, 0.3, z1 - 0.006, pl, R, false);
        box(0.09, 0.09, 0.012, 0.32, 0.3, z0 + 0.006, pl, R, false);
        const cab = cyl(0.004, 0.004, 1.1, -0.25, 0.012, z0 + 0.03, mDark, 6, R); cab.rotation.z = Math.PI / 2; }
      parseOnce('slipper').then(({ scene: sc }) => {
        if (!alive) return;
        let src = null; sc.traverse(o => { if (o.isMesh && !src) src = o; });
        if (!src) return;
        src.geometry.computeBoundingBox();
        const bb = src.geometry.boundingBox, len = Math.max(bb.max.x - bb.min.x, bb.max.z - bb.min.z), k = 0.27 / len;
        for (const [dx, ry] of [[-0.07, 0.15], [0.07, -0.1]]) {
          const m = new THREE.Mesh(src.geometry, src.material.clone()); m.material.color.multiply(new THREE.Color(0x3a4a7a)); owned.push({ dispose: () => m.material.dispose() });
          m.scale.setScalar(k); m.position.set(dL - 0.32 + dx, -bb.min.y * k, z1 - 0.3); m.rotation.y = Math.PI + ry; R.add(m);
        }
      }).catch(e => { console.warn('e3c5: slippers not placed', e); ctx.loadFail && ctx.loadFail('slipper', e); });
      // (tucked in the corner past the bed's foot, which ends at z 1.4: the corner is 0.4 deep)
      { const lb = new THREE.Group(); lb.position.set(x0 + 0.22, 0, z1 - 0.2); R.add(lb);
        const mb = M({ color: 0xc8b890, roughness: 0.9 });
        cyl(0.17, 0.15, 0.38, 0, 0.19, 0, mb, 16, lb);
        box(0.26, 0.05, 0.2, 0, 0.395, 0, M({ map: tex(makeWeaveT(THREE, cnv, '#8a3a2a', 5233)), roughness: 0.95 }), lb, false).rotation.y = 0.5;
        solids.push(hidBox(0.36, 0.42, 0.36, 0, 0.21, 0, lb)); }
      cyl(0.11, 0.09, 0.26, -0.78, 0.13, -1.58, M({ color: 0x3a3e46, roughness: 0.6 }), 14, R);
      /* ---- THE DOOR, shut, on its hinge (it opens in the home film), its towel and cap on the hook; behind it the flat's
         dark corridor and, far off, the living room's TV */
      { const hg = new THREE.Group(); hg.position.set(dR - 0.01, 0, z1 - 0.025); R.add(hg); roomLive.door = hg;
        box(DOOR.w - 0.02, DOOR.h, 0.04, -(DOOR.w - 0.02) / 2, DOOR.h / 2, 0, mWood, hg, false);
        box(0.1, 0.02, 0.03, -(DOOR.w - 0.06), 1.0, -0.035, M({ color: 0xb8b4a8, roughness: 0.3, metalness: 0.8 }), hg, false);
        box(0.04, 0.03, 0.04, -0.42, 1.78, -0.04, mSteel, hg, false);
        const tw = box(0.26, 0.5, 0.025, -0.42, 1.52, -0.05, M({ map: tex(makeWeaveT(THREE, cnv, '#c87a3a', 5237)), roughness: 0.95 }), hg, false); tw.rotation.z = 0.04;
        const cap = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), M({ color: 0x1e2a4a, roughness: 0.8 }));
        cap.position.set(-0.42, 1.74, -0.12); cap.scale.set(1, 0.6, 1); cap.rotation.x = -1.2; hg.add(cap);
        const cg = new THREE.Group(); cg.position.set(DOOR.x, 0, z1); R.add(cg); roomLive.corridor = cg;
        const mC = M({ color: 0x3a3c40, roughness: 0.9 });
        box(1.6, 0.01, 4.2, 0, 0.005, 2.1, mC, cg, false); box(0.05, 2.6, 4.2, -0.8, 1.3, 2.1, mC, cg, false); box(0.05, 2.6, 4.2, 0.8, 1.3, 2.1, mC, cg, false);
        box(1.6, 0.05, 4.2, 0, 2.6, 2.1, mC, cg, false); box(1.6, 2.6, 0.05, 0, 1.3, 4.2, mC, cg, false);
        roomLive.tvGlow = glowP(1.2, 1.4, 0x6a8ad8, 0.25, DOOR.x + 0.2, 1.2, z1 + 4.15, 0, Math.PI); }
      /* ---- the ceiling's lamp (chapter 4's), off but for HARSH; its light painted on the ceiling and the floor */
      roomLive.ceilLamp = cyl(0.18, 0.2, 0.06, 0, H - 0.03, 0.1, M({ color: 0xeceae4, roughness: 0.6, emissive: 0xfff8ec, emissiveIntensity: 0 }), 24, R);
      roomLive.ceilGlow.push(glowP(2.6, 2.6, 0xf4f6ff, 0.35, 0, H - 0.012, 0.1, Math.PI / 2));
      roomLive.ceilGlow.push(glowP(3.0, 3.2, 0xf4f6ff, 0.22, 0, 0.014, 0.1, -Math.PI / 2));
      for (const g of roomLive.ceilGlow) g.visible = false;
      buildAltar();
    }

    /* THE ALTAR under the window (§4.1 1): a low cabinet in dark lacquer with two doors and their brass pulls, a carved
       apron (a drawn kanok, gold on red); a red runner with a gold border falling over its front edge; a single
       red-and-gold riser at the back, where the three stand (placed with their scans). Before each of them on the
       runner: a small cup of plain water, his drink's place (empty until play fills it), a small bowl of sand for his
       one stick, a saucer of sweets, and his toy on the riser beside him; a jasmine-and-marigold garland across the
       three; a water jug at the near end; at the far end the MUSIC BOX (a wooden box, a brass key, a hinged lid on a
       comb and a drum, a drawn inlay) and the owner's CARD propped against it. Before it on the floor, the mat. No
       candles. No lamp. */
    function buildAltar() {
      const R = worldR, A = ALTAR, cx = (A.x0 + A.x1) / 2, cz = (A.z0 + A.z1) / 2, L = A.z1 - A.z0, Dp = A.x1 - A.x0;
      const mL = M({ color: 0x4a1a10, roughness: 0.32, metalness: 0.1 });
      box(Dp, A.top - 0.06, L, cx, (A.top - 0.06) / 2 + 0.06, cz, mL, R, false);
      box(Dp - 0.04, 0.06, L - 0.04, cx, 0.03, cz, M({ color: 0x1a0805, roughness: 0.5 }), R, false);                         // its plinth
      solids.push(hidBox(Dp, A.top, L, cx, A.top / 2, cz, R));
      const mBrass = M({ color: 0xc8a050, roughness: 0.3, metalness: 0.85 });
      /* its front, top to bottom: the runner's fall over the edge (0.58–0.70), the carved apron under it (0.47–0.56), the
         two doors (0.08–0.45) — three bands at three heights, so no two are drawn on one plane (the first had the fall
         and the apron sharing it, the kanok flickering through the cloth) */
      for (const s of [-1, 1]) {                                                                                              // two doors and their pulls
        box(0.012, 0.37, L / 2 - 0.06, A.x0 - 0.004, 0.265, cz + s * (L / 4), M({ color: 0x5a1c10, roughness: 0.3 }), R, false);
        box(0.02, 0.06, 0.012, A.x0 - 0.014, 0.36, cz + s * 0.05, mBrass, R, false);
      }
      { const ap = new THREE.Mesh(new THREE.PlaneGeometry(L, 0.09), M({ map: tex(makeKanokT(THREE, cnv)), roughness: 0.5 }));   // the carved apron
        ap.material.map.repeat.set(L / 1.0, 1); ap.position.set(A.x0 - 0.006, 0.515, cz); ap.rotation.y = -Math.PI / 2; R.add(ap); }
      { const tR = tex(makeRunnerT(THREE, cnv)), mR = M({ map: tR, roughness: 0.75 });                                         // the runner, over the front edge
        box(Dp - 0.05, 0.004, L * 0.72, cx + 0.02, A.top + 0.002, cz, mR, R, false);
        const fall = new THREE.Mesh(new THREE.PlaneGeometry(L * 0.72, 0.12), mR); fall.position.set(A.x0 - 0.008, A.top - 0.06, cz); fall.rotation.y = -Math.PI / 2; fall.renderOrder = 1; R.add(fall); }
      const RX = RISER.x, RY = A.top + 0.006, RL = RISER.z1 - RISER.z0, RZ = (RISER.z0 + RISER.z1) / 2;                       // the riser
      box(RISER.d, A.riser, RL, RX, RY + A.riser / 2, RZ, M({ color: 0x8e1d14, roughness: 0.5 }), R, false);
      box(RISER.d + 0.005, 0.012, RL + 0.01, RX, RY + A.riser - 0.004, RZ, M({ color: 0xd4a23c, roughness: 0.3, metalness: 0.6 }), R, false);
      const top = RY + A.riser;
      const mCup = M({ color: 0xe8eef2, roughness: 0.08, metalness: 0.05, transparent: true, opacity: 0.55 });
      const mWater = B({ color: 0x8ab0c8, transparent: true, opacity: 0.55 });
      const mSand = M({ color: 0xcab48a, roughness: 0.95 }), mBowl = M({ color: 0x7a4a2a, roughness: 0.6 });
      const mSaucer = M({ color: 0xf2eee4, roughness: 0.3 });
      const SWEET = [0xd83a3a, 0xf2c23a, 0x3ab06a, 0xe87ab0];
      for (let i = 0; i < 3; i++) {
        const z = ALTAR_Z[i];
        // his cup of plain water (§2.2 10): the jug fills it every night
        const cup = cyl(0.022, 0.019, 0.05, ROW.back, A.top + 0.03, z - 0.06, mCup, 14, R); cup.castShadow = false;
        const wt = new THREE.Mesh(new THREE.CircleGeometry(0.02, 14), mWater); wt.rotation.x = -Math.PI / 2; wt.position.set(ROW.back, A.top + 0.047, z - 0.06); R.add(wt);
        roomLive.cups.push({ cup, water: wt });
        // his drink's place (empty until play fills it, CP6)
        roomLive.drinkAt.push(new THREE.Vector3(ROW.back, A.top + 0.005, z + 0.06));
        // his bowl of sand, for ONE stick
        const bw = cyl(0.032, 0.022, 0.035, ROW.mid, A.top + 0.0195, z, mBowl, 16, R);
        cyl(0.029, 0.029, 0.004, ROW.mid, A.top + 0.034, z, mSand, 16, R);
        roomLive.bowls.push(bw);
        // a saucer of sweets, at the front
        cyl(0.035, 0.03, 0.008, ROW.front, A.top + 0.004, z - 0.075, mSaucer, 18, R);
        for (let k = 0; k < 3; k++) { const sw = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 6), M({ color: SWEET[(i + k) % 4], roughness: 0.3 }));
          sw.position.set(ROW.front + (k - 1) * 0.012, A.top + 0.014, z - 0.075 + (k % 2) * 0.01); R.add(sw); }
        // his toy, at the front beside them
        const toy = new THREE.Group(); toy.position.set(ROW.front, A.top + 0.002, z + 0.075); R.add(toy); roomLive.toys.push(toy);
        if (i === 0) {           // the tin car, red
          box(0.06, 0.022, 0.03, 0, 0.02, 0, M({ color: 0xc8281c, roughness: 0.3, metalness: 0.6 }), toy, false).rotation.y = Math.PI / 2;
          box(0.03, 0.018, 0.026, 0, 0.038, -0.004, M({ color: 0x9ac8e8, roughness: 0.2, metalness: 0.3 }), toy, false);
          for (const [dz, dx] of [[-0.02, -0.016], [-0.02, 0.016], [0.02, -0.016], [0.02, 0.016]]) { const w = cyl(0.008, 0.008, 0.006, dx, 0.008, dz, mL, 10, toy); w.rotation.z = Math.PI / 2; }
        } else if (i === 1) {    // the rubber ball, a stripe round it
          const b = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 12), M({ color: 0x2a7ac8, roughness: 0.6 })); b.position.y = 0.022; toy.add(b);
          const st = new THREE.Mesh(new THREE.TorusGeometry(0.0222, 0.004, 6, 24), M({ color: 0xf2d23a, roughness: 0.6 })); st.position.y = 0.022; st.rotation.x = 0.4; toy.add(st);
        } else {                 // the paper pinwheel
          cyl(0.0025, 0.0025, 0.12, 0, 0.06, 0, M({ color: 0xd8c8a0, roughness: 0.8 }), 6, toy);
          const pw = new THREE.Group(); pw.position.set(-0.004, 0.115, 0); pw.rotation.y = -Math.PI / 2; toy.add(pw); roomLive.pinwheel = pw;
          const cols = [0xd83a5a, 0x3a8ad8, 0xf2c23a, 0x5ab06a];
          for (let k = 0; k < 4; k++) { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(0.03, 0.002); sh.lineTo(0.004, 0.026); sh.lineTo(0, 0);
            const bl = new THREE.Mesh(new THREE.ShapeGeometry(sh), M({ color: cols[k], roughness: 0.8, side: THREE.DoubleSide })); bl.rotation.z = k * Math.PI / 2; pw.add(bl); }
        }
        // his EMBER (the stick's glowing tip, CP6 lights it): an emissive point and its glow, hidden until then
        const em = new THREE.Group(); em.position.set(ROW.mid, A.top + 0.2, z); em.visible = false; R.add(em);
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.0035, 8, 6), B({ color: 0xff8a3a, toneMapped: false })); em.add(dot);
        const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: tGlow, color: 0xff7a2a, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false }));
        mats.push(gl.material); gl.scale.setScalar(0.05); em.add(gl);
        roomLive.embers.push(em);
      }
      /* THE GARLANDS. Across the three, a festoon of jasmine and marigold along the riser's face, pinned between them and
         dipping in front of their bases (drawn: a chain of small buds, two instanced meshes); and the kit's hanging
         phuang malai at the cabinet's two front corners. (The kit's garland is a hanging strand, 1.56 m from its tassel to
         its loop — measured off the file — so it hangs; laid across the riser it would stand 20 cm tall in front of
         their faces.) */
      { const pins = [RISER.z0 + 0.02, (ALTAR_Z[0] + ALTAR_Z[1]) / 2, (ALTAR_Z[1] + ALTAR_Z[2]) / 2, RISER.z1 - 0.02], fx = RX - RISER.d / 2 - 0.005, fy = top - 0.012;
        const pts = [];
        for (let s = 0; s < pins.length - 1; s++) {
          const z0 = pins[s], z1 = pins[s + 1], n = Math.round((z1 - z0) / 0.024);
          for (let k = 0; k < n; k++) { const u = k / n, z = z0 + (z1 - z0) * u, dip = 0.034 * Math.sin(Math.PI * u);
            pts.push([fx - 0.004 * Math.sin(Math.PI * u), fy - dip, z, k % 3 === 1]); }
        }
        pts.push([fx, fy, pins[pins.length - 1], true]);
        const jas = pts.filter(q => !q[3]), mar = pts.filter(q => q[3]);
        const mJas = M({ color: 0xf4f0e2, roughness: 0.7 }), mMar = M({ color: 0xf08a1a, roughness: 0.75 });
        const gJ = new THREE.SphereGeometry(0.0075, 8, 6), gM = new THREE.SphereGeometry(0.0125, 10, 8);
        const iJ = new THREE.InstancedMesh(gJ, mJas, jas.length), iM = new THREE.InstancedMesh(gM, mMar, mar.length);
        const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(1, 0.8, 1), _p = new THREE.Vector3();
        jas.forEach((q, i) => iJ.setMatrixAt(i, _m.compose(_p.set(q[0], q[1], q[2]), _q, _s.set(1, 1.25, 1))));
        mar.forEach((q, i) => iM.setMatrixAt(i, _m.compose(_p.set(q[0], q[1], q[2]), _q, _s.set(1, 0.8, 1))));
        for (const im of [iJ, iM]) { im.castShadow = false; im.receiveShadow = true; im.computeBoundingSphere(); R.add(im); }
        // a tassel of three marigolds at each pin
        for (const z of pins) for (let k = 0; k < 3; k++) { const t = new THREE.Mesh(gM, mMar); t.position.set(fx + 0.004, fy - 0.022 - k * 0.022, z); t.scale.set(0.8, 0.7, 0.8); R.add(t); } }
      // (on the cabinet's two END faces, where they frame it from the door and the bed and stay out of the mat's view)
      for (const s of [-1, 1]) thai('garland', A.x0 + 0.16, A.top - 1.556 * 0.32, s < 0 ? A.z0 - 0.052 : A.z1 + 0.052, { parent: R, s: 0.32, cast: false });
      // the water jug, at the near end
      { const j = new THREE.Group(); j.position.set(ROW.mid, A.top, A.z0 + 0.08); R.add(j); roomLive.jug = j;
        const mJ = M({ color: 0xa8c4cc, roughness: 0.1, metalness: 0.05, transparent: true, opacity: 0.6 });
        const body = new THREE.Mesh(new THREE.LatheGeometry([[0.0, 0], [0.034, 0.002], [0.04, 0.03], [0.036, 0.07], [0.02, 0.1], [0.022, 0.115]].map(([a, b]) => new THREE.Vector2(a, b)), 18), mJ);
        j.add(body);
        const hd = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.004, 6, 16, Math.PI), mJ); hd.position.set(0, 0.07, -0.036); hd.rotation.set(0, Math.PI / 2, Math.PI / 2); j.add(hd);
        const wl = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.033, 0.05, 16), B({ color: 0x8ab0c8, transparent: true, opacity: 0.4 })); wl.position.y = 0.03; j.add(wl); }
      // THE MUSIC BOX at the far end, its lid shut; the card against it
      { const mb = new THREE.Group(); mb.position.set(1.30, A.top, (RISER.z1 + A.z1) / 2); mb.rotation.y = -Math.PI / 2; R.add(mb); roomLive.box = mb;   // past the riser's end, its front to the mat
        const mW = M({ color: 0x5a3a22, roughness: 0.45 });
        box(0.16, 0.07, 0.11, 0, 0.035, 0, mW, mb, false);
        const comb = box(0.1, 0.004, 0.03, 0.01, 0.062, -0.02, mBrass, mb, false); void comb;
        const drum = cyl(0.012, 0.012, 0.06, 0.01, 0.066, 0.015, mBrass, 14, mb); drum.rotation.z = Math.PI / 2; roomLive.boxDrum = drum;
        const lid = new THREE.Group(); lid.position.set(0, 0.07, -0.055); mb.add(lid); roomLive.boxLid = lid;
        box(0.162, 0.018, 0.112, 0, 0.009, 0.055, mW, lid, false);
        const inl = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.085), M({ map: tex(makeInlayT(THREE, cnv)), roughness: 0.5 })); inl.rotation.x = -Math.PI / 2; inl.position.set(0, 0.0185, 0.055); lid.add(inl);
        const key = new THREE.Group(); key.position.set(0.085, 0.035, 0); mb.add(key); roomLive.boxKey = key;
        const sh = cyl(0.003, 0.003, 0.02, 0.01, 0, 0, mBrass, 6, key); sh.rotation.z = Math.PI / 2;
        const bow = new THREE.Mesh(new THREE.TorusGeometry(0.009, 0.0025, 6, 14), mBrass); bow.position.x = 0.024; bow.rotation.y = Math.PI / 2; key.add(bow); }
      { const cd = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.098), M({ map: tex(makeOwnerCardT(THREE, cnv)), roughness: 0.9 }));
        cd.position.set(1.23, A.top + 0.048, (RISER.z1 + A.z1) / 2); cd.rotation.set(0, -Math.PI / 2, 0, 'YXZ'); cd.rotateX(-0.22); R.add(cd); roomLive.card = cd; }
      // the mat before it, where he sits (the kit's rug)
      roomLive.mat = thai('rug', MAT.x, 0.002, MAT.z, { parent: R, fit: 0.95, cast: false, ry: Math.PI / 2 });
    }

    /* ------------------------------------------------------- WORLD S (CP2) */
    {
      const G = worldS;
      floorAt(SHOP.x1 - SHOP.x0, SHOP.z1 - SHOP.z0, 0, (SHOP.z0 + SHOP.z1) / 2, matFloorS, G);
      ceilAt(SHOP.x1 - SHOP.x0, SHOP.z1 - SHOP.z0, 0, SHOP.H, (SHOP.z0 + SHOP.z1) / 2, matWallS, G);
      const T = 0.12;
      walls.push(box(SHOP.x1 - SHOP.x0 + 2 * T, SHOP.H, T, 0, SHOP.H / 2, SHOP.z0 - T / 2, matWallS, G, false));
      walls.push(box(T, SHOP.H, SHOP.z1 - SHOP.z0, SHOP.x0 - T / 2, SHOP.H / 2, (SHOP.z0 + SHOP.z1) / 2, matWallS, G, false));
      walls.push(box(T, SHOP.H, SHOP.z1 - SHOP.z0, SHOP.x1 + T / 2, SHOP.H / 2, (SHOP.z0 + SHOP.z1) / 2, matWallS, G, false));
      // the glass front onto the corridor, with its door (rooted at the counter, he never walks out: CP5 decides)
      walls.push(box(SHOP.x1 - SHOP.x0 - 1.2, 2.4, 0.03, 0.6, 1.2, SHOP.z1, matGlass, G, false));
      walls.push(box(0.2, 2.4, 0.03, SHOP.x0 + 0.1, 1.2, SHOP.z1, matGlass, G, false));
      floorAt(MALL.x1 - MALL.x0, MALL.z1 - MALL.z0, 0, (MALL.z0 + MALL.z1) / 2, matMall, G);
      walls.push(box(MALL.x1 - MALL.x0, MALL.H, T, 0, MALL.H / 2, MALL.z1 + T / 2, matMall, G, false));
      // the owner's counter, the cloth on its glass
      solids.push(box(RCNT.x1 - RCNT.x0, RCNT.top, RCNT.z0 - RCNT.z1, (RCNT.x0 + RCNT.x1) / 2, RCNT.top / 2, (RCNT.z0 + RCNT.z1) / 2, matWood, G));
      box(0.34, 0.004, 0.86, (RCNT.x0 + RCNT.x1) / 2 - 0.05, RCNT.top + 0.002, OWN.z, matRed, G, false);
    }

    buildRoomR();

    /* ------------------------------------------------------- WORLD M (CP2) */
    {
      const G = worldM;
      floorAt(16, 16, 0, -6, matFloorM, G);
      box(16, 6, 0.3, 0, 3, -14, matWallM, G, false);
    }

    /* ------------------------------------------------ THE THREE (CP1's scans)
       ONE parse each; a LOD per place — the near level only for a figure close to the lens (KID_LOD), the far one
       wearing the near one's material over the same vertices. Each file is baked base-down on y 0, height 1.0,
       facing +z (CP1), so a place is a position, a turn and a height in metres. */
    const kidLive = KIDS.map(K => ({ K, altar: null, counter: null, ready: false }));
    function kidLOD(src, h) {
      const lod = new THREE.LOD();
      const near = src.near.clone(), far = src.far.clone();
      const wn = new THREE.Group(); wn.add(near);
      const wf = new THREE.Group(); wf.add(far);
      lod.addLevel(wn, 0); lod.addLevel(wf, KID_LOD);
      if (src.dist) { const wd = new THREE.Group(); wd.add(src.dist.clone()); lod.addLevel(wd, KID_DIST); }
      const g = new THREE.Group(); g.add(lod); g.scale.setScalar(h);
      return g;
    }
    for (const L of kidLive) {
      const K = L.K;
      parseOnce(K.asset).then(({ scene: sc }) => {
        if (!alive) return;
        const near = sc.getObjectByName(K.asset + '_near'), far = sc.getObjectByName(K.asset + '_far'), dist = sc.getObjectByName(K.asset + '_dist');
        if (!near || !far) throw new Error(`${K.asset}: no ${K.asset}_near / ${K.asset}_far node`);
        for (const o of [far, dist]) if (o) o.traverse(m => { if (m.isMesh) m.material = near.material; });
        for (const o of [near, far, dist]) if (o) o.traverse(m => { if (m.isMesh) { m.castShadow = false; m.receiveShadow = false; } });
        const src = { near, far, dist };
        // on the riser under the window, facing into the room (−x): a model at ry θ faces (sin θ, 0, cos θ)
        L.altar = kidLOD(src, K.h);
        L.altar.position.set(RISER.x, ALTAR.top + ALTAR.riser + 0.006, ALTAR_Z[K.slot]);
        L.altar.rotation.y = -Math.PI / 2;
        worldR.add(L.altar);
        // and on the red cloth on the owner's glass, facing him (−x as well)
        L.counter = kidLOD(src, K.h);
        L.counter.position.set((RCNT.x0 + RCNT.x1) / 2 - 0.05, RCNT.top + 0.004, CNT_Z[K.slot]);
        L.counter.rotation.y = -Math.PI / 2;
        worldS.add(L.counter);
        L.ready = true;
      }).catch(e => { console.warn('e3c5: ' + K.asset + ' could not be placed — ' + (e && e.message)); if (ctx.loadFail) ctx.loadFail(K.asset, e); });
    }

    /* ------------------------------------------------------ the chapter clock */
    const PHASES = ['counter', 'care', 'sit', 'open1', 'open2', 'open3', 'after', 'decide'];
    let phase = 'counter';
    let booted = false, preplaced = '';       // preplaced: the world a Continue was put in under the chapter card
    const dayClock = { t: 0 };
    let lastWall = 0;
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    const heard = new Set();

    const speak = { until: 0, pending: null };
    function speakReset() { speak.until = 0; speak.pending = null; }
    /* A LINE IS A BEAT, HEARD OR NOT (e3c3's law): a muted game speaks it silently on its own length, and a line whose
       bytes have not landed is held a moment (v8.0) and then spoken silently, so a beat chained on a line's start never
       stops the chapter — which is also how a PLANNED line (no take yet, CP11) passes: silently, on its estimate */
    function sayLine(name, vol = 1, onStart, pan) {
      if (dayClock.t < speak.until) return false;
      const start = () => { speak.until = dayClock.t + (SECS[name] || 2.5) + 0.25; heard.add(name); if (onStart) onStart(); };
      if ((soundOff && soundOff()) || !worldSfx) { start(); return true; }
      if (worldSfx(name, vol, 1, pan)) { start(); return true; }
      speak.pending = { name, vol, start, pan, give: dayClock.t + 1.6 };
      speak.until = dayClock.t + 0.2;
      return true;
    }
    function runSpeak() {
      const q = speak.pending;
      if (!q || dayClock.t < speak.until) return;
      if (dayClock.t > q.give || (soundOff && soundOff())) { speak.pending = null; q.start(); return; }
      if (worldSfx(q.name, q.vol, 1, q.pan)) { speak.pending = null; q.start(); }
      else speak.until = dayClock.t + 0.2;
    }
    /* one voice at a time, in order, never dropped (the v9.5 queue) */
    const lineQ = [];
    function queueLine(name, onStart, vol = 1, pan = 0) { lineQ.push({ name, onStart, vol, pan }); }
    function queueGap(secs) { lineQ.push({ gap: secs }); }
    function queueFn(fn) { lineQ.push({ fn }); }
    function runQueue() {
      if (!lineQ.length || speak.pending || dayClock.t < speak.until) return;
      const q = lineQ.shift();
      if (q.fn) { q.fn(); return; }
      if (q.gap) { speak.until = dayClock.t + q.gap; return; }
      sayLine(q.name, q.vol, q.onStart, q.pan);
    }
    const quiet = () => !lineQ.length && !speak.pending && dayClock.t >= speak.until;

    /* ------------------------------------------------------------ the phases */
    const W = DATA.words;
    const worldOf = (x) => x > 100 ? 'S' : x < -100 ? 'M' : 'R';
    let worldRun = 0;                          // a world change's run token (a reset or a second change cancels the first)
    let wDark = false;                         // a world arrived in under its black: the order and the marks wait for the picture
    let decOpen = false;                       // the decision has opened by itself once (until then the pile is not pressable)
    function setPhase(p, tag) {
      phase = p;
      if (kit) kit.setPhase(tag ? p + ':' + tag : p);
      objectiveFor(p, tag);
    }
    function objectiveFor(p) {
      if (!kit) return;
      if (wDark) { kit.objective(null, { complete: false }); return; }
      const o = { counter: W.objTake, sit: W.objSit, decide: null }[p];
      kit.objective(o || null);
    }

    /* ------------------------------------------------------- between worlds
       Under the kit's black: the player put down in the next world, its light, a warm of everything (kit.warm — the
       curtain's own), then the black lifts (chapter 4's toWorld) */
    function placeIn(w) {
      if (w === 'R') {
        yaw.position.x = R_ARRIVE.x; yaw.position.z = R_ARRIVE.z;
        yaw.rotation.y = 0; pitch.rotation.x = -0.05;          // into the room, the altar on the right (CP4 aims it)
      } else {
        yaw.position.x = S_SPAWN.x; yaw.position.z = S_SPAWN.z;
        yaw.rotation.y = DATA.spawn.rot; pitch.rotation.x = -0.12;
      }
      if (kit) { if (w === 'R') look('NIGHT', 0); else kit.daylight(null, 0); kit.pose('standing', { secs: 0.05 }); }
    }
    function toWorld(w, resumed, at, tag) {
      const run = ++worldRun;
      const cold = resumed && preplaced === w;           // put there under the chapter card already: no black of its own
      if (kit) { kit.root(false); kit.presence(0); if (!cold) kit.fade(1, 0.01); }
      if (!cold) placeIn(w);
      wDark = !resumed;
      setPhase(at || (w === 'R' ? 'sit' : 'counter'), tag);
      const warmed = !cold && kit && kit.warm ? kit.warm() : Promise.resolve(0);
      warmed.then(() => {
        if (!alive || run !== worldRun) return;
        if (kit) kit.fade(0, resumed ? 1.2 : 1.6);
        wDark = false; objectiveFor(phase);
        if (phase === 'decide') { sitDown(true); openDecision(); }
      });
    }

    /* ------------------------------------------------------- the counter (CP2)
       CP5 plays the counter in full (§4.0b): the misconception and its answer, film M, each child met, the card, the
       promise. Here, the one order that carries him home. */
    function takeHome() {
      if (phase !== 'counter' || !quiet()) return false;
      const done = () => { if (alive) toWorld('R', false, 'sit'); };
      if (!kit || !kit.film || !kit.film('home', { onDone: done })) done();
      return true;
    }

    /* -------------------------------------------------------- the room (CP2)
       CP6 plays the offerings, CP7 the question and the openings (§4.2–§4.6). Here, the mat and the decision. */
    let seated = false;
    function sitDown(resumed) {
      seated = true;
      yaw.position.x = MAT.x; yaw.position.z = MAT.z;
      if (kit) {
        kit.root(true);
        kit.pose('lying', { y: 0.90, yaw: -Math.PI / 2, span: 0.9, pitchLo: -0.6, pitchHi: 0.5, secs: resumed ? 0.05 : 0.9 });
      }
    }
    function openDecision() {
      decOpen = true;
      if (getState() === 'play') startDecision();
    }
    function sitWithThem() {
      if (phase !== 'sit' || seated || !quiet()) return false;
      sitDown(false);
      setPhase('decide');
      after(1.2, () => openDecision());
      return true;
    }

    /* ------------------------------------------------------- the decision */
    const _ndc = new THREE.Vector3();
    const INTERACT_R = 2.4;
    const PILE_POS = new THREE.Vector3((ALTAR.x0 + ALTAR.x1) / 2, 0, (ALTAR.z0 + ALTAR.z1) / 2);   // the altar
    const pile = new THREE.Group(); pile.position.copy(PILE_POS); world.add(pile);
    const pileLive = () => decOpen && phase === 'decide' && worldOf(yaw.position.x) === 'R';
    function pileDist() { return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z); }
    function pileScreen() { camera.updateMatrixWorld(); return _ndc.set(PILE_POS.x, ALTAR.top + 0.2, PILE_POS.z).project(camera); }
    function pileInView() {
      if (!pileLive()) return false;
      const n = pileScreen();
      return n.z < 1 && Math.abs(n.x) < 1.1 && Math.abs(n.y) < 1.1;
    }
    function pointerHitsPile() { return pileLive() && pileDist() < INTERACT_R; }
    function interactPile() {
      if (!pileLive()) return false;
      startDecision();
      return true;
    }

    /* ------------------------------------------------------------- hotspots
       Anchors at EYE height on the thing itself (the v7.5 law) */
    const hotspots = [
      { id: 'bag', pos: { x: SX + (RCNT.x0 + RCNT.x1) / 2 - 0.05, y: RCNT.top + 0.2, z: OWN.z }, radius: 2.4, prompt: W.hotBag, markY: 0.12,
        enabled: () => phase === 'counter' && quiet(), onInteract() { return takeHome(); } },
      { id: 'mat', pos: { x: MAT.x, y: 0.9, z: MAT.z }, radius: 1.6, prompt: W.hotMat, markY: -0.3,
        enabled: () => phase === 'sit' && !seated && quiet(), onInteract() { return sitWithThem(); } }
    ];
    for (const h of hotspots) { const en = h.enabled; h.enabled = () => !wDark && (!en || en()); }   // none under an arrival's black

    /* ---------------------------------------------------------- per frame */
    /* the room's own motion, on wall time, whenever the room is the world drawn (its fan, the aircon's louvre, the
       pinwheel in the fan's air) — in play and in its films alike; the possessions will set fanK (CP7) */
    let roomWall = 0;
    function roomFrame(now) {
      const dt = roomWall ? Math.min(0.1, now - roomWall) : 0; roomWall = now;
      if (worldOf(yaw.position.x) !== 'R') return;
      lookFrame(false);
      if (roomLive.fan) { roomLive.fanA = (roomLive.fanA + dt * 6.0 * roomLive.fanK) % (Math.PI * 2); roomLive.fan.rotation.y = roomLive.fanA; }
      if (roomLive.louvre) roomLive.louvre.rotation.x = 0.45 + 0.3 * Math.sin(now * 2 * Math.PI / 11);
      if (roomLive.pinwheel) roomLive.pinwheel.rotation.z += dt * 1.6 * roomLive.fanK;
      if (!roomLive.yantDone && kit && getState() === 'play') { roomLive.yantDone = true; yantPrint(); }
    }
    /* THE SAK YANT HE CHOSE (chapter 1), printed and pinned to his cork board: read once, on his first frame in the room,
       from the equipped Sak Yant box (none — a player who came in by the selector — and the board carries no print) */
    function yantPrint() {
      const id = ['yantgaoyord', 'yanthahtaew', 'yantsroi'].find(i => kit.equipped && kit.equipped(i));
      if (!id || !roomLive.yantBoard) return;
      const k = { yantgaoyord: 'gao', yanthahtaew: 'hah', yantsroi: 'sroi' }[id], A = { gao: 0.84, hah: 1.6, sroi: 0.66 }[k], w = 0.11;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w * A), M({ map: tex(makeYantCloth(THREE, cnv, k)), roughness: 0.9 }));
      m.position.set(0.215, 0.08, 0.004); m.rotation.z = 0.025; roomLive.yantBoard.add(m); roomLive.yantPrint = m;
      const pn = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 6), M({ color: 0xc82a20, roughness: 0.4 })); pn.position.set(0.215, 0.08 + w * A / 2 - 0.012, 0.009);
      roomLive.yantBoard.add(pn);
    }
    function updateNotes(dt, t) {
      const now = wallNow();
      roomFrame(now);
      const st = getState();
      const live = st === 'play' || st === 'unlock' || st === 'choose';
      /* a Continue into the room is put there UNDER the chapter card, so the card lifts on the world it resumes in */
      if (!booted && !preplaced && kit) {
        const RA = resumeAt(kit.getPhase());
        if (RA) { preplaced = RA.w; placeIn(RA.w); }
      }
      if (!live) { lastWall = 0; return; }
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) {
        booted = true;
        applyPhase(kit ? kit.getPhase() : null);
      }
      runTodo(); runSpeak(); runQueue();
    }
    function updatePile() {}
    function updateFire() {}
    function updateSlow() {}

    /* ------------------------------------------------------------ a resume
       A Continue lands on the order still open, in its world (§10.1). Until CP6 there are no offerings, so a care
       phase resumes at the mat. */
    function resumeAt(p0) {
      const tag = String(p0 || '').split(':'), p = PHASES.includes(tag[0]) ? tag[0] : 'counter';
      if (PHASES.indexOf(p) >= PHASES.indexOf('care')) return { w: 'R', at: p === 'decide' ? 'decide' : 'sit' };
      return null;
    }
    function applyPhase(p) {
      const RA = resumeAt(p);
      if (RA) { toWorld(RA.w, true, RA.at); return; }
      setPhase('counter');
    }

    /* ---------------------------------------------------------- lifecycle */
    /* the room as build() leaves it, at 22:50 (the reset law: whatever a phase or a film moves, the next run finds where
       it began) — its clock, its fan, its door and drawer shut, the music box's lid down, no stick lit; the glows and the
       window are the NIGHT look's (reset() sets it). The printed Sak Yant stays: it is what he wears. */
    function roomReset() {
      roomClock('22:50');
      roomLive.fanK = 1;
      if (roomLive.door) roomLive.door.rotation.y = 0;
      if (roomLive.drawer) roomLive.drawer.position.z = DESK_DRAWER_Z;
      if (roomLive.boxLid) roomLive.boxLid.rotation.x = 0;
      for (const em of roomLive.embers) em.visible = false;
    }
    function snap() { return { phase }; }
    function restore() {}
    function reset() {
      dropTodo(); speakReset(); lineQ.length = 0; heard.clear();
      booted = false; preplaced = ''; dayClock.t = 0; lastWall = 0;
      worldRun++; wDark = false; decOpen = false; seated = false;
      worldM.visible = false;
      roomReset();
      for (const h of hotspots) { h.done = false; h.dwellT = 0; }
      if (kit) {
        kit.root(false); kit.pose('standing', { secs: 0.05 });
        if (kit.pray) kit.pray(false, { secs: 0 });
        kit.presence(0);
        look('NIGHT', 0);                      // the room as it is at 22:50 (its glows, the window), for the next arrival
        kit.daylight(null, 0);                 // and the light of the world the chapter begins in
        kit.setPhase('counter');
      }
      phase = 'counter';
    }
    function blockers() {
      const out = [];
      const b = (o, pad = 0.20) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); out.push(bb); };
      const solid = (o, pad = 0.14) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40); out.push(bb); };
      for (const w of walls) b(w);
      for (const s of solids) solid(s);
      return out;
    }
    function dispose() {
      alive = false;
      const geos = new Set(), ms = new Set();
      world.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) ms.add(m);
      });
      /* the parsed scans hold the geometry and the material the clones share: freed once, through the parse */
      for (const p of parsedGlb.values()) p.then(({ scene: sc }) => sc.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) {
          for (const k of ['map', 'roughnessMap', 'metalnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) m[k]?.dispose?.();
          m.dispose();
        }
      })).catch(() => {});
      scene.remove(world);
      for (const o of owned) { if (o.parent) o.parent.remove(o); o.dispose?.(); }
      owned.length = 0;
      for (const g of geos) g.dispose();
      for (const m of ms) {
        for (const k of ['map', 'roughnessMap', 'metalnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) m[k]?.dispose?.();
        m.dispose();
      }
      for (const m of mats) m.dispose();
      for (const t of madeTex) t?.dispose?.();
      world.clear();
      S = null;
    }

    return (S = {
      world, blockers: blockers(),
      ready: () => true,
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => 0 },
      drum: null, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: null,
      /* the sky where he is: the room, at the origin, keeps the engine's own; the shop and the temple carry theirs with
         them (chapter 4's L4-2 — away from the origin the engine's sky stood out of reach) */
      skyAt: () => worldOf(yaw.position.x) === 'R' ? null : { x: yaw.position.x, z: yaw.position.z },
      get noteStorm() { return 1; },
      set noteStorm(v) {},
      film: { SX, MX, ROOM, SHOP, RCNT, OWN, MAT, R_ARRIVE, S_SPAWN, worldM },
      pileVia: { what: 'his room\'s mat (the home film carries him there)', x: MAT.x, z: MAT.z },
      arrivals: [{ what: 'his room (the home film puts him inside its door)', x: R_ARRIVE.x, z: R_ARRIVE.z }],
      get phase() { return phase; },
      setPhase, applyPhase, after, dayClock, sayLine,
      look, presets: PRESETS, room: roomLive,                 // the room's looks (§10.2), for the films and for probes
      kids: () => kidLive.map(L => ({ key: L.K.key, ready: L.ready })),
      info: () => ({ phase, t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard], world: worldOf(yaw.position.x),
                     until: +speak.until.toFixed(2), pending: speak.pending ? speak.pending.name : null,
                     seated, decOpen, kids: kidLive.map(L => L.K.key + (L.ready ? '' : '?')) }),
      hotspots,
      updateNotes, updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
    });
  }

  /* ====================================================== THE ROOM'S DRAWN SURFACES (CP4)
     Every sheet is drawn here, on a canvas (CSP-safe, no download). Chapter 4's room drawers are copied by their own
     code (makeTeak, makeRoomWallT, makeAlarmFaceT, makeFuT); chapter 1's ROADEYE carton (makeDashBox) and its yant
     cloths (makeYantCloth and the Khom letters under it) likewise — a chapter imports nothing. The words on them are
     world art: a card says what is written on it (the jetty sign's precedent, v14.5). */
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function done(THREE, c, rep) {
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
    return t;
  }
  function sized(cnv, W, H) { const [c, x] = cnv(W); c.height = H; return [c, x]; }
  /* chapter 4's: a teak floor's grain */
  function makeTeak(THREE, cnv, seed) {
    const S = 256, [c, x] = cnv(S), r = rng(seed || 4123);
    x.fillStyle = '#6a3e22'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 160; i++) {
      const y = r() * S, v = r();
      x.strokeStyle = v < 0.5 ? `rgba(40,20,8,${0.15 + r() * 0.25})` : `rgba(150,96,56,${0.1 + r() * 0.2})`;
      x.lineWidth = 1 + r() * 2; x.beginPath(); x.moveTo(0, y);
      for (let k = 1; k <= 8; k++) x.lineTo(k * 32, y + Math.sin(k * 0.9 + i) * 3 + (r() - 0.5) * 2);
      x.stroke();
    }
    return done(THREE, c, true);
  }
  /* chapter 4's: an HDB bedroom's painted wall, pale blue-grey, a faint roller texture */
  function makeRoomWallT(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(5147);
    x.fillStyle = '#e4e8ec'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '120,130,140' : '255,255,255'},${(0.025 + r() * 0.04).toFixed(3)})`; x.fillRect(r() * S, r() * S, 2, 2); }
    return done(THREE, c, true);
  }
  /* a soft white glow (tinted by its material): painted light, additive, never a lamp (v15.1) */
  function makeGlowT(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,0.5)');
    g.addColorStop(0.65, 'rgba(255,255,255,0.12)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return done(THREE, c, false);
  }
  /* chapter 4's: a small wind-up alarm clock's face */
  function makeAlarmFaceT(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    x.fillStyle = '#f2ece0'; x.beginPath(); x.arc(64, 64, 62, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#222'; x.font = 'bold 14px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    for (let h = 1; h <= 12; h++) { const a = h / 12 * Math.PI * 2; x.fillText(String(h), 64 + Math.sin(a) * 48, 64 - Math.cos(a) * 48); }
    x.strokeStyle = '#222'; x.lineCap = 'round';
    const hand = (a, l, w) => { x.lineWidth = w; x.beginPath(); x.moveTo(64, 64); x.lineTo(64 + Math.sin(a) * l, 64 - Math.cos(a) * l); x.stroke(); };
    hand((10 + 50 / 60) / 12 * Math.PI * 2, 28, 4); hand(50 / 60 * Math.PI * 2, 40, 3);
    return done(THREE, c, false);
  }
  /* chapter 4's: the medium's talisman (chapter 3) — yellow paper, red brush strokes, a seal; a talisman's look, no
     real script */
  function makeFuT(THREE, cnv) {
    const [c, x] = sized(cnv, 160, 440), r = rng(5153);
    x.fillStyle = '#e8c23a'; x.fillRect(0, 0, 160, 440);
    for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(160,120,20,${(0.05 + r() * 0.08).toFixed(3)})`; x.fillRect(r() * 160, r() * 440, 2, 2); }
    x.strokeStyle = '#b8160e'; x.lineCap = 'round'; x.lineJoin = 'round';
    x.lineWidth = 3; x.strokeRect(10, 10, 140, 420);
    let y = 40;
    for (let k = 0; k < 9; k++) {
      x.lineWidth = 5 + r() * 4; x.beginPath();
      const cx = 80 + (r() - 0.5) * 20; x.moveTo(cx - 30 + r() * 10, y);
      for (let s = 0; s < 4; s++) x.lineTo(cx + (r() - 0.5) * 70, y + 8 + r() * 26);
      x.stroke(); y += 40;
    }
    x.fillStyle = '#b8160e'; x.fillRect(50, 380, 60, 34); x.fillStyle = '#e8c23a'; x.font = 'bold 22px serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('令', 80, 397);
    return done(THREE, c, false);
  }
  /* THE WINDOW'S FOUR STATES (§4.1 2, V12): the blocks across under their own sky, the lit windows counted and stepped
     down as the hours pass — dusk (most lit, the sky still orange low down), night (chapter 4's), 3 a.m. (a handful),
     dawn (the sky paling, a few early lights). Painted at about half the brightness wanted on screen (ACES, v8.9),
     unlit and fog-free. The same seed in every state, so a window lit at 3 a.m. was lit at night as well. */
  const WIN_STATES = {
    dusk:  { sky: [[0, '#1c2448'], [0.45, '#4a3a5a'], [0.8, '#a8604a'], [1, '#c88a5a']], lit: 0.46, stars: 4, strip: 0.26, deck: 0.30, ground: '#0e0e14' },
    night: { sky: [[0, '#05070f'], [0.6, '#0e1426'], [1, '#1a2034']], lit: 0.22, stars: 40, strip: 0.32, deck: 0.25, ground: '#06070a' },
    late:  { sky: [[0, '#030409'], [0.6, '#080c18'], [1, '#101626']], lit: 0.05, stars: 60, strip: 0.30, deck: 0.18, ground: '#040508' },
    dawn:  { sky: [[0, '#4a5a7a'], [0.5, '#8a8aa0'], [0.85, '#c8a49a'], [1, '#dcb8a0']], lit: 0.07, stars: 0, strip: 0.10, deck: 0.06, ground: '#2e3036' },
    // and the day's (A's days, the home film's weeks): no window lit, the facades in the sun
    day:   { sky: [[0, '#5a86b8'], [0.55, '#86aed4'], [1, '#b8d0e4']], lit: 0, stars: 0, strip: 0, deck: 0, ground: '#4a5048' }
  };
  function makeWindowT(THREE, cnv, state) {
    const S = WIN_STATES[state] || WIN_STATES.night, [c, x] = sized(cnv, 1024, 640), r = rng(5149), rs = rng(5161);
    const g = x.createLinearGradient(0, 0, 0, 640); for (const [k, col] of S.sky) g.addColorStop(k, col);
    x.fillStyle = g; x.fillRect(0, 0, 1024, 640);
    for (let i = 0; i < S.stars; i++) { x.fillStyle = `rgba(200,210,255,${(0.2 + rs() * 0.4).toFixed(2)})`; x.fillRect(rs() * 1024, rs() * 180, 1.5, 1.5); }
    const day = state === 'dawn' || state === 'day', sun = state === 'day';
    for (const [x0, w, top] of [[40, 300, 120], [400, 260, 170], [700, 300, 90]]) {
      x.fillStyle = sun ? '#8a8e94' : day ? '#4a4e58' : state === 'dusk' ? '#1a1c26' : '#10141c'; x.fillRect(x0, top, w, 640 - top);
      if (day) { x.fillStyle = sun ? 'rgba(255,240,215,0.18)' : 'rgba(255,220,190,0.10)'; x.fillRect(x0 + w * 0.55, top, w * 0.45, 640 - top); }
      const floors = Math.floor((600 - top) / 26);
      for (let f = 0; f < floors; f++) {
        const y = top + 12 + f * 26;
        x.fillStyle = `rgba(190,200,170,${S.strip})`; x.fillRect(x0 + 6, y + 15, w - 12, 3);   // the corridors' strip lights
        for (let u = 0; u < Math.floor((w - 20) / 22); u++) {
          const roll = r(), warm = r() < 0.5, xx = x0 + 10 + u * 22;
          const lit = roll < S.lit;
          x.fillStyle = lit ? (warm ? 'rgba(255,214,140,0.85)' : 'rgba(210,230,255,0.7)') : sun ? 'rgba(58,66,78,0.9)' : day ? 'rgba(70,76,90,0.9)' : 'rgba(30,36,50,0.9)';
          x.fillRect(xx, y, 14, 11);
        }
      }
      x.fillStyle = `rgba(255,220,160,${S.deck})`; x.fillRect(x0, 600, w, 40);                  // the void deck
    }
    return done(THREE, c, false);
  }
  /* the altar's carved apron: a kanok band, gold flames on red, as the plan draws it (§4.1 1) */
  function makeKanokT(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 96);
    x.fillStyle = '#7a1410'; x.fillRect(0, 0, 1024, 96);
    x.fillStyle = '#c8962e'; x.fillRect(0, 0, 1024, 6); x.fillRect(0, 90, 1024, 6);
    x.strokeStyle = '#e0b04a'; x.fillStyle = '#d8a43c'; x.lineWidth = 3; x.lineCap = 'round';
    for (let i = 0; i < 16; i++) {
      const cx = 32 + i * 64;
      // a kanok flame: a leaf-shaped body, its tip curling over, two small flames either side
      x.beginPath(); x.moveTo(cx, 82); x.quadraticCurveTo(cx - 20, 58, cx - 6, 30); x.quadraticCurveTo(cx + 4, 14, cx + 16, 20);
      x.quadraticCurveTo(cx + 6, 26, cx + 8, 38); x.quadraticCurveTo(cx + 18, 58, cx, 82); x.fill();
      for (const s of [-1, 1]) { x.beginPath(); x.moveTo(cx + s * 12, 82); x.quadraticCurveTo(cx + s * 26, 66, cx + s * 22, 50); x.stroke(); }
      x.fillStyle = '#7a1410'; x.beginPath(); x.ellipse(cx - 2, 58, 3, 7, 0.3, 0, Math.PI * 2); x.fill(); x.fillStyle = '#d8a43c';
    }
    return done(THREE, c, true);
  }
  /* the runner on the altar: red cloth, a gold border and a fringe */
  function makeRunnerT(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 512), r = rng(5171);
    x.fillStyle = '#8a1812'; x.fillRect(0, 0, 256, 512);
    for (let i = 0; i < 1600; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '40,4,2' : '200,60,40'},${(0.04 + r() * 0.06).toFixed(3)})`; x.fillRect(r() * 256, r() * 512, 2, 2); }
    x.strokeStyle = '#d4a23c'; x.lineWidth = 10; x.strokeRect(14, 14, 228, 484);
    x.lineWidth = 3; x.strokeRect(30, 30, 196, 452);
    x.fillStyle = '#d4a23c';
    for (let y = 46; y < 470; y += 34) { x.beginPath(); x.moveTo(128, y); x.lineTo(140, y + 12); x.lineTo(128, y + 24); x.lineTo(116, y + 12); x.closePath(); x.fill(); }
    return done(THREE, c, false);
  }
  /* THE OWNER'S CARD (§2.5 3): his rules in his neat capitals, a little soft at the corners from months against the
     music box; its words are the plan's, as he wrote them */
  const CARD_RULES = ['AS THEIR LUANG PHOR TAUGHT.', '', 'EVERY NIGHT —', 'fresh water, never let it run dry', 'a sweet drink each',
                      'one stick each', 'wind the box', 'talk to them kindly', '', 'EVERY BUDDHA DAY —', 'make merit in their names', '',
                      'NEVER for greed.', 'NEVER ask them for anything wrong.', '', 'FOR AS LONG AS YOU LIVE —',
                      'and if one day you truly cannot,', 'bring them back. Never leave them.'];
  function makeOwnerCardT(THREE, cnv) {
    const [c, x] = sized(cnv, 512, 720), r = rng(5179);
    x.fillStyle = '#f2ecdc'; x.fillRect(0, 0, 512, 720);
    for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(140,120,80,${(r() * 0.06).toFixed(3)})`; x.fillRect(r() * 512, r() * 720, 3, 3); }
    // soft corners: a little grey where a thumb has held it
    for (const [cx, cy] of [[0, 0], [512, 0], [0, 720], [512, 720]]) {
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, 70); g.addColorStop(0, 'rgba(120,100,70,0.22)'); g.addColorStop(1, 'rgba(120,100,70,0)');
      x.fillStyle = g; x.fillRect(cx - 70, cy - 70, 140, 140);
    }
    x.fillStyle = '#20263a'; x.textBaseline = 'alphabetic';
    let y = 64;
    for (const line of CARD_RULES) {
      if (!line) { y += 14; continue; }
      const head = line === line.toUpperCase();
      x.font = head ? 'bold 27px sans-serif' : '25px sans-serif';
      x.fillText(line, head ? 36 : 56, y);
      if (!head) { x.beginPath(); x.arc(42, y - 8, 3.5, 0, Math.PI * 2); x.fill(); }
      y += head ? 36 : 33;
    }
    return done(THREE, c, false);
  }
  /* the calendar on the wall: this month, every day so far crossed off, none missed (§2.5 3) */
  function makeCalendarT(THREE, cnv, today = 24) {
    const [c, x] = sized(cnv, 320, 440);
    x.fillStyle = '#f6f4ee'; x.fillRect(0, 0, 320, 440);
    x.fillStyle = '#b8241c'; x.fillRect(0, 0, 320, 64);
    x.fillStyle = '#fff'; x.font = 'bold 30px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('OCTOBER', 160, 34);
    x.fillStyle = '#3a3a40'; x.font = 'bold 14px sans-serif';
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach((d, i) => x.fillText(d, 26 + i * 44.5, 86));
    for (let d = 1; d <= 31; d++) {
      const k = d + 2, col = k % 7, row = Math.floor(k / 7), cx = 26 + col * 44.5, cy = 118 + row * 52;
      x.fillStyle = '#2a2a30'; x.font = '18px sans-serif'; x.fillText(String(d), cx, cy);
      if (d < today) { x.strokeStyle = '#b8241c'; x.lineWidth = 3; x.beginPath(); x.moveTo(cx - 14, cy - 12); x.lineTo(cx + 14, cy + 12); x.stroke(); }
    }
    return done(THREE, c, false);
  }
  /* the cork board over the desk */
  function makeCorkT(THREE, cnv) {
    const [c, x] = sized(cnv, 512, 320), r = rng(5183);
    x.fillStyle = '#b8895a'; x.fillRect(0, 0, 512, 320);
    for (let i = 0; i < 5000; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '90,60,30' : '220,180,130'},${(0.12 + r() * 0.2).toFixed(2)})`; x.fillRect(r() * 512, r() * 320, 2, 2); }
    x.strokeStyle = '#5a3a1e'; x.lineWidth = 14; x.strokeRect(0, 0, 512, 320);
    return done(THREE, c, false);
  }
  /* a temple's merit receipt (V29): a printed slip — its heading in Thai, ใบอนุโมทนาบัตร (a certificate of rejoicing
     in merit, what a temple hands back for a gift), and in English; the temple's gold seal; the names it was made in;
     a few printed lines; the temple's stamp. No amount is shown (§2.5 1: it says what was given, never what it cost) */
  function makeReceiptT(THREE, cnv, i) {
    const [c, x] = sized(cnv, 160, 240), r = rng(5191 + i * 13);
    x.fillStyle = i === 0 ? '#efe6cc' : '#f6f2e6'; x.fillRect(0, 0, 160, 240);
    x.fillStyle = '#8a2a1e'; x.font = 'bold 13px sans-serif'; x.textAlign = 'center'; x.fillText('ใบอนุโมทนาบัตร', 80, 24);
    x.fillStyle = '#3a3020'; x.font = '10px sans-serif'; x.fillText('RECEIPT OF MERIT', 80, 40);
    x.fillStyle = '#c8a44a'; x.beginPath(); x.arc(80, 70, 16, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#3a3020'; x.textAlign = 'left'; x.font = '10px sans-serif';
    const lines = i === 0 ? ['in the name of', 'the young woman', '(her portrait)'] : ['in the names of', 'the three children', 'in my care'];
    lines.forEach((l, k) => x.fillText(l, 18, 110 + k * 16));
    for (let k = 0; k < 4; k++) { x.fillStyle = 'rgba(60,50,30,0.35)'; x.fillRect(18, 168 + k * 12, 70 + r() * 50, 2); }
    x.fillStyle = 'rgba(30,60,140,0.7)'; x.beginPath(); x.ellipse(118, 206, 22, 14, -0.2, 0, Math.PI * 2); x.fill();   // the temple's stamp
    return done(THREE, c, false);
  }
  /* the ROADEYE sticker and an order slip (§4.1 9) */
  function makeStickerT(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 96);
    x.fillStyle = '#1b1f26'; x.fillRect(0, 0, 256, 96);
    x.fillStyle = '#f2b429'; x.font = 'bold 44px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('ROADEYE', 128, 50);
    return done(THREE, c, false);
  }
  function makeOrderSlipT(THREE, cnv) {
    const [c, x] = sized(cnv, 200, 260), r = rng(5197);
    x.fillStyle = '#fbfaf6'; x.fillRect(0, 0, 200, 260);
    x.fillStyle = '#20242c'; x.font = 'bold 15px sans-serif'; x.fillText('ORDER #4417', 14, 26);
    x.font = '12px sans-serif'; ['1 x ROADEYE 1080P', '1 x 64GB card', 'ship: Tampines'].forEach((l, k) => x.fillText(l, 14, 56 + k * 20));
    for (let k = 0; k < 6; k++) { x.fillStyle = 'rgba(40,44,52,0.25)'; x.fillRect(14, 132 + k * 14, 60 + r() * 100, 2); }
    return done(THREE, c, false);
  }
  /* a book's spine (§4.1 10): invented titles, nothing on them about Kumanthong */
  function makeSpineT(THREE, cnv, title, bg, fg) {
    const [c, x] = sized(cnv, 64, 400);
    x.fillStyle = bg; x.fillRect(0, 0, 64, 400);
    x.fillStyle = fg; x.fillRect(0, 22, 64, 4); x.fillRect(0, 374, 64, 4);
    x.save(); x.translate(32, 200); x.rotate(Math.PI / 2);
    x.fillStyle = fg; x.font = 'bold 22px serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    let px = 22; while (x.measureText(title).width > 320 && px > 12) { px -= 1; x.font = `bold ${px}px serif`; }
    x.fillText(title, 0, 0); x.restore();
    return done(THREE, c, false);
  }
  /* chapter 1's: a ROADEYE dashcam carton */
  function makeDashBox(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    x.fillStyle = '#b48c5c'; x.fillRect(0, 0, S, S);
    x.fillStyle = '#1b1f26'; x.fillRect(20, 40, S - 40, S - 80);
    x.fillStyle = '#f2b429'; x.font = 'bold 38px sans-serif'; x.textAlign = 'center'; x.fillText('ROADEYE', S / 2, 104);
    x.fillStyle = '#e8ecf2'; x.font = 'bold 22px sans-serif'; x.fillText('DASHCAM · 1080P', S / 2, 146);
    x.fillStyle = '#3a4a5c'; x.beginPath(); x.arc(S / 2, 186, 16, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#8ab4ff'; x.beginPath(); x.arc(S / 2 + 4, 182, 5, 0, Math.PI * 2); x.fill();
    return done(THREE, c, false);
  }
  /* the second monitor: the ROADEYE dashboard — the week's orders climbing, the packing queue */
  function makeDashboardT(THREE, cnv) {
    const [c, x] = sized(cnv, 512, 300), r = rng(5203);
    x.fillStyle = '#121620'; x.fillRect(0, 0, 512, 300);
    x.fillStyle = '#1b2230'; x.fillRect(0, 0, 512, 36);
    x.fillStyle = '#f2b429'; x.font = 'bold 18px sans-serif'; x.fillText('ROADEYE · DASHBOARD', 14, 24);
    x.fillStyle = '#8a94a8'; x.font = '12px sans-serif'; x.fillText('This week', 14, 60); x.fillText('To pack', 300, 60);
    x.fillStyle = '#e8ecf2'; x.font = 'bold 34px sans-serif'; x.fillText('148', 14, 98); x.fillText('12', 300, 98);
    let px = 20, py = 260; x.strokeStyle = '#5ac87a'; x.lineWidth = 3; x.beginPath(); x.moveTo(px, py);
    for (let i = 1; i <= 12; i++) { px = 20 + i * 22; py = 260 - i * 9 - r() * 14; x.lineTo(px, py); }
    x.stroke();
    for (let k = 0; k < 6; k++) { x.fillStyle = k % 2 ? '#1b2230' : '#171d29'; x.fillRect(300, 120 + k * 26, 196, 24); x.fillStyle = '#c8d0e0'; x.font = '11px sans-serif'; x.fillText('#44' + (12 + k) + '  ROADEYE 1080P', 308, 136 + k * 26); }
    return done(THREE, c, false);
  }
  /* the laptop: his orders, late at night (the home film's weeks) */
  function makeLaptopT(THREE, cnv) {
    const [c, x] = sized(cnv, 512, 322);
    x.fillStyle = '#f6f7f9'; x.fillRect(0, 0, 512, 322);
    x.fillStyle = '#e4e6ea'; x.fillRect(0, 0, 512, 26);
    for (const [cx, col] of [[14, '#ff5f57'], [30, '#febc2e'], [46, '#28c840']]) { x.fillStyle = col; x.beginPath(); x.arc(cx, 13, 5, 0, Math.PI * 2); x.fill(); }
    x.fillStyle = '#1f2a3a'; x.font = 'bold 20px sans-serif'; x.fillText('ROADEYE · ORDERS', 24, 60);
    for (let k = 0; k < 7; k++) {
      x.fillStyle = k % 2 ? '#fff' : '#f0f2f6'; x.fillRect(24, 76 + k * 32, 464, 30);
      x.fillStyle = '#2a3242'; x.font = '13px sans-serif'; x.fillText(`#44${11 + k}   ROADEYE 1080P   ${['Tampines', 'Bedok', 'Jurong W', 'Yishun', 'Clementi', 'Hougang', 'Woodlands'][k]}`, 34, 96 + k * 32);
      x.fillStyle = k < 4 ? '#2a8a4a' : '#c87a1a'; x.fillText(k < 4 ? 'packed' : 'to pack', 410, 96 + k * 32);
    }
    return done(THREE, c, false);
  }
  /* the music box's lid: a drawn inlay — a lotus in pale wood on dark, a border of small diamonds */
  function makeInlayT(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 192);
    x.fillStyle = '#3a2214'; x.fillRect(0, 0, 256, 192);
    x.strokeStyle = '#c8a46a'; x.lineWidth = 4; x.strokeRect(10, 10, 236, 172);
    x.fillStyle = '#d8b880';
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * 0.42; x.save(); x.translate(128, 120); x.rotate(a + Math.PI / 2);
      x.beginPath(); x.ellipse(0, -30, 11, 30, 0, 0, Math.PI * 2); x.fill(); x.restore(); }
    x.fillStyle = '#c8a46a'; for (let k = 0; k < 14; k++) { const xx = 24 + k * 16; x.beginPath(); x.moveTo(xx, 22); x.lineTo(xx + 4, 26); x.lineTo(xx, 30); x.lineTo(xx - 4, 26); x.fill(); }
    return done(THREE, c, false);
  }
  /* a plain colour field with a cloth's weave (a towel, a shirt, a blanket) */
  function makeWeaveT(THREE, cnv, base, seed) {
    const S = 128, [c, x] = cnv(S), r = rng(seed || 5209);
    x.fillStyle = base; x.fillRect(0, 0, S, S);
    for (let y = 0; y < S; y += 2) { x.fillStyle = `rgba(0,0,0,${(0.03 + r() * 0.04).toFixed(3)})`; x.fillRect(0, y, S, 1); }
    for (let i = 0; i < 400; i++) { x.fillStyle = `rgba(255,255,255,${(r() * 0.05).toFixed(3)})`; x.fillRect(r() * S, r() * S, 2, 2); }
    return done(THREE, c, true);
  }

  /* chapter 1's Sak Yant cloths (v19.1), copied with the Khom letters they are written in */
  /* Khom-style letters (the yant's script is Khom, not in any font a phone
     has): drawn strokes in a 10 x 10 box, y down — a looped head where the
     pen starts, arches, hooks and tails, the shapes of ห ส ม อ ข ร น ะ ๆ ช
     ย พ ท ถ ศ ง as the references write them. */
  const KHOM = [
    'M2.3 7.6m-0.9 0a0.9 0.9 0 1 0 1.8 0a0.9 0.9 0 1 0-1.8 0M3.2 7.6V3.6Q3.2 2.2 4.6 2.2Q6 2.2 6 3.6V8.4M6 3.6Q6 2.2 7.3 2.2Q8.6 2.2 8.6 3.6V8.2Q8.6 9.2 9.4 8.8',
    'M3 3.3m-0.9 0a0.9 0.9 0 1 1 1.8 0a0.9 0.9 0 1 1-1.8 0M2.1 3.6Q2.4 8.4 5.2 8.4Q8 8.4 8 5.2V2.4Q8 1.4 9 1.8',
    'M2.6 7.4m-0.8 0a0.8 0.8 0 1 0 1.6 0a0.8 0.8 0 1 0-1.6 0M3.4 7.4V2.6M3.4 7.6Q5 9.2 6.6 7.4Q7.8 6 7.8 2.6V8.6',
    'M3.4 4.4m-0.8 0a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1-1.6 0M2.6 4.6Q2.6 8.4 5.4 8.4Q8.2 8.4 8.2 5.4Q8.2 2 5.4 2Q3.6 2 3.4 3.6',
    'M2.8 3.2m-0.8 0a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1-1.6 0M3.6 3.4Q3.4 5.2 2.6 5.6Q2.2 8.4 5.2 8.4Q8 8.4 8 5.4V2.2',
    'M2.4 2.6Q5 1.4 7.6 2.6Q4.6 3.6 4.4 5.4Q4.4 6.6 6 6.6Q7.4 6.8 6.6 8.6Q6 9.4 4.6 9',
    'M2.6 7.4m-0.8 0a0.8 0.8 0 1 0 1.6 0a0.8 0.8 0 1 0-1.6 0M3.4 7.4V3.8Q3.4 2.2 5 2.2Q6.6 2.2 6.6 3.8V7.6Q6.6 8.6 7.6 8.4Q8.6 8.2 8.4 6.8Q8.2 6 7.6 6.4',
    'M5 3.6m-1 0a1 1 0 1 1 2 0a1 1 0 1 1-2 0M5 7.2m-1 0a1 1 0 1 1 2 0a1 1 0 1 1-2 0',
    'M2.2 6.2Q3.4 2.8 5.2 4.8Q6.4 6.4 7.4 3.6Q7.8 2.4 8.8 2.8',
    'M2.6 7.4m-0.8 0a0.8 0.8 0 1 0 1.6 0a0.8 0.8 0 1 0-1.6 0M3.4 7.4V2.6M3.4 7.6Q5 9.2 6.6 7.4V2.4Q6.6 1.6 7.6 1.8L8.8 1.2',
    'M2.6 3.4m-0.8 0a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1-1.6 0M3.4 3.4V7.4Q3.4 8.4 4.6 8Q6 7.4 6 5.6V7.6Q6 8.6 7.4 8.4Q8.4 8 8.4 2.4',
    'M2.4 2.4V7.2Q2.4 8.4 3.6 8L5 5.4L6.4 8Q7.6 8.4 7.6 7.2V2.4M7.6 2.4m-0.8 0a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1-1.6 0',
    'M2.6 3m-0.8 0a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1-1.6 0M3.4 3.2Q3.6 5 2.8 5.4Q2.4 8.4 4.2 8.4Q5.6 8.4 5.6 6.4V3.4Q5.6 2.2 7 2.2Q8.4 2.2 8.4 3.6V8.6',
    'M2.6 7.2m-0.8 0a0.8 0.8 0 1 0 1.6 0a0.8 0.8 0 1 0-1.6 0M3.4 7.2V3.8Q3.4 2.2 5.4 2.2Q7.6 2.2 7.6 4.4V8.4Q7.6 9.6 6.4 9.8',
    'M3 4Q3 2 5 2Q7.6 2 7.6 4.8Q7.6 8.4 5 8.4Q3 8.4 3 6.6Q3 5.6 4.2 5.6Q5.2 5.8 5 6.8',
    'M3.2 4.6m-0.8 0a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1-1.6 0M4 4.6Q5.6 5 6.4 4Q7.8 2.4 7 1.8M6.4 4Q7.4 6.6 6.4 8.4Q5.6 9.2 4.4 8.6'
  ];
  const KHOM_MARK = ['M3.6 0.9Q5 -0.5 6.4 0.9', 'M5 0.4m-0.6 0a0.6 0.6 0 1 1 1.2 0a0.6 0.6 0 1 1-1.2 0', 'M5.2 9.4Q6 10.6 4.8 11'];
  let khomP = null;
  /* one letter, size px square, centred on (cx, cy); `n` picks it */
  function khom(x, cx, cy, size, n, rot = 0) {
    if (!khomP) khomP = { g: KHOM.map(d => new Path2D(d)), m: KHOM_MARK.map(d => new Path2D(d)) };
    const j1 = ((Math.abs(n) * 37) % 11 - 5) / 5, j2 = ((Math.abs(n) * 53) % 7 - 3) / 3;   // a hand's wobble, the same every load
    const k = size / 10 * (1 + j2 * 0.07);
    x.save(); x.translate(cx, cy); x.rotate(rot + j1 * 0.09); x.scale(k, k); x.translate(-5, -5);
    x.lineWidth = 1.15; x.lineCap = 'round'; x.lineJoin = 'round';
    x.stroke(khomP.g[Math.abs(n) % KHOM.length]);
    const mk = Math.abs(n * 7 + 3) % 9;
    if (mk < KHOM_MARK.length) x.stroke(khomP.m[mk]);
    x.restore();
  }
  /* letters along a straight run, left to right */
  function khomRow(x, x0, x1, y, size, seed) {
    const n = Math.max(1, Math.floor((x1 - x0) / (size * 0.92)));
    const step = (x1 - x0) / n;
    for (let i = 0; i < n; i++) khom(x, x0 + step * (i + 0.5), y, size, seed + i * 5);
  }
  /* THE UNALOME — the path to enlightenment: a curl at its root (the
     tangle of life), switchbacks narrowing as it rises (the way), then the
     straight line (release). Root at (bx, by), rising h px (h < 0: it hangs
     DOWN, as the Hah Taew's lower ones do); w is the curl's width. */
  function unalome(x, bx, by, h, w) {
    const up = h >= 0 ? 1 : -1, H = Math.abs(h);
    x.save(); x.translate(bx, by); x.scale(1, -up);              // local frame: +y is "up" the spire
    x.lineCap = 'round'; x.lineJoin = 'round';
    // the root: a spiral of 1.6 turns opening out, its centre over the root
    const r0 = w * 0.32;
    x.beginPath();
    for (let i = 0; i <= 40; i++) {
      const t = i / 40, a = -Math.PI / 2 + t * Math.PI * 2 * 1.6, rr = r0 * (0.25 + 0.75 * t);
      const px = Math.cos(a) * rr, py = r0 + Math.sin(a) * rr;
      i ? x.lineTo(px, py) : x.moveTo(px, py);
    }
    // the switchbacks
    let y = r0 * 2.1; const zz = 5;
    for (let i = 0; i < zz; i++) {
      const a = (w / 2) * (1 - i / (zz + 1)), dy = w * 0.36 * (1 - i * 0.08);
      const sx = i % 2 ? -1 : 1;
      x.quadraticCurveTo(sx * a * 1.25, y + dy * 0.2, sx * a * 0.2, y + dy * 0.75);
      x.quadraticCurveTo(-sx * a * 0.6, y + dy * 0.95, 0, y + dy);
      y += dy;
    }
    x.lineTo(0, Math.max(y + w * 0.3, H));
    x.stroke();
    x.restore();
  }
  /* the three ovals — the Triple Gem — stacked, standing on (cx, by), w wide */
  function ovals(x, cx, by, w) {
    const r1 = w * 0.13, r2 = w * 0.12, r3 = w * 0.12;
    x.beginPath(); x.ellipse(cx, by - r1, w / 2, r1, 0, 0, Math.PI * 2); x.stroke();
    x.beginPath(); x.ellipse(cx, by - r1 * 2 - r2, w * 0.34, r2, 0, 0, Math.PI * 2); x.stroke();
    x.beginPath(); x.arc(cx, by - r1 * 2 - r2 * 2 - r3, r3, 0, Math.PI * 2); x.stroke();
    return by - r1 * 2 - r2 * 2 - r3 * 2;                       // the top of the stack
  }
  /* a curl at the end of a rule, as the yant's baselines end */
  function curl(x, ex, ey, dir, s) {
    x.beginPath(); x.moveTo(ex, ey);
    x.quadraticCurveTo(ex + dir * s * 1.2, ey, ex + dir * s * 1.1, ey + s * 0.6);
    x.quadraticCurveTo(ex + dir * s * 0.9, ey + s * 1.0, ex + dir * s * 0.55, ey + s * 0.7);
    x.stroke();
  }
  /* v19.1 · THE YANT CLOTHS (pha yant), redrawn from the three designs Chad
     gave (bkktattoostudio13.com, saved at v17.7 — Chad: "all the yant
     posters around the room needs to be completely redrawn according to the
     yant designs i provided you before. they need to be accurate and
     representative of real sak yant designs"). Black ink on unbleached cloth
     with a red border, the master's seal, gold leaf pressed on by the
     devout, as the references carry it.
       'gao'  — YANT GAO YORD: a stepped pyramid of script cells, 9-7-5-3-1;
                on every step's outer corner the three ovals and an unalome —
                the nine peaks — the middle one the tallest; two lines of
                script under it, ending in curls.
       'hah'  — YANT HAH TAEW CHAT PETCH: five vertical rows of script, an
                unalome rising from the top of each and one hanging from the
                bottom, and the Chat Petch — the diamond net — crossing
                between the rows.
       'sroi' — YANT SROI SANGWAN: the necklace — three rows of script hung
                in a U, an unalome rising from both ends of every row, and the
                pendant at the front: a diamond with three unalomes over it.
     `aspect` is height / width; the design keeps its own proportions and is
     centred, with plain cloth round it. */
  function makeYantCloth(THREE, cnv, k, aspect) {
    const A = aspect || ({ gao: 0.84, hah: 1.6, sroi: 0.66 })[k] || 0.84;
    const W = k === 'hah' ? 560 : 900, H = Math.round(W * A), [c, x] = cnv(W); c.height = H;
    const r = rng(97 + ({ gao: 1, hah: 2, sroi: 3 })[k] * 31);
    x.fillStyle = '#efe6d2'; x.fillRect(0, 0, W, H);
    // the weave, and the cloth's age
    for (let y = 0; y < H; y += 3) { x.fillStyle = `rgba(120,100,70,${0.025 + r() * 0.03})`; x.fillRect(0, y, W, 1); }
    for (let xx = 0; xx < W; xx += 3) { x.fillStyle = `rgba(120,100,70,${0.02 + r() * 0.025})`; x.fillRect(xx, 0, 1, H); }
    const vg = x.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(110,80,40,0.16)');
    x.fillStyle = vg; x.fillRect(0, 0, W, H);
    const B = Math.round(Math.min(W, H) * 0.035);
    x.strokeStyle = '#9a1c14'; x.lineWidth = B; x.strokeRect(B, B, W - 2 * B, H - 2 * B);
    // the design's own box, fitted inside the border
    const DA = ({ gao: 0.84, hah: 1.6, sroi: 0.66 })[k];
    let dw = W - 6 * B, dh = dw * DA;
    if (dh > H - 6 * B) { dh = H - 6 * B; dw = dh / DA; }
    const ox = (W - dw) / 2, oy = (H - dh) / 2;
    x.strokeStyle = '#17110c'; x.fillStyle = '#17110c';
    const gold = [];
    if (k === 'gao') {
      /* the whole of it — five rows, the ovals, the tallest spire and two
         lines of script under — is 10.3 cells tall and 10.5 wide */
      const cw = Math.min(dw / 10.5, dh / 10.3), rows = [9, 7, 5, 3, 1], cx = ox + dw / 2, yb = oy + dh / 2 + cw * 2.95;
      x.lineWidth = Math.max(2.2, cw * 0.05);
      let seed = 3;
      rows.forEach((n, ri) => {
        const y1 = yb - ri * cw, y0 = y1 - cw, x0 = cx - n * cw / 2;
        x.strokeRect(x0, y0, n * cw, cw);
        for (let i = 1; i < n; i++) { x.beginPath(); x.moveTo(x0 + i * cw, y0); x.lineTo(x0 + i * cw, y1); x.stroke(); }
        for (let i = 0; i < n; i++) khom(x, x0 + (i + 0.5) * cw, y0 + cw * 0.5, cw * 0.66, seed++);
      });
      // the bottom rule runs out past the cells and curls under at both ends
      x.beginPath(); x.moveTo(cx - 4.5 * cw - cw * 0.35, yb); x.lineTo(cx + 4.5 * cw + cw * 0.35, yb); x.stroke();
      curl(x, cx - 4.5 * cw - cw * 0.35, yb, -1, cw * 0.3); curl(x, cx + 4.5 * cw + cw * 0.35, yb, 1, cw * 0.3);
      // the nine peaks: on each step's two outer cells, and the top cell
      rows.forEach((n, ri) => {
        const y0 = yb - (ri + 1) * cw, ends = n === 1 ? [cx] : [cx - (n - 1) * cw / 2, cx + (n - 1) * cw / 2];
        for (const ex of ends) {
          const top = ovals(x, ex, y0, cw * 0.8);
          unalome(x, ex, top, n === 1 ? cw * 2.4 : cw * 1.9, cw * 0.62);
        }
      });
      // two lines of script under it, the rules ending in curls
      for (let j = 0; j < 2; j++) {
        const y = yb + cw * (0.62 + j * 0.78), half = cw * (4.9 - j * 0.6);
        khomRow(x, cx - half, cx + half, y, cw * 0.6, 40 + j * 17);
        x.beginPath(); x.moveTo(cx - half - cw * 0.5, y + cw * 0.36); x.lineTo(cx + half + cw * 0.5, y + cw * 0.36); x.stroke();
        curl(x, cx - half - cw * 0.5, y + cw * 0.36, -1, cw * 0.22); curl(x, cx + half + cw * 0.5, y + cw * 0.36, 1, cw * 0.22);
      }
      gold.push([cx - cw * 0.2, yb - cw * 1.4, cw * 0.9, 0.22]);
    } else if (k === 'hah') {
      const cols = 5, gap = dw / 5.4, x0 = ox + dw / 2 - gap * 2, top = oy + dh * 0.215, bot = oy + dh * 0.79, nr = 8;
      const ch = (bot - top) / nr, gs = Math.min(gap * 0.62, ch * 0.82);
      x.lineWidth = Math.max(2.0, gs * 0.095);
      for (let ci = 0; ci < cols; ci++) {
        const gx = x0 + ci * gap;
        unalome(x, gx, top - ch * 0.15, top - ch * 0.15 - (oy + dh * 0.01), gs * 0.72);
        unalome(x, gx, bot + ch * 0.15, -((oy + dh * 0.99) - (bot + ch * 0.15)), gs * 0.72);
        for (let j = 0; j < nr; j++) khom(x, gx, top + (j + 0.5) * ch, gs, ci * 11 + j * 3 + 1);
      }
      // the Chat Petch: a diamond net crossing between the rows, between the letters
      x.lineWidth = Math.max(1.8, gs * 0.07);
      for (let ci = 0; ci < cols - 1; ci++) {
        const a = x0 + ci * gap + gs * 0.42, b = x0 + (ci + 1) * gap - gs * 0.42;
        for (let j = 0; j < nr - 1; j++) {
          const ya = top + (j + 0.5) * ch + ch * 0.12, yb = top + (j + 1.5) * ch - ch * 0.12;
          x.beginPath(); x.moveTo(a, ya); x.lineTo(b, yb); x.moveTo(b, ya); x.lineTo(a, yb); x.stroke();
        }
      }
    } else {
      // three rows hung in a U, from the upper corners down to the front
      const cx = ox + dw / 2, rows = 3, s = dh * 0.072;
      const arc = (j, t) => {                       // t 0..1 along the row; j 0 outer .. 2 inner
        const hw = dw * (0.43 - j * 0.055), y0 = oy + dh * (0.25 + j * 0.02), y1 = oy + dh * (0.80 - j * 0.105);
        const a = Math.PI * (1 - t);                // from the left end round the bottom to the right
        return [cx + Math.cos(a) * hw, y0 + Math.sin(a) * (y1 - y0) * 1];
      };
      x.lineWidth = Math.max(2.0, s * 0.1);
      for (let j = 0; j < rows; j++) {
        const n = 34 - j * 6;
        for (let i = 0; i < n; i++) {
          const t = (i + 0.5) / n;
          if (Math.abs(t - 0.5) < [0.035, 0.06, 0.1][j]) continue;        // every row breaks round the pendant and its spires
          const [px, py] = arc(j, t), [qx, qy] = arc(j, Math.min(1, t + 0.01));
          khom(x, px, py, s, j * 13 + i * 3 + 2, Math.atan2(qy - py, qx - px));
        }
        // an unalome rising from each end of the row
        const [lx, ly] = arc(j, 0), [rx, ry] = arc(j, 1);
        unalome(x, lx, ly - s * 0.55, (ly - s * 0.55) - (oy + dh * 0.02 + j * s * 0.3), s * 0.55);
        unalome(x, rx, ry - s * 0.55, (ry - s * 0.55) - (oy + dh * 0.02 + j * s * 0.3), s * 0.55);
      }
      // the pendant: a diamond with an eye in it, three unalomes over it
      const [px, py] = arc(1, 0.5), d = s * 1.2;
      x.lineWidth = Math.max(2.2, s * 0.12);
      x.beginPath(); x.moveTo(px, py - d); x.lineTo(px + d * 0.8, py); x.lineTo(px, py + d); x.lineTo(px - d * 0.8, py); x.closePath(); x.stroke();
      x.beginPath(); x.moveTo(px, py - d * 0.55); x.lineTo(px + d * 0.42, py); x.lineTo(px, py + d * 0.55); x.lineTo(px - d * 0.42, py); x.closePath(); x.stroke();
      x.beginPath(); x.arc(px, py, d * 0.13, 0, Math.PI * 2); x.fill();
      x.lineWidth = Math.max(1.9, s * 0.095);
      unalome(x, px, py - d * 1.05, d * 3.4, s * 0.5);
      unalome(x, px - d * 0.62, py - d * 0.55, d * 2.5, s * 0.42);
      unalome(x, px + d * 0.62, py - d * 0.55, d * 2.5, s * 0.42);
      gold.push([px + d * 0.1, py + d * 0.05, d * 1.05, -0.3]);
    }
    // gold leaf, pressed on by the devout (the references carry it too)
    for (const [gx, gy, gs, rot] of gold) {
      x.save(); x.translate(gx, gy); x.rotate(rot);
      const gg = x.createLinearGradient(-gs / 2, -gs / 2, gs / 2, gs / 2);
      gg.addColorStop(0, 'rgba(214,170,78,0.92)'); gg.addColorStop(0.45, 'rgba(240,206,120,0.95)'); gg.addColorStop(1, 'rgba(176,132,52,0.92)');
      x.fillStyle = gg; x.fillRect(-gs / 2, -gs / 2, gs, gs);
      x.restore();
    }
    // the master's seal in a corner
    const sx = W - 3.4 * B, sy = H - 3.4 * B;
    x.fillStyle = 'rgba(160,30,20,0.85)'; x.beginPath(); x.arc(sx, sy, B * 1.1, 0, Math.PI * 2); x.fill();
    x.strokeStyle = 'rgba(239,230,210,0.9)'; x.lineWidth = B * 0.16; x.beginPath(); x.arc(sx, sy, B * 0.8, 0, Math.PI * 2); x.stroke();
    return done(THREE, c, false);
  }

  /* ============================================================== THE FILMS
     Stubs until CP9 (the opening film and the home film), CP5 (the counter's films M and K) and CP7 (the three
     possessions). Each begins and ends as it will: the opening film on black and back to it (the v4.6 law, the card
     over its black); a film from play out of the picture into black, its black handed to the kit's fade (v21.0). */
  function introFilm(c, s, api) {
    const { step, fade, stage } = api;
    const F = stage.film;
    c.keepFade = true;
    c.endFade = 1;
    fade(0, 0, 1, 1);
    // O1 · the corridor at closing time, the shop's glass ahead (CP9 walks it)
    step(0, () => { api.yaw.position.set(F.SX + 0.6, 1.62, 3.4); api.yaw.rotation.y = 0; api.pitch.rotation.x = -0.04; });
    fade(0.6, 1.6, 1, 0);
    fade(3.4, 4.2, 0, 1);
    step(4.4, () => {});
  }
  function playFilm(c, api) {                  // the shape every film from play keeps (CP5, CP7, CP9 fill each)
    const { step, fade } = api;
    c.keepFade = true;                         // its last black is handed to the kit's fade: the next world lifts it
    c.endFade = 1;
    fade(0, 0.6, 0, 1);
    step(1.2, () => {});
  }
  function madeFilm(c, s, api) { playFilm(c, api); }       // film M · "Where They Came From" (CP5)
  function cardFilm(c, s, api) { playFilm(c, api); }       // film K · "The Card" (CP5)
  function homeFilm(c, s, api) { playFilm(c, api); }       // "Every Day" (CP9)
  function redFilm(c, s, api) { playFilm(c, api); }        // possession 1 · the red one (CP7)
  function shyFilm(c, s, api) { playFilm(c, api); }        // possession 2 · the shy one (CP7)
  function littleFilm(c, s, api) { playFilm(c, api); }     // possession 3 · the little one, and COME BACK (CP7)

  /* ============================================================ THE ENDINGS
     Stubs until CP8: each holds the decision's picture a moment and goes to black, the card over its black. */
  function endStub(c, api) {
    const { step, fade } = api;
    step(0, () => {});
    fade(1.2, 2.2, 0, 1);
    step(2.4, () => {});
    c.endFade = 1;
  }
  function scStay(c, s, api) { endStub(c, api); }          // A · stay inside them
  function scTell(c, s, api) { endStub(c, api); }          // B · tell the world
  function scWish(c, s, api) { endStub(c, api); }          // C · wish for it all
  function scCare(c, s, api) { endStub(c, api); }          // D · care for them, the door kept shut

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e3c5 = Object.assign(DATA, {
    build,
    scenes: [scStay, scTell, scWish, scCare],
    intro: introFilm,
    films: { made: madeFilm, card: cardFilm, home: homeFilm, red: redFilm, shy: shyFilm, little: littleFilm }
  });
})();
