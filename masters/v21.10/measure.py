"""v21.10 · measures for picking the gallery's UI sounds without ears.
For each take: length, peak, the head (first 20 ms) and the tail (last 60 ms) in dB,
the attack (ms from the first sample over -40 dBFS to within 6 dB of the peak), the
share of energy in each band a phone does or does not play (<120 Hz, 120-500,
500-3k, >3k), the spectral centroid, and the onsets (energy jumps of 9 dB or more
over the frame before, 20 ms frames, at least 80 ms apart) with their times."""
import subprocess, numpy as np, sys, os
def load(p, sr=44100):
    b = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', p, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.float32), sr
def db(x): return 20 * np.log10(max(float(x), 1e-9))
for p in sys.argv[1:]:
    x, sr = load(p)
    if not len(x): print(p, 'EMPTY'); continue
    pk = np.max(np.abs(x)); n20 = int(0.02 * sr); n60 = int(0.06 * sr)
    head = db(np.sqrt(np.mean(x[:n20] ** 2))); tail = db(np.sqrt(np.mean(x[-n60:] ** 2)))
    over = np.where(np.abs(x) > 10 ** (-40 / 20))[0]
    near = np.where(np.abs(x) > pk * 10 ** (-6 / 20))[0]
    atk = (near[0] - over[0]) / sr * 1000 if len(over) and len(near) else -1
    t_first = over[0] / sr if len(over) else -1
    F = np.abs(np.fft.rfft(x)) ** 2; fr = np.fft.rfftfreq(len(x), 1 / sr); tot = F.sum() + 1e-12
    band = lambda a, b: 100 * F[(fr >= a) & (fr < b)].sum() / tot
    cen = (fr * F).sum() / tot
    fl = int(0.02 * sr); e = np.array([np.sqrt(np.mean(x[i:i + fl] ** 2)) + 1e-9 for i in range(0, len(x) - fl, fl)])
    ed = 20 * np.log10(e); ons = []
    for i in range(1, len(ed)):
        if ed[i] - ed[i - 1] >= 9 and ed[i] > db(pk) - 40 and (not ons or i * 0.02 - ons[-1] >= 0.08): ons.append(round(i * 0.02, 2))
    print(f"{os.path.basename(p):18s} {len(x)/sr:5.2f}s pk {db(pk):6.1f} head {head:6.1f} tail {tail:6.1f} first {t_first:5.3f}s atk {atk:6.1f}ms "
          f"<120 {band(0,120):4.1f}% 120-500 {band(120,500):4.1f}% 500-3k {band(500,3000):4.1f}% >3k {band(3000,22050):4.1f}% cen {cen:5.0f} onsets {ons}")
