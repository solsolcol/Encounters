/* v26.1 · HOW MANY TEXELS A METRE a body's paint has, over its head and over the whole body (bind pose), so each level's
   sheet can be sized for the distance it is drawn at: a face drawn with far more texels than pixels, with no mipmaps
   (v5.11: a generated sheet is drawn without them), sparkles; with far fewer, it smears.
     node tools/probes/texdensity.mjs <file.glb> [...]        (the colour sheet's size is read from the file) */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
for (const f of process.argv.slice(2)) {
  const doc = await io.read(f), root = doc.getRoot();
  const skin = root.listSkins()[0]; const joints = skin ? skin.listJoints() : [];
  const headJ = new Set(joints.map((j, i) => /Head/i.test(j.getName()) ? i : -1).filter(i => i >= 0));
  let out = [];
  for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) {
    const mat = p.getMaterial(), tex = mat && mat.getBaseColorTexture(); if (!tex) continue;
    const md = await sharp(Buffer.from(tex.getImage())).metadata(), W = md.width, H = md.height;
    const pos = p.getAttribute('POSITION'), uv = p.getAttribute('TEXCOORD_0'), J = p.getAttribute('JOINTS_0'), Wt = p.getAttribute('WEIGHTS_0'), ix = p.getIndices();
    const n = ix ? ix.getCount() : pos.getCount(), a = [], b = [], c = [], ua = [], ub = [], uc = [], j4 = [], w4 = [];
    const isHead = (v) => { if (!J) return false; J.getElement(v, j4); Wt.getElement(v, w4); let h = 0; for (let k = 0; k < 4; k++) if (headJ.has(j4[k])) h += w4[k]; return h > 0.5; };
    const S = { all: [0, 0], head: [0, 0] };
    for (let t = 0; t < n; t += 3) {
      const i0 = ix ? ix.getScalar(t) : t, i1 = ix ? ix.getScalar(t + 1) : t + 1, i2 = ix ? ix.getScalar(t + 2) : t + 2;
      pos.getElement(i0, a); pos.getElement(i1, b); pos.getElement(i2, c); uv.getElement(i0, ua); uv.getElement(i1, ub); uv.getElement(i2, uc);
      const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      const cr = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]], wa = 0.5 * Math.hypot(...cr);
      const ta = 0.5 * Math.abs((ub[0] - ua[0]) * (uc[1] - ua[1]) - (uc[0] - ua[0]) * (ub[1] - ua[1])) * W * H;
      S.all[0] += wa; S.all[1] += ta; if (isHead(i0) && isHead(i1) && isHead(i2)) { S.head[0] += wa; S.head[1] += ta; }
    }
    out.push(`${W}px sheet: whole body ${Math.sqrt(S.all[1] / S.all[0]).toFixed(0)} texels/m over ${(S.all[0]).toFixed(2)} m2; head ${S.head[0] ? Math.sqrt(S.head[1] / S.head[0]).toFixed(0) : '-'} texels/m over ${(S.head[0] * 1e4).toFixed(0)} cm2 (${(100 * S.head[1] / (W * H)).toFixed(1)} % of the sheet)`);
  }
  console.log(f.split('/').pop() + ': ' + out.join(' ; '));
}
