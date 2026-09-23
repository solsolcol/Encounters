# v14.5 · e5march — the episode's opening march (v10.4 master march-1) made into
# a seamless loop for episode 2 chapter 5's apron. The splice point is found by
# matching the onset envelope of the loop's head against every candidate tail
# (beat-aligned by construction), then a 0.25 s equal-power crossfade.
import subprocess, numpy as np, sys
SR = 44100
raw = subprocess.run(['ffmpeg','-v','quiet','-i','../v10.4/raw/march-1.mp3','-ar',str(SR),'-ac','2','-f','f32le','-'],capture_output=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
m = x.mean(1)
hop = 441
env = np.array([np.sqrt((m[i:i+hop]**2).mean()) for i in range(0, len(m)-hop, hop)])
onset = np.maximum(0, np.diff(np.log(env + 1e-6)))
S = int(1.0 * 100)                 # head at 1.0 s (the first second is the take's own lead-in)
W = 400                            # compare 4 s of onset envelope
best = None
for E in range(int(30.0*100), int(37.5*100)):
    if E+W >= len(onset): continue
    a, b = onset[S:S+W], onset[E:E+W]
    c = np.corrcoef(a, b)[0, 1]
    if best is None or c > best[0]: best = (c, E)
c, E = best
print(f"splice: head {S/100:.2f}s  tail {E/100:.2f}s  onset corr {c:.3f}  loop {(E-S)/100:.2f}s")
# refine to the sample with a waveform cross-correlation over +-10 ms
s0, e0 = S*hop, E*hop
seg = m[s0:s0+4410]
bestk, bestv = 0, -1
for k in range(-441, 442):
    v = np.dot(seg, m[e0+k:e0+k+4410])
    if v > bestv: bestv, bestk = v, k
e0 += bestk
XF = int(0.25 * SR)
loop = x[s0:e0].copy()
t = np.linspace(0, np.pi/2, XF)[:, None]
# the tail's last XF samples fade out while the samples just BEFORE the head fade in
loop[-XF:] = x[e0-XF:e0] * np.cos(t) + x[s0-XF:s0] * np.sin(t)
print(f"loop samples {len(loop)}  ({len(loop)/SR:.3f}s)")
# joint check: RMS across the seam (last 50 ms vs first 50 ms)
j = int(0.05*SR)
db = lambda v: 20*np.log10(np.sqrt((v**2).mean())+1e-9)
print(f"seam: tail {db(loop[-j:]):.1f} dBFS  head {db(loop[:j]):.1f} dBFS  body {db(loop):.1f}")
loop.astype(np.float32).tofile('e5march.f32')
