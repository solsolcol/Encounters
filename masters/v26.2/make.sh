#!/bin/sh
# v26.2 · the full debug of episode 4 chapter 3 (docs/V26.1-E4C3-DEBUG.md): the recipe of everything made for it.
# Nothing here is run by the build: each step names the tool that makes it again and what it was given.
#
# ---- 1. THE REPAINTED BODIES MENDED (my v26.1 regression: streaks across Ton's trousers and down his face)
#   tools/repaint.py now gives a corner xatlas never placed (a sliver's corner left at the sheet's (0, 0)) its neighbours'
#   place; tools/prepmonk.mjs refuses a file in which a triangle reaches across the sheet; tools/probes/uvstretch.mjs
#   finds them. Every repainted body made again (13 Nov, 19 minutes; BPY as masters/v26.1/make.sh says):
#       BPY=<Blender's python with xatlas> sh masters/v26.0/people.sh ton bench hermita hermitb red white dancera \
#           dancerb deva devb devc devd deve devf devg devh girl boy monkb monkc
#   The 15 files with a reach changed; the other 45 came back byte-identical.
#
# ---- 2. THE BENCH MADE AGAIN (the generator's first seat came back with its slats torn, wavy and holed)
#   The same checked reference picture (masters/v26.0/props/refs/seatbench-2k.png) to Meshy's image-to-3D at its
#   highest settings, twice (masters/v26.2/jobs-bench.json; python3 -I masters/v26.0/meshy26.py model ...; 40 credits
#   each):
#     seatbench2  image-to-3D 01a1d296-2bbf-73ee-b68d-a20bee03ec7a   <- KEPT: straight, even slats
#     seatbench3  image-to-3D 01a1d296-34d9-7097-81f8-5bec46ad4711      (its middle slats wavy, its back rail sagging)
#   each photographed alone at 1100 px (tools/shootmodel.mjs) and looked at; then
#       sh masters/v26.0/props/prop.sh seatbench2     (TABLE.txt: remesh 16,000 01a1d2a5-038b-73e5-8c2d-2eb755c01197, 5 credits; -> assets/w3bench.glb)
#   Measured (tools/probes/seatread.mjs): the frame's top 0.40 of the file, as the old slats were; the slats 0.35 inside.
#   THEN MADE AGAIN FROM THE SAME MODEL, the same morning (my mistake: the 16,000 remesh was looked at only in prop.sh's
#   500 px picture, and in the game its seat was crumpled again, wavy torn slats, photographed at the bench at 780 x 1688).
#   Meshy's TRIANGLE remesh crumples the slats at any count (each looked at alone at 1100 px):
#     16,000  01a1d2a5-038b-73e5-8c2d-2eb755c01197   torn
#     60,000  01a1d319-33c4-77a5-972b-2e20eca9432e   wavy, jagged edges     (5 credits)
#    100,000  01a1d319-324b-7316-877d-0906f60baf13   wavy, jagged edges     (5 credits)
#   its QUAD remesh keeps them straight (meshy26.py TOPO=quad, new):
#     50,000 quads 01a1d321-5de0-7577-949d-04306c8bb485   <- KEPT: 98,580 triangles, straight even slats (5 credits)
#   (the model as generated, 301,796 triangles, is clean too: a third the price was the reason to pick the quad one.)
#       sh masters/v26.0/props/prop.sh seatbench2     (TABLE.txt: 50000q, sheets 2048; -> assets/w3bench.glb)
#   Measured again (seatread): the frame's top 0.40, the slats 0.34 (6 cm inside: two lower than the 16,000's); the box
#   the same to the millimetre (x 1.50, y 0.833, z 0.713). The price: 82,000 triangles more than the torn one, drawn
#   wherever the bench is (the chapter's own higher budget, his note 5).
