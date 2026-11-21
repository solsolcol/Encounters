#!/usr/bin/env python3
"""v28.0 · takes made through ElevenLabs' own API (chapter 4's api.py, masters/v27.0/voices, made this chapter's).
The key lives ONLY at /root/.config/elevenlabs/key on the working machine: never written into this public repository,
printed, or passed on a command line.
    python3 -I masters/v28.0/voices/api.py <key> <letter> [<key> <letter> ...]       a line's take, by prompts.json
    python3 -I masters/v28.0/voices/api.py --aud <cand> <key> [<cand> <key> ...]       an audition take, by audition.json
    python3 -I masters/v28.0/voices/api.py --balance                                   the account's real balance
A line's take is its prompt from prompts.json said by its voice with eleven_v3, written to raw/<key>_<letter>.mp3
(128 kbps, 44.1 kHz); an audition take to audition/raw/<cand>_<key>.mp3. A failed take is reported and not retried here
(v24.3: re-run only what failed, unchanged). Every call's characters are added to spend.log (no key, no address)."""
import json, os, sys, time, urllib.request
HERE = os.path.dirname(os.path.abspath(__file__)); RAW = os.path.join(HERE, 'raw'); ARAW = os.path.join(HERE, 'audition', 'raw')
KEY = open('/root/.config/elevenlabs/key', encoding='utf-8').read().strip()
H = {'xi-api-key': KEY}

def balance():
    d = json.load(urllib.request.urlopen(urllib.request.Request('https://api.elevenlabs.io/v1/user/subscription', headers=H), timeout=60))
    return d['character_count'], d['character_limit']

def say(voice, text, out):
    body = json.dumps({'text': text, 'model_id': 'eleven_v3'}).encode()
    req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128', data=body,
                                 headers={**H, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
    try:
        with urllib.request.urlopen(req, timeout=180) as r: data = r.read()
        if len(data) < 2000: raise RuntimeError('a take of %d bytes' % len(data))
        open(out + '.part', 'wb').write(data); os.replace(out + '.part', out)
        print('ok', os.path.basename(out), len(data), 'bytes', flush=True)
        open(os.path.join(HERE, 'spend.log'), 'a').write('%s %s %d\n' % (time.strftime('%H:%M:%S'), os.path.basename(out), len(text)))
        return True
    except Exception as e:
        print('FAILED', os.path.basename(out), str(e)[:200], flush=True); return False

if __name__ == '__main__':
    a = sys.argv[1:]
    if a[:1] == ['--balance']:
        u, l = balance(); print('used %d of %d characters: %d left' % (u, l, l - u)); sys.exit(0)
    if a[:1] == ['--aud']:
        A = json.load(open(os.path.join(HERE, 'audition', 'audition.json'), encoding='utf-8')); os.makedirs(ARAW, exist_ok=True)
        a = a[1:]
        for i in range(0, len(a) - 1, 2):
            c, k = a[i], a[i + 1]
            if c not in A['candidates'] or k not in A['lines']: print('REFUSED', c, k); continue
            say(A['candidates'][c]['voice_id'], A['lines'][k], os.path.join(ARAW, f'{c}_{k}.mp3'))
        sys.exit(0)
    P = {o['key']: o for o in json.load(open(os.path.join(HERE, 'prompts.json'), encoding='utf-8'))}
    os.makedirs(RAW, exist_ok=True)
    for i in range(0, len(a) - 1, 2):
        k, l = a[i], a[i + 1]
        if k not in P or len(l) != 1 or l not in 'abcdef': print('REFUSED', k, l); continue
        say(P[k]['voice_id'], P[k]['prompt'], os.path.join(RAW, f'{k}_{l}.mp3'))
