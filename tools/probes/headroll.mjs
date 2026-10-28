// v24.5 (tools/probes/headroll.mjs; Chad: "Are you telling me you dont see any problems with how pong head and neck turns?"): Pong in the room,
// kneeling beside the player — how much of a look each of his hips, chest and head takes, his face's error to what he
// looks at, the head's roll, and a photograph from the player's eye at each.
// ENC_DIST=<snapshot> CHROMIUM_PATH=... [VIEW=desktop] [PHASE=work:~fri] OUT=dir node tools/probes/headroll.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/neck'; fs.mkdirSync(OUT, { recursive: true });
const PHONE = (process.env.VIEW || 'phone') === 'phone';
const PHASE = process.env.PHASE || 'work:~fri';
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true } : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's';
await p.goto(PAGE + '?ch=e4c1', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForTimeout(8000);
await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), PHASE);
await p.waitForFunction((ph) => window.__enc.stage.phase === ph.split(/[:~]/)[0], PHASE, { timeout: 600000, polling: 500 });
await p.waitForFunction(() => window.__enc.stage.cast.pongR && window.__enc.stage.cast.pongR.ready, null, { timeout: 600000, polling: 500 });
await p.waitForTimeout(5000);
/* the pose: each of hips, chest (Spine2), neck and head as a world yaw (its own forward, the bone's frame carried from the
   body's forward at rest), the face's yaw and pitch, and the head's roll against the world's up */
const meas = () => p.evaluate(() => {
  const E = window.__enc, S = E.stage, P = S.cast.pongR, V = E.yaw.position.constructor, Q = E.yaw.quaternion.constructor;
  const cam = E.camera, deg = (r) => +(r * 180 / Math.PI).toFixed(1);
  const fwdOf = (bone, local) => { const q = new Q(); bone.updateWorldMatrix(true, false); bone.getWorldQuaternion(q); return local.clone().applyQuaternion(q); };
  if (!P.rest) {   /* each bone's body-forward in its own frame, from the group's forward and the bone at this instant's
                      rest-free reading would need the bind; use the group's forward through the bone's CURRENT frame
                      once, at the first call, before the probe asks for any look (the take's own pose) */
    const gq = new Q(); P.group.getWorldQuaternion(gq); const gf = new V(0, 0, 1).applyQuaternion(gq);
    P.rest = {};
    for (const k of ['hips', 'spine', 'head']) if (P[k]) { const q = new Q(); P[k].getWorldQuaternion(q); P.rest[k] = gf.clone().applyQuaternion(q.invert()).normalize(); }
  }
  const yawOf = (v) => Math.atan2(v.x, v.z), pitchOf = (v) => Math.asin(Math.max(-1, Math.min(1, v.y)));
  const out = { lookW: +P.lookW.toFixed(2), neck: P.neck || null, lookAt: P.lookAt === cam ? 'lens' : P.lookAt ? 'thing' : null,
                spine: P.spine ? P.spine.name : null, head: P.head ? P.head.name : null, faceTurn: P.diag && P.diag.faceTurn };
  const gq = new Q(); P.group.getWorldQuaternion(gq); const body = yawOf(new V(0, 0, 1).applyQuaternion(gq));
  out.body = deg(body);
  for (const k of ['hips', 'spine', 'head']) if (P[k] && P.rest[k]) { const f = fwdOf(P[k], P.rest[k]); out[k] = deg(Math.atan2(Math.sin(yawOf(f) - body), Math.cos(yawOf(f) - body))); }
  const face = fwdOf(P.head, P.faceLocal); out.faceYaw = deg(Math.atan2(Math.sin(yawOf(face) - body), Math.cos(yawOf(face) - body))); out.facePitch = deg(pitchOf(face));
  /* the head's roll: the angle its own up (local +y) leans from the world's up, in the plane across the face */
  const up = fwdOf(P.head, new V(0, 1, 0)); const side = new V().crossVectors(face, new V(0, 1, 0)).normalize();
  out.roll = deg(Math.asin(Math.max(-1, Math.min(1, up.dot(side)))));
  /* the target: where the face should point, and how far it misses */
  const hp = new V(); P.head.getWorldPosition(hp);
  const tp = new V(); (P.lookAt && P.lookAt.isObject3D ? P.lookAt.getWorldPosition(tp) : P.lookAt ? tp.copy(P.lookAt) : cam.getWorldPosition(tp));
  const td = tp.clone().sub(hp).normalize(); out.target = deg(Math.atan2(Math.sin(yawOf(td) - body), Math.cos(yawOf(td) - body)));
  out.miss = deg(face.angleTo(td));
  return out;
});
const frames = (n) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
/* the take alone first (his look let go), so each bone's forward is read off the pose the take holds, then given back */
await p.evaluate(() => { const P = window.__enc.stage.cast.pongR; P.lookSave = P.look; P.look = 0; P.lookAt = null; });
await p.waitForTimeout(5000);
console.log(el(), 'at rest (the take alone)', JSON.stringify(await meas()));
await p.evaluate(() => { const P = window.__enc.stage.cast.pongR; P.look = P.lookSave; });
/* 1 · in play, he looks at the player by himself (look 0.8): the player kneels on his mat; the lens turned onto Pong */
await p.evaluate(() => { const E = window.__enc, S = E.stage, h = new (E.yaw.position.constructor)(); S.cast.pongR.head.getWorldPosition(h);
  const Y = E.yaw; Y.rotation.y = Math.atan2(-(h.x - Y.position.x), -(h.z - Y.position.z)); E.pitch.rotation.x = Math.atan2(h.y - (Y.position.y + E.pitch.position.y), Math.hypot(h.x - Y.position.x, h.z - Y.position.z)); });
await frames(6); await p.waitForTimeout(2500);
console.log(el(), 'play, his own look at the player', JSON.stringify(await meas()));
await p.screenshot({ path: `${OUT}/${PHONE ? 'phone' : 'desk'}-1-play.png`, timeout: 240000 });
/* 2 · the endings' gaze: neck 1.25, weight 1 */
await p.evaluate(() => { const E = window.__enc, P = E.stage.cast.pongR; P.lookAt = E.camera; P.neck = 1.25; P.lookW = 1; });
await frames(6); await p.waitForTimeout(2500);
console.log(el(), 'gaze at the lens', JSON.stringify(await meas()));
await p.screenshot({ path: `${OUT}/${PHONE ? 'phone' : 'desk'}-2-gaze.png`, timeout: 240000 });
/* 3 · to the master */
await p.evaluate(() => { const E = window.__enc, S = E.stage, P = S.cast.pongR; P.lookAt = S.cast.master.head || null; P.neck = null; });
await frames(6); await p.waitForTimeout(2500);
console.log(el(), 'to the master', JSON.stringify(await meas()));
await p.screenshot({ path: `${OUT}/${PHONE ? 'phone' : 'desk'}-3-master.png`, timeout: 240000 });
/* 4 · talking to the player (his answering take ridden on the upper body) while he gazes */
await p.evaluate(() => { const E = window.__enc, S = E.stage, P = S.cast.pongR; P.lookAt = E.camera; P.neck = 1.25; S.person.talk(P, 4.0); });
await frames(6); await p.waitForTimeout(1800);
console.log(el(), 'talking, gaze', JSON.stringify(await meas()));
/* the talk take's head over a cycle: roll and pitch every 0.25 s for 8 s, talking throughout, gazing at the lens */
await p.evaluate(() => { const S = window.__enc.stage; S.person.talk(S.cast.pongR, 12.0); });
{ const rs = []; for (let i = 0; i < 32; i++) { const m = await meas(); rs.push([m.roll, m.facePitch, m.miss]); await p.waitForTimeout(250); }
  const roll = rs.map(r => Math.abs(r[0])); console.log(el(), 'talk cycle: |roll| max', Math.max(...roll), 'mean', +(roll.reduce((a, b) => a + b, 0) / roll.length).toFixed(1), 'pitch max', Math.max(...rs.map(r => r[1])), 'miss max', Math.max(...rs.map(r => r[2])), JSON.stringify(rs.map(r => r[0]))); }
await p.screenshot({ path: `${OUT}/${PHONE ? 'phone' : 'desk'}-4-talk.png`, timeout: 240000 });
/* the same cycle with his look let go: is the tilt the take's own? */
await p.evaluate(() => { const S = window.__enc.stage, P = S.cast.pongR; P.lookAt = null; P.neck = null; P.look = 0; S.person.talk(P, 12.0); });
await p.waitForTimeout(2500);
{ const rs = []; for (let i = 0; i < 32; i++) { const m = await meas(); rs.push([m.roll, m.facePitch, m.faceYaw]); await p.waitForTimeout(250); }
  const roll = rs.map(r => Math.abs(r[0])); console.log(el(), 'talk cycle, NO look: |roll| max', Math.max(...roll), 'mean', +(roll.reduce((a, b) => a + b, 0) / roll.length).toFixed(1), JSON.stringify(rs.map(r => r[0])), 'yaw', JSON.stringify(rs.map(r => r[2]))); }
console.log(el(), 'errs', JSON.stringify(errs));
await b.close();
