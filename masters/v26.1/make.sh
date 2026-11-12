#!/bin/sh
# v26.1 · episode 4 chapter 3, his nine notes of 12 Nov 2026 (evening): the recipe of everything made for them.
# The build's tracker is docs/V26.0-E4C3-BUILD.md §16 (his words, the plan, the log). Nothing here is run by the build:
# each step names the tool that makes it again and what it was given.
#
# ---- 1. THE PEOPLE'S PAINT LAID OUT AGAIN (notes 1, 5, 10, 11: the faces "butchered", "really bad" on a 720p phone)
#   Blender 5.2.3 as a Python module with xatlas 0.0.11, in its own environment (it is ~1 GB, kept outside the repo):
#       python3.13 -m venv bpyenv && bpyenv/bin/pip install bpy==5.2.3 xatlas==0.0.11
#   then every body made again by masters/v26.0/people.sh with BPY=<that python>: prepmonk's REPAINT (tools/repaint.py:
#   points welded, xatlas charts, the face weighted 3, the head 2, the hands 1.5, repacked with a margin, the colour baked
#   by Cycles from the generator's own 8192 sheet through each triangle's old coordinates; a pass that overlaps or leaves
#   the sheet falls back to the first packing). The repainted sheet is drawn with mipmaps (c_cast.js sheetOf). Ton's and
#   the bench master's full bodies (e4tonh, e4benchh) are v26.0's: their repaint overlapped (tools/probes/uvoverlap.mjs).
#
# ---- 2. HIS NAME SAID "PUU" (note 6): masters/v26.0/voices/sessions-puu.json (the flow, the sessions, the picks and why).
#
# ---- 3. THE GROUND'S EDGES AND ITS SKY (note 4)
#   Reference pictures: Higgsfield GPT Image 2.6, quality max, 2k (9 credits each), each LOOKED AT before use; the clouds
#   on a transparent ground, looked at over a blue sky. Kept as masters/v26.1/env/refs/*.png (ignored by git) and their
#   1024 copies (*-1024.jpg, committed). Job ids:
#     banana      b538beb1-b9eb-45f4-865d-b3c596825300    tank        fda2c895-0b2a-4c2a-b96b-0cbf69c0ddc3
#     aircon      749f7880-f073-4425-89e4-ccbd3197152a    isanhouse   5b0fb00f-372b-49e0-ada7-3cfec4469035
#     frangipani  4e1742ed-2caa-4224-b0a2-54c0950d8fae    scooter     961fbdcf-c734-419b-98f9-26a1e3ab11f2
#     cloud-tall  4d22dbe6-1020-4e9f-81de-f646db16f714    cloud-bank  189d7296-1fc7-4da7-b0ed-3f3478c18dad
#     cloud-flat  483235a6-facf-4dfe-9c18-e00f4ece98ff    cloud-three 3045c6fb-bd8d-469c-9494-a2db980b18e2
#     cirrus      b8a26fed-e6c7-46dd-90e7-e70c3cb96d7d    render      e6f4c0e4-df4e-4e63-a75e-69816b06e842
#   The clouds to the game (alpha kept, WebP): cloud-bank 2048 wide, the others 1024 -> assets/w3t_cloudbank.webp,
#   w3t_cloudtall, w3t_cloudflat, w3t_cloudthree, w3t_cirrus. The render made seamless at 1024 (blended with itself rolled
#   by half its size under a mask that is one at its middle: the seams fall where the other copy is whole) ->
#   assets/w3t_render.jpg (quality 88).
#   The six models: Meshy image-to-3D at its highest settings (masters/v26.0/meshy26.py model masters/v26.1/env/jobs-env.json:
#   40 credits each) and its own remesh to the count in masters/v26.0/props/TABLE.txt (5 each), prepped by
#   sh masters/v26.0/props/prop.sh envbanana envfrangipani envisanhouse envtank envaircon envscooter
#     envbanana     image-to-3D 01a1d179-251d-70ba-9086-b33eec19f41a  remesh 14,000 01a1d189-9142-75c2-988e-dfe521d7ae66 -> w3banana2 (3.6 m)
#     envfrangipani image-to-3D 01a1d179-3275-71e9-bb4d-de0ea198c6e5  remesh 30,000 01a1d18e-8141-7134-8376-b75c21eadbb0 -> w3frangipani (4.6 m)
#     envisanhouse  image-to-3D 01a1d179-3e19-7054-899f-624cf78d4a8a  remesh 40,000 01a1d193-ee81-73e7-90b8-393187d361d9 -> w3isanhouse (5.6 m)
#     envtank       image-to-3D 01a1d179-4b46-76c9-9496-32383f353f50  remesh 8,000  01a1d199-252c-70d1-8b55-efdb5d7a1524 -> w3tank (1.95 m)
#     envaircon     image-to-3D 01a1d179-55d4-7382-82d8-210bb909a720  remesh 6,000  01a1d19d-c8e2-7397-b0a2-95dee506e0b7 -> w3aircon (0.95 m wide)
#     envscooter    image-to-3D 01a1d179-6228-7590-b8ec-2b7177e1a0bc  remesh 20,000 01a1d1a0-8a7e-72db-a535-111065bef5ce -> w3scooter (1.88 m long)
#   Each photographed alone at 1000 px a view (tools/shootmodel.mjs) and looked at before it was placed.
#   Cost: 12 pictures (108 Higgsfield credits); 6 models and 6 remeshes (270 Meshy credits: 851 -> 581).
#
# ---- 4. HIS FEET ON THE GRASS (note 8): bash masters/v26.1/sound/steps.sh (its head: the takes, the measures, the pick).
