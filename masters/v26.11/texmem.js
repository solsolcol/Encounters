(() => {
  const seen = new Set(), rows = {}; let total = 0, n = 0;
  const add = (t, where) => {
    if (!t || !t.isTexture || seen.has(t)) return; seen.add(t);
    const im = t.image || (t.source && t.source.data); if (!im) return;
    const kind = im.constructor ? im.constructor.name : typeof im, w = im.width || 0, h = im.height || 0;
    const bytes = (im.data && im.data.byteLength) ? im.data.byteLength : w * h * 4;
    const k = kind + (t.isCompressedTexture ? ' compressed' : '') + (bytes >= 16e6 ? ' (16 MB or more)' : bytes >= 4e6 ? ' (4-16 MB)' : ' (under 4 MB)');
    rows[k] = rows[k] || { n: 0, mb: 0 }; rows[k].n++; rows[k].mb += bytes / 1048576; total += bytes; n++;
  };
  const walk = (root) => root.traverse(o => { for (const m of [].concat(o.material || [])) if (m) for (const key in m) { const v = m[key]; if (v && v.isTexture) add(v); } });
  walk(E.scene);
  for (const k in rows) rows[k].mb = +rows[k].mb.toFixed(1);
  return JSON.stringify({ textures: n, decodedMB: +(total / 1048576).toFixed(1), rows, gpuTextures: E.renderer.info.memory.textures });
})()
