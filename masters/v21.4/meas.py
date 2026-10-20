"""v21.4 · measures for picking the medium's deity tongue without ears.
Per take: length, where the voice starts and stops (20 ms frames over 6 % of
the peak), the pauses inside it, the head/tail level (a take that ends ON
signal clicks), RMS and peak. The roar film wants it SHORT — the old take was
4.05 s, and the assistant's "Stand back!" comes 4.3 s after its cue.
Usage: python3 meas.py raw/*.mp3"""
import subprocess, numpy as np, sys, os
def load(p, sr=48000):
    b = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', p, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.float32).copy(), sr
def db(v): return 20 * np.log10(max(v, 1e-9))
for p in sys.argv[1:]:
    x, sr = load(p); hop = int(0.02 * sr)
    e = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x) - hop, hop)])
    on = e > max(e.max() * 0.06, 1e-4)
    segs = []; cur = None
    for i, v in enumerate(on):
        if v and cur is None: cur = i
        if not v and cur is not None: segs.append((cur, i)); cur = None
    if cur is not None: segs.append((cur, len(on)))
    m = []
    for s in segs:
        if m and (s[0] - m[-1][1]) * 0.02 < 0.12: m[-1] = (m[-1][0], s[1])
        else: m.append(s)
    gaps = [round((m[i + 1][0] - m[i][1]) * 0.02, 2) for i in range(len(m) - 1)]
    t0 = m[0][0] * 0.02 if m else 0; t1 = m[-1][1] * 0.02 if m else 0
    head = db(np.sqrt(np.mean(x[:int(0.05 * sr)] ** 2))); tail = db(np.sqrt(np.mean(x[-int(0.05 * sr):] ** 2)))
    print(f"{os.path.basename(p):14s} {len(x)/sr:5.2f}s  voice {t0:4.2f}-{t1:4.2f} ({t1-t0:4.2f}s)  segs {len(m):2d} gaps {gaps}  "
          f"head {head:6.1f} tail {tail:6.1f}  rms {db(np.sqrt(np.mean(x**2))):5.1f} pk {db(np.abs(x).max()):5.1f}")
