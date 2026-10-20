/* v21.8 · a LIGHTER COPY of a scan for where it is seen from across a room.
   OFFLINE. Each primitive's triangles are cut to a share of themselves by the
   regular simplifier in its PERMISSIVE mode (it may collapse across a UV seam
   where the two sides' coordinates are close — a scan's atlas of a thousand
   islands floors the strict simplifier at about a fifth, and the sloppy cut
   smears each island's colour into its neighbours': both photographed, the
   shop's display shelf), then the vertices no triangle uses are dropped. A
   skinned mesh keeps its skin: the kept vertices carry their joints and
   weights through, so the copy plays every take of the original.
     node tools/permcut.mjs in.glb out.glb ratio      (ERR, UVW as lodpair; NW weighs
                                                        the normals too; STRICT=1 keeps seams)
   NOTEX=1 writes the geometry alone — its materials keep their factors and
   lose their maps, for a far level that wears the near level's own material
   at run time (the maps are downloaded and uploaded once).               */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, meshopt, dequantize, compactPrimitive } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const [IN, OUT, R] = process.argv.slice(2);
const RATIO = +(R || 0.25), ERR = +(process.env.ERR || 0.02), W = +(process.env.UVW || 1);
const d = await io.read(IN);
await d.transform(dequantize());
let t0 = 0, t1 = 0;
for (const m of d.getRoot().listMeshes()) for (const p of m.listPrimitives()) {
  const pos = p.getAttribute('POSITION'), idx = p.getIndices();
  if (!idx) continue;
  const I = new Uint32Array(idx.getArray()), n = pos.getCount(), P = new Float32Array(n * 3), v = [0, 0, 0];
  for (let i = 0; i < n; i++) { pos.getElement(i, v); P.set(v, 3 * i); }
  /* the attributes the error is measured in: the UV (UVW) and, with NW, the NORMAL — on a flat board a collapse
     that drags an amulet rim's sideways normal across the velvet draws a dark crease (photographed: Chad's tray) */
  const NW = +(process.env.NW || 0), nor = p.getAttribute('NORMAL'), K = NW && nor ? 5 : 2;
  const uv = p.getAttribute('TEXCOORD_0'), A = new Float32Array(n * K), w = [0, 0], nn = [0, 0, 0];
  for (let i = 0; i < n; i++) {
    if (uv) { uv.getElement(i, w); A[K * i] = w[0]; A[K * i + 1] = w[1]; }
    if (K === 5) { nor.getElement(i, nn); A[K * i + 2] = nn[0]; A[K * i + 3] = nn[1]; A[K * i + 4] = nn[2]; }
  }
  const target = Math.max(3, Math.floor(I.length / 3 * RATIO) * 3);
  const weights = [uv ? W : 0, uv ? W : 0, ...(K === 5 ? [NW, NW, NW] : [])];
  const [cut] = MeshoptSimplifier.simplifyWithAttributes(I, P, 3, A, K, weights, null, target, ERR,
                                                         process.env.STRICT ? [] : ['Permissive']);
  idx.setArray(new Uint32Array(cut));
  compactPrimitive(p);
  t0 += I.length / 3; t1 += cut.length / 3;
}
if (process.env.NOTEX) for (const m of d.getRoot().listMaterials())
  m.setBaseColorTexture(null).setNormalTexture(null).setMetallicRoughnessTexture(null).setOcclusionTexture(null).setEmissiveTexture(null);
/* (NOTEX keeps the UVs: prune() drops a vertex attribute no texture reads, and a far level that wears the near
   level's maps with no UVs of its own samples ONE texel across the whole mesh — v21.8's altar row, all gold) */
await d.transform(prune({ keepAttributes: !!process.env.NOTEX }), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, d);
console.log(`permcut ${OUT.split('/').pop()}: tris ${t0} -> ${t1}`);
