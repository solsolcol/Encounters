# v29.0 · the incense holder with THREE sticks, as its picture has (Meshy made four, in a diamond): above the ash (faces
# whose centroid stands over -0.5 of the model's own normalised height) the sticks are four separate pieces; the one at
# +z (centre x, z +0.06) is taken out, leaving three in a row across x. Everything else is kept as it was.
#   python3 -I incense3.py <dump dir of assets/w51incense.glb as prepared>   -> keep.u8
import sys, numpy as np
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import connected_components
D=sys.argv[1]
P=np.fromfile(D+'/pos.f32',np.float32).reshape(-1,3); I=np.fromfile(D+'/idx.u32',np.uint32).reshape(-1,3)
_,w=np.unique(np.round(P/1e-5).astype(np.int64),axis=0,return_inverse=True); w=w.ravel()
c=P[I].mean(1); up=np.where(c[:,1]>-0.5)[0]
F=w[I[up]]; e=np.concatenate([F[:,[0,1]],F[:,[1,2]]]); n=w.max()+1
nc,lab=connected_components(coo_matrix((np.ones(len(e)),(e[:,0],e[:,1])),shape=(n,n)),directed=False)
fl=lab[F[:,0]]; best=None
for k in np.unique(fl):
    m=up[fl==k]
    if len(m) > 50 and abs(c[m,0].mean()) < 0.05 and c[m,2].mean() > 0.03: best=m
keep=np.ones(len(I),np.uint8); keep[best]=0
print('sticks found; the one taken out has', len(best), 'faces; kept', keep.sum(), 'of', len(I))
keep.tofile(D+'/keep.u8')
