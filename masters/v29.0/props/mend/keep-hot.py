import sys, numpy as np
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import connected_components
D, TH = sys.argv[1], float(sys.argv[2]); SC=3.5
V=np.load(D+'/V.npy'); F=np.load(D+'/F.npy'); sp=np.load(D+'/spread.npy')
hot = sp[F].min(1) > TH
idx=np.where(hot)[0]; m=len(idx); pos={f:j for j,f in enumerate(idx)}
# faces sharing an edge
E={}
for j,f in enumerate(idx):
    for a,b in ((0,1),(1,2),(2,0)):
        k=tuple(sorted((F[f,a],F[f,b]))); E.setdefault(k,[]).append(j)
r=[];c=[]
for l in E.values():
    for x in l[1:]: r.append(l[0]); c.append(x)
nc,lab=connected_components(coo_matrix((np.ones(len(r)),(r,c)),shape=(m,m)),directed=False)
cnt=np.bincount(lab)
for k in np.argsort(-cnt)[:12]:
    vs=np.unique(F[idx[lab==k]]); b0=V[vs].min(0)*SC; b1=V[vs].max(0)*SC
    print(k, cnt[k], 'x %.2f..%.2f y %.2f..%.2f z %.2f..%.2f cm' % (b0[0],b1[0],b0[1],b1[1],b0[2],b1[2]))
np.save(D+'/hotidx.npy', idx); np.save(D+'/hotlab.npy', lab)
