# THE CORD, BY ITS GEOMETRY. Seeds: the connected hot regions (normal spread in a 2.5 mm ball > 0.45, every vertex of
# the face) that hold the cord (named by index, read from their photograph). Grown face by face across shared edges into
# a face only if no vertex of it is CONCAVE (the ball's centroid more than CONC cm out along its normal: the crease where
# the tube meets the cloth) and it is still curved (spread in a 1.5 mm ball over FLAT). The crease stops the growth.
import sys, numpy as np
from scipy.spatial import cKDTree
from PIL import Image, ImageDraw
D=sys.argv[1]; SEEDS=[int(x) for x in sys.argv[2].split(',')]; CONC=float(sys.argv[3]); FLAT=float(sys.argv[4]); RB=float(sys.argv[5]); SC=3.5
V=np.load(D+'/V.npy'); F=np.load(D+'/F.npy'); idx=np.load(D+'/hotidx.npy'); lab=np.load(D+'/hotlab.npy')
fn=np.cross(V[F[:,1]]-V[F[:,0]],V[F[:,2]]-V[F[:,0]]); N=np.zeros_like(V)
for k in range(3): np.add.at(N,F[:,k],fn)
N/=np.linalg.norm(N,axis=1,keepdims=True)
tr=cKDTree(V)
nb=tr.query_ball_point(V, RB/SC)
conc=np.array([((V[l].mean(0)-V[i])*N[i]).sum() for i,l in enumerate(nb)])*SC
nb2=tr.query_ball_point(V, 0.15/SC)
sp=np.array([1-np.linalg.norm(N[l].mean(0)) for l in nb2])
ok=(conc[F].max(1) <= CONC) & (sp[F].max(1) > FLAT)
sel=np.zeros(len(F),bool)
for s in SEEDS: sel[idx[lab==s]]=True
sel &= ok | sel
E={}
for f in range(len(F)):
    for a,b in ((0,1),(1,2),(2,0)): E.setdefault(tuple(sorted((F[f,a],F[f,b]))),[]).append(f)
adj=[[] for _ in range(len(F))]
for l in E.values():
    for x in l:
        for y in l:
            if x!=y: adj[x].append(y)
front=list(np.where(sel)[0])
while front:
    nf=[]
    for f in front:
        for g in adj[f]:
            if not sel[g] and ok[g]: sel[g]=True; nf.append(g)
    front=nf
print('cord faces', sel.sum(), 'of', len(F), '; conc pct', np.round(np.percentile(conc,[5,50,95]),3))
np.save(D+'/cordface_w.npy', sel)
U=np.fromfile(D+'/uv.f32',np.float32).reshape(-1,2); I=np.fromfile(D+'/idx.u32',np.uint32).reshape(-1,3)
W=2048; im=Image.new('RGB',(W,W),(128,128,128)); dr=ImageDraw.Draw(im)
for f in np.where(sel)[0]: dr.polygon([tuple(U[i]*W) for i in I[f]],fill=(0,220,0))
im.save(D+'/mask.jpg',quality=92)
