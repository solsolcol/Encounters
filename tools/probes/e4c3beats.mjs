/* v26.0 · EPISODE 4 CHAPTER 3, BEAT BY BEAT: the chapter booted once, then a list of steps run against it, each beat
   photographed at the frame the play really reaches (never under a paused film: v6.17). It jumps the way a Continue
   lands (the stage reset, the phase set, the next live frame applying it: the real resume path), waits on the chapter's
   own clock (never a stopwatch: this box draws a frame a second), and presses through the engine's own E path. A finger's
   play-through of the real input path is tools/probes/e4c3drive.mjs; this one is for seeing every beat quickly.

     CHROMIUM_PATH=... VIEW=phone|desk OUT=<dir> node tools/probes/e4c3beats.mjs <steps.json>

   INTRO=1 runs the steps against the chapter's opening film (seek, seekAt, shot), which Start begins.

   steps.json: [ step, ... ], each one of
     { "phase": "festival" }                 jump to a saved phase (with its mark: "check:t,a")
     { "wait": 3.5 }                         chapter-clock seconds from now
     { "until": "E.stage.info().phase === 'seen'", "ms": 120000 }
     { "view": [x, y, z, yawDeg, pitchDeg] } place the lens (y null keeps the height; yaw 0 north, 90 west)
     { "look": [yawDeg, pitchDeg] }          turn the lens only
     { "press": true }                       the engine's E (interactNow), reported
     { "eval": "E.stage.dbg.baiRaise(1, 0.4)" }
     { "shot": "name" }                      a photograph (a drawn frame is waited for first)
     { "info": true }                        the stage's info, the objective on screen, the badge, who is where
     { "ev": "press" | "release" | "start" } a kit event's own press path
     { "film": "festival" }                  a film from play begun (kit.film), then { "seek": 12.5 } to a moment of its own
                                             clock (always forward: a seek undoes no fade it has passed), { "resume": true },
                                             { "skip": true }
     { "choose": 0 }                         the decision opened and its option pressed (0 to 3): the ending's scene plays
     { "seekAt": "T.A.mats + 2", "shot": "a-mats" }   a seek to a moment named on the chapter's own clocks (stage.dbg.clocks:
                                             T.A to T.D, T.CLOSE, T.FEST, T.BETW, T.TELL, T.ANSW), and a photograph of it */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const STEPS = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const VIEW = process.env.VIEW || 'phone', OUT = process.env.OUT || '/tmp/e4c3beats';
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = VIEW === 'phone' ? await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true })
                             : await b.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /failed|threw|has no take|no pose/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 260)); });
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's', log = (...a) => console.log(el(), ...a);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
await p.goto(PAGE + '?ch=e4c3', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
/* INTRO=1: the steps are run against the chapter's OPENING FILM (Start begins it): it is waited for, not skipped */
if (process.env.INTRO) { await p.waitForFunction(() => window.__enc.cine && window.__enc.cine.active() && window.__enc.cine.t() > 0.15, null, { timeout: 1500000, polling: 300 }); log('in the opening film', VIEW, 'dur', await p.evaluate(() => +window.__enc.cine.dur().toFixed(2))); }
else {
  await toPlay(p, 1500000);
  await p.waitForFunction(() => { try { return window.__enc.stage.info().waiting !== undefined && window.__enc.stage.dayClock.t > 0.5; } catch { return false; } }, null, { timeout: 600000, polling: 500 });
  log('in play', VIEW);
}
let n = 0;
for (const s of STEPS) {
  try {
    if (s.phase) { await p.evaluate((ph) => { const E = window.__enc; E.stage.reset(); E.kit.setPhase(ph); }, s.phase);
      await p.waitForFunction((ph) => window.__enc.stage.info().phase === ph.split(':')[0] && window.__enc.stage.dayClock.t > 0.2, s.phase, { timeout: 300000, polling: 300 }); await frames(3); log('phase', s.phase); }
    else if (s.wait != null) { const t0 = await p.evaluate(() => window.__enc.stage.dayClock.t);
      await p.waitForFunction(([t0, w]) => window.__enc.stage.dayClock.t >= t0 + w, [t0, s.wait], { timeout: 900000, polling: 300 }); }
    else if (s.until) { const ok = await p.waitForFunction(new Function('const E = window.__enc; try { return !!(' + s.until + '); } catch (e) { return false; }'), null, { timeout: s.ms || 300000, polling: 300 }).then(() => true, () => false); log('until', s.until, ok ? 'ok' : 'TIMED OUT'); }
    else if (s.view) { await p.evaluate((v) => { const E = window.__enc, d = Math.PI / 180; E.yaw.position.x = v[0]; if (v[1] != null) E.yaw.position.y = v[1]; E.yaw.position.z = v[2]; E.yaw.rotation.y = v[3] * d; E.pitch.rotation.x = (v[4] || 0) * d; }, s.view); await frames(3); }
    else if (s.look) { await p.evaluate((v) => { const E = window.__enc, d = Math.PI / 180; E.yaw.rotation.y = v[0] * d; E.pitch.rotation.x = (v[1] || 0) * d; }, s.look); await frames(3); }
    else if (s.press) { await frames(2); const r = await p.evaluate(() => { const E = window.__enc; const b = document.getElementById('interact'); const badge = b && !b.classList.contains('hide') ? b.textContent.trim() : null; return { badge, ok: E.interactNow() }; }); log('press', JSON.stringify(r)); }
    else if (s.eval) { const r = await p.evaluate(new Function('const E = window.__enc; return (' + s.eval + ');')).catch(e => 'THREW ' + e.message); if (r !== undefined && r !== null) log('eval', String(s.eval).slice(0, 60), '->', JSON.stringify(r).slice(0, 2400)); }
    else if (s.ev) { await p.evaluate((k) => { const E = window.__enc; if (k === 'release') E.evRelease(); else E.evPress(); if (k === 'start') E.evRelease(); }, s.ev); await frames(2); }
    else if (s.film) { const ok = await p.evaluate((k) => window.__enc.kit.film(k), s.film); await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.cine.t() > 0.15, null, { timeout: 300000, polling: 200 }).catch(() => {});
      log('film', s.film, ok, 'dur', await p.evaluate(() => +window.__enc.cine.dur().toFixed(2))); }
    else if (s.seek != null) { await p.evaluate((t) => window.__enc.cine.seek(t), s.seek); await frames(3); await p.waitForTimeout(s.settle != null ? s.settle : 500); }
    else if (s.seekAt != null) { const t = await p.evaluate(new Function('const T = window.__enc.stage.dbg.clocks; return (' + s.seekAt + ');')); await p.evaluate((t) => window.__enc.cine.seek(t), t); await frames(3); await p.waitForTimeout(s.settle != null ? s.settle : 500);
      if (s.shot) { await frames(3); await p.screenshot({ path: `${OUT}/${String(++n).padStart(2, '0')}-${s.shot}.png`, timeout: 240000 }).catch(() => log('shot failed', s.shot)); log('shot', s.shot, 'at', t.toFixed(2)); } }
    else if (s.choose != null) { await p.evaluate(() => window.__enc.decide && window.__enc.decide());
      await p.waitForFunction(() => document.querySelectorAll('#choices button.choice').length >= 4, null, { timeout: 120000, polling: 300 }); await p.waitForTimeout(600);
      await p.evaluate((i) => document.querySelectorAll('#choices button.choice')[i].click(), s.choose);
      await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.cine.t() > 0.15, null, { timeout: 300000, polling: 200 }).catch(() => {});
      log('choose', s.choose, 'dur', await p.evaluate(() => +window.__enc.cine.dur().toFixed(2))); }
    else if (s.resume) { await p.evaluate(() => window.__enc.cine.resume()); }
    else if (s.skip) { await p.evaluate(() => window.__enc.cine.skip()); await frames(3); }
    else if (s.shot) { await frames(3); await p.screenshot({ path: `${OUT}/${String(++n).padStart(2, '0')}-${s.shot}.png`, timeout: 240000 }).catch(() => log('shot failed', s.shot)); log('shot', s.shot); }
    else if (s.info) { const r = await p.evaluate(() => { const E = window.__enc, o = document.getElementById('objective'), b = document.getElementById('interact');
      return { info: E.stage.info(), obj: o && !o.classList.contains('hide') ? (document.getElementById('objTxt') || o).textContent.trim() : null,
               badge: b && !b.classList.contains('hide') ? b.textContent.trim() : null, at: [+E.yaw.position.x.toFixed(2), +E.yaw.position.y.toFixed(2), +E.yaw.position.z.toFixed(2), +(E.yaw.rotation.y * 180 / Math.PI).toFixed(0), +(E.pitch.rotation.x * 180 / Math.PI).toFixed(0)],
               ev: E.kitDebug().event ? { kind: E.kitDebug().event.kind, bState: E.kitDebug().event.bState, bk: E.kitDebug().event.bk, briefing: E.kitDebug().event.briefing } : null,
               who: E.stage.who().filter(w => /ton|bench|pho|devg/.test(w.key)).map(w => w.key + ':' + w.take) }; });
      log('info', JSON.stringify(r)); }
  } catch (e) { log('STEP FAILED', JSON.stringify(s).slice(0, 100), e.message.split('\n')[0]); }
}
log('errs', JSON.stringify(errs.slice(0, 12)));
await b.close();
