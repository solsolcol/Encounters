#!/bin/sh
# v26.0 · a person's body at a LEVEL, on the same rig:   sh masters/v26.0/bodies.sh <name> <triangles> [<name> <triangles> ...]
#   1. Meshy's remesh of that person's own model at the triangle count asked for (5 credits; the task's id goes into
#      src/jobs.json): the generator builds the same surface again and lays the paint on a new sheet. A generated body
#      is NOT thinned here (the tracker's §8: the strict simplifier stalls on a generated sheet's islands, the
#      permissive one cuts across them and a face comes back in shards);
#   2. tools/riglod.mjs lays the rig on it: the rigged file's own skeleton, skin and inverse bind matrices, the
#      remeshed surface fitted to it (checked: millimetres), each point's weights from the rigged points round it;
#   3. the remeshed download (80 MB of PNG) is cleared on riglod's own exit status; what is kept beside the rig is
#      src/body-<name>-<triangles>.glb, its sheets at their own size as a JPEG and a WebP.
# Skips what it has. Several of these may run side by side on different people.
cd "$(dirname "$0")/../.."
SRC=masters/v26.0/src
while [ $# -ge 2 ]; do
  n=$1; c=$2; shift 2; out=$SRC/body-$n-$c.glb
  if [ -f $out ]; then echo "$n $c: have it"; continue; fi
  if [ ! -f $SRC/remeshed-$n-$c.glb ]; then
    python3 -I masters/v26.0/meshy26.py remesh $n $c >> $SRC/$n-bodies.log 2>&1 || { echo "$n $c: remesh failed (see $SRC/$n-bodies.log)"; continue; }
  fi
  if node tools/riglod.mjs $SRC/rigged-$n.glb $SRC/remeshed-$n-$c.glb $out >> $SRC/$n-bodies.log 2>&1; then
    rm $SRC/remeshed-$n-$c.glb; echo "$n $c -> $out $(stat -c %s $out) bytes"
  else echo "$n $c: riglod failed (see $SRC/$n-bodies.log)"; fi
done
echo BODIES DONE
