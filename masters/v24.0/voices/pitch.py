"""v23.0 CP11a · how child-like is a take, without ears: the median pitch of its voiced frames (a small boy speaks at
roughly 250-400 Hz, Brian at about 110), the spread of that pitch in semitones (how much it moves — a bossy shout and a
sad whisper both move), the spectral centroid of the loud frames (a child's voice is brighter: higher formants), the
voiced share (a whisper has almost none), and the length. Autocorrelation over 40 ms frames, 70-650 Hz.
Usage: python3 child.py raw/*.mp3"""
import subprocess, numpy as np, sys, os
def load(p, sr=16000):
    b = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', p, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.float32).copy(), sr
for p in sys.argv[1:]:
    x, sr = load(p); n = int(0.04 * sr); hop = n // 2; f0s = []; cents = []; loud = 0
    thr = max(np.sqrt(np.mean(x ** 2)) * 0.35, 0.004)
    win = np.hanning(n); fq = np.fft.rfftfreq(n, 1 / sr)
    for i in range(0, len(x) - n, hop):
        fr = x[i:i + n] * win
        r = np.sqrt(np.mean(fr ** 2))
        if r < thr: continue
        loud += 1
        S = np.abs(np.fft.rfft(fr)); cents.append((S * fq).sum() / (S.sum() + 1e-9))
        ac = np.correlate(fr, fr, 'full')[n - 1:]
        lo, hi = int(sr / 650), int(sr / 70)
        z = np.where(ac[:hi] < 0)[0]                 # search past the zero-lag lobe (the first negative lag)
        if not len(z): continue
        lo = max(lo, int(z[0]))
        k = lo + np.argmax(ac[lo:hi])
        if ac[k] / (ac[0] + 1e-9) < 0.45: continue
        # octave check: prefer the shorter period when it is nearly as strong (the autocorrelation's sub-octave trap)
        k2 = k // 2
        if k2 >= lo and ac[k2] > 0.85 * ac[k]: k = k2
        f0s.append(sr / k)
    f = np.array(f0s) if f0s else np.array([1.0])
    st = 12 * np.log2(f / np.median(f))
    print(f"{os.path.basename(p):22s} {len(x)/sr:5.2f}s  f0 med {np.median(f):6.1f} Hz  p90 {np.percentile(f,90):6.1f}  spread {st.std():4.2f} st"
          f"  voiced {100*len(f0s)/max(loud,1):5.1f}%  centroid {np.median(cents) if cents else 0:6.0f} Hz")
