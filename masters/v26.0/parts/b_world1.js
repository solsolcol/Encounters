  function build(ctx) {
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, cnv, loadImageTexture,
            assetBytes, rescueTextures, getState, startDecision, worldSfx, warmSounds, soundOff, unifySkeletons,
            makeHellNote, HEAD_RE } = ctx;

    /* (the v21.1 TDZ law: everything a builder or a frame asks for is declared up here, before anything is built) */
    const owned = [];
    let alive = true;
    const parsedGlb = new Map();
    const madeTex = [];
    const tex = (t) => { madeTex.push(t); return t; };
    const noteTex = tex(makeHellNote());                  // the contract wants one (the engine's note prop reads it at boot)
    const mats = [];
    const M = (o) => { const m = new THREE.MeshStandardMaterial(o); mats.push(m); return m; };
    const B = (o) => { const m = new THREE.MeshBasicMaterial(o); mats.push(m); return m; };   // unlit: a glow, a painted layer
    const wallNow = () => performance.now() / 1000;
    const have = (key) => DATA.assets.includes(key);      // a thing is asked for only once its file is in the build
    const waiting = new Set();                            // the keys the world names that have not landed yet (stage.info)
    const c01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v), smo = (k) => k * k * (3 - 2 * k), sgk = (t, a, b) => c01((t - a) / (b - a));
    const lp = (a, b, k) => a + (b - a) * k, lp3 = (a, b, k) => [lp(a[0], b[0], k), lp(a[1], b[1], k), lp(a[2], b[2], k)];
    const angTo = (a, b) => Math.atan2(Math.sin(b - a), Math.cos(b - a));
    const isNarrow = () => camera.aspect < 1;

    /* ------------------------------------------------------------- THE GROUND'S PLAN (the tracker's §10)
       x east, z south, the origin the middle of the turf. Every place in this chapter is one of these numbers. */
    const TURF = { x0: -10, x1: 10, z0: -9, z1: 12, strip: 2 };
    const GRAVEL = { z0: -10.5, z1: -9 };
    const TABLES = { x0: -2.5, x1: 2.5, z0: -12.4, z1: -10.0, tops: [0.75, 1.05, 1.35], step: 0.8 };   // three steps, the lowest in front (south)
    const WHEEL = { x: 0, z: -12.0 };
    const PARASOL = { x: 0, z: -12.75 };
    const POLE = { x: 0.6, z: -13.6, h: 10 };
    const HALL = { x0: -5, x1: 5, z0: -25, z1: -17, eave: 3.2, ridge: 6.0, over: 1.0 };
    const SHED = { x0: -16, x1: -10.5, z0: -14, z1: -8, eave: 2.4 };
    const TENT_W1 = { x: -9, z: -1 }, TENT_W2 = { x: -9, z: 5 }, TENT_E = { x: 9, z: -2 };
    const TENT = { w: 4, eave: 2.2, peak: 3.3 };
    const CHIEF = { x: 6, z: 9, w: 4.5, eave: 2.3, peak: 3.1 };                // Grandmaster Pho's canopy; his bench faces north-west
    const BENCH = { x: 6.6, z: 9.6, ry: Math.atan2(-1, -1) + Math.PI };        // where he sits, turned to the turf's middle
    const HOUSE = { x: 12.5, z0: -7, z1: 6, h: 5.2 };
    const PLANK = { x0: 8.5, x1: 13, z: 11.5 };
    const GREY = { x0: 0, x1: 8.5, z: 13.2, h: 4.2 };
    const FENCE = { x: -10.3, z0: -9, z1: -4, h: 1.0 };
    const WAYIN = { x: -4, z: 12.3 };
    /* the sun of each look, as a direction it shines FROM (painted shadows fall the other way) */
    const SUNS = { DAY1: [17, 20, 10], DAWN: [22, 7.5, 9], AFTERNOON: [-20, 9, 6] };

    const world = new THREE.Group();
    scene.add(world);
    const dayOne = new THREE.Group(), dayTwo = new THREE.Group(), nightG = new THREE.Group();   // what only one of the three looks draws
    world.add(dayOne); world.add(dayTwo); world.add(nightG);
    dayTwo.visible = false; nightG.visible = false;

    const walls = [], solids = [];
    const matProxy = M({ color: 0x8d7a66, roughness: 0.9 });
    /* a thing he cannot walk through: a box, never drawn (collision is a column from the floor: v5.03) */
    const solidBox = (w, h, d, x, y, z, ry = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matProxy);
      m.position.set(x, y, z); m.rotation.y = ry; m.visible = false; world.add(m); solids.push(m); return m;
    };

//@@COPY 396-523 :: /* ------------------------------------------------- one parse per asset */

    /* ------------------------------------------------- the ground's surfaces (masters/v26.0/tex)
       Each is a picture made from his photograph of the real surface. A material stands in its surface's own average
       colour until its picture lands, so nothing flashes white; an ImageBitmap ignores flipY, so the picture is turned
       by its repeat. `tile` is the size of one tile in metres (the geometry's UVs are metres). */
    const SURF = {
      turf: [0x3f9a22, 'image/jpeg'], petalturf: [0x9a9c2c, 'image/jpeg'], earth: [0xb0663e, 'image/jpeg'], gravel: [0x9b968d, 'image/jpeg'],
      rooftile: [0xc66f63, 'image/jpeg'], redplank: [0x8a2c26, 'image/jpeg'], tin: [0xcb8083, 'image/jpeg'], timber: [0x57392a, 'image/jpeg'],
      brick: [0x96573f, 'image/jpeg'], skirt: [0x1f9c3a, 'image/jpeg'], satin: [0xe9e9e9, 'image/jpeg'], mat: [0xc7b78a, 'image/jpeg'],
      carpet: [0x74202a, 'image/jpeg'], swag: [0xf2f0e4, 'image/webp'], banner: [0xe8e8e8, 'image/webp'], treeline: [0x4c7a3a, 'image/webp']
    };
    const surfTex = new Map();
    function surfLoad(name) {
      if (!surfTex.has(name)) {
        const key = 'w3t_' + name;
        if (!have(key)) { waiting.add(key); surfTex.set(name, Promise.resolve(null)); }
        else surfTex.set(name, loadImageTexture(key, SURF[name][1]).then(t => { if (t && alive) madeTex.push(t); return alive ? t : null; }).catch(() => null));
      }
      return surfTex.get(name);
    }
    /* a material of a surface. o: tile [u, v] metres (or one number), mirror 'u' | 'v' | 'uv', clamp (one picture, laid
       once: its piece is drawn with tile = its own size), tint, basic (unlit), cut (its holes cut out), and whatever else
       a material takes */
    function surf(name, o = {}) {
      const { tile = 1, mirror = '', tint = null, basic = false, cut = false, clampV = false, clamp = false, ...rest } = o;
      const avg = new THREE.Color(SURF[name][0]); if (tint != null) avg.multiply(new THREE.Color(tint));
      const base = { color: avg, ...rest };
      if (!basic) { if (base.roughness == null) base.roughness = 0.9; if (base.metalness == null) base.metalness = 0; }
      if (cut) { base.alphaTest = 0.5; base.side = THREE.DoubleSide; }
      const m = basic ? B(base) : M(base);
      surfLoad(name).then(t0 => {
        if (!t0 || !alive) return;
        const t = t0.clone(); t.needsUpdate = true; madeTex.push(t);
        const tu = Array.isArray(tile) ? tile[0] : tile, tv = Array.isArray(tile) ? tile[1] : tile;
        t.wrapS = clamp ? THREE.ClampToEdgeWrapping : /u/.test(mirror) ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping;
        t.wrapT = clamp || clampV ? THREE.ClampToEdgeWrapping : /v/.test(mirror) ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping;
        t.repeat.set(1 / tu, -1 / tv); t.offset.set(0, 1);
        m.map = t; m.color.set(tint != null ? tint : 0xffffff); m.needsUpdate = true;
      });
      return m;
    }

    /* ------------------------------------------------- what never moves is merged, one mesh a material
       quad(): a flat four-cornered piece, a → b its u and a → d its v, both in metres (front: a, b, c, d anticlockwise).
       box(): six of them. geo(): any three geometry, its own UVs scaled. flush() makes the meshes. */
    const batches = new Map();
    const batchOf = (mat) => { let b = batches.get(mat); if (!b) batches.set(mat, b = { mat, p: [], n: [], u: [] }); return b; };
    function quad(mat, a, b, c, d, u0 = 0, v0 = 0) {
      const Bt = batchOf(mat);
      const ax = b[0] - a[0], ay = b[1] - a[1], az = b[2] - a[2], dx = d[0] - a[0], dy = d[1] - a[1], dz = d[2] - a[2];
      const lu = Math.hypot(ax, ay, az), lv = Math.hypot(dx, dy, dz);
      let nx = ay * dz - az * dy, ny = az * dx - ax * dz, nz = ax * dy - ay * dx; const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
      const P = [a, b, c, a, c, d], U = [[u0, v0], [u0 + lu, v0], [u0 + lu, v0 + lv], [u0, v0], [u0 + lu, v0 + lv], [u0, v0 + lv]];
      for (let i = 0; i < 6; i++) { Bt.p.push(P[i][0], P[i][1], P[i][2]); Bt.n.push(nx, ny, nz); Bt.u.push(U[i][0], U[i][1]); }
    }
    /* a triangle (a gable's end), its UVs the wall's own metres from a */
    function tri(mat, a, b, c, u0 = 0, v0 = 0) {
      const Bt = batchOf(mat);
      const ax = b[0] - a[0], ay = b[1] - a[1], az = b[2] - a[2], dx = c[0] - a[0], dy = c[1] - a[1], dz = c[2] - a[2];
      let nx = ay * dz - az * dy, ny = az * dx - ax * dz, nz = ax * dy - ay * dx; const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
      const lu = Math.hypot(ax, az) || Math.hypot(ax, ay, az), hu = Math.hypot(dx, dz);
      const U = [[u0, v0], [u0 + lu, v0 + ay], [u0 + hu, v0 + dy]];
      [a, b, c].forEach((p, i) => { Bt.p.push(p[0], p[1], p[2]); Bt.n.push(nx, ny, nz); Bt.u.push(U[i][0], U[i][1]); });
    }
    const floor = (mat, x0, z0, x1, z1, y = 0) => quad(mat, [x0, y, z1], [x1, y, z1], [x1, y, z0], [x0, y, z0], x0, -z1);
    /* an upright piece from (x0, z0) to (x1, z1): it faces the left of that way (west to east faces south) */
    const wall = (mat, x0, z0, x1, z1, y0, y1, u0 = 0) => quad(mat, [x0, y0, z0], [x1, y0, z1], [x1, y1, z1], [x0, y1, z0], u0, y0);
    function box(mat, cx, cy, cz, w, h, d, ry = 0, top = mat, skipBottom = true) {
      const c = Math.cos(ry), s = Math.sin(ry), hw = w / 2, hh = h / 2, hd = d / 2;
      const P = (lx, ly, lz) => [cx + lx * c + lz * s, cy + ly, cz - lx * s + lz * c];
      const a = P(-hw, -hh, hd), b = P(hw, -hh, hd), e = P(hw, -hh, -hd), f = P(-hw, -hh, -hd);
      const a1 = P(-hw, hh, hd), b1 = P(hw, hh, hd), e1 = P(hw, hh, -hd), f1 = P(-hw, hh, -hd);
      quad(mat, a, b, b1, a1, 0, cy - hh); quad(mat, b, e, e1, b1, 0, cy - hh); quad(mat, e, f, f1, e1, 0, cy - hh); quad(mat, f, a, a1, f1, 0, cy - hh);
      quad(top, a1, b1, e1, f1);
      if (!skipBottom) quad(mat, f, e, b, a);
    }
    const _gm = new THREE.Matrix4(), _gv = new THREE.Vector3(), _gn = new THREE.Matrix3();
    function geo(mat, g0, m4, su = 1, sv = 1) {
      const g = g0.index ? g0.toNonIndexed() : g0, Bt = batchOf(mat);
      const pa = g.attributes.position, na = g.attributes.normal, ua = g.attributes.uv;
      _gn.getNormalMatrix(m4);
      for (let i = 0; i < pa.count; i++) {
        _gv.fromBufferAttribute(pa, i).applyMatrix4(m4); Bt.p.push(_gv.x, _gv.y, _gv.z);
        _gv.fromBufferAttribute(na, i).applyMatrix3(_gn).normalize(); Bt.n.push(_gv.x, _gv.y, _gv.z);
        Bt.u.push(ua ? ua.getX(i) * su : 0, ua ? ua.getY(i) * sv : 0);
      }
      if (g !== g0) g.dispose(); g0.dispose();
    }
    /* an upright round post from the ground (or y0) to y1 */
    function post(mat, x, z, r, y0, y1, sides = 8, r1 = r) {
      geo(mat, new THREE.CylinderGeometry(r1, r, y1 - y0, sides, 1, true), _gm.makeTranslation(x, (y0 + y1) / 2, z), 2 * Math.PI * r, y1 - y0);
    }
    /* a straight round bar between two points */
    const _ba = new THREE.Vector3(), _bb = new THREE.Vector3(), _bq = new THREE.Quaternion(), _bu = new THREE.Vector3(0, 1, 0), _bs = new THREE.Vector3(1, 1, 1);
    function bar(mat, a, b, r, sides = 6) {
      _ba.set(a[0], a[1], a[2]); _bb.set(b[0], b[1], b[2]);
      const len = _ba.distanceTo(_bb); if (len < 1e-4) return;
      _bq.setFromUnitVectors(_bu, _bb.clone().sub(_ba).normalize());
      _gm.compose(_ba.clone().add(_bb).multiplyScalar(0.5), _bq, _bs);
      geo(mat, new THREE.CylinderGeometry(r, r, len, sides, 1, true), _gm, 2 * Math.PI * r, len);
    }
    function flush(parent = world) {
      for (const Bt of batches.values()) {
        if (!Bt.p.length) continue;
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(Bt.p, 3));
        g.setAttribute('normal', new THREE.Float32BufferAttribute(Bt.n, 3));
        g.setAttribute('uv', new THREE.Float32BufferAttribute(Bt.u, 2));
        g.computeBoundingSphere(); g.computeBoundingBox();
        const m = new THREE.Mesh(g, Bt.mat); m.receiveShadow = false; m.castShadow = false; m.matrixAutoUpdate = false; m.updateMatrix();
        parent.add(m); owned.push(m);
      }
      batches.clear();
    }

    /* a seeded stream (v6.15): every scatter in this chapter is the same scatter on every run */
    function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

    /* ------------------------------------------------- a model stood once (a tree, a seat, the parasol)
       Prepped in real metres with its origin on its base's middle (v13.1), so a place is a place; `h` fits one that
       was not (a tree from an earlier chapter) to a height. Answers the group at once; the model lands in it. */
    function stand(key, x, y, z, ry = 0, o = {}) {
      const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; (o.parent || world).add(g);
      if (!have(key)) { waiting.add(key); return g; }
      parseOnce(key).then(({ scene: src }) => {
        if (!alive) return;
        const m = src.clone(true);
        m.traverse(q => { if (q.isMesh) { q.castShadow = false; q.receiveShadow = false; q.material = q.material.clone(); mats.push(q.material); bronzeLift(q, o.lift || 3); } });
        if (o.h) { m.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(m); const k = o.h / Math.max(1e-3, bb.max.y - bb.min.y);
          m.scale.multiplyScalar(k); m.position.y -= bb.min.y * k; m.position.x -= (bb.min.x + bb.max.x) / 2 * k; m.position.z -= (bb.min.z + bb.max.z) / 2 * k; }
        if (o.s) m.scale.multiplyScalar(o.s);
        g.add(m); g.userData.model = m;
        if (o.done) o.done(m, g);
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
      return g;
    }
    /* many of one thing (the copied manyOf), asked for only once its file is in the build */
    function many(key, list, parent = world, size = 0.3, done = null) {
      if (!list.length) return;
      if (!have(key)) { waiting.add(key); return; }
      manyOf(key, list, parent, size, done);
    }

    /* ================================================================ THE GROUND
       Red earth under everything; the turf in strips with their seams; a strip of gravel before the tables. */
    const mEarth = surf('earth', { tile: 2.5, roughness: 1 });
    const mTurf = surf('turf', { tile: 2, roughness: 0.95 });
    const mGravel = surf('gravel', { tile: 1.5, roughness: 1 });
    function buildGround() {
      floor(mEarth, -46, -46, 46, 46, -0.012);
      floor(mTurf, TURF.x0, TURF.z0, TURF.x1, TURF.z1, 0);
      floor(mGravel, TURF.x0 - 0.6, GRAVEL.z0, TURF.x1 + 0.6, GRAVEL.z1, -0.004);
      /* the turf is rolls laid side by side, north to south: where two meet, a thin teal line (photograph 10) */
      const mSeam = M({ color: 0x1f8f7c, roughness: 0.9 });
      for (let x = TURF.x0 + TURF.strip; x < TURF.x1 - 0.01; x += TURF.strip) floor(mSeam, x - 0.012, TURF.z0, x + 0.012, TURF.z1, 0.003);
      /* its cut edge: a hand's width of darker pile all round, so it reads as a thing laid on the earth */
      const mEdge = M({ color: 0x2c6f1c, roughness: 1 });
      wall(mEdge, TURF.x0, TURF.z1, TURF.x1, TURF.z1, -0.012, 0.004); wall(mEdge, TURF.x1, TURF.z0, TURF.x0, TURF.z0, -0.012, 0.004);
      wall(mEdge, TURF.x1, TURF.z1, TURF.x1, TURF.z0, -0.012, 0.004); wall(mEdge, TURF.x0, TURF.z0, TURF.x0, TURF.z1, -0.012, 0.004);
    }

    /* ================================================================ THE HALL (photographs 8, 10, 4, 1)
       A wooden hall behind the tables: red-brown brick below and dark timber above, a dark doorway and steps; a red
       tiled roof in two tiers, the upper a gable to the south with red barge boards, the lower a skirt all round; white
       fretwork under the eaves. Built plainly: what stands behind it no photograph shows. */
    const mTile = surf('rooftile', { tile: [2.2, 2.9], clampV: false, roughness: 0.85, side: THREE.DoubleSide });
    const mTimber = surf('timber', { tile: 2.2, mirror: 'uv', roughness: 0.9 });
    const mBrick = surf('brick', { tile: 1.6, mirror: 'uv', roughness: 0.95 });
    const mRedPlank = surf('redplank', { tile: 2.0, mirror: 'uv', roughness: 0.85 });
    const mTin = surf('tin', { tile: 1.8, roughness: 0.7, side: THREE.DoubleSide });
    const mBarge = M({ color: 0xa02a22, roughness: 0.7 });
    const mDark = M({ color: 0x15100c, roughness: 1 });
    const mWhite = M({ color: 0xf2efe6, roughness: 0.8 });
    const mConcrete = M({ color: 0xa9a49a, roughness: 0.95 });
    function buildHall() {
      const H = HALL, e = H.eave, ov = H.over, brickH = 1.1;
      const cx = (H.x0 + H.x1) / 2;
      /* the walls: brick to the sill, timber to the eave */
      const ring = [[H.x0, H.z1, H.x1, H.z1], [H.x1, H.z1, H.x1, H.z0], [H.x1, H.z0, H.x0, H.z0], [H.x0, H.z0, H.x0, H.z1]];
      for (const [xa, za, xb, zb] of ring) { wall(mBrick, xa, za, xb, zb, 0, brickH); wall(mTimber, xa, za, xb, zb, brickH, e + 0.5); }
      /* the doorway, dark, with its frame; three steps up to it */
      wall(mDark, cx - 0.75, H.z1 + 0.012, cx + 0.75, H.z1 + 0.012, 0.45, 2.55);
      for (const sx of [-1, 1]) box(mWhite, cx + sx * 0.82, 1.5, H.z1 + 0.03, 0.1, 2.2, 0.08);
      box(mWhite, cx, 2.62, H.z1 + 0.03, 1.74, 0.1, 0.08);
      for (let st = 0; st < 3; st++) box(mConcrete, cx, (st + 1) * 0.075, H.z1 + 0.75 - st * 0.28, 2.4, (st + 1) * 0.15, 0.3);
      /* two shuttered windows either side of the door */
      const mShutter = M({ color: 0x3a2619, roughness: 0.85 });
      for (const sx of [-1, 1]) { wall(mShutter, cx + sx * 3.1 - 0.55, H.z1 + 0.014, cx + sx * 3.1 + 0.55, H.z1 + 0.014, 1.3, 2.5);
        box(mWhite, cx + sx * 3.1, 1.24, H.z1 + 0.03, 1.3, 0.07, 0.07); box(mWhite, cx + sx * 3.1, 2.56, H.z1 + 0.03, 1.3, 0.07, 0.07); }
      /* THE LOWER ROOF: a skirt all round, from the eave line (overhanging) up to a ring part way in */
      const y0 = e, y1 = e + 1.15, in0 = 1.9;                                  // the skirt rises 1.15 m over 1.9 + the overhang
      const o = { x0: H.x0 - ov, x1: H.x1 + ov, z0: H.z0 - ov, z1: H.z1 + ov }, i = { x0: H.x0 + in0, x1: H.x1 - in0, z0: H.z0 + in0, z1: H.z1 - in0 };
      quad(mTile, [o.x0, y0, o.z1], [o.x1, y0, o.z1], [i.x1, y1, i.z1], [i.x0, y1, i.z1]);            // south, facing the tables
      quad(mTile, [o.x1, y0, o.z1], [o.x1, y0, o.z0], [i.x1, y1, i.z0], [i.x1, y1, i.z1]);            // east
      quad(mTile, [o.x1, y0, o.z0], [o.x0, y0, o.z0], [i.x0, y1, i.z0], [i.x1, y1, i.z0]);            // north
      quad(mTile, [o.x0, y0, o.z0], [o.x0, y0, o.z1], [i.x0, y1, i.z1], [i.x0, y1, i.z0]);            // west
      /* its edge board, white, and the fretwork hanging under it on the side the tables see */
      wall(mWhite, o.x0, o.z1, o.x1, o.z1, y0 - 0.16, y0 + 0.02); wall(mWhite, o.x1, o.z1, o.x1, o.z0, y0 - 0.16, y0 + 0.02);
      wall(mWhite, o.x0, o.z0, o.x0, o.z1, y0 - 0.16, y0 + 0.02);
      const mFret = B({ map: tex(makeFretwork(THREE, cnv)), transparent: false, alphaTest: 0.5, side: THREE.DoubleSide, color: 0xf4f1e8 });
      { const g = new THREE.PlaneGeometry(o.x1 - o.x0, 0.34); const uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setX(k, uv.getX(k) * (o.x1 - o.x0) / 0.68);
        const m = new THREE.Mesh(g, mFret); m.position.set(cx, y0 - 0.32, o.z1 + 0.004); world.add(m); owned.push(m); }
      /* the short wall between the two roofs, timber */
      for (const [xa, za, xb, zb] of [[i.x0, i.z1, i.x1, i.z1], [i.x1, i.z1, i.x1, i.z0], [i.x1, i.z0, i.x0, i.z0], [i.x0, i.z0, i.x0, i.z1]]) wall(mTimber, xa, za, xb, zb, y1 - 0.05, y1 + 0.55);
      /* THE UPPER ROOF: a gable whose ridge runs north to south, its end to the tables */
      const g0 = y1 + 0.5, ridge = H.ridge + 0.6, gx0 = i.x0 - 0.45, gx1 = i.x1 + 0.45, gz0 = i.z0 - 0.3, gz1 = i.z1 + 0.5;
      quad(mTile, [gx0, g0, gz0], [gx0, g0, gz1], [cx, ridge, gz1], [cx, ridge, gz0]);                 // west slope (its eave the picture's u, so the tiles hang down it)
      quad(mTile, [gx1, g0, gz1], [gx1, g0, gz0], [cx, ridge, gz0], [cx, ridge, gz1]);                 // east slope
      tri(mTimber, [i.x0, g0, i.z1 + 0.02], [i.x1, g0, i.z1 + 0.02], [cx, ridge - 0.12, i.z1 + 0.02]);  // the gable's end, timber
      tri(mTimber, [i.x1, g0, i.z0 - 0.02], [i.x0, g0, i.z0 - 0.02], [cx, ridge - 0.12, i.z0 - 0.02]);
      /* red barge boards up both rakes of the south gable, crossing at the ridge (the Thai way), and a white sun-burst
         of slats under them */
      bar(mBarge, [gx0 - 0.1, g0 - 0.12, gz1 + 0.03], [cx + 0.35, ridge + 0.42, gz1 + 0.03], 0.085, 4);
      bar(mBarge, [gx1 + 0.1, g0 - 0.12, gz1 + 0.03], [cx - 0.35, ridge + 0.42, gz1 + 0.03], 0.085, 4);
      for (let k = -3; k <= 3; k++) bar(mWhite, [cx + k * 0.42, g0 + 0.04, i.z1 + 0.05], [cx + k * 0.1, ridge - 0.5 - Math.abs(k) * 0.07, i.z1 + 0.05], 0.022, 4);
      /* he cannot walk into it (it stands outside the ground he is kept on: this is for a film's lens) */
    }

    /* ================================================================ WHAT STANDS ROUND THE TURF
       The open shed (west), the white lattice fence, the red wooden house (east), the red plank wall and the pale grey
       building behind the chief canopy (south-east). Photographs 10, 12, 11, 5 and 6. */
    function buildSurround() {
      /* the open shed: posts and a pink corrugated roof falling to the east (its high side to the west) */
      const S0 = SHED, hi = S0.eave + 1.2, lo = S0.eave;
      const mPost = M({ color: 0x8a8376, roughness: 0.9 });
      for (const x of [S0.x0 + 0.2, (S0.x0 + S0.x1) / 2, S0.x1 - 0.2]) for (const z of [S0.z0 + 0.2, (S0.z0 + S0.z1) / 2, S0.z1 - 0.2])
        box(mPost, x, lp(hi, lo, (x - S0.x0) / (S0.x1 - S0.x0)) / 2, z, 0.1, lp(hi, lo, (x - S0.x0) / (S0.x1 - S0.x0)), 0.1);
      /* (a tin roof's eave is its picture's u, so the corrugations run down the slope) */
      quad(mTin, [S0.x1 + 0.6, lo - 0.02, S0.z1 + 0.5], [S0.x1 + 0.6, lo - 0.02, S0.z0 - 0.5], [S0.x0 - 0.5, hi + 0.09, S0.z0 - 0.5], [S0.x0 - 0.5, hi + 0.09, S0.z1 + 0.5]);
      const mRafter = M({ color: 0x5a4636, roughness: 0.9 });
      for (const z of [S0.z0 + 0.2, (S0.z0 + S0.z1) / 2, S0.z1 - 0.2]) bar(mRafter, [S0.x0 + 0.2, hi + 0.02, z], [S0.x1 - 0.2, lo + 0.02, z], 0.045, 4);
      /* a second, lower shed roof seen behind the west tents (photograph 10's left edge) */
      quad(mTin, [-12.2, 2.5, 9], [-12.2, 2.5, -6], [-17.5, 3.4, -6], [-17.5, 3.4, 9]);
      wall(mBrick, -12.4, 9, -12.4, -6, 0, 2.45); wall(mWhite, -12.38, 8.9, -12.38, -5.9, 0.9, 2.3);
      /* the white lattice fence: posts, two rails and the lattice between them (a drawn sheet with holes) */
      const mLattice = B({ map: tex(makeLattice(THREE, cnv)), alphaTest: 0.5, side: THREE.DoubleSide, color: 0xf2f1ec });
      const fence = (xa, za, xb, zb) => {
        const len = Math.hypot(xb - xa, zb - za), g = new THREE.PlaneGeometry(len, FENCE.h - 0.12);
        const uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setX(k, uv.getX(k) * len / 0.9);
        const m = new THREE.Mesh(g, mLattice); m.position.set((xa + xb) / 2, FENCE.h / 2 + 0.02, (za + zb) / 2); m.rotation.y = Math.atan2(xb - xa, zb - za) + Math.PI / 2;
        world.add(m); owned.push(m);
        for (let s = 0; s <= len + 0.01; s += 1.5) post(mWhite, lp(xa, xb, s / len), lp(za, zb, s / len), 0.04, 0, FENCE.h + 0.06, 6);
        bar(mWhite, [xa, FENCE.h, za], [xb, FENCE.h, zb], 0.025, 4); bar(mWhite, [xa, 0.1, za], [xb, 0.1, zb], 0.025, 4);
      };
      fence(FENCE.x, FENCE.z0, FENCE.x, FENCE.z1); fence(FENCE.x, FENCE.z0, FENCE.x - 3.5, FENCE.z0);
      /* the red wooden house east of the turf: plank walls painted red on a brick foot, a porch rail, a tin roof */
      const Hh = HOUSE;
      wall(mBrick, Hh.x, Hh.z0, Hh.x, Hh.z1, 0, 0.7); wall(mRedPlank, Hh.x, Hh.z0, Hh.x, Hh.z1, 0.7, Hh.h - 1.4);      // (north to south: it faces west, the turf)
      wall(mRedPlank, Hh.x + 9, Hh.z0, Hh.x, Hh.z0, 0, Hh.h - 1.4); wall(mRedPlank, Hh.x, Hh.z1, Hh.x + 9, Hh.z1, 0, Hh.h - 1.4);
      quad(mTin, [Hh.x - 0.8, Hh.h - 1.55, Hh.z0 - 0.6], [Hh.x - 0.8, Hh.h - 1.55, Hh.z1 + 0.6], [Hh.x + 4.5, Hh.h, Hh.z1 + 0.6], [Hh.x + 4.5, Hh.h, Hh.z0 - 0.6]);
      for (const z of [-4.5, -1.5, 1.5, 4.2]) { wall(mDark, Hh.x - 0.012, z - 0.5, Hh.x - 0.012, z + 0.5, 1.5, 2.6);
        box(mWhite, Hh.x - 0.03, 1.46, z, 0.06, 0.06, 1.12); box(mWhite, Hh.x - 0.03, 2.64, z, 0.06, 0.06, 1.12);
        for (const dz of [-0.56, 0.56]) box(mWhite, Hh.x - 0.03, 2.05, z + dz, 0.06, 1.2, 0.06); }
      for (let z = Hh.z0 + 0.5; z < Hh.z1; z += 1.6) post(mRedPlank, Hh.x - 0.9, z, 0.05, 0, 1.0, 6);
      bar(mRedPlank, [Hh.x - 0.9, 0.98, Hh.z0 + 0.5], [Hh.x - 0.9, 0.98, Hh.z1 - 0.3], 0.04, 4);
      /* behind the chief canopy: a red plank wall with a white-framed window (photographs 5, 6), and beside it a pale
         grey building with louvred windows */
      const P0 = PLANK;
      wall(mRedPlank, P0.x1, P0.z, P0.x0, P0.z, 0, 3.6); wall(mRedPlank, P0.x0, P0.z, P0.x0, P0.z + 4, 0, 3.6);
      wall(mDark, 11.4, P0.z - 0.012, 10.2, P0.z - 0.012, 1.25, 2.45);
      box(mWhite, 10.8, 1.2, P0.z - 0.03, 1.36, 0.08, 0.06); box(mWhite, 10.8, 2.5, P0.z - 0.03, 1.36, 0.08, 0.06); box(mWhite, 10.8, 1.85, P0.z - 0.03, 0.06, 1.3, 0.06);
      for (const dx of [-0.66, 0.66]) box(mWhite, 10.8 + dx, 1.85, P0.z - 0.03, 0.08, 1.38, 0.06);
      quad(mTin, [P0.x0 - 0.4, 3.55, P0.z - 0.7], [P0.x1 + 2, 3.55, P0.z - 0.7], [P0.x1 + 2, 4.5, P0.z + 4], [P0.x0 - 0.4, 4.5, P0.z + 4]);
      const mGrey = M({ color: 0xb9bcbc, roughness: 0.95 }), mLouvre = B({ map: tex(makeLouvre(THREE, cnv)), color: 0xffffff });
      wall(mGrey, GREY.x1, GREY.z, GREY.x0 - 6, GREY.z, 0, GREY.h); wall(mGrey, GREY.x0 - 6, GREY.z, GREY.x0 - 6, GREY.z + 6, 0, GREY.h);
      for (const x of [6.6, 4.2, 1.8, -0.6, -3.0]) { const g = new THREE.PlaneGeometry(1.1, 1.3); const m = new THREE.Mesh(g, mLouvre);
        m.position.set(x, 1.95, GREY.z - 0.012); m.rotation.y = Math.PI; world.add(m); owned.push(m); }
      box(mGrey, 1.2, GREY.h + 0.08, GREY.z + 0.2, 16, 0.16, 1.2);
    }

    /* ================================================================ A TENT (photographs 10, 11, 1)
       A green steel frame, a peaked green roof, and a valance of cloth round the eave with swags draped over it. */
    const mFrameGreen = M({ color: 0x1f7a3a, roughness: 0.5, metalness: 0.3 });
    const satinMats = new Map();
    const satin = (hex) => { let m = satinMats.get(hex); if (!m) satinMats.set(hex, m = surf('satin', { tile: [0.7, 0.7], mirror: 'u', tint: hex, roughness: 0.42, side: THREE.DoubleSide })); return m; };
    /* a swag: cloth hung between two points of an eave and sagging between them, its folds running down it */
    function swag(mat, a, b, depth, drop, out, segs = 10) {
      const dx = b[0] - a[0], dz = b[2] - a[2], len = Math.hypot(dx, dz), nx = -dz / len, nz = dx / len;       // it bellies `out` metres to the left of its way (the side a wall drawn the same way faces)
      let u = 0;
      for (let i = 0; i < segs; i++) {
        const k0 = i / segs, k1 = (i + 1) / segs, s0 = Math.sin(k0 * Math.PI), s1 = Math.sin(k1 * Math.PI);
        const p0 = [a[0] + dx * k0 + nx * out * s0 * 0.5, a[1] - s0 * 0.04, a[2] + dz * k0 + nz * out * s0 * 0.5];
        const p1 = [a[0] + dx * k1 + nx * out * s1 * 0.5, a[1] - s1 * 0.04, a[2] + dz * k1 + nz * out * s1 * 0.5];
        const q0 = [p0[0] + nx * out * s0 * 0.5, p0[1] - depth * 0.45 - drop * s0, p0[2] + nz * out * s0 * 0.5];
        const q1 = [p1[0] + nx * out * s1 * 0.5, p1[1] - depth * 0.45 - drop * s1, p1[2] + nz * out * s1 * 0.5];
        quad(mat, q0, q1, p1, p0, u, 0); u += len / segs;
      }
    }
    function tent(cx, cz, o = {}) {
      const w = o.w || TENT.w, e = o.eave || TENT.eave, pk = o.peak || TENT.peak, hw = w / 2;
      const roof = o.roof || satinRoof(0x18a044), frame = o.frame || mFrameGreen;
      const C = [[cx - hw, cz + hw], [cx + hw, cz + hw], [cx + hw, cz - hw], [cx - hw, cz - hw]];        // SW, SE, NE, NW
      for (const [x, z] of C) post(frame, x, z, 0.022, 0, e, 6);
      for (let k = 0; k < 4; k++) { const [xa, za] = C[k], [xb, zb] = C[(k + 1) % 4];
        bar(frame, [xa, e, za], [xb, e, zb], 0.018, 4);
        quad(roof, [xa - Math.sign(cx - xa) * 0.06, e + 0.02, za - Math.sign(cz - za) * 0.06], [xb - Math.sign(cx - xb) * 0.06, e + 0.02, zb - Math.sign(cz - zb) * 0.06], [cx, pk, cz], [cx, pk, cz]);
        /* the valance: a band of cloth hanging from the eave, and swags over it */
        const vm = satin(o.valance != null ? o.valance : 0xf4f4f0);
        wall(vm, xa, za, xb, zb, e - 0.28, e + 0.01);
        const n = o.swags || 3, cols = o.swagCols || [0x18a044, 0xf4f4f0];
        for (let s = 0; s < n; s++) { const k0 = s / n, k1 = (s + 1) / n;
          swag(satin(cols[s % cols.length]), [lp(xa, xb, k0), e + 0.005, lp(za, zb, k0)], [lp(xa, xb, k1), e + 0.005, lp(za, zb, k1)], 0.42, 0.2, 0.07); }
      }
      return C;
    }
    const satinRoofs = new Map();
    const satinRoof = (hex) => { let m = satinRoofs.get(hex); if (!m) satinRoofs.set(hex, m = M({ color: hex, roughness: 0.62, side: THREE.DoubleSide })); return m; };

