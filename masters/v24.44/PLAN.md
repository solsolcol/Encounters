# v24.44 · Grandmaster Pho stands upright — the plan (written before the work)

Chad, 4 Nov 2026: *"Why does pho model look hunchback in so many poses? Make him more upright"*

## What was measured first (the why)
- At rest he stands straight: his trunk 2° from vertical, his head 0.6 cm ahead of his hips.
- In his takes (his file's own animations, unchanged by any of my passes) he leans 6–20° forward on average, his head
  9–21 cm ahead of his hips (walking 11° / 9 cm, the casts 12–17° / 13–21 cm, running 20° / 19 cm).
- Joint by joint (each spine joint's own bend against rest): the LOWEST SPINE JOINT (Spine, at his waist) is bent forward
  42–75° in EVERY take (walking 42 ± 1°, talking with hands open 47 ± 2°, the casts 50–56°, even talking with a hand on
  the hip 42 ± 1°), barely moving within a take, while his hips tip back about 25°; Spine1 and Spine2 sit near 0°, and
  the neck bends BACK 15–40° in many takes to bring his face up. A bend that is the same in every take, standing,
  walking and sitting alike, is not acting: it is how his animations were laid onto his scan's rig — the waist joint
  carries about 25° too much forward bend, which his neck then craned up against. That is the hunchback: the back bent
  forward at the waist, the head pushed out and craned up. It is in his file too (photographed side by side: the same
  stoop in walking and the casts).
- My own part in the look: from his left side the drape shell on his left upper arm (v24.43's open item) adds a bulge at
  the shoulder that reads as a hump. That is the hanging-cloth rig already put to him.

## The fix (robeskin, before anything is baked)
1. Per take, a constant backward turn of the waist joint (Spine) about the body's side-to-side axis — sized from that
   take's own upper-body lean so he ends near a natural upright stance — and the same turn given back at the NECK, so
   his head keeps exactly the orientation his animation gave it (he looks where he looked). His hips and legs are not
   touched, so his feet stay where they were. A turn the same through the take keeps every movement's motion.
2. Takes where a hand rests on his body (talking with a hand on his hip) or his legs (the cross-legged sit's hands on
   his knees) are measured for that contact before and after; their turn is cut back or left out where it would lift
   the hand away.
3. The robe's chains are baked after the turn, so the skirt follows the straightened body.

## Proof
- The skeleton: every take's upper-body lean and head-ahead distance before and after; the head's orientation
  unchanged (measured); the feet unchanged (measured).
- The torso measure (tools/rigstrain.mjs): no caving introduced.
- Photographs: the side views (90°, 270°) and the front of every take, his file / v24.43 / v24.44, then one
  independent reader, blind to which is newer.

## Progress
- **Step 1 built: robeskin UPRIGHT** (a constant backward turn of the waist joint per take, the neck given it back key by
  key). The turn per take = its measured upper-body lean minus a natural target (5° standing, walking and talking; 8°
  the casts; 10° running and the sits; the sword lunge to 25°, its lunge being the move; sit-to-stand sized on its seated
  start; mage_soell_cast_8 already leans back: none) — walking 13°, talking 19°, the casts 15–24°, the cross-legged sit
  34°. Checked first: 1,064 tracks, none sharing its data, all LINEAR. Baked (the session's p11): the upper body now
  leans walking 4.7°, talking 5.0°, the casts 7.4–8.2°, the sits 9.5–10.2°, running 10.1° (were 17.7, 24.0, 22–32,
  19–44, 25.2); the head's tilt identical in every take. Watch: with the hips still tipped back by the takes (−20 to −33°),
  talking with hands open now has his head 8.9 cm BEHIND his hips (was 3.1 ahead) — the photographs decide whether the
  pelvis needs straightening too.
- **Step 1 proven** (his file's skeleton against p11, every take at 10 fps): the hips 0.00 cm, both feet 0.00 cm, the
  head's orientation 0.00° in every take (the cross-legged sit's 5.5 cm is its floor-sit lift, there since v24.40); the
  hands ride the straightened chest 1–35 cm. Photographed (his file / v24.43 / p11, 90° and 270°): walking, talking, the
  casts, sitting-answering, the shout, running and the hand-on-hip take visibly upright; talking with hands open does not
  read as leaning back (the head-behind-the-hips number is the hips' own tilt), so the hips are left as the takes have
  them. Two takes broke: the cross-legged sit's arms swung up with the chest and stood straight out (the hands had rested
  toward his knees), and sit-to-stand's hands hovered above the knees they push on.
- **Step 2: UPRIGHTARMS** (robeskin): in those takes the shoulders get the turn given back like the neck, so the arms
  hang as the take had them and only ride the straightened shoulders; sit-to-stand's turn cut to 8° (leaning forward is
  how anyone stands up). Baked (p12): the cross-legged sit's hands move 20 cm with the chest (31 without), sit-to-stand's
  5 cm; the takes it does not name skin exactly as p11 (walking, talking, cast_5, running: 0.00 cm). Photographed: the
  cross-legged arms rest toward his knees again, sit-to-stand's hands on his knees.
- **Step 3 done, the measures of p12** (his file's skeleton against p12, every take at 10 fps): hips 0.00 cm, feet 0.00
  cm, head 0.00° in every take (the cross-legged sit's 5.5 cm is v24.40's floor lift); hands 0–35 cm. The upper body
  leans walking 4.7°, talking 5.0° (hand on hip 4.6°), the casts 7.4–8.2°, the sits 9.5–10.2°, running 10.1°, the sword
  lunge 24.8°, sit-to-stand 31.9°. The trunk (rigstrain, against v24.43's file): caved at 0.7 % at most as before; the
  worst back 0.77 (0.78); the cross-legged chest's first percentile 0.88 (0.95), none of its points under 0.75; the
  lowest point of the seated robe 0.6–1.4 cm lower in Sit_Cheer and Sit_Shout (-0.033, -0.032 m), 1.4 cm higher in the cross-legged sit.
- **Step 4: the recipe** (masters/v24.44/make.sh) re-makes the robe file byte for byte (sha1 b7f247ff…, the same as p12).
  The independent review of all nineteen takes (his file / v24.43 / p12, which version is A or B shuffled per take by a
  fixed hash, the key outside the reader's folder) is running. Installed meanwhile: assets/pho.glb from p12 (sha1
  0f98e78b…, byte for byte the candidate's prep).
- **Found in my own before-and-after pictures while it runs:** in Sit_Shout_Hands_on_Mouth his hands, which frame his
  face in his file, ride the straightened chest up ABOVE his head (21–23 cm): the head keeps its world turn, the hands
  do not, so their relation to the face is lost. The joint-distance measure could not see it (the rig has no fingers; no
  wrist comes within 30 cm of the head joint in any take). Baking p13: the shout's shoulders given the turn back too
  (UPRIGHTARMS), so the arms keep their world pose and move with the head. Sit_Cheer's resting hand moves 4–5 cm off
  its knee (9° turn): photographed, it reads the same, left as it is.
- **p13 baked** (p12 with UPRIGHTARMS for the shout): only the shout changed (every other take skins as p12, 0.00 cm).
  Each hand's place seen from his head, his file against p12 / p13: the shout 13–16 cm / 1 cm — his hands frame his face
  again, the body upright under them (photographed). Elsewhere the hands seen from the head move 7–24 cm in p12 (the
  arms ride the straightened chest while the head keeps its turn): the casts' and talking's gestures sit a little higher
  against the face; the reader's verdict decides whether any other take needs its shoulders given back.
- **Step 5: the final file** (the recipe with the shout in UPRIGHTARMS): masters/v24.44/make.sh re-makes the robe file
  byte for byte (sha1 0f0fdf01…, the same as p13) and assets/pho.glb byte for byte (a second packing: sha1 4acdbbf6…,
  6,792,132 bytes). The shout's trunk (rigstrain): caved 0.3 % at most (as v24.43), its chest 0.94 and back 0.91 at
  their first percentile. Photographed from the installed file: shots/pho-upright-moving.jpg and -seated.jpg (v24.43
  over v24.44, side views on a solid floor; the moving sheet's walking and cast_5 rows re-rendered from the final file
  are pixel-identical), shots/takes-1..3.jpg (every take, five angles).
- **Step 6: the review of p12** (a fresh reader, all nineteen takes, his file / v24.43 / p12 shuffled per take; the
  key: the session's key12.txt). Mapped back: p12 against his file 10 better, 2 the same, 7 worse; v24.43 against his file
  10 better, 8 the same, 1 worse (the cross-legged sit); p12 against v24.43 5 better (Charged_Spell_Cast_1, the
  cross-legged sit, Sitting_Answering_Questions, Walking, mage_soell_cast_6), 7 the same, 7 worse. The reader found the
  upright version in every sheet unaided (its head 4–17 px back), and "every arm that is raised compared with his file
  belongs to the version whose head moved back". The seven worse: the arms riding the straightened chest aim HIGH
  (mage_soell_cast_3's forward thrust an upward reach, cast_4's arms in a V, cast_5's hand over his head, the sword
  slash 30–45° up with the forearm over his eyes, the shout's hands above his head); Talk_with_Hands_Open LEANING BACK
  8–10° from the hips (his file already stands straight there: its hips tip back as far as its waist bends forward — my
  "a pelvis number is not a lean" was wrong for this take); Charged_Spell_Cast's crouch with the trunk pulled up and the
  head on his chest, looking at the floor (the crouch is the move). Also: walking's arm swing higher, the talking and
  answering hands at chest height.
- **Step 7: per take, by what the review showed.** The lean that IS the move stays his file's (no turn): the crouching
  cast (Charged_Spell_Cast), the sword slash, the lunging and tilting casts (cast_3, cast_4) and cast_5's crouch; and
  Talk_with_Hands_Open, which already stands straight. Wherever the body is straightened and a hand aims or hangs, the
  arms keep their world pose (UPRIGHTARMS): walking (arms hang from the shoulders, so they swing beside him, not up in
  front), Charged_Spell_Cast_1, Sitting_Answering_Questions, mage_soell_cast, cast_6, cast_7, with the three sits that
  already had it. Running, Sit_Cheer and the hand-on-hip take stay as p12 (no fault; the hand on the hip rides the
  chest: 1 cm). Baking p14; then the hands against the chest, the photographs, and a blind review of the changed takes.
- **Step 7 baked (p14) and measured.** The takes given no turn skin exactly as v24.43's file (0.00 cm: Charged_Spell_Cast,
  the sword slash, Talk_with_Hands_Open, cast_3, cast_4, cast_5, cast_8); the takes kept as reviewed exactly as p12/p13
  (0.00 cm: running, Sit_Cheer, the cross-legged sit, the shout, sit-to-stand, the hand-on-hip take). In the seven
  reworked takes the hands, seen from his head, sit within 1–2 cm of his file's (p12: 7–24 cm); the wrists come 2–8 cm
  nearer the trunk's axis (closest Charged_Spell_Cast_1's left wrist, 14 cm at 1.95 s: photographed, in front of the
  robe); the leans as p12 (walking 4.7°, the casts 7.4–7.9°, the sits ~10°); the trunk caved at 0.6 % at most in them
  (mage_soell_cast; v24.43 0.5 %), the upper chest's first percentile 0.02–0.04 lower where the shoulders are given back.
  Photographed (his file / p12 / p14, front and both sides): every gesture back where his file has it, the body straight
  under it; Sitting_Answering_Questions at 6.5 s still leans back further than his file (the take leans back there; the
  turn adds to it) — the reader decides. A blind review of the seven reworked takes (his file / v24.43 / p14, shuffled
  by a second hash; the key: the session's key14.txt) is running.
- **The recipe re-run (my slip, recorded):** I edited make.sh's notes while sh was still executing it; both files were
  written first (the robe file identical to p14, sha1 9feb8236…; assets/pho.glb 6,793,504 bytes, sha1 53031273…,
  identical to a second packing), then the shell read on from its old place in the changed file and stopped on a
  fragment (exit 127). The recipe is re-run untouched before the commit.
- **Step 8 done, the second review** (a fresh reader, blind; the seven reworked takes, his file / v24.43 / p14 shuffled by
  a second hash). Mapped back: p14 against his file 7 better (walking and cast_7 slightly); v24.43 against his file 3
  better, 3 the same, 1 slightly worse (walking); p14 against v24.43 better in all 7. The reader found the upright version
  on every sheet unaided (head and both hands 6–14 px back together, the legs unmoved) and: "No gesture changes its aim",
  "No hand or forearm passes into the body or the robe", the head natural on every sheet, no version leaning back
  unnaturally anywhere. Mild, on p14: Sitting_Answering_Questions at 6.5 s and the shout at 1.8 s 4–5° past vertical (the
  closest calls; the shout's hands end ~12 cm further back over his lap); Charged_Spell_Cast_1's hand reaches 8–10 cm less
  far without the lean into the thrust ("a matter of taste"); mage_soell_cast at 0.5 s and cast_7 at 1.8 s head over the
  heels (unsure: "it reads upright"). Shared with v24.43, not this pass's: the drape's stiff panel, the walking hem's grey
  band, the hem's ring of strips from below, a crease at the front of the right shoulder (faint in his file) — noted.
- **Step 9: final.** The recipe as committed re-run untouched (the robe file and assets/pho.glb byte for byte); docs; the
  diff read; commit, tag v24.44, push; the report to Chad.
