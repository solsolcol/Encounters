#!/usr/bin/env python3
"""Episode 4 chapter 2 (e4c2.js), assembled — masters/v25.0/assemble.py

Chapters are COPIED, not bundled (v6.11): this chapter's shop is chapter 1's World S, its cast is chapter 1's people
system, its film helpers are chapter 1's. Rather than retyping ~2,400 lines by hand (and drifting from them), the
chapter is written as parts (masters/v25.0/parts/*.js) with markers

    //@@COPY a-b

each replaced by lines a..b (1-based, inclusive) of src/chapters/e4/e4c1.js exactly as they stand in the version pinned
below — then a short list of EDITS, each an exact string that must occur exactly once in the assembled text (the v14.1
rule for targeted edits: unique strings, never line ranges, never a comment appended to a line of code). The output is
src/chapters/e4/e4c2.js. Run it from the repo root:

    python3 -I masters/v25.0/assemble.py

It refuses to write if chapter 1 has changed under the pinned line numbers (its sha1), if a marker's range is bad, or if
any edit does not match exactly once.
"""
import hashlib, os, re, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SRC1 = os.path.join(ROOT, 'src/chapters/e4/e4c1.js')
OUT = os.path.join(ROOT, 'src/chapters/e4/e4c2.js')
PARTS = ['a_head.js', 'b_build1.js', 'b_build2.js', 'b_build3.js', 'b_build4.js', 'c_tail.js']
E4C1_SHA1 = '0c2c44f2044046dc5293ffee60cb257c91500f10'      # chapter 1 as of 28c92e8 (v24.39), the line numbers' version

# (old, new): each `old` must occur exactly once in the assembled text
EDITS = [
    # camAt: one world here — the stock's levels for every lens (chapter 1 asked which world the lens stood in)
    ("      if (worldOf(p[0]) === 'S' || worldOf(p[0]) === 'R') stockLod();   // (v24.22) the stock's levels for THIS frame's lens, never the last one's (v24.36: the samnak's cabinets too)\n",
     "      stockLod();                                  // (v24.22) the stock's levels for THIS frame's lens, never the last one's (v25.0: one world)\n"),
    # chapter 1's ending D's sky point: not used here
    ("    const DUSK_SKY = new THREE.Vector3();\n", ""),
    # (v25.3) gripTick is chapter 1's own again: Lersi Chin's arms are no longer bent by the drivers' solver (v25.0's
    # eased grip and v25.2's per-arm share and pole are out with it). His elbow is a hinge in every key of his takes and
    # that solver bends it out of its plane; his arms are solved in the parts (b_build3: armSolve) after gripTick has
    # kept each arm's own turns (wUp, wFore), which peopleTick gives back before the mixer runs again.
    # (v25.2) a lean laid on a take after the mixer and before the look (Lersi Chin bending to the mat), so the look turns
    # the head on the leaned body and the arms are solved from the leaned shoulders (v25.3: by the parts' bodyAfter, on
    # P.after; the edit itself is the P.preLook line further down)
    # (v25.2) his notebook: the real one (a checked picture on white, then Meshy: masters/v25.2/make.sh), turned so its
    # pages read from his side; the blue box stands in until it lands (Chad, 10 Nov: "the wallet which is just a block of
    # colour" — the notebook was the same block, found by the prop audit)
    ("        const cover = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.012, 0.31), M({ color: 0x2a3a5a, roughness: 0.6 })); cover.position.y = 0.006; bk.add(cover);\n",
     "        const cover = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.012, 0.31), M({ color: 0x2a3a5a, roughness: 0.6 })); cover.position.y = 0.006; bk.add(cover);\n"
     "        fitModel('e4notebook', bk, 0.46, 'x', Math.PI, 0).then(m => { if (!m || !alive) return; cover.visible = false; bk.userData.book = m;\n"
     "          if (bk.userData.onBook) bk.userData.onBook(m); });\n"),
    # (v25.2) a film may give the look's weight itself (P.lookK, Lersi Chin's eased looks): a head turns over a human time
    # and a seek lands on the same turn; gaze() hands the weight back to the eased one
    ("          P.lookW += (want - P.lookW) * (1 - Math.exp(-wdt * 2.4));\n",
     "          /* (v25.2) a film's own weight for the look (P.lookK), eased on its clock; else eased here on the wall clock */\n"
     "          if (P.lookK != null) P.lookW = P.lookK * want;\n"
     "          else P.lookW += (want - P.lookW) * (1 - Math.exp(-wdt * 2.4));\n"),
    ("      if (on) { P.lookAt = camera; P.neck = neck; P.lookW = 1; }\n",
     "      if (on) { P.lookAt = camera; P.neck = neck; P.lookW = 1; P.lookK = null; }\n"),
    ("          if (P.spine) { if (!P.spineWrote) P.spineWrote = new THREE.Quaternion(); P.spineWrote.copy(P.spine.quaternion); }\n",
     "          if (P.spine) { if (!P.spineWrote) P.spineWrote = new THREE.Quaternion(); P.spineWrote.copy(P.spine.quaternion); }\n"
     "          if (P.preLook) P.preLook(P);\n"),
    # the shop's ceiling lights and the ceiling itself on their own materials, off at night (shopCtl.ceiling); the
    # corridor's ceiling, its skylight and the open units' signs handed to the night (shopCtl.night)
    ("      shop.leds.push(mLed);\n",
     "      shop.leds.push(mLed);\n"
     "      /* (v25.0) the ceiling's own lights and the ceiling's glow, apart from the cases' LEDs: off after closing */\n"
     "      const mCeilLed = B({ color: 0xf6fbff }); props.ceil = mCeilLed;\n"
     "      const mCeilS = M({ color: 0xf2f0ea, roughness: 0.9, emissive: 0x4a4844 }); props.ceilS = mCeilS;\n"),
    ("      pl(SHOP.x1 - SHOP.x0, SHOP.z1 - SHOP.z0, mCeil, 0, SHOP.H, (SHOP.z0 + SHOP.z1) / 2, Math.PI / 2);\n",
     "      pl(SHOP.x1 - SHOP.x0, SHOP.z1 - SHOP.z0, mCeilS, 0, SHOP.H, (SHOP.z0 + SHOP.z1) / 2, Math.PI / 2);\n"),
    ("const d = mesh(dl, mLed, x, SHOP.H - 0.004, z);", "const d = mesh(dl, mCeilLed, x, SHOP.H - 0.004, z);"),
    ("bx(0.03, 0.012, SHOP.z1 - SHOP.z0 - 0.2, mLed,", "bx(0.03, 0.012, SHOP.z1 - SHOP.z0 - 0.2, mCeilLed,"),
    ("      { pl(COR.x1 - COR.x0, COR.z1 - COR.z0, mTer, 0, 0, (COR.z0 + COR.z1) / 2, -Math.PI / 2);\n"
     "        pl(COR.x1 - COR.x0, COR.z1 - COR.z0, mCeil, 0, COR.H, (COR.z0 + COR.z1) / 2, Math.PI / 2);\n"
     "        const sky = B({ color: 0xdfe6ec });\n",
     "      { pl(COR.x1 - COR.x0, COR.z1 - COR.z0, mTer, 0, 0, (COR.z0 + COR.z1) / 2, -Math.PI / 2);\n"
     "        pl(COR.x1 - COR.x0, COR.z1 - COR.z0, mCeil, 0, COR.H, (COR.z0 + COR.z1) / 2, Math.PI / 2);\n"
     "        const sky = B({ color: 0xdfe6ec });\n"
     "        props.corSky = sky; props.corCeil = mCeil;   // (v25.0) the corridor after closing (shopCtl.night)\n"),
    ("          if (open) mallRoom(open, cx, pz, face);\n",
     "          if (open) { mallRoom(open, cx, pz, face);\n"
     "            /* (v25.0) and its own shutter, down after closing (shopCtl.night) */\n"
     "            const ns = new THREE.Mesh(new THREE.PlaneGeometry(unitW - 0.5, 2.8), mSlat); ns.position.set(cx, 1.4, pz + face * 0.03); ns.rotation.y = face > 0 ? 0 : Math.PI;\n"
     "            ns.visible = false; S0.add(ns); props.nightShut.push(ns); }\n"),
    ("s2.position.set(cx, 3.36, pz + face * 0.012); s2.rotation.y = face > 0 ? 0 : Math.PI; S0.add(s2); }",
     "s2.position.set(cx, 3.36, pz + face * 0.012); s2.rotation.y = face > 0 ? 0 : Math.PI; S0.add(s2); props.signs.push(s2.material); }"),
    # the Grand Opening stand: inside the door, turned in, its flowers dried — the tall shape in the dark (P2) — its
    # ribbons in the air-con's draft (shopFrame); the two the well-wishers stood outside are gone, weeks on
    ("      const flowerStand = (px, pz, pry, words, seed, cols = [0xd8202a, 0xf2c030, 0xf27aa0, 0xf6f0e0, 0xe8642a]) => {\n",
     "      const flowerStand = (px, pz, pry, words, seed, cols = [0xd8202a, 0xf2c030, 0xf27aa0, 0xf6f0e0, 0xe8642a], sway = false) => {\n"),
    ("const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.06, 28), M({ color: 0x2e5a2e, roughness: 0.8 }));",
     "const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.06, 28), M({ color: sway ? 0x4a4632 : 0x2e5a2e, roughness: 0.8 }));"),
    ("          rb.position.set(x, 0.92, 0.07); rb.rotation.z = -Math.sign(x) * 0.05; g.add(rb); });\n"
     "        solids.push(hidBox(0.6, 1.6, 0.5, px, 0.8, pz, S0));\n"
     "      };\n",
     "          rb.position.set(x, 0.92, 0.07); rb.rotation.z = -Math.sign(x) * 0.05; g.add(rb);\n"
     "          if (sway) { rb.userData.rz0 = rb.rotation.z; props.ribbons.push(rb); } });\n"
     "        solids.push(hidBox(0.6, 1.6, 0.5, px, 0.8, pz, S0));\n"
     "        return g;\n"
     "      };\n"),
    ("      flowerStand(1.62, 2.45, -0.35, [['开张大吉', false, -0.29], ['GRAND OPENING', true, 0.29]], 4851);   // (v24.5, L6-5: it read GRANDOPENING)\n",
     "      /* (v25.0) weeks on: still inside his door, turned in to the shop, its flowers dried brown (nobody took it away) */\n"
     "      const DRIED = [0x7a4a2e, 0x9a6a48, 0x8a5a5a, 0xb8a080, 0x6a4a30];\n"
     "      props.stand = flowerStand(STAND.x, STAND.z, STAND.ry, [['开张大吉', false, -0.29], ['GRAND OPENING', true, 0.29]], 4851, DRIED, true);\n"),
    ("      flowerStand(1.8, 3.45, -0.12, [['生意兴隆', false, -0.29], ['财源广进', false, 0.29]], 4853, [0xf27aa0, 0xf6f0e0, 0xd8202a, 0xf2b8d0, 0xfaf6ee]);\n"
     "      flowerStand(2.65, 3.6, -0.3, [['大展鸿图', false, -0.29], ['开张志喜', false, 0.29]], 4857, [0xf2c030, 0xe8642a, 0xf6f0e0, 0xd8202a, 0xf2d870]);\n",
     "      /* (v25.0: the two outside in the corridor were cleared away by the mall weeks ago) */\n"),
    # (v25.1 F1) a dealer's 16 cm display: at 52 cm deep, every line from his eyes through the glass top passed over the
    # tray and out through the front glass, and whatever lay on the glass (his laptop, phone, notebook, the note, the
    # loupe) read as lying on the floor among the customers' stools. The tray's floor raised; the cupboard under it as
    # tall as that leaves (CUP), the glass and its frame standing on it
    ("    const DISPLAY = { floor: 0.52, rows: 5, cols: 28 };",
     "    const DISPLAY = { floor: 0.88, rows: 5, cols: 28 };"),
    # (v25.1 F2) and the cupboard built round the drinks fridge set into its back: one box covered the fridge's opening, so
    # its water, its cans and the wallet the play sends him to find were never seen (the door opened on white)
    ("        bx(W, 0.5, C.d, mGloss, 0, 0.25, C.z);                                           // the white cupboard under it\n",
     "        /* (v25.1 F1, F2) the white cupboard under it, as tall as the display leaves (CUP), built round the drinks fridge\n"
     "           set into its back: either side of it, over it and behind it (one box covered its opening) */\n"
     "        const CUP = DISPLAY.floor - 0.02;\n"
     "        { const FD = 0.45, fx0 = FRIDGE.x0, fx1 = FRIDGE.x1, fh = FRIDGE.h;\n"
     "          bx(fx0 - C.x0, CUP, C.d, mGloss, (C.x0 + fx0) / 2, CUP / 2, C.z);\n"
     "          bx(C.x1 - fx1, CUP, C.d, mGloss, (fx1 + C.x1) / 2, CUP / 2, C.z);\n"
     "          bx(fx1 - fx0, CUP - fh, C.d, mGloss, (fx0 + fx1) / 2, fh + (CUP - fh) / 2, C.z);\n"
     "          bx(fx1 - fx0, fh, C.d - FD, mGloss, (fx0 + fx1) / 2, fh / 2, BZ + FD + (C.d - FD) / 2); }\n"),
    ("        const TY = DISPLAY.floor, TH = top - 0.012 - 0.5;",
     "        const TY = DISPLAY.floor, TH = top - 0.012 - CUP;"),
    ("const gp = pl(w, TH, mGlass, x, 0.5 + TH / 2, z, 0, ry);",
     "const gp = pl(w, TH, mGlass, x, CUP + TH / 2, z, 0, ry);"),
    ("bx(0.02, TH + 0.012, 0.02, mAlu, x, 0.5 + (TH + 0.012) / 2, z);",
     "bx(0.02, TH + 0.012, 0.02, mAlu, x, CUP + (TH + 0.012) / 2, z);"),
    ("bx(W, 0.02, 0.022, mAlu, 0, 0.51, z); }",
     "bx(W, 0.02, 0.022, mAlu, 0, CUP + 0.01, z); }"),
    ("        bx(0.012, TH, 0.012, mAlu, 0, 0.5 + TH / 2, FZ);",
     "        bx(0.012, TH, 0.012, mAlu, 0, CUP + TH / 2, FZ);"),
    # (v25.1 F5) his laptop's two drawings in the shop's hands, so it can be put away for the master's visit (lapAway)
    ("old.userData.dyn = true; S0.add(old);\n",
     "old.userData.dyn = true; S0.add(old); shop.lapOld = old;\n"),
    ("            S0.add(g); old.visible = false;\n",
     "            S0.add(g); old.visible = false; shop.lapG = g;\n"),
    # (v25.1 F9) each dried flower a crumpled head, not a ball: a low sphere pressed flat toward the room, creased by a
    # pattern fixed to each point (its seams stay shut) and lit facet by facet, every head turned its own way (rf, its
    # own stream, so the layout's rr is untouched). Smooth balls read as a heap of brown marbles up close
    ("        const fg = new THREE.SphereGeometry(0.034, 8, 6), ins = fm.map(m2 => new THREE.InstancedMesh(fg, m2, n));\n",
     "        const fg = (() => { const g0 = new THREE.SphereGeometry(0.036, 9, 6), q = g0.attributes.position, v = new THREE.Vector3();\n"
     "          for (let i = 0; i < q.count; i++) { v.fromBufferAttribute(q, i);\n"
     "            const f = 0.76 + 0.24 * Math.abs(Math.sin(v.x * 211 + v.y * 97) * Math.cos(v.y * 151 - v.z * 73)) + 0.08 * Math.abs(Math.cos(Math.atan2(v.y, v.x) * 2.5));\n"
     "            q.setXYZ(i, v.x * f, v.y * f, v.z * f * 0.62); }\n"
     "          const g1 = g0.toNonIndexed(); g1.computeVertexNormals(); g0.dispose(); return g1; })(), ins = fm.map(m2 => new THREE.InstancedMesh(fg, m2, n));\n"),
    ("        const cnt = fm.map(() => 0), mm = new THREE.Matrix4(), rr = rng(seed);\n",
     "        const cnt = fm.map(() => 0), mm = new THREE.Matrix4(), rr = rng(seed), rf = rng(seed + 101), fe = new THREE.Euler();\n"),
    ("          mm.makeTranslation(Math.cos(a) * d, 1.5 + Math.sin(a) * d, 0.04 + (0.34 - d) * 0.18 + rr() * 0.02); ins[ci].setMatrixAt(cnt[ci]++, mm); }\n",
     "          mm.makeRotationFromEuler(fe.set((rf() - 0.5) * 0.9, (rf() - 0.5) * 0.9, rf() * Math.PI * 2)).setPosition(Math.cos(a) * d, 1.5 + Math.sin(a) * d, 0.04 + (0.34 - d) * 0.18 + rr() * 0.02); ins[ci].setMatrixAt(cnt[ci]++, mm); }\n"),
    # (v25.2, Chad: "why are there such badly drawn models ... You already have meshy connected, why are you not using it
    # properly") the counter's phone, the calculator and the dried stand's flowers, each a checked picture on white then
    # Meshy (masters/v25.2/make.sh); the code-built ones stand in until each lands
    ("        shop.phone = { g: ph, scr, base: ph.position.clone(), x: px, drawn: '' };\n",
     "        shop.phone = { g: ph, scr, base: ph.position.clone(), x: px, drawn: '' };\n"
     "        /* (v25.2) the phone itself (turned over at prep, its glass up), the drawn screen laid on its glass; the box stands in\n"
     "           until it lands */\n"
     "        fitModel('e4phone', ph, 0.158, 'z', 0, 0).then(m => { if (!m || !alive) return; body.visible = false; sc.position.y = m.userData.fit.y + 0.0004; });\n"),
    ("        bx(0.09, 0.016, 0.13, M({ color: 0x2a2a2e, roughness: 0.6 }), 0.24, top + 0.008, C.z - 0.12).rotation.y = 0.2;   // the calculator\n",
     "        const calcBox = bx(0.09, 0.016, 0.13, M({ color: 0x2a2a2e, roughness: 0.6 }), 0.24, top + 0.008, C.z - 0.12); calcBox.rotation.y = 0.2;\n"
     "        /* (v25.2) the calculator itself, its display away from him as a calculator lies for its owner; the box stands in\n"
     "           until it lands */\n"
     "        { const cg = new THREE.Group(); cg.position.set(0.24, top, C.z - 0.12); cg.rotation.y = 0.2; S0.add(cg);\n"
     "          fitModel('e4calc', cg, 0.13, 'z', Math.PI, 0).then(m => { if (!m || !alive) return; calcBox.visible = false; }); }\n"),
    ("        ins.forEach((im, i) => { im.count = cnt[i]; g.add(im); });\n",
     "        ins.forEach((im, i) => { im.count = cnt[i]; g.add(im); });\n"
     "        /* (v25.2) the dried stand's flowers a real wreath, its round on the disc (kept as its backing board: the wreath's own\n"
     "           back is open between the flowers), facing as the stand faces, its ribbons brought out over its face; the drawn\n"
     "           heads stand in until it lands */\n"
     "        if (sway) { const wg = new THREE.Group(); wg.position.set(0, 1.5, 0.05); g.add(wg);\n"
     "          fitModel('e4wreath', wg, 0.74, 'x', 0, 0).then(m => { if (!m || !alive) return; for (const im of ins) im.visible = false;\n"
     "            m.position.y -= m.userData.fit.y / 2; for (const rb of props.ribbons) rb.position.z = 0.1; }); }\n"),
]


def main():
    src = open(SRC1, 'rb').read()
    sha = hashlib.sha1(src).hexdigest()
    if sha != E4C1_SHA1:
        sys.exit(f'e4c1.js has changed ({sha}): the COPY line numbers are for {E4C1_SHA1} — re-pin them before assembling')
    lines1 = src.decode('utf-8').split('\n')
    out, copied = [], 0
    for part in PARTS:
        text = open(os.path.join(os.path.dirname(__file__), 'parts', part), encoding='utf-8').read()
        for ln in text.split('\n'):
            m = re.fullmatch(r'//@@COPY (\d+)-(\d+)', ln.strip())
            if m:
                a, b = int(m.group(1)), int(m.group(2))
                if not (1 <= a <= b <= len(lines1)):
                    sys.exit(f'{part}: bad range {a}-{b}')
                out.extend(lines1[a - 1:b]); copied += b - a + 1
            else:
                out.append(ln)
    text = '\n'.join(out)
    if not text.endswith('\n'):
        text += '\n'
    for old, new in EDITS:
        n = text.count(old)
        if n != 1:
            sys.exit(f'edit matched {n} times (wanted 1): {old[:90]!r}')
        text = text.replace(old, new)
    if '//@@COPY' in text:
        sys.exit('a COPY marker was left unexpanded')
    open(OUT, 'w', encoding='utf-8').write(text)
    print(f'e4c2.js: {text.count(chr(10))} lines ({copied} copied from e4c1.js, {len(EDITS)} edits)')


if __name__ == '__main__':
    main()
