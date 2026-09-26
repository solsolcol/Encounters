/* v15: MATRIX SKIP proof. In play and in a film, repeatedly: bring the scene up to
   date the way a render does (the incremental path), snapshot every world matrix,
   then force three's full recompute with the skip OFF and compare bitwise. */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const chs = process.argv.slice(2);
const b = await chromium.launch(LAUNCH);
let bad = 0;
const check = p => p.evaluate(() => {
  const E = window.__enc, roots = [E.scene];
  const objs = []; for (const r of roots) r.traverse(o => objs.push(o));
  E.scene.updateMatrixWorld();                          // what the renderer does
  const snap = objs.map(o => Float64Array.from(o.matrixWorld.elements));
  E.opt.matSkip = false; E.scene.updateMatrixWorld(true); E.opt.matSkip = true;   // three's own, forced
  let diff = 0, first = '';
  objs.forEach((o, i) => { const e = o.matrixWorld.elements; for (let k = 0; k < 16; k++) if (!Object.is(e[k], snap[i][k])) { diff++; if (!first) first = (o.name || o.type) + ' #' + o.id; break; } });
  return { n: objs.length, diff, first };
});
for (const ch of chs) {
  const p = await (await b.newContext({ viewport: { width: 640, height: 400 } })).newPage();
  p.setDefaultNavigationTimeout(240000);
  try {
    await p.goto(PAGE + '?ch=' + ch, { waitUntil: 'load' });
    await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
    await p.click('#startBtn', { timeout: 300000 });
    // IN THE FILM first (things move there), then in play
    await p.waitForFunction(() => window.__enc.getState() === 'cine', null, { timeout: 600000 }).catch(() => {});
    let n = 0, d = 0, first = '';
    for (let i = 0; i < 6; i++) { await p.waitForTimeout(2500); if (await p.evaluate(() => window.__enc.getState()) !== 'cine') break; const r = await check(p); n = r.n; d += r.diff; first = first || r.first; }
    console.log(`${ch} film: ${n} objects, ${d} matrices differ${first ? ' (first: ' + first + ')' : ''}`); if (d) bad++;
    await toPlay(p, 900000);
    d = 0; first = '';
    await p.keyboard.down('KeyW');
    for (let i = 0; i < 8; i++) { await p.waitForTimeout(1500); await p.evaluate(() => { window.__enc.yaw.rotation.y += 0.3; }); const r = await check(p); n = r.n; d += r.diff; first = first || r.first; }
    await p.keyboard.up('KeyW');
    console.log(`${ch} play:  ${n} objects, ${d} matrices differ${first ? ' (first: ' + first + ')' : ''}`); if (d) bad++;
  } catch (e) { console.log(ch + ': FAILED ' + e.message.split('\n')[0]); bad++; }
  await p.context().close();
}
console.log(bad ? `\n${bad} NOT BIT-IDENTICAL` : '\nevery matrix bit-identical to three\'s full recompute');
await b.close(); process.exit(bad ? 1 : 0);
