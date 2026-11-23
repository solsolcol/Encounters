# The party list's portraits (episode 4 chapter 5, R49 to R59)

**R59 (Chad, 23 Nov 2026):** "For the portraits, i wanted you to send them to gptimage to generate in an artstyle similar to
the final fantasy art style, did you not understand". His word that his teacher's render may go to the picture service.

## The references (the game's own renders, never a photograph)

`tools/probes/e4c5portrait.mjs` with `BG=0x00ff00` (a keying green behind each body, the court's light, a portrait's lens
from a metre): Grandmaster Pho from in front (`pho-0.png`), Master Zavier turned 12 degrees (`zav-r.png`). Cut out and
cropped by `portraits2.py` at 1024 and laid on a neutral grey: `portraits-src/pho-ref.png`, `zav-ref.png`.

## The paintings (Higgsfield, GPT Image 2.6, 23 Nov 2026)

Quality `max`, resolution `1k`, 1:1, `background: transparent`, PNG; 4.5 credits each (the balance read 361.5 before).

| who | job id | prompt (as sent) |
|---|---|---|
| Grandmaster Pho | `bb006882-c846-4b55-b873-43834781139d` | Turn the man in the reference image into a character portrait for a fantasy role-playing game's party menu, in the polished semi-realistic CG art style of modern Final Fantasy character portraits: clean, finely rendered skin and features, soft cinematic lighting with a warm golden rim light around his head and shoulders and a gentle key light from the front left, a subtle painterly finish. Keep him exactly as he is in the reference: the same face, age and features, his shaved head with very short grey stubble, his calm, kind expression and his faint grey moustache, a white robe over one shoulder, a necklace of large golden-amber beads and a strand of dark prayer beads. Head and shoulders, facing the viewer, centred, the whole head in frame, cropped at the upper chest. Transparent background. No text, no logo, no frame, no border. |
| Master Zavier | `0ee51049-96ab-4d46-b928-480390dbd7bc` | Turn the young man in the reference image into a character portrait for a fantasy role-playing game's party menu, in the polished semi-realistic CG art style of modern Final Fantasy character portraits: clean, finely rendered skin and features, soft cinematic lighting with a cool violet rim light around his head and shoulders and a gentle key light from the front left, a subtle painterly finish. Keep him exactly as he is in the reference: the same face, age and features, his messy spiky black hair, his calm, focused expression, a grey-blue knitted shawl-collar cardigan over a black T-shirt. Head and shoulders, facing the viewer, centred, the whole head and hair in frame, cropped at the upper chest. Transparent background. No text, no logo, no frame, no border. |

Each rim light is his tile's own colour (gold his teacher's, violet his). Looked at full size, on a checker and on each tile's
colour: each keeps his face, hair and dress, the alpha clean. Kept on this machine (git ignores `*.png`):
`portraits-src/pho-painted.png`, `zav-painted.png` (and the job ids above fetch them again).

## Into the game

`python3 -I masters/v28.0/props/portraits2.py --painted portraits-src/pho-painted.png portraits-src/zav-painted.png assets`:
each painting's own alpha, cropped by the head's outline (its top to the narrowest row under it filling 0.72 of the
square), 256 x 256 PNG: `assets/p5portpho.png`, `assets/p5portzav.png`.
