#!/usr/bin/env python3
"""v29.0 · episode 5 chapter 1's prompts, from masters/v29.0/script/lines.json (THE ONE COPY OF THE WORDS) and one tag a line here.
    python3 -I masters/v29.0/voices/prompts.py        (from the repo root) -> voices/prompts.json
His prompt rules (v5.28): the script's words exactly (a row's `say` where it has one), no capitals added, no ellipsis
added, ONE tag naming an emotion (never only a volume). Three takes a line, for every speaker (the build's CP8.4).
THE TWO CHANTS (plan 11.6): chanted, never sung, in Grandmaster Pho's own voice, on eleven_v4 (v21.5: v3 will not slow
down between pauses; v25.5's Om Namah Shivaya: v3 SAID it, v4 chanted it, with this same tag). The voice is given the
Pali in plain letters as a Thai teacher chants it (the anusvara and the velar n as "ng", the long marks dropped: the
engine's voice has no Pali diacritics); one verse a sentence, its half-lines by commas, so each verse is one breath.
The captions keep the guide's own spelling (lines.json `captions`, never changed here)."""
import json, os, re, unicodedata
HERE = os.path.dirname(os.path.abspath(__file__))
L = json.load(open(os.path.join(HERE, '..', 'script', 'lines.json'), encoding='utf-8'))
VOICE = {'zv': 'bP8FJDHmWVEgXJDitdQd',          # Brian, his voice since episode 3 (src/voicelines.js jamesAdult)
         'ph': 'xYmBpJREC3WfqEFpbPvO',          # Songkran (episode 4 chapters 3 to 5: src/voicelines.js pho)
         'gr': 'KdGcLjKviIhd1TJjgsuv',          # Adrina: SOUND's measured pick of three (1130de8), until Chad's ear
         'mk': 'PHS7Re4X5gu9oeMk7Pms'}          # Amir: SOUND's measured pick of three (1130de8), until Chad's ear
CHANT_TAG = 'chanting slowly, deep and solemn'   # v25.5's, the tag v4 chanted with
TAG = {
 # the opening
 'zv51o1': 'serious', 'zv51o2': 'reflective', 'mk51o1': 'nervous', 'ph51o1': 'calm', 'mk51o2': 'gentle', 'gr51o1': 'tired',
 'ph51o2': 'warm', 'zv51o3': 'uneasy',
 # her room
 'zv51r1': 'uneasy', 'ph51r1': 'calm', 'zv51r2': 'uneasy', 'ph51r2': 'calm', 'zv51r3': 'concerned', 'ph51r3': 'gentle',
 'zv51r4': 'curious', 'ph51r4': 'calm', 'zv51r5': 'gentle', 'gr51r1': 'defensive', 'mk51r1': 'worried', 'zv51r6': 'shaken',
 'gr51r2': 'restless', 'gr51r3': 'anxious', 'mk51r2': 'pleading', 'ph51r5': 'gentle',
 # the keepsake, the breaking, the cord
 'ph51k1': 'gentle', 'ph51k2': 'serious', 'ph51s1': 'calm',
 'ph51c1': 'gentle', 'zv51c1': 'relieved', 'ph51c2': 'warm', 'ph51c3': 'serious', 'mk51c1': 'grateful', 'gr51c1': 'grateful',
 'ph51c4': 'warm', 'ph51c5': 'warm', 'zv51c2': 'modest',
 # home and the night
 'zv51h1': 'reflective', 'zv51n1': 'pained', 'zv51n2': 'pained', 'zv51n3': 'afraid', 'zv51n4': 'afraid',
 # the barrier (through the phone)
 'ph51x1': 'serious', 'ph51x2': 'firm', 'ph51x3': 'firm', 'ph51x4': 'calm', 'ph51x5': 'relieved', 'zv51x1': 'exhausted',
 'ph51x6': 'calm',
 # the four endings
 'ph51A1': 'calm', 'zv51A1': 'pained', 'ph51A2': 'firm', 'ph51A3': 'warm',
 'zv51B1': 'stubborn', 'zv51B2': 'regretful', 'ph51B1': 'concerned', 'zv51B3': 'exhausted', 'ph51B2': 'concerned',
 'zv51B4': 'ashamed', 'ph51B3': 'gentle', 'ph51B4': 'serious',
 'zv51C1': 'dismissive', 'zv51C2': 'pained', 'ph51C1': 'calm', 'zv51C3': 'pained', 'ph51C2': 'serious', 'ph51C3': 'serious',
 'zv51D1': 'determined', 'ph51D1': 'calm', 'zv51D2': 'afraid', 'ph51D2': 'firm', 'ph51D3': 'serious', 'ph51D4': 'stern',
 # the dawn
 'ph51w1': 'warm', 'zv51w1': 'tired', 'ph51w2': 'serious', 'ph51w3': 'serious', 'zv51w2': 'reflective',
 # the four lines under the cards (his terse first-person reflections, v4.91)
 'zv51A': 'reflective', 'zv51B': 'regretful', 'zv51C': 'ashamed', 'zv51D': 'regretful'}
# the lines heard THROUGH THE PHONE (plan 9.7, 9.8): a phone's band and a little compression baked into a copy of the
# take, `<key>tel` (chain.py); lines.json `phone` names it
PHONE = ['ph51x1', 'ph51x2', 'ph51x3', 'ph51x4', 'ph51jina', 'ph51x5', 'ph51x6',
         'ph51A1', 'ph51A2', 'ph51B1', 'ph51B2', 'ph51B3', 'ph51C1', 'ph51C2', 'ph51D1', 'ph51D2']
CHANT_SAY = {}

def plain(s):
    s = s.replace('ṅg', 'ng').replace('ṅ', 'ng').replace('ṁ', 'ng').replace('Ṁ', 'Ng')
    s = s.replace("'", '').replace('’', '').replace('—', ', ')
    s = unicodedata.normalize('NFD', s); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'\s+', ' ', s.replace('-', ' ')).strip()

out = []
keys = set()
for r in L['lines']:
    k = r['key']; keys.add(k)
    if r.get('chant'):
        verses = []
        for p, _ in r['captions']:
            v = plain(p).replace(' / ', ', ').rstrip('.:,') + '.'
            verses.append(v)
        words = ' '.join(verses)
        CHANT_SAY[k] = verses
        out.append(dict(key=k, speaker=r['who'], voice_id=VOICE[r['who']], model='eleven_v4', takes=3, chant=True,
                        verses=len(verses), prompt='[%s] %s' % (CHANT_TAG, words)))
        continue
    assert k in TAG, k + ': no tag'
    words = r.get('say', r['text'])
    assert 'LP' not in words.split() and 'L.P.' not in words, k + ': an abbreviated title'
    out.append(dict(key=k, speaker=r['who'], voice_id=VOICE[r['who']], model='eleven_v3', takes=3,
                    prompt='[%s] %s' % (TAG[k], words)))
assert not set(TAG) - keys, set(TAG) - keys
assert not set(PHONE) - keys, set(PHONE) - keys
json.dump(out, open(os.path.join(HERE, 'prompts.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
json.dump(PHONE, open(os.path.join(HERE, 'phone.json'), 'w'), indent=1)
print(len(out), 'lines to say;', sum(len(o['prompt']) * o['takes'] for o in out), 'characters for every take')
