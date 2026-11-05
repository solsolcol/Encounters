# v24.49 · Grandmaster Pho: the last of it — the plan and the log

Prepared, not a build: nothing deployed, the live build stays v24.40. Builds on v24.48 (masters/v24.48/PLAN.md and
make.sh: every fault of v24.47's robe traced and fixed, read blind twice).

## Chad's words (5 Nov 2026), verbatim

After v24.48's report, which ended: "I can keep going on the white hem bits, the thigh sliver and the hidden hands. Each
round of fixes plus a full review takes about two hours. Should I?"

> Yes, fix all of it

A correction said out loud: that report named the takes with the thigh sliver as "the first Charged cast, the sword
slash and cast_8"; the count says cast_6, not cast_8 (masters/v24.48/PLAN.md step 12).

## What "all of it" is (v24.48's report, its count and its forty readers' notes)

1. THE WHITE BITS AT THE HEM. Small white jagged bits along the bottom of the hem, the fault the readers name most in
   every take (795 notes against his saved file's 802). Worst where the two takes still lose to his saved file: talking
   with hands open (5 better / 10 the same / 12 worse) at the hem's back corner above his right heel, seen from behind and
   from his right; the first Charged cast (4 / 6 / 17) along the hem by his heel. Drawn in their own colours (step 13 of
   v24.48): the hem's own bottom band, stretched up to 1.56 times in every direction at once.
2. THE SLIVER OF THIGH at the front overlap of the robe: the first Charged cast, the sword slash and cast_6 (six floating
   pieces, 374 px in all).
3. SITTING CROSS-LEGGED, HIS HANDS. They rest on his knees in the take and sink out of sight into the robe over them; the
   robe pulled in toward his legs let his knee through instead (v24.48 step 6).

Also counted, and not a fault of the robe: his heel below the long hem, seen from behind and above (six pieces in
talking and the second Charged cast). A long robe shows the heel; it is left unless a reader names it as wrong.

## How each is found and proven (as v24.48)

What each is made of first (tools/probes/phoid.mjs, and the cloth's own particles at that moment: robesim SIMDUMP), so the
fix is aimed at the cause. Every fix an option whose unset value gives v24.48's file byte for byte; tried on the takes it
can change (a two-take or few-take trial) before the whole file is built; then the whole file counted on all 180 moments x
6 sides, the moments named photographed full size, and all 540 pictures read blind against his saved file AND v24.48.

## The log

**Step 1 · the white bits at the hem, what they are made of.** Talking with hands open (v24.48 step 13): the hem's own
bottom band at the back corner above his right heel, stretched up to 1.56 times as the hem flares round his calf. The first
Charged cast, seen from behind by his right heel (0.667 s, phoid with the hips' rest place added to its listing): the
crumpled white and grey shards inside the lifted hem are TWO layers — the back of the robe's own wall (119 triangles) and,
1-5 cm in front of it, scraps of his scan's lining facing in (71 triangles), up to 4.7 cm above the hem with a ragged top
edge: the views of tools/robeshell.mjs kept what a view from beside the hem grazed. The cloth itself lies smooth there
(its particles never fold: neighbouring normals within 47 degrees) and stretched 2.4-3.1 times round, as the target's
own flare; his saved file stretches the same triangles 2-3.4 times (his chains' flare), but its lining is whole.
- robeshell HEMKEEP=0.02 (HEMKEEPIN 0.03): the rolled edge — the strip under the wall and the lip it turns into — kept
  whole within 2 cm of the wall's lowest point round him (11,062 triangles, 3,629 given back), and left alone by RIM and
  FLOOR. Two-take trial: the talking back corner close to his saved file; the Charged shards unchanged.
- robeshell HEMLINING=0.06 (HEMLININGFACE 0.3, HEMLININGFRONT 70 degrees): the lining facing in within 6 cm of the hem
  taken out, outside his front's 70 degrees either side (v24.48: the panels' own edges there). With the band's lip too
  (3,989 more triangles) and without it (HEMLININGBAND=1, 609 more): inside the lifted Charged hem only the back of the
  wall is left (182 triangles of it and 13 of the strip in the box that held both layers); the talking corner's white
  bits are smaller in both. Kept: HEMLININGBAND=1, so the hem keeps the thin dark rolled edge readers called clean in his
  saved file (v24.48 step 10).

**Step 2 · the sliver of thigh at the front overlap, what makes it.** The first Charged cast at 0.958 s (the cloth's
particles dumped): below his left knee the targets a leg holds inside it are pushed 13-25 cm out from the robe's shape,
while the row above, over the thigh, stands 2-9 cm out; the cloth between them is stretched 6.4-7.4 times down its
length, and his thigh shows through the front overlap there (four moments; the sword slash and cast_6 one each).
- robesim PUSHSPREAD=n (PUSHSPREADTAKES to limit it): the push each target takes out of his legs spread to the targets
  round it (n passes, each the mean of its four neighbours' push where that is larger than its own), then every target
  pushed out of his legs once more and its path checked as before. Trial on the three takes, walking and running.

**Step 3 · sitting cross-legged, his hands.** The cloth dumped at 1.5 s with his arms' bones: carried by his legs at its
whole rest distance, the robe's front stands 5-12 cm over his forearms and hands (rows 15-19, the panel that hung loose
before his shins), and his palms, 4.7 cm over his thighs near the knees, are under it.
- robesim LAPDROP=n (in the LEGWRAPTAKES): each target standing over a level leg lowered straight down onto it (its
  thickness, the margin and the robe's layers there) and the drop spread to the targets round it (n passes, never less
  than its own) — cloth laid on a lap. On the dumped targets, 6 passes bring the cloth over his hands to 0-4 cm above
  their middle line. Trial on the floor sit.
