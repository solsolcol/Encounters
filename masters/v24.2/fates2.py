"""v24.2 (v24.3's sound) · three more of the music box, made offline from its own tune exactly as v23.0's fates.py made
the others (masters/v23.0/music/raw/k5lullaby_b.mp3: C major, 3/4 at 72/min, its phrase 10.25 s long and played twice,
the first note at 0.82 s — masters/v23.0/music/tune.py). Nothing here is generated.
  k5boxloop  the box PLAYING ON at the counter (L3-3: the drum turned for minutes after a 24 s tune): exactly two phrases,
             0.77 -> 21.27 s of the take, with the last note's own ring laid over the head, so the joint is the next
             phrase starting under the last one's ring — as a box does (20.50 s)
  k5boxdown  the box in his room RUNNING DOWN after its tune (L3-3, the room's half): the phrase begun again and slowing,
             1.0 -> 0.42 over 5.0 s (pitch and tempo together), its last tine ringing out — gentle, no unevenness (the
             governor's wobble is ending A's, the bad one)
  k5endA     RE-MADE SHORTER (L3-2): A's box running down in 5.0 s, not 12.5 — 1.0 -> 0.27 with the governor's
             unevenness, stopping about 3 s into the phrase (before it can end), the last tine ringing 1.8 s; v23.0's
             12.5 s take was faded out at 0.6x speed and its stop was never heard
usage: python3 fates2.py masters/v23.0/music/raw/k5lullaby_b.mp3 outdir"""
import subprocess, sys, numpy as np
sr = 48000
src, out = sys.argv[1], sys.argv[2]
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 'f32le', '-ac', '2', '-ar', str(sr), '-'], capture_output=True)
X = np.frombuffer(r.stdout, dtype=np.float32).astype(np.float64).reshape(-1, 2)
A, PH = 0.77, 10.25                          # the first phrase's start, just ahead of its first note (0.82), and its length

def read(y, pos):
    i0 = np.clip(np.floor(pos).astype(int), 0, len(y) - 2); fr = (pos - i0)[:, None]
    return y[i0] * (1 - fr) + y[i0 + 1] * fr
def fade(y, fin, fout):
    y = y.copy(); a, b = int(fin * sr), int(fout * sr)
    if a: y[:a] *= np.linspace(0, 1, a)[:, None]
    if b: y[-b:] *= (np.linspace(1, 0, b) ** 1.6)[:, None]
    return y
def verb(y, mix=0.18):
    o = y.copy()
    for k, (d, g) in enumerate([(0.031, 0.5), (0.047, 0.42), (0.071, 0.33), (0.113, 0.26), (0.167, 0.19), (0.241, 0.13)]):
        n = int(d * sr); t = np.zeros_like(y); t[n:] = y[:-n] * g; o += t * mix * (1 if k % 2 == 0 else -1)
    return o
def save(y, name):
    y = y / (np.abs(y).max() + 1e-9) * 0.89
    p = f'{out}/{name}.wav'
    y.astype(np.float32).tofile(p + '.f32')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '2', '-i', p + '.f32', p], check=True)
    subprocess.run(['rm', '-f', p + '.f32'])
    print(f'{name}: {len(y) / sr:.2f} s')

# ---- the loop: two phrases, the tail of the second rung over the head of the first
a, b = int(A * sr), int((A + 2 * PH) * sr); RING = int(1.6 * sr)
loop = X[a:b].copy(); tail = X[b:b + RING].copy()
tail *= (np.linspace(1, 0, len(tail)) ** 1.3)[:, None]
loop[:len(tail)] += tail                    # (no fade at the head: what plays there is the last phrase's ring)
save(loop, 'k5boxloop')

x = X[a:]
def rundown(D, r1, wobble, seed, ring=1.8):
    n = int(D * sr); t = np.arange(n) / sr; k = t / D
    rate = 1.0 - (1.0 - r1) * (k * k * (3 - 2 * k))
    if wobble: rate *= 1 + wobble * np.sin(2 * np.pi * 2.6 * t) * k
    pos = np.cumsum(rate)
    y = read(x, pos)
    print(f'  reads {pos[-1] / sr:.2f} s of the {PH:.2f} s phrase')
    return np.vstack([fade(y, 0.0, 0.3), np.zeros((int(ring * sr), 2))])
save(fade(verb(rundown(5.0, 0.42, 0.0, 1), mix=0.2), 0.01, 0.6), 'k5boxdown')
save(fade(verb(rundown(5.0, 0.27, 0.018, 2), mix=0.22), 0.01, 0.5), 'k5endA')
