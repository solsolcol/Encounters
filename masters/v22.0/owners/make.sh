#!/bin/sh
# v22.0 · CHAD'S TWO SHOP OWNERS (his message of 23 Oct: "Use this amulet shop owner 3d model to replace the current
# existing shop owner in ep 3 chp 3 buddha day amulet shop owner ... Replace cleanly." and "Use this yin shop owner to
# replace the auntie as the yin shop owner"). Both are Meshy scans on a 28-joint Mixamo rig (598k triangles, one
# baked material, 4096 base/normal/metal-roughness sheets) with takes of their own:
#   owner  — Running, Walking, Chair_Sit_Idle_M, Discuss_While_Moving, Stand_Talking_Angry, Talk_Passionately,
#            Talk_with_Hands_Open, Walk_Fight_Forward, Walk_to_Sit
#   keeper — Running, Walking, Alert, Checkout_Gesture, Talk_with_Left_Hand_on_Hip, Wave_One_Hand
# Neither carries a standing idle, so admintee's Idle_9 is retargeted onto each (world space, --align: the scans rest
# in an A-pose, the take's rig in a T). Then the v16.8 Meshy recipe (prepmonk: the auto-rig's blocky weights diffused,
# simplified to a quarter, normals shared across the UV seams, 2048 WebP sheets, meshopt). The owner's seated take
# folds him over his knees for five of its eleven seconds (photographed), so its upright stretch is baked as the clip
# e3c3 seats him on ('mixamo.com', sitloop.mjs). Fetched from Drive (shared by link) each into its own folder.
set -e
cd "$(dirname "$0")/../../.."
O=${O:-/tmp/owners}; mkdir -p $O/owner $O/keeper
curl -sS -L -o $O/owner/src.glb  "https://drive.usercontent.google.com/download?id=1lQAytQ_5pqKiZTIpDpEjVrha-_5yJnOx&export=download&confirm=t"
curl -sS -L -o $O/keeper/src.glb "https://drive.usercontent.google.com/download?id=1-jZDOzQmjOpaRgbfhvibW7ZTs5gYjPSC&export=download&confirm=t"
node tools/retarget.mjs assets/admintee.glb $O/owner/src.glb  $O/owner/t1.glb  Idle_9 mixamo --align
node tools/retarget.mjs assets/admintee.glb $O/keeper/src.glb $O/keeper/t1.glb Idle_9 mixamo --align
TEX=2048 node tools/prepmonk.mjs $O/owner/t1.glb  $O/owner/p.glb  0.25
TEX=2048 node tools/prepmonk.mjs $O/keeper/t1.glb $O/keeper/p.glb 0.25
node masters/v22.0/owners/sitloop.mjs $O/owner/p.glb $O/owner/s.glb 9.2 1.2
cp $O/owner/s.glb  assets/owner.glb
cp $O/keeper/p.glb assets/yinkeeper.glb
