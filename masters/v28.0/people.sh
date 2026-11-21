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
  # (FINS=1 on a body's line: the triangles a remesh left hanging from the body by one edge are taken out first, tools/prepmonk.mjs)
  # (WSMOOTH=<passes> and XSCALE=<unit> on a body's line reach prepmonk and tools/repaint.py; unset, both are as they always were)
  env NOTHIN=1 TEX=$3 NOMAP=1 CHARTFIX=1 ${SIDED:+SIDED=1} ${FINS:+FINS=1} ${WSMOOTH:+WSMOOTH=$WSMOOTH} ${XSCALE:+XSCALE=$XSCALE} REPAINT=$rp MENDOUT=${MENDOUT:-12} ${ec:+EDGECLEAN=$ec} BPY=${BPY:?BPY is Blender\'s Python with xatlas: masters/v26.1/make.sh} \
      FACE=3 HEADK=2 HANDK=1.5 PAD=$( [ $3 -ge 2048 ] && echo 3 || echo 2 ) node tools/prepmonk.mjs $1 $2 1 >> $4 2>&1
}
one() {  # one <name> <near triangles> <near sheet px> <take args...>     (OUTN=<x>: the game's files are p5<x>*.glb)
  n=$1; near=$2; px=$3; shift 3; log=$SRC/$n-people.log; : > $log; o=${OUTN:-$n}
  [ -f $SRC/body-$n-$near.glb ] || { echo "$n: no body at $near yet (sh masters/v28.0/bodies.sh $n $near)"; return; }
  node tools/mergetakes.mjs merge $SRC/body-$n-$near.glb $SRC/merged-$n.glb "$@" >> $log 2>&1 || { echo "$n: merge failed (see $log)"; return; }
  node tools/calmarms.mjs $SRC/merged-$n.glb $SRC/merged-$n.glb $CALM >> $log 2>&1 || { echo "$n: calmarms failed (see $log)"; return; }
  if prep $SRC/merged-$n.glb assets/p5$o.glb $px $log; then rm $SRC/merged-$n.glb; else echo "$n: prep failed (see $log)"; return; fi
  made="near $(node tools/tricount.mjs --n assets/p5$o.glb)"
  if [ "${LEVELS:-}" != none ]; then
    for lv in ${LEVELS:-m:8000:1024}; do s=${lv%%:*}; r=${lv#*:}; c=${r%%:*}; p=${r#*:}
      if [ -f $SRC/body-$n-$c.glb ]; then prep $SRC/body-$n-$c.glb assets/p5$o$s.glb $p $log && made="$made, $s $(node tools/tricount.mjs --n assets/p5$o$s.glb)"
      else made="$made, $s NOT YET (no body at $c)"; fi
    done
  fi
  # (v28.0: a hero's full body is repainted too where HEROKEEP is set empty: Master Zavier's marled knit, whose thin charts
  #  CHARTFIX painted one flat grey each, grey shards all over the cardigan when looked at close)
  case " $HERO " in *" $n "*) prep $SRC/rigged-$n.glb assets/p5${o}h.glb ${HEROPX:-2048} $log ${HEROKEEP-keep} && made="$made, h $(node tools/tricount.mjs --n assets/p5${o}h.glb)";; esac
  echo "$n -> assets/p5$o.glb ($made triangles)"
}
HERO="zavier zavier2 zavier3 zavier4"
# THE ARMS BROUGHT IN (tools/calmarms.mjs, v26.0): the library's stands and walks hold both upper arms fifteen to
# nineteen degrees out from the body, a doll's A pose; each standing or walking take's mean angle out is set here.
CALM="Idle_3=6,0.6 Stand_and_Chat=7 Listening_Gesture=7 Walking=7,0.5,0.7"
WANT="$*"; all=0; [ -z "$WANT" ] && all=1
go() { [ $all -eq 1 ] && return 0; for w in $WANT; do [ "$w" = "$1" ] && return 0; done; return 1; }
# MASTER ZAVIER (Chad, 20 Nov 2026, R5): the player's own body, seen in the third-person fight. For now the rig's own
# walk only (the takes of the fight are laid on once the plan names them). His full body is repainted (HEROKEEP empty).
# (each body's line runs in ( ) so that the switches written in front of `one` end with it: in some shells an
#  assignment in front of a FUNCTION stays set afterwards, and the next body would inherit OUTN, WSMOOTH, XSCALE or FINS)
# (21 Nov 2026, after Chad's R8 and R9: "the first one already looked the best", "The first model face is the closest to
#  reference": the first body is given the three switches the fourth proved (below), because its knit smears the same
#  way under the weight smoothing: its back in the walk at 0.3, 99th percentile edge stretch and roughness 1.727 / 1.14
#  as it was first prepared, the fourth's 1.741 / 1.13 before its switches. Without them this line made the bytes
#  committed at 54038f5, proved: masters/v28.0/make.sh 5g.)
go zavier && ( WSMOOTH=0 XSCALE=1000 FINS=1 HEROKEEP= OUTN=zavier1 one zavier 40000 2048 $(T zavier walking Walking) )
# HIS SECOND BODY (the same day): the first came with four fingers of each hand fused into one piece, the gaps between
# them only painted, and a watch whose face was a noisy checkered patch. The reference was made again with the same man
# (masters/v28.0/ref/zavier-a2-2k.png: palms forward, every finger apart, a plain round watch) and the body from it.
go zavier2 && ( HEROKEEP= one zavier2 40000 2048 $(T zavier2 walking Walking) )
# HIS THIRD (the same reference again): the second came with both eyes painted looking aside and a lump on the back of
# its left hand; this one has neither, and every finger its own. REFUSED all the same: its rig came back with no finger
# bones, twice (masters/v28.0/make.sh 4).
go zavier3 && ( HEROKEEP= one zavier3 40000 2048 $(T zavier3 walking Walking) )
# HIS FOURTH (the same reference a third time), THE BODY THE GAME DRAWS (assets/p5zavier.glb, p5zavierh.glb): the third's
# rig came back with no finger bones, twice (Meshy rigs no fingers on hands it has left palm-forward); this one has all
# sixty-six joints, every finger its own, the eyes ahead, and a watch that reads as a watch.
# FINS=1: his near body came from the remesh with a leftover triangle 9 mm across lying on his left cheek, drawn dark
# whatever was painted on it (tools/probes/fins.mjs: 16 such on the near body, 12 on the full one, each hanging by one edge).
# WSMOOTH=0: the prep's weight smoothing SMEARS this body's knit when he moves (the walk seen from behind: patches of
# 3 x 9 cm between his shoulder blades). Measured on the back, the walk at 0.3, 99th percentile edge stretch and the
# roughness's 99th: near 1.365 / 0.53 as rigged, 1.741 / 1.13 smoothed; full 1.404 / 0.63 and 1.627 / 0.97; the chest and
# both armpits are best unsmoothed too (tools/probes/edgestrain.mjs).
# XSCALE=1000: xatlas takes a triangle too small in its unit for no triangle. In metres, 12,807 of his full body's
# triangles were left at the sheet's corner (16.7 cm2 of him, drawn as dark and pink specks along every edge) and 8,036
# slivers torn; in millimetres none, and his sheet is sharper (full body: face 1,944 -> 2,264 texels a metre, body 700 -> 818).
go zavier4 && ( WSMOOTH=0 XSCALE=1000 FINS=1 HEROKEEP= OUTN=zavier one zavier4 40000 2048 $(T zavier4 walking Walking) )
echo PEOPLE DONE
