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

## THE FILMS' SECOND VISION REVIEW (v22.9's photographs, phone and desktop) — what was fixed
Two reviewers read every film frame of v22.9, each finding checked against the code before it was touched.
- the opening film's door push (HIGH): his eyes held on the owner all along the glass put the gold name across his face
  (暹 on it at 20.0 on a phone, the name across his waist at 20.5) and the shut leaf's 8-sided pull hung by the lens.
  His eyes go where he walks now, along the glass to the door's MIDDLE and in as BOTH leaves swing out to his sides
  (their edges never come nearer x 0 than they start: 0.4 m off the lens at the closest), and to the owner once he is in
  the doorway, where no glass stands between them. The film 22.0 → 22.8 s.
- O1's last 0.7 s had the owner's head behind the door's right jamb on a phone (the walk ran on at full pace to the cut):
  he slows to a stop 2.5 m short of the door's middle (an eased walk, its steps fading as he slows), the owner in the
  right leaf's clear glass for the last second.
- O2's mullion (x 2.6) stood down the left third of a phone's frame for four seconds: the lens 0.55 m to its right,
  the mullion 22° off his eyes — outside a phone's 18.6°.
- the beckon read as nothing — and in the PHOTOGRAPHS it never could: the nod and the talking take ran on WALL time and
  every probe pauses the film to shoot it, so by the frame the gesture was long over. His near hand comes up toward the
  corridor now, palm down, and flaps three times (the Thai "come"), aimed per bone in his body's frame after the mixer
  and put back before it writes again (the v11.5 law); the hand and the nod are posed by the FILM's clock (the v6.4 law),
  so a seek, a pause and a slow phone show the same arm.
- the corridor's far end was a bare wall in a phone's frame for the walk's first five seconds (chapter 5 walks the
  other way from chapter 3's): a second lift lobby, the first mirrored.
- the home film's bag of drinks popped onto the desk with the lens still on it: a close insert as it is SET DOWN, lowered
  into the frame from its top (the hand above the frame), its sound on the landing.
- the closing shot cut the red one and the little one at a phone's edges, their faces 40 px under a window that filled
  60 % of it: a narrow screen comes lower and nearer and goes along them in the lamp's light.
- the weeks from the bed were a thin band on a phone: a narrow screen draws in to 48°/46° (the three 0.85 m fill nine
  tenths of its width).
- the first stick's insert had no smoke: aimed at the bowl, the frame's top stood 0.1 m over the tip; aimed up the stick.
- the drink's cap read as a flat red lid with the straw pushed through it: the tamper ring was a CLOSED disc over the
  bottle's mouth, wider than its neck — an open band round the glass under the mouth now, the cap's skirt reaching down
  over the mouth to meet it.
- the roll of bubble wrap read from the door as a glass capsule, a ghostly blob on the floor (see-through at 0.85, in a
  chapter about spirits): opaque, its two ends the darker grey of a sheet rolled on itself.
- CHECKED, NOT A BUG: the day/night cycle of the weeks "never moved" between 15.2 and 17.3 and 24.1 and 25.7 — the
  frames were one 2.28 s day apart and the last two inside the afternoon's held shot. It turns, a step every 0.38 s.
- LEFT, with the reason: the corridor's column passing the frame mid-glance (a pan past a pillar, 0.3 s); the grocer's
  half-sphere fruit and its sign under the letterbox (small, far, a passing shot); the little one's hair as specks at a
  distance (Chad's scan keeps every strand as a strand — a 35k cut broke them into specks at CP4, and an opaque strand
  thinner than a pixel aliases at any cut: the cost of his model at its own detail); the owner's collar (his scan's own
  atlas, three chapters old); the garlands as beads, the riser's highlight, the pins over the receipts' titles, a pixel
  step in the calendar's edge (each small, each a passing frame).

## PLAY'S VISION REVIEW (v22.9's photographs of the offerings and the openings, phone and desktop) — what was fixed
Every frame of PLAY I and PLAY II read on a phone and a desktop; each finding checked against the code before it was
touched, and every fix photographed again on the build that carries it (v23.0).
- the beckon, again (the films' review had made it a flap of the near hand): straight out over the counter it read as a
  man showing his stock, and aimed at the lens it foreshortened to a bar across his belly. The near arm goes 45° off the
  line to the glass, toward the corridor at his left where the one he calls stands, the hand at his shoulder, palm down.
- a carried drink and the three sticks hung beside an OPEN hand, which read as a hand that had let go of them (Chad's
  bottle ruling: no grip is drawn that cannot be made right): the engine's `kit.hold` takes `bare`, and the hand's model
  goes while the thing is carried and comes back the moment it is let go (`fixturetest` proves both halves).
- on a phone a hands-on panel stands under the stat bars, to 39 % of the height: at the desk it lay over the straw as it
  slid in and bent — a narrow screen aims 5 cm higher there, so the bottle stands lower in the frame; and in PEEK-A-BOO
  it lay over the shy one in the gap between the fingers, the very thing the game is about — a hands-on kind may stand
  `low` (at the foot of the screen, as chapter 4's events can), and PEEK does.
- standing up from the sand reset his look to the level, and on a phone the frame held the block outside the window,
  the next child under its bottom edge: his eyes go down to the next one waiting, and the order comes once the look has
  arrived.
- the glint, at 5 cm and near-white, sat between the red one's eyes like a third eye, glowing on his scowl: a catch-light
  now, smaller and warm, at one eye.
- the place marks stood at the runner's height, between two of the three from where he stands and over the next one's
  shoulder: raised over each child's head — and, photographed again, still a third of the way to the next one, because
  the mark is drawn over the hotspot's own point and that was the drink's place, before the child and to his side. The
  hotspot is anchored on the child now; the tap box stays on the drink's place.
- the laptop's white page sat behind the stat bars at the desk on a phone, and their cream words vanished into it: its
  screen in a dark theme.
- the music box's key was on the far end, hidden behind the box from the mat, and the wind's ring was drawn over the
  owner's card: on the end toward the mat. Photographed again, the little one's pinwheel stood exactly on the line from
  the mat to the key (1.2 cm off it), its stick through the wind's ring: his toy and his saucer of sweets change sides,
  the pinwheel 2 cm further over, clear of ending C's last toy packet.

## THE ENDINGS' PHOTOGRAPHS (v22.9's, a phone, every 2.5 s of all four) — what was fixed
- ending C's last shot, under "They were only children... and I had turned them into a wishing well.", held the middle
  one alone on a phone, the other two cut by its edges: a narrow screen stands 0.42 m further back from the mat.
- CHECKED, NOT A BUG: the epilogue's last eighteen seconds are black in every ending — the case file's own last words are
  said over it under the lullaby, as the plan has it (§4.9).

## PART 2's CHECKS, on the release build (v23.0, deploy 6ae0698bba55723a21ff6151)
- The photographs, again, on the build that carries every fix above: the opening film's beckon (four frames on a phone);
  the offerings on a phone and a desktop, every step (47 frames each); the three openings on a phone and a desktop (48
  each); ending C's closing shot on a phone. No page error in any of them.
- THE REAL-TAP PLAY-THROUGH on a phone (dbg-e3c5flow.mjs, OPT D): Start to the card by real taps and drags — the film,
  the counter's seven orders, films M and K, the bag and the home film, the offerings, the three openings (the STAMP
  tapped, the PEEK dragged, COME BACK drawn up), the decision tapped, ending D and its card: PASS, 67 lines heard in
  order, none over another, no page error. Its first run stalled at the second drink — the probe's own race, not the
  game's (LEARNINGS: read a hint's place only after the frame that places it).
- CONTINUE from a real save at every phase, on a phone, through the title (dbg-e3c5cont.mjs): a run that finished
  chapter 4 while chapter 5 was a preview now continues into chapter 5's start; the counter, the counter after the gift
  ("Read his card"), the offerings at their start, after the red one's drink (1/3), and after the sticks ("Sit with
  them"), the sit, the three openings, the aftermath and the decision each land where they should, in their world, with
  their order and no page error.
- THE EPISODE-COMPLETE CARD on a phone and a desktop (dbg-e3c5epcard.mjs): chapter 4 → chapter 5 in the run; the five
  chapters tallied, the episode ranked and CASE CLOSED; the trail's next case is episode 4, "not yet written — come back
  for it"; back to the title with the run marked done.
- THE DESKTOP PLAY-THROUGH by real input (v23.1's build, 27 Oct; dbg-e3c5flow.mjs VIEW=desktop OPT=C FILM_WAIT=1500):
  Start, the opening film, the counter's orders pressed with the reticle and E, films M and K, the bag and the home
  film, the offerings by mouse drag (the caps twisted, the straws slid and bent, the sticks lit and waved out, the box
  wound), the three openings, the decision clicked, ending C and its card: PASS, no page error (the desktop runs muted,
  so the voice log is the phone run's). Its first run "stalled" after E on the bundle — the press had landed; a
  1280 × 800 software render under load drew a frame every 4–8 s and the chapter clock (0.5 s a frame at most) ran
  the owner's 31 s of lines at a sixteenth of real time, past the probe's 300 s wait (LEARNINGS, v23.1). Measured alone
  at 0.22–0.25 frames a second, the film began on the second predicted.
