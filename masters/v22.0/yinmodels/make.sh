#!/bin/bash
# v22.0 CP5 · Chad's yin amulet and yin amulet shelf (Drive), made game-ready. Both are Meshy-style scans: one mesh of
# ~593k triangles, an 8192 colour sheet, a 4096 normal and a 4096 metal-roughness sheet.
# The amulet's FACE is its portrait at +z, so FACE=pos: the tool's own guess (the side with more vertices near the
# middle) picks the BACK, where the scan carries a ghost's face in relief — the render settles it (v12.1).
#  - the AMULET (an oval locket, a young woman's photograph under its glass, a ghost's face on its back) is an amulet,
#    so it ships at FULL detail (CLAUDE.md, v14.14: every triangle, meshopt): colour 4096, normal and metal 2048 (an
#    8192 sheet is 256 MB on a phone's GPU and past some phones' texture limit); a light far cut for the velvet box
#    across the counter (the Phiboon's LOD pattern, v14.14)
#  - the SHELF (a dark wooden display cabinet of yin stock: lockets, prai oil, skulls, kuman thong, takrut cases) stands
#    three times along the left wall, so a near cut and a far cut
# SRC=<dir with amulet.bin and shelf.bin> bash masters/v22.0/yinmodels/make.sh
set -e
cd "$(dirname "$0")/../../.."
S=${SRC:?}
FACE=pos HD=1 node tools/prepamulet.mjs "$S/amulet.bin" assets/yinamulet.glb 1 4096 2048
# the far cuts: the strict simplifier floors on a scan's thousand UV islands (0.05 asked, 120k given), so the
# PERMISSIVE cut of the same file, geometry only — the far level wears the near level's own material (v21.8)
NOTEX=1 ERR=0.02 node tools/permcut.mjs assets/yinamulet.glb assets/yinamuletlod.glb 0.05
NORMAL_PX=2048 MR_PX=2048 node tools/prepstatic.mjs "$S/shelf.bin" assets/yinshelf.glb 2.0 0.2 0 4096 86
NOTEX=1 ERR=0.02 node tools/permcut.mjs assets/yinshelf.glb assets/yinshelflod.glb 0.2

# THE GHOST — Chad's female ghost ("You can use this female ghost model, if you need to show a ghost literally appearing
# in the scene"): "Horror Ghost Character - Blood Stained Spirit" by adhamasalah, Sketchfab, CC BY 4.0
# (sketchfab.com/3d-models/horror-ghost-character-blood-stained-spirit-ed1a90be19404450935720f7abaae471). A Tripo scan:
# one mesh, 197,867 triangles, one 2048 PNG, no rig. Made a STILL figure 1.62 m tall at 0.3 (59k), turned −90° so
# her face looks along +z (settled by the render, v12.1). GHOST=<the uploaded .glb>
if [ -n "$GHOST" ]; then
  node tools/prepstatic.mjs "$GHOST" assets/yinghost.glb 1.62 0.3 -90 2048 86
fi

# THE SKULLS — a REAL skull, scanned (Chad, CP5: "there are usually many skulls or occult items all over"): Khronos's
# glTF sample "ScatteringSkull" (© 2025 Public, CC0 1.0, Vladimir Petkovic), its frosted glass made BONE from its own
# ambient occlusion (masters/v22.0/skull/bone.py), 188,871 -> 17k triangles, 0.2 m brow to back. SKULL=1 to run.
if [ -n "$SKULL" ]; then
  K=${K:-/tmp/skull}; mkdir -p $K
  curl -sSL -o $K/ScatteringSkull.glb "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ScatteringSkull/glTF-Binary/ScatteringSkull.glb"
  node -e "import('@gltf-transform/core').then(async ({NodeIO})=>{const {ALL_EXTENSIONS}=await import('@gltf-transform/extensions');
    const d=await new NodeIO().registerExtensions(ALL_EXTENSIONS).read('$K/ScatteringSkull.glb');
    require('fs').writeFileSync('$K/ao.png', d.getRoot().listTextures()[0].getImage());})"
  ffmpeg -loglevel error -y -i $K/ao.png -vf "extractplanes=r,scale=1024:1024" -f rawvideo -pix_fmt gray $K/ao1024.raw
  python3 -I masters/v22.0/skull/bone.py $K/ao1024.raw $K/bone.raw
  ffmpeg -loglevel error -y -f rawvideo -pix_fmt rgb24 -s 1024x1024 -i $K/bone.raw -q:v 3 masters/v22.0/skull/bone.jpg
  node tools/prepskull.mjs $K/ScatteringSkull.glb assets/yinskull.glb 0.09 0.2 masters/v22.0/skull/bone.jpg
fi

# HER PHOTOGRAPH on the wall (assets/yingirl.jpg) is the portrait under the amulet's glass, so the wall and the locket
# are the same woman: the amulet's face rendered flat and unlit (flat.mjs), its inner oval cut out and set in an old
# cream mat with an oval window (matphoto.py), 760 x 1004
P=${P:-/tmp/yinportrait}; mkdir -p $P
node masters/v22.0/yinmodels/flat.mjs assets/yinamulet.glb $P/front.png 1600
ffmpeg -loglevel error -y -i $P/front.png -f rawvideo -pix_fmt rgb24 $P/front.raw
python3 -I masters/v22.0/yinmodels/matphoto.py $P/front.raw $P/mat.raw
ffmpeg -loglevel error -y -f rawvideo -pix_fmt rgb24 -s 760x1004 -i $P/mat.raw -q:v 2 assets/yingirl.jpg

# THE OTHER TWO PIECES HE TRIES (Chad: "in this folder, i have the lersi amulet and hanuman amulet, that the player
# will try to feel too" — Drive folder 1ZycGDfozDHZg12eIUWIfHYcovf-2RT1E): the same scan family as the yin amulet
# (~595k triangles, an 8192 colour sheet, 4096 normal and metal-roughness), so the same recipe — every triangle, colour
# 4096, the others 2048, a geometry-only far cut. Both FACE=pos (the tool's vertex-count guess picked the back of the
# Hanuman, the pierced flat silhouette, as it did the yin amulet's; the render settles it). The lersi is a hermit's
# head standing out of an arched casing, 0.43 of its height deep: THICK=1 waives the flat medallion's check.
#   the Hanuman → the Hanuman shop (World H); the lersi → the tray shop's first piece (World T)
A=${A:-/tmp/am2}; mkdir -p $A/hanu $A/lersi
if [ -n "$AMULETS" ]; then
  curl -sS -L -o $A/hanu/src.glb  "https://drive.usercontent.google.com/download?id=16gr5Yr_5PXzuurgIYT_flc5F4YOFR8hl&export=download&confirm=t"
  curl -sS -L -o $A/lersi/src.glb "https://drive.usercontent.google.com/download?id=1GzIouRBS_UtUX40B7wNHhb3W6KI7SzrQ&export=download&confirm=t"
  FACE=pos HD=1 node tools/prepamulet.mjs $A/hanu/src.glb assets/hanuamulet.glb 1 4096 2048
  THICK=1 FACE=pos HD=1 node tools/prepamulet.mjs $A/lersi/src.glb assets/lersiamulet.glb 1 4096 2048
  NOTEX=1 ERR=0.02 node tools/permcut.mjs assets/hanuamulet.glb assets/hanuamuletlod.glb 0.05
  NOTEX=1 ERR=0.02 node tools/permcut.mjs assets/lersiamulet.glb assets/lersiamuletlod.glb 0.05
fi
