#!/bin/sh
# Clear a build copy ONLY if no running process names it (in its environment or its command line), this script excepted.
# usage: sh rmcopy.sh <dir>   (exit 3, nothing removed, when it is in use)
d="$1"; [ -n "$d" ] && [ -d "$d" ] || { echo "no such dir: $d"; exit 2; }
me=$$; users=""
for p in $(ls /proc | grep -E '^[0-9]+$'); do
  [ "$p" = "$me" ] && continue; [ "$p" = "$PPID" ] && continue
  if { tr '\0' '\n' < /proc/$p/environ; } 2>/dev/null | grep -qF "$d"; then users="$users $p"; continue; fi
  if { tr '\0' ' ' < /proc/$p/cmdline; } 2>/dev/null | grep -v "rmcopy.sh" | grep -qF "$d"; then users="$users $p"; fi
done
if [ -n "$users" ]; then echo "IN USE by:$users -- not removed"; exit 3; fi
rm -rf "$d" && echo "removed $d"
