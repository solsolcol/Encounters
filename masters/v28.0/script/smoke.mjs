/* v28.0 · episode 4 chapter 5: THE SKELETON, WALKED IN NODE (no browser, no build).
   The chapter file is a plain script that registers itself on window.__CHAPTERS__, and its world so far is one floor,
   so real three.js, a stand-in for the engine's kit and a clock this file owns are enough to RUN it: build(ctx), the
   first frame of play, every phase by the thing that is pressed in it, every film from play, the decision, the four
   endings' scenes, every saved phase string applied (and nonsense), a same-chapter replay read against a fresh start,
   and dispose. It proves that nothing in the chapter's own code throws or soft-locks; it proves nothing about the
   engine, the picture or the sound (those are the harnesses' and the probes', on a built game).

       node masters/v28.0/script/smoke.mjs                 the chapter as it stands in src/chapters/e4/e4c5.js
       node masters/v28.0/script/smoke.mjs <file.js>       a scratch copy (python3 -I masters/v28.0/assemble.py --out <file.js>)

   Exit 0 only when every check holds. Keep it true as the chapter is built: when a phase's play is real, drive it here
   the way a player can (v24.9), or take its part out and say so. */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import * as THREE from 'three';

const HERE = dirname(fileURLToPath(import.meta.url)), ROOT = resolve(HERE, '..', '..', '..');
const FILE = process.argv[2] ? resolve(process.argv[2]) : join(ROOT, 'src', 'chapters', 'e4', 'e4c5.js');
let bad = 0;
const ok = (name, pass, note = '') => { console.log(`${pass ? 'ok  ' : 'FAIL'} ${name}${note ? '  ' + note : ''}`); if (!pass) bad++; };

/* the clock is ours: the chapter reads performance.now() */
let NOW = 1000;
Object.defineProperty(globalThis, 'performance', { value: { now: () => NOW }, configurable: true, writable: true });
const warns = [];
const warn0 = console.warn; console.warn = (...a) => { warns.push(a.join(' ')); };

const win = { __CHAPTERS__: undefined };
globalThis.window = win;
(0, eval)(readFileSync(FILE, 'utf8'));
const CH = win.__CHAPTERS__ && win.__CHAPTERS__.e4c5;
ok('the chapter registers itself as e4c5', !!CH);
if (!CH) process.exit(1);

/* ---- a stand-in for the engine: just enough of ctx and the kit for the chapter's own code to run against */
function engine() {
  const E = { state: 'play', phase: null, objective: null, done: 0, waypoint: null, caps: [], films: [], decisions: 0, day: null, said: [] };
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(72, 390 / 844, 0.08, 160);
  const yaw = new THREE.Group(), pitch = new THREE.Group();
  scene.add(yaw); yaw.add(pitch); pitch.add(camera);
  yaw.position.set(CH.spawn.x, 0, CH.spawn.z);
  /* a film or a scene, walked: its tracks and steps run at their ends, its cues recorded */
  const walk = (fn) => {
    const steps = [], cues = []; let dur = 1;
    const T = (t0, t1) => { dur = Math.max(dur, +t0 || 0, (t1 === undefined ? +t0 : +t1) || 0); };
    const c = { keep: {}, endFade: 0 };
    const api = { tr: (t0, t1, f) => { T(t0, t1); steps.push([t1, () => f(1, t1)]); }, step: (t, f) => { T(t, t); steps.push([t, f]); },
                  fade: T, camTo: T, yawTo: T, pitchTo: T, lens: T, sfxFade: T, sfx: (at, kind) => cues.push([at, kind]),
                  rawK: k => k, smoothK: k => k, stage: E.stage, kit: E.kit, THREE, camera, yaw, pitch };
    fn(c, { yawPos: yaw.position.clone(), pitchX: 0 }, api);
    for (const [, f] of steps.sort((a, b) => a[0] - b[0])) f();
    return { c, dur, cues };
  };
  E.walk = walk;
  E.kit = {
    setPhase: v => { E.phase = v === undefined ? null : v; }, getPhase: () => E.phase,
    objective: (t, o) => { const n = t ? String(t) : null; if (n === E.objective) return; if (E.objective && !(o && o.complete === false)) E.done++; E.objective = n; },
    waypoint: p => { E.waypoint = p ? { x: p.x, z: p.z } : null; },
    captions: l => { if (l && l.length) E.caps.push(l[0].text); },
    daylight: (p) => { E.day = p; },
    film: (key, o = {}) => {
      const fn = CH.films && CH.films[key];
      if (typeof fn !== 'function' || E.state !== 'play') return false;
      E.state = 'cine'; const r = walk(fn); E.films.push(key + ' ' + r.dur.toFixed(1) + 's' + (r.c.keepFade ? ' (ends on black)' : ''));
      E.state = 'play'; if (o.onDone) o.onDone({ skipped: false });
      return true;
    },
    conduct: () => {}, getConduct: () => ({ s: 0, a: 0, notes: [] })
  };
  const ctx = { THREE, scene, camera, yaw, pitch, kit: E.kit, getState: () => E.state,
                startDecision: () => { E.decisions++; E.state = 'decide'; },
                worldSfx: (name) => { E.said.push(name); return null; },          // no take has landed: every line is held, then shown
                soundOff: () => false, warmSounds: () => {}, makeHellNote: () => new THREE.DataTexture(new Uint8Array([1, 2, 3, 255]), 1, 1) };
  E.scene = scene; E.yaw = yaw; E.ctx = ctx;
  E.stage = CH.build(ctx);
  /* frames: a tenth of a second each, on our clock */
  E.run = (secs) => { for (let i = 0; i < Math.ceil(secs * 10); i++) { NOW += 100; E.stage.updateNotes(0.1, NOW / 1000); } };
  /* press the thing a player could press now: the one live hotspot with this id, from within its radius */
  E.press = (id) => {
    const h = E.stage.hotspots.find(q => q.id === id);
    if (!h || (h.enabled && !h.enabled())) return false;
    yaw.position.set(h.pos.x, 0, h.pos.z + 0.5);
    return h.onInteract() !== false;
  };
  E.live = () => E.stage.hotspots.filter(h => !h.enabled || h.enabled()).map(h => h.id);
  return E;
}

/* ---- the data the chapter states */
const pos = new Set(['walk', 'hunt', 'fight', 'table', 'ask']);
ok('episode 4, chapter 5, in the run (never a preview: Chad, v27.0)', CH.episode === 4 && CH.id === 5 && !CH.preview);
ok('four choices, ranked B best, A good, C bad, D worst (the plan\'s 4.8)', CH.choices.map(c => c.k + ':' + c.verdict).join(' ') === 'A:good B:best C:bad D:worst');

/* ---- a fresh run, to the decision */
const E = engine(), S = E.stage;
ok('build() hands back a stage', !!S && typeof S.updateNotes === 'function' && Array.isArray(S.blockers) && S.ready() === true);
const SC = S.script;
ok('the script is in the chapter: every line has a length and its words', Object.keys(SC.LINES).length > 100 &&
   Object.keys(SC.LINES).every(k => SC.SECS[k] > 0 && typeof SC.LINES[k][2] === 'string' && SC.LINES[k][2].trim()),
   Object.keys(SC.LINES).length + ' lines');
ok('every place\'s list names lines of the script, each once', (() => { const all = Object.values(SC.SAID).flat(); return all.length === Object.keys(SC.LINES).length && all.every(k => SC.LINES[k]) && new Set(all).size === all.length; })());
ok('the four card lines are the choices\' own `say`', CH.choices.every(c => SC.LINES[CH.sayPrefix + c.k] && SC.LINES[CH.sayPrefix + c.k][2] === c.say));
ok('the opening film can be walked, and ends on its black', (() => { const r = E.walk(CH.intro); return r.c.keepFade === true && r.c.endFade === 1 && r.cues.length === 0; })());

E.run(0.3);
ok('the first frame of play applies the walkway', S.phase === 'walk' && E.objective === CH.words.objFollow && !!E.waypoint, `${S.phase} · "${E.objective}"`);
ok('only the gate is offered on the walkway', E.live().join() === 'gate', E.live().join());
ok('the gate is pressed', E.press('gate'));
ok('nothing is offered while its lines hand off (v21.21)', E.live().length === 0);
E.run(30);
ok('the devotee\'s film played and handed to the hunt', S.phase === 'hunt' && E.films[0] && E.films[0].startsWith('devotee'), E.films.join(', '));
ok('the hunt was booked before its film (a game closed in the film comes back in the hunt)', E.phase.startsWith('hunt'));
ok('the hunt\'s order counts from what is found', E.objective === CH.words.objHunt.replace('{n}', '0'), `"${E.objective}"`);
/* any order: the third, the first, the second */
for (const [id, n] of [['stain3', 1], ['stain1', 2]]) {
  ok(`${id} is pressed`, E.press(id)); E.run(12);
  ok(`the order reads ${n}/3, and the save carries it`, E.objective === CH.words.objHunt.replace('{n}', String(n)) && E.phase.split(':')[1].split(',').length === n, `"${E.objective}" · ${E.phase}`);
}
ok('a stain found is not offered again', !E.live().includes('stain3') && !E.live().includes('stain1') && E.live().includes('stain2'));
ok('stain2 is pressed', E.press('stain2')); E.run(40);
ok('his teacher\'s belief, the film of the preparation, and the fight', S.phase === 'fight' && E.films.some(f => f.startsWith('prepare')) && S.info().heard.includes('ph5h3'), E.films.join(', '));
ok('the fight\'s light is the night', E.day === S.presets.NIGHT);
ok('the stand-in for the fight is pressed', E.live().join() === 'cleanse' && E.press('cleanse')); E.run(2);
ok('the bag tied, then the collector\'s film in, and the table', S.phase === 'table' && E.films.slice(-2).map(f => f.split(' ')[0]).join() === 'bagtied,collector', E.films.join(', '));
ok('the table\'s light is the day', E.day === S.presets.DAY);
ok('the pieces are pressed', E.live().join() === 'pieces' && E.press('pieces')); E.run(30);
ok('the collector asks, and the decision opens', S.phase === 'ask' && E.decisions === 1 && S.info().heard.includes('co5t6'), `${S.phase} · decisions ${E.decisions}`);
ok('every line that never had a take was shown as a caption', E.caps.length === S.info().heard.length && E.caps.length >= 7, E.caps.length + ' captions');
ok('a step back: the decision opens again at the table', (() => { E.state = 'play'; E.yaw.position.set(CH.shrine.x, 0, CH.shrine.z + 1); const a = S.pile.interact(); return a === true && E.decisions === 2; })());
ok('before the question the pile is never live', (() => { const F = engine(); F.run(0.3); F.yaw.position.set(CH.shrine.x, 0, CH.shrine.z + 1); return F.stage.pile.interact() === false && F.stage.pile.hits() === false && F.stage.pile.inView() === false; })());
ok('the four endings can be walked, each ends on its black, none cues a sound that does not exist', CH.scenes.every(fn => { const r = E.walk(fn); return fn.length >= 3 && r.c.endFade === 1 && r.c.keepFade === true && r.cues.length === 0; }));
ok('every film from play can be walked, and ends clear', Object.values(CH.films).every(fn => { const r = E.walk(fn); return !r.c.keepFade && r.cues.length === 0 && r.dur > 3; }), Object.keys(CH.films).join(', '));
ok('no line was asked for that the script does not have', !warns.some(w => /no line/.test(w)), warns.join(' | '));

/* ---- every saved phase lands, and so does nonsense */
for (const saved of ['walk:', 'walk:t,j,d', 'hunt:', 'hunt:s2', 'hunt:s1,s2,s3', 'fight:', 'table:', 'table:m,k1', 'ask:', null, '', 'kept:w', 'hunt:zz,,s9']) {
  const F = engine(); F.phase = saved; let threw = null;
  try { F.run(0.3); F.run(45); } catch (e) { threw = e.message; }
  const p = F.stage.phase, want = saved && pos.has(String(saved).split(':')[0]) ? String(saved).split(':')[0] : 'walk';
  /* three stains found on the save: the hunt closes itself and goes on to the fight */
  const went = saved === 'hunt:s1,s2,s3' ? p === 'fight' : saved === 'ask:' ? p === 'ask' && F.decisions === 1 : p === want;
  ok(`a Continue from ${JSON.stringify(saved)} lands`, !threw && went && (p === 'ask' || F.live().length > 0), threw || `${p} · offered: ${F.live().join(', ') || '(the decision)'}`);
}

/* ---- a same-chapter replay: reset() and play again, read against a fresh start (v8.2) */
const trace = (G) => { const out = []; const see = (w) => out.push(`${w}|${G.stage.phase}|${G.phase}|${G.objective}|${G.live().join(',')}|${JSON.stringify(G.stage.snap())}`);
  G.run(0.3); see('boot'); G.press('gate'); G.run(30); see('gate'); for (const id of ['stain1', 'stain2', 'stain3']) { G.press(id); G.run(15); see(id); }
  G.run(30); see('hunt done'); G.press('cleanse'); G.run(2); see('cleanse'); G.press('pieces'); G.run(30); see('pieces'); return out; };
const fresh = trace(engine());
S.reset(); E.phase = null; E.objective = null; E.state = 'play'; E.decisions = 0; E.films.length = 0;
const again = trace(E);
ok('a replay after reset() reads the same as a fresh start', fresh.join('\n') === again.join('\n'), fresh.length + ' moments compared');
if (fresh.join('\n') !== again.join('\n')) for (let i = 0; i < fresh.length; i++) if (fresh[i] !== again[i]) { console.log('  fresh: ' + fresh[i] + '\n  again: ' + again[i]); break; }

/* ---- and it gives back what it took */
let threw = null; try { S.dispose(); } catch (e) { threw = e.message; }
ok('dispose() runs, and the world is out of the scene', !threw && !E.scene.children.includes(S.world), threw || '');

console.warn = warn0;
console.log(bad ? `\n${bad} FAILED` : '\nthe skeleton runs from its first frame to its four endings, every saved phase lands, and a replay reads the same');
process.exit(bad ? 1 : 0);
