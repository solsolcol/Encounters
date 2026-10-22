"""v21.30 · transcribe every raw take locally (faster-whisper small.en, word timings) -> tr.json.
A take is picked by what it SAYS (the words exactly) as well as by its ends; the gaps between words show the read."""
import glob, json, os, sys
from faster_whisper import WhisperModel
m = WhisperModel('small.en', device='cpu', compute_type='int8')
out = json.load(open('tr.json')) if os.path.exists('tr.json') else {}
for p in sorted(glob.glob('raw/*.mp3')):
    k = os.path.basename(p)[:-4]
    if k in out: continue
    segs, info = m.transcribe(p, word_timestamps=True, beam_size=5, initial_prompt='Sifu. Thevada. Hanuman. Luang Phu Tim.')
    words = []
    for s in segs:
        for w in s.words: words.append([w.word.strip(), round(w.start, 2), round(w.end, 2)])
    out[k] = {'text': ' '.join(w[0] for w in words), 'words': words}
    json.dump(out, open('tr.json', 'w'), indent=0)
    print(k, '|', out[k]['text'], flush=True)
