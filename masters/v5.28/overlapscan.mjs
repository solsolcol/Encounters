// overlapscan.mjs — static timing scan of every film and scene: voice cue
// start + MEASURED take length vs the next voice cue and the scene's end.
import fs from 'node:fs'; import { execSync } from 'node:child_process';
const secsOf = src => { const m = {}; for (const r of src.matchAll(/\{ id: "(\w+)",[\s\S]*?secs: ([\d.]+)/g)) m[r[1]] = +r[2]; return m; };
const NEW = secsOf(fs.readFileSync('src/voicelines.js', 'utf8'));
const OLD = secsOf(execSync('git show 8ad0d76:src/voicelines.js').toString());   // River's lengths (v5.18-v5.27)
const main = fs.readFileSync('src/main.js', 'utf8');
const KIND = {}; for (const r of main.matchAll(/(\w+): \['(\w+)', [\d.]+\]/g)) KIND[r[1]] = r[2];
const isVoice = s => /^(v\w+|t5\w+)$/.test(s) && (s in NEW);
const GAP = 0.3;
for (const ch of ['ch1', 'ch2', 'ch3', 'ch4', 'ch5']) {
  const lines = fs.readFileSync(`src/chapters/${ch}.js`, 'utf8').split('\n');
  let scene = null, cues = [], ends = 0, out = [];
  const flush = () => {
    if (!scene) return;
    cues.sort((a, b) => a.at - b.at);
    for (let i = 0; i < cues.length; i++) {
      const c = cues[i], n = cues[i + 1];
      const endOld = c.at + OLD[c.smp], endNew = c.at + NEW[c.smp];
      const flags = [];
      if (n && endNew + GAP > n.at) flags.push(`OVERLAPS next ${n.smp}@${n.at} by ${(endNew + GAP - n.at).toFixed(2)}s`);
      if (endNew > ends) flags.push(`RUNS PAST scene end ${ends} by ${(endNew - ends).toFixed(2)}s`);
      const wasOk = !(n && endOld + GAP > n.at) && !(endOld > ends);
      if (flags.length) out.push(`  ${c.smp}@${c.at} (${OLD[c.smp]}->${NEW[c.smp]}s, ends ${endNew.toFixed(2)}) ${flags.join('; ')}${wasOk ? '' : ' [was already so at v5.14]'}`);
    }
    console.log(`${ch} ${scene} dur~${ends} voice cues ${cues.length}${out.length ? '' : ' ok'}`); for (const o of out) console.log(o);
    cues = []; ends = 0; out = [];
  };
  for (const l of lines) {
    const m = /^\s*function (\w+)\(c, s, api\)/.exec(l); if (m) { flush(); scene = m[1]; continue; }
    if (!scene) continue;
    if (/^\s*scenes:/.test(l)) { flush(); scene = null; continue; }
    for (const r of l.matchAll(/\b(sfx|tr|fade|camTo|yawTo|pitchTo|step|bob|ghostGlide)\(\s*([\d.]+)\s*(?:,\s*([\d.]+))?/g)) {
      const a = +r[2], b = r[3] !== undefined ? +r[3] : NaN;
      const t1 = (r[1] === 'sfx' || r[1] === 'step') ? a : (isNaN(b) ? a : b);
      if (t1 > ends) ends = t1;
    }
    const s = /\bsfx\(\s*([\d.]+)\s*,\s*'(\w+)'/.exec(l);
    if (s) { const smp = KIND[s[2]] || s[2]; if (isVoice(smp)) cues.push({ at: +s[1], smp }); }
  }
  flush();
}
