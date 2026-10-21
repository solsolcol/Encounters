"""v21.13 · level a bed by its RMS, not its peak (v10.4's loud.py, parametrised): a 3:1 compressor over the crest,
the RMS driven to TARGET, a 5 ms lookahead limiter at CEIL. A bed whose rare transients set its peak (the shrine fan's
loose-blade ticks, 33 dB over its average) comes out of a peak-match far too quiet, or — turned up — with clicks.
usage: python3 level_rms.py in.wav out.wav TARGET_dBFS CEIL_dBFS [THR_dBFS]"""
import subprocess, sys, numpy as np
sr = 48000
inp, outp, TARGET, CEILdb = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
THR = float(sys.argv[5]) if len(sys.argv) > 5 else -30.0
CEIL = 10 ** (CEILdb / 20)
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', inp, '-f', 'f32le', '-ac', '2', '-ar', str(sr), '-'], capture_output=True)
x = np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, 2).astype(np.float64)
def rms(y): return 20 * np.log10(np.sqrt((y ** 2).mean()) + 1e-12)
env = np.abs(x).max(1); a_att = np.exp(-1 / (0.005 * sr)); a_rel = np.exp(-1 / (0.200 * sr)); e = 0.0; g = np.empty(len(x))
thr = 10 ** (THR / 20)
for i, v in enumerate(env):
    e = v + (a_att if v > e else a_rel) * (e - v)
    g[i] = 1.0 if e <= thr else (thr * (e / thr) ** (1 / 3)) / e
x *= g[:, None]
for _ in range(8):
    x *= 10 ** ((TARGET - rms(x)) / 20)
    pk = np.abs(x).max(1)
    win = int(0.005 * sr)
    need = np.minimum(1.0, CEIL / np.maximum(pk, 1e-9))
    lim = np.minimum.reduce([np.roll(need, -k) for k in range(win)])
    a_r = np.exp(-1 / (0.080 * sr)); gg = np.empty(len(x)); cur = 1.0
    for i, n in enumerate(lim):
        cur = n if n < cur else n + a_r * (cur - n)
        gg[i] = cur
    x *= gg[:, None]
    if abs(rms(x) - TARGET) < 0.1 and np.abs(x).max() <= CEIL + 1e-6: break
print('%s: RMS %.2f dBFS  peak %.2f dBFS' % (outp, rms(x), 20 * np.log10(np.abs(x).max())))
x.astype(np.float32).tofile(outp + '.f32')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '2', '-i', outp + '.f32', outp], check=True)
