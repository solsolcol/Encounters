"""v21.10 · lay one take under another: mix.py base.mp3 layer.mp3 out.wav layer_dB delay_s
(both in their own channel layout brought to stereo, 48 kHz; the result is not normalised — enc() does that)."""
import subprocess, sys, numpy as np
sr = 48000
def load(f):
    r = subprocess.run(['ffmpeg','-v','error','-i',f,'-f','f32le','-ac','2','-ar',str(sr),'-'],capture_output=True)
    return np.frombuffer(r.stdout,dtype=np.float32).astype(np.float64).reshape(-1,2)
a = load(sys.argv[1]); b = load(sys.argv[2]); g = 10 ** (float(sys.argv[4]) / 20); d = int(float(sys.argv[5]) * sr)
n = max(len(a), len(b) + d); out = np.zeros((n, 2)); out[:len(a)] += a; out[d:d+len(b)] += b * g
out.astype(np.float32).tofile(sys.argv[3] + '.f32')
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac','2','-i',sys.argv[3]+'.f32',sys.argv[3]],check=True)
print('%s  %.2fs  peak %.2f dBFS' % (sys.argv[3], n / sr, 20*np.log10(np.abs(out).max()+1e-12)))
