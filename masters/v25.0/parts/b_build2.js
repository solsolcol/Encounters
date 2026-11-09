
    /* ---------------------------------------------------- (v25.0) WHAT THIS CHAPTER ADDS TO HIS SHOP (§6.2)
       Each built in code from the shop's own materials and canvases, sized to the real thing, lit by the presets (no
       lamp, v15.1); the moving parts eased on wall time in shopFrame. Lersi Chin's things stand hidden until he brings
       them (the visit film shows them). */
    const props = { till: null, tillK: 0, tillTo: 0, bag: null, bagFlap: null, bagK: 0, bagTo: 0, jacket: null, jacketK: 0, jacketTo: 0,
                    fridge: null, fridgeDoor: null, fridgeLight: null, fridgeK: 0, fridgeTo: 0, wallet: null, note: null, sw: null, swDot: null,
                    shelf: null, piece: null, pieces: {}, mat: null, matK: 1, matTo: 1, bowl: null, water: null, mayom: null, thread: null,
                    cloth: null, khan: null, flames: [], yaam: null, envelope: null, stand: null, ribbons: [], sway: 0, lcThings: null,
                    ceil: null, ceilK: 1, ceilFrom: 1, ceilTo: 1, c0: 0, c1: 0, night: false, nightShut: [], signs: [], corSky: null, corCeil: null };
    function buildProps() {
      const S0 = worldS, top = COUNTER.h + 0.046;
      const mesh = (g, m, x, y, z, p = S0) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.receiveShadow = true; p.add(o); return o; };
      const mBlackP = M({ color: 0x161618, roughness: 0.45 }), mAluP = M({ color: 0xc8ccd0, roughness: 0.3, metalness: 0.85 });
      /* THE TILL: a black cash drawer in the cupboard's back, his side, its notes and coins in their trays */
      { const g = new THREE.Group(); g.position.set(TILL.x, TILL.y, TILL.z); S0.add(g); props.till = g;
        const W = 0.42, H = 0.1, D = 0.36;
        mesh(new THREE.BoxGeometry(W, 0.012, D), mBlackP, 0, -H / 2 + 0.006, D / 2, g);                       // its floor
        for (const sx of [-1, 1]) mesh(new THREE.BoxGeometry(0.012, H, D), mBlackP, sx * (W / 2 - 0.006), 0, D / 2, g);
        mesh(new THREE.BoxGeometry(W, H, 0.012), mBlackP, 0, 0, D - 0.006, g);
        const front = mesh(new THREE.BoxGeometry(W + 0.01, H + 0.012, 0.014), M({ color: 0x232326, roughness: 0.35 }), 0, 0, -0.004, g); void front;
        mesh(new THREE.BoxGeometry(0.12, 0.014, 0.01), mAluP, 0, 0.02, -0.014, g);                             // its handle
        const cols = ['#c9a8d6', '#8cc2a2', '#e8b48a', '#a6bfe0'];                                                // the notes, by colour
        cols.forEach((c2, i) => mesh(new THREE.BoxGeometry(0.075, 0.022, 0.15), M({ color: c2, roughness: 0.8 }), -0.15 + i * 0.09, -H / 2 + 0.024, 0.2, g));
        for (let i = 0; i < 4; i++) mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.012, 14), M({ color: i % 2 ? 0xc8b070 : 0xb8bcc0, roughness: 0.35, metalness: 0.8 }), -0.15 + i * 0.09, -H / 2 + 0.018, 0.06, g);
      }
      /* HIS BAG on the floor at the counter's end: a grey sling bag, its flap that lifts */
      { const g = new THREE.Group(); g.position.set(BAG.x, 0, BAG.z); g.rotation.y = 0.5; S0.add(g); props.bag = g;
        const mBag = M({ map: tex(makeCanvasCloth(THREE, cnv, '#3a3d44', 7101)), roughness: 0.92 });
        const body = mesh(new THREE.BoxGeometry(0.34, 0.24, 0.13), mBag, 0, 0.12, 0, g); void body;
        for (const sx of [-1, 1]) mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.13, 12, 1, false, sx < 0 ? Math.PI : 0, Math.PI), mBag, sx * 0.17, 0.12, 0, g).rotation.x = Math.PI / 2;
        const flapG = new THREE.Group(); flapG.position.set(0, 0.24, -0.065); g.add(flapG); props.bagFlap = flapG;
        mesh(new THREE.BoxGeometry(0.36, 0.012, 0.15), mBag, 0, 0, 0.075, flapG);
        mesh(new THREE.BoxGeometry(0.06, 0.014, 0.03), mBlackP, 0, -0.004, 0.15, flapG);                     // its buckle
        const strap = mesh(new THREE.TorusGeometry(0.24, 0.012, 6, 28, Math.PI * 0.9), mBag, 0, 0.13, 0.02, g); strap.rotation.set(-Math.PI / 2 + 0.2, 0, Math.PI * 0.05);
        solids.push(hidBox(0.4, 0.3, 0.22, BAG.x, 0.15, BAG.z, S0));
      }
      /* HIS JACKET over his stool: a navy zip jacket, its body draped across the seat and down both sides, a sleeve
         hanging (the cloth bent over the seat's round top by its own vertices — a drape, never a box) */
      { const g = new THREE.Group(); g.position.set(STOOL.x, 0.685, STOOL.z); g.rotation.y = -0.3; S0.add(g); props.jacket = g;
        const mJ = M({ map: tex(makeJacketCloth(THREE, cnv)), roughness: 0.85, side: THREE.DoubleSide });
        const geo = new THREE.PlaneGeometry(0.62, 0.5, 24, 20); geo.rotateX(-Math.PI / 2);
        const p = geo.attributes.position;
        for (let i = 0; i < p.count; i++) {
          const x = p.getX(i), z = p.getZ(i), r = Math.hypot(x * 0.9, z), over = Math.max(0, r - 0.16);
          p.setY(i, 0.012 + 0.008 * Math.cos(x * 30) * Math.cos(z * 22) - over * over * 6.5 - over * 0.9);
        }
        geo.computeVertexNormals();
        const drape = new THREE.Mesh(geo, mJ); g.add(drape);
        const slv = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.42, 12, 6, true), mJ); slv.position.set(0.25, -0.2, 0.08); slv.rotation.set(0.25, 0, 0.18); g.add(slv);
        const zip = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.004, 0.36), mAluP); zip.position.set(-0.04, 0.02, 0); g.add(zip);
      }
      /* THE DRINKS FRIDGE set into the cupboard's back, his side: a glass door in a black frame, lit inside, two
         shelves of water and canned drinks — and the wallet beside the water */
      { const C = COUNTER, W = FRIDGE.x1 - FRIDGE.x0, H = FRIDGE.h, cx = (FRIDGE.x0 + FRIDGE.x1) / 2, D = 0.44, zf = FRIDGE.z - 0.002;
        const g = new THREE.Group(); g.position.set(cx, 0, zf); S0.add(g); props.fridge = g;
        const mIn = B({ color: 0xbfd2e0 }); props.fridgeLight = mIn;                                            // the cabinet inside, lit by its own lamp (painted)
        mesh(new THREE.PlaneGeometry(W - 0.03, H - 0.05), mIn, 0, H / 2 + 0.01, D - 0.01, g).rotation.y = Math.PI;   // its back wall
        for (const sx of [-1, 1]) mesh(new THREE.PlaneGeometry(D - 0.02, H - 0.05), mIn, sx * (W / 2 - 0.015), H / 2 + 0.01, D / 2, g).rotation.y = sx * Math.PI / 2;
        mesh(new THREE.PlaneGeometry(W - 0.03, D - 0.02), mIn, 0, H - 0.015, D / 2, g).rotation.x = Math.PI / 2;
        mesh(new THREE.PlaneGeometry(W - 0.03, D - 0.02), mIn, 0, 0.035, D / 2, g).rotation.x = -Math.PI / 2;
        const mWire = M({ color: 0xd8dde0, roughness: 0.35, metalness: 0.7 });
        for (const y of [0.2]) for (let k = 0; k < 7; k++) mesh(new THREE.BoxGeometry(W - 0.04, 0.004, 0.004), mWire, 0, y, 0.05 + k * 0.06, g);
        /* the bottles of water (clear, a blue cap and a blue label) and the cans, by a fixed seed */
        const mPet = M({ color: 0xd6e8f2, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.5, depthWrite: false });
        const mCap = M({ color: 0x2a6ac8, roughness: 0.4 }), mLab = M({ color: 0x4a8ad8, roughness: 0.6 });
        const canCols = [0xc81e24, 0x2a8a3a, 0xe8b21a, 0x1e4aa8, 0xc81e24];
        for (let k = 0; k < 5; k++) { const x = -W / 2 + 0.07 + k * 0.075;
          const b = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.15, 14), mPet, x, 0.04 + 0.075, 0.12, g); b.renderOrder = 2;
          mesh(new THREE.CylinderGeometry(0.0305, 0.0305, 0.045, 14), mLab, x, 0.04 + 0.07, 0.12, g);
          mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.02, 10), mCap, x, 0.04 + 0.16, 0.12, g); }
        for (let k = 0; k < 5; k++) mesh(new THREE.CylinderGeometry(0.033, 0.033, 0.115, 16), M({ color: canCols[k], roughness: 0.3, metalness: 0.75 }), -W / 2 + 0.07 + k * 0.08, 0.2 + 0.06, 0.13, g);
        /* the wallet: brown leather, folded, lying beside the bottles at the front of the floor */
        const wl = new THREE.Group(); wl.position.set(W / 2 - 0.075, 0.046, 0.07); wl.rotation.y = 0.35; g.add(wl); props.wallet = wl;
        mesh(new THREE.BoxGeometry(0.11, 0.018, 0.09), M({ map: tex(makeLeather(THREE, cnv)), roughness: 0.6 }), 0, 0.009, 0, wl);
        /* the door: a black frame and its glass, hinged at its right edge, swinging open toward him */
        const hinge = new THREE.Group(); hinge.position.set(W / 2, 0, 0); g.add(hinge); props.fridgeDoor = hinge;
        const fr = (w, h, x, y) => mesh(new THREE.BoxGeometry(w, h, 0.03), mBlackP, x, y, -0.015, hinge);
        fr(W, 0.045, -W / 2, 0.022); fr(W, 0.045, -W / 2, H - 0.022); fr(0.04, H, -W + 0.02, H / 2); fr(0.04, H, -0.02, H / 2);
        const gl = mesh(new THREE.PlaneGeometry(W - 0.07, H - 0.08), M({ color: 0xcfe2ee, roughness: 0.05, transparent: true, opacity: 0.22, depthWrite: false }), -W / 2, H / 2, -0.016, hinge);
        gl.rotation.y = Math.PI; gl.renderOrder = 2;
        mesh(new THREE.BoxGeometry(0.014, 0.16, 0.02), mAluP, -W + 0.05, H / 2, -0.04, hinge);                 // its handle, at the opening edge
      }
      /* THE NOTE in his own hand on the glass beside his phone: CALL PONG */
      { const n = mesh(new THREE.PlaneGeometry(0.076, 0.076), M({ map: tex(makeSticky(THREE, cnv, DATA.words.noteText || 'CALL PONG')), roughness: 0.85 }), NOTE.x, top + 0.0012, NOTE.z);
        n.rotation.set(-Math.PI / 2, 0, NOTE.ry + Math.PI); props.note = n; }
      /* THE LIGHT SWITCH on the left wall inside the door: a white plate, two rockers, the small orange neon of a
         Singapore switch — the one point of light by the door in the dark */
      { const g = new THREE.Group(); g.position.set(SWITCH.x, SWITCH.y, SWITCH.z); g.rotation.y = Math.PI / 2; S0.add(g); props.sw = g;
        mesh(new THREE.BoxGeometry(0.086, 0.086, 0.008), M({ color: 0xf2f2ee, roughness: 0.45 }), 0, 0, 0.004, g);
        for (const sx of [-1, 1]) mesh(new THREE.BoxGeometry(0.03, 0.05, 0.008), M({ color: 0xe8e8e4, roughness: 0.4 }), sx * 0.018, 0, 0.011, g);
        props.swDot = mesh(new THREE.CircleGeometry(0.0035, 10), B({ color: 0xff8a2a }), 0.018, -0.032, 0.0155, g); }
      /* THE SHELF beside the door, and on it the piece he took in chapter 1, facing the door as he was told — each of the
         three made ready (which one is his, play decides), its light cut (the amulet rule: a few centimetres at a shelf) */
      { const g = new THREE.Group(); g.position.set(SHELF.x, SHELF.y, SHELF.z); S0.add(g); props.shelf = g;
        mesh(new THREE.BoxGeometry(0.2, 0.02, 0.3), M({ color: 0x5a3a24, roughness: 0.6 }), 0, -0.01, 0, g);
        for (const dz of [-0.11, 0.11]) mesh(new THREE.BoxGeometry(0.02, 0.07, 0.02), mBlackP, -0.08, -0.045, dz, g);
        mesh(new THREE.PlaneGeometry(0.16, 0.2), M({ color: 0x9a1418, roughness: 0.85 }), 0.005, 0.0012, 0, g).rotation.x = -Math.PI / 2;   // a red cloth under it
        for (const [key, size, axis, ry, rz] of [['e4nangkwak', 0.075, 'y', 0, 0], ['e4takrut', 0.066, 'x', 0, Math.PI / 2], ['e4phayant', 0.085, 'x', 0.3, 0]]) {
          const pg = new THREE.Group(); pg.visible = false; g.add(pg); props.pieces[key.slice(2)] = pg; pg.userData.dyn = true;
          fitModel(key, pg, size, axis, ry, rz);
        }
      }
      /* LERSI CHIN'S THINGS (§2.2 #7), hidden until the visit: his woven mat on the floor (rolled up in the film until he
         lays it), the holy-water bowl, the seven-leaf mayom bundle, a skein of white cotton thread, a clean white cloth,
         the homage tray (a footed brass phan of marigolds and jasmine, two candles, three sticks of incense) and his
         woven cloth bag */
      { const g = new THREE.Group(); g.visible = false; S0.add(g); props.lcThings = g;
        const mat = new THREE.Group(); mat.position.set(MAT.x, 0.004, MAT.z - MAT.d / 2); g.add(mat); props.mat = mat;
        const mt = tex(makeReedMat(THREE, cnv, 5207)); mt.repeat.set(2, 3);
        const mp = new THREE.Mesh(new THREE.PlaneGeometry(MAT.w, MAT.d), M({ map: mt, roughness: 0.92 })); mp.rotation.x = -Math.PI / 2; mp.position.z = MAT.d / 2; mat.add(mp);
        const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, MAT.w, 16), M({ map: mt, roughness: 0.92 })); roll.rotation.z = Math.PI / 2; roll.position.y = 0.05; mat.add(roll);
        mat.userData.plane = mp; mat.userData.roll = roll;
        const at = (dx, dz) => [LC.x + dx, LC.z + dz];
        /* the bowl: a turned silver bowl on its foot, water in it */
        { const [x, z] = at(0.36, 0.3); const bg = new THREE.Group(); bg.position.set(x, 0.006, z); g.add(bg); props.bowl = bg;
          const prof = [[0, 0], [0.05, 0], [0.055, 0.012], [0.045, 0.02], [0.07, 0.03], [0.1, 0.06], [0.112, 0.095], [0.108, 0.1], [0.098, 0.064], [0.07, 0.036], [0, 0.032]]
            .map(([r, y]) => new THREE.Vector2(r, y));
          bg.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 40), M({ color: 0xd8dadc, roughness: 0.22, metalness: 0.9, envMapIntensity: 3, side: THREE.DoubleSide })));
          const wtr = new THREE.Mesh(new THREE.CircleGeometry(0.1, 36), M({ color: 0xa8c4d4, roughness: 0.04, metalness: 0.1, transparent: true, opacity: 0.7 })); wtr.rotation.x = -Math.PI / 2; wtr.position.y = 0.082; bg.add(wtr); props.water = wtr; }
        /* the mayom bundle across the bowl's rim: seven sprigs tied (a stand-in drawn in code only until its model lands) */
        { const mg = new THREE.Group(); const [x, z] = at(0.36, 0.3); mg.position.set(x - 0.02, 0.11, z); mg.rotation.set(0, 0.6, 0.18); g.add(mg); props.mayom = mg;
          const mLeafM = M({ color: 0x3e7a2e, roughness: 0.7, side: THREE.DoubleSide }), mStem = M({ color: 0x5a6a2a, roughness: 0.8 });
          for (let k = 0; k < 7; k++) { const a = (k - 3) * 0.12, st = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.2, 5), mStem);
            st.rotation.z = Math.PI / 2 + a; st.position.set(0.02, k * 0.002, (k - 3) * 0.008); mg.add(st);
            for (let j = 0; j < 9; j++) { const lf = new THREE.Mesh(new THREE.PlaneGeometry(0.032, 0.014), mLeafM);
              lf.position.set(0.04 + j * 0.013, Math.sin(a) * 0.05 + (j % 2 ? 0.006 : -0.006), (k - 3) * 0.008 + (j % 2 ? 0.01 : -0.01));
              lf.rotation.set(Math.PI / 2 + (j % 2 ? 0.5 : -0.5), 0, a); mg.add(lf); } }
          mg.add(new THREE.Mesh(new THREE.TorusGeometry(0.012, 0.003, 6, 14), M({ color: 0xf2f0e8, roughness: 0.8 }))); }
        /* the white thread: a skein, coiled */
        { const [x, z] = at(-0.34, 0.34); const th = new THREE.Group(); th.position.set(x, 0.012, z); g.add(th); props.thread = th;
          for (let k = 0; k < 3; k++) { const tr = new THREE.Mesh(new THREE.TorusGeometry(0.028 - k * 0.002, 0.0028, 6, 24), M({ color: 0xf4f2ea, roughness: 0.85 })); tr.rotation.x = Math.PI / 2; tr.position.y = k * 0.004; th.add(tr); } }
        /* the clean white cloth, folded, where the piece will be set */
        { const [x, z] = at(-0.36, 0.08); const cl = mesh(new THREE.BoxGeometry(0.26, 0.008, 0.22), M({ color: 0xf6f4ee, roughness: 0.9 }), x, 0.008, z, g); props.cloth = cl; }
        /* the homage tray between them: a footed brass phan, marigolds and jasmine on it, two candles, three sticks */
        { const [x, z] = at(0, 0.52); const kg = new THREE.Group(); kg.position.set(x, 0.004, z); g.add(kg); props.khan = kg;
          const mBrass = M({ color: 0xc89a3a, roughness: 0.3, metalness: 0.9, envMapIntensity: 3 });
          kg.add(new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.06, 0], [0.04, 0.02], [0.03, 0.07], [0.12, 0.085], [0.13, 0.095], [0, 0.095]].map(([r, y]) => new THREE.Vector2(r, y)), 32), mBrass));
          const mMari = M({ color: 0xf0901a, roughness: 0.7 }), mJas = M({ color: 0xf6f2e6, roughness: 0.75 }), r = rng(5231);
          for (let k = 0; k < 18; k++) { const a = r() * 6.28, d = 0.02 + r() * 0.08; const s2 = new THREE.Mesh(new THREE.SphereGeometry(0.018 + r() * 0.006, 8, 6), k % 3 ? mMari : mJas);
            s2.position.set(Math.cos(a) * d, 0.11 + r() * 0.02, Math.sin(a) * d); kg.add(s2); }
          const mCand = M({ color: 0xf2e6c0, roughness: 0.5 }), mFlame = B({ color: 0xffc070, transparent: true, opacity: 0, depthWrite: false });
          for (const sx of [-1, 1]) { const cd = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.008, 0.09, 10), mCand); cd.position.set(sx * 0.07, 0.14, -0.04); kg.add(cd);
            const fl = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 6), mFlame); fl.scale.y = 2; fl.position.set(sx * 0.07, 0.195, -0.04); kg.add(fl); props.flames.push(fl); }
          const mStk = M({ color: 0x9a2a1a, roughness: 0.7 });
          for (let k = 0; k < 3; k++) { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.0016, 0.0016, 0.22, 5), mStk); st.position.set((k - 1) * 0.012, 0.2, 0.03); st.rotation.z = (k - 1) * 0.12; kg.add(st);
            const em = new THREE.Mesh(new THREE.SphereGeometry(0.003, 6, 4), mFlame); em.position.set((k - 1) * 0.012 + (k - 1) * 0.013, 0.31, 0.03); kg.add(em); props.flames.push(em); } }
        /* his woven bag beside him: a yaam, its stripes, its long strap */
        { const [x, z] = at(-0.56, -0.16); const yg = new THREE.Group(); yg.position.set(x, 0, z); yg.rotation.set(0, 0.4, 0); g.add(yg); props.yaam = yg;
          const mY = M({ map: tex(makeYaamCloth(THREE, cnv)), roughness: 0.95, side: THREE.DoubleSide });
          const bd = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.34), mY); bd.position.y = 0.025; yg.add(bd);
          const sp = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.01, 5, 24, Math.PI), mY); sp.rotation.x = -Math.PI / 2; sp.position.set(0, 0.012, -0.17); yg.add(sp); }
        /* the envelope for the temple (ending D): white, the piece in it, his hand's words on it */
        { const ev = mesh(new THREE.PlaneGeometry(0.17, 0.11), M({ map: tex(makeEnvelope(THREE, cnv, DATA.words.envelope || 'For the temple')), roughness: 0.85 }), -0.82, top + 0.0012, COUNTER.z - 0.02);
          ev.rotation.set(-Math.PI / 2, 0, Math.PI - 0.08); ev.visible = false; props.envelope = ev; }
      }
    }
    /* a model sized by its own box to `size` along `axis`, stood on its group's floor, centred (chapter 1's tray rule) */
    function fitModel(key, grp, size, axis, ry, rz) {
      return parseOnce(key).then(({ scene: sc }) => {
        if (!alive) return;
        const m = sc.clone(true); m.rotation.set(0, ry, rz);
        m.updateMatrixWorld(true);
        const bb = new THREE.Box3().setFromObject(m), sz = bb.getSize(new THREE.Vector3());
        m.scale.setScalar(size / sz[axis]); m.updateMatrixWorld(true); bb.setFromObject(m);
        m.position.set(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2);
        m.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = true; if (key === 'e4nangkwak') bronzeLift(o); } });
        grp.add(m);
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
    }

    /* ---------------------------------------------------- his phone and his laptop: what their screens show
       (drawn only when what they show changes; the screens are always mapped and only their colour lights them, v15.1) */
    function phoneDraw(mode, secs) {
      const P = shop.phone; if (!P) return;
      const sig = mode + ':' + (mode === 'call' ? Math.floor(secs || 0) : '');
      if (P.drawn === sig) return; P.drawn = sig;
      const x = P.x, Wd = DATA.words;
      const g = x.createLinearGradient(0, 0, 0, 557); g.addColorStop(0, '#22324e'); g.addColorStop(1, '#0a0e18');
      x.fillStyle = g; x.fillRect(0, 0, 256, 557);
      x.textAlign = 'center'; x.textBaseline = 'alphabetic';
      /* his contact's round picture: a P on green */
      x.fillStyle = '#2f7a5a'; x.beginPath(); x.arc(128, 170, 52, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#ffffff'; x.font = 'bold 54px "Helvetica Neue", Arial, sans-serif'; x.fillText(String(Wd.phonePong || 'P').charAt(0), 128, 189);
      x.font = '34px "Helvetica Neue", Arial, sans-serif'; x.fillText(Wd.phonePong || 'Pong', 128, 272);
      x.fillStyle = 'rgba(255,255,255,0.72)'; x.font = '20px "Helvetica Neue", Arial, sans-serif';
      const s = Math.max(0, Math.floor(secs || 0));
      x.fillText(mode === 'calling' || mode === 'ringing' ? (Wd.phoneCalling || 'calling…') : `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`, 128, 306);
      /* the buttons: red to end; a green to answer when it rings */
      if (mode === 'ringing') { x.fillStyle = '#2fae5a'; x.beginPath(); x.arc(178, 470, 30, 0, Math.PI * 2); x.fill(); x.fillStyle = '#e0433a'; x.beginPath(); x.arc(78, 470, 30, 0, Math.PI * 2); x.fill(); }
      else { x.fillStyle = '#e0433a'; x.beginPath(); x.arc(128, 470, 30, 0, Math.PI * 2); x.fill(); }
      x.fillStyle = '#fff'; x.save(); x.translate(mode === 'ringing' ? 78 : 128, 470); x.rotate(2.36); x.fillRect(-14, -5, 28, 10); x.restore();
      P.scr.map.needsUpdate = true;
    }
    const shopCtl = {
      shutter(u, secs = 0) { shop.uFrom = shop.u; shop.uTo = Math.max(0, Math.min(1, u)); shop.t0 = wallNow(); shop.t1 = shop.t0 + Math.max(0.001, secs); if (!secs) shop.u = shop.uTo; },
      lights(k, secs = 0) { shop.ledFrom = shop.ledK; shop.ledTo = k; shop.l0 = wallNow(); shop.l1 = shop.l0 + Math.max(0.001, secs); if (!secs) shop.ledK = k; },
      ceiling(k, secs = 0) { props.ceilFrom = props.ceilK; props.ceilTo = k; props.c0 = wallNow(); props.c1 = props.c0 + Math.max(0.001, secs); if (!secs) props.ceilK = k; },
      /* the mall shut for the night: the open units' own shutters down, their signs and the corridor's skylight dimmed */
      night(on) { props.night = !!on; for (const s2 of props.nightShut) s2.visible = !!on;
        for (const m of props.signs) m.color.setScalar(on ? 0.22 : 1);
        if (props.corSky) props.corSky.color.setHex(on ? 0x2a3038 : 0xdfe6ec);
        if (props.corCeil) props.corCeil.emissive.setHex(on ? 0x0e0e10 : 0x4a4844); },
      till(open) { props.tillTo = open ? 1 : 0; }, bag(open) { props.bagTo = open ? 1 : 0; }, jacket(on) { props.jacketTo = on ? 1 : 0; },
      fridge(open) { props.fridgeTo = open ? 1 : 0; },
      phone(mode) { shop.phoneMode = mode || ''; shop.phoneOn = mode ? wallNow() : 0; },
      lap(mode, o = {}) { shop.lapMode = mode || ''; shop.lapOn = mode ? 1 : 0; shop.lapO = o; }
    };
    const _swV = new THREE.Vector3();
    function shopFrame(now) {
      stockLod();                                                                       // (v24.22) near or far, place by place
      const k = Math.min(1, Math.max(0, (now - shop.t0) / Math.max(0.001, shop.t1 - shop.t0)));
      if (shop.t1 > 0 && k < 1) shop.u = shop.uFrom + (shop.uTo - shop.uFrom) * k * k * (3 - 2 * k); else if (shop.t1 > 0) shop.u = shop.uTo;
      if (shop.curtain) {
        const h = Math.max(0.02, shop.top * (1 - shop.u));
        shop.curtain.scale.y = h; shop.curTex.repeat.set(1, h / 0.6);
        shop.bar.position.set(0, shop.top - h, SHOP.z1); shop.bar.visible = shop.u < 0.995;
        const dep = 0.3 + 2.8 * shop.u; shop.spill.scale.y = dep; shop.spill.position.z = SHOP.z1 - dep / 2 + 0.2;
        /* by day the morning's warm grey on the floor; by night the corridor's cold light lying under the shutter's edge */
        shop.spillMat.color.setHex(props.night ? 0x9ab0d0 : 0xffe2c0);
        shop.spillMat.opacity = (props.night ? 0.16 : 0.2) * Math.min(1, shop.u * 2.5);
      }
      const kl = Math.min(1, Math.max(0, (now - shop.l0) / Math.max(0.001, shop.l1 - shop.l0)));
      if (shop.l1 > 0) shop.ledK = kl < 1 ? shop.ledFrom + (shop.ledTo - shop.ledFrom) * kl : shop.ledTo;
      for (const m of shop.leds) if (m) m.color.setRGB(0.12 + 0.88 * shop.ledK, 0.12 + 0.88 * shop.ledK, 0.13 + 0.87 * shop.ledK);
      const kc = Math.min(1, Math.max(0, (now - props.c0) / Math.max(0.001, props.c1 - props.c0)));
      if (props.c1 > 0) props.ceilK = kc < 1 ? props.ceilFrom + (props.ceilTo - props.ceilFrom) * kc : props.ceilTo;
      if (props.ceil) props.ceil.color.setRGB(0.1 + 0.9 * props.ceilK, 0.1 + 0.9 * props.ceilK, 0.11 + 0.89 * props.ceilK);
      /* the moving parts, eased on the wall clock (a drawer is pulled, a flap lifts, a door swings) */
      const dt = Math.min(0.1, Math.max(0, now - (shop.lastNow || now))); shop.lastNow = now;
      const ez = (v, to, r) => v + (to - v) * (1 - Math.exp(-dt * r));
      props.tillK = ez(props.tillK, props.tillTo, 6); props.bagK = ez(props.bagK, props.bagTo, 5);
      props.jacketK = ez(props.jacketK, props.jacketTo, 5); props.fridgeK = ez(props.fridgeK, props.fridgeTo, 4.5);
      if (props.till) props.till.position.z = TILL.z - 0.24 * props.tillK;
      if (props.bagFlap) props.bagFlap.rotation.x = -1.9 * props.bagK;
      if (props.jacket) { props.jacket.position.y = 0.685 + 0.12 * props.jacketK; props.jacket.rotation.z = 0.2 * props.jacketK; }
      if (props.fridgeDoor) props.fridgeDoor.rotation.y = -1.75 * props.fridgeK;
      if (props.fridgeLight) props.fridgeLight.color.setRGB(0.55 + 0.4 * props.fridgeK, 0.62 + 0.36 * props.fridgeK, 0.7 + 0.3 * props.fridgeK);
      /* the stand's ribbons in the air-con's draft: a slow swing, its own rhythm, more when `sway` is up */
      if (props.ribbons.length) {
        const sw = 0.05 + 0.2 * props.sway;
        props.ribbons.forEach((rb, i) => { rb.rotation.z = rb.userData.rz0 + Math.sin(now * (0.9 + i * 0.23) + i * 1.7) * sw;
                                           rb.rotation.x = Math.sin(now * (0.7 + i * 0.31) + i) * sw * 0.6; });
      }
      /* the mat laid out (matK 0 rolled at the counter's foot, 1 flat) */
      if (props.mat) { const mk = props.matK, P2 = props.mat.userData.plane, R = props.mat.userData.roll;
        P2.scale.y = Math.max(0.001, mk); P2.position.z = MAT.d * mk / 2; R.position.z = MAT.d * mk; R.visible = mk < 0.995; }
      /* the switch's neon: brighter in the dark */
      if (props.swDot) { const lit = props.ceilK; props.swDot.material.color.setRGB(1, 0.55 - 0.2 * lit, 0.16); }
      /* his laptop: the sales page by day (chapter 1's), the forum in ending A and the coda */
      if (shop.lap) {
        const L = shop.lap, on = !!shop.lapOn, o = shop.lapO || {};
        const sig = on ? [shop.lapMode, o.n || 0, o.chars || 0, o.newK || 0, o.post ? 1 : 0, Math.floor(now * 2.4) % 2].join(',') : 'off';
        if (sig !== L.sig) { L.sig = sig;
          if (on) { if (shop.lapMode === 'sales') drawSalesApp(L.x, { wed: 1, bar: 1, blink: true, stock: shop.stockCount });
                    else drawForum(L.x, Object.assign({ blink: Math.floor(now * 2.4) % 2 === 0, words: DATA.words }, o));
                    L.t.needsUpdate = true; }
          L.m.color.setRGB(on ? 1 : 0.02, on ? 1 : 0.024, on ? 1 : 0.03); }
      }
      if (shop.phone) {
        const P = shop.phone, on = shop.phoneOn ? now - shop.phoneOn : -1;
        if (on >= 0 && shop.phoneMode) { phoneDraw(shop.phoneMode, shop.phoneSecs != null ? shop.phoneSecs : on); P.scr.color.setRGB(1, 1, 1);
          const buzz = shop.phoneMode === 'ringing' ? Math.sin(on * 90) * 0.0012 * (Math.sin(on * 6) > 0 ? 1 : 0) : 0; P.g.position.x = P.base.x + buzz; }
        else { P.scr.color.setRGB(0.02, 0.024, 0.03); P.g.position.x = P.base.x; }
      }
    }
