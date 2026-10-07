import subprocess, numpy as np, sys, glob, os
def load(p, sr=16000):
    b = subprocess.run(['ffmpeg','-v','quiet','-i',p,'-ac','1','-ar',str(sr),'-f','f32le','-'],capture_output=True).stdout
    return np.frombuffer(b,np.float32), sr
for p in sorted(glob.glob('raw/*.mp3')):
    k=os.path.basename(p)[:-4]
    if not k.startswith('au'): continue
    x,sr=load(p); hop=int(0.02*sr)
    e=np.array([np.sqrt(np.mean(x[i:i+hop]**2)) for i in range(0,len(x)-hop,hop)])
    thr=max(e.max()*0.06,1e-4); on=e>thr
    # segments of speech and gaps
    segs=[];cur=None
    for i,v in enumerate(on):
        if v and cur is None: cur=i
        if not v and cur is not None: segs.append((cur,i)); cur=None
    if cur is not None: segs.append((cur,len(on)))
    # merge gaps < 0.12s
    m=[]
    for s in segs:
        if m and (s[0]-m[-1][1])*0.02<0.12: m[-1]=(m[-1][0],s[1])
        else: m.append(s)
    gaps=[round((m[i+1][0]-m[i][1])*0.02,2) for i in range(len(m)-1)]
    first=round((m[0][1]-m[0][0])*0.02,2) if m else 0
    speech=round(sum(b-a for a,b in m)*0.02,2)
    print(f"{k:14s} n={len(m):2d} firstSeg={first:5.2f} gaps={gaps[:8]} speech={speech}")
