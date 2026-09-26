/* v14.16 probe — the sound changes, measured on the hosted build, UNMUTED (hasTouch):
   the chair scrape in ch5 scene A on a fresh load; each chapter's opening line on a
   selector entry; which loops are RUNNING after each chapter change; whose decoded
   sounds are held; and nothing a model load recorded as an error. */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const b = await chromium.launch({ ...LAUNCH, args: [...(LAUNCH.args || []), '--enable-precise-memory-info'] });
const p = await (await b.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true })).newPage();
p.setDefaultNavigationTimeout(240000);
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message.split('\n')[0]));
p.on('console', m => { if ((m.type() === 'error' || /\[load\]/.test(m.text())) && !/CERT|net::ERR/.test(m.text())) errs.push(m.type() + ' ' + m.text().slice(0, 200)); });
await p.addInitScript(() => { try { localStorage.setItem('mz.encounters.progress', JSON.stringify({ reached: 'e2c5', t: 1 })); } catch {} });
await p.goto(PAGE + '?ch=ch5', { waitUntil: 'load' });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.click('#startBtn', { timeout: 400000 }); await toPlay(p, 900000);
await p.waitForTimeout(12000);
const snap = async (label) => {
  const r = await p.evaluate(() => {
    const e = window.__enc, pk = e.pack(), l = e.loads();
    const au = e.audio(), her = ['strings', 'whisper', 'swoosh', 'sobbing', 'gscream', 'ghostloop', 'gwail', 'gsigh', 'vghost', 'vscare1', 'vscare2', 'vscare3', 'vscare4'];
    return { ch: e.chapterKey(), loops: Object.keys(pk.loops), decodedBy: pk.decodedBy,
             music: (au.decoded ? 'decoded' : 'released') + '/' + (au.playing ? 'playing' : 'stopped') + ' gain ' + au.gain,
             her: e.pack().decodedNames ? her.filter(n => e.pack().decodedNames.includes(n)).length : -1,
             voices: e.voices().map(v => v.name), errs: l.log.filter(x => x.err).map(x => x.key + ':' + x.err),
             heap: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : -1 };
  });
  console.log(`${label}: ch ${r.ch} | music ${r.music} | her sounds decoded ${r.her} | loops [${r.loops.join(',')}] | decodedBy ${JSON.stringify(r.decodedBy)} | load errors ${r.errs.length ? r.errs.join(';') : 'none'} | heap ${r.heap} MB`);
  return r;
};
let r = await snap('ch5 fresh, in play');
console.log('   ch5 opening line said:', r.voices.includes('v5voice'), '| voices so far', r.voices.join(','));
await p.evaluate(() => { const e = window.__enc; const c = e.chapter; try { e.yaw.position.set(c.shrine.x + 0.5, 1.62, c.shrine.z + 0.5); } catch {} try { e.interactPile(); } catch {} });
const opened = await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 60000 }).then(() => true, () => false);
if (opened) {
  await p.waitForTimeout(800);
  await p.evaluate(() => window.__enc.pick(0));
  await p.waitForFunction(() => window.__enc.getState() === 'cine', null, { timeout: 120000 }).catch(() => {});
  await p.waitForFunction(() => window.__enc.getState() !== 'cine', null, { timeout: 900000 });
  const st = await p.evaluate(() => window.__enc.stings().filter(s => s.kind === 'sitdown'));
  console.log('   ch5 scene A sitdown cue:', JSON.stringify(st));
} else console.log('   ch5 decision did not open');
async function go(key) {
  await p.evaluate(() => { const e = window.__enc; if (e.getState() !== 'play') { try { e.returnToTitle(); } catch {} } });
  await p.waitForTimeout(1500);
  await p.evaluate(() => { const e = window.__enc; try { e.menuOpen(); } catch {} e.openChapters(); }); await p.waitForTimeout(900);
  await p.evaluate(k => { const tab = document.querySelector('#chTabs .chTab[data-ep="' + (k.startsWith('e2') ? 2 : 1) + '"]'); if (tab) tab.click(); }, key); await p.waitForTimeout(500);
  await p.evaluate(k => { const t = document.querySelector('#chList .chTile[data-ch="' + k + '"]'); t.click(); }, key); await p.waitForTimeout(900);
  await p.evaluate(() => { const y = document.getElementById('chYes'); if (y && y.offsetParent) y.click(); });
  await toPlay(p, 900000);
  await p.waitForTimeout(12000);
}
for (const k of ['ch4', 'e2c1', 'ch1', 'ch3']) {
  await go(k);
  r = await snap(k + ' via the selector');
  const line = { ch4: 'v4voice', e2c1: 'n1voice', ch1: 'voice', ch3: 'v3play' }[k];
  console.log(`   opening line ${line} said:`, r.voices.filter(v => v === line).length, 'time(s)');
}
console.log('page errors / load logs:', errs.length ? [...new Set(errs)].join(' | ') : 'none');
await b.close();
