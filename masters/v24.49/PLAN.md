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

**Step 4 · the push spread tried, and not taken.** Trials on the three takes with walking and running (6 passes) and on
the three alone (12 passes), counted on their moments x 6 sides against v24.48: the first Charged cast's floating leg
pieces 4 (248 px) -> 3 (136) -> 1 (111), the sword slash's 1 (71) -> 2 (79) -> 1 (62), cast_6's 1 (55) -> 1 (27) -> 1 (27);
but cast_6's shin came through the robe at the knee (0 -> 37 -> 71 points), and at 1.556 s the Charged cast's sliver grew
(29 -> 111 px). Looked at with the depths: the knee is BEHIND the cloth there (1-5 cm), seen through the slit along the
edge of the wrap's outer panel, which ends about 50 cm up at his front-left; the spread moves the slit between moments
and does not close it. tools/robesim.mjs is again v24.48's (only its debug dump now also writes his arms' bones).

**Step 5 · the lap laid down tried, and not taken.** One-take trial (LAPDROP=6): the robe over his lap came down by about
5 cm near his hands, to his wrists, and the hands stayed mostly under it, while his knees came out through its sides
(floating leg pieces on the nine moments 9 -> 76, seen now from his left, his right and behind-left too; legs through the
cloth 7,606 -> 9,722). Of the earlier ways: pulled in toward his legs (v24.48's hug), the knee came through at the front.
What would show his hands needs his hands raised onto the robe (about 10 cm at his fingertips on today's lap, his
forearms then near level) or a thin lap the robe's own layers cannot make: both change him, so they are his to choose.

**Step 6 · the final file (masters/v24.49/make.sh): v24.48's with the hem fix of step 1.** robeshell RIM, FLOOR, INNER,
ISLANDS as v24.48 with HEMKEEP=0.02, HEMLINING=0.06, HEMLININGBAND=1; robesim and prepmonk as v24.48.
The shell (sha1 ccd4b67d): HEMKEEP keeps 11,062 triangles of the rolled edge whole (3,629 given back), HEMLINING takes
609 more of the lining, RIM 435, FLOOR 1,181 (v24.48's 1,674: the band is left alone now), INNER 302, ISLANDS 39 scraps
of 162. The cloth (761a83df) keeps 95,858 of 264,800 keys; SKINPUSH moved 454,783 robe points (the most any needed, 5.0 cm). The
file: 560,638 -> 168,190 triangles, 19 takes, 8,664,648 bytes (sha1 bd33efcb; v24.48's 8,624,964).
- The proofs, with the final code: robeshell with RIM alone on v24.47's graft gives v24.47's pho_shell.glb (51104ba9);
  with v24.48's options on v24.48's graft, v24.48's (e681032f); robesim with v24.48's options on v24.48's shell gives
  v24.48's pho_cloth.glb (fbd6786e) — byte for byte, all three.

**Step 7 · the count, 179 moments x 6 sides (v24.48 / v24.49).** Floating leg pieces 26 / 26 (7,720 / 9,132 px: the
floor sit's gap at the front of his lap, where his crossed shins show, 120 px larger in each of its nine moments; two
gone in cast_4 and one in cast_7, one new in running and one in talking from behind and above, his heel); legs through
the cloth outside the floor sit 413 / 445; torn robe triangles 54,459 / 60,497 (the rolled edge kept whole, stretched
round a flared hem, counts as torn); the robe seen inside out 1.24 / 1.20 million px.

**Step 8 · read blind against his saved file, all 540 pictures, twenty readers** (review/vs-saved; the pictures dealt
to the readers interleaved this time, so each take is read by many readers, not one): better in 366, the same in 120,
worse in 54 (v24.48: 347 / 78 / 115). Better in 17 takes — talking with hands open now 12 / 15 / 0 (v24.48 5 / 10 / 12),
running 36 of 36, both chair sits 27 of 27 — and about even in 2: the first Charged cast 7 / 11 / 9 (v24.48 4 / 6 / 17)
and mage_soell_cast 8 / 13 / 6. None worse. Faults named: 1,034 in the new file against 1,454 in his.

**Step 9 · the first final read blind against v24.48, all 540 pictures, twenty readers** (review/first-vs-v2448; step 8
moved to review/first-vs-saved): better in 318, the same in 190, worse in 32 — talking with hands open 27 of 27, the
first Charged cast 15 / 12 / 0, the floor sit 0 / 27 / 0. Most of the 32 name one thing in the new file: a grey spiky
fan, a "comb" of streaks, between his legs from the front, in the three chair sits (Sitting_Answering_Questions 9 / 11
/ 7, Sit_Shout 10 / 12 / 5, Sit_Cheer 8 / 15 / 4) and a few casts. Photographed (Sitting_Answering_Questions at 4.03 s
from the front): at the bottom of the back hem seen between his shins, where v24.48 shows small white bits, the first
final shows a grey comb. Mine: HEMKEEP as first written also kept the band out of FLOOR's reach, and FLOOR's cut by each
shin (493 triangles fewer: 1,674 -> 1,181) is what took the old floor's first centimetres there. Now opt-in
(robeshell HEMKEEPFLOOR=1); trial without it on the three chair sits, the Charged cast and talking.
- Trial without it (the three chair sits, the first Charged cast, talking; FLOOR takes 2,029): the comb is gone — the
  back hem between his shins is v24.48's again — and the Charged hem behind his heel and talking's corner keep the fix
  (photographed beside v24.48 and the first final); on those five takes' moments x 6 sides, floating leg pieces 8
  (1,667 px) against v24.48's 7 (1,638) and the first final's 9 (2,051).

**Step 10 · the final file built again without HEMKEEPFLOOR (masters/v24.49/make.sh as written).** Chad's rule that a
check is made once where it can catch something, never repeated after each tweak: the count is made on all 179 moments
x 6 sides again (it is a machine's), and only the pictures that changed from the first final are read blind again,
the new file against the first, by readers who are not told which is which.
- Which pictures changed: all 540 (by 6,804 to 82,537 pixels, half of them by more than 30,692 — a change to the shell
  moves the cloth's particles everywhere, as it did between v24.48's two finals). So all 540 are read blind, the final
  against the first final only (twenty readers, dealt interleaved as in step 8): the two reviews of steps 8 and 9 stand
  for the first final, and this one says whether the final keeps them.
- A correction said out loud: "179 moments" (step 7 and above) and v24.48's "180" are the same count — the plan lists 180
  and one of them, the first Charged cast at 0.667 s, twice; the counts are of the 179, the pictures of the 180.

**Step 11 · the final file and its count.** The shell (sha1 3bb281b3): HEMKEEP keeps the same 11,062 triangles of the
rolled edge whole (3,629 given back), HEMLINING takes 609, RIM 435, FLOOR 2,029 (v24.48's 1,674, the first final's
1,181: the given-back edge between his shins is FLOOR's again), INNER 302, ISLANDS 42 scraps (175 triangles). The cloth
(59fabc9d) keeps 95,466 of 264,800 keys; SKINPUSH moved 439,744 robe points (the most any needed, 5.0 cm). The file
(masters/v24.49/prep/pho_final.glb): 559,777 -> 167,933 triangles, 19 takes, 8,654,336 bytes (sha1 1e228754).
- The count, 179 moments x 6 sides (v24.48 / the first final / the final): floating leg pieces 26 / 26 / 33 (7,720 /
  9,132 / 8,687 px) — outside the floor sit 17 / 17 / 17 (2,768 / 3,062 / 2,744 px: two gone in cast_4 and cast_7, one
  more in the first Charged cast at 0.933 s, one new in running from behind and above, his heel); the floor sit 9 / 9 / 16
  (4,952 / 6,070 / 5,943 px): the gap at the front of his lap where his crossed shins show, 89 px larger than v24.48's in
  each of its nine moments, and, new, a hairline of his shin in a crease of the lap at the front of his left knee, seen
  from his left in seven of them (25-29 px of the count's 600-px picture of a 1.5 m square, about 5 mm across; drawn
  again with every piece marked, it is not there in v24.48's count, but in the photographs from his left a sliver of skin
  as small shows in that crease in v24.48 too). Legs through the cloth outside the floor sit 413 / 445 / 421; torn robe triangles 54,459 / 60,497 / 58,931
  (the rolled edge kept whole, stretched round a flared hem, counts as torn); the robe seen inside out 1.24 / 1.20 / 1.27
  million px.

**Step 12 · the final file read blind against the first final, all 540 pictures, twenty readers** (review/final-vs-first):
the first final better in 203 pictures, the final in 27, the same in 310; faults named 1,592 in the final against 1,405.
Every take leans to the first final, the chair sits too (Sit_Cheer 2 / 15 / 10, Sit_Shout 1 / 15 / 11,
Sitting_Answering_Questions 4 / 16 / 7, final / same / first). The first final's wins name one thing again and again:
small white shards and torn strips along the hem by his legs — over the front shin, at both ends of the front hem, under
the side hem, above the heel — where FLOOR, given the rolled edge back, cuts it by each shin. The final's wins are the
chair sits' comb, gone. The comb's cure cost more than the comb.
- Where the comb is made (phoid on the first final, Sitting_Answering_Questions at 4.028 s from the front, the box
  round the comb): 60 triangles at 217-244 degrees round his hips (behind his right calf), riding the hem's row of cloth
  bones there (Cloth_10_09 and Cloth_11_09 at 225 and 248 degrees), 1.4-3.2 cm round him from the hem band's triangles
  that FLOOR takes when it may: of the 848 band triangles FLOOR takes, 125 lie behind the line of his two shins (all at
  180-270 degrees), 723 in front of it and at his sides (577 by his left shin) — where the shards are.
- robeshell HEMKEEPFLOORBACK=1 (with HEMKEEPFLOOR=1): FLOOR takes the band again behind his shins only (126 triangles:
  FLOOR 1,307). Trial on the three chair sits, the sword slash, the hand-on-hip talk and cast_4 (the takes the readers'
  notes name most), every picture a reader named set beside the first final and the final: behind his shins it is the
  final (the comb gone to the small white bits v24.48 had there), everywhere else the first final (the front hem over his
  shin, both ends of the front hem, the side hem and above the heel clean; cast_4's torn hole at the back of the hem not
  there); counted on its 54 moments x 6 sides, the first final's numbers within a few triangles (floating leg pieces 1,
  through the cloth 45, torn 17,978).
- The first final's recipe proven: robeshell with HEMKEEPFLOOR=1 on v24.48's graft gives the first final's shell byte
  for byte (sha1 ccd4b67d).

**Step 13 · the third final: the first final with HEMKEEPFLOORBACK=1** (built as masters/v24.49/make.sh would with it).
The shell (sha1 e0b97ccf): FLOOR 1,307, ISLANDS 42 scraps (177 triangles), 560,497 triangles kept. The cloth (4530ba70)
keeps 95,820 of 264,800 keys. The file (masters/v24.49/prep/pho_final2.glb, sha1 ca8c0cc8).
- The count, 179 moments x 6 sides (the first final / the third): floating leg pieces 26 / 35 (9,132 / 12,121 px) —
  outside the floor sit 17 / 18 (3,062 / 2,872 px: the first Charged cast at 1.556 s and talking at 1.667 s clean, new
  in the second Charged cast at 2.933 s from behind and above and three small ones in cast_7 at 0.467 s, 26-46 px); the
  floor sit 9 / 17: the gap at the front of his lap where his crossed shins show larger (about 1,000 px a moment against
  690) and the 5 mm hairline of shin from his left in eight moments. Legs through the cloth outside the floor sit 445 /
  419; torn robe triangles 60,497 / 60,443; the robe seen inside out 1.20 / 1.22 million px.
- Read blind against the first final, all 540 pictures, twenty readers (review/third-vs-first): under way.
