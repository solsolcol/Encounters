/* v28.0 (E4C5, R80/R81): THE HIGHEST A HEAD REACHES. Chad, 24 Nov 2026: the arrow over the played one "almost right above
   the head", "But give some little space buffer so that any poses that moves the character head wont clip into the arrow".
   For each body named (KEYS, the game's own model keys), in the game's own page and runtime: every take in its file played
   alone, sampled N times over its whole length, and the skin skinned on the CPU as the GPU draws it (three's
   SkinnedMesh.getVertexPosition) for every vertex the head bone carries most of: the highest of them over the body's feet
   (its group's place) is the head's top in that moment. Prints, per body, every take's highest and the moment, and the
   highest of all; a take name a body has no copy of is said, never skipped in silence.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [KEYS=p5pho,p5zavier] [N=48] node tools/probes/headtop.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const KEYS = (process.env.KEYS || 'p5pho,p5zavier').split(',').filter(Boolean), N = +(process.env.N || 48);
const DIST = process.env.ENC_DIST || 'dist', CHF = fs.readdirSync(DIST + '/assets').find(f => /^e4c5\.[0-9a-f]+\.js$/.test(f));
let CHSRC = fs.readFileSync(DIST + '/assets/' + CHF, 'utf8');
const HOOKED = /people: \(\) => people/.test(CHSRC);
if (!HOOKED) CHSRC = CHSRC.replace(/(PRAI5, STICK5)(\s*\};)/, '$1, people: () => people, crowd: () => crowd$2');
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 800, height: 600 } });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
if (!HOOKED) await p.route('**/assets/' + CHF, r => r.fulfill({ status: 200, contentType: 'application/javascript', body: CHSRC }));
await p.goto(PAGE + '?ch=e4c5&mute=1');
await p.waitForFunction(() => window.__enc && window.__enc.stage && window.__enc.stage.films && window.__enc.stage.films.people, null, { timeout: 600000, polling: 500 });
log('chapter up', CHF, HOOKED ? '(its own handle)' : '(handle laid in)');
/* every body named loaded (the fight's two are made with the chapter: wait for each one's file) */
await p.waitForFunction((keys) => { const L = window.__enc.stage.films.people(); return keys.every(k => L.some(P => P.key === k && P.ready)); }, KEYS, { timeout: 900000, polling: 1000 });
log('bodies ready', KEYS.join(','));
const out = await p.evaluate(({ keys, N }) => {
  const L = window.__enc.stage.films.people(), res = {};
  for (const key of keys) {
    const P = L.find(q => q.key === key && q.ready); if (!P) { res[key] = { err: 'no body' }; continue; }
    const meshes = []; P.group.traverse(o => { if (o.isSkinnedMesh) meshes.push(o); });
    /* the head bone of EACH skin ('Head' in any case, with or without the rig's prefix, never its end site): a body made of
       parts may bind each to its own copy of the bones (Grandmaster Pho's face and hair are a part of their own) */
    const headOf = (m) => m.skeleton.bones.findIndex(bn => /(^|:)head$/i.test(bn.name.replace(/^mixamorig/i, '')));
    const hm = meshes.find(m => headOf(m) >= 0), head = hm ? hm.skeleton.bones[headOf(hm)] : null;
    if (!head) { res[key] = { err: 'no head bone' }; continue; }
    /* the head's own points in each skin bound to a head: the points the head bone carries most of, and where a skin's
       weights are shared out so that none is the head's by half (Grandmaster Pho's face and hair), the points that stand
       round the head bone as the body stands now: within 0.24 m of it and no lower than 0.12 m under it */
    const sets = [], Q = new (P.group.position.constructor)(), H = new (P.group.position.constructor)();
    P.group.updateMatrixWorld(true);
    for (const m of meshes) {
      const bi = headOf(m); if (bi < 0) continue;
      const si = m.geometry.attributes.skinIndex, sw = m.geometry.attributes.skinWeight, idx = [];
      for (let i = 0; i < si.count; i++) { let w = 0; for (let c = 0; c < 4; c++) if (si.getComponent(i, c) === bi) w += sw.getComponent(i, c); if (w >= 0.5) idx.push(i); }
      if (!idx.length) { m.skeleton.bones[bi].getWorldPosition(H);
        for (let i = 0; i < si.count; i += 2) { m.getVertexPosition(i, Q); Q.applyMatrix4(m.matrixWorld); if (Q.distanceTo(H) <= 0.24 && Q.y >= H.y - 0.12) idx.push(i); } }
      if (idx.length) sets.push([m, idx]);
    }
    const acts = P.acts || {}, names = Object.keys(acts), V = new (P.group.position.constructor)();
    const keep = {}; for (const k of names) keep[k] = [acts[k].time, acts[k].getEffectiveWeight(), acts[k].enabled, acts[k].paused];
    const rows = [];
    for (const name of names) {
      const A = acts[name], d = A.getClip().duration;
      for (const k of names) { acts[k].enabled = true; acts[k].setEffectiveWeight(k === name ? 1 : 0); }
      let best = -1e9, at = 0;
      for (let s = 0; s <= N; s++) {
        A.time = Math.min(d - 1e-4, d * s / N); P.mixer.update(0); P.group.updateMatrixWorld(true);
        for (const [m, idx] of sets) { m.skeleton.update();
          for (let j = 0; j < idx.length; j += 2) { m.getVertexPosition(idx[j], V); V.applyMatrix4(m.matrixWorld); const y = V.y - P.group.position.y; if (y > best) { best = y; at = A.time; } } }
      }
      rows.push([name, +best.toFixed(3), +at.toFixed(2), +d.toFixed(2)]);
    }
    for (const k of names) { acts[k].time = keep[k][0]; acts[k].setEffectiveWeight(keep[k][1]); acts[k].enabled = keep[k][2]; acts[k].paused = keep[k][3]; }
    P.mixer.update(0);
    rows.sort((a, b2) => b2[1] - a[1]);
    res[key] = { head: head.name, verts: sets.reduce((n, s) => n + s[1].length, 0), scale: +P.group.scale.y.toFixed(3), rows };
  }
  return res;
}, { keys: KEYS, N });
for (const k of KEYS) {
  const r = out[k]; if (!r || r.err) { log(k, 'ERROR', r && r.err); continue; }
  log(k, 'head bone', r.head, 'head vertices', r.verts, 'group scale', r.scale);
  for (const row of r.rows) log('  ', row[0].padEnd(28), 'top', row[1].toFixed(3), 'm at', row[2] + 's of', row[3] + 's');
  log(k, 'HIGHEST', r.rows[0][1].toFixed(3), 'm (' + r.rows[0][0] + ')');
}
if (errs.length) { log('ERRORS', errs.length); errs.slice(0, 8).forEach(e => log(' ', e)); }
await b.close();
process.exit(errs.length ? 1 : 0);
