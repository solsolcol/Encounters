/* What the ghost is supposed to do — v3.2, the horror-film rhythm — checked
   on a fixed clock so the slow headless renderer cannot affect the result:

     1. hidden at the spawn point, zero drain
     2. first sight: BEHIND the burner (the burner between you and her)
     3. she stands a beat, then darts: leaves the floor, covers ground,
        fades to nothing before she lands
     4. two-to-three seconds of nothing, then somewhere ELSE, in the deck
     5. cycling for 30 s she never reaches you and never leaves the deck
     6. the drain persists between flickers, and stops when you walk out

   Assertions are hard: any broken promise prints ERR and fails the run.  */
import { chromium } from 'playwright';
import { LAUNCH, PAGE } from './testlib.mjs';
const errs = [];
const b = await chromium.launch(LAUNCH);
const p = await b.newPage({ viewport: { width: 520, height: 360 } });
p.on('pageerror', e => errs.push('ERR ' + e.message));
p.setDefaultNavigationTimeout(180000); p.setDefaultTimeout(60000);
await p.goto(PAGE); await p.waitForTimeout(5000);
await p.click('#startBtn'); await p.waitForTimeout(600);
await p.waitForFunction(()=>window.__enc && window.__enc.getState()==='play',
                        null, { timeout: 90000, polling: 120 });
await p.evaluate(() => ['prompt', 'hud', 'hint', 'decide'].forEach(i => document.getElementById(i).classList.add('hide')));

const out = await p.evaluate(() => {
  const e = window.__enc, dt = 1 / 60, log = {};
  const BURNER = { x: -1.0, z: -7.5 };
  const place = (x, z, ry = 0) => {
    e.yaw.position.set(x, 1.62, z); e.yaw.rotation.y = ry; e.yaw.updateMatrixWorld(true);
  };
  const step = n => { for (let i = 0; i < n; i++) e.updateGhost(dt); };
  const gp = () => e.ghost.position;

  // 1. spawn: not there, no drain
  place(0, 17); step(180);
  log.hiddenAtSpawn = e.getReveal() < 0.001 && e.ghostDrainRate() === 0;

  // 2. walk in: she appears behind the burner
  place(0, 3); step(45);
  const v = { x: gp().x, z: gp().z };
  log.firstSightBehindBurner = e.getReveal() > 0.5 && v.z < BURNER.z + 0.2;

  // 3. stands, then darts: lifts, moves, fades before it ends
  let lifted = false, moved = false, fadedOut = false;
  for (let i = 0; i < 60 * 4; i++) {
    e.updateGhost(dt);
    if (gp().y > 0.2) lifted = true;
    if (Math.hypot(gp().x - v.x, gp().z - v.z) > 3) moved = true;
    if (moved && e.getReveal() === 0) { fadedOut = true; break; }
  }
  log.dartLifts = lifted; log.dartMoves = moved; log.dartFades = fadedOut;

  // 4. gone a couple of seconds, then somewhere else in the deck
  let frames = 0, back = null;
  for (let i = 0; i < 60 * 5; i++) {
    e.updateGhost(dt); frames++;
    if (e.getReveal() > 0.5) { back = { x: gp().x, z: gp().z, sec: frames / 60 }; break; }
  }
  log.reappears = !!back;
  log.afterSeconds = back ? +back.sec.toFixed(1) : null;
  log.somewhereElse = back ? Math.hypot(back.x - v.x, back.z - v.z) > 2 : false;
  log.stillInDeck = back ? back.z <= -1.19 && Math.abs(back.x) <= 20.5 : false;

  // 5. half a minute of the cycle: bounds and distance hold
  let minD = 99, outOfBounds = false;
  for (let i = 0; i < 60 * 30; i++) {
    e.updateGhost(dt);
    if (e.getReveal() > 0.05) {
      minD = Math.min(minD, Math.hypot(e.yaw.position.x - gp().x, e.yaw.position.z - gp().z));
      if (gp().z > -0.9 || Math.abs(gp().x) > 20.6) outOfBounds = true;
    }
  }
  log.keepsHerDistance = minD > 3.0;
  log.staysInDeck = !outOfBounds;

  // 6. drain: on while she haunts (flicker or not), off after retreat
  log.drainWhileHaunted = e.ghostDrainRate() > 0.1;
  for (let i = 0; i < 60 * 6; i++) { e.updateGhost(dt); if (e.getReveal() === 0) break; }
  log.drainBetweenFlickers = e.ghostDrainRate() > 0.1;
  place(0, 17); step(60 * 5);
  log.stopsAfterRetreat = e.getReveal() < 0.01 && e.ghostDrainRate() === 0;
  return log;
});

console.log(JSON.stringify(out, null, 1));
const MUST = ['hiddenAtSpawn', 'firstSightBehindBurner', 'dartLifts', 'dartMoves',
  'dartFades', 'reappears', 'somewhereElse', 'stillInDeck', 'keepsHerDistance',
  'staysInDeck', 'drainWhileHaunted', 'drainBetweenFlickers', 'stopsAfterRetreat'];
for (const k of MUST) if (out[k] !== true) errs.push(`ERR ghost promise broken: ${k}`);
console.log('errors:', errs.length ? errs : 'none');
await b.close();
if (errs.length) process.exit(1);
