"""v24.5 (R1-1) · the music box's loop and its run-down, CUT ON THE TUNE'S OWN PHRASE. v24.3's fates2.py cut both on
10.25 s, a phrase tune.py read from lags in 0.25 s steps; measured from the notes' onsets (spectral flux, 1 ms hop) the
take's pulse is 0.8378 s and its phrase twelve pulses, 10.054 s (notes 1, 13 and 25 at 0.911, 10.960 and 21.018 s).
So k5boxloop carried the 25th note — the same E as its first — 0.27 s before its joint (a double strike at every seam
at the counter), and the room's run-down, cued 20.6 s after a tune that strikes its 25th note at 20.37, struck the same E
again 0.3 s later. Nothing here is generated: everything is cut from masters/v23.0/music/raw/k5lullaby_b.mp3.
  k5boxloop   exactly two phrases from 0.77 s (0.14 s before note 1): 20.107 s. Its HEAD is the take's own continuation —
              the ring of note 24 and note 25's strike, which IS the next phrase's first note, at the right time —
              crossfaded (0.30 -> 0.55 s) into the take's own head, so the joint is the tune going on, not a cut
              (padded for the engine by padloop.py)
  k5lullroom  the room's tune AND its run-down in one file, so they can never be a frame apart: k5lullaby's own cut of the
              take (from 0.65 s, faded in over 0.05) up to 0.14 s before note 25, then fates2's run-down (the phrase
              begun again, slowing 1.0 -> 0.42 over 5 s, its last tine ringing out) laid exactly where note 25 would
              strike, the ring of note 24 carried 0.09 s over its head. The run-down begins 20.227 s in (RUNDOWN_AT)
usage: python3 fates3.py masters/v23.0/music/raw/k5lullaby_b.mp3 outdir"""
import subprocess, sys, numpy as np
sr = 48000
src, out = sys.argv[1], sys.argv[2]
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 'f32le', '-ac', '2', '-ar', str(sr), '-'], capture_output=True)
X = np.frombuffer(r.stdout, dtype=np.float32).astype(np.float64).reshape(-1, 2)

# ---- the notes' onsets (spectral flux on the mono mix, 1 ms hop), and the phrase from them
m = X.mean(axis=1); n, h = 512, 48; w = np.hanning(n)
S = np.array([np.abs(np.fft.rfft(m[i:i + n] * w)) for i in range(0, len(m) - n, h)])
flux = np.maximum(0, np.diff(np.log1p(S * 10), axis=0)).sum(1)
k9 = np.hanning(9); k9 /= k9.sum(); f = np.convolve(flux, k9, 'same')
t = (np.arange(len(f)) + 1) * h / sr + n / 2 / sr
thr = np.percentile(f, 97)
on = []
for i in range(5, len(f) - 5):
    if f[i] > thr and f[i] == f[i - 5:i + 6].max() and (not on or t[i] - on[-1] > 0.3): on.append(t[i])
assert len(on) >= 25, f'only {len(on)} onsets'
N1, N13, N25 = on[0], on[12], on[24]
PULSE = (N25 - N1) / 24; P = 12 * PULSE
print(f'onsets: note 1 {N1:.3f}, 13 {N13:.3f}, 25 {N25:.3f}; pulse {PULSE:.4f} s; phrase {P:.4f} s (fates2 used 10.25)')
A = 0.77                                         # just ahead of note 1, as fates2 had it
L = 2 * P; B = A + L                             # the loop's end: 0.14 s before note 25, as A is before note 1
assert N25 - B > 0.08, f'the loop would end {N25 - B:.3f} s before note 25'

def save(y, name, norm=0.89):
    y = y / (np.abs(y).max() + 1e-9) * norm
    p = f'{out}/{name}.wav'
    y.astype(np.float32).tofile(p + '.f32')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '2', '-i', p + '.f32', p], check=True)
    subprocess.run(['rm', '-f', p + '.f32'])
    print(f'{name}: {len(y) / sr:.3f} s')
sm = lambda k: k * k * (3 - 2 * k)

# ---- k5boxloop
a, b = int(round(A * sr)), int(round(B * sr))
loop = X[a:b].copy()
H = int(0.6 * sr); cont = X[b:b + H]; orig = X[a:a + H]
tt = np.arange(H) / sr; c = sm(np.clip((tt - 0.30) / 0.25, 0, 1))[:, None]
loop[:H] = cont * (1 - c) + orig * c
print(f'  k5boxloop joint: last sample -> first is the take itself (X[{b - 1}] -> X[{b}]); step {np.abs(loop[-1] - loop[0]).max():.4f}')
save(loop, 'k5boxloop')

# ---- k5lullroom: the tune (k5lullaby's own cut: 0.65 s on, a 0.05 s fade in) up to B, then the run-down from B
def read(y, pos):
    i0 = np.clip(np.floor(pos).astype(int), 0, len(y) - 2); fr = (pos - i0)[:, None]
    return y[i0] * (1 - fr) + y[i0 + 1] * fr
def fade(y, fin, fout):
    y = y.copy(); p, q = int(fin * sr), int(fout * sr)
    if p: y[:p] *= np.linspace(0, 1, p)[:, None]
    if q: y[-q:] *= (np.linspace(1, 0, q) ** 1.6)[:, None]
    return y
def verb(y, mix=0.18):
    o = y.copy()
    for k, (d, g) in enumerate([(0.031, 0.5), (0.047, 0.42), (0.071, 0.33), (0.113, 0.26), (0.167, 0.19), (0.241, 0.13)]):
        nn = int(d * sr); tt2 = np.zeros_like(y); tt2[nn:] = y[:-nn] * g; o += tt2 * mix * (1 if k % 2 == 0 else -1)
    return o
x = X[a:]
def rundown(D, r1, ring=1.8):                    # fates2's, unchanged: the phrase begun again, slowing, its tine ringing out
    nn = int(D * sr); tt2 = np.arange(nn) / sr; k = tt2 / D
    rate = 1.0 - (1.0 - r1) * (k * k * (3 - 2 * k))
    y = read(x, np.cumsum(rate))
    return np.vstack([fade(y, 0.0, 0.3), np.zeros((int(ring * sr), 2))])
down = fade(verb(rundown(5.0, 0.42), mix=0.2), 0.01, 0.6)
s0 = int(round(0.65 * sr))
tune = fade(X[s0:b].copy(), 0.05, 0.0)
# the two halves at the levels they were heard at (each was peak-normalised and played at 0.5 in the room)
tune = tune / (np.abs(tune).max() + 1e-9); down = down / (np.abs(down).max() + 1e-9)
ringN = int(0.09 * sr)
ringy = X[b:b + ringN].copy() / (np.abs(X[s0:b]).max() + 1e-9); ringy *= np.linspace(1, 0, ringN)[:, None]
room = np.vstack([tune, down])
room[len(tune):len(tune) + ringN] += ringy
RUNDOWN_AT = len(tune) / sr
print(f'  k5lullroom: the run-down begins {RUNDOWN_AT:.3f} s in; its first strike lands one pulse after note 24 (as note 25 would)')
save(room, 'k5lullroom')
