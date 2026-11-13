/* v26.3 · HOW FAR A HEAD TURNS, measured on the body that wears the take (Chad, 13 Nov 2026: "for the audience looking
   left and right, i think the angle to left and right is too extreme, and can be slightly restrained"; "When grandmaster
   pho talks, his head also moves too much to the right, i think the head movement can be greatly restrained"). For each
   [castKey, take] named, the take is posed at every STEP seconds of its window (or its whole length) on that person, and
   at each the face's direction (the head's turn since its bind, on +z: v6.8) is written as yaw and pitch in degrees
   against the person's own front, and against the chest's (how much the neck and head do, apart from the body); then the
   range of each, and the same read with the person's own play applied (what the game draws: P.headDamp, if any).
     CHROMIUM_PATH=... [CH=e4c3] [STEP=0.1] [OUT=file.json] node tools/probes/headturn.mjs "ym:seiza" "pho:Sitting_Answering_Questions" */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const CH = process.env.CH || 'e4c3', STEP = +(process.env.STEP || 0.1), OUT = process.env.OUT || '/tmp/headturn.json';
const LIST = process.argv.slice(2).map(a => a.split(':'));
const b = await chromium.launch(LAUNCH);
const p = await (await b.newContext({ viewport: { width: 960, height: 540 } })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(PAGE + '?ch=' + CH, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.dayClock.t > 0.5; } catch { return false; } }, null, { timeout: 600000, polling: 500 });
const res = {};
for (const [key, take] of LIST) {
  res[key + ':' + take] = await p.evaluate(([key, take, STEP]) => {
    const E = window.__enc, P = E.stage.dbg.cast[key]; if (!P || !P.ready || !P.acts[take]) return 'no such person or take';
    const Q = E.scene.quaternion.constructor, V = E.scene.position.constructor;
    const keep = {}; for (const k in P.acts) keep[k] = [P.acts[k].getEffectiveWeight(), P.acts[k].time, P.acts[k].timeScale];
    const w0 = Object.assign({}, P.w), win = P.win && P.win[take], A = P.acts[take], d = A.getClip().duration;
    const chest = (() => { for (const n in P.bone) if (/^(mixamorig:?)?Spine2$/.test(n)) return P.bone[n]; for (const n in P.bone) if (/^(mixamorig:?)?Spine1$/.test(n)) return P.bone[n]; return null; })();
    const gq = new Q(), hq = new Q(), cq = new Q(), f = new V(), out = [];
    const ang = (q) => { f.set(0, 0, 1).applyQuaternion(q); return [Math.atan2(f.x, f.z) * 180 / Math.PI, Math.asin(Math.max(-1, Math.min(1, f.y))) * 180 / Math.PI]; };
    const from = win ? win[0] : 0, len = win ? win[1] : d;
    for (const k in P.acts) P.acts[k].setEffectiveWeight(k === take ? 1 : 0);
    for (const k in P.w) P.w[k] = k === take ? 1 : 0;
    for (let u = 0; u <= len + 1e-6; u += STEP) { A.time = ((from + u) % d + d) % d; P.mixer.update(0);
      if (E.stage.dbg.headDampLay) E.stage.dbg.headDampLay(P);
      P.group.updateWorldMatrix(true, true);
      P.group.getWorldQuaternion(gq).invert(); P.head.getWorldQuaternion(hq); const qh = gq.clone().multiply(hq).multiply(P.headRest);
      const [yaw, pitch] = ang(qh);
      let cy = null; if (chest) { chest.getWorldQuaternion(cq); const qc = gq.clone().multiply(cq).multiply(P.headRest); cy = ang(qc)[0]; }
      out.push([+(from + u).toFixed(2), +yaw.toFixed(1), +pitch.toFixed(1), cy == null ? null : +(yaw - cy).toFixed(1)]); }
    for (const k in P.acts) { P.acts[k].setEffectiveWeight(keep[k][0]); P.acts[k].time = keep[k][1]; P.acts[k].timeScale = keep[k][2]; }
    Object.assign(P.w, w0); P.mixer.update(0);
    const col = (i) => out.map(r => r[i]).filter(v => v != null), rg = (a) => [Math.min(...a), Math.max(...a)];
    return { win: win || null, dur: +d.toFixed(2), yaw: rg(col(1)), pitch: rg(col(2)), neckYaw: rg(col(3)), samples: out };
  }, [key, take, STEP]);
  const r = res[key + ':' + take];
  console.log(key, take, typeof r === 'string' ? r : `window ${JSON.stringify(r.win)} of ${r.dur} s: face yaw ${r.yaw[0]}..${r.yaw[1]} deg, pitch ${r.pitch[0]}..${r.pitch[1]}, the neck and head's own yaw ${r.neckYaw[0]}..${r.neckYaw[1]}`);
}
fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
console.log('errs', JSON.stringify(errs.slice(0, 5)));
await b.close();
