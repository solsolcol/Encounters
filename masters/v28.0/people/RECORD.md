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

**Prepared**: ONE LEVEL, assets/p5collector.glb, his full body (314,540 triangles, no fins), repainted at 2048 (face
2,224 texels a metre, head 1,645, hands 1,048, body 836; 2,029 charts; 2 unplaced corners mended), with the four takes;
4.1 MB. A near (40,000) and a mid (8,000) body are each a remesh at Meshy (5 credits each): NOT MADE (no generation in
this pass; his yes first). He sits across the table inside 2.2 m, where an important person is drawn whole (v26.5), and
walks to the door in two endings, where a lighter body would be drawn if there were one.

**Measured** (tools/probes/filejoints.mjs, new: jointscan's own measure, read out of jointscan.mjs at run time, on the
file's skeleton posed in Node at 12 moments of each take; tools/probes/armside.mjs, new: an arm inside the body's side,
every 1/30 s, in the body's own frame; head travel and turn over each take):
- the sit: both collar bones raised, the left 21 to 24 degrees and the right 12 to 14 over his neutral, in every moment:
  THE LIBRARY TAKE'S OWN SHRUG (the hermit's file holds 18 to 32 in the same take). The chapter's cast lets a take's
  shrug down at run time (chapter 4's c_scast `shoulders`): it must be asked for Sitting_Answering_Questions on him.
  His head travels 16 cm side to side and 21 cm fore and aft at up to 23 cm a second, and turns up to 57 degrees to his
  right of his chest (the hermit's: 57; Grandmaster Pho's 54 to 61 were "too extreme", v26.3): the chapter's head damping
  must be asked for this take too, and a lens that looks at his face measured as it plays (filmlive).
- the stand: no flag. The talk: one moment (0.50 s) of his left elbow 5 cm behind his shoulder with the hand 11 cm before
  it; his head travels 19 cm side to side at up to 29 cm a second (a shot that follows his face will sway). The walk: no
  flag.
- his arms against his sides (armside): the sit's right forearm up to 3.6 cm into his side; the stand 1.5 / 2.3 cm; the
  talk 3.1 / 7.4 cm; his own walk 3.8 / 3.9 cm (the elbow brushing his
  hip, with the house's arms brought in to 7 degrees). The probe reads Jun's prepared stand at 4.7 / 3.2 cm, so a few
  centimetres there is the loose shirt; the pictures (section 3c) say what shows.
- hands: rigid, as made, fingers spread and straight (he lays twenty pieces out with them: in a close shot they cannot
  close on a piece). Way D (his rig made here from Jun's 66 joints) is the only free way to fingers; not tried, as agreed.

## 4 · Not made, and why
- The collector's near and mid bodies (section 3b): each a remesh at Meshy, 5 credits; his yes first.
- No take of the fight's (the nine's strain, stagger, lying tired and rising; Master Zavier's; Grandmaster Pho's): they
  wait for docs/V28.0-FIGHT.md.
- No take was measured as a motion yet (headturn, gait, jointscan, feetscan, clipscan): the house rule asks it before a
  take is cast, and the faults above in the takes were seen in single frames only.
- Nothing was generated a second time; no rig or remesh was sent again.
