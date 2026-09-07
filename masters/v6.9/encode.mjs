// encode.mjs [--install] — v6.9: the three pick-up reactions re-voiced as WHISPERS (Aaron, eleven_v3).
// Run from the repo root. Voice contract: mono 44.1k/128k mp3 + 48k/64k opus, peak-matched to vpile
// (-3.4 dBFS) like every take; the LEVEL they play at is main.js's WHISPER_GAIN (they bypass the bus).
// Chosen by measurement, not by ear (no ear here): of 6 / 10 / 2 takes per line the least VOICED
// (normalised autocorrelation over speech frames, dbg voicing.py) with spectrograms read for harmonics:
//   vpick1-f  "[whispers] Ooh! Nice."                 voiced 0.26 / strongly 0.15
//   vpick2-c  "[whispers] Oh! Hello there."           voiced 0.38 / strongly 0.28  (Aaron's whisper keeps some voice on "there")
//   vpick3-b  "[whispers][excited] Wah! Five dollars!" voiced 0.30 / strongly 0.03
import fs from 'node:fs'; import { execFileSync, spawnSync } from 'node:child_process';
const M = 'masters/v6.9', OUT = '/tmp/claude-0/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293/scratchpad/enc69';
fs.mkdirSync(OUT, { recursive: true });
const install = process.argv.includes('--install');
const peak = f => { const r = spawnSync('ffmpeg', ['-hide_banner', '-i', f, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
  const m = /max_volume: ([-\d.]+) dB/.exec(r.stderr); if (!m) throw new Error('no peak for ' + f); return +m[1]; };
const rms = f => { const r = spawnSync('ffmpeg', ['-hide_banner', '-i', f, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
  const m = /mean_volume: ([-\d.]+) dB/.exec(r.stderr); return m ? +m[1] : null; };
const dur = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString();
const ff = a => execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...a]);
const VOICE_PEAK = peak('assets/audio/vpile.mp3');
const plan = [
  { id: 'vpick1', src: `${M}/vpick1-f.mp3` },
  { id: 'vpick2', src: `${M}/vpick2-c.mp3` },
  { id: 'vpick3', src: `${M}/vpick3-b.mp3` },
];
const report = [];
for (const p of plan) {
  const tmp = `${OUT}/${p.id}-pre.wav`;
  ff(['-i', p.src, '-ar', '44100', tmp]);
  const pk = peak(tmp);
  let gain = VOICE_PEAK - pk; if (pk + gain > -0.5) gain = -0.5 - pk;
  const g = `volume=${gain.toFixed(2)}dB`;
  const mp3 = `${OUT}/${p.id}.mp3`, ogg = `${OUT}/${p.id}.ogg`;
  ff(['-i', tmp, '-map_metadata', '-1', '-ar', '44100', '-ac', '1', '-b:a', '128k', '-af', g, mp3]);
  ff(['-i', tmp, '-map_metadata', '-1', '-ar', '48000', '-ac', '1', '-c:a', 'libopus', '-b:a', '64k', '-af', g, ogg]);
  const row = { id: p.id, src: p.src, srcPeak: pk, gain: +gain.toFixed(2), peak: peak(mp3), rms: rms(mp3), secs: +dur(mp3).toFixed(2), kb: (fs.statSync(mp3).size / 1024 | 0) + '/' + (fs.statSync(ogg).size / 1024 | 0) };
  report.push(row);
  if (install) { fs.copyFileSync(mp3, `assets/audio/${p.id}.mp3`); fs.copyFileSync(ogg, `assets/audio-opus/${p.id}.ogg`); }
}
fs.writeFileSync(`${M}/report.json`, JSON.stringify(report, null, 1));
for (const r of report) console.log(`${r.id.padEnd(8)} ${r.src.padEnd(26)} src ${String(r.srcPeak).padStart(6)}  gain ${String(r.gain).padStart(6)}  peak ${r.peak}  rms ${r.rms}  secs ${r.secs}  KB mp3/opus ${r.kb}`);
console.log(install ? 'INSTALLED' : 'staged only');
