#!/bin/sh
# v29.0 (E5C1 THINGS-3): each made thing photographed alone at 1100 px (front, side, back, three-quarter), one browser slot
# per thing:   sh masters/v29.0/props/code/shoot.sh <dir> <name> [<name> ...]   (reads <dir>/<name>.glb, writes <dir>/shot-<name>-*.png)
cd "$(dirname "$0")/../../../.."
D=$1; shift
for n in "$@"; do
  CHROMIUM_PATH=/opt/pw-browsers/chromium sh tools/bslot.sh timeout 300 node tools/shootmodel.mjs $D/$n.glb $D/shot-$n --size=1100 > /dev/null 2>&1
  echo "$n $?"
done
