    /* ====================================================== THE FLAT'S SOUND (M8; masters/v27.0/sound.sh made every file)
       THE BEDS, each eased toward what the beat wants (chapter 3's mixBeds; the engine ducks every bed 8 dB under a voice):
       the living room's own tone (its fan and fridge and the building round it) and the estate's night at the windows
       while the lights are on, and history's quiet music under them; once the room dies (the blessing), the dark room,
       and the wanderers' whispers while any of them is on the floor. Spirit Vision's own bed and music are the engine's
       (DATA.vision.sound), brought up with its wave while the world's beds are drawn back under it (its duck).
       THE LEVELS: every bed file is at -30 dBFS by its average (sound.sh), so a volume here says where it stands with
       nobody speaking: the room at -35 (the house's quiet place), the windows at -38 under it, the dark room at -34, the
       whispers at -35 and round him; history's music (a loop at its own -3 dBFS peak, -29 by its average) at -36 under the room.
       In a film the beds are the film's (filmBed: a film writes it from its own clock; every film cues the rest itself) */
    const BED = { flat: 0.56, estate: 0.4, hist: 0.45, dark: 0.63, whisper: 0.56, corr: 0.56 };
    const bedMix = { flat: 0, estate: 0, hist: 0, dark: 0, whisper: 0, corr: 0 };
    const filmBed = { on: false, flat: 0, estate: 0, hist: 0, dark: 0, whisper: 0, corr: 0 };
    const BED_EASE = { flat: 1.0, estate: 1.0, hist: 1.8, dark: 1.2, whisper: 0.8, corr: 0.8 };
    function mixBeds(wdt, st) {
      if (!(wdt > 0)) return;
      const want = { flat: 0, estate: 0, hist: 0, dark: 0, whisper: 0, corr: 0 };
      if (st === 'cine') { if (filmBed.on) for (const k in want) want[k] = filmBed[k]; }
      else if (st === 'title' || st === 'chapter') { /* all at 0: the title and the card hear nothing of the flat */ }
      else {
        const dark = lookName === 'DARK';
        want.flat = dark ? 0 : BED.flat; want.estate = BED.estate * (dark ? 0 : 1);
        want.dark = dark ? BED.dark : 0;
        want.hist = phase === 'history' && !dark ? BED.hist : 0;
        const F = play.fight; want.whisper = F && F.on ? BED.whisper * Math.min(1, F.shapes.filter(S => S.state !== 'gone').length / 2) : 0;
      }
      for (const k in bedMix) bedMix[k] += (want[k] - bedMix[k]) * (1 - Math.exp(-wdt / BED_EASE[k]));
      const B = DATA.ambience.beds; B[0][1] = bedMix.flat; B[1][1] = bedMix.estate; B[2][1] = bedMix.hist; B[3][1] = bedMix.dark; B[4][1] = bedMix.whisper; B[5][1] = bedMix.corr;
    }
    /* THE FIGHT'S MUSIC, one pass from the fight's first second (a bed runs from the chapter's start, so a piece that builds
       in three waves is begun where the fight begins): a one-shot, held so the fight's end, a bookmark and a reset can stop
       it; at 0.35 its average stands about 11 dB under a voice. A film is never under it (a scene stops the world's sounds) */
    let fightMus = null;
    function fightMusOn() { fightMusOff(); if (worldSfx && !(soundOff && soundOff())) fightMus = worldSfx('u4fightmus', 0.35, 1, 0) || null; }
    function fightMusOff() { if (fightMus) { try { fightMus.stop(); } catch (e) { } fightMus = null; } }
    /* THE ESTATE'S OWN NOISES, one at a time on the chapter's clock from their own seeded stream (e3c3's shape, v21.13): a
       lift's chime far down the corridor, slippers passing outside the gate, the rubbish chute, a dog far off, a gecko on
       the wall, a motorbike far below. Each panned to where it comes from, a third quieter while a line is said, never two
       at once; in history and the sight only (the blessing has its own sound); in play only; reset() rewinds the stream.
       Each file's loudest twentieth of a second is at -14 dBFS (sound.sh), so these stand at -27 to -30, under the room */
    const AMB_SEED = 0x2704;
    let ambSeed = AMB_SEED, ambAt = 0, ambBusy = 0, ambLast = '', ambN = 0;
    function ambRand() {
      ambSeed = (ambSeed + 0x6D2B79F5) | 0; let t = ambSeed;
      t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    function panAt(x, z) {
      const dx = x - yaw.position.x, dz = z - yaw.position.z, a = Math.atan2(dx, -dz) + yaw.rotation.y;
      return THREE.MathUtils.clamp(Math.sin(a) * 0.75, -0.75, 0.75);
    }
    const AMB = [
      { n: 'u4os1', v: 0.2, len: 4.0, at: () => ({ x: 6, z: -2.5 }) },                                    // the lift, down the corridor
      { n: 'u4os2', v: 0.24, len: 4.0, at: () => ({ x: 0.4 + ambRand() * 2, z: -1.4 }) },                 // slippers, past the gate
      { n: 'u4os3', v: 0.2, len: 3.0, at: () => ({ x: 4, z: -2.0 }) },                                    // the rubbish chute
      { n: 'u4os4', v: 0.16, len: 3.0, at: () => ({ x: -8, z: 2 + ambRand() * 4 }) },                     // a dog, far off, out of the windows
      { n: 'u4os5', v: 0.2, len: 2.0, at: () => ({ x: ambRand() < 0.5 ? ROOMS.living.x0 : ROOMS.living.x1, z: 1 + ambRand() * 3 }) },   // a gecko, on a wall
      { n: 'u4os6', v: 0.16, len: 5.0, at: () => ({ x: -12, z: ambRand() * 6 }) },                        // a motorbike, far below
    ];
    function ambTick() {
      if (!worldSfx || (soundOff && soundOff())) return;
      if (!(phase === 'history' || phase === 'sight') || play.busy) { ambAt = 0; return; }
      if (!ambAt) { ambAt = dayClock.t + 4 + ambRand() * 6; return; }
      if (dayClock.t < ambAt || dayClock.t < ambBusy) return;
      let k = Math.floor(ambRand() * AMB.length);
      if (AMB[k].n === ambLast) k = (k + 1 + Math.floor(ambRand() * (AMB.length - 1))) % AMB.length;
      const sd = AMB[k], at = sd.at();
      const vol = sd.v * (dayClock.t < speak.until ? 0.66 : 1) * (0.85 + 0.3 * ambRand());
      if (worldSfx(sd.n, vol, 0.95 + 0.1 * ambRand(), panAt(at.x, at.z))) {
        ambN++; ambLast = sd.n; ambBusy = dayClock.t + sd.len + 0.8;
        ambAt = dayClock.t + 10 + ambRand() * 12;
      } else ambAt = dayClock.t + 1.5;
    }
    /* HIS BARE FEET ON HER TILES (his shoes are at the rack outside, as a guest's are): the two takes a phone plays, dealt
       from a seeded stream so no fall comes twice running (the engine asks every footfall, stage.stepSound, v16.0) */
    const STEPS_TILE = ['u4tile', 'u4tile2'];
    const TILE_SEED = 0x2705;
    let tileSeed = TILE_SEED, tileLast = -1;
    function stepNext() {
      tileSeed = (tileSeed * 1664525 + 1013904223) >>> 0;
      let j = Math.floor(tileSeed / 4294967296 * (STEPS_TILE.length - (tileLast < 0 ? 0 : 1)));
      if (tileLast >= 0 && j >= tileLast) j++;
      tileLast = j; return STEPS_TILE[j];
    }
    function soundReset() {
      ambSeed = AMB_SEED; ambAt = 0; ambBusy = 0; ambLast = ''; ambN = 0; for (const k in bedMix) bedMix[k] = 0; filmBed.on = false;
      tileSeed = TILE_SEED; tileLast = -1; fightMusOff();
    }
