#!/bin/sh
# v29.0 · Grace's and Marcus's takes from the GAME'S OWN files, at no credits (the collector's way, masters/v28.0/people.sh
# `collectorrig`): tools/retarget.mjs `same` (each bone by its own name, in the world: a Meshy rig to a Meshy rig) with
# --hips and --align (each bone's rest first swung onto the source's), never the neck and head (--noalign: v28.0's lesson,
# a head swung onto another body's neck line rose off the collar). Then stripped to its bones and animation:
#   src/people/takes-<name>-ret.glb.            sh masters/v29.0/people/retakes.sh grace|marcus
# Every source is a Meshy rig with finger bones, so the fingers come with the take (a Mixamo-named source would leave a
# rig's fingers at its rest: an A pose's spread hand). Which take is cast for which act, and the measure of each: RECORD.md §4.
cd "$(dirname "$0")/../../.."
S=masters/v29.0/src/people; W=${WORK:-/tmp/claude-0/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293/scratchpad/e5c1/retakes}; mkdir -p $W
R() { node tools/retarget.mjs "$1" "$2" "$3" "$4" same --hips --align --noalign=neck,Head >> $S/$N-retakes.log 2>&1 || { echo "$N: $4 failed (see $S/$N-retakes.log)"; exit 1; }; }
N=$1; : > $S/$N-retakes.log
case $N in
grace)   # her stand, her walk and a listening stand: Mala's (chapter 4's woman, the arms already brought in at her prep);
         # sitting with her hands in her lap and rising from a seat: Amma's; a hand held out low from a seat (the packet into
         # Grandmaster Pho's palm; her phone turned face down) and a seated talk: the seated hermit's
  R assets/p4mala.glb $S/rigged-grace.glb $W/g1.glb Idle_3
  R assets/p4mala.glb $W/g1.glb $W/g2.glb Walking
  R assets/p4mala.glb $W/g2.glb $W/g3.glb Listening_Gesture
  R assets/p4amma.glb $W/g3.glb $W/g4.glb wsit
  R assets/p4amma.glb $W/g4.glb $W/g5.glb rise
  R assets/e4hermita.glb $W/g5.glb $W/g6.glb palmover
  R assets/e4hermita.glb $W/g6.glb $W/g7.glb Sitting_Answering_Questions
  node tools/mergetakes.mjs strip $W/g7.glb $S/takes-grace-ret.glb $S/rigged-grace.glb >> $S/$N-retakes.log 2>&1 && rm -f $W/g[1-7].glb ;;
marcus)  # on his MENDED rig (people/rigmend-marcus.json): the library's stand, listening and chat (Jun's file, raw: brought in
         # at prep), the library's talk (Mr Koh's), a man kneeling on one knee beside a chair (Ravi's), the seated hermit's
         # chair sit and seated talk, and his own rig's walk
  R masters/v28.0/src/takes-jun-lib.glb $S/mended-marcus.glb $W/m1.glb Idle_3
  R masters/v28.0/src/takes-jun-lib.glb $W/m1.glb $W/m2.glb Listening_Gesture
  R masters/v28.0/src/takes-jun-lib.glb $W/m2.glb $W/m3.glb Stand_and_Chat
  node tools/retarget.mjs masters/v28.0/src/takes-koh-lib.glb $W/m3.glb $W/m4.glb Talk_with_Hands_Open same --hips --align --noalign=neck,Head,LeftShoulder,RightShoulder >> $S/$N-retakes.log 2>&1 || exit 1
  R assets/p4ravi.glb $W/m4.glb $W/m5.glb kneelhold
  R assets/e4hermita.glb $W/m5.glb $W/m6.glb Chair_Sit_Idle_M
  R assets/e4hermita.glb $W/m6.glb $W/m7.glb Sitting_Answering_Questions
  node tools/retarget.mjs $S/takes-marcus-walking.glb $W/m7.glb $W/m8.glb "Armature|walking_man|baselayer" same --hips >> $S/$N-retakes.log 2>&1 || exit 1
  node tools/mergetakes.mjs strip $W/m8.glb $S/takes-marcus-ret.glb $S/mended-marcus.glb >> $S/$N-retakes.log 2>&1 && rm -f $W/m[1-8].glb ;;
esac
echo "$N retakes exit $?"
