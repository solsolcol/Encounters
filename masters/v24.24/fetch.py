"""v16.0 · pull finished ElevenLabs takes down by SESSION id.
The status results (with signed media URLs, valid 2 h) are in this session's
transcript JSONL; every URL names its session: .../content_generation/<session>/<generation>/content.mp3
sessions.json maps a take name -> [session ids]; each session may hold several
generations, saved as raw/<name>_<a|b|c|d>.<ext> in the order they appear.
Usage: python3 fetch.py [name ...]   (default: every name not yet on disk)"""
import json, glob, os, re, subprocess, sys
T = sorted(glob.glob('/root/.claude/projects/-home-user-Encounters/*.jsonl') + glob.glob('/root/.claude/projects/-home-user-Encounters/*/tool-results/*.txt'), key=os.path.getmtime)
urls = {}   # session -> {gen: url}
pat = re.compile(r'https://storage\.googleapis\.com/[^"\\\s]*?/content_generation/([A-Za-z0-9]+)/([A-Za-z0-9]+)/content\.(mp3|wav|mp4)\?[^"\\\s]*')
for f in T:
    with open(f, errors='ignore') as h:
        for line in h:
            for m in pat.finditer(line.replace('\\u0026', '&')):
                urls.setdefault(m.group(1), {})[m.group(2)] = (m.group(0), m.group(3))
sess = json.load(open('sessions.json'))
want = sys.argv[1:] or list(sess)
missing = []
for name in want:
    # v18.6: a letter belongs to the SESSION'S PLACE in the list, so a take
    # that arrives late cannot shift its sibling's letter (z2C1 and z2arrive
    # were each fetched twice under both names when the first was still pending)
    letters = 'abcdefghijklmnop'
    for si, sid in enumerate(sess[name]):
        gens = urls.get(sid)
        if not gens: missing.append((name, sid)); continue
        for gi, (gen, (u, ext)) in enumerate(gens.items()):
            out = f'raw/{name}_{letters[si] if len(gens) == 1 else letters[si] + str(gi)}.{ext}'
            if os.path.exists(out) and os.path.getsize(out) > 1000: continue
            r = subprocess.run(['curl', '-sS', '--fail', '-o', out, u])
            print(f'{out}  {"ok" if r.returncode == 0 else "FAIL"}')
print('missing sessions:', missing)
