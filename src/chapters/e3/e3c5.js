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

   PREVIEW (the forty-second seam): from v22.6 to v22.9 the chapter declared
   `preview` — registered, out of the run, opened only by a ?ch=e3c5 link — so
   Chad could play it while it was built; v23.0 released it by taking the flag
   out. Its sound was recorded at CP11 (masters/v23.0/make.sh).

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
  /* WORLD M's two (§4.1c, CP5): the hall by candlelight for the counter's film M — dark, warm, the light low from the
     candles on the table before the monk (+x of the three), their faces and his lit warm (CP13, by photograph: his face
     reads kind in it, never shadowed — he is where the compassion comes from); and first light
     for ending D (CP8 tunes it) — pale gold low in the east, the sky blue-grey to pink, the hall's lamps still lit */
  const TEMPLE_NIGHT = room({
    stops: [[0.00, '#0c0e18'], [0.12, '#0a0b14'], [0.35, '#080810'], [0.65, '#06060c'], [1.00, '#040408']],
    bg: 0x050508, fog: [0x0a0806, 0.035],
    hemi: [0xffb878, 0x140c08, 0.34], key: [0xffa860, 0.78, 4, 1.0, 0.6], fill: [0x5a4a80, 0.07],
    vmHemi: [0xffc890, 0x140c08, 0.4], vmKey: [0xffb070, 0.6]
  });
  const TEMPLE_DAWN = room({
    stops: [[0.00, '#f3c59a'], [0.12, '#e6b2a2'], [0.35, '#b8a6b8'], [0.65, '#8696b4'], [1.00, '#5a6a94']],
    bg: 0x8a96b0, fog: [0xc8b8b0, 0.006],
    hemi: [0xffe8d0, 0x4a4038, 0.85], key: [0xffd8a8, 0.9, 8, 3.0, 4], fill: [0xb8c8f0, 0.3],
    vmHemi: [0xffe8d0, 0x4a4038, 0.9], vmKey: [0xffd8a8, 0.85]
  });
  /* CP8: ending A's days — DRAINED, a grey afternoon with the colour gone out of it (his own balance worn down; never a
     cold coming for him, §2.4 3) — and ending D's years at the temple, first light in other seasons (the hot months'
     gold, the rains' grey) */
  const DRAINED = room({
    stops: [[0.00, '#b8bcc0'], [0.12, '#aeb2b6'], [0.35, '#9a9ea4'], [0.65, '#868a90'], [1.00, '#70747a']],
    bg: 0x9a9ea4, fog: [0x9a9ea4, 0.0004],
    hemi: [0xd8dadc, 0x4a4a4c, 0.80], key: [0xe0e0e0, 0.55, 6, 3, -2], fill: [0xb8bcc4, 0.26],
    vmHemi: [0xd8dadc, 0x4a4a4c, 0.82], vmKey: [0xe0e0e0, 0.6] });
  const TEMPLE_DAWN_HOT = room({
    stops: [[0.00, '#ffd08a'], [0.12, '#f4bc84'], [0.35, '#c8a8a0'], [0.65, '#9098b0'], [1.00, '#64709a']],
    bg: 0x9aa0b4, fog: [0xd8c0a0, 0.006],
    hemi: [0xfff0d0, 0x5a4a38, 0.95], key: [0xffd090, 1.05, 8, 3.0, 4], fill: [0xc0c8e8, 0.28],
    vmHemi: [0xfff0d0, 0x5a4a38, 0.95], vmKey: [0xffd090, 0.9] });
  const TEMPLE_DAWN_RAIN = room({
    stops: [[0.00, '#a8b0bc'], [0.12, '#9aa2ae'], [0.35, '#8890a0'], [0.65, '#727a8c'], [1.00, '#5a6276']],
    bg: 0x7a8292, fog: [0x8a929e, 0.014],
    hemi: [0xd0d8e4, 0x3a3e46, 0.78], key: [0xc8d0dc, 0.6, 8, 3.0, 4], fill: [0xa8b4c8, 0.32],
    vmHemi: [0xd0d8e4, 0x3a3e46, 0.8], vmKey: [0xc8d0dc, 0.6] });
  const PRESETS = { NIGHT, DEEP, DUSK, DAWN, MORNING, AFTERNOON, HARSH, RED, AMBER, BLUE, SURFACE, SHOP_EVE, TEMPLE_NIGHT, TEMPLE_DAWN, DRAINED };

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
        /* (CP13, §2.3 14: the case file's balance, said of every spirit and as the old belief — "Kumanthong are regarded
           as Yin" read as the very misconception the chapter clears, and the Yin of chapter 4's shop) */
        teach: 'Loving them is not becoming them. The old belief holds that a spirit is Yin and a living person Yang: even with no ill intent on either side, immersing yourself in them again and again wears away your own balance. Once you are lost, the care and the merit you promised them stop.' },
      { k: 'B', text: 'Post it all on the amulet forum — let everyone know it\'s real.',
        d: { sanity: -9, awareness: 6, wisdom: -12 }, verdict: 'bad',
        say: 'They were children, not a horror story. I showed strangers the way in.',
        /* (CP13, the words lens: its first sentence was the card line's own, and "take one in" had no noun) */
        teach: 'You do not need possession, trance or dramatic manifestations to prove a spiritual connection. Told as a thrill, a dangerous experiment becomes an invitation: strangers try it, or take a Kumanthong home, without knowing what caring for one asks of them.' },
      { k: 'C', text: 'Talk to them every day — and wish for everything you want.',
        d: { sanity: -15, awareness: -6, wisdom: -18 }, verdict: 'bad',
        say: 'I stopped giving to them. I only kept asking.',
        teach: 'Do not be driven by greed. Kumanthong taken in with compassion are kept first for their sake; whatever help they give is a gift, not a wage, and the ones from a temple are believed never to help with anything wrong. If you keep them for wealth, care turns into a bargain in which the wanting never stops.' },
      { k: 'D', text: 'Keep caring for them — but never open yourself to them again.',
        d: { sanity: 15, awareness: 24, wisdom: 30 }, verdict: 'best',
        say: 'I kept my promise every day, and I kept my own door shut.',
        teach: 'This is loving kindness: you care for them every day, you make merit in their names, and you ask for nothing back, for as long as you live. That merit, it is believed, is what helps them on toward a better birth. Treat the tradition with respect, and stay in control of yourself.' }
    ],
    /* Chad's purpose first, then S1·10's own lesson; the second person; no Pali tag (§2.3 9); its beliefs said as
       beliefs (§2.7) */
    /* (CP13, the words lens: "Kept well, they are kept" said kept twice, and a child was "it") */
    core: 'Kumanthong given a home at a temple are not the trapped, blood-fed spirits of frightening stories. They are kept out of compassion: children with nowhere to go, believed to help a kind keeper a little and to be carried toward a better birth by the merit made for them. Never keep one for greed or ask one for anything wrong. Take one in only if you can care for him, and make merit for him, for life — and never invite one to enter or take control of you.',

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
    assets: ['kumanred', 'kumanshy', 'kumanlittle', 'thaikit', 'buddhahd', 'buddhalod', 'slipper',   // (the room: the kit's fan, rug, fern and garlands; the shelf's small Buddha; his slippers)
             /* World S (CP5): chapter 3's shop by its own models (chapter 4's World H), its owner, and the old masters */
             'altarrow', 'altarrowfar', 'amushelf', 'traynear', 'trayfar', 'lersimask', 'owner',
             'mstr_lpthuad', 'mstr_lptimpray', 'mstr_somdejtoh', 'mstr_lptimbench', 'mstr_achanmun', 'mstr_lpphiboon',
             /* World M (CP5): chapter 4's temple by its own models — Chad's monk and the estate's block beyond its wall */
             'monkshop', 'hdb'],
    items: [],

    musicVol: 0,
    /* the beds (CP11, §9.3), mixed every frame by mixBeds: World S's air and the corridor after hours; World R's night,
       its fan (the fourth value its rate, the fan's own speed), 3 a.m., the morning at the window and the little one's
       water; and the two pieces of music that loop under play — the offerings' khim and the question's held tone */
    ambience: { beds: [['k5shopair', 0], ['k5mall', 0], ['k5nightbed', 0], ['k5fan', 0, 0, 1], ['k5deep', 0], ['k5dawnbed', 0],
                       ['k5under', 0], ['k5care', 0], ['k5night', 0]] },
    voiceLine: null,


    words: {
      approach: '',                          // no floating label (v12.5): the orders name what to do
      act: 'E to act',
      actTouch: 'Tap to act',
      interact: 'E to choose what you do',
      interactTouch: 'Tap to choose what you do',
      actLine: 'Press E to choose what you do',
      actLineTouch: 'Tap to choose what you do',
      // ENDING D's verse, as the water is poured (chapter 4's captions, the same take)
      yatha1: 'Yathā vārivahā pūrā',
      yatha1en: 'Just as rivers full of water',
      yatha2: 'Paripūrenti sāgaraṁ,',
      yatha2en: 'fill the ocean full,',
      yatha3: 'Evam-eva ito dinnaṁ',
      yatha3en: 'even so does that here given',
      yatha4: 'Petānaṁ upakappati.',
      yatha4en: 'benefit those who have passed on.',          // (peta: the departed — chapter 4 glosses it "the hungry ghosts", which under these three would call them the very thing §2.6 clears)
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
      /* his card (§2.5 3), line by line as he wrote it — the card is DRAWN from these (CARD_LAYOUT), so a change here is
         a change on the card in his room and on his glass alike */
      card1: 'AS THEIR LUANG PHOR TAUGHT.',
      card2: 'EVERY NIGHT —',
      card3: 'fresh water, never let it run dry',
      card4: 'a sweet drink each',
      card5: 'one stick each',
      card6: 'wind the box',
      card7: 'talk to them kindly',
      card8: 'EVERY BUDDHA DAY —',
      card9: 'make merit in their names',
      card10: 'NEVER for greed.',
      card11: 'NEVER ask them for anything wrong.',
      card12: 'FOR AS LONG AS YOU LIVE —',
      card13: 'and if one day you truly cannot,',
      card14: 'bring them back. Never leave them.',
      // THE ROOM
      objSit: 'Sit with them',
      hotMat: 'Sit with them',
      /* PLAY I · the offerings (CP6, §4.2) */
      /* (v24.2, L6-1: one order for the water and one for the drinks — "Give them water, then drinks · 0/3" came back
         unchanged once the water was poured, after an OBJECTIVE COMPLETE, and read as the water not having counted:
         Chad, "stuck at the water offering") */
      objWater: 'Give them their water',
      objDrinks: 'Make their drinks · {n}/3',
      objGiveRed: 'Give it to the red one',
      objGiveShy: 'Give it to the shy one',
      objGiveLittle: 'Give it to the little one',
      objIncense: 'Light their incense',
      objSticks: 'Give each one his stick · {n}/3',          // (v24.2, L6-5: "stick", as the badge, his line and the card say)
      hotJug: 'Their water',
      hotDrinks: 'Their drinks',
      hotPlace: 'Give it to him',
      hotPacket: 'Their incense',
      hotBowl: 'His stick',
      briefCapTitle: 'His drink',
      briefCap: 'Twist the cap off gently: circle your finger slowly around it. Then slide the straw in, and bend it to him.',
      briefCapKey: 'Twist the cap off gently: hold the mouse button and drag slowly in a circle around it, or hold E. Then slide the straw in, and bend it to him.',
      craftCap: 'Twist the cap off',
      craftStraw: 'Slide the straw in',
      craftBend: 'Bend the straw to him',
      craftWater: 'Hold to pour their water',
      craftLight: 'Strike the lighter',
      craftCatch: 'Hold the tips in the flame',
      craftWave: 'Wave the flames out',
      craftWind: 'Wind the box',
      titleBox: 'The music box',
      noteCare: 'You prepared their drinks with care.',
      /* PLAY II · the question and the openings (CP7, §4.3–§4.6) */
      objOpenRed: 'Open yourself to the red one',
      objOpenShy: 'Open yourself to the shy one',
      objOpenLittle: 'Open yourself to the little one',
      objSitAgain: 'Sit with them',
      hotOpen: 'Open yourself',
      briefYield: 'Press and hold. Let your mind loosen.',
      briefYieldKey: 'Hold the mouse button, E or Space. Let your mind loosen.',
      craftStamp: 'Stamp!',
      titleStamp: 'Stamp with him',
      craftPeek: 'Peek through your fingers',
      titlePeek: 'Peek-a-boo',
      objComeBack: 'Come back',
      /* (v24.2, L6-7: the panel's title already says COME BACK; and a held key climbs once, so W or ↑ is struck again
         and again) */
      briefSurface: 'Drag your finger up to rise toward the light. He doesn\'t want you to go. Keep rising.',
      briefSurfaceKey: 'Hold the mouse button and drag up, or tap W or ↑ again and again, to rise toward the light. He doesn\'t want you to go. Keep rising.',
      noteCameBack: 'You came back on your own.',
      noteHard: 'It took everything to come back.',
      noteLight: 'The light had to come down for you.'     // (v24.2, L6-10: the give-up path — he did not climb back himself)
    },
    sayPrefix: 'z5'
  };

  /* every line's length, measured off its shipped take (CP11; the registry carries the same numbers); the line
     queue books its window by it, so a voice never starts over another. The names are QUOTED on purpose: build.py
     gives a sound to a chapter's own pack only when the chapter names it in quotes (v21.1) */
  const SECS = {
    /* the opening film, the counter, the home film */ 'z5pro1': 5.33, 'z5yinq': 11.31, 'z5children': 3.08, 'z5promise': 2.51,
      'z5pro2': 4.68, 'z5pro3': 8.83, 'z5pro4': 6.77,
      'ow5hello': 5.15, 'ow5yin': 17.63, 'ow5monk': 22.6, 'ow5red': 7.39, 'ow5shy': 9.72, 'ow5little': 7.24, 'ow5give': 13.17,
      'ow5never': 10.76, 'ow5wrong': 15.65, 'ow5promise': 20.19, 'ow5careful': 3.71,
    /* the offerings */ 'z5water': 3.0, 'z5bag': 6.43, 'z5red': 3.08, 'z5shy': 2.19, 'z5little': 2.12, 'z5stiff': 3.24, 'z5incense': 1.07,
      'z5eat': 4.13, 'z5dedic': 8.2,
    /* the question and the openings */ 'z5wonder': 5.38, 'z5ask': 6.19, 'z5loose': 3.0,
    /* the red one */ 'z5b1': 2.69, 'z5b2': 2.93, 'z5b3': 2.35, 'z5b4': 2.19, 'z5back1': 3.24, 'z5back1b': 4.99, 'z5again1': 2.04,
    /* the shy one */ 'z5s1': 3.4, 'z5s2': 3.79, 'z5s3': 2.35, 'z5s4': 3.87, 'z5back2': 0.91, 'z5back2b': 5.72, 'z5again2': 2.43,
    /* the little one, and come back */ 'z5l1': 1.96, 'z5l2': 2.35, 'z5l3': 2.77, 'z5sob': 3.08, 'z5out': 7.63, 'z5come': 3.68,
      'z5gasp': 5.07, 'z5time': 3.4, 'z5felt': 8.99, 'z5fasc': 4.13,
    /* A */ 'z5A1': 4.99, 'z5A2': 3.32, 'z5A3': 1.8, 'z5Agig': 2.35, 'z5A4': 2.27, 'z5A5': 4.75, 'z5A6': 5.33, 'ma5vm': 5.51,
    /* B */ 'z5B1': 3.79, 'z5B2': 5.33, 'z5B3': 3.47, 'z5B4': 7.0, 'z5B5': 4.75, 'z5B6': 7.24,
    /* C */ 'z5C1': 3.47, 'z5C2': 3.97, 'z5C3': 9.25, 'z5C4': 8.75, 'z5Cevil': 3.63, 'z5Claugh': 3.87, 'z5C5': 4.05, 'z5C6': 4.68, 'z5C7': 5.41,
    /* D */ 'z5D1': 4.05, 'z5D2': 4.52, 'z5D3': 4.36, 'z5D4': 12.75, 'z5D5': 9.56, 'z5D6': 7.24, 'mk5teach': 10.37, 'mk5yatha': 12.12,
    /* the epilogue */ 'z5epi0': 12.2, 'z5epi1': 8.15, 'z5epi2': 2.27, 'z5epi3': 3.87,
    /* the cards */ 'z5A': 5.41, 'z5B': 5.49, 'z5C': 3.32, 'z5D': 3.79
  };


  /* the first two possessions' clocks (CP7, §4.4): plain numbers at the chapter's top level, so each film reads its own
     times directly — and chaptertest, which walks a film against a stand-in stage whose every lookup is 0, sees the real
     ones and can hold each cue to its film's length (a table read through the stage there is all zeros) */
  const RFT = { rise: 0, come: 1.2, contact: 2.2, stand: 3.0, stamp: 5.5, march: 9.0, win: 10.4, desk: 12.4, back: 14.0,
                grab: 15.0, slam: 18.0, flop: 22.0, leave: 24.5, self: 27.0, end: 38.4 };   // (CP12: end 36 → 38.4, "One more" after his line)
  const SFT = { scurry: 0, contact: 2.0, peek0: 3.0, peek: 5.5, scuttle: 9.0, under: 11.0, look: 14.0, coin: 16.0,
                wait: 21.0, leave: 24.0, bonk: 26.0, out: 28.0, little: 33.6, end: 38.0 };   // (CP12: little 32 → 33.6, end 36 → 38)
  /* the little one's film, film M and film K, here at the top level for the same reason (CP12: they were inside build(),
     so the stand-in read them as zeros and could not hold their cues to their lengths). LFT: the tears' line after the
     sob, and COME BACK 5.2 s later so his far voice finishes first and "I have to go back" is done before the quickest
     climb can surface him (lead 0.4 + hold 0.4 s); MFT: the owner's telling (22.6 s) runs over the temple
     to its end; KFT: the card's three asks, each after the one before (10.7, 15.7, 20.2 s) */
  const LFT = { bells: 0, rise: 1.5, go: 3.5, into: 6.0, l1: 9.0, city: 13.0, l2: 16.0, tears: 21.0, tick: 27.0, out: 29.0,
                come: 40.2, surf: 0, end: 0 };                 // (surf and end follow COME BACK's own length: the film waits on it)
  const MFT = { b1: 2.5, m2: 3.2, m3: 12.8, b2: 21.8, end: 24.8 };
  const KFT = { k2: 1.5, k3: 13.6, end: 62.6 };

  /* THE ENDINGS' CLOCKS (CP8, §4.8–§4.9): plain numbers at the top level, so a scene, its controller and chaptertest's
     recording stand-in all read the same times (CP7's law: a stand-in stage answers zero). Each ending's shots, then the
     epilogue at `epi` (the same 30 s in every ending, its own times in EPI); `end` is where the card lies over its black.
     DT is ending D's temple (chapter 4's merit film's shots, on D's clock) */
  const EPI = { len: 32, fade0: 12.8, fade1: 13.8 };   // (CP12: the measured lines — 30 s, 11.0, 12.0 on the estimates)
  const END = {
    A: { a1: 3.5, a2: 6.0, a2b: 8.6, a3: 13.0, a4: 17.0, vm: 19.5, dark: 25.5, a5: 29.0, gig: 33.0, turn: 34.0,
         a6: 40.0, a6b: 42.5, a6c: 45.0, a6d: 47.5, a7: 50.0, fade: 57.0, epi: 58.5 },
    B: { b1: 4.0, b2: 6.5, b3: 15.0, b4: 17.0, b5: 19.0, b6: 23.0, b7: 28.0, b8: 31.5, b9: 35.0, b10: 47.0, b11: 50.5,
         b12: 56.5, fade: 63.0, epi: 64.5 },
    C: { c1: 4.0, c2: 9.0, c2b: 11.7, c2c: 14.4, c3: 17.0, c4: 22.0, c5: 29.0, c6: 32.5, c7: 37.0, c8: 40.0, c9: 44.5,
         c10: 49.0, c11: 54.0, fade: 63.5, epi: 65.0 },
    D: { d1: 5.0, d1b: 7.5, d2: 13.0, d2b: 15.5, d2c: 17.0, d3: 19.0, d4: 22.0, d5: 28.0, court: 32.0, home: 85.5,
         years: 89.5, y2: 92.0, y3: 92.9, y4: 95.4, y5: 96.3, y6: 98.6, env: 100.5, envBox: 104.8, last: 106.5, fade: 107.6, epi: 109.0 }
  };
  for (const k in END) END[k].end = END[k].epi + EPI.len;
  const DT = { court: 32.0, bell: 33.1, door: 35.6, kneel: 40.0, teach: 53.4, pour0: 65.3, pour1: 75.9, earth: 77.5,
               earth0: 78.1, earth1: 80.5, lights: 80.9, home: 85.5 };   // (CP8: the lights' climb 2.1 s → 4.6 s, the music's time to swell;
                                                                         //  CP12: from the teaching on +9.5 s — his dedication is 12.8 s, the monk's 10.4)

  /* THE OPENING FILM's clock (CP9, §4.0a): black and the mall's hush; O1, his eyes down the corridor at closing time; O2,
     the owner through his glass; the door's bell; black, and the chapter card over it */
  const OFT = { o1: 3.0, line: 5.0, sh0: 4.6, sh1: 7.6, o2: 14.0, up: 15.6, beckon: 16.6, door: 18.6, open: 19.9,
                black0: 21.5, black1: 22.4, end: 22.8 };   // (CP13, the films' second vision review: in through the doorway, then to black)
  /* O1's walk (CP13): the share of the corridor walked by a share of O1 — eased from the lift over its first 12 %, steady,
     eased to a stop over its last 22 % — and his speed then, which the step's bob rides */
  const WA = 0.12, WB = 0.22;
  const walkV = u => Math.max(0, Math.min(1, u / WA, (1 - u) / WB));
  const walkW = u => (u < WA ? u * u / (2 * WA) : u > 1 - WB ? 1 - WA / 2 - WB / 2 - (1 - u) ** 2 / (2 * WB) : u - WA / 2) / (1 - WA / 2 - WB / 2);

  /* THE HOME FILM's clock (CP9, §4.0c): H1 the door at the first dusk, the lamp, the bag; four close inserts (the three
     set out on the new altar, the box and the card, the first drink, the first stick); H2 the weeks — the altar from the
     bed as the days run, the desk wall (the calendar's days crossed, a receipt each Buddha Day), the three alone in the
     afternoon; H3 tonight at 22:50 — the door in the dark, the shop's bag, the lamp on their faces; its black handed
     to play */
  const HFT = { open: 0.6, lamp: 2.4, ins: 4.0, ins2: 6.3, ins3: 8.6, ins4: 10.8, h2: 13.0, h2b: 20.0, h2c: 23.5, h3: 27.0,
                bag: 29.4, lamp2: 30.6, black0: 33.6, end: 35.0 };

  const smooth = k => k * k * (3 - 2 * k);
  const cl01 = x => Math.max(0, Math.min(1, x));
  const hash = (i, s) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };   // (chapter 4's: World M's scatter)

  function build(ctx) {
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, cnv, makeSoftDot, loadImageTexture, redoShadows,
            assetBytes, rescueTextures, getState, startDecision, worldSfx, warmSounds, soundOff, HEAD_RE, unifySkeletons, plantTrees,
            makeHellNote } = ctx;
    const treeStands = [];                                // (CP5: World M's, chapter 4's — freed before the sweep, v6.15)

    /* (the v21.1 TDZ law: everything a builder or a frame asks for is declared up here, before anything is built) */
    const owned = [];
    let alive = true;
    const parsedGlb = new Map();
    const madeTex = [];
    const tex = (t) => { madeTex.push(t); return t; };
    const noteTex = tex(makeHellNote());                  // the contract wants one (the engine's note prop reads it at boot)
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
                       look: null, lookName: 'NIGHT', lookK: { lamp: 1, screens: 1, ceil: 0 } };
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
    /* where the three stand: on the riser's gilt cap (its top 0.808), 2 mm over it (v24.2, L5-11: at the riser's own top,
       0.806, their bases were 2 mm INSIDE the gilt and their soft shadows, 1 mm under each base, under it — never drawn) */
    const KID_BASE = ALTAR.top + ALTAR.riser + 0.010;
    /* WORLD S · the owner's glass (local numbers): the red cloth's middle on its top face (the 16 mm sheet is centred on
       the counter's top, 1.0) and the three on it, left to right as he faces them (−z is his left); the music box past
       the little one, short of the empty stand; his card on the cloth's front, before the shy one, where the three are in
       a phone's frame (by photograph: laid past the red one, as first built, a phone's narrow view held neither it nor
       its mark when the order said to read it); his pen at his working end (by the counter's own measures: the stand at
       z −2.0, its wood from −3.08) */
    const CNT = { x: 3.22, y: 1.009, z: -2.62, w: 0.34, l: 0.66 };
    const CNT_Z = [-2.83, -2.62, -2.41];
    const CNT_BOX = { x: 3.24, z: -2.20 }, CNT_CARD = { x: 3.10, z: -2.62 }, CNT_PEN = { x: 3.14, z: -3.115 };
    const CARD_HX = 0.049, CARD_HZ = 0.035;               // his card's half-size: 98 mm away from him (its lines' length), 70 across
    const KID_LOD = 0.55;                                 // the near level inside this (§6: only for a figure in macro — the mat is 0.88 m off)
    const KID_DIST = 1.25;                                // and the lightest past this (the door, the bed: §6, CP4's measure)

    /* ----------------------------------------------------------- materials */
    const matProxy  = M({ color: 0x8d7a66, roughness: 0.9 });
    /* THE MUSIC BOX's (§4.1 1, §4.0b) and HIS CARD's: one in his room and one on the owner's glass — the same box and
       the same card, before he gives them (CP5: built by one function, the card's sheet drawn once) */
    const mBoxW = M({ color: 0x5a3a22, roughness: 0.45 }), mBoxBrass = M({ color: 0xc8a050, roughness: 0.3, metalness: 0.85 }),
          mBoxFelt = M({ color: 0x8a1e22, roughness: 0.95 });
    let tInlayT = null, tCardT = null;
    const tCard = () => tCardT || (tCardT = tex(makeOwnerCardT(THREE, cnv, cardLines())));
    /* the counter's live parts (World S, §4.0b), declared here with the room's (the v21.1 dead-zone law): the things he
       sets down on the glass (`sets`), the three on their cloth, the box, the card, the pen and the bag; the lens leaning
       over the glass to the little one (`lean`); the owner's look into a film's lens (`ownerLook`) */
    const cntLive = { sets: [], kidSet: [null, null, null], bundleSet: null, clothSet: null, boxSet: null, cardSet: null, penSet: null,
                      bagSet: null, box: null, bag: null, bagHeld: null, lean: null, owner: null, ownerLook: 0, opened: false,
                      helloOn: false, lull: false, boxOpen: 0, boxOpenTo: 0, windT: 0, view: null };

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
    /* a multi-material box draws once per face; adjacent faces that share a material are made one draw (CP13, the
       geometry lens: the twelve cartons and nine books were 126 draws) */
    function mergeGroups(geo, mats) {
      const out = [];
      for (const gr of geo.groups) {
        const last = out[out.length - 1];
        if (last && mats[last.materialIndex] === mats[gr.materialIndex] && last.start + last.count === gr.start) last.count += gr.count;
        else out.push({ start: gr.start, count: gr.count, materialIndex: gr.materialIndex });
      }
      geo.groups = out; return geo;
    }
    /* the old auntie's music box: a walnut box, its lid inlaid, a brass comb and drum inside, its key at the side (its
       front is its local +z, the hinge at the back) — {group, lid, key, drum} */
    function makeMusicBox(parent, keySide = 1) {           // keySide: which end its key is on (−1 the other; the room's: CP13)
      const mb = new THREE.Group(); parent.add(mb);
      /* (CP13, the geometry lens: the body was a SOLID block — the comb lay buried in it and an 8 mm sliver of the drum was
         all an open lid showed. Now a base, four walls and a red lining, the works inside it) */
      box(0.16, 0.03, 0.11, 0, 0.015, 0, mBoxW, mb, false);
      for (const sz of [-1, 1]) { box(0.16, 0.04, 0.008, 0, 0.05, sz * 0.051, mBoxW, mb, false); box(0.008, 0.04, 0.094, sz * 0.076, 0.05, 0, mBoxW, mb, false); }
      box(0.144, 0.002, 0.094, 0, 0.031, 0, mBoxFelt, mb, false);                         // the lining
      box(0.1, 0.004, 0.03, 0.01, 0.036, -0.02, mBoxBrass, mb, false);                  // the comb
      const drum = cyl(0.012, 0.012, 0.06, 0.01, 0.046, 0.015, mBoxBrass, 14, mb); drum.rotation.z = Math.PI / 2;
      const lid = new THREE.Group(); lid.position.set(0, 0.07, -0.055); mb.add(lid);
      box(0.162, 0.018, 0.112, 0, 0.009, 0.055, mBoxW, lid, false);
      if (!tInlayT) tInlayT = tex(makeInlayT(THREE, cnv));
      const inl = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.085), M({ map: tInlayT, roughness: 0.5 })); inl.rotation.x = -Math.PI / 2; inl.position.set(0, 0.0185, 0.055); lid.add(inl);
      const key = new THREE.Group(); key.position.set(0.085 * keySide, 0.035, 0); mb.add(key);
      const sh = cyl(0.003, 0.003, 0.02, 0.01 * keySide, 0, 0, mBoxBrass, 6, key); sh.rotation.z = Math.PI / 2;
      const bow = new THREE.Mesh(new THREE.TorusGeometry(0.009, 0.0025, 6, 14), mBoxBrass); bow.position.x = 0.024 * keySide; bow.rotation.y = Math.PI / 2; key.add(bow);
      return { group: mb, lid, key, drum };
    }
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
      const FG = { dusk: [0xffb27a, 0.12], night: [0x8aa4d8, 0.16], late: [0x6a80b8, 0.10], dawn: [0xd8c8e8, 0.20], day: [0xfff4e0, 0.30], grey: [0xd8dce0, 0.16] }[state] || [0x8aa4d8, 0.16];
      if (roomLive.floorGlow) { roomLive.floorGlow.material.color.setHex(FG[0]); roomLive.floorGlow.userData.op = FG[1]; }
    }
    /* THE ROOM'S LOOKS (§10.2): a preset of the light, the window's state, the desk lamp (its bulb and its three painted
       glows), the screens and the ceiling lamp, set as one, so the picture and its light change together. The glows ease
       on wall time over the same seconds as the light (the frame, `lookFrame`). */
    const LOOKS = {
      NIGHT:     { win: 'night', lamp: 1,    screens: 1,    ceil: 0 },
      DEEP:      { win: 'late',  lamp: 0,    screens: 0,    ceil: 0 },
      DUSK:      { win: 'dusk',  lamp: 0,    screens: 0,    ceil: 0 },
      DUSKLIT:   { win: 'dusk',  lamp: 1,    screens: 0,    ceil: 0 },      // (CP9: the home film's first evening, the desk lamp switched on)
      DAWN:      { win: 'dawn',  lamp: 0,    screens: 0,    ceil: 0 },
      MORNING:   { win: 'day',   lamp: 0,    screens: 0,    ceil: 0 },
      AFTERNOON: { win: 'day',   lamp: 0,    screens: 0.7,  ceil: 0 },
      DRAINED:   { win: 'grey',  lamp: 0,    screens: 0.7,  ceil: 0 },
      HARSH:     { win: 'late',  lamp: 1,    screens: 1,    ceil: 1 },
      RED:       { win: 'night', lamp: 0.25, screens: 0.3,  ceil: 0 },
      AMBER:     { win: 'night', lamp: 0.25, screens: 0.3,  ceil: 0 },
      BLUE:      { win: 'late',  lamp: 0.15, screens: 0.2,  ceil: 0 },
      SURFACE:   { win: 'late',  lamp: 0,    screens: 0,    ceil: 0 }
    };
    function look(name, secs = 0) {
      const L = LOOKS[name];
      if (!L) return;
      if (kit) kit.daylight(PRESETS[name === 'DUSKLIT' ? 'DUSK' : name], secs);
      setWindow(L.win);
      const k = roomLive.lookK;
      roomLive.look = { name, from: { lamp: k.lamp, screens: k.screens, ceil: k.ceil }, to: L, t0: wallNow(), secs: Math.max(0, secs) };
      roomLive.lookName = name;                           // (CP12: kept after the ease is done — roomLive.look goes null then)
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
        /* (CP5: chapter 4's `hd` — every triangle of his statue while it is big on screen, the shop's and the temple's
           altars — and `then`, both as chapter 4 has them) */
        if (o.hd) { level(hd.scene, 0); level(lo.scene.getObjectByName('buddha_mid'), (o.hdAt || 4) * h); }
        else level(lo.scene.getObjectByName('buddha_mid'), 0);
        level(lo.scene.getObjectByName('buddha_far'), (o.hd ? 12 : 4) * h);
        g.add(lod);
        if (o.then) o.then(g, lod);
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
        /* (the right-hand drape hangs from its own hinge at the window's edge: the red one sweeps it aside, CP7) */
        const cr = new THREE.Group(); cr.position.set(x1 - 0.12, 0, WZ1 + 0.1); R.add(cr); roomLive.curtain = cr;
        for (let i = 0; i < 6; i++) { const s = i < 3 ? -1 : 1, k = i % 3;
          const p = new THREE.Mesh(new THREE.PlaneGeometry(0.13, CL), cm);
          p.position.set(x1 - 0.12 - 0.022 * (k % 2), (CY0 + CY1) / 2, s < 0 ? WZ0 - 0.1 + k * 0.05 : WZ1 + 0.1 - k * 0.05);
          p.rotation.y = -Math.PI / 2 + (k % 2 ? 0.5 : -0.5);
          if (s > 0) { p.position.x -= cr.position.x; p.position.z -= cr.position.z; cr.add(p); } else R.add(p); }
        for (const z of [WZ0 - 0.06, WZ1 + 0.06]) { const tb = cyl(0.012, 0.012, 0.16, x1 - 0.1, 1.25, z, M({ color: 0xc8b07a, roughness: 0.6 }), 8, R); tb.rotation.x = Math.PI / 2; }   // the tie-backs
        box(0.03, 0.03, WZ1 - WZ0 + 0.8, x1 - 0.12, 2.25, (WZ0 + WZ1) / 2, mDark, R, false); }
      thai('fern', 1.40, 0, 1.46, { parent: R, fit: 0.36, cast: false });             // a potted fern in the corner past the altar's end
      solids.push(hidBox(0.34, 0.6, 0.34, 1.40, 0.3, 1.46, R));
      roomLive.floorGlow = glowP(1.4, 1.8, 0x8aa4d8, 0.16, 0.7, 0.012, 0.45, -Math.PI / 2);
      setWindow('night');
      /* every other state painted now, under the curtain, each on a hidden scrap the curtain's warm uploads (CP13, the
         geometry lens: painted on first use, the home film's weeks painted and uploaded three in 1.5 s on screen) */
      for (const st of Object.keys(WIN_STATES)) {
        if (!roomLive.viewTex[st]) roomLive.viewTex[st] = tex(makeWindowT(THREE, cnv, st));
        const hp = new THREE.Mesh(new THREE.PlaneGeometry(0.01, 0.01), B({ map: roomLive.viewTex[st] }));
        hp.visible = false; hp.position.set(x1 + 0.5, 1.5, 0); R.add(hp);
      }
      /* ---- THE DESK (chapter 4's), made real: its drawer, the lamp and its pool, the laptop, the second monitor on an
         arm with his dashboard, a dashcam on its stand, a notebook and pen, a mug on a coaster, the alarm clock, a
         charging cable; the office chair before it */
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
      /* (CP13, the geometry lens: the pool ran 0.30 m past the desk's front edge and the laptop's 0.23 m, painted light
         hanging in the air over the chair; drawn back onto the desk, only their faint rims past its edge) */
      roomLive.glow.push(glowP(1.25, 0.84, 0xffcc80, 0.55, -0.42, DT + 0.022, -1.50, -Math.PI / 2));
      roomLive.glow.push(glowP(1.9, 1.6, 0xffc070, 0.32, -0.55, 1.15, z0 + 0.03));     // (in front of the board and the papers, so it lights them too)
      roomLive.glow.push(glowP(0.42, 0.42, 0xfff0c8, 0.6, -0.58, DT + 0.33, -1.42));
      { const lp = new THREE.Group(); lp.position.set(-0.2, DT + 0.018, -1.43); lp.rotation.y = -0.08; R.add(lp);
        box(0.33, 0.014, 0.23, 0, 0.007, 0, M({ color: 0x3a3c40, roughness: 0.4, metalness: 0.5 }), lp, false);
        const hinge = new THREE.Group(); hinge.position.set(0, 0.014, -0.112); hinge.rotation.x = -0.3; lp.add(hinge);
        box(0.33, 0.215, 0.008, 0, 0.108, 0, M({ color: 0x2a2c30, roughness: 0.4, metalness: 0.5 }), hinge, false);
        const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.31, 0.195), B({ map: tex(makeLaptopT(THREE, cnv)), toneMapped: false }));
        scr.position.set(0, 0.108, 0.0045); hinge.add(scr); roomLive.screen = scr;
        roomLive.screenGlow.push(glowP(0.7, 0.4, 0xb8d0ff, 0.12, -0.2, DT + 0.021, -1.30, -Math.PI / 2)); }
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
      { const nb = box(0.15, 0.012, 0.21, -0.50, DT + 0.024, -1.42, M({ color: 0x2a3a5a, roughness: 0.8 }), R, false); nb.rotation.y = 0.18;   // a notebook and its pen
        const pen = cyl(0.004, 0.004, 0.14, -0.49, DT + 0.034, -1.42, M({ color: 0x14141a, roughness: 0.3 }), 8, R); pen.rotation.set(Math.PI / 2, 0, 0.6); }   // (on the notebook, set back: at its old place the pen's end stood behind the bottle he opens, a black line across it, and the incense packet lies where the notebook's front edge was — by photograph)
      { const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.036, 0.095, 18), M({ color: 0xe8e2d6, roughness: 0.5 })); mug.position.set(0.17, DT + 0.07, -1.33); R.add(mug);
        cyl(0.05, 0.05, 0.005, 0.17, DT + 0.02, -1.33, M({ color: 0x6a4a2a, roughness: 0.8 }), 20, R);                                   // its coaster
        // (his phone is in his pocket, not on the desk: it slides out onto the floor beside him after the little one — CP7)
        { const y = DT + 0.0205, cv = new THREE.CatmullRomCurve3([[0.08, -1.66], [0.04, -1.55], [-0.04, -1.47], [-0.02, -1.36], [0.05, -1.29], [0.03, -1.215]].map(([x, z]) => new THREE.Vector3(x, y, z)));
          R.add(new THREE.Mesh(new THREE.TubeGeometry(cv, 40, 0.0028, 6, false), mWhite));                                                  // the charger's cable, loose on the desk (CP8: a straight rod read as a stick)
          box(0.011, 0.007, 0.024, 0.03, y, -1.205, mWhite, R, false); }
        const ac = new THREE.Group(); ac.position.set(0.24, DT + 0.018, -1.62); ac.rotation.y = -0.35; R.add(ac);
        cyl(0.05, 0.05, 0.03, 0, 0.065, 0, M({ color: 0xa83a2a, roughness: 0.4, metalness: 0.3 }), 20, ac).rotation.x = Math.PI / 2;
        const face = new THREE.Mesh(new THREE.CircleGeometry(0.042, 24), M({ map: tex(makeAlarmFaceT(THREE, cnv)), roughness: 0.5 })); face.position.set(0, 0.065, 0.016); ac.add(face);
        for (const s of [-1, 1]) { const l = cyl(0.005, 0.005, 0.03, s * 0.03, 0.012, 0, mDark, 6, ac); l.rotation.z = s * 0.4; } }
      { const ch = new THREE.Group(); ch.position.set(-0.32, 0, -0.98); ch.rotation.y = 0.25; R.add(ch); roomLive.chair = ch;   // the office chair: base, lift, seat, back
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
      { const cal = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.36), M({ map: tex(makeCalendarT(THREE, cnv)), roughness: 0.85 })); cal.position.set(0.85, 1.5, z0 + 0.008); R.add(cal); roomLive.calendar = cal; }
      /* ---- THE ROADEYE CORNER by the desk: twelve of his cartons, a tape dispenser, a roll of bubble wrap */
      { const tBox = tex(makeDashBox(THREE, cnv)), mBoxF = M({ map: tBox, roughness: 0.85 }), mBoxS = M({ color: 0xb48c5c, roughness: 0.85 });
        const mats6 = [mBoxS, mBoxS, mBoxS, mBoxS, mBoxF, mBoxS];
        const r = rng(5211), cGeo = mergeGroups(new THREE.BoxGeometry(0.2, 0.13, 0.16), mats6);   // (one shape for all twelve: three draws each)
        for (let k = 0; k < 12; k++) {
          const col = k % 3, row = Math.floor(k / 3) % 2, lay = Math.floor(k / 6);
          const b = new THREE.Mesh(cGeo, mats6);
          b.position.set(0.5 + col * 0.205 + (r() - 0.5) * 0.01, 0.065 + row * 0.13, -1.66 + lay * 0.17); b.rotation.y = (r() - 0.5) * 0.06;
          b.castShadow = !LOW; b.receiveShadow = true; R.add(b); (roomLive.cartons = roomLive.cartons || []).push(b);   // (C sends them out, CP8)
          if (k === 10) { roomLive.cartonTop = b; b.userData.home = { x: b.position.x, y: b.position.y, z: b.position.z, ry: b.rotation.y }; }   // (the red one swipes it off, CP7)
        }
        solids.push(hidBox(0.62, 0.26, 0.34, 0.705, 0.13, -1.58, R));
        const td = box(0.12, 0.06, 0.05, 0.62, 0.29, -1.62, M({ color: 0xc8241c, roughness: 0.5 }), R, false); td.rotation.y = 0.3;           // the tape dispenser, on top
        { const roll = new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.01, 8, 22), M({ color: 0xd8c08a, roughness: 0.25, transparent: true, opacity: 0.85 }));
          roll.position.set(-0.012, 0.034, 0); td.add(roll);                                                                                 // its roll of tape (CP8: a bare red block, by photograph)
          box(0.008, 0.016, 0.044, 0.058, 0.036, 0, mDark, td, false); }                                                                    // and its blade
        roomLive.tapeDisp = td;
        const tW = tex(makeWrapT(THREE, cnv)); tW.repeat.set(19, 9);                                                              // (CP8: plain, it read as a pale blob)
        /* (CP13, the films' second vision review: see-through at 0.85, it still read from the door as a glass capsule or a
           ghostly blob on the floor — in this chapter of all chapters. Opaque now, its two ends the darker grey of a sheet
           rolled on itself) */
        const bw = cyl(0.12, 0.12, 0.38, 1.02, 0.12, -1.6, M({ color: 0xd4dee6, map: tW, roughness: 0.3 }), 20, R); bw.rotation.x = Math.PI / 2;
        const bwEnd = M({ color: 0x9aa9b4, roughness: 0.4 }); bw.material = [bw.material, bwEnd, bwEnd]; }
      /* a coin lost under the desk, that the shy one finds (CP7): hidden until his film, by the desk after it */
      { const coin = cyl(0.011, 0.011, 0.0018, -0.30, 0.0009, -1.47, M({ color: 0xd4a84a, roughness: 0.3, metalness: 0.9 }), 16, R);
        coin.visible = false; coin.userData.home = coin.position.clone(); roomLive.coin = coin; }
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
        /* (CP13, the films' vision review: a squashed sphere read as a plate — a cushion now, its middle puffed and its
           seams thin, as a pillow is) */
        const pilGeo = new THREE.BoxGeometry(0.42, 0.12, 0.3, 12, 2, 10), pp = pilGeo.attributes.position;
        for (let k = 0; k < pp.count; k++) {
          const fx = Math.min(1, Math.abs(pp.getX(k)) / 0.21), fz = Math.min(1, Math.abs(pp.getZ(k)) / 0.15);
          const puff = Math.sqrt(Math.max(0, (1 - fx ** 4) * (1 - fz ** 4)));
          pp.setY(k, pp.getY(k) * (0.12 + 0.88 * puff)); pp.setX(k, pp.getX(k) * (1 - 0.06 * fz * fz)); pp.setZ(k, pp.getZ(k) * (1 - 0.06 * fx * fx));
        }
        pilGeo.computeVertexNormals();
        for (const dx of [-0.2, 0.2]) { const pl = new THREE.Mesh(pilGeo, mPil); pl.position.set(BX + dx, 0.53, BZ - 0.82); pl.rotation.y = dx * 0.4; R.add(pl); }
        const mBl = M({ map: tex(makeWeaveT(THREE, cnv, '#3a4a6a', 5227)), roughness: 0.96 });
        /* (CP13, the films' vision review: a slab and three boxes read as a stack of blue boxes — ONE cloth now, turned back
           at its head in soft folds, rumpled, and hanging over the mattress's sides; it stops short of the foot, where the
           T-shirt lies on the bare sheet — the geometry lens found it 1 cm UNDER the old blanket's top) */
        { const BLW = 1.04, BLL = 0.94, blGeo = new THREE.PlaneGeometry(BLW, BLL, 30, 28); blGeo.rotateX(-Math.PI / 2);
          const bp = blGeo.attributes.position;
          for (let k = 0; k < bp.count; k++) {
            const x = bp.getX(k), z = bp.getZ(k), u = (z + BLL / 2) / BLL;          // u: 0 at its head, 1 at its foot
            let y = 0.012 + 0.006 * Math.sin(x * 13 + z * 7) * Math.sin(z * 9 - x * 3)    // the rumple
                  + 0.045 * Math.exp(-(((u - 0.07) / 0.06) ** 2)) + 0.03 * Math.exp(-(((u - 0.2) / 0.05) ** 2));   // the turned-back folds at its head
            const over = Math.abs(x) - 0.46; if (over > 0) y -= over * 1.6 + over * over * 6;   // and over the sides
            bp.setY(k, y);
          }
          blGeo.computeVertexNormals();
          const bl = new THREE.Mesh(blGeo, M({ map: mBl.map, roughness: 0.96, side: THREE.DoubleSide })); bl.position.set(BX, 0.48, BZ + 0.24); bl.receiveShadow = true; R.add(bl); }
        box(0.3, 0.03, 0.24, BX + 0.12, 0.495, BZ + 0.84, M({ map: tex(makeWeaveT(THREE, cnv, '#c8ccd2', 5229)), roughness: 0.95 }), R, false).rotation.y = 0.15;   // a T-shirt, folded
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
        const mPages = M({ color: 0xe8e0cc, roughness: 0.9 });
        titles.forEach(([tt, bg, fg], i) => { const h = 0.17 + (i % 4) * 0.018, w = 0.028 + (i % 3) * 0.008;
          /* (CP13, the geometry lens: the spine is the box's +x face, the one toward the room — at −x it faced the wall; and
             its cover and pages one material each, so a book is four draws, not six) */
          const mCov = M({ color: bg, roughness: 0.8 });
          const mats6 = [M({ map: tex(makeSpineT(THREE, cnv, tt, bg, fg)), roughness: 0.8 }), mCov, mPages, mPages, mCov, mCov];
          const bk = new THREE.Mesh(mergeGroups(new THREE.BoxGeometry(0.16, h, w), mats6), mats6); bk.position.set(x0 + 0.12, 1.613 + h / 2, z + w / 2); R.add(bk);
          z += w + 0.004; }); }
      thai('buddha', x0 + 0.14, 1.613, 0.6, { s: 0.22, parent: R, cast: false, ry: Math.PI / 2 });
      /* ---- the WARDROBE against the front wall, between the bed's foot and the door, a backpack leaning on it */
      { const wd = new THREE.Group(); wd.position.set(-0.08, 0, z1 - 0.28); R.add(wd);
        const mW = M({ color: 0xd6cec0, roughness: 0.55 });   // (a light laminate, as HDB wardrobes are: in walnut it was a black slab by night)
        box(0.9, 1.9, 0.54, 0, 0.95, 0, mW, wd, false);
        for (const s of [-1, 1]) { box(0.43, 1.78, 0.012, s * 0.222, 0.97, -0.276, mW, wd, false); box(0.012, 0.14, 0.02, s * 0.02, 1.0, -0.29, mBrass, wd, false); }
        solids.push(hidBox(0.9, 1.9, 0.54, 0, 0.95, 0, wd));
        /* (v24.2, L5-9: against its FRONT now, at its right end — leant on its side it stood 10 cm into the wardrobe and in the
           door's swing, the leaf passing through its corner; here it is 1.1 m from the hinge) */
        const bp = new THREE.Group(); bp.position.set(0.25, 0, -0.40); bp.rotation.set(0.12, 0.15, 0); wd.add(bp);
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
        /* (CP13, the geometry lens: the group is turned π to face the room, so its FRONT is local +z — the louvre and the
           LED were at local −z, swinging and glowing inside the unit at its back, against the wall) */
        const lv = new THREE.Group(); lv.position.set(0, -0.12, 0.09); acu.add(lv);
        box(0.74, 0.008, 0.06, 0, 0, 0.03, M({ color: 0xd8d8d2, roughness: 0.5 }), lv, false); roomLive.louvre = lv;
        const led = new THREE.Mesh(new THREE.CircleGeometry(0.005, 10), B({ color: 0x4aa8ff, toneMapped: false })); led.position.set(0.34, -0.06, 0.101); acu.add(led);
        glowP(0.05, 0.05, 0x4aa8ff, 0.5, DOOR.x - 0.34, 2.36, z1 - 0.225, 0, Math.PI); }
      /* ---- by the door: a switch and a power socket; the slippers; the laundry basket in the bed's foot corner; a
         small bin under the desk; a cable along the skirting */
      { const pl = M({ color: 0xf2f0ea, roughness: 0.5 });
        /* (v24.2, L5-9: in the 11 cm of wall between the wardrobe's side, x 0.37, and the door's opening, 0.48 — at dL − 0.12
           five of the switch's 8 cm and its toggle were inside the wardrobe) */
        box(0.08, 0.12, 0.012, dL - 0.055, 1.3, z1 - 0.006, pl, R, false); box(0.02, 0.04, 0.006, dL - 0.055, 1.3, z1 - 0.014, mWhite, R, false);
        box(0.09, 0.09, 0.012, dL - 0.055, 0.3, z1 - 0.006, pl, R, false);
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
          m.scale.setScalar(k); m.position.set(-0.24 + dx, -bb.min.y * k, z1 - 0.70); m.rotation.y = Math.PI + ry; R.add(m);   // (v24.2, L5-9: before the wardrobe's left door — at z1 − 0.3 both were INSIDE it, never seen)
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
        /* (CP13, the geometry lens: begun 6 mm behind the door wall — at 0 their ends lay IN the room's wall plane, facing
           the room, and the left wall's and the ceiling's ends flickered through it as dark stripes) */
        box(1.6, 0.01, 4.194, 0, 0.005, 2.103, mC, cg, false); box(0.05, 2.6, 4.194, -0.8, 1.3, 2.103, mC, cg, false); box(0.05, 2.6, 4.194, 0.8, 1.3, 2.103, mC, cg, false);
        box(1.6, 0.05, 4.194, 0, 2.6, 2.103, mC, cg, false); box(1.6, 2.6, 0.05, 0, 1.3, 4.2, mC, cg, false);
        /* the wall round his door seen FROM the corridor (CP13, by photograph: the front wall's pieces face into the room
           only, so the home film's two shots from the corridor saw through them — the room's fan over the door, the
           wardrobe's back and the light switch floating beside it): its outer face across the corridor's width, either
           side of the doorway and over it up to the corridor's ceiling, 3 mm out on the corridor's side */
        for (const [w, h, x, y] of [[0.8 - DOOR.w / 2, 2.6, -(0.8 + DOOR.w / 2) / 2, 1.3], [0.8 - DOOR.w / 2, 2.6, (0.8 + DOOR.w / 2) / 2, 1.3],
                                    [DOOR.w, 2.6 - DOOR.h, 0, (DOOR.h + 2.6) / 2]]) {
          const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mC); o.position.set(x, y, 0.003); cg.add(o);
        }
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
      const mSand = M({ color: 0xcab48a, roughness: 0.95 }), mBowl = M({ color: 0x7a4a2a, roughness: 0.6, side: THREE.DoubleSide });
      let BOWL_GEO = null;
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
        /* (CP13, the films' vision review: a tapered cylinder read as a cupcake case in the close inserts — a turned bowl,
           its belly round and its lip rolled; its origin at its foot, so the rattle's y0 is the altar's top) */
        const bw = new THREE.Mesh(BOWL_GEO || (BOWL_GEO = new THREE.LatheGeometry([[0, 0.002], [0.017, 0.002], [0.02, 0.004], [0.026, 0.011], [0.0305, 0.021],
          [0.0325, 0.03], [0.033, 0.0355], [0.0315, 0.037], [0.0295, 0.0355], [0.029, 0.033]].map(([a, b]) => new THREE.Vector2(a, b)), 28)), mBowl);
        bw.position.set(ROW.mid, A.top, z); bw.castShadow = !LOW; bw.receiveShadow = true; R.add(bw);
        cyl(0.029, 0.029, 0.004, ROW.mid, A.top + 0.034, z, mSand, 16, R);
        roomLive.bowls.push(bw);
        /* a saucer of sweets, at the front, and his toy beside it — the little one's the other way round (CP13, the play's
           photographs: from the mat his pinwheel stood exactly on the line to the music box's key, its stick through the
           wind's ring; the low saucer there hides nothing — and 2 cm further over, where its blades clear ending C's last
           toy packet, z 0.705–0.775) */
        const side = i === 2 ? -1 : 1;
        cyl(0.035, 0.03, 0.008, ROW.front, A.top + 0.004, z - 0.075 * side, mSaucer, 18, R);
        for (let k = 0; k < 3; k++) { const sw = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 6), M({ color: SWEET[(i + k) % 4], roughness: 0.3 }));
          sw.position.set(ROW.front + (k - 1) * 0.012, A.top + 0.014, z - 0.075 * side + (k % 2) * 0.01); R.add(sw); }
        const toy = new THREE.Group(); toy.position.set(ROW.front, A.top + 0.002, z + (side > 0 ? 0.075 : -0.095)); R.add(toy); roomLive.toys.push(toy);
        if (i === 0) {           // the tin car, red
          /* (CP13, the films' vision review: two boxes on four discs read as a blockout beside the scans — a little car's
             side, its hood, cabin and boot, extruded with a rounded edge, its windows, its wheels with bright hubs; its
             length along z, as the box's was) */
          const sh = new THREE.Shape();
          sh.moveTo(-0.032, 0.008); sh.lineTo(-0.032, 0.021); sh.quadraticCurveTo(-0.031, 0.024, -0.025, 0.025); sh.lineTo(-0.018, 0.026);
          sh.quadraticCurveTo(-0.014, 0.037, -0.006, 0.0375); sh.lineTo(0.006, 0.0375); sh.quadraticCurveTo(0.012, 0.036, 0.016, 0.026);
          sh.lineTo(0.028, 0.024); sh.quadraticCurveTo(0.032, 0.023, 0.032, 0.019); sh.lineTo(0.032, 0.008); sh.lineTo(-0.032, 0.008);
          const cg = new THREE.ExtrudeGeometry(sh, { depth: 0.024, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.0015, bevelSegments: 2, curveSegments: 6 });
          cg.translate(0, 0, -0.012);
          const body = new THREE.Mesh(cg, M({ color: 0xc8281c, roughness: 0.3, metalness: 0.6 })); body.rotation.y = Math.PI / 2; toy.add(body);
          const win = new THREE.Shape(); win.moveTo(-0.0165, 0.0265); win.quadraticCurveTo(-0.013, 0.035, -0.006, 0.0355); win.lineTo(0.006, 0.0355);
          win.quadraticCurveTo(0.011, 0.034, 0.0145, 0.0265); win.lineTo(-0.0165, 0.0265);
          const wg = new THREE.ShapeGeometry(win), mWin = M({ color: 0x9ac8e8, roughness: 0.15, metalness: 0.3, side: THREE.DoubleSide });
          for (const sx of [-1, 1]) { const wm = new THREE.Mesh(wg, mWin); wm.rotation.y = Math.PI / 2; wm.position.x = sx * 0.0141; toy.add(wm); }
          const mHub = M({ color: 0xd8d8d0, roughness: 0.25, metalness: 0.85 });
          for (const [dz, dx] of [[-0.02, -0.0145], [-0.02, 0.0145], [0.02, -0.0145], [0.02, 0.0145]]) {
            const w = cyl(0.0085, 0.0085, 0.006, dx, 0.0085, dz, mL, 16, toy); w.rotation.z = Math.PI / 2;
            const hb = cyl(0.0042, 0.0042, 0.0065, dx + Math.sign(dx) * 0.0004, 0.0085, dz, mHub, 12, toy); hb.rotation.z = Math.PI / 2; }
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
        const em = new THREE.Group(); em.position.set(ROW.mid, A.top + 0.19, z); em.visible = false; R.add(em);   // (the stick's tip: CP13 lowered it 1 cm into its sand)
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
        /* (CP13, the films' vision review: 18 sides and six points read as a faceted cone — a smooth pitcher now, its belly,
           its waist and its flared lip, and a fuller handle) */
        const body = new THREE.Mesh(new THREE.LatheGeometry([[0.0, 0], [0.03, 0], [0.035, 0.003], [0.039, 0.016], [0.041, 0.034], [0.04, 0.052],
          [0.035, 0.07], [0.027, 0.088], [0.0235, 0.1], [0.0245, 0.109], [0.028, 0.116], [0.0295, 0.118]].map(([a, b]) => new THREE.Vector2(a, b)), 36), mJ);
        j.add(body);
        const hd = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.0045, 8, 20, Math.PI), mJ); hd.position.set(0, 0.07, -0.04); hd.rotation.set(0, Math.PI / 2, Math.PI / 2); j.add(hd);
        const wl = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.033, 0.05, 16), B({ color: 0x8ab0c8, transparent: true, opacity: 0.4 })); wl.position.y = 0.03; j.add(wl); }
      // THE MUSIC BOX at the far end, its lid shut; the card against it
      /* (its key on the end toward the mat — CP13, the play's vision review: on the far end it was hidden behind the box from
         the mat, and the wind's ring was drawn over the owner's card) */
      { const MB = makeMusicBox(R, -1), mb = MB.group;                   // (CP5: one builder for this box and the owner's)
        mb.position.set(1.30, A.top, (RISER.z1 + A.z1) / 2); mb.rotation.y = -Math.PI / 2;   // past the riser's end, its front to the mat
        roomLive.box = mb; roomLive.boxLid = MB.lid; roomLive.boxKey = MB.key; roomLive.boxDrum = MB.drum; }
      { const cd = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.098), M({ map: tCard(), roughness: 0.9 }));
        cd.position.set(1.23, A.top + 0.048, (RISER.z1 + A.z1) / 2); cd.rotation.set(0, -Math.PI / 2, 0, 'YXZ'); cd.rotateX(-0.22); R.add(cd); roomLive.card = cd; }
      // the mat before it, where he sits (the kit's rug)
      roomLive.mat = thai('rug', MAT.x, 0.002, MAT.z, { parent: R, fit: 0.95, cast: false, ry: Math.PI / 2 });
    }

    /* ============================================== WORLD S · THE OWNER'S SHOP, AT CLOSING TIME (CP5)
       Since rev 4 the three come from the Golden Mile owner (§4.1b): his shop — chapter 3's World A as chapter 4 copied
       it for its World H (e3c4.js, buildWorldH, at v22.5) — COPIED again by its own code (a chapter never imports
       another), under World S's group at x +250, at CLOSING TIME: no staff and no customers (nobody is built), the
       radio off, the candles unlit, the Luang Phu Tim's stand on his counter empty, half the shop's panels and the
       corridor's tubes off, every neighbour's shutter down, the clock at ten past seven. Everything between here and
       the return is chapter 4's, line for line and with its own comments, unless a comment says (World S: ...). */
    function buildShop() {
      const world = worldS;                                // (chapter 3's World A stood at the origin; chapter 4's World H and this one at x +250)
      /* ------------------------------------------------------------- the map
         WORLD A, THE SHOP: inner faces x -4.5…4.5, z -7 (the altar's wall) … 0
         (the glass front onto the mall), a 2.9 m T-bar ceiling. Glass counters
         down both sides — the staff's on the left, the OWNER's on the right
         with the LP Tim in its own case on top — wall cabinets of framed
         amulets behind the left, the old masters' photographs behind the
         right, the altar against the back wall. The mall's corridor runs past
         the glass, z 0…5. (World S: the shrine's origin, the celebration's mats,
         the monk's and the staff man's places are chapter 4's and are not here.) */
      const SHOP = { x0: -4.5, x1: 4.5, z0: -7.0, z1: 0.0, H: 2.9 };
      const MALL = { x0: -14, x1: 14, z0: 0.0, z1: 5.0, H: 3.6 };
      const DOOR = { x0: -0.62, x1: 0.62, h: 2.25 };       // the glass double door (shut in play)
      const LCNT = { x0: -3.5, x1: -2.9, z0: -0.9, z1: -4.1, top: 1.0 };   // the staff's counter, its glass face to +x
      const RCNT = { x0: 2.9, x1: 3.5, z0: -1.0, z1: -3.9, top: 1.0 };     // the OWNER's counter, its face to -x
      const ALTAR = { x: 0, z: -6.65, w: 2.3, d: 0.70, h: 0.92 };         // the altar cabinet, its back to the wall (v21.8: 0.70 deep, the statue row's own depth)
      const STEP = { w: 1.5, d: 0.24, h: 0.6, z: ALTAR.z + ALTAR.d / 2 + 0.12 };   // v21.8: the offerings' step before the cabinet
      const OWN = { x: 3.98, z: -2.45 };                   // the owner, behind his counter
      const LPT = { x: 3.1, z: -2.0 };                     // the LP Tim's case on the owner's counter
      const MSTR = { y0: 1.90, h: 0.50, z: -2.5 };           // v21.9: the old masters' one row on the owner's wall (its lowest edge, its height, its middle)
      const CLOCK = { x: 0, y: 2.56, z: -0.06 };           // over the door, inside, facing the shop

      /* ----------------------------------------------------------- materials */
      const tileTex = tex(makeShopTiles(THREE, cnv)); tileTex.repeat.set((SHOP.x1 - SHOP.x0) / 1.2, (SHOP.z1 - SHOP.z0) / 1.2);
      const terrTex = tex(makeTerrazzo(THREE, cnv)); terrTex.repeat.set((MALL.x1 - MALL.x0) / 1.2, (MALL.z1 - MALL.z0) / 1.2);
      const ceilTex = tex(makeCeilGrid(THREE, cnv)); ceilTex.repeat.set((SHOP.x1 - SHOP.x0) / 1.2, (SHOP.z1 - SHOP.z0) / 1.2);
      const mallCeilTex = tex(makeCeilGrid(THREE, cnv)); mallCeilTex.repeat.set((MALL.x1 - MALL.x0) / 1.2, (MALL.z1 - MALL.z0) / 1.2);
      const matFloor  = new THREE.MeshStandardMaterial({ map: tileTex, roughness: 0.32, metalness: 0.05 });
      const matTerr   = new THREE.MeshStandardMaterial({ map: terrTex, roughness: 0.45, metalness: 0.04 });
      const matCeil   = new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 0.95 });
      const matMallCeil = new THREE.MeshStandardMaterial({ map: mallCeilTex, roughness: 0.95 });
      const matWall   = new THREE.MeshStandardMaterial({ color: 0xf1ece2, roughness: 0.92 });
      const matWallB  = new THREE.MeshStandardMaterial({ color: 0xe6dccb, roughness: 0.92 });   // the mall's
      const matDark   = new THREE.MeshStandardMaterial({ color: 0x15100e, roughness: 0.8 });
      const matRed    = new THREE.MeshStandardMaterial({ color: 0x8e1d14, roughness: 0.42 });
      const matRedD   = new THREE.MeshStandardMaterial({ color: 0x5a1009, roughness: 0.55 });
      const matGold   = new THREE.MeshStandardMaterial({ color: 0xd9a63c, roughness: 0.3, metalness: 0.55, emissive: 0x3a2406, emissiveIntensity: 0.6 });
      const matWood   = new THREE.MeshStandardMaterial({ color: 0x3e2414, roughness: 0.5 });
      const matWoodL  = new THREE.MeshStandardMaterial({ color: 0x8a5a34, roughness: 0.55 });
      const matSteel  = new THREE.MeshStandardMaterial({ color: 0xb8bcc2, roughness: 0.3, metalness: 0.7 });
      /* the shutters' roller boxes, painted steel: in polished steel they mirrored the sky's environment and read as a
         glowing lavender strip across the top of every shutter (VB-7) */
      const matBoxSteel = new THREE.MeshStandardMaterial({ color: 0x5c6066, roughness: 0.62, metalness: 0.3 });
      const matAlu    = new THREE.MeshStandardMaterial({ color: 0xc9ccd0, roughness: 0.35, metalness: 0.6 });
      const matChrome = new THREE.MeshStandardMaterial({ color: 0xe8ecf0, roughness: 0.12, metalness: 0.9 });
      const matCream  = new THREE.MeshStandardMaterial({ color: 0xe9dfc8, roughness: 0.9 });
      const matBlack  = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.45 });
      const matWhite  = new THREE.MeshStandardMaterial({ color: 0xf4f2ec, roughness: 0.6 });
      const matProxy  = new THREE.MeshStandardMaterial({ color: 0x8d7a66, roughness: 0.9 });
      const matGlass  = new THREE.MeshStandardMaterial({ color: 0xd8e6ee, roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.13,
                                                          depthWrite: false, side: THREE.DoubleSide });
      const matGlassS = new THREE.MeshStandardMaterial({ color: 0xe8f0f4, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.22,
                                                          depthWrite: false, side: THREE.DoubleSide });   // a shelf's, seen edge-on
      const matPanel  = new THREE.MeshBasicMaterial({ color: 0xf6f8ff });                                 // an LED ceiling panel
      const matTube   = new THREE.MeshBasicMaterial({ color: 0xeef4ff });
      const matLED    = new THREE.MeshBasicMaterial({ color: 0xfff4e0 });
      const matFlame  = new THREE.MeshBasicMaterial({ color: 0xffc46a, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending });

      const shopG = new THREE.Group(); world.add(shopG);      // WORLD A
      const doorLeaves = [];                                  // (World H: the shop door's two leaves, which open)
      let grocerShutter = null;                               // (CP9: the grocer's own roller shutter, which the opening film rolls down)
      const mallG = new THREE.Group(); world.add(mallG);      // the corridor past the glass
      const box = (w, h, d, x, y, z, mat, parent = world, cast = true) => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
        m.position.set(x, y, z); m.castShadow = cast && !LOW; m.receiveShadow = true;
        parent.add(m); return m;
      };
      const cyl = (r0, r1, h, x, y, z, mat, seg = 14, parent = world) => {
        const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, h, seg), mat);
        m.position.set(x, y, z); m.castShadow = !LOW; m.receiveShadow = true;
        parent.add(m); return m;
      };
      const plane = (w, h, mat, x, y, z, ry = 0, parent = world) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
        m.position.set(x, y, z); m.rotation.y = ry; m.receiveShadow = true;
        parent.add(m); return m;
      };
      const texMat = (t, o = {}) => new THREE.MeshStandardMaterial({ map: tex(t), roughness: 0.8, ...o });
      /* an invisible box that is only a blocker (collision reads it whether it
         is drawn or not) */
      const hidBox = (w, h, d, x, y, z, parent = shopG) => { const m = box(w, h, d, x, y, z, matProxy, parent, false); m.visible = false; return m; };

      /* ============================================== WORLD A · THE SHOP
         ------------------------------------------------- floor, ceiling, walls */
      {
        const W = SHOP.x1 - SHOP.x0, D = SHOP.z1 - SHOP.z0;
        const fl = new THREE.Mesh(new THREE.PlaneGeometry(W, D), matFloor);
        fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0, (SHOP.z0 + SHOP.z1) / 2); fl.receiveShadow = true; shopG.add(fl);
        const ce = new THREE.Mesh(new THREE.PlaneGeometry(W, D), matCeil);
        ce.rotation.x = Math.PI / 2; ce.position.set(0, SHOP.H, (SHOP.z0 + SHOP.z1) / 2); shopG.add(ce);
        walls.push(box(W + 0.4, SHOP.H, 0.2, 0, SHOP.H / 2, SHOP.z0 - 0.1, matWall, shopG, false));
        walls.push(box(0.2, SHOP.H, D, SHOP.x0 - 0.1, SHOP.H / 2, (SHOP.z0 + SHOP.z1) / 2, matWall, shopG, false));
        walls.push(box(0.2, SHOP.H, D, SHOP.x1 + 0.1, SHOP.H / 2, (SHOP.z0 + SHOP.z1) / 2, matWall, shopG, false));
        // a skirting all round, dark wood
        box(W, 0.1, 0.02, 0, 0.05, SHOP.z0 + 0.01, matWood, shopG, false);
        box(0.02, 0.1, D, SHOP.x0 + 0.01, 0.05, (SHOP.z0 + SHOP.z1) / 2, matWood, shopG, false);
        box(0.02, 0.1, D, SHOP.x1 - 0.01, 0.05, (SHOP.z0 + SHOP.z1) / 2, matWood, shopG, false);
        // six LED panels in the grid and a downlight over each counter's run
        const matPanelOff = new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: 0.6 });   // (World S: closing — half of them off)
        for (const px of [-1.5, 1.5]) for (const pz of [-1.2, -3.0, -4.8]) {
          const p = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 1.2), (px < 0) !== (pz < -2) ? matPanelOff : matPanel);
          p.rotation.x = Math.PI / 2; p.position.set(px, SHOP.H - 0.005, pz); shopG.add(p);
        }
        for (const [dx, dz] of [[-3.2, -1.4], [-3.2, -2.6], [-3.2, -3.8], [3.2, -1.5], [3.2, -2.6], [3.2, -3.6], [0, -6.2]]) {
          const d = new THREE.Mesh(new THREE.CircleGeometry(0.07, 16), matLED);
          d.rotation.x = Math.PI / 2; d.position.set(dx, SHOP.H - 0.006, dz); shopG.add(d);
        }
        // the split air-conditioner over the staff's side, and its trunking
        box(0.95, 0.3, 0.24, -4.36, 2.55, -5.2, matWhite, shopG, false).rotation.y = Math.PI / 2;
        box(0.02, 0.04, 0.6, -4.245, 2.4, -5.2, matDark, shopG, false);   // (v22.3: 5 mm proud of the unit's face, which it fought)
      }

      /* ---------------------------------------------------- the glass front
         Aluminium mullions, a transom at the door's head, a solid bulkhead over
         it (the clock hangs there), the door's long chrome pulls and its brass
         bell, the shop's name in gold leaf on the glass. The front is ONE
         blocker the whole width: the door is shut in play. */
      {
        const yT = DOOR.h, bulk = SHOP.H - yT;
        /* (World H: the door OPENS — he runs out through it, the run-out film — so the glass is two side panes and the
           doorway's two leaves, each hung on its outer stile, glass in an aluminium frame with its pull inside and out,
           swinging OUT into the corridor; in play the doorway is shut by an invisible blocker across the whole front, as
           chapter 3's one glass box was) */
        for (const s of [-1, 1]) box(SHOP.x1 - DOOR.x1, SHOP.H, 0.12, s * (DOOR.x1 + SHOP.x1) / 2, SHOP.H / 2, 0.06, matGlass, shopG, false);
        walls.push(hidBox(SHOP.x1 - SHOP.x0, SHOP.H, 0.12, 0, SHOP.H / 2, 0.06));
        for (const s of [-1, 1]) {
          const hinge = new THREE.Group(); hinge.position.set(s * DOOR.x1, 0, 0.06); shopG.add(hinge);
          const w = DOOR.x1 - 0.01, cx = -s * w / 2;                     // from its hinge to the middle, where the two meet
          box(w - 0.08, yT - 0.24, 0.012, cx, 0.18 + (yT - 0.24) / 2, 0, matGlass, hinge, false);
          for (const ex of [0.025, w - 0.025]) box(0.05, yT - 0.02, 0.05, -s * ex, (yT - 0.02) / 2, 0, matAlu, hinge, false);   // the stiles
          box(w, 0.06, 0.05, cx, yT - 0.05, 0, matAlu, hinge, false);   // the head rail
          box(w, 0.18, 0.05, cx, 0.09, 0, matAlu, hinge, false);        // the kick rail
          // its long chrome pull, inside and out, 0.1 m from where the two leaves meet (chapter 3's pulls, carried on the leaf)
          for (const fz of [-0.06, 0.06]) {
            const p = cyl(0.014, 0.014, 0.9, -s * (w - 0.1), 1.05, fz, matChrome, 8, hinge); p.castShadow = false;
            for (const py of [1.48, 0.62]) cyl(0.01, 0.01, 0.06, -s * (w - 0.1), py, fz / 2, matChrome, 6, hinge).rotation.x = Math.PI / 2;
          }
          doorLeaves.push({ hinge, s });
          if (s < 0) {                                                 // the OPEN sign hangs in the left leaf, on its cord
            /* (World S: closing time — he has turned it, so the corridor reads CLOSED and the shop's side OPEN) */
            const openM = texMat(makeSignTxt(THREE, cnv, 'CLOSED  休息', '#8a1a14', '#fff6d0', 3.2), { emissive: 0xffffff, emissiveIntensity: 0.12 });
            openM.emissiveMap = openM.map; plane(0.36, 0.12, openM, 0.62 - 0.3, 1.72, -0.08, 0, hinge);
            plane(0.36, 0.12, texMat(makeSignTxt(THREE, cnv, 'OPEN  营业中', '#1f6a3a', '#fff6d0', 3.2)), 0.62 - 0.3, 1.72, -0.082, Math.PI, hinge);
            for (const sx of [-1, 1]) box(0.003, yT - 1.78, 0.003, 0.62 - 0.3 + sx * 0.15, (yT + 1.78) / 2, -0.081, matBlack, hinge, false);
          }
        }
        box(SHOP.x1 - SHOP.x0, bulk, 0.16, 0, yT + bulk / 2, 0.02, matWall, shopG, false);           // the bulkhead
        box(SHOP.x1 - SHOP.x0, 0.06, 0.1, 0, yT, 0.03, matAlu, shopG, false);                         // the transom
        box(SHOP.x1 - SHOP.x0, 0.06, 0.1, 0, 0.03, 0.03, matAlu, shopG, false);                       // the sill
        for (const mx of [SHOP.x0 + 0.04, -2.6, DOOR.x0, DOOR.x1, 2.6, SHOP.x1 - 0.04]) box(0.06, yT, 0.1, mx, yT / 2, 0.03, matAlu, shopG, false);
        // (World H: the middle mullion and the door's pulls are the leaves' own now, above) its bell
        const bell = cyl(0.02, 0.045, 0.07, DOOR.x1 - 0.12, yT - 0.08, -0.05, matGold, 12, shopG); bell.castShadow = false;
        // the name in gold leaf, twice: on the left pane and the right (it reads backwards from inside, as it should)
        const nameM = new THREE.MeshBasicMaterial({ map: tex(makeGlassName(THREE, cnv)), transparent: true, depthWrite: false, side: THREE.DoubleSide });
        for (const sx of [-1.6, 1.6]) plane(1.8, 0.675, nameM, sx, 1.62, 0.005, 0, shopG);
        // (World H: the OPEN sign hangs in the left leaf now, above)
      }

      /* -------------------------------------- CHAD'S AMULET DISPLAY TRAY (v21.8)
         (Chad: "Use these 2 models to replace all of your generated rows of
         amulet displays in the shop, both the horizontal ones and vertical
         ones, as well as the standing shelves at the wall" — and then: "you
         removed too much detail from the amulet display trays and shelf. I
         wanted it as real 3d, not just texture".) Every tray in the shop is his
         scan, REAL 3D, at three levels picked by how far it is from the eye:
         within 1.25 m his scan cut to 6 % with its own maps (47.5k triangles —
         photographed at the closest a player can stand over a counter it reads
         as the full 792k scan); out to 2.4 m, and beyond it, the same geometry
         at 6k and 1.6k, its UV seams taken away by projecting the tray's own
         front view onto it (a scan's atlas will not cut that far with its
         seams in, and a cut across them smears one amulet's colour into the
         next — photographed). Two trays to a level-of-detail group, so the
         ones under the player's hands are full and the ones across the room
         are light. The drawn velvet and framed rows each group replaces stay
         drawn until both files have landed: a failed download costs the nicer
         prop, never the shop (the v4.7 rule). */
      const TRAY = { w: 1.9036, h: 1.0973, d: 0.0973 };          // the scan's own board, in its units: x centred, y 0..h, face +z
      const TRAY_ENV = 0.3;                                       // the room's reflection on its gilt frames (bracketed by photograph)
      const TRAY_NEAR = 1.25, TRAY_MID = 2.4;                      // where a pair goes to its next lighter level (m, from the pair's middle)
      const trayGroups = [];                                      // { lists: [tray placements], standIns, parent }
      let trayLevels = null;                                      // [{ geo, mat, node }] near, mid, far, once both files have landed
      const _trayMat = new Map();
      const trayMat = (m) => { let c = _trayMat.get(m); if (!c) { c = m.clone(); c.envMap = scene.environment || null; c.envMapIntensity = TRAY_ENV; _trayMat.set(m, c); owned.push({ dispose: () => c.dispose() }); } return c; };
      /* one group of trays: `list` is [x, y, z, euler, scale] per tray (the tray's middle), in pairs; `standIns` are the
         drawn things it replaces */
      function trayGroup(list, standIns, parent = shopG) {
        const g = { list, standIns, parent };
        trayGroups.push(g);
        if (trayLevels) trayBuild(g);
      }
      function trayBuild(g) {
        const q = new THREE.Quaternion(), v = new THREE.Vector3(), sv = new THREE.Vector3(), m4 = new THREE.Matrix4();
        const lift = new THREE.Matrix4().makeTranslation(0, -TRAY.h / 2, 0);   // the file stands on its base: its middle to the origin
        for (let k = 0; k < g.list.length; k += 2) {
          const pair = g.list.slice(k, k + 2), c = new THREE.Vector3();
          for (const [x, y, z] of pair) c.add(v.set(x, y, z));
          c.multiplyScalar(1 / pair.length);
          const lod = new THREE.LOD(); lod.position.copy(c); g.parent.add(lod);
          trayLevels.forEach((L, li) => {
            const I = new THREE.InstancedMesh(L.geo, L.mat, pair.length);
            pair.forEach(([x, y, z, e, sc], i) => {
              q.setFromEuler(e);
              m4.compose(v.set(x - c.x, y - c.y, z - c.z), q, sv.set(sc, sc, sc)).multiply(lift).multiply(L.node);
              I.setMatrixAt(i, m4);
            });
            I.instanceMatrix.needsUpdate = true; I.computeBoundingSphere();
            I.castShadow = false; I.receiveShadow = true;
            lod.addLevel(I, [0, TRAY_NEAR, TRAY_MID][li]);
          });
        }
        for (const o of g.standIns) o.visible = false;
      }
      Promise.all([parseOnce('traynear'), parseOnce('trayfar')]).then(([nearG, farG]) => {
        if (!alive) return;
        /* each level's geometry, material and the matrix of its node (the quantization's own scale and offset live on
           the node, and an instanced copy must carry them) */
        const level = (root, name) => {
          root.updateMatrixWorld(true);
          let mesh = null; root.traverse(o => { if (o.isMesh && (!name || o.name === name) && !mesh) mesh = o; });
          if (!mesh) throw new Error('tray file has no ' + (name || 'mesh'));
          return { geo: mesh.geometry, mat: trayMat(mesh.material), node: mesh.matrixWorld.clone() };
        };
        trayLevels = [level(nearG.scene), level(farG.scene, 'tray_mid'), level(farG.scene, 'tray_far')];
        for (const g of trayGroups) trayBuild(g);
      }).catch(err => { console.warn('the amulet trays failed to load', err); ctx.loadFail && ctx.loadFail('traynear', err); });

      /* ------------------------------------------------- a glass counter
         A dark-wood plinth, a glass box over velvet trays (two levels), chrome
         edges, an LED strip under the top's customer edge. `face` is the side
         the customer stands on (+1 = +x, -1 = -x).
         v21.8: the trays are Chad's — two rows across and as many as fit along,
         at both levels, each one's amulets standing up the right way for the
         customer (their tops away from him). */
      const trayTex = [0, 1, 2, 3].map(i => tex(makeVelvetTray(THREE, cnv, 11 + i * 7)));
      function counter(c, face, seed) {
        const g = new THREE.Group(); shopG.add(g);
        const w = c.x1 - c.x0, L = c.z0 - c.z1, cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2;
        box(w, 0.36, L, cx, 0.18, cz, matWood, g);
        box(w + 0.02, 0.03, L + 0.02, cx, 0.375, cz, matChrome, g, false);
        const vel = new THREE.MeshStandardMaterial({ map: trayTex[seed % 4], roughness: 0.9 });
        const vel2 = new THREE.MeshStandardMaterial({ map: trayTex[(seed + 1) % 4], roughness: 0.9 });
        const t1 = new THREE.Mesh(new THREE.PlaneGeometry(L - 0.06, w - 0.08), vel); t1.rotation.set(-Math.PI / 2, 0, face > 0 ? Math.PI / 2 : -Math.PI / 2);
        t1.position.set(cx, 0.4, cz); g.add(t1);
        box(w - 0.04, 0.012, L - 0.04, cx, 0.68, cz, matGlassS, g, false);                               // the glass shelf
        const t2 = t1.clone(); t2.material = vel2; t2.position.y = 0.69; g.add(t2);
        {
          /* Chad's trays at real size (an amulet ~4 cm across): two rows across the counter, `n` along it, lying on the
             velvet at both levels; the drawn amulets on the velvet go when they land, and the velvet stays as the floor
             they lie on */
          const S = 0.225, tw = TRAY.w * S, th = TRAY.h * S, tt = TRAY.d * S, gap = 0.012;
          const n = Math.floor((L - 0.05 + gap) / (tw + gap)), e = new THREE.Euler(-Math.PI / 2, face > 0 ? Math.PI / 2 : -Math.PI / 2, 0, 'YXZ');
          const list = [];
          for (const y0 of [0.401, 0.691]) for (let i = 0; i < n; i++) for (const a of [-1, 1])         // in pairs, across
            list.push([cx + a * (th / 2 + 0.012), y0 + tt / 2, cz + (i - (n - 1) / 2) * (tw + gap), e, S]);
          const plain = new THREE.MeshStandardMaterial({ color: 0x4e0a0d, roughness: 0.92 });
          owned.push({ dispose: () => plain.dispose() });
          /* the stand-in here is the drawn amulets, not the velvet: "hiding" it gives both levels the plain velvet (and
             hands the drawn materials to dispose(), which no longer meets them on a mesh) */
          const swap = { set visible(v) { if (!v && t1.material !== plain) { owned.push({ dispose: () => { vel.dispose(); vel2.dispose(); } }); t1.material = plain; t2.material = plain; } }, get visible() { return true; } };
          trayGroup(list, [swap], g);
        }
        // the glass: front, back, ends, top — the top a touch thicker, with a chrome rim
        box(0.012, 0.62, L, face > 0 ? c.x1 : c.x0, 0.69, cz, matGlass, g, false);
        box(0.012, 0.62, L, face > 0 ? c.x0 : c.x1, 0.69, cz, matGlass, g, false);
        for (const zz of [c.z0, c.z1]) box(w, 0.62, 0.012, cx, 0.69, zz, matGlass, g, false);
        box(w, 0.016, L, cx, c.top, cz, matGlassS, g, false);
        for (const zz of [c.z0, c.z1]) box(w + 0.02, 0.022, 0.02, cx, c.top, zz, matChrome, g, false);
        for (const xx of [c.x0, c.x1]) box(0.02, 0.022, L + 0.02, xx, c.top, cz, matChrome, g, false);
        for (const zz of [c.z0, c.z1]) for (const xx of [c.x0, c.x1]) box(0.022, 0.62, 0.022, xx, 0.69, zz, matChrome, g, false);
        const led = box(0.01, 0.012, L - 0.08, face > 0 ? c.x1 - 0.03 : c.x0 + 0.03, c.top - 0.03, cz, matLED, g, false);
        led.castShadow = false;
        solids.push(box(w, c.top, L, cx, c.top / 2, cz, matProxy, g, false)); g.children[g.children.length - 1].visible = false;
        return g;
      }
      counter(LCNT, 1, 0);
      counter(RCNT, -1, 2);
      /* the strips behind the counters are the staff's: between a counter's
         padded back and the cabinets' (0.30 m, open at both ends) the lens could
         walk in and stand inside the man there — a thin box fills each */
      solids.push(hidBox(0.58, 1.4, 3.2, -3.79, 0.7, (LCNT.z0 + LCNT.z1) / 2));   // (v22.3: the whole gap, counter to cabinets — a 2 cm strip left a slot either side)
      solids.push(hidBox(0.6, 1.4, 3.0, 3.80, 0.7, (RCNT.z0 + RCNT.z1) / 2));     // (v22.3: a 1 cm slot either side let a diagonal push behind the counter, through the owner)

      /* -------------------------------------------- the owner's working end
         A wooden top at the back of his counter: the loupe, the lamp, the till,
         a receipt book, a calculator, his phone, his tea. */
      {
        const z = RCNT.z1 + 0.42, x = (RCNT.x0 + RCNT.x1) / 2, y = RCNT.top + 0.008;
        box(0.64, 0.02, 0.8, x, y, z, matWoodL, shopG);   // (v22.3: 1 cm over the chrome rims either side — its sides were their outer faces)
        box(0.3, 0.16, 0.26, x + 0.08, y + 0.09, z - 0.2, matBlack, shopG);                   // the till
        box(0.22, 0.02, 0.18, x + 0.08, y + 0.18, z - 0.2, matDark, shopG).rotation.x = -0.4;
        box(0.12, 0.012, 0.16, x - 0.12, y + 0.016, z + 0.12, matDark, shopG);                 // the calculator
        box(0.16, 0.012, 0.22, x - 0.1, y + 0.014, z - 0.1, matCream, shopG);                  // the receipt book
        box(0.075, 0.008, 0.15, x + 0.14, y + 0.012, z + 0.22, matBlack, shopG).rotation.y = 0.3;   // his phone
        cyl(0.035, 0.03, 0.07, x + 0.18, y + 0.045, z + 0.04, matWhite, 12, shopG);            // his tea
        const lamp = new THREE.Group(); lamp.position.set(x + 0.2, y, z + 0.34); shopG.add(lamp);
        cyl(0.06, 0.07, 0.02, 0, 0.01, 0, matBlack, 14, lamp); cyl(0.008, 0.008, 0.34, 0, 0.18, 0, matChrome, 6, lamp);
        const sh = cyl(0.03, 0.07, 0.08, -0.06, 0.34, 0, matBlack, 14, lamp); sh.rotation.z = 0.7;
        const loupe = new THREE.Group(); loupe.position.set(x - 0.18, y + 0.01, z + 0.32); shopG.add(loupe);
        cyl(0.02, 0.02, 0.018, 0, 0.009, 0, matBlack, 14, loupe);
        cyl(0.018, 0.018, 0.004, 0, 0.02, 0, matGlassS, 14, loupe);
      }

      /* ----------------------------------- THE LP TIM's stand (World S: EMPTY, as chapter 4 left it before the owner
         set the Hanuman on it — he gave the Luang Phu Tim away in chapter 3 and the Hanuman went home in chapter 4, so
         the stand, its cushion and its easel are all there is, and nothing is loaded for it) */
      const lpCase = new THREE.Group(); lpCase.position.set(LPT.x, RCNT.top + 0.01, LPT.z); shopG.add(lpCase);
      box(0.13, 0.03, 0.13, 0, 0.015, 0, matWood, lpCase);
      box(0.11, 0.012, 0.11, 0, 0.036, 0, new THREE.MeshStandardMaterial({ color: 0x7a0c12, roughness: 0.95 }), lpCase);
      const lpTilt = new THREE.Group(); lpTilt.position.set(0, 0.042, 0); lpTilt.rotation.set(-0.2, -Math.PI / 2, 0, 'YXZ'); lpCase.add(lpTilt);
      box(0.026, 0.05, 0.005, 0, 0.025, -0.014, matWood, lpTilt, false);                       // the easel

      /* ----------------------------------------------- CHAD'S DISPLAY SHELF (v21.8)
         His shelf of images — twenty on five shelves, Buddhas, monks, deities
         and hermits, 1.082 x 1.899 x 0.32 m, baked on its base centre facing +z
         — stands on the staff's wall behind the staff man (Chad: "the shelf
         behind the man was supposed to be the shelf i provided you") — three
         of them (the back-left corner's pair went for the lersi masks, later in
         v21.8). THREE levels in the one file, three index lists
         over one set of vertices (tools/lodpair.mjs LEVELS): EVERY triangle of
         his scan (594k) within 1.5 m of a shelf's middle (Chad: "you removed
         too much detail from the amulet display trays and shelf"), a 178k cut
         to 2.6 m, a 40k cut beyond — the same images across the shop. The
         images' gilt takes the room's reflection as the Buddha's does. */
      const SHELF = { w: 1.082, d: 0.32, mid: 0.95 };
      /* (CP8: `parent` — the tray shop stands two of them against its own wall, in World T) */
      function displayShelf(x, z, ry, standIn, parent = shopG) {
        parseOnce('amushelf').then(g => {
          if (!alive) return;
          const src = g.scene.clone(true), lod = new THREE.LOD();
          lod.position.set(x, SHELF.mid, z); lod.rotation.y = ry;
          for (const [name, d] of [['amushelf_near', 0], ['amushelf_mid', 1.5], ['amushelf_far', 2.6]]) {
            const n = src.getObjectByName(name);
            if (!n) throw new Error('amushelf has no ' + name);
            const w = new THREE.Group(); w.position.y = -SHELF.mid; w.add(n);
            w.traverse(q => { if (!q.isMesh) return; q.castShadow = false; q.receiveShadow = true; q.material = buddhaMat(q.material); });
            lod.addLevel(w, d);
          }
          parent.add(lod);
          if (standIn) standIn.visible = false;
        }).catch(err => { console.warn('the display shelf failed to load', err); ctx.loadFail && ctx.loadFail('amushelf', err); });
      }

      /* ------------------------------------------------ the staff's wall
         Three of his shelves, their backs to the wall, facing into the shop
         where three tall glass cabinets of framed amulets stood; the cabinets
         stand in until the shelf lands (a failed download costs the nicer
         prop, never the shop — v4.7). */
      const atlas = tex(makeAmuletAtlas(THREE, cnv));
      const kindMats = Array.from({ length: 8 }, (_, k) => {
        const t = atlas.clone(); t.needsUpdate = true; t.repeat.set(0.25, 0.5); t.offset.set((k % 4) * 0.25, k < 4 ? 0.5 : 0); madeTex.push(t);
        return new THREE.MeshStandardMaterial({ map: t, roughness: 0.6 });
      });
      {
        const CAB = { x: SHOP.x0 + 0.22, d: 0.4, h: 2.1, zs: [-0.95, -2.25, -3.55], w: 1.2 };
        const cabG = new THREE.Group(); shopG.add(cabG);                  // the stand-in: the old cabinets and their rows
        const frames = [], faces = Array.from({ length: 8 }, () => []);
        let n = 0;
        for (const cz of CAB.zs) {
          box(CAB.d, 0.24, CAB.w, CAB.x, 0.12, cz, matWood, cabG);                                    // plinth
          box(CAB.d, 0.06, CAB.w, CAB.x, CAB.h, cz, matWood, cabG);                                   // crown
          box(0.02, CAB.h - 0.24, CAB.w, CAB.x - CAB.d / 2 + 0.01, 0.24 + (CAB.h - 0.24) / 2, cz, matRedD, cabG, false);   // back
          for (const s of [-1, 1]) box(CAB.d, CAB.h - 0.24, 0.03, CAB.x, 0.24 + (CAB.h - 0.24) / 2, cz + s * CAB.w / 2, matWood, cabG, false);
          box(0.012, CAB.h - 0.3, CAB.w - 0.04, CAB.x + CAB.d / 2, 0.24 + (CAB.h - 0.24) / 2, cz, matGlass, cabG, false);   // the glass doors
          box(0.012, CAB.h - 0.3, 0.012, CAB.x + CAB.d / 2 + 0.006, 0.24 + (CAB.h - 0.24) / 2, cz, matChrome, cabG, false);
          for (let sh = 0; sh < 5; sh++) {
            const y = 0.32 + sh * 0.34;
            box(CAB.d - 0.04, 0.012, CAB.w - 0.06, CAB.x, y, cz, matGlassS, cabG, false);
            box(0.008, 0.01, CAB.w - 0.1, CAB.x + CAB.d / 2 - 0.03, y + 0.31, cz, matLED, cabG, false);
            for (let i = 0; i < 8; i++) {
              const zz = cz - CAB.w / 2 + 0.1 + i * 0.143, k = (i * 3 + sh * 5 + n) % 8;
              frames.push([CAB.x - 0.08, y + 0.075, zz]);
              faces[k].push([CAB.x - 0.0715, y + 0.075, zz]);
            }
          }
          solids.push(hidBox(CAB.d, CAB.h, CAB.w, CAB.x, CAB.h / 2, cz));
          n++;
        }
        const fG = new THREE.BoxGeometry(0.016, 0.12, 0.095), m4 = new THREE.Matrix4();
        const fI = new THREE.InstancedMesh(fG, matGold, frames.length); frames.forEach((p, i) => fI.setMatrixAt(i, m4.makeTranslation(...p)));
        fI.castShadow = false; cabG.add(fI);
        const pG = new THREE.PlaneGeometry(0.08, 0.105), rot = new THREE.Matrix4().makeRotationY(Math.PI / 2);
        faces.forEach((list, k) => {
          if (!list.length) return;
          const I = new THREE.InstancedMesh(pG, kindMats[k], list.length);
          list.forEach((p, i) => I.setMatrixAt(i, new THREE.Matrix4().makeTranslation(...p).multiply(rot)));
          I.castShadow = false; cabG.add(I);
        });
        /* his shelves on the cabinets' own spots: the back 1 cm off the wall, the front (+z in the file) turned to +x */
        for (const cz of CAB.zs) displayShelf(SHOP.x0 + SHELF.d / 2 + 0.012, cz, Math.PI / 2, cabG);
      }

      /* ------------------------------------------- the owner's wall: THE OLD MASTERS
         Over a low cabinet behind his counter, the shop's Thai calendar beside
         them, a shelf of boxed cases under.
         v21.8 · CHAD'S FIVE (Chad: "For the monk portraits in the amulet shop,
         replace all your generated ones with these 5. Credits are the URLs
         provided. Please use them cleanly in the game, with no alterations.
         This is important in respect to these masters"). The nine drawn
         likenesses are gone. Each photograph is its source's own bytes
         (masters/v21.8/portraits/SOURCES.md: the page, the file, its sha1),
         drawn UNLIT and outside tone mapping, so the screen shows each one's
         own colour; never cropped, scaled only as a whole, at its own aspect.
         Luang Phu Tim's two — the master of the shop's prized amulet — in
         plain gilt frames built ROUND the photographs; Luang Pu Thuad, Somdej
         Toh and Ajahn Mun, whose pictures carry their own gold frames, hang as
         they are (their corners are the file's own transparency). Since v21.9
         all five hang in ONE ROW high on the wall, over the owner's head (the
         row's own note, below). Credited in the panel, one row a page.
         v21.10 · A SIXTH (Chad: "Please add lp phiboon attached image here as
         one additional monk portrait to be on the same row as existing monk
         portraits on the wall in the amulet shop. Frame it nicely"): LP
         Phiboon, the photograph Chad attached, byte for byte, in a FINE frame —
         a two-step gilt moulding, a crimson velvet liner, gilt corner blocks
         with a rosette each — at the row's door end. */
      {
        const wx = SHOP.x1 - 0.012;
        /* v21.10: the fine frame's border (moulding + liner) and its liner, and its two materials */
        const FINE_B = 0.062, FINE_L = 0.028;
        const matVelvet = new THREE.MeshStandardMaterial({ color: 0x6a0e14, roughness: 0.96 });
        const matGoldHi = new THREE.MeshStandardMaterial({ color: 0xf2c86e, roughness: 0.24, metalness: 0.6, emissive: 0x4a3008, emissiveIntensity: 0.65 });
        /* an ImageBitmap upload ignores UNPACK_FLIP_Y (the WebGL rule), so the photograph's first row arrives at v = 0:
           the plane's own v is turned round to stand it upright — the picture itself is never touched */
        const portrait = (key, mime, w, h, y, z, frame) => {
          const g = new THREE.Group(); g.position.set(wx - 0.004, y, z); g.rotation.y = -Math.PI / 2; shopG.add(g);
          const fine = frame === 'fine';
          // a soft shadow on the wall, a little under it, so it hangs ON the wall rather than being painted into it
          const sw = fine ? (w + 2 * FINE_B) * 1.06 : w * 1.12, shh = fine ? (h + 2 * FINE_B) * 1.06 : h * 1.1;
          const sh = new THREE.Mesh(new THREE.PlaneGeometry(sw, shh), new THREE.MeshBasicMaterial({
            map: (() => { const t = makeSoftDot('rgba(0,0,0,0.55)', 'rgba(0,0,0,0)'); madeTex.push(t); return t; })(),
            transparent: true, depthWrite: false, fog: false }));
          sh.position.set(0.006, -0.018, -0.002); g.add(sh);
          if (fine) {
            /* v21.10 · THE FINE FRAME (LP Phiboon's — "Frame it nicely"): from the back, a dark board, a crimson velvet
               liner FINE_L wide round the photograph with a thin gilt slip at its inner edge, then a gilt moulding
               FINE_M wide in two steps — a broad flat and a raised bead along its inner edge, so the light catches a
               line round the picture — and a gilt block at each corner carrying a small rosette. The photograph itself
               is never touched: it lies on the velvet, inside the slip. */
            const L = FINE_L, M = FINE_B - FINE_L, W = w + 2 * FINE_B, H = h + 2 * FINE_B;
            box(W, H, 0.008, 0, 0, 0.004, matDark, g, false);                                   // the board
            box(w + 2 * L, h + 2 * L, 0.004, 0, 0, 0.010, matVelvet, g, false);                // the liner
            const sl = 0.006;                                                                    // the slip
            box(w + 2 * sl, sl, 0.006, 0, h / 2 + sl / 2, 0.013, matGoldHi, g, false);
            box(w + 2 * sl, sl, 0.006, 0, -h / 2 - sl / 2, 0.013, matGoldHi, g, false);
            box(sl, h, 0.006, -w / 2 - sl / 2, 0, 0.013, matGoldHi, g, false);
            box(sl, h, 0.006, w / 2 + sl / 2, 0, 0.013, matGoldHi, g, false);
            const iw = w + 2 * L, ih = h + 2 * L;                                              // the moulding's inner edge
            box(W, M, 0.026, 0, ih / 2 + M / 2, 0.013, matGold, g, false);                      // the broad flat, round
            box(W, M, 0.026, 0, -ih / 2 - M / 2, 0.013, matGold, g, false);
            box(M, ih, 0.026, -iw / 2 - M / 2, 0, 0.013, matGold, g, false);
            box(M, ih, 0.026, iw / 2 + M / 2, 0, 0.013, matGold, g, false);
            const bd = 0.009;                                                                    // the bead along it
            box(iw + 2 * bd, bd, 0.034, 0, ih / 2 + bd / 2, 0.017, matGoldHi, g, false);
            box(iw + 2 * bd, bd, 0.034, 0, -ih / 2 - bd / 2, 0.017, matGoldHi, g, false);
            box(bd, ih, 0.034, -iw / 2 - bd / 2, 0, 0.017, matGoldHi, g, false);
            box(bd, ih, 0.034, iw / 2 + bd / 2, 0, 0.017, matGoldHi, g, false);
            const cb = M + 0.012, rG = new THREE.CylinderGeometry(0.011, 0.013, 0.008, 16);   // the corner blocks
            for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
              const cx = sx * (W / 2 - cb / 2 + 0.004), cy = sy * (H / 2 - cb / 2 + 0.004);
              box(cb, cb, 0.036, cx, cy, 0.018, matGold, g, false);
              const ro = new THREE.Mesh(rG, matGoldHi); ro.rotation.x = Math.PI / 2; ro.position.set(cx, cy, 0.039); g.add(ro);
            }
          } else if (frame) {                                  // a gilt moulding round it, standing proud of the picture, and a dark board behind
            const fw = 0.032, fd = 0.026;
            box(w + 2 * fw, fw, fd, 0, h / 2 + fw / 2, fd / 2, matGold, g, false);
            box(w + 2 * fw, fw, fd, 0, -h / 2 - fw / 2, fd / 2, matGold, g, false);
            box(fw, h, fd, -w / 2 - fw / 2, 0, fd / 2, matGold, g, false);
            box(fw, h, fd, w / 2 + fw / 2, 0, fd / 2, matGold, g, false);
            box(w, h, 0.006, 0, 0, 0.003, matDark, g, false);
          }
          const geo = new THREE.PlaneGeometry(w, h), uv = geo.attributes.uv;
          for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i));
          const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: !frame, alphaTest: frame ? 0 : 0.02, toneMapped: false, fog: false });
          const m = new THREE.Mesh(geo, mat); m.position.z = fine ? 0.0125 : frame ? 0.0075 : 0.004; m.visible = false; g.add(m);
          loadImageTexture(key, mime).then(t => {
            if (!alive || !t) return;
            madeTex.push(t); mat.map = t; mat.needsUpdate = true; m.visible = true;
          }).catch(() => {});
          return g;
        };
        /* Luang Phu Tim at prayer (250 x 333) and on his bench (450 x 600), both 3:4; the three mybuddha108 portraits
           320 x 418. Left to right as seen from the shop floor (+z is the viewer's right on this wall).
           v21.9 · ONE ROW, AT THE TOP (Chad: "the shop owner standing is covering the monk portraits behind. I want the
           monk portraits to all be in a single row at the top so that they are not covered"). Until v21.9 Luang Phu
           Tim's two hung over the other three, and those three (1.0–1.4 m) were behind the owner's back. He is 1.66 m
           tall, 0.51 m off this wall, and from anywhere the counter lets the player stand his head covers nothing on
           it above 1.70 m — the row's lowest edge is MSTR.y0, 1.90. All five the same height on the wall (MSTR.h, the
           gilt mouldings included), each at its own aspect, never cropped; in the order the two rows had: Luang Pu
           Thuad, Luang Phu Tim at prayer, Somdej Toh in the middle under the shelf-shrine, Luang Phu Tim on his bench,
           Ajahn Mun.
           v21.10: and LP Phiboon at the door end (+z) — his photograph 318 x 500, in the fine frame (FINE_B a side), so
           the row keeps its rhythm of framed portraits and photographs; six, recentred on the shelf-shrine, whose
           middle now falls in the gap between Somdej Toh and Luang Phu Tim on his bench */
        const FWD = 0.032, GAP = 0.12, RH = MSTR.h, RY = MSTR.y0 + MSTR.h / 2;   // (FWD: the moulding portrait() builds round a photograph)
        const border = fr => fr === 'fine' ? FINE_B : fr ? FWD : 0;
        const row = [
          ['mstr_lpthuad', 'image/png', RH * 320 / 418, RH, false],
          ['mstr_lptimpray', 'image/jpeg', (RH - 2 * FWD) * 250 / 333, RH - 2 * FWD, true],
          ['mstr_somdejtoh', 'image/png', RH * 320 / 418, RH, false],
          ['mstr_lptimbench', 'image/jpeg', (RH - 2 * FWD) * 450 / 600, RH - 2 * FWD, true],
          ['mstr_achanmun', 'image/png', RH * 320 / 418, RH, false],
          ['mstr_lpphiboon', 'image/jpeg', (RH - 2 * FINE_B) * 318 / 500, RH - 2 * FINE_B, 'fine']
        ];
        const outer = row.map(([, , w, , fr]) => w + 2 * border(fr));
        const rowLen = outer.reduce((a, b) => a + b, 0) + GAP * (row.length - 1);
        MSTR.half = rowLen / 2;                                // (the row's half-length: its tap box, lkMasters)
        let rz = MSTR.z - rowLen / 2;
        row.forEach(([key, mime, w, h, fr], i) => { portrait(key, mime, w, h, RY, rz + outer[i] / 2, fr); rz += outer[i] + GAP; });
        /* the shelf-shrine's brackets, a quarter-metre either side of its middle. Until v21.10 they stood down the gaps
           either side of Somdej Toh, the row's middle; with six the middle is a gap, so they stand OVER the two
           portraits beside it, their struts stopping 4 cm above the frames' tops (MSTR.y0 + MSTR.h) */
        const BRZ = 0.25, BRY0 = MSTR.y0 + MSTR.h + 0.04;
        box(0.4, 0.86, 2.8, SHOP.x1 - 0.2, 0.43, -2.45, matWood, shopG);                             // the low cabinet
        box(0.42, 0.03, 2.82, SHOP.x1 - 0.2, 0.875, -2.45, matWoodL, shopG);
        const br = texMat(makeBoxRow(THREE, cnv));
        /* v21.8: the low cabinet's front shows Chad's trays — two to a panel in a gilt frame, where the drawn boxes stood
           (they stay, standing in, until the trays land) */
        const boxRows = [], lowTrays = [], LS = 0.24, lw = TRAY.w * LS, lh = TRAY.h * LS, lt = TRAY.d * LS, le = new THREE.Euler(0, -Math.PI / 2, 0);
        for (const zz of [-1.6, -3.3]) {
          boxRows.push(plane(1.1, 0.27, br, SHOP.x1 - 0.405, 0.6, zz, -Math.PI / 2, shopG));
          for (const a of [-1, 1]) lowTrays.push([SHOP.x1 - 0.4 - lt / 2 - 0.002, 0.6, zz + a * (lw / 2 + 0.008), le, LS]);
          const fx = SHOP.x1 - 0.4 - 0.011, fw = 0.018, W2 = lw * 2 + 0.016 + 2 * fw, H2 = lh + 2 * fw;
          const rim = new THREE.Group(); rim.visible = false; shopG.add(rim);
          box(0.022, fw, W2, fx, 0.6 + H2 / 2 - fw / 2, zz, matGold, rim, false);
          box(0.022, fw, W2, fx, 0.6 - H2 / 2 + fw / 2, zz, matGold, rim, false);
          for (const a of [-1, 1]) box(0.022, H2, fw, fx, 0.6, zz + a * (W2 / 2 - fw / 2), matGold, rim, false);
          boxRows.push({ set visible(v) { rim.visible = !v; }, get visible() { return !rim.visible; } });
        }
        trayGroup(lowTrays, boxRows);
        plane(0.42, 0.63, texMat(makeCalendar(THREE, cnv)), wx - 0.002, 1.55, -4.45, -Math.PI / 2, shopG);   // (v21.10: 0.3 m back, clear of the longer row's end)
        solids.push(hidBox(0.4, 0.9, 2.8, SHOP.x1 - 0.2, 0.45, -2.45));
        // a small shelf-shrine over the photographs: a Buddha, a garland, two candles
        /* (on two gilt brackets, with a gold lip along its front: seen from the counter it was a dark-red slab floating
           on nothing behind the SANITY row — VP-9) */
        box(0.28, 0.03, 0.7, SHOP.x1 - 0.14, 2.62, -2.5, matRed, shopG);
        box(0.012, 0.045, 0.7, SHOP.x1 - 0.282, 2.62, -2.5, matGold, shopG, false);
        for (const dz of [-BRZ, BRZ]) {
          box(0.2, 0.025, 0.03, SHOP.x1 - 0.1, 2.59, -2.5 + dz, matGold, shopG, false);
          const st = box(0.02, 2.6 - BRY0, 0.03, SHOP.x1 - 0.02, (2.6 + BRY0) / 2, -2.5 + dz, matGold, shopG, false);
          const dg = box(0.018, 0.24, 0.025, SHOP.x1 - 0.09, 2.52, -2.5 + dz, matGold, shopG, false); dg.rotation.z = 0.78;
          st.castShadow = dg.castShadow = false;
        }
        thai('buddha', SHOP.x1 - 0.15, 2.635, -2.5, { s: 0.42, ry: -Math.PI / 2, parent: shopG, cast: false });
      }

      /* ---------------------------------------------------- the clock
         Over the door, inside. Its hands are meshes, so the trance's fifteen
         minutes can pass on it (stage.clockTo). */
      const clockG = new THREE.Group(); clockG.position.set(CLOCK.x, CLOCK.y, CLOCK.z); clockG.rotation.y = Math.PI; shopG.add(clockG);
      {
        const face = new THREE.Mesh(new THREE.CircleGeometry(0.17, 32), texMat(makeClockFace(THREE, cnv), { roughness: 0.6 }));
        face.position.z = 0.012; clockG.add(face);
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.175, 0.012, 8, 32), matBlack); rim.position.z = 0.012; clockG.add(rim);
      }
      const hourHand = new THREE.Group(), minHand = new THREE.Group();
      for (const [hand, L, wd] of [[hourHand, 0.09, 0.012], [minHand, 0.13, 0.008]]) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(wd, L, 0.004), matBlack); b.position.set(0, L / 2 - 0.015, 0); hand.add(b);
        hand.position.z = 0.02; clockG.add(hand);
      }
      function clockTo(h, m) {
        minHand.rotation.z = -(m / 60) * Math.PI * 2;
        hourHand.rotation.z = -((h % 12) + m / 60) / 12 * Math.PI * 2;
      }
      clockTo(19, 10);                                      // (World S: ten past seven, closing time)

      /* ------------------------------------------------------- THE ALTAR
         A red-lacquer cabinet with gilt rims against the back wall, the red
         board of gilt lattice behind; candles, fruit and orchids on the
         cabinet's two ends; lilies in tall vases either side, a red valance over
         the whole, and a strip of warm light washing the board.
         v21.8 (Chad: "For the altar area, use the row of altar statues that was
         used in the sakyant ajahn room in ep 3 chp 1, so it looks more like a
         real amulet shop"): the three tiers and their three Buddhas are gone,
         and CHAD'S ROW OF ALTAR STATUES stands on the cabinet — the Buddha in
         his gilt arch at its middle, the hermits, the old masters and the
         guardians round him (e3c1's `altarrow`, its own facing, its base cloth
         a few mm off the gilt top, the v19.3 law). The cabinet is 0.70 deep now,
         the row's own depth at its scale. Before it a LOW STEP carries the
         incense pot and the offering trays (the tiers' front used to), and the
         monk who leads the chant sits before the step on his cushion (MONK). */
      const altarG = new THREE.Group(); shopG.add(altarG);
      const flames = [];                                     // lit at the celebration: the staff man the left, the owner the right (v21.8)
      const flameGlowTex = tex(makeGlowTex(THREE, cnv, [255, 196, 120]));
      let radioLed = null;
      const ALT_TOP = ALTAR.h, ALT_TOPY = ALT_TOP + 0.02;     // the gilt slab's top: what things stand ON
      /* the row at 0.74: its base 1.904 x 0.889 and 1.111 tall at 1 (measured, dbg-rowgrid), so 1.41 x 0.66, 0.82 tall;
         its back 3 cm off the red board. The Buddha at its middle has his face 0.74 up the scan and 0.13 in front of
         its centre (the grid photographs, front and side) */
      const ROW_S = 0.74, ROW_D = 0.889 * ROW_S, ROW_Z = SHOP.z0 + 0.042 + ROW_D / 2;
      const ROW_FACE = { x: ALTAR.x, y: ALT_TOPY + 0.003 + 0.74 * ROW_S, z: ROW_Z - 0.13 * ROW_S };
      {
        const { x, z, w, d, h } = ALTAR;
        box(w, h, d, x, h / 2, z, matRed, altarG);
        box(w + 0.04, 0.04, d + 0.04, x, h, z, matGold, altarG);
        box(w + 0.04, 0.08, d + 0.04, x, 0.04, z, matGold, altarG);
        for (const s of [-1, 1]) {                                     // drawer and cupboard fronts with gilt pulls
          box(w * 0.42, 0.2, 0.012, x + s * w * 0.23, h - 0.16, z + d / 2 + 0.006, matRedD, altarG, false);
          box(w * 0.42, 0.5, 0.012, x + s * w * 0.23, 0.38, z + d / 2 + 0.006, matRedD, altarG, false);
          cyl(0.012, 0.012, 0.04, x + s * w * 0.23, h - 0.16, z + d / 2 + 0.02, matGold, 8, altarG).rotation.x = Math.PI / 2;
        }
        solids.push(hidBox(w, 1.4, d, x, 0.7, z));
        // the board behind
        plane(2.5, 1.9, texMat(makeAltarScreen(THREE, cnv), { roughness: 0.5, emissive: 0x3a0804, emissiveIntensity: 0.3 }), x, 1.92, SHOP.z0 + 0.012, 0, altarG);
        // a red valance with a gilt fringe across the ceiling over it
        box(2.9, 0.22, 0.04, x, SHOP.H - 0.11, z + 0.1, matRed, altarG, false);
        box(2.9, 0.03, 0.05, x, SHOP.H - 0.225, z + 0.1, matGold, altarG, false);
        /* THE ROW. A gold Buddha stands in for it until the scan lands (a failed download costs the row, never the
           altar — v4.7) */
        const standIn = thai('buddha', x, ALT_TOPY, ROW_Z - 0.05, { s: 1.4, parent: altarG, cast: false });
        /* TWO LEVELS (the shop is seen across a room): the full row (419k triangles) within 2.6 m of its middle, and
           beyond it a permissive cut of 126k that wears the full row's own maps (tools/permcut.mjs NOTEX=1) —
           photographed side by side at 1.3 m only the steps under the principal image differ, and from the mats on.
           (Chad: "why is the row of altar statues all in gold colour? what happened to the original texture and
           colours?" — the cut had lost its UVs: prune() drops a vertex attribute no texture reads, and NOTEX had taken
           the textures, so beyond 2.6 m the whole row sampled one gilt texel. permcut keeps them now, and the file
           was cut again: the same 125,622 triangles, with their UVs) */
        Promise.all([parseOnce('altarrow'), parseOnce('altarrowfar')]).then(([gltf, farG]) => {
          if (!alive) return;
          const RH = 1.111 * ROW_S, lod = new THREE.LOD();
          lod.position.set(x, ALT_TOPY + 0.003 + RH / 2, ROW_Z); altarG.add(lod);
          let mat = null;
          const level = (src, d) => {
            const m = src.clone(true); m.scale.setScalar(ROW_S); m.position.y = -RH / 2;
            m.traverse(o => { if (!o.isMesh) return; o.castShadow = false; o.receiveShadow = true;
              if (!mat) mat = o.material; else o.material = mat; });
            lod.addLevel(m, d);
          };
          level(gltf.scene, 0); level(farG.scene, 2.6);
          standIn.visible = false;
        }).catch(err => { console.warn('altarrow failed to load', err); ctx.loadFail && ctx.loadFail('altarrow', err); });
        /* the cabinet's two ends (the row leaves 0.45 m each side): a candle at the front corner, the fruit behind it,
           an orchid at the back */
        const orange = new THREE.MeshStandardMaterial({ color: 0xf08a1e, roughness: 0.6 }), apple = new THREE.MeshStandardMaterial({ color: 0xb8241a, roughness: 0.4 });
        for (const s of [-1, 1]) {
          const ex = x + s * 0.93;
          thai('candle', ex, ALT_TOPY, z + 0.23, { s: 0.55, cast: false, parent: altarG });
          thai('orchid', x + s * 1.0, ALT_TOPY, z - 0.25, { s: 0.38, cast: false, parent: altarG });
          cyl(0.11, 0.095, 0.02, ex, ALT_TOPY + 0.01, z - 0.02, matGold, 18, altarG);
          for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2;
            const f = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 10), i % 2 ? apple : orange);
            f.position.set(ex + Math.cos(a) * 0.058, ALT_TOPY + 0.054, z - 0.02 + Math.sin(a) * 0.058); altarG.add(f); }
          const top = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 10), orange); top.position.set(ex, ALT_TOPY + 0.1, z - 0.02); altarG.add(top);
        }
        // the candle flames (painted light), over the candles' wicks
        for (const s of [-1, 1]) {
          const g = new THREE.Group(); g.position.set(x + s * 0.93, ALT_TOPY + 0.25, z + 0.23); g.visible = false; altarG.add(g);
          const f = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), matFlame); f.scale.set(1, 2.2, 1); g.add(f);
          const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.17, 0.17), new THREE.MeshBasicMaterial({ map: flameGlowTex, transparent: true, depthWrite: false,
            blending: THREE.AdditiveBlending, opacity: 0.75 }));
          g.add(glow); g.userData = { core: f, glow };
          flames.push(g);
        }
        /* THE STEP before the cabinet: red lacquer under a gilt slab, the incense pot at its middle, two trays of
           offerings, the shop's small bell (v21.8: what the tiers' front carried) */
        box(STEP.w, STEP.h, STEP.d, x, STEP.h / 2, STEP.z, matRed, altarG);
        box(STEP.w + 0.03, 0.025, STEP.d + 0.03, x, STEP.h, STEP.z, matGold, altarG);
        box(STEP.w + 0.03, 0.06, STEP.d + 0.03, x, 0.03, STEP.z, matGold, altarG);
        solids.push(hidBox(STEP.w, STEP.h, STEP.d, x, STEP.h / 2, STEP.z));
        const STY = STEP.h + 0.0125;
        thai('incense', x, STY, STEP.z, { s: 0.42, cast: false, parent: altarG });
        for (const s of [-1, 1]) thai('phan', x + s * 0.42, STY, STEP.z, { s: 0.42, cast: false, parent: altarG });
        const bellM = cyl(0.03, 0.05, 0.07, x - 0.66, STY + 0.035, STEP.z, matGold, 14, altarG); bellM.castShadow = false;
        /* lilies either side (the two lotus bowls that stood in front of them are
           gone: the staff man lit the candles and switched on the radio standing
           IN them, and the owner's stool stood against one) */
        for (const s of [-1, 1]) { thai('lily', x + s * 1.48, 0, z + 0.05, { s: 0.8, parent: altarG }); solids.push(hidBox(0.3, 1.0, 0.3, x + s * 1.48, 0.5, z + 0.05)); }   // (walked through until v21.1 — GF-7)
        // the warm wash on the board (painted: no light)
        const wash = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.6), new THREE.MeshBasicMaterial({ map: tex(makeGlowTex(THREE, cnv, [255, 190, 110])),
          transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.32 }));
        wash.position.set(x, 1.95, SHOP.z0 + 0.03); altarG.add(wash);
        /* the radio on its own little table (v21.2: Thai traditional music, not a chant). v21.8: it plays while he
           browses, and the OWNER turns it off on his way to his stool — a monk leads the chant now, and nobody chants
           over the radio */
        box(0.42, 0.62, 0.36, x + 1.95, 0.31, z + 0.02, matWood, altarG);
        const radio = box(0.32, 0.16, 0.14, x + 1.95, 0.7, z + 0.02, matBlack, altarG);
        for (const s of [-1, 1]) { const sp = new THREE.Mesh(new THREE.CircleGeometry(0.045, 16), matDark); sp.position.set(x + 1.95 + s * 0.1, 0.7, z + 0.095); altarG.add(sp); }
        radioLed = new THREE.Mesh(new THREE.CircleGeometry(0.007, 10), new THREE.MeshBasicMaterial({ color: 0x6aff8a }));
        radioLed.position.set(x + 1.95, 0.755, z + 0.093); radioLed.visible = false; altarG.add(radioLed);   // (World S: off)
        solids.push(hidBox(0.42, 0.8, 0.36, x + 1.95, 0.4, z + 0.02));
        void radio;
      }

      /* ------------------------------------------ the back corners
         Left: the lersi masks over their cabinet. Right: the water dispenser, a
         standing fan, and the curtained way to the back room. */
      {
        /* v21.8 (Chad: "why are there the shelves right next to the altar? Replace them with row of lersi masks instead,
           those from the sakyant ajahn room. Make sure all the original colours and textures make it through
           correctly"): the corner beside the altar is CHAD'S ROW OF LERSI MASKS — e3c1's `lersimask`, as it hangs over
           Ajahn Krukai: its own two shelves on their brackets, its back on the back wall, every mask in its own paint
           (the scan drawn exactly as it comes: its maps, its material, untouched; no cut, no LOD). Its lower shelf at
           1.25 m, its spires 0.25 m under the ceiling; under it a low cabinet in the altar's red lacquer and gilt, its
           candles and incense pot before the masks (e3c1's ledge carried the same). Two red boards stand in until it
           lands (a failed download costs the masks, never the corner — v4.7) */
        const sx = -3.0, MS = 1.0, MY = 1.25, CAB_H = 0.9, cz = SHOP.z0 + 0.24;
        const maskStand = [box(2.0, 0.05, 0.32, sx, MY + 0.05, SHOP.z0 + 0.17, matRed, shopG, false),
                           box(2.0, 0.05, 0.32, sx, MY + 0.75, SHOP.z0 + 0.17, matRed, shopG, false)];
        parseOnce('lersimask').then(gltf => {
          if (!alive) return;
          const m = gltf.scene.clone(true);
          m.scale.setScalar(MS); m.position.set(sx, MY, SHOP.z0 + 0.012 + 0.308 * MS);   // (its back, z −0.308 at 1, on the wall)
          m.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = true; } });
          shopG.add(m);
          for (const h of maskStand) h.visible = false;
        }).catch(err => { console.warn('lersimask failed to load', err); ctx.loadFail && ctx.loadFail('lersimask', err); });
        box(2.0, CAB_H, 0.46, sx, CAB_H / 2, cz, matRed, shopG);
        box(2.04, 0.04, 0.5, sx, CAB_H, cz, matGold, shopG);
        box(2.04, 0.08, 0.5, sx, 0.04, cz, matGold, shopG);
        for (const s of [-1, 1]) {
          box(0.86, 0.6, 0.012, sx + s * 0.46, 0.44, cz + 0.236, matRedD, shopG, false);
          cyl(0.012, 0.012, 0.04, sx + s * 0.08, 0.5, cz + 0.25, matGold, 8, shopG).rotation.x = Math.PI / 2;
          thai('candle', sx + s * 0.78, CAB_H + 0.02, cz + 0.05, { s: 0.55, cast: false, parent: shopG });
        }
        thai('incense', sx, CAB_H + 0.02, cz + 0.06, { s: 0.42, cast: false, parent: shopG });
        solids.push(hidBox(2.0, 1.4, 0.56, sx, 0.7, SHOP.z0 + 0.28));
        // the water dispenser, its blue bottle, the cups
        box(0.32, 1.0, 0.32, 3.95, 0.5, -6.6, matWhite, shopG);
        cyl(0.13, 0.13, 0.42, 3.95, 1.21, -6.6, new THREE.MeshStandardMaterial({ color: 0x7ab4e6, roughness: 0.15, transparent: true, opacity: 0.75 }), 16, shopG);
        solids.push(hidBox(0.36, 1.4, 0.36, 3.95, 0.7, -6.6));
        thai('standfan', 3.2, 0, -6.55, { s: 0.9, ry: -0.6, parent: shopG }); solids.push(hidBox(0.4, 1.2, 0.4, 3.2, 0.6, -6.55));   // (GF-7)
        // the back room's doorway on the right wall, a maroon curtain in it
        box(0.04, 2.15, 1.0, SHOP.x1 - 0.02, 1.075, -5.6, matWood, shopG, false);
        plane(0.92, 2.0, new THREE.MeshStandardMaterial({ color: 0x6a1420, roughness: 0.95, side: THREE.DoubleSide }), SHOP.x1 - 0.05, 1.0, -5.6, -Math.PI / 2, shopG);
      }


      /* v21.18 · GOLDEN MILE'S SHOPS, BUILT (Chad: "Now for the row of shops inside golden mile itself, these shops now
         look too basic, and they can all be improved much further with more detail"). Each neighbour was ONE painted
         plane — a band, a name, a few rectangles for goods — flat from every angle the shop's glass and the film's walk
         see it from. Each is a SHOP now: a recess 2.4 m deep with its back and side walls, a ceiling with its lit
         panels, a floor of its own; an aluminium front with glass and its doors folded open; a lightbox on a fascia
         over it; and inside and out what that kind of shop holds — a grocer's shelves, fridge and crates of fruit at the
         door, a travel agent's desk, brochures and A-board, a kitchen's counter, tables and menu, a massage parlour's
         recliners and curtain, a goldsmith's lit cases, a phone shop's counter and wall of cases, a money changer's
         rates, a coach agency's departures and luggage, a snack shop, a unit shuttered TO LET. Lit by World A's own
         light and by painted glows (no lamp: the v15.1 law); nothing casts or takes a shadow; and MERGED — a batch a
         material and the goods instanced, a dozen draws for the corridor. A bay is built in its own frame (x across it
         to the viewer's right, z out toward the corridor, its front at z 0) and the frame turns it to face its row's
         way. The film's podium on Beach Road takes the same builder (v21.19). */
      const SHOP_SIGNS = tex(makeMallSigns(THREE, cnv)), SHOP_POSTERS = tex(makeMallPosters(THREE, cnv));
      const SHOP_SEATED = [];      // the diners a row lists: seated further down, once the baked stills exist (sitterStill)
      const SIGN_CELL = (i) => [0.004, 1 - (i + 1) * 128 / 1280 + 0.004, 0.996, 1 - i * 128 / 1280 - 0.004];
      const POST_CELL = (i) => { const cx = i % 4, cy = Math.floor(i / 4); return [cx / 4 + 0.004, 1 - (cy + 1) / 4 + 0.004, (cx + 1) / 4 - 0.004, 1 - cy / 4 - 0.004]; };
      const PC = (k) => POST_CELL(MALL_POSTER[k]);
      /* a kind: its sign (a row of the signs' atlas), its walls, floor and light, how it is dressed, its goods' colours */
      const SHOP_KINDS = {
        travel:  { sign: 0, wall: 0xe6edf4, floor: 0xb9c0c8, lamp: 0xf4f8ff, dress: 'travel' },
        grocery: { sign: 1, wall: 0xf0efe6, floor: 0xc4c2b4, lamp: 0xf6fbff, dress: 'grocery', pal: [0xd8261c, 0xf2b81c, 0x2a8a3a, 0x1e5aa8, 0xe86a1a, 0xf4f0e6, 0x8a2ad8, 0xc8a46a] },
        snack:   { sign: 9, wall: 0xf6eedc, floor: 0xc8bca4, lamp: 0xfff6e6, dress: 'grocery', pal: [0xf2b81c, 0xe84a8a, 0xd8261c, 0x7ac83a, 0xf2783a, 0x8a4a2a, 0xfff2c8, 0x3ab4d8], noFridge: true },
        food:    { sign: 2, wall: 0xf4e6d0, floor: 0xa89a86, lamp: 0xfff2dc, dress: 'food' },
        massage: { sign: 3, wall: 0xf0d6c8, floor: 0x8a6a56, lamp: 0xffe6cc, dress: 'massage' },
        gold:    { sign: 4, wall: 0x8a1610, floor: 0xd8cfc0, lamp: 0xfff2d8, dress: 'gold' },
        phone:   { sign: 5, wall: 0xeef0f2, floor: 0xb4b8bc, lamp: 0xf0f6ff, dress: 'phone', pal: [0x1a1a1a, 0xe8e8e8, 0xd8261c, 0x1e5aa8, 0xf2b81c, 0x2a8a3a, 0xe84a8a, 0x8a2ad8] },
        money:   { sign: 7, wall: 0xe4ece6, floor: 0xb0b4ae, lamp: 0xf2fff6, dress: 'money' },
        tickets: { sign: 8, wall: 0xf4ecd8, floor: 0xb8b0a0, lamp: 0xfff8e8, dress: 'tickets' },
        shut:    { sign: 6, dress: 'shut' } };
      const _sm4 = new THREE.Matrix4(), _sq4 = new THREE.Quaternion(), _se4 = new THREE.Euler(0, 0, 0, 'YXZ'), _sv4 = new THREE.Vector3(), _ss4 = new THREE.Vector3(), _sn3 = new THREE.Matrix3(), _sc4 = new THREE.Color();
      /* a batch, World A's (buildStreet's shape): every piece posed in the current bay's frame, merged into one mesh */
      function shopBatch(parent) {
        const P = [], N = [], C = [], U = [], I = []; let FR = null;
        const B = {
          frame(m) { FR = m; return B; },
          add(geo, x, y, z, col, o = {}) {
            _se4.set(o.rx || 0, o.ry || 0, o.rz || 0, 'YXZ'); _sq4.setFromEuler(_se4);
            _sm4.compose(_sv4.set(x, y, z), _sq4, _ss4.set(1, 1, 1)).premultiply(FR); _sn3.getNormalMatrix(_sm4);
            _sc4.set(col);
            const pa = geo.attributes.position, na = geo.attributes.normal, ua = geo.attributes.uv, base = P.length / 3;
            for (let i = 0; i < pa.count; i++) {
              _sv4.fromBufferAttribute(pa, i).applyMatrix4(_sm4); P.push(_sv4.x, _sv4.y, _sv4.z);
              _sv4.fromBufferAttribute(na, i).applyMatrix3(_sn3).normalize(); N.push(_sv4.x, _sv4.y, _sv4.z);
              C.push(_sc4.r, _sc4.g, _sc4.b);
              if (o.cell) { const q = o.cell; U.push(q[0] + ua.getX(i) * (q[2] - q[0]), q[1] + ua.getY(i) * (q[3] - q[1])); }
              else U.push(ua.getX(i), ua.getY(i));
            }
            if (geo.index) for (let i = 0; i < geo.index.count; i++) I.push(base + geo.index.getX(i));
            else for (let i = 0; i < pa.count; i++) I.push(base + i);
            geo.dispose();
            return B;
          },
          box(w, h, d, x, y, z, col, o) { return B.add(new THREE.BoxGeometry(w, h, d), x, y, z, col, o); },
          quad(w, h, x, y, z, col, o) { return B.add(new THREE.PlaneGeometry(w, h), x, y, z, col, o); },
          cyl(r, h, x, y, z, col, o = {}) { return B.add(new THREE.CylinderGeometry(o.r1 ?? r, r, h, o.seg || 12), x, y, z, col, o); },
          build(mat) {
            if (!I.length) return null;
            const g = new THREE.BufferGeometry();
            g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
            g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
            g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3));
            g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2));
            g.setIndex(P.length / 3 > 65535 ? new THREE.Uint32BufferAttribute(I, 1) : new THREE.Uint16BufferAttribute(I, 1));
            g.computeBoundingSphere();
            const m = new THREE.Mesh(g, mat); m.castShadow = false; m.receiveShadow = false;
            parent.add(m); return m;
          },
        };
        return B;
      }
      /* a row of bays: [{ x, z, ry, kind, seed }], each a whole shop; o.H the ceiling it stands under (the fascia
         reaches it), o.fascia its colour, o.mats to share one set of materials between rows */
      function shopRow(parent, bays, o = {}) {
        const lit = shopBatch(parent), metal = shopBatch(parent), glow = shopBatch(parent), post = shopBatch(parent),
              bright = shopBatch(parent), sign = shopBatch(parent), glass = shopBatch(parent), shut = shopBatch(parent);
        const goods = [], cans = [], fruit = [], gold = [];
        const FR = new THREE.Matrix4(); let BAY = null;
        const HW = 1.94, D = 2.4, CH = 2.75, MH = o.H || 3.6, ALU = 0xc4c8cc, STEEL = 0x9aa0a6;
        const put = (list, x, y, z, sx, sy, sz, col, ry = 0, rx = 0) => {
          _se4.set(rx, ry, 0, 'YXZ'); _sq4.setFromEuler(_se4);
          list.push({ m: new THREE.Matrix4().compose(_sv4.set(x, y, z), _sq4, _ss4.set(sx, sy, sz)).premultiply(FR), col });
        };
        /* goods along a shelf board from u0 to u1 (x when along x, z when along z), standing on height y, against `back`
           (the wall side's coordinate): packets, cans and bottles, a little gap between, dealt from the bay's own stream */
        const stock = (rnd, pal, along, u0, u1, y, back, depth, face, maxH = 0.32) => {
          let u = u0 + 0.02;
          while (u < u1 - 0.06) {
            const kind = rnd(), col = pal[Math.floor(rnd() * pal.length)];
            if (kind < 0.55) {                                         // a packet or a box
              const w = 0.07 + rnd() * 0.1, h = Math.min(maxH, 0.1 + rnd() * 0.24), d = Math.min(depth - 0.04, 0.1 + rnd() * 0.12);
              if (u + w > u1) break;
              const c = back + face * (d / 2 + 0.02);
              if (along === 'x') put(goods, u + w / 2, y + h / 2, c, w, h, d, col); else put(goods, c, y + h / 2, u + w / 2, d, h, w, col);
              u += w + 0.012;
            } else {                                                   // a row of cans or bottles, front to back
              const tall = rnd() < 0.4, r = tall ? 0.034 : 0.032, h = tall ? Math.min(maxH, 0.26) : 0.12;
              for (let k = 0; k < 2; k++) {
                const c = back + face * (0.06 + k * 0.08);
                if (along === 'x') put(cans, u + r, y + h / 2, c, r * 2, h, r * 2, col); else put(cans, c, y + h / 2, u + r, r * 2, h, r * 2, col);
              }
              u += r * 2 + 0.01;
            }
          }
        };
        /* an open steel shelf unit against a wall: uprights, boards, stock on every board */
        const shelfX = (rnd, pal, x0, x1, zBack, depth, tiers) => {
          for (const x of [x0, x1]) metal.box(0.04, tiers[tiers.length - 1] + 0.1, depth, x, (tiers[tiers.length - 1] + 0.1) / 2, zBack + depth / 2, STEEL);
          tiers.forEach((y, i) => { metal.box(x1 - x0, 0.025, depth, (x0 + x1) / 2, y, zBack + depth / 2, i % 2 ? 0xd8dadc : 0xcfd2d6);
            if (i < tiers.length - 1) stock(rnd, pal, 'x', x0 + 0.03, x1 - 0.03, y + 0.013, zBack, depth, 1, Math.min(0.32, tiers[i + 1] - y - 0.06)); });
          lit.quad(x1 - x0, tiers[tiers.length - 1], (x0 + x1) / 2, tiers[tiers.length - 1] / 2, zBack + 0.004, 0xdedcd4);   // its back panel
        };
        const shelfZ = (rnd, pal, z0, z1, xBack, depth, tiers, face) => {     // face −1: against the right wall, facing −x
          for (const z of [z0, z1]) metal.box(depth, tiers[tiers.length - 1] + 0.1, 0.04, xBack + face * depth / 2, (tiers[tiers.length - 1] + 0.1) / 2, z, STEEL);
          tiers.forEach((y, i) => { metal.box(depth, 0.025, z1 - z0, xBack + face * depth / 2, y, (z0 + z1) / 2, i % 2 ? 0xd8dadc : 0xcfd2d6);
            if (i < tiers.length - 1) stock(rnd, pal, 'z', z0 + 0.03, z1 - 0.03, y + 0.013, xBack, depth, face, Math.min(0.32, tiers[i + 1] - y - 0.06)); });
        };
        const chair = (x, z, col, ry = 0) => {                           // a plastic chair: seat, back, four legs
          const c = Math.cos(ry), s = Math.sin(ry), at = (dx, dz) => [x + dx * c + dz * s, z - dx * s + dz * c];
          let p = at(0, 0); lit.box(0.42, 0.05, 0.42, p[0], 0.45, p[1], col, { ry });
          p = at(0, 0.2); lit.box(0.42, 0.4, 0.04, p[0], 0.68, p[1], col, { ry, rx: 0.12 });
          for (const [dx, dz] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) { p = at(dx, dz); metal.box(0.025, 0.44, 0.025, p[0], 0.22, p[1], 0x444444); }
        };
        const aBoard = (x, z, cell, frame = 0x2a2a2a) => {                  // an A-board on the corridor's floor
          lit.box(0.54, 0.86, 0.03, x, 0.44, z, frame, { rx: -0.16 });
          post.quad(0.48, 0.48, x, 0.56, z, 0xffffff, { rx: -0.16, cell });
          lit.box(0.54, 0.86, 0.03, x, 0.44, z - 0.14, frame, { rx: 0.16 });
        };
        const pot = (x, z, h = 0.34) => {                                  // a potted palm: a pot, a fan of leaves
          lit.cyl(0.15, h, x, h / 2, z, 0xa8582a, { r1: 0.19, seg: 12 });
          for (let k = 0; k < 7; k++) put(goods, x + Math.cos(k * 0.9) * 0.12, h + 0.32, z + Math.sin(k * 0.9) * 0.12, 0.05, 0.62, 0.16, 0x2f7a32, k * 0.9, 0.35);
        };
        const DRESS = {
          grocery(K, rnd) {
            shelfX(rnd, K.pal, -1.86, 1.86, -D + 0.02, 0.42, [0.1, 0.5, 0.9, 1.3, 1.7, 2.06]);
            shelfZ(rnd, K.pal, -1.92, -0.62, HW - 0.02, 0.36, [0.1, 0.48, 0.86, 1.24, 1.62], -1);
            if (!K.noFridge) {                                             // the drinks fridge on the left: open-fronted behind glass, lit inside
              const fx = -HW + 0.36, fz = -1.25;
              lit.box(0.05, 2.0, 0.64, -HW + 0.035, 1.0, fz, 0xe6e6e8);
              for (const s of [-1, 1]) lit.box(0.7, 2.0, 0.04, fx, 1.0, fz + s * 0.3, 0xe6e6e8);
              lit.box(0.7, 0.16, 0.64, fx, 0.08, fz, 0xe6e6e8); lit.box(0.72, 0.24, 0.66, fx, 2.12, fz, 0xc8201a);
              glow.quad(0.56, 1.72, -HW + 0.062, 1.02, fz, 0xdcecff, { ry: Math.PI / 2 });
              for (let r = 0; r < 4; r++) {
                metal.box(0.6, 0.02, 0.56, fx + 0.02, 0.28 + r * 0.43, fz, 0xd0d4d8);
                for (let k = 0; k < 6; k++) for (let j = 0; j < 2; j++) put(cans, -HW + 0.34 + j * 0.16, 0.42 + r * 0.43, fz - 0.22 + k * 0.088, 0.062, 0.25, 0.062, K.pal[(r * 3 + k + j) % K.pal.length]);
              }
              glass.quad(0.6, 1.76, -HW + 0.712, 1.02, fz, 0xffffff, { ry: Math.PI / 2 });
            } else shelfZ(rnd, K.pal, -1.92, -0.62, -HW + 0.02, 0.36, [0.1, 0.48, 0.86, 1.24, 1.62], 1);
            // the till by the door
            lit.box(0.86, 0.95, 0.46, 1.25, 0.475, -0.5, 0xd8d0c0); lit.box(0.92, 0.04, 0.52, 1.25, 0.97, -0.5, 0x3a3a3a);
            lit.box(0.3, 0.16, 0.22, 1.2, 1.07, -0.55, 0x1a1a1a); glow.quad(0.2, 0.1, 1.2, 1.12, -0.437, 0x7ad8ff);
            // at the door: produce in crates on a stepped stand, sacks of rice
            lit.box(1.5, 0.42, 0.5, -1.0, 0.21, 0.4, 0x6a4a2a); lit.box(1.5, 0.3, 0.32, -1.0, 0.57, 0.3, 0x6a4a2a);
            const cr = [[-1.37, 0.47, 0.5, 0xf2b81c], [-0.63, 0.47, 0.5, 0x6ab42a], [-1.37, 0.77, 0.3, 0xd8201a], [-0.63, 0.77, 0.3, 0xf28a1c]];
            for (const [x, y, z, col] of cr) {
              lit.box(0.66, 0.14, 0.32, x, y, z, rnd() < 0.5 ? 0x2a6a3a : 0x9a6a3a);
              for (let k = 0; k < 18; k++) put(fruit, x - 0.27 + (k % 6) * 0.11 + rnd() * 0.02, y + 0.08 + (k > 11 ? 0.06 : 0), z - 0.1 + Math.floor(k / 6) % 2 * 0.1, 0.1, 0.09, 0.1, col);
            }
            for (let k = 0; k < 3; k++) { lit.box(0.44, 0.22, 0.62, 1.32, 0.11 + k * 0.22, 0.36, 0xf4f0e2, { ry: k * 0.08 }); }
            post.quad(0.4, 0.3, 1.32, 0.55, 0.672, 0xffffff, { cell: PC('rice') });
            post.quad(0.5, 0.5, -1.3, 1.5, -0.025, 0xffffff, { cell: PC('noodles') });
          },
          travel(K, rnd) {
            lit.box(2.3, 0.75, 0.6, -0.15, 0.375, -1.78, 0xe8eef4); lit.box(2.4, 0.04, 0.66, -0.15, 0.77, -1.78, 0x2a4a7a);
            for (const x of [-0.75, 0.45]) { lit.box(0.5, 0.33, 0.04, x, 1.04, -1.9, 0x121214); glow.quad(0.46, 0.29, x, 1.04, -1.878, 0x9ad0ff); metal.box(0.04, 0.12, 0.04, x, 0.85, -1.9, 0x333333); }
            chair(-0.75, -2.15, 0x2a2a2e, Math.PI); chair(-0.6, -1.12, 0x1e5aa8); chair(0.45, -1.12, 0x1e5aa8);
            [['bangkok', -1.2], ['phuket', 0], ['hatyai', 1.2]].forEach(([k, x]) => { lit.box(0.68, 0.68, 0.02, x, 1.78, -D + 0.012, 0xf2f2f2); post.quad(0.62, 0.62, x, 1.78, -D + 0.024, 0xffffff, { cell: PC(k) }); });
            // the brochure rack on the right wall, the departures on the left
            lit.box(0.04, 1.2, 1.1, HW - 0.04, 1.3, -1.0, 0xd8d8d8);
            for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) put(goods, HW - 0.09, 0.86 + r * 0.29, -1.38 + k * 0.25, 0.03, 0.22, 0.16, [0x1e5aa8, 0xf2b81c, 0xd8261c, 0x2a8a3a, 0xe84a8a][(r + k * 2) % 5], 0, 0.18);
            bright.quad(0.9, 0.9, -HW + 0.02, 1.6, -1.2, 0xffffff, { ry: Math.PI / 2, cell: PC('timetable') });
            aBoard(1.3, 0.55, PC('coach'));
            // a brochure stand at the door
            metal.box(0.04, 1.2, 0.04, -1.35, 0.6, 0.42, 0x555555); metal.box(0.4, 0.03, 0.3, -1.35, 0.02, 0.42, 0x555555);
            for (let k = 0; k < 3; k++) put(goods, -1.35, 0.55 + k * 0.28, 0.5, 0.36, 0.22, 0.03, [0x2a8a3a, 0x1e5aa8, 0xe86a1a][k], 0, -0.2);
            post.quad(0.48, 0.48, 1.32, 1.45, -0.025, 0xffffff, { cell: PC('phuket') });
          },
          food(K, rnd) {
            metal.box(3.72, 0.92, 0.62, 0, 0.46, -D + 0.33, 0xc0c4c8); metal.box(3.76, 0.04, 0.66, 0, 0.94, -D + 0.33, 0xdadde0);
            for (let k = 0; k < 4; k++) put(cans, -1.3 + k * 0.85, 1.08, -D + 0.3, 0.32, 0.26, 0.32, 0xb8bcc0);         // the pots
            glass.quad(3.6, 0.3, 0, 1.12, -D + 0.66, 0xffffff);
            for (let k = 0; k < 6; k++) put(goods, -1.5 + k * 0.6, 0.985, -D + 0.52, 0.42, 0.05, 0.22, [0xd8501c, 0xe8c040, 0x3a8a2a, 0x7a3a1a, 0xc8642a, 0xf0e0b0][k]);
            bright.quad(1.5, 0.75, -0.55, 1.88, -D + 0.012, 0xffffff, { cell: PC('menu') });
            post.quad(0.8, 0.8, 1.15, 1.85, -D + 0.012, 0xffffff, { cell: PC('tomyum') });
            for (const x of [-0.95, 0.85]) {                               // two tables, stools round them
              lit.box(0.64, 0.03, 0.64, x, 0.74, -1.05, 0xe6dcc8); metal.box(0.05, 0.72, 0.05, x, 0.37, -1.05, 0x6a6a6a); metal.box(0.4, 0.02, 0.4, x, 0.01, -1.05, 0x6a6a6a);
              for (const [dx, dz] of [[-0.45, 0], [0.45, 0], [0, 0.42]]) lit.cyl(0.15, 0.45, x + dx, 0.225, -1.05 + dz, (dx + dz) > 0 ? 0xd8261c : 0x1e5aa8, { r1: 0.13 });
            }
            /* two at lunch, one at each table, turned to it (real seated people baked to a still — the v21.16 rule; a
               phone seats the one) */
            const dine = (who, lx, lz, fx, fz, low) => {
              const v = new THREE.Vector3(lx, 0.45, lz).applyMatrix4(FR);
              SHOP_SEATED.push({ who, parent, x: v.x, y: v.y, z: v.z, ry: (BAY.ry || 0) + Math.atan2(fx, fz), low });
            };
            dine('sitman', -1.4, -1.05, 1, 0, true);
            dine('sitwoman', 1.3, -1.05, -1, 0, false);
            // outside: a table for two and the menu on an easel
            lit.box(0.6, 0.03, 0.6, -1.25, 0.74, 0.5, 0xe6dcc8); metal.box(0.05, 0.72, 0.05, -1.25, 0.37, 0.5, 0x6a6a6a);
            for (const dx of [-0.42, 0.42]) lit.cyl(0.15, 0.45, -1.25 + dx, 0.225, 0.5, 0x1e5aa8, { r1: 0.13 });
            aBoard(1.32, 0.5, PC('menu'), 0x5a2a0a);
            post.quad(0.46, 0.46, 1.32, 1.5, -0.025, 0xffffff, { cell: PC('tomyum') });
          },
          massage(K, rnd) {
            lit.box(1.0, 0.95, 0.46, 1.28, 0.475, -0.62, 0x6a2a3a); lit.box(1.06, 0.04, 0.52, 1.28, 0.97, -0.62, 0xe8d8c8);
            lit.cyl(0.07, 0.14, 1.45, 1.06, -0.62, 0xf4f2ee);                                                                    // an orchid on the desk
            for (let k = 0; k < 6; k++) put(fruit, 1.45 + Math.sin(k) * 0.08, 1.25 + k * 0.05, -0.62 + Math.cos(k) * 0.05, 0.07, 0.05, 0.07, k % 2 ? 0xd85aa8 : 0xf4e6f4);
            for (const x of [-1.25, -0.12]) {                               // two foot-massage recliners
              lit.box(0.64, 0.36, 1.0, x, 0.18, -1.72, 0x4a1414); lit.box(0.62, 0.12, 0.6, x, 0.42, -1.82, 0x7a2424);
              lit.box(0.62, 0.78, 0.14, x, 0.78, -2.18, 0x7a2424, { rx: -0.34 });
              for (const s of [-1, 1]) lit.box(0.1, 0.2, 0.62, x + s * 0.33, 0.56, -1.86, 0x4a1414);
              lit.box(0.4, 0.3, 0.4, x, 0.15, -0.92, 0x7a2424); put(goods, x, 0.31, -0.92, 0.36, 0.02, 0.36, 0xf2f0ea);
            }
            metal.box(1.5, 0.03, 0.03, 1.15, 2.28, -1.45, 0xc8b89a);        // the curtain on its rail
            for (let k = 0; k < 8; k++) lit.box(0.19, 2.04, 0.02, 0.48 + k * 0.19, 1.24, -1.45 + (k % 2) * 0.05, 0xd8b88a, { ry: k % 2 ? 0.32 : -0.32 });
            post.quad(0.7, 0.7, -0.7, 1.72, -D + 0.012, 0xffffff, { cell: PC('massage') });
            lit.box(0.66, 0.66, 0.02, 0.62, 1.78, -D + 0.012, 0xc89a3a); post.quad(0.6, 0.6, 0.62, 1.78, -D + 0.024, 0xffffff, { cell: PC('elephant') });
            // outside: the price list on an easel, a palm
            for (const s of [-1, 1]) metal.box(0.03, 1.3, 0.03, -1.3 + s * 0.22, 0.62, 0.52, 0x5a3a1a, { rz: s * -0.12 });
            post.quad(0.52, 0.52, -1.3, 1.02, 0.56, 0xffffff, { rx: -0.12, cell: PC('massage') });
            pot(1.55, 0.38);
          },
          gold(K, rnd) {
            const cases = [[0, -1.98, 3.5, 0.55], [-1.58, -1.12, 0.5, 1.0], [1.58, -1.12, 0.5, 1.0]];
            for (const [x, z, w, d] of cases) {                              // the lit glass cases: a red base, a bright bed, gold on it, glass over
              lit.box(w, 0.86, d, x, 0.43, z, 0x5a0a08); glow.quad(w - 0.06, d - 0.06, x, 0.865, z, 0xfff0c8, { rx: -Math.PI / 2 });
              glass.box(w, 0.3, d, x, 1.02, z, 0xffffff);
              metal.box(w + 0.02, 0.025, d + 0.02, x, 1.18, z, 0xd8b04a);
              const n = Math.round(w * d * 26);
              for (let k = 0; k < n; k++) {
                const gx = x + (rnd() - 0.5) * (w - 0.12), gz = z + (rnd() - 0.5) * (d - 0.12);
                if (rnd() < 0.5) put(gold, gx, 0.885, gz, 0.11, 0.015, 0.11, 0xffc84a, rnd() * 3); else put(gold, gx, 0.9, gz, 0.04, 0.05, 0.16, 0xffd86a, rnd() * 3);
              }
            }
            lit.box(1.0, 1.0, 0.02, 0, 1.78, -D + 0.012, 0xd8a83a); bright.quad(0.92, 0.92, 0, 1.78, -D + 0.024, 0xffffff, { cell: PC('goldrate') });
            lit.box(0.6, 0.9, 0.55, -1.5, 0.45, -2.05, 0x3a3a3c); metal.box(0.08, 0.08, 0.04, -1.45, 0.6, -1.76, 0xd8b04a);   // the safe
            for (const x of [-1.2, 1.2]) put(fruit, x, 2.35, -1.2, 0.26, 0.32, 0.26, 0xd8201a);                                // two red lanterns
            for (const s of [-1, 1]) for (let k = 0; k < 6; k++) metal.box(0.025, 2.2, 0.025, s * (HW - 0.12 - k * 0.06), 1.1, -0.06, 0x8a8e92);   // the grille, folded back
          },
          phone(K, rnd) {
            lit.box(2.6, 0.95, 0.5, -0.4, 0.475, -1.22, 0x2a2a2e); glass.box(2.6, 0.04, 0.5, -0.4, 0.97, -1.22, 0xffffff);
            for (let k = 0; k < 9; k++) { const x = -1.55 + k * 0.29; put(goods, x, 0.93, -1.22, 0.075, 0.012, 0.15, 0x111111, 0.1); glow.quad(0.06, 0.12, x, 0.937, -1.22, [0x3a9ae8, 0xe84a8a, 0x3ad88a][k % 3], { rx: -Math.PI / 2, rz: 0.1 }); }
            lit.box(3.6, 1.62, 0.03, 0, 1.46, -D + 0.016, 0xdcdcd4);                                                          // the wall of cases
            for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) put(goods, -1.47 + c * 0.42, 0.86 + r * 0.25, -D + 0.05, 0.13, 0.2, 0.025, K.pal[(r * 5 + c * 3) % K.pal.length]);
            lit.box(0.04, 0.52, 0.88, HW - 0.04, 1.95, -1.4, 0x111111); glow.quad(0.82, 0.46, HW - 0.065, 1.95, -1.4, 0x3a8ae8, { ry: -Math.PI / 2 });
            chair(-0.4, -1.9, 0x2a2a2e, Math.PI);
            aBoard(1.32, 0.5, PC('sim'), 0x0a1a4a);
            post.quad(0.46, 0.46, -1.32, 1.45, -0.025, 0xffffff, { cell: PC('sim') });
          },
          money(K, rnd) {
            lit.box(3.8, 1.02, 0.5, 0, 0.51, -0.95, 0x1e3a2e); lit.box(3.84, 0.04, 0.56, 0, 1.04, -0.95, 0xc8ccc4);
            glass.quad(3.8, 1.2, 0, 1.66, -0.95, 0xffffff); metal.box(3.84, 0.04, 0.04, 0, 2.27, -0.95, ALU);
            for (const x of [-1.0, 1.0]) { lit.box(0.4, 0.06, 0.24, x, 1.07, -0.85, 0x2a2a2a); metal.box(0.03, 1.2, 0.03, x * 0.5, 1.66, -0.95, ALU); }
            bright.quad(1.5, 1.5, 0.3, 1.55, -D + 0.012, 0xffffff, { cell: PC('rates') });
            lit.box(0.6, 0.9, 0.55, -1.45, 0.45, -2.05, 0x3a3a3c);
            post.quad(0.4, 0.4, -1.35, 1.6, -0.025, 0xffffff, { cell: PC('rates') });     // (on the left pane: on the right it stood over the big board)
          },
          tickets(K, rnd) {
            lit.box(1.9, 0.95, 0.56, -0.7, 0.475, -1.6, 0xd8261c); lit.box(1.96, 0.04, 0.6, -0.7, 0.97, -1.6, 0xf4f0e6);
            lit.box(0.48, 0.32, 0.04, -0.9, 1.12, -1.75, 0x121214); glow.quad(0.44, 0.28, -0.9, 1.12, -1.728, 0x9ad0ff);
            chair(-0.7, -2.05, 0x2a2a2e, Math.PI); chair(-0.9, -0.95, 0xd8261c);
            bright.quad(1.2, 1.2, 0.95, 1.7, -D + 0.012, 0xffffff, { cell: PC('timetable') });
            post.quad(0.7, 0.7, -0.8, 1.85, -D + 0.012, 0xffffff, { cell: PC('coach') });
            post.quad(0.6, 0.6, -HW + 0.012, 1.7, -0.9, 0xffffff, { ry: Math.PI / 2, cell: PC('hatyai') });
            lit.box(0.42, 0.62, 0.24, 1.3, 0.31, -0.55, 0x2a4a8a); metal.box(0.2, 0.2, 0.02, 1.3, 0.72, -0.55, 0x333333);        // luggage, waiting
            lit.box(0.38, 0.55, 0.22, 1.62, 0.275, -0.85, 0x8a2a2a);
            for (let k = 0; k < 3; k++) lit.box(0.5, 0.36, 0.4, -1.55 + (k % 2) * 0.06, 0.18 + k * 0.36, -0.45, 0xb88a5a, { ry: k * 0.1 });
            aBoard(-1.3, 0.55, PC('hatyai'), 0x8e0e08);
            post.quad(0.46, 0.46, 1.32, 1.5, -0.025, 0xffffff, { cell: PC('coach') });
          },
        };
        for (const bay of bays) {
          FR.makeRotationY(bay.ry || 0).setPosition(bay.x, 0, bay.z); BAY = bay;
          for (const b of [lit, metal, glow, post, bright, sign, glass, shut]) b.frame(FR);
          const K = SHOP_KINDS[bay.kind], rnd = rng(bay.seed || 2118);
          // the fascia over the front and its lightbox (every bay, the shut one's long dark)
          lit.quad(2 * HW + 0.24, MH - CH, 0, CH + (MH - CH) / 2, 0.004, o.fascia || 0xe2d8c6);
          lit.box(3.74, 0.64, 0.12, 0, CH + 0.43, 0.064, 0x1c1c1e);
          sign.quad(3.64, 0.56, 0, CH + 0.43, 0.126, K.dress === 'shut' || bay.closed ? 0x8a8a8a : 0xffffff, { cell: SIGN_CELL(K.sign) });
          if (K.dress === 'shut' || bay.closed) {                          // a roller shutter down, a poster on it
            shut.quad(2 * HW, CH, 0, CH / 2, -0.02, 0xcfd2d0);
            lit.box(2 * HW, 0.2, 0.24, 0, CH - 0.1, -0.06, 0x5c6066);
            if (K.dress === 'shut') {                                      // (World S: a shop only closed for the night has no TO LET)
              post.quad(0.62, 0.62, 0.7, 1.45, -0.012, 0xffffff, { cell: PC('tolet') });
              post.quad(0.5, 0.5, -0.9, 1.3, -0.012, 0xf0e8e0, { cell: PC('calendar'), rz: 0.04 });
            }
            continue;
          }
          // the shell: floor, back and side walls, ceiling and its lit panels, the skirting
          lit.quad(2 * HW, D, 0, 0.006, -D / 2, K.floor, { rx: -Math.PI / 2 });
          lit.quad(2 * HW, CH, 0, CH / 2, -D, K.wall);
          lit.quad(D, CH, -HW, CH / 2, -D / 2, K.wall, { ry: Math.PI / 2 });
          lit.quad(D, CH, HW, CH / 2, -D / 2, K.wall, { ry: -Math.PI / 2 });
          lit.quad(2 * HW, D, 0, CH, -D / 2, 0xeeece6, { rx: Math.PI / 2 });
          for (const sx of [-0.95, 0.95]) glow.quad(0.56, 1.12, sx, CH - 0.008, -D * 0.52, K.lamp, { rx: Math.PI / 2 });
          lit.box(2 * HW, 0.09, 0.012, 0, 0.045, -D + 0.006, 0x5a5450);
          // the front: aluminium posts, the door's mullions, a transom, a sill; glass in the sides and over the door
          for (const s of [-1, 1]) metal.box(0.07, CH, 0.09, s * (HW - 0.035), CH / 2, 0, ALU);
          for (const s of [-1, 1]) metal.box(0.05, 2.25, 0.08, s * 0.6, 1.125, 0, ALU);
          metal.box(2 * HW, 0.06, 0.09, 0, 2.25, 0, ALU); metal.box(2 * HW, 0.05, 0.1, 0, 0.025, 0, ALU);
          for (const s of [-1, 1]) glass.quad(HW - 0.66, 2.16, s * (0.6 + (HW - 0.6) / 2), 1.13, -0.012, 0xffffff);
          glass.quad(2 * HW - 0.1, 0.42, 0, 2.5, -0.012, 0xffffff);
          /* the two door leaves folded back into the shop: glass in an aluminium FRAME — two stiles, a head rail, a kick
             rail and a pull bar on each face (the first build drew each leaf as one solid aluminium slab, and every front
             read as two grey boards standing in its doorway) */
          for (const s of [-1, 1]) {
            const lx = s * 0.57;
            for (const z of [-0.06, -0.56]) metal.box(0.035, 2.18, 0.045, lx, 1.11, z, ALU);
            metal.box(0.035, 0.07, 0.54, lx, 2.165, -0.31, ALU); metal.box(0.035, 0.18, 0.54, lx, 0.11, -0.31, ALU);
            for (const f of [-1, 1]) {
              metal.box(0.018, 0.46, 0.018, lx + f * 0.05, 1.08, -0.47, 0xdfe2e4);
              for (const y of [0.88, 1.28]) metal.box(0.04, 0.014, 0.014, lx + f * 0.03, y, -0.47, 0xdfe2e4);
            }
            glass.quad(0.5, 2.1, lx, 1.11, -0.31, 0xffffff, { ry: s * Math.PI / 2 });
          }
          lit.box(1.1, 0.012, 0.56, 0, 0.012, -0.34, 0x34302e);          // the doormat
          DRESS[K.dress](K, rnd);
        }
        // built: one mesh a material, the goods instanced (a material nothing ended up using is let go at once)
        const M = {
          lit: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.78 }),
          metal: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.32, metalness: 0.55 }),
          glow: new THREE.MeshBasicMaterial({ vertexColors: true }),
          post: new THREE.MeshStandardMaterial({ map: SHOP_POSTERS, vertexColors: true, roughness: 0.55, emissive: 0xffffff, emissiveMap: SHOP_POSTERS, emissiveIntensity: 0.22 }),
          bright: new THREE.MeshBasicMaterial({ map: SHOP_POSTERS, vertexColors: true }),
          sign: new THREE.MeshBasicMaterial({ map: SHOP_SIGNS, vertexColors: true }),
          glass: new THREE.MeshStandardMaterial({ color: 0xdfeaf0, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide }),
          shut: (() => { const t = tex(makeShutter(THREE, cnv)); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 2.6); return new THREE.MeshStandardMaterial({ map: t, vertexColors: true, roughness: 0.6, metalness: 0.3 }); })(),
          goods: new THREE.MeshStandardMaterial({ roughness: 0.55 }),
          gold: new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.6, emissive: 0x5a3a08, emissiveIntensity: 0.55 }) };
        const out = [lit.build(M.lit), metal.build(M.metal), glow.build(M.glow), post.build(M.post),
                     bright.build(M.bright), sign.build(M.sign), glass.build(M.glass), shut.build(M.shut)];
        const inst = (list, geo, mat) => {
          if (!list.length) { geo.dispose(); return null; }
          const im = new THREE.InstancedMesh(geo, mat, list.length);
          list.forEach((g, i) => { im.setMatrixAt(i, g.m); im.setColorAt(i, _sc4.set(g.col)); });
          im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true;
          im.computeBoundingSphere(); im.castShadow = false; im.receiveShadow = false; parent.add(im); return im;
        };
        out.push(inst(goods, new THREE.BoxGeometry(1, 1, 1), M.goods),
                 inst(cans, new THREE.CylinderGeometry(0.5, 0.5, 1, 10), M.goods),
                 inst(fruit, new THREE.SphereGeometry(0.5, 10, 8), M.goods),
                 inst(gold, new THREE.BoxGeometry(1, 1, 1), M.gold));
        const used = new Set(out.filter(Boolean).map(m => m.material));
        for (const m of Object.values(M)) if (!used.has(m)) m.dispose();
        return out.filter(Boolean);
      }

      /* ============================================== THE MALL, past the glass
         Golden Mile Complex's corridor (v21.2: Chad names the mall): terrazzo, a
         low ceiling of fluorescent troughs, square columns clad in tile, the
         neighbours' fronts on both sides. Nothing out here is walkable in
         play — it is what the glass looks onto, and the film's way in. */
      {
        const W = MALL.x1 - MALL.x0, D = MALL.z1 - MALL.z0, mz = (MALL.z0 + MALL.z1) / 2;
        const fl = new THREE.Mesh(new THREE.PlaneGeometry(W, D), matTerr); fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0, mz); fl.receiveShadow = true; mallG.add(fl);
        /* the ceiling runs 0.3 m into both walls, and a solid wall stands behind the far side's shopfronts: the fronts
           are 2.95 m planes under a 3.6 m ceiling, and the first film's walk showed the SKY over every one of them */
        const ce = new THREE.Mesh(new THREE.PlaneGeometry(W, D + 0.6), matMallCeil); ce.rotation.x = Math.PI / 2; ce.position.set(0, MALL.H, mz); mallG.add(ce);
        box(W, MALL.H, 0.2, 0, MALL.H / 2, MALL.z1 + 2.55, matWallB, mallG, false);   // (v21.18: behind the far side's shops, which are built now)
        const matTubeOff = new THREE.MeshStandardMaterial({ color: 0x8a8e92, roughness: 0.5 });       // (World S: after hours, every other one off)
        for (let i = 0; i < 7; i++) { const t = box(2.4, 0.04, 0.12, -12 + i * 4, MALL.H - 0.02, mz, i % 2 ? matTubeOff : matTube, mallG, false); t.castShadow = false; }
        /* the neighbours (v21.18: BUILT, shopRow above — they were one painted plane each): across the corridor
           facing it (−z), the shop's glass looking onto the kitchen, the massage parlour and the goldsmith; and on our
           side facing +z, the film's walk passing the coach agency and the money changer */
        shopRow(mallG, [                                                   // (World S: `closed` — every one shut for the night)
          { x: -12, z: MALL.z1, ry: Math.PI, kind: 'travel', seed: 11, closed: true }, { x: -8, z: MALL.z1, ry: Math.PI, kind: 'grocery', seed: 12 },   // (CP9: open, behind its own shutter below)
          { x: -4, z: MALL.z1, ry: Math.PI, kind: 'food', seed: 13, closed: true },    { x: 0, z: MALL.z1, ry: Math.PI, kind: 'massage', seed: 14, closed: true },
          { x: 4, z: MALL.z1, ry: Math.PI, kind: 'gold', seed: 15, closed: true },     { x: 8, z: MALL.z1, ry: Math.PI, kind: 'phone', seed: 16, closed: true },
          { x: 12, z: MALL.z1, ry: Math.PI, kind: 'shut', seed: 17 },
          { x: -11.5, z: MALL.z0, ry: 0, kind: 'shut', seed: 21 },                     { x: -7.5, z: MALL.z0, ry: 0, kind: 'snack', seed: 22, closed: true },
          { x: 7.5, z: MALL.z0, ry: 0, kind: 'money', seed: 23, closed: true },        { x: 11.5, z: MALL.z0, ry: 0, kind: 'tickets', seed: 24, closed: true }]);
        /* (CP9) the GROCER'S, open behind a roller shutter of its own — down in play like every neighbour's, and rolled down
           on the opening film's walk as he passes: the one neighbour still closing up. The neighbours' own shutter, by its
           numbers (the texture's repeat, the colour, the roller box); rolled by its height, the slats riding its foot */
        { const tS = tex(makeShutter(THREE, cnv)); tS.wrapS = tS.wrapT = THREE.RepeatWrapping; tS.repeat.set(4, 2.6);
          grocerShutter = new THREE.Mesh(new THREE.PlaneGeometry(3.88, 2.75), new THREE.MeshStandardMaterial({ map: tS, color: 0xcfd2d0, roughness: 0.6, metalness: 0.3 }));
          grocerShutter.rotation.y = Math.PI; grocerShutter.position.set(-8, 2.75 / 2, MALL.z1 + 0.02); mallG.add(grocerShutter);
          box(3.88, 0.2, 0.24, -8, 2.75 - 0.1, MALL.z1 + 0.06, new THREE.MeshStandardMaterial({ color: 0x5c6066, roughness: 0.5 }), mallG, false); }
        // the piers between the far side's shops, and on our side the wall where no shop is
        for (let i = 1; i < 7; i++) box(0.2, MALL.H, 0.3, MALL.x0 + i * 4, MALL.H / 2, MALL.z1 + 0.06, matWallB, mallG, false);
        for (const s of [-1, 1]) {
          box(1.05, MALL.H, 0.2, s * 5.035, MALL.H / 2, -0.14, matWallB, mallG, false);   // (v22.3: its end 1 cm inside the shop's side wall, whose face it shared)
          box(0.2, MALL.H, 0.3, s * 9.5, MALL.H / 2, -0.1, matWallB, mallG, false);
          box(0.56, MALL.H, 0.2, s * 13.72, MALL.H / 2, -0.14, matWallB, mallG, false);
        }
        box(SHOP.x1 - SHOP.x0, MALL.H - SHOP.H, 0.2, 0, SHOP.H + (MALL.H - SHOP.H) / 2, 0.04, matWallB, mallG, false);
        for (const s of [-1, 1]) box(0.2, MALL.H, D + 0.4, s * MALL.x1, MALL.H / 2, mz, matWallB, mallG, false);
        /* v21.18 · THE CORRIDOR'S END, where the film's walk looks (on a phone, the middle of the picture: it was a bare
           wall): a lift lobby — two lift doors in steel frames, a floor lamp over each, the call buttons — the mall's
           directory between them, and the green EXIT hung from the ceiling before it */
        /* (CP13, the films' second vision review: chapter 5's walk goes the OTHER way, out of this lobby toward +x, and
           for its first five seconds a phone's frame held the far end — a bare wall. A second lobby stands there now, the
           first one mirrored: a mall has lifts at both ends of a corridor) */
        { const steel = new THREE.MeshStandardMaterial({ color: 0xc2c8ce, roughness: 0.26, metalness: 0.55 }),
                frameS = new THREE.MeshStandardMaterial({ color: 0x8c9298, roughness: 0.35, metalness: 0.5 }),
                lamp = new THREE.MeshBasicMaterial({ color: 0xffb648 }), dark = new THREE.MeshStandardMaterial({ color: 0x15171a, roughness: 0.5 }),
                dirM = new THREE.MeshBasicMaterial({ map: tex(makeMallDirectory(THREE, cnv)), color: 0xe6e6e6 }),
                exitM = new THREE.MeshBasicMaterial({ map: tex(makeExitSign(THREE, cnv)) }),
                exitBox = new THREE.MeshStandardMaterial({ color: 0xe8e8e2, roughness: 0.5 });
          for (const e of [1, -1]) {                                    // e: the way into the corridor from that end's wall
            const ex = -e * (MALL.x1 - 0.1);                            // the end wall's inner face
            for (const z of [1.05, 3.95]) {
              box(0.06, 2.42, 1.3, ex + e * 0.03, 1.21, z, frameS, mallG, false);
              for (const sd of [-1, 1]) box(0.04, 2.24, 0.56, ex + e * 0.08, 1.12, z + sd * 0.285, steel, mallG, false);
              box(0.05, 0.02, 0.012, ex + e * 0.1, 1.12, z, dark, mallG, false);
              box(0.04, 0.18, 0.52, ex + e * 0.05, 2.62, z, dark, mallG, false); plane(0.16, 0.08, lamp, ex + e * 0.075, 2.62, z, e * Math.PI / 2, mallG);
              box(0.03, 0.26, 0.11, ex + e * 0.05, 1.12, z + (z < 2.5 ? 0.82 : -0.82), frameS, mallG, false);
              for (const y of [1.07, 1.17]) plane(0.034, 0.034, lamp, ex + e * 0.068, y, z + (z < 2.5 ? 0.82 : -0.82), e * Math.PI / 2, mallG);
            }
            box(0.05, 1.5, 1.0, ex + e * 0.025, 1.5, 2.5, dark, mallG, false);
            plane(0.92, 1.38, dirM, ex + e * 0.055, 1.5, 2.5, e * Math.PI / 2, mallG);
            box(0.08, 0.3, 0.7, ex + e * 1.6, MALL.H - 0.42, 2.5, exitBox, mallG, false);
            for (const sd of [-1, 1]) plane(0.64, 0.24, exitM, ex + e * 1.6 + sd * 0.041, MALL.H - 0.42, 2.5, sd * Math.PI / 2, mallG);
            for (const sd of [-0.25, 0.25]) box(0.012, 0.27, 0.012, ex + e * 1.6, MALL.H - 0.135, 2.5 + sd, frameS, mallG, false);
          }
        }
        // the shop's own lightbox over its front
        const lbM = new THREE.MeshBasicMaterial({ map: tex(makeLightbox(THREE, cnv)) });
        plane(4.2, 0.6, lbM, 0, SHOP.H + 0.36, 0.15, 0, mallG);
        // two columns clad in small tiles
        for (const s of [-1, 1]) box(0.6, MALL.H, 0.6, s * 7.0, MALL.H / 2, 3.2, new THREE.MeshStandardMaterial({ color: 0xcfc6b4, roughness: 0.6 }), mallG);
        /* (v21.2: the HAPPY VESAK DAY banner that hung across the corridor is gone — Buddha Day is an uposatha day) */
      }

      return { shopG, mallG, SHOP, MALL, DOOR, LCNT, RCNT, ALTAR, OWN, LPT, MSTR, CLOCK, lpCase, clockTo, flames, doorLeaves, grocerShutter };
    }
    const SH = buildShop();

    /* ============================================== THE COUNTER (CP5, §4.0b)
       On the owner's glass between him and the player: the red bundle and — once he has opened it — its cloth with the
       three on it, the old auntie's music box, his card and pen, then the paper bag. Each is SET DOWN the way chapter 4's
       owner set the Hanuman on its stand (e3c4's standShow): a beat into his line it rises the last 5 cm into its place
       and grows from 0.6 to its size in about a fifth of a second. His takes never bring his hands to the glass, so a
       thing he puts down arrives on his words; nothing is ever seen to slide across the counter by itself. */
    function mkSet(obj, s0 = 1) {
      const S = { obj, to: 0, k: 0, y0: obj ? obj.position.y : 0, s0 };
      cntLive.sets.push(S);
      if (obj) setDraw(S);
      return S;
    }
    function setDraw(S) {
      if (!S || !S.obj) return;
      const e = smooth(S.k);
      S.obj.visible = S.k > 0.002;
      S.obj.position.y = S.y0 - 0.05 * (1 - e);
      S.obj.scale.setScalar(S.s0 * (0.6 + 0.4 * e));
    }
    function setShow(S, on, now) { if (!S) return; S.to = on ? 1 : 0; if (now) S.k = S.to; setDraw(S); }
    function setsTick(wdt) {
      for (const S of cntLive.sets) {
        if (S.k === S.to) continue;
        S.k += (S.to - S.k) * (1 - Math.exp(-wdt / 0.16));
        if (Math.abs(S.to - S.k) < 0.003) S.k = S.to;
        setDraw(S);
      }
    }
    function buildCounter() {
      const G = SH.shopG, T = CNT.y;
      const mCloth = M({ map: tex(makeRedClothT(THREE, cnv)), roughness: 0.5 });
      const mSilk = M({ map: tex(makeRedClothT(THREE, cnv, false)), roughness: 0.45 });   // (the bundle's: by photograph, the border wrapped round a ball read as a striped sack)
      /* THE BUNDLE: the red silk drawn up round the three and knotted on top — a squashed sphere flattened where it sits
         on the glass, its folds gathered toward the knot, two ears of the knot standing up */
      {
        const g = new THREE.Group(); g.position.set(CNT.x, T, CNT.z); G.add(g);
        const geo = new THREE.SphereGeometry(1, 30, 20), p = geo.attributes.position, v = new THREE.Vector3();
        for (let i = 0; i < p.count; i++) {
          v.fromBufferAttribute(p, i);
          /* (CP13, the counter's vision review: with folds of 6 % it read as a smooth red balloon — deeper folds, and the
             cloth GATHERED toward the knot, narrowing over its top third, so it is silk drawn up and tied) */
          const th = Math.atan2(v.z, v.x), up = cl01((v.y + 1) / 2);
          const fold = 1 + (0.13 * Math.sin(7 * th + 1.3) + 0.06 * Math.sin(13 * th + 0.4)) * up * up;
          const gather = 1 - 0.5 * smooth(cl01((up - 0.62) / 0.38));
          v.x *= fold * gather; v.z *= fold * gather;
          if (v.y < -0.45) v.y = -0.45 - (v.y + 0.45) * 0.08;
          p.setXYZ(i, v.x * 0.12, (v.y + 0.45) * 0.09, v.z * 0.17);
        }
        geo.computeVertexNormals();
        const body = new THREE.Mesh(geo, mSilk); body.castShadow = !LOW; body.receiveShadow = true; g.add(body);
        const knot = new THREE.Mesh(new THREE.SphereGeometry(0.021, 14, 10), mSilk); knot.position.y = 0.13; knot.scale.set(1, 0.8, 1.1); g.add(knot);
        for (const s of [-1, 1]) {
          const ear = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.058, 10), mSilk);
          ear.position.set(0.004, 0.152, s * 0.025); ear.rotation.set(s * 0.9, 0, 0); g.add(ear);
        }
        cntLive.bundleSet = mkSet(g);
        setShow(cntLive.bundleSet, true, true);            // there before the opening film, as the film shows it through the glass
      }
      /* THE CLOTH, opened out on the glass under them: the silk square, its gold border, a few soft creases where it was
         knotted, its edges lifting a little off the glass */
      {
        const geo = new THREE.PlaneGeometry(CNT.w, CNT.l, 14, 26); geo.rotateX(-Math.PI / 2);
        const p = geo.attributes.position;
        /* (where his card will lie, the cloth lies flat — pressed under it — so the card rests on it: laid at the cloth's
           base, its creases and its lifted edge stood up to 8 mm through the card, and film K read a card nobody could see) */
        const ccx = CNT_CARD.x - CNT.x, ccz = CNT_CARD.z - CNT.z;
        for (let i = 0; i < p.count; i++) {
          const x = p.getX(i), z = p.getZ(i), ex = Math.abs(x) / (CNT.w / 2), ez = Math.abs(z) / (CNT.l / 2);
          const crease = 0.0018 * Math.sin(z * 38 + x * 9) * Math.sin(x * 24) + 0.0012 * Math.sin(z * 71 - x * 17);
          /* (CP13, the counter's vision review: flat only to the card's own edge, the cloth's 2.5 cm grid had triangles that
             climbed out of the flat INSIDE the card's edge — a stepped notch bit its corner in film K's macro; flat for
             2.5 cm past it, a grid cell, before the creases begin) */
          const under = cl01((Math.max(Math.abs(x - ccx) - CARD_HX, Math.abs(z - ccz) - CARD_HZ, 0) - 0.025) / 0.02);
          p.setY(i, 0.0015 + Math.max(0, crease * under + 0.0015) + 0.004 * Math.pow(Math.max(ex, ez), 6) * under);
        }
        geo.computeVertexNormals();
        const cl = new THREE.Mesh(geo, mCloth); cl.position.set(CNT.x, T, CNT.z); cl.receiveShadow = true; G.add(cl);
        cntLive.clothSet = mkSet(cl);
      }
      for (let i = 0; i < 3; i++) if (!cntLive.kidSet[i]) cntLive.kidSet[i] = mkSet(null);   // the three land async (their loader fills these)
      /* THE OLD AUNTIE'S MUSIC BOX, brought out as the shy one's story is told: past the little one, its front to him */
      {
        const MB = makeMusicBox(G); MB.group.position.set(CNT_BOX.x, T, CNT_BOX.z); MB.group.rotation.y = -Math.PI / 2;
        cntLive.box = MB; cntLive.boxSet = mkSet(MB.group);
      }
      /* HIS CARD, laid on the cloth before the three, its words the right way up for the player (film K reads it), and his
         pen on the wood of his working end */
      {
        const g = new THREE.Group(); g.position.set(CNT_CARD.x, T + 0.0036, CNT_CARD.z); G.add(g);   // on the cloth's pressed-flat 3 mm
        const cd = new THREE.Mesh(new THREE.PlaneGeometry(CARD_HZ * 2, CARD_HX * 2), M({ map: tCard(), roughness: 0.9 }));
        cd.rotation.set(-Math.PI / 2, -Math.PI / 2, 0, 'YXZ'); cd.receiveShadow = true; g.add(cd);
        cntLive.card = cd; cntLive.cardSet = mkSet(g);
        const pen = new THREE.Group(); pen.position.set(CNT_PEN.x, T + 0.0145, CNT_PEN.z); pen.rotation.y = 0.12; G.add(pen);
        const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.13, 12), M({ color: 0x14161c, roughness: 0.35, metalness: 0.2 }));
        barrel.rotation.z = Math.PI / 2; pen.add(barrel);
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.0045, 0.014, 12), M({ color: 0xc8c8cc, roughness: 0.25, metalness: 0.85 }));
        tip.rotation.z = -Math.PI / 2; tip.position.x = 0.072; pen.add(tip);
        const clip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.0015, 0.003), M({ color: 0xd2a84a, roughness: 0.3, metalness: 0.8 }));
        clip.position.set(-0.04, 0.005, 0); pen.add(clip);
        cntLive.pen = pen; cntLive.penSet = mkSet(pen);
      }
      /* THE PAPER BAG he packs them into: kraft paper, its wide face to the player, its top open with the red knot over
         the rim, a twisted paper handle on each wide face */
      {
        const g = new THREE.Group(); g.position.set(CNT.x, T, CNT.z); G.add(g);
        const mK = M({ map: tex(makeKraftT(THREE, cnv)), roughness: 0.92, side: THREE.DoubleSide });
        const BD = 0.15, BW = 0.25, BH = 0.27;                    // its depth (x), its width (z, to the player), its height
        for (const [w, x, z, ry] of [[BW, BD / 2, 0, Math.PI / 2], [BW, -BD / 2, 0, -Math.PI / 2], [BD, 0, BW / 2, 0], [BD, 0, -BW / 2, Math.PI]]) {
          const s = new THREE.Mesh(new THREE.PlaneGeometry(w, BH), mK); s.position.set(x, BH / 2, z); s.rotation.y = ry; s.castShadow = !LOW; s.receiveShadow = true; g.add(s);
        }
        const fl = new THREE.Mesh(new THREE.PlaneGeometry(BD, BW), mK); fl.rotation.x = -Math.PI / 2; fl.position.y = 0.002; g.add(fl);
        const knot = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), mSilk); knot.position.y = BH - 0.03; knot.scale.set(0.95, 0.62, 1.5); g.add(knot);   // (CP13: lower in its mouth — at BH − 0.012 it sat on the rim like a cushion)
        const mH = M({ color: 0xa8865a, roughness: 0.9 });
        for (const s of [-1, 1]) {
          const x = s * (BD / 2 + 0.002);
          const c = new THREE.CatmullRomCurve3([new THREE.Vector3(x, BH - 0.03, -0.055), new THREE.Vector3(x, BH + 0.06, -0.02), new THREE.Vector3(x, BH + 0.06, 0.02), new THREE.Vector3(x, BH - 0.03, 0.055)]);
          g.add(new THREE.Mesh(new THREE.TubeGeometry(c, 18, 0.0045, 6, false), mH));
        }
        cntLive.bag = g; cntLive.bagSet = mkSet(g);
        cntLive.bagHeld = g.clone();                              // the same bag in his hand (the geometry and materials shared)
        cntLive.bagHeld.position.set(0, 0, 0); cntLive.bagHeld.scale.setScalar(1); cntLive.bagHeld.visible = true;
      }
    }
    buildCounter();

    /* THE OFFERINGS' THINGS (CP6, §4.2): a short glass bottle of red drink with its label, a screw cap on a ratchet ring;
       a striped bendy straw in a paper sleeve; a disposable lighter; a packet of joss sticks and three sticks; the bag he
       carried home, on the desk. One builder each, so the bottle in his hand (drawn in the hands' pass, kit.hold) and the
       three he sets down at the altar are the same thing. Sizes in metres: the bottle 0.175 tall, 0.03 round; the straw
       0.21. */
    const tFlame = tex(makeYinFlame(THREE, cnv));
    const mGlassB = M({ color: 0xe8f0ec, roughness: 0.06, metalness: 0.05, transparent: true, opacity: 0.32, depthWrite: false });
    const mDrink  = M({ color: 0xb8101a, roughness: 0.18, emissive: 0x2a0204, emissiveIntensity: 0.6 });
    const mLabel  = M({ map: tex(makeSodaLabelT(THREE, cnv)), roughness: 0.55 });
    const mCapB   = M({ color: 0xc8141e, roughness: 0.35, metalness: 0.2 });
    const tStraw  = tex(makeStrawT(THREE, cnv)); tStraw.wrapS = tStraw.wrapT = THREE.RepeatWrapping; tStraw.repeat.set(1, 14);
    const mStraw  = M({ map: tStraw, roughness: 0.4 });
    const mFlex   = M({ color: 0xf0eee8, roughness: 0.5 });
    const mSleeve = M({ map: tex(makeSleeveT(THREE, cnv)), roughness: 0.9, side: THREE.DoubleSide });
    const BOTTLE_PROF = [[0, 0], [0.026, 0], [0.03, 0.006], [0.03, 0.104], [0.027, 0.12], [0.017, 0.136], [0.0128, 0.146], [0.0128, 0.161]];
    const BOTTLE_CAP_Y = 0.1625;                         // the ring's top: the cap sits on it, 13 mm tall
    function makeBottle() {
      const g = new THREE.Group();
      const glass = new THREE.Mesh(new THREE.LatheGeometry(BOTTLE_PROF.map(([a, b]) => new THREE.Vector2(a, b)), 26), mGlassB);
      glass.renderOrder = 3; g.add(glass);
      const liq = new THREE.Mesh(new THREE.LatheGeometry([[0, 0.004], [0.0272, 0.004], [0.0272, 0.103], [0.0242, 0.119], [0.0148, 0.134], [0, 0.134]]
        .map(([a, b]) => new THREE.Vector2(a, b)), 22), mDrink); g.add(liq);
      const lab = new THREE.Mesh(new THREE.CylinderGeometry(0.0304, 0.0304, 0.058, 30, 1, true), mLabel); lab.position.y = 0.064; lab.renderOrder = 2; g.add(lab);
      /* the tamper ring left on the neck when the cap comes off: an open band round the glass just under its mouth (CP13,
         the films' second vision review: a closed disc over the mouth, wider than the neck, read in the inserts as a flat
         red lid with the straw pushed through it); the cap's skirt reaches down over the mouth to meet it */
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.0134, 0.0134, 0.004, 18, 1, true), mCapB); ring.position.y = 0.157; g.add(ring);
      const cap = new THREE.Group(); cap.position.y = BOTTLE_CAP_Y; g.add(cap);
      const cm = cyl(0.0144, 0.0144, 0.016, 0, 0.005, 0, mCapB, 22, cap);
      for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; const rb = box(0.0014, 0.011, 0.0016, Math.cos(a) * 0.0146, 0.0065, Math.sin(a) * 0.0146, mCapB, cap, false); rb.rotation.y = -a; }
      void cm; void ring;
      for (const o of [glass, liq, lab]) o.castShadow = false;
      return { g, cap, liq, lab };
    }
    /* the straw: its foot at y 0, along +y; the bendy neck 0.172 up, and the short top above it on a hinge (bend = the
       top's turn toward the child) */
    function makeStraw() {
      const g = new THREE.Group();
      cyl(0.0028, 0.0028, 0.17, 0, 0.085, 0, mStraw, 8, g);
      const flex = cyl(0.0031, 0.0031, 0.012, 0, 0.176, 0, mFlex, 8, g); void flex;
      const top = new THREE.Group(); top.position.y = 0.182; g.add(top);
      cyl(0.0028, 0.0028, 0.034, 0, 0.017, 0, mStraw, 8, top);
      return { g, top };
    }
    /* the sleeve, a paper tube the straw slides out of; torn open at its top */
    function makeSleeve() {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.0036, 0.0036, 0.2, 8, 1, true), mSleeve); s.castShadow = false;
      return s;
    }
    /* a disposable lighter: a green plastic body, a steel hood and its wheel; its flame a painted sprite (hidden until lit) */
    function makeLighter() {
      const g = new THREE.Group();
      box(0.024, 0.07, 0.012, 0, 0.035, 0, M({ color: 0x2a8a4a, roughness: 0.25, transparent: true, opacity: 0.85 }), g, false);
      box(0.024, 0.013, 0.012, 0, 0.0765, 0, M({ color: 0xb8bcc4, roughness: 0.3, metalness: 0.8 }), g, false);
      const w = cyl(0.0045, 0.0045, 0.008, 0.004, 0.083, 0, M({ color: 0x6a6c70, roughness: 0.4, metalness: 0.8 }), 12, g); w.rotation.x = Math.PI / 2;
      const fl = new THREE.Sprite(new THREE.SpriteMaterial({ map: tFlame, color: 0xffc070, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false }));
      mats.push(fl.material); fl.scale.set(0.014, 0.034, 1); fl.position.set(-0.004, 0.103, 0); fl.visible = false; g.add(fl);
      return { g, flame: fl };
    }
    /* three joss sticks, fanned a little, their tips (a glowing ember and a small flame each) at +y */
    function makeSticks() {
      const g = new THREE.Group(), tips = [];
      const mS = M({ color: 0x9a2418, roughness: 0.8 }), mH = M({ color: 0xd8a868, roughness: 0.7 });
      for (let i = 0; i < 3; i++) {
        const s = new THREE.Group(); s.rotation.z = (i - 1) * 0.07; g.add(s);
        cyl(0.0013, 0.0013, 0.06, 0, 0.03, 0, mH, 5, s);               // its bare handle
        cyl(0.0018, 0.0018, 0.16, 0, 0.14, 0, mS, 5, s);               // the incense on it
        const tip = new THREE.Group(); tip.position.y = 0.221; s.add(tip);
        const em = new THREE.Mesh(new THREE.SphereGeometry(0.0022, 6, 4), B({ color: 0xff7a2a, toneMapped: false })); em.visible = false; tip.add(em);
        const fl = new THREE.Sprite(new THREE.SpriteMaterial({ map: tFlame, color: 0xffb060, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false }));
        mats.push(fl.material); fl.scale.set(0.008, 0.018, 1); fl.position.y = 0.008; fl.visible = false; tip.add(fl);
        tips.push({ em, fl });
      }
      return { g, tips };
    }
    /* ======================================================== PLAY I · THE OFFERINGS (CP6, §4.2)
       22:50, his room. Their water, then their drinks — each bottle opened in his own hands (the cap twisted off, the
       straw slid in, its neck bent to the child) and carried to its child; then the incense lit at the desk and given,
       one stick each; then the mat, the music box wound, añjali, and the night's dedication. Every step is the engine's
       `craft` (S37) on a held prop — gentle: no grade, no price, no failure — and every order a press. What a Continue
       must not lose is a RECEIPT in the phase string (v7.3) — `care:water,d.red,d.shy,d.little,lit,i.red,i.shy,i.little,
       care`; a Continue inside a drink begins that drink again, its bottle back in the bag. */
    const TOUCHY = !!((window.matchMedia && matchMedia('(pointer: coarse)').matches) || 'ontouchstart' in window);   // (the engine's HAS_TOUCH: which words a brief gives)
    /* (CP13, the save lens: 'foam' is a receipt too — a cap twisted too fast was remembered only in memory, so a Continue
       paid the care award it had spoilt; it stands after 'care', outside the first eight a later phase restores) */
    const CARE_ORDER = ['water', 'd.red', 'd.shy', 'd.little', 'lit', 'i.red', 'i.shy', 'i.little', 'care', 'foam'];
    const careDone = new Set();
    let careBusy = false;
    const drinksN = () => KIDS.filter(K => careDone.has('d.' + K.key)).length;
    const sticksN = () => KIDS.filter(K => careDone.has('i.' + K.key)).length;
    const careTag = () => CARE_ORDER.filter(r => careDone.has(r)).join(',');
    function careSave() { if (kit) kit.setPhase(careDone.size ? 'care:' + careTag() : 'care'); }
    function careStep() {                      // the order still open
      if (!careDone.has('water')) return 'water';
      if (drinksN() < 3) return careLive.carry >= 0 ? 'carry' : 'drink';
      if (!careDone.has('lit')) return 'light';
      if (sticksN() < 3) return 'stick';
      return 'sit';
    }
    const KEYCAP = { red: 'Red', shy: 'Shy', little: 'Little' };
    function careObjective() {
      if (careBusy) return null;
      const s = careStep();
      if (s === 'water') return W.objWater;
      if (s === 'drink') return W.objDrinks.replace('{n}', String(drinksN()));
      if (s === 'carry') return W['objGive' + KEYCAP[KIDS[careLive.carry].key]];
      if (s === 'light') return W.objIncense;
      if (s === 'stick') return W.objSticks.replace('{n}', String(sticksN()));
      return W.objSit;
    }
    const careOk = () => phase === 'care' && !careBusy && quiet();
    const nextKid = () => KIDS.findIndex(K => !careDone.has('d.' + K.key));
    /* the viewmodel's lens (its own: 52°, at the origin of the hands' scene, looking down −z) — what a held thing's point
       on the screen is, for the craft's `at` (S37: a thing in his hand is projected by the chapter) */
    const VM_T = Math.tan(26 * Math.PI / 180), _vp = new THREE.Vector3();
    /* a thing in the WORLD, where it falls on the screen (shares of the frame, the craft's `at`): the bottle on the desk */
    function worldAt(obj, ox = 0, oy = 0, oz = 0) {
      if (!obj || !obj.parent) return null;
      obj.updateWorldMatrix(true, false);
      const p = obj.localToWorld(_vp.set(ox, oy, oz)).project(camera);
      if (p.z > 1) return null;
      return { sx: 0.5 + 0.5 * p.x, sy: 0.5 - 0.5 * p.y };
    }
    function vmAt(obj, ox = 0, oy = 0, oz = 0) {
      if (!obj || !obj.parent) return null;
      obj.updateWorldMatrix(true, false);
      const p = obj.localToWorld(_vp.set(ox, oy, oz));
      if (p.z > -0.01) return null;
      return { sx: 0.5 + 0.5 * (p.x / -p.z) / (VM_T * camera.aspect), sy: 0.5 - 0.5 * (p.y / -p.z) / VM_T };
    }
    /* the hands' pose that holds a thing, with where that thing stands across the frame on every screen (S40's `sx`: the
       palm named at that share of the half-width at its depth — by photograph, on a phone a held thing stood half off
       the right edge): the lighter's flame in the middle. (The bottle is not held while it is opened: Chad, v23.0 CP7 —
       "if you know its impossible for you to get the fingers right, then dont do that animation, just have the bottle
       animate itself": it stands on the desk and opens under the player's finger) */
    const HOLD_SX = {};                                       // (the lighter is not held either: it lights itself on the desk — the same call)
    function handsTo(name, k, o = {}) {
      if (!kit || !kit.handPose) return;
      const X = name && HOLD_SX[name];
      kit.handPose(name, k, X ? Object.assign({}, o, X) : o);
    }
    const _pl = new THREE.Vector3(), _pr = new THREE.Vector3(), _ax = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0);
    const _q = new THREE.Quaternion(), _m4 = new THREE.Matrix4(), _m4b = new THREE.Matrix4(), _sc = new THREE.Vector3(1, 1, 1);
    /* a thing held in a hand, stood with its +y along `dir` and its origin at `at` (both in the hands' scene), written in
       its hand's own frame */
    function standAt(obj, at, dir) {
      const L = obj.parent; if (!L) return;
      L.updateWorldMatrix(true, false);
      _q.setFromUnitVectors(_up, dir);
      _m4.compose(at, _q, _sc);
      _m4b.copy(L.matrixWorld).invert().multiply(_m4);
      _m4b.decompose(obj.position, obj.quaternion, obj.scale);
    }
    /* CARRIED: a thing in his right hand as he walks — stood upright through the palm, its lower part in the fist and a
       little toward the lens (by photograph: held by a fixed turn in the arm's frame, the bottle hung below the frame's
       edge and only the straw's tip was seen) */
    const _cu = new THREE.Vector3(0, 1, 0.12).normalize();
    function carryFrame(obj, below) {
      if (!kit || !kit.handPalm || !kit.handPalm('right', _pr)) return;
      standAt(obj, _pr.clone().addScaledVector(_cu, -below), _cu);
    }
    /* the yaw from where he stands to a place on the altar */
    function altarYaw(x, z, from) { const p = from || yaw.position; return Math.atan2(-(x - p.x), -(z - p.z)); }
    /* AT THE DESK: he sits on his chair, the eye down to 1.18 m over the desk (kit.pose — as the mat's sitting is), rooted */
    const CHAIR = { x: -0.32, z: -1.02 };
    /* where standing up from it puts him (CP13, the geometry lens): the chair's own column (padded, floor to 1.40) holds
       the spot he sat on, and collide() refuses every step that lands inside a blocker — so, stood up there and let go,
       he could turn but never walk, and the next order (the altar, 2 m off) was out of reach. He steps back and to his
       right as he rises, onto open floor clear of the chair, the desk and the shelf (walktest floods from it: arrivals) */
    const STAND_UP = { x: 0.22, z: -0.62 };
    function sitAtDesk(resumed) {
      careLive.seat = true;
      yaw.position.x = CHAIR.x; yaw.position.z = CHAIR.z;
      if (kit) { kit.root(true); kit.pose('lying', { y: 1.18, yaw: 0, span: 1.1, pitchLo: -1.1, pitchHi: 0.4, secs: resumed ? 0.05 : 0.8 }); }
      yaw.rotation.y = 0; pitch.rotation.x = -0.62;          // square to the desk (by photograph: a press kept the look it was made
                                                              // with, and the lamp's shade filled the top of a phone's frame)
    }
    function standUp() {
      careLive.seat = false;
      if (!kit) return;
      kit.pose('standing', { secs: 0.6 });
      careLive.glide = { fx: yaw.position.x, fz: yaw.position.z, tx: STAND_UP.x, tz: STAND_UP.z, t0: wallNow(), secs: 0.6, unroot: true };
    }
    /* ORDER 1a · THEIR WATER: a hold at the jug — his hand on it, the jug tips, the three cups fill one after another */
    function pourWater() {
      if (careStep() !== 'water' || !careOk() || !kit || !kit.event) return false;
      careBusy = true; kit.objective(null);
      const J = roomLive.jug;
      kit.event({ kind: 'craft', label: W.hotJug, steps: [{ g: 'hold', secs: 1.2, word: W.craftWater }],
        at: () => (J ? { x: J.position.x, y: J.position.y + 0.08, z: J.position.z } : null),
        onProgress: (s, k) => { careLive.pour = k; pourSound(); },
      }).then((r) => {
        /* (CP13, the save lens: an event aborted by a Retry or a faint resolves AFTER the reset, and its handler went on
           to mark the act done in the fresh run — every handler here stops on an abort) */
        if (!alive || (r && r.aborted)) return;
        careLive.pour = 1; careDone.add('water');
        pourStop(0.35);
        queueGap(0.4); queueLine('z5water');
        /* (CP13, the save lens: every PLAY I receipt is WRITTEN after its line — written before, a Continue in the
           line's seconds restored the act done and the line never said) */
        queueFn(() => { careSave(); careBusy = false; objectiveFor('care'); });
        void r;
      });
      return true;
    }
    /* (CP13, the sound lens: the pour played its fourteen-second take AFTER the cups were full. It plays while the jug
       pours now — started on the hold's first progress, heard only while the hold is moving the water (a hand let go
       holds the jug still and the water stops), brought down when the third cup is full) */
    const POUR_VOL = 0.4;
    function pourSound() {
      careLive.pourAt = wallNow();
      if (!careLive.pourS) {
        const P = careLive.pourS = sfxAt('k5pour', POUR_VOL, ALTAR.x0, (ALTAR.z0 + ALTAR.z1) / 2);
        if (P) P.addEventListener('ended', () => { if (careLive.pourS === P) careLive.pourS = null; });
      }
    }
    function pourStop(secs) { const P = careLive.pourS; careLive.pourS = null; sfxDown(P, secs); }
    function pourGain() {
      const P = careLive.pourS, g = P && P.__g && P.__g.gain; if (!g) return;
      const want = wallNow() - (careLive.pourAt || 0) < 0.15 ? POUR_VOL : 0.0001;
      try { g.setTargetAtTime(want, P.context.currentTime, 0.05); } catch { /* over */ }
    }
    function waterFrame() {
      pourGain();
      const k = careLive.pour;
      roomLive.cups.forEach((C, i) => {
        const f = cl01(k * 3 - i);
        C.water.visible = f > 0.02;
        C.water.position.y = ALTAR.top + 0.01 + 0.037 * f;
      });
      if (roomLive.jug) roomLive.jug.rotation.x = careBusy && careStep() === 'water' ? -0.9 * Math.sin(Math.PI * cl01(k)) : 0;
    }
    /* ORDER 1b · THEIR DRINKS, one at a time: at the desk, the bottle out of the bag into his hands, then the craft — the
       cap twisted off (a ratchet click every 30°, the seal at 270°, the cap lifting off at the end, and set aside on the
       desk), the straw slid in out of its sleeve (bubbles rising), its neck bent; then he stands with it in his right hand
       and the order names the child it is for */
    function atDeskDrink() {
      if (careStep() !== 'drink' || !careOk() || !kit || !kit.event) return false;
      const i = nextKid(); if (i < 0) return false;
      /* (v24.2, L6-1: the drink is GIVEN at its place, which is where its OBJECTIVE COMPLETE lands — the bag's press posted
         one more, before any drink was made) */
      careBusy = true; kit.objective(null, { complete: false });
      sitAtDesk(false);
      if (!careLive.bagSaid) { careLive.bagSaid = true; queueGap(0.6); queueLine('z5bag'); }
      queueGap(0.3);
      queueFn(() => drinkCraft(i));
      return true;
    }
    function drinkCraft(i) {
      const K = KIDS[i], H = careLive.held;
      heldReset();                                         // a fresh bottle: cap on, straw in its sleeve over it
      sfxAt('k5bottleout', 0.45, CHAIR.x, CHAIR.z - 0.4);
      deskBottle(true);                                    // out of the bag, stood on the desk before him
      /* (a narrow screen aims 5 cm higher, so the bottle stands lower in it — CP13, the play's vision review: on a phone the
         craft's panel stands under the stat bars, to 39 % of the height, and lay over the straw as it slid in and bent) */
      viewTo(Math.atan2(-(WORK.x - CHAIR.x), -(WORK.z - CHAIR.z)), Math.atan2(DESK.top + (camera.aspect < 1 ? 0.17 : 0.12) - DESK_EYE, Math.hypot(WORK.x - CHAIR.x, WORK.z - CHAIR.z)), 0.6);
      const first = !careLive.briefed; careLive.briefed = true;
      let clicks = 0, sealed = false, stiffSaid = false;
      kit.event({ kind: 'craft', label: W.briefCapTitle, brief: first ? (TOUCHY ? W.briefCap : W.briefCapKey) : undefined, demo: 'twist',
        steps: [{ g: 'twist', turns: K.capTurns, word: W.craftCap },
                { g: 'slide', dir: 'down', len: 0.2, word: W.craftStraw },
                { g: 'slide', dir: 'side', len: 0.08, word: W.craftBend }],
        at: () => (careLive.capOff ? worldAt(H.g, 0, BOTTLE_CAP_Y, 0) : worldAt(H.cap, 0, 0.006, 0)),
        onProgress: (s, k) => {
          if (s === 0) {
            const deg = k * K.capTurns * 360;
            careLive.capA = deg * Math.PI / 180;
            while (clicks < Math.floor(deg / 30)) { clicks++; sfxAt(K.capTurns > 1.6 ? 'k5stiff' : 'k5ratchet', 0.32, CHAIR.x, CHAIR.z - 0.4); }
            if (!sealed && deg >= 270) { sealed = true; sfxAt('k5seal', 0.5, CHAIR.x, CHAIR.z - 0.4); sfxAt('k5hiss', 0.35, CHAIR.x, CHAIR.z - 0.4); }
            if (K.capTurns > 1.6 && !stiffSaid && deg >= 200) { stiffSaid = true; queueLine('z5stiff'); }   // the little one's stiff cap: "Come on... open..." (§4.2)
          } else if (s === 1) careLive.slide = k;
          else careLive.bend = k;
        },
        onStep: (s) => {
          if (s === 0) {                                   // the cap off, and set down on the desk
            sfxAt('k5capoff', 0.45, CHAIR.x, CHAIR.z - 0.4); careLive.capOff = true; capAside(i);
            sfxAt('k5tear', 0.35, CHAIR.x, CHAIR.z - 0.4); careLive.sleeveOff = true; sleeveAside(i);
          } else if (s === 1) {
            sfxAt('k5slide', 0.4, CHAIR.x, CHAIR.z - 0.4); after(0.3, () => sfxAt('k5bubbles', 0.3, CHAIR.x, CHAIR.z - 0.4));
            if (K.key === 'shy') after(1.1, () => sfxAt('k5plip', 0.22, CHAIR.x, CHAIR.z - 0.4));   // one bubble back up: almost a giggle (§4.2)
          } else sfxAt('k5bend', 0.35, CHAIR.x, CHAIR.z - 0.4);
        },
        onFoam: () => { careLive.foamed = true; careLive.foamT = 1; careDone.add('foam'); sfxAt('k5foam', 0.4, CHAIR.x, CHAIR.z - 0.4); },
      }).then((r) => {
        if (!alive || (r && r.aborted)) return;
        careLive.slide = 1; careLive.bend = 1;
        deskBottle(false);
        kit.hold(H.g, { pos: HELD_R.pos, rot: HELD_R.rot, bare: true });   // in his right hand now, as he stands (the hand out of sight: CP13)
        careLive.carry = i;
        standUp();
        viewTo(altarYaw(ROW.back, ALTAR_Z[i], STAND_UP), -0.42, 0.9);   // and his look goes to the one it is for (by photograph: it stayed on the desk)
        after(0.95, () => { careBusy = false; objectiveFor('care'); placeRing(i, true); });   // (once the look has arrived: the turn writes it till then)
      });
    }
    /* TO HIM: the place before the child glows on the runner; a press there crouches him (the eye dips to 1.0), his hand
       sets the bottle down with its straw's bend turned to the child's mouth, he says his line, and the child's eyes catch
       the lamp for a moment — a glint, the first hint, nothing more (§4.2) */
    const HELD_R = { pos: [0.02, -0.17, -0.15], rot: [0.15, 0, 0] };   // (by photograph, CP6)
    function placeRing(i, on) { for (let j = 0; j < 3; j++) if (careLive.rings[j]) careLive.rings[j].visible = on && j === i; }
    function placeDrink(i) {
      if (careStep() !== 'carry' || careLive.carry !== i || !careOk() || !kit) return false;
      const K = KIDS[i];
      careBusy = true; kit.objective(null); placeRing(i, false);
      kneelBefore(i, ROW.back, ALTAR_Z[i] + 0.06);
      if (kit.handPose) kit.handPose('place', 1, { secs: 0.5 });
      after(0.65, () => {
        kit.hold(null);
        if (kit.handPose) kit.handPose(null, 0, { secs: 0.5 });
        careLive.placed[i] = true; bottleShow(i, true);
        sfxAt('k5set', 0.42, ROW.back, ALTAR_Z[i]);
        careDone.add('d.' + K.key); careLive.carry = -1;
      });
      queueGap(0.9);
      /* his line to that child (each name written out, so chaptertest checks all three), and the glint halfway through it */
      const glintAt = (name) => () => after(Math.max(0.6, (SECS[name] || 2.4) * 0.5), () => glint(i));
      if (i === 0) queueLine('z5red', glintAt('z5red'));
      else if (i === 1) queueLine('z5shy', glintAt('z5shy'));
      else queueLine('z5little', glintAt('z5little'));
      queueGap(0.3);
      queueFn(() => {
        kit.pose('standing', { secs: 0.6 }); kit.root(false);
        if (drinksN() === 3 && !careLive.foamed && !careDone.has('foam') && !careDone.has('care')) {      // their drinks, prepared with care (the receipt is the note, v7.3)
          careDone.add('care'); if (kit.conduct) kit.conduct({ a: 3, note: W.noteCare });
        }
        careSave();                                   // (the drink's receipt and the award's, together, after his line — CP13)
        /* and his look goes back to the desk, where the next drink (or, after the third, the incense) waits — by photograph:
           standing up 0.4 m from the altar, the little one's head filled a phone's frame and the next order was behind him */
        const dx = DESK_AT.bag[0] - yaw.position.x, dz = DESK_AT.bag[1] - yaw.position.z;
        viewTo(Math.atan2(-dx, -dz), Math.atan2(DESK.top + 0.1 - 1.62, Math.hypot(dx, dz)), 1.1);
        after(1.15, () => { careBusy = false; objectiveFor('care'); });
      });
      return true;
    }
    function glint(i) { const G = careLive.glints[i]; if (G) { G.t = 0.0001; G.sp.visible = true; } }
    /* he steps up to the altar before that child and crouches there, his look on the place — a short glide on wall time,
       rooted while he does it (by photograph: he crouched wherever the press found him, and from the room's middle the
       drink went down out of his reach and out of the frame) */
    const KNEEL_X = ALTAR.x0 - 0.40;
    function kneelBefore(i, x, z) {
      const tx = KNEEL_X, tz = ALTAR_Z[i] + 0.03;
      careLive.glide = { fx: yaw.position.x, fz: yaw.position.z, tx, tz, t0: wallNow(), secs: 0.55 };
      kit.root(true);
      kit.pose('lying', { y: 1.0, yaw: -Math.PI / 2, span: 1.2, pitchLo: -1.0, pitchHi: 0.5, secs: 0.5 });
      viewTo(Math.atan2(-(x - tx), -(z - tz)), Math.atan2(ALTAR.top + 0.1 - 1.0, Math.hypot(x - tx, z - tz)), 0.6);
    }
    function glideFrame() {
      const G = careLive.glide; if (!G) return;
      const k = smooth(cl01((wallNow() - G.t0) / G.secs));
      yaw.position.x = G.fx + (G.tx - G.fx) * k; yaw.position.z = G.fz + (G.tz - G.fz) * k;
      if (k >= 1) { careLive.glide = null; if (G.unroot && kit) kit.root(false); }   // (standUp's: rooted until he is off the chair's spot)
    }
    /* ORDER 2 · THEIR INCENSE, at the desk again: the lighter in his left hand — the first strike only sparks, the second
       lights it, a warm glow on his hands — the three sticks' tips held in the flame till they catch, and waved out: three
       embers, three threads of smoke */
    function atDeskIncense() {
      if (careStep() !== 'light' || !careOk() || !kit || !kit.event) return false;
      careBusy = true; kit.objective(null);
      sitAtDesk(false);
      const Lg = careLive.lighter, St = careLive.sticks;
      careLive.catchK = 0; deskIncense('stage');
      /* his look onto the packet's mouth and the lighter, at the flame's height (the bottle's own move) */
      { const tx = PKT_O.x + 0.07, ty = DESK.top + 0.09, tz = PKT_O.z;
        viewTo(Math.atan2(-(tx - CHAIR.x), -(tz - CHAIR.z)), Math.atan2(ty - DESK_EYE, Math.hypot(tx - CHAIR.x, tz - CHAIR.z)), 0.6); }
      let taps = 0;
      kit.event({ kind: 'craft', label: W.objIncense,
        steps: [{ g: 'tap', n: 2, word: W.craftLight }, { g: 'hold', secs: 1.4, word: W.craftCatch }, { g: 'swipe', dir: 'side', word: W.craftWave }],
        at: () => worldAt(Lg.g, 0, 0.09, 0),
        onProgress: (s, k) => {
          if (s === 0) {
            const t = Math.round(k * 2);
            while (taps < t) { taps++; if (taps === 1) { sfxAt('k5spark', 0.4, CHAIR.x, CHAIR.z - 0.4); careLive.sparkT = 0.25; }
                                       else { sfxAt('k5flick', 0.45, CHAIR.x, CHAIR.z - 0.4); Lg.flame.visible = true; } }
          } else if (s === 1) {
            careLive.catchK = k;
            St.tips.forEach((T, j) => { T.em.visible = k > 0.35 + j * 0.15; T.fl.visible = k > 0.55 + j * 0.12; });
          }
        },
        onStep: (s) => {
          if (s === 1) sfxAt('k5catch', 0.4, CHAIR.x, CHAIR.z - 0.4);
          if (s === 2) { sfxAt('k5wave', 0.4, CHAIR.x, CHAIR.z - 0.4); Lg.flame.visible = false; St.tips.forEach(T => { T.fl.visible = false; T.em.visible = true; }); }
        },
      }).then((r) => {
        if (!alive || (r && r.aborted)) return;
        Lg.flame.visible = false; St.tips.forEach(T => { T.fl.visible = false; T.em.visible = true; });
        careLive.catchK = 0; deskIncense('left');                    // (the packet and the lighter stay where they were used)
        kit.hold(St.g, { pos: STICKS_R.pos, rot: STICKS_R.rot, bare: true });   // (the sticks to his hand, to carry to them — the hand out of sight)
        careDone.add('lit');
        queueGap(0.3); queueLine('z5incense');
        queueFn(() => { careSave(); standUp(); viewTo(altarYaw(ROW.mid, ALTAR_Z[1], STAND_UP), -0.42, 0.9); after(0.95, () => { careBusy = false; objectiveFor('care'); }); });
      });
      return true;
    }
    /* THE INCENSE LIGHTS ITSELF (Chad, on the bottle: "if you know its impossible for you to get the fingers right, then
       dont do that animation, just have the bottle animate itself" — and the two hands holding the lighter and the sticks
       were the same broken fingers, by photograph): for this order the packet lies on the desk before him, its mouth
       toward the lighter standing beside it, the three sticks out of the mouth. A tap strikes the lighter, the hold leans
       the sticks' tips down into its flame, the flick puts the flames out — the player's finger moves them, as it turns
       the cap. 'stage' sets all three out; 'left' leaves the packet and the lighter where they were used (the sticks are
       his to carry); off puts the packet home and takes the lighter and the sticks off the desk */
    const PKT_O = { x: -0.30, z: -1.265 };                       // the packet's mouth: where the sticks lean from
    const STICK_OUT = 0.161, STICK_UP = 1.08;                    // the sticks' length out of the mouth; their lean at rest (rad above level)
    function deskIncense(mode) {
      const Lg = careLive.lighter, St = careLive.sticks, Pk = careLive.packet; if (!Lg || !St || !Pk) return;
      careLive.incDesk = mode === 'stage';
      if (mode) {
        Pk.position.set(PKT_O.x - 0.22, DESK.top + 0.036, PKT_O.z); Pk.rotation.set(0, 0, -Math.PI / 2 + 0.02);   // (v24.2, L5-10: on the wood, not in it)
        if (Lg.g.parent !== worldR) worldR.add(Lg.g);
        const lx = PKT_O.x + 0.142;
        Lg.g.position.set(lx, DESK.top + 0.018, PKT_O.z); Lg.g.rotation.set(0, Math.atan2(CHAIR.x - lx, CHAIR.z - PKT_O.z), 0); Lg.g.scale.setScalar(1);   // (stood on the surface, CP8: at DESK.top its foot was in the slab)
        if (mode === 'stage') { if (St.g.parent !== worldR) { if (St.g.parent) St.g.parent.remove(St.g); worldR.add(St.g); } St.g.scale.setScalar(1); incenseFrame(); }
      } else {
        Pk.position.set(DESK_AT.packet[0], DESK.top + 0.018, DESK_AT.packet[1]); Pk.rotation.set(0, 0.5, Math.PI / 2 - 0.02);
        if (Lg.g.parent === worldR) worldR.remove(Lg.g);
        if (St.g.parent === worldR) worldR.remove(St.g);
      }
    }
    const _io = new THREE.Vector3(), _ifl = new THREE.Vector3(), _idF = new THREE.Vector3(), _id0 = new THREE.Vector3(), _idd = new THREE.Vector3();
    const _iq = new THREE.Quaternion(), _iy = new THREE.Vector3(0, 1, 0);
    function incenseFrame() {                                    // every frame of the order: the sticks leaning by catchK
      const Lg = careLive.lighter, St = careLive.sticks; if (!Lg || !St || St.g.parent !== worldR) return;
      _io.set(PKT_O.x, DESK.top + 0.02, PKT_O.z);
      Lg.g.updateWorldMatrix(true, true); Lg.flame.getWorldPosition(_ifl); _ifl.y -= 0.006;     // (into the flame's foot)
      _idF.subVectors(_ifl, _io); const reach = _idF.length(); _idF.multiplyScalar(1 / reach);
      const hz = Math.hypot(_idF.x, _idF.z) || 1;
      _id0.set(Math.cos(STICK_UP) * _idF.x / hz, Math.sin(STICK_UP), Math.cos(STICK_UP) * _idF.z / hz);
      const k = smooth(cl01(careLive.catchK));
      _idd.copy(_id0).lerp(_idF, k).normalize();
      _iq.setFromUnitVectors(_iy, _idd); St.g.quaternion.copy(_iq);
      const out = STICK_OUT + (reach - STICK_OUT) * k;          // (and slid out, so at full lean the tips sit in the flame)
      St.g.position.copy(_io).addScaledVector(_idd, out - 0.221);  // (makeSticks: the tips at 0.221 from the base)
    }
    const LIGHTER_L = { pos: [-0.012, -0.03, -0.15], rot: [0, 0, 0] };   // (by photograph, CP6)
    const STICKS_R = { pos: [0.012, -0.06, -0.15], rot: [-0.3, 0, 0] };  // (by photograph, CP6)
    /* ORDER 3 · ONE STICK EACH: a press at each sand bowl pushes one stick into the sand; its smoke rises straight up */
    function giveStick(i) {
      const K = KIDS[i];
      if (careStep() !== 'stick' || careDone.has('i.' + K.key) || !careOk()) return false;
      careBusy = true;
      kneelBefore(i, ROW.mid, ALTAR_Z[i]);
      if (kit.handPose) kit.handPose('place', 1, { secs: 0.4 });
      after(0.65, () => {
        careDone.add('i.' + K.key); careSave(); stickShow(i, true);
        sfxAt('k5sand', 0.4, ROW.mid, ALTAR_Z[i]);
        const n = sticksN() - 1, St = careLive.sticks;                    // one fewer in his hand
        if (St.g.children[n]) St.g.children[n].visible = false;
        if (kit.handPose) kit.handPose(null, 0, { secs: 0.4 });
        if (sticksN() === 3) { kit.hold(null); setPhase('sit'); }
        after(0.6, () => {
          kit.pose('standing', { secs: 0.5 }); kit.root(false);
          /* the third given, the mat is beside him and below the frame (by photograph): his look goes down to it, its mark at
             the frame's foot — unless he stands on it already, when careFrame sits him */
          const mdx = MAT.x - yaw.position.x, mdz = MAT.z - yaw.position.z;
          /* and before that, stood again with a stick still in his hand, his look goes down to the next one's bowl (CP13,
             the play's vision review: standing reset the look to the level, and a phone held the block outside the
             window, the next child under the bottom edge) */
          const nx = KIDS.findIndex(Kn => !careDone.has('i.' + Kn.key));
          if (phase === 'sit' && Math.hypot(mdx, mdz) > 0.28) { viewTo(Math.atan2(-mdx, -mdz), -0.85, 0.9); after(0.95, () => { careBusy = false; objectiveFor(phase); }); }
          else if (phase !== 'sit' && nx >= 0) {
            const bx = ROW.mid - yaw.position.x, bz = ALTAR_Z[nx] - yaw.position.z;
            viewTo(Math.atan2(-bx, -bz), Math.max(-1.0, Math.atan2(ALTAR.top + 0.1 - 1.62, Math.hypot(bx, bz) || 0.3)), 0.9);
            after(0.95, () => { careBusy = false; objectiveFor(phase); });
          }
          else { careBusy = false; objectiveFor(phase); }
        });
      });
      return true;
    }
    /* ORDER 4 · SIT WITH THEM: the mat; the music box wound (one turn of its key — the cap taught the gesture, so no brief,
       the hint drawn at the key), its lid lifting and the lullaby; añjali, his words to them, a bow, and the night's
       dedication; the clock at 23:12. (CP7 takes it on from here: the question, and the openings.) */
    function sitWithThem() {
      if (phase !== 'sit' || seated || !quiet() || careBusy || !kit) return false;
      careBusy = true; kit.objective(null);
      sitDown(false);
      /* his look to the box as he settles (it stands at the little one's end — 41° right of the altar from the mat, off a
         phone's frame), and back to the three for the clasp (by photograph: a press made looking down at the rug left
         the three above the frame and the key's hint in the panel's corner) */
      const BX = 1.30, BZ = (RISER.z1 + ALTAR.z1) / 2;
      viewTo(Math.atan2(-(BX - MAT.x), -(BZ - MAT.z)), Math.atan2(ALTAR.top + 0.08 - 0.9, Math.hypot(BX - MAT.x, BZ - MAT.z)), 1.0);
      after(1.0, () => {
        const B = roomLive.box;
        const keyAt = () => { if (!roomLive.boxKey) return null; const p = roomLive.boxKey.getWorldPosition(new THREE.Vector3()); return { x: p.x, y: p.y, z: p.z }; };
        const go = kit.event ? kit.event({ kind: 'craft', label: W.titleBox, steps: [{ g: 'twist', turns: 1, word: W.craftWind }], at: keyAt,
          onProgress: (s, k) => { if (roomLive.boxKey) roomLive.boxKey.rotation.x = k * Math.PI * 2; } }) : Promise.resolve();
        void B;
        go.then((r) => {
          if (!alive || (r && r.aborted)) return;
          sfxAt('k5wind', 0.45, 1.30, (RISER.z1 + ALTAR.z1) / 2);
          careLive.boxOpenTo = 1;
          viewTo(-Math.PI / 2, -0.12, 1.4);                     // (back to the three, for the clasp)
          after(0.8, () => sfxAt('k5lullaby', 0.5, 1.30, (RISER.z1 + ALTAR.z1) / 2));
          after(1.6, () => {
            if (kit.pray) kit.pray(true, { secs: 1.0, y: -0.33 });
            queueGap(0.8); queueLine('z5eat');
            queueGap(0.6); queueFn(() => { careLive.bowT = 0.0001; sfxAt('k5wai', 0.3, MAT.x, MAT.z); });
            queueGap(2.0); queueLine('z5dedic');
            queueGap(0.8);
            queueFn(() => {
              if (kit.pray) kit.pray(false, { secs: 0.8 });
              roomClock('23:12');
              after(1.2, () => { careBusy = false; askBeat(); });   // the question, and the openings (CP7)
            });
          });
        });
      });
      return true;
    }
    /* the things of PLAY I in the room: the bag on the desk and the incense packet beside it; the three bottles he will set
       before them (each with its straw, bent to its child) and their glowing places; the stick he gives each, standing in
       its sand; the caps and the sleeves he sets aside on the desk; a glint for each child's eyes; and the bottle, straw,
       lighter and sticks that ride his hands */
    const careLive = { carry: -1, pour: 0, foamed: false, foamT: 0, briefed: false, bagSaid: false, seat: false, grip: '',
                       capA: 0, slide: 0, bend: 0, capOff: false, sleeveOff: false, catchK: 0, sparkT: 0, boxOpen: 0, boxOpenTo: 0,
                       bowT: 0, held: null, heldStraw: null, heldSleeve: null, lighter: null, sticks: null,
                       bottles: [], placed: [false, false, false], rings: [], glints: [], sticksSet: [], capsDesk: [], sleevesDesk: [],
                       deskBag: null, drinksBag: null, packet: null, pourS: null, pourAt: 0 };
    /* where a drink is opened: on the desk before his chair, in front of the laptop (its base's front edge at z −1.315),
       straight ahead of him; the eye at the desk */
    const WORK = { x: -0.34, z: -1.265 }, DESK_EYE = 1.18;
    function deskBottle(on) {
      const H = careLive.held; if (!H) return;
      careLive.onDesk = !!on;
      if (on) { if (H.g.parent !== worldR) worldR.add(H.g); H.g.position.set(WORK.x, DESK.top + 0.018, WORK.z); H.g.rotation.set(0, -0.5, 0); H.g.scale.setScalar(1); }
      else if (H.g.parent === worldR) worldR.remove(H.g);
    }
    const DESK_AT = { bag: [-0.80, -1.33], packet: [-0.62, -1.26], caps: [[-0.10, -1.25], [-0.06, -1.27], [-0.02, -1.25]],
                      sleeves: [[0.145, -1.235], [0.16, -1.255], [0.175, -1.24]] };   // (beyond the caps: the incense is lit where they used to lie)
    function buildOfferings() {
      const R = worldR, A = ALTAR, DT = DESK.top;
      // the bottles at the altar (the drinkAt places), each with its straw bent toward its child (+x, up the riser)
      for (let i = 0; i < 3; i++) {
        const P = roomLive.drinkAt[i], b = makeBottle(), st = makeStraw();
        b.g.position.copy(P); b.cap.visible = false;                        // (set down open: its cap is on the desk)
        st.g.position.y = 0.012; st.top.rotation.z = -1.15; b.g.add(st.g);   // its bend toward the child (+x)
        b.g.visible = false; R.add(b.g);
        careLive.bottles.push(b);
        const ring = glowP(0.16, 0.16, 0xffd8a0, 0.55, P.x, A.top + 0.008, P.z, -Math.PI / 2); ring.visible = false; careLive.rings.push(ring);
        /* (CP13, the play's vision review: at 5 cm and near-white it sat between the red one's eyes like a third eye, glowing,
           on his scowl — a catch-light now: smaller, warm, at one eye) */
        const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: tGlow, color: 0xffd8a0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false }));
        mats.push(gl.material); gl.scale.setScalar(0.03); gl.position.set(RISER.x - 0.05, A.top + A.riser + KIDS[i].h * 0.8, ALTAR_Z[i] - 0.012); gl.visible = false; R.add(gl);
        careLive.glints.push({ sp: gl, t: 0 });
        // his stick in the sand (one each), its ember the altar's own (roomLive.embers)
        /* (CP13, the geometry lens: at A.top + 0.03 its foot stood 4 mm OVER the sand, which the close inserts showed; 1 cm
           lower it goes 6 mm in — the embers' heights below follow it) */
        const sk = new THREE.Group(); sk.position.set(ROW.mid, A.top + 0.02, ALTAR_Z[i]); sk.visible = false; R.add(sk);
        cyl(0.0018, 0.0018, 0.16, 0, 0.09, 0, M({ color: 0x9a2418, roughness: 0.8 }), 5, sk);
        careLive.sticksSet.push(sk);
        // the cap and the torn sleeve, set aside on the desk
        const c = new THREE.Group(); c.position.set(DESK_AT.caps[i][0], DT + 0.018, DESK_AT.caps[i][1]); c.rotation.x = Math.PI; c.visible = false; R.add(c);
        cyl(0.0144, 0.0144, 0.013, 0, -0.0065, 0, mCapB, 18, c); careLive.capsDesk.push(c);   // (v24.2, L5-10: turned over, its height goes UP from the wood — it was 12.5 mm in the desk)
        const sl = makeSleeve(); sl.scale.set(1, 0.4, 1); sl.rotation.set(0.2, 0.4 * i, Math.PI / 2); sl.position.set(DESK_AT.sleeves[i][0], DT + 0.02, DESK_AT.sleeves[i][1]); sl.visible = false; R.add(sl);
        careLive.sleevesDesk.push(sl);
      }
      // the incense packet on the desk
      /* (v24.2, L5-10: stood on its edge, half its 3.6 cm width hangs under its origin — at DT + 0.018 the lower half of its
         printed face was in the desk) */
      { const pk = new THREE.Group(); pk.position.set(DESK_AT.packet[0], DT + 0.036, DESK_AT.packet[1]); pk.rotation.set(0, 0.5, Math.PI / 2 - 0.02); R.add(pk);
        box(0.036, 0.22, 0.012, 0, 0.11, 0, M({ map: tex(makeIncensePackT(THREE, cnv)), roughness: 0.8 }), pk, false);
        careLive.packet = pk; }
      // the things that ride his hands (never in the world: kit.hold carries them)
      { const b = makeBottle(), st = makeStraw(), sl = makeSleeve();
        b.g.add(st.g); b.g.add(sl);
        careLive.held = { g: b.g, cap: b.cap, straw: st, sleeve: sl }; }
      careLive.lighter = makeLighter();
      careLive.sticks = makeSticks();
    }
    /* the desk's bag is the counter's own (built after the room): a clone, on his desk where the home film sets it down —
       the FIRST dusk's; and tonight's, the provision shop's (§4.0c H3: "a provision-shop bag, three red bottles showing"),
       which play's z5bag is about (CP13, the films' vision review: tonight and play showed the amulet shop's bag with the
       red bundle still in its mouth, weeks later) */
    function deskBag() {
      if (careLive.deskBag || !cntLive.bag) return;
      const b = cntLive.bag.clone(); b.position.set(DESK_AT.bag[0], DESK.top + 0.018, DESK_AT.bag[1]); b.rotation.y = 0.3; b.scale.setScalar(1); b.visible = false;
      worldR.add(b); careLive.deskBag = b;
      const d = makeDrinksBag(); d.position.set(DESK_AT.bag[0], DESK.top + 0.018, DESK_AT.bag[1]); d.rotation.y = 0.25; d.visible = true;
      worldR.add(d); careLive.drinksBag = d;
    }
    /* the provision shop's carrier: plain white plastic (no words on it — Chad's ruling on chapter 4's bag), its two loop
       handles up, and over its rim the necks and caps of three red drinks (only what shows above it is built) */
    function makeDrinksBag() {
      const g = new THREE.Group();
      const mP = M({ color: 0xf0f0ea, roughness: 0.6, side: THREE.DoubleSide });
      const BW = 0.22, BD = 0.12, BH = 0.13;
      for (const [w, x, z, ry] of [[BW, 0, BD / 2, 0], [BW, 0, -BD / 2, Math.PI], [BD, BW / 2, 0, Math.PI / 2], [BD, -BW / 2, 0, -Math.PI / 2]]) {
        const sd = new THREE.Mesh(new THREE.PlaneGeometry(w, BH, 4, 3), mP); sd.position.set(x, BH / 2, z); sd.rotation.y = ry;
        const pa = sd.geometry.attributes.position;                         // (a soft, slumped plastic: its rim dips and its faces bow)
        for (let k = 0; k < pa.count; k++) { const u = pa.getX(k) / (w / 2), v = pa.getY(k) / (BH / 2);
          pa.setZ(k, 0.008 * (1 - u * u) * (0.6 + 0.4 * v)); if (v > 0.99) pa.setY(k, pa.getY(k) - 0.012 * (1 - u * u)); }
        sd.geometry.computeVertexNormals(); sd.castShadow = !LOW; sd.receiveShadow = true; g.add(sd);
      }
      const fl = new THREE.Mesh(new THREE.PlaneGeometry(BW, BD), mP); fl.rotation.x = -Math.PI / 2; fl.position.y = 0.002; g.add(fl);
      for (const sz of [-1, 1]) {                                            // the handles, a loop over each long face
        const z = sz * (BD / 2 - 0.004);
        const c = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.07, BH - 0.01, z), new THREE.Vector3(-0.05, BH + 0.07, z * 0.6),
                                              new THREE.Vector3(0.05, BH + 0.07, z * 0.6), new THREE.Vector3(0.07, BH - 0.01, z)]);
        g.add(new THREE.Mesh(new THREE.TubeGeometry(c, 16, 0.006, 6, false), mP));
      }
      /* three drinks standing in it — play's own bottle, so its clear shoulder, neck and cap show over the rim (CP13, the
         films' second vision review: the shoulders were solid red cones, and in H3's insert, close, they read as funnels) */
      for (let k = 0; k < 3; k++) {
        const b = makeBottle(); b.g.position.set((k - 1) * 0.066, 0.004, k === 1 ? 0.012 : -0.01); b.g.rotation.y = k * 1.3; g.add(b.g);
      }
      return g;
    }
    function heldReset() {
      const H = careLive.held; if (!H) return;
      careLive.capA = 0; careLive.slide = 0; careLive.bend = 0; careLive.capOff = false; careLive.sleeveOff = false; careLive.foamT = 0;
      H.cap.visible = true; H.cap.rotation.y = 0; H.cap.position.y = BOTTLE_CAP_Y;
      H.sleeve.visible = true; heldStrawFrame();
    }
    /* the straw in his hands: in its sleeve above the neck, then sliding down into the drink, then its neck bent */
    function heldStrawFrame() {
      const H = careLive.held; if (!H) return;
      const y = BOTTLE_CAP_Y + 0.02 + (0.012 - BOTTLE_CAP_Y - 0.02) * smooth(cl01(careLive.slide));
      H.straw.g.position.y = y; H.straw.top.rotation.z = -1.15 * smooth(cl01(careLive.bend));
      H.straw.g.visible = careLive.capOff;
      H.sleeve.position.y = BOTTLE_CAP_Y + 0.12; H.sleeve.visible = !careLive.sleeveOff && careLive.capOff;
    }
    function capAside(i) { const H = careLive.held; if (H) H.cap.visible = false; if (careLive.capsDesk[i]) careLive.capsDesk[i].visible = true; }
    function sleeveAside(i) { if (careLive.sleevesDesk[i]) careLive.sleevesDesk[i].visible = true; }
    function bottleShow(i, on) { const B = careLive.bottles[i]; if (B) B.g.visible = on; }
    function stickShow(i, on) { if (careLive.sticksSet[i]) careLive.sticksSet[i].visible = on; if (roomLive.embers[i]) roomLive.embers[i].visible = on; }
    /* per frame (in the room): the held bottle's place in his hands, its cap's turn and lift, the straw, the water, the
       glints, the box's lid, the bow */
    function careFrame(wdt) {
      glideFrame();
      /* the mat sits him the moment he steps onto it (§4.2: "walking onto it sits him"), as a press on it does */
      if ((phase === 'sit' || phase === 'open3') && !seated && !careBusy && !openLive.busy && getState() === 'play'
          && Math.hypot(yaw.position.x - MAT.x, yaw.position.z - MAT.z) < 0.28) { if (phase === 'sit') sitWithThem(); else sitAgain(); }
      if (careLive.incDesk) incenseFrame();
      else if (careLive.carry >= 0 && careLive.held && careLive.held.g.parent && !careLive.grip) carryFrame(careLive.held.g, 0.06);
      else if (careDone.has('lit') && sticksN() < 3 && careLive.sticks && careLive.sticks.g.parent) carryFrame(careLive.sticks.g, 0.05);
      const H = careLive.held;
      if (H && careLive.onDesk && !careLive.capOff) { H.cap.rotation.y = careLive.capA; H.cap.position.y = BOTTLE_CAP_Y + 0.004 * cl01(careLive.capA / (Math.PI * 3)); }
      heldStrawFrame();
      waterFrame();
      for (const G of careLive.glints) if (G.t > 0) {
        G.t += wdt; const k = G.t / 0.9; G.sp.material.opacity = 0.7 * Math.sin(Math.PI * cl01(k));
        if (k >= 1) { G.t = 0; G.sp.visible = false; }
      }
      careLive.boxOpen += (careLive.boxOpenTo - careLive.boxOpen) * (1 - Math.exp(-wdt / 0.35));
      if (roomLive.boxLid) roomLive.boxLid.rotation.x = -1.9 * smooth(cl01(careLive.boxOpen));
      if (roomLive.boxDrum && careLive.boxOpen > 0.5) roomLive.boxDrum.rotation.x += wdt * 2.2 * (careLive.drumRate === undefined ? 1 : careLive.drumRate);   // (C overwinds it, A lets it run down: CP8)
      if (careLive.bowT > 0) {                                // the bow: the eye dips 0.35 rad and comes back (1.6 s)
        const prev = careLive.bowT; careLive.bowT += wdt; const f = (t) => 0.35 * Math.sin(Math.PI * cl01(t / 1.6));
        pitch.rotation.x -= f(careLive.bowT) - f(prev);
        if (careLive.bowT >= 1.6) careLive.bowT = 0;
      }
    }
    /* a Continue into PLAY I: the room as its receipts say — the cups full, the drinks given set down, the cap and sleeve of
       each on the desk, the sticks given standing lit, the sticks in his hand once lit — and the step still owed; a drink
       begun and not given begins again (§10.1) */
    function careResume(tagStr) {
      careDone.clear();
      for (const r of String(tagStr || '').split(',')) if (CARE_ORDER.includes(r)) careDone.add(r);
      careBusy = false; careLive.carry = -1; careLive.grip = ''; careLive.seat = false;
      careLive.pour = careDone.has('water') ? 1 : 0; careLive.foamed = careDone.has('foam');
      KIDS.forEach((K, i) => {
        const given = careDone.has('d.' + K.key);
        careLive.placed[i] = given; bottleShow(i, given);
        if (careLive.capsDesk[i]) careLive.capsDesk[i].visible = given;
        if (careLive.sleevesDesk[i]) careLive.sleevesDesk[i].visible = given;
        stickShow(i, careDone.has('i.' + K.key));
      });
      careLive.bagSaid = careDone.has('d.red') || careDone.has('d.shy') || careDone.has('d.little');
      careLive.briefed = careLive.bagSaid;
      placeRing(-1, false);
      deskIncense(careDone.has('lit') ? 'left' : false);    // (the packet and the lighter where the lighting left them)
      if (kit) {
        kit.hold(null);
        if (careDone.has('lit') && sticksN() < 3) {          // the sticks still to give, lit, in his hand
          kit.hold(careLive.sticks.g, { pos: STICKS_R.pos, rot: STICKS_R.rot, bare: true });
          const n = sticksN();                                      // (the ones given leave his hand from the first: giveStick)
          careLive.sticks.tips.forEach((T, j) => { T.fl.visible = false; T.em.visible = j >= n; });
          careLive.sticks.g.children.forEach((c, j) => { c.visible = j >= n; });
        }
      }
    }
    /* the room's PLAY I as build() leaves it (the reset law) */
    function careReset() {
      careDone.clear(); careBusy = false;
      Object.assign(careLive, { carry: -1, pour: 0, foamed: false, foamT: 0, briefed: false, bagSaid: false, seat: false, grip: '',
                                capA: 0, slide: 0, bend: 0, capOff: false, sleeveOff: false, catchK: 0, sparkT: 0, boxOpen: 0, boxOpenTo: 0, bowT: 0,
                                lighterOn: false });
      deskBottle(false); deskIncense(false);
      if (careLive.deskBag) careLive.deskBag.visible = false;        // (play's desk: tonight's bag of drinks, CP13)
      if (careLive.drinksBag) careLive.drinksBag.visible = true;
      careLive.placed = [false, false, false];
      for (let i = 0; i < 3; i++) { bottleShow(i, false); stubShow(i, false); if (careLive.capsDesk[i]) careLive.capsDesk[i].visible = false;
                                    if (careLive.sleevesDesk[i]) careLive.sleevesDesk[i].visible = false; }
      for (const G of careLive.glints) { G.t = 0; G.sp.visible = false; }
      placeRing(-1, false);
      if (careLive.lighter) careLive.lighter.flame.visible = false;
      if (careLive.sticks) { careLive.sticks.tips.forEach(T => { T.em.visible = false; T.fl.visible = false; }); careLive.sticks.g.children.forEach(c => { c.visible = true; }); }
      careLive.glide = null;
      pourStop(0.12);
      if (roomLive.boxKey) roomLive.boxKey.rotation.x = 0;
      if (roomLive.jug) roomLive.jug.rotation.x = 0;
      waterFrame();
    }
    /* probes only: one of PLAY I's held moments, held still — so the props in his hands are photographed against their
       poses without a minigame running (the poses are eased on wall time; a probe waits them out) */
    function careLab(what, k = 0) {
      if (!kit || !careLive.held) return false;
      kit.hold(null); careLive.grip = ''; careLive.lighterOn = false; deskIncense(false);
      if (what === 'bottle' || what === 'straw') {
        heldReset(); deskBottle(true);
        if (what === 'straw') { careLive.capOff = true; careLive.slide = k; if (careLive.held) careLive.held.cap.visible = false; }
        else careLive.capA = k;
        if (kit.handPose) kit.handPose(null, 0, { secs: 0.05 });
      } else if (what === 'carry') {
        if (kit.handPose) kit.handPose(null, 0, { secs: 0.05 });
        careLive.capOff = true; careLive.slide = 1; careLive.bend = 1;
        kit.hold(careLive.held.g, { pos: HELD_R.pos, rot: HELD_R.rot, bare: true });
      } else if (what === 'lighter') {                        // (k: 0 unlit, 1 lit, 1..2 the sticks leaning in)
        deskIncense('stage');
        careLive.lighter.flame.visible = k > 0.5;
        careLive.catchK = Math.max(0, k - 1);
        if (kit.handPose) kit.handPose(null, 0, { secs: 0.05 });
      } else if (kit.handPose) kit.handPose(null, 0, { secs: 0.05 });
      return true;
    }
    /* THE ROOM'S ARRIVAL LOOK: onto the altar — from the jug at its near end to the little one at its far end, the middle
       of that span, and down onto them — on any screen (by photograph, CP5: from the door at the old look a phone saw a
       bare wall, the altar and the first order's jug off its right edge) */
    function roomArriveLook() {
      const az = (x, z) => Math.atan2(-(x - yaw.position.x), -(z - yaw.position.z));
      const a0 = az(ROW.mid, ALTAR.z0 + 0.08), a1 = az(RISER.x, ALTAR_Z[2]);
      /* (a narrow screen leans toward the jug, the first order: at the span's middle a phone put its mark on the frame's
         left edge — by photograph — so there the aim is a third of the way along, the little one at the right edge) */
      const f = 0.5 - 0.17 * cl01((1.0 - camera.aspect) / 0.54);
      yaw.rotation.y = a0 + Math.atan2(Math.sin(a1 - a0), Math.cos(a1 - a0)) * f;
      pitch.rotation.x = -0.6;
    }

    /* THE DOUBLES (CP7, §4.4): each child's own scan, a light in his shape — translucent, glowing at its edges (a rim that
       brightens where the surface turns away from the lens), its colour his (red-gold, amber, pale blue). The FAR level's
       geometry (100–141k triangles; the near level is for a macro and is 4–10× that), under one unlit shader: additive, no
       depth write, so the room shows through him and he never hides behind a seam of his own. Unlit, so no light state of
       the room's makes a new program for it (v15.1), and the curtain's warm compiles it (it hangs in the room, hidden).
       Never a block figure: the scan or nothing (the v21.16 rule) — until the scan has landed there is no double. */
    const DOUBLE_TINT = [0xffa060, 0xffc070, 0x9cc8ff];        // the red one's red-gold, the shy one's amber, the little one's pale blue
    const doubles = [null, null, null];
    function makeDoubleMat(hex) {
      const m = new THREE.ShaderMaterial({
        uniforms: { uCol: { value: new THREE.Color(hex) }, uK: { value: 0 }, uRim: { value: 1.8 } },
        vertexShader: `varying vec3 vN; varying vec3 vV;
          void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
                        gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `uniform vec3 uCol; uniform float uK; uniform float uRim; varying vec3 vN; varying vec3 vV;
          void main() { float r = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), uRim);
                        gl_FragColor = vec4(uCol * (0.34 + 1.2 * r) * uK, 1.0); }`,   // (the body's share raised from 0.18: by photograph, a small one far off read as rings)
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.FrontSide, toneMapped: false, fog: false
      });                                                         // (front faces only: both sides of every fold added up into rings — by photograph)
      mats.push(m);
      return m;
    }
    /* THE DEPTH PRIME: the same body drawn first into depth alone, so the light above is drawn on its NEAREST surface only.
       The scans carry shells inside shells (the robe over the body, the garland over both), and additive light adds every
       one of them: front faces alone still read as rings on a small one seen from above (by photograph, the shy one at
       the mat). Drawn in the transparent pass (after the room, which it must never punch through), just before the light
       (renderOrder 4, the light 5), the same vertex code so the depths agree, pushed a hair back so the nearest surface
       passes the light's test and the shells behind it do not */
    let doublePrime = null;
    function makeDoublePrime() {
      if (doublePrime) return doublePrime;
      doublePrime = new THREE.ShaderMaterial({
        vertexShader: `void main() { vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `void main() { gl_FragColor = vec4(0.0); }`,
        transparent: true, colorWrite: false, depthWrite: true, depthTest: true, side: THREE.FrontSide,
        polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 2, toneMapped: false, fog: false
      });
      mats.push(doublePrime);
      return doublePrime;
    }
    /* his double: built from the far level the moment the scan has landed (and kept: one per child, in the room) */
    function doubleOf(i) {
      if (doubles[i]) return doubles[i];
      const L = kidLive[i]; if (!L || !L.ready || !L.farSrc) return null;
      const K = KIDS[i], mat = makeDoubleMat(DOUBLE_TINT[i]);
      const g = new THREE.Group(), body = L.farSrc.clone(), prime = L.farSrc.clone();
      body.traverse(o => { if (o.isMesh) { o.material = mat; o.castShadow = false; o.receiveShadow = false; o.renderOrder = 5; } });
      prime.traverse(o => { if (o.isMesh) { o.material = makeDoublePrime(); o.castShadow = false; o.receiveShadow = false; o.renderOrder = 4; } });
      g.add(prime); g.add(body); g.scale.setScalar(K.h);
      g.position.copy(L.altar.position); g.rotation.y = L.altar.rotation.y;
      g.visible = false; worldR.add(g);
      doubles[i] = { g, mat, K, home: g.position.clone(), ry: g.rotation.y };
      return doubles[i];
    }
    /* a double's light, 0..1 (its uK), and where it stands — the films write both every frame from their own clocks */
    function doubleSet(i, k, x, y, z, ry, s = 1) {
      const D = doubleOf(i); if (!D) return;
      D.g.visible = k > 0.003; D.mat.uniforms.uK.value = k;
      if (x != null) D.g.position.set(x, y, z);
      if (ry != null) D.g.rotation.y = ry;
      D.g.scale.setScalar(D.K.h * s);
    }
    function doublesOff() { for (let i = 0; i < 3; i++) if (doubles[i]) { doubles[i].g.visible = false; doubles[i].mat.uniforms.uK.value = 0; doubles[i].g.position.copy(doubles[i].home); doubles[i].g.rotation.y = doubles[i].ry; } }
    /* ======================================================== PLAY II · THE QUESTION, AND THE OPENINGS (CP7, §4.3)
       After the dedication: the music box's last phrase, his look on each face, and his question — then three orders, one
       child at a time, each answered by a press on that child and a YIELD (S38: press and hold, the ring fills; let go
       and it waits — never graded, never failed). Filled, the possession plays (a film from play, its own clock), and
       hands him back where it left him, the next order open. The third fills by itself once pressed: each time the door
       opens more easily, because he has already opened it twice (the case file's "one after another"). What a Continue
       must not lose: the phase — open1 (asked), open2 (the red one done, on the mat), open3 (the shy one done, by the
       desk), after (the little one done, on the floor by the bed), decide. */
    const openLive = { busy: false, briefed: false, k: 0, kid: -1, smearW: 0, held: false, loosenS: null, loosenUsed: false, sink: 1 };
    const OPEN_I = { open1: 0, open2: 1, open3: 2 };
    function openOk() { return OPEN_I[phase] !== undefined && !openLive.busy && quiet(); }
    function openObjective() {
      if (openLive.busy) return null;
      const i = OPEN_I[phase];
      if (i === 2 && !seated) return W.objSitAgain;               // by the desk, after the shy one: back to the mat first
      return [W.objOpenRed, W.objOpenShy, W.objOpenLittle][i];
    }
    /* the question (§4.3): the box's tune ends; his look rests on the red one, the shy one, the little one; he wonders what
       they feel, and then he asks it */
    function askBeat() {
      /* (CP13, the save lens: open1 is written when the question has been asked — written first, a Continue in its ten
         seconds landed on the first opening with "What would happen..." never said; until then a Continue sits him down
         again, the dedication and the question with it) */
      openLive.busy = true; if (kit) kit.objective(null);
      careLive.boxOpenTo = 1;                                      // (the lid stays up: the tune ends on its own)
      let t = 0.6;
      for (let i = 0; i < 3; i++) { const j = i; after(t, () => viewTo(kidYaw(j), kidPitch(j), 1.1)); t += 1.6; }
      after(t, () => {
        queueLine('z5wonder');                                     // "Every night they just sit here... I wonder what they feel."
        queueGap(1.0);
        queueLine('z5ask');                                        // "What would happen... if I deliberately opened myself to my own Kumanthong?"
        queueGap(0.6);
        /* his look back to the red one, the first order's, before it opens (by photograph: it stayed on the little one,
           the last face, with the red one off a phone's frame) */
        queueFn(() => { viewTo(kidYaw(0), kidPitch(0), 0.9); after(0.95, () => { openLive.busy = false; setPhase('open1'); }); });
      });
    }
    /* where his look goes to see one of them from the mat */
    function kidYaw(i) { const dx = RISER.x - yaw.position.x, dz = ALTAR_Z[i] - yaw.position.z; return Math.atan2(-dx, -dz); }
    function kidPitch(i) {
      const d = Math.hypot(RISER.x - yaw.position.x, ALTAR_Z[i] - yaw.position.z);
      return Math.atan2(ALTAR.top + ALTAR.riser + KIDS[i].h * 0.6 - yaw.position.y, d);
    }
    /* THE YIELD: on the child, the ring filling while held; the room loosening with it — its sound sinking, the edges of
       sight softening, the three threads of smoke leaning toward him, the child's eyes catching the lamp and holding it */
    function openPress(i) {
      if (OPEN_I[phase] !== i || !seated || !openOk() || !kit || !kit.event) return false;
      const K = KIDS[i];
      /* (CP13: the order goes WITHOUT the jade OBJECTIVE COMPLETE — opening himself to them is the act the epilogue
         tells everybody never to repeat, and a HUD that congratulates it says the opposite: v8.7's `complete: false`) */
      openLive.busy = true; openLive.kid = i; kit.objective(null, { complete: false });
      openLive.loosenUsed = false;
      if (i === 0) queueLine('z5loose');                           // "Just... let my mind loosen." (the first time)
      const first = !openLive.briefed; openLive.briefed = true;
      kit.event({ kind: 'yield', label: [W.objOpenRed, W.objOpenShy, W.objOpenLittle][i], brief: first ? (TOUCHY ? W.briefYield : W.briefYieldKey) : undefined,
        demo: 'press', fill: K.yieldSecs, back: 0.45, auto: !!K.auto, autoAfter: 9999,
        at: () => ({ x: RISER.x, y: ALTAR.top + ALTAR.riser + K.h * 0.62, z: ALTAR_Z[i] }),
        onHold: (k, held) => { openLive.k = k; openLive.held = !!held; loosenSound(); },
      }).then((r) => {
        if (!alive || (r && r.aborted)) return;
        openLive.k = 0; openLive.held = false;                   // (the loosening lets go as the film takes over: its own light and lens)
        loosenStop(0.6);
        possess(i);
      });
      return true;
    }
    /* THE YIELD'S SOUND (CP13, the sound lens: §5's design had none of it). The riser — a breath turning into a hum, his
       breathing slowing in it — starts the first time he holds, is heard only while he holds (let go, and it eases
       away with everything else), once per yield; and the room's own beds sink under it by k (mixBeds) */
    const LOOSEN_VOL = 0.5;
    function loosenSound() {
      if (!openLive.held || openLive.loosenS || openLive.loosenUsed || openLive.kid < 0) return;
      openLive.loosenUsed = true;
      const S = openLive.loosenS = sfxAt('k5loosen', LOOSEN_VOL, RISER.x, ALTAR_Z[openLive.kid]);
      if (S) S.addEventListener('ended', () => { if (openLive.loosenS === S) openLive.loosenS = null; });
    }
    function loosenStop(secs) { const S = openLive.loosenS; openLive.loosenS = null; sfxDown(S, secs); }
    function loosenGain() {
      const S = openLive.loosenS, g = S && S.__g && S.__g.gain; if (!g) return;
      try { g.setTargetAtTime(openLive.held ? LOOSEN_VOL : 0.0001, S.context.currentTime, 0.12); } catch { /* over */ }
    }
    /* the room loosening by k (every frame while a yield runs, and back to nothing after) */
    function openFrame(wdt) {
      loosenGain();
      const k = openLive.busy && openLive.kid >= 0 && phase !== 'after' ? openLive.k : 0;
      openLive.sink += ((1 - 0.6 * cl01(k)) - openLive.sink) * (1 - Math.exp(-(wdt || 0) / 0.5));
      if (kit && kit.smear) {
        const want = 0.22 * k;
        if (Math.abs(want - (openLive.smearW || 0)) > 0.02) { openLive.smearW = want; kit.smear(want, { secs: 0.3 }); }
      }
      roomLive.smokeLean = k;                                      // (the room's smoke frame leans the threads toward the mat)
      for (let i = 0; i < 3; i++) { const G = careLive.glints[i]; if (G && openLive.kid === i && k > 0.6 && G.t === 0) { G.t = 0.0001; G.sp.visible = true; } }
    }
    /* the possessions: a film from play (§4.4), its first time unskippable (S41), handing him back where it leaves him */
    function possess(i) {
      const key = ['red', 'shy', 'little'][i];
      const firstTime = !(ctx.sealedBefore && ctx.sealedBefore('e3c5'));
      const done = () => {
        if (!alive) return;
        openLive.busy = false; openLive.k = 0; openLive.kid = -1; peekSet(0);
        if (kit && kit.smear) { kit.smear(0, { secs: 0.4 }); openLive.smearW = 0; }
        /* (v24.2, L1-7: the order and its marks wait for the picture — the film ends on black and the kit's fade lifts
           it; posted at once, "Sit with them" and the mat's "!" stood on the black. wDark holds both, as an arrival's) */
        if (i < 2) wDark = true;
        if (i === 0) { landOn('mat'); lookToOrder(1); roomClock('23:21'); setPhase('open2'); }      // (§10.1: the clock as each one left it)
        else if (i === 1) { landOn('desk'); lookToOrder(2); roomClock('23:49'); setPhase('open3'); }   // (CP13: 23:33 made z5time's "almost three hours" to 02:47 three and a quarter)
        else { landOn('bed'); setPhase('after'); afterBeat(false); return; }
        if (kit) kit.fade(0, 0.8);
        after(0.7, () => { wDark = false; objectiveFor(phase); });
      };
      if (!kit || !kit.film || !kit.film(key, { noSkip: firstTime, onDone: done })) done();
    }
    /* where a possession leaves him: on the mat (the red one's flop), sitting on the floor by the desk (the shy one's), or
       on the floor against the bed's frame (the little one's) — the pose and the look the film's last frame had */
    function landOn(where) {
      if (!kit) return;
      if (where === 'mat') { sitDown(true); return; }
      seated = false;
      if (where === 'desk') { yaw.position.x = -0.05; yaw.position.z = -0.85; kit.root(true); kit.pose('lying', { y: 0.62, yaw: -Math.PI * 0.62, span: 1.2, pitchLo: -0.8, pitchHi: 0.5, secs: 0.05 }); }
      /* (by the bed his neck's range is centred between the altar and the clock behind him on the left — 2.1 rad apart — so
         the aftermath can turn him to both: centred on the altar, the clamp held the look 0.9 rad short of the clock) */
      else { yaw.position.x = BYBED.x; yaw.position.z = BYBED.z; kit.root(true); kit.pose('lying', { y: BYBED.eye, yaw: -0.55, span: 1.3, pitchLo: -0.8, pitchHi: 0.5, secs: 0.05 }); }
    }
    /* back to the mat after the shy one (open3): the mat's own order, then the little one's */
    function sitAgain() {
      if (phase !== 'open3' || seated || !quiet() || openLive.busy) return false;
      if (kit) kit.objective(null);                                    // (v24.2, L1-7: he has sat — the little one's order follows the turn)
      chairHome();                                                     // (v24.2, L5-6: behind him from the mat)
      if (kit) kit.pose('standing', { secs: 0.3 });
      sitDown(false);
      if (kit) kit.setPhase('open3:mat');                            // (v24.2, L2-2: back on the mat — a receipt; openResume reads it)
      /* and his look onto the little one, whose order is next (by photograph: sat down, a phone looked at the box and the
         pinwheel, the order's child off its edge) */
      { const dx = RISER.x - MAT.x, dz = ALTAR_Z[2] - MAT.z;
        viewTo(Math.atan2(-dx, -dz), Math.atan2(ALTAR.top + ALTAR.riser + KIDS[2].h * 0.6 - MAT_EYE, Math.hypot(dx, dz)), 0.9); }
      after(1.0, () => objectiveFor('open3'));
      return true;
    }
    /* THE AFTERMATH (§4.6, play): on the floor by the bed; his look drawn to the clock (02:47 — it read 23:12); the room's
       evidence; his look on the three; and the decision opens by itself (the altar is the pile) */
    function afterBeat(resumed) {
      openLive.busy = true; if (kit) kit.objective(null);
      if (worldSfx && !(soundOff && soundOff())) worldSfx('k5after', 0.45);   // one held note of the lullaby, unresolved (CP11)
      roomClock('02:47');
      afterEvidence();
      if (kit) kit.fade(0, resumed ? 0.8 : 1.6);
      /* the phone on the floor beside him wakes, and his look goes down to it: 02:47 (the screen sleeps again after) */
      after(resumed ? 0.4 : 2.0, () => { phone.S.draw('time', 0, '02:47'); phoneLook(1.2); after(7.5, () => phone.S.draw('dark')); });
      queueGap(resumed ? 0.8 : 3.6);
      queueLine('z5time');                                         // "Almost three hours... gone."
      queueGap(1.4);
      queueFn(() => { for (let i = 0; i < 3; i++) { const j = i; after(j * 1.4, () => viewTo(kidYaw(j), kidPitch(j), 1.0)); } });
      queueGap(4.4);
      queueLine('z5felt');                                         // "To be wanted... to be found... to not be left alone. That's all they ever wanted."
      queueGap(0.8);
      queueLine('z5fasc');                                         // "And at that moment... I was fascinated by it."
      queueFn(() => { const v = decLook(); viewTo(v.ry, v.px, 1.0); });   // the three, where the decision's panel leaves them
      queueGap(1.1);
      queueFn(() => { openLive.busy = false; setPhase('decide'); openDecision(); });
    }
    /* what the night left (each also stood up by a Continue past it): the sticks burnt to grey stubs, the red one's bottle
       half empty, the top carton on the floor, the coin by the desk */
    function afterEvidence() {
      phone.g.visible = true;
      for (let i = 0; i < 3; i++) stubShow(i, true);
      const B = careLive.bottles[0]; if (B && B.liq) B.liq.scale.y = 0.5;
      if (roomLive.cartonTop) cartonDown(true);
      if (roomLive.coin) roomLive.coin.visible = true;
    }
    /* where his look goes to read the clock on the bedside table (its face at (−1.29, 0.53, −1.07), turned to the room) */
    const CLOCK_AT = { x: -1.285, y: 0.534, z: -1.073 };
    function clockYaw() { return Math.atan2(-(CLOCK_AT.x - yaw.position.x), -(CLOCK_AT.z - yaw.position.z)); }
    function clockPitch() { return Math.atan2(CLOCK_AT.y - yaw.position.y, Math.hypot(CLOCK_AT.x - yaw.position.x, CLOCK_AT.z - yaw.position.z)); }
    /* a Continue into PLAY II (§10.1): the offerings all given (their drinks on the runner, a stick lit before each), the box
       played out, the clock at 23:12 — and what each possession left behind it: after the red one, his bottle half drunk
       and the top carton on the floor (open2 on); after the shy one, the coin by the desk (open3 on); after the little one,
       the sticks burnt to stubs and the clock at 02:47 (after, decide). He is put where the last one left him, and the order
       still open is offered (the question is not asked twice) */
    function openResume(p, tag) {
      const n = { open1: 0, open2: 1, open3: 2, after: 3, decide: 3 }[p] || 0;
      careLive.boxOpen = careLive.boxOpenTo = 1;
      roomClock(['23:12', '23:21', '23:49', '02:47'][Math.min(3, n)]);
      if (n >= 1) { const B = careLive.bottles[0]; if (B && B.liq) B.liq.scale.y = 0.5; cartonDown(true); }
      if (n >= 2 && roomLive.coin) { roomLive.coin.visible = true; roomLive.coin.position.set(BYDESK.x + 0.18, 0.004, BYDESK.z + 0.1); roomLive.coin.rotation.set(0, 0.4, 0); }
      if (n >= 3) { for (let i = 0; i < 3; i++) stubShow(i, true); look('NIGHT', 0); phone.g.visible = true; phone.S.draw('dark'); }
      /* (v24.2, L2-2: back on the mat after the shy one is a receipt of its own — `open3:mat`, written by sitAgain — so
         a Continue from the little one's film, which saves as it starts, sits him where he sat, not by the desk again) */
      if (n === 0 || n === 1 || (n === 2 && tag === 'mat')) landOn('mat');
      else if (n === 2) { landOn('desk'); chairShoved(); }             // (v24.2, L5-6: as the film left it)
      else landOn('bed');
      lookToOrder(n);
      openLive.busy = false;
    }
    /* his look where the order still open is: on that child from the mat, at the seated eye; on the mat from beside the
       desk. A Continue lands on it (by photograph: one into open1 left a phone looking past the red one, off the frame's
       left edge), and so does the end of a possession — a film hands play back the look it was STARTED from, so after
       the red one his eyes were back on the red one with the order asking for the shy one (by photograph) */
    function lookToOrder(n) {
      if (n <= 1 || (n === 2 && seated)) {                       // (on the mat: onto that child — v24.2, L2-2: the little one too)
        const dx = RISER.x - MAT.x, dz = ALTAR_Z[n] - MAT.z;
        yaw.rotation.y = Math.atan2(-dx, -dz);
        pitch.rotation.x = Math.atan2(ALTAR.top + ALTAR.riser + KIDS[n].h * 0.6 - MAT_EYE, Math.hypot(dx, dz));
      } else if (n === 2) {
        const dx = MAT.x - BYDESK.x, dz = MAT.z - BYDESK.z;
        yaw.rotation.y = Math.atan2(-dx, -dz); pitch.rotation.x = -0.3;
      } else { const v = decLook(); yaw.rotation.y = v.ry; pitch.rotation.x = v.px; }   // (after, decide: the decision's framing)
    }
    /* THE THREE ABOVE A PHONE'S DECISION PANEL (by photograph: on the little one's level look they stood in the middle of
       a phone's screen, under the panel, which covers its lower two thirds, while the stat bars cover its top fifth) —
       the shy one in the middle of the three, and his eye lowered until they stand in the band between the two; on a
       wide screen the panel sits low (e3c4's tDec) and they stand a little above the middle */
    function decLook() {                                       // (from where landOn('bed') puts him: his eye may still be easing there)
      const dx = RISER.x - BYBED.x, dz = ALTAR_Z[1] - BYBED.z, d = Math.hypot(dx, dz);
      const mid = Math.atan2(ALTAR.top + ALTAR.riser + 0.12 - BYBED.eye, d);   // (the three stand 0.20–0.26 on the riser)
      const ndc = camera.aspect < 1 ? 0.47 : 0.25;
      return { ry: Math.atan2(-dx, -dz), px: mid - Math.atan(ndc * Math.tan(camera.fov * Math.PI / 360)) };
    }
    /* PLAY II as build() leaves it (the reset law): no double, nothing a possession moved still moved */
    function openReset() {
      openLive.busy = false; openLive.briefed = false; openLive.k = 0; openLive.kid = -1; openLive.smearW = 0;
      openLive.held = false; openLive.loosenUsed = false; openLive.sink = 1; loosenStop(0.12);
      doublesOff();
      cartonDown(false);
      if (roomLive.curtain) roomLive.curtain.rotation.y = 0;
      if (roomLive.coin) { roomLive.coin.visible = false; roomLive.coin.position.copy(roomLive.coin.userData.home); roomLive.coin.rotation.set(0, 0, 0); }
      const B = careLive.bottles[0]; if (B) { if (B.liq) B.liq.scale.y = 1; if (B.home) B.g.position.copy(B.home); }
      for (let i = 0; i < 3; i++) stubShow(i, false);
      cityOut(-1);
      for (const R of RATTLE) R.o.position.y = R.y0;
      redLive.stamps.length = 0; redLive.taps = 0; redLive.auto = false;
      shyLive.gap = 0; peekSet(0); lensOff();
      phone.g.visible = false; phone.S.draw('dark');
      littleLive.cameBack = false; littleLive.slipN = 0; littleLive.briefed = false;
      fLive.shot = '';
    }
    /* POSSESSION 1 · THE RED ONE (§4.4, ~36 s): every picture a function of the film's own clock (a seek, a skip and a slow
       frame land on the same picture). From his eyes on the mat: the red double rises off its base and comes to him the
       way a child runs up to be picked up; CONTACT, a warm bloom, the room RED-GOLD, the lens wider; he STANDS, hands on
       his hips, chin up — and the player's STAMP (three taps; untapped, he stamps by himself); he marches the room like a
       king (the curtain swept aside, the city below; the top carton swiped off the stack); his own bottle to his mouth,
       slurped half empty and slammed down; the tantrum burns out, he flops onto the mat, arms crossed, and the bossy voice
       goes small; the double settles back into its figure like a sigh; himself again, breathing hard. Nothing in the room
       moves by itself: only what his own hand did. */
    const redLive = { stamps: [], taps: 0, lastTap: -9, nowT: 0, auto: false };
    const MAT_EYE = 0.90, STAND_EYE = 1.62;
    /* his path through the room (x, eye, z, and where he looks), and the times he reaches each place */
    const RED_PATH = [
      { t: RFT.stand, p: [MAT.x, STAND_EYE, MAT.z], look: [RISER.x, 1.0, ALTAR_Z[0]] },
      { t: RFT.march, p: [MAT.x, STAND_EYE, MAT.z], look: [RISER.x, 1.0, ALTAR_Z[0]] },
      { t: RFT.win, p: [1.0, STAND_EYE, 1.32], look: [1.75, 1.05, 0.55] },          // the window: the curtain aside, the city below
      { t: RFT.desk, p: [0.72, STAND_EYE, -0.92], look: [0.62, 0.22, -1.58] },      // the ROADEYE stack, its top carton
      { t: RFT.back, p: [0.92, STAND_EYE, 0.12], look: [RISER.x, 0.95, ALTAR_Z[0]] },// back at the altar, his own place
      { t: RFT.flop, p: [0.92, STAND_EYE, 0.12], look: [RISER.x, 0.95, ALTAR_Z[0]] },
      { t: RFT.flop + 0.6, p: [MAT.x, MAT_EYE, MAT.z], look: [RISER.x, 0.92, ALTAR_Z[0]] },
      /* and at the end a long look at the shy one, whose turn it is next (§4.4: "a long look at the shy one; the order
         returns" — by photograph, the film ended on the red one's face with the next order on a child out of the frame) */
      { t: RFT.end - 3.4, p: [MAT.x, MAT_EYE, MAT.z], look: [RISER.x, 0.92, ALTAR_Z[0]] },
      { t: RFT.end - 1.8, p: [MAT.x, MAT_EYE, MAT.z], look: [RISER.x, 0.90, ALTAR_Z[1]] }
    ];
    function pathAt(P, t) {
      if (t <= P[0].t) return P[0];
      for (let j = 1; j < P.length; j++) if (t < P[j].t) {
        const a = P[j - 1], b = P[j], k = smooth(cl01((t - a.t) / (b.t - a.t)));
        return { p: lerp3(a.p, b.p, k), look: lerp3(a.look, b.look, k), k };
      }
      return P[P.length - 1];
    }
    const redF = {
      T: RFT,
      begin() { fLive.shot = 'red'; fLive.lit = null; redLive.taps = 0; redLive.lastTap = -9; redLive.stamps.length = 0; redLive.auto = false; },
      end() {
        fLive.shot = ''; lensTo(72); doublesOff();
        look('NIGHT', 0.01);
      },
      /* a tap of the STAMP (the event's progress), or one he makes himself: the lens bobs, the bottles and the bowls jump
         on the runner (a damped spring each), ash drops from the sticks */
      frame(t, api) {
        if (fLive.shot !== 'red') redF.begin();
        redLive.nowT = t;                                       // (a tap lands at the film's own time)
        const D0 = doubleOf(0), K = KIDS[0], baseY = KID_BASE;
        /* the double: up off its base, toward him, into him */
        if (t < RFT.contact + 0.3) {
          const kr = smooth(cl01(t / RFT.come)), kc = smooth(cl01((t - RFT.come) / (RFT.contact - RFT.come)));
          const from = [RISER.x, baseY + 0.04 * kr, ALTAR_Z[0]], to = [MAT.x + 0.30, MAT_EYE - 0.12, MAT.z - 0.02];
          const q = lerp3(from, to, kc);
          doubleSet(0, (0.35 + 0.65 * kr) * (1 - smooth(cl01((t - RFT.contact) / 0.3))), q[0], q[1], q[2], -Math.PI / 2, 1 + 0.15 * kr);
        } else if (t < RFT.leave) doubleSet(0, 0);
        else {                                                  // settling back into its figure like a sigh
          const kl = smooth(cl01((t - RFT.leave) / 2.2));
          const q = lerp3([yaw.position.x + 0.25, yaw.position.y - 0.1, yaw.position.z], [RISER.x, baseY, ALTAR_Z[0]], kl);
          doubleSet(0, 0.8 * Math.sin(Math.PI * cl01(kl * 1.0 + 0.0001)), q[0], q[1], q[2], -Math.PI / 2, 1.15 - 0.15 * kl);
        }
        /* the light and the lens: RED-GOLD from contact to the settling, 72 → 84 → 72 */
        if (t >= RFT.contact && t < RFT.leave) { if (fLive.lit !== 'RED') { look('RED', 0.6); fLive.lit = 'RED'; } }
        else if (t >= RFT.leave && fLive.lit !== 'NIGHT') { look('NIGHT', 2.0); fLive.lit = 'NIGHT'; }
        const kw = smooth(cl01((t - RFT.contact) / 0.8)) * (1 - smooth(cl01((t - RFT.leave) / 2.2)));
        lensTo(72 + (K.lens - 72) * kw);
        /* where he is and where he looks */
        let P, L;
        if (t < RFT.stand) { P = [MAT.x, MAT_EYE, MAT.z]; L = [RISER.x, baseY + 0.12 + 0.2 * smooth(cl01((t - RFT.come) / 1.0)) * 0, ALTAR_Z[0]]; }
        else {
          const A = pathAt(RED_PATH, t); P = A.p; L = A.look;
          const ks = smooth(cl01((t - RFT.stand) / 0.6)); if (t < RFT.stand + 0.6) P = [P[0], MAT_EYE + (STAND_EYE - MAT_EYE) * ks, P[2]];
        }
        /* a child's bouncing walk while he marches, the stamps' bob, his chin up (8 degrees) while he is the red one */
        let bob = 0;
        if (t >= RFT.march && t < RFT.flop) bob += 0.025 * Math.abs(Math.sin((t - RFT.march) * Math.PI * 2.2));
        for (const s of redLive.stamps) { const u = t - s; if (u >= 0 && u < 0.5) bob -= 0.05 * Math.sin(Math.PI * u / 0.5); }
        camAt(P[0], P[1] + bob, P[2], L[0], L[1], L[2]);
        if (t >= RFT.stand && t < RFT.flop) pitch.rotation.x += 0.14 * smooth(cl01((t - RFT.stand) / 0.5)) * (1 - smooth(cl01((t - RFT.flop + 0.6) / 0.6)));
        /* his hands: on his hips from the stand, reaching for his bottle at the grab, crossed after the flop, down at the end */
        if (api && api.handPose) {
          /* (hips and the crossed arms raised clear of the letterbox's bottom bar, `sy`: drawn for play, both sat behind it) */
          /* (CP13, the films lens: the hands JUMPED twice — hips straight to the rest at the grab, then reaching up out of
             it, and the reach snapped to the rest after the slam. The reach now blends FROM the hips, and lets go over
             half a second) */
          if (t >= RFT.stand && t < RFT.grab) api.handPose('hips', smooth(cl01((t - RFT.stand) / 0.5)));
          else if (t >= RFT.grab && t < RFT.slam + 0.4) api.handPose('reach', smooth(cl01((t - RFT.grab) / 0.5)), { from: 'hips' });
          else if (t >= RFT.slam + 0.4 && t < RFT.slam + 0.9) api.handPose('reach', 1 - smooth(cl01((t - RFT.slam - 0.4) / 0.5)));
          else if (t >= RFT.flop + 0.6 && t < RFT.leave + 1.5) api.handPose('cross', smooth(cl01((t - RFT.flop - 0.6) / 0.5)) * (1 - smooth(cl01((t - RFT.leave - 0.8) / 0.7))));
          else api.handPose(null, 0);
        }
        /* the runner's things jump at each stamp and at the slam (a damped spring), and the window's curtain is swept aside */
        redRattle(t);
        if (roomLive.curtain) roomLive.curtain.rotation.y = -0.9 * smooth(cl01((t - RFT.win + 0.4) / 0.5)) * (1 - smooth(cl01((t - 26) / 2)));
        /* the top carton: swiped off the stack at the desk, on the floor from then on */
        if (roomLive.cartonTop) cartonFall(cl01((t - RFT.desk - 0.2) / 0.7));
        /* his bottle: up to his mouth at the grab, slurped half empty, slammed down */
        redBottle(t);
      }
    };
    /* the runner's things jump: each stamp and the slam set a damped spring under every bottle, cup and bowl (a function of
       the film's clock and the list of stamp times, so a seek lands on the same picture) */
    const RATTLE = [];                                           // filled at build: { o, y0 } for each bottle, cup and bowl
    function redRattle(t) {
      let a = 0;
      for (const s of redLive.stamps) { const u = t - s; if (u >= 0 && u < 0.9) a += 0.006 * Math.exp(-u * 5) * Math.abs(Math.sin(u * 38)); }
      { const u = t - RFT.slam; if (u >= 0 && u < 1.2) a += 0.012 * Math.exp(-u * 4) * Math.abs(Math.sin(u * 30)); }
      for (const R of RATTLE) R.o.position.y = R.y0 + a * (0.6 + 0.4 * Math.sin(R.y0 * 977));
    }
    /* the top carton swiped off the stack: off its place, over, and onto the floor beside the stack (k 0 → 1); it stays down */
    function cartonFall(k) {
      const C = roomLive.cartonTop; if (!C) return;
      const H = C.userData.home, kk = k * k;
      C.position.set(H.x + 0.22 * k, H.y + (0.08 - H.y) * kk + 0.08 * Math.sin(Math.PI * k), H.z + 0.28 * k);   // (on its side: 0.16 deep)
      C.rotation.set(Math.PI / 2 * k, H.ry + 0.4 * k, 0);
    }
    function cartonDown(on) { if (roomLive.cartonTop) cartonFall(on ? 1 : 0); }
    /* his own bottle: lifted from its place to his mouth (the straw's bend to his lips) at the grab, its level falling by half
       through the slurp, slammed back down at the slam — written in the world, in front of the lens */
    const _rb = new THREE.Vector3(), _rf = new THREE.Vector3();
    function redBottle(t) {
      const B = careLive.bottles[0]; if (!B) return;
      const home = B.home || (B.home = B.g.position.clone());
      const up = smooth(cl01((t - RFT.grab) / 0.8)) * (1 - smooth(cl01((t - RFT.slam) / 0.25)));
      if (up > 0.001) {
        camera.getWorldPosition(_rb); camera.getWorldDirection(_rf);
        const p = _rb.clone().addScaledVector(_rf, 0.2); p.y -= 0.16;
        B.g.position.lerpVectors(home, p, up);
      } else B.g.position.copy(home);
      if (B.liq) B.liq.scale.y = 1 - 0.5 * smooth(cl01((t - RFT.grab - 1.0) / 1.8));
    }
    /* POSSESSION 2 · THE SHY ONE (§4.4, ~36 s): a game of hide-and-seek, never a scare. The amber double crouches out of
       its round base and SCURRIES low across the floor to hide behind him (the lens turns to follow, and it has hidden);
       contact from behind — the world warm amber and soft, the lens wider, and he drops to a crouch with his hands over
       his eyes (the player's PEEK: drag the fingers apart and the room shows through the gap); he scuttles under his own
       desk, finds a coin and holds it up to the lamp, and curls up there to wait to be found, and nobody comes; the double
       drifts back to its base like dust; BONK — his head on the desk's underside; he crawls out and sits by the desk, the
       coin in his hand, and his look goes to the shy one, and then to the little one, whose bells ring softly. */
    const shyLive = { gap: 0, gapT: 0 };
    const CROUCH_EYE = 0.55, UNDER_EYE = 0.35;
    const UNDER = { x: -0.42, z: -1.42 };                    // under his desk, by the drawer side, looking out at the room
    const BYDESK = { x: -0.05, z: -0.85 };                   // sitting on the floor by the desk after (landOn('desk'))
    const BYBED = { x: -0.42, z: 0.55, eye: 0.58 };          // on the floor against the bed's frame (landOn('bed'): the aftermath, the decision)
    const shyF = {
      T: SFT,
      begin() { fLive.shot = 'shy'; fLive.lit = null; shyLive.gap = 0; shyLive.peeked = false; },   // (CP13: the peek's sound, once a film — it was once a session)
      /* (v24.2, L5-6: the chair stays where the film pushed it — put back on end(), it stood round him where he sits by the
         desk, the back filling his look down at the coin; sitAgain and the resets put it home) */
      end() { fLive.shot = ''; lensTo(72); doublesOff(); look('NIGHT', 0.01); if (kit && kit.smear) kit.smear(0, { secs: 0.3 }); chairShoved(); },
      frame(t, api) {
        if (fLive.shot !== 'shy') shyF.begin();
        /* he shoves the desk chair aside as he scuttles under the desk (CP13, the geometry lens: the scuttle ran 2–8 cm
           under its seat and the crawl out went THROUGH it, a dark slab across the lens); end() and the resets put it
           back. It goes as he reaches it, so it reads as pushed — from the mat its slide would be in view */
        if (roomLive.chair) { const kp = smooth(cl01((t - 10.2) / 0.6));
          roomLive.chair.position.x = -0.32 - 0.45 * kp; roomLive.chair.rotation.y = 0.25 + 0.5 * kp; }
        const K = KIDS[1], baseY = KID_BASE;
        /* the double: crouched out of its base, scurrying low across the floor round to behind him (a game), into him */
        if (t < SFT.contact + 0.3) {
          const k1 = smooth(cl01(t / 0.5)), k2 = smooth(cl01((t - 0.5) / 1.4)), q = shyAt(t);
          doubleSet(1, 0.85 * k1 * (1 - smooth(cl01((t - SFT.contact) / 0.3))), q[0], q[1], q[2], -Math.PI / 2 + k2 * 2.6, 1);
        } else if (t < SFT.leave) doubleSet(1, 0);
        else {                                                  // back to its base as dust (a fading drift)
          const kl = smooth(cl01((t - SFT.leave) / 2.0));
          const q = lerp3([UNDER.x + 0.3, 0.15, UNDER.z + 0.4], [RISER.x, baseY, ALTAR_Z[1]], kl);
          doubleSet(1, 0.5 * Math.sin(Math.PI * kl), q[0], q[1], q[2], -Math.PI / 2, 1);
        }
        /* the light, the softness and the lens: AMBER and smeared from contact to the double's leaving, 72 → 90 → 72 */
        /* (CP13: no kit.smear here — it is painted in play only, so in a film it was never drawn; ending C's likewise) */
        if (t >= SFT.contact && t < SFT.leave) { if (fLive.lit !== 'AMBER') { look('AMBER', 0.6); fLive.lit = 'AMBER'; } }
        else if (t >= SFT.leave && fLive.lit !== 'NIGHT') { look('NIGHT', 2.0); fLive.lit = 'NIGHT'; }
        const kw = smooth(cl01((t - SFT.contact) / 0.8)) * (1 - smooth(cl01((t - SFT.leave) / 2.0)));
        lensTo(72 + (K.lens - 72) * kw);
        /* where he is and where he looks */
        let P, L;
        if (t < SFT.contact) {                                  // on the mat, his look following it round behind him (it runs to his right)
          P = [MAT.x, MAT_EYE, MAT.z];
          L = lerp3([RISER.x, 0.85, ALTAR_Z[1]], shyAt(t), smooth(cl01((t - 0.3) / 0.6)));
        } else if (t < SFT.scuttle) {                           // dropped to a crouch on the mat, his look back to the altar
          const kc = smooth(cl01((t - SFT.contact) / 0.5));
          P = [MAT.x, MAT_EYE + (CROUCH_EYE - MAT_EYE) * kc, MAT.z];
          L = lerp3(shyAt(SFT.contact), [RISER.x, 0.7, ALTAR_Z[1]], smooth(cl01((t - SFT.contact) / 0.7)));
        } else if (t < SFT.under + 0.6) {                       // scuttling, low and quick, under the desk
          const ks = smooth(cl01((t - SFT.scuttle) / (SFT.under + 0.6 - SFT.scuttle)));
          P = lerp3([MAT.x, CROUCH_EYE, MAT.z], [UNDER.x, UNDER_EYE, UNDER.z], ks);
          P[1] += 0.02 * Math.abs(Math.sin((t - SFT.scuttle) * 9));
          L = lerp3([0.0, 0.2, -1.4], [RISER.x, 0.55, 0.35], smooth(cl01((t - SFT.under) / 0.6)));
        } else if (t < SFT.bonk) {                              // under the desk: out at the room — the altar huge across the floor
          P = [UNDER.x, UNDER_EYE, UNDER.z];
          const kcoin = smooth(cl01((t - SFT.coin) / 0.6)) * (1 - smooth(cl01((t - SFT.wait) / 0.6)));
          L = lerp3([RISER.x, 0.55, 0.35], [-0.2, 0.62, -1.1], kcoin);   // up at the coin against the lamp, then back out
        } else if (t < SFT.out + 1.0) {                         // BONK, and crawling out
          const kb = cl01((t - SFT.bonk) / 0.25), ko = smooth(cl01((t - SFT.out) / 1.0));
          P = lerp3([UNDER.x, UNDER_EYE + 0.06 * Math.sin(Math.PI * kb), UNDER.z], [BYDESK.x, 0.62, BYDESK.z], ko);
          L = [RISER.x, 0.8, ALTAR_Z[1]];
        } else {                                                // by the desk: to the shy one, then to the little one
          const kl = smooth(cl01((t - SFT.little) / 1.2));
          P = [BYDESK.x, 0.62, BYDESK.z]; L = lerp3([RISER.x, 0.82, ALTAR_Z[1]], [RISER.x, 0.85, ALTAR_Z[2]], kl);
        }
        camAt(P[0], P[1], P[2], L[0], L[1], L[2]);
        /* the bonk's shake */
        { const u = t - SFT.bonk; if (u >= 0 && u < 0.6) { const s = 0.05 * Math.exp(-u * 6); yaw.rotation.y += s * Math.sin(u * 70); pitch.rotation.x += s * Math.cos(u * 61); } }
        /* his hands over his eyes, from the crouch (the PEEK's drag parts them) and again as he waits — drawn from INSIDE
           (peekSet): the rig's hands at his face were two cut wrists and a wall of fingers, and at his mouth by the desk a
           shape nobody should see (by photograph, on a phone), so this film draws no rig hands at all (Chad, on the
           bottle: "if you know its impossible for you to get the fingers right, then dont do that animation") */
        if (api && api.handPose) api.handPose(null, 0);
        if (api && api.handsRoot) api.handsRoot.visible = false;
        if (t >= SFT.peek0 && t < SFT.scuttle) peekSet(smooth(cl01((t - SFT.peek0) / 0.5)) * (1 - smooth(cl01((t - SFT.scuttle + 0.5) / 0.5))), shyLive.gap, t);
        else if (t >= SFT.wait && t < SFT.leave) peekSet(smooth(cl01((t - SFT.wait) / 0.6)) * (1 - smooth(cl01((t - SFT.leave + 0.3) / 0.5))), 0.35, t);
        else peekSet(0);
        /* the coin: on the floor under the desk until he finds it, then up to the lamp, then in his hand by the desk */
        shyCoin(t);
      }
    };
    /* where the shy double is on its scurry (a function of the film's clock): off its base, low across the floor to his
       front-right, round his right side, and behind him */
    function shyAt(t) {
      const baseY = KID_BASE, k2 = smooth(cl01((t - 0.5) / 1.4));
      const pts = [[RISER.x, baseY, ALTAR_Z[1]], [1.0, 0.02, 0.9], [0.35, 0.02, 0.85], [0.22, 0.02, 0.42]];
      const seg = Math.min(2, Math.floor(k2 * 3)), u = k2 * 3 - seg;
      return lerp3(pts[seg], pts[seg + 1], u);
    }
    const _cs1 = new THREE.Vector3(), _cf1 = new THREE.Vector3();
    function shyCoin(t) {
      const C = roomLive.coin; if (!C) return;
      const home = C.userData.home;
      const up = smooth(cl01((t - SFT.coin) / 0.7)) * (1 - smooth(cl01((t - SFT.wait) / 0.6)));
      C.visible = t >= SFT.look;
      if (up > 0.001) {
        camera.getWorldPosition(_cs1); camera.getWorldDirection(_cf1);
        const p = _cs1.clone().addScaledVector(_cf1, 0.15); p.y += 0.012;   // (0.22 m off, by photograph, it was a speck on a phone)
        C.position.lerpVectors(home, p, up); C.rotation.set(Math.PI / 2 * up, 0, 0);
      } else if (t >= SFT.wait) { C.position.set(BYDESK.x + 0.18, 0.004, BYDESK.z + 0.1); C.rotation.set(0, 0.4, 0); }
      else { C.position.copy(home); C.rotation.set(0, 0, 0); }
    }
    /* POSSESSION 3 · THE LITTLE ONE (§4.4, ~45 s, COME BACK inside it): the yield filled by itself; the bells; the lamp
       low and the room deep BLUE; the blue double rises, small and pale, its two long locks drifting as if under water —
       and does NOT come to him: it waits, hands joined, the way a child waits to be noticed. HE goes to IT, kneeling
       close until its face fills the view; a slow fade into the blue; the city's
       lit windows going out one by one, hours passing; the three sticks burning down fast; tears on the lens and a sob;
       the little one's stick burns to its end and its ember dies; his own voice, far off; then COME BACK (S39, inside
       the film): the screen sunk in deep blue water, the lamp a blurred light above, he a small pale light below with
       the little one's smaller blue light beside him, holding on — and SURFACING: sound and white-gold light, colour, the
       lamp blooming, and he falls back against the bed's frame, gasping. */
    /* (LFT is at the top level since CP12) */
    const littleLive = { cameBack: false, slipN: 0, lv: 0 };
    const KNEEL = { x: 1.05, z: ALTAR_Z[2] };                  // kneeling close before the little one, his face filling the view
    const littleF = {
      T: LFT,
      begin() { fLive.shot = 'little'; fLive.lit = null; littleLive.lv = 0; },
      end() { fLive.shot = ''; lensTo(72); doublesOff(); look('NIGHT', 0.01); cityOut(-1); lensOff(); },
      frame(t, api) {
        if (fLive.shot !== 'little') littleF.begin();
        const K = KIDS[2], baseY = KID_BASE;
        if (t >= 0 && fLive.lit !== 'BLUE' && t < LFT.come) { look('BLUE', 1.4); fLive.lit = 'BLUE'; }
        /* the double: rises small and pale, waits with its hands joined; its locks drift (its own slow sway) */
        const kr = smooth(cl01((t - LFT.rise) / 1.6)), kf = 1 - smooth(cl01((t - LFT.into) / 2.5));
        doubleSet(2, 0.9 * kr * kf, RISER.x - 0.05 * kr, baseY + 0.05 * kr + 0.006 * Math.sin(t * 1.3), ALTAR_Z[2], -Math.PI / 2 + 0.05 * Math.sin(t * 0.7), 1);
        /* the lens: from the mat, he goes to it and kneels close; the lens narrows to 62 as he goes into the blue */
        const kg = smooth(cl01((t - LFT.go) / 2.5));
        const L = [RISER.x, baseY + K.h * (0.62 + 0.1 * kg), ALTAR_Z[2]];
        /* (and from the fade into the blue, nearer still and never quite still — under water nothing stands still; by
           photograph the close-up held one picture for twenty seconds) */
        const kd = smooth(cl01((t - LFT.into) / (LFT.come - LFT.into))), fl = 0.004 * Math.sin(t * 0.8) * smooth(cl01((t - LFT.into) / 2));
        const P = lerp3(lerp3([MAT.x, MAT_EYE, MAT.z], [KNEEL.x, baseY + K.h * 0.72, KNEEL.z], kg), L, 0.18 * kd);
        camAt(P[0], P[1] + fl, P[2], L[0], L[1], L[2]);
        lensTo(72 + (K.lens - 72) * smooth(cl01((t - LFT.into) / 2.0)));
        /* his hands are not in this film (the shy one's law): a small añjali at the frame's foot read as a lump on the
           little one's base, and the rig's resting hand rose out of the water at COME BACK (by photograph, on a phone) */
        if (api && api.handPose) api.handPose(null, 0);
        if (api && api.handsRoot) api.handsRoot.visible = false;
        /* the city's lit windows going out one by one (V12), the three sticks burning down fast */
        if (t < LFT.come) cityOut(1 - smooth(cl01((t - LFT.city) / 7)));   // (the 'late' painting under it; at 1 it reads as the night's)
        stubBurn(cl01((t - LFT.city) / (LFT.tick - LFT.city)));
        if (t >= LFT.tick && careLive.sticksSet[2]) { if (roomLive.embers[2]) roomLive.embers[2].visible = false; }
        littleLens(t);                                            // the blue, his hair, the tears (on the lens)
      }
    };
    /* the sticks burning down (k 0 → 1: their incense shrinks to a grey stub; the little one's ember goes last) */
    function stubBurn(k) {
      careLive.sticksSet.forEach((sk, i) => {
        const inc = sk.children[0], h = 1 - 0.85 * k; if (inc) { inc.scale.y = h; inc.position.y = 0.01 + 0.08 * h; }
        if (roomLive.embers[i]) roomLive.embers[i].position.y = ALTAR.top + 0.02 + 0.01 + 0.16 * h;   // the ember rides the burning tip down
      });
    }
    function stubShow(i, on) {                                   // a burnt-out stick: a grey stub, no ember (the aftermath and after)
      const sk = careLive.sticksSet[i]; if (!sk) return; sk.visible = on;
      const inc = sk.children[0]; if (inc) { inc.scale.y = on ? 0.15 : 1; inc.position.y = on ? 0.01 + 0.08 * 0.15 : 0.09; inc.material = on ? mStub : mStickLit; }
      if (roomLive.embers[i]) { roomLive.embers[i].visible = false; roomLive.embers[i].position.y = ALTAR.top + 0.19; }
    }
    /* the films' handles on play-side state (each film keeps only cues and steps; these hold what an event moves) */
    function redStampTo(n) {                                 // a tap of the STAMP: one stamp at the film's current time
      while (redLive.taps < Math.min(3, n)) { redLive.taps++; redLive.stamps.push(redLive.nowT); sfxAt('k5stamp', 0.55, yaw.position.x, yaw.position.z); }
      redLive.lastTap = redLive.nowT;
    }
    /* untapped for 2.5 s, he stamps by himself — three, 0.45 s apart, at times fixed on the film's clock (so a seek and
       a slow frame land on the same picture); a player who has tapped at all keeps his own */
    function redStampAuto(j) {
      if (j === 0) {
        redLive.auto = redLive.taps === 0;
        if (redLive.auto && kit && kit.eventActive && kit.eventActive()) kit.abortEvent();
      }
      if (!redLive.auto) return;
      redLive.stamps.push(RFT.stamp + 2.5 + 0.45 * j); redLive.taps = j + 1;
      sfxAt('k5stamp', 0.55, yaw.position.x, yaw.position.z);
    }
    function redStampEnd() { if (kit && kit.eventActive && kit.eventActive()) kit.abortEvent(); }   // the march: what was stamped stands
    /* the peek drawn from inside (makePeekT): two planes on the CAMERA, a hand's breadth past the near plane, drawn over
       everything and unlit (no light state of the room makes a new program for them). `k` brings the hands in from the
       sides to his face, `gap` parts them (the PEEK's drag, stage.shyGap); a breath of sway. Off (k 0) is not drawn */
    const peek = (() => {
      const T = tex(makePeekT(THREE, cnv)), g = new THREE.Group(), gL = new THREE.PlaneGeometry(1, 1), gR = new THREE.PlaneGeometry(1, 1);
      { const uv = gR.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i)); }
      const mat = B({ map: T, transparent: true, depthTest: false, depthWrite: false, toneMapped: false, fog: false });
      const L = new THREE.Mesh(gL, mat), R = new THREE.Mesh(gR, mat);
      for (const m of [L, R]) { m.renderOrder = 9990; m.frustumCulled = false; g.add(m); }
      g.visible = false; camera.add(g);
      g.dispose = () => { gL.dispose(); gR.dispose(); };
      owned.push(g);                                                // (dispose takes it off the camera, which outlives the chapter)
      return { g, L, R };
    })();
    function peekSet(k, gap, t) {
      if (!(k > 0.002)) { if (peek.g.visible) peek.g.visible = false; return; }
      peek.g.visible = true;
      const d = 0.1, h = d * Math.tan(camera.fov * Math.PI / 360), w = h * camera.aspect;
      const e = w * (0.035 + 1.15 * cl01(gap) + 1.3 * (1 - k)), sway = 0.012 * w * Math.sin(t * 1.7);
      peek.g.position.set(0, 0.015 * h * Math.sin(t * 1.3), -d);
      peek.L.scale.set(2.3 * w, 2.6 * h, 1); peek.L.position.set(-e - 1.15 * w + sway, 0, 0);
      peek.R.scale.set(2.3 * w, 2.6 * h, 1); peek.R.position.set(e + 1.15 * w + sway, 0, 0);
    }
    /* THE LITTLE ONE'S FILM ON THE LENS (V10, V11, V15): planes on the camera like the peek's, unlit, drawn over everything.
       The blue the picture sinks into (from the fade into the blue to COME BACK); the TEARS — drops running down the lens on
       the film's clock, each with its wet line above it; two LOCKS of his hair drifting at the frame's edges; and COME
       BACK's WATER — deep blue lit from above, the caustics, bubbles rising, the lamp a warm blur above, his small pale light
       at the level the climb has reached and the little one's smaller blue light beside it, a ring when the bells ring and
       he holds on, and letting go as he rises. Every picture a function of a clock (the film's; the water's of the event's
       own level and the wall), so a seek and a slow frame land on the same picture */
    const lens = (() => {
      const g = new THREE.Group(); g.visible = false; camera.add(g);
      const geo = new THREE.PlaneGeometry(1, 1);
      const mk = (map, order, add, color) => {
        const m = new THREE.Mesh(geo, B({ map, color: color === undefined ? 0xffffff : color, transparent: true, depthTest: false, depthWrite: false,
          toneMapped: false, fog: false, blending: add ? THREE.AdditiveBlending : THREE.NormalBlending }));
        m.renderOrder = order; m.frustumCulled = false; m.visible = false; g.add(m); return m;
      };
      const tDrop = tex(makeDropT(THREE, cnv)), tTrail = tex(makeTrailT(THREE, cnv)), tLock = tex(makeLockT(THREE, cnv)), tBub = tex(makeBubbleT(THREE, cnv));
      const tCau = tex(makeCausticT(THREE, cnv)); tCau.repeat.set(3, 4.1);   // (the cells' size on a plane the frame's whole height)
      const L = { g, waterOn: false, waterT0: 0,
        wash: mk(tex(makeWashT(THREE, cnv)), 9980, false), water: mk(tex(makeWaterT(THREE, cnv)), 9981, false), caus: mk(tCau, 9982, true),
        lamp: mk(tGlow, 9983, true, 0xffd8a0), him: mk(tGlow, 9984, true, 0xf4f6ff), kid: mk(tGlow, 9984, true, 0x8cbcff), ring: mk(tBub, 9984, true, 0x8cbcff),
        bubs: [], drops: [], trails: [], locks: [] };
      L.caus.material.alphaMap = tex(makeDepthFadeT(THREE, cnv));   // (the light from above fading with depth: no line across the water)
      L.bloom = mk(tex(makeBloomT(THREE, cnv)), 9979, true);       // (CP8: a child's colour from the edges of sight, V2)
      for (let i = 0; i < 10; i++) L.bubs.push(mk(tBub, 9983, true, 0xc8e4ff));
      for (let i = 0; i < 6; i++) { L.trails.push(mk(tTrail, 9985, false)); L.drops.push(mk(tDrop, 9986, false)); }
      for (let i = 0; i < 2; i++) L.locks.push(mk(tLock, 9985, false));
      g.dispose = () => geo.dispose();
      owned.push(g);                                                // (dispose takes it off the camera)
      return L;
    })();
    /* HIS PHONE, on the floor beside him after the little one (it slid from his pocket as he fell back against the bed's
       frame): the aftermath reads the hour off it — from the floor the bed's head hides the bedside clock (by photograph,
       "his look drawn to the clock" found only the pillow) — and ending A's nights find it there again (CP8). Its top
       away from him, so he reads it the right way up */
    const PHONE_FLOOR = { x: -0.06, z: -0.02, ry: 0.4 };
    const phone = (() => {
      const S2 = makePhoneScreen(THREE, cnv); tex(S2.t);
      const g = new THREE.Group(); g.visible = false; worldR.add(g);
      box(0.075, 0.008, 0.155, 0, 0.004, 0, M({ color: 0x14161a, roughness: 0.3, metalness: 0.4 }), g, false);
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.066, 0.143), B({ map: S2.t, toneMapped: false }));
      scr.rotation.x = -Math.PI / 2; scr.position.y = 0.0085; g.add(scr);
      g.position.set(PHONE_FLOOR.x, 0.001, PHONE_FLOOR.z); g.rotation.y = PHONE_FLOOR.ry;
      return { g, scr, S: S2 };
    })();
    function phoneLook(secs) {                                       // his look down onto it, from where he sits
      const dx = PHONE_FLOOR.x - yaw.position.x, dz = PHONE_FLOOR.z - yaw.position.z, d = Math.hypot(dx, dz);
      viewTo(Math.atan2(-dx, -dz), Math.max(-0.78, Math.atan2(0.01 - yaw.position.y, d)), secs);
    }
    function lensWH() { const d = 0.1, h = d * Math.tan(camera.fov * Math.PI / 360); return { d, h, w: h * camera.aspect }; }
    function lensPut(m, x, y, sw, sh, op) {
      m.visible = op > 0.003; if (!m.visible) return;
      m.position.set(x, y, 0); m.scale.set(sw, sh, 1); m.material.opacity = Math.min(1, op);
    }
    function lensOff() {
      lens.waterOn = false; lens.g.visible = false;
      for (const m of lens.g.children) m.visible = false;
    }
    /* the tears (each: its time after the tears begin, x as a share of the half-width, the height it starts at as a share
       of the half-height, and how fast it runs, in half-heights a second) */
    const DROPS = [[0.0, -0.34, 0.55, 0.10], [0.9, 0.22, 0.40, 0.14], [1.7, -0.08, 0.62, 0.08], [2.8, 0.41, 0.30, 0.12], [4.0, -0.52, 0.20, 0.11], [5.2, 0.05, 0.48, 0.09]];
    function littleLens(t) {
      const { d, h, w } = lensWH(); lens.g.position.set(0, 0, -d);
      const out = 1 - smooth(cl01((t - (LFT.come - 0.6)) / 0.6));
      const kw = smooth(cl01((t - LFT.into) / 2.5)) * out, kh = smooth(cl01((t - LFT.into - 1.0) / 3.0)) * out, kt = cl01((t - LFT.tears) / 0.5) * out;
      if (!(kw > 0.003 || kh > 0.003 || kt > 0.003)) { if (!lens.waterOn) lensOff(); return; }
      lens.g.visible = true;
      lensPut(lens.wash, 0, 0, 2.2 * w, 2.2 * h, 0.85 * kw);
      lens.locks.forEach((m, i) => {                                 // his locks, one at each edge, drifting as if under water
        const sgn = i ? 1 : -1, sway = 0.06 * w * Math.sin(t * 0.55 + i * 2.1) + 0.03 * w * Math.sin(t * 1.3 + i);
        lensPut(m, sgn * w * 0.86 + sway, h * 0.15 + 0.03 * h * Math.sin(t * 0.4 + i), 0.5 * h, 2.4 * h, 0.75 * kh);
        m.rotation.z = sgn * 0.18 + 0.06 * Math.sin(t * 0.5 + i * 1.7);
      });
      DROPS.forEach(([t0, fx, fy, v], i) => {                        // each drop rests a moment, then runs, its wet line above it
        const u = t - LFT.tears - t0, D = lens.drops[i], R = lens.trails[i];
        if (u < 0 || kt <= 0) { D.visible = R.visible = false; return; }
        const run = Math.max(0, u - 0.6), y0 = fy * h, y = y0 - v * h * run - 0.02 * h * run * run, x = fx * w + 0.01 * w * Math.sin(u * 3 + i);
        const sz = 0.075 * h * (1 + 0.15 * (i % 3)), op = smooth(cl01(u / 0.4)) * kt * (y < -1.2 * h ? 0 : 1);
        lensPut(D, x, y, sz, sz * 1.15, op);
        const len = Math.max(0.001, y0 - y);
        lensPut(R, x, y + len / 2 + sz * 0.3, sz * 0.35, len + sz * 0.4, op * 0.8);
      });
    }
    function comeWaterOn(on) {
      lens.waterOn = !!on; lens.waterT0 = wallNow();
      for (const m of [lens.water, lens.caus, lens.lamp, lens.him, lens.kid, lens.ring, ...lens.bubs]) m.visible = false;
      if (on) lens.g.visible = true; else lensOff();
    }
    function comeWaterFrame(lv) {                                    // every frame of COME BACK (the surface event's onLevel)
      if (!lens.waterOn) return;
      const { d, h, w } = lensWH(), now = wallNow(), kin = smooth(cl01((now - lens.waterT0) / 0.6));
      lens.g.visible = true; lens.g.position.set(0, 0, -d);
      for (const m of [lens.wash, ...lens.locks, ...lens.drops, ...lens.trails]) m.visible = false;
      lensPut(lens.water, 0, 0, 2.2 * w, 2.2 * h, 0.94 * kin);
      lens.caus.material.map.offset.set((now * 0.021) % 1, (now * 0.013) % 1);
      lensPut(lens.caus, 0, 0, 2.2 * w, 2.2 * h, (0.16 + 0.22 * lv) * kin);
      const hy = -0.72 * h + 1.5 * h * lv;                            // his light, at the level the climb has reached
      lensPut(lens.lamp, 0, 0.95 * h, (0.9 + 1.4 * lv) * h, (0.9 + 1.4 * lv) * h, (0.5 + 0.5 * lv) * kin);
      lensPut(lens.him, 0, hy, 0.20 * h, 0.20 * h, 0.95 * kin);
      const held = Math.max(0, lv - 0.55) * 1.7;                      // beside him, holding on — and letting go as he rises
      const ky = hy - 0.12 * h - held * h, kx = 0.16 * w * (1 - 0.3 * Math.min(1, held));
      lensPut(lens.kid, kx, ky, 0.13 * h, 0.13 * h, 0.9 * kin * (1 - 0.5 * cl01(held)));
      const pu = littleLive.pullT ? now - littleLive.pullT : 9;        // a ring when the bells ring
      lensPut(lens.ring, kx, ky, (0.15 + 0.9 * pu) * h, (0.15 + 0.9 * pu) * h, 0.7 * (1 - cl01(pu / 0.9)) * kin);
      lens.bubs.forEach((m, i) => {
        const sp = 0.10 + 0.05 * (i % 4), yy = ((now * sp + (i * 0.618) % 1) % 1) * 2.4 * h - 1.2 * h;
        lensPut(m, (((i * 0.37) % 1) - 0.5) * 1.6 * w + 0.02 * w * Math.sin(now * 2 + i), yy, 0.03 * h, 0.03 * h,
                0.6 * kin * (1 - cl01((yy + 0.2 * h) / h)));
      });
    }
    function shyGap(k) { shyLive.gap = k; if (k > 0.3 && !shyLive.peeked) { shyLive.peeked = true; sfxAt('k5peek', 0.4, yaw.position.x, yaw.position.z); } }
    function shyPeekEnd() { if (kit && kit.eventActive && kit.eventActive()) kit.abortEvent(); shyLive.gap = 0; }
    /* COME BACK (§4.5, S39 inside the little one's film): the water, the light above, his light and the little one's
       below; each pull the bells and a soft blue ring from below; a slip costs 4 sanity (floored, never a faint; the
       Luang Phu Tim's and Gao Yord's cuts apply — evCut); inside 12 s "You came back on your own" (+4 awareness);
       slower "It took everything to come back"; after 30 s the light comes down to him (gaveUp) */
    function comeOpts() {
      const first = !littleLive.briefed; littleLive.briefed = true;
      return { kind: 'surface', label: W.objComeBack, brief: first ? (TOUCHY ? W.briefSurface : W.briefSurfaceKey) : undefined,
               demo: 'surface', start: 0.18, lead: 0.4, sink: 0.07, pull: 0.16, pullGap0: 1.6, pullGap1: 2.4, floorK: 0.12,
               slip: 4, minSanity: 10, goal: 0.92, hold: 0.4, full: 12, secs: 30,
               onPull: () => { sfxAt('k5pull', 0.45, yaw.position.x, yaw.position.z); sfxAt('k5bells', 0.3, RISER.x, ALTAR_Z[2]); littleLive.pullT = wallNow(); },
               onSlip: (n) => { littleLive.slipN = n; },
               onLevel: (k) => { littleLive.lv = k; comeWaterFrame(k); } };
    }
    function comeBegin() { littleLive.lv = 0.18; look('SURFACE', 0.6); comeWaterOn(true); }
    function comeDone(r) {
      if (r && (r.skipped || r.aborted)) return;        // (CP13: a skipped film banks no note either way; v24.2, L2-1: nor an aborted one — its handler runs after the reset)
      littleLive.cameBack = !!(r && r.ok && !r.gaveUp);
      const fast = r && r.ok && !r.gaveUp && r.score >= 0.99;
      if (kit && kit.conduct) kit.conduct(fast ? { a: 4, note: W.noteCameBack } : { note: r && r.gaveUp ? W.noteLight : W.noteHard });
    }
    function surfaceStart() { comeWaterOn(false); look('NIGHT', 0.8); if (kit && kit.flash) kit.flash({ color: '#fff2d6', secs: 1.4 }); }   // a rush of white-gold light
    /* the surfacing (5.6 s since CP12, his gasp inside it): a rush of white-gold light that fades as colour returns; he
       falls back against the bed's frame */
    function surfaceFrame(u, api) {
      const k = smooth(cl01(u / 1.2));
      const P = lerp3([KNEEL.x, 0.75, KNEEL.z], [-0.42, 0.58, 0.55], k), L = [RISER.x, 0.9, 0.4];
      camAt(P[0], P[1] - 0.04 * Math.sin(Math.PI * cl01(u / 0.5)), P[2], L[0], L[1], L[2]);
      lensTo(KIDS[2].lens + (72 - KIDS[2].lens) * smooth(cl01(u / 1.6)));   // (the blue's narrow lens opens with the gasp, not on the cut to play)
      if (api && api.handPose) api.handPose(null, 0);
      if (api && api.handsRoot) api.handsRoot.visible = false;
    }
    /* THE CITY'S LIT WINDOWS GOING OUT ONE BY ONE (V12, the little one's hours): over the window's 'late' painting, one plane
       carrying exactly the windows the night has lit and 'late' has not — painted by the very loop that paints the view
       (makeWindowT: the same seed, so the same windows) — each with the moment it goes out written in its alpha; the
       material's alphaTest is that moment, so as cityOut runs from 1 to 0 they go dark one by one, and nothing is drawn
       on a canvas mid-film (an unlit material, and its alphaTest stays above 0: no new program at any point) */
    function buildCityOut() {
      if (!roomLive.view || roomLive.cityOv) return;
      const v = roomLive.view;
      const o = new THREE.Mesh(new THREE.PlaneGeometry(14, 9), B({ map: tex(makeWindowLitT(THREE, cnv)), toneMapped: false, fog: false, alphaTest: 0.2 }));
      o.position.copy(v.position); o.position.x -= 0.03; o.rotation.copy(v.rotation); o.visible = false; worldR.add(o);
      roomLive.cityOv = o;
    }
    function cityOut(k) {                                       // k 1 → 0: the night's windows → 'late'; k < 0 hides it
      const o = roomLive.cityOv; if (!o) return;
      if (k < 0) { o.visible = false; return; }
      o.visible = true; o.material.alphaTest = 0.2 + 0.8 * (1 - cl01(k)) + 0.001;
    }
    /* a burnt-out stick's grey stub, and its lit colour back */
    const mStub = M({ color: 0x8a8580, roughness: 0.95 }), mStickLit = M({ color: 0x9a2418, roughness: 0.8 });

    /* ---------------------------------------------------------- the owner (CP5)
       Chapter 4's mkPerson — its rigged path, by its own code and numbers (e3c4.js at v22.5): sized from POSED BONES and
       grounded on the lowest (the v3.8/v4.7 law), each take's foot centre measured so his talking take never walks him
       through his counter (ch3's granny, v5.22), culled by a sphere round the posed skin (v18.5's law), the head's look
       laid on after the mixer and put back before it runs again (the v11.5 law), and chapter 3's stand-in shoulders eased
       toward his body (armsPre / armsPost). A failed download leaves his place empty, never a block of a person (v21.16). */
    const people = [];
    const _pv = new THREE.Vector3(), _pq = new THREE.Quaternion(), _pe = new THREE.Euler(), _hp = new THREE.Vector3(), _cp = new THREE.Vector3();
    function mkPerson(key, o) {
      const parent = o.parent;
      const group = new THREE.Group(); group.position.set(o.x, 0, o.z); group.rotation.y = o.ry || 0; parent.add(group);
      let wx = o.x; for (let p = parent; p && p !== world; p = p.parent) wx += p.position.x;
      let wz = o.z; for (let p = parent; p && p !== world; p = p.parent) wz += p.position.z;
      const P = { key, group, wx, wz, model: null, mixer: null, idle: null, talk: null, head: null, headWrote: null, ready: false, o,
                  talkUntil: 0, talkW: 0, lookYaw: 0, lookPitch: 0, look: o.look || 0, rootIdle: new THREE.Vector3(), rootTalk: new THREE.Vector3(),
                  inner: null };
      parseOnce(key).then((gltf) => {
        if (!alive) return;
        const g = cloneSkinned(gltf.scene);
        g.traverse(m => { if (m.isMesh) { m.castShadow = !LOW; m.receiveShadow = false;
          /* a Meshy scan (Chad's owner): black cloth flush against white in the atlas, so every shrunken copy of the sheet
             greys it — drawn without mipmaps (v19.8, v21.32) */
          for (const mm of [].concat(m.material)) { const t = mm && mm.map;
            if (t && t.generateMipmaps !== false) { t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.needsUpdate = true; } } } });
        g.traverse(b => { if (b.isBone && HEAD_RE.test(b.name) && !P.head) P.head = b; });
        const mx = new THREE.AnimationMixer(g);
        const clip = (n) => gltf.animations.find(a => a.name === n);
        const idleC = clip(o.idle) || gltf.animations[0], talkC = o.talk ? clip(o.talk) : null;
        const footOf = (c) => {
          const a = mx.clipAction(c); a.reset().setEffectiveWeight(1).play(); mx.update(0); g.updateMatrixWorld(true);
          const s = new THREE.Vector3(); let n = 0;
          g.traverse(b => { if (b.isBone && /Foot(_\d+)?$/i.test(b.name)) { b.getWorldPosition(_pv); s.add(_pv); n++; } });
          a.stop(); return n ? s.divideScalar(n) : s;
        };
        if (idleC) P.rootIdle.copy(footOf(idleC));
        if (talkC) P.rootTalk.copy(footOf(talkC)); else P.rootTalk.copy(P.rootIdle);
        // height from the posed bones across the idle take; the floor from its lowest frame
        let lo = Infinity, hi = -Infinity;
        if (idleC) {
          const a = mx.clipAction(idleC); a.reset().setEffectiveWeight(1).play();
          for (const tt of [0, 1, 2, 3, 4, 5].map(k => idleC.duration * k / 6)) {
            mx.setTime(tt); g.updateMatrixWorld(true);
            g.traverse(b => { if (!b.isBone) return; b.getWorldPosition(_pv); lo = Math.min(lo, _pv.y); hi = Math.max(hi, _pv.y); });
          }
          a.stop();
        }
        if (!(hi > lo)) { console.warn(key + ': no bones to size by'); return; }
        const crown = (() => { let c = false; g.traverse(b => { if (b.isBone && /HeadTop_End|head_end|headtop/i.test(b.name)) c = true; }); return c; })();
        const s = o.height / ((hi - lo) / (crown ? 1 : 0.935));
        const inner = new THREE.Group(); inner.scale.setScalar(s); inner.position.y = -lo * s + 0.005; inner.add(g); group.add(inner);
        P.inner = inner; P.model = g; P.mixer = mx; P.scale = s;
        if (idleC) { P.idle = mx.clipAction(idleC); P.idle.reset().setEffectiveTimeScale(o.idleRate || 1).setEffectiveWeight(1).play(); }
        g.traverse(b => { if (b.isBone && /Hips(_\d+)?$/.test(b.name) && !P.hips) P.hips = b; });
        if (talkC) { P.talk = mx.clipAction(talkC); P.talk.reset().setEffectiveTimeScale(o.talkRate || 1).setEffectiveWeight(0).play(); }
        mx.update(0.0001);
        P.ready = true;
        // the culling sphere round the posed skin, world space, generous
        group.updateMatrixWorld(true);
        const bb = new THREE.Box3();
        g.traverse(m => { if (!m.isSkinnedMesh) return; m.skeleton.update(); const n = m.geometry.attributes.position.count, st = Math.max(1, Math.floor(n / 3000));
          for (let i = 0; i < n; i += st) { m.getVertexPosition(i, _pv); _pv.applyMatrix4(m.matrixWorld); bb.expandByPoint(_pv); } });
        if (!bb.isEmpty()) {
          const sph = bb.getBoundingSphere(new THREE.Sphere()); sph.radius = Math.max(sph.radius * 1.4, 1.2);
          g.traverse(m => { if (!m.isSkinnedMesh) return; m.frustumCulled = true; const inv = m.matrixWorld.clone().invert(), k = m.matrixWorld.getMaxScaleOnAxis() || 1;
            m.boundingSphere = new THREE.Sphere(sph.center.clone().applyMatrix4(inv), sph.radius / k); });
        }
        owned.push({ dispose: () => mx.stopAllAction() });
        if (o.then) o.then(P);
        redoShadows();
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
      people.push(P);
      return P;
    }
    /* CHAPTER 3's STAND-IN SHOULDERS (its armsPre/armsPost, v21.1): a take retargeted onto a rig from another carries the
       source's shoulders a little shrugged and its arms ~14° out — each shoulder and upper arm is turned toward the body's
       own down by a few degrees after the mixer, and put back before it writes again (the v11.5 law) */
    const _amA = new THREE.Vector3(), _amB = new THREE.Vector3(), _amD = new THREE.Vector3(), _amQ = new THREE.Quaternion(), _amP = new THREE.Quaternion();
    function armsPre(P) { if (P.armWrote) P.armBones.forEach((b, i) => b.quaternion.copy(P.armWrote[i])); }
    function armsPost(P) {
      const F = P.o.armFix; if (!F || !P.model || !P.hips) return;
      if (!P.armBones) {
        const find = (re) => { let q = null; P.model.traverse(b => { if (!q && b.isBone && re.test(b.name)) q = b; }); return q; };
        P.armBones = [find(/LeftShoulder(_\d+)?$/), find(/RightShoulder(_\d+)?$/), find(/LeftArm(_\d+)?$/), find(/RightArm(_\d+)?$/)];
        P.armNeck = find(/Neck(_\d+)?$/);
        if (P.armBones.some(b => !b) || !P.armNeck) { P.o.armFix = null; P.armBones = null; return; }
        P.armWrote = P.armBones.map(b => b.quaternion.clone());
      }
      P.armBones.forEach((b, i) => P.armWrote[i].copy(b.quaternion));
      P.model.updateMatrixWorld(true);
      P.hips.getWorldPosition(_amA); P.armNeck.getWorldPosition(_amB); _amD.subVectors(_amA, _amB).normalize();   // the body's own down
      P.armBones.forEach((b, i) => {
        const ch = b.children.find(c => c.isBone); if (!ch) return;
        b.getWorldPosition(_amA); ch.getWorldPosition(_amB);
        _amB.sub(_amA).normalize(); _amA.crossVectors(_amB, _amD);
        if (_amA.lengthSq() < 1e-8) return;
        _amA.normalize(); b.parent.getWorldQuaternion(_amP); _amA.applyQuaternion(_amP.invert());
        b.quaternion.premultiply(_amQ.setFromAxisAngle(_amA, THREE.MathUtils.degToRad(i < 2 ? F.sh : F.arm)));
        b.updateMatrixWorld(true);
      });
    }
    /* THE BECKON (CP13, the films' second vision review: his talking take and a nod, seen from the corridor, read as
       nothing — no hand came up). His near hand comes up over his counter toward the corridor, palm down, and flaps toward
       him three times — the Thai "come". After the mixer and his shoulders' ease, each of the arm's three bones laid
       along its aim in his own body's frame (a Mixamo bone's length is its +y), and put back before the mixer writes again
       (the v11.5 law: beckonPre runs before armsPre, beckonPost after armsPost); on wall time */
    const BK_SECS = 2.1;
    const _bkQ = new THREE.Quaternion(), _bkP = new THREE.Quaternion(), _bkR = new THREE.Quaternion(), _bkI = new THREE.Quaternion(), _bkId = new THREE.Quaternion();
    const _bkV = new THREE.Vector3(), _bkU = new THREE.Vector3(0, 1, 0), _bkF = new THREE.Vector3(), _bkL = new THREE.Vector3(), _bkAx = new THREE.Vector3();
    const _bkD = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    function beckonPre(P) { if (P.bkOn) { P.bkBones.forEach((b, i) => b.quaternion.copy(P.bkWrote[i])); P.bkOn = false; } }
    function beckonPost(P) {
      if (!P.model || (P.bkU == null && !P.bkT)) return;
      /* (a film poses it by its own clock, `bkU`, so a seek, a pause and a slow phone land on the same arm — the v6.4 law;
         a beat in play by wall time, `bkT`) */
      const u = P.bkU != null ? P.bkU : (performance.now() / 1000 - P.bkT) / BK_SECS;
      if (u < 0 || (P.bkU != null && u >= 1)) return;
      if (u >= 1) { P.bkT = 0; return; }
      if (!P.bkBones) {
        const find = (re) => { let q = null; P.model.traverse(b => { if (!q && b.isBone && re.test(b.name)) q = b; }); return q; };
        P.bkBones = [find(/LeftArm(_\d+)?$/), find(/LeftForeArm(_\d+)?$/), find(/LeftHand(_\d+)?$/)];
        if (P.bkBones.some(b => !b)) { P.bkT = 0; P.bkBones = null; return; }
        P.bkWrote = P.bkBones.map(b => b.quaternion.clone());
      }
      P.bkBones.forEach((b, i) => P.bkWrote[i].copy(b.quaternion));
      P.bkOn = true;
      const W = smooth(cl01(u / 0.2)) * (1 - smooth(cl01((u - 0.8) / 0.2)));        // up over 0.4 s, down over 0.4 s
      const flap = -0.15 - 0.6 * (0.5 - 0.5 * Math.cos(2 * Math.PI * 3 * cl01((u - 0.2) / 0.6)));   // the fingers' edge down, three times
      P.group.getWorldQuaternion(_bkQ);
      _bkF.set(0, 0, 1).applyQuaternion(_bkQ); _bkF.y = 0; _bkF.normalize(); _bkL.crossVectors(_bkU, _bkF);   // his forward, his left
      /* (half toward the corridor at his left, where the one he calls stands, and raised: photographed straight out over the
         counter it read as a man showing his stock, and pointed AT the lens it was foreshortened to a bar across his
         belly — 45° off the line to the glass, the hand at his shoulder, it reads at any of the film's lenses) */
      _bkD[0].set(0, 0, 0).addScaledVector(_bkU, -0.65).addScaledVector(_bkF, 0.45).addScaledVector(_bkL, 0.62).normalize();   // the upper arm: down, forward, out
      _bkD[1].set(0, 0, 0).addScaledVector(_bkF, 0.55).addScaledVector(_bkL, 0.55).addScaledVector(_bkU, 0.45).normalize();    // the forearm: up, half toward the glass
      _bkAx.crossVectors(_bkD[1], _bkU).normalize();
      _bkD[2].copy(_bkD[1]).applyAxisAngle(_bkAx, flap);                                                                      // the hand, flapping down from it
      P.model.updateMatrixWorld(true);
      P.bkBones.forEach((b, i) => {
        b.getWorldQuaternion(_bkQ);
        _bkV.set(0, 1, 0).applyQuaternion(_bkQ);
        _bkI.setFromUnitVectors(_bkV, _bkD[i]);
        _bkR.slerpQuaternions(_bkId, _bkI, W);
        _bkQ.premultiply(_bkR);
        b.parent.getWorldQuaternion(_bkP);
        b.quaternion.copy(_bkP.invert().multiply(_bkQ));
        b.updateMatrixWorld(true);
      });
    }
    /* he speaks: the talking take eased in over his idle for the line's length, on WALL time */
    function personTalk(P, secs) { if (P) P.talkUntil = performance.now() / 1000 + secs; }
    function peopleTick(wdt) {
      for (const P of people) {
        if (!P.ready || !P.group.visible || Math.abs(P.wx - yaw.position.x) > 80 || Math.abs(P.wz - yaw.position.z) > 80) continue;
        if (P.head && P.headWrote) P.head.quaternion.copy(P.headWrote);
        beckonPre(P); armsPre(P);
        const want = performance.now() / 1000 < P.talkUntil ? (P.o.talkWeight || 1) : 0;
        P.talkW += (want - P.talkW) * (1 - Math.exp(-wdt * 3.2));
        if (P.talk) { P.talk.setEffectiveWeight(P.talkW); P.idle && P.idle.setEffectiveWeight(1 - P.talkW * 0.85); }
        if (P.mixer) P.mixer.update(wdt);
        // the two takes stand him in different places: keep his feet where the idle puts them
        if (P.talk) { _pv.copy(P.rootTalk).sub(P.rootIdle).multiplyScalar(P.talkW); P.model.position.set(-_pv.x, 0, -_pv.z); }
        armsPost(P); beckonPost(P);
        if (P.head) {
          if (!P.headWrote) P.headWrote = new THREE.Quaternion();
          P.headWrote.copy(P.head.quaternion);
          let ty = 0, tp = 0;
          const filmLook = cntLive.ownerLook > 0 && P.wx > 100;            // film K: he looks straight at him
          if (P.look > 0 && (getState() === 'play' || filmLook)) {
            P.head.getWorldPosition(_hp); camera.getWorldPosition(_cp);
            const dx = _cp.x - _hp.x, dz = _cp.z - _hp.z, dy = _cp.y - _hp.y;
            const a = Math.atan2(dx, dz) - P.group.rotation.y, yawTo = Math.atan2(Math.sin(a), Math.cos(a));
            if (Math.abs(yawTo) < 1.7 && Math.hypot(dx, dz) < (filmLook ? 12 : 7)) { ty = THREE.MathUtils.clamp(yawTo, -0.9, 0.9); tp = THREE.MathUtils.clamp(-Math.atan2(dy, Math.hypot(dx, dz)), -0.35, 0.3); }
          }
          const k = 1 - Math.exp(-wdt * 2.4);
          P.lookYaw += (ty * P.look - P.lookYaw) * k; P.lookPitch += (tp * P.look - P.lookPitch) * k;
          if (Math.abs(P.lookYaw) + Math.abs(P.lookPitch) > 1e-4) { _pe.set(P.lookPitch, P.lookYaw, 0, 'YXZ'); _pq.setFromEuler(_pe); P.head.quaternion.multiply(_pq); }
          /* a nod, twice — "come in" (CP13, the films' vision review: the opening film's beckon was his talking take alone,
             his hands below the glass case from the corridor, and read as nothing). On wall time; a positive pitch is down */
          if (P.nodT || P.nodU != null) {
            const u = P.nodU != null ? P.nodU : (performance.now() / 1000 - P.nodT) / 1.4;   // (a film's by its own clock, as the beckon)
            if (u < 0 || u >= 1) { if (P.nodU == null) P.nodT = 0; }
            else { _pe.set(0.2 * Math.sin(u * Math.PI * 2) ** 2, 0, 0, 'YXZ'); _pq.setFromEuler(_pe); P.head.quaternion.multiply(_pq); }
          }
        }
      }
    }
    /* CHAD'S owner behind his counter, turned to the player (chapter 4's World H numbers: v21.32's model on its
       retargeted standing idle and his own talking take, his shoulders eased toward his body) */
    cntLive.owner = mkPerson('owner', { parent: SH.shopG, x: SH.OWN.x, z: SH.OWN.z, ry: -Math.PI / 2, height: 1.66, idle: 'Idle_9',
      talk: 'Talk_with_Hands_Open', talkWeight: 0.85, look: 1, armFix: { sh: 6, arm: 7 } });

    /* a sound at a place in the world, panned by where it is against his look (the lens's right, in the ground's plane) */
    function panAt(x, z) {
      const dx = x - yaw.position.x, dz = z - yaw.position.z, d = Math.hypot(dx, dz) || 1, a = yaw.rotation.y;
      return cl01(((dx * Math.cos(a) - dz * Math.sin(a)) / d + 1) / 2) * 2 - 1;
    }
    function sfxAt(name, vol, x, z) { return worldSfx && !(soundOff && soundOff()) ? worldSfx(name, vol, 1, x == null ? 0 : panAt(x, z) * 0.7) : null; }
    /* a one-shot brought down, not cut dead (the engine's worldSfx hands back the source and its gain, `__g`) */
    function sfxDown(src, secs = 0.3) {
      if (!src) return;
      try { const t = src.context.currentTime, g = src.__g && src.__g.gain;
            if (g) { g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0.0001, t + secs); }
            src.stop(t + secs + 0.02); } catch { /* already over */ }
    }
    if (warmSounds) warmSounds(['k5bundle', 'k5figset', 'k5set', 'k5wind', 'k5lullaby', 'k5bellsfaint', 'k5slip', 'k5bag']);

    /* ============================================== WORLD M · THE TEMPLE (CP5)
       Chapter 4's merit-film temple (e3c4.js, its World M, at v22.5), COPIED by its own code and numbers (a chapter never
       imports another) — under World M's group at x −250 here (chapter 4 stood it at z +250). Its own comment follows, and
       where this chapter differs a comment says (World M: ...): the counter's film M sees its hall by candlelight
       (TEMPLE_NIGHT) and ending D its courtyard and hall at first light (TEMPLE_DAWN, CP8).
       --- chapter 4's comment: THE TEMPLE AT SUNSET (CP6 · the merit film)
       S1·09: "Later I went to a temple and made a contribution dedicated to her." A Thai temple in Singapore at
       sunset, built for the one film that shows it: a courtyard of slabs with its bell in a little pavilion and a
       bodhi tree on a white plinth, the hall on its base with three stepped gables against the glow (chapter 2's
       recipes: slab roofs with tiles, gilt edges, naga bargeboards and chofa), the city's blocks beyond the wall, and
       inside — polished floor, red columns, Chad's Buddha at the back, Chad's monk on his dais by the east wall, the
       donation box by the door, the silver bowl and the brass vessel for kruat nam. 250 m from every world (the far
       plane is 160 m, v8.9) under a sky of its own (the engine's is centred on the origin, v21.0). Nobody walks here:
       it is drawn only while its film runs (worldM.visible), so play never pays for it, and the chapter's entry curtain
       has already drawn it once, forced visible, so nothing in it compiles or uploads on screen (v14.15/v15.1).
       Lit by the film's own daylight (M_DUSK outside, M_HALL in) — never a new light (v15.1). */
    const MHALL = { x0: -6, x1: 6, z0: -16, z1: -2, F: 0.45, H: 5.0, T: 0.3 };   // its floor on a 0.45 base; walls 5 m over it
    const MDOOR = { hw: 1.2, h: 3.2 };
    const MDAIS = { x: 5.0, z: -8.6, w: 1.4, d: 2.6, h: 0.45 };     // the monk's dais against the east wall; he faces −x
    const MKNEEL = { x: 3.2, z: -8.6 };                               // where he kneels before it, facing +x
    const MBOWL = { x: 3.78, z: -8.42 };                              // the bowl on the floor before his knees
    const MBOX = { x: -3.1, z: -3.5 };                                // the donation box, inside the door on the left
    const MTREE = { x: 9.4, z: 6.2, r: 1.75, h: 0.42 };               // the bodhi on its plinth, east of the hall's front
    const MBELL = { x: -9.0, z: 4.6 };                                // the bell in its pavilion, west of the path
    const MALT = { z: -15.25, w: 3.6, d: 1.3 };                       // the Buddha's altar against the back wall
    /* (World M: its group is the chapter's own, at x −250 — declared with the other two worlds) */
    const mLive = { on: false, shot: '', dusk: 0, duskTo: 0, flames: [], smoke: [], motes: [], petals: [], drops: [], ripples: [],
                    stream: null, streamOut: null, water: null, wet: null, mote: null, trail: [], bell: null, envelope: null, envIn: null,
                    vessel: null, bowl: null, bowl2: null, shafts: [], t: 0 };
    const merit = { monk: { model: null, bones: [], head: null, neck: null, rest: null, ready: false } };
    function buildTemple() {
      const G = worldM, F = MHALL.F;
      const tSky = tex(makeMSky(THREE, cnv)), tSlab = tex(makeMSlabs(THREE, cnv)), tPlaster = tex(makeMPlaster(THREE, cnv));
      const tFloor = tex(makeMFloor(THREE, cnv)), tTile = tex(makeMTiles(THREE, cnv, '#c4622a', '#5a240e')), tTile2 = tex(makeMTiles(THREE, cnv, '#a8321c', '#561208'));
      const tEarth = tex(makeMEarth(THREE, cnv)), tGrass = tex(makeMGrass(THREE, cnv)), tWin = tex(makeMWindow(THREE, cnv));
      const tScreen = tex(makeMScreen(THREE, cnv)), tBox = tex(makeMBoxFront(THREE, cnv)), tEnv = tex(makeMEnvelope(THREE, cnv));
      const tPetal = tex(makeMLeaf(THREE, cnv)), tRip = tex(makeMRipple(THREE, cnv)), tStream = tex(makeMStream(THREE, cnv));
      const tGlow = tex(makeYinGlow(THREE, cnv)), tFlame = tex(makeYinFlame(THREE, cnv)), tSmoke = tex(makeYinSmoke(THREE, cnv));   // (World M: chapter 4 borrowed World Y's; this chapter draws its own)
      const mSlab = M({ map: tSlab, roughness: 0.88, color: 0xc8beb0 }); tSlab.repeat.set(16, 16);
      const mPlaster = M({ map: tPlaster, roughness: 0.9 }); tPlaster.repeat.set(3, 1);
      const mWhite = M({ color: 0xece6da, roughness: 0.85 });
      const mFloor = M({ map: tFloor, roughness: 0.22, metalness: 0.05 }); tFloor.repeat.set(6, 7);
      const mLac = M({ color: 0x7e140c, roughness: 0.32, metalness: 0.05 });
      const mLacD = M({ color: 0x4e0c06, roughness: 0.4 });
      const mTeak = M({ color: 0x4a2a16, roughness: 0.55 });
      const mSoffit = M({ color: 0x4a2c1a, roughness: 0.85 });
      const mEarth = M({ map: tEarth, roughness: 1 }); tEarth.repeat.set(2, 2);
      const mGrass = M({ map: tGrass, roughness: 1, color: 0xa8b090 }); tGrass.repeat.set(8, 8);
      const mWinGlow = new THREE.MeshBasicMaterial({ map: tWin, fog: false }); mats.push(mWinGlow);   // (World M: its handle — at night the windows are dark)
      mLive.winGlow = mWinGlow;
      const mSilver = M({ color: 0xd8dadc, roughness: 0.18, metalness: 0.9 });
      const mBrass = M({ color: 0xc89a48, roughness: 0.26, metalness: 0.85 });
      const mSaffron = M({ color: 0xc8701c, roughness: 0.85 });
      const mCarpet = M({ color: 0x8a1c14, roughness: 0.95 });
      const gold = M({ color: 0xd9a63c, roughness: 0.3, metalness: 0.55, emissive: 0x3a2406, emissiveIntensity: 0.6 });   // (World M: chapter 4's matGold)
      const matDark = M({ color: 0x15100e, roughness: 0.8 });                                                               // (and its matDark)

      /* ---- the sky: a dome of its own, the sun low behind the hall and a little to its west (makeMSky) */
      { const sky = new THREE.Mesh(new THREE.SphereGeometry(138, 48, 24), new THREE.MeshBasicMaterial({ map: tSky, side: THREE.BackSide, fog: false, depthWrite: false }));
        mats.push(sky.material); sky.renderOrder = -5; sky.frustumCulled = false; G.add(sky); }

      /* ---- the ground: the courtyard's slabs, grass beyond the walls, the path's kerbs */
      { const yard = new THREE.Mesh(new THREE.PlaneGeometry(30, 28), mSlab); yard.rotation.x = -Math.PI / 2; yard.position.set(0, 0, 8); yard.receiveShadow = true; G.add(yard);
        const lawn = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), mGrass); lawn.rotation.x = -Math.PI / 2; lawn.position.set(0, -0.02, 0); G.add(lawn);
        const under = new THREE.Mesh(new THREE.PlaneGeometry(14, 16), mSlab); under.rotation.x = -Math.PI / 2; under.position.set(0, 0.004, -9); G.add(under); }
      // the courtyard wall, white with gilt-capped piers; the gate at the south
      { const wallH = 1.7;
        const seg = (x0, z0, x1, z1) => { const L = Math.hypot(x1 - x0, z1 - z0), a = Math.atan2(z1 - z0, x1 - x0);
          const w = box(L, wallH, 0.24, (x0 + x1) / 2, wallH / 2, (z0 + z1) / 2, mWhite, G, false); w.rotation.y = -a;
          box(L + 0.08, 0.08, 0.32, (x0 + x1) / 2, wallH + 0.04, (z0 + z1) / 2, mLac, G, false).rotation.y = -a;
          for (let s = 0; s <= L + 0.01; s += 3.2) { const px = x0 + (x1 - x0) * s / L, pz = z0 + (z1 - z0) * s / L;
            box(0.42, wallH + 0.3, 0.42, px, (wallH + 0.3) / 2, pz, mWhite, G, false);
            const bud = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), gold); bud.scale.y = 1.6; bud.position.set(px, wallH + 0.5, pz); G.add(bud); } };
        seg(-15, -20, -15, 22); seg(15, -20, 15, 22); seg(-15, 22, -2.2, 22); seg(2.2, 22, 15, 22); seg(-15, -20, 15, -20); }

      /* ---- THE HALL: its base, walls, door, windows; roofs in three steps; gables with naga and chofa */
      { const cx = 0, cz = (MHALL.z0 + MHALL.z1) / 2, W = MHALL.x1 - MHALL.x0, D = MHALL.z1 - MHALL.z0, T = MHALL.T, top = F + MHALL.H;
        box(W + 0.8, F, D + 0.8, cx, F / 2, cz, mWhite, G, false);                                      // the base
        box(W + 0.86, 0.06, D + 0.86, cx, F - 0.03, cz, gold, G, false);                                // its gilt lip
        for (let i = 0; i < 3; i++) box(3.4, 0.15, 0.4, 0, 0.075 + i * 0.15, MHALL.z1 + 1.2 - i * 0.4, mWhite, G, false);   // the steps
        // the walls: the back, the two sides, and the front in three pieces round the door
        const wall = (w, h, d, x, y, z) => box(w, h, d, x, y, z, mPlaster, G, false);
        wall(W, MHALL.H, T, cx, F + MHALL.H / 2, MHALL.z0 - T / 2);
        wall(T, MHALL.H, D + 2 * T, MHALL.x0 - T / 2, F + MHALL.H / 2, cz);
        wall(T, MHALL.H, D + 2 * T, MHALL.x1 + T / 2, F + MHALL.H / 2, cz);
        const side = (W / 2 - MDOOR.hw);
        wall(side, MHALL.H, T, MHALL.x0 + side / 2, F + MHALL.H / 2, MHALL.z1 + T / 2);
        wall(side, MHALL.H, T, MHALL.x1 - side / 2, F + MHALL.H / 2, MHALL.z1 + T / 2);
        wall(MDOOR.hw * 2, MHALL.H - MDOOR.h, T, 0, F + MDOOR.h + (MHALL.H - MDOOR.h) / 2, MHALL.z1 + T / 2);
        // the door's gilt frame and its pointed crown, outside and in; the two leaves folded back against the wall inside
        for (const zf of [MHALL.z1 + T + 0.01, MHALL.z1 - 0.01]) {
          for (const s of [-1, 1]) box(0.14, MDOOR.h, 0.05, s * (MDOOR.hw + 0.07), F + MDOOR.h / 2, zf, gold, G, false);
          box(MDOOR.hw * 2 + 0.28, 0.14, 0.05, 0, F + MDOOR.h + 0.07, zf, gold, G, false);
          const cr = new THREE.Mesh(new THREE.ShapeGeometry(mCrown(THREE, MDOOR.hw * 2 + 0.5, 1.2)), gold); cr.position.set(0, F + MDOOR.h + 0.14, zf); if (zf < MHALL.z1) cr.rotation.y = Math.PI; G.add(cr);
        }
        for (const s of [-1, 1]) { const leaf = box(MDOOR.hw, MDOOR.h - 0.05, 0.06, s * (MDOOR.hw + MDOOR.hw / 2 + 0.02), F + MDOOR.h / 2, MHALL.z1 - 0.06, mLac, G, false);
          box(MDOOR.hw * 0.7, 0.04, 0.02, leaf.position.x, F + 2.2, MHALL.z1 - 0.1, gold, G, false); box(MDOOR.hw * 0.7, 0.04, 0.02, leaf.position.x, F + 0.9, MHALL.z1 - 0.1, gold, G, false); }
        // windows: framed, crowned, glowing with the sunset from inside (painted, never a light)
        const winAt = [];
        for (const z of [-4.6, -12.4]) for (const s of [-1, 1]) winAt.push({ x: s > 0 ? MHALL.x1 : MHALL.x0, z, s });
        for (const w of winAt) {
          const xi = w.x - w.s * 0.005, xo = w.x + w.s * (T + 0.012);
          const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 2.0), mWinGlow); glow.position.set(xi, F + 2.0, w.z); glow.rotation.y = w.s > 0 ? -Math.PI / 2 : Math.PI / 2; G.add(glow);
          const dark = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 2.0), mLacD); dark.position.set(xo, F + 2.0, w.z); dark.rotation.y = w.s > 0 ? Math.PI / 2 : -Math.PI / 2; G.add(dark);
          for (const xx of [xi - w.s * 0.03, xo]) {
            for (const dz of [-1, 1]) box(0.06, 2.12, 0.08, xx, F + 2.0, w.z + dz * 0.64, gold, G, false);
            box(0.06, 0.08, 1.36, xx, F + 0.96, w.z, gold, G, false);
            const cr = new THREE.Mesh(new THREE.ShapeGeometry(mCrown(THREE, 1.5, 0.8)), gold); cr.position.set(xx, F + 3.04, w.z);
            cr.rotation.y = (xx === xo) === (w.s > 0) ? Math.PI / 2 : -Math.PI / 2; G.add(cr);
          }
          mLive.shafts.push({ x: xi, z: w.z, s: w.s });
        }
        // the ceiling: dark teak boards and beams; the interior's dado
        const ce = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mTeak); ce.rotation.x = Math.PI / 2; ce.position.set(cx, top - 0.01, cz); G.add(ce);
        for (let z = MHALL.z0 + 1.6; z < MHALL.z1; z += 2.4) box(W, 0.22, 0.18, cx, top - 0.12, z, mLacD, G, false);
        for (const s of [-1, 1]) { box(0.02, 0.9, D, s * (W / 2 - 0.01), F + 0.45, cz, mLac, G, false); box(0.03, 0.05, D, s * (W / 2 - 0.015), F + 0.92, cz, gold, G, false); }
        box(W, 0.9, 0.02, cx, F + 0.45, MHALL.z0 + 0.01, mLac, G, false);
        // the floor: polished stone; a red runner from the door to the altar
        const fl = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mFloor); fl.rotation.x = -Math.PI / 2; fl.position.set(cx, F + 0.002, cz); fl.receiveShadow = true; G.add(fl);
        const run = new THREE.Mesh(new THREE.PlaneGeometry(1.4, D - 2.2), mCarpet); run.rotation.x = -Math.PI / 2; run.position.set(0, F + 0.006, cz + 0.6); G.add(run);
        for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.PlaneGeometry(0.06, D - 2.2), gold); e.rotation.x = -Math.PI / 2; e.position.set(s * 0.73, F + 0.007, cz + 0.6); G.add(e); }
        // two rows of red-lacquered columns, gilt bands and lotus capitals
        const capG = new THREE.LatheGeometry([[0.2, 0], [0.24, 0.06], [0.3, 0.16], [0.34, 0.26], [0.36, 0.3]].map(([a, b]) => new THREE.Vector2(a, b)), 12);
        for (const s of [-1, 1]) for (const z of [-5.6, -10.4, -13.8]) {
          const x = s * 2.45;
          cyl(0.2, 0.2, MHALL.H - 0.35, x, F + (MHALL.H - 0.35) / 2, z, mLac, 14, G);
          for (const by of [0.5, 1.4, MHALL.H - 0.8]) cyl(0.215, 0.215, 0.07, x, F + by, z, gold, 14, G);
          const cap = new THREE.Mesh(capG, gold); cap.position.set(x, F + MHALL.H - 0.35, z); G.add(cap);
        }
        // the roofs in three steps, as chapter 2's: the hall's two tiers, then the porch's stepping forward over the steps
        const tileFor = (t0, slope, len) => { const t = t0.clone(); t.repeat.set(slope / 2.8, len / 2.8); t.needsUpdate = true; madeTex.push(t); return M({ map: t, roughness: 0.6 }); };
        const roofPair = (z0, z1, hw, eave, ridge, tt) => {
          const rise = ridge - eave, slope = Math.hypot(rise, hw), ang = Math.atan2(rise, hw), len = z1 - z0, tile = tileFor(tt, slope, len);
          for (const s of [-1, 1]) {
            const p = new THREE.Mesh(new THREE.BoxGeometry(slope, 0.16, len), [gold, gold, tile, mSoffit, gold, gold]);
            p.rotation.z = -s * ang; p.position.set(s * hw / 2, (eave + ridge) / 2 - 0.08 / Math.cos(ang), (z0 + z1) / 2); G.add(p);
          }
          box(0.24, 0.26, len, 0, ridge + 0.06, (z0 + z1) / 2, gold, G, false);
          return { ang };
        };
        const fins = [], finD = new THREE.Object3D();
        const nagaEdge = (x0, y0, x1, y1, z, s) => {
          const L = Math.hypot(x1 - x0, y1 - y0), nx = (y1 - y0) / L * s, ny = Math.abs(x1 - x0) / L, th = Math.atan2(-nx, ny);
          for (let d = 0.35; d < L - 0.2; d += 0.32) { const k = d / L;
            finD.position.set(x0 + (x1 - x0) * k + nx * 0.1, y0 + (y1 - y0) * k + ny * 0.1, z); finD.rotation.set(0, 0, th + s * 0.35); finD.scale.set(1, 1, 0.35); finD.updateMatrix(); fins.push(finD.matrix.clone()); }
          const g = new THREE.Group(); g.position.set(x0 + s * 0.05, y0 + 0.02, z); G.add(g);
          g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(s * 0.16, 0.06, 0), new THREE.Vector3(s * 0.24, 0.26, 0), new THREE.Vector3(s * 0.2, 0.44, 0)]), 10, 0.05, 6, false), gold));
          const hd = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), gold); hd.scale.set(1.3, 0.85, 0.8); hd.position.set(s * 0.25, 0.47, 0); g.add(hd);
          for (let c = 0; c < 3; c++) { const cr = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.14 - c * 0.02, 5), gold); cr.position.set(s * (0.2 - c * 0.05), 0.56 - c * 0.02, 0); cr.rotation.z = s * (0.3 + c * 0.25); g.add(cr); }
          g.scale.setScalar(1.6);
        };
        const gableFront = (z, hw, eave, ridge) => {
          const rise = ridge - eave, ang = Math.atan2(rise, hw), slope = Math.hypot(rise, hw);
          const carve = M({ map: tex(makeMGable(THREE, cnv, hw * 2, rise)), roughness: 0.5, metalness: 0.2, side: THREE.DoubleSide });
          const tg = new THREE.ShapeGeometry(mTri(THREE, hw * 1.9, rise * 0.95)), tu = tg.attributes.uv, tp = tg.attributes.position;
          for (let i = 0; i < tu.count; i++) tu.setXY(i, tp.getX(i) / (hw * 1.9) + 0.5, tp.getY(i) / (rise * 0.95));
          const tri = new THREE.Mesh(tg, carve); tri.position.set(0, eave, z); G.add(tri);
          box(hw * 1.9, 0.26, 0.14, 0, eave + 0.05, z + 0.05, gold, G, false);
          box(hw * 1.9, 0.12, 0.16, 0, eave + 0.24, z + 0.06, mLac, G, false);
          for (const s of [-1, 1]) { const b = box(slope + 0.35, 0.22, 0.12, s * hw / 2, (eave + ridge) / 2 + 0.1, z + 0.06, gold, G, false); b.rotation.z = -s * ang; nagaEdge(s * (hw + 0.1), eave + 0.05, 0, ridge + 0.15, z + 0.08, s); }
          const cf = []; for (let i = 0; i <= 10; i++) { const k = i / 10; cf.push(new THREE.Vector3(0, ridge + k * 1.3, z + k * k * 0.75)); }
          G.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cf), 16, 0.08, 6, false), gold));
        };
        const RW = W + 2 * T, WT = top;
        const A = { hw: RW / 2 + 1.2, ridge: 12.4, z0: MHALL.z0 - T - 0.9, z1: MHALL.z1 + T + 0.9 };
        A.eave = (WT + 0.08 - 1.2 * A.ridge / A.hw) / (1 - 1.2 / A.hw);
        const lowerY = (d) => A.eave + (A.hw - d) * (A.ridge - A.eave) / A.hw;
        const B = { hw: A.hw - 1.5, ridge: 14.6, z0: A.z0 + 1.6, z1: A.z1 - 1.6 }; B.eave = lowerY(B.hw) + 0.6;
        roofPair(A.z0, A.z1, A.hw, A.eave, A.ridge, tTile);
        const rB = roofPair(B.z0, B.z1, B.hw, B.eave, B.ridge, tTile2);
        for (const s of [-1, 1]) { const dx = B.hw - 0.45, y0 = lowerY(dx) - 0.15, y1 = B.eave + 0.45 * Math.tan(rB.ang) - 0.1;
          box(0.12, y1 - y0, B.z1 - B.z0 - 0.4, s * dx, (y0 + y1) / 2, (B.z0 + B.z1) / 2, mWhite, G, false); }
        gableFront(A.z1, A.hw, A.eave, A.ridge); gableFront(B.z1, B.hw, B.eave, B.ridge);
        for (const t2 of [A, B]) { const tri = new THREE.Mesh(new THREE.ShapeGeometry(mTri(THREE, t2.hw * 1.9, (t2.ridge - t2.eave) * 0.95)), gold); tri.position.set(0, t2.eave, t2.z0); tri.rotation.y = Math.PI; G.add(tri); }
        // the porch: its own roof stepping forward over the steps, on two white pillars and a lacquered beam
        const P = { hw: 3.6, eave: 4.3, ridge: 6.9, z0: MHALL.z1 + T, z1: MHALL.z1 + 2.2 };
        roofPair(P.z0, P.z1, P.hw, P.eave, P.ridge, tTile); gableFront(P.z1, P.hw, P.eave, P.ridge);
        for (const s of [-1, 1]) { const px = s * 2.7, pz = MHALL.z1 + 1.9;
          box(0.62, 0.3, 0.62, px, 0.15, pz, mWhite, G, false); box(0.4, 4.0, 0.4, px, 0.3 + 2.0, pz, mWhite, G, false);
          for (const by of [0.7, 2.4, 3.9]) box(0.43, 0.07, 0.43, px, by, pz, gold, G, false);
          const cap = new THREE.Mesh(capG, gold); cap.scale.setScalar(1.05); cap.position.set(px, 4.25, pz); G.add(cap); }
        box(6.2, 0.3, 0.36, 0, 4.5, MHALL.z1 + 1.9, mLac, G, false);
        { const bladeIM = new THREE.InstancedMesh(new THREE.ConeGeometry(0.075, 0.24, 3), gold, fins.length);
          fins.forEach((m, i) => bladeIM.setMatrixAt(i, m)); bladeIM.instanceMatrix.needsUpdate = true; bladeIM.computeBoundingSphere(); G.add(bladeIM); }
        // little bells under the eaves
        { const hang = []; for (const s of [-1, 1]) for (let z = A.z1 - 0.6; z > A.z0 + 0.5; z -= 1.6) hang.push([s * (A.hw - 0.05), A.eave - 0.08, z]);
          const bellG = new THREE.LatheGeometry([[0, 0.09], [0.005, 0.09], [0.005, 0.0], [0.03, -0.005], [0.045, -0.04], [0.06, -0.1], [0.064, -0.11], [0, -0.11]].map(([a, b]) => new THREE.Vector2(a, b)), 10);
          const im = new THREE.InstancedMesh(bellG, gold, hang.length), d = new THREE.Object3D();
          hang.forEach(([x, y, z], i) => { d.position.set(x, y, z); d.rotation.set(0, i * 0.7, (hash(i, 77) - 0.5) * 0.12); d.scale.setScalar(1.6); d.updateMatrix(); im.setMatrixAt(i, d.matrix); });
          im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); G.add(im); }
      }

      /* ---- inside: the altar, the Buddha, candles, flowers, incense; the monk's dais; the box; the bowl and vessel */
      { // the Buddha's altar: a red-and-gold screen on the back wall, three stepped tiers
        const scr = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 4.2), M({ map: tScreen, roughness: 0.55, metalness: 0.15 })); scr.position.set(0, F + 2.2, MHALL.z0 + 0.03); G.add(scr);
        for (let i = 0; i < 3; i++) { const w = MALT.w - i * 0.6, d = MALT.d - i * 0.3, h = 0.42;
          box(w, h, d, 0, F + h / 2 + i * h, MALT.z - 0.15 + i * 0.15, i % 2 ? mLac : gold, G, false);
          box(w + 0.04, 0.03, d + 0.04, 0, F + (i + 1) * h, MALT.z - 0.15 + i * 0.15, gold, G, false); }
        const altTop = F + 3 * 0.42;
        thai('buddha', 0, altTop, MALT.z + 0.15, { s: 4.0, hd: true, hdAt: 2.5, parent: G, cast: false });
        for (const s of [-1, 1]) {
          thai('candle', s * 0.9, F + 2 * 0.42, MALT.z + 0.05, { parent: G, s: 1.4 });
          thai('orchid', s * 1.35, F + 0.42, MALT.z - 0.2, { parent: G, s: 1.3 });
          thai('lotusbowl', s * 0.55, F + 2 * 0.42, MALT.z + 0.1, { parent: G, s: 0.8 });
        }
        thai('incense', 0, F + 2 * 0.42, MALT.z + 0.3, { parent: G, s: 1.0 });
        // the flames on the altar and the dais, and the incense's smoke (painted; never a light)
        /* (CP13, the counter's vision review: the dais flame stood in the candle's wax. Measured off the kit's candle: a
           candlestick to its dish at 0.23, the taper to 0.36, its tip to 0.411 at s 1 — so each flame is put on its own
           candle's tip, 0.41 × its scale, where chapter 4's numbers had them 0.11 and 0.23 m down in the wax) */
        const TIP = 0.41;
        for (const [x, y, z] of [[-0.9, F + 2 * 0.42 + TIP * 1.4, MALT.z + 0.05], [0.9, F + 2 * 0.42 + TIP * 1.4, MALT.z + 0.05], [MDAIS.x - 0.55, F + MDAIS.h + TIP * 0.9, MDAIS.z + 1.0]]) {
          const fm = new THREE.SpriteMaterial({ map: tFlame, color: 0xffd090, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }); mats.push(fm);
          const fl = new THREE.Sprite(fm); fl.scale.set(0.05, 0.11, 1); fl.position.set(x, y, z); G.add(fl);
          const hm = new THREE.SpriteMaterial({ map: tGlow, color: 0xff9a40, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending }); mats.push(hm);
          const halo = new THREE.Sprite(hm); halo.scale.set(0.5, 0.5, 1); halo.position.set(x, y, z); G.add(halo);
          mLive.flames.push({ fl, halo, k: Math.random() * 6, y });
        }
        for (let i = 0; i < 6; i++) { const m = new THREE.SpriteMaterial({ map: tSmoke, color: 0xe8e0d8, transparent: true, opacity: 0, depthWrite: false }); mats.push(m);
          const sp = new THREE.Sprite(m); G.add(sp); mLive.smoke.push({ sp, t: i / 6, k: i * 1.7 }); }
        mLive.smokeAt = new THREE.Vector3(0, F + 2 * 0.42 + 0.3, MALT.z + 0.3);

        // the monk's dais: carpeted, gilt-edged, its back panel on the wall; a backrest cushion; a phan of flowers
        const dx = MDAIS.x, dz = MDAIS.z, dw = MDAIS.w, dd = MDAIS.d, dh = MDAIS.h;
        box(dw, dh, dd, dx, F + dh / 2, dz, mLac, G, false);
        box(dw + 0.04, 0.04, dd + 0.04, dx, F + dh, dz, gold, G, false);
        const top = new THREE.Mesh(new THREE.PlaneGeometry(dw - 0.1, dd - 0.1), mCarpet); top.rotation.x = -Math.PI / 2; top.position.set(dx, F + dh + 0.022, dz); G.add(top);
        /* (CP13, the counter's vision review: at x1 − 0.03 the panel lay IN the face of the dado's gold strip, which runs the
           wall's length at F + 0.92 — a dashed gold line flickered across it behind the monk; 1.5 cm in front of it now. It
           is chapter 4's merit film's panel too, the flicker Chad named there) */
        const panel = new THREE.Mesh(new THREE.PlaneGeometry(dd, 2.6), M({ map: tScreen, roughness: 0.55, metalness: 0.15 })); panel.position.set(MHALL.x1 - 0.045, F + dh + 1.3, dz); panel.rotation.y = -Math.PI / 2; G.add(panel);
        thai('cushtri', MHALL.x1 - 0.32, F + dh, dz, { parent: G, ry: -Math.PI / 2, s: 1.0 });
        thai('phan', dx - 0.55, F + dh, dz - 0.95, { parent: G, s: 0.9 });
        thai('candle', dx - 0.55, F + dh, dz + 1.0, { parent: G, s: 0.9 });
        thai('reedmat', MKNEEL.x - 0.05, F, MKNEEL.z, { parent: G, ry: Math.PI / 2, s: 1.0 });
        // a ceremonial fan (talapat) standing in its holder beside him: a gilt-rimmed leaf on a lacquered pole
        { const fan = new THREE.Group(); fan.position.set(dx + 0.15, F + dh, dz - 0.95); G.add(fan);
          cyl(0.012, 0.012, 1.5, 0, 0.75, 0, mLacD, 8, fan);
          const leaf = new THREE.Mesh(new THREE.CircleGeometry(0.26, 24), M({ color: 0x8a1810, roughness: 0.6, side: THREE.DoubleSide })); leaf.scale.y = 1.25; leaf.position.y = 1.2; leaf.rotation.y = -Math.PI / 2; fan.add(leaf);
          const rim = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.012, 6, 32), gold); rim.scale.y = 1.25; rim.position.y = 1.2; rim.rotation.y = -Math.PI / 2; fan.add(rim); }

        // the donation box by the door: a lacquered stand, a teak box with its slot and its sign
        { const g = new THREE.Group(); g.position.set(MBOX.x, F, MBOX.z); G.add(g);
          box(0.72, 0.74, 0.5, 0, 0.37, 0, mLac, g, false); box(0.76, 0.03, 0.54, 0, 0.75, 0, gold, g, false);
          box(0.56, 0.44, 0.38, 0, 0.77 + 0.22, 0, mTeak, g, false);
          const fr = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 0.42), M({ map: tBox, roughness: 0.6 })); fr.position.set(0, 0.99, 0.191); g.add(fr);
          box(0.58, 0.02, 0.4, 0, 1.22, 0, mTeak, g, false);                               // the lid, teak
          for (const [w, d, x, z] of [[0.6, 0.016, 0, 0.2], [0.6, 0.016, 0, -0.2], [0.016, 0.4, 0.29, 0], [0.016, 0.4, -0.29, 0]]) box(w, 0.024, d, x, 1.221, z, gold, g, false);   // its gilt edge
          box(0.30, 0.004, 0.064, 0, 1.232, 0, gold, g, false);                               // the brass slot plate
          const slot = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.012), matDark); slot.rotation.x = -Math.PI / 2; slot.position.set(0, 1.2345, 0); g.add(slot); }   // the slot, flush (CP6: a raised black bar read as a block on the lid)
        // the envelope in the box's slot (the insert) and his own (the hand): the same drawn front
        { const mE = M({ map: tEnv, roughness: 0.85 }), mEb = M({ color: 0xf2ede0, roughness: 0.9 });
          const mk = () => { const e = new THREE.Group();
            const f = new THREE.Mesh(new THREE.PlaneGeometry(0.17, 0.095), mE); f.position.z = 0.0011; e.add(f);
            const b = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.095, 0.002), mEb); e.add(b);
            return e; };
          mLive.envelope = mk(); mLive.envelope.visible = false;                         // his, for kit.hold
          const ins = mk(); ins.rotation.set(0, 0, 0); ins.position.set(MBOX.x, F + 1.235 + 0.05, MBOX.z); ins.visible = false; G.add(ins); mLive.envIn = ins;
          owned.push({ dispose: () => mLive.envelope.traverse(o => { if (o.geometry) o.geometry.dispose(); }) }); }
        // the silver bowl and the brass vessel for kruat nam, on the floor before his knees
        { const bowl = new THREE.Group(); bowl.position.set(MBOWL.x, F, MBOWL.z); G.add(bowl);
          const prof = [[0.0, 0.0], [0.05, 0.0], [0.055, 0.012], [0.075, 0.03], [0.088, 0.055], [0.094, 0.075], [0.098, 0.082], [0.094, 0.082], [0.088, 0.074], [0.08, 0.05], [0.06, 0.026], [0.0, 0.016]];
          const bg = new THREE.LatheGeometry(prof.map(([a, b]) => new THREE.Vector2(a, b)), 40);
          const b = new THREE.Mesh(bg, mSilver); bowl.add(b);
          const ring = new THREE.Mesh(new THREE.TorusGeometry(0.096, 0.003, 6, 40), mSilver); ring.rotation.x = Math.PI / 2; ring.position.y = 0.082; bowl.add(ring);
          // its water: a disc whose level rises as it fills (mTick), with the ripples on it
          const wm = new THREE.MeshStandardMaterial({ color: 0x9fb6c0, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.72 }); mats.push(wm);
          const water = new THREE.Mesh(new THREE.CircleGeometry(0.08, 32), wm); water.rotation.x = -Math.PI / 2; water.position.y = 0.022; water.visible = false; bowl.add(water);
          mLive.water = water; mLive.bowl = bowl;
          for (let i = 0; i < 5; i++) { const rm = new THREE.MeshBasicMaterial({ map: tRip, transparent: true, opacity: 0, depthWrite: false, color: 0xfff4e8 }); mats.push(rm);
            const r = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.05), rm); r.rotation.x = -Math.PI / 2; r.position.y = 0.0225; bowl.add(r); mLive.ripples.push({ r, t: i / 5 }); }
          // the vessel: a small brass kendi — round body, a neck, a spout — held from above the frame, tipping
          const v = new THREE.Group(); G.add(v); mLive.vessel = v;
          const vb = new THREE.LatheGeometry([[0, 0], [0.035, 0.002], [0.055, 0.02], [0.062, 0.05], [0.055, 0.08], [0.03, 0.1], [0.018, 0.115], [0.02, 0.15], [0.026, 0.158], [0.0, 0.158]].map(([a, b]) => new THREE.Vector2(a, b)), 28);
          const body = new THREE.Mesh(vb, mBrass); v.add(body);
          const sp = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0.04, 0.05, 0), new THREE.Vector3(0.08, 0.07, 0), new THREE.Vector3(0.11, 0.095, 0)]), 8, 0.007, 8, false), mBrass); v.add(sp);
          v.userData.spout = new THREE.Vector3(0.112, 0.096, 0);
          v.visible = false; }
        // the water itself: a thin stream (a tube re-shaped every frame from the spout to the surface) with its flow
        { const sm = new THREE.MeshBasicMaterial({ map: tStream, color: 0xe8f4ff, transparent: true, opacity: 0.7, depthWrite: false, side: THREE.DoubleSide }); mats.push(sm);
          tStream.wrapS = tStream.wrapT = THREE.RepeatWrapping;
          mLive.streamMat = sm; mLive.streamGeo = null;
          const st = new THREE.Mesh(new THREE.BufferGeometry(), sm); st.visible = false; st.frustumCulled = false; G.add(st); mLive.stream = st;
          for (let i = 0; i < 10; i++) { const gm = new THREE.SpriteMaterial({ map: tGlow, color: 0xfff0d8, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }); mats.push(gm);
            const s = new THREE.Sprite(gm); s.scale.set(0.012, 0.012, 1); s.visible = false; G.add(s); mLive.drops.push({ s, t: i / 10 }); } }
        // light through the west windows: slanted shafts of the sunset, dust turning in them (painted)
        for (const w of mLive.shafts) {
          if (w.s > 0) continue;
          const shm = new THREE.MeshBasicMaterial({ map: tex(makeMShaft(THREE, cnv)), color: 0xffc890, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false }); mats.push(shm);
          const sh = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 1.3), shm);
          sh.position.set(w.x + 2.3, F + 1.25, w.z + 0.9); sh.rotation.set(0, -0.62, -0.42); G.add(sh); w.mesh = sh;
        }
      }

      /* ---- the courtyard: the bell in its pavilion, the bodhi on its plinth, lamps, a spirit house, plants */
      { // the bell pavilion: four red posts, a small two-step roof, the bronze bell hanging with its striker
        const g = new THREE.Group(); g.position.set(MBELL.x, 0, MBELL.z); g.rotation.y = 0.5; G.add(g);
        box(2.6, 0.3, 2.6, 0, 0.15, 0, mWhite, g, false);
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) { cyl(0.09, 0.09, 2.9, sx * 1.05, 0.3 + 1.45, sz * 1.05, mLac, 10, g); cyl(0.1, 0.1, 0.06, sx * 1.05, 0.9, sz * 1.05, gold, 10, g); }
        box(2.5, 0.16, 2.5, 0, 3.25, 0, mLac, g, false);
        const roof = new THREE.Mesh(new THREE.ConeGeometry(2.1, 1.2, 4, 1), M({ map: tTile, roughness: 0.6 })); roof.rotation.y = Math.PI / 4; roof.position.y = 3.95; g.add(roof);
        const roof2 = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.9, 4, 1), M({ map: tTile2, roughness: 0.6 })); roof2.rotation.y = Math.PI / 4; roof2.position.y = 4.75; g.add(roof2);
        const fin = new THREE.Mesh(new THREE.ConeGeometry(0.08, 1.0, 8), gold); fin.position.y = 5.6; g.add(fin);
        const swing = new THREE.Group(); swing.position.set(0, 3.15, 0); g.add(swing);
        cyl(0.012, 0.012, 0.4, 0, -0.2, 0, mLacD, 6, swing);
        const bg = new THREE.LatheGeometry([[0, 0.0], [0.04, 0.0], [0.07, -0.03], [0.12, -0.2], [0.17, -0.45], [0.22, -0.62], [0.24, -0.66], [0.0, -0.66]].map(([a, b]) => new THREE.Vector2(a, b)), 28);
        const bell = new THREE.Mesh(bg, M({ color: 0x8a6a34, roughness: 0.35, metalness: 0.8 })); bell.position.y = -0.4; swing.add(bell);
        mLive.bell = { swing, t: -9 };
        const striker = cyl(0.05, 0.05, 1.0, 0.5, 2.3, 0, mTeak, 8, g); striker.rotation.z = Math.PI / 2;
      }
      { // the bodhi's plinth: a white ring wall with a gilt lip, earth inside; the cloth round the trunk once it lands
        const t = MTREE;
        const ringO = new THREE.Mesh(new THREE.CylinderGeometry(t.r, t.r, t.h, 40, 1, true), mWhite); ringO.position.set(t.x, t.h / 2, t.z); G.add(ringO);
        const lip = new THREE.Mesh(new THREE.TorusGeometry(t.r, 0.06, 6, 48), gold); lip.rotation.x = Math.PI / 2; lip.position.set(t.x, t.h, t.z); G.add(lip);
        const earth = new THREE.Mesh(new THREE.CircleGeometry(t.r - 0.03, 40), mEarth); earth.rotation.x = -Math.PI / 2; earth.position.set(t.x, t.h - 0.02, t.z); G.add(earth);
        // the wet patch the water makes (a darker, glossier disc that grows), and the bowl that pours it (the insert)
        const wm = new THREE.MeshStandardMaterial({ color: 0x1c120a, roughness: 0.25, transparent: true, opacity: 0, depthWrite: false, alphaMap: tex(makeMWet(THREE, cnv)) }); mats.push(wm);
        const wet = new THREE.Mesh(new THREE.CircleGeometry(0.34, 28), wm); wet.rotation.x = -Math.PI / 2; wet.position.set(t.x - 0.62, t.h - 0.012, t.z + 0.42); G.add(wet); mLive.wet = wet;
        const b2 = mLive.bowl.clone(true); b2.visible = false; G.add(b2); mLive.bowl2 = b2;
        b2.traverse(o => { if (o === b2) return; if (o.material && o.material.transparent) o.visible = false; });   // (its own water hidden: the stream leaves it)
        // fallen bodhi leaves on the earth, lying flat, one instanced mesh (CP6: drawn roots, thick or thin, read as worms
        // and as cut cigars at the insert's distance; a planter under a bodhi has its leaves, not its roots, on show)
        { const lm = new THREE.MeshStandardMaterial({ map: tPetal, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.85 }); mats.push(lm);
          const LN = 70, leaves = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.075, 0.095), lm, LN);
          const lmx = new THREE.Matrix4(), lq = new THREE.Quaternion(), le = new THREE.Euler(), lc = new THREE.Color();
          for (let i = 0; i < LN; i++) {
            const a = hash(i, 51) * Math.PI * 2, rr = 0.35 + Math.sqrt(hash(i, 53)) * (t.r - 0.45);
            le.set(-Math.PI / 2 + (hash(i, 55) - 0.5) * 0.25, 0, hash(i, 57) * Math.PI * 2, 'XZY'); lq.setFromEuler(le);
            const s = 0.75 + hash(i, 59) * 0.5;
            lmx.compose(new THREE.Vector3(t.x + Math.cos(a) * rr, t.h - 0.016 + hash(i, 61) * 0.004, t.z + Math.sin(a) * rr), lq, new THREE.Vector3(s, s, s));
            leaves.setMatrixAt(i, lmx);
            leaves.setColorAt(i, lc.set([0xb8a060, 0x8a6a3a, 0xc8b070, 0x7a8a40, 0x9a7a44][i % 5]));
          }
          leaves.receiveShadow = true; leaves.computeBoundingSphere(); G.add(leaves); }
        // the warm glow the light is born in, on the wet earth (painted, additive)
        { const gg = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({ map: tGlow, color: 0xffd8a0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
          mats.push(gg.material); gg.rotation.x = -Math.PI / 2; gg.position.set(t.x - 0.62, t.h - 0.004, t.z + 0.42); gg.visible = false; G.add(gg); mLive.groundGlow = gg; }
        // bodhi leaves let go by the breeze (CP6: frangipani petals drew as white stars against the dusk), and the
        // light that rises from the water
        for (let i = 0; i < 18; i++) { const pm = new THREE.SpriteMaterial({ map: tPetal, color: [0xffffff, 0xe8e0a0, 0xc8d890][i % 3], transparent: true, opacity: 0, depthWrite: false }); mats.push(pm);
          const s = new THREE.Sprite(pm); s.visible = false; G.add(s); mLive.petals.push({ s, i }); }
        const mm = new THREE.SpriteMaterial({ map: tGlow, color: 0xfff6e0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }); mats.push(mm);
        mLive.mote = new THREE.Sprite(mm); mLive.mote.visible = false; G.add(mLive.mote);
        const hm = new THREE.SpriteMaterial({ map: tGlow, color: 0xffd8a0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }); mats.push(hm);
        mLive.moteHalo = new THREE.Sprite(hm); mLive.moteHalo.visible = false; G.add(mLive.moteHalo);
        for (let i = 0; i < 14; i++) { const tm = new THREE.SpriteMaterial({ map: tGlow, color: 0xfff0d0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }); mats.push(tm);
          const s = new THREE.Sprite(tm); s.visible = false; G.add(s); mLive.trail.push({ s, i }); }
      }
      // lamps along the path (warm, just lit: painted), a spirit house, potted plants and the kit's pieces
      for (const [x, z] of [[-2.6, 8], [2.6, 8], [-2.6, 14], [2.6, 14], [-2.6, 20], [2.6, 20]]) {
        cyl(0.05, 0.07, 2.4, x, 1.2, z, mLacD, 8, G);
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffd8a0, fog: false })); mats.push(lamp.material); lamp.position.set(x, 2.5, z); G.add(lamp);
        const hm = new THREE.SpriteMaterial({ map: tGlow, color: 0xffb060, transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending }); mats.push(hm);
        const h = new THREE.Sprite(hm); h.scale.set(1.3, 1.3, 1); h.position.set(x, 2.5, z); G.add(h);
      }
      thai('spirit', -11.5, 0, 14.5, { parent: G, ry: Math.PI / 2, s: 1.2 });
      for (const [x, z, k, s] of [[-4.2, 0.4, 'lotusbowl', 1.4], [4.2, 0.4, 'lotusbowl', 1.4], [-7.6, -1.5, 'travpalm', 1.6], [7.6, -1.5, 'travpalm', 1.6], [12.5, 15, 'banana', 1.5], [-12.6, 9, 'fern', 1.6], [6.6, 13.5, 'urnclay', 1.3], [-6.4, 13.2, 'waterjar', 1.2]])
        thai(k, x, 0, z, { parent: G, s, ry: hash(x, z) * 6 });
      // a small white chedi on the west, its spire gilt
      { const cg = new THREE.Group(); cg.position.set(-11.5, 0, -10); G.add(cg);
        for (let i = 0; i < 4; i++) box(3.2 - i * 0.7, 0.5, 3.2 - i * 0.7, 0, 0.25 + i * 0.5, 0, mWhite, cg, false);
        const bell = new THREE.Mesh(new THREE.SphereGeometry(0.9, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2), mWhite); bell.scale.y = 1.4; bell.position.y = 2.0; cg.add(bell);
        const spire = new THREE.Mesh(new THREE.ConeGeometry(0.32, 3.4, 16), gold); spire.position.y = 4.9; cg.add(spire);
        for (let i = 0; i < 6; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.3 - i * 0.04, 0.04, 6, 16), gold); r.rotation.x = Math.PI / 2; r.position.y = 3.4 + i * 0.22; cg.add(r); } }
      // trees: the bodhi itself (always — the film is built on its roots), and the city's trees beyond the wall
      if (plantTrees) {
        treeStands.push(plantTrees(G, [{ x: MTREE.x, y: MTREE.h - 0.02, z: MTREE.z, h: 12.5, always: true, kind: 0 }], { seed: 271, tint: 0xf0c8a0, shadow: false }));
        treeStands.push(plantTrees(G, [[-13, 18], [13, 19], [-13.4, -4], [13.6, -6], [-20, 6], [20, 8], [-24, -14], [22, -20], [-6, 30], [8, 32], [-30, 24], [30, 26], [0, -30], [-16, -32], [16, -30]]
          .map(([x, z], i) => ({ x, z, h: 7 + (i % 4) * 1.4 })), { seed: 277, tint: 0xd8b090, lowKeep: 0.6 }));
      }
      // the city beyond: HDB blocks round the temple, their windows coming on (chapter 3's estate recipe, the game's block)
      parseOnce('hdb').then(gl => {
        if (!alive) return;
        const est = new THREE.Group(); G.add(est);
        for (const [x, z, ry] of [[-46, -62, 0.2], [-8, -78, -0.1], [34, -66, 0.35], [70, -30, 1.4], [-74, -18, -1.3], [62, 40, 0.9], [-60, 52, -0.6], [10, 92, 0.05]]) {
          const b = gl.scene.clone(true); b.scale.setScalar(0.001); b.rotation.y = ry; b.updateMatrixWorld(true);
          const bb = new THREE.Box3().setFromObject(b); b.position.set(x - (bb.min.x + bb.max.x) / 2, -bb.min.y, z - (bb.min.z + bb.max.z) / 2); est.add(b);
        }
        est.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
      }).catch(err => { console.warn('hdb failed to load', err); ctx.loadFail && ctx.loadFail('hdb', err); });

      /* ---- Chad's monk on his dais (chapter 3's shop monk, the same file): seated cross-legged on his own floor take,
         grounded on his posed skin, his hands joined by a two-bone solve with the palms measured off his own skin
         (e3c3's monkPray), his head a little bowed; while the chant runs his head dips on each of its four phrases */
      { const mk = merit.monk;
        const g0 = new THREE.Group(); g0.position.set(MDAIS.x + 0.12, F + MDAIS.h, MDAIS.z); g0.rotation.y = -Math.PI / 2; G.add(g0); mk.group = g0;
        const cush = box(0.9, 0.06, 0.74, 0, 0.03, 0.05, mSaffron, g0, false);   // (CP13, the counter's vision review: at 0.72 his crossed feet hung over its ends)
        parseOnce('monkshop').then((gltf) => {
          if (!alive) return;
          const g = cloneSkinned(gltf.scene);
          g.traverse(o => { if (o.isBone) mk.bones.push(o); if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
          g0.add(g); mk.model = g;
          g.updateMatrixWorld(true);
          let lo = Infinity, hi = -Infinity;
          for (const b of mk.bones) { b.getWorldPosition(_mv); lo = Math.min(lo, _mv.y); hi = Math.max(hi, _mv.y); }
          const crown = mk.bones.some(b => /HeadTop_End|head_end/.test(b.name));
          if (isFinite(lo) && hi > lo) g.scale.multiplyScalar(1.70 / ((hi - lo) / (crown ? 1 : 0.935)));
          const clip = (gltf.animations || []).find(c => c.name === 'Sit_Cross_Legged_on_Floor');
          if (clip) { const mixer = new THREE.AnimationMixer(g), act = mixer.clipAction(clip);
            act.play(); act.time = clip.duration * 0.3; act.paused = true; mixer.update(0);
            owned.push({ dispose: () => mixer.stopAllAction() }); }
          g.updateMatrixWorld(true);
          let sl = Infinity, seat = Infinity;
          g.traverse(o => {
            if (!o.isSkinnedMesh) return;
            o.skeleton.update();
            const hb = o.skeleton.bones.map(b => /hips|pelvis/i.test(b.name));
            const sI = o.geometry.attributes.skinIndex, sW = o.geometry.attributes.skinWeight, n = o.geometry.attributes.position.count;
            for (let i = 0; i < n; i += 7) {
              o.getVertexPosition(i, _mv); _mv.applyMatrix4(o.matrixWorld); if (_mv.y < sl) sl = _mv.y;
              if (sI && sW) { let w = 0; for (let k = 0; k < 4; k++) if (hb[sI.getComponent(i, k)]) w += sW.getComponent(i, k); if (w > 0.5 && _mv.y < seat) seat = _mv.y; }
            }
          });
          const cushTop = g0.position.y + 0.06;
          if (isFinite(sl)) g.position.y += (isFinite(seat) ? Math.max(cushTop - 0.008 - seat, cushTop - 0.045 - sl) : cushTop + 0.012 - sl) / g0.scale.y;
          g.updateMatrixWorld(true);
          mk.head = mkBone(mk, /(^|[^A-Za-z])Head(_\d+)?$|mixamorigHead(_\d+)?$/);
          if (mk.head) {
            const tp0 = mk.head.children.find(ch => ch.isBone && /HeadTop|head_end/i.test(ch.name)) || mk.head.children.find(ch => ch.isBone);
            if (tp0) { const fwd = new THREE.Vector3(-1, 0, 0), hp = mk.head.getWorldPosition(new THREE.Vector3()), tp = tp0.getWorldPosition(new THREE.Vector3());
              mkAim(mk.head, tp.sub(hp).normalize(), new THREE.Vector3(0, 1, 0).multiplyScalar(Math.cos(0.2)).addScaledVector(fwd, Math.sin(0.2)).normalize()); g.updateMatrixWorld(true); }
          }
          mkPray(mk, new THREE.Vector3(-1, 0, 0));
          mk.rest = mk.head ? mk.head.quaternion.clone() : null;
          g.updateMatrixWorld(true);
          // his culling sphere round his posed skin (v18.5's law), generous
          const bb = new THREE.Box3();
          g.traverse(o => { if (!o.isSkinnedMesh) return; o.skeleton.update(); const n = o.geometry.attributes.position.count, st = Math.max(1, Math.floor(n / 3000));
            for (let i = 0; i < n; i += st) { o.getVertexPosition(i, _mv); _mv.applyMatrix4(o.matrixWorld); bb.expandByPoint(_mv); } });
          if (!bb.isEmpty()) { const sph = bb.getBoundingSphere(new THREE.Sphere()); sph.radius = Math.max(sph.radius * 1.4, 1.1);
            g.traverse(o => { if (!o.isSkinnedMesh) return; o.frustumCulled = true; const inv = o.matrixWorld.clone().invert(), k = o.matrixWorld.getMaxScaleOnAxis() || 1;
              o.boundingSphere = new THREE.Sphere(sph.center.clone().applyMatrix4(inv), sph.radius / k); }); }
          mk.ready = true;
        }).catch(err => { console.warn('monk failed to load', err); ctx.loadFail && ctx.loadFail('monkshop', err); });
      }
    }
    /* the monk's bones and his añjali, e3c3's own (mAim, mPalmOf, mPalmTo, mPalmReach, monkPray), copied — a chapter
       imports nothing: turn a bone so a world direction `from` becomes `to`; find a hand's palm off its own skin; turn
       the palm to the other hand; solve each arm twice so the wrists stand the palms' thickness apart */
    const _mq = new THREE.Quaternion(), _mq2 = new THREE.Quaternion(), _mv = new THREE.Vector3();
    const mkBone = (mk, re) => mk.bones.find(b => re.test(b.name)) || null;
    function mkAim(bone, from, to) {
      _mq.setFromUnitVectors(from, to);
      bone.getWorldQuaternion(_mq2); _mq2.premultiply(_mq);
      const pq = bone.parent ? bone.parent.getWorldQuaternion(new THREE.Quaternion()) : new THREE.Quaternion();
      bone.quaternion.copy(pq.invert().multiply(_mq2));
    }
    function mkPalmOf(mk, hand, tip, S) {
      mk.model.updateMatrixWorld(true);
      const pts = [];
      mk.model.traverse(o => {
        if (!o.isSkinnedMesh || !o.skeleton) return;
        const bi = o.skeleton.bones.indexOf(hand), ti = tip ? o.skeleton.bones.indexOf(tip) : -1;
        const sI = o.geometry.attributes.skinIndex, sW = o.geometry.attributes.skinWeight;
        if (bi < 0 || !sI || !sW) return;
        o.skeleton.update();
        const n = o.geometry.attributes.position.count;
        for (let i = 0; i < n; i++) {
          let w = 0; for (let k = 0; k < 4; k++) { const j = sI.getComponent(i, k); if (j === bi || (ti >= 0 && j === ti)) w += sW.getComponent(i, k); }
          if (w < 0.6) continue;
          o.getVertexPosition(i, _mv); _mv.applyMatrix4(o.matrixWorld);
          pts.push(hand.worldToLocal(_mv.clone()));
        }
      });
      if (pts.length < 30) return null;
      const f = (tip ? tip.position.clone() : new THREE.Vector3(0, 1, 0)).normalize();
      const m = new THREE.Vector3(); for (const q of pts) m.add(q); m.multiplyScalar(1 / pts.length);
      const e1 = new THREE.Vector3(1, 0, 0); if (Math.abs(e1.dot(f)) > 0.9) e1.set(0, 0, 1);
      e1.addScaledVector(f, -e1.dot(f)).normalize();
      const e2 = new THREE.Vector3().crossVectors(f, e1), d = new THREE.Vector3();
      let saa = 0, sab = 0, sbb = 0;
      for (const q of pts) { d.subVectors(q, m); const a = d.dot(e1), b = d.dot(e2); saa += a * a; sab += a * b; sbb += b * b; }
      const th = 0.5 * Math.atan2(2 * sab, saa - sbb);
      const w = e1.clone().multiplyScalar(Math.cos(th)).addScaledVector(e2, Math.sin(th));
      let s3 = 0; for (const q of pts) { const x = d.subVectors(q, m).dot(w); s3 += x * x * x; }
      const thumb = w.clone().multiplyScalar(s3 < 0 ? -1 : 1);
      const palm = S === 'Left' ? new THREE.Vector3().crossVectors(f, thumb) : new THREE.Vector3().crossVectors(thumb, f);
      return { pts: pts.filter((_, i) => i % 2 === 0), f, palm: palm.normalize() };
    }
    function mkPalmTo(hand, pl, inward) {
      const hq = hand.getWorldQuaternion(new THREE.Quaternion());
      const Fv = pl.f.clone().applyQuaternion(hq).normalize();
      const N = pl.palm.clone().applyQuaternion(hq), Tv = inward.clone();
      N.addScaledVector(Fv, -N.dot(Fv)); Tv.addScaledVector(Fv, -Tv.dot(Fv));
      if (N.lengthSq() < 1e-8 || Tv.lengthSq() < 1e-8) return;
      N.normalize(); Tv.normalize();
      const ang = Math.atan2(new THREE.Vector3().crossVectors(N, Tv).dot(Fv), N.dot(Tv));
      _mq.setFromAxisAngle(Fv, ang);
      hand.getWorldQuaternion(_mq2); _mq2.premultiply(_mq);
      const pq = hand.parent ? hand.parent.getWorldQuaternion(new THREE.Quaternion()) : new THREE.Quaternion();
      hand.quaternion.copy(pq.invert().multiply(_mq2));
    }
    function mkPalmReach(hand, pl, inward) {
      hand.updateWorldMatrix(true, false);
      const wr = hand.getWorldPosition(new THREE.Vector3()), q = [];
      for (const pt of pl.pts) q.push(_mv.copy(pt).applyMatrix4(hand.matrixWorld).sub(wr).dot(inward));
      q.sort((x, y) => x - y);
      return Math.max(0.005, q[Math.floor(q.length * 0.97)] || 0);
    }
    function mkPray(mk, fwd) {
      const g = mk.model; g.updateMatrixWorld(true);
      const side = new THREE.Vector3(fwd.z, 0, -fwd.x), up = new THREE.Vector3(0, 1, 0);
      const chestB = mkBone(mk, /LeftShoulder(_\d+)?$/), chest = chestB && chestB.parent;
      if (!chest) return;
      const C = chest.getWorldPosition(new THREE.Vector3());
      for (const sd of [1, -1]) {
        const S = sd > 0 ? 'Left' : 'Right';
        const arm = mkBone(mk, new RegExp(S + 'Arm(_\\d+)?$')), fore = mkBone(mk, new RegExp(S + 'ForeArm(_\\d+)?$')), hand = mkBone(mk, new RegExp(S + 'Hand(_\\d+)?$'));
        if (!arm || !fore || !hand) continue;
        const tip = hand.children.find(ch => ch.isBone);
        const pl = mkPalmOf(mk, hand, tip, S), inward = side.clone().multiplyScalar(-sd);
        const solve = (spread) => {
          const sh = arm.getWorldPosition(new THREE.Vector3()), el = fore.getWorldPosition(new THREE.Vector3()), wr = hand.getWorldPosition(new THREE.Vector3());
          const a = sh.distanceTo(el), b = el.distanceTo(wr);
          const T0 = C.clone().addScaledVector(fwd, 0.10 + a * 0.55).addScaledVector(up, -0.09).addScaledVector(side, sd * spread);
          const dvec = T0.clone().sub(sh); let dl = dvec.length();
          dl = Math.min(Math.max(dl, Math.abs(a - b) + 0.01), a + b - 0.005);
          const dir = dvec.normalize();
          const pole = up.clone().multiplyScalar(-1).addScaledVector(side, sd * 0.55).addScaledVector(fwd, -0.15).normalize();
          const n = pole.addScaledVector(dir, -pole.dot(dir)).normalize();
          const cosA = (a * a + dl * dl - b * b) / (2 * a * dl), sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
          const elbow = sh.clone().addScaledVector(dir, a * cosA).addScaledVector(n, a * sinA);
          mkAim(arm, el.clone().sub(sh).normalize(), elbow.clone().sub(sh).normalize());
          g.updateMatrixWorld(true);
          const el2 = fore.getWorldPosition(new THREE.Vector3()), wr2 = hand.getWorldPosition(new THREE.Vector3());
          const T1 = sh.clone().addScaledVector(dir, dl);
          mkAim(fore, wr2.clone().sub(el2).normalize(), T1.clone().sub(el2).normalize());
          g.updateMatrixWorld(true);
          const el3 = fore.getWorldPosition(new THREE.Vector3()), wr3 = hand.getWorldPosition(new THREE.Vector3());
          const hdir = tip ? tip.getWorldPosition(new THREE.Vector3()).sub(wr3).normalize() : wr3.clone().sub(el3).normalize();
          mkAim(hand, hdir, up.clone().multiplyScalar(0.92).addScaledVector(fwd, 0.25).addScaledVector(side, pl ? 0 : -sd * 0.12).normalize());
          g.updateMatrixWorld(true);
          if (pl) { mkPalmTo(hand, pl, inward); g.updateMatrixWorld(true); }
        };
        solve(0.035);
        if (pl) solve(mkPalmReach(hand, pl, inward) + 0.002);
      }
    }


    buildRoomR();
    /* PLAY I's things (CP6): after the room, whose cups, places and box they stand on (built before it, the first boot
       read the drinks' places before there were any) */
    buildOfferings(); deskBag(); careReset();
    /* PLAY II's (CP7): what the red one's stamps and his slam make jump on the runner, and the window's hours */
    for (const Bt of careLive.bottles) RATTLE.push({ o: Bt.g, y0: Bt.g.position.y });
    for (const C of roomLive.cups) RATTLE.push({ o: C.cup, y0: C.cup.position.y });
    for (const bw of roomLive.bowls) RATTLE.push({ o: bw, y0: bw.position.y });
    for (const ty of roomLive.toys) RATTLE.push({ o: ty, y0: ty.position.y });
    buildCityOut();
    if (warmSounds) warmSounds(['k5stamp', 'k5peek', 'k5pull', 'k5bells', 'k5loosen', 'k5glint', 'k5after']);   // PLAY II's own (CP7; the aftermath's note, CP11)
    /* the epilogue's cues come from epiCues, a helper every ending calls — the engine's scan reads a scene's own source
       and cannot see them, so they are warmed here (CP11: until then they were planned and played nothing) */
    if (warmSounds) warmSounds(['k5epi', 'z5epi0', 'z5epi1', 'z5epi2', 'z5epi3']);
    if (warmSounds) warmSounds(['k5pour', 'k5bottleout', 'k5ratchet', 'k5stiff', 'k5seal', 'k5hiss', 'k5capoff', 'k5tear', 'k5slide', 'k5bubbles',
                                'k5plip', 'k5bend', 'k5foam', 'k5spark', 'k5flick', 'k5catch', 'k5wave', 'k5sand', 'k5wai']);   // PLAY I's own (CP6)
    /* every line said in PLAY (CP13, the sound lens: none was warmed, and sayLine says a line whose bytes have not
       decoded silently after 1.6 s — behind the films' 66 cues the owner's hello could be a moving mouth with no voice;
       e3c1–e3c4 each warm theirs, e3c4's as PLAY_LINES) */
    if (warmSounds) warmSounds(['ow5hello', 'z5yinq', 'ow5yin', 'ow5red', 'ow5shy', 'ow5little', 'ow5give', 'z5children', 'z5promise',
                                'ow5careful', 'z5water', 'z5bag', 'z5red', 'z5shy', 'z5little', 'z5stiff', 'z5incense', 'z5eat', 'z5dedic',
                                'z5wonder', 'z5ask', 'z5loose', 'z5time', 'z5felt', 'z5fasc']);
    buildTemple();                                   // World M (CP5): after everything it reads at call time

    /* ---- FILM M's NIGHT (§4.0b, §4.1c, V30): the hall's dais end by candlelight — a low lacquered table before the dais, a
       gold tray on it with the three facing the monk, two candles on the table's far side and a small bowl of incense, and
       the white thread (sai sin) from his joined hands to a ring round them: a monk chanting a blessing holds one (the
       research's F13: ordinary practice, consistent with consecration; kept). Nothing from a cemetery or a body is anywhere
       in it (§2.7). Drawn only while film M runs (worldM.visible and its own group) */
    const nightSet = { g: null, tray: null, flames: [], smoke: [], thread: null, ring: null, built: false };
    function buildNightSet() {
      const F = MHALL.F, G = new THREE.Group(); G.visible = false; worldM.add(G); nightSet.g = G;
      const tx = MDAIS.x - MDAIS.w / 2 - 0.36, tz = MDAIS.z;
      nightSet.tray = { x: tx, y: F + 0.347, z: tz };
      const mLacq = M({ color: 0x5a0e08, roughness: 0.35 }), mG = M({ color: 0xd9a63c, roughness: 0.3, metalness: 0.6, emissive: 0x3a2406, emissiveIntensity: 0.5 });
      box(0.52, 0.04, 0.74, tx, F + 0.3, tz, mLacq, G, false);
      box(0.54, 0.012, 0.76, tx, F + 0.325, tz, mG, G, false);
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(0.04, 0.28, 0.04, tx + sx * 0.22, F + 0.14, tz + sz * 0.33, mLacq, G, false);
      const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.19, 0.016, 36), mG); tray.position.set(tx, F + 0.339, tz); G.add(tray);
      // two candles on the far (monk's) side of the table, and their painted flames and glow
      const tFl = tex(makeYinFlame(THREE, cnv)), tGl = tex(makeYinGlow(THREE, cnv)), tSm = tex(makeYinSmoke(THREE, cnv));
      const mWax = M({ color: 0xf2e6c8, roughness: 0.7 });
      for (const sz of [-1, 1]) {
        const cx = tx + 0.18, cz = tz + sz * 0.27;
        cyl(0.018, 0.018, 0.13, cx, F + 0.331 + 0.065, cz, mWax, 12, G);
        const fm = new THREE.SpriteMaterial({ map: tFl, color: 0xffd090, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }); mats.push(fm);
        const fl = new THREE.Sprite(fm); fl.scale.set(0.028, 0.06, 1); fl.position.set(cx, F + 0.331 + 0.155, cz); G.add(fl);
        const hm = new THREE.SpriteMaterial({ map: tGl, color: 0xff9a40, transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending }); mats.push(hm);
        const halo = new THREE.Sprite(hm); halo.scale.set(0.42, 0.42, 1); halo.position.copy(fl.position); G.add(halo);
        nightSet.flames.push({ fl, halo, k: sz * 2.1, y: fl.position.y });
      }
      // a small brass bowl of sand with three sticks, its smoke rising
      /* (by photograph: on the tray's monk-side rim the sticks stood between the lens and the three in M3's close-up — it
         stands at the table's near corner, beside the offerings, out of both shots' line to them) */
      { const bx = tx - 0.19, bz = tz - 0.27;
        const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.034, 0.04, 20), M({ color: 0xb8893c, roughness: 0.3, metalness: 0.85 })); bowl.position.set(bx, F + 0.351, bz); G.add(bowl);
        const mStick = M({ color: 0x8a2a18, roughness: 0.8 });
        for (let i = 0; i < 3; i++) { const st = cyl(0.0018, 0.0018, 0.2, bx + (i - 1) * 0.012, F + 0.37 + 0.1, bz + (i - 1) * 0.004, mStick, 5, G); st.rotation.z = (i - 1) * 0.08; }
        for (let i = 0; i < 4; i++) { const m = new THREE.SpriteMaterial({ map: tSm, color: 0xe8e0d8, transparent: true, opacity: 0, depthWrite: false }); mats.push(m);
          const sp = new THREE.Sprite(m); G.add(sp); nightSet.smoke.push({ sp, t: i / 4, x: bx, y: F + 0.57, z: bz }); } }
      // the thread's ring round the three on the tray (the run up to his hands is laid once he has landed: threadLay)
      nightSet.threadMat = M({ color: 0xf2ece0, roughness: 0.85, emissive: 0x2a2620 });
      /* (by photograph: a ring at 0.17 m passed in front of the little one and read across his chest in the close-up — it
         follows the tray's own rim now, round all three at their feet) */
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.0022, 6, 56), nightSet.threadMat); ring.rotation.x = Math.PI / 2; ring.position.set(tx, F + 0.35, tz); G.add(ring);
      nightSet.ring = ring;
    }
    buildNightSet();
    /* the thread from his joined hands down to the ring, sagging between (a tube laid once, when he and his prayer pose have
       landed: the hands' middle read off his bones) */
    function threadLay() {
      if (nightSet.thread || !merit.monk.ready || !merit.monk.model) return;
      const mk = merit.monk, L = mkBone(mk, /LeftHand(_\d+)?$/), R = mkBone(mk, /RightHand(_\d+)?$/);
      if (!L || !R) return;
      mk.model.updateMatrixWorld(true);
      const a = L.getWorldPosition(new THREE.Vector3()).add(R.getWorldPosition(new THREE.Vector3())).multiplyScalar(0.5);
      worldM.worldToLocal(a);
      const T = nightSet.tray, b = new THREE.Vector3(T.x + 0.2, T.y + 0.003, T.z);   // (on the rim's ring, its nearest point to him)
      /* from his joined hands it falls onto the dais, runs to its front and over the gilt lip, and down to the ring (by
         photograph: a sag BELOW both ends — the first cut — ran it through the dais's front, so it seemed to stop in mid-air) */
      const F = MHALL.F, lipX = MDAIS.x - MDAIS.w / 2 - 0.02, topY = F + MDAIS.h + 0.034;   // (a hair over the carpet: at 4 mm the curve dipped into it, a gap in the thread)
      /* three pieces, so no piece can dip under the carpet (a spline through them all did, and broke the thread there): the
         fall from his hands onto the dais, a straight run along it to the lip, and the drop from the lip to the ring */
      const down = new THREE.Vector3(Math.max(lipX + 0.14, a.x - 0.2), topY, a.z + (b.z - a.z) * 0.6);
      const lip = new THREE.Vector3(lipX - 0.005, topY, a.z + (b.z - a.z) * 0.8);
      const curve = new THREE.CurvePath();
      curve.add(new THREE.QuadraticBezierCurve3(a, new THREE.Vector3(down.x + 0.02, (a.y + topY) / 2, (a.z + down.z) / 2), down));
      curve.add(new THREE.LineCurve3(down, lip));
      curve.add(new THREE.QuadraticBezierCurve3(lip, new THREE.Vector3(lip.x - 0.05, topY, lip.z), b));
      nightSet.thread = new THREE.Mesh(new THREE.TubeGeometry(curve, 72, 0.0022, 5, false), nightSet.threadMat);
      nightSet.g.add(nightSet.thread);
    }

    /* ======================================================== THE COUNTER'S FILMS (CP5; CP9 photographs and polishes)
       Every picture is a function of the film's clock (chapter 4's stage.merit shape: a seek, a skip and a slow phone land
       on the same frame); the film functions below hold only their cues, fades and the one track that calls frame(t).
       The light follows the shot, set only when it changes (fLight). */
    const fLive = { lit: null, shot: '', hands: null };
    function fLight(p) { if (fLive.lit !== p && kit && kit.daylight) { kit.daylight(p, 0); fLive.lit = p; } }
    function camAt(px, py, pz, tx, ty, tz) {
      yaw.position.set(px, py, pz);
      const dx = tx - px, dy = ty - py, dz = tz - pz;
      yaw.rotation.y = Math.atan2(-dx, -dz); pitch.rotation.x = Math.atan2(dy, Math.hypot(dx, dz));
    }
    function lensTo(f) { if (camera.fov !== f) { camera.fov = f; camera.updateProjectionMatrix(); } }
    /* (v24.2, L5-4: a phone's frame is a third of a desktop's width, so a close shot that holds the three on a desktop holds
       ONE of them there; on a phone such a shot slides along the three instead, each in its turn — where along them by
       u, 0 → 1, eased) */
    const zAlong = u => ALTAR_Z[0] + (ALTAR_Z[2] - ALTAR_Z[0]) * smooth(cl01(u));
    const lerp3 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
    function candles(t) {                      // the night set's flames, flickering on the film's clock
      for (const f of nightSet.flames) {
        const fl = 1 + 0.12 * Math.sin(t * 13 + f.k) + 0.07 * Math.sin(t * 29 + f.k * 3);
        f.fl.scale.set(0.028 * fl, 0.06 * (2 - fl) * 0.95, 1); f.fl.position.y = f.y + 0.002 * Math.sin(t * 17 + f.k);
        f.halo.material.opacity = 0.42 + 0.06 * Math.sin(t * 11 + f.k);
      }
      for (const s of nightSet.smoke) {
        const u = (s.t + t * 0.11) % 1;
        s.sp.position.set(s.x + Math.sin(u * 7 + s.t * 9) * 0.03 * u, s.y + u * 0.55, s.z + Math.cos(u * 5) * 0.02 * u);
        const sc = 0.06 + u * 0.22; s.sp.scale.set(sc, sc, 1); s.sp.material.opacity = 0.16 * Math.sin(Math.PI * u);
      }
    }
    /* FILM M · "Where They Came From" (§4.0b): M1 the lens drops to the three on his glass; black; M2 the hall at night, the
       three on their tray before the monk, the thread from his hands, his chant low; M3 the little one's face in the
       candlelight; black — and the counter lifts it (the kit's fade). ow5monk runs under all of it. */
    /* (MFT is at the top level since CP12) */
    const madeF = {
      T: MFT,
      begin() { worldM.visible = true; nightSet.g.visible = true; threadLay(); fLive.lit = null; fLive.shot = '';
                if (mLive.winGlow) mLive.winGlow.color.setHex(0x101622);                // the windows dark (they glowed with chapter 4's sunset)
                for (const w of mLive.shafts) if (w.mesh) w.mesh.visible = false; },
      end() { worldM.visible = false; nightSet.g.visible = false; fLive.lit = null;
              if (fLive.hands) { fLive.hands.visible = true; fLive.hands = null; }    // (chapter 4's law: nothing else gives the hands back after a film)
              if (mLive.winGlow) mLive.winGlow.color.setHex(0xffffff);
              for (const w of mLive.shafts) if (w.mesh) w.mesh.visible = true;
              if (kit) kit.daylight(null, 0); lensTo(72); },
      frame(t, api) {
        if (!worldM.visible) madeF.begin();
        if (api && api.handsRoot) { fLive.hands = api.handsRoot; api.handsRoot.visible = false; }   // his hands are not in this film
        const ss = smooth, T = nightSet.tray, F = MHALL.F;
        candles(t);
        if (t < MFT.m2) {                      // M1 · at the counter: his eyes drop to the three on the red cloth
          /* all three in the frame on THIS screen (by photograph: on a phone the first cut kept only the middle one) — the
             lens narrows only where the screen is wide, and the lens stops as far back as its width needs: 0.29 m either
             side of the middle one, at 29 degrees down onto them */
          const k = ss(cl01(t / 2.4)), zoom = camera.aspect >= 1 ? 14 : 0;
          fLight(SHOP_EVE); lensTo(72 - zoom * k);
          const hw = Math.tan((72 - zoom) * Math.PI / 360) * camera.aspect, D = Math.max(0.64, 0.29 / hw);
          const p = lerp3([S_SPAWN.x, 1.62, S_SPAWN.z], [SX + CNT.x - 0.875 * D, CNT.y + 0.10 + 0.484 * D, CNT.z - 0.02], k);
          camAt(p[0], p[1], p[2], SX + CNT.x, CNT.y + 0.12 - 0.02 * k, CNT.z);
        } else if (t < MFT.m3) {               // M2 · the hall at night: over the three's shoulders to the monk, drifting in
          fLight(TEMPLE_NIGHT); lensTo(52);
          const k = ss(cl01((t - MFT.m2) / (MFT.m3 - MFT.m2)));
          const p = lerp3([T.x - 1.35, F + 1.02, T.z + 1.05], [T.x - 0.98, F + 0.9, T.z + 0.72], k);
          /* a narrow screen turns a little toward the tray (by photograph: on a phone the three sat at its left edge); and the
             aim RISES as the lens comes in and down, so his face stays clear of the letterbox's top bar on every screen (by
             photograph: aimed lower as it came in, his eyes went under the bar by the shot's middle, on a phone and a desktop
             alike — the frame's height is the same on both) */
          const ay = F + 0.70 + 0.10 * k;
          const q = lerp3([T.x + 0.62, ay, T.z - 0.04], [T.x, ay, T.z], camera.aspect < 1 ? 0.45 : 0);   // (across only: tipped down too, it put his face out of the top)
          camAt(MX + p[0], p[1], p[2], MX + q[0], q[1], q[2]);
        } else {                               // M3 · the little one's face in the candlelight, the lens drifting nearer
          fLight(TEMPLE_NIGHT); lensTo(46);
          const k = ss(cl01((t - MFT.m3) / (MFT.b2 + 0.6 - MFT.m3)));
          const fz = T.z + 0.12, fy = T.y + 0.205;
          const p = lerp3([T.x + 0.46, fy + 0.06, fz + 0.2], [T.x + 0.33, fy + 0.03, fz + 0.12], k);
          camAt(MX + p[0], p[1], p[2], MX + T.x, fy, fz);
        }
      }
    };
    /* THE OPENING FILM (CP9, §4.0a): O1 his eyes down Golden Mile's corridor at closing time — out of the lift lobby, the
       neighbours' shutters down, every other tube out, the grocer's rolling down as he passes, one shop still lit ahead —
       and O2 through its glass: the owner at his counter, a small bundle in red cloth before him; he looks up and
       beckons; the door's bell as it opens; black. Every picture from this frame(t). End and reset put the grocer's
       shutter down and the doors shut (the reset law) */
    function grocerAt(k) {                                   // the grocer's shutter: 1 down, 0 rolled up into its box
      const g = SH.grocerShutter; if (!g) return;
      const kk = Math.max(0.001, Math.min(1, k)), H = 2.75;
      g.scale.y = kk; g.position.y = H - H * kk / 2; g.material.map.repeat.y = 2.6 * kk; g.visible = kk > 0.002;
    }
    function doorsTo(k, only) { for (const L of SH.doorLeaves) L.hinge.rotation.y = only && L.s !== only ? 0 : L.s * 1.38 * k; }
    const introF = {
      T: OFT,
      begin() { fLive.lit = null; fLive.shot = 'O'; grocerAt(0); doorsTo(0); },
      end() { grocerAt(1); doorsTo(0); cntLive.ownerLook = 0; fLive.shot = ''; lensTo(72); if (fLive.hands) { fLive.hands.visible = true; fLive.hands = null; }
              if (cntLive.owner) { cntLive.owner.talkUntil = 0; cntLive.owner.nodT = 0; cntLive.owner.bkT = 0; cntLive.owner.bkU = cntLive.owner.nodU = null; } },
      frame(t, api) {
        if (fLive.shot !== 'O') introF.begin();
        if (api && api.handsRoot) { fLive.hands = api.handsRoot; api.handsRoot.visible = false; }   // his hands are not in it
        fLight(SHOP_EVE); lensTo(72);
        const ss = smooth;
        grocerAt(t < OFT.sh0 ? 0 : ss(cl01((t - OFT.sh0) / (OFT.sh1 - OFT.sh0))));
        cntLive.ownerLook = t >= OFT.up ? 1 : 0;                 // the owner's eyes come up to the glass
        if (cntLive.owner) {                                     // and he beckons him in, his hand and a nod, by the film's clock (CP13)
          cntLive.owner.bkU = t >= OFT.beckon && t < OFT.beckon + BK_SECS ? (t - OFT.beckon) / BK_SECS : null;
          cntLive.owner.nodU = t >= OFT.beckon + 0.5 && t < OFT.beckon + 1.9 ? (t - OFT.beckon - 0.5) / 1.4 : null;
        }
        if (t < OFT.o2) {                                        // O1 · the corridor: out of the lift lobby, down toward the light
          /* (CP13, the films' second vision review: walked on at full pace to the cut, he had the owner's head behind the
             door's right jamb for its last 0.7 s on a phone. He slows to a stop 2.5 m short of the door's middle now, the
             owner in the right leaf's clear glass for the last second, and his steps go as he stops) */
          const u = cl01((t - OFT.o1) / (OFT.o2 - OFT.o1)), w = walkW(u);   // (eased from the lift, steady, eased to a stop)
          const x = -12.6 + 10.1 * w, z = 2.4 - 0.4 * w, bob = 0.011 * walkV(u) * Math.sin(w * 10.1 / 0.72 * Math.PI);
          /* to the grocer's, rolling down on his right as he comes up to it and passes (by photograph, CP9: rolled at 8.4 it
             came down a few metres behind him, and the glance found the kitchen's shutter, already down). CP13, by photograph
             again: a FIXED turn of 0.95 put the corridor's column (x −7, z 3.2) dead in the middle of a phone's frame at
             7.0 s, the shutter a sliver at its edge — his eyes go to the shutter's middle wherever he is, which keeps the
             column 35–44° off to the right; and round to the one lit front ahead from 7.8, his eyes on its middle as he
             comes up to it (from 10.8 a phone looked at the blank wall at the corridor's end for three seconds) */
          const glance = ss(cl01((t - 4.8) / 0.8)) * (1 - ss(cl01((t - 6.6) / 0.9)));
          const left = ss(cl01((t - 7.8) / 2.2));
          const toShut = Math.atan2(MALL.z1 - z, -8 - x), toShop = Math.min(0.95, Math.atan2(z, 0 - x));   // (from his heading, +x: right is +, left is +)
          yaw.position.set(SX + x, 1.62 + bob, z);
          yaw.rotation.y = -Math.PI / 2 - toShut * glance + toShop * left; pitch.rotation.x = -0.05 - 0.04 * left;
        } else if (t < OFT.door) {                                // O2 · his glass: the owner, the bundle; he looks up, beckons
          /* (CP13, by photograph: from x 1.2–1.4 the line to the bundle crossed the glass where its gold name is, and HOUSE
             lay across the bundle; from 2.35–2.55 it crosses the clear pane past the name's end, x 2.5 — and the second
             review: there the pane's mullion at x 2.6 stood down the left third of a phone's frame for four seconds. From
             x 3.1–2.95 it is 22° off his eyes, outside a phone's frame) */
          const k = ss(cl01((t - OFT.o2) / (OFT.door - OFT.o2)));
          const p = lerp3([3.1, 1.62, 1.8], [2.95, 1.6, 1.45], k);
          camAt(SX + p[0], p[1], p[2], SX + OWN.x - 0.4, 1.32 + 0.1 * k, OWN.z + 0.1);
        } else {                                                  // to the door: he walks to it, its bell, both leaves open; in; to the owner
          /* (CP13, by photograph: the push followed the shop's middle to the altar at the back, and the owner who had just
             beckoned him left the frame. Then the second review: his eyes held on the owner all along the glass put the
             gold name across his face — 暹 on it at 20.0 on a phone, the name across his waist at 20.5 — and the shut
             leaf's pull hung by the lens as he went in. His eyes go where he walks now, along the glass to the door's
             middle and in through it as both leaves swing out to his sides (their edges never come nearer x 0 than they
             start, 0.4 m off the lens at the closest); and to the owner once he is in the doorway, where no glass stands
             between them) */
          const k = ss(cl01((t - OFT.door) / (OFT.open - OFT.door))), push = ss(cl01((t - OFT.open - 0.3) / 1.0));
          const p = lerp3(lerp3([2.95, 1.6, 1.45], [0.0, 1.62, 1.0], k), [0.0, 1.62, -0.45], push);
          const a = ss(cl01((t - OFT.door) / 0.8)), b = ss(cl01((t - OFT.open - 0.65) / 0.8));
          const T = lerp3(lerp3([OWN.x - 0.4, 1.42, OWN.z + 0.1], [p[0] * 0.6, 1.35, -2.2], a), [OWN.x - 0.2, 1.5, OWN.z], b);
          camAt(SX + p[0], p[1], p[2], SX + T[0], T[1], T[2]);
          doorsTo(ss(cl01((t - OFT.open) / 0.8)));               // both leaves open out toward him, one to either side
        }
      }
    };
    /* THE HOME FILM (CP9, §4.0c), in his room: every picture from this frame(t). The room is set by the film's own clock —
       the three, the box and the card, the drinks, the sticks, the bag, the receipts and the calendar's page — and end()
       hands it to PLAY I exactly as a Continue at 22:50 finds it (careResume then sets the offerings) */
    const homeLive = { on: false, cals: null };
    function homeKids(n) { kidLive.forEach((L, i) => { if (L.altar) L.altar.visible = i < n; }); }
    function homeReceipts(n) { roomLive.receipts.forEach((r, i) => { r.visible = i < n; }); }
    function homeCal(i) {                                    // his October, day by day: the 4th … the 24th crossed through
      const cal = roomLive.calendar; if (!cal) return;
      if (!cal.userData.map0) cal.userData.map0 = cal.material.map;
      if (!homeLive.cals) homeLive.cals = [4, 8, 12, 16, 20, 24].map(d => tex(makeCalendarT(THREE, cnv, d)));
      const want = i < 0 ? cal.userData.map0 : homeLive.cals[Math.min(homeLive.cals.length - 1, i)];
      if (cal.material.map !== want) { cal.material.map = want; cal.material.needsUpdate = true; }
    }
    function homeDoor(k) { if (roomLive.door) roomLive.door.rotation.y = -1.1 * k; }    // (it opens INTO the room; at −1.1 its edge clears the altar's end)
    const homeF = {
      T: HFT,
      begin() {
        homeLive.on = true; fLive.lit = null; fLive.shot = 'H'; endLive.looked = '';
        for (let i = 0; i < 3; i++) { bottleShow(i, false); stickShow(i, false); stubShow(i, false); }
        if (roomLive.box) roomLive.box.visible = false; if (roomLive.card) roomLive.card.visible = false;
        careLive.boxOpen = careLive.boxOpenTo = 0; careLive.drumRate = 0;
        homeKids(0); homeReceipts(1); homeCal(0); cityOut(1);
        if (careLive.deskBag) careLive.deskBag.visible = true;
        if (careLive.drinksBag) careLive.drinksBag.visible = false;
      },
      end() {
        homeLive.on = false; fLive.shot = '';
        if (homeLive.clk !== '22:50') { homeLive.clk = '22:50'; roomClock('22:50'); }
        homeKids(3); homeReceipts(roomLive.receipts.length); homeCal(-1); homeDoor(0);
        if (roomLive.box) roomLive.box.visible = true; if (roomLive.card) roomLive.card.visible = true;
        careLive.boxOpen = careLive.boxOpenTo = 0; careLive.drumRate = 1;
        careLive.bottles.forEach(B => { if (B && B.liq) B.liq.scale.y = 1; });
        /* (CP13: stubShow, not stickShow — H3 leaves the sticks as burnt stubs, and play's first stick was shown as one) */
        for (let i = 0; i < 3; i++) { bottleShow(i, false); stubShow(i, false); }
        if (careLive.deskBag) careLive.deskBag.visible = false;
        if (careLive.drinksBag) { careLive.drinksBag.visible = true; careLive.drinksBag.position.y = DESK.top + 0.018; }   // (on the desk, where H3 set it down)
        lensTo(72); if (fLive.hands) { fLive.hands.visible = true; fLive.hands = null; }
      },
      frame(t, api) {
        if (fLive.shot !== 'H') homeF.begin();
        if (api && api.handsRoot) { fLive.hands = api.handsRoot; api.handsRoot.visible = false; }   // no hands: the things move by themselves (Chad's ruling)
        const ss = smooth, T = HFT;
        lensTo(72);
        /* his bedside clock: the first evening's hour, then tonight's (CP13, the films' vision review: it read 22:50 under
           a dusk sky) */
        { const clk = t < T.h2 ? '19:24' : '22:50'; if (homeLive.clk !== clk) { homeLive.clk = clk; roomClock(clk); } }
        if (t < T.ins) {                                     // H1 · the door at the first dusk; in; the lamp; the bag on the desk
          endLook(t < T.lamp ? 'DUSK' : 'DUSKLIT');
          homeDoor(ss(cl01((t - T.open) / 1.0)));
          /* through the middle of the doorway, then on past the mat to where the bag can be seen over the chair's back (CP9,
             by photograph: from just inside the door the chair's back stood in front of it, and the open door beside the lens) */
          const k1 = ss(cl01((t - (T.open + 0.5)) / 1.3)), k2 = ss(cl01((t - (T.open + 1.5)) / 1.3)), turn = ss(cl01((t - (T.lamp - 0.2)) / 1.3));
          const p = lerp3(lerp3([DOOR.x, 1.62, 3.0], [R_ARRIVE.x, 1.62, R_ARRIVE.z], k1), [0.0, 1.66, 0.35], k2);
          const q = lerp3([DOOR.x, 1.5, 0.0], [DESK_AT.bag[0], DESK.top + 0.12, DESK_AT.bag[1]], turn);
          camAt(p[0], p[1], p[2], q[0], q[1], q[2]);
        } else if (t < T.h2) {                               // the four inserts, close
          endLook('DUSKLIT');
          homeDoor(0);
          if (t < T.ins2) {                                   // the three set out on the new altar, one by one, the dusk city behind
            homeKids(t > T.ins + 0.5 ? (t > T.ins + 1.1 ? (t > T.ins + 1.7 ? 3 : 2) : 1) : 0);
            lensTo(50);
            const k = ss(cl01((t - T.ins) / (T.ins2 - T.ins)));
            /* a wide screen holds all three; a narrow one sees one at a time, so it goes to each as it is set down (CP9, by
               photograph: centred on the middle one, a phone never saw the first or the last arrive) */
            const zt = camera.aspect >= 1 ? ALTAR_Z[1]
              : ALTAR_Z[0] + (ALTAR_Z[1] - ALTAR_Z[0]) * ss(cl01((t - (T.ins + 0.85)) / 0.45)) + (ALTAR_Z[2] - ALTAR_Z[1]) * ss(cl01((t - (T.ins + 1.45)) / 0.45));
            camAt(MAT.x + 0.05 - 0.08 * k, 1.02, (camera.aspect >= 1 ? MAT.z : zt) - 0.05, RISER.x, ALTAR.top + ALTAR.riser + 0.12, zt);
          } else if (t < T.ins3) {                            // the music box at the altar's end, the owner's card against it
            homeKids(3);
            if (roomLive.box) roomLive.box.visible = t > T.ins2 + 0.3;
            if (roomLive.card) roomLive.card.visible = t > T.ins2 + 1.0;
            lensTo(44);
            const bz = (RISER.z1 + ALTAR.z1) / 2;
            camAt(1.30 - 0.50, ALTAR.top + 0.28, bz - 0.24, 1.28, ALTAR.top + 0.05, bz);
          } else if (t < T.ins4) {                            // the first red drink, set down before the red one
            homeKids(3); if (roomLive.box) roomLive.box.visible = true; if (roomLive.card) roomLive.card.visible = true;
            bottleShow(0, t > T.ins3 + 0.4);
            lensTo(46);
            camAt(ROW.back - 0.42, ALTAR.top + 0.26, ALTAR_Z[0] + 0.14, ROW.back, ALTAR.top + 0.09, ALTAR_Z[0] + 0.06);
          } else {                                            // and the first stick lit in its sand
            bottleShow(0, true);
            if (t > T.ins4 + 0.6) stickFresh(0); else stickShow(0, false);
            lensTo(48);
            /* (CP13, the films' second vision review: aimed at the bowl, the frame's top edge stood 0.1 m over the tip and
               the smoke's thin start was all of it that showed — "no smoke". Aimed up the stick, the tip and 0.14 m of its
               thread are in it, the bowl still at its foot) */
            camAt(ROW.mid - 0.46, ALTAR.top + 0.34, ALTAR_Z[0] - 0.05, ROW.mid, ALTAR.top + 0.13, ALTAR_Z[0]);
          }
        } else if (t < T.h3) {                               // H2 · THE WEEKS
          homeKids(3); if (roomLive.box) roomLive.box.visible = true; if (roomLive.card) roomLive.card.visible = true;
          if (careLive.deskBag) careLive.deskBag.visible = false;
          if (careLive.drinksBag) careLive.drinksBag.visible = false;
          homeLive.weeksT = wallNow();                        // (CP13: the beds hold one quiet morning through it — mixBeds)
          const u = t - T.h2, days = ['DUSK', 'NIGHT', 'DEEP', 'DAWN', 'MORNING', 'AFTERNOON'], step = 0.38;
          const dd = days[Math.floor(u / step) % days.length], night = dd === 'NIGHT' || dd === 'DEEP';
          endLook(t < T.h2c ? dd : 'AFTERNOON');
          cityOut(dd === 'NIGHT' || dd === 'DUSK' ? 1 : dd === 'DEEP' ? 0 : -1);
          careLive.boxOpen = careLive.boxOpenTo = night && t < T.h2c ? 1 : 0;   // (its lid open every night, shut every morning)
          const day = Math.floor(u / (step * days.length));
          for (let i = 0; i < 3; i++) {                       // fresh each evening, drunk down by the afternoon
            bottleShow(i, true); const B = careLive.bottles[i];
            if (B && B.liq) B.liq.scale.y = 1 - 0.5 * ((Math.floor(u / step) % days.length) / (days.length - 1));
            if (dd === 'DUSK' || dd === 'NIGHT') stickFresh(i); else { stickShow(i, false); stubShow(i, true); }
          }
          homeReceipts(1 + Math.min(roomLive.receipts.length - 1, Math.floor(day * 0.9)));
          homeCal(Math.floor(day * 0.8));
          if (t < T.h2b || t >= T.h2c) {                     // the altar from the bed, locked off; then the three alone in the afternoon
            /* (CP13, the films' second vision review: on a phone the altar was a thin band across the middle — the three
               60–100 px tall, the window and the block over them filling half the frame. A narrow screen draws in on
               them: at 48° the three's 0.85 m fill nine tenths of its width) */
            lensTo(camera.aspect < 1 ? (t >= T.h2c ? 46 : 48) : (t >= T.h2c ? 56 : 66));
            camAt(BED.x1 - 0.3, 1.05, 0.45, RISER.x, ALTAR.top + 0.32, (ALTAR_Z[0] + ALTAR_Z[2]) / 2);
          } else {                                            // the desk wall: his calendar crossed day by day, a receipt each Buddha Day
            /* (a wide screen holds both; a narrow one sees the calendar, then the board) */
            const narrow = camera.aspect < 1, half = t < (T.h2b + T.h2c) / 2, ax = narrow ? (half ? 0.85 : -0.5) : 0.15;
            lensTo(58);
            camAt(ax, 1.42, narrow ? -0.95 : -0.62, ax, 1.44, -1.79);
          }
        } else {                                             // H3 · TONIGHT, 22:50: the door in the dark, the bag, the lamp
          homeKids(3); if (roomLive.box) roomLive.box.visible = true; if (roomLive.card) roomLive.card.visible = true;
          careLive.boxOpen = careLive.boxOpenTo = 0;
          for (let i = 0; i < 3; i++) { bottleShow(i, false); stickShow(i, false); stubShow(i, true); }
          homeReceipts(roomLive.receipts.length); homeCal(-1);
          endLook(t < T.lamp2 ? 'DEEP' : 'NIGHT'); cityOut(0);
          if (careLive.deskBag) careLive.deskBag.visible = false;
          /* the provision shop's bag, SET DOWN (CP13, the films' second vision review: it popped onto the desk at 29.4 with
             the lens nearly still on it). A close insert as it lands — lowered into the frame from its top, the hand that
             holds it above the frame, the way H1's inserts set the three down — and back to his eyes */
          const bagIn = t >= T.bag - 0.2 && t < T.bag + 0.9;
          if (careLive.drinksBag) {
            const d = careLive.drinksBag; d.visible = t > T.bag - 0.2;
            d.position.y = DESK.top + 0.018 + 0.32 * (1 - ss(cl01((t - (T.bag - 0.15)) / 0.4)));
          }
          /* (CP13, the films lens: it shut from 30.0 with the lens still at R_ARRIVE, 0.67 m from the hinge — inside the
             leaf's 0.82 m sweep — so the door passed through the camera. It shuts behind him once he has come 0.4 of the
             way to the three, a metre from the hinge, the lens turned to them) */
          homeDoor(ss(cl01((t - (T.h3 + 0.4)) / 1.0)) * (1 - ss(cl01((t - (T.lamp2 + 1.2)) / 0.8))));
          /* and, the lamp on, he comes in front of them: their faces in its light, as play will find them (CP9, by photograph:
             from the door they were three dark shapes seen from the side). A narrow screen cannot hold the three's 0.7 m and
             still see a face (CP13, the films' second vision review: the red one and the little one cut by its edges, their
             faces 40 px, the window 60 % of it): it comes lower and nearer and goes along them, the red one to the little
             one, in the lamp's light */
          const k = ss(cl01((t - (T.h3 + 0.9)) / 1.6)), turn = ss(cl01((t - (T.lamp2 + 0.2)) / 1.6)), come = ss(cl01((t - (T.lamp2 + 0.4)) / 1.8));
          if (bagIn) {
            lensTo(50);
            camAt(DESK_AT.bag[0] + 0.06, DESK.top + 0.5, DESK_AT.bag[1] + 0.66, DESK_AT.bag[0], DESK.top + 0.08, DESK_AT.bag[1]);   // (0.8 m: on a phone it fills two thirds of the frame)
          } else if (camera.aspect < 1) {
            const along = ss(cl01((t - (T.lamp2 + 1.2)) / 2.4)), zt = ALTAR_Z[0] + (ALTAR_Z[2] - ALTAR_Z[0]) * along;
            lensTo(72 - 12 * come);
            const p = lerp3(lerp3([DOOR.x, 1.62, 3.0], [R_ARRIVE.x, 1.62, R_ARRIVE.z], k), [0.5, 1.3, ALTAR_Z[0] + (zt - ALTAR_Z[0]) * 0.6], come);
            const q = lerp3([DESK_AT.bag[0], DESK.top + 0.1, DESK_AT.bag[1]], [RISER.x, ALTAR.top + ALTAR.riser + 0.13, zt], turn);
            camAt(p[0], p[1], p[2], q[0], q[1], q[2]);
          } else {
            const p = lerp3(lerp3([DOOR.x, 1.62, 3.0], [R_ARRIVE.x, 1.62, R_ARRIVE.z], k), [0.45, 1.62, 0.55], come);
            const q = lerp3([DESK_AT.bag[0], DESK.top + 0.1, DESK_AT.bag[1]], [RISER.x, ALTAR.top + ALTAR.riser + 0.14, ALTAR_Z[1]], turn);
            camAt(p[0], p[1], p[2], q[0], q[1], q[2]);
          }
        }
      }
    };
    /* FILM K · "The Card" (§4.0b): K1 his eyes go down to the card on the glass; K2 a macro down it, line by line (k5pen:
       the last stroke of his pen heard as the lens arrives — CP9 brings the pen into the frame); K3 the lens lifts to his
       face — he looks straight at the player — over ow5never, ow5wrong and ow5promise. */
    /* (KFT is at the top level since CP12) */
    const _kv = new THREE.Vector3();
    const cardF = {
      T: KFT,
      begin() { fLive.lit = null; fLive.shot = 'K'; cntLive.ownerLook = 1; },
      end() { cntLive.ownerLook = 0; fLive.shot = ''; lensTo(72); if (fLive.hands) { fLive.hands.visible = true; fLive.hands = null; } kidForce(1, null);
              if (cntLive.owner) cntLive.owner.talkUntil = 0; },   // (CP13: a skip runs all three of his talks at once — 20 s of silent gesture)
      frame(t, api) {
        if (fLive.shot !== 'K') cardF.begin();
        /* the shy one stands just past the card, only his feet at the frame's top edge while it is read: his far level
           there, not the 451k near one his 0.24–0.30 m would choose (CP13, the geometry lens) */
        kidForce(1, t < KFT.k3 ? 1 : null);
        if (api && api.handsRoot) { fLive.hands = api.handsRoot; api.handsRoot.visible = false; }   // nor in this one: the card and his face
        fLight(SHOP_EVE);
        const ss = smooth, cx = SX + CNT_CARD.x, cz = CNT_CARD.z, cy = CNT.y + 0.001;
        /* a narrow screen stands a fifth further off, so the card's whole width is in it (by photograph: on a phone the
           first letter of each line was cut by the frame's left edge) */
        const back = camera.aspect < 1 ? 1.2 : 1;
        if (t < KFT.k2) {                       // K1 · down to the card
          const k = ss(cl01(t / KFT.k2));
          lensTo(72 - 28 * k);
          const p = lerp3([S_SPAWN.x, 1.62, S_SPAWN.z], [cx + 0.036 - 0.1 * back, cy + 0.15 * back, cz], k);   // (K2's first frame)
          camAt(p[0], p[1], p[2], cx + 0.036 * k, cy, cz);
        } else if (t < KFT.k3) {               // K2 · read down it (its top is +x, away from him): from the first line to the last
          lensTo(44);
          const k = ss(cl01((t - KFT.k2) / (KFT.k3 - 0.6 - KFT.k2)));
          const along = 0.036 - 0.072 * k;      // from 3.6 cm up the card to 3.6 cm down it
          camAt(cx + along - 0.1 * back, cy + 0.15 * back, cz, cx + along, cy, cz);
        } else {                               // K3 · up to his face, and he looks straight at him
          lensTo(40);
          const k = ss(cl01((t - KFT.k3) / 2.0)), push = ss(cl01((t - KFT.k3) / (KFT.end - KFT.k3)));
          /* (CP13, the counter's vision review: aimed at his head BONE, the lens followed every sway of his talking take —
             on a phone his face drifted from the left third to past the middle; it holds on where his face is at rest, a
             quarter of his head's sway, so he moves in the frame and the frame does not chase him) */
          const P = cntLive.owner && cntLive.owner.head ? cntLive.owner.head.getWorldPosition(_kv) : _kv.set(SX + OWN.x, 1.55, OWN.z);
          P.set(SX + OWN.x + (P.x - SX - OWN.x) * 0.25, 1.53 + (P.y - 1.53) * 0.25, OWN.z + (P.z - OWN.z) * 0.25);
          const p = lerp3([cx - 0.136, cy + 0.15, cz], [SX + 2.36 + 0.28 * push, 1.6, OWN.z - 0.05], k);
          camAt(p[0], p[1], p[2], P.x, P.y - 0.02, P.z);
        }
      }
    };


    /* ------------------------------------------------ THE THREE (CP1's scans)
       ONE parse each; a LOD per place — the near level only for a figure close to the lens (KID_LOD), the far one
       wearing the near one's material over the same vertices. Each file is baked base-down on y 0, height 1.0,
       facing +z (CP1), so a place is a position, a turn and a height in metres. */
    const kidLive = KIDS.map(K => ({ K, altar: null, counter: null, ready: false }));
    const KID_SHADOW_GEO = new THREE.PlaneGeometry(1, 1);
    let kidShadowMat = null;
    /* hold the counter copy of child `i` on one level (null hands it back to the distance) */
    function kidForce(i, lvl) {
      const g = kidLive[i] && kidLive[i].counter, lod = g && g.children[0]; if (!lod || !lod.isLOD) return;
      if (lvl == null) { lod.autoUpdate = true; return; }
      lod.autoUpdate = false;
      const n = Math.min(lvl, lod.levels.length - 1); lod.levels.forEach((L, j) => { L.object.visible = j === n; });
    }
    /* (CP13, the geometry lens: `noNear` — a copy no shot ever holds in macro: the temple tray's red and shy ones, beside
       the little one's close-up; `distAt` — the counter's, 1.10–1.17 m from him, where the far level was 361k triangles
       for three figures 140 px tall: the lightest from 0.9, the lean's close look still finds the far and near ones) */
    function kidLOD(src, h, o = {}) {
      const lod = new THREE.LOD();
      const far = src.far.clone();
      const wf = new THREE.Group(); wf.add(far);
      if (o.noNear) lod.addLevel(wf, 0);
      else { const wn = new THREE.Group(); wn.add(src.near.clone()); lod.addLevel(wn, 0); lod.addLevel(wf, KID_LOD); }
      if (src.dist) { const wd = new THREE.Group(); wd.add(src.dist.clone()); lod.addLevel(wd, o.distAt || KID_DIST); }
      const g = new THREE.Group(); g.add(lod); g.scale.setScalar(h);
      /* a soft contact shadow under the base (CP13, the counter's vision review: the three cast no shadow — castShadow is
         off on their scans — and in film K's macro the shy one's base hung over the cloth like a disc); 1 mm under the
         base, whatever it stands on */
      if (src.foot) {
        if (!kidShadowMat) { const t = makeSoftDot('rgba(0,0,0,0.6)', 'rgba(0,0,0,0)'); madeTex.push(t); kidShadowMat = B({ map: t, transparent: true, depthWrite: false }); }
        const sh = new THREE.Mesh(KID_SHADOW_GEO, kidShadowMat); sh.rotation.x = -Math.PI / 2; sh.position.y = -0.001 / h;
        sh.scale.setScalar(src.foot); sh.renderOrder = 1; g.add(sh);
      }
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
        /* the base's reach, in the file's own units (base-down, height 1.0): its shadow a little wider than the widest of it */
        const fb = new THREE.Box3().setFromObject(far), fs = fb.getSize(new THREE.Vector3());
        const src = { near, far, dist, foot: Math.max(fs.x, fs.z) * 1.15 };
        L.farSrc = far;                                        // (his double is a copy of this level, CP7)
        // on the riser under the window, facing into the room (−x): a model at ry θ faces (sin θ, 0, cos θ)
        L.altar = kidLOD(src, K.h);
        L.altar.position.set(RISER.x, KID_BASE, ALTAR_Z[K.slot]);
        L.altar.rotation.y = -Math.PI / 2;
        worldR.add(L.altar);
        // and on the red cloth on the owner's glass, facing him (−x as well) — SET DOWN there as the owner opens the cloth
        L.counter = kidLOD(src, K.h, { distAt: 0.9 });
        L.counter.position.set(CNT.x, CNT.y + 0.003, CNT_Z[K.slot]);
        L.counter.rotation.y = -Math.PI / 2;
        worldS.add(L.counter);
        // and on the tray before the monk in World M's hall (film M), facing him (+x)
        L.night = kidLOD(src, K.h, K.slot < 2 ? { noNear: true } : {});
        L.night.position.set(nightSet.tray.x, nightSet.tray.y, nightSet.tray.z + (K.slot - 1) * 0.12);
        L.night.rotation.y = Math.PI / 2;
        nightSet.g.add(L.night);
        const st = cntLive.kidSet[K.slot] || (cntLive.kidSet[K.slot] = mkSet(null));
        st.obj = L.counter; st.y0 = L.counter.position.y; st.s0 = K.h; setDraw(st);
        L.ready = true;
        /* and its double, built now and hung hidden in the room (CP13, the geometry lens: built on the possession's first
           frame, its two shader programs compiled on screen as it rose) — the entry curtain's warm compiles it */
        doubleOf(kidLive.indexOf(L));
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
       stops the chapter */
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
      const o = p === 'counter' ? counterObjective() : p === 'care' ? careObjective() : OPEN_I[p] !== undefined ? openObjective()
              : { sit: W.objSit, after: null, decide: null }[p];
      kit.objective(o || null);
    }

    /* ------------------------------------------------------- between worlds
       Under the kit's black: the player put down in the next world, its light, a warm of everything (kit.warm — the
       curtain's own), then the black lifts (chapter 4's toWorld) */
    function placeIn(w) {
      if (w === 'R') {
        yaw.position.x = R_ARRIVE.x; yaw.position.z = R_ARRIVE.z;
        roomArriveLook();                                      // onto the altar, the jug to the little one (CP6)
      } else {
        yaw.position.x = S_SPAWN.x; yaw.position.z = S_SPAWN.z;
        /* (CP13, the films' vision review: on a phone the resting hand covered half the bundle on the glass, the thing to
           press; a phone's look a little lower lifts it above the fingertips, the owner's face still under the stats) */
        yaw.rotation.y = DATA.spawn.rot; pitch.rotation.x = camera.aspect < 1 ? -0.22 : -0.12;
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
        /* (a Continue into the decision opens it once he is on the floor by the bed and the black has lifted: opened on the
           boot's frame, his eye was still at standing height — a stopped clock eases no pose — and a phone saw the window
           over the panel, the three below it; by photograph) */
        if (phase === 'decide') after(resumed ? 1.3 : 0.3, () => { if (alive && phase === 'decide' && !decOpen) openDecision(); });
        else if (phase === 'after') afterBeat(true);           // the aftermath's lines are its beat: said again (CP7)
      });
    }

    /* ------------------------------------------------------- the counter (CP5, §4.0b)
       The black lifts on the counter: the owner across the glass, the red bundle between them, the old masters behind
       him. He stands there rooted and free to look (kit.root). FIVE ORDERS, each answered by a press and never by a
       timer (v21.9's pressAim — the reticle on the thing, or a tap on it); every line on the queue, so a press is held
       while one is said (quiet()) and a line is never dropped (the v9.5 queue). What a Continue must not lose is a
       RECEIPT in the phase string (v7.3) — `counter:yin,m.red,m.shy,m.little,give,card,vow`:
         yin       the first look, his question, the owner's answer and film M — written as the film ENDS (CP13 R8:
                   kit.film saves first, so a save made inside it lands BEFORE it and the film is seen whole again)
         m.<kid>   each child met — written when the owner's line about him ENDS, so a Continue never loses a story
         give      the owner's words over the three, and his own
         card      film K (written as it ends, as yin)
         vow       the promise, once the three are in the bag
       A resume lands on the order still open with the finished beats in place, and says nothing twice. */
    const CNT_ORDER = ['yin', 'm.red', 'm.shy', 'm.little', 'give', 'card', 'vow'];
    const cntDone = new Set();
    let cntBusy = false;                       // between a press and its next order: the lines, the films, the touch, the wrap
    const metN = () => KIDS.filter(K => cntDone.has('m.' + K.key)).length;
    const cntTag = () => CNT_ORDER.filter(r => cntDone.has(r)).join(',');
    function cntSave() { if (kit) kit.setPhase(cntDone.size ? 'counter:' + cntTag() : 'counter'); }
    function cntStep() {                       // the order still open
      if (!cntDone.has('yin')) return cntLive.opened ? 'look' : 'hello';
      if (metN() < 3) return 'meet';
      if (!cntDone.has('give')) return 'give';
      if (!cntDone.has('card')) return 'card';
      if (!cntDone.has('vow')) return 'vow';
      return 'bag';
    }
    function counterObjective() {
      if (cntBusy) return null;
      const s = cntStep();
      return s === 'look' ? W.objLookBundle : s === 'meet' ? W.objMeet.replace('{n}', String(metN()))
           : s === 'card' ? W.objCard : s === 'vow' ? W.objPromise : s === 'bag' ? W.objTake : null;
    }
    const cntOk = () => phase === 'counter' && !cntBusy && quiet();
    const atCnt = (o) => [SX + o.x, o.z];      // a counter place in the world's own x

    /* HELLO, and the bundle opened: the three set out on its cloth one by one */
    function counterHello() {
      if (cntLive.helloOn) return;
      cntLive.helloOn = true;
      queueGap(0.9);
      queueLine('ow5hello', () => { personTalk(cntLive.owner, SECS.ow5hello); after(Math.max(1.6, SECS.ow5hello * 0.6), openBundle); });
    }
    function openBundle(now) {
      if (cntLive.opened) return;
      cntLive.opened = true;
      setShow(cntLive.bundleSet, false, now); setShow(cntLive.clothSet, true, now);
      if (now) { for (const S of cntLive.kidSet) setShow(S, true, true); return; }
      sfxAt('k5bundle', 0.55, ...atCnt(CNT));
      viewTo(clothYaw(), CNT_LOOK, 1.3);                // his look comes down onto the three (by photograph: on a phone the first was cut)
      KIDS.forEach((K, i) => after(0.55 + 0.45 * i, () => { setShow(cntLive.kidSet[i], true); sfxAt('k5figset', 0.42, SX + CNT.x, CNT_Z[i]); }));
      after(0.55 + 0.45 * 2 + 0.8, () => { if (phase === 'counter') objectiveFor('counter'); });   // ORDER 1, once all three are out
    }
    /* ORDER 1 · what he has brought out: the misconception, its answer, and film M (where they came from) */
    function lookBundle() {
      if (cntStep() !== 'look' || !cntOk()) return false;
      cntBusy = true; if (kit) kit.objective(null);                    // OBJECTIVE COMPLETE: he has looked
      queueGap(0.5);
      queueLine('z5yinq');
      queueGap(0.4);
      queueLine('ow5yin', () => personTalk(cntLive.owner, SECS.ow5yin));
      queueGap(0.6);
      queueFn(() => cntFilm('made', 'yin'));
      return true;
    }
    /* a film from the counter (M, K): its receipt is WRITTEN when it ends (CP13, the save lens: written first, the save
       kit.film makes as it starts already had it, and a phone closed during the film never showed its words — the owner's
       answer to the misconception, or his card — on a Continue); the film hands its black to the kit's fade and the
       counter lifts it, his look where it was (restoreWorld) */
    function cntFilm(key, receipt) {
      cntDone.add(receipt);
      const done = () => {
        if (!alive) return;
        cntSave();
        cntLive.ownerLook = 0;
        if (kit) kit.fade(0, 1.2);
        if (key === 'card') viewTo(ownerYaw(), promisePitch(), 1.2);   // the promise is HIS: the look comes up to him as the black lifts
        /* the order and its marks wait for the picture (chapter 4's v22.3 law; by photograph, on a phone: the next order and
           three "!" stood on the film's black while it lifted) */
        after(0.9, () => { cntBusy = false; objectiveFor('counter'); });
      };
      /* `noSkip` only until the chapter has been completed once (S41: the purpose's own words must be seen the first time) */
      const firstTime = !(ctx.sealedBefore && ctx.sealedBefore('e3c5'));
      if (!kit || !kit.film || !kit.film(key, { noSkip: firstTime, onDone: done })) done();
    }
    /* ORDER 2 · meet each of them, in any order: the owner's story of each — the shy one's with the old auntie's music
       box, wound and set by them, its lullaby playing on to the end of the counter */
    function meetKid(K) {
      if (cntStep() !== 'meet' || cntDone.has('m.' + K.key) || !cntOk()) return false;
      cntDone.add('m.' + K.key);
      const last = metN() === 3;
      if (last) { cntBusy = true; if (kit) kit.objective(null); }       // the third: OBJECTIVE COMPLETE (e3c3's browse)
      else objectiveFor('counter');                                     // the count is a beat each time
      const name = 'ow5' + K.key;
      queueGap(0.35);
      queueLine(name, () => {
        personTalk(cntLive.owner, SECS[name]);
        if (K.key === 'shy') after(Math.max(1.2, SECS[name] * 0.72), () => windBox(false));   // "...with her music box."
      });
      queueFn(cntSave);                                                 // the receipt when his line ENDS
      if (last) queueFn(giveBeat);
      return true;
    }
    function windBox(now) {
      setShow(cntLive.boxSet, true, now);
      if (now) { cntLive.boxOpen = cntLive.boxOpenTo = 1; startLull(); return; }
      sfxAt('k5set', 0.42, ...atCnt(CNT_BOX));
      after(0.5, () => { sfxAt('k5wind', 0.55, ...atCnt(CNT_BOX)); cntLive.windT = 1.3; });
      after(1.9, () => { cntLive.boxOpenTo = 1; startLull(); });
    }
    function startLull() { cntLive.lull = true; sfxAt('k5lullaby', 0.5, ...atCnt(CNT_BOX)); }
    function boxTick(wdt) {
      const B = cntLive.box; if (!B) return;
      cntLive.boxOpen += (cntLive.boxOpenTo - cntLive.boxOpen) * (1 - Math.exp(-wdt / 0.35));
      if (Math.abs(cntLive.boxOpenTo - cntLive.boxOpen) < 0.002) cntLive.boxOpen = cntLive.boxOpenTo;
      B.lid.rotation.x = -1.9 * smooth(cl01(cntLive.boxOpen));
      if (cntLive.windT > 0) { cntLive.windT -= wdt; B.key.rotation.x += wdt * 9; }
      if (cntLive.lull) B.drum.rotation.x += wdt * 0.9;
    }
    /* 3/3 · what he is giving them — and THE TOUCH: the lens leans over the glass to the little one until his face and his
       long hair fill the frame; the bells on his ring tinkle once, very faintly; the lens goes back (CP13: no hand — see
       leanSolve). Then the card, set down on the glass past the red one */
    function giveBeat() {
      cntBusy = true;
      queueGap(0.7);
      queueLine('ow5give', () => { personTalk(cntLive.owner, SECS.ow5give); after(Math.max(2.0, SECS.ow5give * 0.48), leanIn); });
      queueGap(0.3);
      queueLine('z5children');
      queueGap(0.9);
      queueFn(() => {
        setShow(cntLive.cardSet, true); setShow(cntLive.penSet, true); sfxAt('k5slip', 0.45, ...atCnt(CNT_CARD));
        cntDone.add('give'); cntSave();
        after(0.7, () => { cntBusy = false; objectiveFor('counter'); });       // ORDER 3
      });
    }
    /* the touch's timing: the lean in, the moment the touch would land (the bells), the hold, the lean back (CP13: the
       reach pose that the lens was once solved for is gone — leanSolve below) */
    const LEAN = { secs: 1.0, reach: 0.9, hold: 1.4, back: 0.8 };
    const _lv = new THREE.Vector3();
    /* THE TOUCH, without a hand (CP13, the counter's vision review: the reach pose's hand read, on a phone, as a fist of
       flesh filling the lower half of the frame over the little one, and on a desktop as a bare tube whose knuckles hid
       his face — no fingers to be seen resting on anything; Chad's ruling on the bottle: "if you know its impossible for
       you to get the fingers right, then dont do that animation"). The lens leans in over the glass until his face and
       his long hair fill the middle of the frame, from 0.40 m back at the standing eye; the bells on his ring tinkle once,
       very faintly, at the moment the touch would have landed; and it leans back */
    function leanSolve() {
      const H = _lv.set(SX + CNT.x, CNT.y + KIDS[2].h * 0.72, CNT_Z[2]), ey = yaw.position.y, back = 0.40;
      return { x: H.x - back, z: H.z, ry: -Math.PI / 2, px: Math.atan2(H.y - ey, back) };
    }
    function leanIn() {
      if (cntLive.lean || !kit) return;
      cntLive.lean = { t0: dayClock.t, from: { x: yaw.position.x, z: yaw.position.z, ry: yaw.rotation.y, px: pitch.rotation.x }, to: leanSolve(), backAt: Infinity };
      const L = LEAN;
      after(L.secs + L.reach, () => sfxAt('k5bellsfaint', 0.32, SX + CNT.x, CNT_Z[2]));
      after(L.secs + L.reach + L.hold + L.back * 0.5, () => { if (cntLive.lean) cntLive.lean.backAt = dayClock.t - cntLive.lean.t0; });
    }
    /* where his look goes when the cloth opens: onto the middle of the three, low enough that all three stand above his
       hand and high enough that the owner's face stays under the HUD (by photograph, on a phone: at the arrival's pitch
       the three sat behind the hand, and at its yaw the first of them was cut by the frame's left edge) */
    const CNT_LOOK = -0.29;
    /* and where it goes for the promise: up onto the owner, his "!" (over his head) a little under the objective box on any
       screen — 0.4 of the half-height above the middle — and the three still in the frame under him (by photograph, on a
       phone: after film K the look stayed down on the three, and the order "Give him your promise" had no mark in the
       frame, its "!" behind the round buttons) */
    function ownerYaw() { const dx = SX + OWN.x - yaw.position.x, dz = OWN.z - yaw.position.z; return Math.atan2(-dx, -dz); }
    function promisePitch() {
      const d = Math.hypot(SX + OWN.x - yaw.position.x, OWN.z - yaw.position.z), up = Math.atan2(1.78 - yaw.position.y, d);
      return up - Math.atan(0.4 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    }
    function clothYaw() { const dx = SX + CNT.x - yaw.position.x, dz = CNT_Z[1] - yaw.position.z; return Math.atan2(-dx, -dz); }
    function viewTo(ry, px, secs) {
      cntLive.view = { t0: dayClock.t, secs, from: { ry: yaw.rotation.y, px: pitch.rotation.x }, to: { ry, px } };
    }
    function viewTick() {
      const V = cntLive.view; if (!V) return;
      const k = smooth(cl01((dayClock.t - V.t0) / V.secs)), dy = Math.atan2(Math.sin(V.to.ry - V.from.ry), Math.cos(V.to.ry - V.from.ry));
      yaw.rotation.y = V.from.ry + dy * k; pitch.rotation.x = V.from.px + (V.to.px - V.from.px) * k;
      if (k >= 1) cntLive.view = null;
    }
    function leanTick() {
      const L = cntLive.lean; if (!L) return;
      const t = dayClock.t - L.t0, k = smooth(cl01(t / LEAN.secs)) * (1 - smooth(cl01((t - L.backAt) / LEAN.secs)));
      const F = L.from, T = L.to, dy = Math.atan2(Math.sin(T.ry - F.ry), Math.cos(T.ry - F.ry));
      yaw.position.x = F.x + (T.x - F.x) * k; yaw.position.z = F.z + (T.z - F.z) * k;
      yaw.rotation.y = F.ry + dy * k; pitch.rotation.x = F.px + (T.px - F.px) * k;
      if (t > L.backAt + LEAN.secs) cntLive.lean = null;
    }
    /* ORDER 3 · his card: film K reads it, line by line, and then his face — what he asks of the one who takes them */
    function readCard() {
      if (cntStep() !== 'card' || !cntOk()) return false;
      cntBusy = true; if (kit) kit.objective(null);
      queueGap(0.3);
      queueFn(() => cntFilm('card', 'card'));
      return true;
    }
    /* ORDER 4 · the promise: a single press (the hold is the yield's, §4.3 — the hand that promises must never feel like the
       hand that opens the door), his hands joined in añjali, his words; the owner's face softens; then he wraps them in
       their cloth and packs them, the box and the card into a paper bag — a beat in the dark (the kit's own fade), and the
       bag on the glass when the light comes back */
    function promise() {
      if (cntStep() !== 'vow' || !cntOk()) return false;
      cntBusy = true; if (kit) kit.objective(null);
      if (kit && kit.pray) kit.pray(true, { secs: 0.9, y: -0.33 });   // (the episode's own height: at the default the clasp hid the three and the owner on a phone)
      queueGap(1.0);
      queueLine('z5promise');
      queueGap(0.5);
      queueFn(() => { if (kit && kit.pray) kit.pray(false, { secs: 0.8 }); });
      queueGap(0.4);
      queueLine('ow5careful', () => personTalk(cntLive.owner, SECS.ow5careful));
      queueGap(0.5);
      queueFn(wrapUp);
      return true;
    }
    function wrapUp() {
      if (kit) kit.fade(1, 0.45);
      after(0.55, () => { packed(); sfxAt('k5bag', 0.55, ...atCnt(CNT)); });
      after(1.7, () => {
        if (kit) kit.fade(0, 0.8);
        cntDone.add('vow'); cntSave();
        after(0.5, () => { cntBusy = false; objectiveFor('counter'); });     // ORDER 5
      });
    }
    function packed() {                       // the three, the cloth, the box and the card in the bag; his pen stays on the wood
      for (const S of [cntLive.bundleSet, cntLive.clothSet, cntLive.boxSet, cntLive.cardSet, ...cntLive.kidSet]) setShow(S, false, true);
      setShow(cntLive.bagSet, true, true);
      cntLive.lull = false; cntLive.boxOpen = cntLive.boxOpenTo = 0;
    }
    /* ORDER 5 · take them home: the bag in his hand, and the home film (CP9). The phase moves on BEFORE the film — the home
       film is not a phase, so a Continue after the bag lands at 22:50 in his room (§10.1) */
    const BAG_HELD = { pos: [0.02, -0.2, -0.16], rot: [0, 0, 0] };   // (in the right arm's frame; its palm at (0.012, -0.052, -0.148) — by photograph)
    function takeHome() {
      if (cntStep() !== 'bag' || !cntOk()) return false;
      cntBusy = true; if (kit) kit.objective(null);
      setShow(cntLive.bagSet, false, true);
      if (kit && kit.hold && cntLive.bagHeld) kit.hold(cntLive.bagHeld, { pos: BAG_HELD.pos, rot: BAG_HELD.rot });
      after(1.0, () => {
        if (kit) kit.setPhase('care');
        const done = () => { if (alive) { careResume(''); toWorld('R', false, 'care'); } };
        if (!kit || !kit.film || !kit.film('home', { onDone: done })) done();
      });
      return true;
    }
    /* a Continue (or a first arrival): the counter exactly as its receipts say — the things on the glass, the box out and
       playing once the shy one is met — and the beat still owed, never one already said */
    function counterResume(tagStr) {
      cntDone.clear();
      for (const r of String(tagStr || '').split(',')) if (CNT_ORDER.includes(r)) cntDone.add(r);
      cntBusy = false; cntLive.helloOn = false; cntLive.lean = null; cntLive.view = null; cntLive.ownerLook = 0;
      cntLive.opened = cntDone.has('yin');
      const packedUp = cntDone.has('vow');
      setShow(cntLive.bundleSet, !cntLive.opened, true);
      setShow(cntLive.clothSet, cntLive.opened && !packedUp, true);
      for (const S of cntLive.kidSet) setShow(S, cntLive.opened && !packedUp, true);
      const boxOut = cntDone.has('m.shy') && !packedUp;
      setShow(cntLive.boxSet, boxOut, true);
      cntLive.boxOpen = cntLive.boxOpenTo = boxOut ? 1 : 0; cntLive.lull = false; cntLive.windT = 0;
      if (boxOut) startLull();
      setShow(cntLive.cardSet, cntDone.has('give') && !packedUp, true);
      setShow(cntLive.penSet, cntDone.has('give'), true);
      setShow(cntLive.bagSet, packedUp, true);
      phase = 'counter';
      /* (CP13, the save lens: a Continue put him where the save was taken — mid-lean over the glass during the touch —
         and rooted him there; the counter is played from one mark) */
      yaw.position.x = S_SPAWN.x; yaw.position.z = S_SPAWN.z;
      if (kit) kit.root(true);
      cntSave();
      const s = cntStep();
      /* a Continue looks where the play-through looks at that order: down onto the three once the cloth is open, up to the
         owner for the promise and the bag (by photograph, on a phone: at the spawn's own look the three sat behind his hand
         and the card's "!" in the frame's corner) */
      if (cntLive.opened && !packedUp && s !== 'vow') { yaw.rotation.y = clothYaw(); pitch.rotation.x = CNT_LOOK; }
      if (s === 'vow' || s === 'bag') { yaw.rotation.y = ownerYaw(); pitch.rotation.x = promisePitch(); }
      if (s === 'hello') { objectiveFor('counter'); counterHello(); return; }
      if (s === 'give') { cntBusy = true; objectiveFor('counter'); giveBeat(); return; }
      objectiveFor('counter');
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
       Anchors on the thing itself (the v7.5 law); the counter's are PRESSED, never timed — the reticle on the thing and a
       press, or a tap on the thing (`hits`) or its mark (v21.9's pressAim; e3c4's tapBox) */
    const _tapRay = new THREE.Raycaster(), _tapPtr = new THREE.Vector2(), _tapHit = new THREE.Vector3();
    const tapBox = (x0, y0, z0, x1, y1, z1) => {
      const bb = new THREE.Box3(new THREE.Vector3(x0, y0, z0), new THREE.Vector3(x1, y1, z1));
      return (cx, cy) => {
        camera.updateMatrixWorld();
        _tapPtr.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
        _tapRay.setFromCamera(_tapPtr, camera);
        return !!_tapRay.ray.intersectBox(bb, _tapHit);
      };
    };
    const cntAt = (x, z) => ({ x: SX + x, z });
    const hotspots = [
      { id: 'bundle', pos: { ...cntAt(CNT.x, CNT.z), y: CNT.y + 0.1 }, radius: 2.6, aim: 0.22, pressAim: true, markY: 0.22, prompt: W.hotBundle,
        hits: tapBox(SX + CNT.x - CNT.w / 2, CNT.y - 0.01, CNT.z - CNT.l / 2, SX + CNT.x + CNT.w / 2, CNT.y + 0.3, CNT.z + CNT.l / 2),
        enabled: () => cntStep() === 'look' && cntOk(), onInteract() { return lookBundle(); } },
      ...KIDS.map((K, i) => ({
        id: 'kid_' + K.key, pos: { ...cntAt(CNT.x, CNT_Z[i]), y: CNT.y + K.h * 0.55 }, radius: 2.6, aim: 0.14, pressAim: true,   // (v24.2, L1-5: its "!" sat 0.14–0.17 rad off a 0.09 cone; overlapping cones go to the nearer)
        markY: K.h * 0.45 + 0.03, prompt: W['hot' + K.key[0].toUpperCase() + K.key.slice(1)],   // (v24.2, L5-3: 4 cm lower — at +0.07 each "!" stood 0.142–0.164 off its own 0.14 cone; at +0.03, 0.105–0.128, the next one's 0.198 away)
        hits: tapBox(SX + CNT.x - 0.08, CNT.y - 0.01, CNT_Z[i] - 0.085, SX + CNT.x + 0.08, CNT.y + K.h + 0.03, CNT_Z[i] + 0.085),
        enabled: () => cntStep() === 'meet' && !cntDone.has('m.' + K.key) && cntOk(), onInteract() { return meetKid(K); } })),
      { id: 'card', pos: { ...cntAt(CNT_CARD.x, CNT_CARD.z), y: CNT.y + 0.01 }, radius: 2.6, aim: 0.2, pressAim: true, markY: 0.05, prompt: W.hotCard,   // (CP13: at 0.16 its "!" stood on the shy one's chest behind it)
        hits: tapBox(SX + CNT_CARD.x - 0.07, CNT.y - 0.01, CNT_CARD.z - 0.06, SX + CNT_CARD.x + 0.07, CNT.y + 0.05, CNT_CARD.z + 0.06),
        enabled: () => cntStep() === 'card' && cntOk(), onInteract() { return readCard(); } },
      /* (the promise and the bag answer a tap on their mark as the others here do — `pressAim`: by photograph, on a phone a
         tap on the bag's "!", which floats over its handles, pressed nothing) */
      { id: 'promise', pos: { ...cntAt(OWN.x, OWN.z), y: 1.38 }, radius: 3.0, aim: 0.3, pressAim: true, markY: 0.4, prompt: W.hotPromise,
        hits: tapBox(SX + OWN.x - 0.3, 0.95, OWN.z - 0.35, SX + OWN.x + 0.3, 1.8, OWN.z + 0.35),
        enabled: () => cntStep() === 'vow' && cntOk(), onInteract() { return promise(); } },
      { id: 'bag', pos: { ...cntAt(CNT.x, CNT.z), y: CNT.y + 0.16 }, radius: 2.6, aim: 0.25, pressAim: true, markY: 0.24, prompt: W.hotBag,
        hits: tapBox(SX + CNT.x - 0.1, CNT.y - 0.01, CNT.z - 0.15, SX + CNT.x + 0.1, CNT.y + 0.42, CNT.z + 0.15),
        enabled: () => cntStep() === 'bag' && cntOk(), onInteract() { return takeHome(); } },
      /* PLAY I (CP6): their water (the jug), their drinks (the bag on the desk), each drink's place, their incense (the
         packet), each one's sand; all `pressAim` with `hits`, as the counter's are */
      { id: 'jug', pos: { x: ROW.mid, y: ALTAR.top + 0.08, z: ALTAR.z0 + 0.08 }, radius: 1.8, aim: 0.25, pressAim: true, markY: 0.16, prompt: W.hotJug,
        hits: tapBox(ROW.mid - 0.06, ALTAR.top, ALTAR.z0 + 0.02, ROW.mid + 0.06, ALTAR.top + 0.14, ALTAR.z0 + 0.14),
        enabled: () => careStep() === 'water' && careOk(), onInteract() { return pourWater(); } },
      /* (v24.2, L1-2: reaches measured from where each order leaves him — the bag 2.07 m after the first drink and 2.33
         after the second, the packet 2.44 after the third, the shy one's place 1.61 and the little one's 1.86 from
         STAND_UP, his sand 1.72: their "!" stood in his view out of reach, and a tap on it did nothing. The press
         seats or kneels him itself, so a longer reach costs nothing) */
      { id: 'drinks', pos: { x: DESK_AT.bag[0], y: DESK.top + 0.15, z: DESK_AT.bag[1] }, radius: 2.8, aim: 0.3, pressAim: true, markY: 0.22, prompt: W.hotDrinks,
        hits: tapBox(DESK_AT.bag[0] - 0.12, DESK.top, DESK_AT.bag[1] - 0.12, DESK_AT.bag[0] + 0.12, DESK.top + 0.36, DESK_AT.bag[1] + 0.12),
        enabled: () => careStep() === 'drink' && careOk(), onInteract() { return atDeskDrink(); } },
      ...KIDS.map((K, i) => ({
        /* (its mark over his head, CP13 — the play's vision review: at the runner's height it stood between two of them from
           where he stands, over the next one's shoulder; and raised over the drink's place, 0.13 m before him and 0.06 to
           his left, it still stood a third of the way to the next one on a phone. Anchored on the child himself now — the
           tap box stays on the drink's place) */
        id: 'place_' + K.key, pos: { x: RISER.x, y: ALTAR.top + 0.1, z: ALTAR_Z[i] }, radius: 2.0, aim: 0.32, pressAim: true, markY: K.h + 0.1, prompt: W.hotPlace,   // (v24.2, L1-2/L1-5: in reach, and its "!" over his head inside its own cone)
        hits: tapBox(ROW.back - 0.06, ALTAR.top, ALTAR_Z[i] + 0.0, ROW.back + 0.06, ALTAR.top + 0.2, ALTAR_Z[i] + 0.12),
        enabled: () => careStep() === 'carry' && careLive.carry === i && careOk(), onInteract() { return placeDrink(i); } })),
      { id: 'packet', pos: { x: DESK_AT.packet[0], y: DESK.top + 0.08, z: DESK_AT.packet[1] }, radius: 2.8, aim: 0.3, pressAim: true, markY: 0.16, prompt: W.hotPacket,
        hits: tapBox(DESK_AT.packet[0] - 0.13, DESK.top, DESK_AT.packet[1] - 0.08, DESK_AT.packet[0] + 0.13, DESK.top + 0.08, DESK_AT.packet[1] + 0.08),
        enabled: () => careStep() === 'light' && careOk(), onInteract() { return atDeskIncense(); } },
      ...KIDS.map((K, i) => ({
        id: 'sand_' + K.key, pos: { x: ROW.mid, y: ALTAR.top + 0.06, z: ALTAR_Z[i] }, radius: 2.0, aim: 0.16, pressAim: true, markY: 0.12, prompt: W.hotBowl,
        hits: tapBox(ROW.mid - 0.05, ALTAR.top, ALTAR_Z[i] - 0.05, ROW.mid + 0.05, ALTAR.top + 0.08, ALTAR_Z[i] + 0.05),
        enabled: () => careStep() === 'stick' && !careDone.has('i.' + K.key) && careOk(), onInteract() { return giveStick(i); } })),
      /* (a tap on the rug or on its mark sits him, as a press does — by photograph, a phone's tap on the "!" pressed
         nothing — and stepping onto it does too: careFrame) */
      ...KIDS.map((K, i) => ({
        id: 'open_' + K.key, pos: { x: RISER.x, y: ALTAR.top + ALTAR.riser + K.h * 0.6, z: ALTAR_Z[i] }, radius: 1.8, aim: 0.22, pressAim: true, markY: 0.14, prompt: W.hotOpen,
        hits: tapBox(RISER.x - 0.08, ALTAR.top + ALTAR.riser, ALTAR_Z[i] - 0.08, RISER.x + 0.08, ALTAR.top + ALTAR.riser + K.h, ALTAR_Z[i] + 0.08),
        enabled: () => OPEN_I[phase] === i && seated && openOk(), onInteract() { return openPress(i); } })),
      /* (v24.2, L5-3: its aim point was at the SEATED eye, 0.9 — looking down at the rug from standing was 0.36–0.39 off a
         0.35 cone, and the look the game hands him by the desk 0.495 off; on the rug now, the "!" where it always was, 0.6) */
      { id: 'mat', pos: { x: MAT.x, y: 0.35, z: MAT.z }, radius: 1.6, aim: 0.35, pressAim: true, prompt: W.hotMat, markY: 0.25,
        hits: tapBox(MAT.x - 0.32, 0, MAT.z - 0.5, MAT.x + 0.32, 0.06, MAT.z + 0.5),
        enabled: () => (phase === 'sit' || phase === 'open3') && !seated && quiet() && !openLive.busy && !careBusy,   // (v24.2, L1-6: as its handler asks)
        onInteract() { return phase === 'open3' ? sitAgain() : sitWithThem(); } }
    ];
    for (const h of hotspots) { const en = h.enabled; h.enabled = () => !wDark && (!en || en()); }   // none under an arrival's black

    /* ====================================================== THE FOUR ENDINGS (CP8, §4.8) AND THE EPILOGUE (§4.9)
       One controller, chapter 4's shape (v22.0 CP9): each scene holds its cues and one track, and every picture is this
       controller's frame at the scene's clock — so a skip, a seek and a slow phone land on the picture the clock says.
       Each ending begins where the decision found him (on the floor against the bed's frame, 02:47) and is told in a
       world of its own: A in his BODY (the nights, the dawns, a giggle that is not his, an altar nobody is looking after
       any more), B on the SCREENS (the forum, the replies, a stranger's message), C on the ALTAR (piling higher every
       night), D at DAWN (the room, chapter 4's temple, the room in the first sun, the years). Then the EPILOGUE, the same
       in every ending: the owner's counter as first seen, and the case file's last words over the black. The card lies
       over the counter, the black clearing under it as the engine's cineEnd clears every scene's (keep.view, endFade):
       the three as first set down, under the last card of the episode. Every prop an ending touches is put back by endReset (the
       reset law: a value a scene set is cleared by whatever ends that scene). No hand holds anything small in close-up:
       a thing an ending needs in his hands stands in front of the lens with the hand below the frame (the bottle's
       lesson, Chad: "if you know its impossible for you to get the fingers right, then dont do that animation"). */
    const endLive = { on: '', shot: '', looked: '', props: null };
    /* (BYBED is CP7's, beside BYDESK: { x, z, eye }) */
    /* a bloom from the edges of sight (V2), on the lens: the colour of the child it belongs to, 0..1 */
    function bloomSet(k, hex) {
      const m = lens.bloom; if (!(k > 0.003)) { m.visible = false; return; }
      const { d, h, w } = lensWH(); lens.g.visible = true; lens.g.position.set(0, 0, -d);
      if (hex !== undefined) m.material.color.setHex(hex);
      lensPut(m, 0, 0, 2.3 * w, 2.3 * h, k);
    }
    /* the props the endings add to the room (built once, hidden; each ending shows what it uses) */
    function endProps() {
      if (endLive.props) return endLive.props;
      const R = worldR, P = {};
      // A · his own note on the top carton's printed face; the dust that settles on the stack and the altar
      P.sticky = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.07), M({ map: tex(makeStickyT(THREE, cnv)), roughness: 0.9 }));
      P.sticky.visible = false;
      if (roomLive.cartonTop) { P.sticky.position.set(0.03, 0.006, 0.0805); P.sticky.rotation.z = -0.06; roomLive.cartonTop.add(P.sticky); }
      const mDust = B({ map: tex(makeDustT(THREE, cnv)), transparent: true, opacity: 0.85, depthWrite: false, toneMapped: true });
      P.dust = [];
      const dustAt = (w, d, x, y, z, parent = R) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mDust); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.visible = false; m.renderOrder = 3; parent.add(m); P.dust.push(m); return m; };
      if (roomLive.cartonTop) dustAt(0.19, 0.15, 0, 0.0652, 0, roomLive.cartonTop);
      dustAt(0.2, 0.9, ROW.front + 0.065, ALTAR.top + 0.0055, (ALTAR_Z[0] + ALTAR_Z[2]) / 2);   // (over the runner, whose top is A.top + 0.004, and inside the altar's front edge)
      dustAt(0.12, 0.5, RISER.x, ALTAR.top + 0.006 + ALTAR.riser + 0.0035, (ALTAR_Z[0] + ALTAR_Z[2]) / 2);   // (v24.2, L5-12: on the gilt — it hung 9.75 cm over the altar's top through the shy one's bottle)
      // A · the grey that settles in the little one's hair (a few motes, flat on the crown)
      P.hairDust = new THREE.Mesh(new THREE.CircleGeometry(0.018, 16), mDust); P.hairDust.rotation.x = -Math.PI / 2;
      P.hairDust.position.set(RISER.x, KID_BASE + KIDS[2].h + 0.001, ALTAR_Z[2]); P.hairDust.visible = false; R.add(P.hairDust);   // (v24.2, L5-12: ON the crown — 1 cm under it, inside the hair)
      // A · the dust over the card where it fell (beyond the runner's end, on the bare top)
      P.cardDust = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.12), mDust); P.cardDust.rotation.x = -Math.PI / 2;
      P.cardDust.position.set(1.185, ALTAR.top + 0.0024, 1.03); P.cardDust.renderOrder = 3; P.cardDust.visible = false; R.add(P.cardDust);
      // A · the drinks gone flat (never changed): a dull brown where the red was; the straws bleached
      P.mFlat = M({ color: 0x5a3a2a, roughness: 0.6, transparent: true, opacity: 0.85 });
      P.strawCol = mStraw.color.getHex();
      return (endLive.props = P);
    }
    /* A's dashboard (nothing shipped, every order late) and C's calendar page (the month crossed through, its last Buddha
       Day unticked): each the room's own plane with its map swapped, put back by endReset */
    function dashLate(on) {
      const mon = roomLive.monitor, P = endProps(); if (!mon) return;
      if (!mon.userData.map0) mon.userData.map0 = mon.material.map;
      if (on && !P.dashL) P.dashL = tex(makeDashboardT(THREE, cnv, true));
      const want = on ? P.dashL : mon.userData.map0;
      if (mon.material.map !== want) { mon.material.map = want; mon.material.needsUpdate = true; }
    }
    function calSwap(page) {                                   // null: his own page; 'A': November, not a day crossed, its two Buddha Days gone by unticked (§4.8 A); 'C': October crossed through, the 29th unticked
      const cal = roomLive.calendar, P = endProps(); if (!cal) return;
      if (!cal.userData.map0) cal.userData.map0 = cal.material.map;
      if (page === 'A' && !P.calA) P.calA = tex(makeCalendarT(THREE, cnv, 0, 'NOVEMBER', [5, 12, 20, 28], [], 6, 30));
      if (page === 'C' && !P.calC) P.calC = tex(makeCalendarT(THREE, cnv, 31, 'OCTOBER', [7, 14, 21, 29], [7, 14, 21]));
      const want = page === 'A' ? P.calA : page === 'C' ? P.calC : cal.userData.map0;
      if (cal.material.map !== want) { cal.material.map = want; cal.material.needsUpdate = true; }
    }
    /* the desk chair turns with him while he sits in it (CP8: a swivel chair; turned to the altar, its own back filled the
       lower right of a phone's frame — the pick probe named it, 0.3 m from the lens) */
    function chairHome() { const ch = roomLive.chair; if (ch) { ch.position.x = -0.32; ch.rotation.y = 0.25; } }   // (where build() stands it)
    function chairShoved() { const ch = roomLive.chair; if (ch) { ch.position.x = -0.77; ch.rotation.y = 0.75; } }   // (v24.2, L5-6: where the shy one's film leaves it)
    function chairTurn() {
      const ch = roomLive.chair; if (!ch) return;
      const on = Math.hypot(yaw.position.x - CHAIR.x, yaw.position.z - CHAIR.z) < 0.16 && yaw.position.y > 0.85;
      ch.rotation.y = on ? 0.25 + yaw.rotation.y : 0.25;
    }
    /* the ending's light at once (a look a shot asks for, set once per shot change) */
    function endLook(name) { if (endLive.looked !== name) { endLive.looked = name; fLive.lit = null; look(name, 0); } }   // (CP13: the room's look replaces a film light, so fLight's memory of it goes)
    function endBegin(k, api) {
      const P = endProps();
      endLive.on = k; endLive.shot = ''; endLive.looked = '';
      peekSet(0); lensOff(); roomLive.smokeLean = 0; roomLive.smokeStill = 0; careLive.drumRate = 1;
      if (kit && kit.objective) kit.objective(null);
      if (api && api.handPose) api.handPose(null, 0);
      void P;
    }
    function endFrame(k, t, api) {
      if (endLive.on !== k) endBegin(k, api);
      const T = END[k];
      if (t >= T.epi) { epiFrame(t - T.epi, api); return; }
      if (k === 'A') endA(t, api); else if (k === 'B') endB(t, api); else if (k === 'C') endC(t, api); else endD(t, api);
      chairTurn();
    }
    /* everything an ending touched, as build() left it */
    function endReset() {
      const P = endLive.props;
      if (P) {
        P.sticky.visible = false; for (const d of P.dust) d.visible = false; P.hairDust.visible = false;
        mStraw.color.setHex(P.strawCol);
      }
      careLive.bottles.forEach(B2 => { if (B2 && B2.liq) { if (B2.liqMat0) B2.liq.material = B2.liqMat0; B2.liq.scale.y = 1; } });   // (v24.2, L2-4: and ending A's levels)
      if (roomLive.card && roomLive.card.userData.r0) { roomLive.card.position.copy(roomLive.card.userData.p0); roomLive.card.rotation.copy(roomLive.card.userData.r0); }
      if (roomLive.boxKey) roomLive.boxKey.rotation.x = 0;
      if (camera.fov !== 72) { camera.fov = 72; camera.updateProjectionMatrix(); }
      lensOff(); bloomSet(0);
      if (worldM) worldM.visible = false;
      roomLive.smokeLean = 0; roomLive.smokeStill = 0; careLive.drumRate = 1; careLive.catchK = 0;
      // B's: the laptop's own picture back, the phone off his eyes
      if (P && P.page) laptopPage(false);
      if (phone.g.parent === camera) phoneBeforeEyes(false);
      // C's: the night's extra things away, every carton back on the stack, the glints out
      if (P && P.c) { const C = P.c; [...C.bottles, ...C.wishes, ...C.toys, ...C.slips].forEach(o => { o.visible = false; }); C.pinCrushed.visible = false; }
      (roomLive.cartons || []).forEach(b2 => { b2.visible = true; });
      for (const G of careLive.glints) { G.t = 0; G.sp.visible = false; }
      // D's: the years' receipts and boards, the calendar's page, the envelope, the pen; the desk's packet put away; the temple's
      if (P && P.d) { const D = P.d; D.more.forEach(m => { m.visible = false; }); if (D.board2) D.board2.visible = false; if (D.calPage) D.calPage.visible = false;
                      D.env.visible = false; D.envUnder.visible = false; D.pen.visible = false; }
      if (careLive.incDesk) deskIncense(false);
      if (endLive.dTray) endLive.dTray.visible = false;
      if (endLive.dLights) endLive.dLights.forEach(L => { L.m.visible = L.h.visible = false; });
      dMonkRest();                                            // (the temple monk's head back at his rest: film M sees him too)
      dashLate(false); calSwap(null);
      if (P && P.cardDust) P.cardDust.visible = false;
      chairHome();
      if (roomLive.tapeDisp) roomLive.tapeDisp.position.y = 0.29;
      Object.assign(endLive, { on: '', shot: '', looked: '' });
    }

    /* ---------------------------------------------------------------- A · STAY WITH THEM (worst, §4.8 A)
       Pity without a boundary: the little one asked him to stay, and he says yes. Told in his BODY: the nights, the dawns,
       the work and his mother let go, a giggle out of his own mouth that is not his, and an altar nobody is looking after
       any more — and the promise he made at the counter stopping with him (§2.5 4). Never a scare: the children are as
       they always were; what has changed is him. */
    const A_SHOTS = ['a0', 'a1', 'a2', 'a2b', 'a3', 'a4', 'a5', 'a6', 'a6b', 'a6c', 'a6d', 'a7'];
    function aShot(t) {
      const T = END.A;
      return t < T.a1 ? 'a0' : t < T.a2 ? 'a1' : t < T.a2b ? 'a2' : t < T.a3 ? 'a2b' : t < T.a4 ? 'a3' : t < T.a5 ? 'a4'
           : t < T.a6 ? 'a5' : t < T.a6b ? 'a6' : t < T.a6c ? 'a6b' : t < T.a6d ? 'a6c' : t < T.a7 ? 'a6d' : 'a7';
    }
    /* the room as each shot needs it — SET, every field, so a skip or a slow phone lands on the state its clock says */
    function aState(sh) {
      const P = endProps(), n = A_SHOTS.indexOf(sh);
      const later = n >= A_SHOTS.indexOf('a3'), days = n >= A_SHOTS.indexOf('a5');
      // the sticks: grey stubs from the night (a0), a fresh one lit in the little one's sand on night two (a1), and
      // after that nobody lights them (the stubs stay where they burnt out)
      for (let i = 0; i < 3; i++) stubShow(i, true);
      if (sh === 'a1') stickFresh(2);
      // the drinks: the red one's half drunk on night one, empty by the dawn; by the days, never changed, gone flat
      careLive.bottles.forEach((B2, i) => {
        if (!B2 || !B2.liq) return;
        if (!B2.liqMat0) B2.liqMat0 = B2.liq.material;
        B2.liq.scale.y = i === 0 ? (n <= 1 ? 0.5 : 0.04) : (days ? 0.6 : 1);
        B2.liq.material = days ? P.mFlat : B2.liqMat0;
      });
      mStraw.color.setHex(days ? 0xc8bcb4 : P.strawCol);
      cartonDown(n <= 1);                                         // (the carton the red one swiped, back on the stack by the morning)
      P.sticky.visible = later;
      P.dust.forEach(d => { d.visible = later; }); P.hairDust.visible = days;
      phone.g.visible = sh === 'a0' || sh === 'a4';                // (where it slid, and where it lies on night four)
      careLive.boxOpen = careLive.boxOpenTo = 0; careLive.drumRate = sh === 'a7' ? 0 : 1;   // (a7's frame lifts the lid and turns the drum itself)
      if (P.cardDust) P.cardDust.visible = days;
      dashLate(days);                                             // (the dashboard: nothing shipped since)
      calSwap(days ? 'A' : null);                                 // (and the calendar: not a day crossed, the Buddha Days gone by)
      const cd = roomLive.card;
      if (cd) {
        if (!cd.userData.r0) { cd.userData.p0 = cd.position.clone(); cd.userData.r0 = cd.rotation.clone(); }
        /* fallen flat before the box, FACE UP under the dust (CP8: laid face down it showed only its back, which a one-sided
           plane does not draw — by photograph the shot had no card in it); its top away from the lens, so it reads */
        if (days) { cd.position.set(1.185, ALTAR.top + 0.0012, 1.03); cd.rotation.set(-Math.PI / 2, -2.0, 0, 'YXZ'); }
        else { cd.position.copy(cd.userData.p0); cd.rotation.copy(cd.userData.r0); }
      }
      roomClock(n <= 1 ? '02:47' : n <= 3 ? '05:58' : sh === 'a4' ? '04:31' : '15:20');
      endLook(n <= 1 ? (sh === 'a1' ? 'BLUE' : 'DEEP') : n <= 4 ? 'DAWN' : sh === 'a4' ? 'DEEP' : 'DRAINED');
      if (sh === 'a4') endLook('DEEP');
      cityOut(n <= 1 || sh === 'a4' ? 0 : -1);                   // (the city's windows dark at the hours he keeps)
    }
    function endA(t, api) {
      const T = END.A, sh = aShot(t), ss = smooth, P = endProps();
      if (sh !== endLive.shot) { endLive.shot = sh; aState(sh); }
      /* no hands in A: the box's key turns under the lens with the hand below the frame (the bottle's lesson) */
      if (api && api.handsRoot) api.handsRoot.visible = false;
      if (api && api.handPose) api.handPose(null, 0);
      lensTo(72);
      bloomSet(0);
      if (sh === 'a0') {                                     // on the floor by the bed, his look on the little one
        camAt(BYBED.x, 0.58, BYBED.z, RISER.x, ALTAR.top + ALTAR.riser + 0.12, ALTAR_Z[2]);
      } else if (sh === 'a1') {                              // NIGHT TWO: a fresh stick in the little one's sand, and the blue
        const k = ss(cl01((t - T.a1) / 2.5));
        lensTo(48);
        camAt(ROW.mid - 0.42 + 0.06 * k, 0.94, ALTAR_Z[2] - 0.10, ROW.mid, ALTAR.top + 0.10, ALTAR_Z[2]);
        bloomSet(0.9 * ss(cl01((t - (T.a1 + 0.9)) / 0.5)) * (1 - ss(cl01((t - (T.a2 - 0.6)) / 0.6))), 0x8cbcff);
      } else if (sh === 'a2') {                              // DAWN: the clock on the bedside table, 05:58
        lensTo(44);
        camAt(-1.02, 0.70, -0.66, CLOCK_AT.x, CLOCK_AT.y, CLOCK_AT.z);
      } else if (sh === 'a2b') {                             // from the floor: the window grey-pink, the red one's bottle empty
        const k = ss(cl01((t - T.a2b) / (T.a3 - T.a2b)));
        camAt(BYBED.x, 0.58, BYBED.z, ROW.back, ALTAR.top + 0.10 + 0.22 * (1 - k), ALTAR_Z[0] + 0.1);
      } else if (sh === 'a3') {                              // the ROADEYE stack, untouched: dust, his note
        lensTo(46);
        const k = ss(cl01((t - T.a3) / 4)), C = roomLive.cartonTop;
        const cx = C ? C.position.x : 0.705, cy = C ? C.position.y : 0.195, cz = C ? C.position.z : -1.49;
        camAt(cx - 0.12 + 0.05 * k, cy + 0.26, cz + 0.55 - 0.06 * k, cx + 0.02, cy + 0.01, cz + 0.06);
      } else if (sh === 'a4') {                              // NIGHT FOUR: the amber, then 04:31 and his phone face-up, buzzing
        bloomSet(0.8 * ss(cl01((t - T.a4) / 0.4)) * (1 - ss(cl01((t - (T.a4 + 1.2)) / 0.9))), 0xffb060);
        const buzz = t < T.vm ? Math.sin(t * 60) * 0.0015 * (Math.sin(t * 7) > 0 ? 1 : 0) : 0;   // (it buzzes on the boards)
        phone.g.position.set(PHONE_FLOOR.x + buzz, 0.001, PHONE_FLOOR.z); phone.g.rotation.set(0, PHONE_FLOOR.ry, 0);
        phone.S.draw(t < T.vm ? 'missed' : t < T.dark ? 'vm' : 'dark', 0, '04:31');
        /* he leans over it to read it (CP8: from where he sits it was a smudge on a phone's screen, Ma's name unreadable):
           the lens comes over its foot and down, the screen the right way up, and narrows */
        const lean = ss(cl01((t - (T.a4 + 1.1)) / 1.6)), ux = -Math.sin(PHONE_FLOOR.ry), uz = -Math.cos(PHONE_FLOOR.ry);
        const sx = BYBED.x + 0.04, sz = BYBED.z - 0.04, ex = PHONE_FLOOR.x - ux * 0.10, ez = PHONE_FLOOR.z - uz * 0.10;
        lensTo(72 - 34 * lean);
        camAt(sx + (ex - sx) * lean, 0.60 - 0.25 * lean, sz + (ez - sz) * lean, PHONE_FLOOR.x + ux * 0.01, 0.0, PHONE_FLOOR.z + uz * 0.01);
      } else if (sh === 'a5') {                              // DAY: at the desk, drained; a giggle out of his own mouth; the shy one
        const turn = ss(cl01((t - T.turn) / 3.0)), fl = t > T.gig + 0.1 ? 0.03 * Math.exp(-(t - T.gig - 0.1) * 4) * Math.sin((t - T.gig) * 30) : 0;
        const M2 = roomLive.monitor ? roomLive.monitor.getWorldPosition(_ev5) : _ev5.set(0.1, 1.15, -1.66);
        const ty = lerp3([M2.x - 0.1, M2.y - 0.12, M2.z], [RISER.x, ALTAR.top + ALTAR.riser + 0.10, ALTAR_Z[1]], turn);
        camAt(CHAIR.x, 1.18 + fl, CHAIR.z, ty[0], ty[1], ty[2]);
      } else if (sh === 'a6') {                              // the drinks: old, flat, never changed; the straws bleached
        lensTo(44);
        /* (v24.2, L5-4: on a phone the three drinks were −2.66 and 2.32 of the frame's half-width — one drink — so there
           the lens slides along them, each in its turn; zAlong) */
        if (camera.aspect < 1) { const z = zAlong((t - T.a6 - 0.2) / 2.0); camAt(ROW.back - 0.55, 0.98, z - 0.10, ROW.back, ALTAR.top + 0.08, z + 0.06); }
        else camAt(ROW.back - 0.55, 0.98, ALTAR_Z[1] - 0.30, ROW.back, ALTAR.top + 0.08, ALTAR_Z[1]);
      } else if (sh === 'a6b') {                             // the sand cold; dust in the little one's hair
        lensTo(40);
        const k = ss(cl01((t - T.a6b) / 2.5));
        camAt(ROW.mid - 0.48, 1.02 + 0.05 * k, ALTAR_Z[2] - 0.06, RISER.x, ALTAR.top + ALTAR.riser * (0.2 + 0.8 * k) + 0.08 * k, ALTAR_Z[2]);
      } else if (sh === 'a6c') {                             // the box shut; the owner's card fallen flat in the dust before it
        lensTo(42);
        const bz = (RISER.z1 + ALTAR.z1) / 2;
        camAt(1.30 - 0.48, 0.98, bz - 0.26, 1.23, ALTAR.top + 0.02, bz);
      } else if (sh === 'a6d') {                             // the cork board's last receipt, weeks old; the calendar
        const k = ss(cl01((t - T.a6d) / 2.3));
        lensTo(56 - 18 * k);
        camAt(0.05, 1.40, -0.95, -0.42 + 1.27 * k, 1.36 + 0.12 * k, -1.79);
      } else {                                               // the key turned once; the tune running down
        /* the lid up and the key in view (CP8: by photograph the shot looked at a shut box from the side the key is not on):
           from the box's front corner, the lid lifting, the key turned once, then the drum turning slower and slower as the
           key unwinds, stopping before its phrase can end. careFrame does not turn the drum here: this shot does */
        lensTo(44);
        const bz = (RISER.z1 + ALTAR.z1) / 2, u = t - T.a7;
        camAt(1.30 - 0.44, 0.97, bz + 0.21, 1.30, ALTAR.top + 0.05, bz + 0.01);
        careLive.boxOpen = careLive.boxOpenTo = ss(cl01((u - 0.2) / 0.6));
        /* (CP13, the sound lens: the run's 12.5 s take sounds past 63 s while the drum stopped at 56.4 — the drum now turns
           slower and slower until the black at 57.9, and the take is faded with the black) */
        const w = ss(cl01((u - 0.8) / 1.0)), r = Math.max(0, Math.min(u - 1.9, 6.0)), run = 1.65 * (r - r * r / 12);   // (4.95 rad in all)
        if (roomLive.boxKey) roomLive.boxKey.rotation.x = -Math.PI * 2 * w + Math.PI * 2 * (run / 4.95);
        if (roomLive.boxDrum) roomLive.boxDrum.rotation.x = run;
      }
    }
    const _ev5 = new THREE.Vector3();
    /* a fresh stick in a sand bowl: the whole stick, its ember lit (A's night two, D's morning) */
    function stickFresh(i) {
      const sk = careLive.sticksSet[i]; if (!sk) return;
      sk.visible = true;
      const inc = sk.children[0]; if (inc) { inc.scale.y = 1; inc.position.y = 0.09; inc.material = mStickLit; }
      if (roomLive.embers[i]) { roomLive.embers[i].visible = true; roomLive.embers[i].position.y = ALTAR.top + 0.02 + 0.01 + 0.16; }
    }

    /* ---------------------------------------------------------------- THE EPILOGUE (§4.9, every ending, 30 s)
       The man looking back. It opens on THEM as the owner first set them down — World S's counter, the red cloth opened,
       the music box beside them — warm, and the lens coming slowly down onto the three; then black, and the case file's
       own last words. The counter is put back as first seen (and by reset, counterReset). */
    function epiSet() {
      setShow(cntLive.bundleSet, false, true); setShow(cntLive.clothSet, true, true);
      for (const S2 of cntLive.kidSet) setShow(S2, true, true);
      setShow(cntLive.boxSet, true, true);
      setShow(cntLive.cardSet, false, true); setShow(cntLive.penSet, false, true); setShow(cntLive.bagSet, false, true);
      if (cntLive.box) { cntLive.boxOpen = cntLive.boxOpenTo = 1; }
    }
    function epiFrame(u, api) {
      if (endLive.shot !== 'epi') {
        endLive.shot = 'epi'; endLive.looked = ''; epiSet(); fLight(SHOP_EVE); lensOff();
        /* (CP13, the films lens: a skip from B's phone shots jumps straight here, and the phone stayed on the lens under
           the card — B's own last shots put it down, a skip never runs them) */
        if (phone.g.parent === camera) phoneBeforeEyes(false);
      }
      if (api && api.handsRoot) api.handsRoot.visible = false;
      if (api && api.handPose) api.handPose(null, 0);
      /* all three in the frame on THIS screen (film M's rule): the lens as far back as the screen's width needs, 0.29 m either
         side of the middle one, coming down onto them over the shot */
      const k = smooth(cl01(u / EPI.fade0)), zoom = camera.aspect >= 1 ? 12 : 0;
      lensTo(72 - zoom);
      const hw = Math.tan((72 - zoom) * Math.PI / 360) * camera.aspect, D = Math.max(0.62, 0.31 / hw) * (1.12 - 0.12 * k);
      /* (CP8: aimed at the three from the first frame, the owner's head stood at the frame's top edge and was cut by it; the
         lens begins on him, his face whole, and comes down onto them) */
      camAt(SX + CNT.x - 0.86 * D, CNT.y + 0.14 + 0.46 * D, CNT.z - 0.02, SX + CNT.x, CNT.y + 0.11 + 0.24 * (1 - k), CNT.z);
    }

    /* ---------------------------------------------------------------- B · TELL THE WORLD (bad, §4.8 B)
       He wants to be believed, so he makes them a story. Told on the SCREENS: chapter 4's AMULET TALK on his laptop, his
       thread typed and posted; the replies on his phone by morning; the repost that turns them into the very horror the
       chapter clears; the old member's kind warning; a stranger who tried it; the thread deleted, and the reposts staying
       where they are. Nobody in it is cruel (v21.30). Every screen is drawn for a phone first: a narrow centre column on
       the laptop (the lens stands as far back as a phone's width needs to hold it), the phone upright before his eyes
       with his hand below the frame (no fingers on a phone — the bottle's lesson). */
    const B_SHOTS = ['b0', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10', 'b11', 'b12'];
    function bShot(t) {
      const T = END.B;
      return t < T.b1 ? 'b0' : t < T.b2 ? 'b1' : t < T.b3 ? 'b2' : t < T.b4 ? 'b3' : t < T.b5 ? 'b4' : t < T.b6 ? 'b5'
           : t < T.b7 ? 'b6' : t < T.b8 ? 'b7' : t < T.b9 ? 'b8' : t < T.b10 ? 'b9' : t < T.b11 ? 'b10' : t < T.b12 ? 'b11' : 'b12';
    }
    /* where the laptop's screen is and which way it faces (its hinge tips it back 0.3 rad) */
    const _bs = new THREE.Vector3(), _bn = new THREE.Vector3(), _bq = new THREE.Quaternion();
    function laptopScreen() {
      const S2 = roomLive.screen; if (!S2) return null;
      S2.updateWorldMatrix(true, false); S2.getWorldPosition(_bs); S2.getWorldQuaternion(_bq);
      _bn.set(0, 0, 1).applyQuaternion(_bq);
      return { p: _bs, n: _bn };
    }
    /* the phone before his eyes: a child of the camera, upright, its screen to the lens, its foot below the frame's edge
       (the hand that holds it is under the frame) */
    function phoneBeforeEyes(on, tilt = 0) {
      const g = phone.g;
      if (on) {
        if (g.parent !== camera) { if (g.parent) g.parent.remove(g); camera.add(g); }
        g.visible = true;
        g.position.set(0.0, -0.004, -0.152); g.rotation.set(Math.PI / 2 - 0.12 + tilt, 0, 0);   // (the screen faces the lens: its +y up the frame)
        /* (CP8: at 0.235 m its words were 9 px high on a phone, the old member's reply unreadable; at 0.152 it fills 70 % of the
           frame's height, inside the letterbox, and three quarters of a phone's width) */
      } else if (g.parent === camera) {
        camera.remove(g); worldR.add(g);
        g.position.set(PHONE_FLOOR.x, 0.001, PHONE_FLOOR.z); g.rotation.set(0, PHONE_FLOOR.ry, 0);
      }
    }
    function bState(sh) {
      const P = endProps(), n = B_SHOTS.indexOf(sh);
      // the room at 3 a.m. until the dawn; the night's evidence stays (the stubs, the bottle, the carton) until he relights
      for (let i = 0; i < 3; i++) { if (sh === 'b12') { /* the frame lights them */ } else stubShow(i, true); }
      cartonDown(n < B_SHOTS.indexOf('b5'));
      roomClock(n <= 4 ? '03:04' : '06:58');
      cityOut(n <= 4 ? 0 : -1);                                  // (the block's windows: the late few, then the morning's none)
      endLook(n <= 4 ? 'DEEP' : 'DAWN');
      // the laptop: its page while he writes (the page's own texture on the screen's plane), asleep by the dawn
      laptopPage(n >= 1 && n <= 4);
      // the phone: on the desk by the dawn, buzzing; then before his eyes
      if (n === 5) { phoneBeforeEyes(false); phone.g.visible = true; phone.g.position.set(0.04, DESK.top + 0.018, -1.27); phone.g.rotation.set(0, -0.3, 0); }   // (on the slab's surface: DESK.top is its middle)
      else if (n >= 6 && n <= 10) phoneBeforeEyes(true);
      else { phoneBeforeEyes(false); phone.g.visible = n === 0; }
      void P;
    }
    /* the laptop's own page, drawn on its screen's plane while B needs it (the map put back by endReset) */
    function laptopPage(on) {
      const S2 = roomLive.screen, P = endProps(); if (!S2) return;
      if (!P.page) { P.page = makeLaptopPage(THREE, cnv); tex(P.page.t); }
      if (!S2.userData.map0) S2.userData.map0 = S2.material.map;
      const want = on ? P.page.t : S2.userData.map0;
      if (S2.material.map !== want) { S2.material.map = want; S2.material.needsUpdate = true; }
    }
    function endB(t, api) {
      const T = END.B, sh = bShot(t), ss = smooth, P = endProps();
      if (sh !== endLive.shot) { endLive.shot = sh; bState(sh); }
      if (api && api.handsRoot) api.handsRoot.visible = false;
      if (api && api.handPose) api.handPose(null, 0);
      lensTo(72); bloomSet(0);
      if (sh === 'b0') {                                      // by the bed, his look on the three, then across to the desk
        const k = ss(cl01((t - 1.6) / 2.0));
        const L = lerp3([RISER.x, ALTAR.top + ALTAR.riser + 0.12, ALTAR_Z[1]], [-0.2, 0.86, -1.57], k);
        camAt(BYBED.x, 0.58, BYBED.z, L[0], L[1], L[2]);
      } else if (sh === 'b1' || sh === 'b2' || sh === 'b3') { // at the desk: the page, typed in, and POST
        const s2 = laptopScreen(); if (!s2) return;
        const typed = sh === 'b1' ? 0 : sh === 'b2' ? Math.floor(P.page.LEN * ss(cl01((t - T.b2) / (T.b3 - T.b2 - 1.0)))) : P.page.LEN;
        P.page.draw(sh === 'b3' ? 'posted' : 'new', typed);
        const f = sh === 'b1' ? 56 : 44;
        lensTo(f);
        /* as far back as THIS screen's width needs to hold the page's centre column (0.20 m across) */
        const hw = Math.tan(f * Math.PI / 360) * camera.aspect, d = Math.max(0.27, 0.105 / hw) * (sh === 'b1' ? 1.6 : 1.0);
        const k = sh === 'b2' ? ss(cl01((t - T.b2) / 6)) : 1;
        const D = d * (1.06 - 0.06 * k);
        camAt(s2.p.x + s2.n.x * D, s2.p.y + s2.n.y * D + 0.01, s2.p.z + s2.n.z * D, s2.p.x, s2.p.y + 0.004, s2.p.z);
      } else if (sh === 'b4') {                               // over his shoulder: the three, lit cold blue by the screen
        const k = ss(cl01((t - T.b4) / 1.4));
        const L = lerp3([-0.2, 0.86, -1.57], [RISER.x, ALTAR.top + ALTAR.riser + 0.12, ALTAR_Z[1]], k);
        camAt(CHAIR.x, 1.18, CHAIR.z, L[0], L[1], L[2]);
        bloomSet(0.35 * k, 0x6a8ad8);
      } else if (sh === 'b5') {                               // DAWN: asleep at the desk, his head coming up; the phone buzzing
        const k = ss(cl01((t - T.b5) / 2.2));
        const bz = Math.sin(t * 55) * 0.002 * (Math.sin(t * 5.3) > 0.2 ? 1 : 0);
        phone.g.position.x = 0.04 + bz + 0.004 * (t - T.b5);
        /* (CP13: its count steps 12 times a second — every new number is a repaint and an upload of a 576×1248 canvas — and
           its bar reads the lock screen's hour, not the night's 02:47) */
        P.ph = P.ph || 0; phone.S.draw('buzz', Math.min(207, Math.floor(12 + Math.floor((t - T.b5) * 12) / 12 * 40)), '06:58');
        camAt(CHAIR.x, 0.92 + 0.26 * k, CHAIR.z - 0.05 * (1 - k), 0.04, DESK.top + 0.03, -1.27);
      } else if (sh === 'b11') {                              // up from the phone at the three in the grey morning
        const k = ss(cl01((t - T.b11) / 1.6));
        camAt(CHAIR.x, 1.18, CHAIR.z, RISER.x, ALTAR.top + ALTAR.riser + 0.10 + 0.4 * (1 - k), ALTAR_Z[1]);
      } else if (sh === 'b12') {                              // kneeling, the three sticks lit again; the smoke rising
        const k = ss(cl01((t - T.b12) / 1.2));
        lensTo(50);
        for (let i = 0; i < 3; i++) if (t > T.b12 + 1.0 + i * 0.6) stickFresh(i);
        /* (v24.2, L5-4: a desktop stands 16 cm further back — the red one's tip was off its left edge, −1.07 — and a phone
           slides along the three as each is lit, which its frame cannot hold together: the tips were ±3.3–3.8) */
        if (camera.aspect < 1) { const z = zAlong((t - T.b12 - 0.9) / 1.5); camAt(ROW.mid - 0.46, 0.96, z - 0.04, ROW.mid, ALTAR.top + 0.10 + 0.08 * k, z); }
        else camAt(ROW.mid - 0.62, 0.99, ALTAR_Z[1] - 0.04, ROW.mid, ALTAR.top + 0.10 + 0.08 * k, ALTAR_Z[1]);
      } else {                                                // b6 … b10: the phone before his eyes
        const scroll = sh === 'b6' ? Math.floor((t - T.b6) * 1.4) : 0;
        /* (CP13: the share count climbs in twelfths of a second and stops at the 1,206 the delete dialog then reports — it
           ran on to 1,289 and went DOWN; the morning's hour in the bar) */
        phone.S.draw(sh === 'b6' ? 'thread' : sh === 'b7' ? 'repost' : sh === 'b8' ? 'member' : sh === 'b9' ? 'dm' : (t < T.b10 + 1.5 ? 'delete' : 'deleted'),
                     sh === 'b6' ? scroll : sh === 'b7' ? Math.min(1206, Math.floor(380 + Math.floor((t - T.b7) * 12) / 12 * 260)) : 0, '07:02');
        const shake = sh === 'b9' ? 0.004 * ss(cl01((t - T.b9 - 1.0) / 1.5)) : 0;
        phone.g.position.x = shake * Math.sin(t * 31); phone.g.position.y = -0.004 + shake * Math.sin(t * 27 + 1);
        camAt(CHAIR.x, 1.18, CHAIR.z, CHAIR.x, 1.05, CHAIR.z - 1.0);
      }
    }

    /* ---------------------------------------------------------------- C · WISH FOR IT ALL (bad, §4.8 C — Chad's option)
       The owner's "you are giving them something they never had", turned inside out: he stops giving and starts asking,
       and the asking takes over his mind. Told on the ALTAR, piling higher every night. The three never ask him for
       anything and never punish him; the harm is his own wanting (§2.4). And when his wanting turns to harm, nothing
       answers: the ones from a temple, it is believed, will not help with anything wrong (§2.6 6). */
    const C_SHOTS = ['c0', 'c1', 'c2a', 'c2b', 'c2c', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10', 'c11'];
    function cShot(t) {
      const T = END.C;
      return t < T.c1 ? 'c0' : t < T.c2 ? 'c1' : t < T.c2b ? 'c2a' : t < T.c2c ? 'c2b' : t < T.c3 ? 'c2c' : t < T.c4 ? 'c3'
           : t < T.c5 ? 'c4' : t < T.c6 ? 'c5' : t < T.c7 ? 'c6' : t < T.c8 ? 'c7' : t < T.c9 ? 'c8' : t < T.c10 ? 'c9' : t < T.c11 ? 'c10' : 'c11';
    }
    /* C's things: more drinks for them every night, toys still in their packets, a wish slip under every bottle in his own
       hand, the order slips pinned over the merit receipts — built once, hidden (endReset hides them) */
    function cProps() {
      const P = endProps(); if (P.c) return P.c;
      const R = worldR, A = ALTAR, C = { bottles: [], toys: [], wishes: [], slips: [] };
      const WORDS = ['ORDERS', 'MONEY', 'LUCK'], tW = WORDS.map(w => tex(makeWishT(THREE, cnv, w)));
      // the extra drinks, night by night: (child, offset along the runner, night it appears)
      /* (CP13, the geometry lens: at ±0.09 six of the seven stood 1.6–2.4 cm into a water cup or a first bottle; at ±0.13
         each clears its own child's cup and bottle and the next child's extra) */
      [[0, -0.13, 1], [0, 0.13, 2], [1, -0.13, 1], [1, 0.13, 3], [2, -0.13, 2], [0, -0.20, 3], [2, 0.13, 3]].forEach(([i, dz, night], k) => {
        const b = makeBottle(); b.cap.visible = false;
        const st = makeStraw(); st.g.position.y = 0.012; st.top.rotation.z = -1.15; b.g.add(st.g);
        b.g.position.set(ROW.back + (k % 2 ? -0.03 : 0.02), A.top, ALTAR_Z[i] + dz); b.g.rotation.y = (k * 1.7) % 1 - 0.5;
        b.g.visible = false; b.g.userData.night = night; R.add(b.g); C.bottles.push(b.g);
        // and under it, folded, his wish
        const w = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.03), M({ map: tW[k % 3], roughness: 0.9 }));
        w.rotation.set(-Math.PI / 2, 0, (k * 0.7) % 1 - 0.5); w.position.set(ROW.back - 0.035, A.top + 0.0055, ALTAR_Z[i] + dz + 0.02);   // (on the runner)
        w.visible = false; w.userData.night = night; R.add(w); C.wishes.push(w);
      });
      // the toys, still in their packets (a printed card back, a clear blister), their fronts to the mat (CP8: turned along
      // the row they stood edge-on to him, coloured planks by photograph)
      const tCols = [0xd83a3a, 0x3a7ad8, 0xe8b83a, 0x5ab06a], TOYS = ['car', 'robot', 'duck', 'plane', 'car'];
      for (let k = 0; k < 5; k++) {
        const g = new THREE.Group(); g.position.set(ROW.front - 0.02 + (k % 2) * 0.03, A.top + 0.004, (ALTAR_Z[0] + ALTAR_Z[2]) / 2 + (k - 2) * 0.17); g.rotation.y = -Math.PI / 2 + (((k * 0.9) % 1.2) - 0.6) * 0.5;
        const mP = M({ color: tCols[k % 4], roughness: 0.6 }), mF = M({ map: tex(makeToyT(THREE, cnv, TOYS[k], tCols[k % 4])), roughness: 0.6 });
        const pc = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.10, 0.012), [mP, mP, mP, mP, mF, mP]); pc.position.y = 0.05; g.add(pc);
        box(0.05, 0.06, 0.018, 0, 0.055, 0.012, M({ color: 0xeef4f8, roughness: 0.15, transparent: true, opacity: 0.55 }), g, false);
        g.visible = false; g.userData.night = 1 + (k % 3); R.add(g); C.toys.push(g);
      }
      // the order slips, pinned over the merit receipts on the cork board
      for (let k = 0; k < 5; k++) {
        const r0 = roomLive.receipts[k % roomLive.receipts.length]; if (!r0) break;
        const s2 = new THREE.Mesh(new THREE.PlaneGeometry(0.075, 0.1), M({ map: tex(makeOrderSlipT(THREE, cnv)), roughness: 0.9 }));
        r0.updateWorldMatrix(true, false); r0.getWorldPosition(_cv); r0.getWorldQuaternion(_cq);
        s2.position.copy(_cv).add(_cv2.set(0.02 * (k - 2), 0.012 * (k % 2), 0.004).applyQuaternion(_cq)); s2.quaternion.copy(_cq); s2.rotateZ(0.08 * (k - 2));
        s2.visible = false; s2.userData.day = 1 + Math.floor(k / 2); R.add(s2); C.slips.push(s2);
      }
      // the little one's pinwheel, crushed (a copy: his own stays on the altar), and the owner's card beside it
      const pw = roomLive.pinwheel ? roomLive.pinwheel.clone(true) : new THREE.Group();
      pw.scale.set(1, 0.35, 0.6); pw.children.forEach((b2, j) => { b2.rotation.x = 0.6 * (j % 2 ? 1 : -1); });
      pw.visible = false; C.pinCrushed = pw; R.add(pw);
      return (P.c = C);
    }
    const _cv = new THREE.Vector3(), _cv2 = new THREE.Vector3(), _cq = new THREE.Quaternion();
    function cState(sh) {
      const C = cProps(), n = C_SHOTS.indexOf(sh);
      const night = n < C_SHOTS.indexOf('c3') ? 0 : sh === 'c3' ? 1 : 3;      // (c3 counts the nights up on its own clock)
      C.bottles.forEach(b2 => { b2.visible = night >= b2.userData.night; });
      C.wishes.forEach(w => { w.visible = night >= w.userData.night; });
      C.toys.forEach(g => { g.visible = night >= g.userData.night; });
      C.slips.forEach(s2 => { s2.visible = n >= C_SHOTS.indexOf('c2b'); });
      for (let i = 0; i < 3; i++) stubShow(i, n < C_SHOTS.indexOf('c2a'));
      if (n >= C_SHOTS.indexOf('c3')) for (let i = 0; i < 3; i++) stickFresh(i);
      cartonDown(n < C_SHOTS.indexOf('c2a'));
      roomClock(n <= 1 ? '02:50' : n <= 5 ? '22:40' : n === 7 || n >= 8 ? '03:33' : '23:58');
      endLook(n <= 1 ? 'DEEP' : n <= 4 ? 'AFTERNOON' : n <= 6 ? 'NIGHT' : 'HARSH');
      cityOut(n <= 1 ? 0 : n <= 4 ? -1 : n <= 6 ? 1 : 0);         // (the block's windows: late, none by day, the evening's, late)
      calSwap(n >= C_SHOTS.indexOf('c2c') ? 'C' : null);         // (the month crossed through; its last Buddha Day with no tick)
      laptopPage(false);
      C.pinCrushed.visible = n >= C_SHOTS.indexOf('c10');
    }
    function endC(t, api) {
      const T = END.C, sh = cShot(t), ss = smooth, C = cProps();
      if (sh !== endLive.shot) { endLive.shot = sh; cState(sh); }
      const raised = sh === 'c1' ? ss(cl01((t - T.c1 - 0.3) / 0.6)) : 0;
      if (api && api.handsRoot) api.handsRoot.visible = raised > 0.002;
      /* the clasp low, the joined fingers in the frame's lower quarter under the red one (CP8: at −0.17 the hands filled a
         phone's frame and hid him; at −0.35 only their tips touched its edge), coming up from under the edge */
      if (api && api.handPose) api.handPose(raised > 0.002 ? 'pray' : null, 1, { y: -0.28 - 0.4 * (1 - raised) });   // (the clasp whole, rising: a blend from rest passed a pointing hand through the frame)
      lensTo(72); bloomSet(0);
      if (sh === 'c3') {                                         // the altar growing, a cut each night (night 1, 2, 3)
        const nn = 1 + Math.min(2, Math.floor((t - T.c3) / ((T.c4 - T.c3) / 3)));
        C.bottles.forEach(b2 => { b2.visible = nn >= b2.userData.night; }); C.wishes.forEach(w => { w.visible = nn >= w.userData.night; });
        C.toys.forEach(g => { g.visible = nn >= g.userData.night; });
      }
      if (sh === 'c0') {                                         // his look from one face to the next, slowly, as if counting
        const k = (t - 0.3) / 3.4, i = Math.max(0, Math.min(2, Math.floor(k * 3))), u = ss(cl01(k * 3 - i));
        const z = ALTAR_Z[Math.max(0, i - 1)] + (ALTAR_Z[i] - ALTAR_Z[Math.max(0, i - 1)]) * u;
        camAt(BYBED.x, 0.58, BYBED.z, RISER.x, ALTAR.top + ALTAR.riser + 0.12, z);
      } else if (sh === 'c1') {                                  // close to the red one, his joined hands at his lips
        lensTo(50);
        camAt(ROW.mid - 0.30, 0.98, ALTAR_Z[0] - 0.02, RISER.x, ALTAR.top + ALTAR.riser + KIDS[0].h * 0.62, ALTAR_Z[0]);
      } else if (sh === 'c2a') {                                 // the next days: the ROADEYE stack going out, carton by carton
        lensTo(56);
        const out = Math.floor(ss(cl01((t - T.c2) / (T.c2b - T.c2 - 0.3))) * 9);
        (roomLive.cartons || []).forEach((b2, k) => { b2.visible = k < 12 - out; });
        if (roomLive.tapeDisp) roomLive.tapeDisp.position.y = out >= 9 ? 0.16 : 0.29;   // (down onto the last row when the second has gone)
        camAt(0.40, 0.72, -0.78, 0.71, 0.18, -1.55);
      } else if (sh === 'c2b') {                                 // the order slips pinned over the merit receipts
        lensTo(50);
        camAt(-0.36, 1.38, -1.05, -0.55, 1.38, -1.79);       // (level on the board: CP8, half the frame was bare wall)
      } else if (sh === 'c2c') {                                 // the calendar: a Buddha Day gone by, no receipt
        lensTo(46);
        camAt(0.70, 1.48, -1.25, 0.85, 1.50, -1.79);
      } else if (sh === 'c3') {
        const k = ss(cl01((t - T.c3) / (T.c4 - T.c3)));
        /* (v24.2, L5-4: a phone stands 0.6 m back, as c11 does — from the mat its faces were −1.31 and 1.18) */
        camAt(MAT.x - (camera.aspect < 1 ? 0.6 : 0) + 0.05 * k, MAT_EYE + 0.05, MAT.z - 0.1, RISER.x, ALTAR.top + 0.10, (ALTAR_Z[0] + ALTAR_Z[2]) / 2);
      } else if (sh === 'c4') {                                  // close on the three; the wishes running together
        lensTo(56);
        const k = ss(cl01((t - T.c4) / (T.c5 - T.c4)));
        /* (v24.2, L5-4: close on the three is one of them on a phone — faces ±2.05 → ±2.48 — so there it slides along them) */
        if (camera.aspect < 1) { const z = zAlong((t - T.c4 - 0.4) / 6.0); camAt(MAT.x + 0.15 + 0.12 * k, MAT_EYE + 0.06, z, RISER.x, ALTAR.top + ALTAR.riser + 0.12, z); }
        else camAt(MAT.x + 0.15 + 0.12 * k, MAT_EYE + 0.06, MAT.z, RISER.x, ALTAR.top + ALTAR.riser + 0.12, (ALTAR_Z[0] + ALTAR_Z[2]) / 2);
        /* the lamp caught in their eyes, STILL (CP13: pulsing while he wished, they read as answering his greed — and the
           lesson is that nothing answers) */
        for (let i = 0; i < 3; i++) { const G = careLive.glints[i]; if (G) { G.sp.visible = true; G.sp.material.opacity = 0.6; } }
      } else if (sh === 'c5') {                                  // 03:33, every light on; the box wound too far, playing too fast
        lensTo(50);
        for (const G of careLive.glints) G.sp.visible = false;
        const bz = (RISER.z1 + ALTAR.z1) / 2;
        camAt(1.30 - 0.50, 0.98, bz - 0.24, 1.30, ALTAR.top + 0.05, bz);
        careLive.boxOpen = careLive.boxOpenTo = 1;
        if (roomLive.boxKey) roomLive.boxKey.rotation.x = -(t - T.c5) * 9;
        if (roomLive.boxDrum) roomLive.boxDrum.rotation.x = (t - T.c5) * 11;
      } else if (sh === 'c6') {                                  // the laptop: a rival's shop; he turns to the three, through his teeth
        const s2 = laptopScreen(); laptopPage(true); endProps().page.draw('rival', 0);
        const turn = ss(cl01((t - (T.c6 + 1.4)) / 1.0));
        if (s2) { const D = 0.62; const L = lerp3([s2.p.x, s2.p.y, s2.p.z], [RISER.x, ALTAR.top + ALTAR.riser + 0.12, ALTAR_Z[1]], turn);
          camAt(s2.p.x + s2.n.x * D * (1 - 0.3 * turn), s2.p.y + s2.n.y * D + 0.05, s2.p.z + s2.n.z * D, L[0], L[1], L[2]); }
      } else if (sh === 'c7') {                                  // nothing answers: the embers as always, the box slips and stops
        laptopPage(false);
        /* (v24.2, L5-4: the box it names stood off the frame on a desktop too, at 1.08; a desktop holds the embers, the three
           and the box from 15 cm back with the look a little toward it; a phone stands back on the three and turns to the
           box as it slows) */
        if (camera.aspect < 1) { const k = ss(cl01((t - T.c7 - 0.6) / 1.8));
          camAt(MAT.x - 0.40, MAT_EYE + 0.05, MAT.z, RISER.x + (1.30 - RISER.x) * k, ALTAR.top + ALTAR.riser + 0.1 - 0.15 * k, MAT.z + (1.02 - MAT.z) * k); }
        else camAt(MAT.x + 0.05, MAT_EYE + 0.05, MAT.z, RISER.x, ALTAR.top + ALTAR.riser + 0.07, 0.50);
        if (roomLive.boxDrum) roomLive.boxDrum.rotation.x += 0;   // (stopped)
      } else if (sh === 'c8') {                                  // his laugh, alone; the picture smearing as he looks round the room
        const a = Math.sin((t - T.c8) * 0.9) * 0.9;
        camAt(MAT.x, MAT_EYE + 0.1, MAT.z, MAT.x + Math.cos(a) * 2, 1.0, MAT.z + Math.sin(a) * 2);
      } else if (sh === 'c9') {                                  // back to them, close, afraid
        lensTo(52);
        /* (v24.2, L5-4: on a phone the middle one alone, ±2.85 — there the lens slides along the three) */
        if (camera.aspect < 1) { const z = zAlong((t - T.c9 - 0.3) / 3.8); camAt(MAT.x + 0.30, MAT_EYE + 0.05, z, RISER.x, ALTAR.top + ALTAR.riser + 0.12, z); }
        else camAt(MAT.x + 0.30, MAT_EYE + 0.05, MAT.z, RISER.x, ALTAR.top + ALTAR.riser + 0.12, ALTAR_Z[1]);
      } else if (sh === 'c10') {                                 // under the slips: the owner's card and the crushed pinwheel
        lensTo(44);
        const cd = roomLive.card;
        if (cd) { if (!cd.userData.r0) { cd.userData.p0 = cd.position.clone(); cd.userData.r0 = cd.rotation.clone(); }
                  cd.position.set(ROW.front, ALTAR.top + 0.0055, ALTAR_Z[2] + 0.18); cd.rotation.set(-Math.PI / 2, -Math.PI / 2, 0, 'YXZ'); }   // (over the runner's end, inside the edge)
        C.pinCrushed.position.set(ROW.front + 0.02, ALTAR.top + 0.006, ALTAR_Z[2] + 0.24); C.pinCrushed.rotation.set(Math.PI / 2 - 0.2, 0.3, 0);
        camAt(ROW.front - 0.32, 0.98, ALTAR_Z[2] + 0.10, ROW.front, ALTAR.top + 0.01, ALTAR_Z[2] + 0.20);
      } else {                                                   // the three in the harsh light, unchanged
        /* (a narrow screen stands 0.42 m further back — CP13, the endings' photographs: from the mat a phone held the
           middle one alone, the other two cut by its edges, under "They were only children...") */
        const k = ss(cl01((t - T.c11) / (T.epi - T.c11))), back = camera.aspect < 1 ? 0.42 : 0;
        camAt(MAT.x - back - 0.1 * k, MAT_EYE + 0.05, MAT.z, RISER.x, ALTAR.top + ALTAR.riser + 0.12, (ALTAR_Z[0] + ALTAR_Z[2]) / 2);
      }
      /* (CP13, the films lens: the smear this shot asked for is painted in play only — PULSE_LIVE — so it never showed in
         a scene; the call is gone rather than given a cine flag, which would change pictures already photographed) */
    }

    /* ---------------------------------------------------------------- D · CARE FOR THEM (best, §4.8 D)
       Loving kindness with a boundary: he will not open the door again, but he is not going anywhere. Told at DAWN: the
       room put right in the night (the stubs cleared, three fresh sticks lit at the desk as in play — the packet and the
       lighter on the wood, no hand near them — one in each bowl, the cups topped up, the red one's drink new, the box
       wound), his hands joined, the three threads of smoke rising STRAIGHT at last (V13's payoff); the temple at first
       light, the merit made in their names and the water given to the earth, three lights rising (temple.js); home in the
       morning sun; THE YEARS; and the envelope for whoever looks after them next. No hand holds anything small in
       close-up (the bottle's lesson): what he does is shown by the thing itself, the hand below the frame. */
    const D_SHOTS = ['d0', 'd1', 'd1b', 'd2', 'd2b', 'd2c', 'd3', 'd4', 'd5', 'temple', 'd11', 'y1', 'y2', 'y3', 'y4', 'y5', 'y6', 'd13', 'd13b', 'd14'];
    function dShot(t) {
      const T = END.D;
      if (t < T.d1) return 'd0'; if (t < T.d1b) return 'd1'; if (t < T.d2) return 'd1b'; if (t < T.d2b) return 'd2';
      if (t < T.d2c) return 'd2b'; if (t < T.d3) return 'd2c'; if (t < T.d4) return 'd3'; if (t < T.d5) return 'd4';
      if (t < T.court) return 'd5'; if (t < T.home) return 'temple'; if (t < T.years) return 'd11';
      if (t < T.y2) return 'y1'; if (t < T.y3) return 'y2'; if (t < T.y4) return 'y3'; if (t < T.y5) return 'y4';
      if (t < T.y6) return 'y5'; if (t < T.env) return 'y6'; if (t < T.envBox) return 'd13'; if (t < T.last) return 'd13b';
      return 'd14';
    }
    /* D's things, built once and hidden (endReset hides them): the receipts THE YEARS pins — two more rows on his board and
       a second board beside it — the calendar's later months, and the envelope */
    function dProps() {
      const P = endProps(); if (P.d) return P.d;
      const R = worldR, D = { more: [], board2: null, cals: [], env: null, envUnder: null, pen: null };
      const cb = roomLive.yantBoard;
      if (cb) {
        for (let k = 0; k < 14; k++) {                          // two more rows on his own board
          const row = Math.floor(k / 7), i = k % 7, x = -0.13 + i * 0.065 + (row ? 0.03 : 0), y = 0.05 + row * 0.12 + (i % 2) * 0.01;
          const m = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.09), M({ map: tex(makeReceiptT(THREE, cnv, 7 + k)), roughness: 0.9 }));
          m.position.set(x, y > 0.17 ? 0.17 : y, 0.004 + i * 0.0006); m.rotation.z = ((k * 0.37) % 0.12) - 0.06; m.visible = false; cb.add(m); D.more.push(m);
        }
        // and a second board beside it, filling as the first one did
        const b2 = new THREE.Group(); b2.position.set(-1.26, 1.42, cb.position.z); b2.visible = false; R.add(b2); D.board2 = b2;
        b2.add(new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.44), M({ map: tex(makeCorkT(THREE, cnv)), roughness: 0.95 })));
        for (let k = 0; k < 10; k++) {
          const i = k % 5, row = Math.floor(k / 5);
          const m = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.09), M({ map: tex(makeReceiptT(THREE, cnv, 21 + k)), roughness: 0.9 }));
          m.position.set(-0.16 + i * 0.08, 0.1 - row * 0.15, 0.004 + i * 0.0006); m.rotation.z = ((k * 0.53) % 0.1) - 0.05; m.visible = false; b2.add(m); D.more.push(m);
        }
      }
      // the calendar's later months, every day crossed off (a plane over his calendar, its texture swapped page by page)
      if (roomLive.calendar) {
        const c0 = roomLive.calendar, cm = new THREE.Mesh(c0.geometry, M({ map: null, roughness: 0.85 }));
        cm.position.copy(c0.position); cm.position.z += 0.001; cm.visible = false; R.add(cm); D.calPage = cm;
        // (each a real month after 2025's October, its own Buddha Days, every one ticked: CP8)
        for (const [mo, holy, start, len] of [['NOVEMBER', [5, 12, 20, 28], 6, 30], ['DECEMBER', [4, 12, 19, 27], 1, 31], ['JANUARY', [3, 11, 18, 26], 4, 31],
                                              ['APRIL', [2, 10, 17, 25], 3, 30], ['JULY', [1, 8, 15, 23, 30], 3, 31], ['OCTOBER', [3, 11, 18, 26], 4, 31]])
          D.cals.push(tex(makeCalendarT(THREE, cnv, 99, mo, holy, null, start, len)));
      }
      // the envelope, on the desk where he writes it; and under the music box, its corner out
      const E = makeHeirEnvelopeT(THREE, cnv); tex(E.t);
      D.envTex = E;
      D.env = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.1375), M({ map: E.t, roughness: 0.85 }));
      D.env.rotation.x = -Math.PI / 2; D.env.position.set(WORK.x, DESK.top + 0.0195, WORK.z + 0.02); D.env.visible = false; R.add(D.env);   // (on the slab's surface)
      D.envUnder = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.1375), M({ map: E.t, roughness: 0.85 }));
      D.envUnder.rotation.set(-Math.PI / 2, 0, -Math.PI / 2 + 0.18);
      const bz = (RISER.z1 + ALTAR.z1) / 2;
      D.envUnder.position.set(1.27, ALTAR.top + 0.0055, bz - 0.05); D.envUnder.visible = false; R.add(D.envUnder);   // (over the runner's end)
      // his pen: its tip riding the end of the ink (the hand that holds it is below the frame)
      D.pen = new THREE.Group(); D.pen.visible = false; R.add(D.pen);
      const barrel = cyl(0.0045, 0.0045, 0.13, 0, 0.065, 0, M({ color: 0x1a1c24, roughness: 0.35, metalness: 0.2 }), 10, D.pen);
      cyl(0.0012, 0.0045, 0.012, 0, -0.006, 0, M({ color: 0xc8c8cc, roughness: 0.3, metalness: 0.8 }), 10, D.pen);
      void barrel;
      return (P.d = D);
    }
    /* the room as each of D's shots needs it — SET, every field (a skip lands right) */
    function dState(sh) {
      const P = endProps(), D = dProps(), n = D_SHOTS.indexOf(sh), at = (s) => n >= D_SHOTS.indexOf(s);
      // the stubs cleared in d1 (one by one, by the frame), fresh sticks from d2 on (one by one), lit
      if (!at('d1')) for (let i = 0; i < 3; i++) stubShow(i, true);
      if (at('d1b') && !at('d2')) for (let i = 0; i < 3; i++) stickShow(i, false);
      if (at('d2b')) for (let i = 0; i < 3; i++) stickFresh(i);
      // the desk's packet and lighter (d1b), then put away
      if (sh === 'd1b') { careLive.catchK = 0; deskIncense('stage'); careLive.lighter.flame.visible = false; careLive.sticks.tips.forEach(T => { T.em.visible = false; T.fl.visible = false; }); }
      else if (careLive.incDesk || (careLive.lighter && careLive.lighter.g.parent === worldR)) deskIncense(false);
      // the cups (topped in d2b), the red one's drink (new in d2c)
      careLive.pour = at('d2b') ? (sh === 'd2b' ? 0.82 : 1) : 1;
      { const B0 = careLive.bottles[0]; if (B0 && B0.liq) B0.liq.scale.y = at('d2c') ? (sh === 'd2c' ? 0.5 : 1) : 0.5; }
      // the box: wound in d3, played out by the morning
      careLive.boxOpen = careLive.boxOpenTo = at('d3') && !at('d11') ? (sh === 'd3' ? 0 : 1) : (at('d11') ? 1 : 0);
      careLive.drumRate = 1;
      // the light: the night until the temple, the morning after it
      if (!at('temple')) { endLook('NIGHT'); roomClock(sh === 'd0' ? '02:50' : '03:04'); cityOut(0); }
      else if (at('d11')) { endLook('MORNING'); roomClock('07:20'); cityOut(-1); }
      roomLive.smokeStill = at('d5') ? 1 : 0;
      // the years' things
      D.more.forEach(m => { m.visible = false; }); if (D.board2) D.board2.visible = false;
      if (D.calPage) D.calPage.visible = false;
      D.env.visible = sh === 'd13'; D.envUnder.visible = at('d13b'); D.pen.visible = sh === 'd13';
      if (at('d11')) { for (let i = 0; i < 3; i++) stickFresh(i); careLive.pour = 1; }
      cartonDown(false);                                          // (the carton the red one swiped, back on the stack in the night)
      if (roomLive.coin) roomLive.coin.visible = false;           // (and the coin put back in the little one's toy box)
      phone.g.visible = false;
      worldM.visible = sh === 'temple' || sh === 'y2' || sh === 'y4' || sh === 'y6';
      void P;
    }
    function endD(t, api) {
      const T = END.D, sh = dShot(t), ss = smooth, D = dProps();
      if (sh !== endLive.shot) { endLive.shot = sh; dState(sh); }
      /* his hands: joined in d4 (the clasp at its own height — the añjali every chapter of this episode has used), and at the
         temple's kneel; never at a thing in close-up */
      /* (CP13, the films lens: the temple's kneel had no joined hands — the plan's §4.8 D at 40.0 — so they join there too,
         for the shot from his eyes; the teaching's shot is from the side and cuts them away) */
      const kneel = sh === 'temple' && t >= DT.kneel && t < DT.teach;
      const prayK = sh === 'd4' ? ss(cl01((t - (T.d4 + 0.2)) / 0.8)) : kneel ? ss(cl01((t - (DT.kneel + 0.3)) / 0.8)) : 0;
      if (api && api.handsRoot) api.handsRoot.visible = prayK > 0.002;
      /* the clasp low, the three above the joined fingers (CP8: at the clasp's own height the hands covered the middle one on a
         phone, and on their way up from rest one hand passed through the frame pointing at the sweets): drawn whole, and
         risen into the frame from under its edge */
      if (api && api.handPose) api.handPose(prayK > 0.002 ? 'pray' : null, 1, { y: -0.28 - 0.4 * (1 - prayK) });     // (the clasp whole, rising from below the frame)
      lensTo(72); bloomSet(0);
      const bz = (RISER.z1 + ALTAR.z1) / 2;
      if (sh === 'd0') {                                     // on the floor by the bed: the three, the lamp low
        camAt(BYBED.x, BYBED.eye, BYBED.z, RISER.x, ALTAR.top + ALTAR.riser + 0.12, ALTAR_Z[1]);
      } else if (sh === 'd1') {                              // the three grey stubs lifted out of the sand, one by one
        lensTo(48);
        for (let i = 0; i < 3; i++) { const g = t > T.d1 + 0.6 + i * 0.6; const sk = careLive.sticksSet[i]; if (sk) sk.visible = !g; }
        /* (v24.2, L5-4: a phone follows each stub as it is lifted — the outer bowls were −3.15 and 2.82) */
        if (camera.aspect < 1) { const z = zAlong((t - T.d1 - 0.35) / 1.5); camAt(ROW.mid - 0.46, ALTAR.top + 0.36, z - 0.05, ROW.mid, ALTAR.top + 0.04, z); }
        else camAt(ROW.mid - 0.46, ALTAR.top + 0.36, ALTAR_Z[1] - 0.05, ROW.mid, ALTAR.top + 0.04, ALTAR_Z[1]);
      } else if (sh === 'd1b') {                             // at the desk: the lighter struck, the sticks lean into its flame
        const Lg = careLive.lighter, St = careLive.sticks, u = t - T.d1b;
        Lg.flame.visible = u > 0.5 && u < 3.1;
        careLive.catchK = ss(cl01((u - 1.1) / 1.6)) * (1 - ss(cl01((u - 3.1) / 0.6)));
        St.tips.forEach((Tp, j) => { Tp.em.visible = u > 1.8 + j * 0.2; Tp.fl.visible = u > 2.2 + j * 0.15 && u < 4.1; });
        const tx = PKT_O.x + 0.07, ty = DESK.top + 0.09, tz = PKT_O.z;
        camAt(CHAIR.x, DESK_EYE, CHAIR.z, tx, ty, tz);
      } else if (sh === 'd2') {                              // one stick in each bowl
        lensTo(48);
        for (let i = 0; i < 3; i++) { if (t > T.d2 + 0.5 + i * 0.7) stickFresh(i); else stickShow(i, false); }
        if (camera.aspect < 1) { const z = zAlong((t - T.d2 - 0.3) / 1.6); camAt(ROW.mid - 0.46, ALTAR.top + 0.36, z - 0.05, ROW.mid, ALTAR.top + 0.04, z); }   // (v24.2, L5-4: each stick as it goes in)
        else camAt(ROW.mid - 0.46, ALTAR.top + 0.36, ALTAR_Z[1] - 0.05, ROW.mid, ALTAR.top + 0.04, ALTAR_Z[1]);
      } else if (sh === 'd2b') {                             // the cups topped up from the jug
        lensTo(46);
        careLive.pour = 0.82 + 0.18 * ss(cl01((t - (T.d2b + 0.2)) / 1.1));
        camAt(ROW.back - 0.44, ALTAR.top + 0.30, ALTAR_Z[2] - 0.12, ROW.back, ALTAR.top + 0.03, ALTAR_Z[2] - 0.06);
      } else if (sh === 'd2c') {                             // the red one's drink, new
        lensTo(46);
        { const B0 = careLive.bottles[0]; if (B0 && B0.liq) B0.liq.scale.y = t > T.d2c + 0.6 ? 1 : 0.5; }
        camAt(ROW.back - 0.42, ALTAR.top + 0.26, ALTAR_Z[0] + 0.14, ROW.back, ALTAR.top + 0.09, ALTAR_Z[0] + 0.06);
      } else if (sh === 'd3') {                              // the box wound, gently; the lid lifts and it plays
        lensTo(44);
        if (roomLive.boxKey) roomLive.boxKey.rotation.x = -Math.PI * 4 * ss(cl01((t - (T.d3 + 0.3)) / 1.6));
        careLive.boxOpenTo = t > T.d3 + 2.0 ? 1 : 0;
        camAt(1.30 - 0.50, ALTAR.top + 0.28, bz - 0.24, 1.30, ALTAR.top + 0.05, bz);
      } else if (sh === 'd4') {                              // the three in the lamplight; his hands join; his look on the little one
        const k = ss(cl01((t - T.d4) / 3.5));
        camAt(MAT.x - (camera.aspect < 1 ? 0.45 : 0), MAT_EYE, MAT.z, RISER.x, ALTAR.top + ALTAR.riser + KIDS[2].h * 0.6, ALTAR_Z[1] + (ALTAR_Z[2] - ALTAR_Z[1]) * k);   // (v24.2, L5-4: a phone 0.45 back, the three in at the start)
      } else if (sh === 'd5') {                              // the three threads of smoke rise STRAIGHT; the bells still
        lensTo(50);
        roomLive.smokeStill = ss(cl01((t - T.d5) / 1.6));
        const k = ss(cl01((t - T.d5) / (T.court - T.d5)));
        /* (v24.2, L5-1: it dollied IN, and held one thread on either screen — the outer tips ±1.09 → ±1.49 on a desktop,
           ±3.7 → ±5 on a phone; the plan's own rule is that a shot that must hold all three pulls back. It dollies OUT now,
           a phone from 1.16 m behind the mat over the bed's edge, and a desktop looks a little higher so the threads climb
           in frame) */
        const nw = camera.aspect < 1;
        camAt(MAT.x - (nw ? 1.16 : 0.12) - 0.1 * k, MAT_EYE + 0.02, MAT.z - 0.05, RISER.x, ALTAR.top + (nw ? 0.30 : 0.40) + 0.06 * k, (ALTAR_Z[0] + ALTAR_Z[2]) / 2);
      } else if (sh === 'temple') {
        dTempleFrame(t, api);
      } else if (sh === 'd11') {                             // HOME, the morning: the window open, the three in the sun
        const k = ss(cl01((t - T.home) / (T.years - T.home)));
        camAt(MAT.x - 0.2 - (camera.aspect < 1 ? 0.3 : 0), MAT_EYE + 0.18, MAT.z + 0.05, RISER.x, ALTAR.top + ALTAR.riser + 0.12 + 0.05 * k, (ALTAR_Z[0] + ALTAR_Z[2]) / 2);   // (v24.2, L5-4: the little one's face was just off a phone's edge)
        if (roomLive.pinwheel) roomLive.pinwheel.rotation.z += 0.05;   // (the morning air)
        if (t > T.home + 2.5 && D.more[0]) D.more[0].visible = true;   // the morning's receipt pinned
      } else if (sh === 'y1' || sh === 'y3' || sh === 'y5') {   // THE YEARS: locked off; the days and nights go by
        const u = t - (sh === 'y1' ? T.years : sh === 'y3' ? T.y3 : T.y5), days = ['DAWN', 'MORNING', 'AFTERNOON', 'DUSK', 'DEEP'];
        { const dd = days[Math.floor(u / 0.42) % days.length]; endLook(dd); cityOut(dd === 'DEEP' ? 0 : dd === 'DUSK' ? 1 : -1); }
        stickFresh(0); stickFresh(1); stickFresh(2);
        if (sh === 'y1') camAt(MAT.x - 0.5, 1.2, MAT.z + 0.2, RISER.x, ALTAR.top + 0.25, (ALTAR_Z[0] + ALTAR_Z[2]) / 2);
        else if (sh === 'y3') {                               // the receipts filling his board, then a second board
          const shown = Math.floor(cl01(u / (T.y4 - T.y3)) * (D.more.length + 1));
          D.more.forEach((m, k) => { m.visible = k < shown; });
          if (D.board2) D.board2.visible = shown > 14;
          /* close and level on the board that is filling (CP8: from 1.2 m the desk lamp's arm stood in front and the board was a
             small thing at the top); a phone's narrow frame pans to the second board as it begins, a wide one starts on the
             first board whole and draws back across to hold both (CP8, by photograph on a desktop: parked between them, the
             first stood cut by the frame's edge beside an empty wall until the second came) */
          lensTo(56);
          const pk = ss(cl01((u / (T.y4 - T.y3) - 0.52) / 0.3)), wide = camera.aspect >= 1;
          const bx = -0.52 + ((wide ? -0.83 : -1.26) + 0.52) * pk;
          const bz = wide ? -1.06 + (Math.max(0.73, 0.70 / (Math.tan(28 * Math.PI / 180) * camera.aspect)) - 0.73) * pk : -1.06;
          camAt(bx, 1.44, bz, bx, 1.43, -1.79);
        } else {                                              // the calendar's pages turning, every day crossed off
          const page = Math.min(D.cals.length - 1, Math.floor(u / 0.38));
          if (D.calPage) { D.calPage.visible = true; if (D.calPage.material.map !== D.cals[page]) { D.calPage.material.map = D.cals[page]; D.calPage.material.needsUpdate = true; } }
          lensTo(52);
          camAt(0.85, 1.48, -1.0, 0.85, 1.5, -1.79);
        }
      } else if (sh === 'y2' || sh === 'y4' || sh === 'y6') {   // the temple at dawn, again and again, in a different season's light
        fLight(sh === 'y2' ? TEMPLE_DAWN_HOT : sh === 'y4' ? TEMPLE_DAWN_RAIN : TEMPLE_DAWN);
        endLive.looked = '';                                  // (CP13: so the room's next day is lit again, not left in the temple's light)
        const F = MHALL.F, u = t - (sh === 'y2' ? T.y2 : sh === 'y4' ? T.y4 : T.y6);
        if (endLive.dTray) endLive.dTray.visible = true;
        mCam(MKNEEL.x - 0.35 + 0.04 * u, F + 1.05, MKNEEL.z + 0.35, MDAIS.x, F + 0.85, MDAIS.z);
      } else if (sh === 'd13') {                             // THE ENVELOPE: in his own capitals, the pen's tip riding the ink
        const u = t - T.env, n = Math.floor(cl01((u - 0.5) / 3.6) * D.envTex.LEN);
        D.envTex.draw(n);
        const tip = D.envTex.tipAt(n);                     // (the pen's tip, in the envelope's own 0–1 frame)
        D.pen.position.set(WORK.x - 0.11 + 0.22 * tip.u, DESK.top + 0.028, WORK.z + 0.02 - 0.06875 + 0.1375 * tip.v);
        D.pen.rotation.set(0.55, 0.4, -0.25);
        /* (CP8: on a phone the envelope was twice the frame's width, "OR WHOEVER L" cut by its edge — a narrow screen stands
           back and widens until the whole line is in it, the letters still 30 px high) */
        const narrow = camera.aspect < 1, sc = narrow ? 1.27 : 1;
        lensTo(narrow ? 56 : 40);
        camAt(WORK.x - 0.05 * sc, DESK.top + 0.022 + 0.298 * sc, WORK.z + 0.02 + 0.24 * sc, WORK.x, DESK.top + 0.022, WORK.z + 0.02);
      } else if (sh === 'd13b') {                            // slipped under the music box, its corner out
        lensTo(44);
        camAt(1.30 - 0.46, ALTAR.top + 0.26, bz - 0.30, 1.28, ALTAR.top + 0.02, bz - 0.03);
      } else {                                               // the three in the sun; hold
        lensTo(64);
        /* (v24.2, L5-2: the image the best ending leaves on held the shy one alone on a phone, the others ±1.28 — c11's way,
           0.6 m back there) */
        camAt(MAT.x - 0.1 - (camera.aspect < 1 ? 0.6 : 0), MAT_EYE + 0.14, MAT.z, RISER.x, ALTAR.top + ALTAR.riser + 0.12, (ALTAR_Z[0] + ALTAR_Z[2]) / 2);
      }
      if (sh !== 'temple' && sh !== 'y2' && sh !== 'y4' && sh !== 'y6' && endLive.dTray) endLive.dTray.visible = false;
    }
    /* D at the temple: the tray before his knees (rice, sweets, the children's three small red sodas) and the THREE lights,
       each child's own colour (red-gold, amber, pale blue) — chapter 4's one pale light, three times (V27). Built when D
       first reaches the temple, in World M; hidden by endReset */
    function dTempleProps() {
      if (endLive.dTray) return;
      const F = MHALL.F, G = new THREE.Group(); G.position.set(MKNEEL.x + 0.36, F, MKNEEL.z + 0.02); G.visible = false; worldM.add(G);
      box(0.34, 0.016, 0.24, 0, 0.008, 0, M({ color: 0xc8a050, roughness: 0.35, metalness: 0.7 }), G, false);       // the tray
      const bowl = cyl(0.045, 0.035, 0.035, -0.09, 0.034, -0.05, M({ color: 0xf2eee4, roughness: 0.3 }), 16, G);      // rice
      const rice = new THREE.Mesh(new THREE.SphereGeometry(0.042, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), M({ color: 0xfbf8f0, roughness: 0.9 }));
      rice.position.set(-0.09, 0.05, -0.05); rice.scale.y = 0.55; G.add(rice); void bowl;
      for (let k = 0; k < 5; k++) { const sw = new THREE.Mesh(new THREE.SphereGeometry(0.011, 10, 8), M({ color: [0xd83a3a, 0xf2c23a, 0x3ab06a, 0xe87ab0, 0xd83a3a][k], roughness: 0.4 }));
        sw.position.set(-0.07 + (k % 3) * 0.026, 0.027, 0.06 + Math.floor(k / 3) * 0.024); G.add(sw); }               // sweets
      for (let k = 0; k < 3; k++) { const b = makeBottle(); b.cap.visible = true; b.g.scale.setScalar(0.62); b.g.position.set(0.05 + k * 0.045, 0.016, -0.02 + (k % 2) * 0.03); G.add(b.g); }
      endLive.dTray = G;
      endLive.dLights = [0xffa060, 0xffc070, 0x9cc8ff].map((col) => {
        /* (v24.2, L5-8: the core through the leaves too — depth-tested, the bodhi's crown hid all three cores for the last
           two and a half seconds of their climb, the halos left; chapter 4's merit film was ruled the same way, v23.1) */
        const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: tGlow, color: col, transparent: true, opacity: 0, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false }));
        m.renderOrder = 20;
        const h = new THREE.Sprite(new THREE.SpriteMaterial({ map: tGlow, color: col, transparent: true, opacity: 0, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false }));
        mats.push(m.material, h.material); m.visible = h.visible = false; worldM.add(m); worldM.add(h);   // (CP8: the glow seen through the leaves, as light is)
        return { m, h };
      });
    }
    /* the Yathā vārivahā's four lines, captioned as in chapter 4, timed on the take's own breaths (the same take) */
    function endYatha() {
      if (kit && kit.captions) kit.captions([
        { at: 0.0, end: 3.3, text: W.yatha1, sub: W.yatha1en },
        { at: 3.45, end: 6.45, text: W.yatha2, sub: W.yatha2en },
        { at: 6.6, end: 9.5, text: W.yatha3, sub: W.yatha3en },
        { at: 9.6, end: 12.6, text: W.yatha4, sub: W.yatha4en }
      ]);
    }

    /* ENDING D AT THE TEMPLE (§4.8 D, 32–73.5 s of the scene): World M at first light, by chapter 4's merit film's own
       shots (e3c4 meritFrame: S1 the courtyard, S3 the kneel, S4b the monk, S4/S4c the pour, S6 the roots), moved to
       ending D's clock, its tray of offerings for the three before his knees, and THREE lights where chapter 4 had one —
       red-gold, amber and blue, each child's own colour. Every picture a function of the scene's clock (a skip lands right).
       World M is at x MX: mCam takes its own local coordinates. */
    /* (DT, the temple's clock, is at file scope with END: the scene reads it too) */
    function mCam(px, py, pz, tx, ty, tz) { camAt(MX + px, py, pz, MX + tx, ty, tz); }
    const _dp = new THREE.Vector3(), _dm = new THREE.Vector3(), _dw = new THREE.Vector3(), _dt = new THREE.Vector3();
    function dLightAt(t, i, spot) {                          // the three lights' climb: slow from the wet earth, apart, then up together
      const u = Math.max(0, t - DT.lights - i * 0.35), a = i * 2.1 + 0.4;
      const spread = 0.16 * Math.min(1, u * 0.9) * (1 - 0.6 * smooth(cl01((u - 2.2) / 1.6)));
      _dp.set(spot.x + Math.cos(a + u * 1.4) * spread, spot.y + 0.06 + 1.45 * Math.pow(u, 1.32), spot.z + Math.sin(a + u * 1.4) * spread - u * 0.2);
      return _dp;
    }
    function dTempleFrame(t, api) {
      dTempleProps();
      const F = MHALL.F, ss = smooth;
      worldM.visible = true;
      /* the shots */
      if (t < DT.door) {                                      // the courtyard washed, the bell struck in its pavilion, the hall beyond
        fLight(TEMPLE_DAWN); lensTo(64);
        const k = ss(cl01((t - DT.court) / (DT.door - DT.court)));
        const p = lerp3([MBELL.x + 3.4, 1.55, MBELL.z + 4.2], [MBELL.x + 3.9, 1.6, MBELL.z + 3.2], k);
        const q = lerp3([MBELL.x, 2.7, MBELL.z], [-0.6, 3.6, -2.0], ss(cl01((t - (DT.bell + 0.6)) / 1.6)));
        mCam(p[0], p[1], p[2], q[0], q[1], q[2]);
      } else if (t < DT.kneel) {                              // he crosses to the hall: up the path to the open door
        fLight(TEMPLE_DAWN); lensTo(72);
        const k = ss(cl01((t - DT.door) / (DT.kneel - DT.door)));
        /* (v24.2, L5-13: the eye rose 0.45 m over the flat courtyard and stopped 0.8 m short of the first step — it climbs only
           over the flight now, z −0.6 to −1.8, and stops on its top step at the door) */
        const p = lerp3([0.2, 1.62, 8.0], [0.0, 1.62, -1.7], k);
        p[1] = 1.62 + F * cl01((-0.6 - p[2]) / 1.2);
        mCam(p[0], p[1] + Math.sin(k * Math.PI * 7) * 0.012, p[2], 0, F + 1.9, MALT.z);
      } else if (t < DT.teach) {                              // on his knees before the monk, the tray before him, his hands joined
        fLight(TEMPLE_DAWN); lensTo(68);
        const k = ss(cl01((t - DT.kneel) / (DT.teach - DT.kneel)));
        mCam(MKNEEL.x + 0.04 * k, F + 0.95, MKNEEL.z, MDAIS.x + 0.05, F + 1.12 - 0.02 * k, MDAIS.z);
      } else if (t < DT.pour0 - 0.8) {                        // the monk looks down at the tray, then at him (from the side)
        fLight(TEMPLE_DAWN); lensTo(46);
        const k = ss(cl01((t - DT.teach) / (DT.pour0 - 0.8 - DT.teach)));
        mCam(MDAIS.x - 1.3 + 0.18 * k, F + 1.2, MDAIS.z + 0.62 - 0.08 * k, MDAIS.x + 0.06, F + 1.27, MDAIS.z);
      } else if (t < DT.earth) {                              // the kruat nam: the vessel held from above the frame, the bowl filling
        fLight(TEMPLE_DAWN);
        const early = t < (DT.pour0 + DT.pour1) / 2, k = ss(cl01((t - (early ? DT.pour0 - 0.8 : (DT.pour0 + DT.pour1) / 2)) / 5.0));
        lensTo(early ? 36 : 34);
        if (early) mCam(MBOWL.x + 0.03, F + 0.16 - 0.015 * k, MBOWL.z + 0.44 - 0.05 * k, MBOWL.x - 0.02, F + 0.065, MBOWL.z);
        else mCam(MBOWL.x + 0.27 - 0.03 * k, F + 0.17, MBOWL.z + 0.27 - 0.03 * k, MBOWL.x, F + 0.07, MBOWL.z);
      } else {                                                // the roots: the water given to the earth, and the three lights rising
        fLight(TEMPLE_DAWN);
        const spot = { x: MTREE.x - 0.62, y: MTREE.h, z: MTREE.z + 0.42 };
        const rk = ss(cl01((t - (DT.lights + 0.2)) / 3.6)), push = ss(cl01((t - DT.earth) / (DT.lights - DT.earth)));
        lensTo(46 + 10 * rk);
        const mid = dLightAt(t, 1, spot).clone();
        const cam = lerp3(lerp3([spot.x - 0.17, spot.y + 0.64, spot.z + 0.76], [spot.x - 0.14, spot.y + 0.6, spot.z + 0.7], push),
                          [spot.x - 1.3, spot.y + 1.05, spot.z + 1.5], rk);
        const tgt = lerp3([spot.x + 0.05, spot.y + 0.04, spot.z - 0.05], [mid.x, mid.y, mid.z], ss(cl01((t - (DT.lights + 0.4)) / 1.6)));
        mCam(cam[0], cam[1], cam[2], tgt[0], tgt[1], tgt[2]);
        if (pitch.rotation.x > 1.2) pitch.rotation.x = 1.2;
      }
      dTempleFx(t);
    }
    /* THE MONK'S HEAD (CP13, the films lens: chapter 4's nod was lost in the copy, and his teaching was said by a
       statue). It lifts a little from the tray to him as he speaks, and dips on each phrase of his teaching (measured on
       the shipped take: 0, 2.80, 5.12, 8.06 s) and of the verse (chapter 4's measure of the same take: 0, 3.56, 6.71,
       9.73 s) — absolute from his rest, never stacked (v11.5); he faces −x, so a turn about +z bows him forward */
    const _dq = new THREE.Quaternion(), _dz = new THREE.Vector3(0, 0, 1);
    function dMonkHead(t) {
      const mk = merit.monk;
      if (!mk.ready || !mk.head || !mk.rest) return;
      if (!mk.restW) {
        mk.head.quaternion.copy(mk.rest); mk.head.updateWorldMatrix(true, false);
        mk.restW = mk.head.getWorldQuaternion(new THREE.Quaternion());
        mk.parW = mk.head.parent.getWorldQuaternion(new THREE.Quaternion()).invert();
      }
      let nod = -0.1 * smooth(cl01((t - (DT.teach + 0.1)) / 1.0)) * (1 - smooth(cl01((t - (DT.pour0 - 1.6)) / 1.0)));
      const dip = (t0, ps, a) => { let m = 0; for (const p of ps) { const d = t - t0 - p; if (d > 0 && d < 2.4) m = Math.max(m, Math.sin(Math.PI * d / 2.4) * a); } return m; };
      nod += dip(DT.teach + 0.3, [0, 2.80, 5.12, 8.06], 0.08) + dip(DT.pour0 - 0.6, [0, 3.56, 6.71, 9.73], 0.11);
      _dq.setFromAxisAngle(_dz, nod);
      mk.head.quaternion.copy(mk.parW).multiply(_dq.multiply(mk.restW));
    }
    function dMonkRest() { const mk = merit.monk; if (mk.ready && mk.head && mk.rest) mk.head.quaternion.copy(mk.rest); }
    function dTempleFx(t) {
      const F = MHALL.F;
      dMonkHead(t);
      /* the bell, struck: it swings and settles */
      { const b = mLive.bell, d = t - DT.bell; if (b) b.swing.rotation.z = d > 0 ? Math.sin(d * 4.2) * 0.16 * Math.exp(-d * 0.7) : 0; }
      /* the tray of offerings before his knees: rice, sweets, the three small red sodas (from the kneel on) */
      if (endLive.dTray) endLive.dTray.visible = t >= DT.kneel - 0.1 && t < DT.earth;
      /* the pour (chapter 4's S4/S4c, on ending D's clock) */
      const inside = t >= DT.pour0 - 0.8 && t < DT.earth, pouring = inside;
      const fillK = cl01((t - DT.pour0) / (DT.pour1 - DT.pour0));
      const flow = t < DT.pour0 ? 0 : t < DT.pour1 - 0.6 ? 1 : t < DT.pour1 ? 1 - (t - (DT.pour1 - 0.6)) / 0.6 : 0;
      { const v = mLive.vessel, tip = smooth(cl01((t - (DT.pour0 - 0.5)) / 0.7)) * (1 - smooth(cl01((t - DT.pour1) / 0.8)));
        v.visible = inside;
        v.position.set(MBOWL.x - 0.15, F + 0.155 + 0.03 * (1 - tip), MBOWL.z + 0.004);
        v.rotation.set(0, 0, -0.35 - 0.62 * tip);
        mLive.water.visible = inside && fillK > 0.01;
        const lvl = 0.02 + 0.042 * fillK;
        mLive.water.position.y = lvl;
        { const y = lvl, ir = y <= 0.016 ? 0 : y < 0.026 ? 0.06 * (y - 0.016) / 0.01 : y < 0.05 ? 0.06 + 0.02 * (y - 0.026) / 0.024
                       : y < 0.074 ? 0.08 + 0.008 * (y - 0.05) / 0.024 : 0.088 + 0.006 * Math.min(1, (y - 0.074) / 0.008);
          mLive.water.scale.setScalar(Math.max(0.01, ir * 0.996 - 0.0015) / 0.08); }
        const st = mLive.stream;
        if (pouring && flow > 0.02) {
          v.updateMatrix();
          _dm.copy(v.userData.spout).applyMatrix4(v.matrix);
          _dw.set(Math.cos(v.rotation.z), Math.sin(v.rotation.z), 0).normalize();
          const end = mStreamTo(_dm, _dw, 0.32 + 0.1 * flow, F + lvl, 0.0028 * (0.45 + 0.55 * flow));
          st.visible = true; mLive.streamMat.opacity = 0.62 * Math.min(1, flow * 1.5);
          mLive.streamMat.map.offset.y = -t * 2.6;
          mLive.hit = end;
        } else if (t < DT.earth) st.visible = false;
        mLive.ripples.forEach((rp, i) => {
          const live = pouring && flow > 0.05 && mLive.hit, ph = ((t * 1.25 + i / mLive.ripples.length) % 1);
          rp.r.visible = !!live; if (!live) return;
          rp.r.position.set(mLive.hit.x - MBOWL.x, lvl + 0.0008, mLive.hit.z - MBOWL.z);
          const sc = 0.4 + ph * 2.2; rp.r.scale.set(sc, sc, sc); rp.r.material.opacity = (1 - ph) * 0.55 * flow;
        });
        if (t < DT.earth) mLive.drops.forEach((d, i) => {
          const live = pouring && flow > 0.05 && mLive.hit; d.s.visible = !!live; if (!live) return;
          const ph = ((t * 1.7 + i * 0.137) % 1), a = i * 2.4;
          d.s.position.set(mLive.hit.x + Math.cos(a) * 0.012 * ph, mLive.hit.y + 0.018 * Math.sin(Math.PI * ph), mLive.hit.z + Math.sin(a) * 0.012 * ph);
          d.s.material.opacity = 0.85 * Math.sin(Math.PI * ph) * flow; const s = 0.006 + 0.006 * Math.sin(Math.PI * ph); d.s.scale.set(s, s, 1);
        });
      }
      /* the roots (chapter 4's S6): the bowl tipped over the earth, the wet patch spreading, the glow, and THREE lights */
      { const out = t >= DT.earth && t < DT.home, b2 = mLive.bowl2, spot = { x: MTREE.x - 0.62, y: MTREE.h, z: MTREE.z + 0.42 };
        const tilt = smooth(cl01((t - (DT.earth0 - 0.2)) / 1.0)) * (1 - smooth(cl01((t - DT.earth1) / 0.6)));
        const lift = smooth(cl01((t - (DT.earth1 + 0.4)) / 0.8));
        b2.visible = out && lift < 0.98;
        b2.position.set(spot.x - 0.07, spot.y + 0.46 + 0.6 * lift, spot.z + 0.09);
        b2.rotation.set(0, Math.PI / 4, 0); b2.rotateOnAxis(_dt.set(1, 0, 0), -1.25 * tilt);
        const eflow = out && t > DT.earth0 && t < DT.earth1 ? Math.min(1, (t - DT.earth0) * 3) * Math.min(1, (DT.earth1 - t) * 2) : 0;
        if (out && eflow > 0.02) {
          b2.updateMatrix();
          let lo = null;
          for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; _dt.set(Math.cos(a) * 0.098, 0.082, Math.sin(a) * 0.098).applyMatrix4(b2.matrix); if (!lo || _dt.y < lo.y) lo = _dt.clone(); }
          _dw.set(spot.x - lo.x, -0.3, spot.z - lo.z).normalize();
          const end = mStreamTo(lo, _dw, 0.5, spot.y + 0.004, 0.0035 * eflow + 0.0015);
          mLive.stream.visible = true; mLive.streamMat.opacity = 0.5 * eflow; mLive.streamMat.map.offset.y = -t * 3.2;
          mLive.drops.forEach((d, i) => { const ph = ((t * 1.9 + i * 0.137) % 1), a = i * 2.4;
            d.s.visible = true; d.s.position.set(end.x + Math.cos(a) * 0.05 * ph, end.y + 0.06 * Math.sin(Math.PI * ph), end.z + Math.sin(a) * 0.05 * ph);
            d.s.material.opacity = 0.9 * Math.sin(Math.PI * ph) * eflow; const s = 0.01 + 0.01 * Math.sin(Math.PI * ph); d.s.scale.set(s, s, 1); });
        } else if (out) { mLive.stream.visible = false; mLive.drops.forEach(d => { d.s.visible = false; }); }
        const wet = smooth(cl01((t - DT.earth0) / (DT.earth1 - DT.earth0)));
        mLive.wet.visible = out; mLive.wet.material.opacity = 0.7 * wet; mLive.wet.scale.setScalar(0.35 + 0.75 * wet);
        { const gk = smooth(cl01((t - (DT.lights - 0.5)) / 0.8)) * (1 - smooth(cl01((t - (DT.lights + 1.5)) / 1.6)));
          mLive.groundGlow.visible = out && gk > 0.01; mLive.groundGlow.material.opacity = 0.55 * gk; }
        // the three lights, each child's own colour, born on the wet earth and rising together into the dawn
        endLive.dLights.forEach((L, i) => {
          const mu = t - DT.lights - i * 0.35;
          L.m.visible = L.h.visible = out && mu > 0;
          if (!L.m.visible) return;
          const p = dLightAt(t, i, spot);
          L.m.position.set(p.x, p.y, p.z); L.h.position.copy(L.m.position);
          const born = cl01(mu / 1.0), fadeTop = 1 - cl01((t - (DT.home - 0.9)) / 0.9), pulse = 0.85 + 0.15 * Math.sin(mu * 5.2 + i);
          const dcam = Math.hypot(yaw.position.x - (MX + p.x), yaw.position.y - p.y, yaw.position.z - p.z);
          const sc = Math.max(0.04, dcam * 0.03) * (0.55 + 0.45 * born) * pulse; L.m.scale.set(sc, sc, 1); L.h.scale.set(sc * 9, sc * 9, 1);
          L.m.material.opacity = born * fadeTop; L.h.material.opacity = 0.6 * born * fadeTop * pulse;   // (CP8: by photograph, dots among the leaves)
        });
      }
    }

    /* (v22.3, L8-4: the stream was a new TubeGeometry every frame of both pours — new buffers on the GPU sixty times a
       second; it is ONE tube now, made once, its rings re-laid along the fall in place) */
    const ST_K = 28, ST_R = 6;
    const _qsP = new THREE.Vector3(), _qsT = new THREE.Vector3(), _qsN = new THREE.Vector3(), _qsB = new THREE.Vector3(), _qsZ = new THREE.Vector3(0, 0, 1), _qsX = new THREE.Vector3(1, 0, 0);
    function mStreamGeo() {
      if (mLive.streamGeo) return mLive.streamGeo;
      const n = ST_K * (ST_R + 1), g = new THREE.BufferGeometry(), uv = new Float32Array(n * 2), idx = [];
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3).setUsage(THREE.DynamicDrawUsage));
      g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(n * 3), 3).setUsage(THREE.DynamicDrawUsage));
      for (let i = 0; i < ST_K; i++) for (let j = 0; j <= ST_R; j++) { const k = i * (ST_R + 1) + j; uv[k * 2] = i / (ST_K - 1); uv[k * 2 + 1] = j / ST_R; }   // TubeGeometry's layout
      g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      for (let i = 0; i < ST_K - 1; i++) for (let j = 0; j < ST_R; j++) {
        const a = i * (ST_R + 1) + j, b = (i + 1) * (ST_R + 1) + j, c = (i + 1) * (ST_R + 1) + j + 1, d = i * (ST_R + 1) + j + 1;
        idx.push(a, b, d, b, c, d);
      }
      g.setIndex(idx);
      mLive.streamGeo = g; mLive.stream.geometry = g;
      return g;
    }
    function mStreamTo(p0, dir, speed, yEnd, radius) {           // a falling stream's tube, from p0 to the level yEnd (the pocket's own coordinates: the tube is its child)
      const pts = []; let x = p0.x, y = p0.y, z = p0.z, vx = dir.x * speed, vy = dir.y * speed, vz = dir.z * speed;
      for (let i = 0; i < 40 && y > yEnd; i++) { pts.push(new THREE.Vector3(x, y, z)); const h = 0.012; x += vx * h; y += vy * h; z += vz * h; vy -= 9.8 * h; }
      pts.push(new THREE.Vector3(x, Math.max(yEnd, y), z));
      if (pts.length < 2) pts.push(new THREE.Vector3(x, yEnd, z));
      // the fall's polyline, cut into ST_K rings evenly by length, each ring round the tangent there
      const g = mStreamGeo(), pos = g.attributes.position.array, nor = g.attributes.normal.array, L = [0];
      for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + pts[i].distanceTo(pts[i - 1]));
      const total = Math.max(1e-6, L[L.length - 1]);
      let seg = 0;
      for (let i = 0; i < ST_K; i++) {
        const sl = total * i / (ST_K - 1);
        while (seg < pts.length - 2 && L[seg + 1] < sl) seg++;
        const a = pts[seg], b = pts[Math.min(seg + 1, pts.length - 1)], f = cl01((sl - L[seg]) / Math.max(1e-6, L[seg + 1] - L[seg]));
        _qsP.lerpVectors(a, b, f); _qsT.subVectors(b, a); if (_qsT.lengthSq() < 1e-12) _qsT.set(0, -1, 0); _qsT.normalize();
        _qsN.crossVectors(_qsT, _qsZ); if (_qsN.lengthSq() < 1e-6) _qsN.crossVectors(_qsT, _qsX);
        _qsN.normalize(); _qsB.crossVectors(_qsT, _qsN);
        for (let j = 0; j <= ST_R; j++) {
          const th = j / ST_R * Math.PI * 2, c = Math.cos(th), sn = Math.sin(th), k = (i * (ST_R + 1) + j) * 3;
          const nx = c * _qsN.x + sn * _qsB.x, ny = c * _qsN.y + sn * _qsB.y, nz = c * _qsN.z + sn * _qsB.z;
          nor[k] = nx; nor[k + 1] = ny; nor[k + 2] = nz;
          pos[k] = _qsP.x + radius * nx; pos[k + 1] = _qsP.y + radius * ny; pos[k + 2] = _qsP.z + radius * nz;
        }
      }
      g.attributes.position.needsUpdate = true; g.attributes.normal.needsUpdate = true;
      return pts[pts.length - 1];
    }

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
      smokeFrame(now);
    }
    /* THE INCENSE'S SMOKE (V13): a thread from each lit stick's ember — soft billboards rising off the tip on wall time,
       swaying and spreading as they climb and thinning out — that LEANS toward him while a yield fills (smokeLean, from
       openFrame) and rises STRAIGHT when he keeps the door shut (smokeStill, ending D's payoff). Painted, never a light;
       drawn only over an ember that burns, so it rides the stick down as it burns and dies with the ember */
    const SMOKE_N = 14;                                      // (at 7 a thread read as a string of beads: by photograph)
    function smokeFrame(now) {
      if (!roomLive.smoke) {
        const tS = tex(makeWispT(THREE, cnv));             // (World M's cloud of puffs, at this size, was not seen at all: by photograph)
        roomLive.smoke = roomLive.embers.map(() => Array.from({ length: SMOKE_N }, (_, j) => {
          const m = new THREE.SpriteMaterial({ map: tS, color: 0xd6d0c8, transparent: true, opacity: 0, depthWrite: false, fog: false }); mats.push(m);
          const sp = new THREE.Sprite(m); sp.visible = false; worldR.add(sp); return { sp, ph: j / SMOKE_N };
        }));
      }
      const lean = roomLive.smokeLean || 0, still = roomLive.smokeStill || 0;
      roomLive.embers.forEach((em, i) => {
        /* (v24.2, L5-7: and not a thread the lens stands in — the little one's close-up kneels on his stick's line, 0.16–0.21
           m from it, and his thread ran up the middle of the frame through his face; his ember is under the frame there) */
        const on = em.visible && Math.hypot(em.position.x - yaw.position.x, em.position.z - yaw.position.z) > 0.30;
        for (const s of roomLive.smoke[i]) {
          if (!on) { s.sp.visible = false; continue; }
          const u = (now * 0.3 + s.ph + i * 0.37) % 1;            // its place up the thread (0 → 1 in a little over three seconds)
          /* a thin thread off the tip, curling and widening as it climbs (the sway and the width grow with the height) */
          const sway = (1 - 0.85 * still) * (0.003 + 0.034 * u * u) * Math.sin(now * 1.3 + i * 2.1 + u * 6.0);
          const ln = 0.24 * lean * u * u;                          // (toward the mat: −x, and across to its z)
          const ax = MAT.x - em.position.x, az = MAT.z - em.position.z, al = Math.hypot(ax, az) || 1;
          s.sp.position.set(em.position.x + ln * ax / al + 0.3 * sway, em.position.y + 0.004 + 0.36 * u, em.position.z + ln * az / al + sway);
          const sz = 0.014 + 0.095 * u * u * (1 - 0.45 * still);
          s.sp.scale.set(sz, Math.max(0.05, sz * 1.6), 1);         // (tall enough that each overlaps the next)
          s.sp.material.opacity = 0.5 * Math.min(1, u * 8) * Math.pow(1 - u, 1.3);
          s.sp.visible = true;
        }
      });
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
    let cntWall = 0;
    /* THE BEDS (CP11, §9.3): one mix for play and every film, eased on wall time from the world he is in and the hour the
       room's light says it is (the look a beat or a shot sets — so a film, a resume and an ending land on the same mix
       the light does). World S: the shop's air at the counter, the corridor after hours outside it (the opening film
       carries its own corridor); World R: the flat at night and its fan, 3 a.m. (DEEP, and from the aftermath on), the
       morning at the window (DAWN, MORNING — lower in the day's AFTERNOON and DRAINED), the night sinking under a
       possession's own light, the little one's water (BLUE, in his film); World M: the courtyard at first light (D).
       And the music under play: the offerings' khim (k5care) until the box is wound — the box's own tune is the lullaby
       and the two never play together — and the question's held tone (k5night) from the question to the last opening;
       both silent in every film, which has its own. Levels against the files' RMS (night -30, deep -34, dawn -26, water
       -24, the fan -26): the room near -40 dBFS, the water -28 */
    const bedMix = { air: 0, mall: 0, night: 0, fan: 0, deep: 0, dawn: 0, under: 0, care: 0, held: 0 };
    function mixBeds(wdt, st) {
      if (!(wdt > 0)) return;
      const w = worldOf(yaw.position.x), L = roomLive.lookName || 'NIGHT';
      const film = st === 'cine', card = st === 'result' || st === 'complete';
      const want = { air: 0, mall: 0, night: 0, fan: 0, deep: 0, dawn: 0, under: 0, care: 0, held: 0 };
      if (w === 'S') {
        const out = yaw.position.z > 0.15;
        if (fLive.shot !== 'O') { want.air = out ? 0.03 : 0.11; want.mall = out ? 0.3 : 0.12; }
      } else if (w === 'R') {
        /* (CP13: the little one's water holds through COME BACK too — its look is SURFACE, and the water went to 0 the
           moment the climb began, under the deepest blue) */
        const little = fLive.shot === 'little' && (L === 'BLUE' || L === 'SURFACE');
        /* (CP12, the endings: C's harsh small hours are ONLY THE FAN, the room emptied of its night; A's grey afternoon
           is the fan and the day bed, as the plan's A table has it (CP13); D's night is three in the morning, after the
           possessions, so it is the deep bed; and D's years and the home film's weeks — a day and a night every two
           seconds — hold one quiet morning under the music rather than flicker through five beds) */
        const years = (endLive.on === 'D' && /^y\d/.test(endLive.shot)) || (homeLive.on && wallNow() - (homeLive.weeksT || 0) < 0.3);
        const bare = film && L === 'HARSH';
        const day = L === 'DAWN' || L === 'MORNING', aft = L === 'AFTERNOON' || L === 'DRAINED';
        const deep = L === 'DEEP' || (L === 'BLUE' && !little) || (!film && (phase === 'after' || phase === 'decide'))
                  || (film && endLive.on === 'D' && L === 'NIGHT');
        const poss = L === 'RED' || L === 'AMBER' || L === 'SURFACE' || little;
        if (years) want.dawn = 0.18;
        else if (bare) { /* only the fan */ }
        else if (day) want.dawn = 0.32;
        else if (aft) want.dawn = 0.16;
        else if (deep) want.deep = 0.5;
        else want.night = poss ? (L === 'SURFACE' ? 0 : 0.08) : 0.3;
        want.under = little ? 0.6 : 0;
        if (roomLive.fan) want.fan = (bare || L === 'DRAINED' ? 0.15 : day || aft || years ? 0.06 : 0.1) * roomLive.fanK;
        if (!film && !card) {
          if (phase === 'care' || (phase === 'sit' && !(careLive.boxOpenTo >= 1))) want.care = 0.22;
          if (OPEN_I[phase] !== undefined) want.held = 0.2;
        }
      } else if (w === 'M') want.dawn = endLive.on === 'D' ? 0.26 : 0;
      for (const k in bedMix) {
        const tau = k === 'care' || k === 'held' ? 2.0 : 0.9;
        bedMix[k] += (want[k] - bedMix[k]) * (1 - Math.exp(-wdt / tau));
      }
      const B = DATA.ambience.beds;
      /* (CP13: and the room's sound sinks under a yield, by k — eased by openFrame, so the film that takes over finds it
         coming back rather than jumping) */
      const sink = w === 'R' ? openLive.sink : 1;
      B[0][1] = bedMix.air; B[1][1] = bedMix.mall; B[2][1] = bedMix.night * sink; B[3][1] = bedMix.fan * sink; B[3][3] = Math.max(0.4, roomLive.fanK);
      B[4][1] = bedMix.deep * sink; B[5][1] = bedMix.dawn; B[6][1] = bedMix.under; B[7][1] = bedMix.care; B[8][1] = bedMix.held * sink;
    }
    function updateNotes(dt, t) {
      const now = wallNow();
      roomFrame(now);
      /* the counter's motion — the owner's mixer, the things he sets down, the box — on WALL time and ABOVE the state's
         return, so his films draw them too (v5.19: the mixers above the cine return); the lean rides the chapter clock */
      const wdt = cntWall ? Math.min(0.5, now - cntWall) : 0; cntWall = now;
      peopleTick(wdt); setsTick(wdt); boxTick(wdt);
      /* (v24.2, L1-9: a film owns the camera — a play-time turn or lean still in flight when one starts is void, or its
         tween, on the chapter clock that stands still under a film, held the film's camera half-turned throughout) */
      if (getState() === 'cine') { cntLive.view = null; cntLive.lean = null; } else { viewTick(); leanTick(); }
      careFrame(wdt); openFrame(wdt);
      const st = getState();
      mixBeds(wdt, st);
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
      if (PHASES.indexOf(p) >= PHASES.indexOf('care')) return { w: 'R', at: p, tag: tag[1] || '' };
      return null;
    }
    function applyPhase(p) {
      const RA = resumeAt(p);
      if (RA) {
        careResume(RA.at === 'care' ? RA.tag : CARE_ORDER.slice(0, 8).join(','));
        if (RA.at === 'open3' && RA.tag === 'mat') seated = true;   // (v24.2, L1-8: seated before toWorld posts the order — no false COMPLETE as openResume sits him)
        toWorld(RA.w, true, RA.at, RA.at === 'care' || (RA.at === 'open3' && RA.tag === 'mat') ? RA.tag : undefined);   // (v24.2: open3's 'mat' kept)
        if (['open1', 'open2', 'open3', 'after', 'decide'].includes(RA.at)) openResume(RA.at, RA.tag);   // where the last possession left him (CP7)
        return;
      }
      const tag = String(p || '').split(':');
      /* a first arrival: his look down a little, so the owner's face and the three on the glass are both in the frame (by
         photograph: at the spawn's own pitch the three's feet were cut by the bottom edge) */
      /* (CP13, the save lens: the phase reads 'counter' with no receipts on a normal arrival, and the look was skipped —
         the bundle sat under the resting hand on a phone) */
      if (!p || p === 'counter') { yaw.rotation.y = DATA.spawn.rot; pitch.rotation.x = -0.22; }   // (on him: he speaks first; the cloth's opening turns the look to the three)
      counterResume(tag[0] === 'counter' ? tag[1] : '');          // the counter, as its receipts say (§10.1)
    }

    /* ---------------------------------------------------------- lifecycle */
    /* the room as build() leaves it, at 22:50 (the reset law: whatever a phase or a film moves, the next run finds where
       it began) — its clock, its fan, its door and drawer shut, the music box's lid down, no stick lit; the glows and the
       window are the NIGHT look's (reset() sets it). The printed Sak Yant stays: it is what he wears. */
    function roomReset() {
      roomClock('22:50');
      roomLive.fanK = 1;
      for (const k in bedMix) bedMix[k] = 0;           // (CP11: the beds start again from silence, the v8.1 law)
      if (roomLive.door) roomLive.door.rotation.y = 0;
      if (roomLive.drawer) roomLive.drawer.position.z = DESK_DRAWER_Z;
      if (roomLive.boxLid) roomLive.boxLid.rotation.x = 0;
      for (const em of roomLive.embers) em.visible = false;
    }
    /* the counter as build() leaves it (the reset law): the bundle wrapped on the glass, nothing else out, the box shut and
       silent, no beat said, no lean, no film's look */
    function counterReset() {
      cntDone.clear(); cntBusy = false; kidForce(1, null);
      cntLive.opened = false; cntLive.helloOn = false; cntLive.lean = null; cntLive.view = null; cntLive.ownerLook = 0;
      cntLive.lull = false; cntLive.boxOpen = cntLive.boxOpenTo = 0; cntLive.windT = 0;
      for (const S of cntLive.sets) setShow(S, false, true);
      setShow(cntLive.bundleSet, true, true);
      if (cntLive.box) { cntLive.box.lid.rotation.x = 0; cntLive.box.key.rotation.x = 0; cntLive.box.drum.rotation.x = 0; }
      for (const P of people) { P.talkUntil = 0; P.bkT = 0; P.bkU = P.nodU = null; }
      if (fLive.hands) { fLive.hands.visible = true; fLive.hands = null; }   // a film cut short by a reset gives his hands back too
      madeF.end(); cardF.end();                // (and its sets, its windows, its lens and its look)
    }
    function snap() { return { phase }; }
    function restore() {}
    function reset() {
      dropTodo(); speakReset(); lineQ.length = 0; heard.clear();
      booted = false; preplaced = ''; dayClock.t = 0; lastWall = 0;
      worldRun++; wDark = false; decOpen = false; seated = false;
      worldM.visible = false;
      roomReset();
      counterReset();
      careReset();
      openReset();
      endReset();                              // (whatever an ending touched, as build() left it: CP8)
      grocerAt(1); doorsTo(0);                 // (the corridor as play has it: the grocer's shut, the doors shut — CP9)
      for (const h of hotspots) { h.done = false; h.dwellT = 0; }
      if (kit) {
        kit.root(false); kit.pose('standing', { secs: 0.05 });
        if (kit.hold) kit.hold(null);
        if (kit.handPose) kit.handPose(null, 0, { secs: 0 });
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
      for (const g of treeStands) g && g.userData.disposeTrees?.();   // (CP5: before the sweep, or it walks into the shared kit — v6.15)
      treeStands.length = 0;
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

    /* THE ENDINGS' THINGS, made now (CP13, the films lens — v14.15's law: they were built on first use, on screen, each
       texture painted and uploaded and each program compiled in the middle of a scene). Every one is built here, under
       the curtain, hidden; and a map an ending SWAPS in (the late dashboard, the calendar's pages, the laptop's thread,
       D's crossed months) is hung on a hidden scrap, so the curtain's warm uploads it with the rest */
    {
      const P = endProps(); cProps(); const D = dProps();
      dashLate(true); dashLate(false); calSwap('A'); calSwap('C'); calSwap(null); laptopPage(true); laptopPage(false);
      if (D.calPage && D.cals.length) { D.calPage.material.map = D.cals[0]; D.calPage.material.needsUpdate = true; }   // (its program with a map, from the start)
      for (const m of [P.dashL, P.calA, P.calC, P.page && P.page.t, ...(D.cals || [])]) {
        if (!m) continue;
        const hp = new THREE.Mesh(new THREE.PlaneGeometry(0.01, 0.01), B({ map: m }));
        hp.visible = false; hp.position.set(0, 1.5, 0); worldR.add(hp);
      }
    }

    return (S = {
      world, noteTex, blockers: blockers(),
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
      film: { SX, MX, ROOM, SHOP, RCNT, OWN, MAT, R_ARRIVE, S_SPAWN, worldM, SH },   // (SH: the shop's handles — its doors, the grocer's shutter — for probes, CP9)
      pileVia: { what: 'his room\'s mat (the home film carries him there)', x: MAT.x, z: MAT.z },
      arrivals: [{ what: 'his room (the home film puts him inside its door)', x: R_ARRIVE.x, z: R_ARRIVE.z },
                 { what: 'beside his desk (standing up from the chair puts him there, CP13)', x: STAND_UP.x, z: STAND_UP.z }],
      get phase() { return phase; },
      setPhase, applyPhase, after, dayClock, sayLine,
      look, presets: PRESETS, room: roomLive,                 // the room's looks (§10.2), for the films and for probes
      kids: () => kidLive.map(L => ({ key: L.K.key, ready: L.ready })),
      info: () => ({ phase, t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard], world: worldOf(yaw.position.x),
                     until: +speak.until.toFixed(2), pending: speak.pending ? speak.pending.name : null,
                     seated, decOpen, kids: kidLive.map(L => L.K.key + (L.ready ? '' : '?')),
                     counter: { step: cntStep(), done: cntTag(), busy: cntBusy, opened: cntLive.opened, lean: !!cntLive.lean,
                                owner: !!(cntLive.owner && cntLive.owner.ready) },
                     care: { step: careStep(), done: careTag(), busy: careBusy, carry: careLive.carry, seat: careLive.seat, foamed: careLive.foamed },
                     open: { busy: openLive.busy, kid: openLive.kid, k: +openLive.k.toFixed(2), came: littleLive.cameBack, slips: littleLive.slipN } }),
      counter: { solve: leanSolve, LEAN, BAG_HELD, sets: cntLive.sets, live: cntLive },   // the counter's handles (§4.0b), for probes
      careLab, careLive,                                       // PLAY I's held moments and its live state (CP6), for probes
      madeF, cardF, introF, homeF,                             // the counter's films' controllers (film M, film K), the opening film's and the home film's (CP9): every picture a function of their clock
      redF, shyF, littleF, W,                                  // the three possessions' controllers (CP7), and the words their events show
      endT: { begin: endBegin, frame: endFrame, yatha: endYatha, live: endLive, props: endProps, END },   // the endings' controller (CP8), and its clocks (for probes)
      redStampTo, redStampAuto, redStampEnd, shyGap, shyPeekEnd, comeOpts, comeBegin, comeDone, surfaceStart, surfaceFrame,
      openLive, doubles: { of: doubleOf, set: doubleSet, off: doublesOff }, cityOut,   // (for probes)
      ownerTalk: (secs) => personTalk(cntLive.owner, secs),    // a film's line from the owner rides his talking take
      ownerNod: () => { if (cntLive.owner) cntLive.owner.nodT = performance.now() / 1000; },   // and his nod (the opening's beckon, CP13)
      nightSet,
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
    day:   { sky: [[0, '#5a86b8'], [0.55, '#86aed4'], [1, '#b8d0e4']], lit: 0, stars: 0, strip: 0, deck: 0, ground: '#4a5048' },
    // and A's grey afternoons (CP8): an overcast sky, the facades flat
    grey:  { sky: [[0, '#8e949c'], [0.55, '#a6aab0'], [1, '#bec0c4']], lit: 0, stars: 0, strip: 0, deck: 0, ground: '#4a4c4c' }
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
  /* THE PEEK, from inside (CP7): his left hand over his eyes as he sees it — not the hand but the light through it. The
     rig's hands ten centimetres from the lens were two cut wrists and a wall of fingers (by photograph, on a phone), so
     the peek is drawn from the inside: deep warm dark at the outer side, the flesh thinner and redder toward the inner
     edge (u = 1), which glows and is soft. The right hand is the same, mirrored by its UVs. Never a hand drawn on a
     canvas: no outline, no finger, only dark and light (the v21.16 rule is about figures; this is a darkness that parts) */
  function makePeekT(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 256);
    x.clearRect(0, 0, 256, 256);
    /* row by row: the hand dark and warm out to its inner edge, the edge glowing where the light comes through the thin
       flesh of the fingers' sides, then feathered away — and that edge not a ruled line but four fingers' worth of soft
       scallops (by photograph: two gaps cut inside each hand read as a curtain's folds, so the hand has none now; the room
       is seen only where the hands part) */
    for (let y = 0; y < 256; y++) {
      const v = y / 255, bump = 0.035 * Math.abs(Math.sin(v * Math.PI * 4.0 + 0.4)) * (0.5 + 0.5 * v);
      const e = (0.86 + bump) * 256, f = 18;                     // where the edge is, and how soft
      const g = x.createLinearGradient(0, 0, e + f, 0);
      const k0 = Math.max(0, (e - 60) / (e + f)), k1 = Math.max(0, (e - 10) / (e + f)), k2 = e / (e + f);
      g.addColorStop(0, 'rgba(10,3,2,0.98)');
      g.addColorStop(k0, 'rgba(26,8,5,0.97)');
      g.addColorStop(k1, 'rgba(110,40,16,0.92)');
      g.addColorStop(k2, 'rgba(232,118,52,0.55)');
      g.addColorStop(1, 'rgba(255,150,70,0)');
      x.fillStyle = g; x.fillRect(0, y, e + f, 1);
    }
    const vv = x.createLinearGradient(0, 0, 0, 256);                // darker where the fingertips curl at the top and the heel below
    vv.addColorStop(0, 'rgba(0,0,0,0.45)'); vv.addColorStop(0.3, 'rgba(0,0,0,0)'); vv.addColorStop(0.8, 'rgba(0,0,0,0)'); vv.addColorStop(1, 'rgba(0,0,0,0.35)');
    x.globalCompositeOperation = 'source-atop'; x.fillStyle = vv; x.fillRect(0, 0, 256, 256); x.globalCompositeOperation = 'source-over';
    return done(THREE, c, false);
  }
  /* HIS PHONE'S SCREEN: upright, 9:19.5, one canvas redrawn only when its state moves. CP7's 'time' (the lock screen, the
     hour big) and 'dark' (off); A: 'missed' (Ma · 4 missed
     calls) and 'vm' (her voicemail playing). B: 'buzz' (the lock screen stacking), 'thread' (the replies scrolled by
     `n` rows), 'repost' (its banner over the thread, the share count `n`), 'member' (the old member's reply lit),
     'dm' (the stranger's message), 'delete' (the dialog), 'deleted', 'dark' */
  const B_REPLIES = ['bro do it again on live pls', 'YIN BABY GHOST confirm!!', 'which shop?? want the little one',
                     'just ordered one, coming tmr', 'fake lah', 'doing it tonight', 'where to buy the red one', 'post video or it didn\'t happen'];
  function makePhoneScreen(THREE, cnv) {
    const W = 288, H = 624, [c, x] = sized(cnv, W * 2, H * 2), t = done(THREE, c, false);   // (drawn at twice its layout: CP8 holds it close to the lens)
    let last = '';
    const bar = (clk) => { x.fillStyle = '#0c0e12'; x.fillRect(0, 0, W, 28); x.fillStyle = '#e8eaee'; x.font = 'bold 12px sans-serif'; x.textAlign = 'left'; x.fillText(clk, 16, 19); x.textAlign = 'right'; x.fillText('▮▮▮  82%', W - 14, 19); x.textAlign = 'left'; };
    function card(y, title, body, col = '#ffffff', tcol = '#1b2733') {      // (CP8: read from a phone's screen, so large)
      x.fillStyle = col; roundRect(12, y, W - 24, 94, 12); x.fill();
      x.fillStyle = tcol; x.font = 'bold 15px sans-serif'; x.fillText(title, 24, y + 26);
      x.fillStyle = '#2a3038'; x.font = '19px sans-serif'; pgText(x, body, 24, y + 54, W - 48, 22);
    }
    function roundRect(X, Y, w, h, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); }
    function thread(scroll) {
      x.fillStyle = '#f2f4f7'; x.fillRect(0, 28, W, H - 28);
      x.fillStyle = '#26303b'; x.fillRect(0, 28, W, 44); x.fillStyle = '#d9dfe6'; x.font = 'bold 13px sans-serif'; x.fillText('AMULET TALK', 16, 56);
      x.fillStyle = '#1b2733'; x.font = 'bold 16px sans-serif'; pgText(x, B_TITLE, 16, 98, W - 32, 20);
      x.fillStyle = '#c0281e'; x.font = 'bold 30px sans-serif'; x.fillText('207 replies', 16, 178);
      for (let k = 0; k < 3; k++) {
        const i = (k + (scroll | 0)) % B_REPLIES.length, y = 196 + k * 138;
        x.fillStyle = '#ffffff'; roundRect(10, y, W - 20, 126, 12); x.fill();
        x.fillStyle = '#8a94a0'; x.font = '15px sans-serif'; x.fillText(['kopi_kao', 'nightowl88', 'sg_amulets', 'jj.tan', 'ah_boy_77', 'mel.lim', 'xx_raven', 'deano'][i], 22, y + 26);
        x.fillStyle = '#20242c'; x.font = 'bold 22px sans-serif'; pgText(x, B_REPLIES[i], 22, y + 60, W - 44, 27);
      }
    }
    function draw(state, n = 0, clock = '02:47') {
      const key = state + ':' + (n | 0) + ':' + clock; if (key === last) return; last = key;
      x.setTransform(2, 0, 0, 2, 0, 0);
      x.textAlign = 'left'; x.textBaseline = 'alphabetic';
      x.fillStyle = '#0c0e12'; x.fillRect(0, 0, W, H);
      if (state === 'dark') { t.needsUpdate = true; return; }
      if (state === 'time') {                                  // the aftermath's hour (CP7): the lock screen, the time large
        const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1a2234'); g.addColorStop(1, '#0a0c14'); x.fillStyle = g; x.fillRect(0, 0, W, H);
        x.fillStyle = '#e8eaee'; x.font = 'bold 13px sans-serif'; x.textAlign = 'right'; x.fillText('61%', W - 14, 21);
        x.textAlign = 'center'; x.font = '84px sans-serif'; x.fillText(clock, W / 2, 190);
        t.needsUpdate = true; return;
      }
      bar(clock);
      if (state === 'missed' || state === 'vm') {
        const g = x.createLinearGradient(0, 28, 0, H); g.addColorStop(0, '#1a2234'); g.addColorStop(1, '#0a0c14'); x.fillStyle = g; x.fillRect(0, 28, W, H - 28);
        x.fillStyle = '#e8eaee'; x.textAlign = 'center'; x.font = '64px sans-serif'; x.fillText(clock, W / 2, 132);
        x.font = '14px sans-serif'; x.fillText('Thursday', W / 2, 158); x.textAlign = 'left';
        card(190, 'PHONE', 'Ma  ·  4 missed calls', 'rgba(255,255,255,0.92)', '#c0281e');
        if (state === 'vm') {
          card(296, 'VOICEMAIL  ·  Ma', '▶ 0:03 ━━━━○─── 0:06', 'rgba(255,255,255,0.92)');   // (v24.2, L6-11: her 5.51 s message)
        }
        t.needsUpdate = true; return;
      }
      if (state === 'buzz') {
        const g = x.createLinearGradient(0, 28, 0, H); g.addColorStop(0, '#3a2e4a'); g.addColorStop(1, '#141018'); x.fillStyle = g; x.fillRect(0, 28, W, H - 28);
        x.fillStyle = '#e8eaee'; x.textAlign = 'center'; x.font = '64px sans-serif'; x.fillText('6:58', W / 2, 132); x.textAlign = 'left';
        card(176, 'AMULET TALK', (n | 0) + ' new replies on your thread', 'rgba(255,255,255,0.92)');
        card(280, 'AMULET TALK', 'Your thread is trending in Experiences', 'rgba(255,255,255,0.86)');
        card(384, 'AMULET TALK', '3 new messages', 'rgba(255,255,255,0.8)');
        t.needsUpdate = true; return;
      }
      thread(state === 'thread' ? n : 0);
      if (state === 'repost') {
        x.fillStyle = 'rgba(16,10,10,0.94)'; roundRect(10, 36, W - 20, 132, 12); x.fill();
        x.fillStyle = '#ff4a3a'; x.font = 'bold 13px sans-serif'; x.fillText('Shared to Horror Stories SG', 22, 60);
        x.fillStyle = '#ffffff'; x.font = 'bold 15px sans-serif'; pgText(x, 'REAL YIN BABY GHOST POSSESSION — SCARY!!', 22, 86, W - 44, 19);
        x.fillStyle = '#c8ccd2'; x.font = '12px sans-serif'; x.fillText('shared ' + (n | 0).toLocaleString('en-US') + ' times', 22, 150);
      } else if (state === 'member') {
        x.fillStyle = 'rgba(242,244,247,0.97)'; x.fillRect(0, 176, W, H - 176);
        x.fillStyle = '#fff8e6'; roundRect(12, 196, W - 24, 196, 12); x.fill(); x.strokeStyle = '#c9a24a'; x.lineWidth = 2; x.stroke();
        x.fillStyle = '#c9a24a'; x.beginPath(); x.arc(32, 220, 9, 0, Math.PI * 2); x.fill();
        x.fillStyle = '#8a6a1a'; x.font = 'bold 11px sans-serif'; x.fillText('an old member  ·  pinned "What is a Yin amulet?"', 48, 224);
        x.fillStyle = '#20242c'; x.font = '15px sans-serif';
        pgText(x, 'They\'re not a horror story, brother. They\'re children a monk gave a home to. Please take this down. Somebody will try it.', 24, 256, W - 48, 19);
      } else if (state === 'dm' || state === 'delete' || state === 'deleted') {
        if (state === 'dm') {
          x.fillStyle = 'rgba(16,20,28,0.96)'; roundRect(10, 36, W - 20, 176, 12); x.fill();
          x.fillStyle = '#8ab4ff'; x.font = 'bold 12px sans-serif'; x.fillText('MESSAGE  ·  a stranger', 22, 60);
          x.fillStyle = '#ffffff'; x.font = '15px sans-serif';
          pgText(x, 'I tried what you wrote. Last night, with my grandma\'s kumanthong. Now I can\'t stop shaking. What do I do?', 22, 88, W - 44, 19);
        } else if (state === 'delete') {
          x.fillStyle = 'rgba(0,0,0,0.55)'; x.fillRect(0, 28, W, H - 28);
          x.fillStyle = '#ffffff'; roundRect(24, 200, W - 48, 210, 14); x.fill();
          x.fillStyle = '#1b2733'; x.font = 'bold 17px sans-serif'; x.textAlign = 'center'; x.fillText('Delete thread?', W / 2, 236);
          x.fillStyle = '#56606b'; x.font = '13px sans-serif'; x.fillText('207 replies · shared 1,206 times', W / 2, 266); x.fillText('reposted 3 times', W / 2, 286);
          x.fillStyle = '#e3e7ec'; x.fillRect(24, 312, W - 48, 1);
          x.fillStyle = '#c0281e'; x.font = 'bold 16px sans-serif'; x.fillText('Delete', W / 2, 344);
          x.fillStyle = '#e3e7ec'; x.fillRect(24, 362, W - 48, 1);
          x.fillStyle = '#56606b'; x.font = '16px sans-serif'; x.fillText('Cancel', W / 2, 392); x.textAlign = 'left';
        } else {
          x.fillStyle = '#f2f4f7'; x.fillRect(0, 72, W, H - 72);
          x.fillStyle = '#56606b'; x.font = '15px sans-serif'; x.textAlign = 'center'; x.fillText('Thread deleted.', W / 2, 300); x.textAlign = 'left';
        }
      }
      t.needsUpdate = true;
    }
    draw('dark');
    return { t, draw, W, H };
  }
  /* THE LITTLE ONE'S FILM, ON THE LENS (CP7 — V10 the tears, V11 his hair at the frame's edge, V15 COME BACK's water):
     each a small painting, no figure in any of them. The blue the picture sinks into, clear in the middle and deep at the
     edges; a drop on the lens (a lens of its own: a dark rim above, a bright one below, a point of light) and the wet line
     it leaves; a lock of his hair, pale as his double; deep water lit from above; the light on water seen from under it
     (a net of bright lines that tiles); a bubble */
  function makeWashT(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 256);
    const g = x.createRadialGradient(128, 122, 26, 128, 128, 184);
    g.addColorStop(0, 'rgba(40,90,170,0)'); g.addColorStop(0.45, 'rgba(26,62,132,0.30)'); g.addColorStop(1, 'rgba(6,18,48,0.92)');
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    return done(THREE, c, false);
  }
  function makeDropT(THREE, cnv) {
    const [c, x] = sized(cnv, 64, 64);
    x.clearRect(0, 0, 64, 64);
    const body = x.createRadialGradient(32, 34, 4, 32, 32, 26);
    body.addColorStop(0, 'rgba(200,220,255,0.10)'); body.addColorStop(0.75, 'rgba(160,190,240,0.18)'); body.addColorStop(1, 'rgba(160,190,240,0)');
    x.fillStyle = body; x.beginPath(); x.arc(32, 32, 26, 0, Math.PI * 2); x.fill();
    x.lineWidth = 3; x.strokeStyle = 'rgba(10,20,40,0.38)'; x.beginPath(); x.arc(32, 32, 21, Math.PI * 1.05, Math.PI * 1.95); x.stroke();
    x.strokeStyle = 'rgba(235,245,255,0.58)'; x.beginPath(); x.arc(32, 32, 21, Math.PI * 0.15, Math.PI * 0.85); x.stroke();
    x.fillStyle = 'rgba(255,255,255,0.78)'; x.beginPath(); x.arc(25, 24, 3.2, 0, Math.PI * 2); x.fill();
    return done(THREE, c, false);
  }
  function makeTrailT(THREE, cnv) {
    const [c, x] = sized(cnv, 16, 128);
    const g = x.createLinearGradient(0, 0, 16, 0);
    g.addColorStop(0, 'rgba(180,205,245,0)'); g.addColorStop(0.5, 'rgba(205,222,250,0.32)'); g.addColorStop(1, 'rgba(180,205,245,0)');
    x.fillStyle = g; x.fillRect(0, 0, 16, 128);
    const v = x.createLinearGradient(0, 0, 0, 128); v.addColorStop(0, 'rgba(0,0,0,1)'); v.addColorStop(1, 'rgba(0,0,0,0)');
    x.globalCompositeOperation = 'destination-out'; x.fillStyle = v; x.fillRect(0, 0, 16, 128); x.globalCompositeOperation = 'source-over';
    return done(THREE, c, false);
  }
  function makeLockT(THREE, cnv) {
    const [c, x] = sized(cnv, 128, 512), r = rng(5251);
    x.clearRect(0, 0, 128, 512);
    for (let i = 0; i < 14; i++) {
      const x0 = 30 + r() * 68, a = 0.10 + r() * 0.22, w = 0.8 + r() * 1.6, ph = r() * 6, amp = 6 + r() * 12;
      x.strokeStyle = `rgba(190,215,255,${a.toFixed(3)})`; x.lineWidth = w; x.beginPath();
      for (let y = 0; y <= 512; y += 8) { const xx = x0 + amp * Math.sin(y / 70 + ph) * (y / 512); if (y) x.lineTo(xx, y); else x.moveTo(xx, y); }
      x.stroke();
    }
    return done(THREE, c, false);
  }
  function makeWaterT(THREE, cnv) {
    const [c, x] = sized(cnv, 8, 256);
    const g = x.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, '#2a6a8e'); g.addColorStop(0.25, '#123e5c'); g.addColorStop(0.6, '#08223a'); g.addColorStop(1, '#030c18');
    x.fillStyle = g; x.fillRect(0, 0, 8, 256);
    return done(THREE, c, false);
  }
  function makeCausticT(THREE, cnv) {
    const S = 128, [c, x] = sized(cnv, S, S), r = rng(5263), pts = [];
    for (let i = 0; i < 18; i++) pts.push([r() * S, r() * S]);
    const img = x.createImageData(S, S);
    for (let y = 0; y < S; y++) for (let xx = 0; xx < S; xx++) {
      let d1 = 1e9, d2 = 1e9;
      for (const [px, py] of pts) for (let oy = -S; oy <= S; oy += S) for (let ox = -S; ox <= S; ox += S) {
        const dx = xx - px - ox, dy = y - py - oy, d = dx * dx + dy * dy;
        if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
      }
      const v = Math.max(0, 1 - (Math.sqrt(d2) - Math.sqrt(d1)) / 6), o = (y * S + xx) * 4;
      img.data[o] = 150 * v; img.data[o + 1] = 210 * v; img.data[o + 2] = 255 * v; img.data[o + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    return done(THREE, c, true);
  }
  /* COME BACK's light from above, fading with depth: the caustics' alpha, full near the top of the frame and gone a
     sixth of the way up from its foot (their plane is 2.2 half-heights tall, so the frame is v 0.05–0.95 of it). By
     photograph, the caustics on a plane of their own ended in a hard line across the water; a linear map (no colour) */
  function makeDepthFadeT(THREE, cnv) {
    const [c, x] = sized(cnv, 4, 256), g = x.createLinearGradient(0, 256, 0, 0);
    g.addColorStop(0, '#000'); g.addColorStop(0.18, '#000'); g.addColorStop(0.85, '#fff'); g.addColorStop(1, '#fff');
    x.fillStyle = g; x.fillRect(0, 0, 4, 256);
    const t = done(THREE, c, false); t.colorSpace = THREE.NoColorSpace;
    return t;
  }
  /* a wisp of incense smoke: a soft upright puff, densest down its middle (V13) */
  function makeWispT(THREE, cnv) {
    const [c, x] = sized(cnv, 64, 128), r = rng(5279);
    x.clearRect(0, 0, 64, 128);
    for (let i = 0; i < 9; i++) {
      const px = 32 + (r() - 0.5) * 14, py = 64 + (r() - 0.5) * 60, R = 14 + r() * 14;
      const g = x.createRadialGradient(px, py, 0, px, py, R);
      g.addColorStop(0, 'rgba(255,255,255,0.34)'); g.addColorStop(0.55, 'rgba(255,255,255,0.12)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.fillRect(px - R, py - R, R * 2, R * 2);
    }
    return done(THREE, c, false);
  }
  /* ====================================================== THE ENDINGS' DRAWN SURFACES (CP8, §4.8)
     Drawn on canvases like every sheet in the room (CSP-safe, no download). The screens are drawn for a PHONE first
     (§4.8 B): a page is a narrow centre column, the phone is upright like a phone's own screen, at most five short
     lines in view at once. The forum is chapter 4's AMULET TALK — its page style copied (makeForumT, e3c4), never
     imported. Nobody on it is cruel (v21.30): the strangers are curious or scoffing, the old member is kind, the one
     who tried it is frightened. The words are world art (a card says what is written on it, v14.5). */
  function pgText(x, s, X, Y, W, lh) {                        // words wrapped into a width; answers the y after them (e3c4's oText)
    const ws = s.split(' '); let line = '', y = Y;
    for (const w of ws) {
      const t = line ? line + ' ' + w : w;
      if (x.measureText(t).width > W && line) { x.fillText(line, X, y); line = w; y += lh; } else line = t;
    }
    if (line) { x.fillText(line, X, y); y += lh; }
    return y;
  }
  function pgChrome(x, W, url) {                              // the browser's own strip (e3c4's oChrome)
    x.fillStyle = '#dfe3e8'; x.fillRect(0, 0, W, 44);
    x.fillStyle = '#ffffff'; x.fillRect(10, 6, 150, 18); x.fillStyle = '#5f6670'; x.font = '11px sans-serif'; x.textAlign = 'left';
    x.textBaseline = 'middle'; x.fillText(url.split('/')[0], 18, 15);
    x.fillStyle = '#f6f7f9'; x.fillRect(10, 27, W - 20, 14); x.fillStyle = '#4a515a'; x.font = '10px sans-serif'; x.fillText(url, 18, 34);
    for (const [cx, col] of [[W - 40, '#c8ccd2'], [W - 26, '#c8ccd2'], [W - 12, '#e25555']]) { x.fillStyle = col; x.beginPath(); x.arc(cx, 15, 4, 0, Math.PI * 2); x.fill(); }
    x.textBaseline = 'alphabetic';
  }
  const B_TITLE = 'I opened myself to my own kumanthong. All three. It\'s real.';
  const B_BODY = 'First the red one... I stood like him, I shouted like him... then the shy one, under my own desk... then the little one wouldn\'t let me go...';
  /* THE LAPTOP'S PAGE (B, and C's rival shop): one canvas redrawn when its state moves — `typed` characters of the title,
     then of the body; 'posted' is the board with his thread on top; 'rival' is a dashcam shop's page (C) */
  function makeLaptopPage(THREE, cnv) {
    const W = 512, H = 322, [c, x] = sized(cnv, W, H), t = done(THREE, c, false);
    let last = '';
    function draw(state, n) {
      const key = state + ':' + (n | 0); if (key === last) return; last = key;
      x.textAlign = 'left'; x.textBaseline = 'alphabetic';
      x.fillStyle = '#eef0f3'; x.fillRect(0, 0, W, H);
      if (state === 'rival') {
        pgChrome(x, W, 'dashking.sg/shop/4k-dashcam');
        x.fillStyle = '#10161f'; x.fillRect(0, 44, W, 30);
        x.fillStyle = '#f2b429'; x.font = 'bold 15px sans-serif'; x.fillText('DASHKING', 16, 64);
        x.fillStyle = '#ffffff'; x.fillRect(96, 84, 320, 228);
        x.fillStyle = '#1b2733'; x.font = 'bold 18px sans-serif'; x.fillText('4K Dashcam · Night Vision', 112, 112);
        x.fillStyle = '#c0281e'; x.font = 'bold 30px sans-serif'; x.fillText('$59', 112, 156);
        x.fillStyle = '#8a94a0'; x.font = '13px sans-serif'; x.fillText('was $89', 180, 156);
        x.fillStyle = '#2a8a4a'; x.font = 'bold 22px sans-serif'; x.fillText('2,000 sold', 112, 204);
        x.fillStyle = '#f2b429'; x.font = '16px sans-serif'; x.fillText('★★★★★  (1,412)', 112, 236);
        x.fillStyle = '#20242c'; x.fillRect(112, 262, 140, 34); x.fillStyle = '#fff'; x.font = 'bold 14px sans-serif'; x.fillText('ADD TO CART', 132, 284);
        t.needsUpdate = true; return;
      }
      pgChrome(x, W, state === 'posted' ? 'amulet-talk/experiences' : 'amulet-talk/experiences/new');
      x.fillStyle = '#26303b'; x.fillRect(0, 44, W, 22);
      x.fillStyle = '#d9dfe6'; x.font = '11px sans-serif';
      x.fillText(state === 'posted' ? 'AMULET TALK   ›   Experiences' : 'AMULET TALK   ›   Experiences   ›   NEW THREAD', 14, 59);
      x.fillStyle = '#ffffff'; x.fillRect(96, 72, 320, H - 80);                // (a narrow centre column: a phone's crop holds it)
      if (state === 'posted') {
        x.fillStyle = '#1b2733'; x.font = 'bold 14px sans-serif'; pgText(x, B_TITLE, 108, 96, 296, 17);
        x.fillStyle = '#2a8a4a'; x.font = '11px sans-serif'; x.fillText('just now  ·  0 replies', 108, 140);
        x.fillStyle = '#e3e7ec'; x.fillRect(108, 150, 296, 1);
        x.fillStyle = '#56606b'; x.font = '12px sans-serif';
        [['My Phra Ngan and the dreams', '3 replies'], ['Lost my Luang Pu Thuad, found it in the car', '12 replies'],
         ['Is it normal to feel warm when you wear it?', '41 replies']].forEach(([a, b], k) => {
          x.fillText(a, 108, 176 + k * 40); x.fillStyle = '#8a94a0'; x.font = '10px sans-serif'; x.fillText(b, 108, 191 + k * 40);
          x.fillStyle = '#56606b'; x.font = '12px sans-serif';
        });
        t.needsUpdate = true; return;
      }
      const nT = Math.min(B_TITLE.length, n | 0), nB = Math.max(0, (n | 0) - B_TITLE.length);
      x.fillStyle = '#8a94a0'; x.font = '10px sans-serif'; x.fillText('TITLE', 108, 90);
      x.fillStyle = '#f6f7f9'; x.fillRect(106, 96, 300, 44); x.strokeStyle = '#c9d0d8'; x.strokeRect(106, 96, 300, 44);
      x.fillStyle = '#1b2733'; x.font = 'bold 14px sans-serif';
      let y = pgText(x, B_TITLE.slice(0, nT) + (nB === 0 ? '|' : ''), 112, 114, 288, 17);
      x.fillStyle = '#8a94a0'; x.font = '10px sans-serif'; x.fillText('YOUR STORY', 108, 158);
      x.fillStyle = '#f6f7f9'; x.fillRect(106, 164, 300, 104); x.strokeStyle = '#c9d0d8'; x.strokeRect(106, 164, 300, 104);
      x.fillStyle = '#2b2f36'; x.font = '13px sans-serif';
      if (nT >= B_TITLE.length) pgText(x, B_BODY.slice(0, nB) + '|', 112, 182, 288, 16);
      x.fillStyle = '#26303b'; x.fillRect(334, 278, 70, 26); x.fillStyle = '#ffffff'; x.font = 'bold 12px sans-serif'; x.fillText('POST', 352, 296);
      void y;
      t.needsUpdate = true;
    }
    draw('new', 0);
    return { t, draw, LEN: B_TITLE.length + B_BODY.length };
  }
  /* A · his own note on the top carton: SHIP TODAY!, TODAY crossed out and TOMORROW written under it, crossed out, and
     TOMORROW again — in his hand (a felt pen on a yellow square) */
  function makeStickyT(THREE, cnv) {
    const [c, x] = sized(cnv, 200, 200);
    x.fillStyle = '#f6e27a'; x.fillRect(0, 0, 200, 200);
    x.fillStyle = 'rgba(160,130,30,0.25)'; x.fillRect(0, 0, 200, 14);
    x.fillStyle = '#1a1e2a'; x.font = 'bold 30px "Comic Sans MS", cursive, sans-serif'; x.textAlign = 'left'; x.textBaseline = 'middle';
    x.fillText('SHIP', 18, 44);
    x.fillText('TODAY!', 18, 82);
    x.font = 'bold 22px "Comic Sans MS", cursive, sans-serif'; x.fillText('TOMORROW', 30, 122); x.fillText('TOMORROW', 30, 162);
    x.strokeStyle = '#1a1e2a'; x.lineWidth = 4;
    for (const [x0, y0, x1] of [[16, 82, 126], [28, 122, 160]]) { x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y0 - 3); x.stroke(); }
    return done(THREE, c, false);
  }
  /* C · a wish slip, folded once, in his own hand: ORDERS, MONEY or LUCK */
  /* a toy in its packet (ending C's bribes, CP8): the card's front — a hang slot at the top, a NEW! burst, a clear window
     with the toy drawn in it (a car, a robot, a duck, a plane), a band along the foot. The colour is the card's own */
  function makeToyT(THREE, cnv, kind, col) {
    const [c, x] = sized(cnv, 140, 200), hex = '#' + col.toString(16).padStart(6, '0');
    x.fillStyle = hex; x.fillRect(0, 0, 140, 200);
    x.fillStyle = 'rgba(255,255,255,0.18)'; x.fillRect(0, 0, 140, 34);
    x.fillStyle = '#1a1a1e'; x.beginPath(); x.ellipse(70, 15, 13, 5, 0, 0, Math.PI * 2); x.fill();                      // the hang slot
    x.fillStyle = '#ffe23a'; x.beginPath();
    for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, rr = i % 2 ? 11 : 19; x.lineTo(112 + Math.cos(a) * rr, 46 + Math.sin(a) * rr); }
    x.closePath(); x.fill(); x.fillStyle = '#c8241c'; x.font = 'bold 10px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('NEW!', 112, 46);
    x.fillStyle = '#eef6fb'; x.beginPath(); x.roundRect ? x.roundRect(18, 58, 104, 104, 14) : x.rect(18, 58, 104, 104); x.fill();   // the window
    x.save(); x.translate(70, 112);
    if (kind === 'car') {
      x.fillStyle = '#d8241c'; x.fillRect(-36, -8, 72, 22); x.fillRect(-20, -24, 40, 18);
      x.fillStyle = '#9ad0f0'; x.fillRect(-15, -20, 13, 12); x.fillRect(2, -20, 13, 12);
      x.fillStyle = '#1a1a1e'; for (const wx of [-22, 22]) { x.beginPath(); x.arc(wx, 15, 9, 0, Math.PI * 2); x.fill(); }
    } else if (kind === 'robot') {
      x.fillStyle = '#7a8a9a'; x.fillRect(-18, -34, 36, 26); x.fillRect(-24, -6, 48, 34); x.fillRect(-34, -2, 10, 24); x.fillRect(24, -2, 10, 24);
      x.fillStyle = '#ffd23a'; x.beginPath(); x.arc(-8, -22, 4, 0, Math.PI * 2); x.arc(8, -22, 4, 0, Math.PI * 2); x.fill();
      x.strokeStyle = '#7a8a9a'; x.lineWidth = 3; x.beginPath(); x.moveTo(0, -34); x.lineTo(0, -44); x.stroke();
    } else if (kind === 'duck') {
      x.fillStyle = '#ffd23a'; x.beginPath(); x.ellipse(4, 10, 32, 22, 0, 0, Math.PI * 2); x.fill(); x.beginPath(); x.arc(-18, -16, 16, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#f08a1a'; x.beginPath(); x.moveTo(-34, -16); x.lineTo(-46, -12); x.lineTo(-34, -8); x.fill();
      x.fillStyle = '#1a1a1e'; x.beginPath(); x.arc(-22, -20, 3, 0, Math.PI * 2); x.fill();
    } else {
      x.fillStyle = '#e8eef4'; x.beginPath(); x.ellipse(0, 0, 40, 9, 0, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#3a7ad8'; x.beginPath(); x.moveTo(-6, -2); x.lineTo(10, -34); x.lineTo(18, -34); x.lineTo(10, -2); x.fill();
      x.beginPath(); x.moveTo(-6, 2); x.lineTo(10, 34); x.lineTo(18, 34); x.lineTo(10, 2); x.fill();
      x.beginPath(); x.moveTo(-36, -2); x.lineTo(-40, -16); x.lineTo(-32, -16); x.lineTo(-28, -2); x.fill();
    }
    x.restore();
    x.fillStyle = 'rgba(0,0,0,0.22)'; x.fillRect(0, 172, 140, 28);
    x.fillStyle = '#ffffff'; x.font = 'bold 13px sans-serif'; x.textAlign = 'center'; x.fillText('AGES 3+', 70, 186);
    return done(THREE, c, false);
  }
  /* a tile of bubble wrap (the roll by his cartons): rows of round bubbles, each with its highlight, about a centimetre */
  function makeWrapT(THREE, cnv) {
    const [c, x] = sized(cnv, 128, 128);
    x.fillStyle = '#c8d4dc'; x.fillRect(0, 0, 128, 128);
    for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) {
      const cx = 16 + i * 32 + (j % 2) * 16 - (j % 2 && i === 3 ? 128 : 0), cy = 16 + j * 32;
      for (const ox of [0, 128]) {
        const g = x.createRadialGradient(cx + ox - 4, cy - 4, 1, cx + ox, cy, 13);
        g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, '#eef4f8'); g.addColorStop(1, '#a8b8c4');
        x.fillStyle = g; x.beginPath(); x.arc(cx + ox, cy, 12, 0, Math.PI * 2); x.fill();
      }
    }
    return done(THREE, c, true);
  }
  function makeWishT(THREE, cnv, word) {
    const [c, x] = sized(cnv, 160, 96), r = rng(7001 + word.length * 31);
    x.fillStyle = '#fbf8ef'; x.fillRect(0, 0, 160, 96);
    x.fillStyle = 'rgba(120,110,90,0.18)'; x.fillRect(78, 0, 4, 96);           // the fold
    x.fillStyle = '#22263a'; x.font = 'bold 26px "Comic Sans MS", cursive, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.save(); x.translate(80, 50); x.rotate((r() - 0.5) * 0.12); x.fillText(word, 0, 0); x.restore();
    return done(THREE, c, false);
  }
  /* THE ENVELOPE (V29, ending D): in his own capitals, like the owner's — FOR WHOEVER LOOKS AFTER THEM NEXT — written a
     letter at a time as his pen goes along it (`draw(n)`: the first n letters), and `tipAt(n)`, where the pen's tip is
     then, in the envelope's own frame (u across from its left, v down from its top, both 0–1). The canvas is redrawn
     only when n changes, a few times a second, small (320 × 200) */
  function makeHeirEnvelopeT(THREE, cnv) {
    const W = 320, H = 200, [c, x] = sized(cnv, W, H), r = rng(5303);
    const LINES = ['FOR WHOEVER LOOKS', 'AFTER THEM NEXT'], Y = [126, 158];
    x.font = 'bold 21px sans-serif';
    const pos = [];                                            // each letter's [x of its end, line]
    LINES.forEach((L, li) => { const w = x.measureText(L).width, x0 = W / 2 - w / 2;
      for (let i = 1; i <= L.length; i++) pos.push([x0 + x.measureText(L.slice(0, i)).width, li]); });
    const jit = pos.map(() => [(r() - 0.5) * 1.6, (r() - 0.5) * 1.6, (r() - 0.5) * 0.05]);
    const t = done(THREE, c, false);
    let shown = -1;
    function draw(n) {
      n = Math.max(0, Math.min(pos.length, n | 0));
      if (n === shown) return; shown = n;
      x.fillStyle = '#efe6d2'; x.fillRect(0, 0, W, H);
      x.strokeStyle = 'rgba(120,100,70,0.35)'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, 0); x.lineTo(160, 96); x.lineTo(320, 0); x.stroke();
      x.fillStyle = '#1e2230'; x.font = 'bold 21px sans-serif'; x.textAlign = 'left'; x.textBaseline = 'middle';
      let k = 0;
      LINES.forEach((L, li) => { const w = x.measureText(L).width, x0 = W / 2 - w / 2;
        for (let i = 0; i < L.length; i++, k++) { if (k >= n) return;
          const cx = x0 + x.measureText(L.slice(0, i)).width, [jx, jy, jr] = jit[k];
          x.save(); x.translate(cx + jx, Y[li] + jy); x.rotate(jr); x.fillText(L[i], 0, 0); x.restore(); } });
      t.needsUpdate = true;
    }
    function tipAt(n) {
      const i = Math.max(0, Math.min(pos.length - 1, (n | 0) - 1)), p = pos[i];
      return { u: (n > 0 ? p[0] : W / 2 - 80) / W, v: Y[n > 0 ? p[1] : 0] / H };
    }
    draw(pos.length);
    return { t, draw, tipAt, LEN: pos.length };
  }
  /* THE ENDINGS' DUST (A): a fine grey film, uneven, for a carton's top and a runner nobody has wiped in weeks */
  function makeDustT(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 256), r = rng(7013);
    x.clearRect(0, 0, 256, 256);
    const g = x.createRadialGradient(128, 128, 30, 128, 128, 160); g.addColorStop(0, 'rgba(150,146,138,0.20)'); g.addColorStop(1, 'rgba(150,146,138,0.05)');
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 2600; i++) { const a = 0.05 + r() * 0.14, s = 1 + r() * 2.2; x.fillStyle = `rgba(160,156,148,${a.toFixed(3)})`; x.fillRect(r() * 256, r() * 256, s, s); }
    return done(THREE, c, false);
  }
  /* A BLOOM FROM THE EDGES OF SIGHT (V2): clear in the middle, white at the edges — its colour the material's (the child's
     own), added over the picture, so it is a light coming in, never a wall */
  function makeBloomT(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 256);
    const g = x.createRadialGradient(128, 128, 36, 128, 128, 186);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.18)'); g.addColorStop(1, 'rgba(255,255,255,0.9)');
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    return done(THREE, c, false);
  }
  function makeBubbleT(THREE, cnv) {
    const [c, x] = sized(cnv, 32, 32); x.clearRect(0, 0, 32, 32);
    x.lineWidth = 2; x.strokeStyle = 'rgba(200,230,255,0.7)'; x.beginPath(); x.arc(16, 16, 11, 0, Math.PI * 2); x.stroke();
    x.fillStyle = 'rgba(255,255,255,0.8)'; x.beginPath(); x.arc(12, 11, 2.2, 0, Math.PI * 2); x.fill();
    return done(THREE, c, false);
  }
  /* the windows the night has lit and 'late' has not — the very loop of makeWindowT (the same seed, so the same windows),
     each in its lit colour as it reads over the facade, with the moment it goes out (a seeded order) in its alpha: the
     little one's hours (cityOut) */
  function makeWindowLitT(THREE, cnv) {
    const N = WIN_STATES.night, Lt = WIN_STATES.late, [c, x] = sized(cnv, 1024, 640), r = rng(5149), rt = rng(5197);
    x.clearRect(0, 0, 1024, 640);
    for (const [x0, w, top] of [[40, 300, 120], [400, 260, 170], [700, 300, 90]]) {
      const floors = Math.floor((600 - top) / 26);
      for (let f = 0; f < floors; f++) {
        const y = top + 12 + f * 26;
        for (let u = 0; u < Math.floor((w - 20) / 22); u++) {
          const roll = r(), warm = r() < 0.5, xx = x0 + 10 + u * 22;
          if (roll < N.lit && roll >= Lt.lit) {
            const a = 0.2 + 0.8 * (0.02 + 0.96 * rt());
            x.fillStyle = warm ? `rgba(219,185,123,${a.toFixed(3)})` : `rgba(152,167,187,${a.toFixed(3)})`;
            x.fillRect(xx, y, 14, 11);
          }
        }
      }
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
  /* ======================================================== WORLD M's SURFACES (CP5)
     Chapter 4's temple's drawn sheets, copied by their own code with the helpers they use (its World Y's yRng, yDone,
     ySized and yBlob, and its painted flame, smoke and glow) — a chapter imports nothing. */
  function yRng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function yDone(THREE, c, rep) {
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
    return t;
  }
  function ySized(cnv, W, H) { const [c, x] = cnv(W); c.height = H; return [c, x]; }
  /* a blob drawn nine times, so a stain that crosses an edge comes back on the far side (a tile that wraps) */
  function yBlob(x, S, px, py, rad, col) {
    for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) {
      const cx = px + ox, cy = py + oy;
      if (cx + rad < 0 || cy + rad < 0 || cx - rad > S || cy - rad > S) continue;
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, rad); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g; x.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
    }
  }
  function makeYinFlame(THREE, cnv) {
    const [c, x] = ySized(cnv, 64, 128);
    x.clearRect(0, 0, 64, 128);
    x.save(); x.translate(32, 92); x.scale(1, 2.6);
    const g = x.createRadialGradient(0, 0, 0, 0, 0, 30); g.addColorStop(0, 'rgba(255,255,240,1)'); g.addColorStop(0.25, 'rgba(255,226,140,0.95)'); g.addColorStop(0.55, 'rgba(255,140,40,0.55)'); g.addColorStop(1, 'rgba(255,90,10,0)');
    x.fillStyle = g; x.beginPath(); x.arc(0, 0, 30, 0, Math.PI * 2); x.fill(); x.restore();
    const b = x.createRadialGradient(32, 110, 0, 32, 110, 10); b.addColorStop(0, 'rgba(120,150,255,0.6)'); b.addColorStop(1, 'rgba(120,150,255,0)');
    x.fillStyle = b; x.fillRect(16, 96, 32, 30);
    return yDone(THREE, c, false);
  }
  /* a soft curl of smoke */
  function makeYinSmoke(THREE, cnv) {
    const S = 128, [c, x] = cnv(S), r = yRng(89);
    x.clearRect(0, 0, S, S);
    for (let i = 0; i < 14; i++) { const px = 64 + (r() - 0.5) * 40, py = 64 + (r() - 0.5) * 50, R = 14 + r() * 20; const g = x.createRadialGradient(px, py, 0, px, py, R); g.addColorStop(0, 'rgba(255,255,255,0.18)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(px - R, py - R, R * 2, R * 2); }
    return yDone(THREE, c, false);
  }
  /* painted light: a soft round glow, white (each plane's colour tints it) */
  function makeYinGlow(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,0.5)'); g.addColorStop(0.65, 'rgba(255,255,255,0.12)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return yDone(THREE, c, false);
  }
  function makeMSky(THREE, cnv) {
    const W = 2048, H = 1024, [c, x] = ySized(cnv, W, H), r = yRng(211);
    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0.00, '#131a38'); g.addColorStop(0.16, '#232c5a'); g.addColorStop(0.28, '#433f74'); g.addColorStop(0.36, '#7a5a80');
    g.addColorStop(0.42, '#b86e7c'); g.addColorStop(0.465, '#e48c6a'); g.addColorStop(0.495, '#f4ad74'); g.addColorStop(0.50, '#e89a6a');
    g.addColorStop(0.53, '#6e4a46'); g.addColorStop(0.62, '#33262a'); g.addColorStop(1.0, '#171214');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    const SU = 0.857 * W, SV = (90 - 5) / 180 * H;
    // the sun's half of the sky warmer and brighter, the far half cooler: soft washes drawn twice across the seam
    const wash = (cx, cy, rx, ry, col) => { for (const ox of [-W, 0, W]) { x.save(); x.translate(cx + ox, cy); x.scale(1, ry / rx);
      const rg = x.createRadialGradient(0, 0, 0, 0, 0, rx); rg.addColorStop(0, col); rg.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = rg; x.fillRect(-rx, -rx, rx * 2, rx * 2); x.restore(); } };
    wash(SU, SV, W * 0.42, H * 0.30, 'rgba(255,170,90,0.55)');
    wash(SU, SV, W * 0.16, H * 0.12, 'rgba(255,214,150,0.75)');
    wash(SU - W / 2, H * 0.40, W * 0.40, H * 0.22, 'rgba(70,72,130,0.45)');
    // long clouds in the band above the horizon, each lit from below by the sun's distance round the sky
    for (let i = 0; i < 70; i++) {
      const cy = H * (0.30 + r() * 0.17), cx = r() * W, len = W * (0.05 + r() * 0.16), th = 4 + r() * 11;
      let du = Math.abs(cx - SU); du = Math.min(du, W - du) / (W / 2);               // 0 at the sun, 1 opposite
      const near = Math.max(0, 1 - du * 1.6), lift = (cy - H * 0.30) / (H * 0.17);
      const body = `rgba(${Math.round(70 + 60 * near)},${Math.round(52 + 30 * near)},${Math.round(78 - 10 * near)},${0.45 + 0.3 * r()})`;
      const lit = `rgba(255,${Math.round(150 + 70 * near)},${Math.round(110 + 40 * near)},${(0.25 + 0.55 * near) * (0.6 + 0.4 * lift)})`;
      for (const ox of [-W, 0, W]) {
        x.fillStyle = body; x.beginPath(); x.ellipse(cx + ox, cy, len / 2, th, 0, 0, Math.PI * 2); x.fill();
        x.fillStyle = lit; x.beginPath(); x.ellipse(cx + ox, cy + th * 0.55, len / 2 * 0.92, th * 0.42, 0, 0, Math.PI * 2); x.fill();
      }
    }
    // the sun itself, just over the line, and its bloom
    const sg = x.createRadialGradient(SU, SV, 0, SU, SV, 60); sg.addColorStop(0, 'rgba(255,248,226,1)'); sg.addColorStop(0.12, 'rgba(255,236,190,1)'); sg.addColorStop(0.35, 'rgba(255,190,120,0.5)'); sg.addColorStop(1, 'rgba(255,160,90,0)');
    x.fillStyle = sg; x.fillRect(SU - 60, SV - 60, 120, 120);
    // the first stars on the far, dark side
    for (let i = 0; i < 120; i++) { const sx = (SU - W / 2 + (r() - 0.5) * W * 0.7 + W) % W, sy = r() * H * 0.24;
      x.fillStyle = `rgba(255,255,255,${0.2 + r() * 0.5})`; x.fillRect(sx, sy, 1.4, 1.4); }
    return yDone(THREE, c, false);
  }
  function makeMSlabs(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = yRng(223);
    x.fillStyle = '#5e5a54'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const v = 150 + r() * 26; x.fillStyle = `rgb(${v},${v - 6},${v - 14})`; x.fillRect(i * 128 + 2, j * 128 + 2, 124, 124); }
    for (let k = 0; k < 40; k++) yBlob(x, S, r() * S, r() * S, 6 + r() * 22, `rgba(${r() < 0.5 ? '70,62,52' : '210,204,190'},${0.05 + r() * 0.08})`);
    return yDone(THREE, c, true);
  }
  function makeMPlaster(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = yRng(227);
    x.fillStyle = '#ece6da'; x.fillRect(0, 0, S, S);
    for (let k = 0; k < 60; k++) yBlob(x, S, r() * S, r() * S, 8 + r() * 30, `rgba(${r() < 0.6 ? '200,188,170' : '255,252,246'},${0.06 + r() * 0.08})`);
    return yDone(THREE, c, true);
  }
  function makeMFloor(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = yRng(229);
    x.fillStyle = '#d8ccb8'; x.fillRect(0, 0, S, S);
    for (let k = 0; k < 30; k++) yBlob(x, S, r() * S, r() * S, 10 + r() * 34, `rgba(${r() < 0.5 ? '186,170,148' : '236,228,214'},${0.12 + r() * 0.12})`);
    x.strokeStyle = 'rgba(150,132,110,0.35)'; x.lineWidth = 1;
    for (let k = 0; k < 9; k++) { x.beginPath(); let px = r() * S, py = r() * S; x.moveTo(px, py); for (let s = 0; s < 6; s++) { px += (r() - 0.3) * 40; py += (r() - 0.5) * 30; x.lineTo(px, py); } x.stroke(); }
    x.fillStyle = 'rgba(110,92,72,0.55)'; x.fillRect(0, 0, S, 2); x.fillRect(0, 0, 2, S);
    return yDone(THREE, c, true);
  }
  function makeMTiles(THREE, cnv, a, b) {
    const S = 256, [c, x] = cnv(S);
    x.fillStyle = a; x.fillRect(0, 0, S, S);
    x.translate(S, 0); x.rotate(Math.PI / 2);
    for (let row = 0; row < 8; row++) for (let i = 0; i < 8; i++) {
      const ox = (row % 2) * 16;
      x.fillStyle = b; x.beginPath(); x.arc(i * 32 + ox, row * 32 + 30, 16, 0, Math.PI); x.fill();
      x.fillStyle = 'rgba(255,255,255,0.07)'; x.fillRect(i * 32 + ox - 14, row * 32 + 4, 28, 6);
    }
    return yDone(THREE, c, true);
  }
  function makeMEarth(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = yRng(233);
    x.fillStyle = '#4a3624'; x.fillRect(0, 0, S, S);
    for (let k = 0; k < 90; k++) yBlob(x, S, r() * S, r() * S, 4 + r() * 18, `rgba(${r() < 0.5 ? '30,20,12' : '110,86,60'},${0.12 + r() * 0.18})`);
    for (let k = 0; k < 160; k++) { x.fillStyle = `rgba(${150 + r() * 60},${130 + r() * 50},${100 + r() * 40},${0.3 + r() * 0.4})`; x.fillRect(r() * S, r() * S, 1 + r() * 2, 1 + r() * 2); }
    // fallen leaves on the earth
    for (let k = 0; k < 14; k++) { x.save(); x.translate(r() * S, r() * S); x.rotate(r() * 6); x.fillStyle = `rgba(${120 + r() * 60},${80 + r() * 40},${30},0.7)`;
      x.beginPath(); x.ellipse(0, 0, 9, 4, 0, 0, Math.PI * 2); x.fill(); x.restore(); }
    return yDone(THREE, c, true);
  }
  function makeMGrass(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = yRng(239);
    x.fillStyle = '#4e5c34'; x.fillRect(0, 0, S, S);
    for (let k = 0; k < 120; k++) yBlob(x, S, r() * S, r() * S, 6 + r() * 26, `rgba(${r() < 0.5 ? '64,80,40' : '96,104,58'},${0.15 + r() * 0.2})`);
    return yDone(THREE, c, true);
  }
  /* a window from inside at sunset: the sky going from gold to rose behind a lattice, a branch across it */
  function makeMWindow(THREE, cnv) {
    const [c, x] = ySized(cnv, 128, 212), r = yRng(241);
    const g = x.createLinearGradient(0, 0, 0, 212); g.addColorStop(0, '#d8869a'); g.addColorStop(0.55, '#ffb878'); g.addColorStop(1, '#ffd8a0');
    x.fillStyle = g; x.fillRect(0, 0, 128, 212);
    x.strokeStyle = 'rgba(40,24,20,0.85)'; x.lineWidth = 3;
    x.beginPath(); x.moveTo(-10, 150); x.quadraticCurveTo(50, 120, 140, 136); x.stroke();
    for (let k = 0; k < 40; k++) { x.fillStyle = 'rgba(40,30,22,0.8)'; x.beginPath(); x.ellipse(r() * 140, 110 + r() * 50, 5, 2.5, r() * 3, 0, Math.PI * 2); x.fill(); }
    x.fillStyle = 'rgba(60,30,18,0.92)';
    for (let i = 1; i < 4; i++) x.fillRect(i * 32 - 2, 0, 4, 212);
    for (let j = 1; j < 6; j++) x.fillRect(0, j * 35 - 2, 128, 4);
    return yDone(THREE, c, false);
  }
  /* the red board behind the Buddha and the monk: a gilt border and a lattice of four-petal flowers (Chad's v19.1 —
     no halo, no arch behind the image) */
  function makeMScreen(THREE, cnv) {
    const [c, x] = ySized(cnv, 512, 512);
    x.fillStyle = '#6e1008'; x.fillRect(0, 0, 512, 512);
    x.strokeStyle = '#d8a44a'; x.lineWidth = 10; x.strokeRect(14, 14, 484, 484); x.lineWidth = 3; x.strokeRect(32, 32, 448, 448);
    x.fillStyle = '#d8a44a';
    for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) {
      const cx = 56 + i * 50 + (j % 2) * 25, cy = 56 + j * 50; if (cx > 470) continue;
      for (let k = 0; k < 4; k++) { x.save(); x.translate(cx, cy); x.rotate(k * Math.PI / 2); x.beginPath(); x.ellipse(0, -7, 4, 7, 0, 0, Math.PI * 2); x.fill(); x.restore(); }
      x.beginPath(); x.arc(cx, cy, 2.5, 0, Math.PI * 2); x.fill();
    }
    return yDone(THREE, c, false);
  }
  /* the donation box's front: teak, a gilt rule, ตู้ทำบุญ (a merit box) over DONATION and 功德箱 */
  function makeMBoxFront(THREE, cnv) {
    const [c, x] = ySized(cnv, 512, 400), r = yRng(251);
    const g = x.createLinearGradient(0, 0, 0, 400); g.addColorStop(0, '#5a3218'); g.addColorStop(1, '#40220e'); x.fillStyle = g; x.fillRect(0, 0, 512, 400);
    for (let k = 0; k < 60; k++) { x.strokeStyle = `rgba(${r() < 0.5 ? '30,16,6' : '120,80,40'},0.25)`; x.beginPath(); const y = r() * 400; x.moveTo(0, y); x.bezierCurveTo(170, y + (r() - 0.5) * 20, 340, y + (r() - 0.5) * 20, 512, y); x.stroke(); }
    x.strokeStyle = '#d8a44a'; x.lineWidth = 8; x.strokeRect(14, 14, 484, 372);
    x.fillStyle = '#e8bf62'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 72px sans-serif'; x.fillText('ตู้ทำบุญ', 256, 130);
    x.font = 'bold 52px sans-serif'; x.fillText('DONATION', 256, 236);
    x.font = 'bold 46px serif'; x.fillText('功 德 箱', 256, 318);
    return yDone(THREE, c, false);
  }
  /* his envelope: plain white, and on it in his own hand, in pen, who it is for */
  function makeMEnvelope(THREE, cnv) {
    const [c, x] = ySized(cnv, 512, 286), r = yRng(257);
    x.fillStyle = '#f6f2e8'; x.fillRect(0, 0, 512, 286);
    for (let k = 0; k < 20; k++) yBlob(x, 512, r() * 512, r() * 286, 20 + r() * 40, `rgba(${r() < 0.5 ? '220,212,196' : '255,255,250'},0.18)`);
    x.strokeStyle = 'rgba(160,150,130,0.45)'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, 0); x.lineTo(256, 120); x.lineTo(512, 0); x.stroke();
    x.save(); x.translate(256, 190); x.rotate(-0.035);
    x.fillStyle = '#1c2a5a'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'italic 600 34px Georgia, serif'; x.fillText('For the young lady', 0, -20);
    x.font = 'italic 600 34px Georgia, serif'; x.fillText('of the amulet', 6, 24);
    x.strokeStyle = '#1c2a5a'; x.lineWidth = 2; x.beginPath(); x.moveTo(-120, 52); x.quadraticCurveTo(0, 60, 120, 50); x.stroke();
    x.restore();
    return yDone(THREE, c, false);
  }
  /* a falling bodhi leaf: heart-shaped, wide at the stalk, with its long drip tip; gold-green, its midrib and veins */
  function makeMLeaf(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    x.clearRect(0, 0, S, S); x.translate(64, 58);
    const g = x.createLinearGradient(0, -40, 0, 56); g.addColorStop(0, '#d8c060'); g.addColorStop(0.5, '#a8a848'); g.addColorStop(1, '#7c8a34');
    x.fillStyle = g; x.beginPath(); x.moveTo(0, -30);
    x.bezierCurveTo(24, -50, 46, -18, 30, 6); x.bezierCurveTo(20, 22, 6, 30, 1, 60);
    x.lineTo(-1, 60); x.bezierCurveTo(-6, 30, -20, 22, -30, 6); x.bezierCurveTo(-46, -18, -24, -50, 0, -30); x.fill();
    x.strokeStyle = 'rgba(250,240,190,0.7)'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(0, -30); x.lineTo(0, 58); x.stroke();
    x.lineWidth = 0.9;
    for (let i = 0; i < 6; i++) { const y = -22 + i * 9; x.beginPath(); x.moveTo(0, y); x.quadraticCurveTo(12, y - 4, 24 - i * 2.5, y - 10 + i); x.moveTo(0, y); x.quadraticCurveTo(-12, y - 4, -24 + i * 2.5, y - 10 + i); x.stroke(); }
    return yDone(THREE, c, false);
  }
  /* the wet patch's alpha: soft all round, a little uneven (CP6: a hard-edged disc read as a hole in the earth) */
  function makeMWet(THREE, cnv) {
    const S = 128, [c, x] = cnv(S), r = yRng(281);
    const g = x.createRadialGradient(64, 64, 6, 64, 64, 62); g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, '#d0d0d0'); g.addColorStop(1, '#000000');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    for (let k = 0; k < 14; k++) yBlob(x, S, 34 + r() * 60, 34 + r() * 60, 6 + r() * 14, 'rgba(255,255,255,0.3)');
    return yDone(THREE, c, false);
  }
  function makeMRipple(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    const g = x.createRadialGradient(64, 64, 40, 64, 64, 62); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.55, 'rgba(255,255,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return yDone(THREE, c, false);
  }
  /* the stream: streaks along its length (v runs down it), brighter at the core, scrolled each frame */
  function makeMStream(THREE, cnv) {
    const [c, x] = ySized(cnv, 64, 256), r = yRng(263);
    x.clearRect(0, 0, 64, 256);
    const g = x.createLinearGradient(0, 0, 64, 0); g.addColorStop(0, 'rgba(255,255,255,0.15)'); g.addColorStop(0.5, 'rgba(255,255,255,0.75)'); g.addColorStop(1, 'rgba(255,255,255,0.15)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 256);
    for (let k = 0; k < 40; k++) { x.fillStyle = `rgba(255,255,255,${0.25 + r() * 0.5})`; x.fillRect(8 + r() * 48, r() * 256, 1 + r() * 2, 10 + r() * 40); }
    return yDone(THREE, c, true);
  }
  /* a shaft of low sun through a window: bright at its root, soft at its edges, gone by its far end */
  function makeMShaft(THREE, cnv) {
    const [c, x] = ySized(cnv, 256, 64);
    const g = x.createLinearGradient(0, 0, 256, 0); g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(0.6, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 256, 64);
    const v = x.createLinearGradient(0, 0, 0, 64); v.addColorStop(0, 'rgba(0,0,0,1)'); v.addColorStop(0.3, 'rgba(0,0,0,0)'); v.addColorStop(0.7, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,1)');
    x.globalCompositeOperation = 'destination-out'; x.fillStyle = v; x.fillRect(0, 0, 256, 64); x.globalCompositeOperation = 'source-over';
    return yDone(THREE, c, false);
  }
  /* a gable's carved panel (chapter 2's makeGableCarve): drawn to the gable's own triangle, gold kanok on dark red */
  function makeMGable(THREE, cnv, w, h) {
    const W = 1024, Hh = Math.max(128, Math.round(W * h / w)), [c, x] = ySized(cnv, W, Hh), r = yRng(269);
    x.fillStyle = '#6e110a'; x.fillRect(0, 0, W, Hh);
    x.save(); x.beginPath(); x.moveTo(W * 0.03, Hh); x.lineTo(W / 2, Hh * 0.03); x.lineTo(W * 0.97, Hh); x.closePath(); x.clip();
    x.fillStyle = '#7d140c'; x.fillRect(0, 0, W, Hh);
    const leaf = (cx, cy, sz, ang) => { x.save(); x.translate(cx, cy); x.rotate(ang);
      x.beginPath(); x.moveTo(0, sz); x.quadraticCurveTo(sz * 0.55, sz * 0.25, 0, -sz); x.quadraticCurveTo(-sz * 0.55, sz * 0.25, 0, sz); x.fill(); x.restore(); };
    x.fillStyle = '#d6a648';
    const step = Hh / 9;
    for (let row = 0; row < 9; row++) { const y = Hh - step * (row + 0.6), half = (W / 2) * (y / Hh), n = Math.max(1, Math.round(half * 2 / (step * 1.15)));
      for (let i = 0; i < n; i++) { const xx = W / 2 - half + (i + 0.5) * (half * 2 / n); leaf(xx, y, step * 0.42, (xx - W / 2) / W * 1.2 + (r() - 0.5) * 0.15); } }
    x.strokeStyle = '#e8bf62'; x.lineWidth = Math.max(2, Hh * 0.012);
    for (let i = 0; i < 26; i++) { const cy = Hh * (0.35 + r() * 0.6), span = (W / 2) * (cy / Hh), cx = W / 2 + (r() * 2 - 1) * span * 0.85, rr = step * (0.25 + r() * 0.3);
      x.beginPath(); x.arc(cx, cy, rr, r() * 6, r() * 6 + 3.6); x.stroke(); }
    x.restore();
    x.strokeStyle = '#e8bf62'; x.lineWidth = Math.max(4, Hh * 0.03);
    x.beginPath(); x.moveTo(W * 0.04, Hh * 0.985); x.lineTo(W / 2, Hh * 0.04); x.lineTo(W * 0.96, Hh * 0.985); x.closePath(); x.stroke();
    const mx = W / 2, my = Hh * 0.66, mr = Math.min(Hh * 0.2, W * 0.07);
    x.fillStyle = '#e8bf62'; x.beginPath(); x.arc(mx, my, mr, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#7d140c'; x.beginPath(); x.arc(mx, my, mr * 0.74, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#e8bf62'; x.beginPath(); x.arc(mx, my, mr * 0.36, 0, Math.PI * 2); x.fill();
    for (let i = 0; i < 12; i++) leaf(mx + Math.cos(i / 12 * Math.PI * 2) * mr * 1.25, my + Math.sin(i / 12 * Math.PI * 2) * mr * 1.25, mr * 0.28, i / 12 * Math.PI * 2 + Math.PI / 2);
    return yDone(THREE, c, false);
  }
  /* the pointed gilt crown over a Thai door or window, and a gable's plain triangle (chapter 2's) */
  function mCrown(THREE, w, h) {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0);
    s.quadraticCurveTo(-w * 0.40, h * 0.50, -w * 0.10, h * 0.74); s.quadraticCurveTo(-w * 0.02, h * 0.84, 0, h);
    s.quadraticCurveTo(w * 0.02, h * 0.84, w * 0.10, h * 0.74); s.quadraticCurveTo(w * 0.40, h * 0.50, w / 2, 0);
    s.lineTo(-w / 2, 0);
    return s;
  }
  function mTri(THREE, w, h) { const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.lineTo(-w / 2, 0); return s; }
  /* THE RED CLOTH the three are wrapped in on the owner's glass (CP5): red silk, a fine weave and a sheen, a gold border
     and a thin inner line — drawn at a millimetre a pixel to the cloth's own 340 × 660 mm, so its border is one width
     all round */
  function makeRedClothT(THREE, cnv, border = true) {
    const Wd = 340, Ht = 660, [c, x] = sized(cnv, Wd, Ht), r = rng(5203);
    const g = x.createLinearGradient(0, 0, Wd, Ht);
    g.addColorStop(0, '#a3161a'); g.addColorStop(0.45, '#c42a24'); g.addColorStop(0.55, '#b51f1e'); g.addColorStop(1, '#8e1216');
    x.fillStyle = g; x.fillRect(0, 0, Wd, Ht);
    for (let i = 0; i < Ht; i += 2) { x.fillStyle = `rgba(${r() < 0.5 ? '60,0,4' : '255,120,110'},${(0.02 + r() * 0.035).toFixed(3)})`; x.fillRect(0, i, Wd, 1); }
    for (let i = 0; i < Wd; i += 2) { x.fillStyle = `rgba(${r() < 0.5 ? '60,0,4' : '255,120,110'},${(0.015 + r() * 0.03).toFixed(3)})`; x.fillRect(i, 0, 1, Ht); }
    if (!border) return done(THREE, c, false);          // (the bundle: drawn up round them, its border is somewhere underneath)
    x.strokeStyle = '#d8a83c'; x.lineWidth = 9; x.strokeRect(16, 16, Wd - 32, Ht - 32);
    x.strokeStyle = 'rgba(232,190,90,0.85)'; x.lineWidth = 2; x.strokeRect(30, 30, Wd - 60, Ht - 60);
    for (const [cx, cy] of [[30, 30], [Wd - 30, 30], [30, Ht - 30], [Wd - 30, Ht - 30]]) {
      x.fillStyle = '#e0b448'; x.beginPath(); x.arc(cx, cy, 6, 0, Math.PI * 2); x.fill();
      for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + Math.PI / 4; x.beginPath(); x.ellipse(cx + Math.cos(a) * 11, cy + Math.sin(a) * 11, 6, 3, a, 0, Math.PI * 2); x.fill(); }
    }
    return done(THREE, c, false);
  }
  /* (CP6) the red drink's label, wrapped once round its bottle: a pink-white band, a drawn strawberry, its name in plain
     capitals (no brand — a generic red soda, the kind every Thai shrine is given), a little fine print, and a seam */
  function makeSodaLabelT(THREE, cnv) {
    const [c, x] = sized(cnv, 512, 128), r = rng(6113);
    const g = x.createLinearGradient(0, 0, 0, 128); g.addColorStop(0, '#fbe4e2'); g.addColorStop(1, '#f2c8c4');
    x.fillStyle = g; x.fillRect(0, 0, 512, 128);
    x.fillStyle = '#c8141e'; x.fillRect(0, 0, 512, 14); x.fillRect(0, 114, 512, 14);
    for (const ox of [96, 352]) {                         // the label shows its face twice round the bottle
      x.fillStyle = '#d81c26'; x.beginPath(); x.moveTo(ox - 22, 44); x.quadraticCurveTo(ox - 26, 92, ox, 100); x.quadraticCurveTo(ox + 26, 92, ox + 22, 44);
      x.quadraticCurveTo(ox, 34, ox - 22, 44); x.fill();
      x.fillStyle = '#f6e27a'; for (let i = 0; i < 14; i++) x.fillRect(ox - 16 + r() * 32, 50 + r() * 40, 2, 3);
      x.fillStyle = '#2e8a3a'; x.beginPath(); x.ellipse(ox - 8, 40, 10, 5, -0.5, 0, Math.PI * 2); x.ellipse(ox + 8, 40, 10, 5, 0.5, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#8a0c14'; x.font = 'bold 26px sans-serif'; x.textAlign = 'left'; x.textBaseline = 'middle';
      x.fillText('RED', ox + 34, 54); x.font = 'bold 15px sans-serif'; x.fillText('STRAWBERRY', ox + 34, 78);
      x.fillStyle = 'rgba(80,20,20,0.6)'; x.font = '9px sans-serif'; x.fillText('325 ml', ox + 34, 98);
    }
    x.fillStyle = 'rgba(120,40,40,0.35)'; x.fillRect(250, 14, 2, 100);  // its seam
    return done(THREE, c, true);
  }
  /* a striped drinking straw: white with a red stripe running round it (drawn along u, so its repeat winds it) */
  function makeStrawT(THREE, cnv) {
    const [c, x] = sized(cnv, 64, 64);
    x.fillStyle = '#f4f2ee'; x.fillRect(0, 0, 64, 64);
    x.fillStyle = '#d8283a';
    for (let k = -1; k < 3; k++) { x.beginPath(); x.moveTo(k * 32, 64); x.lineTo(k * 32 + 14, 64); x.lineTo(k * 32 + 14 + 32, 0); x.lineTo(k * 32 + 32, 0); x.fill(); }
    return done(THREE, c, true);
  }
  /* the straw's paper sleeve: thin white paper, a printed band of small red marks */
  function makeSleeveT(THREE, cnv) {
    const [c, x] = sized(cnv, 64, 256), r = rng(6127);
    x.fillStyle = '#f7f5f0'; x.fillRect(0, 0, 64, 256);
    for (let i = 0; i < 60; i++) { x.fillStyle = `rgba(200,40,50,${(0.4 + r() * 0.3).toFixed(2)})`; x.fillRect(r() * 64, r() * 256, 4, 2); }
    return done(THREE, c, true);
  }
  /* the incense packet: red paper, a gold lotus and its plain name, the sticks' red ends showing at its open top */
  function makeIncensePackT(THREE, cnv) {
    const [c, x] = sized(cnv, 128, 512), r = rng(6131);
    x.fillStyle = '#b8141c'; x.fillRect(0, 0, 128, 512);
    x.fillStyle = '#e8b84a'; x.fillRect(8, 8, 112, 4); x.fillRect(8, 500, 112, 4);
    x.strokeStyle = '#e8b84a'; x.lineWidth = 3;
    for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k - 2) * 0.42; x.beginPath(); x.ellipse(64 + Math.cos(a) * 18, 180 + Math.sin(a) * 18, 9, 22, a + Math.PI / 2, 0, Math.PI * 2); x.stroke(); }
    x.fillStyle = '#e8b84a'; x.font = 'bold 18px serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('JOSS', 64, 250); x.fillText('STICKS', 64, 274);
    for (let i = 0; i < 400; i++) { x.fillStyle = `rgba(0,0,0,${(r() * 0.08).toFixed(3)})`; x.fillRect(r() * 128, r() * 512, 2, 2); }
    return done(THREE, c, true);
  }
  /* the paper bag's kraft (CP5): brown paper, its fibres, a darker crease near its foot. (CP13: no seal — Chad wants a
     shop's paper bag PLAIN, "i dont want any text to be on the paper bag", said of chapter 4's; and a 福, fortune, on the
     bag of a shop that has just said never to keep them for luck said the opposite) */
  function makeKraftT(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(5209);
    x.fillStyle = '#b88d5c'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 1400; i++) {
      x.strokeStyle = `rgba(${r() < 0.5 ? '120,84,48' : '214,178,132'},${(0.12 + r() * 0.2).toFixed(2)})`; x.lineWidth = 1;
      const px = r() * S, py = r() * S, a = r() * Math.PI, l = 3 + r() * 9;
      x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke();
    }
    x.fillStyle = 'rgba(90,60,30,0.16)'; x.fillRect(0, S * 0.84, S, 3);
    return done(THREE, c, false);
  }
  /* (CP5: its words are the sheet's — DATA.words card1…card14; '' is a gap between his paragraphs) */
  const CARD_LAYOUT = ['card1', '', 'card2', 'card3', 'card4', 'card5', 'card6', 'card7', '', 'card8', 'card9', '',
                       'card10', 'card11', '', 'card12', 'card13', 'card14'];
  const cardLines = () => CARD_LAYOUT.map(k => (k ? DATA.words[k] || '' : ''));
  function makeOwnerCardT(THREE, cnv, CARD_RULES) {
    const [c, x] = sized(cnv, 512, 720), r = rng(5179);
    x.fillStyle = '#f2ecdc'; x.fillRect(0, 0, 512, 720);
    for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(140,120,80,${(r() * 0.06).toFixed(3)})`; x.fillRect(r() * 512, r() * 720, 3, 3); }
    // soft corners: a little grey where a thumb has held it
    for (const [cx, cy] of [[0, 0], [512, 0], [0, 720], [512, 720]]) {
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, 70); g.addColorStop(0, 'rgba(120,100,70,0.22)'); g.addColorStop(1, 'rgba(120,100,70,0)');
      x.fillStyle = g; x.fillRect(cx - 70, cy - 70, 140, 140);
    }
    x.fillStyle = '#20263a'; x.textBaseline = 'alphabetic';
    let y = 64, prev = '';
    for (const line of CARD_RULES) {
      if (!line) { y += 14; prev = ''; continue; }
      /* (CP13, the counter's vision review: a NEVER line is a rule of its own, set as a heading — bulleted, the two NEVERs
         read as Buddha-day rules under EVERY BUDDHA DAY) */
      const head = line === line.toUpperCase() || /^NEVER\b/.test(line);
      /* (CP13: a line that carries on the one above it — that one ends on a comma — takes no bullet of its own: "bring
         them back" was bulleted as a rule of its own) */
      const cont = !head && /,\s*$/.test(prev);
      let px = head ? 27 : 25;
      x.font = head ? `bold ${px}px sans-serif` : `${px}px sans-serif`;
      while (x.measureText(line).width > 512 - (head ? 36 : 56) - 14 && px > 16) { px--; x.font = head ? `bold ${px}px sans-serif` : `${px}px sans-serif`; }   // (fitted: the sheet may lengthen a line)
      x.fillText(line, head ? 36 : 56, y);
      if (!head && !cont) { x.beginPath(); x.arc(42, y - 8, 3.5, 0, Math.PI * 2); x.fill(); }
      y += head ? 36 : 33; prev = head ? '' : line;
    }
    return done(THREE, c, false);
  }
  /* the calendar on the wall: this month, every day so far crossed off, none missed (§2.5 3) */
  /* (CP8: every page began on the same weekday and ran to 31 — November too. A page is a real month now: `start`, the
     column of its 1st (0 Sunday), and `len`; the room's October is 2025's, the 1st a Wednesday, and its Buddha Days
     fall with that month's moon) */
  function makeCalendarT(THREE, cnv, today = 24, month = 'OCTOBER', holy = [7, 14, 21, 29], kept = null, start = 3, len = 31) {
    const [c, x] = sized(cnv, 320, 440);
    x.fillStyle = '#f6f4ee'; x.fillRect(0, 0, 320, 440);
    x.fillStyle = '#b8241c'; x.fillRect(0, 0, 320, 64);
    x.fillStyle = '#fff'; x.font = 'bold 30px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(month, 160, 34);
    x.fillStyle = '#3a3a40'; x.font = 'bold 14px sans-serif';
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach((d, i) => x.fillText(d, 26 + i * 44.5, 86));
    for (let d = 1; d <= len; d++) {
      const k = d - 1 + start, col = k % 7, row = Math.floor(k / 7), cx = 26 + col * 44.5, cy = 118 + row * 52;
      x.fillStyle = '#2a2a30'; x.font = '18px sans-serif'; x.fillText(String(d), cx, cy);
      if (holy.includes(d)) {                     // a Buddha Day: ringed in gold, and ticked when merit was made on it
        x.strokeStyle = '#c8962a'; x.lineWidth = 2.5; x.beginPath(); x.arc(cx, cy, 16, 0, Math.PI * 2); x.stroke();
        if (kept ? kept.includes(d) : d < today) { x.strokeStyle = '#b8862a'; x.lineWidth = 3; x.beginPath(); x.moveTo(cx + 9, cy + 15); x.lineTo(cx + 13, cy + 20); x.lineTo(cx + 21, cy + 9); x.stroke(); }
      }
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
    const lines = i === 0 ? ['in the name of', 'the young lady', 'of the amulet'] : ['in the names of', 'the three children', 'in my care'];   // (CP13: "(her portrait)" read as a note to the printer)
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
  function makeDashboardT(THREE, cnv, late = false) {
    const [c, x] = sized(cnv, 512, 300), r = rng(5203);
    if (late) {                                    // ending A's days (CP8): nothing shipped, the queue grown, every order late
      x.fillStyle = '#121620'; x.fillRect(0, 0, 512, 300);
      x.fillStyle = '#1b2230'; x.fillRect(0, 0, 512, 36);
      x.fillStyle = '#f2b429'; x.font = 'bold 18px sans-serif'; x.fillText('ROADEYE · DASHBOARD', 14, 24);
      x.fillStyle = '#8a94a8'; x.font = '12px sans-serif'; x.fillText('Shipped this week', 14, 60); x.fillText('Waiting', 300, 60);
      x.fillStyle = '#e8ecf2'; x.font = 'bold 34px sans-serif'; x.fillText('0', 14, 98); x.fillStyle = '#ff5a4a'; x.fillText('41', 300, 98);
      let px = 20, py = 150; x.strokeStyle = '#c86a5a'; x.lineWidth = 3; x.beginPath(); x.moveTo(px, py);
      for (let i = 1; i <= 12; i++) { px = 20 + i * 22; py = Math.min(262, 150 + i * 11 + r() * 8); x.lineTo(px, py); }
      x.stroke();
      for (let k = 0; k < 6; k++) { x.fillStyle = k % 2 ? '#2a1a1e' : '#24161a'; x.fillRect(300, 120 + k * 26, 196, 24); x.fillStyle = '#ff8a7a'; x.font = '11px sans-serif'; x.fillText('#44' + (12 + k) + '  LATE ' + (19 - k * 2) + ' DAYS', 308, 136 + k * 26); }
      return done(THREE, c, false);
    }
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
  /* the laptop: his orders, late at night (the home film's weeks) — in its dark mode (CP13, the play's vision review: a
     white page at night sat behind the stat bars at the desk on a phone, and their cream words vanished into it) */
  function makeLaptopT(THREE, cnv) {
    const [c, x] = sized(cnv, 512, 322);
    x.fillStyle = '#141922'; x.fillRect(0, 0, 512, 322);
    x.fillStyle = '#1d2430'; x.fillRect(0, 0, 512, 26);
    for (const [cx, col] of [[14, '#ff5f57'], [30, '#febc2e'], [46, '#28c840']]) { x.fillStyle = col; x.beginPath(); x.arc(cx, 13, 5, 0, Math.PI * 2); x.fill(); }
    x.fillStyle = '#d8dee8'; x.font = 'bold 20px sans-serif'; x.fillText('ROADEYE · ORDERS', 24, 60);
    for (let k = 0; k < 7; k++) {
      x.fillStyle = k % 2 ? '#1a202a' : '#1e2531'; x.fillRect(24, 76 + k * 32, 464, 30);
      x.fillStyle = '#b8c2d4'; x.font = '13px sans-serif'; x.fillText(`#44${11 + k}   ROADEYE 1080P   ${['Tampines', 'Bedok', 'Jurong W', 'Yishun', 'Clementi', 'Hougang', 'Woodlands'][k]}`, 34, 96 + k * 32);
      x.fillStyle = k < 4 ? '#5ac87a' : '#f2a43a'; x.fillText(k < 4 ? 'packed' : 'to pack', 410, 96 + k * 32);
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

  /* ====================================================== WORLD S's DRAWN SURFACES (CP5)
     Chapter 4's (e3c4.js, its shop's: the floor's tiles, the corridor's terrazzo, the ceiling grid, the name on the
     glass, the lightbox, the mall's directory, the EXIT, the neighbours' signs and posters, the velvet trays, the
     framed amulets, the Thai calendar, the clock's face, the red board behind the altar, the boxed cases, the roller
     shutter), copied by their own code — a chapter imports nothing. */
  function makeGlowTex(THREE, cnv, rgb) {
    const S = 128, [c, x] = cnv(S);
    const g = x.createRadialGradient(64, 64, 2, 64, 64, 64);
    g.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},1)`); g.addColorStop(0.35, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.45)`); g.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return done(THREE, c, false);
  }
  /* a small printed sign: words on a coloured card, sized to its aspect */
  function makeSignTxt(THREE, cnv, text, bg, fg, aspect) {
    const W = 512, H = Math.round(W / aspect), [c, x] = sized(cnv, W, H);
    x.fillStyle = bg; x.fillRect(0, 0, W, H);
    x.strokeStyle = fg; x.lineWidth = Math.max(2, H * 0.05); x.strokeRect(H * 0.08, H * 0.08, W - H * 0.16, H - H * 0.16);
    let px = Math.floor(H * 0.56); x.font = 'bold ' + px + 'px sans-serif';
    while (x.measureText(text).width > W * 0.86 && px > 6) { px -= 2; x.font = 'bold ' + px + 'px sans-serif'; }
    x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, W / 2, H * 0.54);
    return done(THREE, c, false);
  }
  /* the shop's floor: 600 mm porcelain, warm white, a faint vein, grout */
  function makeShopTiles(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(3);
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      const g = 226 + r() * 10;
      x.fillStyle = `rgb(${g},${g - 4},${g - 12})`; x.fillRect(i * 256, j * 256, 256, 256);
      for (let k = 0; k < 6; k++) {                      // soft veining
        x.strokeStyle = `rgba(150,140,128,${0.05 + r() * 0.06})`; x.lineWidth = 1 + r() * 2;
        x.beginPath(); let px = i * 256 + r() * 256, py = j * 256 + r() * 256; x.moveTo(px, py);
        for (let q = 0; q < 5; q++) { px += r() * 60 - 30; py += r() * 60 - 30; x.lineTo(px, py); }
        x.stroke();
      }
      const gr = x.createLinearGradient(i * 256, j * 256, i * 256 + 256, j * 256 + 256);   // a polish sheen
      gr.addColorStop(0, 'rgba(255,255,255,0.0)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.08)'); gr.addColorStop(1, 'rgba(255,255,255,0.0)');
      x.fillStyle = gr; x.fillRect(i * 256, j * 256, 256, 256);
    }
    x.fillStyle = '#b9b0a2'; for (const p of [0, 255]) { x.fillRect(0, p, S, 2); x.fillRect(p, 0, 2, S); }
    return done(THREE, c, true);
  }
  /* the old mall's terrazzo: cream, chips of grey, rust, black and white,
     brass divider strips on a 1.2 m grid */
  function makeTerrazzo(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(19);
    x.fillStyle = '#d8ccb4'; x.fillRect(0, 0, S, S);
    const cols = ['#8c8478', '#6e3b28', '#2a2622', '#f2ece0', '#a89c88', '#b7643e'];
    for (let i = 0; i < 5200; i++) {
      x.fillStyle = cols[(r() * cols.length) | 0];
      x.globalAlpha = 0.45 + r() * 0.5;
      const w = 1 + r() * 5, h = 1 + r() * 4;
      x.beginPath(); x.ellipse(r() * S, r() * S, w, h, r() * 3, 0, Math.PI * 2); x.fill();
    }
    x.globalAlpha = 1;
    const gr = x.createRadialGradient(S * 0.4, S * 0.6, 20, S * 0.4, S * 0.6, S * 0.7);   // a century of feet
    gr.addColorStop(0, 'rgba(255,250,240,0.10)'); gr.addColorStop(1, 'rgba(90,80,60,0.10)');
    x.fillStyle = gr; x.fillRect(0, 0, S, S);
    x.fillStyle = '#a8864a'; x.fillRect(0, 0, S, 3); x.fillRect(0, 0, 3, S);
    return done(THREE, c, true);
  }
  /* the 600 mm T-bar ceiling: fissured mineral tiles in a thin grey grid */
  function makeCeilGrid(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(23);
    x.fillStyle = '#ece9e2'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(120,116,108,${0.05 + r() * 0.12})`; x.fillRect(r() * S, r() * S, 1 + r() * 2, 1); }
    x.fillStyle = '#9a968e'; for (const p of [0, 254]) { x.fillRect(0, p, S, 4); x.fillRect(p, 0, 4, S); }
    return done(THREE, c, true);
  }
  /* the shop's name on its glass in gold leaf: Thai, Chinese and English, as a
     Singapore Thai-amulet shop writes it (transparent between the letters) */
  function makeGlassName(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 384);
    x.clearRect(0, 0, 1024, 384);
    const gold = x.createLinearGradient(0, 0, 0, 384);
    gold.addColorStop(0, '#ffe6a0'); gold.addColorStop(0.5, '#d4a23e'); gold.addColorStop(1, '#a8761e');
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.shadowColor = 'rgba(40,20,0,0.6)'; x.shadowBlur = 4;
    x.fillStyle = gold; x.font = 'bold 92px sans-serif'; x.fillText('พระเครื่องสยาม', 512, 92);
    x.font = 'bold 64px sans-serif'; x.fillText('暹 罗 佛 牌', 512, 200);
    x.font = 'bold 56px serif'; x.fillText('SIAM AMULET HOUSE', 512, 300);
    x.shadowBlur = 0; x.strokeStyle = '#d4a23e'; x.lineWidth = 3;
    x.beginPath(); x.moveTo(170, 248); x.lineTo(854, 248); x.stroke();
    return done(THREE, c, false);
  }
  /* the lightbox over the front, facing the corridor */
  function makeLightbox(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 192);
    const g = x.createLinearGradient(0, 0, 0, 192); g.addColorStop(0, '#b01c14'); g.addColorStop(1, '#7a0e08');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 192);
    x.strokeStyle = '#f2c14e'; x.lineWidth = 6; x.strokeRect(8, 8, 1008, 176);
    x.fillStyle = '#ffe08a'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 70px sans-serif'; x.fillText('SIAM AMULET HOUSE  暹罗佛牌', 512, 72);
    x.fillStyle = '#fff4dc'; x.font = 'bold 34px sans-serif'; x.fillText('พระเครื่อง · AMULETS · BUDDHA IMAGES · 佛像', 512, 142);
    return done(THREE, c, false);
  }
  /* v21.18 · the corridor's end: the mall's directory — its name, the floors and what is on them (generic names), a
     plan of this floor with a red YOU ARE HERE; and the green EXIT over the way out */
  function makeMallDirectory(THREE, cnv) {
    const [c, x] = sized(cnv, 512, 768);
    x.fillStyle = '#16212c'; x.fillRect(0, 0, 512, 768);
    x.fillStyle = '#c9a24c'; x.fillRect(0, 0, 512, 104);
    x.fillStyle = '#1c1408'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 38px sans-serif'; x.fillText('GOLDEN MILE COMPLEX', 256, 40);
    x.font = 'bold 22px sans-serif'; x.fillText('DIRECTORY  ·  ผังร้านค้า  ·  商场指南', 256, 80);
    const floors = [['LEVEL 3', ['Karaoke Lounge', 'Thai Disco', 'Travel Agents']], ['LEVEL 2', ['Thai Restaurants', 'Coach Ticketing', 'Massage']],
                    ['LEVEL 1', ['Thai Mart', 'Amulets', 'Money Changer', 'Mobile']], ['B1', ['Supermarket', 'Food Court']]];
    let y = 136;
    for (const [fl, units] of floors) {
      x.fillStyle = '#c9a24c'; x.fillRect(24, y - 16, 112, 32);
      x.fillStyle = '#1c1408'; x.font = 'bold 20px sans-serif'; x.fillText(fl, 80, y);
      x.fillStyle = '#e8eef2'; x.font = '19px sans-serif'; x.textAlign = 'left';
      units.forEach((u, i) => x.fillText(u, 156 + (i % 2) * 176, y + Math.floor(i / 2) * 26 - (units.length > 2 ? 12 : 0)));
      x.textAlign = 'center'; y += 74;
    }
    // this floor's plan: the corridor, the shops either side, the lifts at its end
    const px = 40, py = 448, pw = 432, ph = 250;
    x.fillStyle = '#22303e'; x.fillRect(px, py, pw, ph);
    x.strokeStyle = '#8aa0b4'; x.lineWidth = 2;
    for (let i = 0; i < 7; i++) { x.strokeRect(px + 8 + i * 60, py + 10, 54, 70); x.strokeRect(px + 8 + i * 60, py + ph - 80, 54, 70); }
    x.fillStyle = '#d8b04a'; x.fillRect(px + 8 + 3 * 60, py + ph - 80, 54, 70);              // the amulet shop
    x.fillStyle = '#5a6a7a'; x.fillRect(px + 2, py + 96, 30, 58);                             // the lifts
    x.fillStyle = '#e8263c'; x.beginPath(); x.arc(px + 60, py + 125, 11, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#ffffff'; x.font = 'bold 18px sans-serif'; x.textAlign = 'left'; x.fillText('YOU ARE HERE', px + 80, py + 126);
    x.textAlign = 'center'; x.fillStyle = '#9ab0c4'; x.font = '16px sans-serif'; x.fillText('LIFT  ลิฟต์  电梯', px + pw / 2 + 40, py + ph + 30);
    return done(THREE, c, false);
  }
  function makeExitSign(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 96);
    x.fillStyle = '#0f8a3e'; x.fillRect(0, 0, 256, 96);
    x.fillStyle = '#ffffff'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 46px sans-serif'; x.fillText('EXIT 出口', 150, 50);
    x.beginPath(); x.moveTo(28, 50); x.lineTo(58, 28); x.lineTo(58, 42); x.lineTo(80, 42); x.lineTo(80, 58); x.lineTo(58, 58); x.lineTo(58, 72); x.closePath(); x.fill();
    return done(THREE, c, false);
  }
  /* v21.18 · THE MALL'S SHOPS, BUILT — the drawn parts. Their signboards, one atlas: ten lightboxes of 1024 × 128,
     each a shop's own (a lit face, a bright edge, the name in English with its Thai or Chinese, a line under it) */
  const MALL_SIGNS = [
    { bg: ['#1e5aa8', '#0f356c'], edge: '#9fd0ff', ink: '#ffffff', name: 'BANGKOK TRAVEL  ทัวร์', sub: 'BUS · AIR · TOURS · VISA' },
    { bg: ['#23824a', '#12512b'], edge: '#ffe27a', ink: '#fff6cc', name: 'THAI MART  ร้านค้าไทย', sub: 'FRESH FROM BANGKOK DAILY' },
    { bg: ['#e07a18', '#a24a08'], edge: '#ffe2a8', ink: '#fffaf0', name: 'THAI KITCHEN  อาหารไทย', sub: 'BOAT NOODLES · TOM YUM · MOOKATA' },
    { bg: ['#c2457a', '#7e1f4a'], edge: '#ffd0e4', ink: '#fff4fa', name: 'THAI MASSAGE  นวดไทย', sub: 'FOOT · BODY · HERBAL COMPRESS' },
    { bg: ['#9a1810', '#5a0a06'], edge: '#ffd24a', ink: '#ffd84e', name: '金 店   GOLDSMITH', sub: '916 · 999 GOLD  ·  BUY & SELL' },
    { bg: ['#1a1c22', '#08090c'], edge: '#3ad0ff', ink: '#8ae8ff', name: 'MOBILE CENTRE', sub: 'REPAIR · TOP-UP · THAI SIM' },
    { bg: ['#8a8478', '#5e5a52'], edge: '#b8b2a4', ink: '#d6d0c2', name: 'SUCCESS TRADING', sub: '' , faded: true },
    { bg: ['#14523e', '#0a3024'], edge: '#7affc8', ink: '#e8fff4', name: 'MONEY CHANGER  แลกเงิน', sub: 'THB · MYR · USD · RMB' },
    { bg: ['#d8261c', '#8e0e08'], edge: '#ffe14a', ink: '#ffe94e', name: 'HAT YAI EXPRESS', sub: 'COACHES DAILY · HAT YAI · KL · BANGKOK' },
    { bg: ['#f2b81c', '#c47e08'], edge: '#fff6cc', ink: '#5a1608', name: 'THAI SNACKS  ขนมไทย', sub: 'SWEETS · DRIED FRUIT · CHILLI PASTE' }];
  function makeMallSigns(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 1280);
    MALL_SIGNS.forEach((s, i) => {
      const y = i * 128, g = x.createLinearGradient(0, y, 0, y + 128);
      g.addColorStop(0, s.bg[0]); g.addColorStop(1, s.bg[1]);
      x.fillStyle = g; x.fillRect(0, y, 1024, 128);
      x.strokeStyle = s.edge; x.lineWidth = 6; x.strokeRect(6, y + 6, 1012, 116);
      x.globalAlpha = 0.18; x.fillStyle = '#ffffff'; x.fillRect(12, y + 12, 1000, 36); x.globalAlpha = 1;   // the lightbox's own sheen
      x.fillStyle = s.ink; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = `bold ${s.sub ? 54 : 64}px sans-serif`; x.fillText(s.name, 512, y + (s.sub ? 52 : 64));
      if (s.sub) { x.font = 'bold 26px sans-serif'; x.fillText(s.sub, 512, y + 102); }
      if (s.faded) {                                        // an old sign nobody has lit for years: streaks, a corner gone
        x.globalAlpha = 0.35; for (let k = 0; k < 40; k++) { x.fillStyle = k % 2 ? '#4a463e' : '#a29c8e'; x.fillRect((k * 97) % 1000, y + 8, 3 + (k % 4), 112); }
        x.globalAlpha = 1; x.fillStyle = '#3a3630'; x.beginPath(); x.moveTo(900, y + 128); x.lineTo(1024, y + 70); x.lineTo(1024, y + 128); x.fill();
      }
    });
    return done(THREE, c, false);
  }
  /* their posters, menus and boards, one atlas of sixteen 256 × 256 cells (see MALL_POSTER for which is which) */
  const MALL_POSTER = { bangkok: 0, phuket: 1, hatyai: 2, timetable: 3, menu: 4, massage: 5, rates: 6, sim: 7,
                        tolet: 8, noodles: 9, goldrate: 10, elephant: 11, tomyum: 12, coach: 13, calendar: 14, rice: 15 };
  function makeMallPosters(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 1024), r = rng(2118);
    const cell = (i, fn) => { const cx = (i % 4) * 256, cy = Math.floor(i / 4) * 256; x.save(); x.translate(cx, cy); x.beginPath(); x.rect(0, 0, 256, 256); x.clip(); fn(); x.restore(); };
    const txt = (s, X, Y, px, col, al = 'center') => { x.fillStyle = col; x.textAlign = al; x.textBaseline = 'middle'; x.font = `bold ${px}px sans-serif`; x.fillText(s, X, Y); };
    const sky = (a, b) => { const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, 256, 256); };
    cell(0, () => { sky('#f4a040', '#6a1c10');                                   // BANGKOK: a temple's spires at sunset
      x.fillStyle = '#ffd890'; x.beginPath(); x.arc(170, 96, 30, 0, 7); x.fill();
      x.fillStyle = '#2a0e08';
      for (const [px, h, w] of [[60, 120, 30], [110, 160, 40], [168, 110, 28], [210, 80, 22]]) { x.beginPath(); x.moveTo(px, 210 - h); x.lineTo(px + w / 2, 210); x.lineTo(px - w / 2, 210); x.fill(); x.fillRect(px - w * 0.7, 196, w * 1.4, 16); }
      x.fillRect(0, 210, 256, 46); txt('BANGKOK', 128, 232, 34, '#ffe6a8'); });
    cell(1, () => { sky('#3ab4e8', '#f2e2a8');                                   // PHUKET: sea, sand, a longtail boat
      x.fillStyle = '#1a7ab0'; x.fillRect(0, 120, 256, 60); x.fillStyle = '#f6e6b0'; x.fillRect(0, 180, 256, 76);
      x.fillStyle = '#7a3a14'; x.beginPath(); x.moveTo(60, 150); x.lineTo(170, 150); x.lineTo(150, 168); x.lineTo(76, 168); x.fill();
      x.fillStyle = '#2a5a1c'; for (const px of [20, 228]) { x.fillRect(px, 70, 6, 110); x.beginPath(); x.ellipse(px + 3, 70, 40, 12, 0.3, 0, 7); x.fill(); }
      txt('PHUKET', 128, 226, 38, '#0e4a78'); });
    cell(2, () => { sky('#4a3a9a', '#e8708a');                                   // HAT YAI: the city at dusk
      x.fillStyle = '#1a1430'; for (let k = 0; k < 9; k++) { const h = 50 + r() * 90; x.fillRect(k * 29, 200 - h, 26, h); }
      x.fillStyle = '#ffd86a'; for (let k = 0; k < 40; k++) x.fillRect(4 + r() * 248, 110 + r() * 86, 3, 4);
      x.fillStyle = '#1a1430'; x.fillRect(0, 200, 256, 56); txt('HAT YAI', 128, 228, 36, '#ffe0f0'); });
    cell(3, () => { x.fillStyle = '#101418'; x.fillRect(0, 0, 256, 256);          // the coach timetable, an LED board
      txt('DEPARTURES  ออกเดินทาง', 128, 22, 17, '#ffd23a');
      [['HAT YAI', '08:00'], ['HAT YAI', '10:30'], ['K. LUMPUR', '13:00'], ['BANGKOK', '15:45'], ['HAT YAI', '21:00'], ['SONGKHLA', '22:30']].forEach(([d, t], k) => {
        txt(d, 18, 58 + k * 32, 19, '#ff8a2a', 'left'); txt(t, 238, 58 + k * 32, 19, '#7aff8a', 'right'); }); });
    cell(4, () => { x.fillStyle = '#fff4dc'; x.fillRect(0, 0, 256, 256);          // the kitchen's menu: six dishes, a price each
      txt('MENU  เมนู', 128, 20, 20, '#a8320a');
      const dish = [['#d8501c', 'TOM YUM'], ['#7a3a1a', 'BOAT NOODLE'], ['#e8c040', 'PAD THAI'], ['#3a8a2a', 'GREEN CURRY'], ['#c8642a', 'BASIL PORK'], ['#f0e0b0', 'MANGO RICE']];
      dish.forEach(([col, n], k) => { const X = 46 + (k % 3) * 82, Y = 72 + Math.floor(k / 3) * 96;
        x.fillStyle = '#f8f8f4'; x.beginPath(); x.arc(X, Y, 30, 0, 7); x.fill(); x.fillStyle = col; x.beginPath(); x.arc(X, Y, 23, 0, 7); x.fill();
        txt(n, X, Y + 42, 11, '#3a1a0a'); txt('$' + (5 + k % 3), X, Y + 56, 12, '#a8320a'); }); });
    cell(5, () => { x.fillStyle = '#5a1a3a'; x.fillRect(0, 0, 256, 256);          // the massage price list
      x.strokeStyle = '#f2c4d8'; x.lineWidth = 3; x.strokeRect(8, 8, 240, 240);
      txt('PRICE LIST', 128, 34, 22, '#ffd8ea');
      [['FOOT 45 min', '$28'], ['THAI 1 hr', '$38'], ['OIL 1 hr', '$42'], ['HERBAL 90 min', '$58']].forEach(([a, b], k) => { txt(a, 20, 82 + k * 40, 17, '#fff0f6', 'left'); txt(b, 236, 82 + k * 40, 17, '#ffd24a', 'right'); }); });
    cell(6, () => { x.fillStyle = '#060806'; x.fillRect(0, 0, 256, 256);          // the money changer's rates, red and green LEDs
      txt('WE BUY    WE SELL', 128, 18, 16, '#ffffff');
      [['THB', '25.40', '24.10'], ['MYR', '3.42', '3.28'], ['USD', '1.33', '1.30'], ['RMB', '5.36', '5.10'], ['IDR', '11,850', '11,200']].forEach(([c3, a, b], k) => {
        txt(c3, 12, 52 + k * 42, 20, '#ffffff', 'left'); txt(a, 158, 52 + k * 42, 20, '#ff3a2a', 'right'); txt(b, 246, 52 + k * 42, 20, '#3aff6a', 'right'); }); });
    cell(7, () => { sky('#0a1a4a', '#2a6ad8');                                   // the phone shop's offer
      x.fillStyle = '#ffffff'; x.fillRect(150, 40, 70, 130); x.fillStyle = '#2a8ae8'; x.fillRect(156, 50, 58, 104);
      txt('THAI SIM', 80, 70, 28, '#ffe14a'); txt('$10', 80, 120, 46, '#ffffff'); txt('5G · 30 DAYS', 128, 210, 22, '#bfe6ff'); });
    cell(8, () => { x.fillStyle = '#f4f2ea'; x.fillRect(0, 0, 256, 256);          // TO LET
      x.fillStyle = '#c81e14'; x.fillRect(0, 0, 256, 74); txt('TO LET', 128, 40, 50, '#ffffff');
      txt('SHOP UNIT', 128, 110, 24, '#1a1a1a'); txt('Enquiries', 128, 156, 20, '#3a3a3a'); txt('9xxx xxxx', 128, 190, 26, '#1a1a1a'); });
    cell(9, () => { x.fillStyle = '#ffe23a'; x.fillRect(0, 0, 256, 256);          // the grocer's offer
      txt('PROMO!', 128, 34, 34, '#d8201a'); for (let k = 0; k < 5; k++) { x.fillStyle = ['#e8401a', '#2a9a3a', '#e8a01a', '#8a2ad8', '#1a7ad8'][k]; x.fillRect(18 + k * 46, 80, 38, 56); }
      txt('INSTANT NOODLES', 128, 168, 20, '#3a1a0a'); txt('5 FOR $3', 128, 212, 36, '#d8201a'); });
    cell(10, () => { x.fillStyle = '#7a0a06'; x.fillRect(0, 0, 256, 256);         // the goldsmith's board: 金, 福, today's price
      txt('金', 70, 80, 90, '#ffd24a'); txt('福', 190, 80, 90, '#ffd24a');
      txt('916 GOLD', 128, 170, 26, '#ffe6a0'); txt('TODAY $102 /g', 128, 212, 24, '#ffffff'); });
    cell(11, () => { sky('#2a6a3a', '#d8b86a');                                   // a framed picture: an elephant in a field
      x.fillStyle = '#4a4440'; x.beginPath(); x.ellipse(128, 150, 70, 46, 0, 0, 7); x.fill(); x.fillRect(80, 170, 22, 50); x.fillRect(150, 170, 22, 50);
      x.beginPath(); x.ellipse(196, 132, 30, 34, 0, 0, 7); x.fill(); x.fillRect(214, 140, 14, 70);
      x.strokeStyle = '#c89a3a'; x.lineWidth = 10; x.strokeRect(5, 5, 246, 246); });
    cell(12, () => { x.fillStyle = '#2a0a06'; x.fillRect(0, 0, 256, 256);         // TOM YUM, a bowl
      x.fillStyle = '#f2f0ea'; x.beginPath(); x.arc(128, 128, 92, 0, 7); x.fill(); x.fillStyle = '#e0501a'; x.beginPath(); x.arc(128, 128, 78, 0, 7); x.fill();
      x.fillStyle = '#f4a8a0'; for (let k = 0; k < 6; k++) { x.beginPath(); x.ellipse(128 + Math.cos(k) * 40, 128 + Math.sin(k * 1.3) * 34, 16, 9, k, 0, 7); x.fill(); }
      x.fillStyle = '#4ab43a'; for (let k = 0; k < 8; k++) x.fillRect(90 + r() * 80, 96 + r() * 70, 9, 4);
      txt('TOM YUM GOONG', 128, 236, 22, '#ffd24a'); });
    cell(13, () => { sky('#f0f4f8', '#b8d0e8');                                  // a coach, side on
      x.fillStyle = '#ffffff'; x.fillRect(20, 90, 216, 90); x.fillStyle = '#d8261c'; x.fillRect(20, 150, 216, 16); x.fillStyle = '#1a2a3a'; x.fillRect(30, 100, 196, 34);
      x.fillStyle = '#1a1a1a'; for (const px of [64, 190]) { x.beginPath(); x.arc(px, 182, 16, 0, 7); x.fill(); }
      txt('TO HAT YAI', 128, 40, 28, '#d8261c'); txt('DAILY · $45', 128, 226, 26, '#1a1a1a'); });
    cell(14, () => { x.fillStyle = '#fffaf2'; x.fillRect(0, 0, 256, 256);          // a calendar
      x.fillStyle = '#c81e14'; x.fillRect(0, 0, 256, 56); txt('2026', 128, 30, 30, '#ffffff');
      for (let k = 0; k < 35; k++) txt(String(k % 31 + 1), 24 + (k % 7) * 35, 80 + Math.floor(k / 7) * 34, 15, k % 7 === 0 ? '#c81e14' : '#2a2a2a'); });
    cell(15, () => { x.fillStyle = '#f6f2e6'; x.fillRect(0, 0, 256, 256);          // a rice sack's print
      x.fillStyle = '#1e7a3a'; x.fillRect(0, 70, 256, 110); txt('JASMINE RICE', 128, 104, 26, '#ffffff'); txt('ข้าวหอมมะลิ', 128, 146, 26, '#ffe14a'); txt('5 KG', 128, 214, 30, '#1e7a3a'); });
    return done(THREE, c, false);
  }
  /* one amulet in its case, for the atlas: k picks the kind */
  function drawAmulet(x, cx, cy, s, k, r) {
    const casing = k % 3 === 0 ? '#d6a640' : k % 3 === 1 ? '#c8ccd2' : '#2a2a2a';
    const clay = ['#c9b48e', '#8a6a44', '#5a4a3a', '#d8c8a4', '#b08a5a', '#7a5a3a', '#e0d0b0', '#a07a50'][k % 8];
    x.save(); x.translate(cx, cy);
    const shape = (pad) => {
      x.beginPath();
      if (k === 2) { x.moveTo(0, -s - pad); x.lineTo(s * 0.8 + pad, s * 0.8 + pad); x.lineTo(-s * 0.8 - pad, s * 0.8 + pad); x.closePath(); }
      else if (k === 3 || k === 5) x.arc(0, 0, s * (k === 5 ? 1.0 : 0.8) + pad, 0, Math.PI * 2);
      else if (k === 4) { x.moveTo(-s * 0.6 - pad, s + pad); x.lineTo(-s * 0.6 - pad, -s * 0.3); x.lineTo(0, -s - pad); x.lineTo(s * 0.6 + pad, -s * 0.3); x.lineTo(s * 0.6 + pad, s + pad); x.closePath(); }
      else if (k === 7) { x.rect(-s * 0.25 - pad, -s - pad, s * 0.5 + 2 * pad, 2 * s + 2 * pad); }
      else x.rect(-s * 0.62 - pad, -s - pad, s * 1.24 + 2 * pad, 2 * s + 2 * pad);
    };
    x.fillStyle = casing; shape(s * 0.12); x.fill();
    x.fillStyle = clay; shape(0); x.fill();
    // the image on its face: a seated figure under an arch, or a monk's head on a coin
    x.fillStyle = 'rgba(40,24,10,0.55)';
    if (k === 3 || k === 5) { x.beginPath(); x.arc(0, -s * 0.15, s * 0.32, 0, Math.PI * 2); x.fill(); x.fillRect(-s * 0.4, s * 0.15, s * 0.8, s * 0.35); }
    else if (k === 7) { for (let i = -3; i <= 3; i++) x.fillRect(-s * 0.2, i * s * 0.26, s * 0.4, s * 0.06); }
    else {
      x.beginPath(); x.arc(0, -s * 0.38, s * 0.16, 0, Math.PI * 2); x.fill();
      x.beginPath(); x.moveTo(-s * 0.36, s * 0.42); x.quadraticCurveTo(0, -s * 0.3, s * 0.36, s * 0.42); x.closePath(); x.fill();
      x.fillRect(-s * 0.46, s * 0.42, s * 0.92, s * 0.1);
      if (k === 0) { x.strokeStyle = 'rgba(40,24,10,0.5)'; x.lineWidth = 2; x.beginPath(); x.arc(0, -s * 0.1, s * 0.5, Math.PI, 0); x.stroke(); }
    }
    x.fillStyle = 'rgba(255,255,255,0.22)'; x.beginPath(); x.ellipse(-s * 0.2, -s * 0.5, s * 0.25, s * 0.1, -0.5, 0, Math.PI * 2); x.fill();
    x.restore();
  }
  /* red velvet under a counter's glass, rows of cased amulets on it */
  function makeVelvetTray(THREE, cnv, seed) {
    const [c, x] = sized(cnv, 1024, 256), r = rng(seed);
    const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#6a0c10'); g.addColorStop(1, '#4a0608');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 256);
    for (let i = 0; i < 1800; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '120,20,24' : '30,0,2'},${r() * 0.3})`; x.fillRect(r() * 1024, r() * 256, 2, 2); }
    for (let row = 0; row < 3; row++) for (let i = 0; i < 16; i++) {
      drawAmulet(x, 34 + i * 63 + (row % 2) * 12, 46 + row * 80, 24, (i + row * 3 + (seed % 5)) % 8, r);
      x.fillStyle = '#f4ecd8'; x.fillRect(22 + i * 63 + (row % 2) * 12, 78 + row * 80, 26, 9);   // its price tag
    }
    return done(THREE, c, false);
  }
  /* framed amulets, one kind to a cell, for the wall cabinets */
  function makeAmuletAtlas(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 512), r = rng(77);
    for (let k = 0; k < 8; k++) {
      const cx = (k % 4) * 256, cy = ((k / 4) | 0) * 256;
      x.fillStyle = '#efe6d0'; x.fillRect(cx, cy, 256, 256);
      x.fillStyle = '#5a0a0c'; x.fillRect(cx + 18, cy + 18, 220, 220);                    // the velvet of the frame's mount
      drawAmulet(x, cx + 128, cy + 128, 70, k, r);
    }
    return done(THREE, c, false);
  }
  /* a Thai wall calendar: the red header, a temple picture, the month's grid */
  function makeCalendar(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 384);
    x.fillStyle = '#fbf7ee'; x.fillRect(0, 0, 256, 384);
    x.fillStyle = '#b21a12'; x.fillRect(0, 0, 256, 40);
    x.fillStyle = '#ffe08a'; x.font = 'bold 22px sans-serif'; x.textAlign = 'center'; x.fillText('ตุลาคม 2568', 128, 28);   // (CP13: October, B.E. 2568 — his room's month; it read May 2569)
    const g = x.createLinearGradient(0, 44, 0, 196); g.addColorStop(0, '#f6b04a'); g.addColorStop(1, '#8a2a12');
    x.fillStyle = g; x.fillRect(12, 46, 232, 150);
    x.fillStyle = '#e8b030'; x.beginPath(); x.moveTo(128, 70); x.lineTo(168, 180); x.lineTo(88, 180); x.fill();   // a chedi
    x.fillStyle = '#3a2a2a'; x.font = '15px sans-serif';
    for (let d = 0; d < 31; d++) { const col = d % 7, row = (d / 7) | 0; x.fillStyle = d === 30 ? '#b21a12' : '#3a2a2a'; x.fillText(String(d + 1), 26 + col * 34, 226 + row * 32); }
    return done(THREE, c, false);
  }
  /* the wall clock's face (the hands are meshes, so the time can pass) */
  function makeClockFace(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    x.fillStyle = '#fbfaf6'; x.beginPath(); x.arc(128, 128, 124, 0, Math.PI * 2); x.fill();
    x.strokeStyle = '#2a2a2a'; x.lineWidth = 6; x.stroke();
    x.fillStyle = '#1a1a1a'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = 'bold 26px sans-serif';
    for (let h = 1; h <= 12; h++) { const a = h / 12 * Math.PI * 2; x.fillText(String(h), 128 + Math.sin(a) * 96, 128 - Math.cos(a) * 96); }
    for (let m = 0; m < 60; m++) { const a = m / 60 * Math.PI * 2, L = m % 5 ? 6 : 12; x.lineWidth = m % 5 ? 2 : 4;
      x.beginPath(); x.moveTo(128 + Math.sin(a) * 118, 128 - Math.cos(a) * 118); x.lineTo(128 + Math.sin(a) * (118 - L), 128 - Math.cos(a) * (118 - L)); x.stroke(); }
    return done(THREE, c, false);
  }
  /* the red board behind the shop's Buddha (chapter 1's v19.1 lai rot nam,
     redrawn at a shop's size) */
  function makeAltarScreen(THREE, cnv) {
    const W = 768, H = 640, [c, x] = sized(cnv, W, H), r = rng(41);
    const GOLD = '#d7a548', GOLD2 = '#f0cf7a', DEEP = '#6d140e';
    const g = x.createRadialGradient(W / 2, H * 0.42, 50, W / 2, H * 0.5, W * 0.72);
    g.addColorStop(0, '#7a1a12'); g.addColorStop(1, '#5a0f0a');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    const B = 70, P = 80;
    x.save(); x.beginPath(); x.rect(B, B, W - 2 * B, H - 2 * B); x.clip();
    x.strokeStyle = GOLD; x.lineWidth = 2.5;
    for (let k = -H; k < W + H; k += P) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k + H, H); x.stroke(); x.beginPath(); x.moveTo(k, H); x.lineTo(k + H, 0); x.stroke(); }
    const flower = (cx, cy, rr) => {
      x.fillStyle = GOLD;
      for (let i = 0; i < 4; i++) { x.save(); x.translate(cx, cy); x.rotate(i * Math.PI / 2);
        x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(rr * 0.55, -rr * 0.35, rr * 0.75, -rr * 0.05, rr, 0); x.bezierCurveTo(rr * 0.75, rr * 0.05, rr * 0.55, rr * 0.35, 0, 0); x.fill(); x.restore(); }
      x.fillStyle = GOLD2; x.beginPath(); x.arc(cx, cy, rr * 0.2, 0, Math.PI * 2); x.fill();
    };
    for (let row = 0, y = 0; y <= H + P; row++, y += P / 2) for (let xx = (row % 2) * P / 2; xx <= W + P; xx += P) flower(xx, y, 20);
    x.restore();
    x.fillStyle = DEEP; x.fillRect(0, 0, W, B); x.fillRect(0, H - B, W, B); x.fillRect(0, 0, B, H); x.fillRect(W - B, 0, B, H);
    x.strokeStyle = GOLD; x.lineWidth = 5; x.strokeRect(10, 10, W - 20, H - 20); x.lineWidth = 3; x.strokeRect(B - 6, B - 6, W - 2 * B + 12, H - 2 * B + 12);
    for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '255,220,150' : '30,6,4'},${r() * 0.07})`; x.fillRect(r() * W, r() * H, 2 + r() * 3, 1 + r() * 2); }
    return done(THREE, c, false);
  }
  /* boxes of amulet cases on the back shelves, labels in Thai and English */
  function makeBoxRow(THREE, cnv) {
    const [c, x] = sized(cnv, 512, 128), r = rng(53);
    x.fillStyle = '#3a2a1e'; x.fillRect(0, 0, 512, 128);
    for (let i = 0; i < 12; i++) {
      const w = 34 + r() * 8; x.fillStyle = ['#e8e0cc', '#c8a050', '#d8d4cc', '#8a1a14', '#f2ecd8'][(r() * 5) | 0];
      x.fillRect(6 + i * 42, 20 + r() * 20, w, 108);
      x.fillStyle = 'rgba(60,30,10,0.8)'; x.font = 'bold 12px sans-serif'; x.fillText(['LP', 'พระ', '#', 'AJ', 'วัด'][i % 5] + ((i * 37) % 90 + 10), 10 + i * 42, 70);
    }
    return done(THREE, c, false);
  }

  /* the roller shutter's slats, grey and rust-streaked */
  function makeShutter(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 256), r = rng(73);
    for (let y = 0; y < 256; y += 16) {
      const g = x.createLinearGradient(0, y, 0, y + 16);
      g.addColorStop(0, '#9aa0a4'); g.addColorStop(0.45, '#c8ccd0'); g.addColorStop(0.55, '#7c8286'); g.addColorStop(1, '#5c6064');
      x.fillStyle = g; x.fillRect(0, y, 256, 16);
    }
    for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(120,64,30,${0.05 + r() * 0.12})`; x.fillRect(r() * 256, r() * 256, 2 + r() * 3, 10 + r() * 50); }
    return done(THREE, c, true);
  }

  /* ============================================================== THE FILMS
     Stubs until CP9 (the opening film and the home film), CP5 (the counter's films M and K) and CP7 (the three
     possessions). Each begins and ends as it will: the opening film on black and back to it (the v4.6 law, the card
     over its black); a film from play out of the picture into black, its black handed to the kit's fade (v21.0). */
  /* THE OPENING FILM · "Closing Time" (§4.0a, CP9): every picture from stage.introF's frame(t); this holds its cues, its
     fades and the one track that calls it. It begins on black and ends on it, the chapter card over that black (the v4.6
     law: keepFade). Every cue literal (the CUE_RE law), its times at file scope (CP7's law) */
  function introFilm(c, s, api) {
    const { tr, step, sfx, sfxFade, fade, rawK, stage } = api;
    const F = stage.introF;
    c.keepFade = true;
    c.endFade = 1;
    fade(0, 0, 1, 1);
    tr(0, OFT.end, (k, t) => F.frame(t, api), rawK);
    sfx(0.2, 'k5mall', 0.5);                             // the mall's hush after hours
    sfx(0.9, 'k5shutter', 0.22);                         // a shutter rolling down, far off
    fade(OFT.o1, OFT.o1 + 1.4, 1, 0);                    // O1 · up on the corridor
    sfx(OFT.o1, 'k5steps', 0.4);                         // his own steps on the corridor's tiles, out of the lift lobby to the light
    sfx(OFT.o1 + 3.9, 'k5steps', 0.4);                   // (CP13: the take's footfalls are its first 3.75 s of 6.0, and the walk
    sfx(OFT.o1 + 7.8, 'k5steps', 0.4);                   //  is 11 — a fresh take every 3.9 s carries him to the glass)
    sfx(OFT.line, 'z5pro1', 1);                          // "While I was still searching for answers... I began keeping Kumanthong."
    sfx(OFT.sh0, 'k5shutter', 0.5);                      // the grocer's, rolling down as he passes
    sfxFade(OFT.o2 - 1.6, OFT.o2 + 0.1, 'k5steps');      // and they go as he slows, and stop where he stops (CP13: he eases to a stop now)
    /* (CP13: the owner beckons him in — his hand and a nod, posed by the film's clock in stage.introF's frame) */
    sfx(OFT.open, 'k5shopbell', 0.6);                    // the door's bell as it opens
    fade(OFT.black0, OFT.black1, 0, 1);
    step(OFT.end, () => F.end());
  }
  function playFilm(c, api) {                  // the shape every film from play keeps (CP5, CP7, CP9 fill each)
    const { step, fade } = api;
    c.keepFade = true;                         // its last black is handed to the kit's fade: the next world lifts it
    c.endFade = 1;
    fade(0, 0.6, 0, 1);
    step(1.2, () => {});
  }
  /* FILM M · "Where They Came From" (§4.0b, CP5): from his glass to the temple hall where the three were given a home, and
     back — every picture from stage.madeF's frame(t); this holds only its cues, its fades and the one track that calls it.
     ow5monk runs under all of it; the monk's chant low under the hall; its last black is handed to the kit's fade and the
     counter lifts it. Every cue is literal (the CUE_RE law), so the engine warms it before the film can start. */
  function madeFilm(c, s, api) {
    const { tr, step, sfx, sfxFade, fade, rawK, stage } = api;
    const MF = stage.madeF, T = MFT;
    c.keepFade = true;
    c.endFade = 1;
    tr(0, T.end, (k, t) => MF.frame(t, api), rawK);
    sfx(0.8, 'ow5monk', 1);                              // "Small ones who passed on young, with nowhere to go yet..."
    step(0.8, () => stage.ownerTalk(2.2));               // (his first words at the counter, before the lens leaves it)
    fade(T.b1, T.m2 - 0.1, 0, 1);                        // into black
    fade(T.m2 + 0.1, T.m2 + 1.3, 1, 0);                  // M2 · the hall at night
    sfx(T.m2 + 0.2, 'k5chantlow', 0.5);                  // the monk chanting low
    sfxFade(T.b2, T.end - 0.4, 'k5chantlow');
    fade(T.b2, T.b2 + 1.6, 0, 1);                        // and black, which the counter lifts
    step(T.end, () => MF.end());
  }
  /* FILM K · "The Card" (§4.0b, CP5): the card on his glass, read down line by line; then his face, and what he asks of the
     one who takes them home — every picture from stage.cardF's frame(t); its lines on his talking take */
  function cardFilm(c, s, api) {
    const { tr, step, sfx, sfxFade, fade, rawK, stage } = api;
    const KF = stage.cardF, T = KFT;
    c.keepFade = true;
    c.endFade = 1;
    tr(0, T.end, (k, t) => KF.frame(t, api), rawK);
    sfx(T.k2 + 0.3, 'k5pen', 0.45);                      // the last stroke of his pen, as the lens arrives on the card
    /* (CP13, the sound lens: the twelve seconds the card is READ were the shop's room tone and nothing else. The
       lullaby's theme — the home film's, under the weeks the card is about — comes in softly under the reading, and
       goes as he looks up, before the owner speaks) */
    sfx(T.k2 + 0.9, 'k5theme', 0.32);
    sfxFade(T.k3 - 0.4, T.k3 + 0.9, 'k5theme');
    sfx(T.k3 + 0.6, 'ow5never', 1);                      // "But listen, ah. Never keep them for greed..."  (10.7 s)
    step(T.k3 + 0.6, () => stage.ownerTalk(10.4));
    sfx(T.k3 + 11.6, 'ow5wrong', 1);                     // "And never ask them to do anything wrong..."  (15.7 s)
    step(T.k3 + 11.6, () => stage.ownerTalk(15.4));
    sfx(T.k3 + 27.6, 'ow5promise', 1);                   // "And not for one month, not for one year... Can or not?"  (20.2 s)
    step(T.k3 + 27.6, () => stage.ownerTalk(19.9));
    fade(T.end - 1.0, T.end - 0.1, 0, 1);
    step(T.end, () => KF.end());
  }
  /* THE HOME FILM · "Every Day" (§4.0c, CP9): every picture from stage.homeF's frame(t); this holds its cues, its fades and
     the one track. It begins on the counter's black (the kit hands it over) and its last black is handed to the kit's
     fade: PLAY I lifts it. Cues literal, times at file scope */
  function homeFilm(c, s, api) {
    const { tr, step, sfx, fade, rawK, stage } = api;
    const F = stage.homeF;
    c.keepFade = true;
    c.endFade = 1;
    fade(0, 0, 1, 1);
    tr(0, HFT.end, (k, t) => F.frame(t, api), rawK);
    fade(0.2, 1.0, 1, 0);                                // up on the flat's corridor and his door
    sfx(HFT.open, 'k5door', 0.45);                       // the door
    sfx(HFT.lamp, 'k5switch', 0.45);                     // the lamp
    fade(HFT.ins - 0.25, HFT.ins, 0, 1); fade(HFT.ins, HFT.ins + 0.3, 1, 0);   // (a cut through black to the inserts)
    sfx(HFT.ins + 0.4, 'z5pro2', 1);                     // "I saw it as another way of making merit... and showing compassion."
    sfx(HFT.ins + 0.5, 'k5unwrap', 0.4);
    sfx(HFT.ins + 0.5, 'k5figset', 0.35); sfx(HFT.ins + 1.1, 'k5figset', 0.35); sfx(HFT.ins + 1.7, 'k5figset', 0.35);
    sfx(HFT.ins2 + 0.3, 'k5set', 0.35);                  // the box set down
    sfx(HFT.ins3 + 0.4, 'k5set', 0.35);                  // the first drink
    sfx(HFT.ins4 + 0.3, 'k5flick', 0.4); sfx(HFT.ins4 + 0.6, 'k5catch', 0.35);
    fade(HFT.h2 - 0.3, HFT.h2, 0, 1); fade(HFT.h2, HFT.h2 + 0.5, 1, 0);       // H2 · the weeks
    sfx(HFT.h2 + 0.2, 'k5theme', 0.5);                   // the lullaby's theme under the weeks
    sfx(HFT.h2 + 1.0, 'z5pro3', 1);                      // "So I took them home... and made offerings to them, every day."
    sfx(HFT.h2 + 5.0, 'k5rain', 0.3);                    // rain once
    sfx(HFT.h2 + 8.0, 'k5koel', 0.3);                    // a koel at a dawn
    fade(HFT.h3 - 0.3, HFT.h3, 0, 1); fade(HFT.h3, HFT.h3 + 0.6, 1, 0);       // H3 · tonight
    sfx(HFT.h3 + 0.4, 'k5door', 0.45);
    sfx(HFT.h3 + 1.2, 'z5pro4', 1);                      // "Then one night, after everything else I had been through... I wanted to know something."  (CP12: 6.7 s, inside the film)
    sfx(HFT.bag + 0.15, 'k5bag', 0.4);                   // the shop's bag set on the desk (CP13: as it lands, in its insert)
    sfx(HFT.lamp2, 'k5switch', 0.45);                    // the lamp on their faces
    fade(HFT.black0, HFT.black0 + 1.0, 0, 1);            // black, handed to play
    step(HFT.end, () => F.end());
  }
  /* POSSESSION 1 · THE RED ONE (§4.4, CP7): every picture from stage.redF's frame(t); this holds its cues (literal, the
     CUE_RE law), its STAMP (the player's three taps: a craft event the film runs on through; untapped, he stamps by
     himself) and its lines. Begins on the yield's last frame (no black); ends on his own view on the mat, handed back to
     play. */
  function redFilm(c, s, api) {
    const { tr, step, sfx, fade, rawK, stage, event } = api;
    const F = stage.redF, T = RFT, W = stage.W;
    c.keepFade = true;
    c.endFade = 0;
    tr(0, T.end, (k, t) => F.frame(t, api), rawK);
    sfx(0.0, 'k5rise', 0.6);                                 // the double rising off its base
    sfx(T.contact, 'k5enter', 0.7);                          // a soft swell, a child's breath of a laugh
    sfx(T.stand, 'k5red', 0.5);                              // the bossy motif: toy drum, ching, klong yao
    sfx(T.stand + 0.2, 'z5b1', 1);                           // "Mine! These are all MINE!"
    event(T.stamp, { kind: 'craft', label: W.titleStamp, steps: [{ g: 'tap', n: 3, word: W.craftStamp }],
                     at: { sx: 0.5, sy: 0.74 }, onProgress: (si, k) => stage.redStampTo(Math.round(k * 3)) });
    step(T.stamp + 2.5, () => stage.redStampAuto(0));          // untapped for 2.5 s, he stamps by himself
    step(T.stamp + 2.95, () => stage.redStampAuto(1));
    step(T.stamp + 3.4, () => stage.redStampAuto(2));
    step(T.march - 0.05, () => stage.redStampEnd());          // (the march: the stamp's moment is over)
    sfx(T.march, 'z5b2', 1);                                 // "Nobody touches my things! Nobody!"
    sfx(T.desk + 0.6, 'k5thud', 0.6);                        // the carton hits the floor
    sfx(T.grab + 1.0, 'k5slurp', 0.6);
    sfx(T.slam, 'k5slam', 0.7);
    sfx(T.slam + 0.05, 'k5rattle', 0.5);
    sfx(T.slam + 0.3, 'z5b3', 1);                            // "More! I want MORE!"
    sfx(T.flop + 0.5, 'k5bump', 0.6);
    sfx(T.flop + 1.2, 'z5b4', 1);                            // "...They didn't want me any more."
    sfx(T.leave, 'k5leave', 0.6);
    sfx(T.self, 'z5back1', 1);                               // "That wasn't me... That was him."
    sfx(T.self + 3.5, 'z5back1b', 1);                        // "He wasn't angry. He just wanted someone to want him."
    sfx(T.end - 2.6, 'z5again1', 1);                         // "...One more."  (CP12: 0.35 s after the line before, measured)
    step(T.end, () => F.end());
  }
  /* POSSESSION 2 · THE SHY ONE (§4.4, CP7): stage.shyF's pictures; its PEEK (drag the fingers apart: a craft slide the
     film runs on through) and its lines. */
  function shyFilm(c, s, api) {
    const { tr, step, sfx, fade, rawK, stage, event } = api;
    const F = stage.shyF, T = SFT, W = stage.W;
    c.keepFade = true;
    /* (CP13, the films lens: it handed play a different view and eye height with no black between — on the floor by the
       desk, turned to the little one — so it ends on a short black, after his last line, which the kit's fade lifts) */
    c.endFade = 1;
    fade(T.end - 0.55, T.end - 0.05, 0, 1);
    tr(0, T.end, (k, t) => F.frame(t, api), rawK);
    sfx(0.2, 'k5scurry', 0.6);
    sfx(1.3, 'k5giggle', 0.5);                               // behind him, a child who wants to be found
    sfx(T.contact, 'k5enter2', 0.6);
    sfx(T.peek0, 'k5shy', 0.45);                             // the music box and a plucked khim
    sfx(T.peek0 + 0.2, 'z5s1', 1);                           // "Hehe... you can't see me..."
    /* (low: CP13, the play's vision review — on a phone the panel under the stat bars lay over the shy one in the gap
       between the fingers, the very thing PEEK-A-BOO is about; it stands at the foot, over the fingers' bases) */
    event(T.peek, { kind: 'craft', label: W.titlePeek, low: true, steps: [{ g: 'slide', dir: 'side', len: 0.14, word: W.craftPeek }],
                    at: { sx: 0.5, sy: 0.55 }, onProgress: (si, k) => stage.shyGap(k) });
    step(T.scuttle - 0.05, () => stage.shyPeekEnd());
    sfx(T.scuttle, 'k5scuttle', 0.6);
    sfx(T.scuttle + 0.6, 'z5s2', 1);                         // "Shhh... hide... hide..."
    sfx(T.coin, 'k5coin', 0.5);
    sfx(T.coin + 0.6, 'z5s3', 1);                            // "Mine... my secret..."
    sfx(T.wait - 1.6, 'k5giggle', 0.32);                     // (CP9) under the desk, a smaller giggle: the wait is his game
    sfx(T.wait + 0.4, 'z5s4', 1);                            // "Come and find me... ...Nobody ever comes."
    sfx(T.leave, 'k5leave2', 0.5);
    sfx(T.bonk, 'k5bonk', 0.7);
    sfx(T.bonk + 0.15, 'z5back2', 1);                        // "Ow—!"
    sfx(T.out, 'k5scuttle', 0.35);                           // (CP9) and he crawls out from under it, himself
    sfx(T.out + 1.0, 'z5back2b', 1);                         // "I was hiding under my own desk... waiting for someone to find me."
    sfx(T.little, 'k5bells', 0.35);
    sfx(T.little + 1.4, 'z5again2', 1);                      // "One more. Just one more."  (CP12: 0.3 s after the line before, measured)
    step(T.end, () => F.end());
  }
  /* POSSESSION 3 · THE LITTLE ONE, and COME BACK (§4.4–§4.5, CP7): stage.littleF's pictures to the surface; then COME
     BACK, an event the film WAITS on (eventWait: the climb is his, and the film goes on when he is back); then the
     surfacing. */
  function littleFilm(c, s, api) {
    const { tr, step, sfx, sfxFade, fade, rawK, stage, eventWait } = api;
    const F = stage.littleF, T = LFT, W = stage.W;
    c.keepFade = true;
    c.endFade = 1;                                           // (CP13: as the shy one's — the surfacing ends on a short black, the aftermath by the bed lifts out of it)
    tr(0, T.come, (k, t) => F.frame(t, api), rawK);
    sfx(0.0, 'k5bells', 0.45);
    /* (the water under him is a bed now — mixBeds, while his light is the little one's — CP11) */
    sfx(T.rise + 0.4, 'k5hair', 0.35);
    sfx(T.into, 'k5lonely', 0.5);                            // the lullaby on khlui and bowed saw u, tender
    sfx(T.l1, 'z5l1', 1);                                    // "Everyone goes away..."
    sfx(T.l2, 'z5l2', 1);                                    // "You won't go... right?"
    sfx(T.tears, 'z5sob', 1);
    sfx(T.tears + 3.3, 'z5l3', 1);                           // "Stay... stay with me..."  (CP12: after the sob, 3.0 s)
    sfx(T.tick, 'k5tick', 0.4);
    sfx(T.out, 'k5bells', 0.3);
    sfx(T.out + 0.6, 'z5out', 1);                            // "His incense had burnt out... but he held on to me..."
    sfx(T.come - 2.6, 'z5come', 1);                          // "I'm sorry... I have to go back..." (said into the climb: a voice plays on
                                                             //  through a paused film, and eventWait pauses this one until he is back;
                                                             //  CP12: 3.68 s, so it is done 1.08 s into the climb — the quickest
                                                             //  surfacing is 0.8 s of event, then the gasp 0.5 s after it)
    sfx(T.come - 0.4, 'k5climb', 0.6);                       // COME BACK: the swell toward the light (it plays on through the paused film)
    step(T.come - 0.1, () => stage.comeBegin());
    eventWait(T.come, stage.comeOpts(), (r) => stage.comeDone(r));
    step(T.come + 0.2, () => stage.surfaceStart());
    sfx(T.come + 0.25, 'k5surface', 0.8);                    // (it plays when the film runs on — after he is back)
    sfxFade(T.come + 0.2, T.come + 3.2, 'k5climb');           // (and the climb goes down under the surfacing)
    sfx(T.come + 0.5, 'z5gasp', 1);
    tr(T.come + 0.2, T.come + 5.8, (k, t) => stage.surfaceFrame(t - T.come - 0.2, api), rawK);   // (CP12: 4.2 → 5.8, the gasp's 5.07 s inside it)
    fade(T.come + 5.25, T.come + 5.75, 0, 1);
    step(T.come + 5.8, () => F.end());
  }

  /* ============================================================ THE ENDINGS (CP8, §4.8) AND THE EPILOGUE (§4.9)
     Each scene holds its cues and its fades; the one track that draws it is the stage's ending controller at the
     scene's clock (stage.endT — chapter 4's shape), so a skip lands on the frame the clock says. The lines run in the
     plan's order, each after the one before has ended (their SECS are estimates until CP11 records them); every gap is
     held by a sound with a reason (v21.30). The epilogue is the same in every ending, from END[k].epi. The card lies
     over the counter the epilogue began on, the black clearing under it (keep.view, endFade). */
  function endScene(c, api, k, cues) {
    const { tr, step, rawK, stage } = api;
    const T = END[k];
    step(0, () => stage.endT.begin(k, api));
    tr(0, T.end, (kk, t) => stage.endT.frame(k, t, api), rawK);
    cues(T);
    epiCues(api, T.epi);
    step(T.end, () => { api.handsRoot.visible = true; });
    c.endFade = 1;
    c.keep.view = true;
  }
  /* THE EPILOGUE's sound and its blacks: the counter fades up as the lullaby rises; his first line over the three; the
     black; the case file's own last words over it */
  function epiCues(api, e) {
    const { sfx, fade } = api;
    fade(e, e + 1.4, 1, 0);
    sfx(e + 0.2, 'k5epi', 0.7);                              // the lullaby, in full (the episode's closing music)
    sfx(e + 1.5, 'z5epi0', 1);                               // "They were never something to fear..."  (→ ~10.5)
    fade(e + EPI.fade0, e + EPI.fade1, 0, 1);
    sfx(e + 14.5, 'z5epi1', 1);                              // "Looking back today, I can see clearly how dangerous..."  (→ 22.7)
    sfx(e + 23.4, 'z5epi2', 1);                              // "Some lessons are only learned by living them."  (→ 25.7)
    sfx(e + 26.6, 'z5epi3', 1);                              // "This is the one experiment I would tell everybody never to repeat."  (→ 30.5)
  }
  /* A · STAY WITH THEM (worst): pity without a boundary, told in his body */
  function scStay(c, s, api) {
    const { sfx, sfxFade, fade } = api;
    endScene(c, api, 'A', (T) => {
      sfx(0.3, 'z5A1', 1);                                   // "He asked me to stay... Tomorrow night, I will."  (→ ~3.7)
      fade(T.a1 - 0.25, T.a1, 0, 1); fade(T.a1, T.a1 + 0.35, 1, 0);          // (a cut through black: night two)
      sfx(T.a1 + 0.15, 'k5flick', 0.35);                     // the lighter
      sfx(T.a1 + 0.9, 'k5enter', 0.45);                      // the blue, from the edges of sight
      fade(T.a2 - 0.3, T.a2, 0, 1); fade(T.a2, T.a2 + 0.6, 1, 0);
      sfx(T.a2 + 1.0, 'k5koel', 0.35);                       // a koel outside, the first bird
      sfx(9.0, 'z5A2', 1);                                   // "Every night, it was easier to go..."  (→ ~11.8)
      sfx(T.a3 + 0.5, 'k5doorbell', 0.32);                   // the flat's doorbell, far off through the door; nobody answers
      sfx(T.a3 + 1.6, 'k5doorbell', 0.28);
      fade(T.a4 - 0.3, T.a4, 0, 1); fade(T.a4, T.a4 + 0.4, 1, 0);
      sfx(T.a4 + 0.1, 'k5enter2', 0.4);                      // the amber, the shy one's
      sfx(T.a4 + 1.6, 'k5buzz', 0.45);                       // his phone on the boards
      sfx(T.a4 + 2.5, 'k5buzz', 0.4);
      sfx(T.vm, 'ma5vm', 1);                                 // "Boy... why you never pick up?..."  (→ ~25.5)
      sfx(25.8, 'z5A3', 1);                                  // "...and harder to come back."  (→ ~28.0)
      fade(T.a5 - 0.4, T.a5, 0, 1); fade(T.a5, T.a5 + 0.8, 1, 0);
      sfx(T.gig, 'z5Agig', 1);                               // a giggle — out of HIS mouth
      sfx(37.0, 'z5A4', 1);                                  // "That... wasn't me."  (→ ~39.0)
      sfx(44.0, 'z5A5', 1);                                  // "I stopped being sure where they ended... and where I began."  (→ ~48.6)
      sfx(T.a7 + 0.7, 'k5endA', 0.6);                        // the key turned once: the box running down
      sfxFade(T.fade, T.epi - 0.15, 'k5endA');               // (CP13: and it goes with the black, never under the epilogue's lullaby)
      sfx(52.0, 'z5A6', 1);                                  // "They needed someone to look after them... and I couldn't do it any more."  (→ ~56.6)
      fade(T.fade, T.epi - 0.15, 0, 1);
    });
  }
  /* B · TELL THE WORLD (bad): he gives the experiment to strangers, and they make it the horror the chapter clears */
  function scTell(c, s, api) {
    const { sfx, sfxFade, fade } = api;
    endScene(c, api, 'B', (T) => {
      sfx(0.5, 'z5B1', 1);                                   // "Nobody would believe this... unless I told them."  (→ ~3.5)
      sfx(T.b1 + 1.0, 'k5wake', 0.45);                       // the laptop wakes
      sfx(T.b2 + 0.4, 'k5type', 0.5);                        // his keys: the title, the body
      sfx(T.b2 + 1.5, 'z5B2', 1);                            // "I wrote it all down. Every child... every voice."  (→ ~11.4)
      sfx(T.b2 + 5.6, 'k5type', 0.45);
      sfxFade(T.b3 - 0.3, T.b3, 'k5type');                   // (CP13: his keys stop where he posts — the take ran on to 17.6)
      sfx(T.b3, 'k5post', 0.5);                              // POST
      fade(T.b5 - 0.5, T.b5, 0, 1); fade(T.b5, T.b5 + 0.9, 1, 0);           // (a dissolve through black: the dawn)
      sfx(T.b5 + 1.0, 'k5buzz', 0.45); sfx(T.b5 + 1.4, 'k5ping', 0.35);
      sfx(T.b5 + 2.2, 'k5buzz', 0.45); sfx(T.b5 + 2.6, 'k5ping', 0.35);
      sfx(T.b6 + 0.4, 'k5scroll', 0.4);
      sfx(T.b6 + 1.5, 'z5B3', 1);                            // "Two hundred replies... by morning."  (→ ~27.1)
      sfx(T.b7 + 0.3, 'k5ping', 0.4); sfx(T.b7 + 0.9, 'k5ping', 0.35); sfx(T.b7 + 1.5, 'k5ping', 0.3);   // the repost, its count climbing
      sfx(T.b8 + 0.3, 'k5scroll', 0.4);                      // the old member's reply
      sfx(T.b9, 'k5dm', 0.5);                                // a stranger's message
      sfx(T.b9 + 5.0, 'z5B4', 1);                            // "Someone had tried it... because of me. And I didn't know what to tell them."  (→ ~45.0)
      sfx(T.b10 + 1.5, 'k5delete', 0.45);                    // Delete thread? → Thread deleted.
      sfx(T.b11 + 0.5, 'z5B5', 1);                           // "The shy one hid from everyone... and I showed him to everyone."  (→ ~54.8)
      sfx(T.b12 + 0.1, 'k5endB', 0.6);                       // the lullaby scattered into echoes
      sfxFade(T.fade, T.epi - 0.15, 'k5endB');               // (CP13: gone with the black — it sounded on to 69.6, under the epilogue)
      sfx(T.b12 + 0.5, 'z5B6', 1);                           // "I wanted someone to believe me. Instead I made them a horror story..."  (→ ~62.8)
      sfx(T.b12 + 1.0, 'k5flick', 0.3); sfx(T.b12 + 1.8, 'k5catch', 0.3);
      fade(T.fade, T.epi - 0.15, 0, 1);
    });
  }
  /* C · WISH FOR IT ALL (bad — Chad's option): he stops giving and starts asking, and nothing answers the wrong he asks */
  function scWish(c, s, api) {
    const { sfx, sfxFade, fade } = api;
    endScene(c, api, 'C', (T) => {
      sfx(0.5, 'z5C1', 1);                                   // "If they're real... then they can help me."  (→ ~3.3)
      sfx(T.c1 + 0.6, 'z5C2', 1);                            // "Bring me luck. Bring me orders... please."  (→ ~7.6)
      fade(T.c2 - 0.3, T.c2, 0, 1); fade(T.c2, T.c2 + 0.4, 1, 0);           // (cut under black: the next days)
      sfx(T.c2 + 0.6, 'k5tape', 0.45);
      sfx(T.c2 + 1.0, 'z5C3', 1);                            // "The orders came. Maybe it was them... maybe it wasn't..."  (→ ~15.6)
      sfx(T.c2 + 1.8, 'k5tape', 0.4);
      sfx(T.c2b + 0.3, 'k5pin', 0.4);
      sfx(T.c3 + 0.3, 'k5set', 0.4); sfx(T.c3 + 0.8, 'k5slip', 0.35);       // night by night: more drinks, a wish under each
      sfx(T.c3 + 2.0, 'k5set', 0.4); sfx(T.c3 + 2.5, 'k5slip', 0.35);
      sfx(T.c3 + 3.6, 'k5set', 0.4);
      sfx(T.c4 + 0.5, 'z5C4', 1);                            // "More orders. More money. A bigger place..."  (→ ~27.9)
      sfx(T.c5 + 0.2, 'k5wind', 0.45); sfx(T.c5 + 0.9, 'k5wind', 0.45); sfx(T.c5 + 1.6, 'k5wind', 0.5);   // wound too far
      sfx(T.c5 + 2.0, 'k5boxfast', 0.45);                    // and it plays too fast
      sfx(T.c6 + 0.1, 'k5wake', 0.4);                        // the laptop: the rival's shop
      sfx(T.c6 + 1.0, 'z5Cevil', 1);                         // "And him... make him lose everything."  (→ ~36.3)
      sfxFade(T.c7 + 0.1, T.c7 + 0.3, 'k5boxfast');          // (CP13: the overwound tune ends where the slip begins — two tunes in two keys)
      sfx(T.c7 + 0.2, 'k5boxstop', 0.5);                     // nothing answers: the box slips and stops mid-phrase
      sfx(T.c8, 'z5Claugh', 1);                              // his laugh, alone, too long  (→ ~42.5)
      sfx(T.c9 + 0.3, 'z5C5', 1);                            // "If I stop asking... will it all go away?"  (→ ~48.0)
      sfx(T.c10 + 0.4, 'k5endC', 0.55);                      // the lullaby OVERWOUND
      sfx(T.c10 + 0.6, 'k5crumple', 0.45);                   // the crushed pinwheel
      sfx(T.c11, 'z5C6', 1);                                 // "They were only children... and I had turned them into a wishing well."  (→ ~58.6)
      sfx(T.c11 + 5.5, 'z5C7', 1);                           // "Nothing answered. They wouldn't do wrong... even when I asked them to."  (→ ~63.9)
      fade(T.fade, T.epi - 0.15, 0, 1);
    });
  }
  /* D · CARE FOR THEM (best): loving kindness with a boundary, for life */
  function scCare(c, s, api) {
    const { sfx, sfxFade, fade, step, stage } = api;
    endScene(c, api, 'D', (T) => {
      sfx(0.5, 'z5D1', 1);                                   // "I'm sorry. That was my mistake... not yours."  (→ ~3.9)
      sfx(T.d1 + 0.6, 'k5sand', 0.35); sfx(T.d1 + 1.2, 'k5sand', 0.35); sfx(T.d1 + 1.8, 'k5sand', 0.35);   // the stubs lifted out
      sfx(T.d1b + 0.5, 'k5flick', 0.45);                     // the lighter
      sfx(T.d1b + 2.3, 'k5catch', 0.4);                      // the tips catch
      sfx(T.d1b + 4.1, 'k5wave', 0.4);                       // waved out
      sfx(T.d2 + 0.5, 'k5sand', 0.4); sfx(T.d2 + 1.2, 'k5sand', 0.4); sfx(T.d2 + 1.9, 'k5sand', 0.4);       // one in each bowl
      sfx(T.d2b + 0.2, 'k5pour', 0.4);                       // the cups topped up
      sfxFade(T.d2c, T.d2c + 0.5, 'k5pour');                 // (CP13: a top-up is a second and a half; the take is 14 s)
      sfx(T.d2c + 0.3, 'k5capoff', 0.4); sfx(T.d2c + 0.9, 'k5slide', 0.35);  // the red one's drink, new
      sfx(T.d3 + 0.3, 'k5wind', 0.45);                       // the box wound, gently
      sfx(T.d3 + 2.0, 'k5lullaby', 0.5);                     // and it plays
      sfxFade(T.court - 0.6, T.court + 0.3, 'k5lullaby');    // (CP13: the box is at home — it played on into the temple the next morning)
      sfx(T.d4 + 0.2, 'k5wai', 0.4);
      sfx(T.d4 + 0.5, 'z5D2', 1);                            // "I won't open that door again. But I'm not going anywhere."  (→ ~26.5)
      sfx(T.d5 + 0.2, 'k5calm', 0.5);                        // the smoke straight; the bells still
      fade(T.court - 0.6, T.court, 0, 1); fade(T.court, T.court + 0.8, 1, 0);   // (a slow dissolve to first light)
      sfx(DT.bell, 'k5tbell', 0.6);                          // the bell in its pavilion
      sfx(T.court + 1.5, 'z5D3', 1);                         // "In the morning, I went to the temple... and made merit in their names."  (→ ~37.9)
      sfx(DT.kneel + 0.5, 'z5D4', 1);                        // "For the three children in my care... may this merit reach you..."  (→ ~48.5)
      sfx(DT.teach + 0.3, 'mk5teach', 1);                    // the monk: "Give without bargaining..."  (→ ~54.8)
      sfx(DT.pour0 - 0.6, 'mk5yatha', 1);                    // the Yathā vārivahā as the water is poured
      step(DT.pour0 - 0.6, () => stage.endT.yatha());        // (its four lines captioned, chapter 4's)
      sfx(DT.pour0 + 0.1, 'k5pour', 0.45);
      sfxFade(DT.pour1 - 0.7, DT.pour1 + 0.7, 'k5pour');     // (CP13: the sound stops with the stream, as chapter 4's does)
      sfx(DT.earth0, 'k5ground', 0.45);                      // the water given to the earth
      sfx(DT.lights, 'k5lights', 0.8);                       // and three lights rising (CP8: louder, its swell given 2.5 s more)
      fade(T.home - 0.3, T.home, 0, 1); fade(T.home, T.home + 0.7, 1, 0);   // home, the morning
      sfx(T.home + 0.2, 'k5window', 0.4);
      sfx(T.home + 0.8, 'k5koel', 0.35);
      sfx(T.home + 2.5, 'k5pin', 0.4);                       // the morning's receipt pinned
      sfx(T.years + 0.5, 'k5endD', 0.6);                     // the lullaby resolved, warm, with strings
      sfx(T.years + 1.0, 'z5D5', 1);                         // "I kept caring for them every day... for years..."  (→ ~85.5)
      sfx(T.y2 + 0.1, 'k5tbell', 0.35); sfx(T.y4 + 0.1, 'k5tbell', 0.35); sfx(T.y6 + 0.1, 'k5tbell', 0.35);
      sfx(T.env + 0.4, 'k5pen', 0.4);                        // the envelope, in his own capitals
      sfx(T.env + 1.0, 'z5D6', 1);                           // "If one day I can't look after them... someone will. I made sure of it."  (→ ~92.9)
      sfx(T.envBox + 0.2, 'k5slip', 0.4);                    // slipped under the music box
      fade(T.fade, T.epi - 0.15, 0, 1);
    });
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e3c5 = Object.assign(DATA, {
    build,
    scenes: [scStay, scTell, scWish, scCare],
    intro: introFilm,
    films: { made: madeFilm, card: cardFilm, home: homeFilm, red: redFilm, shy: shyFilm, little: littleFilm }
  });
})();
