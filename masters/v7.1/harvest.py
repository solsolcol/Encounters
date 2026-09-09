# Harvest every media URL out of the saved status files (the MCP tool writes a
# large result to disk) and download each take as masters/v7.1/<id>-<a|b>.mp3,
# mapping session -> id through sessions.json. Idempotent: skips files present.
import json, glob, re, subprocess, os, sys
S = json.load(open('masters/v7.1/sessions.json'))
sess2id = {}
for group in ('lines', 'sfx', 'music'):
    for id_, sids in S.get(group, {}).items():
        for k, sid in enumerate(sids): sess2id[sid] = (id_, 'ab'[k])
files = glob.glob('/root/.claude/projects/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293/tool-results/mcp-ElevenLabs-creative_get_flow_run_status-*.txt')
seen, pending, failed = {}, [], []
for f in files:
    try: st = json.load(open(f))
    except Exception as e: print('skip', f, e); continue
    for m in st.get('media', []):
        url = m.get('master_url') or m.get('url')
        mm = re.search(r'/content_generation/([A-Za-z0-9]+)/([A-Za-z0-9]+)/content', url)
        if not mm: continue
        sid = mm.group(1)
        if sid in sess2id: seen[sid] = (url, m.get('duration_secs'))
    for g in st.get('generations', []):
        if g.get('status') not in ('completed',): pending.append(g.get('status'))
# a status result small enough to come back inline never reaches a file, but
# it does reach the session transcript — scan that for the same URLs
TR = '/root/.claude/projects/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293.jsonl'
for mm in re.finditer(r'https://storage\.googleapis\.com/xi-backend/[^"\\\s]*?/content_generation/([A-Za-z0-9]+)/[A-Za-z0-9]+/content\.mp3\?[^"\\\s]+', open(TR, encoding='utf8', errors='ignore').read()):
    sid = mm.group(1)
    if sid in sess2id and sid not in seen: seen[sid] = (mm.group(0), None)
out = []
for sid, (id_, take) in sess2id.items():
    dst = f'masters/v7.1/{id_}-{take}.mp3'
    if sid not in seen: failed.append(f'{id_}-{take}'); continue
    if not os.path.exists(dst):
        subprocess.run(['curl', '-sS', '-L', '-o', dst, seen[sid][0]], check=True)
    out.append((id_, take, os.path.getsize(dst), seen[sid][1]))
have = sorted(set(o[0] for o in out))
print(f'{len(out)} takes on disk for {len(have)} ids; not yet collected: {sorted(set(failed))}; non-completed statuses seen: {set(pending)}')
