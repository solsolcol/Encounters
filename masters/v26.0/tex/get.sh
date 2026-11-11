#!/bin/sh
# v26.0 · fetch finished surface pictures into tex/src/<name>.png:
#   HF_BASE=<the folder the service serves this account's results from> sh get.sh name:hf_<stamp>_<job>.png ...
# (the folder's address names the account: given on the command line, never written here; the repository is public)
cd "$(dirname "$0")"
[ -n "$HF_BASE" ] || { echo "set HF_BASE"; exit 2; }
for a in "$@"; do n=${a%%:*}; f=${a#*:}; curl -sS -f -o src/$n.png "$HF_BASE/$f" && echo "$n $(stat -c %s src/$n.png)"; done
