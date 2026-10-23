# v22.0 CP9 · proc.py's `loop` (masters/v21.0/proc.py), the same arithmetic with the moving average taken by a running
# sum instead of np.convolve: a 2 s box over a 20 s take is 92 billion multiply-adds direct (it ran fourteen minutes on
# a loaded box and had not finished), and N additions this way. Flatten the slow drift, then crossfade the tail over the
# head; the joint is continuous by construction. Usage: loopfast.py in out [xf]
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
def boxavg(m, w):   # == np.convolve(np.pad(m,(w//2,w//2),'edge'), np.ones(w)/w, 'valid')[:len(m)]
    pad = np.pad(m, (w//2, w//2), mode='edge')
    c = np.concatenate([[0.0], np.cumsum(pad)])
    return ((c[w:] - c[:-w]) / w)[:len(m)]
if sys.argv[1] == '--selftest':
    rng = np.random.default_rng(1); m = rng.random(5000); w = 400
    ref = np.convolve(np.pad(m, (w//2, w//2), mode='edge'), np.ones(w)/w, mode='valid')[:len(m)]
    print('max |diff| %.3g' % np.abs(boxavg(m, w) - ref).max()); sys.exit(0)
inp, outp = sys.argv[1], sys.argv[2]
xf = float(sys.argv[3]) if len(sys.argv) > 3 else 1.5
ch = chans(inp); x = load(inp, ch)
w = int(2.0*sr)
env = np.sqrt(boxavg((x**2).mean(axis=1), w)) + 1e-9
x = x * (env.mean() / env)[:,None]
n = int(xf*sr); tail = x[-n:].copy(); x = x[:-n].copy()
k = np.linspace(0,1,n)[:,None]; x[:n] = x[:n]*k + tail*(1-k)
print('%-16s %.2fs  joint is a CROSSFADE (continuous by construction); body %.1f dBFS  peak %.2f  %dch'
      % (outp, len(x)/sr, db(x), 20*np.log10(np.abs(x).max()+1e-12), ch))
save(x, outp, ch)
