#!/bin/sh
# v29.0 (E5C1 THINGS-3, R13): every thing made in code, from its script to its game file:
#   sh masters/v29.0/props/code/make.sh <out-dir> <name> [<name> ...]
# each: Blender 5.2.3 as a Python module (BPY, default /home/user/bpyenv/bin/python: python3.13 -m venv bpyenv &&
# bpyenv/bin/pip install bpy==5.2.3) builds it, bakes its sheets and writes <out>/<name>-raw.glb; tools/prepmeshy.mjs packs
# it at ratio 1 (nothing thinned; sized on the row's measure, its base centre on the origin, meshopt) to <out>/<key>.glb;
# coplanar.mjs measures it (shared planes, its ground). The table: name, key, size, axis, sheet.
cd "$(dirname "$0")/../../../.."
BPY=${BPY:-/home/user/bpyenv/bin/python}
D=$1; shift
for n in "$@"; do
  row=$(grep -E "^$n " <<'T'
altarcab   w51altarcab2 0.90 w 2048
candle     w51candle    0.24 h 1024
cushion    w51cushion   0.50 w 1024
frame      w51frame     0.18 w 1024
lamp       w51lamp      0.55 h 1024
fridge     w51fridge    1.70 h 1024
balcchair  w51bchair    0.80 h 1024
rack       w51rack      1.35 w 1024
keydish    w51keydish   0.16 w 1024
paperbag   w51paperbag  0.16 w 1024
wrapped    w51wrapped   0.086 w 1024
T
) || { echo "$n: no row"; continue; }
  set -- $row; key=$2; size=$3; ax=$4; px=$5
  $BPY masters/v29.0/props/code/$n.py $D/$n-raw.glb $px > $D/$n.log 2>&1 && grep -E "STATS|PUFF" $D/$n.log
  node tools/prepmeshy.mjs $D/$n-raw.glb $D/$key.glb $size $ax 1 0 $px 2>&1 | grep -E "CONTRACT|rror"
  node masters/v29.0/props/code/coplanar.mjs $D/$key.glb | head -4
done
