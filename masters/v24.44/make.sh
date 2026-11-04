#!/bin/sh
# v24.44 · GRANDMASTER PHO STANDS UPRIGHT (prepared, not a build; not cast until episode 4 chapter 3). Builds on
# masters/v24.43/make.sh (read it first: every option below but UPRIGHT and UPRIGHTARMS is its own, unchanged). The plan
# and every step's measure, written as the work went: masters/v24.44/PLAN.md.
#
# CHAD, 4 Nov 2026: "Why does pho model look hunchback in so many poses? Make him more upright"
#
# THE WHY (measured on his file's own takes, which no pass of mine had changed — v24.43's skeleton is his file's, every
#   take): at rest he stands straight, his upper body 2° from vertical. In his takes the LOWEST SPINE JOINT (Spine, at his
#   waist) is bent forward 42–75° against rest in EVERY take — walking 42 ± 1°, talking with a hand on his hip 42 ± 1°,
#   the casts 50–56° — and barely moves within a take, while his hips tip back about 25°, Spine1 and Spine2 sit near rest,
#   and his neck bends BACK 15–40° to bring his face up. A bend that is the same in every take, standing, walking and
#   sitting alike, is not acting: it is how the animations were laid onto his scan's rig. His upper body (Spine2's
#   rest-up, against the hips' facing; the mean of each take at 10 fps) leaned walking 17.7°, talking 24.0°, the casts
#   22.5–31.6°, the sits 18.7–43.5°, running 25.2°, his head 10–21 cm ahead of his hips: the back bent forward at the
#   waist, the head pushed out and craned up. That is the hunchback, and it is in his file too (photographed side by
#   side: the same stoop). From his left side the loose drape on his left upper arm (v24.43's open item, a hanging-cloth
#   rig put to Chad) adds a bulge at the shoulder that reads as a hump; this pass does not touch it.
#
# THE FIX (tools/robeskin.mjs, before the robe's chains are baked, so the skirt follows the straightened body):
#   UPRIGHT=<take>:<degrees>,... — a constant backward turn of the waist joint about his side-to-side axis (the hips' own,
#   which is constant in the hips' frame), and the same turn given back at the NECK key by key, so his head keeps exactly
#   the orientation his animation gave it: he looks where he looked. The hips and legs are not touched, so his feet stay
#   where they were, and a turn the same through a take keeps every movement in it. Each take's turn is its measured lean
#   less a natural one (5° walking, standing and talking; 8° the casts; 10° running and the sits; the sword lunge to 25°,
#   the lunge being the move; mage_soell_cast_8 already leans back: none). Checked first: 1,064 tracks, none sharing its
#   data, all LINEAR (robeskin refuses any other).
#   UPRIGHTARMS=<take>,... — the shoulders given the turn back too, so the arms hang as the take had them and only ride
#   the straightened shoulders: the cross-legged sit (straightened alone, its arms swung up with the chest and stood
#   straight out, where his hands had rested toward his knees) and sit-to-stand (its hands hovered above the knees they
#   push on; its turn cut to 8°, since leaning forward is how anyone stands up).
#   TRIED AND KEPT OUT: straightening the hips too. With them still tipped back by the takes (-20 to -33°), talking with
#   hands open has his head 8.9 cm BEHIND his hips (was 3.1 ahead); photographed from both sides it does not read as
#   leaning back (the number is the pelvis's own tilt), so the hips stay as his takes have them.
#
# WHAT IT MEASURES (his file's skeleton against this file's, every take at 10 fps): the hips 0.00 cm, both feet 0.00 cm,
#   the head's orientation 0.00° in every take; the hands ride the straightened chest 1–35 cm (with UPRIGHTARMS the
#   cross-legged sit's 20 cm, from 31, and sit-to-stand's 5 cm). The upper body now leans walking 4.7°, talking 5.0°
#   (with a hand on his hip 4.6°, from 9.6), the casts 7.4–8.2°, the sits 9.5–10.2°, running 10.1°, the sword lunge 24.8°
#   (43.9), sit-to-stand 31.9° (39.9); his head 9.8 cm ahead of his hips at most on average (was 20.8), sit-to-stand
#   14.2 (19.0). The trunk
#   (tools/rigstrain.mjs, against v24.43's file): caved at 0.7 % of its points at most, as before; the worst back 0.77 of
#   its depth (0.78), the worst chest 0.86 (0.86); the cross-legged sit's chest 0.88 at its first percentile (0.95), its
#   points none under 0.75. Skinned, take by take against the bake without UPRIGHTARMS: walking, talking, cast_5 and
#   running 0.00 cm. 65 joints; the rest pose bakes to 0.000°; the recipe re-makes its files byte for byte (checked: the
#   robe file, and assets/pho.glb).
#
# THE INDEPENDENT REVIEW: see masters/v24.44/PLAN.md (Progress), and docs/HISTORY.md's v24.44 entry.
#
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp three
set -e
cd "$(dirname "$0")/../.."
T=masters/v24.39/prep
mkdir -p $T
BANDS=1 SKIRT=12 SKIRTB=3 FIT=Sit_Cross_Legged_on_Floor,mage_soell_cast_8,Right_Hand_Sword_Slash V1TAKES=Running \
  TAKELIFT=Sit_Cross_Legged_on_Floor:0.055 LDRAPE=1 \
  UPRIGHT=Running:15,Walking:13,Charged_Spell_Cast:21,Charged_Spell_Cast_1:16,Right_Hand_Sword_Slash:19,Sit_Cheer_with_Left_Hand:9,Sit_Cross_Legged_on_Floor:34,Sit_Shout_Hands_on_Mouth:19,Sit_to_Stand_Transition_M:8,Sitting_Answering_Questions:17,Talk_with_Hands_Open:19,Talk_with_Left_Hand_on_Hip:5,mage_soell_cast:17,mage_soell_cast_3:17,mage_soell_cast_4:16,mage_soell_cast_5:24,mage_soell_cast_6:19,mage_soell_cast_7:15 \
  UPRIGHTARMS=Sit_Cross_Legged_on_Floor,Sit_to_Stand_Transition_M \
  node tools/robeskin.mjs masters/v24.39/src/grandmaster_pho_v1.glb $T/pho_robe11.glb
TEX=4096 NTEX=2048 CHARTFIX=1 node tools/prepmonk.mjs $T/pho_robe11.glb assets/pho.glb 0.3
# the measure, and the photographs:
#   node tools/rigstrain.mjs $T/pho_robe11.glb --fps=10
#   node tools/clipsheet.mjs assets/pho.glb masters/v24.44/shots/take --at=0.3,0.7 --size=240 --views=0:8,90:8,180:8,270:8,45:30
