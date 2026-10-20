"""v21.2 · measures for picking the shop radio's THAI TRADITIONAL MUSIC
without ears (Chad turned down every chant take: "All 3 generated chant
music choices are terrible ... replace with thai traditional music instead").
A bed on a radio wants: its energy where a phone plays it (250 Hz-4 kHz),
almost none in the sub-bass; an EVEN level — no build-up, no dropout (the
1 s RMS spread and the windows 12 dB under the median); clean edges; light
percussion (the share of spectral flux in its strongest onsets). And it plays
UNDER the trance's own melody (`e3dance`, a piphat) once the hands part, so
its pitch classes are compared with that take's (chroma correlation: the
nearer 1, the less the two melodies fight).
Usage: python3 musicmeas.py ref.mp3 take1.mp3 take2.mp3 ...  (ref = e3dance)"""
import subprocess, numpy as np, sys, os
def load(p, sr=22050):
    b = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', p, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.float32).copy(), sr
def db(v): return 20 * np.log10(max(v, 1e-9))
def chroma(x, sr):
    n = 8192; hop = 4096; C = np.zeros(12); f = np.fft.rfftfreq(n, 1 / sr)
    ok = (f >= 110) & (f <= 2000); pc = np.round(12 * np.log2(f[ok] / 440.0)).astype(int) % 12
    w = np.hanning(n)
    for i in range(0, len(x) - n, hop):
        S = np.abs(np.fft.rfft(x[i:i + n] * w))[ok] ** 2
        np.add.at(C, pc, S)
    return C / (C.sum() + 1e-12)
ref = None
for k, p in enumerate(sys.argv[1:]):
    x, sr = load(p); dur = len(x) / sr
    F = np.abs(np.fft.rfft(x * np.hanning(len(x)))) ** 2; f = np.fft.rfftfreq(len(x), 1 / sr); T = F.sum() + 1e-12
    phone = F[(f >= 250) & (f < 4000)].sum() / T; sub = F[f < 120].sum() / T; hi = F[f >= 4000].sum() / T
    cen = (F * f).sum() / T
    s1 = np.array([db(np.sqrt(np.mean(x[i:i + sr] ** 2))) for i in range(0, len(x) - sr, sr)])
    med = np.median(s1); drop = int((s1 < med - 12).sum()); spread = s1.std(); swing = s1.max() - s1.min()
    # the first and last 8 s against the middle: a build-up or a fade
    a8 = np.median(s1[:8]); z8 = np.median(s1[-8:])
    # onsets: spectral flux at 23 ms; the share carried by the strongest 5 %
    n = 1024; hop = 512; prev = None; flux = []
    for i in range(0, len(x) - n, hop):
        S = np.abs(np.fft.rfft(x[i:i + n] * np.hanning(n)))
        if prev is not None: flux.append(np.maximum(S - prev, 0).sum())
        prev = S
    flux = np.array(flux); top = np.sort(flux)[-max(1, len(flux) // 20):].sum() / (flux.sum() + 1e-12)
    # tempo from the flux's autocorrelation, 50-160 bpm
    fl = flux - flux.mean(); ac = np.correlate(fl, fl, 'full')[len(fl) - 1:]
    lag = lambda bpm: int(round(60 / bpm * sr / hop))
    lo, hi_ = lag(160), lag(50); j = lo + int(np.argmax(ac[lo:hi_])); bpm = 60 / (j * hop / sr)
    head = db(np.sqrt(np.mean(x[:int(0.05 * sr)] ** 2))); tail = db(np.sqrt(np.mean(x[-int(0.05 * sr):] ** 2)))
    C = chroma(x, sr)
    if k == 0:
        ref = C
        print(f"REF {os.path.basename(p)}  chroma top {', '.join('C C# D D# E F F# G G# A A# B'.split()[i] for i in np.argsort(C)[-5:][::-1])}")
        continue
    cc = float(np.corrcoef(C, ref)[0, 1])
    print(f"{os.path.basename(p):22s} {dur:5.1f}s phone {phone*100:4.1f}% sub {sub*100:4.1f}% >4k {hi*100:4.1f}%  cen {cen:5.0f}  "
          f"1s spread {spread:4.1f} swing {swing:4.1f} drops {drop}  first8 {a8-med:+5.1f} last8 {z8-med:+5.1f}  "
          f"onset top5% {top*100:4.1f}%  ~{bpm:5.1f} bpm  head {head:6.1f} tail {tail:6.1f}  rms {db(np.sqrt(np.mean(x**2))):5.1f}  chroma~dance {cc:+.2f}")
