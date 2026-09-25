import sys, subprocess, numpy as np
def peak(p):
    r = subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','2','-ar','48000','-f','f32le','-'],
                       capture_output=True)
    x = np.frombuffer(r.stdout, dtype=np.float32)
    if not len(x): raise SystemExit('no audio from '+p)
    return 20*np.log10(np.abs(x).max()+1e-12), len(x)/2/48000
for p in sys.argv[1:]:
    d,s = peak(p); print(f'{p}: peak {d:+.2f} dBFS  dur {s:.3f}s')
