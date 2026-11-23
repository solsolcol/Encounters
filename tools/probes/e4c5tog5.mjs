/* v28.0 (E4C5, build 49) · usage: node tools/probes/e4c5tog5.mjs src/chapters/e4/e4c5.js (plain Node, no browser) */
/* proves z_tail.js's TOG5 guard: the together film run against a stub whose live clock is TOG5 exactly (no error), then
   one mark moved (the error, naming it). The chapter file is read whole; nothing is written. */
import { readFileSync } from 'node:fs';
const src = readFileSync(process.argv[2], 'utf8');
const m = src.match(/const TOG5 = \{([^}]*)\}/); if (!m) { console.log('TOG5 not found'); process.exit(2); }
const TOG5 = {}; for (const p of m[1].split(',')) { const [k, v] = p.split(':').map(s => s.trim()); if (k) TOG5[k] = +v; }
const REAL = (T, tau) => { const H = 0.16, r = 1 / 12; let add = 0;
  for (const p of [T.p1, T.p2, T.p3]) { if (tau <= p) break; const d = tau - p; if (d < r * H) return tau + add + d / r - d; add += (1 - r) * H; }
  return tau + add; };
const anyProxy = () => { const f = function () { return anyProxy(); };
  return new Proxy(f, { get(t, k) { if (k === Symbol.toPrimitive) return () => 0; if (k === Symbol.iterator) return function* () {};
    if (k === 'then') return undefined; if (k === 'length') return 0; if (typeof k === 'symbol') return undefined; return anyProxy(); },
    set() { return true; }, apply() { return anyProxy(); }, has() { return true; } }); };
globalThis.window = { __CHAPTERS__: undefined }; (0, eval)(src);
const ch = window.__CHAPTERS__.e4c5, film = ch.films.together;
const run = (L) => { const errs = [], ce = console.error; console.error = (...a) => errs.push(a.join(' '));
  const together = { tl: () => L, real: (x) => REAL(L, x) };
  const films = new Proxy({}, { get: (t, k) => k === 'together' ? together : anyProxy() });
  const stage = new Proxy({}, { get: (t, k) => k === 'films' ? films : anyProxy() });
  const T = () => {}; const api = new Proxy({ tr: T, step: T, sfx: T, sfxFade: T, fade: T, rawK: (a, b, t) => Math.max(0, Math.min(1, (t - a) / (b - a))), stage },
    { get: (t, k) => k in t ? t[k] : anyProxy() });
  try { film(anyProxy(), anyProxy(), api); } catch (e) { errs.push('THREW ' + e.message); }
  console.error = ce; return errs; };
console.log('TOG5 read:', Object.keys(TOG5).length, 'marks');
console.log('exact clock  ->', JSON.stringify(run({ ...TOG5 })));
console.log('p2 moved 0.1 ->', JSON.stringify(run({ ...TOG5, p2: TOG5.p2 + 0.1 })));
console.log('end moved 1  ->', JSON.stringify(run({ ...TOG5, end: TOG5.end + 1 })));
