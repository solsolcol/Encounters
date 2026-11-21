#!/bin/sh
# bslot.sh <command...>   (v28.0) run a command that opens a BROWSER while holding one of this machine's two browser
# slots (CLAUDE.md, efficiency rule 4: at most two browsers at once; five made spurious failures). Waits for a slot.
# Every helper and every probe started while others work goes through it:   sh tools/bslot.sh node tools/shootclose.mjs a.json out
while :; do
  for n in 1 2; do
    exec 9>"/tmp/encounters-browser-slot-$n.lock"
    if flock -n 9; then "$@"; exit $?; fi
  done
  sleep 3
done
