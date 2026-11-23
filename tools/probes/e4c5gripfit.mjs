/* v28.0 (E4C5, R25/R26): HIS HAND ON THE NAGA STICK, FITTED BY MEASURE. On a phone page (390 x 844, a touch context): the
   fight set out and its brief taken down through the fight's lab, his grip turned on (lab.gripOn), and then for each
   setting tried (lab.gripTune: the shaft's slope across his palm, his fist's place in his own frame, the side his elbow
   goes, the stick's lean back toward him) and each of his takes asked (POSES: his rest, his run), held, the measure a body
   is held to (tools/probes/jointscan.mjs's own formulas for his right arm: the elbow's bend, the wrist toward the palm and
   toward the thumb, the forearm's turn), and the stick's: its foot over the paving, its lean from upright, his skin INSIDE
   its shaft (his right hand's: the grip's own press; and every other point of him: the stick through his robe or body),
   each against the shaft's line from its foot to the Naga's head. The chapter may be served from a file (CHFILE, as
   e4c5films.mjs), so a change to the chapter alone is measured with no build.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [CHFILE=src/chapters/e4/e4c5.js] [OUT=file.json] [POSES=rest@0,Running@0.3]
       [TRY='[{"tilt":18},{"tilt":8,"fist":[-0.3,1.09,0.28]}]'] node tools/probes/e4c5gripfit.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5gripfit.json';
const POSES = (process.env.POSES || 'rest@0,Running@0.3').split(',').map(s => { const [n, t] = s.split('@'); return [n, +t]; });
const TRY = JSON.parse(process.env.TRY || '[{}]');
const DIST = process.env.ENC_DIST || 'dist';
const CHSRC = process.env.CHFILE ? fs.readFileSync(process.env.CHFILE, 'utf8') : null;
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { const t = m.text(); if (/PHOGRIP5|threw/i.test(t) || m.type() === 'error') errs.push(m.type() + ' ' + t.slice(0, 300)); });
if (CHSRC) await p.route(new RegExp('/assets/e4c5\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: CHSRC }));
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
await p.evaluate(() => window.__enc.stage.setPhase('fight'));
await p.waitForFunction(() => window.__enc.kit.eventActive() && window.__enc.kit.tagState().on, null, { timeout: 300000, polling: 500 });
await p.evaluate(() => window.__enc.stage.snap().story.fight.lab.open());
await p.waitForFunction(() => !window.__enc.kit.eventActive() && window.__enc.kit.tagState().live, null, { timeout: 300000, polling: 500 });
say('grip on', await p.evaluate(() => window.__enc.stage.snap().story.fight.lab.gripOn()));
await frames(8);
/* the measures, in the page */
await p.evaluate(() => {
  window.__gfit = () => {
    const E = window.__enc, P = E.stage.plan.FLOOR.cast.pho, g = E.stage.things.nagaStaff, V = P.group.position.constructor, M4 = g.matrixWorld.constructor, D = 180 / Math.PI;
    P.group.updateWorldMatrix(true, true); g.updateWorldMatrix(true, false);
    const bone = (n) => { for (const k in P.bone) if (new RegExp('^(mixamorig:?)?' + n + '$').test(k)) return P.bone[k]; return null; };
    const at = (n) => { const b0 = bone(n); return b0 ? b0.getWorldPosition(new V()) : null; };
    const out = {};
    /* jointscan's right arm */
    { const sh = at('RightArm'), el = at('RightForeArm'), wr = at('RightHand'), i1 = at('RightHandIndex1'), m1 = at('RightHandMiddle1'), k1 = at('RightHandPinky1'), side = -1;
      const f = m1.clone().sub(wr).normalize(), ac = i1.clone().sub(k1); ac.addScaledVector(f, -ac.dot(f)).normalize();
      const n = new V().crossVectors(f, ac).multiplyScalar(side).normalize(), rad = ac;
      const u = el.clone().sub(sh).normalize(), e = wr.clone().sub(el).normalize(), phi = Math.acos(Math.max(-1, Math.min(1, u.dot(e)))) * D;
      const ne = n.clone().addScaledVector(e, -n.dot(e)).normalize(), re = rad.clone().addScaledVector(e, -rad.dot(e)).normalize();
      out.elbow = +phi.toFixed(1); out.wristFlex = +(Math.atan2(f.dot(ne), f.dot(e)) * D).toFixed(1); out.wristDev = +(Math.atan2(f.dot(re), f.dot(e)) * D).toFixed(1);
      if (phi > 25) { const h = new V().crossVectors(u, e).normalize(), med = h.clone().multiplyScalar(side), dn = u.clone().addScaledVector(e, -u.dot(e)).normalize();
        out.forearmTurn = +(Math.atan2(ne.dot(dn), ne.dot(med)) * D).toFixed(1); }
      out.forearmSlope = +(Math.asin(e.y) * D).toFixed(1); out.elbowY = +el.y.toFixed(3); out.wristY = +wr.y.toFixed(3); out.shoulderY = +sh.y.toFixed(3); }
    /* each finger's bends as its bones stand drawn (the angle between one bone's line and the next's, at the knuckle, the
       middle and the end joint: 0 straight), so a solve that is laid is told from one that is not */
    { const bends = {}; for (const nm of ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky']) { const q = [0, 1, 2, 3, 4].map(i => i === 0 ? at('RightHand') : at('RightHand' + nm + i));
        if (q.some(x => !x)) continue; const ang = (a0, a1, a2) => { const u = a1.clone().sub(a0).normalize(), w = a2.clone().sub(a1).normalize(); return +(Math.acos(Math.max(-1, Math.min(1, u.dot(w)))) * D).toFixed(1); };
        bends[nm] = [ang(q[0], q[1], q[2]), ang(q[1], q[2], q[3]), ang(q[2], q[3], q[4])]; }
      out.bends = bends; }
    /* the stick: its foot over the paving, its lean (back toward him + / forward -, out to his right + / in -) */
    { const foot = new V(0.082, 0, -0.003).applyMatrix4(g.matrixWorld), top = new V(0.082, 1.15, -0.003).applyMatrix4(g.matrixWorld), ax = top.clone().sub(foot).normalize();
      const ry = P.group.rotation.y, fw = new V(Math.sin(ry), 0, Math.cos(ry)), lf = new V(Math.cos(ry), 0, -Math.sin(ry));
      out.footY = +(foot.y - P.group.position.y).toFixed(3); out.leanBack = +(Math.asin(-ax.dot(fw)) * D).toFixed(1); out.leanOut = +(Math.asin(-ax.dot(lf)) * D).toFixed(1);
      const rel = foot.clone().sub(P.group.position); out.footFwd = +rel.dot(fw).toFixed(3); out.footRight = +(-rel.dot(lf)).toFixed(3); }
    /* his skin in its shaft */
    { const inv = new M4().copy(g.matrixWorld).invert(), ws = new V().setFromMatrixColumn(g.matrixWorld, 0).length(), R = 0.036, CX = 0.082, CZ = -0.003;
      let handIn = 0, handDeep = 0, bodyIn = 0, bodyGap = 9, bodyAt = null; const fing = {}; const v = new V();
      P.group.traverse(o => { if (!o.isSkinnedMesh || !o.visible) return;
        const A = o.geometry.attributes, si = A.skinIndex, sw = A.skinWeight, cnt = A.position.count;
        const fam = o.skeleton.bones.map(b0 => { const m = /RightHand(Thumb|Index|Middle|Ring|Pinky)?\d*$/.exec(b0.name); return m ? (m[1] || 'Palm') : null; });
        for (let i = 0; i < cnt; i++) { let best = -1, bw = 0; for (let q = 0; q < 4; q++) { const w = sw.getComponent(i, q); if (w > bw) { bw = w; best = si.getComponent(i, q); } }
          o.getVertexPosition(i, v); v.applyMatrix4(o.matrixWorld).applyMatrix4(inv);
          if (v.y < -0.02 || v.y > 1.15) continue;
          const d = (Math.hypot(v.x - CX, v.z - CZ) - R) * ws, f = best >= 0 ? fam[best] : null;
          if (f) { if (d < -0.003) handIn++; if (-d > handDeep) handDeep = -d; const F = fing[f] || (fing[f] = { gap: 9, on: 0 }); if (d < F.gap) F.gap = d; if (Math.abs(d) < 0.01) F.on++; }
          else { if (d < 0) bodyIn++; if (d < bodyGap) { bodyGap = d; bodyAt = +v.y.toFixed(2); } } } });
      out.handIn = handIn; out.handDeepCm = +(handDeep * 100).toFixed(1); out.bodyIn = bodyIn; out.bodyGapCm = +(bodyGap * 100).toFixed(1); out.bodyGapAtY = bodyAt;
      out.fingers = Object.fromEntries(Object.entries(fing).map(([k, F]) => [k, [+(F.gap * 100).toFixed(1), F.on]])); }
    /* (the solve's own joints set beside the joints drawn, where the chapter can say them: lab.gripDiag) */
    { const L = E.stage.snap().story.fight.lab; if (L.gripDiag) out.diag = L.gripDiag(); }
    return out;
  };
});
const res = [];
for (const T of TRY) {
  const set = await p.evaluate((T) => window.__enc.stage.snap().story.fight.lab.gripTune(T), T);
  const grip = await p.evaluate(() => window.__enc.stage.snap().story.fight.lab.grip());
  for (const [name, t] of POSES) {
    await p.evaluate(([n, t]) => window.__enc.stage.snap().story.fight.lab.pose(n === 'rest' ? null : n, t), [name, t]);
    await frames(5);
    const m = await p.evaluate(() => window.__gfit());
    say(JSON.stringify(set), name + '@' + t, JSON.stringify(m));
    res.push({ set, grip: grip && grip.report, pose: name + '@' + t, m });
  }
}
await p.evaluate(() => window.__enc.stage.snap().story.fight.lab.pose(null));
fs.writeFileSync(OUT, JSON.stringify({ res, errs }, null, 1));
for (const e of errs.slice(0, 8)) say(e);
say('errors', errs.length);
await b.close();
