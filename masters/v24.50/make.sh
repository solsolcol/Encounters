#!/bin/sh
# v24.50 · GRANDMASTER PHO: THE ROBE FREED FROM THE UNDERSIDE OF HIS RIGHT ARM (prepared, not a build; not cast until
# episode 4 chapter 3). Builds on masters/v24.49/make.sh: its steps 1-6 are unchanged and its pho_cloth.glb is this
# recipe's input; one step is new (tools/armfree.mjs, between robesim and prepmonk); prepmonk as v24.49. The plan, Chad's
# words and every try: masters/v24.50/PLAN.md.
#
# CHAD, 7 Nov 2026: "The robe is like attached to the underside of the arm. Do you know what i mean" ... "Its the other
#   arm, why can't you see it even after telling you?" ... "Do it, go" ... "Be efficient". His RIGHT arm: the robe under
#   that armpit rode the arm (12,347 points, up to 0.86 of the arm's turn), so lifting the arm dragged the robe up its
#   underside to the elbow, with white shards along it (pictures painted by bone: the robe moving with the arm in red).
#
# THE STEPS:
#   1-6. masters/v24.49/make.sh's own, unchanged (run it first, or reuse its prep/pho_cloth.glb).
#   7.   tools/armfree.mjs: the robe re-tied to his trunk; the 340 triangles joining it to skin that rides the arm taken out,
#        with the scraps of robe the scan stuck on his arm (105 triangles); each opening on the arm closed by a fan whose
#        middle sits inside the arm; the robe's side left as cut.
#   8.   tools/prepmonk.mjs as v24.49.
#
# THE PROOF: steps 7-8 run twice from masters/v24.49/prep/pho_cloth.glb make the same assets/pho.glb byte for byte
#   (sha1 7f9e098e). Every take photographed front and from his right at four moments against v24.49's file: nothing
#   changed but the right armpit (PLAN.md).
#
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp three
set -e
cd "$(dirname "$0")/../.."
P=masters/v24.49/prep
T=masters/v24.50/prep
mkdir -p $T
[ -f $P/pho_cloth.glb ] || sh masters/v24.49/make.sh
CUT=1 CUTARM=0.5 SPECKCUT=1 CAPROBE=none CAPARM=fan node tools/armfree.mjs $P/pho_cloth.glb $T/pho_cloth_arm.glb
TWOSIDE='^(Cloth|Skirt)' TEX=4096 NTEX=2048 CHARTFIX=1 node tools/prepmonk.mjs $T/pho_cloth_arm.glb assets/pho.glb 0.3
# the check: what moves with his right arm, painted red (the scratch copy of tools/clipsheet.mjs with a paint look, PLAN.md),
# and every take: node tools/clipsheet.mjs assets/pho.glb <out> --look=skin@raw --floor --views=0:6,270:6 --size=300
