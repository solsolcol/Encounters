/* v27.0 · A BODY'S POSTURE, MEASURED (Chad, 18 Nov 2026, R42: "grandmaster pho has some animations and poses that look
   unnatural and overly hunched with shoulders tightened upwards"). jointscan holds each joint to its range; nothing read
   how far a body leans or how high it holds its shoulders. This poses one cast member in each take, at N moments across
   the window the chapter wears it in (or the whole take), as the mixer lays it (the chapter's own lays, which work after
   the mixer, are not applied: this is the take itself), and reads, in the world:
     LEAN    the trunk (hips to the base of the neck) from the vertical, forward of the body's facing positive, and aside
     CURVE   the bend between the lower back (hips to the first spine bone) and the upper (the last spine bone to the neck)
     HEAD    the neck to the head from the vertical, forward positive
     SHRUG   each collar bone's rise: the angle its line (collar to the top of the arm) makes over the plane square to the
             trunk, less the same in the bind pose (a shrug is positive), and the top of each arm's height over the neck's
             base along the trunk, less the bind's, in centimetres
   A relaxed adult stands with the trunk within about 5 degrees of the vertical and sits upright within about 10, and holds
   the shoulders where they rest (a shrug of 0): the numbers to hold a take to.
     LOOK    where the face points: below the horizontal positive (its forward found from the bind pose, where the face
             points the body's way: v6.8, never the head bone's own +z)
     CHROMIUM_PATH=... [ENC_DIST=snap] [CH=e4c4] [WHO=pho] [N=8] [TAKES='{"Sit_to_Stand_Transition_M":[0.02,0.3]}']
       [LIVE='bless:r,m,f,o,a,k,p,v,l1,l2,l3,w'] [SPAN=6] [OUT=file.json] node tools/probes/posture.mjs
   LIVE: no take is posed; the phase is applied and the body read N times over SPAN seconds as the game draws it (every
   lay of the chapter's on it: the head's damping, the shoulders, the bow, the hands).
   Prints a table and writes the samples. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const CH = process.env.CH || 'e4c4', WHO = process.env.WHO || 'pho', N = +(process.env.N || 8), OUT = process.env.OUT || '/tmp/posture.json';
const TAKES = process.env.TAKES ? JSON.parse(process.env.TAKES) : null, LIVE = process.env.LIVE || '', SPAN = +(process.env.SPAN || 6);
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message.split('\n')[0]));
await p.goto(PAGE + '?ch=' + CH, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction((who) => { const P = window.__enc.stage.dbg.cast[who]; return P && P.ready; }, WHO, { timeout: 600000, polling: 500 });
if (LIVE) { await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), LIVE); await p.waitForTimeout(6000); }
const res = await p.evaluate(async ({ WHO, N, TAKES, LIVE, SPAN }) => {
  const P = window.__enc.stage.dbg.cast[WHO];
  const find = (re) => { for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
  const B = { hips: find(/Hips$/), sp0: find(/Spine$/), sp1: find(/Spine1$/), sp2: find(/Spine2$/), neck: find(/Neck$/), head: find(/Head$/),
    lc: find(/LeftShoulder$/), la: find(/LeftArm$/), rc: find(/RightShoulder$/), ra: find(/RightArm$/) };
  const missing = Object.keys(B).filter(k => !B[k]); if (missing.length) return { err: 'no bone ' + missing.join(' ') };
  const pos = (o) => { const e = o.matrixWorld.elements; return [e[12], e[13], e[14]]; };
  const sub = (a, c) => [a[0] - c[0], a[1] - c[1], a[2] - c[2]], dot = (a, c) => a[0] * c[0] + a[1] * c[1] + a[2] * c[2];
  const len = (a) => Math.hypot(a[0], a[1], a[2]), nrm = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const deg = (r) => r * 180 / Math.PI;
  const ry = P.group.rotation.y, f = [Math.sin(ry), 0, Math.cos(ry)], sd = [Math.cos(ry), 0, -Math.sin(ry)];
  const qmul = (a, c) => [a[3] * c[0] + a[0] * c[3] + a[1] * c[2] - a[2] * c[1], a[3] * c[1] - a[0] * c[2] + a[1] * c[3] + a[2] * c[0], a[3] * c[2] + a[0] * c[1] - a[1] * c[0] + a[2] * c[3], a[3] * c[3] - a[0] * c[0] - a[1] * c[1] - a[2] * c[2]];
  const qrot = (q, v) => { const u = [q[0], q[1], q[2]], s = q[3], uv = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]], uuv = [u[1] * uv[2] - u[2] * uv[1], u[2] * uv[0] - u[0] * uv[2], u[0] * uv[1] - u[1] * uv[0]];
    return [v[0] + 2 * (s * uv[0] + uuv[0]), v[1] + 2 * (s * uv[1] + uuv[1]), v[2] + 2 * (s * uv[2] + uuv[2])]; };
  const wq = (o) => { const e = o.matrixWorld.elements, sx = Math.hypot(e[0], e[1], e[2]), sy = Math.hypot(e[4], e[5], e[6]), sz = Math.hypot(e[8], e[9], e[10]);
    const m = [e[0] / sx, e[1] / sx, e[2] / sx, e[4] / sy, e[5] / sy, e[6] / sy, e[8] / sz, e[9] / sz, e[10] / sz], tr = m[0] + m[4] + m[8];
    let x, y, z, w; if (tr > 0) { const S = Math.sqrt(tr + 1) * 2; w = 0.25 * S; x = (m[5] - m[7]) / S; y = (m[6] - m[2]) / S; z = (m[1] - m[3]) / S; }
    else if (m[0] > m[4] && m[0] > m[8]) { const S = Math.sqrt(1 + m[0] - m[4] - m[8]) * 2; w = (m[5] - m[7]) / S; x = 0.25 * S; y = (m[3] + m[1]) / S; z = (m[6] + m[2]) / S; }
    else if (m[4] > m[8]) { const S = Math.sqrt(1 + m[4] - m[0] - m[8]) * 2; w = (m[6] - m[2]) / S; x = (m[3] + m[1]) / S; y = 0.25 * S; z = (m[7] + m[5]) / S; }
    else { const S = Math.sqrt(1 + m[8] - m[0] - m[4]) * 2; w = (m[1] - m[3]) / S; x = (m[6] + m[2]) / S; y = (m[7] + m[5]) / S; z = 0.25 * S; }
    return [x, y, z, w]; };
  let faceL = null;
  function read() {
    P.group.updateWorldMatrix(true, true);
    const h = pos(B.hips), n = pos(B.neck), s1 = pos(B.sp1), s2 = pos(B.sp2), hd = pos(B.head);
    const tr = sub(n, h), trn = nrm(tr), lo = sub(s1, h), up = sub(n, s2), hv = sub(hd, n);
    const shr = (c, a) => { const v = nrm(sub(pos(a), pos(c))); return { el: deg(Math.asin(Math.max(-1, Math.min(1, dot(v, trn))))), ht: dot(sub(pos(a), n), trn) * 100 }; };
    const hq = wq(B.head); if (!faceL) { const inv = [-hq[0], -hq[1], -hq[2], hq[3]]; faceL = qrot(inv, f); }
    const fw = qrot(hq, faceL), look = deg(Math.atan2(-fw[1], Math.hypot(fw[0], fw[2])));
    return { look, lean: deg(Math.atan2(dot(tr, f), tr[1])), side: deg(Math.atan2(dot(tr, sd), tr[1])),
      curve: deg(Math.acos(Math.max(-1, Math.min(1, dot(nrm(lo), nrm(up)))))), head: deg(Math.atan2(dot(hv, f), hv[1])),
      L: shr(B.lc, B.la), R: shr(B.rc, B.ra) };
  }
  /* the bind pose: every bone from the skin's own inverse binds (skeleton.pose), read, then the mixer lays the takes back */
  const sm = []; P.model.traverse(o => { if (o.isSkinnedMesh) sm.push(o); });
  if (LIVE) {
    const rows = [];
    for (let i = 0; i < N; i++) { await new Promise(r => setTimeout(r, SPAN * 1000 / N)); const r = read();
      rows.push({ t: +(i * SPAN / N).toFixed(1), take: P.cur, look: +r.look.toFixed(1), lean: +r.lean.toFixed(1), side: +r.side.toFixed(1), curve: +r.curve.toFixed(1), head: +r.head.toFixed(1), collarL: +r.L.el.toFixed(1), collarR: +r.R.el.toFixed(1) }); }
    return { live: rows };
  }
  const keepB = []; P.model.traverse(o => { if (o.isBone) keepB.push([o, o.quaternion.clone(), o.position.clone()]); });
  sm[0].skeleton.pose(); const bind = read(); for (const [o, q, v] of keepB) { o.quaternion.copy(q); o.position.copy(v); }
  const keep = {}; for (const k in P.acts) keep[k] = [P.acts[k].time, P.acts[k].getEffectiveWeight(), P.acts[k].timeScale];
  const out = { bind, takes: {} };
  const names = TAKES ? Object.keys(TAKES) : Object.keys(P.acts);
  for (const name of names) {
    const A = P.acts[name]; if (!A) { out.takes[name] = { err: 'no take' }; continue; }
    const d = A.getClip().duration, W = TAKES ? TAKES[name] : (P.win && P.win[name] ? [P.win[name][0], P.win[name][1]] : [0, d]);
    const rows = [];
    for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
    for (let i = 0; i < N; i++) {
      const t = W[0] + (N > 1 ? W[1] * i / (N - 1) : 0);
      A.time = Math.max(0, Math.min(d - 1e-3, t)); A.timeScale = 0; P.mixer.update(0);
      const r = read();
      rows.push({ t: +t.toFixed(2), look: +(r.look - bind.look).toFixed(1), lean: +r.lean.toFixed(1), side: +r.side.toFixed(1), curve: +r.curve.toFixed(1), head: +r.head.toFixed(1),
        shrugL: +(r.L.el - bind.L.el).toFixed(1), shrugR: +(r.R.el - bind.R.el).toFixed(1), riseL: +(r.L.ht - bind.L.ht).toFixed(1), riseR: +(r.R.ht - bind.R.ht).toFixed(1) });
    }
    out.takes[name] = { win: W, rows };
  }
  for (const k in keep) { P.acts[k].time = keep[k][0]; P.acts[k].setEffectiveWeight(keep[k][1]); P.acts[k].timeScale = keep[k][2]; }
  P.mixer.update(0);
  return out;
}, { WHO, N, TAKES, LIVE, SPAN });
fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
if (res.err) { console.log(res.err); process.exit(1); }
if (res.live) { for (const r of res.live) console.log(JSON.stringify(r)); console.log('page errors:', errs.length ? errs.slice(0, 4).join(' | ') : 'none'); await b.close(); process.exit(0); }
const b0 = res.bind;
console.log(`${WHO} bind: lean ${b0.lean.toFixed(1)}  curve ${b0.curve.toFixed(1)}  head ${b0.head.toFixed(1)}  collar L ${b0.L.el.toFixed(1)} R ${b0.R.el.toFixed(1)}`);
for (const [name, T] of Object.entries(res.takes)) {
  if (T.err) { console.log(name, T.err); continue; }
  const avg = (k) => (T.rows.reduce((s, r) => s + r[k], 0) / T.rows.length).toFixed(1), mx = (k) => Math.max(...T.rows.map(r => r[k])).toFixed(1);
  console.log(`${name.padEnd(28)} [${T.win.map(v => (+v).toFixed(2)).join('+')}]  look ${avg('look')}  lean ${avg('lean')} (max ${mx('lean')})  curve ${avg('curve')}  head ${avg('head')}  shrug L ${avg('shrugL')} R ${avg('shrugR')} deg  rise L ${avg('riseL')} R ${avg('riseR')} cm`);
}
console.log('page errors:', errs.length ? errs.slice(0, 4).join(' | ') : 'none');
await b.close();
