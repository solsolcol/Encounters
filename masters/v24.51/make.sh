#!/bin/sh
# v24.51 · GRANDMASTER PHO: THE ROBE'S EDGE AT HIS RIGHT ARMPIT CLEAN, AND NOTHING FLOATING (prepared, not a build; not cast
# until episode 4 chapter 3). Builds on masters/v24.50/make.sh: the same two steps from masters/v24.49/prep/pho_cloth.glb,
# tools/armfree.mjs given new settings and tools/prepmonk.mjs run without its own weight smoothing (armfree does it now,
# first). The plan, Chad's words and every try: masters/v24.51/PLAN.md.
#
# CHAD, 8 Nov 2026: "Fix the jagged part, and there are some floating pieces that needs fixing".
#   The jagged part: the robe's top edge under his raised right arm, drawn up into white teeth.
#   The floating pieces: a cap hanging under the arm as a flap (the Charged cast), a thread off his side (cast 6, from
#   behind), seven loose bits of his scan.
#
# THE STEPS:
#   1-6. masters/v24.49/make.sh's own, unchanged (run it first, or reuse its prep/pho_cloth.glb).
#   7.   tools/armfree.mjs:
#          DIFFUSE=24     prepmonk's weight smoothing run FIRST (at v24.50 it ran after armfree, gave the arm's share back
#                         to 2,864 points of the freed robe and blurred every hold on the skin beside it);
#          SKINFILL=8 SKINHOLD=2 SKINMAX=0.5
#                         the armpit's skin within 8 rings of the robe blended between the robe and the arm (held at the
#                         robe's weights for 2 rings, never beside the arm's own skin), so the robe's coloured edge stays
#                         with the robe;
#          JOINSKIN=1     the 333 triangles joining the robe's edge to the arm KEPT and drawn in his arm's skin: with the
#                         arm up they stretch into one even web of skin, an armpit (cut, v24.50, they left a gap and
#                         caps that hung as flaps);
#          DROPBITS=12    the seven loose bits of his scan (1 to 9 triangles, joined to nothing) taken out;
#          CUT=1 CUTARM=0.5 SPECKCUT=1 CAPROBE=none CAPARM=fan
#                         as v24.50: the scraps of robe stuck on his arm (105 triangles) taken out, their openings capped.
#   8.   tools/prepmonk.mjs as v24.50 with WSMOOTH=0 (its smoothing already done in step 7).
#
# THE PROOF: steps 7-8 run twice from masters/v24.49/prep/pho_cloth.glb make the same assets/pho.glb byte for byte. Before
#   the thinning, against v24.50's step-7 file smoothed as prepmonk smoothed it: no point moved; weights changed only round
#   his right armpit; triangles gone or added only at his right arm and the seven bits (PLAN.md, scratch local.mjs).
#
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp three
set -e
cd "$(dirname "$0")/../.."
P=masters/v24.49/prep
T=masters/v24.51/prep
mkdir -p $T
[ -f $P/pho_cloth.glb ] || sh masters/v24.49/make.sh
DIFFUSE=24 SKINFILL=8 SKINHOLD=2 SKINMAX=0.5 JOINSKIN=1 DROPBITS=12 CUT=1 CUTARM=0.5 SPECKCUT=1 CAPROBE=none CAPARM=fan \
  node tools/armfree.mjs $P/pho_cloth.glb $T/pho_cloth_arm.glb
WSMOOTH=0 TWOSIDE='^(Cloth|Skirt)' TEX=4096 NTEX=2048 CHARTFIX=1 node tools/prepmonk.mjs $T/pho_cloth_arm.glb assets/pho.glb 0.3
# the check: the four raised-arm moments close up, front and his right (scratch plan.json: Sit_Cheer_with_Left_Hand 0.93,
# mage_soell_cast 0.79, mage_soell_cast_6 1.38, Charged_Spell_Cast 2.27):
#   node tools/clipsheet.mjs assets/pho.glb <out> --plan=<plan.json> --views=0:4,270:4 --size=460 --frame=joint:RightArm:0.36 --look=skin@raw
# and every take: node tools/clipsheet.mjs assets/pho.glb <out> --look=skin@raw --floor --views=0:6,270:6 --size=300
