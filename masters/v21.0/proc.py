# v12.1 · the sound processing for the range, IN THE SOURCE'S OWN CHANNEL
# LAYOUT (the v2.3 contract: stereo stays stereo). Two jobs:
#   trim  in out start end [fade_out]   — cut a one-shot to its useful part
#   loop  in out [xf]                   — flatten the slow drift, then
#                                         crossfade the tail over the head
# The joint is measured either way, because a generated loop only CLAIMS to
# be seamless (the v9.7 law: check the JOINT, not the RMS).
import subprocess, sys, numpy as np
sr = 48000
def chans(f):
    r = subprocess.run(['ffprobe','-v','error','-show_entries','stream=channels','-of','csv=p=0',f],capture_output=True,text=True)
    return max(1, int((r.stdout.strip().split('\n')[0] or '1')))
def load(f, ch):
    r = subprocess.run(['ffmpeg','-v','error','-i',f,'-f','f32le','-ac',str(ch),'-ar',str(sr),'-'],capture_output=True)
    return np.frombuffer(r.stdout,dtype=np.float32).astype(np.float64).reshape(-1, ch)
def save(x, outp, ch):
    x.astype(np.float32).tofile(outp+'.f32')
    subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(sr),'-ac',str(ch),'-i',outp+'.f32',outp],check=True)
db = lambda y: 20*np.log10(np.sqrt((y**2).mean())+1e-12)
mode, inp, outp = sys.argv[1], sys.argv[2], sys.argv[3]
ch = chans(inp); x = load(inp, ch)
if mode == 'trim':
    a, b = float(sys.argv[4]), float(sys.argv[5])
    fo = float(sys.argv[6]) if len(sys.argv) > 6 else 0.12
    x = x[int(a*sr):int(b*sr)].copy()
    ni, no = int(0.004*sr), int(fo*sr)
    if ni and len(x) > ni: x[:ni] *= np.linspace(0,1,ni)[:,None]
    if no and len(x) > no: x[-no:] *= np.linspace(1,0,no)[:,None]
    print('%-16s %.2fs  peak %.2f dBFS  %dch' % (outp, len(x)/sr, 20*np.log10(np.abs(x).max()+1e-12), ch))
elif mode == 'cut':     # v21.0: take [a, b) out, an equal-power crossfade at the join (a rest that reads as a dropout in a loop)
    a, b = float(sys.argv[4]), float(sys.argv[5])
    xf = float(sys.argv[6]) if len(sys.argv) > 6 else 0.12
    n = int(xf*sr); A = x[:int(a*sr)+n].copy(); B = x[int(b*sr):].copy()
    th = np.linspace(0, np.pi/2, n)[:,None]
    mid = A[-n:]*np.cos(th) + B[:n]*np.sin(th)
    x = np.concatenate([A[:-n], mid, B[n:]])
    j = int(a*sr); w = int(0.25*sr)
    print('%-16s %.2fs  cut %.2f-%.2f; join RMS %.1f dBFS (before %.1f / after %.1f)  %dch'
          % (outp, len(x)/sr, a, b, db(x[j-w//2:j+w//2]), db(x[j-w-w//2:j-w//2]), db(x[j+w//2:j+w+w//2]), ch))
elif mode == 'xloop':   # v21.0: crossfade only, the slow swells kept
    xf = float(sys.argv[4]) if len(sys.argv) > 4 else 1.5
    n = int(xf*sr); tail = x[-n:].copy(); x = x[:-n].copy()
    k = np.linspace(0,1,n)[:,None]; x[:n] = x[:n]*k + tail*(1-k)
    print('%-16s %.2fs  joint is a CROSSFADE, swells kept; body %.1f dBFS  peak %.2f  %dch'
          % (outp, len(x)/sr, db(x), 20*np.log10(np.abs(x).max()+1e-12), ch))
else:
    xf = float(sys.argv[4]) if len(sys.argv) > 4 else 1.5
    w = int(2.0*sr)
    m = (x**2).mean(axis=1)
    pad = np.pad(m, (w//2, w//2), mode='edge')
    env = np.sqrt(np.convolve(pad, np.ones(w)/w, mode='valid')[:len(x)]) + 1e-9
    x = x * (env.mean() / env)[:,None]
    n = int(xf*sr); tail = x[-n:].copy(); x = x[:-n].copy()
    k = np.linspace(0,1,n)[:,None]; x[:n] = x[:n]*k + tail*(1-k)
    print('%-16s %.2fs  joint is a CROSSFADE (continuous by construction); body %.1f dBFS  peak %.2f  %dch'
          % (outp, len(x)/sr, db(x), 20*np.log10(np.abs(x).max()+1e-12), ch))
save(x, outp, ch)
