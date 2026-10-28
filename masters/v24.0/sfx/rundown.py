"""v24.0 CP11 · an engine DYING, made from a take of it idling. Four takes over two prompts ("switched off, shuddering
and dying"; "idling for a moment and then switched off ... dies away to silence") came back as a flat idle at one level
for their whole length — the sound-effects model will not stop an engine. So the stop is made here, the way a tape
machine stops: the idle plays at its own speed for HOLD seconds, then a varispeed takes it down to END_RATE over DIE
seconds (its firing slows and drops in pitch together, as a diesel's does when the fuel is cut), with the level falling
away under a shudder that slows with it; then a few quiet ticks of cooling metal (a short decaying 3.1 kHz ping with a
breath of noise, 30 dB under the idle), and silence.
usage: python3 rundown.py idle.(mp3|wav) out.wav [HOLD DIE END_RATE TAIL]"""
import subprocess, sys, numpy as np
sr = 48000
inp, outp = sys.argv[1], sys.argv[2]
HOLD = float(sys.argv[3]) if len(sys.argv) > 3 else 0.7
DIE = float(sys.argv[4]) if len(sys.argv) > 4 else 1.4
END = float(sys.argv[5]) if len(sys.argv) > 5 else 0.35
TAIL = float(sys.argv[6]) if len(sys.argv) > 6 else 2.6
r = subprocess.run(['ffmpeg', '-v', 'error', '-i', inp, '-f', 'f32le', '-ac', '2', '-ar', str(sr), '-'], capture_output=True)
x = np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, 2).astype(np.float64)
n = int((HOLD + DIE + TAIL) * sr)
t = np.arange(n) / sr
s = np.clip((t - HOLD) / DIE, 0, 1); s = s * s * (3 - 2 * s)            # smoothstep over the die-out
rate = 1 - (1 - END) * s
pos = np.cumsum(rate) - rate[0]                                          # where in the idle each output sample reads
pos = np.minimum(pos, len(x) - 2)
i0 = pos.astype(int); fr = (pos - i0)[:, None]
y = x[i0] * (1 - fr) + x[i0 + 1] * fr
shud = 1 + 0.30 * s * np.sin(2 * np.pi * np.cumsum(9.0 - 6.0 * s) / sr)  # the shudder, slowing as it dies
env = np.where(t < HOLD, 1.0, (1 - s) ** 1.6) * shud
env[t >= HOLD + DIE] = 0.0
y *= env[:, None]
pk = np.abs(y).max() + 1e-12
rng = np.random.default_rng(7)
for at in (HOLD + DIE + 0.55, HOLD + DIE + 1.35, HOLD + DIE + 2.15):   # the ticks of cooling metal
    k = int(at * sr); m = int(0.06 * sr)
    if k + m > n: continue
    tt = np.arange(m) / sr
    tick = (np.sin(2 * np.pi * 3100 * tt) + 0.35 * rng.standard_normal(m)) * np.exp(-tt / 0.012)
    y[k:k + m] += (tick * pk * 10 ** (-30 / 20))[:, None]
y.astype(np.float32).tofile(outp + '.f32')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(sr), '-ac', '2', '-i', outp + '.f32', outp], check=True)
import os; os.remove(outp + '.f32')
print(f'{outp}: {n / sr:.2f} s — the idle {HOLD} s, dying over {DIE} s to {END}x, ticks, silence')
