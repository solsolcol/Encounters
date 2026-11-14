# sheetcmp — every cell of a published Google Sheet against the workbook it was made from (v26.12, 14 Nov 2026).
#
#   python3 -I tools/sheetcmp.py <workbook.xlsx> [--transcript <session.jsonl>] ["<TAB>=<values.json>" ...]
#
# Each <values.json> is the Google Sheets connector's get_values answer for one tab ({range, values}), as the harness
# saves a large one to a file. A small answer is shown inline and never saved: --transcript reads it back out of the
# session's own record (the tool result whose range is "'<TAB>'!A1:Z1000"), so nothing is ever retyped. Text is compared
# exactly; numbers by value (the sheet answers formatted strings). get_values leaves out trailing empty cells and rows,
# so both sides are padded. The last line must say "mismatched cells: 0" before the link goes to Chad.
import json, re, sys, zipfile, xml.etree.ElementTree as ET
args = sys.argv[1:]
if not args: sys.exit(__doc__ or 'usage: sheetcmp.py <workbook.xlsx> [--transcript <jsonl>] ["TAB=values.json" ...]')
xlsx = args.pop(0); transcript = None; files = {}
while args:
    a = args.pop(0)
    if a == '--transcript': transcript = args.pop(0)
    else: k, v = a.split('=', 1); files[k] = v
NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
def col_idx(ref):
    n = 0
    for ch in re.match(r'[A-Z]+', ref).group(0): n = n * 26 + (ord(ch) - 64)
    return n - 1
z = zipfile.ZipFile(xlsx)
names = [s.get('name') for s in ET.fromstring(z.read('xl/workbook.xml')).find('m:sheets', NS)]
book = {}
for i, name in enumerate(names, 1):
    rows = []
    for row in ET.fromstring(z.read(f'xl/worksheets/sheet{i}.xml')).find('m:sheetData', NS):
        cells = {}
        for c in row:
            if c.get('t') == 'inlineStr':
                t = c.find('m:is/m:t', NS); cells[col_idx(c.get('r'))] = ('s', (t.text if t is not None else '') or '')
            else:
                v = c.find('m:v', NS); cells[col_idx(c.get('r'))] = ('n', v.text if v is not None else '')
        rows.append([cells.get(k, ('s', '')) for k in range(max(cells) + 1 if cells else 0)])
    book[name] = rows
back = {name: json.load(open(path))['values'] for name, path in files.items()}
if transcript:
    want = {f"'{n}'!A1:Z1000": n for n in names if n not in back}
    with open(transcript) as fh:
        for line in fh:
            if '"range":' not in line: continue
            try: r = json.loads(line)
            except Exception: continue
            if r.get('type') != 'user': continue
            for b in (r.get('message') or {}).get('content') or []:
                if not isinstance(b, dict) or b.get('type') != 'tool_result': continue
                cc = b.get('content'); txt = (cc if isinstance(cc, str) else ''.join(x.get('text', '') for x in (cc or []) if isinstance(x, dict))).strip()
                if not txt.startswith('{"range":'): continue
                try: d = json.loads(txt)
                except Exception: continue
                if d.get('range') in want: back[want[d['range']]] = d['values']
missing = [n for n in names if n not in back]
if missing: print('NOT READ BACK:', missing)
def same(cell, got):
    kind, v = cell
    if kind == 's': return v == got
    if v == '' and got == '': return True
    try: return abs(float(v) - float(got.replace(',', ''))) < 1e-9
    except Exception: return False
bad = total = 0
for name in names:
    if name not in back: continue
    rows, got = book[name], back[name]
    for i in range(max(len(rows), len(got))):
        a = rows[i] if i < len(rows) else []; b = got[i] if i < len(got) else []
        for j in range(max(len(a), len(b))):
            total += 1
            ca = a[j] if j < len(a) else ('s', ''); cb = b[j] if j < len(b) else ''
            if not same(ca, cb):
                bad += 1
                if bad <= 20: print('DIFF', name, 'row', i + 1, 'col', j + 1, repr(ca[1])[:120], '|', repr(cb)[:120])
    print(f'{name}: {len(rows)} rows in the workbook, {len(got)} read back')
print('cells compared:', total, '| mismatched cells:', bad + (1 if missing else 0))
sys.exit(1 if (bad or missing) else 0)
