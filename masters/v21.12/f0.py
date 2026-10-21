"""v21.12 · a rough pitch track (autocorrelation over 40 ms frames, voiced frames only) — the spread of a read's pitch
(semitones std) and its range, as a measure of how expressive it is; no ears here."""
import subprocess, numpy as np, sys
def load(p, sr=16000):
    b = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', p, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.float32), sr
for p in sys.argv[1:]:
    x, sr = load(p); n = int(0.04 * sr); hop = n // 2; f0s = []
    for i in range(0, len(x) - n, hop):
        fr = x[i:i + n] * np.hanning(n)
        if np.sqrt(np.mean(fr ** 2)) < 0.01: continue
        ac = np.correlate(fr, fr, 'full')[n - 1:]
        lo, hi = int(sr / 400), int(sr / 70)
        k = lo + np.argmax(ac[lo:hi]);
        if ac[k] / (ac[0] + 1e-9) < 0.45: continue
        f0s.append(sr / k)
    f = np.array(f0s); st = 12 * np.log2(f / np.median(f))
    print(f"{p.split('/')[-1]:18s} voiced {len(f):4d}  median {np.median(f):6.1f} Hz  std {st.std():4.2f} st  range(5-95%) {np.percentile(st,95)-np.percentile(st,5):5.2f} st")
