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
await p.evaluate(() => { const L = window.__enc.stage.snap().story.fight.lab; if (L.gripOn) L.gripOn(); });   // (the grip is held off until it passes)
await frames(12);
const grip = await p.evaluate(() => { const L = window.__enc.stage.snap().story.fight.lab; return L.grip ? L.grip() : null; });
say('grip', JSON.stringify(grip)); say('page', JSON.stringify(logs));
await p.evaluate(() => { const k = window.__enc.kit; if (k.tag().on) k.tag(null, null); });
/* (his place for the pictures: the court's middle, clear of its walls on both sides; the court's frame: c_cast.js COURT5) */
await p.evaluate(() => { const E = window.__enc, P = E.stage.plan.FLOOR.cast.pho; P.group.position.x = -8.5; P.group.position.z = -9.7; });
const res = { grip, poses: [] };
for (const [name, t] of POSES) {
  await p.evaluate(([n, t]) => window.__enc.stage.snap().story.fight.lab.pose(n === 'rest' ? null : n, t), [name, t]);
  await frames(4);
  for (const view of ['front', 'side', 'hand', 'handout']) {
    const at = await p.evaluate(([view]) => { const E = window.__enc, P = E.stage.plan.FLOOR.cast.pho, V = P.group.position.constructor;
      P.group.updateWorldMatrix(true, true);
      let hb = null; for (const n in P.bone) if (/^(mixamorig:?)?RightHand$/.test(n)) hb = P.bone[n];
      const h = new V(); hb.getWorldPosition(h);
      const g = P.group.position, ry = P.group.rotation.y, fx = Math.sin(ry), fz = Math.cos(ry), lx = Math.cos(ry), lz = -Math.sin(ry);
      let c, tg;
      /* (the fist: a hand's length past the wrist along the hand; the views are taken at the engine's own eye height, which
         it keeps whatever a probe sets, so each is aimed from where the lens really stands) */
      const fist = new V(); { let mb = null; for (const n in P.bone) if (/^(mixamorig:?)?RightHandMiddle1$/.test(n)) mb = P.bone[n]; if (mb) { mb.getWorldPosition(fist); fist.lerp(h, 0.35); } else fist.copy(h); }
      if (view === 'front') { c = new V(g.x + fx * 3.0, 1.35, g.z + fz * 3.0); tg = new V(g.x, 1.0, g.z); }
      else if (view === 'side') { c = new V(g.x - lx * 1.45, 1.3, g.z - lz * 1.45); tg = new V(g.x, 0.95, g.z); }   // (his right side, inside the court's wall)
      else if (view === 'hand') { c = new V(fist.x + fx * 0.85, fist.y, fist.z + fz * 0.85); tg = fist.clone(); }
      else { c = new V(fist.x - lx * 0.85, fist.y, fist.z - lz * 0.85); tg = fist.clone(); }
      E.yaw.position.copy(c); window.__aim = tg;
      return { cam: c.toArray().map(x => +x.toFixed(3)), hand: h.toArray().map(x => +x.toFixed(3)), fist: fist.toArray().map(x => +x.toFixed(3)) }; }, [view]);
    await frames(2);
    await p.evaluate(() => { const E = window.__enc, tg = window.__aim, c = E.yaw.position, d = tg.clone().sub(c);
      E.yaw.rotation.y = Math.atan2(-d.x, -d.z); E.pitch.rotation.x = Math.atan2(d.y, Math.hypot(d.x, d.z)); });
    await frames(3);
    const f = `${OUT}/${name}-${t}-${view}.png`; await p.screenshot({ path: f, timeout: 300000 }); say('pic', f, JSON.stringify(at));
    res.poses.push({ name, t, view, at, file: f });
  }
}
await p.evaluate(() => window.__enc.stage.snap().story.fight.lab.pose(null));
fs.writeFileSync(OUT + '/grip.json', JSON.stringify({ res, errs, logs }, null, 1));
for (const e of errs.slice(0, 10)) say(e);
say('errors', errs.length, 'page lines', logs.length);
await b.close();
