# v29.0 · the bottle's cut, for mend/glass.mjs: every face whose centroid stands above 0.835 of the bottle's height (just
# under the lip ring: the neck below it carries a white strip of the glass's paint all the way up, so no lower cut is
# clean) is the CORK and keeps the sheet; the rest is GLASS. The glass's texels are flattened to their own median white
# (the faint invented print painted out of the sheet, though the glass material draws no sheet).
#   python3 -I bottle-cut.py <dump dir of assets/w51bottle.glb as prepared, by dump.mjs; V.npy/F.npy by keep-seg.py>
import sys,numpy as np
from PIL import Image, ImageDraw
D=sys.argv[1]; V=np.load(D+'/V.npy'); F=np.load(D+'/F.npy')
U=np.fromfile(D+'/uv.f32',np.float32).reshape(-1,2); I=np.fromfile(D+'/idx.u32',np.uint32).reshape(-1,3)
img=np.asarray(Image.open(D+'/texture_0.jpg').convert('RGB')).astype(float); H,W=img.shape[:2]
y=V[:,1]; c=(V[F][:,:,1].mean(1)-y.min())/(y.max()-y.min())
cork=c>0.835; print('cork faces', cork.sum(), 'glass', (~cork).sum()); cork.astype(np.uint8).tofile(D+'/cork.u8')
lab=Image.new('L',(W,H),0); dr=ImageDraw.Draw(lab)
for f in np.where(~cork)[0]: dr.polygon([tuple(U[i]*[W,H]) for i in I[f]], fill=1)
lab=np.asarray(lab)==1; med=np.median(img[lab],0); out=img.copy(); out[lab]=med
Image.fromarray(out.astype(np.uint8)).save(D+'/tex-noprint.jpg',quality=95); print('glass texels', lab.sum(), 'flattened to', med)
