/* Every word on screen is editable — proved, not assumed.

   Two ways this can silently rot: someone adds copy straight into the markup
   (so it never reaches the sheet), or a key stays in the sheet after the text
   it fed is gone (so Chad edits something that changes nothing). This fails
   on either, on every screen, so the sheet can never quietly go stale.     */
import { chromium } from 'playwright';
import { LAUNCH, PAGE } from './testlib.mjs';
import { readFileSync } from 'fs';
import { DIR } from './testlib.mjs';
import { join } from 'path';

const b = await chromium.launch(LAUNCH);
const p = await b.newPage({ viewport: { width: 900, height: 700 } });
p.setDefaultNavigationTimeout(180000); p.setDefaultTimeout(60000);
await p.goto(PAGE); await p.waitForTimeout(6000);
/* v6.2: open the selector so its painted words are on the page for the scan
   below — they come from T() and the chapter files, never from markup, and
   the scan should be able to say so rather than never see them */
await p.evaluate(() => { try { window.__enc.markReached('ch3'); window.__enc.markSealed('ch1', 91, 'S'); } catch {} });
await p.click('#chaptersBtn'); await p.waitForTimeout(400);
/* v6.3: and the episode card, painted for episode 1 — its labels carry data-t,
   the rest comes from T() and the chapters (a card on the title screen is
   harmless here: the scan only reads text) */
await p.evaluate(() => { try { window.__enc.episodeCard(1); } catch {} });
await p.waitForTimeout(300);

// slots filled at runtime from the chapter file or from live numbers
const DYNAMIC = ['brief','qtext','say','teach','core','rank','pct','vSan','vAwa','vWis',
                 'chapLabel','chapTitle','ikey','itxt','hintTxt','choices','deltas','ticks','overSay',
                 'chapEp','chEpName','chTabs',    // v6.0: the card's episode line, the selector's heading and tabs — all from T()
                 'epEp','epTitle','epRank','epScore','epNext','epBtn'];   // v6.3: the episode card's painted lines

const untagged = await p.evaluate(dynamic => {
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    if (el.closest('svg') || ['SCRIPT','STYLE','CANVAS'].includes(el.tagName)) continue;
    // direct text of this element only, ignoring children
    const own = [...el.childNodes].filter(n => n.nodeType === 3)
      .map(n => n.textContent.trim()).join(' ').trim();
    if (!own || !/[A-Za-z]{2}/.test(own)) continue;
    if (el.closest('[data-t]')) continue;
    if (dynamic.includes(el.id) || dynamic.includes(el.parentElement?.id)) continue;
    if (el.closest('#choices, #deltas, #ticks, #chTabs, #chEpName, #chList, #epTally, #epMap')) continue;   // painted whole by the engine from T() and the chapters (v6.2, v6.3)
    out.push((el.id ? '#' + el.id : el.tagName.toLowerCase() + '.' + el.className) + ' -> ' + own.slice(0, 60));
  }
  return out;
}, DYNAMIC);

// and every key in the sheet must actually reach something
const shell = readFileSync(join(DIR, 'shell.html'), 'utf8');
const main = readFileSync(join(DIR, 'src', 'main.js'), 'utf8');
const win = {}; new Function('window', readFileSync(join(DIR, 'src', 'strings.js'), 'utf8'))(win);
const keys = Object.keys(win.__TEXT__);

/* Some key families are composed at runtime -- T('slot.' + key), T('item.' +
   id + '.name') -- so the literal key never appears in the source and the
   plain search below would call them dead. Rather than exempt them, check
   them exactly: the engine's own tables say which ones can be built, so a
   composed key is reachable if and only if its table has that entry. A
   stale slot or an item that no longer exists still fails.               */
const listOf = re => { const m = main.match(re); return m ? m[1] : ''; };
const slots = [...listOf(/const GEAR_SLOTS = \[([^\]]*)\]/).matchAll(/'([^']+)'/g)].map(m => m[1]);
const items = [...listOf(/const ITEM_DEFS = \{([\s\S]*?)\n\};/).matchAll(/^\s{2}(\w+):/gm)].map(m => m[1]);
const composed = new Set();
if (main.includes("T('slot.' + key")) slots.forEach(k => composed.add('slot.' + k));
if (main.includes("T('item.' + id + '.name'")) items.forEach(k => composed.add('item.' + k + '.name'));
if (main.includes("T('item.' + id + '.desc'")) items.forEach(k => composed.add('item.' + k + '.desc'));
/* v6.0: the episodes' words are composed too -- T(`ep${n}.label`) on the
   chapter card and the selector, T(`ep${n}.title`) under the tabs -- for
   n in 1..EPISODE_COUNT, which is the engine's own constant. So a sheet
   that lost ep7.title still fails, and an eleventh episode's rows would be
   dead until the count says otherwise. */
const epCount = +listOf(/const EPISODE_COUNT = (\d+)/) || 0;
if (main.includes('T(`ep${') && main.includes('.label`')) for (let n = 1; n <= epCount; n++) composed.add(`ep${n}.label`);
if (main.includes('T(`ep${') && main.includes('.title`')) for (let n = 1; n <= epCount; n++) composed.add(`ep${n}.title`);
console.log('composed at runtime:', composed.size, '(' + slots.length + ' slots,',
            items.length, 'items,', epCount, 'episodes)');

const dead = keys.filter(k => !shell.includes(`data-t="${k}"`) && !main.includes(`'${k}'`)
                           && !composed.has(k));
// and the reverse: a table entry the sheet has no words for would render its
// own id on screen, which is never what anyone wants
const wordless = [...composed].filter(k => !keys.includes(k));

console.log('ui strings:', keys.length);
console.log('untagged visible text:', untagged.length ? untagged : 'none');
console.log('keys that reach nothing:', dead.length ? dead : 'none');
console.log('slots or items with no words:', wordless.length ? wordless : 'none');
if (untagged.length || dead.length || wordless.length) {
  console.log('errors: [text not fully editable]'); process.exitCode = 1;
}
await b.close();
