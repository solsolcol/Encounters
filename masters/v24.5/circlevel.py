"""v24.5 (R1-2) · a LOOP levelled by its RMS with the leveller's state carried round its joint. level_rms.py's compressor
and limiter start cold (envelope 0, gain 1) and end warm, so the gain at a loop's last sample was not its gain at the
first: k5under's joint, a crossfade continuous by construction, jumped 5 dB and clicked (+44 dB of 2 kHz energy over its
median) once levelled. This levels the loop twice over, end to end, and keeps the second copy — whose leveller came into
its first sample from the loop's own end — so the joint is as continuous as loopfast made it.
The arithmetic is level_rms.py's own, line for line (a 3:1 compressor over THR -30, the RMS driven to TARGET, a 5 ms
lookahead limiter at CEIL); only the lookahead's running minimum is taken by doubling windows instead of 240 rolled copies
(the copies of a doubled 57 s loop were 5 GB, and the box killed it). `--selftest in.wav` checks it against level_rms.py.
usage: python3 circlevel.py in.wav out.wav TARGET_dBFS CEIL_dBFS"""
import subprocess, sys, os, numpy as np
sr = 48000
def load(f):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-f', 'f32le', '-ac', '2', '-ar', str(sr), '-'], capture_output=True)
    return np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, 2).astype(np.float64)
def save(y, f):
    y.astype(np.float32).tofile(f + '.f32')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '2', '-i', f + '.f32', f], check=True)
    os.remove(f + '.f32')
def rms(y): return 20 * np.log10(np.sqrt((y ** 2).mean()) + 1e-12)
def winmin(v, win):            # == np.minimum.reduce([np.roll(v, -k) for k in range(win)]), circular as np.roll is
    m, s = v.copy(), 1
    while 2 * s <= win: m = np.minimum(m, np.roll(m, -s)); s *= 2      # m[i] = min over [i, i + s)
    return m if s == win else np.minimum(m, np.roll(m, -(win - s)))   # two windows of s cover [i, i + win)
def level(x, TARGET, CEILdb, THR=-30.0):
    x = x.copy(); CEIL = 10 ** (CEILdb / 20)
    env = np.abs(x).max(1); a_att = np.exp(-1 / (0.005 * sr)); a_rel = np.exp(-1 / (0.200 * sr)); e = 0.0; g = np.empty(len(x))
    thr = 10 ** (THR / 20)
    for i, v in enumerate(env):
        e = v + (a_att if v > e else a_rel) * (e - v)
        g[i] = 1.0 if e <= thr else (thr * (e / thr) ** (1 / 3)) / e
    x *= g[:, None]
    for _ in range(8):
        x *= 10 ** ((TARGET - rms(x)) / 20)
        pk = np.abs(x).max(1)
        win = int(0.005 * sr)
        need = np.minimum(1.0, CEIL / np.maximum(pk, 1e-9))
        lim = winmin(need, win)
        a_r = np.exp(-1 / (0.080 * sr)); gg = np.empty(len(x)); cur = 1.0
        for i, n in enumerate(lim):
            cur = n if n < cur else n + a_r * (cur - n)
            gg[i] = cur
        x *= gg[:, None]
        if abs(rms(x) - TARGET) < 0.1 and np.abs(x).max() <= CEIL + 1e-6: break
    return x
if sys.argv[1] == '--selftest':                                   # against level_rms.py itself, on a short file
    f = sys.argv[2]; ref = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'v21.12', 'level_rms.py')
    subprocess.run(['python3', ref, f, '/tmp/_lv_ref.wav', '-30', '-14'], check=True)
    a = load('/tmp/_lv_ref.wav'); b = level(load(f), -30.0, -14.0)
    print('max |diff| against level_rms.py: %.3g (the WAV round trip is float32)' % np.abs(a - b).max()); sys.exit(0)
inp, outp, T, C = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
x = load(inp); n = len(x)
y = level(np.concatenate([x, x]), T, C)
out = y[n:]
save(out, outp)
print(f'{outp}: RMS {rms(out):.2f} dBFS  peak {20 * np.log10(np.abs(out).max()):.2f} dBFS — the second of two levelled copies; its joint steps {np.abs(out[-1] - out[0]).max():.4f}')
