"""v24.0 CP11 · transcribe every raw take locally -> tr.json. A line in English with faster-whisper small.en (word
timings); a line with Thai in it with the multilingual small (language th), since small.en cannot hear Thai. A take is
picked by what it SAYS as well as by its ends. Take names: <line id>[_<voice or variant>]_<letter>."""
import glob, json, os, re, sys
sys.path.insert(0, '../script'); from lines import L
TEXT = {r[0]: r[3] for r in L}
from faster_whisper import WhisperModel
en = WhisperModel('small.en', device='cpu', compute_type='int8')
mu = WhisperModel('small', device='cpu', compute_type='int8')
out = json.load(open('tr.json')) if os.path.exists('tr.json') else {}
for p in sorted(glob.glob('raw/*.mp3')):
    k = os.path.basename(p)[:-4]
    if k in out: continue
    lid = k.split('_')[0]
    th = bool(re.search('[฀-๿]', TEXT.get(lid, '')))
    m, kw = (mu, dict(language='th')) if th else (en, dict(initial_prompt='Ajahn. Pong. Pa Noi. Khun Joy. Uncle Lim. Nang Kwak. takrut. pha yant. sala. samnak. KL. Khop khun krap.'))
    segs, info = m.transcribe(p, word_timestamps=True, beam_size=5, **kw)
    words = []
    for s in segs:
        for w in s.words: words.append([w.word.strip(), round(w.start, 2), round(w.end, 2)])
    out[k] = {'text': ('' if th else ' ').join(w[0] for w in words), 'words': words, 'lang': 'th' if th else 'en'}
    json.dump(out, open('tr.json', 'w'), indent=0, ensure_ascii=False)
    print(k, '|', out[k]['text'], flush=True)
