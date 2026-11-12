# v26.0 · THE VOICE CHAIN: each line's picked take (voices/picks.json) made into the game's two files.
#   python3 -I masters/v26.0/voices/chain.py [key ...]      (run from the repo root; no key = every line)
# The chain is the house's (masters/v25.0/make.sh, v16.0, v11.1), unchanged:
#   HIM (Brian)          mono, high-passed at 70 Hz, PEAK-matched to -6.85 dBFS (mp3) and -6.6 (Opus) for his own bus,
#                        which has a compressor and make-up gain; two passes, because each encoder moves the peak (v9.6)
#   THE CAST (Grandmaster Pho, Ton, the woman)   levelled by RMS to -16 dBFS under a -1.5 dBFS limiter for the flat cast
#                        bus (masters/v11.1/level.py)
#   every take           its last 0.12 s faded (eleven_v3 ends a take on its last sample, v5.30); a silent tail longer
#                        than 0.45 s cut at the voice's end + 0.3 s; a lead longer than 0.3 s cut 0.15 s before the voice
#   files                assets/audio/<key>.mp3 (128 kbps, 44.1 kHz) and assets/audio-opus/<key>.ogg (64 kbps mono, 48 kHz),
#                        metadata stripped
# Writes voices/CHAIN.txt: one row a line (the take, why it was picked, what was cut, the file's length): the record.
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
P = json.load(open(os.path.join(HERE, 'picks.json'), encoding='utf-8'))
only = sys.argv[1:]
TMP = os.path.join(HERE, '_tmp'); os.makedirs(TMP, exist_ok=True)
PREP, LEVEL, PEAK = (os.path.join(ROOT, 'masters', a, b) for a, b in (('v21.0', 'prep.py'), ('v11.1', 'level.py'), ('v9.7', 'peak.py')))
def run(*a, **k): return subprocess.run(list(a), check=True, capture_output=True, text=True, **k)
def peak(f): return float(run('python3', PEAK, f).stdout.split('peak ')[1].split(' dBFS')[0])
def dur(f): return float(run('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f).stdout.strip())
def enc_peak(n, wav, tm, to):
    mp3, ogg = os.path.join(ROOT, 'assets/audio/%s.mp3' % n), os.path.join(ROOT, 'assets/audio-opus/%s.ogg' % n)
    gm = go = tm - peak(wav)
    for _ in (1, 2):
        run('ffmpeg', '-v', 'error', '-y', '-i', wav, '-af', 'volume=%.2fdB' % gm, '-map_metadata', '-1', '-c:a', 'libmp3lame', '-b:a', '128k', '-ar', '44100', mp3)
        run('ffmpeg', '-v', 'error', '-y', '-i', wav, '-af', 'volume=%.2fdB' % go, '-map_metadata', '-1', '-c:a', 'libopus', '-b:a', '64k', '-ar', '48000', ogg)
        gm += tm - peak(mp3); go += to - peak(ogg)
    return dur(ogg)
def enc_flat(n, wav):
    mp3, ogg = os.path.join(ROOT, 'assets/audio/%s.mp3' % n), os.path.join(ROOT, 'assets/audio-opus/%s.ogg' % n)
    run('ffmpeg', '-v', 'error', '-y', '-i', wav, '-map_metadata', '-1', '-c:a', 'libmp3lame', '-b:a', '128k', '-ar', '44100', mp3)
    run('ffmpeg', '-v', 'error', '-y', '-i', wav, '-map_metadata', '-1', '-c:a', 'libopus', '-b:a', '64k', '-ar', '48000', ogg)
    return dur(ogg)
rows = []
for lid, v in P.items():
    if only and lid not in only: continue
    k = v['pick']; t = v['takes'][k]; src = os.path.join(HERE, 'raw', '%s_%s.mp3' % (lid, k)); opts = []; cut = []
    if t['len'] - t['e_last'] > 0.45: opts += ['--keep', '%.2f' % (t['e_last'] + 0.3)]; cut.append('its silent tail cut at the voice\'s end + 0.3 s')
    if t['e_first'] > 0.3: opts = ['--head', '%.2f' % (t['e_first'] - 0.15)] + ([opts[0], '%.2f' % (float(opts[1]) - (t['e_first'] - 0.15))] if opts else []); cut.append('its lead cut 0.15 s before the voice')
    opts += ['--fade', '0.12']
    p = os.path.join(TMP, 'p_%s.wav' % lid); run('python3', PREP, src, p, *opts)
    if v['who'] == 'he':
        h = os.path.join(TMP, 'h_%s.wav' % lid); run('ffmpeg', '-v', 'error', '-y', '-i', p, '-af', 'highpass=f=70:poles=2', '-ar', '48000', '-ac', '1', h)
        L = enc_peak(lid, h, -6.85, -6.6); how = 'him'
    else:
        w = os.path.join(TMP, 'w_%s.wav' % lid); run('python3', LEVEL, p, w, '-16')
        L = enc_flat(lid, w); how = 'cast, RMS -16'
    others = ', '.join('%s %.2f s%s' % (x, m['e_last'] - m['e_first'], '' if m['clean_end'] else ' (cut on a word)') for x, m in sorted(v['takes'].items()) if x != k)
    rows.append('%-7s %-4s take %s  %-30s voice %.2f-%.2f s of %.2f, %.2f words a second  (%s)%s  -> %.2f s  [%s]' % (
        lid, v['who'], k, v['why'] or 'the one take', t['e_first'], t['e_last'], t['len'], t['wps'], others, ('; ' + '; '.join(cut)) if cut else '', L, how))
    print(rows[-1], flush=True)
for f in os.listdir(TMP): os.remove(os.path.join(TMP, f))
os.rmdir(TMP)
if not only: open(os.path.join(HERE, 'CHAIN.txt'), 'w', encoding='utf-8').write('\n'.join(rows) + '\n')
print(len(rows), 'lines made')
