"""v24.5 (R1-4) · the lighter's flame as a LOOP. v24.3's k5flame was a 2.2 s one-shot at the second tap, and the flame
burns on through the hold that lights the sticks and up to the wave that puts it out — for most players a silent flame
from the middle of the hold. k5flameloop is the same small butane flame (synth.py's recipe: noise band-passed
1.8-6.5 kHz with a roar under it at 300-900 Hz, flickering at 7-13 Hz) made EXACTLY PERIODIC — band noise from one FFT
frame is circular, and the flicker is a sum of tones at whole multiples of 1/T — so it loops with no joint at all; the
chapter raises it as a bed while the flame is lit (padded for the engine by padloop.py).
usage: python3 synth2.py outdir"""
import subprocess, sys, numpy as np
sr = 48000
out = sys.argv[1]
rng = np.random.default_rng(0x2455)
T = 3.0; n = int(T * sr); t = np.arange(n) / sr
def bandnoise(lo, hi):                       # circular: irfft of one frame is periodic in n
    X = np.fft.rfft(rng.standard_normal(n)); f = np.fft.rfftfreq(n, 1 / sr)
    X[(f < lo) | (f > hi)] = 0
    y = np.fft.irfft(X, n); return y / (np.abs(y).max() + 1e-9)
hiss = bandnoise(1800, 6500); roar = bandnoise(300, 900)
fl = np.zeros(n)
for k, a in ((22, 0.38), (27, 0.3), (32, 0.2), (37, 0.12)):      # 7.33, 9.00, 10.67, 12.33 Hz: whole multiples of 1/3 Hz
    fl += a * np.sin(2 * np.pi * (k / T) * t + rng.uniform(0, 2 * np.pi))
fl = 0.5 + 0.5 * fl / np.abs(fl).max()
y = 0.7 * hiss * (0.75 + 0.25 * fl) + 0.45 * roar * (0.6 + 0.4 * fl)
y = y / (np.abs(y).max() + 1e-9) * 0.89
step = abs(y[-1] - y[0]); typ = np.median(np.abs(np.diff(y)))
print(f'k5flameloop: {T:.1f} s, its joint steps {step:.4f} against a typical {typ:.4f}')
p = f'{out}/k5flameloop.wav'
y.astype(np.float32).tofile(p + '.f32')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '1', '-i', p + '.f32', p], check=True)
subprocess.run(['rm', '-f', p + '.f32'])
