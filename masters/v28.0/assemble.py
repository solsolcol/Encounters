#!/usr/bin/env python3
"""Episode 4 chapter 5 (e4c5.js), assembled: masters/v28.0/assemble.py (from masters/v27.0/assemble.py)

The chapter is written as parts (masters/v28.0/parts/*.js, joined in NAME ORDER) and its words as one script
(masters/v28.0/script/lines.json). The output is src/chapters/e4/e4c5.js, which is never edited by hand. Run it from
the repo root:

    python3 -I masters/v28.0/assemble.py              (add --check to assemble and test without writing)
    python3 -I masters/v28.0/assemble.py --out FILE   (write somewhere else: a scratch copy to try)

WHERE A PART LANDS (name order):
    a_head.js        the file's top: the light, the lines' tables (the //@@LINES marker), the chapter's data
    b_world.js       opens build(ctx): the world                                              (TODO-WORLD)
    c_fightrules.js  OPTIONAL, another hand's: the fight's rules and its one table of numbers. It is included when the
                     file exists and left out when it does not (the print says which). It lands INSIDE build(), after
                     b_world.js and before c_story.js, so it must be plain declarations (no import, no export; a
                     `module.exports` must be guarded) and must not declare a name the other parts declare.
    c_*.js           the rest of build(): the story's phases, the play
    d_play.js        the frame, the stage handed to the engine; closes build()
    z_tail.js        the films, the four endings, the registration

THREE MARKERS, each a whole line of a part:

    //@@LINES
        replaced by the SECS, LINES and SAID tables, written from lines.json: every line's length (its MEASURED `secs`
        where the row carries one, else PROVISIONAL: its words / the file's pace, 2.3 a second), its speaker, its
        place and its words. The words have ONE copy, lines.json.
    //@@COPY a-b :: <how line a begins>
        replaced by lines a..b (1-based, inclusive) of src/chapters/e4/e4c4.js as pinned below (chapters are COPIED,
        not bundled: v6.11). e4c4.js is itself generated: it is chapter 3's machinery with chapter 4's edits.
    //@@COPY3 a-b :: <how line a begins>
        the same from src/chapters/e4/e4c3.js as pinned below.

Then EDITS, each an exact string that must occur exactly once in the assembled text (v14.1: unique strings, never
line ranges).

IT REFUSES TO WRITE when: a copied chapter has changed under a pinned range (its sha1; only checked when a marker of
that kind is used); a marker's range is bad or its first line does not begin as the marker says; an edit does not
match exactly once; the script is not sound (a key twice, an unknown speaker, an empty line, an abbreviated title, a
word only a monk may say, his name written "Pho" in a line with no `say` giving "Puu"); a card line and its choice's
`say` differ; the assembled file names, in quotes, a sound that is not this chapter's (build.py would read that as
the chapter asking for it, and the sound would leave its own chapter's pack for the shared one: v27.0); or the
assembled file fails `node --check` (a chapter file in src/chapters is in everyone's build the moment it exists).
"""
import hashlib, json, os, re, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
OUT = os.path.join(ROOT, 'src/chapters/e4/e4c5.js')
PARTS_DIR = os.path.join(HERE, 'parts')
SCRIPT = os.path.join(HERE, 'script', 'lines.json')
AUDIO = os.path.join(ROOT, 'assets', 'audio')
OWN_FX = 'u5'                                        # this chapter's effects, beds and music are named u5... (as chapter 4's are u4...)
OPTIONAL = ['c_fightrules.js']                       # another hand's part: in when it exists, out when it does not

# the chapters a //@@COPY marker copies from, each pinned (checked only when a marker of its kind is used)
COPY_FROM = {
    'COPY':  ('src/chapters/e4/e4c4.js', '8c60e5c7b7e1c8518c64ff5bb5f68ce83da93348'),   # chapter 4 as of 21 Nov 2026 evening (R139 to R144, CH4's 6a3ac4d: every copied range the same text as e35bb75's, moved -9 and -63 lines)
    'COPY3': ('src/chapters/e4/e4c3.js', '7a8c4f42ecef78fb03407470ab57576f86b1301c'),   # chapter 3 as of v26.18 build 22
}

# (old, new): each `old` must occur exactly once in the assembled text
EDITS = [
    # (the world's: b_xpeople.js copies chapter 4's people) the bodies this chapter made are keyed p5: its sheets' rules are theirs
    ("const NOMIP = /^p4/;", "const NOMIP = /^p5/;"),
]

AT = ['open', 'walk', 'devotee', 'hunt', 'prepare', 'fight', 'bagtied', 'table', 'endA', 'endB', 'endC', 'endD', 'close', 'card']
ABBREV = re.compile(r'\bL\.?P\b\.?')                  # chaptertest's own test (v21.8): a title's letters


def die(msg):
    sys.exit('assemble: ' + msg)


def words_of(text):
    return len(text.split())


def read_script():
    S = json.load(open(SCRIPT, encoding='utf-8'))
    pace, speakers, rows = float(S['pace']), S['speakers'], S['lines']
    seen = {}
    for r in rows:
        k = r.get('key', '')
        if not re.match(r'^[a-z]+5[A-Za-z0-9]+$', k): die('lines.json: a key that is not this chapter\'s shape: %r' % k)
        if k in seen: die('lines.json: the key %s is there twice' % k)
        seen[k] = r
        if r.get('who') not in speakers: die('lines.json: %s names an unknown speaker %r' % (k, r.get('who')))
        if r.get('at') not in AT: die('lines.json: %s is at %r, which is not a place of this chapter (%s)' % (k, r.get('at'), ', '.join(AT)))
        t = r.get('text', '')
        if not isinstance(t, str) or not t.strip() or '???' in t: die('lines.json: %s has no words' % k)
        if not str(r.get('where', '')).strip(): die('lines.json: %s does not say where it plays' % k)
        for said in (t, r.get('say', '')):
            if ABBREV.search(said): die('lines.json: %s abbreviates a title (%r): a voice says it in full (v21.8)' % (k, ABBREV.search(said).group(0)))
            if re.search(r'anumodan', said, re.I): die('lines.json: %s says anumodana: only a monk says it (v24.25)' % k)
        if re.search(r'\bPho\b', t) and 'Puu' not in r.get('say', ''):
            die('lines.json: %s says his name: give the voice "Puu" in `say` (it is written Pho and said Puu)' % k)
        if 'secs' in r and not (isinstance(r['secs'], (int, float)) and r['secs'] > 0): die('lines.json: %s has a length that is not one' % k)
        if 'draft' in r and r['draft'] != 'FIGHT-DRAFT': die('lines.json: %s carries an unknown draft mark %r' % (k, r['draft']))
        # the fight's lines were marked FIGHT-DRAFT until its specification was written (docs/V28.0-FIGHT.md 10, applied
        # 21 Nov); from then they are lines like any other, and a draft mark left on one is refused
        if r['at'] == 'fight' and r.get('draft'): die('lines.json: %s is a line of the fight still marked %r: the fight\'s words are docs/V28.0-FIGHT.md 10' % (k, r['draft']))
    for r in rows:
        s = r.get('same')
        if s and s not in seen and not re.match(r'^[a-z]+4', s): die('lines.json: %s is the same as %r, which is no line' % (r['key'], s))
    return pace, speakers, rows


def lines_block(pace, speakers, rows):
    """the SECS, LINES and SAID tables, as the lines of the chapter file"""
    secs = lambda r: (round(float(r['secs']), 2) if 'secs' in r else round(words_of(r['text']) / pace, 2))
    measured = sum(1 for r in rows if 'secs' in r)
    q = lambda s: "'" + s + "'"
    out = []
    out.append('  /* LINES BEGIN: written by masters/v28.0/assemble.py from masters/v28.0/script/lines.json (edit that file and')
    out.append('     assemble again: never this block). EVERY LINE THE CHAPTER SPEAKS: its length, its speaker, its place, its words. */')
    out.append('  /* every line\'s length. PROVISIONAL unless its row in lines.json carries a measured `secs`: a provisional length is')
    out.append('     the line\'s words / %s a second, and is REPLACED by the take\'s measured length when the line is voiced (the queue' % ('%g' % pace))
    out.append('     books its window by it and every film\'s times are built from it, so a measured take moves what follows it: v5.15).')
    out.append('     The names are QUOTED on purpose: build.py gives a sound to a chapter\'s own pack only when the chapter names it in')
    out.append('     quotes (v21.1). */')
    out.append('  const SECS = {      // %d of %d MEASURED from their takes; the other %d PROVISIONAL (words / %s s)' % (measured, len(rows), len(rows) - measured, '%g' % pace))
    for who in speakers:
        mine = [r for r in rows if r['who'] == who]
        if not mine: continue
        out.append('    /* %s */' % speakers[who]['name'])
        line = '   '
        for r in mine:
            item = ' %s: %s,' % (q(r['key']), ('%.2f' % secs(r)).rstrip('0').rstrip('.'))
            if len(line) + len(item) > 116: out.append(line); line = '   '
            line += item
        out.append(line)
    out[-1] = out[-1].rstrip(',')
    out.append('  };')
    out.append('  /* every line\'s words: key: [who, where in the chapter, the words exactly as said]. The fight\'s are those of its')
    out.append('     specification (docs/V28.0-FIGHT.md 10). */')
    out.append('  const LINES = {')
    for i, r in enumerate(rows):
        tail = '' if i == len(rows) - 1 else ','
        mark = '      /* FIGHT-DRAFT */' if r.get('draft') else ''
        out.append('    %s: [%s, %s, %s]%s%s' % (q(r['key']), q(r['who']), q(r['at']), json.dumps(r['text'], ensure_ascii=False), tail, mark))
    out.append('  };')
    out.append('  /* which lines each place says, in the script\'s order (a film\'s builder reads its lines from here) */')
    out.append('  const SAID = {')
    used = [a for a in AT if any(r['at'] == a for r in rows)]
    for i, a in enumerate(used):
        keys = [q(r['key']) for r in rows if r['at'] == a]
        out.append('    %s: [%s]%s' % (a, ', '.join(keys), '' if i == len(used) - 1 else ','))
    out.append('  };')
    out.append('  /* who speaks, as a caption names them (c_story.js: a line whose take has not landed is shown, not lost) */')
    out.append('  const WHO = { %s };' % ', '.join('%s: %s' % (w, json.dumps(speakers[w]['name'].split(',')[0].split(' (')[0], ensure_ascii=False)) for w in speakers))
    out.append('  /* LINES END */')
    return out


def assemble(skip):
    pace, speakers, rows = read_script()
    srcs = {}

    def source(kind):
        if kind not in srcs:
            rel, pin = COPY_FROM[kind]
            text = open(os.path.join(ROOT, rel), encoding='utf-8').read()
            got = hashlib.sha1(text.encode('utf-8')).hexdigest()
            if got != pin: die('%s has changed (sha1 %s, pinned %s): check every //@@%s range against it, then re-pin' % (rel, got, pin, kind))
            srcs[kind] = (rel, text.split('\n'))
        return srcs[kind]

    parts = sorted(f for f in os.listdir(PARTS_DIR) if f.endswith('.js') and f not in skip)
    out, lined = [], 0
    for name in parts:
        for ln in open(os.path.join(PARTS_DIR, name), encoding='utf-8').read().split('\n'):
            if ln == '//@@LINES':
                out.extend(lines_block(pace, speakers, rows)); lined += 1; continue
            m = re.match(r'^//@@(COPY3?) (\d+)-(\d+) :: (.+)$', ln)
            if not m:
                if ln.startswith('//@@'): die('%s: a marker that is not understood: %s' % (name, ln))
                out.append(ln); continue
            kind, a, b, head = m.group(1), int(m.group(2)), int(m.group(3)), m.group(4)
            rel, lines = source(kind)
            if not (1 <= a <= b <= len(lines)): die('%s: bad range %d-%d' % (name, a, b))
            if not lines[a - 1].lstrip().startswith(head):
                die('%s: line %d of %s begins %r, not %r' % (name, a, rel, lines[a - 1].lstrip()[:60], head))
            out.extend(lines[a - 1:b])
        if out and out[-1] == '': out.pop()            # a part's own last newline
    if lined != 1: die('the //@@LINES marker must stand exactly once in the parts (found %d)' % lined)
    text = '\n'.join(out) + '\n'
    for old, new in EDITS:
        n = text.count(old)
        if n != 1: die('an edit matches %d times, not once: %r' % (n, old[:80]))
        text = text.replace(old, new)

    # the card lines and the choices' own `say` are one sentence in two places (the sheet edits the chapter's; the voice
    # says the script's): held together here
    for r in rows:
        if r['at'] != 'card': continue
        want = "say: '%s'" % r['text'].replace("'", '’')
        if text.count(want) != 1: die('the card line %s and its choice\'s `say` differ: the chapter must carry %s' % (r['key'], want))

    # a quoted name that is some OTHER chapter's sound: build.py would count this chapter as asking for it (v27.0)
    own = {r['key'] for r in rows}
    if os.path.isdir(AUDIO):
        theirs = sorted(s[:-4] for s in os.listdir(AUDIO) if s.endswith('.mp3') and s[:-4] not in own and not s.startswith(OWN_FX)
                        and ("'%s'" % s[:-4]) in text)
        if theirs: die('the chapter names, in quotes, sounds that are not its own (rename, or declare the reuse and take them off this list): ' + ', '.join(theirs))
    return text, parts, rows


def node_check(text):
    fd, tmp = tempfile.mkstemp(suffix='.js', prefix='e4c5-'); os.close(fd)
    try:
        open(tmp, 'w', encoding='utf-8').write(text)
        try: r = subprocess.run(['node', '--check', tmp], capture_output=True, text=True)
        except FileNotFoundError: die('node is not on the path: the assembled file cannot be checked, so it is not written')
        if r.returncode != 0: die('the assembled file fails node --check, and is not written:\n' + (r.stderr or r.stdout).replace(tmp, 'e4c5.js'))
    finally:
        os.unlink(tmp)


def main():
    args = sys.argv[1:]
    skip = set()
    while '--without' in args:
        i = args.index('--without'); skip.add(args[i + 1]); del args[i:i + 2]
    out = OUT
    if '--out' in args:
        i = args.index('--out'); out = os.path.abspath(args[i + 1]); del args[i:i + 2]
    text, parts, rows = assemble(skip)
    node_check(text)
    opt = ', '.join('%s %s' % (o, 'IN' if o in parts else 'not there (left out)') for o in OPTIONAL)
    by = {}
    for r in rows: by[r['who']] = by.get(r['who'], 0) + 1
    say = '%d parts (%s), %d lines of code, %d spoken lines (%s; %d measured, %d FIGHT-DRAFT), sha1 %s' % (
        len(parts), opt, text.count('\n'), len(rows), ', '.join('%s %d' % kv for kv in by.items()),
        sum(1 for r in rows if 'secs' in r), sum(1 for r in rows if r.get('draft')), hashlib.sha1(text.encode('utf-8')).hexdigest()[:12])
    if '--check' in args:
        print('ok: ' + say + ' (not written)'); return
    tmp = out + '.tmp'
    open(tmp, 'w', encoding='utf-8').write(text)
    os.replace(tmp, out)
    print('wrote %s: %s' % (os.path.relpath(out, ROOT), say))


if __name__ == '__main__':
    main()
