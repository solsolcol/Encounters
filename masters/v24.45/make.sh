#!/bin/sh
# v24.45 · GRANDMASTER PHO'S DRAPE HANGS (prepared, not a build; not cast until episode 4 chapter 3). Builds on
# masters/v24.44/make.sh (read it first: every option below but the DRAPE family is its own, unchanged). The plan and
# every step's measure, written as the work went: masters/v24.45/PLAN.md.
#
# CHAD, 4 Nov 2026 (answering the v24.44 report, which put the rig to him): "Go ahead with the hanging-cloth rig for the drape"
#
# THE WHY (his file's bind pose, painted and photographed): the shawl over his left shoulder is one sheet — a SLEEVE on the
#   upper arm, a BAND hanging behind the arm, a panel on his shoulder blade and a WEB to the belt. In v24.44 the band was a
#   fixed blend of the arm and his back, so whenever the arm moved its points spread across the gap between them: the stiff
#   shell, wing and shelf behind the arm in nearly every take (from his left side, the hump). His own file kept the band on
#   the arm and dragged his back instead (the torso distortion Chad first reported). Skinning cannot slide cloth: any split
#   between the arm and the body stretches somewhere; the rig decides where, and makes it hang.
#
# THE RIG (tools/robeskin.mjs, each part its own option, all of them new; unset, the file is v24.44's byte for byte):
#   DRAPE=2 — a SLEEVE BONE (DrapeArm, a child of his left shoulder at the arm's joint, turned at the arm's keys by the arm's
#     swing alone, never its twist: cloth follows a limb's swing, as the robe's legs do since v24.41) carries the sleeve; and
#     the band rides it as one piece wherever it stands OFF his body (its height above the body's own inner surface round the
#     torso's axis, from BANDO0 over BANDOW), handing over to his own weights only where it lies on him.
#   BANDSIG=0.05 — that share smoothed in space (a 5 cm Gaussian) before BANDPASS passes over the mesh: per point, a fold's
#     crest and trough took different shares and the scan's folds were pulled apart into strips.
#   DRAPEMERGE=1 — a drape point keeps four bones like every point, but a share the cut drops goes to the kept bone nearest it:
#     the band's extra bones had made 9,800 points of his left upper body lose over 2 % of their weight (1,157 over 10 %),
#     neighbours cut differently moving apart; inside the drape's reach none now (outside it, v24.44's own cut, unchanged).
#   DRAPEREACH=0.24 BANDSPINE=0.04 — only the cloth within 24 cm of the upper arm's axis and nearer the arm than the spine may
#     follow the sleeve bone; every other point keeps v24.44's weights exactly (without it the smoothing reached his upper
#     back by the spine, and a raised arm dragged the robe's top edge there 8–11 cm).
#   DRAPEHANG=1 HANGL0=0.55 HANGLW=0.30 HANGMAX=90 — THE BAND HANGS: it rides a bone of its own (DrapeHang), the sleeve
#     bone's turn and then a turn about the arm's own axis toward the side gravity hangs it at rest (its rest angle to "down"
#     round the arm kept, so rest is rest), at most 90°, continuous from key to key, and only once the arm is clearly raised
#     (the sine of its angle off vertical from 0.55, faded in over 0.30; at rest it is 0.51). Without it an arm raised
#     forward carried the cloth that hangs behind it onto its top, and its lower edge tore into streaks down to his hip
#     (Charged_Spell_Cast_1 1.8 s, the scan's fold crevices opening brown); started from a near-vertical arm, it swung the
#     band round the arm while he walked (below a hanging arm is no one side). The band's turn round the arm per take:
#     walking 2°, talking 0°, the hand on the hip 1°, the cheer 0°, the other sits 10–31°, the shout 31°, running 41°, the
#     casts 9–79°, the slash 86°.
#
# WHAT IT MEASURES (his file's skeleton, every take at 5 fps, against v24.44's file — drape/drapecmp.mjs in the session):
#   every point outside his left upper body's cloth 0.000 mm in all nineteen takes; the rest of that cloth, the drape's own
#   fading edge at his back, at most 0.6 cm. The rest pose bakes to 0.000° for both new bones. The trunk (tools/rigstrain.mjs)
#   and the review: see THE REVIEW below.
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
  DRAPE=2 BANDO0=0.02 BANDOW=0.10 BANDPASS=30 BANDSIG=0.05 DRAPEMERGE=1 DRAPEREACH=0.24 BANDSPINE=0.04 \
  DRAPEHANG=1 HANGL0=0.55 HANGLW=0.30 HANGMAX=90 \
  node tools/robeskin.mjs masters/v24.39/src/grandmaster_pho_v1.glb $T/pho_robe12.glb
TEX=4096 NTEX=2048 CHARTFIX=1 node tools/prepmonk.mjs $T/pho_robe12.glb assets/pho.glb 0.3
# the measure, and the photographs:
#   node tools/rigstrain.mjs $T/pho_robe12.glb --fps=10
#   node tools/clipsheet.mjs assets/pho.glb masters/v24.45/shots/take --at=0.3,0.7 --size=240 --views=0:8,90:8,180:8,270:8,45:30
