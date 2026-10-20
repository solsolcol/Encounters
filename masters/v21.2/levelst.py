"""v21.2 · level a STEREO bed by RMS with a lookahead peak limiter (the mono
v11.1 level.py's method, both channels at once, one gain for both so the
image holds). Usage: python3 levelst.py in out.wav target_rms_db ceil_db"""
import subprocess, sys, numpy as np
inp, outp, TARGET, CEILDB = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
sr = 48000; CEIL = 10 ** (CEILDB / 20)
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', inp, '-f', 'f32le', '-ac', '2', '-ar', str(sr), '-'], capture_output=True)
x = np.frombuffer(r.stdout, dtype=np.float32).astype(np.float64).reshape(-1, 2)
def rms(y): return 20 * np.log10(np.sqrt((y ** 2).mean()) + 1e-12)
for _ in range(8):
    x *= 10 ** ((TARGET - rms(x)) / 20)
    pk = np.abs(x).max(axis=1); win = int(0.005 * sr)
    need = np.minimum(1.0, CEIL / np.maximum(pk, 1e-9))
    lim = np.minimum.reduce([np.roll(need, -k) for k in range(win)])
    a_rel = np.exp(-1 / (0.080 * sr)); gg = np.empty(len(x)); cur = 1.0
    for i, n in enumerate(lim):
        cur = n if n < cur else n + a_rel * (cur - n); gg[i] = cur
    x *= gg[:, None]
    if abs(rms(x) - TARGET) < 0.1 and np.abs(x).max() <= CEIL + 1e-6: break
print('%s: RMS %.2f dBFS peak %.2f dBFS %.2fs' % (outp, rms(x), 20 * np.log10(np.abs(x).max()), len(x) / sr))
x.astype(np.float32).tofile(outp + '.f32')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '2', '-i', outp + '.f32', outp], check=True)
import os; os.remove(outp + '.f32')
