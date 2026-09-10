// encode.mjs [--install] [ids...] — v7.9: the three rewritten opening lines (Aaron), from
// masters/v7.9/pick.json. Voice: mono 44.1k/128k mp3 + 48k/64k opus, peak-matched to chapter
// 1's near line (vpile), the v7.1 rule for this speaker (the file replaced was matched to it too).
import fs from 'node:fs'; import { execFileSync, spawnSync } from 'node:child_process';
const M = 'masters/v7.9', OUT = '/tmp/claude-0/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293/scratchpad/enc79';
fs.mkdirSync(OUT, { recursive: true });
const argv = process.argv.slice(2);
const install = argv.includes('--install');
const only = argv.filter(a => !a.startsWith('--'));
const peak = f => { const r = spawnSync('ffmpeg', ['-hide_banner', '-i', f, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
  const m = /max_volume: ([-\d.]+) dB/.exec(r.stderr); if (!m) throw new Error('no peak for ' + f); return +m[1]; };
const dur = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString();
const ff = a => execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...a]);
const VOICE_PEAK = peak('assets/audio/vpile.mp3');
const pick = JSON.parse(fs.readFileSync(`${M}/pick.json`, 'utf8'));
const plan = Object.keys(pick).map(id => ({ id, src: `${M}/${id}-${pick[id]}.mp3` })).filter(p => !only.length || only.includes(p.id));
const report = [];
for (const p of plan) {
  const oldMp3 = `assets/audio/${p.id}.mp3`;   // a NEW line has no file to replace; the level is vpile's either way
  const pk = peak(p.src);
  let gain = VOICE_PEAK - pk; if (pk + gain > -0.5) gain = -0.5 - pk;
  const g = `volume=${gain.toFixed(2)}dB`;
  const mp3 = `${OUT}/${p.id}.mp3`, ogg = `${OUT}/${p.id}.ogg`;
  ff(['-i', p.src, '-map_metadata', '-1', '-ar', '44100', '-ac', '1', '-b:a', '128k', '-af', g, mp3]);
  ff(['-i', p.src, '-map_metadata', '-1', '-ar', '48000', '-ac', '1', '-c:a', 'libopus', '-b:a', '64k', '-af', g, ogg]);
  const row = { id: p.id, src: p.src, srcPeak: pk, gain: +gain.toFixed(2), peak: peak(mp3), oldSecs: fs.existsSync(oldMp3) ? +dur(oldMp3).toFixed(2) : 0, secs: +dur(mp3).toFixed(2), kb: (fs.statSync(mp3).size / 1024 | 0) + '/' + (fs.statSync(ogg).size / 1024 | 0) };
  report.push(row);
  if (install) { fs.copyFileSync(mp3, oldMp3); fs.copyFileSync(ogg, `assets/audio-opus/${p.id}.ogg`); }
  console.log(`${p.id.padEnd(10)} ${p.src.split('/').pop().padEnd(13)} src ${String(pk).padStart(6)}  gain ${String(row.gain).padStart(6)}  peak ${row.peak}  secs ${row.oldSecs} -> ${row.secs}  KB ${row.kb}`);
}
fs.writeFileSync(`${M}/report.json`, JSON.stringify(report, null, 1));
console.log(install ? 'INSTALLED' : 'staged only');
