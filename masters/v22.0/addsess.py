"""v22.0 · record generation sessions: python3 addsess.py name:sid1,sid2 [name:sid1,sid2 ...]
The prompt comes from script.json, so sessions.json always says what each take was asked to say."""
import json, sys
S = json.load(open('sessions.json')); L = {x[0]: x for x in json.load(open('script.json'))['lines']}
for a in sys.argv[1:]:
    name, sids = a.split(':'); sids = sids.split(',')
    S['_' + name] = L[name][2]
    S[name] = S.get(name, []) + [s for s in sids if s not in S.get(name, [])]
json.dump(S, open('sessions.json', 'w'), indent=1, ensure_ascii=False)
print(len([k for k in S if not k.startswith('_')]), 'names recorded')
