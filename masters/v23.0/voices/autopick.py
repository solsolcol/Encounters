"""v23.0 CP11b · propose a pick per line from pick.py's measures: the words exactly first (tags, punctuation and
digits-for-words forgiven), then an end that is not ON signal, then the quieter head, then the longer pause where the
script has an ellipsis. Prints the proposal and why; the picks themselves are written into make.sh by hand."""
import json, re, difflib
S = json.load(open('sessions.json')); T = json.load(open('tr.json')); M = json.load(open('measure.json'))
SAME = {('any more',), ('anymore',)}
def words(s):
    s = re.sub(r'\[[^\]]*\]|\([^)]*\)', ' ', s).lower().replace('’', "'")
    s = s.replace('any more', 'anymore').replace('favourite', 'favorite').replace('twenty', '20')
    s = re.sub(r"[^a-z0-9' ]", ' ', s)
    return [w for w in s.split() if w]
out = {}
for name in [k for k in S if not k.startswith('_')]:
    want = words(S['_' + name]); cands = []
    for i in range(len(S[name])):
        k = f"{name}_{'abcdefgh'[i]}"
        if k not in T or not M.get(k): continue
        got = words(T[k]['text']); m = M[k]
        sm = difflib.SequenceMatcher(a=want, b=got); ok = sm.ratio()
        W = T[k]['words']; gaps = [W[j + 1][1] - W[j][2] for j in range(len(W) - 1)]
        endon = m['end'] > -40 and m['tail'] < 0.05; headon = m['head'] > -40 and m['lead'] < 0.03
        cands.append((round(1 - ok, 3), endon, headon, m['head'], -max(gaps or [0]), k, m['secs']))
    cands.sort()
    out[name] = cands
    best = cands[0] if cands else None
    print(f"{name:12s} -> {best[5] if best else '?':16s} words {1-best[0]:.2f} {'END-ON ' if best[1] else ''}{'HEAD-ON ' if best[2] else ''}secs {best[6]}  | others: " + ', '.join(f"{c[5]}({1-c[0]:.2f}{' E' if c[1] else ''})" for c in cands[1:]))
json.dump({k: [c[5] for c in v] for k, v in out.items()}, open('autopick.json', 'w'), indent=1)
