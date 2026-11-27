# per-vertex NORMAL SPREAD within a ball of radius R (cm): a thin tube (the cord) has its normals spread round its
# axis inside a small ball; the cloth's broad surfaces and gentle folds do not. Written as a heat texture.
import sys, numpy as np
from scipy.spatial import cKDTree
from PIL import Image, ImageDraw
D, R = sys.argv[1], float(sys.argv[2]); SC = 3.5
V=np.load(D+'/V.npy'); F=np.load(D+'/F.npy'); wid=np.load(D+'/wid.npy')
fn=np.cross(V[F[:,1]]-V[F[:,0]],V[F[:,2]]-V[F[:,0]]); N=np.zeros_like(V)
for k in range(3): np.add.at(N,F[:,k],fn)
N/=np.linalg.norm(N,axis=1,keepdims=True)
tr=cKDTree(V); nb=tr.query_ball_point(V, R/SC)
sp=np.array([1-np.linalg.norm(N[l].mean(0)) for l in nb])
print('spread pct', np.round(np.percentile(sp,[10,50,75,90,95,98]),3))
np.save(D+'/spread.npy', sp)
U=np.fromfile(D+'/uv.f32',np.float32).reshape(-1,2); I=np.fromfile(D+'/idx.u32',np.uint32).reshape(-1,3)
fs=sp[wid[I]].mean(1); t=np.clip((fs-0.15)/0.3,0,1)
W=2048; im=Image.new('RGB',(W,W),(0,0,0)); dr=ImageDraw.Draw(im)
for f in range(len(I)):
    c=(int(255*t[f]), int(60+100*(1-t[f])), int(255*(1-t[f])))
    dr.polygon([tuple(U[i]*W) for i in I[f]],fill=c)
im.save(D+'/heat.jpg',quality=92)
