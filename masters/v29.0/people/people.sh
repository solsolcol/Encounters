#!/bin/sh
# v29.0 (from masters/v28.0/people.sh) · Grace and Marcus, from their bodies and takes to the game's files:
#   BPY=<Blender's Python with xatlas> sh masters/v29.0/people/people.sh [grace|marcus]
# A person is ONE skeleton and two skins (plan §6: "both are story people: their full model within 2.2 m", v26.5):
#   assets/p51<name>.glb    the NEAR body with every take this person wears (src/people/body-<name>-40000.glb: Meshy's own
#                           remesh at 40,000, the rig laid on it by tools/riglod.mjs: people/bodies.sh);
#   assets/p51<name>h.glb   the generator's own model, EVERY triangle, drawn within 2.2 m and in the films' close shots;
#                           no takes of its own: bound at run time to the near body's bones by name (as chapter 5's).
# Nothing is thinned. Each level goes through tools/prepmonk.mjs with NOTHIN=1 and REPAINT (v26.1: the paint laid out again
# by xatlas, the face three times its share, the head two, the hands one and a half, baked from the generator's 8192 sheet,
# drawn with mipmaps), the switches Master Zavier's first body proved (WSMOOTH=0 XSCALE=1000 FINS=1: masters/v28.0/make.sh
# §6), the full body repainted too (HEROKEEP empty). Colour 2048 on both.
#   1. tools/mergetakes.mjs merge: the near body with every take this person wears, each under the name the chapter asks for;
#   1b. tools/calmarms.mjs: the RAW library stands and walks' arms brought in (CALM; a take already brought in at its own
#       body's prep, Mala's, is not named);
#   2. prepmonk, a level at a time; the merged file cleared on the prep's own exit status;
#   3. every take is then LOOKED AT and MEASURED as a motion (people/RECORD.md §4), never from this script's say-so.
cd "$(dirname "$0")/../../.."
SRC=masters/v29.0/src/people
prep() { # prep <in> <out> <sheet px> <log>
  env NOTHIN=1 TEX=$3 NOMAP=1 CHARTFIX=1 FINS=1 WSMOOTH=0 XSCALE=1000 REPAINT=1 MENDOUT=${MENDOUT:-12} BPY=${BPY:?BPY is Blender\'s Python with xatlas: masters/v26.1/make.sh} \
      FACE=${PFACE:-3} HEADK=${PHEADK:-2} HANDK=1.5 PAD=3 node tools/prepmonk.mjs $1 $2 1 >> $4 2>&1
}
one() {  # one <name> <near body> <full rigged body> <take args...>
  n=$1; body=$2; full=$3; shift 3; log=$SRC/$n-people.log; : > $log
  [ -f $body ] || { echo "$n: no near body yet ($body)"; return; }
  if [ -n "$ONLYFULL" ]; then PHEADK=${HHEADK:-1} prep $full assets/p51${n}h.glb 2048 $log && echo "$n -> assets/p51${n}h.glb ($(node tools/tricount.mjs --n assets/p51${n}h.glb))"; return; fi
  node tools/mergetakes.mjs merge $body $SRC/merged-$n.glb "$@" >> $log 2>&1 || { echo "$n: merge failed (see $log)"; return; }
  [ -z "$CALM" ] || node tools/calmarms.mjs $SRC/merged-$n.glb $SRC/merged-$n.glb $CALM >> $log 2>&1 || { echo "$n: calmarms failed (see $log)"; return; }
  if prep $SRC/merged-$n.glb assets/p51$n.glb 2048 $log; then rm $SRC/merged-$n.glb; else echo "$n: prep failed (see $log)"; return; fi
  # (the full body's hair is half its triangles: with the head given twice its share there, the face drew at 1,398 texels a
  #  metre on Grace's full body against 2,240 on her near one. The full level is laid out with the head at its own share,
  #  PHEADK=1 by default: RECORD.md §5)
  PHEADK=${HHEADK:-1} prep $full assets/p51${n}h.glb 2048 $log || { echo "$n: full prep failed (see $log)"; return; }
  echo "$n -> assets/p51$n.glb ($(node tools/tricount.mjs --n assets/p51$n.glb)), assets/p51${n}h.glb ($(node tools/tricount.mjs --n assets/p51${n}h.glb))"
}
WANT="$*"; all=0; [ -z "$WANT" ] && all=1
go() { [ $all -eq 1 ] && return 0; for w in $WANT; do [ "$w" = "$1" ] && return 0; done; return 1; }
# GRACE (1.60 m; 66 joints, every finger). Her takes (RECORD.md §4): Mala's stand, walk and listening (a woman's, brought in
# at Mala's prep: not calmed again), Amma's seated rest and rise, the seated hermit's hand held out low and seated talk
# (retargeted: people/retakes.sh), and the two motions written for her (people/MOTIONS.txt): gsofa (restless on the sofa,
# the strap twisted) and gcry (the long breath out, then her hands over her face).
go grace && ( CALM="" one grace $SRC/body-grace-40000.glb $SRC/rigged-grace.glb \
  $SRC/takes-grace-ret.glb:Idle_3,Walking,Listening_Gesture,wsit,rise,palmover,Sitting_Answering_Questions \
  $SRC/takes-grace-gsofa.glb:gsofa $SRC/takes-grace-gcry.glb:gcry )
# MARCUS (1.72 m; his rig came back with 52 joints and no fingers, MENDED here to 26 at no credits: people/rigmend-marcus.json,
# on his near body and his full body alike). The library's stand, listening, chat (Jun's raw library file: calmed here) and
# talk (Mr Koh's), Ravi's kneel by a chair, the seated hermit's chair sit and seated talk, his rig's own walk, and mknock.
go marcus && ( [ -f $SRC/body-marcus-40000m.glb ] || node tools/rigmend.mjs $SRC/body-marcus-40000.glb $SRC/body-marcus-40000m.glb masters/v29.0/people/rigmend-marcus.json > $SRC/marcus-rigmend-near.log 2>&1
  CALM="Idle_3=7,0.6 Stand_and_Chat=7 Listening_Gesture=7 Walking=7,0.5,0.7" one marcus $SRC/body-marcus-40000m.glb $SRC/mended-marcus.glb \
  "$SRC/takes-marcus-ret.glb:Idle_3,Listening_Gesture,Stand_and_Chat,Talk_with_Hands_Open,kneelhold,Chair_Sit_Idle_M,Sitting_Answering_Questions,Walking" \
  $SRC/takes-marcus-knock.glb:mknock )
echo PEOPLE DONE
