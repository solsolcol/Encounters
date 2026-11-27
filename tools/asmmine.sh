#!/bin/sh
# asmmine.sh <masters-folder> <out-file> [<part-path>...]   (v29.0) A GENERATED CHAPTER FOR ONE HELPER'S OWN TESTS:
# assembled from HEAD's assembler, parts and script (and HEAD's copies of the chapters it copies from), with THE
# CALLER'S OWN part files laid over them exactly as they stand on disk (paths from the repo root; a part that HEAD does
# not have yet is added). So each helper tests its own work against everyone else's COMMITTED work, never against
# another helper's half-done edits on disk. Nothing in the tree is written: the chapter goes to <out-file> (absolute).
# Then build and test it apart from the tree:
#   sh tools/asmmine.sh masters/v29.0 /abs/scratch/e5c1.js masters/v29.0/parts/c_play.js masters/v29.0/parts/d_play.js
#   ENC_CHAPTER_FROM="e5c1=/abs/scratch/e5c1.js" sh tools/buildlock.sh /abs/scratch/snap
#   ENC_DIST=/abs/scratch/snap node <harness or probe>
# (tools/asmhead.sh is the coordinator's: HEAD's parts only, written over the chapter file for a commit.)
asm=$1; out=$2; [ -n "$asm" ] && [ -n "$out" ] || { echo "asmmine: give the masters folder and the out file"; exit 2; }
case "$out" in /*) ;; *) echo "asmmine: the out file must be an absolute path"; exit 2 ;; esac
shift 2
ROOT=$(cd "$(dirname "$0")/.." && pwd) || exit 2
cd "$ROOT" || exit 2
T=$(mktemp -d "${TMPDIR:-/tmp}/asmmine.XXXXXX") || exit 2
P="$asm/assemble.py $asm/parts src/chapters"
git cat-file -e "HEAD:$asm/script" 2>/dev/null && P="$P $asm/script"
git archive --format=tar HEAD -- $P | tar -x -C "$T" || { echo "asmmine: git archive failed"; rm -rf "$T"; exit 2; }
for f in "$@"; do
  case "$f" in "$asm"/parts/*.js) ;; *) echo "asmmine: $f is not a part of $asm"; rm -rf "$T"; exit 2 ;; esac
  [ -f "$f" ] || { echo "asmmine: $f is not on disk"; rm -rf "$T"; exit 2; }
  cp "$f" "$T/$f" || { rm -rf "$T"; exit 1; }
done
ln -s "$ROOT/assets" "$T/assets"; ln -s "$ROOT/tools" "$T/tools"; [ -d "$ROOT/node_modules" ] && ln -s "$ROOT/node_modules" "$T/node_modules"
python3 -I "$T/$asm/assemble.py" --out "$out" > "$T/assemble.log" 2>&1 || { echo "asmmine: the parts do not assemble"; tail -8 "$T/assemble.log"; rm -rf "$T"; exit 1; }
node --check "$out" || { echo "asmmine: $out does not parse"; rm -rf "$T"; exit 1; }
echo "asmmine: $out is HEAD $(git rev-parse --short HEAD)'s parts$( [ $# -gt 0 ] && printf ' with %s laid over them' "$*") ($(sha1sum "$out" | cut -c1-12))"
rm -rf "$T"
