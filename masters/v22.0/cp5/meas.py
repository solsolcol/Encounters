"""e3c4 CP5 · measure every raw take: length, peak, RMS, how its energy splits across the bands a phone can and
cannot play (<120 Hz is nearly lost on a phone speaker — the v10.4 law), where it starts and ends, and holes."""
import json, subprocess, sys, glob, os
import numpy as np
def load(f, sr=44100):
    raw = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', f, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32), sr
def db(x): return 20 * np.log10(max(x, 1e-9))
out = {}
files = sorted(glob.glob('raw/*.mp3')) if len(sys.argv) < 2 else sys.argv[1:]
for f in files:
    x, sr = load(f)
    if len(x) == 0: continue
    n = len(x); dur = n / sr
    pk = float(np.max(np.abs(x))); rms = float(np.sqrt(np.mean(x ** 2)))
    spec = np.abs(np.fft.rfft(x * np.hanning(n))) ** 2; fr = np.fft.rfftfreq(n, 1 / sr); tot = spec.sum() + 1e-12
    band = lambda a, b: float(spec[(fr >= a) & (fr < b)].sum() / tot)
    win = int(sr * 0.05); frames = np.array([np.sqrt(np.mean(x[i:i + win] ** 2)) for i in range(0, n - win, win)])
    fdb = np.array([db(v) for v in frames]); thr = db(pk) - 40
    on = np.argmax(fdb > thr) * 0.05 if (fdb > thr).any() else None
    last = (len(fdb) - np.argmax(fdb[::-1] > thr)) * 0.05 if (fdb > thr).any() else None
    holes = 0; run = 0
    for v in fdb[int((on or 0) / 0.05):int((last or 0) / 0.05)]:
        run = run + 1 if v < db(pk) - 45 else 0
        if run == 6: holes += 1
    cent = float((fr * spec).sum() / tot)
    out[os.path.basename(f)] = dict(dur=round(dur, 2), peak=round(db(pk), 1), rms=round(db(rms), 1), sub=round(band(0, 120), 3),
        low=round(band(120, 500), 3), mid=round(band(500, 3000), 3), hi=round(band(3000, 20000), 3), cent=int(cent),
        on=float(on) if on is not None else None, end=round(float(last), 2) if last else None, holes=holes, tailDb=round(float(fdb[-1]), 1) if len(fdb) else None, headDb=round(float(fdb[0]), 1) if len(fdb) else None)
json.dump(out, open('measure.json', 'w'), indent=1)
for k, v in out.items(): print(k.ljust(22), ' '.join(f'{a}={b}' for a, b in v.items()))
