// encode.mjs [--install] [ids...] — v7.1's 58 sounds to the contract. Run from the repo root.
// Voice: mono 44.1k/128k mp3 + 48k/64k opus, peak-matched to chapter 1's near line (vpile).
// SFX/music: stereo 44.1k/128k mp3 + 48k/96k opus, peak-normalised to the level named per sound
// (docs/V7.1-E2C1-PLAN.md §5). The take per voice line is masters/v7.1/pick.json (chosen by
// the segment/pace measure — see the plan's §15); every SFX is take `a` unless named here.
import fs from 'node:fs'; import { execFileSync, spawnSync } from 'node:child_process';
const M = 'masters/v7.1', OUT = '/tmp/claude-0/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293/scratchpad/enc71';
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
const voice = Object.keys(pick).map(id => ({ id, src: `${M}/${id}-${pick[id]}.mp3`, voice: true }));
const loopFade = (secs) => `afade=t=in:d=0.6,afade=t=out:st=${(secs - 0.8).toFixed(2)}:d=0.8`;
const sfx = [
  { id: 'e2film', target: -4, pre: 'afade=t=in:d=1.0' },
  { id: 'e2bed', target: -10, take: 'b', pre: 'afade=t=in:d=1.5,afade=t=out:st=47.5:d=2.5' },
  { id: 'bunkday', target: -12 }, { id: 'bunknight', target: -14, take: 'b' },
  { id: 'fanloop', target: -16 }, { id: 'clocktick', target: -20 }, { id: 'showerrun', target: -9 },
  { id: 'whistle', target: -4 }, { id: 'bootsrun', target: -8 }, { id: 'bootsmarch', target: -9 },
  { id: 'lockerdoor', target: -8 }, { id: 'bunkcreak', src0: 'bedcreak', target: -11 }, { id: 'blanket', target: -12 },
  { id: 'switchoff', target: -7 }, { id: 'showeroff', target: -9 }, { id: 'drip', target: -14 },
  { id: 'ferryhorn', target: -8 }, { id: 'seawash', target: -13, pre: 'afade=t=in:d=1.0,afade=t=out:st=6.5:d=1.5' },
  { id: 'gates', target: -8 }, { id: 'dooropen2', target: -9 }, { id: 'pushups', target: -12, take: 'b' },
].map(p => ({ ...p, src: `${M}/${p.src0 || p.id}-${p.take || 'a'}.mp3` }));
const plan = [...voice, ...sfx].filter(p => !only.length || only.includes(p.id));
const report = fs.existsSync(`${M}/report.json`) ? JSON.parse(fs.readFileSync(`${M}/report.json`, 'utf8')) : [];
for (const p of plan) {
  const tmp = `${OUT}/${p.id}-pre.wav`;
  ff(['-i', p.src, ...(p.pre ? ['-af', p.pre] : []), '-ar', '44100', tmp]);
  const pk = peak(tmp);
  const want = p.voice ? VOICE_PEAK : p.target;
  let gain = want - pk; if (pk + gain > -0.5) gain = -0.5 - pk;
  const g = `volume=${gain.toFixed(2)}dB`;
  const ch = p.voice ? '1' : '2', obr = p.voice ? '64k' : '96k';
  const mp3 = `${OUT}/${p.id}.mp3`, ogg = `${OUT}/${p.id}.ogg`;
  ff(['-i', tmp, '-map_metadata', '-1', '-ar', '44100', '-ac', ch, '-b:a', '128k', '-af', g, mp3]);
  ff(['-i', tmp, '-map_metadata', '-1', '-ar', '48000', '-ac', ch, '-c:a', 'libopus', '-b:a', obr, '-af', g, ogg]);
  const row = { id: p.id, src: p.src, srcPeak: pk, gain: +gain.toFixed(2), peak: peak(mp3), secs: +dur(mp3).toFixed(2), kb: (fs.statSync(mp3).size / 1024 | 0) + '/' + (fs.statSync(ogg).size / 1024 | 0) };
  const i = report.findIndex(r => r.id === p.id); if (i >= 0) report[i] = row; else report.push(row);
  if (install) { fs.copyFileSync(mp3, `assets/audio/${p.id}.mp3`); fs.copyFileSync(ogg, `assets/audio-opus/${p.id}.ogg`); }
  console.log(`${p.id.padEnd(11)} ${p.src.split('/').pop().padEnd(14)} src ${String(pk).padStart(6)}  gain ${String(row.gain).padStart(6)}  peak ${row.peak}  secs ${row.secs}  KB ${row.kb}`);
}
fs.writeFileSync(`${M}/report.json`, JSON.stringify(report, null, 1));
console.log(install ? 'INSTALLED' : 'staged only');
