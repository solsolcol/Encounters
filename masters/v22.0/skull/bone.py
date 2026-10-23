# v22.0: the skull's BONE colour from the scan's ambient occlusion (the red channel of its AO-and-thickness sheet).
# Ivory where the bone faces the room, yellowing and browning into every crevice (suture, socket, between the teeth);
# a little low-frequency mottling so no two square centimetres are the same; the UV islands PADDED into the empty
# sheet (push-pull) so a mipmap never pulls the black background into a seam.
#   python3 -I bone.py <ao_gray_1024.raw> <out_rgb_1024.raw>
import sys, numpy as np
W = 1024
a = np.fromfile(sys.argv[1], dtype=np.uint8).reshape(W, W).astype(np.float32) / 255.0
mask = a > 0.012                                   # the islands (the sheet's background is pure black)
k = np.clip(a, 0, 1) ** 1.35
rng = np.random.default_rng(22)
def blob(n, s):                                    # smooth noise: random grid, bilinear up
    g = rng.random((n + 1, n + 1)).astype(np.float32)
    y = np.linspace(0, n, W, endpoint=False); x = y
    y0 = np.floor(y).astype(int); x0 = y0; fy = (y - y0)[:, None]; fx = (x - x0)[None, :]
    return (g[y0][:, x0] * (1 - fy) * (1 - fx) + g[y0 + 1][:, x0] * fy * (1 - fx) + g[y0][:, x0 + 1] * (1 - fy) * fx + g[y0 + 1][:, x0 + 1] * fy * fx)
mott = 0.55 * blob(12, 1) + 0.3 * blob(40, 1) + 0.15 * blob(130, 1)    # 0..1
mott = (mott - mott.mean()) / (mott.std() + 1e-6)
hi = np.array([0.89, 0.83, 0.70], np.float32)     # ivory bone
lo = np.array([0.27, 0.19, 0.11], np.float32)     # the brown of a crevice
yel = np.array([0.78, 0.66, 0.44], np.float32)    # old yellowed bone
t = np.clip(0.5 + 0.22 * mott, 0, 1)[..., None]
top = hi * (1 - t) + yel * t                        # the open bone, mottled between ivory and yellow
col = lo + (top - lo) * k[..., None]
col *= (1.0 + 0.035 * mott)[..., None]
# push-pull: fill the background from the islands, coarse to fine, so every mip level of a seam sees bone
def pad(img, m):
    if img.shape[0] <= 4: 
        out = img.copy(); 
        if m.any(): out[~m] = img[m].mean(0)
        return out
    h = img.shape[0] // 2
    w4 = m.reshape(h, 2, h, 2).astype(np.float32)
    s = (img * m[..., None]).reshape(h, 2, h, 2, 3).sum((1, 3)); c = w4.sum((1, 3))
    small = np.where(c[..., None] > 0, s / np.maximum(c, 1)[..., None], 0); sm = c > 0
    small = pad(small, sm)
    up = small.repeat(2, 0).repeat(2, 1)
    out = img.copy(); out[~m] = up[~m]; return out
col = pad(col, mask)
np.clip(col * 255, 0, 255).astype(np.uint8).tofile(sys.argv[2])
print('islands', round(float(mask.mean()) * 100, 1), '% of the sheet; mean colour', (col[mask].mean(0) * 255).round(1))
