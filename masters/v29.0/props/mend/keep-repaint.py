# the keepsake's CLOTH repainted a faded pale cream, its CORD kept: per texel, the face that owns it (rasterised in UV:
# the cord's faces from grow.py, every other face cloth; the gutter between charts takes its nearest owner). The cloth's
# own light and weave are kept as its luminance about its mean, softened (an old washed cloth), over the cream.
import sys, numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
D, OUT = sys.argv[1], sys.argv[2]; SC=3.5
V=np.load(D+'/V.npy'); F=np.load(D+'/F.npy'); sel=np.load(D+'/cordface_w.npy')
# tidy: a big FLAT face in the cord set is cloth (a long run of the cord has big faces too, but curved ones)
el=np.max([np.linalg.norm(V[F[:,a]]-V[F[:,b]],axis=1) for a,b in ((0,1),(1,2),(2,0))],0)*SC*10   # mm
print('cord faces max edge mm pct', np.round(np.percentile(el[sel],[50,90,99,99.9]),2))
sp=np.load(D+'/spread.npy')   # (2.5 mm ball)
big = sel & (el > float(sys.argv[3])) & (sp[F].min(1) < 0.12); print('dropped big flat faces', big.sum()); sel = sel & ~big
# the crease: one or two rings of faces round the cord, still curved (spread > 0.3) and small (< 2 mm): the tube's
# lower flank where it sinks into the cloth, which the growth stopped short of
RING=int(sys.argv[4]) if len(sys.argv) > 4 else 0
vf=[[] for _ in range(len(V))]
for f in range(len(F)):
    for v in F[f]: vf[v].append(f)
for _ in range(RING):
    cand=np.unique(np.concatenate([vf[v] for v in np.unique(F[sel])]))
    add=cand[(~sel[cand]) & (sp[F[cand]].mean(1) > 0.3) & (el[cand] < 2)]; sel[add]=True
    print('ring added', len(add))
np.save(D+'/cordface_final.npy', sel)
U=np.fromfile(D+'/uv.f32',np.float32).reshape(-1,2); I=np.fromfile(D+'/idx.u32',np.uint32).reshape(-1,3)
src=np.asarray(Image.open(D+'/texture_0.jpg').convert('RGB')).astype(float); H,W=src.shape[:2]
lab=Image.new('L',(W,H),0); dr=ImageDraw.Draw(lab)
for f in range(len(I)): dr.polygon([tuple(U[i]*[W,H]) for i in I[f]], fill=2 if sel[f] else 1)
lab=np.asarray(lab)
# nearest owner for the gutter
d,(iy,ix)=ndimage.distance_transform_edt(lab==0, return_indices=True); own=lab[iy,ix]
L=src@[0.299,0.587,0.114]; cl=own==1; m=L[(lab==1)].mean()
rel=1+0.55*(L/m-1)                       # the cloth's shading and weave, softened
cream=np.array([212,198,170.])           # faded pale cream
out=src.copy(); out[cl]=np.clip(cream[None,:]*rel[cl][:,None],0,255)
Image.fromarray(out.astype(np.uint8)).save(OUT, quality=95)
print('cloth texels', cl.sum(), 'cord texels', (own==2).sum(), 'cloth mean L', round(m,1))
