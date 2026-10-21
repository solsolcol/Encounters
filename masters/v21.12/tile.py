"""v21.12 · tile a crossfade-looped file to a length, with a fade in: tile.py in.wav out.wav seconds fade_in"""
import subprocess, sys, numpy as np
sr = 48000
def load(f):
    r = subprocess.run(['ffmpeg','-v','error','-i',f,'-f','f32le','-ac','2','-ar',str(sr),'-'],capture_output=True)
    return np.frombuffer(r.stdout,dtype=np.float32).astype(np.float64).reshape(-1,2)
x = load(sys.argv[1]); n = int(float(sys.argv[3]) * sr); fi = int(float(sys.argv[4]) * sr)
out = np.concatenate([x] * (n // len(x) + 1))[:n].copy()
out[:fi] *= (np.linspace(0, 1, fi) ** 1.5)[:, None]
out.astype(np.float32).tofile(sys.argv[2] + '.f32')
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac','2','-i',sys.argv[2]+'.f32',sys.argv[2]],check=True)
print('%s  %.2fs  peak %.2f dBFS' % (sys.argv[2], n / sr, 20*np.log10(np.abs(out).max()+1e-12)))
