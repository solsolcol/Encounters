"""v23.0 CP11 · THE MUSIC BOX'S FATES (docs/V23.0-E3C5-PLAN.md §9.4) — every one made offline from the box's own tune
(raw/k5lullaby_b.mp3, C major, 3/4 at 72/min, its phrase played twice: the second time from 10.25 s), so the ending a
player reaches is heard as what happened to THAT box. Nothing here is generated.
  k5endA   A · RUNNING DOWN: the spring gives out — a varispeed from 1.0 to 0.27 over 12.5 s (pitch and tempo fall
           together, as a box's do), with the governor's small unevenness, stopping 7.6 s into the 10.25 s phrase
           (before it can end); the last tine rings out
  k5endB   B · SCATTERED: the phrase played once and answered by fourteen copies of itself, each later (0.4–3.4 s),
           further (low-passed 1.2–4 kHz), quieter (-9 to -24 dB), a little out of tune with the next (±1.2 %), and
           set across the stereo field — as if played in a crowd of rooms; the box itself fades out under its echoes
  k5endC   C · OVERWOUND: too fast (×1.42, the pitch up with it), the comb skipping (a 60–150 ms chunk dropped every
           0.7–1.1 s), then slipping out of tune — the rate sagging unevenly to ×1.18 under a 3.5 Hz wobble
  k5boxfast  C's first wish: the box wound too far, playing too fast and skipping (8 s)
  k5boxstop  C's last: mid-phrase, the governor slips — the rate dives to nothing in 0.32 s — and a click
usage: python3 fates.py raw/k5lullaby_b.mp3 outdir"""
import subprocess, sys, numpy as np
sr = 48000
src, out = sys.argv[1], sys.argv[2]
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 'f32le', '-ac', '2', '-ar', str(sr), '-'], capture_output=True)
X = np.frombuffer(r.stdout, dtype=np.float32).astype(np.float64).reshape(-1, 2)
T0 = 0.75                                    # the first note is at 0.82 s (tune.py); the phrase from here
x = X[int(T0 * sr):]
PH = 10.25 - T0 + 0.75                        # the phrase's length in the source (its repeat begins 10.25 s in)

def read(y, pos):                             # linear interpolation at fractional source positions (samples)
    i0 = np.clip(np.floor(pos).astype(int), 0, len(y) - 2); fr = (pos - i0)[:, None]
    return y[i0] * (1 - fr) + y[i0 + 1] * fr
def lp(y, f):                                 # one-pole low-pass per channel (cheap, gentle)
    a = np.exp(-2 * np.pi * f / sr); o = np.zeros_like(y); s = np.zeros(y.shape[1])
    for i in range(len(y)): s = (1 - a) * y[i] + a * s; o[i] = s
    return o
def fade(y, fin, fout):
    y = y.copy(); a, b = int(fin * sr), int(fout * sr)
    if a: y[:a] *= np.linspace(0, 1, a)[:, None]
    if b: y[-b:] *= (np.linspace(1, 0, b) ** 1.6)[:, None]
    return y
def verb(y, secs=1.6, mix=0.18):              # a small room: a few decaying taps, enough for a last tine to ring out
    o = y.copy()
    for k, (d, g) in enumerate([(0.031, 0.5), (0.047, 0.42), (0.071, 0.33), (0.113, 0.26), (0.167, 0.19), (0.241, 0.13)]):
        n = int(d * sr); t = np.zeros_like(y); t[n:] = y[:-n] * g; o += t * mix * (1 if k % 2 == 0 else -1)
    return o
def save(y, name):
    y = y / (np.abs(y).max() + 1e-9) * 0.89
    path = f'{out}/{name}.wav'
    y.astype(np.float32).tofile(path + '.f32')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '2', '-i', path + '.f32', path], check=True)
    subprocess.run(['rm', '-f', path + '.f32'])
    print(f'{name}: {len(y) / sr:.2f} s')

# ---- A · running down
D = 12.5; n = int(D * sr); t = np.arange(n) / sr; k = t / D
rate = 1.0 - 0.73 * (k * k * (3 - 2 * k))                      # 1.0 -> 0.27, eased
rate *= 1 + 0.018 * np.sin(2 * np.pi * 2.6 * t) * k             # the governor, unsteady as it tires
pos = np.cumsum(rate) / sr                                       # source seconds read
y = read(x, pos * sr)
print(f'endA reads {pos[-1]:.2f} s of the {PH:.2f} s phrase')
tail = np.zeros((int(1.8 * sr), 2)); y = np.vstack([fade(y, 0.0, 0.35), tail])
save(fade(verb(y, mix=0.22), 0.01, 0.5), 'k5endA')

# ---- B · scattered into echoes
rng = np.random.default_rng(5)
L = int((PH + 4.5) * sr); base = np.zeros((L, 2)); dry = x[:int(PH * sr)]
env = np.ones(len(dry)); m = int(len(dry) * 0.45); env[m:] = np.linspace(1, 0.0, len(dry) - m) ** 1.3
base[:len(dry)] += dry * env[:, None] * 0.9
for j in range(14):
    d = rng.uniform(0.4, 3.4); g = 10 ** (rng.uniform(-24, -9) / 20); f = rng.uniform(1200, 4000); det = 1 + rng.uniform(-0.012, 0.012)
    pan = rng.uniform(-1, 1); c = lp(read(dry, np.arange(int(len(dry) / det)) * det), f)
    c = c * np.array([np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)]) * 1.4
    a = int(d * sr); e = min(L, a + len(c)); base[a:e] += c[:e - a] * g
save(fade(verb(base, mix=0.3), 0.01, 2.5), 'k5endB')

# ---- C · overwound
def overwound(D, r0, r1, sag_at, skips=True, seed=7):
    n = int(D * sr); t = np.arange(n) / sr
    rate = np.full(n, r0)
    s = np.clip((t - sag_at) / max(0.1, D - sag_at), 0, 1)
    rate = r0 + (r1 - r0) * s ** 1.4
    rate *= 1 + 0.022 * np.sin(2 * np.pi * 3.5 * t) * s          # slipping out of tune
    pos = np.cumsum(rate)                                          # source samples
    if skips:
        g = np.random.default_rng(seed); at = 0.5
        while at < D - 0.3:
            i = int(at * sr); pos[i:] += g.uniform(0.06, 0.15) * sr  # the comb skips a little of the tune
            at += g.uniform(0.7, 1.1)
    y = read(x, pos)
    # 5 ms crossfades are implicit in the interpolation; add the comb's dry tick at each skip
    return y
y = overwound(13.0, 1.42, 1.18, 7.5)
save(fade(verb(y, mix=0.15), 0.01, 1.2), 'k5endC')
y = overwound(8.0, 1.40, 1.40, 99.0, seed=11)
save(fade(verb(y, mix=0.12), 0.02, 0.6), 'k5boxfast')

# ---- the box slips and stops
a = int(4.0 * sr); run = x[a:a + int(1.4 * sr)]
n = int(0.32 * sr); k = np.arange(n) / n; rr = (1 - k) ** 2.2; p = a + int(1.4 * sr) + np.cumsum(rr)
dive = read(x, p)
click = np.zeros((int(0.02 * sr), 2)); click[:30] = np.random.default_rng(3).uniform(-0.6, 0.6, (30, 2)) * np.linspace(1, 0, 30)[:, None]
y = np.vstack([run, dive, click * 0.5, np.zeros((int(0.7 * sr), 2))])
save(fade(verb(y, mix=0.2), 0.03, 0.4), 'k5boxstop')
