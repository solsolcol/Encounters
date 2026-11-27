#!/bin/sh
# asmhead.sh <masters-folder> <chapter-file>   (v29.0) a generated chapter ASSEMBLED FROM WHAT IS COMMITTED ONLY, into the
# tree, ready to commit. Several helpers edit a chapter's parts in one tree at once; the chapter file must never carry a
# part that is not committed (tools/relbuild.sh refuses a release whose chapter file is not its committed parts'
# assembly). So the coordinator, at each integration, runs this: HEAD's assembler, parts and script (and HEAD's copies of
# the chapters it copies from) are assembled apart from the tree, the result is written over <chapter-file>, and the
# caller then runs chaptertest and commits that one file. A part still being edited on disk is left out by construction.
#   sh tools/asmhead.sh masters/v29.0 src/chapters/e5/e5c1.js
asm=$1; ch=$2; [ -n "$asm" ] && [ -n "$ch" ] || { echo "asmhead: give the masters folder and the chapter file"; exit 2; }
ROOT=$(cd "$(dirname "$0")/.." && pwd) || exit 2
cd "$ROOT" || exit 2
T=$(mktemp -d "${TMPDIR:-/tmp}/asmhead.XXXXXX") || exit 2
P="$asm/assemble.py $asm/parts src/chapters"
git cat-file -e "HEAD:$asm/script" 2>/dev/null && P="$P $asm/script"
git archive --format=tar HEAD -- $P | tar -x -C "$T" || { echo "asmhead: git archive failed"; rm -rf "$T"; exit 2; }
ln -s "$ROOT/assets" "$T/assets"; ln -s "$ROOT/tools" "$T/tools"; [ -d "$ROOT/node_modules" ] && ln -s "$ROOT/node_modules" "$T/node_modules"
python3 -I "$T/$asm/assemble.py" > "$T/assemble.log" 2>&1 || { echo "asmhead: HEAD's parts do not assemble"; tail -8 "$T/assemble.log"; rm -rf "$T"; exit 1; }
cp "$T/$ch" "$ch" || { rm -rf "$T"; exit 1; }
tail -1 "$T/assemble.log" | cut -c1-160
echo "asmhead: $ch is HEAD $(git rev-parse --short HEAD)'s assembly ($(sha1sum "$ch" | cut -c1-12)); now chaptertest, then commit it"
rm -rf "$T"
