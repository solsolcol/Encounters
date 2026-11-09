#!/usr/bin/env python3
"""Episode 4 chapter 2 — every line's two takes heard and one picked (CP10), masters/v25.0/voices/pick.py

The house rule for a pick (v18.6): a CLEAN END first (an end on signal must be a whole word, checked by word timings),
then NO ODD HOLE, then the TIGHTER READ; and no tag may be spoken (v5.28). Each take is transcribed here with word
timings (faster-whisper small.en, on this machine — nothing uploaded), and measured with ffmpeg:
  - its length, the silence before the first word and after the last;
  - the words against the script's (the tags in [brackets] and the punctuation set aside): how many of the script's
    words were heard, and whether a tag word was said before the line began;
  - the longest gap between two words (a hole);
  - whether the file ends on signal (its last 60 ms louder than -45 dBFS) and, if so, whether a whole word ends there.
A chant (Pali) is not English: its words are not scored, only its end, its holes and its length.
Writes picks.json (the pick and every measure, for each line) and prints a table. Run from the repo root:
    python3 masters/v25.0/voices/pick.py
"""
import json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, 'raw')
sys.path.insert(0, os.path.join(HERE, '..', 'script'))
ns = {}
src = open(os.path.join(HERE, '..', 'script', 'lines.py'), encoding='utf-8').read()
exec(compile(src.split("if __name__")[0], 'lines.py', 'exec'), ns)
LINES = ns['LINES']
CHANTS = {'lc2namo', 'lc2sak1', 'lc2sak2', 'lc2sak3'}

def norm(s):
    s = re.sub(r'\[[^\]]*\]', ' ', s)
    s = s.lower().replace('…', ' ').replace("'", '')
    return [w for w in re.sub(r'[^a-z0-9 ]+', ' ', s).split() if w]

def tags(s):
    return [w.lower() for t in re.findall(r'\[([^\]]*)\]', s) for w in re.findall(r'[A-Za-z]+', t)]

def probe_len(path):
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', path], capture_output=True, text=True).stdout
    return float(out.strip() or 0)

def tail_db(path, secs=0.06):
    """the loudness of a file's last `secs` (dBFS, RMS)"""
    d = probe_len(path)
    out = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{max(0, d - secs):.3f}', '-i', path, '-af', 'volumedetect', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    m = re.search(r'mean_volume:\s*(-?[\d.]+) dB', out)
    return float(m.group(1)) if m else -99.0

def main():
    from faster_whisper import WhisperModel
    import numpy as np
    globals()['np'] = np
    model = WhisperModel('small.en', device='cpu', compute_type='int8')
    res = {}
    for lid, who, where, text in LINES:
        want = norm(text)
        takes = {}
        for k in ('a', 'b'):
            path = os.path.join(RAW, f'{lid}_{k}.mp3')
            if not os.path.exists(path):
                continue
            pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'], capture_output=True).stdout
            audio = np.frombuffer(pcm, dtype=np.float32).copy()          # (decoded here: this machine's PyAV is older than faster-whisper's)
            segs, _ = model.transcribe(audio, language='en', word_timestamps=True, beam_size=5, vad_filter=False,
                                       initial_prompt=None if lid in CHANTS else re.sub(r'\[[^\]]*\]\s*', '', text))
            words = [w for s in segs for w in (s.words or [])]
            heard = ' '.join(w.word.strip() for w in words)
            L = probe_len(path)
            first = words[0].start if words else 0.0
            last = words[-1].end if words else 0.0
            gaps = [words[i + 1].start - words[i].end for i in range(len(words) - 1)]
            hole = max(gaps) if gaps else 0.0
            tdb = tail_db(path)
            hw = norm(heard)
            got = sum(1 for w in want if w in hw)
            sim = got / max(1, len(want))
            tg = tags(text)
            tag_said = bool(tg) and lid not in CHANTS and any(w in tg for w in hw[:2]) and not any(w in want[:2] for w in hw[:2])
            on_signal = tdb > -45
            clean_end = (not on_signal) or (L - last) > 0.03          # an end on signal must close a whole word
            takes[k] = dict(len=round(L, 3), first=round(first, 3), last=round(last, 3), tail=round(L - last, 3), tail_db=round(tdb, 1),
                            hole=round(hole, 3), sim=round(sim, 3), tag_said=tag_said, clean_end=clean_end, heard=heard)
        def score(k):
            t = takes[k]; chant = lid in CHANTS
            ok = t['clean_end'] and not t['tag_said'] and (chant or t['sim'] >= 0.8)
            speech = t['last'] - t['first']
            return (0 if ok else 1, 1 if t['hole'] > (2.2 if chant else 1.4) else 0, round(speech, 2))
        pick = min(takes, key=score) if takes else None
        why = []
        if pick and len(takes) == 2:
            o = 'b' if pick == 'a' else 'a'; s0, s1 = score(pick), score(o)
            why.append('only clean/valid take' if s0[0] < s1[0] else 'no odd hole' if s0[1] < s1[1] else 'the tighter read')
        res[lid] = dict(who=who, text=text, pick=pick, why=why, takes=takes)
        t = takes.get(pick, {})
        flag = '' if t and t['clean_end'] and not t['tag_said'] and (lid in CHANTS or t['sim'] >= 0.8) else '  <-- CHECK'
        print(f"{lid:9} {pick}  len {t.get('len', 0):6.2f}  sim {t.get('sim', 0):.2f}  hole {t.get('hole', 0):.2f}  tail {t.get('tail', 0):.2f}{flag}  | {t.get('heard', '')[:90]}", flush=True)
    json.dump(res, open(os.path.join(HERE, 'picks.json'), 'w'), indent=1, ensure_ascii=False)
    bad = [k for k, v in res.items() if not v['pick'] or not v['takes'][v['pick']]['clean_end'] or v['takes'][v['pick']]['tag_said']
           or (k not in CHANTS and v['takes'][v['pick']]['sim'] < 0.8)]
    print('lines needing a look:', bad)

if __name__ == '__main__':
    main()
