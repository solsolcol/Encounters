# v22.0 CP5 · HER PHOTOGRAPH ON THE WALL, cut from Chad's yin amulet so the wall and the locket show the same woman:
# the portrait under the amulet's glass (an unlit, orthographic render of its face, flat.mjs) inside its oval, set in an
# old cream mat with an oval window and a thin gilt line — the way an old photograph of the departed is framed.
#   python3 -I matphoto.py <front_1600.raw> <out_760x1004.raw>
import sys, numpy as np, subprocess
W = 1600
src = np.fromfile(sys.argv[1], dtype=np.uint8).reshape(W, W, 3).astype(np.float32)
x0, x1, y0, y1 = 346, 1251, 305, 1535                      # the inner oval's box in the render (measured)
cx, cy, ea, eb = (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2 - 4, (y1 - y0) / 2 - 4
crop = src[y0:y1, x0:x1]
OW, OH, PW = 760, 1004, 640                                 # the mat, and the portrait's width on it
s = PW / crop.shape[1]; PH = int(round(crop.shape[0] * s))
# bilinear resample
yy = (np.arange(PH) + 0.5) / s - 0.5; xx = (np.arange(PW) + 0.5) / s - 0.5
yi = np.clip(np.floor(yy).astype(int), 0, crop.shape[0] - 2); xi = np.clip(np.floor(xx).astype(int), 0, crop.shape[1] - 2)
fy = (yy - yi)[:, None, None]; fx = (xx - xi)[None, :, None]
p = (crop[yi][:, xi] * (1 - fy) * (1 - fx) + crop[yi + 1][:, xi] * fy * (1 - fx) + crop[yi][:, xi + 1] * (1 - fy) * fx + crop[yi + 1][:, xi + 1] * fy * fx)
out = np.zeros((OH, OW, 3), np.float32)
rng = np.random.default_rng(5)
Y, X = np.mgrid[0:OH, 0:OW].astype(np.float32)
mat = np.array([214, 202, 176], np.float32)
noise = rng.normal(0, 3.2, (OH, OW, 1)).astype(np.float32)
vig = 1 - 0.18 * (((X - OW / 2) / (OW / 2)) ** 2 + ((Y - OH / 2) / (OH / 2)) ** 2)
out[:] = mat * vig[..., None] + noise
ox, oy = (OW - PW) // 2, (OH - PH) // 2
# the oval window in the mat's frame
ecx, ecy, ra, rb = ox + (cx - x0) * s, oy + (cy - y0) * s, ea * s, eb * s
d = np.sqrt(((X - ecx) / ra) ** 2 + ((Y - ecy) / rb) ** 2)
inside = d < 1.0
canvas_p = np.zeros_like(out); canvas_p[oy:oy + PH, ox:ox + PW] = p
out[inside] = canvas_p[inside]
# a thin gilt line round the window and a soft shadow just inside it (the mat's bevel)
line = (d >= 1.0) & (d < 1.0 + 3.0 / min(ra, rb))
out[line] = np.array([150, 116, 62], np.float32)
sh = (d < 1.0) & (d > 1.0 - 10.0 / min(ra, rb))
k = ((d[sh] - (1.0 - 10.0 / min(ra, rb))) / (10.0 / min(ra, rb)))[:, None]
out[sh] = out[sh] * (1 - 0.35 * k)
np.clip(out, 0, 255).astype(np.uint8).tofile(sys.argv[2])
print('mat', OW, OH, 'portrait', PW, PH, 'window', round(ra * 2), round(rb * 2))
