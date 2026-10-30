#!/bin/sh
# v24.13 · Chad's models for episode 4 chapter 1 (30 Oct 2026), each a Sketchfab download he uploaded to the session.
# The sources are kept in masters/v24.13/src/ (gitignored — *.glb there), each named for what it is:
#   shiba_inu.glb    "Animated Dog, Shiba Inu" by quander, CC BY 4.0
#                    https://sketchfab.com/3d-models/animated-dog-shiba-inu-9abfce885a834399b2c3ccaed51cd474
#   palm_trees.glb   "Palm Trees" by ElectroNick, CC BY 4.0
#                    https://sketchfab.com/3d-models/palm-trees-20f8a8d5054b4191afb7cf3270dbd586
#   banana_tree.glb  "Banana Tree" by Garecra, CC BY 4.0
#                    https://sketchfab.com/3d-models/banana-tree-5cb46e64d7fc40978c3d6798017eced1
#   yoga_buddha.glb  "Yoga - Buddha" by T.Koeniger (3D-hannover), CC BY 4.0
#                    https://sketchfab.com/3d-models/yoga-buddha-616ea9625565422a90e881383ab35ca8
# And the pickup, chosen and still to come (Chad: "I will give the pick up truck model later in google drive, note the
# credits first"): "Rivian R1T (2022)" by geyges, Sketchfab Free Standard licence
#   https://sketchfab.com/3d-models/rivian-r1t-2022-6eca29c11ca44840baf93f47ef800006
#
# Every take of the dog was photographed frame by frame before anything was cut (dbg-dogsheet, a contact sheet of each
# take at eight moments): play_dead sits, flops onto its side and rolls back up; rollover rolls, then lies still from
# 2.3 s with its head up (the sphinx pose); shake is a PAW GIVEN while sitting, not water shaken off; sitting is a sitting
# idle; standing is a standing idle with its mouth open. The chapter keeps rollover's still stretch as `lie` and the
# standing idle as `stand` (tools/prepdog.mjs says why each step).
# Needs: npm i --no-save @gltf-transform/core @gltf-transform/extensions @gltf-transform/functions meshoptimizer sharp
set -e
cd "$(dirname "$0")/../.."
node tools/prepdog.mjs masters/v24.13/src/shiba_inu.glb assets/e4dog.glb
# v24.14 · the palms, the banana tree and the Buddha (sources above). The palms' file holds two trees side by side: each
# is taken on its own (preptree's onlyNode) and baked to the one-metre contract, every triangle for the near stands and
# a cut for the fields' distance (a frond is a strip of cards, which a simplifier cannot take under two triangles, so
# 0.12 / 0.15 come to about 5,000 each). The banana keeps its author's own leaf cut-offs (KEEPCUT). The Buddha is a
# static scan: 112k -> 50k triangles at 0.32 m, its base colour a 2048 JPEG (its COLOR_0 is white to 1 % and goes).
node tools/preptree.mjs masters/v24.13/src/palm_trees.glb assets/e4palm1.glb 1 1024 1024 Palm_tree_001_v2
node tools/preptree.mjs masters/v24.13/src/palm_trees.glb assets/e4palm2.glb 1 1024 1024 Palm_tree_002_v2
node tools/preptree.mjs masters/v24.13/src/palm_trees.glb assets/e4palm1far.glb 0.12 512 256 Palm_tree_001_v2
node tools/preptree.mjs masters/v24.13/src/palm_trees.glb assets/e4palm2far.glb 0.15 512 256 Palm_tree_002_v2
KEEPCUT=1 node tools/preptree.mjs masters/v24.13/src/banana_tree.glb assets/e4banana.glb 1 1024 1024
node tools/prepstatic.mjs masters/v24.13/src/yoga_buddha.glb assets/e4buddha.glb 0.32 0.45 0 2048 88
