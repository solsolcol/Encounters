# v29.0 · episode 5 chapter 1 · THE PLACES (WORLD, M5): every number PLAY and FILMS take from them

The source is `masters/v29.0/parts/b_world.js` (and the light block of `a_head.js`); this file writes its numbers out.
Units metres, y up. A Mixamo body at a turn of 0 faces +z; the lens at a yaw of 0 looks -z (yaw +90° looks -x).
Every constant below is a name in build()'s scope (b_world.js), so a later part reads it directly; the handles are also
on the stage as `stage.plan.ROOMTHINGS` / `stage.plan.FLATTHINGS` (each carries `api`, the WORLD handles).

## 0 · What b_world.js changes in the skeleton's data (said here, because the places decide it)

Set at file level before build() (b_world.js's top), so the head's DATA is complete when the chapter registers:
- `DATA.spawn` = his place kneeling by her windows: x 1.45, z 1.9, rot 0.41 (the opening film leaves him there).
- `DATA.shrine` / `ghostHome` = his phone on his dining table: x 300.15, z -0.2, on the table's top at y 0.698 (the engine's pile; the decision's anchor).
- `DATA.bounds` = { minX -6.2, maxX 308.6, minZ -4.6, maxZ 4.4 }: the two flats he walks in (her place at the origin, his 300 m along +x).
- `DATA.assets` += the models of the game the places stand (`WORLD_REUSE`), each declared in `DATA.reuseInEpisode` with its reason (all episode 4's; none of episodes 1 to 3).
- The coordinator may move these into a_head.js; nothing else reads them from b_world.js.

His pocket moved from x 200 to **x 300** (`HX`): at 200 his city's towers stood inside the far plane of her street.
`STREET` is no longer a pocket at -200: it is her street at the origin (c_cast's `worldSkyAt` still reads `FLAT.cx`).

## 1 · Her place (the origin): the shophouse row, the stair, her flat

| name | value | what |
|---|---|---|
| `ROOM` | x -5.6..2.75, z -3.0..3.0, ceil 3.4 | her whole flat (c_cast's keepIn box); `ROOM.x1` 2.75 is her front wall's inside face, the mirror's plane |
| `FRONT` | x -2.75..2.75, z -3.0..3.0 | her front room |
| `BACKR` | x -5.6..-2.9, z -1.6..3.0 | her back room: dining table, kitchenette (+z wall, x -4.8..-3.3), fridge, bedroom door (back wall, z -1.3..-0.36, shut) |
| half wall | x -2.75, z -1.6..1.4, 1.05 high | open above; the way through z 1.4..3.0 |
| `LOBBY` | x -4.1..-2.9, z -3.0..-1.75 | the landing outside her door; her shoes, a plant, the gate folded back on its +z wall |
| her door | back wall x -2.75, z -2.85..-1.9 (centre -2.375), hinge z -2.85 | `WORLD.herDoor(k)`: 0 shut (solid), 1 open into her room against its -z wall |
| `STAIR` | bay z -4.3..-3.15; 19 risers of 0.2026, treads 0.235; bottom riser x 0.95, top x -3.28; landing x -4.1..-3.28 | the street door in the shop front's line x 1.15 (`WORLD.streetDoor(k)`, 1 open inward); the tube on the bay's -z wall at x -1.6, y 1.75 (`WORLD.stairTube(k)`: 0 off, 1 on; flicker it from a film's clock) |
| `GY` | -3.85 | the five-foot way's floor (the street's level); the road is GY - 0.15 |
| `STREET` | five-foot way x 1.15..3.0; kerb x 3.55; road x 3.55..13.55; the row opposite's face x 14.1; rows along z -40..40 (end blocks at z ±44) | the coffee shop below her: x -4.0..1.15, z -3.0..3.0, its shutter half down, chairs stacked |
| `WIN` | A z -2.2..-0.6, B z 0.6..2.2; sill 0.42, head 2.95, fanlight 0.45 | her two tall windows; four louvred shutter leaves (`WORLD.shutter(name, deg)`: 'A-' 172, 'A+' 75, 'B-' 172, **'B+' 48** = half closed) |
| `UNITS` | her unit z -4.45..3.15; the others 6.0 m each | the row |

**Her front room, set for the evening (`HER`, also `ROOMTHINGS`):**

| name | x, z (ry) | notes |
|---|---|---|
| `table` | 0.5, 1.15 | coffee table 1.0 x 0.55, top 0.42; `w51ctable` |
| `CLOTH_Y` | 0.432 | the cloth's top; `WORLD.cloth(k)` lays it (0 away, 1 laid) |
| `pho` | 0.5, 1.87 (π) | on his cushion (`w5cushion`, top 0.12), facing the door across the room |
| `him` | 1.45, 1.9 (yaw 0.41) | he kneels at Pho's right by her windows; `KNEEL_EYE` 1.12 (the reflection's measure) |
| `sofa` | 0.5, -0.35 (0) | 1.5 x 0.82, seat 0.44 (`w51gsofa`), its back to the door |
| `grace` | 0.42, -0.32 (0), y 0.44 | where she sits |
| `rattan` | -1.55, -0.95 (0.77), seat 0.45 | Marcus, by the door, turned to the table (`w51rattan`) |
| `door` | -2.75, -2.375 | her front door (above) |
| `shelf` | -1.6, 2.78 (π) | bookshelf (`w51shelf`); her table lamp on its top (`w5tablelamp`) |
| `fan` | 0.45, 0.75 | ceiling fan (`w5ceilfan`), turning; its shadow turning on the ceiling |
| `bag` | 1.02, y 0.44, -0.33 | her open bag on the sofa (`w51bag`), the packet in it (`w51keepsake`, things.keepsake) |
| `plant` | 2.25, -2.55 | dracaena in the window corner |

**On the cloth (`ON_CLOTH`, y = CLOTH_Y 0.412 unless said):** bowl 0.78, 1.22 (`w4bigbowl`, warm-tinted: the plan's brass) ·
candle1 0.18, 1.34 (lit in LAMP) · candle2 0.30, 0.98 (unlit) · plate 0.08, 0.96 (`w51plate`) · lighter 0.95, 1.36
(`w51lighter`) · incense 0.52, 1.38 (`w51incense`) · jug 1.18, y 0, 1.58 at his knee (`w51jug`). Each is `things.<name>`.
`WORLD.candleLit('candle1'|'candle2', on)` (null gives it back to the look).

**THE REFLECTION (plan §12), measured from his kneeling eye (1.45, 1.12, 1.9):** a reflected point P' (P mirrored about
x 2.75) is seen on the glass at z = 1.9 + (z_P - 1.9) · 1.3 / (x_P' - 1.45). So:
- his own reflection falls at z 1.9 on window B, Grandmaster Pho's at 1.75..2.05, the cloth's candles and bowl at 1.5..1.7:
  all behind shutter 'B+' (48°), which covers B from z 1.4 to 2.2 as seen from him;
- the open glass, B z 0.6..1.4 (`FILMPLACE.glass`: x 2.75, y 1.45, z 1.0), holds her door (1.0..1.17), Grace standing in
  the doorway (about 1.03), Marcus on his chair (1.16) and Grace on the sofa (1.10); the lamp (on the shelf, +z) falls on
  the wall past window B, never on glass.
- His turn from looking at Grace to the open glass: from yaw 0.41 to about -1.02 (82°).
- From any other eye (a film walking in) the copy is a mirror of the room with nobody where he stands: frame it so, or
  set `reflect.strength(0)` for the shot.

**The hook (`WORLD.reflect`, `ROOMTHINGS.reflect`):**
```
reflect.add(id, P, { face, turn, k })   // a mkPerson body mirrored into her glass, following it every frame
reflect.set(id, { face, turn, k })      // face: the turn (radians, Mixamo's) the reflection faces in the room, e.g.
                                        //   toward the stairs; null = as the real one. turn: added to the real one's.
                                        //   k: 0 hides it (1 shows). A film sets these from its own clock (v6.4).
reflect.remove(id)
reflect.strength(k)                     // the whole reflection 0..1 (1 default; the pane at 0.5 over it)
reflect.state()
```
Grace (`cast.grace`) and Marcus (`cast.marcus`) are added as 'grace' and 'marcus' on the first frame drawn from inside
her flat. "Her reflection faces the stairs": `reflect.set('grace', { face: Math.atan2(-2.75 - gx, -2.375 - gz) })` (her
door from where she is), eased in "a beat late" by the film. The copy is drawn only while the lens is inside her flat
(`WORLD.insideHer(p)`), shares each body's skeleton (no second pose to keep in step: a seek and a skip land the same),
and costs one draw per body part and per piece of her room while drawn.

## 2 · The street's and the films' places (`FILMPLACE`, plan §9)

| name | value | for |
|---|---|---|
| `crane` | from (9.6, GY+7.0, -6.2) to (4.2, GY+1.6, -3.6), looking at (1.6, GY+1.2, -3.3) | 9.1's crane: her lit windows at the start, Marcus at the stair door at the end |
| `marcus0` | 1.75, -3.0 (ry π/2+0.3), y GY | Marcus waiting by the stair door on the five-foot way. The ground function (`flatGround`) reads HER floor (0) under her flat's footprint (x ≤ 3.0), so a body or a lens on the five-foot way is given its height, GY, by the film |
| `taxi` | 4.55, -1.6, facing -z (π); kerbside rear door at 3.7, -1.15 | `things.taxi` (`e4sedan` tinted blue, no name). NEEDS A DRIVER (v24.22): a seated body is CAST/FILMS's |
| `out` | 3.05, -1.4 | where he steps onto the five-foot way |
| `stairFoot` / `stairTop` | (1.3, GY, -3.72) / (-3.28, 0, -3.72) | the climb (the lens rides `flatGround`, which follows the treads) |
| `landing` | -3.55, -2.7 | the top, turned to her door |
| `herDoorOut` / `herDoorIn` | -3.35, -2.375 / -2.35, -2.375 | either side of her door |
| `glass` | 2.75, 1.45, 1.0 | the point of window B where the door corner is reflected from his place |

## 3 · His home (x 300 + these numbers)

| name | value | what |
|---|---|---|
| `FLAT` | x 295.4..308.2, z -2.5..2.5, ceil 2.8 | his flat (keepIn box) |
| `LIV` | x 295.4..303.0 | living and dining room, his glass on +z (floor to ceiling; solid in play) |
| `PASS` | x 303.0..304.4, z 0.2..1.8 | the passage; two pictures on its +z wall (`things.frame0`, `frame1`: tap them at three o'clock) |
| `BED` | x 304.4..308.2, z -1.0..2.5 | his bedroom (its glass on +z) |
| `BATH` | x 304.4..306.4, z -2.5..-1.12 | the bathroom; its door x 305.1..305.8 open; `WORLD.bathLight(k)` the light spilling out |
| `CORR` | x 290.5..303.0, z -4.3..-2.62 | the corridor: carpet, four wall lights, two neighbours' doors, a window at its west end |
| `BALC` | x 295.4..303.0, z 2.62..4.1, rail 1.1 | the balcony (two chairs, the clothes rack, a plant); the sliding door x 299.3..300.8, `WORLD.balconyDoor(k)` (1 open) |
| `GH` | -78 | the ground; the pool at (302, GH, 18); the expressway at z 78, y GH+7.5, its lights moving |

| name | x, z (ry) | notes |
|---|---|---|
| `door` | 296.2, -2.5; hinge x 295.8 | his front door (`w5frontdoor`, dark veneer); `WORLD.hisDoor(k)` 0 shut (solid), 1 open into his flat; keycard reader at 296.68 |
| `altar` | 295.71, 0.35 (π/2), top 1.03 | `w51altarcab` on the living room's left wall: Buddha (`e4buddha`), his teacher's photograph (`w4framesmall`), a candle, the jasmine (`w51jasmine`), a glass of water (`w51glass`); `things.bottle` (hidden until the film of home sets it down at 295.85, 1.03, 0.27) |
| `bag` | 297.0, -2.2 (0.2) | his own grey canvas bag on the floor inside his front door (`e4bag`, `things.hisBag`): at three o'clock he takes the white thread out of it (9.7); the spool `w51threadreel` is FILMS' to put in his hand |
| `phone` | 300.15, y 0.698, -0.2 | his phone on its charger (`things.hisPhone`, `e4phone`); DATA.shrine |
| `dining` | 300.75, -0.25 (0) | 1.6 x 0.98, top 0.69 (`w51dintable`); `chair1` 300.75, 0.55 (π, his), `chair2` 300.75, -1.05 (0, Pho's at dawn) |
| `sofa` | 297.7, -0.95 (0), seat 0.45 | `w51sofa`, facing his glass |
| `circle` | 297.8, 1.0, r 0.75 | the middle of the floor: the thread's circle |
| `bed` | 307.27, 0.8 (-π/2), 1.7 x 1.87, mattress about 0.5 | `w51bed`, its head on the +x wall; `bedEdge` (306.55, 0.55, 0.15), `bedHead` (307.85, 0.62, 0.8) |
| `getUp` | 306.7, -0.48 | where he stands up from it: `STATION.night.at` (yaw 2.17, toward the bedroom door) |
| `bedDoor` | 304.4, 1.2; hinge z 1.65 | `WORLD.bedDoor(k)` 1 open (play), ~0.15 ajar |
| `clock` | 307.98, y 0.45, 2.1 (turned to the bed) | the alarm clock on his bedside (`w51clock`, `things.bedClock`): 9.4's insert, 11:58 and 3:00 (its face is the films'); the bedside is a stool (`w4stool`, `things.bedside`) at 307.95, 2.05, top 0.45, a glass of water on it (`things.bedGlass`, the one that trembles) |
| `aircon` | 308.08, y 2.25, 0.8 | the wall unit over his bed's head (`w51aircon`) |
| `kettle` | 302.0, -2.2, y 0.92 | on his kitchen counter (`w51kettle`) |
| `oven` | 301.75, y 0.86, -1.88 | `WORLD.ovenClock('3:41')` (ending B) |
| `kitchen` | 300.1, -1.55 | at the drawer (its front x 299.8..300.4) and the tap (300.95): ending C |
| `balconyAt` | 299.85, 2.15 | ending D: the doorway's frame, never past it |
| `dawnSeat` | him 300.75, 0.55; Pho 300.75, -1.05 | the dawn table |
| `steps` | 13 points from his door to his bed (`FILMPLACE.steps`) | the red footsteps (8.3) |

`STATION.ask.at` = (300.4, 0.65, yaw 0.3): standing at his table.

## 4 · The looks (a_head.js's light block; `PRESETS`)

| name | bg | for | the world paints |
|---|---|---|---|
| `BLUE` | 0x22305a | 7:20 PM, the street | street lamps (sodium), the coffee shop's tube, her lamp through her windows, the stair tube |
| `LAMP` | 0x14182e | her room 7:30 to 8:30 | as BLUE, and candle1 |
| `HOME` | 0x121a2c | 11:52 PM, his flat | the altar candle, corridor lamps, the city 27 % lit |
| `NIGHT` | 0x0d1322 | 3:00 to 3:40 AM | the same, the city 11 % lit |
| `DAWN` | 0xd8c8b0 | 7:10 AM | sun patches across his floor, the city's glass pale, no lamps |

The world follows the sky by itself: when the scene's background is a preset's `bg`, its painted light is that look's
(`kit.daylight(PRESETS.X, s)` is all a film or the play calls). `WORLD.look(name)` forces it; `WORLD.light(what, k)` sets
one light (candle1, candle2, tube, bath, altar, corr, lamp, street, dawn, city, night; null gives it back).

## 5 · The things not landed yet (they appear the moment keys.py adds them; their collision stands now)

Her room: w51ctable, w51gsofa, w51rattan, w51shelf, w51plate, w51lighter, w51jug, w51incense, w51laptop, w51takeaway.
His: w51sofa, w51dintable, w51dinchair (two), w51bed, w51altarcab, w51jasmine, w51glass (two), w51clock, w51aircon,
w51kettle. Not placed by the world: w51phobag (Grandmaster Pho's, CAST and FILMS hang it on him), w51breakfast, w51pills,
w51keycard, w51phone (the films' and the play's, in hands). Not made: a standing lamp (her room has its table lamp only).

## 6 · The phone's budget, measured (the GL's own count of one drawn frame, both passes, every instance; 390 x 844 at two pixels a point, touch)

`tools/probes/e5c1world.mjs` with `WORLD=1` draws each view twice: as it stands, and with the people hidden (their bodies
and their copies in her glass). The chapter's budget is under 0.9 million triangles a frame (episode 4 chapter 5's §13).

| view (the plan's camera place) | everything | the places alone | draws (places) |
|---|---|---|---|
| the crane's start (9.1) | 0.93 M | 0.45 M | 96 |
| his place kneeling, at Grace (8.1) | 1.03 M | 0.19 M | 61 |
| the cloth from his place (9.2) | 1.08 M | 0.24 M | 72 |
| the glass (8.1, 9.1) | 0.66 M | 0.17 M | 64 |
| her back room from the window side | 1.33 M | 0.22 M | 69 |
| his corridor (9.4) | 0.30 M | 0.30 M | 54 |
| his bedroom door to the front door (8.3) | 0.32 M | 0.32 M | 53 |
| dawn (9.9) | 0.26 M | 0.26 M | 49 |

The places hold to 0.17 to 0.45 M; what passes the budget in her room is the people (today Pho's seated body, and the
stand-ins Mala's full body, 356 k, and the collector's): CAST's. The crane's places are the street's real models (the taxi
`e4sedan` 99 k close at its end, the row's merged fabric, the coffee shop's chairs): FILMS may show the taxi only from
its arrival (13.0 s). Each pocket is drawn only while the lens is in it (the world's tick), and the reflection's bodies
are their lightest level (the stand-ins have only one: Grace's and Marcus's own lighter levels will take its place).
