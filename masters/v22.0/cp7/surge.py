"""v22.0 CP7 · h4surge, built: no take of eight was a "transformer hum rising" a phone can play — round one's four are
98 % above 3 kHz (static, flat), round two's are 95 % under 120 Hz except c (a 120-250 Hz hum, flat, then a fade).
So the hum is c SPUN UP (read at a rate climbing 0.80 -> 1.40, the way a motor or a transformer under load climbs in
pitch and loudness together), SATURATED (tanh, so its odd harmonics land at 300 Hz-2 kHz: the buzz a phone does
play), high-passed at 140 Hz, and round one's d — the static — laid over it band-passed at 1.5-7 kHz, rising from
-26 dB to -14 dB under the hum: the crackle. Written as a 48 kHz WAV for encfns.sh."""
import subprocess, numpy as np, sys
SR = 48000
def load(p):
    b = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.float32).astype(np.float64)
def bq(x, f0, kind, q=0.707):
    # one RBJ biquad (high-pass or low-pass), run forward
    w = 2 * np.pi * f0 / SR; a = np.sin(w) / (2 * q); c = np.cos(w)
    if kind == 'hp': b0, b1, b2 = (1 + c) / 2, -(1 + c), (1 + c) / 2
    else: b0, b1, b2 = (1 - c) / 2, 1 - c, (1 - c) / 2
    a0, a1, a2 = 1 + a, -2 * c, 1 - a
    b0, b1, b2, a1, a2 = b0 / a0, b1 / a0, b2 / a0, a1 / a0, a2 / a0
    y = np.zeros_like(x); x1 = x2 = y1 = y2 = 0.0
    for i in range(len(x)):
        v = b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2
        x2, x1, y2, y1 = x1, x[i], y1, v; y[i] = v
    return y
hum = load(sys.argv[1]); st = load(sys.argv[2])
hum = hum[: int(2.2 * SR)]
n = int(2.4 * SR)
# read the hum at a rate climbing 0.80 -> 1.40: phi' = r(t), y(t) = hum(phi(t)) (a variable-speed reading)
t = np.arange(n) / SR; k = t / t[-1]
r = 0.80 + 0.60 * k ** 1.6
phi = np.cumsum(r) - r[0]
phi = np.clip(phi, 0, len(hum) - 2)
i0 = phi.astype(int); fr = phi - i0
y = hum[i0] * (1 - fr) + hum[i0 + 1] * fr
y = y / (np.abs(y).max() + 1e-9)
# loudness climbs with the pitch, then the saturation (the drive climbs too: the buzz thickens as it rises)
env = 0.35 + 0.65 * k ** 1.3
drive = 2.5 + 4.5 * k
y = np.tanh(drive * y * env) / np.tanh(drive)
y = bq(bq(y, 140, 'hp'), 140, 'hp')
# the crackle: round one's static, band-passed 1.5-7 kHz, rising -26 -> -14 dB under the hum
s = st[: n] if len(st) >= n else np.pad(st, (0, n - len(st)))
s = bq(bq(s, 1500, 'hp'), 7000, 'lp'); s = s / (np.abs(s).max() + 1e-9)
y = y + s * 10 ** ((-26 + 12 * k ** 1.2) / 20)
# ends: a 15 ms fade in, and the last 0.18 s let go
fi = int(0.015 * SR); y[:fi] *= np.linspace(0, 1, fi)
fo = int(0.18 * SR); y[-fo:] *= np.linspace(1, 0, fo) ** 2
y = y / (np.abs(y).max() + 1e-9) * 0.89
pcm = (np.clip(y, -1, 1) * 32767).astype('<i2').tobytes()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-', sys.argv[3]], input=pcm, check=True)
print('h4surge built', round(n / SR, 2), 's ->', sys.argv[3])
