#!/bin/sh
# CH4's round on the release snapshot, one browser at a time through bslot, in the coordinator's order
S=/tmp/claude-0/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293/scratchpad
SNAP0=${SNAP:-$S/e4c5/snap-d24}
R=${ROUND:-$S/ch4/round}; mkdir -p $R
cd /home/user/Encounters || exit 2
export CHROMIUM_PATH=/opt/pw-browsers/chromium
run() { name=$1; snap=$2; shift 2; echo "$(date +%H:%M:%S) START $name on $snap" >> $R/progress.log
  ENC_DIST=$snap sh tools/bslot.sh "$@" > $R/$name.log 2>&1; ec=$?
  echo "$(date +%H:%M:%S) END $name EXIT $ec" >> $R/progress.log; }
for step in ${STEPS:-fixture walk retry restart button buttondesk entry controls controlsold}; do
  case $step in
    fixture)     run fixture $SNAP0 node fixturetest.mjs ;;
    walk)        run walk $SNAP0 env WALK_ONLY=e4c4 node walktest.mjs ;;
    retry)       run retry $SNAP0 env MODE=retry OUT=$R/retry node tools/probes/e4c4retry.mjs ;;
    restart)     run restart $SNAP0 env MODE=restart OUT=$R/restart node tools/probes/e4c4retry.mjs ;;
    button)      run button $SNAP0 env MODE=button OUT=$R/button node tools/probes/e4c4retry.mjs ;;
    buttondesk)  run buttondesk $SNAP0 env MODE=button DESK=1 OUT=$R/buttondesk node tools/probes/e4c4retry.mjs ;;
    entry)       run entry $SNAP0 env OUT=$R/entry node tools/probes/e4c4entry.mjs ;;
    controls)    run controls $SNAP0 env OUT=$R/controls node tools/probes/e4c4controls.mjs ;;
    controlsold) run controlsold $S/e4c5/snap-d23 env OUT=$R/controlsold node tools/probes/e4c4controls.mjs ;;
  esac
done
echo "$(date +%H:%M:%S) ROUND DONE" >> $R/progress.log
