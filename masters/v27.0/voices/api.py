#!/usr/bin/env python3
"""v27.0 · takes made through ElevenLabs' own API (18 Nov 2026: the connector refused in this session, "requires
additional permissions"; Chad gave his key, which lives ONLY at /root/.config/elevenlabs/key on the working machine and
is never written into this public repository, printed, or passed on a command line).
    python3 -I masters/v27.0/voices/api.py <key> <letter> [<key> <letter> ...]      (run from the repo root)
Each take is the line's prompt from prompts.json, said by its voice_id with eleven_v3, written to raw/<key>_<letter>.mp3
(128 kbps, 44.1 kHz, as the connector's flows gave). A failed take is reported and not retried here (v24.3: re-run only
what failed, by hand)."""
import json, os, sys, urllib.request
HERE = os.path.dirname(os.path.abspath(__file__)); RAW = os.path.join(HERE, 'raw')
P = {o['key']: o for o in json.load(open(os.path.join(HERE, 'prompts.json'), encoding='utf-8'))}
KEY = open('/root/.config/elevenlabs/key', encoding='utf-8').read().strip()
args = sys.argv[1:]
for i in range(0, len(args) - 1, 2):
    k, l = args[i], args[i + 1]
    if k not in P or l not in 'abcdef' or len(l) != 1: print('REFUSED', k, l); continue
    o = P[k]; body = json.dumps({'text': o['prompt'], 'model_id': 'eleven_v3'}).encode()
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{o['voice_id']}?output_format=mp3_44100_128",
                                 data=body, headers={'xi-api-key': KEY, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})
    try:
        with urllib.request.urlopen(req, timeout=180) as r: data = r.read()
        out = os.path.join(RAW, f'{k}_{l}.mp3'); open(out, 'wb').write(data); print('ok', os.path.basename(out), len(data), 'bytes')
    except Exception as e:
        print('FAILED', k, l, str(e)[:200])
