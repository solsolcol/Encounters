#!/usr/bin/env python3
"""v25.5 · the four lines re-said (Chad, 10 Nov 2026: the telling "in a more natural narrated manner"; ending B's "I feel
things, and sometimes I cannot control my body" and Lersi Chin's answer to fit it). Each line's two takes heard and one
picked by v25.0's own rule and its own code (masters/v25.0/voices/pick.py: a clean end, no odd hole, the tighter read,
no tag spoken), with this folder's lines and takes. Writes picks.json here. Run from the repo root:
    python3 masters/v25.5/voices/pick.py            (then  --rescore  for the end's loudness and the voice's span)
"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
LINES = [
    ('q2tA', 'jamesAdult', 'Play: what he saw, told to Lersi Chin',
     "[uneasy] While he chanted, the smoke kept leaning toward a covered jar, and the cloth over it moved by itself. His shadow moved a moment after he did. And I saw someone standing behind him... I looked again, and there was no one."),
    ('q2B1', 'jamesAdult', 'Ending B: he asks',
     "[hopeful] Lersi Chin... will you teach me? I feel things, and sometimes I cannot control my body. I don't know why."),
    ('lc2B1', 'lersichin', 'Ending B: kindly, after a long look',
     "[gentle] Why you feel, why your body moves without you... what it is for. That question is bigger than my practice. I clear. I cannot answer that one."),
    ('lc2B2', 'lersichin', 'Ending B',
     "[gentle] Someone can teach you. Not me. When you find him, don't take my word. Don't take Pong's word. Check his teacher. Check his people. Then go."),
]
P = os.path.join(HERE, '..', '..', 'v25.0', 'voices', 'pick.py')
ns = {'__name__': 'pick250', '__file__': P}
exec(compile(open(P, encoding='utf-8').read(), P, 'exec'), ns)
ns['HERE'] = HERE; ns['RAW'] = os.path.join(HERE, 'raw'); ns['LINES'] = LINES
import json as _json                                   # (this machine's numpy hands back its own bool and float: made plain for the dump)
_dump0 = _json.dump
_json.dump = lambda o, f, **kw: _dump0(o, f, **dict(kw, default=lambda v: v.item() if hasattr(v, 'item') else str(v)))
ns['rescore']() if '--rescore' in sys.argv else ns['main']()
