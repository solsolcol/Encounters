/* v28.0 · THE CLEANSING, SIMULATED (episode 4 chapter 5's tag-team fight: docs/V28.0-FIGHT.md is its specification).
   Loads masters/v28.0/parts/c_fightrules.js, THE SAME FILE the chapter is assembled from (v8.7: what is tested and what
   is played are one function), and plays it with simulated players on a fake clock (v21.2), 10,000 seeded fights each
   (v6.15), checking the fight's invariants after every step. A PROBE, not a harness (the rule that a chapter adds no
   harness stands: the plan's 14.1); run it at each milestone and whenever a number of the rules' table is turned.

     node tools/probes/fightsim.mjs                 every player, 10,000 fights each, four workers
     node tools/probes/fightsim.mjs --n 2000        fewer fights
     node tools/probes/fightsim.mjs --players careful,optimal --sanity 70 --workers 2
     node tools/probes/fightsim.mjs --trace careful --seed 7     one fight, every line said and every stage, printed
     node tools/probes/fightsim.mjs --trace careful --seed 7 --verbose    and every bubble, smell and landing, and the
                                                    court and the need every two seconds
     node tools/probes/fightsim.mjs --set 'holdSecs=35;wear=5'  try numbers without changing the table (said so on top)
   (about 15 minutes for every player on four busy cores here, 830 s on 21 Nov 2026: run it in the background)

   THE PLAYERS (each takes the lesson the way it plays; a lesson waits for its press, so a player who never presses its
   act would wait there for ever: those who play only one of the two, or nothing, are taken through the lesson as the
   careful player would be, and play their own way from stage 3, which is where "neither can win alone" is tested):
     careful   a careful first-timer: follows the prompts, waits to HEAR a new instruction (or reads the pulsing button
               after 4.5 s), 0.9 to 1.7 s to answer a new need, 0.7 to 1.3 s once it is known; 4% wrong presses. Each
               campaign is its own person: those numbers are scaled by 0.75 to 1.35, the pause after a line by 0.5 to
               1.5, the reading by 0.8 to 1.2 and the wrong presses by 0.5 to 1.5 (person())
     slow      a slow human: 400 ms to answer what the screen asks, 15% wrong presses
     late      the pair played as the screen asks, a second and a half late on every press (the plan's 14.1)
     optimal   knows the rules: answers in 150 ms, never wrong, binds several before the golden shockwave, keeps
               Grandmaster Pho where he can reach the court
     masher    presses a random button (the switch among them) every 0.12 to 0.30 s, taps random Prai, swings the stick
     never     never switches (from stage 3 on): presses whatever the one he is on can press
     onlyPho   plays Grandmaster Pho as well as he can be played, and never switches (from stage 3 on)
     onlyZav   switches to Master Zavier and plays him as well as he can be played, never back (from stage 3 on)
     nothing   presses nothing (from stage 3 on)
     fuzz      random presses, picks and taps on stale clouds, on frames of 4 to 250 ms (the plan's 14.1)
   A LOSS is followed by BEGIN AGAIN (after three, "Let Grandmaster Pho lead"), up to six tries: the campaign.

   WHAT IT PRINTS: for each player the first-try win rate, the win within two tries, the median length of a won fight
   (from START to the last bag), the losses, the sanity left; then the longest time any Prai stood in each state, the
   fight's own timed things, every move that the rules' state list does not allow, every state entered and never left,
   and every invariant broken. It exits 1 if a requirement of the specification fails (docs/V28.0-FIGHT.md 9). */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const PART = process.env.FIGHT_RULES ? path.resolve(process.env.FIGHT_RULES) : path.join(ROOT, 'masters/v28.0/parts/c_fightrules.js');   // FIGHT_RULES=<file>: another copy, to compare
const SCRIPT = path.join(ROOT, 'masters/v28.0/script/lines.json');
const SPEC = path.join(ROOT, 'docs/V28.0-FIGHT.md');

/* ------------------------------------------------------------------ the rules, as the chapter has them */
function loadRules() {
  const src = fs.readFileSync(PART, 'utf8');
  return vm.runInNewContext(src + '\n;FIGHT;', {}, { filename: 'c_fightrules.js' });
}
/* every line's length: its measured `secs`, else its words / the script's pace (assemble.py's own rule); a line the
   specification adds or changes, by the words the specification gives it, until the script carries them */
function loadLines() {
  const S = JSON.parse(fs.readFileSync(SCRIPT, 'utf8'));
  const pace = +S.pace || 2.3, words = {}, from = {};
  for (const r of S.lines) { words[r.key] = r.text; from[r.key] = 'script'; }
  const drop = new Set();
  if (fs.existsSync(SPEC)) {
    for (const ln of fs.readFileSync(SPEC, 'utf8').split('\n')) {
      const m = ln.match(/^\|\s*`?([a-z]+5[A-Za-z0-9]+)`?\s*\|\s*([a-z]+)\s*\|\s*(add|change|drop|keep)\s*\|\s*(.*?)\s*\|/);
      if (!m) continue;
      const [, key, , what, text] = m;
      if (what === 'drop') { drop.add(key); continue; }
      const t = text.replace(/^"|"$/g, '').trim();
      if ((what === 'add' || what === 'change') && t) { words[key] = t; from[key] = 'spec'; }
    }
  }
  const secs = {};
  for (const k in words) secs[k] = Math.round(words[k].split(/\s+/).filter(Boolean).length / pace * 100) / 100;
  for (const r of S.lines) if (r.secs) secs[r.key] = r.secs;
  return { secs, words, from, drop };
}

/* ------------------------------------------------------------------ a seeded stream (sfc32): the sim's own and the fight's */
function stream(seed) {
  let a = 0x9e3779b9 ^ seed, b = 0x243f6a88 ^ (seed * 7919), c = 0xb7e15162 ^ (seed * 104729), d = 1;
  const r = () => { a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; let t = (a + b) | 0; a = b ^ (b >>> 9); b = (c + (c << 3)) | 0; c = (c << 21) | (c >>> 11); d = (d + 1) | 0; t = (t + d) | 0; c = (c + t) | 0; return (t >>> 0) / 4294967296; };
  for (let i = 0; i < 12; i++) r();
  return r;
}

/* ------------------------------------------------------------------ the players */
const SLOTS = ['main', 'second', 'third', 'swap'];
function towards(b, x, z) { const dx = x - b.x, dz = z - b.z, d = Math.sqrt(dx * dx + dz * dz); return d > 0.08 ? { mx: dx / d, mz: dz / d } : null; }
function praiOf(st, id) { return id ? st.prai[id - 1] : null; }
function slotOf(st, act) {
  const s = st.who === 'pho' ? { FIRE: 'main', SHOCKWAVE: 'second', BAG: 'third' } : { BIND: 'main', SMELL: 'second', LEND: 'third' };
  return act === 'SWITCH' ? 'swap' : s[act] || '';
}
/* the parts every player shares: the brief read, the card answered, the film watched */
function common(st, mem, r, prof) {
  if (st.stage === 'brief') { if (st.t >= 0 && (mem.briefAt = (mem.briefAt ?? 0) + 0.1) > prof.brief) return { act: 'START' }; return {}; }
  if (st.stage === 'lost') { mem.cardT = (mem.cardT || 0) + 0.1; if (mem.cardT > prof.card) { mem.cardT = 0; return { act: st.losses >= 3 && prof.lead ? 'LEAD' : 'RETRY' }; } return {}; }
  if (st.stage === 'naga') { if (st.stageT >= 25) return { act: 'FILMDONE' }; return {}; }
  return null;
}
/* A PLAYER WHO FOLLOWS WHAT THE SCREEN ASKS (the pulse, and the line said): the careful one and the slow one */
function follower(prof) {
  return (st, mem, r, heard) => {
    const c = common(st, mem, r, prof); if (c) return c;
    const nd = st.cur;
    const key = nd ? nd.id + '|' + nd.act + '|' + nd.target : '';
    if (key !== mem.key) {
      mem.key = key; mem.since = st.t;
      const known = nd && mem.known[nd.id];
      mem.react = known ? prof.known[0] + r() * (prof.known[1] - prof.known[0]) : prof.fresh[0] + r() * (prof.fresh[1] - prof.fresh[0]);
      mem.listen = !!(nd && !known && prof.listen);
      mem.heardAt = -1;
    }
    if (!nd) return mem.moving ? keepMoving(st, mem) : {};
    // a new instruction is heard to its END before it is acted on (a careful first-timer listens, then acts)
    if (mem.listen && heard && heard.need === nd.id && mem.heardAt < 0) mem.heardAt = heard.end;
    let ready = st.t - mem.since >= mem.react;
    if (mem.listen) ready = ready && (mem.heardAt >= 0 ? st.t - mem.heardAt >= prof.think : st.t - mem.since >= prof.read);
    if (!ready) return mem.moving ? keepMoving(st, mem) : {};
    mem.known[nd.id] = 1;
    if (nd.move) {
      const p = praiOf(st, nd.target), b = st.who === 'pho' ? st.pho : st.zav;
      if (!p) return {};
      const m = towards(b, p.x, p.z); mem.moving = m ? { x: p.x, z: p.z } : null;
      return m || {};
    }
    mem.moving = null;
    if (!nd.ready) return {};
    if (st.t - mem.lastPress < prof.gap) return {};
    mem.lastPress = st.t; mem.since = st.t; mem.react = prof.again;
    if (r() < prof.wrong) { const s = SLOTS[Math.floor(r() * SLOTS.length)]; return { slot: s }; }
    if (nd.act === 'START' || nd.act === 'RETRY' || nd.act === 'TOGETHER') return { act: nd.act };
    return { slot: slotOf(st, nd.act) };
  };
}
/* THE GAME'S INPUT PATH (seam 60): the engine sends the rules a press only on a button that is LIVE; a press on one whose
   wait ring is filling, or that is blocked, is dropped before the rules see it. Every player's presses go through it */
function livePress(F, st, inp) {
  if (!inp || !(inp.act || inp.slot)) return inp;
  const act = inp.act || (inp.slot === 'swap' ? 'SWITCH' : inp.slot === 'together' ? 'TOGETHER' : F.SLOT[st.who === 'pho' ? 'pho' : 'zav'][inp.slot]);
  if (act && !F.why(st, act)) return inp;
  const out = { ...inp }; delete out.act; delete out.slot; delete out.pick; delete out.pickCloud; out.dropped = true;
  return out;
}
function keepMoving(st, mem) { const b = st.who === 'pho' ? st.pho : st.zav; const m = towards(b, mem.moving.x, mem.moving.z); if (!m) mem.moving = null; return m || {}; }

/* A CAREFUL FIRST-TIMER IS A PERSON, NOT A CLOCK: each campaign draws its own (how quick, how long a pause to think,
   how soon the pulsing button is read without a word, how often a thumb lands wrong), so 10,000 careful fights are
   10,000 people and not one person's fight 10,000 times (with one set of numbers, every careful fight reached the
   fight's first second at the same instant and met the same moment: a win rate that jumped from 94% to 30% when the
   gold's wait moved three seconds measured that one person, not the fight) */
function person(base, r) {
  const k = 0.75 + 0.6 * r();                                   // 0.75 to 1.35 times the base's pace
  const sc = (a) => [a[0] * k, a[1] * k];
  return { ...base, fresh: sc(base.fresh), known: sc(base.known), again: base.again * k, gap: base.gap * (0.85 + 0.3 * r()),
           think: base.think * (0.5 + r()), read: base.read * (0.8 + 0.4 * r()), wrong: base.wrong * (0.5 + r()) };
}
const PROF = {
  fast:    { brief: 3, card: 1, lead: true, listen: false, read: 0, fresh: [0.15, 0.15], known: [0.15, 0.15], again: 0.15, gap: 0.15, wrong: 0 },
  careful: { brief: 9, card: 3, lead: true, listen: true, read: 4.5, think: 0.5, fresh: [0.9, 1.7], known: [0.7, 1.3], again: 0.5, gap: 0.45, wrong: 0.04 },
  slow:    { brief: 6, card: 2, lead: true, listen: false, read: 0, fresh: [0.4, 0.4], known: [0.4, 0.4], again: 0.4, gap: 0.4, wrong: 0.15 },
  late:    { brief: 6, card: 2, lead: true, listen: false, read: 0, fresh: [1.5, 1.5], known: [1.5, 1.5], again: 1.5, gap: 1.5, wrong: 0 }
};

/* THE OPTIMAL PLAYER: what the rules allow, played at once and never wrong. Its own reading of the court, not the
   need's: it binds several before the golden shockwave and keeps Grandmaster Pho where he can reach the court */
function optimalAct(st, F, onlyWho) {
  const n = st.n, ph = st.pho, z = st.zav, P = st.who === 'pho';
  const live = (a) => !F.why(st, a);
  let bound = 0, untiredBound = null, tired = null, hidden = 0, bindable = 0, seenFree = 0, atHimCome = null;
  for (const p of st.prai) {
    if (p.st === 'bound' || p.st === 'held') bound++;
    if (p.st === 'bound') { const d = Math.hypot(p.x - ph.x, p.z - ph.z); if (!untiredBound || d < untiredBound.d) untiredBound = { p, d }; }
    if (p.st === 'tired' || p.st === 'held') { const d = Math.hypot(p.x - ph.x, p.z - ph.z); if (!tired || d < tired.d) tired = { p, d }; }
    if (p.st === 'hidden' || p.st === 'beneath') hidden++;
    if (p.st === 'coming' || p.st === 'pressing' || p.st === 'through' || p.st === 'shown') { seenFree++; bindable++; }
    if ((p.st === 'through' || (p.st === 'shown' && p.at === 2)) && p.kind !== 'slip') atHimCome = p;
  }
  const lent = st.cage.lent > 0, waveReady = st.seen.shock && ph.waveWait <= 0 && ph.wind <= 0 && !ph.ring;
  const flying = (id) => st.flights.some(f => f.id === id && !f.ai);
  if (P) {
    if (ph.wind > 0 || ph.draw > 0) return {};
    if (lent && live('SHOCKWAVE')) return { act: 'SHOCKWAVE' };
    if (untiredBound && !flying(untiredBound.p.id) && !(st.hold > 0)) {
      if (untiredBound.d <= n.fireReach) { if (live('FIRE')) return { act: 'FIRE', pick: untiredBound.p.id }; }
      else return towards(ph, untiredBound.p.x, untiredBound.p.z) || {};
    }
    if (atHimCome && live('FIRE') && !flying(atHimCome.id)) return { act: 'FIRE', pick: atHimCome.id };
    if (tired && !(st.hold > 0)) { if (live('BAG')) return { act: 'BAG', pick: tired.p.id }; if (F.why(st, 'BAG') === 'none' || tired.d > n.bagReach) { const m = towards(ph, tired.p.x, tired.p.z); if (m) return m; } }
    if (waveReady && bound >= 1 && live('SHOCKWAVE')) {
      const near = st.prai.some(p => (p.st === 'coming' || p.st === 'pressing' || p.st === 'through' || p.st === 'shown') && Math.hypot(p.x - ph.x, p.z - ph.z) - n.breakDist <= n.rush * n.windSecs);
      if (!near) return { act: 'SHOCKWAVE' };
    }
    if (onlyWho !== 'pho') {
      const zWork = (hidden && z.smellWait <= 0.2) || (bindable && z.bindWait <= 0.3 && bound < n.bubbleMax) || (waveReady && bound >= 1 && !lent);
      if (zWork && live('SWITCH') && ((st.hold > 0) || (!untiredBound && !(tired && !F.why(st, 'BAG'))))) return { act: 'SWITCH' };
    }
    if (onlyWho === 'pho' && live('FIRE')) {
      // alone, the best he can do is chase off whatever nears his student's cage
      let best = null, bd = 1e9;
      for (const p of st.prai) if ((p.st === 'coming' || p.st === 'pressing' || p.st === 'through' || p.st === 'shown') && p.kind !== 'slip' && !flying(p.id)) {
        const d = Math.hypot(p.x - z.x, p.z - z.z); if (d < 2.6 && d < bd && Math.hypot(p.x - ph.x, p.z - ph.z) <= n.fireReach) { bd = d; best = p; } }
      if (best) return { act: 'FIRE', pick: best.id };
    }
    // stand where the court can be reached: beside his student, toward the far end
    return towards(ph, z.x + 1.0, z.z - 1.2) || {};
  }
  if (lent && waveReady && onlyWho !== 'zav') return live('SWITCH') ? { act: 'SWITCH' } : {};
  if (hidden && live('SMELL')) return { act: 'SMELL' };
  if (live('BIND')) return { act: 'BIND' };
  if (waveReady && bound >= Math.min(2, Math.max(1, st.left - 3)) && !lent && live('LEND') && onlyWho !== 'zav') return { act: 'LEND' };
  if (onlyWho === 'zav') { if (waveReady && !lent && live('LEND')) return {}; return {}; }
  const pWork = (!(st.hold > 0) && (untiredBound || tired)) || (waveReady && lent) || atHimCome;
  const zSoon = (hidden && z.smellWait <= 0.6) || (bindable && z.bindWait <= 0.6 && bound < n.bubbleMax);
  if (pWork && !zSoon && live('SWITCH')) return { act: 'SWITCH' };
  return {};
}
function optimal(onlyWho) {
  const prof = PROF.fast, lesson = follower(PROF.fast);
  return (st, mem, r, heard) => {
    const c = common(st, mem, r, prof); if (c) return c;
    if (st.stage === 'surge') return st.cur && st.cur.act === 'TOGETHER' ? { act: 'TOGETHER' } : {};
    if (st.stage !== 'fight') return lesson(st, mem, r, heard);
    if (onlyWho === 'zav' && st.who === 'pho') return !mem.F.why(st, 'SWITCH') ? { act: 'SWITCH' } : {};
    if (mem.wait > 0) { mem.wait -= 0.1; return {}; }
    const a = optimalAct(st, mem.F, onlyWho);
    if (a.act) mem.wait = 0.15;
    return a;
  };
}
function masher(prof) {
  return (st, mem, r) => {
    const c = common(st, mem, r, prof); if (c) return c;
    if (!(mem.stickT > 0)) { mem.stickT = 0.4 + r() * 0.8; const a = r() * Math.PI * 2; mem.stick = [Math.cos(a), Math.sin(a)]; }
    mem.stickT -= 0.1;
    const out = { mx: mem.stick[0], mz: mem.stick[1] };
    mem.pressT = (mem.pressT || 0) - 0.1;
    if (mem.pressT <= 0) {
      mem.pressT = 0.12 + r() * 0.18;
      if (st.stage === 'surge') out.slot = 'together';
      else out.slot = SLOTS[Math.floor(r() * SLOTS.length)];
      if (r() < 0.2) out.pick = 1 + Math.floor(r() * 9);
      if (r() < 0.05 && st.clouds.length) out.pickCloud = st.clouds[0].id;
    }
    return out;
  };
}
/* those who learn the lesson as the careful player would, then play their own way from stage 3 */
function afterLesson(own) {
  const lesson = follower(PROF.careful);
  return (st, mem, r, heard) => {
    if (st.stage === 'brief' || st.stage === 'learn' || st.stage === 'naga' || st.stage === 'last' || st.stage === 'surge') return lesson(st, mem, r, heard);
    if (st.stage === 'lost') { const c = common(st, mem, r, PROF.careful); return c || {}; }
    return own(st, mem, r, heard);
  };
}
const PLAYERS = {
  careful: (r) => follower(person(PROF.careful, r)),
  slow: () => follower(PROF.slow),
  late: () => follower(PROF.late),
  optimal: () => optimal(''),
  masher: () => masher({ brief: 2, card: 1, lead: false }),
  never: () => afterLesson((st, mem, r) => {
    const nd = st.cur; if (!nd) return {};
    if (nd.move) { const p = praiOf(st, nd.target); return p ? towards(st.pho, p.x, p.z) || {} : {}; }
    if ((mem.gapT = (mem.gapT || 0) - 0.1) > 0) return {};
    mem.gapT = 0.6;
    if (nd.act === 'SWITCH') return { slot: 'main' };          // he presses what the one he is on can press
    return { slot: slotOf(st, nd.act) };
  }),
  onlyPho: () => afterLesson(optimal('pho')),
  onlyZav: () => afterLesson(optimal('zav')),
  nothing: () => afterLesson(() => ({})),
  fuzz: () => masher({ brief: 0.5, card: 0.3, lead: true })
};
const ORDER = ['careful', 'slow', 'late', 'optimal', 'masher', 'never', 'onlyPho', 'onlyZav', 'nothing', 'fuzz'];

/* ------------------------------------------------------------------ one campaign: a fight, begun again after each loss */
const MAX_TRIES = 6, MAX_CLOCK = 1800;
const STAGE_MOVES = new Set(['brief>learn', 'learn>fight', 'fight>surge', 'fight>lost', 'lost>fight', 'surge>naga', 'naga>last', 'last>won']);
const ACTED = new Set(['switch', 'bag', 'windup', 'bind', 'smell', 'lend', 'together']);
function campaign(F, L, who, seed, opts) {
  const r = stream(seed * 2 + 1), rf = stream(seed * 2 + 2);
  const io = { rand: rf, secs: (k) => L.secs[k] || 2.5 };
  const st = F.create({ sanity: opts.sanity, guard: 0, num: opts.num });
  const play = PLAYERS[who](r);
  const mem = { known: {}, key: '', since: 0, react: 0, lastPress: -9, moving: null, F, wait: 0 };
  mem.lesson = follower(PROF.careful);
  const res = { who, seed, won: false, firstWin: false, tries: 1, length: 0, firstLength: 0, losses: 0, sanity: 0, stalled: '',
                bad: [], illegal: {}, stats: null, lead: false, said: {}, sayN: 0, where: [], dropped: 0 };
  let heard = null, prevLeft = st.left, prevLock = 0, guard = 0, lostAt = [], lastSwitch = -99, lastLock = 0;
  const fuzz = who === 'fuzz';
  const bad = (what) => { if (res.bad.length < 8) res.bad.push(what + ' @' + st.t.toFixed(1) + ' ' + st.stage); };
  while (st.stage !== 'won') {
    if (++guard > 400000) { res.stalled = 'steps'; break; }
    if (st.t > MAX_CLOCK) { res.stalled = st.stage + (st.stage === 'learn' ? ':' + st.prai[0].st : ''); break; }
    const inp = livePress(F, st, play(st, mem, r, heard) || {});
    if (inp.dropped) res.dropped++;
    const dt = fuzz ? 0.004 + r() * 0.246 : 0.1;
    const stageBefore = st.stage, lockBefore = st.lock;
    const ev = F.step(st, inp, dt, io);
    heard = null;
    let acts = 0;
    for (const e of ev) {
      if (e.e === 'say') { if (e.need) heard = { need: e.need, end: st.t + (L.secs[e.key] || 2.5) }; res.said[e.key] = (res.said[e.key] || 0) + 1; res.sayN++; }
      else if (e.e === 'state') { const ok = F.STATES[e.from] && F.STATES[e.from].exits.includes(e.to); if (!ok) res.illegal[e.from + '>' + e.to] = (res.illegal[e.from + '>' + e.to] || 0) + 1; }
      else if (e.e === 'stage') { const k = stageBefore + '>' + e.to; if (!STAGE_MOVES.has(k)) bad('stage move ' + k); }
      else if (e.e === 'lost') { res.losses++; lostAt.push(st.t); res.where.push((st.hold ? 'in hold ' + st.hold : st.left + ' left') + (res.losses === 1 ? ' (1st)' : ' (2nd+)')); }
      if (ACTED.has(e.e) || (e.e === 'fireball' && !e.ai)) acts++;
      if (e.e === 'switch') { if (st.t - lastSwitch < lastLock - 1e-6) bad('a switch inside the lock'); lastSwitch = st.t; lastLock = e.lock || st.n.switchLock; }
    }
    if (acts > 1) bad('two acts in one step');
    // THE INVARIANTS (the plan's 14.1)
    if (st.stage === 'fight' && stageBefore === 'lost') { prevLeft = st.left; lastSwitch = -99; }
    if (st.left > prevLeft) bad('the count rose');
    if (st.left < prevLeft - 1) bad('the count fell by more than one in a step');
    prevLeft = st.left;
    if (st.stage === 'fight' && st.left < 4) bad('the count under four in the fight');
    if (!Number.isFinite(st.sanity) || !Number.isFinite(st.cage.str) || !Number.isFinite(st.pho.x) || !Number.isFinite(st.zav.z)) bad('not a number');
    if (st.stage === 'fight' && st.sanity > st.open + 1e-6) bad('sanity above the opening');
    if (st.stage === 'fight' && st.sanity <= st.n.lostAt) bad('sanity at the loss and no loss');
    if (st.stage === 'surge' && st.sanity < Math.min(st.preSurge, st.n.surgeTo) - 1e-6) bad('the surge under its floor');
    const n = st.n;
    let pressing = 0, bub = 0;
    for (const p of st.prai) {
      if (p.st === 'pressing') pressing++;
      if (p.st === 'bound' || p.st === 'held') bub++;
      if (!Number.isFinite(p.x) || !Number.isFinite(p.z)) bad('a Prai not a number');
      if (p.st !== 'waiting' && p.st !== 'gathered') {
        if (Math.abs(p.x) > n.courtX - n.praiIn + 1e-6 || p.z < n.threadZ - 1e-6 || p.z > n.courtZ1 - n.praiIn + 1e-6) bad('a Prai outside the court ' + p.st);
      }
    }
    if (pressing > n.pressMax) bad('more than three at the bars');
    if (bub > n.bubbleMax) bad('more bubbles than ' + n.bubbleMax);
    if (Math.hypot(st.pho.x - st.zav.x, st.pho.z - st.zav.z) < n.apart - 1e-3) bad('Grandmaster Pho inside the cage');
    if (Math.abs(st.pho.x) > n.bodyX + 1e-6 || Math.abs(st.zav.x) > n.bodyX + 1e-6) bad('a body outside the court');
    for (const [w, max] of [[st.pho.fireWait, Math.max(n.fireWait, n.fireSpent || 0)], [st.zav.bindWait, n.bindWait], [st.zav.smellWait, n.smellWait], [st.pho.waveWait, n.waveWait], [st.lock, Math.max(n.switchLock, n.idleLock || 0)]])
      if (!(w >= 0 && w <= max + 1e-9)) bad('a wait out of its range');
    prevLock = st.lock;
    if (st.stage === 'lost' && stageBefore !== 'lost') {
      if (res.tries >= MAX_TRIES) { res.stalled = 'lost ' + MAX_TRIES + ' times'; break; }
      res.tries++;
    }
  }
  res.won = st.stage === 'won';
  res.length = st.t;
  res.firstWin = res.won && res.losses === 0;
  res.firstLength = res.firstWin ? st.t : 0;
  res.sanity = res.won ? st.sanity : 0;
  res.lead = st.lead;
  res.lostAt = lostAt;
  // the stands still open at the end count too
  for (const p of st.prai) { const k = p.st + (p.hold ? '*' : ''); if (!(p.t <= (st.log.dwell[k] || 0))) st.log.dwell[k] = p.t; }
  if (!(st.stageT <= (st.log.stage[st.stage] || 0))) st.log.stage[st.stage] = st.stageT;
  res.log = st.log; res.stats = st.stats;
  res.hash = opts.hash ? JSON.stringify([st.t, st.stage, st.left, st.sanity, st.prai.map(p => [p.st, p.x, p.z]), st.stats]) : '';
  return res;
}

/* ------------------------------------------------------------------ the tally of one player's campaigns */
function tally(F, L, who, seeds, opts) {
  const T = { who, n: 0, firstWins: 0, twoWins: 0, wins: 0, lens: [], allLens: [], losses: [], sanity: [], stalls: {}, bad: {}, illegal: {},
              dwell: {}, stage: {}, timed: {}, trans: {}, said: {}, sayN: 0, statsSum: {}, lead: 0, lostAt: [], firstLossAt: [], where: {} };
  for (const seed of seeds) {
    const r = campaign(F, L, who, seed, opts);
    T.n++;
    if (r.firstWin) { T.firstWins++; T.lens.push(r.firstLength); T.sanity.push(r.sanity); }
    if (r.won && r.losses <= 1) T.twoWins++;
    if (r.won) { T.wins++; T.allLens.push(r.length); }
    T.losses.push(r.losses);
    if (r.lead) T.lead++;
    if (r.lostAt.length) T.firstLossAt.push(r.lostAt[0]);
    for (const w of r.where) T.where[w] = (T.where[w] || 0) + 1;
    if (r.stalled) T.stalls[r.stalled] = (T.stalls[r.stalled] || 0) + 1;
    for (const b of r.bad) { const k = b.replace(/ @.*$/, ''); if (!T.bad[k]) T.bad[k] = { n: 0, eg: b + ' seed ' + seed }; T.bad[k].n++; }
    for (const k in r.illegal) T.illegal[k] = (T.illegal[k] || 0) + r.illegal[k];
    for (const k in r.log.dwell) T.dwell[k] = Math.max(T.dwell[k] || 0, r.log.dwell[k]);
    for (const k in r.log.stage) T.stage[k] = Math.max(T.stage[k] || 0, r.log.stage[k]);
    for (const k in r.log.timed) T.timed[k] = Math.max(T.timed[k] || 0, r.log.timed[k]);
    for (const k in r.log.trans) T.trans[k] = (T.trans[k] || 0) + r.log.trans[k];
    for (const k in r.said) T.said[k] = (T.said[k] || 0) + r.said[k];
    T.sayN += r.sayN;
    for (const k in r.stats) T.statsSum[k] = (T.statsSum[k] || 0) + r.stats[k];
  }
  return T;
}
function merge(a, b) {
  if (!a) return b;
  for (const k of ['n', 'firstWins', 'twoWins', 'wins', 'lead', 'sayN']) a[k] += b[k];
  for (const k of ['lens', 'allLens', 'losses', 'sanity', 'firstLossAt']) a[k] = a[k].concat(b[k]);
  for (const k of ['stalls', 'illegal', 'trans', 'said', 'statsSum', 'where']) for (const q in b[k]) a[k][q] = (a[k][q] || 0) + b[k][q];
  for (const k of ['dwell', 'stage', 'timed']) for (const q in b[k]) a[k][q] = Math.max(a[k][q] || 0, b[k][q]);
  for (const q in b.bad) { if (!a.bad[q]) a.bad[q] = b.bad[q]; else a.bad[q].n += b.bad[q].n; }
  return a;
}

/* ------------------------------------------------------------------ the worker */
if (!isMainThread) {
  const F = loadRules(), L = loadLines();
  const { players, seeds, opts } = workerData;
  const out = {};
  for (const who of players) out[who] = tally(F, L, who, seeds, opts);
  parentPort.postMessage(out);
} else {
  await main();
}

/* ------------------------------------------------------------------ the report */
function median(a) { if (!a.length) return NaN; const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; }
function pct(a, b) { return b ? (100 * a / b) : 0; }
function mmss(s) { if (!Number.isFinite(s)) return '-'; const m = Math.floor(s / 60), r = Math.round(s - m * 60); return r === 60 ? (m + 1) + ':00' : m + ':' + String(r).padStart(2, '0'); }
async function main() {
  const args = process.argv.slice(2), arg = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
  const N = +arg('--n', 10000), W = Math.max(1, +arg('--workers', 4)), SAN = +arg('--sanity', 40);
  const players = arg('--players', ORDER.join(',')).split(',').filter(p => PLAYERS[p]);
  const F = loadRules(), L = loadLines();
  const num = {};
  for (const kv of (arg('--set', '') || '').split(';').filter(Boolean)) { const i = kv.indexOf('='); num[kv.slice(0, i).trim()] = JSON.parse(kv.slice(i + 1)); }
  const opts = { sanity: SAN, hash: false, num };
  if (Object.keys(num).length) console.log('NUMBERS SET FOR THIS RUN (not the table): ' + JSON.stringify(num));

  if (arg('--trace', '')) { trace(F, L, arg('--trace', ''), +arg('--seed', 1), { ...opts, verbose: args.includes('--verbose') }); return; }

  // THE LINES: every key the rules can say is in the script, or added by the specification, and none is a dropped one
  const missing = F.LINES.filter(k => !L.words[k]), dropped = F.LINES.filter(k => L.drop.has(k)), fromSpec = F.LINES.filter(k => L.from[k] === 'spec');
  console.log(`THE LINES: the rules can say ${F.LINES.length} lines; ${F.LINES.length - fromSpec.length - missing.length} are in lines.json, ${fromSpec.length} are the specification's own (added or changed), ${missing.length} have no words${missing.length ? ': ' + missing.join(' ') : ''}${dropped.length ? '; DROPPED but said: ' + dropped.join(' ') : ''}`);

  // DETERMINISM: the same seed and the same inputs give the same end, bit for bit (v6.15)
  let det = true;
  for (const who of ['careful', 'masher', 'fuzz']) for (const seed of [3, 17, 91]) {
    const a = campaign(F, L, who, seed, { ...opts, hash: true }), b = campaign(F, L, who, seed, { ...opts, hash: true });
    if (a.hash !== b.hash) { det = false; console.log('NOT DETERMINISTIC: ' + who + ' seed ' + seed); }
  }
  console.log('DETERMINISM: ' + (det ? 'the same seed gives the same end, bit for bit (9 pairs)' : 'FAILED'));

  // THE FIGHTS, shared out among the workers
  const t0 = Date.now();
  const seedsOf = (w) => { const s = []; for (let i = w; i < N; i += W) s.push(1000 + i); return s; };
  const parts = await Promise.all(Array.from({ length: W }, (_, w) => new Promise((res, rej) => {
    const wk = new Worker(fileURLToPath(import.meta.url), { workerData: { players, seeds: seedsOf(w), opts } });
    wk.on('message', res); wk.on('error', rej);
  })));
  const T = {};
  for (const p of parts) for (const who in p) T[who] = merge(T[who], p[who]);
  console.log(`\n${N} fights a player, opening sanity ${SAN}, ${((Date.now() - t0) / 1000).toFixed(0)} s on ${W} workers\n`);

  const rows = [['player', 'first try', 'within two', 'median (won first try)', 'median (won at all)', 'mean losses', 'sanity left', 'led', 'stalled']];
  for (const who of players) {
    const t = T[who];
    const ml = t.losses.reduce((a, b) => a + b, 0) / t.n;
    rows.push([who, pct(t.firstWins, t.n).toFixed(1) + '%', pct(t.twoWins, t.n).toFixed(1) + '%', mmss(median(t.lens)), mmss(median(t.allLens)),
               ml.toFixed(2), Number.isFinite(median(t.sanity)) ? median(t.sanity).toFixed(0) : '-', pct(t.lead, t.n).toFixed(1) + '%',
               Object.entries(t.stalls).map(([k, v]) => k + ' ' + v).join(', ') || '0']);
  }
  printTable(rows);

  console.log('\nTHE FIRST LOSS, for those who lose (seconds of fight clock from START): median and the fastest');
  for (const who of players) { const a = T[who].firstLossAt; if (a.length) console.log(`  ${who.padEnd(8)} ${a.length} lost at least once; median ${median(a).toFixed(0)} s, fastest ${Math.min(...a).toFixed(0)} s; where: ` + Object.entries(T[who].where).sort((x, y) => y[1] - x[1]).slice(0, 6).map(([k, v]) => k + ' ' + v).join(', ')); }

  // THE STATES: the longest stand in each, every move the state list does not allow, every state entered and never left
  const all = Object.values(T);
  const dwell = {}, trans = {}, stage = {}, timedMax = {}, illegal = {}, bad = {};
  for (const t of all) {
    for (const k in t.dwell) dwell[k] = Math.max(dwell[k] || 0, t.dwell[k]);
    for (const k in t.trans) trans[k] = (trans[k] || 0) + t.trans[k];
    for (const k in t.stage) stage[k] = Math.max(stage[k] || 0, t.stage[k]);
    for (const k in t.timed) timedMax[k] = Math.max(timedMax[k] || 0, t.timed[k]);
    for (const k in t.illegal) illegal[k] = (illegal[k] || 0) + t.illegal[k];
    for (const k in t.bad) { if (!bad[k]) bad[k] = { ...t.bad[k], by: [] }; else bad[k].n += t.bad[k].n; bad[k].by.push(t.who); }
  }
  console.log('\nTHE PRAI\'S STATES (all players): the longest any one stood in it, and its bound; * = under a lesson\'s hold (waits for his press)');
  const srows = [['state', 'longest', 'its bound', 'moves out seen']];
  const noExit = [], overTime = [];
  for (const s of Object.keys(F.STATES)) {
    for (const star of ['', '*']) {
      const k = s + star; if (!(k in dwell)) continue;
      const bound = F.STATES[s].secs && !star ? F.NUM[F.STATES[s].secs] : null;
      const outs = Object.entries(trans).filter(([m]) => m.split('>')[0] === s).reduce((a, [, v]) => a + v, 0);
      srows.push([k, dwell[k].toFixed(1) + ' s', bound === null ? (star ? 'his press' : 'play') : bound + ' s', String(outs)]);
      if (bound !== null && dwell[k] > bound + F.NUM.dtMax + 1e-6) overTime.push(k + ' ' + dwell[k].toFixed(2) + ' > ' + bound);
    }
    const entered = Object.entries(trans).some(([m]) => m.split('>')[1] === s) || s === 'waiting';
    const left = Object.entries(trans).some(([m]) => m.split('>')[0] === s);
    if (entered && !left && F.STATES[s].exits.length) noExit.push(s);
    if (!F.STATES[s].exits.length && s !== 'gathered') noExit.push(s + ' (no exit listed)');
  }
  printTable(srows);
  const never = Object.keys(F.STATES).filter(s => !Object.keys(trans).some(m => m.split('>')[1] === s) && s !== 'waiting');
  console.log('\nTHE FIGHT\'S STAGES, the longest in each: ' + Object.entries(stage).map(([k, v]) => k + ' ' + v.toFixed(0) + ' s').join(', '));
  console.log('ITS TIMED THINGS, the longest of each against its bound: ' + Object.entries(F.TIMED).map(([k, nk]) => k + ' ' + (timedMax[k] || 0).toFixed(2) + '/' + F.NUM[nk]).join(', '));
  const timedOver = Object.entries(F.TIMED).filter(([k, nk]) => (timedMax[k] || 0) > F.NUM[nk] + F.NUM.dtMax + 1e-6).map(([k]) => k);
  console.log('MOVES THE STATE LIST DOES NOT ALLOW: ' + (Object.keys(illegal).length ? Object.entries(illegal).map(([k, v]) => k + ' x' + v).join(', ') : 'none'));
  console.log('STATES ENTERED AND NEVER LEFT (no exit found): ' + (noExit.length ? noExit.join(', ') : 'none'));
  console.log('STATES NEVER ENTERED BY ANY PLAYER: ' + (never.length ? never.join(', ') : 'none'));
  console.log('TIMED STATES STOOD IN PAST THEIR TIME: ' + (overTime.concat(timedOver).length ? overTime.concat(timedOver).join(', ') : 'none'));
  console.log('INVARIANTS BROKEN: ' + (Object.keys(bad).length ? Object.entries(bad).map(([k, v]) => `${k} x${v.n} (${[...new Set(v.by)].join(',')}; e.g. ${v.eg})`).join('\n  ') : 'none'));

  // WHAT WAS DONE, a fight on average (the careful player's and the optimal one's)
  for (const who of ['careful', 'optimal', 'masher'].filter(w => T[w])) {
    const s = T[who].statsSum, k = T[who].n;
    console.log(`\n${who}, a fight on average: ` + ['switches', 'fires', 'chased', 'slipped', 'binds', 'smells', 'lends', 'waves', 'broken', 'byWave', 'bags', 'rose', 'breaks', 'lines', 'emptySmell', 'spent', 'idle', 'lapses'].map(q => q + ' ' + ((s[q] || 0) / k).toFixed(1)).join(', ') + `, sanity lost ${(s.drained / k).toFixed(1)}`);
  }
  if (T.careful) {
    const heardKeys = Object.keys(T.careful.said).sort((a, b) => T.careful.said[b] - T.careful.said[a]);
    const silent = F.LINES.filter(k => !T.careful.said[k]);
    console.log(`\nthe careful player heard ${heardKeys.length} of the ${F.LINES.length} lines; never heard: ${silent.join(' ') || 'none'}`);
    console.log('the most heard: ' + heardKeys.slice(0, 12).map(k => k + ' ' + (T.careful.said[k] / T.careful.n).toFixed(2)).join(', '));
  }

  // THE REQUIREMENTS (docs/V28.0-FIGHT.md 9): exit 1 if one fails
  const R = [];
  const fw = (w) => T[w] ? pct(T[w].firstWins, T[w].n) : NaN, tw = (w) => T[w] ? pct(T[w].twoWins, T[w].n) : NaN;
  const req = (ok, what) => R.push([ok ? 'ok  ' : 'FAIL', what]);
  if (T.careful) { req(tw('careful') >= 95, `a careful first-timer wins within two tries in 95% or more (${tw('careful').toFixed(1)}%)`);
                   const m = median(T.careful.lens); req(m >= 200 && m <= 290, `the careful first-timer's fight is about four minutes, 3:20 to 4:50 (${mmss(m)})`); }
  if (T.slow) req(tw('slow') >= 90, `a slow human (400 ms, 15% wrong) wins within two tries in 90% or more (${tw('slow').toFixed(1)}%)`);
  if (T.late) req(tw('late') >= 90, `the pair played a second and a half late on every press wins within two tries in 90% or more (${tw('late').toFixed(1)}%)`);
  if (T.optimal) req(fw('optimal') >= 99.5, `the optimal player wins at the first try (${fw('optimal').toFixed(1)}%)`);
  for (const w of ['never', 'onlyPho', 'onlyZav', 'nothing']) if (T[w]) req(fw(w) === 0 && T[w].firstLossAt.length === T[w].n, `${w}: never wins the fight and always loses it, never stalls (${fw(w).toFixed(1)}% won, ${T[w].firstLossAt.length} of ${T[w].n} lost)`);
  if (T.masher && T.careful) req(fw('masher') < fw('careful') - 20, `the button masher wins far less often than the careful player (${fw('masher').toFixed(1)}% against ${fw('careful').toFixed(1)}%)`);
  if (T.masher && T.optimal && T.masher.lens.length) req(median(T.masher.lens) > median(T.optimal.lens), `the button masher never wins faster than the pair played well (${mmss(median(T.masher.lens))} against ${mmss(median(T.optimal.lens))})`);
  req(!Object.keys(illegal).length, 'every move a Prai made is in the state list');
  req(!noExit.length, 'every state entered was also left');
  req(!overTime.length && !timedOver.length, 'no timed state was stood in past its time');
  req(!Object.keys(bad).length, 'no invariant broken in any step');
  req(det, 'the same seed gives the same end');
  req(!missing.length && !dropped.length, 'every line the rules say has its words, and none is a dropped one');
  const stalls = all.filter(t => ['careful', 'slow', 'late', 'optimal'].includes(t.who)).reduce((a, t) => a + Object.entries(t.stalls).filter(([k]) => !/^lost /.test(k)).reduce((x, [, y]) => x + y, 0), 0);
  req(!stalls, `no campaign of a player who follows the screen stalled (${stalls})`);
  console.log('\nTHE REQUIREMENTS');
  for (const [k, w] of R) console.log('  ' + k + ' ' + w);
  process.exitCode = R.some(([k]) => k === 'FAIL') ? 1 : 0;
}
function printTable(rows) {
  const w = rows[0].map((_, i) => Math.max(...rows.map(r => String(r[i]).length)));
  for (const [j, r] of rows.entries()) {
    console.log('  ' + r.map((c, i) => String(c).padEnd(w[i])).join('  '));
    if (!j) console.log('  ' + w.map(x => '-'.repeat(x)).join('  '));
  }
}
function trace(F, L, who, seed, opts) {
  const r = stream(seed * 2 + 1), rf = stream(seed * 2 + 2);
  const io = { rand: rf, secs: (k) => L.secs[k] || 2.5 };
  const st = F.create({ sanity: opts.sanity, num: opts.num });
  const play = PLAYERS[who](r);
  const mem = { known: {}, key: '', since: 0, react: 0, lastPress: -9, moving: null, F, wait: 0 };
  mem.lesson = follower(PROF.careful);
  let heard = null, g = 0;
  while (st.stage !== 'won' && g++ < 40000) {
    const inp = livePress(F, st, play(st, mem, r, heard) || {});
    const ev = F.step(st, inp, 0.1, io);
    heard = null;
    for (const e of ev) {
      if (e.e === 'say') { if (e.need) heard = { need: e.need, end: st.t + (L.secs[e.key] || 2.5) }; console.log(`${st.t.toFixed(1).padStart(6)}  ${st.who === 'pho' ? 'P' : 'Z'}  say ${e.key.padEnd(7)} ${e.need ? '(' + e.need + ')' : '      '} "${L.words[e.key] || '?'}"`); }
      else if (['stage', 'lost', 'wave', 'broken', 'lend', 'cageBreak', 'gathered', 'surge', 'waveReady'].concat(opts.verbose ? ['bind', 'unbind', 'smell', 'refused', 'land', 'windup', 'lendEnd', 'rise', 'reach'] : []).includes(e.e)) console.log(`${st.t.toFixed(1).padStart(6)}  ${st.who === 'pho' ? 'P' : 'Z'}  ${e.e} ${JSON.stringify(e).replace(/"e":"[a-zA-Z]+",?/, '')}  left ${st.left}, sanity ${st.sanity.toFixed(0)}, cage ${st.cage.str.toFixed(0)}`);
    }
    if (opts.verbose && Math.abs(st.t / 2 - Math.round(st.t / 2)) < 0.026 && (st.stage === 'fight' || st.stage === 'learn')) {
      const c = st.cur;
      console.log(`${st.t.toFixed(1).padStart(6)}  ${st.who === 'pho' ? 'P' : 'Z'}  . need ${c ? c.id + ' ' + c.act + (c.ready ? '' : ' (not ready)') : '-'}; gold ${st.pho.waveWait.toFixed(1)}, bind ${st.zav.bindWait.toFixed(1)}, smell ${st.zav.smellWait.toFixed(1)}, fire ${st.pho.fireWait.toFixed(1)}, lock ${st.lock.toFixed(1)}; ` +
        st.prai.filter(p => p.st !== 'gathered' && p.st !== 'waiting').map(p => p.id + p.kind[0] + ':' + p.st + (p.hold ? '/' + p.hold : '')).join(' '));
    }
    if (st.t > MAX_CLOCK) break;
  }
  console.log(`END ${st.stage} at ${mmss(st.t)}, losses ${st.losses}, sanity ${st.sanity.toFixed(0)}; ` + JSON.stringify(st.stats));
}
