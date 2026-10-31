# Prove the split lost nothing: every non-blank line of the old CLAUDE.md is found, IN ORDER, either in the new
# CLAUDE.md or in docs/HISTORY.md's main body (the releases and the sheet), or verbatim in HISTORY.md's
# "Lines reworded in the move". Also: the moved blocks are byte-identical to what they were.
# Usage: python3 -I verify.py <old CLAUDE.md> <new CLAUDE.md> <HISTORY.md>
import sys, hashlib

old, newc, hist = (open(p, encoding='utf-8').read().split('\n') for p in sys.argv[1:4])

cut = next(i for i, l in enumerate(hist) if l == '## Lines reworded in the move')
hmain, happ = hist[:cut], set(hist[cut:])

ci = hi = 0
from_c = from_h = from_app = 0
missing = []
for n, line in enumerate(old, 1):
    if not line.strip():
        continue
    # prefer the file whose pointer finds it soonest, so neither pointer jumps over lines it still needs
    jc = next((j for j in range(ci, len(newc)) if newc[j] == line), None)
    jh = next((j for j in range(hi, len(hmain)) if hmain[j] == line), None)
    if jc is not None and (jh is None or (jc - ci) <= (jh - hi)):
        ci = jc + 1; from_c += 1
    elif jh is not None:
        hi = jh + 1; from_h += 1
    elif line in happ:
        from_app += 1
    else:
        missing.append((n, line))

print(f'old non-blank lines: {from_c + from_h + from_app + len(missing)}')
print(f'  found in order in the new CLAUDE.md: {from_c}')
print(f'  found in order in HISTORY.md:        {from_h}')
print(f'  kept as old wording in the appendix: {from_app}')
print(f'  MISSING:                             {len(missing)}')
for n, l in missing[:20]:
    print(f'    line {n}: {l[:140]}')

# the two moved blocks, byte for byte
def block(lines, start, stop):
    a = next(i for i, l in enumerate(lines) if l.startswith(start))
    b = next(i for i in range(a + 1, len(lines)) if lines[i].startswith(stop))
    seg = lines[a:b]
    while seg and seg[-1] == '':
        seg.pop()
    return '\n'.join(seg)

d_old = block(old, 'What the baseline contains, by release:', 'The anchors for that baseline')
d_new = block(hist, 'What the baseline contains, by release:', '## The sheet, version by version')
s_old = block(old, '**THE SHEET IS v132**', '`docs/LEARNINGS.md` is the catalog')
s_new = block(hist, '**THE SHEET IS v132**', '## Lines reworded in the move')
h = lambda s: hashlib.sha1(s.encode('utf-8')).hexdigest()[:16]
# releases after the move (v24.24 on) are appended at the end, so the old diary must be the new one's BEGINNING, byte for
# byte, and whatever follows it must be whole release entries only
tail = d_new[len(d_old):]
diary_ok = d_new.startswith(d_old) and all(not l.strip() or l.startswith('- **v') or l.startswith('  ') for l in tail.split('\n'))
added = [l.split('**')[1] for l in tail.split('\n') if l.startswith('- **v')]
print('diary  kept:', diary_ok, h(d_old), f'{len(d_old.encode())} bytes; entries added after it:', added or 'none')
print('sheets identical:', s_old == s_new, h(s_old), h(s_new), f'{len(s_old.encode())} bytes')
entries = lambda s: sum(1 for l in s.split('\n') if l.startswith('- **v'))
print('version entries old/new:', entries(d_old), entries(d_new))
ok = not missing and diary_ok and s_old == s_new
print('RESULT:', 'NOTHING LOST' if ok else 'FAILED')
sys.exit(0 if ok else 1)
