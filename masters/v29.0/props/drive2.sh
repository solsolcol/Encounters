#!/bin/sh
# v29.0 THINGS-2 · the waiting remeshes in the coordinator's order of need (27 Nov 05:45: Meshy shared with Grace's and
# Marcus's new bodies; the props seen closest first), each only while the balance after it stays at or over RESERVE
# (60, plus Grace's new body (56) while it is unpaid: 116 by default). Room read as drive.sh reads it.
cd "$(dirname "$0")/../../.."
RES=${RESERVE:-116}
for n in "$@"; do
  free=$(df -m / | awk 'NR==2{print $4}'); [ "$free" -lt 700 ] && { echo "STOP: $free MB free before $n"; exit 3; }
  bal=$(python3 -I masters/v29.0/props/meshy.py balance | python3 -I -c "import sys,ast;print(ast.literal_eval(sys.stdin.read())['balance'])")
  if [ $((bal - 5)) -lt "$RES" ]; then echo "WAITING (credits: $bal, reserve $RES): $n and after"; exit 4; fi
  echo "$n: balance $bal ($free MB free)"; sh masters/v29.0/props/prop.sh "$n"
done
echo DRIVE2 DONE
