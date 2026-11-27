#!/bin/sh
# relbuild.sh <snapshot-dir> [--check]   (v29.0) THE RELEASE BUILD, FROM WHAT IS COMMITTED ONLY.
# Several helpers work in one tree, so a release is never built from what their half-done edits left on disk:
#   1. one build at a time on this machine (the same lock as tools/buildlock.sh);
#   2. every GENERATED chapter whose assembler is at HEAD (episode 4's chapters 4 and 5, episode 5's chapter 1, ...) is
#      assembled apart from the tree, from HEAD's own parts and HEAD's own copies of the chapters it copies from, and
#      must be byte for byte the chapter file HEAD carries (a part committed without its assembly stops the release);
#   3. the engine's files, every chapter file and every asset must be on disk exactly as HEAD has them, and no untracked
#      file may sit under src/ (a helper's uncommitted edit stops the release: commit it, or wait);
#   4. the build runs its own static checks on what ships, WITHOUT ENC_DISTLINK (an asset written in place later can
#      never change a file Netlify serves under its old name) and without the zip;
#   5. the snapshot is a hard-linked copy of dist/ at <snapshot-dir>, and each generated chapter's built file is proved
#      to be HEAD's.
# --check stops after 3 (no build). Then deploy from the snapshot, from the repo root:
#   python3 -I tools/netlifydeploy.py <snapshot-dir> "<proxyUrl>" <site id>
snap=$1; [ -n "$snap" ] || { echo "relbuild: give a snapshot directory"; exit 2; }
case "$snap" in /*) ;; *) snap="$(pwd)/$snap" ;; esac
CHECK=$2
ROOT=$(cd "$(dirname "$0")/.." && pwd) || exit 2
W="$(dirname "$snap")/relbuild-asm"
exec 7>/tmp/encounters-build.lock; flock 7
cd "$ROOT" || exit 2
H=$(git rev-parse --short HEAD); echo "relbuild: HEAD $(git log --oneline -1 | cut -c1-110)"
# the generated chapters: key, chapter file, its assembler's folder
GEN="e4c4:src/chapters/e4/e4c4.js:masters/v27.0 e4c5:src/chapters/e4/e4c5.js:masters/v28.0 e5c1:src/chapters/e5/e5c1.js:masters/v29.0"
PROVED=""
for g in $GEN; do
  key=${g%%:*}; rest=${g#*:}; ch=${rest%%:*}; asm=${rest#*:}
  git cat-file -e "HEAD:$asm/assemble.py" 2>/dev/null && git cat-file -e "HEAD:$ch" 2>/dev/null || { echo "  $key: no assembler or chapter at HEAD (skipped)"; continue; }
  T="$W/$key"; rm -rf "$T"; mkdir -p "$T"
  P="$asm/assemble.py $asm/parts src/chapters"
  git cat-file -e "HEAD:$asm/script" 2>/dev/null && P="$P $asm/script"
  git archive --format=tar HEAD -- $P | tar -x -C "$T" || { echo "relbuild: git archive failed for $key"; exit 2; }
  ln -s "$ROOT/assets" "$T/assets"; ln -s "$ROOT/tools" "$T/tools"; [ -d "$ROOT/node_modules" ] && ln -s "$ROOT/node_modules" "$T/node_modules"
  python3 -I "$T/$asm/assemble.py" > "$T/assemble.log" 2>&1 || { echo "relbuild: $key does not assemble from HEAD's parts"; tail -5 "$T/assemble.log"; exit 1; }
  want=$(git show "HEAD:$ch" | sha1sum | cut -c1-40); got=$(sha1sum "$T/$ch" | cut -c1-40)
  [ "$want" = "$got" ] || { echo "relbuild: $key at HEAD is NOT its parts' assembly (committed $want, assembled $got): assemble, commit, try again"; exit 1; }
  echo "  $key: HEAD's file is its parts' assembly ($(echo $got | cut -c1-12))"; PROVED="$PROVED $key:$got"
done
EFILES="src package.json build.py wrap.py shell.html fixturetest.mjs tools/patchthree.mjs"
if ! git diff --quiet HEAD -- $EFILES assets; then echo "relbuild: files on disk differ from HEAD:"; git diff --stat HEAD -- $EFILES assets | tail -8; exit 3; fi
U=$(git ls-files --others --exclude-standard -- src | head -5)
[ -z "$U" ] || { echo "relbuild: untracked files under src/ (they would be built):"; echo "$U"; exit 3; }
echo "  the engine, every chapter and every asset on disk are HEAD's"
[ "$CHECK" = "--check" ] && { echo "relbuild: --check passed (no build)"; exit 0; }
LOG="$W/build.log"
ENC_NOZIP=1 npm run build > "$LOG" 2>&1 || { echo "relbuild: BUILD FAILED"; tail -30 "$LOG"; exit 1; }
tail -2 "$LOG"
rm -rf "$snap" && cp -al dist "$snap" || exit 1
for p in $PROVED; do key=${p%%:*}; want=${p#*:}
  f=$(ls "$snap/assets/" | grep -E "^$key\.[0-9a-f]+\.js$" | head -1)
  [ -n "$f" ] || { echo "relbuild: PROOF FAILED: no $key in the build"; exit 1; }
  got=$(sha1sum "$snap/assets/$f" | cut -c1-40)
  [ "$got" = "$want" ] || { echo "relbuild: PROOF FAILED: $key built $got, HEAD has $want"; exit 1; }
done
echo "relbuild: PROOF: built from HEAD $H; generated chapters proved:$(for p in $PROVED; do printf ' %s' "${p%%:*}"; done); snapshot $snap ($(du -sh "$snap" | cut -f1))"
