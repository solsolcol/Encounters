/* Episode 4 · Chapter 2 · "Not Every Master Should Be Trusted"
   ---------------------------------------------------------------------------
   THE SECOND CHAPTER OF CASE FILE 4, "The Teacher In White" — the second half of S1·11. Back in Singapore his mind
   "became extremely foggy": he cannot follow a customer, he loses his wallet and cannot remember what he did with it,
   and a tall shape by the door in the dark is a figure until he looks again. A note in his own hand says CALL PONG.
   Pong, who sent him to the first master on someone else's word, vouches for a master himself this time — Lersi Chin,
   who helped Pong's mother and has just arrived in Singapore — and brings him to the shop. Lersi Chin examines him by
   his own practice, says what he believes, clears him, and warns him to leave it there. The decision is what he does
   with what happened.

   WHAT THE PLAYER LEARNS TO DO: LET IT REST. Chapter 1 taught looking; this one the two things after it: tell what you
   saw, not what you think it meant; and when you have enough to decide, stop proving. The play is inside THE FOG —
   episode 3 chapter 4's cold given a grey tint (the v25.0 opt-in), his own sight dulled — and it lifts in the clearing.

   FAIRNESS (Chad's standing rule: no practice and no practitioner is ever the villain). Lersi Chin is sincere,
   competent within his own training and kind; he says what he BELIEVES, never what is certain; he never names or
   denounces the first master (who is neither seen nor heard here); he asks about doctors; he says thank you, never
   anumodana (Chad, v24.25). Every efficacy is belief: "afterwards I gradually felt like myself again" is his.

   ONE WORLD: his shop (chapter 1's World S, copied — chapters are copied, not bundled — and moved to the origin), at
   noon in the fog and at night with the shutter half down. He is never seen: every shot is his eyes (Chad, 9 Nov: a
   mirror "will then require a new master zavier model").

   docs/V25.0-E4C2-PLAN.md is the build's memory (§14 the log, checkpoint by checkpoint); masters/v25.0/script/lines.py
   every line it speaks. */

(() => {
  'use strict';

  let S = null;

  /* ---------------------------------------------------- the light presets (§3.3)
     Light is presets and painted glows — never a new light on screen (v15.1). The fog itself is not a preset: it is the
     engine's cold, grey (kit.chill with tint 'grey') and the smear, laid over whichever light the hour has. */
  const sky = (o) => Object.assign({ stars: 0, moon: 0, sun: 0, clouds: 0 }, o);
  const DAY = sky({                   // his shop at noon, the mall open round it (the fog drains it on top)
    stops: [[0.00, '#e2e6ea'], [0.12, '#d8dde4'], [0.35, '#c8d0da'], [0.65, '#b6c0cc'], [1.00, '#a2aebe']],
    bg: 0xc2cad4, fog: [0xd2d8de, 0.004],
    hemi: [0xeef1f4, 0x847e74, 1.02], key: [0xfff2e0, 0.62, 0, 6, 6], fill: [0xccd8e6, 0.34],
    vmHemi: [0xeef1f4, 0x847e74, 1.0], vmKey: [0xfff2e0, 0.7] });
  const NIGHT = sky({                 // after closing, alone: the ceiling off, the counter's LEDs low, the corridor's night light under the half shutter
    stops: [[0.00, '#2a2d34'], [0.12, '#24272e'], [0.35, '#1d1f25'], [0.65, '#16171c'], [1.00, '#101115']],
    bg: 0x121318, fog: [0x1c1d22, 0.006],
    hemi: [0xa8b2c8, 0x2a2420, 0.52], key: [0xffe2c0, 0.32, 0, 1.4, 4.5], fill: [0x7480a8, 0.19],
    vmHemi: [0xa8b2c8, 0x2a2420, 0.5], vmKey: [0xffe2c0, 0.32] });
  const LIT = sky({                   // the same night, his lights back on (the shape by the door seen for what it is)
    stops: [[0.00, '#2a2d34'], [0.12, '#24272e'], [0.35, '#1d1f25'], [0.65, '#16171c'], [1.00, '#101115']],
    bg: 0x121318, fog: [0x1c1d22, 0.006],
    hemi: [0xeef0f2, 0x6a625a, 0.86], key: [0xfff0dc, 0.55, 0, 6, 5], fill: [0xc0cce0, 0.28],
    vmHemi: [0xeef0f2, 0x6a625a, 0.86], vmKey: [0xfff0dc, 0.6] });
  const VISIT = sky({                 // the next evening, closed to the mall: the cases lit, the ceiling off, warm and low
    stops: [[0.00, '#2a2d34'], [0.12, '#24272e'], [0.35, '#1d1f25'], [0.65, '#16171c'], [1.00, '#101115']],
    bg: 0x121318, fog: [0x1c1d22, 0.006],
    hemi: [0xe6dcd0, 0x3a2e26, 0.66], key: [0xffdcb4, 0.44, 0, 3.2, 3.8], fill: [0x8a96bc, 0.2],
    vmHemi: [0xe6dcd0, 0x3a2e26, 0.7], vmKey: [0xffdcb4, 0.48] });
  const CLEAR = sky({                 // the same room, the fog lifted: warmer and with its colour back
    stops: [[0.00, '#2a2d34'], [0.12, '#24272e'], [0.35, '#1d1f25'], [0.65, '#16171c'], [1.00, '#101115']],
    bg: 0x121318, fog: [0x1c1d22, 0.005],
    hemi: [0xf4e8d8, 0x40342a, 0.76], key: [0xffd6a4, 0.52, 0, 3.2, 3.8], fill: [0x96a2c4, 0.22],
    vmHemi: [0xf4e8d8, 0x40342a, 0.78], vmKey: [0xffd6a4, 0.55] });
  const MORNING = sky({               // ending D's next morning in full colour (chapter 1's dawn shop, its own numbers)
    stops: [[0.00, '#e8ecf0'], [0.12, '#dfe4ea'], [0.35, '#cfd6e0'], [0.65, '#bcc6d4'], [1.00, '#a8b4c6']],
    bg: 0xc8d0da, fog: [0xd8dee6, 0.004],
    hemi: [0xf4f6f8, 0x8a8478, 1.10], key: [0xfff4e4, 0.70, 0, 6, 6], fill: [0xd0dcec, 0.36],
    vmHemi: [0xf4f6f8, 0x8a8478, 1.05], vmKey: [0xfff4e4, 0.75] });
  const LATER = sky({                 // ending A's days later, the mall by day, clear
    stops: [[0.00, '#e4e8ee'], [0.12, '#dce2e8'], [0.35, '#ccd4de'], [0.65, '#bac4d2'], [1.00, '#a6b2c4']],
    bg: 0xc6ced8, fog: [0xd6dce4, 0.004],
    hemi: [0xf2f4f6, 0x88827a, 1.06], key: [0xfff2e2, 0.66, 0, 6, 6], fill: [0xcedaea, 0.35],
    vmHemi: [0xf2f4f6, 0x88827a, 1.02], vmKey: [0xfff2e2, 0.72] });
  const PRESETS = { DAY, NIGHT, LIT, VISIT, CLEAR, MORNING, LATER };

  /* ---------------------------------------------------- THE FOG (§5): its strengths, set from phone photographs */
  const FOG = { chill: 0.55, smear: 0.42, cine: 0.5 };

  /* every line's length — MEASURED from its recorded take at CP10 (estimated at the script's pace until then), the
     registry carrying the same numbers; the queue books its window by it, and every film's times below are built from
     it, so a re-said line moves what follows it. The names are QUOTED on purpose: build.py gives a sound to a chapter's
     own pack only when the chapter names it in quotes (v21.1). Written from the registry by masters/v25.0/secs.py. */
  /* SECS BEGIN */
  const SECS = {      // MEASURED from the shipped takes (masters/v25.0/install.py; the registry carries the same numbers)
    /* him */
    'q2o1': 4.75, 'q2o2b': 1.97, 'q2o2': 1.69, 'q2o3': 5.37, 'q2o4': 2.33, 'q2till': 1.53, 'q2bag': 1.13,
    'q2jacket': 1.53, 'q2where': 1.51, 'q2fridge': 1.65, 'q2flowers': 3.05, 'q2note': 1.05, 'q2c1': 8.57,
    'q2c2': 2.41, 'q2c3': 0.97, 'q2v1': 6.57, 'q2tA': 10.73, 'q2tB': 4.97, 'q2tC': 3.29, 'q2tD': 0.97, 'q2e1': 0.73,
    'q2e2': 0.65, 'q2e3': 0.89, 'q2e4': 1.93, 'q2e5': 2.73, 'q2e6': 1.12, 'q2A1': 1.77, 'q2A2': 1.51, 'q2A3': 5.61,
    'q2B1': 6.49, 'q2B2': 6.49, 'q2C1': 5.61, 'q2C2': 1.65, 'q2C3': 8.49, 'q2D1': 1.79, 'q2D2': 5.61, 'q2D3': 4.41,
    'q2K1': 10.01, 'q2K2': 9.93, 'q2K3': 10.73, 'q2K4': 7.13, 'q2A': 3.77, 'q2B': 3.53, 'q2C': 3.61, 'q2D': 3.29,
    /* the customers */
    'cu2a1': 4.55, 'cu2a1b': 2.73, 'cu2b1': 2.57, 'cu2a2': 2.81,
    /* Pong */
    'pg2c1': 2.68, 'pg2c2': 13.9, 'pg2c3': 5.06, 'pg2v1': 2.57, 'pg2w1': 1.45, 'pg2A1': 5.16, 'pg2A2': 1.75,
    'pg2B1': 1.54, 'pg2C1': 0.69, 'pg2D1': 1.48,
    /* Lersi Chin */
    'lc2v1': 3.29, 'lc2sit': 2.7, 'lc2tell': 1.6, 'lc2tA': 5.21, 'lc2tB': 6.55, 'lc2tC': 5.44, 'lc2tD': 2.73,
    'lc2e1': 1.2, 'lc2e2': 0.75, 'lc2e3': 0.58, 'lc2e4': 1.93, 'lc2e5': 1.18, 'lc2e6': 4.73, 'lc2e7': 1.74,
    'lc2e8': 5.26, 'lc2e9': 4.79, 'lc2e10': 2.73, 'lc2k0': 3.21, 'lc2namo': 17.13, 'lc2sak1': 14.65, 'lc2sak2': 15.85,
    'lc2sak3': 14.57, 'lc2drink': 1.69, 'lc2wrist': 0.92, 'lc2k2': 6.66, 'lc2w1': 9.93, 'lc2B1': 7.53, 'lc2B2': 9.77,
    'lc2C1': 1.88, 'lc2C2': 5.45, 'lc2C3': 5.52, 'lc2D1': 2.65
  };
  /* SECS END */

  /* ====================================================== THE FILMS' TIMES — built from SECS (above)
     A film's script is a list: ['line', gap] (the line starts where the last thing ended; `gap` seconds follow it),
     [secs] (a pause), ['@mark'] (a named moment, at the time it is reached). The answer maps every line and mark to
     its start on the film's own clock, and `end` to where the list ends — so the cues (below the build) and the
     pictures (films, inside it) read the same numbers, and a re-measured take moves everything after it (v5.15). */
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
  /* THE FOG (§4.0, ≈ 46 s): his shop at noon, the counter heard, his pockets, the note */
  const OPEN = tl(1.8, [['@o1'], [0.6], ['q2o1', 1.4], ['@o2'], ['cu2a1', 0.5], ['q2o2b', 0.5], ['cu2a1b', 0.7], ['q2o2', 1.2],
                        ['@o3'], ['q2o3', 1.2], ['@o4'], ['q2o4', 2.0], ['@black'], [1.3]]);
  /* THE CALL (§4.1 P3, a film from play): the phone, Pong, the dark shop */
  const CALL = tl(0.6, [['@pick'], [2.6], ['@ans'], ['pg2c1', 0.5], ['q2c1', 0.6], ['@offer'], ['pg2c2', 0.9], ['q2c2', 0.6],
                        ['pg2c3', 1.1], ['q2c3', 1.3], ['@black'], [1.1]]);
  /* THE VISIT (§4.2): the next evening, the shutter lifted for them */
  const VISIT_T = tl(1.0, [['@knock'], [2.4], ['@lift'], [2.2], ['@in'], ['q2v1', 0.6], ['@altar'], [3.4], ['@intro'], ['pg2v1', 0.5],
                           ['@turn'], ['lc2v1', 0.9], ['@wai'], [1.8], ['@mat'], [4.4], ['@black'], [1.0]]);
  /* THE EXAMINATION (§4.3 P6) */
  const EXAM = tl(0.6, [['lc2e1', 0.5], ['lc2e2', 0.3], ['q2e1', 0.5], ['lc2e3', 0.3], ['q2e2', 0.6], ['lc2e4', 0.4], ['q2e3', 0.6],
                        ['lc2e5', 0.4], ['q2e4', 0.6], ['lc2e6', 0.4], ['@still'], [6.2], ['@eyes'], ['lc2e7', 0.4], ['q2e5', 0.6],
                        ['@fetch'], [5.6], ['lc2e8', 1.0], ['@believe'], ['lc2e9', 0.8], ['q2e6', 0.4], ['lc2e10', 1.4]]);
  /* THE CLEARING (§4.3 P7): the homage, Namo tassa, the Sakkatvā verses, the water, the leaves, the thread — the fog
     lifts under the second and third verses */
  const CLEARF = tl(0.8, [['lc2k0', 0.6], ['@homage'], [5.2], ['@namo'], ['lc2namo', 0.6], ['@sak'], ['lc2sak1', 0.4], ['@lift'],
                          ['lc2sak2', 0.4], ['lc2sak3', 0.8], ['@water'], ['lc2drink', 0.6], [3.2], ['@sprinkle'], [5.2], ['@thread'],
                          ['lc2wrist', 0.4], [4.2], ['@advice'], ['lc2k2', 1.4]]);
  /* THE ENDINGS (§4.5) and THE CODA (§4.6), each on its own clock; the coda follows each ending at `coda` */
  const END = {
    A: tl(0.6, [['@post'], [2.0], ['q2A1', 0.6], [2.4], ['@days'], [6.6], ['@call'], ['pg2A1', 0.5], ['q2A2', 0.4], ['pg2A2', 1.4],
                ['@cust'], ['cu2b1', 1.6], ['@last'], ['q2A3', 1.6], ['@coda']]),
    B: tl(0.6, [['q2B1', 0.5], ['@look'], [2.6], ['lc2B1', 0.6], ['lc2B2', 0.8], ['pg2B1', 0.6], ['@go'], [5.6], ['@empty'],
                ['q2B2', 1.6], ['@coda']]),
    C: tl(0.6, [['q2C1', 0.5], ['@stop'], [2.8], ['lc2C1', 0.6], ['lc2C2', 0.6], ['pg2C1', 0.4], ['q2C2', 0.5], ['lc2C3', 0.8],
                ['@go'], [5.2], ['@alone'], [3.6], ['q2C3', 2.0], ['@coda']]),
    D: tl(0.6, [['q2D1', 0.4], ['lc2D1', 0.5], ['pg2D1', 0.6], ['@go'], [4.8], ['@morning'], [4.2], ['cu2a2', 0.5], ['q2D2', 1.0],
                ['@last'], ['q2D3', 1.6], ['@coda']])
  };
  const CODA = tl(0, [['@forum'], [0.9], ['q2K1', 0.6], ['q2K2', 0.6], ['q2K3', 0.8], ['@thread'], ['q2K4', 1.0], ['@open'], [2.4],
                      ['@black'], [1.4]]);

  const DATA = {
    id: 2,
    episode: 4,
    title: 'Not Every Master Should Be Trusted',
    cardLabel: 'Chapter 2',
    cardTitle: 'Not Every Master Should Be Trusted',
    brief: 'Back in Singapore, in your own shop, you cannot think straight. Pong knows a master he can vouch for this time.',
    prompt: 'Lersi Chin is packing his things. What you do now is your own.',
    /* the decision (§4.4): A the trial's 5.5C, B new (S1·12's lesson), C Chad's own (9 Nov), D the trial's 5.3D —
       Master Z's verdicts and proportions where the option is his, the deltas the trial's ×3 as in chapter 1 */
    choices: [
      { k: 'A', text: 'Tell others the first master practises black magic',
        d: { sanity: -3, awareness: 0, wisdom: -18 }, verdict: 'worst', critical: true,
        say: 'I said it as fact. I only knew it as fear.',
        teach: 'Personal caution requires less certainty than making claims about another person. You were sure enough to stay away, and said as fact what you could not prove.' },
      { k: 'B', text: 'Ask Lersi Chin to be your teacher',
        d: { sanity: 3, awareness: 6, wisdom: 9 }, verdict: 'good',
        say: 'He couldn\'t answer me. He was honest enough to say so.',
        teach: 'Not every master can answer your deepest questions, and that is not a criticism of them. He cleared you, and was honest about what his practice could not answer.' },
      { k: 'C', text: 'Ask Lersi Chin to send it back to whoever did it',
        d: { sanity: -6, awareness: 3, wisdom: -9 }, verdict: 'bad',
        say: 'I wanted it sent back. I only kept it closer.',
        teach: 'Karma is not best understood as punishment. Karma can be a teacher. You asked for the harm to be sent back; he cleared you and would not, and you kept holding it.' },
      { k: 'D', text: 'Follow the warning and let it rest',
        d: { sanity: 6, awareness: 6, wisdom: 18 }, verdict: 'best',
        say: 'I had seen enough. I didn\'t need to prove it.',
        teach: 'Wisdom can be knowing when there is nothing more worth proving. You had enough to decide, and let it rest.' }
    ],
    /* S1·11's own lesson, its second half (chapter 1 took the first) — the case file's words verbatim (Q4) */
    core: 'Take your time, check their lineage, look for real accounts from real people, and be especially careful with anyone you do not know and cannot verify. This applies whether or not you believe anything can be placed on a person — a practitioner with poor intentions can do you harm in perfectly ordinary ways too.',

    /* units metres, y up. ONE WORLD at the origin: the shop x −2.4…2.4, z −3.2…3.0 (its shutter at z 3.0), the mall's
       corridor outside it to z 8.2. Play begins behind his counter, turned to the shop. */
    spawn:     { x: -0.25, y: 1.62, z: -2.3, rot: Math.PI },
    shrine:    { x: 0, z: -2.9 },             // the engine's anchor (ghost: null): his altar
    ghostHome: { x: 0, z: -2.9 },
    bounds:    { minX: -12, maxX: 12, minZ: -3.2, maxZ: 8.2 },

    /* NO HAUNTING: the fog is his own sight, and nothing hunts him (the shape by the door is a flower stand) */
    ghost: null,
    fireLight: null,
    daylight: DAY,

    /* (§3.2) declared reuse, each with its reason — the shop is his (chapter 1's World S, Chad's direction, 9 Nov); Pong
       is the friend who sent him and now vouches first-hand; the piece he took in chapter 1 comes back to be seen as
       what it is; the mall's people are the same mall's */
    assets: ['lersichin', 'e4pong', 'e4nangkwak', 'e4takrut', 'e4phayant', 'e4mayom', 'e4khannam', 'e4phan',
             'e4somdej', 'e4khunpaen', 'e4rian', 'e4pidta', 'e4jatukham', 'e4kring', 'e4meedmor', 'e4bucha', 'e4takrutsm', 'filmlaptop',
             'staffman', 'sitwoman', 'wifewalk', 'sitangry', 'fatherwalk'],
    /* FRESH (chaptertest) asks a chapter of episode 4 to declare what it takes from episodes 1-3 (`reuse`, printed on
       every run as a reminder); what it shares with chapter 1 of its own episode — his own shop, its stock, Pong — is
       the same story going on, declared here as data so it stays written down (Chad, v17.4: "any reuse is declared") */
    reuse: { filmlaptop: "his own laptop on his counter, as in chapter 1 — its screen the forum in ending A and the coda",
             staffman: "the goldsmith's man across the corridor, the same neighbour as in chapter 1, seen at noon through his open front",
             sitwoman: "a woman walking past his shop at noon, the same mall's people as in chapter 1, a few metres off and blurred by the fog",
             wifewalk: "her walk, the clip alone",
             sitangry: "a man walking past his shop at noon, the same mall's people as in chapter 1" },
    reuseInEpisode: { e4pong: "Pong, the Bangkok dealer of chapter 1 — he sent him to the first master on someone else's word, and vouches first-hand for Lersi Chin here (§3.2)",
             e4nangkwak: "the piece he took from the first master's tray in chapter 1, standing by his door as he was told to put it — Lersi Chin sees it and advises a temple (§2.2 #6)",
             e4takrut: "the same, when the piece he took was the takrut",
             e4phayant: "the same, when it was the pha yant",
             e4somdej: "his shop's own stock (chapter 1's World S is his shop, and Chad put this chapter in it)",
             e4khunpaen: "his shop's stock", e4rian: "his shop's stock", e4pidta: "his shop's stock", e4jatukham: "his shop's stock",
             e4kring: "his shop's stock", e4meedmor: "his shop's stock", e4bucha: "his shop's stock and the Buddha on his altar",
             e4takrutsm: "his shop's stock",
             fatherwalk: "a man's walk past his shop, the clip alone (chapter 1's mall)" },
    placeholders: {},
    items: [],

    musicVol: 0,
    /* the beds, every one at 0 here: mixBeds sets each by the hour, the fog and the beat (masters/v25.0/make.sh: looped
       by hand, levelled by RMS) — the mall by day (muffled in the fog), the shop at night (the air-con, the fridge, the
       empty corridor), the two pieces of music play has (the fog's and the visit's), and the mall by day heard clear
       (the endings' mornings). Under a film the room's beds are the film's own (films.frame: filmBedAt), so a 98 s
       film's room never stops where a one-shot of its 22 s take would have */
    ambience: { beds: [['x2mallfog', 0], ['x2nightroom', 0], ['x2fogmus', 0], ['x2visitmus', 0], ['x2mallclear', 0]] },
    voiceLine: null,

    words: {
      approach: '',
      act: 'E to act',
      actTouch: 'Tap to act',
      interact: 'E to choose what you do',
      interactTouch: 'Tap to choose what you do',
      actLine: 'Press E to choose what you do',
      actLineTouch: 'Tap to choose what you do',
      // PLAY I · the shop at noon (§4.1)
      objWallet: 'Find your wallet',
      hotTill: 'The till',
      hotBag: 'Your bag',
      hotJacket: 'Your jacket',
      hotFridge: 'The drinks fridge',
      // PLAY I · closing time (§4.1 P2, the trial's 5.4)
      objClose: 'Close up for the night',
      bannerShape: 'Something tall is standing by the door.',
      hotSwitch: 'Switch on the light',
      hotWatch: 'Stand still and watch',
      objCall: 'Call Pong',
      hotNote: 'Call Pong',
      // the call and the forum: his phone's screen and the laptop's (art, drawn into the world — words are the sheet's)
      phonePong: 'Pong',
      phoneCalling: 'calling…',
      noteText: 'CALL PONG',
      // PLAY II · the clearing (§4.3)
      objKneel: 'Kneel before Lersi Chin',
      hotKneel: 'Kneel',
      objBow: 'Bow to the Buddha',
      hotBow: 'Bow three times',
      pickLabel: 'Tell Lersi Chin',
      pickTitle: 'What happened there?',
      pickA: 'Tell Lersi Chin exactly what you saw',
      pickB: 'Ask Lersi Chin what he thinks it means',
      pickC: 'Assume the first master is using black magic',
      pickD: 'Ask Lersi Chin what you should do next',
      // the card's What you did: the trial's 5.2, its lesson in his own words
      note52A: 'You told him what you saw, not what you made of it. Evidence first, interpretation second.',
      note52B: 'You asked him what it meant. Seeing something is not the same as understanding it.',
      note52C: 'You called it black magic. Suspicion is not evidence.',
      note52D: 'You asked what to do next. The sensible step mattered more than the theory.',
      objBowHead: 'Bow your head',
      hotBowHead: 'Bow your head',
      // the chant, captioned: the Pali as chanted over its meaning (A Chanting Guide, The Dhammayut Order in the USA)
      capNamo: 'Namo tassa bhagavato arahato sammā-sambuddhassa',
      capNamoSub: 'Homage to the Blessed One, the Worthy One, the Rightly Self-awakened One.',
      capSak1a: 'Sakkatvā buddha-ratanaṁ, osathaṁ uttamaṁ varaṁ,',
      capSak1aSub: 'Having revered the jewel of the Buddha, the highest, most excellent medicine,',
      capSak1b: 'hitaṁ deva-manussānaṁ, buddha-tejena sotthinā,',
      capSak1bSub: 'the welfare of human and heavenly beings: through the Buddha\'s majesty and safety,',
      capSak1c: 'nassant\'upaddavā sabbe, dukkhā vūpasamentu te.',
      capSak1cSub: 'may all obstacles vanish. May your sufferings grow totally calm.',
      capSak2a: 'Sakkatvā dhamma-ratanaṁ, osathaṁ uttamaṁ varaṁ,',
      capSak2aSub: 'Having revered the jewel of the Dhamma, the highest, most excellent medicine,',
      capSak2b: 'pariḷāhūpasamanaṁ, dhamma-tejena sotthinā,',
      capSak2bSub: 'the stiller of feverish passion: through the Dhamma\'s majesty and safety,',
      capSak2c: 'nassant\'upaddavā sabbe, bhayā vūpasamentu te.',
      capSak2cSub: 'may all obstacles vanish. May your fears grow totally calm.',
      capSak3a: 'Sakkatvā saṅgha-ratanaṁ, osathaṁ uttamaṁ varaṁ,',
      capSak3aSub: 'Having revered the jewel of the Saṅgha, the highest, most excellent medicine,',
      capSak3b: 'āhuneyyaṁ pāhuneyyaṁ, saṅgha-tejena sotthinā,',
      capSak3bSub: 'worthy of gifts, worthy of hospitality: through the Saṅgha\'s majesty and safety,',
      capSak3c: 'nassant\'upaddavā sabbe, rogā vūpasamentu te.',
      capSak3cSub: 'may all obstacles vanish. May your diseases grow totally calm.',
      // the forum (ending A and the coda): generic, no real site's name or look
      forumName: 'Masters & Lineages',
      forumSub: 'Real accounts, shared by devotees',
      postTitle: 'Warning about an ajahn in Thailand',
      postBody: 'He practises black magic. I went to him myself. Stay away.',
      reply1: 'Proof?',
      reply2: 'My aunt has gone to him for years. He helped her.',
      reply3: 'Which shop are you? Say it to his face lah.',
      reply4: 'Name and shame!',
      reply5: 'Bro, careful what you post. You saw something, ok. You know what it was?',
      thread1: 'The lineages of the old masters, a summary',
      thread2: 'Real experiences only: who has met him?',
      thread3: 'How to check a master before you go',
      thread4: 'Lersi practice: accounts from devotees',
      thread2b: 'Keeping an altar at home: the basics',
      thread3b: 'First time at a Wai Kru: what to expect',
      threadNew: 'LF> Gathering devotees for Wai Kru in Udon Thani!',
      threadNewSub: 'just now',
      envelope: 'For the temple',
      // the card's What you did, always: whether the stand was checked or waited out
      noteLight: 'In the dark you switched on the light and looked.',
      noteWatch: 'In the dark you stood still and waited for it to show what it was.',
      noteWalk: 'In the dark you walked up to it and looked.'
    },
    sayPrefix: 'q2'
  };

  /* THE CHANT'S CAPTIONS (v21.31's law: every chant with words is captioned, the Pali as chanted over its meaning, timed
     on the take's own breaths from the line's start so it works muted too; translated from A Chanting Guide). The cut
     points are fractions of each take's measured length until CP10 times them on the breaths */
  /* (v25.0 CP10) each cut at the middle of a breath in the shipped take, measured (20 ms frames 32 dB under its peak):
     Namo's three at its two long breaths (5.0-5.74 s, 10.94-11.76 s of 17.12); each Sakkatvā verse's six lines
     paired, cut at its second and fourth breaths (lc2sak1 4.75 and 9.45 s of 14.64; lc2sak2 5.14 and 10.52 of 15.84;
     lc2sak3 4.61 and 9.51 of 14.56) */
  const CHANT_CAPS = {
    lc2namo: [['capNamo', 'capNamoSub', 0, 0.314], ['capNamo', 'capNamoSub', 0.314, 0.663], ['capNamo', 'capNamoSub', 0.663, 1]],
    lc2sak1: [['capSak1a', 'capSak1aSub', 0, 0.324], ['capSak1b', 'capSak1bSub', 0.324, 0.646], ['capSak1c', 'capSak1cSub', 0.646, 1]],
    lc2sak2: [['capSak2a', 'capSak2aSub', 0, 0.324], ['capSak2b', 'capSak2bSub', 0.324, 0.664], ['capSak2c', 'capSak2cSub', 0.664, 1]],
    lc2sak3: [['capSak3a', 'capSak3aSub', 0, 0.317], ['capSak3b', 'capSak3bSub', 0.317, 0.653], ['capSak3c', 'capSak3cSub', 0.653, 1]]
  };
  function chantCaps(name) {
    const L = SECS[name] || 10, W = DATA.words;
    return (CHANT_CAPS[name] || []).map(([a, b, f0, f1]) => ({ at: f0 * L, end: f1 * L + (f1 >= 1 ? 0.4 : 0), text: W[a], sub: W[b] }));
  }
