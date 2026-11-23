    /* ================================================================ THE PLAY'S SOUND (M7, on the sounds M10 made:
       masters/v28.0/sound/manifest.json, every one in main.js's STING_SAMPLE)
       THE BEDS of the places he walks, each eased toward what the place and the beat want (chapter 3's mixBeds, as chapter
       4's c_tsound.js; the engine ducks every bed 8 dB under a voice): the walkway at dusk; the court after dark with a
       wall lamp's buzz near its lamps; his living room with its clock; the receiving room's afternoon and its fan; and
       under them THE SMELL (u5sour), louder as he nears where it comes from (the trail's strength on the walkway, the
       nearest place not yet found in the hunt, the pieces at the table); the flies at the drain; the threads' own drift
       while SMELL shows them. Spirit Vision's own bed and music are the engine's (DATA.vision.sound), and its duck draws
       these back under it. In a film the beds are the film's: BED5.film, when a film writes it ({ walk, court, room, rfan,
       sour, ... }), else all at 0 (a film cues its own) */
    /* AND THE MUSIC OF THE PLAY (the plan's 10.2; R33: none of the three was played, so all three sat in every player's
       boot download): M2 on the walkway; M4 through the hunt, lifted a step (1.5 dB) at each stain found; M14 on the pieces
       while his sight is open on them (the table, once he has smelled them, until the third presence is looked at). Each is
       a loop cut from its piece's body at a -3 dBFS peak (masters/v28.0/sound/make.sh), so by its own average it stands
       here at about -36 dBFS with nobody speaking (M2 -27.7 at 0.38; M4 -28.1 at 0.34, -37.5 with no stain found and -33.0
       with three; M14 -22.5 at 0.19), as chapter 4's history music stood under its room. Spirit Vision's own music draws
       the beds back under it (its duck, DATA.vision.sound): M4 goes under it as any bed; M14 is the pieces' music WITH his
       sight, so its level is given back what the duck takes (it stands 5 dB under the vision's own music, -31.6, and is in
       its key: both A and D). Under a film each goes down in a third of a second, so no two pieces of music are heard at
       once across the cut (a film cues its own) */
    const BED5_NAMES = ['walk', 'court', 'room', 'rfan', 'sour', 'flies', 'tick', 'buzz', 'threads', 'm2', 'm4', 'm14'];
    const BED5_VOL = { walk: 0.55, court: 0.55, room: 0.5, rfan: 0.55, sour: 0.32, flies: 0.45, tick: 0.22, buzz: 0.2, threads: 0.3, m2: 0.38, m4: 0.34, m14: 0.19 };
    const BED5_EASE = { walk: 1.0, court: 1.0, room: 1.0, rfan: 1.2, sour: 0.8, flies: 0.6, tick: 0.6, buzz: 0.6, threads: 0.35, m2: 2.0, m4: 2.0, m14: 0.05 };
    const BED5_MUS = new Set(['m2', 'm4', 'm14']), BED5_OUT = 0.35, HUNT_STEP5 = 1.19;
    const VDUCK5 = (DATA.vision && DATA.vision.sound && +DATA.vision.sound.duck) || 0;
    const BED5 = { mix: {}, film: null };
    for (const k of BED5_NAMES) BED5.mix[k] = 0;
    /* each bed's row in DATA.ambience.beds (a_head.js declares them, each at 0), found by its sound's name; a bed with no row
       declared is mixed and not written */
    const BED5_SND = { walk: 'u5walkbed', court: 'u5courtbed', room: 'u5roombed', rfan: 'u5fanroom', sour: 'u5sour', flies: 'u5flies', tick: 'u5clock', buzz: 'u5lampbuzz', threads: 'u5threads',
                       m2: 'u5m2walk', m4: 'u5m4hunt', m14: 'u5m14sight' };
    const BED5_AT = {};
    DATA.ambience.beds.forEach((b, i) => { for (const k in BED5_SND) if (BED5_SND[k] === b[0]) BED5_AT[k] = i; });
    function bedsTick(wdt, st) {
      if (!(wdt > 0)) return;
      const want = {}; for (const k of BED5_NAMES) want[k] = 0;
      if (st === 'cine') { if (BED5.film) for (const k in BED5.film) if (k in want) want[k] = BED5.film[k]; }
      else if (st !== 'title' && st !== 'chapter' && phase) {
        const x = myX(), z = myZ();
        /* (R33: in the house by the world's own test, b_world.js inHouse(x, z). By z alone, the walkway's first leg from
           the lift (x -0.95 to 0.95, z 1.2 to -5.6, beside the house's z) was "in the house": the walk began on his living
           room's tone and clock, and the walkway's dusk came in only past z -5.6; and the name shadowed the world's) */
        const inH = inHouse(x, z), inRoom = z > 120;
        if (inRoom) want.rfan = BED5_VOL.rfan;
        else if (inH) { want.room = BED5_VOL.room; want.tick = BED5_VOL.tick * Math.max(0, 1 - distTo(-6.15, -1.72) / 6); }
        else if (inCourt(x, z, 0.3)) { want.court = BED5_VOL.court; want.walk = phase === 'walk' ? BED5_VOL.walk * 0.4 : 0;
          if (phase !== 'walk') want.buzz = BED5_VOL.buzz * Math.max(0, 1 - Math.min(distTo(-9.28, -5.87), distTo(-7.72, -5.87)) / 3.5); }
        else { want.walk = BED5_VOL.walk; if (phase !== 'walk') want.court = BED5_VOL.court * 0.35; }
        /* the smell, by how near its source is */
        let k = 0;
        if (phase === 'walk' && asked()) k = trailStrength(trailNear(x, z)) * 0.9;
        else if (phase === 'hunt') { const q = nearestUnfound(); if (q) k = Math.max(0.15, 1 - distTo(q.x, q.z) / 9); }
        else if (phase === 'table' && !play.found.has('m')) k = 0.7;
        want.sour = BED5_VOL.sour * k;
        if (phase === 'walk') want.flies = BED5_VOL.flies * Math.max(0, 1 - distTo(FLOOR.DRAIN.x, FLOOR.DRAIN.z) / 5);
        want.threads = smell.t >= 0 && smell.t < SMELL.threads + 0.4 ? BED5_VOL.threads : 0;
        /* the music (above) */
        if (phase === 'walk') want.m2 = BED5_VOL.m2;
        else if (phase === 'hunt') want.m4 = BED5_VOL.m4 * Math.pow(HUNT_STEP5, stainsFound());
        else if (phase === 'table' && play.found.has('m') && lookedN() < 3) {
          const v = kit && kit.vision ? kit.vision() : null, vk = v ? Math.max(0, Math.min(1, +v.k || 0)) : 0;
          want.m14 = BED5_VOL.m14 * vk / Math.max(0.2, 1 - VDUCK5 * vk);
        }
      }
      const B = DATA.ambience.beds;
      for (const n of BED5_NAMES) {
        const e = st === 'cine' && BED5_MUS.has(n) && want[n] < BED5.mix[n] ? BED5_OUT : BED5_EASE[n];
        BED5.mix[n] += (want[n] - BED5.mix[n]) * (1 - Math.exp(-wdt / e)); if (B[BED5_AT[n]]) B[BED5_AT[n]][1] = BED5.mix[n]; }
    }
    /* M5, THE NINE SEEN (the plan's 10.2, "one sung chord, then nothing"): once, as the wave first shows them in the hunt and
       his teacher says "Nine Prai." (c_story.js nineLines calls it); a play one-shot, so the engine's duck takes it under
       the line */
    function nineSound5() { if (worldSfx && !(soundOff && soundOff())) worldSfx('u5m5nine', 0.7, 1, 0); }
    /* THE KETTLE HE FORGOT (the plan's 10.1, the household): once in the hunt, 18 s after he is first inside the house, from
       the kitchen behind its shut door (the dining room's east wall, b_world.js), a third quieter while a line is said; in
       play only (ambTick5 calls it), on its own clock, so the places' seeded stream is untouched (v6.15). Its level is the
       places' one-shots' (-18.2 dBFS by its average, -29 here) */
    const KETTLE5 = { x: -7.9, z: 0.65, after: 18, vol: 0.28 };
    let kettleAt5 = 0, kettleDone5 = false;
    function kettleTick5() {
      if (kettleDone5 || phase !== 'hunt') return;
      if (!inHouse(myX(), myZ())) return;
      if (!kettleAt5) { kettleAt5 = dayClock.t + KETTLE5.after; return; }
      if (dayClock.t < kettleAt5) return;
      kettleDone5 = true; worldSfx('u5kettle', KETTLE5.vol * (lineBusy() ? 0.6 : 1), 1, panAt5(KETTLE5.x, KETTLE5.z));
    }
    /* THE PLACES' OWN NOISES, one at a time on the chapter's clock from their own seeded stream (e3c3's shape, v21.13):
       on the walkway the last voices of a playground, a television through a wall, mynahs settling, far noises; in the
       court at night its far noises; in the receiving room a shutter somewhere and a far chime. Each panned to where it
       comes from, quieter while a line is said, never two at once, in play only; reset() rewinds the stream */
    let ambSeed5 = 0x2805, ambAt5 = 0, ambLast5 = '';
    function ambRand5() { ambSeed5 = (ambSeed5 + 0x6D2B79F5) | 0; let t = ambSeed5; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
    function panAt5(x, z) { const dx = x - myX(), dz = z - myZ(), a = Math.atan2(dx, -dz) + yaw.rotation.y; return THREE.MathUtils.clamp(Math.sin(a) * 0.75, -0.75, 0.75); }
    const AMB5 = {
      walk: [['u5playground', 0.35, () => [24, -10]], ['u5tvwall', 0.3, () => [-1.4, -4 - ambRand5() * 8]], ['u5mynah', 0.35, () => [20, -2 - ambRand5() * 14]], ['u5os4', 0.3, () => [30, -20]]],
      court: [['u5os1', 0.32, () => [-8.5, -24]], ['u5os2', 0.32, () => [-20, -10]], ['u5os3', 0.3, () => [4, -12]], ['u5os4', 0.28, () => [-8.5, 10]]],
      room: [['u5shutter', 0.35, () => [12, 240]], ['u5farchime', 0.3, () => [-12, 238]]]
    };
    function ambTick5() {
      if (!worldSfx || (soundOff && soundOff())) return;
      kettleTick5();
      const z = myZ(), set = z > 120 ? 'room' : (phase === 'walk' && !inCourt()) ? 'walk' : (phase === 'hunt' && z < HOUSE.face) ? 'court' : null;
      if (!set) { ambAt5 = 0; return; }
      if (!ambAt5) { ambAt5 = dayClock.t + 5 + ambRand5() * 7; return; }
      if (dayClock.t < ambAt5) return;
      const L = AMB5[set]; let i = Math.floor(ambRand5() * L.length); if (L[i][0] === ambLast5) i = (i + 1) % L.length;
      const [n, v, at] = L[i], p = at(); ambLast5 = n;
      worldSfx(n, v * (lineBusy() ? 0.6 : 1), 1, panAt5(p[0], p[1]));
      ambAt5 = dayClock.t + 9 + ambRand5() * 12;
    }
    /* SMELL's breath: in (dealt in turn), and out as the threads go, two and a half seconds before the next */
    const SNIFF5 = ['u5sniff1', 'u5sniff2', 'u5sniff3'];
    let sniffN5 = 0;
    function sniffIn() { if (worldSfx) worldSfx(SNIFF5[sniffN5++ % SNIFF5.length], 0.8, 1, 0); }
    function sniffOut() { if (worldSfx) worldSfx('u5sniffout', 0.7, 1, 0); }
    /* a presence at the table, looked at: its own sound, from where it is */
    const PRES_SND = { k1: 'u5pcangry', k2: 'u5pchungry', k3: 'u5pcwarm' };
    function presSound(c) { const k = c === 'k1' ? 'angry' : c === 'k2' ? 'hungry' : 'energy', q = TABLE5.P[k];
      if (worldSfx) worldSfx(PRES_SND[c], 0.75, 1, panAt5(q.x, q.z)); }
    /* every sound the play can ask for, warmed as its phase begins (v10.2) */
    const WARM5 = { walk: ['u5walkbed', 'u5courtbed', 'u5sour', 'u5flies', 'u5threads', 'u5sniff1', 'u5sniff2', 'u5sniff3', 'u5sniffout', 'u5weaker', 'u5playground', 'u5tvwall', 'u5mynah', 'u5os4',
                           'u5m2walk'],
                    hunt: ['u5courtbed', 'u5roombed', 'u5clock', 'u5lampbuzz', 'u5sour', 'u5threads', 'u5sniff1', 'u5sniff2', 'u5sniff3', 'u5sniffout', 'u5os1', 'u5os2', 'u5os3', 'u5os4',
                           'u5vison', 'u5visoff', 'u5visbed', 'u5vismus', 'u5heart', 'u5m4hunt', 'u5m5nine', 'u5kettle'],
                    table: ['u5fanroom', 'u5sour', 'u5threads', 'u5sniff1', 'u5sniff2', 'u5sniff3', 'u5sniffout', 'u5shutter', 'u5farchime', 'u5pcangry', 'u5pchungry', 'u5pcwarm',
                            'u5vison', 'u5visoff', 'u5visbed', 'u5vismus', 'u5heart', 'u5m14sight'] };
    function warm5(p) { if (warmSounds && WARM5[p]) warmSounds(WARM5[p]); }
    function soundReset5() { for (const k of BED5_NAMES) BED5.mix[k] = 0; BED5.film = null; ambSeed5 = 0x2805; ambAt5 = 0; ambLast5 = ''; sniffN5 = 0;
      kettleAt5 = 0; kettleDone5 = false;
      for (const b of DATA.ambience.beds) b[1] = 0; }
