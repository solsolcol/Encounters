// encode.mjs [--install] — the prologue's nine sounds to the contract. Run from the repo root.
// Voice: mono 44.1k/128k mp3 + 48k/64k opus, peak-matched to chapter 1's near line (vpile, -3.4 dBFS).
// SFX: stereo 44.1k/128k mp3 + 48k/96k opus, peak-normalised to the level named per sound.
// vpro1 runs through atempo 0.9 (pitch-preserving) — the v5.30 fallback for a take still fast after the ellipses.
// memday is BUILT: the 16 s cicada drone trimmed to 14 s under a looped 2 s wind rustle, faded in and out.
import fs from 'node:fs'; import { execFileSync, spawnSync } from 'node:child_process';
const M = 'masters/v6.4', OUT = '/tmp/claude-0/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293/scratchpad/enc64';
fs.mkdirSync(OUT, { recursive: true });
const install = process.argv.includes('--install');
const peak = f => { const r = spawnSync('ffmpeg', ['-hide_banner', '-i', f, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
  const m = /max_volume: ([-\d.]+) dB/.exec(r.stderr); if (!m) throw new Error('no peak for ' + f); return +m[1]; };
const dur = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString();
const ff = a => execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...a]);
const VOICE_PEAK = peak('assets/audio/vpile.mp3');
const plan = [
  { id: 'vpro1', src: `${M}/vpro1-c.mp3`, voice: true, pre: 'atempo=0.9' },
  { id: 'vpro2', src: `${M}/vpro2-d.mp3`, voice: true },
  { id: 'vpro3', src: `${M}/vpro3-d.mp3`, voice: true },
  { id: 'vpro4', src: `${M}/vpro4-b.mp3`, voice: true },
  { id: 'vpro5', src: `${M}/vpro5-a.mp3`, voice: true },
  { id: 'noteslow', src: `${M}/noteslow-a.mp3`, target: -3.9 },
  { id: 'leafpick', src: `${M}/leafpick-b.mp3`, target: -8.0 },
  { id: 'toypick', src: `${M}/toypick-a.mp3`, target: -7.0 },
  { id: 'memday', src: `${OUT}/memday-mix.wav`, target: -12.5 },
];
// the bed: cicadas 14 s (fade 1.5 in / 2.5 out) + wind looped seven times, 9 dB under, same fades
ff(['-i', `${M}/cicadas-a.mp3`, '-stream_loop', '7', '-i', `${M}/wind-b.mp3`, '-filter_complex',
  '[0:a]atrim=0:14,asetpts=PTS-STARTPTS,afade=t=in:d=1.5,afade=t=out:st=11.5:d=2.5[c];' +
  '[1:a]atrim=0:14,asetpts=PTS-STARTPTS,volume=-9dB,afade=t=in:d=1.5,afade=t=out:st=11.5:d=2.5[w];' +
  '[c][w]amix=inputs=2:normalize=0[m]', '-map', '[m]', '-ar', '44100', '-ac', '2', `${OUT}/memday-mix.wav`]);
const report = [];
for (const p of plan) {
  const tmp = `${OUT}/${p.id}-pre.wav`;
  ff(['-i', p.src, ...(p.pre ? ['-af', p.pre] : []), '-ar', '44100', tmp]);   // one decode, the tempo change if any
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
