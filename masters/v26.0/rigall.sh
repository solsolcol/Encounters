#!/bin/sh
# v26.0 · rig a list of people (name:height ...) at Meshy, each one's free walking take stripped to its bones and
# animation (tools/mergetakes.mjs strip proves the take file's body is the rig file's own bytes before dropping it).
cd "$(dirname "$0")/../.."
for spec in "$@"; do
  n=${spec%%:*}; h=${spec##*:}
  ( python3 -I masters/v26.0/meshy26.py rig $n $h > masters/v26.0/src/$n-rig.log 2>&1 \
    && node tools/mergetakes.mjs strip masters/v26.0/src/take-$n-walking.glb masters/v26.0/src/takes-$n-walking.glb masters/v26.0/src/rigged-$n.glb >> masters/v26.0/src/$n-rig.log 2>&1 \
    && rm masters/v26.0/src/take-$n-walking.glb ; echo "$n rig exit $?" ) &
done
wait
echo RIGS DONE
