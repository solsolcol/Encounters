"""v24.24 · turn a hushed, voiced take into a true whisper, keeping the voice's own shape.

Chad, 1 Nov 2026: the black master's chanting "cannot really hear and intelligible ... Like a whispering voice. But
still in the same thai voice." eleven_v4 with [whispering] gave this voice (Patinya) a HUSHED SPEECH, not a whisper:
68-75 % voiced, 4-6 % of the energy above 2 kHz, where the chapter's own real whisper (pg1eyes) reads 34 % and 19 %.

A whisper is the same mouth with no buzz from the voice box: the vocal tract's shape (the formants, which are what
make a voice that voice and a word that word) excited by breath instead of by the pitch pulses. So, frame by frame:
the spectral envelope is taken by cepstral smoothing (low quefrencies kept, the harmonics of the pitch thrown away),
and it is laid over complex Gaussian noise — the breath — then overlap-added. A gentle high-pass takes out the low
voicing a whisper does not have, and a tilt lifts the breath band the way an open, unvoiced throat does.

Usage: python3 -I whisperize.py in.wav out.wav [--lifter 70] [--tilt 3] [--seed 7]
in.wav mono, any rate (resampled by the caller to 48 kHz).
"""
import sys, wave, argparse
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('dst')
ap.add_argument('--lifter', type=int, default=70, help='cepstral cutoff in samples at 48 kHz (envelope resolution)')
ap.add_argument('--tilt', type=float, default=3.0, help='dB per octave above 1 kHz (breath brightness)')
ap.add_argument('--hp', type=float, default=260.0, help='high-pass corner, Hz')
ap.add_argument('--seed', type=int, default=7)
a = ap.parse_args()

with wave.open(a.src, 'rb') as w:
    sr, n, ch, sw = w.getframerate(), w.getnframes(), w.getnchannels(), w.getsampwidth()
    raw = w.readframes(n)
assert sw == 2, 'expects 16-bit PCM'
x = np.frombuffer(raw, dtype='<i2').astype(np.float64) / 32768.0
if ch > 1: x = x.reshape(-1, ch).mean(axis=1)

N, H = 1024, 256                                   # 21 ms frames, 75 % overlap at 48 kHz
win = np.hanning(N)
pad = np.concatenate([np.zeros(N), x, np.zeros(N)])
frames = 1 + (len(pad) - N) // H
out = np.zeros(len(pad)); norm = np.zeros(len(pad))
rng = np.random.default_rng(a.seed)
L = max(8, int(a.lifter * sr / 48000))
freqs = np.fft.rfftfreq(N, 1.0 / sr)
# the breath's colour: a high-pass (no voicing under it) and a tilt over 1 kHz
shape = 1.0 / np.sqrt(1.0 + (a.hp / np.maximum(freqs, 1.0)) ** 4)
shape *= np.where(freqs > 1000.0, (freqs / 1000.0) ** (a.tilt / 6.02), 1.0)
for i in range(frames):
    s = i * H
    seg = pad[s:s + N] * win
    S = np.fft.rfft(seg)
    mag = np.abs(S) + 1e-9
    cep = np.fft.irfft(np.log(mag), N)
    cep[L:N - L] = 0.0                              # keep the envelope, drop the pitch's harmonics
    env = np.exp(np.fft.rfft(cep).real)
    noise = (rng.standard_normal(len(env)) + 1j * rng.standard_normal(len(env))) / np.sqrt(2.0)
    y = np.fft.irfft(env * shape * noise, N) * win
    out[s:s + N] += y
    norm[s:s + N] += win ** 2
out = out[N:N + len(x)] / np.maximum(norm[N:N + len(x)], 1e-6)
# the envelope of a smoothed spectrum is above the harmonics' troughs: bring the whole back to the source's loudness
rs = lambda v: np.sqrt(np.mean(v ** 2) + 1e-12)
out *= rs(x) / rs(out)
pk = np.max(np.abs(out))
if pk > 0.98: out *= 0.98 / pk
with wave.open(a.dst, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes((np.clip(out, -1, 1) * 32767).astype('<i2').tobytes())
print(f'{a.dst}: {len(x) / sr:.2f} s, lifter {L}, tilt {a.tilt} dB/oct, hp {a.hp} Hz')
