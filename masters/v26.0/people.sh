#!/bin/sh
# v26.0 · every person, from the bodies and the takes to the game's files:   sh masters/v26.0/people.sh [name ...]
#
# A person is ONE skeleton and several skins, drawn by how near the lens is (the tracker's §5 "The levels"):
#   assets/e4<name>.glb    the NEAR body with every take this person wears (src/body-<name>-<near>.glb: Meshy's own
#                          remesh at that count, the rig laid on it by tools/riglod.mjs: masters/v26.0/bodies.sh);
#   assets/e4<name>m.glb   the MID body (8,000 triangles) and assets/e4<name>f.glb the FAR one (2,500): no takes of
#                          their own, bound at run time to the near body's bones by name;
#   assets/e4<name>h.glb   for the two people he speaks to face to face (Ton, the woman at the bench): the generator's
#                          own model, EVERY triangle (310,000), shown only within arm's reach and in a film's close shot.
# Nothing is thinned here (a generated body cannot be: §8). Each level goes through tools/prepmonk.mjs with NOTHIN=1
# (the rig's blocky weights diffused, normals shared across the sheet's seams; no thinning, no chart fix, no normal
# sheet): colour at 2048 for anyone seen close, 1024 for the devotees, 512 and 256 for the two far levels.
#   1. tools/mergetakes.mjs merge: the near body with every take this person wears, each under the name the chapter asks
#      for (a take whose verdict was "not used" is left out with "-": the tracker's table in §5);
#   1b. tools/calmarms.mjs: the standing and walking takes' arms brought in (CALM below);
#   2. prepmonk, a level at a time; the merged file (an intermediate) cleared on the prep's own exit status;
#   3. photographed: the face close and every take front and side (tools/clipsheet.mjs), to be LOOKED AT.
cd "$(dirname "$0")/../.."
SRC=masters/v26.0/src; OUT=${OUT:-/tmp/claude-0/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293/scratchpad/e4c3/people}
mkdir -p $OUT
T() { echo "$SRC/takes-$1-$2.glb:$3"; }
prep() { # prep <in> <out> <sheet px> <log>
  NOTHIN=1 TEX=$3 NOMAP=1 node tools/prepmonk.mjs $1 $2 1 >> $4 2>&1
}
one() {  # one <name> <near triangles> <near sheet px> <take args...>
  n=$1; near=$2; px=$3; shift 3; log=$SRC/$n-people.log; : > $log
  [ -f $SRC/body-$n-$near.glb ] || { echo "$n: no body at $near yet (sh masters/v26.0/bodies.sh $n $near)"; return; }
  node tools/mergetakes.mjs merge $SRC/body-$n-$near.glb $SRC/merged-$n.glb "$@" >> $log 2>&1 || { echo "$n: merge failed (see $log)"; return; }
  node tools/calmarms.mjs $SRC/merged-$n.glb $SRC/merged-$n.glb $CALM >> $log 2>&1 || { echo "$n: calmarms failed (see $log)"; return; }
  if prep $SRC/merged-$n.glb assets/e4$n.glb $px $log; then rm $SRC/merged-$n.glb; else echo "$n: prep failed (see $log)"; return; fi
  made="near $(node tools/tricount.mjs --n assets/e4$n.glb)"
  for lv in ${LEVELS:-m:8000:512 f:2500:256}; do s=${lv%%:*}; r=${lv#*:}; c=${r%%:*}; p=${r#*:}
    if [ -f $SRC/body-$n-$c.glb ]; then prep $SRC/body-$n-$c.glb assets/e4$n$s.glb $p $log && made="$made, $s $(node tools/tricount.mjs --n assets/e4$n$s.glb)"
    else made="$made, $s NOT YET (no body at $c)"; fi
  done
  case " $HERO " in *" $n "*) prep $SRC/rigged-$n.glb assets/e4${n}h.glb 2048 $log && made="$made, h $(node tools/tricount.mjs --n assets/e4${n}h.glb)";; esac
  echo "$n -> assets/e4$n.glb ($made triangles)"
}
HERO="ton bench"
# THE ARMS BROUGHT IN (tools/calmarms.mjs): the library's stands and walks hold both upper arms fifteen to nineteen
# degrees out from the body, which on these people reads as a doll's A pose (photographed on Ton at the way in). Each
# standing or walking take's mean angle out is set here; a take a person does not have is passed over.
CALM="Idle_3=6,0.6 Stand_and_Chat=7 Listening_Gesture=7 Walking=7,0.5,0.7 Casual_Walk=7,0.6,0.8 Walking_Woman=7,0.5,0.7"
dev() { n=$1; shift; one $n 24000 1024 $(T $n lib Idle_3,-,Stand_and_Chat) $(T $n walking Walking) $(T $n seiza seiza) $(T $n prostrate prostrate) $(T $n offer offer) "$@"; }
master() { n=$1; one $n 30000 2048 $(T $n lib Sitting_Answering_Questions,Chair_Sit_Idle_M,Idle_3,Stand_to_Sit_Transition_M) $(T $n walking Walking) $(T $n handson handson) $(T $n petals petals) $(T $n palmover palmover); }
WANT="$*"; all=0; [ -z "$WANT" ] && all=1
go() { [ $all -eq 1 ] && return 0; for w in $WANT; do [ "$w" = "$1" ] && return 0; done; return 1; }
go ton && one ton 40000 2048 $(T ton basics -,Stand_and_Chat,Listening_Gesture,Casual_Walk,-,Talk_with_Hands_Open,-) \
  $(T ton sit -,-,Talk_with_Right_Hand_Open,Talk_with_Left_Hand_Raised,-,-,-,Idle_3) $(T ton walking Walking) \
  $(T ton seiza seiza) $(T ton prostrate prostrate) $(T ton offer offer) $(T ton give give)
go bench && one bench 40000 2048 $(T bench lib Idle_3,Stand_and_Chat,Walking_Woman,Chair_Sit_Idle_F) $(T bench walking Walking) $(T bench give give) $(T bench seiza seiza) $(T bench prostrate prostrate)
for m in hermita hermitb red white; do go $m && master $m; done
go dancera && one dancera 30000 2048 $(T dancera lib Idle_3) $(T dancera walking Walking) $(T dancera dance1 dance1) $(T dancera dance2 dance2)
go dancerb && one dancerb 30000 2048 $(T dancerb lib Idle_3) $(T dancerb walking Walking) $(T dancerb dance1 dance1) $(T dancerb dance2 dance2)
go deva && dev deva $(T deva sway sway) $(T deva armsopen armsopen)
go devb && dev devb
go devc && dev devc $(T devc sway sway) $(T devc armsopen armsopen)
go devd && dev devd
go deve && dev deve
go devf && dev devf $(T devf sway sway) $(T devf armsopen armsopen)
go devg && dev devg $(T devg sway sway) $(T devg armsopen armsopen) $(T devg trance2 trance2)
go devh && dev devh
# THE CHILDREN (the plan's 4.1 "children running", 3.7 "children among them"; found unbuilt by the audit of 13 Nov): a girl
# of seven and a boy of five. The library's stand, two runs, a skip and a jump of joy (243, 14, 15, 118 and 44, the
# boy's jump 61). Their NEAR body is a grown person's 24,000, not half of it: a child's head is nearly a grown one's
# size, and at 12,000 the few points of a small face shaded it dark from the lip down (photographed lit and unlit: the
# paint was clean; the remesh's own normal sheet, tried at 1024, drew every facet, because the prep shares normals
# across the sheet's seams). The two far bodies are half a grown person's (4,000 and 1,500), and the chapter draws a
# child's levels at two thirds of a grown person's distances (c_cast.js: lodK), so the fine body is paid for only
# where a child is walked up to. Colour at 2048 (Chad, v26.0: a lighter body keeps its paint).
kid() { n=$1; LEVELS="m:4000:512 f:1500:256" one $n ${KIDNEAR:-24000} 2048 $(T $n kid Idle_3,Run_02,Run_03,Skip_Forward,Happy_jump) $(T $n walking Walking); }
go girl && kid girl
go boy && kid boy
echo PEOPLE DONE
