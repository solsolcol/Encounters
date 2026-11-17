#!/bin/sh
# v27.0 (from masters/v26.0/people.sh) · every person and every spirit of episode 4 chapter 4, from the bodies and the
# takes to the game's files:   BPY=<Blender's Python with xatlas> sh masters/v27.0/people.sh [name ...]
#
# A person is ONE skeleton and several skins, drawn by how near the lens is (as chapter 3's):
#   assets/p4<name>.glb    the NEAR body with every take this person wears (src/body-<name>-<near>.glb: Meshy's own
#                          remesh at that count, the rig laid on it by tools/riglod.mjs: masters/v27.0/bodies.sh);
#   assets/p4<name>m.glb   the MID body (8,000 triangles): no takes of its own, bound at run time to the near body's
#                          bones by name. Her flat is small (10.2 x 10.3 m), so no FAR level: nobody is ever more than
#                          about nine metres from the lens;
#   assets/p4<name>h.glb   the three the story turns on (Amma, Ravi, Mala: Chad's rule of v26.5, the important people
#                          switch to their full model within 2.2 m): the generator's own model, EVERY triangle.
#   The four spirits (the one on her back, the two wanderers who share a body, the large one, Appa) are drawn only through
#   Spirit Vision, as glowing shapes: a NEAR body and nothing else (LEVELS=none), colour at 1024 (the vision pass draws
#   their light, not their paint; Appa's face is seen in his photograph, which is rendered from his full rigged file).
# Nothing is thinned here (a generated body cannot be: v26.0's tracker §8). Each level goes through tools/prepmonk.mjs
# with NOTHIN=1 and REPAINT (v26.1: the paint laid out again by xatlas, the face given three times its share, the head
# two, the hands one and a half, baked from the generator's 8192 sheet, drawn with mipmaps): colour at 2048 near, 1024
# mid (seen at three to six metres in a lit flat: a 512 sheet blurred a face at three metres in chapter 3's tests).
#   1. tools/mergetakes.mjs merge: the near body with every take this person wears, each under the name the chapter asks
#      for ("-" leaves a take out: v5.20, only the takes a body plays);
#   1b. tools/calmarms.mjs: the standing and walking takes' arms brought in (CALM below);
#   2. prepmonk, a level at a time; the merged file (an intermediate) cleared on the prep's own exit status;
#   3. every take is then LOOKED AT and MEASURED as a motion before it is cast (the house rules: headturn, gait, jointscan,
#      feetscan, clipscan, and full size beside a real photograph), never from this script's say-so.
cd "$(dirname "$0")/../.."
SRC=masters/v27.0/src; OUT=${OUT:-/tmp/claude-0/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293/scratchpad/e4c4/people}
mkdir -p $OUT
T() { echo "$SRC/takes-$1-$2.glb:$3"; }
prep() { # prep <in> <out> <sheet px> <log> [keep]
  rp=1; [ "$5" = keep ] && rp=
  env NOTHIN=1 TEX=$3 NOMAP=1 CHARTFIX=1 ${SIDED:+SIDED=1} REPAINT=$rp BPY=${BPY:?BPY is Blender\'s Python with xatlas: masters/v26.1/make.sh} \
      FACE=3 HEADK=2 HANDK=1.5 PAD=$( [ $3 -ge 2048 ] && echo 3 || echo 2 ) node tools/prepmonk.mjs $1 $2 1 >> $4 2>&1
}
one() {  # one <name> <near triangles> <near sheet px> <take args...>
  n=$1; near=$2; px=$3; shift 3; log=$SRC/$n-people.log; : > $log
  [ -f $SRC/body-$n-$near.glb ] || { echo "$n: no body at $near yet (sh masters/v27.0/bodies.sh $n $near)"; return; }
  node tools/mergetakes.mjs merge $SRC/body-$n-$near.glb $SRC/merged-$n.glb "$@" >> $log 2>&1 || { echo "$n: merge failed (see $log)"; return; }
  node tools/calmarms.mjs $SRC/merged-$n.glb $SRC/merged-$n.glb $CALM >> $log 2>&1 || { echo "$n: calmarms failed (see $log)"; return; }
  if prep $SRC/merged-$n.glb assets/p4$n.glb $px $log; then rm $SRC/merged-$n.glb; else echo "$n: prep failed (see $log)"; return; fi
  made="near $(node tools/tricount.mjs --n assets/p4$n.glb)"
  if [ "${LEVELS:-}" != none ]; then
    for lv in ${LEVELS:-m:8000:1024}; do s=${lv%%:*}; r=${lv#*:}; c=${r%%:*}; p=${r#*:}
      if [ -f $SRC/body-$n-$c.glb ]; then prep $SRC/body-$n-$c.glb assets/p4$n$s.glb $p $log && made="$made, $s $(node tools/tricount.mjs --n assets/p4$n$s.glb)"
      else made="$made, $s NOT YET (no body at $c)"; fi
    done
  fi
  case " $HERO " in *" $n "*) prep $SRC/rigged-$n.glb assets/p4${n}h.glb 2048 $log keep && made="$made, h $(node tools/tricount.mjs --n assets/p4${n}h.glb)";; esac
  echo "$n -> assets/p4$n.glb ($made triangles)"
}
HERO="amma ravi mala"
# THE ARMS BROUGHT IN (tools/calmarms.mjs, v26.0): the library's stands and walks hold both upper arms fifteen to
# nineteen degrees out from the body, a doll's A pose; each standing or walking take's mean angle out is set here.
CALM="Idle_3=6,0.6 Stand_and_Chat=7 Listening_Gesture=7 Walking=7,0.5,0.7"
WANT="$*"; all=0; [ -z "$WANT" ] && all=1
go() { [ $all -eq 1 ] && return 0; for w in $WANT; do [ "$w" = "$1" ] && return 0; done; return 1; }
# AMMA: in her wheelchair (the library's seated talk; her own seated rest and the turn of her head to him, written for
# her), the trance, standing up, her first steps, the lamp. She does not walk otherwise: the library's walk is left out.
go amma && one amma 40000 2048 $(T amma lib Sitting_Answering_Questions) $(T amma wsit wsit) $(T amma wturn wturn) \
  $(T amma trance trance) $(T amma rise rise) $(T amma steps steps) $(T amma lamp lamp)
# RAVI and MALA: the library's stand, listening, chat and talk; the walk; and each one's own (his rush to her, his kneel
# with her hand, his being held; her lamp, her kneel with her mother's hand, her cry)
go ravi && one ravi 40000 2048 $(T ravi lib Idle_3,Listening_Gesture,Stand_and_Chat,Talk_with_Hands_Open) $(T ravi walking Walking) \
  $(T ravi rush rush) $(T ravi kneelhold kneelhold) $(T ravi struggle struggle)
go mala && one mala 40000 2048 $(T mala lib Idle_3,Listening_Gesture,Stand_and_Chat,Talk_with_Right_Hand_Open) $(T mala walking Walking) \
  $(T mala lightlamp lightlamp) $(T mala kneelhold kneelhold) $(T mala scream scream)
# THE SPIRITS (near only). The one on her back: cling, its turn to him, the claw, the cry, torn free. The wanderers (one
# body, two of them, the chapter recolours and turns each): the creep and the crawl. The large one: its lumber. Appa:
# standing still, and the turn of his head to her. None of them walks the library's walk.
spirit() { LEVELS=none; one "$@"; LEVELS=; }    # (set and cleared round the call: an assignment before a function's name is not
                                                 #  certain to end with it in every sh)
go oppress && spirit oppress 30000 1024 $(T oppress cling cling) $(T oppress oturn oturn) $(T oppress claw claw) \
  $(T oppress cry cry) $(T oppress torn torn)
go wander && spirit wander 16000 1024 $(T wander creep creep) $(T wander crawl crawl)
go large && spirit large 24000 1024 $(T large lumber lumber)
go appa && spirit appa 30000 1024 $(T appa lib Idle_3) $(T appa aturn aturn)
echo PEOPLE DONE
