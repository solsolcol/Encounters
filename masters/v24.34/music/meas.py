"""v24.34 · the music takes measured for a pick without ears (Chad's rule v10.6: measurement only SCREENS; his ear picks
from the previews). Per take: length, peak, RMS; the bands (<120 Hz a phone barely plays — v10.4; 120-500 warm; 500 Hz-3 kHz
the voice's own band; >3 kHz); the dB a phone loses (a 250 Hz high-pass, twice — the phone-band level v24.0 used); the
share in 1-4 kHz (the consonants a music bed must leave to the voice); the onset share (the strongest 5 % of the spectral
flux: a drum or a hit stands out there; the prompts asked for none); the 1 s RMS spread and its drops (12 dB under the
median: a hole a bed must not have); the arc as 2.5 s RMS steps (dB against the take's median), which is what an
under-score is picked by (does it rise where the film rises, thin where it thins); the head and the tail.
Usage: python3 meas.py raw/*.mp3 > meas.txt"""
import subprocess, sys, os, numpy as np
def load(p, sr=22050, af=None):
    a = ['ffmpeg', '-v', 'quiet', '-i', p] + (['-af', af] if af else []) + ['-ac', '1', '-ar', str(sr), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(a, capture_output=True).stdout, np.float32).copy(), sr
def db(v): return 20 * np.log10(max(float(v), 1e-9))
for p in sys.argv[1:]:
    x, sr = load(p); n = len(x); dur = n / sr
    pk = np.abs(x).max(); rms = np.sqrt(np.mean(x ** 2))
    F = np.abs(np.fft.rfft(x * np.hanning(n))) ** 2; f = np.fft.rfftfreq(n, 1 / sr); T = F.sum() + 1e-12
    band = lambda a, b: F[(f >= a) & (f < b)].sum() / T
    cen = (F * f).sum() / T
    xp, _ = load(p, sr, 'highpass=f=250:poles=2,highpass=f=250:poles=2')
    lost = db(rms) - db(np.sqrt(np.mean(xp ** 2)))
    s1 = np.array([db(np.sqrt(np.mean(x[i:i + sr] ** 2))) for i in range(0, n - sr + 1, sr)])
    med = np.median(s1); drops = int((s1 < med - 12).sum())
    hop = int(2.5 * sr); arc = [db(np.sqrt(np.mean(x[i:i + hop] ** 2))) - med for i in range(0, n - hop // 2, hop)]
    w = 1024; h = 512; prev = None; flux = []
    for i in range(0, n - w, h):
        S = np.abs(np.fft.rfft(x[i:i + w] * np.hanning(w)))
        if prev is not None: flux.append(np.maximum(S - prev, 0).sum())
        prev = S
    flux = np.array(flux); top = np.sort(flux)[-max(1, len(flux) // 20):].sum() / (flux.sum() + 1e-12)
    head = db(np.sqrt(np.mean(x[:int(0.05 * sr)] ** 2))); tail = db(np.sqrt(np.mean(x[-int(0.05 * sr):] ** 2)))
    thr = db(pk) - 40; fr = np.array([db(np.sqrt(np.mean(x[i:i + int(0.05 * sr)] ** 2))) for i in range(0, n - int(0.05 * sr), int(0.05 * sr))])
    on = np.argmax(fr > thr) * 0.05; end = (len(fr) - np.argmax(fr[::-1] > thr)) * 0.05
    print(f"{os.path.basename(p):20s} {dur:5.1f}s pk {db(pk):5.1f} rms {db(rms):5.1f}  sub {band(0,120)*100:4.1f}% 120-500 {band(120,500)*100:4.1f}% "
          f"500-3k {band(500,3000)*100:4.1f}% >3k {band(3000,20000)*100:4.1f}%  cen {cen:4.0f}  phone-lost {lost:4.1f}dB  1-4k {band(1000,4000)*100:4.1f}%  "
          f"onset5 {top*100:4.1f}%  1s-spread {s1.std():4.1f} drops {drops}  on {on:4.2f} end {end:5.2f} head {head:6.1f} tail {tail:6.1f}")
    print('   arc(2.5s, dB vs median ' + f'{med:5.1f}): ' + ' '.join(f'{a:+.0f}' for a in arc))
