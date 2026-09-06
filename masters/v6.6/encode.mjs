// encode.mjs [--install] — v6.6's seven sounds to the contract. Run from the repo root.
// Voice: mono 44.1k/128k mp3 + 48k/64k opus, peak-matched to chapter 1's near line (vpile, -3.4 dBFS).
// SFX/music: stereo 44.1k/128k mp3 + 48k/96k opus, peak-normalised to the level named per sound.
// memtheme is theme-b (eleven_music_v2, verified instrumental) — 40 s, quiet by ~34 s; the film's
// dread bed takes over at 35.6 under "this time was different".
// The three beds are eleven_text_to_sound_v2 with duration_seconds 14 + loop (the model's own
// parameters — v6.6's first attempt without them came out 1-2 s).
import fs from 'node:fs'; import { execFileSync, spawnSync } from 'node:child_process';
const M = 'masters/v6.6', OUT = '/tmp/claude-0/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293/scratchpad/enc66';
fs.mkdirSync(OUT, { recursive: true });
const install = process.argv.includes('--install');
const peak = f => { const r = spawnSync('ffmpeg', ['-hide_banner', '-i', f, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
  const m = /max_volume: ([-\d.]+) dB/.exec(r.stderr); if (!m) throw new Error('no peak for ' + f); return +m[1]; };
const dur = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString();
const ff = a => execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...a]);
const VOICE_PEAK = peak('assets/audio/vpile.mp3');
const plan = [
  { id: 'vpick1', src: `${M}/vpick1-a.mp3`, voice: true },
  { id: 'vpick2', src: `${M}/vpick2-a.mp3`, voice: true },
  { id: 'vpick3', src: `${M}/vpick3-a.mp3`, voice: true },
  { id: 'memtheme', src: `${M}/theme-b.mp3`, target: -3.0, pre: 'afade=t=in:d=0.8' },
  { id: 'ecpamb', src: `${M}/ecpamb-b.mp3`, target: -10.0, pre: 'afade=t=in:d=1.5,afade=t=out:st=11.5:d=2.5' },
  { id: 'stairamb', src: `${M}/stairamb-b.mp3`, target: -12.0, pre: 'afade=t=in:d=1.5,afade=t=out:st=11.5:d=2.5' },
  { id: 'playamb', src: `${M}/playamb-a.mp3`, target: -10.0, pre: 'afade=t=in:d=1.5,afade=t=out:st=11.5:d=2.5' },
];
const report = [];
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
  const row = { id: p.id, srcPeak: pk, gain: +gain.toFixed(2), peak: peak(mp3), secs: +dur(mp3).toFixed(2), kb: (fs.statSync(mp3).size / 1024 | 0) + '/' + (fs.statSync(ogg).size / 1024 | 0) };
  report.push(row);
  if (install) { fs.copyFileSync(mp3, `assets/audio/${p.id}.mp3`); fs.copyFileSync(ogg, `assets/audio-opus/${p.id}.ogg`); }
}
fs.writeFileSync(`${M}/report.json`, JSON.stringify(report, null, 1));
for (const r of report) console.log(`${r.id.padEnd(9)} src ${String(r.srcPeak).padStart(6)}  gain ${String(r.gain).padStart(6)}  peak ${r.peak}  secs ${r.secs}  KB mp3/opus ${r.kb}`);
console.log(install ? 'INSTALLED' : 'staged only');
