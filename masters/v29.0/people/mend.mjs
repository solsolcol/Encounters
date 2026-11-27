/* v29.0 · THE FREE MENDS of Grace and Marcus (people/RECORD.md §7; no credit spent, nothing generated again).
   The GEOMETRY half: a generated body's loose hair strands came back as shredded ribbons standing off the hair (Grace:
   the temples, the crown, the nape, round the bun). They are taken out BEFORE the prep, so the paint is laid out again
   (prepmonk REPAINT) over what is left only. The PAINT half is tools/edgeclean.py inside the prep (people/edgeclean-
   <name>.json), and the hair's finish is people/people.sh's MATTE step (this file's `matte`).

     node masters/v29.0/people/mend.mjs cut   <in.glb> <out.glb> <spec.json>   the strands taken out
     node masters/v29.0/people/mend.mjs mark  <in.glb> <out.glb> <spec.json>   the same triangles drawn RED, nothing taken
                                                                                out (a probe's copy: proves the selection)
     node masters/v29.0/people/mend.mjs matte <in.glb> <out.glb> <spec.json>   the hair's texels given a rough finish:
                                                                                a roughness sheet beside the colour (G = 1
                                                                                where the hair is, the body's 0.78 elsewhere)

   What a strand IS (people/strands.py has the measure): the body round the head is filled as a solid at VOX, the solid is
   OPENED by a ball (a sheet standing off the hair has no thickness, so the opening takes it away; the hair's mass, the bun
   and the head stay), and a triangle further than `off` from the opened solid, of the hair's colour (the spec's Lab rule)
   or in a `strand` box, inside the spec's head box and outside every `keep` box (the ears), is a strand's. What is left
   joined to nothing by `orphan` triangles or fewer is taken with it (the far end of a ribbon whose middle was cut). Never
   by height or by centroid alone: by what each triangle is, its place against the hair's own shell.
   The body's place (as tools/edgeclean.py reads it): bind pose, feet on y = 0, its middle on x = z = 0, height the spec's H. */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import { meshopt, prune } from '@gltf-transform/functions';
import sharp from 'sharp';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const [MODE, IN, OUT, SPECF] = process.argv.slice(2);
if (!['cut', 'mark', 'matte', 'debug'].includes(MODE) || !IN || !OUT || !SPECF) { console.error('mend.mjs cut|mark|matte <in.glb> <out.glb> <spec.json>'); process.exit(2); }
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const SPEC = JSON.parse(fs.readFileSync(SPECF, 'utf8'));
const doc = await io.read(IN), root = doc.getRoot();
const prims = root.listMeshes().flatMap(m => m.listPrimitives()).filter(p => p.getAttribute('JOINTS_0'));
if (prims.length !== 1) throw new Error(`mend: one skinned part expected, found ${prims.length}`);
const p0 = prims[0], mat0 = p0.getMaterial(), base = mat0.getBaseColorTexture();
const POS = p0.getAttribute('POSITION'), UVA = p0.getAttribute('TEXCOORD_0'), n = POS.getCount();
const I = Uint32Array.from(p0.getIndices().getArray()), m = I.length / 3, e = [];
const P = new Float64Array(n * 3), U = new Float32Array(n * 2);
for (let i = 0; i < n; i++) { POS.getElement(i, e); P[3 * i] = e[0]; P[3 * i + 1] = e[1]; P[3 * i + 2] = e[2]; UVA.getElement(i, e); U[2 * i] = e[0]; U[2 * i + 1] = e[1]; }
/* the body in metres, as edgeclean.py places it */
const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], P[3 * i + k]); hi[k] = Math.max(hi[k], P[3 * i + k]); }
const H = Number(SPEC.H || 1.6), s = H / (hi[1] - lo[1]);
const Wp = new Float32Array(n * 3);
for (let i = 0; i < n; i++) { Wp[3 * i] = (P[3 * i] - (lo[0] + hi[0]) / 2) * s; Wp[3 * i + 1] = (P[3 * i + 1] - lo[1]) * s; Wp[3 * i + 2] = (P[3 * i + 2] - (lo[2] + hi[2]) / 2) * s; }
/* each triangle's colour: the sheet read at its middle and at its three corners pulled a third of the way in (the four averaged) */
const { data: px, info } = await sharp(Buffer.from(base.getImage()), { limitInputPixels: false }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const TW = info.width, TH = info.height, at = (u, v) => { const x = Math.min(TW - 1, Math.max(0, Math.floor(u * TW))), y = Math.min(TH - 1, Math.max(0, Math.floor(v * TH))); return (y * TW + x) * 3; };
const col = new Uint8Array(m * 3);
for (let t = 0; t < m; t++) { const a = I[3 * t], b = I[3 * t + 1], c = I[3 * t + 2]; const cu = (U[2 * a] + U[2 * b] + U[2 * c]) / 3, cv = (U[2 * a + 1] + U[2 * b + 1] + U[2 * c + 1]) / 3;
  let r = 0, g = 0, bb = 0; for (const [u, v] of [[cu, cv], [(2 * U[2 * a] + cu) / 3, (2 * U[2 * a + 1] + cv) / 3], [(2 * U[2 * b] + cu) / 3, (2 * U[2 * b + 1] + cv) / 3], [(2 * U[2 * c] + cu) / 3, (2 * U[2 * c + 1] + cv) / 3]]) {
    const q = at(u, v); r += px[q]; g += px[q + 1]; bb += px[q + 2]; }
  col[3 * t] = r / 4; col[3 * t + 1] = g / 4; col[3 * t + 2] = bb / 4; }
const dir = fs.mkdtempSync((process.env.TMPDIR || '/tmp') + '/mend-');
const bin = (f, a) => fs.writeFileSync(`${dir}/${f}`, Buffer.from(a.buffer, a.byteOffset, a.byteLength));
bin('pos.f32', Wp); bin('idx.u32', I); bin('col.u8', col);
const PY = process.env.PY3 || 'python3';
const r = spawnSync(PY, ['-I', new URL('./strands.py', import.meta.url).pathname, dir, SPECF, MODE === 'matte' ? 'hair' : MODE === 'debug' ? 'debug' : 'strands'], { stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 26 });
for (const l of String(r.stdout || '').split('\n').filter(Boolean)) console.log('  ' + l);
if (r.status !== 0) { console.error(String(r.stderr || '').slice(-3000)); throw new Error('mend: strands.py failed'); }
const sel = new Uint8Array(fs.readFileSync(`${dir}/sel.u8`));
fs.rmSync(dir, { recursive: true, force: true });
let k = 0; for (let t = 0; t < m; t++) if (sel[t]) k++;
const Ctor = n > 65535 ? Uint32Array : Uint16Array;
if (MODE === 'cut') {
  const keep = new Ctor(I.length - 3 * k); let w = 0;
  for (let t = 0; t < m; t++) if (!sel[t]) { keep[w++] = I[3 * t]; keep[w++] = I[3 * t + 1]; keep[w++] = I[3 * t + 2]; }
  p0.getIndices().setArray(keep);
  console.log(`mend cut: ${k} of ${m} triangles taken out (${m - k} left)`);
} else if (MODE === 'debug') {
  /* (a probe's copy: the head box's triangles by their distance off the opened solid, 1 green under a millimetre, 2 yellow
     to two, 3 orange to four, 4 red past it, 5 blue past two but not of the hair's colour) */
  const rgb = [null, [0, 0.8, 0], [1, 0.9, 0], [1, 0.45, 0], [1, 0, 0], [0, 0.3, 1]], lists = rgb.map(() => []), rest = [];
  for (let t = 0; t < m; t++) (sel[t] ? lists[sel[t]] : rest).push(I[3 * t], I[3 * t + 1], I[3 * t + 2]);
  p0.getIndices().setArray(new Ctor(rest));
  const mesh = root.listMeshes().find(mm => mm.listPrimitives().includes(p0));
  for (let c = 1; c < rgb.length; c++) { if (!lists[c].length) continue;
    const mm = doc.createMaterial('d' + c).setBaseColorFactor([...rgb[c], 1]).setMetallicFactor(0).setRoughnessFactor(1).setDoubleSided(true).setEmissiveFactor(rgb[c].map(x => x * 0.5));
    const p2 = doc.createPrimitive().setMode(p0.getMode()).setMaterial(mm).setIndices(doc.createAccessor().setType('SCALAR').setArray(new Ctor(lists[c])).setBuffer(p0.getIndices().getBuffer()));
    for (const sem of p0.listSemantics()) p2.setAttribute(sem, p0.getAttribute(sem)); mesh.addPrimitive(p2); }
  console.log('mend debug: ' + lists.map((l, c) => c ? `${c}: ${l.length / 3}` : '').filter(Boolean).join(', '));
} else if (MODE === 'mark') {
  const rest = [], red = [];
  for (let t = 0; t < m; t++) (sel[t] ? red : rest).push(I[3 * t], I[3 * t + 1], I[3 * t + 2]);
  p0.getIndices().setArray(new Ctor(rest));
  const rm = doc.createMaterial('selected').setBaseColorFactor([1, 0, 0, 1]).setMetallicFactor(0).setRoughnessFactor(1).setDoubleSided(true).setEmissiveFactor([0.6, 0, 0]);
  const p2 = doc.createPrimitive().setMode(p0.getMode()).setMaterial(rm).setIndices(doc.createAccessor().setType('SCALAR').setArray(new Ctor(red)).setBuffer(p0.getIndices().getBuffer()));
  for (const sem of p0.listSemantics()) p2.setAttribute(sem, p0.getAttribute(sem));
  root.listMeshes().find(mm => mm.listPrimitives().includes(p0)).addPrimitive(p2);
  console.log(`mend mark: ${k} of ${m} triangles drawn red`);
} else {
  /* MATTE: the selected (hair) triangles' texels in a roughness sheet (G), the rest the body's own roughness; the material's
     factor 1, so the sheet is the roughness. The sheet is the colour sheet's size over SHRINK, grown a few texels past
     each hair chart's edge (a mipmap of the sheet then reads hair at hair). Metal 0 everywhere (B = 0). */
  const SH = Number(SPEC.matte?.shrink || 4), RP = Math.max(64, Math.round(TW / SH)), RH = Math.max(64, Math.round(TH / SH));
  const rough = Math.round(255 * Number(SPEC.matte?.rough ?? 1)), restR = Math.round(255 * (mat0.getRoughnessFactor() ?? 1));
  const G = new Uint8Array(RP * RH).fill(restR), hairM = new Uint8Array(RP * RH);
  for (let t = 0; t < m; t++) { if (!sel[t]) continue;
    const c3 = [0, 1, 2].map(q => [U[2 * I[3 * t + q]] * RP, U[2 * I[3 * t + q] + 1] * RH]);
    const x0 = Math.max(0, Math.floor(Math.min(c3[0][0], c3[1][0], c3[2][0]) - 1)), x1 = Math.min(RP - 1, Math.ceil(Math.max(c3[0][0], c3[1][0], c3[2][0]) + 1));
    const y0 = Math.max(0, Math.floor(Math.min(c3[0][1], c3[1][1], c3[2][1]) - 1)), y1 = Math.min(RH - 1, Math.ceil(Math.max(c3[0][1], c3[1][1], c3[2][1]) + 1));
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) hairM[y * RP + x] = 1; }   // (each hair triangle's box of texels, a texel round: the charts' margin)
  let nh = 0; for (let q = 0; q < G.length; q++) if (hairM[q]) { G[q] = rough; nh++; }
  const rgb = Buffer.alloc(RP * RH * 3); for (let q = 0; q < G.length; q++) { rgb[3 * q] = 255; rgb[3 * q + 1] = G[q]; rgb[3 * q + 2] = 0; }
  const png = await sharp(rgb, { raw: { width: RP, height: RH, channels: 3 } }).png().toBuffer();
  const rt = doc.createTexture('roughness').setImage(png).setMimeType('image/png');
  mat0.setMetallicRoughnessTexture(rt).setRoughnessFactor(1).setMetallicFactor(0);
  const ti = mat0.getMetallicRoughnessTextureInfo(), bi = mat0.getBaseColorTextureInfo();
  if (ti && bi) ti.setMinFilter(bi.getMinFilter()).setMagFilter(bi.getMagFilter()).setWrapS(bi.getWrapS()).setWrapT(bi.getWrapT());
  console.log(`mend matte: ${k} hair triangles of ${m}; a ${RP} x ${RH} roughness sheet, ${nh} texels at ${rough / 255} (the rest ${restR / 255})`);
}
if (/meshopt/.test(JSON.stringify(root.listExtensionsUsed().map(x => x.extensionName)))) await doc.transform(prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, doc);
