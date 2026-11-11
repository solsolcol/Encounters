#!/bin/bash
# v25.3 · the pose lab restarted on the chapter AS ASSEMBLED NOW (no build): the last dist/ hard-linked into a snapshot,
# episode 4 chapter 2's file in it replaced by src/chapters/e4/e4c2.js with two scratch handles added (never shipped):
#   window.__lc  = { LCM, LCS, HS, body(o), HINGE, FORE_ROLL, cast, props,    his body's measures, state and lcBody;
#                    PIECE_FIT, PGLOW, pieceLit, play }                       the piece on the shelf and its glow (v25.4)
#   window.__lc2 = { VW, SW, OPEN, CALL, EXAM, CLEARF, VISIT_T, END, CODA, SECS, aura, lapPoint,    the films' bows, their timelines, (v25.5) the aura's strengths,
#                    EX_WR, EXH, D_END }                                                          the examination's wrist point and its hold, ending D's last look on a phone (mutable: a job can try another)
#   LABDIR=<dir> SNAP=<dir> ... poselab.sh @intro    (v25.5) stays INSIDE the opening film (seek it; skip it to go on to play)
# so a job can pose him (window.__lc.body({ R: { wai: 'brow' }, L: { wai: 'brow' }, lean: 0.16, neck: 0.14 })) and change a
# measure (window.__lc.LCM.wai.press = 0.035) and photograph it within seconds.
#   LABDIR=<dir> SNAP=<dir> CHROMIUM_PATH=... tools/probes/poselab.sh [phase]      (phase: a PLAY phase, default clearing:k,b)
# Run it on its own: its pkill would kill a shell whose own command line names the lab's script.
set -e
: "${LABDIR:?LABDIR is not set}"; : "${SNAP:?SNAP is not set}"
cd "$(dirname "$0")/../.."
mkdir -p "$LABDIR/jobs" "$LABDIR/out"
echo '{"quit":true}' > "$LABDIR/jobs/0-quit.json"; sleep 1.5; pkill -f 'poselab[.]mjs' 2>/dev/null || true; sleep 0.5; rm -f "$LABDIR"/jobs/*.json
[ -d "$SNAP" ] || cp -al dist "$SNAP"
CHF=$(ls "$SNAP"/assets/e4c2.*.js | head -1)
rm -f "$CHF"                                    # a hard link: taken away, never written through (dist/ keeps its file)
python3 -I - "$CHF" <<'PY'
import sys
s = open('src/chapters/e4/e4c2.js').read()
a = "    const LCS = { on: false, R: null, L: null, lean: 0, twist: 0, side: 0, neck: 0, holdBy: 'R', holdAt: null };\n"
assert s.count(a) == 1, 'LCS line moved'
s = s.replace(a, a + "    window.__lc = { LCM, LCS, get HS() { return HS; }, body: (o) => lcBody(o), HINGE, FORE_ROLL, get cast() { return cast; }, get props() { return props; }, PIECE_FIT, PGLOW, pieceLit, get play() { return play; } };\n")
b = "    const VW = { lean:"
assert s.count(b) == 1, 'VW line moved'
i = s.index(b); j = s.index('\n', i) + 1
s = s[:j] + "    window.__lc2 = { VW, SW, OPEN, CALL, EXAM, CLEARF, VISIT_T, END, CODA, SECS, get aura() { return AURA_K; }, lapPoint: (a, d) => lapPoint(a, d), get EX_WR() { return EX_WR; }, get EXH() { return EXH; }, get D_END() { return D_END; } };\n" + s[j:]
open(sys.argv[1], 'w').write(s)
PY
rm -f "$LABDIR/READY"
(LABDIR="$LABDIR" ENC_DIST="$SNAP" PHASE="${1:-clearing:k,b}" nohup node tools/probes/poselab.mjs > "$LABDIR/lab.out" 2>&1 &)
until [ -f "$LABDIR/READY" ] || ! pgrep -f 'poselab[.]mjs' >/dev/null; do sleep 5; done
tail -1 "$LABDIR/lab.log"; tail -2 "$LABDIR/lab.out"
