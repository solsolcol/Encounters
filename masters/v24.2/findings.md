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
