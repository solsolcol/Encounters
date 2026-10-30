#!/bin/sh
# v24.15 · Chad's people for episode 4 chapter 1, from his Google Drive folder (30 Oct 2026: "The rest of the models you
# need are all in this google drive folder" — https://drive.google.com/drive/folders/1m2ZcrGqcroqA3AjF-p_h9kwSidvQY1A4).
# The sources are kept in masters/v24.15/src/ (gitignored — *.glb there). All his own models: no credit rows.
#   pong.glb        Meshy scan on a 28-joint Mixamo rig, 598k triangles, 11 takes of his own
#   pa_noi.glb      the same, 596k, 7 takes
#   stall_lady.glb  the same, 596k, 6 takes
#   old_ghost.glb   a still scan (no rig), 571k — the presence, an old woman in a breast cloth and a dark tube skirt
# Each rig through the Meshy recipe (tools/prepmonk.mjs: weights diffused before the simplify, normals shared across the
# seams, CHARTFIX for the atlas's thin charts, 2048 sheets) at the cut the yard and the room can carry on a phone; what a
# file lacks is made from what it has:
#   Pong's upright chair sit — the sala's bench and the pickup's seat — is baked from his own Chair_Sit_Idle_M (its
#   upright stretch, there and back; v22.0's sitloop) as Sit_Upright;
#   Pa Noi's giving and waving gestures (endings A, B and C) are retargeted from the v24.0 stand-in's own takes
#   (tools/retarget.mjs, mixamo, --align).
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp
set -e
cd "$(dirname "$0")/../.."
T=${T:-/tmp/people}; mkdir -p $T
git show 17eaa4c:assets/e4noi.glb > $T/e4noi_standin.glb       # the stand-in, for its two gestures
TEX=2048 CHARTFIX=1 node tools/prepmonk.mjs masters/v24.15/src/pong.glb $T/pong15.glb 0.15
TEX=2048 CHARTFIX=1 node tools/prepmonk.mjs masters/v24.15/src/pa_noi.glb $T/noi15.glb 0.15
TEX=2048 CHARTFIX=1 node tools/prepmonk.mjs masters/v24.15/src/stall_lady.glb $T/stall12.glb 0.12
NAME=Sit_Upright node masters/v22.0/owners/sitloop.mjs $T/pong15.glb $T/pongS.glb 9.2 1.2
node tools/retarget.mjs $T/e4noi_standin.glb $T/noi15.glb $T/noiA.glb Checkout_Gesture mixamo --align
node tools/retarget.mjs $T/e4noi_standin.glb $T/noiA.glb $T/noiB.glb Wave_One_Hand mixamo --align
# the presence: a still scan stood 1.5 m tall, its base colour a 2048 JPEG (tools/prepstatic.mjs; her face already looks
# along +z, as the rigs' do — photographed)
node tools/prepstatic.mjs masters/v24.15/src/old_ghost.glb $T/ghost.glb 1.5 0.12 0 2048 86
cp $T/pongS.glb assets/e4pong.glb
cp $T/noiB.glb assets/e4noi.glb
cp $T/stall12.glb assets/e4stall.glb
cp $T/ghost.glb assets/e4ghost.glb
# v24.16 · Pong's pickup, "Rivian R1T (2022)" by geyges (Sketchfab, Free Standard licence — credited), the folder's
# pickup_truck.glb: its tinted windows opaque, the cabin's insides and the doors' take dropped, every map but base colour
# gone (the paint's yellow and the tyres' black are its vertex colours, kept), joined by material, turned nose to -z on
# the drawn pickup's axles; the simplifier floors near 100k at this error bound (its hard edges are attribute seams)
ERR=0.002 node tools/preppickup.mjs masters/v24.15/src/pickup_truck.glb assets/e4pickup.glb 0.15 1024
# v24.17 · the three pieces on the master's tray, Chad's own scans (no credit rows): each a light cut for the tray (and
# the Nang Kwak for his altar too) and the full scan for the bag's views — every triangle, colour 4096, the amulet rule
# (v14.14). THICK=1 for the two that are not flat medallions; LYING=1 for the pha yant, which lies along x; FACE=pos
# because their faces already look along +z (photographed).
THICK=1 FACE=pos node tools/prepamulet.mjs masters/v24.15/src/nang_kwak.glb assets/e4nangkwak.glb 0.03 1024 512
THICK=1 node tools/prepamulet.mjs masters/v24.15/src/takrut.glb assets/e4takrut.glb 0.2 1024 512
LYING=1 FACE=pos node tools/prepamulet.mjs masters/v24.15/src/pha_yant.glb assets/e4phayant.glb 0.05 1024 512
THICK=1 FACE=pos HD=1 node tools/prepamulet.mjs masters/v24.15/src/nang_kwak.glb assets/e4nangkwakhd.glb 1 4096 2048
THICK=1 HD=1 node tools/prepamulet.mjs masters/v24.15/src/takrut.glb assets/e4takruthd.glb 1 4096 2048
LYING=1 FACE=pos HD=1 node tools/prepamulet.mjs masters/v24.15/src/pha_yant.glb assets/e4phayanthd.glb 1 4096 2048
