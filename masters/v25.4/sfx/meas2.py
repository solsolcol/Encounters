"""v25.4 · the whisper candidates measured for what the game needs of a loop near a shelf:
  rms dBFS, peak; what a phone loses (energy under 250 Hz taken off twice, v25.0's measure); the share over 2 kHz;
  how even it is (the loudest and the quietest second against the median: a loop that surges is heard to repeat);
  the seam (the last 30 ms against the first 30 ms: level step in dB, and their correlation with a continuation).
Usage: python3 meas2.py raw/*.mp3"""
import subprocess, numpy as np, sys
def load(p, sr=44100):
    b = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', p, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.float32).copy(), sr
def db(v): return 20 * np.log10(max(float(v), 1e-9))
def hp(x, sr, f):
    a = np.exp(-2 * np.pi * f / sr); y = np.empty_like(x); px = 0.0; py = 0.0
    for i in range(len(x)): py = a * (py + x[i] - px); px = x[i]; y[i] = py
    return y
for p in sys.argv[1:]:
    x, sr = load(p); rms = np.sqrt(np.mean(x ** 2)); pk = np.max(np.abs(x))
    y = hp(hp(x, sr, 250), sr, 250); loss = db(rms) - db(np.sqrt(np.mean(y ** 2)))
    X = np.abs(np.fft.rfft(x * np.hanning(len(x)))) ** 2; f = np.fft.rfftfreq(len(x), 1 / sr)
    hi = X[f > 2000].sum() / X.sum() * 100
    sec = [np.sqrt(np.mean(x[i:i + sr] ** 2)) for i in range(0, len(x) - sr + 1, sr // 2)]
    med = np.median(sec)
    n = int(0.03 * sr); a, b = x[:n], x[-n:]
    step = db(np.sqrt(np.mean(a ** 2))) - db(np.sqrt(np.mean(b ** 2)))
    print(f"{p.split('/')[-1]:22s} len {len(x)/sr:5.2f}  rms {db(rms):6.1f}  peak {db(pk):6.1f}  phone loses {loss:4.1f} dB  >2k {hi:4.1f} %  swing +{db(max(sec))-db(med):4.1f}/{db(min(sec))-db(med):5.1f} dB  seam step {step:5.1f} dB")
