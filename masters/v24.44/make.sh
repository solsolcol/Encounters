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
#   less a natural one (5° walking, standing and talking; 8° the casts; 10° running and the sits). Checked first: 1,064
#   tracks, none sharing its data, all LINEAR (robeskin refuses any other).
#   UPRIGHTARMS=<take>,... — the shoulders given the turn back too, so the arms keep their world pose (a hanging arm
#   hangs, an aimed hand keeps its aim, a hand at his face stays there: seen from his head the hands move 1–2 cm) and only
#   ride the straightened shoulders. Every straightened take where a hand aims, hangs or rests: walking, the three sits,
#   sit-to-stand (its turn cut to 8°: leaning forward is how anyone stands up), Sitting_Answering_Questions,
#   Charged_Spell_Cast_1, mage_soell_cast, cast_6 and cast_7. Not running (its pumping hands would come to the chest),
#   Sit_Cheer (9°) or the hand-on-hip take (5°: the hand on his hip rides, 1 cm).
#   NO TURN, his file's posture kept, where the lean IS the move or there is no stoop: the crouching Charged_Spell_Cast,
#   the sword slash, the lunging and tilting casts (cast_3, cast_4), cast_5's crouch, mage_soell_cast_8 (already leans
#   back), and Talk_with_Hands_Open (its hips tip back as far as its waist bends, so he already stands straight).
#   THE FIRST PASS, reviewed and changed (the session's p12): every take turned, the arms riding the chest except in the
#   two sits. A blind reader of all nineteen (his file / v24.43 / p12, shuffled per take) found the upright version on
#   every sheet unaided and rated it against his file 10 better, 2 the same, 7 worse (v24.43: 10 / 8 / 1): the raised arms
#   aimed higher in the casts, the slash and the shout; Talk_with_Hands_Open leaned BACK 8–10° (I had judged it fine from
#   my own side views: wrong); the crouching cast's head dropped onto his chest. Hence the lists above.
#
# WHAT IT MEASURES (his file's skeleton against this file's, every take at 10 fps): the hips 0.00 cm, both feet 0.00 cm,
#   the head's orientation 0.00° in every take; the hands, seen from his head, within 2 cm of his file's in every take
#   with UPRIGHTARMS; the wrists 2–8 cm nearer the trunk's axis (14 cm at the closest, Charged_Spell_Cast_1 at 1.95 s,
#   photographed: in front of the robe). The upper body now leans walking 4.7° (17.7), the casts it turns 7.4–7.9°
#   (22.5–27.0), the sits 9.5–10.2° (18.7–43.5), running 10.1° (25.2); the takes not turned as his file. The trunk
#   (tools/rigstrain.mjs): caved at 0.7 % of its points at most, as v24.43; with the shoulders given back the upper chest's
#   first percentile is 0.02–0.04 lower in those takes (mage_soell_cast 0.84, caved 0.6 %). The takes not turned skin
#   exactly as v24.43's file (0.00 cm, every skinned point). 65 joints; the rest pose bakes to 0.000°; the recipe re-makes
#   its files byte for byte (checked: the robe file, and assets/pho.glb by a second packing).
#
# THE REVIEW OF THIS FILE: a second fresh reader, blind, the seven reworked takes (walking, Charged_Spell_Cast_1, the
#   shout, Sitting_Answering_Questions, mage_soell_cast, cast_6, cast_7; his file / v24.43 / this, shuffled by another
#   hash): this file BETTER than his file in all seven (walking and cast_7 slightly), and better than v24.43 in all
#   seven; "no gesture changes its aim", "no hand or forearm passes into the body or the robe", the head natural on
#   every sheet, no version leaning back unnaturally anywhere. Its mild notes on this file: Sitting_Answering_Questions at
#   6.5 s and the shout at 1.8 s sit 4–5° past vertical (the closest calls); Charged_Spell_Cast_1's hand reaches 8–10 cm
#   less far now that he does not lean into the thrust (the arm aims the same). Shared with v24.43, not this pass's: the
#   drape's stiff panel on his left arm, the walking hem's grey band at the trailing shin, the hem's ring of strips seen
#   from below, a crease at the front of his right shoulder (faint in his file). The other twelve takes are files the
#   first reader already judged: the five kept from the first pass (running, Sit_Cheer, the cross-legged sit,
#   sit-to-stand, the hand-on-hip take) better than his file, and the seven not turned exactly v24.43's (3 of them
#   slightly better than his file, 4 the same). Two readers, two rulers: no single reader saw all nineteen of this file.
#
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp three
set -e
cd "$(dirname "$0")/../.."
T=masters/v24.39/prep
mkdir -p $T
BANDS=1 SKIRT=12 SKIRTB=3 FIT=Sit_Cross_Legged_on_Floor,mage_soell_cast_8,Right_Hand_Sword_Slash V1TAKES=Running \
  TAKELIFT=Sit_Cross_Legged_on_Floor:0.055 LDRAPE=1 \
  UPRIGHT=Running:15,Walking:13,Charged_Spell_Cast_1:16,Sit_Cheer_with_Left_Hand:9,Sit_Cross_Legged_on_Floor:34,Sit_Shout_Hands_on_Mouth:19,Sit_to_Stand_Transition_M:8,Sitting_Answering_Questions:17,Talk_with_Left_Hand_on_Hip:5,mage_soell_cast:17,mage_soell_cast_6:19,mage_soell_cast_7:15 \
  UPRIGHTARMS=Sit_Cross_Legged_on_Floor,Sit_to_Stand_Transition_M,Sit_Shout_Hands_on_Mouth,Walking,Charged_Spell_Cast_1,Sitting_Answering_Questions,mage_soell_cast,mage_soell_cast_6,mage_soell_cast_7 \
  node tools/robeskin.mjs masters/v24.39/src/grandmaster_pho_v1.glb $T/pho_robe11.glb
TEX=4096 NTEX=2048 CHARTFIX=1 node tools/prepmonk.mjs $T/pho_robe11.glb assets/pho.glb 0.3
# the measure, and the photographs:
#   node tools/rigstrain.mjs $T/pho_robe11.glb --fps=10
#   node tools/clipsheet.mjs assets/pho.glb masters/v24.44/shots/take --at=0.3,0.7 --size=240 --views=0:8,90:8,180:8,270:8,45:30
