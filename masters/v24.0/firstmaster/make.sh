#!/bin/sh
# v24.0 — the first master (episode 4 chapter 1): the ORIGINAL Sak Yant Ajarn scan, his white cloth made black.
# Chad, 27 Oct 2026: "Can you try to make that ajahn model clothes black instead of white? Be precise in the coloring."
# Source: masters/v16.8/src/ajarn.glb (Chad's 43 MB Meshy scan on a Mixamo rig, seven takes; gitignored, kept on disk;
#   the prepared v16.8 file is also in git at 5124aa7 assets/ajarn.glb). Krukai's assets/ajarn.glb is NOT this file
#   and is pinned by chaptertest.
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp
set -e
cd "$(dirname "$0")/../../.."
T=${TMPDIR:-/tmp}/fm; mkdir -p $T
# 1. the cloth recoloured on the full scan (tools/recolorcloth.mjs: mesh-decided, head/hands/toes never touched,
#    painted leg-skin islands on the lower cloth made cloth, amulets and beads kept, slivers drawn last, specks removed)
node tools/recolorcloth.mjs masters/v16.8/src/ajarn.glb $T/firstmaster-black-src.glb masters/v24.0/firstmaster/report
# 2. the Meshy recipe (skin weights diffused, normals across seams, folds) with the v19.8 atlas fix, at 0.3 (178k tris)
CHARTFIX=1 node tools/prepmonk.mjs $T/firstmaster-black-src.glb assets/firstmaster.glb 0.3
# Measured (27 Oct): 394,102 of 594,550 triangles cloth; 1,130,675 texels recoloured; 5 specks left (from 591);
#   white left beside the black only in the head and hands (eyes, teeth, nails) and in padding nothing samples.
#   178,365 triangles, 7 takes, 4181 KB. Photographed standing (four sides, close-ups) and cross-legged.
