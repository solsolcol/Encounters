    /* ================================================================ THE PEOPLE: chapter 3's machinery, copied whole
       (one skeleton and several skins a person, the takes at weights, the films' poses by the clock, the feet set down by
       their own lowest contact, the head's and the shoulders' restraint, the hands laid by numbers, the levels by the
       lens). Every one of its laws was learned on chapter 3's bodies and holds for these: see its own notes below. The
       one change (assemble.py EDITS): the bodies this chapter made are keyed p4, and the ground under them is the flat's
       (flatGround). */
//@@COPY 2773-4588 :: /* ================================================================ THE PEOPLE (the plan's §3.3, §6.1; the tracker's §5)
    /* A LOOK AS A NECK MAKES IT (R86, R87; Chad, 19 Nov: "neck is too bent", of Amma standing in ending A, and "yellow
       woman's head is too bent and unnatural", of Mala in ending B's floor shot). Two faults, both measured in the code:
       1. A look was laid on the head after the mixer and never taken off. The mixer writes a bone only when its take's
          value changes (the v11.5 law), so on a take run to its end and held (her rise; a kneel held), the head kept the
          last frame's look and the next was laid on top: in a few frames the head swung all the way onto its mark,
          whatever the reach (Amma's chin up into her son's face; Mala's head down onto her mother's). Now each look is
          kept with what it turned (lookSave) and taken off before the next pose is written (lookBack, from armsBack, the
          undo before the mixer), and laid again from the take's own pose.
       2. A look was the shortest turn of the head bone onto its mark, up to 0.9 rad at one joint: a look down and to one
          side is a turn about a slanted axis, which TIPS the head over (Mala's, nearly on its side). Now a look is a turn
          about the chest's own up and a nod over the face's own side axis, never a tip; the turn held within the
          caller's reach and 57 degrees of the chest, the nod within 19 up and 31 down of the chest's level (a real
          neck's comfortable range, inside its full one: flexion and extension about 45 each, rotation about 60 to 80;
          the AAOS's normal values, an elderly neck less); and the neck takes two fifths of it, the head the rest, so the
          bend is spread over the neck as a body's is, not folded at the skull. A reach over 1 rad is a spirit's (the
          one on her back looks at the lens): it keeps the shortest turn. */
    const LOOK_UP = 0.33, LOOK_DOWN = 0.55, LOOK_YAW = 1.0, LOOK_NECK = 0.4;
    const _nlA = new THREE.Vector3(), _nlB = new THREE.Vector3(), _nlU = new THREE.Vector3(), _nlF = new THREE.Vector3(), _nlR = new THREE.Vector3(),
          _nlq = new THREE.Quaternion(), _nlq2 = new THREE.Quaternion(), _nlq3 = new THREE.Quaternion(), _nlq4 = new THREE.Quaternion();
    function neckOf(P) { const p = P.head && P.head.parent; return p && p.isBone && /Neck$/.test(p.name) ? p : null; }
    function lookSave(P) {
      let L = P.lkSave;
      if (!L) { const nb = neckOf(P); L = P.lkSave = { on: false, h: new THREE.Quaternion(), nb, n: new THREE.Quaternion() }; }
      if (L.on) { P.head.quaternion.copy(L.h); if (L.nb) L.nb.quaternion.copy(L.n); }     // (laid again with no pose between: from the same pose)
      else { L.h.copy(P.head.quaternion); if (L.nb) L.n.copy(L.nb.quaternion); L.on = true; }
    }
    function lookBack(P) { const L = P.lkSave; if (!L || !L.on) return; P.head.quaternion.copy(L.h); if (L.nb) L.nb.quaternion.copy(L.n); L.on = false; }
    /* a bone's bind turn, inverted (as headRest): its turn since its bind, applied to +z and +y, is where it faces and its up */
    function boneRest(P, b) {
      if (!b) return null; P.bRest = P.bRest || new Map(); if (P.bRest.has(b)) return P.bRest.get(b);
      let q = null;
      P.group.traverse((o) => { if (q || !o.isSkinnedMesh || !o.skeleton) return; const i = o.skeleton.bones.indexOf(b); if (i < 0) return;
        const m = new THREE.Matrix4().copy(o.skeleton.boneInverses[i]).invert().premultiply(o.bindMatrix);
        q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(m)).invert(); });
      P.bRest.set(b, q); return q;
    }
    /* f: where the face looks now (world), g: where it is asked to (world, unit), s: how far (0..1), hq: the head's world
       turn before this look */
    function natLook(P, f, g, s, reach, hq) {
      const head = P.head, neck = neckOf(P), chest = neck ? neck.parent : head.parent;
      if (reach > 1) {                                       // (a spirit's: the shortest turn, at the head)
        const a = Math.acos(Math.max(-1, Math.min(1, f.dot(g)))); if (a < 1e-3) return;
        _nlq3.setFromUnitVectors(f, g); _nlq2.identity().slerp(_nlq3, s * Math.min(1, reach / a));
        head.parent.getWorldQuaternion(_nlq3); head.quaternion.copy(_nlq3.invert().multiply(_nlq2).multiply(hq)); return;
      }
      const cr = boneRest(P, chest);
      if (cr && chest) { chest.getWorldQuaternion(_nlq); _nlq.multiply(cr); } else P.group.getWorldQuaternion(_nlq);
      _nlF.set(0, 0, 1).applyQuaternion(_nlq); _nlU.set(0, 1, 0).applyQuaternion(_nlq); _nlR.crossVectors(_nlU, _nlF).normalize();
      const yawOf = (v) => Math.atan2(v.dot(_nlR), v.dot(_nlF)), nodOf = (v) => Math.asin(Math.max(-1, Math.min(1, v.dot(_nlU))));
      const fy = yawOf(f), fn = nodOf(f), gy = yawOf(g), gn = nodOf(g), ym = Math.max(LOOK_YAW, reach);
      let dy = Math.atan2(Math.sin(gy - fy), Math.cos(gy - fy)); dy = Math.max(-reach, Math.min(reach, dy));
      dy = Math.max(-ym, Math.min(ym, fy + dy)) - fy;
      let dn = Math.max(-LOOK_DOWN, Math.min(LOOK_UP, gn)) - fn; dn = Math.max(-reach, Math.min(reach, dn));
      dy *= s; dn *= s; if (Math.abs(dy) < 1e-4 && Math.abs(dn) < 1e-4) return;
      _nlq2.setFromAxisAngle(_nlU, dy);                       // the turn, about the chest's up
      _nlA.copy(f).applyQuaternion(_nlq2); _nlB.crossVectors(_nlA, _nlU);
      if (_nlB.lengthSq() < 1e-8) _nlB.copy(_nlR); _nlB.normalize();
      _nlq3.setFromAxisAngle(_nlB, dn).multiply(_nlq2);       // then the nod, about the turned face's side: never a tip
      if (neck && neck.parent) {
        neck.getWorldQuaternion(_nlq4); _nlq.identity().slerp(_nlq3, LOOK_NECK); _nlq4.premultiply(_nlq);   // the neck's share
        neck.parent.getWorldQuaternion(_nlq2); neck.quaternion.copy(_nlq2.invert().multiply(_nlq4));
        _nlq2.copy(_nlq3).multiply(hq); head.quaternion.copy(_nlq4.invert().multiply(_nlq2));          // the head: the whole, less the neck's
      } else {
        _nlq2.copy(_nlq3).multiply(hq); head.parent.getWorldQuaternion(_nlq4); head.quaternion.copy(_nlq4.invert().multiply(_nlq2));
      }
    }
