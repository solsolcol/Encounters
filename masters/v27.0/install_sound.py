"""v27.0 · episode 4 chapter 4's EFFECTS, BEDS AND MUSIC into the engine's vocabulary (STING_SAMPLE): one row a sound,
between the chapter's own markers after its voices, for every u4 file masters/v27.0/sound.sh made (both encodings must
be there). A unique-string edit (the v14.1 rule), idempotent: run it again and it changes nothing it has already done.
  python3 -I masters/v27.0/install_sound.py [--check]   (from the repo root)"""
import os, re, sys
MAIN = 'src/main.js'; main = open(MAIN, encoding='utf-8').read()
names = sorted(f[:-4] for f in os.listdir('assets/audio-opus') if re.fullmatch(r'u4[A-Za-z0-9]+\.ogg', f))
miss = [n for n in names if not os.path.isfile(f'assets/audio/{n}.mp3')]
assert not miss, ('mp3 missing', miss)
END = '  /* E4C4 SOUNDS END */\n'; assert main.count(END) == 1
i = main.index('const STING_SAMPLE = {'); j = main.index('\n};', i)
have = set(re.findall(r"([A-Za-z0-9_]+): \['", main[i:j]))
new = [n for n in names if n not in have]
if new:
    rows, line = [], '  '
    for n in new:
        t = f"{n}: ['{n}', 1], "
        if len(line) + len(t) > 118: rows.append(line.rstrip()); line = '  '
        line += t
    rows.append(line.rstrip())
    block = '  /* v27.0 · its effects, beds and music (masters/v27.0/sound.sh: every pick and why) */\n' + '\n'.join(rows) + '\n'
    main = main.replace(END, block + END)
print(len(names), 'sounds;', len(new), 'rows added')
if '--check' not in sys.argv and new: open(MAIN, 'w', encoding='utf-8').write(main)
