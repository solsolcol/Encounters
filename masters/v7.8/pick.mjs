// pick.mjs — choose the take per line by measure (v7.1's rule): reject a take whose
// speech starts with an extra short segment (a spoken tag), then keep the take whose
// pace is nearest 2.4 words a second. Also reports v5.28's spoken-tag measure (an
// internal silence >= 0.15 s at -38 dB before 45 % of the duration). Writes pick.json.
import fs from 'node:fs'; import { spawnSync, execFileSync } from 'node:child_process';
const M = 'masters/v7.8';
const P = JSON.parse(fs.readFileSync(`${M}/prompts.json`, 'utf8')).prompts;
const dur = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString();
const silences = (f, db, min) => {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-i', f, '-af', `silencedetect=n=${db}dB:d=${min}`, '-f', 'null', '-'], { encoding: 'utf8' });
  const out = []; let start = null;
  for (const line of r.stderr.split('\n')) {
    const a = /silence_start: ([\d.]+)/.exec(line), b = /silence_end: ([\d.]+)/.exec(line);
    if (a) start = +a[1]; if (b && start !== null) { out.push([start, +b[1]]); start = null; }
  }
  return out;
};
const segments = (f, total, db = -30, min = 0.22) => {   // speech segments between silences
  const sil = silences(f, db, min); const segs = []; let t = 0;
  for (const [s, e] of sil) { if (s - t > 0.05) segs.push([t, s]); t = e; }
  if (total - t > 0.05) segs.push([t, total]);
  return segs;
};
const pick = {}, rows = [];
for (const [id, prompt] of Object.entries(P)) {
  const words = prompt.replace(/^\[[^\]]*\]\s*/, '');
  const nWords = words.split(/\s+/).filter(Boolean).length;
  const nSent = (words.match(/[.?!](\s|$)/g) || []).length || 1;
  const cands = [];
  for (const take of ['a', 'b']) {
    const f = `${M}/${id}-${take}.mp3`; if (!fs.existsSync(f)) continue;
    const total = dur(f), segs = segments(f, total);
    // an opening segment shorter than a second, over and above the sentence count, is a spoken
    // tag — unless the line's own first sentence is one or two words ("Eighteen.", "Bed one.")
    const firstSentWords = words.split(/[.?!]/)[0].trim().split(/\s+/).filter(Boolean).length;
    const extraOpening = segs.length > nSent && (segs[0][1] - segs[0][0]) < 1.2 && firstSentWords > 2;
    const tagGap = silences(f, -38, 0.15).some(([s]) => s < total * 0.45 && s > 0.1);
    const pace = nWords / total;
    cands.push({ take, total: +total.toFixed(2), segs: segs.length, nSent, extraOpening, tagGap, pace: +pace.toFixed(2) });
  }
  const ok = cands.filter(c => !c.extraOpening);
  const pool = ok.length ? ok : cands;
  pool.sort((x, y) => Math.abs(x.pace - 2.4) - Math.abs(y.pace - 2.4));
  pick[id] = pool[0].take;
  rows.push({ id, pick: pool[0].take, cands });
}
fs.writeFileSync(`${M}/pick.json`, JSON.stringify(pick, null, 1));
fs.writeFileSync(`${M}/pick-report.json`, JSON.stringify(rows, null, 1));
for (const r of rows) console.log(r.id.padEnd(10), '->', r.pick, ' ', r.cands.map(c => `${c.take}:${c.total}s seg${c.segs}/${c.nSent}${c.extraOpening ? ' EXTRA' : ''}${c.tagGap ? ' gap' : ''} pace${c.pace}`).join(' | '));
