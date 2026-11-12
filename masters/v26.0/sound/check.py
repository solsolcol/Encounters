# v26.0 · are a table's takes here?  python3 -I masters/v26.0/sound/check.py sfx|music
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
rows = json.load(open(os.path.join(HERE, sys.argv[1] + '.json'))); bad = n = 0
for o in rows:
    for i in range(o['takes']):
        f = os.path.join(HERE, 'raw', '%s_%s.mp3' % (o['name'], 'abcd'[i])); n += 1; d = 0.0
        if os.path.exists(f):
            r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', f], capture_output=True, text=True).stdout.strip(); d = float(r or 0)
        if d < 0.2: bad += 1; print('MISSING' if d == 0 else 'TOO SHORT', os.path.basename(f), d)
        elif abs(d - o['secs']) > max(1.5, 0.3 * o['secs']): print('LENGTH', os.path.basename(f), d, 'asked', o['secs'])
print('%d takes wanted; %d missing or too short' % (n, bad)); sys.exit(1 if bad else 0)
