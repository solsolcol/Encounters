/* What the ghost is supposed to do — v3.3, the repertoire — on a fixed clock:

     1. hidden at the spawn point, zero drain
     2. first sight BEHIND the burner; she flees it
     3. the second sighting is ALWAYS the chase, and it comes AT the player
     4. over ninety seconds: at least three distinct variants, every spawn
        inside the player's view, never the same variant twice in a row
     5. perfectly upright the whole time (rotation.x/z exactly 0)
     6. she never leaves the deck; only the close scare comes nearer than
        the minimum distance, and never nearer than 1.5 m
     7. every sighting bites: sanity falls by chunks, fast
     8. drain persists between flickers; walking out stops everything     */
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

  // 2. walk in facing the deck: first sight behind the burner
  place(-1, -1.6, 0); step(45);
  log.firstSightBehindBurner = e.getReveal() > 0.5 && gp().z < BURNER.z + 0.2
    && e.ghostInfo().variant === 'flee';
  const sanity0 = e.stats.sanity;

  // 3-6. ninety seconds of the cycle, watched frame by frame
  const seen = [];
  let cur = null, minD = 99, minDNonClose = 99, tilt = 0, oob = false, spent = 0;
  let prevSan = e.stats.sanity;
  for (let i = 0; i < 60 * 90; i++) {
    e.updateGhost(dt);
    // the chunks are strong enough to kill the observer: account the loss,
    // then top the player back up so the machine is never frozen by lose()
    if (e.stats.sanity < prevSan) spent += prevSan - e.stats.sanity;
    if (e.stats.sanity < 40) e.stats.sanity = 100;
    prevSan = e.stats.sanity;
    tilt = Math.max(tilt, Math.abs(e.ghost.rotation.x), Math.abs(e.ghost.rotation.z));
    if (e.getReveal() > 0.05) {
      const info = e.ghostInfo();
      const d = Math.hypot(e.yaw.position.x - gp().x, e.yaw.position.z - gp().z);
      minD = Math.min(minD, d);
      if (info.variant !== 'close') minDNonClose = Math.min(minDNonClose, d);
      if (gp().z > -0.9 || gp().z < -18.9 || Math.abs(gp().x) > 20.6) oob = true;
      if (!cur) cur = { variant: info.variant, inView: e.ghostInView(), start: d, minD: d };
      cur.minD = Math.min(cur.minD, d);
    } else if (cur) { seen.push(cur); cur = null; }
  }
  // a sighting cut off by the end of the window is an unfinished
  // observation, not evidence — score only completed ones
  log.sightings = seen.length;
  log.enoughSightings = seen.length >= 8;
  log.secondIsChase = seen[1]?.variant === 'chase';
  log.chases = seen.filter(s => s.variant === 'chase')
                   .map(s => ({ start: +s.start.toFixed(1), minD: +s.minD.toFixed(1) }));
  log.chaseComesCloser = seen.filter(s => s.variant === 'chase')
                             .every(s => s.minD < s.start - 2);
  log.threePlusVariants = new Set(seen.map(s => s.variant)).size >= 3;
  log.allSpawnsInView = seen.every(s => s.inView);
  log.neverTwiceInARow = seen.every((s, i) => i === 0 || s.variant !== seen[i - 1].variant);
  log.alwaysUpright = tilt === 0;
  log.staysInDeck = !oob;
  log.closeFloor = minD > 1.5;
  log.othersKeepDistance = minDNonClose > 3.0;
  log.sanityBites = spent > 40;                        // chunks, not a trickle

  // 7b. the blind spot the review found: stand AT the burner facing the
  // deep half — every spawn must still be in view and in front of the wall
  place(-1, -7.0, 0); step(30);
  let deepBad = 0, deepSeen = 0, deepCur = false;
  for (let i = 0; i < 60 * 40; i++) {
    e.updateGhost(dt);
    if (e.stats.sanity < 40) e.stats.sanity = 100;
    if (e.getReveal() > 0.05) {
      if (!deepCur) { deepCur = true; deepSeen++;
        if (!e.ghostInView() || gp().z < -18.9) deepBad++; }
    } else deepCur = false;
  }
  log.deepSightings = deepSeen;
  log.deepDeckAllVisible = deepSeen >= 3 && deepBad === 0;

  // 8. drain between flickers; retreat ends it
  log.drainBetween = (() => {
    for (let i = 0; i < 60 * 6; i++) { e.updateGhost(dt); if (e.getReveal() === 0) break; }
    return e.ghostDrainRate() > 0.1;
  })();
  place(0, 17); step(60 * 5);
  log.stopsAfterRetreat = e.getReveal() < 0.01 && e.ghostDrainRate() === 0;
  return log;
});

console.log(JSON.stringify(out, null, 1));
const MUST = ['hiddenAtSpawn', 'firstSightBehindBurner', 'enoughSightings', 'deepDeckAllVisible',
  'secondIsChase', 'chaseComesCloser', 'threePlusVariants', 'allSpawnsInView',
  'neverTwiceInARow', 'alwaysUpright', 'staysInDeck', 'closeFloor',
  'othersKeepDistance', 'sanityBites', 'drainBetween', 'stopsAfterRetreat'];
for (const k of MUST) if (out[k] !== true) errs.push(`ERR ghost promise broken: ${k}`);
console.log('errors:', errs.length ? errs : 'none');
await b.close();
if (errs.length) process.exit(1);
