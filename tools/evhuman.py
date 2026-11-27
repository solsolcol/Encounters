# evhuman.py <saved list_events file>   (v29.0, 27 Nov 2026, R9) after a session dies, find the OWNER's messages in its
# record: the mcp tool list_events (kinds ["user"], limit 100, paged back by before_id = the page's first_id) saves a
# big page to a file; this prints the page's time range and cursor, and only the events that are not a helper's (no
# agent_id) and not a tool result: the messages a person typed, queued commands, notices. Run with python3 -I.
import json, sys
s = open(sys.argv[1]).read()
i = s.index('{"ccr"'); j = s.rindex('}')
d = json.loads(s[i:j+1])['ccr']
ev = d.get('data', [])
print('PAGE', len(ev), 'events', ev[0].get('created_at') if ev else None, '->', ev[-1].get('created_at') if ev else None,
      '| first_id', d.get('first_id'), '| has_more', d.get('has_more'))
for e in ev:
    t = e.get('created_at')
    for k, v in e.items():
        if k == 'created_at' or not isinstance(v, dict): continue
        inner = v.get('internal_anthropic_catchall', v)
        if not isinstance(inner, dict) or inner.get('agent_id'): continue
        msg = inner.get('message')
        blocks = []
        if isinstance(msg, dict):
            c = msg.get('content')
            if isinstance(c, str): blocks.append(('str', c))
            elif isinstance(c, list):
                for b in c:
                    if isinstance(b, dict): blocks.append((b.get('type'), b.get('text') if b.get('type') == 'text' else ''))
        if blocks and all(bt == 'tool_result' for bt, _ in blocks): continue
        print('==', t, k, [bt for bt, _ in blocks] or 'no-message', {kk: str(vv)[:300] for kk, vv in inner.items() if kk not in ('message', 'uuid')})
        for bt, tx in blocks:
            if tx: print('   TEXT:', tx[:3000].replace('\n', ' / '))
