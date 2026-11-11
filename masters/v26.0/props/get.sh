#!/bin/sh
# v26.0 · fetch finished reference pictures into refs/<name>-2k.png:
#   HF_BASE=<the folder the service serves this account's results from> sh get.sh name:hf_<stamp>_<job>.png ...
# The folder's address names the account, so it is given on the command line and never written here (the repository
# is public). It is the part of a result's address before its file name, as jobs_wait returns it.
cd "$(dirname "$0")"
[ -n "$HF_BASE" ] || { echo "set HF_BASE (see the note above)"; exit 2; }
for a in "$@"; do n=${a%%:*}; f=${a#*:}; curl -sS -f -o refs/$n-2k.png "$HF_BASE/$f" && echo "$n $(stat -c %s refs/$n-2k.png)"; done
