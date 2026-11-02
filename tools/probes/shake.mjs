// v24.31 · THE ROOM'S RATTLE, MEASURED (Chad, 2 Nov 2026: "The items shaking in ep 4 chp 1 , is very fake looking and
// unnatural ... They look like they are flying around detached from where they are"). Episode 4 chapter 1's receiving
// room under the master's chant, driven through the chapter's own frame (stage.updateNotes -> roomFrame) on a held clock,
// the room's tremor held at the storm's full 1: every drawn thing in the room that moves (each instance of an instanced
// group on its own) is measured against where it rests — how far its points travel (mm), how far it tilts (deg), how far
// its lowest point sinks below or lifts off where it stood (mm). It knows nothing of how the chapter shakes them, so it
// reads a build before a change and after it the same way. Then, on a phone (390x844 touch, DPR 2), the altar and a
// cabinet are photographed over one second at the burst's peak: a strip of frames, and the ENVELOPE (each pixel's range
// across 30 frames, in red over the still room) — what moves, and how far, in one picture; FILM=1 also writes the frames
// for a GIF.
//   ENC_DIST=<snap> CHROMIUM_PATH=... [SECS=12] [FILM=1] node tools/probes/shake.mjs <outdir>
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
const req = createRequire(new URL('../../package.json', import.meta.url).pathname);
const PW = await import(pathToFileURL(req.resolve('playwright')).href);
const chromium = PW.chromium || (PW.default && PW.default.chromium);
const sharp = (await import(pathToFileURL(req.resolve('sharp')).href)).default;
const { LAUNCH, PAGE, toPlay } = await import(new URL('../../testlib.mjs', import.meta.url).href);
const OUT = process.argv[2] || 'shake'; fs.mkdirSync(OUT, { recursive: true });
const SECS = +(process.env.SECS || 12), FILM = !!process.env.FILM;
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('console ' + m.text().slice(0, 200)); });
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
await p.goto(PAGE + '?ch=e4c1', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => window.__enc.loads().pending === 0, null, { timeout: 600000, polling: 500 });
await p.evaluate(() => window.__enc.stage.applyPhase('work'));
await p.waitForFunction(() => window.__enc.getState() === 'play' && window.__enc.stage.info().world === 'R', null, { timeout: 900000, polling: 500 });
await p.waitForFunction(() => window.__enc.kit.getFade() < 0.02, null, { timeout: 900000, polling: 500 });
await p.waitForFunction(() => window.__enc.loads().pending === 0, null, { timeout: 600000, polling: 500 });
await p.waitForTimeout(3000);
log('in the room, phase', await p.evaluate(() => window.__enc.stage.phase));

/* the page's half: a held clock, the room set at rest and at the storm's tremor, and the measure */
await p.addScriptTag({ content: `
window.__shake = {
  S: () => window.__enc.stage,
  now: 0, real: null,
  hold(t) { if (!this.real) this.real = performance.now.bind(performance); this.now = t; performance.now = () => this.now * 1000; },
  free() { if (this.real) performance.now = this.real; this.real = null; },
  /* one step of the chapter's frame at wall time t, the tremor landing on k (the ease is undone ahead of it) */
  step(t, k) {
    const S = this.S(), R = S.roomState, P = S.play.state, dt = 1 / 60;
    R.last = t - dt;
    const chanting = P.chantNext > 0 && (S.phase === 'work' || S.phase === 'storm');
    const target = chanting ? (S.phase === 'storm' ? 1 : 0.75) : 0, f = Math.min(1, dt * (chanting ? 0.9 : 3));
    R.tremor = f < 1 ? (k - target * f) / (1 - f) : k;
    if (k === 0) R.shook = true;
    this.hold(t); S.updateNotes(dt, 0);
  },
  /* every drawn mesh of the room, sampled: an instanced group by each instance's origin and up, a mesh by its box's
     corners and its up */
  sample() {
    const E = window.__enc, room = E.stage.film.worldR, out = [], V = E.yaw.position.constructor, m = new E.camera.matrixWorld.constructor(), v = new V();
    room.updateWorldMatrix(true, true);
    const vis = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
    room.traverse(o => {
      if (!o.isMesh || o.isSkinnedMesh || !vis(o)) return;          // (the people move by their bones, not by the shake)
      if (o.isInstancedMesh) {
        for (let i = 0; i < o.count; i++) {
          o.getMatrixAt(i, m); m.premultiply(o.matrixWorld);
          const e = m.elements; out.push({ id: o.uuid + ':' + i, name: (o.name || o.geometry.type) + ' #' + i, inst: true,
            pts: [[e[12], e[13], e[14]]], up: new V(e[4], e[5], e[6]).normalize().toArray() });
        }
        return;
      }
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      const bb = o.geometry.boundingBox, pts = [];
      for (const x of [bb.min.x, bb.max.x]) for (const y of [bb.min.y, bb.max.y]) for (const z of [bb.min.z, bb.max.z]) { v.set(x, y, z).applyMatrix4(o.matrixWorld); pts.push(v.toArray()); }
      const e = o.matrixWorld.elements;
      out.push({ id: o.uuid, name: (o.name || o.geometry.type) + (o.material && o.material.color ? ' ' + o.material.color.getHexString() : ''), pts, up: new V(e[4], e[5], e[6]).normalize().toArray() });
    });
    return out;
  },
  measure(t0, secs) {
    this.step(t0, 0); const rest = new Map(this.sample().map(s => [s.id, s]));
    const acc = new Map(); let peak = { t: t0, d: 0 };
    for (let k = 1; k <= secs * 60; k++) {
      const t = t0 + k / 60; this.step(t, 1); let tot = 0;
      for (const s of this.sample()) {
        const r = rest.get(s.id); if (!r) continue;
        let d = 0; for (let j = 0; j < s.pts.length; j++) d = Math.max(d, Math.hypot(s.pts[j][0] - r.pts[j][0], s.pts[j][1] - r.pts[j][1], s.pts[j][2] - r.pts[j][2]));
        const tilt = Math.acos(Math.max(-1, Math.min(1, s.up[0] * r.up[0] + s.up[1] * r.up[1] + s.up[2] * r.up[2]))) * 180 / Math.PI;
        const lowR = Math.min(...r.pts.map(q => q[1])), low = Math.min(...s.pts.map(q => q[1]));
        let a = acc.get(s.id); if (!a) { a = { name: s.name, inst: !!s.inst, at: r.pts[0].map(x => +x.toFixed(2)), d: 0, tilt: 0, sink: 0, lift: 0 }; acc.set(s.id, a); }
        a.d = Math.max(a.d, d); a.tilt = Math.max(a.tilt, tilt); a.sink = Math.max(a.sink, lowR - low); a.lift = Math.max(a.lift, low - lowR); tot += d;
      }
      if (tot > peak.d) peak = { t, d: tot };
    }
    this.step(t0 + secs + 1, 0); this.free();
    const moved = [...acc.values()].filter(a => a.d > 1e-5);
    /* instanced groups summed up: the worst instance of each */
    const groups = new Map();
    for (const a of moved) { const key = a.inst ? a.name.replace(/ #\\d+$/, '') : a.name + ' @' + a.at.join(','); const g = groups.get(key);
      if (!g || a.d > g.d) groups.set(key, { ...a, n: (g ? g.n : 0) + 1, name: key }); else g.n++; }
    return { peak, rows: [...groups.values()].sort((x, y) => y.d - x.d).map(a => ({ what: a.name, n: a.n, at: a.at, mm: +(a.d * 1000).toFixed(1), tiltDeg: +a.tilt.toFixed(2), sinkMm: +(a.sink * 1000).toFixed(1), liftMm: +(a.lift * 1000).toFixed(1) })) };
  },
  /* a frame of the world alone (no hands), the lens placed and its width set */
  shot(t, k, cam) {
    const E = window.__enc; this.step(t, k);
    E.yaw.position.set(cam.x, cam.y, cam.z); E.yaw.rotation.y = cam.ry; E.pitch.rotation.x = cam.pt;
    const fov = E.camera.fov; E.camera.fov = cam.fov || fov; E.camera.updateProjectionMatrix();
    E.renderer.render(E.scene, E.camera); const url = E.renderer.domElement.toDataURL('image/png');
    E.camera.fov = fov; E.camera.updateProjectionMatrix(); this.free(); return url;
  }
};` });
const t0 = await p.evaluate(() => Math.ceil(performance.now() / 1000) + 1);   // (the held clock starts from the real one)
const M = await p.evaluate(([t0, secs]) => window.__shake.measure(t0, secs), [t0, SECS]);
log('peak at', M.peak.t.toFixed(2), 'sum', M.peak.d.toFixed(3));
console.log('what moves under the storm\'s tremor (worst instance of each group): mm travelled, tilt, sink below / lift off its rest');
for (const r of M.rows) console.log('  ' + JSON.stringify(r));
fs.writeFileSync(`${OUT}/measure.json`, JSON.stringify(M, null, 1));

/* the pictures: the altar and the left cabinet, from where he kneels and close; 30 frames over a second at the peak */
const RX = await p.evaluate(() => window.__enc.stage.film.RX);
const deg = Math.PI / 180;
const aim = (from, to, fov) => { const dx = to[0] - from[0], dy = to[1] - from[1], dz = to[2] - from[2];
  return { x: RX + from[0], y: from[1], z: from[2], ry: Math.atan2(-dx, -dz), pt: Math.atan2(dy, Math.hypot(dx, dz)), fov }; };
const VIEWS = [
  ['mat', aim([0, 1.05, 0.0], [0, 2.1, -2.5])],                       // kneeling on the client's mat, looking up at the altar
  ['altar', aim([0, 1.6, -0.9], [0, 2.18, -2.45], 26)],                // the altar's tiers, close (a narrow lens, never through the near plane)
  ['cabinet', aim([-1.2, 1.25, -1.6], [-2.45, 1.15, -1.85], 40)]       // the left cabinet's shelves
];
const decode = async (url) => (await sharp(Buffer.from(url.split(',')[1], 'base64')).removeAlpha().raw().toBuffer({ resolveWithObject: true }));
for (const [tag, cam] of VIEWS) {
  const N = 30, frames = [];
  for (let i = 0; i < N; i++) frames.push(await decode(await p.evaluate(([t, cam]) => window.__shake.shot(t, 1, cam), [M.peak.t - 0.5 + i / 30, cam])));
  const still = await decode(await p.evaluate(([t, cam]) => window.__shake.shot(t, 0, cam), [M.peak.t + 2, cam]));
  const { width: w, height: h } = frames[0].info, n = w * h;
  /* the envelope: each pixel's range (max - min, summed over the channels) across the frames, red over the still */
  const env = Buffer.alloc(n * 3);
  for (let q = 0; q < n; q++) {
    let rng = 0;
    for (let c = 0; c < 3; c++) { let lo = 255, hi = 0; for (const F of frames) { const x = F.data[q * 3 + c]; if (x < lo) lo = x; if (x > hi) hi = x; } rng += hi - lo; }
    const k = Math.min(1, rng / 90), g = (still.data[q * 3] + still.data[q * 3 + 1] + still.data[q * 3 + 2]) / 3 * 0.55;
    env[q * 3] = Math.round(g + (255 - g) * k); env[q * 3 + 1] = Math.round(g * (1 - k)); env[q * 3 + 2] = Math.round(g * (1 - k));
  }
  await sharp(env, { raw: { width: w, height: h, channels: 3 } }).jpeg({ quality: 88 }).toFile(`${OUT}/${tag}-envelope.jpg`);
  /* a strip: the still, then six frames a fifth of a second apart */
  const pick = [still, ...[0, 5, 10, 15, 20, 25].map(i => frames[i])], gap = 8;
  await sharp({ create: { width: pick.length * (w + gap) - gap, height: h, channels: 3, background: '#fff' } })
    .composite(await Promise.all(pick.map(async (F, i) => ({ input: await sharp(F.data, { raw: F.info }).png().toBuffer(), left: i * (w + gap), top: 0 }))))
    .jpeg({ quality: 84 }).toFile(`${OUT}/${tag}-strip.jpg`);
  if (FILM) { fs.mkdirSync(`${OUT}/${tag}-frames`, { recursive: true });
    for (const [i, F] of frames.entries()) await sharp(F.data, { raw: F.info }).png().toFile(`${OUT}/${tag}-frames/${String(i).padStart(2, '0')}.png`); }
  log('view', tag, 'envelope + strip');
}
log('errors', JSON.stringify(errs.slice(0, 6)));
await b.close();
process.exit(errs.length ? 1 : 0);
