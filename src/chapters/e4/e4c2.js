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


  function build(ctx) {
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, cnv,
            assetBytes, rescueTextures, getState, startDecision, worldSfx, warmSounds, soundOff, unifySkeletons,
            makeHellNote, HEAD_RE } = ctx;

    /* (the v21.1 TDZ law: everything a builder or a frame asks for is declared up here, before anything is built) */
    const owned = [];
    let alive = true;
    const parsedGlb = new Map();
    const madeTex = [];
    const tex = (t) => { madeTex.push(t); return t; };
    const noteTex = tex(makeHellNote());                  // the contract wants one (the engine's note prop reads it at boot)
    const mats = [];
    const M = (o) => { const m = new THREE.MeshStandardMaterial(o); mats.push(m); return m; };
    const B = (o) => { const m = new THREE.MeshBasicMaterial(o); mats.push(m); return m; };   // unlit: a glow, a painted view
    const wallNow = () => performance.now() / 1000;

    /* ------------------------------------------------------------- the map: ONE WORLD, his shop, at the origin */
    const SX = 0;
    const world = new THREE.Group();
    scene.add(world);
    const worldS = new THREE.Group(); worldS.position.x = SX; world.add(worldS);

    const walls = [], solids = [];
    const box = (w, h, d, x, y, z, mat, parent = world, cast = true) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z); m.castShadow = cast && !LOW; m.receiveShadow = true;
      parent.add(m); return m;
    };
    const matProxy = M({ color: 0x8d7a66, roughness: 0.9 });
    const hidBox = (w, h, d, x, y, z, parent) => { const m = box(w, h, d, x, y, z, matProxy, parent, false); m.visible = false; return m; };

    /* ------------------------------------------------- one parse per asset */
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
      return parsedGlb.get(key);
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
        if (mine) { si.needsUpdate = true; sw.needsUpdate = true; }
      });
      if (n) twinMends[key] = n;
    }

    /* ============================================== HIS SHOP (chapter 1's World S, copied: CP3, §6.2)
       Chapter 1 built it for two films at dawn; here it is the whole chapter, weeks on — the cases filled, his bag, his
       jacket, the till and a drinks fridge on his side of the counter, the Grand Opening stand by the door with its
       flowers dried (nobody took it away), the note in his own hand on the glass, a light switch by the door, the piece
       he took in chapter 1 on a shelf beside it facing the door — and seen at noon in the fog and at night with the
       shutter half down. Every number below that is chapter 1's is chapter 1's, so the room is the room he opened. */
    const SHOP = { x0: -2.4, x1: 2.4, z0: -3.2, z1: 3.0, H: 3.0 };          // the unit, local to World S (its shutter at z1)
    const COR = { x0: -12, x1: 12, z0: 3.0, z1: 8.2, H: 3.6 };          // the mall's corridor outside it
    const COUNTER = { x0: -1.5, x1: 1.5, z: -1.55, h: 1.0, d: 0.6 };        // his counter (its customer face at z + d/2)
    /* (v24.22) the shop as a shop: the display inside the counter (its tray's floor, its compartments), the altar on the
       back wall behind him (its cabinet and three tiers stepping up and back, the Buddha on the top one), the statue
       shelves either side of it; on the counter's glass his laptop (its screen's UV island measured off the file: u
       −0.0033…1.0044, v −0.3276…1.3144, so repeat and offset put the whole canvas on the glass), his notebook, his pen */
    const DISPLAY = { floor: 0.52, rows: 5, cols: 28 };       // (v24.22: a dealer's compartments, 10.5 × 10.8 cm — 3 × 16 read as a tray of empty boxes)
    const SHRINE = { w: 1.2, h: 0.95, d: 0.5, tiers: [{ w: 1.2, h: 0.16, d: 0.48, y: 0.95 }, { w: 0.9, h: 0.2, d: 0.32, y: 1.11 }, { w: 0.56, h: 0.2, d: 0.2, y: 1.31 }] };
    const BU = { x0: 0.8, x1: 2.36, d: 0.34, H: 2.06, base: 0.9, ys: [1.30, 1.68] };   // (v24.22) the back wall's two display units: their inner and outer x, depth, height, the cupboard's top, the shelves
    const LAP = { x: -0.15, z: COUNTER.z - 0.06, ry: -Math.PI / 2 + 0.1, uv: [0.99236, 0.60901, 0.003275, 0.19951] };
    const BOOK_AT = { x: 0.98, z: COUNTER.z - 0.05 }, PEN_AT = { x: 1.3, z: COUNTER.z - 0.02 };
    const shop = { u: 0, uFrom: 0, uTo: 0, t0: 0, t1: 0, curtain: null, curTex: null, bar: null, spill: null, spillMat: null,
                   leds: [], ledK: 1, ledFrom: 1, ledTo: 1, l0: 0, l1: 0, phone: null, phoneOn: 0, ledger: null, pen: null,
                   lap: null, lapOn: 0, lapWed: 1, lapBar: 1, stockCount: 0 };      // (v24.22: his laptop's sales, the stock stood)
    /* (v25.0) the places this chapter adds, in the shop's frame (the world's: the shop stands at the origin) */
    const HIS = { x: -0.25, z: -2.3 };                                         // his place behind the counter
    const TILL = { x: -0.62, y: 0.33, z: COUNTER.z - COUNTER.d / 2 };          // the cash drawer, in the cupboard's back
    const BAG = { x: -1.16, z: -2.1 };                                         // his bag on the floor at the counter's end
    const STOOL = { x: 0.55, z: COUNTER.z - 0.85 };                            // his stool behind the counter (buildShop's)
    const FRIDGE = { x0: 0.78, x1: 1.32, h: 0.47, z: COUNTER.z - COUNTER.d / 2 }; // the bar fridge set into the cupboard's back, its glass door his side
    const NOTE = { x: 0.24, z: COUNTER.z + 0.02, ry: 0.12 };                  // CALL PONG, stuck on the glass beside his phone
    const SWITCH = { x: SHOP.x0 + 0.012, y: 1.3, z: 2.8 };                     // the light switch on the left wall inside the door
    const SHELF = { x: SHOP.x0 + 0.13, y: 1.48, z: 2.36 };                     // a small shelf beside it: the piece, facing the door
    const STAND = { x: 1.55, z: 2.36, ry: Math.PI + 0.42 };                    // the Grand Opening stand inside the door, turned in, its flowers dried
    const LC = { x: 0, z: -0.42 };                                             // Lersi Chin on his mat, facing the door; the altar's Buddha over his shoulder
    /* (v25.0 CP6) Lersi Chin's things made as models (masters/v25.0/models): their sizes in metres, and the places inside
       each that the code's own pieces stand at (shares of the fitted model's height and width, measured on the model) */
    const BOWL_W = 0.22, BOWL_WATER = [0.72, 0.4];                            // the bowl across; the water's height and radius
    const PHAN_W = 0.26, PHAN_TOP = 0.86;                                     // the tray across; where the candles stand in its flowers
    const MAYOM_L = 0.24, MAYOM_TIE = 0.16;                                   // the bundle's length; its tie, from the cut end
    const CL = { x: 0, z: 0.78 };                                              // where he kneels before him, facing the altar
    const PSTOOL = { x: 1.15, z: COUNTER.z + COUNTER.d / 2 + 0.42 };           // the customers' right stool (buildShop's): Pong's
    const MAT = { x: 0, z: 0.18, w: 1.24, d: 2.1 };                            // the woven mat under both
    const KNEEL = { y: 0.88, span: 1.15, lo: -0.85, hi: 0.5 };                 // his eye kneeling (sat back on his heels, his head no higher than it need be), how far he may look about
    const faceLC = () => Math.atan2(-(LC.x - CL.x), -(LC.z - CL.z));         // his view from the mat, onto Lersi Chin and the altar
    /* ---------------------------------------------------- WORLD S · HIS SHOP AT DAWN (O1–O4, K2–K3) */
    function buildShop() {
      const S0 = worldS;
      const mesh = (g, m, x, y, z, p = S0) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.receiveShadow = true; p.add(o); return o; };
      const bx = (w, h, d, m, x, y, z, p = S0) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z, p);
      const pl = (w, h, m, x, y, z, rx = 0, ry = 0, p = S0) => { const o = mesh(new THREE.PlaneGeometry(w, h), m, x, y, z, p); o.rotation.set(rx, ry, 0); return o; };
      const tTer = tex(makeTerrazzo(THREE, cnv)); tTer.repeat.set((COR.x1 - COR.x0) / 1.2, (COR.z1 - COR.z0) / 1.2);
      const tTile = tex(makeShopTiles(THREE, cnv)); tTile.repeat.set((SHOP.x1 - SHOP.x0) / 0.6, (SHOP.z1 - SHOP.z0) / 0.6);
      const tSlat = tex(makeShutterSlats(THREE, cnv));
      const tVel = tex(makeVelvet(THREE, cnv)); tVel.repeat.set(2, 1);
      const tCards = tex(makePriceCards(THREE, cnv));
      const tBub = tex(makeBubbleWrap(THREE, cnv)), tCart = tex(makeCarton(THREE, cnv));
      const tGl = tex(makeGlow(THREE, cnv));
      const mFloor = M({ map: tTile, roughness: 0.32, metalness: 0.0 });
      const mTer = M({ map: tTer, roughness: 0.4 });
      const mWall = M({ color: 0xebe5da, roughness: 0.85 });
      const mCeil = M({ color: 0xf2f0ea, roughness: 0.9, emissive: 0x4a4844 });
      const mGloss = M({ color: 0xf4f4f0, roughness: 0.25 });
      const mOak = M({ color: 0xdcc6a0, roughness: 0.55 });
      const mAlu = M({ color: 0xc8ccd0, roughness: 0.3, metalness: 0.85 });
      const mGlass = M({ color: 0xe4eef2, roughness: 0.04, metalness: 0.1, transparent: true, opacity: 0.14, depthWrite: false });
      const mVel = M({ map: tVel, roughness: 0.95 });
      const mBlack = M({ color: 0x141416, roughness: 0.4 });
      const mLed = B({ color: 0xf6fbff });
      const mSlat = M({ map: tSlat, roughness: 0.5, metalness: 0.55, side: THREE.DoubleSide });
      const mShutPaint = M({ color: 0x8c949a, roughness: 0.5, metalness: 0.5 });
      shop.leds.push(mLed);
      /* (v25.0) the ceiling's own lights and the ceiling's glow, apart from the cases' LEDs: off after closing */
      const mCeilLed = B({ color: 0xf6fbff }); props.ceil = mCeilLed;
      const mCeilS = M({ color: 0xf2f0ea, roughness: 0.9, emissive: 0x4a4844 }); props.ceilS = mCeilS;

      /* the unit: floor, walls, ceiling — the front open to the corridor above the shutter's line */
      pl(SHOP.x1 - SHOP.x0, SHOP.z1 - SHOP.z0, mFloor, 0, 0, (SHOP.z0 + SHOP.z1) / 2, -Math.PI / 2);
      pl(SHOP.x1 - SHOP.x0, SHOP.z1 - SHOP.z0, mCeilS, 0, SHOP.H, (SHOP.z0 + SHOP.z1) / 2, Math.PI / 2);
      pl(SHOP.x1 - SHOP.x0, SHOP.H, mWall, 0, SHOP.H / 2, SHOP.z0, 0, 0);
      pl(SHOP.z1 - SHOP.z0, SHOP.H, mWall, SHOP.x0, SHOP.H / 2, (SHOP.z0 + SHOP.z1) / 2, 0, Math.PI / 2);
      pl(SHOP.z1 - SHOP.z0, SHOP.H, mWall, SHOP.x1, SHOP.H / 2, (SHOP.z0 + SHOP.z1) / 2, 0, -Math.PI / 2);
      bx(SHOP.x1 - SHOP.x0, 0.12, 0.02, mGloss, 0, 0.06, SHOP.z0 + 0.01);                   // the skirting
      /* the ceiling's light: four downlights and a cove of LED along the sides */
      const dl = new THREE.CircleGeometry(0.075, 20);
      for (const [x, z] of [[-1.1, -1.6], [1.1, -1.6], [-1.1, 1.0], [1.1, 1.0]]) { const d = mesh(dl, mCeilLed, x, SHOP.H - 0.004, z); d.rotation.x = Math.PI / 2; }
      for (const sx of [-1, 1]) bx(0.03, 0.012, SHOP.z1 - SHOP.z0 - 0.2, mCeilLed, sx * (SHOP.x1 - 0.12), SHOP.H - 0.02, (SHOP.z0 + SHOP.z1) / 2);

      /* (v24.22) THE SHOP IS AN AMULET SHOP (Chad, 30 Oct: "Look at the amulet shop, it doesn't even look like one. No
         real amulet models, no deco, nothing ... The shop need to be improved significantly, have real amulets, look like
         a real shop. Have general amulets like somdej, khun paen, takruts, mitmor, buddha statues, rian amulets, and
         more"). Laid out the way the real ones are (photographs of a Golden Mile Complex shop, a Fu Lu Shou Complex
         counter and Bangkok's stalls): a lit glass counter of red compartment trays across the front of the counter
         area, glass cabinets of stock down both walls, the shop's own altar behind the counter with Buddha images on
         stepped tiers, garlands, candles and an incense pot, shelves of statues either side, framed yantra and pha yant
         cloths hung from the ceiling. Every piece of stock is a real model (the PIECES below), instanced by kind */
      /* THE BACK WALL: a red-and-gold panel behind the altar, the altar on its cabinet, shelves of statues either side */
      const mRed = M({ color: 0x8e1418, roughness: 0.42 }), mRedDk = M({ color: 0x5a0c10, roughness: 0.5 });
      const mGoldTrim = M({ color: 0xd4aa4c, roughness: 0.3, metalness: 0.9, envMapIntensity: 6 });
      pl(1.5, 1.95, M({ map: tex(makeAltarPanel(THREE, cnv)), roughness: 0.55 }), 0, 1.92, SHOP.z0 + 0.012, 0, 0);
      { const A = SHRINE;                                                            // the altar cabinet and its three tiers
        bx(A.w, A.h, A.d, mRed, 0, A.h / 2, SHOP.z0 + A.d / 2);
        bx(A.w + 0.02, 0.025, A.d + 0.02, mGoldTrim, 0, A.h - 0.0125, SHOP.z0 + A.d / 2);
        bx(A.w - 0.04, 0.08, 0.01, mRedDk, 0, 0.04, SHOP.z0 + A.d + 0.006);              // its plinth, in shadow
        for (const sx of [-1, 1]) { bx(A.w / 2 - 0.06, A.h - 0.22, 0.008, mRedDk, sx * A.w / 4, A.h / 2 + 0.03, SHOP.z0 + A.d + 0.004);   // two doors
          bx(0.012, 0.09, 0.012, mGoldTrim, sx * 0.04, A.h / 2 + 0.05, SHOP.z0 + A.d + 0.012); }                                 // their handles
        for (const T of A.tiers) {
          bx(T.w, T.h, T.d, mRed, 0, T.y + T.h / 2, SHOP.z0 + T.d / 2);
          bx(T.w + 0.01, 0.018, 0.012, mGoldTrim, 0, T.y + T.h - 0.009, SHOP.z0 + T.d + 0.006);    // the gold band along its edge
        }
        /* two electric candles on the middle tier, their flames a painted glow */
        const mCandle = M({ color: 0xc81a1a, roughness: 0.35 }), mTip = B({ color: 0xffb070 });
        const T1 = A.tiers[1];
        const cz = SHOP.z0 + (T1.d + A.tiers[2].d) / 2;                                   // the strip tier 1 leaves in front of tier 2
        for (const x of [-0.37, 0.37]) { mesh(new THREE.CylinderGeometry(0.018, 0.02, 0.2, 12), mCandle, x, T1.y + T1.h + 0.1, cz);
          mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.012, 14), mGoldTrim, x, T1.y + T1.h + 0.006, cz);
          const tip = mesh(new THREE.SphereGeometry(0.012, 8, 6), mTip, x, T1.y + T1.h + 0.215, cz); tip.scale.y = 1.6; }
        /* the incense pot of sand at the front of the lowest tier, three sticks in it, their tips alight */
        const T0 = A.tiers[0], pz = SHOP.z0 + (T0.d + A.tiers[1].d) / 2;
        mesh(new THREE.CylinderGeometry(0.06, 0.045, 0.07, 18), mGoldTrim, 0, T0.y + T0.h + 0.035, pz);
        mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.004, 18), M({ color: 0x8a7e6a, roughness: 0.95 }), 0, T0.y + T0.h + 0.066, pz);
        const mStick = M({ color: 0x9a2a1a, roughness: 0.7 });
        for (const [dx, lean] of [[-0.018, -0.12], [0, 0], [0.018, 0.12]]) { const st = mesh(new THREE.CylinderGeometry(0.0018, 0.0018, 0.2, 5), mStick, dx + lean * 0.1, T0.y + T0.h + 0.17, pz); st.rotation.z = -lean;
          const ember = mesh(new THREE.SphereGeometry(0.0035, 6, 4), mTip, dx + lean * 0.2, T0.y + T0.h + 0.27, pz); void ember; }
        /* three glasses of water, a plate of oranges, flowers in two brass vases */
        const mWater = M({ color: 0xdfeaf0, roughness: 0.06, metalness: 0.0, transparent: true, opacity: 0.42, depthWrite: false });
        const tz = SHOP.z0 + (T0.d + A.tiers[1].d) / 2;                                   // the middle of the strip tier 0 leaves in front
        for (const x of [-0.26, -0.2, -0.14]) mesh(new THREE.CylinderGeometry(0.018, 0.016, 0.06, 12), mWater, x, T0.y + T0.h + 0.03, tz).renderOrder = 2;
        mesh(new THREE.CylinderGeometry(0.068, 0.055, 0.012, 20), mGoldTrim, 0.22, T0.y + T0.h + 0.006, tz);
        const mOrange = M({ color: 0xe8781a, roughness: 0.55 });
        for (const [dx, dz, dy] of [[-0.03, -0.02, 0], [0.03, -0.02, 0], [0, 0.03, 0], [0, -0.005, 0.04]]) mesh(new THREE.SphereGeometry(0.03, 12, 9), mOrange, 0.22 + dx, T0.y + T0.h + 0.04 + dy, tz + dz);
        const mFlY = M({ color: 0xf2c030, roughness: 0.7 }), mFlW = M({ color: 0xf2eee6, roughness: 0.7 }), mLeaf = M({ color: 0x3a6a2a, roughness: 0.8, side: THREE.DoubleSide });
        for (const cx of [-0.48, 0.48]) {
          mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.13, 14), mGoldTrim, cx, T0.y + T0.h + 0.065, tz);
          const r = rng(4900 + Math.round(cx * 100));
          for (let k = 0; k < 9; k++) { const a = r() * 6.28, d = 0.02 + r() * 0.045;
            mesh(new THREE.SphereGeometry(0.022 + r() * 0.008, 8, 6), k % 3 ? mFlY : mFlW, cx + Math.cos(a) * d, T0.y + T0.h + 0.17 + r() * 0.07, tz + Math.sin(a) * d * 0.7); }
          for (let k = 0; k < 4; k++) { const lf = mesh(new THREE.PlaneGeometry(0.03, 0.09), mLeaf, cx + (k - 1.5) * 0.025, T0.y + T0.h + 0.15, tz + 0.01); lf.rotation.set(0.3, k, (k - 1.5) * 0.4); }
        }
        /* two jasmine garlands (phuang malai) draped along the middle tier's edge, their marigold tassels hanging */
        const mJas = M({ color: 0xf6f2e6, roughness: 0.75 }), mMari = M({ color: 0xf0901a, roughness: 0.7 }), mRose = M({ color: 0xb01828, roughness: 0.6 });
        const beadG = new THREE.SphereGeometry(0.009, 6, 5);
        for (const sx of [-1, 1]) {
          const n = 26, x0 = sx * 0.06, x1 = sx * (T1.w / 2 - 0.03), y0 = T1.y + T1.h - 0.01, zf = SHOP.z0 + T1.d + 0.012;
          const im = new THREE.InstancedMesh(beadG, mJas, n), m4 = new THREE.Matrix4();
          for (let i = 0; i < n; i++) { const u = i / (n - 1); m4.makeTranslation(x0 + (x1 - x0) * u, y0 - Math.sin(u * Math.PI) * 0.07, zf + Math.sin(u * Math.PI) * 0.012); im.setMatrixAt(i, m4); }
          im.computeBoundingSphere(); S0.add(im); owned.push(im);
          for (const [u, col] of [[0, mRose], [1, mMari]]) { const tx = x0 + (x1 - x0) * u;
            mesh(new THREE.SphereGeometry(0.016, 10, 8), col, tx, y0 - 0.02, zf + 0.004);
            const ts = mesh(new THREE.CylinderGeometry(0.004, 0.012, 0.09, 8), mMari, tx, y0 - 0.075, zf + 0.004); void ts; }
        }
      }
      /* THE BACK WALL'S DISPLAY UNITS either side of the altar (v24.22 — two floating shelves of four small images each read
         as a bare wall, and a phone's look into the shop from the corridor holds the whole back wall): as a dealer's back
         wall is, a white carcass on a cupboard, a red velvet back, two oak shelves and an LED under each, full of stock (the
         PIECES); over each, a framed yantra; the clock on the left wall */
      for (const sx of [-1, 1]) {
        const W2 = BU.x1 - BU.x0, cx = sx * (BU.x0 + BU.x1) / 2, zc = SHOP.z0 + BU.d / 2, zf = SHOP.z0 + BU.d;
        bx(W2, BU.base, BU.d, mGloss, cx, BU.base / 2, zc);                                              // the cupboard
        for (const k of [-1, 1]) { bx(W2 / 2 - 0.025, BU.base - 0.14, 0.01, mGloss, cx + k * W2 / 4, BU.base / 2 + 0.03, zf + 0.004);   // its doors
          bx(0.012, 0.1, 0.012, mGoldTrim, cx + k * 0.05, BU.base / 2 + 0.05, zf + 0.014); }                                         // their handles
        bx(W2 - 0.04, BU.H - BU.base, 0.012, mVel, cx, (BU.base + BU.H) / 2, SHOP.z0 + 0.008);           // the velvet back
        for (const xe of [BU.x0, BU.x1]) bx(0.025, BU.H, BU.d, mGloss, sx * xe, BU.H / 2, zc);          // its ends
        bx(W2 + 0.02, 0.035, BU.d + 0.01, mGloss, cx, BU.H - 0.0175, zc);                                // its top
        for (const y of BU.ys) bx(W2 - 0.03, 0.025, BU.d - 0.02, mOak, cx, y - 0.0125, zc + 0.005);     // the shelves, their tops at y
        for (const y of [BU.ys[0] - 0.034, BU.ys[1] - 0.034, BU.H - 0.044]) bx(W2 - 0.12, 0.008, 0.01, mLed, cx, y, zf - 0.03);   // an LED under each
        bx(0.46, 0.6, 0.025, mBlack, cx, 2.42, SHOP.z0 + 0.03);
        pl(0.4, 0.54, M({ map: tex(makeYantPrint(THREE, cnv, sx < 0 ? 0 : 1)), roughness: 0.75 }), cx, 2.42, SHOP.z0 + 0.045);
      }
      { const ck = new THREE.Group(); ck.position.set(SHOP.x0 + 0.004, 2.45, SHOP.z0 + 0.62); ck.rotation.y = Math.PI / 2; S0.add(ck);   // the clock on the left wall
        const face = new THREE.Mesh(new THREE.CircleGeometry(0.15, 32), M({ map: tex(makeShopClock(THREE, cnv)), roughness: 0.5 })); face.position.z = 0.012; ck.add(face);
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.152, 0.012, 8, 32), mBlack); rim.position.z = 0.012; ck.add(rim); }
      /* the pha yant cloths hung from the ceiling over the counter's back, as the real shops hang them (green, purple,
         red and white, a yantra printed on each) */
      { const cols = [['#2e7a4e', '#f2e6b8'], ['#5a2e7a', '#f2e0a8'], ['#9a1a1e', '#f6e2a6'], ['#efe8d6', '#8a1a1a']];
        [-2.05, -1.05, 1.05, 2.05].forEach((x, i) => {                               // clear of the framed yantras between them
          const cl = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.66), M({ map: tex(makePhaYantCloth(THREE, cnv, cols[i][0], cols[i][1], i)), roughness: 0.9, side: THREE.DoubleSide }));
          cl.position.set(x, SHOP.H - 0.36, SHOP.z0 + 0.62); cl.rotation.y = (i % 2 ? 0.08 : -0.08); S0.add(cl);
          bx(0.46, 0.012, 0.012, mGoldTrim, x, SHOP.H - 0.025, SHOP.z0 + 0.62);
        }); }

      /* (v24.22) on each side wall over its cabinet, three more pha yant on gold rods, hung in a row as the shops hang them */
      { const cols2 = [['#9a1a1e', '#f6e2a6'], ['#efe8d6', '#8a1a1a'], ['#2e7a4e', '#f2e6b8'], ['#5a2e7a', '#f2e0a8'], ['#c89a34', '#5a1010'], ['#1e3a6a', '#f2e0a8']];
        let k = 0;
        for (const sx of [-1, 1]) for (const z of [-0.25, 0.7, 1.65]) {
          const c3 = cols2[k % cols2.length];
          const cl = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.62), M({ map: tex(makePhaYantCloth(THREE, cnv, c3[0], c3[1], 4 + k)), roughness: 0.9, side: THREE.DoubleSide }));
          cl.position.set(sx * (SHOP.x1 - 0.012), 2.5, z); cl.rotation.y = -sx * Math.PI / 2; S0.add(cl);
          bx(0.012, 0.012, 0.44, mGoldTrim, sx * (SHOP.x1 - 0.016), 2.82, z);
          k++;
        } }
      /* (v24.22) on the side walls behind the counter, framed certificates of authenticity, three a side, as dealers hang
         them where the customer stands */
      { const mFr = M({ color: 0x2a1e14, roughness: 0.5 }); let k = 0;
        for (const sx of [-1, 1]) for (const z of [-1.15, -1.65, -2.15]) {
          bx(0.02, 0.4, 0.3, mFr, sx * (SHOP.x1 - 0.012), 1.72, z);
          for (const dz of [-0.15, 0.15]) bx(0.004, 0.412, 0.012, mGoldTrim, sx * (SHOP.x1 - 0.022), 1.72, z + dz);   // its gold rule, all four sides
          for (const dy of [-0.2, 0.2]) bx(0.004, 0.012, 0.312, mGoldTrim, sx * (SHOP.x1 - 0.022), 1.72 + dy, z);
          pl(0.26, 0.35, M({ map: tex(makeCertificate(THREE, cnv, k++)), roughness: 0.8 }), sx * (SHOP.x1 - 0.0235), 1.72, z, 0, -sx * Math.PI / 2);
        } }
      /* (v24.22) a track of spotlights over the counter, as a dealer's counter has — their faces lit with the LEDs, painted
         (v15.1: no lamp) */
      { const tz = COUNTER.z + 0.1;
        bx(2.6, 0.03, 0.04, mBlack, 0, SHOP.H - 0.015, tz);
        for (let i = 0; i < 5; i++) { const g = new THREE.Group(); g.position.set(-1.1 + i * 0.55, SHOP.H - 0.035, tz); g.rotation.x = -0.35; S0.add(g);
          const can = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.09, 14), mBlack); can.position.y = -0.045; g.add(can);
          const lf = new THREE.Mesh(new THREE.CircleGeometry(0.026, 14), mLed); lf.rotation.x = Math.PI / 2; lf.position.y = -0.0905; g.add(lf); } }
      /* (v24.22) two stools on the customers' side of the counter */
      { const mSeat = M({ color: 0x8e1418, roughness: 0.5 });
        for (const x of [-1.15, 1.15]) { const st = new THREE.Group(); st.position.set(x, 0, COUNTER.z + COUNTER.d / 2 + 0.42); S0.add(st);
          const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.16, 0.06, 20), mSeat); seat.position.y = 0.68; st.add(seat);
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.64, 8), mAlu); leg.position.y = 0.33; st.add(leg);
          const ring = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.01, 6, 20), mAlu); ring.rotation.x = Math.PI / 2; ring.position.y = 0.26; st.add(ring);
          const ft = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.21, 0.025, 20), mAlu); ft.position.y = 0.0125; st.add(ft); } }
      /* (v24.22) THE STOCK: every piece a real model (the PIECES), collected here by kind and by where it stands, then
         stood all at once as InstancedMeshes (manyOf) — one draw a kind a place, each place culled on its own */
      const stock = new Map();                                     // `${key}|${place}` → [{ x, y, z, ry, rx, rz, s }]
      const put = (key, place, x, y, z, ry = 0, rx = 0, s = 1, rz = 0) => {
        const k = key + '|' + place; if (!stock.has(k)) stock.set(k, []); stock.get(k).push({ x, y, z, ry, rx, rz, s }); };
      const CASED = ['e4somdej', 'e4khunpaen', 'e4rian', 'e4jatukham'];   // the four cased kinds, dealt in turn along a row
      const CASED_S = { e4somdej: 1.15, e4khunpaen: 1, e4rian: 1, e4jatukham: 0.92 };   // the Somdej to a cased one's real 6 cm
      const cardMats = [0, 1, 2, 3].map(k => { const t = tCards.clone(); t.repeat.set(0.25, 1); t.offset.set(k * 0.25, 0); t.needsUpdate = true; madeTex.push(t); return M({ map: t, roughness: 0.8 }); });
      const priceCard = (x, y, z, ry, rx, k, sc = 1) => { const c2 = mesh(new THREE.PlaneGeometry(0.036 * sc, 0.024 * sc), cardMats[k % 4], x, y, z); c2.rotation.set(rx, ry, 0, 'YXZ'); return c2; };
      const mStand = M({ color: 0x7a1016, roughness: 0.5 });
      /* the two wall cabinets: white carcass, pale oak shelves, glass fronts, an LED strip under each shelf — full now:
         statues on the top shelf, a row of cased amulets on a sloped velvet board, takruts, Pidta, a meed mor and small
         Kring on the next, temple boxes at the bottom */
      const cabinet = (sx) => {
        const X = sx * 2.17, Z0 = -0.7, Z1 = 2.1, L = Z1 - Z0, ZC = (Z0 + Z1) / 2, D = 0.44, FX = sx * (2.17 - D / 2);   // FX: its glass front
        bx(0.02, 2.05, L, mVel, X + sx * (D / 2 - 0.01), 1.085, ZC);                         // the carcass: its back (v24.22: red velvet — white, it was the brightest thing in every close shot of the stock),
        for (const zz of [Z0, Z1]) bx(D, 2.05, 0.02, mGloss, X, 1.085, zz);                  // its ends,
        for (const y of [0.11, 2.1]) bx(D, 0.02, L, mGloss, X, y, ZC);                       // its floor and top (the inside shows through the glass)
        bx(D - 0.06, 0.1, L - 0.02, mBlack, X, 0.05, ZC);                     // the plinth, set back
        for (const y of [0.42, 0.86, 1.3, 1.74]) {
          bx(D - 0.04, 0.03, L - 0.06, mOak, X - sx * 0.01, y, ZC);
          bx(0.012, 0.006, L - 0.12, mLed, FX - sx * 0.03, y - 0.02, ZC);
        }
        for (const zz of [Z0 + 0.02, ZC, Z1 - 0.02]) bx(0.025, 2.0, 0.025, mAlu, FX, 1.08, zz);
        for (const y of [0.1, 2.08]) bx(0.025, 0.025, L, mAlu, FX, y, ZC);
        const gl = pl(L - 0.06, 1.96, mGlass, FX, 1.09, ZC, 0, -sx * Math.PI / 2); gl.renderOrder = 2;
        const face = -sx * Math.PI / 2, side = sx < 0 ? 'L' : 'R', top = (y) => y + 0.015;
        /* the top shelf: a Buddha in the middle, Kring and Pidta images either side of him, each on a round red stand,
           their faces to the shop (v24.22: nine where five stood a metre apart) */
        for (const [dz, key, s] of [[-1.2, 'e4pidta', 2.4], [-0.9, 'e4kring', 3.0], [-0.6, 'e4pidta', 2.8], [-0.3, 'e4kring', 3.4], [0, 'e4bucha', 0.72],
                                    [0.3, 'e4kring', 3.4], [0.6, 'e4pidta', 2.8], [0.9, 'e4kring', 3.0], [1.2, 'e4pidta', 2.4]]) {
          const z = ZC + dz, x = X - sx * 0.04, rs = key === 'e4bucha' ? 0.09 : key === 'e4kring' ? 0.05 : 0.045;
          mesh(new THREE.CylinderGeometry(rs, rs + 0.005, 0.03, 20), mStand, x, top(1.74) + 0.015, z);
          put(key, 'cab' + side + 'top', x, top(1.74) + 0.03, z, face, 0, s);
        }
        /* the middle shelf: a velvet board leaning back 20° toward the wall, two rows of cased amulets leaning on it the
           way a dealer pins them, faces to the aisle, a price card in front of some */
        /* (v24.22: three rows of twenty-two, a piece every 11 cm the way a dealer's board is pinned — two rows of eight a
           third of a metre apart read as a board with a few things left on it; in two places, each near or far on its own) */
        { const lean = 0.35, bh = 0.37, n = 22, y0 = top(1.3), x0 = X - sx * 0.12;          // x0: the board's foot, toward the aisle
          const board = mesh(new THREE.BoxGeometry(0.012, bh, L - 0.16), mVel, x0 + sx * (0.006 + Math.sin(lean) * bh / 2), y0 + Math.cos(lean) * bh / 2, ZC);
          board.rotation.z = -sx * lean;
          for (const [row, dy] of [[0, 0.004], [1, 0.118], [2, 0.232]]) for (let i = 0; i < n; i++) {
            const z = Z0 + 0.16 + (i + 0.5 + (row % 2) * 0.5) * (L - 0.4) / n, key = CASED[(i + row * 2) % 4];
            put(key, 'cab' + side + 'mid' + (i < n / 2 ? 0 : 1), x0 - sx * 0.008 + sx * Math.tan(lean) * dy, y0 + dy, z, face, -lean, CASED_S[key]);
            if (row === 0 && i % 4 === 1) priceCard(x0 - sx * 0.06, y0 + 0.002, z, face, -Math.PI / 2 + 0.3, i);
          }
        }
        /* the lower shelf: a takrut set on its pad, Pidta and small Kring on stands, a meed mor on its rest */
        { const y = top(0.86), x = X - sx * 0.06;
          for (const pz of [0.4, 1.95]) {                                                 // (v24.22) two takrut sets on their pads
            mesh(new THREE.BoxGeometry(0.22, 0.012, 0.42), mVel, x, y + 0.006, Z0 + pz);
            for (let k = 0; k < 3; k++) put('e4takrutsm', 'cab' + side + 'low', x - sx * 0.02, y + 0.0185, Z0 + pz - 0.13 + k * 0.13, face, 0, 0.07, Math.PI / 2);
          }
          for (const [dz, key, s] of [[0.78, 'e4pidta', 1.6], [0.95, 'e4kring', 1.8], [1.12, 'e4pidta', 1.6], [1.29, 'e4kring', 2.0], [1.46, 'e4pidta', 1.6], [1.63, 'e4kring', 1.8]]) {
            mesh(new THREE.CylinderGeometry(0.03, 0.032, 0.02, 14), mStand, x, y + 0.01, Z0 + dz);
            put(key, 'cab' + side + 'low', x, y + 0.02, Z0 + dz, face, 0, s);
          }
          const rest = mesh(new THREE.BoxGeometry(0.06, 0.03, 0.24), mVel, x, y + 0.015, Z0 + 2.5); void rest;      // (v24.22: past the second takrut set)
          put('e4meedmor', 'cab' + side + 'low', x, y + 0.031, Z0 + 2.5, face, 0, 1);   // along the shelf, its carved side to the aisle
        }
        /* the bottom shelf: the temples' own boxes, red and gold, stacked */
        { const y = top(0.42), r = rng(sx < 0 ? 4921 : 4923);
          for (let k = 0; k < 7; k++) { const w = 0.07 + r() * 0.05, h = 0.04 + r() * 0.03, z = Z0 + 0.25 + k * 0.36 + r() * 0.08;
            const bxm = bx(0.1 + r() * 0.06, h, w, k % 3 === 2 ? mGoldTrim : mRed, X - sx * (0.02 + r() * 0.06), y + h / 2, z);
            bxm.rotation.y = (r() - 0.5) * 0.4;
            if (k % 2 === 0) { const h2 = 0.03 + r() * 0.02; bx(0.09, h2, w * 0.9, k % 4 ? mRed : mGoldTrim, X - sx * 0.05, y + h + h2 / 2, z + 0.01).rotation.y = (r() - 0.5) * 0.5; } }
        }
        return { X, ZC, L, Z0 };
      };
      cabinet(-1); cabinet(1);
      /* the back wall's units (BU, built above): on the cupboard's top a velvet board of cased amulets, two rows of thirteen
         leaning back to the wall; Kring, Pidta and a Buddha on each shelf, each on its red stand, faces to the shop */
      for (const sx of [-1, 1]) {
        const side = sx < 0 ? 'L' : 'R', W2 = BU.x1 - BU.x0, cx = sx * (BU.x0 + BU.x1) / 2, zf = SHOP.z0 + BU.d, zs = SHOP.z0 + BU.d / 2 + 0.02;
        { const lean = 0.35, bh = 0.26, n = 13, BW = W2 - 0.12, zfoot = zf - 0.1, y0 = BU.base, pitch = (BW - 0.06) / n;
          const board = mesh(new THREE.BoxGeometry(BW, bh, 0.012), mVel, cx, y0 + Math.cos(lean) * bh / 2, zfoot - (0.006 + Math.sin(lean) * bh / 2));
          board.rotation.x = -lean;
          for (const [row, dy] of [[0, 0.004], [1, 0.118]]) for (let i = 0; i < n; i++) {
            const x = cx - BW / 2 + 0.03 + (i + 0.5 + (row % 2) * 0.5) * pitch, key = CASED[(i + row * 2 + (sx < 0 ? 1 : 3)) % 4];
            if (row === 1 && i === n - 1) continue;                                     // the staggered row is one short
            put(key, 'bu' + side + 'b' + (i < 7 ? 0 : 1), x, y0 + dy, zfoot + 0.008 - Math.tan(lean) * dy, 0, -lean, CASED_S[key]);
            if (row === 0 && i % 4 === 2) priceCard(x, y0 + 0.002, zfoot + 0.05, 0, -Math.PI / 2 + 0.3, i);
          }
        }
        for (const [y, place, row] of [[BU.ys[0], 's1', [['e4kring', 3.0], ['e4pidta', 2.6], ['e4kring', 3.4], ['e4bucha', 0.5], ['e4kring', 3.4], ['e4pidta', 2.6], ['e4kring', 3.0]]],
                                       [BU.ys[1], 's2', [['e4pidta', 2.8], ['e4kring', 3.6], ['e4bucha', 0.62], ['e4kring', 3.6], ['e4pidta', 2.8]]]]) {
          const step = (W2 - 0.1) / row.length;
          row.forEach(([key, sc], k) => { const x = cx - (W2 - 0.1) / 2 + (k + 0.5) * step, rs = key === 'e4bucha' ? 0.065 : key === 'e4kring' ? 0.05 : 0.045;
            mesh(new THREE.CylinderGeometry(rs, rs + 0.005, 0.03, 18), mStand, x, y + 0.015, zs);
            put(key, 'bu' + side + place, x, y + 0.03, zs, 0, 0, sc); });
        }
      }
      /* the altar's own images: the Buddha on the top tier, a Kring either side of him on the middle tier */
      { const A = SHRINE, T2 = A.tiers[2], T1 = A.tiers[1];
        mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.05, 24), mGoldTrim, 0, T2.y + T2.h + 0.025, SHOP.z0 + T2.d / 2);
        put('e4bucha', 'altar', 0, T2.y + T2.h + 0.05, SHOP.z0 + T2.d / 2, 0, 0, 1);
        for (const sx of [-1, 1]) { const z = SHOP.z0 + (T1.d + T2.d) / 2;
          mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.025, 18), mGoldTrim, sx * 0.2, T1.y + T1.h + 0.0125, z);
          put('e4kring', 'altar', sx * 0.2, T1.y + T1.h + 0.025, z, 0, 0, 3.6); } }

      /* his counter (v24.22): a lit glass display counter, as the real shops have — an aluminium frame, a glass front,
         sides and top, and inside a red tray of compartments, each holding a piece of his stock (the PIECES) with its
         price card; on the glass his laptop with the shop's sales on it (Chad: "why he is recording sales on paper? It
         makes no sense. It should be on laptop"), his notebook and pen, his phone, a loupe, the PayNow stand, a
         calculator, a stand of his new cards. The top's upper face stays at C.h + 0.046, where everything on it has
         always stood */
      { const C = COUNTER, W = C.x1 - C.x0, FZ = C.z + C.d / 2, BZ = C.z - C.d / 2, top = C.h + 0.046;
        bx(W, 0.5, C.d, mGloss, 0, 0.25, C.z);                                           // the white cupboard under it
        pl(W - 0.1, 0.16, M({ map: tex(makeCounterFascia(THREE, cnv)), roughness: 0.5 }), 0, 0.3, FZ + 0.002);   // (v24.22) its fascia: what the shop sells
        const TY = DISPLAY.floor, TH = top - 0.012 - 0.5;                                 // the tray's floor; the glass's height
        bx(W - 0.03, 0.02, C.d - 0.03, mVel, 0, TY - 0.01, C.z);                        // the tray's red velvet floor
        { const dz = (C.d - 0.06) / DISPLAY.rows, dx = (W - 0.06) / DISPLAY.cols, mPart = mStand;   // its partitions
          for (let i = 0; i <= DISPLAY.rows; i++) bx(W - 0.06, 0.026, 0.006, mPart, 0, TY + 0.013, BZ + 0.03 + i * dz);
          for (let j = 0; j <= DISPLAY.cols; j++) bx(0.006, 0.026, C.d - 0.06, mPart, C.x0 + 0.03 + j * dx, TY + 0.013, C.z); }
        for (const [w, x, z, ry] of [[W - 0.02, 0, FZ, 0], [W - 0.02, 0, BZ, Math.PI], [C.d - 0.02, C.x0 + 0.005, C.z, -Math.PI / 2], [C.d - 0.02, C.x1 - 0.005, C.z, Math.PI / 2]]) {
          const gp = pl(w, TH, mGlass, x, 0.5 + TH / 2, z, 0, ry); gp.renderOrder = 2; }  // the glass front, his sliding doors at the back, the ends
        const gt = pl(W - 0.03, C.d - 0.03, mGlass, 0, top - 0.006, C.z, -Math.PI / 2); gt.renderOrder = 2;   // the glass top
        for (const x of [C.x0 + 0.01, C.x1 - 0.01]) for (const z of [FZ, BZ]) bx(0.02, TH + 0.012, 0.02, mAlu, x, 0.5 + (TH + 0.012) / 2, z);
        for (const z of [FZ, BZ]) { bx(W, 0.014, 0.022, mAlu, 0, top - 0.007, z); bx(W, 0.02, 0.022, mAlu, 0, 0.51, z); }
        for (const x of [C.x0 + 0.01, C.x1 - 0.01]) bx(0.022, 0.014, C.d, mAlu, x, top - 0.007, C.z);
        bx(0.012, TH, 0.012, mAlu, 0, 0.5 + TH / 2, FZ);                                   // the front's middle mullion
        bx(W - 0.08, 0.008, 0.01, mLed, 0, top - 0.026, FZ - 0.03);                        // the LEDs under the top's front edge
        bx(W - 0.08, 0.008, 0.01, mLed, 0, top - 0.026, BZ + 0.03);
        /* the compartments' stock, dealt from a fixed seed: cased amulets lying face up (their tops to the back, so they
           read upright from the customer's side), Pidta and Kring standing, a takrut lying, a card beside some */
        { const r = rng(4931), dz = (C.d - 0.06) / DISPLAY.rows, dx = (W - 0.06) / DISPLAY.cols;
          for (let i = 0; i < DISPLAY.rows; i++) for (let j = 0; j < DISPLAY.cols; j++) {
            const cx = C.x0 + 0.03 + (j + 0.5) * dx + (r() - 0.5) * 0.016, cz = BZ + 0.03 + (i + 0.5) * dz + (r() - 0.5) * 0.012, ry = (r() - 0.5) * 0.14;
            const place = 'counter' + Math.floor(j / 7), q = r();                            // four places along it (each culled, and near or far, on its own)
            if (q < 0.06) continue;                                                       // an empty one or two: sold
            if (q < 0.70) { const key = CASED[(i * 7 + j * 3) % 4], s = CASED_S[key], h = { e4somdej: 0.052, e4khunpaen: 0.056, e4rian: 0.05, e4jatukham: 0.064 }[key] * s;
              put(key, place, cx, TY + 0.0055 * s, cz + h / 2, ry, -Math.PI / 2, s); }
            else if (q < 0.80) put('e4pidta', place, cx, TY, cz, ry, 0, 1);
            else if (q < 0.90) put('e4kring', place, cx, TY, cz, ry, 0, 1);
            else put('e4takrutsm', place, cx, TY + 0.0062, cz, ry, 0, 0.07, Math.PI / 2);
            if (r() < 0.32) priceCard(cx + dx * 0.27, TY + 0.0015, cz + dz * 0.37, ry, -Math.PI / 2, i + j, 0.78);   // in the cell's front corner, clear of the piece
          }
        }
        /* the notebook he keeps: what he studies, and (the endings) what he saw — never his sales */
        const bk = new THREE.Group(); bk.position.set(BOOK_AT.x, top, BOOK_AT.z); bk.rotation.y = 0.06; S0.add(bk); bk.userData.dyn = true; shop.ledger = bk;
        const cover = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.012, 0.31), M({ color: 0x2a3a5a, roughness: 0.6 })); cover.position.y = 0.006; bk.add(cover);
        const pen = new THREE.Group(); pen.position.set(PEN_AT.x, top + 0.0048, PEN_AT.z); pen.rotation.set(0, -0.5, Math.PI / 2); S0.add(pen); pen.userData.dyn = true; shop.pen = pen;
        { const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.004, 0.14, 8), M({ color: 0x1a2a6a, roughness: 0.3 })); pen.add(b2);
          const tip = new THREE.Mesh(new THREE.ConeGeometry(0.004, 0.014, 8), mAlu); tip.position.y = -0.077; tip.rotation.x = Math.PI; pen.add(tip); }
        /* his phone: face up, its screen dark until a message comes (shop.phoneOn), then its lock screen with the message
           on it (shop.phoneWho: Pong's in the opening, the Ajahn's in ending B's coda). The screen is ALWAYS mapped and
           only its colour lights it, so waking it never asks for a new program on screen (v15.1). It reads the right
           way up from his side of the counter, where both shots of it stand. */
        const ph = new THREE.Group(); ph.position.set(0.48, top, C.z + 0.04); ph.rotation.y = -0.3; S0.add(ph); ph.userData.dyn = true;
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.076, 0.009, 0.158), M({ color: 0x18181c, roughness: 0.25, metalness: 0.4 })); body.position.y = 0.0045; ph.add(body);
        const [pc, px] = sized(cnv, 256, 557); px.fillStyle = '#000'; px.fillRect(0, 0, 256, 557);
        const scr = B({ color: 0x050608, map: tex(done(THREE, pc, false)) });
        const sc = new THREE.Mesh(new THREE.PlaneGeometry(0.068, 0.148), scr); sc.rotation.set(-Math.PI / 2, 0, Math.PI); sc.position.y = 0.0095; ph.add(sc);
        shop.phone = { g: ph, scr, base: ph.position.clone(), x: px, drawn: '' };
        bx(0.09, 0.016, 0.13, M({ color: 0x2a2a2e, roughness: 0.6 }), 0.24, top + 0.008, C.z - 0.12).rotation.y = 0.2;   // the calculator
        { const cs = bx(0.1, 0.05, 0.04, mAlu, -1.02, top + 0.025, C.z + 0.12); cs.rotation.x = -0.2;
          bx(0.09, 0.055, 0.003, M({ color: 0xf6f4ee, roughness: 0.7 }), -1.02, top + 0.05, C.z + 0.11).rotation.x = -0.35; }
        /* the PayNow stand at the customer's corner of the counter, as every shop in Singapore has one */
        { const g = new THREE.Group(); g.position.set(-1.32, top, C.z + 0.2); g.rotation.y = 0.15; S0.add(g);
          const card2 = new THREE.Mesh(new THREE.PlaneGeometry(0.085, 0.12), M({ map: tex(makePayNow(THREE, cnv)), roughness: 0.6 })); card2.position.set(0, 0.068, 0); card2.rotation.x = -0.18; g.add(card2);
          const acr = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.006, 0.05), mGlass); acr.position.y = 0.003; g.add(acr);
          const back = new THREE.Mesh(new THREE.PlaneGeometry(0.085, 0.12), M({ color: 0xf0f0f0, roughness: 0.6 })); back.position.set(0, 0.068, -0.002); back.rotation.set(-0.18, Math.PI, 0); g.add(back); }
        /* his loupe beside the laptop: a jeweller's glass, a dealer's first tool */
        { const lg = new THREE.Group(); lg.position.set(-0.52, top, C.z - 0.02); lg.rotation.set(0, 0.6, 0); S0.add(lg);
          const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.022, 16), mBlack); barrel.rotation.z = Math.PI / 2; barrel.position.y = 0.016; lg.add(barrel);
          const lens = new THREE.Mesh(new THREE.CircleGeometry(0.012, 16), M({ color: 0xcfe0ec, roughness: 0.02, metalness: 0.2, envMapIntensity: 4 })); lens.rotation.y = Math.PI / 2; lens.position.set(0.0115, 0.016, 0); lg.add(lens); }
        /* HIS LAPTOP, on the glass in front of his place, its screen the shop's sales (shop.lap: drawn when it changes,
           lit only when he wakes it). His own laptop — the one his dashcam orders climbed on in episode 3 chapter 1's film
           (`reuse`); its screen faces the model's own −x, so a quarter turn faces it at him. A drawn one stands in until
           the file lands (kept out of the merge — the v24.14 law) */
        { const [lc, lx] = sized(cnv, 1024, 720); lx.fillStyle = '#000'; lx.fillRect(0, 0, 1024, 720);
          const lt = tex(done(THREE, lc, false));
          lt.repeat.set(LAP.uv[0], LAP.uv[1]); lt.offset.set(LAP.uv[2], LAP.uv[3]);       // the screen's UV island onto the whole canvas (measured)
          const scrM = B({ color: 0x050608, map: lt });
          shop.lap = { x: lx, t: lt, m: scrM, sig: '', on: 0 };
          const old = new THREE.Group(); old.position.set(LAP.x, top, LAP.z); old.rotation.y = LAP.ry; old.userData.dyn = true; S0.add(old);
          const base = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.016, 0.24), mBlack); base.position.y = 0.008; old.add(base);
          const lid = new THREE.Mesh(new THREE.PlaneGeometry(0.33, 0.23), scrM); lid.position.set(0.09, 0.12, 0); lid.rotation.set(0, -Math.PI / 2, 0); lid.rotateX(-0.41); old.add(lid);
          parseOnce('filmlaptop').then(({ scene: src }) => {
            if (!alive) return;
            const g = src.clone(true); g.position.set(LAP.x, top, LAP.z); g.rotation.y = LAP.ry;
            g.traverse(o => { if (!o.isMesh) return; o.castShadow = false; o.receiveShadow = true;
              const m = o.material; o.material = (m && m.name === 'screen') ? scrM : m.clone(); if (o.material !== scrM) mats.push(o.material); });
            S0.add(g); old.visible = false;
          }).catch(err => { console.warn('filmlaptop failed to load', err); if (ctx.loadFail) ctx.loadFail('filmlaptop', err); }); }
        /* his stool behind it */
        { const st = new THREE.Group(); st.position.set(0.55, 0, C.z - 0.85); S0.add(st);
          const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.05, 18), M({ color: 0x2a2a2e, roughness: 0.6 })); seat.position.y = 0.66; st.add(seat);
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.64, 8), mAlu); leg.position.y = 0.32; st.add(leg);
          const ft = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 18), mAlu); ft.position.y = 0.01; st.add(ft); }
        solids.push(hidBox(W, 1.0, C.d, 0, 0.5, C.z, S0));
      }

      /* the carton half unpacked by the right cabinet, its flaps out, bubble wrap spilling */
      { const g = new THREE.Group(); g.position.set(1.35, 0, 0.9); g.rotation.y = -0.35; S0.add(g);
        const mC = M({ map: tCart, roughness: 0.9 }), mCin = M({ color: 0x8a6a42, roughness: 0.95, side: THREE.DoubleSide });
        const W2 = 0.5, H2 = 0.36, D2 = 0.4;
        for (const [w, x, z, ry] of [[W2, 0, D2 / 2, 0], [W2, 0, -D2 / 2, Math.PI], [D2, W2 / 2, 0, Math.PI / 2], [D2, -W2 / 2, 0, -Math.PI / 2]]) {
          const f = new THREE.Mesh(new THREE.PlaneGeometry(w, H2), mC); f.position.set(x, H2 / 2, z); f.rotation.y = ry; g.add(f);
          const fi = new THREE.Mesh(new THREE.PlaneGeometry(w, H2), mCin); fi.position.set(x * 0.98, H2 / 2, z * 0.98); fi.rotation.y = ry + Math.PI; g.add(fi);
          const fl = new THREE.Mesh(new THREE.PlaneGeometry(w, D2 * 0.48), mCin); fl.position.set(x, H2, z); fl.rotation.set(0, ry, 0);
          fl.rotateX(-Math.PI / 2 - 0.55); fl.translateY(D2 * 0.24); g.add(fl);
        }
        const mBub = M({ map: tBub, roughness: 0.15, transparent: true, depthWrite: false, side: THREE.DoubleSide });
        const bw = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 8), mBub); bw.scale.set(1.1, 0.55, 0.9); bw.position.set(0.02, H2 + 0.02, 0); g.add(bw);
        const sp = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.34), mBub); sp.rotation.set(-Math.PI / 2 + 0.08, 0, 0.3); sp.position.set(-0.42, 0.012, 0.12); g.add(sp);
        solids.push(hidBox(0.56, 0.4, 0.46, 1.35, 0.2, 0.9, S0));
      }

      /* the congratulations stand by the door: a tripod, a round of flowers, two red ribbons — 开张大吉, GRAND OPENING */
      const flowerStand = (px, pz, pry, words, seed, cols = [0xd8202a, 0xf2c030, 0xf27aa0, 0xf6f0e0, 0xe8642a], sway = false) => {
        const g = new THREE.Group(); g.position.set(px, 0, pz); g.rotation.y = pry; S0.add(g);
        const mLeg = M({ color: 0xc8a050, roughness: 0.4, metalness: 0.6 });
        for (const a of [0, 2.1, 4.2]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.45, 6), mLeg); l.position.set(Math.cos(a) * 0.14, 0.7, Math.sin(a) * 0.14 - 0.05); l.rotation.set(Math.sin(a) * 0.12, 0, -Math.cos(a) * 0.12); g.add(l); }
        const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.06, 28), M({ color: sway ? 0x4a4632 : 0x2e5a2e, roughness: 0.8 })); disc.rotation.x = Math.PI / 2; disc.position.set(0, 1.5, 0); g.add(disc);
        const n = 120, fm = cols.map(c2 => M({ color: c2, roughness: 0.7 }));
        const fg = new THREE.SphereGeometry(0.034, 8, 6), ins = fm.map(m2 => new THREE.InstancedMesh(fg, m2, n));
        const cnt = fm.map(() => 0), mm = new THREE.Matrix4(), rr = rng(seed);
        for (let k = 0; k < n * 2; k++) { const a = rr() * Math.PI * 2, d = Math.sqrt(rr()) * 0.34, ci = rr() * cols.length | 0; if (cnt[ci] >= n) continue;
          mm.makeTranslation(Math.cos(a) * d, 1.5 + Math.sin(a) * d, 0.04 + (0.34 - d) * 0.18 + rr() * 0.02); ins[ci].setMatrixAt(cnt[ci]++, mm); }
        ins.forEach((im, i) => { im.count = cnt[i]; g.add(im); });
        words.forEach(([t, lat, x]) => {
          const rb = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 1.05), M({ map: tex(makeRibbon(THREE, cnv, t, lat)), roughness: 0.4, side: THREE.DoubleSide }));
          rb.position.set(x, 0.92, 0.07); rb.rotation.z = -Math.sign(x) * 0.05; g.add(rb);
          if (sway) { rb.userData.rz0 = rb.rotation.z; props.ribbons.push(rb); } });
        solids.push(hidBox(0.6, 1.6, 0.5, px, 0.8, pz, S0));
        return g;
      };
      /* (v24.37) by the door's other side now, its flowers to the corridor as a well-wisher's stand faces: on the left it
         stood in the middle of a phone's look out from behind the counter, over the corridor and the shops across it where
         the people now pass, and it showed the corridor its bare back */
      /* (v25.0) weeks on: still inside his door, turned in to the shop, its flowers dried brown (nobody took it away) */
      const DRIED = [0x7a4a2e, 0x9a6a48, 0x8a5a5a, 0xb8a080, 0x6a4a30];
      props.stand = flowerStand(STAND.x, STAND.z, STAND.ry, [['开张大吉', false, -0.29], ['GRAND OPENING', true, 0.29]], 4851, DRIED, true);
      /* (v24.37) and outside it in the corridor, two more from well-wishers, as a shop that has just opened has them lined up
         at its front: 生意兴隆 and 财源广进 (may business thrive, may wealth come in), 大展鸿图 and 开张志喜 (great plans
         unfolding, joy at the opening) */
      /* (v25.0: the two outside in the corridor were cleared away by the mall weeks ago) */
      /* (v24.37) the ceiling's air-conditioner, as every unit has one: a white cassette, its grille and its four vents */
      { const yC = SHOP.H - 0.022, zC = 0.35;
        bx(0.84, 0.04, 0.84, mGloss, 0, yC, zC);
        bx(0.46, 0.006, 0.46, M({ color: 0xc8ccd0, roughness: 0.6 }), 0, yC - 0.022, zC);
        for (const [dx, dz, w, d] of [[0, -0.33, 0.6, 0.06], [0, 0.33, 0.6, 0.06], [-0.33, 0, 0.06, 0.6], [0.33, 0, 0.06, 0.6]]) bx(w, 0.006, d, M({ color: 0x5a5e64, roughness: 0.7 }), dx, yC - 0.021, zC + dz); }
      /* (v24.37) his door mat inside the shutter's line, and on his counter's end the casing he does, on an acrylic stand */
      { const mat = pl(1.1, 0.55, M({ map: tex(makeDoorMat(THREE, cnv)), roughness: 0.95 }), -0.35, 0.004, 2.55, -Math.PI / 2); void mat;
        const sg = pl(0.15, 0.21, M({ map: tex(makeCasingSign(THREE, cnv)), roughness: 0.35 }), -1.25, COUNTER.h + 0.046 + 0.112, COUNTER.z + 0.08, -0.18, 0); void sg;
        bx(0.17, 0.012, 0.07, M({ color: 0xe8f0f2, roughness: 0.1, transparent: true, opacity: 0.5 }), -1.25, COUNTER.h + 0.046 + 0.006, COUNTER.z + 0.09); }

      /* THE SHUTTER: the curtain hangs from its drum (y 2.8) and rises into it; the light comes in under its edge */
      { const SW = SHOP.x1 - SHOP.x0 - 0.1, TOP = 2.8;
        bx(SW + 0.2, 0.34, 0.34, mShutPaint, 0, TOP + 0.17, SHOP.z1 + 0.12);                     // the drum's housing
        for (const sx of [-1, 1]) bx(0.07, TOP, 0.09, mShutPaint, sx * (SW / 2 + 0.04), TOP / 2, SHOP.z1);   // the guide rails
        const g = new THREE.PlaneGeometry(SW, 1); g.translate(0, -0.5, 0);
        const ct = tSlat.clone(); ct.needsUpdate = true; madeTex.push(ct);
        const cm = M({ map: ct, roughness: 0.5, metalness: 0.55, side: THREE.DoubleSide });
        const cur = new THREE.Mesh(g, cm); cur.position.set(0, TOP, SHOP.z1); cur.userData.dyn = true; S0.add(cur);
        const bar = new THREE.Mesh(new THREE.BoxGeometry(SW, 0.06, 0.05), mShutPaint); bar.userData.dyn = true; S0.add(bar);
        for (const sx of [-0.6, 0.6]) { const hd = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.04), mAlu); hd.position.set(sx, 0, -0.04); bar.add(hd); }
        shop.curtain = cur; shop.curTex = ct; shop.bar = bar; shop.top = TOP;
        /* the light it lets in: a warm-grey bar on the floor that grows inward as it rises */
        const sm = B({ map: tGl, color: 0xffe2c0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
        const sp = new THREE.Mesh(new THREE.PlaneGeometry(SW + 1.2, 1), sm); sp.rotation.x = -Math.PI / 2; sp.position.set(0, 0.006, SHOP.z1); sp.userData.dyn = true; S0.add(sp);
        shop.spill = sp; shop.spillMat = sm;
      }

      /* (v24.37) THE MALL OPEN ROUND HIM (Chad, 2 Nov 2026: "Also i think the players amulet shop can still be improved more.
         And also the outside of the amulet shop too. Why are other stores also closed. Why not show real people walking past
         the shop etc."). The units the films can see are open for the morning's trade, each a room behind its rolled-up
         shutter, stocked as its kind of shop is and lit by its own ceiling (painted light: unlit, every face as bright as the
         light on it, v15.1): across the corridor the goldsmith (a phone's look out of his shop holds its counter and its
         man), the clock shop and the provision shop (a desktop's), and either side of his own the tailor and the
         prayer-goods shop (a desktop's edges as his shutter goes up). The units no shot sees keep their shutters down.
         Each unit draws in three meshes — its colours, its pictures (makeMallAtlas), its glass. Local to the unit: its
         front on z 0 facing +z, its room to −z, x across its front */
      const MAT_A = makeMallAtlas(THREE, cnv), MC = MAT_A.cells;
      const mMallC = B({ vertexColors: true, side: THREE.DoubleSide }), mMallT = B({ map: tex(MAT_A.tex), vertexColors: true, side: THREE.DoubleSide, alphaTest: 0.5 });
      const mMallG = B({ color: 0xe8f4f8, transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide });
      const _mc = new THREE.Color();
      function mallRoom(kind, cx, zf, face) {
        const W2 = 2.17, D = 5.6, HC = 2.95, V = { p: [], c: [] }, A = { p: [], c: [], u: [] }, GL = { p: [], c: [] };
        const lc = (hex, k = 1) => { _mc.set(hex); return [_mc.r * k, _mc.g * k, _mc.b * k]; };
        const q = (T, a, b, c2, d, ca) => { T.p.push(...a, ...b, ...c2, ...a, ...c2, ...d); for (let i = 0; i < 6; i++) T.c.push(...ca); };
        const pic = (a, b, c2, d, cell, k = 1) => { q(A, a, b, c2, d, lc(0xffffff, k)); const [u0, v0, u1, v1] = cell; A.u.push(u0, v0, u1, v0, u1, v1, u0, v0, u1, v1, u0, v1); };
        /* a box, each face as bright as the light on it: [top, bottom, +x, −x, +z (the front), −z] */
        const KB = [0.95, 0.42, 0.72, 0.72, 0.84, 0.6];
        const box = (x0, x1, y0, y1, z0, z1, hex, K = KB, T = V) => {
          const f = (i) => lc(hex, K[i]);
          q(T, [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], f(0)); q(T, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], f(1));
          q(T, [x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0], f(2)); q(T, [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], f(3));
          q(T, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], f(4)); q(T, [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], f(5));
        };
        /* pictures on the room's three walls, each read from inside: the back from −x to +x; the −x wall from the front
           back; the +x wall from the back to the front */
        const onBack = (x0, x1, y0, y1, cell, k) => pic([x0, y0, -D + 0.012], [x1, y0, -D + 0.012], [x1, y1, -D + 0.012], [x0, y1, -D + 0.012], cell, k);
        const onLeft = (z0, z1, y0, y1, cell, k) => pic([-W2 + 0.012, y0, z0], [-W2 + 0.012, y0, z1], [-W2 + 0.012, y1, z1], [-W2 + 0.012, y1, z0], cell, k);
        const onRight = (z0, z1, y0, y1, cell, k) => pic([W2 - 0.012, y0, z1], [W2 - 0.012, y0, z0], [W2 - 0.012, y1, z0], [W2 - 0.012, y1, z1], cell, k);
        const RM = { gold: [0xf2f0e8, 0xe6e2d8, 0x7a1214], clock: [0xe8dcc4, 0xcfc4ae], prov: [0xd8ccb0, 0xc4b89e], tailor: [0xece4dc, 0xd2c8be], prayer: [0xd8b896, 0xc8b49a, 0x7a1416] }[kind];   // [walls, floor, back wall]
        /* the room: its floor, ceiling, walls, the light panels in its ceiling */
        q(V, [-W2, 0.003, 0], [W2, 0.003, 0], [W2, 0.003, -D], [-W2, 0.003, -D], lc(RM[1], 0.74));
        q(V, [-W2, HC, 0], [W2, HC, 0], [W2, HC, -D], [-W2, HC, -D], lc(0xf4f2ec, 0.9));
        q(V, [-W2, 0, -D], [W2, 0, -D], [W2, HC, -D], [-W2, HC, -D], lc(RM[2] || RM[0], 0.8));
        for (const sx of [-1, 1]) q(V, [sx * W2, 0, 0], [sx * W2, 0, -D], [sx * W2, HC, -D], [sx * W2, HC, 0], lc(RM[0], 0.86));
        for (const [px, pz] of [[-1.1, -1.2], [1.1, -1.2], [-1.1, -3.4], [1.1, -3.4]]) box(px - 0.3, px + 0.3, HC - 0.02, HC - 0.005, pz - 0.3, pz + 0.3, 0xffffff, [1, 1, 1, 1, 1, 1]);
        box(-W2, W2, 0, 0.1, -D, -D + 0.02, 0x8a8478);                                     // the skirting
        /* a glass counter: its base, a coloured band, the tray under the glass, the glass box over it */
        const glassCounter = (x0, x1, z0, z1, h, base, band, tray) => {
          box(x0, x1, 0, h - 0.22, z0, z1, base);
          box(x0 - 0.005, x1 + 0.005, h - 0.24, h - 0.22, z0 - 0.005, z1 + 0.005, band, [1, 0.6, 0.9, 0.9, 0.95, 0.8]);
          if (tray) { const along = Math.abs(x1 - x0) >= Math.abs(z1 - z0);
            if (along) pic([x0 + 0.03, h - 0.215, z1 - 0.03], [x1 - 0.03, h - 0.215, z1 - 0.03], [x1 - 0.03, h - 0.215, z0 + 0.03], [x0 + 0.03, h - 0.215, z0 + 0.03], tray, 1);
            else pic([x1 - 0.03, h - 0.215, z1 - 0.03], [x1 - 0.03, h - 0.215, z0 + 0.03], [x0 + 0.03, h - 0.215, z0 + 0.03], [x0 + 0.03, h - 0.215, z1 - 0.03], tray, 1); }
          box(x0, x1, h - 0.22, h, z0, z1, 0xffffff, [1, 1, 1, 1, 1, 1], GL);
          for (const xx of [x0, x1]) for (const zz of [z0, z1]) box(xx - 0.008, xx + 0.008, h - 0.22, h, zz - 0.008, zz + 0.008, 0xc8ccd0, [0.95, 0.5, 0.8, 0.8, 0.85, 0.7]);
        };
        const cyl = (x, z, y0, y1, rad, n, hex) => { for (let i = 0; i < n; i++) { const a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2;
          q(V, [x + Math.cos(a0) * rad, y0, z + Math.sin(a0) * rad], [x + Math.cos(a1) * rad, y0, z + Math.sin(a1) * rad], [x + Math.cos(a1) * rad, y1, z + Math.sin(a1) * rad], [x + Math.cos(a0) * rad, y1, z + Math.sin(a0) * rad], lc(hex, 0.7 + 0.25 * Math.cos((a0 + a1) / 2 - 0.6)));
          V.p.push(x, y1, z, x + Math.cos(a0) * rad, y1, z + Math.sin(a0) * rad, x + Math.cos(a1) * rad, y1, z + Math.sin(a1) * rad); const t = lc(hex, 0.95); V.c.push(...t, ...t, ...t); } };
        const rr = rng(6200 + Math.round(cx * 10) + (face > 0 ? 0 : 500));
        if (kind === 'gold') {
          /* the goldsmith: white and bright, a red back wall of chains, mirrors down both sides, an L of glass counters lit
             from inside with the trays under the glass */
          onBack(-1.95, 1.95, 0.95, 2.55, MC.goldWall, 0.95);
          box(-1.98, 1.98, 0.9, 0.95, -D + 0.04, -D + 0.08, 0xc8a040); box(-1.98, 1.98, 2.55, 2.6, -D + 0.04, -D + 0.08, 0xc8a040);
          for (const sx of [-1, 1]) { const xw = sx * (W2 - 0.015);
            q(V, [xw, 1.05, -1.6], [xw, 1.05, -4.9], [xw, 2.45, -4.9], [xw, 2.45, -1.6], lc(0xb8c8d0, 0.95));
            box(xw - 0.012, xw + 0.012, 1.02, 1.05, -4.92, -1.58, 0xc8a040); box(xw - 0.012, xw + 0.012, 2.45, 2.48, -4.92, -1.58, 0xc8a040); }
          glassCounter(-2.0, 0.9, -1.35, -0.75, 1.05, 0xf4f2ec, 0xc8a040, MC.goldTray);
          glassCounter(-W2 + 0.02, -1.55, -4.6, -1.5, 1.05, 0xf4f2ec, 0xc8a040, MC.goldTray);
          glassCounter(1.45, W2 - 0.02, -4.6, -2.2, 1.05, 0xf4f2ec, 0xc8a040, MC.goldTray);
          box(-1.9, 0.8, 0, 0.62, -2.2, -1.75, 0xe8e4dc);                                   // the counter behind the man: drawers, a till
          box(-0.6, -0.25, 0.62, 0.74, -2.1, -1.85, 0x2a2a2e);
          for (const x of [-1.6, 0.4]) { cyl(x, -0.42, 0, 0.62, 0.17, 10, 0xc8a040); cyl(x, -0.42, 0.62, 0.68, 0.19, 12, 0x8a1418); }   // two stools for its customers
        } else if (kind === 'clock') {
          /* the clock and watch repairer: clocks covering the walls, a glass counter of watches, his bench and lamp at the
             side, a tall clock in the corner */
          onBack(-2.1, 2.1, 0.75, 2.75, MC.clockWall, 0.92);
          onLeft(-0.6, -4.9, 1.2, 2.7, MC.clockWall, 0.88); onRight(-0.6, -4.9, 1.2, 2.7, MC.clockWall, 0.88);
          glassCounter(-1.7, 1.2, -1.45, -0.9, 1.0, 0x6a4a2c, 0x2a2a2e, MC.watchTray);
          box(1.35, 2.1, 0, 0.74, -2.6, -1.5, 0x5a3c22); box(1.35, 2.1, 0.74, 0.77, -2.6, -1.5, 0x7a5a3a);   // the bench
          box(1.9, 1.94, 0.77, 1.25, -2.2, -2.16, 0x2a2a2e); box(1.62, 1.94, 1.23, 1.27, -2.2, -2.16, 0x2a2a2e); box(1.56, 1.68, 1.14, 1.24, -2.22, -2.12, 0x3a3a40);
          box(1.5, 1.74, 0.77, 0.8, -1.95, -1.7, 0xd8d8dc);
          box(-2.05, -1.6, 0, 1.95, -5.4, -5.1, 0x4a2c18); box(-1.95, -1.7, 1.45, 1.75, -5.11, -5.09, 0xf2ecd8);   // the tall clock, its face
          cyl(1.2, -2.9, 0, 0.5, 0.16, 10, 0x2a2a2e);
        } else if (kind === 'prov') {
          /* the provision shop: shelved to the ceiling, packets hung in strips across its front, crates out at its foot */
          onLeft(-0.5, -5.0, 0.1, 2.5, MC.goods, 0.9); onRight(-0.5, -5.0, 0.1, 2.5, MC.goods, 0.9);
          onBack(-1.8, 1.8, 0.1, 2.5, MC.goods, 0.85);
          for (const hx of [-1.6, -0.9, 0.9, 1.6]) pic([hx - 0.25, 1.35, -0.12], [hx + 0.25, 1.35, -0.12], [hx + 0.25, 2.6, -0.12], [hx - 0.25, 2.6, -0.12], MC.hang, 0.92);
          for (let k = 0; k < 5; k++) { const x0 = -1.9 + k * 0.42 + rr() * 0.05, col = [0xc82a2a, 0x2a5ab8, 0x2a8a4a][k % 3];
            box(x0, x0 + 0.38, 0, 0.3, -0.75, -0.35, col); box(x0 + 0.02, x0 + 0.36, 0.3, 0.33, -0.73, -0.37, [0xe8a020, 0xe86a2a, 0x8ac83a, 0xf2e2b0][(rr() * 4) | 0]); }
          box(1.0, 2.0, 0, 0.95, -1.9, -1.4, 0xd8d4cc); box(1.3, 1.6, 0.95, 1.15, -1.85, -1.6, 0x2a2a2e);   // the till
        } else if (kind === 'tailor') {
          /* the tailor: rails of finished clothes down the right, bolts of cloth on the back wall, the cutting table and the
             machine, a long mirror */
          onBack(-1.9, 1.9, 0.5, 2.6, MC.fabric, 0.9);
          for (const z0 of [-0.6, -2.4]) { box(W2 - 0.55, W2 - 0.52, 1.75, 1.78, z0 - 1.6, z0, 0xc8ccd0);
            for (let k = 0; k < 13; k++) { const zz = z0 - 0.08 - k * 0.115, col = [0xe8e8e4, 0x3a5a9a, 0xc8443a, 0x2a2a2e, 0x8a7a5a, 0x4a8a5a, 0xd888a8][(rr() * 7) | 0], len = 0.65 + rr() * 0.45;
              box(W2 - 0.78, W2 - 0.3, 1.74 - len, 1.72, zz - 0.035, zz + 0.035, col, [0.9, 0.5, 0.75, 0.75, 0.82, 0.62]); } }
          box(-1.6, 0.4, 0, 0.88, -2.9, -2.1, 0x8a6a4a); box(-1.62, 0.42, 0.88, 0.91, -2.92, -2.08, 0xd8c8a8);   // the cutting table
          box(-1.4, -0.95, 0.91, 1.15, -2.7, -2.45, 0x2a2a2e); box(-1.38, -1.0, 1.15, 1.22, -2.68, -2.6, 0x2a2a2e);  // the machine
          q(V, [-W2 + 0.012, 0.3, -1.2], [-W2 + 0.012, 0.3, -1.9], [-W2 + 0.012, 2.1, -1.9], [-W2 + 0.012, 2.1, -1.2], lc(0xb8c8d0, 0.95));   // the mirror
          box(0.6, 1.8, 0, 0.95, -1.5, -1.0, 0xe8e0d4);
        } else if (kind === 'prayer') {
          /* the prayer-goods shop: red and gold to the ceiling, joss sticks in buckets at its front, gold paper in stacks,
             red lanterns hung */
          onBack(-2.0, 2.0, 0.2, 2.6, MC.prayer, 0.9); onLeft(-0.4, -5.0, 0.2, 2.6, MC.prayer, 0.88); onRight(-0.4, -5.0, 0.2, 2.6, MC.prayer, 0.88);
          for (let k = 0; k < 4; k++) { const x = -1.8 + k * 0.3; cyl(x, -0.45, 0, 0.32, 0.12, 10, 0xc8a040);
            for (let j = 0; j < 9; j++) { const a = j * 0.7, d = 0.02 + (j % 3) * 0.03; box(x + Math.cos(a) * d - 0.004, x + Math.cos(a) * d + 0.004, 0.32, 0.95 + rr() * 0.2, -0.45 + Math.sin(a) * d - 0.004, -0.45 + Math.sin(a) * d + 0.004, j % 2 ? 0xd83a2a : 0xe8b82a); } }
          for (let k = 0; k < 4; k++) box(0.2 + k * 0.42, 0.56 + k * 0.42, 0, 0.18 + rr() * 0.3, -0.85, -0.45, 0xf2d04a);
          for (const lx of [-1.2, 0, 1.2]) { cyl(lx, -0.6, 2.35, 2.62, 0.2, 10, 0xc81a1a); box(lx - 0.006, lx + 0.006, 2.62, HC, -0.606, -0.594, 0xc8a040); cyl(lx, -0.6, 2.3, 2.35, 0.05, 6, 0xe8b82a); }
          box(-0.9, 0.9, 0, 0.95, -2.4, -1.9, 0x7a1416);
        }
        const G2 = new THREE.Group(); G2.position.set(cx, 0, zf); G2.rotation.y = face > 0 ? 0 : Math.PI; S0.add(G2);
        const mk = (T, mat, uv) => { if (!T.p.length) return null; const geo = new THREE.BufferGeometry();
          geo.setAttribute('position', new THREE.Float32BufferAttribute(T.p, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(T.c, 3));
          if (uv) geo.setAttribute('uv', new THREE.Float32BufferAttribute(T.u, 2));
          geo.computeBoundingSphere(); const m = new THREE.Mesh(geo, mat); G2.add(m); return m; };
        mk(V, mMallC); mk(A, mMallT, true); const gm = mk(GL, mMallG); if (gm) gm.renderOrder = 2;
        return G2;
      }
      /* THE CORRIDOR: terrazzo, a skylight's soft grey down its middle, the other units' fronts and their signs (v24.37: the ones a shot can see open for the day, mallRoom) */
      { pl(COR.x1 - COR.x0, COR.z1 - COR.z0, mTer, 0, 0, (COR.z0 + COR.z1) / 2, -Math.PI / 2);
        pl(COR.x1 - COR.x0, COR.z1 - COR.z0, mCeil, 0, COR.H, (COR.z0 + COR.z1) / 2, Math.PI / 2);
        const sky = B({ color: 0xdfe6ec });
        props.corSky = sky; props.corCeil = mCeil;   // (v25.0) the corridor after closing (shopCtl.night)
        pl(COR.x1 - COR.x0 - 0.6, 1.4, sky, 0, COR.H - 0.01, (COR.z0 + COR.z1) / 2, Math.PI / 2);
        for (const dz of [-0.76, 0.76]) bx(COR.x1 - COR.x0, 0.12, 0.12, mGloss, 0, COR.H - 0.06, (COR.z0 + COR.z1) / 2 + dz);
        const signs = [['JIN FU PROVISION', '金福', '#b81e24', '#fff4d8'], ['MEI LING TAILOR', '美玲', '#1e4a8a', '#ffffff'], ['TIONG HOE CLOCKS', '中和', '#2a2a2a', '#f2c84a'],
                       ['SIN HUAT PHARMACY', '新发', '#2a7a4a', '#ffffff'], ['GOOD LUCK GOLDSMITH', '好运', '#7a1a1a', '#f6d870'], ['KIM LEE MOBILE', '金利', '#e86a1a', '#ffffff']];
        const unitW = 4.8;
        const unit = (cx, z, face, sg, open) => {                 // face: +1 looks toward +z, −1 toward −z; (v24.37) open: its kind, its shutter rolled up
          const pz = z;
          if (open) { mallRoom(open, cx, pz, face);
            /* (v25.0) and its own shutter, down after closing (shopCtl.night) */
            const ns = new THREE.Mesh(new THREE.PlaneGeometry(unitW - 0.5, 2.8), mSlat); ns.position.set(cx, 1.4, pz + face * 0.03); ns.rotation.y = face > 0 ? 0 : Math.PI;
            ns.visible = false; S0.add(ns); props.nightShut.push(ns); }
          else { const cur = new THREE.Mesh(new THREE.PlaneGeometry(unitW - 0.5, 2.8), mSlat); cur.position.set(cx, 1.4, pz); cur.rotation.y = face > 0 ? 0 : Math.PI; S0.add(cur);
            const ct2 = cur.material; void ct2; }
          bx(unitW - 0.3, 0.34, 0.3, mShutPaint, cx, 2.97, pz - face * 0.1);
          bx(unitW, COR.H - 3.14, 0.2, mWall, cx, 3.14 + (COR.H - 3.14) / 2, pz - face * 0.1);
          if (sg) { const s2 = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.46), B({ map: tex(makeShopSign(THREE, cnv, sg[0], sg[1], sg[2], sg[3])) })); s2.position.set(cx, 3.36, pz + face * 0.012); s2.rotation.y = face > 0 ? 0 : Math.PI; S0.add(s2); props.signs.push(s2.material); }
          bx(0.46, COR.H, 0.46, M({ color: 0xc8c4bc, roughness: 0.5 }), cx + unitW / 2, COR.H / 2, pz - face * 0.12);
        };
        /* (v24.37) who is where, each sign once (they were dealt in turn, and MEI LING's hung over two fronts): across the
           corridor the goldsmith, the clock shop and the provision shop open, a phone's and a desktop's look out of his shop
           holding them; either side of his own the tailor and the prayer-goods shop open, at a desktop's edges as his
           shutter goes up; the four no shot sees shut */
        signs.push(['HOCK SENG PRAYER ITEMS', '福成', '#9a1414', '#f6d870'], ['WAH LEE TRAVEL', '华利', '#1e5a8a', '#ffffff'], ['HAPPY OPTICAL', '眼镜', '#2a7a8a', '#ffffff']);
        for (const [cx, k, open] of [[-9.6, 7, null], [-4.8, 4, 'gold'], [0, 2, 'clock'], [4.8, 0, 'prov'], [9.6, 3, null]]) unit(cx, COR.z1, -1, signs[k], open);   // across the corridor
        for (const [cx, k, open] of [[-9.6, 5, null], [-4.8, 1, 'tailor'], [4.8, 6, 'prayer'], [9.6, 8, null]]) unit(cx, SHOP.z1, 1, signs[k], open);              // his neighbours
        /* (v24.37) the pillar at his shop's right: each unit stands one at its +x end, so his own end had none, and a 0.2 m
           slot beside his shutter opened onto nothing (a ray-cast and a desktop photograph found it) */
        bx(0.46, COR.H, 0.46, M({ color: 0xc8c4bc, roughness: 0.5 }), SHOP.x1, COR.H / 2, SHOP.z1 - 0.12);
        /* his own fascia over his shutter: a red GRAND OPENING banner (the sign proper is still on order) */
        bx(SHOP.x1 - SHOP.x0, COR.H - 3.14, 0.2, mWall, 0, 3.14 + (COR.H - 3.14) / 2, SHOP.z1 + 0.1);
        { const bn = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.4), M({ map: tex(makeShopBanner(THREE, cnv)), roughness: 0.6 })); bn.position.set(0, 3.36, SHOP.z1 + 0.21); S0.add(bn); }   // (v24.22: its words — the amulets, GRAND OPENING)
        /* the corridor's ends and an EXIT sign */
        for (const sx of [-1, 1]) pl(COR.z1 - COR.z0, COR.H, mWall, sx * COR.x1, COR.H / 2, (COR.z0 + COR.z1) / 2, 0, -sx * Math.PI / 2);
        { const ex = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.15), B({ map: tex(makeExitSign(THREE, cnv)) })); ex.position.set(COR.x1 - 0.02, 2.7, (COR.z0 + COR.z1) / 2); ex.rotation.y = -Math.PI / 2; S0.add(ex); }
        /* a mop bucket against a pillar, left by the cleaner whose broom we only hear */
        { const bk2 = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.3, 14), M({ color: 0xf2c218, roughness: 0.5 })); bk2.position.set(-4.2, 0.15, COR.z1 - 0.5); S0.add(bk2);
          const mop = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.3, 6), M({ color: 0x8a6a4a, roughness: 0.7 })); mop.position.set(-4.12, 0.7, COR.z1 - 0.45); mop.rotation.z = 0.2; S0.add(mop); }
      }
      /* (v24.22) and the stock stood, kind by kind, place by place */
      const KIND_H = { e4somdej: 0.052, e4khunpaen: 0.056, e4rian: 0.05, e4jatukham: 0.064, e4pidta: 0.03, e4kring: 0.04, e4meedmor: 0.17, e4bucha: 0.3, e4takrutsm: 1.0 };
      for (const [k, list] of stock) { const key = k.split('|')[0]; manyOf(key, list, S0, KIND_H[key] || 0.06); }
      shop.stockCount = [...stock.values()].reduce((a, l) => a + l.length, 0);
    }


    /* ---------------------------------------------------- (v25.0) WHAT THIS CHAPTER ADDS TO HIS SHOP (§6.2)
       Each built in code from the shop's own materials and canvases, sized to the real thing, lit by the presets (no
       lamp, v15.1); the moving parts eased on wall time in shopFrame. Lersi Chin's things stand hidden until he brings
       them (the visit film shows them). */
    const props = { till: null, tillK: 0, tillTo: 0, bag: null, bagFlap: null, bagK: 0, bagTo: 0, jacket: null, jacketK: 0, jacketTo: 0,
                    fridge: null, fridgeDoor: null, fridgeLight: null, fridgeK: 0, fridgeTo: 0, wallet: null, note: null, sw: null, swDot: null,
                    shelf: null, piece: null, pieces: {}, mat: null, matK: 1, matTo: 1, bowl: null, water: null, mayom: null, thread: null,
                    cloth: null, khan: null, flames: [], yaam: null, envelope: null, stand: null, ribbons: [], sway: 0, lcThings: null,
                    ceil: null, ceilS: null, ceilK: 1, ceilFrom: 1, ceilTo: 1, c0: 0, c1: 0, night: false, nightShut: [], signs: [], corSky: null, corCeil: null };
    function buildProps() {
      const S0 = worldS, top = COUNTER.h + 0.046;
      const mesh = (g, m, x, y, z, p = S0) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.receiveShadow = true; p.add(o); return o; };
      const mBlackP = M({ color: 0x161618, roughness: 0.45 }), mAluP = M({ color: 0xc8ccd0, roughness: 0.3, metalness: 0.85 });
      /* THE TILL: a black cash drawer in the cupboard's back, his side, its notes and coins in their trays */
      { const g = new THREE.Group(); g.position.set(TILL.x, TILL.y, TILL.z); S0.add(g); props.till = g;
        const W = 0.42, H = 0.1, D = 0.36;
        mesh(new THREE.BoxGeometry(W, 0.012, D), mBlackP, 0, -H / 2 + 0.006, D / 2, g);                       // its floor
        for (const sx of [-1, 1]) mesh(new THREE.BoxGeometry(0.012, H, D), mBlackP, sx * (W / 2 - 0.006), 0, D / 2, g);
        mesh(new THREE.BoxGeometry(W, H, 0.012), mBlackP, 0, 0, D - 0.006, g);
        const front = mesh(new THREE.BoxGeometry(W + 0.01, H + 0.012, 0.014), M({ color: 0x232326, roughness: 0.35 }), 0, 0, -0.004, g); void front;
        mesh(new THREE.BoxGeometry(0.12, 0.014, 0.01), mAluP, 0, 0.02, -0.014, g);                             // its handle
        const cols = ['#c9a8d6', '#8cc2a2', '#e8b48a', '#a6bfe0'];                                                // the notes, by colour
        cols.forEach((c2, i) => mesh(new THREE.BoxGeometry(0.075, 0.022, 0.15), M({ color: c2, roughness: 0.8 }), -0.15 + i * 0.09, -H / 2 + 0.024, 0.2, g));
        for (let i = 0; i < 4; i++) mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.012, 14), M({ color: i % 2 ? 0xc8b070 : 0xb8bcc0, roughness: 0.35, metalness: 0.8 }), -0.15 + i * 0.09, -H / 2 + 0.018, 0.06, g);
      }
      /* HIS BAG on the floor at the counter's end: a grey sling bag, its flap that lifts */
      { const g = new THREE.Group(); g.position.set(BAG.x, 0, BAG.z); g.rotation.y = 0.5; S0.add(g); props.bag = g;
        const mBag = M({ map: tex(makeCanvasCloth(THREE, cnv, '#3a3d44', 7101)), roughness: 0.92 });
        const body = mesh(new THREE.BoxGeometry(0.34, 0.24, 0.13), mBag, 0, 0.12, 0, g); void body;
        for (const sx of [-1, 1]) mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.13, 12, 1, false, sx < 0 ? Math.PI : 0, Math.PI), mBag, sx * 0.17, 0.12, 0, g).rotation.x = Math.PI / 2;
        const flapG = new THREE.Group(); flapG.position.set(0, 0.24, -0.065); g.add(flapG); props.bagFlap = flapG;
        mesh(new THREE.BoxGeometry(0.36, 0.012, 0.15), mBag, 0, 0, 0.075, flapG);
        mesh(new THREE.BoxGeometry(0.06, 0.014, 0.03), mBlackP, 0, -0.004, 0.15, flapG);                     // its buckle
        const strap = mesh(new THREE.TorusGeometry(0.24, 0.012, 6, 28, Math.PI * 0.9), mBag, 0, 0.13, 0.02, g); strap.rotation.set(-Math.PI / 2 + 0.2, 0, Math.PI * 0.05);
        solids.push(hidBox(0.4, 0.3, 0.22, BAG.x, 0.15, BAG.z, S0));
      }
      /* HIS JACKET over his stool: a navy zip jacket, its body draped across the seat and down both sides, a sleeve
         hanging (the cloth bent over the seat's round top by its own vertices — a drape, never a box) */
      { const g = new THREE.Group(); g.position.set(STOOL.x, 0.685, STOOL.z); g.rotation.y = -0.3; S0.add(g); props.jacket = g;
        const mJ = M({ map: tex(makeJacketCloth(THREE, cnv)), roughness: 0.85, side: THREE.DoubleSide });
        const geo = new THREE.PlaneGeometry(0.62, 0.5, 24, 20); geo.rotateX(-Math.PI / 2);
        const p = geo.attributes.position;
        for (let i = 0; i < p.count; i++) {
          const x = p.getX(i), z = p.getZ(i), r = Math.hypot(x * 0.9, z), over = Math.max(0, r - 0.16);
          p.setY(i, 0.012 + 0.008 * Math.cos(x * 30) * Math.cos(z * 22) - over * over * 6.5 - over * 0.9);
        }
        geo.computeVertexNormals();
        const drape = new THREE.Mesh(geo, mJ); g.add(drape);
        const slv = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.42, 12, 6, true), mJ); slv.position.set(0.25, -0.2, 0.08); slv.rotation.set(0.25, 0, 0.18); g.add(slv);
        const zip = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.004, 0.36), mAluP); zip.position.set(-0.04, 0.02, 0); g.add(zip);
      }
      /* THE DRINKS FRIDGE set into the cupboard's back, his side: a glass door in a black frame, lit inside, two
         shelves of water and canned drinks — and the wallet beside the water */
      { const C = COUNTER, W = FRIDGE.x1 - FRIDGE.x0, H = FRIDGE.h, cx = (FRIDGE.x0 + FRIDGE.x1) / 2, D = 0.44, zf = FRIDGE.z - 0.002;
        const g = new THREE.Group(); g.position.set(cx, 0, zf); S0.add(g); props.fridge = g;
        const mIn = B({ color: 0xbfd2e0 }); props.fridgeLight = mIn;                                            // the cabinet inside, lit by its own lamp (painted)
        mesh(new THREE.PlaneGeometry(W - 0.03, H - 0.05), mIn, 0, H / 2 + 0.01, D - 0.01, g).rotation.y = Math.PI;   // its back wall
        for (const sx of [-1, 1]) mesh(new THREE.PlaneGeometry(D - 0.02, H - 0.05), mIn, sx * (W / 2 - 0.015), H / 2 + 0.01, D / 2, g).rotation.y = sx * Math.PI / 2;
        mesh(new THREE.PlaneGeometry(W - 0.03, D - 0.02), mIn, 0, H - 0.015, D / 2, g).rotation.x = Math.PI / 2;
        mesh(new THREE.PlaneGeometry(W - 0.03, D - 0.02), mIn, 0, 0.035, D / 2, g).rotation.x = -Math.PI / 2;
        const mWire = M({ color: 0xd8dde0, roughness: 0.35, metalness: 0.7 });
        for (const y of [0.2]) for (let k = 0; k < 7; k++) mesh(new THREE.BoxGeometry(W - 0.04, 0.004, 0.004), mWire, 0, y, 0.05 + k * 0.06, g);
        /* the bottles of water (clear, a blue cap and a blue label) and the cans, by a fixed seed */
        const mPet = M({ color: 0xd6e8f2, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.5, depthWrite: false });
        const mCap = M({ color: 0x2a6ac8, roughness: 0.4 }), mLab = M({ color: 0x4a8ad8, roughness: 0.6 });
        const canCols = [0xc81e24, 0x2a8a3a, 0xe8b21a, 0x1e4aa8, 0xc81e24];
        for (let k = 0; k < 5; k++) { const x = -W / 2 + 0.07 + k * 0.075;
          const b = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.15, 14), mPet, x, 0.04 + 0.075, 0.12, g); b.renderOrder = 2;
          mesh(new THREE.CylinderGeometry(0.0305, 0.0305, 0.045, 14), mLab, x, 0.04 + 0.07, 0.12, g);
          mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.02, 10), mCap, x, 0.04 + 0.16, 0.12, g); }
        for (let k = 0; k < 5; k++) mesh(new THREE.CylinderGeometry(0.033, 0.033, 0.115, 16), M({ color: canCols[k], roughness: 0.3, metalness: 0.75 }), -W / 2 + 0.07 + k * 0.08, 0.2 + 0.06, 0.13, g);
        /* the wallet: brown leather, folded, lying beside the bottles at the front of the floor */
        const wl = new THREE.Group(); wl.position.set(W / 2 - 0.075, 0.046, 0.07); wl.rotation.y = 0.35; g.add(wl); props.wallet = wl;
        mesh(new THREE.BoxGeometry(0.11, 0.018, 0.09), M({ map: tex(makeLeather(THREE, cnv)), roughness: 0.6 }), 0, 0.009, 0, wl);
        /* the door: a black frame and its glass, hinged at its right edge, swinging open toward him */
        const hinge = new THREE.Group(); hinge.position.set(W / 2, 0, 0); g.add(hinge); props.fridgeDoor = hinge;
        const fr = (w, h, x, y) => mesh(new THREE.BoxGeometry(w, h, 0.03), mBlackP, x, y, -0.015, hinge);
        fr(W, 0.045, -W / 2, 0.022); fr(W, 0.045, -W / 2, H - 0.022); fr(0.04, H, -W + 0.02, H / 2); fr(0.04, H, -0.02, H / 2);
        const gl = mesh(new THREE.PlaneGeometry(W - 0.07, H - 0.08), M({ color: 0xcfe2ee, roughness: 0.05, transparent: true, opacity: 0.22, depthWrite: false }), -W / 2, H / 2, -0.016, hinge);
        gl.rotation.y = Math.PI; gl.renderOrder = 2;
        mesh(new THREE.BoxGeometry(0.014, 0.16, 0.02), mAluP, -W + 0.05, H / 2, -0.04, hinge);                 // its handle, at the opening edge
      }
      /* THE NOTE in his own hand on the glass beside his phone: CALL PONG */
      { const n = mesh(new THREE.PlaneGeometry(0.076, 0.076), M({ map: tex(makeSticky(THREE, cnv, DATA.words.noteText || 'CALL PONG')), roughness: 0.85 }), NOTE.x, top + 0.0012, NOTE.z);
        n.rotation.set(-Math.PI / 2, 0, NOTE.ry + Math.PI); props.note = n; }
      /* THE LIGHT SWITCH on the left wall inside the door: a white plate, two rockers, the small orange neon of a
         Singapore switch — the one point of light by the door in the dark */
      { const g = new THREE.Group(); g.position.set(SWITCH.x, SWITCH.y, SWITCH.z); g.rotation.y = Math.PI / 2; S0.add(g); props.sw = g;
        mesh(new THREE.BoxGeometry(0.086, 0.086, 0.008), M({ color: 0xf2f2ee, roughness: 0.45 }), 0, 0, 0.004, g);
        for (const sx of [-1, 1]) mesh(new THREE.BoxGeometry(0.03, 0.05, 0.008), M({ color: 0xe8e8e4, roughness: 0.4 }), sx * 0.018, 0, 0.011, g);
        props.swDot = mesh(new THREE.CircleGeometry(0.0035, 10), B({ color: 0xff8a2a }), 0.018, -0.032, 0.0155, g); }
      /* THE SHELF beside the door, and on it the piece he took in chapter 1, facing the door as he was told — each of the
         three made ready (which one is his, play decides), its light cut (the amulet rule: a few centimetres at a shelf) */
      { const g = new THREE.Group(); g.position.set(SHELF.x, SHELF.y, SHELF.z); S0.add(g); props.shelf = g;
        mesh(new THREE.BoxGeometry(0.2, 0.02, 0.3), M({ color: 0x5a3a24, roughness: 0.6 }), 0, -0.01, 0, g);
        for (const dz of [-0.11, 0.11]) mesh(new THREE.BoxGeometry(0.02, 0.07, 0.02), mBlackP, -0.08, -0.045, dz, g);
        mesh(new THREE.PlaneGeometry(0.16, 0.2), M({ color: 0x9a1418, roughness: 0.85 }), 0.005, 0.0012, 0, g).rotation.x = -Math.PI / 2;   // a red cloth under it
        for (const [key, size, axis, ry, rz] of [['e4nangkwak', 0.075, 'y', 0, 0], ['e4takrut', 0.066, 'x', 0, Math.PI / 2], ['e4phayant', 0.085, 'x', 0.3, 0]]) {
          const pg = new THREE.Group(); pg.visible = false; g.add(pg); props.pieces[key.slice(2)] = pg; pg.userData.dyn = true;
          fitModel(key, pg, size, axis, ry, rz);
        }
      }
      /* LERSI CHIN'S THINGS (§2.2 #7), hidden until the visit: his woven mat on the floor (rolled up in the film until he
         lays it), the holy-water bowl, the seven-leaf mayom bundle, a skein of white cotton thread, a clean white cloth,
         the homage tray (a footed brass phan of marigolds and jasmine, two candles, three sticks of incense) and his
         woven cloth bag */
      { const g = new THREE.Group(); g.visible = false; S0.add(g); props.lcThings = g;
        const mat = new THREE.Group(); mat.position.set(MAT.x, 0.004, MAT.z - MAT.d / 2); g.add(mat); props.mat = mat;
        const mt = tex(makeReedMat(THREE, cnv, 5207)); mt.repeat.set(2, 3);
        const mp = new THREE.Mesh(new THREE.PlaneGeometry(MAT.w, MAT.d), M({ map: mt, roughness: 0.92 })); mp.rotation.x = -Math.PI / 2; mp.position.z = MAT.d / 2; mat.add(mp);
        const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, MAT.w, 16), M({ map: mt, roughness: 0.92 })); roll.rotation.z = Math.PI / 2; roll.position.y = 0.05; mat.add(roll);
        mat.userData.plane = mp; mat.userData.roll = roll;
        const at = (dx, dz) => [LC.x + dx, LC.z + dz];
        /* the bowl: a turned silver bowl on its foot, water in it */
        { const [x, z] = at(0.36, 0.3); const bg = new THREE.Group(); bg.position.set(x, 0.006, z); g.add(bg); props.bowl = bg;
          const prof = [[0, 0], [0.05, 0], [0.055, 0.012], [0.045, 0.02], [0.07, 0.03], [0.1, 0.06], [0.112, 0.095], [0.108, 0.1], [0.098, 0.064], [0.07, 0.036], [0, 0.032]]
            .map(([r, y]) => new THREE.Vector2(r, y));
          const lathe = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), M({ color: 0xd8dadc, roughness: 0.22, metalness: 0.9, envMapIntensity: 3, side: THREE.DoubleSide })); bg.add(lathe);
          const wtr = new THREE.Mesh(new THREE.CircleGeometry(0.1, 36), M({ color: 0xa8c4d4, roughness: 0.04, metalness: 0.1, transparent: true, opacity: 0.7 })); wtr.rotation.x = -Math.PI / 2; wtr.position.y = 0.082; bg.add(wtr); props.water = wtr;
          /* (v25.0 CP6) the bowl itself (masters/v25.0/models: a checked picture on white, then Meshy): the turned stand-in
             hidden the moment it lands, the water laid inside it at its own height */
          fitModel('e4khannam', bg, BOWL_W, 'x', 0, 0).then(m => { if (!m || !alive) return; lathe.visible = false;
            wtr.position.y = m.userData.fit.y * BOWL_WATER[0]; wtr.scale.setScalar(m.userData.fit.x * BOWL_WATER[1] / 0.1); }); }
        /* the mayom bundle across the bowl's rim: seven sprigs tied. Its frame (what every pose turns): the tied end on the
           group's origin, the leaves along +x, their face up (+y) */
        { const mg = new THREE.Group(); const [x, z] = at(0.36, 0.3); mg.position.set(x - 0.02, 0.11, z); mg.rotation.set(0, 0.6, 0.18); g.add(mg); props.mayom = mg;
          const sg = new THREE.Group(); mg.add(sg);                                   // (v25.0 CP6) the stand-in, drawn only if the model never lands
          const mLeafM = M({ color: 0x3e7a2e, roughness: 0.7, side: THREE.DoubleSide }), mStem = M({ color: 0x5a6a2a, roughness: 0.8 });
          for (let k = 0; k < 7; k++) { const a = (k - 3) * 0.12, st = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.2, 5), mStem);
            st.rotation.z = Math.PI / 2 + a; st.position.set(0.02, k * 0.002, (k - 3) * 0.008); sg.add(st);
            for (let j = 0; j < 9; j++) { const lf = new THREE.Mesh(new THREE.PlaneGeometry(0.032, 0.014), mLeafM);
              lf.position.set(0.04 + j * 0.013, Math.sin(a) * 0.05 + (j % 2 ? 0.006 : -0.006), (k - 3) * 0.008 + (j % 2 ? 0.01 : -0.01));
              lf.rotation.set(Math.PI / 2 + (j % 2 ? 0.5 : -0.5), 0, a); sg.add(lf); } }
          sg.add(new THREE.Mesh(new THREE.TorusGeometry(0.012, 0.003, 6, 14), M({ color: 0xf2f0e8, roughness: 0.8 })));
          /* the bundle itself (a checked picture on white, then Meshy: masters/v25.0/models). Meshy made it a flat fan
             standing in its own x-y plane, leaves up, tied 16 % from its foot: turned so the leaves run along +x and its
             face lies up, the tie moved onto the origin */
          const mm = new THREE.Group(); mm.rotation.x = -Math.PI / 2; mg.add(mm);
          fitModel('e4mayom', mm, MAYOM_L, 'x', 0, -Math.PI / 2).then(m => { if (!m || !alive) return; sg.visible = false;
            m.position.x += m.userData.fit.x * (0.5 - MAYOM_TIE); m.position.y -= m.userData.fit.y / 2; }); }
        /* the white thread: a skein, coiled */
        { const [x, z] = at(-0.34, 0.34); const th = new THREE.Group(); th.position.set(x, 0.012, z); g.add(th); props.thread = th;
          for (let k = 0; k < 3; k++) { const tr = new THREE.Mesh(new THREE.TorusGeometry(0.028 - k * 0.002, 0.0028, 6, 24), M({ color: 0xf4f2ea, roughness: 0.85 })); tr.rotation.x = Math.PI / 2; tr.position.y = k * 0.004; th.add(tr); } }
        /* the clean white cloth, folded, where the piece will be set */
        { const [x, z] = at(-0.36, 0.08); const cl = mesh(new THREE.BoxGeometry(0.26, 0.008, 0.22), M({ color: 0xf6f4ee, roughness: 0.9 }), x, 0.008, z, g); props.cloth = cl; }
        /* the homage tray between them: a footed brass phan, marigolds and jasmine on it, two candles, three sticks */
        { const [x, z] = at(0, 0.52); const kg = new THREE.Group(); kg.position.set(x, 0.004, z); g.add(kg); props.khan = kg;
          /* (v25.0 CP6) the tray and its flowers (`stand`, a stand-in until the model lands) apart from the candles and the
             incense (`top`), which stand in the flowers whichever tray is drawn */
          const stand = new THREE.Group(), topG = new THREE.Group(); kg.add(stand, topG);
          const mBrass = M({ color: 0xc89a3a, roughness: 0.3, metalness: 0.9, envMapIntensity: 3 });
          stand.add(new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.06, 0], [0.04, 0.02], [0.03, 0.07], [0.12, 0.085], [0.13, 0.095], [0, 0.095]].map(([r, y]) => new THREE.Vector2(r, y)), 32), mBrass));
          const mMari = M({ color: 0xf0901a, roughness: 0.7 }), mJas = M({ color: 0xf6f2e6, roughness: 0.75 }), r = rng(5231);
          for (let k = 0; k < 18; k++) { const a = r() * 6.28, d = 0.02 + r() * 0.08; const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.018 + r() * 0.006, 8, 6), k % 3 ? mMari : mJas);
            s2.position.set(Math.cos(a) * d, 0.11 + r() * 0.02, Math.sin(a) * d); stand.add(s2); }
          const mCand = M({ color: 0xf2e6c0, roughness: 0.5 }), mFlame = B({ color: 0xffc070, transparent: true, opacity: 0, depthWrite: false });
          for (const sx of [-1, 1]) { const cd = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.008, 0.09, 10), mCand); cd.position.set(sx * 0.07, 0.14, -0.04); topG.add(cd);
            const fl = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 6), mFlame); fl.scale.y = 2; fl.position.set(sx * 0.07, 0.195, -0.04); topG.add(fl); props.flames.push(fl); }
          const mStk = M({ color: 0x9a2a1a, roughness: 0.7 });
          for (let k = 0; k < 3; k++) { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.0016, 0.0016, 0.22, 5), mStk); st.position.set((k - 1) * 0.012, 0.2, 0.03); st.rotation.z = (k - 1) * 0.12; topG.add(st);
            const em = new THREE.Mesh(new THREE.SphereGeometry(0.003, 6, 4), mFlame); em.position.set((k - 1) * 0.012 + (k - 1) * 0.013, 0.31, 0.03); topG.add(em); props.flames.push(em); }
          /* the tray (a checked picture on white, then Meshy): the stand-in hidden when it lands, the candles and the incense
             raised to stand in its flowers (their feet were on the stand-in's top, 0.095) */
          fitModel('e4phan', kg, PHAN_W, 'x', 0, 0).then(m => { if (!m || !alive) return; stand.visible = false;
            topG.position.y = m.userData.fit.y * PHAN_TOP - 0.095; }); }
        /* his woven bag beside him: a yaam, its stripes, its long strap */
        { const [x, z] = at(-0.56, -0.16); const yg = new THREE.Group(); yg.position.set(x, 0, z); yg.rotation.set(0, 0.4, 0); g.add(yg); props.yaam = yg;
          const mY = M({ map: tex(makeYaamCloth(THREE, cnv)), roughness: 0.95, side: THREE.DoubleSide });
          const bd = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.34), mY); bd.position.y = 0.025; yg.add(bd);
          const sp = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.01, 5, 24, Math.PI), mY); sp.rotation.x = -Math.PI / 2; sp.position.set(0, 0.012, -0.17); yg.add(sp); }
        /* the envelope for the temple (ending D): white, the piece in it, his hand's words on it */
        { const ev = mesh(new THREE.PlaneGeometry(0.17, 0.11), M({ map: tex(makeEnvelope(THREE, cnv, DATA.words.envelope || 'For the temple')), roughness: 0.85 }), -0.82, top + 0.0012, COUNTER.z - 0.02);
          ev.rotation.set(-Math.PI / 2, 0, Math.PI - 0.08); ev.visible = false; props.envelope = ev; }
      }
    }
    /* a model sized by its own box to `size` along `axis`, stood on its group's floor, centred (chapter 1's tray rule) */
    function fitModel(key, grp, size, axis, ry, rz) {
      return parseOnce(key).then(({ scene: sc }) => {
        if (!alive) return;
        const m = sc.clone(true); m.rotation.set(0, ry, rz);
        m.updateMatrixWorld(true);
        const bb = new THREE.Box3().setFromObject(m), sz = bb.getSize(new THREE.Vector3());
        m.scale.setScalar(size / sz[axis]); m.updateMatrixWorld(true); bb.setFromObject(m);
        m.position.set(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2);
        m.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = true; if (key === 'e4nangkwak') bronzeLift(o); } });
        m.userData.fit = { x: bb.max.x - bb.min.x, y: bb.max.y - bb.min.y, z: bb.max.z - bb.min.z };   // (v25.0) its size as placed
        grp.add(m);
        return m;
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
    }

    /* ---------------------------------------------------- his phone and his laptop: what their screens show
       (drawn only when what they show changes; the screens are always mapped and only their colour lights them, v15.1) */
    function phoneDraw(mode, secs) {
      const P = shop.phone; if (!P) return;
      const sig = mode + ':' + (mode === 'call' ? Math.floor(secs || 0) : '');
      if (P.drawn === sig) return; P.drawn = sig;
      const x = P.x, Wd = DATA.words;
      const g = x.createLinearGradient(0, 0, 0, 557); g.addColorStop(0, '#22324e'); g.addColorStop(1, '#0a0e18');
      x.fillStyle = g; x.fillRect(0, 0, 256, 557);
      x.textAlign = 'center'; x.textBaseline = 'alphabetic';
      /* his contact's round picture: a P on green */
      x.fillStyle = '#2f7a5a'; x.beginPath(); x.arc(128, 170, 52, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#ffffff'; x.font = 'bold 54px "Helvetica Neue", Arial, sans-serif'; x.fillText(String(Wd.phonePong || 'P').charAt(0), 128, 189);
      x.font = '34px "Helvetica Neue", Arial, sans-serif'; x.fillText(Wd.phonePong || 'Pong', 128, 272);
      x.fillStyle = 'rgba(255,255,255,0.72)'; x.font = '20px "Helvetica Neue", Arial, sans-serif';
      const s = Math.max(0, Math.floor(secs || 0));
      x.fillText(mode === 'calling' || mode === 'ringing' ? (Wd.phoneCalling || 'calling…') : `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`, 128, 306);
      /* the buttons: red to end; a green to answer when it rings */
      if (mode === 'ringing') { x.fillStyle = '#2fae5a'; x.beginPath(); x.arc(178, 470, 30, 0, Math.PI * 2); x.fill(); x.fillStyle = '#e0433a'; x.beginPath(); x.arc(78, 470, 30, 0, Math.PI * 2); x.fill(); }
      else { x.fillStyle = '#e0433a'; x.beginPath(); x.arc(128, 470, 30, 0, Math.PI * 2); x.fill(); }
      x.fillStyle = '#fff'; x.save(); x.translate(mode === 'ringing' ? 78 : 128, 470); x.rotate(2.36); x.fillRect(-14, -5, 28, 10); x.restore();
      P.scr.map.needsUpdate = true;
    }
    const shopCtl = {
      shutter(u, secs = 0) { shop.uFrom = shop.u; shop.uTo = Math.max(0, Math.min(1, u)); shop.t0 = wallNow(); shop.t1 = shop.t0 + Math.max(0.001, secs); if (!secs) shop.u = shop.uTo; },
      lights(k, secs = 0) { shop.ledFrom = shop.ledK; shop.ledTo = k; shop.l0 = wallNow(); shop.l1 = shop.l0 + Math.max(0.001, secs); if (!secs) shop.ledK = k; },
      ceiling(k, secs = 0) { props.ceilFrom = props.ceilK; props.ceilTo = k; props.c0 = wallNow(); props.c1 = props.c0 + Math.max(0.001, secs); if (!secs) props.ceilK = k; },
      /* the mall shut for the night: the open units' own shutters down, their signs and the corridor's skylight dimmed */
      night(on) { props.night = !!on; for (const s2 of props.nightShut) s2.visible = !!on;
        for (const m of props.signs) m.color.setScalar(on ? 0.22 : 1);
        if (props.corSky) props.corSky.color.setHex(on ? 0x2a3038 : 0xdfe6ec);
        if (props.corCeil) props.corCeil.emissive.setHex(on ? 0x0e0e10 : 0x4a4844); },
      till(open) { props.tillTo = open ? 1 : 0; }, bag(open) { props.bagTo = open ? 1 : 0; }, jacket(on) { props.jacketTo = on ? 1 : 0; },
      fridge(open) { props.fridgeTo = open ? 1 : 0; },
      phone(mode) { shop.phoneMode = mode || ''; shop.phoneOn = mode ? wallNow() : 0; },
      lap(mode, o = {}) { shop.lapMode = mode || ''; shop.lapOn = mode ? 1 : 0; shop.lapO = o; }
    };
    const _swV = new THREE.Vector3();
    function shopFrame(now) {
      stockLod();                                                                       // (v24.22) near or far, place by place
      const k = Math.min(1, Math.max(0, (now - shop.t0) / Math.max(0.001, shop.t1 - shop.t0)));
      if (shop.t1 > 0 && k < 1) shop.u = shop.uFrom + (shop.uTo - shop.uFrom) * k * k * (3 - 2 * k); else if (shop.t1 > 0) shop.u = shop.uTo;
      if (shop.curtain) {
        const h = Math.max(0.02, shop.top * (1 - shop.u));
        shop.curtain.scale.y = h; shop.curTex.repeat.set(1, h / 0.6);
        shop.bar.position.set(0, shop.top - h, SHOP.z1); shop.bar.visible = shop.u < 0.995;
        const dep = 0.3 + 2.8 * shop.u; shop.spill.scale.y = dep; shop.spill.position.z = SHOP.z1 - dep / 2 + 0.2;
        /* by day the morning's warm grey on the floor; by night the corridor's cold light lying under the shutter's edge */
        shop.spillMat.color.setHex(props.night ? 0x9ab0d0 : 0xffe2c0);
        shop.spillMat.opacity = (props.night ? 0.16 : 0.2) * Math.min(1, shop.u * 2.5);
      }
      const kl = Math.min(1, Math.max(0, (now - shop.l0) / Math.max(0.001, shop.l1 - shop.l0)));
      if (shop.l1 > 0) shop.ledK = kl < 1 ? shop.ledFrom + (shop.ledTo - shop.ledFrom) * kl : shop.ledTo;
      for (const m of shop.leds) if (m) m.color.setRGB(0.12 + 0.88 * shop.ledK, 0.12 + 0.88 * shop.ledK, 0.13 + 0.87 * shop.ledK);
      const kc = Math.min(1, Math.max(0, (now - props.c0) / Math.max(0.001, props.c1 - props.c0)));
      if (props.c1 > 0) props.ceilK = kc < 1 ? props.ceilFrom + (props.ceilTo - props.ceilFrom) * kc : props.ceilTo;
      if (props.ceil) props.ceil.color.setRGB(0.1 + 0.9 * props.ceilK, 0.1 + 0.9 * props.ceilK, 0.11 + 0.89 * props.ceilK);
      /* the ceiling's own glow (its painted light, 0x4a4844 by day) goes with its lights */
      if (props.ceilS) props.ceilS.emissive.setRGB(0.29 * props.ceilK, 0.282 * props.ceilK, 0.267 * props.ceilK);
      /* the moving parts, eased on the wall clock (a drawer is pulled, a flap lifts, a door swings) */
      const dt = Math.min(0.1, Math.max(0, now - (shop.lastNow || now))); shop.lastNow = now;
      const ez = (v, to, r) => v + (to - v) * (1 - Math.exp(-dt * r));
      props.tillK = ez(props.tillK, props.tillTo, 6); props.bagK = ez(props.bagK, props.bagTo, 5);
      props.jacketK = ez(props.jacketK, props.jacketTo, 5); props.fridgeK = ez(props.fridgeK, props.fridgeTo, 4.5);
      if (props.till) props.till.position.z = TILL.z - 0.24 * props.tillK;
      if (props.bagFlap) props.bagFlap.rotation.x = -1.9 * props.bagK;
      if (props.jacket) { props.jacket.position.y = 0.685 + 0.12 * props.jacketK; props.jacket.rotation.z = 0.2 * props.jacketK; }
      if (props.fridgeDoor) props.fridgeDoor.rotation.y = -1.75 * props.fridgeK;
      if (props.fridgeLight) props.fridgeLight.color.setRGB(0.55 + 0.4 * props.fridgeK, 0.62 + 0.36 * props.fridgeK, 0.7 + 0.3 * props.fridgeK);
      /* the stand's ribbons in the air-con's draft: a slow swing, its own rhythm, more when `sway` is up */
      if (props.ribbons.length) {
        const sw = 0.05 + 0.2 * props.sway;
        props.ribbons.forEach((rb, i) => { rb.rotation.z = rb.userData.rz0 + Math.sin(now * (0.9 + i * 0.23) + i * 1.7) * sw;
                                           rb.rotation.x = Math.sin(now * (0.7 + i * 0.31) + i) * sw * 0.6; });
      }
      /* the mat laid out (matK 0 rolled at the counter's foot, 1 flat) */
      if (props.mat) { const mk = props.matK, P2 = props.mat.userData.plane, R = props.mat.userData.roll;
        P2.scale.y = Math.max(0.001, mk); P2.position.z = MAT.d * mk / 2; R.position.z = MAT.d * mk; R.visible = mk < 0.995; }
      /* the switch's neon: brighter in the dark */
      if (props.swDot) { const lit = props.ceilK; props.swDot.material.color.setRGB(1, 0.55 - 0.2 * lit, 0.16); }
      /* his laptop: the sales page by day (chapter 1's), the forum in ending A and the coda */
      if (shop.lap) {
        const L = shop.lap, on = !!shop.lapOn, o = shop.lapO || {};
        /* (v25.0 CP9) the list's scroll and the cursor are in the signature too (the coda's list never moved without them) */
        const sig = on ? [shop.lapMode, o.n || 0, o.chars || 0, o.newK || 0, o.post ? 1 : 0, Math.floor(now * 2.4) % 2,
                          Math.round((o.scroll || 0) * 60), Math.round((o.cursor || 0) * 40), o.click ? 1 : 0].join(',') : 'off';
        if (sig !== L.sig) { L.sig = sig;
          if (on) { if (shop.lapMode === 'sales') drawSalesApp(L.x, { wed: 1, bar: 1, blink: true, stock: shop.stockCount });
                    /* (v25.0 CP9) its screen named: compose, thread, list or post (without it, always the list) */
                    else drawForum(L.x, Object.assign({ blink: Math.floor(now * 2.4) % 2 === 0, words: DATA.words, mode: shop.lapMode }, o));
                    L.t.needsUpdate = true; }
          L.m.color.setRGB(on ? 1 : 0.02, on ? 1 : 0.024, on ? 1 : 0.03); }
      }
      if (shop.phone) {
        const P = shop.phone, on = shop.phoneOn ? now - shop.phoneOn : -1;
        if (on >= 0 && shop.phoneMode) { phoneDraw(shop.phoneMode, shop.phoneSecs != null ? shop.phoneSecs : on); P.scr.color.setRGB(1, 1, 1);
          const buzz = shop.phoneMode === 'ringing' ? Math.sin(on * 90) * 0.0012 * (Math.sin(on * 6) > 0 ? 1 : 0) : 0; P.g.position.x = P.base.x + buzz; }
        else { P.scr.color.setRGB(0.02, 0.024, 0.03); P.g.position.x = P.base.x; }
      }
    }


    /* ============================================== THE CAST (CP7, §3.5)
       Every person is a real character model (v21.16): the first master is his own; everyone else wears a placeholder
       until Chad's model lands (docs/E4-MODELS.md). One routine places them all — e3c5's mkPerson, by its own laws:
       sized from POSED BONES in a STANDING take (v3.8/v4.7; a seated take's bones measure a seated body), grounded on
       the lowest of them, or SEATED BY THE SKIN: the underside of the hips and thighs in the sitting take, measured on
       the posed skin, set on the seat's top (v17.1 — a robe's drape between the knees is not where a man sits); culled by
       a sphere round the posed skin (v18.5); the head's look laid on after the mixer and put back before it runs again
       (v11.5); a seated talker's talking take ridden on the upper body only, so his crossed legs stay where they are
       (v21.1). A failed download leaves the place empty, never a block of a person. */
    /* (the seated three in the sala cast no shadow: under its roof they stand in its shade, and on a desktop their shadow
       pass was another 130k triangles in the yard's widest view — CP7 measured 381k against the 297,872 budget) */
    const people = [];
    const _pv = new THREE.Vector3(), _pq = new THREE.Quaternion(), _pe = new THREE.Euler(), _hp = new THREE.Vector3(), _cp = new THREE.Vector3();
    const _hq = new THREE.Quaternion(), _pq2 = new THREE.Quaternion(), _dq = new THREE.Quaternion(), _iq = new THREE.Quaternion(), _fv = new THREE.Vector3();
    const _qlk = new THREE.Quaternion();     // the look's turn at its weight (never blended INTO _dq: see below)
    const _spq = new THREE.Quaternion(), _qy = new THREE.Quaternion(), _ax = new THREE.Vector3(), _UPV = new THREE.Vector3(0, 1, 0);
    const _lvU = new THREE.Vector3(), _lvH = new THREE.Vector3(), _lvX = new THREE.Vector3();   // the head kept level (peopleTick)
    const ROLL_FREE = 0.087;                 // 5°: a head's own tilt left alone; past it, three quarters of the roll is taken out
    const UPPER_RE = /Spine|Neck|Head|Shoulder|Arm|Hand|neck/;
    const LOWER_RE = /Hips|UpLeg|Leg|Foot|Toe/;
    function upperOnly(clip) {
      const c = clip.clone();
      c.tracks = c.tracks.filter(tr => { const node = tr.name.split('.')[0]; return UPPER_RE.test(node) && !LOWER_RE.test(node); });
      c.name = clip.name + '_upper';
      return c;
    }
    function lowerOnly(clip) {
      const c = clip.clone();
      c.tracks = c.tracks.filter(tr => LOWER_RE.test(tr.name.split('.')[0]));
      c.name = clip.name + '_lower';
      return c;
    }
    /* the skin's seat: the vertices the hips and thighs carry (each vertex's heaviest bone), their lowest band's centre,
       in the group's frame — where a sitting body meets what it sits on */
    function seatContact(P) {
      P.group.updateMatrixWorld(true);
      let lo = Infinity; const pts = [];
      P.model.traverse(m => {
        if (!m.isSkinnedMesh) return;
        m.skeleton.update();
        const si = m.geometry.attributes.skinIndex, sw = m.geometry.attributes.skinWeight, n = m.geometry.attributes.position.count;
        if (!si || !sw) return;
        const st = Math.max(1, Math.floor(n / 6000));
        for (let i = 0; i < n; i += st) {
          let bi = 0, bw = -1;
          for (let k = 0; k < 4; k++) { const w = sw.getComponent(i, k); if (w > bw) { bw = w; bi = si.getComponent(i, k); } }
          const b = m.skeleton.bones[bi]; if (!b || !/Hips|UpLeg/.test(b.name)) continue;
          m.getVertexPosition(i, _pv); _pv.applyMatrix4(m.matrixWorld); P.group.worldToLocal(_pv);
          pts.push(_pv.x, _pv.y, _pv.z); if (_pv.y < lo) lo = _pv.y;
        }
      });
      if (!pts.length) return null;
      let sx = 0, sz = 0, n = 0;
      for (let i = 0; i < pts.length; i += 3) if (pts[i + 1] < lo + 0.03) { sx += pts[i]; sz += pts[i + 2]; n++; }
      return new THREE.Vector3(sx / n, lo, sz / n);
    }
    /* the skin's lowest point, every vertex (a sitter's heels on the floor; a stander's soles), in the group's frame */
    function skinLow(P) {
      P.group.updateMatrixWorld(true);
      let lo = Infinity;
      P.model.traverse(m => { if (!m.isSkinnedMesh) return; m.skeleton.update(); const n = m.geometry.attributes.position.count, st = Math.max(1, Math.floor(n / 4000));
        for (let i = 0; i < n; i += st) { m.getVertexPosition(i, _pv); _pv.applyMatrix4(m.matrixWorld); P.group.worldToLocal(_pv); if (_pv.y < lo) lo = _pv.y; } });
      return lo;
    }
    /* A PERSON'S TAKES ARE LAYERS, their weights eased every frame from what he is doing — never three's own fades, which
       a weight set on the next frame silently cancels (setEffectiveWeight stops a fade): standing or sitting (each rest
       split into legs and body, so a seated talker's crossed legs stay crossed), walking, talking (the body only) and a
       one-off gesture (the pao). Standing up and sitting down blend the pose AND the body's offset onto the seat together,
       so a man rises off a bench rather than jumping out of it. */
    /* (v24.32) A WRIST THAT ROLLS PAST WHAT THE SKIN CAN FOLLOW (Chad: "when the wife gives the guava, one of her hands is
       twisted"). Pa Noi's giving gesture (Checkout_Gesture) is retargeted from the v24.0 stand-in (masters/v24.15/make.sh),
       and measured against her rest, its LEFT hand ROLLS up to 125° about its own bone — the forearm, with no twist bone in
       this rig, does not follow, and the skin wrings at the wrist (photographed). Its bend is 28°, her own takes' kind; her
       own takes roll it at most 92° (Talk_with_Hands_Open), her right hand in the same gesture 14°. So the roll of each key
       is cut to `keep` of itself and the bend kept: rest⁻¹·key = swing·twist, the twist about the bone's own axis (+y, to its
       fingers: measured, the child's offset), and key' = rest·swing·slerp(1, twist, keep). Once, on the shared clip (its
       userData marks it), from the original parse's rest — the file is never touched */
    const TWIST_FIX = { e4noi: [['Checkout_Gesture', 'LeftHand', 0.35]] };
    function softenTwist(clip, rest, bone, keep) {
      const done = clip.userData || (clip.userData = {});
      if (done['twist:' + bone]) return;
      let b = null; const re = new RegExp(bone + '(_\\d+)?$');
      rest.traverse(o => { if (!b && o.isBone && re.test(o.name)) b = o; });
      const tr = b && clip.tracks.find(t => t.name === b.name + '.quaternion'); if (!tr) return;
      const ri = b.quaternion.clone().invert(), q = new THREE.Quaternion(), tw = new THREE.Quaternion(), sw = new THREE.Quaternion(), tk = new THREE.Quaternion(), I = new THREE.Quaternion();
      const v = tr.values;
      for (let i = 0; i < v.length; i += 4) {
        q.set(v[i], v[i + 1], v[i + 2], v[i + 3]).premultiply(ri);
        tw.set(0, q.y, 0, q.w).normalize();
        sw.copy(q).multiply(tk.copy(tw).invert());
        tk.slerpQuaternions(I, tw, keep);                 // (into its own target: slerpQuaternions copies its first argument in)
        q.copy(b.quaternion).multiply(sw).multiply(tk);
        v[i] = q.x; v[i + 1] = q.y; v[i + 2] = q.z; v[i + 3] = q.w;
      }
      done['twist:' + bone] = true;
    }
    function mkPerson(key, o) {
      const parent = o.parent;
      const group = new THREE.Group(); group.position.set(o.x, o.y != null ? o.y : (o.ground ? o.ground(o.x, o.z) : 0), o.z); group.rotation.y = o.ry || 0; parent.add(group);
      if (o.hidden) group.visible = false;
      const P = { key, group, model: null, mixer: null, L: {}, head: null, headWrote: null, ready: false, o,
                  seated: o.posture === 'sit', sitW: o.posture === 'sit' ? 1 : 0, walkW: 0, oneW: 0, talkW: 0, talkUntil: 0,
                  one: null, walk: null, turnTo: null, lookW: 0, lookDir: new THREE.Vector3(0, 0, 1), faceLocal: null, look: o.look || 0, lookAt: null, lookFilm: false,
                  bow: o.bow || 0, bowNow: o.bow || 0, inner: null, standInner: new THREE.Vector3(), sitInner: new THREE.Vector3(), onReady: [], onFail: [] };
      const loads = [parseOnce(key)].concat(o.anims ? [parseOnce(o.anims)] : []);
      Promise.all(loads).then(([gltf, extra]) => {
        if (!alive) return;
        const g = cloneSkinned(gltf.scene);
        const clips = gltf.animations.concat(extra ? extra.animations : []);
        for (const [cn, bn, keep] of TWIST_FIX[key] || []) { const c = clips.find(x => x.name === cn); if (c) softenTwist(c, gltf.scene, bn, keep); }
        g.traverse(m => { if (m.isMesh) { m.castShadow = !LOW && !o.noShadow; m.receiveShadow = false;
          if (o.noMip) for (const mm of [].concat(m.material)) { const t = mm && mm.map;
            if (t && t.generateMipmaps !== false) { t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.needsUpdate = true; } } } });
        g.traverse(b => { if (b.isBone && HEAD_RE.test(b.name) && !P.head) P.head = b; });
        g.traverse(b => { if (b.isBone && /Hips(_\d+)?$/.test(b.name) && !P.hips) P.hips = b; });
        g.traverse(b => { if (b.isBone && /Spine2(_\d+)?$/.test(b.name) && !P.spine) P.spine = b; });
        /* (v24.21) a DRIVER's arms (`grip`): the shoulder, the elbow and the wrist of each, which gripTick bends onto the
           wheel after the takes have posed him (a Mixamo hand bone is the wrist, v17.1; 'LeftArm' never matches
           'LeftForeArm') */
        if (o.grip) {
          P.arms = {};
          for (const sd of ['Left', 'Right']) {
            const f = (re) => { let r = null; g.traverse(b => { if (!r && b.isBone && re.test(b.name)) r = b; }); return r; };
            const up = f(new RegExp(sd + 'Arm(_\\d+)?$')), fore = f(new RegExp(sd + 'ForeArm(_\\d+)?$')), hand = f(new RegExp(sd + 'Hand(_\\d+)?$'));
            if (up && fore && hand) P.arms[sd] = { up, fore, hand, wUp: new THREE.Quaternion(), wFore: new THREE.Quaternion(), wrote: false };
          }
        }
        const mx = new THREE.AnimationMixer(g);
        const clip = (n) => clips.find(a => a.name === n);
        const acts = new Map();
        const act = (name, part) => {
          const c = clip(name); if (!c) return null;
          const k = name + '|' + (part || 'full');
          if (!acts.has(k)) acts.set(k, mx.clipAction(part === 'upper' ? upperOnly(c) : part === 'lower' ? lowerOnly(c) : c));
          return acts.get(k);
        };
        P.act = act;
        /* the size: a STANDING take's posed bones (a seated take measures a seated body); a rig with neither a standing
           take nor a standing bind pose is sized SITTING, floor to crown (chapter 3's crowd, 1.30) */
        const sizeC = o.sizeTake === '@bind' ? null : clip(o.seatedHeight ? o.sit : (o.sizeTake || o.stand || o.sit)) || clips[0];
        let lo = Infinity, hi = -Infinity;
        if (!sizeC) {
          g.updateMatrixWorld(true);
          g.traverse(b => { if (!b.isBone) return; b.getWorldPosition(_pv); lo = Math.min(lo, _pv.y); hi = Math.max(hi, _pv.y); });
        } else {
          const a = mx.clipAction(sizeC); a.reset().setEffectiveWeight(1).play();
          for (let k = 0; k < 6; k++) { mx.setTime(sizeC.duration * k / 6); g.updateMatrixWorld(true);
            g.traverse(b => { if (!b.isBone) return; b.getWorldPosition(_pv); lo = Math.min(lo, _pv.y); hi = Math.max(hi, _pv.y); }); }
          a.stop(); mx.uncacheAction(sizeC);
        }
        if (!(hi > lo)) { console.warn(key + ': no bones to size by'); return; }
        const crown = (() => { let c = false; g.traverse(b => { if (b.isBone && /HeadTop_End|head_end|headtop/i.test(b.name)) c = true; }); return c; })();
        const s = o.seatedHeight ? o.seatedHeight / (hi - lo) : o.height / ((hi - lo) / (crown ? 1 : 0.935));
        const inner = new THREE.Group(); inner.scale.setScalar(s); inner.add(g); group.add(inner);
        P.inner = inner; P.model = g; P.mixer = mx; P.scale = s;
        /* the layers */
        const L = P.L;
        if (o.stand) { L.standLo = act(o.stand, 'lower'); L.standUp = act(o.stand, 'upper'); }
        if (o.sit) { L.sitLo = act(o.sit, 'lower'); L.sitUp = act(o.sit, 'upper'); }
        L.walk = o.walk === false ? null : act(o.walk || 'Walking');
        /* (v24.5, Chad on Pong's head and neck — measured with his look let go: his answering take, the first master's
           retargeted onto this rig, tips his head up to 44° onto either shoulder and swings it 52° aside, a nod become a
           roll. `talkHead: false` rides the talk take's chest, arms and hands only and keeps the sitting take's own neck
           and head under it (cut to the talk take's length, so the gestures never hold still at a loop's end); the head
           is his look's, and a small nod carries the line) */
        if (o.talk && o.talkHead === false && o.sit && clip(o.talk) && clip(o.sit)) {
          const tc = clip(o.talk).clone(), HN = /Neck|Head/;
          tc.tracks = tc.tracks.filter(tr => !HN.test(tr.name.split('.')[0]))
            .concat(clip(o.sit).tracks.filter(tr => HN.test(tr.name.split('.')[0])).map(tr => tr.clone()));
          tc.name = o.talk + '_nohead';
          L.talk = mx.clipAction(upperOnly(tc));
        } else L.talk = o.talk ? act(o.talk, 'upper') : null;
        for (const k of ['standLo', 'standUp', 'sitLo', 'sitUp', 'walk', 'talk']) if (L[k]) L[k].reset().setEffectiveWeight(0).play();
        const pose = (sitW) => {                            // the rest alone, at this blend, for measuring
          for (const k of ['standLo', 'standUp']) if (L[k]) L[k].setEffectiveWeight(1 - sitW);
          for (const k of ['sitLo', 'sitUp']) if (L[k]) L[k].setEffectiveWeight(sitW);
          if (L.walk) L.walk.setEffectiveWeight(0); if (L.talk) L.talk.setEffectiveWeight(0);
          mx.update(0); g.updateMatrixWorld(true);
        };
        /* standing: the soles a hair over the floor (the stand take's lowest bone, measured in its own clock) */
        if (o.stand) {
          inner.position.set(0, 0, 0); pose(0);
          let sl = Infinity; const sa = clip(o.stand);
          /* (v24.5, L5-1: in the GROUP's frame — the world height, with the group already at its floor and `inner` scaled,
             was scaled by s again: every standing and walking person stood sunk, Joy and Lim 0.4 m into the sala's floor,
             the stall woman 0.84 m into the road's pad) */
          group.updateMatrixWorld(true);
          for (let k = 0; k < 4; k++) { mx.setTime(sa.duration * k / 4); g.updateMatrixWorld(true);
            g.traverse(b => { if (b.isBone && /Foot|Toe/.test(b.name)) { b.getWorldPosition(_pv); group.worldToLocal(_pv); sl = Math.min(sl, _pv.y); } }); }
          if (!isFinite(sl)) { group.updateMatrixWorld(true); sl = skinLow(P); }
          P.standInner.set(0, -sl + 0.005, 0);
          /* then the SKIN's own sole on the floor, at the take's first frame — a rig's lowest foot bone may be its toe base or
             its ankle, centimetres over the sole (the bones put the body near; the skin puts it exactly) */
          mx.setTime(0); inner.position.copy(P.standInner); P.standInner.y -= skinLow(P) - 0.004;
        }
        /* seated: the skin's seat set on the seat's top, at the group's origin; never through the floor under the seat; and
           on a bench, feet that would hang are let down onto the floor, the seat taking up to 5 cm of it (cloth gives) */
        if (o.sit) {
          inner.position.set(0, 0, 0); pose(1);
          const c = seatContact(P);
          if (c) P.sitInner.set(-c.x, (o.seatH || 0) - c.y, -c.z);
          if (o.seatFloor != null) {
            inner.position.copy(P.sitInner); const lw = skinLow(P);
            if (lw < o.seatFloor + 0.004) P.sitInner.y += o.seatFloor + 0.004 - lw;
            else if (o.feet && lw > o.seatFloor + 0.01) P.sitInner.y -= Math.min(lw - o.seatFloor - 0.01, 0.05);
          }
          inner.position.copy(P.sitInner);
          P.diag = { scale: +s.toFixed(4), seat: c && [+c.x.toFixed(3), +c.y.toFixed(3), +c.z.toFixed(3)], low: +(skinLow(P) + (o.y || 0)).toFixed(3) };
        }
        /* (a parked rest — her one still frame — and a slower breath are set after the measuring, which runs the clocks) */
        if (o.idleAt != null) for (const k of ['standLo', 'standUp', 'sitLo', 'sitUp']) if (L[k]) { L[k].time = o.idleAt; L[k].setEffectiveTimeScale(0); }
        if (o.restRate) for (const k of ['standLo', 'standUp', 'sitLo', 'sitUp']) if (L[k]) L[k].setEffectiveTimeScale(o.restRate);
        pose(P.sitW);
        inner.position.lerpVectors(P.standInner, P.sitInner, P.sitW);
        /* v24.5 (L5-3): a body CENTRED on its group — her take (Stand_and_Chat, parked) stands her hips 0.6 m off the group's
           origin, so every place that aimed at her spot (the storm's fourth flash, the doorway's sign, ending B's glance)
           aimed beside her, and at the door she stood against the wall beside the curtain, not in it */
        if (o.centre && P.hips && P.sitW < 0.5) {
          group.updateMatrixWorld(true); P.hips.getWorldPosition(_pv); group.worldToLocal(_pv);
          P.standInner.x -= _pv.x; P.standInner.z -= _pv.z;
          inner.position.lerpVectors(P.standInner, P.sitInner, P.sitW);
        }
        /* his face's direction, in the head bone's own frame, measured at the FILE's own rest — every layer at weight 0,
           so the mixer gives back the pose the file was bound in, head level and along the body's forward. A take's rest
           may hold the head anywhere (CP9, by photograph: Pong's cross-legged take holds his chin up and his head turned,
           and a face measured there looked past the lens by that turn whenever he was asked to look at it). The turn
           the take's own rest holds the head at is kept as a diagnostic (`diag.faceTurn`, degrees). */
        if (P.head) {
          for (const k of ['standLo', 'standUp', 'sitLo', 'sitUp', 'walk', 'talk']) if (L[k]) L[k].setEffectiveWeight(0);
          mx.update(0); group.updateMatrixWorld(true);
          P.head.getWorldQuaternion(_hq);
          group.getWorldQuaternion(_pq);
          P.faceLocal = new THREE.Vector3(0, 0, 1).applyQuaternion(_pq).applyQuaternion(_hq.invert()).normalize();
          P.upLocal = new THREE.Vector3(0, 1, 0).applyQuaternion(_pq).applyQuaternion(_hq).normalize();   // (_hq is the inverse here)
          pose(P.sitW); group.updateMatrixWorld(true);
          P.head.getWorldQuaternion(_hq);
          const fw = P.faceLocal.clone().applyQuaternion(_hq), bw = new THREE.Vector3(0, 0, 1).applyQuaternion(_pq);
          P.diag = Object.assign(P.diag || {}, { faceTurn: +THREE.MathUtils.radToDeg(fw.angleTo(bw)).toFixed(1) });
        }
        P.ready = true;
        /* the culling sphere round the posed skin, in world space, generous (v18.5's law) — a walker's is wider */
        group.updateMatrixWorld(true);
        const bb = new THREE.Box3();
        g.traverse(m => { if (!m.isSkinnedMesh) return; m.skeleton.update(); const n = m.geometry.attributes.position.count, st = Math.max(1, Math.floor(n / 3000));
          for (let i = 0; i < n; i += st) { m.getVertexPosition(i, _pv); _pv.applyMatrix4(m.matrixWorld); bb.expandByPoint(_pv); } });
        if (!bb.isEmpty()) {
          const sph = bb.getBoundingSphere(new THREE.Sphere()); sph.radius = Math.max(sph.radius * 1.5, 1.3);
          g.traverse(m => { if (!m.isSkinnedMesh) return; m.frustumCulled = true; const inv = m.matrixWorld.clone().invert(), k = m.matrixWorld.getMaxScaleOnAxis() || 1;
            m.boundingSphere = new THREE.Sphere(sph.center.clone().applyMatrix4(inv), sph.radius / k); });
        }
        owned.push({ dispose: () => mx.stopAllAction() });
        if (o.then) o.then(P);
        for (const f of P.onReady.splice(0)) f(P);
      }).catch(err => {
        console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err);
        /* (CP13: a beat that waits on a person never came when the download failed — the tray, the fourth sign) */
        P.failed = true; for (const f of P.onFail.splice(0)) f(P);
      });
      people.push(P);
      return P;
    }
    /* (v24.15) A STILL PERSON — a scan with no rig (Chad's old woman, the presence): stood on her group's floor, her
       footprint centred on its spot, scaled to `height` by her own box (a still mesh's box is its pose, which a skinned
       one's is not), and `head` an anchor where a rig's head bone would be, so herPoint reads her as it read the rig.
       Never in `people`: nothing in her moves, and peopleTick drives mixers and looks */
    function mkStill(key, o) {
      const group = new THREE.Group(); group.position.set(o.x, o.y || 0, o.z); group.rotation.y = o.ry || 0; o.parent.add(group);
      if (o.hidden) group.visible = false;
      const P = { key, group, model: null, head: null, ready: false, failed: false, o, onReady: [], onFail: [] };
      parseOnce(key).then(({ scene: sc }) => {
        if (!alive) return;
        const g = sc.clone(true);
        g.traverse(m => { if (!m.isMesh) return; m.castShadow = !LOW && !o.noShadow; m.receiveShadow = false;
          if (o.noMip) for (const mm of [].concat(m.material)) { const t = mm && mm.map;
            if (t && t.generateMipmaps !== false) { t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.needsUpdate = true; } } });
        g.updateMatrixWorld(true);
        const bb = new THREE.Box3().setFromObject(g), s = o.height / Math.max(1e-3, bb.max.y - bb.min.y);
        g.scale.setScalar(s);
        g.position.set(-(bb.min.x + bb.max.x) / 2 * s, -bb.min.y * s, -(bb.min.z + bb.max.z) / 2 * s);
        group.add(g);
        const head = new THREE.Object3D(); head.position.set(0, o.height * 0.9, 0); group.add(head);
        P.model = g; P.head = head; P.scale = s; P.ready = true;
        if (o.then) o.then(P);
        for (const f of P.onReady.splice(0)) f(P);
      }).catch(err => {
        console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err);
        P.failed = true; for (const f of P.onFail.splice(0)) f(P);
      });
      return P;
    }
    const whenReady = (P, f) => { if (!P) return; if (P.ready) f(P); else P.onReady.push(f); };
    /* the same, with what to do if his model never comes (the v4.7 rule: a failed download costs a person, never the
       chapter) */
    const whenReadyOr = (P, f, fail) => { if (!P || P.failed) { fail(); return; } if (P.ready) { f(P); return; } P.onReady.push(f); P.onFail.push(fail); };
    /* he speaks: the talking take eased in over his rest for the line's length, on WALL time */
    function personTalk(P, secs) { if (P) P.talkUntil = wallNow() + secs; }
    /* a take played once over the rest (a gesture, the pao), on the body only unless asked; `hold` keeps its last frame */
    function personDo(P, name, o = {}) {
      whenReady(P, () => {
        const a = P.act(name, o.full ? null : 'upper'); if (!a) return;
        if (P.one && P.one.a !== a) P.one.a.setEffectiveWeight(0);
        a.reset().setLoop(o.loop ? THREE.LoopRepeat : THREE.LoopOnce, o.loop ? Infinity : 1); a.clampWhenFinished = true;
        a.setEffectiveTimeScale(o.rate || 1).setEffectiveWeight(0).play();
        P.one = { a, until: o.loop || o.hold ? Infinity : wallNow() + a.getClip().duration / (o.rate || 1) - 0.3 };
      });
    }
    function personRest(P) { if (P) P.one && (P.one.until = 0); }
    /* sitting down and getting up: the blend of pose and offset eases on the frame (sitW); a walk waits for the standing.
       `seat` ({x, z}, the parent's frame) sits him onto a seat from where he stands in front of it: the group moves onto
       the seat at once and the body is carried back to it with the blend (P.sitOff, the parent's frame, shrinking with
       1 − sitW), so he lowers himself backwards onto the bench rather than sinking into it where he stood. Getting up
       carries him forward again by the same step (`seatFwd`, 0.42 m when he began seated), and the group follows the
       body once he is up. */
    function personSit(P, on = true, seat) {
      if (!P) return;
      P.seated = !!on;
      if (on) {
        P.walk = null;
        if (seat && P.ready) {
          const g = P.group, ox = g.position.x - seat.x, oz = g.position.z - seat.z;
          P.sitOff = new THREE.Vector3(ox, 0, oz); P.seatFwd = Math.hypot(ox, oz);
          g.position.x = seat.x; g.position.z = seat.z;
          if (P.o.ground) g.position.y = P.o.ground(seat.x, seat.z);
          P.sitOffK = 1 - P.sitW;                               // what of the step the blend still has to carry
        }
      } else if (P.ready && P.sitOff && P.sitOffK >= 0) {
        P.sitOffK = -1;                                       // told to stand mid-sit: the same step, now carried forward
      } else if (P.ready && !P.sitOff && P.sitW > 0.002) {
        const f = P.seatFwd != null ? P.seatFwd : (P.o.seatFwd != null ? P.o.seatFwd : 0.42);
        const ry = P.group.rotation.y;
        P.sitOff = new THREE.Vector3(Math.sin(ry) * f, 0, Math.cos(ry) * f); P.sitOffK = -1;   // rising: grows with 1 − sitW
      }
    }
    /* the step, on the frame: the body's place relative to the group, in the group's own frame */
    const _so = new THREE.Vector3();
    function sitStep(P) {
      if (!P.sitOff) return;
      const g = P.group, rising = P.sitOffK < 0;
      const k = rising ? (1 - P.sitW) : (P.sitOffK > 0 ? (1 - P.sitW) / P.sitOffK : 0);
      _so.copy(P.sitOff).multiplyScalar(Math.min(1, k));
      const c = Math.cos(g.rotation.y), s = Math.sin(g.rotation.y);   // the parent's frame into the group's (a turn about y)
      P.inner.position.x += _so.x * c - _so.z * s; P.inner.position.z += _so.x * s + _so.z * c;
      if (!rising && P.sitW > 0.999) P.sitOff = null;
      if (rising && P.sitW < 0.001) sitRebase(P);
    }
    /* up: the group stands where the body does, and the offset is gone */
    function sitRebase(P) {
      if (!P.sitOff || P.sitOffK >= 0) return;
      const g = P.group; g.position.x += P.sitOff.x; g.position.z += P.sitOff.z;
      if (P.o.ground) g.position.y = P.o.ground(g.position.x, g.position.z);
      P.sitOff = null;
      P.inner.position.lerpVectors(P.standInner, P.sitInner, P.sitW);
    }
    /* a person moved to a mark (a cut, never seen moving) */
    function personPut(P, x, z, ry, y) { if (!P) return; P.walk = null; P.sitOff = null;
      P.group.position.set(x, y != null ? y : (P.o.ground ? P.o.ground(x, z) : P.group.position.y), z); if (ry != null) { P.group.rotation.y = ry; P.turnTo = null; } }
    /* a walk along points on the group's own floor (`o.ground` lifts him up steps): the walking take tied to the ground
       covered, the body turned to its heading on the way (a corner is walked, not snapped), the rest back at the end and
       the last heading eased. A seated man stands first. */
    function personWalk(P, pts, o = {}) {
      whenReady(P, () => {
        if (P.seated || P.sitW > 0.05) personSit(P, false);
        P.seated = false;
        P.walk = { pts: pts.slice(), i: 0, speed: o.speed || 1.1, ry: o.ry, then: o.then, wait: P.sitW > 0.05, tag: o.tag || '' };
      });
    }
    const angTo = (a, b) => Math.atan2(Math.sin(b - a), Math.cos(b - a));
    const ease = (v, to, rate, dt) => v + (to - v) * (1 - Math.exp(-dt * rate));
    function walkTick(P, dt) {
      const W = P.walk; if (!W) return;
      if (W.wait) { if (P.sitW > 0.05) return; W.wait = false; sitRebase(P); }
      const g = P.group, tgt = W.pts[W.i];
      const dx = tgt[0] - g.position.x, dz = tgt[1] - g.position.z, d = Math.hypot(dx, dz);
      if (d < 0.04) {
        W.i++;
        if (W.i >= W.pts.length) { P.walk = null; if (W.ry != null) P.turnTo = W.ry; if (W.then) W.then(); }
        return;
      }
      const step = Math.min(d, W.speed * dt * Math.min(1, P.walkW * 1.6 + 0.15));
      g.position.x += dx / d * step; g.position.z += dz / d * step;
      if (P.o.ground) g.position.y = P.o.ground(g.position.x, g.position.z);
      g.rotation.y += angTo(g.rotation.y, Math.atan2(dx, dz)) * Math.min(1, dt * 6);
      if (P.L.walk) P.L.walk.setEffectiveTimeScale(W.speed / 1.3);
    }
    function peopleTick(now, wdt) {
      const live = getState() === 'play';
      for (const P of people) {
        if (!P.ready) continue;
        let vis = P.group.visible; for (let q = P.group.parent; vis && q && q !== world; q = q.parent) vis = q.visible;
        if (!vis) continue;
        if (P.head && P.headWrote) P.head.quaternion.copy(P.headWrote);
        if (P.spine && P.spineWrote) P.spine.quaternion.copy(P.spineWrote);
        if (P.arms) for (const sd in P.arms) { const a = P.arms[sd]; if (a.wrote) { a.up.quaternion.copy(a.wUp); a.fore.quaternion.copy(a.wFore); } }
        walkTick(P, wdt);
        if (P.turnTo != null) { const d = angTo(P.group.rotation.y, P.turnTo); P.group.rotation.y += d * Math.min(1, wdt * 3.5); if (Math.abs(d) < 0.01) P.turnTo = null; }
        /* the layers' weights, eased */
        const L = P.L;
        P.sitW = ease(P.sitW, P.seated && (L.sitLo || !L.standLo) ? 1 : 0, 2.4, wdt);
        if (Math.abs(P.sitW - (P.seated ? 1 : 0)) < 0.002) P.sitW = P.seated ? 1 : 0;
        P.walkW = ease(P.walkW, (P.walk && !P.walk.wait) || P.filmWalk ? 1 : 0, 4.5, wdt);
        if (P.filmWalk && P.L.walk) P.L.walk.setEffectiveTimeScale(P.filmWalk / 1.3);   // a film walks him by its clock (CP9: fWalk)
        P.talkW = ease(P.talkW, now < P.talkUntil ? (P.o.talkWeight || 1) : 0, 3.2, wdt);
        if (P.one && now > P.one.until) { P.oneW = ease(P.oneW, 0, 3.0, wdt); if (P.oneW < 0.01) { P.one.a.setEffectiveWeight(0); P.one = null; P.oneW = 0; } }
        else if (P.one) P.oneW = ease(P.oneW, 1, 4.0, wdt);
        const st = L.standLo ? 1 - P.sitW : 0, sw = L.standLo ? P.sitW : 1, wk = L.walk ? P.walkW : 0;
        const tk = L.talk ? P.talkW * (1 - P.oneW) * (1 - wk) : 0, up = (1 - 0.9 * tk) * (1 - P.oneW);
        if (L.standLo) { L.standLo.setEffectiveWeight(st * (1 - wk)); L.standUp.setEffectiveWeight(st * (1 - wk) * up); }
        if (L.sitLo) { L.sitLo.setEffectiveWeight(sw); L.sitUp.setEffectiveWeight(sw * up); }
        if (L.walk) L.walk.setEffectiveWeight(st * wk);
        if (L.talk) L.talk.setEffectiveWeight(tk);
        if (P.one) P.one.a.setEffectiveWeight(P.oneW);
        if (L.standLo && L.sitLo) { P.inner.position.lerpVectors(P.standInner, P.sitInner, P.sitW); sitStep(P); }
        P.mixer.update(wdt);
        if (P.head) {
          if (!P.headWrote) P.headWrote = new THREE.Quaternion();
          P.headWrote.copy(P.head.quaternion);
          if (P.spine) { if (!P.spineWrote) P.spineWrote = new THREE.Quaternion(); P.spineWrote.copy(P.spine.quaternion); }
          /* THE LOOK IS ABSOLUTE (v5.04's law, in full): the face is turned onto what he looks at from wherever the take
             has put it, never added to it — a talking take that leans him back with his chin up (the master's
             answering take) would otherwise carry the look over the client's head. His face's own direction is
             measured once at rest (`faceLocal`, the head bone's frame); each frame the head is turned, in the world,
             by the part of the arc from where the face points to the target that this look's weight asks for, the
             target held to a neck's reach of the BODY's forward (yaw ±0.85, pitch −0.35…+0.30). */
          const tgt = P.lookAt || ((P.look > 0 && (live || P.lookFilm)) ? camera : null);
          let want = 0;
          if (tgt && P.faceLocal) {
            P.head.updateWorldMatrix(true, false);
            P.head.getWorldPosition(_hp); (tgt.isObject3D ? tgt.getWorldPosition(_cp) : _cp.copy(tgt));
            P.group.getWorldQuaternion(_pq); _pe.setFromQuaternion(_pq, 'YXZ');
            const dx = _cp.x - _hp.x, dz = _cp.z - _hp.z, dy = _cp.y - _hp.y, hd = Math.hypot(dx, dz);
            const a = Math.atan2(dx, dz) - _pe.y, yawTo = Math.atan2(Math.sin(a), Math.cos(a));
            if (Math.abs(yawTo) < 1.7 && hd < 9) {
              want = P.lookAt ? 1 : P.look;
              const nk = P.neck || 0.85;
              const yy = _pe.y + THREE.MathUtils.clamp(yawTo, -nk, nk), pp = THREE.MathUtils.clamp(Math.atan2(dy, hd), -0.35, 0.3);
              P.lookDir.set(Math.sin(yy) * Math.cos(pp), Math.sin(pp), Math.cos(yy) * Math.cos(pp));
            }
          }
          P.lookW += (want - P.lookW) * (1 - Math.exp(-wdt * 2.4));
          if (P.lookW > 0.002 && P.faceLocal) {
            P.head.updateWorldMatrix(true, false);
            P.head.getWorldQuaternion(_hq);
            _fv.copy(P.faceLocal).applyQuaternion(_hq);
            /* a wide turn is shared with the chest, as a person turns: past 26° the upper spine takes 55 % of the rest,
               about the world's up (CP9, by photograph: Pong, seated beside the client, turned his head alone 72° to
               answer him and it read as a man craning at the ceiling) */
            if (P.spine) {
              const dyw = angTo(Math.atan2(_fv.x, _fv.z), Math.atan2(P.lookDir.x, P.lookDir.z));
              const sh = Math.sign(dyw) * Math.max(0, Math.abs(dyw) - 0.45) * 0.55 * Math.min(1, P.lookW);
              if (Math.abs(sh) > 1e-4) {
                P.spine.updateWorldMatrix(true, false); P.spine.getWorldQuaternion(_spq);
                _dq.setFromAxisAngle(_UPV, sh); P.spine.parent.getWorldQuaternion(_pq2);
                P.spine.quaternion.copy(_pq2.invert().multiply(_dq.multiply(_spq)));
                P.head.updateWorldMatrix(true, false); P.head.getWorldQuaternion(_hq);
                _fv.copy(P.faceLocal).applyQuaternion(_hq);
              }
            }
            /* a TURN about the world's up, then a NOD about the face's own horizontal — never the shortest arc between
               the two directions, whose roll tipped a head turned far to one side onto its shoulder with the chin up
               (CP9: Pong translating to the client looked at the ceiling over his head) */
            const fy = Math.atan2(_fv.x, _fv.z), fp = Math.asin(THREE.MathUtils.clamp(_fv.y, -1, 1));
            const ly = Math.atan2(P.lookDir.x, P.lookDir.z), lpch = Math.asin(THREE.MathUtils.clamp(P.lookDir.y, -1, 1));
            _qy.setFromAxisAngle(_UPV, angTo(fy, ly));
            _ax.set(-Math.cos(ly), 0, Math.sin(ly));
            _dq.setFromAxisAngle(_ax, lpch - fp).multiply(_qy);
            /* (CP11, measured: `_dq.slerpQuaternions(_iq, _dq, w)` COPIES _iq into _dq before it blends toward _dq, which is
               then the identity too — the turn was always nothing, and from CP7 no head in this chapter ever turned to
               look at anything; only the takes' own poses and the chest's share moved. The blend goes into its own.) */
            _qlk.copy(_iq).slerp(_dq, Math.min(1, P.lookW));
            P.head.parent.getWorldQuaternion(_pq2);
            P.head.quaternion.copy(_pq2.invert().multiply(_qlk.multiply(_hq)));
          }
          /* A HEAD STAYS LEVEL (v24.5, Chad: "Are you telling me you dont see any problems with how pong head and neck
             turns?" — measured: a talking take that sways the chest to one side carried Pong's head with it, up to 18° onto
             his shoulder, look or no look). A person's eyes keep near the horizontal whatever the chest does under them:
             the roll about the face's own line, against the BODY's up (a man riding a pickup leans with its cab), is left
             alone up to 5° and three quarters taken out past it; nothing is done while the face points near straight up or
             down, where level means nothing */
          if (P.upLocal && P.faceLocal) {
            P.head.updateWorldMatrix(true, false); P.head.getWorldQuaternion(_hq);
            _fv.copy(P.faceLocal).applyQuaternion(_hq);
            P.group.getWorldQuaternion(_pq2); _lvU.set(0, 1, 0).applyQuaternion(_pq2);
            const fu = _fv.dot(_lvU), wl = THREE.MathUtils.clamp((0.85 - Math.abs(fu)) / 0.3, 0, 1);
            if (wl > 0) {
              _lvH.copy(P.upLocal).applyQuaternion(_hq); _lvH.addScaledVector(_fv, -_lvH.dot(_fv)).normalize();
              _lvU.addScaledVector(_fv, -fu).normalize();
              const ro = Math.atan2(_lvX.crossVectors(_lvU, _lvH).dot(_fv), _lvU.dot(_lvH)), ar = Math.abs(ro);
              if (ar > ROLL_FREE) {
                _dq.setFromAxisAngle(_fv, (Math.sign(ro) * (ROLL_FREE + (ar - ROLL_FREE) * 0.25) - ro) * wl);
                P.head.parent.getWorldQuaternion(_pq2);
                P.head.quaternion.copy(_pq2.invert().multiply(_dq.multiply(_hq)));
              }
            }
          }
          P.bowNow += ((P.bow || 0) - P.bowNow) * Math.min(1, wdt * 2.5);
          /* a man with no talking take of his own nods his way through his line (Ta Sombat) */
          const nod = (!L.talk || P.o.talkHead === false) && P.talkW > 0.02 ? 0.07 * Math.sin(now * 5.2) * P.talkW : 0;
          const pit = P.bowNow + nod;
          if (Math.abs(pit) > 1e-4) { _pe.set(pit, 0, 0, 'YXZ'); _pq.setFromEuler(_pe); P.head.quaternion.multiply(_pq); }
        }
        if (P.arms) gripTick(P);
        if (P.after) P.after(P, now, wdt);
      }
    }
    /* (v24.21) HANDS ON THE WHEEL (Chad, 30 Oct: "The taxi scene has no driver in front. Also the intro scene also has no
       driver in the moving truck"): a driver's two arms bent, every frame after his takes have posed him, so each wrist
       lands on its point on the rim (`P.grip.Left/Right`, objects riding the vehicle) — the elbow kept down and out
       (`pole`, in the body's own frame). Two bones, solved exactly: the shoulder turned so the elbow is where the arm's
       two lengths meet over the target, then the elbow turned onto the target. ABSOLUTE and undone before the mixer
       runs again (the v11.5 law: the mixer writes a bone only when its take's value changes, so a turn left in a bone
       would be bent again from itself) */
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
    const _igq = new THREE.Quaternion();            // (v25.0) a solved turn, copied before it is blended (gripTick)
    function gripTick(P) {
      for (const sd in P.arms) {
        const a = P.arms[sd]; a.wUp.copy(a.up.quaternion); a.wFore.copy(a.fore.quaternion); a.wrote = true;
        const t = P.grip && P.grip[sd]; if (!t) continue;
        t.getWorldPosition(_ig);
        /* the elbow's side: down, out to his own side and a little back, in the body's frame (his left is +x in a Mixamo
           rig's own frame) */
        const pl = (P.o.grip.pole || [0.35, -0.6, -0.15]);
        a.up.getWorldPosition(_ib); P.group.getWorldQuaternion(_iqp);
        _ic.set(pl[0] * (sd === 'Left' ? 1 : -1), pl[1], pl[2]).applyQuaternion(_iqp).add(_ib);
        armTo(a, _ig, _ic);
        /* (v25.0) eased by P.gripK from where the take holds the arm (Lersi Chin's wai, reach and bowl) */
        if (P.gripK != null && P.gripK < 0.999) {
          _igq.copy(a.up.quaternion); a.up.quaternion.slerpQuaternions(a.wUp, _igq, P.gripK);
          _igq.copy(a.fore.quaternion); a.fore.quaternion.slerpQuaternions(a.wFore, _igq, P.gripK);
        }
      }
    }

    /* ---- THE CAST (§3.5). Lersi Chin is Chad's own (`lersichin`, v24.38: his own twelve takes); Pong is Chad's
       (`e4pong`, declared reuse); the goldsmith's man and the two passers-by are the same mall's people chapter 1 cast
       (declared reuse), seen only at noon, a corridor away and blurred by the fog. Nobody is a block figure (v21.16); a
       failed download costs a person, never the chapter (v4.7). */
    const cast = {};
    /* his standing rest: he has no idle of his own (§6.1), so a talking take's quiet stretch is his rest — its opening
       frame, hands low, parked; it breathes on the cross-legged sit, which is a loop of his own */
    const LC_STAND = 'Talk_with_Hands_Open', LC_STAND_AT = 0.05;
    const MAT_TOP = 0.012;                                                       // the woven mat's top over the tiles
    const PONG_RY = Math.atan2(MAT.x - PSTOOL.x, MAT.z - PSTOOL.z);              // Pong on his stool, turned to the mat
    function buildCast() {
      cast.lersi = mkPerson('lersichin', { parent: worldS, x: LC.x, z: LC.z, ry: 0, height: 1.68, sizeTake: 'Walking',
        posture: 'sit', sit: 'Sit_Cross_Legged_on_Floor', stand: LC_STAND, walk: 'Walking', talk: 'Sitting_Answering_Questions', talkHead: false,
        seatH: MAT_TOP, seatFloor: 0.004, look: 1, noMip: true, hidden: true,
        grip: { pole: [0.35, -0.6, -0.15] },
        then: (P) => {
          for (const k of ['standLo', 'standUp']) if (P.L[k]) { P.L[k].time = LC_STAND_AT; P.L[k].setEffectiveTimeScale(0); }
          P.waiGrip = { Left: new THREE.Object3D(), Right: new THREE.Object3D() };
          for (const sd in P.waiGrip) P.group.add(P.waiGrip[sd]);
          P.reach = { Left: new THREE.Object3D(), Right: new THREE.Object3D() }; P.reachR = { Right: P.reach.Right };
          for (const sd in P.reach) worldS.add(P.reach[sd]);
          P.bowlGrip = { Left: new THREE.Object3D(), Right: new THREE.Object3D() };
          if (props.bowl) { P.bowlGrip.Left.position.set(0.118, 0.07, 0); P.bowlGrip.Right.position.set(-0.118, 0.07, 0); props.bowl.add(P.bowlGrip.Left, P.bowlGrip.Right); }
          waiHands(P);
          P.after = waiAfter;
        } });
      cast.pong = mkPerson('e4pong', { parent: worldS, x: PSTOOL.x, z: PSTOOL.z, ry: PONG_RY, height: 1.7, sizeTake: 'Idle_4',
        posture: 'sit', stand: 'Idle_4', sit: 'Sit_Upright', talk: 'Talk_with_Right_Hand_Open', seatH: 0.71, seatFloor: 0, feet: true,
        look: 0.9, noMip: true, hidden: true });
      cast.goldman = mkPerson('staffman', { parent: worldS, x: -3.2, z: 9.95, ry: Math.PI, height: 1.66, sizeTake: 'Idle_9', posture: 'stand', stand: 'Idle_9', walk: false, look: 0, noShadow: true });
      cast.mallA = mkPerson('sitwoman', { parent: worldS, x: 3.4, z: 4.15, ry: -Math.PI / 2, height: 1.56, anims: 'wifewalk', sizeTake: 'Walking', posture: 'stand', stand: 'Walking', look: 0, noShadow: true, hidden: true });
      cast.mallB = mkPerson('sitangry', { parent: worldS, x: 4.0, z: 6.9, ry: -Math.PI / 2, height: 1.7, anims: 'fatherwalk', sizeTake: 'Walking', posture: 'stand', stand: 'Walking', look: 0, noShadow: true, hidden: true });
    }
    /* HIS HANDS (Lersi Chin has no take for a wai, a reach or a bowl held): his wrists carried onto points by the arm
       solver the drivers use (armTo), blended from where his take holds them by `k` (gripTick's P.gripK, v25.0). In a wai
       each hand is turned fingers up and palm to the middle (waiAfter; the palm found from the hand's own vertices at its
       bind, since his rig has no finger bones). The wai's points ride his group, set each frame from his chest (the spine
       bone, last frame's); a reach's and a bowl's are in the world. A thing he holds rides his hand, or the middle of the
       two in a wai; let go, it goes home. Every pose is undone before the mixer runs again (the v11.5 law) */
    const _wv = new THREE.Vector3(), _wq = new THREE.Quaternion(), _wF = new THREE.Vector3(), _wN = new THREE.Vector3(), _wX = new THREE.Vector3();
    const _wMw = new THREE.Matrix4(), _wMl = new THREE.Matrix4(), _wqT = new THREE.Quaternion(), _wqP = new THREE.Quaternion();
    const _wa = new THREE.Vector3(), _wb = new THREE.Vector3();
    const lerpN = (a, b, k) => a + (b - a) * k;
    function waiHands(P) {
      const sks = []; P.model.traverse(m => { if (m.isSkinnedMesh) sks.push(m); });
      if (!sks.length) return;
      const bones = sks[0].skeleton.bones, inv = sks[0].skeleton.boneInverses;
      const idx = (re) => bones.findIndex(b => re.test(b.name));
      const bindAt = (i) => new THREE.Vector3().setFromMatrixPosition(new THREE.Matrix4().copy(inv[i]).invert());
      const hip = idx(/Hips(_\d+)?$/);
      P.waiHand = {};
      for (const sd of ['Left', 'Right']) {
        const hi = idx(new RegExp(sd + 'Hand(_\\d+)?$')), ti = idx(new RegExp(sd + 'HandMiddle\\d(_\\d+)?$'));
        if (hi < 0) continue;
        const Hinv = inv[hi];
        const fL = ti >= 0 ? bindAt(ti).applyMatrix4(Hinv).normalize() : new THREE.Vector3(0, 1, 0);
        /* the hand's own vertices (each one's heaviest bone the hand or its end), in the hand's frame at its bind */
        const pts = [], v = new THREE.Vector3(), M2 = new THREE.Matrix4();
        for (const sk of sks) {
          const sb = sk.skeleton.bones, h2 = sb.indexOf(bones[hi]), t2 = ti >= 0 ? sb.indexOf(bones[ti]) : -1; if (h2 < 0) continue;
          M2.multiplyMatrices(sk.skeleton.boneInverses[h2], sk.bindMatrix);
          const pos = sk.geometry.attributes.position, si = sk.geometry.attributes.skinIndex, sw = sk.geometry.attributes.skinWeight;
          if (!si || !sw) continue;
          for (let i = 0; i < pos.count; i++) {
            let bi = -1, bw = 0;
            for (let c = 0; c < 4; c++) { const w = sw.getComponent(i, c); if (w > bw) { bw = w; bi = si.getComponent(i, c); } }
            if (bi !== h2 && bi !== t2) continue;
            pts.push(v.fromBufferAttribute(pos, i).applyMatrix4(M2).clone());
          }
        }
        if (pts.length < 12) continue;
        /* the palm's normal: the thinnest way across the hand, square to the fingers (a 2 × 2 spread, its minor axis),
           turned to face the body at the bind (an A-pose's palms face the thighs) */
        const c0 = new THREE.Vector3(); for (const p of pts) c0.add(p); c0.divideScalar(pts.length);
        const u = new THREE.Vector3(1, 0, 0); if (Math.abs(u.dot(fL)) > 0.9) u.set(0, 0, 1);
        u.addScaledVector(fL, -u.dot(fL)).normalize(); const w2 = new THREE.Vector3().crossVectors(fL, u);
        let a = 0, b = 0, cc = 0;
        for (const p of pts) { const dx = p.x - c0.x, dy = p.y - c0.y, dz = p.z - c0.z, px = dx * u.x + dy * u.y + dz * u.z, py = dx * w2.x + dy * w2.y + dz * w2.z; a += px * px; b += px * py; cc += py * py; }
        const th = 0.5 * Math.atan2(2 * b, a - cc) + Math.PI / 2;
        const nL = u.clone().multiplyScalar(Math.cos(th)).addScaledVector(w2, Math.sin(th)).normalize();
        if (hip >= 0 && nL.dot(bindAt(hip).applyMatrix4(Hinv)) < 0) nL.negate();
        const xL = new THREE.Vector3().crossVectors(fL, nL);
        P.waiHand[sd] = { bone: bones[hi], fL, nL, xL, q0: new THREE.Quaternion(), wrote: false };
      }
    }
    function holdHome(obj) {
      const h = obj && obj.userData.holdHome; if (!h) return;
      if (obj.parent !== h.parent) h.parent.add(obj);
      obj.position.copy(h.p); obj.rotation.copy(h.r);
    }
    function lcPose(mode, k = 1, o = {}) {
      const P = cast.lersi; if (!P || !P.ready || !P.arms || !P.waiGrip) return;
      const kk = Math.max(0, Math.min(1, k)), on = !!mode && kk > 0.001;
      const hold = on ? (o.hold || null) : null;
      if (P.holdObj && P.holdObj !== hold) holdHome(P.holdObj);
      if (hold && !hold.userData.holdHome) hold.userData.holdHome = { parent: hold.parent, p: hold.position.clone(), r: hold.rotation.clone() };
      P.holdObj = hold;
      if (!on) { P.grip = null; P.gripK = 0; P.waiOn = false; return; }
      P.gripK = kk; P.waiOn = mode === 'wai'; P.waiLift = o.lift || 0;
      if (mode === 'wai') P.grip = P.waiGrip;
      else if (mode === 'bowl') P.grip = P.bowlGrip;
      else {
        worldS.updateWorldMatrix(true, false);
        P.reach.Right.position.copy(worldS.worldToLocal(_wv.set(o.at[0], o.at[1], o.at[2])));
        if (o.atL) P.reach.Left.position.copy(worldS.worldToLocal(_wv.set(o.atL[0], o.atL[1], o.atL[2])));
        P.grip = o.atL ? P.reach : P.reachR;
      }
    }
    /* before the mixer: the hands' turns given back, and the wai's two points set from his chest */
    function waiUpdate() {
      const P = cast.lersi; if (!P || !P.ready) return;
      if (P.waiHand) for (const sd in P.waiHand) { const H = P.waiHand[sd]; if (H.wrote) { H.bone.quaternion.copy(H.q0); H.wrote = false; } }
      if (!P.grip || P.grip !== P.waiGrip || !P.spine) return;
      P.spine.getWorldPosition(_wv); P.group.worldToLocal(_wv);
      const L = P.waiLift || 0, y = _wv.y + lerpN(-0.05, 0.13, L), z = _wv.z + lerpN(0.2, 0.15, L);
      P.waiGrip.Left.position.set(_wv.x + 0.028, y, z);
      P.waiGrip.Right.position.set(_wv.x - 0.028, y, z);
    }
    /* after the arms are solved (P.after): the hands turned for a wai, and what he holds carried */
    function waiAfter(P) {
      if (!P.grip || !(P.gripK > 0.001)) return;
      if (P.waiOn && P.waiHand) {
        P.group.getWorldQuaternion(_wq);
        for (const sd in P.waiHand) {
          const H = P.waiHand[sd];
          H.q0.copy(H.bone.quaternion); H.wrote = true;
          _wF.set(0, 1, 0.25).normalize().applyQuaternion(_wq);                       // the fingers up, a little forward
          _wN.set(sd === 'Left' ? -1 : 1, 0, 0).applyQuaternion(_wq);                 // the palm to the middle (his left is +x)
          _wN.addScaledVector(_wF, -_wN.dot(_wF)).normalize();
          _wX.crossVectors(_wF, _wN);
          _wMw.makeBasis(_wF, _wN, _wX); _wMl.makeBasis(H.fL, H.nL, H.xL).transpose(); _wMw.multiply(_wMl);
          _wqT.setFromRotationMatrix(_wMw);
          H.bone.parent.getWorldQuaternion(_wqP); _wqT.premultiply(_wqP.invert());
          H.bone.quaternion.slerp(_wqT, P.gripK);
        }
      }
      const obj = P.holdObj;
      if (obj && P.waiHand && obj.parent) {
        const L = P.waiHand.Left, R = P.waiHand.Right;
        if (P.waiOn && L && R) { L.bone.getWorldPosition(_wa); R.bone.getWorldPosition(_wb); _wa.add(_wb).multiplyScalar(0.5); _wa.y += 0.07; }
        else if (R) { R.bone.getWorldPosition(_wa); R.bone.getWorldQuaternion(_wqP); _wb.copy(R.fL).applyQuaternion(_wqP).multiplyScalar(0.07); _wa.add(_wb); }
        else return;
        obj.parent.updateWorldMatrix(true, false); obj.position.copy(obj.parent.worldToLocal(_wa));
      }
    }

    /* ================================================================ THE PLAY (§4.1, §4.3)
       P1 the wallet (noon) → P2 the shape by the door (closing time) → P3 the call (a film) → the visit (a film) → P4 the
       kneel and the bow → P5 what he tells him (the 5.2 pick) → P6 the examination (a film) → P7 the clearing (a film,
       the fog lifts) → P8 the warning → the decision. Every beat on the chapter clock (wall time, v7.1), every line
       through the queue, one voice at a time; each beat's receipt in the phase string, so a Continue lands where a
       reload would. */
    const PHASES = ['shop', 'night', 'visit', 'clearing', 'decide'];
    let phase = 'shop';
    let booted = false, preplaced = '';
    const dayClock = { t: 0 };
    let lastWall = 0, pausedAt = 0;
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    const heard = new Set();
    const speak = { until: 0, pending: null, voiceTo: 0 };
    function speakReset() { speak.until = 0; speak.pending = null; speak.voiceTo = 0; }
    /* A LINE IS A BEAT, HEARD OR NOT (e3c3's law): a muted game speaks it silently on its own length, a line whose bytes
       have not landed is held a moment (v8.0) and then spoken silently — so a beat chained on a line never stops */
    function sayLine(name, vol = 1, onStart, pan) {
      if (dayClock.t < speak.until) return false;
      const start = () => { speak.voiceTo = dayClock.t + (SECS[name] || 2.5); speak.until = speak.voiceTo + 0.25; heard.add(name); if (onStart) onStart(); };
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
    /* one line, its speaker on his talking take for the line's own length */
    function line(name, P, vol = 1) { queueLine(name, () => { if (P) personTalk(P, (SECS[name] || 2.5) * 0.92); }, vol); }

    const W = DATA.words;
    const play = {
      run: 0, busy: false,
      searched: new Set(), wallet: false,                                   // P1
      shapeSeen: false, revealed: false, how: '', watchAt: 0, noteOn: false, // P2 (how: 'light' | 'watch' | 'walk')
      knelt: false, bowed: false, bow: null, told: '', examined: false, cleared: false, warned: false,
      piece: 'nangkwak', turning: null
    };
    const PIECES = ['nangkwak', 'takrut', 'phayant'];
    /* THE RECEIPT IS THE PHASE STRING (v7.3): every beat that counts, so a Continue lands where it was */
    function mark() {
      const t = [];
      if (play.how) t.push('h' + play.how[0]);
      if (play.revealed) t.push('r');
      if (play.knelt) t.push('k');
      if (play.bowed) t.push('b');
      if (play.told) t.push('t' + play.told);
      if (play.examined) t.push('x');
      if (play.cleared) t.push('c');
      t.push('p' + play.piece);
      return t.join(',');
    }
    function readMark(p0) {
      const [p1, tag = ''] = String(p0 || '').split(':');
      const p = PHASES.includes(p1) ? p1 : 'shop', f = new Set(tag.split(',').filter(Boolean));
      const how = f.has('hl') ? 'light' : f.has('hw') ? 'watch' : f.has('hk') ? 'walk' : '';
      const told = ['A', 'B', 'C', 'D'].find(k => f.has('t' + k)) || '';
      const piece = PIECES.find(k => f.has('p' + k)) || '';
      return { p, how, told, piece, revealed: f.has('r'), knelt: f.has('k'), bowed: f.has('b'), examined: f.has('x'), cleared: f.has('c') };
    }
    let worldRun = 0, wDark = false, decOpen = false;
    function setPhase(p, opts) { phase = p; if (kit) kit.setPhase(p + ':' + mark()); objectiveFor(p, opts); }
    function saveMark() { if (kit) kit.setPhase(phase + ':' + mark()); }        // a beat inside a phase banks its receipt the moment it counts
    /* the orders (§4.1, §4.3). `complete: false` where the change is not his doing (the v8.7 lie) */
    function objectiveFor(p, opts) {
      if (!kit) return;
      if (wDark) { kit.objective(null, { complete: false }); kit.waypoint(null); return; }
      let o = null, wp = null;
      if (p === 'shop') { o = play.wallet ? null : play.objBlur ? null : W.objWallet;
        if (!play.wallet && play.searched.size >= 3) wp = { x: (FRIDGE.x0 + FRIDGE.x1) / 2, y: 1.0, z: FRIDGE.z - 0.1 }; }
      else if (p === 'night') {
        if (!play.shapeSeen) { o = W.objClose; wp = { x: 1.0, y: 1.1, z: SHOP.z1 - 0.15 }; }   // the shutter's pull: the way to it passes the stand
        else if (!play.revealed) o = W.bannerShape;
        else if (play.noteOn) { o = W.objCall; wp = { x: NOTE.x, y: COUNTER.h + 0.25, z: NOTE.z }; }
      }
      else if (p === 'clearing') {
        if (!play.knelt) o = W.objKneel;
        else if (!play.bowed && !play.busy) o = W.objBow;
        else if (play.examined && !play.cleared && !play.busy) o = W.objBowHead;
      }
      kit.objective(o, opts);
      kit.waypoint(wp);
    }
    let lookName = 'DAY';
    function look(name, secs = 0) { if (kit) kit.daylight(PRESETS[name] || null, secs); lookName = name; }
    /* THE FOG in play (§5): the cold's blur and drained colour, grey, and the smear — on, or eased off */
    function fog(on, secs = 1.2) {
      if (!kit) return;
      if (kit.chill) kit.chill(on ? FOG.chill : 0, { secs, tint: 'grey', cine: false });
      if (kit.smear) kit.smear(on ? FOG.smear : 0, { secs });
    }
    function openDecision() { decOpen = true; if (getState() === 'play') startDecision(); }
    /* the receipt is the note (v7.3): a note banked once, whatever a Continue replays — and the awareness with it */
    function bank(note, a = 0) {
      if (!kit || !note) return;
      const got = kit.getConduct ? kit.getConduct().notes : [];
      if (!got.includes(note)) kit.conduct({ note, s: 0, a });
    }
    const live = (run) => alive && run === play.run;
    /* a one-shot that waits for its bytes (a long sound decoded late is still the sound); muted, it is not waited for */
    function sfxReady(name, vol, keep, wait = 3) {
      const run = play.run, t0 = wallNow();
      const go = () => {
        if (!live(run) || (soundOff && soundOff())) return;
        const s2 = worldSfx ? worldSfx(name, vol) : null;
        if (s2) { if (keep) keep(s2); return; }
        if (wallNow() - t0 < wait) setTimeout(go, 100);
      };
      go();
    }
    /* THE SOUNDS PLAY ASKS FOR, warmed so the first of each is heard (CP13 of chapter 1: nothing warmed is silence) */
    const WARM_SHOP = ['q2till', 'q2bag', 'q2jacket', 'q2where', 'q2fridge', 'x2drawer', 'x2bagzip', 'x2cloth', 'x2fridge', 'x2wallet'];
    const WARM_NIGHT = ['q2flowers', 'q2note', 'x2switch', 'x2rustle', 'x2breath', 'x2ledhum'];
    const WARM_CLEAR = ['lc2sit', 'lc2tell', 'q2tA', 'q2tB', 'q2tC', 'q2tD', 'lc2tA', 'lc2tB', 'lc2tC', 'lc2tD', 'lc2w1', 'pg2w1', 'x2kneel', 'x2bow'];
    if (warmSounds) warmSounds(WARM_SHOP.concat(WARM_NIGHT));

    /* ---------------------------------------------------------------- the floor's marks (the kneeling place) */
    const kneelZone = (() => {
      const g = new THREE.Group(); g.position.set(CL.x, MAT_TOP + 0.02, CL.z); g.visible = false; g.userData.dyn = true; worldS.add(g);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(0.4, 32), B({ color: 0xf2c46a, transparent: true, opacity: 0.2, depthWrite: false, fog: false }));
      disc.rotation.x = -Math.PI / 2; g.add(disc);
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.36, 0.43, 40), B({ color: 0xffd98a, transparent: true, opacity: 0.8, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
      ring.rotation.x = -Math.PI / 2; ring.position.y = 0.003; g.add(ring);
      const wave = new THREE.Mesh(new THREE.RingGeometry(0.38, 0.43, 40), B({ color: 0xffd98a, transparent: true, opacity: 0.7, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
      wave.rotation.x = -Math.PI / 2; wave.position.y = 0.005; g.add(wave);
      g.userData.parts = { disc, ring, wave };
      return g;
    })();
    function zoneTick(now) {
      if (!kneelZone.visible) return;
      const { disc, ring, wave } = kneelZone.userData.parts, k = (now % 2) / 2;
      wave.scale.setScalar(1 + k * 0.9); wave.material.opacity = 0.7 * (1 - k);
      ring.material.opacity = 0.6 + 0.3 * Math.sin(now * 3.1); disc.material.opacity = 0.16 + 0.08 * Math.sin(now * 3.1);
    }
    /* a glide and a turn to a heading, the eye easing to its height (chapter 1's) */
    const smooth = (u) => u * u * (3 - 2 * u);
    function turnTo(to, secs, o, done) {
      play.turning = { t: 0, from: yaw.rotation.y, to, secs, y: o.y, span: o.span, lo: o.lo, hi: o.hi, done,
                       pos: o.pos || null, p0: { x: yaw.position.x, z: yaw.position.z }, pitch: o.pitch, pt0: pitch.rotation.x };
    }
    function turnTick(wdt) {
      const T2 = play.turning; if (!T2) return;
      T2.t += wdt / T2.secs;
      const k = smooth(Math.min(1, T2.t));
      let d = T2.to - T2.from; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
      yaw.rotation.y = T2.from + d * k;
      if (T2.pos) { yaw.position.x = T2.p0.x + (T2.pos.x - T2.p0.x) * k; yaw.position.z = T2.p0.z + (T2.pos.z - T2.p0.z) * k; }
      if (T2.pitch != null) pitch.rotation.x = T2.pt0 + (T2.pitch - T2.pt0) * k;
      if (kit) kit.pose('lying', { y: T2.y, yaw: yaw.rotation.y, span: 0.02, pitchLo: Math.min(T2.lo, pitch.rotation.x - 0.01), pitchHi: Math.max(T2.hi, pitch.rotation.x + 0.01), secs: 0.9 });
      if (T2.t >= 1) {
        play.turning = null;
        if (kit) kit.pose('lying', { y: T2.y, yaw: T2.to, span: T2.span, pitchLo: T2.lo, pitchHi: T2.hi, secs: 0.05 });
        if (T2.done) T2.done();
      }
    }

    /* ================================================================ P1 · THE WALLET (noon, the fog)
       The till, his bag, his jacket: each shows it is not there, and the order's own words go and come back between them
       (the fog eats the line, never the marker); after the three, the marker shows the drinks fridge — the wallet beside
       the water. No timer, no failure (§4.1 P1) */
    function shopStage() {
      look('DAY', 0); fog(true, 0.01);
      shopCtl.night(false); shopCtl.shutter(1, 0); shopCtl.lights(1, 0); shopCtl.ceiling(1, 0); shopCtl.lap('sales'); shopCtl.phone('');
      for (const P of [cast.lersi, cast.pong]) whenReady(P, (Q) => { Q.group.visible = false; });
      whenReady(cast.goldman, (Q) => { Q.group.visible = true; });
      props.lcThings.visible = false; props.note.visible = true; props.envelope.visible = false;
      pieceShow(true); lcBlockOn(false);
    }
    function shopBegin() {
      shopStage();
      setPhase('shop');
      if (warmSounds) warmSounds(WARM_SHOP);
    }
    const SEARCH = { till: ['q2till', 'x2drawer', (on) => shopCtl.till(on)], bag: ['q2bag', 'x2bagzip', (on) => shopCtl.bag(on)],
                     jacket: ['q2jacket', 'x2cloth', (on) => shopCtl.jacket(on)] };
    function search(k) {
      if (play.busy || play.wallet || play.searched.has(k) || !SEARCH[k]) return false;
      const [ln, fx, act] = SEARCH[k], run = play.run;
      play.busy = true;
      act(true); if (worldSfx) worldSfx(fx, 0.6);
      after(0.7, () => { if (!live(run)) return; line(ln); queueFn(() => {
        if (!live(run)) return;
        act(false); play.searched.add(k); play.busy = false;
        /* the fog eats the order's words and gives them back (never the marker) */
        play.objBlur = true; objectiveFor('shop', { complete: false });
        after(1.3, () => { if (!live(run)) return; play.objBlur = false;
          if (play.searched.size >= 3) { line('q2where'); queueFn(() => { if (live(run)) objectiveFor('shop', { complete: false }); }); }
          else objectiveFor('shop', { complete: false }); });
      }); });
      return true;
    }
    function fridgeOpen() {
      if (play.busy || play.wallet || play.searched.size < 3) return false;
      const run = play.run; play.busy = true;
      shopCtl.fridge(true); if (worldSfx) worldSfx('x2fridge', 0.65);
      after(1.0, () => { if (!live(run)) return; line('q2fridge'); queueFn(() => {
        if (!live(run)) return;
        props.wallet.visible = false; if (worldSfx) worldSfx('x2wallet', 0.6);
        after(0.8, () => { if (!live(run)) return; shopCtl.fridge(false); play.wallet = true; play.busy = false;
          objectiveFor('shop');                                  // done: OBJECTIVE COMPLETE, for the wallet found
          after(2.2, () => { if (live(run)) toNight(); }); });
      }); });
      return true;
    }

    /* ================================================================ P2 · THE SHAPE BY THE DOOR (closing time; the trial's 5.4)
       A cut in the black to closing time: the shutter half down, the ceiling off, the counter's LEDs low, the mall shut.
       He turns from his altar to close up: the Grand Opening stand inside the door is a tall shape in the dark and the
       fog, its ribbons lifting in the air-con's draft. The order gives way to what he sees (it never orders). Three ways,
       all the trial's good answers: switch on the light by the door (check calmly), stand still and watch it (observe and
       wait: the eyes adjust), or walk up to it. Then CALL PONG on the counter */
    function nightStage() {
      look('NIGHT', 0); fog(true, 0.01);
      shopCtl.night(true); shopCtl.shutter(0.42, 0); shopCtl.lights(0.28, 0); shopCtl.ceiling(0, 0); shopCtl.lap(''); shopCtl.phone('');
      for (const P of [cast.lersi, cast.pong, cast.goldman, cast.mallA, cast.mallB]) whenReady(P, (Q) => { Q.group.visible = false; });
      props.lcThings.visible = false; props.note.visible = true; props.wallet.visible = false; props.envelope.visible = false;
      pieceShow(true); lcBlockOn(false);
    }
    function toNight() {
      const run = ++worldRun;
      if (kit) { kit.root(false); kit.fade(1, 0.9); }
      wDark = true; objectiveFor('shop', { complete: false });
      if (worldSfx) after(0.9, () => { if (live(play.run)) worldSfx('x2shutter', 0.5); });   // in the black: the shutter brought half down
      setTimeout(() => {
        if (run !== worldRun || !alive) return;
        nightStage();
        yaw.position.set(HIS.x, yaw.position.y, HIS.z - 0.25); yaw.rotation.y = 0; pitch.rotation.x = 0;   // his back to the shop, at his altar
        if (kit) kit.pose('standing', { secs: 0.05 });
        play.shapeSeen = false; play.revealed = false; play.how = ''; play.noteOn = false;
        setPhase('night', { complete: false });
        const w = kit && kit.warm ? kit.warm() : Promise.resolve(0);
        w.then(() => { if (run !== worldRun || !alive) return; wDark = false; if (kit) kit.fade(0, 1.2); objectiveFor('night', { complete: false }); });
      }, 1100);
      if (warmSounds) warmSounds(WARM_NIGHT);
    }
    function nightBegin(resumed) {
      nightStage();
      /* a resume after the reveal: the light as he left it (switched on, or his eyes used to the dark) */
      if (resumed && play.revealed && play.how === 'light') { look('LIT', 0); shopCtl.lights(1, 0); shopCtl.ceiling(1, 0); }
      else if (resumed && play.revealed && play.how === 'watch') { look('LIT', 0); shopCtl.lights(0.6, 0); }
      setPhase('night', { complete: false });
      if (resumed && play.revealed) afterReveal(true);
    }
    const STAND_HEAD = { x: STAND.x, y: 1.5, z: STAND.z };
    const _nv2 = new THREE.Vector3();
    function nightTick(now) {
      if (play.revealed) return;
      if (!play.shapeSeen) {
        camera.updateMatrixWorld(); _nv2.set(STAND_HEAD.x, STAND_HEAD.y, STAND_HEAD.z).project(camera);
        const near = Math.hypot(yaw.position.x - STAND.x, yaw.position.z - STAND.z) < 2.6;
        if ((_nv2.z < 1 && Math.abs(_nv2.x) < 0.7 && Math.abs(_nv2.y) < 0.7) || near) {   // looked at, not caught at the frame's edge
          play.shapeSeen = true; props.sway = 1;
          const rel = angTo(yaw.rotation.y, Math.atan2(-(STAND.x - yaw.position.x), -(STAND.z - yaw.position.z)));
          if (worldSfx) { worldSfx('x2rustle', 0.55, 1, Math.max(-0.8, Math.min(0.8, -Math.sin(rel) * 0.8))); worldSfx('x2breath', 0.45); }
          after(0.7, () => objectiveFor('night', { complete: false }));
        }
        return;
      }
      /* walked up to it: close enough to see what it is */
      if (!play.busy && Math.hypot(yaw.position.x - STAND.x, yaw.position.z - STAND.z) < 1.15) reveal('walk');
    }
    function reveal(how) {
      if (play.revealed || play.busy) return false;
      const run = play.run; play.busy = true; play.how = how;
      if (how === 'light') { if (worldSfx) { worldSfx('x2switch', 0.7); worldSfx('x2ledhum', 0.35); }
        shopCtl.ceiling(1, 0.25); shopCtl.lights(1, 0.4); look('LIT', 0.35); }
      props.sway = 0;
      after(how === 'light' ? 0.9 : 0.5, () => { if (!live(run)) return;
        line('q2flowers');
        queueFn(() => { if (!live(run)) return; play.revealed = true; play.busy = false; kit && kit.root(false);
          bank(how === 'light' ? W.noteLight : how === 'watch' ? W.noteWatch : W.noteWalk);
          saveMark(); afterReveal(false); }); });
      return true;
    }
    /* STAND STILL AND WATCH (the trial's 5.4 D): he holds still, and for four seconds his eyes adjust — the fog thins a
       little round the dark, the ribbons settle in the draft — and the dried flowers show what the shape is */
    function watch() {
      if (play.revealed || play.busy) return false;
      const run = play.run; play.busy = true;
      if (kit) { kit.root(true); if (kit.chill) kit.chill(FOG.chill * 0.6, { secs: 3.2, tint: 'grey' }); }
      look('LIT', 4.5); shopCtl.lights(0.6, 3.5);
      props.sway = 0.2;
      after(4.0, () => { if (!live(run)) return; play.busy = false; reveal('watch');
        after(2.0, () => { if (live(run) && kit && kit.chill) kit.chill(FOG.chill, { secs: 2.5, tint: 'grey' }); }); });
      return true;
    }
    function afterReveal(resumed) {
      const run = play.run;
      if (!resumed) { line('q2note'); queueFn(() => { if (!live(run)) return; play.noteOn = true; objectiveFor('night', { complete: false }); }); }
      else { play.noteOn = true; objectiveFor('night', { complete: false }); }
    }
    /* THE CALL (§4.1 P3): a film from play; then the visit (a film) the next evening, and the clearing in play */
    function callPong() {
      if (!play.noteOn || play.called || play.busy || !kit || !kit.film) return false;
      play.called = true; play.busy = true;
      const ok = kit.film('call', { onDone: () => { play.busy = false; visitBegin(); } });
      if (!ok) { play.called = false; play.busy = false; }
      return !!ok;
    }
    function visitBegin() {
      setPhase('visit', { complete: false });
      if (warmSounds) warmSounds(WARM_CLEAR);
      const ok = kit && kit.film && kit.film('visit', { onDone: () => clearingBegin(false) });
      if (!ok) clearingBegin(false);
    }

    /* ================================================================ P4–P8 · THE CLEARING, IN HIS SHOP AT NIGHT
       Lersi Chin on his mat before the counter, the altar's Buddha over his shoulder; Pong on a stool at the side. */
    function clearStage(cleared) {
      look(cleared ? 'CLEAR' : 'VISIT', 0); fog(!cleared, 0.01);
      shopCtl.night(true); shopCtl.shutter(0.42, 0); shopCtl.lights(0.9, 0); shopCtl.ceiling(0, 0); shopCtl.lap(''); shopCtl.phone('');
      for (const P of [cast.goldman, cast.mallA, cast.mallB]) whenReady(P, (Q) => { Q.group.visible = false; });
      whenReady(cast.lersi, (P) => { P.group.visible = true; personPut(P, LC.x, LC.z, 0, 0); seatNow(P, true); lcPose(null, 0); });
      lcBlockOn(true);
      whenReady(cast.pong, (P) => { P.group.visible = true; personPut(P, PSTOOL.x, PSTOOL.z, PONG_RY, 0); seatNow(P, true); });
      props.lcThings.visible = true; props.matK = 1; props.note.visible = true; props.wallet.visible = false;
      pieceShow(!play.examined); props.cloth.userData.piece = play.examined;
      clothPiece(play.examined);
      for (const f of props.flames) f.material.opacity = play.examined ? 1 : 0;
    }
    function clearingBegin(resumed) {
      clearStage(play.cleared);
      if (!resumed) {
        yaw.position.set(-0.95, yaw.position.y, 1.25); yaw.rotation.y = Math.atan2(-(LC.x + 0.95), -(LC.z - 1.25)); pitch.rotation.x = -0.36;
        if (kit) kit.pose('standing', { secs: 0.05 });
        /* the visit film hands over on its black: lifted here, on the room it ended on */
        if (kit && kit.getFade && kit.getFade() > 0.01) kit.fade(0, 1.1);
      }
      kneelZone.visible = !play.knelt;
      setPhase('clearing', { complete: false });
      if (warmSounds) warmSounds(WARM_CLEAR);
      /* the coda's sounds: every ending cues them through one helper (codaCues), so no scene's own source names them and
         the engine's warm scan cannot find them — warmed here, written out, before any ending can play */
      if (warmSounds) warmSounds(['x2codamus', 'q2K1', 'q2K2', 'q2K3', 'q2K4', 'x2scroll', 'x2page', 'x2click', 'x2ping']);
    }
    const seatNow = (P, on) => { if (!P) return; P.seated = !!on; P.sitW = on ? 1 : 0; P.sitOff = null; P.walk = null; };
    function kneel(instant) {
      if (play.knelt && !instant) return false;                     // (a resume kneels him where the save says he knelt)
      play.knelt = true; kneelZone.visible = false;
      if (kit) kit.root(true);
      if (!instant && worldSfx) worldSfx('x2kneel', 0.6);
      if (instant) {
        yaw.position.x = CL.x; yaw.position.z = CL.z; yaw.rotation.y = faceLC(); pitch.rotation.x = -0.06;
        if (kit) kit.pose('lying', { y: KNEEL.y, yaw: faceLC(), span: KNEEL.span, pitchLo: KNEEL.lo, pitchHi: KNEEL.hi, secs: 0.05 });
        return true;
      }
      saveMark(); objectiveFor('clearing');
      turnTo(faceLC(), 1.0, Object.assign({ pos: { x: CL.x, z: CL.z }, pitch: 0.02 }, KNEEL), () => objectiveFor('clearing', { complete: false }));
      return true;
    }
    /* THE BOW (P4): three prostrations to the Buddha, his hands in añjali — the view lowered to the mat three times and
       brought back, laid on his look as a delta and taken off again (v11.1), then a wai to Lersi Chin */
    const BOW = { secs: 7.2, n: 3, depth: 1.0 };
    function bow() {
      if (play.bowed || play.busy || !play.knelt) return false;
      play.busy = true; objectiveFor('clearing');
      if (kit) { kit.pray(true, { secs: 0.9, y: -0.3 });
        kit.pose('lying', { y: KNEEL.y, yaw: faceLC(), span: 0.02, pitchLo: -1.4, pitchHi: KNEEL.hi, secs: 0.3 }); }
      play.bow = { t: 0, prev: 0, run: play.run };
      return true;
    }
    function bowTick(wdt) {
      const Bw = play.bow; if (!Bw) return;
      if (!live(Bw.run)) { play.bow = null; return; }
      const t0 = Bw.t; Bw.t += wdt;
      const one = BOW.secs / BOW.n, u = Math.min(1, Bw.t / BOW.secs);
      const ph = (Bw.t % one) / one, d = -BOW.depth * Math.pow(Math.sin(Math.PI * Math.min(1, ph * 1.15)), 2) * (u < 1 ? 1 : 0);
      pitch.rotation.x += d - Bw.prev; Bw.prev = d;
      for (let k = 0; k < BOW.n; k++) { const at = k * one + one * 0.35; if (t0 < at && Bw.t >= at && worldSfx) worldSfx('x2bow', 0.45); }
      if (u >= 1) {
        pitch.rotation.x -= Bw.prev; play.bow = null;
        if (kit) kit.pose('lying', { y: KNEEL.y, yaw: faceLC(), span: KNEEL.span, pitchLo: KNEEL.lo, pitchHi: KNEEL.hi, secs: 0.3 });
        bowDone();
      }
    }
    function bowDone() {
      const run = play.run;
      play.bowed = true; saveMark();
      /* the wai to Lersi Chin: the clasp held a moment toward him, and lowered; he returns it, then speaks */
      after(0.8, () => { if (!live(run)) return; if (kit) kit.pray(false, { secs: 1.2 });
        line('lc2sit', cast.lersi); queueGap(0.5); line('lc2tell', cast.lersi);
        queueFn(() => { if (live(run)) tellPick(); }); });
    }
    /* WHAT HE TELLS HIM (P5, the trial's 5.2 verbatim): a pick; his line, Lersi Chin's answer, and the trial's lesson banked
       in his own words with its awareness (awareness only: the decision's wisdom is kept for the decision, §2.2 #5) */
    const TELL_A = { A: 9, B: 6, C: 3, D: 6 };
    function tellPick() {
      const run = play.run;
      if (!kit || !kit.pick) { tellAnswer('A'); return; }
      kit.pick([{ id: 'A', label: W.pickA, color: '#3a7a5a' }, { id: 'B', label: W.pickB, color: '#3a5a8a' },
                { id: 'C', label: W.pickC, color: '#8a3a3a' }, { id: 'D', label: W.pickD, color: '#7a6a3a' }],
               { label: W.pickLabel, title: W.pickTitle })
        .then((id) => { if (live(run)) tellAnswer(id || 'A'); });
    }
    function tellAnswer(k) {
      const run = play.run;
      play.told = k; saveMark();
      bank(W['note52' + k], TELL_A[k] || 0);
      line('q2t' + k); queueGap(0.4); line('lc2t' + k, cast.lersi);
      queueFn(() => { if (live(run)) examBegin(); });
    }
    /* THE EXAMINATION (P6, a film) — at its end the piece is on the clean cloth, and out of his bag */
    function examBegin() {
      const run = play.run;
      const ok = kit && kit.film && kit.film('exam', { onDone: () => { if (live(run)) examDone(); } });
      if (!ok) examDone();
    }
    function examDone() {
      play.examined = true; play.busy = false;
      if (kit && kit.has && kit.take) for (const id of PIECES) if (kit.has(id)) kit.take(id);   // set on the cloth for a temple (§2.2 #6)
      pieceShow(false); clothPiece(true);
      for (const f of props.flames) f.material.opacity = 1;
      saveMark(); objectiveFor('clearing', { complete: false });
    }
    /* THE CLEARING (P7, a film he cannot skip the first time: kit.film's noSkip until the chapter is sealed once) */
    function bowHead() {
      if (!play.examined || play.cleared || play.busy || !kit || !kit.film) return false;
      const run = play.run; play.busy = true; objectiveFor('clearing');
      const sealed = ctx.sealedBefore ? ctx.sealedBefore('e4c2') : false;
      const ok = kit.film('clear', { noSkip: !sealed, onDone: () => { if (live(run)) clearDone(); } });
      if (!ok) { play.busy = false; return false; }
      return true;
    }
    function clearDone() {
      const run = play.run;
      play.cleared = true; play.busy = false; saveMark();
      fog(false, 0.01); look('CLEAR', 0);
      /* THE WARNING (P8): serious and kind; Pong to the shutter to wait outside; the decision opens */
      after(0.6, () => { if (!live(run)) return;
        line('lc2w1', cast.lersi); queueGap(0.6);
        queueFn(() => { if (!live(run)) return; whenReady(cast.pong, (P) => { personSit(P, false); personWalk(P, [[1.4, 1.6], [0.9, 2.5]], { speed: 0.9, ry: Math.PI }); }); });
        line('pg2w1', cast.pong);
        queueFn(() => { if (live(run)) decideBegin(false); }); });
    }
    function decideBegin(resumed) {
      setPhase('decide', { complete: false });
      if (resumed) after(0.6, openDecision); else openDecision();
    }
    /* the piece he took in chapter 1: on its shelf by the door (which one is his: the bag says, the save keeps it) */
    function pieceShow(on) { for (const k of PIECES) if (props.pieces[k]) props.pieces[k].visible = on && k === play.piece; }
    function clothPiece(on) {
      const pc = props.pieces[play.piece]; if (!pc) return;
      if (on) { if (pc.parent !== props.lcThings) { pc.userData.home = pc.userData.home || { p: pc.position.clone(), r: pc.rotation.clone(), parent: pc.parent };
                  props.lcThings.add(pc); }
                pc.position.set(props.cloth.position.x, props.cloth.position.y + 0.006, props.cloth.position.z); pc.rotation.set(0, -0.4, 0); pc.visible = true; }
      else if (pc.userData.home && pc.parent !== pc.userData.home.parent) { pc.userData.home.parent.add(pc); pc.position.copy(pc.userData.home.p); pc.rotation.copy(pc.userData.home.r); }
    }

    /* ---------------------------------------------------------------- the decision: Lersi Chin, on his mat */
    const _ndc = new THREE.Vector3();
    const INTERACT_R = 3.2;
    const PILE_POS = new THREE.Vector3(LC.x, 0, LC.z);
    const pile = new THREE.Group(); pile.position.copy(PILE_POS); world.add(pile);
    const pileLive = () => decOpen && phase === 'decide';
    function pileDist() { return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z); }
    function pileScreen() { camera.updateMatrixWorld(); return _ndc.set(PILE_POS.x, 0.9, PILE_POS.z).project(camera); }
    function pileInView() { if (!pileLive()) return false; const n = pileScreen(); return n.z < 1 && Math.abs(n.x) < 1.1 && Math.abs(n.y) < 1.1; }
    function pointerHitsPile() { return pileLive() && pileDist() < INTERACT_R; }
    function interactPile() { if (!pileLive()) return false; startDecision(); return true; }

    /* ---------------------------------------------------------------- the hotspots */
    const _hv = new THREE.Vector3();
    const markHit = (posF, frac = 0.1) => (x, y) => { const p = posF(); camera.updateMatrixWorld(); _hv.set(p.x, p.y, p.z).project(camera);
      return _hv.z < 1 && Math.hypot(x - _hv.x, (y - _hv.y) / Math.max(0.3, camera.aspect)) < frac; };
    const TILL_AT = { x: TILL.x, y: 1.05, z: TILL.z - 0.12 }, BAG_AT = { x: BAG.x, y: 0.95, z: BAG.z }, JACKET_AT = { x: STOOL.x, y: 1.1, z: STOOL.z };
    const FRIDGE_AT = { x: (FRIDGE.x0 + FRIDGE.x1) / 2, y: 0.95, z: FRIDGE.z - 0.12 }, NOTE_AT = { x: NOTE.x, y: COUNTER.h + 0.2, z: NOTE.z };
    const BUDDHA = { x: 0, y: 1.72, z: SHOP.z0 + 0.12 };
    const hotspots = [
      { id: 'till', pos: TILL_AT, radius: 1.7, prompt: W.hotTill, hits: markHit(() => TILL_AT),
        enabled: () => phase === 'shop' && !play.wallet && !play.busy && !wDark && !play.searched.has('till'), onInteract() { return search('till'); } },
      { id: 'bag', pos: BAG_AT, radius: 1.7, prompt: W.hotBag, hits: markHit(() => BAG_AT),
        enabled: () => phase === 'shop' && !play.wallet && !play.busy && !wDark && !play.searched.has('bag'), onInteract() { return search('bag'); } },
      { id: 'jacket', pos: JACKET_AT, radius: 1.7, prompt: W.hotJacket, hits: markHit(() => JACKET_AT),
        enabled: () => phase === 'shop' && !play.wallet && !play.busy && !wDark && !play.searched.has('jacket'), onInteract() { return search('jacket'); } },
      { id: 'fridge', pos: FRIDGE_AT, radius: 1.7, prompt: W.hotFridge, hits: markHit(() => FRIDGE_AT),
        enabled: () => phase === 'shop' && !play.wallet && !play.busy && !wDark && play.searched.size >= 3, onInteract() { return fridgeOpen(); } },
      { id: 'switch', pos: { x: SWITCH.x + 0.06, y: SWITCH.y + 0.25, z: SWITCH.z }, radius: 1.6, prompt: W.hotSwitch,
        hits: markHit(() => ({ x: SWITCH.x + 0.06, y: SWITCH.y, z: SWITCH.z })),
        enabled: () => phase === 'night' && play.shapeSeen && !play.revealed && !play.busy && !wDark, onInteract() { return reveal('light'); } },
      { id: 'watch', pos: STAND_HEAD, radius: 7, aim: 0.32, pressAim: true, mark: false, prompt: W.hotWatch,
        hits: markHit(() => STAND_HEAD, 0.16),
        enabled: () => phase === 'night' && play.shapeSeen && !play.revealed && !play.busy && !wDark, onInteract() { return watch(); } },
      { id: 'note', pos: NOTE_AT, radius: 1.8, prompt: W.hotNote, hits: markHit(() => NOTE_AT),
        enabled: () => phase === 'night' && play.noteOn && !play.called && !play.busy && !wDark, onInteract() { return callPong(); } },
      { id: 'kneel', pos: { x: CL.x, y: 1.0, z: CL.z }, radius: 2.4, prompt: W.hotKneel, mark: false,
        enabled: () => phase === 'clearing' && !play.knelt && !wDark, onInteract() { return kneel(false); } },
      { id: 'bow', pos: BUDDHA, radius: 6, anyView: true, prompt: W.hotBow,
        enabled: () => phase === 'clearing' && play.knelt && !play.bowed && !play.busy && !play.turning && !wDark, onInteract() { return bow(); } },
      { id: 'bowhead', pos: { x: LC.x, y: 0.95, z: LC.z }, radius: 3, anyView: true, prompt: W.hotBowHead,
        enabled: () => phase === 'clearing' && play.examined && !play.cleared && !play.busy && !wDark, onInteract() { return bowHead(); } }
    ];

    /* ---------------------------------------------------------------- the frame */
    let castLast = 0;
    function updateNotes(dt, t) {
      const now = wallNow();
      const raw = castLast ? Math.max(0, now - castLast) : 0, wdt = Math.min(0.5, raw); castLast = now;
      waiUpdate();
      peopleTick(now, wdt);                               // the cast's clocks run in films too (v5.19): only their looks wait for play
      shopFrame(now);
      const st = getState();
      mixBeds(Math.min(1, raw), st);
      const liveSt = st === 'play' || st === 'unlock' || st === 'choose';
      if (!booted && !preplaced && kit) { const w0 = preStage(kit.getPhase()); if (w0) preplaced = w0; }
      if (!liveSt) { if (!pausedAt) pausedAt = now; lastWall = 0; return; }
      /* a voice plays on under a panel while the chapter's clock stands still: its booking comes forward by the time
         the panel was up, as far as the voice's own end (e3c3's v21.21 law) */
      if (pausedAt) {
        const away = Math.max(0, now - pausedAt); pausedAt = 0;
        if (speak.voiceTo > dayClock.t) { const cut = Math.min(away, speak.voiceTo - dayClock.t); speak.until -= cut; speak.voiceTo -= cut; }
      }
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) { booted = true; applyPhase(kit ? kit.getPhase() : null); }
      runTodo(); runSpeak(); runQueue();
      playTick(now, wdt);
    }
    function playTick(now, wdt) {
      zoneTick(now);
      if (getState() !== 'play') return;
      mallPlay(now, phase === 'shop' && !wDark);                 // noon: the mall's people going by outside
      turnTick(wdt); bowTick(wdt);
      if (phase === 'night') nightTick(now);
      if (phase === 'clearing' && !play.knelt && kneelZone.visible && !wDark && Math.hypot(yaw.position.x - CL.x, yaw.position.z - CL.z) < 0.42) kneel(false);
    }
    /* ---- THE BEDS (§3.4): the mall by day (muffled: the fog's), the shop at night (the air-con, the fridge, the empty
       corridor), the fog's own music under play until the clearing, and the visit's after it — each eased; in a film the
       beds go down (every film cues its own sound, written to its pictures). The order is DATA.ambience.beds' */
    const MUS = { fog: 0.32, visit: 0.26 };
    const bedMix = { mall: 0, night: 0, fogmus: 0, visitmus: 0, mallclear: 0 };
    /* (v25.0 CP11) a film's own room: films.frame writes it from the film's clock (filmBedAt), films.end takes it off */
    const filmBed = { on: false, mall: 0, night: 0, mallclear: 0 };
    function mixBeds(wdt, st) {
      if (!(wdt > 0)) return;
      const want = { mall: 0, night: 0, fogmus: 0, visitmus: 0, mallclear: 0 };
      if (st === 'cine') {
        if (filmBed.on) { want.mall = filmBed.mall; want.night = filmBed.night; want.mallclear = filmBed.mallclear; }
      } else {
        if (phase === 'shop') { want.mall = 0.3; want.fogmus = MUS.fog; }
        else if (phase === 'night') { want.night = 0.3; want.fogmus = MUS.fog * 0.8; }
        else if (phase === 'clearing' || phase === 'decide' || phase === 'visit') {
          want.night = 0.24;
          if (play.cleared) want.visitmus = MUS.visit; else want.fogmus = MUS.fog * 0.5;
        }
      }
      for (const k in bedMix) bedMix[k] += (want[k] - bedMix[k]) * (1 - Math.exp(-wdt / (k === 'fogmus' || k === 'visitmus' ? 2.5 : 0.9)));
      const B2 = DATA.ambience.beds;
      B2[0][1] = bedMix.mall; B2[1][1] = bedMix.night; B2[2][1] = bedMix.fogmus; B2[3][1] = bedMix.visitmus;
      B2[4][1] = bedMix.mallclear;
    }
    function updatePile() {}
    function updateFire() {}
    function updateSlow() {}

    /* ------------------------------------------------------------ a resume (§9)
       A CONTINUE IS PLACED BEFORE THE CARD (the v4.8 contract): under the chapter card the saved moment's picture is set,
       so nothing jumps when play begins; applyPhase does it all again on the first live frame, idempotently */
    function preStage(p0) {
      const R = readMark(p0);
      if (R.piece) play.piece = R.piece;
      if (R.p === 'night') { nightStage(); yaw.position.set(HIS.x, yaw.position.y, HIS.z - 0.25); yaw.rotation.y = 0; pitch.rotation.x = 0; return 'night'; }
      if (R.p === 'clearing' || R.p === 'decide') {
        play.examined = R.examined; play.cleared = R.cleared || R.p === 'decide';
        clearStage(play.cleared);
        if (R.knelt || R.p === 'decide') { yaw.position.x = CL.x; yaw.position.z = CL.z; yaw.rotation.y = faceLC(); pitch.rotation.x = -0.06;
          if (kit) kit.pose('lying', { y: KNEEL.y, yaw: faceLC(), span: KNEEL.span, pitchLo: KNEEL.lo, pitchHi: KNEEL.hi, secs: 0.05 }); }
        return 'clearing';
      }
      return '';
    }
    function applyPhase(p0) {
      const R = readMark(p0);
      play.piece = R.piece || PIECES.find(k => kit && kit.has && kit.has(k)) || 'nangkwak';
      play.how = R.how; play.revealed = R.revealed; play.told = R.told;
      play.knelt = R.knelt; play.bowed = R.bowed; play.examined = R.examined; play.cleared = R.cleared;
      if (R.p === 'shop') { shopBegin(); return; }
      if (R.p === 'night') { play.shapeSeen = play.revealed; nightBegin(true); return; }
      if (R.p === 'visit') { visitBegin(); return; }
      if (R.p === 'decide') { play.knelt = play.bowed = play.examined = play.cleared = true; play.told = play.told || 'A'; }
      clearingBegin(play.knelt);
      if (play.knelt) kneel(true);
      if (R.p === 'decide') { decideBegin(true); return; }
      if (play.cleared) { decideBegin(true); return; }
      if (play.examined) { objectiveFor('clearing', { complete: false }); return; }
      if (play.told) { after(0.6, examBegin); return; }
      if (play.bowed) { after(0.6, () => tellPick()); return; }
    }


    /* ================================================================ (v25.0) THE BUILDERS RUN — every name they or a
       frame ask for is declared above (the v21.1 TDZ law); blockers are in their array before build() returns (v24.0) */
    buildShop();
    buildProps();
    buildCast();
    /* the shop was a film set in chapter 1 (World S, never walked): here he walks it, so what stands on its floor blocks
       him as drawn — the cabinets down both walls, the altar's cabinet and the two units beside it on the back wall, his
       stool and the customers' two (v5.03: columns from the floor) */
    for (const sx of [-1, 1]) solids.push(hidBox(0.44, 2.05, 2.8, sx * 2.17, 1.02, 0.7, worldS));
    solids.push(hidBox(SHRINE.w, SHRINE.h, SHRINE.d, 0, SHRINE.h / 2, SHOP.z0 + SHRINE.d / 2, worldS));
    for (const sx of [-1, 1]) solids.push(hidBox(BU.x1 - BU.x0, BU.H, BU.d, sx * (BU.x0 + BU.x1) / 2, BU.H / 2, SHOP.z0 + BU.d / 2, worldS));
    for (const [x, z] of [[STOOL.x, STOOL.z], [-1.15, PSTOOL.z], [PSTOOL.x, PSTOOL.z]]) solids.push(hidBox(0.4, 0.72, 0.4, x, 0.36, z, worldS));
    /* Lersi Chin on his mat: a blocker only while he sits there (its box emptied otherwise — the engine holds the same
       boxes, so the one box is opened and closed, never added) */
    const lcBlock = new THREE.Box3();
    const lcBlockOn = (on) => { if (on) { lcBlock.min.set(LC.x - 0.42, 0, LC.z - 0.4); lcBlock.max.set(LC.x + 0.42, 1.4, LC.z + 0.36); } else lcBlock.makeEmpty(); };
    lcBlockOn(false);

    const FL = { key: '', lit: '', stings: [], api: null, hand: null, shopOn: false, once: new Set() };
    const c01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v), smo = (k) => k * k * (3 - 2 * k), sgk = (t, a, b) => c01((t - a) / (b - a));
    const lp = (a, b, k) => a + (b - a) * k, lp3 = (a, b, k) => [lp(a[0], b[0], k), lp(a[1], b[1], k), lp(a[2], b[2], k)];
    const isNarrow = () => camera.aspect < 1;
    const _ffv = new THREE.Vector3(), _ffv2 = new THREE.Vector3();
    function fLook(name, secs = 0) { if (FL.lit !== name) { FL.lit = name; look(name, secs); } }
    /* a take played ONCE at a moment of the film's clock (v24.5): it was a window of a tenth of a second, and the film's
       clock steps up to half a second a frame — on a slow phone the window was stepped over and the gesture never played
       (Pa Noi's guavas in A, her card in B, her wave in C). Fired on the first frame at or past the moment, once a run,
       and not when a seek lands well past it */
    function onceAt(id, t, at, fn, span = 1.5) { if (t >= at && t < at + span && !FL.once.has(id)) { FL.once.add(id); fn(); } }
    function fLens(f) { if (Math.abs(camera.fov - f) > 1e-3) { camera.fov = f; camera.updateProjectionMatrix(); } }
    function camAt(p, q, roll = 0) {
      yaw.position.set(p[0], p[1], p[2]);
      const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2];
      yaw.rotation.y = Math.atan2(-dx, -dz); pitch.rotation.x = Math.atan2(dy, Math.hypot(dx, dz));
      camera.rotation.z = roll;
      stockLod();                                  // (v24.22) the stock's levels for THIS frame's lens, never the last one's (v25.0: one world)
    }
    /* where his FACE is, for a lens to frame: the head bone is the skull's base, 9 cm under the eyes, and a shot aimed
       at it put the eyes at the top of a phone's frame and cut them in the cab (CP9, by photograph) */
    function faceOf(P, fb) { const h = headOf(P, null); return h ? [h[0], h[1] + 0.08, h[2]] : fb; }
    /* where a person's head is (his look's target), or a fallback point */
    function headOf(P, fb) { if (P && P.ready && P.head && P.group.visible) { P.head.getWorldPosition(_ffv); return [_ffv.x, _ffv.y, _ffv.z]; } return fb; }
    function handOf(P, re) {
      if (!P || !P.ready || !P.model) return null;
      /* (v24.32: kept per hand — one cached bone answered every hand asked for after the first) */
      const hb = P.handBones || (P.handBones = {});
      if (!hb[re.source]) P.model.traverse(b => { if (b.isBone && re.test(b.name) && !hb[re.source]) hb[re.source] = b; });
      return hb[re.source] ? hb[re.source].getWorldPosition(new THREE.Vector3()) : null;
    }
    /* a person at a mark (a cut), standing or seated */
    function fPut(P, x, z, ry, o = {}) {
      if (!P || !P.ready) return;
      P.walk = null; P.filmWalk = 0; P.sitOff = null; P.group.visible = true;
      P.group.position.set(x, o.y != null ? o.y : (P.o.ground ? P.o.ground(x, z) : P.group.position.y), z);
      if (ry != null) { P.group.rotation.y = ry; P.turnTo = null; }
      if (o.seated != null && P.seated !== !!o.seated) seatNow(P, o.seated);
    }
    const faceTo = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);
    function pathLen(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }
    function pathAt(pts, s) {
      for (let i = 1; i < pts.length; i++) {
        const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        if (s <= d || i === pts.length - 1) { const f = d > 1e-6 ? c01(s / d) : 1; return [lp(pts[i - 1][0], pts[i][0], f), lp(pts[i - 1][1], pts[i][1], f)]; }
        s -= d;
      }
      return pts[0].slice();
    }
    /* a point `d` metres on from arc length `s`, carried straight on past the path's end (v24.5, L5-12: a walk looking 3 m
       ahead along its own path met its look at the path's end, and the view dived 45–84° in the last moments before the cut) */
    function pathAhead(pts, s, d) {
      const L = pathLen(pts); if (s + d <= L) return pathAt(pts, s + d);
      const a = pts[pts.length - 2], b = pts[pts.length - 1], dx = b[0] - a[0], dz = b[1] - a[1], n = Math.hypot(dx, dz) || 1, over = s + d - L;
      return [b[0] + dx / n * over, b[1] + dz / n * over];
    }
    /* (v24.32) A WALK THE EYE CAN BEAR (Chad, of ending A: "when the camera tracks pong walking out, it is extremely jerky
       and awkward"). Measured on a phone (tools/probes/camtrack.mjs): the eye ran 15 m in six seconds round a path of
       straight legs — 3.8 m/s at its peak, a jog — so close behind Pong that his back filled a phone's frame, its view on
       his head (which bobs with his gait): it turned up to 168° a second, and 74 of its 180 frames changed their turn faster
       than 400°/s². A walk now is a smooth curve through its points (centripetal Catmull-Rom, sampled once at even
       spacing), walked at a man's pace from a standstill (walkS: 1.35 m/s, reached over its first second), with a step's
       bob counted from the ground covered (a step of 0.72 m) and a view on a point that does not bob. Every value a pure
       function of the film's clock (v6.4). */
    function walkCurve(pts, n = 64) {
      const c = new THREE.CatmullRomCurve3(pts.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal');
      return c.getSpacedPoints(n).map(v => [v.x, v.z]);
    }
    const walkS = (t, t0, v = 1.35, acc = 1.0) => { const u = Math.max(0, t - t0); return u < acc ? v * u * u / (2 * acc) : v * (u - acc / 2); };
    const walkV = (t, t0, v = 1.35, acc = 1.0) => { const u = Math.max(0, t - t0); return u < acc ? v * u / acc : v; };
    /* a person carried along a curve to arc length s at speed v (his heading the curve's, his gait at its speed) */
    function walkOn(P, pts, s, v) {
      if (!P || !P.ready) return;
      const L = pathLen(pts), a = pathAt(pts, Math.min(L, s)), f = pathAhead(pts, s, 0.5), b = pathAt(pts, Math.max(0, s - 0.5));
      P.walk = null; P.sitOff = null; P.group.visible = true;
      if (P.seated || P.sitW > 0) seatNow(P, false);
      P.group.position.set(a[0], P.o.ground ? P.o.ground(a[0], a[1]) : P.group.position.y, a[1]);
      if (v > 0.02) { const dx = f[0] - b[0], dz = f[1] - b[1]; if (dx * dx + dz * dz > 1e-6) { P.group.rotation.y = Math.atan2(dx, dz); P.turnTo = null; } }
      P.filmWalk = v;
    }
    /* (v24.32) an aim eased from one target to another by its DIRECTION, never by sliding the point: a point slid from a
       near target to a far one turns the view fastest at its near end — ending B's turn from Pa Noi 1.7 m off to the gate
       17 m off peaked at 101°/s and jerked at its start (camtrack). The two directions from the eye, slerped, turn at the
       ease's own rate. Answers a point 10 m out along the eased direction, for camAt */
    const _aeA = new THREE.Vector3(), _aeB = new THREE.Vector3(), _aeQ = new THREE.Quaternion(), _aeK = new THREE.Quaternion();
    function aimEase(eye, a, b, k) {
      _aeA.set(a[0] - eye[0], a[1] - eye[1], a[2] - eye[2]).normalize();
      _aeB.set(b[0] - eye[0], b[1] - eye[1], b[2] - eye[2]).normalize();
      _aeQ.setFromUnitVectors(_aeA, _aeB);
      _aeK.identity().slerp(_aeQ, c01(k));
      _aeA.applyQuaternion(_aeK);
      return [eye[0] + _aeA.x * 10, eye[1] + _aeA.y * 10, eye[2] + _aeA.z * 10];
    }
    /* (v24.32) a turn of the look by its own two angles — the bearing turned the way `side` says (+1 the way the bearing
       grows, −1 the other, 0 the shorter way) and the pitch between — for a turn of about a half circle (a look back
       over the shoulder, a turn round to walk on), where the shorter way round flips as the eye walks and a slerp may go
       over the top. Answers a point 10 m out, for camAt */
    function aimTurn(eye, a, b, k, side = 0) {
      const bA = Math.atan2(a[0] - eye[0], a[2] - eye[2]), bB = Math.atan2(b[0] - eye[0], b[2] - eye[2]);
      const pA = Math.atan2(a[1] - eye[1], Math.hypot(a[0] - eye[0], a[2] - eye[2]));
      const pB = Math.atan2(b[1] - eye[1], Math.hypot(b[0] - eye[0], b[2] - eye[2]));
      let d = angTo(bA, bB);
      if (side > 0 && d < 0) d += Math.PI * 2; else if (side < 0 && d > 0) d -= Math.PI * 2;
      const kk = c01(k), br = bA + d * kk, pt = lp(pA, pB, kk);
      return [eye[0] + Math.sin(br) * Math.cos(pt) * 10, eye[1] + Math.sin(pt) * 10, eye[2] + Math.cos(br) * Math.cos(pt) * 10];
    }
    /* the eye walking a curve: its place at arc length s, the step's bob (once a step, from the ground covered) and the
       stride's sway (once a stride, across the way), both in proportion to the pace; `ground` its floor */
    function walkEye(pts, s, v, ground) {
      const L = pathLen(pts), a = pathAt(pts, Math.min(L, s)), f = pathAhead(pts, s, 0.6);
      const k = Math.min(1, v / 1.35), ph = s / 0.72 * Math.PI * 2;
      const dx = f[0] - a[0], dz = f[1] - a[1], n = Math.hypot(dx, dz) || 1, sway = 0.006 * k * Math.sin(ph / 2);
      return [a[0] - dz / n * sway, ground(a[0], a[1]) + 1.62 + 0.012 * k * (1 - Math.cos(ph)) / 2, a[1] + dx / n * sway];
    }
    /* a person walked along points by the film's clock: his place at t, his heading the path's (eased over half a metre
       either side, so a corner is walked); the gait plays while he moves (peopleTick reads P.filmWalk, his speed) */
    function fWalk(P, pts, t0, t1, t, o = {}) {
      if (!P || !P.ready) return;
      const L = pathLen(pts), k = sgk(t, t0, t1), s = (o.linear ? k : smo(k)) * L;
      const a = pathAt(pts, s), f = pathAt(pts, Math.min(L, s + 0.5)), b = pathAt(pts, Math.max(0, s - 0.5));
      P.walk = null; P.sitOff = null; P.group.visible = true;
      if (P.seated || P.sitW > 0) seatNow(P, false);
      P.group.position.set(a[0], o.y != null ? o.y : (P.o.ground ? P.o.ground(a[0], a[1]) : P.group.position.y), a[1]);
      const moving = t > t0 && t < t1;
      P.filmWalk = moving ? (L / Math.max(0.2, t1 - t0)) * (o.linear ? 1 : 1.3) : 0;
      if (moving) { const dx = f[0] - b[0], dz = f[1] - b[1]; if (dx * dx + dz * dz > 1e-6) { P.group.rotation.y = Math.atan2(dx, dz); P.turnTo = null; } }
      else if (t >= t1 && o.ry != null) P.group.rotation.y = o.ry;
      else if (t <= t0 && o.ry0 != null) P.group.rotation.y = o.ry0;
    }

    /* ---- (v25.0) THE MALL'S PEOPLE on a film's clock: each walks its line through its shot and is hidden either side of
       it (and in every shot that is not theirs), so a skip, a seek or a replay lands the same corridor; at noon in play
       they pass on the wall clock, two of them on their own rounds (Chad, 2 Nov: "show real people walking past") */
    const MALL = { open: [['mallA', [[6.4, 4.4], [-6.4, 4.4]], 0.8, 10.0], ['mallB', [[-6.4, 6.6], [6.4, 6.6]], 19.6, 28.8]],
                   A: [['mallA', [[6.4, 4.5], [-6.4, 4.5]], END.A.days, END.A.days + 9.2], ['mallB', [[-6.4, 6.7], [6.4, 6.7]], END.A.call + 9.0, END.A.call + 18.2]],
                   D: [['mallA', [[-6.4, 4.6], [6.4, 4.6]], END.D.last - 1.2, END.D.last + 8.0], ['mallB', [[6.4, 6.8], [-6.4, 6.8]], END.D.last + 0.4, END.D.last + 9.6]] };
    function mallPass(scene, t) {
      for (const k of ['mallA', 'mallB']) {
        const P = cast[k]; if (!P) continue;
        const row = (MALL[scene] || []).find(rw => rw[0] === k && t >= rw[2] && t <= rw[3]);
        if (!row || !P.ready) { if (P.group) P.group.visible = false; P.filmWalk = 0; continue; }
        fWalk(P, row[1], row[2], row[3], t, { linear: true });
      }
    }
    const MALL_PLAY = { mallA: { per: 19, walk: 10.5, line: [[6.4, 4.3], [-6.4, 4.3]], off: 3 }, mallB: { per: 26, walk: 11.5, line: [[-6.4, 6.7], [6.4, 6.7]], off: 11 } };
    function mallPlay(now, on) {
      for (const k in MALL_PLAY) {
        const P = cast[k], R = MALL_PLAY[k]; if (!P || !P.ready) continue;
        const u = ((now + R.off) % R.per);
        if (!on || u > R.walk) { P.group.visible = false; P.filmWalk = 0; continue; }
        fWalk(P, R.line, 0, R.walk, u, { linear: true });
      }
    }
    /* who is speaking a line of the film's at t: his talking take, read off the film's own cues (a chant is not talk) */
    const SPEAKS = { pg: 'pong', lc: 'lersi' };
    const CHANTS = new Set(['lc2namo', 'lc2sak1', 'lc2sak2', 'lc2sak3']);
    function speakerNow(who) {
      const P = cast[who]; if (!P || !P.ready) return null;
      let vis = P.group.visible; for (let q = P.group.parent; vis && q && q !== world; q = q.parent) vis = q.visible;
      return vis ? P : null;
    }
    function fTalk(t) {
      for (const s of FL.stings) {
        const sp = SPEAKS[String(s.kind).slice(0, 2)]; if (!sp || CHANTS.has(s.kind) || /^pg2c|^pg2A/.test(s.kind)) continue;   // (Pong on the phone is not in the room)
        const d = SECS[s.kind]; if (!d || t < s.at || t > s.at + d) continue;
        const P = speakerNow(sp); if (P) P.talkUntil = wallNow() + 0.25;
      }
    }

    /* (the look at the lens, a thing in his right hand, letting go, his wai — chapter 1's, as they were) */
    /* a person looking at the lens in a film: the look is the FILM's, so it is on at once (a seek or a skip lands on it —
       CP9, by photograph: a seek arrived before Pong's eased look had turned his head, and he talked to the ceiling) and
       the neck may turn as far as a seated man turns to the person beside him; off, he goes back to what he watched */
    function gaze(P, on, neck = 1.25) {
      if (!P) return;
      if (on) { P.lookAt = camera; P.neck = neck; P.lookW = 1; }
      else if (P.lookAt === camera) { P.lookAt = P.lookHome || null; P.neck = null; }
    }
    /* a thing held in his right hand, in the hands' own pass (kit.hold's place: the palm, noteProp's frame) */
    const PALM = [0.012, -0.052, -0.148], _hhv = new THREE.Vector3();
    function handHold(obj, o = {}) {
      const A = FL.api; if (!A || !A.armR) return;
      if (FL.hand && FL.hand !== obj) { A.armR.remove(FL.hand); FL.hand.visible = false; }
      if (!obj) { FL.hand = null; return; }
      if (obj.parent !== A.armR) { if (obj.parent) obj.parent.remove(obj); A.armR.add(obj); }
      obj.position.set(PALM[0] + (o.dx || 0), PALM[1] + (o.dy || 0), PALM[2] + (o.dz || 0));
      obj.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0);
      /* a thing he LOOKS AT in his hand faces the lens (the card): its front turned onto the hands' camera, then tipped
         back by `tilt` and turned over by `flip` about its own upright (CP9, measured: held at a fixed turn in the arm's
         frame the card stood EDGE-ON to the lens — its face 87° off the line of sight — in every grip, and no photograph
         of either card shot ever showed it) */
      /* `lens`: placed from the PALM in the lens's own frame (metres: +x right, +y up, −z ahead), so a thing held up out
         of a closed hand stands where the screen needs it whichever grip and depth the hand is at */
      if (o.lens && A.vmCam) {
        A.armR.updateWorldMatrix(true, false); A.vmCam.updateMatrixWorld();
        const pw = A.vmCam.worldToLocal(A.armR.localToWorld(_hhv.set(PALM[0], PALM[1], PALM[2])));
        pw.x += o.lens[0]; pw.y += o.lens[1]; pw.z += o.lens[2];
        obj.position.copy(A.armR.worldToLocal(A.vmCam.localToWorld(pw)));
      }
      /* `screen`: [x, y, depth] — at that point of THIS screen (−1…1 across and up) that many metres from the lens: a
         thing he holds up to read stands where every screen shape sees it, just above the hand that holds it */
      if (o.screen && A.vmCam) {
        A.armR.updateWorldMatrix(true, false); A.vmCam.updateMatrixWorld();
        const [nx, ny, d] = o.screen, th = Math.tan(A.vmCam.fov * Math.PI / 360);
        _hhv.set(nx * d * th * A.vmCam.aspect, ny * d * th, -d);
        obj.position.copy(A.armR.worldToLocal(A.vmCam.localToWorld(_hhv)));
      }
      if (o.face && A.vmCam) {
        A.vmCam.updateMatrixWorld(); obj.lookAt(_hhv.setFromMatrixPosition(A.vmCam.matrixWorld));
        if (o.tilt) obj.rotateX(o.tilt);
        if (o.flip) obj.rotateY(o.flip);
      }
      obj.visible = true; FL.hand = obj;
      if (A.handsRoot) A.handsRoot.visible = true;
      A.armR.visible = true;
    }
    function gripOff() { const A = FL.api; if (FL.grip && A && A.handPose) A.handPose(null, 0); FL.grip = false; }
    function handFree() {
      const A = FL.api;
      gripOff();
      if (FL.hand && A && A.armR) { A.armR.remove(FL.hand); FL.hand.visible = false; world.add(FL.hand); }
      FL.hand = null;
      /* a film shows his hands only while they hold something or make the wai */
      if (A && A.handsRoot && FL.key && !FL.wai) A.handsRoot.visible = false;
    }
    /* THE WAI in a film (A after the pao, D before he speaks and when the master returns it): the clasp risen from under
       the frame to play's own height (k 0 → 1). The arm's pose is kept and given back when it goes down, and the left
       hand put away, so the next thing he holds is held as before. */
    function waiAt(k) {
      const A = FL.api; if (!A || !A.handsPose || !A.armR) return;
      if (k <= 0.001) {
        if (FL.wai) {
          FL.wai = false;
          A.armR.position.copy(FL.waiPos); A.armR.quaternion.copy(FL.waiQ);
          const L = A.prayerArm && A.prayerArm(); if (L) L.visible = false;
          if (A.handsRoot && !FL.hand && FL.key) A.handsRoot.visible = false;
        }
        return;
      }
      if (!FL.wai) { FL.wai = true; FL.waiPos = A.armR.position.clone(); FL.waiQ = A.armR.quaternion.clone(); }
      if (A.handsRoot) A.handsRoot.visible = true;
      A.handsPose(0, 0, { y: lp(-0.72, -0.33, smo(k)) });
    }

    /* ---------------------------------------------------------------- (v25.0) the films' own helpers */
    const KN_EYE = [CL.x, KNEEL.y, CL.z];                               // his eye kneeling before Lersi Chin
    const BUDDHA_AT = [BUDDHA.x, BUDDHA.y, BUDDHA.z];
    const LC_HEAD = () => faceOf(cast.lersi, [LC.x, 0.74, LC.z]);
    const PG_HEAD = () => faceOf(cast.pong, [PSTOOL.x, 1.42, PSTOOL.z]);
    const UNDER = [0.3, 1.0, SHOP.z1 + 0.6];                             // under the shutter's edge, the corridor's light
    const top0 = COUNTER.h + 0.046;                                      // the counter's glass
    function shot(eye, at, fPhone, fDesk, roll = 0) { fLens(isNarrow() ? fPhone : fDesk); camAt(eye, at, roll); }
    /* the fog in a film: the cold's blur and grey, laid over a scene (kit.chill's `cine`) — a film draws no smear */
    function fogFilm(k) { if (kit && kit.chill) kit.chill(FOG.cine * c01(k), { secs: 0.01, cine: true, tint: 'grey' }); }
    /* a prop's moving part, set absolute (a film's picture is a function of its clock, v6.4) */
    function propsAt(o) {
      for (const k of ['till', 'bag', 'jacket', 'fridge']) if (o[k] != null) { props[k + 'K'] = o[k]; props[k + 'To'] = o[k]; }
      if (o.mat != null) { props.matK = o.mat; props.matTo = o.mat; }
    }
    function shopAt(o) {
      if (o.u != null) { shop.t1 = 0; shop.u = o.u; shop.uTo = o.u; }
      if (o.led != null) { shop.l1 = 0; shop.ledK = o.led; shop.ledTo = o.led; }
      if (o.ceil != null) { props.c1 = 0; props.ceilK = o.ceil; props.ceilTo = o.ceil; }
      if (o.night != null && props.night !== !!o.night) shopCtl.night(o.night);
    }
    /* who is in the shop for a shot (each set every frame, so a cut or a seek lands on the same room) */
    function castVis(o) {
      for (const k in o) { const P = cast[k]; if (P && P.ready) P.group.visible = !!o[k]; }
      if (o.lersi != null) lcBlockOn(!!o.lersi && cast.lersi && cast.lersi.seated);
    }
    /* Lersi Chin seated on his mat, as play keeps him */
    function lcSeated() { const P = cast.lersi; if (!P || !P.ready) return; fPut(P, LC.x, LC.z, 0, { y: 0, seated: true }); }
    function pongSeated() { const P = cast.pong; if (!P || !P.ready) return; fPut(P, PSTOOL.x, PSTOOL.z, PONG_RY, { y: 0, seated: true }); }
    /* Pong at the shutter (P8: "Bro, I wait outside"), turned into the shop */
    const PONG_DOOR = { x: 0.9, z: 2.5 };
    function pongDoor() { const P = cast.pong; if (!P || !P.ready) return; fPut(P, PONG_DOOR.x, PONG_DOOR.z, faceTo(PONG_DOOR.x, PONG_DOOR.z, CL.x, CL.z), { y: 0, seated: false }); }
    /* his phone IN HIS HAND (the call, ending A): its own body, the counter phone's screen (one material, so the same
       drawing lights both); the counter's phone goes dark and away while this one is held */
    const handPhone = (() => {
      const g = new THREE.Group(); g.visible = false; g.userData.dyn = true; world.add(g);
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.076, 0.158, 0.009), M({ color: 0x18181c, roughness: 0.25, metalness: 0.4 })); g.add(body);
      if (shop.phone) { const sc = new THREE.Mesh(new THREE.PlaneGeometry(0.068, 0.148), shop.phone.scr); sc.position.z = 0.0048; g.add(sc); }
      return g;
    })();
    /* the piece in his hand (the examination's fetch) and in Lersi Chin's (his wai over it): clones of the one on the
       shelf, made the first time they are wanted (the model is in by then; the curtain waits for it) */
    const held = { hand: null, lc: null, amulet: null };
    function pieceClone(slot) {
      const src = props.pieces[play.piece]; if (!src) return null;
      if (!held[slot] || held[slot].userData.piece !== play.piece) {
        if (held[slot] && held[slot].parent) held[slot].parent.remove(held[slot]);
        const c = src.clone(true); c.visible = false; c.userData.piece = play.piece; c.userData.dyn = true; world.add(c); held[slot] = c;
      }
      return held[slot];
    }
    /* a cased amulet from his tray (ending D: the customer's question answered) */
    const amuletHand = (() => { const g = new THREE.Group(); g.visible = false; g.userData.dyn = true; world.add(g); fitModel('e4somdej', g, 0.062, 'y', 0, 0); return g; })();
    /* the holy water from the mayom's leaves: a few drops falling through his view, a pure function of the film's clock */
    const drops = (() => {
      const g = new THREE.Group(); g.visible = false; g.userData.dyn = true; world.add(g);
      const m = B({ color: 0xe8f2f8, transparent: true, opacity: 0.55, depthWrite: false, fog: false });
      const geo = new THREE.PlaneGeometry(0.004, 0.05);
      for (let i = 0; i < 14; i++) { const d = new THREE.Mesh(geo, m); d.userData.seed = i; g.add(d); }
      return g;
    })();
    function dropsAt(t, t0, t1, eye) {
      if (t < t0 || t > t1) { drops.visible = false; return; }
      drops.visible = true;
      const r = rng(9917);
      drops.children.forEach((d, i) => {
        const flick = t0 + (i % 3) * ((t1 - t0) / 3) + r() * 0.3, u = t - flick;
        if (u < 0 || u > 0.9) { d.visible = false; return; }
        d.visible = true;
        d.position.set(eye[0] + (r() - 0.5) * 0.7, eye[1] + 0.35 - u * u * 4.9 - r() * 0.1, eye[2] - 0.3 - r() * 0.25);
        d.lookAt(camera.position.x, d.position.y, camera.position.z);
      });
    }
    /* the white thread on his wrist (the clearing's last gesture): a cotton loop on the right arm, drawn in the hands' pass */
    const wristThread = (() => {
      const g = new THREE.Group(); g.visible = false; g.userData.dyn = true;
      for (let k = 0; k < 3; k++) { const tr = new THREE.Mesh(new THREE.TorusGeometry(0.031, 0.0016, 5, 28), M({ color: 0xf6f4ec, roughness: 0.85 }));
        tr.rotation.y = Math.PI / 2; tr.position.x = (k - 1) * 0.0045; g.add(tr); }
      return g;
    })();
    const WRIST = [0.012, -0.03, -0.075];                                // the wrist, in the arm's own frame (a little behind the palm)
    /* (v25.0 CP7) the world point at a share (fx, fy) of the lens's frame, d metres out, for a lens of fovDeg — where a
       hand the engine places by its share of the frame (HPOSE) stands on THIS screen */
    const _lpv = new THREE.Vector3();
    /* (v25.0 CP7) a held thing turned so its +x runs along `ax` and its +y (the mayom's face) as near `up` as that allows;
       holdHome gives it back its own turn when it is let go */
    const _ox = new THREE.Vector3(), _oy = new THREE.Vector3(), _oz = new THREE.Vector3(), _om = new THREE.Matrix4();
    function orient(obj, ax, up) {
      _ox.set(ax[0], ax[1], ax[2]).normalize();
      _oy.set(up[0], up[1], up[2]); _oy.addScaledVector(_ox, -_oy.dot(_ox)).normalize();
      _oz.crossVectors(_ox, _oy);
      obj.quaternion.setFromRotationMatrix(_om.makeBasis(_ox, _oy, _oz));
    }
    function lensPoint(fx, fy, d, fovDeg) {
      camera.updateWorldMatrix(true, false);
      const hh = d * Math.tan(fovDeg * Math.PI / 360), hw = hh * camera.aspect;
      _lpv.set(fx * hw, fy * hh, -d); camera.localToWorld(_lpv);
      return [_lpv.x, _lpv.y, _lpv.z];
    }
    function threadOn(on) {
      const A = FL.api; if (!A || !A.armR) return;
      if (on) { if (wristThread.parent !== A.armR) A.armR.add(wristThread); wristThread.position.set(WRIST[0], WRIST[1], WRIST[2]); wristThread.visible = true;
                if (A.handsRoot) A.handsRoot.visible = true; A.armR.visible = true; }
      else if (wristThread.parent) { wristThread.parent.remove(wristThread); wristThread.visible = false; }
    }
    /* HIS NOTEBOOK on the counter, open: the masters he has checked, some crossed out (the coda) — a drawn page laid on
       the shop's own book, drawn only when what it shows changes */
    const nBook = (() => {
      if (!shop.ledger) return null;
      const [c, x] = sized(cnv, 1024, 640), t = tex(done(THREE, c, false));
      const pg = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.29), M({ map: t, roughness: 0.85 })); pg.rotation.x = -Math.PI / 2; pg.position.y = 0.0135; pg.visible = false;
      shop.ledger.add(pg);
      return { pg, x, t, sig: '' };
    })();
    function namesAt(n) {
      if (!nBook) return;
      nBook.pg.visible = n >= 0;
      const sig = String(n); if (sig === nBook.sig || n < 0) return; nBook.sig = sig;
      drawNames(nBook.x, { n, words: DATA.words }); nBook.t.needsUpdate = true;
    }

    /* ================================================================ THE FILMS' PICTURES (§4), each a pure function of
       its own clock: every shot his eyes (he is never seen, Chad 9 Nov), named by what it must hold */

    /* O · THE FOG (§4.0): noon, the cases full, the grey on everything; a customer heard and never seen; his pockets; the
       note in his own hand */
    function openFrame(t) {
      const O = OPEN;
      fLook('DAY'); fogFilm(1);
      shopAt({ u: 1, led: 1, ceil: 1, night: false });
      propsAt({ till: 0, bag: 0, jacket: 0, fridge: 0 });
      shop.lapOn = 1; shop.lapMode = 'sales'; shop.phoneOn = 0;
      castVis({ goldman: true, lersi: false, pong: false });
      mallPass('open', t);
      const eye = [HIS.x + 0.12, 1.6, HIS.z + 0.18];
      if (t < O.o2) {
        /* O1 · from his place: along the right-hand cabinet's stock, full now, to the open front and the corridor — slow */
        const k = smo(sgk(t, 0.4, O.o2 - 0.2));
        shot(eye, aimEase(eye, [1.9, 1.15, -0.4], [0.5, 1.3, 4.8], k), 60, 52);
        return;
      }
      if (t < O.o3) {
        /* O2 · his eyes on the tray while she asks (never on her): the compartments under the glass; at "say again" they
           lift to the counter's front edge and fall back; at "I could not think properly" up to where she went */
        /* (v25.0 CP8) from the till's end of his place, the tray at his left hand: the laptop in front of him and the note
           by his phone both stay out of the frame on every screen (from his own place the laptop filled half a phone's) */
        const e1 = [HIS.x - 0.2, 1.56, HIS.z + 0.28];
        const tray = [-0.75, DISPLAY.floor, COUNTER.z - 0.04], edge = [-0.6, top0, COUNTER.z + COUNTER.d / 2];
        const kU = smo(sgk(t, O.q2o2b - 0.2, O.q2o2b + 0.8)) * (1 - smo(sgk(t, O.cu2a1b + 0.3, O.cu2a1b + 1.6)));
        const kOut = smo(sgk(t, O.q2o2 - 0.3, O.q2o2 + 2.4));
        let at = aimEase(e1, tray, edge, kU * 0.75);
        if (kOut > 0) at = aimEase(e1, at, [0.6, 1.35, 5.2], kOut);
        fLens(lp(isNarrow() ? 50 : 42, isNarrow() ? 44 : 36, sgk(t, O.o2, O.o3)));
        camAt([e1[0] - 0.05 * sgk(t, O.o2, O.o3), e1[1], e1[2]], at);
        return;
      }
      if (t < O.o4) {
        /* O3 · the counter's corner where his wallet always lies, by the calculator — empty; his pockets heard; then his
           bag on the floor at the counter's end */
        const spot = [0.2, top0, COUNTER.z - 0.06], bag = [BAG.x, 0.16, BAG.z];
        const kB = smo(sgk(t, O.o3 + 4.2, O.o3 + 6.0));
        const e2 = [HIS.x + 0.15, 1.55, HIS.z + 0.25];
        fLens(lp(isNarrow() ? 54 : 46, isNarrow() ? 50 : 42, smo(sgk(t, O.o3, O.o3 + 4.0))));
        camAt(e2, aimEase(e2, spot, bag, kB));
        return;
      }
      /* O4 · the note on the glass beside his phone, in his own hand: CALL PONG — pushed in on, the lens narrowing */
      const note = [NOTE.x, top0 + 0.001, NOTE.z], k = smo(sgk(t, O.o4, O.black));
      const e3 = lp3([HIS.x + 0.3, 1.5, HIS.z + 0.32], [NOTE.x - 0.02, 1.36, NOTE.z - 0.3], k);
      fLens(lp(isNarrow() ? 50 : 42, isNarrow() ? 36 : 28, k));
      camAt(e3, note);
    }

    /* P3 · THE CALL (a film from play, §4.1): his phone up, ringing; Pong; the dark shop while they talk; "Bring him." */
    function callFrame(t) {
      const C = CALL, lit = play.how === 'light';
      fLook(lit ? 'LIT' : 'NIGHT'); fogFilm(1);
      shopAt({ u: 0.42, led: lit ? 1 : 0.28, ceil: lit ? 1 : 0, night: true });
      castVis({ goldman: false, lersi: false, pong: false, mallA: false, mallB: false });
      const eye = [HIS.x + 0.15, 1.6, HIS.z + 0.35];
      if (t < C.ans + 0.7) {
        /* the phone from the counter into his hand, its screen calling; at the answer, up to his ear and out of the frame */
        shop.phoneMode = 'calling'; shop.phoneOn = wallNow() - t; shop.phoneSecs = null;
        if (shop.phone) shop.phone.g.visible = false;
        const kUp = smo(sgk(t, C.ans, C.ans + 0.6));
        handHold(handPhone, { screen: [lp(0.12, 0.9, kUp), lp(-0.28, 0.5, kUp), 0.42], face: true, tilt: -0.25 });
        shot(eye, lp3([0.1, top0, COUNTER.z - 0.1], [0.4, 1.2, 1.8], smo(sgk(t, C.ans - 0.2, C.ans + 0.8))), 56, 48);
        return;
      }
      handFree();
      shop.phoneMode = 'call'; shop.phoneSecs = t - C.ans;
      /* while they talk: the shop in the dark — the stand by the door (flowers now), then round to his altar's lamp under
         Pong's offer, down to the glass at "trust me", back up to the door at "I was there with my mother", and on the
         shutter's lit edge for "Bring him." */
      const door = [STAND.x - 0.1, 1.45, STAND.z], altar = [0, 1.55, SHOP.z0 + 0.2], glass = [0.0, top0, COUNTER.z + 0.1];
      let at;
      if (t < C.offer) at = aimEase(eye, [0.6, 1.3, 1.2], door, smo(sgk(t, C.ans + 0.7, C.q2c1 + 2.0)));
      else if (t < C.q2c2) at = aimTurn(eye, door, altar, smo(sgk(t, C.offer + 1.5, C.offer + 6.5)), 1);
      else if (t < C.pg2c3) at = aimTurn(eye, altar, glass, smo(sgk(t, C.q2c2 - 0.4, C.q2c2 + 1.4)), -1);
      else if (t < C.q2c3) at = aimEase(eye, glass, door, smo(sgk(t, C.pg2c3 + 1.0, C.pg2c3 + 4.0)));
      else at = aimEase(eye, door, UNDER, smo(sgk(t, C.q2c3 - 0.2, C.q2c3 + 1.2)));
      /* (v25.0 CP4) a slow push in on each held subject, eased back out as his eyes move on: the stand while he tells
         Pong, the altar under Pong's offer (held still for 7-8 s each, the frame read as frozen) */
      const pushA = smo(sgk(t, C.q2c1 + 2.0, C.offer + 1.0)) * (1 - smo(sgk(t, C.offer + 1.0, C.offer + 3.5)));
      const pushB = smo(sgk(t, C.offer + 6.0, C.q2c2)) * (1 - smo(sgk(t, C.q2c2 - 0.4, C.q2c2 + 1.4)));
      fLens((isNarrow() ? 58 : 50) - 8 * pushA - 10 * pushB);
      camAt(eye, at);
    }

    /* THE VISIT (§4.2, a film): the next evening, the shutter lifted for them; the Lersi master looks along the cases and
       up at the altar, and wais the Buddha before anyone; Pong's word; "New shop... tired owner"; his mat laid */
    const V_EYE = [-0.95, 1.62, -2.2];                                   // he waits behind the counter's left end, his altar to his right
    const LC_STANDS = { x: 0, z: -0.35 };                                // where Lersi Chin stops, before the counter
    const PG_STANDS = { x: 0.9, z: -0.25 };
    const _lv = new THREE.Vector3();
    function visitFrame(t) {
      const V = VISIT_T;
      fLook('VISIT'); fogFilm(1);
      const uLift = lp(0.42, 0.86, smo(sgk(t, V.lift, V.lift + 1.9)));
      shopAt({ u: uLift, led: 0.9, ceil: 0, night: true });
      castVis({ goldman: false, mallA: false, mallB: false, lersi: true, pong: true });
      const L = cast.lersi, P = cast.pong;
      const matT = V.mat + 2.1;                                          // the cut to him seated
      props.lcThings.visible = t >= V.mat;
      for (const f of props.flames) f.material.opacity = 0;
      if (t < V.mat) {
        /* outside the shutter, then in: Pong first, then Lersi Chin, unhurried; his eyes along the cases as he comes */
        if (P && P.ready) {
          if (t < V.in) fPut(P, 0.45, 3.4, Math.PI, { y: 0, seated: false });
          else fWalk(P, [[0.45, 3.4], [0.6, 2.0], [0.85, 0.4], [PG_STANDS.x, PG_STANDS.z]], V.in + 0.2, V.in + 5.0, t, { ry: faceTo(PG_STANDS.x, PG_STANDS.z, V_EYE[0], V_EYE[2]) });
          if (t > V.intro - 0.3 && t < V.turn + 0.4) gaze(P, true); else { P.lookAt = t > V.in + 5 ? (L && L.head) || null : null; P.neck = null; }
        }
        if (L && L.ready) {
          const lcRy = t < V.turn ? Math.PI : lp(Math.PI, Math.PI + angTo(Math.PI, faceTo(LC_STANDS.x, LC_STANDS.z, V_EYE[0], V_EYE[2])), smo(sgk(t, V.turn - 0.3, V.turn + 0.9)));
          if (t < V.in + 1.0) fPut(L, -0.35, 3.85, Math.PI, { y: 0, seated: false });
          else fWalk(L, [[-0.35, 3.85], [-0.3, 2.4], [-0.15, 0.9], [LC_STANDS.x, LC_STANDS.z]], V.in + 1.0, V.altar - 0.2, t, { ry: lcRy });
          if (t >= V.altar - 0.2) L.group.rotation.y = lcRy;
          /* his look: the left cabinet, the right, then up to the Buddha; at the turn, the one whose shop it is */
          if (t < V.in + 2.4) { L.lookAt = null; L.look = 0; }
          else if (t < V.in + 4.2) L.lookAt = _lv.set(-2.0, 1.3, 0.9);
          else if (t < V.altar - 1.0) L.lookAt = _lv.set(2.0, 1.25, 0.2);
          else if (t < V.turn) L.lookAt = _lv.set(BUDDHA_AT[0], BUDDHA_AT[1], BUDDHA_AT[2]);
          else gaze(L, true, 1.1);
          L.bow = t > V.altar + 0.6 && t < V.intro - 0.4 ? 0.3 : 0;
          /* his wai to the Buddha (to the face), and his answer to the client's (to the chest) */
          const wB = smo(sgk(t, V.altar + 0.2, V.altar + 0.8)) * (1 - smo(sgk(t, V.intro - 0.6, V.intro)));
          const wC = smo(sgk(t, V.turn + 0.15, V.turn + 0.6)) * (1 - smo(sgk(t, V.turn + 1.3, V.turn + 1.8)));
          const wR = smo(sgk(t, V.wai + 0.25, V.wai + 0.7)) * (1 - smo(sgk(t, V.wai + 1.4, V.mat - 0.1)));
          const w = Math.max(wB, wC, wR);
          lcPose(w > 0.001 ? 'wai' : null, w, { lift: wB > 0.001 ? 1 : 0 });
        }
        /* his own wai to the master (one wai; three bows are only for the Buddha) */
        waiAt(smo(sgk(t, V.wai, V.wai + 0.5)) * (1 - smo(sgk(t, V.wai + 1.3, V.mat - 0.05))));
        let at;
        if (t < V.in) at = [0.1, 0.75, 3.1];                             // the shutter's edge, their feet under it, then them as it rises
        if (t >= V.lift && t < V.in) at = lp3([0.1, 0.75, 3.1], [0.1, 1.35, 3.6], smo(sgk(t, V.lift, V.in)));
        if (t >= V.in && t < V.intro) { const h = headOf(L, [0, 1.6, 2.0]); at = [h[0], h[1] - 0.15, h[2]]; }
        if (t >= V.intro && t < V.turn) at = aimEase(V_EYE, headOf(L, [0, 1.5, -0.35]), headOf(P, [PG_STANDS.x, 1.6, PG_STANDS.z]), smo(sgk(t, V.intro - 0.2, V.intro + 0.9)));
        if (t >= V.turn) at = aimEase(V_EYE, headOf(P, [PG_STANDS.x, 1.6, PG_STANDS.z]), faceOf(L, [0, 1.55, -0.35]), smo(sgk(t, V.turn - 0.1, V.turn + 1.0)));
        const fl = t < V.in ? (isNarrow() ? 56 : 48) : t < V.turn ? (isNarrow() ? 52 : 44) : lp(isNarrow() ? 52 : 44, isNarrow() ? 44 : 36, smo(sgk(t, V.turn, V.wai)));
        fLens(fl);
        camAt(V_EYE, at);
        return;
      }
      waiAt(0);
      if (t < matT) {
        /* the mat unrolled on the shop floor before the counter, from where he stands at its head */
        if (L && L.ready) { fPut(L, 0, MAT.z - MAT.d / 2 - 0.2, 0, { y: 0, seated: false }); L.lookAt = _lv.set(0, 0, 0.6); L.bow = 0.35; }
        lcPose(null, 0);
        if (P && P.ready) { fPut(P, PG_STANDS.x, PG_STANDS.z, faceTo(PG_STANDS.x, PG_STANDS.z, 0, 0.3), { y: 0, seated: false }); P.lookAt = null; }
        propsAt({ mat: smo(sgk(t, V.mat + 0.15, V.mat + 1.9)) });
        for (const o of [props.bowl, props.mayom, props.thread, props.cloth, props.khan, props.yaam]) if (o) o.visible = false;
        const e = [-0.95, 1.6, 1.4];
        shot(e, [0, 0.0, lp(-0.6, 0.6, smo(sgk(t, V.mat, matT)))], 58, 50);
        return;
      }
      /* seated now, his things set out; Pong on his stool; the master looks up at him */
      propsAt({ mat: 1 });
      for (const o of [props.bowl, props.mayom, props.thread, props.cloth, props.khan, props.yaam]) if (o) o.visible = true;
      lcSeated(); pongSeated(); lcBlockOn(true);
      if (L) { L.bow = 0; if (t > matT + 0.6) gaze(L, true, 1.1); else { L.lookAt = _lv.set(0.36, 0.1, -0.12); L.neck = null; } }
      if (P) { P.lookAt = L && L.head ? L.head : null; P.neck = null; }
      const e = [-0.95, 1.62, 1.25];
      shot(e, LC_HEAD(), 54, 46);
    }

    /* P6 · THE EXAMINATION (§4.3, watched): his wrist, the ordinary questions, the doctor; the stillness; the piece by the
       door; a temple for it; what he believes, and what he did not say */
    const _sh = new THREE.Vector3();
    function examFrame(t) {
      const X = EXAM;
      fLook('VISIT'); fogFilm(1);
      shopAt({ u: 0.42, led: 0.9, ceil: 0, night: true });
      castVis({ goldman: false, mallA: false, mallB: false, lersi: true, pong: true });
      lcSeated(); pongSeated();
      props.lcThings.visible = true; propsAt({ mat: 1 });
      const L = cast.lersi, P = cast.pong;
      if (P) { P.lookAt = L && L.head ? L.head : null; P.neck = null; }
      const shelf = [SHELF.x + 0.02, SHELF.y + 0.04, SHELF.z];
      /* the piece: on the shelf until he takes it; in his hand to the mat; in the master's hands; on the cloth */
      const tTake = X.fetch + 2.2, tBack = X.fetch + 3.9, tCloth = X.lc2e8 + SECS.lc2e8 * 0.86;
      pieceShow(t < tTake); clothPiece(t >= tCloth);
      const ph = pieceClone('hand'), pl2 = pieceClone('lc');
      if (t < X.still) {
        /* the wrist taken (his hand out of the frame's foot) while the questions are asked */
        const reach = smo(sgk(t, X.lc2e1 + 0.3, X.lc2e1 + 1.2)) * (1 - smo(sgk(t, X.lc2e6 - 0.2, X.lc2e6 + 0.8)));
        lcPose(reach > 0.001 ? 'reach' : null, reach, { at: [CL.x + 0.06, 0.62, CL.z - 0.36] });
        if (L) { gaze(L, t > X.lc2e1 + 0.8, 1.1); L.look = 1; L.bow = 0; }
        const down = smo(sgk(t, X.q2e3 - 0.1, X.q2e3 + 0.3)) * (1 - smo(sgk(t, X.lc2e5 - 0.3, X.lc2e5 + 0.3)));   // "...Yes." — his eyes drop
        const at = LC_HEAD(); at[1] -= 0.25 * down;
        fLens(lp(isNarrow() ? 52 : 44, isNarrow() ? 48 : 40, smo(sgk(t, 0, X.still))));
        camAt(KN_EYE, at);
        return;
      }
      lcPose(null, 0);
      if (t < X.eyes) {
        /* "Now, quiet." — his eyes shut, his head lowered: the stillness, pushed in on; over his shoulder, the altar's
           Buddha; back */
        if (L) { L.lookAt = null; L.neck = null; L.look = 0; L.bow = 0.24; }
        const k = smo(sgk(t, X.still + 1.2, X.still + 3.6)) * (1 - smo(sgk(t, X.eyes - 2.0, X.eyes - 0.2)));
        fLens(lp(isNarrow() ? 48 : 40, isNarrow() ? 42 : 34, smo(sgk(t, X.still, X.eyes))));
        camAt(KN_EYE, aimEase(KN_EYE, LC_HEAD(), BUDDHA_AT, k * 0.85));
        return;
      }
      if (t < X.fetch) {
        /* his eyes open on the door: "That one... from there?" — the look follows his, round to the shelf by the door */
        if (L) { L.bow = 0; L.look = 1; L.lookAt = _sh.set(shelf[0], shelf[1], shelf[2]); L.neck = 0.95; }
        const k = smo(sgk(t, X.lc2e7 + 0.4, X.lc2e7 + 2.2));
        fLens(lp(isNarrow() ? 50 : 42, isNarrow() ? 40 : 32, smo(sgk(t, X.q2e5, X.fetch))));
        camAt(KN_EYE, aimTurn(KN_EYE, LC_HEAD(), shelf, k, 1));
        return;
      }
      if (t < tBack) {
        /* up, to the shelf; his hand takes it */
        if (L) { L.lookAt = _sh.set(shelf[0], shelf[1], shelf[2]); }
        const kw = smo(sgk(t, X.fetch, X.fetch + 2.0));
        const e = [lp(CL.x, SHELF.x + 0.62, kw), lp(KNEEL.y, 1.6, smo(sgk(t, X.fetch, X.fetch + 0.8))), lp(CL.z, SHELF.z - 0.42, kw)];
        fLens(lp(isNarrow() ? 56 : 48, isNarrow() ? 40 : 34, kw));   // (v25.0 CP7) narrowed as he arrives: the piece large enough to know
        camAt(e, [shelf[0], shelf[1] - 0.05 * kw, shelf[2]]);
        if (t >= tTake && ph) handHold(ph, { screen: [0.1, lp(-0.35, -0.12, smo(sgk(t, tTake, tBack))), 0.36], face: false, rx: -0.3 });
        else handFree();
        return;
      }
      handFree();
      if (ph) ph.visible = false;
      /* back on the mat: the piece in the master's hands, wai'd; "a temple" — and set on the clean cloth */
      if (t < tCloth) {
        const w = smo(sgk(t, tBack, tBack + 0.5)) * (1 - smo(sgk(t, tCloth - 0.5, tCloth)));
        lcPose('wai', Math.max(0.001, w), { lift: 0.3, hold: pl2 });
        if (L) { L.lookAt = null; L.look = 1; gaze(L, t > X.lc2e8 - 0.2, 1.1); L.bow = t < X.lc2e8 - 0.3 ? 0.2 : 0; }
        fLens(isNarrow() ? 50 : 42);
        camAt(KN_EYE, LC_HEAD());
        return;
      }
      lcPose(null, 0); if (pl2) pl2.visible = false;
      if (t < X.believe) {
        /* the piece on the cloth, the candles' light on it */
        if (L) { gaze(L, false); L.lookAt = null; L.look = 0; }
        const c0 = props.cloth.position;
        shot([c0.x + 0.17, 0.5, c0.z + 0.42], [c0.x, c0.y + 0.03, c0.z], 36, 30);   // (v25.0 CP7) closer: the piece, not his bag
        return;
      }
      /* "According to my practice, I believe..." — pushed in; "By him?" — "I didn't say that. I said on you." */
      if (L) { L.look = 1; gaze(L, true, 1.1); L.bow = 0; }
      fLens(lp(isNarrow() ? 50 : 42, isNarrow() ? 42 : 34, smo(sgk(t, X.believe, X.q2e6))));
      camAt(KN_EYE, LC_HEAD());
    }

    /* P7 · THE CLEARING (§4.3, watched; unskippable the first time): his hands together, his eyes down; the homage to his
       teachers; Namo tassa three times; the three Sakkatvā verses (captioned, the Pali over its meaning); the fog lifting
       under the second and third; the water; the leaves; the thread at his wrist; the advice */
    function clearFrame(t) {
      const K = CLEARF;
      /* the lift: grey to colour over the second and third verses (≈ 20 s), his eyes coming up as it goes */
      const lift = smo(sgk(t, K.lift, K.water - 0.6));
      fogFilm(1 - lift);
      fLook(t < K.lift ? 'VISIT' : 'CLEAR', t < K.lift ? 0 : K.water - K.lift);
      shopAt({ u: 0.42, led: lp(0.9, 1, lift), ceil: 0, night: true });
      castVis({ goldman: false, mallA: false, mallB: false, lersi: true, pong: true });
      lcSeated(); pongSeated();
      props.lcThings.visible = true; propsAt({ mat: 1 });
      pieceShow(false); clothPiece(true);
      const L = cast.lersi, P = cast.pong;
      if (P) { P.lookAt = L && L.head ? L.head : null; P.neck = null; }
      /* the candles and the incense lit for the homage */
      const fl = smo(sgk(t, K.homage + 0.4, K.homage + 1.4));
      for (const f of props.flames) f.material.opacity = fl;
      /* his own hands: together from "Hands together", down for the water and the thread, up again for the advice */
      const handsK = smo(sgk(t, K.lc2k0 + 0.6, K.lc2k0 + 1.4)) * (1 - smo(sgk(t, K.water - 0.6, K.water)));
      waiAt(handsK);
      /* (his eyes "closed" are the film's own fade track, dimmed and never black: clearFilm) */
      /* the master: his wai to his teachers over the tray, the chant, the mayom, the bowl, the thread */
      let at = LC_HEAD();
      if (t < K.water) {
        const wH = smo(sgk(t, K.homage + 1.6, K.homage + 2.3)) * (1 - smo(sgk(t, K.sak - 0.8, K.sak)));
        if (L) { L.lookAt = null; L.look = 0; L.bow = t > K.homage && t < K.lift ? 0.2 : 0.08; L.neck = null; }
        if (t < K.sak) lcPose(wH > 0.001 ? 'wai' : null, wH, { lift: 0.7 });
        else {
          /* (v25.0 CP7) the verses chanted with the mayom held between his joined palms, its leaves up and toward him (an
             open hand raised by his face to hold it read as "stop", by photograph) */
          lcPose('wai', Math.max(0.001, smo(sgk(t, K.sak, K.sak + 1.0))), { lift: 0.45, hold: props.mayom });
          if (props.mayom) orient(props.mayom, [0, 0.825, 0.565], [0, -0.565, 0.825]);   // its leaves up and toward him, their face to him
        }
        /* his eyes down on his hands and the mat (the tray, the candles' light at the top of the frame); up as it lifts */
        const down = [CL.x, 0.25, CL.z - 0.75];
        /* (v25.0 CP7) not one still frame for forty seconds: a slow push in on the tray's candles under Namo tassa, his
           eyes drawn up to the master's joined hands and the leaves as the verses begin, up to his face as the grey
           lifts; a breath under it all */
        const toHands = smo(sgk(t, K.sak - 1.0, K.sak + 3.0)), push = smo(sgk(t, K.homage + 1.0, K.sak)) * (1 - toHands);
        const base = aimEase(KN_EYE, down, [LC.x, 0.5, LC.z + 0.22], toHands * 0.75);
        fLens((isNarrow() ? 54 : 46) - 8 * push - 4 * toHands * (1 - lift));
        camAt([KN_EYE[0], KN_EYE[1] + 0.004 * Math.sin(t * 2 * Math.PI / 4.6), KN_EYE[2]], aimEase(KN_EYE, base, LC_HEAD(), 0.15 + 0.85 * lift));
        return;
      }
      if (t < K.sprinkle) {
        /* "Drink. A little." — the bowl brought up to him in both hands; a sip */
        const up = smo(sgk(t, K.water + 0.2, K.water + 1.4)) * (1 - smo(sgk(t, K.sprinkle - 1.2, K.sprinkle - 0.2)));
        const B0 = props.bowl.userData.home || (props.bowl.userData.home = props.bowl.position.clone());
        props.bowl.position.set(lp(B0.x, CL.x, up), lp(B0.y, 0.7, up), lp(B0.z, CL.z - 0.32, up));   // (v25.0 CP7) below his eyes, the water seen
        props.bowl.rotation.x = 0.35 * smo(sgk(t, K.lc2drink + SECS.lc2drink, K.lc2drink + SECS.lc2drink + 0.8)) * up;
        lcPose('bowl', up);
        if (L) { L.look = 1; gaze(L, true, 1.1); L.bow = 0; }
        fLens(isNarrow() ? 54 : 46);
        camAt(KN_EYE, aimEase(KN_EYE, LC_HEAD(), [CL.x, 0.7, CL.z - 0.32], up * 0.6));
        return;
      }
      if (props.bowl.userData.home) { props.bowl.position.copy(props.bowl.userData.home); props.bowl.rotation.x = 0; }
      if (t < K.thread) {
        /* the leaves dipped and flicked over his head and shoulders: the drops falling through his view */
        const fk = (t - K.sprinkle) * 2.6, k = smo(sgk(t, K.sprinkle, K.sprinkle + 0.6)) * (1 - smo(sgk(t, K.thread - 0.6, K.thread)));
        lcPose('reach', k, { at: [CL.x + 0.12 * Math.sin(fk), 1.28 + 0.06 * Math.cos(fk * 1.3), CL.z - 0.55], hold: props.mayom });
        if (props.mayom && k > 0.001) orient(props.mayom, [0.55 * Math.sin(0.9 * Math.sin(fk * 2.0)), -0.8, 0.45], [0, 0.5, 0.85]);   // (v25.0 CP7) its leaves down at him, flicked side to side
        if (L) { L.lookAt = _lv.set(CL.x, 1.25, CL.z); L.neck = null; L.look = 1; }
        dropsAt(t, K.sprinkle + 0.3, K.thread - 0.4, KN_EYE);
        fLens(isNarrow() ? 56 : 48);
        camAt(KN_EYE, [LC_HEAD()[0], LC_HEAD()[1] + 0.15, LC_HEAD()[2]]);
        return;
      }
      dropsAt(-1, 0, 0, KN_EYE);
      if (t < K.advice) {
        /* "Your wrist." — his right hand out, the white thread tied round it in the master's hands */
        const k = smo(sgk(t, K.thread + 0.2, K.thread + 1.0)) * (1 - smo(sgk(t, K.advice - 0.7, K.advice)));
        const tie = (t - K.thread) * 5.0;
        /* (v25.0 CP7) his right hand held out INTO the frame (the engine's own `reach` pose: its palm at that share of the
           frame on every screen), and the master's hands brought to where it is on THIS screen — the point at that share
           of the lens, 0.42 m out — so on a phone and a desktop alike they meet over his wrist (aimed at a fixed world
           point, his own hand lay at the frame's foot, a blob, and the thread under the edge, by photograph) */
        const A = FL.api;
        if (A && A.handPose) A.handPose('reach', smo(sgk(t, K.thread, K.thread + 0.9)));
        if (A && A.handsRoot) { A.handsRoot.visible = true; A.armR.visible = true; }
        const fl = isNarrow() ? 54 : 46;
        fLens(fl);
        camAt(KN_EYE, [CL.x + 0.05, 0.72, CL.z - 0.9]);
        const hw = lensPoint(0.326, -0.652, 0.42, fl);
        lcPose('reach', k, { at: [hw[0] - 0.03 + 0.02 * Math.sin(tie), hw[1] + 0.015 * Math.cos(tie * 1.4), hw[2] - 0.03],
                             atL: [hw[0] + 0.05 - 0.02 * Math.sin(tie), hw[1], hw[2] - 0.05] });
        threadOn(t > K.thread + 2.2);
        if (L) { L.lookAt = _lv.set(hw[0], hw[1], hw[2]); L.neck = null; }
        return;
      }
      lcPose(null, 0);
      /* (v25.0 CP7) the hand lowered out of the frame as he listens, the thread on it until it has gone */
      { const A = FL.api, down = smo(sgk(t, K.advice, K.advice + 1.0));
        if (A && A.handPose) A.handPose('reach', 1 - down);
        threadOn(down < 0.999); }
      /* "Go to a temple this week..." — his face, the colour back, warm */
      if (L) { L.look = 1; gaze(L, true, 1.1); L.bow = 0; }
      fLens(lp(isNarrow() ? 52 : 44, isNarrow() ? 48 : 40, smo(sgk(t, K.advice, K.end))));
      camAt(KN_EYE, at);
    }

    /* ================================================================ THE FOUR ENDINGS (§4.5) and THE CODA (§4.6) */
    /* the shared beats: kneeling before him (as the decision leaves him), Pong at the shutter, the two going out */
    function kneelShot(t, fl0 = 50, fl1 = 44, push = [0, 1]) {
      fLens(lp(isNarrow() ? fl0 + 8 : fl0, isNarrow() ? fl1 + 8 : fl1, smo(sgk(t, push[0], push[1]))));
      camAt(KN_EYE, LC_HEAD());
    }
    function pongShot() { fLens(isNarrow() ? 50 : 42); camAt(KN_EYE, aimEase(KN_EYE, LC_HEAD(), PG_HEAD(), 1)); }
    /* Lersi Chin and Pong go out under the shutter (B, C, D): he stands (on a cut, his bag taken), the two walk out, the
       shutter lifted by Pong as they reach it; `eye` where he watches from */
    /* (v25.0 CP9) round him on his right, a metre off, not through where he knelt: the back of the master's head filled
       the frame from 0.45 m as he passed (by photograph) */
    const OUT_L = [[LC.x, LC.z + 0.25], [0.55, 0.45], [0.6, 1.5], [0.45, 2.6], [0.4, 3.6], [0.6, 4.6]];
    const OUT_P = [[PONG_DOOR.x, PONG_DOOR.z], [0.95, 3.2], [1.1, 4.2], [1.4, 5.0]];
    function goOut(t, t0, t1) {
      const L = cast.lersi, P = cast.pong;
      if (L && L.ready) { fWalk(L, OUT_L, t0 + 0.4, t1, t); L.lookAt = null; L.look = 0; L.bow = 0; }
      if (P && P.ready) fWalk(P, OUT_P, t0 + 1.4, t1 + 0.4, t);
      lcPose(null, 0); lcBlockOn(false);
      props.lcThings.visible = false;                                    // his things packed and gone with him
      shopAt({ u: lp(0.42, 0.86, smo(sgk(t, t0 + 1.0, t0 + 2.4))) });
    }

    /* A · WORD GETS AROUND (worst): that night he posts it; days later the thread; Pong's call; a customer who has read it */
    function endA(t) {
      const T = END.A;
      lcBlockOn(false); lcPose(null, 0);
      castVis({ lersi: false, pong: false, goldman: t >= T.days, mallA: false, mallB: false });
      props.lcThings.visible = false; clothPiece(false); pieceShow(false);
      const eye = [HIS.x + 0.1, 1.52, HIS.z + 0.3], lap = [LAP.x + 0.04, top0 + 0.11, LAP.z + 0.06];
      if (t < T.days) {
        /* that night, alone, the shutter down: the forum, his post typed and sent */
        fLook('VISIT'); fogFilm(0);
        shopAt({ u: 0, led: 0.9, ceil: 0, night: true });
        shop.lapOn = 1; shop.lapMode = 'compose';
        const W2 = DATA.words, n = (W2.postTitle || '').length + (W2.postBody || '').length;
        shop.lapO = { chars: Math.floor(n * c01((t - 0.9) / 5.6)), post: t > T.q2A1 + SECS.q2A1 + 0.5 };
        fLens(lp(isNarrow() ? 54 : 46, isNarrow() ? 48 : 40, smo(sgk(t, 0.4, T.days))));
        camAt(eye, lap);
        return;
      }
      fLook('LATER'); fogFilm(0);
      shopAt({ u: 1, led: 1, ceil: 1, night: false });
      mallPass('A', t);
      if (t < T.call) {
        /* days later, by day: the thread grown under it, reply after reply */
        shop.lapOn = 1; shop.lapMode = 'thread'; shop.lapO = { n: Math.min(5, Math.floor((t - T.days - 0.6) / 1.15) + 1) };
        shop.phoneOn = t > T.call - 1.6 ? wallNow() - (t - (T.call - 1.6)) : 0; shop.phoneMode = 'ringing';
        const k = smo(sgk(t, T.call - 1.6, T.call - 0.6));
        fLens(isNarrow() ? 52 : 44);
        camAt(eye, aimEase(eye, lap, [0.48, top0, COUNTER.z + 0.04], k));
        return;
      }
      shop.lapOn = 1; shop.lapMode = 'thread'; shop.lapO = { n: 5 };
      shop.phoneOn = 0;
      if (t < T.cust) {
        /* Pong on the phone (heard): the replies on the screen under his eyes; at "You saw. You don't know." up to the mall
           going by outside */
        const kUp = smo(sgk(t, T.pg2A2 - 0.2, T.pg2A2 + 1.6));
        fLens(isNarrow() ? 54 : 46);
        camAt(eye, aimEase(eye, lap, [0.5, 1.4, 5.0], kUp));
        return;
      }
      if (t < T.last + SECS.q2A3 * 0.5) {
        /* a customer at the counter, heard: his eyes stay on the tray */
        const tray = [-0.4, DISPLAY.floor, COUNTER.z + 0.05];
        fLens(isNarrow() ? 54 : 46);
        camAt([HIS.x - 0.05, 1.56, HIS.z + 0.2], tray);
        return;
      }
      /* "...never sure enough to say it about him." — back to the screen: his post, and everything under it */
      const k = smo(sgk(t, T.last + SECS.q2A3 * 0.5, T.coda - 0.6));
      fLens(lp(isNarrow() ? 54 : 46, isNarrow() ? 44 : 36, k));
      camAt(eye, lap);
    }

    /* B · NOT MY ROAD (good): he asks to be taught; the honest answer; Pong; the two go; the shop in clear colour */
    function endB(t) {
      const T = END.B;
      fLook('CLEAR'); fogFilm(0);
      shopAt({ u: 0.42, led: 1, ceil: 0, night: true });
      castVis({ goldman: false, mallA: false, mallB: false, lersi: t < T.empty, pong: t < T.empty });
      clothPiece(true); pieceShow(false);
      const L = cast.lersi, P = cast.pong;
      if (t < T.go) {
        lcSeated(); pongDoor(); props.lcThings.visible = true; lcBlockOn(true);
        /* packing (his hand at the bowl) until he is asked; then the bowl down, and the long look */
        const pk = 1 - smo(sgk(t, T.q2B1 + 1.0, T.q2B1 + 2.2));
        lcPose(pk > 0.001 ? 'reach' : null, pk, { at: [LC.x + 0.36, 0.2, LC.z + 0.3] });
        if (L) { L.look = 1; gaze(L, t > T.q2B1 + 1.6, 1.1); L.bow = 0; }
        if (P) { P.lookAt = t > T.pg2B1 - 0.4 && t < T.go ? camera : L && L.head ? L.head : null; P.neck = 1.0; }
        waiAt(smo(sgk(t, T.q2B1, T.q2B1 + 0.5)) * (1 - smo(sgk(t, T.q2B1 + SECS.q2B1 - 0.4, T.q2B1 + SECS.q2B1 + 0.3))));
        /* "Don't take Pong's word" — a look to Pong at the shutter; and his "This time we check first" */
        const onP = (t > T.lc2B2 + 3.9 && t < T.lc2B2 + 5.6) || (t > T.pg2B1 - 0.2 && t < T.go - 0.2);
        if (onP) pongShot(); else kneelShot(t, 50, 40, [T.look, T.lc2B2 + 3.8]);
        return;
      }
      if (t < T.empty) {
        /* he wais; up (a cut), and the two go out under the shutter — Pong lifting it as they reach it */
        const tw = T.go + 1.5;
        if (t < tw) { lcSeated(); pongDoor(); props.lcThings.visible = true;
          const w = smo(sgk(t, T.go, T.go + 0.5)) * (1 - smo(sgk(t, tw - 0.4, tw))); lcPose('wai', Math.max(0.001, w), { lift: 0 });
          waiAt(w); if (L) gaze(L, true, 1.1); kneelShot(t, 46, 46); return; }
        waiAt(0);
        goOut(t, tw, T.empty - 0.2);
        const e = [-0.35, 1.62, 0.9];
        fLens(isNarrow() ? 58 : 50);
        camAt(e, headOf(L, [0.3, 1.5, 2.6]) || [0.3, 1.5, 2.6]);
        return;
      }
      /* the shop in clear colour, theirs gone: the door, then the altar */
      castVis({ lersi: false, pong: false }); lcPose(null, 0); lcBlockOn(false); props.lcThings.visible = false;
      shopAt({ u: 0.42 });
      const e = [-0.35, 1.62, 0.9], k = smo(sgk(t, T.q2B2 + 2.0, T.q2B2 + 6.0));
      fLens(isNarrow() ? 56 : 48);
      camAt(e, aimTurn(e, UNDER, BUDDHA_AT, k, -1));
    }

    /* C · SEND IT BACK (bad): he asks for the harm to be sent back; the kind refusal; the two go; alone, the shutter down,
       and the grey coming back in at the edges while he holds on */
    function endC(t) {
      const T = END.C;
      castVis({ goldman: false, mallA: false, mallB: false, lersi: t < T.alone, pong: t < T.alone });
      clothPiece(t < T.go); pieceShow(false);
      const L = cast.lersi, P = cast.pong;
      if (t < T.alone) { fLook('CLEAR'); fogFilm(0); shopAt({ u: 0.42, led: 1, ceil: 0, night: true }); }
      if (t < T.go) {
        lcSeated(); pongDoor(); props.lcThings.visible = true; lcBlockOn(true);
        /* the thread going into his bag when he is asked; he stops; sits back; the long look, not unkind */
        const pk = 1 - smo(sgk(t, T.stop - 0.4, T.stop + 0.6));
        lcPose(pk > 0.001 ? 'reach' : null, pk, { at: [LC.x - 0.4, 0.2, LC.z + 0.1] });
        if (L) { L.look = 1; gaze(L, t > T.stop, 1.1); L.bow = 0; }
        if (P) { P.lookAt = t > T.pg2C1 - 0.3 && t < T.q2C2 + 0.4 ? camera : L && L.head ? L.head : null; P.neck = 1.0; }
        if (t > T.pg2C1 - 0.2 && t < T.q2C2 - 0.1) pongShot(); else kneelShot(t, 50, 40, [T.stop, T.lc2C3]);
        return;
      }
      if (t < T.alone) {
        const tw = T.go + 1.4;
        if (t < tw) { lcSeated(); pongDoor(); props.lcThings.visible = true;
          const w = smo(sgk(t, T.go, T.go + 0.5)) * (1 - smo(sgk(t, tw - 0.4, tw))); lcPose('wai', Math.max(0.001, w), { lift: 0 });
          if (L) gaze(L, true, 1.1); kneelShot(t, 46, 46); return; }
        goOut(t, tw, T.alone - 0.2);
        const e = [-0.35, 1.62, 0.9];
        fLens(isNarrow() ? 58 : 50);
        camAt(e, headOf(P, [0.9, 1.5, 3.0]) || [0.9, 1.5, 3.0]);
        return;
      }
      /* alone at the counter, the shutter down; the shelf by the door where the piece stood, empty; the grey creeping in */
      castVis({ lersi: false, pong: false }); lcPose(null, 0); lcBlockOn(false); props.lcThings.visible = false;
      fLook('VISIT'); shopAt({ u: 0, led: 0.85, ceil: 0, night: true });
      const creep = smo(sgk(t, T.alone + 1.2, T.coda - 1.0));
      if (kit && kit.chill) kit.chill(0.36 * creep, { secs: 0.01, cine: true, tint: 'grey' });
      const e = [HIS.x - 0.2, 1.6, HIS.z + 0.3], shelf = [SHELF.x + 0.04, SHELF.y, SHELF.z];
      fLens(lp(isNarrow() ? 56 : 48, isNarrow() ? 46 : 38, smo(sgk(t, T.alone, T.coda))));
      camAt(e, shelf);
    }

    /* D · ENOUGH (best): thank you; go well; out under the shutter together; the next morning in full colour — the stand
       gone, the envelope for the temple, the wallet where it should be; a customer's question followed and answered */
    function endD(t) {
      const T = END.D;
      const L = cast.lersi, P = cast.pong;
      clothPiece(t < T.go); pieceShow(false);
      if (t < T.morning) {
        fLook('CLEAR'); fogFilm(0); shopAt({ led: 1, ceil: 0, night: true });
        castVis({ goldman: false, mallA: false, mallB: false, lersi: true, pong: true });
        if (t < T.go) {
          shopAt({ u: 0.42 });
          lcSeated(); pongDoor(); props.lcThings.visible = true; lcBlockOn(true);
          const w = smo(sgk(t, T.q2D1, T.q2D1 + 0.5)) * (1 - smo(sgk(t, T.lc2D1 + SECS.lc2D1 * 0.6, T.lc2D1 + SECS.lc2D1)));
          waiAt(w);
          const wl = smo(sgk(t, T.lc2D1 - 0.2, T.lc2D1 + 0.3)) * (1 - smo(sgk(t, T.lc2D1 + SECS.lc2D1 * 0.6, T.lc2D1 + SECS.lc2D1)));
          lcPose(wl > 0.001 ? 'wai' : null, wl, { lift: 0 });
          if (L) { L.look = 1; gaze(L, true, 1.1); L.bow = 0; }
          if (P) { P.lookAt = t > T.pg2D1 - 0.4 ? camera : L && L.head ? L.head : null; P.neck = 1.0; }
          if (t > T.pg2D1 - 0.2) pongShot(); else kneelShot(t, 48, 44, [0, T.pg2D1]);
          return;
        }
        /* out under the shutter with them, into the corridor at night */
        waiAt(0);
        goOut(t, T.go, T.morning + 0.6);
        const path = [[CL.x, CL.z], [0.0, 1.6], [0.2, 2.7], [0.3, 3.6], [0.4, 4.3]];
        const s = walkS(t, T.go + 1.6, 1.25), v = walkV(t, T.go + 1.6, 1.25);
        const y0 = lp(KNEEL.y, 1.62, smo(sgk(t, T.go, T.go + 1.2)));
        const e = walkEye(path, s, v, () => 0); e[1] = Math.min(e[1], y0 + (e[1] - 1.62));
        fLens(isNarrow() ? 60 : 52);
        camAt(e, headOf(L, [0.4, 1.55, 3.2]) || [0.4, 1.55, 3.2]);
        return;
      }
      /* the next morning, in full colour (chapter 1's dawn shop again, clear this time) */
      fLook('MORNING'); fogFilm(0);
      castVis({ lersi: false, pong: false, goldman: true }); lcPose(null, 0); lcBlockOn(false); props.lcThings.visible = false;
      if (props.stand) props.stand.visible = false;                      // the dried stand taken away at last
      props.envelope.visible = true;
      mallPass('D', t);
      if (t < T.morning + 2.6) {
        /* the shutter rising on the shop, from the corridor, as he opens — the bookend of chapter 1's dawn */
        shopAt({ u: smo(sgk(t, T.morning + 0.2, T.morning + 2.6)), led: 1, ceil: 1, night: false });
        const kk = smo(sgk(t, T.morning, T.morning + 2.6));
        fLens(isNarrow() ? 64 : 56);
        camAt(lp3([0.25, 1.2, 6.2], [0.18, 1.3, 5.4], kk), lp3([0, 1.45, 3.0], [0, 1.35, 0.4], kk));
        return;
      }
      shopAt({ u: 1, led: 1, ceil: 1, night: false });
      const eye = [HIS.x + 0.1, 1.55, HIS.z + 0.28];
      if (t < T.cu2a2) {
        /* the envelope on the counter, For the temple; his pocket, and the wallet in it */
        shot(eye, [props.envelope.position.x, top0, props.envelope.position.z], 50, 42);
        return;
      }
      if (t < T.last) {
        /* her question followed, and answered: a piece from the tray in his hand, turned to her */
        const tray = [0.35, DISPLAY.floor + 0.02, COUNTER.z + 0.02];
        const up = smo(sgk(t, T.q2D2 + 0.4, T.q2D2 + 1.6));
        if (up > 0.001) handHold(amuletHand, { screen: [lp(0.15, 0.05, up), lp(-0.45, -0.15, up), 0.38], face: true, tilt: -0.2 }); else handFree();
        fLens(isNarrow() ? 54 : 46);
        camAt(eye, aimEase(eye, tray, [0.3, top0 + 0.1, COUNTER.z + 0.4], up * 0.6));
        return;
      }
      handFree();
      /* "I had enough to decide." — up to the shop's open front, the mall going by in clear morning light */
      const k = smo(sgk(t, T.last - 0.2, T.last + 3.0));
      fLens(isNarrow() ? 58 : 50);
      camAt(eye, aimEase(eye, [0.3, top0 + 0.1, COUNTER.z + 0.4], [0.4, 1.4, 5.2], k));
    }

    /* THE CODA — "LF>" (every ending): months later, after closing; the forum on his laptop, his notebook beside it with
       the names he has checked; the case file's last paragraph; a new thread at the top; his finger opens it */
    const _bk = new THREE.Vector3();
    function codaFrame(t, k) {
      const C = CODA;
      fLook('VISIT'); fogFilm(0);
      if (kit && kit.chill && k === 'C') kit.chill(0.12, { secs: 0.01, cine: true, tint: 'grey' });   // (what he kept holding, still at the edges)
      shopAt({ u: 0, led: 0.8, ceil: 0, night: true });
      castVis({ lersi: false, pong: false, goldman: false, mallA: false, mallB: false }); lcPose(null, 0); lcBlockOn(false);
      props.lcThings.visible = false; clothPiece(false); pieceShow(false); props.envelope.visible = false;
      if (props.stand) props.stand.visible = k !== 'D';
      handFree();
      shop.lapOn = 1;
      const open = t >= C.open + 0.6;
      shop.lapMode = open ? 'post' : 'list';
      shop.lapO = { scroll: c01((t - C.q2K1) / (C.thread - C.q2K1)), newK: smo(sgk(t, C.thread, C.thread + 0.8)), cursor: smo(sgk(t, C.open - 1.2, C.open)), click: open ? 1 : 0 };
      const eye = [HIS.x + 0.1, 1.5, HIS.z + 0.3], lap = [LAP.x + 0.04, top0 + 0.11, LAP.z + 0.06];
      const bk = shop.ledger ? shop.ledger.getWorldPosition(_bk) : _bk.set(BOOK_AT.x, top0, BOOK_AT.z);
      namesAt(t >= C.q2K2 - 0.4 ? Math.min(7, 2 + Math.floor((t - C.q2K2) / 1.4)) : 2);
      if (t >= C.q2K2 - 0.4 && t < C.q2K3 - 0.2) {
        /* "I research a master's lineage thoroughly..." — his notebook: the names checked, some crossed out */
        fLens(isNarrow() ? 50 : 42);
        camAt([bk.x - 0.12, 1.42, bk.z - 0.42], [bk.x, bk.y + 0.012, bk.z + 0.02]);
        return;
      }
      /* the forum: the list read down; the new thread arriving at the top; pushed in as it is opened */
      const kIn = smo(sgk(t, C.thread, C.black));
      fLens(lp(isNarrow() ? 54 : 46, isNarrow() ? 40 : 32, kIn));
      camAt(lp3(eye, [LAP.x + 0.02, 1.36, LAP.z - 0.36], kIn * 0.6), lap);
    }

    /* (v25.0 CP11) THE ROOM UNDER EACH FILM, a pure function of its clock: the mall muffled at noon in the opening, the
       shop at night under the call, the visit, the examination and the clearing (the room's sound fuller once the fog has
       lifted, from K.lift), each ending's night and its daylight (A's "days later", D's morning: the mall heard clear),
       C's air-con alone after the shutter comes down, and the coda's night. mixBeds eases to it. */
    function filmBedAt(key, t) {
      const B = { mall: 0, night: 0, mallclear: 0 };
      const seg = (a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));      // 0 before a, 1 after b
      if (key === 'open') B.mall = 0.55 * (1 - seg(OPEN.black - 1.0, OPEN.end));               // out with the picture
      else if (key === 'call') B.night = 0.5 * (1 - seg(CALL.black - 0.6, CALL.end));          // to the next evening's black
      else if (key === 'visit') B.night = 0.45 * seg(0, 1.0);                                   // and in from it
      else if (key === 'exam') B.night = 0.45;
      else if (key === 'clear') B.night = t < CLEARF.lift ? 0.4 : 0.5;
      else if (END[key]) {
        const T = END[key];
        if (t >= T.coda) B.night = 0.42 * (1 - seg(T.coda + CODA.black - 0.6, T.coda + CODA.end));
        else if (key === 'A' && t >= T.days - 0.3) B.mallclear = 0.5 * (1 - seg(T.coda - 1.0, T.coda));
        else if (key === 'D' && t >= T.morning - 0.3) B.mallclear = 0.5 * (1 - seg(T.coda - 1.0, T.coda));
        else if (key === 'C' && t >= T.alone) B.night = 0.62;                                   // the air-con, all that is left
        else B.night = 0.45;
      }
      return B;
    }
    const films = {
      begin(key, c, api) {
        FL.key = key; FL.lit = ''; FL.api = api; FL.stings = (c && c.stings) || []; FL.once = new Set();
        /* his hands are not in the films but for what he holds and his wai (chapter 1's law); end() gives them back */
        if (api && api.handsRoot) { FL.hands = api.handsRoot; api.handsRoot.visible = false; }
        kneelZone.visible = false;
        for (const k of ['lersi', 'pong']) if (cast[k]) cast[k].lookFilm = key !== 'open' && key !== 'call';
      },
      frame(key, t, api) {
        if (FL.key !== key) films.begin(key, null, api);
        Object.assign(filmBed, filmBedAt(key, t)); filmBed.on = true;
        fTalk(t);
        if (key === 'open') openFrame(t);
        else if (key === 'call') callFrame(t);
        else if (key === 'visit') visitFrame(t);
        else if (key === 'exam') examFrame(t);
        else if (key === 'clear') clearFrame(t);
        else if (END[key]) {
          const T = END[key];
          if (t < T.coda) ({ A: endA, B: endB, C: endC, D: endD })[key](t);
          else codaFrame(t - T.coda, key);
        }
      },
      /* the films leave nothing behind them: the props home, the people where play keeps them, the light and the lens
         play's (a scene's own end, a skip, a Retry) — the fog back on if play goes on in it */
      end() {
        const key = FL.key, fogBack = (key === 'call' || key === 'visit' || key === 'exam') && !play.cleared;
        waiAt(0); handFree(); threadOn(false); lcPose(null, 0);
        handPhone.visible = false; amuletHand.visible = false; drops.visible = false;
        for (const s of ['hand', 'lc']) if (held[s]) held[s].visible = false;
        if (shop.phone) shop.phone.g.visible = true;
        shop.phoneOn = 0; shop.phoneSecs = null;
        if (props.bowl && props.bowl.userData.home) { props.bowl.position.copy(props.bowl.userData.home); props.bowl.rotation.x = 0; }
        if (props.stand) props.stand.visible = true;
        for (const P of people) P.filmWalk = 0;
        for (const P of [cast.lersi, cast.pong]) if (P) { P.lookAt = null; P.neck = null; P.bow = 0; P.lookFilm = false; P.look = P.o.look || 0; }
        for (const k of ['mallA', 'mallB']) if (cast[k] && cast[k].group) cast[k].group.visible = false;
        if (kit && kit.chill) kit.chill(fogBack ? FOG.chill : 0, { secs: 0.01, cine: false, tint: fogBack ? 'grey' : null });
        if (kit && kit.smear) kit.smear(fogBack ? FOG.smear : 0, { secs: 0.01 });
        camera.rotation.z = 0;
        if (FL.hands) { FL.hands.visible = true; FL.hands = null; }
        FL.key = ''; FL.lit = ''; FL.stings = []; FL.api = null;
        filmBed.on = false;
        if (kit && kit.captions) kit.captions(null);
      }
    };

    /* ---------------------------------------------------------- lifecycle */
    function snap() { return { phase }; }
    function restore() {}
    function reset() {
      films.end();
      dropTodo(); speakReset(); lineQ.length = 0; heard.clear();
      booted = false; preplaced = ''; dayClock.t = 0; lastWall = 0; pausedAt = 0; castLast = 0;
      worldRun++; wDark = false; decOpen = false;
      for (const h of hotspots) { h.done = false; h.dwellT = 0; }
      if (kit) {
        if (kit.abortEvent) kit.abortEvent();
        kit.objective(null, { complete: false });
        kit.root(false); kit.pose('standing', { secs: 0.05 });
        if (kit.pray) kit.pray(false, { secs: 0 });
        kit.presence(0);
        kit.daylight(null, 0);
        kit.setPhase('shop');
        if (kit.captions) kit.captions(null);
        kit.waypoint(null);
        if (kit.chill) kit.chill(0, { secs: 0.01, cine: false, tint: null });
        if (kit.smear) kit.smear(0, { secs: 0.01 });
      }
      lookName = 'DAY';
      for (const k in bedMix) bedMix[k] = 0;
      phase = 'shop';
      /* THE PLAY, BACK TO ITS FIRST FRAME (the v8.1 law: whatever a beat stated is cleared by whatever resets it) */
      play.run++;
      play.busy = false; play.searched.clear(); play.wallet = false; play.objBlur = false;
      play.shapeSeen = false; play.revealed = false; play.how = ''; play.watchAt = 0; play.noteOn = false; play.called = false;
      play.knelt = false; play.bowed = false; play.bow = null; play.told = ''; play.examined = false; play.cleared = false; play.warned = false;
      play.turning = null; play.piece = 'nangkwak';
      kneelZone.visible = false; lcBlockOn(false);
      /* the shop as the day began */
      propsAt({ till: 0, bag: 0, jacket: 0, fridge: 0, mat: 1 });
      props.wallet.visible = true; props.note.visible = true; props.envelope.visible = false; props.sway = 0;
      for (const f of props.flames) f.material.opacity = 0;
      clothPiece(false); pieceShow(true);
      props.lcThings.visible = false;
      for (const o of [props.bowl, props.mayom, props.thread, props.cloth, props.khan, props.yaam]) if (o) o.visible = true;
      shopCtl.night(false); shopCtl.shutter(1, 0); shopCtl.lights(1, 0); shopCtl.ceiling(1, 0); shopCtl.lap('sales'); shopCtl.phone('');
      props.tillTo = props.bagTo = props.jacketTo = props.fridgeTo = 0;
      /* the people where the day began: Lersi Chin and Pong not yet come, the goldsmith's man at his counter */
      for (const P of people) { P.walk = null; P.lookAt = null; P.neck = null; P.talkUntil = 0; P.turnTo = null; P.bow = 0; P.gripK = 0; P.grip = null; P.waiOn = false; P.holdObj = null; if (P.one) P.one.until = 0; }
      whenReady(cast.lersi, (P) => { P.group.visible = false; personPut(P, LC.x, LC.z, 0, 0); seatNow(P, true); });
      whenReady(cast.pong, (P) => { P.group.visible = false; personPut(P, PSTOOL.x, PSTOOL.z, PONG_RY, 0); seatNow(P, true); });
      whenReady(cast.goldman, (P) => { P.group.visible = true; });
      for (const k of ['mallA', 'mallB']) whenReady(cast[k], (P) => { P.group.visible = false; P.filmWalk = 0; });
    }
    function blockers() {
      const out = [];
      const b = (o, pad = 0.20) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); out.push(bb); };
      const solid = (o, pad = 0.14) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40); out.push(bb); };
      for (const w of walls) b(w);
      for (const s of solids) solid(s);
      out.push(lcBlock);                                                // (opened and closed by lcBlockOn)
      return out;
    }
    function dispose() {
      alive = false;
      threadOn(false);
      const geos = new Set(), ms = new Set();
      world.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) ms.add(m);
      });
      for (const o of [wristThread]) o.traverse(q => { if (q.geometry) geos.add(q.geometry); if (q.material) ms.add(q.material); });
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
      world, noteTex, blockers: blockers(),
      ready: () => true,
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => 0 },
      drum: null, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: null,
      skyAt: () => null,
      /* walktest: where play puts him besides the spawn (closing time at his altar; the clearing's first step) */
      arrivals: [{ what: 'his altar at closing time', x: HIS.x, z: HIS.z - 0.25 }, { what: 'the shop floor before the mat', x: -0.95, z: 1.25 }],
      get phase() { return phase; },
      setPhase, applyPhase, after, dayClock, sayLine, queueLine, queueFn, queueGap,
      look, presets: PRESETS, shop: shopCtl, shopState: shop, props, films,
      film: { SX, SHOP, COR, COUNTER, HIS, TILL, BAG, STOOL, FRIDGE, NOTE, SWITCH, SHELF, STAND, LC, CL, PSTOOL, MAT, KNEEL, worldS },
      cast, person: { talk: personTalk, do: personDo, rest: personRest, walk: personWalk, put: personPut, sit: personSit, ready: whenReady, pose: lcPose },
      play: { state: play, search, fridgeOpen, reveal, watch, callPong, kneel, bow, tellAnswer, bowHead, kneelZone, pieces: PIECES },
      castInfo: () => Object.fromEntries(Object.entries(cast).map(([k, P]) => [k, P && { ready: P.ready, diag: P.diag || null,
        pos: [+P.group.position.x.toFixed(2), +P.group.position.y.toFixed(2), +P.group.position.z.toFixed(2)], vis: P.group.visible,
        faceToLens: (() => { if (!P.ready || !P.head || !P.faceLocal) return null;
          const hq = new THREE.Quaternion(), hp = new THREE.Vector3(), cp = new THREE.Vector3();
          P.head.updateWorldMatrix(true, false); P.head.getWorldQuaternion(hq); P.head.getWorldPosition(hp); camera.getWorldPosition(cp);
          return +THREE.MathUtils.radToDeg(P.faceLocal.clone().applyQuaternion(hq).angleTo(cp.sub(hp).normalize())).toFixed(1); })(),
        looking: P.lookAt === camera ? 'lens' : P.lookAt ? 'thing' : (P.look > 0 ? 'play' : null), lookW: +P.lookW.toFixed(2),
        grip: P.grip ? Object.keys(P.grip).join('+') : null, gripK: +(P.gripK || 0).toFixed(2) }])),
      info: () => ({ phase, t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard], until: +speak.until.toFixed(2),
                     pending: speak.pending ? speak.pending.name : null, decOpen, look: lookName, mark: mark(), busy: play.busy,
                     beds: Object.fromEntries(Object.entries(bedMix).map(([k, v]) => [k, +v.toFixed(3)])) }),
      hotspots,
      updateNotes, updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
    });
  }


  /* ====================================================== THE SHOP'S DRAWN SURFACES (chapter 1's, copied: chapters are
     copied, not bundled — every one here is the one his shop was built with) */
  const THAI_FONT = 'Loma, "Noto Sans Thai", "Sarabun", Tahoma, "Leelawadee UI", sans-serif';
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function done(THREE, c, rep) {
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
    return t;
  }
  function sized(cnv, W, H) { const [c, x] = cnv(W); c.height = H; return [c, x]; }
  function speckle(x, W, H, r, n, rgb, a0, a1, s0 = 1, s1 = 2) {
    for (let i = 0; i < n; i++) {
      const s = s0 + r() * (s1 - s0);
      x.fillStyle = `rgba(${rgb},${(a0 + r() * (a1 - a0)).toFixed(3)})`; x.fillRect(r() * W, r() * H, s, s);
    }
  }
  /* a soft blob drawn three times across the sheet's width, so a sheet that repeats along u never shows a seam */
  function blobWrapped(x, W, px, py, rr, inner, outer = 'rgba(0,0,0,0)') {
    for (const ox of [-W, 0, W]) {
      const g = x.createRadialGradient(px + ox, py, 0, px + ox, py, rr); g.addColorStop(0, inner); g.addColorStop(1, outer);
      x.fillStyle = g; x.fillRect(px + ox - rr, py - rr, rr * 2, rr * 2);
    }
  }
  /* the client's mat: a sueah of woven reed, natural with dyed bands — a red border, green stripes, a red lozenge */
  function makeReedMat(THREE, cnv, seed) {
    const S = 256, [c, x] = cnv(S), r = rng(seed);
    const col = (i, j) => {
      const b = Math.min(i, j, S / 4 - 1 - i, S / 4 - 1 - j);                 // distance from the edge, in strands
      const ci = Math.abs(i - S / 8 + 0.5), cj = Math.abs(j - S / 8 + 0.5);
      if (b < 3) return [150, 44, 34];
      if (b >= 5 && b < 7) return [62, 98, 70];
      if (ci + cj < 8 && ci + cj > 5) return [150, 44, 34];
      return [200, 178, 120];
    };
    for (let j = 0; j < S / 4; j++) for (let i = 0; i < S / 4; i++) {
      const base = col(i, j), over = ((i >> 1) + j) % 2 === 0, d = over ? 14 : -18;
      x.fillStyle = `rgb(${base.map(v => Math.max(0, Math.min(255, v + d + (r() - 0.5) * 10))).join(',')})`;
      x.fillRect(i * 4, j * 4, 4, 4);
      x.fillStyle = over ? 'rgba(255,240,200,0.18)' : 'rgba(40,24,8,0.22)';
      if (over) x.fillRect(i * 4, j * 4, 4, 1); else x.fillRect(i * 4, j * 4 + 3, 4, 1);
    }
    speckle(x, S, S, r, 500, '60,40,20', 0.06, 0.16);
    return done(THREE, c, false);
  }
  /* painted light and air: a soft glow (tinted by its material, additive — never a lamp, v15.1), a flame, a puff of
     incense smoke, the rain running down outside glass, a damp stain */
  function makeGlow(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,0.55)'); g.addColorStop(0.6, 'rgba(255,255,255,0.14)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return done(THREE, c, false);
  }
  /* (a soft blob that wraps both ways, for the tiles and the terrazzo) */
  function blobWrap2(x, S, px, py, rr, inner) {
    for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) {
      const g = x.createRadialGradient(px + ox, py + oy, 0, px + ox, py + oy, rr); g.addColorStop(0, inner); g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g; x.fillRect(px + ox - rr, py + oy - rr, rr * 2, rr * 2);
    }
  }
  /* the yard: red laterite earth, packed by tyres and feet, gravel in it, darker where it holds the wet */
  /* ====================================================== THE FILM SETS' DRAWN SURFACES (CP6)
     His shop at dawn in a Singapore neighbourhood mall, the taxi home in the rain, Pong's pickup from the inside. Every
     sheet drawn on a canvas, every one this chapter's own (FRESH). The words on them are world art: a carton says what is
     printed on it, a corridor's shops say their own names (generic: no real brand). */
  /* terrazzo: a pale cement ground, chips of grey, black, white and a little terracotta, brass divider lines every tile */
  function makeTerrazzo(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(4801);
    x.fillStyle = '#d6d2ca'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 40; i++) blobWrap2(x, S, r() * S, r() * S, 40 + r() * 80, r() < 0.5 ? 'rgba(240,236,228,0.18)' : 'rgba(150,144,134,0.12)');
    const chip = (col, n, s0, s1) => {
      for (let i = 0; i < n; i++) {
        const px = r() * S, py = r() * S, s = s0 + r() * (s1 - s0), k = 4 + (r() * 3 | 0);
        x.fillStyle = col; x.beginPath();
        for (let j = 0; j < k; j++) { const a = j / k * Math.PI * 2 + r() * 0.6, rr = s * (0.6 + r() * 0.5); const fx = px + Math.cos(a) * rr, fy = py + Math.sin(a) * rr; if (j) x.lineTo(fx, fy); else x.moveTo(fx, fy); }
        x.closePath(); x.fill();
      }
    };
    chip('rgba(120,116,110,0.85)', 900, 1.5, 4); chip('rgba(40,38,36,0.85)', 600, 1.2, 3.5); chip('rgba(250,248,244,0.9)', 700, 1.2, 3.5);
    chip('rgba(168,104,80,0.75)', 120, 1.2, 3); chip('rgba(92,122,106,0.6)', 50, 1, 2.5);
    x.fillStyle = 'rgba(176,146,92,0.85)'; x.fillRect(0, 0, S, 2); x.fillRect(0, 0, 2, S);    // the brass strip at the tile's edge
    return done(THREE, c, true);
  }
  /* the shop's floor: 600 mm porcelain, a soft grey-white, thin pale grout */
  function makeShopTiles(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(4803);
    x.fillStyle = '#e2e0dc'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 18; i++) blobWrap2(x, S, r() * S, r() * S, 30 + r() * 60, 'rgba(200,198,194,0.16)');
    speckle(x, S, S, r, 1400, '170,168,164', 0.05, 0.16, 1, 2);
    x.fillStyle = 'rgba(182,178,170,0.9)'; x.fillRect(0, 0, S, 2); x.fillRect(0, 0, 2, S);
    return done(THREE, c, true);
  }
  /* (v24.22) THE SHOP'S DRAWN THINGS — the panel behind its altar, its framed yantras, the yantra cloths hung from its
     ceiling, its clock, its PayNow stand, its banner and his laptop's sales. A yantra's script is drawn as Khom-like
     letters (a loop, a stem, a hook — no font carries Khom), which reads as script at the size a shop's print is seen */
  function khomGlyph(x, cx, cy, s, r) {
    x.beginPath(); x.arc(cx - s * 0.18, cy - s * 0.3, s * 0.13, 0, Math.PI * 2);                 // the head loop
    x.moveTo(cx - s * 0.05, cy - s * 0.3); x.lineTo(cx - s * 0.05, cy + s * 0.32);                 // the stem
    const t = r();
    if (t < 0.4) { x.moveTo(cx - s * 0.05, cy + s * 0.32); x.quadraticCurveTo(cx + s * 0.3, cy + s * 0.38, cx + s * 0.28, cy); }
    else if (t < 0.75) { x.moveTo(cx - s * 0.05, cy - s * 0.05); x.quadraticCurveTo(cx + s * 0.36, cy - s * 0.25, cx + s * 0.22, cy + s * 0.3); }
    else { x.moveTo(cx + s * 0.25, cy - s * 0.32); x.lineTo(cx + s * 0.25, cy + s * 0.32); x.moveTo(cx - s * 0.05, cy + s * 0.02); x.lineTo(cx + s * 0.25, cy + s * 0.02); }
    x.stroke();
  }
  /* the panel behind the shop's altar: red lacquer, a gold double border with a band of kanok flames, and behind where
     the Buddha sits a gold flame-arch with rays (the halo the Chinnarat images carry), gold rosettes on a lattice */
  function makeAltarPanel(THREE, cnv) {
    const W = 512, H = 666, [c, x] = sized(cnv, W, H), r = rng(4941);
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#5a0a0e'); g.addColorStop(0.5, '#8a1216'); g.addColorStop(1, '#4e080c');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.strokeStyle = 'rgba(214,170,76,0.22)'; x.lineWidth = 1.5;                                     // the lattice
    for (let k = -H; k < W + H; k += 46) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k + H, H); x.stroke(); x.beginPath(); x.moveTo(k, H); x.lineTo(k + H, 0); x.stroke(); }
    x.fillStyle = 'rgba(226,182,84,0.55)';
    for (let yy = 23; yy < H; yy += 46) for (let xx = (yy / 46 | 0) % 2 ? 23 : 0; xx < W; xx += 46) { x.beginPath(); for (let p = 0; p < 8; p++) { const a = p * Math.PI / 4; x.lineTo(xx + Math.cos(a) * (p % 2 ? 2.5 : 6), yy + Math.sin(a) * (p % 2 ? 2.5 : 6)); } x.fill(); }
    x.strokeStyle = '#d8ae50'; x.lineWidth = 6; x.strokeRect(14, 14, W - 28, H - 28); x.lineWidth = 2; x.strokeRect(30, 30, W - 60, H - 60);
    x.fillStyle = '#d8ae50';                                                                       // the kanok flames along the border
    const flame = (fx, fy, a) => { x.save(); x.translate(fx, fy); x.rotate(a); x.beginPath(); x.moveTo(-6, 4); x.quadraticCurveTo(-7, -6, 0, -12); x.quadraticCurveTo(2, -4, 6, 4); x.closePath(); x.fill(); x.restore(); };
    for (let xx = 40; xx < W - 30; xx += 18) { flame(xx, 25, 0); flame(xx, H - 25, Math.PI); }
    for (let yy = 40; yy < H - 30; yy += 18) { flame(25, yy, -Math.PI / 2); flame(W - 25, yy, Math.PI / 2); }
    const hx = W / 2, hy = H * 0.44, rw = 150, rh = 250;                                             // the halo behind the Buddha
    const rays = x.createRadialGradient(hx, hy - 20, 10, hx, hy - 20, 260); rays.addColorStop(0, 'rgba(255,214,120,0.55)'); rays.addColorStop(1, 'rgba(255,214,120,0)');
    x.fillStyle = rays; x.beginPath(); x.moveTo(hx - rw, hy + rh * 0.55); x.quadraticCurveTo(hx - rw, hy - rh * 0.2, hx, hy - rh * 0.62); x.quadraticCurveTo(hx + rw, hy - rh * 0.2, hx + rw, hy + rh * 0.55); x.closePath(); x.fill();
    x.strokeStyle = '#e4bc5c'; x.lineWidth = 7;
    x.beginPath(); x.moveTo(hx - rw, hy + rh * 0.55); x.quadraticCurveTo(hx - rw, hy - rh * 0.2, hx, hy - rh * 0.62); x.quadraticCurveTo(hx + rw, hy - rh * 0.2, hx + rw, hy + rh * 0.55); x.stroke();
    x.fillStyle = '#e4bc5c';
    for (const side of [-1, 1]) for (let k = 0; k <= 10; k++) {                                    // flames along the arch's rim, pointing out
      const t = k / 10, a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, d = t * t;
      const px = a * (hx + side * rw) + b * (hx + side * rw) + d * hx, py = a * (hy + rh * 0.55) + b * (hy - rh * 0.2) + d * (hy - rh * 0.62);
      const tx = 2 * (1 - t) * 0 + 2 * t * (hx - (hx + side * rw)), ty = 2 * (1 - t) * (-rh * 0.75) + 2 * t * (-rh * 0.42);   // the curve's direction
      flame(px, py, Math.atan2(ty, tx) + (side < 0 ? 0 : Math.PI));                              // the tip along the outward normal
    }
    x.strokeStyle = 'rgba(228,188,92,0.5)'; x.lineWidth = 2;
    for (let k = 0; k < 24; k++) { const a = -Math.PI * (0.08 + 0.84 * k / 23); x.beginPath(); x.moveTo(hx + Math.cos(a) * 40, hy - 40 + Math.sin(a) * 40); x.lineTo(hx + Math.cos(a) * 125, hy - 40 + Math.sin(a) * 140); x.stroke(); }
    speckle(x, W, H, r, 900, '255,220,150', 0.02, 0.06, 1, 2);
    return done(THREE, c, false);
  }
  /* a framed yantra on cream paper in red and black ink: 0 the nine spires (Gao Yord), 1 the five rows (Ha Taew) */
  function makeYantPrint(THREE, cnv, k) {
    const W = 256, H = 346, [c, x] = sized(cnv, W, H), r = rng(4943 + k);
    x.fillStyle = '#efe4c8'; x.fillRect(0, 0, W, H);
    speckle(x, W, H, r, 500, '150,120,80', 0.03, 0.08, 1, 2);
    x.strokeStyle = '#8a1414'; x.lineWidth = 3; x.strokeRect(12, 12, W - 24, H - 24); x.lineWidth = 1; x.strokeRect(18, 18, W - 36, H - 36);
    x.strokeStyle = '#1a1414'; x.lineWidth = 2;
    if (k === 0) {                                                                                 // nine spires over a grid
      for (let s = 0; s < 9; s++) { const bx0 = 40 + s * 20; x.beginPath(); x.moveTo(bx0, 210); x.lineTo(bx0 + 10, 70 + Math.abs(s - 4) * 22); x.lineTo(bx0 + 20, 210); x.stroke(); }
      for (let s = 0; s < 3; s++) { x.beginPath(); x.arc(128, 70 - s * 14, 6 + s * 2, 0, Math.PI * 2); x.stroke(); }
      x.strokeRect(36, 214, W - 72, 70);
      for (let row = 0; row < 2; row++) for (let col = 0; col < 7; col++) khomGlyph(x, 52 + col * 25, 236 + row * 30, 16, r);
    } else {                                                                                       // five rows of script under an unalome
      x.beginPath(); for (let a = 0; a < Math.PI * 5; a += 0.2) { const rr = 3 + a * 2.6; x.lineTo(128 + Math.cos(a) * rr * 0.5, 72 - a * 2.2 + Math.sin(a) * rr * 0.3); } x.stroke();
      x.beginPath(); x.moveTo(128, 72); x.lineTo(128, 96); x.stroke();
      for (let row = 0; row < 5; row++) { x.beginPath(); x.moveTo(30, 108 + row * 42); x.lineTo(W - 30, 108 + row * 42); x.stroke();
        for (let col = 0; col < 8; col++) khomGlyph(x, 44 + col * 24, 128 + row * 42, 17, r); }
    }
    x.fillStyle = '#8a1414'; x.beginPath(); x.arc(W - 48, H - 46, 14, 0, Math.PI * 2); x.fill();     // the temple's seal
    return done(THREE, c, false);
  }
  /* (v24.22) a certificate of a piece's authenticity, as the dealers frame them: cream paper inside a gold rule and a red
     one, its heading in Thai and in English, the piece it names, its checked lines, a gold seal on two ribbons, a signature */
  function makeCertificate(THREE, cnv, k) {
    const W = 256, H = 340, [c, x] = sized(cnv, W, H), r = rng(4961 + k);
    x.fillStyle = '#f4ecd8'; x.fillRect(0, 0, W, H);
    speckle(x, W, H, r, 300, '150,120,80', 0.02, 0.06, 1, 2);
    x.strokeStyle = '#b08a2a'; x.lineWidth = 6; x.strokeRect(10, 10, W - 20, H - 20);
    x.strokeStyle = '#8a1414'; x.lineWidth = 1.5; x.strokeRect(20, 20, W - 40, H - 40);
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillStyle = '#8a1414'; x.font = `bold 24px ${THAI_FONT}`; x.fillText('ใบรับรองพระแท้', W / 2, 50);
    x.fillStyle = '#5a4a2a'; x.font = 'bold 12px Georgia, "Times New Roman", serif'; x.fillText('CERTIFICATE OF AUTHENTICITY', W / 2, 74);
    x.fillStyle = '#2a2014'; x.font = `bold 17px ${THAI_FONT}`;
    x.fillText(['พระสมเด็จ วัดระฆัง', 'พระขุนแผน วัดบ้านกร่าง', 'เหรียญหลวงพ่อ', 'จตุคามรามเทพ', 'พระปิดตา', 'ตะกรุด'][k % 6], W / 2, 106);
    x.font = `13px ${THAI_FONT}`; x.fillStyle = '#3a3020';
    ['ได้ตรวจสอบแล้วเป็นพระแท้', 'เนื้อและพิมพ์ถูกต้อง', 'สภาพสวยเดิม'].forEach((t, i) => x.fillText(t, W / 2, 138 + i * 22));
    const sx0 = 70, sy0 = 250;                                                                     // the seal
    x.fillStyle = '#a8141a'; x.beginPath(); x.moveTo(sx0 - 12, sy0); x.lineTo(sx0 - 22, sy0 + 46); x.lineTo(sx0 - 10, sy0 + 38); x.lineTo(sx0 - 2, sy0 + 50); x.lineTo(sx0 + 2, sy0); x.fill();
    x.beginPath(); x.moveTo(sx0 + 12, sy0); x.lineTo(sx0 + 22, sy0 + 46); x.lineTo(sx0 + 10, sy0 + 38); x.lineTo(sx0 + 2, sy0 + 50); x.lineTo(sx0 - 2, sy0); x.fill();
    const g = x.createRadialGradient(sx0 - 6, sy0 - 6, 2, sx0, sy0, 26); g.addColorStop(0, '#f6dc7a'); g.addColorStop(1, '#a8801e');
    x.fillStyle = g; x.beginPath(); for (let i = 0; i < 32; i++) { const a = i / 32 * Math.PI * 2, rr = i % 2 ? 22 : 26; x.lineTo(sx0 + Math.cos(a) * rr, sy0 + Math.sin(a) * rr); } x.fill();
    x.strokeStyle = '#7a5a10'; x.lineWidth = 1; x.beginPath(); x.arc(sx0, sy0, 15, 0, Math.PI * 2); x.stroke();
    x.strokeStyle = '#3a3020'; x.lineWidth = 1; x.beginPath(); x.moveTo(140, 282); x.lineTo(226, 282); x.stroke();   // the signature's line,
    x.strokeStyle = '#1a2a6a'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(146, 276);                                 // and the signature
    for (let i = 0; i < 9; i++) x.quadraticCurveTo(152 + i * 8, 262 + r() * 14, 158 + i * 8, 274 + r() * 4); x.stroke();
    x.fillStyle = '#5a4a2a'; x.font = `11px ${THAI_FONT}`; x.fillText('ผู้ตรวจสอบ', 183, 296);
    return done(THREE, c, false);
  }
  /* a printed pha yant cloth: the cloth's colour, an ink border, a yantra of squares and script under an unalome, a
     fringe of threads at its foot */
  function makePhaYantCloth(THREE, cnv, bg, ink, k) {   // (its own name: the master's room has its makeYantCloth, and a second declaration of one name silently replaces the first)
    const W = 256, H = 402, [c, x] = sized(cnv, W, H), r = rng(4951 + k);
    x.fillStyle = bg; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 300; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '0,0,0' : '255,255,255'},${(r() * 0.05).toFixed(3)})`; x.fillRect(r() * W, r() * H, 1, 2 + r() * 6); }
    x.strokeStyle = ink; x.fillStyle = ink; x.lineWidth = 3; x.strokeRect(14, 14, W - 28, H - 46); x.lineWidth = 1.5; x.strokeRect(22, 22, W - 44, H - 62);
    x.beginPath(); for (let a = 0; a < Math.PI * 4; a += 0.2) { const rr = 2 + a * 2.2; x.lineTo(128 + Math.cos(a) * rr * 0.5, 64 - a * 1.8 + Math.sin(a) * rr * 0.3); } x.stroke();
    const n = 3 + (k % 2), cs = 150 / n, ox = 128 - 75, oy = 92;
    for (let i = 0; i <= n; i++) { x.beginPath(); x.moveTo(ox, oy + i * cs); x.lineTo(ox + 150, oy + i * cs); x.moveTo(ox + i * cs, oy); x.lineTo(ox + i * cs, oy + 150); x.stroke(); }
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) khomGlyph(x, ox + (j + 0.5) * cs, oy + (i + 0.5) * cs, cs * 0.6, r);
    for (let row = 0; row < 3; row++) for (let col = 0; col < 7; col++) khomGlyph(x, 44 + col * 28, 272 + row * 26, 15, r);
    x.fillStyle = bg; x.fillRect(0, H - 30, W, 30);
    x.strokeStyle = bg; x.lineWidth = 2; for (let xx = 4; xx < W; xx += 5) { x.beginPath(); x.moveTo(xx, H - 32); x.lineTo(xx + (r() - 0.5) * 3, H - 4 - r() * 10); x.stroke(); }
    return done(THREE, c, false);
  }
  /* the shop's wall clock: ten past seven in the morning, when he opens */
  function makeShopClock(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    x.fillStyle = '#f6f4ee'; x.beginPath(); x.arc(128, 128, 126, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#1a1a1a'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = 'bold 30px Arial, Helvetica, sans-serif';
    for (let h = 1; h <= 12; h++) { const a = h * Math.PI / 6 - Math.PI / 2; x.fillText(String(h), 128 + Math.cos(a) * 96, 128 + Math.sin(a) * 96); }
    for (let m = 0; m < 60; m++) { const a = m * Math.PI / 30; x.fillRect(128 + Math.cos(a) * 116 - 1, 128 + Math.sin(a) * 116 - 1, m % 5 ? 2 : 4, m % 5 ? 2 : 4); }
    const hand = (a, len, w) => { x.save(); x.translate(128, 128); x.rotate(a); x.fillRect(-w / 2, -len, w, len + 12); x.restore(); };
    hand((7 + 10 / 60) * Math.PI / 6, 58, 8); hand(10 * Math.PI / 30, 88, 5);
    x.fillStyle = '#b01818'; hand(38 * Math.PI / 30, 100, 2); x.beginPath(); x.arc(128, 128, 7, 0, Math.PI * 2); x.fill();
    return done(THREE, c, false);
  }
  /* the PayNow stand on the counter: a card with a QR code to scan (a pattern, no account) */
  function makePayNow(THREE, cnv) {
    const W = 170, H = 240, [c, x] = sized(cnv, W, H), r = rng(4957);
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#7a1e78'; x.fillRect(0, 0, W, 46);
    x.fillStyle = '#ffffff'; x.font = 'bold 28px Arial, Helvetica, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('PayNow', W / 2, 24);
    const q = 21, cs = 6, ox = (W - q * cs) / 2, oy = 58;
    x.fillStyle = '#111';
    for (let i = 0; i < q; i++) for (let j = 0; j < q; j++) if (r() < 0.48) x.fillRect(ox + j * cs, oy + i * cs, cs, cs);
    for (const [fi, fj] of [[0, 0], [0, q - 7], [q - 7, 0]]) { x.fillStyle = '#fff'; x.fillRect(ox + fj * cs - cs, oy + fi * cs - cs, 9 * cs, 9 * cs);
      x.fillStyle = '#111'; x.fillRect(ox + fj * cs, oy + fi * cs, 7 * cs, 7 * cs); x.fillStyle = '#fff'; x.fillRect(ox + (fj + 1) * cs, oy + (fi + 1) * cs, 5 * cs, 5 * cs); x.fillStyle = '#111'; x.fillRect(ox + (fj + 2) * cs, oy + (fi + 2) * cs, 3 * cs, 3 * cs); }
    x.fillStyle = '#333'; x.font = 'bold 17px Arial, Helvetica, sans-serif'; x.fillText('SCAN TO PAY', W / 2, H - 28);
    return done(THREE, c, false);
  }
  /* the shop's banner over its shutter, until the sign proper comes: red, gold words — GRAND OPENING, the amulets */
  function makeShopBanner(THREE, cnv) {
    const W = 1024, H = 120, [c, x] = sized(cnv, W, H);
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#b0141a'); g.addColorStop(0.5, '#d01c22'); g.addColorStop(1, '#a01218');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.strokeStyle = '#f2cc5a'; x.lineWidth = 3; x.strokeRect(8, 8, W - 16, H - 16);
    x.fillStyle = '#f6d468'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = `bold 52px ${THAI_FONT}`; x.fillText('พระเครื่อง', 190, 62);
    x.font = 'bold 50px Georgia, "Times New Roman", serif'; x.fillText('GRAND OPENING', 560, 64);
    x.font = 'bold 48px "Noto Sans CJK SC", "Noto Sans SC", "PingFang SC", sans-serif'; x.fillText('开张大吉', 880, 62);
    return done(THREE, c, false);
  }
  /* (v24.22) the counter's fascia: red lacquer and a gold rule, what the shop sells in Thai and in English */
  function makeCounterFascia(THREE, cnv) {
    const W = 2048, H = 112, [c, x] = sized(cnv, W, H);
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#8e1418'); g.addColorStop(0.5, '#a8161c'); g.addColorStop(1, '#7a1014');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.strokeStyle = '#e2b850'; x.lineWidth = 4; x.strokeRect(10, 10, W - 20, H - 20); x.lineWidth = 1.5; x.strokeRect(20, 20, W - 40, H - 40);
    x.fillStyle = '#f2cc5a'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = `bold 50px ${THAI_FONT}`; x.fillText('พระเครื่อง · พระบูชา · เครื่องรางของขลัง', 640, 58);
    x.font = 'bold 40px Georgia, "Times New Roman", serif'; x.fillText('AMULETS · BUDDHA IMAGES · CHARMS', 1560, 60);
    return done(THREE, c, false);
  }
  /* (v24.22) HIS SALES ON HIS LAPTOP (Chad: "why he is recording sales on paper? It makes no sense. It should be on
     laptop"): a small shop's sales page for the week, drawn on demand onto the laptop's 1024 × 720 screen. The opening
     watches Wednesday's one sale typed in (`wed`, 0…1: the row's words appear as he types, then the day's bar and the
     week's total take it); the coda's grey morning finds the screen asleep. Its stock count is the pieces actually standing
     in the shop (`o.stock`, shop.stockCount). */
  function drawSalesApp(x, o = {}) {
    const W = 1024, H = 720, wk = o.wed == null ? 1 : Math.max(0, Math.min(1, o.wed));
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.fillStyle = '#f4f6f9'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#1e2a3a'; x.fillRect(0, 0, 210, H);                                          // the sidebar
    x.fillStyle = '#d8b04a'; x.font = 'bold 30px Arial, Helvetica, sans-serif'; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText('ShopDesk', 28, 48);
    x.font = '22px Arial, Helvetica, sans-serif';
    ['Dashboard', 'Sales', 'Stock', 'Orders', 'Customers'].forEach((t, i) => { const y = 130 + i * 56;
      if (i === 1) { x.fillStyle = '#2f4058'; x.fillRect(0, y - 24, 210, 48); x.fillStyle = '#d8b04a'; x.fillRect(0, y - 24, 5, 48); }
      x.fillStyle = i === 1 ? '#ffffff' : '#9aa8bc'; x.fillText(t, 32, y); });
    x.fillStyle = '#1e2a3a'; x.font = 'bold 34px Arial, Helvetica, sans-serif'; x.fillText('Sales · this week', 248, 52);
    x.fillStyle = '#7a8698'; x.font = '20px Arial, Helvetica, sans-serif'; x.fillText('Mon – Sun', 252, 88);
    const total = wk >= 1 ? 95 : 0, orders = wk >= 1 ? 1 : 0;
    [['Revenue', 'S$ ' + total.toFixed(2)], ['Orders', String(orders)], ['In stock', (o.stock || 214) + ' pcs']].forEach(([lab, val], i) => {
      const cx = 248 + i * 252; x.fillStyle = '#ffffff'; x.fillRect(cx, 116, 232, 104); x.strokeStyle = '#dde2ea'; x.lineWidth = 2; x.strokeRect(cx, 116, 232, 104);
      x.fillStyle = '#7a8698'; x.font = '20px Arial, Helvetica, sans-serif'; x.fillText(lab, cx + 18, 146);
      x.fillStyle = i === 0 && total === 0 ? '#9aa4b2' : '#1e2a3a'; x.font = 'bold 38px Arial, Helvetica, sans-serif'; x.fillText(val, cx + 18, 192); });
    /* the week's bars: Monday and Tuesday nothing, Wednesday the one sale, the rest still to come */
    const cx0 = 248, cy0 = 252, cw = 736, ch = 210;
    x.fillStyle = '#ffffff'; x.fillRect(cx0, cy0, cw, ch); x.strokeStyle = '#dde2ea'; x.strokeRect(cx0, cy0, cw, ch);
    x.strokeStyle = '#eef0f4'; x.lineWidth = 1; for (let k = 1; k < 4; k++) { x.beginPath(); x.moveTo(cx0 + 40, cy0 + ch - 34 - k * 40); x.lineTo(cx0 + cw - 16, cy0 + ch - 34 - k * 40); x.stroke(); }
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach((d, i) => { const bx = cx0 + 64 + i * 96;
      x.fillStyle = i < 3 ? '#4a5668' : '#b8c0cc'; x.font = '19px Arial, Helvetica, sans-serif'; x.textAlign = 'center'; x.fillText(d, bx + 20, cy0 + ch - 16);
      if (i === 2 && wk >= 1) { const bh = 38 * Math.min(1, (o.bar == null ? 1 : o.bar)); x.fillStyle = '#d8a83a'; x.fillRect(bx, cy0 + ch - 34 - bh, 40, bh); }
      else if (i < 3) { x.fillStyle = '#dfe3ea'; x.fillRect(bx, cy0 + ch - 36, 40, 2); } });
    x.textAlign = 'left';
    /* the week's sales, one row a sale: Wednesday's typed in as far as he has gone */
    x.fillStyle = '#ffffff'; x.fillRect(cx0, 484, cw, 210); x.strokeStyle = '#dde2ea'; x.lineWidth = 2; x.strokeRect(cx0, 484, cw, 210);
    x.fillStyle = '#7a8698'; x.font = 'bold 19px Arial, Helvetica, sans-serif';
    [['Day', 0], ['Item', 110], ['Qty', 470], ['Amount', 580]].forEach(([t, dx]) => x.fillText(t, cx0 + 22 + dx, 514));
    x.fillStyle = '#e4e8ee'; x.fillRect(cx0 + 12, 530, cw - 24, 2);
    const row = ['Wed', 'Takrut (set of 5)', '1', 'S$ 95.00'], cols = [0, 110, 470, 580];
    const typed = Math.floor(wk * 40), chars = [row[0].length, row[1].length, row[2].length, row[3].length];
    let left = typed, caret = null;
    x.fillStyle = '#1e2a3a'; x.font = '24px Arial, Helvetica, sans-serif';
    for (let k = 0; k < 4; k++) { if (left <= 0) break; const s = row[k].slice(0, Math.min(chars[k], left)); x.fillText(s, cx0 + 22 + cols[k], 564);
      caret = cx0 + 22 + cols[k] + x.measureText(s).width; left -= chars[k]; }
    if (wk < 1 && (o.blink == null || o.blink)) { x.fillStyle = '#2a6fd8'; x.fillRect(caret == null ? cx0 + 22 : caret + 2, 548, 2.5, 30); }
    if (wk <= 0) { x.fillStyle = '#9aa4b2'; x.font = 'italic 21px Arial, Helvetica, sans-serif'; x.fillText('No sales yet this week.', cx0 + 22, 610); }
    return [caret == null ? cx0 + 22 : caret, 564];
  }
  /* a roller shutter's curtain: galvanised slats in horizontal ridges, grey, a little grime low down */
  function makeShutterSlats(THREE, cnv) {
    const [c, x] = sized(cnv, 128, 256), r = rng(4807);
    for (let y = 0; y < 256; y += 32) {
      const g = x.createLinearGradient(0, y, 0, y + 32);
      g.addColorStop(0, '#6a7074'); g.addColorStop(0.18, '#b4babe'); g.addColorStop(0.5, '#9ca2a6'); g.addColorStop(0.82, '#7e8488'); g.addColorStop(1, '#4a4e52');
      x.fillStyle = g; x.fillRect(0, y, 128, 32);
    }
    for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '60,56,50' : '200,204,206'},${(0.06 + r() * 0.1).toFixed(2)})`; x.fillRect(r() * 128, r() * 256, 2 + r() * 12, 1 + r() * 3); }
    return done(THREE, c, true);
  }
  /* the cases' bed: dark red velvet, its nap catching the light in soft patches */
  function makeVelvet(THREE, cnv) {
    const S = 128, [c, x] = cnv(S), r = rng(4809);
    x.fillStyle = '#4a1016'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 30; i++) blobWrap2(x, S, r() * S, r() * S, 10 + r() * 30, r() < 0.5 ? 'rgba(110,30,38,0.25)' : 'rgba(20,4,8,0.25)');
    speckle(x, S, S, r, 900, '120,40,48', 0.1, 0.25, 1, 1);
    return done(THREE, c, true);
  }
  /* a price card, handwritten: four of them on one sheet */
  function makePriceCards(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 64);
    const HAND = '"Segoe Print", "Bradley Hand", "Comic Sans MS", "Chalkboard SE", cursive';
    ['$380', '$1,200', '$95', '$560'].forEach((p, k) => {
      x.fillStyle = '#f6f2e8'; x.fillRect(k * 64 + 3, 6, 58, 52);
      x.fillStyle = '#c02a20'; x.fillRect(k * 64 + 3, 6, 58, 4);
      x.fillStyle = '#1c2a6a'; x.font = `bold ${p.length > 4 ? 17 : 21}px ${HAND}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(p, k * 64 + 32, 36);
    });
    return done(THREE, c, false);
  }
  /* his notebook's two open pages, drawn on demand onto one 1024 × 640 canvas (CP9). The FRONT is what he studies — a
     student of this world, as the case file says, his notes on the pieces he sells (v24.22: it was his stock and his
     week's sales, and Chad's "why he is recording sales on paper? It makes no sense. It should be on laptop" moved
     those to the laptop, drawSalesApp). The BACK is the day at the samnak: every line he wrote there in his own words
     (`entries`, what he did, the people he asked on the left page and what he saw on the right), and the line an ending
     adds (`last`, written to `lastK`). Answers where the pen is, in the canvas's pixels (the back's last line). */
  const BOOK_HAND = '"Segoe Print", "Bradley Hand", "Comic Sans MS", "Chalkboard SE", cursive';
  const BOOK_NOTE = 'italic 500 23px "Cormorant Garamond", Georgia, serif';
  function drawStockPages(x, o = {}) {
    const r = rng(4813);
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, 1024, 640);
    for (const ox of [0, 512]) {
      const g = x.createLinearGradient(ox, 0, ox + 512, 0);
      g.addColorStop(0, ox ? '#d8d2c2' : '#f2eee2'); g.addColorStop(ox ? 0.1 : 0.9, '#f4f0e4'); g.addColorStop(1, ox ? '#f2eee2' : '#d8d2c2');
      x.fillStyle = g; x.fillRect(ox, 0, 512, 640);
      x.strokeStyle = 'rgba(80,120,190,0.45)'; x.lineWidth = 1.2;
      for (let y = 92; y < 620; y += 38) { x.beginPath(); x.moveTo(ox + 18, y); x.lineTo(ox + 494, y); x.stroke(); }
      x.strokeStyle = 'rgba(200,40,40,0.6)'; x.beginPath(); x.moveTo(ox + 70, 20); x.lineTo(ox + 70, 620); x.stroke();
    }
    x.fillStyle = '#1e2c78'; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
    let pen = null;
    if (o.mode !== 'back') {
      /* what a dealer learns first: how each kind is made and what to look at (the research's own facts, v24.22) */
      const L = [['Phra Somdej', true], ['arch, Buddha, 3-tier base', false], ['old powder: fine cracks, a dusty crust', false], ['the back flat', false],
                 ['Rian', true], ['a monk\'s coin: his name, the BE year', false], ['the back: yantra, the temple', false]];
      const R = [['Khun Paen', true], ['5 sides, Buddha under an arch', false], ['Wat Ban Krang: baked clay', false],
                 ['Pidta', true], ['hands over his face', false], ['Takrut', true], ['a rolled yantra in its tube', false], ['Ask: who made it? which temple?', false]];
      for (const [list, ox] of [[L, 84], [R, 596]]) list.forEach(([t, head], i) => {
        x.font = head ? `bold 25px ${BOOK_HAND}` : `22px ${BOOK_HAND}`; x.fillText(head ? t : '– ' + t, ox + (head ? 0 : 8), 86 + i * 38); });
    } else {
      /* the back of the book: the day at the samnak, in his own hand */
      const E = Array.isArray(o.entries) ? o.entries : [];
      x.font = `bold 24px ${BOOK_HAND}`; x.fillText(o.titleL || 'Who is he?', 84, 62); x.fillText(o.titleR || 'What I saw', 596, 62);
      x.font = BOOK_NOTE;
      const wrapAt = (txt, ox, y0, maxW) => {
        const words = String(txt).split(/\s+/); let line = '', y = y0;
        for (const w of words) { const tl = line ? line + ' ' + w : w; if (x.measureText(tl).width > maxW && line) { x.fillText(line, ox, y); y += 38; line = w; } else line = tl; }
        if (line) { x.fillText(line, ox, y); y += 38; }
        return y;
      };
      let yL = 124, yR = 124;
      for (const e of E) {
        const left = e.page === 'who';
        if (left) { if (yL > 580) continue; x.fillText('–', 80, yL); yL = wrapAt(e.text, 98, yL, 392); }
        else { if (yR > 540) continue; x.fillText('–', 592, yR); yR = wrapAt(e.text, 610, yR, 392); }
      }
      /* the ending's own line, at the foot of what he saw, written as far as the pen has gone */
      if (o.last) {
        const yl = Math.min(582, Math.max(yR + 6, 352)), lk = o.lastK == null ? 1 : Math.max(0, Math.min(1, o.lastK));
        x.font = 'italic 600 25px "Cormorant Garamond", Georgia, serif';
        const w = x.measureText(o.last).width;
        if (lk > 0) { x.save(); x.beginPath(); x.rect(604, yl - 30, w * lk + 6, 42); x.clip(); x.fillText(o.last, 610, yl); x.restore(); }
        pen = [610 + w * lk, yl - 2];
      }
    }
    for (let i = 0; i < 200; i++) { x.fillStyle = `rgba(120,100,70,${(r() * 0.05).toFixed(3)})`; x.fillRect(r() * 1024, r() * 640, 2, 2); }
    x.fillStyle = 'rgba(60,50,40,0.25)'; x.fillRect(506, 0, 12, 640);
    return pen;
  }
  /* a congratulations ribbon on a flower stand: red satin, gold characters down it */
  function makeRibbon(THREE, cnv, text, latin) {
    const [c, x] = sized(cnv, 64, 512), r = rng(4815);
    const g = x.createLinearGradient(0, 0, 64, 0); g.addColorStop(0, '#8a0e12'); g.addColorStop(0.5, '#d01c22'); g.addColorStop(1, '#8a0e12');
    x.fillStyle = g; x.fillRect(0, 0, 64, 512);
    for (let i = 0; i < 60; i++) { x.fillStyle = `rgba(255,${120 + r() * 60 | 0},${100 + r() * 40 | 0},${(r() * 0.08).toFixed(2)})`; x.fillRect(0, r() * 512, 64, 1 + r() * 3); }
    x.fillStyle = '#f2cc5a'; x.textAlign = 'center'; x.textBaseline = 'middle';
    if (latin) { x.font = 'bold 28px Georgia, "Times New Roman", serif'; const ch = text.split(''); ch.forEach((t, i) => x.fillText(t, 32, 132 + i * (366 / ch.length))); }
    else { x.font = `bold 46px "Noto Sans CJK SC", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`; [...text].forEach((t, i) => x.fillText(t, 32, 160 + i * 92)); }
    return done(THREE, c, false);
  }
  /* bubble wrap: clear plastic, a grid of bubbles catching the light (alpha) */
  function makeBubbleWrap(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    x.clearRect(0, 0, S, S); x.fillStyle = 'rgba(230,236,240,0.22)'; x.fillRect(0, 0, S, S);
    for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) {
      const cx = i * 16 + (j % 2) * 8 + 8, cy = j * 16 + 8;
      const g = x.createRadialGradient(cx - 2, cy - 2, 0, cx, cy, 6); g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(0.5, 'rgba(220,230,238,0.45)'); g.addColorStop(1, 'rgba(180,196,210,0.3)');
      x.fillStyle = g; x.beginPath(); x.arc(cx, cy, 6, 0, Math.PI * 2); x.fill();
    }
    return done(THREE, c, true);
  }
  /* a carton: corrugated brown, FRAGILE in red, the up arrows, a strip of tape */
  function makeCarton(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(4817);
    x.fillStyle = '#b08a5a'; x.fillRect(0, 0, S, S);
    for (let y = 0; y < S; y += 3) { x.fillStyle = `rgba(90,64,36,${(0.05 + r() * 0.05).toFixed(2)})`; x.fillRect(0, y, S, 1); }
    x.fillStyle = 'rgba(196,170,120,0.8)'; x.fillRect(0, 118, S, 20);
    x.fillStyle = '#b01e1a'; x.font = 'bold 30px Arial, Helvetica, sans-serif'; x.textAlign = 'center'; x.fillText('FRAGILE', 128, 74);
    x.font = 'bold 18px Arial, Helvetica, sans-serif'; x.fillText('易碎品 · HANDLE WITH CARE', 128, 100);
    x.strokeStyle = '#1a1a1a'; x.lineWidth = 4; for (const ax of [70, 186]) { x.beginPath(); x.moveTo(ax, 220); x.lineTo(ax, 170); x.moveTo(ax - 12, 184); x.lineTo(ax, 170); x.lineTo(ax + 12, 184); x.stroke(); }
    return done(THREE, c, false);
  }
  /* a shop sign on the corridor: a lightbox with the shop's name (generic) in two scripts */
  function makeShopSign(THREE, cnv, en, cn, bg, fg) {
    const [c, x] = sized(cnv, 512, 96);
    x.fillStyle = bg; x.fillRect(0, 0, 512, 96);
    x.fillStyle = 'rgba(255,255,255,0.12)'; x.fillRect(0, 0, 512, 10);
    x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = `bold 40px "Noto Sans CJK SC", "Noto Sans SC", "PingFang SC", sans-serif`; x.fillText(cn, 106, 48);
    x.font = 'bold 30px Arial, Helvetica, sans-serif'; x.fillText(en, 330, 50);
    return done(THREE, c, false);
  }
  /* a green EXIT sign, the running man left out (a sign says EXIT; that is enough) */
  function makeExitSign(THREE, cnv) {
    const [c, x] = sized(cnv, 128, 48);
    x.fillStyle = '#0e8a3a'; x.fillRect(0, 0, 128, 48); x.fillStyle = '#eafff0'; x.font = 'bold 30px Arial, Helvetica, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('EXIT', 64, 26);
    return done(THREE, c, false);
  }
  /* (v24.37) THE MALL'S OWN PICTURES (Chad: "Why are other stores also closed"): what the open shops round his are stocked
     with, seen through their fronts across the corridor and at the edges of his own — the goldsmith's chains on red
     velvet and his trays, the clock shop's walls of clocks and its watches, the provision shop's shelves and its hanging
     packets, the tailor's bolts of cloth, the prayer-goods shop's red and gold. One sheet with gutters (the street's way,
     makeStoreAtlas), its own seeded stream; generic, no brand (v9.3) */
  function makeMallAtlas(THREE, cnv) {
    const S = 1024, G = 8, [c, x] = sized(cnv, S, S), r = rng(6151), cells = {};
    x.fillStyle = '#2a2a2e'; x.fillRect(0, 0, S, S);
    let cx = 0, cy = 0, rowH = 0;
    const cell = (name, w, h, draw) => {
      if (cx + w + 2 * G > S) { cx = 0; cy += rowH; rowH = 0; }
      const X = cx + G, Y = cy + G;
      x.save(); x.beginPath(); x.rect(X, Y, w, h); x.clip(); x.translate(X, Y); draw(w, h); x.restore();
      x.drawImage(c, X, Y, w, 1, X, Y - G, w, G); x.drawImage(c, X, Y + h - 1, w, 1, X, Y + h, w, G);
      x.drawImage(c, X, Y - G, 1, h + 2 * G, X - G, Y - G, G, h + 2 * G); x.drawImage(c, X + w - 1, Y - G, 1, h + 2 * G, X + w, Y - G, G, h + 2 * G);
      cells[name] = [(X + 1) / S, 1 - (Y + h - 1) / S, (X + w - 1) / S, 1 - (Y + 1) / S];
      cx += w + 2 * G; rowH = Math.max(rowH, h + 2 * G);
    };
    const gold = (x0, y0, x1, y1) => { const g = x.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, '#8a5a10'); g.addColorStop(0.35, '#ffe08a'); g.addColorStop(0.55, '#e8b02e'); g.addColorStop(1, '#9a6a14'); return g; };
    const velvet = (w, h, top, bot) => { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, top); g.addColorStop(1, bot); x.fillStyle = g; x.fillRect(0, 0, w, h);
      for (let k = 0; k < 900; k++) { x.fillStyle = `rgba(0,0,0,${r() * 0.08})`; x.fillRect(r() * w, r() * h, 2, 2); } };
    /* the goldsmith's back wall: red velvet panels in gold frames, chains hung in rows, pendants on them, a row of bangles */
    cell('goldWall', 512, 192, (w, h) => {
      velvet(w, h, '#8a1418', '#5a0a0e');
      for (let p = 0; p < 4; p++) { const px = 6 + p * 126, pw = 118;
        x.strokeStyle = gold(px, 0, px + pw, 0); x.lineWidth = 4; x.strokeRect(px, 6, pw, h - 12);
        for (let row = 0; row < 2; row++) { const y0 = 16 + row * 84;
          for (let k = 0; k < 7; k++) { const ax = px + 10 + k * 15, len = 36 + r() * 30;
            x.strokeStyle = gold(ax - 4, y0, ax + 4, y0 + len); x.lineWidth = 1.6 + r() * 1.4;
            x.beginPath(); x.moveTo(ax - 5, y0); x.quadraticCurveTo(ax, y0 + len * 1.25, ax + 5, y0); x.stroke();
            if (r() < 0.6) { x.fillStyle = gold(ax - 4, y0 + len, ax + 4, y0 + len + 8); x.beginPath(); x.ellipse(ax, y0 + len * 0.66 + 4, 3 + r() * 2, 4 + r() * 3, 0, 0, Math.PI * 2); x.fill(); } } }
        x.fillStyle = 'rgba(255,255,255,0.85)'; for (let k = 0; k < 30; k++) x.fillRect(px + r() * pw, 12 + r() * (h - 24), 1.5, 1.5);   // glints
      }
    });
    /* the goldsmith's trays under the glass: bangles, chains coiled, rings in slots, on red velvet in rows */
    cell('goldTray', 256, 64, (w, h) => {
      velvet(w, h, '#7a1014', '#600c10');
      for (let k = 0; k < 10; k++) { const bx = 10 + k * 24, kind = k % 3;
        x.strokeStyle = gold(bx - 9, 0, bx + 9, 0); x.lineWidth = 2.4;
        if (kind === 0) { x.beginPath(); x.ellipse(bx + 2, h * 0.35, 9, 6, 0, 0, Math.PI * 2); x.stroke(); x.beginPath(); x.ellipse(bx + 2, h * 0.72, 9, 6, 0, 0, Math.PI * 2); x.stroke(); }
        else if (kind === 1) { x.beginPath(); for (let a = 0; a < 18; a += 0.5) x.lineTo(bx + 2 + Math.cos(a) * (2 + a * 0.45), h / 2 + Math.sin(a) * (2 + a * 0.45) * 0.8); x.stroke(); }
        else for (let j = 0; j < 4; j++) { x.lineWidth = 1.6; x.beginPath(); x.arc(bx + 2, 9 + j * 14, 3.4, 0, Math.PI * 2); x.stroke(); } }
      x.fillStyle = 'rgba(255,255,255,0.9)'; for (let k = 0; k < 24; k++) x.fillRect(r() * w, r() * h, 1.5, 1.5);
    });
    /* the clock shop's wall: clocks of every kind hung close, each its own face, frame and time */
    cell('clockWall', 512, 192, (w, h) => {
      x.fillStyle = '#d8ccb2'; x.fillRect(0, 0, w, h);
      const frames = ['#4a2c18', '#2a2a2e', '#c8a040', '#7a5a3a', '#e8e4dc', '#8a1a1a', '#1e3a6a'];
      for (let k = 0; k < 46; k++) {
        const rad = 9 + r() * 15, X = 10 + r() * (w - 20), Y = 10 + r() * (h - 20), sq = r() < 0.3, fr = frames[(r() * frames.length) | 0];
        x.fillStyle = 'rgba(0,0,0,0.25)'; if (sq) x.fillRect(X - rad + 2, Y - rad + 3, rad * 2, rad * 2); else { x.beginPath(); x.arc(X + 2, Y + 3, rad, 0, Math.PI * 2); x.fill(); }
        x.fillStyle = fr; if (sq) x.fillRect(X - rad, Y - rad, rad * 2, rad * 2); else { x.beginPath(); x.arc(X, Y, rad, 0, Math.PI * 2); x.fill(); }
        x.fillStyle = r() < 0.15 ? '#1a1a1e' : '#f6f2e6'; x.beginPath(); x.arc(X, Y, rad * 0.78, 0, Math.PI * 2); x.fill();
        const ink = x.fillStyle === '#1a1a1e' ? '#f0e8d0' : '#1a1a1e';
        x.fillStyle = ink; for (let q = 0; q < 12; q++) { const a = q * Math.PI / 6; x.fillRect(X + Math.cos(a) * rad * 0.66 - 0.8, Y + Math.sin(a) * rad * 0.66 - 0.8, 1.6, 1.6); }
        x.strokeStyle = ink; x.lineCap = 'round';
        const ah = r() * Math.PI * 2, am = r() * Math.PI * 2;
        x.lineWidth = 2; x.beginPath(); x.moveTo(X, Y); x.lineTo(X + Math.cos(ah) * rad * 0.4, Y + Math.sin(ah) * rad * 0.4); x.stroke();
        x.lineWidth = 1.2; x.beginPath(); x.moveTo(X, Y); x.lineTo(X + Math.cos(am) * rad * 0.62, Y + Math.sin(am) * rad * 0.62); x.stroke();
      }
    });
    /* the clock shop's counter: watches in rows on dark velvet, faces and straps */
    cell('watchTray', 256, 64, (w, h) => {
      velvet(w, h, '#1e2230', '#141822');
      for (let row = 0; row < 2; row++) for (let k = 0; k < 9; k++) { const X = 16 + k * 27, Y = 17 + row * 30;
        x.fillStyle = ['#2a2a2e', '#7a4a2a', '#c8c8cc', '#c8a040'][(r() * 4) | 0]; x.fillRect(X - 3, Y - 13, 6, 26);
        x.fillStyle = r() < 0.5 ? '#d8d8dc' : '#c8a040'; x.beginPath(); x.arc(X, Y, 7, 0, Math.PI * 2); x.fill();
        x.fillStyle = r() < 0.3 ? '#1a2a4a' : '#f6f4ee'; x.beginPath(); x.arc(X, Y, 5.2, 0, Math.PI * 2); x.fill(); }
    });
    /* the provision shop's shelves: tins, bottles, packets and boxes, three shelves to a cell */
    cell('goods', 384, 192, (w, h) => {
      x.fillStyle = '#b8b4aa'; x.fillRect(0, 0, w, h);
      for (let s2 = 0; s2 < 3; s2++) { const y1 = 60 + s2 * 64; x.fillStyle = '#8a8478'; x.fillRect(0, y1 - 4, w, 6);
        let X = 2; while (X < w - 6) { const kind = r(), col = ['#c8302a', '#e8b82a', '#2a6ac8', '#2a9a4a', '#e86a1a', '#f2f2ee', '#7a3a8a', '#a8642a'][(r() * 8) | 0];
          if (kind < 0.35) { const ww = 10 + r() * 6, hh = 18 + r() * 14; x.fillStyle = col; x.fillRect(X, y1 - 4 - hh, ww, hh); x.fillStyle = 'rgba(255,255,255,0.5)'; x.fillRect(X + 1, y1 - 4 - hh * 0.6, ww - 2, 5); X += ww + 1; }
          else if (kind < 0.6) { const ww = 7 + r() * 4, hh = 28 + r() * 16; x.fillStyle = col; x.fillRect(X + 2, y1 - 4 - hh, ww - 4, 8); x.fillRect(X, y1 - 4 - hh + 8, ww, hh - 8); X += ww + 1; }
          else { const ww = 18 + r() * 14, hh = 22 + r() * 22; x.fillStyle = col; x.fillRect(X, y1 - 4 - hh, ww, hh); x.fillStyle = 'rgba(0,0,0,0.2)'; x.fillRect(X + ww - 3, y1 - 4 - hh, 3, hh); x.fillStyle = 'rgba(255,255,255,0.6)'; x.fillRect(X + 3, y1 - hh + 4, ww - 8, 4); X += ww + 2; } } }
    });
    /* packets hung in strips from the provision shop's front */
    cell('hang', 128, 192, (w, h) => {
      x.clearRect(0, 0, w, h);
      for (let k = 0; k < 6; k++) { const X = 4 + k * 21, col = ['#e8302a', '#f2c030', '#2a8ad8', '#e86aa0', '#3aa84a', '#f27a1a'][k];
        x.fillStyle = '#d8d8d4'; x.fillRect(X + 8, 0, 2, h);
        for (let j = 0; j < 7; j++) { x.fillStyle = col; x.fillRect(X, 6 + j * 26, 18, 22); x.fillStyle = 'rgba(255,255,255,0.75)'; x.fillRect(X + 3, 12 + j * 26, 12, 5); x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(X + 15, 6 + j * 26, 3, 22); } }
    });
    /* the tailor's wall of cloth: bolts end-on and folded lengths on shelves */
    cell('fabric', 384, 192, (w, h) => {
      x.fillStyle = '#c8b89c'; x.fillRect(0, 0, w, h);
      for (let s2 = 0; s2 < 4; s2++) { const y1 = 46 + s2 * 48; x.fillStyle = '#7a5a3a'; x.fillRect(0, y1 - 3, w, 5);
        let X = 3; while (X < w - 10) { const col = ['#2a3a6a', '#8a2a2a', '#e8e0d0', '#3a6a4a', '#c8a050', '#5a5a60', '#d87a8a', '#1a1a1e', '#6a8ab8'][(r() * 9) | 0], ww = 16 + r() * 12, hh = 30 + r() * 10;
          x.fillStyle = col; x.fillRect(X, y1 - 3 - hh, ww, hh); x.fillStyle = 'rgba(255,255,255,0.18)'; for (let q = 0; q < 4; q++) x.fillRect(X, y1 - 3 - hh + 4 + q * 8, ww, 2);
          x.fillStyle = 'rgba(0,0,0,0.3)'; x.fillRect(X + ww - 2, y1 - 3 - hh, 2, hh); X += ww + 1; } }
    });
    /* the prayer-goods shop's shelves: red candles, boxes of joss sticks, gold paper, red packets and lanterns folded */
    cell('prayer', 384, 192, (w, h) => {
      x.fillStyle = '#7a1416'; x.fillRect(0, 0, w, h);
      for (let s2 = 0; s2 < 3; s2++) { const y1 = 62 + s2 * 64; x.fillStyle = '#4a0a0c'; x.fillRect(0, y1 - 4, w, 6);
        let X = 3; while (X < w - 8) { const kind = r();
          if (kind < 0.3) { for (let q = 0; q < 3; q++) { x.fillStyle = '#c81a1a'; x.fillRect(X + q * 7, y1 - 4 - 34, 5, 34); x.fillStyle = '#f2c030'; x.fillRect(X + q * 7, y1 - 4 - 30, 5, 6); } X += 24; }
          else if (kind < 0.55) { const ww = 20 + r() * 8; x.fillStyle = '#e8b82a'; x.fillRect(X, y1 - 4 - 30, ww, 30); x.fillStyle = '#c81a1a'; x.fillRect(X + 3, y1 - 4 - 24, ww - 6, 10); X += ww + 2; }
          else if (kind < 0.8) { const ww = 22 + r() * 10, hh = 10 + r() * 14; x.fillStyle = '#f2d04a'; x.fillRect(X, y1 - 4 - hh, ww, hh); x.fillStyle = '#c89a1a'; for (let q = 0; q < hh; q += 3) x.fillRect(X, y1 - 4 - hh + q, ww, 1); X += ww + 2; }
          else { x.fillStyle = '#e8302a'; x.fillRect(X, y1 - 4 - 22, 16, 22); x.fillStyle = '#f2c030'; x.fillRect(X + 4, y1 - 4 - 16, 8, 8); X += 18; } } }
    });
    return { tex: done(THREE, c, false), cells };
  }
  /* (v24.37) his door mat, inside the shutter's line: red, a gold border, 出入平安 (safe going out and coming in), as a
     Chinese shop lays one */
  function makeDoorMat(THREE, cnv) {
    const [c, x] = sized(cnv, 512, 256), r = rng(6301);
    x.fillStyle = '#8a1416'; x.fillRect(0, 0, 512, 256);
    for (let k = 0; k < 2600; k++) { x.fillStyle = `rgba(0,0,0,${r() * 0.12})`; x.fillRect(r() * 512, r() * 256, 2, 2); }
    x.strokeStyle = '#d8a83a'; x.lineWidth = 10; x.strokeRect(18, 18, 476, 220); x.lineWidth = 3; x.strokeRect(34, 34, 444, 188);
    x.fillStyle = '#e8b84a'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 92px "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Noto Sans SC", "Microsoft YaHei", "WenQuanYi Zen Hei", sans-serif';
    x.fillText('出入平安', 256, 132);
    return done(THREE, c, false);
  }
  /* (v24.37) the acrylic stand on his counter: the casing he does, in English and in Thai (รับเลี่ยมพระ: amulets cased),
     waterproof, gold, silver */
  function makeCasingSign(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 360);
    x.fillStyle = '#fbf8f0'; x.fillRect(0, 0, 256, 360);
    x.fillStyle = '#8e1418'; x.fillRect(0, 0, 256, 96);
    x.fillStyle = '#f6d870'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 40px "Helvetica Neue", Helvetica, Arial, sans-serif'; x.fillText('CASING', 128, 34); x.font = 'bold 26px "Helvetica Neue", Helvetica, Arial, sans-serif'; x.fillText('SERVICE', 128, 70);
    x.fillStyle = '#8e1418'; x.font = 'bold 34px "Noto Sans Thai", "Thonburi", "Leelawadee UI", "Tahoma", sans-serif'; x.fillText('รับเลี่ยมพระ', 128, 140);
    x.fillStyle = '#2a2a2e'; x.font = '22px "Helvetica Neue", Helvetica, Arial, sans-serif';
    ['WATERPROOF', 'GOLD · SILVER', 'MICRON'].forEach((t, k) => x.fillText(t, 128, 196 + k * 34));
    x.strokeStyle = '#c8a040'; x.lineWidth = 6; x.strokeRect(6, 6, 244, 348);
    x.fillStyle = '#8e1418'; x.font = 'bold 18px "Helvetica Neue", Helvetica, Arial, sans-serif'; x.fillText('ASK AT THE COUNTER', 128, 322);
    return done(THREE, c, false);
  }

  /* ====================================================== (v25.0) THIS CHAPTER'S OWN DRAWN SURFACES
     Each drawn on a canvas (CSP-safe, no download); words drawn into the world are art (v14.5), except the forum's,
     which are the sheet's like chapter 1's phone chat, so Chad can change them */
  /* a woven fabric: a grey sling bag's nylon weave, by its colour and seed */
  function makeCanvasCloth(THREE, cnv, hex, seed) {
    const S = 256, [c, x] = cnv(S), r = rng(seed);
    x.fillStyle = hex; x.fillRect(0, 0, S, S);
    for (let y = 0; y < S; y += 2) { x.fillStyle = `rgba(255,255,255,${(0.025 + r() * 0.03).toFixed(3)})`; x.fillRect(0, y, S, 1); }
    for (let xx = 0; xx < S; xx += 2) { x.fillStyle = `rgba(0,0,0,${(0.03 + r() * 0.03).toFixed(3)})`; x.fillRect(xx, 0, 1, S); }
    speckle(x, S, S, r, 500, '0,0,0', 0.03, 0.08);
    const t = done(THREE, c, true); t.repeat.set(2, 2); return t;
  }
  /* his navy zip jacket's cloth: a fine twill, a seam or two */
  function makeJacketCloth(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(7203);
    x.fillStyle = '#1e2a40'; x.fillRect(0, 0, S, S);
    for (let k = -S; k < S; k += 3) { x.strokeStyle = `rgba(255,255,255,${(0.02 + r() * 0.025).toFixed(3)})`; x.lineWidth = 1; x.beginPath(); x.moveTo(k, 0); x.lineTo(k + S, S); x.stroke(); }
    x.strokeStyle = 'rgba(0,0,0,0.35)'; x.lineWidth = 2; x.setLineDash([5, 3]);
    for (const y of [60, 196]) { x.beginPath(); x.moveTo(0, y); x.lineTo(S, y); x.stroke(); }
    x.setLineDash([]); speckle(x, S, S, r, 300, '255,255,255', 0.02, 0.05);
    return done(THREE, c, false);
  }
  /* the wallet's brown leather: its grain, a stitched edge */
  function makeLeather(THREE, cnv) {
    const S = 128, [c, x] = cnv(S), r = rng(7205);
    x.fillStyle = '#6a4228'; x.fillRect(0, 0, S, S);
    speckle(x, S, S, r, 900, '30,16,8', 0.06, 0.16, 1, 2.5); speckle(x, S, S, r, 300, '180,130,90', 0.04, 0.1);
    x.strokeStyle = 'rgba(232,200,150,0.55)'; x.lineWidth = 1.2; x.setLineDash([4, 3]); x.strokeRect(7, 7, S - 14, S - 14); x.setLineDash([]);
    return done(THREE, c, false);
  }
  /* the note on his counter's glass in his own hand: a yellow square, the words in a pen's hand, a corner lifting */
  function makeSticky(THREE, cnv, text) {
    const S = 256, [c, x] = cnv(S), r = rng(7207);
    const g = x.createLinearGradient(0, 0, 0, S); g.addColorStop(0, '#fbe96a'); g.addColorStop(1, '#f2d84a');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    x.fillStyle = 'rgba(160,120,0,0.18)'; x.fillRect(0, 0, S, 22);                      // its glued strip
    speckle(x, S, S, r, 160, '120,90,0', 0.03, 0.08);
    x.save(); x.translate(S / 2, S / 2 + 8); x.rotate(-0.06);
    x.fillStyle = '#1c2a6a'; x.textAlign = 'center'; x.textBaseline = 'middle';
    const words = String(text || '').split(' ');
    x.font = `bold 54px ${BOOK_HAND}`;
    if (words.length > 1) { x.fillText(words[0], -6, -30); x.fillText(words.slice(1).join(' '), 8, 34); } else x.fillText(words[0] || '', 0, 0);
    x.strokeStyle = '#1c2a6a'; x.lineWidth = 3; x.beginPath(); x.moveTo(-70, 70); x.quadraticCurveTo(0, 82, 76, 66); x.stroke();   // underlined twice, in a hurry
    x.beginPath(); x.moveTo(-60, 80); x.quadraticCurveTo(10, 90, 70, 78); x.stroke();
    x.restore();
    return done(THREE, c, false);
  }
  /* his woven bag's cloth (a yaam): bands of red, indigo and cream, a woven texture over them */
  function makeYaamCloth(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(7209);
    const bands = ['#8e1a1a', '#e8dcc0', '#2a3a6a', '#e8dcc0', '#8e1a1a', '#c8902a', '#8e1a1a', '#e8dcc0', '#2a3a6a'];
    let y = 0; bands.forEach((b, i) => { const h = i % 2 ? 14 : 34; x.fillStyle = b; x.fillRect(0, y, S, h); y += h; });
    x.fillStyle = '#8e1a1a'; x.fillRect(0, y, S, S - y);
    for (let yy = 0; yy < S; yy += 3) { x.fillStyle = `rgba(0,0,0,${(0.05 + r() * 0.05).toFixed(3)})`; x.fillRect(0, yy, S, 1); }
    for (let xx = 0; xx < S; xx += 3) { x.fillStyle = `rgba(255,255,255,${(0.03 + r() * 0.03).toFixed(3)})`; x.fillRect(xx, 0, 1, S); }
    return done(THREE, c, false);
  }
  /* the envelope for the temple (ending D): white, its flap, the words in his hand */
  function makeEnvelope(THREE, cnv, text) {
    const [c, x] = sized(cnv, 512, 332), r = rng(7211);
    x.fillStyle = '#f6f4ee'; x.fillRect(0, 0, 512, 332);
    speckle(x, 512, 332, r, 400, '120,110,90', 0.02, 0.05);
    x.strokeStyle = 'rgba(120,110,90,0.35)'; x.lineWidth = 2;
    x.beginPath(); x.moveTo(0, 0); x.lineTo(256, 150); x.lineTo(512, 0); x.stroke();
    x.fillStyle = '#1c2a6a'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `bold 46px ${BOOK_HAND}`;
    x.save(); x.translate(256, 236); x.rotate(-0.03); x.fillText(String(text || ''), 0, 0); x.restore();
    return done(THREE, c, false);
  }
  /* HIS LAPTOP'S FORUM (ending A and the coda): a generic forum — no real site's name, logo or look (v9.3) — drawn on the
     laptop's 1024 × 720 screen: `compose` (his post typed, `chars` of it, `post` once sent), `thread` (it, and `n` of the
     replies), `list` (the threads: masters, a lineage chart, accounts; `newK` the new one arriving at the top, `cursor`
     and `click` his finger on the pad), `post` (the new thread opened) */
  function drawForum(x, o = {}) {
    const W = 1024, H = 720, Wd = o.words || {};
    const F = (s, w = '') => `${w} ${s}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.fillStyle = '#eef0f3'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#23423e'; x.fillRect(0, 0, W, 92);
    x.fillStyle = '#f2d48a'; x.font = F(38, 'bold'); x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText(Wd.forumName || '', 32, 40);
    x.fillStyle = '#b8cfc8'; x.font = F(20); x.fillText(Wd.forumSub || '', 34, 74);
    const card = (y, h) => { x.fillStyle = '#ffffff'; x.fillRect(24, y, W - 48, h); x.strokeStyle = '#d6dbe2'; x.lineWidth = 2; x.strokeRect(24, y, W - 48, h); };
    const wrap = (s, x0, y0, w, lh, max = 3) => {                         // words onto lines, `max` of them
      const ws = String(s || '').split(' '); let line = '', y = y0, n = 0;
      for (const w2 of ws) { const t = line ? line + ' ' + w2 : w2;
        if (x.measureText(t).width > w && line) { x.fillText(line, x0, y); line = w2; y += lh; if (++n >= max) return y; } else line = t; }
      if (line) { x.fillText(line, x0, y); y += lh; }
      return y;
    };
    const mode = o.mode || 'list';
    if (mode === 'compose') {
      const title = Wd.postTitle || '', body = Wd.postBody || '', n = o.chars || 0;
      const tT = title.slice(0, Math.min(n, title.length)), tB = body.slice(0, Math.max(0, n - title.length));
      x.fillStyle = '#23423e'; x.font = F(30, 'bold'); x.fillText('New thread', 40, 136);
      card(170, 72); card(262, 300);
      x.fillStyle = '#7a8698'; x.font = F(18); x.fillText('Title', 44, 186); x.fillText('Message', 44, 278);
      x.fillStyle = '#1e2a3a'; x.font = F(30, 'bold'); x.fillText(tT + (n < title.length && o.blink ? '|' : ''), 44, 220);
      x.font = F(28); const yEnd = wrap(tB + (n >= title.length && !o.post && o.blink ? '|' : ''), 44, 318, W - 100, 40, 6); void yEnd;
      x.fillStyle = o.post ? '#2f8a5a' : '#c8902a'; x.fillRect(W - 220, 590, 180, 64);
      x.fillStyle = '#ffffff'; x.font = F(28, 'bold'); x.textAlign = 'center'; x.fillText(o.post ? 'Posted' : 'Post', W - 130, 622); x.textAlign = 'left';
      return;
    }
    if (mode === 'thread') {
      card(112, 170);
      x.fillStyle = '#1e2a3a'; x.font = F(32, 'bold'); x.fillText(Wd.postTitle || '', 44, 150);
      x.fillStyle = '#7a8698'; x.font = F(18); x.fillText('newshop_sg · 4 days ago', 44, 186);
      x.fillStyle = '#2a3442'; x.font = F(26); wrap(Wd.postBody || '', 44, 226, W - 100, 34, 2);
      const reps = ['reply1', 'reply2', 'reply3', 'reply4', 'reply5'].map(k => Wd[k] || ''), who = ['kopi_uncle', 'Mdm Tan', 'boonchai88', 'pradit_sg', 'old_hand'];
      const n = Math.max(0, Math.min(5, o.n || 0));
      for (let i = 0; i < n; i++) { const y = 300 + i * 82; card(y, 72);
        x.fillStyle = '#23423e'; x.font = F(18, 'bold'); x.fillText(who[i], 44, y + 22);
        x.fillStyle = '#2a3442'; x.font = F(24); x.fillText(reps[i], 44, y + 52); }
      x.fillStyle = '#7a8698'; x.font = F(18); x.textAlign = 'right'; x.fillText(`${n} ${n === 1 ? 'reply' : 'replies'}`, W - 40, 132); x.textAlign = 'left';
      return;
    }
    if (mode === 'post') {
      card(112, 560);
      x.fillStyle = '#1e2a3a'; x.font = F(34, 'bold'); wrap(Wd.threadNew || '', 44, 158, W - 100, 44, 2);
      x.fillStyle = '#7a8698'; x.font = F(18); x.fillText(Wd.threadNewSub || '', 44, 250);
      x.fillStyle = '#d8dce2'; x.fillRect(44, 280, 300, 200);                              // a photograph, not yet loaded
      x.fillStyle = '#b8bec8'; for (let i = 0; i < 7; i++) x.fillRect(370, 290 + i * 28, i === 6 ? 260 : 560 - (i % 3) * 40, 12);
      for (let i = 0; i < 4; i++) x.fillRect(44, 510 + i * 30, 880 - (i % 2) * 120, 12);
      return;
    }
    /* the list: the new thread arriving at the top, then the rest, read down; a lineage chart beside them */
    const rows = ['thread1', 'thread2', 'thread3', 'thread4', 'thread2b', 'thread3b'].map(k => Wd[k] || '').filter(Boolean);
    const newK = Math.max(0, Math.min(1, o.newK || 0)), off = Math.round((o.scroll || 0) * 60);
    const LW = 640;
    x.save(); x.beginPath(); x.rect(0, 100, W, H - 100); x.clip();
    let y = 112 - off + 96 * newK;
    if (newK > 0) {
      const yN = 112 - off - 96 * (1 - newK) + 0;
      x.globalAlpha = newK;
      x.fillStyle = '#fff6d8'; x.fillRect(24, yN, LW, 84); x.strokeStyle = '#e0b84a'; x.lineWidth = 3; x.strokeRect(24, yN, LW, 84);
      x.fillStyle = '#c84a2a'; x.font = F(16, 'bold'); x.fillText('NEW', 40, yN + 22);
      x.fillStyle = '#1e2a3a'; x.font = F(24, 'bold'); wrap(Wd.threadNew || '', 40, yN + 50, LW - 40, 28, 1);
      x.fillStyle = '#7a8698'; x.font = F(16); x.fillText(Wd.threadNewSub || '', 40, yN + 74);
      x.globalAlpha = 1;
    }
    rows.forEach((t, i) => { const yy = y + i * 96;
      x.fillStyle = '#ffffff'; x.fillRect(24, yy, LW, 84); x.strokeStyle = '#d6dbe2'; x.lineWidth = 2; x.strokeRect(24, yy, LW, 84);
      x.fillStyle = '#1e2a3a'; x.font = F(24, 'bold'); wrap(t, 40, yy + 34, LW - 40, 28, 1);
      x.fillStyle = '#7a8698'; x.font = F(16); x.fillText(`${12 + i * 7} replies · ${2 + i} days ago`, 40, yy + 66); });
    x.restore();
    /* the lineage chart: a teacher and his students, boxes and lines, no names that could be read */
    x.fillStyle = '#ffffff'; x.fillRect(LW + 48, 112, W - LW - 72, 420); x.strokeStyle = '#d6dbe2'; x.strokeRect(LW + 48, 112, W - LW - 72, 420);
    x.fillStyle = '#23423e'; x.font = F(18, 'bold'); x.fillText('Lineage', LW + 64, 138);
    const bx2 = (cx, cy) => { x.fillStyle = '#e4ece8'; x.fillRect(cx - 44, cy - 16, 88, 32); x.strokeStyle = '#7a9a90'; x.strokeRect(cx - 44, cy - 16, 88, 32);
      x.fillStyle = '#9ab0a8'; x.fillRect(cx - 30, cy - 3, 60, 6); };
    const cx0 = LW + 48 + (W - LW - 72) / 2;
    x.strokeStyle = '#7a9a90'; x.lineWidth = 2;
    for (const [a, b2] of [[[cx0, 190], [cx0 - 80, 280]], [[cx0, 190], [cx0 + 80, 280]], [[cx0 - 80, 280], [cx0 - 110, 380]], [[cx0 - 80, 280], [cx0 - 30, 380]], [[cx0 + 80, 280], [cx0 + 90, 380]], [[cx0 - 30, 380], [cx0 - 30, 470]]])
      { x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b2[0], b2[1]); x.stroke(); }
    for (const p of [[cx0, 190], [cx0 - 80, 280], [cx0 + 80, 280], [cx0 - 110, 380], [cx0 - 30, 380], [cx0 + 90, 380], [cx0 - 30, 470]]) bx2(p[0], p[1]);
    /* his finger on the pad: the arrow to the new thread, and its click */
    if ((o.cursor || 0) > 0) {
      const k = Math.max(0, Math.min(1, o.cursor)), cx = 820 - 520 * k, cy = 560 - 410 * k;
      x.fillStyle = '#111'; x.strokeStyle = '#fff'; x.lineWidth = 2;
      x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx, cy + 30); x.lineTo(cx + 8, cy + 23); x.lineTo(cx + 14, cy + 36); x.lineTo(cx + 19, cy + 33); x.lineTo(cx + 13, cy + 21); x.lineTo(cx + 23, cy + 21); x.closePath(); x.fill(); x.stroke();
      if (o.click) { x.strokeStyle = 'rgba(200,74,42,0.7)'; x.lineWidth = 3; x.beginPath(); x.arc(cx, cy, 18, 0, Math.PI * 2); x.stroke(); }
    }
  }
  /* HIS NOTEBOOK (the coda): the masters he has checked since, a line each — where, whose student, how many real
     accounts — and some crossed out. Initials, never a name: nobody real is judged in his book (v21.22) */
  function drawNames(x, o = {}) {
    const W = 1024, H = 640, n = Math.max(0, Math.min(7, o.n || 0)), r = rng(7213);
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.fillStyle = '#f8f4e8'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#e8dcc0'; x.fillRect(W / 2 - 3, 0, 6, H);                              // the spine
    x.strokeStyle = 'rgba(90,120,170,0.25)'; x.lineWidth = 1.5;
    for (let y = 70; y < H; y += 42) { x.beginPath(); x.moveTo(20, y); x.lineTo(W / 2 - 20, y); x.moveTo(W / 2 + 20, y); x.lineTo(W - 20, y); x.stroke(); }
    const rows = [['Ajahn K.', 'Lamphun', "teacher? won't say", true], ['Luang Phor T.', 'Ayutthaya', 'student of his abbot · 4 accounts', false],
                  ['Ajahn P.', 'online only', 'no temple · no teacher', true], ['Lersi W.', 'Nakhon Nayok', 'lineage traced · 3 accounts', false],
                  ['Ajahn S.', 'Singapore', 'only his own posts', true], ['Luang Phor B.', 'Surin', 'met devotees · 5 accounts', false],
                  ['Master L.', '?', 'nobody has met him', true]];
    x.fillStyle = '#1c2a6a'; x.textBaseline = 'alphabetic';
    x.font = `bold 30px ${BOOK_HAND}`; x.fillText('Checked', 40, 52);
    rows.slice(0, n).forEach(([who, where, note, out], i) => {
      const left = i < 4, x0 = left ? 40 : W / 2 + 40, y = (left ? 108 : 108) + (left ? i : i - 4) * 126;
      x.fillStyle = '#1c2a6a'; x.font = `bold 28px ${BOOK_HAND}`; x.fillText(who + ' — ' + where, x0, y);
      x.font = `24px ${BOOK_HAND}`; x.fillText(note, x0 + 14, y + 40);
      if (out) { x.strokeStyle = 'rgba(28,42,106,0.85)'; x.lineWidth = 3; x.beginPath(); x.moveTo(x0 - 6, y - 8 + r() * 4); x.lineTo(x0 + 400, y - 12 + r() * 4); x.stroke(); }
      else { x.strokeStyle = '#2f7a4a'; x.lineWidth = 4; x.beginPath(); x.moveTo(x0 + 410, y - 8); x.lineTo(x0 + 420, y + 4); x.lineTo(x0 + 440, y - 22); x.stroke(); }
    });
  }

  /* ====================================================== THE FILMS' CUES (§4, §8)
     Every sound is a literal cue the warm scan can read (v10.2: the time, then the quoted name); the pictures are the stage's (films.frame) */
  function introFilm(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api;
    const O = OPEN;
    c.keepFade = true;                         // it ends on black: the chapter card comes up over it (v14.1)
    c.endFade = 1;                             // (and says so: cineEnd sets the black to endFade before it reads keepFade, v24.21)
    step(0, () => stage.films.begin('open', c, api));
    tr(0, O.end, (k, t) => stage.films.frame('open', t, api), rawK);
    fade(0, 1.0, 1, 1); fade(1.0, 2.6, 1, 0);
    sfx(0.4, 'x2open', 0.75);                  // the fog's own music, under the whole film
    sfx(O.q2o1, 'q2o1', 1);                    // "When I returned to Singapore my mind became extremely foggy."
    sfx(O.cu2a1, 'cu2a1', 1);                  // "Boss, this one... from which temple ah? Who blessed it?"
    sfx(O.q2o2b, 'q2o2b', 1);                  // "Sorry... can you say again?"
    sfx(O.cu2a1b, 'cu2a1b', 1);                // "Aiyo, never mind. I come back another day."
    sfx(O.cu2a1b + SECS.cu2a1b - 0.6, 'x2heels', 0.5);   // her heels on the terrazzo, away
    sfx(O.q2o2, 'q2o2', 1);                    // "I could not think properly."
    sfx(O.o3 + 1.0, 'x2pat', 0.55); sfx(O.o3 + 2.1, 'x2pat', 0.5); sfx(O.o3 + 3.3, 'x2pat', 0.5);   // one pocket, the other, the back
    sfx(O.q2o3, 'q2o3', 1);                    // "I misplaced my wallet, and strangely..."
    sfx(O.o3 + 5.2, 'x2bagzip', 0.4);          // his bag's zip, opened and shut
    sfx(O.q2o4, 'q2o4', 1);                    // "I simply felt unlike myself."
    sfx(O.o4 + 0.4, 'x2ledhum', 0.3);          // the counter's lights, the only sound left near
    fade(O.black, O.end, 0, 1);
    sfxFade(O.black - 1.0, O.end - 0.05, 'x2open');
    sfxFade(O.black - 0.5, O.end - 0.05, 'x2ledhum');
    step(O.end, () => stage.films.end());
  }
  /* P3 · THE CALL (kit.film from play): it hands to the visit on black */
  function callFilm(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api;
    const C = CALL;
    c.keepFade = true; c.endFade = 1;
    step(0, () => stage.films.begin('call', c, api));
    tr(0, C.end, (k, t) => stage.films.frame('call', t, api), rawK);
    sfx(C.pick - 0.4, 'x2pickup', 0.6);        // the phone off the glass
    sfx(C.pick + 0.5, 'x2ring', 0.5);          // ringing in his ear: one ring-ring (Singapore's 0.4 on, 0.2 off, 0.4 on), and Pong answers before the next
    sfx(C.pg2c1, 'pg2c1', 1);                  // "Brother! Long time no reply. You OK or not?"   (the phone's band, CP10)
    sfx(C.q2c1, 'q2c1', 1);                    // "Not really. Since I came back... I can't think..."
    sfx(C.offer - 0.6, 'x2callmus', 0.6);      // a low pad under Pong's offer, opening up at "This one I can vouch for"
    sfx(C.pg2c2, 'pg2c2', 1);                  // "Bro... I know a famous ajahn who is good at clearing dirty things..."
    sfx(C.q2c2, 'q2c2', 1);                    // "Last time you said "trust me" also."
    sfx(C.pg2c3, 'pg2c3', 1);                  // "I know. Sorry, bro. That one I never met. This one, I was there with my mother."
    sfx(C.q2c3, 'q2c3', 1);                    // "...Bring him."
    fade(C.black, C.end, 0, 1);
    sfxFade(C.black - 0.8, C.end - 0.05, 'x2callmus');
    step(C.end, () => stage.films.end());
  }
  /* THE VISIT (kit.film, straight on from the call's black): the next evening */
  function visitFilm(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api;
    const V = VISIT_T;
    c.keepFade = true; c.endFade = 1;
    step(0, () => stage.films.begin('visit', c, api));
    tr(0, V.end, (k, t) => stage.films.frame('visit', t, api), rawK);
    fade(0, 0.5, 1, 1); fade(0.5, 1.6, 1, 0);
    sfx(V.knock + 0.1, 'x2knock', 0.7);        // a knock on the shutter, twice
    sfx(V.lift, 'x2shutterup', 0.75);          // Pong lifting it
    sfx(V.in + 0.3, 'x2steps', 0.45); sfx(V.in + 2.6, 'x2steps', 0.4);   // their feet on his tiles
    sfx(V.in - 0.4, 'x2visit', 0.6);           // the visit's music: plain, open
    sfx(V.q2v1, 'q2v1', 1);                    // "Eventually I approached another Thai practitioner I trusted..."
    sfx(V.pg2v1, 'pg2v1', 1);                  // "Lersi Chin, this is my friend. His shop."
    sfx(V.lc2v1, 'lc2v1', 1);                  // "Sawasdee krap. New shop... tired owner."
    sfx(V.mat + 0.2, 'x2mat', 0.6);            // the mat unrolled on the floor
    fade(V.black, V.end, 0, 1);
    sfxFade(V.black - 1.0, V.end - 0.05, 'x2visit');
    step(V.end, () => stage.films.end());
  }
  /* P6 · THE EXAMINATION (kit.film from play): it ends on play's own view, kneeling before him */
  function examFilm(c, s, api) {
    const { tr, step, sfx, sfxFade, rawK, stage } = api;
    const X = EXAM;
    step(0, () => stage.films.begin('exam', c, api));
    tr(0, X.end, (k, t) => stage.films.frame('exam', t, api), rawK);
    sfx(0.3, 'x2visitmus', 0.32);              // the visit's own bed, low, under the questions
    sfx(X.lc2e1, 'lc2e1', 1);                  // "Give me your hand."
    sfx(X.lc2e2, 'lc2e2', 1);                  // "You sleep?"
    sfx(X.q2e1, 'q2e1', 1);                    // "Not much."
    sfx(X.lc2e3, 'lc2e3', 1);                  // "Eat?"
    sfx(X.q2e2, 'q2e2', 1);                    // "When I remember."
    sfx(X.lc2e4, 'lc2e4', 1);                  // "The wallet... in the fridge?"
    sfx(X.q2e3, 'q2e3', 1);                    // "...Yes."
    sfx(X.lc2e5, 'lc2e5', 1);                  // "You saw a doctor?"
    sfx(X.q2e4, 'q2e4', 1);                    // "Yes. They said stress."
    sfx(X.lc2e6, 'lc2e6', 1);                  // "Mm. Good. Doctor first, always. Now, quiet."
    sfx(X.still + 0.4, 'x2breathslow', 0.4);   // his breath, slow, in the stillness (the fridge's hum under it)
    sfx(X.still + 3.2, 'x2breathslow', 0.35);
    sfx(X.lc2e7, 'lc2e7', 1);                  // "That one... from there?"
    sfx(X.q2e5, 'q2e5', 1);                    // "...Yes. I was told to put it facing the door."
    sfx(X.fetch + 0.1, 'x2rise', 0.5);         // up off the mat
    sfx(X.fetch + 0.9, 'x2steps', 0.4);
    sfx(X.fetch + 2.2, 'x2pickpiece', 0.5);    // the piece off its shelf
    sfx(X.fetch + 3.8, 'x2kneel', 0.5);        // down again before him
    sfx(X.lc2e8, 'lc2e8', 1);                  // "This one, you give to a temple. Don't keep, don't sell, don't throw."
    sfx(X.lc2e8 + SECS.lc2e8 * 0.86, 'x2cloth', 0.4);   // set on the clean cloth
    sfx(X.lc2e9, 'lc2e9', 1);                  // "According to my practice, I believe something negative was placed on you."
    sfx(X.q2e6, 'q2e6', 1);                    // "By him?"
    sfx(X.lc2e10, 'lc2e10', 1);                // "I didn't say that. I said on you."
    sfxFade(X.end - 1.2, X.end - 0.05, 'x2visitmus');
    step(X.end, () => stage.films.end());
  }
  /* P7 · THE CLEARING (kit.film from play, unskippable the first time): the chant captioned on its own breaths, from each
     line's own start (v21.31), so it works muted too; ends on play's view */
  function clearFilm(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage, kit: K2 } = api;
    const K = CLEARF;
    step(0, () => stage.films.begin('clear', c, api));
    tr(0, K.end, (k, t) => stage.films.frame('clear', t, api), rawK);
    sfx(K.lc2k0, 'lc2k0', 1);                  // "Hands together. Close your eyes."
    /* his eyes "closed": the picture dimmed (never black), and opened again as the fog lifts */
    fade(K.lc2k0 + 1.6, K.homage + 0.6, 0, 0.42); fade(K.lift, K.water - 0.6, 0.42, 0);
    sfx(K.homage + 0.4, 'x2candle', 0.5);      // the candles and the incense lit for his teachers
    sfx(K.namo - 0.6, 'x2clearmus', 0.4);      // the clearing's music, under the chant and never over it
    sfx(K.namo, 'lc2namo', 1);                 // Namo tassa bhagavato arahato sammā-sambuddhassa (×3)
    step(K.namo, () => { if (K2 && K2.captions) K2.captions(chantCaps('lc2namo')); });
    sfx(K.sak, 'lc2sak1', 1);                  // Sakkatvā buddha-ratanaṁ...
    step(K.sak, () => { if (K2 && K2.captions) K2.captions(chantCaps('lc2sak1')); });
    sfx(K.lc2sak2, 'lc2sak2', 1);              // Sakkatvā dhamma-ratanaṁ...
    step(K.lc2sak2, () => { if (K2 && K2.captions) K2.captions(chantCaps('lc2sak2')); });
    sfx(K.lc2sak3, 'lc2sak3', 1);              // Sakkatvā saṅgha-ratanaṁ...
    step(K.lc2sak3, () => { if (K2 && K2.captions) K2.captions(chantCaps('lc2sak3')); });
    sfx(K.lift + 0.2, 'x2lift', 0.45);         // the room's sound coming back clear as the grey goes (a soft opening of the air)
    sfx(K.lc2drink, 'lc2drink', 1);            // "Drink. A little."
    sfx(K.lc2drink + SECS.lc2drink + 0.3, 'x2sip', 0.5);
    sfx(K.sprinkle + 0.5, 'x2sprinkle', 0.55); sfx(K.sprinkle + 2.2, 'x2sprinkle', 0.55); sfx(K.sprinkle + 3.9, 'x2sprinkle', 0.5);   // the leaves dipped and flicked
    sfx(K.lc2wrist, 'lc2wrist', 1);            // "Your wrist."
    sfx(K.lc2wrist + 1.1, 'x2thread', 0.5);    // the cotton thread round it, knotted
    sfx(K.lc2k2, 'lc2k2', 1);                  // "Go to a temple this week. Make merit. If the fog comes back, doctor first, then me."
    sfxFade(K.end - 2.0, K.end - 0.05, 'x2clearmus');
    step(K.end, () => stage.films.end());
  }

  /* the ending's own frame and its end: the stage draws it; the card lies over the coda's last black */
  function endingScene(c, api, k, cues) {
    const { tr, step, rawK, stage } = api;
    const T = END[k], total = T.coda + CODA.end;
    step(0, () => stage.films.begin(k, c, api));
    tr(0, total, (kk, t) => stage.films.frame(k, t, api), rawK);
    cues(T);
    step(total, () => stage.films.end());
    c.endFade = 1;
    c.keep.view = true;
  }
  /* THE CODA's cues (every ending): the forum months later, the case file's last paragraph, the new thread opened */
  function codaCues(api, T) {
    const { sfx, sfxFade, fade } = api, C = CODA, t0 = T.coda;
    fade(t0 - 0.5, t0, 0, 1); fade(t0, t0 + 0.8, 1, 0);
    sfx(t0 + 0.3, 'x2codamus', 0.7);           // the coda's music: patient, the question still open
    sfx(t0 + C.q2K1, 'q2K1', 1);               // "Whether you interpret that spiritually or otherwise..."
    sfx(t0 + C.q2K1 + 3.0, 'x2scroll', 0.35);  // his finger on the pad, the list read down
    sfx(t0 + C.q2K2, 'q2K2', 1);               // "I research a master's lineage thoroughly..."
    sfx(t0 + C.q2K2 + 0.6, 'x2page', 0.4);     // the notebook's page turned
    sfx(t0 + C.q2K3, 'q2K3', 1);               // "And yet still, none of them could answer the question I actually carried..."
    sfx(t0 + C.thread + 0.1, 'x2ping', 0.5);   // a new thread at the top
    sfx(t0 + C.q2K4, 'q2K4', 1);               // "That question went unanswered for a long time..."
    sfx(t0 + C.open, 'x2click', 0.55);         // opened
    fade(t0 + C.black, t0 + C.end, 0, 1);
    sfxFade(t0 + C.black - 0.8, t0 + C.end - 0.05, 'x2codamus');
  }
  /* A · WORD GETS AROUND (worst) */
  function scWord(c, s, api) {
    const { sfx, sfxFade, fade } = api;
    endingScene(c, api, 'A', (T) => {
      fade(0, 0.35, 0, 1); fade(0.35, 1.0, 1, 0);                    // that night, alone (a cut in the black)
      sfx(0.5, 'x2endA', 0.6);                                       // the ending's music: tight, unresolved
      sfx(0.9, 'x2keys', 0.55); sfx(3.4, 'x2keys', 0.5);             // typing it
      sfx(T.q2A1, 'q2A1', 1);                                        // "Somebody has to warn people."
      sfx(T.q2A1 + SECS.q2A1 + 0.5, 'x2post', 0.6);                  // posted
      fade(T.days - 0.5, T.days, 0, 1); fade(T.days, T.days + 0.6, 1, 0);   // days later
      sfx(T.days + 1.4, 'x2ping', 0.45); sfx(T.days + 2.6, 'x2ping', 0.45); sfx(T.days + 3.7, 'x2ping', 0.45); sfx(T.days + 4.9, 'x2ping', 0.45);
      sfx(T.call - 1.6, 'x2buzz', 0.6); sfx(T.call - 0.8, 'x2buzz', 0.6);   // his phone: Pong
      sfx(T.call - 0.25, 'x2pickup', 0.5);
      sfx(T.pg2A1, 'pg2A1', 1);                                      // "Bro, why you post? His people calling me..."   (the phone's band, CP10)
      sfx(T.q2A2, 'q2A2', 1);                                        // "I know what I saw."
      sfx(T.pg2A2, 'pg2A2', 1);                                      // "You saw. You don't know."
      sfx(T.cust - 1.7, 'x2stepsin', 0.45);                          // a man's shoes coming up to the counter
      sfx(T.cu2b1, 'cu2b1', 1);                                      // "Eh, you the one who posted about that Thai ajahn?"
      sfx(T.q2A3, 'q2A3', 1);                                        // "I was sure enough to stay away from him..."
      sfxFade(T.coda - 1.2, T.coda + 0.2, 'x2endA');
      codaCues(api, T);
    });
  }
  /* B · NOT MY ROAD (good) */
  function scRoad(c, s, api) {
    const { sfx, sfxFade } = api;
    endingScene(c, api, 'B', (T) => {
      sfx(T.q2B1, 'q2B1', 1);                                        // "Lersi Chin... will you teach me? I see things. I don't know why."
      sfx(T.q2B1 + 1.2, 'x2bowl', 0.45);                             // the bowl set down
      sfx(T.look - 0.2, 'x2endB', 0.55);                             // the ending's music: warm, open (it holds the long look)
      sfx(T.lc2B1, 'lc2B1', 1);                                      // "Why you see, what it is for... that question is bigger than my practice..."
      sfx(T.lc2B2, 'lc2B2', 1);                                      // "Someone can. Not me. When you find him, don't take my word..."
      sfx(T.pg2B1, 'pg2B1', 1);                                      // "This time we check first, bro."
      sfx(T.go + 1.5, 'x2rise', 0.5);                                // up, his bag on his shoulder
      sfx(T.go + 2.0, 'x2steps', 0.45);
      sfx(T.go + 2.6, 'x2shutterup', 0.6);                           // Pong lifting the shutter for them
      sfx(T.q2B2, 'q2B2', 1);                                        // "He had cleared me. He could not tell me what I was for..."
      sfxFade(T.coda - 1.2, T.coda + 0.2, 'x2endB');
      codaCues(api, T);
    });
  }
  /* C · SEND IT BACK (bad) */
  function scBack(c, s, api) {
    const { sfx, sfxFade } = api;
    endingScene(c, api, 'C', (T) => {
      sfx(T.q2C1, 'q2C1', 1);                                        // "Lersi Chin... can you send it back? To whoever did this."
      sfx(T.stop - 0.2, 'x2endC', 0.5);                              // the ending's music: one low held note, then the weight of it
      sfx(T.lc2C1, 'lc2C1', 1);                                      // "I clear. I don't send."
      sfx(T.lc2C2, 'lc2C2', 1);                                      // "If I send, I carry it. If you ask me to send, you carry it also."
      sfx(T.pg2C1, 'pg2C1', 1);                                      // "Bro..."
      sfx(T.q2C2, 'q2C2', 1);                                        // "He did this to me."
      sfx(T.lc2C3, 'lc2C3', 1);                                      // "Maybe. Maybe not. Either way, you are clear now..."
      sfx(T.go + 1.4, 'x2rise', 0.5);
      sfx(T.go + 1.9, 'x2steps', 0.45);
      sfx(T.go + 2.5, 'x2shutterup', 0.6);
      sfx(T.alone + 0.1, 'x2shutter', 0.7);                          // the shutter pulled down behind them
      sfx(T.q2C3, 'q2C3', 1);                                        // "I wanted him to feel what I had felt..."
      sfxFade(T.coda - 1.2, T.coda + 0.2, 'x2endC');
      codaCues(api, T);
    });
  }
  /* D · ENOUGH (best) */
  function scEnough(c, s, api) {
    const { sfx, sfxFade, fade } = api;
    endingScene(c, api, 'D', (T) => {
      sfx(T.q2D1, 'q2D1', 1);                                        // "Thank you, Lersi Chin."
      sfx(T.lc2D1, 'lc2D1', 1);                                      // "Go well. Make merit when you can."
      sfx(T.pg2D1, 'pg2D1', 1);                                      // "Bro, go eat something?"
      sfx(T.go + 0.2, 'x2rise', 0.5);
      sfx(T.go + 1.6, 'x2steps', 0.45);
      sfx(T.go + 2.3, 'x2shutterup', 0.6);
      sfx(T.go + 3.0, 'x2corridor', 0.5);                            // the mall's corridor at night, empty, their steps in it
      sfxFade(T.morning - 0.6, T.morning, 'x2corridor');
      fade(T.morning - 0.5, T.morning, 0, 1); fade(T.morning, T.morning + 0.7, 1, 0);   // the next morning
      sfx(T.morning + 0.1, 'x2endD', 0.6);                           // the ending's music: bright, unhurried
      sfx(T.morning + 0.2, 'x2shutterup', 0.7);                      // his shutter going up on a clear morning
      sfx(T.morning + 3.2, 'x2pat', 0.5); sfx(T.morning + 3.75, 'x2wallet', 0.5);  // his pocket — and the wallet in it
      sfx(T.cu2a2 - 1.6, 'x2heelsin', 0.45);                         // her heels coming back up to his counter
      sfx(T.cu2a2, 'cu2a2', 1);                                      // "Boss, this one... from which temple ah?"
      sfx(T.q2D2, 'q2D2', 1);                                        // "This one? A temple in Ayutthaya. The card is inside, let me show you."
      sfx(T.q2D2 + 0.5, 'x2case', 0.45);                             // the cased piece lifted from the tray
      sfx(T.q2D3, 'q2D3', 1);                                        // "I had enough to decide. There was nothing more worth proving."
      sfxFade(T.coda - 1.2, T.coda + 0.2, 'x2endD');
      codaCues(api, T);
    });
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e4c2 = Object.assign(DATA, {
    build,
    scenes: [scWord, scRoad, scBack, scEnough],
    intro: introFilm,
    films: { call: callFilm, visit: visitFilm, exam: examFilm, clear: clearFilm }
  });
})();
