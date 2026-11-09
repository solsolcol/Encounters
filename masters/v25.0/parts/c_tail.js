
  /* ====================================================== THE SHOP'S DRAWN SURFACES (chapter 1's, copied: chapters are
     copied, not bundled — every one here is the one his shop was built with) */
//@@COPY 8076-8096
//@@COPY 8236-8256
//@@COPY 8465-8473
  /* (a soft blob that wraps both ways, for the tiles and the terrazzo) */
//@@COPY 8526-8532
//@@COPY 8776-9147
//@@COPY 9519-9650

  /* ====================================================== (v25.0) THIS CHAPTER'S OWN DRAWN SURFACES
     Each drawn on a canvas (CSP-safe, no download); words drawn into the world are art (v14.5), except the forum's,
     which are the sheet's like chapter 1's phone chat, so Chad can change them */
  /* a woven fabric: a grey sling bag's nylon weave, by its colour and seed */
  function makeCanvasCloth(THREE, cnv, hex, seed) {
    const S = 256, [c, x] = cnv(S), r = rng(seed);
    x.fillStyle = hex; x.fillRect(0, 0, S, S);
    for (let y = 0; y < S; y += 2) { x.fillStyle = `rgba(255,255,255,${(0.025 + r() * 0.03).toFixed(3)})`; x.fillRect(0, y, S, 1); }
    for (let xx = 0; xx < S; xx += 2) { x.fillStyle = `rgba(0,0,0,${(0.03 + r() * 0.03).toFixed(3)})`; x.fillRect(xx, 0, 1, S); }
    speckle(x, S, S, r, 500, '0,0,0', 0.03, 0.08);
    const t = done(THREE, c, true); t.repeat.set(2, 2); return t;
  }
  /* his navy zip jacket's cloth: a fine twill, a seam or two */
  function makeJacketCloth(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(7203);
    x.fillStyle = '#1e2a40'; x.fillRect(0, 0, S, S);
    for (let k = -S; k < S; k += 3) { x.strokeStyle = `rgba(255,255,255,${(0.02 + r() * 0.025).toFixed(3)})`; x.lineWidth = 1; x.beginPath(); x.moveTo(k, 0); x.lineTo(k + S, S); x.stroke(); }
    x.strokeStyle = 'rgba(0,0,0,0.35)'; x.lineWidth = 2; x.setLineDash([5, 3]);
    for (const y of [60, 196]) { x.beginPath(); x.moveTo(0, y); x.lineTo(S, y); x.stroke(); }
    x.setLineDash([]); speckle(x, S, S, r, 300, '255,255,255', 0.02, 0.05);
    return done(THREE, c, false);
  }
  /* the wallet's brown leather: its grain, a stitched edge */
  function makeLeather(THREE, cnv) {
    const S = 128, [c, x] = cnv(S), r = rng(7205);
    x.fillStyle = '#6a4228'; x.fillRect(0, 0, S, S);
    speckle(x, S, S, r, 900, '30,16,8', 0.06, 0.16, 1, 2.5); speckle(x, S, S, r, 300, '180,130,90', 0.04, 0.1);
    x.strokeStyle = 'rgba(232,200,150,0.55)'; x.lineWidth = 1.2; x.setLineDash([4, 3]); x.strokeRect(7, 7, S - 14, S - 14); x.setLineDash([]);
    return done(THREE, c, false);
  }
  /* the note on his counter's glass in his own hand: a yellow square, the words in a pen's hand, a corner lifting */
  function makeSticky(THREE, cnv, text) {
    const S = 256, [c, x] = cnv(S), r = rng(7207);
    const g = x.createLinearGradient(0, 0, 0, S); g.addColorStop(0, '#fbe96a'); g.addColorStop(1, '#f2d84a');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    x.fillStyle = 'rgba(160,120,0,0.18)'; x.fillRect(0, 0, S, 22);                      // its glued strip
    speckle(x, S, S, r, 160, '120,90,0', 0.03, 0.08);
    x.save(); x.translate(S / 2, S / 2 + 8); x.rotate(-0.06);
    x.fillStyle = '#1c2a6a'; x.textAlign = 'center'; x.textBaseline = 'middle';
    const words = String(text || '').split(' ');
    x.font = `bold 54px ${BOOK_HAND}`;
    if (words.length > 1) { x.fillText(words[0], -6, -30); x.fillText(words.slice(1).join(' '), 8, 34); } else x.fillText(words[0] || '', 0, 0);
    x.strokeStyle = '#1c2a6a'; x.lineWidth = 3; x.beginPath(); x.moveTo(-70, 70); x.quadraticCurveTo(0, 82, 76, 66); x.stroke();   // underlined twice, in a hurry
    x.beginPath(); x.moveTo(-60, 80); x.quadraticCurveTo(10, 90, 70, 78); x.stroke();
    x.restore();
    return done(THREE, c, false);
  }
  /* his woven bag's cloth (a yaam): bands of red, indigo and cream, a woven texture over them */
  function makeYaamCloth(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(7209);
    const bands = ['#8e1a1a', '#e8dcc0', '#2a3a6a', '#e8dcc0', '#8e1a1a', '#c8902a', '#8e1a1a', '#e8dcc0', '#2a3a6a'];
    let y = 0; bands.forEach((b, i) => { const h = i % 2 ? 14 : 34; x.fillStyle = b; x.fillRect(0, y, S, h); y += h; });
    x.fillStyle = '#8e1a1a'; x.fillRect(0, y, S, S - y);
    for (let yy = 0; yy < S; yy += 3) { x.fillStyle = `rgba(0,0,0,${(0.05 + r() * 0.05).toFixed(3)})`; x.fillRect(0, yy, S, 1); }
    for (let xx = 0; xx < S; xx += 3) { x.fillStyle = `rgba(255,255,255,${(0.03 + r() * 0.03).toFixed(3)})`; x.fillRect(xx, 0, 1, S); }
    return done(THREE, c, false);
  }
  /* the envelope for the temple (ending D): white, its flap, the words in his hand */
  function makeEnvelope(THREE, cnv, text) {
    const [c, x] = sized(cnv, 512, 332), r = rng(7211);
    x.fillStyle = '#f6f4ee'; x.fillRect(0, 0, 512, 332);
    speckle(x, 512, 332, r, 400, '120,110,90', 0.02, 0.05);
    x.strokeStyle = 'rgba(120,110,90,0.35)'; x.lineWidth = 2;
    x.beginPath(); x.moveTo(0, 0); x.lineTo(256, 150); x.lineTo(512, 0); x.stroke();
    x.fillStyle = '#1c2a6a'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `bold 46px ${BOOK_HAND}`;
    x.save(); x.translate(256, 236); x.rotate(-0.03); x.fillText(String(text || ''), 0, 0); x.restore();
    return done(THREE, c, false);
  }
  /* HIS LAPTOP'S FORUM (ending A and the coda): a generic forum — no real site's name, logo or look (v9.3) — drawn on the
     laptop's 1024 × 720 screen: `compose` (his post typed, `chars` of it, `post` once sent), `thread` (it, and `n` of the
     replies), `list` (the threads: masters, a lineage chart, accounts; `newK` the new one arriving at the top, `cursor`
     and `click` his finger on the pad), `post` (the new thread opened) */
  function drawForum(x, o = {}) {
    const W = 1024, H = 720, Wd = o.words || {};
    const F = (s, w = '') => `${w} ${s}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.fillStyle = '#eef0f3'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#23423e'; x.fillRect(0, 0, W, 92);
    x.fillStyle = '#f2d48a'; x.font = F(38, 'bold'); x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText(Wd.forumName || '', 32, 40);
    x.fillStyle = '#b8cfc8'; x.font = F(20); x.fillText(Wd.forumSub || '', 34, 74);
    const card = (y, h) => { x.fillStyle = '#ffffff'; x.fillRect(24, y, W - 48, h); x.strokeStyle = '#d6dbe2'; x.lineWidth = 2; x.strokeRect(24, y, W - 48, h); };
    const wrap = (s, x0, y0, w, lh, max = 3) => {                         // words onto lines, `max` of them
      const ws = String(s || '').split(' '); let line = '', y = y0, n = 0;
      for (const w2 of ws) { const t = line ? line + ' ' + w2 : w2;
        if (x.measureText(t).width > w && line) { x.fillText(line, x0, y); line = w2; y += lh; if (++n >= max) return y; } else line = t; }
      if (line) { x.fillText(line, x0, y); y += lh; }
      return y;
    };
    const mode = o.mode || 'list';
    if (mode === 'compose') {
      const title = Wd.postTitle || '', body = Wd.postBody || '', n = o.chars || 0;
      const tT = title.slice(0, Math.min(n, title.length)), tB = body.slice(0, Math.max(0, n - title.length));
      x.fillStyle = '#23423e'; x.font = F(30, 'bold'); x.fillText('New thread', 40, 136);
      card(170, 72); card(262, 300);
      x.fillStyle = '#7a8698'; x.font = F(18); x.fillText('Title', 44, 186); x.fillText('Message', 44, 278);
      x.fillStyle = '#1e2a3a'; x.font = F(30, 'bold'); x.fillText(tT + (n < title.length && o.blink ? '|' : ''), 44, 220);
      x.font = F(28); const yEnd = wrap(tB + (n >= title.length && !o.post && o.blink ? '|' : ''), 44, 318, W - 100, 40, 6); void yEnd;
      x.fillStyle = o.post ? '#2f8a5a' : '#c8902a'; x.fillRect(W - 220, 590, 180, 64);
      x.fillStyle = '#ffffff'; x.font = F(28, 'bold'); x.textAlign = 'center'; x.fillText(o.post ? 'Posted' : 'Post', W - 130, 622); x.textAlign = 'left';
      return;
    }
    if (mode === 'thread') {
      card(112, 170);
      x.fillStyle = '#1e2a3a'; x.font = F(32, 'bold'); x.fillText(Wd.postTitle || '', 44, 150);
      x.fillStyle = '#7a8698'; x.font = F(18); x.fillText('newshop_sg · 4 days ago', 44, 186);
      x.fillStyle = '#2a3442'; x.font = F(26); wrap(Wd.postBody || '', 44, 226, W - 100, 34, 2);
      const reps = ['reply1', 'reply2', 'reply3', 'reply4', 'reply5'].map(k => Wd[k] || ''), who = ['kopi_uncle', 'Mdm Tan', 'boonchai88', 'pradit_sg', 'old_hand'];
      const n = Math.max(0, Math.min(5, o.n || 0));
      for (let i = 0; i < n; i++) { const y = 300 + i * 82; card(y, 72);
        x.fillStyle = '#23423e'; x.font = F(18, 'bold'); x.fillText(who[i], 44, y + 22);
        x.fillStyle = '#2a3442'; x.font = F(24); x.fillText(reps[i], 44, y + 52); }
      x.fillStyle = '#7a8698'; x.font = F(18); x.textAlign = 'right'; x.fillText(`${n} ${n === 1 ? 'reply' : 'replies'}`, W - 40, 132); x.textAlign = 'left';
      return;
    }
    if (mode === 'post') {
      card(112, 560);
      x.fillStyle = '#1e2a3a'; x.font = F(34, 'bold'); wrap(Wd.threadNew || '', 44, 158, W - 100, 44, 2);
      x.fillStyle = '#7a8698'; x.font = F(18); x.fillText(Wd.threadNewSub || '', 44, 250);
      x.fillStyle = '#d8dce2'; x.fillRect(44, 280, 300, 200);                              // a photograph, not yet loaded
      x.fillStyle = '#b8bec8'; for (let i = 0; i < 7; i++) x.fillRect(370, 290 + i * 28, i === 6 ? 260 : 560 - (i % 3) * 40, 12);
      for (let i = 0; i < 4; i++) x.fillRect(44, 510 + i * 30, 880 - (i % 2) * 120, 12);
      return;
    }
    /* the list: the new thread arriving at the top, then the rest, read down; a lineage chart beside them */
    const rows = ['thread1', 'thread2', 'thread3', 'thread4', 'thread2b', 'thread3b'].map(k => Wd[k] || '').filter(Boolean);
    const newK = Math.max(0, Math.min(1, o.newK || 0)), off = Math.round((o.scroll || 0) * 60);
    const LW = 640;
    x.save(); x.beginPath(); x.rect(0, 100, W, H - 100); x.clip();
    let y = 112 - off + 96 * newK;
    if (newK > 0) {
      const yN = 112 - off - 96 * (1 - newK) + 0;
      x.globalAlpha = newK;
      x.fillStyle = '#fff6d8'; x.fillRect(24, yN, LW, 84); x.strokeStyle = '#e0b84a'; x.lineWidth = 3; x.strokeRect(24, yN, LW, 84);
      x.fillStyle = '#c84a2a'; x.font = F(16, 'bold'); x.fillText('NEW', 40, yN + 22);
      x.fillStyle = '#1e2a3a'; x.font = F(24, 'bold'); wrap(Wd.threadNew || '', 40, yN + 50, LW - 40, 28, 1);
      x.fillStyle = '#7a8698'; x.font = F(16); x.fillText(Wd.threadNewSub || '', 40, yN + 74);
      x.globalAlpha = 1;
    }
    rows.forEach((t, i) => { const yy = y + i * 96;
      x.fillStyle = '#ffffff'; x.fillRect(24, yy, LW, 84); x.strokeStyle = '#d6dbe2'; x.lineWidth = 2; x.strokeRect(24, yy, LW, 84);
      x.fillStyle = '#1e2a3a'; x.font = F(24, 'bold'); wrap(t, 40, yy + 34, LW - 40, 28, 1);
      x.fillStyle = '#7a8698'; x.font = F(16); x.fillText(`${12 + i * 7} replies · ${2 + i} days ago`, 40, yy + 66); });
    x.restore();
    /* the lineage chart: a teacher and his students, boxes and lines, no names that could be read */
    x.fillStyle = '#ffffff'; x.fillRect(LW + 48, 112, W - LW - 72, 420); x.strokeStyle = '#d6dbe2'; x.strokeRect(LW + 48, 112, W - LW - 72, 420);
    x.fillStyle = '#23423e'; x.font = F(18, 'bold'); x.fillText('Lineage', LW + 64, 138);
    const bx2 = (cx, cy) => { x.fillStyle = '#e4ece8'; x.fillRect(cx - 44, cy - 16, 88, 32); x.strokeStyle = '#7a9a90'; x.strokeRect(cx - 44, cy - 16, 88, 32);
      x.fillStyle = '#9ab0a8'; x.fillRect(cx - 30, cy - 3, 60, 6); };
    const cx0 = LW + 48 + (W - LW - 72) / 2;
    x.strokeStyle = '#7a9a90'; x.lineWidth = 2;
    for (const [a, b2] of [[[cx0, 190], [cx0 - 80, 280]], [[cx0, 190], [cx0 + 80, 280]], [[cx0 - 80, 280], [cx0 - 110, 380]], [[cx0 - 80, 280], [cx0 - 30, 380]], [[cx0 + 80, 280], [cx0 + 90, 380]], [[cx0 - 30, 380], [cx0 - 30, 470]]])
      { x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b2[0], b2[1]); x.stroke(); }
    for (const p of [[cx0, 190], [cx0 - 80, 280], [cx0 + 80, 280], [cx0 - 110, 380], [cx0 - 30, 380], [cx0 + 90, 380], [cx0 - 30, 470]]) bx2(p[0], p[1]);
    /* his finger on the pad: the arrow to the new thread, and its click */
    if ((o.cursor || 0) > 0) {
      const k = Math.max(0, Math.min(1, o.cursor)), cx = 820 - 520 * k, cy = 560 - 410 * k;
      x.fillStyle = '#111'; x.strokeStyle = '#fff'; x.lineWidth = 2;
      x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx, cy + 30); x.lineTo(cx + 8, cy + 23); x.lineTo(cx + 14, cy + 36); x.lineTo(cx + 19, cy + 33); x.lineTo(cx + 13, cy + 21); x.lineTo(cx + 23, cy + 21); x.closePath(); x.fill(); x.stroke();
      if (o.click) { x.strokeStyle = 'rgba(200,74,42,0.7)'; x.lineWidth = 3; x.beginPath(); x.arc(cx, cy, 18, 0, Math.PI * 2); x.stroke(); }
    }
  }
  /* HIS NOTEBOOK (the coda): the masters he has checked since, a line each — where, whose student, how many real
     accounts — and some crossed out. Initials, never a name: nobody real is judged in his book (v21.22) */
  function drawNames(x, o = {}) {
    const W = 1024, H = 640, n = Math.max(0, Math.min(7, o.n || 0)), r = rng(7213);
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.fillStyle = '#f8f4e8'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#e8dcc0'; x.fillRect(W / 2 - 3, 0, 6, H);                              // the spine
    x.strokeStyle = 'rgba(90,120,170,0.25)'; x.lineWidth = 1.5;
    for (let y = 70; y < H; y += 42) { x.beginPath(); x.moveTo(20, y); x.lineTo(W / 2 - 20, y); x.moveTo(W / 2 + 20, y); x.lineTo(W - 20, y); x.stroke(); }
    const rows = [['Ajahn K.', 'Lamphun', "teacher? won't say", true], ['Luang Phor T.', 'Ayutthaya', 'student of his abbot · 4 accounts', false],
                  ['Ajahn P.', 'online only', 'no temple · no teacher', true], ['Lersi W.', 'Nakhon Nayok', 'lineage traced · 3 accounts', false],
                  ['Ajahn S.', 'Singapore', 'only his own posts', true], ['Luang Phor B.', 'Surin', 'met devotees · 5 accounts', false],
                  ['Master L.', '?', 'nobody has met him', true]];
    x.fillStyle = '#1c2a6a'; x.textBaseline = 'alphabetic';
    x.font = `bold 30px ${BOOK_HAND}`; x.fillText('Checked', 40, 52);
    rows.slice(0, n).forEach(([who, where, note, out], i) => {
      const left = i < 4, x0 = left ? 40 : W / 2 + 40, y = (left ? 108 : 108) + (left ? i : i - 4) * 126;
      x.fillStyle = '#1c2a6a'; x.font = `bold 28px ${BOOK_HAND}`; x.fillText(who + ' — ' + where, x0, y);
      x.font = `24px ${BOOK_HAND}`; x.fillText(note, x0 + 14, y + 40);
      if (out) { x.strokeStyle = 'rgba(28,42,106,0.85)'; x.lineWidth = 3; x.beginPath(); x.moveTo(x0 - 6, y - 8 + r() * 4); x.lineTo(x0 + 400, y - 12 + r() * 4); x.stroke(); }
      else { x.strokeStyle = '#2f7a4a'; x.lineWidth = 4; x.beginPath(); x.moveTo(x0 + 410, y - 8); x.lineTo(x0 + 420, y + 4); x.lineTo(x0 + 440, y - 22); x.stroke(); }
    });
  }

  /* ====================================================== THE FILMS' CUES (§4, §8)
     Every sound is a literal cue the warm scan can read (v10.2: the time, then the quoted name); the pictures are the stage's (films.frame) */
  function introFilm(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api;
    const O = OPEN;
    c.keepFade = true;                         // it ends on black: the chapter card comes up over it (v14.1)
    c.endFade = 1;                             // (and says so: cineEnd sets the black to endFade before it reads keepFade, v24.21)
    step(0, () => stage.films.begin('open', c, api));
    tr(0, O.end, (k, t) => stage.films.frame('open', t, api), rawK);
    fade(0, 1.0, 1, 1); fade(1.0, 2.6, 1, 0);
    sfx(0.4, 'x2open', 0.75);                  // the fog's own music, under the whole film
    sfx(O.q2o1, 'q2o1', 1);                    // "When I returned to Singapore my mind became extremely foggy."
    sfx(O.cu2a1, 'cu2a1', 1);                  // "Boss, this one... from which temple ah? Who blessed it?"
    sfx(O.q2o2b, 'q2o2b', 1);                  // "Sorry... can you say again?"
    sfx(O.cu2a1b, 'cu2a1b', 1);                // "Aiyo, never mind. I come back another day."
    sfx(O.cu2a1b + SECS.cu2a1b - 0.6, 'x2heels', 0.5);   // her heels on the terrazzo, away
    sfx(O.q2o2, 'q2o2', 1);                    // "I could not think properly."
    sfx(O.o3 + 1.0, 'x2pat', 0.55); sfx(O.o3 + 2.1, 'x2pat', 0.5); sfx(O.o3 + 3.3, 'x2pat', 0.5);   // one pocket, the other, the back
    sfx(O.q2o3, 'q2o3', 1);                    // "I misplaced my wallet, and strangely..."
    sfx(O.o3 + 5.2, 'x2bagzip', 0.4);          // his bag's zip, opened and shut
    sfx(O.q2o4, 'q2o4', 1);                    // "I simply felt unlike myself."
    sfx(O.o4 + 0.4, 'x2ledhum', 0.3);          // the counter's lights, the only sound left near
    fade(O.black, O.end, 0, 1);
    sfxFade(O.black - 1.0, O.end - 0.05, 'x2open');
    sfxFade(O.black - 0.5, O.end - 0.05, 'x2ledhum');
    step(O.end, () => stage.films.end());
  }
  /* P3 · THE CALL (kit.film from play): it hands to the visit on black */
  function callFilm(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api;
    const C = CALL;
    c.keepFade = true; c.endFade = 1;
    step(0, () => stage.films.begin('call', c, api));
    tr(0, C.end, (k, t) => stage.films.frame('call', t, api), rawK);
    sfx(C.pick - 0.4, 'x2pickup', 0.6);        // the phone off the glass
    sfx(C.pick + 0.5, 'x2ring', 0.5);          // ringing in his ear: one ring-ring (Singapore's 0.4 on, 0.2 off, 0.4 on), and Pong answers before the next
    sfx(C.pg2c1, 'pg2c1', 1);                  // "Brother! Long time no reply. You OK or not?"   (the phone's band, CP10)
    sfx(C.q2c1, 'q2c1', 1);                    // "Not really. Since I came back... I can't think..."
    sfx(C.offer - 0.6, 'x2callmus', 0.6);      // a low pad under Pong's offer, opening up at "This one I can vouch for"
    sfx(C.pg2c2, 'pg2c2', 1);                  // "Bro... I know a famous ajahn who is good at clearing dirty things..."
    sfx(C.q2c2, 'q2c2', 1);                    // "Last time you said "trust me" also."
    sfx(C.pg2c3, 'pg2c3', 1);                  // "I know. Sorry, bro. That one I never met. This one, I was there with my mother."
    sfx(C.q2c3, 'q2c3', 1);                    // "...Bring him."
    fade(C.black, C.end, 0, 1);
    sfxFade(C.black - 0.8, C.end - 0.05, 'x2callmus');
    step(C.end, () => stage.films.end());
  }
  /* THE VISIT (kit.film, straight on from the call's black): the next evening */
  function visitFilm(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api;
    const V = VISIT_T;
    c.keepFade = true; c.endFade = 1;
    step(0, () => stage.films.begin('visit', c, api));
    tr(0, V.end, (k, t) => stage.films.frame('visit', t, api), rawK);
    fade(0, 0.5, 1, 1); fade(0.5, 1.6, 1, 0);
    sfx(V.knock + 0.1, 'x2knock', 0.7);        // a knock on the shutter, twice
    sfx(V.lift, 'x2shutterup', 0.75);          // Pong lifting it
    sfx(V.in + 0.3, 'x2steps', 0.45); sfx(V.in + 2.6, 'x2steps', 0.4);   // their feet on his tiles
    sfx(V.in - 0.4, 'x2visit', 0.6);           // the visit's music: plain, open
    sfx(V.q2v1, 'q2v1', 1);                    // "Eventually I approached another Thai practitioner I trusted..."
    sfx(V.pg2v1, 'pg2v1', 1);                  // "Lersi Chin, this is my friend. His shop."
    sfx(V.lc2v1, 'lc2v1', 1);                  // "Sawasdee krap. New shop... tired owner."
    sfx(V.mat + 0.2, 'x2mat', 0.6);            // the mat unrolled on the floor
    fade(V.black, V.end, 0, 1);
    sfxFade(V.black - 1.0, V.end - 0.05, 'x2visit');
    step(V.end, () => stage.films.end());
  }
  /* P6 · THE EXAMINATION (kit.film from play): it ends on play's own view, kneeling before him */
  function examFilm(c, s, api) {
    const { tr, step, sfx, sfxFade, rawK, stage } = api;
    const X = EXAM;
    step(0, () => stage.films.begin('exam', c, api));
    tr(0, X.end, (k, t) => stage.films.frame('exam', t, api), rawK);
    sfx(0.3, 'x2visitmus', 0.32);              // the visit's own bed, low, under the questions
    sfx(X.lc2e1, 'lc2e1', 1);                  // "Give me your hand."
    sfx(X.lc2e2, 'lc2e2', 1);                  // "You sleep?"
    sfx(X.q2e1, 'q2e1', 1);                    // "Not much."
    sfx(X.lc2e3, 'lc2e3', 1);                  // "Eat?"
    sfx(X.q2e2, 'q2e2', 1);                    // "When I remember."
    sfx(X.lc2e4, 'lc2e4', 1);                  // "The wallet... in the fridge?"
    sfx(X.q2e3, 'q2e3', 1);                    // "...Yes."
    sfx(X.lc2e5, 'lc2e5', 1);                  // "You saw a doctor?"
    sfx(X.q2e4, 'q2e4', 1);                    // "Yes. They said stress."
    sfx(X.lc2e6, 'lc2e6', 1);                  // "Mm. Good. Doctor first, always. Now, quiet."
    sfx(X.still + 0.4, 'x2breathslow', 0.4);   // his breath, slow, in the stillness (the fridge's hum under it)
    sfx(X.still + 3.2, 'x2breathslow', 0.35);
    sfx(X.lc2e7, 'lc2e7', 1);                  // "That one... from there?"
    sfx(X.q2e5, 'q2e5', 1);                    // "...Yes. I was told to put it facing the door."
    sfx(X.fetch + 0.1, 'x2rise', 0.5);         // up off the mat
    sfx(X.fetch + 0.9, 'x2steps', 0.4);
    sfx(X.fetch + 2.2, 'x2pickpiece', 0.5);    // the piece off its shelf
    sfx(X.fetch + 3.8, 'x2kneel', 0.5);        // down again before him
    sfx(X.lc2e8, 'lc2e8', 1);                  // "This one, you give to a temple. Don't keep, don't sell, don't throw."
    sfx(X.lc2e8 + SECS.lc2e8 * 0.86, 'x2cloth', 0.4);   // set on the clean cloth
    sfx(X.lc2e9, 'lc2e9', 1);                  // "According to my practice, I believe something negative was placed on you."
    sfx(X.q2e6, 'q2e6', 1);                    // "By him?"
    sfx(X.lc2e10, 'lc2e10', 1);                // "I didn't say that. I said on you."
    sfxFade(X.end - 1.2, X.end - 0.05, 'x2visitmus');
    step(X.end, () => stage.films.end());
  }
  /* P7 · THE CLEARING (kit.film from play, unskippable the first time): the chant captioned on its own breaths, from each
     line's own start (v21.31), so it works muted too; ends on play's view */
  function clearFilm(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage, kit: K2 } = api;
    const K = CLEARF;
    step(0, () => stage.films.begin('clear', c, api));
    tr(0, K.end, (k, t) => stage.films.frame('clear', t, api), rawK);
    sfx(K.lc2k0, 'lc2k0', 1);                  // "Hands together. Close your eyes."
    /* his eyes "closed": the picture dimmed (never black), and opened again as the fog lifts */
    fade(K.lc2k0 + 1.6, K.homage + 0.6, 0, 0.42); fade(K.lift, K.water - 0.6, 0.42, 0);
    sfx(K.homage + 0.4, 'x2candle', 0.5);      // the candles and the incense lit for his teachers
    sfx(K.namo - 0.6, 'x2clearmus', 0.4);      // the clearing's music, under the chant and never over it
    sfx(K.namo, 'lc2namo', 1);                 // Namo tassa bhagavato arahato sammā-sambuddhassa (×3)
    step(K.namo, () => { if (K2 && K2.captions) K2.captions(chantCaps('lc2namo')); });
    sfx(K.sak, 'lc2sak1', 1);                  // Sakkatvā buddha-ratanaṁ...
    step(K.sak, () => { if (K2 && K2.captions) K2.captions(chantCaps('lc2sak1')); });
    sfx(K.lc2sak2, 'lc2sak2', 1);              // Sakkatvā dhamma-ratanaṁ...
    step(K.lc2sak2, () => { if (K2 && K2.captions) K2.captions(chantCaps('lc2sak2')); });
    sfx(K.lc2sak3, 'lc2sak3', 1);              // Sakkatvā saṅgha-ratanaṁ...
    step(K.lc2sak3, () => { if (K2 && K2.captions) K2.captions(chantCaps('lc2sak3')); });
    sfx(K.lift + 0.2, 'x2lift', 0.45);         // the room's sound coming back clear as the grey goes (a soft opening of the air)
    sfx(K.lc2drink, 'lc2drink', 1);            // "Drink. A little."
    sfx(K.lc2drink + SECS.lc2drink + 0.3, 'x2sip', 0.5);
    sfx(K.sprinkle + 0.5, 'x2sprinkle', 0.55); sfx(K.sprinkle + 2.2, 'x2sprinkle', 0.55); sfx(K.sprinkle + 3.9, 'x2sprinkle', 0.5);   // the leaves dipped and flicked
    sfx(K.lc2wrist, 'lc2wrist', 1);            // "Your wrist."
    sfx(K.lc2wrist + 1.1, 'x2thread', 0.5);    // the cotton thread round it, knotted
    sfx(K.lc2k2, 'lc2k2', 1);                  // "Go to a temple this week. Make merit. If the fog comes back, doctor first, then me."
    sfxFade(K.end - 2.0, K.end - 0.05, 'x2clearmus');
    step(K.end, () => stage.films.end());
  }

  /* the ending's own frame and its end: the stage draws it; the card lies over the coda's last black */
  function endingScene(c, api, k, cues) {
    const { tr, step, rawK, stage } = api;
    const T = END[k], total = T.coda + CODA.end;
    step(0, () => stage.films.begin(k, c, api));
    tr(0, total, (kk, t) => stage.films.frame(k, t, api), rawK);
    cues(T);
    step(total, () => stage.films.end());
    c.endFade = 1;
    c.keep.view = true;
  }
  /* THE CODA's cues (every ending): the forum months later, the case file's last paragraph, the new thread opened */
  function codaCues(api, T) {
    const { sfx, sfxFade, fade } = api, C = CODA, t0 = T.coda;
    fade(t0 - 0.5, t0, 0, 1); fade(t0, t0 + 0.8, 1, 0);
    sfx(t0 + 0.3, 'x2codamus', 0.7);           // the coda's music: patient, the question still open
    sfx(t0 + C.q2K1, 'q2K1', 1);               // "Whether you interpret that spiritually or otherwise..."
    sfx(t0 + C.q2K1 + 3.0, 'x2scroll', 0.35);  // his finger on the pad, the list read down
    sfx(t0 + C.q2K2, 'q2K2', 1);               // "I research a master's lineage thoroughly..."
    sfx(t0 + C.q2K2 + 0.6, 'x2page', 0.4);     // the notebook's page turned
    sfx(t0 + C.q2K3, 'q2K3', 1);               // "And yet still, none of them could answer the question I actually carried..."
    sfx(t0 + C.thread + 0.1, 'x2ping', 0.5);   // a new thread at the top
    sfx(t0 + C.q2K4, 'q2K4', 1);               // "That question went unanswered for a long time..."
    sfx(t0 + C.open, 'x2click', 0.55);         // opened
    fade(t0 + C.black, t0 + C.end, 0, 1);
    sfxFade(t0 + C.black - 0.8, t0 + C.end - 0.05, 'x2codamus');
  }
  /* A · WORD GETS AROUND (worst) */
  function scWord(c, s, api) {
    const { sfx, sfxFade, fade } = api;
    endingScene(c, api, 'A', (T) => {
      fade(0, 0.35, 0, 1); fade(0.35, 1.0, 1, 0);                    // that night, alone (a cut in the black)
      sfx(0.5, 'x2endA', 0.6);                                       // the ending's music: tight, unresolved
      sfx(0.9, 'x2keys', 0.55); sfx(3.4, 'x2keys', 0.5);             // typing it
      sfx(T.q2A1, 'q2A1', 1);                                        // "Somebody has to warn people."
      sfx(T.q2A1 + SECS.q2A1 + 0.5, 'x2post', 0.6);                  // posted
      fade(T.days - 0.5, T.days, 0, 1); fade(T.days, T.days + 0.6, 1, 0);   // days later
      sfx(T.days + 1.4, 'x2ping', 0.45); sfx(T.days + 2.6, 'x2ping', 0.45); sfx(T.days + 3.7, 'x2ping', 0.45); sfx(T.days + 4.9, 'x2ping', 0.45);
      sfx(T.call - 1.6, 'x2buzz', 0.6); sfx(T.call - 0.8, 'x2buzz', 0.6);   // his phone: Pong
      sfx(T.call - 0.25, 'x2pickup', 0.5);
      sfx(T.pg2A1, 'pg2A1', 1);                                      // "Bro, why you post? His people calling me..."   (the phone's band, CP10)
      sfx(T.q2A2, 'q2A2', 1);                                        // "I know what I saw."
      sfx(T.pg2A2, 'pg2A2', 1);                                      // "You saw. You don't know."
      sfx(T.cust - 1.7, 'x2stepsin', 0.45);                          // a man's shoes coming up to the counter
      sfx(T.cu2b1, 'cu2b1', 1);                                      // "Eh, you the one who posted about that Thai ajahn?"
      sfx(T.q2A3, 'q2A3', 1);                                        // "I was sure enough to stay away from him..."
      sfxFade(T.coda - 1.2, T.coda + 0.2, 'x2endA');
      codaCues(api, T);
    });
  }
  /* B · NOT MY ROAD (good) */
  function scRoad(c, s, api) {
    const { sfx, sfxFade } = api;
    endingScene(c, api, 'B', (T) => {
      sfx(T.q2B1, 'q2B1', 1);                                        // "Lersi Chin... will you teach me? I see things. I don't know why."
      sfx(T.q2B1 + 1.2, 'x2bowl', 0.45);                             // the bowl set down
      sfx(T.look - 0.2, 'x2endB', 0.55);                             // the ending's music: warm, open (it holds the long look)
      sfx(T.lc2B1, 'lc2B1', 1);                                      // "Why you see, what it is for... that question is bigger than my practice..."
      sfx(T.lc2B2, 'lc2B2', 1);                                      // "Someone can. Not me. When you find him, don't take my word..."
      sfx(T.pg2B1, 'pg2B1', 1);                                      // "This time we check first, bro."
      sfx(T.go + 1.5, 'x2rise', 0.5);                                // up, his bag on his shoulder
      sfx(T.go + 2.0, 'x2steps', 0.45);
      sfx(T.go + 2.6, 'x2shutterup', 0.6);                           // Pong lifting the shutter for them
      sfx(T.q2B2, 'q2B2', 1);                                        // "He had cleared me. He could not tell me what I was for..."
      sfxFade(T.coda - 1.2, T.coda + 0.2, 'x2endB');
      codaCues(api, T);
    });
  }
  /* C · SEND IT BACK (bad) */
  function scBack(c, s, api) {
    const { sfx, sfxFade } = api;
    endingScene(c, api, 'C', (T) => {
      sfx(T.q2C1, 'q2C1', 1);                                        // "Lersi Chin... can you send it back? To whoever did this."
      sfx(T.stop - 0.2, 'x2endC', 0.5);                              // the ending's music: one low held note, then the weight of it
      sfx(T.lc2C1, 'lc2C1', 1);                                      // "I clear. I don't send."
      sfx(T.lc2C2, 'lc2C2', 1);                                      // "If I send, I carry it. If you ask me to send, you carry it also."
      sfx(T.pg2C1, 'pg2C1', 1);                                      // "Bro..."
      sfx(T.q2C2, 'q2C2', 1);                                        // "He did this to me."
      sfx(T.lc2C3, 'lc2C3', 1);                                      // "Maybe. Maybe not. Either way, you are clear now..."
      sfx(T.go + 1.4, 'x2rise', 0.5);
      sfx(T.go + 1.9, 'x2steps', 0.45);
      sfx(T.go + 2.5, 'x2shutterup', 0.6);
      sfx(T.alone + 0.1, 'x2shutter', 0.7);                          // the shutter pulled down behind them
      sfx(T.q2C3, 'q2C3', 1);                                        // "I wanted him to feel what I had felt..."
      sfxFade(T.coda - 1.2, T.coda + 0.2, 'x2endC');
      codaCues(api, T);
    });
  }
  /* D · ENOUGH (best) */
  function scEnough(c, s, api) {
    const { sfx, sfxFade, fade } = api;
    endingScene(c, api, 'D', (T) => {
      sfx(T.q2D1, 'q2D1', 1);                                        // "Thank you, Lersi Chin."
      sfx(T.lc2D1, 'lc2D1', 1);                                      // "Go well. Make merit when you can."
      sfx(T.pg2D1, 'pg2D1', 1);                                      // "Bro, go eat something?"
      sfx(T.go + 0.2, 'x2rise', 0.5);
      sfx(T.go + 1.6, 'x2steps', 0.45);
      sfx(T.go + 2.3, 'x2shutterup', 0.6);
      sfx(T.go + 3.0, 'x2corridor', 0.5);                            // the mall's corridor at night, empty, their steps in it
      sfxFade(T.morning - 0.6, T.morning, 'x2corridor');
      fade(T.morning - 0.5, T.morning, 0, 1); fade(T.morning, T.morning + 0.7, 1, 0);   // the next morning
      sfx(T.morning + 0.1, 'x2endD', 0.6);                           // the ending's music: bright, unhurried
      sfx(T.morning + 0.2, 'x2shutterup', 0.7);                      // his shutter going up on a clear morning
      sfx(T.morning + 3.2, 'x2pat', 0.5); sfx(T.morning + 3.75, 'x2wallet', 0.5);  // his pocket — and the wallet in it
      sfx(T.cu2a2 - 1.6, 'x2heelsin', 0.45);                         // her heels coming back up to his counter
      sfx(T.cu2a2, 'cu2a2', 1);                                      // "Boss, this one... from which temple ah?"
      sfx(T.q2D2, 'q2D2', 1);                                        // "This one? A temple in Ayutthaya. The card is inside, let me show you."
      sfx(T.q2D2 + 0.5, 'x2case', 0.45);                             // the cased piece lifted from the tray
      sfx(T.q2D3, 'q2D3', 1);                                        // "I had enough to decide. There was nothing more worth proving."
      sfxFade(T.coda - 1.2, T.coda + 0.2, 'x2endD');
      codaCues(api, T);
    });
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e4c2 = Object.assign(DATA, {
    build,
    scenes: [scWord, scRoad, scBack, scEnough],
    intro: introFilm,
    films: { call: callFilm, visit: visitFilm, exam: examFilm, clear: clearFilm }
  });
})();
