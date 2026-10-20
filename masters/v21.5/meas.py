"""v21.5 · measures for the medium's WHISPERED spirit tongue (Chad: "more
expressive tone for dramatic effect ... deity tongues tend to have a whispery
quick tone where you can barely make out what he is saying. The current take
is too distinct"). Without ears, per take:
  len / voice span / tail   — what has to fit the roar film, and a clean end
  voiced %   — share of loud frames with a clear pitch (a whisper has almost none;
               v21.4's shouted pick sits near 80 %)
  flat       — spectral flatness of the loud frames, 0..1 (breath and hiss read high)
  >2k %      — share of energy above 2 kHz (a whisper lives there; a shout lower)
  syl/s      — energy onsets per second of voice (how QUICK the stream is)
  gaps       — the pauses inside it over 0.12 s (distinctness: a clean stop
               between every phrase is what made v21.4 easy to follow)
  arc dB     — loudest 250 ms against the median of the voice (the drama: a
               whisper that bursts reads large)
Usage: python3 meas.py raw/*.mp3"""
import subprocess, numpy as np, sys, os
def load(p, sr=22050):
    b = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', p, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.float32).copy(), sr
def db(v): return 20 * np.log10(max(v, 1e-9))
for p in sys.argv[1:]:
    x, sr = load(p); hop = int(0.02 * sr)
    e = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2)) for i in range(0, len(x) - hop, hop)])
    on = e > max(e.max() * 0.03, 1e-4)
    idx = np.where(on)[0]
    t0, t1 = (idx[0] * 0.02, (idx[-1] + 1) * 0.02) if len(idx) else (0, 0)
    # pauses inside the voice
    gaps, run = [], 0
    for v in on[idx[0]:idx[-1] + 1] if len(idx) else []:
        if not v: run += 1
        else:
            if run * 0.02 >= 0.12: gaps.append(round(run * 0.02, 2))
            run = 0
    # voicing, flatness and the high band over the loud 40 ms frames
    n = int(0.04 * sr); voiced = loud = 0; flats = []; hiE = totE = 0.0
    thr = np.sqrt(np.mean(x ** 2)) * 0.5
    win = np.hanning(n); f = np.fft.rfftfreq(n, 1 / sr)
    for i in range(0, len(x) - n, n // 2):
        fr = x[i:i + n]
        if np.sqrt(np.mean(fr ** 2)) < thr: continue
        loud += 1
        S = np.abs(np.fft.rfft(fr * win)) ** 2 + 1e-12
        flats.append(np.exp(np.mean(np.log(S))) / np.mean(S))
        hiE += S[f >= 2000].sum(); totE += S.sum()
        g = fr - fr.mean(); ac = np.correlate(g, g, 'full')[n - 1:]
        lo, hi = int(sr / 400), int(sr / 70); j = lo + np.argmax(ac[lo:hi])
        if ac[j] > 0.5 * ac[0]: voiced += 1
    # onsets per second of voice: rises of the 10 ms envelope's log over a running floor
    h2 = int(0.01 * sr)
    e2 = np.array([np.sqrt(np.mean(x[i:i + h2] ** 2)) for i in range(0, len(x) - h2, h2)])
    le = 20 * np.log10(e2 + 1e-6); sm = np.convolve(le, np.ones(3) / 3, 'same')
    d = np.diff(sm); ons = 0; last = -99
    for k in range(1, len(d)):
        if d[k] > 2.2 and d[k - 1] <= 2.2 and k - last > 7 and sm[k] > le.max() - 40: ons += 1; last = k
    span = max(t1 - t0, 1e-3)
    # the arc: loudest 250 ms against the voice's median 250 ms
    w = int(0.25 * sr)
    r = np.array([db(np.sqrt(np.mean(x[i:i + w] ** 2))) for i in range(int(t0 * sr), max(int(t0 * sr) + 1, int(t1 * sr) - w), w // 2)])
    arc = (r.max() - np.median(r)) if len(r) else 0
    tail = db(np.sqrt(np.mean(x[-int(0.05 * sr):] ** 2))); head = db(np.sqrt(np.mean(x[:int(0.05 * sr)] ** 2)))
    print(f"{os.path.basename(p):13s} {len(x)/sr:5.2f}s voice {t0:4.2f}-{t1:4.2f} ({span:4.2f})  voiced {100*voiced/max(loud,1):4.0f}%  "
          f"flat {np.median(flats) if flats else 0:5.3f}  >2k {100*hiE/max(totE,1e-9):4.1f}%  syl/s {ons/span:4.1f}  "
          f"gaps {gaps}  arc {arc:4.1f} dB  head {head:6.1f} tail {tail:6.1f}")
