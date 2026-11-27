"""v29.0 (E5C1 THINGS-3, coordinator's ask) · w51keydish: the small bowl on his dining table that his keys go into (the
plan's 9.4, 18-24 s: "his keys in a bowl", the keys at 21.0), made in code. A shallow stoneware bowl 0.16 across and
0.045 tall (his keys w51keycard, 0.15 x 0.09, lie in it): a speckled dark grey-blue glaze inside and over the rim,
running thin at the rim's edge, the foot ring left bare buff clay. Its inside floor at 0.012 m.
    $BPY masters/v29.0/props/code/keydish.py <out.glb> [px]"""
import sys, os; sys.path.insert(0, os.path.dirname(__file__))
from lib import *

OUT = sys.argv[-2] if sys.argv[-1].isdigit() else sys.argv[-1]
PX = int(sys.argv[-1]) if sys.argv[-1].isdigit() else 1024
reset(519)
m = M('stoneware'); co = m.coord('Object')
z = m.n.new('ShaderNodeSeparateXYZ'); m.l.new(co, z.inputs[0]); zz = z.outputs['Z']
speck = m.math('GREATER_THAN', m.noise(co, 260, detail=2), 0.68)
pool = m.noise(co, 14, detail=3)
glaze = m.mix(m.math('MULTIPLY', pool, 0.7), '#3d4a57', '#5d6b74')
glaze = m.mix(m.math('MULTIPLY', speck, 0.6), glaze, '#1c2026')
clay = m.mix(m.math('MULTIPLY', m.noise(co, 120, detail=4), 0.5), '#b9a585', '#9c8a6c')
bare = m.math('LESS_THAN', zz, 0.0085)                     # the foot left unglazed
# the rim's edge where the glaze runs thin (a paler band at the very top)
rim = m.math('GREATER_THAN', zz, 0.0425)
gl2 = m.mix(m.math('MULTIPLY', rim, 0.55), glaze, '#9aa3a6')
m.col = m.mix(bare, gl2, clay)
m.rough = m.math('ADD', 0.2, m.math('MULTIPLY', bare, 0.65))
m.height = m.math('ADD', m.math('MULTIPLY', speck, 0.3), m.math('MULTIPLY', pool, 0.3)); m.bump_strength = 0.05
mat = proc(m)
# one turned profile, outside then over the rim and down the inside to the middle (a solid wall about 6 mm)
prof = [(0.0, 0.0006), (0.036, 0.0006), (0.040, 0.0), (0.046, 0.0), (0.048, 0.003), (0.047, 0.008), (0.056, 0.012),
        (0.068, 0.020), (0.076, 0.031), (0.0795, 0.040), (0.0800, 0.0438), (0.0790, 0.0452), (0.0770, 0.0448),
        (0.0735, 0.039), (0.065, 0.028), (0.052, 0.018), (0.036, 0.0130), (0.015, 0.0120), (0.0, 0.0119)]
ob = lathe('keydish', prof, n=96, mat=mat)
stats(ob)
uv_all(ob, margin=0.004)
bake(ob, px=PX, out_dir=os.path.join(os.path.dirname(OUT), 'sheets'), tag='keydish')
export([ob], OUT)
