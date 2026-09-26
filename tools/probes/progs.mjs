/* v15: SHADER COMPILES ON SCREEN. A program linked after the curtain lifts is
   a stall the player sees. This walks a chapter's opening film by seeking it
   (every track applied, as a player watching would see it), then play at eight
   headings, and prints every step at which the renderer's program count went
   up — with the light counts that frame drew with, since the number of lights
   of each kind is part of every lit shader.
   Usage: node tools/probes/progs.mjs <chapter…>   (STEP=0.5 seconds of film;
   OPT=lightSets:0 switches an OPT off for the run) */
import { chromium } from 'playwright';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const chs = process.argv.slice(2), STEP = +(process.env.STEP || 0.5);
const b = await chromium.launch(LAUNCH);
for (const ch of chs) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  try {
    await p.goto(PAGE + '?ch=' + ch + (process.env.OPT ? '&opt=' + process.env.OPT : ''), { waitUntil: 'load', timeout: 240000 });
    await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
    await p.click('#startBtn', { timeout: 120000 });
    await p.waitForFunction(() => ['cine', 'play'].includes(window.__enc.getState()), null, { timeout: 900000, polling: 200 });
    await p.evaluate(() => {
      const E = window.__enc;
      window.__lights = () => { const n = { dir: 0, point: 0, spot: 0, hemi: 0, sh: 0 };
        E.scene.traverseVisible(o => { if (!o.isLight) return;
          if (o.isDirectionalLight) n.dir++; else if (o.isPointLight) n.point++; else if (o.isSpotLight) n.spot++; else if (o.isHemisphereLight) n.hemi++;
          if (o.castShadow) n.sh++; });
        return `d${n.dir} p${n.point} s${n.spot} h${n.hemi} sh${n.sh}`; };
      window.__frames = (k) => new Promise(res => { let n = 0; const f = () => (++n >= k ? res() : requestAnimationFrame(f)); requestAnimationFrame(f); });
    });
    const out = [];
    const progs = () => p.evaluate(() => window.__enc.renderer.info.programs.length);
    let base = await progs();
    const film = await p.evaluate(() => window.__enc.getState() === 'cine' ? window.__enc.cine.dur() : 0);
    const start = base;
    for (let t = 0; film && t <= film; t += STEP) {
      const r = await p.evaluate(async (t) => { const E = window.__enc; if (!E.cine.active()) return null;
        E.cine.seek(t); await window.__frames(2); return { n: E.renderer.info.programs.length, l: window.__lights() }; }, t);
      if (!r) break;
      if (r.n > base) { out.push(`film ${t.toFixed(1)}s +${r.n - base} [${r.l}]`); base = r.n; }
    }
    const filmMade = base - start;
    if (film) await p.evaluate(() => { window.__enc.cine.resume(); window.__enc.cine.skip && window.__enc.cine.skip(); });
    await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 600000, polling: 200 });
    await p.evaluate(() => window.__frames(3));
    base = await progs();
    const playStart = base;
    for (let h = 0; h < 8; h++) {
      const r = await p.evaluate(async (h) => { const E = window.__enc; E.yaw.rotation.y = h * Math.PI / 4; await window.__frames(2);
        return { n: E.renderer.info.programs.length, l: window.__lights() }; }, h);
      if (r.n > base) { out.push(`play heading ${h} +${r.n - base} [${r.l}]`); base = r.n; }
    }
    console.log(`${ch}: at the lift ${start} programs; film ${film ? film.toFixed(1) + 's' : 'none'} made ${filmMade}, play made ${base - playStart}, total programs ${base}` +
                (out.length ? '\n   ' + out.join('\n   ') : '') + (errs.length ? '\n   ERRORS ' + errs.slice(0, 3).join(' | ') : ''));
  } catch (e) { console.log(ch + ': PROBE FAILED ' + e.message.split('\n')[0]); }
  await ctx.close();
}
await b.close();
