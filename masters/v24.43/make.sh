#!/bin/sh
# v24.43 · GRANDMASTER PHO, the drape on his left arm and the taper out (prepared, not a build; not cast until episode 4
# chapter 3). Builds on masters/v24.42/make.sh and masters/v24.41/make.sh (read them first). The plan and every step's
# measure, written as the work went: masters/v24.43/PLAN.md.
#
# THE v24.42 REVIEW (a fresh reader, eight takes against his file): 1 better, 2 the same, 5 worse. This pass:
#   1. THE TAPER OUT. HULLTAPER moved Walking up to 20 cm and three casts 7–17 cm, takes nothing had asked it to change
#      (its only reason, the sword's and running's panels, left with V1TAKES). Without it, every take that runs the hull
#      skins exactly as v24.41's file did (0.00 cm at five moments each of six takes).
#   2. THE DRAPE ON HIS LEFT ARM (my regression, v24.39's re-bind). His file bound the cloth round his left upper arm to
#      the arm; v24.39 gave it to the chest, and he is rigged with his arms 31° out from his sides, so whenever his arm came
#      down the cloth stayed out where the arm had been: a stiff shelf at the elbow, the forearm passing into it. Measured
#      (the share of the cloth 15–105 % along the arm that follows it, his file / v24.42 / this): 6–8 cm off the arm's
#      axis 98 / 59 / 91 %, 8–10 cm 95 / 28 / 86, 10–13 cm 92 / 5 / 65. LDRAPE=1 (tools/robeskin.mjs): AFTER the weights'
#      diffusion, the cloth nearer his left upper arm than his spine and within 14 cm of it — the trunk measure's own test
#      of an arm's point — takes his file's weights back, faded in from the shoulder joint. So no point the trunk measure
#      reads is touched: tools/rigstrain.mjs gives the same trunk numbers in 18 of 19 takes (running's trunk edges squashed
#      0.1 → 0.3 %, its robe now fitted), caved at 0.7 % at most as before.
#      TRIED AND KEPT OUT (each measured): a wider arm envelope (0.10/0.05, 0.13/0.06) — the diffusion carried the arm into
#      his upper back, which caved again (Talk_with_Hands_Open's back to 0.40 of its depth, 7 % of the trunk in a cast);
#      the forearm's cloth too (no change); a reach of 22 cm (the loose drape 13–22 cm off the arm, his file 72–84 % on
#      it, swung into his torso when the arm moved: the talking take's back to 0.19, 5.5 % caved — his file's own fault).
#      So the LOOSE drape still stands off the arm as a shell when the arm comes down (said to Chad): a hanging-cloth rig
#      for it, like the robe's chains, is the next step.
#   3. THE SWORD LUNGE FITTED to his own file's robe (FIT): it reads as his file does (both legs in their own folds of the
#      robe, no rag at the ankle) with the torso fixed — his file's back is a dark smear there. RUNNING FITTED too, for the
#      review to judge against v24.42's rules: fitted, the raised leg sits in a flat-sided box at 0.3 s; v24.42's rules let
#      the foot through the back of the robe.
#
# THE INDEPENDENT REVIEW of this file: REVIEW43.
#
# WHAT IT MEASURES: the trunk as v24.40–v24.42 (caved at 0.7 % of its points at most); 65 joints; the rest pose bakes to
#   0.000°; this recipe re-makes the robe file byte for byte (the session's e1, checked).
#
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp three
set -e
cd "$(dirname "$0")/../.."
T=masters/v24.39/prep
mkdir -p $T
BANDS=1 SKIRT=12 SKIRTB=3 FIT=Sit_Cross_Legged_on_Floor,mage_soell_cast_8,Running,Right_Hand_Sword_Slash \
  TAKELIFT=Sit_Cross_Legged_on_Floor:0.055 LDRAPE=1 node tools/robeskin.mjs masters/v24.39/src/grandmaster_pho_v1.glb $T/pho_robe9.glb
TEX=4096 NTEX=2048 CHARTFIX=1 node tools/prepmonk.mjs $T/pho_robe9.glb assets/pho.glb 0.3
# the measure, and the photographs:
#   node tools/rigstrain.mjs $T/pho_robe9.glb --fps=10
#   node tools/clipsheet.mjs assets/pho.glb masters/v24.43/shots/take --at=0.3,0.7 --size=240 --views=0:8,90:8,180:8,270:8,45:30
