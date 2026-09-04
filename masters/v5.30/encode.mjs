// encode.mjs [--install] — encode every master to the contract, peak-matched
// to the file it replaces. Without --install writes to the scratchpad only.
import fs from 'node:fs'; import { execFileSync, spawnSync } from 'node:child_process';
const OUT = '/tmp/claude-0/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293/scratchpad/enc30';
const install = process.argv.includes('--install');
const p = JSON.parse(fs.readFileSync('masters/v5.30/lines.json', 'utf8'));
const peak = f => { const r = spawnSync('ffmpeg', ['-hide_banner', '-i', f, '-af', 'volumedetect', '-f', 'null', '-'], { encoding: 'utf8' });
  const m = /max_volume: ([-\d.]+) dB/.exec(r.stderr); if (!m) throw new Error('no peak for ' + f); return +m[1]; };
const dur = f => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString();
const report = [];
for (const l of p) {
  const master = `masters/v5.30/${l.id}.mp3`;
  const oldMp3 = l.id === 'voice' ? 'assets/voice.mp3' : `assets/audio/${l.id}.mp3`;
  const oldOgg = l.id === 'voice' ? null : `assets/audio-opus/${l.id}.ogg`;
  let gain = peak(oldMp3) - peak(master);
  if (peak(master) + gain > -0.5) gain = -0.5 - peak(master); // never clip
  const g = `volume=${gain.toFixed(2)}dB`;
  const mp3 = `${OUT}/${l.id}.mp3`, ogg = `${OUT}/${l.id}.ogg`;
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', master, '-map_metadata', '-1', '-ar', '44100', '-ac', '1', '-b:a', '128k', '-af', g, mp3]);
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-i', master, '-map_metadata', '-1', '-ar', '48000', '-ac', '1', '-c:a', 'libopus', '-b:a', '64k', '-af', g, ogg]);
  const row = { id: l.id, gain: +gain.toFixed(2), oldPeak: peak(oldMp3), newPeak: peak(mp3), oldSecs: dur(oldMp3), newSecs: +dur(mp3).toFixed(2) };
  report.push(row);
  if (install) { fs.copyFileSync(mp3, oldMp3); if (oldOgg) fs.copyFileSync(ogg, oldOgg); }
}
fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 1));
for (const r of report) console.log(`${r.id.padEnd(10)} gain ${String(r.gain).padStart(6)}  peak ${r.oldPeak} -> ${r.newPeak}  secs ${r.oldSecs.toFixed(2)} -> ${r.newSecs}`);
console.log(install ? 'INSTALLED' : 'staged only');
