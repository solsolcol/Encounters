# v24.2 · episode 3 chapter 5 debug — every finding, its verdict, and its fix

Verdicts: CONFIRMED (read against today's code or measured — fixed), PARTIAL (part of it real — the part fixed),
REFUTED (not real — why), NOTED (real, left with the reason). OPEN until a verdict is written.

## v24.1 (shipped)
- H1 · BLOCKER · a long press opened the browser's menu and cancelled every hold (the water, the lighter, the three
  openings). CONFIRMED by dbg-e3c5hold.mjs on the live v24.0; FIXED in v24.1 (contextmenu refused, user-select none).
- H2 · MAJOR · a held finger credited a quarter second a frame at most: at a frame a second a 1.2 s hold took five.
  CONFIRMED (0.83 of the pour after 3 s held); FIXED in v24.1 (`e.wdtHeld`).

## L6 · words and purpose
- L6-1 · MAJOR · the water's order returns unchanged after the water is poured ("Give them water, then drinks · 0/3"),
  after an OBJECTIVE COMPLETE — reads as "the water did not count": a second way to be "stuck at the water offering".
  And the bag of drinks posts a COMPLETE before any drink is made. CONFIRMED (careObjective returns objWater for both
  'water' and 'drink'; atDeskDrink calls kit.objective(null)). FIXED: objWater "Give them their water", a new objDrinks
  "Make their drinks · {n}/3" (careObjective splits them), and the bag's press clears with { complete: false } — one
  COMPLETE per drink, at its place.
- L6-2 · minor · teaching B "without knowing what it asks of them" — "it" reads as the Kumanthong asking. CONFIRMED.
  FIXED: "…without knowing what caring for one asks of them."
- L6-3 · minor · teaching C opens a sentence "Keep them for wealth" and says "kept … kept". CONFIRMED. FIXED: "taken
  in with compassion are kept…", "If you keep them for wealth, care turns into a bargain…"
- L6-4 · minor · the core's one "he" (the keeper) in a lesson to "you". CONFIRMED. FIXED: "by the merit made for them"
- L6-5 · minor · objSticks says "incense" where the badge, the line and the card say "stick". CONFIRMED. FIXED: "Give
  each one his stick · {n}/3"
- L6-6 · minor · the desktop twist words never say to hold the mouse button; yieldWhereKey leaves out Space (which works:
  evKey sets keyHeld for Space). CONFIRMED. FIXED: briefCapKey and event.craftTwistKey say "hold the mouse button and
  drag"; event.yieldWhereKey "Hold the mouse button, E or Space"
- L6-7 · minor · COME BACK's keys "W or ↑ quickly" — a held key climbs once (repeats dropped), so it must be struck
  again and again. CONFIRMED. FIXED: "tap W or ↑ again and again" (brief and event.surfaceWhereKey); the briefs drop
  their leading "COME BACK —" (the panel's title says it).
- L6-8 · minor · z5children's registry description names a touch CP13 removed. CONFIRMED. FIXED.
- L6-9 · minor · card line C "I stopped giving to them" contradicts ending C (he gives more each night, with a wish
  under each) — CP13 W8, noted then for a re-take. CONFIRMED: re-take z5C as "Every gift came with a wish. I only
  kept asking." (with the sound work; the card's text changes with the take, never before it).
- L6-10 · trivial · COME BACK's give-up path gets noteHard ("It took everything to come back") when the light came down
  to him. CONFIRMED. FIXED: noteLight "The light had to come down for you." on r.gaveUp.
- L6-11 · trivial · Ma's voicemail screen reads 0:07 / 0:11 for a 5.51 s message. CONFIRMED. FIXED: 0:03 / 0:06.

## L2 · save and resume (no blocker, no major — every phase string lands right)
- L2-1 · minor (latent) · comeDone banked a note on an ABORTED result (the one handler the CP13 R9 rule missed;
  unreachable today — COME BACK runs inside a film). CONFIRMED by reading. FIXED: returns on r.aborted.
- L2-2 · minor · a Continue from the little one's film (saved as it starts, after sitAgain) put him back BY THE DESK
  with "Sit with them" again. CONFIRMED (openResume('open3') always landOn('desk')). FIXED: sitAgain writes
  `open3:mat`; openResume and toWorld keep the tag; lookToOrder looks at the little one from the mat.
- L2-3 · cosmetic · the counter's receipt comments and plan §10.1 said yin/card are written as the film STARTS (they are
  written as it ENDS since CP13 R8); §10.1's open3 said 23:33 (the code says 23:49). CONFIRMED. FIXED (both).
- L2-4 · cosmetic (unreachable) · endReset put back the bottles' material, not ending A's liquid levels. CONFIRMED.
  FIXED (scale.y = 1).
- NOTED · a receipt reaches storage at the next autosave (8 s throttle; a film forces one at its start): a phone closed
  inside that window replays the beat. Engine-wide design; never pays twice.

## L4 · the engine since v23.0 (no blocker, no major; the episode-complete card into e4c1 works)
- L4-1 · minor (latent) · applyState's ledgerLoad had no anyEp, so a Continue into an episode-3 chapter CLEARED the
  episode-4 ledger the save carried, and the next autosave wrote it away (the comment promised the opposite).
  CONFIRMED (main.js applyState vs the boot's `ledgerLoad(s.ledger, true)`). FIXED: `ledgerLoad(st.ledger, true)`.
- L4-2 · cosmetic · v24.1's held credit counted the WHOLE frame a finger was down at, so on a phone at a frame a second
  two quick taps could "hold" the water. CONFIRMED by reading. FIXED: credited from the later of the last frame and the
  press (`e.downWall`).
- L4-3 · cosmetic (latent) · CHCTX.warmSounds reads `packJson` from inside build(), above its `let` (a dead-zone throw
  in the source; esbuild makes it `var`, so harmless as shipped). CONFIRMED. FIXED: declared `var`, as the bundle has it.
- L4-4 · NOTED (by design) · e3c5 is no longer the last chapter, so it downloads e4c1 ahead while it plays (models from
  8 s after the curtain lifts, low priority; e4c1's 14.4 MB sound pack at the decision, held undecoded through the
  endings). Data Saver honoured. Worth knowing if a phone-heat report comes from e3c5's endings.

## L1 · input and play logic (no further hard soft-lock; two traps that feel like one)
- L1-1 · MAJOR · the twist was read only beyond 40 px of the cap, and the game DREW the circle to trace at 38 px (the
  dashed guide, and the demo fingertip): a player tracing the guide barely turned the cap — all three drinks (540°,
  720°) and the music box key, all required. CONFIRMED (shell.html .cpath 76 px wide; cTwist translateX(38px);
  main.js craft minR 40). FIXED: the guide drawn at a 64 px radius, outside the progress ring, the fingertip on it;
  minR 28.
- L1-2 · MAJOR · five "!" marks the chapter turns him to stood out of reach (the bag 2.07 / 2.33 m against 1.9, the
  packet 2.44 against 1.9, the shy one's and the little one's places 1.61 / 1.86 against 1.6, the little one's sand
  1.72 against 1.6): a tap on them did nothing. CONFIRMED (hotspotTap refuses d >= radius; marks drawn to 16 m).
  FIXED: drinks and packet 2.8, places and sands 2.0 (each press seats or kneels him itself).
- L1-3 · minor · after the shy one's film "Sit with them" while he is rooted by the desk: the stick does nothing. NOTED:
  he is sitting on the floor (rooted is right), the mat's "!" is in reach (1.42 m) and in his view, and BYDESK is
  inside the chair's column — unrooting him there would leave him unable to step anyway.
- L1-4 · minor (desktop) · the E (or the click) that opened a hold, still held, was not the hold — nothing filled until
  a second press. CONFIRMED (evKey dropped every repeat; a click's held button never reached the overlay). FIXED: a
  key's first repeat, and a mouse button still down on the event's first frame, begin a craft's hold or a yield (never
  a briefing's START; a key held over from a step before stays needUp's).
- L1-5 · minor · marks outside their own aim cones (the drink places' "!" over his head, 0.21–0.28 rad off a 0.18
  cone; the counter's children 0.14–0.17 off 0.09): E or a click on the "!" offered nothing. CONFIRMED. FIXED: place
  aim 0.32, counter children 0.14 (overlapping cones go to the nearer, by fraction).
- L1-6 · minor · the mat's "!" up for ~1.5 s after the third stick while its handler refused (careBusy). CONFIRMED.
  FIXED: !careBusy in its enabled().
- L1-7 · cosmetic · after the red and shy ones' films the order and its marks were posted on the black; after sitAgain
  "Sit with them" stayed 1 s with the little one already pressable. CONFIRMED. FIXED: wDark holds them until the fade
  lifts; sitAgain posts its COMPLETE at once.
- L1-8 · cosmetic · (v24.2's own L2-2) a Continue into open3:mat posted "Sit with them" then "Open yourself to the
  little one", a false COMPLETE. CONFIRMED by reading. FIXED: seated before toWorld posts the order.
- L1-9 · low (latent race) · a play-time camera turn (viewTo) or lean still in flight when a film starts kept writing
  the camera on a clock frozen under the film. CONFIRMED by reading. FIXED: under 'cine' both are voided.

## RT · the real-input play-through (v24.1, a phone, every gesture by CDP touch)
- RT-1 · MAJOR (a hot phone) · stuck at "Wave the flames out": the craft's FLICK read its timing from when the handlers
  RAN (performance.now), so at a frame a second a flick's down and move were handled a second apart and every flick was
  "too slow" — the run stood there for 900 s. CONFIRMED by its photograph (50-failed.jpg: the flick step, 2/3 of the bar).
  The v24.0 tap rule, met again in a gesture. FIXED (engine): `evStamp(e)` — the input event's own timeStamp — handed by
  the overlay's pointerdown and pointermove through evPress/evMove to the craft's swipe; the probe's flick now carries a
  real finger's timestamps (CDP `timestamp`), as a phone's touches do.

## L5 · geometry and framing (13; every one checked against the code at the quoted line, the framings by projection)
- L5-1 · MAJOR · ending D's "three threads of smoke rise STRAIGHT" (d5) dollied IN and held one thread on both screens
  (outer tips ±1.09 → ±1.49 desktop, ±3.7 → ±5 phone). CONFIRMED (projection, scratchpad l5/fixshots*.mjs). FIXED: it
  dollies OUT — a phone from 1.16 m behind the mat (tips ±0.89 → ±0.85), a desktop from 0.12 with the look 10 cm higher
  (±0.63 → ±0.56, the threads climbing in frame).
- L5-2 · minor · d14, the image the best ending leaves on, held the shy one alone on a phone (±1.28). CONFIRMED. FIXED:
  0.6 m back there (c11's way): faces ±0.78, sides ±0.91.
- L5-3 · minor (desktop) · marks outside their own cones: (a) the counter's three (0.142–0.164 off 0.14) — FIXED, markY
  +0.03 (0.105–0.128, the next one's 0.198 away); (b) the places — already FIXED by L1-5's 0.32; (c) the mat's aim point
  at the seated eye, 0.36–0.39 off from standing and 0.495 off the look the game hands him by the desk — FIXED, the aim
  point on the rug (0.35), its "!" where it was (0.6). Reach is measured on the floor (nearestHotspot), so nothing else moves.
- L5-4 · minor · ten shots whose comments name the three (or a prop) held one child on a phone: c3, c4, c7, c9, b12, d1,
  d2, a6, d4, d11 (and c7's box was off a desktop too, 1.08). CONFIRMED (projection). FIXED: the wide ones stand back on
  a phone (c3 0.6, d4 0.45, d11 0.3); the close ones SLIDE along the three on a phone, each in its turn (`zAlong`: c4,
  c9, b12, a6, and d1/d2 following each stub and stick as it is moved), a desktop unchanged; b12's desktop 16 cm back
  (its red tip was off at −1.07); c7 holds the embers, the three and the box on a desktop (worst 0.66) and on a phone
  starts on the three and turns to the box as it slows.
- L5-5 · minor · COME BACK's gauge stood inside the top panel on a phone, its goal line behind the panel's words.
  CONFIRMED (shell.html: #evSurface top 26vh against the panel's 192 px + its height). FIXED: on a phone it starts 124 px
  under the panel's top padding, 40vh tall (a desktop unchanged).
- L5-6 · minor · after the shy one's film he sat inside the desk chair: end() put it back onto him. CONFIRMED. FIXED:
  the chair stays where the film pushed it (chairShoved — end() and a Continue into open3 by the desk) and goes home in
  sitAgain, behind him from the mat, and in the resets.
- L5-7 · minor · the little one's close-up was shot straight down his own smoke thread (0.16–0.21 m from the lens).
  CONFIRMED. FIXED: a thread within 0.30 m of the lens is not drawn (his ember is under the frame there; in play he never
  stands that close).
- L5-8 · cosmetic · ending D's three lights: the halos through the bodhi's leaves, the cores hidden by them for the last
  2.5 s of the climb. CONFIRMED. FIXED: the cores too (depthTest false, drawn after), as chapter 4's merit film was
  ruled at v23.1.
- L5-9 · cosmetic · the slippers wholly inside the wardrobe, the switch and socket half in it, the backpack 10 cm into it
  and in the door's swing. CONFIRMED (the boxes' extents). FIXED: the slippers before its left door, the switch and
  socket in the 11 cm of wall between it and the door, the pack against its front at its right end (1.1 m from the hinge).
- L5-10 · cosmetic · the bottle caps on the desk turned over INTO the wood (0.5 mm showing); the incense packet, on its
  edge, half its width in the desk. CONFIRMED (DT is the slab's centre; the flip and the quarter-turn). FIXED: the cap's
  height goes up from the wood; the packet 18 mm higher in both places. (Sleeves, medium: left.)
- L5-11 · cosmetic · the three stood 2 mm inside the riser's gilt cap and their soft shadows under it, never drawn.
  CONFIRMED. FIXED: KID_BASE, 2 mm over the gilt, for the three and their doubles.
- L5-12 · cosmetic · ending A's riser dust hung 9.75 cm over the altar through the shy one's bottle; the "dust in his
  hair" was inside the hair. CONFIRMED. FIXED: on the gilt; on the crown.
- L5-13 · cosmetic · ending D's walk to the hall rose 0.45 m over the flat courtyard and stopped 0.8 m short of the steps.
  CONFIRMED. FIXED: it climbs only over the flight and stops on its top step at the door (from z 8.0, so the pace stays
  a walk).

## L3 · sound and timing (v24.3 — the full report is L3-sound-report.md; the sound it asked for is make.sh)
- L3-1 · medium · COME BACK's music (one 20 s take) played out under its own brief on a first play and ran out on a slow
  climb. CONFIRMED (the cue at T.come − 0.4, before the film pauses for the event). FIXED: k5climbloop, a bed raised by
  the event's `onBegin` (START) and following his level (0.17 → 0.32 as he climbs 0.18 → 0.92), down at surfaceStart;
  the one-shot k5climb retired (its file, its row).
- L3-2 · medium · ending A's box was faded at two-thirds speed and its stop never heard. CONFIRMED. FIXED: k5endA re-made
  5.0 s long (fates2.py) and cued as the key has turned (51.85, stopping 56.85, before the black); the drum follows the
  take's rate exactly; z5A5 → 43.0 and z5A6 → 48.6 so the box's last three seconds and its stop are in the clear.
- L3-3 · low-medium · the box's drum turned in silence — at the counter for minutes after its 24 s tune, in the room
  through the question and the openings, and on a Continue into open1–decide. CONFIRMED. FIXED: the counter's tune is a
  loop (k5boxloop, two phrases, its own ring over the joint) while the box plays, panned to it, a little under film K's
  music; in the room the box RUNS DOWN where a third phrase would begin (k5boxdown, the drum easing to a stop with it);
  openResume stills the drum.
- L3-4 · low-medium · the question's held tone came in 17 s after the question. CONFIRMED. FIXED: held from the question
  (phase 'sit' with openLive.busy).
- L3-5 · low-medium · his bedroom footsteps were the engine's shoes on concrete. CONFIRMED. FIXED: stepSound → k5step
  (a byte copy of e4c1's barefoot step: both of this chapter's own takes were 99 % sub-bass).
- L3-6 · low · k5glint warmed and never played. CONFIRMED. FIXED: glint(i) plays it; the yield's glint goes through glint.
- L3-7 · low · the box key turned in silence, its ratchet after. CONFIRMED. FIXED: a k5key click every 30°, the lid's
  creak (k5lid) where the ratchet was.
- L3-8 · low · film M's chant died at 12.6 and the hall had no sound. CONFIRMED. FIXED: k5madeM (it holds through the
  hall) and World M's own night bed (k5templenight) in the film; D's temple its own dawn bed (k5court).
- L3-9 · low · the red one's march ran at full under his small hurt line. CONFIRMED. FIXED: faded over T.flop..+1.0,
  one small stamp left.
- L3-10 · low · the home film's rain and koel were inaudible under z5pro3. CONFIRMED. FIXED: both in the gap after the
  line, the rain at 0.8.
- L3-11 · low · ending A's phone buzzed on Ma's first word. CONFIRMED. FIXED: both buzzes before her voicemail.
- L3-12 · low · a hesitant first yield outlasted its riser in silence. CONFIRMED. FIXED: a heartbeat under every yield
  (k5heart, synthesized — both generated takes were sub-bass and irregular), rising with the hold.
- L3-13 · watch · two whispers sit at the music's level. NOTED: both survive through their breath (62 % and 70 % of
  their energy over 3 kHz, where no bed has any); left as they are.
- L3-14 · note (engine) · menu dings inside the rituals (evResolve's uiconfirm). NOTED: an engine change for every
  chapter — Chad's call, put to him.
- THE CORE FINDING · the room was ~10 dB quieter than the rest of episode 3 and had no ambient one-shots. FIXED: every
  bed raised to −34…−37 dBFS when nobody speaks; new beds (the shop after closing, World M at night and at dawn, the
  grey afternoon); music for every beat that had none (the opening, the counter, film M, film K's asks, the home film,
  the offerings' second loop, the decision, COME BACK, each ending); stings on the turns (the reveal, the promise, each
  drink given, each return); the hands' acts (the cups, the chair, the kneel, the flame, the key and the lid, the mat,
  the wrap, the bag, the phone at 02:47); and the room's and the mall's own noises on a seeded stream (e3c3's ambTick).
