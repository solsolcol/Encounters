#!/bin/sh
# v24.52 · GRANDMASTER PHO: HIS RIGHT ARMPIT CLEAN IN THE LOOK THE GAME DRAWS HIM IN (prepared, not a build; not cast until
# episode 4 chapter 3). Builds on masters/v24.51/make.sh: the same two steps from masters/v24.49/prep/pho_cloth.glb, with
# tools/armfree.mjs given two more settings and tools/prepmonk.mjs one new step after its thinning. The plan, Chad's words
# and every try: masters/v24.52/PLAN.md.
#
# CHAD, 8 Nov 2026: "It is still not clean enough." / "Also how will he look in the game? Will he be unlit or lit? It makes
#   a massive difference to how he looks" / "I want to see how he will actually look in the game" / "I thought i said
#   before my preference is for the model to be unlit, except for the robe".
#   In the game he is drawn in look D (his pick, v24.47, said again here: his skin and necklaces unlit, the robe lit). In
#   that look what was left at his right armpit was colour: triangles holding the robe's white that stretch with the arm
#   (white teeth), and the robe's white the scan printed onto his upper arm.
#
# THE STEPS:
#   1-6. masters/v24.49/make.sh's own, unchanged (run it first, or reuse its prep/pho_cloth.glb).
#   7.   tools/armfree.mjs as v24.51, and:
#          EDGEPAINT=0.35 EDGEDIFF=0.015   a triangle within 35 cm of his right shoulder joint holding the robe's white
#                                          and skin both, whose corners ride the arm by different amounts, drawn in the
#                                          skin beside it;
#          ARMPAINT=0.25                   a triangle riding the arm within 25 cm holding the robe's white (the scan's
#                                          print of the robe on his arm) drawn in the skin beside it.
#   8.   tools/prepmonk.mjs as v24.51, and:
#          STRETCHPAINT=0.35               the same rule AFTER the thinning (the thinning merges points into new such
#                                          triangles; built without it there are none): a triangle within 35 cm of his
#                                          right shoulder joint that stretches with his right arm and holds any of the
#                                          robe's white, drawn in the skin beside it.
#
# THE PROOF: steps 7-8 run twice make the same assets/pho.glb byte for byte; armfree and prepmonk with v24.51's settings
#   still make v24.51's files byte for byte (the new settings change nothing unless set).
#
# THE LOOK IN THE GAME: tools/probes/phoingame.mjs boots the real game (dist/) on a phone and stands him in a chapter's
#   world with the game's renderer, light and lens, look D patched on as the chapter will (HANDS=0: the player's hands
#   hidden, as a film shows him; LOOKSET picks the looks, default D and lit):
#   HANDS=0 CH=e3c1 LOOKSET=D:1 node tools/probes/phoingame.mjs assets/pho.glb <out>              (a temple in daylight)
#   HANDS=0 CH=e4c1 LOOKSET=Dscene:1:0.75 node tools/probes/phoingame.mjs assets/pho.glb <out>    (the evening yard, his
#                                                                                                 unlit skin at 0.75)
#
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp three
set -e
cd "$(dirname "$0")/../.."
P=masters/v24.49/prep
T=masters/v24.52/prep
mkdir -p $T
[ -f $P/pho_cloth.glb ] || sh masters/v24.49/make.sh
DIFFUSE=24 SKINFILL=8 SKINHOLD=2 SKINMAX=0.5 JOINSKIN=1 DROPBITS=12 EDGEPAINT=0.35 ARMPAINT=0.25 EDGEDIFF=0.015 \
  CUT=1 CUTARM=0.5 SPECKCUT=1 CAPROBE=none CAPARM=fan node tools/armfree.mjs $P/pho_cloth.glb $T/pho_cloth_arm.glb
WSMOOTH=0 STRETCHPAINT=0.35 TWOSIDE='^(Cloth|Skirt)' TEX=4096 NTEX=2048 CHARTFIX=1 \
  node tools/prepmonk.mjs $T/pho_cloth_arm.glb assets/pho.glb 0.3
