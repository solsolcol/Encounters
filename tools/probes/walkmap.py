#!/usr/bin/env python3
# v25.5 · the maps tools/probes/walkmap.mjs wrote, drawn side by side (seen from above, the shop's back wall at the top):
#   python3 -I tools/probes/walkmap.py <out.png> "<title>=<file.json>" ["<title>=<file.json>" ...] [--box x0,x1,z0,z1]
# Green is floor he can walk to from where play puts him, dark grey is solid, pale grey is open ground he cannot reach;
# the red outline is the ground he must stay on (the stage's keepIn, or --box for a build that names none); the white
# dot is the spawn. Every map is drawn at the same scale: four pixels to a cell.
import sys, json
from PIL import Image, ImageDraw
a = sys.argv[1:]
out = a[0]; box = None; items = []
i = 1
while i < len(a):
    if a[i] == '--box': box = [float(v) for v in a[i + 1].split(',')]; i += 2; continue
    t, f = a[i].split('=', 1); items.append((t, json.load(open(f)))); i += 1
PX = 4; PAD = 14; TOP = 34
tiles = []
for title, d in items:
    nx, nz = d['nx'], d['nz']
    im = Image.new('RGB', (nx * PX, nz * PX), (40, 40, 44))
    px = im.load()
    for j, row in enumerate(d['rows']):
        for k, c in enumerate(row):
            col = (58, 58, 64) if c == '#' else (70, 190, 110) if c == 'o' else (150, 150, 156)
            for y in range(PX):
                for x in range(PX): px[k * PX + x, j * PX + y] = col
    dr = ImageDraw.Draw(im)
    K = d.get('keepIn') or (box and {'minX': box[0], 'maxX': box[1], 'minZ': box[2], 'maxZ': box[3]})
    if K:
        X = lambda v: (v - d['minX']) / d['st'] * PX; Z = lambda v: (v - d['minZ']) / d['st'] * PX
        dr.rectangle([X(K['minX']), Z(K['minZ']), X(K['maxX']), Z(K['maxZ'])], outline=(235, 70, 60), width=3)
    sx = (d['spawn'][0] - d['minX']) / d['st'] * PX; sz = (d['spawn'][1] - d['minZ']) / d['st'] * PX
    dr.ellipse([sx - 5, sz - 5, sx + 5, sz + 5], fill=(255, 255, 255))
    tiles.append((f"{title}: {d['area']} square metres he can walk", im))
W = max(t[1].width for t in tiles) + 2 * PAD; H = sum(t[1].height + TOP + PAD for t in tiles) + PAD
sheet = Image.new('RGB', (W, H), (18, 18, 20)); dr = ImageDraw.Draw(sheet); y = PAD
for title, im in tiles:
    dr.text((PAD, y + 8), title, fill=(240, 240, 240)); y += TOP
    sheet.paste(im, (PAD, y)); y += im.height + PAD
sheet.save(out); print(out, sheet.size)
