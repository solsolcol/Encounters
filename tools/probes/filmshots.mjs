/* v24.5: a chapter's OPENING FILM photographed at chosen moments of its own clock — the chapter started from its own
   ?ch= (Start tapped or clicked), the film's clock seeked to each time (a seek pauses it; every picture is a function of
   the clock — v5.30's law), a few frames drawn, SETTLE ms for what eases on the wall clock, the frame photographed.
   Prints the state, the film's time and the lens at each.
   ENC_DIST=<snapshot> CHROMIUM_PATH=... CH=e4c1 VIEW=phone|desktop TS=0.5,3,6 [SETTLE=1500] [OUT=dir]
     node tools/probes/filmshots.mjs
   (v24.5) OPT=A|B|C|D [PHASE=decide:~fri] photographs an ENDING instead: play reached (the film skipped), the bookmark
   applied once the chapter has booted, the option pressed, and the scene's clock seeked the same way.
   (v24.6) FILM=<key> [PHASE=<bookmark>] photographs a film a chapter plays FROM PLAY (`kit.film`, e.g. episode 3 chapter
   4's merit film from `yinDone`): play reached, the bookmark applied, the film started by the kit, its clock seeked. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const VIEW = process.env.VIEW || 'phone', PHONE = VIEW === 'phone';
const CH = process.env.CH || 'e4c1', TS = process.env.TS === 'none' ? [] : (process.env.TS || '1,5,10').split(',').map(Number);
const SETTLE = +(process.env.SETTLE || 1500);
const OUT = (process.env.OUT || '/tmp/filmshots') + '-' + VIEW;
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
/* (v27.0: a phone drawn at two device pixels a point, as the house's photographs are: "NO SMALL PICTURE IS EVER A CHECK", v26.0; DPR=1 for a quick look) */
const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: +(process.env.DPR || 2), hasTouch: true, isMobile: true }
                                     : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
/* (v25.5) SWAP=key=file.glb[,key=file.glb]: the real game served ANOTHER FILE for an asset (its request answered from disk),
   so one film frame can be photographed with a model as it was and as it is, nothing else changed */
for (const [key, file] of (process.env.SWAP || '').split(',').filter(Boolean).map(q => q.split('=')))
  await p.route(new RegExp('/assets/' + key + '\\.[0-9a-f]+\\.glb$'), (r) => r.fulfill({ status: 200, contentType: 'model/gltf-binary', body: fs.readFileSync(file) }));
/* (v27.0, 19 Nov) SWAPJS=key=file.js: a CHAPTER's script served from disk in place of the build's (a chapter file is
   copied into the build byte for byte, so a change to the chapter alone is photographed without building again; the
   build that ships is still made and checked whole) */
for (const [key, file] of (process.env.SWAPJS || '').split(',').filter(Boolean).map(q => q.split('=')))
  await p.route(new RegExp('/assets/' + key + '\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: fs.readFileSync(file) }));
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 200)); });
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's';
await p.goto(PAGE + '?ch=' + CH, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
const OPT = process.env.OPT || '';
if (OPT) {
  await toPlay(p, 1500000);
  await p.waitForTimeout(8000);                                       // the chapter's first frames (v9.3: boot before driving a phase)
  await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), process.env.PHASE || 'decide:~fri');
  await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 600000, polling: 500 });
  /* (v27.0) READY='amma,ravi,mala,phoB': the option is pressed only once every named member of the chapter's cast has
     landed (stage.dbg.cast[k].ready): on a starved box the people of episode 4 chapter 4 were still loading when an
     ending began, and it was photographed as an empty room */
  if (process.env.READY) await p.waitForFunction((ks) => ks.every(k => { const C = window.__enc.stage.dbg && window.__enc.stage.dbg.cast, P = C && C[k]; return P && P.ready; }),
    process.env.READY.split(','), { timeout: 1200000, polling: 1000 });
  await p.waitForTimeout(2500);
  /* (v24.5) the panel rises 40 px into place (a 0.45 s CSS animation, which a starved headless box can hold at its first
     frame for seconds): read the option's place only once that has finished, or a tap aimed at B lands on C */
  await p.waitForFunction(() => { const P = document.querySelector('#decide .panel'); return P && P.getAnimations().every(a => a.playState === 'finished'); }, null, { timeout: 120000, polling: 200 });
  const bt = await p.evaluate((i) => { const B = [...document.querySelectorAll('#choices button.choice')]; const r = B[i] && B[i].getBoundingClientRect();
    return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; }, 'ABCD'.indexOf(OPT));
  if (PHONE) await p.touchscreen.tap(Math.round(bt.x), Math.round(bt.y)); else await p.mouse.click(bt.x, bt.y);
}
const FILM = process.env.FILM || '';
if (FILM && !OPT) {
  await toPlay(p, 1500000);
  await p.waitForTimeout(8000);                                       // the chapter's first frames (v9.3)
  if (process.env.PHASE) {
    await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), process.env.PHASE);
    await p.waitForFunction((ph) => window.__enc.stage.phase === ph.split(/[:~]/)[0] && window.__enc.getState() === 'play', process.env.PHASE, { timeout: 600000, polling: 500 });
    /* (v24.7) and the world change's black LIFTED — a bookmark into another world raises it while that world warms
       (`kit.warm`), and a film that keeps the fade (`c.keepFade`) started under it keeps it to its end: episode 3
       chapter 5's little one's film photographed all black, which no player can reach (the yield that starts it waits
       for the picture) */
    /* (the kit's verb only mutates; the FRAME raises the black a frame later — so the black must be seen DOWN and STAY down
       for 2.5 s, or the check passes in the instant before it rises: the first version of this wait did exactly that) */
    await p.evaluate(() => { window.__fsClear = 0; });
    await p.waitForFunction(() => {
      const o = parseFloat(getComputedStyle(document.getElementById('cineFade')).opacity) || 0, now = performance.now();
      if (o >= 0.02) { window.__fsClear = 0; return false; }
      if (!window.__fsClear) window.__fsClear = now;
      return now - window.__fsClear > 2500;
    }, null, { timeout: 900000, polling: 250 });
    await p.waitForTimeout(1500);
  }
  console.log(el(), 'film', FILM, await p.evaluate((k) => window.__enc.kit.film(k), FILM));
}
await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.getState() === 'cine', null, { timeout: 1500000, polling: 500 });
/* (v27.0) NOCULL='key[#i],...': those people's meshes drawn whatever their culling spheres say, so a part missing from a
   picture is proved culled (it comes back) or not (it stays missing) */
if (process.env.NOCULL) console.log('   nocull', await p.evaluate((spec) => { const S = window.__enc.stage; let n = 0;
  for (const who of spec.split(',')) { const [key, i] = who.split('#'), P = S.person && S.person(key, +(i || 0)); if (P) P.group.traverse(m => { if (m.isMesh) { m.frustumCulled = false; n++; } }); }
  return n; }, process.env.NOCULL));
await p.waitForFunction(() => window.__enc.cine.t() > 0.2, null, { timeout: 600000, polling: 300 });
/* (v27.0) LENS=<step> [LENSTO=s]: THE CAMERA AS A MOVE (v25.5): the film sought from where it stands to its end (or LENSTO) in
   steps of that many seconds, and at each the lens, where the camera stands and looks and the film's black, written to
   <OUT>/lens-<name>.json in tools/probes/e4c3beats.mjs's rows (read by tools/probes/lensread.py). TS=none: no pictures */
if (process.env.LENS) {
  const rows = await p.evaluate(([step, to]) => { const E = window.__enc, C = E.cine, c = E.camera, out = [], fd = document.getElementById('cineFade');
    const end = Math.min(to != null ? to : 1e9, C.dur() - 0.25);
    for (let t = Math.ceil(C.t() / step) * step; t <= end + 1e-6; t += step) { C.seek(t); c.updateWorldMatrix(true, false); const e = c.matrixWorld.elements, dx = -e[8], dy = -e[9], dz = -e[10];
      out.push([+t.toFixed(3), +c.fov.toFixed(4), +(Math.atan2(dx, -dz) * 180 / Math.PI).toFixed(4), +(Math.asin(Math.max(-1, Math.min(1, dy))) * 180 / Math.PI).toFixed(4),
                +e[12].toFixed(4), +e[13].toFixed(4), +e[14].toFixed(4), +(parseFloat(fd && fd.style.opacity) || 0).toFixed(3), +(Math.atan2(e[1], e[5]) * 180 / Math.PI).toFixed(3)]); }
    return out; }, [+process.env.LENS, process.env.LENSTO ? +process.env.LENSTO : null]);
  const f = `${OUT}/lens-${OPT ? 'end' + OPT : FILM || 'film'}.json`;
  fs.writeFileSync(f, JSON.stringify(rows));
  console.log(el(), 'lens', rows.length, 'moments', rows.length ? `from ${rows[0][0]} to ${rows[rows.length - 1][0]}` : '', '->', f);
}
/* (v27.0, 19 Nov) WHO='key:Bone,...' [WHOFROM=s] [WHOTO=s] [WHOSTEP=s]: WHERE A BODY STANDS ON THE SCREEN through a stretch
   of the film: the film sought in steps (0.1 s unless given), and at each every named bone of every named person (its
   first body under that key) carried through the film's own lens: its place on this screen (NDC, -1..1 across and up),
   whether it is in front of the lens, and its place in the world. A seek poses the bodies (the chapter's pose() runs
   the mixer at once), so a head that leaves a phone's frame during a take is caught between two stills. Written to
   <OUT>/who-<name>.json as rows [t, fov, [nx, ny, front, x, y, z] | null per bone]; the pictures follow as before */
if (process.env.WHO) {
  /* (the row for the frame as it stands: the same function after each seek here and after each photograph below, so a
     measure taken on a seek can be held against the one taken on the frame the photograph drew) */
  await p.evaluate(() => { const E = window.__enc, c = E.camera, S = E.stage;
    const skinOf = (P, re) => { const L = []; P.group.traverse(m => { if (!m.isSkinnedMesh || !m.geometry.attributes.skinIndex) return;
        const bi = m.skeleton.bones.findIndex(b => re.test(b.name)); if (bi < 0) return; const SI = m.geometry.attributes.skinIndex, SW = m.geometry.attributes.skinWeight, ix = [];
        for (let i = 0; i < SI.count; i++) { let w = 0; for (let k = 0; k < 4; k++) if (SI.getComponent(i, k) === bi) w += SW.getComponent(i, k); if (w > 0.5) ix.push(i); }
        if (ix.length) L.push({ m, ix }); }); return L; };
    const seen = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
    const cache = new Map();
    window.__whoRow = (spec) => { c.updateWorldMatrix(true, false); c.updateProjectionMatrix(); const row = [];
      for (const s of spec.split(',').filter(Boolean)) { const [key, bn0] = s.split(':'), skin = bn0.startsWith('@'), bn = skin ? bn0.slice(1) : bn0, re = bn0 === '*BODY' ? null : new RegExp('^(mixamorig:?)?' + bn + '$');
        const P = S.person && S.person(key, 0); if (!P) { row.push(null); continue; }
        /* (19 Nov) 'key:*BODY': the WHOLE drawn body (every fifth vertex of every shown skinned mesh, posed): its extent
           on this screen [minx, maxx, miny, maxy] in NDC and its box in the world [x0 y0 z0 x1 y1 z1] */
        if (bn0 === '*BODY') { P.group.updateWorldMatrix(true, true); const v = c.position.clone(), n = c.position.clone(); let a = [9, -9, 9, -9], b = [1e9, 1e9, 1e9, -1e9, -1e9, -1e9], any = false;
          P.group.traverse(m => { if (!m.isSkinnedMesh || !seen(m)) return; if (m.skeleton) m.skeleton.update(); const N = m.geometry.attributes.position.count;
            for (let i = 0; i < N; i += 5) { m.getVertexPosition(i, v); m.localToWorld(v); n.copy(v).project(c); if (n.z >= 1) continue; any = true;
              a = [Math.min(a[0], n.x), Math.max(a[1], n.x), Math.min(a[2], n.y), Math.max(a[3], n.y)];
              b = [Math.min(b[0], v.x), Math.min(b[1], v.y), Math.min(b[2], v.z), Math.max(b[3], v.x), Math.max(b[4], v.y), Math.max(b[5], v.z)]; } });
          row.push(any ? a.map(q => +q.toFixed(3)).concat(b.map(q => +q.toFixed(3))) : null); continue; }
        if (skin) { if (!cache.has(s)) cache.set(s, skinOf(P, re)); P.group.updateWorldMatrix(true, true);
          /* (the bones' matrices for the skin are made only when a frame is drawn: after a seek and no draw, getVertexPosition
             read the last DRAWN frame's pose, a whole film step stale; made here from the bones as they stand) */
          for (const { m } of cache.get(s)) if (m.skeleton) m.skeleton.update();
          const v = c.position.clone(), n = c.position.clone(); let a = [9, -9, 9, -9], b = [1e9, 1e9, 1e9, -1e9, -1e9, -1e9], any = false;
          for (const { m, ix } of cache.get(s)) { if (!seen(m)) continue; for (const i of ix) { m.getVertexPosition(i, v); m.localToWorld(v); n.copy(v).project(c); if (n.z >= 1) continue; any = true;
            a = [Math.min(a[0], n.x), Math.max(a[1], n.x), Math.min(a[2], n.y), Math.max(a[3], n.y)];
            b = [Math.min(b[0], v.x), Math.min(b[1], v.y), Math.min(b[2], v.z), Math.max(b[3], v.x), Math.max(b[4], v.y), Math.max(b[5], v.z)]; } }
          row.push(any ? a.map(q => +q.toFixed(3)).concat(b.map(q => +q.toFixed(3))) : null); continue; }
        let bone = null; for (const q in P.bone) if (re.test(q)) { bone = P.bone[q]; break; }
        if (!bone) { row.push(null); continue; }
        const v = bone.getWorldPosition(c.position.clone()), n = v.clone().project(c);
        row.push([+n.x.toFixed(3), +n.y.toFixed(3), n.z < 1 ? 1 : 0, +v.x.toFixed(3), +v.y.toFixed(3), +v.z.toFixed(3)]); }
      return row; }; });
  /* (v27.0) WHODRAW=1: each moment measured on a DRAWN frame (two frames after the seek), as whoNow is: what the frame loop
     lays on after the mixer (a look, a head held) is not run by a seek, and the face is where the drawn frame has it */
  const rows = await p.evaluate(async ([spec, from, to, step, draw]) => { const E = window.__enc, C = E.cine, c = E.camera, out = [];
    const end = Math.min(to, C.dur() - 0.25);
    const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
    for (let t = from; t <= end + 1e-6; t += step) { C.seek(t); if (draw) await frames(2); out.push([+t.toFixed(3), +c.fov.toFixed(3)].concat(window.__whoRow(spec))); }
    return out; }, [process.env.WHO, +(process.env.WHOFROM || 0), +(process.env.WHOTO || 1e9), +(process.env.WHOSTEP || 0.1), process.env.WHODRAW === '1']);
  const f = `${OUT}/who-${OPT ? 'end' + OPT : FILM || 'film'}.json`;
  fs.writeFileSync(f, JSON.stringify(rows));
  console.log(el(), 'who', rows.length, 'moments', '->', f);
}
for (const t of TS) {
  await p.evaluate((t) => window.__enc.cine.seek(t), t);
  await p.evaluate(() => new Promise(r => { let k = 0; const f = () => (++k >= 3 ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }));
  if (SETTLE) await p.waitForTimeout(SETTLE);
  const s = await p.evaluate(() => { const E = window.__enc, c = E.camera;
    return { st: E.getState(), t: +E.cine.t().toFixed(2), fov: c ? +c.fov.toFixed(1) : null,
             cam: [E.yaw.position.x, E.yaw.position.y, E.yaw.position.z, E.yaw.rotation.y, E.pitch.rotation.x].map(v => +v.toFixed(2)) }; });
  await p.screenshot({ path: `${OUT}/${OPT ? 'end' + OPT : FILM || 'film'}-${String(t).replace('.', '_').padStart(5, '0')}.jpg`, quality: 90, timeout: 240000 });
  console.log(el(), t, JSON.stringify(s));
  if (process.env.WHO) console.log('   whoNow', JSON.stringify(await p.evaluate((sp) => window.__whoRow(sp), process.env.WHO)));
  /* (v27.0) EXTRA='name=js|name=js': after the frame, each in turn (they add up): the page runs it (S the stage, E the
     engine's handle), three frames are drawn, and the frame is photographed again as <frame>-<name>.jpg: a thing hidden
     one at a time shows which one draws what */
  if (process.env.EXTRA) for (const it of process.env.EXTRA.split('|')) { const i = it.indexOf('='), nm = it.slice(0, i), js = it.slice(i + 1);
    const r = await p.evaluate((js) => { const E = window.__enc, S = E.stage; try { return String(new Function('E', 'S', 'return (' + js + ')')(E, S)); } catch (e) { return 'threw ' + e.message; } }, js);
    await p.evaluate(() => new Promise(r => { let k = 0; const f = () => (++k >= 3 ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }));
    await p.screenshot({ path: `${OUT}/${OPT ? 'end' + OPT : FILM || 'film'}-${String(t).replace('.', '_').padStart(5, '0')}-${nm}.jpg`, quality: 90, timeout: 240000 });
    console.log('   extra', nm, '->', r); }
  /* (v27.0) PICK='x,y;x,y' (CSS pixels): what is drawn there, read from this frame: every visible mesh, line or point
     cloud whose box, carried to the screen, holds that point, thinnest first (a thin thing across a shot is found by
     its width on the screen), with its own name, its parents', its material's colour and its distance */
  if (process.env.PICK) console.log('   pick', JSON.stringify(await p.evaluate((spec) => { const E = window.__enc, cam = E.camera, V3 = cam.position.constructor;
    cam.updateMatrixWorld(); const eye = new V3().setFromMatrixPosition(cam.matrixWorld), W = innerWidth, H = innerHeight, out = {};
    for (const xy of spec.split(';')) { const [x, y] = xy.split(',').map(Number), hits = [];
      E.scene.traverse(o => { if (!(o.isMesh || o.isLine || o.isPoints || o.isSprite) || !o.geometry) return; for (let q = o; q; q = q.parent) if (!q.visible) return;
        const g = o.geometry; if (!g.boundingBox) g.computeBoundingBox(); const bb = g.boundingBox; if (!bb || !isFinite(bb.min.x)) return;
        let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, d0 = 1e9, front = false;
        for (const cx of [bb.min.x, bb.max.x]) for (const cy of [bb.min.y, bb.max.y]) for (const cz of [bb.min.z, bb.max.z]) {
          const w = new V3(cx, cy, cz).applyMatrix4(o.matrixWorld); d0 = Math.min(d0, w.distanceTo(eye)); const n = w.clone().project(cam); if (n.z < 1) front = true;
          const sx = (n.x + 1) / 2 * W, sy = (1 - n.y) / 2 * H; x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); }
        if (!front || x < x0 || x > x1 || y < y0 || y > y1) return;
        const m = Array.isArray(o.material) ? o.material[0] : o.material, chain = []; for (let q = o.parent; q && chain.length < 4; q = q.parent) chain.push(q.name || q.type);
        hits.push({ name: o.name || o.type, up: chain.join('<'), w: +(x1 - x0).toFixed(1), h: +(y1 - y0).toFixed(1), d: +d0.toFixed(2), kind: o.type,
                    mat: m ? (m.type + (m.color ? ' #' + m.color.getHexString() : '') + (m.emissive ? ' e#' + m.emissive.getHexString() : '')) : null }); });
      out[xy] = hits.sort((a, b) => a.w - b.w).slice(0, 8); }
    return out; }, process.env.PICK)));
  /* (v27.0) BONES='key[#i]:Bone/Bone,...': where those bones of those people stand in the world at this moment (and
     each one's group), read from the frame just photographed, so a film's staging is measured beside its picture */
  if (process.env.BONES) console.log('   bones', JSON.stringify(await p.evaluate((spec) => { const S = window.__enc.stage, r = {};
    for (const it of spec.split(',')) { const [who, names] = it.split(':'), [key, i] = who.split('#'), P = S.person && S.person(key, +(i || 0)); if (!P) { r[who] = null; continue; }
      P.group.updateWorldMatrix(true, true); const g = P.group.position, o = { g: [g.x, g.y, g.z].map(v => +v.toFixed(3)), vis: P.group.visible };
      for (const n of (names || '').split('/').filter(Boolean)) {
        /* '@top:Bone': the highest point of the skin that bone carries (over half its weight), as the frame draws it
           (a crown, a hand's top), with the bone's own place for the offset between them */
        if (n.startsWith('@top:')) { const bnm = n.slice(5), re = new RegExp('^(mixamorig:?)?' + bnm + '$'); let best = null;
          P.group.traverse(m => { if (!m.isSkinnedMesh || !m.visible || !m.geometry.attributes.skinIndex) return; const sk = m.skeleton, bi = sk.bones.findIndex(b => re.test(b.name)); if (bi < 0) return;
            const SI = m.geometry.attributes.skinIndex, SW = m.geometry.attributes.skinWeight, v = g.clone(), nV = SI.count;
            for (let i = 0; i < nV; i++) { let w = 0; for (let k = 0; k < 4; k++) if (SI.getComponent(i, k) === bi) w += SW.getComponent(i, k); if (w < 0.5) continue;
              m.getVertexPosition(i, v); m.localToWorld(v); if (!best || v.y > best[1]) best = [v.x, v.y, v.z]; } });
          o[n] = best ? best.map(v => +v.toFixed(3)) : null; continue; }
        const re = new RegExp('^(mixamorig:?)?' + n + '$'); let bn = null; for (const q in P.bone) if (re.test(q)) { bn = P.bone[q]; break; }
        if (bn) { const w = bn.getWorldPosition(g.clone()); o[n] = [w.x, w.y, w.z].map(v => +v.toFixed(3)); } }
      r[who] = o; }
    return r; }, process.env.BONES)));
}
console.log(el(), 'errs', JSON.stringify(errs));
await b.close();
