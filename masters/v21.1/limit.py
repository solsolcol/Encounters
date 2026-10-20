# v21.1 · ST-7: a lookahead peak limiter for an OPUS source only. libopus
# reconstructs a few transients above what it was given (dv3father: the cast
# chain's -1.50 dBFS ceiling came back +0.64 in float, one sample over full
# scale), so the Opus encode is fed the same levelled WAV with its few highest
# peaks held under CEIL. Only those peaks move: the RMS stays where level.py
# put it. Usage: limit.py in.wav out.wav CEIL_dBFS
import subprocess, sys, numpy as np
sr = 48000; CEIL = 10 ** (float(sys.argv[3]) / 20)
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-f', 'f32le', '-ac', '1', '-ar', str(sr), '-'], capture_output=True)
x = np.frombuffer(r.stdout, dtype=np.float32).astype(np.float64)
pk = np.abs(x); win = int(0.005 * sr)
need = np.minimum(1.0, CEIL / np.maximum(pk, 1e-9))
lim = np.minimum.reduce([np.roll(need, -k) for k in range(win)])
a_rel = np.exp(-1 / (float(sys.argv[4]) if len(sys.argv) > 4 else 0.015) / sr); g = np.empty(len(x)); cur = 1.0
for i, n in enumerate(lim):
    cur = n if n < cur else n + a_rel * (cur - n)
    g[i] = cur
y = x * g
def rms(v): return 20 * np.log10(np.sqrt((v ** 2).mean()) + 1e-12)
print('limit: rms %.2f -> %.2f dBFS, peak %.2f -> %.2f dBFS' % (rms(x), rms(y), 20 * np.log10(pk.max()), 20 * np.log10(np.abs(y).max())))
y.astype(np.float32).tofile(sys.argv[2] + '.f32')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '1', '-i', sys.argv[2] + '.f32', sys.argv[2]], check=True)
subprocess.run(['rm', '-f', sys.argv[2] + '.f32'])
