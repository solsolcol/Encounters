"""v24.7 · the median pitch of a take's voiced frames (an autocorrelation estimate) — which of two laughter takes sounds
like SMALL children (higher) rather than adults; and the share of frames voiced"""
import sys, subprocess, numpy as np
for f in sys.argv[1:]:
    raw = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', f, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout
    x = np.frombuffer(raw, np.float32); sr = 16000; w = 640; hop = 160; f0s = []; n = 0
    pk = np.max(np.abs(x)) + 1e-9
    for i in range(0, len(x) - w, hop):
        fr = x[i:i + w] * np.hanning(w)
        if np.sqrt(np.mean(fr ** 2)) < pk * 0.03: continue
        n += 1
        ac = np.correlate(fr, fr, 'full')[w - 1:]; ac /= ac[0] + 1e-12
        lo, hi = int(sr / 900), int(sr / 120)
        j = lo + int(np.argmax(ac[lo:hi]))
        if ac[j] > 0.45: f0s.append(sr / j)
    print(f.split('/')[-1], 'voiced %.0f%%' % (100 * len(f0s) / max(1, n)), 'median f0 %.0f Hz' % (np.median(f0s) if f0s else 0), 'p75 %.0f' % (np.percentile(f0s, 75) if f0s else 0))
