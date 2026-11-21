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
    const BED5_NAMES = ['walk', 'court', 'room', 'rfan', 'sour', 'flies', 'tick', 'buzz', 'threads'];
    const BED5_VOL = { walk: 0.55, court: 0.55, room: 0.5, rfan: 0.55, sour: 0.32, flies: 0.45, tick: 0.22, buzz: 0.2, threads: 0.3 };
    const BED5_EASE = { walk: 1.0, court: 1.0, room: 1.0, rfan: 1.2, sour: 0.8, flies: 0.6, tick: 0.6, buzz: 0.6, threads: 0.35 };
    const BED5 = { mix: {}, film: null };
    for (const k of BED5_NAMES) BED5.mix[k] = 0;
    /* (the order of DATA.ambience.beds: a_head.js declares them, each at 0) */
    const BED5_AT = { walk: 0, court: 1, room: 2, rfan: 3, sour: 4, flies: 5, tick: 6, buzz: 7, threads: 8 };
    function bedsTick(wdt, st) {
      if (!(wdt > 0)) return;
      const want = {}; for (const k of BED5_NAMES) want[k] = 0;
      if (st === 'cine') { if (BED5.film) for (const k in BED5.film) if (k in want) want[k] = BED5.film[k]; }
      else if (st !== 'title' && st !== 'chapter' && phase) {
        const x = myX(), z = myZ();
        const inHouse = z > HOUSE.face && z < 120, inRoom = z > 120;
        if (inRoom) want.rfan = BED5_VOL.rfan;
        else if (inHouse) { want.room = BED5_VOL.room; want.tick = BED5_VOL.tick * Math.max(0, 1 - distTo(-6.15, -1.72) / 6); }
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
      }
      const B = DATA.ambience.beds;
      for (const n of BED5_NAMES) { BED5.mix[n] += (want[n] - BED5.mix[n]) * (1 - Math.exp(-wdt / BED5_EASE[n])); if (B[BED5_AT[n]]) B[BED5_AT[n]][1] = BED5.mix[n]; }
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
    const WARM5 = { walk: ['u5walkbed', 'u5courtbed', 'u5sour', 'u5flies', 'u5threads', 'u5sniff1', 'u5sniff2', 'u5sniff3', 'u5sniffout', 'u5weaker', 'u5playground', 'u5tvwall', 'u5mynah', 'u5os4'],
                    hunt: ['u5courtbed', 'u5roombed', 'u5clock', 'u5lampbuzz', 'u5sour', 'u5threads', 'u5sniff1', 'u5sniff2', 'u5sniff3', 'u5sniffout', 'u5os1', 'u5os2', 'u5os3', 'u5os4',
                           'u5vison', 'u5visoff', 'u5visbed', 'u5vismus', 'u5heart'],
                    table: ['u5fanroom', 'u5sour', 'u5threads', 'u5sniff1', 'u5sniff2', 'u5sniff3', 'u5sniffout', 'u5shutter', 'u5farchime', 'u5pcangry', 'u5pchungry', 'u5pcwarm',
                            'u5vison', 'u5visoff', 'u5visbed', 'u5vismus', 'u5heart'] };
    function warm5(p) { if (warmSounds && WARM5[p]) warmSounds(WARM5[p]); }
    function soundReset5() { for (const k of BED5_NAMES) BED5.mix[k] = 0; BED5.film = null; ambSeed5 = 0x2805; ambAt5 = 0; ambLast5 = ''; sniffN5 = 0;
      for (const b of DATA.ambience.beds) b[1] = 0; }
