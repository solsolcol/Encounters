"""v21.0 · ready a picked take for its chain: mono 48 kHz WAV, optionally with
its head trimmed (a blip before the words), its tail cut (a long silence
after them) and its last stretch faded (a take that ends ON signal clicks).
Usage: python3 prep.py SRC OUT [--head S] [--keep S] [--fade S]"""
import subprocess, sys, numpy as np, wave
a = sys.argv[1:]; src, out = a[0], a[1]
opt = {k: float(v) for k, v in zip(a[2::2], a[3::2])}
b = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', src, '-ac', '1', '-ar', '48000', '-f', 'f32le', '-'], capture_output=True).stdout
x = np.frombuffer(b, np.float32).copy(); sr = 48000
h = int(opt.get('--head', 0) * sr)
if h: x = x[h:]
if '--keep' in opt: x = x[:int(opt['--keep'] * sr)]
f = int(opt.get('--fade', 0) * sr)
if f: x[-f:] *= np.linspace(1, 0, f) ** 1.5
x = np.clip(x, -1, 1)
w = wave.open(out, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
w.writeframes((x * 32767).astype(np.int16).tobytes()); w.close()
print(f'{out}: {len(x)/sr:.2f} s')
