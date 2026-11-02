// v24.29 · THE SHINE, BEFORE AND AFTER — three honours a material's envMapIntensity now (tools/patchthree.mjs: it
// multiplies its scene's environmentIntensity). On a PHONE (390x844 touch, DPR 2 -> the engine's 1.6) each picture is
// the same frame drawn twice with the clock held still — AFTER as the build draws it, BEFORE as every earlier build did
// (every material lit by its scene's environment put back to 1; and, reading a v24.29 build, episode 3 chapter 4's two
// amulets — their own envMap at 0.25 in that build only — back on the scene's environment) — side by side, with how many
// pixels changed. It first prints the CENSUS: every material whose shine
// changed (its scene, its lift, the strength it is drawn at before -> after); an empty census is a chapter drawn bit for
// bit as before.
//   ENC_DIST=<snap> CHROMIUM_PATH=... CH=e4c1 [PHASE=<bookmark>] [SETUP=torch,rifle] [VIEWS='tag:x,y,z,yawDeg,pitchDeg;…']
//     [TARGETS=n] [TS=0.5,4] (the opening film at those seconds) [ITEMS=id,id] node tools/probes/shine.mjs <outdir>
//   (a VIEWS tag with no numbers photographs wherever the chapter has put him)
//   BRACKET=0.05,0.1,0.15 draws every changed material at each of those strengths instead, side by side, labelled
//   AT='x,y,z,yawDeg,pitchDeg' stands him there (a teleport) before the SETUP; SETUP=hold puts the chapter's held thing in
//   his hand through its probe handle, stage.holdTry(HOLD) (HOLD=x,y,z, the offset the chapter itself uses); SETUP=press
//   presses E (the real key) once PREWAIT holds and then waits for WAIT — each an expression on the page (e.g. the
//   chapter's own state: quiet, then a beat reached); SETUP=eval runs EVAL on the page (a chapter's own probe handle,
//   e.g. stage.trayTry('lersi')). The canvas's own CSS filter (kit.chill's dim and drain) is drawn into every picture; the chill's edge layers
//   are not.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
const req = createRequire(new URL('../../package.json', import.meta.url).pathname);
const PW = await import(pathToFileURL(req.resolve('playwright')).href);
const chromium = PW.chromium || (PW.default && PW.default.chromium);
const sharp = (await import(pathToFileURL(req.resolve('sharp')).href)).default;
const { LAUNCH, PAGE, toPlay } = await import(new URL('../../testlib.mjs', import.meta.url).href);
const OUT = process.argv[2] || 'shine'; fs.mkdirSync(OUT, { recursive: true });
const CH = process.env.CH || 'e4c1', TS = process.env.TS ? process.env.TS.split(',').map(Number) : [];
const VIEWS = (process.env.VIEWS || '').split(';').filter(Boolean).map(s => { const [tag, v] = s.split(':'); return [tag, ...(v ? v.split(',').map(Number) : [])]; });   // a bare tag: wherever the chapter puts him
const ITEMS = (process.env.ITEMS || '').split(',').filter(Boolean), TARGETS = +(process.env.TARGETS || 0);
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('console ' + m.text().slice(0, 200)); });
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
await p.goto(PAGE + '?ch=' + CH, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
/* the page's half: the census, BEFORE on and off, a frame drawn as the engine draws it (the world, then the hands) */
/* (episode 3 chapter 4's amulets are the only materials v24.29 moved onto their own envMap, at 0.25 — v24.30 put them
   back on the scene's environment with a lift, which the census reads like any other; episode 3 chapter 3 has an
   unrelated 0.25 of its own, so the value counts only in that chapter) */
await p.addScriptTag({ content: `
window.__shineKit = {
  ownV: ${CH === 'e3c4' ? 0.25 : 'null'},
  vm() { let v = window.__enc.handsRoot; while (v && v.parent) v = v.parent; return v; },
  roots() { const E = window.__enc, out = [['world', E.scene], ['hands', this.vm()]]; const iv = E.ivScene && E.ivScene(); if (iv) out.push(['closeup', iv]); return out; },
  census() {
    const out = [], seen = new Set();
    for (const [name, root] of this.roots()) { if (!root) continue; const envI = root.environmentIntensity, env = root.environment;
      root.traverse(o => { if (!o.isMesh && !o.isPoints) return; for (const m of [].concat(o.material)) {
        if (!m || seen.has(m) || !('envMapIntensity' in m)) continue; seen.add(m);
        if (m.envMap === null && m.envMapIntensity !== 1 && env) out.push({ scene: name, mat: m.name || m.type, lift: m.envMapIntensity, before: +envI.toFixed(4), after: +(envI * m.envMapIntensity).toFixed(4) });
        else if (m.envMap && m.envMap === window.__enc.scene.environment && m.envMapIntensity === window.__shineKit.ownV) out.push({ scene: name, mat: m.name || m.type, lift: 'own 0.25', before: +envI.toFixed(4), after: 0.25 });
      } }); }
    return out;
  },
  stash: new Map(),
  before(on) {
    if (on) for (const [, root] of this.roots()) { if (!root) continue; root.traverse(o => { if (!o.isMesh && !o.isPoints) return; for (const m of [].concat(o.material)) {
      if (!m || this.stash.has(m) || !('envMapIntensity' in m)) continue;
      if (m.envMap === null && m.envMapIntensity !== 1) { this.stash.set(m, { i: m.envMapIntensity, e: null }); m.envMapIntensity = 1; }
      else if (m.envMap && m.envMap === window.__enc.scene.environment && m.envMapIntensity === window.__shineKit.ownV) { this.stash.set(m, { i: m.envMapIntensity, e: m.envMap }); m.envMap = null; m.envMapIntensity = 1; m.needsUpdate = true; }
    } }); }
    else { for (const [m, s] of this.stash) { m.envMapIntensity = s.i; if (s.e) { m.envMap = s.e; m.needsUpdate = true; } } this.stash.clear(); }
  },
  /* a BRACKET: every changed material drawn at one strength E (what the scene's environment is multiplied to); restore()
     puts them back */
  at(E) { for (const [, root] of this.roots()) { if (!root) continue; const envI = root.environmentIntensity || 1; root.traverse(o => { if (!o.isMesh && !o.isPoints) return; for (const m of [].concat(o.material)) {
      if (!m || !('envMapIntensity' in m)) continue; const s = this.stash.get(m);
      const lifted = s ? true : (m.envMap === null && m.envMapIntensity !== 1) || (m.envMap && m.envMap === window.__enc.scene.environment && m.envMapIntensity === window.__shineKit.ownV);
      if (!lifted) continue; if (!s) this.stash.set(m, { i: m.envMapIntensity, e: m.envMap });
      m.envMapIntensity = m.envMap ? E : E / envI;
    } }); } },
  restore() { this.before(false); },
  draw() { const E = window.__enc, R = E.renderer; R.render(E.scene, E.camera);
    if (E.vmVisible && E.vmVisible()) { R.autoClear = false; R.clearDepth(); R.render(this.vm(), E.vmCam); R.autoClear = true; }
    const c = R.domElement, f = c.style.filter; if (!f) return c.toDataURL('image/png');
    /* the canvas's CSS filter (the cold's dim and drain) as the screen shows it */
    const o = document.createElement('canvas'); o.width = c.width; o.height = c.height; const x = o.getContext('2d'); x.filter = f; x.drawImage(c, 0, 0);
    this.filtered = f; return o.toDataURL('image/png'); }
};` });
const decode = async (url) => { const { data, info } = await sharp(Buffer.from(url.split(',')[1], 'base64')).removeAlpha().raw().toBuffer({ resolveWithObject: true }); return { data, info }; };
async function pair(tag, aUrl, bUrl, crop) {
  let A = await decode(aUrl), B = await decode(bUrl);
  if (crop) { const cut = async (X) => { const { data, info } = await sharp(X.data, { raw: X.info }).extract(crop).raw().toBuffer({ resolveWithObject: true }); return { data, info }; }; A = await cut(A); B = await cut(B); }
  let n = 0, big = 0, sum = 0; for (let i = 0; i < A.data.length; i += 3) { const d = Math.abs(A.data[i] - B.data[i]) + Math.abs(A.data[i + 1] - B.data[i + 1]) + Math.abs(A.data[i + 2] - B.data[i + 2]); if (d) { n++; sum += d; if (d > 30) big++; } }
  const w = A.info.width, h = A.info.height, gap = 10;
  const sheet = await sharp({ create: { width: w * 2 + gap, height: h, channels: 3, background: '#ffffff' } })
    .composite([{ input: await sharp(B.data, { raw: B.info }).png().toBuffer(), left: 0, top: 0 }, { input: await sharp(A.data, { raw: A.info }).png().toBuffer(), left: w + gap, top: 0 }])
    .jpeg({ quality: 86 }).toBuffer();
  fs.writeFileSync(`${OUT}/${tag}.jpg`, sheet);
  log(tag, JSON.stringify({ px: w * h, changed: n, over30: big, mean: n ? +(sum / n).toFixed(1) : 0 }), '-> before | after');
}
/* AFTER and BEFORE of the frame as it stands, the wall clock held still between them */
const BRACKET = process.env.BRACKET ? process.env.BRACKET.split(',').map(Number) : null;
async function bracket(tag) {
  const urls = await p.evaluate((B) => { const K = window.__shineKit, now0 = performance.now(), real = performance.now.bind(performance); performance.now = () => now0;
    const out = []; try { for (const E of B) { K.at(E); window.__enc.stage.updateNotes(0, 0); out.push(K.draw()); K.restore(); } } finally { K.restore(); performance.now = real; } return out; }, BRACKET);
  const ims = []; for (const u of urls) ims.push(await decode(u));
  const w = ims[0].info.width, h = ims[0].info.height, gap = 10, H = h + 44;
  const comps = []; for (const [i, X] of ims.entries()) { comps.push({ input: await sharp(X.data, { raw: X.info }).png().toBuffer(), left: i * (w + gap), top: 44 });
    comps.push({ input: Buffer.from(`<svg width="${w}" height="44"><text x="10" y="32" font-size="30" font-family="sans-serif" fill="#000">${BRACKET[i]}</text></svg>`), left: i * (w + gap), top: 0 }); }
  const sheet = await sharp({ create: { width: ims.length * (w + gap) - gap, height: H, channels: 3, background: '#ffffff' } }).composite(comps).jpeg({ quality: 84 }).toBuffer();
  fs.writeFileSync(`${OUT}/${tag}-bracket.jpg`, sheet); log(tag, 'bracket', BRACKET.join(' / '));
}
async function ab(tag) {
  if (BRACKET) return bracket(tag);
  const r = await p.evaluate(() => { const K = window.__shineKit, now0 = performance.now(), real = performance.now.bind(performance); performance.now = () => now0;
    try { window.__enc.stage.updateNotes(0, 0); const a = K.draw(); K.before(true); window.__enc.stage.updateNotes(0, 0); const b = K.draw(); K.before(false); return { a, b }; }
    finally { K.before(false); performance.now = real; } });
  await pair(tag, r.a, r.b);
}
const setAim = (v) => p.evaluate((v) => { window.__aimAt = v; const E = window.__enc; if (v) { E.yaw.position.set(v.x, v.y, v.z); E.yaw.rotation.y = v.ry; E.pitch.rotation.x = v.pt; } }, v);
await p.evaluate(() => { const E = window.__enc, R = E.renderer, orig = R.render.bind(R);
  R.render = (sc, cam) => { const a = window.__aimAt; if (a && sc === E.scene) { E.yaw.position.set(a.x, a.y, a.z); E.yaw.rotation.y = a.ry; E.pitch.rotation.x = a.pt; } return orig(sc, cam); }; });
if (TS.length) {
  await p.waitForFunction(() => window.__enc.cine && window.__enc.cine.active() && window.__enc.getState() === 'cine', null, { timeout: 1500000, polling: 500 });
  await p.waitForFunction(() => window.__enc.cine.t() > 0.2, null, { timeout: 600000, polling: 300 });
  for (const t of TS) { await p.evaluate((t) => window.__enc.cine.seek(t), t); await frames(3); await p.waitForTimeout(1500); await ab(`film-${t}`); }
}
await toPlay(p, 1500000);
await p.waitForFunction(() => window.__enc.loads().pending === 0, null, { timeout: 600000, polling: 500 });
await p.waitForTimeout(4000);
if (process.env.PHASE) {
  await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), process.env.PHASE);
  await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 600000, polling: 500 });
  await p.waitForFunction(() => window.__enc.kit.getFade() < 0.02, null, { timeout: 900000, polling: 500 });
  await p.waitForTimeout(3000);
}
if (process.env.AT) { const [x, y, z, yd, pd] = process.env.AT.split(',').map(Number);
  /* an empty y keeps his own eye height */
  await p.evaluate((v) => { const E = window.__enc; E.yaw.position.set(v.x, v.y === null ? E.yaw.position.y : v.y, v.z); E.yaw.rotation.y = v.ry; E.pitch.rotation.x = v.pt; }, { x, y: Number.isFinite(y) && process.env.AT.split(',')[1] !== '' ? y : null, z, ry: yd * Math.PI / 180, pt: pd * Math.PI / 180 });
  await frames(4); log('at', process.env.AT); }
for (const s of (process.env.SETUP || '').split(',').filter(Boolean)) {
  if (s === 'press') {
    if (process.env.PREWAIT) await p.waitForFunction(process.env.PREWAIT, null, { timeout: 900000, polling: 1000 })
      .then(() => log('setup press: ready', process.env.PREWAIT), () => log('setup press: NEVER ready', process.env.PREWAIT));
    await p.keyboard.press('KeyE'); log('setup press: E');
    if (process.env.WAIT) await p.waitForFunction(process.env.WAIT, null, { timeout: 1500000, polling: 1000 })
      .then(() => log('setup press: reached', process.env.WAIT), () => log('setup press: NEVER reached', process.env.WAIT));
    await frames(4); await p.waitForTimeout(1500); continue;
  }
  if (s === 'eval') {
    log('setup eval', process.env.EVAL, '->', await p.evaluate((x) => { try { return String(eval(x)); } catch (e) { return 'THREW ' + e.message; } }, process.env.EVAL || ''));
    await frames(4); await p.waitForTimeout(2500); continue;
  }
  if (s === 'hold') {
    const HOLD = (process.env.HOLD || '').split(',').filter(Boolean).map(Number);
    log('setup hold', await p.evaluate((h) => { const S = window.__enc.stage; return S && S.holdTry ? (S.holdTry(h.length === 3 ? h : undefined), 'held at ' + h.join(',')) : 'no holdTry'; }, HOLD));
    await frames(4); await p.waitForTimeout(1500); continue;
  }
  log('setup', s, await p.evaluate((s) => { const K = window.__enc.kit; if (s === 'torch') return K.torchOn ? (K.torchOn(true), 'on') : 'no torch';
    if (s === 'rifle') return K.weaponOut ? (K.weaponOut(true), 'out') : 'no rifle'; return 'unknown'; }, s));
  /* the torch and the rifle come up on the frame clock (a swap of the hand): wait for the thing itself to be drawn — a
     lifted material on a drawn mesh in the hands' scene — not for a time */
  await p.waitForFunction(() => { const K = window.__shineKit, v = K.vm(); let up = false; const vis = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
    v.traverse(o => { if (o.isMesh && vis(o)) for (const m of [].concat(o.material)) if (m && m.envMap === null && m.envMapIntensity !== 1) up = true; }); return up; }, null, { timeout: 300000, polling: 300 })
    .then(() => log('setup', s, 'drawn in the hand'), () => log('setup', s, 'NEVER DRAWN in the hand'));
  await frames(4); await p.waitForTimeout(1500);
}
log('census', JSON.stringify(await p.evaluate(() => window.__shineKit.census()), null, 0).replace(/},{/g, '},\n  {'));
for (const [tag, x, y, z, yd, pd] of VIEWS) { if (pd === undefined) { await frames(4); await ab(tag); continue; } await setAim({ x, y, z, ry: yd * Math.PI / 180, pt: pd * Math.PI / 180 }); await frames(4); await ab(tag); }
if (TARGETS) {
  /* each changed material's nearest drawn mesh in the world, framed from the player's side at three times its size */
  const tg = await p.evaluate((n) => { const E = window.__enc, V = E.yaw.position.constructor, me = E.yaw.position.clone(), out = [], used = new Set();
    const vis = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
    const cands = []; E.scene.traverse(o => { if (!o.isMesh || !vis(o)) return; for (const m of [].concat(o.material)) if (m && 'envMapIntensity' in m && ((m.envMap === null && m.envMapIntensity !== 1) || (m.envMap && m.envMapIntensity === window.__shineKit.ownV))) { cands.push([o, m]); break; } });
    for (const [o, m] of cands) { if (used.has(m)) continue; o.updateWorldMatrix(true, false); if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
      const c = o.geometry.boundingSphere.center.clone().applyMatrix4(o.matrixWorld), r = o.geometry.boundingSphere.radius * o.matrixWorld.getMaxScaleOnAxis();
      if (o.isInstancedMesh) continue;
      out.push({ m: m.name || m.type, c: c.toArray(), r, d: c.distanceTo(me) }); used.add(m); }
    out.sort((a, b) => a.d - b.d); return out.slice(0, n).map(t => { const c = new V(...t.c), dir = me.clone().sub(c); dir.y = 0; if (dir.lengthSq() < 1e-6) dir.set(0, 0, 1); dir.normalize();
      /* a small thing (an amulet on a counter) from above, as a hand would hold it to the eye; a large one from the side */
      const small = t.r < 0.15, dist = small ? 0.3 : Math.max(0.25, Math.min(6, t.r * 3)), eye = c.clone().addScaledVector(dir, small ? dist * 0.55 : dist); eye.y = c.y + (small ? dist * 0.85 : dist * 0.25);
      const dx = c.x - eye.x, dz = c.z - eye.z; return { m: t.m, x: eye.x, y: eye.y, z: eye.z, ry: Math.atan2(-dx, -dz), pt: Math.atan2(c.y - eye.y, Math.hypot(dx, dz)), r: +t.r.toFixed(2) }; }); }, TARGETS);
  for (const [i, t] of tg.entries()) { log('target', t.m, 'r', t.r); await setAim(t); await frames(4); await ab(`target-${i}-${(t.m || 'm').replace(/[^A-Za-z0-9]+/g, '_').slice(0, 30)}`); }
}
await setAim(null);
for (const id of ITEMS) {
  const W = 512, H = 512; let r = null;
  for (let k = 0; k < 120 && !r; k++) { r = await p.evaluate(([id, W, H]) => window.__enc.ivShot(id, W, H, 0.6, 0.32), [id, W, H]); if (!r) await p.waitForTimeout(500); }
  if (!r) { log('item', id, 'never drew'); continue; }
  const after = r.url;
  const before = await p.evaluate(([id, W, H]) => { const K = window.__shineKit; K.before(true); try { return window.__enc.ivShot(id, W, H, 0.6, 0.32).url; } finally { K.before(false); } }, [id, W, H]);
  log('item', id, 'close-up census', JSON.stringify(await p.evaluate(() => window.__shineKit.census().filter(c => c.scene === 'closeup').slice(0, 6))));
  await pair(`item-${id}`, after, before, { left: 0, top: r.bh - H, width: W, height: H });
}
log('errors', JSON.stringify(errs.slice(0, 6)));
await b.close();
