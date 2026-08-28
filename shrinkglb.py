"""
Shrink the textures inside a .glb.

Downloaded characters routinely ship 1-4K maps saved at near-maximum quality.
On a page that has to load over mobile data that is usually the single largest
cost in the file, and it buys nothing — the model is a few thousand triangles
seen at a distance. This re-encodes every embedded image and rebuilds the
binary chunk around the new sizes.

    python3 shrinkglb.py in.glb out.glb [max_px] [quality]
"""
import json, struct, sys, io
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
MAX_PX = int(sys.argv[3]) if len(sys.argv) > 3 else 768
QUALITY = int(sys.argv[4]) if len(sys.argv) > 4 else 82

raw = open(src, 'rb').read()
jlen, = struct.unpack('<I', raw[12:16])
gltf = json.loads(raw[20:20 + jlen])
boff = 20 + jlen
blen, _ = struct.unpack('<II', raw[boff:boff + 8])
BIN = raw[boff + 8: boff + 8 + blen]

views = gltf['bufferViews']
payload = [bytes(BIN[v.get('byteOffset', 0): v.get('byteOffset', 0) + v['byteLength']])
           for v in views]

saved = 0
done = {}                                # several materials often share one image
for img in gltf.get('images', []):
    vi = img.get('bufferView')
    if vi is None:
        continue
    if vi in done:                       # re-encoding it again would duplicate it
        img['mimeType'] = done[vi]
        continue
    before = len(payload[vi])
    im = Image.open(io.BytesIO(payload[vi]))
    w, h = im.size
    keep_alpha = im.mode in ('RGBA', 'LA') and im.getchannel('A').getextrema()[0] < 255
    if max(w, h) > MAX_PX:
        s = MAX_PX / max(w, h)
        im = im.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)
    buf = io.BytesIO()
    if keep_alpha:                       # transparency has to survive — stay PNG
        im.save(buf, 'PNG', optimize=True)
        img['mimeType'] = 'image/png'
    else:
        im.convert('RGB').save(buf, 'JPEG', quality=QUALITY, optimize=True)
        img['mimeType'] = 'image/jpeg'
    payload[vi] = buf.getvalue()
    done[vi] = img['mimeType']
    saved += before - len(payload[vi])
    print(f"  {img.get('name', 'image')[:34]:36s} {w}x{h} {before//1024:5d} KB"
          f"  ->  {im.size[0]}x{im.size[1]} {len(payload[vi])//1024:5d} KB")

# repack: every bufferView moves, so offsets and lengths are rewritten together
out = bytearray()
for v, data in zip(views, payload):
    while len(out) % 4:
        out.append(0)
    v['byteOffset'] = len(out)
    v['byteLength'] = len(data)
    out += data
while len(out) % 4:
    out.append(0)
gltf['buffers'][0]['byteLength'] = len(out)
for v in views:
    v.pop('byteStride', None) if v.get('byteStride') == 0 else None

js = json.dumps(gltf, separators=(',', ':')).encode()
js += b' ' * ((4 - len(js) % 4) % 4)
glb = (b'glTF' + struct.pack('<II', 2, 12 + 8 + len(js) + 8 + len(out))
       + struct.pack('<I', len(js)) + b'JSON' + js
       + struct.pack('<I', len(out)) + b'BIN\x00' + bytes(out))
open(dst, 'wb').write(glb)
print(f'{src} {len(raw)//1024} KB  ->  {dst} {len(glb)//1024} KB '
      f'({saved//1024} KB of texture removed)')
