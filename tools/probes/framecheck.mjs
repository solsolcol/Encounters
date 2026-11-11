/* v25.2 · WHAT A PHONE SEES OF EACH FILM, MEASURED (Chad, 10 Nov 2026: "On a phone screen, there are many things i
   cannot see in the intro cutscenes, the gameplay section, and the intermediate cutscenes, and the ending cutscenes").
   Episode 4 chapter 2's films seeked through on their own clocks (every picture is a function of the clock, v5.30's
   law), and at each step every named subject the stage reports (`stage.subjects()`: the people's faces and hands, his
   things, the shop's) projected through the film's own lens: its place on the screen (NDC, -1..1 across and up), whether
   it is in front of the lens, and whether it is drawn. Run once on a phone (390 x 844, touch) and once on a desktop
   (1280 x 800); tools/probes/framediff.py then lists every moment a subject is in the desktop's frame and out of the
   phone's — the shots to look at, not a verdict.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... VIEW=phone|desktop FILMS=open,call,visit,exam,clear | OPT=A|B|C|D
       [STEP=0.25] OUT=<file.json> node tools/probes/framecheck.mjs
   FILMS runs the opening (Start pressed, the film measured before it is let go) and the films from play, in that order,
   in one sitting; OPT runs one ending (the decision opened by its bookmark, the option pressed as a finger or a click
   presses it). No frame is waited for between steps: the lens and the places are the film's on the seek; a person's
   limbs stand as last drawn (a face moves with its body). */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const VIEW = process.env.VIEW || 'phone', PHONE = VIEW === 'phone', STEP = +(process.env.STEP || 0.25);
const OUT = process.env.OUT || `/tmp/framecheck-${VIEW}.json`;
const FILMS = process.env.OPT ? ['end:' + process.env.OPT] : (process.env.FILMS || 'open,call,visit,exam,clear').split(',');
/* (v25.5) SHOTS=<dir> [EVERY=2] [FROM=s] [UNTIL=s] [SETTLE=700]: each film is also PHOTOGRAPHED every EVERY seconds of its own clock (from FROM to UNTIL when given), after it
   is measured (the film sought, three frames drawn, SETTLE ms for what eases on the wall's clock), into
   <dir>/<film>-<view>-<seconds>.jpg: one sitting gives the numbers and the pictures of a whole chapter (Chad, 11 Nov
   2026: "Make sure that every single one of my feedback ... have all been fully and completely addressed"). The
   captions are put away for the pictures: they run on the wall's clock from their cue (v21.30), so under a seek they
   stand at the wrong moments. Unset, nothing here runs */
const SHOTS = process.env.SHOTS || '', EVERY = +(process.env.EVERY || 2), SETTLE = +(process.env.SETTLE || 700);
const FROM = process.env.FROM ? +process.env.FROM : null, UNTIL = process.env.UNTIL ? +process.env.UNTIL : Infinity;
if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
const WAY = { call: { phase: 'night', film: 'call' }, visit: { phase: 'visit' }, exam: { phase: 'clearing:k,b,tA' },
              clear: { phase: 'clearing:k,b,tA,x', film: 'clear' } };
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true }
                                     : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's', log = (...a) => console.log(el(), ...a);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
await p.goto(PAGE + '?ch=e4c2', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
/* one film's every step, measured in the page */
async function measure(key) {
  await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.getState() === 'cine', null, { timeout: 1500000, polling: 300 });
  await p.waitForFunction(() => window.__enc.cine.t() > 0.2, null, { timeout: 600000, polling: 300 });
  await frames(4);
  const dur = await p.evaluate(() => window.__enc.cine.dur());
  /* the film's black as it stood when the film began (0 for a scene, the kit's own for a film from play, 1 for an
     opening): kept for the pictures below */
  const fade0 = await p.evaluate(() => { const el = document.getElementById('cineFade'); return el ? el.style.opacity || '0' : null; });
  log('film', key, 'dur', dur.toFixed(2), 'fade at its start', fade0);
  const rows = await p.evaluate(({ dur, step }) => {
    const E = window.__enc, cam = E.camera, V = cam.position.constructor, v = new V(), rows = [];
    for (let t = 0; t <= dur + 1e-6; t += step) {
      E.cine.seek(t);
      cam.updateMatrixWorld(true);
      const sub = E.stage.subjects(), row = { t: +t.toFixed(2), fov: +cam.fov.toFixed(2), asp: +cam.aspect.toFixed(3), s: {} };
      for (const [k, q] of Object.entries(sub)) {
        v.set(q[0], q[1], q[2]).applyMatrix4(cam.matrixWorldInverse);
        const front = v.z < -0.05;
        v.applyMatrix4(cam.projectionMatrix);
        row.s[k] = [+v.x.toFixed(3), +v.y.toFixed(3), front ? 1 : 0, q[3]];
      }
      rows.push(row);
    }
    return rows;
  }, { dur, step: STEP });
  if (SHOTS) {
    await p.evaluate(() => { if (!document.getElementById('__fcNoCap')) { const s = document.createElement('style'); s.id = '__fcNoCap'; s.textContent = '#caption{display:none !important}'; document.head.appendChild(s); } });
    /* THE BLACK IS PUT BACK FIRST. The measuring pass above ends on the film's last step, inside its closing fade, and
       a seek applies only the tracks it has passed: sought back to its first seconds, a film with no fade of its own
       until its end (the call, endings B, C and D) kept that closing black, and every picture of it came out nine
       tenths dark while the game's own was bright (the audit's first sweep: mean brightness 4 of 255 against 46 to 83
       on the real path). The layer is set to what it was when the film began, and the pictures run forward from there */
    await p.evaluate((o) => { const el = document.getElementById('cineFade'); if (el && o != null) el.style.opacity = o; }, fade0);
    let n = 0;
    for (let t = FROM != null ? FROM : Math.min(1, dur / 2); t <= Math.min(dur - 0.05, UNTIL); t += EVERY) {
      await p.evaluate((t) => window.__enc.cine.seek(t), t);
      await frames(3); if (SETTLE) await p.waitForTimeout(SETTLE);
      await p.screenshot({ path: `${SHOTS}/${key.replace(':', '')}-${VIEW}-${t.toFixed(1).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 88 }); n++;
    }
    await p.evaluate(() => { const s = document.getElementById('__fcNoCap'); if (s) s.remove(); });
    log('film', key, n, 'pictures');
  }
  return rows;
}
const out = {};
for (const key of FILMS) {
  if (key === 'open') {
    out.open = await measure('open');
    await p.evaluate(() => window.__enc.cine.skip());                  // let it go as the Skip button does
    await toPlay(p, 1500000); await p.waitForTimeout(6000);
    continue;
  }
  if (!FILMS.includes('open') && !out.__booted) { await toPlay(p, 1500000); await p.waitForTimeout(6000); out.__booted = true; }
  if (key.startsWith('end:')) {
    const OPT = key.slice(4);
    await p.evaluate(() => window.__enc.stage.applyPhase('decide'));
    await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 600000, polling: 500 });
    await p.waitForFunction(() => { const P = document.querySelector('#decide .panel'); return P && P.getAnimations().every(a => a.playState === 'finished'); }, null, { timeout: 120000, polling: 200 });
    const pt = await p.evaluate((i) => { const els = [...document.querySelectorAll('#choices button.choice')]; const r = els[i] && els[i].getBoundingClientRect(); return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; }, 'ABCD'.indexOf(OPT));
    if (PHONE) await p.touchscreen.tap(pt.x, pt.y); else await p.mouse.click(pt.x, pt.y);
    out[key] = await measure(key);
    continue;
  }
  const w = WAY[key];
  await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 600000, polling: 500 });
  /* (v25.5) the chapter's own black is waited out first: a film from play begins on the kit's fade as it stands
     (kitFilm's startFade), and the film before this one in the list ended on a black that play was still lifting; on
     a loaded box the next film began under half of it and kept it (the audit's desktop pass: the examination's first
     34 seconds at half brightness, where the game's own begin on a clear picture: twenty seconds of play come first) */
  await p.waitForFunction(() => !window.__enc.kit.getFade || window.__enc.kit.getFade() < 0.01, null, { timeout: 120000, polling: 250 }).catch(() => log('the black was still up after two minutes'));
  await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), w.phase);
  if (w.film) {
    await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 600000, polling: 500 });
    await p.waitForTimeout(2500);
    await p.evaluate((k) => window.__enc.kit.film(k), w.film);
  }
  out[key] = await measure(key);
  await p.evaluate(() => window.__enc.cine.skip());
  await p.waitForTimeout(2000);
}
delete out.__booted;
fs.writeFileSync(OUT, JSON.stringify({ view: VIEW, step: STEP, films: out, errs }));
log('wrote', OUT, 'films', Object.keys(out).join(','), 'errs', JSON.stringify(errs));
await b.close();
