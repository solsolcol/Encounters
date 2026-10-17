#!/bin/sh
# v19.8 — the congregation without the specks (episode 3 chapter 2). Step 3 of
# masters/v19.6/make.sh again, from the same retargeted files, with two changes
# in tools/prepmonk.mjs: CHARTFIX=1 (tools/chartfix.mjs — the scan's two-texel
# UV charts pointed at a uniform spot of their surface's colour, the white
# specks in the hair) and the FOLDS (always on — the simplifier's back-to-back
# triangle pairs given their own vertices, the black slits on the shirts).
# O is the scratch folder that holds t_<name>_pk.glb from v19.6's step 2.
set -e
for d in stanceA stanceB serenA serenB; do
  CHARTFIX=1 TEX=1024 NOMAP=1 node tools/prepmonk.mjs $O/t_${d}_pk.glb $O/g_${d}.glb   0.018
  CHARTFIX=1 TEX=2048         node tools/prepmonk.mjs $O/t_${d}_pk.glb $O/g_${d}hd.glb 0.08
done
cp $O/g_stanceA.glb assets/cg_woman1.glb; cp $O/g_stanceAhd.glb assets/cg_woman1hd.glb
cp $O/g_stanceB.glb assets/cg_woman2.glb; cp $O/g_stanceBhd.glb assets/cg_woman2hd.glb
cp $O/g_serenA.glb  assets/cg_man1.glb;   cp $O/g_serenAhd.glb  assets/cg_man1hd.glb
cp $O/g_serenB.glb  assets/cg_man2.glb;   cp $O/g_serenBhd.glb  assets/cg_man2hd.glb
