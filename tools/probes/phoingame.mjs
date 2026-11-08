// v24.52 · GRANDMASTER PHO AS HE WILL LOOK IN THE GAME. Chad, 8 Nov 2026: "I want to see how he will actually look in the
// game". He is not cast yet (episode 4 chapter 3 is not built), so this boots the REAL game (dist/, the hosted build) on a
// phone, plays into a chapter's world (episode 4 chapter 1's yard unless CH names another), and puts his file into that live scene: the game's own renderer,
// tone mapping (ACES at 1.42), lights, fog, sky and lens, at the player's eye. His look is D (his pick, v24.47: his skin and
// necklaces unlit, the scan's colour laid on after the tone mapping, the robe lit), patched onto his materials exactly as
// tools/clipsheet.mjs --look=skin@raw does, which is the patch chapter 3 will carry; each shot is also taken lit. The
// screenshots are the real screen, HUD and all. No file is changed; nothing is added to the build.
//   ENC_DIST=<dist snapshot> CHROMIUM_PATH=... [DESKTOP=1] [HANDS=0] node tools/probes/phoingame.mjs <file.glb> <outdir> [shots.json]
// shots.json: [{ "name", "take", "t", "dist" (m in front of the lens), "side" (m to the right), "turn" (deg, 0 faces the
// player) }]; the default is four: talking far and near, a cast with his right arm up, the chair sit's cheer.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
const req = createRequire(new URL('../../package.json', import.meta.url).pathname);
const PW = await import(pathToFileURL(req.resolve('playwright')).href);
const chromium = PW.chromium || (PW.default && PW.default.chromium);
const { LAUNCH, PAGE, toPlay } = await import(new URL('../../testlib.mjs', import.meta.url).href);
const [FILE, OUT, SHOTS] = process.argv.slice(2);
if (!FILE || !OUT) { console.error('usage: node tools/probes/phoingame.mjs <file.glb> <outdir> [shots.json]'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });
const shots = SHOTS ? JSON.parse(fs.readFileSync(SHOTS, 'utf8')) : [
  { name: 'talk-far', take: 'Talk_with_Hands_Open', t: 1.2, dist: 3.2 },
  { name: 'face', take: 'Talk_with_Hands_Open', t: 1.2, dist: 1.15, side: -0.12 },
  { name: 'talk-near', take: 'Talk_with_Hands_Open', t: 1.2, dist: 1.7 },
  { name: 'cast-arm-up', take: 'mage_soell_cast', t: 0.79, dist: 2.6, turn: 35 },
  { name: 'cheer-arm-up', take: 'Sit_Cheer_with_Left_Hand', t: 0.93, dist: 2.4, turn: 60 }];
/* LEVEL=L: look D also drawn at the scene's light level L (a chapter sets it; v24.46: "D's unlit share is scaled to the
   scene's light level"), as <shot>-Dscene.png */
const LEVEL = +(process.env.LEVEL || 1), LOOKS = process.env.LOOKSET
  /* LOOKSET=name:K[:L],...: each look named, its unlit share K on his skin (1 = D, 0 = lit, between = a blend) at level L */
  ? process.env.LOOKSET.split(',').map(x => { const [n, k, l] = x.split(':'); return [+k, n, +(l || 1)]; })
  : [[1, 'D', 1], ...(LEVEL !== 1 ? [[1, 'Dscene', LEVEL]] : []), [0, 'lit', 1]];
const DESK = !!process.env.DESKTOP, THREE_DIR = path.resolve(new URL('../../node_modules/three', import.meta.url).pathname);
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(DESK ? { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 }
  : { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 200)); });
/* his file, and three's loader beside the game (the game's own three is bundled and out of reach; a second copy of the
   same version makes objects the game's renderer draws as its own) */
await p.route('**/__pho/**', async route => { const u = new URL(route.request().url()).pathname.replace(/^\/__pho\//, '');
  if (u === 'model.glb') return route.fulfill({ body: fs.readFileSync(FILE), contentType: 'model/gltf-binary' });
  const f = path.join(THREE_DIR, u.replace(/^three\//, '')); if (!f.startsWith(THREE_DIR) || !fs.existsSync(f)) return route.fulfill({ status: 404, body: 'no' });
  const src = fs.readFileSync(f, 'utf8').replace(/from 'three'/g, "from '/__pho/three/build/three.module.js'");
  return route.fulfill({ body: src, contentType: 'text/javascript' }); });
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's';
const CH = process.env.CH || 'e4c1';   // CH=<chapter key>: whose world and light he stands in (e4c1's yard by default)
await p.goto(PAGE + '?ch=' + CH, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => window.__enc.loads().pending === 0, null, { timeout: 600000, polling: 500 });
console.log(el(), 'play, loads done');
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const info = await p.evaluate(async () => {
  const T = await import('/__pho/three/build/three.module.js');
  const { GLTFLoader } = await import('/__pho/three/examples/jsm/loaders/GLTFLoader.js');
  const { MeshoptDecoder } = await import('/__pho/three/examples/jsm/libs/meshopt_decoder.module.js');
  window.__phoLevel = { value: 1 };
  const g = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync('/__pho/model.glb');
  const root = g.scene, E = window.__enc; let tris = 0;
  root.traverse(o => { if (!o.isMesh) return; o.frustumCulled = false; tris += (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3;
    const n = o.geometry.attributes.position.count; o.geometry.setAttribute('lookMask', new T.BufferAttribute(new Float32Array(n).fill(1), 1));
    for (const mt of [].concat(o.material)) { mt.userData.look = { value: 1 }; mt.userData.level = window.__phoLevel; const WHOLE = mt.name.endsWith('(face and hands)');
      /* look D, as tools/clipsheet.mjs --look=skin@raw: after the tone mapping, the texel's own colour where it is saturated
         (skin, beads, gold: saturation 0.12-0.25 eased), the robe left lit; uK 0 draws him lit */
      mt.onBeforeCompile = sh => { sh.uniforms.uK = mt.userData.look; sh.uniforms.uLevel = mt.userData.level;
        sh.vertexShader = 'attribute float lookMask;\nvarying float vLook;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvLook = lookMask;');
        sh.fragmentShader = 'varying float vLook;\nuniform float uLevel;\nuniform float uK;\n' + sh.fragmentShader.replace('#include <tonemapping_fragment>', '#include <tonemapping_fragment>\n'
          /* v24.55: his face-and-hands part (tools/rebake.py) unlit whole, his grey hair too */
          + (WHOLE ? 'float skn = 1.0;\n' : 'vec3 sc = pow(max(diffuseColor.rgb, vec3(1e-4)), vec3(1.0 / 2.2)); float mxc = max(sc.r, max(sc.g, sc.b)); float skn = smoothstep(0.12, 0.25, (mxc - min(sc.r, min(sc.g, sc.b))) / max(mxc, 1e-4));\n')
          + 'gl_FragColor.rgb = mix(gl_FragColor.rgb, diffuseColor.rgb * uLevel, clamp(vLook * uK * skn, 0.0, 1.0));'); };
      mt.customProgramCacheKey = () => 'phoLookD' + (WHOLE ? ':whole' : ''); mt.needsUpdate = true; } });
  E.scene.add(root);
  const mixer = new T.AnimationMixer(root);
  window.__pho = { root, mixer, clips: g.animations, T,
    place: (take, t, dist, side, turn) => {
      const cam = E.camera; cam.updateMatrixWorld(true);
      const cp = new T.Vector3().setFromMatrixPosition(cam.matrixWorld), fw = new T.Vector3(0, 0, -1).transformDirection(cam.matrixWorld); fw.y = 0; fw.normalize();
      const rt = new T.Vector3(-fw.z, 0, fw.x), x = cp.x + fw.x * dist + rt.x * (side || 0), z = cp.z + fw.z * dist + rt.z * (side || 0);
      const y = E.groundAt ? (E.groundAt(x, z) || 0) : 0;
      root.position.set(x, y, z); root.rotation.set(0, Math.atan2(cp.x - x, cp.z - z) + (turn || 0) * Math.PI / 180, 0);
      mixer.stopAllAction(); const c = g.animations.find(a => a.name === take); if (!c) return { error: 'no take ' + take };
      const a = mixer.clipAction(c); a.reset().play(); mixer.setTime(Math.min(t, c.duration - 0.01)); root.updateMatrixWorld(true);
      return { at: [x, y, z].map(v => +v.toFixed(2)), cam: [cp.x, cp.y, cp.z].map(v => +v.toFixed(2)), eye: +(cp.y - y).toFixed(2) }; },
    look: (k, lv) => { window.__phoLevel.value = lv ?? 1; root.traverse(o => { if (o.isMesh) for (const mt of [].concat(o.material)) mt.userData.look.value = k; }); } };
  return { tris, takes: g.animations.length, tone: E.renderer.toneMapping, expo: E.renderer.toneMappingExposure, ratio: E.renderer.getPixelRatio() };
});
console.log(el(), 'Pho in the scene', JSON.stringify(info));
/* HANDS=0: the player's hands hidden, as a film shows him (play shows them, and up close they cover him) */
if (process.env.HANDS === '0') await p.evaluate(() => { window.__enc.handsRoot.visible = false; });
for (const s of shots) {
  const where = await p.evaluate(s => window.__pho.place(s.take, s.t, s.dist, s.side, s.turn), s);
  for (const [k, n, lv] of LOOKS) {
    await p.evaluate(([k, lv]) => window.__pho.look(k, lv), [k, lv]); await frames(4);
    await p.screenshot({ path: path.join(OUT, `${s.name}-${n}.png`), timeout: 300000 }); }
  console.log(el(), s.name, JSON.stringify(where));
}
console.log('errors:', errs.length ? errs.slice(0, 8).join(' | ') : 'none');
await b.close();
process.exit(errs.some(e => e.startsWith('PAGEERROR')) ? 1 : 0);
