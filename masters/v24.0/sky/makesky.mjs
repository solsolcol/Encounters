/* v24.0 CP1 · THE SKY DOME for episode 4 chapter 1 — a generated equirectangular storm sky (ElevenLabs flow
   vKbto5bxSLROMlgkcxNb, node MV5MrMTHNo0IGn4ih5xa, flux-3-image 2:1 4K, generation cQJFyMDxu79FHYYrnBoA of four),
   made into a dome texture:
   1. THE SEAM: the generator's left and right edges do not meet (mean |Δ| 39 against 4 between neighbours), so the
      last N columns are crossfaded over the first N and the image is N narrower: out[x<N] = mix(img[W-N+x], img[x], x/N),
      so out's last column is img[W-N-1] and its first img[W-N] — neighbours in the original — and out[N-1] ≈ img[N-1].
   2. THE POLE: an equirectangular top row is one point; a row whose pixels differ draws a pinwheel there. Each row in
      the top ZEN of the height is pulled toward its own mean by (1 - y/Z)^1.6.
   3. THE CROP: only the sky is kept — from the zenith down to DOWN degrees under the horizon (row HZ is elevation 0) —
      resized to OUTW wide at the same degrees per pixel both ways.
   node makesky.mjs in.png out.jpg   (env OUTW=4096 N=360 DOWN=6 HZ=1455 ZEN=0.18) */
import sharp from 'sharp';
const [,, inp, out] = process.argv;
const OUTW = +(process.env.OUTW || 4096), N = +(process.env.N || 360), DOWN = +(process.env.DOWN || 6);
const HZ = +(process.env.HZ || 1455), ZEN = +(process.env.ZEN || 0.18);
const { data, info } = await sharp(inp).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, C = 3;
const W2 = W - N;
const buf = Buffer.alloc(W2 * H * C);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W2; x++) {
    const o = (y * W2 + x) * C;
    if (x < N) {
      const t = x / N, a = (y * W + (W - N + x)) * C, b = (y * W + x) * C;
      for (let k = 0; k < 3; k++) buf[o + k] = Math.round(data[a + k] * (1 - t) + data[b + k] * t);
    } else { const a = (y * W + x) * C; for (let k = 0; k < 3; k++) buf[o + k] = data[a + k]; }
  }
}
const Z = Math.round(H * ZEN);
for (let y = 0; y < Z; y++) {
  const m = [0, 0, 0];
  for (let x = 0; x < W2; x++) for (let k = 0; k < 3; k++) m[k] += buf[(y * W2 + x) * C + k];
  for (let k = 0; k < 3; k++) m[k] /= W2;
  const w = Math.pow(1 - y / Z, 1.6);
  for (let x = 0; x < W2; x++) for (let k = 0; k < 3; k++) { const i = (y * W2 + x) * C + k; buf[i] = Math.round(buf[i] * (1 - w) + m[k] * w); }
}
const degPerRow = 180 / H;                       // the generator's own rows: 180 degrees over H
const bottom = Math.min(H, Math.round(HZ + DOWN / degPerRow));
const outH = Math.round(bottom * OUTW / W2 * (W2 / W) * 2 * (W / W2) / 2);   // same degrees per pixel both ways
const hNew = Math.round(OUTW / 360 * (bottom * degPerRow));
await sharp(buf, { raw: { width: W2, height: H, channels: 3 } }).extract({ left: 0, top: 0, width: W2, height: bottom })
  .resize(OUTW, hNew).jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: '4:2:0' }).toFile(out);
console.log(`${inp} → ${out}: ${OUTW}x${hNew}, the horizon at row ${Math.round(HZ * hNew / bottom)} (elevation 0), ` +
            `${(bottom * degPerRow).toFixed(2)}° from the zenith down (${DOWN}° under the horizon)`);
