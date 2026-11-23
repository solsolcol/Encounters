/* v28.0 R65 · THE STICK ON TON'S PALMS, MEASURED AGAINST HIS SKIN (Chad, 23 Nov 2026: "when ton hands over the naga stick,
   it does not properly sit in his hands, instead it is floating higher. Fix it properly."). The preparation film (where he
   unwraps it and holds it out on both palms) reached as tools/probes/e4c5films.mjs reaches it, sought to each moment of T,
   and at each: his two palm points as the chapter finds them (c_cast.js palmOf: the hand bone and the middle finger's first
   bone, halfway), HIS SKIN there (every vertex of his drawn body whose strongest weight is a hand or finger bone, posed, in
   the world: the highest of them within 3 cm across of each palm point), and THE STICK there (every vertex of its drawn
   mesh within 3 cm across of each palm point: the lowest). GAP = the stick's lowest there minus his skin's highest there:
   over 0 the stick floats over his palm, under 0 it sinks into it. A full-size picture of each moment from the film's lens.
     ENC_DIST=<snapshot> [CHFILE=<chapter.js>] CHROMIUM_PATH=... [T=4.6,5.6,6.6,7.6] [DPR=2] [OUT=dir] node tools/probes/e4c5palms.mjs
   (through tools/bslot.sh) */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const DIST = process.env.ENC_DIST || 'dist', OUT = process.env.OUT || '/tmp/e4c5palms', DPR = +(process.env.DPR || 2);
const TS = (process.env.T || '4.6,5.6,6.6,7.6').split(',').map(Number);
fs.mkdirSync(OUT, { recursive: true });
const CHF = fs.readdirSync(DIST + '/assets').find(f => /^e4c5\.[0-9a-f]+\.js$/.test(f));
let CHSRC = fs.readFileSync(process.env.CHFILE || DIST + '/assets/' + CHF, 'utf8');
if (!/people: \(\) => people/.test(CHSRC)) CHSRC = CHSRC.replace(/(PRAI5, STICK5)(\s*\};)/, '$1, people: () => people, crowd: () => crowd$2');
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DPR, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
await p.route(new RegExp('/assets/e4c5\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: CHSRC }));
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000); await p.waitForTimeout(8000);
await p.evaluate(() => window.__enc.stage.applyPhase('hunt'));
await p.waitForFunction(() => window.__enc.stage.phase === 'hunt' && window.__enc.getState() === 'play', null, { timeout: 600000, polling: 500 });
await p.evaluate(() => { window.__fsClear = 0; });
await p.waitForFunction(() => { const o = parseFloat(getComputedStyle(document.getElementById('cineFade')).opacity) || 0, now = performance.now();
  if (o >= 0.02) { window.__fsClear = 0; return false; } if (!window.__fsClear) window.__fsClear = now; return now - window.__fsClear > 2500; }, null, { timeout: 900000, polling: 250 });
await p.waitForTimeout(1500);
log('film started', await p.evaluate(() => window.__enc.kit.film('prepare')));
await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.getState() === 'cine' && window.__enc.cine.t() > 0.2, null, { timeout: 1500000, polling: 250 });
await p.waitForFunction(() => { try { return !!window.__enc.stage.ready(); } catch { return true; } }, null, { timeout: 300000, polling: 500 }).catch(() => {});
await p.addStyleTag({ content: '#caption{display:none !important}' }).catch(() => {});
const rows = [];
for (const t of TS) {
  await p.evaluate((t) => window.__enc.cine.seek(t), t); await frames(3); await p.waitForTimeout(1200);
  const r = await p.evaluate((t) => {
    const E = window.__enc, S = E.stage, F = S.films, V3 = E.camera.position.constructor, v = new V3(), u = new V3();
    const PP = F.people ? F.people() : [], ton = PP.find(q => q.key === 'e4ton') || PP.find(q => /ton$/i.test(q.key || '')), stick = S.world && S.world.getObjectByName('nagaStaff');
    if (!ton || !stick) return { t, missing: { ton: !!ton, stick: !!stick }, keys: PP.map(q => q.key) };
    ton.group.updateWorldMatrix(true, true); stick.updateWorldMatrix(true, true);
    const bone = (re) => { for (const k in (ton.bone || {})) if (re.test(k)) return ton.bone[k]; return null; };
    const palm = (sd) => { const h = bone(new RegExp('^(mixamorig:?)?' + sd + 'Hand$')), m = bone(new RegExp('^(mixamorig:?)?' + sd + 'HandMiddle1$'));
      if (!h) return null; const a = h.getWorldPosition(new V3()); if (m) a.lerp(m.getWorldPosition(new V3()), 0.5); return a; };
    const P = { L: palm('Left'), R: palm('Right') };
    const skin = { L: [], R: [] };
    ton.group.traverse(m => { if (!m.isSkinnedMesh || !m.visible) return; if (m.skeleton) m.skeleton.update();
      const G = m.geometry, N = G.attributes.position.count, SI = G.attributes.skinIndex, SW = G.attributes.skinWeight, B = m.skeleton.bones;
      for (let i = 0; i < N; i++) {
        let bi = -1, bw = -1; for (let k = 0; k < 4; k++) { const w = SW.getComponent(i, k); if (w > bw) { bw = w; bi = SI.getComponent(i, k); } }
        const nm = B[bi] ? B[bi].name : ''; const sd = /Left(Hand|Thumb|Index|Middle|Ring|Pinky)/.test(nm) ? 'L' : /Right(Hand|Thumb|Index|Middle|Ring|Pinky)/.test(nm) ? 'R' : '';
        if (!sd) continue; m.getVertexPosition(i, v); m.localToWorld(v); skin[sd].push([v.x, v.y, v.z]); } });
    const sv = []; stick.traverse(m => { if (!m.isMesh || !m.geometry) return; const A = m.geometry.attributes.position;
      for (let i = 0; i < A.count; i++) { u.fromBufferAttribute(A, i).applyMatrix4(m.matrixWorld); sv.push([u.x, u.y, u.z]); } });
    const out = { t, visible: stick.visible };
    /* (the shaft's middle line, from the stick's own frame (its slices: local x 0.09, z 0), against each palm's middle: how far
       across it passes, and where along it) */
    { const a = new V3(0.09, 0, 0).applyMatrix4(stick.matrixWorld), b2 = new V3(0.09, 1.4, 0).applyMatrix4(stick.matrixWorld), d = b2.clone().sub(a), dl = d.length(); d.divideScalar(dl);
      out.shaft = {}; for (const sd of ['L', 'R']) { const c = P[sd]; if (!c) continue; const k = c.clone().sub(a).dot(d), q = a.clone().addScaledVector(d, k);
        out.shaft[sd] = { along: +k.toFixed(3), across: +Math.hypot(c.x - q.x, c.z - q.z).toFixed(4), above: +(q.y - c.y).toFixed(4) }; } }
    /* (THE PALM'S OWN SKIN, in the hand bone's frame: the vertices whose strongest weight is the hand bone itself (the palm and
       the back of the hand, no finger), within 2.5 cm across of the palm point; the highest twelve of them (the palm's side,
       held up) averaged; written in the hand bone's own frame, with the world's up there, so a hold that tilts the hand
       carries it: c_cast.js PALMSKIN5) */
    const surf = { L: [], R: [] };
    ton.group.traverse(m => { if (!m.isSkinnedMesh || !m.visible) return;
      const G = m.geometry, N = G.attributes.position.count, SI = G.attributes.skinIndex, SW = G.attributes.skinWeight, B = m.skeleton.bones;
      for (let i = 0; i < N; i++) {
        let bi = -1, bw = -1; for (let k = 0; k < 4; k++) { const w = SW.getComponent(i, k); if (w > bw) { bw = w; bi = SI.getComponent(i, k); } }
        const nm = B[bi] ? B[bi].name : ''; const sd = /LeftHand$/.test(nm) ? 'L' : /RightHand$/.test(nm) ? 'R' : '';
        if (!sd || !P[sd]) continue; m.getVertexPosition(i, v); m.localToWorld(v);
        if (Math.hypot(v.x - P[sd].x, v.z - P[sd].z) <= 0.025) surf[sd].push([v.x, v.y, v.z]); } });
    out.palmSkin = {};
    for (const sd of ['L', 'R']) { const hb = bone(new RegExp('^(mixamorig:?)?' + (sd === 'L' ? 'Left' : 'Right') + 'Hand$')); if (!hb || !surf[sd].length) continue;
      const top = surf[sd].sort((a, b) => b[1] - a[1]).slice(0, 12), av = [0, 1, 2].map(k => top.reduce((s, q) => s + q[k], 0) / top.length);
      hb.updateWorldMatrix(true, false); const loc = hb.worldToLocal(new V3(av[0], av[1], av[2])), pl = hb.worldToLocal(P[sd].clone());
      const o = hb.localToWorld(new V3(0, 0, 0)), upL = hb.worldToLocal(o.clone().add(new V3(0, 1, 0))).sub(new V3(0, 0, 0));
      const sc = new V3(); hb.matrixWorld.decompose(new V3(), new (E.camera.quaternion.constructor)(), sc);
      /* (THE PALM'S CENTRE, in the hand's own frame: of the hand bone's own points within 3 cm of the palm's middle across the
         palm (its local y and z), the farthest out on the palm's side (+x on the left hand, -x on the right: this rig's palms,
         read above): the palm's top once the hand is held level) */
      const sg = sd === 'L' ? 1 : -1, cen = []; ton.group.traverse(m => { if (!m.isSkinnedMesh || !m.visible) return;
        const G = m.geometry, N = G.attributes.position.count, SI = G.attributes.skinIndex, SW = G.attributes.skinWeight, B = m.skeleton.bones;
        for (let i = 0; i < N; i++) { let bi = -1, bw = -1; for (let k = 0; k < 4; k++) { const w = SW.getComponent(i, k); if (w > bw) { bw = w; bi = SI.getComponent(i, k); } }
          if (B[bi] !== hb) continue; m.getVertexPosition(i, v); m.localToWorld(v); hb.worldToLocal(v);
          if (Math.hypot(v.y - pl.y, v.z - pl.z) <= 0.03 && v.x * sg > 0) cen.push([v.x, v.y, v.z]); } });
      const ex = cen.sort((a, b) => b[0] * sg - a[0] * sg).slice(0, 8), exa = [0, 1, 2].map(k => ex.reduce((s2, q) => s2 + q[k], 0) / Math.max(1, ex.length));
      const fa = bone(new RegExp('^(mixamorig:?)?' + (sd === 'L' ? 'Left' : 'Right') + 'ForeArm$')), mi = bone(new RegExp('^(mixamorig:?)?' + (sd === 'L' ? 'Left' : 'Right') + 'HandMiddle1$'));
      const wF = hb.getWorldPosition(new V3()).sub(fa.getWorldPosition(new V3())).normalize(), wH = mi.getWorldPosition(new V3()).sub(hb.getWorldPosition(new V3())).normalize();
      const nW = hb.localToWorld(new V3(sg, 0, 0)).sub(hb.getWorldPosition(new V3())).normalize();
      out.palmSkin[sd + 'centre'] = { n: cen.length, top8: exa.map(x => +x.toFixed(5)), palmUpDeg: +(Math.acos(Math.max(-1, Math.min(1, nW.y))) * 180 / Math.PI).toFixed(1),
        wristDeg: +(Math.acos(Math.max(-1, Math.min(1, wF.dot(wH)))) * 180 / Math.PI).toFixed(1), handDownDeg: +(Math.asin(Math.max(-1, Math.min(1, -wH.y))) * 180 / Math.PI).toFixed(1),
        wristFlexSign: +Math.sign(wH.clone().sub(wF).dot(nW)).toFixed(0),
        /* (the wrist taken apart in the forearm's own frame: FLEX the hand's turn toward the palm (+) or its back (-), about the
           line across the wrist; DEV its turn sideways, toward the thumb (+) or the little finger (-); a wrist's own reach is
           about 80 flexion, 70 extension, 20 toward the thumb and 35 toward the little finger) */
        ...(() => { const lat = new V3().crossVectors(nW, wF).normalize(), nn = new V3().crossVectors(wF, lat).normalize();
          const th = bone(new RegExp('^(mixamorig:?)?' + (sd === 'L' ? 'Left' : 'Right') + 'HandThumb1$')), thW = th ? th.getWorldPosition(new V3()).sub(hb.getWorldPosition(new V3())) : null;
          const tsg = thW ? Math.sign(thW.dot(lat)) || 1 : 1;
          return { flexDeg: +(Math.atan2(wH.dot(nn), wH.dot(wF)) * 180 / Math.PI).toFixed(1), devDeg: +(tsg * Math.atan2(wH.dot(lat), wH.dot(wF)) * 180 / Math.PI).toFixed(1),
                   foreUpDeg: +(Math.asin(Math.max(-1, Math.min(1, wF.y))) * 180 / Math.PI).toFixed(1) }; })() };
      out.palmSkin[sd] = { world: av.map(x => +x.toFixed(4)), aboveBone: +(av[1] - P[sd].y).toFixed(4), n: surf[sd].length, local: [loc.x, loc.y, loc.z].map(x => +x.toFixed(5)),
                           palmLocal: [pl.x, pl.y, pl.z].map(x => +x.toFixed(5)), upLocal: [upL.x, upL.y, upL.z].map(x => +x.toFixed(5)), boneScale: +sc.x.toFixed(5) }; }
    for (const sd of ['L', 'R']) { const c = P[sd]; if (!c) continue;
      const near = (q) => Math.hypot(q[0] - c.x, q[2] - c.z) <= 0.03;
      const hs = skin[sd].filter(near), ss = sv.filter(near);
      const top = hs.length ? Math.max(...hs.map(q => q[1])) : null, low = ss.length ? Math.min(...ss.map(q => q[1])) : null;
      out[sd] = { palmBoneY: +c.y.toFixed(4), skinTop: top == null ? null : +top.toFixed(4), stickLow: low == null ? null : +low.toFixed(4),
                  gap: top != null && low != null ? +(low - top).toFixed(4) : null, nSkin: hs.length, nStick: ss.length, handVerts: skin[sd].length }; }
    return out; }, t);
  rows.push(r); log(JSON.stringify(r));
  await p.screenshot({ path: `${OUT}/palms-${t}.png` });
  /* FROM BESIDE HIM: two lenses square to the stick's line at the palms' height, 0.8 m off, one each side, drawn into the
     canvas's top third (a landscape frame: both hands in it) and read back in the same task (no preserveDrawingBuffer) */
  const side = await p.evaluate(() => {
    const E = window.__enc, F = E.stage.films, PP = F.people ? F.people() : [], ton = PP.find(q => q.key === 'e4ton');
    if (!ton) return null; const V3 = E.camera.position.constructor, R = E.renderer, cv = R.domElement;
    const bone = (re) => { for (const k in (ton.bone || {})) if (re.test(k)) return ton.bone[k]; return null; };
    const pm = (sd) => { const h = bone(new RegExp('^(mixamorig:?)?' + sd + 'Hand$')), m = bone(new RegExp('^(mixamorig:?)?' + sd + 'HandMiddle1$'));
      const a = h.getWorldPosition(new V3()); if (m) a.lerp(m.getWorldPosition(new V3()), 0.5); return a; };
    ton.group.updateWorldMatrix(true, true); const L = pm('Left'), Rr = pm('Right'), mid = L.clone().add(Rr).multiplyScalar(0.5);
    let dx = Rr.x - L.x, dz = Rr.z - L.z; const dl = Math.hypot(dx, dz) || 1; dx /= dl; dz /= dl;
    const W = cv.clientWidth, H = cv.clientHeight, h3 = Math.round(W / 1.5);
    const cam = new E.camera.constructor(30, W / h3, 0.02, 60), out = [];
    /* (A: from the stick's head end, 1.35 m along its line and a little over it, the stick end on over his two hands; B: from
       its foot end the same; C: square to it on his teacher's side, 0.55 m off, his teacher hidden for the picture) */
    const pho = PP.find(q => q.key === 'e4pho' || /pho$/i.test(q.key || '') && q !== ton), side = ton.group.position;
    const sF = ((side.x - mid.x) * -dz + (side.z - mid.z) * dx) > 0 ? -1 : 1;     // (the side away from Ton)
    const views = [[mid.x - dx * 1.35, mid.y + 0.10, mid.z - dz * 1.35], [mid.x + dx * 1.35, mid.y + 0.10, mid.z + dz * 1.35], [mid.x - dz * 0.55 * sF, mid.y + 0.05, mid.z + dx * 0.55 * sF],
                   [mid.x - dz * 0.02 * sF, mid.y + 0.9, mid.z + dx * 0.02 * sF]];
    views.forEach((e, i) => { const hide = i >= 2 && pho && pho.group; if (hide) pho.group.visible = false;
      cam.position.set(e[0], e[1], e[2]); cam.lookAt(mid.x, mid.y, mid.z); cam.updateProjectionMatrix(); cam.updateMatrixWorld(true);
      R.setViewport(0, H - h3, W, h3); R.render(E.scene, cam); out.push(cv.toDataURL('image/png')); if (hide) pho.group.visible = true; });
    R.setViewport(0, 0, W, H);
    return { out, h3: Math.round(h3 * (window.devicePixelRatio || 1)) }; });
  if (side) side.out.forEach((u, i) => fs.writeFileSync(`${OUT}/side${'ABCD'[i]}-${t}.png`, Buffer.from(u.split(',')[1], 'base64')));
  if (side) fs.writeFileSync(`${OUT}/side-h.txt`, String(side.h3));
}
fs.writeFileSync(OUT + '/palms.json', JSON.stringify({ rows, errs }, null, 1));
log('done', errs.length, 'errors'); await b.close();
