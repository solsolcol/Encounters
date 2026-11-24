/* v28.0 (E4C5, M8): WHAT A FRAME OF THE CLEANSING COSTS, measured (CLAUDE.md: measure first). On a phone page (390 x 844
   at DSF, a touch context): the hunt's court in first person, then the fight's brief, then the fight live after START;
   for each, over SECS of wall time: drawn frames a second, the chapter's own frame (stage.updateNotes: the fight's whole
   part runs inside it) in milliseconds a frame, and what is left of each frame (the engine, the draw). A second pass of
   the fight with the court's effects hidden (FSG), and a third with the nine hidden, say which costs what.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [DSF=2] [SECS=12] node tools/probes/e4c5perf.mjs */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const DSF = +(process.env.DSF || 2), SECS = +(process.env.SECS || 12);
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DSF, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
say('ready');
await p.evaluate(() => { const S = window.__enc.stage, f = S.updateNotes; window.__perf = { n: 0, ms: 0 };
  S.updateNotes = (dt, t) => { const a = performance.now(); try { f(dt, t); } finally { window.__perf.n++; window.__perf.ms += performance.now() - a; } }; });
const measure = (tag) => p.evaluate(([secs]) => new Promise(r => { const P = window.__perf; P.n = 0; P.ms = 0; const w0 = performance.now(); let n = 0, worst = 0, last = w0;
  const f = () => { const now = performance.now(); worst = Math.max(worst, now - last); last = now; n++; if (now - w0 < secs * 1000) requestAnimationFrame(f);
    else r({ fps: +(n / ((now - w0) / 1000)).toFixed(2), frameMs: +((now - w0) / n).toFixed(0), worstMs: +worst.toFixed(0), chapterMs: +(P.ms / Math.max(1, P.n)).toFixed(2), chapterCalls: P.n }); };
  requestAnimationFrame(f); }), [SECS]).then(m => { say(tag, JSON.stringify(m)); return m; });
await p.evaluate(() => window.__enc.stage.setPhase('hunt'));
await new Promise(r => setTimeout(r, 4000));
await measure('HUNT (first person, the court)');
await p.evaluate(() => window.__enc.stage.setPhase('fight'));
await p.waitForFunction(() => window.__enc.kit.eventActive() && window.__enc.kit.tagState().on, null, { timeout: 300000, polling: 500 });
await measure('FIGHT BRIEF');
await p.evaluate(() => document.getElementById('evBtn').click());
await p.waitForFunction(() => window.__enc.kit.tagState().live, null, { timeout: 300000, polling: 500 }).catch(() => say('(not live)'));
await measure('FIGHT LIVE');
/* (R100: the fight's own bloom, the last thing the world draws (renderOrder 1e9), taken off: what it costs) */
await p.evaluate(() => { window.__bl = []; const E = window.__enc; const sc = E.stage.plan.FLOOR.cast.pho.group.parent; let root = sc; while (root.parent) root = root.parent;
  root.traverse(o => { if (o.renderOrder >= 1e8 && o.visible) { window.__bl.push(o); o.visible = false; } }); });
await measure('FIGHT LIVE, the bloom off (' + await p.evaluate(() => window.__bl.length) + ' hidden)');
await p.evaluate(() => { for (const o of window.__bl) o.visible = true; });
await p.evaluate(() => { const g = window.__enc.stage.films; void g; });
/* the mist and the court's own painted cards hidden: what the overdraw costs */
await p.evaluate(() => { window.__hid = []; const E = window.__enc; const sc = E.stage.plan.FLOOR.cast.pho.group.parent; let root = sc; while (root.parent) root = root.parent;
  root.traverse(o => { if ((o.isMesh || o.isSprite) && o.material && o.material.transparent && o.visible && !o.isSkinnedMesh) { window.__hid.push(o); o.visible = false; } }); window.__nHid = window.__hid.length; });
await measure('FIGHT LIVE, every transparent card hidden (' + await p.evaluate(() => window.__nHid) + ')');
await p.evaluate(() => { for (const o of window.__hid) o.visible = true; const L = window.__enc.stage.films.PRAI5.list; window.__ph = L.filter(P => P.group.visible); for (const P of window.__ph) P.group.visible = false; });
await measure('FIGHT LIVE, the nine hidden');
await p.evaluate(() => { for (const P of window.__ph) P.group.visible = true; });
const info = await p.evaluate(() => { const E = window.__enc; const r = E.renderInfo ? E.renderInfo() : null; return { tag: E.kit.tagState().on, live: E.kit.tagState().live, r }; });
say('info', JSON.stringify(info));
for (const e of errs.slice(0, 8)) say(e);
await b.close();
