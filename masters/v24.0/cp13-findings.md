# v24.0 CP13 · episode 4 chapter 1, the review

Five read-only code lenses, each told to quote the line that makes a finding happen:
1. save, resume and reset;
2. sound and timing;
3. play logic and input;
4. engine regressions since v23.5;
5. words and fairness.

There is also a vision review: phone and desktop photographs of every film and ending.

Every finding is checked against today's code, or against a photograph, before it is touched. The verdicts:
- **CONFIRMED** — real; fixed, and the fix is noted.
- **PARTIAL** — part of it is real; that part is fixed.
- **REFUTED** — not real; the reason is noted.
- **LEFT** — real, but left alone; the reason is noted.

## Found before the lenses (CP9–CP12, by photograph and measurement)

| # | Finding | Verdict | Fix |
|---|---|---|---|
| P-1 | No head in the chapter ever turned to look at anything. `q.slerpQuaternions(qa, qb, t)` copies qa into q before it blends toward qb, so blending into the target itself blended toward the identity. | CONFIRMED | The blend goes into its own scratch (`_qlk`). Measured after: Pong 0.6–6° off the lens while he looks at it, Pa Noi 7–8°. |
| P-2 | Pong at the wheel rose 0.19 m off his seat: his soles were held on the cab floor (0.575) under a 0.80 seat. His crown was at 1.91, against the liner's 1.76. | CONFIRMED | The cushions are now at 0.76. His soles go under the floor, where nothing in the cabin sees them: crown 1.68. |
| P-3 | The master's card stood EDGE-ON to the lens in both of its shots (its face 87° off the line of sight) and was never seen. On a phone it was also under the letterbox, behind the fist. | CONFIRMED | It faces the lens (`face`). It is placed at a point of THIS screen above the hand that holds it (`screen`). |
| P-4 | Nine takes ended in 0.6–2.3 s of silence. The scan read voices over each other that never were. | CONFIRMED | Each is cut at the words' end + 0.3 s (`prep.py --keep`), and the lengths are re-measured. |
| P-5 | The downpour, the room tone and the drone summed to −20 dBFS in the voice band. Through the duck, Pong's whisper had only 5 dB over them. | CONFIRMED | The downpour bed was lowered from 0.55 to 0.40. The whisper now has 8 dB, and the cast's speech 12. |

## The lenses

(filled in as each lens reports)
