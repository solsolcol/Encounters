#!/bin/sh
# v29.0 (a copy of masters/v28.0/rigall.sh; its ledger and files are masters/v29.0/src/people/) · rig a list of people
# (name:height ...) at Meshy (5 credits each), each one's free walking take stripped to its bones and animation
# (tools/mergetakes.mjs strip proves the take file's body is the rig file's own bytes before dropping it).
cd "$(dirname "$0")/../../.."
SRC=masters/v29.0/src/people
for spec in "$@"; do
  n=${spec%%:*}; h=${spec##*:}
  ( python3 -I masters/v29.0/people/meshy.py rig $n $h > $SRC/$n-rig.log 2>&1 \
    && node tools/mergetakes.mjs strip $SRC/take-$n-walking.glb $SRC/takes-$n-walking.glb $SRC/rigged-$n.glb >> $SRC/$n-rig.log 2>&1 \
    && rm $SRC/take-$n-walking.glb ; echo "$n rig exit $?" ) &
done
wait
echo RIGS DONE
