# v26.0 · are a batch's takes here?  python3 -I masters/v26.0/voices/check.py [<first index> <last index>]
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
P = json.load(open(os.path.join(HERE, 'prompts.json')))
a, b = (int(sys.argv[1]), int(sys.argv[2])) if len(sys.argv) > 2 else (0, len(P) - 1)
bad = 0; n = 0
for o in P[a:b + 1]:
    for i in range(o['takes']):
        f = os.path.join(HERE, 'raw', '%s_%s.mp3' % (o['key'], 'abc'[i])); n += 1
        d = 0.0
        if os.path.exists(f):
            r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', f], capture_output=True, text=True).stdout.strip()
            d = float(r or 0)
        if d < 0.3: bad += 1; print('MISSING' if d == 0 else 'TOO SHORT', os.path.basename(f), d)
print('%d takes wanted in entries %d to %d; %d missing or too short' % (n, a, b, bad))
sys.exit(1 if bad else 0)
