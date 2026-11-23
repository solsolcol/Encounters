/* v28.0 (R76's build, fixturetest's tagPartyHudLowPhone): THE TAG MODE'S HUD ON A LOW PHONE, its rectangles read. The fixture
   chapter (?ch=chtest) booted on a phone page (W x H, a touch context), its fight opened with the party list, the other body
   set far down the court (its mark at the screen's edge), a two-line caption up and a refusal's words said, exactly as
   fixturetest's phoneHud sets them; then every element the overlap check measures is read where it stands.
   The refusal is the game's own: the act made blocked with WORDS (default the fight's longest, "Lend the cage first"), then
   its button pressed by a real tap, as fixturetest presses it; CSS= lays extra rules over the page (a layout tried before a
   build).
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [W=360] [H=780] [WORDS=...] [CSS='...'] [OUT=file.png] node tools/probes/taghudlab.mjs */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const W = +(process.env.W || 360), H = +(process.env.H || 780);
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push(String(e.message)));
await p.goto(PAGE + '?ch=chtest', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 900000);
const ev = (src) => p.evaluate(new Function('return (async () => {' + src + '})();'));
if (process.env.CSS) await p.addStyleTag({ content: process.env.CSS });
const WORDS = process.env.WORDS || 'Lend the cage first';
const rows = await ev(`
  const E = window.__enc, kit = E.kit, st = E.stage;
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  const ok = st.fightOpen({ party: true, keys: { switch: 'Tab' }, arrow: { y: 1.6 } });
  for (let i = 0; i < 400 && !(kit.tagState().live && kit.tagState().party); i++) await frames(1);
  const A = st.fightBodies.a; kit.tagPlace('b', A.position.x + 0.6, A.position.z + 5.4, {});
  kit.captions([{ at: 0, end: 60, text: 'A line said while the fight is on, long enough to wrap onto two lines here.' }]);
  await frames(30);
  kit.tagAct('zap', { blocked: ${JSON.stringify(WORDS)} });
  await frames(3);
  const b0 = document.getElementById('tagA0').getBoundingClientRect(); window.__a0 = { x: b0.left + b0.width / 2, y: b0.top + b0.height / 2 };
  return 'set';`);
/* (the blocked button pressed by a real tap: the refusal says its words as a player's press makes it say them) */
const a0 = await p.evaluate(() => window.__a0);
await p.touchscreen.tap(Math.round(a0.x), Math.round(a0.y));
await p.waitForFunction(() => document.getElementById('nofire').classList.contains('on'), null, { timeout: 30000, polling: 100 }).catch(() => {});
const rows2 = await ev(`
  const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom), getComputedStyle(e).display]; };
  return { party: r('#tagParty'), mate: r('#tagMate'), nofire: r('#nofire'), caption: r('#caption'), count: r('#tagCount'), a0: r('#tagA0'), a1: r('#tagA1'), a2: r('#tagA2'),
           capTop: document.body.style.getPropertyValue('--capTop'), mateOn: document.getElementById('tagMate').classList.contains('on') };`);
console.log(W + 'x' + H, JSON.stringify(Object.assign({ setup: rows }, rows2)));
/* every pair of the mode's elements that overlap, as fixturetest's tagRead reads them (a rectangle's area in common) */
const R = rows2, names = ['party', 'mate', 'nofire', 'caption', 'count', 'a0', 'a1', 'a2'], bad = [];
for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) { const A = R[names[i]], B = R[names[j]];
  if (!A || !B || A[4] === 'none' || B[4] === 'none' || A[2] <= A[0] || B[2] <= B[0]) continue;
  if (Math.min(A[2], B[2]) > Math.max(A[0], B[0]) && Math.min(A[3], B[3]) > Math.max(A[1], B[1])) bad.push(names[i] + ' x ' + names[j]); }
console.log('overlaps', JSON.stringify(bad));
if (process.env.OUT) await p.screenshot({ path: process.env.OUT });
console.log('errors', JSON.stringify(errs.slice(0, 4)));
await b.close();
