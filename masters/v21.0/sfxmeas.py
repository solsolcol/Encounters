"""v21.0 · deeper measures for picking effects without ears: the 1 s RMS profile
(a loop asked to be 'even' must not swing), spectral centroid, spectral flatness
(roughness: a roar is noisy, a tone is not), and the median f0 where there is one."""
import subprocess, numpy as np, sys, os
def load(p, sr=44100):
    b = subprocess.run(['ffmpeg','-v','quiet','-i',p,'-ac','1','-ar',str(sr),'-f','f32le','-'],capture_output=True).stdout
    return np.frombuffer(b, np.float32), sr
def db(x): return 20*np.log10(max(x,1e-9))
for p in sys.argv[1:]:
    x, sr = load(p)
    if not len(x): print(p, 'EMPTY'); continue
    sec = [db(np.sqrt(np.mean(x[i:i+sr]**2))) for i in range(0, len(x)-sr//2, sr)]
    n = 2048; hop = 1024; cents=[]; flats=[]
    win = np.hanning(n)
    for i in range(0, len(x)-n, hop):
        f = np.abs(np.fft.rfft(x[i:i+n]*win))+1e-12
        if np.sqrt(np.mean(x[i:i+n]**2)) < 1e-3: continue
        fr = np.fft.rfftfreq(n, 1/sr)
        cents.append((fr*f).sum()/f.sum()); flats.append(np.exp(np.mean(np.log(f)))/np.mean(f))
    # crude f0 by autocorrelation on the loudest 0.5 s
    k = int(0.5*sr); e = np.convolve(x**2, np.ones(k)/k, 'valid'); i0 = int(np.argmax(e)); seg = x[i0:i0+k]
    ac = np.correlate(seg, seg, 'full')[k-1:]; lo, hi = int(sr/600), int(sr/60)
    f0 = sr/ (lo+np.argmax(ac[lo:hi])) if len(ac)>hi else 0
    print(f"{os.path.basename(p):22s} sec[{' '.join(f'{v:5.1f}' for v in sec[:24])}] swing {max(sec)-min(sec):5.1f}  centroid {np.median(cents) if cents else 0:6.0f}  flat {np.median(flats) if flats else 0:.3f}  f0~{f0:5.0f}")
