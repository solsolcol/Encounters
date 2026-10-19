#!/bin/sh
# v21.0 · THE SHRINE'S TWO DEVOTEES WALK. The worried wife (sitwoman, a Meshy
# rig) and the father (sitangry, a Mixamo export whose bones are prefixed
# `mixamorig9:` — the retarget tool learned the numbered prefix for him) only
# ever sat; after their readings they get up and leave, so the admin tee's
# Walking is retargeted onto each in world space (--align: the rigs rest in
# different poses; --hips: the walk's bob), then cut to a clip-only file the
# chapter binds to their clones by bone name — their own files untouched.
set -e
cd "$(dirname "$0")/../../.."
O=${O:-/tmp/shrinewalk}; mkdir -p $O
node tools/retarget.mjs assets/admintee.glb assets/sitwoman.glb $O/wife1.glb Walking meshy --align --hips
node tools/retarget.mjs assets/admintee.glb assets/sitangry.glb $O/father1.glb Walking mixamo --align --hips
node masters/v21.0/walk/cliponly.mjs $O/wife1.glb Walking assets/wifewalk.glb
node masters/v21.0/walk/cliponly.mjs $O/father1.glb Walking assets/fatherwalk.glb
