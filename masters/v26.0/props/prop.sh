#!/bin/sh
# v26.0 · one prop from Meshy's model to the game's file:  sh masters/v26.0/props/prop.sh <name> [<name> ...]
#   1. the model, if it is not here yet (meshy26.py collect: free);
#   2. Meshy's own remesh to the triangle count in TABLE.txt (5 credits: nothing is thinned here, v25.5);
#   3. tools/prepmeshy.mjs: sized in metres, its base on the ground, every triangle kept, the sheets at the table's size;
#   4. photographed alone (tools/shootmodel.mjs), for the look every prop gets before it is placed;
#   5. the remesh file (about 100 MB, PNG sheets at 8192) cleared, on the prep's own exit status: it is an intermediate,
#      and the model it was made from stays in masters/v26.0/src.
cd "$(dirname "$0")/../../.."
SRC=masters/v26.0/src; OUT=${OUT:-/tmp/claude-0/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293/scratchpad/e4c3/props}
mkdir -p $OUT
for n in "$@"; do
  row=$(grep -E "^$n +" masters/v26.0/props/TABLE.txt) || { echo "$n: no row in TABLE.txt"; continue; }
  set -- $row; key=$2; size=$3; ax=$4; polys=$5; px=$6; turn=$7
  [ -f $SRC/original-$n.glb ] || python3 -I masters/v26.0/meshy26.py collect $n >> $SRC/props.log 2>&1
  [ -f $SRC/original-$n.glb ] || { echo "$n: no model" | tee -a $SRC/props.log; continue; }
  [ -f $SRC/remeshed-$n-$polys.glb ] || python3 -I masters/v26.0/meshy26.py remesh $n $polys >> $SRC/props.log 2>&1
  [ -f $SRC/remeshed-$n-$polys.glb ] || { echo "$n: remesh failed" | tee -a $SRC/props.log; continue; }
  if ERR=0.002 node tools/prepmeshy.mjs $SRC/remeshed-$n-$polys.glb assets/$key.glb $size $ax 1 $turn $px >> $SRC/props.log 2>&1; then
    rm $SRC/remeshed-$n-$polys.glb
    CHROMIUM_PATH=/opt/pw-browsers/chromium timeout 300 node tools/shootmodel.mjs assets/$key.glb $OUT/$n --size=500 >> $SRC/props.log 2>&1
    echo "$n -> assets/$key.glb $(stat -c %s assets/$key.glb) bytes" | tee -a $SRC/props.log
  else echo "$n: prep failed" | tee -a $SRC/props.log; fi
done
echo PROPS DONE
