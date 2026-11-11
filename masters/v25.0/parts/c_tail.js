
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
  /* (v25.4) black smoke: ONE STREAM, drawn upright from the foot of the picture: thin and dark where it leaves the
     thing, wavering, wider and fainter as it climbs, two thinner strands leaving it on the way, gone before the
     picture's top (white in the sheet and blackened by its material; `seed` draws another stream, so two side by side
     are not one shape twice). Photographed before this: round puffs read as dark balls hanging over the piece; one
     ragged plume up a wide S read as slanted strokes of charcoal, every wisp leaning the same way; and a stream of a
     hundred separate dabs read as a row of ink blots */
  function makeDarkPuff(THREE, cnv, seed) {
    const W = 128, H = 256, [c, x] = sized(cnv, W, H), r = rng(seed);
    x.clearRect(0, 0, W, H);
    /* one strand from share v0 to v1 of the height (0 the foot): a path of two slow waves that swing wider as it climbs,
       stamped with hundreds of faint soft discs a pixel apart (a ribbon, never a row of beads), wider and fainter upward */
    const strand = (x0, v0, v1, amp, wid, dens) => {
      const p1 = r() * 6.283, p2 = r() * 6.283, f1 = 0.7 + r() * 0.5, f2 = 1.9 + r() * 0.9, n = Math.round(260 * (v1 - v0));
      for (let i = 0; i < n; i++) {
        const v = v0 + (v1 - v0) * (i + r()) / n, t = (v - v0) / (v1 - v0);
        const px = W / 2 + x0 * (0.3 + v) + (Math.sin(v * f1 * 6.283 + p1) * 0.7 + Math.sin(v * f2 * 6.283 + p2) * 0.3) * amp * (0.25 + v);
        const py = H - 16 - v * (H - 40), rr = wid * (0.5 + 1.9 * v) * (0.8 + r() * 0.4);
        const a = dens * Math.min(1, t / 0.07) * Math.pow(1 - t, 1.3) * (0.7 + r() * 0.6);
        const g = x.createRadialGradient(px, py, 0, px, py, rr);
        g.addColorStop(0, `rgba(255,255,255,${a.toFixed(3)})`); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(px - rr, py - rr, rr * 2, rr * 2);
      }
    };
    strand(0, 0, 1, 13, 8, 0.18);                                              // the stream
    strand((r() - 0.5) * 16, 0.22 + r() * 0.15, 0.95, 16, 5, 0.12);            // two thinner strands that leave it on the way up
    strand((r() - 0.5) * 20, 0.4 + r() * 0.15, 0.9, 12, 4, 0.09);
    return done(THREE, c, false);
  }
  /* (v25.5) THE MASTER'S AURA, three sheets, each white on nothing and tinted by its material (gold as he chants, white
     as he searches): a soft light the shape of a man sitting (a wide low mass for his crossed legs, his trunk, his head
     and over it), faded out at its foot where it stands on the floor; a fan of rays, each a thin bright wedge inside a
     wider faint one, none reaching the sheet's edge; and a soft ring, for the ripples on the mat. No canvas filter is
     used (iOS has none) */
  function makeAuraBody(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    x.clearRect(0, 0, S, S); x.globalCompositeOperation = 'lighter';
    const blob = (cx, cy, rx, ry, a) => { x.save(); x.translate(cx, cy); x.scale(rx / 100, ry / 100);
      const g = x.createRadialGradient(0, 0, 0, 0, 0, 100);
      g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(0.45, `rgba(255,255,255,${(a * 0.6).toFixed(3)})`); g.addColorStop(0.75, `rgba(255,255,255,${(a * 0.18).toFixed(3)})`); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.fillRect(-100, -100, 200, 200); x.restore(); };
    blob(128, 178, 126, 72, 0.52); blob(128, 132, 92, 96, 0.5); blob(128, 82, 68, 74, 0.5);
    x.globalCompositeOperation = 'destination-in';
    const f = x.createLinearGradient(0, 0, 0, S); f.addColorStop(0, 'rgba(0,0,0,1)'); f.addColorStop(0.78, 'rgba(0,0,0,1)'); f.addColorStop(0.97, 'rgba(0,0,0,0)');
    x.fillStyle = f; x.fillRect(0, 0, S, S);
    x.globalCompositeOperation = 'source-over';
    return done(THREE, c, false);
  }
  function makeAuraRays(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(9161), N = 40;
    x.clearRect(0, 0, S, S); x.save(); x.translate(S / 2, S / 2); x.globalCompositeOperation = 'lighter';
    for (let i = 0; i < N; i++) {
      const a = (i + r() * 0.8) / N * Math.PI * 2, len = 150 + r() * 96, w = 0.014 + r() * 0.04, al = 0.1 + r() * 0.2;
      for (const [ww, aa] of [[w * 2.4, al * 0.35], [w * 1.4, al * 0.6], [w * 0.6, al]]) {
        const g = x.createRadialGradient(0, 0, 36, 0, 0, len); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.3, `rgba(255,255,255,${aa.toFixed(3)})`); g.addColorStop(1, 'rgba(255,255,255,0)');
        x.fillStyle = g; x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, len, a - ww, a + ww); x.closePath(); x.fill();
      }
    }
    x.restore(); x.globalCompositeOperation = 'source-over';
    return done(THREE, c, false);
  }
  function makeAuraRing(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    x.clearRect(0, 0, S, S);
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.6, 'rgba(255,255,255,0)'); g.addColorStop(0.8, 'rgba(255,255,255,0.7)'); g.addColorStop(0.86, 'rgba(255,255,255,0.7)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return done(THREE, c, false);
  }
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
  /* HIS LAPTOP'S FORUM (ending A and the coda), drawn on the laptop's 1024 x 720 screen. Its name is Chad's (v25.5: "The
     forum shown on his laptop should be called 'Amulet Forums'"); its look is this game's own, no real site's (v9.3).
     (v25.5, Chad: "Please improve this look of this forum much further visually, it looks bad now. Also when he loads the
     last thread about the wai kru, have some content in that thread, show the post content ... when the player scrolls
     the forum, it is very slow and jerky, and the selected thread is visually cut off. Just please improve this whole
     part.") What was wrong, measured: everything was drawn from the screen's left edge, and a phone sees the middle two
     thirds of the screen (its first letters and the lineage panel were cut); the list moved 60 px in fifteen seconds,
     in whole pixels; the new thread arrived at the top of a list already scrolled up under the header; and the opened
     thread was a title over three grey bars. Now: ONE COLUMN IN THE MIDDLE of the screen (FX0..FX1, what a phone's crop
     holds) carries everything that must be read, the gutters either side what a wide screen has room for (the boards,
     a lineage chart); a header with its mark, its tabs and a search field; threads as cards (who, when, how many
     answers); the scroll in pixels and fractions of them (`scroll`); the pointer drawn where the film puts it (`cx`,
     `cy`), the card under it lit (`hover`), its click (`click`) and the page's loading bar (`load`).
     Modes: `compose` (his post typed: `chars` of it, `caret`, `post` once sent), `thread` (it, and `n` of the answers,
     the fraction the next one sliding in), `list` (the threads; `newK` the new one arriving at the top), `post` (the new
     thread opened: its words, and two answers) */
  const FX0 = 192, FX1 = 832;
  function drawForum(x, o = {}) {
    const W = 1024, H = 720, Wd = o.words || {}, CW = FX1 - FX0;
    const F = (s, w = '') => `${w} ${s}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    const SERIF = (s, w = '') => `${w} ${s}px Georgia, "Times New Roman", serif`;
    const INK = '#1b2733', DIM = '#6d7a88', LINE = '#d9e0e7', GOLD = '#d9a441', TEAL = '#1e3338';
    const c01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
    const rr = (px, py, w, h, r) => { x.beginPath(); x.moveTo(px + r, py); x.lineTo(px + w - r, py); x.quadraticCurveTo(px + w, py, px + w, py + r); x.lineTo(px + w, py + h - r);
      x.quadraticCurveTo(px + w, py + h, px + w - r, py + h); x.lineTo(px + r, py + h); x.quadraticCurveTo(px, py + h, px, py + h - r); x.lineTo(px, py + r); x.quadraticCurveTo(px, py, px + r, py); x.closePath(); };
    const card = (px, py, w, h, fill = '#ffffff', edge = LINE, lw = 1.5) => { x.fillStyle = 'rgba(20,34,48,0.06)'; rr(px, py + 2, w, h, 9); x.fill();
      x.fillStyle = fill; rr(px, py, w, h, 9); x.fill(); x.strokeStyle = edge; x.lineWidth = lw; x.stroke(); };
    /* words onto lines no wider than w: the lines, as many as `max` (the last one closed with … if words are left) */
    const lines = (s, w, max = 9) => { const ws = String(s || '').split(' '), out = []; let line = '';
      for (let i = 0; i < ws.length; i++) { const t = line ? line + ' ' + ws[i] : ws[i];
        if (x.measureText(t).width > w && line) { out.push(line); line = ws[i]; if (out.length === max) { out[max - 1] += '…'; return out; } } else line = t; }
      if (line) out.push(line); return out; };
    const para = (s, px, py, w, lh, max) => { const L = lines(s, w, max); L.forEach((l, i) => x.fillText(l, px, py + i * lh)); return py + L.length * lh; };
    /* a member's round picture: a colour by who it is, and the first letter */
    const TINTS = ['#3f8f7b', '#c0703a', '#5a78b8', '#9a5aa8', '#b8923a', '#4f8fae', '#b85a6a', '#6a8a4a'];
    const face = (cx, cy, r, who) => { let h = 0; for (const ch of who) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
      x.fillStyle = TINTS[h % TINTS.length]; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#ffffff'; x.font = F(Math.round(r * 1.05), 'bold'); x.textAlign = 'center'; x.fillText(who.charAt(0).toUpperCase(), cx, cy + r * 0.37); x.textAlign = 'left'; };
    const chip = (px, py, label, fill, ink) => { x.font = F(12, 'bold'); const w = x.measureText(label).width + 16; x.fillStyle = fill; rr(px, py, w, 20, 10); x.fill(); x.fillStyle = ink; x.fillText(label, px + 8, py + 14.5); return w; };

    /* ---- the page, its header, its tabs */
    x.fillStyle = '#edf0f3'; x.fillRect(0, 0, W, H);
    const hg = x.createLinearGradient(0, 0, W, 0); hg.addColorStop(0, '#162a2e'); hg.addColorStop(0.5, '#22404a'); hg.addColorStop(1, '#162a2e');
    x.fillStyle = hg; x.fillRect(0, 0, W, 66);
    /* its mark: a lotus bud in a ring, drawn (no real site's) */
    { const mx = FX0 + 22, my = 33; x.strokeStyle = '#f0cf7e'; x.lineWidth = 2; x.beginPath(); x.arc(mx, my, 19, 0, Math.PI * 2); x.stroke();
      x.fillStyle = '#f0cf7e'; for (const a of [-0.55, 0, 0.55]) { x.save(); x.translate(mx, my + 9); x.rotate(a); x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(-7, -11, 0, -21); x.quadraticCurveTo(7, -11, 0, 0); x.fill(); x.restore(); } }
    x.fillStyle = '#f3d68e'; x.font = SERIF(27, 'bold'); x.fillText(Wd.forumName || '', FX0 + 52, 33);
    x.fillStyle = '#a8c2bf'; x.font = F(13); x.fillText(Wd.forumSub || '', FX0 + 53, 52);
    /* a search field, and who is signed in */
    x.fillStyle = 'rgba(255,255,255,0.12)'; rr(FX1 - 210, 19, 158, 28, 14); x.fill();
    x.strokeStyle = 'rgba(255,255,255,0.55)'; x.lineWidth = 1.8; x.beginPath(); x.arc(FX1 - 192, 32, 5.5, 0, Math.PI * 2); x.moveTo(FX1 - 188, 36); x.lineTo(FX1 - 184, 40); x.stroke();
    face(FX1 - 18, 33, 15, 'newshop_sg');
    x.fillStyle = '#12232a'; x.fillRect(0, 66, W, 38);
    { let tx = FX0; x.font = F(15, 'bold');
      String(Wd.forumTabs || '').split('|').forEach((tab, i) => { const w = x.measureText(tab).width, on = i === 1;
        x.fillStyle = on ? '#f3d68e' : '#9db3b6'; x.fillText(tab, tx, 91); if (on) { x.fillStyle = '#f3d68e'; x.fillRect(tx, 100, w, 3); } tx += w + 30; }); }
    /* the page loading (a bar under the tabs) */
    if ((o.load || 0) > 0) { x.fillStyle = GOLD; x.fillRect(0, 104, W * c01(o.load) * 0.92, 3); }

    /* ---- the gutters: what a wide screen has room for (a phone's crop does not reach them) */
    { card(16, 122, 160, 236); x.fillStyle = DIM; x.font = F(12, 'bold'); x.fillText('BOARDS', 30, 146);
      String(Wd.forumBoards || '').split('|').forEach((b, i) => { const by = 158 + i * 32, on = b === (Wd.forumBoard || '');
        if (on) { x.fillStyle = '#eaf2f1'; rr(22, by, 148, 27, 6); x.fill(); x.fillStyle = '#2a6a62'; x.fillRect(22, by + 4, 3, 19); }
        x.fillStyle = TINTS[(i * 3 + 1) % TINTS.length]; rr(32, by + 7, 13, 13, 3); x.fill();
        x.fillStyle = on ? TEAL : '#44515e'; x.font = F(13, on ? 'bold' : ''); let lb = b; while (lb.length > 3 && x.measureText(lb).width > 112) lb = lb.slice(0, -2) + '…'; x.fillText(lb, 53, by + 18.5); });
      /* the lineage chart: a teacher and his students, boxes and lines, no names that could be read */
      const lx = FX1 + 16, lw = W - lx - 16; card(lx, 122, lw, 250); x.fillStyle = DIM; x.font = F(12, 'bold'); x.fillText('LINEAGE', lx + 14, 146);
      const cx0 = lx + lw / 2, nd = [[0, 176], [-38, 232], [38, 232], [-56, 288], [-18, 288], [40, 288], [-18, 342]];
      x.strokeStyle = '#8fada6'; x.lineWidth = 1.6;
      for (const [a, b] of [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [4, 6]]) { x.beginPath(); x.moveTo(cx0 + nd[a][0], nd[a][1]); x.lineTo(cx0 + nd[b][0], nd[b][1]); x.stroke(); }
      nd.forEach(([dx, y], i) => { x.fillStyle = i ? '#e6eeeb' : '#f5e6bd'; rr(cx0 + dx - 17, y - 11, 34, 22, 5); x.fill(); x.strokeStyle = i ? '#8fada6' : '#c9a655'; x.stroke();
        x.fillStyle = i ? '#a7bcb6' : '#c9a655'; x.fillRect(cx0 + dx - 10, y - 2, 20, 4); });
      card(lx, 386, lw, 92); x.fillStyle = DIM; x.font = F(12, 'bold'); x.fillText('ONLINE', lx + 14, 410);
      ['kopi_uncle', 'Mdm Tan', 'boonchai88', 'old_hand'].forEach((w2, i) => { face(lx + 28 + i * 33, 444, 13, w2); x.fillStyle = '#39b36b'; x.beginPath(); x.arc(lx + 38 + i * 33, 454, 4, 0, Math.PI * 2); x.fill(); }); }

    const crumb = (tail) => { x.font = F(14); x.fillStyle = DIM; let cx = FX0; const parts = ['Forums', Wd.forumBoard || ''].concat(tail ? [tail] : []);
      parts.forEach((p, i) => { const last = i === parts.length - 1; x.fillStyle = last ? INK : DIM; x.font = F(14, last ? 'bold' : ''); x.fillText(p, cx, 136); cx += x.measureText(p).width + 8;
        if (!last) { x.fillStyle = '#9aa6b2'; x.font = F(14); x.fillText('›', cx, 136); cx += 15; } }); };
    const button = (px, py, w, h, label, fill, ink) => { x.fillStyle = fill; rr(px, py, w, h, 8); x.fill(); x.fillStyle = ink; x.font = F(15, 'bold'); x.textAlign = 'center'; x.fillText(label, px + w / 2, py + h / 2 + 5.5); x.textAlign = 'left'; };
    const pointer = (cx, cy, click) => {
      if ((click || 0) > 0 && click < 1) { x.strokeStyle = `rgba(217,164,65,${(0.85 * (1 - click)).toFixed(3)})`; x.lineWidth = 3; x.beginPath(); x.arc(cx + 2, cy + 2, 8 + 20 * click, 0, Math.PI * 2); x.stroke(); }
      x.fillStyle = '#16181c'; x.strokeStyle = '#ffffff'; x.lineWidth = 2; x.lineJoin = 'round';
      x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx, cy + 25); x.lineTo(cx + 6.5, cy + 19); x.lineTo(cx + 11.5, cy + 30); x.lineTo(cx + 16, cy + 28); x.lineTo(cx + 11, cy + 17.5); x.lineTo(cx + 19.5, cy + 17.5); x.closePath(); x.stroke(); x.fill(); };
    const mode = o.mode || 'list';

    if (mode === 'compose') {
      const title = Wd.postTitle || '', body = Wd.postBody || '', n = o.chars || 0, car = o.caret && !o.post ? '|' : '';
      const tT = title.slice(0, Math.min(n, title.length)), tB = body.slice(0, Math.max(0, n - title.length));
      crumb('New thread');
      card(FX0, 152, CW, 470);
      x.fillStyle = INK; x.font = SERIF(24, 'bold'); x.fillText('Start a new thread', FX0 + 24, 194);
      x.fillStyle = DIM; x.font = F(13, 'bold'); x.fillText('TITLE', FX0 + 24, 228); x.fillText('MESSAGE', FX0 + 24, 310);
      const field = (py, h, live) => { x.fillStyle = '#f7f9fb'; rr(FX0 + 24, py, CW - 48, h, 7); x.fill(); x.strokeStyle = live ? '#7fa8d8' : LINE; x.lineWidth = live ? 2 : 1.5; x.stroke(); };
      field(238, 48, n < title.length); field(320, 216, n >= title.length && !o.post);
      x.fillStyle = INK; x.font = F(21, 'bold'); x.fillText(tT + (n < title.length ? car : ''), FX0 + 38, 269);
      x.font = F(20); para(tB + (n >= title.length ? car : ''), FX0 + 38, 354, CW - 80, 30, 6);
      face(FX0 + 42, 580, 16, 'newshop_sg'); x.fillStyle = DIM; x.font = F(14); x.fillText('Posting as newshop_sg', FX0 + 68, 585);
      if (o.post) { button(FX1 - 158, 560, 134, 42, 'Posted', '#2f8a5a', '#ffffff');
        x.strokeStyle = '#ffffff'; x.lineWidth = 2.5; x.lineCap = 'round'; x.beginPath(); x.moveTo(FX1 - 140, 581); x.lineTo(FX1 - 134, 587); x.lineTo(FX1 - 124, 575); x.stroke(); x.lineCap = 'butt'; }
      else button(FX1 - 158, 560, 134, 42, 'Post thread', GOLD, '#2a2110');
      return;
    }
    if (mode === 'thread') {
      crumb();
      const n = Math.max(0, Math.min(5, o.n || 0)), full = Math.floor(n + 1e-6);
      card(FX0, 152, CW, 150);
      x.fillStyle = INK; x.font = SERIF(25, 'bold'); x.fillText(Wd.postTitle || '', FX0 + 22, 190);
      face(FX0 + 38, 222, 15, 'newshop_sg'); x.fillStyle = INK; x.font = F(14, 'bold'); x.fillText('newshop_sg', FX0 + 62, 220);
      x.fillStyle = DIM; x.font = F(13); x.fillText('4 days ago', FX0 + 62, 237);
      x.fillStyle = '#2a3643'; x.font = F(19); para(Wd.postBody || '', FX0 + 22, 272, CW - 44, 27, 2);
      x.fillStyle = DIM; x.font = F(14, 'bold'); x.textAlign = 'right'; x.fillText(`${full} ${full === 1 ? 'reply' : 'replies'}`, FX1 - 4, 136); x.textAlign = 'left';
      const reps = ['reply1', 'reply2', 'reply3', 'reply4', 'reply5'].map(k => Wd[k] || ''), who = ['kopi_uncle', 'Mdm Tan', 'boonchai88', 'pradit_sg', 'old_hand'];
      for (let i = 0; i < 5; i++) { const k = c01(n - i); if (k <= 0) break;
        const y = 316 + i * 78 + 14 * (1 - k); x.globalAlpha = k; card(FX0, y, CW, 68, i === full && k < 1 ? '#fffbee' : '#ffffff');
        face(FX0 + 36, y + 34, 17, who[i]);
        x.fillStyle = TEAL; x.font = F(14, 'bold'); x.fillText(who[i], FX0 + 64, y + 26);
        x.fillStyle = '#2a3643'; x.font = F(18); let rp = reps[i]; while (rp.length > 8 && x.measureText(rp).width > CW - 88) rp = rp.slice(0, -2) + '…'; x.fillText(rp, FX0 + 64, y + 50); x.globalAlpha = 1; }
      return;
    }
    if (mode === 'post') {
      /* the thread opened: its own words (the chapter's last picture, so a phone's crop holds every line: the column) */
      crumb(); x.globalAlpha = o.fade == null ? 1 : c01(o.fade);
      card(FX0, 152, CW, 318, '#ffffff', '#e0c476', 2);
      chip(FX0 + 22, 168, 'WAI KRU', '#f6e7bd', '#7a5a12'); chip(FX0 + 104, 168, 'UDON THANI', '#e3eef0', '#2a5f66');
      x.fillStyle = INK; x.font = SERIF(25, 'bold'); const ty = para(Wd.threadNew || '', FX0 + 22, 222, CW - 44, 31, 2);
      face(FX0 + 38, ty + 8, 15, 'ton_udon'); x.fillStyle = INK; x.font = F(14, 'bold'); x.fillText('ton_udon', FX0 + 62, ty + 6);
      x.fillStyle = DIM; x.font = F(13); x.fillText(Wd.threadNewSub || '', FX0 + 62, ty + 23);
      x.fillStyle = '#263240'; x.font = F(18.5); para(Wd.threadNewBody || '', FX0 + 22, ty + 56, CW - 44, 26.5, 7);
      x.fillStyle = DIM; x.font = F(14, 'bold'); x.fillText('2 replies', FX0 + 4, 498);
      [['kopi_uncle', Wd.threadNewReply1], ['Mdm Tan', Wd.threadNewReply2]].forEach(([w2, s], i) => { const y = 510 + i * 70; card(FX0, y, CW, 60);
        face(FX0 + 34, y + 30, 16, w2); x.fillStyle = TEAL; x.font = F(14, 'bold'); x.fillText(w2, FX0 + 60, y + 24);
        x.fillStyle = '#2a3643'; x.font = F(17); x.fillText(s || '', FX0 + 60, y + 46); });
      x.fillStyle = '#f7f9fb'; rr(FX0, 656, CW - 110, 40, 8); x.fill(); x.strokeStyle = LINE; x.lineWidth = 1.5; x.stroke();
      x.fillStyle = '#9aa6b2'; x.font = F(15); x.fillText('Write a reply…', FX0 + 16, 681); button(FX1 - 98, 656, 98, 40, 'Reply', GOLD, '#2a2110');
      x.globalAlpha = 1;
      return;
    }
    /* ---- the list: the board's threads, read down; the new one arriving at the top (the rest moved down for it) */
    crumb();
    button(FX1 - 122, 116, 122, 30, 'New thread', GOLD, '#2a2110');
    const keys = ['thread1', 'thread2', 'thread3', 'thread4', 'thread2b', 'thread3b', 'thread5', 'thread6', 'thread7', 'thread8'];
    const rows = keys.map(k => Wd[k] || '').filter(Boolean);
    const who = ['old_hand', 'pradit_sg', 'Mdm Tan', 'lersi_fan', 'kopi_uncle', 'boonchai88', 'ton_udon', 'ah_seng', 'nong_may', 'first_timer'];
    const tags = [['PINNED', '#f6e7bd', '#7a5a12'], ['ACCOUNTS', '#e3eef0', '#2a5f66'], ['GUIDE', '#e6ecf8', '#33508a'], ['ACCOUNTS', '#e3eef0', '#2a5f66'], ['GUIDE', '#e6ecf8', '#33508a'],
                  ['WAI KRU', '#f6e7bd', '#7a5a12'], ['WAI KRU', '#f6e7bd', '#7a5a12'], ['TEMPLES', '#efe6f4', '#6a3f86'], ['PICTURES', '#e9f2e4', '#3f6a2a'], ['NEWCOMERS', '#f8e9e4', '#8a4a33']];
    const newK = c01(o.newK || 0), NEWH = 104, PITCH = 92, top = 158, hov = c01(o.hover || 0);
    x.save(); x.beginPath(); x.rect(0, 150, W, H - 150); x.clip();
    const y0 = top - (o.scroll || 0);
    if (newK > 0) {
      const yN = y0 - (NEWH + 8) * (1 - newK); x.globalAlpha = newK;
      card(FX0, yN, CW, NEWH, hov > 0 ? '#fff1c9' : '#fff7df', '#e0b84a', 2 + hov);
      face(FX0 + 36, yN + 40, 20, 'ton_udon');
      const cw2 = chip(FX0 + 68, yN + 12, 'NEW', '#d9532f', '#ffffff'); chip(FX0 + 74 + cw2, yN + 12, 'WAI KRU', '#f6e7bd', '#7a5a12');
      x.fillStyle = INK; x.font = F(19.5, 'bold'); const ly = para(Wd.threadNew || '', FX0 + 68, yN + 56, CW - 96, 24, 2);
      if (hov > 0.5) { x.fillStyle = INK; x.fillRect(FX0 + 68, yN + 59, Math.min(CW - 96, x.measureText(lines(Wd.threadNew || '', CW - 96, 2)[0] || '').width), 1.5); }
      x.fillStyle = DIM; x.font = F(13.5); x.fillText('ton_udon · ' + (Wd.threadNewSub || ''), FX0 + 68, Math.max(ly, yN + 80) + 8);
      x.globalAlpha = 1;
    }
    rows.forEach((t, i) => { const yy = y0 + (NEWH + 8) * newK + i * PITCH; if (yy > H || yy + 84 < 150) return;
      card(FX0, yy, CW, 84);
      face(FX0 + 36, yy + 42, 20, who[i % who.length]);
      x.fillStyle = INK; x.font = F(19.5, 'bold'); let tt = t; while (tt.length > 8 && x.measureText(tt).width > CW - 176) tt = tt.slice(0, -2) + '…'; x.fillText(tt, FX0 + 68, yy + 36);
      x.fillStyle = DIM; x.font = F(13.5); const meta = `${who[i % who.length]} · ${2 + i} days ago`; x.fillText(meta, FX0 + 68, yy + 60);
      const tg = tags[i % tags.length]; chip(FX0 + 80 + x.measureText(meta).width, yy + 45.5, tg[0], tg[1], tg[2]);
      x.fillStyle = INK; x.font = F(18, 'bold'); x.textAlign = 'center'; x.fillText(String(12 + i * 7), FX1 - 44, yy + 40);
      x.fillStyle = DIM; x.font = F(12); x.fillText('replies', FX1 - 44, yy + 58); x.textAlign = 'left'; });
    x.restore();
    /* the list's own scroll bar, at the column's edge */
    { const full = rows.length * PITCH + (NEWH + 8) * newK + 16, view = H - 150, k = Math.min(1, view / full), at = c01((o.scroll || 0) / Math.max(1, full - view));
      x.fillStyle = 'rgba(30,50,60,0.10)'; rr(FX1 + 5, 156, 5, view - 12, 2.5); x.fill();
      x.fillStyle = 'rgba(30,50,60,0.38)'; rr(FX1 + 5, 156 + (view - 12) * (1 - k) * at, 5, (view - 12) * k, 2.5); x.fill(); }
    /* his finger on the pad: the pointer where the film has it, and its click */
    if (o.cx != null) pointer(o.cx, o.cy, o.click);
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
    /* (v25.5) her shoes are v25.0's own four steps again (x2heels, x2heelsin): the woman in green wears low-heeled
       flats, and the take measures as a soft shoe's tap, not a stiletto's click (3 % of it over 3 kHz). For the day
       episode 1's auntie wore the part they were flat sandals (x2sandals, x2sandalsin: retired with her) */
    sfx(O.cu2a1b + SECS.cu2a1b - 0.6, 'x2heels', 0.5);   // her shoes on the terrazzo, away
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
    /* (v25.5) the phone stays on the glass, on its speaker: the sound of it lifted off the glass is out (x2pickup, retired) */
    sfx(C.pick + 0.5, 'x2ring', 0.55);         // ringing on its speaker: one ring-ring (Singapore's 0.4 on, 0.2 off, 0.4 on), and Pong answers before the next
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
    /* (v25.5) it opens on them walking in: the knock is out (x2knock, retired), the shutter's last rattle is under the
       black as its curtain comes to rest, and their feet are on his tiles from the first second to the master's stop */
    sfx(0.02, 'x2shutterup', 0.6);             // the shutter going up for them, under the black
    sfx(V.in + 0.3, 'x2steps', 0.45); sfx(V.in + 2.9, 'x2steps', 0.4); sfx(V.in + 5.3, 'x2steps', 0.3);   // their feet on his tiles
    sfx(V.in - 0.38, 'x2visit', 0.6);          // the visit's music: plain, open
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
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api;
    const X = EXAM;
    step(0, () => stage.films.begin('exam', c, api));
    tr(0, X.end, (k, t) => stage.films.frame('exam', t, api), rawK);
    /* (v25.5) the piece off its shelf: a blink of the film's own, and it is gone from it (the pictures: examShots) */
    fade(X.fetch + EX_TAKE - 0.16, X.fetch + EX_TAKE, 0, 1); fade(X.fetch + EX_TAKE, X.fetch + EX_TAKE + 0.2, 1, 0);
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
    sfx(X.fetch + EX_TAKE - 0.1, 'x2pickpiece', 0.55);   // the piece off its shelf (v25.5: his rising, his steps and his kneeling again went with the walk that is no longer shown)
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
    /* his eyes "closed": the picture dimmed (never black). (v25.5) It lightens as the light gathers (seen through his
       lids, and brighter with each saying), and the dim is gone as the light reaches him: the white is white */
    fade(K.lc2k0 + 1.6, K.homage + 0.6, 0, 0.42); fade(K.om + 0.2, K.om + 6.4, 0.42, 0.14); fade(K.fly - 0.1, K.flash - 0.25, 0.14, 0);
    /* THE WHITE (Chad: "the whole screen flashes and fades white quickly for a moment, before being fully cleared"): the
       film's fade, in white (the engine's forty-third seam): up in a quarter of a second as the light reaches him, held
       less than half a second (the room becomes the room cleared under it: clearShots), gone by `clear` */
    fade(K.flash - 0.22, K.flash + 0.04, 0, 1, '#ffffff'); fade(K.flash + 0.42, K.clear, 1, 0, '#ffffff');
    sfx(K.homage + 0.4, 'x2candle', 0.5);      // the candles and the incense lit for his teachers
    sfx(K.om - 0.6, 'x2clearmus', 0.4);        // the clearing's music, under the mantra and never over it: its second bell is on the white (masters/v25.5/make.sh)
    sfx(K.om - 0.6, 'x2gather', 0.32);         // the light gathering: a rise that goes all the way to the sending, under his voice
    sfx(K.om, 'lc2om', 1);                     // Om Namah Shivaya (×3)
    step(K.om, () => { if (K2 && K2.captions) K2.captions(chantCaps('lc2om')); });
    sfx(K.flash - 0.86, 'x2release', 0.62);    // the light sent: its rush in, and its burst (0.86 s into the file) on the white
    sfx(K.flash + 0.3, 'x2lift', 0.45);        // the room's sound coming back clear as the white goes (a soft opening of the air)
    sfx(K.lc2drink, 'lc2drink', 1);            // "Drink. A little."
    sfx(K.water + 2.1, 'x2sip', 0.5);         // (v25.2) its sip (0.5 s in) as the bowl he holds out tips to him
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
    sfx(t0 + 7.4, 'x2scroll', 0.28);           // (v25.5) and again, the third flick; and once more, back up to the top
    sfx(t0 + C.thread - 4.7, 'x2scroll', 0.26);
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
      sfx(T.call - 1.6, 'x2buzz', 0.6); sfx(T.call - 0.8, 'x2buzz', 0.6);   // his phone: Pong (v25.5: taken on its speaker, where it lies)
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
      sfx(T.q2B1, 'q2B1', 1);                                        // "Lersi Chin... will you teach me? I feel things, and sometimes I cannot control my body. I don't know why."
      sfx(T.look - 0.2, 'x2endB', 0.55);                             // the ending's music: warm, open (it holds the long look)
      sfx(T.lc2B1, 'lc2B1', 1);                                      // "Why you feel, why your body moves without you... what it is for. That question is bigger than my practice..."
      sfx(T.lc2B2, 'lc2B2', 1);                                      // "Someone can teach you. Not me. When you find him, don't take my word..."
      sfx(T.pg2B1, 'pg2B1', 1);                                      // "This time we check first, bro."
      /* (v25.5) the two go out at a master's pace: the shutter lifted first, their steps for as long as they walk */
      sfx(T.go + 1.5, 'x2rise', 0.5);                                // up, his bag on his shoulder
      sfx(T.go + 2.0, 'x2shutterup', 0.6);                           // Pong lifting the shutter for them
      sfx(T.go + 2.3, 'x2steps', 0.45); sfx(T.go + 5.2, 'x2steps', 0.4); sfx(T.go + 8.0, 'x2steps', 0.26);
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
      sfx(T.go + 1.9, 'x2shutterup', 0.6);
      sfx(T.go + 2.2, 'x2steps', 0.45); sfx(T.go + 5.1, 'x2steps', 0.4); sfx(T.go + 7.6, 'x2steps', 0.26);
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
      sfx(T.go + 0.5, 'x2shutterup', 0.6);
      sfx(T.go + 0.9, 'x2steps', 0.45); sfx(T.go + 3.6, 'x2steps', 0.4);
      sfx(T.go + 3.0, 'x2corridor', 0.5);                            // the mall's corridor at night, empty, their steps in it
      sfxFade(T.morning - 0.6, T.morning, 'x2corridor');
      fade(T.morning - 0.5, T.morning, 0, 1); fade(T.morning, T.morning + 0.7, 1, 0);   // the next morning
      sfx(T.morning + 0.1, 'x2endD', 0.6);                           // the ending's music: bright, unhurried
      sfx(T.morning + 0.2, 'x2shutterup', 0.7);                      // his shutter going up on a clear morning
      sfx(T.morning + 3.2, 'x2pat', 0.5); sfx(T.morning + 3.75, 'x2wallet', 0.5);  // his pocket — and the wallet in it
      sfx(T.cu2a2 - 1.6, 'x2heelsin', 0.45);                         // her shoes coming back up to his counter
      sfx(T.cu2a2, 'cu2a2', 1);                                      // "Boss, this one... from which temple ah?"
      sfx(T.q2D2, 'q2D2', 1);                                        // "This one? A temple in Ayutthaya. The card is inside, let me show you."
      /* (v25.5) the cased piece lies on the glass and is only looked at: the sound of it lifted from the tray is out (x2case, retired) */
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
