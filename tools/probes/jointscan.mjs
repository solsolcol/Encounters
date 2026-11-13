/* v26.3 · EVERY JOINT AGAINST A REAL BODY, measured (Chad, 13 Nov 2026: "I want a real solution to this stupid blindness of
   yours, not for you to keep apologizing and fixing only when i repeat it"; "Biggest joke ever to see you call that arm
   natural", of the taper woman's arm, her elbow behind her back; "You dont see the problem with the hands and fingers?").
   A picture of a body was judged by its author's eye, which passes what it meant to make. This reads every visible person's
   bones (and the player's own hand) and holds each joint to what a real body can do, or does at rest:
     FINGERS  each joint's bend toward the palm (a knuckle, the middle joint, the end joint), a hinge bent sideways, a joint
              bent backward, a finger folded past what it can; the spread between neighbouring fingers; a hand whose
              fingers are all straight AND spread (a rake), a claw (knuckle back, middle joint curled); the thumb folded
     WRIST    bent toward the palm or the back past its range, or sideways toward the thumb or the little finger
     FOREARM  turned along its length past its range (a palm wrung round: the skin of a forearm twisted)
     ELBOW    folded past its range; behind the body while the hand reaches forward (the taper woman)
     SHOULDER the upper arm pointing back behind the body
     HAND     across the body's middle (a reach across: said, not always a fault)
     KNEE     bent backward
   Ranges are a real adult's (flexion of the wrist to 80 degrees, extension 70, toward the thumb 20, toward the little
   finger 35; the forearm 85 each way from thumb-up; the elbow to 145; the shoulder back to 50; a finger's middle joint
   to 110 and none backward), flagged short of them where a body at rest never goes.
     CHROMIUM_PATH=... [CH=e4c3] [PHASES=",festival,dawn,decide"] [N=4] [SPAN=0.7] [HOLDS="1.5,5.5,9.5"] [WHO=regex]
       [OUT=file.json] node tools/probes/jointscan.mjs
   HOLDS: moments of the taper woman's round to stand her at (the chapter's own probe seam), one sample each, after the
   N sampled on the chapter's clock. WHO: measure only the bodies whose name matches. PRE: a line run in the page (E is the
   engine) once each phase is reached, before anything is measured: to stand a body as an older build had it. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const CH = process.env.CH || 'e4c3', N = +(process.env.N || 4), SPAN = +(process.env.SPAN || 0.7), OUT = process.env.OUT || '/tmp/jointscan.json';
const LIST = (process.env.PHASES != null ? process.env.PHASES : ',festival,dawn,decide').split(',').map(x => x.trim());
const HOLDS = (process.env.HOLDS || '').split(',').map(x => x.trim()).filter(Boolean).map(Number);
const WHO = process.env.WHO || '', PRE = process.env.PRE || '', NAMES = !!process.env.NAMES;
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
const errs = [], warns = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'warning' || m.type() === 'error') warns.push(m.text().slice(0, 300)); });
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
await p.goto(PAGE + '?ch=' + CH, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.dayClock.t > 0.5; } catch { return false; } }, null, { timeout: 600000, polling: 500 });

/* THE MEASURE, in the page: every body once (its bones, whichever of its skins is drawn), in the world */
const MEASURE = ([WHO, NAMES]) => {
  const E = window.__enc, scene = E.scene, V3 = scene.position.constructor; scene.updateMatrixWorld(true);
  if (E.handsRoot) E.handsRoot.updateMatrixWorld(true);
  const D = 180 / Math.PI, v = () => new V3();
  const vis = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
  const names = new Map(), C = (E.stage.dbg && E.stage.dbg.cast) || {};
  for (const k in C) if (C[k] && C[k].group) names.set(C[k].group, 'cast:' + k);
  const nameOf = (o) => { for (let q = o; q; q = q.parent) if (names.has(q)) return names.get(q); return null; };
  const curOf = (o) => { for (const k in C) { const P = C[k]; if (!P || !P.group) continue; for (let q = o; q; q = q.parent) if (q === P.group) return P.cur || ''; } return ''; };
  const bodies = new Map(), skOf = new Map();
  /* (the player's own arms are another rig's names: upper_armL, forearmL, handL, f_index01L .. 03L, thumb01L .. 03L) */
  const FN = { index: 'Index', middle: 'Middle', ring: 'Ring', pinky: 'Pinky' };
  const alias = (nm) => { let m = /^upper_arm([LR])$/.exec(nm); if (m) return (m[1] === 'L' ? 'Left' : 'Right') + 'Arm';
    m = /^forearm([LR])$/.exec(nm); if (m) return (m[1] === 'L' ? 'Left' : 'Right') + 'ForeArm';
    m = /^hand([LR])$/.exec(nm); if (m) return (m[1] === 'L' ? 'Left' : 'Right') + 'Hand';
    m = /^f_(index|middle|ring|pinky)0(\d)([LR])$/.exec(nm); if (m) return (m[3] === 'L' ? 'Left' : 'Right') + 'Hand' + FN[m[1]] + m[2];
    m = /^thumb0(\d)([LR])$/.exec(nm); if (m) return (m[2] === 'L' ? 'Left' : 'Right') + 'HandThumb' + m[1];
    return nm; };
  const take = (o, label) => { if (!o.isSkinnedMesh || !o.skeleton || !vis(o)) return;
    const bones = {}; for (const bn of o.skeleton.bones) { const nm = alias(bn.name.replace(/^mixamorig:?/, '')); if (!bones[nm]) bones[nm] = bn; }
    const key = bones.Hips || bones.RightHand || bones.LeftHand || o.skeleton.bones[0]; if (!key || bodies.has(key)) return;
    let root = o; while (root.parent && root.parent !== scene && !names.has(root) && root.parent.children.length <= 25) root = root.parent;
    const who = label || nameOf(o) || ('crowd ' + (o.name || '?'));
    if (WHO && !new RegExp(WHO).test(who)) return;
    bodies.set(key, { who, cur: curOf(o), at: [+root.position.x.toFixed(2), +root.position.z.toFixed(2)], bones, sk: o.skeleton }); };
  scene.traverse(o => take(o, null));
  if (E.handsRoot) E.handsRoot.traverse(o => take(o, 'player-hand'));
  const Q = scene.quaternion.constructor, M4 = scene.matrixWorld.constructor;
  const bindQ = (sk, b) => { const i = sk.bones.indexOf(b); if (i < 0) return null; const m = new M4().copy(sk.boneInverses[i]).invert(), q = new Q(); m.decompose(v(), q, v()); return q; };
  const worldQ = (b) => { const q = new Q(); b.matrixWorld.decompose(v(), q, v()); return q; };
  /* the turn of `child` against `parent` about the child's own line (axis, in the child's frame), now against at bind:
     a joint that only bends reads 0; a hand wrung round on its forearm reads the wringing */
  const rollOf = (sk, parent, child, axis) => { const pb = bindQ(sk, parent), cb = bindQ(sk, child); if (!pb || !cb || !axis || axis.lengthSq() < 1e-10) return null;
    const qb = pb.clone().invert().multiply(cb), qn = worldQ(parent).invert().multiply(worldQ(child)), d = qb.clone().invert().multiply(qn), a = axis.clone().normalize();
    let t = 2 * Math.atan2(d.x * a.x + d.y * a.y + d.z * a.z, d.w) * D; if (t > 180) t -= 360; if (t < -180) t += 360; return t; };
  const out = [];
  for (const B of bodies.values()) {
    const bn = B.bones, P = (n) => { const x = bn[n]; return x ? x.getWorldPosition(v()) : null; };
    const r = { who: B.who, cur: B.cur, at: B.at, j: {}, flags: [] };
    const flag = (k, val, note) => r.flags.push(k + '=' + (typeof val === 'number' ? +val.toFixed(1) : val) + (note ? ' ' + note : ''));
    /* the torso's frame: up, the body's left, its front (a body made facing +z has its left at +x) */
    let U = null, Lf = null, F = null, mid = null;
    /* (from the bones every body here has, whatever its rig calls its spine: the hip joints and the shoulders) */
    { const lh = P('LeftUpLeg'), rh = P('RightUpLeg'), la = P('LeftArm'), ra = P('RightArm');
      if (lh && rh && la && ra) { mid = la.clone().add(ra).multiplyScalar(0.5); U = mid.clone().sub(lh.clone().add(rh).multiplyScalar(0.5)).normalize();
        Lf = la.clone().sub(ra); Lf.addScaledVector(U, -Lf.dot(U)).normalize(); F = v().crossVectors(Lf, U).normalize(); } }
    if (NAMES) r.names = Object.keys(bn);
    for (const [S0, side] of [['Left', 1], ['Right', -1]]) {
      const sh = P(S0 + 'Arm'), el = P(S0 + 'ForeArm'), wr = P(S0 + 'Hand'); if (!wr) continue;
      const J = r.j[S0[0]] = {};
      const i1 = P(S0 + 'HandIndex1'), m1 = P(S0 + 'HandMiddle1'), k1 = P(S0 + 'HandPinky1') || P(S0 + 'HandRing1');
      let n = null, f = null, rad = null;
      if (i1 && m1 && k1) { f = m1.clone().sub(wr).normalize(); const ac = i1.clone().sub(k1); ac.addScaledVector(f, -ac.dot(f)).normalize();
        n = v().crossVectors(f, ac).multiplyScalar(side).normalize(); rad = ac; }                  // n: the way the palm faces; rad: toward the thumb
      /* the arm */
      if (sh && el) { const u = el.clone().sub(sh).normalize(), e = wr.clone().sub(el).normalize();
        const phi = Math.acos(Math.max(-1, Math.min(1, u.dot(e)))) * D; J.elbow = +phi.toFixed(1);
        if (phi > 150) flag(S0[0] + '.elbow.fold', phi);
        if (F) { const eb = el.clone().sub(sh).dot(F), hf = wr.clone().sub(sh).dot(F); J.elbowFwd = +eb.toFixed(3); J.handFwd = +hf.toFixed(3);
          if (eb < -0.025 && hf > 0.1) flag(S0[0] + '.elbow.behind', eb * 100, 'cm behind the shoulder while the hand is ' + (hf * 100).toFixed(0) + ' cm before it');
          /* (thrown back: read only on an arm below the level, a raised arm being no extension; a runner's back swing
             reaches 45, a real shoulder's limit is near 60) */
          const ext = Math.atan2(-u.dot(F), -u.dot(U)) * D; J.shoulderBack = +ext.toFixed(1); if (ext > 55 && -u.dot(U) > 0.2) flag(S0[0] + '.shoulder.back', ext);
          const lat = wr.clone().sub(mid).dot(Lf) * side; J.handOut = +lat.toFixed(3); if (lat < -0.1) flag(S0[0] + '.hand.across', lat * 100, 'cm past the middle'); }
        if (n) {
          /* the wrist: the fingers' line against the forearm's, toward the palm (+) or the back, toward the thumb (+) or the little finger */
          const ne = n.clone().addScaledVector(e, -n.dot(e)).normalize(), re = rad.clone().addScaledVector(e, -rad.dot(e)).normalize();
          const wf = Math.atan2(f.dot(ne), f.dot(e)) * D, wd = Math.atan2(f.dot(re), f.dot(e)) * D; J.wristFlex = +wf.toFixed(1); J.wristDev = +wd.toFixed(1);
          if (wf > 70) flag(S0[0] + '.wrist.flexed', wf); if (wf < -60) flag(S0[0] + '.wrist.bentBack', wf);
          if (wd > 25) flag(S0[0] + '.wrist.toThumb', wd); if (wd < -40) flag(S0[0] + '.wrist.toLittle', wd);
          /* the forearm's turn along its length: 0 with the thumb up (the palm toward the body's middle), +90 the palm down
             (toward the upper arm's side), -90 up; only read with the elbow bent, where the hinge names a side */
          if (phi > 25) { const h = v().crossVectors(u, e).normalize(), med = h.clone().multiplyScalar(side), dn = u.clone().addScaledVector(e, -u.dot(e)).normalize();
            const tw = Math.atan2(ne.dot(dn), ne.dot(med)) * D; J.forearmTurn = +tw.toFixed(1); if (Math.abs(tw) > 100) flag(S0[0] + '.forearm.wrung', tw); } } }
      /* the rolls (the skin over a joint wrung when a bone turns on its own line against its parent beyond what the
         forearm's two bones give: a rig with no twist bones carries the forearm's whole turn at the elbow or the wrist) */
      if (bn[S0 + 'ForeArm'] && bn[S0 + 'Arm'] && bn[S0 + 'Hand']) {
        const er = rollOf(B.sk, bn[S0 + 'Arm'], bn[S0 + 'ForeArm'], bn[S0 + 'Hand'].position.clone());
        const mid1 = bn[S0 + 'HandMiddle1'] && bn[S0 + 'HandMiddle1'].parent === bn[S0 + 'Hand'] ? bn[S0 + 'HandMiddle1'].position.clone() : null;
        const wr2 = mid1 ? rollOf(B.sk, bn[S0 + 'ForeArm'], bn[S0 + 'Hand'], mid1) : null;
        if (er != null) { J.elbowRoll = +er.toFixed(1); if (Math.abs(er) > 70) flag(S0[0] + '.elbow.wrung', er); }
        if (wr2 != null) { J.wristRoll = +wr2.toFixed(1); if (Math.abs(wr2) > 50) flag(S0[0] + '.wrist.wrung', wr2); } }
      /* the fingers */
      if (n) { const segs = [], straight = [], kl = rad ? rad.clone() : null;
        for (const fn of ['Index', 'Middle', 'Ring', 'Pinky']) {
          const p1 = P(S0 + 'Hand' + fn + '1'), p2 = P(S0 + 'Hand' + fn + '2'), p3 = P(S0 + 'Hand' + fn + '3'); if (!p1 || !p2 || !p3) continue;
          let p4 = P(S0 + 'Hand' + fn + '4');
          const mc = p1.clone().sub(wr).normalize(), s1 = p2.clone().sub(p1), s2 = p3.clone().sub(p2); if (s1.length() < 1e-4 || s2.length() < 1e-4) continue;
          s1.normalize(); s2.normalize();
          let s3 = null; if (p4) { s3 = p4.clone().sub(p3); if (s3.length() < 1e-4) s3 = null; else s3.normalize(); }
          if (!s3) { const b3 = bn[S0 + 'Hand' + fn + '3'], e3 = b3.matrixWorld.elements; s3 = v().set(e3[4], e3[5], e3[6]); if (s3.length() < 1e-6) s3 = null; else { s3.normalize(); if (s3.dot(s2) < 0) s3.negate(); } }
          const nm = n.clone().addScaledVector(mc, -n.dot(mc)).normalize();
          const mcp = Math.atan2(s1.dot(nm), s1.dot(mc)) * D;
          const p1n = n.clone().addScaledVector(s1, -n.dot(s1)).normalize(), h1 = v().crossVectors(s1, p1n).normalize();
          const pip = Math.atan2(s2.dot(p1n), s2.dot(s1)) * D, pipS = Math.asin(Math.max(-1, Math.min(1, s2.dot(h1)))) * D;
          let dip = null, dipS = null;
          if (s3) { const p2n = v().crossVectors(h1, s2).normalize(); dip = Math.atan2(s3.dot(p2n), s3.dot(s2)) * D; dipS = Math.asin(Math.max(-1, Math.min(1, s3.dot(h1)))) * D; }
          J[fn] = [+mcp.toFixed(0), +pip.toFixed(0), dip == null ? null : +dip.toFixed(0), +pipS.toFixed(0), dipS == null ? null : +dipS.toFixed(0)];
          if (pip < -10 || (dip != null && dip < -15) || mcp < -35) flag(S0[0] + '.' + fn + '.backward', Math.min(pip, dip == null ? 0 : dip, mcp + 25));
          /* SIDEWAYS: a finger's middle and end joints are hinges whose axes lie along the knuckles' line (the ring and the
             little finger's lean toward the thumb as they close, so they are given more); a joint whose bend stands
             across that line is a finger bent sideways, and two joints bending in different planes a zigzag */
          /* (the deflection itself, in degrees: the next bone's turn toward the knuckles' line, out of the hinge's plane. A
             joint that bends only as a hinge reads 0 however far it bends; the ring and the little finger, which close at a
             slant toward the thumb, are allowed more) */
          const sideOf = (a1, a2) => { if (!kl) return null; const k = kl.clone().addScaledVector(a1, -kl.dot(a1)); if (k.lengthSq() < 1e-8) return null; k.normalize(); return Math.asin(Math.min(1, Math.abs(a2.dot(k)))) * D; };
          const d1 = sideOf(s1, s2), d2 = s3 ? sideOf(s2, s3) : null, lim = fn === 'Ring' || fn === 'Pinky' ? 25 : 15;
          J[fn].push(d1 == null ? null : +d1.toFixed(0), d2 == null ? null : +d2.toFixed(0));
          if ((d1 != null && d1 > lim) || (d2 != null && d2 > lim)) flag(S0[0] + '.' + fn + '.sideways', Math.max(d1 || 0, d2 || 0), 'deg bent sideways');
          if (pip > 115 || (dip != null && dip > 95) || mcp > 100) flag(S0[0] + '.' + fn + '.folded', Math.max(pip, dip || 0, mcp));
          if (mcp < -10 && pip > 45) flag(S0[0] + '.' + fn + '.claw', pip, 'knuckle ' + mcp.toFixed(0));
          const q = s1.clone().addScaledVector(n, -s1.dot(n)).normalize(); segs.push(q); straight.push(Math.max(0, pip) + Math.max(0, dip || 0)); }
        if (segs.length >= 3) { const sp = []; for (let i = 0; i + 1 < segs.length; i++) sp.push(Math.acos(Math.max(-1, Math.min(1, segs[i].dot(segs[i + 1])))) * D);
          const spM = sp.reduce((x, y) => x + y, 0) / sp.length, spX = Math.max(...sp), curl = straight.reduce((x, y) => x + y, 0) / straight.length;
          J.spread = sp.map(x => +x.toFixed(0)); J.curl = +curl.toFixed(0);
          if (curl < 20 && spM > 10) flag(S0[0] + '.hand.rake', spM, 'deg between fingers, all but straight (curl ' + curl.toFixed(0) + ')');
          /* (gaps: fingers held apart, as a hand at rest on something never holds them; a gesture may) */
          if (spX > 12 && curl < 50) flag(S0[0] + '.hand.gaps', spX, 'deg between two fingers (curl ' + curl.toFixed(0) + ')');
          if (spX > 25) flag(S0[0] + '.hand.splayed', spX); }
        const t1 = P(S0 + 'HandThumb1'), t2 = P(S0 + 'HandThumb2'), t3 = P(S0 + 'HandThumb3'), t4 = P(S0 + 'HandThumb4');
        if (t1 && t2 && t3) { const a1 = t2.clone().sub(t1).normalize(), a2 = t3.clone().sub(t2).normalize(); const b1 = Math.acos(Math.max(-1, Math.min(1, a1.dot(a2)))) * D; let b2 = null;
          if (t4) { const a3 = t4.clone().sub(t3); if (a3.length() > 1e-4) { a3.normalize(); b2 = Math.acos(Math.max(-1, Math.min(1, a2.dot(a3)))) * D; } }
          J.thumb = [+b1.toFixed(0), b2 == null ? null : +b2.toFixed(0)]; if (b1 > 100 || (b2 != null && b2 > 100)) flag(S0[0] + '.thumb.folded', Math.max(b1, b2 || 0)); } }
      /* the knee */
      const hp = P(S0 + 'UpLeg'), kn = P(S0 + 'Leg'), an = P(S0 + 'Foot'), to = P(S0 + 'ToeBase');
      if (hp && kn && an && to) { const l = an.clone().sub(hp).normalize(), t = to.clone().sub(an); t.addScaledVector(l, -t.dot(l)); if (t.length() > 1e-4) { t.normalize();
        const off = kn.clone().sub(hp).dot(t), ka = Math.acos(Math.max(-1, Math.min(1, kn.clone().sub(hp).normalize().dot(an.clone().sub(kn).normalize())))) * D;
        J.knee = +ka.toFixed(0); J.kneeFwd = +off.toFixed(3); if (off < -0.015 && ka > 4 && ka < 25) flag(S0[0] + '.knee.backward', off * 100, 'cm behind the line from hip to ankle'); } }
    }
    out.push(r);
  }
  return out;
};

const res = { phases: {} };
const sample = async (tag) => { const rows = await p.evaluate(MEASURE, [WHO, NAMES]); return rows.map(r => Object.assign(r, { tag })); };
for (const ph of LIST) {
  if (ph) { await p.evaluate((ph) => { const E = window.__enc; if (E.cine && E.cine.active && E.cine.active() && E.cine.skip) E.cine.skip(); E.stage.reset(); E.kit.setPhase(ph); }, ph);
    await p.waitForFunction((ph) => { const E = window.__enc; return E.stage.info().phase === ph.split(':')[0] && E.stage.dayClock.t > 0.3 && !(E.cine && E.cine.active && E.cine.active()); }, ph, { timeout: 600000, polling: 300 }).catch(() => log('phase', ph, 'not reached as play'));
  }
  await p.waitForFunction(() => { try { const i = window.__enc.stage.info(); return !i.waiting || !i.waiting.length; } catch { return false; } }, null, { timeout: 600000, polling: 1000 }).catch(() => {});
  if (PRE) log('PRE', await p.evaluate((s) => { const E = window.__enc; return String(eval(s)); }, PRE));
  const all = [];
  for (let k = 0; k < N; k++) {
    const t0 = await p.evaluate(() => window.__enc.stage.dayClock.t);
    await p.waitForFunction(([t0, s]) => window.__enc.stage.dayClock.t >= t0 + s, [t0, SPAN], { timeout: 300000, polling: 200 }).catch(() => {});
    await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    all.push(...await sample('t' + k)); }
  for (const h of HOLDS) {
    const ok = await p.evaluate((h) => { const T = window.__enc.stage.dbg && window.__enc.stage.dbg.taper; if (!T) return false; T.hold = h; return true; }, h);
    if (!ok) continue;
    await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(r)))));
    all.push(...await sample('hold' + h)); }
  if (HOLDS.length) await p.evaluate(() => { const T = window.__enc.stage.dbg && window.__enc.stage.dbg.taper; if (T) T.hold = null; });
  /* each body's flags, with the moments they were seen at; and one full reading of each body to read beside them */
  const by = new Map();
  for (const r of all) { const key = r.who + '@' + r.at.join(','); let w = by.get(key); if (!w) by.set(key, w = { who: r.who, at: r.at, cur: new Set(), flags: new Map(), first: r });
    w.cur.add(r.cur); for (const fl of r.flags) { const k = fl.split('=')[0]; if (!w.flags.has(k)) w.flags.set(k, []); w.flags.get(k).push(r.tag + ':' + fl.split('=').slice(1).join('=')); } }
  const rows = [...by.values()].map(w => ({ who: w.who, at: w.at, takes: [...w.cur].filter(Boolean), flags: Object.fromEntries(w.flags), j: w.first.j, names: w.first.names }));
  res.phases[ph || 'start'] = rows;
  const bad = rows.filter(r => Object.keys(r.flags).length);
  log(ph || 'start', rows.length, 'bodies;', bad.length, 'with a joint a real body would not hold');
  for (const r of bad) log('   ', r.who, '@', r.at.join(','), r.takes.join('/'), JSON.stringify(r.flags));
}
res.warns = warns; res.errs = errs; fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
console.log('errs', JSON.stringify(errs));
await b.close();
