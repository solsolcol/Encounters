/* v24.39 · ROBE SKIN — a robed scan's cloth re-bound to the bones the way cloth hangs, before tools/prepmonk.mjs.
   Chad, 3 Nov 2026, of Grandmaster Pho's model: "many animations make his body distorted and wrong. I need you to find a
   way to fix all of it." Measured on his file (a Meshy scan, auto-rigged on 28 Mixamo joints): of the robe's 293,756
   vertices, 93,674 were bound mainly to his LEFT thigh against 36,865 to the right, 59,255 to his left arm, and almost
   none to the spine (Spine2: 8). So the robe split into trouser legs when he walked, crumpled into spikes when he sat
   cross-legged, and the drape over his left shoulder flew out like a wing whenever that arm moved.

   Chad, the same day: "The biggest problems are with his torso and back that distorts to very thin. You need to look at
   more angles" — photographed from seven angles (tools/clipsheet.mjs --frame=torso): raising his arms dragged his chest
   and back up with them, the back caving in and the trunk flattening, because the TRUNK (his bare chest and back, the
   necklace, and the robe over them) was bound to his arms, not his spine. So the trunk is re-bound too.

   WHAT IT DOES — his face, neck, arms, hands, feet and the skin of his legs keep their weights; the CLOTH everywhere and
   the TRUNK's skin and necklace (between the waist and the base of the neck, and off the arms) are re-bound:
   1. CLASSES. Each vertex is read from the base colour at its UV: cloth is a pale neutral (saturation < SAT, value >
      VAL), below the neck (y < NECKY) and away from the head; everything else (skin, the necklace) keeps its weights.
      A vertex whose neighbours mostly disagree takes their class (one pass), so a stray texel cannot flip one point.
   2. AN ENVELOPE for every cloth vertex: for each allowed bone, a weight from the distance d to the bone's SEGMENT (its
      joint to its child's, in the bind pose): w = exp(-(max(0, d - r) / s)^2), the bone's core radius r and falloff s
      from its class — the trunk wide and soft (the robe hangs from the body), the arms tight (only the cloth that wraps
      an arm follows it), the legs between. Hands, feet, toes and the head are never allowed: cloth does not follow
      a foot. Cloth below the waist may follow only the hips and the legs; the drape above it, the trunk and the arms.
      Between the legs the two thighs are near equal, so the robe stays one robe and does not split.
   3. A SEAM-FREE MIX: cloth within RING rings (edge hops) of skin blends from its own original weights at the boundary
      to the envelope inside, so the hem, the neckline and the sleeves' edges do not tear from the skin they meet.
   4. ROBE DIFFUSION: RPASS passes of neighbour averaging inside the cloth only, so no fold can step.
   Every copy of a position (the UV seams) shares one set of weights, so no seam can open; four strongest kept,
   renormalised. TAKELIFT="Take:metres,..." lifts a take's hips (a floor sit the take plants through the floor).
     node tools/robeskin.mjs in.glb out.glb [previewOut.glb]   (the preview paints cloth by its main bone) */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import sharp from 'sharp';
import { Matrix4, Quaternion, Vector3 } from 'three';
import { makePoser } from './gltfpose.mjs';
const [,, IN, OUT, PREVIEW] = process.argv;
const E = (k, d) => (process.env[k] !== undefined ? Number(process.env[k]) : d);
const SAT = E('SAT', 0.16), VAL = E('VAL', 150), NECKY = E('NECKY', 1.43), RING = E('RING', 6), RPASS = E('RPASS', 40);
const SKINTOP = E('SKINTOP', 1.37), SKINARM = E('SKINARM', 0.06);
/* FRONTSHIN: cloth IN FRONT of a shin follows the thigh instead (by this share), so a lap does not fold back under
   crossed shins and open the robe's inside to the eye; 0 leaves the shins' pull as the envelope gives it */
const FRONTSHIN = E('FRONTSHIN', 0);   // the trunk's skin: under the neck's base, and this far off an arm
/* v24.40 — Chad: "I think pho model still needs alot more fixing and you are not looking at the right angles for the big
   issues". Measured over every frame (tools/rigstrain.mjs) and photographed from ten angles: weights alone cannot make a
   robe — his legs pulled the skirt into trousers walking and running, a seated pelvis tilting back threw the cloth of
   his lower back out into a hump, and a floor sit split the lap. Two options, both off unless set:
   BANDS=1 — the spine's share of every re-bound point is dealt among Hips, Spine, Spine1 and Spine2 by its HEIGHT (his
     auto-rig put the spine's joints in his belly, 13 cm in front of his back, so by distance his whole lower back went to
     the pelvis); the cuts at the Spine joint less BANDHS, at Spine1 and at Spine2, each blended over ±BANDW.
   SKIRT=n — the robe below ROOTY gets n chains of two bones round it (children of the hips: the waist to the knees, the
     knees to the hem), placed on the robe's own surface, and every take gets the chains' turn BAKED in: each upper bone
     follows a blend of the two thighs and the pelvis by its angle round him (the front both thighs, the sides their own,
     the back half the pelvis), each lower bone the shins and gravity (the more the upper bone is lifted, the more it
     hangs), neither inside a leg (no nearer than it stood at rest) nor through the floor (y = FLOOR, after TAKELIFT). The
     robe's points take the two chains either side of them by angle and the upper or lower bones by height; above ROOTY
     the trunk's weights; near the shins' skin, the shins'. So the robe is one robe that the legs move, never trousers. */
const BANDS = E('BANDS', 0), SKIRT = E('SKIRT', 0), ROOTY = E('ROOTY', 0.93), FLOOR = E('FLOOR', 0);
/* SKIRTB=3 (v24.41): three bones a chain — the waist to the MID ring (YMD below the roots), the mid ring to the knees, the
   knees to the hem — so a seated lap can bend down at the knee: the lap from the belly to the knee top is ~0.32 m of
   cloth, the standing waist-to-knee ~0.43, so with two bones the bend fell on the shin and every chair sit was a slide */
const SKIRTB = E('SKIRTB', 2), YMD = E('YMD', 0.30);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(IN);
const root = doc.getRoot(), skin = root.listSkins()[0], joints = skin.listJoints();
const name = j => j.getName().replace('mixamorig:', '');
const JN = joints.map(name), JI = Object.fromEntries(JN.map((n, i) => [n, i]));
/* the joints' bind positions, from the inverse bind matrices */
const ibm = skin.getInverseBindMatrices().getArray();
const invPos = k => { const a = Array.from(ibm.slice(k * 16, k * 16 + 16));
  const c00 = a[5] * a[10] - a[9] * a[6], c01 = -(a[4] * a[10] - a[8] * a[6]), c02 = a[4] * a[9] - a[8] * a[5];
  const c10 = -(a[1] * a[10] - a[9] * a[2]), c11 = a[0] * a[10] - a[8] * a[2], c12 = -(a[0] * a[9] - a[8] * a[1]);
  const c20 = a[1] * a[6] - a[5] * a[2], c21 = -(a[0] * a[6] - a[4] * a[2]), c22 = a[0] * a[5] - a[4] * a[1];
  const det = a[0] * c00 + a[4] * c10 + a[8] * c20, id = 1 / det;
  const r = [c00 * id, c01 * id, c02 * id, c10 * id, c11 * id, c12 * id, c20 * id, c21 * id, c22 * id];
  return [-(r[0] * a[12] + r[1] * a[13] + r[2] * a[14]), -(r[3] * a[12] + r[4] * a[13] + r[5] * a[14]), -(r[6] * a[12] + r[7] * a[13] + r[8] * a[14])]; };
const JP = joints.map((_, k) => invPos(k));
/* the segments cloth may follow: [bone, child, core radius r, falloff s, region] (region: 'low' below the waist, 'up' above) */
const SEG = [
  ['Hips', 'Spine', E('TRUNKR', 0.13), E('TRUNKS', 0.10), 'both'], ['Spine', 'Spine1', E('TRUNKR', 0.13), E('TRUNKS', 0.10), 'up'],
  ['Spine1', 'Spine2', E('TRUNKR', 0.13), E('TRUNKS', 0.10), 'up'], ['Spine2', 'Neck', E('TRUNKR', 0.13) - 0.01, E('TRUNKS', 0.10) - 0.02, 'up'],
  ['LeftShoulder', 'LeftArm', 0.07, 0.05, 'up'], ['RightShoulder', 'RightArm', 0.07, 0.05, 'up'],
  ['LeftArm', 'LeftForeArm', E('ARMR', 0.05), E('ARMS', 0.025), 'up'], ['RightArm', 'RightForeArm', E('ARMR', 0.05), E('ARMS', 0.025), 'up'],
  ['LeftForeArm', 'LeftHand', 0.045, 0.025, 'up'], ['RightForeArm', 'RightHand', 0.045, 0.025, 'up'],
  ['LeftUpLeg', 'LeftLeg', E('THIGHR', 0.09), E('THIGHS', 0.12), 'low'], ['RightUpLeg', 'RightLeg', E('THIGHR', 0.09), E('THIGHS', 0.12), 'low'],
  ['LeftLeg', 'LeftFoot', E('SHINR', 0.06), E('SHINS', 0.10), 'low'], ['RightLeg', 'RightFoot', E('SHINR', 0.06), E('SHINS', 0.10), 'low']
].filter(s => JI[s[0]] !== undefined && JI[s[1]] !== undefined);
const WAIST = JP[JI.Hips][1] + E('WAISTUP', 0.04);          // the waist: a little above the hips' joint
const SPINEJ = ['Hips', 'Spine', 'Spine1', 'Spine2'].map(n => JI[n]);
const sstep = x => { const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t); };
const bandW = y => { const BW = E('BANDW', 0.05), cuts = [JP[JI.Spine][1] - E('BANDHS', 0.04), JP[JI.Spine1][1], JP[JI.Spine2][1]];
  const s = cuts.map(c => sstep((y - (c - BW)) / (2 * BW))); return [1 - s[0], s[0] - s[1], s[1] - s[2], s[2]]; };
/* v24.43 · THE DRAPE ON HIS LEFT ARM. His file bound the cloth round his left upper arm to the arm (92–95 % of it, 8–13 cm
   from the arm's axis), so it flew out as a wing when the arm lifted; v24.39's envelope (ARMR 0.05, ARMS 0.025) left it
   5–28 %, and he is rigged with his arms 31° out from his sides, so whenever the arm came down the cloth stayed out where
   the arm had been: a stiff shelf at the elbow, the forearm passing into it (the v24.42 review, walking and talking).
   A wider left-arm envelope was tried first and measured (tools/rigstrain.mjs): the diffusion carried the arm into his
   upper back, which caved again (Talk_with_Hands_Open's back to 0.40 of its depth; 7 % of the trunk in a cast), so the
   envelope stays as it was. LDRAPE=k instead hands back, AFTER the diffusion, his file's own weights to the cloth that is
   nearer his left UPPER ARM than his spine and within 14 cm of it (the measure's own test of an arm's point, so no point
   the trunk measure reads is touched), by share k, faded in from the shoulder joint (LDRAPET0 to LDRAPET0 + LDRAPETW of
   the arm's length) and across the arm/spine boundary (LDRAPEB metres); unset, nothing changes */
const LDRAPE = E('LDRAPE', 0), LDRAPET0 = E('LDRAPET0', 0.2), LDRAPETW = E('LDRAPETW', 0.2), LDRAPEB = E('LDRAPEB', 0.03);
/* Tried and taken back out (masters/v24.43/PLAN.md): the forearm's cloth too (it changed nothing: that cloth lies within
   14 cm of the upper arm's elbow end already), and a reach of 22 cm instead of 14 (the loose drape 13–22 cm off the arm
   followed it into his torso when the arm swung: the talking take's back to 0.19 of its depth, 5.5 % of the trunk) */
/* v24.45 · DRAPE=1 — THE SLEEVE BONE. Chad, 4 Nov 2026: "Go ahead with the hanging-cloth rig for the drape". Measured
   (masters/v24.45/PLAN.md): the shawl over his left shoulder is one sheet — a sleeve on the upper arm, a band behind it, a
   panel on his shoulder blade, a web to the waist tucked under the belt — and the band ballooned into a shell behind the
   arm in every moving take because his upper arm is TWISTED about its own axis by 30–50° in most takes (walking 46° at
   every frame): the twist carried the cloth near the arm 8–14 cm round it while the blade and the web stayed on his back.
   Cloth follows a limb's SWING, never its twist (the robe's legs, v24.41). So a bone of its own, DrapeArm: a child of his
   left shoulder at the arm's joint (whose offset there is constant in every take), turned at each of the arm's keys by
   the arm's swing alone — the turn that takes the arm's rest direction, carried by the shoulder, to where the arm points
   now. The re-bound points' share of the upper arm (the sleeve, the band, the cloth over the shoulder top) follows it
   instead, moved over ring by ring from the arm's skin (RING) so the hem still grips the arm. Unset, nothing changes */
const DRAPE = E('DRAPE', 0);
/* DRAPE=2 adds THE BAND: posed slices of v24.44 (walking 0.8 s) show the shell is the band behind the arm SMEARED across
   the gap between the arm and his back — each of its points a different share of the two, so when the arm moves they
   spread out along it (his own file kept the band packed on the sleeve). So the shawl's cloth round his left shoulder
   rides the sleeve bone as one piece wherever it stands OFF his body, and hands over to the trunk's own weights only
   where it lies ON him: by its height above the body's own surface there (the inner surface of all the points round
   the torso's axis at that angle and height, measured in 10° and 2 cm bins), from BANDO0 to BANDO0 + BANDOW, and never
   farther than BANDR from the upper arm's axis; smoothed over the mesh (BANDPASS passes), and moved over ring by ring
   from skin as above */
const BANDO0 = E('BANDO0', 0.03), BANDOW = E('BANDOW', 0.04), BANDR = E('BANDR', 0.30), BANDPASS = E('BANDPASS', 10), BANDSIG = E('BANDSIG', 0);
/* DRAPEMERGE=1: a drape point keeps four bones, like every point, but the share of each bone it loses goes to the kept
   bone nearest it (at rest), not spread over all four: the sleeve bone and the arm, or two spine joints, move nearly as
   one, so the point moves nearly as it would with all of them — where the cut fell differently on two neighbours, they
   moved apart */
const DRAPEMERGE = E('DRAPEMERGE', 0);
/* DRAPEREACH / BANDSPINE: how far the sleeve bone may reach. Only the cloth within DRAPEREACH metres of the upper arm's
   axis (faded over DRAPEREACHW) and nearer the arm than the spine (by BANDSPINE, faded) may follow it — the sleeve's
   own share of the arm and the band's share alike — and every other point keeps exactly the weights it had. Without it
   (p21) the band's smoothing reached his upper back by the spine, 24 cm from the arm: with the arm raised, the robe's
   top edge there was dragged 8–11 cm and the bare skin beside it stretched */
const DRAPEREACH = E('DRAPEREACH', 0), DRAPEREACHW = E('DRAPEREACHW', 0.08), BANDSPINE = E('BANDSPINE', 0);
/* DRAPEHANG=g (0..1) — THE BAND HANGS. The sleeve bone carries the band by the arm's swing, so an arm raised forward
   lifted the cloth that hangs behind it onto its top, and the band's lower part was stretched in streaks from the arm to
   his hip (Charged_Spell_Cast_1 1.8 s, the scan's fold crevices opening brown). Real cloth hanging from an arm swings
   round it to hang below it. So the band rides a bone of its own, DrapeHang: the sleeve bone's turn, then a turn about
   the arm's own axis (as it points now) that brings the band's side of the arm back toward the side gravity hangs it
   at rest (its rest angle to "down" round the arm kept, so rest is rest), by share g, at most HANGMAX degrees, and only
   as far as the arm is off vertical (a near-vertical arm has no "below": the sine of its angle off vertical from HANGL0,
   faded in over HANGLW). The sleeve itself stays on DrapeArm */
const DRAPEHANG = E('DRAPEHANG', 0), HANGMAX = E('HANGMAX', 60), HANGL0 = E('HANGL0', 0.05), HANGLW = E('HANGLW', 0.10);
const segT = (p, a, b) => { const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], ap = [p[0] - a[0], p[1] - a[1], p[2] - a[2]];
  const L2 = ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2; return Math.max(0, Math.min(1, (ap[0] * ab[0] + ap[1] * ab[1] + ap[2] * ab[2]) / L2)); };
const segD = (p, a, b) => { const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], ap = [p[0] - a[0], p[1] - a[1], p[2] - a[2]];
  const L2 = ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2, t = Math.max(0, Math.min(1, (ap[0] * ab[0] + ap[1] * ab[1] + ap[2] * ab[2]) / L2));
  return Math.hypot(ap[0] - t * ab[0], ap[1] - t * ab[1], ap[2] - t * ab[2]); };

let CH = null;                                              // v24.40: the skirt's chains (SKIRT)
let DR = null;                                              // v24.45: the sleeve bone (DRAPE)
const NJ0 = joints.length;
for (const mesh of root.listMeshes()) for (const prim of mesh.listPrimitives()) {
  const P = prim.getAttribute('POSITION'), UV = prim.getAttribute('TEXCOORD_0'), J = prim.getAttribute('JOINTS_0'), W = prim.getAttribute('WEIGHTS_0');
  if (!J || !W) continue;
  const img = prim.getMaterial().getBaseColorTexture().getImage();
  const { data, info } = await sharp(Buffer.from(img), { limitInputPixels: false }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const n = P.getCount(), v = [0, 0, 0], uv = [0, 0], jj = [0, 0, 0, 0], ww = [0, 0, 0, 0];
  /* positions grouped (the UV seams' copies share one), and the neighbours per group */
  const pos = new Float64Array(n * 3), gid = new Int32Array(n), gmap = new Map(); let G = 0;
  for (let i = 0; i < n; i++) { P.getElement(i, v); pos.set(v, 3 * i); const k = `${Math.round(v[0] * 1e5)},${Math.round(v[1] * 1e5)},${Math.round(v[2] * 1e5)}`;
    let g = gmap.get(k); if (g === undefined) { g = G++; gmap.set(k, g); } gid[i] = g; }
  const I = prim.getIndices().getArray(), deg = new Uint32Array(G + 1), pairs = [];
  for (let t = 0; t < I.length; t += 3) for (let k = 0; k < 3; k++) { const a = gid[I[t + k]], b = gid[I[t + (k + 1) % 3]]; if (a !== b) { pairs.push(a, b); deg[a + 1]++; deg[b + 1]++; } }
  for (let g = 0; g < G; g++) deg[g + 1] += deg[g];
  const adj = new Uint32Array(deg[G]), fill = deg.slice(0, G);
  for (let e = 0; e < pairs.length; e += 2) { const a = pairs[e], b = pairs[e + 1]; adj[fill[a]++] = b; adj[fill[b]++] = a; }
  /* 1 · classes by colour, per group (any copy that reads as cloth votes cloth) */
  const gp = new Float64Array(G * 3), cloth = new Uint8Array(G), seen = new Uint8Array(G);
  const head = JP[JI.Head];
  for (let i = 0; i < n; i++) {
    const g = gid[i]; UV.getElement(i, uv);
    if (!seen[g]) { seen[g] = 1; gp[3 * g] = pos[3 * i]; gp[3 * g + 1] = pos[3 * i + 1]; gp[3 * g + 2] = pos[3 * i + 2]; }
    const x = Math.min(info.width - 1, Math.max(0, Math.floor(uv[0] * info.width))), y = Math.min(info.height - 1, Math.max(0, Math.floor(uv[1] * info.height)));
    const o = (y * info.width + x) * 3, r = data[o], gg = data[o + 1], b = data[o + 2], val = Math.max(r, gg, b), sat = val ? (val - Math.min(r, gg, b)) / val : 0;
    const p = [pos[3 * i], pos[3 * i + 1], pos[3 * i + 2]];
    if (sat < SAT && val > VAL && p[1] < NECKY && Math.hypot(p[0] - head[0], p[1] - head[1], p[2] - head[2]) > 0.13) cloth[g] = 1;
  }
  { const c2 = cloth.slice(); for (let g = 0; g < G; g++) { let k = 0, m = deg[g + 1] - deg[g]; for (let e = deg[g]; e < deg[g + 1]; e++) k += cloth[adj[e]];
      if (m >= 3) { if (cloth[g] && k * 4 < m) c2[g] = 0; else if (!cloth[g] && k * 4 > 3 * m) c2[g] = 1; } } cloth.set(c2); }
  /* v24.40 · THE SKIRT'S POINTS: the cloth below the chains' roots, within 0.42 m of the legs' axis and off the hands and
     forearms — and every patch inside it that the colour test called skin (a fold's shadow) but that no skin outside it
     reaches (the feet and ankles, the trunk, the hands), which is cloth */
  const cx = SKIRT ? 0.5 * (JP[JI.LeftUpLeg][0] + JP[JI.RightUpLeg][0]) : 0, cz = SKIRT ? 0.5 * (JP[JI.LeftUpLeg][2] + JP[JI.RightUpLeg][2]) : 0;
  const skirtG = new Uint8Array(G);
  if (SKIRT) {
    const handSegs = [['LeftForeArm', 'LeftHand'], ['LeftHand', 'LeftHandMiddle4'], ['RightForeArm', 'RightHand'], ['RightHand', 'RightHandMiddle4']].filter(([a, b]) => JI[a] !== undefined && JI[b] !== undefined);
    const inR = new Uint8Array(G);
    for (let g = 0; g < G; g++) { const p = [gp[3 * g], gp[3 * g + 1], gp[3 * g + 2]];
      if (p[1] > ROOTY + 0.06 || Math.hypot(p[0] - cx, p[2] - cz) > 0.42) continue;
      if (handSegs.some(([a, b]) => segD(p, JP[JI[a]], JP[JI[b]]) < 0.08)) continue; inR[g] = 1; }
    const reach = new Uint8Array(G), qq = [];
    for (let g = 0; g < G; g++) if (!cloth[g] && (!inR[g] || gp[3 * g + 1] < 0.15)) { reach[g] = 1; qq.push(g); }
    for (let h = 0; h < qq.length; h++) { const g = qq[h]; for (let e = deg[g]; e < deg[g + 1]; e++) { const b = adj[e]; if (!reach[b] && !cloth[b]) { reach[b] = 1; qq.push(b); } } }
    let isl = 0; for (let g = 0; g < G; g++) if (inR[g] && !cloth[g] && !reach[g]) { cloth[g] = 1; isl++; }
    for (let g = 0; g < G; g++) if (inR[g] && cloth[g]) skirtG[g] = 1;
    /* the chains, measured on the robe: its radius at ROOTY and at the knees' height (80th percentile in each of n bins
       round the legs' axis) and its hem (the bin's lowest 2 %) */
    const N = SKIRT, D = 2 * Math.PI / N, YK = 0.5 * (JP[JI.LeftLeg][1] + JP[JI.RightLeg][1]), YM = ROOTY - YMD;
    const ang = (x, z) => { const a = Math.atan2(x - cx, z - cz); return a < 0 ? a + 2 * Math.PI : a; };
    const pct = (a, f) => { if (!a.length) return NaN; a.sort((x, y) => x - y); return a[Math.min(a.length - 1, Math.floor(f * (a.length - 1)))]; };
    CH = [];
    for (let k = 0; k < N; k++) {
      const th = k * D, rR = [], rK = [], ys = [], rM = [];
      for (let g = 0; g < G; g++) { if (!skirtG[g]) continue; const x = gp[3 * g], y = gp[3 * g + 1], z = gp[3 * g + 2];
        let da = Math.abs(ang(x, z) - th); da = Math.min(da, 2 * Math.PI - da); if (da > D / 2) continue;
        const r = Math.hypot(x - cx, z - cz); if (Math.abs(y - ROOTY) < 0.03) rR.push(r); if (Math.abs(y - YK) < 0.03) rK.push(r); ys.push([y, r]);
        if (SKIRTB === 3 && Math.abs(y - YM) < 0.03) rM.push(r); }
      const yH = Math.min(pct(ys.map(q => q[0]), 0.02), YK - 0.12);
      CH.push({ th, rR: pct(rR, 0.8), rK: pct(rK, 0.8), yH, rH: pct(ys.filter(q => q[0] < yH + 0.04).map(q => q[1]), 0.8) });
      if (SKIRTB === 3) CH[k].rM = pct(rM, 0.8);
    }
    for (const key of SKIRTB === 3 ? ['rR', 'rK', 'rH', 'yH', 'rM'] : ['rR', 'rK', 'rH', 'yH']) CH.forEach((c, k) => { if (!(c[key] > 0)) { const a = CH[(k + N - 1) % N][key], b = CH[(k + 1) % N][key]; c[key] = (a > 0 && b > 0) ? (a + b) / 2 : (a > 0 ? a : b); } });
    const pt = (c, r, y) => [cx + r * Math.sin(c.th), y, cz + r * Math.cos(c.th)];
    CH.forEach(c => { c.R = pt(c, c.rR, ROOTY); c.K = pt(c, c.rK, YK); c.H = pt(c, c.rH, c.yH); if (SKIRTB === 3) c.Mid = pt(c, c.rM, YM); });
    /* the bones: SkirtA (the waist to the knees) a child of the hips, SkirtB (the knees to the hem) a child of it, each
       turned at rest to the world's own frame (so a bake turns it from rest, and rest bakes to no turn at all) */
    const poser = makePoser(root); poser.pose(null, 0);
    const hipsN = joints[JI.Hips], MH0 = poser.world[poser.NI.get(hipsN)].clone(), MH0i = MH0.clone().invert(), qH0 = new Quaternion();
    MH0.decompose(new Vector3(), qH0, new Vector3());
    const ib = Array.from(ibm), Pw = JP[JI.Hips];
    /* SkirtWaist, at the hips' joint: turned half way between the pelvis and the spine (WAISTBLEND). His seated takes
       tip the pelvis back by up to 59° while the spine leans forward (the floor sit: Hips +59°, Spine -15°), so cloth
       carried by the pelvis itself was thrown out behind him in a hump and up into his belly in front; the robe's waist
       and the chains' roots ride this bone instead */
    CH.waist = doc.createNode('SkirtWaist').setTranslation([0, 0, 0]).setRotation(qH0.clone().invert().toArray());
    hipsN.addChild(CH.waist); skin.addJoint(CH.waist); JN.push('SkirtWaist'); CH.jw = NJ0;
    ib.push(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -Pw[0], -Pw[1], -Pw[2], 1);
    if (SKIRTB === 3) CH.forEach((c, k) => {
      const nm = String(k).padStart(2, '0');
      c.A = doc.createNode(`SkirtA${nm}`).setTranslation([c.R[0] - Pw[0], c.R[1] - Pw[1], c.R[2] - Pw[2]]);
      c.Mn = doc.createNode(`SkirtM${nm}`).setTranslation([c.Mid[0] - c.R[0], c.Mid[1] - c.R[1], c.Mid[2] - c.R[2]]);
      c.B = doc.createNode(`SkirtB${nm}`).setTranslation([c.K[0] - c.Mid[0], c.K[1] - c.Mid[1], c.K[2] - c.Mid[2]]);
      CH.waist.addChild(c.A); c.A.addChild(c.Mn); c.Mn.addChild(c.B); skin.addJoint(c.A); skin.addJoint(c.Mn); skin.addJoint(c.B); JN.push(`SkirtA${nm}`, `SkirtM${nm}`, `SkirtB${nm}`);
      ib.push(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -c.R[0], -c.R[1], -c.R[2], 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -c.Mid[0], -c.Mid[1], -c.Mid[2], 1,
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -c.K[0], -c.K[1], -c.K[2], 1);
      c.ja = NJ0 + 1 + 3 * k; c.jm = NJ0 + 2 + 3 * k; c.jb = NJ0 + 3 + 3 * k;
    });
    else CH.forEach((c, k) => {
      const nm = String(k).padStart(2, '0');
      c.A = doc.createNode(`SkirtA${nm}`).setTranslation([c.R[0] - Pw[0], c.R[1] - Pw[1], c.R[2] - Pw[2]]);
      c.B = doc.createNode(`SkirtB${nm}`).setTranslation([c.K[0] - c.R[0], c.K[1] - c.R[1], c.K[2] - c.R[2]]);
      CH.waist.addChild(c.A); c.A.addChild(c.B); skin.addJoint(c.A); skin.addJoint(c.B); JN.push(`SkirtA${nm}`, `SkirtB${nm}`);
      ib.push(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -c.R[0], -c.R[1], -c.R[2], 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -c.K[0], -c.K[1], -c.K[2], 1);
      c.ja = NJ0 + 1 + 2 * k; c.jb = NJ0 + 2 + 2 * k;
    });
    skin.getInverseBindMatrices().setArray(new Float32Array(ib));
    Object.assign(CH, { YK, cx, cz, YM });
    console.log(`  skirt: ${skirtG.reduce((a, b) => a + b, 0)} positions below ${ROOTY} m (${isl} of them the colour test called skin, inside it); ${N} chains (angle: root r, knee r, hem y / r):`);
    console.log('   ', CH.map(c => `${Math.round(c.th * 180 / Math.PI)}° ${c.rR.toFixed(2)} ${c.rK.toFixed(2)} ${c.yH.toFixed(2)}/${c.rH.toFixed(2)}`).join(' | '));
  }
  /* v24.45 · DRAPE: the sleeve bone, a child of his left shoulder at the arm's joint, turned at rest to the world's own
     frame (so a bake turns it from rest, and rest bakes to no turn at all) */
  if (DRAPE && !DR && JI.LeftShoulder !== undefined && JI.LeftArm !== undefined && JI.LeftForeArm !== undefined) {
    const poserD = makePoser(root); poserD.pose(null, 0);
    const lsN = joints[JI.LeftShoulder], laN = joints[JI.LeftArm], qLS0 = new Quaternion();
    poserD.world[poserD.NI.get(lsN)].decompose(new Vector3(), qLS0, new Vector3());
    const dnode = doc.createNode('DrapeArm').setTranslation(laN.getTranslation()).setRotation(qLS0.clone().invert().toArray());
    lsN.addChild(dnode); const dj = skin.listJoints().length; skin.addJoint(dnode); JN.push('DrapeArm');
    const pa = JP[JI.LeftArm], ibD = Array.from(skin.getInverseBindMatrices().getArray());
    ibD.push(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -pa[0], -pa[1], -pa[2], 1);
    skin.getInverseBindMatrices().setArray(new Float32Array(ibD));
    DR = { node: dnode, j: dj };
    console.log(`  drape: the sleeve bone DrapeArm (joint ${dj}) at his left arm's joint, a child of his left shoulder`);
    /* DRAPEHANG: the band's own bone, made the same way (rest is the world's own frame) */
    if (DRAPEHANG > 0 && DRAPE >= 2) {
      const hnode = doc.createNode('DrapeHang').setTranslation(laN.getTranslation()).setRotation(qLS0.clone().invert().toArray());
      lsN.addChild(hnode); const hj = skin.listJoints().length; skin.addJoint(hnode); JN.push('DrapeHang');
      const ibH = Array.from(skin.getInverseBindMatrices().getArray()); ibH.push(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -pa[0], -pa[1], -pa[2], 1);
      skin.getInverseBindMatrices().setArray(new Float32Array(ibH));
      Object.assign(DR, { hnode, jh: hj });
      console.log(`  drape: the band's bone DrapeHang (joint ${hj}), beside it`);
    }
  }
  /* the drape's REACH (see DRAPEREACH above), per group: the cloth near the arm and nearer it than the spine */
  let drReach = null;
  if (DR && (DRAPEREACH > 0 || BANDSPINE > 0)) {
    const LA = JP[JI.LeftArm], LF = JP[JI.LeftForeArm], SPN = ['Hips', 'Spine', 'Spine1', 'Spine2', 'Neck', 'Head'].filter(n => JI[n] !== undefined).map(n => JP[JI[n]]);
    drReach = new Float32Array(G); let nr = 0;
    for (let g = 0; g < G; g++) { if (!cloth[g] || skirtG[g]) continue; const p = [gp[3 * g], gp[3 * g + 1], gp[3 * g + 2]]; if (p[1] <= WAIST) continue;
      const dA = segD(p, LA, LF); let dS = 9; for (let k = 0; k + 1 < SPN.length; k++) dS = Math.min(dS, segD(p, SPN[k], SPN[k + 1]));
      drReach[g] = (DRAPEREACH > 0 ? sstep((DRAPEREACH - dA) / DRAPEREACHW) : 1) * (BANDSPINE > 0 ? sstep((dS - dA) / BANDSPINE) : 1); if (drReach[g] > 0) nr++; }
    console.log(`  drape reach: ${nr} cloth positions may follow the sleeve bone (within ${DRAPEREACH || '-'} m of the arm, nearer it than the spine by ${BANDSPINE || '-'} m); every other point keeps v24.44's weights`);
  }
  /* DRAPE=2 · THE BAND's share of the sleeve bone, per group (see BANDO0 above) */
  let bandF = null;
  if (DR && DRAPE >= 2) {
    const LA = JP[JI.LeftArm], LF = JP[JI.LeftForeArm], RA = JP[JI.RightArm], RF = JP[JI.RightForeArm], LH = JP[JI.LeftHand], RH = JP[JI.RightHand];
    const Y0 = WAIST, Y1 = LA[1] + 0.10, NB = Math.ceil((Y1 - Y0) / 0.02);
    /* the torso's vertical axis: the middle of the trunk's points at chest heights, off both arms */
    let sx = 0, nx = 0, zlo = 9, zhi = -9;
    for (let g = 0; g < G; g++) { const p = [gp[3 * g], gp[3 * g + 1], gp[3 * g + 2]]; if (p[1] < Y0 + 0.07 || p[1] > LA[1] - 0.04 || Math.abs(p[0]) > 0.22) continue;
      if (segD(p, LA, LF) < 0.12 || segD(p, RA, RF) < 0.12) continue; sx += p[0]; nx++; zlo = Math.min(zlo, p[2]); zhi = Math.max(zhi, p[2]); }
    const tcx = sx / nx, tcz = (zlo + zhi) / 2;
    const angOf = (x, z) => { let a = Math.atan2(x - tcx, z - tcz); if (a < 0) a += 2 * Math.PI; return a; };
    /* the body's own surface round that axis: the inner surface (15th percentile of the radius) of every point off the
       arms, per 10° and 2 cm bin; empty bins take the nearest filled one at the same height */
    const bins = Array.from({ length: 36 * NB }, () => []);
    for (let g = 0; g < G; g++) { const p = [gp[3 * g], gp[3 * g + 1], gp[3 * g + 2]]; if (p[1] < Y0 || p[1] >= Y1) continue;
      if (segD(p, LA, LF) < 0.09 || segD(p, RA, RF) < 0.09 || segD(p, LF, LH) < 0.08 || segD(p, RF, RH) < 0.08) continue;
      const r = Math.hypot(p[0] - tcx, p[2] - tcz); if (r > 0.40) continue;
      bins[Math.floor((p[1] - Y0) / 0.02) * 36 + Math.floor(angOf(p[0], p[2]) / (Math.PI / 18)) % 36].push(r); }
    const rIn = new Float32Array(36 * NB).fill(NaN);
    bins.forEach((a, k) => { if (a.length >= 6) { a.sort((x, y) => x - y); rIn[k] = a[Math.floor(0.15 * (a.length - 1))]; } });
    for (let yb = 0; yb < NB; yb++) for (let ab = 0; ab < 36; ab++) { const k = yb * 36 + ab; if (!Number.isNaN(rIn[k])) continue;
      for (let s = 1; s < 18; s++) { const a = rIn[yb * 36 + (ab + s) % 36], b = rIn[yb * 36 + (ab + 36 - s) % 36]; if (!Number.isNaN(a) || !Number.isNaN(b)) { rIn[k] = Number.isNaN(a) ? b : Number.isNaN(b) ? a : (a + b) / 2; break; } } }
    const rAt = (y, a) => { const fy = Math.max(0, Math.min(NB - 1.001, (y - Y0) / 0.02 - 0.5)), fa = a / (Math.PI / 18) - 0.5, y0 = Math.floor(fy), a0 = Math.floor(fa), ty = fy - y0, ta = fa - a0;
      const v = (yy, aa) => rIn[Math.min(NB - 1, yy) * 36 + ((aa % 36) + 36) % 36];
      return (1 - ty) * ((1 - ta) * v(y0, a0) + ta * v(y0, a0 + 1)) + ty * ((1 - ta) * v(y0 + 1, a0) + ta * v(y0 + 1, a0 + 1)); };
    bandF = new Float32Array(G); let nb = 0;
    for (let g = 0; g < G; g++) { if (!cloth[g] || skirtG[g]) continue; const p = [gp[3 * g], gp[3 * g + 1], gp[3 * g + 2]];
      if (p[1] < Y0 + 0.04 || p[1] > LA[1] + 0.06 || p[0] < 0) continue;
      const dA = segD(p, LA, LF); if (dA >= BANDR) continue;
      const o = Math.hypot(p[0] - tcx, p[2] - tcz) - rAt(p[1], angOf(p[0], p[2]));
      bandF[g] = sstep((o - BANDO0) / BANDOW) * sstep((BANDR - dA) / 0.06) * (drReach ? drReach[g] : 1); }
    /* BANDSIG: first smoothed in space (a Gaussian of BANDSIG metres over the cloth round it), so the crest and the trough
       of one of the scan's folds, a few centimetres apart but at different heights off his body, take the same share and
       move as one: per point, they pulled each fold apart into strips */
    if (BANDSIG > 0) {
      const R = 2.5 * BANDSIG, ids = [], grid = new Map(), ck = (x, y, z) => `${Math.floor(x / R)},${Math.floor(y / R)},${Math.floor(z / R)}`;
      for (let g = 0; g < G; g++) { if (!cloth[g] || skirtG[g]) continue; const y = gp[3 * g + 1]; if (y < Y0 || y > LA[1] + 0.12 || gp[3 * g] < -0.05) continue;
        ids.push(g); const k = ck(gp[3 * g], y, gp[3 * g + 2]); let c = grid.get(k); if (!c) grid.set(k, c = []); c.push(g); }
      const sm = new Float32Array(ids.length);
      ids.forEach((g, m) => { const x = gp[3 * g], y = gp[3 * g + 1], z = gp[3 * g + 2], X = Math.floor(x / R), Y = Math.floor(y / R), Z = Math.floor(z / R); let sw = 0, sv = 0;
        for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = -1; c <= 1; c++) { const cell = grid.get(`${X + a},${Y + b},${Z + c}`); if (!cell) continue;
          for (const h of cell) { const d2 = (gp[3 * h] - x) ** 2 + (gp[3 * h + 1] - y) ** 2 + (gp[3 * h + 2] - z) ** 2; if (d2 > R * R) continue; const w = Math.exp(-d2 / (BANDSIG * BANDSIG)); sw += w; sv += w * bandF[h]; } }
        sm[m] = sv / sw; });
      ids.forEach((g, m) => { bandF[g] = sm[m]; });
    }
    /* smoothed over the mesh, among the cloth (a band's edge never steps) */
    const tmp = new Float32Array(G);
    for (let it = 0; it < BANDPASS; it++) { for (let g = 0; g < G; g++) { if (!cloth[g] || skirtG[g]) { tmp[g] = bandF[g]; continue; } const m = deg[g + 1] - deg[g]; if (!m) { tmp[g] = bandF[g]; continue; }
        let acc = 0; for (let e = deg[g]; e < deg[g + 1]; e++) acc += bandF[adj[e]]; tmp[g] = 0.5 * bandF[g] + 0.5 * acc / m; } bandF.set(tmp); }
    /* and held inside the reach again (the smoothing spreads it; a product of smooth fields stays smooth) */
    if (drReach) for (let g = 0; g < G; g++) bandF[g] *= drReach[g];
    let sF = 0; for (let g = 0; g < G; g++) if (bandF[g] > 0.01) { nb++; sF += bandF[g]; }
    console.log(`  drape band: ${nb} cloth positions ride the sleeve bone by their height off his body (mean share ${(sF / Math.max(1, nb)).toFixed(2)}); torso axis x ${tcx.toFixed(3)} z ${tcz.toFixed(3)}`);
    /* DRAPEHANG: the band's middle at rest (weighted by its share), whose side of the arm is the side it hangs on */
    if (DR.jh !== undefined) { let sx = 0, sy = 0, sz = 0, sw = 0;
      for (let g = 0; g < G; g++) { const w = bandF[g]; if (w <= 0.01) continue; sx += w * gp[3 * g]; sy += w * gp[3 * g + 1]; sz += w * gp[3 * g + 2]; sw += w; }
      DR.c0 = [sx / sw, sy / sw, sz / sw]; console.log(`  drape hang: the band's middle at rest ${DR.c0.map(x => x.toFixed(3)).join(' ')}`); }
  }
  let nCloth = 0; for (let g = 0; g < G; g++) nCloth += cloth[g];
  /* the set re-bound: the cloth, and the TRUNK's other points (bare chest and back, the necklace) — between the waist and
     the base of the neck, and off the arms (farther than SKINARM from an upper arm, forearm or hand) */
  const armSegs = [['LeftArm', 'LeftForeArm'], ['LeftForeArm', 'LeftHand'], ['RightArm', 'RightForeArm'], ['RightForeArm', 'RightHand']].filter(([a, b]) => JI[a] !== undefined && JI[b] !== undefined);
  const env = new Uint8Array(G); let nTrunk = 0;
  for (let g = 0; g < G; g++) {
    if (cloth[g]) { env[g] = 1; continue; }
    const p = [gp[3 * g], gp[3 * g + 1], gp[3 * g + 2]];
    if (p[1] <= WAIST - 0.08 || p[1] >= SKINTOP) continue;
    let dArm = 9; for (const [a, b] of armSegs) dArm = Math.min(dArm, segD(p, JP[JI[a]], JP[JI[b]]));
    if (dArm > SKINARM) { env[g] = 1; nTrunk++; }
  }
  /* the original weights per group (averaged over a group's copies), NJ wide */
  const NJ = joints.length, A0 = new Float32Array(G * NJ), cnt = new Float32Array(G);
  for (let i = 0; i < n; i++) { const g = gid[i]; J.getElement(i, jj); W.getElement(i, ww); cnt[g]++; for (let k = 0; k < 4; k++) A0[g * NJ + jj[k]] += ww[k]; }
  for (let g = 0; g < G; g++) for (let j = 0; j < NJ; j++) A0[g * NJ + j] /= cnt[g];
  /* 3 · rings from skin (BFS over the groups) */
  const ring = new Int32Array(G).fill(1 << 20), q = [];
  for (let g = 0; g < G; g++) if (!env[g]) { ring[g] = 0; q.push(g); }
  for (let h = 0; h < q.length; h++) { const g = q[h]; if (ring[g] >= RING) continue; for (let e = deg[g]; e < deg[g + 1]; e++) { const b = adj[e]; if (ring[b] > ring[g] + 1) { ring[b] = ring[g] + 1; q.push(b); } } }
  /* 2 · the envelope, mixed with the original near skin */
  let A = A0.slice();
  for (let g = 0; g < G; g++) {
    if (!env[g]) continue;
    const p = [gp[3 * g], gp[3 * g + 1], gp[3 * g + 2]], low = p[1] < WAIST;
    const ew = new Float32Array(NJ); let sum = 0;
    for (const [b, c, r, s, reg] of SEG) {
      if (reg === 'low' && !low && p[1] > WAIST + 0.06) continue;             // a leg never pulls the drape above the waist
      if (reg === 'low' && SKIRT && p[1] > ROOTY - 0.03) continue;           // v24.40: with the skirt's chains, never above their roots
      if (reg === 'up' && low && p[1] < WAIST - 0.10) continue;              // nor an arm the skirt below it
      const d = segD(p, JP[JI[b]], JP[JI[c]]);
      let w = Math.exp(-((Math.max(0, d - r) / s) ** 2));
      if (FRONTSHIN && /Leg$/.test(b) && !/UpLeg$/.test(b)) {
        /* how far in front of this shin the point stands (z past the shin's own z at that height, the bind pose faces +z) */
        const A = JP[JI[b]], C = JP[JI[c]], t = Math.max(0, Math.min(1, (p[1] - A[1]) / ((C[1] - A[1]) || 1e-6)));
        const zf = p[2] - (A[2] + t * (C[2] - A[2])), k = Math.max(0, Math.min(1, (zf - 0.02) / 0.08));
        const lost = w * FRONTSHIN * k * k * (3 - 2 * k); w -= lost;
        const up = b.replace('Leg', 'UpLeg'); if (JI[up] !== undefined) { ew[JI[up]] += lost; sum += lost; }
      }
      ew[JI[b]] += w; sum += w;
    }
    if (sum < 1e-6) continue;                                                 // nothing near: keep its own
    if (BANDS) { const bw = bandW(p[1]); let sp = 0; for (const j of SPINEJ) { sp += ew[j]; ew[j] = 0; } SPINEJ.forEach((j, k) => { ew[j] += sp * bw[k]; }); }
    const a = Math.min(1, ring[g] / RING);
    for (let j = 0; j < NJ; j++) A[g * NJ + j] = (1 - a) * A0[g * NJ + j] + a * ew[j] / sum;
  }
  /* 4 · diffusion inside the cloth (skin groups hold still as the boundary) */
  let B = A.slice();
  for (let it = 0; it < RPASS; it++) {
    for (let g = 0; g < G; g++) {
      const o = g * NJ;
      if (!env[g] || ring[g] < 2) { for (let j = 0; j < NJ; j++) B[o + j] = A[o + j]; continue; }
      const m = deg[g + 1] - deg[g]; if (!m) { for (let j = 0; j < NJ; j++) B[o + j] = A[o + j]; continue; }
      for (let j = 0; j < NJ; j++) { let acc = 0; for (let e = deg[g]; e < deg[g + 1]; e++) acc += A[adj[e] * NJ + j]; B[o + j] = 0.5 * A[o + j] + 0.5 * acc / m; }
    }
    const T = A; A = B; B = T;
  }
  /* 5 · v24.43 LDRAPE: the cloth on his left upper arm takes his file's own weights back (see LDRAPE above) */
  if (LDRAPE > 0 && JI.LeftArm !== undefined && JI.LeftForeArm !== undefined) {
    const LA = JP[JI.LeftArm], LF = JP[JI.LeftForeArm], SP = ['Hips', 'Spine', 'Spine1', 'Spine2', 'Neck'].filter(n => JI[n] !== undefined).map(n => JP[JI[n]]);
    let nD = 0, sD = 0;
    for (let g = 0; g < G; g++) {
      if (!cloth[g]) continue;
      const p = [gp[3 * g], gp[3 * g + 1], gp[3 * g + 2]];
      if (p[1] < WAIST + 0.10) continue;
      const dA = segD(p, LA, LF); if (dA >= 0.14) continue;
      let dS = 9; for (let k = 0; k + 1 < SP.length; k++) dS = Math.min(dS, segD(p, SP[k], SP[k + 1]));
      const f = LDRAPE * sstep((dS - dA) / LDRAPEB) * sstep((0.14 - dA) / LDRAPEB) * sstep((segT(p, LA, LF) - LDRAPET0) / LDRAPETW);
      if (f <= 0) continue;
      const o = g * NJ; for (let j = 0; j < NJ; j++) A[o + j] = (1 - f) * A[o + j] + f * A0[o + j];
      nD++; sD += f;
    }
    console.log(`  drape: ${nD} cloth positions on his left upper arm take his file's weights back (mean share ${(sD / Math.max(1, nD)).toFixed(2)})`);
  }
  /* v24.40 · a skirt point's weights: below the roots' band the chains (the two either side of it by angle, the upper or
     lower bones by height, blended over the knees' band), above it the trunk's; within HEMRING edges of the shins' skin,
     the nearer shin's */
  const skirtMix = (g, best) => {
    const x = gp[3 * g], y = gp[3 * g + 1], z = gp[3 * g + 2], N = CH.length, D = 2 * Math.PI / N;
    let a = Math.atan2(x - CH.cx, z - CH.cz); if (a < 0) a += 2 * Math.PI;
    const u = a / D, k0 = Math.floor(u) % N, k1 = (k0 + 1) % N, f = u - Math.floor(u);
    const tk = sstep((CH.YK + 0.07 - y) / 0.14), tr = sstep((ROOTY + 0.05 - y) / 0.08);
    const th = y < CH.YK ? Math.max(0, 1 - ring[g] / E('HEMRING', 4)) : 0;
    if (tr <= 0) return;
    for (const b of best) b[0] *= 1 - tr;
    const c = tr * (1 - th), sh = tr * th;
    if (SKIRTB === 3) { const tm = sstep((CH.YM + 0.05 - y) / 0.10), wA = 1 - tm, wM = tm * (1 - tk), wB = tk;   // the mid ring's band, then the knees'
      best.push([c * (1 - f) * wA, CH[k0].ja], [c * f * wA, CH[k1].ja], [c * (1 - f) * wM, CH[k0].jm], [c * f * wM, CH[k1].jm], [c * (1 - f) * wB, CH[k0].jb], [c * f * wB, CH[k1].jb]); }
    else best.push([c * (1 - f) * (1 - tk), CH[k0].ja], [c * f * (1 - tk), CH[k1].ja], [c * (1 - f) * tk, CH[k0].jb], [c * f * tk, CH[k1].jb]);
    if (sh > 0) { const p = [x, y, z]; best.push([sh, segD(p, JP[JI.LeftLeg], JP[JI.LeftFoot]) < segD(p, JP[JI.RightLeg], JP[JI.RightFoot]) ? JI.LeftLeg : JI.RightLeg]); }
  };
  /* back to four per vertex */
  const dom = {}, fitSeen = new Uint8Array(G); if (CH) CH.fit = {};
  const DRAPEDBG = E('DRAPEDBG', 0), dbgSeen = new Uint8Array(DRAPEDBG ? G : 0), dbgH = [0, 0, 0, 0, 0];
  for (let i = 0; i < n; i++) {
    const g = gid[i], o = g * NJ, best = [];
    for (let j = 0; j < NJ; j++) if (A[o + j] > 1e-4) best.push([A[o + j], j]);
    if (CH && env[g]) for (const b of best) if (b[1] === JI.Hips) b[1] = CH.jw;   // the robe's waist rides SkirtWaist, never the pelvis's own tip
    if (CH && skirtG[g]) skirtMix(g, best);
    /* v24.45 DRAPE: a re-bound point's share of the upper arm rides the sleeve bone, moved over ring by ring from skin */
    if (DR && env[g] && !skirtG[g] && gp[3 * g + 1] > WAIST) { const fr = Math.min(1, ring[g] / RING), f = fr * (drReach ? drReach[g] : 1);
      if (f > 0) for (const b of best.slice()) if (b[1] === JI.LeftArm && b[0] > 0) { best.push([b[0] * f, DR.j]); b[0] *= 1 - f; }
      /* DRAPE=2: and the band's share of the whole point (its height off his body), moved over from skin the same way */
      if (bandF && bandF[g] > 0) { const fb = bandF[g] * fr, tot = best.reduce((s, b) => s + b[0], 0) || 1; for (const b of best) b[0] *= (1 - fb); best.push([fb * tot, DR.jh !== undefined ? DR.jh : DR.j]); } }
    best.sort((x, y) => y[0] - x[0]); let top = best.slice(0, 4);
    /* v24.45 DRAPEMERGE: a drape point's lost shares go to the nearest kept bone (see DRAPEMERGE above) */
    if (DRAPEMERGE && DR && best.length > 4 && best.some(b => (b[1] === DR.j || b[1] === DR.jh) && b[0] > 0)) { top = top.map(b => [b[0], b[1]]);
      const jpos = j => j === DR.j || j === DR.jh ? JP[JI.LeftArm] : (CH && j === CH.jw) ? JP[JI.Hips] : JP[j];
      for (const d of best.slice(4)) { const pd = jpos(d[1]); if (!pd) continue; let bi = -1, bd = 1e9;
        top.forEach((k, m) => { const pk = jpos(k[1]); if (!pk) return; const dd = Math.hypot(pd[0] - pk[0], pd[1] - pk[1], pd[2] - pk[2]); if (dd < bd) { bd = dd; bi = m; } });
        if (bi >= 0) top[bi][0] += d[0]; } }
    const s = top.reduce((x, y) => x + y[0], 0) || 1;
    if (DRAPEDBG && env[g] && !skirtG[g] && gp[3 * g] > 0 && gp[3 * g + 1] > WAIST && !dbgSeen[g]) { dbgSeen[g] = 1;
      const tot = best.reduce((x, y) => x + y[0], 0) || 1, dl = 1 - s / tot; dbgH[dl > 0.2 ? 4 : dl > 0.1 ? 3 : dl > 0.05 ? 2 : dl > 0.02 ? 1 : 0]++; }
    /* v24.41 FIT: a skirt position's rest place, its ORIGINAL weights and the chain bone it mostly rides, kept (every
       few) so a take can have its chains fitted to how his own file moved the robe */
    if (CH && skirtG[g] && !fitSeen[g] && top[0][1] > NJ0) { fitSeen[g] = 1;
      const jb = top[0][1], o0 = g * NJ, a0 = []; for (let j = 0; j < NJ; j++) if (A0[o0 + j] > 0.01) a0.push(j, A0[o0 + j]);
      (CH.fit[jb] || (CH.fit[jb] = [])).push({ p: [gp[3 * g], gp[3 * g + 1], gp[3 * g + 2]], a0, w: top[0][0] / s }); }
    while (top.length < 4) top.push([0, 0]);
    J.setElement(i, top.map(t => t[1])); W.setElement(i, top.map(t => t[0] / s));
    if (env[g]) { const k = JN[top[0][1]]; dom[k] = (dom[k] || 0) + 1; }
  }
  if (DRAPEDBG) console.log(`  DRAPEDBG left upper body, share dropped by the four-weight cut: <2% ${dbgH[0]}, 2-5% ${dbgH[1]}, 5-10% ${dbgH[2]}, 10-20% ${dbgH[3]}, >20% ${dbgH[4]}`);
  console.log(`  cloth: ${nCloth} of ${G} positions (${n} vertices), and ${nTrunk} more of the trunk; rings ${RING}, diffusion ${RPASS}; waist y ${WAIST.toFixed(3)}`);
  console.log('  re-bound points by main bone now:', Object.entries(dom).sort((a, b) => b[1] - a[1]).map(([k, c]) => `${k} ${c}`).join(', '));
  if (PREVIEW) {
    /* a copy painted by class and main bone (vertex colours), for a photograph of where the cloth was found */
    const pal = { SkirtWaist: [0.62, 0.45, 0.3], Hips: [1, 0.8, 0], Spine: [1, 0.5, 0], Spine1: [1, 0.3, 0.2], Spine2: [0.9, 0.2, 0.4], LeftUpLeg: [0.2, 0.4, 1], RightUpLeg: [0.2, 0.9, 1],
      LeftLeg: [0.2, 0.2, 0.7], RightLeg: [0.1, 0.6, 0.6], LeftArm: [0.1, 0.8, 0.2], RightArm: [0.6, 1, 0.3], LeftShoulder: [0.3, 0.6, 0.3], RightShoulder: [0.5, 0.7, 0.4],
      LeftForeArm: [0, 0.5, 0], RightForeArm: [0.4, 0.6, 0], Neck: [0.8, 0, 0.8], DrapeArm: [0.1, 0.9, 0.9], DrapeHang: [0.9, 0.9, 0.1] };
    const col = new Float32Array(n * 4);
    /* a chain's bones by its angle round him (a hue), its upper bone light and its lower dark */
    const skirtCol = nm => { const m = /^Skirt([AB])(\d+)$/.exec(nm || ''); if (!m) return null; const h = (+m[2] / (CH ? CH.length : 12)) * 6, v = m[1] === 'A' ? 1 : 0.55;
      const f = h - Math.floor(h), seg = Math.floor(h) % 6, q = [[1, f, 0], [1 - f, 1, 0], [0, 1, f], [0, 1 - f, 1], [f, 0, 1], [1, 0, 1 - f]][seg]; return q.map(x => (0.25 + 0.75 * x) * v); };
    for (let i = 0; i < n; i++) { const g = gid[i]; J.getElement(i, jj); const c = env[g] ? (pal[JN[jj[0]]] || skirtCol(JN[jj[0]]) || [1, 1, 1]) : [0.35, 0.3, 0.28]; col.set([...c, 1], 4 * i); }
    prim.setAttribute('COLOR_0', doc.createAccessor().setType('VEC4').setArray(col).setBuffer(root.listBuffers()[0]));
  }
}
/* TAKELIFT: a take's hips raised (a floor sit planted through the floor) */
for (const spec of (process.env.TAKELIFT || '').split(',').filter(Boolean)) {
  const [take, m] = spec.split(':'), dy = Number(m);
  const an = root.listAnimations().find(a => a.getName() === take); if (!an) throw new Error('no take ' + take);
  for (const ch of an.listChannels()) {
    if (ch.getTargetPath() !== 'translation' || !/Hips$/.test(ch.getTargetNode().getName())) continue;
    const out = ch.getSampler().getOutput(), arr = out.getArray().slice(); for (let i = 1; i < arr.length; i += 3) arr[i] += dy; out.setArray(arr);
    console.log(`  ${take}: hips raised ${dy} m`);
  }
}
/* v24.44 · UPRIGHT="Take:degrees,..." — the waist straightened. Chad, 4 Nov 2026: "Why does pho model look hunchback in
   so many poses? Make him more upright". Measured (masters/v24.44/PLAN.md): his waist joint (Spine) is bent forward
   42–75° against rest in EVERY take and barely moves within one, his hips tipped back ~25° and his neck craned back
   15–40° to bring his face up — a constant left by how the takes were laid onto his scan's rig, not acting. Each named
   take gets a constant backward turn of the Spine joint about the body's side-to-side axis (the rest's +x as the hips
   carry it, which is one fixed axis in the hips' own frame, so the turn is the same at every key and keeps the take's
   motion), and the neck the same turn given back key by key, so the head keeps exactly the orientation the take gave it.
   The hips and legs are not touched: the feet stay where they were. Unset, nothing changes */
const UPRIGHT = (process.env.UPRIGHT || '').split(',').filter(Boolean).map(s => { const [k, v] = s.split(':'); return [k, Number(v)]; });
/* UPRIGHTARMS="Take,...": those takes' shoulders (the clavicles) get the turn given back too, so the arms keep their
   world pose (a hanging arm hangs, an aimed gesture keeps its aim, a hand at the face stays there) and only ride the
   straightened shoulders. Left out, the arms ride the chest and every raised arm aims higher by the turn — the v24.44
   review found it on every sheet (a forward thrust became an upward reach, the shout's hands rose above his head), so
   name every turned take where a hand aims, hangs or rests; leave out only a hand resting ON the body (on the hip) */
const UPRIGHTARMS = (process.env.UPRIGHTARMS || '').split(',').filter(Boolean);
if (UPRIGHT.length) {
  const nodeN = n => root.listNodes().find(x => x.getName().replace(/^mixamorig[:_]?/, '') === n);
  const wqOf = (P, n) => { const q = new Quaternion(); P.world[P.NI.get(nodeN(n))].decompose(new Vector3(), q, new Vector3()); return q; };
  const P0 = makePoser(root); P0.pose(null, 0);
  const hipsRest = wqOf(P0, 'Hips'), axisH = new Vector3(1, 0, 0).applyQuaternion(hipsRest.clone().invert()).normalize();
  for (const [take, deg] of UPRIGHT) {
    const an = root.listAnimations().find(a => a.getName() === take); if (!an) throw new Error('no take ' + take);
    const chOf = n => an.listChannels().find(c => c.getTargetPath() === 'rotation' && c.getTargetNode() === nodeN(n));
    const chS = chOf('Spine'), chN = chOf('Neck'); if (!chS || !chN) throw new Error(`${take}: no Spine or Neck rotation track`);
    for (const ch of [chS, chN]) if (!['LINEAR', 'STEP'].includes(ch.getSampler().getInterpolation())) throw new Error(`${take}: a ${ch.getSampler().getInterpolation()} track`);
    const th = deg * Math.PI / 180, P = makePoser(root);
    /* the neck's turn given back, from the take as it was: about the side axis seen from Spine2 at that key (and the
       shoulders', in an UPRIGHTARMS take — all three are children of Spine2) */
    const giveBack = ch => { const tK = ch.getSampler().getInput().getArray(), arr = ch.getSampler().getOutput().getArray().slice();
      for (let k = 0; k < tK.length; k++) {
        P.pose(an, tK[k]);
        const side = new Vector3(1, 0, 0).applyQuaternion(wqOf(P, 'Hips').multiply(hipsRest.clone().invert()));
        side.applyQuaternion(wqOf(P, 'Spine2').invert()).normalize();
        new Quaternion().setFromAxisAngle(side, th).multiply(new Quaternion().fromArray(arr, 4 * k)).normalize().toArray(arr, 4 * k);
      }
      return arr; };
    const arrN = giveBack(chN);
    const arms = UPRIGHTARMS.includes(take) ? ['LeftShoulder', 'RightShoulder'].map(n => { const ch = chOf(n); if (!ch) throw new Error(`${take}: no ${n} rotation track`); return [ch, giveBack(ch)]; }) : [];
    /* the waist's turn, the same at every key */
    const Qs = new Quaternion().setFromAxisAngle(axisH, -th), arrS = chS.getSampler().getOutput().getArray().slice();
    for (let k = 0; k < arrS.length / 4; k++) Qs.clone().multiply(new Quaternion().fromArray(arrS, 4 * k)).normalize().toArray(arrS, 4 * k);
    chS.getSampler().getOutput().setArray(arrS); chN.getSampler().getOutput().setArray(arrN);
    for (const [ch, arr] of arms) ch.getSampler().getOutput().setArray(arr);
    console.log(`  ${take}: the waist straightened ${deg}°, the neck${arms.length ? ' and the shoulders' : ''} given it back`);
  }
}
/* v24.40 · THE SKIRT'S TAKES: every take's chains turned at its own keys (the hips' rotation track's times), from the
   pose the take gives the pelvis, thighs and shins — and the rest pose checked to bake to rest */
if (CH) {
  const poser = makePoser(root), node = n => joints[JI[n]], Wd = n => poser.world[poser.NI.get(node(n))];
  const LEGS = ['Hips', 'LeftUpLeg', 'RightUpLeg', 'LeftLeg', 'RightLeg', 'LeftFoot', 'RightFoot'], M0i = {};
  poser.pose(null, 0);
  for (const n of LEGS) M0i[n] = Wd(n).clone().invert();
  const qH0 = new Quaternion(); Wd('Hips').decompose(new Vector3(), qH0, new Vector3());
  const qS0 = new Quaternion(); Wd('Spine').decompose(new Vector3(), qS0, new Vector3());
  /* SKIRTV=2 (the reviewer's read of v24.40's first skirt, every seated take worse than his file): the back of the robe
     follows the thighs and goes under him when he sits (a small share of the waist, not half), no sag on a lifted thigh
     (a chair sit shows its lap and knees), the lower bones TURN with the shins (each shin's own rotation laid on the
     bone's rest direction, the two shins' pulls softened toward their mean by LOWERMIX) rather than chase a point
     carried by one shin (which pinned the hem to the back foot in every lunge), less gravity on them (they cover the
     shins seated), and the feet are capsules too */
  /* the three-bone chains (SKIRTB=3) take V2's table and foot capsules */
  const V2 = E('SKIRTV', 1) >= 2 || SKIRTB === 3;
  let DBG = null;   // DBGAT=Take@seconds: each chain's working printed at that key (a debug print; nothing written changes)
  const V = a => new Vector3(...a), Pw0 = new Vector3(...JP[JI.Hips]), WB = E('WAISTBLEND', 0.5), GU = E('HANGUP', V2 ? 0 : 0.45);
  const RT = E('THIGHCAP', 0.09), RS = E('SHINCAP', 0.07), G0 = E('HANG0', 0.15), G1 = E('HANG1', V2 ? 0.35 : 0.9), LOWERMIX = E('LOWERMIX', 0.5);
  const FITTAKES = (process.env.FIT || '').split(',').filter(Boolean), FITMIX = E('FITMIX', 1);
  /* [his left thigh, his right thigh, the pelvis] by the chain's angle from his front, 0..180° by 30 (mirrored past 180) */
  const TABLE = V2 ? [[0.5, 0.5, 0], [0.7, 0.3, 0], [0.88, 0.12, 0], [0.85, 0, 0.15], [0.75, 0.05, 0.2], [0.6, 0.2, 0.2], [0.42, 0.42, 0.16]]
    : [[0.5, 0.5, 0], [0.7, 0.3, 0], [0.88, 0.12, 0], [0.85, 0, 0.15], [0.65, 0, 0.35], [0.45, 0.05, 0.5], [0.25, 0.25, 0.5]];
  const angW = th => { let d = th * 180 / Math.PI, mir = false; if (d > 180) { d = 360 - d; mir = true; }
    const i = Math.min(5, Math.floor(d / 30)), f = d / 30 - i, a = TABLE[i], b = TABLE[i + 1], w = a.map((x, k) => x + (b[k] - x) * f), s = w[0] + w[1] + w[2];
    const r = w.map(x => x / s); return mir ? [r[1], r[0], r[2]] : r; };
  const CAPS = [['LeftUpLeg', 'LeftLeg', RT], ['LeftLeg', 'LeftFoot', RS], ['RightUpLeg', 'RightLeg', RT], ['RightLeg', 'RightFoot', RS]];
  if (V2) for (const sd of ['Left', 'Right']) { const toe = [`${sd}Toe_End`, `${sd}ToeBase`].find(n => JI[n] !== undefined); if (toe) CAPS.push([`${sd}Foot`, toe, E('FOOTCAP', 0.05)]); }
  /* SKIRTB=3: the HEELS too (a point 6 cm behind the ankle at the sole, carried by the foot): a kicked-back foot leads
     with its heel, and the ankle's capsule alone let it through the back of the robe running */
  const HEEL = {};
  if (SKIRTB === 3) for (const sd of ['Left', 'Right']) { const toe = [`${sd}ToeBase`, `${sd}Toe_End`].find(n => JI[n] !== undefined); if (!toe) continue;
    const f = JP[JI[`${sd}Foot`]], t = JP[JI[toe]], h = Math.hypot(t[0] - f[0], t[2] - f[2]) || 1;
    HEEL[sd] = [f[0] - 0.06 * (t[0] - f[0]) / h, 0.035, f[2] - 0.06 * (t[2] - f[2]) / h]; CAPS.push([`${sd}Foot`, `@heel${sd}`, E('HEELCAP', 0.045)]); }
  for (const [a, b] of CAPS) for (const n of [a, b]) if (!LEGS.includes(n) && n[0] !== '@') LEGS.push(n);
  poser.pose(null, 0); for (const n of LEGS) M0i[n] = Wd(n).clone().invert();
  const qRest = {}; for (const n of LEGS) { qRest[n] = new Quaternion(); Wd(n).decompose(new Vector3(), qRest[n], new Vector3()); }
  /* SKIRTV=3 (SWING): a leg carries the cloth by its SWING alone — the turn that takes the waist-carried rest direction of
     the thigh (hip to knee) or shin (knee to ankle) to where it points now — never by the bone's own twist. Sitting with
     his knees apart the femurs turn out on their own axes, and the side chains' knee points, carried rigidly by the thigh
     bone, went UNDER the thighs (measured: Sitting_Answering_Questions 4.4 s, the left side chain's knee point 9 cm below
     and 12 cm behind his knee), so a chair sit showed no lap from the side. Cloth lying over a thigh does not turn with
     the femur */
  const SWING = E('SWING', E('SKIRTV', 1) >= 3 ? 1 : 0);
  const restP = {}; for (const n of ['LeftUpLeg', 'LeftLeg', 'LeftFoot', 'RightUpLeg', 'RightLeg', 'RightFoot']) restP[n] = new Vector3().setFromMatrixPosition(Wd(n));
  const qTurn = n => { const q = new Quaternion(); Wd(n).decompose(new Vector3(), q, new Vector3()); return q.multiply(qRest[n].clone().invert()); };
  const segPt = (q, a, b) => { const ab = b.clone().sub(a), t = Math.max(0, Math.min(1, q.clone().sub(a).dot(ab) / ab.lengthSq())); return a.clone().addScaledVector(ab, t); };
  const capPt = n => n[0] === '@' ? V(HEEL[n.slice(5)]).applyMatrix4(M0i[`${n.slice(5)}Foot`]).applyMatrix4(Wd(`${n.slice(5)}Foot`)) : new Vector3().setFromMatrixPosition(Wd(n));
  const capsNow = () => CAPS.map(([a, b]) => [capPt(a), capPt(b)]);
  const rest = capsNow();
  for (const c of CH) {
    c.u0 = V(c.K).sub(V(c.R)).normalize(); c.l0 = V(c.H).sub(V(c.K)).normalize(); c.L1 = V(c.K).distanceTo(V(c.R)); c.L2 = V(c.H).distanceTo(V(c.K));
    c.w = angW(c.th); c.out = new Vector3(Math.sin(c.th), 0, Math.cos(c.th));
    /* a leg's capsule never nearer than this chain stood to it at rest, so rest is rest */
    const p1 = [0.4, 0.7, 1].map(u => V(c.R).lerp(V(c.K), u)), p2 = [0.4, 0.7, 1].map(u => V(c.K).lerp(V(c.H), u));
    c.r1 = rest.map(([a, b], i) => Math.min(CAPS[i][2], ...p1.map(q => q.distanceTo(segPt(q, a, b)) - 0.01)));
    c.r2 = rest.map(([a, b], i) => Math.min(CAPS[i][2], ...p2.map(q => q.distanceTo(segPt(q, a, b)) - 0.01)));
    if (SKIRTB === 3) {
      c.a0 = V(c.Mid).sub(V(c.R)).normalize(); c.m0 = V(c.K).sub(V(c.Mid)).normalize(); c.La = V(c.Mid).distanceTo(V(c.R)); c.Lm = V(c.K).distanceTo(V(c.Mid));
      const cap = (P, Q) => { const pts = [0.4, 0.7, 1].map(u => V(P).lerp(V(Q), u)); return rest.map(([a, b], i) => Math.min(CAPS[i][2], ...pts.map(q => q.distanceTo(segPt(q, a, b)) - 0.01))); };
      c.ra = cap(c.R, c.Mid); c.rm = cap(c.Mid, c.K); c.rb = cap(c.K, c.H);
    }
  }
  const push = (S, d, len, caps, radii, out) => { const e = S.clone().addScaledVector(d, len);
    for (let it = 0; it < 4; it++) { let moved = false;
      for (const u of [0.4, 0.7, 1]) { const q = S.clone().lerp(e, u);
        caps.forEach(([a, b], ci) => { const r = radii[ci]; if (r <= 0) return; const cp = segPt(q, a, b), dv = q.clone().sub(cp), dist = dv.length(); if (dist >= r) return;
          if (dist < 1e-6) dv.copy(out); else dv.divideScalar(dist); e.addScaledVector(dv, Math.min(0.08, (r - dist) / u)); moved = true; }); }
      e.sub(S).setLength(len).add(S); if (!moved) break; }
    return e.sub(S).normalize(); };
  /* FLOORIN (0..1): the share of a floor-lying length turned back in under him (a robe's hem on the floor tucks under
     the knees) instead of running on outward along the floor */
  const FLOORIN = E('FLOORIN', 0);
  const floorClamp = (S, d, len, out) => { const fy = FLOOR + 0.015; if (S.y + d.y * len >= fy) return d;
    const h = new Vector3(d.x, 0, d.z); if (h.lengthSq() < 1e-6) h.copy(out); h.normalize();
    if (FLOORIN > 0) { h.multiplyScalar(1 - FLOORIN).addScaledVector(out, -FLOORIN); if (h.lengthSq() < 1e-6) h.copy(out).negate(); h.normalize(); }
    const dy = S.y - fy;
    if (dy <= 0) return h; const s = Math.min(1, dy / len); return h.multiplyScalar(Math.sqrt(1 - s * s)).add(new Vector3(0, -s, 0)); };
  const qAlign = (a, b) => new Quaternion().setFromUnitVectors(a, b), c25 = Math.cos(25 * Math.PI / 180), c75 = Math.cos(75 * Math.PI / 180);
  /* the chains at the pose the poser holds: each bone's local rotation */
  const chainsNow = () => {
    const qHw = new Quaternion(), qSw = new Quaternion(); Wd('Hips').decompose(new Vector3(), qHw, new Vector3()); Wd('Spine').decompose(new Vector3(), qSw, new Vector3());
    const qH = qHw.clone().multiply(qH0.clone().invert()), qS = qSw.clone().multiply(qS0.clone().invert());
    const qW = qH.clone().slerp(qS, WB), PwN = new Vector3().setFromMatrixPosition(Wd('Hips')), fwd = new Vector3(0, 0, 1).applyQuaternion(qW);
    const yaw = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.atan2(fwd.x, fwd.z)), caps = capsNow();
    const rig = (n, p) => V(p).applyMatrix4(M0i[n]).applyMatrix4(Wd(n));          // a rest point carried rigidly by that bone
    const rigW = p => V(p).sub(Pw0).applyQuaternion(qW).add(PwN);                  // ... and by the waist
    const Pn = n => new Vector3().setFromMatrixPosition(Wd(n));
    const swingOf = (a, b) => { const r = restP[b].clone().sub(restP[a]).normalize().applyQuaternion(qW), m = Pn(b).sub(Pn(a)).normalize();
      return new Quaternion().setFromUnitVectors(r, m).multiply(qW); };
    const carry = (a, b, p) => V(p).sub(restP[a]).applyQuaternion(swingOf(a, b)).add(Pn(a));   // SWING: by the leg's swing, not its twist
    const thighK = (sd, p) => SWING ? carry(`${sd}UpLeg`, `${sd}Leg`, p) : rig(`${sd}UpLeg`, p);
    const shinQ = sd => SWING ? swingOf(`${sd}Leg`, `${sd}Foot`) : qTurn(`${sd}Leg`);
    const res = CH.map(c => {
      const out = c.out.clone().applyQuaternion(yaw), R = rigW(c.R);
      const Et = thighK('Left', c.K).multiplyScalar(c.w[0]).add(thighK('Right', c.K).multiplyScalar(c.w[1])).add(rigW(c.K).multiplyScalar(c.w[2]));
      const Et0 = DBG ? Et.clone() : null;
      let d = Et.sub(R).normalize();
      /* a lifted thigh's cloth sags (HANGUP at most): across a lap onto the shins, between the knees, over the thigh's side */
      const gu = GU * sstep((c25 + d.y) / (c25 - c75)); if (gu > 0) d.multiplyScalar(1 - gu).add(new Vector3(0, -gu, 0)).normalize();
      const dPre = DBG ? d.clone() : null;
      d = push(R, d, c.L1, caps, c.r1, out); d = floorClamp(R, d, c.L1, out);
      const S = R.clone().addScaledVector(d, c.L1), hang = S.clone().addScaledVector(c.l0.clone().applyQuaternion(yaw), c.L2);
      if (DBG) DBG.push(`ch${Math.round(c.th * 180 / Math.PI)}° R ${R.toArray().map(x => x.toFixed(2))} Et ${Et0.toArray().map(x => x.toFixed(2))} d ${dPre.toArray().map(x => x.toFixed(2))} -> ${d.toArray().map(x => x.toFixed(2))} S ${S.toArray().map(x => x.toFixed(2))}`);
      const gr = G0 + (G1 - G0) * sstep((c25 + d.y) / (c25 - c75));             // -d.y: how near straight down the upper bone is
      let d2;
      if (V2) {
        const m = (c.w[0] + c.w[1]) / 2, wl = (1 - LOWERMIX) * c.w[0] + LOWERMIX * m, wr = (1 - LOWERMIX) * c.w[1] + LOWERMIX * m;
        const dH = c.l0.clone().applyQuaternion(yaw);
        const dl = c.l0.clone().applyQuaternion(shinQ('Left')).multiplyScalar(wl).add(c.l0.clone().applyQuaternion(shinQ('Right')).multiplyScalar(wr)).add(dH.clone().multiplyScalar(c.w[2])).normalize();
        d2 = dl.multiplyScalar(1 - gr).add(dH.multiplyScalar(gr)).normalize();
      } else {
        const Fl = rig('LeftLeg', c.H).multiplyScalar(c.w[0]).add(rig('RightLeg', c.H).multiplyScalar(c.w[1])).add(hang.clone().multiplyScalar(c.w[2]));
        d2 = Fl.multiplyScalar(1 - gr).add(hang.clone().multiplyScalar(gr)).sub(S).normalize();
      }
      d2 = push(S, d2, c.L2, caps, c.r2, out); d2 = floorClamp(S, d2, c.L2, out);
      const Wu = qAlign(c.u0.clone().applyQuaternion(qW), d).multiply(qW), Wl = qAlign(c.l0.clone().applyQuaternion(Wu), d2).multiply(Wu);
      return [qW.clone().invert().multiply(Wu), Wu.clone().invert().multiply(Wl), Wu, Wl];
    });
    res.waist = [qHw.clone().invert().multiply(qW), qW];
    return res;
  };
  /* SKIRTB=3 · THE RULES THAT HANG: the waist bone follows the thighs (by their swing, the table's shares) to the mid ring;
     the mid and lower bones HANG (their rest direction turned only by his yaw) and are pushed out of the legs, the heels
     and the floor — cloth is pushed by a leg, not tied to one (tied to the shins it pinned the hem to the back foot in
     every lunge). A capsule's radius is the chain's own rest clearance (so rest is rest) growing back to the full radius
     as that leg moves off its rest place round the waist (GROW per metre), so a kicked foot meets the cloth it was under */
  const GROW = E('GROW', 1.5), NB = SKIRTB === 3 ? 3 : 2;
  /* HULL (SKIRTB=3): the back and sides of the robe ENCLOSE the shins, ankles, heels and toes — a leg stepped back (every lunge)
     or a heel kicked up (running) stands inside the robe, so the chains there are pushed OUT from his body's axis until
     they pass outside it (the legs' support in each chain's direction, at each height, within HULLB). Never in front
     (the front drapes the lap and the crossed shins) and never more than at rest (each chain's rest shortfall is its
     allowance, so rest is rest) */
  const HULL = E('HULL', SKIRTB === 3 ? 1 : 0), HULLB = E('HULLB', 0.08), HSEC = 1 / Math.cos(Math.PI / 12), HULLR = E('HULLR', 1), HULLTAPER = E('HULLTAPER', 0);
  const legSamples = () => { const S = [];
    for (const sd of ['Left', 'Right']) { const kn = Wd(`${sd}Leg`), an = Wd(`${sd}Foot`), K = new Vector3().setFromMatrixPosition(kn), Aa = new Vector3().setFromMatrixPosition(an);
      for (let i = 0; i <= 6; i++) S.push([K.clone().lerp(Aa, i / 6), 0.065]);
      if (HEEL[sd]) S.push([V(HEEL[sd]).applyMatrix4(M0i[`${sd}Foot`]).applyMatrix4(an), 0.045]);
      /* a kicked foot's sole and toes */
      for (const t of [`${sd}ToeBase`, `${sd}Toe_End`]) if (JI[t] !== undefined) S.push([new Vector3().setFromMatrixPosition(Wd(t)), 0.04]); }
    return S; };
  const hullPush = (P, d, L, outN, axis, S, slack, hw = 1) => {
    const e = P.clone().addScaledVector(d, L);
    for (let it = 0; it < 5; it++) { let moved = false;
      for (const u of [0.35, 0.7, 1]) { const q = P.clone().lerp(e, u); let need = -1e9;
        for (const [s, r] of S) if (Math.abs(s.y - q.y) < HULLB) need = Math.max(need, ((s.x - axis.x) * outN.x + (s.z - axis.z) * outN.z + r * HULLR) * HSEC);
        const have = (q.x - axis.x) * outN.x + (q.z - axis.z) * outN.z, def = (need - have - slack) * hw;
        if (def > 0.002) { e.addScaledVector(outN, Math.min(0.1, def / u)); moved = true; } }
      e.sub(P).setLength(L).add(P); if (!moved) break; }
    return e.sub(P).normalize(); };
  const chainsNow3 = () => {
    const qHw = new Quaternion(), qSw = new Quaternion(); Wd('Hips').decompose(new Vector3(), qHw, new Vector3()); Wd('Spine').decompose(new Vector3(), qSw, new Vector3());
    const qH = qHw.clone().multiply(qH0.clone().invert()), qS = qSw.clone().multiply(qS0.clone().invert());
    const qW = qH.clone().slerp(qS, WB), PwN = new Vector3().setFromMatrixPosition(Wd('Hips')), fwd = new Vector3(0, 0, 1).applyQuaternion(qW);
    const yaw = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.atan2(fwd.x, fwd.z)), caps = capsNow();
    const rigW = p => V(p).sub(Pw0).applyQuaternion(qW).add(PwN);
    const Pn = n => new Vector3().setFromMatrixPosition(Wd(n));
    const swingOf = (a, b) => { const r = restP[b].clone().sub(restP[a]).normalize().applyQuaternion(qW), m = Pn(b).sub(Pn(a)).normalize();
      return new Quaternion().setFromUnitVectors(r, m).multiply(qW); };
    const thighK = (sd, p) => V(p).sub(restP[`${sd}UpLeg`]).applyQuaternion(swingOf(`${sd}UpLeg`, `${sd}Leg`)).add(Pn(`${sd}UpLeg`));
    const disp = caps.map(([a, b], i) => Math.max(a.distanceTo(rigW(rest[i][0].toArray())), b.distanceTo(rigW(rest[i][1].toArray()))));
    const grown = rr => rr.map((r, i) => Math.min(CAPS[i][2], Math.max(r, 0) + GROW * disp[i]));
    const LS = HULL ? legSamples() : null;
    const res = CH.map(c => {
      const out = c.out.clone().applyQuaternion(yaw), R = rigW(c.R);
      const T = thighK('Left', c.Mid).multiplyScalar(c.w[0]).add(thighK('Right', c.Mid).multiplyScalar(c.w[1])).add(rigW(c.Mid).multiplyScalar(c.w[2]));
      let d = T.sub(R).normalize(); d = push(R, d, c.La, caps, grown(c.ra), out); d = floorClamp(R, d, c.La, out);
      const P1 = R.clone().addScaledVector(d, c.La);
      /* HULLTAPER=1 (v24.42): the hull's share by the chain's angle — full behind him (105°..255°), easing out to none at
         60°/300°; v24.41's hard cut there pushed one front-side chain out beside an unpushed neighbour, a flat panel with
         a step (the reviewer). Unset, the hard cut, as v24.41 */
      const dA = Math.abs(c.th - Math.PI), hw = !HULL ? 0 : HULLTAPER ? sstep((2 * Math.PI / 3 - dA) / (Math.PI / 4)) : (dA <= 2 * Math.PI / 3 + 1e-6 ? 1 : 0), hullOn = hw > 0;
      let dm = c.m0.clone().applyQuaternion(yaw); if (hullOn) dm = hullPush(P1, dm, c.Lm, out, PwN, LS, c.hsM || 0, hw);
      dm = push(P1, dm, c.Lm, caps, grown(c.rm), out); dm = floorClamp(P1, dm, c.Lm, out);
      const P2 = P1.clone().addScaledVector(dm, c.Lm);
      let db = c.l0.clone().applyQuaternion(yaw); if (hullOn) db = hullPush(P2, db, c.L2, out, PwN, LS, c.hsB || 0, hw);
      db = push(P2, db, c.L2, caps, grown(c.rb), out); db = floorClamp(P2, db, c.L2, out);
      if (DBG) DBG.push(`ch${Math.round(c.th * 180 / Math.PI)}° R ${R.toArray().map(x => x.toFixed(2))} T ${T.toArray().map(x => x.toFixed(2))} P1 ${P1.toArray().map(x => x.toFixed(2))} P2 ${P2.toArray().map(x => x.toFixed(2))} hem ${P2.clone().addScaledVector(db, c.L2).toArray().map(x => x.toFixed(2))}`);
      const Wa = qAlign(c.a0.clone().applyQuaternion(qW), d).multiply(qW), Wm = qAlign(c.m0.clone().applyQuaternion(Wa), dm).multiply(Wa), Wb = qAlign(c.l0.clone().applyQuaternion(Wm), db).multiply(Wm);
      return [qW.clone().invert().multiply(Wa), Wa.clone().invert().multiply(Wm), Wm.clone().invert().multiply(Wb), Wa, Wm, Wb];
    });
    res.waist = [qHw.clone().invert().multiply(qW), qW];
    return res;
  };
  /* V1TAKES (v24.42, SKIRTB=3): these takes get v24.40's own rules — the two-bone chain (the waist to the knees as ONE
     turn shared by the waist and mid bones, the knees to the hem), its angle table, its sag and its hang, the legs'
     four capsules only — so they deform exactly as v24.40's file did. The first reviewer rated v24.40 better than this
     pass's hanging rules in running and the sword lunge, where the hull flares the hem into panels */
  const V1TAKES = (process.env.V1TAKES || '').split(',').filter(Boolean);
  const TABLE1 = [[0.5, 0.5, 0], [0.7, 0.3, 0], [0.88, 0.12, 0], [0.85, 0, 0.15], [0.65, 0, 0.35], [0.45, 0.05, 0.5], [0.25, 0.25, 0.5]];
  const angW1 = th => { let d = th * 180 / Math.PI, mir = false; if (d > 180) { d = 360 - d; mir = true; }
    const i = Math.min(5, Math.floor(d / 30)), f = d / 30 - i, a = TABLE1[i], b = TABLE1[i + 1], w = a.map((x, k) => x + (b[k] - x) * f), s = w[0] + w[1] + w[2];
    const r = w.map(x => x / s); return mir ? [r[1], r[0], r[2]] : r; };
  const chainsV1 = () => {
    const qHw = new Quaternion(), qSw = new Quaternion(); Wd('Hips').decompose(new Vector3(), qHw, new Vector3()); Wd('Spine').decompose(new Vector3(), qSw, new Vector3());
    const qH = qHw.clone().multiply(qH0.clone().invert()), qS = qSw.clone().multiply(qS0.clone().invert());
    const qW = qH.clone().slerp(qS, WB), PwN = new Vector3().setFromMatrixPosition(Wd('Hips')), fwd = new Vector3(0, 0, 1).applyQuaternion(qW);
    const yaw = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), Math.atan2(fwd.x, fwd.z)), caps = capsNow();
    const rig = (n, p) => V(p).applyMatrix4(M0i[n]).applyMatrix4(Wd(n)), rigW = p => V(p).sub(Pw0).applyQuaternion(qW).add(PwN);
    /* v24.40 had the thighs' and shins' capsules only */
    const only4 = rr => rr.map((r, i) => (i < 4 ? r : 0));
    const res = CH.map(c => {
      const w = c.w1 || (c.w1 = angW1(c.th)), out = c.out.clone().applyQuaternion(yaw), R = rigW(c.R);
      let d = rig('LeftUpLeg', c.K).multiplyScalar(w[0]).add(rig('RightUpLeg', c.K).multiplyScalar(w[1])).add(rigW(c.K).multiplyScalar(w[2])).sub(R).normalize();
      const gu = 0.45 * sstep((c25 + d.y) / (c25 - c75)); if (gu > 0) d.multiplyScalar(1 - gu).add(new Vector3(0, -gu, 0)).normalize();
      d = push(R, d, c.L1, caps, only4(c.r1), out); d = floorClamp(R, d, c.L1, out);
      const S = R.clone().addScaledVector(d, c.L1), hang = S.clone().addScaledVector(c.l0.clone().applyQuaternion(yaw), c.L2);
      const gr = 0.15 + (0.9 - 0.15) * sstep((c25 + d.y) / (c25 - c75));
      const Fl = rig('LeftLeg', c.H).multiplyScalar(w[0]).add(rig('RightLeg', c.H).multiplyScalar(w[1])).add(hang.clone().multiplyScalar(w[2]));
      let d2 = Fl.multiplyScalar(1 - gr).add(hang.clone().multiplyScalar(gr)).sub(S).normalize();
      d2 = push(S, d2, c.L2, caps, only4(c.r2), out); d2 = floorClamp(S, d2, c.L2, out);
      const Wu = qAlign(c.u0.clone().applyQuaternion(qW), d).multiply(qW), Wl = qAlign(c.l0.clone().applyQuaternion(Wu), d2).multiply(Wu);
      return [qW.clone().invert().multiply(Wu), new Quaternion(), Wu.clone().invert().multiply(Wl), Wu, Wu.clone(), Wl];
    });
    res.waist = [qHw.clone().invert().multiply(qW), qW];
    return res;
  };
  let RULES1 = false;
  const chainsAt = () => (SKIRTB === 3 ? (RULES1 ? chainsV1 : chainsNow3) : chainsNow)();
  poser.pose(null, 0);
  if (HULL) { const S = legSamples(), ax = new Vector3(...JP[JI.Hips]);
    for (const c of CH) { const o = c.out, f = (P, Q) => { let w = 0; for (const u of [0.35, 0.7, 1]) { const q = V(P).lerp(V(Q), u); let need = -1e9;
        for (const [s, r] of S) if (Math.abs(s.y - q.y) < HULLB) need = Math.max(need, ((s.x - ax.x) * o.x + (s.z - ax.z) * o.z + r * HULLR) * HSEC);
        w = Math.max(w, need - ((q.x - ax.x) * o.x + (q.z - ax.z) * o.z)); } return Math.max(0, w); };
      c.hsM = f(c.Mid, c.K); c.hsB = f(c.K, c.H); }
    console.log('  hull: rest shortfall (m) mid', CH.map(c => c.hsM.toFixed(3)).join(' '), '| lower', CH.map(c => c.hsB.toFixed(3)).join(' ')); }
  const r0 = chainsAt(), turn = w => 2 * Math.acos(Math.min(1, Math.abs(w.w))) * 180 / Math.PI;
  const restTurn = Math.max(turn(r0.waist[1]), ...r0.flatMap(q => q.slice(NB, 2 * NB).map(turn)));
  if (restTurn > 0.5) throw new Error(`the rest pose bakes to a turn of ${restTurn.toFixed(2)}°`);
  /* FIT: the rotation that best carries a bone's points from rest to where his OWN file's weights put them this frame
     (Horn's quaternion method; the 4x4's top eigenvector by Jacobi), about the bone's own posed head */
  const eig4 = (N) => { const a = N.map(r => r.slice()), v = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
    for (let sw = 0; sw < 50; sw++) { let off = 0; for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) off += a[i][j] * a[i][j]; if (off < 1e-18) break;
      for (let p = 0; p < 4; p++) for (let q = p + 1; q < 4; q++) { if (Math.abs(a[p][q]) < 1e-20) continue;
        const th = (a[q][q] - a[p][p]) / (2 * a[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), sn = t * c;
        for (let k = 0; k < 4; k++) { const akp = a[k][p], akq = a[k][q]; a[k][p] = c * akp - sn * akq; a[k][q] = sn * akp + c * akq; }
        for (let k = 0; k < 4; k++) { const apk = a[p][k], aqk = a[q][k]; a[p][k] = c * apk - sn * aqk; a[q][k] = sn * apk + c * aqk; }
        for (let k = 0; k < 4; k++) { const vkp = v[k][p], vkq = v[k][q]; v[k][p] = c * vkp - sn * vkq; v[k][q] = sn * vkp + c * vkq; } } }
    let best = 0; for (let i = 1; i < 4; i++) if (a[i][i] > a[best][best]) best = i; return [v[0][best], v[1][best], v[2][best], v[3][best]]; };
  const fitRot = (P, Q, W) => { let Sxx = 0, Sxy = 0, Sxz = 0, Syx = 0, Syy = 0, Syz = 0, Szx = 0, Szy = 0, Szz = 0;
    for (let i = 0; i < P.length; i++) { const p = P[i], q = Q[i], w = W[i];
      Sxx += w * p.x * q.x; Sxy += w * p.x * q.y; Sxz += w * p.x * q.z; Syx += w * p.y * q.x; Syy += w * p.y * q.y; Syz += w * p.y * q.z; Szx += w * p.z * q.x; Szy += w * p.z * q.y; Szz += w * p.z * q.z; }
    const N = [[Sxx + Syy + Szz, Syz - Szy, Szx - Sxz, Sxy - Syx], [Syz - Szy, Sxx - Syy - Szz, Sxy + Syx, Szx + Sxz],
      [Szx - Sxz, Sxy + Syx, -Sxx + Syy - Szz, Syz + Szy], [Sxy - Syx, Szx + Sxz, Syz + Szy, -Sxx - Syy + Szz]];
    const e = eig4(N); return new Quaternion(e[1], e[2], e[3], e[0]).normalize(); };
  const SKo = joints.map(() => new Matrix4()), IBo = joints.map((_, k) => new Matrix4().fromArray(ibm, k * 16));
  const origAt = (smp, out) => { const x = new Vector3(); out.set(0, 0, 0); for (let i = 0; i < smp.a0.length; i += 2) { x.set(...smp.p).applyMatrix4(SKo[smp.a0[i]]).multiplyScalar(smp.a0[i + 1]); out.add(x); } return out; };
  const fitSamples = jb => { const all = CH.fit[jb] || []; const step = Math.max(1, Math.floor(all.length / 900)); return all.filter((_, i) => i % step === 0); };
  const fitNow = (cs) => {
    joints.forEach((j, k) => SKo[k].multiplyMatrices(poser.world[poser.NI.get(j)], IBo[k]));
    const qW = cs.waist[1], PwN = new Vector3().setFromMatrixPosition(Wd('Hips'));
    return CH.map((c, k) => {
      const R = V(c.R).sub(Pw0).applyQuaternion(qW).add(PwN), sa = fitSamples(c.ja), sb = fitSamples(c.jb);
      let Wu = cs[k][2], Wl = cs[k][3];
      if (sa.length >= 20) { const P = [], Q = [], W = []; for (const sm of sa) { P.push(V(sm.p).sub(V(c.R))); Q.push(origAt(sm, new Vector3()).sub(R)); W.push(sm.w); }
        Wu = cs[k][2].clone().slerp(fitRot(P, Q, W), FITMIX); }
      const S = R.clone().add(V(c.K).sub(V(c.R)).applyQuaternion(Wu));
      if (sb.length >= 20) { const P = [], Q = [], W = []; for (const sm of sb) { P.push(V(sm.p).sub(V(c.K))); Q.push(origAt(sm, new Vector3()).sub(S)); W.push(sm.w); }
        Wl = cs[k][3].clone().slerp(fitRot(P, Q, W), FITMIX); }
      return [qW.clone().invert().multiply(Wu), Wu.clone().invert().multiply(Wl)];
    });
  };
  const fitNow3 = (cs) => {
    joints.forEach((j, k) => SKo[k].multiplyMatrices(poser.world[poser.NI.get(j)], IBo[k]));
    const qW = cs.waist[1], PwN = new Vector3().setFromMatrixPosition(Wd('Hips'));
    const fit1 = (jset, rest0, P0) => { const sm = fitSamples(jset); if (sm.length < 20) return null; const P = [], Q = [], W = [];
      for (const s of sm) { P.push(V(s.p).sub(V(rest0))); Q.push(origAt(s, new Vector3()).sub(P0)); W.push(s.w); } return fitRot(P, Q, W); };
    return CH.map((c, k) => {
      const R = V(c.R).sub(Pw0).applyQuaternion(qW).add(PwN); let Wa = cs[k][3], Wm = cs[k][4], Wb = cs[k][5], q;
      if ((q = fit1(c.ja, c.R, R))) Wa = Wa.clone().slerp(q, FITMIX);
      const P1 = R.clone().add(V(c.Mid).sub(V(c.R)).applyQuaternion(Wa));
      if ((q = fit1(c.jm, c.Mid, P1))) Wm = Wm.clone().slerp(q, FITMIX);
      const P2 = P1.clone().add(V(c.K).sub(V(c.Mid)).applyQuaternion(Wm));
      if ((q = fit1(c.jb, c.K, P2))) Wb = Wb.clone().slerp(q, FITMIX);
      return [qW.clone().invert().multiply(Wa), Wa.clone().invert().multiply(Wm), Wm.clone().invert().multiply(Wb)];
    });
  };
  const buf = root.listBuffers()[0]; let nt = 0, nk = 0;
  for (const an of root.listAnimations()) {
    const fitThis = FITTAKES.includes(an.getName()); RULES1 = SKIRTB === 3 && V1TAKES.includes(an.getName());
    if (RULES1) console.log(`  ${an.getName()}: v24.40's rules (V1TAKES)`);
    const chR = an.listChannels().find(c => c.getTargetNode() === node('Hips') && c.getTargetPath() === 'rotation');
    const times = chR ? Array.from(chR.getSampler().getInput().getArray()) : [0, poser.duration(an)];
    const outs = CH.map(() => Array.from({ length: NB }, () => [])), prev = CH.map(() => Array(NB).fill(null)), wOut = []; let wPrev = null;
    const dbgT = (process.env.DBGAT || '').split('@'), dbgK = dbgT[0] === an.getName() ? times.reduce((b, t, i) => Math.abs(t - +dbgT[1]) < Math.abs(times[b] - +dbgT[1]) ? i : b, 0) : -1;
    for (const [ti, t] of times.entries()) { poser.pose(an, t); DBG = ti === dbgK ? [] : null; const cs = chainsAt();
      if (DBG) { console.log(`  DBG ${an.getName()} @ ${t.toFixed(2)}`); for (const l of DBG) console.log('   ', l); DBG = null; }
      const wq = cs.waist[0]; if (wPrev && wPrev.dot(wq) < 0) wq.set(-wq.x, -wq.y, -wq.z, -wq.w); wPrev = wq; wOut.push(wq.x, wq.y, wq.z, wq.w);
      const qs = fitThis ? (SKIRTB === 3 ? fitNow3 : fitNow)(cs) : cs;
      qs.forEach((q, k) => q.slice(0, NB).forEach((r, b) => { if (prev[k][b] && prev[k][b].dot(r) < 0) r.set(-r.x, -r.y, -r.z, -r.w); prev[k][b] = r; outs[k][b].push(r.x, r.y, r.z, r.w); })); }
    if (fitThis) console.log(`  ${an.getName()}: chains fitted to his own file's robe (FITMIX ${FITMIX})`);
    const inAcc = doc.createAccessor().setType('SCALAR').setArray(new Float32Array(times)).setBuffer(buf);
    { const smp = doc.createAnimationSampler().setInput(inAcc).setInterpolation('LINEAR').setOutput(doc.createAccessor().setType('VEC4').setArray(new Float32Array(wOut)).setBuffer(buf));
      an.addSampler(smp).addChannel(doc.createAnimationChannel().setTargetNode(CH.waist).setTargetPath('rotation').setSampler(smp)); }
    CH.forEach((c, k) => (NB === 3 ? [c.A, c.Mn, c.B] : [c.A, c.B]).forEach((nd, b) => {
      const smp = doc.createAnimationSampler().setInput(inAcc).setInterpolation('LINEAR')
        .setOutput(doc.createAccessor().setType('VEC4').setArray(new Float32Array(outs[k][b])).setBuffer(buf));
      an.addSampler(smp).addChannel(doc.createAnimationChannel().setTargetNode(nd).setTargetPath('rotation').setSampler(smp)); }));
    nt++; nk += times.length;
  }
  console.log(`  skirt: ${CH.length} chains baked into ${nt} takes (${nk} keys each bone); the rest pose bakes to ${restTurn.toFixed(3)}°`);
}
/* v24.45 · DRAPE's takes: the sleeve bone turned at the arm's own keys by the arm's swing alone (see DRAPE above) */
if (DR) {
  const poser = makePoser(root), Wn = nd => poser.world[poser.NI.get(nd)];
  const lsN = joints[JI.LeftShoulder], laN = joints[JI.LeftArm], lfN = joints[JI.LeftForeArm];
  const Pn = nd => new Vector3().setFromMatrixPosition(Wn(nd)), Qn = nd => { const q = new Quaternion(); Wn(nd).decompose(new Vector3(), q, new Vector3()); return q; };
  poser.pose(null, 0); const a0 = Pn(lfN).sub(Pn(laN)).normalize(), qLS0 = Qn(lsN);
  /* [the bone's local turn, its world turn]: the shoulder's turn since rest, then the swing from the arm's rest direction
     so carried to the arm's direction now */
  const sleeveAt = () => { const qLS = Qn(lsN), qc = qLS.clone().multiply(qLS0.clone().invert()), r = a0.clone().applyQuaternion(qc), m = Pn(lfN).sub(Pn(laN)).normalize();
    const R = new Quaternion().setFromUnitVectors(r, m).multiply(qc); return [qLS.clone().invert().multiply(R), R, m, qLS]; };
  /* DRAPEHANG: the band's side of the arm at rest (from the arm's axis to the band's middle) and its rest angle round the
     arm from "down" (the world's down less its part along the arm); posed, the band's side as the swing carries it is
     turned about the arm toward that same angle from the posed "down" — continuous from key to key, at most HANGMAX,
     by DRAPEHANG, faded out as the arm nears vertical (L, the sine of its angle off vertical, under HANGL0 + HANGLW) */
  let h0 = null, phi0 = 0; const HM = HANGMAX * Math.PI / 180;
  if (DR.hnode) { const c = new Vector3(...DR.c0).sub(Pn(laN)); h0 = c.addScaledVector(a0, -c.dot(a0)).normalize();
    const dp0 = new Vector3(0, -1, 0).addScaledVector(a0, a0.y).normalize(); phi0 = Math.atan2(dp0.clone().cross(h0).dot(a0), dp0.dot(h0)); }
  const hangAt = (R, m, prevTh) => { const dp = new Vector3(0, -1, 0).addScaledVector(m, m.y), L = dp.length(); if (L < 1e-6) return [R.clone(), prevTh, 0];
    dp.divideScalar(L); const h = h0.clone().applyQuaternion(R), ht = dp.applyAxisAngle(m, phi0);
    let th = Math.atan2(h.clone().cross(ht).dot(m), h.dot(ht));
    if (prevTh !== null) { while (th - prevTh > Math.PI) th -= 2 * Math.PI; while (th - prevTh < -Math.PI) th += 2 * Math.PI; }
    const thc = Math.max(-HM, Math.min(HM, th)) * DRAPEHANG * sstep((L - HANGL0) / HANGLW);
    return [new Quaternion().setFromAxisAngle(m, thc).multiply(R), th, thc]; };
  const [, R0, m0] = sleeveAt(), restTurnD = 2 * Math.acos(Math.min(1, Math.abs(R0.w))) * 180 / Math.PI;
  if (restTurnD > 0.01) throw new Error(`DRAPE: the rest pose bakes to a turn of ${restTurnD.toFixed(3)}°`);
  let restHangD = 0; if (DR.hnode) { const [Rh0] = hangAt(R0, m0, null); restHangD = 2 * Math.acos(Math.min(1, Math.abs(Rh0.w))) * 180 / Math.PI;
    if (restHangD > 0.01) throw new Error(`DRAPEHANG: the rest pose bakes to a turn of ${restHangD.toFixed(3)}°`); }
  const buf = root.listBuffers()[0]; let nt = 0, nk = 0, hangMaxD = 0; const hangTake = [];
  const track = (node, times, out) => { const smp = doc.createAnimationSampler().setInput(doc.createAccessor().setType('SCALAR').setArray(new Float32Array(times)).setBuffer(buf)).setInterpolation('LINEAR')
      .setOutput(doc.createAccessor().setType('VEC4').setArray(new Float32Array(out)).setBuffer(buf));
    return [smp, doc.createAnimationChannel().setTargetNode(node).setTargetPath('rotation').setSampler(smp)]; };
  for (const an of root.listAnimations()) {
    const chA = an.listChannels().find(c => c.getTargetNode() === laN && c.getTargetPath() === 'rotation');
    const times = chA ? Array.from(chA.getSampler().getInput().getArray()) : [0, poser.duration(an)];
    const out = [], outH = []; let prev = null, prevH = null, prevTh = null, tkMax = 0;
    for (const t of times) { poser.pose(an, t); const [l, R, m, qLS] = sleeveAt(); if (prev && prev.dot(l) < 0) l.set(-l.x, -l.y, -l.z, -l.w); prev = l; out.push(l.x, l.y, l.z, l.w);
      if (DR.hnode) { const [Rh, th, thc] = hangAt(R, m, prevTh); prevTh = th; tkMax = Math.max(tkMax, Math.abs(thc));
        const lh = qLS.clone().invert().multiply(Rh); if (prevH && prevH.dot(lh) < 0) lh.set(-lh.x, -lh.y, -lh.z, -lh.w); prevH = lh; outH.push(lh.x, lh.y, lh.z, lh.w); } }
    const [smp, ch] = track(DR.node, times, out); an.addSampler(smp).addChannel(ch); nt++; nk += times.length;
    if (DR.hnode) { const [smpH, chH] = track(DR.hnode, times, outH); an.addSampler(smpH).addChannel(chH); hangMaxD = Math.max(hangMaxD, tkMax * 180 / Math.PI); hangTake.push(`${an.getName()} ${(tkMax * 180 / Math.PI).toFixed(0)}°`); }
  }
  console.log(`  drape: the sleeve bone baked into ${nt} takes (${nk} keys; the arm's swing, never its twist); the rest pose bakes to ${restTurnD.toFixed(3)}°`);
  if (DR.hnode) console.log(`  drape hang: the band's bone baked too (rest ${restHangD.toFixed(3)}°); its largest turn round the arm per take: ${hangTake.join(', ')}`);
}
if (PREVIEW) { for (const m of root.listMaterials()) m.setBaseColorTexture(null).setBaseColorFactor([1, 1, 1, 1]); await io.write(PREVIEW, doc); console.log('preview', PREVIEW); }
else { await io.write(OUT, doc); console.log('wrote', OUT); }
