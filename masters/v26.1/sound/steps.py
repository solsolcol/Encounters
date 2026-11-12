"""v26.1 · HIS FEET ON THE GRASS, made again (Chad, 12 Nov 2026: "i dislike the walking sound effect, it does not sound like
walking on grass ground, do a better sound effect for it please").

The engine plays a footfall every half-cycle of the walk's bob (main.js updateViewmodel: vm.step += dt * speed * 5.6, a
fall each pi), and he walks at 2.55 m/s: a footfall every 0.22 s. v26.0's step was ONE take, 0.65 s long, played at every
fall with its pitch turned a little: three of it sounded at once, a smear of the same rustle. Here every take is measured
(its falls: the envelope's peaks), each fall cut out on its own (10 ms before its rise, 0.21 s after, the tail faded), so a
step ends before the next begins, and the steps of one kind are dealt in turn.

    python3 -I masters/v26.1/sound/steps.py measure          the takes' falls and their sound, to steps.json
    python3 -I masters/v26.1/sound/steps.py cut <kind> <take,...>   the falls of those takes as the game's steps (wav)
    python3 -I masters/v26.1/sound/steps.py reel             a walk of each kind at the game's own pace, loudness matched,
                                                            beside v26.0's, for his ear (masters/v26.1/sound/previews)
"""
import json, os, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); RAW = os.path.join(HERE, '..', '..', 'v26.0', 'sound', 'raw'); SR = 44100
KINDS = ['x3grassA', 'x3grassB', 'x3grassC', 'x3grassD']
PRE, POST, FADE = 0.010, 0.21, 0.07          # a cut step: 10 ms before its rise, 0.21 s after it, the last 70 ms faded

def dec(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)
def env(x, w=0.006):
    n = max(1, int(w * SR)); k = np.ones(n) / n
    return np.sqrt(np.convolve(x * x, k, mode='same'))
def falls(x):
    """the rises of the footfalls: where the envelope climbs past half its loudest and is the loudest within 0.25 s"""
    e = env(x); top = e.max(); out = []
    if top <= 0: return out
    i = 0; gap = int(0.25 * SR)
    while i < len(e):
        if e[i] > 0.35 * top:
            j = min(len(e), i + gap); pk = i + int(np.argmax(e[i:j]))
            rise = pk
            while rise > 0 and e[rise] > 0.15 * e[pk]: rise -= 1
            out.append((rise / SR, pk / SR, float(e[pk] / top)))
            i = pk + gap
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
    for k in KINDS:
        for l in 'abcd':
            p = os.path.join(RAW, '%s_%s.mp3' % (k, l))
            if not os.path.exists(p): continue
            x = dec(p); F = falls(x)
            steps = [cut(x, r) for r, _, _ in F]
            rows['%s_%s' % (k, l)] = {'len': round(len(x) / SR, 2), 'falls': [[round(r, 3), round(q, 3), round(s, 2)] for r, q, s in F],
                                     'over150': round(share(x, 150, SR / 2), 3), 'voice': round(share(x, 300, 3400), 3),
                                     'air': round(share(x, 3400, SR / 2), 3), 'stepRmsDb': [round(20 * np.log10(rms(s)), 1) for s in steps]}
            print('%-12s %.2fs falls %d  over150 %.0f%%  voice %.0f%%  air %.0f%%  steps dB %s' % ('%s_%s' % (k, l), len(x) / SR, len(F),
                  100 * rows['%s_%s' % (k, l)]['over150'], 100 * rows['%s_%s' % (k, l)]['voice'], 100 * rows['%s_%s' % (k, l)]['air'], rows['%s_%s' % (k, l)]['stepRmsDb']))
    json.dump(rows, open(os.path.join(HERE, 'steps.json'), 'w'), indent=1)
elif sys.argv[1] == 'reel':
    """each kind: its takes' first falls (a walk's four for C) dealt in turn at the game's pace for 3.5 s, then v26.0's take
       at its pace; every reel at one loudness"""
    M = json.load(open(os.path.join(HERE, 'steps.json'))); out = os.path.join(HERE, 'previews'); os.makedirs(out, exist_ok=True)
    gapS = np.pi / (2.55 * 5.6)
    def walk(steps, secs=3.5, pitch=True):
        rng = np.random.default_rng(7); n = int(secs / gapS); y = np.zeros(int((secs + 0.5) * SR))
        for i in range(n):
            s = steps[i % len(steps)]
            if pitch:   # the engine turns each step's rate between 0.88 and 1.10 (stepSnd)
                r = 0.88 + rng.random() * 0.22; idx = np.arange(0, len(s) - 1, r); s = np.interp(idx, np.arange(len(s)), s)
            a = int(i * gapS * SR); y[a:a + len(s)] += s * (0.32 + 0.3)
        return y
    kinds = {}
    for k in KINDS:
        st = []
        for l in 'abcd':
            key = '%s_%s' % (k, l)
            if key not in M or M[key]['over150'] < 0.5: continue          # (a take mostly under 150 Hz is a thud a phone does not play: refused)
            x = dec(os.path.join(RAW, key + '.mp3'))
            for r, q, s in M[key]['falls'][: (4 if k == 'x3grassC' else 1)]: st.append(cut(x, r))
        kinds[k] = st
    old = dec(os.path.join(HERE, '..', '..', '..', 'assets', 'audio', 'x3step.mp3'))
    reels = {'0-now': walk([old]), **{('1-' + k[7:]): walk(v) for k, v in kinds.items()}}
    ref = rms(reels['0-now'][reels['0-now'] != 0])
    for name, y in reels.items():
        g = ref / rms(y[y != 0]); y = y * g; pk = np.abs(y).max()
        if pk > 0.95: y *= 0.95 / pk
        p = os.path.join(out, 'steps-%s.mp3' % name)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'libmp3lame', '-b:a', '160k', p], input=y.astype(np.float32).tobytes(), check=True)
        print(p, len(kinds.get('x3grass' + name[2:], [old])), 'steps')
if sys.argv[1] == 'cut':
    """the game's steps of one kind: every fall of its takes cut out, the N crispest kept (the share of a cut step's energy
       in its first 60 ms: a footfall, not a rustle that goes on), written in turn as <name>1.wav .. <name>N.wav"""
    kind, n, name = sys.argv[2], int(sys.argv[3]), sys.argv[4]
    M = json.load(open(os.path.join(HERE, 'steps.json'))); made = os.path.join(HERE, 'made'); os.makedirs(made, exist_ok=True)
    pool = []
    for l in 'abcd':
        key = '%s_%s' % (kind, l)
        if key not in M or M[key]['over150'] < 0.5: continue
        x = dec(os.path.join(RAW, key + '.mp3'))
        for i, (r, q, s) in enumerate(M[key]['falls']):
            y = cut(x, r); k = int((PRE + 0.06) * SR); crisp = float((y[:k] ** 2).sum() / ((y ** 2).sum() + 1e-12))
            pool.append((crisp, key, i, y))
    pool.sort(key=lambda t: -t[0]); keep = pool[:n]
    keep.sort(key=lambda t: (t[1], t[2]))          # (in the order they were walked: a take's falls one after another)
    for j, (crisp, key, i, y) in enumerate(keep):
        wav(os.path.join(made, '%s%d.wav' % (name, j + 1)), y)
        print('%s%d <- %s fall %d (%.0f%% of it in its first 60 ms)' % (name, j + 1, key, i + 1, 100 * crisp))
    print('refused or left: %s' % ', '.join('%s fall %d (%.0f%%)' % (k, i + 1, 100 * c) for c, k, i, _ in pool[n:]))
