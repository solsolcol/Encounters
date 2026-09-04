# verifytabs — the check every published sheet gets (v6.1).
#
#   python3 tools/verifytabs.py gametext-vNN.xlsx readback.md
#
# `gametext-vNN.xlsx` is what `node textsync.mjs export gametext-vNN.xlsx`
# wrote and the Drive connector uploaded (as base64, xlsx MIME type) for Drive
# to convert into a tabbed Google Sheet. `readback.md` is the connector's
# `read_file_content` output on the new sheet, saved whole: one markdown
# table per tab, blank line between tables. Every cell of every tab is
# compared — text after undoing the connector's backslash escapes, numbers
# by value — and the last line says how many differ. Anything but
# "mismatched cells: 0" is a transcription slip of the session's or a
# conversion fault of Drive's, and either way the link does not go to Chad.
import sys, re, zipfile, xml.etree.ElementTree as ET
xlsx, md = sys.argv[1], sys.argv[2]
NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
def col_idx(ref):
    letters = re.match(r'[A-Z]+', ref).group(0); n = 0
    for ch in letters: n = n * 26 + (ord(ch) - 64)
    return n - 1
z = zipfile.ZipFile(xlsx)
wb = ET.fromstring(z.read('xl/workbook.xml'))
names = [s.get('name') for s in wb.find('m:sheets', NS)]
tabs = []
for i, name in enumerate(names, 1):
    root = ET.fromstring(z.read(f'xl/worksheets/sheet{i}.xml'))
    rows = []
    for row in root.find('m:sheetData', NS):
        cells = {}
        for c in row:
            idx = col_idx(c.get('r'))
            if c.get('t') == 'inlineStr': cells[idx] = ('s', c.find('m:is/m:t', NS).text or '')
            else:
                v = c.find('m:v', NS); cells[idx] = ('n', v.text if v is not None else '')
        w = max(cells) + 1 if cells else 0
        rows.append([cells.get(k, ('s', '')) for k in range(w)])
    tabs.append((name, rows))
def unesc(s): return re.sub(r'\\([<>&!\[\]|*_`~#"\'()+.-])', r'\1', s)
mdtabs, cur = [], []
for line in open(md, encoding='utf-8').read().split('\n'):
    t = line.strip()
    if not t.startswith('|'):
        if cur: mdtabs.append(cur); cur = []
        continue
    cells = [c.strip() for c in t[1:-1].split(' | ')] if t.startswith('| ') else [c.strip() for c in t[1:-1].split('|')]
    if all(re.fullmatch(r':?-+:?', c) or c == '' for c in cells): continue
    cur.append([unesc(c) for c in cells])
if cur: mdtabs.append(cur)
print('xlsx tabs:', [(n, len(r)) for n, r in tabs]); print('md tables:', [len(t) for t in mdtabs])
bad = 0
if len(tabs) != len(mdtabs): print('TAB COUNT DIFFERS'); bad += 1
for (name, xr), mr in zip(tabs, mdtabs):
    if len(xr) != len(mr): print(f'{name}: ROW COUNT {len(xr)} vs {len(mr)}'); bad += 1
    for i, (a, b) in enumerate(zip(xr, mr)):
        # the read-back pads every row to the table's width; the xlsx drops trailing empty cells
        b = list(b) + [''] * (len(a) - len(b))
        for j, (kind, av) in enumerate(a):
            bv = b[j] if j < len(b) else ''
            if kind == 'n':
                try: ok = abs(float(av) - float(bv)) < 1e-9
                except ValueError: ok = False
            else: ok = av.strip() == bv.strip()
            if not ok:
                bad += 1
                if bad <= 12: print(f'DIFF {name} row {i+1} col {j+1}: xlsx={av!r} md={bv!r}')
print('mismatched cells:', bad)
