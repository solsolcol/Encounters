#!/bin/sh
# v24.54 · GRANDMASTER PHO: HIS RIGHT ARM FREED FROM HIS SIDE, IN BLENDER (prepared, not a build; not cast until episode 4
# chapter 3). Builds on masters/v24.53/make.sh: step 7 exactly as v24.52 (the same file, d91d9051), a new step 7b in Blender,
# and step 8 with the armpit held as built through the thinning. The plan, Chad's words and every try: masters/v24.54/PLAN.md.
#
# CHAD, 8 Nov 2026: "Would it have been easier if you had blender mcp and open the model in blender" ... (offered: "I install
#   Blender here and redo his right armpit properly, then re-check all 19 moves") ... "Ok, install blender on your end."
#
# THE STEPS:
#   1-6. masters/v24.49/make.sh's own, unchanged (run it first, or reuse its prep/pho_cloth.glb).
#   7.   tools/armfree.mjs exactly as v24.52, with JOINDUMP (a look that changes nothing: the file is d91d9051 still), which
#        lists the triangles joining the robe to his arm for step 7b.
#   7b.  his right armpit in Blender (tools/armpit.py, between tools/meshpatch.mjs dump and apply):
#          the collar his scan made round the place his inner arm touched his side (140 triangles) and the small fold below
#          it (21) taken out, with the 6 last ties beside it; every opening closed on its own side by the least-cost
#          triangulation of its rim (the arm's with his arm's skin, his side's with his side's surface); a fill triangle
#          whose corners' paint is not all skin (or all robe) under it pointed at plain paint of its kind beside it; the
#          points within 4 cm of the cut weighed to their own side (his side no longer rides the arm there, the arm's skin
#          rides the arm); the two folds across the armpit (the armpit itself) kept as they are.
#   8.   tools/prepmonk.mjs as v24.53 but: THINLOCK=0.25 (the thinning may not move a point within 25 cm of his right
#        shoulder joint whose arm share lies between 0.02 and 0.98, nor its neighbours: before this, the thinning remade the
#        joins between his arm and his side from the points round them), and ROBEHANG off (no join is left there to hang).
#
# THE PROOF: the recipe run twice makes the same assets/pho.glb byte for byte; step 7 is v24.52's file byte for byte with
#   JOINDUMP set; meshpatch with an empty change writes the file it read byte for byte; prepmonk with v24.53's settings still
#   makes v24.53's file byte for byte (THINLOCK changes nothing unless set).
#
# THE LOOK IN THE GAME: as v24.52 (tools/probes/phoingame.mjs, look D).
#
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp three
#   and Blender as a Python module: python3.13 -m venv bpyenv && bpyenv/bin/pip install bpy==5.2.3 (no graphics card needed;
#   step 7b runs in about 10 seconds). BPY names that Python.
set -e
cd "$(dirname "$0")/../.."
BPY=${BPY:-python3}
P=masters/v24.49/prep
T=masters/v24.54/prep
mkdir -p $T $T/armpit
[ -f $P/pho_cloth.glb ] || sh masters/v24.49/make.sh
DIFFUSE=24 SKINFILL=8 SKINHOLD=2 SKINMAX=0.5 JOINSKIN=1 DROPBITS=12 EDGEPAINT=0.35 ARMPAINT=0.25 EDGEDIFF=0.015 \
  CUT=1 CUTARM=0.5 SPECKCUT=1 CAPROBE=none CAPARM=fan JOINDUMP=$T/joins.json \
  node tools/armfree.mjs $P/pho_cloth.glb $T/pho_cloth_arm.glb
node tools/meshpatch.mjs dump $T/pho_cloth_arm.glb $T/armpit RightArm 0.35
$BPY tools/armpit.py $T/armpit/region.json $T/joins.json $T/armpit/patch.json
node tools/meshpatch.mjs apply $T/pho_cloth_arm.glb $T/armpit $T/pho_cloth_armpit.glb
WSMOOTH=0 STRETCHPAINT=0.35 EDGEBLEED=0.15 THINLOCK=0.25 TWOSIDE='^(Cloth|Skirt)' TEX=4096 NTEX=2048 CHARTFIX=1 \
  node tools/prepmonk.mjs $T/pho_cloth_armpit.glb assets/pho.glb 0.3
