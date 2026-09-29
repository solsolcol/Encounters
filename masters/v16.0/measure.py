"""v16.0 · measure every raw take: length, peak, RMS, the level of its first and
last 60 ms (a take that starts or ends ON signal clicks), leading/trailing
silence, and the phone-band split (share of energy under 120 Hz / 120-500 /
500-3k / above 3k) — the measures the earlier releases chose takes by."""
import subprocess, numpy as np, glob, json, os, sys
def load(p, sr=44100):
    b = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', p, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.float32), sr
def db(x): return 20 * np.log10(max(x, 1e-9))
def meas(p):
    x, sr = load(p)
    if not len(x): return None
    n = int(0.06 * sr)
    rms = np.sqrt(np.mean(x ** 2))
    thr = max(np.abs(x).max() * 0.03, 1e-4)
    idx = np.where(np.abs(x) > thr)[0]
    lead = idx[0] / sr if len(idx) else 0; tail = (len(x) - idx[-1]) / sr if len(idx) else 0
    F = np.abs(np.fft.rfft(x * np.hanning(len(x)))) ** 2; f = np.fft.rfftfreq(len(x), 1 / sr); T = F.sum() + 1e-12
    bands = [F[f < 120].sum() / T, F[(f >= 120) & (f < 500)].sum() / T, F[(f >= 500) & (f < 3000)].sum() / T, F[f >= 3000].sum() / T]
    return dict(secs=round(len(x) / sr, 2), peak=round(float(db(np.abs(x).max())), 1), rms=round(float(db(rms)), 1),
                head=round(float(db(np.sqrt(np.mean(x[:n] ** 2)))), 1), end=round(float(db(np.sqrt(np.mean(x[-n:] ** 2)))), 1),
                lead=round(float(lead), 2), tail=round(float(tail), 2), bands=[round(float(b) * 100, 1) for b in bands])
out = {}
for p in sorted(glob.glob('raw/*.mp3')):
    k = os.path.basename(p)[:-4]
    out[k] = meas(p)
json.dump(out, open('measure.json', 'w'), indent=0)
for k, v in out.items():
    if v: print(f"{k:16s} {v['secs']:6.2f}s pk{v['peak']:6.1f} rms{v['rms']:6.1f} head{v['head']:6.1f} end{v['end']:6.1f} lead{v['lead']:5.2f} tail{v['tail']:5.2f} bands{v['bands']}")
