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

// slots filled at runtime from the chapter file or from live numbers
const DYNAMIC = ['brief','qtext','say','teach','core','rank','pct','vSan','vAwa','vWis',
                 'chapLabel','chapTitle','ikey','itxt','hintTxt','choices','deltas','ticks','overSay'];

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
    if (el.closest('#choices, #deltas, #ticks')) continue;
    out.push((el.id ? '#' + el.id : el.tagName.toLowerCase() + '.' + el.className) + ' -> ' + own.slice(0, 60));
  }
  return out;
}, DYNAMIC);

// and every key in the sheet must actually reach something
const shell = readFileSync(join(DIR, 'shell.html'), 'utf8');
const main = readFileSync(join(DIR, 'src', 'main.js'), 'utf8');
const win = {}; new Function('window', readFileSync(join(DIR, 'src', 'strings.js'), 'utf8'))(win);
const keys = Object.keys(win.__TEXT__);
const dead = keys.filter(k => !shell.includes(`data-t="${k}"`) && !main.includes(`'${k}'`));

console.log('ui strings:', keys.length);
console.log('untagged visible text:', untagged.length ? untagged : 'none');
console.log('keys that reach nothing:', dead.length ? dead : 'none');
if (untagged.length || dead.length) { console.log('errors: [text not fully editable]'); process.exitCode = 1; }
await b.close();
