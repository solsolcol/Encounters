#!/bin/sh
# v22.0 CP11 · THE TOWKAY'S STAND-IN, REPLACED. The Chinatown shop's owner stood in as v21.0's file — episode 1's
# encik scan (4,200 triangles on one 512-pixel atlas of a few hundred islands) — which reads across a room and falls
# apart in the endings' two-shots: the face split into light and dark patches along its islands, faceted, the neck
# seamed (photographed on a phone at 1.6 m, ending B). Every older man the game ships was photographed on his own
# (tools/probes/faceshot.mjs): Chad's amulet-shop owner is the one old uncle, and he is already World H's owner, the
# same man twenty minutes earlier; the Taoist medium wears his hat; the rest are young. So the stand-in is Chad's
# congregation man (cg_man2hd: a Meshy scan in a white mandarin-collar shirt, 47.8k triangles, 2048 sheets with a
# normal map, chartfix'd at v19.8) with admintee's Idle_9 and Talk_with_Hands_Open retargeted onto his A-pose rest
# (--align; --hips carries the standing height), and his kneeling takes dropped. Until Chad's own towkay arrives.
set -e
cd "$(dirname "$0")/../../.."
O=${O:-/tmp/towkay2}; mkdir -p $O
node tools/retarget.mjs assets/admintee.glb assets/cg_man2hd.glb $O/t1.glb Idle_9 meshy --align --hips
node tools/retarget.mjs assets/admintee.glb $O/t1.glb $O/t2.glb Talk_with_Hands_Open meshy --align --hips
node masters/v22.0/towkay/stripclips.mjs $O/t2.glb $O/t3.glb Idle_9 Talk_with_Hands_Open
cp $O/t3.glb assets/towkay.glb
