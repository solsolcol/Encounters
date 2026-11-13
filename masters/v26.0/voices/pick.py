#!/usr/bin/env python3
"""Episode 4 chapter 3: every line's takes heard and one picked (CP7.1), masters/v26.0/voices/pick.py

The house rule for a pick (v18.6, v25.5): a CLEAN END first (an end on signal must be a whole word, and a take that
ends on signal is refused before its length is looked at), then NO ODD HOLE, then NOT RUSHED (a line said at twice the
game's pace is a rushed line), then the read that fits the speaker: the TIGHTER read for him, Ton and the woman; for
GRANDMASTER PHO the UNHURRIED one (the slower read, as long as it does not drag under 1.3 words a second): he is an
old teacher who does not hurry, and his three takes of one prompt ran from 2.4 to 3.1 words a second in the audition.
No tag may be spoken (v5.28).

Each take is transcribed here with word timings (faster-whisper small.en, on this machine: nothing uploaded; decoded
by ffmpeg to samples, because this box's PyAV refuses a path), and measured:
  - its length; where the voice is by energy (20 ms frames over the peak - 38 dB);
  - the words against the script's (the tag in [brackets] and the punctuation set aside): how many of the script's
    words were heard, and whether the tag's word was said before the line began;
  - the longest gap between two words (a hole);
  - the loudness of its last 60 ms: over -45 dBFS it ends ON signal, and is clean only if the last word (the
    transcriber's timing) ended 0.12 s or more before the file does, so the chain's 0.12 s fade can never eat a word.
Writes picks.json (the pick and every measure, for each line) and prints a table. Run from the repo root:
    python3 -I masters/v26.0/voices/pick.py            (every line; a line already in picks.json is kept unless --all)
    python3 -I masters/v26.0/voices/pick.py q3o1 ph3z2 (these lines again)
"""
import json, os, re, subprocess, sys
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, 'raw')
PROMPTS = json.load(open(os.path.join(HERE, 'prompts.json'), encoding='utf-8'))
PACE = 2.3                                            # the game's median, words a second (v5.30)
_rs = os.path.join(HERE, 'sessions-resay.json')       # lines said again: their takes c, d, e were given this prompt (the same words; another tag)
RESAY = json.load(open(_rs, encoding='utf-8'))['lines'] if os.path.exists(_rs) else {}
# (v26.8: the lines Chad had re-written are said in new words, every letter of them: an older re-say of the same key no
#  longer names what its later letters say. q3t4's takes c to e were heard against "I pick up a piece..." and read 0.21)
_v268 = os.path.join(HERE, 'sessions-v268.json')
if os.path.exists(_v268):
    for _k in json.load(open(_v268, encoding='utf-8'))['lines']: RESAY.pop(_k, None)

def norm(s):
    s = re.sub(r'\[[^\]]*\]', ' ', s)
    s = s.lower().replace('…', ' ').replace("'", '').replace('’', '')
    return [w for w in re.sub(r'[^a-z0-9 ]+', ' ', s).split() if w]

def tags(s):
    return [w.lower() for t in re.findall(r'\[([^\]]*)\]', s) for w in re.findall(r'[A-Za-z]+', t)]

def pcm(path, sr=16000):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()

def span(x, sr=16000):
    """where the voice is, by energy: 20 ms frames over the peak - 38 dB"""
    w = int(sr * 0.02)
    if len(x) < 2 * w: return 0.0, 0.0
    d = 20 * np.log10(np.maximum(np.array([np.sqrt(np.mean(x[i:i + w].astype(np.float64) ** 2)) for i in range(0, len(x) - w, w)]), 1e-9))
    idx = np.where(d > d.max() - 38)[0]
    return (round(float(idx[0]) * 0.02, 3), round(float(idx[-1] + 1) * 0.02, 3)) if len(idx) else (0.0, 0.0)

def tail_db(x, sr=16000, secs=0.06):
    t = x[-int(sr * secs):].astype(np.float64)
    return float(20 * np.log10(max(np.sqrt(np.mean(t ** 2)), 1e-9))) if len(t) else -99.0

def ending(x, last, sr=16000):
    """HOW A TAKE ENDS. eleven_v3 ends a take on its last sample (v5.30), so nearly every take 'ends on signal' by the
    plain test (its last 60 ms over -45 dBFS) and the transcriber puts the last word's end at the file's end. What
    matters is WHAT is sounding there: a word still at speaking level is a word cut (refused); a word's release, well
    under speaking level and falling, is a word that has been said, and the chain's 0.12 s fade lets it go. So an end
    is CLEAN when it is silent (under -45), or the last word ended 0.12 s or more before it, or its last 60 ms are 12 dB
    or more under the take's own speaking level (the 90th percentile of its 20 ms frames) and not rising."""
    L = len(x) / sr; w = int(sr * 0.02)
    d = 20 * np.log10(np.maximum(np.array([np.sqrt(np.mean(x[i:i + w].astype(np.float64) ** 2)) for i in range(0, len(x) - w, w)]), 1e-9))
    p90 = float(np.percentile(d, 90)) if len(d) else -99.0
    t = tail_db(x); prev = tail_db(x[:-int(sr * 0.06)]) if len(x) > sr * 0.2 else t
    clean = (t <= -45) or (L - last >= 0.12) or (t - p90 <= -12 and t <= prev + 1)
    return round(t, 1), round(t - p90, 1), bool(clean)

def measure(model, path, text):
    x = pcm(path); L = len(x) / 16000.0
    segs, _ = model.transcribe(x, language='en', word_timestamps=True, beam_size=5, vad_filter=False, initial_prompt=re.sub(r'\[[^\]]*\]\s*', '', text))
    words = [w for s in segs for w in (s.words or [])]
    heard = ' '.join(w.word.strip() for w in words)
    want, hw, tg = norm(text), norm(heard), tags(text)
    first = words[0].start if words else 0.0; last = words[-1].end if words else 0.0
    gaps = [words[i + 1].start - words[i].end for i in range(len(words) - 1)]
    e0, e1 = span(x); tdb, trel, clean = ending(x, last)
    sim = sum(1 for w in want if w in hw) / max(1, len(want))
    tag_said = bool(tg) and any(w in tg for w in hw[:2]) and not any(w in want[:2] for w in hw[:2])
    return dict(len=round(L, 3), first=round(first, 3), last=round(last, 3), e_first=e0, e_last=e1, tail_db=tdb, tail_rel=trel,
                hole=round(max(gaps), 3) if gaps else 0.0, sim=round(sim, 3), tag_said=bool(tag_said),
                clean_end=clean, wps=round(len(want) / max(0.25, e1 - e0), 2), heard=heard)

def score(t, who, nwords, med=None):
    ok = t['clean_end'] and not t['tag_said'] and t['sim'] >= 0.8
    # (a hole: 1.4 s for a spoken reply; 1.7 for him, whose narration stops between two sentences, the pause its
    #  [reflective] read is asked for; 1.9 for Grandmaster Pho, who lets a sentence land before the next)
    hole = t['hole'] > (1.9 if who == 'pho' else 1.7 if who == 'he' else 1.4)
    voice = round(t['e_last'] - t['e_first'], 2)
    # RUSHED: twice the game's pace; or, for a line of a word or two (where a pace means little), far shorter than the
    # same line's other takes: a short take is where the clean end is lost (v25.5: "Teach me." came back 0.64 s long)
    rushed = (nwords >= 3 and t['wps'] > 2 * PACE) or (med is not None and voice < 0.62 * med)
    if who == 'pho':
        drag = t['wps'] < 1.3 and nwords >= 4
        return (0 if ok else 1, 1 if hole else 0, 1 if (rushed or drag) else 0, 0.0, -voice) # the unhurried read
    # the tighter read, but never a hurried one where an easier one is here: he is at the game's pace (its median is
    # about 2.3 words a second over a line's whole length, v5.30; about 3 over the voice alone, as measured here), and
    # what a take runs over 3.2 counts against it before its length is looked at
    fast = round(max(0.0, t['wps'] - 3.2), 1) if nwords >= 4 else 0.0
    return (0 if ok else 1, 1 if hole else 0, 1 if rushed else 0, fast, voice)

WHY = ['the only clean and whole take', 'no odd hole', 'not rushed', 'the easier pace', None]

def main():
    out_p = os.path.join(HERE, 'picks.json')
    res = json.load(open(out_p, encoding='utf-8')) if os.path.exists(out_p) else {}
    only = [a for a in sys.argv[1:] if not a.startswith('--')]
    RESCORE = '--rescore' in sys.argv        # every take already heard is measured again by its sound alone and every pick made again: nothing transcribed
    model = None
    for o in PROMPTS:
        lid, who, text = o['key'], o['speaker'], o['prompt']
        if only and lid not in only: continue
        if not only and not RESCORE and lid in res and '--all' not in sys.argv: continue
        takes = {}
        for k in 'abcdef':                                # (every letter that is here: takes made again after a refusal follow the first)
            p = os.path.join(RAW, '%s_%s.mp3' % (lid, k))
            if not os.path.exists(p): continue
            old = res.get(lid, {}).get('takes', {}).get(k)
            if old and (RESCORE or not only):             # heard before: its words and their timings are kept
                x = pcm(p); e0, e1 = span(x); tdb, trel, clean = ending(x, old['last'])
                old.update(e_first=e0, e_last=e1, tail_db=tdb, tail_rel=trel, clean_end=clean, wps=round(len(norm(text)) / max(0.25, e1 - e0), 2)); takes[k] = old
            else:
                if model is None:
                    from faster_whisper import WhisperModel
                    model = WhisperModel('small.en', device='cpu', compute_type='int8')
                takes[k] = measure(model, p, RESAY[lid]['prompt'] if (lid in RESAY and k in 'cdef' and who != 'pho') else text)
        if not takes: print(lid, 'NO TAKES'); continue
        n = len(norm(text)); med = float(np.median([t['e_last'] - t['e_first'] for t in takes.values()])) if len(takes) > 1 else None
        sc = {k: score(t, who, n, med) for k, t in takes.items()}
        pick = min(sc, key=lambda k: sc[k]); rest = [k for k in sc if k != pick]
        why = ''
        if rest:
            best = min(rest, key=lambda k: sc[k])
            for i in range(5):
                if sc[pick][i] < sc[best][i]:
                    why = WHY[i] or ('the unhurried read' if who == 'pho' else 'the tighter read'); break
            else: why = 'equal by every measure: the first'
        t = takes[pick]
        res[lid] = dict(who=who, text=text, pick=pick, why=why, med=med, takes=takes)
        flag = '' if sc[pick][0] == 0 and sc[pick][1] == 0 and sc[pick][2] == 0 else '  <-- CHECK'
        print(f"{lid:7} {pick} of {''.join(sorted(takes))}  len {t['len']:5.2f}  wps {t['wps']:4.2f}  sim {t['sim']:.2f}  hole {t['hole']:.2f}  end {t['tail_db']:6.1f} ({t['tail_rel']:+.0f})  {why}{flag}  | {t['heard'][:70]}", flush=True)
        open(out_p, 'w', encoding='utf-8').write(json.dumps(res, indent=1, ensure_ascii=False))     # (after every line: a long run can be picked up where it stopped)
    bad = [k for k, v in res.items() if score(v['takes'][v['pick']], v['who'], len(norm(v['text'])), v.get('med'))[:3] != (0, 0, 0)]
    print(len(res), 'lines picked; needing a look:', bad)

if __name__ == '__main__':
    main()
