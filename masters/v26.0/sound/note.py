# v26.0 · a worker's record of what it started (ids only: never an address):
#   python3 -I masters/v26.0/sound/note.py <table> flow <flow_id>
#   python3 -I masters/v26.0/sound/note.py <table> <name> node <node_id>
#   python3 -I masters/v26.0/sound/note.py <table> <name> <session_id> [<session_id> ...]
# <table> is sfx or music (sound/sfx.json, sound/music.json); the record is sound/sessions-<table>.json
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
table, what, ids = sys.argv[1], sys.argv[2], sys.argv[3:]
assert table in ('sfx', 'sfx2', 'music')
p = os.path.join(HERE, 'sessions-%s.json' % table)
d = json.load(open(p)) if os.path.exists(p) else {'flow': None, 'nodes': {}, 'sounds': {}}
rows = {o['name']: o for o in json.load(open(os.path.join(HERE, table + '.json')))}
assert all(len(i) >= 8 and '/' not in i and '?' not in i for i in (ids[1:] if ids and ids[0] == 'node' else ids)), 'ids only'   # (the word `node` is not an id: the first worker met this)
if what == 'flow': d['flow'] = ids[0]
else:
    assert what in rows, 'no such sound: ' + what
    if ids[0] == 'node': d['nodes'][what] = ids[1]
    else:
        assert len(ids) == rows[what]['takes'], '%s wants %d session ids, got %d' % (what, rows[what]['takes'], len(ids))
        d['sounds'][what] = ids
json.dump(d, open(p, 'w'), indent=1); print('noted', what, '|', len(d['nodes']), 'nodes,', len(d['sounds']), 'sounds in', os.path.basename(p))
