import sys, numpy as np
from scipy.sparse import coo_matrix, diags
D = sys.argv[1]; IT = int(sys.argv[2]) if len(sys.argv) > 2 else 200
P = np.fromfile(D+'/pos.f32', np.float32).reshape(-1,3).astype(float)
I = np.fromfile(D+'/idx.u32', np.uint32).reshape(-1,3)
q = np.round(P/1e-5).astype(np.int64)
_, first, wid = np.unique(q, axis=0, return_index=True, return_inverse=True); wid = wid.ravel()
V = P[first]; F = wid[I]; n = len(V)
e = np.concatenate([F[:,[0,1]], F[:,[1,2]], F[:,[2,0]]]); e = np.concatenate([e, e[:,::-1]])
A = coo_matrix((np.ones(len(e)), (e[:,0], e[:,1])), shape=(n,n)).tocsr(); A.data[:] = 1
deg = np.asarray(A.sum(1)).ravel(); W = diags(1/deg) @ A
def vnorm(X):
    fn = np.cross(X[F[:,1]]-X[F[:,0]], X[F[:,2]]-X[F[:,0]]); N = np.zeros_like(X)
    for k in range(3): np.add.at(N, F[:,k], fn)
    return N/np.linalg.norm(N,axis=1,keepdims=True)
S = V.copy()
for i in range(IT):
    S = S + 0.5*(W@S - S); S = S - 0.53*(W@S - S)
d = ((V - S)*vnorm(S)).sum(1)
SC = 3.5  # cm per unit
print('disp cm percentiles', np.round(np.percentile(d*SC, [1,5,25,50,75,90,95,97,99]),3))
np.save(D+'/vdisp.npy', d*SC); np.save(D+'/wid.npy', wid); np.save(D+'/V.npy', V); np.save(D+'/F.npy', F)
