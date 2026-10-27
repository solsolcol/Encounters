"""v23.1 · a one-shot made LOUDER without a gain over 1 (which clips once it sums with what plays beside it): its body
raised by RMS to TARGET with a 5 ms lookahead peak limiter at CEIL (v10.7's loud.py, mono, no crest compressor — a
stomp's attack is the stomp). Usage: python3 louder.py in.wav out.wav TARGET_dBFS CEIL_dBFS"""
import subprocess, sys, numpy as np
src, dst, TARGET, CEILDB = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
sr = 48000; CEIL = 10 ** (CEILDB / 20)
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 'f32le', '-ac', '1', '-ar', str(sr), '-'], capture_output=True, check=True)
x = np.frombuffer(r.stdout, dtype=np.float32).astype(np.float64)
def rms(y): return 20 * np.log10(np.sqrt((y ** 2).mean()) + 1e-12)
def pk(y): return 20 * np.log10(np.abs(y).max() + 1e-12)
print('in : RMS %.2f dBFS  peak %.2f dBFS' % (rms(x), pk(x)))
for _ in range(8):
    x *= 10 ** ((TARGET - rms(x)) / 20)
    need = np.minimum(1.0, CEIL / np.maximum(np.abs(x), 1e-9))
    win = int(0.005 * sr)
    lim = np.minimum.reduce([np.roll(need, -k) for k in range(win)])   # down BEFORE the peak
    a_rel = np.exp(-1 / (0.060 * sr)); g = np.empty(len(x)); cur = 1.0
    for i, n in enumerate(lim):
        cur = n if n < cur else n + a_rel * (cur - n)
        g[i] = cur
    x *= g
    if abs(rms(x) - TARGET) < 0.1 and np.abs(x).max() <= CEIL + 1e-6: break
print('out: RMS %.2f dBFS  peak %.2f dBFS' % (rms(x), pk(x)))
x.astype(np.float32).tofile(dst + '.f32')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '1', '-i', dst + '.f32', dst], check=True)
subprocess.run(['rm', '-f', dst + '.f32'])
