/* v29.0 · EPISODE 5 CHAPTER 1'S ENDINGS (FILMS-2): the four endings, the barrier inside each and the dawn after it, MEASURED
   AS MOVES AND PHOTOGRAPHED, each reached as a player reaches it: the decision's bookmark (stage.applyPhase('ask')), the
   panel's answer pressed by a finger (a phone) or a click (a desk). CLOSE THE CIRCLE, the event inside the barrier, is
   either LAID BY A REAL FINGER (REAL=1: its START pressed, then a finger, or the mouse, drawn slowly round the screen's middle
   as its brief says, photographed at the shares CIRPICS names) or let go by the kit (kit.abortEvent: the film then runs on
   exactly as after a laid circle, the thread standing closed; the lens is the clock's either way, so the rows are the same).
   THE ROW is tools/probes/e5c1films.mjs's own (its INSTALL read from it here, so the two never differ): the lens, the black,
   every person the chapter made, every named thing that moved. So e5c1bounce.py and framebounce.py read these files too.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... VIEW=phone|desktop|both MODE=seek|pics|play [ENDS=A,B,C,D] [STEP=0.1] [STEP_MS=50]
       [FROM=s] [UNTIL=s] [PICS='A@1,5,12.5;B@2'] [REAL=1] [CIRPICS=0.25,0.6,0.92] [DPR=2] [SETTLE=1200] [NOCAP=1]
       [CHFILE=<e5c1.js>] [OUT=dir] node tools/probes/e5c1ends.mjs
   MODE=seek: sought from 0 to the film's end in STEP s (every picture a function of the film's clock: v6.4), one row a step
   (VIEW=both: each moment sought twice, at a phone's shape and a desk's, from one boot); writes <OUT>/<view>-seek-end<K>.json
   as e5c1films.mjs names it (job 'end:K'). MODE=play: played on a slowed clock (STEP_MS a drawn frame), a row a frame (what a
   seek cannot see: a look laid on after the mixer). MODE=pics: only the PICS moments, photographed (DPR 2 is a phone's real
   picture; captions shown unless NOCAP=1). Prints each film's marks (stage.films.ends2.marks()) and every page error. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const VIEW = process.env.VIEW || 'phone', PHONE = VIEW !== 'desktop', BOTH = VIEW === 'both', MODE = process.env.MODE || 'pics';
const STEP = +(process.env.STEP || 0.1), STEP_MS = +(process.env.STEP_MS || 50), FROM = +(process.env.FROM || 0), UNTIL = +(process.env.UNTIL || 1e9);
const DPR = +(process.env.DPR || (MODE === 'pics' ? 2 : 1)), SETTLE = +(process.env.SETTLE || 1200), REAL = process.env.REAL === '1';
const ENDS = (process.env.ENDS || 'A,B,C,D').split(',').filter(Boolean);
const CIRPICS = (process.env.CIRPICS || '').split(',').filter(Boolean).map(Number);
const OUT = process.env.OUT || '/tmp/e5c1ends'; fs.mkdirSync(OUT, { recursive: true });
const PICS = {}; for (const it of (process.env.PICS || '').split(';').filter(Boolean)) { const i = it.lastIndexOf('@'); PICS[it.slice(0, i)] = it.slice(i + 1).split(',').map(Number).sort((a, b) => a - b); }
/* the row maker, e5c1films.mjs's own text */
const FS = fs.readFileSync(new URL('./e5c1films.mjs', import.meta.url), 'utf8'), I0 = FS.indexOf('const INSTALL = '), I1 = FS.indexOf('\n};\n', I0);
const INSTALL = (0, eval)('(' + FS.slice(I0 + 'const INSTALL = '.length, I1 + 2) + ')');
const CHSRC = process.env.CHFILE ? fs.readFileSync(process.env.CHFILE, 'utf8') : null;
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: DPR, hasTouch: true, isMobile: true }
                                     : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: DPR });
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
log(VIEW, MODE, 'ends', ENDS.join(','), REAL ? '(the circle by a real finger)' : '(the circle let go by the kit)');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function reach(p, k) {
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
  p.on('console', m => { if (m.type() === 'error' || /threw|failed|has no take|no line/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 260)); });
  if (CHSRC) await p.route(new RegExp('/assets/e5c1\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: CHSRC }));
  await p.goto(PAGE + '?ch=e5c1', { waitUntil: 'load', timeout: 300000 });
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
  await p.evaluate(() => document.getElementById('startBtn').click());
  await toPlay(p, 1500000);
  await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
  await p.evaluate(() => window.__enc.stage.applyPhase('ask'));
  await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 900000, polling: 500 });
  await sleep(2500);
  await p.waitForFunction(() => { const P = document.querySelector('#decide .panel'); return P && P.getAnimations().every(a => a.playState === 'finished'); }, null, { timeout: 120000, polling: 200 });
  const bt = await p.evaluate((i) => { const B = [...document.querySelectorAll('#choices button.choice')], r = B[i] && B[i].getBoundingClientRect();
    return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; }, 'ABCD'.indexOf(k));
  if (PHONE) await p.touchscreen.tap(Math.round(bt.x), Math.round(bt.y)); else await p.mouse.click(bt.x, bt.y);
  await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.getState() === 'cine', null, { timeout: 600000, polling: 250 });
  return errs;
}
/* CLOSE THE CIRCLE, by a real finger (or the mouse): START pressed, then a slow circle round the craft's point, a few degrees a
   step, photographed at the shares asked; or let go by the kit */
async function circle(p, k, shotAt) {
  const open = await p.evaluate(() => !!window.__enc.kit.eventActive()); if (!open) return 'no event';
  if (!REAL) { await p.evaluate(() => window.__enc.kit.abortEvent()); return 'let go'; }
  const W = PHONE ? 390 : 1280, H = PHONE ? 844 : 800;
  await sleep(1500);
  if (shotAt) await shotAt('brief');
  const go = await p.evaluate(() => { const e = document.getElementById('evBtn'), r = e && e.getBoundingClientRect(); return r && r.width ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; });
  if (go) { if (PHONE) await p.touchscreen.tap(Math.round(go.x), Math.round(go.y)); else await p.mouse.click(go.x, go.y); }
  await sleep(600);
  const cdp = PHONE ? await p.context().newCDPSession(p) : null;
  const cx = W * 0.5, cy = H * 0.56, R = Math.min(W, H) * 0.3;
  const at = (a) => ({ x: Math.round(cx + Math.cos(a) * R), y: Math.round(cy + Math.sin(a) * R) });
  let a = -Math.PI / 2, n = 0; const want = CIRPICS.slice();
  const down = async (q) => { if (PHONE) await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: q.x, y: q.y, id: 3 }] }); else { await p.mouse.move(q.x, q.y); await p.mouse.down(); } };
  const move = async (q) => { if (PHONE) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: q.x, y: q.y, id: 3 }] }); else await p.mouse.move(q.x, q.y); };
  const up = async () => { if (PHONE) await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); else await p.mouse.up(); };
  await down(at(a));
  while (n++ < 400) {
    a += 6 * Math.PI / 180; await move(at(a)); await sleep(70);
    const s = await p.evaluate(() => { const F = window.__enc.stage.films.ends2.state(); return { k: F.cirK, show: F.cirShow, open: !!window.__enc.kit.eventActive() }; });
    if (!s.open) break;
    if (want.length && s.show >= want[0]) { const w = want.shift(); await up(); if (shotAt) await shotAt('lay' + w.toFixed(2)); await down(at(a)); }
  }
  await up();
  await p.waitForFunction(() => !window.__enc.kit.eventActive(), null, { timeout: 120000, polling: 250 }).catch(() => {});
  return 'laid in ' + n + ' steps';
}

for (const k of ENDS) {
  const p = await ctx.newPage(); let errs = [];
  try {
    errs = await reach(p, k);
    if (process.env.NOCAP === '1') await p.addStyleTag({ content: '#caption{display:none !important}' }).catch(() => {});
    await p.evaluate(INSTALL);
    const dur = await p.evaluate(() => window.__enc.cine.dur()), labels = await p.evaluate(() => window.__labels());
    const M = await p.evaluate(() => { const E = window.__enc.stage.films.ends2.marks(), o = {}; for (const q in E) if (typeof E[q] === 'number') o[q] = +E[q].toFixed(2);
      o.bar = {}; for (const q in E.bar) if (typeof E.bar[q] === 'number') o.bar[q] = +E.bar[q].toFixed(2); o.dawn = {}; for (const q in E.dawn) if (typeof E.dawn[q] === 'number') o.dawn[q] = +E.dawn[q].toFixed(2); return o; });
    log(k, 'dur', dur.toFixed(2), 'people', labels.length, 'circle at', M.bar.circle, 'dawn at', M.d0);
    fs.writeFileSync(`${OUT}/marks-end${k}.json`, JSON.stringify(M));
    const circleT = M.bar.circle; let circled = false;
    const seekTo = async (t) => { await p.evaluate((t) => window.__enc.cine.seek(t), t); };
    /* (the marks are read to the hundredth: the step that opens the circle stands a fraction past its rounded mark, so the
       seek that opens it goes a fiftieth of a second further) */
    const passCircle = async (t, shotAt) => { if (!circled && t >= circleT - 1e-3) { circled = true; await seekTo(circleT + 0.02); await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
      log(k, 'the circle:', await circle(p, k, shotAt)); } };
    const shoot = async (name) => { await p.evaluate(() => new Promise(r => { let n = 0; const f = () => (++n >= 3 ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); })); await sleep(SETTLE);
      const f = `${OUT}/end${k}-${VIEW}-${name}.png`; await p.screenshot({ path: f, timeout: 240000 }); log(k, 'picture', f); };
    if (MODE === 'seek') {
      const res = { view: VIEW, mode: MODE, job: 'end:' + k, dur, labels, step: STEP, rows: [], rowsD: BOTH ? [] : undefined, clips: [], errs, marks: M };
      res.solids = await p.evaluate(() => (window.__enc.stage.blockers || []).map(b => b.isEmpty() ? null : [b.min.x, b.max.x, b.min.z, b.max.z]));
      const kA = Math.ceil(FROM / STEP - 1e-6), kZ = Math.floor(Math.min(dur - 0.05, UNTIL) / STEP + 1e-6);
      for (let i = kA; i <= kZ; i += 50) {
        const j = Math.min(kZ + 1, i + 50);
        if ((j - 1) * STEP >= circleT - 1e-3 && !circled) {
          /* (the rows up to the circle, the circle, then on) */
          const iC = Math.min(j, Math.ceil(circleT / STEP - 1e-6));
          if (iC > i) { const two = await rowsOf(p, i, iC); res.rows.push(...two[0]); if (BOTH) res.rowsD.push(...two[1]); }
          await passCircle(circleT, null);
          if (j > iC) { const two = await rowsOf(p, iC, j); res.rows.push(...two[0]); if (BOTH) res.rowsD.push(...two[1]); }
          continue;
        }
        const two = await rowsOf(p, i, j); res.rows.push(...two[0]); if (BOTH) res.rowsD.push(...two[1]);
      }
      const f = `${OUT}/${VIEW}-seek-end${k}.json`; fs.writeFileSync(f, JSON.stringify(res)); log(k, res.rows.length, 'rows ->', f);
      /* (and the PICS of this ending from the same boot, after the rows: every picture a function of the clock, so a seek back
         lands on its own moment) */
      for (const t of (PICS[k] || [])) { await seekTo(t); await seekTo(t); await shoot(String(t.toFixed(2)).padStart(6, '0')); }
    } else if (MODE === 'play') {
      /* played: up to the circle on a slowed clock, the circle, then on (a row a drawn frame) */
      await p.evaluate(({ FROM, UNTIL, STEP_MS }) => {
        const E = window.__enc, rows = window.__live = []; window.__liveDone = false;
        const realNow = performance.now.bind(performance), realRaf = window.requestAnimationFrame.bind(window);
        let virt = realNow(); performance.now = () => virt; window.requestAnimationFrame = (cb) => realRaf(() => cb(virt + 5000));
        const tick = () => { if (!E.kit.eventActive()) virt += STEP_MS; else virt = realNow(); realRaf(tick); }; realRaf(tick);
        const f = () => { if (!E.cine.active()) { window.__liveDone = true; return; }
          const t = E.cine.t(); if (t > UNTIL) { window.__liveDone = true; return; }
          if (E.kit.eventActive()) E.kit.abortEvent();
          if (t >= FROM) { const r = window.__row(t); r.w = Math.round(realNow()); rows.push(r); }
          realRaf(f); };
        realRaf(f); }, { FROM, UNTIL, STEP_MS });
      await p.waitForFunction(() => window.__liveDone, null, { timeout: 5400000, polling: 1000 });
      const res = { view: VIEW, mode: MODE, job: 'end:' + k, dur, labels, rows: await p.evaluate(() => window.__live), errs, marks: M };
      const f = `${OUT}/${VIEW}-play-end${k}.json`; fs.writeFileSync(f, JSON.stringify(res)); log(k, res.rows.length, 'rows ->', f);
    } else {
      for (const t of (PICS[k] || [])) {
        await passCircle(t, (nm) => shoot(nm));
        await seekTo(t); await shoot(String(t.toFixed(2)).padStart(6, '0'));
      }
      /* BODIES='t1,t2,...' (MODE=pics): at each moment, every shown body MEASURED with the probes' own measures, read from their
         files so they never differ: jointscan's (every joint against a real body's ranges; WHO a regex, 'pho|grace|marcus'
         unless said), feetscan's (each foot against the floor under it, the near skin: LV 1), clipscan's (the pairs whose
         surfaces cross, R m round the lens). Written to <OUT>/bodies-end<K>.json and the flags printed */
      if (process.env.BODIES) {
        const rd = (f, a, b) => { const s = fs.readFileSync(new URL('./' + f, import.meta.url), 'utf8'), i0 = s.indexOf(a), i1 = s.indexOf(b, i0); return (0, eval)('(' + s.slice(i0 + a.length, i1 + 2) + ')'); };
        const JM = rd('jointscan.mjs', 'const MEASURE = ', '\n};\n'), FM = rd('feetscan.mjs', 'const MEASURE = ', '\n};\n'), CA = rd('clipscan.mjs', 'const ANALYSE = ', '\n};\n');
        const out = [];
        for (const t of process.env.BODIES.split(',').map(Number)) {
          await passCircle(t, null); await seekTo(t); await seekTo(t);
          await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
          const J = await p.evaluate(JM, [process.env.WHO || 'pho|grace|marcus', null]).catch(e => ({ err: String(e).slice(0, 200) }));
          const F = await p.evaluate(FM, 1).catch(e => ({ err: String(e).slice(0, 200) }));
          const c = await p.evaluate(() => { const E = window.__enc, v = E.camera.position.clone(); E.camera.getWorldPosition(v); return [v.x, v.z]; });
          const C = await p.evaluate(CA, [0.1, +(process.env.R || 4), 0.05, c[0], c[1]]).catch(e => ({ err: String(e).slice(0, 200) }));
          const shot = await p.evaluate(() => window.__enc.stage.films.ends2.state().shot);
          out.push({ t, shot, joints: J, feet: F, clips: C && C.pairs ? C.pairs.slice(0, 40) : C });
          const jf = Array.isArray(J) ? J.filter(r => r.flags && r.flags.length).map(r => r.who + ' ' + r.flags.join(' ')) : [J];
          const ff = Array.isArray(F) ? F.filter(r => Math.min(r.Left ?? 9, r.Right ?? 9) < -0.01 || (r.Left ?? 0) > 0.03 || (r.Right ?? 0) > 0.03).map(r => r.who + ' L ' + r.Left + ' R ' + r.Right + ' hem ' + r.hem) : [F];
          log(k, 'bodies at', t, shot, '| joints:', jf.length ? jf.join(' ; ') : 'none flagged', '| feet:', ff.length ? ff.join(' ; ') : 'on their floors', '| clips:', C && C.pairs ? C.pairs.length + ' pairs' : JSON.stringify(C).slice(0, 120));
        }
        fs.writeFileSync(`${OUT}/bodies-end${k}.json`, JSON.stringify(out, null, 1));
      }
      /* TUNE='[["name", t, "js"], ...]' (MODE=pics): each try's snippet run in the page with T the films' tuning handle
         (stage.films.ends2.tune), the film sought to t (twice: the second lays what the first changed), photographed */
      for (const [nm, t, js] of JSON.parse(process.env.TUNE || '[]')) {
        await passCircle(t, null);
        await p.evaluate((js) => { const T = window.__enc.stage.films.ends2.tune, S = window.__enc.stage, E = window.__enc; return String(new Function('T', 'S', 'E', js)(T, S, E)); }, js);
        await seekTo(t); await seekTo(t); await shoot('tune-' + nm);
      }
    }
    const e2 = await p.evaluate(() => window.__enc.stage.films.ends2.state());
    log(k, 'state', JSON.stringify(e2));
    if (errs.length) log(k, 'errs', JSON.stringify(errs.slice(0, 8))); else log(k, 'errors none');
  } catch (e) { log(k, 'FAILED', String(e).slice(0, 400), JSON.stringify(errs.slice(0, 4))); }
  await p.close();
}
log('done');
await b.close();

async function rowsOf(p, kA, kZ) {
  return p.evaluate(([kA, kZ, step, aD]) => { const E = window.__enc, C = E.cine, cam = E.camera, aP = cam.aspect, out = [], outD = [];
    for (let k = kA; k < kZ; k++) { const t = +(k * step).toFixed(3);
      cam.aspect = aP; cam.updateProjectionMatrix(); C.seek(t); out.push(window.__row(t));
      if (aD) { cam.aspect = aD; cam.updateProjectionMatrix(); C.seek(t); outD.push(window.__row(t, true)); } }
    cam.aspect = aP; cam.updateProjectionMatrix(); return [out, outD]; }, [kA, kZ, STEP, BOTH ? 1280 / 800 : 0]);
}
