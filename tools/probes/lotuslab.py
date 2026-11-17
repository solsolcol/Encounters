#!/usr/bin/env python3
"""v26.15 · THE LOTUS LAB: episode 4 chapter 3's ending D draws the lotus of his first teaching on a canvas as his
opening is closed (c_zfx.js shutVision). This writes a page that draws EXACTLY what the game draws at any moment u (the
seconds from the ending's `shut`), copied out of the parts by this script, never retyped: `petalPath` and `lotusPaint`
from c_zfx.js, the easing from b_world1.js, `SHUTV` from a_head.js, and the lines of `shutVisionAt` that turn a moment
into its five numbers (k, a, r, g, b). A moment draws in a second where a game photograph costs minutes; draw the OLD
code beside the new first (pass a copy of an older c_zfx.js) to prove the lab shows the fault the game did.

    python3 -I tools/probes/lotuslab.py <out.html> [c_zfx.js to draw instead of the parts' own]
    CHROMIUM_PATH=... node tools/probes/lotuslab.mjs <out.html> <dir> [tag]     (a picture of the 512 canvas at each moment)
"""
import re, sys
P = 'masters/v26.0/parts/'
z = open(sys.argv[2] if len(sys.argv) > 2 else P + 'c_zfx.js', encoding='utf-8').read()
fns = z[z.index('    function petalPath(x, pt) {'):z.index('    function shutVisionAt(u) {')]
sv = z[z.index('    function shutVisionAt(u) {'):]
params = sv[sv.index('      const a = smo(sgk(u, V.show[0]'):sv.index('\n', sv.index('      const b = smo(sgk(u, V.'))]
shutv = re.search(r'  const SHUTV = \{[^\n]*\};', open(P + 'a_head.js', encoding='utf-8').read()).group(0)
ease = re.search(r'const c01 = [^\n]*;', open(P + 'b_world1.js', encoding='utf-8').read()).group(0)
open(sys.argv[1], 'w', encoding='utf-8').write(
  '<!doctype html><html><body style="margin:0;background:#000"><canvas id="c" width="512" height="512"></canvas><script>\n'
  'const cv = document.getElementById("c"); const shutVision = { svX: cv.getContext("2d"), svT: {}, drawn: "" };\n'
  + ease + '\n' + shutv + '\n' + fns +
  'window.at = (u) => { const V = SHUTV;\n' + params + '\n shutVision.drawn = ""; lotusPaint(k, a, r, g, b); return [k, a, r, g, b]; };\n'
  '</script></body></html>\n')
print('wrote', sys.argv[1])
