/* v28.0 (E4C5, R25, the lead's Go of 21 Nov): HIS ACTS WITH THE STAFF KEPT IN HIS RIGHT HAND, measured at every frame and
   photographed. "In the three acts the right arm keeps the staff and the stick makes its own move. FIRE is a thrust of the
   Naga's head with the ball leaving its mouth ... The gold is the stick's foot struck on the paving, the ring going out from
   that point. The planting is a strike. His take plays on the rest of him." On a phone page (390 x 844 at 2, a touch
   context): the fight set out through its lab, the grip turned on, then each act's take held by the lab (lab.pose) at the
   moments of its own clock that a phone draws at 30 frames a second (the fight plays each act's span EASED: FS_PHO_TAKE's
   a, top, b and their seconds; the Naga's film plays its cast on an even clock), and at each:
     JOINTS  jointscan.mjs's own measure (read from that file, so the two never differ) on Grandmaster Pho: every joint
             against a real body's range;
     STICK   his skin against the stick's own surface (each point of his within 3 cm of it, inside by the surface's own
             facing at its nearest point): none of his skin in it, his gripping hand apart (its press is the grip's);
             the stick's nearest point to his face (9 cm before his head bone) and to his head bone, against his rest's;
             the stick's foot and its lowest point against the paving;
     FEET    the lowest of his skin that rides each foot, against the paving (a sole more than a centimetre under it);
   and at the key moments, three pictures full size: through the fight's own lens (the boom behind and above him), from his
   front (3.0 m) and from his right side (2.6 m: he is turned a quarter for it, so the court's length is behind the lens).
   OUT/acts.json holds every row; the pictures are OUT/<act>-<moment>-<view>.png.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [CHFILE=<chapter.js>] [TUNE='{...}'] [OUT=dir] [ACTS=fire,gold,bag,plant]
       [PICS=1] [STEP=30] node tools/probes/e4c5acts.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5acts'; fs.mkdirSync(OUT, { recursive: true });
const FPS = +(process.env.STEP || 30), PICS = process.env.PICS !== '0';
const ACTS = (process.env.ACTS || 'fire,gold,bag,plant').split(',');
/* the measure of a body's joints: jointscan.mjs's, word for word */
const JS = fs.readFileSync(new URL('./jointscan.mjs', import.meta.url), 'utf8');
const j0 = JS.indexOf('\nconst MEASURE = '), j1 = JS.indexOf('\n};\n', j0);
if (j0 < 0 || j1 < 0) throw new Error('e4c5acts: jointscan.mjs no longer has its MEASURE where this reads it');
const MEASURE_SRC = JS.slice(j0 + '\nconst MEASURE = '.length, j1 + 2);
/* each act's moments, as a phone draws them: [take, moment] at 1/FPS s of the act's own wall time */
const smo = (u) => u * u * (3 - 2 * u);
const spanAt = (t0, t1, secs) => { const out = []; for (let i = 0, n = Math.ceil(secs * FPS); i <= n; i++) out.push(+(t0 + (t1 - t0) * smo(Math.min(1, i / n))).toFixed(4)); return out; };
const evenAt = (t0, t1) => { const out = []; for (let i = 0, n = Math.ceil((t1 - t0) * FPS); i <= n; i++) out.push(+(t0 + (t1 - t0) * i / n).toFixed(4)); return out; };
const PLAN = {
  fire:  { take: 'mage_soell_cast_7', us: [...spanAt(0.45, 0.95, 0.28), ...spanAt(0.95, 2.20, 0.55).slice(1)], keys: [0.66, 0.95, 1.30] },
  gold:  { take: 'Charged_Spell_Cast', us: [...spanAt(0.50, 2.00, 1.5), ...spanAt(2.00, 2.60, 0.6).slice(1)], keys: [1.20, 1.88, 2.00] },
  bag:   { take: 'mage_soell_cast_8', us: spanAt(0.00, 0.40, 0.6), keys: [0.40] },
  plant: { take: 'Charged_Spell_Cast_1', us: evenAt(0.0, 1.70), keys: [1.40, 1.70] }
};
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [], logs = [];
if (process.env.CHFILE) { const src = fs.readFileSync(process.env.CHFILE, 'utf8'); await p.route(new RegExp('/assets/e4c5\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: src })); }
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { const t = m.text(); if (/PHOGRIP5|threw|has no take/i.test(t) || m.type() === 'error') logs.push(m.type() + ' ' + t.slice(0, 400)); });
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
if (process.env.GRIP !== '0') say('grip on', await p.evaluate(() => { const L = window.__enc.stage.snap().story.fight.lab; return L.gripOn ? L.gripOn() : 'no gripOn'; }));
if (process.env.TUNE) say('tuned', JSON.stringify(await p.evaluate((T) => window.__enc.stage.snap().story.fight.lab.gripTune(T), JSON.parse(process.env.TUNE))));
await frames(10);
/* THE STICK'S SURFACE, once, in its own frame: its points and their facings, hashed by 2 cm cells */
await p.evaluate(() => { const E = window.__enc, g = E.stage.things && E.stage.things.nagaStaff; if (!g) return;
  const V = g.position.constructor; g.updateWorldMatrix(true, true); const inv = g.matrixWorld.clone().invert();
  const pts = [], nrm = []; const v = new V(), n = new V();
  g.traverse(o => { if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
    const pa = o.geometry.attributes.position, na = o.geometry.attributes.normal, M = inv.clone().multiply(o.matrixWorld);
    const NM = M.clone(); NM.setPosition(0, 0, 0);
    for (let i = 0; i < pa.count; i++) { v.fromBufferAttribute(pa, i).applyMatrix4(M); pts.push(v.x, v.y, v.z);
      if (na) { n.fromBufferAttribute(na, i).applyMatrix4(NM).normalize(); nrm.push(n.x, n.y, n.z); } else nrm.push(0, 0, 0); } });
  const H = new Map(), C = 0.02, key = (x, y, z) => Math.floor(x / C) + ',' + Math.floor(y / C) + ',' + Math.floor(z / C);
  for (let i = 0; i < pts.length / 3; i++) { const k = key(pts[3 * i], pts[3 * i + 1], pts[3 * i + 2]); let a = H.get(k); if (!a) H.set(k, a = []); a.push(i); }
  let lo = [9, 9, 9], hi = [-9, -9, -9]; for (let i = 0; i < pts.length; i += 3) for (let j = 0; j < 3; j++) { lo[j] = Math.min(lo[j], pts[i + j]); hi[j] = Math.max(hi[j], pts[i + j]); }
  window.__stk = { pts, nrm, H, C, lo, hi, n: pts.length / 3 }; });
/* THE MEASURE OF THE STICK AND HIS SKIN at this moment (in the page) */
const STICK = () => { const E = window.__enc, P = E.stage.plan.FLOOR.cast.pho, g = E.stage.things.nagaStaff, S = window.__stk; if (!g || !S) return { err: 'no stick' };
  const V = P.group.position.constructor; P.group.updateWorldMatrix(true, true); g.updateWorldMatrix(true, false);
  const inv = g.matrixWorld.clone().invert(), ws = new V().setFromMatrixColumn(g.matrixWorld, 0).length();
  const C = S.C, key = (x, y, z) => Math.floor(x / C) + ',' + Math.floor(y / C) + ',' + Math.floor(z / C);
  let head = null, hb = null; for (const n in P.bone) { if (/^(mixamorig:?)?Head$/.test(n)) hb = P.bone[n]; }
  const hp = new V(); hb.getWorldPosition(hp); const fw = new V().setFromMatrixColumn(hb.matrixWorld, 2).normalize(), face = hp.clone().addScaledVector(fw, 0.09);
  /* the stick's nearest points to his face and head (every 7th of its points, in the world) */
  let dFace = 9, dHead = 9, low = 9; const w = new V();
  for (let i = 0; i < S.n; i += 7) { w.set(S.pts[3 * i], S.pts[3 * i + 1], S.pts[3 * i + 2]).applyMatrix4(g.matrixWorld);
    dFace = Math.min(dFace, w.distanceTo(face)); dHead = Math.min(dHead, w.distanceTo(hp)); low = Math.min(low, w.y); }
  const foot = new V(0.083, 0, -0.005).applyMatrix4(g.matrixWorld);
  /* his skin in the stick: each point within the stick's box and 3 cm of its surface, inside by the facing there */
  const fam = (nm) => { if (/RightHand/.test(nm)) return 'grip'; if (/Right(Fore)?Arm/.test(nm)) return 'rightArm'; if (/Left/.test(nm)) return 'left';
    if (/Leg|Foot|Toe|UpLeg/.test(nm)) return 'legs'; if (/Spine|Hips|Neck|Head|Shoulder/.test(nm)) return 'body'; return 'other'; };
  const per = {}, v = new V(); let feetLo = { L: 9, R: 9 }, skinLo = 9;
  P.group.traverse(o => { if (!o.isSkinnedMesh || !o.visible) return; let vis = true; for (let q = o; q; q = q.parent) if (!q.visible) vis = false; if (!vis) return;
    const sk = o.skeleton, A = o.geometry.attributes, si = A.skinIndex, sw = A.skinWeight, cnt = A.position.count;
    const fams = sk.bones.map(b => fam(b.name.replace(/^mixamorig:?/, ''))), side = sk.bones.map(b => /Left(Foot|ToeBase|Toe)/.test(b.name) ? 'L' : /Right(Foot|ToeBase|Toe)/.test(b.name) ? 'R' : null);
    for (let i = 0; i < cnt; i += 1) { let best = -1, bw = 0, fl = 0, fr = 0; for (let q = 0; q < 4; q++) { const wq = sw.getComponent(i, q), bi = si.getComponent(i, q); if (wq > bw) { bw = wq; best = bi; } if (side[bi] === 'L') fl += wq; if (side[bi] === 'R') fr += wq; }
      o.getVertexPosition(i, v); v.applyMatrix4(o.matrixWorld);
      if (v.y < skinLo) skinLo = v.y; if (fl >= 0.5 && v.y < feetLo.L) feetLo.L = v.y; if (fr >= 0.5 && v.y < feetLo.R) feetLo.R = v.y;
      v.applyMatrix4(inv);
      if (v.x < S.lo[0] - 0.03 || v.x > S.hi[0] + 0.03 || v.y < S.lo[1] - 0.03 || v.y > S.hi[1] + 0.03 || v.z < S.lo[2] - 0.03 || v.z > S.hi[2] + 0.03) continue;
      let bd = 0.03 / ws, bj = -1; const cx = Math.floor(v.x / C), cy = Math.floor(v.y / C), cz = Math.floor(v.z / C);
      for (let a = -1; a <= 1; a++) for (let bb = -1; bb <= 1; bb++) for (let c = -1; c <= 1; c++) { const L = S.H.get((cx + a) + ',' + (cy + bb) + ',' + (cz + c)); if (!L) continue;
        for (const j of L) { const d = Math.hypot(v.x - S.pts[3 * j], v.y - S.pts[3 * j + 1], v.z - S.pts[3 * j + 2]); if (d < bd) { bd = d; bj = j; } } }
      if (bj < 0) continue;
      const into = -((v.x - S.pts[3 * bj]) * S.nrm[3 * bj] + (v.y - S.pts[3 * bj + 1]) * S.nrm[3 * bj + 1] + (v.z - S.pts[3 * bj + 2]) * S.nrm[3 * bj + 2]) * ws;
      const f = best >= 0 ? fams[best] : 'other', F = per[f] || (per[f] = { near: 0, inside: 0, deep: 0, at: null });
      F.near++; if (into > 0.003) { F.inside++; if (into > F.deep) { F.deep = into; F.at = +(v.y * ws).toFixed(2); } } } });
  for (const f in per) per[f].deep = +(per[f].deep * 100).toFixed(2);
  return { face: +dFace.toFixed(3), head: +dHead.toFixed(3), foot: foot.toArray().map(x => +x.toFixed(3)), low: +low.toFixed(3), skin: per,
           feet: { L: +feetLo.L.toFixed(3), R: +feetLo.R.toFixed(3) }, skinLo: +skinLo.toFixed(3) }; };
const measure = async (tag) => {
  const st = await p.evaluate(STICK);
  const mv = await p.evaluate(() => { const L = window.__enc.stage.snap().story.fight.lab; return L.gripMove ? L.gripMove() : null; });
  const jr = await p.evaluate(new Function('args', 'return (' + MEASURE_SRC + ')(args);'), ['^cast:pho$', false]);
  const flags = jr && jr[0] ? jr[0].flags : ['no body'];
  const R = jr && jr[0] && jr[0].j ? jr[0].j.R : null;
  return { tag, mv, st, flags, R: R ? { elbow: R.elbow, wristFlex: R.wristFlex, wristDev: R.wristDev, forearmTurn: R.forearmTurn, elbowFwd: R.elbowFwd, handFwd: R.handFwd, shoulderBack: R.shoulderBack } : null };
};
const pose = async (name, u) => { await p.evaluate(([n, u]) => window.__enc.stage.snap().story.fight.lab.pose(n, u), [name, u]); await frames(3); };
const res = { rest: null, acts: {}, pics: [] };
/* HIS REST, the stick's distances to beat */
await pose(null, 0); await frames(4);
res.rest = await measure('rest'); say('rest', JSON.stringify(res.rest));
const restFace = res.rest.st.face, restHead = res.rest.st.head;
/* EVERY FRAME OF EACH ACT */
for (const act of ACTS) { const A = PLAN[act]; if (!A) continue; const rows = [];
  for (const u of A.us) { await pose(A.take, u); const r = await measure(act + '@' + u); rows.push(r);
    const s = r.st, bad = [];
    if (r.flags && r.flags.length) bad.push('joints ' + JSON.stringify(r.flags));
    for (const f in s.skin) if (f !== 'grip' && s.skin[f].inside) bad.push(`skin ${f} ${s.skin[f].inside} in, ${s.skin[f].deep} cm at ${s.skin[f].at} m`);
    if (s.skin.grip && s.skin.grip.deep > 0.6) bad.push(`grip ${s.skin.grip.deep} cm`);
    if (s.face < restFace - 0.005) bad.push(`face ${s.face} < rest ${restFace}`);
    if (s.low < -0.005) bad.push(`stick ${s.low} under the paving`);
    if (s.feet.L < -0.01 || s.feet.R < -0.01) bad.push(`feet ${s.feet.L} ${s.feet.R}`);
    say(act, u, bad.length ? 'FAULT ' + bad.join(' | ') : 'ok', 'face', s.face, 'foot', s.foot[1], JSON.stringify(r.mv), JSON.stringify(r.R)); }
  res.acts[act] = rows; }
fs.writeFileSync(OUT + '/acts.json', JSON.stringify({ res, errs, logs }, null, 1));
/* THE PICTURES: the fight's own lens first (the tag mode on), then his front and side (the mode left) */
if (PICS) {
  const keyset = []; for (const act of ACTS) { const A = PLAN[act]; if (A) for (const u of A.keys) keyset.push([act, A.take, u]); }
  keyset.unshift(['rest', null, 0]);
  await p.evaluate(() => { const E = window.__enc, k = E.kit; if (k.tagState().played !== 'pho' && k.tagSwitch) k.tagSwitch('pho', { force: true }); });
  for (const [act, take, u] of keyset) { await pose(take, u); await frames(3);
    const f = `${OUT}/${act}-${u}-lens.png`; await p.screenshot({ path: f, timeout: 300000 }); say('pic', f); res.pics.push(f); }
  await p.evaluate(() => { const k = window.__enc.kit; if (k.tag().on) k.tag(null, null); });
  /* his place for the pictures: the court's middle; his student set aside at its far corner on his left */
  await p.evaluate(() => { const E = window.__enc, P = E.stage.plan.FLOOR.cast.pho; P.group.position.x = -8.5; P.group.position.z = -9.7;
    const Z = E.stage.plan.FLOOR.cast.zav; if (Z) { Z.group.position.x = -6.9; Z.group.position.z = -11.4; } window.__ry0 = P.group.rotation.y; });
  for (const view of ['front', 'side']) {
    for (const [act, take, u] of keyset) { await pose(take, u);
      await p.evaluate(([view]) => { const E = window.__enc, P = E.stage.plan.FLOOR.cast.pho, V = P.group.position.constructor;
        /* (for his side he is turned a quarter, his right side toward the court's length) */
        P.group.rotation.y = view === 'side' ? window.__ry0 + Math.PI / 2 : window.__ry0; P.group.updateWorldMatrix(true, true);
        const g = P.group.position, ry = P.group.rotation.y, fx = Math.sin(ry), fz = Math.cos(ry), lx = Math.cos(ry), lz = -Math.sin(ry);
        const c = view === 'front' ? new V(g.x + fx * 3.0, 1.30, g.z + fz * 3.0) : new V(g.x - lx * 2.6, 1.25, g.z - lz * 2.6);
        const tg = view === 'front' ? new V(g.x, 0.95, g.z) : new V(g.x + fx * 0.25, 0.95, g.z + fz * 0.25);
        E.yaw.position.copy(c); window.__aim = tg; if (E.kit.lens) E.kit.lens(null, { secs: 0 }); }, [view]);
      await frames(2);
      await p.evaluate(() => { const E = window.__enc, tg = window.__aim, c = E.yaw.position, d = tg.clone().sub(c);
        E.yaw.rotation.y = Math.atan2(-d.x, -d.z); E.pitch.rotation.x = Math.atan2(d.y, Math.hypot(d.x, d.z)); });
      await frames(3);
      const f = `${OUT}/${act}-${u}-${view}.png`; await p.screenshot({ path: f, timeout: 300000 }); say('pic', f); res.pics.push(f); } }
  /* (his fist round the shaft at rest, close: from above it and from before it, through a 26 degree lens: a detail taken with a
     lens, never by enlarging) */
  if (process.env.HANDS !== '0') for (const view of ['handtop', 'handfront']) { await pose(null, 0);
    await p.evaluate(([view]) => { const E = window.__enc, P = E.stage.plan.FLOOR.cast.pho, V = P.group.position.constructor;
      P.group.rotation.y = window.__ry0; P.group.updateWorldMatrix(true, true);
      let mb = null, hb = null; for (const n in P.bone) { if (/^(mixamorig:?)?RightHandMiddle1$/.test(n)) mb = P.bone[n]; if (/^(mixamorig:?)?RightHand$/.test(n)) hb = P.bone[n]; }
      const fist = new V(), h = new V(); hb.getWorldPosition(h); mb.getWorldPosition(fist); fist.lerp(h, 0.35);
      const ry = P.group.rotation.y, fx = Math.sin(ry), fz = Math.cos(ry);
      const c = view === 'handtop' ? new V(fist.x + fx * 0.06, fist.y + 0.62, fist.z + fz * 0.06) : new V(fist.x + fx * 0.62, fist.y + 0.08, fist.z + fz * 0.62);
      E.yaw.position.copy(c); window.__aim = fist; if (E.kit.lens) E.kit.lens(26, { secs: 0 }); }, [view]);
    await frames(2);
    await p.evaluate(() => { const E = window.__enc, tg = window.__aim, c = E.yaw.position, d = tg.clone().sub(c);
      E.yaw.rotation.y = Math.atan2(-d.x, -d.z); E.pitch.rotation.x = Math.atan2(d.y, Math.hypot(d.x, d.z)); });
    await frames(3);
    const f = `${OUT}/rest-0-${view}.png`; await p.screenshot({ path: f, timeout: 300000 }); say('pic', f); res.pics.push(f); }
}
await p.evaluate(() => window.__enc.stage.snap().story.fight.lab.pose(null));
fs.writeFileSync(OUT + '/acts.json', JSON.stringify({ res, errs, logs }, null, 1));
for (const e of errs.slice(0, 10)) say(e);
say('errors', errs.length, 'page lines', logs.length, JSON.stringify(logs.slice(0, 5)));
await b.close();
