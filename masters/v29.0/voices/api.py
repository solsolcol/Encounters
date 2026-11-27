#!/usr/bin/env python3
"""v29.0 · episode 5 chapter 1's takes made through ElevenLabs' own API (chapter 5's api.py, masters/v28.0/voices, made this
chapter's: the model is the prompt's own, eleven_v3 for a line and eleven_v4 for a chant; two calls at once at most).
The key lives ONLY at /root/.config/elevenlabs/key on the working machine: never written into this public repository,
printed, or passed on a command line.
    python3 -I masters/v29.0/voices/api.py --balance
    python3 -I masters/v29.0/voices/api.py <key> <letter> [<key> <letter> ...]
    python3 -I masters/v29.0/voices/api.py --all            every take prompts.json asks for that is not on disk
A take is written to raw/<key>_<letter>.mp3 (128 kbps, 44.1 kHz) only when whole; a take on disk is never asked again
(v24.3: re-run only what failed, unchanged). It stops before a batch when the balance is under the floor (12,000).
Every call's characters go into spend.log (no key, no address)."""
import json, os, sys, time, threading, urllib.request
from concurrent.futures import ThreadPoolExecutor
HERE = os.path.dirname(os.path.abspath(__file__)); RAW = os.path.join(HERE, 'raw')
KEY = open('/root/.config/elevenlabs/key', encoding='utf-8').read().strip()
H = {'xi-api-key': KEY}; LOCK = threading.Lock(); FLOOR = 12000

def balance():
    d = json.load(urllib.request.urlopen(urllib.request.Request('https://api.elevenlabs.io/v1/user/subscription', headers=H), timeout=60))
    return d['character_limit'] - d['character_count']

def say(voice, model, text, out):
    body = json.dumps({'text': text, 'model_id': model}).encode()
    req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128', data=body,
                                 headers={**H, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
    try:
        with urllib.request.urlopen(req, timeout=300) as r: data = r.read()
        if len(data) < 2000: raise RuntimeError('a take of %d bytes' % len(data))
        open(out + '.part', 'wb').write(data); os.replace(out + '.part', out)
        with LOCK:
            print('ok', os.path.basename(out), len(data), 'bytes', flush=True)
            open(os.path.join(HERE, 'spend.log'), 'a').write('%s %s %s %d\n' % (time.strftime('%H:%M:%S'), os.path.basename(out), model, len(text)))
        return True
    except Exception as e:
        with LOCK: print('FAILED', os.path.basename(out), str(e)[:200], flush=True)
        return False

if __name__ == '__main__':
    a = sys.argv[1:]
    if a[:1] == ['--balance']: print(balance(), 'characters left'); sys.exit(0)
    P = {o['key']: o for o in json.load(open(os.path.join(HERE, 'prompts.json'), encoding='utf-8'))}
    os.makedirs(RAW, exist_ok=True)
    jobs = []
    if a[:1] == ['--all']:
        only = set(a[1:])
        for k, o in P.items():
            if only and k not in only: continue
            for l in 'abc'[:o['takes']]: jobs.append((k, l))
    else:
        jobs = [(a[i], a[i + 1]) for i in range(0, len(a) - 1, 2)]
    jobs = [(k, l) for k, l in jobs if k in P and len(l) == 1 and not os.path.exists(os.path.join(RAW, f'{k}_{l}.mp3'))]
    need = sum(len(P[k]['prompt']) for k, _ in jobs); left = balance()
    print(len(jobs), 'takes,', need, 'characters; balance', left, flush=True)
    if left - need < FLOOR: sys.exit('REFUSED: the balance would fall under %d' % FLOOR)
    with ThreadPoolExecutor(2) as ex:
        list(ex.map(lambda j: say(P[j[0]]['voice_id'], P[j[0]]['model'], P[j[0]]['prompt'], os.path.join(RAW, '%s_%s.mp3' % j)), jobs))
    print('balance now', balance())
