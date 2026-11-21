# v28.0 · episode 4 chapter 5's generated effects, beds and music MEASURED (a session has no ears, v10.4): chapter 4's
# measure (masters/v27.0/sound/measure.py) with every take of this chapter put through the transcriber (every effect and
# bed here is meant to be wordless: v25.4, a take it writes a word from is refused), and the music read second by second.
#   python3 -I masters/v28.0/sound/measure.py sfx|music [name ...]     -> sound/measures-<table>.json
# For each take: its length; its peak and its level where it sounds (RMS of the 50 ms frames within 30 dB of its
# loudest); its loudest 50 ms; how much is silence; when it first sounds; the share of its energy a phone's speaker can
# play (over 150 Hz) and the share in the voice's band (300 to 3400 Hz); for a loop, its seam and how far its level
# wanders; for music, its seconds' levels (the median, the swing, the HOLES: a second 14 dB under its median), the share
# under 120 Hz, and, for the fight's piece, its tempo read in windows (its onsets' autocorrelation) so a drift is seen;
# what a transcriber (faster-whisper small.en, here, nothing uploaded) writes from it.
import json, os, re, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 32000
table = sys.argv[1]; only = set(sys.argv[2:])
ROWS = json.load(open(os.path.join(HERE, table + '.json')))

def dec(p, ch=1, sr=SR):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', str(ch), '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)
def db(v): return float(20 * np.log10(max(v, 1e-9)))
def band(x, lo, hi):
    X = np.abs(np.fft.rfft(x)) ** 2; f = np.fft.rfftfreq(len(x), 1 / SR); tot = X.sum() + 1e-12
    return float(X[(f >= lo) & (f < hi)].sum() / tot)
model = None
def words(p):
    global model
    if model is None:
        from faster_whisper import WhisperModel
        model = WhisperModel('small.en', device='cpu', compute_type='int8')
    x16 = dec(p, sr=16000).astype(np.float32)
    segs, _ = model.transcribe(x16, language='en', beam_size=3, vad_filter=True, no_speech_threshold=0.5)
    return re.sub(r'\s+', ' ', ' '.join(s.text for s in segs if s.no_speech_prob < 0.5)).strip()
def tempo(x, lo=60, hi=180):
    """beats a minute of a stretch, from its onset envelope's autocorrelation (10 ms frames)"""
    h = int(SR * 0.01); e = np.array([np.sqrt(np.mean(x[j:j + h] ** 2)) for j in range(0, len(x) - h, h)])
    o = np.maximum(np.diff(np.log(e + 1e-6)), 0); o = o - o.mean()
    ac = np.correlate(o, o, 'full')[len(o) - 1:]
    lags = np.arange(len(ac)); bpm = 6000.0 / np.maximum(lags, 1)
    ok = (bpm >= lo) & (bpm <= hi)
    i = lags[ok][np.argmax(ac[ok])]; return round(6000.0 / i, 1)

out_p = os.path.join(HERE, 'measures-%s.json' % table)
res = json.load(open(out_p)) if os.path.exists(out_p) else {}
for o in ROWS:
    n = o['name']
    if only and n not in only: continue
    for i in range(o['takes']):
        k = '%s_%s' % (n, 'abcdef'[i]); p = os.path.join(HERE, 'raw', k + '.mp3')
        if not os.path.exists(p): p = os.path.join(os.environ.get('RAW', '/nonexistent'), k + '.mp3')
        if not os.path.exists(p): print(k, 'MISSING'); continue
        if k in res and not only: continue
        x = dec(p); L = len(x) / SR; w = int(SR * 0.05)
        e = np.array([np.sqrt(np.mean(x[j:j + w] ** 2)) for j in range(0, max(1, len(x) - w), w)]); live = e > e.max() * 10 ** (-30 / 20)
        lvl = db(np.sqrt(np.mean(np.concatenate([x[j * w:(j + 1) * w] for j in np.where(live)[0]]) ** 2)))
        m = dict(len=round(L, 2), asked=o['secs'], peak=round(db(np.abs(x).max()), 1), level=round(lvl, 1), loud=round(db(e.max()), 1),
                 silent=round(float(np.mean(e < 10 ** (-60 / 20))), 2), first=round(float(np.argmax(live)) * 0.05, 2),
                 last=round(float(len(live) - np.argmax(live[::-1])) * 0.05, 2),
                 phone=round(1 - band(x, 0, 150), 2), voice=round(band(x, 300, 3400), 2), sub120=round(band(x, 0, 120), 2))
        if o.get('loop'):
            a, b = x[:int(SR * 0.25)], x[-int(SR * 0.25):]
            m['seam'] = round(db(np.sqrt(np.mean(b ** 2))) - db(np.sqrt(np.mean(a ** 2))), 1)
            m['jump'] = round(db(abs(x[0] - x[-1])), 1)
        if L > 3:
            s = np.array([db(np.sqrt(np.mean(x[j:j + SR] ** 2))) for j in range(0, len(x) - SR + 1, SR)])
            med = float(np.median(s)); m['median'] = round(med, 1); m['swing'] = round(float(s.max() - s.min()), 1)
            m['holes'] = [int(j) for j in np.where(s < med - 14)[0]]
            if table == 'music': m['secs'] = [round(float(v), 1) for v in s]
        if n == 'u5m7fight':
            m['tempo'] = [tempo(x[j:j + SR * 16]) for j in range(0, len(x) - SR * 16 + 1, SR * 8)]
        m['words'] = words(p)
        res[k] = m
        print(k.ljust(16), json.dumps({a: b for a, b in m.items() if a != 'secs'}), flush=True)
        json.dump(res, open(out_p, 'w'), indent=1)
