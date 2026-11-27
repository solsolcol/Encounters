#!/bin/sh
# bslot.sh <command...>   (v28.0) run a command that opens a BROWSER while holding one of this machine's two browser
# slots (CLAUDE.md, efficiency rule 4: at most two browsers at once; five made spurious failures). Waits for a slot.
# Every helper and every probe started while others work goes through it:   sh tools/bslot.sh node tools/shootclose.mjs a.json out
# (v29.0, 27 Nov 2026: IN TURN. Five helpers shared the two slots, and a waiter that polled faster always won: one probe
# waited 28 minutes and more. Now each caller takes a numbered ticket, and only the oldest ticket whose caller is still
# alive may take a free slot: first asked, first served. A ticket whose caller died is dropped by the next waiter. Run one
# probe per call, never a chain of probes under one call, and never a private waiter of your own on the slots' locks.)
Q=/tmp/encounters-browser-queue
mkdir -p "$Q"
exec 6>"$Q/.lock"
flock 6; n=$(cat "$Q/.next" 2>/dev/null || echo 0); echo $((n + 1)) > "$Q/.next"; flock -u 6
t=$(printf '%09d' "$n"); echo $$ > "$Q/$t"
trap 'rm -f "$Q/$t"' EXIT
trap 'rm -f "$Q/$t"; exit 130' INT TERM
while :; do
  head=""
  for f in $(ls "$Q" 2>/dev/null | sort); do
    p=$(cat "$Q/$f" 2>/dev/null)
    if [ -n "$p" ] && kill -0 "$p" 2>/dev/null; then head=$f; break; fi
    rm -f "$Q/$f"
  done
  if [ "$head" = "$t" ]; then
    for k in 1 2; do
      exec 9>"/tmp/encounters-browser-slot-$k.lock"
      if flock -n 9; then rm -f "$Q/$t"; "$@"; exit $?; fi
    done
  fi
  sleep 1
done
