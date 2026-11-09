#!/bin/sh
# v24.56 · GRANDMASTER PHO: HIS RIGHT ARMPIT CLEANED UP, NOTHING POPPING OUT (prepared, not a build; not cast until episode 4
# chapter 3). Builds on masters/v24.55/make.sh: steps 1-7 exactly as v24.54 (its step 7 file is this recipe's input), step
# 7b in Blender with the new switches, and step 8 exactly as v24.55. The plan, Chad's words, the measures and every try:
# masters/v24.56/PLAN.md.
#
# CHAD, 9 Nov 2026: "why is there a piece of skin colour thing popping out from under the right armpit? didnt you notice it"
#   ... "why cant u just clean up that entire armpit area, remove all those popping out parts, is it so hard? you have been
#   going in circles on this part".
#
# THE STEPS:
#   1-7. masters/v24.54/make.sh's own, unchanged (run it first, or reuse its prep/pho_cloth_arm.glb and prep/joins.json).
#   7b.  his right armpit in Blender (tools/armpit.py between tools/meshpatch.mjs dump and apply), as v24.54 but:
#          CUTALL=1    the two folds kept at v24.54 as "the armpit" go too: they are a strip the scan laid across the mouth of
#                      the hollow under his arm, and every take drew them out as the skin shards (up to 95 times their length);
#          MIXOPEN=1   the openings they leave, along the arm and his side both, are left open: the hollow's own walls close him
#                      (closed by fans, the fans were drawn out as grey strips across his back, 46 times);
#          TONGUE=0.006  what is left of the scan's bridge on the arm's inner side (riding the arm, standing more than 0.6 cm
#                      and up to about 3 cm beyond its radius towards his side) is taken out with them: the closing fill had
#                      spanned it, and it swung out under the armpit as the flap Chad saw;
#          CREASEPAINT=16  the inside of the crease (closed in by his own body at rest) drawn in skin;
#          COVERPAINT=2, CREASENEAR=0.05  what the cut pieces covered at rest drawn in skin, so he looks as he did with his
#                      arm down (no texel of his sheet changes: the triangles are pointed at plain skin beside them).
#   8.   tools/prepmonk.mjs exactly as v24.55 (BAKE=dump, tools/rebake.py in Blender, BAKE=apply), on the new step 7b file.
#
# THE PROOF: armpit.py with none of the new switches writes v24.54's patch byte for byte (7cbb527b); meshpatch apply with it
#   writes v24.54's step 7b file byte for byte; the recipe run twice makes the same assets/pho.glb byte for byte.
#
# THE LOOK IN THE GAME: look D, as v24.55 (tools/clipsheet.mjs --look=skin@raw, tools/probes/phoingame.mjs).
#
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp three
#   and Blender as a Python module: python3.13 -m venv bpyenv && bpyenv/bin/pip install bpy==5.2.3. BPY names that Python.
set -e
cd "$(dirname "$0")/../.."
BPY=${BPY:-python3}
S=masters/v24.54/prep
T=masters/v24.56/prep
mkdir -p $T/armpit
[ -f $S/pho_cloth_arm.glb ] && [ -f $S/joins.json ] || sh masters/v24.54/make.sh
node tools/meshpatch.mjs dump $S/pho_cloth_arm.glb $T/armpit RightArm 0.35
CUTALL=1 MIXOPEN=1 TONGUE=0.006 CREASEPAINT=16 COVERPAINT=2 CREASENEAR=0.05 \
  $BPY tools/armpit.py $T/armpit/region.json $S/joins.json $T/armpit/patch.json
node tools/meshpatch.mjs apply $S/pho_cloth_arm.glb $T/armpit $T/pho_cloth_armpit.glb
export WSMOOTH=0 STRETCHPAINT=0.35 EDGEBLEED=0.15 THINLOCK=0.25 TWOSIDE='^(Cloth|Skirt)' TEX=4096 NTEX=2048 CHARTFIX=1
rm -rf $T/bake
BAKE=dump:$T/bake node tools/prepmonk.mjs $T/pho_cloth_armpit.glb $T/unused.glb 0.3
$BPY tools/rebake.py $T/bake
BAKE=apply:$T/bake node tools/prepmonk.mjs $T/pho_cloth_armpit.glb assets/pho.glb 0.3
