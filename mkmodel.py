"""
Build a custom 3D model the way you would get one out of Blender or Meshy:
real geometry, real PBR materials, exported as a single .glb file.

Subject: a cased amulet pendant — the classic arched "phra" tablet in a
gold casing with a bail loop, and a seated figure in low relief on the face.
"""
import numpy as np, trimesh
from shapely.geometry import Polygon
from trimesh.creation import extrude_polygon, uv_sphere, cylinder, annulus, box, torus


def srgb(r, g, b, a=255):
    """glTF's baseColorFactor is LINEAR, not sRGB. Picking a colour the way you
    would in Photoshop and writing it straight into a .glb makes every material
    come out pale and washed out — convert it first."""
    def lin(c):
        c = c / 255.0
        c = c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
        return int(round(c * 255))
    return [lin(r), lin(g), lin(b), a]


SEG = 48


def arch_profile(w, straight_h, scale=1.0):
    """Flat-bottomed tablet with a semicircular top — the amulet silhouette."""
    hw = w / 2
    pts = [(-hw, 0), (hw, 0), (hw, straight_h)]
    r = hw
    for a in np.linspace(0, np.pi, SEG):
        pts.append((r * np.cos(a), straight_h + r * np.sin(a)))
    pts.append((-hw, straight_h))
    p = Polygon(pts).buffer(0)
    if scale != 1.0:
        p = p.buffer(hw * (scale - 1.0), resolution=16)
    return p


def ellipsoid(rx, ry, rz, x, y, z, res=(18, 14)):
    m = uv_sphere(radius=1.0, count=list(res))
    m.apply_scale([rx, ry, rz])
    m.apply_translation([x, y, z])
    return m


def relief_figure():
    """A seated figure in raised relief: nimbus, head, robed torso, arms,
    crossed legs and a lotus base. Read at a glance, not anatomically exact."""
    parts = []

    # nimbus behind the head — the single most legible cue
    parts.append(ellipsoid(0.30, 0.30, 0.055, 0, 0.70, -0.02, (26, 18)))

    parts.append(ellipsoid(0.135, 0.165, 0.105, 0, 0.70, 0.03))        # head
    parts.append(ellipsoid(0.062, 0.075, 0.05, 0, 0.855, 0.025))       # ushnisha
    parts.append(ellipsoid(0.055, 0.038, 0.04, 0, 0.545, 0.03))        # neck

    # robed torso: wide at the shoulders, tapering to the lap
    torso = ellipsoid(0.255, 0.235, 0.10, 0, 0.36, 0.025, (24, 18))
    v = torso.vertices.copy()
    t = (v[:, 1] - v[:, 1].min()) / np.ptp(v[:, 1])
    v[:, 0] *= 0.62 + 0.38 * t                                          # narrow hips
    torso.vertices = v
    parts.append(torso)

    # arms folded down to the lap
    for sx in (-1, 1):
        arm = ellipsoid(0.062, 0.155, 0.062, sx * 0.215, 0.34, 0.035)
        arm.apply_transform(trimesh.transformations.rotation_matrix(
            sx * 0.22, [0, 0, 1], [sx * 0.215, 0.34, 0.035]))
        parts.append(arm)

    # crossed legs
    parts.append(ellipsoid(0.315, 0.085, 0.085, 0, 0.175, 0.03, (24, 14)))
    parts.append(ellipsoid(0.115, 0.05, 0.06, 0, 0.225, 0.06))          # hands in lap

    # lotus base: two rows of petals
    for row, (n, ry, rad) in enumerate([(7, 0.085, 0.055), (6, 0.035, 0.048)]):
        for i in range(n):
            fx = (i - (n - 1) / 2) / max(n - 1, 1)
            parts.append(ellipsoid(rad, rad * 0.72, rad * 0.65,
                                   fx * 0.62, ry, 0.03 - row * 0.012, (12, 10)))

    return trimesh.util.concatenate(parts)


# ── tablet ────────────────────────────────────────────────────────────────
tablet = extrude_polygon(arch_profile(1.0, 0.85), height=0.16)

# ── relief, pressed onto the tablet face ──────────────────────────────────
relief = relief_figure()
relief.apply_scale(1.06)
relief.apply_translation([0, 0.22, 0.15])

face = trimesh.util.concatenate([tablet, relief])
face.visual = trimesh.visual.TextureVisuals(
    material=trimesh.visual.material.PBRMaterial(
        name='amulet_clay',
        baseColorFactor=srgb(104, 80, 58),         # fired temple clay
        metallicFactor=0.05, roughnessFactor=0.82))

# ── gold casing: the same silhouette, hollowed into a frame ───────────────
outer = arch_profile(1.0, 0.85, scale=1.16)
inner = arch_profile(1.0, 0.85, scale=1.005)
ring = Polygon(outer.exterior.coords, [inner.exterior.coords])
casing = extrude_polygon(ring, height=0.34)
casing.apply_translation([0, 0, -0.04])          # stands proud front and back

# back plate so the casing reads as solid from behind
backplate = extrude_polygon(outer, height=0.04)
backplate.apply_translation([0, 0, -0.04])

# bail: the loop the cord runs through, hole axis left-to-right so it hangs flat
bail = torus(major_radius=0.115, minor_radius=0.032,
             major_sections=28, minor_sections=14)
bail.apply_transform(trimesh.transformations.rotation_matrix(np.pi / 2, [0, 1, 0]))
bail.apply_translation([0, 1.50, 0.09])

gold = trimesh.util.concatenate([casing, backplate, bail])
gold.visual = trimesh.visual.TextureVisuals(
    material=trimesh.visual.material.PBRMaterial(
        name='amulet_gold',
        baseColorFactor=srgb(206, 158, 66),
        metallicFactor=1.0, roughnessFactor=0.28))

# ── assemble, orient and scale to life size ───────────────────────────────
scene = trimesh.Scene()
scene.add_geometry(face, node_name='tablet', geom_name='tablet')
scene.add_geometry(gold, node_name='casing', geom_name='casing')

# centre on origin, then scale so the amulet is ~4.5 cm tall (three.js = metres)
b = scene.bounds
scene.apply_translation([-(b[0][0] + b[1][0]) / 2, -b[0][1], -(b[0][2] + b[1][2]) / 2])
height = scene.bounds[1][1] - scene.bounds[0][1]
scene.apply_scale(0.045 / height)

glb = scene.export(file_type='glb')
open('/tmp/g/amulet.glb', 'wb').write(glb)

tris = sum(len(g.faces) for g in scene.geometry.values())
print(f'amulet.glb  {len(glb)/1024:.1f} KB  ·  {tris:,} triangles  ·  '
      f'{len(scene.geometry)} meshes  ·  bounds {np.round(scene.extents, 4)}')
