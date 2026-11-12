# v26.0 · FOUR SOUNDS MADE, NOT GENERATED (v24.3: when every generated take fails the measure, make the sound):
#   python3 -I masters/v26.0/sound/synth.py     -> sound/made/x3petals.wav, x3shut.wav, x3open.wav, x3pull.wav
#
#   x3petals  a handful of petals pattering down. Both generated takes were 91 % silence, peaking at -48 and -41
#             dBFS: a petal falling makes almost no sound, and the model made almost none. Made: a few hundred tiny
#             soft taps, thick at first and thinning over a second and a half.
#   x3shut    the world's sound closing down (ending D). Both generated takes kept 92 to 99 % of their energy under
#             150 Hz, where a phone's speaker plays nothing (v10.4). Made: a soft tone and a breath of air falling
#             together from the voice's band to its foot, and gone.
#   x3open    the world heard OPEN (the breath's own level). Both generated loops wandered 28 dB second by second (a
#             chime struck, then nothing), and this bed's loudness IS the game there: it must be the same at every
#             moment he opens. Made: a bright still chord of slowly beating partials and a breath of air, every slow
#             swell a whole number of cycles in the loop, so its end is its beginning.
#   x3pull    the pull's own drone (it follows the pull's number, however long he stands in it). Made the same way,
#             low and close: a cluster a semitone wide that beats against itself, with nothing a phone cannot play.
# Seeded: the same file every run.
import os, wave
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(HERE, 'made'); os.makedirs(OUT, exist_ok=True)
SR = 48000

def save(name, y):      # y: (n,) mono or (n, 2) stereo, peaks under 1
    y = np.asarray(y, dtype=np.float64); y = np.clip(y, -1, 1); ch = 1 if y.ndim == 1 else 2
    w = wave.open(os.path.join(OUT, name + '.wav'), 'wb'); w.setnchannels(ch); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((y * 32767).astype(np.int16).tobytes()); w.close()
    print(name, '%.2f s' % (len(y) / SR), 'peak %.1f dBFS' % (20 * np.log10(np.abs(y).max() + 1e-9)), 'rms %.1f' % (20 * np.log10(np.sqrt(np.mean(y ** 2)) + 1e-9)))

def bandnoise(rng, n, lo, hi):
    X = np.fft.rfft(rng.standard_normal(n)); f = np.fft.rfftfreq(n, 1 / SR)
    m = np.clip((f - lo) / (lo * 0.35 + 1), 0, 1) * np.clip((hi - f) / (hi * 0.25 + 1), 0, 1); m = m * m * (3 - 2 * m)
    y = np.fft.irfft(X * m, n); return y / (np.abs(y).max() + 1e-12)

# ---- x3petals: 1.8 s
rng = np.random.default_rng(2603)
n = int(SR * 1.8); y = np.zeros((n, 2))
for i in range(420):
    t = rng.beta(1.3, 3.2) * 1.55 + 0.03                          # thick at first, thinning
    d = int(SR * rng.uniform(0.004, 0.012)); tap = bandnoise(rng, d, rng.uniform(1400, 3200), rng.uniform(5000, 9000)) * np.hanning(d) ** 0.7
    a = 10 ** (rng.uniform(-22, -4) / 20); pan = rng.uniform(0.2, 0.8); o = int(SR * t)
    if o + d < n: y[o:o + d, 0] += tap * a * (1 - pan); y[o:o + d, 1] += tap * a * pan
bed = bandnoise(rng, n, 900, 6000) * np.interp(np.arange(n) / SR, [0, 0.12, 0.5, 1.6, 1.8], [0, 1, 0.5, 0.05, 0]) * 0.05     # the breath of the handful through the air
y[:, 0] += bed; y[:, 1] += np.roll(bed, 211)
save('x3petals', y / np.abs(y).max() * 0.5)

# ---- x3shut: 3.0 s
rng = np.random.default_rng(2604)
n = int(SR * 3.0); t = np.arange(n) / SR
f = 1100 * (240 / 1100) ** np.clip(t / 1.7, 0, 1)                 # the tone falls from 1100 Hz to 240 in 1.7 s
ph = 2 * np.pi * np.cumsum(f) / SR
tone = (np.sin(ph) + 0.35 * np.sin(2 * ph) + 0.12 * np.sin(3 * ph)) * np.interp(t, [0, 0.08, 1.2, 2.3, 3.0], [0, 1, 0.7, 0.12, 0])
air = np.zeros(n); N = 8                                         # a breath of air drawn away with it: its band falls in steps, crossfaded
for i in range(N):
    c = 4200 * (360 / 4200) ** (i / (N - 1)); seg = bandnoise(rng, n, c * 0.6, c * 1.5)
    air += seg * np.clip(1 - np.abs(t / 1.9 * (N - 1) - i), 0, 1)
air *= np.interp(t, [0, 0.1, 1.3, 2.2, 3.0], [0, 0.55, 0.4, 0.06, 0])
y = tone * 0.5 + air * 0.5
save('x3shut', y / np.abs(y).max() * 0.6)

# ---- x3open: a 20 s loop, stereo
rng = np.random.default_rng(2605)
L = 20.0; n = int(SR * L); t = np.arange(n) / SR; y = np.zeros((n, 2))
for f0, a in [(880.0, 1.0), (1318.5, 0.8), (1760.0, 0.7), (2217.5, 0.5), (2637.0, 0.42), (3520.0, 0.25)]:      # A major, laid high: bright, and still
    for det, side in [(-0.7, 0), (0.9, 1)]:                       # each partial twice, a breath apart, one a side: they beat slowly against each other
        fr = round((f0 + det) * L) / L                            # a whole number of cycles in the loop: the join is exact
        lfo = 0.72 + 0.28 * np.sin(2 * np.pi * rng.integers(1, 5) / L * t + rng.uniform(0, 6.28))      # a slow swell, whole cycles too
        y[:, side] += a * lfo * np.sin(2 * np.pi * fr * t + rng.uniform(0, 6.28))
for side in (0, 1):                                               # air: periodic by construction (its spectrum is the loop's own)
    y[:, side] += bandnoise(rng, n, 4500, 9500) * 0.5 * (0.8 + 0.2 * np.sin(2 * np.pi * 2 / L * t + side))
save('x3open', y / np.abs(y).max() * 0.5)

# ---- x3pull: a 16 s loop, stereo
rng = np.random.default_rng(2606)
L = 16.0; n = int(SR * L); t = np.arange(n) / SR; y = np.zeros((n, 2))
for f0, a in [(196.0, 1.0), (207.7, 0.85), (392.0, 0.5), (415.3, 0.42), (587.3, 0.3), (622.3, 0.22), (1174.7, 0.08)]:      # G and A flat, stacked: a semitone that will not settle
    for det, side in [(-0.5, 0), (0.6, 1)]:
        fr = round((f0 + det) * L) / L
        lfo = 0.6 + 0.4 * np.sin(2 * np.pi * rng.integers(1, 4) / L * t + rng.uniform(0, 6.28))
        tri = np.sin(2 * np.pi * fr * t + rng.uniform(0, 6.28)) + 0.3 * np.sin(2 * np.pi * 2 * fr * t) + 0.12 * np.sin(2 * np.pi * 3 * fr * t)     # a little edge: bowed, not pure
        y[:, side] += a * lfo * tri
for side in (0, 1):
    y[:, side] += bandnoise(rng, n, 2500, 6000) * 0.12 * (0.5 + 0.5 * np.sin(2 * np.pi * 3 / L * t + 2 * side))      # a thin shimmer over it
save('x3pull', y / np.abs(y).max() * 0.5)
