
  /* ====================================================== THIS CHAPTER'S DRAWN SURFACES
     Flat things with holes in them that are drawn, not modelled (the plan's §6.3: cloth, woven things and wire): the
     lattice of the fence, a louvred window, and one handful of petals. */
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
    return done(THREE, c, false);
  }

  /* ====================================================== THE FILMS' CUES (M6)
     Until each ending is directed, its scene is a held black with nothing in it, so the chapter can be played to its
     card while it is being built (a preview: the tracker's D12). */
  function holdScene(c, s, api) {
    const { tr, fade, rawK } = api;
    tr(0, 2.4, () => {}, rawK);
    fade(0, 0.8, 0, 1); fade(0.8, 2.4, 1, 1);
    c.endFade = 1;
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e4c3 = Object.assign(DATA, {
    build,
    scenes: [holdScene, holdScene, holdScene, holdScene]
  });
})();
