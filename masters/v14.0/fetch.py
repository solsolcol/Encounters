import json, glob, os, re, subprocess, sys
D='/root/.claude/projects/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293/tool-results/'
sess=json.load(open('sessions.json')); flow=sess.pop('flow',None)
# session_id -> (url, duration)
found={}
for f in glob.glob(D+'mcp-ElevenLabs-creative_get_flow_run_status-*.txt'):
    try: j=json.load(open(f))
    except Exception: continue
    for m in j.get('media',[]):
        u=m.get('url') or m.get('master_url') or ''
        mm=re.search(r'/content_generation/([^/]+)/',u)
        if mm: found[mm.group(1)]=(u, m.get('duration_secs'))
print('urls found for', len(found),'sessions')
missing=[]
for name,ids in sess.items():
    for i,sid in enumerate(ids):
        tag='ab'[i]
        out='raw/%s_%s.mp3'%(name,tag)
        if os.path.exists(out) and os.path.getsize(out)>1000: continue
        if sid not in found: missing.append((name,tag,sid)); continue
        u,dur=found[sid]
        r=subprocess.run(['curl','-sS','-o',out,u])
        ok = r.returncode==0 and os.path.exists(out) and os.path.getsize(out)>1000
        print('%-14s %s  %5.2fs  %s'%(name,tag,dur or 0,'ok' if ok else 'FAIL'))
json.dump(missing, open('missing.json','w'), indent=1)
print('\nMISSING URLS:', len(missing))
for n,t,s in missing[:60]: print('  ',n,t,s)
