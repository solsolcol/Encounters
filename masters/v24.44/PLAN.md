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
