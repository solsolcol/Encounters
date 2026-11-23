/* v28.0 (E4C5, R49 and R50): THE PARTY LIST'S TWO PORTRAITS, photographed from the game's own bodies. Chad, R49: "It should
   show the character potraits with the name". Grandmaster Pho's likeness never goes to a picture service (his model is
   made from photographs of a real man), so his portrait, and his student's beside it, are the game's own renders: the
   fight set out through its lab (c_fightstage.js FS_LAB), the tag mode left so the lens is the probe's, everything but
   the one body hidden, the court's light kept, a dark backdrop, the lens in front of his face at a portrait's lens
   (FOV 22) from 1.05 m, a little above his eyes. Each in three turns of his head to the lens (0, 12 and -12 degrees of
   the lens round him), at 1100 x 1100 CSS pixels at one device pixel each. OUT/<who>-<turn>.png; the crop and the grade
   are portraits.py's (masters/v28.0/props/portraits.py).
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [CHFILE=<chapter.js>] [OUT=dir] node tools/probes/e4c5portrait.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5portrait'; fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 1100, height: 1100 }, deviceScaleFactor: 1 });
const p = await ctx.newPage(); const errs = [];
if (process.env.CHFILE) { const src = fs.readFileSync(process.env.CHFILE, 'utf8'); await p.route(new RegExp('/assets/e4c5\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: src })); }
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
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
const lab = (fn, ...a) => p.evaluate(([fn, a]) => { const L = window.__enc.stage.snap().story.fight.lab; return L[fn] ? L[fn](...a) : 'no ' + fn; }, [fn, a]);
say('start', await lab('start'));
await lab('place', 'pho', -1.2, 1.0); await lab('place', 'zav', 1.2, 1.0);
await frames(20);
/* the lens the probe's: the mode left, the HUD out of the picture */
await p.evaluate(() => { const k = window.__enc.kit; if (k.tag().on) k.tag(null, null);
  const st = document.createElement('style'); st.textContent = 'body *:not(canvas){visibility:hidden !important} canvas{visibility:visible !important}'; document.head.appendChild(st); });
await frames(6);
for (const who of ['pho', 'zav']) {
  for (const [tag, turn] of [['0', 0], ['l', 12], ['r', -12]]) {
    const info = await p.evaluate(([who, turn]) => {
      const E = window.__enc, cast = E.stage.plan.FLOOR.cast, P = cast[who], T = E.THREE || window.THREE;
      if (!P || !P.group) return 'no body ' + who;
      /* everything but this body hidden (kept in a list, so the next one can be shown again) */
      const keep = new Set(); P.group.traverse(o => keep.add(o));
      window.__hid = window.__hid || [];
      for (const o of window.__hid) o.visible = true; window.__hid = [];
      E.scene.traverse(o => { if ((o.isMesh || o.isPoints || o.isSprite || o.isLine) && !keep.has(o) && o.visible) { o.visible = false; window.__hid.push(o); } });
      /* his head: the rig's own bone named Head (the first whose name ends so) */
      let head = null; P.group.traverse(o => { if (!head && o.isBone && /head$/i.test(o.name) && !/end|top/i.test(o.name)) head = o; });   // (Head, mixamorigHead: never HeadTop_End)
      if (!head) return 'no head bone';
      P.group.updateWorldMatrix(true, true);
      const h = new head.position.constructor(); head.getWorldPosition(h);
      const ry = P.group.rotation.y + turn * Math.PI / 180, d = 1.0;
      /* the rig: the yaw at his eye's height in front of him (a turn of 0 looks toward -z, so his own turn looks back at
         him), the pitch level, the lens at the yaw's own place, the play lens narrowed (kit.lens) */
      E.yaw.position.set(h.x + Math.sin(ry) * d, h.y + 0.09, h.z + Math.cos(ry) * d);
      E.yaw.rotation.y = ry; E.pitch.rotation.x = 0;
      E.camera.position.set(0, 0, 0); E.camera.rotation.set(0, 0, 0);
      if (E.kit.lens) E.kit.lens(26, { secs: 0 });
      if (E.scene.background && E.scene.background.isColor) E.scene.background.set(0x0b0d12);
      return { head: [h.x, h.y, h.z].map(v => +v.toFixed(3)), bone: head.name, ry: +ry.toFixed(3) };
    }, [who, turn]);
    say(who, tag, JSON.stringify(info));
    await frames(8);
    const f = `${OUT}/${who}-${tag}.png`;
    await p.screenshot({ path: f, timeout: 300000 }); say('pic', f);
  }
}
say('RESULT errors', errs.length); for (const e of errs.slice(0, 5)) say(e);
await b.close();
