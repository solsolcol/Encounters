import sys, subprocess, numpy as np
def load(f, sr=16000):
    b = subprocess.run(['ffmpeg','-v','error','-i',f,'-ac','1','-ar',str(sr),'-f','f32le','-'],capture_output=True).stdout
    return np.frombuffer(b, np.float32), sr
for f in sys.argv[1:]:
    x, sr = load(f); hop = 320; win = 1024; f0s = []
    for i in range(0, len(x)-win, hop):
        w = x[i:i+win]*np.hanning(win)
        if np.sqrt(np.mean(w**2)) < 0.02: continue
        ac = np.correlate(w, w, 'full')[win-1:]
        lo, hi = int(sr/300), int(sr/70)
        k = lo + np.argmax(ac[lo:hi])
        if ac[k] > 0.35*ac[0]: f0s.append(sr/k)
    f0s = np.array(f0s)
    print(f"{f}: median f0 {np.median(f0s):.0f} Hz  (p10 {np.percentile(f0s,10):.0f}, p90 {np.percentile(f0s,90):.0f}), voiced frames {len(f0s)}")
