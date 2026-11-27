#!/usr/bin/env python3
"""v29.0 · EPISODE 5 CHAPTER 1'S ROWS IN THE VOICE REGISTRY (src/voicelines.js), written from masters/v29.0/script/lines.json.

The registry takes a row only once its take is on disk (chaptertest: "a row without a take is a line the game cannot play",
and a planned row, `est`, is allowed only for a preview chapter, which this chapter never is: Chad's rule of v27.0). So
this writes, between the markers `E5C1 LINES BEGIN` and `E5C1 LINES END`, one row for every line of the script whose take
is in assets/audio/<key>.mp3 AND whose row carries its measured `secs`, and nothing else; a line voiced but not yet
measured is named and left out. Run it after the voices land (SOUND, M8), then assemble:

    python3 -I masters/v29.0/script/registry.py            # says what it would write
    python3 -I masters/v29.0/script/registry.py --write    # writes src/voicelines.js between the markers

A row's `text` is what the take SAYS as generated (the registry's rule): the row's `prompt` when SOUND records the exact
prompt sent (its one tag naming an emotion, v5.28), else its `say`, else the script's words. Its `who` is the speaker's
`registry` name (lines.json `speakers`): jamesAdult (Brian), pho, grace51, marcus51. The words are kept on ONE line inside
double quotes, as textsync's import needs."""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
VL = os.path.join(ROOT, 'src', 'voicelines.js')
A0 = '        /* E5C1 LINES BEGIN'
A1 = '        /* E5C1 LINES END */'


def main():
    S = json.load(open(os.path.join(HERE, 'lines.json'), encoding='utf-8'))
    rows, unmeasured = [], []
    for r in S['lines']:
        if not os.path.exists(os.path.join(ROOT, 'assets', 'audio', r['key'] + '.mp3')): continue
        if not isinstance(r.get('secs'), (int, float)): unmeasured.append(r['key']); continue
        who = S['speakers'][r['who']]['registry']
        text = r.get('prompt') or r.get('say') or r['text']
        row = '    { id: %s, who: %s, ch: "e5c1", where: %s,\n      text: %s, secs: %s' % (
            json.dumps(r['key']), json.dumps(who), json.dumps(r['where'], ensure_ascii=False),
            json.dumps(text, ensure_ascii=False), ('%.2f' % r['secs']).rstrip('0').rstrip('.'))
        if r.get('note'): row += ',\n      note: %s' % json.dumps(r['note'], ensure_ascii=False)
        rows.append(row + ' },')
    s = open(VL, encoding='utf-8').read()
    assert s.count(A0) == 1 and s.count(A1) == 1, 'src/voicelines.js: the E5C1 LINES markers are not there once'
    i = s.index('*/', s.index(A0)) + 2               # (the begin marker's comment runs over two lines: rows go after it)
    i = s.index('\n', i) + 1
    j = s.index(A1)
    s2 = s[:i] + ''.join(x + '\n' for x in rows) + s[j:]
    print('%d rows with a take and a length; %d voiced but not measured (left out): %s' % (len(rows), len(unmeasured), ' '.join(unmeasured) or 'none'))
    if '--write' in sys.argv:
        if s2 != s: open(VL, 'w', encoding='utf-8').write(s2)
        print('written: src/voicelines.js %s' % ('changed' if s2 != s else 'as it was'))
    else: print('(dry run: src/voicelines.js would %s)' % ('change' if s2 != s else 'stay'))


if __name__ == '__main__':
    main()
