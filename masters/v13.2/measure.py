import subprocess, numpy as np, glob, os, json
def load(f):
    raw = subprocess.run(['ffmpeg','-v','error','-i',f,'-ac','1','-ar','44100','-f','f32le','-'],
                         capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32)
rows=[]
for f in sorted(glob.glob('raw/*.mp3')):
    x = load(f); n=len(x)/44100.0
    pk = 20*np.log10(max(1e-9, float(np.abs(x).max())))
    rms = 20*np.log10(max(1e-9, float(np.sqrt((x**2).mean()))))
    # edges: level of the first and last 40 ms against the body
    e0 = 20*np.log10(max(1e-9, float(np.abs(x[:1764]).max())))
    e1 = 20*np.log10(max(1e-9, float(np.abs(x[-1764:]).max())))
    # leading silence before the first sample over -45 dBFS of peak
    th = float(np.abs(x).max())*0.0178
    idx = np.where(np.abs(x) > th)[0]
    lead = idx[0]/44100.0 if len(idx) else 0
    tail = (len(x)-idx[-1])/44100.0 if len(idx) else 0
    rows.append((os.path.basename(f), n, pk, rms, e0-pk, e1-pk, lead, tail))
print(f"{'take':14}{'secs':>7}{'peak':>8}{'rms':>8}{'head':>8}{'tailE':>8}{'lead':>7}{'tail':>7}")
for r in rows:
    print(f"{r[0]:14}{r[1]:7.2f}{r[2]:8.2f}{r[3]:8.2f}{r[4]:8.1f}{r[5]:8.1f}{r[6]:7.3f}{r[7]:7.3f}")
