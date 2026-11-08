#!/bin/sh
# v24.55 · GRANDMASTER PHO: HIS FACE AND HANDS AT HIS SCAN'S FULL DETAIL, BAKED IN BLENDER (prepared, not a build; not cast
# until episode 4 chapter 3). Builds on masters/v24.54/make.sh: steps 1-7b exactly as v24.54 (its step 7b file is this
# recipe's input), and step 8 split round a new step in Blender. The plan, Chad's words and every try: masters/v24.55/PLAN.md.
#
# CHAD, 8 Nov 2026: "I think you can still improve the pho model much more given now that you have blender, you are not using
#   it to its fullest potential and capacity".
#
# THE STEPS:
#   1-7b. masters/v24.54/make.sh's own, unchanged (run it first, or reuse its prep/pho_cloth_armpit.glb).
#   8a.   tools/prepmonk.mjs with v24.54's settings and BAKE=dump: the run stops before the chart fix and writes the thinned
#         mesh, the mesh it read and his two sheets to prep/bake.
#   8b.   tools/rebake.py in Blender: the charts of his head and hands (and his necklace's gold) packed by Blender into a 2048
#         square of their own at his 8192 sheet's full detail (1.99x the texels of his 4096 body sheet), and his 8192 sheet
#         baked into it through each triangle's own coordinates (every triangle shows what it showed; no texel of his paint
#         changed). Blender 5's texture cache is turned off for the bake (it reads a sheet "at appropriate resolution": a
#         blurred one). About 45 seconds; no graphics card needed.
#   8c.   tools/prepmonk.mjs again, the same settings with BAKE=apply: those triangles become a part of their own with their
#         own points (every attribute their point's) and a copy of his material with the new sheet (no normal map: look D
#         draws the part unlit whole); the chart fix leaves it alone; the rest of the run is v24.54's.
#
# THE LOOK IN THE GAME: look D, "unlit, except for the robe" (Chad). The part whose material is named '... (face and hands)' is
#   drawn unlit whole, his grey hair too (the colour test read grey hair as robe and lit it, and the light showed the blocks of
#   his scan's own shape at the back of his head); the rest as before (tools/clipsheet.mjs --look=skin@raw and
#   tools/probes/phoingame.mjs draw it so; chapter 3's material patch does the same when it casts him).
#
# THE PROOF: prepmonk without BAKE still makes v24.54's file byte for byte (f0a6a9fa); the recipe run twice makes the same
#   assets/pho.glb byte for byte.
#
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp three
#   and Blender as a Python module: python3.13 -m venv bpyenv && bpyenv/bin/pip install bpy==5.2.3. BPY names that Python.
set -e
cd "$(dirname "$0")/../.."
BPY=${BPY:-python3}
S=masters/v24.54/prep
T=masters/v24.55/prep
mkdir -p $T
[ -f $S/pho_cloth_armpit.glb ] || sh masters/v24.54/make.sh
export WSMOOTH=0 STRETCHPAINT=0.35 EDGEBLEED=0.15 THINLOCK=0.25 TWOSIDE='^(Cloth|Skirt)' TEX=4096 NTEX=2048 CHARTFIX=1
rm -rf $T/bake
BAKE=dump:$T/bake node tools/prepmonk.mjs $S/pho_cloth_armpit.glb $T/unused.glb 0.3
$BPY tools/rebake.py $T/bake
BAKE=apply:$T/bake node tools/prepmonk.mjs $S/pho_cloth_armpit.glb assets/pho.glb 0.3
