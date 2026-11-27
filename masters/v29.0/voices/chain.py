# v29.0 · THE VOICE CHAIN (chapter 5's, masters/v28.0/voices/chain.py, with this chapter's speakers, the chants and the
# phone's copies): each line's picked take (voices/picks.json, chants.json) made into the game's two files.
#   python3 -I masters/v29.0/voices/chain.py [key ...]      (run from the repo root; no key = every line)
# The chain is the house's (masters/v25.0/make.sh, v16.0, v11.1), unchanged:
#   HIM (Brian)          mono, high-passed at 70 Hz, PEAK-matched to -6.85 dBFS (mp3) and -6.6 (Opus) for his own bus,
#                        which has a compressor and make-up gain; two passes, because each encoder moves the peak (v9.6)
#   THE CAST (Grandmaster Pho, Grace, Marcus)   levelled by RMS to -16 dBFS under a -1.5 dBFS limiter for the flat cast
#                        bus (masters/v11.1/level.py)
#   THE TWO CHANTS       RMS -17 (v25.5's chant level, a chant on the effects path under the lines, v24.0)
#   every take           its last 0.12 s faded (0.03 s where the voice runs into its last 0.15 s: R106); a silent tail
#                        longer than 0.45 s cut at the voice's end + 0.3 s; a lead longer than 0.3 s cut 0.15 s before
#   THE PHONE'S COPY     (phone.json: the barrier and the four endings' calls, plan 9.7 and 9.8) the prepped take through
#                        a phone's band, 300 to 3400 Hz (two second-order passes each side, so it falls off steeply), a
#                        little compression (3:1 over -24 dB, 5 ms / 120 ms) and the same RMS as its own take; written
#                        as assets/audio/<key>tel.mp3 and assets/audio-opus/<key>tel.ogg. The clean take stays <key>.
#   files                assets/audio/<key>.mp3 (128 kbps, 44.1 kHz) and assets/audio-opus/<key>.ogg (64 kbps mono, 48 kHz),
#                        metadata stripped; each encoding from its own source and measured (v9.6)
# Writes voices/CHAIN.txt: one row a line (the take, why it was picked, what was cut, the file's length): the record.
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
P = json.load(open(os.path.join(HERE, 'picks.json'), encoding='utf-8'))
C = json.load(open(os.path.join(HERE, 'chants.json'), encoding='utf-8')) if os.path.exists(os.path.join(HERE, 'chants.json')) else {}
PHONE = set(json.load(open(os.path.join(HERE, 'phone.json'))))
only = sys.argv[1:]
TMP = os.path.join(HERE, '_tmp'); os.makedirs(TMP, exist_ok=True)
PREP, LEVEL, PEAK = (os.path.join(ROOT, 'masters', a, b) for a, b in (('v21.0', 'prep.py'), ('v11.1', 'level.py'), ('v9.7', 'peak.py')))
BAND = 'highpass=f=300:poles=2,highpass=f=300:poles=2,lowpass=f=3400:poles=2,lowpass=f=3400:poles=2,acompressor=threshold=-24dB:ratio=3:attack=5:release=120:makeup=2'
def run(*a, **k): return subprocess.run(list(a), check=True, capture_output=True, text=True, **k)
def peak(f): return float(run('python3', PEAK, f).stdout.split('peak ')[1].split(' dBFS')[0])
def dur(f): return float(run('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f).stdout.strip())
def files(n): return os.path.join(ROOT, 'assets/audio/%s.mp3' % n), os.path.join(ROOT, 'assets/audio-opus/%s.ogg' % n)
def enc_peak(n, wav, tm, to):
    mp3, ogg = files(n)
    gm = go = tm - peak(wav)
    for _ in (1, 2):
        run('ffmpeg', '-v', 'error', '-y', '-i', wav, '-af', 'volume=%.2fdB' % gm, '-map_metadata', '-1', '-c:a', 'libmp3lame', '-b:a', '128k', '-ar', '44100', mp3)
        run('ffmpeg', '-v', 'error', '-y', '-i', wav, '-af', 'volume=%.2fdB' % go, '-map_metadata', '-1', '-c:a', 'libopus', '-b:a', '64k', '-ar', '48000', ogg)
        gm += tm - peak(mp3); go += to - peak(ogg)
    return dur(ogg)
def enc_flat(n, wav):
    mp3, ogg = files(n)
    run('ffmpeg', '-v', 'error', '-y', '-i', wav, '-map_metadata', '-1', '-c:a', 'libmp3lame', '-b:a', '128k', '-ar', '44100', mp3)
    run('ffmpeg', '-v', 'error', '-y', '-i', wav, '-map_metadata', '-1', '-c:a', 'libopus', '-b:a', '64k', '-ar', '48000', ogg)
    return dur(ogg)
rows = []
items = list(P.items()) + [(k, dict(v, who='ph', chant=True)) for k, v in C.items()]
for lid, v in items:
    if only and lid not in only: continue
    k = v['pick']; t = v['takes'][k]; src = os.path.join(HERE, 'raw', '%s_%s.mp3' % (lid, k)); opts = []; cut = []
    if t['len'] - t['e_last'] > 0.45: opts += ['--keep', '%.2f' % (t['e_last'] + 0.3)]; cut.append('its silent tail cut at the voice\'s end + 0.3 s')
    if t['e_first'] > 0.3: opts = ['--head', '%.2f' % (t['e_first'] - 0.15)] + ([opts[0], '%.2f' % (float(opts[1]) - (t['e_first'] - 0.15))] if opts else []); cut.append('its lead cut 0.15 s before the voice')
    opts += ['--fade', '0.03' if t['len'] - t['e_last'] < 0.15 and '--keep' not in opts else '0.12']
    p = os.path.join(TMP, 'p_%s.wav' % lid); run('python3', PREP, src, p, *opts)
    if v['who'] == 'zv':
        h = os.path.join(TMP, 'h_%s.wav' % lid); run('ffmpeg', '-v', 'error', '-y', '-i', p, '-af', 'highpass=f=70:poles=2', '-ar', '48000', '-ac', '1', h)
        L = enc_peak(lid, h, -6.85, -6.6); how = 'him'
    else:
        lv = -17 if v.get('chant') else -16
        w = os.path.join(TMP, 'w_%s.wav' % lid); run('python3', LEVEL, p, w, str(lv))
        L = enc_flat(lid, w); how = 'chant, RMS %d' % lv if v.get('chant') else 'cast, RMS %d' % lv
        if lid in PHONE:
            b = os.path.join(TMP, 'b_%s.wav' % lid); run('ffmpeg', '-v', 'error', '-y', '-i', w, '-af', BAND, '-ar', '48000', '-ac', '1', b)
            bw = os.path.join(TMP, 'bw_%s.wav' % lid); run('python3', LEVEL, b, bw, str(lv))
            Lt = enc_flat(lid + 'tel', bw); how += '; the phone copy %stel %.2f s' % (lid, Lt)
    others = ', '.join('%s %.2f s%s' % (x, m['e_last'] - m['e_first'], '' if m['clean_end'] else ' (cut on a word)') for x, m in sorted(v['takes'].items()) if x != k)
    rows.append('%-9s %-2s take %s  %-30s voice %.2f-%.2f s of %.2f, %.2f words a second  (%s)%s  -> %.2f s  [%s]' % (
        lid, v['who'], k, v['why'] or 'the one take', t['e_first'], t['e_last'], t['len'], t['wps'], others, ('; ' + '; '.join(cut)) if cut else '', L, how))
    print(rows[-1], flush=True)
for f in os.listdir(TMP): os.remove(os.path.join(TMP, f))
os.rmdir(TMP)
if not only: open(os.path.join(HERE, 'CHAIN.txt'), 'w', encoding='utf-8').write('\n'.join(rows) + '\n')
print(len(rows), 'lines made')
