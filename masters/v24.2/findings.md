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
