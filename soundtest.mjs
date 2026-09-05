/* The music, the sound button, and the credits panel.

   Launched without any autoplay override, so what is measured is what a real
   visitor gets: nothing may make a sound until the page has been touched.   */
import { chromium, devices } from 'playwright';
import { LAUNCH, PAGE, toPlay } from './testlib.mjs';
const b = await chromium.launch(LAUNCH);

for (const [label, opts] of [['desktop', { viewport: { width: 520, height: 380 } }],
                             ['phone', devices['iPhone 13']]]) {
const ctx = await b.newContext(opts); const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
// the page is 4.5 MB and two of these run at once on a two-core box;
// the default 30 s navigation timeout is not enough for that
p.setDefaultNavigationTimeout(180000); p.setDefaultTimeout(60000);
await p.goto(PAGE); await p.waitForTimeout(5000);
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
await toPlay(p);                 // v6.4: through the film, the card, into play
out.buttonInPlay = await p.isVisible('#mute');
// his own line, three seconds after the world is his: heard when the sound is
// on, suppressed entirely when it is muted. (By this point the mute state is
// the OPPOSITE of the device default — the reload test above flipped it — so
// the desktop leg checks the line plays and the phone leg checks it doesn't.)
await p.waitForTimeout(5200);
const v = await p.evaluate(() => window.__enc.voice());
out.voice = v;
out.voiceDecoded = v.decoded && v.dur > 3.5 && v.dur < 5.5;   // the James line
out.voiceObeysMute = (await audio()).muted ? !v.played : v.played;
// the v2.3 sound pack: loaded in both builds, lazily decoded, loops driven
const pk = await p.evaluate(() => window.__enc.pack());
out.packLoaded = pk.loaded && pk.names >= 30;
// v4.2: the pack is split, and a chapter-1 player must be carrying only the
// shared pack and chapter 1's own — pulling ch2's or ch3's here would mean
// the split silently stopped splitting, which costs a download and nothing
// else, so nothing louder than this would ever notice.
out.packFormat = pk.format;
out.packFormatKnown = pk.format === 'opus' || pk.format === 'mp3';
out.packScopedToThisChapter = Array.isArray(pk.packs) && pk.packs.length <= 2
  && !pk.packs.some(k => /_ch[23]$/.test(k));
for (const k of ['packFormatKnown', 'packScopedToThisChapter'])
  if (out[k] !== true) errs.push(`ERR sound promise broken: ${k}`);
out.packLoopsDriven = pk.loops && typeof pk.loops.amb === 'number' && pk.loops.amb > 0;
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
