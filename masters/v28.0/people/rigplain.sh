#!/bin/sh
# v28.0 · the nine's bodies rigged PLAIN (no finger bones: people/rigplain.py), each one's free walking take stripped to
# its bones and animation exactly as masters/v28.0/rigall.sh does:   sh masters/v28.0/people/rigplain.sh name:height ...
cd "$(dirname "$0")/../../.."
for spec in "$@"; do
  n=${spec%%:*}; h=${spec##*:}
  ( python3 -I masters/v28.0/people/rigplain.py $n $h > masters/v28.0/src/$n-rig.log 2>&1 \
    && node tools/mergetakes.mjs strip masters/v28.0/src/take-$n-walking.glb masters/v28.0/src/takes-$n-walking.glb masters/v28.0/src/rigged-$n.glb >> masters/v28.0/src/$n-rig.log 2>&1 \
    && rm masters/v28.0/src/take-$n-walking.glb ; echo "$n rig exit $?" ) &
done
wait
echo RIGS DONE
