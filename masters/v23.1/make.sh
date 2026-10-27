#!/bin/sh
# v23.1 · Chad, on episode 3 chapter 4: "When the player tries the taowesuwan, have the floor shaking effect shake even
# more, and the stomping sound effects made louder." The Thao Wessuwan's step is the same take (x4step c) through the
# same chain as v22.0 (masters/v22.0/cp8/make.sh: phone.py, drive 6, mix 0.78, a 0.3 s fade), then raised by its AVERAGE
# with its peak held under a 5 ms lookahead limiter (louder.py) — a gain over 1 on the cue would clip once it sums with
# the giant's breath and the rattle beside it — and encoded as it is, each encoder's output measured (the v9.7 law).
# Run from the repo root.
set -e
S=masters/v22.0/cp8
W=masters/v23.1
( cd $S && python3 phone.py raw/x4step_c.mp3 ../../v23.1/w_x4step.wav --drive 6 --mix 0.78 --fadeout 0.3 )
python3 $W/louder.py $W/w_x4step.wav $W/l_x4step.wav -23.5 -2.0
ffmpeg -v error -y -i $W/l_x4step.wav -ac 1 -map_metadata -1 -c:a libmp3lame -b:a 128k -ar 44100 assets/audio/x4step.mp3
ffmpeg -v error -y -i $W/l_x4step.wav -ac 1 -map_metadata -1 -c:a libopus -b:a 64k -ar 48000 assets/audio-opus/x4step.ogg
for f in assets/audio/x4step.mp3 assets/audio-opus/x4step.ogg; do
  python3 - "$f" <<'PY'
import subprocess, sys, numpy as np
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-f', 'f32le', '-ac', '1', '-ar', '48000', '-'], capture_output=True, check=True)
x = np.frombuffer(r.stdout, dtype=np.float32).astype(np.float64)
print('%s  RMS %.2f dBFS  peak %.2f dBFS' % (sys.argv[1], 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-12), 20 * np.log10(np.abs(x).max() + 1e-12)))
PY
done
rm -f $W/w_x4step.wav $W/l_x4step.wav
