"""v23.0 CP11 · map each effect to its generation sessions by reading the run results in this session's transcript:
every creative_run_flow_nodes result lists {"node_id": ..., "session_id": ...} pairs; nodes.json names each node.
Writes sessions.json (name -> [session ids], in the order they started), keeping what is already there."""
import json, glob, os, re
T = sorted(glob.glob('/root/.claude/projects/-home-user-Encounters/*.jsonl') + glob.glob('/root/.claude/projects/-home-user-Encounters/*/tool-results/*.txt'), key=os.path.getmtime)
nodes = json.load(open('nodes.json')); byid = {v: k for k, v in nodes.items()}
S = json.load(open('sessions.json'))
pat = re.compile(r'\\*"node_id\\*"\s*:\s*\\*"([A-Za-z0-9]{20})\\*"\s*,\s*\\*"session_id\\*"\s*:\s*\\*"([A-Za-z0-9]{20})\\*"')
for f in T:
    with open(f, errors='ignore') as h:
        for line in h:
            for m in pat.finditer(line):
                n, s = m.group(1), m.group(2)
                if n in byid:
                    name = byid[n]; S.setdefault(name, [])
                    if s not in S[name]: S[name].append(s)
json.dump(S, open('sessions.json', 'w'), indent=1)
done = {k: len(v) for k, v in S.items() if not k.startswith('_')}
print(len(done), 'effects with sessions;', sum(done.values()), 'sessions;', 'missing:', [k for k in nodes if k not in done])
