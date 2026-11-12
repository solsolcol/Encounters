# v26.0 · what eleven_v3 is given for each line: masters/v26.0/voices/prompts.json, from lines.py (the words) and
# tags.py (the direction). Run from the repo root:  python3 -I masters/v26.0/script/prompts.py
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
def load(name):
    ns = {}; exec(compile(open(os.path.join(HERE, name), encoding='utf-8').read(), name, 'exec'), ns); return ns
L, T = load('lines.py'), load('tags.py')
keys = [k for k, _, _, _ in L['LINES']]
assert len(set(keys)) == len(keys), 'a key twice'
unknown = [k for k in T['TAGS'] if k not in keys]; assert not unknown, ('tags for no line', unknown)
out = []
for k, who, where, text in L['LINES']:
    assert not re.search(r'\bL\.?P\.?\b', text), ('a title must be spoken in full', k)
    tag = T['TAGS'].get(k)
    out.append({'key': k, 'speaker': who, 'voice_id': T['VOICE'][who], 'takes': T['TAKES'][who], 'prompt': ('[%s] ' % tag if tag else '') + text})
json.dump(out, open(os.path.join(HERE, '..', 'voices', 'prompts.json'), 'w'), indent=1, ensure_ascii=False)
chars = sum(len(o['prompt']) * o['takes'] for o in out)
print(len(out), 'lines;', sum(o['takes'] for o in out), 'takes;', chars, 'characters to be said (about that many credits)')
print('plain:', [o['key'] for o in out if not o['prompt'].startswith('[')])
