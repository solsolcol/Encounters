# v24.5 · the findings, verified

Nine read-only code lenses (L1–L6 on episode 4 chapter 1, R1–R3 on episode 3 chapter 5), plus the probes (photographs,
real-input play-throughs, Continue at every phase). Every finding is checked against today's code, or a photograph, or a
measurement, before anything is touched (docs/V24.5-DEBUG-PLAN.md has the method). Verdicts:
- **CONFIRMED**: real; fixed, and the fix is noted.
- **PARTIAL**: part of it is real; that part is fixed.
- **REFUTED**: not real; the reason is noted.
- **LEFT**: real, but left alone; the reason is noted.

## Episode 4 chapter 1

### L6 · Words and purpose

| # | Finding | Verdict | Fix |
|---|---|---|---|
| L6-1 | The card told every player "You asked who he was. Nobody knew." — `askedAny` counted any `who:` page, and the reading's page `who:read` is written for everyone before the decision, so "You never asked who he was" could never appear (a regression of CP13's L1-2 fix). | CONFIRMED | OPEN |
| L6-2 | The stock book names "Uncle Lim", a name the player never hears or reads; "She came because…" has no referent on a page titled "Who is he?"; "His answer was longer…" — the master answered no question, it was his reading. | CONFIRMED | OPEN |
| L6-3 | Card line A ("I kept what I saw as what I saw, and didn't decide what it meant") can sit over the conduct note "You wrote down what you thought it meant" on the same card. | OPEN | |
| L6-4 | The chant captions' stops are uneven: `chant3` and `chant2en` have none (L5-17 covered `chant1`). | CONFIRMED | OPEN |
| L6-5 | The flower stand's ribbon reads "GRANDOPENING". | CONFIRMED | OPEN |
| L6-6 | `fm1chant2`'s `where` leaves out ending D, which opens on it. | CONFIRMED | OPEN |
