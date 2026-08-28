/* What the ghost is supposed to do, checked on a fixed clock so the slow
   headless renderer cannot affect the result:

     1. hidden at the spawn point
     2. fades in on the approach, from well outside the void deck
     3. walks toward you and stops short
     4. never leaves the void deck, however far out on the grass you stand

   (There is deliberately no freeze-while-watched behaviour — that was tried
   and removed. She simply fades in and comes on.)                            */
import { chromium } from 'playwright';
const errs = [];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1280, height: 760 } });
p.on('pageerror', e => errs.push('ERR ' + e.message));
await p.goto('file:///tmp/g/wrapped.html'); await p.waitForTimeout(5000);
await p.click('#startBtn'); await p.waitForTimeout(600);
await p.evaluate(() => ['prompt', 'hud', 'hint', 'decide'].forEach(i => document.getElementById(i).classList.add('hide')));

const out = await p.evaluate(() => {
  const e = window.__enc, dt = 1 / 60, log = [];
  const BURNER = { x: -1.0, z: -7.5 };
  const place = (x, z, ry = 0) => {
    e.yaw.position.set(x, 1.62, z); e.yaw.rotation.y = ry; e.yaw.updateMatrixWorld(true);
  };
  const toBurner = () => Math.hypot(e.yaw.position.x - BURNER.x, e.yaw.position.z - BURNER.z);
  const step = n => { for (let i = 0; i < n; i++) e.updateGhost(dt); };

  // 1. spawn: she must not be there
  place(0, 17); step(120);
  log.push({ at: 'spawn', toBurner: +toBurner().toFixed(1), reveal: +e.getReveal().toFixed(3) });

  // 2. the approach — where does she start to come in?
  let firstSeenAt = null;
  for (let z = 16; z > -6; z -= 0.5) {
    place(0, z); step(2);
    if (firstSeenAt === null && e.getReveal() > 0.001) firstSeenAt = +toBurner().toFixed(1);
  }
  log.push({ at: 'approach', fadeStartsAtMetresFromBurner: firstSeenAt });

  // 3. hold outside the deck: she comes on, but does not advance
  place(0, 6); const zHeld = e.ghost.position.z, xHeld = e.ghost.position.x;
  step(60 * 40);
  log.push({ at: 'held on the grass 40s', reveal: +e.getReveal().toFixed(3),
             movedWhileYouWaitOutside: +Math.hypot(e.ghost.position.x - xHeld,
                                                   e.ghost.position.z - zHeld).toFixed(3),
             ghostZ: +e.ghost.position.z.toFixed(2) });

  // 4. step inside: now she closes, and stops short
  place(-1, -3); step(60 * 40);
  log.push({ at: 'inside the deck 40s',
             distToPlayer: +Math.hypot(e.yaw.position.x - e.ghost.position.x,
                                       e.yaw.position.z - e.ghost.position.z).toFixed(2) });

  // 5. back out again: she does not follow you onto the grass
  place(0, 12); step(60 * 30);
  log.push({ at: 'retreated to the grass', ghostZ: +e.ghost.position.z.toFixed(2),
             leftTheDeck: e.ghost.position.z > -1.19,
             reveal: +e.getReveal().toFixed(3) });
  return log;
});

console.log(JSON.stringify(out, null, 1));
console.log('errors:', errs.length ? errs : 'none');
await b.close();
