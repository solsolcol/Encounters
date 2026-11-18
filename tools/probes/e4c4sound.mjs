/* v27.0 · EPISODE 4 CHAPTER 4'S SOUND, HELD AGAINST WHAT SHOULD SOUND (chapter 3's e4c3sound.mjs, its films mode, for
   this chapter). On a phone (touch: the sound is on), read off the engine, never listened to (a session has no ears).
   What SHOULD sound is the list a static walk writes (CH=e4c4 OUT=cues.json node tools/probes/voicescan.mjs): per film
   every sfx(at, kind, vol). Each film is begun the way the game begins it (Start for the opening, kit.film from play for
   the trance and the loss, the decision's own button for an ending, each ending on a FRESH LOAD: v10.2) and each cue
   is reached by a seek to just before it and a resume (a seek fires no cue it has passed, so each is its own hop). A
   cue is HEARD when the engine's cue log shows it played from its decoded sample (__enc.stings(): how === 'sample');
   'decoding', 'no-pack' or 'no-sample' is a cue that made no sound. The beds the film holds are read at its start.
     ENC_DIST=<snap> CHROMIUM_PATH=... CUES=<cues.json> [ONLY=open,trance,lost,A,B,C,D] node tools/probes/e4c4sound.mjs
   Exits non-zero on a cue that did not sound or a page error. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const CUES = process.env.CUES ? JSON.parse(fs.readFileSync(process.env.CUES, 'utf8')) : {};
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
let bad = 0;
const errs = [];
async function boot(intro) {
  const b = await chromium.launch(LAUNCH);
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message.split('\n')[0]));
  p.on('console', m => { if (m.type() === 'error' && !/CERT|net::ERR/.test(m.text())) errs.push('console ' + m.text().slice(0, 200)); });
  await p.goto(PAGE + '?ch=e4c4', { waitUntil: 'load', timeout: 240000 });
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
  await mark(p);
  await p.evaluate(() => document.getElementById('startBtn').click());
  if (intro) await p.waitForFunction(() => window.__enc.cine && window.__enc.cine.active() && window.__enc.cine.t() > 0.15, null, { timeout: 1500000, polling: 300 });
  else { await toPlay(p, 1500000); await p.waitForTimeout(8000); }       // (v9.3: let a chapter boot before driving a phase)
  return { b, p };
}
const beds = (p) => p.evaluate(() => { const L = window.__enc.pack().loops; return Object.entries(L).filter(([, v]) => v > 0.004).map(([k, v]) => k + ' ' + (+v).toFixed(2)).join('  ') || '(none)'; });
/* the cue log's end, by the record itself (the log keeps its last 300 and shifts: an index would slide) */
const mark = (p) => p.evaluate(() => { const s = window.__enc.stings(); window.__mk = s[s.length - 1] || null; });
const since = (p) => p.evaluate(() => { const s = window.__enc.stings(); const i = window.__mk ? s.lastIndexOf(window.__mk) : -1; return s.slice(i + 1).map(r => ({ kind: r.kind, how: r.how })); });
/* the SAMPLES a list of cues plays, decoded: waited for before a film is driven (a player gives the decoder the seconds
   he spends reading a decision's four answers; a sample that NEVER decodes was never warmed, and is reported) */
async function decoded(p, list, label) {
  const names = [...new Set(list.map(q => q.kind))], t0 = Date.now();
  const ok = await p.waitForFunction((names) => { const d = new Set(window.__enc.pack().decodedNames); return names.every(n => d.has(n)); }, names, { timeout: 300000, polling: 400 }).then(() => true, () => false);
  const miss = ok ? [] : await p.evaluate((names) => { const d = new Set(window.__enc.pack().decodedNames); return names.filter(n => !d.has(n)); }, names);
  log(`   ${label}: its ${names.length} samples ${ok ? 'decoded' : 'NOT ALL DECODED'} after ${((Date.now() - t0) / 1000).toFixed(0)} s` + (miss.length ? ` (never: ${miss.join(' ')})` : ''));
}
/* one film's cues, hop by hop */
async function walk(p, label, list) {
  const dur = await p.evaluate(() => window.__enc.cine.dur());
  log(`${label}: ${dur.toFixed(2)} s on the engine, ${list.length} cues; beds at its start: ${await beds(p)}`);
  const heard = [], silent = [], used = {};
  const nth = (got, kind) => { const all = got.filter(x => x.kind === kind); return all[used[kind] || 0] || null; };
  let i = 0;
  while (i < list.length) {
    const group = [list[i]]; let j = i + 1;
    while (j < list.length && list[j].at - list[i].at < 0.4) group.push(list[j++]);
    const need = {}; for (const g of group) need[g.kind] = (need[g.kind] || 0) + 1;
    const want = Object.entries(need).map(([k, n]) => [k, (used[k] || 0) + n]);
    const have = (got) => want.every(([k, n]) => got.filter(x => x.kind === k).length >= n);
    let got = await since(p), ok = have(got);
    if (!ok) {
      const now = await p.evaluate(() => window.__enc.cine.t());
      if (now < list[i].at - 0.12) await p.evaluate((t) => { const C = window.__enc.cine; C.seek(t); C.resume(); }, Math.max(0, list[i].at - 0.12));
      else await p.evaluate(() => window.__enc.cine.resume());
      ok = await p.waitForFunction((want) => { const s = window.__enc.stings(); const k = window.__mk ? s.lastIndexOf(window.__mk) : -1; const got = s.slice(k + 1);
        return want.every(([kind, n]) => got.filter(r => r.kind === kind).length >= n); }, want, { timeout: 180000, polling: 200 }).then(() => true, () => false);
      got = await since(p);
    }
    for (const g of group) {
      const r = nth(got, g.kind); used[g.kind] = (used[g.kind] || 0) + 1;
      if (r && r.how === 'sample') heard.push(g.kind); else { silent.push(`${g.kind}@${g.at.toFixed(2)}:${r ? r.how : 'never fired'}`); bad++; }
    }
    i = j;
  }
  await p.evaluate(() => window.__enc.cine.seek(window.__enc.cine.t()));
  log(`   heard ${heard.length} of ${list.length}` + (silent.length ? `   NOT HEARD: ${silent.join('  ')}` : ''));
}
const want = (k) => !ONLY.length || ONLY.includes(k);
if (want('open')) {
  const { b, p } = await boot(true);
  const A = await p.evaluate(() => { const a = window.__enc.audio(); return { muted: a.muted, ctx: a.ctxState }; });
  log('the opening film; sound', JSON.stringify(A));
  await walk(p, 'opening film', CUES['opening film'].cues);
  await b.close();
}
for (const k of ['trance', 'lost'].filter(want)) {
  const { b, p } = await boot(false);
  log('in play; sound', JSON.stringify(await p.evaluate(() => { const a = window.__enc.audio(); return { muted: a.muted, ctx: a.ctxState }; })));
  await p.evaluate(() => window.__enc.stage.applyPhase('bless'));
  await p.waitForTimeout(4000);
  await decoded(p, CUES['film ' + k].cues, 'film ' + k);
  await mark(p);
  const ok = await p.evaluate((k) => window.__enc.kit.film(k), k);
  if (!ok) { log('film', k, 'was refused'); bad++; await b.close(); continue; }
  await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.cine.t() > 0.15, null, { timeout: 300000, polling: 200 }).catch(() => {});
  await walk(p, 'film ' + k, CUES['film ' + k].cues);
  await b.close();
}
for (const k of ['A', 'B', 'C', 'D'].filter(want)) {
  const { b, p } = await boot(false);
  const i = 'ABCD'.indexOf(k);
  await p.evaluate(() => window.__enc.stage.applyPhase('kept'));
  const open = await p.waitForFunction(() => window.__enc.getState() === 'decide' && document.querySelectorAll('#choices button.choice').length >= 4, null, { timeout: 300000, polling: 300 }).then(() => true, () => false);
  if (!open) { log('ending', k, ': the decision never opened'); bad++; await b.close(); continue; }
  await p.waitForFunction(() => { const P = document.querySelector('#decide .panel'); return P && P.getAnimations().every(a => a.playState === 'finished'); }, null, { timeout: 120000, polling: 200 }).catch(() => {});
  await decoded(p, CUES['ending ' + k].cues, 'ending ' + k);
  await mark(p);
  /* the option's own button, pressed as a finger presses it */
  const bx = await p.evaluate((i) => { const r = document.querySelectorAll('#choices button.choice')[i].getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, i);
  await p.touchscreen.tap(bx.x, bx.y);
  const began = await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.cine.t() > 0.15, null, { timeout: 300000, polling: 200 }).then(() => true, () => false);
  if (!began) { log('ending', k, ': its scene never began'); bad++; await b.close(); continue; }
  await walk(p, 'ending ' + k, CUES['ending ' + k].cues);
  await b.close();
}
log('page errors:', errs.length ? JSON.stringify([...new Set(errs)].slice(0, 8)) : 'none');
log(bad || errs.length ? `FAILED: ${bad} thing(s) did not sound` : 'every cue heard from its sample');
process.exit(bad || errs.length ? 1 : 0);
