"""v27.0 · two of episode 4 chapter 4's sounds MADE here, because every generated take failed the measure (a session has no
ears, v10.4; "when every generated take fails the measure, make the sound instead", v24.3). Seeded, so a run makes the
same bytes; the files are not kept in the repository (sound.sh remakes them when absent):
  u4patter  the holy water's drops landing (the fight): both generated takes were 94 % under 150 Hz and near silent (their
            loudest -37 and -52 dBFS). Nine drops over a third of a second and three late drips: each a 3 ms tick of noise
            in 2 to 8 kHz and the drop's own chirp after it, a tone rising half again over 10 ms (a drop's bubble rings
            and rises), each a little louder or softer and panned a little apart.
  u4steps   her first steps to her altar (every ending): both generated takes were 89 to 92 % under 150 Hz (heavy thumps a
            phone does not play). Made from his own bare feet on her tiles (u4tile, whose two takes are 89 and 99 % where
            a phone plays): four steps, slow and growing surer (0.75 to 1.0), a and b in turn, each a few per cent apart in
            pace so no two are one step twice.
  python3 -I masters/v27.0/sound/synth.py      (writes sound/made/u4patter.wav, sound/made/u4steps.wav)"""
import os, subprocess, wave
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 48000
OUT = os.path.join(HERE, 'made'); os.makedirs(OUT, exist_ok=True)
def dec(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64).reshape(-1, 2)
def write(name, x):
    x = np.clip(x, -1, 1); y = (x * 32767).astype('<i2')
    with wave.open(os.path.join(OUT, name + '.wav'), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(y.tobytes())
    print(name, '%.2f s' % (len(x) / SR), 'peak %.1f dBFS' % (20 * np.log10(np.abs(x).max() + 1e-12)))
def biquad_bp(x, f0, q):
    w0 = 2 * np.pi * f0 / SR; al = np.sin(w0) / (2 * q)
    b = np.array([al, 0, -al]); a = np.array([1 + al, -2 * np.cos(w0), 1 - al]); b /= a[0]; a /= a[0]
    y = np.zeros_like(x); x1 = x2 = y1 = y2 = 0.0
    for i, v in enumerate(x):
        o = b[0] * v + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2
        x2, x1, y2, y1 = x1, v, y1, o; y[i] = o
    return y

# ---- u4patter
rng = np.random.default_rng(0x7a77)
L = int(SR * 1.2); out = np.zeros((L, 2))
times, t = [], 0.02
for i in range(9): times.append((t, rng.uniform(0.55, 1.0))); t += rng.uniform(0.015, 0.06)
for i in range(3): times.append((rng.uniform(0.5, 0.95), rng.uniform(0.22, 0.4)))
for t0, g in times:
    n0 = int(t0 * SR)
    tick = rng.standard_normal(int(SR * 0.006)) * np.exp(-np.arange(int(SR * 0.006)) / (SR * 0.0008))
    tick = biquad_bp(tick, rng.uniform(3500, 6000), 0.9) * 1.1
    nc = int(SR * 0.03); tt = np.arange(nc) / SR; f0 = rng.uniform(1500, 3400)
    f = f0 * (1 + 0.5 * np.minimum(tt / 0.010, 1.0)); ph = 2 * np.pi * np.cumsum(f) / SR
    chirp = np.sin(ph) * np.exp(-tt / 0.008) * 0.9
    drop = np.zeros(int(SR * 0.04)); drop[:len(tick)] += tick; s = int(SR * 0.001); drop[s:s + nc] += chirp[:len(drop) - s]
    pan = rng.uniform(-0.5, 0.5); lg, rg = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    e = min(L, n0 + len(drop)); out[n0:e, 0] += drop[:e - n0] * g * lg; out[n0:e, 1] += drop[:e - n0] * g * rg
write('u4patter', out * 0.5)

# ---- u4steps
rng = np.random.default_rng(0x57e9)
steps = []
for k in ('a', 'b'):
    x = dec(os.path.join(HERE, 'raw', 'u4tile_%s.mp3' % k)); m = np.abs(x).max(axis=1)
    on = np.where(m > m.max() * 10 ** (-40 / 20))[0]; a0 = max(0, on[0] - int(SR * 0.004)); a1 = min(len(x), on[-1] + int(SR * 0.02))
    st = x[a0:a1].copy(); fl = int(SR * 0.004); st[:fl] *= np.linspace(0, 1, fl)[:, None]; fo = int(SR * 0.03); st[-fo:] *= np.linspace(1, 0, fo)[:, None]
    steps.append(st / np.abs(st).max())
L = int(SR * 4.0); out = np.zeros((L, 2))
for i, (t0, g) in enumerate([(0.15, 0.75), (1.15, 0.85), (2.05, 0.95), (2.95, 1.0)]):
    st = steps[i % 2]; r = rng.uniform(0.97, 1.03); n = int(len(st) / r)
    src = np.arange(n) * r; s2 = np.stack([np.interp(src, np.arange(len(st)), st[:, c]) for c in (0, 1)], axis=1)
    pan = 0.12 if i % 2 else -0.12; s2[:, 0] *= np.cos((pan + 1) * np.pi / 4) * 1.41; s2[:, 1] *= np.sin((pan + 1) * np.pi / 4) * 1.41
    n0 = int(t0 * SR); e = min(L, n0 + len(s2)); out[n0:e] += s2[:e - n0] * g
write('u4steps', out * 0.5)
