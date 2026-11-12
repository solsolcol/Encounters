#!/bin/sh
# v26.0 · THE FAR LEVEL of every thing that is drawn many times or stands far off:   sh masters/v26.0/props/lods.sh
#
# From the spawn the first build handed a phone 1,534,000 triangles a frame (tools/probes/drawn.mjs: counted at the
# WebGL calls, on a phone's frame), most of them the offering tables' thirty-odd bai sri, trays and flowers at
# twenty metres, each drawn with every triangle it has in the hand. So each such thing gets a SECOND index list over
# the same vertices (tools/lodpair.mjs, permissive: fit for distance only, v18.8, v21.8): nodes <key>_near and
# <key>_far in one file, one set of sheets. The chapter's many() draws the near one while the piece is taller than
# a twenty-fifth of the screen and the far one beyond (the copied manyOf and stockLod).
#   Each far level is LOOKED AT on its own before it ships (tools/probes/lodview.mjs, then tools/shootmodel.mjs).
# A thing placed by stand() must NOT be given two levels (stand draws every node of its file): those keep one.
# NOT the clay pot (w3claypot, 3,103 triangles): cut to 610 its wall opened in black slivers (looked at, 12 Nov), and a
# far level of a thing that light saves nothing. It keeps its one level (tools/probes/lodview.mjs <file> <out> near
# took the far one back out of the file lods.sh had written).
# It skips a file that already has its far level, so it is simply run again after props/prop.sh remakes a thing.
cd "$(dirname "$0")/../../.."
for row in w3baisri:4000 w3pewter:2400 w3fruit:2200 w3purple:2000 w3khantok:1500 w3sweets:1200 w3smallbaisri:1200 \
           w3naga:2000 w3tower:2500 w3petalbowl:2000 w3petalsteel:2000 w3chair:2000 w3sofa:1200 w3candle:500 \
           w3candlemid:400 w3candlesmall:300 w3kratip:500 w3chicken:600 w3coconut:500 w3soda:300 w3water:300 w3puff:800 \
           w3nagafount:6000 w3nagagreen:4500 w3nagawhite:3500 w3ganesha:1800 w3dracaena:1800 w3croton:2600 \
           w3waterjar:700 w3walllamp:500 w3chrys:2400 w3roses:2400; do
  key=${row%%:*}; far=${row#*:}; f=assets/$key.glb
  [ -f $f ] || { echo "$key: not here yet"; continue; }
  if grep -a -q "${key}_near" $f; then echo "$key: has its far level"; continue; fi
  MODE=permissive node tools/lodpair.mjs $f $f $far $key 2>&1 | grep "^lodpair" || echo "$key: lodpair FAILED"
done
echo LODS DONE
