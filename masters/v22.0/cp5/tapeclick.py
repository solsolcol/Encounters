"""v22.0 CP5 · the cassette deck's STOP key: a mechanical click, synthesised (no generated take had one — all four
y4tapestop takes are music sagging the whole way, with no click at the end, and the tape's own slowing is now the
song's source slowing, through the bed rate seam). A 3 ms bright tick, the key's plastic ringing at 1.9 and 3.3 kHz,
and a dull 160 Hz body under it; 0.30 s, peak -1 dBFS before enc() matches it.
usage: python3 tapeclick.py out.wav"""
import subprocess, sys, numpy as np
sr = 48000; n = int(0.30 * sr); t = np.arange(n) / sr
rng = np.random.default_rng(4)
tick = rng.standard_normal(n) * np.exp(-t / 0.0012)
tick = np.diff(np.concatenate([[0], tick]))          # brighten (first difference)
ring = 0.85 * np.sin(2 * np.pi * 1900 * t) * np.exp(-t / 0.018) + 0.55 * np.sin(2 * np.pi * 3300 * t + 1.1) * np.exp(-t / 0.010)
body = 0.35 * np.sin(2 * np.pi * 160 * t) * np.exp(-t / 0.035) * (1 - np.exp(-t / 0.0015))
# a second, softer tick 45 ms later — the key latching
t2 = np.clip(t - 0.045, 0, None); on2 = (t >= 0.045)
tick2 = rng.standard_normal(n) * np.exp(-t2 / 0.0008) * on2 * 0.35
y = 0.9 * tick / (np.abs(tick).max() + 1e-9) + ring + body + tick2
y *= 10 ** (-1 / 20) / np.abs(y).max()
y.astype(np.float32).tofile(sys.argv[1] + '.f32')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '1', '-i', sys.argv[1] + '.f32', sys.argv[1]], check=True)
print(sys.argv[1], f'{n/sr:.2f}s')
