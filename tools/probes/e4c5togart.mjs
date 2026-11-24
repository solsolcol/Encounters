/* v28.0 (E4C5, R107) · THE TOGETHER CALL WITH ITS PAINTING, photographed in the fight at a phone's real size (390 x 844 CSS px at two device px, a touch context): the fight's lab set to its surge (lab.toSurge), the call waited for, the whole phone and the button's own piece at full size. usage: ENC_DIST=<dist> OUT=<dir> node tools/probes/e4c5togart.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT; fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const errs = [];
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage();
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
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
await lab('place', 'pho', 0.0, 1.6); await lab('place', 'zav', 1.7, -0.6);   // (off the walls: TOGETHER waits for both to stand clear of them)
await lab('swapOn');
await p.waitForTimeout(1500);
say('toSurge', JSON.stringify(await lab('toSurge')));
const fstate = () => p.evaluate(() => { const f = window.__enc.stage.snap().story.fight; return JSON.stringify({ stage: f.stage, stageT: f.stageT, who: f.who, left: f.left, act: f.act }); });
for (let i = 0; i < 6; i++) { await p.waitForTimeout(5000); say('fight', await fstate(), JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('.tagBtn')].map(e => e.className + ':' + getComputedStyle(e).display)))); }
await p.waitForFunction(() => { const e = document.querySelector('.tagBtn.art'); if (!e) return false; const r = e.getBoundingClientRect(); return r.width > 10 && getComputedStyle(e).display !== 'none' && getComputedStyle(e).visibility !== 'hidden'; }, null, { timeout: 300000, polling: 300 });
await p.waitForTimeout(2500);
const info = await p.evaluate(() => { const e = document.querySelector('.tagBtn.art'); const r = e.getBoundingClientRect(); const im = e.querySelector('canvas,img'); return { cls: e.className, r: [r.x, r.y, r.width, r.height].map(v => +v.toFixed(1)), inner: im ? [im.tagName, im.width, im.height] : null, text: e.textContent.trim() }; });
say('button', JSON.stringify(info));
await p.screenshot({ path: OUT + '/phone-together.png', timeout: 300000 });
const r = info.r, pad = 30;
await p.screenshot({ path: OUT + '/phone-together-crop.png', clip: { x: Math.max(0, r[0] - pad), y: Math.max(0, r[1] - pad), width: r[2] + 2 * pad, height: r[3] + 2 * pad }, timeout: 300000 });
say('errors', errs.length ? errs.join(' / ') : 'none');
await b.close();
