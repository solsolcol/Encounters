/* v26.1 · WHAT A CHAPTER'S PICTURES COST A PHONE'S MEMORY: every asset the chapter declares, its sheets' sizes, and what
   each takes uploaded (width x height x 4 bytes, a third more with mipmaps; a sheet the chapter draws without them,
   counted without). Made to size the people's sheets against the phone (Chad, 12 Nov 2026: "even on the phone, i want a
   higher rendering budget"; "consider how it looks on a low res phone or 720p phone").
     node tools/probes/texmem.mjs <chapter key>      (reads build.py for each key's file) */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const KEY = process.argv[2] || 'e4c3', ep = KEY.match(/^e(\d+)c/);
const w = {}; globalThis.window = w; (0, eval)(fs.readFileSync(ep ? `src/chapters/e${ep[1]}/${KEY}.js` : `src/chapters/${KEY}.js`, 'utf8'));
const ch = w.__CHAPTERS__[KEY], py = fs.readFileSync('build.py', 'utf8');
const fileOf = (k) => { const m = py.match(new RegExp(`['"]${k}['"]\\s*:\\s*\\(?\\s*['"]([^'"]+)['"]`)); return m ? m[1] : null; };
let total = 0, rows = [], groups = {};
for (const k of ch.assets) {
  const f = fileOf(k); if (!f || !fs.existsSync(f)) { rows.push([k, 'NO FILE ' + f, 0]); continue; }
  let mb = 0, desc = [];
  if (/\.glb$/.test(f)) { const doc = await io.read(f);
    for (const t of doc.getRoot().listTextures()) { const md = await sharp(Buffer.from(t.getImage())).metadata();
      const mip = /^e4/.test(k) ? (t.getName() === 'repainted') : true, b = md.width * md.height * 4 * (mip ? 4 / 3 : 1) / 1048576; mb += b; desc.push(`${md.width}${mip ? '' : '(no mips)'}`); } }
  else { try { const md = await sharp(f).metadata(); mb = md.width * md.height * 4 * 4 / 3 / 1048576; desc.push(md.width + 'x' + md.height); } catch (e) { desc.push('not a picture'); } }
  total += mb; rows.push([k, desc.join(' '), mb]);
  const g = /^e4(ton|bench|hermita|hermitb|red|white|dancer[ab]|dev[a-h]|girl|boy|monk[bc])/.test(k) ? 'people' : /^pho/.test(k) || /^monk/.test(k) ? 'his models' : 'the ground and things';
  groups[g] = (groups[g] || 0) + mb;
}
for (const [k, d, mb] of rows.sort((a, b) => b[2] - a[2]).slice(0, 25)) console.log(k.padEnd(14), d.padEnd(22), mb.toFixed(1), 'MB');
console.log('...'); for (const [g, mb] of Object.entries(groups)) console.log(g.padEnd(24), mb.toFixed(0), 'MB');
console.log('TOTAL', total.toFixed(0), 'MB of pictures uploaded');
