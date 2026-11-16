"""v26.18 · HIS BARE FEET ON THE HALL'S TILES (the hall's inside: his photographs; the tracker's H6). The grass steps'
method (masters/v26.1/sound/steps.py) for one new kind: four takes of a short barefoot walk on glazed tile
(sessions-hall.json), each take's falls found on its envelope, each cut out on its own (10 ms before its rise, 0.21 s
after, the tail faded), the N crispest kept (the most of each one's energy in its first 60 ms).

    python3 -I masters/v26.18/sound/tiles.py measure        each take's falls and its sound, to tiles.json
    python3 -I masters/v26.18/sound/tiles.py cut <N>         the N crispest falls as made/x3tile1..N.wav
"""
import json, os, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); RAW = os.path.join(HERE, '..', '..', 'v26.0', 'sound', 'raw'); SR = 44100
KIND = os.environ.get('KIND', 'x3tileD')
PRE, POST, FADE = 0.010, 0.21, 0.07

def dec(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)
def env(x, w=0.006):
    n = max(1, int(w * SR)); k = np.ones(n) / n
    return np.sqrt(np.convolve(x * x, k, mode='same'))
def falls(x):
    e = env(x); top = e.max(); out = []
    if top <= 0: return out
    i = 0; gap = int(0.25 * SR)
    while i < len(e):
        if e[i] > 0.35 * top:
            j = min(len(e), i + gap); pk = i + int(np.argmax(e[i:j])); rise = pk
            while rise > 0 and e[rise] > 0.15 * e[pk]: rise -= 1
            out.append((rise / SR, pk / SR, float(e[pk] / top))); i = pk + gap
        else: i += 1
    return out
def share(x, lo, hi):
    X = np.abs(np.fft.rfft(x)) ** 2; f = np.fft.rfftfreq(len(x), 1 / SR); return float(X[(f >= lo) & (f < hi)].sum() / (X.sum() + 1e-12))
def cut(x, rise):
    a = max(0, int((rise - PRE) * SR)); b = min(len(x), a + int((PRE + POST) * SR)); y = x[a:b].copy()
    f = int(FADE * SR); y[-f:] *= np.linspace(1, 0, f) ** 2; y[:int(0.003 * SR)] *= np.linspace(0, 1, int(0.003 * SR))
    return y
def rms(y): return float(np.sqrt(np.mean(y * y)) + 1e-12)
def wav(p, y):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', p], input=y.astype(np.float32).tobytes(), check=True)

if sys.argv[1] == 'measure':
    rows = {}
    for l in 'abcd':
        p = os.path.join(RAW, '%s_%s.mp3' % (KIND, l))
        x = dec(p); F = falls(x); steps = [cut(x, r) for r, _, _ in F]; k = '%s_%s' % (KIND, l)
        rows[k] = {'len': round(len(x) / SR, 2), 'falls': [[round(r, 3), round(q, 3), round(s, 2)] for r, q, s in F],
                   'over150': round(share(x, 150, SR / 2), 3), 'air': round(share(x, 3400, SR / 2), 3),
                   'stepRmsDb': [round(20 * np.log10(rms(s)), 1) for s in steps]}
        print('%-12s %.2fs falls %d at %s  over150 %.0f%%  air %.0f%%  steps dB %s' % (k, len(x) / SR, len(F), [round(r, 2) for r, _, _ in F],
              100 * rows[k]['over150'], 100 * rows[k]['air'], rows[k]['stepRmsDb']))
    json.dump(rows, open(os.path.join(HERE, 'tiles.json'), 'w'), indent=1)
if sys.argv[1] == 'cut':
    n = int(sys.argv[2]); M = json.load(open(os.path.join(HERE, 'tiles.json'))); made = os.path.join(HERE, 'made'); os.makedirs(made, exist_ok=True)
    pool = []
    for l in 'abcd':
        key = '%s_%s' % (KIND, l)
        if key not in M or M[key]['over150'] < 0.5: continue
        x = dec(os.path.join(RAW, key + '.mp3'))
        for i, (r, q, s) in enumerate(M[key]['falls']):
            y = cut(x, r); kk = int((PRE + 0.06) * SR); crisp = float((y[:kk] ** 2).sum() / ((y ** 2).sum() + 1e-12))
            pool.append((crisp, key, i, y))
    pool.sort(key=lambda t: -t[0]); keep = pool[:n]; keep.sort(key=lambda t: (t[1], t[2]))
    for j, (crisp, key, i, y) in enumerate(keep):
        wav(os.path.join(made, 'x3tile%d.wav' % (j + 1)), y)
        print('x3tile%d <- %s fall %d (%.0f%% of it in its first 60 ms)' % (j + 1, key, i + 1, 100 * crisp))
    print('refused or left: %s' % ', '.join('%s fall %d (%.0f%%)' % (k, i + 1, 100 * c) for c, k, i, _ in pool[n:]))
