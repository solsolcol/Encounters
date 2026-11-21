#!/usr/bin/env python3
"""v28.0 · every line's prompt, from masters/v28.0/script/lines.json (THE ONE COPY OF THE WORDS) and one tag a line here.
    python3 -I masters/v28.0/voices/prompts.py        (from the repo root) -> voices/prompts.json
His prompt rules (v5.28): the script's words exactly (a row's `say` where it has one), no capitals added (a capital
in the script, "SMELL.", is the script's: the word on the screen), no ellipsis added, ONE tag naming an emotion (never
only a volume). A FIGHT-DRAFT row is not voiced (the fight is being redesigned: its lines come later). A row whose
words are another chapter's take (`same`: ph4b8, ph4b9) or another row's of this chapter (ph5t5 = ph5w6) is COPIED, not
said again (COPY below): its own files, the same bytes (a chapter that cued another's sound by name would make it
shared, v7.1). Takes: three for Grandmaster Pho (as chapters 3 and 4), two for everyone else."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
L = json.load(open(os.path.join(HERE, '..', 'script', 'lines.json'), encoding='utf-8'))
VOICE = {'he': 'bP8FJDHmWVEgXJDitdQd',          # Brian, his voice since episode 3 (src/voicelines.js jamesAdult)
         'pho': 'xYmBpJREC3WfqEFpbPvO',         # Songkran (chapters 3 and 4)
         'ton': 'uI1epevl1X6hqrxEciKt',         # Kirin (chapter 3)
         'jun': 'c86brOBXdSSYxT5FqIUS',         # Sam: the measured pick of six (RECORD.md), until Chad's ear
         'koh': '76X7rrvQajZEHM3u9zcd',         # Mr David: the measured pick of three
         'collector': 'eWKcOFrcmRNtJMcUZYOm'}   # Shawn Ng: the measured pick of three
COPY = {'ph5v1': ('v27.0', 'ph4b9'), 'ph5v2': ('v27.0', 'ph4b8'), 'ph5t5': ('v28.0', 'ph5w6'),
        'ph5nf3': ('v28.0', 'ph5w6')}   # (the fight's short SMELL: the same word, said with the same firmness)
TAG = {
 'q5o1': 'reflective', 'ju5o1': 'casual', 'tn5o1': 'amused', 'q5o2': 'uneasy',
 'q5w1': 'uneasy', 'tn5w1': 'puzzled', 'tn5w2': 'casual', 'ju5w1': 'amused', 'ph5w1': 'calm', 'ph5w2': 'firm',
 'ph5w3': 'gentle', 'q5w2': 'relieved', 'ju5w2': 'amused', 'ph5w4': 'warm', 'ph5w5': 'calm', 'q5w3': 'uneasy',
 'tn5w3': 'concerned', 'ph5w6': 'firm', 'ph5w7': 'calm', 'tn5w4': 'casual', 'q5w4': 'quiet',
 'ko5d1': 'anxious', 'ko5d2': 'weary', 'ko5d3': 'exasperated', 'ko5d4': 'ashamed', 'ph5d1': 'calm', 'ph5d2': 'calm',
 'q5h1': 'uneasy', 'q5h2': 'serious', 'q5h3': 'serious', 'ph5h1': 'serious', 'q5h4': 'reflective', 'ph5h2': 'calm',
 'ph5h3': 'serious', 'ph5h4': 'gentle', 'q5h5': 'doubtful', 'ph5h5': 'calm', 'ph5h6': 'calm', 'ph5h7': 'calm',
 'ph5p1': 'serious', 'ko5p1': 'afraid', 'ph5p2': 'firm', 'q5p1': 'awed',
 'tn5b1': 'shaken', 'q5b1': 'gentle', 'ko5b1': 'hopeful', 'ph5b1': 'warm', 'ph5b2': 'gentle', 'ph5b3': 'warm',
 'q5b2': 'curious', 'ph5b4': 'calm', 'ph5b5': 'serious', 'ju5b1': 'casual', 'ph5b6': 'calm',
 'co5t1': 'nervous', 'co5t2': 'tired', 'q5t1': 'reflective', 'ph5t1': 'serious', 'ph5t2': 'gentle', 'ph5t3': 'gentle',
 'co5t3': 'worried', 'ph5t4': 'serious', 'co5t4': 'sheepish', 'co5t5': 'defensive', 'co5t6': 'hopeful', 'ph5t6': 'calm',
 'co5t7': 'gentle',
 'co5A1': 'surprised', 'q5A1': 'firm', 'co5A2': 'eager', 'ph5A1': 'calm', 'ph5A2': 'gentle', 'q5A2': 'regretful',
 'co5B1': 'proud', 'co5B2': 'embarrassed', 'co5B3': 'confused', 'co5B4': 'thoughtful', 'co5B5': 'thoughtful',
 'q5B1': 'gentle', 'ph5B1': 'warm', 'q5B2': 'quiet',
 'co5C1': 'disappointed', 'ph5C1': 'calm', 'co5C2': 'embarrassed', 'ph5C2': 'gentle', 'q5C1': 'ashamed',
 'co5D1': 'excited', 'ph5D1': 'calm', 'ph5D2': 'serious', 'q5D1': 'regretful',
 'co5z1': 'relieved', 'q5z1': 'reflective', 'q5A': 'reflective', 'q5B': 'quiet', 'q5C': 'ashamed', 'q5D': 'regretful',
 # the fight (docs/V28.0-FIGHT.md 10): Grandmaster Pho calm, firm and unhurried even when urgent, a teacher guiding a
 # cleansing, never shouting; his thoughts quiet; the three behind the thread concerned, puzzled, afraid, awed
 'ph5f0': 'calm', 'ph5f1': 'firm', 'ph5f2': 'calm', 'ph5f3': 'firm', 'ph5f4': 'firm', 'ph5f5': 'calm', 'ph5f6': 'firm',
 'ph5f7': 'calm', 'ph5f8': 'urgent', 'ph5f9': 'serious', 'ph5f10': 'calm', 'ph5fa': 'calm', 'ph5fc': 'serious',
 'ph5fd': 'firm', 'ph5fe': 'serious', 'ph5fg': 'stern', 'ph5fi': 'serious', 'ph5fj': 'gentle', 'ph5fh': 'serious',
 'ph5na1': 'urgent', 'ph5na2': 'urgent', 'ph5na3': 'urgent', 'ph5nb1': 'urgent', 'ph5nb2': 'firm', 'ph5nc2': 'firm',
 'ph5nc3': 'firm', 'ph5nd1': 'calm', 'ph5nd2': 'firm', 'ph5nd3': 'firm', 'ph5ne1': 'serious', 'ph5nf2': 'firm',
 'ph5ng1': 'urgent', 'ph5ng2': 'firm', 'ph5nh1': 'serious', 'ph5nh2': 'firm', 'ph5ni1': 'firm', 'ph5ni2': 'firm',
 'ph5nj1': 'urgent', 'ph5nj2': 'urgent', 'ph5nk1': 'urgent', 'ph5nk2': 'urgent', 'ph5nl1': 'urgent', 'ph5nl2': 'firm',
 'ph5nl3': 'calm', 'ph5nm1': 'urgent', 'ph5nn1': 'urgent', 'ph5nn2': 'firm', 'ph5no1': 'firm', 'ph5no2': 'urgent',
 'ph5np1': 'firm', 'ph5nq1': 'firm', 'ph5nr1': 'serious', 'ph5nr2': 'calm', 'ph5ns2': 'firm', 'ph5ns3': 'firm',
 'ph5nt1': 'calm', 'ph5nt2': 'firm', 'ph5nu1': 'calm', 'ph5nu2': 'firm', 'ph5nv1': 'calm', 'ph5nv2': 'serious',
 'ph5nv3': 'firm', 'ph5nw1': 'calm', 'ph5nw2': 'firm', 'ph5nx1': 'firm', 'ph5nx2': 'calm', 'ph5ny2': 'firm',
 'ph5g1': 'warm', 'ph5g2': 'warm', 'ph5g3': 'warm', 'ph5g4': 'warm', 'ph5ca': 'urgent', 'ph5cb': 'firm',
 'ph5c1': 'calm', 'ph5c2': 'serious', 'ph5c3': 'gentle', 'ph5c4': 'gentle', 'ph5l1': 'gentle', 'ph5l2': 'warm',
 'q5c0': 'reflective', 'q5c1': 'shaken', 'q5c2': 'shaken', 'q5c3': 'quiet', 'q5c4': 'reflective', 'q5c5': 'awed',
 'tn5c0': 'concerned', 'ko5c1': 'puzzled', 'tn5c1': 'firm', 'ju5c1': 'awed', 'tn5c2': 'afraid', 'ju5c2': 'afraid',
 'ko5c2': 'awed', 'tn5c3': 'concerned'}
out = []
for r in L['lines']:
    k = r['key']
    if r.get('draft') or k in COPY: continue
    assert k in TAG, k + ': no tag'
    words = r.get('say', r['text'])
    assert 'LP' not in words.split() and 'L.P.' not in words, k + ': an abbreviated title'
    out.append(dict(key=k, speaker=r['who'], voice_id=VOICE[r['who']], takes=3 if r['who'] == 'pho' else 2,
                    prompt='[%s] %s' % (TAG[k], words)))
assert not set(TAG) - {o['key'] for o in out}, set(TAG) - {o['key'] for o in out}
json.dump(out, open(os.path.join(HERE, 'prompts.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
json.dump(COPY, open(os.path.join(HERE, 'copies.json'), 'w'), indent=1)
print(len(out), 'lines to say;', len(COPY), 'copied;', sum(len(o['prompt']) * o['takes'] for o in out), 'characters for every take')
