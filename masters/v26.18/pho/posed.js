(() => { const E = window.__enc, P = E.stage.dbg.cast.pho, FS = window.__fs, V3 = E.camera.position.constructor;
  FS.pose('H_rest', 0.15); P.mixer.update(0); P.group.updateWorldMatrix(true, true); P.group.updateMatrixWorld(true);
  const out = { joints: {}, skins: [] }, v = new V3();
  for (const k in P.bone) { if (/Cloth|Skirt[AMB]/.test(k)) continue; P.bone[k].getWorldPosition(v); P.group.worldToLocal(v); out.joints[k] = [+v.x.toFixed(4), +v.y.toFixed(4), +v.z.toFixed(4)]; }
  for (const s of P.lv[1]) { s.skeleton.update(); const g = s.__g0 || s.geometry, pos = g.attributes.position, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, n = pos.count;
    const bones = s.skeleton.bones, kB = bones.map(b => /^(Skirt|Cloth)/.test(b.name) ? 1 : (/(UpLeg|Leg|Foot|Toe)/.test(b.name) ? 2 : (/Hips$/.test(b.name) ? 3 : (/Spine/.test(b.name) ? 4 : 0))));
    const bind = new Array(n * 3), posed = new Array(n * 3), w = new Array(n * 5);
    for (let i = 0; i < n; i++) { v.fromBufferAttribute(pos, i).applyMatrix4(s.bindMatrix); bind[i * 3] = +v.x.toFixed(4); bind[i * 3 + 1] = +v.y.toFixed(4); bind[i * 3 + 2] = +v.z.toFixed(4);
      s.getVertexPosition(i, v); v.applyMatrix4(s.matrixWorld); P.group.worldToLocal(v); posed[i * 3] = +v.x.toFixed(4); posed[i * 3 + 1] = +v.y.toFixed(4); posed[i * 3 + 2] = +v.z.toFixed(4);
      const ww = [0, 0, 0, 0, 0]; for (let c = 0; c < 4; c++) ww[kB[si.getComponent(i, c)]] += sw.getComponent(i, c); for (let c = 0; c < 5; c++) w[i * 5 + c] = +ww[c].toFixed(3); }
    out.skins.push({ mat: s.material.name, n, bind, posed, w, index: Array.from(g.index.array), bindMatrix: s.bindMatrix.elements.map(x => +x.toFixed(5)) }); }
  return out; })()
