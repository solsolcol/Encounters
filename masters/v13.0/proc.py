# v13.0 CP3 — cut the two effects to their useful part. A cue whose attack is
# 100 ms into the file reads LATE however short the file is (the v9.4 law), so
# each is cut from 20 ms before its own onset and given a short fade out.
import subprocess, sys, numpy as np
SR = 48000
def rd(p):
    raw = subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','2','-ar',str(SR),'-f','f32le','-'],
                         capture_output=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64).reshape(-1, 2)
def wr(p, x):
    x.astype(np.float32).tofile(p + '.f32')
    subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','2','-i',p+'.f32',p], check=True)
def cut(src, out, t0, t1, fadeout):
    x = rd(src)[int(t0*SR):int(t1*SR)].copy()
    n = int(fadeout*SR); x[-n:] *= np.linspace(1, 0, n)[:, None]
    ni = int(0.004*SR); x[:ni] *= np.linspace(0, 1, ni)[:, None]
    wr(out, x); print(out, '%.2fs peak %.2f dBFS' % (len(x)/SR, 20*np.log10(np.abs(x).max()+1e-9)))
cut('raw/flarelaunch_c.mp3', 'w_flarelaunch.wav', 0.079, 1.10, 0.10)
cut('raw/stingcyc_d.mp3',    'w_stingcyc.wav',    0.000, 1.45, 0.14)
