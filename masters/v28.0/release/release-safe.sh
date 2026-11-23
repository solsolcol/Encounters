#!/bin/sh
# A RELEASE BUILT FROM SAFE PARTS ONLY (21 Nov). The pins are in $S/e4c5/safe.env, one per line:
#   e4c5base=<commit>         chapter 5's assembler, parts, script AND the chapters it copies from (src/chapters/e4) all
#                             taken from that commit (default HEAD, with the chapters it copies from on disk)
#   e4c5:<part.js>=<commit>   a part of chapter 5 taken from that commit (the rest of chapter 5's parts from e4c5base)
#   e4c4=<commit>             every part of chapter 4 (masters/v27.0) taken from that commit
#   engine=<commit>           the engine's files ON DISK must equal that commit's (main.js, shell.html, the words, the
#                             build, the fixture): a helper's half-done edit, swept or not, stops the build
# Each chapter is assembled APART from the tree and built through ENC_CHAPTER_FROM; the static checks run on what ships;
# the chapters built are proved to be those assemblies.
S=/tmp/claude-0/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293/scratchpad
PINS=$S/e4c5/safe.env
exec 7>/tmp/encounters-build.lock; flock 7
cd /home/user/Encounters || exit 2
H=$(git log -1 --format=%h); echo "base: $(git log --oneline -1 | cut -c1-110)"
ENGINE=$(sed -n 's/^engine=//p' $PINS); ENGINE=${ENGINE:-$H}
EFILES="src/main.js shell.html src/strings.js src/voicelines.js build.py wrap.py package.json src/chapters/chtest.js"
[ -f src/vision.js ] && EFILES="$EFILES src/vision.js"
if ! git diff --quiet $ENGINE -- $EFILES; then echo "ENGINE DIRTY against $ENGINE:"; git diff --stat $ENGINE -- $EFILES | tail -6; exit 3; fi
echo "engine: the files on disk are $ENGINE's"
link_others() { for x in src/chapters/e4/*.js; do [ "$(basename $x)" = "$2" ] || ln -sf /home/user/Encounters/$x $1/$x; done; }
# chapter 5
T5=$S/e4c5/asm-safe; rm -rf $T5; mkdir -p $T5/src/chapters/e4
B5=$(sed -n 's/^e4c5base=//p' $PINS)
if [ -n "$B5" ]; then git archive $B5 masters/v28.0/assemble.py masters/v28.0/parts masters/v28.0/script src/chapters/e4 | tar -x -C $T5 || exit 2
  rm -f $T5/src/chapters/e4/e4c5.js; echo "  e4c5 base $B5 (its parts, its script and the chapters it copies from)"
else git archive $H masters/v28.0/assemble.py masters/v28.0/parts masters/v28.0/script | tar -x -C $T5 || exit 2; fi
for spec in $(sed -n 's/^e4c5://p' $PINS); do f=${spec%%=*}; c=${spec#*=}
  git show "$c:masters/v28.0/parts/$f" > $T5/masters/v28.0/parts/$f || { echo "no $f at $c"; exit 2; }; echo "  e4c5 $f from $c"; done
ln -s /home/user/Encounters/assets $T5/assets; [ -n "$B5" ] || link_others $T5 e4c5.js
python3 -I $T5/masters/v28.0/assemble.py 2>&1 | tail -1 | sed 's/(he 32.*FIGHT-DRAFT)//' | cut -c1-140
C5=$T5/src/chapters/e4/e4c5.js; W5=$(sha1sum $C5 | cut -c1-12)
# chapter 4
P4=$(sed -n 's/^e4c4=//p' $PINS); P4=${P4:-$H}
T4=$S/e4c5/asm-safe4; rm -rf $T4; mkdir -p $T4/src/chapters/e4
git archive $P4 masters/v27.0/assemble.py masters/v27.0/parts | tar -x -C $T4 || exit 2
link_others $T4 e4c4.js
python3 -I $T4/masters/v27.0/assemble.py 2>&1 | tail -1 | cut -c1-140; echo "  e4c4 from $P4"
C4=$T4/src/chapters/e4/e4c4.js; W4=$(sha1sum $C4 | cut -c1-12)
# the build's own static checks, on what ships
OTHERS=$(find src/chapters -name '*.js' ! -name e4c5.js ! -name e4c4.js)
for c in $C5 $C4; do node --check $c || { echo "SYNTAX: $c"; exit 1; }; done
node tools/probes/usebefore.mjs $OTHERS $C4 $C5 src/main.js > $S/e4c5/safe-checks.log 2>&1 \
  && node tools/probes/undefscan.mjs $OTHERS $C4 $C5 >> $S/e4c5/safe-checks.log 2>&1 \
  && node tools/probes/dupfuncs.mjs $OTHERS $C4 $C5 src/main.js >> $S/e4c5/safe-checks.log 2>&1 \
  || { echo "STATIC CHECKS FAILED on the safe chapters"; tail -20 $S/e4c5/safe-checks.log; exit 1; }
echo "static checks: clean"
rm -rf $S/e4c5/${SNAPNAME:-snap-release}
ENC_CHAPTER_FROM="e4c5=$C5,e4c4=$C4" ENC_NOZIP=1 npm run build > $S/e4c5/release-build.log 2>&1 || { echo "BUILD FAILED"; tail -30 $S/e4c5/release-build.log; exit 1; }
grep "ENC_CHAPTER_FROM" $S/e4c5/release-build.log | head -3; tail -3 $S/e4c5/release-build.log
rm -rf $S/e4c5/${SNAPNAME:-snap-release} && cp -al dist $S/e4c5/${SNAPNAME:-snap-release} && echo "snapshot ready: $(du -sh $S/e4c5/${SNAPNAME:-snap-release} | cut -f1)"
G5=$(sha1sum $S/e4c5/${SNAPNAME:-snap-release}/assets/$(ls $S/e4c5/${SNAPNAME:-snap-release}/assets/ | grep -E '^e4c5\.[0-9a-f]+\.js$' | head -1) | cut -c1-12)
G4=$(sha1sum $S/e4c5/${SNAPNAME:-snap-release}/assets/$(ls $S/e4c5/${SNAPNAME:-snap-release}/assets/ | grep -E '^e4c4\.[0-9a-f]+\.js$' | head -1) | cut -c1-12)
if [ "$G5" = "$W5" ] && [ "$G4" = "$W4" ]; then echo "PROOF: e4c5 $G5 and e4c4 $G4 are the safe assemblies (base $H; pins: $(tr '\n' ' ' < $PINS))"
else echo "PROOF FAILED: e4c5 built $G5 want $W5, e4c4 built $G4 want $W4"; exit 1; fi
