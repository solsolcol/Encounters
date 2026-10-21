"""v21.12 · a quick shape measure for picking effects without ears: length, phone-band split (<120 / 120-500 /
500-3k / >3k), the 0.5 s RMS envelope, its swing, where it peaks, and the head/end levels (60 ms)."""
import subprocess, numpy as np, sys
def load(p, sr=44100):
    b = subprocess.run(['ffmpeg','-v','quiet','-i',p,'-ac','1','-ar',str(sr),'-f','f32le','-'],capture_output=True).stdout
    return np.frombuffer(b, np.float32), sr
db = lambda v: 20*np.log10(v+1e-9)
for p in sys.argv[1:]:
    x, sr = load(p); n = len(x)
    F = np.abs(np.fft.rfft(x*np.hanning(n)))**2; f = np.fft.rfftfreq(n, 1/sr); T = F.sum()+1e-12
    b = [F[f<120].sum()/T, F[(f>=120)&(f<500)].sum()/T, F[(f>=500)&(f<3000)].sum()/T, F[f>=3000].sum()/T]
    w = int(0.5*sr); env = [db(np.sqrt(np.mean(x[i:i+w]**2))) for i in range(0, n-w+1, w)]
    h = int(0.06*sr)
    cen = (f*F).sum()/T
    print(f"{p.split('/')[-1]:22s} {n/sr:5.2f}s bands {[round(v*100,1) for v in b]} cen {cen:6.0f} swing {max(env)-min(env):5.1f} peak@{np.argmax(env)*0.5:4.1f} head {db(np.sqrt(np.mean(x[:h]**2))):6.1f} end {db(np.sqrt(np.mean(x[-h:]**2))):6.1f} env {' '.join(f'{e:.0f}' for e in env[:40])}")
