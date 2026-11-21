#!/usr/bin/env python3
"""v28.0 · episode 4 chapter 5's EFFECTS AND MUSIC made through ElevenLabs' own API (the voices' api.py, masters/v28.0/voices,
made for sound). The key lives ONLY at /root/.config/elevenlabs/key on the working machine: never written into this public
repository, printed, or passed on a command line.
    python3 -I masters/v28.0/sound/api.py --balance
    python3 -I masters/v28.0/sound/api.py sfx  <table> [name ...]     every take of sfx<table>.json not yet on disk
    python3 -I masters/v28.0/sound/api.py music <table> [name ...]    every take of music<table>.json not yet on disk
    python3 -I masters/v28.0/sound/api.py stems <file.mp3> <outdir>  six stems of a piece (ElevenLabs' six_stems_v1)
EFFECTS: eleven_text_to_sound_v3 (the newest, v22.4), the length and the loop as the model's own parameters (v9.2), prompt
influence as the row says. MUSIC: music_v2 (the newest the API takes; v1 is the other), instrumental, the length as the
model's own parameter. A take is written to raw/<name>_<letter>.mp3 only when it is whole; a take on disk is never asked
again (v24.3: re-run only what failed, unchanged). Every call's cost, as the service reports it (its `character-cost`
header), goes into spend.log (no key, no address). One call at a time by default (N=2 at most: the account allows two at once, and the voices helper uses it too)."""
import json, os, sys, time, threading, urllib.request, uuid
from concurrent.futures import ThreadPoolExecutor
HERE = os.path.dirname(os.path.abspath(__file__)); RAW = os.environ.get('RAW') or '/tmp/claude-0/-home-user-Encounters/f1062235-ca86-59a9-b000-61422c281293/scratchpad/e4c5/sound/raw'   # takes land in scratch, then move into raw/ with their save
KEY = open('/root/.config/elevenlabs/key', encoding='utf-8').read().strip()
H = {'xi-api-key': KEY}
LOCK = threading.Lock()
LET = 'abcdef'

def balance():
    d = json.load(urllib.request.urlopen(urllib.request.Request('https://api.elevenlabs.io/v1/user/subscription', headers=H), timeout=60))
    return d['character_count'], d['character_limit']

def log(what, cost, secs):
    with LOCK:
        open(os.path.join(HERE, 'spend.log'), 'a').write('%s %s %s %s\n' % (time.strftime('%H:%M:%S'), what, cost, secs))

def post(url, body, out, what, secs, timeout):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={**H, 'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            data = r.read(); cost = r.headers.get('character-cost', '?')
        if len(data) < 1500: raise RuntimeError('a take of %d bytes' % len(data))
        open(out + '.part', 'wb').write(data); os.replace(out + '.part', out)
        log(what, cost, secs); print('ok', what, len(data), 'bytes, cost', cost, flush=True); return True
    except Exception as e:
        msg = str(e)
        if hasattr(e, 'read'):
            try: msg += ' ' + e.read()[:300].decode('utf-8', 'replace')
            except Exception: pass
        print('FAILED', what, msg[:400], flush=True); return False

def sfx_take(o, l):
    out = os.path.join(RAW, f"{o['name']}_{l}.mp3")
    body = {'text': o['prompt'], 'duration_seconds': o['secs'], 'prompt_influence': o.get('influence', 0.4),
            'loop': bool(o['loop']), 'model_id': 'eleven_text_to_sound_v3'}
    return post('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128', body, out, f"{o['name']}_{l}", o['secs'], 200)

def music_take(o, l):
    out = os.path.join(RAW, f"{o['name']}_{l}.mp3")
    body = {'prompt': o['prompt'], 'music_length_ms': int(o['secs'] * 1000), 'model_id': o.get('model', 'music_v2'),
            'force_instrumental': True}
    return post('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_192', body, out, f"{o['name']}_{l}", o['secs'], 600)

def stems(src, outdir):
    b = uuid.uuid4().hex
    data = open(src, 'rb').read()
    body = (f'--{b}\r\nContent-Disposition: form-data; name="stem_variation_id"\r\n\r\nsix_stems_v1\r\n'
            f'--{b}\r\nContent-Disposition: form-data; name="file"; filename="{os.path.basename(src)}"\r\n'
            f'Content-Type: audio/mpeg\r\n\r\n').encode() + data + f'\r\n--{b}--\r\n'.encode()
    req = urllib.request.Request('https://api.elevenlabs.io/v1/music/stem-separation', data=body,
                                 headers={**H, 'Content-Type': f'multipart/form-data; boundary={b}'})
    with urllib.request.urlopen(req, timeout=900) as r:
        z = r.read(); cost = r.headers.get('character-cost', '?'); ct = r.headers.get('content-type', '')
    os.makedirs(outdir, exist_ok=True)
    zp = os.path.join(outdir, 'stems.zip'); open(zp, 'wb').write(z)
    log('stems ' + os.path.basename(src), cost, 0); print('ok stems', len(z), 'bytes', ct, 'cost', cost)

if __name__ == '__main__':
    a = sys.argv[1:]
    if a[:1] == ['--balance']:
        u, l = balance(); print('used %d of %d: %d left' % (u, l, l - u)); sys.exit(0)
    if a[:1] == ['stems']:
        stems(a[1], a[2]); sys.exit(0)
    kind, table, only = a[0], a[1], set(a[2:])
    rows = json.load(open(os.path.join(HERE, f'{kind}{table}.json'), encoding='utf-8'))
    os.makedirs(RAW, exist_ok=True)
    jobs = []
    for o in rows:
        if only and o['name'] not in only: continue
        for i in range(o['takes']):
            l = LET[i]
            f = f"{o['name']}_{l}.mp3"
            if not (os.path.exists(os.path.join(RAW, f)) or os.path.exists(os.path.join(HERE, 'raw', f))): jobs.append((o, l))
    print(len(jobs), 'takes to make', flush=True)
    fn = sfx_take if kind == 'sfx' else music_take
    with ThreadPoolExecutor(int(os.environ.get("N", "1"))) as ex:
        res = list(ex.map(lambda j: fn(*j), jobs))
    print(sum(res), 'made,', len(res) - sum(res), 'failed')
