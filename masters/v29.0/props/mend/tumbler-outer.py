# v29.0 · the tumbler's OUTER skin only: Meshy made the glass a thick shell whose inner wall is ragged (holes and torn
# patches, which a see-through material shows as grey blotches). Kept: every face whose normal points away from the
# glass's axis (its outside wall), faces under it pointing down (its foot), and the rim (the top 4 % of its height); the
# inner wall and the inner floor go. The result is drawn double-sided (glass.mjs DS=1), a thin clear skin.
#   python3 -I tumbler-outer.py <dump dir of the prepared glass>   -> keep.u8 (1 a face kept)
import sys, numpy as np
D=sys.argv[1]
P=np.fromfile(D+'/pos.f32',np.float32).reshape(-1,3); I=np.fromfile(D+'/idx.u32',np.uint32).reshape(-1,3)
c=P[I].mean(1); n=np.cross(P[I[:,1]]-P[I[:,0]],P[I[:,2]]-P[I[:,0]]); n/=np.linalg.norm(n,axis=1,keepdims=True)+1e-12
ax=P[:,[0,2]].mean(0); rad=c[:,[0,2]]-ax; rad/=np.linalg.norm(rad,axis=1,keepdims=True)+1e-12
y0,y1=P[:,1].min(),P[:,1].max(); h=(c[:,1]-y0)/(y1-y0)
# the OUTERMOST skin: a face counts only if it lies within EPS of the farthest surface from the axis in its own cell
# (60 bands of height x 120 of angle): the generator laid torn inner sheets close under the outer wall, facing out too
r=np.linalg.norm(c[:,[0,2]]-ax,axis=1); ang=np.arctan2(c[:,2]-ax[1],c[:,0]-ax[0])
hb=np.clip((h*60).astype(int),0,59); ab=((ang+np.pi)/(2*np.pi)*120).astype(int)%120; cell=hb*120+ab
rmax=np.zeros(60*120); np.maximum.at(rmax,cell,r)
EPS=0.03*(r.max())
outer=((n[:,0]*rad[:,0]+n[:,2]*rad[:,1])>0.15)&(r>=rmax[cell]-EPS)
foot=((n[:,1]<-0.3)&(h<0.15))|((h<0.12)&(r>=rmax[cell]-EPS))   # the underside, and the outermost skin where the wall rounds under
rim=h>0.96
keep=outer|foot|rim
print('faces', len(I), 'kept', keep.sum(), '(outer', outer.sum(), 'foot', foot.sum(), 'rim', rim.sum(), ')')
keep.astype(np.uint8).tofile(D+'/keep.u8')
