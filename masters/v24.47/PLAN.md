# v24.47 · Grandmaster Pho: real legs under the robe, the hem cut free, and his look — the plan and the log

Prepared, not a build: Pho is not cast until episode 4 chapter 3; nothing is deployed and the live build stays v24.40.
Builds on masters/v24.46 (read its make.sh and PLAN.md first).

## Chad's words (4 Nov 2026), verbatim, in order

> Why is his legs severed? Didnt you see that problem how is it possible you even missed that

(Answered: the severed shins were the hem-cut variant, which was not saved; the saved file's legs are joined to the
robe. Options put to him: 1 keep it joined, 2 real legs under the robe from another character scan and then the cut,
3 a version of his model with legs from whoever made it.)

> Seriously zoom in and look at the mess, its clear you are blind. Option 2 and look D

> You need to look at way more large shots of the legs in various animations and posrs, walking, running, etc. look at
> large shots nut thumbnails. This is completely unacceptable to have allowed legs like that to go through. Your looking
> at thumbnails have been complete failure

(His words as sent, typos kept: "posrs" is poses, "nut" is not.)

> Wont it be easier to modify the robes to cover the legs in place instead of rebuilding new legs? Or is rebuilding new
> legs the best approach?

(Answered: real legs are the best approach and the only one that can fix it. The robe alone is easier, and it is what
v24.40–v24.46 did. His scan has no leg between mid-shin and the hip, so a robe that hides the gap must keep its edge stuck
to each shin wherever it goes. When the legs part, on every step and in every sit with the knees forward, that cloth
stretches into the streaks and strips in the pictures; re-sticking it only moves them. With legs under it, the robe can
hang and swing as cloth, and a leg is there wherever it opens. The cost, said to him: his rig's knees sit 14 cm in front
of his shins, so the knees move and every take's legs are re-fitted to keep his feet exactly where they land. Continuing
with the legs unless he says otherwise.)

## How his legs are looked at from now on (his rule, from that message)

- Large single shots only: each view of the legs is its own picture, 760 px or more, viewed at full size (never a
  sheet of small cells, never a picture shrunk to fit). Two views side by side at most, so nothing is scaled down when
  it is read.
- Every take, at many moments: an even spread through each take, plus each take's worst moments for the legs by measure
  (the frames where the triangles at the hem stretch most), so the worst picture is never left to chance.
- From every side: his front, his left, his back and his right, level with the legs, and from behind three-quarters
  where the trailing leg is seen.
- The same set of shots, same takes, moments and views, for the file as saved (v24.46, the before) and for every new
  file (the after), so the two can be compared shot for shot.
- Looked at by me, every shot, before anything is said about it; and then by a blind reader given the same large
  shots.

## What he is right about (measured close up, not from thumbnails)

The saved v24.46 file, walking, his legs photographed at 700 px a view: where the trailing leg leaves the robe, the
robe's underside is stretched into grey and white streaks onto the shin, and the top of the shin itself is smeared
sideways into the hem — at both moments, from both sides. Every pass since v24.40 judged the legs from sheets with the
figure 150–300 px tall. From now on every check of his legs is made close up (the knee and the hem framed at 700 px),
and the blind reader is given close-ups, not thumbnails.

## His picks

- **Look D**: his skin and necklaces unlit (the scan's own colour laid on after the tone mapping, chosen by the texel's
  saturation), the robe lit, the unlit share scaled to the scene's light level. A material patch when episode 4 chapter 3
  casts him (the reference implementation is tools/clipsheet.mjs --look=skin@raw); his file unchanged.
- **Option 2**: real legs under the robe, then the hem cut free, so a leg that leaves the robe shows a whole leg (knee,
  thigh) going up into it — never a stump, never strips.

## The design (to be proven step by step)

- **The donor**: of the game's character scans on a Mixamo leg skeleton, the bare knees and thighs are the admin-tee
  man's (`admintee`: black PT shorts, bare and detailed from mid-thigh down). Lersi Chin's knees are under his tiger
  cloth, the plaid-shorts sitter (`sitman`) is too coarse, the first master and the medium wear long cloth. He lends
  only geometry hidden under the robe and is never seen as himself (Chad, v24.37: never cast him again — said to Chad).
- **Fit**: each donor leg moved from his bind pose onto Pho's by its own skinning — every donor leg bone carried onto
  Pho's (aligned, lengths matched, the limb's girth scaled to Pho's shin at the cut), so the knee lands on Pho's knee.
- **Cut and join**: the donor leg cut at Pho's cut ring (mid-shin) and zipped to Pho's open shin there; the top ends
  under the shorts' hem deep under the robe, capped. Skinned to Pho's own leg bones by the donor's weights.
- **Colour**: the donor's skin texture matched to Pho's shin (median and spread), so the seam at mid-shin does not show.
- **Checks**: the knee and the hem photographed close up in every take that moves a leg (walking, running, the sword
  lunge, the sits, the casts), against v24.46; poke-through of the new knees and thighs through the robe looked for from
  every side; then a blind reader of every take, given close-ups.

## The log

**Step 1 · the "before", large (Chad's rule).** The saved v24.46 file's legs photographed in every take: 180 moments (each
take's three worst frames for the hem by measure — triangles below 0.62 m past 2x — and an even spread, twelve through
walking, ten through running), six sides each (front, his left, back, his right level with the legs; behind-left and
behind-right from 20° above), every view 760 px, two views a picture: 540 pictures. Looked at full size: walking 0.04 s
a white torn flap stuck to the trailing shin's top; 0.40 s white crumpled shards and torn cloth under the back hem;
0.80 s the trailing leg's top smeared sideways into the hem as a sheet of skin and white streaks, the leading shin's top a
ragged torn edge. Running 0.40 s the shin ends in a ragged edge against the robe, strips and sheets of white, grey and skin
round the kicked-up leg. Seated (Sitting_Answering_Questions 8.6 s, Sit_to_Stand 0.73 s) both shins end in torn tops at
the robe's front, with grey sheets shading like chrome under it. Measured from below: his robe is closed like a bag — a
floor of cloth across its bottom, with a hole where each shin went in.

**Step 2 · the donor.** The admin-tee man's scan, Chad's own (`admintee` in the game is his 594k-triangle original cut to
a tenth): the original, "soldier admin tee open eyes  w 9 animations.glb" in his Drive (id 1uPLWmKeoYYelsMf3E9NLerldCEhqDrvX,
125,531,744 bytes, sha1 cfe4b8488b75b51b254b0ffb1378a61ec6f1f038), kept in masters/v24.47/src/ (gitignored), flat-shaded
(2000 of 2000 triangles), so tools/deflatten.mjs first (1,190,700 -> 341,992 points). 1.70 m; bare and finely detailed
from 13 cm above the knee down (3,465 texels a metre on his 8192 sheet; Pho's shin 2,500); light leg hair, darker knees.

**Step 3 · the knee (measured; why the legs need bones of their own).** His rig's knee joints stand at the front of the
robe (X-ray, masters/v24.47/shots later): 14.5 cm (left) and 17.4 cm (right) in front of where a knee on the line of his
visible shins would be. His visible shins are short (the ankle to the robe's join, 6 cm full rings, up to 12 cm at the
back) and stand within 5° of upright over his ankles. His takes bend that forward knee 24–39° even standing (Talk_with_Hands_Open);
a real knee skinned to it would poke through the robe front, and one placed where a knee belongs, carried by his shin
bone, strays 0.27–0.45 m from the hip in walking (a thigh would have to stretch 18 cm). So: new bones, a thigh from his
hip and a shin from a knee on his shin's axis at 0.50 m, every take solved for them frame by frame (two bones to his own
ankle exactly, in his own knee's bending plane, with his bones' own twist); his rig is 4–4.6 cm longer than a straight
real leg, so where a take straightens his leg the new thigh's top slides that much down the leg inside the robe (soft,
SOFT 2 cm). His own bones, feet and tracks untouched. tools/leggraft.mjs bones.

**Step 4 · the graft (tools/leggraft.mjs mesh), first pass.** His shins cut by a plane square to each shin's axis at
0.17 m: the 405 triangles joining the robe to a shin and 3,575 above the cut out, 252 clipped (rings of 127 and 125
points; the right ring has a 6 mm gap where his scan already had a hole, walked round and closed by the join). The robe's
openings capped in one texel of its own white. The donor's legs carried bone by bone onto the new bones (thigh x0.97–0.99,
shin x1.02 in length; girth x1.19–1.21 at the join, where Pho's shin is thicker than the donor's just above the ankle,
fading over 12 cm to x1.06, so his knees and thighs keep their own shape), shaped angle by angle to Pho's ring over the
last 6 cm, cut 1.5 cm above the ring and at 0.60 m (under his shorts), joined to the ring by a band of ~290 triangles.
Skin: twelve pieces (each leg front and back, three heights) at 2,400 texels a metre in free squares of Pho's sheet,
painted from the donor's sheet, colour matched to Pho's shin in Lab (mean 66.6/17.9/27.4 -> 69.8/18.4/30.8, spread
x0.60/0.83/1.14 — his skin's hair contrast halved), the first 3.5 cm fading in from the colour of Pho's own ring. Packed:
195,016 triangles (v24.46 177,772), 6.5 MB, 71 joints.

**Step 5 · the robe meets real legs.** First photographs (walking 0.80 s): the legs are right — whole shins, knees and
thighs, bending where knees bend — but the robe made room for his rig's old invisible legs: the leading knee comes
through its front, the trailing thigh shows outside its back. robeskin LEGRIG=1 (the robe's chains follow, and are pushed
off, the REAL legs: one line in robeskin, every leg it reads through node()): the chains' bones then keep 9 cm off every
real leg, but the cloth between and round them still dips inside a leg — measured (pokes: the robe's wall points, not
its floor, deeper than 5 mm inside a real leg's own surface): walking 0.4 s 6,161, 0.8 s 4,994 (to 5.7 cm deep), running
0.4 s 5,735, sitting 8.6 s 6,468 (7.3 cm), the sword lunge 0.4 s 21,548 (9.1 cm — a take whose chains are fitted to his own
file's robe, which ignored any legs).

**Step 6 · wider pushes measured, and Chad's pick.** Three robeskin variants on the real legs (thigh/shin capsules 0.12/0.09;
0.14/0.11 with GROW 3; the same with HULLR 1.4) and one with 24 chains: the cloth inside a leg fell by half to five times
(walking 0.8 s 4,994 -> 938 points, the cast 6,790 -> 425), never to none; standing came out clean in the pictures, walking
mostly, but seated the knee sits in front of the robe and fast moves show skin through it — a chain-built robe made room
for a knee JOINT, not for the front of a real knee, and twelve (or 24) chains leave room between them for a knee. The
before/after picture he was sent: masters/v24.47/shots/pho-legs-before-after.jpg. Put to him (the costly road), his
answer: **"Cloth simulation"** — the lower robe simulated as cloth round the real legs in every take and baked into the
model (said to him: several hours of work, about +1.5–2 MB on his 6.5 MB, the robe's lower half moving differently in all
19 takes and every take re-checked in large pictures).

## The cloth (tools/robesim.mjs) — the design

- A proxy of the robe below the waist: a tube of particles round his legs' axis (48 round × 28 down, from the waist ring to
  the hem, each column's hem at the robe's own hem height there), at the robe's outer radius at rest, measured from the
  robe's own wall points.
- Simulated per take (position-based: stretch, shear and bend constraints, gravity, damping), the waist ring carried by
  the robe's waist bone; colliders: each real leg (the new thigh and shin bones, their own thickness measured from the
  grafted legs, plus a margin), the feet and heels, a pelvis capsule, the floor, and under the thighs when he sits on a
  chair a seat; each take started from his rest pose eased into its first frame and settled, run twice (the second
  pass kept, its last fifth of a second eased into its first frame so a loop does not jump).
- Baked as cloth bones (a coarser grid of the particles, each bone's frame from its neighbours) with tracks at FPS, and
  the robe's skirt points re-skinned to them (the share they had on the chains, bilinear over the four bones round them);
  the chains' tracks then drive nothing and are dropped from the file.
- Checked: the cloth inside a leg (pokes) at the worst moments of every take, then the large shots of every take, then a
  blind reader.

**Step 7 · the first cloth, a free one (s1), failed seated.** Simulated freely from his rest pose (the design above):
walking and running near clean, but seated the robe crumpled into a wad above his knees and his legs were bare to the
thigh (shots in scratch, Sitting_Answering_Questions 8.6 s). A tube of cloth falling freely cannot sit down with him.

**Step 8 · the cloth keeps the robe's own shape (s2–s3).** Rebuilt: each particle's TARGET is where the robe already is
in that frame (skinned like the robe points nearest it, KNN 8: the skirt robeskin made, fitted to his file's robe where
his file moves it), the cloth held within a MOTION DISTANCE of it (0 at the waist, 10 cm at the hem) and pulled toward it,
its stretch and bend lengths the target's own — so it only moves where a leg pushes it, as game cloth is usually built.
Two findings on the way, both measured:
- The bake lost the cloth. Chains down each column with turns alone (to keep the file small) stood up to 4.8 cm off the
  cloth (a pushed cloth is longer than at rest; a chain of fixed bones falls short of it). Each bone now stands on its own
  particle (a place and a turn, keys thinned to those that matter): the robe follows the cloth.
- His robe lies in LAYERS (the wrap's two edges, its folds), each carried at its own depth under the cloth's surface, so
  where a leg pushes the cloth out the deepest layer must clear the leg too: each particle's collider grows by how deep
  the robe's layers go under it there (median 3.1 cm, at most 5).
A NEW CHECK (scratch showthru.mjs, kept for the recipe): the model drawn flat — his thigh red, his knee magenta, the rest
of his legs orange, the robe white — from six sides at every one of the 180 moments of the before survey, and the red and
magenta pixels counted. It saw what the numbers did not: three takes went from about 18,800 leg pixels to none.

**Step 9 · every take (s3–s10).** On all 19 takes the counter found five kinds of fault, each traced and cured:
- seated on a chair, a knee in front of the robe: the cloth began each take already seated (begun on its first frame, a
  knee began outside the robe). It now starts as the robe hangs at rest and is carried into the first frame by his legs
  (0.8 s, then held 0.3 s), and the pull toward the target never drags it into a leg or across one (a target inside a leg
  moves to the leg's surface on the particle's side; where the way to it passes through a leg, no pull that step).
- a bent knee came through: a leg's thickness measured standing missed a bent knee's bulge. It is measured from his
  legs' own points in every pose now.
- the robe's shape as robeskin LEGRIG=1 makes it hangs its front from mid-thigh when he sits on a chair (its rules turn the
  robe by each thigh's turn from rest, and the new thigh's rest leans back where his rig's leaned forward). For his two
  chair takes whose robe covered his knees in his file (Sit_Cheer_with_Left_Hand, Sit_Shout_Hands_on_Mouth) the cloth now
  keeps the shape robeskin makes on his own rig's legs (LEGRIG=0, the v24.46 robe): robesim TARGETFROM / TARGETTAKES. The
  two robe files share every point, weight and rest exactly (checked); only their tracks differ.
- running, a knee came through between two bones of the cloth (they stand 8–10 cm apart; a knee is 12 cm across) and at
  the loop's seam: each frame's bones are now FITTED to the whole cloth (least squares, held near their own particles),
  and a loop is closed by spreading what its end misses its start by over its last 0.2 s (it had been eased TOWARD its
  first frame, so in that window the robe took the first moment's shape while his legs were elsewhere); a running heel
  kicked up behind folds the calf onto the thigh and caught the cloth between them: a knee bent shut is filled by a
  capsule from hip to ankle.
- sitting cross-legged on the floor, his crossed legs lay on top of the robe: pushed out from each leg's axis, the half of
  the robe below the axis went under his legs. For that take the robe is DRAPED: below a level leg's axis it is lifted
  straight up out of it, above the axis pushed out as anywhere, so it lies over his legs and hangs down past his knees
  (robesim DRAPETAKES).
The robe's caps (where his shins left its underside) were a fan of long thin triangles that showed as a grey star when
he sits; they are made of rings now (leggraft CAPRINGS 4).

## Chad's words, later the same evening (4 Nov 2026), verbatim

> do you not see the problem here

(With the picture of the saved file, v24.46, running at 0.47 s, from his back and his right.)

> there are still so many problems and issues with disembodied legs and parts, or cloth and body clipping into each
> other, and so many other issues

Answered: he is right. In his picture a bare thigh hangs out of the robe's back with a ragged edge and nothing under it;
from his right the kicked leg comes out through the side of the robe, goes back into it, and its heel shows through the
cloth as a skin smear; the hem is torn into strips and holes with the robe's white inside faces showing; the standing
foot has torn cloth round it. And the measure this pass had been reporting (the thigh and knee pixels, step 8) cannot see
a calf through the cloth, a floating piece of leg or torn cloth, so its "17 of 19 takes" was withdrawn. The new file at
the same moment was shown to him beside it, broken too (the calf through a hole in the robe's back, torn flaps): the
cloth had not solved running's heel kick, and sitting cross-legged on the floor was still wrong.

Put to him (the robe is one thick piece fused to his body; it tears or lets a leg through wherever a leg swings hard
under it): only the takes chapter 3 needs / every take, running too / calmer running / a new model. **His pick: "Calmer
running"** — every take worked on, and his running changed to a jog with a lower back heel, so his calf never sweeps
through the back of the robe (a change to the motion itself, not just the cloth).

## The checks from now on (what he named, counted, not just thighs)

Every frame checked is looked at full size by me, and then by a second reader; and every frame is counted for:
- FLOATING LEG PIECES: the model drawn flat (thigh, knee, shin and foot each its own colour, the robe white, the rest of
  him grey), every island of leg colour seen that does not reach a foot — a leg cut off in mid-air, or seen through a
  hole;
- A LEG THROUGH THE CLOTH: leg colour with robe colour below it in the same column — a leg seen inside the robe's area,
  through a hole or poking out of the cloth above the hem;
- TORN CLOTH: the robe's triangles stretched past 3x their rest length with an edge over 4 cm — the strips, flaps and
  flat sheets.
Each check is proven on the saved file at the moment in his picture (it must flag what he saw) before it is trusted,
and run on all 180 moments x 6 sides for the before and for every after.

## The steps from his pick

10. The checks above (tools/probes/pholegs.mjs), proven on his picture's moment.
11. Calmer running: the back heel's lift taken down — his knee's bend in the swing capped softly, the stance and every
    footfall left as they are — measured (the heel's highest point behind, before and after) and photographed.
12. Every take through the checks; each fault traced and cured, the sword lunge and the floor sit included.
13. Every shot looked at by me at full size, then a blind reader with the same shots.
14. The record: the recipe, the proofs, the docs, the commit, and the report to him with what passes and what does not.
