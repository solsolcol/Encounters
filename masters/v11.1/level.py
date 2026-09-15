# v11.1 · level a VOICE take by RMS for the flat cast bus (Chad: "too soft,
# cant hear him"). Aaron rides a compressor + limiter bus (+3.5 gain); the
# cast is flat, so a whispered take peak-matched to -6.85 dBFS sits ~10 dB
# under him. Mono: mild 3:1 over -22 dB, RMS to TARGET, lookahead limiter at
# CEIL, iterate. Usage: python3 level.py in.mp3 out.wav [target_rms]
import subprocess, sys, numpy as np
inp, outp = sys.argv[1], sys.argv[2]; TARGET = float(sys.argv[3]) if len(sys.argv) > 3 else -16.0
sr = 48000; CEIL = 10 ** (-1.5 / 20)
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', inp, '-f', 'f32le', '-ac', '1', '-ar', str(sr), '-'], capture_output=True)
x = np.frombuffer(r.stdout, dtype=np.float32).astype(np.float64)
# trim leading/trailing silence under -50 dB, keep 60 ms of air
thr = 10 ** (-50 / 20); nz = np.where(np.abs(x) > thr)[0]
a = max(0, nz[0] - int(0.06 * sr)); b = min(len(x), nz[-1] + int(0.12 * sr)); x = x[a:b]
def rms(y): return 20 * np.log10(np.sqrt((y ** 2).mean()) + 1e-12)
env = np.abs(x); a_att = np.exp(-1 / (0.010 * sr)); a_rel = np.exp(-1 / (0.250 * sr)); e = 0.0; g = np.empty(len(x)); thr = 10 ** (-22 / 20)
for i, v in enumerate(env):
    e = v + (a_att if v > e else a_rel) * (e - v)
    g[i] = 1.0 if e <= thr else (thr * (e / thr) ** (1 / 3)) / e
x *= g
for _ in range(6):
    x *= 10 ** ((TARGET - rms(x)) / 20)
    pk = np.abs(x); win = int(0.005 * sr)
    need = np.minimum(1.0, CEIL / np.maximum(pk, 1e-9))
    lim = np.minimum.reduce([np.roll(need, -k) for k in range(win)])
    a_rel = np.exp(-1 / (0.060 * sr)); gg = np.empty(len(x)); cur = 1.0
    for i, n in enumerate(lim):
        cur = n if n < cur else n + a_rel * (cur - n); gg[i] = cur
    x *= gg
    if abs(rms(x) - TARGET) < 0.1 and np.abs(x).max() <= CEIL + 1e-6: break
# 8 ms in / 30 ms out edges so the bus's own envelope has nothing to click on
n_in = int(0.008 * sr); n_out = int(0.03 * sr); x[:n_in] *= np.linspace(0, 1, n_in); x[-n_out:] *= np.linspace(1, 0, n_out)
print('%s: RMS %.2f dBFS peak %.2f dBFS %.2fs' % (outp, rms(x), 20 * np.log10(np.abs(x).max()), len(x) / sr))
x.astype(np.float32).tofile(outp + '.f32')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '1', '-i', outp + '.f32', outp], check=True)
