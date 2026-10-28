"""v24.5 (R1-2) · a loop made to be played by the ENGINE: the engine starts every bed 60 ms in and loops
[0.06, d - 0.06] (main.js loopVol — the inset hides the silence an mp3 decode pads onto both ends), so a loop built to
join at 0/d (loopfast's crossfade, synth.py's exact loops) joined somewhere else: 60 ms of its tail and 60 ms of its head
were never heard, and the jump between them was a click (k5decide, every 34 s) or a dropped beat (k5heart). This lays 60 ms
of the loop's OWN wrap on both ends — its last 60 ms before it, its first 60 ms after it — so the window the engine plays
is exactly the loop as built, sample for sample (the Opus packs decode sample-exact: the pre-skip is trimmed).
usage: python3 padloop.py in.wav out.wav [ms=60]"""
import subprocess, sys, numpy as np
sr = 48000
inp, outp = sys.argv[1], sys.argv[2]
ms = float(sys.argv[3]) if len(sys.argv) > 3 else 60.0
r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=channels', '-of', 'csv=p=0', inp], capture_output=True, text=True)
ch = max(1, int((r.stdout.strip().split('\n')[0] or '1')))
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', inp, '-f', 'f32le', '-ac', str(ch), '-ar', str(sr), '-'], capture_output=True)
x = np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, ch)
P = int(round(ms / 1000 * sr))
y = np.concatenate([x[-P:], x, x[:P]])
# the engine's window [P, P + len(x)) must be the loop itself, and its joint continuous: y[P + len(x) - 1] -> y[P]
assert np.array_equal(y[P:P + len(x)], x)
step = float(np.abs(y[P + len(x) - 1] - y[P]).max())
y.astype(np.float32).tofile(outp + '.f32')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', str(ch), '-i', outp + '.f32', outp], check=True)
subprocess.run(['rm', '-f', outp + '.f32'])
print(f'{outp}: {len(x) / sr:.3f} s loop + {ms:.0f} ms of its own wrap each end; the joint the engine plays steps {step:.4f} (the built joint)')
