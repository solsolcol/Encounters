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
#      robe, no rag at the ankle) with the torso fixed — his file's back is a dark smear there. RUNNING was fitted too and
#      put to the review against v24.42's rules: fitted, the raised leg sat in a flat-sided box with torn scraps at the
#      standing ankle (the reader: worse than v24.42), so running KEEPS v24.42's rules (V1TAKES, v24.40's own).
#
# THE INDEPENDENT REVIEW (a fresh reader, all nineteen takes, his file / VERSION A = v24.42 / VERSION B = this pass with
#   running fitted, blind to which is newer): A against his file 13 better, 4 the same, 2 worse; B 12 better, 4 the same,
#   3 worse; B against A 2 better (the sword lunge, mage_soell_cast_4), 16 the same, 1 worse (running) — so this file is
#   B with A's running: 13 better, 4 the same, 2 worse (Talk_with_Hands_Open: the drape; the sword lunge, slightly: his
#   file's trouser legs with a sail between them). Better: the trouser split and his dark smeared back gone in walking,
#   the chair sits, the casts. The same: the cross-legged sit (his smeared back gone, but a flat streaked lap), Sit_Shout,
#   Talk_with_Left_Hand_on_Hip, mage_soell_cast_8. A and B looked the same in 16 takes (1–3 % of pixels): the LDRAPE
#   change is not visible to a reader. THE FAULT IN NEARLY EVERY TAKE, in both: the loose drape on his left upper arm stands
#   off as a stiff shell, wing or cone, the forearm coming out of it — the cloth 13–22 cm off the arm, which no weight can
#   fix (step 2): a hanging-cloth rig for it is the next step, put to Chad. Also seen: a grey striped band across the
#   seat in the seated takes, torn scraps at the seated front hem, a foot through the back in mage_soell_cast_6, the
#   cross-legged lap a flat streaked sheet, a squared box round the rear leg in mage_soell_cast_8. No caved or thin torso.
#
# WHAT IT MEASURES: the trunk as v24.40–v24.42 (caved at 0.7 % of its points at most); 65 joints; the rest pose bakes to
#   0.000°; the recipe re-makes its files byte for byte (checked: the robe file, and assets/pho.glb).
#
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp three
set -e
cd "$(dirname "$0")/../.."
T=masters/v24.39/prep
mkdir -p $T
BANDS=1 SKIRT=12 SKIRTB=3 FIT=Sit_Cross_Legged_on_Floor,mage_soell_cast_8,Right_Hand_Sword_Slash V1TAKES=Running \
  TAKELIFT=Sit_Cross_Legged_on_Floor:0.055 LDRAPE=1 node tools/robeskin.mjs masters/v24.39/src/grandmaster_pho_v1.glb $T/pho_robe10.glb
TEX=4096 NTEX=2048 CHARTFIX=1 node tools/prepmonk.mjs $T/pho_robe10.glb assets/pho.glb 0.3
# the measure, and the photographs:
#   node tools/rigstrain.mjs $T/pho_robe10.glb --fps=10
#   node tools/clipsheet.mjs assets/pho.glb masters/v24.43/shots/take --at=0.3,0.7 --size=240 --views=0:8,90:8,180:8,270:8,45:30
