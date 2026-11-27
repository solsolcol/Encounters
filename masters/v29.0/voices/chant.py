#!/usr/bin/env python3
"""v29.0 · THE TWO CHANTS measured and one take picked (plan 11.6), and, once chained, their captions timed on the take's
own breaths.
    python3 -I masters/v29.0/voices/chant.py            every take in raw/ measured; chants.json (the picks)
    python3 -I masters/v29.0/voices/chant.py --times    the CHAINED files (assets/audio-opus/<key>.ogg) read for each
                                                        verse's start and end -> chants.json `times`
A session has no ears (v10.4): the measure SCREENS. For each take: its length; its BREATHS (20 ms frames over the peak
- 32 dB, gaps under 0.35 s inside a phrase); each verse is to be one breath, so the verse boundaries are the take's
longest silences, as many as it has verses less one, and a take is WHOLE when it has at least that many and the verses
they make carry words in proportion (no verse under half or over twice its share of the chant's syllables' time);
CHANTED, NOT SAID OR SUNG: how intoned it is, the spread of its pitch (10th to 90th percentile in semitones: a spoken
line of his is 9 to 10, v25.5's chosen Om Namah Shivaya 5.3; a sung take would leap between held notes, so a held
note longer than 1.2 s is counted too); its END (silent under -45 dBFS, or its last 60 ms 12 dB under its voice); what
an UNPROMPTED transcriber writes from it (faster-whisper small, multilingual, no prompt: v21.12, a prompt leans the
transcript to the words checked) phrase by phrase, so a take that speaks English or another tongue is seen.
THE PICK: whole and clean first, then the pace nearest the row's own (lines.json `pace`, 1.4 words a second)."""
import json, os, re, subprocess, sys
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
RAW = os.path.join(HERE, 'raw'); SR = 16000
S = json.load(open(os.path.join(HERE, '..', 'script', 'lines.json'), encoding='utf-8')); ROWS = {r['key']: r for r in S['lines']}
CH = [r['key'] for r in S['lines'] if r.get('chant')]
OUT = os.path.join(HERE, 'chants.json')

def pcm(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(np.float64)
def frames(x, w=320): return 20 * np.log10(np.maximum(np.array([np.sqrt(np.mean(x[i:i + w] ** 2)) for i in range(0, len(x) - w, w)]), 1e-9))
def phrases(x):
    d = frames(x); on = d > d.max() - 32; segs = []; s = None
    for i, v in enumerate(on):
        if v and s is None: s = i
        if not v and s is not None: segs.append([s, i]); s = None
    if s is not None: segs.append([s, len(on)])
    m = []
    for a, b in segs:
        if m and (a - m[-1][1]) * 0.02 < 0.35: m[-1][1] = b
        else: m.append([a, b])
    return [(round(a * 0.02, 2), round(b * 0.02, 2)) for a, b in m]
def verses(x, n, weights):
    """the verse boundaries are the take's breaths: of its silences of 0.2 s and more (20 ms frames under the peak - 32
    dB), the n-1 that are longest, each weighed against where its verse should end were the chant's syllables evenly
    paced (a breath far from there costs 0.05 of its length a second away: v4 sometimes breathes after a verse's first
    half-line, and runs two verses on one breath with only a catch between them). Answers the verses' [start, end] and
    whether they are in proportion (none under half or over twice its share)."""
    d = frames(x); on = d > d.max() - 32; idx = np.where(on)[0]
    v0, v1 = idx[0], idx[-1] + 1; gaps = []; s = None
    for i in range(v0, v1):
        if not on[i] and s is None: s = i
        if on[i] and s is not None:
            if (i - s) * 0.02 >= 0.2: gaps.append((s * 0.02, i * 0.02))
            s = None
    if len(gaps) < n - 1: return None
    t0, t1 = v0 * 0.02, v1 * 0.02; cum = np.cumsum(weights)[:-1] / sum(weights); want = t0 + cum * (t1 - t0)
    from itertools import combinations
    best = max(combinations(range(len(gaps)), n - 1), key=lambda cs: sum(gaps[c][1] - gaps[c][0] for c in cs) - 0.05 * sum(abs((gaps[c][0] + gaps[c][1]) / 2 - w) for c, w in zip(cs, want)))
    out = []; a = t0
    for c in best: out.append((round(a, 2), round(gaps[c][0], 2))); a = gaps[c][1]
    out.append((round(a, 2), round(t1, 2)))
    dur = np.array([b - a for a, b in out]); share = np.array(weights) / sum(weights) * dur.sum()
    return out, bool(np.all(dur > 0.5 * share) and np.all(dur < 2 * share))
def f0(fr):
    fr = fr - fr.mean(); ac = np.correlate(fr, fr, 'full')[len(fr) - 1:]
    if ac[0] < 1e-6: return None
    lo, hi = int(SR / 300), int(SR / 65); i = lo + int(np.argmax(ac[lo:hi]))
    return SR / i if ac[i] / ac[0] > 0.5 else None
def pitch(x):
    pk = np.max(np.abs(x)); out = []
    for i in range(0, len(x) - 640, 320):
        fr = x[i:i + 640]
        if np.sqrt(np.mean(fr ** 2)) < pk * 0.05: out.append(None); continue
        out.append(f0(fr))
    v = np.array([f for f in out if f]); st = 12 * np.log2(v / np.median(v))
    # a held note: 1.2 s or more of voiced frames within half a semitone of one another
    held, run, ref = 0.0, 0, None
    for f in out:
        if f and ref and abs(12 * np.log2(f / ref)) < 0.5: run += 1
        else:
            held = max(held, run * 0.02); run = 0; ref = f
    return round(float(np.median(v)), 1), round(float(np.percentile(st, 90) - np.percentile(st, 10)), 1), round(max(held, run * 0.02), 2)
def end(x):
    d = frames(x); t = d[-3:].mean(); p90 = float(np.percentile(d, 90))
    return round(float(t), 1), bool(t <= -45 or t - p90 <= -12)
def syll(s): return max(1, len(re.findall(r'[aeiouāīū]+', s.lower())))
_m = None
def heard(x, ph):
    global _m
    if _m is None:
        from faster_whisper import WhisperModel
        _m = WhisperModel('small', device='cpu', compute_type='int8')
    out = []
    for a, b in ph:
        segs, info = _m.transcribe(x[int(a * SR):int(b * SR)].astype(np.float32), beam_size=5, vad_filter=False)
        out.append('[%s] %s' % (info.language, ' '.join(s.text.strip() for s in segs)))
    return out

if __name__ == '__main__':
    res = json.load(open(OUT, encoding='utf-8')) if os.path.exists(OUT) else {}
    if '--times' in sys.argv:
        for k in CH:
            x = pcm(os.path.join(ROOT, 'assets', 'audio-opus', k + '.ogg')); n = len(ROWS[k]['captions'])
            v, ok = verses(x, n, [syll(p) for p, _ in ROWS[k]['captions']])
            res[k]['times'] = [[round(a, 2), round(b, 2)] for a, b in v]; res[k]['times_ok'] = ok; res[k]['final_len'] = round(len(x) / SR, 2)
            print(k, 'final %.2f s' % (len(x) / SR), 'verses', res[k]['times'], 'in proportion' if ok else 'OUT OF PROPORTION')
        open(OUT, 'w', encoding='utf-8').write(json.dumps(res, indent=1, ensure_ascii=False)); sys.exit(0)
    for k in CH:
        r = ROWS[k]; n = len(r['captions']); wts = [syll(p) for p, _ in r['captions']]; words = len(r['text'].split())
        takes = {}
        for l in 'abcdefghij':
            p = os.path.join(RAW, '%s_%s.mp3' % (k, l))
            if not os.path.exists(p): continue
            x = pcm(p); ph = phrases(x); vv = verses(x, n, wts); med, spread, hold = pitch(x); tdb, clean = end(x)
            e0, e1 = ph[0][0], ph[-1][1]
            takes[l] = dict(len=round(len(x) / SR, 2), e_first=e0, e_last=e1, phrases=ph, verses=vv[0] if vv else None,
                            whole=bool(vv and vv[1]), pitch=med, spread=spread, held=hold, tail_db=tdb, clean_end=clean,
                            wps=round(words / max(0.25, e1 - e0), 2), hole=0.0,
                            heard=res[k]['takes'][l]['heard'] if l in res.get(k, {}).get('takes', {}) else heard(x, ph))   # (heard once: its words kept)
            t = takes[l]
            print('%s %s  %.2f s  %d phrases  verses %s  whole %s  pitch %.0f Hz spread %.1f st held %.2f s  end %.1f %s  %.2f w/s' % (
                k, l, t['len'], len(ph), t['verses'], t['whole'], med, spread, hold, tdb, 'clean' if clean else 'ON SIGNAL', t['wps']))
            for h in t['heard']: print('      ', h[:110])
        pace = float(r.get('pace', 1.4))
        sc = {l: (0 if (t['whole'] and t['clean_end'] and t['held'] < 1.2) else 1, abs(t['wps'] - pace)) for l, t in takes.items()}
        pick = min(sc, key=lambda l: sc[l])
        why = 'whole, clean, chanted; the pace nearest %.1f words a second' % pace if sc[pick][0] == 0 else 'NONE WHOLE AND CLEAN: the least bad'
        res[k] = dict(who='ph', pick=pick, why=why, takes=takes)
        print(k, 'PICK', pick, why)
    open(OUT, 'w', encoding='utf-8').write(json.dumps(res, indent=1, ensure_ascii=False))
