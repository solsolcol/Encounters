#!/bin/sh
# v27.0 · every person's and spirit's takes (17 Nov 2026): each the library set it wears (243 Idle_3, 47 Listening_Gesture,
# 56 Stand_and_Chat, 313/314 talking, 307 Sitting_Answering_Questions: v26.0's verdicts, docs/V26.0-E4C3-BUILD.md §5),
# then its text-to-motion clips (masters/v27.0/people/MOTIONS.txt). Meshy keeps a motion three days: every clip a body
# will ever wear is laid on now.
cd "$(dirname "$0")/../.."
person() {  # name, lib ids ('-' for none), t2m clips...
  n=$1; ids=$2; shift 2
  [ "$ids" = - ] || [ -f masters/v27.0/src/takes-$n-lib.glb ] || sh masters/v27.0/takes.sh $n lib lib $ids
  need=""; for c in "$@"; do [ -f masters/v27.0/src/takes-$n-$c.glb ] || need="$need $c"; done
  [ -z "$need" ] || sh masters/v27.0/takes.sh $n t2m $need
  echo "$n done"
}
( person amma 307 wsit wturn trance rise steps lamp ) &
( person ravi 243,47,56,313 rush kneelhold struggle; person appa 243 aturn ) &
( person mala 243,47,56,314 kneelhold scream lightlamp; person large - lumber ) &
( person oppress - cling oturn claw cry torn; person wander - crawl creep ) &
wait
echo ALL TAKES DONE
