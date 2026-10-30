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
