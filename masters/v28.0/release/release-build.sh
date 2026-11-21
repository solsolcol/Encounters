#!/bin/sh
# a RELEASE build (assets copied, not linked) under the machine's build lock, then a hard-linked snapshot to deploy from
S=/tmp/claude-0/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293/scratchpad
exec 7>/tmp/encounters-build.lock; flock 7
cd /home/user/Encounters || exit 2
H=$(git log -1 --format=%h); git log --oneline -1 | cut -c1-120
python3 -I masters/v28.0/assemble.py --check 2>&1 | tail -1 | sed 's/(he 32.*FIGHT-DRAFT)//' | cut -c1-160
# (the last release's copy goes first: Netlify holds it, and two 1.2 GB copies at once filled the disk, 21 Nov)
rm -rf $S/e4c5/snap-release
ENC_NOZIP=1 npm run build > $S/e4c5/release-build.log 2>&1 || { echo "BUILD FAILED"; tail -30 $S/e4c5/release-build.log; exit 1; }
tail -3 $S/e4c5/release-build.log
rm -rf $S/e4c5/snap-release && cp -al dist $S/e4c5/snap-release && echo "snapshot ready: $(du -sh $S/e4c5/snap-release | cut -f1)"
# THE PROOF (21 Nov, deploys 19 and 20: a helper's assemble can land between the check and the build): the chapter
# built is compared with the chapter that the COMMIT the build began on assembles to, assembled apart from the tree
GOT=$(sha1sum $S/e4c5/snap-release/assets/$(ls $S/e4c5/snap-release/assets/ | grep -E '^e4c5\.[0-9a-f]+\.js$' | head -1) | cut -c1-12)
T=$S/e4c5/asm-proof; rm -rf $T; mkdir -p $T/src/chapters/e4
git archive $H masters/v28.0/assemble.py masters/v28.0/parts masters/v28.0/script | tar -x -C $T && ln -s /home/user/Encounters/assets $T/assets
for x in src/chapters/e4/*.js; do [ "$(basename $x)" = e4c5.js ] || ln -sf /home/user/Encounters/$x $T/$x; done
python3 -I $T/masters/v28.0/assemble.py > /dev/null 2>&1
WANT=$(sha1sum $T/src/chapters/e4/e4c5.js 2>/dev/null | cut -c1-12)
if [ "$GOT" = "$WANT" ]; then echo "PROOF: the chapter built ($GOT) is commit $H's parts exactly"
else echo "NOT COMMITTED: the chapter built ($GOT) is not commit $H's parts ($WANT): an edit on disk is in it; read the diff before deploying"; fi
