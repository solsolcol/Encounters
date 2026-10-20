#!/bin/sh
# v21.8 · CHAD'S AMULET DISPLAY TRAY AND DISPLAY SHELF, and the far levels the shop needed for them.
#
# Sources (Chad's Drive folder 16ig0N-1psOJLAOx-GGk8NzWTsJCxUFip, his two models, kept beside this file in
# ../src/ — gitignored like every masters/*/src, so fetch them again from the folder if they are gone):
#   amulets_display_tray.glb   — the tray (a framed board of amulets)      → assets/traynear.glb + assets/trayfar.glb
#   amulet_display_shelf.glb   — the standing shelf of amulets              → assets/amushelf.glb (three levels)
# Two re-cuts of earlier assets for the shop's far side:
#   assets/altarrow.glb (v18.7, Chad's altar row) → assets/altarrowfar.glb (the shop altar's far level)
#   assets/monk.glb     (v16.8, Chad's monk)      → assets/monkshop.glb   (the monk before the shop's altar)
#
# Chad's rule here (v21.8): "you removed too much detail from the amulet display trays and shelf. I wanted it as
# real 3d, not just texture" — so the near levels keep their geometry (the first pass baked the tray flat).
# Every intermediate lands in this folder (gitignored); only the five files in assets/ ship.
set -e
cd "$(dirname "$0")/../../.."
D=masters/v21.8/display S=masters/v21.8/src

# 1 · the tray, whole: every triangle, base colour + normal + metal-roughness at 2048, Y up, base on y = 0
LONG=1 KEEPMR=1 TEXPX=2048 NPX=2048 ERR=0.0001 node tools/prepwess.mjs $S/amulets_display_tray.glb $D/trayfull.glb 1
# 2 · its NEAR level, the one seen at arm's length: 6 % of it (47,514 triangles), cut STRICT (no seam crossed),
#     UVs weighted 1, normals 0.5 — the amulets keep their relief; 1.9 MB
STRICT=1 UVW=1 NW=0.5 node tools/permcut.mjs $D/trayfull.glb $D/tray_s0.06.glb 0.06
cp $D/tray_s0.06.glb assets/traynear.glb
# 3 · its FAR levels, for the dozens across the counters: the board baked to three maps at 2048 (colour, normal,
#     metal-roughness, from the full tray's own surface), then a planar mid (5,952) and far (1,586) carrying them
mkdir -p $D/board
node tools/bakeboard.mjs $S/amulets_display_tray.glb $D/board 2048
node tools/planartray.mjs $D/trayfull.glb $D/board $D/trayfar.glb 6000 1600
cp $D/trayfar.glb assets/trayfar.glb

# 4 · the shelf, whole: every triangle (594,112), colour 4096, metal-roughness and normal 2048; normals shared
#     across the UV seams where the surface is smooth (50° creases kept)
KEEPMR=1 TEXPX=4096 MRPX=2048 NPX=2048 ERR=0.0001 node tools/prepwess.mjs $S/amulet_display_shelf.glb $D/shelf_full.glb 1
node tools/smoothseams.mjs $D/shelf_full.glb $D/shelf_full_s.glb 50
# 5 · three levels over the SAME vertices in one file: near (all of it), mid (30 %, strict), far (40,000, permissive)
LEVELS="mid:0.3:strict,far:40000:permissive" node tools/lodpair.mjs $D/shelf_full_s.glb $D/amushelf3.glb 0 amushelf
cp $D/amushelf3.glb assets/amushelf.glb

# 6 · the altar row's far level: 30 % of it, UVs weighted 4. NOTEX=1 shares the near level's material, so the
#     UVs must SURVIVE the cut: tools/permcut.mjs's prune keeps attributes for NOTEX (v21.8 — without it the far
#     level had no TEXCOORD_0 and the whole row drew in its base colour, all gold, from across the shop)
NOTEX=1 UVW=4 node tools/permcut.mjs assets/altarrow.glb $D/altarrowfar_uv.glb 0.3
cp $D/altarrowfar_uv.glb assets/altarrowfar.glb
# 7 · the monk for the shop: 28 %
node tools/permcut.mjs assets/monk.glb $D/monkfar.glb 0.28
cp $D/monkfar.glb assets/monkshop.glb
ls -la assets/traynear.glb assets/trayfar.glb assets/amushelf.glb assets/altarrowfar.glb assets/monkshop.glb
