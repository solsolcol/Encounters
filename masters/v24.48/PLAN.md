# v24.48 · Grandmaster Pho: fix all of it — the plan and the log

Prepared, not a build: nothing deployed, the live build stays v24.40. Builds on v24.47 (masters/v24.47/PLAN.md, make.sh:
real legs under a robe made cloth, reviewed blind against his saved file).

## Chad's words (5 Nov 2026), verbatim

After v24.47's report (the six large before/after pictures; better in 11 takes, even in 2, worse in 6; the floor sit's
three options; the six worse takes, which could wait for chapter 3's choice of takes):

> Fix all of it

Read as: every fault the report named is to be fixed now, none left to chapter 3's choice of takes; and the floor sit
is to be made to work (his reply picks none of the three options, and "fix" is not "leave it out" or "swap in the old
robe").

## What "all of it" is (the report's list, and the blind review's notes, masters/v24.47/review)

1. SITTING CROSS-LEGGED: his crossed legs bare in front, the robe torn into shards and sheets in his lap.
2. TALKING WITH HANDS OPEN: the lower robe puffed out round his legs into a sack, its hem curled in.
3. THE SWORD SLASH: a tear at the waist fold showing skin; torn shards at his hip; shards inside the back hem.
4. THE TWO CHARGED CASTS: torn shards and a doubled, ragged hem inside the hem by his feet; skin through a slit at the
   robe's front; the robe ballooning.
5. CAST_8: a dark tear across the top of the robe's rear panel; the upper robe's hanging end flared into a stiff flat
   sheet over his right thigh.
6. EVERYWHERE A HEM LIFTS: small crumpled grey bits and white specks inside it.
7. THE CHAIR SITS (and two crouching casts): his knee seen through the robe's front pocket.
8. A FEW MOMENTS: thin slivers of leg just above the hem.

## How each is found and proven (as v24.47: large single shots, counted, then read blind)

Before anything moves, each fault is pinned to the triangles it is made of (drawn with their numbers as colours at the
moment and side a reader named it), and those triangles' rest place, layer, facing and skinning read — so the fix is
aimed at what the picture shows. Every fix: its option unset gives the old file byte for byte; counted on all 180
moments x 6 sides (tools/probes/pholegs.mjs); the moments the readers named photographed full size; at the end all 540
pictures read blind against his saved file AND against v24.47.

## The log

**Step 1 · what each fault is made of (tools/probes/phoid.mjs, new).** The picture framed exactly as clipsheet's large
shots, drawn a second time with every triangle coloured by its own number; the triangles inside a box listed with their
rest place, stretch and bones, and the picture written with them tinted red; and the cloth bones' turns compared with
their neighbours'.
- *The shards and tears* (the sword slash's waist fold, cast_8's rear panel, the Charged casts): robe triangles stretched
  2.5-4.7 times between cloth bones turned apart — at the sword slash's lunge neighbouring bones stood up to 172 degrees
  apart, and even talking 20-56. Each bone's turn was read from the two pairs of particles next to it (2-3 cm away), so
  it followed every crumple of the cloth; where it strayed past 30-60 degrees from the robe's own it was switched to the
  robe's, so two neighbours could be turned by a whole crumple apart.
- *Why the cloth crumpled at his hip in the lunge*: the thigh's collider was a capsule whose round end at the hip joint,
  as thick as the top of the thigh plus the margin and the robe's layers (up to 17 cm), reached above the waistband: it
  held the cloth just under the waist ring up to 7 cm ABOVE the ring, folded back on itself.
- *The sack* (talking with hands open): the cloth stood 2-5 cm out from the robe's own shape round his hips and knees —
  held out by the depth of the robe's layers (median 3 cm, 336 of 1,344 cells at the 5 cm cap) wherever a leg was near,
  even standing still. (The robe's own shape also spreads up to 9-10 cm at the hem in that take: his stance; his saved
  file's robe does the same.)
- *The crumples and white flaps inside a lifted hem*: a slice through either shin at rest shows the FLOOR of the robe's
  old opening — where his scan's robe was fused to his shins it curls in under the hem and runs on as a sheet up through
  the inside of his new leg to its axis at about 25 cm. Hidden in the leg at rest, it came out of it whenever the leg
  moved, and it was most of what was counted as "leg through the cloth".

**Step 2 · the fixes, each an option (unset: the old file byte for byte — robesim with none of them set rebuilt
v24.47's pho_cloth.glb, sha1 e93ab6d0).**
- robesim TURNFIT: each cloth bone's turn fitted to the whole patch of cloth it carries (shape matching, Mueller's
  iteration from the frame before) and TURNSMOOTH=4: averaged four times with its neighbours'. The sword slash's
  neighbours now stand at most 29 degrees apart (172 before); the waist-fold tear and the hip shards are gone.
- robesim HIPOPEN (the thigh open at the hip joint) and TOPTAPER=0.3 (its reach thinned toward the hip, to 0.4 at the
  joint): the cloth under the waistband no longer pushed up and over itself.
- robesim RESTCAP: no leg pushes the cloth further from it than the cloth hangs at rest (the sack's padding);
  SKINPUSH=0.008: after the bones are placed, the robe's own points skinned as the game skins them against his legs'
  own points, and the bones moved out only where a robe point lies within 8 mm of the leg or inside it — the robe moves
  only where a leg truly meets it. (RESTCAP alone let his thigh through the back of the robe talking: 4x the legs
  through the cloth; with SKINPUSH, fewer than v24.47.)
- robeshell FLOOR=0.02: the floor of the old opening taken out (below 32 cm, within 11 cm of a shin's axis, more than
  2 cm inside the robe's own wall above it, lying flatter than upright: 1,674 triangles). Without the "flatter than
  upright" test it took the front under-panel too and opened holes at his front-left.
- robesim WAISTCAP (no cloth above the waist ring) was tried for the lunge and taken back out: with the open hip and the
  taper it changes nothing there, and in the chair sits it held the lap down into his thighs (sit-to-stand: his knees
  out over the robe, 975 leg edges through it against 2 without it).
- Counted on the sword slash and talking (18 moments x 6 sides, against v24.47): legs through the cloth 1,405 -> 171,
  torn 3,160 -> 2,241, robe seen inside out 79k -> 44k px, floating leg pieces 0 -> 4 (565 px: his heel seen behind
  the hem, the inside of the back hem between his legs). Talking now hangs straight from the side, as his saved file.

**Step 3 · the floor sit.** Sitting cross-legged his hips are 4 cm off the floor and his waist below the tops of his
knees: no robe hanging from the waist can fall over them. Tried and not taken: the robe's shape from his rig's legs
(both robes are fitted to his own file's robe in that take, which rides his hips: it lies behind and under the real
legs, and they are bare); that shape carried onto the real legs by the turn between the rig's knee and the real one
(14 and 10 degrees); the hem riding the real shins (his saved robe's hem rode his shins — but his ankles tuck under the
opposite knees and the hem went there); free cloth with his legs folding slowly inside it (one thigh covered). Taken:
robesim LEGWRAPTAKES — the robe carried by his real legs as a skirt skinned to its wearer's legs (the waist's share
down to 4-16 cm under the ring, then each side's thigh and shin by nearness at rest): his legs start inside the robe and
stay inside it, the robe between them spanning his lap — both legs covered from every side for the first time.

**Step 4 · the hem's underside and lip, and loose scraps (robeshell HEMBASE, ISLANDS).** With the floor gone, what was
left inside a lifted hem was the strip about a centimetre wide that closes the bottom of his scan's robe wall, facing
straight down, and the lip it turns into, facing in. When the hem flares (walking, the casts' wide steps) the hem ring
stretches round and that strip, seen from behind and below, stretched up to 2.2 times into the ragged white splinters
along the bottom of the hem (his saved file has them too).
- The strip alone taken out: the lip behind it came loose and floated under the hem in white bits. So HEMBASE=0.045
  takes out, within 4.5 cm of the robe's lowest point round him, every triangle facing down and the lip facing in; and
  ISLANDS=40 takes out any scrap of the skirt left joined to nothing else and smaller than 40 triangles.
- The first cut took the lip facing in all the way round, and anything facing sideways: at his front, where the robe's
  wrap overlaps, those are the panels' own edges, and taking them out opened slits in the front hem by his left shin in
  the chair sits and at cast_8. Narrowed: the lip facing in is taken only outside 70 degrees either side of his front,
  and nothing facing sideways is taken anywhere. The slits closed.

**Step 5 · the final file (masters/v24.48/make.sh, run whole from his saved file).** Steps 1-4 of the recipe rebuild
v24.47's files byte for byte (the donor's smooth copy, the leg bones, both robe rigs, the graft); the shell is the one
counted and photographed in the trials (sha1 bed96e7b: FLOOR took out 1,674 triangles, HEMBASE 2,309, ISLANDS 60 scraps
of 310); the cloth keeps 95,972 of 264,800 keys, and SKINPUSH moved 436,237 robe points off his legs over 1,655 frames
(the most any needed, 5.1 cm). The file: 554,370 -> 166,311 triangles, 231 joints, 19 takes, 8,619,908 bytes (sha1
fdcb21f7; v24.47's was 9,031,528), kept out of assets/ until it has been counted and read. The proofs, every new option unset: robeshell with RIM alone
on v24.47's graft gives v24.47's pho_shell.glb (51104ba9), and robesim with v24.47's options on v24.47's shell gives
v24.47's pho_cloth.glb (e93ab6d0), byte for byte.

**Step 6 · the final file counted on all 180 moments, and what the count found.** Against v24.47 (and his saved file):
legs through the cloth outside the floor sit 7,051 -> 368 (his file 29,232); torn robe triangles 59,715 -> 52,801 (his
file 108,928); robe seen inside out 1.73 -> 1.45 million px (2.02); floating leg pieces 52 -> 85 (his file 166). The
floating pieces had grown in the three chair sits (0 -> 8-9 in each), the second Charged cast and cast_4: drawn in their
own colours, each is a thin band of shin seen between the front of the robe and a white band hanging below it across his
shins. That band is a sheet of the robe 15 cm inside its own front wall near the hem, between his legs (the inner panel
of the wrap as his scan made it, seen at rest only from below), carried by the front cloth bones at that depth: when the
front of the robe lifts over his knees it swings out and is stretched four to five times into the band. Cutting the
hem's turned-in lip at the front as well (trial b) changed nothing. And sitting cross-legged, the robe now covers his
legs, but it stands up over his knees as a slab and his hands, which rest on his knees, sink out of sight into it: each
point of the robe there is carried at its whole rest distance from the leg (the robe's flare stands 10-15 cm off the
thigh).
- Tried for the hands (robesim LEGWRAPHUG, the robe over his crossed legs pulled in toward them, by 0.3 and fully): his
  hand rests on the robe seen from his side, but his knee comes through the lap at his front (floating leg seen 4,439 px
  on the floor sit's nine moments -> 46,259 and 50,838). Not taken, and taken back out of robesim (the file is again
  byte for byte the one the final was built with). His hands under the lap cloth are left, and said so.
- Tried for the band across his shins, on the eight takes it shows in (78 moments x 6 sides): the hem's turned-in lip cut
  at his front too (trial b), and the front of the hem left whole (trial c, robeshell HEMBASEKEEPFRONT): the chair sits'
  floating pieces 9/9/8 -> 8/9/6 and 9/9/8 — neither touches it, because the band is not the hem's edge. Both taken back
  out. Trial d, robeshell INNER=0.08 (cloth more than 8 cm inside the robe's own wall below 35 cm taken out): 271
  triangles, every one at his front and front-left at hem height, 20-30 cm off the floor — the sheet.
  Counted on the eleven takes it can change (105 moments x 6 sides) against the first final file: floating leg pieces in
  the three chair sits 9/9/8 -> 0/0/0, walking 3 -> 0, the second Charged cast 9 -> 4, cast_4 13 -> 8; torn robe
  triangles down in nine of the eleven (walking 467 -> 284, sitting answering questions 2,001 -> 1,733); legs through the
  cloth walking 96 -> 61, the sword slash 39 -> 28. Taken: robeshell INNER=0.08 is in the recipe, and the final file is
  built again from step 5.
