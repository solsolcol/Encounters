"""v24.0 CP11b · propose a take per line (v23.0's autopick, with Thai): the words first (English by word, Thai by
character — whisper's Thai is rough, so it ranks two takes of the same line, never judges one alone), then an end
that is not ON signal, then the quieter head, then the longer pause where the script has an ellipsis; a take much
longer or shorter than its sibling is flagged (a stall, a repeat, a cut). Writes picks.json; the picks are read by
make.sh. Overrides (a listened-for reason) go in OVERRIDE with the reason."""
import json, re, difflib, sys
sys.path.insert(0, '../script'); from lines import L
T = json.load(open('tr.json')); M = json.load(open('measure.json'))
WIN = {'fm1good': 'patinya', 'pg1car': 'zie', 'pn1num': 'kanya', 'jy1a': 'hammy', 'sb1a': 'songkran', 'lm1a': 'brandon', 'tx1where': 'kopio'}
OVERRIDE = {
  'pn1num': ('pn1num_kanya_b', 'CP11a: take b says "Number fourteen" exactly; a says "fourteen" alone'),
  'tx1where': ('tx1where_kopio_a', 'CP11a: take a has the words exactly'),
}
TH = re.compile('[฀-๿]')
def en(s):
    s = re.sub(r'\[[^\]]*\]', ' ', s).lower().replace('’', "'").replace('—', ' ')
    s = re.sub(r"[^a-z0-9' ]", ' ', s); return [w for w in s.split() if w]
def th(s): return ''.join(TH.findall(re.sub(r'\[[^\]]*\]', ' ', s)))
out = {}; rows = []
for lid, who, where, text in L:
    stem = lid + ('_' + WIN[lid] if lid in WIN else '')
    thai = bool(TH.search(text)); cands = []
    for L2 in 'ab':
        k = f'{stem}_{L2}'
        if k not in T or not M.get(k): continue
        m = M[k]
        if thai:
            a, b = th(text), th(T[k]['text']); ok = difflib.SequenceMatcher(a=a, b=b).ratio() if a else 0
            ea, eb = en(re.sub('[฀-๿]+', ' ', text)), en(T[k]['text'])
            if ea: ok = 0.6 * ok + 0.4 * difflib.SequenceMatcher(a=ea, b=eb).ratio()
        else:
            ok = difflib.SequenceMatcher(a=en(text), b=en(T[k]['text'])).ratio()
        W = T[k]['words']; gaps = [W[j + 1][1] - W[j][2] for j in range(len(W) - 1)]
        endon = m['end'] > -40 and m['tail'] < 0.05; headon = m['head'] > -40 and m['lead'] < 0.03
        cands.append(dict(k=k, words=round(ok, 3), endon=endon, headon=headon, head=m['head'], gap=round(max(gaps or [0]), 2), secs=m['secs'], rms=m['rms'], peak=m['peak'], tr=T[k]['text']))
    if len(cands) == 2:
        r = cands[0]['secs'] / max(0.01, cands[1]['secs'])
        for c in cands: c['odd'] = r > 1.35 or r < 1 / 1.35
    key = lambda c: (-round(c['words'], 1), c['endon'], c['headon'], c['head'])
    cands.sort(key=key)
    pick, why = (OVERRIDE[lid] if lid in OVERRIDE else (cands[0]['k'], 'auto'))
    out[lid] = dict(who=who, pick=pick, why=why, cands=cands)
    best = next(c for c in cands if c['k'] == pick)
    other = [c for c in cands if c['k'] != pick]
    o = other[0] if other else None
    flag = ('END-ON ' if best['endon'] else '') + ('HEAD-ON ' if best['headon'] else '') + ('ODD-LEN ' if best.get('odd') else '') + ('LOW-WORDS ' if best['words'] < (0.6 if thai else 0.85) else '')
    rows.append(f"{lid:10s} {who:10s} -> {pick[-1]} w{best['words']:.2f} {best['secs']:5.2f}s {flag}| other w{o['words']:.2f} {o['secs']:5.2f}s{' E' if o['endon'] else ''} || {best['tr'][:70]}" if o else f"{lid} {pick}")
json.dump(out, open('picks.json', 'w'), indent=1, ensure_ascii=False)
print('\n'.join(rows))
