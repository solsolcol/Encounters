/* v15.2: THE SKELETON MERGE, PROVEN. For each model: parse its bytes twice,
   merge one parse (unifySkeletons), pose both with their own mixers at four
   times, and compare — the parse, a clone of it (SkeletonUtils for the
   unmerged, cloneSkinned for the merged: chapter 3's pose clones) and
   'detached' copies of the clone's meshes (chapter 3's sitters) — every
   skinned vertex on the CPU, bit for bit, and a rendered frame on the game's
   own renderer at four turns, with the file's materials and with normals as
   colour. PASS needs: zero differing vertices, zero differing pixels, and
   every frame to have DRAWN something (a blank frame equals anything).
   Usage: node tools/probes/skelproof.mjs [key[:clipsKey]…]   (defaults below) */
import { chromium } from 'playwright';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const KEYS = process.argv.slice(2).length ? process.argv.slice(2)
  : ['ghost', 'sitclap', 'sitangry', 'sitman', 'sitwoman', 'sitshout', 'encik', 'standman', 'tangki:tangkianim',
     'granny', 'scold', 'mother:motheranim', 'hands', 'young', 'admintee', 'fbosling', 'encik2'];
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 640, height: 400 } });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push(e.message.split('\n')[0]));
await p.goto(PAGE + '?ch=ch3', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!(window.__enc && window.__enc.skelLab), null, { timeout: 120000 });
let bad = 0;
for (const key of KEYS) {
  const [k, anim] = key.split(':');
  const r = await p.evaluate(([k, anim]) => window.__enc.skelLab(k, anim ? { anim } : {}).catch(e => ({ key: k, error: String(e) })), [k, anim]);
  if (r.error) { console.log(`${key}: ERROR ${r.error}`); bad++; continue; }
  if (!r.cpu.some(x => x.verts > 0)) { console.log(`n/a  ${key}: no skinned mesh`); continue; }
  const cpuDiff = r.cpu.reduce((s, x) => s + x.diff, 0), verts = r.cpu.reduce((s, x) => s + x.verts, 0);
  const gpuDiff = r.gpu.reduce((s, x) => s + x.diff, 0), frames = r.gpu.length;
  const blank = r.gpu.filter(x => x.lit < 50).length;
  const minLit = Math.min(...r.gpu.map(x => x.lit));
  const ok = cpuDiff === 0 && gpuDiff === 0 && blank === 0 && verts > 0 && frames > 0;
  if (!ok) bad++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${key}: merged ${JSON.stringify(r.merged)}; skeletons ${JSON.stringify(r.skeletons)} rows ${JSON.stringify(r.rows)}; clip ${r.clip}\n` +
              `     cpu: ${verts} vertex reads, ${cpuDiff} differ; gpu: ${frames} frame pairs, ${gpuDiff} pixels differ, ` +
              `fewest pixels drawn in a frame ${minLit}${blank ? `, ${blank} BLANK frames` : ''}`);
}
if (errs.length) { console.log('page errors: ' + errs.slice(0, 5).join(' | ')); bad++; }
await b.close();
console.log(bad ? `FAILED: ${bad}` : 'ALL PASS');
process.exit(bad ? 1 : 0);
