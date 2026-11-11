#!/bin/sh
# v26.0 · every person's takes (11 Nov 2026), four people at a time; each: the library set, then the text-to-motion
# clips (Meshy keeps a motion three days: every clip a person will ever wear is laid on now).
cd "$(dirname "$0")/../.."
person() {  # name, lib ids, t2m clips...
  n=$1; ids=$2; shift 2
  [ -f masters/v26.0/src/takes-$n-lib.glb ] || sh masters/v26.0/takes.sh $n lib lib $ids
  need=""; for c in "$@"; do [ -f masters/v26.0/src/takes-$n-$c.glb ] || need="$need $c"; done
  [ -z "$need" ] || sh masters/v26.0/takes.sh $n t2m $need
  echo "$n done"
}
( person deva 243,363,56 seiza prostrate offer sway armsopen; person devb 243,363,56 seiza prostrate offer; person deve 243,363,56 seiza prostrate offer ) &
( person devf 243,363,56 seiza prostrate offer sway armsopen; person devc 243,363,56 seiza prostrate offer sway armsopen; person devd 243,363,56 seiza prostrate offer ) &
( person devg 243,363,56 seiza prostrate offer sway armsopen trance2; person devh 243,363,56 seiza prostrate offer; person bench 243,56,1,32 give seiza prostrate ) &
( person hermita 307,33,243,57 handson petals palmover; person hermitb 307,33,243,57 handson petals palmover; person red 307,33,243,57 handson petals palmover; person white 307,33,243,57 handson petals palmover; person dancerb 243 dance1 dance2; person dancera 243 ) &
wait
echo ALL TAKES DONE
