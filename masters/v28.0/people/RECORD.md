# v28.0 · Episode 4 chapter 5 · the cast's RECORD (helper CAST, 21 Nov 2026)

Three people (Mr Koh, Jun, the collector), three bodies for the nine Prai, and the Naga of stage 5: each made ONCE (the
rule of v28.0: a generated model, a rig or a remesh is never sent a second time without Chad's yes). Begun on Fable 5.2,
continued on Opus 5.5 from the files as they stood (Chad's R17 and R18). The prompts are people/PROMPTS.txt; every Meshy
id is in masters/v28.0/src/jobs.json (written by meshy28.py); each body's prep is its own line under "THE CAST OF 21
NOV 2026" in masters/v28.0/people.sh; the Naga's is people/naga.sh. The pictures are on the working machine only
(scratch `e4c5/cast/shots/<name>/`, never in the repository): reference pictures of generated people are not committed.

## 1 · What was made

| key | who | triangles (near / mid / full) | joints | sheets | Meshy credits | ids (Meshy) |
|---|---|---|---|---|---|---|
| `p5koh`, `p5kohm`, `p5kohh` | Mr Koh, 1.68 m | 41,426 / 8,328 / 312,941 | 66 (every finger) | 2048 / 1024 / 2048 | 67 (model 40, rig 5, two remeshes 10, four library takes 12) | model 01a1fc8b-7fb4-75e8-b4db-bf32625994af, rig 01a1fc91-038b-732f-988e-0de7cd66b890, remesh 40000 01a1fc93-af6f-75e0-abc0-9206ace73e34, 8000 01a1fc98-6359-708e-b7c7-65abe8d1c59a, takes 01a1fc93-af77-7317-9f28-1f1823d5a39d |
| `p5jun`, `p5junm`, `p5junh` | Jun, 1.72 m | 41,604 / 8,322 / 298,380 | 66 | 2048 / 1024 / 2048 | 67 | model 01a1fc8b-89a7-7246-932c-a12ea04027dc, rig 01a1fc91-039a-7060-84fa-95970f4620d2, remesh 40000 01a1fc93-0e47-76f1-8fa2-f950b6c484af, 8000 01a1fc96-ffba-70c9-ba4a-807b5f514b62, takes 01a1fc93-23db-763b-be8e-f71d88f8f87a |
| `p5praicome` | the four that COME, 1.60 m | 16,714 (one level) | 24 (plain rig) | 1024 | 53 (model 40, plain rig 5, remesh 5, one take 3) | model 01a1fc8b-912f-7473-931f-b7f924bcdf7f, rig 01a1fc91-03e1-7517-a2e7-b2890e98b230, remesh 01a1fc93-0d67-7268-8598-22109d50d631, take 01a1fc93-23cd-77de-ae69-7bf253a83545 |
| `p5praihide` | the two that HIDE, 1.42 m | 16,680 | 24 | 1024 | 53 | model 01a1fc8b-8ca7-764e-8370-fe37005134b2, rig 01a1fc91-03cc-7247-80fe-925576890a34, remesh 01a1fc93-0e48-7082-b697-0f1d6333f26b, take 01a1fc93-23c9-769b-88de-6b1593349c6f |
| `p5praiheavy` | the three that are HEAVY, 1.90 m | 16,740 | 24 | 1024 | 53 | model 01a1fc8b-80bc-723b-8505-e3d007aa632d, rig 01a1fc91-03d7-7559-9458-80baf136f468, remesh 01a1fc93-0d84-7380-9921-f3f1028443b0, take 01a1fc93-23e4-71f5-8979-9d7a0b076458 |
| `p5naga` | the Naga of stage 5 | 62,393 (static) | none | 2048 | 45 (model 40, remesh 5) | model 01a1fc90-b6dc-70c1-9c1c-ad305f4c94e0, remesh 60000 01a1fca2-b855-7499-8718-a4d05c1c2b8b |
| (not prepared) | the collector, 1.77 m | (300,000 as made) | **52: WRONG** (section 3) | | 45 (model 40, rig 5) | model 01a1fc8b-97ee-769f-8405-f6fe1b075529, rig 01a1fc91-02bc-75e4-be62-e33736ce19b7 |

Takes in the files: Mr Koh and Jun carry Idle_3, Listening_Gesture, Stand_and_Chat, a talk (Mr Koh's Talk_with_Hands_Open,
Jun's Talk_with_Right_Hand_Open) and the rig's own Walking, the standing and walking arms brought in (calmarms: Mr Koh
12 degrees, Jun 7). Each of the nine carries Idle_3 and Walking (and the rig's own two-frame `Armature|clip0|baselayer`,
a leftover of the plain rig's file: harmless, unused). What the fight asks of them waits for docs/V28.0-FIGHT.md.

Meshy for the cast: 383 credits in all (seven models 280, six rigs 30, eight remeshes 40, the takes 33). Balance read
from Meshy itself after the Naga: **1,370** (all permanent; another helper is making the things at the same time).
Higgsfield (the seven reference pictures, max 2k, about 7 credits each by estimate_image_cost on the day): balance read
on 21 Nov, **367.5** (plan "plus").

### The prep, and two tools touched (both proved to leave earlier work as it was)
- tools/mergetakes.mjs: a plain rig's armature carries a scale of 0.01, which the merge's rigid inverse refused ("a scaled
  parent"), so the nine could not be given their takes. A bone whose parent stands the same in the world in both files
  now keeps its tracks as they are (it was never re-expressed before either). PROVED: Jun's merge through the tool before
  and after, sha1 4d367f29... both.
- people/mkspec.py: HANDTIP=1 (opt-in) aims each hand's close picture at its lowest 16 cm; on a slim arm the old aim's
  middle was the wrist and the fingers fell out of the frame. Unset, the specs are as before.
- Each person's levels repainted (xatlas, the face three times its share), FINS, WSMOOTH=0, XSCALE=1000 as Master
  Zavier's first body. Texels a metre, face / hands / body: Mr Koh near 2,071 / 989 / 772, full 2,050 / 959 / 746, mid
  1,032 / 504 / 389; Jun near 2,222 / 1,058 / 839, full 2,213 / 993 / 839, mid 1,091 / 533 / 417; the nine (at 1024)
  1,318 / 612 / 488 (comes), 1,270 / 599 / 493 (hides), 885 / 466 / 345 (heavy).
- The Naga: people/naga.sh (prop.sh's steps with its own numbers): 3.6 m from the ground to the crest's tip, 8.41 m long,
  0.78 m wide. 3.6 m is a size to photograph by: the chapter cuts it into head, straight length and tail and lays the
  straight length again along the court's edge at the scale the film asks (plan 9.3).

## 2 · What is wrong with each, seen at full size (each picture opened one at a time)

Pictures: whole from four sides at 1000 x 1700, from 2.2 m on a phone's frame (780 x 1688, 72 degrees), the face front,
three-quarter and side, each hand, the torso, the legs and the feet at 1100 to 1200 px; and each person in a take.

**Mr Koh** (`koh/h-*` the full body, `n-*` the near, `m-*` the mid)
- His mouth hangs a little open with the upper teeth showing, where the reference asked it closed. It reads tired.
- Inside his collar, a pink-and-white striped strip down the placket, and a pale ragged edge under the collar on his right.
- A cream smudge about 2 cm on the left chest beside the placket (seen from his left), and a dark stroke about 2 cm
  above the hem on his right, painted (seen in every take).
- A pale ragged strip of lining under the shorts' left hem from behind.
- IN THE TAKES (the near body, which carries them): the shirt's sides are drawn deep in under both arms in the stand and
  the walk, an hourglass above the belly (the arms' weights reaching into his sides: his belly is wider than the
  library's arms allow). In the talk at 0.5, a thin pale spike stands out of his left shoulder. Neither is in the bind pose.
- At 2.2 m on a phone the near and mid bodies read as he does; nothing of the above but the open mouth can be made out.

**Jun** (`jun/`)
- A good face, the eyes ahead. The nostrils' rims a raw pink.
- The T-shirt's hem a fuzzy white fringe about 1 cm along its lower edge, front and back; the collar a dotted pale line.
- A sharp change of tone at each wrist (the forearm tan, the hand pink): a line round the wrist.
- On the right palm a dark speck of 1 to 2 mm on the index finger, and a red slit in the web between the left hand's index
  and middle finger.
- The shoes' openings show a ragged pale strip of ankle (no socks, as the reference; the edge is ragged).
- IN THE TAKES: with the arms down (stand, walk) the sleeves stand out from the shoulders like pads (they were made round
  arms held out in the A pose). Thin dark hairlines, about 3 cm, on the shirt's chest.

**The four that COME** (`nine/praicome-*`)
- Clean and faceless; small ears are modelled (the reference shows none called for, none forbidden).
- A pale seam where the dress's neckline is painted across the back, and a dotted pale line down the back of the right
  forearm; a white speck on the bun.
- The fingers are separate but facetted at their tips (16,000 triangles); no finger bones (the plain rig), so the hands
  hold the A pose's spread in every take.
- The walk is the rig's own man's walk on a woman's shape (wide, swinging hands with spread fingers).

**The two that HIDE** (`nine/praihide-*`)
- The paint came charcoal grey, not black, and the palms paler again (the chapter draws them as black oil and a sheen,
  not their paint, so it does not show in the game).
- Not stooped and the head hardly bowed, as the reference asked.
- Under the bob's lower edge at the nape, a pale ragged fringe (seen from the side).
- A small dark tear of about 4 mm between the right hand's index and middle fingers; a faint mark on the left calf.
- In the walk, the dress's inside shows as a paler triangle between the legs.

**The three that are HEAVY** (`nine/praiheavy-*`)
- The head is tipped up a little (the chin raised; a face tilted up reads as disdain, v6.9), and the low bun sits to one
  side of the nape, so it shows beside the right cheek from the front.
- The feet are mittens (no toes), and coarse.
- In the walk, her right forearm passes into her side at the waist (a sharp notch in the dress).

**The Naga** (`naga/`)
- Faithful to its reference: one head, the crest, the round ruby eye, the open jaw and fangs, the curled snout, the beard,
  the collar band, the fins along the back, the long straight body and the flame tail.
- Close to (from about two metres at this size): the scales are crumpled and facetted, with small sharp shards between
  them; the gold is streaked with brown, like scorch; a white crust along the gums at the teeth's roots; the fins
  blocky. The chapter draws it as ruby light, seen whole and vast; none of this is read at that distance.

**The collector** (`collector/r-*`, his rigged file as Meshy made it): THE BODY IS GOOD: his face as the reference (long,
thin, tired), both palms forward with five separate fingers, the shirt with its rolled sleeves and the belt clean. Small
things: red speckles on his right ear; a small pale ring at his right nostril; fine dark hair-marks on the right palm.

## 3 · THE COLLECTOR: his rig came back wrong, and his options (Chad's to pick)

What came back (rig 01a1fc91-02bc-75e4-be62-e33736ce19b7, include_fingers asked): **52 joints where a rig with fingers has
66**. Measured from the file, by which joint each of his 314,540 points follows most:
- each hand is ONE piece: the left hand's 8,064 points on the hand bone and 303 on its single finger chain (the middle
  finger's), the right hand's 6,888 on the hand bone and 10 on its finger chain. No finger can bend; the thumb has no bone.
- eighteen stray bones the library's takes do not move (Bone_002 to Bone_044; three of them carry nothing): 28,000 points
  of his chest, both sides and his waist on six of them, 14,700 of his hips and belt on three, 5,300 of his feet on six.
  They would follow whatever they hang from, stiff.
The same thing happened to Master Zavier's third body (32 joints, twice, the second rig byte for byte the first), whose
hands were also left palm forward; Jun's and Mr Koh's were too, and they came back with 66. So it is the throw, and a
rig sent again on the same model has so far come back the same.

His part (plan 4.7): seated at the table, he lays twenty pieces out "himself, quickly", and his hands are in close shots.

| | what it gives | cost |
|---|---|---|
| A · keep the body, rig it once more at Meshy (same settings) | possibly a full 66-joint rig; most likely the same 52 (Master Zavier's third body came back identical twice) | 5 Meshy credits |
| B · keep the body, mend the rig here | the stray bones' points given to the spine, hips and feet bones they lie on; the takes play cleanly; the hands stay ONE rigid piece each (fingers spread as made, never closing on a piece) | no credits; about an hour |
| C · keep the body, a plain rig at Meshy (people/rigplain.sh, as the nine) | 24 clean joints, no finger bones: the same hands as B | 5 Meshy credits (it is a Meshy rigging job, not made here) |
| D · keep the body, rigged here in Blender from Jun's 66-joint skeleton fitted to him, with Blender's own weights | fingers that bend; a weighting nobody has proved on these bodies yet, checked joint by joint before use | no credits; half a day, its result uncertain |
| E · another body from the same reference picture | a new throw of the face and the clothes (not this face again), and a rig that may or may not have fingers | about 50 Meshy credits (model 40, rig 5, a remesh 5) plus about 15 for its levels and takes |

**My pick: B now, then D if a close shot needs his fingers to close.** B costs nothing, keeps a face and a body that came
out right, and lets the table be built with him in it at once (his seat, his talk, his walk in). His fingers spread flat
as he lays pieces down is the one thing B cannot give; D can, at no credits, and is tried only if the films' close shots
ask for it. A is not worth its credits on the evidence (an identical skeleton twice), and E throws away a good face for a
rig that is still a gamble.

## 3b · THE COLLECTOR, WAY B: his rig mended here, at no credits (CAST-2, 21 Nov 2026; Chad's default, R19)

**The mend** (tools/rigmend.mjs, new; people/rigmend-collector.json; people.sh `collectorrig`). Where each stray bone's
points lie was measured first (each point's main bone, the box it fills, the nearest real bone's segment), and how Meshy
weights the same regions on the three rigs of this chapter that came back whole (Jun, Mr Koh, Master Zavier: the upper
chest held 0.56 to 0.68 by the shoulder, the side under the arm 0.31 to 0.68 by the arm, the waist about half the hips
and a third the thigh, a shoe 0.91 its foot). The eighteen stray bones are a second arm chain on each side (Bone_029 / 028
/ 027 beside RightShoulder / RightArm / RightForeArm, and 034 / 033 / 032 on the left), a belt (002, 015, 016), a head
cap (017), heel and toe bones (035 to 041), and two that carry nothing (043, 044). Each gives its share to the bone it
stands in for: the chains to the shoulder, arm and forearm, the belt to the hips, the cap to the head, the shoe bones to
the foot. Both finger chains (one middle finger a hand) go into the hand, so each hand is ONE rigid piece; his two toe
bones stay in the skeleton carrying nothing (his left toe joint stands mid-shoe: a bend there would crease the shoe).
52 joints -> 26, 177,969 points, every point's four shares summing to one within 5e-8. After it, the same regions read:
upper chest 0.91 shoulder, the side 0.66 arm and 0.20 spine, the waist 0.65 hips and 0.35 thigh (Jun's 0.50 / 0.33).

**His takes, at no credits** (tools/retarget.mjs map `same`, new and opt-in; the `meshy` map is for a Mixamo-named source
and pairs a Meshy source's top spine bone with the target's lowest). Meshy's library takes are one motion laid on each
rig, so they were taken from files already here: Sitting_Answering_Questions (307) from the seated hermit's file
(assets/e4hermita.glb), Idle_3 from Jun's library file, Talk_with_Hands_Open from Mr Koh's, his own walk from his own
rig. PROOFS: his own walk retargeted onto his mended rig is his rig's walk to 0.0000 degrees, every bone at every key;
Mr Koh's talk retargeted onto Mr Koh's own body is his file's talk exactly (every limb's line the same to two places);
the old maps write the same bytes as before (granny's v25.5 walk, and a `meshy` run on the collector, before and after
the change: sha1 8380984448ef... and 131c7a26a1ee...). FOUND ON THE WAY: retargeted from his own rest, the library takes
carried his rest's lean (his spine leans back 11 degrees at rest where Jun's leans 5): the stand leant him back 17 degrees
and put his upper arms into his sides. With --align (each bone's rest first swung onto the source's) every limb's line
is the source's at the moment (the upper arm, forearm, spine and thigh at the stand's middle, the talk's and the sit's).
NOT HIS NECK AND HEAD (--noalign, new and opt-in in tools/retarget.mjs): his head joint stands 13 cm IN FRONT of his
neck joint where the sources' stand above theirs, so swung onto their line his head rose 10 to 19 cm off his collar (the
head joint's height over the shoulders' middle, against his rest: stand 8 to 12 cm, talk 14 to 19; turned from his own
rest: stand 0 to 3, sit 1 to 2), photographed as a long bare neck with his collar torn off it. In the talk, not his
collar bones either: swung onto Mr Koh's sloping ones and then dropped by the talk, 28 to 43 degrees (a coat hanger's
shoulders); turned from his own rest, 16 to 21. TRIED AND REFUSED: his collar bones held at rest (--skip, kept in the tool,
opt-in): under a spine the sit curls forward they read 21 degrees DOWN and his collar stood off his neck. Runs without the
new switches write the same bytes as before (granny's v25.5 walk 8380984448ef..., the collector's stand by `same`
1504258ec083..., against the tool as first committed here, 5ace4be).

**Prepared**: ONE LEVEL, assets/p5collector.glb, his full body (314,540 triangles, no fins), repainted at 2048 (face
2,224 texels a metre, head 1,645, hands 1,048, body 836; 2,029 charts; 2 unplaced corners mended), with the four takes;
4.1 MB. A near (40,000) and a mid (8,000) body are each a remesh at Meshy (5 credits each): NOT MADE (no generation in
this pass; his yes first). He sits across the table inside 2.2 m, where an important person is drawn whole (v26.5), and
walks to the door in two endings, where a lighter body would be drawn if there were one.

**Measured** (tools/probes/filejoints.mjs, new: jointscan's own measure, read out of jointscan.mjs at run time, on the
file's skeleton posed in Node at 12 moments of each take; tools/probes/armside.mjs, new: an arm inside the body's side,
every 1/30 s, in the body's own frame; head travel and turn over each take):
- the sit: both collar bones raised, the left 21 to 23 degrees over his neutral and the right 12 to 14: THE LIBRARY TAKE'S
  OWN SHRUG (the hermit's file holds 18 to 32 in the same take). The chapter's cast lets a take's shrug down at run time
  (chapter 4's c_scast `shoulders`): it must be asked for Sitting_Answering_Questions on him. His head travels 16 cm side to side and 21 cm fore and aft at up to 23 cm a second, and turns up to 57 degrees to his
  right of his chest (the hermit's: 57; Grandmaster Pho's 54 to 61 were "too extreme", v26.3): the chapter's head damping
  must be asked for this take too, and a lens that looks at his face measured as it plays (filmlive).
- the stand: no flag. The talk: no flag; his head travels 19 cm side to side at up to 29 cm a second (a shot that follows his face will sway). The walk: no
  flag.
- his arms against his sides (armside): the sit up to 1.3 / 3.7 cm; the stand 1.5 / 2.3 cm; the talk 3.5 / 7.4 cm; his own
  walk 3.8 / 3.9 cm (the elbow brushing his
  hip, with the house's arms brought in to 7 degrees). The probe reads Jun's prepared stand at 4.7 / 3.2 cm, so a few
  centimetres there is the loose shirt; the pictures (section 3c) say what shows.
- feet (each foot's lowest skin against the floor, in Node): the sit's left foot 1.7 cm under the floor and the right on it
  (the chapter sets a body on its lowest contact); the stand's two feet 2.5 cm apart in height, as Jun's own stand (1.9):
  the library stand's; his walk's feet on the floor in turn.
- PHOTOGRAPHED (scratch e4c5/cast2/final-*.png, 780 x 1688 from across the table at a seated eye's 1.15 m, 1600 x 1000,
  1000 x 1700 whole, each opened full size): the sit reads as a man seated forward, his collar round his neck, his knees
  wide (the library sit's), his left hand flat on his belt with the fingers spread straight; at the shirt's tail a small
  pale notch where it meets the trousers in his lap. The stand is clean but for the hands (palms forward, fingers spread,
  as his bind pose). THE STANDING TALK IS STILL WRONG: his shoulders slope steeply down and his collar stands off a long
  neck (the library talk's collar-bone drop, 16 to 21 degrees even turned from his rest): do not cast it in a close shot;
  he talks at the table in the sit; Jun's one-handed talk is the untried alternative. The walk: the leading hand carried
  palm forward with straight fingers (the rig's own walk, as Master Zavier's).
- hands: rigid, as made, fingers spread and straight (he lays twenty pieces out with them: in a close shot they cannot
  close on a piece). Way D (his rig made here from Jun's 66 joints) is the only free way to fingers; not tried, as agreed.

## 4 · Not made, and why
- The collector's near and mid bodies (section 3b): each a remesh at Meshy, 5 credits; his yes first.
- No take of the fight's (the nine's strain, stagger, lying tired and rising; Master Zavier's; Grandmaster Pho's): they
  wait for docs/V28.0-FIGHT.md.
- Measured as motions since (CAST-2, sections 3b, 5, 7): the collector's four takes (jointscan's own measure by
  tools/probes/filejoints.mjs, arms against sides, feet, head travel and turn), Mr Koh's stand, talk and walk (stretch,
  waist), the heavy Prai's stand and walk (arms against sides, jointscan). NOT YET: Mr Koh's and Jun's takes by jointscan,
  feet and head travel; the two other kinds of the nine; clipscan and headturn in the chapter itself (no chapter casts
  these bodies yet).
- Nothing was generated a second time; no rig or remesh was sent again.

## 5 · MR KOH: the shoulder spike and the shirt drawn in under his arms, mended in the prep (CAST-2, 21 Nov 2026)

**Causes, measured** (scratch probes on the prepared near body: every triangle stretched past three times its rest in
the talk, with its points' bones; each side's arm share by angle from the shoulder; the waist from the front and behind):
- THE SPIKE: one triangle behind his left shoulder (rest 0.15 to 0.18 m out, 1.38 to 1.40 m up) whose three points held
  the Head 0.18, 0.10 and 0.74. The third, 15 cm out from his head's line, went with every turn of his head: stretched
  5.9 to 7.3 times at 0.4 to 0.6 of the talk. His mid and full bodies have no such point (none stretched at the shoulder).
- THE HOURGLASS: the skin of his sides under the arms held 0.40 to 0.66 of the arm (a heavy man's side under a limb the
  rig weighed as arm), and his stand and walk bring his arms in (calmarms, 12 degrees): the sides went in with them.

**The mend** (tools/wfix.mjs, new, run by tools/prepmonk.mjs only when WFIX=<spec> is set; people/wfix-koh.json; his line
in people.sh exports it, so all three levels take it):
- `outlier`: a point holding more than 0.3 of the Head above the mean of the points joined to it is brought down to that
  mean: on his near body exactly that one point (0.47 of share given to its other bones); on his mid and full none.
- `relief`: on the inner half of each upper arm, a point further from the arm's line than the arm's own radius (read
  along the arm from its outer half) keeps 0.3 of its arm share by 1.8 radii, eased in from a quarter of the way down the
  upper arm to past half way and spread six times over the surface; what it gives goes to the spine round its height.
- TRIED AND REFUSED, each photographed: a `leak` rule (the Head's share eased off everything 10 to 14 cm out: on his full
  body it opened 35 new stretched triangles at the collar, which rises with his neck); the relief begun at the shoulder
  (0.15 to 0.45: the sides straight, but in his talk, where the arms go out, the armpit's inside showed through in pale
  tatters); begun at 0.35 (the talk as before, the hourglass half there from behind). The chosen one is between.
**Proved**: with WFIX unset, Master Zavier's first body is prepared as people.sh prepares it and comes out the committed
bytes (near 4af3b908ddc5..., full d05886dd081b...; scratch e4c5/cast2/zproof.sh, run with wfix.mjs and the hook in the
tree). **The reach of the slope** is a distance (`spread` 28.4 mm): the passes each body's own edges need for it (near 11.5 mm
edges, 6 passes; mid 26.3 mm, 1; full 3.4 mm, 68). Six passes on the full body left a notch in each side at the top of
his belly (photographed); the distance cured it. The near body's file is the same bytes either way.
**Measured after**: no triangle at his shoulders stretched past three times in the talk on any level; jointscan's measure
(filejoints) flags his talk's wrists wrung 64 to 95 degrees in 3 to 4 of 12 moments and his stand's collar bones 10 to
15 over neutral in a few moments: both the library takes' own (his file before the mend has them), not mended here.
PHOTOGRAPHED (scratch e4c5/cast2/m4-kohN-*, m5-kohHf2-*, each opened full size): his near body in the talk from behind his
left shoulder: the dark wedge gone, a faint dark line about 2 mm wide where it was, seen at 1.1 m with a 22 degree lens; in
the stand, from in front his sides run down to his belly with a shallow crease under each arm (the hourglass gone), his
full body the same and smooth; from behind a little narrowing is left under the arms; in the talk the armpit as before
the mend (a small pale notch where his scan's armpit opens, there in his file).

## 7 · THE HEAVY PRAI: her arm into her side in the walk, mended (CAST-2, 21 Nov 2026)

**Cause, measured** (tools/probes/armside.mjs, new: every 1/30 s of the walk, in her body's own frame, the arm's points
that lie inside her torso's span across the same cell of height and depth, the armpit left out): her bind pose holds her
arms 24 degrees out, her walk swings them from 9 to 30, and the house's arms-in (calmarms 18) left the swing's inner end
at 9 degrees on hips a third wider than the walk was made for: her right arm in her side in 6 of 33 moments, 2.4 cm deep
at 0.80 s (the notch in her dress at the waist). The weights were not the cause: taking the arm's share off her sides
(tools/wfix.mjs `relief`, as Mr Koh's) left the arm passing in more often (12 moments, shallower), so it was not kept.
**The mend** (people.sh, her CALM): the stand's arms at 21 degrees (was 18), the walk's at 24 with a third of its in-and-
out kept (was 18 with half): the walk's arms now 21 to 27 degrees out. **After**: the right arm in her side in none of the
33 moments; the left only as before (two points of the back of the upper arm close under the armpit, in one moment, 1.9
cm); the stand in none of 301. filejoints: the walk clean; the stand's collar bones 10 to 13 degrees over neutral in three
of 12 moments (the library's stand; the chapter's cast lets a stand's shrug down at run time). Photographed (front and
close at 0.3 and 0.75 of the walk, before and after, opened full size): before, her right arm met her hip with a notch at
the waist and hugged it on the back-swing; after, a clear gap between arm and body on both sides; the forward swing
carries her left hand in front of her belly, as before.

## 6 · JUN: the tee's white fringe and the puffed sleeves, measured, tried, NOT mended (CAST-2, 21 Nov 2026)

**The fringe, measured**: the tee's hem is a ledge on his body 1.5 cm deep (scratch profile probe: the tee's outer skin at
13.8 cm in front of his middle down to 0.822 m, the trousers' at 12.3 cm below it; 0.83 to 0.84 m at the sides, 0.85
behind), and the paint changes from the tee's white to the trousers' navy at the same height (white above 0.825, navy
below 0.815, both read from the generator's 8192 sheet through the body's own coordinates); the fringe is a few millimetres
of torn white on the trousers just under the ledge. **Tried, three ways, each with tools/edgeclean.py on a scratch prep
of his near body and photographed at the hem, front, side and back, each opened full size**: (1) a STEP taken from the
ledge (the walk up from the trousers to the ledge's underside: found in 82 to 132 of 152 to 167 slices): it painted a hard
white band, stepped at the sheet's texels, two to three centimetres down the trousers, and white round the drawstring;
(2) the materials' presence smoothed with no step: the same band, a little narrower; (3) each face of the body taken
alone (`normal`), so the ledge's underside could not be smoothed onto the trousers: the same band again. Each is worse
than the fringe as made. REFUSED; people/edgeclean-jun.json withdrawn (prep() applies a person's spec whenever the file
exists), and his files were never prepared with it: assets/p5jun*.glb are as CAST made them. What would mend it: paint
the trousers' strip under the ledge by hand in the sheet, or a box that keeps texels of the trousers' own colour (its
`raw` test) from ever turning white; not done.
**The sleeves, measured**: his A pose holds his arms 41 degrees out (the widest of the chapter's bodies: Master Zavier's
32, the collector's 22), and his stand brings them to 6 (calmarms); the sleeve is cut round the raised arm, 2 cm off it
all round (7.9 cm from the arm's line at the shoulder against the arm's 5.7). His sleeve's weights match Master Zavier's
pattern bin for bin along the arm (the shoulder 0.71 to 0.03 from the cap to mid-arm, the arm 0.28 to 0.99), so the rig
is not at fault: the sleeve is a cone made for an arm held out, standing off an arm brought down. **Tried**: the weights
spread (prepmonk WSMOOTH 8): creases down the chest and the shoulders' strain up (99th percentile 1.365 -> 1.498);
his stand's arms at 10 degrees (not 6): the shoulders a little rounder, the arms further out. Neither clearly better;
NOT ADOPTED, his line as it was. What would mend it: the sleeves reshaped round a lowered arm (Blender), or the arms
held further out in his takes; his to say.

