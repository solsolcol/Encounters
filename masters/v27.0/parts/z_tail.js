  /* ====================================================== THIS CHAPTER'S DRAWN SURFACES' HELPERS (chapter 3's own) */
//@@COPY 9015-9015 :: function rng(seed)
//@@COPY 9059-9063 :: function done(THREE, c, rep) {
//@@COPY 9097-9097 :: function noMip(THREE, t)

  /* THE FOUR ENDINGS (the plan's §4.5): each a whole story, written at M7. Until then each is two seconds of the room
     going to black, so the chapter can be walked to its decision and through it while it is built (a PREVIEW: D9) */
  function endingStub(c, s, api) { const { tr, fade } = api; c.keepFade = true; c.endFade = 1; tr(0, 2.2, () => {}); fade(0.2, 2.0, 0, 1); }
  function scHold(c, s, api) { endingStub(c, s, api); }
  function scThrow(c, s, api) { endingStub(c, s, api); }
  function scGo(c, s, api) { endingStub(c, s, api); }
  function scKeep(c, s, api) { endingStub(c, s, api); }

  /* THE TRANCE (the plan's §4.4), a film from play at the turning point; the decision opens where it ends (M7 writes it:
     until then two seconds of the dark room, so the chapter reaches its decision while it is built) */
  function filmTrance(c, s, api) { const { tr } = api; tr(0, 2.0, () => {}); }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e4c4 = Object.assign(DATA, {
    build,
    films: { trance: filmTrance },
    scenes: [scHold, scThrow, scGo, scKeep]
  });
})();
