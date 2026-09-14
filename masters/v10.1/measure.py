import sys, subprocess, numpy as np
def dec(p, sr=48000):
    r = subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','1','-ar',str(sr),'-f','f32le','-'], capture_output=True)
    return np.frombuffer(r.stdout, dtype=np.float32), sr
def db(x): return 20*np.log10(np.sqrt(np.mean(x*x))+1e-12)
for p in sys.argv[1:]:
    x, sr = dec(p)
    n = len(x); secs = n/sr
    # one-second RMS swing
    w = sr; rms = [db(x[i:i+w]) for i in range(0, n-w+1, w)]
    # band energy
    X = np.abs(np.fft.rfft(x))**2; f = np.fft.rfftfreq(n, 1/sr)
    tot = X.sum()
    lo = X[f<120].sum()/tot; mid = X[(f>=120)&(f<500)].sum()/tot; hi = X[(f>=500)&(f<3000)].sum()/tot
    tail = db(x[-int(0.04*sr):]); head = db(x[:int(0.04*sr)])
    # loop seam: compare last 0.5 s and first 0.5 s rms
    seam = abs(db(x[:sr//2]) - db(x[-sr//2:]))
    print(f'{p}: {secs:.2f}s peak {20*np.log10(np.abs(x).max()+1e-12):+.1f} rms {db(x):.1f} swing {max(rms)-min(rms):.1f} ({min(rms):.0f}..{max(rms):.0f}) <120 {lo*100:.1f}% 120-500 {mid*100:.1f}% 500-3k {hi*100:.1f}% head {head:.0f} tail {tail:.0f} seam {seam:.1f}')
