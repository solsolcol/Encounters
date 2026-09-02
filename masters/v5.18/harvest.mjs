// harvest.mjs <status.json> — download every completed take in a poll result
// whose session matches a 'generating' line, via dl.sh; report failures.
import fs from 'node:fs'; import { execFileSync } from 'node:child_process';
const f = 'masters/v5.18/progress.json';
const p = JSON.parse(fs.readFileSync(f, 'utf8'));
const st = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const bySession = Object.fromEntries(p.lines.filter(l => l.session).map(l => [l.session, l]));
const genSession = {};
for (const m of st.media || []) {
  const mm = /content_generation\/([^/]+)\/([^/]+)\/content/.exec(m.url);
  if (mm) genSession[mm[2]] = { session: mm[1], url: m.master_url || m.url, prompt: m.prompt };
}
for (const g of st.generations || []) {
  const gs = genSession[g.id]; if (!gs) { console.log('no media for gen', g.id, g.status); continue; }
  const l = bySession[gs.session]; if (!l) { console.log('unknown session', gs.session); continue; }
  if (g.status !== 'completed') { console.log(l.id, g.status); if (g.status === 'failed') { l.status = 'failed'; } continue; }
  if (l.status === 'done') continue;
  if (gs.prompt !== l.prompt) console.log('PROMPT MISMATCH', l.id, JSON.stringify(gs.prompt));
  execFileSync('bash', ['masters/v5.18/dl.sh', l.id, gs.url], { stdio: 'inherit' });
}
// dl.sh rewrote progress.json; re-read and merge failed marks
const q = JSON.parse(fs.readFileSync(f, 'utf8'));
for (const l of p.lines) if (l.status === 'failed') { const t = q.lines.find(x => x.id === l.id); if (t && t.status !== 'done') t.status = 'failed'; }
fs.writeFileSync(f, JSON.stringify(q, null, 2) + '\n');
const by = {}; for (const l of q.lines) by[l.status] = (by[l.status] || 0) + 1; console.log(by);
