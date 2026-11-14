"""v26.12 · a candidate take levelled for Chad's ear (v10.6: anything chosen on taste goes to him as loudness-matched
previews of every candidate): its level WHERE IT SOUNDS (the RMS of its 50 ms frames within 30 dB of its loudest) set
to TARGET dBFS, a 5 ms lookahead limiter holding its peaks under CEIL (numpy: ffmpeg's alimiter does not hold, v10.7).
usage: python3 -I level.py in.mp3 out.wav TARGET CEIL"""
import subprocess, sys
import numpy as np
SR = 44100
inp, outp, TARGET, CEIL = sys.argv[1], sys.argv[2], float(sys.argv[3]), 10 ** (float(sys.argv[4]) / 20)
x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', inp, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'],
                                 capture_output=True).stdout, dtype=np.float32).reshape(-1, 2).astype(np.float64)
h = int(0.05 * SR); fr = np.array([np.sqrt((x[i:i + h] ** 2).mean()) for i in range(0, len(x) - h, h)])
live = fr[fr > fr.max() * 10 ** (-30 / 20)]; lvl = 20 * np.log10(np.sqrt((live ** 2).mean()) + 1e-12)
x *= 10 ** ((TARGET - lvl) / 20)
pk = np.abs(x).max(1); need = np.minimum(1.0, CEIL / np.maximum(pk, 1e-9)); win = int(0.005 * SR)
lim = np.minimum.reduce([np.roll(need, -k) for k in range(win)]); g = np.empty(len(x)); cur = 1.0; rel = np.exp(-1 / (0.08 * SR))
for i, v in enumerate(lim):
    cur = v if v < cur else v + rel * (cur - v); g[i] = cur
x *= g[:, None]
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f64le', '-ac', '2', '-ar', str(SR), '-i', '-', outp], input=x.astype(np.float64).tobytes(), check=True)
print('%s: where it sounds %.1f -> %.1f dBFS, peak %.1f dBFS' % (inp.split('/')[-1], lvl, TARGET, 20 * np.log10(np.abs(x).max() + 1e-12)))
