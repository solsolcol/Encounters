"""v29.0 · GRACE'S AND MARCUS'S VOICES AUDITIONED (CP8.4's first half; v5.18: a new voice is auditioned and Chad picks by
ear). Three Singaporean-English voices from ElevenLabs' shared library for each, chosen by the library's own labels (age,
accent, manner) against the plan's §6 and §10: Grace a young woman, an office worker a day without sleep; Marcus her
colleague, a man of about thirty, worried and kind. Each says two of the plan's §10 lines once, eleven_v3, one emotion
tag (his prompt rules, v5.28). A take lands in AUD (scratch) and is moved into sound/audition/ with its save.
    python3 -I masters/v29.0/sound/audition.py"""
import json, os, sys, urllib.request
HERE = os.path.dirname(os.path.abspath(__file__))
AUD = os.environ.get('AUD') or os.path.join(HERE, 'audition')
KEY = open('/root/.config/elevenlabs/key', encoding='utf-8').read().strip(); H = {'xi-api-key': KEY}
CAST = json.load(open(os.path.join(HERE, 'audition.json')))
os.makedirs(AUD, exist_ok=True)
for who, o in CAST.items():
    for v in o['voices']:
        for i, line in enumerate(o['lines']):
            out = os.path.join(AUD, f"{who}_{v['tag']}_{i + 1}.mp3")
            if os.path.exists(out) or os.path.exists(os.path.join(HERE, 'audition', os.path.basename(out))): continue
            body = {'text': line, 'model_id': 'eleven_v3'}
            req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{v['id']}?output_format=mp3_44100_128",
                                         data=json.dumps(body).encode(), headers={**H, 'Content-Type': 'application/json'})
            try:
                with urllib.request.urlopen(req, timeout=120) as r:
                    d = r.read(); c = r.headers.get('character-cost', '?')
                open(out, 'wb').write(d); print('ok', os.path.basename(out), len(d), 'cost', c, flush=True)
            except Exception as e:
                m = str(e)
                if hasattr(e, 'read'): m += ' ' + e.read()[:300].decode('utf-8', 'replace')
                print('FAILED', os.path.basename(out), m[:300], flush=True)
