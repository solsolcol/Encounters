from PIL import Image, ImageFilter, ImageDraw, ImageChops
N = 768
def ground():
    base = Image.new('RGB', (N, N), (30, 27, 24))
    noise = Image.effect_noise((N, N), 40).convert('L')
    blot = Image.effect_noise((N // 12, N // 12), 70).convert('L').resize((N, N), Image.BICUBIC).filter(ImageFilter.GaussianBlur(16))
    grain = Image.merge('RGB', [noise.point(lambda v: (v - 128) * 0.10 + 128)] * 3)
    img = ImageChops.add(base, Image.merge('RGB', [blot.point(lambda v: v * 0.16), blot.point(lambda v: v * 0.14), blot.point(lambda v: v * 0.12)]))
    img = ImageChops.add(img, grain, 1.0, -128)
    glow = Image.new('L', (N, N), 0); d = ImageDraw.Draw(glow)
    for r in range(N // 2, 0, -6):
        d.ellipse([N / 2 - r, N / 2 - r * 0.95, N / 2 + r, N / 2 + r * 0.95], fill=int(60 * (1 - r / (N / 2)) ** 1.4))
    glow = glow.filter(ImageFilter.GaussianBlur(30))
    img = ImageChops.add(img, Image.merge('RGB', [glow.point(lambda v: v * 0.60), glow.point(lambda v: v * 0.46), glow.point(lambda v: v * 0.32)]))
    vig = Image.new('L', (N, N), 255); dv = ImageDraw.Draw(vig)
    for i in range(60):
        dv.rectangle([i * 3, i * 3, N - 1 - i * 3, N - 1 - i * 3], outline=int(255 * (i / 60) ** 0.8))
    vig = vig.filter(ImageFilter.GaussianBlur(28))
    img = ImageChops.multiply(img, Image.merge('RGB', [vig] * 3).point(lambda v: 70 + v * 185 / 255))
    d2 = ImageDraw.Draw(img); d2.rectangle([3, 3, N - 4, N - 4], outline=(8, 7, 6), width=6); d2.rectangle([10, 10, N - 11, N - 11], outline=(52, 47, 42), width=2)
    return img
for name, src, fill in [('iconnangkwak', 'nk.png', 0.86), ('icontakrut', 'tk.png', 0.84), ('iconphayant', 'py.png', 0.84)]:
    im = Image.open(src).convert('RGBA'); bb = im.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    piece = im.crop(bb); w, h = piece.size; s = fill * N / max(w, h); piece = piece.resize((round(w * s), round(h * s)), Image.LANCZOS)
    sh = Image.new('L', piece.size, 0); sh.paste(piece.getchannel('A')); sh = sh.filter(ImageFilter.GaussianBlur(14)).point(lambda v: v * 0.6)
    g = ground().convert('RGBA'); x, y = (N - piece.width) // 2, (N - piece.height) // 2
    dark = Image.new('RGBA', piece.size, (0, 0, 0, 255)); dark.putalpha(sh)
    g.alpha_composite(dark, (x + 10, y + 14)); g.alpha_composite(piece, (x, y))
    g.convert('RGB').resize((384, 384), Image.LANCZOS).save(name + '.jpg', quality=88, optimize=True)
cmp = Image.new('RGB', (384 * 4 + 60, 384), (0, 0, 0)); cmp.paste(Image.open('/home/user/Encounters/assets/icontorch.jpg'), (0, 0))
for i, n in enumerate(['iconnangkwak', 'icontakrut', 'iconphayant']): cmp.paste(Image.open(n + '.jpg'), ((i + 1) * 404, 0))
cmp.save('icons-cmp.jpg', quality=88)
