# v10.7 · level the dread loop by RMS, not peak (a drone's rare creaks set its
# peak, so the -6 dBFS peak-match of v10.4-v10.6 left it averaging -21 dBFS).
# Reads w_loop.wav (mk.py), writes w_loud.wav: a gentle compressor over the
# crest, a real lookahead peak limiter at CEIL (ffmpeg's alimiter would not cap
# — its output peaked at -0.9 dBFS whatever `limit` said), and the RMS driven
# to TARGET by iteration. make2.sh encodes w_loud.wav plain, no peak-matching.
import subprocess, numpy as np
sr = 48000; TARGET = -15.0; CEIL = 10 ** (-3.0 / 20)
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', 'w_loop.wav', '-f', 'f32le', '-ac', '2', '-ar', str(sr), '-'], capture_output=True)
x = np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, 2).astype(np.float64)
def rms(y): return 20 * np.log10(np.sqrt((y ** 2).mean()) + 1e-12)
# 1. compressor on the crest: 3:1 over -26 dBFS on a 30 ms / 500 ms envelope
env = np.abs(x).max(1); a_att = np.exp(-1 / (0.030 * sr)); a_rel = np.exp(-1 / (0.500 * sr)); e = 0.0; g = np.empty(len(x))
thr = 10 ** (-26 / 20)
for i, v in enumerate(env):
    e = v + (a_att if v > e else a_rel) * (e - v)
    g[i] = 1.0 if e <= thr else (thr * (e / thr) ** (1 / 3)) / e
x *= g[:, None]
# 2. RMS to target, then a lookahead limiter at CEIL; repeat until both hold
for _ in range(6):
    x *= 10 ** ((TARGET - rms(x)) / 20)
    pk = np.abs(x).max(1)
    win = int(0.005 * sr)                                    # 5 ms lookahead
    need = np.minimum(1.0, CEIL / np.maximum(pk, 1e-9))
    lim = np.minimum.reduce([np.roll(need, -k) for k in range(win)])   # gain must be down BEFORE the peak
    a_rel = np.exp(-1 / (0.080 * sr)); gg = np.empty(len(x)); cur = 1.0
    for i, n in enumerate(lim):
        cur = n if n < cur else n + a_rel * (cur - n)
        gg[i] = cur
    x *= gg[:, None]
    if abs(rms(x) - TARGET) < 0.1 and np.abs(x).max() <= CEIL + 1e-6: break
print('w_loud: RMS %.2f dBFS  peak %.2f dBFS' % (rms(x), 20 * np.log10(np.abs(x).max())))
x.astype(np.float32).tofile('w_loud.f32')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '2', '-i', 'w_loud.f32', 'w_loud.wav'], check=True)
