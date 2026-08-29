/* The equipment panel, on a mouse and on a finger.

   The thing this really guards is the collision between pointer lock and the
   HUD: while the lock is held, Chromium delivers every pointer event to the
   locked element, so a button that looks perfectly clickable is not. Two
   rules come out of that and both are asserted here — the panel gives the
   lock back while it is open, and a touch-only device never takes it in the
   first place.

   The second guard is that no move ever loses an item: after every lift,
   drop, double-click and drag, the same four items are still somewhere.    */
import { chromium, devices } from 'playwright';
import { LAUNCH, PAGE } from './testlib.mjs';

const FAILS = [];
const ck = (name, cond) => { if (!cond) FAILS.push(name); return cond; };

const b = await chromium.launch(LAUNCH);

for (const [label, opts] of [['desktop', { viewport: { width: 1100, height: 780 } }],
                             ['phone', devices['iPhone 13']]]) {
const touch = label === 'phone';
const ctx = await b.newContext(opts); const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
p.setDefaultNavigationTimeout(180000); p.setDefaultTimeout(60000);
await p.goto(PAGE); await p.waitForTimeout(5000);

const out = {};
const st = () => p.evaluate(() => window.__enc.inv());
const state = () => p.evaluate(() => window.__enc.getState());
const locked = () => p.evaluate(() => !!document.pointerLockElement);
const shown = sel => p.isVisible(sel);
const hit = sel => (touch ? p.tap(sel) : p.click(sel));
// every item in the game, wherever it currently sits — nothing may vanish
const census = async () => {
  const s = await st();
  return [...Object.values(s.gear), ...s.bag].filter(Boolean).sort().join(',');
};

// --- before the walk: the button belongs to play, not to the title screen
out.hiddenOnTitle = !(await shown('#invBtn'));
ck(label + ':hidden on title', out.hiddenOnTitle);

await hit('#startBtn');
await p.waitForFunction(() => window.__enc && window.__enc.getState() === 'play',
                        null, { timeout: 90000, polling: 120 });
await p.waitForTimeout(900);
out.shownInPlay = await shown('#invBtn');
ck(label + ':shown in play', out.shownInPlay);
out.keyBadge = await shown('.invLabel');   // the "Inventory [I]" label: keyboards only
ck(label + ':badge matches device', out.keyBadge === !touch);

// --- pointer lock: a mouse locks, a finger never does
out.lockedInPlay = await locked();
ck(label + ':lock only with a mouse', out.lockedInPlay === !touch);

const before = await census();

// --- opening. These are two genuinely different routes, and each device
// only has one of them: with the lock held there is no cursor to click the
// button with, which is what the "I" badge on it is telling the player.
// A desktop player who presses Esc first gets the cursor back and the
// button works -- asserted at the end.
if (touch) await p.tap('#invBtn'); else await p.keyboard.press('KeyI');
await p.waitForTimeout(600);
out.opens = await shown('#inv');
ck(label + ':opens', out.opens);
out.lockedWhileOpen = await locked();
ck(label + ':lock released while open', out.lockedWhileOpen === false);
out.roundButtonsHidden = !(await shown('#invBtn')) && !(await shown('#mute'));
ck(label + ':round buttons step aside', out.roundButtonsHidden);
out.stateIsInventory = await state() === 'inventory';
ck(label + ':play is frozen', out.stateIsInventory);

// the item description and the how-to line are the first things a short
// screen drops, so prove they are on screen, not just in the document
out.readableBottom = await p.evaluate(() => {
  const h = document.getElementById('invHint').getBoundingClientRect();
  const i = document.getElementById('invInfo').getBoundingClientRect();
  return h.bottom <= innerHeight + 1 && i.bottom <= innerHeight + 1 && h.top > 0;
});
ck(label + ':info and hint fit the screen', out.readableBottom);

const bag = i => `#invBag .slot:nth-child(${i + 1})`;
const gear = k => `#invGear .slot[data-key="${k}"]`;

// --- pick up, put down: the phone fits the light slot
await hit(bag(0)); await p.waitForTimeout(300);
out.liftedShowsHeld = (await st()).held === 'phone';
ck(label + ':a tap lifts', out.liftedShowsHeld);
await hit(gear('leftHand')); await p.waitForTimeout(400);
out.equipped = (await st()).gear.leftHand === 'phone';
ck(label + ':it goes where it fits', out.equipped);

// --- a slot it does not fit simply refuses and puts it back
await hit(gear('leftHand')); await p.waitForTimeout(250);
await hit(gear('neck')); await p.waitForTimeout(350);
const s2 = await st();
out.wrongSlotRefused = s2.gear.neck === null && s2.gear.leftHand === 'phone';
ck(label + ':a wrong slot refuses', out.wrongSlotRefused);

// --- double tap sends it home again.
// The touch route cannot be driven through the renderer here: two
// back-to-back touchscreen taps land ~900 ms apart under SwiftShader (they
// queue behind ~1 fps frames), so they would never fall inside the game's
// 330 ms double-tap window -- that measures the container, not the game.
// So the pair is dispatched in one task, at the slot's real coordinates,
// through the same listeners a finger reaches.
if (touch) {
  await p.evaluate(sel => {
    const at = document.querySelector(sel).getBoundingClientRect();
    const x = at.x + at.width / 2, y = at.y + at.height / 2;
    const ev = type => new PointerEvent(type, { bubbles: true, cancelable: true,
      clientX: x, clientY: y, pointerId: 1, pointerType: 'touch', isPrimary: true });
    for (let i = 0; i < 2; i++) {
      const el = document.querySelector(sel);   // repainted between taps
      el.dispatchEvent(ev('pointerdown'));
      el.dispatchEvent(ev('pointerup'));
    }
  }, gear('leftHand'));
} else await p.dblclick(gear('leftHand'));
await p.waitForTimeout(500);
out.quickMoveHome = (await st()).gear.leftHand === null;
ck(label + ':double tap unequips', out.quickMoveHome);

// --- dragging, which is the mouse's natural move and a finger's too
const box = async sel => (await p.locator(sel).boundingBox());
const src = await box(bag(1)), dst = await box(bag(7));
const c = r => [r.x + r.width / 2, r.y + r.height / 2];
if (touch) {
  await p.touchscreen.tap(...c(src));            // touch drag is a tap-tap here
  await p.waitForTimeout(250);
  await p.touchscreen.tap(...c(dst));
} else {
  await p.mouse.move(...c(src)); await p.mouse.down();
  await p.mouse.move(...c(dst), { steps: 12 }); await p.mouse.up();
}
await p.waitForTimeout(450);
out.movedWithinBag = (await st()).bag[7] === 'keys';
ck(label + ':an item moves inside the bag', out.movedWithinBag);

out.nothingLost = (await census()) === before;
ck(label + ':no move loses an item', out.nothingLost);

// --- closing, and play resumes exactly where it was
if (touch) { await p.tap('#invCloseBtn'); }
else { await p.keyboard.press('Escape'); }
await p.waitForTimeout(500);
out.closes = !(await shown('#inv'));
out.backToPlay = await state() === 'play';
ck(label + ':closes', out.closes);
ck(label + ':play resumes', out.backToPlay);

if (!touch) {
  out.lockBackAfterClose = await locked();
  ck('desktop:the mouse goes back to looking', out.lockBackAfterClose);
  // and the button itself, once the player has their cursor back
  await p.evaluate(() => document.exitPointerLock());
  await p.waitForTimeout(400);
  await p.click('#invBtn'); await p.waitForTimeout(500);
  out.buttonWorksUnlocked = await shown('#inv');
  ck('desktop:the button works with a cursor', out.buttonWorksUnlocked);
  await p.click('#invCloseBtn'); await p.waitForTimeout(400);
  out.closesOnButton = !(await shown('#inv'));
  ck('desktop:closes on the button', out.closesOnButton);
}

console.log(label.padEnd(8), JSON.stringify(out));
console.log('   errors:', errs.length ? errs : 'none');
if (errs.length) FAILS.push(label + ':page errors');
await ctx.close();
}
await b.close();

if (FAILS.length) { console.log('ERR', FAILS.join(' | ')); process.exit(1); }
console.log('all inventory checks passed');
