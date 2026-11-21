/* v28.0 · EPISODE 4 CHAPTER 5'S FILMS, MEASURED FOR R25 (Chad, 21 Nov 2026: "There are alot of serious clipping issues with
   characters and objects throughout the entire chapter, from intro cutscene, to gameplay, till the end of the ending
   cutscenes. There are also alot of jerky character motions, disappearing and reappearing characters , characters jerking
   and reappearing in a split second, and serious camera framing issues on mobile phone. The framing needs to be fixed so
   that both desktop and mobile looks perfect at the same time."). One browser; every film in turn, each from a fresh page
   (the browser's cache keeps the second boot short): the opening (Start pressed), each film from play (its bookmark
   applied, the kit's film started once the black is down), an ending (the ask's bookmark, the option pressed as a finger or
   a click presses it). Each film is measured one of three ways:
     MODE=seek  sought from its start to its end in STEP s steps (every picture is a function of the film's clock, v5.30's
                law; a seek poses the bodies);
     MODE=play  PLAYED on a slowed clock (STEP_MS a drawn frame, filmlive.mjs's clock), one row a drawn frame: what a seek
                cannot see (a look laid on after the mixer, a level chosen by the frame, a body drawn for a frame where it
                stood before a track moved it);
     MODE=pics  only photographed, at PICS' moments (the frame drawn, SETTLE ms): DPR=2 for a phone's real pictures.
   A ROW holds the lens (its angle, its shape, where it stands and looks, the film's black) and EVERY PERSON the chapter made
   (its people and its crowd, through the films' probe handle `stage.films.people()`; on a build without it the handle is
   laid into the served chapter, nothing else changed): shown or not, the mark, the hips and the head in the world, the drawn
   body's extent on this screen (every ninth point of every shown skin, posed: NDC, -1..1 across and up) and the level
   drawn; and every named THING under the world whose shown state or place changed since the row before (with where it
   stands on this screen then).
   CLIP=<s> (seek mode): at every CLIP s of each film and at its last moment, clipscan's own measure (its ANALYSE, read from
   tools/probes/clipscan.mjs so the two never differ) over R m round the lens: the pairs whose surfaces cross.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... VIEW=phone|desktop [MODE=seek|play|pics] [STEP=0.1] [STEP_MS=50] [CLIP=9] [R=14]
       [JOBS=open,devotee,prepare,together,bagtied,collector,end:A,end:B,end:C,end:D] [FROM=s] [UNTIL=s]
       [PICS='devotee@10.5,25;end:A@5'] [DPR=1] [SETTLE=1200] [OUT=dir] node tools/probes/e4c5films.mjs
   Read by tools/probes/e4c5filmread.py. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const VIEW = process.env.VIEW || 'phone', PHONE = VIEW === 'phone', MODE = process.env.MODE || 'seek';
const STEP = +(process.env.STEP || 0.1), STEP_MS = +(process.env.STEP_MS || 50), CLIP = +(process.env.CLIP || 0), R = +(process.env.R || 14);
const FROM = +(process.env.FROM || 0), UNTIL = +(process.env.UNTIL || 1e9), DPR = +(process.env.DPR || 1), SETTLE = +(process.env.SETTLE || 1200);
const JOBS = (process.env.JOBS || 'open,devotee,prepare,together,bagtied,collector,end:A,end:B,end:C,end:D').split(',').filter(Boolean);
const OUT = process.env.OUT || '/tmp/e4c5films'; fs.mkdirSync(OUT, { recursive: true });
const PICS = {}; for (const it of (process.env.PICS || '').split(';').filter(Boolean)) { const i = it.lastIndexOf('@'); PICS[it.slice(0, i)] = it.slice(i + 1).split(',').map(Number); }
const WAY = { devotee: 'walk', prepare: 'hunt', together: 'fight', bagtied: 'fight', collector: 'table' };
/* clipscan's own measure, its text read and made a function here */
const CS = fs.readFileSync(new URL('./clipscan.mjs', import.meta.url), 'utf8'), A0 = CS.indexOf('const ANALYSE = '), A1 = CS.indexOf('\n};\n', A0);
const ANALYSE = (0, eval)('(' + CS.slice(A0 + 'const ANALYSE = '.length, A1 + 2) + ')');
/* the chapter as served, with the films' probe handle laid in when it is missing */
/* (CHFILE=<file.js>: the chapter served from that file instead, src/chapters/e4/e4c5.js as just assembled: a chapter file
   is copied into the build byte for byte, so a change to the chapter alone is measured with no build, filmshots' SWAPJS) */
const DIST = process.env.ENC_DIST || 'dist', CHF = process.env.CHFILE || fs.readdirSync(DIST + '/assets').find(f => /^e4c5\.[0-9a-f]+\.js$/.test(f));
let CHSRC = fs.readFileSync(process.env.CHFILE || DIST + '/assets/' + CHF, 'utf8');
const HOOKED = /people: \(\) => people/.test(CHSRC);
if (!HOOKED) CHSRC = CHSRC.replace(/(PRAI5, STICK5)(\s*\};)/, '$1, people: () => people, crowd: () => crowd$2');
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: DPR, hasTouch: true, isMobile: true }
                                     : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: DPR });
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
log(VIEW, MODE, 'chapter', CHF, HOOKED ? '(its own handle)' : '(handle laid in)', 'jobs', JOBS.join(','));
const frames = (p, n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);

/* the row, made in the page (installed once a page) */
const INSTALL = () => {
  const E = window.__enc, S = E.stage, cam = E.camera, V3 = cam.position.constructor;
  const v = new V3(), n = new V3(), d = new V3(), w = new V3();
  const seen = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
  const who = () => { const F = S.films || {}, P = F.people ? F.people() : [], C = F.crowd ? F.crowd() : [];
    return P.map(x => ({ x, key: x.key })).concat(C.map((x, i) => ({ x, key: 'crowd' + (x.key ? ':' + x.key : '') }))); };
  const last = new Map();
  const things = () => { const out = [], W = S.world; if (!W) return out;
    const walk = (o, dep) => { for (const c of o.children) { if (c.isBone || c.isSkinnedMesh || c.isCamera || c.isLight) continue;
      if (c.name) out.push(c); if (dep < 3 && c.children && c.children.length && !c.children.some(q => q.isSkinnedMesh)) walk(c, dep + 1); } };
    walk(W, 0); return out; };
  let people = null;
  window.__labels = () => (people || (people = who())).map((q, i) => q.key + '#' + i);
  window.__row = (t) => {
    if (!people) people = who();
    cam.updateMatrixWorld(true); cam.getWorldPosition(w); cam.getWorldDirection(d);
    const fd = document.getElementById('cineFade');
    const L = [+t.toFixed(3), +cam.fov.toFixed(3), +cam.aspect.toFixed(4), +w.x.toFixed(3), +w.y.toFixed(3), +w.z.toFixed(3),
               +(Math.atan2(-d.x, -d.z) * 180 / Math.PI).toFixed(3), +(Math.asin(Math.max(-1, Math.min(1, d.y))) * 180 / Math.PI).toFixed(3),
               +(parseFloat(fd && fd.style.opacity) || 0).toFixed(3)];
    const P = people.map(({ x: Q }) => { const g = Q.group; if (!g) return null;
      const vis = seen(g) ? 1 : 0; g.updateWorldMatrix(true, true);
      const hip = Q.hips ? Q.hips.getWorldPosition(v).toArray().map(q => +q.toFixed(3)) : null;
      const head = Q.head ? Q.head.getWorldPosition(v).toArray().map(q => +q.toFixed(3)) : null;
      if (!Q.__hands) { Q.__hands = [null, null]; for (const q in (Q.bone || {})) { if (/^(mixamorig:?)?LeftHand$/.test(q)) Q.__hands[0] = Q.bone[q]; if (/^(mixamorig:?)?RightHand$/.test(q)) Q.__hands[1] = Q.bone[q]; } }
      const hands = Q.__hands.map(h => h ? h.getWorldPosition(v).toArray().map(q => +q.toFixed(3)) : null);
      let ext = null;
      if (vis) { let a = [9, -9, 9, -9], any = false;
        g.traverse(m => { if (!m.isSkinnedMesh || !seen(m)) return; if (m.skeleton) m.skeleton.update(); const N = m.geometry.attributes.position.count;
          for (let i = 0; i < N; i += 9) { m.getVertexPosition(i, v); m.localToWorld(v); n.copy(v).project(cam); if (n.z >= 1 || n.z <= -1) continue; any = true;
            if (n.x < a[0]) a[0] = n.x; if (n.x > a[1]) a[1] = n.x; if (n.y < a[2]) a[2] = n.y; if (n.y > a[3]) a[3] = n.y; } });
        if (any) ext = a.map(q => +q.toFixed(3)); }
      return [vis, +g.position.x.toFixed(3), +g.position.z.toFixed(3), hip, head, ext, Q.lvShown != null ? Q.lvShown : -9, hands[0], hands[1]]; });
    const T = {};
    for (const o of things()) { const vis = seen(o) ? 1 : 0; o.getWorldPosition(v); const k = o.name + '|' + o.uuid.slice(0, 4);
      const s = [vis, +v.x.toFixed(2), +v.y.toFixed(2), +v.z.toFixed(2)], was = last.get(k);
      if (!was || was[0] !== s[0] || Math.abs(was[1] - s[1]) + Math.abs(was[2] - s[2]) + Math.abs(was[3] - s[3]) > 0.02) {
        n.copy(v).project(cam); T[k] = s.concat([+n.x.toFixed(3), +n.y.toFixed(3), n.z < 1 && n.z > -1 ? 1 : 0]); last.set(k, s); } }
    return { L, P, T };
  };
};

async function reach(p, job) {
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
  await p.route(new RegExp('/assets/e4c5\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: CHSRC }));
  await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 240000 });
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
  await p.evaluate(() => document.getElementById('startBtn').click());
  if (job !== 'open') {
    await toPlay(p, 1500000); await p.waitForTimeout(8000);
    if (job.startsWith('end:')) {
      await p.evaluate(() => window.__enc.stage.applyPhase('ask'));
      await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 900000, polling: 500 });
      await p.waitForTimeout(2500);
      await p.waitForFunction(() => { const P = document.querySelector('#decide .panel'); return P && P.getAnimations().every(a => a.playState === 'finished'); }, null, { timeout: 120000, polling: 200 });
      const bt = await p.evaluate((i) => { const B = [...document.querySelectorAll('#choices button.choice')], r = B[i] && B[i].getBoundingClientRect();
        return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; }, 'ABCD'.indexOf(job.slice(4)));
      if (PHONE) await p.touchscreen.tap(Math.round(bt.x), Math.round(bt.y)); else await p.mouse.click(bt.x, bt.y);
    } else {
      const ph = WAY[job];
      await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), ph);
      await p.waitForFunction((ph) => window.__enc.stage.phase === ph && window.__enc.getState() === 'play', ph, { timeout: 600000, polling: 500 });
      await p.evaluate(() => { window.__fsClear = 0; });
      await p.waitForFunction(() => { const o = parseFloat(getComputedStyle(document.getElementById('cineFade')).opacity) || 0, now = performance.now();
        if (o >= 0.02) { window.__fsClear = 0; return false; } if (!window.__fsClear) window.__fsClear = now; return now - window.__fsClear > 2500; }, null, { timeout: 900000, polling: 250 });
      await p.waitForTimeout(1500);
      log(job, 'film started', await p.evaluate((k) => window.__enc.kit.film(k), job));
    }
  }
  await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.getState() === 'cine' && window.__enc.cine.t() > 0.2, null, { timeout: 1500000, polling: 250 });
  return errs;
}

for (const job of JOBS) {
  const p = await ctx.newPage(); let errs = [];
  try {
    errs = await reach(p, job);
    const ready = await p.waitForFunction(() => { try { return !!window.__enc.stage.ready(); } catch { return true; } }, null, { timeout: 300000, polling: 500 }).then(() => true, () => false);
    await p.evaluate(INSTALL);
    const dur = await p.evaluate(() => window.__enc.cine.dur()), labels = await p.evaluate(() => window.__labels());
    log(job, 'dur', dur.toFixed(2), 'people', labels.length, ready ? 'all ready' : 'NOT ALL READY');
    const res = { view: VIEW, mode: MODE, job, dur, labels, step: STEP, rows: [], clips: [], errs };
    if (MODE === 'seek') {
      /* forward only: a seek applies the tracks it passes and undoes none, so every scan is made on the way through */
      const marks = []; if (CLIP) { for (let m = 0; m < dur - 0.3; m += CLIP) marks.push(+m.toFixed(2)); marks.push(+(dur - 0.3).toFixed(2)); }
      const end = dur - 0.05, rowsTo = async (a, z, incl) => {
        const kA = Math.ceil(Math.max(a, FROM) / STEP - 1e-6), kZ = incl ? Math.floor(Math.min(z, UNTIL) / STEP + 1e-6) + 1 : Math.ceil(Math.min(z, UNTIL) / STEP - 1e-6);
        if (kZ > kA) res.rows.push(...await p.evaluate(([kA, kZ, step]) => { const C = window.__enc.cine, out = [];
          for (let k = kA; k < kZ; k++) { const t = +(k * step).toFixed(3); C.seek(t); out.push(window.__row(t)); } return out; }, [kA, kZ, STEP])); };
      let t0 = 0;
      for (const m of marks) {
        await rowsTo(t0, m, false); t0 = m;
        if (m < FROM || m > UNTIL) continue;
        await p.evaluate((t) => window.__enc.cine.seek(t), m); await frames(p, 3);
        const c = await p.evaluate(() => { const E = window.__enc, v = E.camera.position.clone(); E.camera.getWorldPosition(v); return [v.x, v.z]; });
        const r = await p.evaluate(ANALYSE, [0.1, R, 0.05, c[0], c[1]]);
        res.clips.push({ t: m, cam: c, objects: r.objects, people: r.people, pairs: (r.pairs || []).slice(0, 60) });
        log(job, 'clip scan at', m, r.objects, 'objects,', (r.pairs || []).length, 'pairs');
      }
      await rowsTo(t0, end, true);
    } else if (MODE === 'play') {
      await p.evaluate(({ FROM, UNTIL, STEP_MS }) => {
        const E = window.__enc, rows = window.__live = []; window.__liveDone = false;
        const realNow = performance.now.bind(performance), realRaf = window.requestAnimationFrame.bind(window);
        let virt = 0, slow = false;
        const slowDown = () => { slow = true; virt = realNow(); performance.now = () => virt;
          window.requestAnimationFrame = (cb) => realRaf(() => cb(virt + 5000));
          const tick = () => { virt += STEP_MS; realRaf(tick); }; realRaf(tick); };
        const f = () => { if (!E.cine.active()) { window.__liveDone = true; return; }
          const t = E.cine.t(); if (t > UNTIL) { window.__liveDone = true; return; }
          if (!slow && t >= FROM - 0.5) slowDown();
          if (t >= FROM) { const r = window.__row(t); r.w = Math.round(realNow()); rows.push(r); }
          realRaf(f); };
        realRaf(f); }, { FROM, UNTIL, STEP_MS });
      await p.waitForFunction(() => window.__liveDone, null, { timeout: 5400000, polling: 1000 });
      res.rows = await p.evaluate(() => window.__live);
    }
    if (PICS[job]) {
      await p.addStyleTag({ content: '#caption{display:none !important}' }).catch(() => {});
      for (const t of PICS[job]) { await p.evaluate((t) => window.__enc.cine.seek(t), t); await frames(p, 3); await p.waitForTimeout(SETTLE);
        const f = `${OUT}/${job.replace(':', '')}-${VIEW}-${String(t.toFixed(2)).padStart(6, '0')}.png`; await p.screenshot({ path: f, timeout: 240000 }); log(job, 'picture', f); }
    }
    if (MODE !== 'pics') { const f = `${OUT}/${VIEW}-${MODE}-${job.replace(':', '')}.json`; fs.writeFileSync(f, JSON.stringify(res)); log(job, res.rows.length, 'rows,', res.clips.length, 'clip scans ->', f); }
    if (errs.length) log(job, 'errs', JSON.stringify(errs.slice(0, 6)));
  } catch (e) { log(job, 'FAILED', String(e).slice(0, 300), JSON.stringify(errs.slice(0, 4))); }
  await p.close();
}
log('done');
await b.close();
