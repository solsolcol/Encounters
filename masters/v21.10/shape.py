"""v21.10 · the SHAPE of a take: per 100 ms, the RMS (dB) and the strongest frequency (Hz) between 200 Hz and 8 kHz."""
import subprocess, numpy as np, sys, os
def load(p, sr=44100):
    b = subprocess.run(['ffmpeg','-v','quiet','-i',p,'-ac','1','-ar',str(sr),'-f','f32le','-'],capture_output=True).stdout
    return np.frombuffer(b, np.float32), sr
step = float(os.environ.get('STEP', '0.1'))
for p in sys.argv[1:]:
    x, sr = load(p); n = int(step*sr); out = []
    for i in range(0, len(x)-n+1, n):
        s = x[i:i+n]; r = 20*np.log10(np.sqrt(np.mean(s**2))+1e-9)
        f = np.abs(np.fft.rfft(s*np.hanning(len(s)))); fr = np.fft.rfftfreq(len(s), 1/sr)
        m = (fr > 200) & (fr < 8000); pk = fr[m][np.argmax(f[m])]
        out.append(f"{r:5.0f}/{pk:5.0f}")
    print(os.path.basename(p), ' '.join(out))
