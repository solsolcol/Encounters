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
# (the rig's blocky weights diffused, normals shared across the sheet's seams, the sheet's thin charts fixed; no
# thinning, no normal sheet): colour at 2048 for anyone seen close, 1024 for the devotees, 512 and 256 for the two far levels.
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
  # (CHARTFIX, 12 Nov: v19.8's law. A generated sheet has a few hundred charts thinner than a texel's reach, hair
  #  packed against white cloth: each speckled its surface white whatever the filtering. Each is pointed at a spot of
  #  its own colour: no painted pixel is touched)
  # (SIDED, for a body that asks it: a point shares the normal of the faces at its place that look its way and of no
  #  others. A remesh closes the corner of a mouth or an eye by putting both sides' points on one place, and shared
  #  among all the faces there the normal lies along the fold: a flat grey patch at the mouth of each monk made on
  #  12 Nov, lit, with the head filling the frame. The bodies made before it are as they were: it is not on for them)
  env NOTHIN=1 TEX=$3 NOMAP=1 CHARTFIX=1 ${SIDED:+SIDED=1} node tools/prepmonk.mjs $1 $2 1 >> $4 2>&1
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
# ONLY THE TAKES A BODY PLAYS (v5.20; 12 Nov, the release's closing pass). Every body had been given its whole set
# whether or not the chapter ever plays it on THAT body: a walk on all eighteen where only the dancers walk (the people
# of this ground kneel, stand and sway; the children run), Ton's four talks and his stroll, the bench woman's walk and
# chair sit, the masters' sitting down, a talk and a raised bai sri on eight devotees where one devotee raises one,
# the boy's and the girl's unplayed halves of their set. tools/probes/clipuse.mjs lists a file's takes the chapter
# never names; WHO plays a named one is read from the parts (each is asked for by a written name: grep it). Measured
# on Ton: 2,568,296 bytes with them, 1,870,248 without. A take left out is "-" in its set's list or not listed; the
# stripped take files stay in src/, so any of them is one word here away. tools/probes/samebody.mjs proves that what
# is kept (every mesh, picture, joint, and each kept take's every key) is what shipped, number for number.
dev() { n=$1; shift; one $n 24000 1024 $(T $n lib Idle_3,-,-) $(T $n seiza seiza) $(T $n prostrate prostrate) "$@"; }
master() { n=$1; one $n 30000 2048 $(T $n lib Sitting_Answering_Questions,Chair_Sit_Idle_M,Idle_3,-) $(T $n handson handson) $(T $n petals petals) $(T $n palmover palmover); }
WANT="$*"; all=0; [ -z "$WANT" ] && all=1
go() { [ $all -eq 1 ] && return 0; for w in $WANT; do [ "$w" = "$1" ] && return 0; done; return 1; }
go ton && one ton 40000 2048 $(T ton basics -,Stand_and_Chat,-,-,-,-,-) \
  $(T ton sit -,-,-,-,-,-,-,Idle_3) \
  $(T ton seiza seiza) $(T ton prostrate prostrate) $(T ton give give)
go bench && one bench 40000 2048 $(T bench lib Idle_3,Stand_and_Chat,-,-) $(T bench give give) $(T bench seiza seiza) $(T bench prostrate prostrate)
for m in hermita hermitb red white; do go $m && master $m; done
# (the dancers' walk is their own, written for them. The library's walk on a dancer was a stride: photographed
#  crossing the ground on 12 Nov, and refused. `procession`, the walk written for their one crossing of build 60, went
#  with that crossing: nothing plays it, so it is not laid on them (v5.20); its motion is kept in src/)
# (and their WALK-DANCE, for the loop up and down the ground in play: Chad, 12 Nov 2026, "this looping walk dance is
#  just like a simple walk and dance at the same time, looping for more visual flair". Written for them the same way,
#  MOTIONS.txt `${WALKDANCE:-walkdance2}`: the arms out and rising and falling in turn as she walks; the other one
#  written, `walkdance`, is kept in src/)
WD=${WALKDANCE:-walkdance2}
go dancera && one dancera 30000 2048 $(T dancera lib Idle_3) $(T dancera dance1 dance1) $(T dancera dance2 dance2) $(T dancera $WD walkdance)
go dancerb && one dancerb 30000 2048 $(T dancerb lib Idle_3) $(T dancerb dance1 dance1) $(T dancerb dance2 dance2) $(T dancerb $WD walkdance)
# (who of the eight plays more than the kneel, the bow and the stand: the woman who goes up to the hermit sways (deva);
#  the man whose arms rise is made of the arms of `armsopen` on the kneel's legs (devc: c_cast.js `mix`); the young man
#  ahead of him in the line raises his bai sri and sways (devg))
go deva && dev deva $(T deva sway sway)
go devb && dev devb
go devc && dev devc $(T devc armsopen armsopen)
go devd && dev devd
go deve && dev deve
go devf && dev devf
go devg && dev devg $(T devg offer offer) $(T devg sway sway)
go devh && dev devh
# THE CHILDREN (the plan's 4.1 "children running", 3.7 "children among them"; found unbuilt by the audit of 12 Nov): a girl
# of seven and a boy of five. The library's stand, two runs, a skip and a jump of joy (243, 14, 15, 118 and 44, the
# boy's jump 61). Their NEAR body is a grown person's 24,000, not half of it: a child's head is nearly a grown one's
# size, and at 12,000 the few points of a small face shaded it dark from the lip down (photographed lit and unlit: the
# paint was clean; the remesh's own normal sheet, tried at 1024, drew every facet, because the prep shares normals
# across the sheet's seams). The two far bodies are half a grown person's (4,000 and 1,500), and the chapter draws a
# child's levels at two thirds of a grown person's distances (c_cast.js: lodK), so the fine body is paid for only
# where a child is walked up to. Colour at 2048 (Chad, v26.0: a lighter body keeps its paint).
# (the girl runs Run_02 and jumps for joy as she throws her petals; the boy runs Run_03)
kid() { n=$1; LEVELS="m:4000:512 f:1500:256" one $n ${KIDNEAR:-24000} 2048 $(T $n kid $2); }
go girl && kid girl Idle_3,Run_02,-,-,Happy_jump
go boy && kid boy Idle_3,-,Run_03,-,-
# THE MONKS' ROW (Chad, 12 Nov 2026: "the 3 monks are the same model, can we have different monks?"). Two monks made
# here end to end (people/PROMPTS.txt, "THE MONKS' ROW": an older, heavy monk in deep maroon and a slim young one in a
# dark reddish brown, as photograph 2's row is mixed) sit either side of his own monk, who keeps the middle chair. Each
# wears the library's seated idle and nothing else (33 of takes.sh's `lib 33,243`; the stand, 243, is left out: they
# never rise). Seen close under their tent: 30,000 triangles, colour at 2048.
monk() { n=$1; SIDED=1; one $n 30000 2048 $(T $n lib Chair_Sit_Idle_M,-); SIDED=; }
go monkb && monk monkb
go monkc && monk monkc
echo PEOPLE DONE
