#!/bin/sh
# v28.0 (from masters/v27.0/people.sh) · every person and every spirit of episode 4 chapter 5, from the bodies and the
# takes to the game's files:   BPY=<Blender's Python with xatlas> sh masters/v28.0/people.sh [name ...]
#
# A person is ONE skeleton and several skins, drawn by how near the lens is (as chapter 3's):
#   assets/p5<name>.glb    the NEAR body with every take this person wears (src/body-<name>-<near>.glb: Meshy's own
#                          remesh at that count, the rig laid on it by tools/riglod.mjs: masters/v28.0/bodies.sh);
#   assets/p5<name>m.glb   the MID body (8,000 triangles): no takes of its own, bound at run time to the near body's
#                          bones by name. Her flat is small (10.2 x 10.3 m), so no FAR level: nobody is ever more than
#                          about nine metres from the lens;
#   assets/p5<name>h.glb   the three the story turns on (Amma, Ravi, Mala: Chad's rule of v26.5, the important people
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
SRC=masters/v28.0/src; OUT=${OUT:-/tmp/claude-0/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293/scratchpad/e4c5/people}
mkdir -p $OUT
T() { echo "$SRC/takes-$1-$2.glb:$3"; }
prep() { # prep <in> <out> <sheet px> <log> [keep]
  rp=1; [ "$5" = keep ] && rp=
  # (v28.0: where a person has a spec for it, the ragged painted edges between two materials are drawn clean after the
  #  repaint: tools/edgeclean.py, masters/v28.0/people/edgeclean-<name>.json)
  ec=masters/v28.0/people/edgeclean-$n.json; [ -f $ec ] && [ -n "$rp" ] || ec=
  env NOTHIN=1 TEX=$3 NOMAP=1 CHARTFIX=1 ${SIDED:+SIDED=1} REPAINT=$rp MENDOUT=${MENDOUT:-12} ${ec:+EDGECLEAN=$ec} BPY=${BPY:?BPY is Blender\'s Python with xatlas: masters/v26.1/make.sh} \
      FACE=3 HEADK=2 HANDK=1.5 PAD=$( [ $3 -ge 2048 ] && echo 3 || echo 2 ) node tools/prepmonk.mjs $1 $2 1 >> $4 2>&1
}
one() {  # one <name> <near triangles> <near sheet px> <take args...>
  n=$1; near=$2; px=$3; shift 3; log=$SRC/$n-people.log; : > $log
  [ -f $SRC/body-$n-$near.glb ] || { echo "$n: no body at $near yet (sh masters/v28.0/bodies.sh $n $near)"; return; }
  node tools/mergetakes.mjs merge $SRC/body-$n-$near.glb $SRC/merged-$n.glb "$@" >> $log 2>&1 || { echo "$n: merge failed (see $log)"; return; }
  node tools/calmarms.mjs $SRC/merged-$n.glb $SRC/merged-$n.glb $CALM >> $log 2>&1 || { echo "$n: calmarms failed (see $log)"; return; }
  if prep $SRC/merged-$n.glb assets/p5$n.glb $px $log; then rm $SRC/merged-$n.glb; else echo "$n: prep failed (see $log)"; return; fi
  made="near $(node tools/tricount.mjs --n assets/p5$n.glb)"
  if [ "${LEVELS:-}" != none ]; then
    for lv in ${LEVELS:-m:8000:1024}; do s=${lv%%:*}; r=${lv#*:}; c=${r%%:*}; p=${r#*:}
      if [ -f $SRC/body-$n-$c.glb ]; then prep $SRC/body-$n-$c.glb assets/p5$n$s.glb $p $log && made="$made, $s $(node tools/tricount.mjs --n assets/p5$n$s.glb)"
      else made="$made, $s NOT YET (no body at $c)"; fi
    done
  fi
  # (v28.0: a hero's full body is repainted too where HEROKEEP is set empty: Master Zavier's marled knit, whose thin charts
  #  CHARTFIX painted one flat grey each, grey shards all over the cardigan when looked at close)
  case " $HERO " in *" $n "*) prep $SRC/rigged-$n.glb assets/p5${n}h.glb ${HEROPX:-2048} $log ${HEROKEEP-keep} && made="$made, h $(node tools/tricount.mjs --n assets/p5${n}h.glb)";; esac
  echo "$n -> assets/p5$n.glb ($made triangles)"
}
HERO="zavier zavier2"
# THE ARMS BROUGHT IN (tools/calmarms.mjs, v26.0): the library's stands and walks hold both upper arms fifteen to
# nineteen degrees out from the body, a doll's A pose; each standing or walking take's mean angle out is set here.
CALM="Idle_3=6,0.6 Stand_and_Chat=7 Listening_Gesture=7 Walking=7,0.5,0.7"
WANT="$*"; all=0; [ -z "$WANT" ] && all=1
go() { [ $all -eq 1 ] && return 0; for w in $WANT; do [ "$w" = "$1" ] && return 0; done; return 1; }
# MASTER ZAVIER (Chad, 20 Nov 2026, R5): the player's own body, seen in the third-person fight. For now the rig's own
# walk only (the takes of the fight are laid on once the plan names them). His full body is repainted (HEROKEEP empty).
go zavier && HEROKEEP= one zavier 40000 2048 $(T zavier walking Walking)
# HIS SECOND BODY (the same day): the first came with four fingers of each hand fused into one piece, the gaps between
# them only painted, and a watch whose face was a noisy checkered patch. The reference was made again with the same man
# (masters/v28.0/ref/zavier-a2-2k.png: palms forward, every finger apart, a plain round watch) and the body from it.
go zavier2 && HEROKEEP= one zavier2 40000 2048 $(T zavier2 walking Walking)
echo PEOPLE DONE
