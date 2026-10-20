"""v21.2 · the radio's Thai music as a LOOP. The music model writes a whole
piece — an intro, a body, a fade — and has no loop flag (v9.2's law), so the
loop is cut from the body: the window whose 1 s RMS is FLATTEST (a bed that
swells and dies inside its loop is one the player learns to read — v9.7),
skipping the intro and the fade, and its END is placed where what follows it
in the take sounds most like the window's HEAD (the onset envelope's
correlation, searched ±2 s) — so the 2 s crossfade joins like with like, in
step, instead of smearing two unrelated bars. Writes w_<name>.wav.
Usage: python3 musicloop.py raw/take.mp3 [seconds=50] [start]"""
import numpy as np, subprocess, sys, os
SRC = sys.argv[1]; L0 = float(sys.argv[2]) if len(sys.argv) > 2 else 50.0
FORCE = float(sys.argv[3]) if len(sys.argv) > 3 else None
sr = 48000
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-f', 'f32le', '-ac', '2', '-ar', str(sr), '-'], capture_output=True)
x = np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, 2).copy()
m = x.mean(axis=1); n = len(m) // sr
db1 = np.array([20 * np.log10(np.sqrt((m[i * sr:(i + 1) * sr] ** 2).mean()) + 1e-9) for i in range(n)])
# the body: from the first second within 6 dB of the median to the last
med = np.median(db1); live = np.where(db1 > med - 6)[0]; b0, b1 = live[0] + 2, live[-1] - 2
W = int(L0) + 3
best = None
for s0 in range(b0, max(b0 + 1, b1 - W)):
    seg = db1[s0:s0 + W]; score = seg.std()
    if best is None or score < best[0]: best = (score, s0)
s0 = FORCE if FORCE is not None else best[1]
# the onset envelope (10 ms hops) to place the end
hop = sr // 100
def env(a, b):
    seg = m[int(a * sr):int(b * sr)]
    e = np.array([np.sqrt((seg[i:i + hop] ** 2).mean()) for i in range(0, len(seg) - hop, hop)])
    d = np.maximum(np.diff(e, prepend=e[0]), 0)
    return (d - d.mean()) / (d.std() + 1e-9)
head = env(s0, s0 + 4.0)
cands = []
for k in range(-200, 201, 1):                       # ±2 s in 10 ms steps
    e = s0 + L0 + k / 100
    if e + 4.0 > len(m) / sr - 0.5: continue
    tail = env(e, e + 4.0); nn = min(len(head), len(tail))
    cands.append((float(np.dot(head[:nn], tail[:nn]) / nn), e))
cc, e1 = max(cands)
XF = int(2.0 * sr); a, b = int(s0 * sr), int(e1 * sr)
body = x[a:b + XF].copy(); L = b - a
w = np.linspace(0, 1, XF)[:, None]
out = body[:L].copy()
out[:XF] = body[:XF] * w + body[L:L + XF] * (1 - w)    # the tail's continuation fades out over the head fading in
out = np.clip(out, -1, 1)
jump = 20 * np.log10(np.abs(out[0] - out[-1]).max() + 1e-12)
seg = db1[int(s0):int(e1)]
name = os.path.splitext(os.path.basename(SRC))[0]
print(f"{name:16s} window {s0:5.1f}-{e1:5.1f} s ({L/sr:4.1f} s)  1s rms std {seg.std():4.2f} dB  mean {seg.mean():5.1f}  "
      f"min {seg.min():5.1f}  head~tail {cc:+.2f}  joint {jump:5.1f} dBFS")
out.astype(np.float32).tofile(f'w_{name}.f32')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '2', '-i', f'w_{name}.f32', f'w_{name}.wav'], check=True)
os.remove(f'w_{name}.f32')
