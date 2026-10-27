"""v21.30 · lay every take of every line side by side: the words heard against the words asked for (tags and
punctuation stripped), the ends (head/end level, lead/tail silence), the longest pause between words, the length.
A take ending ON signal (end > -40 dB with tail < 0.05 s) clicks unless faded; a missing or extra word disqualifies."""
import json, re, difflib, sys
S = json.load(open('sessions.json')); T = json.load(open('tr.json')); M = json.load(open('measure.json'))
def words(s):
    s = re.sub(r'\[[^\]]*\]|\([^)]*\)', ' ', s).lower().replace('’', "'")
    s = re.sub(r"[^a-z0-9' ]", ' ', s)
    return [w for w in s.split() if w]
names = [k for k in S if not k.startswith('_')] if len(sys.argv) < 2 else sys.argv[1:]
for name in names:
    want = words(S['_' + name])
    print(f'\n== {name}: {S["_" + name]}')
    letters = 'abcdefgh'
    for i in range(len(S[name])):
        k = f'{name}_{letters[i]}'
        if k not in T or k not in M or not M[k]: print(f'  {k}: (missing)'); continue
        got = words(T[k]['text']); m = M[k]
        sm = difflib.SequenceMatcher(a=want, b=got)
        diff = [f'{op}:{" ".join(want[i1:i2])}>{" ".join(got[j1:j2])}' for op, i1, i2, j1, j2 in sm.get_opcodes() if op != 'equal']
        W = T[k]['words']; gaps = [(W[j + 1][1] - W[j][2], W[j][0]) for j in range(len(W) - 1)]
        mg = max(gaps) if gaps else (0, '')
        endflag = 'ON-SIGNAL' if (m['end'] > -40 and m['tail'] < 0.05) else ''
        headflag = 'HEAD-ON' if (m['head'] > -40 and m['lead'] < 0.03) else ''
        print(f"  {k}: {m['secs']:5.2f}s head{m['head']:6.1f} end{m['end']:6.1f} lead{m['lead']:4.2f} tail{m['tail']:4.2f} "
              f"maxgap {mg[0]:4.2f} after '{mg[1]}' {endflag} {headflag} {'OK' if not diff else 'DIFF ' + ' | '.join(diff)}")
        print(f"      heard: {T[k]['text']}")
