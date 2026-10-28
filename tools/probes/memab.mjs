/* v24.3: what the sound buff costs in memory — episode 3 chapter 5 on a phone-sized touch context (sound on), the
   renderer's resident memory and its decoded sound read at three moments: play at the counter, the room ('care', by the
   stage's own applyPhase once the chapter has booted), and the decision open (startDecision has warmed every ending).
   The renderer is found by the browser's own profile folder (a persistent context), its VmRSS read from /proc; the
   decoded sound is the names __enc.packDecoded() lists, sized from SIZES ("name dur s Nch MB MB" lines).
   ENC_DIST=<snapshot> SIZES=<file> TAG=v24.x node tools/probes/memab.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const TAG = process.env.TAG || '?';
const SIZES = Object.fromEntries(fs.readFileSync(process.env.SIZES, 'utf8').trim().split('\n')
  .map(l => l.trim().split(/\s+/)).filter(p => p.length >= 5).map(p => [p[0], +p[p.length - 2]]));
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'memab-'));
const ctx = await chromium.launchPersistentContext(dir, { ...LAUNCH, viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const p = ctx.pages()[0] || await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's';
function rss() {
  let tot = 0, max = 0;
  for (const pid of fs.readdirSync('/proc').filter(d => /^\d+$/.test(d))) {
    let cmd = ''; try { cmd = fs.readFileSync(`/proc/${pid}/cmdline`, 'utf8'); } catch { continue; }
    if (!cmd.includes(dir) || !cmd.includes('--type=renderer')) continue;
    const m = (() => { try { return fs.readFileSync(`/proc/${pid}/status`, 'utf8').match(/VmRSS:\s+(\d+)/); } catch { return null; } })();
    if (m) { const mb = +m[1] / 1024; tot += mb; max = Math.max(max, mb); }
  }
  return { renderer: Math.round(max), all: Math.round(tot) };
}
const audio = async () => {
  const names = await p.evaluate(() => window.__enc.packDecoded());
  let mb = 0, n = 0; for (const nm of names) if (SIZES[nm] !== undefined) { mb += SIZES[nm]; n++; }
  return { decoded: n, mb: Math.round(mb) };
};
const at = async (tag) => { const a = await audio(); const r = rss(); console.log(el(), TAG, tag, JSON.stringify({ ...r, audioMB: a.mb, sounds: a.decoded })); };
await p.goto(PAGE + '?ch=e3c5', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForTimeout(20000);
await at('the counter');
await p.evaluate(() => window.__enc.stage.applyPhase('care'));
await p.waitForTimeout(20000);
await at('the room (care)');
await p.evaluate(() => window.__enc.stage.applyPhase('decide'));
await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 300000, polling: 500 }).catch(() => {});
await p.waitForTimeout(30000);
await at('the decision open');
console.log('errs', JSON.stringify(errs));
await ctx.close();
fs.rmSync(dir, { recursive: true, force: true });
console.log('exit');
