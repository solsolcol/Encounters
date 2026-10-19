#!/bin/sh
# v21.0 · THE OWNER (a stand-in until Chad's model): ep1 ch3's encik scan — an
# older man in a black Chinese-collar suit — with four of the admin tee's takes
# retargeted in world space. --align because the two rigs REST in different
# poses (without it every arm came out straight in a T, photographed); --hips
# carries the walk's and the run's bob.
set -e
cd "$(dirname "$0")/../../.."
O=${O:-/tmp/owner}; mkdir -p $O
node tools/retarget.mjs assets/admintee.glb assets/encik.glb $O/al1.glb Idle_9 mixamo --align
node tools/retarget.mjs assets/admintee.glb $O/al1.glb $O/al2.glb Talk_with_Hands_Open mixamo --align
node tools/retarget.mjs assets/admintee.glb $O/al2.glb $O/al3.glb Walking mixamo --align --hips
node tools/retarget.mjs assets/admintee.glb $O/al3.glb $O/al4.glb Running mixamo --align --hips
cp $O/al4.glb assets/owner.glb
# THE STAFF MAN: ep1 ch3's standing man (tee, jeans), the same four takes
node tools/retarget.mjs assets/admintee.glb assets/standman.glb $O/sm1.glb Idle_9 mixamo --align
node tools/retarget.mjs assets/admintee.glb $O/sm1.glb $O/sm2.glb Talk_with_Hands_Open mixamo --align
node tools/retarget.mjs assets/admintee.glb $O/sm2.glb $O/sm3.glb Walking mixamo --align --hips
node tools/retarget.mjs assets/admintee.glb $O/sm3.glb $O/sm4.glb Running mixamo --align --hips
cp $O/sm4.glb assets/staffman.glb
