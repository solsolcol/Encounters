"""v24.24 · build a whispered chant from whispered PHRASES, each cut from its own take at its measured edges.

Why phrases: eleven_v4 whispers this voice (Patinya, the first master) only in the first phrases of a take and drifts
back to a voiced read after ~13 s or at the trade formula (r3, every take: the homage 4-18 % voiced, the formula and
the closing line after it 64-82 %; r2a: 22 % in the first phrase, 41-59 % after). A take of ONE phrase whispers through
(r4f: the formula 9-24 %, r4m: the closing line 4-23 %). So each chant is laid phrase by phrase:
  - each piece cut from LEAD s before its first word to TAIL s after its last (the words' edges by meas.py's 3 % gate)
  - each piece brought to the same RMS over its loud frames (the takes come back at different levels)
  - a silence of GAP s between pieces: with the margins, ~0.52 s from one phrase's last breath to the next one's first,
    the model's own breath inside r3_a (0.46-0.56 s)
Usage: python3 -I assemble.py out.wav src.mp3:start:end [src.mp3:start:end ...]
   (start/end are the cut in seconds; the 10 ms edges are faded so a cut is never a click)"""
import subprocess, sys, wave
import numpy as np

SR, GAP, EDGE = 48000, 0.34, 0.010
out, specs = sys.argv[1], sys.argv[2:]

def load(p):
    b = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                       capture_output=True, check=True).stdout
    return np.frombuffer(b, np.float32).astype(np.float64)

def loud_rms(y):
    n = int(0.04 * SR)
    fr = [y[i:i + n] for i in range(0, len(y) - n, n // 2)]
    r = np.array([np.sqrt(np.mean(f ** 2)) for f in fr])
    keep = r[r > r.max() * 0.25]
    return float(np.sqrt(np.mean(keep ** 2)))

pieces = []
for s in specs:
    path, a, b = s.rsplit(':', 2)
    x = load(path)
    y = x[int(float(a) * SR):int(float(b) * SR)].copy()
    e = int(EDGE * SR); ramp = np.linspace(0, 1, e)
    y[:e] *= ramp; y[-e:] *= ramp[::-1]
    pieces.append((path.split('/')[-1], float(a), float(b), y))

ref = np.median([loud_rms(y) for *_, y in pieces])
parts = []
for i, (name, a, b, y) in enumerate(pieces):
    g = ref / loud_rms(y)
    print(f'  {name} {a:.2f}-{b:.2f} ({b - a:.2f} s)  gain {20 * np.log10(g):+.1f} dB')
    parts.append(y * g)
    if i < len(pieces) - 1:
        parts.append(np.zeros(int(GAP * SR)))
z = np.concatenate(parts)
pk = np.abs(z).max()
if pk > 0.95: z *= 0.95 / pk
with wave.open(out, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(z, -1, 1) * 32767).astype('<i2').tobytes())
print(f'{out}: {len(z) / SR:.2f} s from {len(pieces)} phrases')
