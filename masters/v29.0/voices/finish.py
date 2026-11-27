#!/usr/bin/env python3
"""v29.0 · the voices INTO the script, once chain.py has made the files (and chant.py --times has read the chants):
    python3 -I masters/v29.0/voices/finish.py [--write]       (from the repo root; without --write it only checks)
For every line of masters/v29.0/script/lines.json (the fields this piece owns, nothing else touched):
  secs     the measured length of its shipped take (assets/audio-opus/<key>.ogg, ffprobe; the mp3 checked within 0.06 s)
  prompt   the exact prompt its take was given (its one tag and the words: what the take SAYS, the registry's rule)
  phone    for a line heard through the phone, the name of its phone copy (<key>tel, both encodings on disk)
  times    for a chant, each verse's [start, end] in seconds from the line's own start, on the take's own breaths,
           one pair to each of its `captions`
THE WORDS HEARD: every picked take is transcribed again with NO prompt (faster-whisper small.en; a prompt writes the
script back, R110 of episode 4 chapter 5) and set beside the script; a line whose words differ is listed for a listen.
Writes voices/heard.json and voices/ADULT_TAKES.txt (Master Zavier's take names: the engine's ADULT_TAKES must hold them;
src/main.js is the engine's, so the coordinator puts them in)."""
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
LJ = os.path.join(HERE, '..', 'script', 'lines.json')
src = open(LJ, encoding='utf-8').read(); S = json.loads(src)
assert json.dumps(S, indent=2, ensure_ascii=False) == src, 'lines.json is not in its own shape'
PR = {o['key']: o for o in json.load(open(os.path.join(HERE, 'prompts.json'), encoding='utf-8'))}
PK = json.load(open(os.path.join(HERE, 'picks.json'), encoding='utf-8'))
CH = json.load(open(os.path.join(HERE, 'chants.json'), encoding='utf-8'))
PHONE = set(json.load(open(os.path.join(HERE, 'phone.json'))))
def dur(f): return float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], check=True, capture_output=True, text=True).stdout.strip())
def files(n): return os.path.join(ROOT, 'assets', 'audio', n + '.mp3'), os.path.join(ROOT, 'assets', 'audio-opus', n + '.ogg')
SPELL = {'alright': 'all right', 'okay': 'ok'}
def norm(s):
    s = re.sub(r'\[[^\]]*\]', ' ', s).lower().replace("'", '').replace('’', '').replace('-', ' ')
    return ' '.join(SPELL.get(w, w) for w in re.sub(r'[^a-z0-9 ]+', ' ', s).split())

HP = os.path.join(HERE, 'heard.json'); H = json.load(open(HP, encoding='utf-8')) if os.path.exists(HP) else {}
model = None
bad, miss = [], []
for r in S['lines']:
    k = r['key']; mp3, ogg = files(k)
    if not (os.path.exists(mp3) and os.path.exists(ogg)): miss.append(k); continue
    a, b = dur(ogg), dur(mp3); assert abs(a - b) < 0.08, '%s: the two encodings differ in length (%.2f, %.2f)' % (k, a, b)
    r['secs'] = round(a, 2); r['prompt'] = PR[k]['prompt']
    if k in PHONE:
        t1, t2 = files(k + 'tel'); assert os.path.exists(t1) and os.path.exists(t2), k + ': no phone copy'
        r['phone'] = k + 'tel'
    if r.get('chant'):
        tm = CH[k]['times']; assert len(tm) == len(r['captions']) and CH[k]['times_ok'], k + ': the verses were not read'
        assert abs(CH[k]['final_len'] - a) < 0.1, k + ': the times were read from another file'
        r['times'] = tm
        continue
    if k not in H or H[k].get('take') != PK[k]['pick']:
        if model is None:
            from faster_whisper import WhisperModel
            model = WhisperModel('small.en', device='cpu', compute_type='int8')
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', ogg, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout
        import numpy as np
        segs, _ = model.transcribe(np.frombuffer(raw, dtype=np.float32).copy(), language='en', beam_size=5, vad_filter=False)
        H[k] = dict(take=PK[k]['pick'], heard=' '.join(s.text.strip() for s in segs))
    if norm(H[k]['heard']) != norm(r.get('say', r['text'])): bad.append('%-8s script: %s\n         heard:  %s' % (k, r.get('say', r['text']), H[k]['heard']))
json.dump(H, open(HP, 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('%d lines with their files; missing: %s' % (len(S['lines']) - len(miss), ' '.join(miss) or 'none'))
if bad: print('HEARD, UNPROMPTED, OTHER THAN THE SCRIPT (each listened for by its word timings, its take kept or re-said):'); print('\n'.join(bad))
zv = [r['key'] for r in S['lines'] if r['who'] == 'zv' and 'secs' in r]
open(os.path.join(HERE, 'ADULT_TAKES.txt'), 'w').write('\n'.join(zv) + '\n')
by = {}
for r in S['lines']:
    if 'secs' in r: by.setdefault(r['who'], []).append(r['secs'])
for w, v in by.items(): print('%s: %d lines, %.1f s' % (w, len(v), sum(v)))
if '--write' in sys.argv:
    out = json.dumps(S, indent=2, ensure_ascii=False)
    if out != src: open(LJ, 'w', encoding='utf-8').write(out)
    print('lines.json', 'written' if out != src else 'as it was')
