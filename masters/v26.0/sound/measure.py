# v26.0 · every generated effect, bed and music take MEASURED (a session has no ears, v10.4):
#   python3 -I masters/v26.0/sound/measure.py sfx|sfx2|music [name ...]     -> sound/measures-<table>.json and a table
# For each take: its length; its peak and its level where it sounds (RMS of the frames within 30 dB of its loudest);
# how much of it is silence; how much of its energy a phone's speaker can play (the share over 150 Hz) and the share
# that sits in the voice's band (300 to 3400 Hz: what masks a line); for a loop, how well its end meets its start;
# and, for a take that must be WORDLESS, what a transcriber writes from it (v25.4: a take it writes words from is
# refused). Nothing is uploaded.
import json, os, re, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 32000
table = sys.argv[1]; only = sys.argv[2:]
ROWS = json.load(open(os.path.join(HERE, table + '.json')))
WORDLESS = {'x3festbed', 'x3afternoon', 'x3waiting', 'x3trance', 'x3mem2', 'x3os1', 'x3os2', 'x3os6', 'x3sweep', 'x3bowall', 'x3crickets', 'x3birds', 'x3open', 'x3pull'}

def dec(p, ch=1):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
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
    x = dec(p).astype(np.float32); x16 = np.interp(np.arange(0, len(x), SR / 16000.0), np.arange(len(x)), x).astype(np.float32)
    segs, _ = model.transcribe(x16, language='en', beam_size=3, vad_filter=True, no_speech_threshold=0.5)
    return re.sub(r'\s+', ' ', ' '.join(s.text for s in segs if s.no_speech_prob < 0.5)).strip()

out_p = os.path.join(HERE, 'measures-%s.json' % table)
res = json.load(open(out_p)) if os.path.exists(out_p) else {}
for o in ROWS:
    n = o['name']
    if only and n not in only: continue
    for i in range(o['takes']):
        k = '%s_%s' % (n, 'abcd'[i]); p = os.path.join(HERE, 'raw', k + '.mp3')
        if not os.path.exists(p): print(k, 'MISSING'); continue
        x = dec(p); L = len(x) / SR; w = int(SR * 0.05)
        e = np.array([np.sqrt(np.mean(x[j:j + w] ** 2)) for j in range(0, max(1, len(x) - w), w)]); live = e > e.max() * 10 ** (-30 / 20)
        lvl = db(np.sqrt(np.mean(np.concatenate([x[j * w:(j + 1) * w] for j in np.where(live)[0]]) ** 2)))
        m = dict(len=round(L, 2), asked=o['secs'], peak=round(db(np.abs(x).max()), 1), level=round(lvl, 1), silent=round(float(np.mean(e < 10 ** (-60 / 20))), 2),
                 first=round(float(np.argmax(live)) * 0.05, 2), phone=round(1 - band(x, 0, 150), 2), voice=round(band(x, 300, 3400), 2))
        if o.get('loop'):
            a, b = x[:int(SR * 0.25)], x[-int(SR * 0.25):]
            m['seam'] = round(db(np.sqrt(np.mean(b ** 2))) - db(np.sqrt(np.mean(a ** 2))), 1)        # the end's level against the start's
            m['jump'] = round(db(abs(x[0] - x[-1])), 1)                                              # the step a loop would make at its join
            m['swing'] = round(float(np.ptp(20 * np.log10(np.maximum(np.array([np.sqrt(np.mean(x[j:j + SR] ** 2)) for j in range(0, len(x) - SR, SR)]), 1e-9)))), 1)   # how far its second-by-second level wanders
        if n in WORDLESS: m['words'] = words(p)
        res[k] = m
        print(k.ljust(14), json.dumps(m), flush=True)
        json.dump(res, open(out_p, 'w'), indent=1)
