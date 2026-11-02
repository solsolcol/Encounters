"""v24.34 · a loop padded for the engine's insets. loopVol() plays a bed from 0.06 s and loops it over [0.06, duration -
0.06] (LEARNINGS: "mp3 decoding pads both ends with silence"). Measured at v24.34 in the suite's Chromium, it does not:
an mp3 from ffmpeg's libmp3lame (its LAME tag) and an Ogg Opus both decode to their exact length, a click at 1.000 s
landing at 1.000 s — so the insets cut 60 ms of real sound from each end and the seam jumps 120 ms. A music loop cannot
afford that (a phrase stutters, a waveform steps), so its file is the loop L extended circularly by 0.06 s each side:
[L's last 0.06 s] + L + [L's first 0.06 s]. The engine's loop region is then exactly one period of L. Usage: padloop.py in.wav out.wav"""
import subprocess, sys, numpy as np
sr = 48000; P = int(0.06 * sr)
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-f', 'f32le', '-ac', '2', '-ar', str(sr), '-'], capture_output=True)
x = np.frombuffer(r.stdout, np.float32).reshape(-1, 2)
y = np.concatenate([x[-P:], x, x[:P]])
y.tofile(sys.argv[2] + '.f32')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '2', '-i', sys.argv[2] + '.f32', sys.argv[2]], check=True)
import os; os.remove(sys.argv[2] + '.f32')
# the seam the engine plays: the sample at the region's end and the one at its start are neighbours in L
a, b = y[len(y) - P - 1], y[P]
print(f'{sys.argv[2]}: loop {len(x)/sr:.2f} s, file {len(y)/sr:.2f} s; the engine wraps from L[-1] to L[0]: step {20*np.log10(np.abs(a - b).max() + 1e-12):.1f} dBFS')
