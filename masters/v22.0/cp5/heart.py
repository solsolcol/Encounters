"""v22.0 CP5d · y4heart, the heartbeat he hears while the cold takes him (kit.pulse plays it on every beat).
From raw/y4heart_d.mp3 — of four takes the only one with real body above the sub-bass (41 % in 120-500 Hz; a, b
and c are 76-99 % under 120 Hz, which a phone speaker cannot play at all) and a clear LUB at 0.02 s and DUB at
0.21 s. Cut 0.00 -> 0.70 s (the dub's tail is down 45 dB by then), faded out over the last 0.18 s.
A phone still plays almost none of a heartbeat's fundamental (45-90 Hz), so the thump is given HARMONICS it can
play: the low band (under 220 Hz) is driven through a soft saturation, band-passed 140-900 Hz and laid under the
original at -6 dB — the ear fills the missing fundamental back in from its harmonics (the missing-fundamental
effect), so a phone hears a heartbeat where it would hear nothing. Levelled by peak to -3 dBFS in make.sh.
usage: python3 heart.py raw/y4heart_d.mp3 out.wav"""
import subprocess, sys, numpy as np
sr = 48000
src, out = sys.argv[1], sys.argv[2]
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 'f32le', '-ac', '1', '-ar', str(sr), '-'], capture_output=True)
x = np.frombuffer(r.stdout, dtype=np.float32).astype(np.float64)

def biquad(y, kind, f, q=0.707, gain_db=0.0):
    w0 = 2 * np.pi * f / sr; cw, sw = np.cos(w0), np.sin(w0); al = sw / (2 * q); A = 10 ** (gain_db / 40)
    if kind == 'hp':   b = [(1 + cw) / 2, -(1 + cw), (1 + cw) / 2]; a = [1 + al, -2 * cw, 1 - al]
    elif kind == 'lp': b = [(1 - cw) / 2, 1 - cw, (1 - cw) / 2]; a = [1 + al, -2 * cw, 1 - al]
    else:              b = [1 + al * A, -2 * cw, 1 - al * A]; a = [1 + al / A, -2 * cw, 1 - al / A]   # peaking
    b = np.array(b) / a[0]; a = np.array(a) / a[0]
    o = np.zeros_like(y); x1 = x2 = y1 = y2 = 0.0
    for i, v in enumerate(y):
        z = b[0] * v + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2
        x2, x1, y2, y1 = x1, v, y1, z; o[i] = z
    return o

n = int(0.70 * sr)
y = x[:n].copy()
fo = int(0.18 * sr); y[-fo:] *= np.linspace(1, 0, fo) ** 1.5
y = y / (np.abs(y).max() + 1e-9)
low = biquad(biquad(y, 'lp', 220, 0.7), 'lp', 220, 0.7)
h = np.tanh(7.0 * low / (np.abs(low).max() + 1e-9))
h = biquad(biquad(h, 'hp', 140, 0.7), 'hp', 140, 0.7)
h = biquad(biquad(h, 'lp', 900, 0.7), 'lp', 900, 0.7)
h = biquad(h, 'pk', 320, 1.0, 3.0)
y = y + 0.5 * h / (np.abs(h).max() + 1e-9)
y = biquad(y, 'hp', 28, 0.7)                     # nothing below hearing
y = y / (np.abs(y).max() + 1e-9) * 0.7
y.astype(np.float32).tofile(out + '.f32')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '1', '-i', out + '.f32', out], check=True)
print(f'{out}: {n/sr:.2f}s')
