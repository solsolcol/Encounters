#!/bin/sh
# v26.0 · a generated sound fetched into sound/raw/:  sh masters/v26.0/sound/get.sh <name> <a|b|c|d> "<url>" [...]
# The url is a signed address: it is given here on the command line only and is written nowhere.
cd "$(dirname "$0")/raw" || exit 1
while [ $# -ge 3 ]; do
  k=$1; l=$2; u=$3; shift 3
  case "$k" in *[!A-Za-z0-9]*) echo "REFUSED name $k"; continue;; esac
  case "$l" in a|b|c|d) ;; *) echo "REFUSED letter $l"; continue;; esac
  if curl -sS -f --retry 3 --retry-delay 2 -o "${k}_${l}.part" "$u"; then mv "${k}_${l}.part" "${k}_${l}.mp3"; echo "ok ${k}_${l}.mp3 $(stat -c %s "${k}_${l}.mp3") bytes"
  else rm -f "${k}_${l}.part"; echo "FAILED ${k}_${l}"; fi
done
