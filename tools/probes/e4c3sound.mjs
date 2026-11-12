/* v26.0 · EPISODE 4 CHAPTER 3'S SOUND, HELD AGAINST WHAT SHOULD SOUND. On a phone (touch: the sound is on), read off the
   engine, never listened to (a session has no ears):

   MODE=films (the default)   every film and ending's cues. What SHOULD sound is the list a static walk writes
       (CH=e4c3 OUT=cues.json node tools/probes/voicescan.mjs): per film every sfx(at, kind, vol). Each film is begun the
       way the game begins it (Start for the opening, kit.film from play, the decision's own button for an ending) and
       each cue is reached by a seek to just before it and a resume (the film's clock advances at most half a second a
       drawn frame, so on this box a film played through would take many minutes; a seek fires no cue it has passed, so
       each is its own hop). A cue is HEARD when the engine's cue log shows it played from its decoded sample
       (__enc.stings(): how === 'sample'); 'decoding', 'no-pack' or 'no-sample' is a cue that made no sound. The
       endings' one breath is played, not seeked past (an eventWait is a wall in the film's clock). Also read at each
       film's start: the beds the film holds (pack().loops), so a film whose room is silent shows.
   MODE=play   the beds through play: at each phase the levels the engine holds for the chapter's seven beds, waited on
       (they ease on wall time), and the ambient one-shots counted over a stretch of play.

     ENC_DIST=<snap> CHROMIUM_PATH=... CUES=<cues.json> [MODE=films|play] [ONLY=open,festival,A,...] node tools/probes/e4c3sound.mjs
   Exits non-zero on a cue that did not sound, a bed that never reached its range, or a page error. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const MODE = process.env.MODE || 'films';
const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
const CUES = process.env.CUES ? JSON.parse(fs.readFileSync(process.env.CUES, 'utf8')) : {};
const BEDS = ['x3festbed', 'x3festmus', 'x3birds', 'x3open', 'x3crickets', 'x3pull', 'x3shophum'];
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
let bad = 0;
const errs = [];
async function boot(intro) {
  const b = await chromium.launch(LAUNCH);
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message.split('\n')[0]));
  p.on('console', m => { if (m.type() === 'error' && !/CERT|net::ERR/.test(m.text())) errs.push('console ' + m.text().slice(0, 200)); });
  await p.goto(PAGE + '?ch=e4c3', { waitUntil: 'load', timeout: 240000 });
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
  await mark(p);
  await p.evaluate(() => document.getElementById('startBtn').click());
  if (intro) await p.waitForFunction(() => window.__enc.cine && window.__enc.cine.active() && window.__enc.cine.t() > 0.15, null, { timeout: 1500000, polling: 300 });
  else {
    await toPlay(p, 1500000);
    await p.waitForFunction(() => { try { return window.__enc.stage.info().waiting !== undefined && window.__enc.stage.dayClock.t > 0.5; } catch { return false; } }, null, { timeout: 600000, polling: 500 });
  }
  return { b, p };
}
const beds = (p) => p.evaluate((B) => { const L = window.__enc.pack().loops; return Object.fromEntries(B.map(n => [n, +(L[n] || 0).toFixed(3)])); }, BEDS);
const bedStr = (o) => Object.entries(o).filter(([, v]) => v > 0.004).map(([k, v]) => k.replace('x3', '') + ' ' + v.toFixed(2)).join('  ') || '(none)';
/* the cue log's end, by the record itself (the log keeps its last 300 and shifts: an index would slide) */
const mark = (p) => p.evaluate(() => { const s = window.__enc.stings(); window.__mk = s[s.length - 1] || null; });
const since = (p) => p.evaluate(() => { const s = window.__enc.stings(); const i = window.__mk ? s.lastIndexOf(window.__mk) : -1; return s.slice(i + 1).map(r => ({ kind: r.kind, how: r.how })); });
/* the SAMPLES a list of cues plays, decoded: waited for before a film is driven. A player gives the decoder the seconds
   he spends reading a decision's four answers; this box (software drawing on every core) needs longer, and a cue the
   probe reaches before its sample has decoded is silent by design. A sample that NEVER decodes was never warmed: that
   is the fault this wait is here to find (it is reported, and its cue then fails as 'decoding') */
async function decoded(p, list, label) {
  const names = [...new Set(list.map(q => q.kind))], t0 = Date.now();
  const ok = await p.waitForFunction((names) => { const d = new Set(window.__enc.pack().decodedNames); return names.every(n => d.has(n)); }, names, { timeout: 300000, polling: 400 }).then(() => true, () => false);
  const miss = ok ? [] : await p.evaluate((names) => { const d = new Set(window.__enc.pack().decodedNames); return names.filter(n => !d.has(n)); }, names);
  log(`   ${label}: its ${names.length} samples ${ok ? 'decoded' : 'NOT ALL DECODED'} after ${((Date.now() - t0) / 1000).toFixed(0)} s` + (miss.length ? ` (never: ${miss.join(' ')})` : ''));
}
/* the breath: begun, held until it is full, let go (the chapter's own press path), until the film runs on */
async function breath(p) {
  await p.waitForFunction(() => { const e = window.__enc.kitDebug().event; return e && e.kind === 'breath'; }, null, { timeout: 300000, polling: 300 });
  await p.evaluate(() => { const E = window.__enc; E.evPress(); E.evRelease(); });
  await p.waitForFunction(() => { const e = window.__enc.kitDebug().event; return e && e.bState === 'wait'; }, null, { timeout: 300000, polling: 300 });
  await p.evaluate(() => window.__enc.evPress());
  await p.waitForFunction(() => { const e = window.__enc.kitDebug().event; return !e || e.bk > 0.5; }, null, { timeout: 300000, polling: 300 });
  await p.evaluate(() => window.__enc.evRelease());
  await p.waitForFunction(() => !window.__enc.kitDebug().event, null, { timeout: 600000, polling: 300 });
}
/* one film's cues, hop by hop. `wallAt` is the film time of its eventWait (the endings' breath), or null */
async function walk(p, label, list, wallAt) {
  const dur = await p.evaluate(() => window.__enc.cine.dur());
  log(`${label}: ${dur.toFixed(2)} s on the engine, ${list.length} cues; beds at its start: ${bedStr(await beds(p))}`);
  const heard = [], silent = [], used = {};
  /* a cue the film reached on its own clock before the probe took hold of it is read as it sounded then (a cue fires
     once): the nth of a kind in the film is the nth of that kind in the log since the film's mark */
  const nth = (got, kind) => { const all = got.filter(x => x.kind === kind); const r = all[used[kind] || 0]; return r || null; };
  let i = 0, passedWall = wallAt == null;
  while (i < list.length) {
    /* the cues that fall inside one hop (within 0.4 s of the first) are waited for together */
    const group = [list[i]]; let j = i + 1;
    while (j < list.length && list[j].at - list[i].at < 0.4) group.push(list[j++]);
    if (!passedWall && list[i].at > wallAt + 1e-3) {
      await p.evaluate((t) => { const C = window.__enc.cine; C.seek(t); C.resume(); }, Math.max(0, wallAt - 0.3));
      await breath(p); passedWall = true; log(`   (the breath played at ${wallAt.toFixed(2)})`);
    }
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
  await p.evaluate(() => window.__enc.cine.seek(window.__enc.cine.t()));      // (held where it is: the next film is begun from a known state)
  log(`   heard ${heard.length} of ${list.length}` + (silent.length ? `   NOT HEARD: ${silent.join('  ')}` : ''));
}
const want = (k) => !ONLY.length || ONLY.includes(k);
if (MODE === 'films') {
  if (want('open')) {
    const { b, p } = await boot(true);
    const A = await p.evaluate(() => { const a = window.__enc.audio(); return { muted: a.muted, ctx: a.ctxState }; });
    log('the opening film; sound', JSON.stringify(A));
    await walk(p, 'opening film', CUES['opening film'].cues, null);
    await b.close();
  }
  const rest = ['festival', 'between', 'tell', 'answers'].filter(want), ends = ['A', 'B', 'C', 'D'].filter(want);
  if (rest.length || ends.length) {
    const { b, p } = await boot(false);
    const A = await p.evaluate(() => { const a = window.__enc.audio(); return { muted: a.muted, ctx: a.ctxState, packs: window.__enc.pack().packs, decoded: window.__enc.pack().decoded }; });
    log('in play; sound', JSON.stringify(A));
    const PH = { festival: 'festival', between: 'check:t,a', tell: 'knelt:b', answers: 'knelt:b' };
    for (const k of rest) {
      await p.evaluate((ph) => { const E = window.__enc; E.stage.reset(); E.kit.setPhase(ph); }, PH[k]);
      await p.waitForFunction((ph) => window.__enc.stage.info().phase === ph.split(':')[0] && window.__enc.stage.dayClock.t > 0.3, PH[k], { timeout: 300000, polling: 300 });
      await decoded(p, CUES['film ' + k].cues, 'film ' + k);
      await mark(p);
      const ok = await p.evaluate((k) => window.__enc.kit.film(k), k);
      await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.cine.t() > 0.15, null, { timeout: 300000, polling: 200 }).catch(() => {});
      if (!ok) { log('film', k, 'was refused'); bad++; continue; }
      await walk(p, 'film ' + k, CUES['film ' + k].cues, null);
      await p.evaluate(() => window.__enc.cine.skip());
      await p.waitForFunction(() => !window.__enc.cine.active(), null, { timeout: 300000, polling: 300 }).catch(() => {});
    }
    await b.close();
  }
  /* each ending on a FRESH LOAD (v10.2: a first play is tested on a fresh load, never a replay; and a second decision in
     one page found the first one's buttons still in the document, and pressed one of those) */
  for (const k of ends) {
    const { b, p } = await boot(false);
    const i = 'ABCD'.indexOf(k);
    await p.evaluate(() => { const E = window.__enc; E.stage.reset(); E.kit.setPhase('decide:c3,f0'); });
    const open = await p.waitForFunction(() => window.__enc.getState() === 'decide' && document.querySelectorAll('#choices button.choice').length >= 4, null, { timeout: 180000, polling: 300 }).then(() => true, () => false);
    if (!open) { log('ending', k, ': the decision never opened'); bad++; await b.close(); continue; }
    await p.waitForTimeout(700);
    await decoded(p, CUES['ending ' + k].cues, 'ending ' + k);
    await mark(p);
    await p.evaluate((i) => document.querySelectorAll('#choices button.choice')[i].click(), i);
    const began = await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.cine.t() > 0.15, null, { timeout: 300000, polling: 200 }).then(() => true, () => false);
    if (!began) { log('ending', k, ': its scene never began'); bad++; await b.close(); continue; }
    const wall = await p.evaluate((k) => { const T = window.__enc.stage.dbg.clocks; return T[k].close + T.CLOSE.breath; }, k);
    await walk(p, 'ending ' + k, CUES['ending ' + k].cues, wall);
    await b.close();
  }
} else {
  const { b, p } = await boot(false);
  log('in play; muted', await p.evaluate(() => window.__enc.audio().muted));
  /* each phase: the range each bed must SETTLE in (they ease on wall time: the level is waited for, then read), the
     beds that must be down, and (the engine's own number) what loopVol was last asked for. The ranges are the
     chapter's BED table (d_play.js) with a tenth either side: a changed level changes these */
  const PHASES = [
    ['arrive',     { x3festbed: [0.57, 0.71], x3festmus: [0.34, 0.42] }, ['x3birds', 'x3open', 'x3crickets', 'x3shophum']],
    ['tables',     { x3festbed: [0.57, 0.71], x3festmus: [0.34, 0.42] }, ['x3birds', 'x3open', 'x3crickets', 'x3shophum']],
    ['check:t,a',  { x3festbed: [0.46, 0.57], x3festmus: [0.27, 0.34] }, ['x3birds', 'x3open', 'x3crickets', 'x3shophum']],
    ['dawn',       { x3birds: [0.50, 0.62] }, ['x3festbed', 'x3festmus', 'x3crickets', 'x3shophum', 'x3pull']],
    ['knelt:b',    { x3birds: [0.50, 0.62] }, ['x3festbed', 'x3festmus', 'x3crickets', 'x3shophum', 'x3pull']],
  ];
  for (const [ph, up, down] of PHASES) {
    if (ONLY.length && !ONLY.includes(ph.split(':')[0])) continue;
    await p.evaluate((ph) => { const E = window.__enc; E.stage.reset(); E.kit.setPhase(ph); }, ph);
    await p.waitForFunction((ph) => window.__enc.stage.info().phase === ph.split(':')[0] && window.__enc.stage.dayClock.t > 0.3, ph, { timeout: 300000, polling: 300 });
    /* (the stage's own mix, before the engine's duck under a voice: stage.amb().beds) */
    const ok = await p.waitForFunction(([up, down]) => { const M = window.__enc.stage.amb().beds, K = { x3festbed: 'fest', x3festmus: 'mus', x3birds: 'birds', x3open: 'open', x3crickets: 'crick', x3pull: 'pull', x3shophum: 'shop' };
      return Object.entries(up).every(([k, r]) => M[K[k]] >= r[0] && M[K[k]] <= r[1]) && down.every(k => M[K[k]] <= 0.01); }, [up, down], { timeout: 240000, polling: 400 }).then(() => true, () => false);
    if (!ok) bad++;
    const M = await p.evaluate(() => window.__enc.stage.amb().beds);
    log(`${ph.padEnd(10)} ${ok ? 'settled in its range' : 'NOT REACHED'}  the stage's mix: ${Object.entries(M).filter(([, v]) => v > 0.004).map(([k, v]) => k + ' ' + v.toFixed(2)).join('  ') || '(none)'}   the engine holds: ${bedStr(await beds(p))}`);
  }
  /* the ground's own noises: counted over a stretch of day one's play (a seeded stream on the chapter's clock) */
  if (!ONLY.length || ONLY.includes('amb')) {
    await p.evaluate(() => { const E = window.__enc; E.stage.reset(); E.kit.setPhase('tables'); });
    await p.waitForFunction(() => window.__enc.stage.info().phase === 'tables' && window.__enc.stage.dayClock.t > 0.3, null, { timeout: 300000, polling: 300 });
    const a0 = await p.evaluate(() => ({ n: window.__enc.stage.amb().n, t: window.__enc.stage.dayClock.t }));
    await p.waitForFunction((t0) => window.__enc.stage.dayClock.t >= t0 + 40, a0.t, { timeout: 1500000, polling: 500 });
    const a1 = await p.evaluate(() => window.__enc.stage.amb());
    log(`the ground's own noises in 40 s of day one's play: ${a1.n - a0.n} (the last: ${a1.last})`);
    if (a1.n - a0.n < 2) bad++;
  }
  await b.close();
}
log('page errors:', errs.length ? JSON.stringify([...new Set(errs)].slice(0, 8)) : 'none');
log(bad || errs.length ? `FAILED: ${bad} thing(s) did not sound` : MODE === 'films' ? 'every cue heard from its sample' : 'every bed settled where its phase puts it, and the ground made its own noises');
process.exit(bad || errs.length ? 1 : 0);
