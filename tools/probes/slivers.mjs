// v24.5 (tools/probes/slivers.mjs): a STRAY VERTEX — every visible skinned mesh's triangles skinned on the CPU as the GPU skins them, and any
// triangle with an edge longer than LONG metres reported with its mesh, its owner and its vertices' bones and weights
// ENC_DIST=<snapshot> CHROMIUM_PATH=... [CH=e4c1] [PHASE=work:~fri] [LONG=0.45] node tools/probes/slivers.mjs
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const CH = process.env.CH || 'e4c1', PHASE = process.env.PHASE || 'work:~fri', LONG = +(process.env.LONG || 0.45);
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
await p.goto(PAGE + '?ch=' + CH, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForTimeout(8000);
await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), PHASE);
await p.waitForFunction((ph) => window.__enc.stage.phase === ph.split(/[:~]/)[0], PHASE, { timeout: 600000, polling: 500 });
await p.waitForTimeout(12000);
const r = await p.evaluate((LONG) => {
  const E = window.__enc, S = E.stage, scene = E.scene, V = E.yaw.position.constructor;
  const shown = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
  /* each skinned mesh's owner: the cast member whose group holds it */
  const owner = (m) => { for (const [k, P] of Object.entries(S.cast || {})) { if (!P || !P.group) continue; let q = m; while (q) { if (q === P.group) return k; q = q.parent; } } return '?'; };
  const out = [];
  scene.traverse(m => {
    if (!m.isSkinnedMesh || !shown(m)) return;
    m.skeleton.update(); m.updateMatrixWorld(true);
    const g = m.geometry, n = g.attributes.position.count, idx = g.index ? g.index.array : null, tri = idx ? idx.length / 3 : n / 3;
    const P0 = new Array(n); const v = new V();
    for (let i = 0; i < n; i++) { m.getVertexPosition(i, v); v.applyMatrix4(m.matrixWorld); P0[i] = [v.x, v.y, v.z]; }
    const d = (a, b2) => Math.hypot(P0[a][0] - P0[b2][0], P0[a][1] - P0[b2][1], P0[a][2] - P0[b2][2]);
    const bad = [];
    for (let t = 0; t < tri; t++) {
      const a = idx ? idx[3 * t] : 3 * t, b2 = idx ? idx[3 * t + 1] : 3 * t + 1, c = idx ? idx[3 * t + 2] : 3 * t + 2;
      const e = Math.max(d(a, b2), d(b2, c), d(c, a));
      if (e > LONG) bad.push([t, +e.toFixed(2), a, b2, c]);
    }
    if (!bad.length) return;
    bad.sort((x, y) => y[1] - x[1]);
    const si = g.attributes.skinIndex, sw = g.attributes.skinWeight, bones = m.skeleton.bones;
    const vinfo = (i) => ({ i, at: P0[i].map(x => +x.toFixed(2)), bones: [0, 1, 2, 3].map(k => (bones[si.getComponent(i, k)] || {}).name + ':' + sw.getComponent(i, k).toFixed(3)).filter(s => !/:0\.000$/.test(s)),
      wsum: +(sw.getX(i) + sw.getY(i) + sw.getZ(i) + sw.getW(i)).toFixed(3) });
    /* the stray vertex: the one of the worst triangle farthest from the mesh's median point */
    const xs = P0.map(q => q[0]).sort((a, b) => a - b), ys = P0.map(q => q[1]).sort((a, b) => a - b), zs = P0.map(q => q[2]).sort((a, b) => a - b), md = [xs[n >> 1], ys[n >> 1], zs[n >> 1]];
    const far = (i) => Math.hypot(P0[i][0] - md[0], P0[i][1] - md[1], P0[i][2] - md[2]);
    const strays = new Map(); for (const [, , a, b2, c] of bad) for (const i of [a, b2, c]) if (far(i) > 1.2) strays.set(i, (strays.get(i) || 0) + 1);
    out.push({ mesh: m.name || m.type, owner: owner(m), verts: n, tris: tri, long: bad.length, worst: bad.slice(0, 3).map(([t, e, a, b2, c]) => ({ t, e, v: [vinfo(a), vinfo(b2), vinfo(c)] })),
      median: md.map(x => +x.toFixed(2)), strays: [...strays.entries()].slice(0, 6).map(([i, k]) => ({ k, far: +far(i).toFixed(2), ...vinfo(i) })) });
  });
  return out;
}, LONG);
console.log(JSON.stringify(r, null, 1));
console.log('mends', JSON.stringify(await p.evaluate(() => window.__enc.stage.mends || null)));
console.log('errs', JSON.stringify(errs));
await b.close();
