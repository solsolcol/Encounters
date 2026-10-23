"""v22.0 CP5 · the Yin shop's song, from ONE hummed take (raw/y4songhum_a.mp3: a young woman humming a minor-key
lullaby, two 4 s phrases that alternate, a breath between each — measured: the breaths end at 4.96, 8.94, 12.96,
16.98, 20.98, 24.92, 28.94, 32.96 s, so a phrase pair is 8.0 s).

  y4song  the cassette radio on the counter: THREE phrase pairs cut breath to breath (8.88 -> 32.88 s, 24.00 s),
          through a small speaker — a soft saturation (so a phone, which plays her 216-330 Hz hum only weakly, hears its
          harmonics), a band 330 Hz - 3.8 kHz with a small-speaker honk at 1.6 kHz, tape wow (0.54 Hz) and flutter
          (7.3 Hz) as a moving delay, and tape hiss. Every moving part is PERIODIC in the loop's length (an integer
          number of cycles; the hiss crossfaded over its own head), so the bed loops without a seam.
  y4hum   the same voice with no tape and no speaker — one phrase pair (16.76 -> 24.70 s), close, a little
          presence added above 600 Hz so a phone can hear her; played beside him, panned to where she stands.

Levels are by RMS (level_rms.py): the song -19 dBFS / ceiling -4, the hum -20 / ceiling -5. Writes WAVs at 48 kHz.
usage: python3 song.py raw/y4songhum_a.mp3 out_song.wav out_hum.wav"""
import subprocess, sys, numpy as np
sr = 48000
src, out_song, out_hum = sys.argv[1], sys.argv[2], sys.argv[3]
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 'f32le', '-ac', '1', '-ar', str(sr), '-'], capture_output=True)
x = np.frombuffer(r.stdout, dtype=np.float32).astype(np.float64)

def biquad(y, kind, f, q=0.707, gain_db=0.0):
    w0 = 2 * np.pi * f / sr; cw, sw = np.cos(w0), np.sin(w0); al = sw / (2 * q); A = 10 ** (gain_db / 40)
    if kind == 'hp':   b = [(1 + cw) / 2, -(1 + cw), (1 + cw) / 2]; a = [1 + al, -2 * cw, 1 - al]
    elif kind == 'lp': b = [(1 - cw) / 2, 1 - cw, (1 - cw) / 2]; a = [1 + al, -2 * cw, 1 - al]
    else:              b = [1 + al * A, -2 * cw, 1 - al * A]; a = [1 + al / A, -2 * cw, 1 - al / A]   # peaking
    b = np.array(b) / a[0]; a = np.array(a) / a[0]
    out = np.zeros_like(y); x1 = x2 = y1 = y2 = 0.0
    for i, v in enumerate(y):
        o = b[0] * v + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2
        x2, x1, y2, y1 = x1, v, y1, o; out[i] = o
    return out

def rms(y): return 20 * np.log10(np.sqrt((y ** 2).mean()) + 1e-12)
def save(y, path):
    y.astype(np.float32).tofile(path + '.f32')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '1', '-i', path + '.f32', path], check=True)

# ---- y4song: the radio
a, b = int(8.88 * sr), int(32.88 * sr)
xf = int(0.12 * sr)
seg = x[a:b + xf].copy()
L = b - a
# breath to breath, so the joint is two near-silences; crossfade the overhang over the head anyway
k = np.linspace(0, 1, xf)
seg[:xf] = seg[:xf] * k + seg[L:L + xf] * (1 - k)
seg = seg[:L]
T = L / sr
# wow + flutter: a moving delay, periodic in T
f_wow = round(0.54 * T) / T; f_fl = round(7.3 * T) / T
t = np.arange(L) / sr
dly = 0.004 + 0.0016 * np.sin(2 * np.pi * f_wow * t) + 0.00008 * np.sin(2 * np.pi * f_fl * t + 0.7)
pos = (np.arange(L) - dly * sr) % L          # read the loop circularly, so the delay wraps with it
i0 = np.floor(pos).astype(int); fr = pos - i0
y = seg[i0] * (1 - fr) + seg[(i0 + 1) % L] * fr
# the speaker
y = y / (np.abs(y).max() + 1e-9)
drive = 6.0
y = np.tanh(drive * y) / np.tanh(drive)
y = biquad(y, 'hp', 330, 0.8); y = biquad(y, 'hp', 330, 0.8)
y = biquad(y, 'lp', 3800, 0.8); y = biquad(y, 'lp', 3800, 0.8)
y = biquad(y, 'pk', 1600, 1.0, 6.0)
# tape hiss: noise over 2 kHz, periodic (its tail crossfaded over its head)
rng = np.random.default_rng(22)
n = rng.standard_normal(L + xf)
n = biquad(n, 'hp', 2000, 0.7); n = biquad(n, 'lp', 9000, 0.7)
n[:xf] = n[:xf] * k + n[L:L + xf] * (1 - k); n = n[:L]
n *= 10 ** ((rms(y) - 34 - rms(n)) / 20)       # 34 dB under the music
y = y + n
save(y, out_song + '.raw.wav')
print(f'{out_song}: loop {T:.3f}s  wow {f_wow:.4f} Hz ({round(f_wow*T)} cycles)  flutter {f_fl:.4f} Hz  music RMS {rms(y):.1f}')

# ---- y4hum: her, close
a, b = int(16.76 * sr), int(24.70 * sr)
h = x[a:b].copy()
ni, no = int(0.05 * sr), int(0.4 * sr)
h[:ni] *= np.linspace(0, 1, ni); h[-no:] *= np.linspace(1, 0, no)
pres = biquad(np.tanh(5.0 * h / (np.abs(h).max() + 1e-9)), 'hp', 600, 0.7)
h = h / (np.abs(h).max() + 1e-9) + 0.70 * pres
h = biquad(h, 'hp', 90, 0.7)
save(h, out_hum + '.raw.wav')
print(f'{out_hum}: {len(h)/sr:.2f}s')
