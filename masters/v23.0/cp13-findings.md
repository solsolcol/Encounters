# v23.0 CP13 — the review lenses' findings, each verified before it is touched

Status: FIXED (in the working tree, to be built and re-checked), KEPT (verified, left as designed — why), NOTE (Chad's
call — goes in the report), OPEN (verified, still to fix), REFUTED (checked against the code or a photograph).

## PURPOSE lens (a reader who did not write the words)
- P1 teach A said "Kumanthong are regarded in traditional belief as Yin" — the misconception the chapter clears.
  FIXED: "the old belief holds that a spirit is Yin and a living person Yang" (§2.3 14 stays Chad's call).
- P2 ow5monk's "they come of their own free will" said as fact (one "We believe" at the end). NOTE (a re-take).
- P3 ow5little ("left at a temple gate") vs ow5yin ("a Luang Phor gave them a home"). REFUTED: he was left at the
  temple's gate and taken in there; nobody knows where he came from BEFORE it. Consistent.
- P4 the core's "for life" without the return clause. NOTE (the card and ow5promise carry it).
- P5 openPress's `kit.objective(null)` played OBJECTIVE COMPLETE on each opening. FIXED: `{ complete: false }`.
- P6 COME BACK reads as the little one dragging him under. KEPT: the plan's §4.5 is exactly this ("the little one's
  light holds on… tugs him back", a parting, never a fight), approved.
- P7 the shy one scurries behind him. KEPT: plan line 1151 ("a game, never a scare").
- P8 ending A's giggle and slow turn to the shy one. KEPT: plan §4.8 A at 33.0 verbatim.
- P9 ending C's eye-glints pulse while he wishes. FIXED: held still (0.6).
- P10 film M's monk "in shadow". REFUTED by photograph (his face lit warm); the stale comment corrected.
- P11 the bonk. KEPT: plan §4.4 at 26.0 (his head on the desk, "Ow—!").
- P12 B's stranger left unanswered. NOTE (a change to B's story).
- P13 "help their owners" only said, never shown. NOTE (a D years beat would show it).

## SOUND lens
- S1 none of the 25 play lines warmed (sayLine speaks a cold line silently after 1.6 s). FIXED: warmSounds(the 25).
- S2 A's k5endA runs to 63.2 over the epilogue (drum stopped at 56.4); B's k5endB to 69.6. FIXED: both faded with the
  black; A's drum turns slower until 57.9.
- S3 C's k5boxfast under k5boxstop (two keys). FIXED: faded at c7.
- S4 the yield has none of its designed sound (k5loosen never cued; beds never sink). FIXED: the riser starts on the first
  hold, heard only while held, once a yield; the room's beds sink by 1 − 0.6·k (eased, so the film finds them returning).
- S5 k5pour 14 s for short pours: (a) the water in play, (b) D's top-up, (c) D's temple. (b)(c) FIXED (sfxFade);
  (a) FIXED: it played AFTER the cups were full; it starts on the hold's first progress, is heard only while the water
  moves, and goes as the third cup fills.
- S6 D's k5lullaby plays on into the temple. FIXED: faded at the court's dissolve.
- S7 the water bed drops under COME BACK (look SURFACE). FIXED: little = BLUE or SURFACE.
- S8 z5come is a whisper sent through his compressor. FIXED (WHISPER_TAKES; 38 % voiced, under vpick's 47–56 %).
- S9 long one-shots fired in play (k5lullaby, k5after, k5pour) survive the title, a restart, the selector. FIXED in the
  engine: worldSfx keeps its sources and the title and restart() bring them down (stopWorldSfx, beside stopLiveVoices).
- S10 film K's read: 10.7 s of room tone only. FIXED: the lullaby's theme softly under the reading, gone before he speaks.
- S11 (a) A's afternoon fan-only, but the plan's A table says "the fan, the day bed". FIXED (DRAINED: day bed 0.16 +
  fan 0.15). (b) the home film's weeks flicker the beds every 0.38 s. FIXED (held like D's years).
- S12 B's second k5type runs past POST. FIXED.
- S13 the opening walk's steps: footfalls only in the take's first 3.75 s. FIXED: cued every 3.9 s.
- S14 plan items with no sound (the pulls' "Stay…" echo; the giggle panned left; D's box's last notes). NOTE.

## WORDS lens
- W1 the desktop COME BACK brief: "move the mouse up" does nothing (the drag needs the button held). FIXED (both briefs say drag).
- W2 z5time "Almost three hours... gone." vs the clocks (23:33 → 02:47 is 3 h 14 min). FIXED (23:49).
- W3 the cap's care test (too fast foams) never stated. FIXED ("gently", "slowly").
- W4 three panels show the same words twice (label = step word: STAMP, PEEK, the box). FIXED (titleStamp, titlePeek, titleBox).
- W5 the owner's card bullets a continuation line (card13/card14). FIXED (a line after a comma takes no bullet; NEVER lines set as rules; lines fitted).
- W6 the sheet is behind (teach A, the measured lengths). CP14 (sheet v121).
- W7 the new teach A's misplaced clause. FIXED.
- W8 card line C ("I stopped giving to them") vs ending C's altar filling. NOTE (a re-take).
- W9 teach B: "take one in" with no noun; opens with the card's own sentence. FIXED.
- W10 objWater is a noun phrase. FIXED ("Give them water, then drinks · n/3" — one phone line).
- W11 teach C's dangling participle; the core's "kept… kept" and "it". FIXED.
- W12 teachings and core far longer than the rest of the game. NOTE (Chad's, THE LESSON LINE).
- W13 ending B's screens, D's envelope, Ma's missed calls not on the sheet. NOTE (world art by v14.5's precedent; movable on Chad's ask).
- W14 B's phone shows 02:47 and 6:58 at once. FIXED (06:58, then 07:02).
- W15 B's share count goes down (1,289 → 1,206). FIXED (capped at 1,206; also stepped 12×/s, G6).
- W16 the shop's calendar May 2026 vs October 2025. FIXED (ตุลาคม 2568).
- W17 the first receipt "(her portrait)". FIXED ("the young lady / of the amulet").

## ENGINE lens
- E1 a skip before an eventWait/event step starts the event after the film, in play (COME BACK). FIXED (main.js sceneApi; comeDone ignores a skip).
- E2 players who sealed e3c4 during the preview are locked out of e3c5 at release. FIXED (main.js boot: a done save with a next chapter moves to it).
- E3 craft/yield/surface ignore pointer ids (a second finger breaks the gesture). FIXED (ONE_FINGER).
- E4 surface: a press before its first running frame skips its setup. FIXED.
- E5 W/↑ released during a surface stays held. FIXED (keyup clears keys first).
- E6 craft's too-fast check overstates speed when moves are sparse. FIXED (over the moves' own time).
- E7 a ?ch= deep link's noSkip films never become skippable. FIXED (SEALED_NOW).
- E8 the hidden left prayer arm keeps the last pose's turn; ch1 D and ch3's clasp start from it. FIXED (prayArmRest).
- E9 craft's briefing picture fixed per kind. NOTE (latent).

## SAVE AND RESUME lens
- R1 the home film leaves the sticks as burnt stubs (homeF.end). FIXED (stubShow in end and careReset).
- R2 = E1.
- R3 open1 written before the question; PLAY I receipts before their lines. FIXED.
- R4 the care award lost (third receipt before the award) or paid after a foam (foam not a receipt). FIXED ('foam' receipt; saved together).
- R5 shyLive.peeked never cleared (k5peek silent on later runs). FIXED.
- R6 the first-arrival look skipped on normal arrivals (p === 'counter'). FIXED.
- R7 a Continue during the touch leaves him off his mark. FIXED.
- R8 films M and K's receipts written before the film (a closed app skips their words). FIXED (written when the film ends).
- R9 no handler checks r.aborted. FIXED: all five event handlers stop on an abort (a Retry's reset ran first, then the
  aborted handler marked the act done in the fresh run).

## RIGS, POSES AND FILMS lens
- F1 = R1.
- F2 = E1.
- F3 the home film's door swings shut through the camera (30.0–30.8 s). FIXED: it shuts from T.lamp2 + 1.2, the lens 1 m
  from the hinge (the leaf sweeps 0.82).
- F4 a skip of ending B in its phone shots leaves the phone on the lens under the card. FIXED (the epilogue's first frame
  puts it down).
- F5 the temple monk never moves (chapter 4's nod lost in the copy; his teaching line said by a statue). FIXED: his head
  lifts to him as he speaks and dips on each phrase (mk5teach measured 0, 2.80, 5.12, 8.06 s; the verse chapter 4's).
- F6 the shy and little films hand play a different view and eye height with no black. FIXED: both end on a short black,
  which the kit's fade (and the aftermath's) lifts.
- F7 a skip of film K leaves the owner gesturing silently ~20 s. FIXED (films K and O end his talk and his nod).
- F8 the red film's hands jump twice (hips → reach, reach → rest). FIXED: the reach blends from the hips and lets go over 0.5 s.
- F9 kit.smear called in two films but never drawn in 'cine'. FIXED: the calls are gone (a cine flag would change pictures
  already photographed).
- F10 D's temple kneel has no joined hands (plan §4.8 D 40.0). FIXED (the clasp, from his eyes; the teaching's side shot cuts it).
- F11 the shy one's scuttle passes under the chair's seat. FIXED with the geometry lens's G3 (the chair shoved aside as he
  reaches it); to be re-photographed.
- F12 the endings build their props on screen (v14.15). FIXED: every one built at build(), and each swapped map hung on a
  hidden scrap the curtain warms.
- F13 the years: the first day after each temple flash keeps the temple's light. FIXED (and endLook forgets fLight's memory).

## GEOMETRY lens — what was fixed (each fix's comment in e3c5.js says what was measured; the lens's own numbering is in
the session transcript, not repeated here)
- stood up from the desk chair he was inside its blocker column — he could turn and never walk: STAND_UP, a glide off it
  (an arrival walktest floods from).
- the music box was a solid block, its comb buried: a base, four walls, a felt lining, the works inside.
- the shy one's scuttle ran 2–8 cm under the chair's seat and out through it: the chair is shoved aside as he reaches it.
- the lamp's pool and the laptop's glow hung 0.23–0.30 m past the desk's edge over the chair: drawn back onto the desk.
- six of C's seven extra drinks stood 1.6–2.4 cm in a cup or a bottle: ±0.13 clears each.
- the corridor's ends lay in the room's wall plane (stripes through the door wall): begun 6 mm behind it.
- the books' spines faced the wall; books and cartons six draws each: the spine to the room, groups merged.
- the window's states were painted on first use (three in 1.5 s on screen): all painted at build, warmed on scraps.
- the incense sticks stood 4 mm over the sand: 1 cm lower, the embers following.
- the aircon's louvre and LED were inside the unit at its back: at its front.
- the counter's three drew their 361k far level at 1.1 m: the lightest from 0.9 (distAt); copies never in a macro, noNear.
- the doubles were built on the possession's first frame: built when each child lands, warmed under the curtain.
- the old blanket's top 1 cm over the new: one cloth (below).

## FILMS' VISION REVIEW — what was fixed
- the opening film's glance fell on a pillar at a phone's centre: a bearing to the shutter; the door push-in re-aimed.
- the beckon read as nothing (his talking take alone): a nod, twice.
- the bedside clock read 22:50 under a dusk sky: 19:24, then 22:50.
- the desk's bag still held the counter's bundle weeks later: a plain white carrier of drinks.
- the sand bowl read as a cupcake case: a turned bowl. The jug a faceted cone: a smooth pitcher. The tin car a blockout:
  an extruded little car. The pillows plates: cushions. The blanket a stack of boxes: one rumpled cloth.
- on a phone the resting hand covered half the bundle on the glass: a lower look on a phone.
- to re-check on the next photographs: the hair specks on the three, the owner's face under the HUD on a phone.

## COUNTER'S VISION REVIEW — what was fixed
- the touch's hand read as a fist on a phone and a tube over his face on a desktop: no hand at all, the lens leans in
  (Chad's bottle ruling).
- film K's lens chased the owner's head bone: a quarter of its sway.
- the cloth's grid notched the card's corner in film K's macro: flat 2.5 cm past the card.
- the bundle read as a red balloon: deeper folds, gathered toward the knot; the paper bag's knot on it.
- the three cast no shadow: a soft contact shadow under each.
- the temple panel flickered behind the monk (coplanar with the dado's gold strip): 1.5 cm in front. Chapter 4's identical
  panel is Chad's v23.1 note.
- the dais flame stood in the candle's wax: each flame on its own candle's tip (0.41 × its scale).
- the monk's crossed feet over his cushion's ends: 0.74 deep.
- the card's mark: on its edge. The NEVER lines set as rules, a line after a comma unbulleted, every line fitted.
- NOTE: chapter 4's merit film has the same two flame heights (+0.34 at s 1.4, +0.26 at s 0.9). Left alone, outside
  Chad's notes on that scene; in the report.
