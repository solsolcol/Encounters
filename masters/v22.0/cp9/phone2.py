"""v22.0 CP9 (a copy of cp8/phone.py with two options, so the shipped CP8 recipe stays exactly as it ran):
  --ringshape fall   the ear-ring starts at full and dies away (hearing coming back), instead of swelling in and out
  --clear S          the take starts MUFFLED (a 380 Hz low-pass) and clears to full over its first S seconds
v22.0 CP8 · lift a sub-bass take into the band a phone plays (the v10.4 law: under 120 Hz a phone's speaker plays
almost nothing). Every take of the giant's step, his breath, the serpent's hiss, the turning presences and the ear
pressure came back 77-100 % under 120 Hz — on the only device Chad plays on, silence. So: the original high-passed at
45 Hz (its weight kept for headphones) under a SATURATED copy (tanh: the odd harmonics of a 40-60 Hz thud land at
120 Hz-1 kHz) high-passed at 150 Hz, which carries the loudness on a phone; optionally a faint ear-ring (a sine that
fades in and out) for the pressure in the ears. Time-aligned by construction (no pitch shift, nothing moves).
usage: python3 phone.py in out.wav [--drive 5] [--mix 0.75] [--ring HZ --ringdb DB] [--trim A:B] [--fadein S] [--fadeout S]
writes a 48 kHz mono WAV, peak 0.89, for encfns.sh's enc."""
import subprocess, sys, numpy as np
SR = 48000
args = sys.argv[1:]
inp, outp = args[0], args[1]
opt = {}
i = 2
while i < len(args):
    opt[args[i].lstrip('-')] = args[i + 1]; i += 2
drive = float(opt.get('drive', 5)); mix = float(opt.get('mix', 0.75))
def load(p):
    b = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.float32).astype(np.float64)
def bq(x, f0, kind, q=0.707):
    w = 2 * np.pi * f0 / SR; a = np.sin(w) / (2 * q); c = np.cos(w)
    if kind == 'hp': b0, b1, b2 = (1 + c) / 2, -(1 + c), (1 + c) / 2
    else: b0, b1, b2 = (1 - c) / 2, 1 - c, (1 - c) / 2
    a0, a1, a2 = 1 + a, -2 * c, 1 - a
    b0, b1, b2, a1, a2 = b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0
    y = np.zeros_like(x); x1 = x2 = y1 = y2 = 0.0
    for k in range(len(x)):
        v = b0 * x[k] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2
        x2, x1, y2, y1 = x1, x[k], y1, v; y[k] = v
    return y
x = load(inp)
if 'trim' in opt:
    a, b = (float(v) for v in opt['trim'].split(':'))
    x = x[int(a * SR):int(b * SR)]
x = x / (np.abs(x).max() + 1e-9)
body = bq(x, 45, 'hp')
sat = np.tanh(drive * x) / np.tanh(drive)
sat = bq(bq(sat, 150, 'hp'), 150, 'hp')
sat = bq(sat, 5000, 'lp')
sat = sat / (np.abs(sat).max() + 1e-9)
y = body * (1 - mix) + sat * mix
if 'clear' in opt:                                  # muffled -> clear: a smoothstep crossfade from a low-passed copy
    cs = float(opt['clear']); t = np.arange(len(y)) / SR; c = np.clip(t / cs, 0, 1); c = c * c * (3 - 2 * c)
    lp = bq(bq(y, 380, 'lp'), 380, 'lp')
    y = lp * (1 - c) + y * c
if 'ring' in opt:                                   # a faint ringing in the ears, swelling in and out
    hz = float(opt['ring']); lv = 10 ** (float(opt.get('ringdb', -30)) / 20)
    t = np.arange(len(y)) / SR; T = t[-1]
    if opt.get('ringshape') == 'fall': env = np.clip(t / 0.08, 0, 1) * np.clip(1 - t / T, 0, 1) ** 1.6
    else: env = np.clip(t / (0.45 * T), 0, 1) ** 2 * np.clip((T - t) / (0.25 * T), 0, 1)
    y = y + lv * env * np.sin(2 * np.pi * hz * t) * (1 + 0.04 * np.sin(2 * np.pi * 0.7 * t))
fi = int(float(opt.get('fadein', 0.01)) * SR)
if fi: y[:fi] *= np.linspace(0, 1, fi)
fo = int(float(opt.get('fadeout', 0.15)) * SR)
if fo: y[-fo:] *= np.linspace(1, 0, fo) ** 2
y = y / (np.abs(y).max() + 1e-9) * 0.89
pcm = (np.clip(y, -1, 1) * 32767).astype('<i2').tobytes()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-', outp], input=pcm, check=True)
spec = np.abs(np.fft.rfft(y)) ** 2; fr = np.fft.rfftfreq(len(y), 1 / SR); tot = spec.sum() + 1e-12
print('%-22s %.2fs  under 120 Hz %.0f %%, 150 Hz-3 kHz %.0f %%' % (outp, len(y) / SR, 100 * spec[fr < 120].sum() / tot,
      100 * spec[(fr >= 150) & (fr < 3000)].sum() / tot))
