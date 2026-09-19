import subprocess, sys, json, numpy as np, glob, os
sr=48000
def load(f):
    r=subprocess.run(['ffmpeg','-v','error','-i',f,'-f','f32le','-ac','1','-ar',str(sr),'-'],capture_output=True)
    return np.frombuffer(r.stdout,dtype=np.float32).astype(np.float64)
def db(v): return 20*np.log10(max(v,1e-12))
out={}
for f in sorted(glob.glob('raw/*.mp3')):
    n=os.path.basename(f)[:-4]
    x=load(f)
    if not len(x): out[n]={'err':'empty'}; continue
    dur=len(x)/sr; pk=db(np.abs(x).max()); rms=db(np.sqrt((x**2).mean()))
    # edges: RMS of first/last 40 ms
    e0=db(np.sqrt((x[:int(.04*sr)]**2).mean())); e1=db(np.sqrt((x[-int(.04*sr):]**2).mean()))
    # silence trim
    thr=10**(-45/20); nz=np.where(np.abs(x)>thr)[0]
    speech=(nz[-1]-nz[0])/sr if len(nz) else 0
    lead=nz[0]/sr if len(nz) else 0; tail=(len(x)-1-nz[-1])/sr if len(nz) else 0
    # 100 ms RMS envelope swing
    w=int(.1*sr); m=len(x)//w
    env=np.array([db(np.sqrt((x[i*w:(i+1)*w]**2).mean())) for i in range(max(1,m))])
    live=env[env>rms-25]
    swing=float(live.max()-live.min()) if len(live)>1 else 0
    # bands
    F=np.fft.rfft(x*np.hanning(len(x))); fr=np.fft.rfftfreq(len(x),1/sr); P=np.abs(F)**2; tot=P.sum()+1e-12
    b=lambda a,z: float(P[(fr>=a)&(fr<z)].sum()/tot)
    out[n]={'dur':round(dur,2),'speech':round(speech,2),'lead':round(lead,3),'tail':round(tail,3),
            'pk':round(pk,2),'rms':round(rms,2),'e0':round(e0,1),'e1':round(e1,1),'swing':round(swing,1),
            'sub':round(b(0,120),3),'low':round(b(120,500),3),'mid':round(b(500,3000),3),'hi':round(b(3000,24000),3)}
json.dump(out,open('measure.json','w'),indent=1)
print(len(out),'measured')
