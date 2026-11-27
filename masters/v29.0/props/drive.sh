#!/bin/sh
# v29.0 · the things made in the NEW list's order: for each, the room and the credits read first (stop under 700 MB free,
# or when a remesh would take Meshy under the reserve: 60 + whatever of CAST's 150 it has not spent yet), then prop.sh.
cd "$(dirname "$0")/../../.."
for n in "$@"; do
  free=$(df -m / | awk 'NR==2{print $4}')
  [ "$free" -lt 700 ] && { echo "STOP: $free MB free before $n"; exit 3; }
  ok=$(python3 -I - "$n" <<'P'
import json, subprocess, sys, ast
bal = ast.literal_eval(subprocess.check_output(['python3', '-I', 'masters/v29.0/props/meshy.py', 'balance']).decode())['balance']
L = json.load(open('masters/v29.0/src/props/jobs.json'))
mine = sum(40 for k, v in L.items() if v.get('image_to_3d')) + sum(5 * len(v.get('remesh', {})) for v in L.values())
cast = max(0, 1077 - bal - mine)
reserve = 60 + max(0, 150 - cast)
print('ok' if bal - 5 >= reserve else 'stop', bal, mine, cast, reserve)
P
)
  echo "$n: $ok ($free MB free)"
  case $ok in ok*) sh masters/v29.0/props/prop.sh "$n";; *) echo "STOP: credits"; exit 4;; esac
done
echo DRIVE DONE
