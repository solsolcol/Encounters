#!/bin/sh
# v28.0 · THE NAGA OF STAGE 5 (plan 9.3), from Meshy's model to the game's file:   sh masters/v28.0/people/naga.sh
# The things' own steps (masters/v28.0/props/prop.sh), with the Naga's numbers here so that the things' table is not touched:
#   1. Meshy's remesh of its one model at 60,000 triangles (5 credits; a job already in the ledger is waited for, never sent
#      again): a vast form seen whole in one film, its scales carried by the normal sheet;
#   2. tools/prepmeshy.mjs: 3.6 m from the ground to the crest's tip (its height, h), its base on the ground, every triangle
#      kept, the sheets at 2048. 3.6 m is a size to photograph by, not the chapter's: the head and neck, the straight
#      length and the tail are cut apart by the chapter and the straight length laid again along the court's edge, at the
#      scale the film asks (plan 9.3, people/PROMPTS.txt's note on the pose);
#   3. photographed alone (tools/shootmodel.mjs, 1100 px), through the browser slots;
#   4. the remesh download cleared on the prep's own exit status (the model it was made from stays in masters/v28.0/src).
cd "$(dirname "$0")/../../.."
SRC=masters/v28.0/src; OUT=${OUT:-/tmp/claude-0/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293/scratchpad/e4c5/cast/shots/naga}
mkdir -p $OUT
n=naga; key=p5naga; size=3.6; ax=h; polys=60000; px=2048; turn=0
[ -f $SRC/remeshed-$n-$polys.glb ] || python3 -I masters/v28.0/meshy28.py remesh $n $polys >> $SRC/naga-prep.log 2>&1
[ -f $SRC/remeshed-$n-$polys.glb ] || { echo "$n: remesh failed (see $SRC/naga-prep.log)"; exit 1; }
if ERR=0.002 node tools/prepmeshy.mjs $SRC/remeshed-$n-$polys.glb assets/$key.glb $size $ax 1 $turn $px >> $SRC/naga-prep.log 2>&1; then
  rm $SRC/remeshed-$n-$polys.glb
  CHROMIUM_PATH=/opt/pw-browsers/chromium timeout 600 sh tools/bslot.sh node tools/shootmodel.mjs assets/$key.glb $OUT/$n --size=1100 >> $SRC/naga-prep.log 2>&1
  echo "$n -> assets/$key.glb $(stat -c %s assets/$key.glb) bytes" | tee -a $SRC/naga-prep.log
else echo "$n: prep failed (see $SRC/naga-prep.log)"; exit 1; fi
