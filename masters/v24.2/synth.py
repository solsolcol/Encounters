"""v24.2 (v24.3's sound) · the three sounds that are MADE HERE rather than generated, because every generated take of
them failed the measure (masters/v24.2/sfx/meas.txt), and each is a simple physical sound a few lines of arithmetic make
exactly — written down so nobody re-generates them hoping for better:
  k5void   ending C's "nothing answers": both takes were 99 % under 120 Hz (a phone plays them as nothing; b is −54 dBFS
           whole). Made: the room's air dropping out (a soft band-passed breath falling 1.2 kHz -> 300 Hz in 0.35 s) and,
           out of it, a faint high ringing in the ears (3.1 kHz with a 4.3 Hz beat against a second partial), fading
           over 2.6 s
  k5flame  the lighter held to the sticks: both takes were lighter CLICKS with silence between (b's 1.8 s between its
           clicks measures −62 dBFS), not a flame. Made: a small butane flame — noise band-passed 1.8–6.5 kHz with a
           roar under it at 300–900 Hz, flickering at 7–13 Hz from a fixed seed, 2.2 s with soft ends
  k5heart  the heartbeat under the three openings (plan §4.3): both takes were 94–95 % under 120 Hz AND irregular (their
           beats 0.3–1.2 s apart), so there was no even loop to cut. Made: a lub-dub at 54/min, each sound a decaying
           58 / 46 Hz body with its harmonics to 1.2 kHz and a soft valve click, so a phone hears it (the e4c1 lesson,
           v24.0's w4heart) — 9 beats, an exact loop of 10.0 s
usage: python3 synth.py outdir"""
import subprocess, sys, numpy as np
sr = 48000
out = sys.argv[1]
rng = np.random.default_rng(0x2425)

def save(y, name, ch=1):
    y = np.asarray(y, dtype=np.float64)
    y = y / (np.abs(y).max() + 1e-9) * 0.89
    p = f'{out}/{name}.wav'
    y.astype(np.float32).tofile(p + '.f32')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', str(ch), '-i', p + '.f32', p], check=True)
    subprocess.run(['rm', '-f', p + '.f32'])
    print(f'{name}: {len(y) / sr / ch:.2f} s')

def bandnoise(n, lo, hi):
    X = np.fft.rfft(rng.standard_normal(n)); f = np.fft.rfftfreq(n, 1 / sr)
    X[(f < lo) | (f > hi)] = 0
    y = np.fft.irfft(X, n); return y / (np.abs(y).max() + 1e-9)

def sweepnoise(n, f0, f1):            # noise through a band whose centre glides f0 -> f1: a short-time FFT, overlap-added
    W, H = 1024, 256; win = np.hanning(W); base = rng.standard_normal(n + W)
    y = np.zeros(n + W); norm = np.zeros(n + W); f = np.fft.rfftfreq(W, 1 / sr)
    for i in range(0, n, H):
        fc = f0 * (f1 / f0) ** (i / n)
        X = np.fft.rfft(base[i:i + W] * win) * np.exp(-0.5 * (np.log(np.maximum(f, 1) / fc) / 0.45) ** 2)
        y[i:i + W] += np.fft.irfft(X, W) * win; norm[i:i + W] += win ** 2
    y = (y / np.maximum(norm, 1e-6))[:n]
    return y / (np.abs(y).max() + 1e-9)

# ---- k5void
n = int(3.0 * sr); t = np.arange(n) / sr
air = sweepnoise(n, 1200, 300) * np.exp(-t / 0.18) * np.minimum(1, t / 0.02)
ring = (np.sin(2 * np.pi * 3100 * t) + 0.55 * np.sin(2 * np.pi * 3104.3 * t) + 0.18 * np.sin(2 * np.pi * 6200 * t))
renv = np.clip((t - 0.12) / 0.5, 0, 1) ** 1.5 * np.exp(-np.maximum(0, t - 0.62) / 0.95)
y = 0.9 * air + 0.16 * ring * renv
y[-int(0.05 * sr):] *= np.linspace(1, 0, int(0.05 * sr))
save(y, 'k5void')

# ---- k5flame
n = int(2.2 * sr); t = np.arange(n) / sr
hiss = bandnoise(n, 1800, 6500); roar = bandnoise(n, 300, 900)
fl = np.zeros(n); ph = 0.0; f = 9.0
for i in range(0, n, 480):                                       # flicker: a wandering 7–13 Hz wobble
    f = np.clip(f + rng.uniform(-0.6, 0.6), 7, 13)
    seg = np.arange(min(480, n - i)) / sr
    fl[i:i + len(seg)] = 0.5 + 0.5 * np.sin(2 * np.pi * f * seg + ph); ph += 2 * np.pi * f * 480 / sr
env = np.minimum(1, t / 0.12) * np.minimum(1, (2.2 - t) / 0.35)
y = (0.7 * hiss * (0.75 + 0.25 * fl) + 0.45 * roar * (0.6 + 0.4 * fl)) * env
save(y, 'k5flame')

# ---- k5heart: 9 beats at 54/min = 10.0 s, an exact loop
P = 60 / 54; N = 9; n = int(round(N * P * sr)); y = np.zeros(n)
def thump(f0, dur, amp):
    m = int(dur * sr); tt = np.arange(m) / sr
    e = np.minimum(1, tt / 0.006) * np.exp(-tt / (dur / 4.5))
    body = np.sin(2 * np.pi * f0 * tt * (1 - 0.18 * tt / dur))   # the pitch sags a little as it dies
    # the partials a phone CAN play carry the beat: 3rd to 14th at 1/k^0.6, dying faster than the body
    harm = sum((1.1 / k ** 0.6) * np.sin(2 * np.pi * f0 * k * tt + 0.7 * k) for k in range(3, 15)) * np.exp(-tt / (dur / 7))
    click = bandnoise(m, 450, 1600) * np.exp(-tt / 0.016) * 1.1
    return amp * e * (0.8 * body + 0.55 * harm) + amp * click
for b in range(N):
    s = int(b * P * sr)
    for (dt, f0, dur, amp) in ((0.0, 58, 0.16, 1.0), (0.29, 46, 0.13, 0.62)):
        th = thump(f0, dur, amp); a = s + int(dt * sr); e = min(n, a + len(th))
        y[a:e] += th[:e - a]
        if a + len(th) > n: y[:a + len(th) - n] += th[e - a:]       # the wrap: the loop's joint is a beat like any other
save(y, 'k5heart')
