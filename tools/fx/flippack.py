# v28.0 (E4C5, R94): THE FLIPBOOK PACKER, run in Blender's own Python on the GPU box beside flipsim.py's frames:
#   blender -b -P tools/fx/flippack.py -- KIND INDIR OUTDIR COLS FRAMEPX [LOOP]
# Reads INDIR/a_####.exr (the fire's light, linear) and INDIR/b_####.exr (the smoke, premultiplied, linear), in
# frame order, and writes OUTDIR/fx<KIND>.png: COLS x COLS frames of FRAMEPX, frame i at column i % COLS and row
# i // COLS counted from the TOP of the picture. The four channels are data, never a colour (CHANNEL PACKED):
#   R  the fire's HEAT, normalised over the whole run (its 99.9th centile is 1), stored as heat^(1/2.2)
#   G  the smoke's SHADE (its sunlit brightness, unpremultiplied), normalised (99.5th centile 1), shade^(1/2.2)
#   B  the fire's GLOW: R's heat blurred wide (a gaussian of a tenth of the frame), heat^(1/2.2): a halo the game adds
#   A  the smoke's COVER (1 - its transmittance), as rendered
# The game colours R through a ramp of its own (orange fire, gold, violet), darkens by A and shades by G.
# LOOP n (the fire): the run holds COLS*COLS + n frames; the last n are crossfaded into the first n, so the last
# frame flows into the first (frame k < n is mixed from frame COLS*COLS + k and frame k by k / n).
# Every frame is resampled by area (premultiplied), the border measured (what touches a frame's edge is cut off in
# the game), and the loop's seam measured against the run's own frame-to-frame change. Also written:
#   OUTDIR/fx<KIND>-preview.png  eight frames at the render's full size, coloured as the game will, on a dark ground
import bpy, sys, os, glob, math, zlib, struct
import numpy as np

A = sys.argv[sys.argv.index('--') + 1:]
KIND, IND, OUTD = A[0], A[1], A[2]
COLS, FPX = int(A[3]), int(A[4])
LOOP = int(A[5]) if len(A) > 5 else 0
NF = COLS * COLS
os.makedirs(OUTD, exist_ok=True)


def say(*a):
    print(*a, flush=True)


def load(path):
    im = bpy.data.images.load(path, check_existing=False)
    w, h = im.size
    px = np.empty(w * h * 4, dtype=np.float32)
    im.pixels.foreach_get(px)
    bpy.data.images.remove(im)
    return px.reshape(h, w, 4)[::-1].copy()          # top row first


def area_matrix(n_in, n_out):
    # out[i] = the mean of the input over [i, i+1) * n_in / n_out
    W = np.zeros((n_out, n_in), dtype=np.float32)
    s = n_in / n_out
    for i in range(n_out):
        a, b = i * s, (i + 1) * s
        j0, j1 = int(math.floor(a)), int(math.ceil(b))
        for j in range(j0, min(j1, n_in)):
            W[i, j] = min(b, j + 1) - max(a, j)
        W[i] /= W[i].sum()
    return W


def resample(img, n):
    h, w = img.shape[:2]
    Wy, Wx = area_matrix(h, n), area_matrix(w, n)
    t = np.tensordot(Wy, img, axes=(1, 0))
    return np.tensordot(t, Wx, axes=(1, 1)).transpose(0, 2, 1)


def blur(x, sigma):
    r = int(3 * sigma)
    k = np.exp(-0.5 * (np.arange(-r, r + 1) / sigma) ** 2)
    k /= k.sum()
    pad = np.pad(x, r, mode='constant')
    t = np.apply_along_axis(lambda v: np.convolve(v, k, mode='valid'), 0, pad)
    return np.apply_along_axis(lambda v: np.convolve(v, k, mode='valid'), 1, t)


def png(path, arr):
    # arr: h x w x 4 uint8, top row first; plain zlib PNG (no colour management can touch it)
    h, w = arr.shape[:2]
    raw = b''.join(b'\x00' + arr[y].tobytes() for y in range(h))

    def chunk(t, d):
        c = struct.pack('>I', len(d)) + t + d
        return c + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    with open(path, 'wb') as f:
        f.write(b'\x89PNG\r\n\x1a\n')
        f.write(chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0)))
        f.write(chunk(b'IDAT', zlib.compress(raw, 9)))
        f.write(chunk(b'IEND', b''))


fa = sorted(glob.glob(os.path.join(IND, 'a_*.exr')))
fb = sorted(glob.glob(os.path.join(IND, 'b_*.exr')))
FIRE = len(fa) > 0
need = NF + LOOP
if len(fb) < need or (FIRE and len(fa) < need):
    say('NOT ENOUGH FRAMES', len(fa), len(fb), 'need', need)
    sys.exit(2)
fa, fb = fa[:need], fb[:need]
say('PACK', KIND, need, 'frames', 'fire' if FIRE else 'smoke only', '->', COLS, 'x', COLS, 'of', FPX)

heat, prem, cover, full = [], [], [], []
for i in range(need):
    b = load(fb[i])
    hb = load(fa[i])[..., :3].mean(axis=2) if FIRE else np.zeros(b.shape[:2], np.float32)
    full.append((hb, b))
    small_b = resample(b, FPX)
    heat.append(resample(hb[..., None], FPX)[..., 0] if FIRE else np.zeros((FPX, FPX), np.float32))
    prem.append(small_b[..., :3].mean(axis=2))
    cover.append(np.clip(small_b[..., 3], 0, 1))
heat, prem, cover = np.array(heat), np.array(prem), np.array(cover)

if LOOP:
    for k in range(LOOP):
        t = k / LOOP
        for arr in (heat, prem, cover):
            arr[k] = arr[NF + k] * (1 - t) + arr[k] * t
    heat, prem, cover = heat[:NF], prem[:NF], cover[:NF]

hs = float(np.percentile(heat[heat > 1e-4], 99.9)) if FIRE and (heat > 1e-4).any() else 1.0
shade = prem / np.maximum(cover, 1e-3)
lit = cover > 0.05
ss = float(np.percentile(shade[lit], 99.5)) if lit.any() else 1.0
say('SCALE heat', round(hs, 5), 'shade', round(ss, 5))
h01 = np.clip(heat / hs, 0, 1)
s01 = np.where(cover > 0.004, np.clip(shade / ss, 0, 1), 0)
g01 = np.array([np.clip(blur(h, FPX / 10.0), 0, 1) for h in h01]) if FIRE else np.zeros_like(h01)
if FIRE:
    g01 = np.clip(g01 / max(1e-6, float(np.percentile(g01, 99.9))), 0, 1)

# the border: what reaches a frame's outer two pixels is cut off in the game
edge = np.zeros(NF)
for i in range(NF):
    m = np.maximum(h01[i], cover[i])
    edge[i] = max(m[:2].max(), m[-2:].max(), m[:, :2].max(), m[:, -2:].max())
say('EDGE max', round(float(edge.max()), 3), 'frames over 0.05:', int((edge > 0.05).sum()), 'of', NF,
    'worst frame', int(edge.argmax()))
# the seam: the last frame against the first, beside the run's own frame-to-frame change
d = [float(np.abs(h01[i + 1] - h01[i]).mean() + np.abs(cover[i + 1] - cover[i]).mean()) for i in range(NF - 1)]
seam = float(np.abs(h01[0] - h01[-1]).mean() + np.abs(cover[0] - cover[-1]).mean())
say('STEP mean', round(float(np.mean(d)), 5), 'max', round(float(np.max(d)), 5), 'seam (last to first)', round(seam, 5))

enc = lambda x: np.round(255 * np.power(np.clip(x, 0, 1), 1 / 2.2)).astype(np.uint8)
atlas = np.zeros((COLS * FPX, COLS * FPX, 4), np.uint8)
for i in range(NF):
    r, c = divmod(i, COLS)
    cell = atlas[r * FPX:(r + 1) * FPX, c * FPX:(c + 1) * FPX]
    cell[..., 0] = enc(h01[i])
    cell[..., 1] = enc(s01[i])
    cell[..., 2] = enc(g01[i])
    cell[..., 3] = np.round(255 * cover[i]).astype(np.uint8)
png(os.path.join(OUTD, 'fx%s.png' % KIND), atlas)
say('WROTE', os.path.join(OUTD, 'fx%s.png' % KIND), atlas.shape, os.path.getsize(os.path.join(OUTD, 'fx%s.png' % KIND)))

# the preview: eight frames at the render's own size, coloured as the game will (an orange ramp over the heat, the
# smoke a warm grey shaded by G, over a dark blue-grey ground)
ramp = np.array([[0, 0, 0], [0.45, 0.04, 0.0], [0.95, 0.30, 0.03], [1.0, 0.62, 0.16], [1.0, 0.88, 0.55], [1, 1, 0.95]])


def tint(t):
    x = np.clip(t, 0, 1) * (len(ramp) - 1)
    i = np.minimum(np.floor(x).astype(int), len(ramp) - 2)
    f = (x - i)[..., None]
    return ramp[i] * (1 - f) + ramp[i + 1] * f


pick = [int(round(k * (need - 1) / 7)) for k in range(8)]
P = full[0][1].shape[0]
prev = np.zeros((2 * P, 4 * P, 3))
for n, i in enumerate(pick):
    hb, b = full[i]
    cov = np.clip(b[..., 3], 0, 1)
    sh = np.where(cov > 0.004, np.clip(b[..., :3].mean(axis=2) / np.maximum(cov, 1e-3) / ss, 0, 1), 0)
    ground = np.array([0.06, 0.07, 0.09])
    smoke = (0.25 + 0.6 * sh)[..., None] * np.array([0.55, 0.52, 0.48])
    col = ground * (1 - cov[..., None]) + smoke * cov[..., None]
    if FIRE:
        h = np.clip(hb / hs, 0, 1)
        col = col + tint(np.power(h, 1 / 2.2)) * np.power(h, 0.6)[..., None] * 1.2
    r, c = divmod(n, 4)
    prev[r * P:(r + 1) * P, c * P:(c + 1) * P] = col
out8 = np.round(255 * np.power(np.clip(prev, 0, 1), 1 / 2.2)).astype(np.uint8)
png(os.path.join(OUTD, 'fx%s-preview.png' % KIND), np.concatenate([out8, np.full(out8.shape[:2] + (1,), 255, np.uint8)], 2))
say('PREVIEW frames', pick)
