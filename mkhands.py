"""
First-person viewmodel arms: forearm, sleeve cuff, palm, four fingers and a thumb.

Both arms are exported into one .glb with the wrist at the origin, the forearm
running back along +Z and the fingers pointing forward along -Z, so all posing
and animation happens in the game rather than in the model.
"""
import numpy as np, trimesh
from trimesh.creation import uv_sphere, cylinder
from trimesh.transformations import (rotation_matrix as rot,
                                     translation_matrix as tr, concatenate_matrices as cat)


def srgb(r, g, b, a=255):
    """glTF's baseColorFactor is LINEAR, not sRGB. Picking a colour the way you
    would in Photoshop and writing it straight into a .glb makes every material
    come out pale and washed out — convert it first."""
    def lin(c):
        c = c / 255.0
        c = c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
        return int(round(c * 255))
    return [lin(r), lin(g), lin(b), a]


SKIN = trimesh.visual.material.PBRMaterial(
    name='skin', baseColorFactor=srgb(196, 148, 118),
    metallicFactor=0.0, roughnessFactor=0.66)
SLEEVE = trimesh.visual.material.PBRMaterial(
    name='sleeve', baseColorFactor=srgb(74, 80, 94),
    metallicFactor=0.0, roughnessFactor=0.94)


def taper(length, r0, r1, sections=12):
    """A tapered limb segment running from the origin along -Z, capped at both ends."""
    body = cylinder(radius=1.0, height=length, sections=sections)
    v = body.vertices.copy()
    t = (v[:, 2] + length / 2) / length              # 0 at -Z cap, 1 at +Z cap
    v[:, 0] *= r0 + (r1 - r0) * (1 - t)
    v[:, 1] *= r0 + (r1 - r0) * (1 - t)
    body.vertices = v
    body.apply_translation([0, 0, -length / 2])

    caps = []
    for z, r in ((0.0, r0), (-length, r1)):
        c = uv_sphere(radius=1.0, count=[sections, 10])
        c.apply_scale([r, r, r * 0.9])
        c.apply_translation([0, 0, z])
        caps.append(c)
    return trimesh.util.concatenate([body] + caps)


def digit(base, lengths, radii, curls, spread=0.0, out=0.0):
    """A chain of segments curling downward from `base`."""
    parts, M = [], cat(tr(base), rot(out, [0, 1, 0]), rot(spread, [0, 1, 0]))
    for L, r, c in zip(lengths, radii, curls):
        M = cat(M, rot(-c, [1, 0, 0]))
        seg = taper(L, r, r * 0.82, sections=10)
        seg.apply_transform(M)
        parts.append(seg)
        M = cat(M, tr([0, 0, -L]))
    return trimesh.util.concatenate(parts)


def arm():
    skin = []

    # forearm: wrist at origin, tapering out toward the elbow at +Z
    fore = cylinder(radius=1.0, height=0.30, sections=16)
    v = fore.vertices.copy()
    t = (v[:, 2] + 0.15) / 0.30
    v[:, 0] *= 0.031 + 0.019 * t
    v[:, 1] *= 0.027 + 0.017 * t
    fore.vertices = v
    fore.apply_translation([0, 0, 0.15])
    skin.append(fore)

    # palm — a flattened, slightly wedge-shaped block
    palm = uv_sphere(radius=1.0, count=[22, 16])
    palm.apply_scale([0.045, 0.019, 0.055])
    v = palm.vertices.copy()
    t = (0.055 - v[:, 2]) / 0.11                      # narrower at the wrist end
    v[:, 0] *= 0.80 + 0.28 * t
    palm.vertices = v
    palm.apply_translation([0, 0, -0.048])
    skin.append(palm)

    # knuckle roll
    kn = uv_sphere(radius=1.0, count=[18, 12])
    kn.apply_scale([0.044, 0.017, 0.014])
    kn.apply_translation([0, -0.002, -0.100])
    skin.append(kn)

    # four fingers, curled into a loose rest position
    fingers = [
        # x       lengths                 radii                  curls
        (-0.032, [0.040, 0.026, 0.020], [0.0132, 0.0118, 0.0104], [0.42, 0.52, 0.42]),  # index
        (-0.011, [0.045, 0.029, 0.021], [0.0138, 0.0122, 0.0106], [0.46, 0.56, 0.44]),  # middle
        (0.011, [0.041, 0.027, 0.020], [0.0130, 0.0115, 0.0101], [0.50, 0.58, 0.46]),   # ring
        (0.031, [0.032, 0.021, 0.017], [0.0115, 0.0104, 0.0092], [0.56, 0.60, 0.48]),   # little
    ]
    for x, L, r, c in fingers:
        skin.append(digit([x, -0.004, -0.100], L, r, c, spread=x * 1.1))

    # thumb: sits off the radial side, angled forward and down
    thumb = digit([-0.040, -0.004, -0.040], [0.034, 0.026], [0.0135, 0.0115],
                  [0.30, 0.42], out=0.62)
    thumb.apply_transform(cat(tr([-0.040, -0.004, -0.040]),
                              rot(-0.35, [0, 0, 1]),
                              tr([0.040, 0.004, 0.040])))
    skin.append(thumb)

    skin = trimesh.util.concatenate(skin)
    skin.visual = trimesh.visual.TextureVisuals(material=SKIN)

    # sleeve cuff: hides where the forearm ends and grounds it as a person
    cuff = cylinder(radius=1.0, height=0.10, sections=18)
    v = cuff.vertices.copy()
    t = (v[:, 2] + 0.05) / 0.10
    v[:, 0] *= 0.054 + 0.012 * t
    v[:, 1] *= 0.050 + 0.012 * t
    cuff.vertices = v
    cuff.apply_translation([0, 0, 0.245])
    cuff.visual = trimesh.visual.TextureVisuals(material=SLEEVE)

    return skin, cuff


skin_r, cuff_r = arm()

# left arm: mirror across X, then flip winding so the normals stay outward
skin_l, cuff_l = arm()
for m in (skin_l, cuff_l):
    m.apply_scale([-1, 1, 1])
    m.invert()

scene = trimesh.Scene()
for name, mesh in (('arm_r_skin', skin_r), ('arm_r_sleeve', cuff_r),
                   ('arm_l_skin', skin_l), ('arm_l_sleeve', cuff_l)):
    scene.add_geometry(mesh, node_name=name, geom_name=name)

glb = scene.export(file_type='glb')
open('/tmp/g/hands.glb', 'wb').write(glb)
tris = sum(len(g.faces) for g in scene.geometry.values())
print(f'hands.glb  {len(glb)/1024:.1f} KB  ·  {tris:,} triangles  ·  '
      f'{len(scene.geometry)} meshes  ·  extents {np.round(scene.extents, 3)}')
