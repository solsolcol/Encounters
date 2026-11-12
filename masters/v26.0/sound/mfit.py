# v26.0 · EACH MUSIC TAKE HELD AGAINST ITS FILM. meas-music.txt (masters/v24.34/music/meas.py) says what a take is: its
# bands, what a phone loses, its arc. This says how it lies in the film that cues it: the take's own start and end,
# and the stretch of film it plays over (from its cue to the end of its fade), second by second: its level against
# its own median, and whether a voice is speaking then (the walk's cue list: CH=e4c3 OUT=cues.json node
# tools/probes/voicescan.mjs). A second where the music is 14 dB or more under its median while nobody speaks is a
# HOLE: the film is bare there, unless a sound with a reason holds it.
#   python3 -I masters/v26.0/sound/mfit.py <cues.json> [name ...]        (run from the repo root; writes mfit.txt)
import json, os, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); SR = 22050
CUES = json.load(open(sys.argv[1])); only = sys.argv[2:]
T = json.load(open(os.path.join(HERE, 'clocks.json')))
F, B, TE, AN, E, C, O, SECS = T['FEST'], T['BETW'], T['TELL'], T['ANSW'], T['ENDT'], T['CLOSE'], T['OPENT'], T['SECS']
# name: (the film's label in the walk, the cue's film time, the fade's start, the fade's end)
close = lambda k: E[k]['close']
WHERE = {
    'x3openmus':  ('opening film', 0.4, O['black'] - 0.6, O['end'] - 0.05),
    'x3dancemus': ('film festival', 0.05, F['cut'] - 0.6, F['cut'] + 0.7),
    'x3sightmus': ('film festival', F['pho'] + 0.6, F['black'] - 0.5, F['end'] - 0.05),
    'x3nightmus': ('film between', 0.2, B['tn3n1'] + 0.4, B['end'] - 0.05),
    'x3tellmus':  ('film tell', 0.2, TE['black'] - 0.5, TE['end']),
    'x3answmus':  ('film answers', 0.3, AN['ph3g5'] + 2.5, AN['end']),
    'x3endA':     ('ending A', E['A']['long'] + 0.2, close('A') - 2.0, close('A')),
    'x3endB':     ('ending B', E['B']['q3B1'] + 0.6, E['B']['silence'] - 0.4, E['B']['silence'] + 2.2),
    'x3endC':     ('ending C', E['C']['turn'] + 0.2, close('C') - 2.0, close('C')),
    'x3endD':     ('ending D', E['D']['q3D3'] + 1.5, close('D') - 2.0, close('D')),
    'x3closemus': ('ending A', close('A') - 4.5, close('A') + C['breath'] - 1.4, close('A') + C['breath'] - 0.05),
    'x3lastmus':  ('ending A', close('A') + C['q3z1'] - 0.3, close('A') + C['black'] - 0.6, close('A') + C['end'] - 0.05),
}
def dec(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)
db = lambda v: 20 * np.log10(max(float(v), 1e-9))
out = []
for name, (film, at, f0, f1) in WHERE.items():
    if only and name not in only: continue
    voices = sorted((q['at'], q['at'] + SECS[q['kind']]) for q in CUES[film]['cues'] if q['kind'] in SECS)
    speaking = lambda a, b: any(v0 < b - 0.15 and v1 > a + 0.15 for v0, v1 in voices)
    need = f1 - at
    out.append('%s  in %s: cued at %.2f, fades %.2f to %.2f: it must sound for %.1f s (%.1f to its fade)' % (name, film, at, f0, f1, need, f0 - at))
    for k in 'abc':
        p = os.path.join(HERE, 'raw', '%s_%s.mp3' % (name, k))
        if not os.path.isfile(p): continue
        x = dec(p); n = len(x) // SR
        s1 = np.array([db(np.sqrt(np.mean(x[i * SR:(i + 1) * SR] ** 2))) for i in range(n)])
        fr = np.array([db(np.sqrt(np.mean(x[i:i + SR // 20] ** 2))) for i in range(0, len(x) - SR // 20, SR // 20)])
        thr = db(np.abs(x).max()) - 40
        on = float(np.argmax(fr > thr)) * 0.05; end = (len(fr) - int(np.argmax(fr[::-1] > thr))) * 0.05
        live = s1[(np.arange(n) >= on) & (np.arange(n) < end - 1)]; med = float(np.median(live)) if len(live) else -90
        # the take laid on the film with its silent head cut to 0.1 s (what sound.sh does where the head is over 0.3 s)
        cut = max(0.0, on - 0.1) if on > 0.3 else 0.0
        row, holes = [], []
        for i in range(int(np.ceil(need))):
            m = i + cut; j = int(m)
            lv = s1[j] - med if j < n else -99
            ft = at + i
            v = speaking(ft, ft + 1)
            row.append(('%+3.0f' % max(lv, -99)) + ('v' if v else ' '))
            if lv <= -14 and not v and ft + 1 <= f0: holes.append('%.0f-%.0f' % (ft, ft + 1))
        out.append('  %s  on %.2f end %.2f (median %.1f dBFS); its head cut %.2f s; it ends at film %.2f (its fade ends %.2f)%s' % (
            k, on, end, med, cut, at + end - cut, f1, ('   HOLES with no voice, before the fade: ' + ' '.join(holes)) if holes else ''))
        out.append('     ' + ' '.join(row))
    out.append('')
txt = '\n'.join(out)
if not only: open(os.path.join(HERE, 'mfit.txt'), 'w').write(txt + '\n')
print(txt)
