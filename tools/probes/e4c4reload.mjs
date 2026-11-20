/* v27.0 build 54 (Chad, 20 Nov 2026, R133 to R136): THE RELOAD BY THE GOLD ICON, R ON A DESKTOP, THE WATER AT HER ALTAR,
   THE FIGHT'S OBJECTIVE, driven in the real fight through the real input path: a save seeded at the blessing with the
   water taken, Continue pressed on the title, the brief read and its START pressed, the bowl emptied by real flicks, then
   reloaded the way each device does it. Every step is photographed and its numbers read off the page.
   MODE=phone (the default; 390 x 844 CSS points drawn at two pixels a point, a touch context):
     01 the brief says "Tap the gold icon above the holy water bowl to reload."
     02 in the fight: no reload button drawn; the objective reads "Keep the green spirits away from Amma by using the holy
        water."
     03 the bowl emptied by taps on FLICK; one more tap: "Out of holy water. Tap the gold icon above the holy water bowl."
     04 the lens on the icon from where play puts him (its distance said: farther than the old 1.5 m)
     05 a tap well off the icon: nothing filled
     06 a tap on the icon: the bowl full at once
     07 the lens on her altar, FLICK tapped: the water goes (a flick spent), no "Not at her altar."
   MODE=desktop (1280 x 800, no touch: a mouse and a keyboard):
     01 the brief says "Press R to reload."; 02 as the phone's; 03 emptied by Space, the dry words "Out of holy water. Press
     R to reload."; 04 turned away from the bowl, R pressed: full; 05 a flick spent, the mouse free (no lock), a click on the
     icon: full; 06 at her altar, Space: the water goes.
   Her life is held at 60 or more while the probe works (said). Every page error is printed; the run exits non-zero on one
   or on a failed check.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [MODE=phone|desktop] [DSF=2] node tools/probes/e4c4reload.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const MODE = process.env.MODE || 'phone';
const PHONE = MODE !== 'desktop';
const OUT = process.env.OUT || '/tmp/e4c4reload-' + MODE;
fs.mkdirSync(OUT, { recursive: true });
const W = PHONE ? 390 : 1280, H = PHONE ? 844 : 800, DSF = +(process.env.DSF || (PHONE ? 2 : 1));
const SPAWN = { x: 0.15, y: 1.62, z: 1.0 };
const ALTAR = { x: -0.15, y: 1.25, z: 5.15 };                    // (b_flat.js ALTAR: her shelf at 1.5 m; the lens on its middle)
const PH = 'bless:r,m,f,o,a,k,p,v,l1,l2,l3,w';
const BRIEF = PHONE ? 'Tap the gold icon above the holy water bowl to reload.' : 'Press R to reload.';
const DRY = PHONE ? 'Out of holy water. Tap the gold icon above the holy water bowl.' : 'Out of holy water. Press R to reload.';
const OBJ = 'Keep the green spirits away from Amma by using the holy water.';
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(PHONE ? { viewport: { width: W, height: H }, deviceScaleFactor: DSF, hasTouch: true, isMobile: true }
                                     : { viewport: { width: W, height: H }, deviceScaleFactor: DSF });
const save = { v: 2, ch: 'e4c4', stats: { sanity: 90, awareness: 55, wisdom: 52 }, inv: { gear: {}, bag: [] }, phase: PH,
               conduct: { s: 0, a: 0, notes: [] }, choices: {}, at: SPAWN, done: false, t: 1 };
await ctx.addInitScript(s => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('mz.encounters.checkpoint', s); sessionStorage.setItem('seeded', '1'); } }, JSON.stringify(save));
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
/* a press on an element the way this device presses: a tap, or the mouse */
const press = async (sel) => { const bb = await p.locator(sel).boundingBox(); if (!bb) return false;
  const x = Math.round(bb.x + bb.width / 2), y = Math.round(bb.y + bb.height / 2);
  if (PHONE) await p.touchscreen.tap(x, y); else await p.mouse.click(x, y); return true; };
let shotN = 0;
const shot = async (tag) => { await frames(3); try { await p.screenshot({ path: `${OUT}/${String(++shotN).padStart(2, '0')}-${tag}.png`, timeout: 240000 }); } catch { log('  (a slow frame: no picture)'); } };
const until = (fn, ms, arg) => p.waitForFunction(fn, arg, { timeout: ms, polling: 200 }).then(() => true, () => false);
const checks = {};
const rounds = () => p.evaluate(() => window.__enc.ownState().rounds);
const keepHer = () => p.evaluate(() => { const F = window.__enc.stage.dbg.play.fight; if (F && F.on && F.hp < 60) F.hp = 60; });
const words = () => p.evaluate(() => { const nf = document.getElementById('nofire'); return nf ? { text: nf.textContent.trim(), on: nf.classList.contains('on') } : null; });
/* the lens turned onto a point */
const aimAt = (q) => p.evaluate((q) => { const E = window.__enc, Y = E.yaw, P = E.pitch;
  const dx = q.x - Y.position.x, dz = q.z - Y.position.z, d = Math.hypot(dx, dz);
  Y.rotation.y = Math.atan2(-dx, -dz); P.rotation.x = Math.max(-1.2, Math.min(1.2, Math.atan2(q.y - Y.position.y, Math.max(0.05, d)))); return +d.toFixed(2); }, q);
/* the gold icon: where it stands, and where it is on the screen */
const sign = () => p.evaluate(() => { const E = window.__enc; let m = null;
  E.stage.pile.group.parent.traverse(o => { if (o.isSprite && o.renderOrder === 29 && o.material && o.material.toneMapped === false) m = o; });
  if (!m) return null;
  const cam = E.camera; cam.updateWorldMatrix(true, false); cam.matrixWorldInverse.copy(cam.matrixWorld).invert();
  const w = m.getWorldPosition(m.position.clone()), v = w.clone().project(cam), Y = E.yaw;
  return { x: +w.x.toFixed(3), y: +w.y.toFixed(3), z: +w.z.toFixed(3), sx: Math.round((v.x + 1) / 2 * innerWidth), sy: Math.round((1 - v.y) / 2 * innerHeight),
           front: v.z > -1 && v.z < 1, vis: m.visible, op: +m.material.opacity.toFixed(3), from: +Math.hypot(w.x - Y.position.x, w.z - Y.position.z).toFixed(2) }; });
/* flicks until the bowl is empty (each after the flick's own gap) */
const emptyIt = async () => { for (let i = 0; i < 40 && (await rounds()) > 0; i++) {
  if (PHONE) await press('#fireBtn'); else await p.keyboard.press('Space');
  await p.waitForTimeout(420); if (i % 5 === 4) await keepHer(); } return rounds(); };

await p.goto(PAGE, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await frames(2);
await press('#startBtn');
log('Continue pressed');
checks.briefOpens = await until(() => window.__enc.getState() === 'event', 1800000);   // (build 54: the chapter's boot took 908 s beside a second browser)
const briefText = await p.evaluate(() => (document.getElementById('event') || document.body).innerText.replace(/\s+/g, ' '));
checks.briefSays = briefText.includes(BRIEF);
checks.briefNoOldWords = !/Refill at his bowl|arrow button/.test(briefText);
log('01 brief:', briefText.slice(0, 600));
await shot('brief');
await press('#evBtn');
checks.fightOn = await until(() => { const D = window.__enc.stage.dbg; return window.__enc.getState() === 'play' && D.play.fight && D.play.fight.on; }, 300000);
await until(() => document.body.classList.contains('weaponUp'), 60000);
await keepHer();
const hud = await p.evaluate(() => { const rb = document.getElementById('reloadBtn'), fb = document.getElementById('fireBtn');
  return { noReload: document.body.classList.contains('wpnNoReload'), rbShown: rb ? getComputedStyle(rb).display !== 'none' : null,
           fbShown: fb ? getComputedStyle(fb).display !== 'none' : null, obj: (document.getElementById('objTxt') || {}).textContent || '' }; });
log('02 hud:', JSON.stringify(hud));
checks.noReloadButton = hud.noReload && hud.rbShown === false && hud.fbShown === true;
checks.objective = hud.obj.trim() === OBJ || await until((o) => ((document.getElementById('objTxt') || {}).textContent || '').trim() === o, 60000, OBJ);   // (it eases in after the order's beat)
await shot('fight-hud');

/* a full bowl is the weapon's own count (build 55's desktop drive found 13 here: one flick already spent by the time
   the fight was on, its cause not yet traced; the first read is not "full") */
const full = await p.evaluate(() => window.__CHAPTERS__.e4c4.weapon.rounds), first = await rounds();
log('03 the bowl holds', first, 'of', full);
checks.fullAtStart = first === full;
const left = await emptyIt();
await keepHer();
if (PHONE) await press('#fireBtn'); else await p.keyboard.press('Space');
await frames(2);
const dry = await words();
log('03 emptied to', left, 'dry words:', JSON.stringify(dry));
checks.emptied = left === 0;
checks.dryWords = !!dry && dry.text === DRY;
await shot('dry');

if (PHONE) {
  /* 04: the lens on the icon, from where play put him */
  await until(() => { const E = window.__enc; let m = null; E.stage.pile.group.parent.traverse(o => { if (o.isSprite && o.renderOrder === 29 && o.material && o.material.toneMapped === false) m = o; });
    return m && m.visible && m.material.opacity > 0.98; }, 60000);
  let s = await sign(); await aimAt({ x: s.x, y: s.y - 0.25, z: s.z }); await frames(3);
  s = await sign(); log('04 the icon', JSON.stringify(s));
  checks.iconFar = s.from > 1.5;                                  // (the old rule refused a dip past 1.5 m of the bowl)
  checks.iconOnScreen = s.front && s.sx > 0 && s.sx < W && s.sy > 0 && s.sy < H;
  await keepHer(); await shot('icon');
  /* 05: a tap well off it */
  await p.touchscreen.tap(Math.max(8, s.sx - 150), s.sy); await p.waitForTimeout(500);
  checks.offTapNothing = (await rounds()) === 0;
  /* 06: a tap on it */
  await p.touchscreen.tap(s.sx, s.sy);
  checks.tapReloads = await until((n) => window.__enc.ownState().rounds === n, 20000, full);
  log('06 after the tap:', await rounds());
  await shot('reloaded');
} else {
  /* 04: turned away from the bowl, R */
  const s = await sign();
  await aimAt({ x: ALTAR.x - 3, y: 1.6, z: ALTAR.z - 6 });        // (the far side of the room from his teacher's bowl)
  await frames(2);
  const off = await sign(); log('04 the icon from here', JSON.stringify(off));
  checks.iconOffScreenOrFar = !(off.front && off.sx > 0 && off.sx < W && off.sy > 0 && off.sy < H) || off.from > 1.5;
  await p.keyboard.press('KeyR');
  checks.keyReloadsAnywhere = await until((n) => window.__enc.ownState().rounds === n, 20000, full);
  log('04 after R:', await rounds(), 'from', s.from, 'm');
  await shot('r-anywhere');
  /* 05: a flick spent, the mouse free, a click on the icon */
  await p.waitForTimeout(400); await p.keyboard.press('Space'); await p.waitForTimeout(400);
  const spent = await rounds();
  const locked = await p.evaluate(() => { if (document.pointerLockElement) document.exitPointerLock(); return !!document.pointerLockElement; });
  await frames(2);
  let t = await sign(); await aimAt({ x: t.x, y: t.y - 0.25, z: t.z }); await frames(3); t = await sign();
  log('05 spent to', spent, 'lock was', locked, 'icon', JSON.stringify(t));
  await p.mouse.click(t.sx, t.sy);
  checks.clickReloads = spent === full - 1 && await until((n) => window.__enc.ownState().rounds === n, 20000, full);
  await shot('click-icon');
}

/* 07 (desktop 06): at her altar */
await keepHer();
await aimAt(ALTAR); await frames(3);
await p.waitForTimeout(450);
const before = await rounds();
if (PHONE) await press('#fireBtn'); else await p.keyboard.press('Space');
await frames(2);
const after = await rounds(), aw = await words();
log('07 at her altar: rounds', before, '->', after, 'words', JSON.stringify(aw));
checks.altarFlicks = after === before - 1;
checks.altarNoRefusal = !(aw && aw.on && /altar/i.test(aw.text)) && !(await p.evaluate(() => document.body.classList.contains('wpnBlocked')));
await shot('altar-flick');

checks.noPageErrors = errs.filter(e => e.startsWith('PAGEERROR')).length === 0;
log('CHECKS', JSON.stringify(checks));
if (errs.length) log('ERRORS\n' + errs.join('\n'));
await b.close();
process.exit(Object.values(checks).every(v => v === true) ? 0 : 1);
