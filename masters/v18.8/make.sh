#!/bin/sh
# v18.8 · Chad's Buddha and sangkathan set — the recipe. Sources (gitignored)
# from his Drive folder 1u_x416H5MctKr6lVy1IQQ1zRVRi9jtfR:
#   src/buddha.glb    1StPFM_Z6aZtoL-fBs3ox9S7Sa-wCdai6  (588,799 tris, colour/normal 2048, metal-roughness 4096)
#   src/sangkatan.glb 1q2ADqEZDwrEewBD7nRhS7942DzP-R4xo  (590,035 tris)
set -e
cd "$(dirname "$0")/../.."
O=masters/v18.8/out; mkdir -p $O
# THE BUDDHA, NEAR: every triangle, all three maps (the metal sheet IS its sheen)
KEEPMR=1 NPX=2048 TEXPX=2048 ERR=0.0001 node tools/prepwess.mjs masters/v18.8/src/buddha.glb $O/buddhahd.glb 1
# MID: the regular simplifier floors at ~123k (the atlas's many islands are
# seams it will not cross); its normals are then recomputed across the seams,
# or the polished face reads as facets
KEEPMR=1 NPX=1024 TEXPX=1024 node tools/prepwess.mjs masters/v18.8/src/buddha.glb $O/buddha.glb 0.06
node masters/v18.8/smoothn.mjs $O/buddha.glb $O/buddha-sm.glb
# FAR: a topology-free cut of the MID's own vertices, in the same file
node masters/v18.8/lod.mjs $O/buddha-sm.glb $O/buddhalod.glb 30000
# THE SANGKATHAN SET: a prop, 52k triangles, no metal sheet (it is plastic)
LONG=1 NPX=1024 TEXPX=2048 node tools/prepwess.mjs masters/v18.8/src/sangkatan.glb $O/sangkathan.glb 0.08
cp $O/buddhahd.glb $O/buddhalod.glb $O/sangkathan.glb assets/
