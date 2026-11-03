#!/bin/sh
# v24.38 · LERSI CHIN, prepared and kept ready (not in the build). Chad, 3 Nov 2026: "this is the 3d model of lersi
# chin, he will be used in the next episode" (https://drive.google.com/file/d/1trQ5W9vOopbcMf2C4DyacnIXWRP8FtAT/view).
# He is episode 4 chapter 2's master (S1·11's second half: the fog, Lersi Chin's clearing and the warning —
# docs/V24.0-EPISODE4-PLAN.md), which is not built yet: so he is prepared, photographed and committed as
# assets/lersichin.glb, and the asset key `lersichin` goes into build.py (hosted-only, E2_ONLY) the day a chapter casts
# him. Chad's own model: no credit row.
#
# THE SOURCE, kept in masters/v24.38/src/ (gitignored — *.glb there):
#   lersi_chin.glb  146,314,300 bytes, sha1 e1aea5ee88478260abe9a0ae94b5e0240caf48ed, fetched from
#                   https://drive.usercontent.google.com/download?id=1trQ5W9vOopbcMf2C4DyacnIXWRP8FtAT&export=download&confirm=t
#   A Meshy scan on a 28-joint Mixamo rig (Blender's glTF export; mesh 'model', one material, 'headfront' bone): 597,494
#   triangles over 1,197,581 vertices; base colour 8192 PNG, normal 4096, metal-roughness 4096 (NO metal anywhere — its
#   blue channel peaks at 77/255 — roughness mostly 0.87–1.0, 5 % near 0.45), KHR_materials_specular 0. 1.70 m in his
#   A-pose. Twelve takes of his own: Running, Walking, Sit_Cross_Legged_on_Floor, Sit_Thumbs_Up_Right,
#   Sit_to_standTransition_Female_2, Sitting_Answering_Questions, Stand_Talking_Angry (20.8 s), Talk_Passionately,
#   Talk_with_Hands_Open, Talk_with_Left_Hand_Raised, Talk_with_Right_Hand_Open, mage_soell_cast_3. No standing idle:
#   the chapter makes his rest from what he has (a talk take's still stretch) or retargets one (tools/retarget.mjs).
#   The look: a young hermit in a tiger-print cloth over his left shoulder, a long string of big red-brown prayer beads
#   and beads at both wrists, beads wound up his topknot, a red mark on his forehead, a small goatee, a tattoo on his
#   bare right shoulder and one on his chest, barefoot.
#
# THE TWO THINGS FOUND (both photographed, masters/v24.38/shots/):
# 1. HE IS FLAT-SHADED (2000 of 2000 sampled triangles; vertices ÷ triangles = 2.0 — LEARNINGS, v18.7 Krukai's file
#    was the same): prepmonk alone "simplified" 597,494 -> 597,324 and wrote 23 MB. tools/deflatten.mjs first (welds on
#    position/uv/joints/weights, recomputes smooth normals: 1,197,581 -> 344,653 vertices), then the cut does its job.
# 2. AT A CLOSE-UP HIS FACE IS IN THE COLOUR SHEET, NOT IN THE TRIANGLES. At 0.5 m with a 30° lens (the head filling
#    the frame), five cuts against the scan (shots/face-cuts.jpg): the 0.3 cut with a 2048 colour sheet (Pong's and
#    Krukai's level) is soft — smudged eyes, a blotch at a brow's end, a blurred tilak and mouth; EVERY triangle with a
#    2048 sheet is just as soft; the 0.3 cut with a 4096 sheet matches the scan. The normal map at 2048 is
#    indistinguishable from 4096 (shots/face-normal.jpg), so it stays 2048 (NTEX, new in prepmonk; unset it follows TEX,
#    so every earlier recipe makes the same bytes — re-run and compared). At bust distance (1.3 m on a phone) every
#    version reads alike.
#    THE COST, measured: 7.6 MB to download (5.4 MB at 2048), and on the GPU about 89 MB for the colour sheet with its
#    mipmaps against 22 MB at 2048 — about 67 MB more while he is on screen. If the chapter's phone budget cannot carry
#    it, the 2048 file is the commented line below (one swap, same key, same takes); the chapter decides when it is built.
#
# Every take checked on the shipped file, front and side, at the middle of each take (shots/takes-1.jpg, takes-2.jpg):
# all twelve play; the two chair sits sit on air (no chair) as their names say.
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp
set -e
cd "$(dirname "$0")/../.."
T=${T:-/tmp/lersi}; mkdir -p $T
node tools/deflatten.mjs masters/v24.38/src/lersi_chin.glb $T/lersi_smooth.glb
TEX=4096 NTEX=2048 CHARTFIX=1 node tools/prepmonk.mjs $T/lersi_smooth.glb $T/lersichin.glb 0.3
# (the lighter file, 2048 colour, if a chapter's budget needs it:)
# TEX=2048 CHARTFIX=1 node tools/prepmonk.mjs $T/lersi_smooth.glb $T/lersichin.glb 0.3
cp $T/lersichin.glb assets/lersichin.glb
