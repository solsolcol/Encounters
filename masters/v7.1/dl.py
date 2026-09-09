# usage: python3 masters/v7.1/dl.py <status.json> <id>   -> masters/v7.1/<id>-a.mp3, -b.mp3 ...
import json, sys, subprocess, os
st = json.load(open(sys.argv[1])); id_ = sys.argv[2]
media = st.get('media', [])
out = []
for i, m in enumerate(media):
    url = m.get('master_url') or m.get('url')
    f = f'masters/v7.1/{id_}-{"abcdefgh"[i]}.mp3'
    subprocess.run(['curl', '-sS', '-L', '-o', f, url], check=True)
    out.append((f, os.path.getsize(f), m.get('duration_secs')))
print(id_, [(o[0].split('/')[-1], o[1], o[2]) for o in out])
