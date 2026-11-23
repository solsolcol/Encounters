/* v28.0 (E4C5, R35 and R36): BOTH MEN'S HANDS AND ARMS, in every take this chapter plays them in, MEASURED and PHOTOGRAPHED
   close. Chad, R35: "The fingers, wrists, and arms of both zavier and pho models still look very wrong in many of the poses.
   Especially pho's fingers are all mangled up"; R36: "Do you see one finger going the other way on pho's hands?". His rule of
   v26.3: a body is never called right from a picture alone; every joint is measured against a real body, and every hand
   is seen full size. On a page of 1000 x 1000 at one pixel a point (a lab view: no HUD in the way, each hand filling it):
     the fight set out through its lab (Grandmaster Pho holding the Naga stick, as in every moment of the fight), then each
     take of each man posed at N moments over its length (lab.pose for him, lab.zpose for Master Zavier), and at each:
       JOINTS  jointscan.mjs's own measure (read from that file, so the two never differ) on both men: every finger joint
               (bent sideways, backward, past its range), each wrist, forearm, elbow and shoulder against a real body's;
     and at PICS moments of each take (its middle by default), each man's two hands photographed from 0.42 m, a 24 degree
     lens, from the back of the hand and from the palm's side (the palm's facing read from his own rig: c_cast.js armsOf),
     the tag mode left so the lens is the probe's, every effect of the fight cleared.
   OUT/hands.json holds every row (flags first); the pictures are OUT/<who>-<take>-<t>-<L|R>-<back|palm>.png.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [CHFILE=<chapter.js>] [OUT=dir] [WHO=pho,zav] [TAKES=a,b] [N=5] [PICS=1|0]
       [AT=0.5] (the share of each take's length its pictures are taken at; several: AT=0.3,0.7) node tools/probes/e4c5hands.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5hands'; fs.mkdirSync(OUT, { recursive: true });
const N = +(process.env.N || 5), PICS = process.env.PICS !== '0', AT = (process.env.AT || '0.5').split(',').map(Number);
const WHO = (process.env.WHO || 'pho,zav').split(',');
/* the takes each man plays in this chapter (c_yfilm.js, c_fightstage.js, c_cast.js, c_play.js: every name they cue) */
const PLAN = {
  pho: ['Walking', 'Running', 'Talk_with_Hands_Open', 'Charged_Spell_Cast', 'Charged_Spell_Cast_1', 'mage_soell_cast_3', 'mage_soell_cast_7', 'mage_soell_cast_8',
        'Sitting_Answering_Questions', 'Sit_to_Stand_Transition_M', 'Sit_Cheer_with_Left_Hand'],
  zav: ['Idle_3', 'Walking', 'Running', 'mage_soell_cast_3', 'mage_soell_cast_6', 'Alert']
};
const ONLY = process.env.TAKES ? process.env.TAKES.split(',') : null;
/* the measure of a body's joints: jointscan.mjs's, word for word */
const JS = fs.readFileSync(new URL('./jointscan.mjs', import.meta.url), 'utf8');
const j0 = JS.indexOf('\nconst MEASURE = '), j1 = JS.indexOf('\n};\n', j0);
if (j0 < 0 || j1 < 0) throw new Error('e4c5hands: jointscan.mjs no longer has its MEASURE where this reads it');
const MEASURE_SRC = JS.slice(j0 + '\nconst MEASURE = '.length, j1 + 2);
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 1000, height: 1000 }, deviceScaleFactor: 1, hasTouch: true, isMobile: false });
const p = await ctx.newPage(); const errs = [], logs = [];
if (process.env.CHFILE) { const src = fs.readFileSync(process.env.CHFILE, 'utf8'); await p.route(new RegExp('/assets/e4c5\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: src })); }
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { const t = m.text(); if (/PHOGRIP5|HANDS5|threw|has no take/i.test(t) || m.type() === 'error') logs.push(m.type() + ' ' + t.slice(0, 400)); });
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
await frames(4);
/* (the HUD and every page layer over the canvas hidden: a lab picture is the world alone) */
await p.addStyleTag({ content: 'body > *:not(canvas):not(#game):not(#c) { visibility: hidden !important; } canvas:not(#ecg):not(.ecg) { visibility: visible !important; }' });
const lab = (fn, ...a) => p.evaluate(([fn, a]) => { const L = window.__enc.stage.snap().story.fight.lab; return L[fn] ? L[fn](...a) : 'no ' + fn; }, [fn, a]);
const takes = await p.evaluate(() => { const C = window.__enc.stage.plan.FLOOR.cast, out = {};
  for (const k of ['zav', 'pho']) { const P = C[k]; out[k] = P && P.acts ? Object.fromEntries(Object.entries(P.acts).map(([n, a]) => [n, +a.getClip().duration.toFixed(3)])) : null; }
  return out; });
say('takes', JSON.stringify(takes));
const measure = (who) => p.evaluate(([src, who]) => { const M = eval('(' + src + ')'); return M(['^cast:' + who + '$', null]); }, [MEASURE_SRC, who]);
/* (the tag mode left once the takes are known: the lens is the probe's from here; the lab poses both men still) */
await p.evaluate(() => { const k = window.__enc.kit; if (k.tag().on) k.tag(null, null); });
await frames(6);
await lab('clear');
const setPose = async (who, take, t) => { if (who === 'pho') { await lab('zpose', null); return lab('pose', take, t); } await lab('pose', null); return lab('zpose', take, t); };
/* the lens at a hand: 0.42 m off it, from the back of the hand (its palm's facing, reversed) or the palm's side, a little
   from the fingers' end, a 24 degree lens; the other man stood aside so he is never in the way */
const aim = (who, sd, view) => p.evaluate(([who, sd, view]) => {
  const E = window.__enc, C = E.stage.plan.FLOOR.cast, P = C[who], V = P.group.position.constructor;
  P.group.updateWorldMatrix(true, true);
  const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
  const S0 = sd === 'L' ? 'Left' : 'Right', hand = bone(S0 + 'Hand'), mid = bone(S0 + 'HandMiddle2') || bone(S0 + 'HandMiddle1'), fore = bone(S0 + 'ForeArm');
  if (!hand) return { err: 'no hand' };
  const h = hand.getWorldPosition(new V()), m = mid ? mid.getWorldPosition(new V()) : null, f = fore.getWorldPosition(new V());
  const c = m ? h.clone().lerp(m, 0.55) : h.clone().add(h.clone().sub(f).normalize().multiplyScalar(0.07));
  /* (the palm's facing: the chapter's own measure of his rig, its nL in the hand's frame, carried to the world) */
  /* (the palm's facing as armsOf reads a rig with fingers: the fingers' line from the wrist to the middle finger's root,
     across from the little finger's root to the first finger's, the palm their cross, mirrored for the right hand; a hand
     with no finger bones: its own bone's third axis square to the forearm's line, both sides photographed all the same) */
  const along = (m ? m.clone().sub(h) : h.clone().sub(f)).normalize();
  const i1 = bone(S0 + 'HandIndex1'), k1 = bone(S0 + 'HandPinky1') || bone(S0 + 'HandRing1'), m1 = bone(S0 + 'HandMiddle1');
  let n = null;
  if (i1 && k1 && m1) { const fl = m1.getWorldPosition(new V()).sub(h).normalize(), ac = i1.getWorldPosition(new V()).sub(k1.getWorldPosition(new V()));
    ac.addScaledVector(fl, -ac.dot(fl)).normalize(); n = new V().crossVectors(fl, ac).multiplyScalar(sd === 'L' ? 1 : -1).normalize(); }
  else { n = new V().setFromMatrixColumn(hand.matrixWorld, 2).normalize(); n.addScaledVector(along, -n.dot(along)).normalize(); }
  /* (the engine keeps the lens at its own eye height whatever a probe sets (e4c5grip.mjs found it): so the lens is set
     ACROSS the ground only, 0.75 m from the hand on the side the view wants, and aimed, once it stands, from where it is) */
  const dir = (view === 'palm' ? n.clone() : n.clone().negate()).addScaledVector(along, 0.35); dir.y = 0;
  if (dir.lengthSq() < 1e-6) dir.set(1, 0, 0); dir.normalize();
  const cam = c.clone().addScaledVector(dir, 0.75);
  E.yaw.position.x = cam.x; E.yaw.position.z = cam.z; window.__aim = c;
  return { at: c.toArray().map(x => +x.toFixed(3)), cam: cam.toArray().map(x => +x.toFixed(3)) };
}, [who, sd, view]);
const aimed = () => p.evaluate(() => { const E = window.__enc, tg = window.__aim, c = E.yaw.position, d = tg.clone().sub(c);
  E.yaw.rotation.y = Math.atan2(-d.x, -d.z); E.pitch.rotation.x = Math.atan2(d.y, Math.hypot(d.x, d.z)); return c.toArray().map(x => +x.toFixed(3)); });
const res = { takes, rows: [], pics: [], errs, logs };
await p.evaluate(() => { const k = window.__enc.kit; if (k.lens) k.lens(24, { secs: 0 }); });
for (const who of WHO) {
  const other = who === 'pho' ? 'zav' : 'pho';
  for (const take of PLAN[who]) {
    if (ONLY && !ONLY.includes(take)) continue;
    const d = takes[who] && takes[who][take]; if (!d) { say('no take', who, take); res.rows.push({ who, take, err: 'no take' }); continue; }
    for (let i = 0; i < N; i++) {
      const t = +(d * (i + 0.5) / N).toFixed(3);
      await setPose(who, take, t); await frames(3);
      const m = await measure(who); const r = m && m[0] ? m[0] : null;
      res.rows.push({ who, take, t, flags: r ? r.flags : null, j: r ? r.j : null });
      if (r && r.flags.length) say('FAULT', who, take, t, JSON.stringify(r.flags));
    }
    if (PICS) for (const u of AT) {
      const t = +(d * u).toFixed(3); await setPose(who, take, t); await frames(3);
      /* (the other man taken out of the lens's way: two metres aside) */
      await lab('place', other, 2.4, 2.4); await frames(2);
      for (const sd of ['L', 'R']) for (const view of ['back', 'palm']) {
        const a = await aim(who, sd, view); await frames(4); a.lens = await aimed(); await frames(3); await aimed(); await frames(2);
        const f = `${OUT}/${who}-${take}-${t}-${sd}-${view}.png`;
        await p.screenshot({ path: f, timeout: 300000 }); res.pics.push({ who, take, t, sd, view, f, a }); say('pic', f, JSON.stringify(a));
      }
    }
  }
  await setPose(who, null, 0);
}
fs.writeFileSync(OUT + '/hands.json', JSON.stringify(res, null, 1));
const nf = res.rows.filter(r => r.flags && r.flags.length).length;
say('RESULT rows', res.rows.length, 'with faults', nf, 'pictures', res.pics.length, 'errors', errs.length, 'logs', logs.length, JSON.stringify(logs.slice(0, 4)));
for (const e of errs.slice(0, 6)) say(e);
await b.close();
