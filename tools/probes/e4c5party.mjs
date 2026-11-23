/* v28.0 (E4C5, R49 and R50): THE PARTY LIST PHOTOGRAPHED in the fight, at a phone's real size (390 x 844 CSS pixels at two
   device pixels a point, a touch context) and on a desktop (1280 x 800, a fine pointer: the Tab chip). Chad, R49: "a row of
   rectangle tile with skewed edge towards its end, aligned to the side edge of the screen ... tapping on each tile will
   instantly switch the character control smoothly"; R50: "visually impressive with its own animations, visual effects,
   visual cues and prompts, breathing effect". The fight set out through its lab (c_fightstage.js FS_LAB), the lesson begun.
   A CSS animation runs on the wall's clock, and on a box with no graphics card a frame takes about a second, so each moving
   moment is caught by FREEZING the page's animations at a chosen time (the Web Animations API) the instant it begins, then
   photographed, then let go. ONLY the animations the moment itself began are set to the chosen time: the ones already
   running are paused where they stand, and the ones already finished (the list's own entrance, which holds its last frame)
   are never touched (build 38's first pictures set EVERY animation to 150 ms, so the list's entrance was rewound with the
   switch and the tiles stood half off the screen, which the game never does):
     01 idle (Grandmaster Pho played: his tile lit), 02 a REAL TAP on Master Zavier's tile, frozen 0.15 s into the switch
     (the flash, the sweep, the sparks, the edge's glow), 03 the same 0.45 s in, 04 settled (his tile lit), 05 the call (the
     switch's ask: the other tile's beat and chevrons, frozen at the beat's height), then on a desktop 06 idle with the Tab
     chip and 07 after Tab.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [CHFILE=<chapter.js>] [OUT=dir] [DESK=0] node tools/probes/e4c5party.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5party'; fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const errs = [];
async function open(ctxOpts) {
  const ctx = await b.newContext(ctxOpts);
  const p = await ctx.newPage();
  if (process.env.CHFILE) { const src = fs.readFileSync(process.env.CHFILE, 'utf8'); await p.route(new RegExp('/assets/e4c5\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: src })); }
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
  await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
  await p.evaluate(() => document.getElementById('startBtn').click());
  await toPlay(p, 1500000);
  await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
  await p.evaluate(() => window.__enc.stage.setPhase('fight'));
  await p.waitForFunction(() => window.__enc.kit.eventActive() && window.__enc.kit.tagState().on, null, { timeout: 300000, polling: 500 });
  await p.evaluate(() => window.__enc.stage.snap().story.fight.lab.open());
  await p.waitForFunction(() => !window.__enc.kit.eventActive() && window.__enc.kit.tagState().live, null, { timeout: 300000, polling: 500 });
  const lab = (fn, ...a) => p.evaluate(([fn, a]) => { const L = window.__enc.stage.snap().story.fight.lab; return L[fn] ? L[fn](...a) : 'no ' + fn; }, [fn, a]);
  say('start', await lab('start'));
  await lab('place', 'pho', 0.0, 1.6); await lab('place', 'zav', 1.7, -0.6);
  /* (the lesson keeps the switch said and never pressed until its first chase shows it: the lab shows it now, as the lesson would) */
  await lab('swapOn');
  await p.waitForFunction(() => { const s = window.__enc.kit.tagState(); return s.party && s.party.tiles.length === 2 && !s.party.tiles[1].blocked; }, null, { timeout: 120000, polling: 300 });
  /* (the list's entrance played out, then held still for the pictures) */
  await p.waitForFunction(() => { const s = window.__enc.kit.tagState(); return s.party && s.party.tiles.length === 2; }, null, { timeout: 120000, polling: 300 });
  await p.waitForTimeout(1500);
  return { ctx, p, lab };
}
let n = 0;
async function pic(p, what) { const f = `${OUT}/${String(++n).padStart(2, '0')}-${what}.png`; await p.screenshot({ path: f, timeout: 300000 }); say('pic', f, JSON.stringify(await p.evaluate(() => window.__enc.kit.tagState().party))); }
/* the animations the moment begins (those not running before it) set to `ms`; those already running paused where they
   stand; finished ones left alone. window.__preA is what ran before; window.__newA what the moment began. */
const FREEZE = `window.__freezeAt = (ms) => { window.__newA = [];
  for (const a of document.getAnimations()) {
    if (window.__preA.has(a)) { if (a.playState === 'running') { try { a.pause(); } catch {} } continue; }
    window.__newA.push(a);
    try { a.pause(); const end = (a.effect && a.effect.getComputedTiming().endTime) || ms; a.currentTime = Math.min(ms, Number.isFinite(end) ? end : ms); } catch {} }
  window.__frozen = true; return window.__newA.length; };`;
const armFreeze = (p, ms) => p.evaluate(([ms, F]) => { (0, eval)(F); window.__frozen = false;
  window.__preA = new Set(document.getAnimations());
  const fx = document.getElementById('tagPartyFx');
  const mo = new MutationObserver(() => { if (!fx.children.length) return; mo.disconnect(); window.__freezeAt(ms); });
  mo.observe(fx, { childList: true }); return true; }, [ms, FREEZE]);
/* the same moment's animations moved on to `ms` (the rest stay as they were frozen) */
const freezeNow = (p, ms) => p.evaluate((ms) => { for (const a of window.__newA || []) { try { const end = (a.effect && a.effect.getComputedTiming().endTime) || ms; a.currentTime = Math.min(ms, Number.isFinite(end) ? end : ms); } catch {} } return (window.__newA || []).length; }, ms);
const thaw = (p) => p.evaluate(() => { for (const a of document.getAnimations()) { if (a.playState === 'paused') { try { a.play(); } catch {} } } return true; });

/* THE PHONE */
{ const { ctx, p } = await open({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const cdp = await ctx.newCDPSession(p);
  await pic(p, 'phone-idle');
  const r = await p.evaluate(() => { const e = document.querySelector('#tagParty .tpTile[data-id="zavier"]').getBoundingClientRect(); return { x: e.left + e.width * 0.6, y: e.top + e.height / 2 }; });
  await armFreeze(p, 150);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: r.x, y: r.y, id: 3 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await p.waitForFunction(() => window.__frozen, null, { timeout: 60000, polling: 50 });
  await pic(p, 'phone-switch-150ms');
  await freezeNow(p, 450); await pic(p, 'phone-switch-450ms');
  await thaw(p); await p.waitForTimeout(2500);
  await pic(p, 'phone-zavier');
  /* the call: the switch asks for the other one (his teacher's tile). The fight writes the switch's ask every frame from its
     own need (c_fightstage.js), so the probe asks through that same verb: kit.tagAct wrapped to add the ask for the switch,
     taken off again after. What began with the ask (the beat, the glow's quick breath, the chevrons) is frozen at 575 ms,
     the beat's height. */
  await p.evaluate((F) => { (0, eval)(F); window.__preA = new Set(document.getAnimations());
    const k = window.__enc.kit; window.__tagAct0 = k.tagAct;
    k.tagAct = (id, o) => window.__tagAct0(id, id === 'switch' ? Object.assign({}, o, { pulse: true, blocked: null }) : o); }, FREEZE);
  await p.waitForFunction(() => window.__enc.kit.tagState().party.tiles[0].ask, null, { timeout: 60000, polling: 100 });
  say('call froze', await p.evaluate(() => window.__freezeAt(575)));
  await pic(p, 'phone-call');
  await p.evaluate(() => { window.__enc.kit.tagAct = window.__tagAct0; });
  await thaw(p);
  await ctx.close(); }
/* THE DESKTOP (a fine pointer: the switch's key on the other tile) */
if (process.env.DESK !== '0') { const { ctx, p } = await open({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  await pic(p, 'desk-idle');
  await armFreeze(p, 200);
  await p.keyboard.press('Tab');
  await p.waitForFunction(() => window.__frozen, null, { timeout: 60000, polling: 50 }).catch(() => {});
  await pic(p, 'desk-tab-200ms');
  await thaw(p); await p.waitForTimeout(2500); await pic(p, 'desk-zavier');
  await ctx.close(); }
say('RESULT pictures', n, 'errors', errs.length); for (const e of errs.slice(0, 6)) say(e);
await b.close();
