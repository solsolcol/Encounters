#!/bin/sh
# v19.6 — the congregation (episode 3 chapter 2): Chad's four white-outfit
# Meshy characters with his two Mixamo takes applied. docs/V19.6-CONGREGATION.md.
# SRC holds the six files from his Drive folder (1d_jPaS7MF_QJyyI-DPL-Sn0EhvW5IUfS),
# each zip unpacked into its own folder; O is a scratch folder.
set -e
F=node_modules/fbx2gltf/bin/Linux/FBX2glTF
# 1. FBX -> GLB. The two takes, and each character's Character_output FBX
#    (NOT the Merged_Animations one — LEARNINGS v19.6).
$F -b --pbr-metallic-roughness -i "$SRC/Praying.fbx" -o $O/praying
$F -b --pbr-metallic-roughness -i "$SRC/Kneeling Idle.fbx" -o $O/kneelidle
for d in stanceA stanceB serenA serenB; do
  $F -b --pbr-metallic-roughness -i "$SRC/$d/"*_Character_output.fbx -o $O/${d}_Character_output
done
# 2. Both takes onto each rig: A-pose rests aligned to the T-pose source, hips carried.
for d in stanceA stanceB serenA serenB; do
  node tools/retarget.mjs $O/praying.glb   $O/${d}_Character_output.glb $O/t_${d}_p.glb  pray  meshy --align --hips
  node tools/retarget.mjs $O/kneelidle.glb $O/t_${d}_p.glb              $O/t_${d}_pk.glb kneel meshy --align --hips
done
# 3. The v16.8 Meshy recipe at two cuts: the crowd and the four who act.
for d in stanceA stanceB serenA serenB; do
  TEX=1024 NOMAP=1 node tools/prepmonk.mjs $O/t_${d}_pk.glb $O/g_${d}.glb   0.018
  TEX=2048         node tools/prepmonk.mjs $O/t_${d}_pk.glb $O/g_${d}hd.glb 0.08
done
# 4. Names in the game (decided by photograph): stanceA = woman 1, stanceB =
#    woman 2, serenA = man 1, serenB = man 2.
cp $O/g_stanceA.glb assets/cg_woman1.glb; cp $O/g_stanceAhd.glb assets/cg_woman1hd.glb
cp $O/g_stanceB.glb assets/cg_woman2.glb; cp $O/g_stanceBhd.glb assets/cg_woman2hd.glb
cp $O/g_serenA.glb  assets/cg_man1.glb;   cp $O/g_serenAhd.glb  assets/cg_man1hd.glb
cp $O/g_serenB.glb  assets/cg_man2.glb;   cp $O/g_serenBhd.glb  assets/cg_man2hd.glb
