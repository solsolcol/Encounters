# v26.0 · a worker's record of what it started (ids only: never an address):
#   python3 -I masters/v26.0/voices/note.py <n> flow <flow_id>
#   python3 -I masters/v26.0/voices/note.py <n> <key> <session_id> <session_id> [<session_id>]
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
n, what, ids = sys.argv[1], sys.argv[2], sys.argv[3:]
p = os.path.join(HERE, 'sessions-%s.json' % n)
d = json.load(open(p)) if os.path.exists(p) else {'flow': None, 'lines': {}}
keys = {o['key']: o for o in json.load(open(os.path.join(HERE, 'prompts.json')))}
if what == 'flow': d['flow'] = ids[0]
else:
    assert what in keys, 'no such line: ' + what
    assert len(ids) == keys[what]['takes'], '%s wants %d session ids, got %d' % (what, keys[what]['takes'], len(ids))
    assert all(len(i) >= 16 and '/' not in i and '?' not in i for i in ids), 'ids only'
    d['lines'][what] = ids
json.dump(d, open(p, 'w'), indent=1); print('noted', what, len(d['lines']), 'lines in', os.path.basename(p))
