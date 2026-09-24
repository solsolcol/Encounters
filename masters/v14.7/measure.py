import subprocess, numpy as np, sys, glob, json
def load(p, sr=44100):
    raw=subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','1','-ar',str(sr),'-f','f32le','-'],capture_output=True).stdout
    return np.frombuffer(raw,dtype=np.float32), sr
def db(x): return 20*np.log10(max(x,1e-9))
def rms(x): return float(np.sqrt(np.mean(x*x))) if len(x) else 0.0
out={}
for p in sorted(sys.argv[1:]):
    x,sr=load(p)
    pk=float(np.max(np.abs(x))); r=rms(x)
    # voiced region: frames above -40 dBFS
    fr=int(0.02*sr); n=len(x)//fr
    e=np.array([rms(x[i*fr:(i+1)*fr]) for i in range(n)])
    on=np.where(e>10**(-40/20))[0]
    s0=on[0]*0.02 if len(on) else 0; s1=(on[-1]+1)*0.02 if len(on) else 0
    head=db(rms(x[:int(0.03*sr)])); tail=db(rms(x[-int(0.05*sr):]))
    X=np.abs(np.fft.rfft(x)); f=np.fft.rfftfreq(len(x),1/sr); P=X**2; T=P.sum()
    band=lambda a,b: float(P[(f>=a)&(f<b)].sum()/T*100)
    # attack: time of peak envelope
    tpk=float(np.argmax(e)*0.02)
    out[p]=dict(dur=round(len(x)/sr,2),peak=round(db(pk),1),rms=round(db(r),1),start=round(s0,2),end=round(s1,2),
        head=round(head,1),tail=round(tail,1),sub120=round(band(0,120),1),b120_500=round(band(120,500),1),b500_3k=round(band(500,3000),1),hi3k=round(band(3000,20000),1),tpeak=tpk)
    print(p, out[p])
json.dump(out,open('measure.json','w'),indent=1)
