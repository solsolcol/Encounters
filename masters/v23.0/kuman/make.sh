#!/bin/sh
# v23.0 CP1 · Chad's three kumanthong, made shippable (docs/V23.0-E3C5-PLAN.md §6, §15).
# Sources: masters/v22.0/src/kuman{1,2,3}.glb (Drive folder 1Jj5s0xuYuXUYw8Ep0ixe8GilmMhp7RAg; gitignored).
# Run from the repo root. Each file carries <key>_near and <key>_far over the same vertices.
set -e
# the red one — every triangle near (597,170), 120k far
node --max-old-space-size=14000 tools/prepkuman.mjs masters/v22.0/src/kuman1.glb assets/kumanred.glb kumanred 120000
# the shy one — every triangle near (451,390), 100k far
node --max-old-space-size=14000 tools/prepkuman.mjs masters/v22.0/src/kuman3.glb assets/kumanshy.glb kumanshy 100000
# the little one — one fused 7,025,694-triangle piece; cut under 0.0003 of its extent (probe/ksimp.mjs measured
# 0.0002 -> 2.24M, 0.0004 -> 1.00M, 0.0008 -> 455k) to 1,388,246, every strand kept as a strand; 141k far
ERR=0.0003 node --max-old-space-size=14000 tools/prepkuman.mjs masters/v22.0/src/kuman2.glb assets/kumanlittle.glb kumanlittle 150000
# photographs (gitignored): game scale, phone and desktop, near and far, and the ghost-double test
node tools/shootclose.mjs masters/v23.0/kuman/probe/k3near.json masters/v23.0/kuman/shots/near
node tools/shootclose.mjs masters/v23.0/kuman/probe/k3far.json masters/v23.0/kuman/shots/far
node masters/v23.0/kuman/probe/ghosttest.mjs masters/v23.0/kuman/shots/ghost
