#!/bin/sh
# v24.0 CP7 · the cast's own cuts (episode 4 chapter 1).
# 1. The first master's SHADOW (§7.4): a silhouette cut of the same scan — no UVs, normals, textures or clips (it plays
#    his own clips, bound by bone name), 594,550 → 11,828 triangles, 327 KB (tools/prepshadow.mjs). Colour never
#    matters to a shadow, so it is cut from the white original, not the recoloured one.
# 2. Pa Noi's and Uncle Lim's STAND-INS until Chad's models (docs/E4-MODELS.md): episode 3's Yin shop keeper and its
#    amulet-shop owner by v22.0's own recipe (masters/v22.0/owners/make.sh: Idle_9 retargeted in, prepmonk, the owner's
#    seated take baked upright by sitloop) at a crowd's cut — 0.07 and 1024 sheets instead of 0.25 and 2048 — because the
#    sala's view holds both of them with Khun Joy, Ta Sombat and Pong (149k + 150k at the old cut, over the phone's budget
#    alone): 41,894 and 41,852 triangles, 1125 KB and 1412 KB.
set -e
cd "$(dirname "$0")/../../.."
O=${O:-/tmp/owners}; mkdir -p $O/owner $O/keeper
node tools/prepshadow.mjs masters/v16.8/src/ajarn.glb assets/fmshadow.glb 0.02
curl -sS -L -o $O/owner/src.glb  "https://drive.usercontent.google.com/download?id=1lQAytQ_5pqKiZTIpDpEjVrha-_5yJnOx&export=download&confirm=t"
curl -sS -L -o $O/keeper/src.glb "https://drive.usercontent.google.com/download?id=1-jZDOzQmjOpaRgbfhvibW7ZTs5gYjPSC&export=download&confirm=t"
node tools/retarget.mjs assets/admintee.glb $O/owner/src.glb  $O/owner/t1.glb  Idle_9 mixamo --align
node tools/retarget.mjs assets/admintee.glb $O/keeper/src.glb $O/keeper/t1.glb Idle_9 mixamo --align
TEX=1024 node tools/prepmonk.mjs $O/owner/t1.glb  $O/owner/p7.glb  0.07
TEX=1024 node tools/prepmonk.mjs $O/keeper/t1.glb $O/keeper/p7.glb 0.07
node masters/v22.0/owners/sitloop.mjs $O/owner/p7.glb $O/owner/s7.glb 9.2 1.2
cp $O/owner/s7.glb  assets/e4lim.glb
cp $O/keeper/p7.glb assets/e4noi.glb
# 3. Pong's stand-in (staffman: idle, talk, walk) with the first master's three seated takes retargeted onto it in world
#    space (tools/retarget.mjs, mixamo, --hips): cross-legged on the room's floor, talking seated, and a chair sit for the
#    pickup's driving seat — 8 takes, 1344 KB.
node tools/retarget.mjs assets/firstmaster.glb assets/staffman.glb $O/pong1.glb Sit_Cross_Legged_on_Floor mixamo --hips
node tools/retarget.mjs assets/firstmaster.glb $O/pong1.glb $O/pong2.glb Sitting_Answering_Questions mixamo --hips
node tools/retarget.mjs assets/firstmaster.glb $O/pong2.glb $O/pong3.glb Chair_Sit_Idle_M mixamo --hips
cp $O/pong3.glb assets/e4pong.glb
