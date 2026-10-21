#!/bin/sh
# v21.16 — his crossed legs on Ma's floor in episode 3 chapter 2's opening film, from a REAL model (Chad: "never
# ever use those generated fake block figures"). docs/V21.16-NO-BLOCK-FIGURES.md.
# The monk's own Sit_Cross_Legged_on_Floor (monkrow.glb) retargeted onto Chad's congregation man (cg_man2hd.glb, in
# white, barefoot): both are Meshy scans on Mixamo skeletons, the take's bones mixamorig:*, his Meshy-named, so the
# `meshy` map; --align because the two rigs rest differently, --hips to carry the seat's height.
set -e
O=${O:-/tmp/v2116rt}; mkdir -p $O
node tools/retarget.mjs assets/monkrow.glb assets/cg_man2hd.glb $O/cgman2hd_x.glb Sit_Cross_Legged_on_Floor meshy --align --hips
#   --align: 21 bones swung onto the source's rest
#   --hips: rest heights 0.880 -> 0.893 (x1.0139), lowest 0.136
# the clip alone (named `cross`), no mesh, no skin, no texture: the chapter binds it to its own cg_man2hd clone by
# bone name, so cg_man2hd.glb is untouched
node masters/v21.16/crossonly.mjs $O/cgman2hd_x.glb assets/cg_man2cross.glb     # 62 KB, 23 channels
