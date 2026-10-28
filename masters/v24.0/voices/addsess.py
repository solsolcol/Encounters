"""add a line's sessions to sessions.json: python3 addsess.py name sid sid [note]"""
import json, sys
d = json.load(open('sessions.json'))
name, sids = sys.argv[1], [s for s in sys.argv[2:] if len(s) == 20]
note = ' '.join(s for s in sys.argv[2:] if len(s) != 20)
d[name] = sids
if note: d['_' + name] = note
json.dump(d, open('sessions.json', 'w'), indent=1, ensure_ascii=False)
