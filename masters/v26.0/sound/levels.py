# v26.0 · THE MIX, MEASURED (a session has no ears, v10.4): where every sound of the chapter stands, from the files
# the game ships and the volumes the chapter plays them at.
#   python3 -I masters/v26.0/sound/levels.py        (run from the repo root, after assemble; writes sound/LEVELS.txt)
# 1. THE BEDS: each file's level (the median of its seconds, both channels) and where its BED volume puts it.
# 2. EVERY FILM AND ENDING, cue by cue (the walk's list: tools/probes/voicescan.mjs OUT): a music cue's level over the
#    stretch it plays; an effect's LOUDEST TWENTIETH OF A SECOND (what sound.sh levels a one-shot by: level_fx.py) and
#    its peak, at its cue's volume, beside the music sounding under it at that moment. An effect whose loudest 50 ms is
#    more than 6 dB under the music's level then is BURIED; one over -16 (a voice's own level) is HOT. (The engine
#    ducks effects, music and beds alike under a voice, 8 dB: what is compared here keeps its distance through the
#    duck.) A long pass that is itself the place's sound (the afternoon, the swept ground, the far chant) is read by
#    its level where it sounds, as a bed is.
import json, math, os, re, subprocess, sys, tempfile
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..')); SR = 22050
CH = open(os.path.join(ROOT, 'src/chapters/e4/e4c3.js'), encoding='utf-8').read()
db = lambda v: 20 * math.log10(max(float(v), 1e-9))
cache = {}
def load(n):
    if n not in cache:
        f = os.path.join(ROOT, 'assets/audio-opus/%s.ogg' % n)      # in its own channels: a mono file plays whole from both speakers (ffmpeg's own upmix would read it 3 dB low)
        ch = int(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'stream=channels', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout.split()[0])
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
        cache[n] = np.frombuffer(raw, dtype=np.float32).astype(np.float64).reshape(-1, ch)
    return cache[n]
def secs(n):                      # the level of each second, both channels
    x = load(n); k = len(x) // SR
    return np.array([db(math.sqrt((x[i * SR:(i + 1) * SR] ** 2).mean())) for i in range(max(1, k))])
LONG = {'x3afternoon', 'x3sweep', 'x3chantfar', 'x3chant'}
def where(n):                     # an effect: its loudest 50 ms (a long pass: its level where it sounds), its peak, how long it sounds
    x = load(n); h = SR // 20
    fr = np.array([math.sqrt((x[i:i + h] ** 2).mean()) for i in range(0, max(1, len(x) - h), h)])
    live = fr[fr > fr.max() * 10 ** (-30 / 20)]
    c = np.cumsum(np.concatenate([[0.0], (x ** 2).mean(1)])); w = (c[h:] - c[:-h]) / h if len(x) > h else np.array([c[-1] / max(1, len(x))])
    return (db(math.sqrt((live ** 2).mean())) if n in LONG else 10 * math.log10(w.max() + 1e-18)), db(np.abs(x).max()), len(live) * 0.05
out = []
m = re.search(r"const BED = \{([^}]*)\}", CH); BED = {k: float(v) for k, v in re.findall(r"(\w+): ([0-9.]+)", m.group(1))}
FILE = {'fest': 'x3festbed', 'mus': 'x3festmus', 'birds': 'x3birds', 'open': 'x3open', 'crick': 'x3crickets', 'pull': 'x3pull', 'shop': 'x3shophum'}
out.append('THE BEDS (file: the median of its seconds; in play at the BED volume, nobody speaking; under a voice 8 dB less)')
tot = 0
for k, f in FILE.items():
    med = float(np.median(secs(f))); lv = med + db(BED[k])
    out.append('  %-10s %-11s file %6.1f dBFS   x %.2f  ->  %6.1f dBFS' % (k, f, med, BED[k], lv))
day1 = 10 * math.log10(sum(10 ** ((float(np.median(secs(FILE[k]))) + db(BED[k])) / 10) for k in ('fest', 'mus')))
out.append('  day one, the crowd and the music together: %.1f dBFS (a voice at -16 stands %.1f dB over it through the duck)' % (day1, -16 - (day1 - 8)))
med = float(np.median(secs('x3chant'))); out.append('  the chant over the loudspeakers (x3chant at 0.9): %.1f dBFS, the ground\'s music stopped for it' % (med + db(0.9)))
tmp = tempfile.mkdtemp(); cj = os.path.join(tmp, 'cues.json')
subprocess.run(['node', os.path.join(ROOT, 'tools/probes/voicescan.mjs')], env=dict(os.environ, CH='e4c3', OUT=cj), capture_output=True, cwd=ROOT)
CUES = json.load(open(cj)); os.remove(cj); os.rmdir(tmp)
VOICES = set(re.findall(r'\bid:\s*"([^"]+)"', open(os.path.join(ROOT, 'src/voicelines.js'), encoding='utf-8').read()))
MUSIC = {r['name'] for r in json.load(open(os.path.join(HERE, 'music.json')))}
flags = 0
for film, d in CUES.items():
    out.append(''); out.append('%s (%.1f s)' % (film, d['dur']))
    mus = [q for q in d['cues'] if q['kind'] in MUSIC]
    def music_at(t):              # the music sounding at film time t: its level in that second at its cue's volume, through its fade
        best = None
        for q in mus:
            s1 = secs(q['kind']); i = int(t - q['at'])
            if t < q['at'] or i >= len(s1): continue
            lv = s1[i] + db(q['vol'])
            for f in d['fades']:
                if f['kind'] == q['kind'] and f['t0'] >= q['at'] - 1e-6 and t >= f['t0']:
                    lv += db(max(1e-3, 1 - (t - f['t0']) / max(1e-3, f['t1'] - f['t0']))) if t < f['t1'] else -60
            best = lv if best is None else 10 * math.log10(10 ** (best / 10) + 10 ** (lv / 10))
        return best
    for q in d['cues']:
        k, at, vol = q['kind'], q['at'], q['vol']
        if k in VOICES: continue
        if k in MUSIC:
            s1 = secs(k); f = sorted([f for f in d['fades'] if f['kind'] == k and f['t0'] >= at - 1e-6], key=lambda f: f['t0'])
            end = min(d['dur'], f[0]['t1'] if f else 1e9, at + len(s1)); body = s1[:max(1, int((f[0]['t0'] if f else end) - at))]
            out.append('  %7.2f  %-11s MUSIC x %.2f: median %6.1f dBFS (its quiet fifth %6.1f, its loud tenth %6.1f), sounding %.1f s to %.2f' % (
                at, k, vol, float(np.median(body)) + db(vol), float(np.percentile(body, 20)) + db(vol), float(np.percentile(body, 90)) + db(vol), end - at, end))
            continue
        lv, pk, ln = where(k); lv += db(vol); pk += db(vol); mu = music_at(at + min(0.5, ln / 2))
        note = ''
        if mu is not None and lv < mu - 6 and k not in LONG: note = '   BURIED: %.0f dB under the music' % (mu - lv); flags += 1
        if lv > -16: note += '   HOT'; flags += 1
        out.append('  %7.2f  %-11s x %.2f: %s %6.1f dBFS (peak %6.1f, %.1f s)%s%s' % (at, k, vol, 'where it sounds' if k in LONG else 'its loudest 50 ms', lv, pk, ln, ('; the music then %6.1f' % mu) if mu is not None else '', note))
out.append(''); out.append('%d cue(s) flagged' % flags)
txt = '\n'.join(out); open(os.path.join(HERE, 'LEVELS.txt'), 'w').write(txt + '\n'); print(txt)
