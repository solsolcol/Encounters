# v10.4 · the eerie bed's loop. dread-2 is 240 s; the loop takes the 62 s window
# whose 1 s RMS profile is FLATTEST (a bed that swells and dies inside its loop
# is a bed the player learns to read — v9.7's reasoning), skipping the first
# eight seconds, and crossfades its last 3 s over its head: ~59 s out, the
# seam checked at the joint. Writes w_loop.wav for make.sh.
import numpy as np, subprocess
sr = 48000
r = subprocess.run(['ffmpeg','-v','error','-i','raw/dread-2.mp3','-f','f32le','-ac','2','-ar',str(sr),'-'], capture_output=True)
x = np.frombuffer(r.stdout, dtype=np.float32).reshape(-1, 2).copy()
n = len(x) // sr
rms = np.array([np.sqrt((x[i*sr:(i+1)*sr]**2).mean() + 1e-12) for i in range(n)])
db = 20*np.log10(rms + 1e-12)
W = 62; best = None
for s0 in range(8, n - W):
    seg = db[s0:s0+W]; score = seg.std() + 0.15 * max(0, -22 - seg.mean())   # flat, and not a quiet passage
    if best is None or score < best[0]: best = (score, s0)
s0 = best[1]
print('window %d-%d s   rms std %.2f dB  mean %.1f dBFS' % (s0, s0+W, db[s0:s0+W].std(), db[s0:s0+W].mean()))
body = x[s0*sr:(s0+W)*sr]
XF = 3*sr; L = len(body) - XF
w = np.linspace(0, 1, XF)[:, None]
out = body[:L].copy()
out[:XF] = body[:XF] * w + body[L:L+XF] * (1 - w)
out = np.clip(out, -1, 1)
print('loop %.1f s   joint discontinuity %.1f dBFS' % (L/sr, 20*np.log10(np.abs(out[0]-out[-1]).max() + 1e-12)))
out.astype(np.float32).tofile('w_loop.f32')
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac','2','-i','w_loop.f32','w_loop.wav'], check=True)
