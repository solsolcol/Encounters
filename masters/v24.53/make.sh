#!/bin/sh
# v24.53 · GRANDMASTER PHO: THE LAST FAULTS AT HIS RIGHT ARMPIT (prepared, not a build; not cast until episode 4 chapter 3).
# Builds on masters/v24.52/make.sh: step 7 exactly as v24.52 (the same file), and tools/prepmonk.mjs given two more
# settings after its thinning. The plan, Chad's words and every try: masters/v24.53/PLAN.md.
#
# CHAD, 8 Nov 2026: "Fix those remaining issues cleanly and efficiently". The two v24.52 left, in look D (his pick, said
#   again at v24.52: his skin unlit, the robe lit): a patch of skin on the robe seen from his right in the chair sit's
#   cheer (arm up), and a faint pale line of dots in the crease of his armpit with the arm down.
#
# THE STEPS:
#   1-6. masters/v24.49/make.sh's own, unchanged (run it first, or reuse its prep/pho_cloth.glb).
#   7.   tools/armfree.mjs exactly as v24.52.
#   8.   tools/prepmonk.mjs as v24.52, and after its thinning:
#          ROBEHANG=0.175   a triangle in skin with a corner on the robe riding his trunk and a corner riding the arm by 0.3
#                           or more, further than 17.5 cm from his right shoulder joint, taken out: raised, the arm drew it
#                           out over the robe (the patch; his scan's lowest joins, rebuilt by the thinning however they
#                           were painted or cut before it);
#          EDGEBLEED=0.15   within 15 cm of that joint, a triangle of skin whose texels lie within 2 texels of the robe's
#                           white in his colour sheet pointed at a texel of the skin beside it whose 7 x 7 texels are all
#                           skin (the dots: white bleeding in at the edges of thin charts of skin). No pixel of his sheet
#                           is touched.
#
# THE PROOF: the recipe run twice makes the same assets/pho.glb byte for byte; prepmonk with v24.52's settings still makes
#   v24.52's file byte for byte, and step 7 is v24.52's file byte for byte (the new settings change nothing unless set).
#
# THE LOOK IN THE GAME: as v24.52 (tools/probes/phoingame.mjs, look D).
#
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp three
set -e
cd "$(dirname "$0")/../.."
P=masters/v24.49/prep
T=masters/v24.53/prep
mkdir -p $T
[ -f $P/pho_cloth.glb ] || sh masters/v24.49/make.sh
DIFFUSE=24 SKINFILL=8 SKINHOLD=2 SKINMAX=0.5 JOINSKIN=1 DROPBITS=12 EDGEPAINT=0.35 ARMPAINT=0.25 EDGEDIFF=0.015 \
  CUT=1 CUTARM=0.5 SPECKCUT=1 CAPROBE=none CAPARM=fan node tools/armfree.mjs $P/pho_cloth.glb $T/pho_cloth_arm.glb
WSMOOTH=0 STRETCHPAINT=0.35 ROBEHANG=0.175 EDGEBLEED=0.15 TWOSIDE='^(Cloth|Skirt)' TEX=4096 NTEX=2048 CHARTFIX=1 \
  node tools/prepmonk.mjs $T/pho_cloth_arm.glb assets/pho.glb 0.3
