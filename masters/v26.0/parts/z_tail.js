
  /* ====================================================== THIS CHAPTER'S DRAWN SURFACES
     Flat things with holes in them that are drawn, not modelled (the plan's §6.3: cloth, woven things and wire): the
     lattice of the fence, a louvred window, and one handful of petals. */
//@@COPY 5465-5465 :: function rng(seed)
  /* painted light: a soft glow; and the gold's three sheets (the master's aura as chapter 2 drew it and kept for him) */
//@@COPY 5508-5514 :: function makeGlow(THREE, cnv) {
//@@COPY 6063-6097 :: function makeAuraBody(THREE, cnv) {
  function done(THREE, c, rep) {
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
    return t;
  }
  /* (the hall's fretwork is a picture cut from his photograph now: the surface `fretwork`) */
  /* the fence's lattice: thin white laths crossed on the diagonal */
  function makeLattice(THREE, cnv) {
    const [c, x] = cnv(256); x.clearRect(0, 0, 256, 256);
    x.strokeStyle = '#ffffff'; x.lineWidth = 13; x.lineCap = 'butt';
    for (let i = -4; i <= 8; i++) { x.beginPath(); x.moveTo(i * 64, 0); x.lineTo(i * 64 + 256, 256); x.stroke(); x.beginPath(); x.moveTo(i * 64, 0); x.lineTo(i * 64 - 256, 256); x.stroke(); }
    return done(THREE, c, true);
  }
  /* a louvred window: a pale frame and grey glass slats, tilted */
  function makeLouvre(THREE, cnv) {
    const [c, x] = cnv(128); x.fillStyle = '#d9dcdc'; x.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 9; i++) { const y = 8 + i * 13; const g = x.createLinearGradient(0, y, 0, y + 11); g.addColorStop(0, '#5e6a70'); g.addColorStop(0.6, '#8fa0a8'); g.addColorStop(1, '#3d464b'); x.fillStyle = g; x.fillRect(8, y, 112, 11); }
    x.fillStyle = '#eef0f0'; x.fillRect(61, 4, 6, 120);
    x.strokeStyle = '#f4f5f5'; x.lineWidth = 6; x.strokeRect(3, 3, 122, 122);
    const t = done(THREE, c, false); return t;
  }
  /* one handful of marigold petals lying together: pale, so each handful is tinted its own yellow or orange */
  function makePetals(THREE, cnv) {
    const [c, x] = cnv(128); x.clearRect(0, 0, 128, 128);
    let s = 90210; const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    for (let i = 0; i < 16; i++) {
      const px = 22 + r() * 84, py = 22 + r() * 84, a = r() * 6.283, l = 13 + r() * 12, w = 4.5 + r() * 4;
      x.save(); x.translate(px, py); x.rotate(a);
      const g = x.createLinearGradient(-l, 0, l, 0); g.addColorStop(0, '#fff7d8'); g.addColorStop(0.5, '#ffffff'); g.addColorStop(1, '#ffe9a8');
      x.fillStyle = g; x.beginPath(); x.moveTo(-l, 0); x.quadraticCurveTo(0, -w * 1.6, l, 0); x.quadraticCurveTo(0, w * 1.6, -l, 0); x.fill();
      x.strokeStyle = 'rgba(190,120,20,0.55)'; x.lineWidth = 1; x.beginPath(); x.moveTo(-l * 0.8, 0); x.lineTo(l * 0.8, 0); x.stroke();
      x.restore();
    }
    return noMip(THREE, done(THREE, c, false));
  }

  /* a cut-out picture of SMALL things is drawn without mipmaps: minified, its alpha averages under the cut, and what is
     far is not drawn at all (a turf "yellow with petals" was green ten metres off: photographed at dawn) */
  function noMip(THREE, t) { t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.needsUpdate = true; return t; }
  /* one marigold petal (a ray floret: narrow at its base, broad and a little notched at its tip), filling its tile */
  function makePetal(THREE, cnv) {
    const [c, x] = cnv(64); x.clearRect(0, 0, 64, 64);
    x.save(); x.translate(32, 32);
    const g = x.createLinearGradient(-28, 0, 28, 0); g.addColorStop(0, '#ffe9a8'); g.addColorStop(0.45, '#ffffff'); g.addColorStop(1, '#fff3c4');
    x.fillStyle = g; x.beginPath(); x.moveTo(-29, 0); x.bezierCurveTo(-14, -9, 8, -19, 24, -13); x.quadraticCurveTo(31, -8, 26, -2); x.lineTo(29, 2); x.quadraticCurveTo(31, 9, 24, 13); x.bezierCurveTo(8, 19, -14, 9, -29, 0); x.fill();
    x.strokeStyle = 'rgba(190,120,20,0.5)'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(-24, 0); x.lineTo(20, 0); x.moveTo(-10, -1); x.lineTo(18, -8); x.moveTo(-10, 1); x.lineTo(18, 8); x.stroke();
    x.restore();
    return noMip(THREE, done(THREE, c, false));
  }

  /* HIS LAPTOP'S FORUM: chapter 2's own drawing of it (the thread that chapter ended on is the opening film's first
     picture), copied whole so the two are one page */
//@@COPY 6179-6338 :: const FX0 = 192, FX1 = 832;
  /* HIS NOTEBOOK'S NEXT PAGE (the opening film), 1024 x 640: on its left leaf the last of what chapter 2's coda showed
     (his list of masters checked, as faint lines: its words are not read here); on its right leaf THE THREE QUESTIONS,
     in his own hand, each underlined as he asks it (k 0 to 1); `turn` 0 to 1 turns that leaf over to a blank one.
     Words drawn in the world are art (v14.5): they are the case file's three questions as a man writes them to himself */
  const BOOK_HAND3 = '"Segoe Print", "Bradley Hand", "Comic Sans MS", "Chalkboard SE", cursive';
  function drawQuestions(x, o = {}) {
    const Wd = 1024, H = 640, k = o.k || [0, 0, 0], turn = o.turn || 0, r = rng(5519);
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
    const leaf = () => { x.fillStyle = '#f8f4e8'; x.fillRect(0, 0, Wd, H); x.fillStyle = '#e8dcc0'; x.fillRect(Wd / 2 - 3, 0, 6, H);
      x.strokeStyle = 'rgba(90,120,170,0.25)'; x.lineWidth = 1.5; for (let y = 70; y < H; y += 42) { x.beginPath(); x.moveTo(20, y); x.lineTo(Wd / 2 - 20, y); x.moveTo(Wd / 2 + 20, y); x.lineTo(Wd - 20, y); x.stroke(); } };
    leaf();
    /* the left leaf: lines of writing, too faint and too small to be read */
    x.strokeStyle = 'rgba(28,42,106,0.28)'; x.lineWidth = 2.2;
    for (let i = 0; i < 9; i++) { const y = 104 + i * 42 + (i > 4 ? 42 : 0); let px = 44; x.beginPath(); while (px < 430 - r() * 120) { const w = 26 + r() * 54; x.moveTo(px, y + r() * 3); x.lineTo(px + w, y + r() * 3); px += w + 12; } x.stroke(); }
    const Q = [['Why am I so sensitive?'], ['Can any of it be used', 'to help others?'], ['How do I cultivate enough', 'to control it... and use it', 'at will?']];
    const x0 = Wd / 2 + 44, kt = turn < 0.5 ? 1 : 0;
    if (kt) { let y = 108;
      Q.forEach((L, qi) => { x.fillStyle = '#1c2a6a'; x.font = `bold 30px ${BOOK_HAND3}`; let wmax = 0;
        L.forEach((ln, li) => { x.fillText(ln, x0, y + li * 42); wmax = Math.max(wmax, x.measureText(ln).width); });
        const yb = y + (L.length - 1) * 42 + 12, kk = k[qi];
        if (kk > 0) { x.strokeStyle = 'rgba(160,34,34,0.9)'; x.lineWidth = 3.5; x.lineCap = 'round'; x.beginPath(); x.moveTo(x0 - 4, yb + 1); x.quadraticCurveTo(x0 + wmax * kk * 0.5, yb + 5, x0 + wmax * kk, yb - 1); x.stroke(); x.lineCap = 'butt'; }
        y += L.length * 42 + 54; }); }
    /* the leaf turning: its edge sweeps from the right to the spine, a shadow before it; past the middle the new leaf is there */
    if (turn > 0 && turn < 1) { const ex = Wd - (Wd / 2 - 6) * turn * 1.0, sh = x.createLinearGradient(ex - 90, 0, ex, 0); sh.addColorStop(0, 'rgba(60,50,30,0)'); sh.addColorStop(1, 'rgba(60,50,30,0.34)');
      x.fillStyle = sh; x.fillRect(ex - 90, 0, 90, H); x.fillStyle = '#fbf8ee'; x.fillRect(ex, 0, Wd - ex, H); x.fillStyle = 'rgba(120,100,60,0.5)'; x.fillRect(ex, 0, 2, H); }
  }

  /* one candle flame: a teardrop, white-hot at its core and amber at its edge, a little blue at its foot; on black
     (it is added to the picture, and what is black adds nothing) */
  function makeFlame(THREE, cnv) {
    const [c, x] = cnv(64); x.fillStyle = '#000'; x.fillRect(0, 0, 64, 64);
    x.save(); x.beginPath(); x.moveTo(32, 2); x.bezierCurveTo(45, 22, 50, 40, 44, 52); x.bezierCurveTo(40, 62, 24, 62, 20, 52); x.bezierCurveTo(14, 40, 19, 22, 32, 2); x.closePath(); x.clip();
    const g = x.createRadialGradient(32, 46, 1, 32, 36, 30); g.addColorStop(0, 'rgb(255,250,228)'); g.addColorStop(0.28, 'rgb(255,216,124)'); g.addColorStop(0.62, 'rgb(240,128,36)'); g.addColorStop(1, 'rgb(90,24,0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    const b = x.createRadialGradient(32, 58, 0, 32, 58, 9); b.addColorStop(0, 'rgba(110,150,255,0.6)'); b.addColorStop(1, 'rgba(110,150,255,0)'); x.fillStyle = b; x.fillRect(18, 46, 28, 18);
    x.restore();
    return done(THREE, c, false);
  }

  /* ====================================================== THE FOUR ENDINGS (§4.5), EACH WITH THE CLOSE (§4.6)
     An ending's pictures are the stage's (y_stage.js FILMS.A to D, and closeFrame); here are its clock's one track, its
     fades and its cues, and the close's, which every ending shares. It ends on its black (the card lies over it). */
  function endingScene(c, api, k, cues) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api, T = ENDT[k], C = CLOSE, t0 = T.close, total = t0 + C.end;
    step(0, () => stage.films.begin(k, c, api));
    tr(0, total, (kk, t) => stage.films.frame(k, t, api), rawK);
    cues(T);
    /* THE CLOSE: out of a short black, on his bai sri beside him */
    fade(t0 - 0.5, t0, 0, 1); fade(t0, t0 + 0.15, 1, 1); fade(t0 + 0.15, t0 + 0.9, 1, 0);
    sfx(t0 - 4.5, 'x3closemus', 0.45);         // the close's music comes in under the ending's last line, and carries it
    sfx(t0 + C.take + 0.7, 'x3baitake', 0.4);  // his bai sri taken up
    sfx(t0 + C.ph3z0, 'ph3z0', 1);             // "Yesterday you would not kneel to a man you did not know. Good. Keep that."
    sfx(t0 + C.ph3z1, 'ph3z1', 1);             // "It is not the flowers you give a teacher. It is your trust. Give that slowly."
    sfx(t0 + C.hands + 1.0, 'x3tone', 0.3);    // both his hands on the bowl: the held tone, low
    sfx(t0 + C.petals + 1.6, 'x3petals', 0.5); // a handful of petals, falling past his eyes
    sfxFade(t0 + C.petals + 2.6, t0 + C.breath, 'x3tone');
    api.eventWait(t0 + C.breath, stage.films.breathOpts(k), (r) => stage.films.breathDone(r));     // ONE BREATH, played
    sfx(t0 + C.q3z1, 'q3z1', 1);               // "Yesterday I watched people go where I could not follow. Today I opened the door a hand's width..."
    fade(t0 + C.give + 1.9, t0 + C.give + 2.2, 0, 1); fade(t0 + C.give + 2.2, t0 + C.give + 2.6, 1, 1); fade(t0 + C.give + 2.6, t0 + C.give + 3.1, 1, 0);   // he bows his head as it is taken from him
    sfx(t0 + C.give + 2.45, 'x3baiset', 0.4);  // set down on the table: the last of the Wai Kru
    sfx(t0 + C.ph3z2, 'ph3z2', 1);             // "Tomorrow we begin."
    sfx(t0 + C.q3K1, 'q3K1', 1);               // "For the first time in my life I had found the teacher who could guide me to the real answers..."
    fade(t0 + C.black, t0 + C.end - 0.2, 0, 1);
    sfxFade(t0 + C.black - 0.6, t0 + C.end - 0.05, 'x3closemus');
    step(total, () => stage.films.end());
    c.endFade = 1; c.keep.view = true;
  }
  /* A · ACCEPT YOUR PATH (best) */
  function scAccept(c, s, api) {
    const { sfx, sfxFade, fade } = api;
    endingScene(c, api, 'A', (T) => {
      sfx(T.q3A0, 'q3A0', 1);                  // "Then teach me. I will walk it."
      sfx(T.long + 0.2, 'x3endA', 0.4);        // the ending's music: plain and warm, under the long moment he is looked at
      sfx(T.ph3A1, 'ph3A1', 1);                // "You say yes quickly. Yes to what?"
      sfx(T.q3A1, 'q3A1', 1);                  // "To hold it first. However many years. And then to use it for others. Not for myself."
      sfx(T.ph3A2, 'ph3A2', 1);                // "Good. Remember the order when it is slow. Slow is where people leave."
      sfx(T.bow + 0.9, 'x3kneel', 0.4);        // he bows, once
      sfx(T.tn3A1, 'tn3A1', 1);                // "New ones roll the mats, bro."
      fade(T.mats - 0.4, T.mats, 0, 1); fade(T.mats, T.mats + 0.12, 1, 1); fade(T.mats + 0.12, T.mats + 0.7, 1, 0);
      sfx(T.mats + 0.5, 'x3matroll', 0.4);     // mats being rolled; bare feet on turf
      sfx(T.q3A2, 'q3A2', 1);                  // "I had imagined something grander. My path began with other people's mats."
      sfx(T.q3A3 + 0.9, 'x3matset', 0.45);     // his mat laid on the stack
      sfx(T.q3A3, 'q3A3', 1);                  // "I did not mind. For once I knew what I was doing, and who I was doing it under."
      sfxFade(T.close - 2.0, T.close, 'x3endA');
    });
  }
  /* B · CHALLENGE THE PATH (bad) */
  function scChallenge(c, s, api) {
    const { sfx, sfxFade, fade } = api;
    endingScene(c, api, 'B', (T) => {
      sfx(T.q3B0, 'q3B0', 1);                  // "I sell amulets. I came into all of this for my business. I never asked for a path."
      sfx(T.ph3B1, 'ph3B1', 1);                // "Nobody asks."
      sfx(T.ph3B2, 'ph3B2', 1);                // "Tell me again how you came to this mat. Slowly."
      sfx(T.q3B1, 'q3B1', 1);                  // "A Sak Yant, for luck. Then another. A shop I kept going back to..."
      sfx(T.q3B1 + 0.6, 'x3endB', 0.36);       // the ending's music: spare, each step of his own named over it
      sfx(T.ph3B3, 'ph3B3', 1);                // "Who carried you?"
      sfx(T.silence + 0.3, 'x3birds', 0.4);    // the long silence, held by the birds
      sfx(T.q3B2, 'q3B2', 1);                  // "Nobody. I walked."
      fade(T.edge - 0.4, T.edge, 0, 1); fade(T.edge, T.edge + 0.15, 1, 1); fade(T.edge + 0.15, T.edge + 0.8, 1, 0);
      sfx(T.edge + 0.3, 'x3afternoon', 0.4);   // the afternoon: cicadas, a broom on the turf, people talking low
      sfx(T.q3B3, 'q3B3', 1);                  // "I sat there angry until the light went yellow. He never once looked my way."
      fade(T.dusk - 0.4, T.dusk, 0, 1); fade(T.dusk, T.dusk + 0.15, 1, 1); fade(T.dusk + 0.15, T.dusk + 0.9, 1, 0);
      sfxFade(T.dusk - 0.5, T.dusk + 0.3, 'x3afternoon');
      sfx(T.dusk + 0.2, 'x3crickets', 0.4);    // dusk: crickets; the bulbs come on
      sfx(T.dusk + 0.9, 'x3bulbs', 0.35);      // a switch, and the string of bulbs humming on
      fade(T.back - 0.4, T.back, 0, 1); fade(T.back, T.back + 0.15, 1, 1); fade(T.back + 0.15, T.back + 0.8, 1, 0);
      sfx(T.back + 0.2, 'x3kneel', 0.4);       // he kneels in front of him again
      sfx(T.q3B4, 'q3B4', 1);                  // "All right. Teach me."
      sfx(T.ph3B4, 'ph3B4', 1);                // "A man who walked here can walk on."
      sfx(T.q3B5, 'q3B5', 1);                  // "I had not chosen the road. I had taken every step of it myself."
      sfxFade(T.close - 2.0, T.close, 'x3endB');
    });
  }
  /* C · ASK WHY (good) */
  function scWhy(c, s, api) {
    const { sfx, sfxFade } = api;
    endingScene(c, api, 'C', (T) => {
      sfx(T.q3C0, 'q3C0', 1);                  // "Why me? Of everyone in that shop, in that temple... why me?"
      sfx(T.ph3C1, 'ph3C1', 1);                // "Why me... that question has no floor. A man can fall in it his whole life."
      sfx(T.ph3C2, 'ph3C2', 1);                // "Ask a better one. For whom?"
      sfx(T.turn + 0.2, 'x3endC', 0.4);        // the ending's music: it opens as his head is turned
      sfx(T.turn + 0.6, 'x3waiting', 0.35);    // those who wait: a cough, a low word, sandals shifted on the turf
      sfx(T.q3C1, 'q3C1', 1);                  // "I had asked why it had happened to me. He turned my head and showed me who was waiting."
      sfx(T.ph3C3, 'ph3C3', 1);                // "What you have is for them. Not for you. One day. Not yet. First you hold it."
      sfx(T.q3C2, 'q3C2', 1);                  // "Then that is why."
      sfx(T.bow + 0.9, 'x3kneel', 0.4);        // he bows
      sfx(T.q3C3, 'q3C3', 1);                  // "Teach me."
      sfx(T.q3C4, 'q3C4', 1);                  // "I had asked why me. I was given something to do with it instead."
      sfxFade(T.close - 2.0, T.close, 'x3endC');
    });
  }
  /* D · ASK TO MAKE IT STOP (worst) */
  function scStop(c, s, api) {
    const { sfx, sfxFade, fade } = api;
    endingScene(c, api, 'D', (T) => {
      sfx(T.q3D0, 'q3D0', 1);                  // "Can you make it stop? I don't want a path. I want my life back."
      sfx(T.ph3D1, 'ph3D1', 1);                // "You are tired of it. I understand."
      sfx(T.ph3D2, 'ph3D2', 1);                // "I can teach you to close. I cannot take the door away."
      sfx(T.ph3D3, 'ph3D3', 1);                // "Close. And this time, stay."
      fade(T.shut + 0.2, T.shut + 0.8, 0, 1); fade(T.shut + 0.8, T.shut + 1.5, 1, 1); fade(T.shut + 1.5, T.shut + 2.6, 1, 0);   // his eyes close, and open on a plain world
      sfx(T.shut + 0.7, 'x3shut', 0.5);        // the world's sound closing down: one soft falling tone, and the flat room of his own head
      sfx(T.q3D1, 'q3D1', 1);                  // "For the first time in years, it was quiet."
      fade(T.sit - 0.4, T.sit, 0, 1); fade(T.sit, T.sit + 0.15, 1, 1); fade(T.sit + 0.15, T.sit + 0.9, 1, 0);
      sfx(T.sit + 0.4, 'x3sweep', 0.3);        // the ground cleared round him: a broom, mats, far voices, all of it flat
      sfx(T.chant + 0.3, 'x3chantfar', 0.5);   // the chanting, from the temple across the fields, on its loudspeakers (captioned)
      sfx(T.q3D2, 'q3D2', 1);                  // "The chanting came, and I waited for it to take me. Nothing. My hands were only my hands."
      sfx(T.q3D3, 'q3D3', 1);                  // "And then I understood what I had been afraid of all those years..."
      sfx(T.q3D3 + 1.5, 'x3endD', 0.4);        // the ending's music: it comes in as his eyes rise to the far bench
      sfxFade(T.back - 1.2, T.back + 0.4, 'x3chantfar');
      fade(T.back - 0.4, T.back, 0, 1); fade(T.back, T.back + 0.15, 1, 1); fade(T.back + 0.15, T.back + 0.8, 1, 0);
      sfx(T.back + 0.2, 'x3kneel', 0.4);       // he goes back, and kneels
      sfx(T.q3D4, 'q3D4', 1);                  // "If I can close it, I can carry it. Teach me the rest."
      sfx(T.ph3D4, 'ph3D4', 1);                // "Fear never closed it. You did."
      sfx(T.q3D5, 'q3D5', 1);                  // "I had asked him to take it away. He gave me the handle, and I found I could keep it."
      sfxFade(T.close - 2.0, T.close, 'x3endD');
    });
  }

  /* ====================================================== THE FILMS FROM PLAY (the plan's §4.1 P3, §4.2, §4.3 P7 and P8)
     Each film's pictures are the stage's (y_stage.js: stage.films); here are its clock's tracks, its fades and its cues. */

  /* THE OPENING FILM, THE QUESTIONS (§4.0): it begins on black and ends on black (the chapter's card comes up over
     it: v14.1), on the light and the spot play begins in */
  function introFilm(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api, T = OPENT;
    c.keepFade = true; c.endFade = 1;
    step(0, () => stage.films.begin('open', c, api));
    tr(0, T.end, (k, t) => stage.films.frame('open', t, api), rawK);
    fade(0, T.o1, 1, 1); fade(T.o1, T.o1 + 1.5, 1, 0);
    sfx(0.4, 'x3openmus', 0.5);                 // the film's own cue, under all of it
    sfx(T.o1 + 0.3, 'x3shophum', 0.25);         // the shop at night: its fridge, the street far off
    sfx(T.q3o1, 'q3o1', 1);                     // "For years I had been searching for the answers to the same questions."
    sfx(T.q3o1 + 1.0, 'x3keys', 0.4);           // typing it
    sfx(T.q3o1 + SECS['q3o1'] + 0.9, 'x3send', 0.45);   // sent
    sfx(T.o2 + 0.3, 'x3page', 0.3);             // his notebook drawn to him
    sfx(T.q3o2, 'q3o2', 1);                     // "Why was I so sensitive?"
    sfx(T.q3o2 + 0.5, 'x3pen', 0.35);           // the pen, under each as he asks it
    sfx(T.q3o3, 'q3o3', 1);                     // "Could any of it be used to help others?"
    sfx(T.q3o3 + 0.8, 'x3pen', 0.35);
    sfx(T.q3o4, 'q3o4', 1);                     // "How could I cultivate enough to control it — and eventually use it at will?"
    sfx(T.q3o4 + 1.2, 'x3pen', 0.35);
    sfx(T.q3o5, 'q3o5', 1);                     // "I had met many practitioners and many masters. Some gave me advice..."
    sfx(T.q3o5 + SECS['q3o5'] - 1.6, 'x3page', 0.4);    // the page turned to a blank one on its last sentence
    fade(T.o3 - 0.35, T.o3, 0, 1); fade(T.o3, T.o3 + 0.12, 1, 1); fade(T.o3 + 0.12, T.o3 + 0.6, 1, 0);
    sfx(T.o3 + 2.3, 'x3zip', 0.5);              // the zip: it is packed
    fade(T.o3 + 2.2, T.o3 + 2.4, 0, 1); fade(T.o3 + 2.4, T.o3 + 2.55, 1, 1); fade(T.o3 + 2.55, T.o3 + 2.9, 1, 0);
    fade(T.o4 - 1.3, T.o4 - 0.5, 0, 1); fade(T.o4 - 0.5, T.o4, 1, 1);
    sfxFade(T.o4 - 1.4, T.o4 - 0.3, 'x3shophum');
    sfx(T.o4 - 1.2, 'x3cabin', 0.4);            // under the black, an aircraft cabin's hum
    sfxFade(T.o4 + 0.2, T.o4 + 1.4, 'x3cabin'); //   ... gives way to morning birds
    sfx(T.o4 + 0.3, 'x3birds', 0.4);
    fade(T.o4, T.o4 + 1.5, 1, 0);
    sfx(T.o4 + 2.0, 'x3festbed', 0.5);          // up, and the noise with it: the ground's own bed, the loudspeakers
    sfx(T.q3o6, 'q3o6', 1);                     // "I was attending a Wai Kru ceremony in Thailand where many masters and practitioners were present."
    fade(T.black, T.end - 0.2, 0, 1);
    sfxFade(T.black - 0.6, T.end - 0.05, 'x3openmus'); sfxFade(T.black - 0.4, T.end - 0.05, 'x3festbed'); sfxFade(T.black - 0.4, T.end - 0.05, 'x3birds');
    step(T.end, () => stage.films.end());
  }

  /* THE NIGHT BETWEEN (§4.2): from play's picture (the check) to black; five pictures, each lifted out of a short black
     and let back into one (the day, the light and the ground change in those blacks: v16.1); it ENDS IN THE CLEAR on
     the very picture play begins the morning in (the same eye, heading and lens: v5.25), so nothing snaps and no
     black is spent between a picture and itself. No word until Ton's. */
  function betweenFilm(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api, T = BETW;
    step(0, () => stage.films.begin('between', c, api));
    tr(0, T.end, (k, t) => stage.films.frame('between', t, api), rawK);
    /* (pushed in the order they happen: a seek applies every track it has passed in the order they were pushed) */
    fade(0, T.n1, 0, 1);
    [T.n1, T.n2, T.n3, T.n4, T.n5].forEach((m, i) => { if (i) fade(m - 0.4, m, 0, 1); fade(m, m + 0.12, 1, 1); fade(m + 0.12, m + 0.62, 1, 0); });
    sfx(0.2, 'x3nightmus', 0.5);                // the film's own cue: the day's noise falls away under it
    sfx(T.n1 + 2.5, 'x3shutter', 0.5);          // the photograph is taken
    sfx(T.n3 - 0.1, 'x3crickets', 0.4);         // the night: crickets, frogs, a far dog (it runs through the room's shot)
    sfxFade(T.n5 - 0.5, T.n5 + 0.6, 'x3crickets');
    sfx(T.n5 + 0.5, 'x3cock', 0.35);            // first light: a cock, far off
    sfx(T.tn3n1, 'tn3n1', 1);                   // "Come. He is free now."
    sfxFade(T.tn3n1 + 0.4, T.end - 0.05, 'x3nightmus');
    step(T.end, () => stage.films.end());
  }

  /* THE TELLING (§4.3 P7): from play's own picture (he has bowed, and kneels) in the clear; it ends on a short black
     that the answers lift. Under each sentence, very low, the sound it remembers */
  function tellFilm(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api, T = TELL;
    c.keepFade = true; c.endFade = 1;
    step(0, () => stage.films.begin('tell', c, api));
    tr(0, T.end, (k, t) => stage.films.frame('tell', t, api), rawK);
    sfx(0.2, 'x3tellmus', 0.4);                 // the telling's own cue, low
    sfx(T.q3t1, 'q3t1', 1);                     // "Since I was a boy I have felt things other people did not."
    sfx(T.q3t1 + 1.0, 'x3mem1', 0.2);           //   a void deck at night: a far lift, a burner's fire
    sfx(T.q3t2, 'q3t2', 1);                     // "When I listen to chanting, my hands move by themselves..."
    sfx(T.q3t2 + 0.9, 'x3mem2', 0.2);           //   monks chanting, far (wordless here: a hum of it)
    sfx(T.q3t3, 'q3t3', 1);                     // "On Buddha Day something danced in my body for fifteen minutes..."
    sfx(T.q3t3 + 1.2, 'x3mem3', 0.2);           //   a shrine's drum and gong, far
    sfx(T.q3t4, 'q3t4', 1);                     // "I pick up a piece in a shop and cold runs up my arm."
    sfx(T.q3t4 + 1.8, 'x3mem4', 0.22);          //   a cold breath of air; glass counters ticking
    sfx(T.q3t5, 'q3t5', 1);                     // "I kept three kumanthong, and I opened myself to them, one by one. I should not have."
    sfx(T.q3t5 + 1.0, 'x3mem5', 0.2);           //   a music box, three notes, slow
    sfx(T.q3t6, 'q3t6', 1);                     // "After one trip a fog sat on my mind until a hermit cleared it."
    sfx(T.q3t6 + 0.9, 'x3mem6', 0.2);           //   a dull room tone, as through cloth
    sfx(T.q3t7, 'q3t7', 1);                     // "I don't know why I am like this. I don't know what it is for..."
    sfx(T.q3t8, 'q3t8', 1);                     // "He listened."
    fade(T.black, T.end - 0.1, 0, 1);
    sfxFade(T.black - 0.5, T.end, 'x3tellmus');
    step(T.end, () => stage.films.end());
  }
  /* THE ANSWERS (§4.3 P8): out of the telling's black (or, the telling skipped, out of play: the film's first fade is
     then a blink); his eyes close once before the teaching; it ends in the clear on play's own picture */
  function answersFilm(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api, T = ANSW;
    step(0, () => stage.films.begin('answers', c, api));
    tr(0, T.end, (k, t) => stage.films.frame('answers', t, api), rawK);
    fade(0, 0.25, 1, 1); fade(0.25, 1.5, 1, 0);
    sfx(0.3, 'x3answmus', 0.4);                 // the answers' own cue
    sfx(T.q3a1, 'q3a1', 1);                     // "Then he said things that shocked me. He knew the answers to every question..."
    sfx(T.ph3n1, 'ph3n1', 1);                   // "When it takes your hands, you are awake. You watch it happen. You did not tell me that part."
    sfx(T.ph3n2, 'ph3n2', 1);                   // "That is what frightens you. Not the moving. The watching."
    sfx(T.ph3n3, 'ph3n3', 1);                   // "You ask why. What you feel was not put into you. It was there already, asleep."
    sfx(T.ph3n4, 'ph3n4', 1);                   // "The ink, the chanting, the pieces you held... they did not give it to you. They woke it."
    sfx(T.ph3n5, 'ph3n5', 1);                   // "The rest of that answer is heavy. I will give it when you can carry it."
    sfx(T.ph3n6, 'ph3n6', 1);                   // "What is it for? A lamp is not lit for the lamp. It is lit for whoever is in the room."
    sfx(T.ph3n7, 'ph3n7', 1);                   // "And how to use it... you ask that first. It comes last."
    fade(T.blink, T.blink + 0.2, 0, 1); fade(T.blink + 0.2, T.blink + 0.46, 1, 1); fade(T.blink + 0.46, T.blink + 0.85, 1, 0);   // his eyes close a moment, and open
    sfx(T.blink + 0.1, 'x3bell', 0.3);          // one small bell, far, under his closed eyes
    sfx(T.ph3g2, 'ph3g2', 1);                   // "First, control."
    sfx(T.ph3g3, 'ph3g3', 1);                   // "To feel is not enough. A door that cannot close is not a door..."
    sfx(T.ph3g4, 'ph3g4', 1);                   // "With control you open when you choose. You close when you choose."
    sfx(T.ph3g4 + 0.6, 'x3tone', 0.28);         //   the gold rises on him: the held tone, low
    sfx(T.ph3g5, 'ph3g5', 1);                   // "When to open. When to close. That is the whole practice."
    sfxFade(T.ph3g5 + 2.5, T.end, 'x3answmus'); sfxFade(T.ph3g5 + 1.0, T.ph3g5 + 4.0, 'x3tone');
    step(T.end, () => stage.films.end());
  }

  /* THE FESTIVAL (§4.1 P3): it begins on play's own picture (he kneels at his place) and ends on its black, which the
     line at Grandmaster Pho's bench lifts */
  function festivalFilm(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api, T = FEST;
    c.keepFade = true; c.endFade = 1;
    step(0, () => stage.films.begin('festival', c, api));
    tr(0, T.end, (k, t) => stage.films.frame('festival', t, api), rawK);
    sfx(0.05, 'x3dancemus', 0.5);              // the music changes: the dance's own piece, over the loudspeakers
    sfx(T.tn3d1, 'tn3d1', 1);                  // "For the Thevadas. To show respect."
    sfx(T.q3m0, 'q3m0', 1);                    // "I knew those hands. Mine had moved like that, by themselves."
    fade(T.cut, T.cut + 0.45, 0, 1); fade(T.cut + 0.45, T.cut + 0.8, 1, 1); fade(T.cut + 0.8, T.masters + 0.1, 1, 0);
    sfxFade(T.cut - 0.6, T.cut + 0.7, 'x3dancemus');
    sfx(T.cut + 0.5, 'x3festmus', 0.42);       // the festival's own music again, and the ground's noise
    sfx(T.q3m1, 'q3m1', 1);                    // "One by one they went up with their bai sri..."
    sfx(T.throw, 'x3petals', 0.5);             // the hermit's handful, falling on her
    sfx(T.man + 1.0, 'x3trance', 0.45);        // the man whose arms rise: a low voiced breath (wordless)
    sfxFade(T.sweep + 3.6, T.pho + 0.5, 'x3festmus');
    sfx(T.pho - 0.05, 'x3tone', 0.5);          // the man in white: one held tone and a bell, on the cut to him
    sfx(T.throw2, 'x3petals', 0.4);            // his own handful
    sfx(T.q3w1, 'q3w1', 1);                    // "Only one person caught my attention."
    sfx(T.q3w2, 'q3w2', 1);                    // "He was dressed in white and carried the presence of a true master."
    sfx(T.q3w3, 'q3w3', 1);                    // "That person was Grandmaster Pho, and something inside me knew..."
    fade(T.black, T.end - 0.15, 0, 1);
    sfxFade(T.black - 0.4, T.end - 0.05, 'x3tone');
    step(T.end, () => stage.films.end());
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e4c3 = Object.assign(DATA, {
    build,
    intro: introFilm,
    scenes: [scAccept, scChallenge, scWhy, scStop],
    films: { festival: festivalFilm, between: betweenFilm, tell: tellFilm, answers: answersFilm }
  });
})();
