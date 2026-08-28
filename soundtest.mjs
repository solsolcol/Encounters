/* The music, the sound button, and the credits panel.

   Launched without any autoplay override, so what is measured is what a real
   visitor gets: nothing may make a sound until the page has been touched.   */
import { chromium, devices } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });

for (const [label, opts] of [['desktop', { viewport: { width: 520, height: 380 } }],
                             ['phone', devices['iPhone 13']]]) {
const ctx = await b.newContext(opts); const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto('file:///tmp/g/wrapped.html'); await p.waitForTimeout(5000);
const out = {};
const audio = () => p.evaluate(() => window.__enc.audio());
const shown = id => p.$eval('#' + id, e => !e.classList.contains('hide'));

// how it starts, before anyone has touched anything
const a0 = await audio();
out.startsMuted = a0.muted;
out.trackDecoded = a0.decoded && a0.seconds > 100;
out.buttonShowsMuted = await p.$eval('#mute', e => e.classList.contains('muted'));
out.mutedMatchesButton = out.startsMuted === out.buttonShowsMuted;

// the button toggles, and the gain follows
await p.click('#mute'); await p.waitForTimeout(900);
const a1 = await audio();
out.afterOneTap = { muted: a1.muted, gain: a1.gain, playing: a1.playing };
await p.click('#mute'); await p.waitForTimeout(900);
const a2 = await audio();
out.afterTwoTaps = { muted: a2.muted, gain: a2.gain };
out.gainFollowsMute = (a1.muted ? a1.gain < 0.02 : a1.gain > 0.2)
                   && (a2.muted ? a2.gain < 0.02 : a2.gain > 0.2);

// and the choice survives a reload
const wanted = !a0.muted;                       // we toggled twice: back to start
await p.click('#mute'); await p.waitForTimeout(500);
await p.reload(); await p.waitForTimeout(5000);
out.remembersAcrossReload = (await audio()).muted === wanted;

// the button is reachable on every screen
out.buttonOnTitle = await p.isVisible('#mute');
await p.click('#startBtn');
await p.waitForTimeout(1200);
out.buttonOnChapterCard = await p.isVisible('#mute');
await p.waitForFunction(() => window.__enc && window.__enc.getState() === 'play',
                        null, { timeout: 90000, polling: 120 });
out.buttonInPlay = await p.isVisible('#mute');
await p.evaluate(() => { const e = window.__enc;
  e.yaw.position.set(-1, 1.62, -3.6);
  e.yaw.rotation.y = Math.atan2(-(e.PILE_POS.x + 1), -(e.PILE_POS.z + 3.6));
  e.yaw.updateMatrixWorld(true); });
await p.waitForTimeout(2500);
await p.evaluate(() => window.__enc.interactPile()); await p.waitForTimeout(1500);
out.decisionOpen = await shown('decide');
// clickable, not merely present: the panel must not be sitting on top of it
await p.click('#mute', { timeout: 8000 }).then(() => out.buttonClickableOverPanel = true)
                                        .catch(() => out.buttonClickableOverPanel = false);
// and Step back is still reachable underneath it
await p.click('#stepBack', { timeout: 8000 }).then(() => out.stepBackStillReachable = true)
                                             .catch(() => out.stepBackStillReachable = false);

// credits
await p.reload(); await p.waitForTimeout(5000);
out.creditsClosedAtFirst = !(await shown('credits'));
await p.click('#creditsLink'); await p.waitForTimeout(600);
out.creditsOpen = await shown('credits');
out.attributions = await p.$$eval('#credits .credList li', els => els.map(e => ({
  what: e.querySelector('.credWhat').textContent.trim(),
  href: e.querySelector('a').getAttribute('href') })));
await p.click('#credClose'); await p.waitForTimeout(600);
out.closesOnX = !(await shown('credits'));
await p.click('#creditsLink'); await p.waitForTimeout(600);
await p.mouse.click(6, 6);                       // the backdrop, clear of the card
await p.waitForTimeout(600);
out.closesOnBackdrop = !(await shown('credits'));

console.log(label.padEnd(8), JSON.stringify(out));
console.log('   errors:', errs.length ? errs : 'none');
await ctx.close();
}
await b.close();
