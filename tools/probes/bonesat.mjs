/* v27.0 · where a person's bones are in the world, as the game draws them: the chapter booted through the title, a
   bookmark applied (or none), each named person's bones read in world metres and in its own group's frame (so a body
   can be placed against another by numbers before it is photographed). Needs the chapter's stage.person(key, i).
     CHROMIUM_PATH=... CH=e4c4 [PHASE=sight] KEYS='p4amma,p4oppress' [SETTLE=4000] node tools/probes/bonesat.mjs */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const CH = process.env.CH || 'e4c4', KEYS = (process.env.KEYS || 'p4amma,p4oppress').split(','), SETTLE = +(process.env.SETTLE || 4000);
const b = await chromium.launch(LAUNCH);
const p = await (await b.newContext({ viewport: { width: 640, height: 480 } })).newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(PAGE + '?ch=' + CH, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
if (process.env.PHASE) { await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), process.env.PHASE);
  await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 600000, polling: 300 }); }
await p.waitForFunction((keys) => keys.every(k => { const [key, i] = k.split('#'); const P = window.__enc.stage.person(key, +(i || 0)); return P && P.ready; }), KEYS, { timeout: 600000, polling: 500 });
await p.waitForTimeout(SETTLE);
const out = await p.evaluate((keys) => {
  const NAMES = ['Hips', 'Spine', 'Spine1', 'Spine2', 'Neck', 'Head', 'HeadTop_End', 'LeftShoulder', 'LeftArm', 'LeftForeArm', 'LeftHand',
    'RightShoulder', 'RightArm', 'RightForeArm', 'RightHand', 'LeftUpLeg', 'LeftLeg', 'LeftFoot', 'LeftToeBase', 'RightUpLeg', 'RightLeg', 'RightFoot', 'RightToeBase'];
  const r = {};
  for (const k of keys) { const [key, i] = k.split('#'); const P = window.__enc.stage.person(key, +(i || 0)); if (!P) { r[k] = null; continue; }
    P.group.updateWorldMatrix(true, true);
    const inv = P.group.matrixWorld.clone().invert(), V = P.group.position.constructor, w = new V(), l = new V(), o = {};
    for (const n of NAMES) { const bn = P.bone[n] || P.bone['mixamorig:' + n] || P.bone['mixamorig' + n]; if (!bn) continue;
      bn.getWorldPosition(w); l.copy(w).applyMatrix4(inv);
      o[n] = { w: [w.x, w.y, w.z].map(v => +v.toFixed(3)), l: [l.x, l.y, l.z].map(v => +v.toFixed(3)) }; }
    r[k] = { group: [P.group.position.x, P.group.position.y, P.group.position.z].map(v => +v.toFixed(3)), ry: +P.group.rotation.y.toFixed(3),
      s: +P.group.scale.x.toFixed(3), take: P.cur, bones: o }; }
  return r; }, KEYS);
for (const [k, v] of Object.entries(out)) {
  if (!v) { console.log(k, 'not found'); continue; }
  console.log('==', k, 'group', v.group.join(','), 'ry', v.ry, 's', v.s, 'take', v.take);
  for (const [n, q] of Object.entries(v.bones)) console.log('  ' + n.padEnd(14), 'world', q.w.map(x => x.toFixed(3).padStart(7)).join(' '), '  local', q.l.map(x => x.toFixed(3).padStart(7)).join(' '));
}
console.log('errors', errs.length, errs.slice(0, 3).join(' | '));
await b.close();
