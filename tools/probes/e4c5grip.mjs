/* v28.0 (E4C5, R25/R26): HIS HAND CLOSED ROUND THE NAGA STICK, photographed. On a phone page (390 x 844 at 2, a touch
   context): the fight set out and its brief taken down through the fight's lab, the stick in his hand (the fight gives it
   him), his grip's solve read (lab.grip: each joint's turn in degrees); then for each of his takes the fight plays (his
   rest, his walk and run, the throw's top, the gold's crouch and top, the bag's draw: lab.pose holds him there, the grip
   laid as every drawing lays it) the tag mode is left and he is photographed full size: from his front at 3.0 m, from his
   right side at 2.6 m, and his right hand from 0.5 m (in front of it and from outside it). OUT/grip.json holds the
   report and every place; the pictures are OUT/<pose>-<view>.png.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [POSES=name@t,...] node tools/probes/e4c5grip.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5grip';
fs.mkdirSync(OUT, { recursive: true });
const POSES = (process.env.POSES || 'rest@0,Running@0.3,mage_soell_cast_7@0.95,Charged_Spell_Cast@1.0,Charged_Spell_Cast@2.0,mage_soell_cast_8@0.4').split(',').map(s => { const [n, t] = s.split('@'); return [n, +t]; });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [], logs = [];
/* (CHFILE=<file.js>: the chapter served from that file, as e4c5films.mjs: a change to the chapter alone photographed with no build) */
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
/* (GRIP=0: the stick as the build ships it, the grip left off, for a picture of how it stands today) */
if (process.env.GRIP !== '0') await p.evaluate(() => { const L = window.__enc.stage.snap().story.fight.lab; if (L.gripOn) L.gripOn(); });   // (the grip is held off until it passes)
/* (TUNE='{"tilt":5,...}': one of the settings e4c5gripfit.mjs tried, photographed before it is written in) */
if (process.env.TUNE) say('tuned', JSON.stringify(await p.evaluate((T) => window.__enc.stage.snap().story.fight.lab.gripTune(T), JSON.parse(process.env.TUNE))));
await frames(12);
const grip = await p.evaluate(() => { const L = window.__enc.stage.snap().story.fight.lab; return L.grip ? L.grip() : null; });
say('grip', JSON.stringify(grip)); say('page', JSON.stringify(logs));
await p.evaluate(() => { const k = window.__enc.kit; if (k.tag().on) k.tag(null, null); });
/* (his place for the pictures: the court's middle, clear of its walls on both sides; the court's frame: c_cast.js COURT5) */
/* (KEEP=1: photographed where the fight stands him, as a clipscan lead found him; else the court's middle) */
if (process.env.KEEP !== '1') await p.evaluate(() => { const E = window.__enc, P = E.stage.plan.FLOOR.cast.pho; P.group.position.x = -8.5; P.group.position.z = -9.7;
  /* (his student stood 0.3 m before him there: set aside, clear of every view, at the court's far corner on his left) */
  const Z = E.stage.plan.FLOOR.cast.zav; if (Z) { Z.group.position.x = -6.9; Z.group.position.z = -11.4; } });
if (process.env.GHOST === '1') await p.evaluate(() => { window.__ghost = true; });
const res = { grip, poses: [] };
/* (TUNES='[{...},{...}]': the poses photographed again under each further setting of the grip, in the same boot, each
   picture named with its setting's number: one boot, several settings compared) */
const TUNES = process.env.TUNES ? JSON.parse(process.env.TUNES) : [];
for (let pass = 0; pass <= TUNES.length; pass++) {
if (pass > 0) { say('tuned', pass, JSON.stringify(await p.evaluate((T) => window.__enc.stage.snap().story.fight.lab.gripTune(T), TUNES[pass - 1]))); await frames(6); }
for (const [name0, t] of POSES) { const name = pass ? name0 + '-T' + pass : name0;
  await p.evaluate(([n, t]) => window.__enc.stage.snap().story.fight.lab.pose(n === 'rest' ? null : n, t), [name0, t]);
  await frames(4);
  /* HIS SKIN ON THE SHAFT, measured: every point of his skin whose heaviest bone is his right hand's (its palm, or a finger:
     the family named), skinned as drawn (the grip is laid in each drawing and stands between drawings), taken into the
     stick's own frame and set against the shaft's line (its middle 8.2 cm along x, 0.3 cm along -z, radius 3.6 cm; its own
     radius there 3.3 to 3.7) from 0.85 to 1.35 m up it: how many points stand INSIDE it (more than 3 mm in), how deep the
     deepest, how near each family comes (its gap: under 0 is in), and how many points lie on it (within 1 cm) */
  const contact = await p.evaluate(() => { const E = window.__enc, P = E.stage.plan.FLOOR.cast.pho, g = E.stage.things && E.stage.things.nagaStaff;
    if (!g) return { err: 'no stick' };
    const V = P.group.position.constructor, M4 = g.matrixWorld.constructor;
    P.group.updateWorldMatrix(true, true); g.updateWorldMatrix(true, false);
    const inv = new M4().copy(g.matrixWorld).invert(), ws = new V().setFromMatrixColumn(g.matrixWorld, 0).length();
    const R = 0.036, CX = 0.082, CZ = -0.003, per = {}; let n = 0, inside = 0, deep = 0;
    P.group.traverse(o => { if (!o.isSkinnedMesh || !o.visible) return;
      const sk = o.skeleton, A = o.geometry.attributes, si = A.skinIndex, sw = A.skinWeight, cnt = A.position.count;
      const fam = sk.bones.map(b => { const m = /RightHand(Thumb|Index|Middle|Ring|Pinky)?\d*$/.exec(b.name); return m ? (m[1] || 'Palm') : null; });
      if (!fam.some(Boolean)) return;
      const v = new V();
      for (let i = 0; i < cnt; i++) { let best = -1, bw = 0; for (let q = 0; q < 4; q++) { const w = sw.getComponent(i, q); if (w > bw) { bw = w; best = si.getComponent(i, q); } }
        const f = best >= 0 ? fam[best] : null; if (!f) continue;
        o.getVertexPosition(i, v); v.applyMatrix4(o.matrixWorld).applyMatrix4(inv);
        if (v.y < 0.85 || v.y > 1.35) { const F = per[f] || (per[f] = { n: 0, out: 0, inside: 0, deep: 0, gap: 1, on: 0 }); F.out++; continue; }
        const d = (Math.hypot(v.x - CX, v.z - CZ) - R) * ws;
        const F = per[f] || (per[f] = { n: 0, out: 0, inside: 0, deep: 0, gap: 1, on: 0 });
        F.n++; n++; if (d < -0.003) { F.inside++; inside++; } if (-d > F.deep) F.deep = -d; if (-d > deep) deep = -d; if (d < F.gap) F.gap = d; if (Math.abs(d) < 0.01) F.on++; (F.ds = F.ds || []).push(d); } });
    for (const f in per) { const F = per[f]; F.deep = +(F.deep * 100).toFixed(2); F.gap = +(F.gap * 100).toFixed(2);
      /* (how far its skin stands off the shaft: its median and its 90th point, cm; a finger closed round the shaft keeps its
         whole skin within a finger's thickness of it, one that juts past it does not) */
      if (F.ds) { const q = F.ds.slice().sort((x, y) => x - y), at = (u) => +(q[Math.min(q.length - 1, Math.floor(u * q.length))] * 100).toFixed(2); F.med = at(0.5); F.p90 = at(0.9); F.far = at(1); delete F.ds; } }
    return { ws: +ws.toFixed(4), n, inside, deepCm: +(deep * 100).toFixed(2), per }; });
  say('contact', name, t, JSON.stringify(contact));
  res.poses.push({ name, t, contact });
  for (const view of (process.env.VIEWS || 'front,side,hand,handout').split(',')) {
    const at = await p.evaluate(([view]) => { const E = window.__enc, P = E.stage.plan.FLOOR.cast.pho, V = P.group.position.constructor;
      P.group.updateWorldMatrix(true, true);
      let hb = null; for (const n in P.bone) if (/^(mixamorig:?)?RightHand$/.test(n)) hb = P.bone[n];
      const h = new V(); hb.getWorldPosition(h);
      const g = P.group.position, ry = P.group.rotation.y, fx = Math.sin(ry), fz = Math.cos(ry), lx = Math.cos(ry), lz = -Math.sin(ry);
      let c, tg;
      /* (the fist: a hand's length past the wrist along the hand; the views are taken at the engine's own eye height, which
         it keeps whatever a probe sets, so each is aimed from where the lens really stands) */
      const fist = new V(); { let mb = null; for (const n in P.bone) if (/^(mixamorig:?)?RightHandMiddle1$/.test(n)) mb = P.bone[n]; if (mb) { mb.getWorldPosition(fist); fist.lerp(h, 0.35); } else fist.copy(h); }
      if (view === 'nine') { c = new V(-8.5, 2.3, -10.4); tg = new V(-8.5, 0.7, -6.4); }   // (the court's far end, the nine where the brief stands them)
      else if (view === 'front') { c = new V(g.x + fx * 3.0, 1.35, g.z + fz * 3.0); tg = new V(g.x, 1.0, g.z); }
      else if (view === 'side') { c = new V(g.x - lx * 1.45, 1.3, g.z - lz * 1.45); tg = new V(g.x, 0.95, g.z); }   // (his right side, inside the court's wall)
      /* (back: from 3.0 m behind him; backclose: 1.2 m behind his right shoulder blade, where R28's brown bits were, through a
         30 degree lens) */
      else if (view === 'back') { c = new V(g.x - fx * 3.0, 1.45, g.z - fz * 3.0); tg = new V(g.x, 1.1, g.z); }
      else if (view === 'backclose') { c = new V(g.x - fx * 1.2 - lx * 0.2, 1.5, g.z - fz * 1.2 - lz * 0.2); tg = new V(g.x - fx * 0.08 - lx * 0.13, 1.33, g.z - fz * 0.08 - lz * 0.13); }
      else if (view === 'hand') { c = new V(fist.x + fx * 0.9, fist.y + 0.12, fist.z + fz * 0.9); tg = fist.clone(); }   // (a little above: as a man standing before him sees it)
      /* (below: looking straight up the stick through his fist, so the fingers closing round it show as a ring round the shaft) */
      else if (view === 'below') { const g = E.stage.things && E.stage.things.nagaStaff, up = new V(0, 1, 0); if (g) { g.updateWorldMatrix(true, false); up.setFromMatrixColumn(g.matrixWorld, 1).normalize(); }
        c = fist.clone().addScaledVector(up, -0.42).add(new V(fx * 0.04, 0, fz * 0.04)); tg = fist.clone(); }
      else { c = new V(fist.x - lx * 0.9, fist.y + 0.12, fist.z - lz * 0.9); tg = fist.clone(); }
      E.yaw.position.copy(c); window.__aim = tg;
      /* (the hand's two views through a narrower lens, 22 degrees: a detail taken with a lens, never by enlarging; the body's
         two through the game's own) */
      if (E.kit.lens) E.kit.lens(view === 'hand' || view === 'handout' ? 22 : view === 'below' ? 40 : view === 'backclose' ? 30 : null, { secs: 0 });
      /* (GHOST=1: in the hand's two views the stick drawn see-through, so a finger behind it or inside it shows where it is) */
      { const g = E.stage.things && E.stage.things.nagaStaff, gh = window.__ghost && (view === 'hand' || view === 'handout' || view === 'below');
        if (g) g.traverse(o => { if (!o.isMesh || !o.material) return; const m = o.material; if (m.__op == null) { m.__op = m.opacity; m.__tr = m.transparent; m.__dw = m.depthWrite; }
          m.transparent = gh ? true : m.__tr; m.opacity = gh ? 0.38 : m.__op; m.depthWrite = gh ? false : m.__dw; m.needsUpdate = true; }); }
      return { cam: c.toArray().map(x => +x.toFixed(3)), hand: h.toArray().map(x => +x.toFixed(3)), fist: fist.toArray().map(x => +x.toFixed(3)) }; }, [view]);
    await frames(2);
    await p.evaluate(() => { const E = window.__enc, tg = window.__aim, c = E.yaw.position, d = tg.clone().sub(c);
      E.yaw.rotation.y = Math.atan2(-d.x, -d.z); E.pitch.rotation.x = Math.atan2(d.y, Math.hypot(d.x, d.z)); });
    await frames(3);
    const f = `${OUT}/${name}-${t}-${view}.png`; await p.screenshot({ path: f, timeout: 300000 }); say('pic', f, JSON.stringify(at));
    res.poses.push({ name, t, view, at, file: f });
  }
}
}
await p.evaluate(() => window.__enc.stage.snap().story.fight.lab.pose(null));
fs.writeFileSync(OUT + '/grip.json', JSON.stringify({ res, errs, logs }, null, 1));
for (const e of errs.slice(0, 10)) say(e);
say('errors', errs.length, 'page lines', logs.length);
await b.close();
