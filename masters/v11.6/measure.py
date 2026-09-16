# v11.6 — take measurement: length, peak, RMS, head/tail air (first/last sample over -40 dBFS), words/s
import sys, subprocess, numpy as np, json, glob, os
def load(f):
    raw = subprocess.run(['ffmpeg','-v','error','-i',f,'-f','f32le','-ac','1','-ar','48000','-'],capture_output=True).stdout
    return np.frombuffer(raw, np.float32)
out={}
for f in sorted(glob.glob('masters/v11.6/raw/*.mp3')):
    x=load(f); n=len(x); sr=48000
    if n==0: print(f,'EMPTY'); continue
    db=lambda v: float(20*np.log10(max(float(v),1e-9)))
    peak=db(np.abs(x).max()); rms=db(np.sqrt((x**2).mean()))
    thr=10**(-40/20); idx=np.where(np.abs(x)>thr)[0]
    head=float(idx[0]/sr) if len(idx) else 0.0; tail=float((n-idx[-1])/sr) if len(idx) else 0.0
    # tail level: last 40 ms rms vs body
    tl=db(np.sqrt((x[idx[-1]-1920:idx[-1]]**2).mean())) if len(idx) and idx[-1]>1920 else -99
    # pauses > 0.25 s inside the signal (silence under -40 dB)
    w=int(0.02*sr); env=np.array([np.sqrt((x[i:i+w]**2).mean()) for i in range(0,n-w,w)])
    sil=env<thr; pauses=[]; run=0
    for s_ in sil:
        run = run+1 if s_ else 0
        if run==13: pauses.append(1)
    # where the peak sits, and the share of energy in 500 Hz-3 kHz (a clink lives there; a rumble does not)
    pk=float(np.argmax(np.abs(x)))/sr
    F=np.fft.rfft(x*np.hanning(n)); P=np.abs(F)**2; fr=np.fft.rfftfreq(n,1/sr)
    band=float(P[(fr>=500)&(fr<3000)].sum()/max(P.sum(),1e-12))
    name=os.path.basename(f)[:-4]
    out[name]=dict(secs=round(n/sr,2), peak=round(peak,2), rms=round(rms,2), head=round(head,2), tail=round(tail,2), tailLvl=round(tl,1), pauses=len(pauses), voiced=round((n/sr)-head-tail,2), peakAt=round(pk,2), mid=round(band,3))
    print(name, out[name])
json.dump(out, open('masters/v11.6/measure.json','w'), indent=1)
