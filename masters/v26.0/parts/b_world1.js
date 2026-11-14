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
    /* ONE PASS FOR A FLAT CARD (v26.11, the speed-ups' first: no memory made and thrown away each frame). three draws a
       see-through two-sided material in two passes, its back faces and then its front faces, and looks its program up
       again before each (renderObject sets material.needsUpdate both times: two look-ups a card a frame, each a
       hundred-field object built and thrown away, and a draw that paints nothing). A card that is ONE FLAT FACE is wholly
       front or wholly back to any eye, so of the two passes one draws nothing and the other draws every triangle in the
       geometry's own order; one pass (forceSinglePass) draws the same triangles in the same order, and an unlit material
       that reads no normal (MeshBasicMaterial with no envMap) shades them the same. Only such cards are given it, where
       they are made (the sun's rays, the taper's flame, the place to kneel), and each is checked when the world is built
       (onePassCheck): a material given it whose every user is not one flat plain card is drawn as three draws it, and the
       console says so. `?opt=onePass:0` draws all of them as three does: the proof compares the two pixel for pixel. */
    const ONEPASS = !ctx.opt || ctx.opt('onePass');
    /* NO LIST MADE AND THROWN AWAY EACH FRAME (v26.11): where a frame made a new list or a new turn to hold numbers it had
       (a hand's resting finger turns, two lists joined to walk them), it keeps one and fills it again: the same numbers
       copied into it in the same order, so every turn laid after it is the same to the bit. `?opt=noGarbage:0` makes
       them anew as before (the proof compares every bone of every body, the two ways) */
    let NOGARB = !ctx.opt || ctx.opt('noGarbage');                   // (a probe turns it over in one page: stage.garb)
    /* A BONE'S ANGLES WORKED OUT WHEN THEY ARE READ (v26.11, the speed-ups' second: the bones' arithmetic without the
       machinery's overhead). three keeps every object's turn twice, as a quaternion and as three angles, and each time the
       quaternion changes it works the angles out again at once (Object3D's onQuaternionChange: a rotation matrix and an
       arcsine and two arctangents). A body's bones turn thousands of times a frame (every take writes each one, every pose
       laid after it turns it again) and nothing ever reads their angles: the matrices are made from the quaternion. So a
       bone's quaternion only marks its angles stale, and they are worked out, by three's own setFromQuaternion on the same
       quaternion, the moment anything reads or writes any of them: every read gives the very numbers the old way held, and
       a write to one angle finds the others as the old way had them. Proved by every angle read both ways after the same
       turns (stage.lazyProof) and every bone compared. `?opt=lazyRot:0` leaves three's way */
    const LAZYROT = !ctx.opt || ctx.opt('lazyRot');
    function lazyRot(o) { if (LAZYROT) lazyInstall(o); }
    function lazyInstall(o) {
      const q = o.quaternion, e = o.rotation;
      if (!q || !e || e.__lazy) return;
      let dirty = false, x = e._x, y = e._y, z = e._z, order = e._order;
      const sync = () => { dirty = false; e.setFromQuaternion(q, undefined, false); };
      Object.defineProperty(e, '_x', { get() { if (dirty) sync(); return x; }, set(v) { if (dirty) sync(); x = v; }, configurable: true });
      Object.defineProperty(e, '_y', { get() { if (dirty) sync(); return y; }, set(v) { if (dirty) sync(); y = v; }, configurable: true });
      Object.defineProperty(e, '_z', { get() { if (dirty) sync(); return z; }, set(v) { if (dirty) sync(); z = v; }, configurable: true });
      Object.defineProperty(e, '_order', { get() { if (dirty) sync(); return order; }, set(v) { if (dirty) sync(); order = v; }, configurable: true });
      Object.defineProperty(e, '__lazy', { value: true });
      q._onChange(() => { dirty = true; });
    }
    /* (the proof, for a probe: pairs of objects, one turned the old way and one the new, put through the same long string
       of turns and reads, every read and every quaternion compared bit for bit; then every bone of every body read
       against its angles worked out afresh from its quaternion. Answers the count of numbers compared and of those
       that differed) */
    function lazyProof(seed = 1, steps = 4000) {
      let r = seed >>> 0; const rnd = () => ((r = (r * 1664525 + 1013904223) >>> 0) / 4294967296);
      const same = (a, b) => Object.is(a, b);
      let n = 0, bad = 0; const chk = (a, b) => { n++; if (!same(a, b)) bad++; };
      const A = [], Bq = [];
      for (let i = 0; i < 6; i++) { const a = new THREE.Object3D(), b = new THREE.Object3D(); lazyInstall(b); A.push(a); Bq.push(b); }
      const tq = new THREE.Quaternion(), te = new THREE.Euler(), ax = new THREE.Vector3(), arr = [0, 0, 0, 0], orders = ['XYZ', 'YXZ', 'ZXY', 'ZYX', 'YZX', 'XZY'];
      for (let k = 0; k < steps; k++) {
        const i = Math.floor(rnd() * A.length), a = A[i], b = Bq[i], op = Math.floor(rnd() * 12);
        const v = [rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1], ang = (rnd() * 2 - 1) * 3.2;
        tq.set(v[0], v[1], v[2], v[3]).normalize();
        for (const o of [a, b]) {
          if (op === 0) o.quaternion.copy(tq);
          else if (op === 1) o.quaternion.slerp(tq, 0.37);
          else if (op === 2) o.quaternion.premultiply(tq);
          else if (op === 3) { arr[0] = tq.x; arr[1] = tq.y; arr[2] = tq.z; arr[3] = tq.w; o.quaternion.fromArray(arr); }
          else if (op === 4) o.rotation.x = ang;
          else if (op === 5) o.rotation.y = ang;
          else if (op === 6) o.rotation.set(ang, -ang * 0.5, ang * 0.25, orders[k % 6]);
          else if (op === 7) o.rotation.reorder(orders[(k + 3) % 6]);
          else if (op === 8) o.quaternion.setFromAxisAngle(ax.set(v[0], v[1], v[2]).normalize(), ang);
          else if (op === 9) o.rotateY(ang);
          else if (op === 10) o.quaternion.invert();
          else o.lookAt(v[0] * 5, v[1] * 5, v[2] * 5);
        }
        if (rnd() < 0.5) { chk(a.rotation.x, b.rotation.x); chk(a.rotation.y, b.rotation.y); chk(a.rotation.z, b.rotation.z); chk(a.rotation.order, b.rotation.order); }
        chk(a.quaternion.x, b.quaternion.x); chk(a.quaternion.y, b.quaternion.y); chk(a.quaternion.z, b.quaternion.z); chk(a.quaternion.w, b.quaternion.w);
      }
      for (let i = 0; i < A.length; i++) { const a = A[i], b = Bq[i]; const ea = a.rotation.toArray(), eb = b.rotation.toArray(); for (let j = 0; j < 4; j++) chk(ea[j], eb[j]);
        a.updateMatrix(); b.updateMatrix(); for (let j = 0; j < 16; j++) chk(a.matrix.elements[j], b.matrix.elements[j]); }
      let bones = 0, boneBad = 0;
      world.traverse(o => { if (!o.isBone || !o.rotation.__lazy) return; bones++; te.setFromQuaternion(o.quaternion, o.rotation.order, false);
        if (!same(te.x, o.rotation.x) || !same(te.y, o.rotation.y) || !same(te.z, o.rotation.z)) boneBad++; });
      return { compared: n, differed: bad, lazyBones: bones, bonesDiffering: boneBad };
    }
    function flatCard(g) {
      const p = g && g.attributes && g.attributes.position; if (!p || (g.morphAttributes && g.morphAttributes.position)) return false;
      const ix = g.index ? g.index.array : null, n = ix ? ix.length : p.count;
      let have = false, nx = 0, ny = 0, nz = 0, ax = 0, ay = 0, az = 0, off = 0, size = 0;
      for (let t = 0; t + 2 < n; t += 3) {
        const a = ix ? ix[t] : t, b = ix ? ix[t + 1] : t + 1, c = ix ? ix[t + 2] : t + 2;
        const Ax = p.getX(a), Ay = p.getY(a), Az = p.getZ(a), ux = p.getX(b) - Ax, uy = p.getY(b) - Ay, uz = p.getZ(b) - Az, wx = p.getX(c) - Ax, wy = p.getY(c) - Ay, wz = p.getZ(c) - Az;
        const cx = uy * wz - uz * wy, cy = uz * wx - ux * wz, cz = ux * wy - uy * wx, L = Math.hypot(cx, cy, cz);
        if (!(L > 1e-12)) continue;
        if (!have) { nx = cx / L; ny = cy / L; nz = cz / L; ax = Ax; ay = Ay; az = Az; have = true; }
        if ((cx * nx + cy * ny + cz * nz) / L < 0.999999) return false;                    // (a triangle facing another way)
        for (let k = 0; k < 3; k++) { const X = Ax + (k === 1 ? ux : k === 2 ? wx : 0), Y = Ay + (k === 1 ? uy : k === 2 ? wy : 0), Z = Az + (k === 1 ? uz : k === 2 ? wz : 0);
          off = Math.max(off, Math.abs((X - ax) * nx + (Y - ay) * ny + (Z - az) * nz)); size = Math.max(size, Math.hypot(X - ax, Y - ay, Z - az)); }
      }
      return have && off <= 1e-6 * Math.max(size, 1e-6);
    }
    function onePassCheck() {
      const users = new Map();
      world.traverse(o => { if (!o.material) return; for (const m of [].concat(o.material)) if (m && m.forceSinglePass) { if (!users.has(m)) users.set(m, []); users.get(m).push(o); } });
      for (const [m, os] of users) {
        const bad = !m.isMeshBasicMaterial || !!m.envMap ? m.type : (os.find(o => !o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || o.isBatchedMesh || !flatCard(o.geometry)) || null);
        if (!bad) continue;
        m.forceSinglePass = false;
        console.warn('onePass: a material given one pass is drawn in two (' + (typeof bad === 'string' ? bad : (bad.name || bad.type) + ' is not one flat plain card') + ')');
      }
      return users.size;
    }
    const wallNow = () => performance.now() / 1000;
    const have = (key) => DATA.assets.includes(key);      // a thing is asked for only once its file is in the build
    const waiting = new Set();                            // the keys the world names that have not landed yet (stage.info)
    const c01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v), smo = (k) => k * k * (3 - 2 * k), sgk = (t, a, b) => c01((t - a) / (b - a));
    const lp = (a, b, k) => a + (b - a) * k, lp3 = (a, b, k) => [lp(a[0], b[0], k), lp(a[1], b[1], k), lp(a[2], b[2], k)];
    const angTo = (a, b) => Math.atan2(Math.sin(b - a), Math.cos(b - a));
    const isNarrow = () => camera.aspect < 1;
    const TOUCHY = !!((window.matchMedia && matchMedia('(pointer: coarse)').matches) || 'ontouchstart' in window);   // (the engine's HAS_TOUCH: which words a brief gives)

    /* ------------------------------------------------------------- THE GROUND'S PLAN (the tracker's §10)
       x east, z south, the origin the middle of the turf. Every place in this chapter is one of these numbers. */
    const TURF = { x0: -10, x1: 10, z0: -9, z1: 12, strip: 2 };
    const GRAVEL = { z0: -10.5, z1: -9 };
    const TABLES = { x0: -2.5, x1: 2.5, z0: -12.4, z1: -10.0, tops: [0.75, 1.05, 1.35], step: 0.8 };   // three steps, the lowest in front (south)
    const WHEEL = { x: 0, z: -12.0 };
    const PARASOL = { x: 0, z: -12.75 };
    /* (v26.2 debug: at z -13.6 the pole went up through the parasol's canopy, 1.04 m from its middle, inside its 1.3 m rim:
       measured, tools/probes/clipscan.mjs. Behind it now, clear of the drawn-larger parasol's rim, before the banners) */
    const POLE = { x: 0.6, z: -14.3, h: 10 };
    /* photographs 13 to 16; its front 9 m behind the tables (8, 10). Measured on 15, the front square on: the skirt rises
       1.5 m and the gable 2.2 m above it, the gable's foot is 6.6 m wide; from 16 the skirt is steep enough to show its
       tiles to a man standing before it, so both tiers are pitched at about thirty degrees */
    const HALL = { x0: -5, x1: 5, z0: -29.7, z1: -21.7, floor: 0.48, wall: 3.1, over: 1.6, overS: 0.9, rise: 1.5, pitch: 30 * Math.PI / 180, gable: 2.2 };
    const SHED = { x0: -16, x1: -10.5, z0: -14, z1: -8, eave: 2.4 };
    const TENT_W1 = { x: -9, z: -1 }, TENT_W2 = { x: -9, z: 5 }, TENT_E = { x: 9, z: -2 };
    const TENT = { w: 4, eave: 2.2, peak: 3.3 };
    /* THE MONKS' ROW under the east tent (photograph 2): three carved armchairs in one line, and the spot of each monk
       who sits in one. One table for the chairs, their blocker and the sitters (v16.7). The chair is drawn at 1.11 of
       its file: 0.946 m deep (its front face `half` ahead of its middle), its seat's top 0.466 m up, 0.708 m clear
       between its arms (tools/probes/seatread.mjs assets/w3chair.glb 1.11). The chairs stand 21 cm behind the
       sitters' spots: a seat that deep is sat on at its front, the shins down before its front face (c_cast.js:
       o.seat.legs), and the one who sits cross-legged sits back in it (`deep`: his hips behind the seat's middle) */
    const MONKS = { x: 10.22, zs: [-3.2, -2.0, -0.8], chair: 10.43, s: 1.11, half: 0.473, deep: 0.135 };
    /* HIS BENCH (photographs 1, 5, 6, read together): it stands at the canopy's south side and FACES THE OFFERING TABLES
       AND THE HALL (photograph 1 is taken over its back rail: the hall stands ahead, the west tents to the left, the
       lime pole at the front right), a little west of north. Two sit on it: he at its east end, the second master in
       white at his left. People kneel before it, to its north. (My first reading had it facing north-west.) A body and
       a seat face +z at a turn of 0. `benchAt(a, b)`: a point a metres to the sitters' right and b metres before them */
    const BENCH = { x: 5.9, z: 9.2, ry: Math.atan2(-0.3, -1) };
    const benchAt = (a, b) => { const fx = Math.sin(BENCH.ry), fz = Math.cos(BENCH.ry); return [BENCH.x - fz * a + fx * b, BENCH.z + fx * a + fz * b]; };
    /* HIS CANOPY stands square to the bench, and its front right pole (the one wrapped in lime) is 1.65 m to the
       sitters' right and 1.75 m before them: measured on photograph 1, where that pole fills a quarter of the frame's
       height 2.9 m from the lens. So the bench sits under the canopy's back half, against the buildings behind */
    const CHIEF = (() => { const [x, z] = benchAt(1.65 - 2.25, 1.75 - 2.25); return { x, z, w: 4.5, eave: 2.3, peak: 3.1, ry: BENCH.ry }; })();
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
      redplank: [0x8a2c26, 'image/jpeg'], tin: [0xcb8083, 'image/jpeg'],
      brick: [0x96573f, 'image/jpeg'], skirt: [0x1f9c3a, 'image/jpeg'], satin: [0xe9e9e9, 'image/jpeg'], mat: [0xc7b78a, 'image/jpeg'],
      carpet: [0x74202a, 'image/jpeg'], bluemat: [0x86c9c0, 'image/jpeg'], swag: [0xf2f0e4, 'image/webp'], banner: [0xe8e8e8, 'image/webp'], treeline: [0x4c7a3a, 'image/webp'],
      redroof: [0xc8483f, 'image/jpeg'], hallbrick: [0x9a4f3f, 'image/jpeg'], steptile: [0xc98c80, 'image/jpeg'], lawn: [0x5c9a35, 'image/jpeg'],
      kalae: [0x5a4a40, 'image/webp'], fretwork: [0x7a2a26, 'image/webp'], sign: [0xece8dc, 'image/webp'],
      render: [0xbdbebf, 'image/jpeg']                      // (v26.1: the grey building's rendered walls, masters/v26.1/env)
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
      const { tile = 1, mirror = '', tint = null, gain = null, basic = false, cut = false, clampV = false, clamp = false, ...rest } = o;
      const lift = (c) => { if (gain != null) { const k = Array.isArray(gain) ? gain : [gain, gain, gain]; c.r *= k[0]; c.g *= k[1]; c.b *= k[2]; } return c; };
      const avg = lift(new THREE.Color(SURF[name][0])); if (tint != null) avg.multiply(new THREE.Color(tint));
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
        m.map = t; lift(m.color.set(tint != null ? tint : 0xffffff)); m.needsUpdate = true;
      });
      return m;
    }
    /* a surface's picture with its own holes and ONE flat colour (a fretwork painted pale grey: the cut-out is the
       picture's, the paint is not). The picture is drawn once onto a canvas and filled through its own alpha */
    function surfFlat(name, css, o = {}) {
      const { tile = 1, clampV = false, clamp = false, ...rest } = o;
      const m = M({ color: css, roughness: 0.85, metalness: 0, alphaTest: 0.5, side: THREE.DoubleSide, ...rest });
      surfLoad(name).then(t0 => {
        if (!t0 || !alive || !t0.image) return;
        const im = t0.image, c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
        const x = c.getContext('2d'); x.drawImage(im, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = '#ffffff'; x.fillRect(0, 0, c.width, c.height);
        const t = tex(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; t.flipY = false;
        const tu = Array.isArray(tile) ? tile[0] : tile, tv = Array.isArray(tile) ? tile[1] : tile;
        t.wrapS = clamp ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping; t.wrapT = clamp || clampV ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
        t.repeat.set(1 / tu, -1 / tv); t.offset.set(0, 1); m.map = t; m.needsUpdate = true;
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
    /* a flat piece of any number of corners (anticlockwise from its front), its UVs true metres: u along its first edge,
       v up the piece. A hip roof's trapezoid drawn as a quad() would squeeze its tiles toward the hip. */
    function planar(mat, pts, u0 = 0, v0 = 0) {
      const Bt = batchOf(mat), a = pts[0], b = pts[1], c = pts[2];
      const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], ul = Math.hypot(ux, uy, uz) || 1, ex = ux / ul, ey = uy / ul, ez = uz / ul;
      let nx = uy * (c[2] - a[2]) - uz * (c[1] - a[1]), ny = uz * (c[0] - a[0]) - ux * (c[2] - a[2]), nz = ux * (c[1] - a[1]) - uy * (c[0] - a[0]);
      const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
      const vx = ny * ez - nz * ey, vy = nz * ex - nx * ez, vz = nx * ey - ny * ex;
      for (let i = 1; i < pts.length - 1; i++) for (const q of [pts[0], pts[i], pts[i + 1]]) {
        const dx = q[0] - a[0], dy = q[1] - a[1], dz = q[2] - a[2];
        Bt.p.push(q[0], q[1], q[2]); Bt.n.push(nx, ny, nz); Bt.u.push(u0 + dx * ex + dy * ey + dz * ez, v0 + dx * vx + dy * vy + dz * vz);
      }
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

    /* (a seeded stream, v6.15: every scatter in this chapter is the same scatter on every run. `rng` is at the file's
       foot, beside the drawn surfaces that also use it) */

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
        /* a file of TWO LEVELS (props/lods.sh: nodes <key>_near and <key>_far over the same vertices): the far one is
           drawn until the piece stands taller than a twenty-fifth of the screen (lodTick, the measure many() uses) */
        const near = [], far = []; m.traverse(q => { if (q.isMesh) { if (/_far$/.test(q.name)) far.push(q); else if (/_near$/.test(q.name)) near.push(q); } });
        /* (o.near: a copy that is only ever seen close, in his hands: its full level always, and no place in the world
           for lodTick to measure) */
        if (near.length && far.length && o.near) { for (const q of far) q.visible = false; }
        else if (near.length && far.length) { g.updateWorldMatrix(true, true); const bb = new THREE.Box3().setFromObject(m), c = bb.getCenter(new THREE.Vector3());
          for (const q of near) q.visible = false;
          standLods.push({ near, far, c, r: 0, size: Math.max(0.05, bb.max.y - bb.min.y), on: false, g, moves: !!o.moves }); }
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
      return g;
    }
    /* every two-level thing's level, from the lens: called every frame of play, and by a film on its own clock (a cut
       chooses from the cut's own lens: v24.22). stockLod is many()'s (the copied one); this is stand()'s, the same rule */
    const standLods = [], _sl2 = new THREE.Vector3();
    function lodTick() {
      stockLod();
      if (!standLods.length) return;
      camera.getWorldPosition(_sl2);
      const span = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      for (const L of standLods) { if (L.g && L.moves) L.g.getWorldPosition(L.c).y += L.size / 2;                // (a thing the play carries about is measured where it is now)
        const d = Math.max(0.05, _sl2.distanceTo(L.c)), on = L.size / (d * span) > STOCK_NEAR;
        if (on === L.on) continue; L.on = on;
        for (const q of L.near) q.visible = on; for (const q of L.far) q.visible = !on; }
    }
    /* A HUE TURNED in a material (one soda bottle in red, orange and green; one small candle in pink and blue): the
       picture's own colour is turned about the grey axis before the light falls on it, so whites, blacks and greys
       stay as they are. A program of its own for each angle (compiled under the curtain with the rest: v14.15) */
    function hueTurn(mat, deg) {
      const a = deg * Math.PI / 180, uHue = { value: new THREE.Vector2(Math.cos(a), Math.sin(a)) };
      mat.onBeforeCompile = (sh) => { sh.uniforms.uHue = uHue;
        sh.fragmentShader = 'uniform vec2 uHue;\n' + sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n{ vec3 hk = vec3(0.57735); vec3 hv = diffuseColor.rgb; diffuseColor.rgb = hv * uHue.x + cross(hk, hv) * uHue.y + hk * dot(hk, hv) * (1.0 - uHue.x); }'); };
      mat.customProgramCacheKey = () => 'hueTurn';
      mat.needsUpdate = true;
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
      /* north of the gravel the ground is LAWN, up to the hall and round it (photographs 14 to 16), worn to a track of
         gravel up its middle from the tables to the fountain */
      floor(mLawn, -24, -40, 24, GRAVEL.z0, -0.008);
      floor(mGravel, -0.9, HALL.z1 + 3.9, 0.9, TABLES.z0 - 0.25, -0.005);
      /* the turf is rolls laid side by side, north to south: where two meet, a thin teal line (photograph 10) */
      const mSeam = M({ color: 0x1f8f7c, roughness: 0.9 });
      for (let x = TURF.x0 + TURF.strip; x < TURF.x1 - 0.01; x += TURF.strip) floor(mSeam, x - 0.012, TURF.z0, x + 0.012, TURF.z1, 0.003);
      /* its cut edge: a hand's width of darker pile all round, so it reads as a thing laid on the earth */
      const mEdge = M({ color: 0x2c6f1c, roughness: 1 });
      wall(mEdge, TURF.x0, TURF.z1, TURF.x1, TURF.z1, -0.012, 0.004); wall(mEdge, TURF.x1, TURF.z0, TURF.x0, TURF.z0, -0.012, 0.004);
      wall(mEdge, TURF.x1, TURF.z1, TURF.x1, TURF.z0, -0.012, 0.004); wall(mEdge, TURF.x0, TURF.z0, TURF.x0, TURF.z1, -0.012, 0.004);
    }

    /* ================================================================ THE HALL (photographs 13 to 16; and 8, 10 behind the tables)
       Chad, 11 Nov 2026: "More images of the building behind, at the wai kru". One storey, ten metres across its front:
       three steps of terracotta tile, walls of long red-brown brick, a dark red post at each corner and one in the
       middle of the front, two wide double doors of dark glass. Over it a roof in two tiers of bright red pressed tile:
       a hipped skirt all round with a wide overhang, and a steep gable to the south over the middle, its triangle in
       dark red boards. A fretwork board of pointed scallops hangs under every eave and up both rakes, and two carved
       boards cross at the peak (a kalae). In front: a white plank sign between two rough posts, the seven-headed naga
       fountain on its teal plinth, a naga on a plinth at each corner, bushes and jars. The tracker's §10 has the table.
       He cannot walk to it (it stands north of the ground he is kept on): it is for his eyes and for a film's lens. */
    const mRoofRed = surf('redroof', { tile: [2.4, 2.3], roughness: 0.62 });
    const mHallBrick = surf('hallbrick', { tile: [1.47, 1.4], tint: 0xc4a6a6, roughness: 0.9 });   // (photograph 15: a darker, browner red than the sunlit corner of 13)
    const mStep = surf('steptile', { tile: 1.2, roughness: 0.78 });
    const mRiser = surf('steptile', { tile: 1.2, tint: 0xd8c9c6, roughness: 0.85 });
    const mLawn = surf('lawn', { tile: 2.5, gain: [1.55, 1.3, 1.45], roughness: 1 });           // (dry and straw-pale in every photograph: lifted to them)
    const mFret = surf('fretwork', { tile: [1.68, 0.26], cut: true, clampV: true, roughness: 0.8 });
    const mSign = surf('sign', { tile: [2.4, 0.43], cut: true, clamp: true, roughness: 0.7 });
    const mFretGrey = surfFlat('fretwork', '#c4cad2', { tile: [1.68, 0.26], clampV: true });        // the gable's lace is painted pale grey (photograph 15)
    const mKalaeGrey = surfFlat('kalae', '#8e959c', { tile: [0.95, 0.97], clamp: true });           // and the kalae weathered grey
    const mBrick = surf('brick', { tile: 1.6, mirror: 'uv', roughness: 0.95 });
    const mRedPlank = surf('redplank', { tile: 2.0, mirror: 'uv', roughness: 0.85 });
    const mGable = surf('redplank', { tile: 2.0, mirror: 'uv', tint: 0xa9d0e8, roughness: 0.85 });   // (dark purple-brown boards, photograph 15)
    const mTin = surf('tin', { tile: 1.8, roughness: 0.7, side: THREE.DoubleSide });
    const mBarge = M({ color: 0xb23229, roughness: 0.6 });
    const mDark = M({ color: 0x15100c, roughness: 1 });
    const mWhite = M({ color: 0xf2efe6, roughness: 0.8 });
    const mConcrete = M({ color: 0xa9a49a, roughness: 0.95 });
    const mPostRed = M({ color: 0x4d231f, roughness: 0.7 });
    const mTeal = M({ color: 0x3a9a8e, roughness: 0.85 });
    /* the shade the deep eave lays on a wall: dark under the roof, gone a man's height below it (painted: v9.4) */
    const mEaveShade = (() => { const [c, x] = cnv(64); const g = x.createLinearGradient(0, 0, 0, 64);
      x.clearRect(0, 0, 64, 64); g.addColorStop(0, 'rgba(10,6,6,0.78)'); g.addColorStop(0.45, 'rgba(10,6,6,0.5)'); g.addColorStop(1, 'rgba(10,6,6,0)');
      x.fillStyle = g; x.fillRect(0, 0, 64, 64);
      const t = tex(done(THREE, c, false)); t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.ClampToEdgeWrapping;
      return B({ map: t, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }); })();
    /* the doors' glass: dark, and holding a dim picture of what stands before it (the sky over the trees over the lawn),
       painted, because nothing here is mirrored for real. Its quad's UVs are metres, so the sheet is fitted to a door */
    const mGlass = (() => { const [c, x] = cnv(64); const g = x.createLinearGradient(0, 0, 0, 64);
      g.addColorStop(0, '#31475e'); g.addColorStop(0.3, '#22313a'); g.addColorStop(0.42, '#15221a'); g.addColorStop(0.72, '#0e1611'); g.addColorStop(1, '#070909');
      x.fillStyle = g; x.fillRect(0, 0, 64, 64);
      const t = tex(done(THREE, c, false)); t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.ClampToEdgeWrapping; t.repeat.set(1, 1 / 2.25); t.offset.set(0, -HALL.floor / 2.25);
      return B({ map: t }); })();
    const mBronze = M({ color: 0x3b2f2a, roughness: 0.5, metalness: 0.4 });
    const mSteel = M({ color: 0xb9bcc0, roughness: 0.35, metalness: 0.8 });
    const mSoffit = M({ color: 0x8b8f92, roughness: 0.8 });
    const mSignPost = M({ color: 0x4f3038, roughness: 1 });
    const hall = { lamps: [] };
    function buildHall() {
      const H = HALL, fl = H.floor, eave = fl + H.wall, cx = (H.x0 + H.x1) / 2, zf = H.z1, ov = H.over;
      /* THE STEPS: three across the whole front and a little past each corner, a white strip on each one's edge */
      const sx0 = H.x0 - 0.6, sx1 = H.x1 + 0.6, zb = zf - 0.1;
      const stepFront = (k) => zf + 0.9 + (2 - k) * 0.3;                        // k 0 the lowest: its front edge is the furthest south
      for (let k = 0; k < 3; k++) { const top = (k + 1) * fl / 3, front = stepFront(k);
        box(mRiser, cx, top / 2, (zb + front) / 2, sx1 - sx0, top, front - zb, 0, mStep);
        floor(mWhite, sx0, front - 0.05, sx1, front, top + 0.003); }
      hall.stepsFront = stepFront(0);
      /* THE WALLS, the grey band at their foot, the thin white line of a conduit near their top */
      /* (each wall runs up to just under the skirt where the skirt crosses it, so no slot of sky shows under the eave) */
      const yo = eave - 0.22, yi = yo + H.rise, run = H.rise / Math.tan(H.pitch);
      const topF = yo + H.rise * ov / run - 0.05, topS = yo + H.rise * H.overS / run - 0.05;
      for (const [xa, za, xb, zw, top] of [[H.x0, zf, H.x1, zf, topF], [H.x1, zf, H.x1, H.z0, topS], [H.x1, H.z0, H.x0, H.z0, topF], [H.x0, H.z0, H.x0, zf, topS]]) wall(mHallBrick, xa, za, xb, zw, fl, top);
      /* (the eave's shade, laid 8 mm off each wall, behind the grey band and the doors' glass: from the wall's top down 2.1 m) */
      for (const [xa, za, xb, zw, top] of [[H.x0, zf, H.x1, zf, topF], [H.x1, zf, H.x1, H.z0, topS], [H.x1, H.z0, H.x0, H.z0, topF], [H.x0, H.z0, H.x0, zf, topS]]) {
        const dx = xb - xa, dz = zw - za, L = Math.hypot(dx, dz), ox = -dz / L * 0.008, oz = dx / L * 0.008, y1 = top, y0 = top - 2.1;
        const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mEaveShade);
        m.position.set((xa + xb) / 2 + ox, (y0 + y1) / 2, (za + zw) / 2 + oz); m.scale.set(L, y1 - y0, 1); m.rotation.y = Math.atan2(ox, oz); m.renderOrder = 1; world.add(m); owned.push(m); }
      wall(mConcrete, H.x0, zf + 0.012, H.x1, zf + 0.012, fl, fl + 0.16);
      bar(mWhite, [H.x0, fl + 2.72, zf + 0.02], [H.x1, fl + 2.72, zf + 0.02], 0.012, 4);
      /* THE POSTS: dark red, at the four corners and the middle of the front */
      for (const [px, pz] of [[H.x0 - 0.02, zf + 0.07], [cx, zf + 0.07], [H.x1 + 0.02, zf + 0.07], [H.x0 - 0.02, H.z0 - 0.07], [H.x1 + 0.02, H.z0 - 0.07]]) post(mPostRed, px, pz, 0.11, fl, eave + 0.15, 10);
      /* THE TWO DOORS: dark glass in bronze frames, a leaf either side of the meeting stiles, long bar handles */
      for (const sx of [-1, 1]) { const dx = cx + sx * 2.7, w = 2.3, h = 2.25, z = zf + 0.02;
        wall(mGlass, dx - w / 2, z, dx + w / 2, z, fl + 0.02, fl + h);
        box(mBronze, dx, fl + h + 0.035, z + 0.02, w + 0.14, 0.07, 0.07);
        box(mBronze, dx, fl + 0.05, z + 0.02, w, 0.08, 0.06);
        for (const jx of [-w / 2 - 0.035, w / 2 + 0.035]) box(mBronze, dx + jx, fl + h / 2, z + 0.02, 0.07, h, 0.07);
        for (const jx of [-0.03, 0.03]) box(mBronze, dx + jx, fl + h / 2, z + 0.025, 0.05, h, 0.05);
        for (const jx of [-0.13, 0.13]) bar(mSteel, [dx + jx, fl + 0.85, z + 0.075], [dx + jx, fl + 1.35, z + 0.075], 0.014, 6); }
      /* THE LOWER ROOF: a skirt all round, from its edge out over the steps up to the foot of the upper roof. Each side
         is a flat trapezoid with true UVs (planar), the eave its picture's u, so the rows of tiles lie along it */
      const o = { x0: H.x0 - H.overS, x1: H.x1 + H.overS, z0: H.z0 - ov, z1: zf + ov }, g = { x0: o.x0 + run, x1: o.x1 - run, z0: o.z0 + run, z1: o.z1 - run };
      const sides = [
        [[o.x0, yo, o.z1], [o.x1, yo, o.z1], [g.x1, yi, g.z1], [g.x0, yi, g.z1]],      // south, the side the turf sees
        [[o.x1, yo, o.z1], [o.x1, yo, o.z0], [g.x1, yi, g.z0], [g.x1, yi, g.z1]],      // east
        [[o.x1, yo, o.z0], [o.x0, yo, o.z0], [g.x0, yi, g.z0], [g.x1, yi, g.z0]],      // north
        [[o.x0, yo, o.z0], [o.x0, yo, o.z1], [g.x0, yi, g.z1], [g.x0, yi, g.z0]]];     // west
      for (const q of sides) { planar(mRoofRed, q);
        /* its underside: grey sheet, a hand under the tiles and facing down (the corners turned the other way round) */
        planar(mSoffit, [q[1], q[0], q[3], q[2]].map(v => [v[0], v[1] - 0.05, v[2]])); }
      /* the purlins under the overhang (dark red), three on the south and on each side */
      for (const k of [0.12, 0.3, 0.46]) { const y = lp(yo, yi, k) - 0.09;
        bar(mPostRed, [lp(o.x0, g.x0, k), y, lp(o.z1, g.z1, k)], [lp(o.x1, g.x1, k), y, lp(o.z1, g.z1, k)], 0.035, 4);
        bar(mPostRed, [lp(o.x0, g.x0, k), y, lp(o.z0, g.z0, k)], [lp(o.x0, g.x0, k), y, lp(o.z1, g.z1, k)], 0.035, 4);
        bar(mPostRed, [lp(o.x1, g.x1, k), y, lp(o.z0, g.z0, k)], [lp(o.x1, g.x1, k), y, lp(o.z1, g.z1, k)], 0.035, 4); }
      /* its edge board, and THE FRETWORK hanging under it on all four sides (pointed scallops, dark red) */
      const fh = 0.26;
      for (const [xa, za, xb, zw] of [[o.x0, o.z1, o.x1, o.z1], [o.x1, o.z1, o.x1, o.z0], [o.x1, o.z0, o.x0, o.z0], [o.x0, o.z0, o.x0, o.z1]]) {
        wall(mBarge, xa, za, xb, zw, yo - 0.07, yo + 0.03);
        const dx = xb - xa, dz = zw - za, L = Math.hypot(dx, dz), ox = -dz / L * 0.012, oz = dx / L * 0.012;   // a finger outside the board
        quad(mFret, [xa + ox, yo - 0.05 - fh, za + oz], [xb + ox, yo - 0.05 - fh, zw + oz], [xb + ox, yo - 0.05, zw + oz], [xa + ox, yo - 0.05, za + oz]); }
      /* THE UPPER ROOF: a steep gable over the middle, its ridge running north to south, its end to the turf. It stands
         a short upstand above the skirt so its eaves clear the skirt's tiles */
      const g0 = yi + 0.25, ridge = g0 + H.gable, pitch = Math.atan2(H.gable, g.x1 - cx), eo = 0.3, ye = g0 - eo * Math.tan(pitch);
      const ex0 = g.x0 - eo, ex1 = g.x1 + eo, zr0 = g.z0 - 0.45, zr1 = g.z1 + 0.45;
      planar(mRoofRed, [[ex0, ye, zr0], [ex0, ye, zr1], [cx, ridge, zr1], [cx, ridge, zr0]]);          // the west slope
      planar(mRoofRed, [[ex1, ye, zr1], [ex1, ye, zr0], [cx, ridge, zr0], [cx, ridge, zr1]]);          // the east slope
      planar(mSoffit, [[ex0, ye - 0.04, zr1], [ex0, ye - 0.04, zr0], [cx, ridge - 0.04, zr0], [cx, ridge - 0.04, zr1]]);
      planar(mSoffit, [[ex1, ye - 0.04, zr0], [ex1, ye - 0.04, zr1], [cx, ridge - 0.04, zr1], [cx, ridge - 0.04, zr0]]);
      bar(mBarge, [cx, ridge + 0.02, zr0], [cx, ridge + 0.02, zr1], 0.06, 5);                           // the ridge cap
      /* the band between the two roofs and the gable's triangle, in dark red boards */
      for (const [xa, za, xb, zw] of [[g.x0, g.z1, g.x1, g.z1], [g.x1, g.z1, g.x1, g.z0], [g.x1, g.z0, g.x0, g.z0], [g.x0, g.z0, g.x0, g.z1]]) wall(mGable, xa, za, xb, zw, yi - 0.08, g0 + 0.02);
      tri(mGable, [g.x0, g0, g.z1], [g.x1, g0, g.z1], [cx, ridge - 0.08, g.z1]);
      tri(mGable, [g.x1, g0, g.z0], [g.x0, g0, g.z0], [cx, ridge - 0.08, g.z0]);
      /* the fretwork across the gable's foot and up both rakes (each strip's top edge on the roof's edge, its scallops
         hanging in the gable's plane), a red board along each rake's edge, and THE KALAE crossed at the peak */
      const zk = zr1 + 0.006;
      quad(mFret, [g.x0, g0 - fh, g.z1 + 0.03], [g.x1, g0 - fh, g.z1 + 0.03], [g.x1, g0, g.z1 + 0.03], [g.x0, g0, g.z1 + 0.03]);            // (dark red across the foot: photograph 15 has no pale lace there, only up the rakes)
      { const c = Math.cos(pitch), sn = Math.sin(pitch);
        const T0 = [ex0, ye, zk], T1 = [cx, ridge, zk], T2 = [ex1, ye, zk];
        quad(mFretGrey, [T0[0] + fh * sn, T0[1] - fh * c, zk], [T1[0] + fh * sn, T1[1] - fh * c, zk], T1, T0);         // the west rake (up to the peak)
        quad(mFretGrey, [T1[0] - fh * sn, T1[1] - fh * c, zk], [T2[0] - fh * sn, T2[1] - fh * c, zk], T2, T1);         // the east rake (down from it)
        bar(mBarge, [T0[0], T0[1] + 0.03, zk], [T1[0], T1[1] + 0.03, zk], 0.045, 4); bar(mBarge, [T2[0], T2[1] + 0.03, zk], [T1[0], T1[1] + 0.03, zk], 0.045, 4); }
      quad(mKalaeGrey, [cx - 0.475, ridge - 0.14, zk + 0.02], [cx + 0.475, ridge - 0.14, zk + 0.02], [cx + 0.475, ridge + 0.83, zk + 0.02], [cx - 0.475, ridge + 0.83, zk + 0.02]);
      /* THE SIGN: a white wavy plank between two rough posts in front of the steps (its words are a picture: z_tail's
         art; NOT the real place's name, v9.3) */
      /* (measured on photograph 15 against the doors: the plank 2.4 m by 0.43 m, its foot two metres up, on two posts
         that stand at the fountain's two sides; the fountain's plinth in two low tiers hard against the steps) */
      const zs = hall.stepsFront + 0.78;
      for (const sx of [-1, 1]) post(mSignPost, cx + sx * 1.1, zs, 0.085, 0, 2.02, 9, 0.075);
      quad(mSign, [cx - 1.2, 1.98, zs + 0.09], [cx + 1.2, 1.98, zs + 0.09], [cx + 1.2, 2.41, zs + 0.09], [cx - 1.2, 2.41, zs + 0.09]);
      /* THE PLINTHS, painted teal: the fountain's between the sign's posts, one at each corner for its naga */
      hall.fountain = { x: cx, z: zs, top: 0.4 };
      /* (v26.2: the upper tier 2.0 wide and the lower 2.2, out to the posts' feet as photograph 15 has it, so each small Ganesha
         sits on the top BESIDE the basin's end, between it and a post; at 1.8 the basin left no room and both stood half
         inside its wall) */
      box(mTeal, hall.fountain.x, 0.1, hall.fountain.z, 2.2, 0.2, 1.4); box(mTeal, hall.fountain.x, 0.3, hall.fountain.z - 0.06, 2.0, 0.2, 1.12);
      hall.west = { x: H.x0 - 1.7, z: zf + 1.35, top: 0.5 };  box(mTeal, hall.west.x, 0.25, hall.west.z, 2.4, 0.5, 0.95);
      hall.east = { x: H.x1 + 0.3, z: zf + 1.0, top: 0.55 }; box(mTeal, hall.east.x, 0.275, hall.east.z, 1.8, 0.55, 0.95);
      /* (each lamp's back plate on its post's front, the post 0.11 round about zf + 0.07: the lamp 0.106 from its back to its
         middle, so its middle stands at zf + 0.29; at zf + 0.2 its back half was inside the post, v26.2) */
      hall.lampAt = [[H.x0 - 0.02, fl + 1.95, zf + 0.29], [H.x1 + 0.02, fl + 1.95, zf + 0.29]];
      /* A LAMP ON A POLE, front left (photograph 16): a round solar street lamp on a grey pole */
      post(mConcrete, -7.4, zf + 2.4, 0.045, 0, 4.2, 8);
      geo(mSteel, new THREE.CylinderGeometry(0.34, 0.3, 0.07, 14), _gm.makeTranslation(-7.4, 4.24, zf + 2.4));
      geo(mDark, new THREE.CylinderGeometry(0.3, 0.3, 0.012, 14), _gm.makeTranslation(-7.4, 4.285, zf + 2.4));
    }
    /* what stands at the hall, each a model made from his photographs (masters/v26.0/hall): placed after the batch is
       flushed, each on the spot buildHall measured out */
    function dressHall() {
      const F = hall.fountain, W = hall.west, E = hall.east;
      stand('w3nagafount', F.x, F.top, F.z, 0);                                   // the seven heads, facing the turf
      /* the small golden Ganesha at each end of the basin, turned to it (photographs 13 and 15): each on the top between the
         basin and a post, 4.6 cm clear of the basin's wall and of the top's edges (fitted to both models' own points,
         tools/probes/fitbeside.mjs, v26.2; at F.x +/- 0.72 each stood half inside the basin's wall) */
      stand('w3ganesha', F.x + 0.85, F.top, F.z + 0.25, -1.6);
      stand('w3ganesha', F.x - 0.85, F.top, F.z + 0.25, 1.6, { done: (m) => { m.scale.x *= -1; } });
      stand('w3nagagreen', W.x, W.top, W.z, 0);                                   // west: the green naga, its heads to the west
      stand('w3nagawhite', E.x, E.top, E.z, 0, { s: 1.22 });                      // east: the white-bellied naga, upright (1.85 m on its plinth, photograph 15)
      /* (photograph 15: one yellow bush west of the fountain before the steps, one beyond the white naga; the dracaena
         in its brown jar at the east post's foot, as tall as the sign; a bowl of floating plants before the plinth) */
      stand('w3croton', F.x - 2.55, 0, F.z + 0.35, 0.6);
      stand('w3croton', E.x + 2.3, 0, E.z + 0.6, 2.2, { s: 0.92 });
      stand('w3dracaena', F.x + 1.55, 0, F.z + 0.45, 0.3, { s: 1.28 });
      stand('w3waterjar', F.x + 0.1, 0, F.z + 1.0, 0, { s: 0.8 });
      for (const [x, y, z] of hall.lampAt) hall.lamps.push(stand('w3walllamp', x, y, z, 0));
    }

    /* ================================================================ WHAT STANDS ROUND THE TURF
       The open shed (west), the white lattice fence, the red wooden house (east), the red plank wall and the pale grey
       building behind the chief canopy (south-east). Photographs 10, 12, 11, 5 and 6. */
    function buildSurround() {
      /* the open shed (photograph 10, read again beside 13 to 16): posts and a pink corrugated roof of TWO pitches, its
         ridge running north to south and its open gable end to the turf; tables of bai sri stand under it */
      const S0 = SHED, lo = S0.eave, hi = S0.eave + 1.25, sxc = (S0.x0 + S0.x1) / 2;
      const mPost = M({ color: 0x8a8376, roughness: 0.9 });
      for (const x of [S0.x0 + 0.2, S0.x1 - 0.2]) for (const z of [S0.z0 + 0.2, (S0.z0 + S0.z1) / 2, S0.z1 - 0.2]) box(mPost, x, lo / 2, z, 0.1, lo, 0.1);
      for (const z of [S0.z0 + 0.2, S0.z1 - 0.2]) box(mPost, sxc, hi / 2, z, 0.1, hi, 0.1);
      /* (a tin roof's eave is its picture's u, so the corrugations run down the slope) */
      planar(mTin, [[S0.x0 - 0.5, lo - 0.18, S0.z0 - 0.5], [S0.x0 - 0.5, lo - 0.18, S0.z1 + 0.6], [sxc, hi + 0.06, S0.z1 + 0.6], [sxc, hi + 0.06, S0.z0 - 0.5]]);
      planar(mTin, [[S0.x1 + 0.5, lo - 0.18, S0.z1 + 0.6], [S0.x1 + 0.5, lo - 0.18, S0.z0 - 0.5], [sxc, hi + 0.06, S0.z0 - 0.5], [sxc, hi + 0.06, S0.z1 + 0.6]]);
      const mRafter = M({ color: 0x5a4636, roughness: 0.9 });
      for (const z of [S0.z0 + 0.2, (S0.z0 + S0.z1) / 2, S0.z1 - 0.2]) { bar(mRafter, [S0.x0 + 0.2, lo, z], [sxc, hi, z], 0.04, 4); bar(mRafter, [S0.x1 - 0.2, lo, z], [sxc, hi, z], 0.04, 4); bar(mRafter, [S0.x0 + 0.2, lo, z], [S0.x1 - 0.2, lo, z], 0.035, 4); }
      bar(mRafter, [sxc, hi, S0.z0 + 0.2], [sxc, hi, S0.z1 - 0.2], 0.04, 4);
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
      /* (v26.1: its walls rendered and weathered, and its louvres lit as the wall is: drawn unlit, they glowed white in its
         shade. Its frames, sills, roof and eave are b_world3.js's buildEdges) */
      const mGrey = surf('render', { tile: 3, roughness: 0.95 }), mLouvre = M({ map: tex(makeLouvre(THREE, cnv)), color: 0xe4e7e8, roughness: 0.6 });
      wall(mGrey, GREY.x1, GREY.z, GREY.x0 - 6, GREY.z, 0, GREY.h); wall(mGrey, GREY.x0 - 6, GREY.z, GREY.x0 - 6, GREY.z + 6, 0, GREY.h);
      for (const x of [6.6, 4.2, 1.8, -0.6, -3.0]) { const g = new THREE.PlaneGeometry(1.1, 1.3); const m = new THREE.Mesh(g, mLouvre);
        m.position.set(x, 1.95, GREY.z - 0.012); m.rotation.y = Math.PI; world.add(m); owned.push(m); }
      box(mGrey, 1.0, GREY.h + 0.08, GREY.z + 0.2, 15.1, 0.16, 1.2);           // (v26.1: under its new roof, not out past its ends)
    }

    /* ================================================================ A TENT (photographs 10, 11, 1)
       A green steel frame, a peaked green roof, and a valance of cloth round the eave with swags draped over it. */
    const mFrameGreen = M({ color: 0x1f7a3a, roughness: 0.5, metalness: 0.3 });
    const satinMats = new Map();
    const satin = (hex) => { let m = satinMats.get(hex); if (!m) satinMats.set(hex, m = surf('satin', { tile: [0.7, 0.7], mirror: 'u', tint: hex, roughness: 0.42, side: THREE.DoubleSide })); return m; };
    /* (the same cloth with its folds drawn two and a half times as wide: a band of it seen from a few metres, in a narrow
       lens, with the folds at their first size and a gold tint in the shade, was a plank of wood: photographed in the
       films at Grandmaster Pho's bench) */
    const satinWideMats = new Map();
    const satinWide = (hex) => { let m = satinWideMats.get(hex); if (!m) satinWideMats.set(hex, m = surf('satin', { tile: [1.8, 0.9], mirror: 'u', tint: hex, roughness: 0.42, side: THREE.DoubleSide })); return m; };
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
    const tentCorners = (cx, cz, w, ry = 0) => { const hw = w / 2, c = Math.cos(ry), s = Math.sin(ry);
      return [[-hw, hw], [hw, hw], [hw, -hw], [-hw, -hw]].map(([lx, lz]) => [cx + lx * c + lz * s, cz - lx * s + lz * c]); };
    function tent(cx, cz, o = {}) {
      const w = o.w || TENT.w, e = o.eave || TENT.eave, pk = o.peak || TENT.peak, hw = w / 2;
      const roof = o.roof || satinRoof(0x18a044), frame = o.frame || mFrameGreen;
      /* its four poles: SW, SE, NE, NW when it stands square to the ground; turned by o.ry about its middle, the same
         four in its own frame (a tent turned to face north has its first pole at its front right) */
      const C = tentCorners(cx, cz, w, o.ry || 0), L = hw * Math.SQRT2, out = ([x, z]) => [x + (x - cx) / L * 0.085, z + (z - cz) / L * 0.085];
      for (const [x, z] of C) post(frame, x, z, 0.022, 0, e, 6);
      for (let k = 0; k < 4; k++) { const [xa, za] = C[k], [xb, zb] = C[(k + 1) % 4], oa = out(C[k]), ob = out(C[(k + 1) % 4]);
        bar(frame, [xa, e, za], [xb, e, zb], 0.018, 4);
        quad(roof, [oa[0], e + 0.02, oa[1]], [ob[0], e + 0.02, ob[1]], [cx, pk, cz], [cx, pk, cz]);
        /* the valance: a band of cloth hanging from the eave, and swags over it */
        const vm = (o.wide ? satinWide : satin)(o.valance != null ? o.valance : 0xf4f4f0);
        wall(vm, xa, za, xb, zb, e - (o.band || 0.28), e + 0.01);
        const n = o.swags || 3, cols = o.swagCols || [0x18a044, 0xf4f4f0], sd = o.swagDepth || 0.42, dr = o.swagDrop || 0.2;
        for (let s = 0; s < n; s++) { const k0 = s / n, k1 = (s + 1) / n;
          swag(satin(cols[(s + k * (o.swagStep || 0)) % cols.length]), [lp(xa, xb, k0), e + 0.005, lp(za, zb, k0)], [lp(xa, xb, k1), e + 0.005, lp(za, zb, k1)], sd, dr, 0.07); }
      }
      return C;
    }
    const satinRoofs = new Map();
    /* (`glow`: a dark sheet seen from below still passes a little of the day: without it the chief canopy's top was a
       black hole over him) */
    const satinRoof = (hex, glow = 0) => { const k = hex + ':' + glow; let m = satinRoofs.get(k); if (!m) satinRoofs.set(k, m = M({ color: hex, roughness: 0.62, side: THREE.DoubleSide, emissive: glow })); return m; };

