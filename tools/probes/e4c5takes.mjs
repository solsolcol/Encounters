/* v28.0 (E4C5, M8): GRANDMASTER PHO'S TAKES, READ FOR THE FIGHT'S ACTS (CLAUDE.md: a take is measured as a motion before
   it is cast). On the chapter's own body (cast.pho, look D, every posture law of c_cast.js), each of his file's takes is
   posed at 32 moments of its length and read in his own frame: his right hand (the Naga stick is in it), his left hand
   (the golden shockwave is "his free hand raised"), his head and his hips: how high each goes over his standing rest,
   how far it travels, and when. Which take swings the stick up for FIRE, and which raises the free hand, is chosen from
   this table and then photographed (VIEWS=take@t,...) full size from the fight's camera and from his side.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [VIEWS=mage_soell_cast_8@0.4,...] node tools/probes/e4c5takes.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5takes';
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready(); } catch { return false; } }, null, { timeout: 900000, polling: 500 });
say('ready');
const table = await p.evaluate(() => {
  const P = window.__enc.stage.plan.FLOOR.cast.pho, out = {};
  const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
  const B = { rh: bone('RightHand'), lh: bone('LeftHand'), hd: bone('Head'), hp: bone('Hips'), rs: bone('RightArm'), ls: bone('LeftArm') };
  const v = new P.group.position.constructor();
  const read = () => { P.group.updateWorldMatrix(true, true); const o = {}; for (const k in B) { if (!B[k]) continue; B[k].getWorldPosition(v); P.group.worldToLocal(v); o[k] = [+v.x.toFixed(3), +v.y.toFixed(3), +v.z.toFixed(3)]; } return o; };
  const keep = {}; for (const k in P.acts) keep[k] = [P.acts[k].time, P.w[k], P.acts[k].timeScale];
  const setT = (name, t) => { for (const k in P.acts) { P.acts[k].setEffectiveWeight(k === name ? 1 : 0); } P.acts[name].time = t; P.mixer.update(0); };
  setT('Sit_to_Stand_Transition_M', 5.9); const rest = read();
  for (const name in P.acts) {
    const d = P.acts[name].getClip().duration, rows = [];
    for (let i = 0; i <= 32; i++) { const t = Math.min(d - 1e-3, d * i / 32); setT(name, t); rows.push([+t.toFixed(3), read()]); }
    const hi = (k) => { let m = -9, at = 0; for (const [t, o] of rows) if (o[k] && o[k][1] > m) { m = o[k][1]; at = t; } return [+(m - rest[k][1]).toFixed(3), at]; };
    const fwd = (k) => { let m = -9, at = 0; for (const [t, o] of rows) if (o[k] && o[k][2] > m) { m = o[k][2]; at = t; } return [+(m - rest[k][2]).toFixed(3), at]; };
    const trav = (k) => { let L = 0; for (let i = 1; i < rows.length; i++) { const a = rows[i - 1][1][k], c = rows[i][1][k]; if (a && c) L += Math.hypot(c[0] - a[0], c[1] - a[1], c[2] - a[2]); } return +L.toFixed(2); };
    out[name] = { d: +d.toFixed(2), rhUp: hi('rh'), rhFwd: fwd('rh'), lhUp: hi('lh'), lhFwd: fwd('lh'), headUp: hi('hd'), hipsTravel: trav('hp'), headTravel: trav('hd'), rows };
  }
  for (const k in P.acts) { P.acts[k].time = keep[k][0]; P.acts[k].setEffectiveWeight(keep[k][1]); P.acts[k].timeScale = keep[k][2]; }
  P.mixer.update(0);
  return { rest, out };
});
fs.writeFileSync(OUT + '/takes.json', JSON.stringify(table, null, 1));
for (const [n, r] of Object.entries(table.out)) say(n.padEnd(30), 'd', r.d, '| right hand up', r.rhUp, 'fwd', r.rhFwd, '| left hand up', r.lhUp, 'fwd', r.lhFwd, '| head up', r.headUp, '| hips travel', r.hipsTravel, 'head travel', r.headTravel);
/* the chosen moments photographed (VIEWS=take@t@boom+side+front,...: the fight's camera behind and above him, his right
   side, his front), and his FEET measured in each: the lowest of the skin that rides each foot (half its weight or more
   on that side's foot or toe bones) against the court's floor (0), and the lowest of all his skin (the robe's hem) */
const VIEWS = (process.env.VIEWS || '').split(',').filter(Boolean);
const feet = [];
if (VIEWS.length) {
  await p.evaluate(() => window.__enc.stage.setPhase('fight'));
  await p.waitForFunction(() => window.__enc.kit.tagState().on && window.__enc.kit.eventActive(), null, { timeout: 120000, polling: 250 });
  await p.evaluate(() => document.getElementById('evBtn').click());       // (START: the mode live behind him)
  await p.waitForFunction(() => window.__enc.kit.tagState().live, null, { timeout: 60000, polling: 250 }).catch(() => say('(the mode not live)'));
  await new Promise(r => setTimeout(r, 2500));
  /* (every boom picture first, while the mode stands; then his side and front, the mode left for the first-person lens) */
  const jobs = [];
  for (const vw of VIEWS) { const [name, ts, sd] = vw.split('@'); for (const side of (sd || 'boom').split('+')) jobs.push({ vw, name, t: +ts, side, first: false }); }
  jobs.sort((a, b) => (a.side === 'boom' ? 0 : 1) - (b.side === 'boom' ? 0 : 1));
  const measured = new Set(); for (const j of jobs) if (!measured.has(j.vw)) { measured.add(j.vw); j.first = true; }
  for (const J of jobs) {
    const { vw, name, t, side } = J, sides = [side];
    {
      const ft = await p.evaluate(([name, t, side]) => {
        const E = window.__enc, P = E.stage.plan.FLOOR.cast.pho, k = E.kit;
        if (!P.acts[name]) return { err: 'no take ' + name };
        P.span = null; if (P.win) delete P.win[name];
        for (const q in P.acts) { P.w[q] = q === name ? 1 : 0; P.acts[q].setEffectiveWeight(P.w[q]); }
        P.acts[name].time = t; P.acts[name].timeScale = 0; P.cur = name; P.fade = 0; P.mixer.update(0);
        const g = P.group.position, ry = P.group.rotation.y;
        if (side !== 'boom') { if (k.tag().on) k.tag(null, null); const yaw = E.yaw, pitch = E.pitch;
          /* (his right side: 3 m off his right hand; his front: 3.2 m before him; the lens at his chest's height) */
          const fx = Math.sin(ry), fz = Math.cos(ry), rx = -fz, rz = fx;
          if (side === 'side') { yaw.position.set(g.x + rx * 3.0, 1.3, g.z + rz * 3.0); yaw.rotation.y = Math.atan2(rx, rz); }
          else { yaw.position.set(g.x + fx * 3.2, 1.35, g.z + fz * 3.2); yaw.rotation.y = Math.atan2(fx, fz); }
          pitch.rotation.x = -0.05; }
        return { ok: true };
      }, [name, t, side]);
      if (ft && ft.err) { say(ft.err); continue; }
      await p.evaluate(() => new Promise(r => { let n = 0; const f = () => (++n >= 4 ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }));
      const f = `${OUT}/${name}-${t}-${side}.png`; await p.screenshot({ path: f, timeout: 300000 }); say('pic', f);
      if (J.first) {
        const m = await p.evaluate(() => {
          const E = window.__enc, P = E.stage.plan.FLOOR.cast.pho, V = P.group.position.constructor, v = new V(), out = { L: 9, R: 9, all: 9, n: 0 };
          P.group.updateWorldMatrix(true, true);
          const vis = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
          P.group.traverse(o => { if (!o.isSkinnedMesh || !vis(o)) return; const G = o.geometry, sk = o.skeleton, si = G.attributes.skinIndex, sw = G.attributes.skinWeight, pos = G.attributes.position;
            const side = sk.bones.map(bn => { const r = /^(?:mixamorig:?)?(Left|Right)(Foot|Toe\w*)$/.exec(bn.name); return r ? r[1][0] : null; });
            for (let i = 0; i < pos.count; i++) { o.getVertexPosition(i, v); v.applyMatrix4(o.matrixWorld); out.n++; if (v.y < out.all) out.all = v.y;
              let wl = 0, wr = 0; for (let j = 0; j < 4; j++) { const sd = side[si.getComponent(i, j)], w = sw.getComponent(i, j); if (sd === 'L') wl += w; else if (sd === 'R') wr += w; }
              if (wl >= 0.5 && v.y < out.L) out.L = v.y; if (wr >= 0.5 && v.y < out.R) out.R = v.y; } });
          for (const k in out) if (k !== 'n') out[k] = +out[k].toFixed(3);
          return out; });
        feet.push({ view: vw, ...m }); say('feet', vw, JSON.stringify(m));
      }
    }
  }
}
fs.writeFileSync(OUT + '/feet.json', JSON.stringify(feet, null, 1));
for (const e of errs.slice(0, 10)) say(e);
await b.close();
