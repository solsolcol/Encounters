"""
Repair vrhands.glb.

The Fab export lost every bone's local transform: 34 joint nodes, all identity.
glTF skinning is  jointWorld · inverseBindMatrix,  so with jointWorld = I the
whole mesh gets multiplied by the inverse bind matrices alone and collapses in
on itself. The bind pose is still recoverable, because inverse(IBM) *is* the
joint's world matrix in the bind pose — so we can rebuild each node's local
transform as  inverse(parentWorld) · ownWorld  and write it back.
"""
import json, struct, pathlib, numpy as np

import sys
HERE = pathlib.Path(__file__).resolve().parent
SRC = sys.argv[1] if len(sys.argv) > 1 else str(HERE / 'vrhands.glb')
DST = sys.argv[2] if len(sys.argv) > 2 else str(HERE / 'vrhands_fixed.glb')

raw = open(SRC, 'rb').read()
jlen, = struct.unpack('<I', raw[12:16])
gltf = json.loads(raw[20:20 + jlen])
boff = 20 + jlen
blen, _ = struct.unpack('<II', raw[boff:boff + 8])
BIN = bytearray(raw[boff + 8: boff + 8 + blen])

nodes, skin = gltf['nodes'], gltf['skins'][0]


def accessor(i):
    a = gltf['accessors'][i]
    bv = gltf['bufferViews'][a['bufferView']]
    n = {'SCALAR': 1, 'VEC3': 3, 'VEC4': 4, 'MAT4': 16}[a['type']]
    off = bv.get('byteOffset', 0) + a.get('byteOffset', 0)
    return np.frombuffer(BIN, dtype='<f4', count=a['count'] * n, offset=off).reshape(a['count'], n)


# glTF stores matrices column-major; numpy wants row-major
ibm = accessor(skin['inverseBindMatrices']).reshape(-1, 4, 4).transpose(0, 2, 1).astype(np.float64)
joints = skin['joints']
W = {n: np.linalg.inv(ibm[k]) for k, n in enumerate(joints)}   # node index -> bind world

parent = {}
for i, nd in enumerate(nodes):
    for c in nd.get('children', []):
        parent[c] = i


def nearest_joint_ancestor(n):
    p = parent.get(n)
    while p is not None:
        if p in W:
            return p
        p = parent.get(p)
    return None


# The armature carried a 0.01 unit scale and an axis flip that the rebuilt bind
# pose already accounts for — leaving them in would apply the correction twice.
neutralised = []
for i, nd in enumerate(nodes):
    if nd.get('name') in ('GLTF_SceneRootNode', 'Armature_46') and 'matrix' in nd:
        del nd['matrix']
        neutralised.append(nd['name'])

rebuilt = 0
for n in joints:
    anc = nearest_joint_ancestor(n)
    local = W[n] if anc is None else np.linalg.inv(W[anc]) @ W[n]
    nodes[n]['matrix'] = [float(v) for v in local.T.flatten()]   # back to column-major
    rebuilt += 1

def world(n):
    chain, cur = np.eye(4), n
    while cur is not None:
        m = nodes[cur].get('matrix')
        if m:
            chain = np.array(m, dtype=np.float64).reshape(4, 4).T @ chain
        cur = parent.get(cur)
    return chain

# proof: skinning is inverse(meshWorld) · jointWorld · inverseBind, and in the
# bind pose that product must be the identity for every joint
mesh_node = next(i for i, nd in enumerate(nodes) if 'skin' in nd)
inv_mesh = np.linalg.inv(world(mesh_node))
worst = max(np.abs(inv_mesh @ world(n) @ ibm[k] - np.eye(4)).max()
            for k, n in enumerate(joints))

print(f'rebuilt {rebuilt} joint transforms; neutralised {neutralised}')
print(f'bind-pose residual (should be ~0): {worst:.2e}')
assert worst < 1e-4, 'bind pose does not reconstruct'

# re-emit the container
js = json.dumps(gltf, separators=(',', ':')).encode()
js += b' ' * ((4 - len(js) % 4) % 4)
BIN += b'\x00' * ((4 - len(BIN) % 4) % 4)
out = (b'glTF' + struct.pack('<II', 2, 12 + 8 + len(js) + 8 + len(BIN))
       + struct.pack('<I', len(js)) + b'JSON' + js
       + struct.pack('<I', len(BIN)) + b'BIN\x00' + bytes(BIN))
open(DST, 'wb').write(out)
print(f'wrote {DST}  {len(out)/1024:.0f} KB')
