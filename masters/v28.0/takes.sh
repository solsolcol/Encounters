#!/bin/sh
# v28.0 (a copy of masters/v27.0/takes.sh) · lay takes on a rig at Meshy and strip each file to its bones and animation the moment it lands.
#   sh masters/v28.0/takes.sh <name> lib <set> <id,id,...>      library actions (one file; a re-export: --same-rig)
#   sh masters/v28.0/takes.sh <name> t2m <clip> [<clip> ...]    text-to-motion clips by their names in the ledger
# A take file is removed only on the strip's own exit status (no pipe between: see the tracker's §8).
cd "$(dirname "$0")/../.."
n=$1; kind=$2; shift 2
SRC=masters/v28.0/src
one() {  # set, extra strip flag
  node tools/mergetakes.mjs strip $SRC/take-$n-$1.glb $SRC/takes-$n-$1.glb $SRC/rigged-$n.glb $2 >> $SRC/$n-takes.log 2>&1 \
    && rm $SRC/take-$n-$1.glb
  echo "$n $1 strip exit $?" >> $SRC/$n-takes.log
}
if [ "$kind" = lib ]; then
  python3 -I masters/v28.0/meshy28.py anim $n $1 $2 >> $SRC/$n-takes.log 2>&1 && one $1 --same-rig
else
  for c in "$@"; do ( python3 -I masters/v28.0/meshy28.py motion $n $c $c >> $SRC/$n-takes.log 2>&1 && one $c ) & done
  wait
fi
echo "$n $kind done" >> $SRC/$n-takes.log
