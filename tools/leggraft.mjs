// v24.47 · GRANDMASTER PHO'S LEGS: REAL KNEES AND THIGHS UNDER HIS ROBE. Chad, 4 Nov 2026, after the hem's streaks walking
// and the severed shins of v24.46's cut ("Seriously zoom in and look at the mess ... Option 2 and look D"): his scan has no
// leg between mid-shin and the hip, so wherever a shin leaves the robe the cloth must either stretch after it (the streaks
// and strips) or the shin ends in the air (a stump). Real legs go under the robe instead, from another of the game's
// character scans on the same kind of skeleton: the admin-tee man's (Chad's own model, bare from mid-thigh down; he lends
// only legs hidden under a robe and is never seen as himself). Two stages, either side of tools/robeskin.mjs:
//   node tools/leggraft.mjs bones <his file.glb> <out.glb>              the new bones and every take solved for them
//   (JOG=<take>: that take's running made a jog first, at Chad's pick "Calmer running")
//   (tools/robeskin.mjs on that, with HEMRING=0 — no ring of the robe rides a shin — and LEGRIG=1: the robe follows and
//    makes room for these legs, not his rig's)
//   node tools/leggraft.mjs mesh <robe.glb> <donor.glb> <out.glb>       the cut, the donor's legs, their skin
//   then tools/robeshell.mjs (the robe below his waist one layer), tools/robesim.mjs (that robe as cloth round these legs)
//   and tools/prepmonk.mjs. <donor.glb>:
//   tools/deflatten.mjs of the donor's scan (masters/v24.47/make.sh).
//
// THE KNEE (measured, masters/v24.47/PLAN.md): his rig's knee joints sit at the front of the robe, 14–16 cm in front of
// the line of his visible shins (which stand within 5 degrees of upright over his ankles); a real knee skinned there pokes
// through the robe, and one placed where a knee belongs tears when the rig bends about the other point (an anatomical knee
// carried by his shin bone strays 27–45 cm from the hip in walking). So the new legs ride NEW bones beside his — a thigh
// from his hip joint and a shin from a knee on his shin's own axis at knee height — and EVERY TAKE is solved for them,
// frame by frame, to reach his ankle exactly where his own leg puts it: two bones, the knee in the plane his own knee bends
// in, the twist his own bones give. His rig is 4 cm longer than a straight real leg (his knee is bent 35 degrees at rest),
// so where a take straightens his leg the new thigh's top slides down the leg instead, up to that much, inside the robe
// where it is never seen (a soft limit, SOFT, so the knee never snaps straight). His own bones, his feet, every robe point
// and every take's own tracks are untouched: the robe moves exactly as reviewed.
//
// WHAT IT DOES TO THE MESH (every point that existed keeps its place and attributes; his shins' points change bone only):
//   1. His shins are cut by a plane square to each shin's axis at CUTY: every triangle joining the robe's skirt to a shin
//      (the scan's join, the streaks) and every shin triangle above the plane (the ragged top) taken out, the triangles it
//      crosses clipped at it, so each shin ends in a clean ring. His shins' points ride the new shin bone (from his LeftLeg /
//      RightLeg); their foot weights stay.
//   2. The openings the join leaves in the robe's underside are capped in ONE texel of the robe's own colour (as
//      tools/hemcut.mjs does), so nothing is seen through it from below — each cap in CAPRINGS rings, so where the cloth
//      bends a cap it is a smooth dish (a fan of long thin triangles showed as a grey star when he sits).
//   3. The donor's legs are carried from his rest pose onto these bones, bone by bone (his thigh onto the new thigh, his
//      shin onto the new shin's axis, lengths matched, the girth scaled to Pho's shin at the cut and, over the last CONFORM
//      metres, shaped angle by angle to the ring of Pho's shin), cut BAND above Pho's ring and below his shorts (TOPY), each
//      thigh carried on from there toward the hip THIGHEXT metres in one texel of his skin (widening by THIGHTOP) and
//      capped (a flat top 10 cm above the knee showed as a cut-off leg when a running knee lifted the robe), and joined to
//      Pho's ring by a band of triangles. They ride the new bones by the donor's own weights.
//   4. Their skin is painted into free squares of Pho's colour sheet: each leg unwrapped round its axis in six pieces (front
//      and back, three heights), painted from the donor's own sheet, its colour matched to Pho's shin (the mean and spread of
//      each channel in Lab), and the first FEATHER metres above the join fading from the colour of Pho's own ring, so no line
//      shows at the join. The normal sheet is flat under the pieces (the shape of the knee is in the triangles).
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { Matrix4, Vector3, Quaternion } from 'three';
import sharp from 'sharp';
import { makePoser } from './gltfpose.mjs';

const MODE = process.argv[2], [IN, DONOR, OUT] = MODE === 'bones' ? [process.argv[3], null, process.argv[4]] : [process.argv[3], process.argv[4], process.argv[5]];
if (!['bones', 'mesh'].includes(MODE) || !IN || !OUT || (MODE === 'mesh' && !DONOR)) { console.error('usage: node tools/leggraft.mjs bones <his file.glb> <out.glb>\n       node tools/leggraft.mjs mesh <robe.glb> <donor.glb> <out.glb>'); process.exit(1); }
const E = (k, d) => (process.env[k] !== undefined ? Number(process.env[k]) : d);
const CUTY = E('CUTY', 0.17);        // the height of the cut across each shin (the plane is square to the shin's axis)
const KNEEY = E('KNEEY', 0.50);      // the new knee: on the shin's axis at this height
const BAND = E('BAND', 0.015);       // the join: the donor's leg starts this far above Pho's ring
const TOPY = E('TOPY', 0.60);        // the donor's thigh ends at this height (under his shorts' hem), capped
const CAPRINGS = Math.max(1, Math.round(E('CAPRINGS', 4)));   // rings in each cap of the robe's openings (1: a fan)
/* the donor's thigh carried on toward the hip THIGHEXT metres, widening by THIGHTOP: 0.17 m widening 10 % poked through a
   fold of the robe near the hip in one cast take; 0.11 m and 0.13 m, unwidened, did not, and 0.11 hid the cut as well */
const THIGHEXT = E('THIGHEXT', 0.11), THIGHTOP = E('THIGHTOP', 1.0);
const SOFT = E('SOFT', 0.02);        // the soft limit of the new leg's reach (metres before straight)
const CONFORM = E('CONFORM', 0.06);  // the donor's shin shaped to Pho's ring over this length above the join
const GIRTH = E('GIRTH', 1.06), GFADE = E('GFADE', 0.12);   // the donor's leg scaled round its axis to Pho's shin at the join, fading over GFADE to GIRTH (his knees and thighs keep their own shape)
const FEATHER = E('FEATHER', 0.035); // the donor's skin fades in from Pho's ring's colour over this length
const DEN = E('DEN', 2500);          // texels per metre of the pieces at the shin and knee (Pho's shin: 2,500 on his 8192 sheet)
const DENUP = E('DENUP', 1600);      // ... and of the top piece
const VB1 = E('VB1', 0.15), VB2 = E('VB2', 0.30);   // the pieces' heights: [0, VB1), [VB1, VB2), [VB2, top] metres from the cut
const RREF = E('RREF', 0.052);       // the unwrap's radius (u = angle x RREF)
const MARGIN = E('MARGIN', 24);      // texels round every piece (the sheet is halved at prep: 12 there)
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(IN), root = doc.getRoot();
const droot = MODE === 'mesh' ? (await io.read(DONOR)).getRoot() : null;
const log = (...a) => console.log(...a);
const SIDES = ['Left', 'Right'];

/* ------------------------------------------------------------------ helpers */
const V3 = (x, y, z) => new Vector3(x, y, z);
const posOf = m => new Vector3().setFromMatrixPosition(m);
const quatOf = m => { const q = new Quaternion(), p = new Vector3(), s = new Vector3(); m.decompose(p, q, s); return q; };
const basis = (Y, F = V3(0, 0, 1)) => { const y = Y.clone().normalize(); let x = new Vector3().crossVectors(y, F); if (x.length() < 1e-6) x = V3(1, 0, 0); x.normalize();
  return { x, y, z: new Vector3().crossVectors(x, y).normalize() }; };
const toLocal = (p, o, b) => { const d = p.clone().sub(o); return V3(d.dot(b.x), d.dot(b.y), d.dot(b.z)); };
const fromLocal = (q, o, b) => o.clone().addScaledVector(b.x, q.x).addScaledVector(b.y, q.y).addScaledVector(b.z, q.z);
const frameMatrix = (o, b) => new Matrix4().makeBasis(b.x, b.y, b.z).setPosition(o);
const sstep = x => { const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t); };
const rigOf = (rt, label) => { const meshes = rt.listMeshes(); if (meshes.length !== 1 || meshes[0].listPrimitives().length !== 1) throw new Error(`leggraft: ${label} must be one mesh with one primitive`);
  const prim = meshes[0].listPrimitives()[0], skin = rt.listSkins()[0], joints = skin.listJoints(), names = joints.map(j => j.getName().replace(/^mixamorig:?/, ''));
  const IB = joints.map((_, k) => new Matrix4().fromArray(skin.getInverseBindMatrices().getArray(), k * 16)), BW = IB.map(m => m.clone().invert());
  const ji = x => { const k = names.indexOf(x); if (k < 0) throw new Error(`leggraft: ${label} has no joint ${x}`); return k; };
  return { prim, skin, joints, names, IB, BW, ji }; };
/* every attribute of a primitive as plain arrays (weights as floats, whatever their storage) */
const readPrim = prim => { const A = s => prim.getAttribute(s), n = A('POSITION').getCount(), out = { n };
  const take = (s, w) => { const acc = A(s); if (!acc) return null; const arr = new Float64Array(n * w), e = new Array(w).fill(0); for (let i = 0; i < n; i++) { acc.getElement(i, e); for (let k = 0; k < w; k++) arr[i * w + k] = e[k]; } return arr; };
  out.P = take('POSITION', 3); out.N = take('NORMAL', 3); out.UV = take('TEXCOORD_0', 2); out.TG = take('TANGENT', 4); out.J = take('JOINTS_0', 4); out.W = take('WEIGHTS_0', 4);
  out.I = Array.from(prim.getIndices().getArray()); return out; };
const sheetOf = async tex => { const { data, info } = await sharp(Buffer.from(tex.getImage())).ensureAlpha().raw().toBuffer({ resolveWithObject: true }); return { px: data, w: info.width, h: info.height }; };
const sample = (sh, u, v) => { const x = u * sh.w - 0.5, y = v * sh.h - 0.5, x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0, out = [0, 0, 0];
  for (const [dx, dy, w] of [[0, 0, (1 - fx) * (1 - fy)], [1, 0, fx * (1 - fy)], [0, 1, (1 - fx) * fy], [1, 1, fx * fy]]) {
    const X = Math.min(sh.w - 1, Math.max(0, x0 + dx)), Y = Math.min(sh.h - 1, Math.max(0, y0 + dy)), o = (Y * sh.w + X) * 4;
    out[0] += w * sh.px[o]; out[1] += w * sh.px[o + 1]; out[2] += w * sh.px[o + 2]; } return out; };
/* sRGB <-> Lab (D65) */
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }, unlin = c => 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const toLab = ([r, g, b]) => { const R = lin(r), G = lin(g), B = lin(b); const X = (0.4124 * R + 0.3576 * G + 0.1805 * B) / 0.95047, Y = 0.2126 * R + 0.7152 * G + 0.0722 * B, Z = (0.0193 * R + 0.1192 * G + 0.9505 * B) / 1.08883;
  const f = t => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116; const fx = f(X), fy = f(Y), fz = f(Z); return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)]; };
const fromLab = ([L, a, b]) => { const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200, g = t => t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787;
  const X = g(fx) * 0.95047, Y = g(fy), Z = g(fz) * 1.08883; const R = 3.2406 * X - 1.5372 * Y - 0.4986 * Z, G = -0.9689 * X + 1.8758 * Y + 0.0415 * Z, B = 0.0557 * X - 0.2040 * Y + 1.0570 * Z;
  return [R, G, B].map(c => Math.max(0, Math.min(255, unlin(Math.max(0, c))))); };
const stats = cols => { const L = cols.map(toLab), m = [0, 1, 2].map(k => L.reduce((s, c) => s + c[k], 0) / L.length); return { m, s: [0, 1, 2].map(k => Math.sqrt(L.reduce((s, c) => s + (c[k] - m[k]) ** 2, 0) / L.length)) }; };

/* ------------------------------------------------------------------ Pho */
const R = rigOf(root, 'the robe file'), G0 = readPrim(R.prim), n0 = G0.n;
const { joints, names, IB, BW, ji, skin } = R;
const jHips = ji('Hips');
const isSk = names.map(x => /^Skirt/.test(x));
const legJ = s => new Set([`${s}Leg`, `${s}Foot`, `${s}ToeBase`, `${s}Toe_End`].filter(x => names.includes(x)).map(ji));
const LEGJ = { Left: legJ('Left'), Right: legJ('Right') };
const wsum = (G, i, set) => { let s = 0; for (let k = 0; k < 4; k++) if (G.W[i * 4 + k] > 0 && set.has(G.J[i * 4 + k])) s += G.W[i * 4 + k]; return s; };
const skirtW = i => { let s = 0; for (let k = 0; k < 4; k++) if (isSk[G0.J[i * 4 + k]]) s += G0.W[i * 4 + k]; return s; };
const P0 = i => V3(G0.P[3 * i], G0.P[3 * i + 1], G0.P[3 * i + 2]);
/* welded positions (the scan's seam copies) and each one's class: 1 the skirt, 2 a shin of side s, 0 anything else */
const gid = new Int32Array(n0), gmap = new Map(); let NG = 0;
for (let i = 0; i < n0; i++) { const k = `${Math.round(G0.P[3 * i] * 1e5)},${Math.round(G0.P[3 * i + 1] * 1e5)},${Math.round(G0.P[3 * i + 2] * 1e5)}`; let g = gmap.get(k); if (g === undefined) { g = NG++; gmap.set(k, g); } gid[i] = g; }
const cls = new Int8Array(NG), gside = new Array(NG).fill(null);
for (let i = 0; i < n0; i++) { const l = wsum(G0, i, LEGJ.Left), r = wsum(G0, i, LEGJ.Right), sk = skirtW(i);
  if (sk >= 0.5) cls[gid[i]] = 1; else if (l >= 0.5 || r >= 0.5) { cls[gid[i]] = 2; gside[gid[i]] = l >= r ? 'Left' : 'Right'; } }

/* each shin's axis: the centres of its 1 cm slices, full rings only, from just above the ankle to the cut */
const AX = {};
for (const s of SIDES) { const sl = new Map();
  for (let i = 0; i < n0; i++) { if (cls[gid[i]] !== 2 || gside[gid[i]] !== s) continue; const y = G0.P[3 * i + 1]; if (y < 0.12 || y > CUTY + 0.01) continue;
    const b = Math.floor(y / 0.01); if (!sl.has(b)) sl.set(b, []); sl.get(b).push([G0.P[3 * i], G0.P[3 * i + 2]]); }
  const rows = [...sl].map(([b, pts]) => { const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cz = pts.reduce((a, p) => a + p[1], 0) / pts.length;
    return { y: (b + 0.5) * 0.01, n: pts.length, cx, cz, rmax: Math.max(...pts.map(p => Math.hypot(p[0] - cx, p[1] - cz))) }; }).filter(r => r.n >= 60 && r.rmax < 0.07).sort((a, b) => a.y - b.y);
  if (rows.length < 3) throw new Error(`leggraft: too few full slices of the ${s} shin under the cut (${rows.length})`);
  const my = rows.reduce((a, r) => a + r.y, 0) / rows.length, mx = rows.reduce((a, r) => a + r.cx, 0) / rows.length, mz = rows.reduce((a, r) => a + r.cz, 0) / rows.length;
  const syy = rows.reduce((a, r) => a + (r.y - my) ** 2, 0), bx = rows.reduce((a, r) => a + (r.y - my) * (r.cx - mx), 0) / syy, bz = rows.reduce((a, r) => a + (r.y - my) * (r.cz - mz), 0) / syy;
  const at = y => V3(mx + bx * (y - my), y, mz + bz * (y - my)), a = V3(bx, 1, bz).normalize();
  AX[s] = { a, O: at(CUTY), K1: at(KNEEY), rows };
  log(`${s} shin: axis from ${rows.length} slices ${rows[0].y.toFixed(3)}–${rows[rows.length - 1].y.toFixed(3)} m, ${(Math.atan(bz) * 180 / Math.PI).toFixed(1)}° forward, ${(Math.atan(bx) * 180 / Math.PI).toFixed(1)}° sideways; the cut's middle ${AX[s].O.toArray().map(x => x.toFixed(3))}, the new knee ${AX[s].K1.toArray().map(x => x.toFixed(3))}`); }
const dPlane = (s, p) => p.clone().sub(AX[s].O).dot(AX[s].a);   // > 0: above the cut (toward the knee)

/* ------------------------------------------------------------------ the new bones */
const hipsNode = joints[jHips], buf = root.listBuffers()[0];
const poser = makePoser(root);
poser.pose(null, 0); const hipsRest = poser.world[poser.NI.get(hipsNode)].clone();
{ const hb = BW[jHips], d = posOf(hipsRest).distanceTo(posOf(hb)), q = quatOf(hipsRest).angleTo(quatOf(hb)) * 180 / Math.PI; log(`his hips at rest against their bind: ${(d * 1000).toFixed(2)} mm, ${q.toFixed(3)}°`); }
const GR = {};
if (MODE === 'mesh') {
  /* the bones the first stage made, read back: their places at rest are the knees and hips the mesh is fitted to */
  for (const s of SIDES) { const jU = ji(`${s}LegGraftUp`), jL = ji(`${s}LegGraftLow`), H = posOf(BW[jU]), K1 = posOf(BW[jL]), A = posOf(BW[ji(`${s}Foot`)]);
    /* the shin's axis the bones were made on (kept on the shin bone: his own file has a few robe points riding a shin near
       the cut, which move a fit by millimetres), so the mesh is cut and fitted on the very line the takes were solved for */
    const ex = (joints[jL].getExtras() || {}).leggraft; if (!ex) throw new Error(`leggraft: the ${s} new shin bone carries no axis (made by an older leggraft?)`);
    if (Math.abs(ex.CUTY - CUTY) > 1e-9 || Math.abs(ex.KNEEY - KNEEY) > 1e-9) throw new Error(`leggraft: the bones were made with CUTY ${ex.CUTY} KNEEY ${ex.KNEEY}, not ${CUTY} ${KNEEY}`);
    log(`${s} shin: the axis of the bones' stage (${(V3(...ex.a).angleTo(AX[s].a) * 180 / Math.PI).toFixed(2)}° and ${(V3(...ex.O).distanceTo(AX[s].O) * 1000).toFixed(1)} mm from this file's own fit)`);
    AX[s] = { ...AX[s], a: V3(...ex.a), O: V3(...ex.O), K1: V3(...ex.K1) };
    if (K1.distanceTo(AX[s].K1) > 1e-4) throw new Error(`leggraft: the ${s} new knee is not where its bone stands`);
    GR[s] = { H, A, K1, L1: K1.distanceTo(H), L2: A.distanceTo(K1), jU, jL, up: joints[jU], low: joints[jL] };
    log(`${s} leg: the new bones (joints ${jU}, ${jL}): hip ${H.toArray().map(x => x.toFixed(3))}, knee ${K1.toArray().map(x => x.toFixed(3))}; thigh ${GR[s].L1.toFixed(3)}, shin ${GR[s].L2.toFixed(3)}`); }
} else {
for (const s of SIDES) { const H = posOf(BW[ji(`${s}UpLeg`)]), A = posOf(BW[ji(`${s}Foot`)]), K0 = posOf(BW[ji(`${s}Leg`)]), K1 = AX[s].K1;
  const L1 = K1.distanceTo(H), L2 = A.distanceTo(K1), bU = basis(K1.clone().sub(H)), bL = basis(A.clone().sub(K1));
  const BU = frameMatrix(H, bU), BL = frameMatrix(K1, bL);
  const up = doc.createNode(`${s}LegGraftUp`), low = doc.createNode(`${s}LegGraftLow`).setExtras({ leggraft: { a: AX[s].a.toArray(), O: AX[s].O.toArray(), K1: K1.toArray(), CUTY, KNEEY } });
  const lu = hipsRest.clone().invert().multiply(BU), ll = BU.clone().invert().multiply(BL);
  up.setTranslation(posOf(lu).toArray()).setRotation(quatOf(lu).toArray()); low.setTranslation(posOf(ll).toArray()).setRotation(quatOf(ll).toArray());
  hipsNode.addChild(up); up.addChild(low);
  const jU = skin.listJoints().length; skin.addJoint(up); const jL = skin.listJoints().length; skin.addJoint(low);
  GR[s] = { H, A, K0, K1, L1, L2, BU, BL, up, low, jU, jL, v1: K1.clone().sub(H).normalize(), u1: A.clone().sub(K1).normalize() };
  log(`${s} leg: hip ${H.toArray().map(x => x.toFixed(3))}, his rig's knee ${K0.toArray().map(x => x.toFixed(3))} (${K0.distanceTo(K1).toFixed(3)} m from the new one), ankle ${A.toArray().map(x => x.toFixed(3))}; thigh ${L1.toFixed(3)} + shin ${L2.toFixed(3)} = ${(L1 + L2).toFixed(3)} m against his rig's ${(K0.distanceTo(H) + A.distanceTo(K0)).toFixed(3)} (hip to ankle at rest ${A.distanceTo(H).toFixed(3)}); joints ${jU}, ${jL}`); }
{ const ib = Array.from(skin.getInverseBindMatrices().getArray()); for (const s of SIDES) for (const B of [GR[s].BU, GR[s].BL]) ib.push(...B.clone().invert().elements);
  skin.getInverseBindMatrices().setArray(new Float32Array(ib)); }

/* JOG=<take>,...: that take's running made a jog, before anything is solved for it (Chad, 4 Nov 2026, his pick "Calmer
   running": his running changed to a jog with a lower back heel, so his calf never sweeps through the back of the robe).
   His take is a sprint (the thigh swung from 72° in front to 33° behind, the heel kicked up to 0.79 m, 0.55 m behind his
   hips); easing his knee alone left the heel 0.43 m up and 0.54 m behind, so the PATH of each ankle is remade and his
   leg solved to it: its distance in front of or behind his hips scaled by JOGSTRIDE (shorter steps, so he runs that much
   slower over the ground); its lift off its lowest made JOGLIFT of what it was, and less again the further behind his
   hips it is (from JOGBACK1 metres behind down to JOGBACKLIFT of it at JOGBACK2), so a heel behind him stays low; his
   thigh and shin solved to it in his own knee's bending plane (lengths held, the reach softened as the solver below);
   his foot turned back toward its flat stance as its lift was taken. His hips, his toes' own turn and every other bone as
   they were. Unset, nothing here runs. */
const JOGSTRIDE = E('JOGSTRIDE', 0.55), JOGLIFT = E('JOGLIFT', 0.6), JOGBACK1 = E('JOGBACK1', 0.06), JOGBACK2 = E('JOGBACK2', 0.20), JOGBACKLIFT = E('JOGBACKLIFT', 0.25);
for (const take of (process.env.JOG || '').split(',').filter(Boolean)) { const an = root.listAnimations().find(z => z.getName() === take); if (!an) throw new Error(`leggraft: JOG: no take ${take}`);
  const pz = makePoser(root);
  for (const s of SIDES) { const [nU, nL, nF] = ['UpLeg', 'Leg', 'Foot'].map(x => joints[ji(`${s}${x}`)]);
    const chs = [nU, nL, nF].map(nd => an.listChannels().find(c => c.getTargetNode() === nd && c.getTargetPath() === 'rotation'));
    if (chs.some(c => !c || c.getSampler().getInterpolation() !== 'LINEAR')) throw new Error(`leggraft: JOG: ${take} lacks a linear ${s} leg turn`);
    const tset = new Set(); for (const c of chs) for (const t of c.getSampler().getInput().getArray()) tset.add(+t.toFixed(5)); const times = [...tset].sort((x, y) => x - y);
    const pose = t => { pz.pose(an, t); const Wm = nd => pz.world[pz.NI.get(nd)]; return { H: Wm(joints[jHips]).clone(), U: Wm(nU).clone(), K: Wm(nL).clone(), A: Wm(nF).clone() }; };
    const fr = times.map(pose), floor = Math.min(...fr.map(f => posOf(f.A).y));
    /* the foot flat: its turn in the world where it is lowest */
    const flatQ = quatOf(fr.reduce((m, f) => (posOf(f.A).y < posOf(m.A).y ? f : m)).A);
    const outU = [], outL = [], outF = []; let maxBack0 = 0, maxBack1 = 0, hi0 = 0, hi1 = 0, slid = 0, pq = [null, null, null];
    for (const f of fr) { const h = posOf(f.H), u = posOf(f.U), k = posOf(f.K), a = posOf(f.A), zr = a.z - h.z, lift = a.y - floor;
      const z2 = zr * JOGSTRIDE, behind = -z2, w = behind <= JOGBACK1 ? 1 : behind >= JOGBACK2 ? JOGBACKLIFT : 1 - (1 - JOGBACKLIFT) * sstep((behind - JOGBACK1) / (JOGBACK2 - JOGBACK1));
      const lift2 = lift * JOGLIFT * w, a2 = V3(a.x, floor + lift2, h.z + z2);
      if (-zr > 0.1) { maxBack0 = Math.max(maxBack0, a.y); } if (-z2 > 0.1) maxBack1 = Math.max(maxBack1, a2.y); hi0 = Math.max(hi0, a.y); hi1 = Math.max(hi1, a2.y);
      const L1 = k.distanceTo(u), L2 = a.distanceTo(k), D = a2.distanceTo(u), Ls = L1 + L2; let De = D, sl = 0;
      if (D > Ls - SOFT) { De = Ls - SOFT * Math.exp(-(D - (Ls - SOFT)) / SOFT); sl = D - De; } slid = Math.max(slid, sl);
      const dir = a2.clone().sub(u).normalize(), a3 = u.clone().addScaledVector(dir, De);
      const x = (L1 * L1 - L2 * L2 + De * De) / (2 * De), r = Math.sqrt(Math.max(0, L1 * L1 - x * x));
      let pv = k.clone().sub(u); pv.addScaledVector(dir, -pv.dot(dir)); if (pv.length() < 1e-6) pv = V3(0, 0, 1); pv.normalize();
      const k2 = u.clone().addScaledVector(dir, x).addScaledVector(pv, r);
      const RU = quatOf(f.U), RK = quatOf(f.K), RF = quatOf(f.A), RH = quatOf(f.H);
      const dU = new Quaternion().setFromUnitVectors(k.clone().sub(u).normalize(), k2.clone().sub(u).normalize()), RU2 = dU.clone().multiply(RU);
      const shin1 = a.clone().sub(k).normalize().applyQuaternion(dU), dK = new Quaternion().setFromUnitVectors(shin1, a3.clone().sub(k2).normalize()), RK2 = dK.clone().multiply(dU).multiply(RK);
      const RF2 = flatQ.clone().slerp(RF, lift > 1e-4 ? Math.min(1, lift2 / lift) : 1);
      const qs = [RH.clone().invert().multiply(RU2), RU2.clone().invert().multiply(RK2), RK2.clone().invert().multiply(RF2)];
      qs.forEach((q, m) => { if (pq[m] && pq[m].dot(q) < 0) q.set(-q.x, -q.y, -q.z, -q.w); pq[m] = q; });
      outU.push(qs[0].x, qs[0].y, qs[0].z, qs[0].w); outL.push(qs[1].x, qs[1].y, qs[1].z, qs[1].w); outF.push(qs[2].x, qs[2].y, qs[2].z, qs[2].w); }
    const tAcc = doc.createAccessor().setType('SCALAR').setArray(new Float32Array(times)).setBuffer(buf);
    chs.forEach((c, m) => c.getSampler().setInput(tAcc).setOutput(doc.createAccessor().setType('VEC4').setArray(new Float32Array([outU, outL, outF][m])).setBuffer(buf)));
    log(`jog: ${take} ${s} ankle — steps x${JOGSTRIDE}, lift x${JOGLIFT} (less behind him): highest ${hi0.toFixed(2)} -> ${hi1.toFixed(2)} m, highest while 10+ cm behind his hips ${maxBack0.toFixed(2)} -> ${maxBack1.toFixed(2)} m; ${times.length} keys; reach softened by at most ${(slid * 100).toFixed(1)} cm`); } }

/* every take solved for the new bones, at the keys of his own leg tracks */
const legNodes = s => new Set(['Hips', `${s}UpLeg`, `${s}Leg`, `${s}Foot`].map(x => joints[ji(x)]));
const ikStats = [];
for (const an of root.listAnimations()) { const row = { take: an.getName() };
  for (const s of SIDES) { const g = GR[s], nodes = legNodes(s), tset = new Set();
    for (const ch of an.listChannels()) if (nodes.has(ch.getTargetNode())) for (const t of ch.getSampler().getInput().getArray()) tset.add(+t.toFixed(5));
    let times = [...tset].sort((a, b) => a - b); if (!times.length) { const d = poser.duration(an); times = []; for (let t = 0; t <= d + 1e-6; t += 1 / 30) times.push(Math.min(t, d)); }
    const tU = [], rU = [], tL = [], rL = []; let maxSlide = 0, maxBend = 0, minBend = 180, prevU = null, prevL = null, constErr = 0;
    for (const t of times) { poser.pose(an, t); const W = k => poser.world[poser.NI.get(joints[k])];
      const Wh = poser.world[poser.NI.get(hipsNode)], Wu0 = W(ji(`${s}UpLeg`)), Wl0 = W(ji(`${s}Leg`)), Wf = W(ji(`${s}Foot`));
      const h = posOf(Wu0), a = posOf(Wf), k0 = posOf(Wl0);
      const Ru0 = quatOf(Wu0.clone().multiply(IB[ji(`${s}UpLeg`)])), Rl0 = quatOf(Wl0.clone().multiply(IB[ji(`${s}Leg`)]));
      const D = a.distanceTo(h), Ls = g.L1 + g.L2; let De = D, slide = 0;
      if (D > Ls - SOFT) { De = Ls - SOFT * Math.exp(-(D - (Ls - SOFT)) / SOFT); slide = D - De; }
      const u = a.clone().sub(h).normalize(), h2 = h.clone().addScaledVector(u, slide);
      const x = (g.L1 * g.L1 - g.L2 * g.L2 + De * De) / (2 * De), r = Math.sqrt(Math.max(0, g.L1 * g.L1 - x * x));
      let pv = k0.clone().sub(h2); pv.addScaledVector(u, -pv.dot(u));
      if (pv.length() < 1e-6) pv = V3(0, 0, 1).applyQuaternion(Ru0).addScaledVector(u, -V3(0, 0, 1).applyQuaternion(Ru0).dot(u));
      pv.normalize();
      const k1 = h2.clone().addScaledVector(u, x).addScaledVector(pv, r);
      const e1 = k1.clone().sub(h2).normalize(), d1 = a.clone().sub(k1).normalize();
      const Rup = new Quaternion().setFromUnitVectors(g.v1.clone().applyQuaternion(Ru0), e1).multiply(Ru0);
      const Rlow = new Quaternion().setFromUnitVectors(g.u1.clone().applyQuaternion(Rl0), d1).multiply(Rl0);
      const Mup = new Matrix4().makeTranslation(h2.x, h2.y, h2.z).multiply(new Matrix4().makeRotationFromQuaternion(Rup)).multiply(new Matrix4().makeTranslation(-g.H.x, -g.H.y, -g.H.z));
      const Mlow = new Matrix4().makeTranslation(k1.x, k1.y, k1.z).multiply(new Matrix4().makeRotationFromQuaternion(Rlow)).multiply(new Matrix4().makeTranslation(-g.K1.x, -g.K1.y, -g.K1.z));
      const Wup = Mup.clone().multiply(g.BU), Wlow = Mlow.clone().multiply(g.BL);
      const Lu = Wh.clone().invert().multiply(Wup), Ll = Wup.clone().invert().multiply(Wlow);
      let qu = quatOf(Lu), ql = quatOf(Ll);
      if (prevU && prevU.dot(qu) < 0) qu.set(-qu.x, -qu.y, -qu.z, -qu.w); if (prevL && prevL.dot(ql) < 0) ql.set(-ql.x, -ql.y, -ql.z, -ql.w); prevU = qu; prevL = ql;
      tU.push(...posOf(Lu).toArray()); rU.push(qu.x, qu.y, qu.z, qu.w); const tl = posOf(Ll); tL.push(...tl.toArray()); rL.push(ql.x, ql.y, ql.z, ql.w);
      constErr = Math.max(constErr, Math.abs(tl.length() - g.L1));
      maxSlide = Math.max(maxSlide, slide); const bend = 180 - e1.clone().negate().angleTo(d1) * 180 / Math.PI; maxBend = Math.max(maxBend, bend); minBend = Math.min(minBend, bend); }
    const tAcc = doc.createAccessor().setType('SCALAR').setArray(new Float32Array(times)).setBuffer(buf);
    for (const [node, path, arr, ty] of [[g.up, 'translation', tU, 'VEC3'], [g.up, 'rotation', rU, 'VEC4'], [g.low, 'translation', tL, 'VEC3'], [g.low, 'rotation', rL, 'VEC4']]) {
      const smp = doc.createAnimationSampler().setInput(tAcc).setInterpolation('LINEAR').setOutput(doc.createAccessor().setType(ty).setArray(new Float32Array(arr)).setBuffer(buf));
      an.addSampler(smp).addChannel(doc.createAnimationChannel().setTargetNode(node).setTargetPath(path).setSampler(smp)); }
    row[s] = `${times.length} keys, knee ${minBend.toFixed(0)}–${maxBend.toFixed(0)}°, thigh slid ≤ ${(maxSlide * 100).toFixed(1)} cm (shin length held to ${(constErr * 1000).toFixed(2)} mm)`; }
  ikStats.push(row); }
log('every take solved for the new bones (his own feet, his own knee planes):'); for (const r of ikStats) log(`  ${r.take.padEnd(28)} L ${r.Left}  |  R ${r.Right}`);
await io.write(OUT, doc); log(`leggraft bones: wrote ${OUT}`); process.exit(0);
}

/* ------------------------------------------------------------------ 1 · his shins cut at the plane */
const NV = { P: [], N: [], UV: [], TG: [], J: [], W: [] }; let nNew = 0;   // new points, appended after his
const addV = (p, nrm, uv, tg, jw) => { const top = jw.filter(x => x[1] > 0).sort((x, y) => y[1] - x[1]).slice(0, 4), sum = top.reduce((a, x) => a + x[1], 0) || 1;
  NV.P.push(p[0], p[1], p[2]); const l = Math.hypot(nrm[0], nrm[1], nrm[2]) || 1; NV.N.push(nrm[0] / l, nrm[1] / l, nrm[2] / l); NV.UV.push(uv[0], uv[1]);
  NV.TG.push(...(tg || [1, 0, 0, 1])); for (let k = 0; k < 4; k++) { NV.J.push(top[k] ? top[k][0] : 0); NV.W.push(top[k] ? top[k][1] / sum : 0); } return n0 + nNew++; };
const jwOf = i => { const o = []; for (let k = 0; k < 4; k++) if (G0.W[i * 4 + k] > 0) o.push([G0.J[i * 4 + k], G0.W[i * 4 + k]]); return o; };
/* his shins' points ride the new shin bone (his leg's own bone for them before); every other point keeps its weights */
let reweighted = 0;
for (let i = 0; i < n0; i++) { if (cls[gid[i]] !== 2) continue; const s = gside[gid[i]], jL = ji(`${s}Leg`), jU = ji(`${s}UpLeg`);
  for (let k = 0; k < 4; k++) { const j = G0.J[i * 4 + k]; if (j === jL) { G0.J[i * 4 + k] = GR[s].jL; reweighted++; } else if (j === jU) G0.J[i * 4 + k] = GR[s].jU; } }
const ek = (a, b) => a < b ? a + ',' + b : b + ',' + a;
const before = new Map(); for (let t = 0; t < G0.I.length; t += 3) for (let k = 0; k < 3; k++) { const e = ek(gid[G0.I[t + k]], gid[G0.I[t + (k + 1) % 3]]); before.set(e, (before.get(e) || 0) + 1); }
const keep = [], cutTris = [], ringEdges = { Left: [], Right: [] }; let nJoin = 0, nAbove = 0, nClip = 0;
const edgeV = new Map();
const cutPoint = (s, a, b) => { const key = a < b ? `${a},${b}` : `${b},${a}`; if (edgeV.has(key)) return edgeV.get(key);
  const pa = P0(a), pb = P0(b), da = dPlane(s, pa), db = dPlane(s, pb), t = da / (da - db), L = (A, w) => { const o = []; for (let k = 0; k < w; k++) o.push(A[a * w + k] + (A[b * w + k] - A[a * w + k]) * t); return o; };
  const jw = new Map(); for (const [j, w] of jwOf(a)) jw.set(j, (jw.get(j) || 0) + w * (1 - t)); for (const [j, w] of jwOf(b)) jw.set(j, (jw.get(j) || 0) + w * t);
  const tg = L(G0.TG, 4); tg[3] = G0.TG[a * 4 + 3]; const id = addV(L(G0.P, 3), L(G0.N, 3), L(G0.UV, 2), tg, [...jw]); edgeV.set(key, id); return id; };
for (let t = 0; t < G0.I.length; t += 3) { const v = [G0.I[t], G0.I[t + 1], G0.I[t + 2]], c = v.map(i => cls[gid[i]]);
  if (c.includes(1) && c.includes(2)) { nJoin++; continue; }
  const sd = c.every(x => x === 2) ? gside[gid[v[0]]] : null;
  if (!sd || v.some(i => gside[gid[i]] !== sd)) { keep.push(t); continue; }
  const d = v.map(i => dPlane(sd, P0(i)));
  if (d.every(x => x <= 0)) { keep.push(t); continue; }
  if (d.every(x => x > 0)) { nAbove++; continue; }
  /* clipped: the part below the plane, wound as the triangle was; the edge it leaves on the plane is the ring */
  nClip++; const poly = [], onPlane = [];
  for (let k = 0; k < 3; k++) { const a = v[k], b = v[(k + 1) % 3], da = d[k], db = d[(k + 1) % 3];
    if (da <= 0) poly.push(a); if ((da <= 0) !== (db <= 0)) { const c2 = cutPoint(sd, a, b); poly.push(c2); onPlane.push(c2); } }
  for (let k = 1; k + 1 < poly.length; k++) cutTris.push(poly[0], poly[k], poly[k + 1]);
  /* the ring's edge, oriented as the kept surface winds it (the open side faces up) */
  if (onPlane.length === 2) { const i0 = poly.indexOf(onPlane[0]), i1 = poly.indexOf(onPlane[1]); const nxt = (i0 + 1) % poly.length === i1; ringEdges[sd].push(nxt ? [onPlane[0], onPlane[1]] : [onPlane[1], onPlane[0]]); } }
log(`his shins cut at ${CUTY} m: ${nJoin} triangles joining the robe to a shin and ${nAbove} shin triangles above the cut taken out, ${nClip} clipped at it (${nNew} points on the cut); ${reweighted} of his shins' weights moved to the new shin bones`);

/* ------------------------------------------------------------------ 2 · the robe's openings capped (as tools/hemcut.mjs) */
const allP = i => i < n0 ? P0(i) : V3(NV.P[3 * (i - n0)], NV.P[3 * (i - n0) + 1], NV.P[3 * (i - n0) + 2]);
const gOf = new Map(); const gidAny = i => { if (i < n0) return gid[i]; if (gOf.has(i)) return gOf.get(i); const p = allP(i), k = `${Math.round(p.x * 1e5)},${Math.round(p.y * 1e5)},${Math.round(p.z * 1e5)}`;
  let g = gmap.get(k); if (g === undefined) { g = NG++; gmap.set(k, g); } gOf.set(i, g); return g; };
const triList = []; for (const t of keep) triList.push(G0.I[t], G0.I[t + 1], G0.I[t + 2]); triList.push(...cutTris);
const after = new Map(); for (let t = 0; t < triList.length; t += 3) for (let k = 0; k < 3; k++) { const e = ek(gidAny(triList[t + k]), gidAny(triList[t + (k + 1) % 3])); after.set(e, (after.get(e) || 0) + 1); }
const ringSet = new Set(); for (const s of SIDES) for (const [a, b] of ringEdges[s]) ringSet.add(ek(gidAny(a), gidAny(b)));
const openEdges = []; for (let t = 0; t < triList.length; t += 3) for (let k = 0; k < 3; k++) { const a = triList[t + k], b = triList[t + (k + 1) % 3], e = ek(gidAny(a), gidAny(b));
  if (after.get(e) === 1 && (before.get(e) || 0) > 1 && !ringSet.has(e)) openEdges.push([a, b]); }
const par = new Map(), find = x => { while (par.get(x) !== x) { par.set(x, par.get(par.get(x))); x = par.get(x); } return x; };
const uni = (a, b) => { for (const x of [a, b]) if (!par.has(x)) par.set(x, x); const ra = find(a), rb = find(b); if (ra !== rb) par.set(ra, rb); };
for (const [a, b] of openEdges) uni(gidAny(a), gidAny(b));
const pieces = new Map(); for (const ed of openEdges) { const r = find(gidAny(ed[0])); if (!pieces.has(r)) pieces.set(r, []); pieces.get(r).push(ed); }
const phoSheet = await sheetOf(R.prim.getMaterial().getBaseColorTexture());
const uvOf = i => i < n0 ? [G0.UV[2 * i], G0.UV[2 * i + 1]] : [NV.UV[2 * (i - n0)], NV.UV[2 * (i - n0) + 1]];
const texel = i => { const [u, v] = uvOf(i); const x = Math.min(phoSheet.w - 1, Math.max(0, Math.floor(u * phoSheet.w))), y = Math.min(phoSheet.h - 1, Math.max(0, Math.floor(v * phoSheet.h))), o = (y * phoSheet.w + x) * 4; return [phoSheet.px[o], phoSheet.px[o + 1], phoSheet.px[o + 2]]; };
const medianPoint = cand => { const cols = cand.map(texel), med = [0, 1, 2].map(k => cols.map(x => x[k]).sort((a, b) => a - b)[cols.length >> 1]);
  let bi = cand[0], bd = 1e9; cand.forEach((i, m) => { const d = (cols[m][0] - med[0]) ** 2 + (cols[m][1] - med[1]) ** 2 + (cols[m][2] - med[2]) ** 2; if (d < bd) { bd = d; bi = i; } }); return bi; };
const nrmOf = i => i < n0 ? [G0.N[3 * i], G0.N[3 * i + 1], G0.N[3 * i + 2]] : [NV.N[3 * (i - n0)], NV.N[3 * (i - n0) + 1], NV.N[3 * (i - n0) + 2]];
const jwAny = i => { if (i < n0) return jwOf(i); const o = []; for (let k = 0; k < 4; k++) if (NV.W[(i - n0) * 4 + k] > 0) o.push([NV.J[(i - n0) * 4 + k], NV.W[(i - n0) * 4 + k]]); return o; };
const capTris = [];
for (const eds of pieces.values()) { const ids = [...new Set(eds.flat())], c = ids.reduce((a, i) => a.add(allP(i)), V3(0, 0, 0)).multiplyScalar(1 / ids.length);
  if (eds.length < 3) { log(`  an opening of ${eds.length} edge(s) left open (no area to cap)`); continue; }
  const cand = []; for (let i = 0; i < n0; i++) if (cls[gid[i]] === 1 && P0(i).distanceTo(c) < 0.06) cand.push(i);
  const from = medianPoint(cand.length ? cand : ids);
  let nrm = V3(0, 0, 0); for (const [a, b] of eds) { const pa = allP(a), e = allP(b).sub(pa), r2 = pa.clone().sub(c); nrm.add(new Vector3().crossVectors(e, r2)); } nrm.normalize();
  /* the cap's points: the opening's own points moved 0.1 mm in toward its middle, all facing the cap's one way — at the very
     same place prepmonk would average their facing with the robe's round the opening (the grey fans of the first pictures) —
     and CAPRINGS rings of them on the way in to its middle, each riding a mix of its own point's bones and the middle's, so
     a cap the cloth bends is a smooth dish, not a fan of long thin triangles (the grey star of the first cloth's seated
     pictures) */
  const wm = new Map(); for (const i of ids) for (const [j, w] of jwAny(i)) wm.set(j, (wm.get(j) || 0) + w);
  const wmSum = [...wm.values()].reduce((a, b) => a + b, 0) || 1, midW = [...wm].map(([j, w]) => [j, w / wmSum]), ringAt = [];
  for (let k = 0; k < CAPRINGS; k++) { const m = new Map(), f = k / CAPRINGS;
    for (const i of ids) { const p = allP(i).lerp(c, Math.min(1, 1e-4 / Math.max(1e-6, allP(i).distanceTo(c)))).lerp(c, f), own = jwAny(i), so = own.reduce((a, x) => a + x[1], 0) || 1, mix = new Map();
      for (const [j, w] of own) mix.set(j, (mix.get(j) || 0) + (1 - f) * w / so); if (f > 0) for (const [j, w] of midW) mix.set(j, (mix.get(j) || 0) + f * w);
      m.set(i, addV(p.toArray(), nrm.toArray(), uvOf(from), null, f > 0 ? [...mix] : own)); }
    ringAt.push(m); }
  const mid = addV(c.toArray(), nrm.toArray(), uvOf(from), null, [...wm]);
  for (const [a, b] of eds) { for (let k = 0; k + 1 < CAPRINGS; k++) { const A0 = ringAt[k].get(a), B0 = ringAt[k].get(b), A1 = ringAt[k + 1].get(a), B1 = ringAt[k + 1].get(b); capTris.push(B0, A0, A1, B0, A1, B1); }
    capTris.push(ringAt[CAPRINGS - 1].get(b), ringAt[CAPRINGS - 1].get(a), mid); }
  log(`  an opening of ${eds.length} edges in the robe capped in rgb(${texel(from).map(x => Math.round(x)).join(',')}) (the median of ${cand.length} robe points within 6 cm)`); }

/* each shin's ring as a loop, its points' angle round the axis and radius */
const ringOf = s => { const nxt = new Map(); for (const [a, b] of ringEdges[s]) nxt.set(gidAny(a), [a, b]);
  const pts = []; for (const [a] of ringEdges[s]) pts.push(a); const ax = AX[s], b = basis(ax.a.clone().negate());
  const info = [...new Set(pts)].map(i => { const q = toLocal(allP(i), ax.O, b); return { i, th: Math.atan2(q.x, q.z), r: Math.hypot(q.x, q.z) }; });
  return { info, b, edges: ringEdges[s].length }; };
const RING = {}; for (const s of SIDES) { RING[s] = ringOf(s); const r = RING[s].info.map(x => x.r); log(`${s} shin's ring: ${RING[s].edges} edges, ${RING[s].info.length} points, radius ${Math.min(...r).toFixed(3)}–${Math.max(...r).toFixed(3)} (mean ${(r.reduce((a, x) => a + x, 0) / r.length).toFixed(3)})`); }
/* a ring as 72 bins of angle: its radius, and its colour on Pho's sheet */
const NB = 72, binOf = th => ((Math.floor((th + Math.PI) / (2 * Math.PI) * NB) % NB) + NB) % NB;
const circFill = arr => { for (let pass = 0; pass < NB; pass++) for (let k = 0; k < NB; k++) if (arr[k] === null) { const l = arr[(k + NB - 1) % NB], r2 = arr[(k + 1) % NB]; if (l !== null && r2 !== null) arr[k] = Array.isArray(l) ? l.map((x, m) => (x + r2[m]) / 2) : (l + r2) / 2; else if (l !== null) arr[k] = l; else if (r2 !== null) arr[k] = r2; }
  return arr.map((x, k) => { const nb = [-2, -1, 0, 1, 2].map(d => arr[(k + d + NB) % NB]); return Array.isArray(x) ? x.map((_, m) => nb.reduce((a, y) => a + y[m], 0) / 5) : nb.reduce((a, y) => a + y, 0) / 5; }); };
for (const s of SIDES) { const rb = new Array(NB).fill(null).map(() => []), cb = new Array(NB).fill(null).map(() => []);
  for (const { i, th, r } of RING[s].info) { rb[binOf(th)].push(r); cb[binOf(th)].push(texel(i)); }
  RING[s].rad = circFill(rb.map(a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null));
  RING[s].col = circFill(cb.map(a => a.length ? [0, 1, 2].map(k => a.reduce((x, y) => x + y[k], 0) / a.length) : null)); }

/* ------------------------------------------------------------------ 3 · the donor's legs, carried onto the new bones */
const D = rigOf(droot, 'the donor'), DG = readPrim(D.prim), dn = DG.n;
const DP = i => V3(DG.P[3 * i], DG.P[3 * i + 1], DG.P[3 * i + 2]);
const donSheet = await sheetOf(D.prim.getMaterial().getBaseColorTexture());
const LEG = {};
for (const s of SIDES) { const g = GR[s], Hd = posOf(D.BW[D.ji(`${s}UpLeg`)]), Kd = posOf(D.BW[D.ji(`${s}Leg`)]), Ad = posOf(D.BW[D.ji(`${s}Foot`)]);
  const jT = new Set([D.ji(`${s}UpLeg`)]), jS = new Set([D.ji(`${s}Leg`), D.ji(`${s}Foot`)]), jAll = new Set([...jT, ...jS]);
  /* the donor's shin axis, from its 1 cm slices between 8 cm above the ankle and 8 cm below the knee */
  const sl = new Map(); for (let i = 0; i < dn; i++) { if (wsum(DG, i, jS) < 0.5) continue; const y = DG.P[3 * i + 1]; if (y < Ad.y + 0.08 || y > Kd.y - 0.08) continue; const b = Math.floor(y / 0.01); if (!sl.has(b)) sl.set(b, []); sl.get(b).push([DG.P[3 * i], DG.P[3 * i + 2]]); }
  const rows = [...sl].map(([b, pts]) => ({ y: (b + 0.5) * 0.01, cx: pts.reduce((a, p) => a + p[0], 0) / pts.length, cz: pts.reduce((a, p) => a + p[1], 0) / pts.length }));
  const my = rows.reduce((a, r) => a + r.y, 0) / rows.length, mx = rows.reduce((a, r) => a + r.cx, 0) / rows.length, mz = rows.reduce((a, r) => a + r.cz, 0) / rows.length, syy = rows.reduce((a, r) => a + (r.y - my) ** 2, 0);
  const bx = rows.reduce((a, r) => a + (r.y - my) * (r.cx - mx), 0) / syy, bz = rows.reduce((a, r) => a + (r.y - my) * (r.cz - mz), 0) / syy, ad = V3(bx, 1, bz).normalize(), Kd2 = V3(mx + bx * (Kd.y - my), Kd.y, mz + bz * (Kd.y - my));
  /* the frames: thigh (hip -> knee) and shin (down its axis from the knee), on both men */
  const dT = basis(Kd.clone().sub(Hd)), dS = basis(ad.clone().negate()), pT = basis(g.K1.clone().sub(g.H)), pS = basis(AX[s].a.clone().negate());
  const sT = g.L1 / Kd.distanceTo(Hd), sS = g.L2 / Ad.distanceTo(Kd);
  const map = (p, wt, gr) => { const qt = toLocal(p, Hd, dT); qt.y *= sT; qt.x *= gr; qt.z *= gr; const qs = toLocal(p, Kd2, dS); qs.y *= sS; qs.x *= gr; qs.z *= gr;
    return fromLocal(qt, g.H, pT).multiplyScalar(wt).add(fromLocal(qs, g.K1, pS).multiplyScalar(1 - wt)); };
  const ids = [], wts = new Float64Array(dn); for (let i = 0; i < dn; i++) { const a2 = wsum(DG, i, jT), b2 = wsum(DG, i, jS); if (a2 + b2 < 0.5) continue; ids.push(i); wts[i] = a2 / (a2 + b2); }
  /* the girth: the donor's shin at Pho's cut against Pho's ring */
  let rs = []; for (const i of ids) { const q = map(DP(i), wts[i], 1); if (Math.abs(dPlane(s, q)) < 0.004) { const l = toLocal(q, AX[s].O, RING[s].b); rs.push(Math.hypot(l.x, l.z)); } }
  const rD = rs.reduce((a, x) => a + x, 0) / rs.length, rP = RING[s].info.reduce((a, x) => a + x.r, 0) / RING[s].info.length, gr = rP / rD;
  LEG[s] = { Hd, Kd, Ad, Kd2, ids, wts, map, gr, dT, dS, pT, pS, jT, jS };
  log(`${s} donor leg: ${ids.length} points; thigh x${sT.toFixed(3)}, shin x${sS.toFixed(3)} in length; girth x${gr.toFixed(3)} at the join (his shin ${rD.toFixed(3)} m round the axis at Pho's cut, Pho's ring ${rP.toFixed(3)}), fading over ${GFADE} m to x${GIRTH}`); }

/* each donor leg mapped, shaped to Pho's ring near the join, and cut between the join and the top */
const DV = { P: [], N: [], dUV: [], jw: [], th: [], v: [] }; let dNew = 0;   // the donor's kept points (and the clip's)
const donorTris = { Left: [], Right: [] }, donorBottom = { Left: [], Right: [] }, donorTop = { Left: [], Right: [] };
const vOf = (s, p) => { const ax = AX[s], g = GR[s], vk = g.K1.clone().sub(ax.O).dot(ax.a);   // the path from the cut up the shin's axis to the knee, then up the thigh
  const ds = p.clone().sub(ax.O).dot(ax.a); if (ds <= vk) return ds; return vk + p.clone().sub(g.K1).dot(g.H.clone().sub(g.K1).normalize()); };
const thOf = (s, p) => { const ax = AX[s], g = GR[s], vk = g.K1.clone().sub(ax.O).dot(ax.a), ds = p.clone().sub(ax.O).dot(ax.a);
  const o = ds <= vk ? ax.O : g.K1, b = ds <= vk ? RING[s].b : basis(g.K1.clone().sub(g.H)); const q = toLocal(p, o, b); return Math.atan2(q.x, q.z); };
for (const s of SIDES) { const L = LEG[s], g = GR[s], ax = AX[s], rb = RING[s].b, low = BAND;
  const vTop = vOf(s, (() => { const t = (g.H.y - TOPY) / (g.H.y - g.K1.y); return g.H.clone().lerp(g.K1, t); })());
  const mapped = new Map(); for (const i of L.ids) { const q1 = L.map(DP(i), L.wts[i], 1), v1 = Math.max(0, vOf(s, q1)); mapped.set(i, L.map(DP(i), L.wts[i], GIRTH + (L.gr - GIRTH) * (1 - sstep(v1 / GFADE)))); }
  /* shaped to Pho's ring: the donor's radius at its bottom, angle by angle, against Pho's ring's */
  const db = new Array(NB).fill(null).map(() => []); for (const [, q] of mapped) { const v = vOf(s, q); if (Math.abs(v - low) < 0.005) { const l = toLocal(q, ax.O, rb); db[binOf(Math.atan2(l.x, l.z))].push(Math.hypot(l.x, l.z)); } }
  const dRad = circFill(db.map(a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : null));
  for (const [i, q] of mapped) { const v = vOf(s, q); if (v > low + CONFORM || v < low - 0.02) continue; const l = toLocal(q, ax.O, rb), th = Math.atan2(l.x, l.z), k = binOf(th), f = RING[s].rad[k] / dRad[k], w = 1 - sstep((v - low) / CONFORM);
    const m = 1 + (f - 1) * w; mapped.set(i, fromLocal(V3(l.x * m, l.y, l.z * m), ax.O, rb)); }
  /* the donor's normals: carried by the same frames (the blend of the two rotations) */
  const rotT = new Matrix4().makeBasis(L.pT.x, L.pT.y, L.pT.z).multiply(new Matrix4().makeBasis(L.dT.x, L.dT.y, L.dT.z).transpose()), rotS = new Matrix4().makeBasis(L.pS.x, L.pS.y, L.pS.z).multiply(new Matrix4().makeBasis(L.dS.x, L.dS.y, L.dS.z).transpose());
  const nrmD = i => { const nn = V3(DG.N[3 * i], DG.N[3 * i + 1], DG.N[3 * i + 2]); return nn.clone().applyMatrix4(rotT).multiplyScalar(L.wts[i]).add(nn.clone().applyMatrix4(rotS).multiplyScalar(1 - L.wts[i])).normalize(); };
  /* the donor's weights onto Pho's bones: his thigh -> the new thigh, his shin -> the new shin, his foot -> Pho's foot, his hips -> Pho's hips */
  const jmap = new Map(); jmap.set(D.ji(`${s}UpLeg`), g.jU); jmap.set(D.ji(`${s}Leg`), g.jL); jmap.set(D.ji(`${s}Foot`), ji(`${s}Foot`)); jmap.set(D.ji('Hips'), jHips);
  const jwD = i => { const m = new Map(); for (let k = 0; k < 4; k++) { const w = DG.W[i * 4 + k]; if (!(w > 0)) continue; const j = jmap.get(DG.J[i * 4 + k]); if (j === undefined) continue; m.set(j, (m.get(j) || 0) + w); } return [...m]; };
  const local = new Map();   // donor index -> kept point
  const keepPt = i => { if (local.has(i)) return local.get(i); const q = mapped.get(i), nn = nrmD(i); DV.P.push(q.x, q.y, q.z); DV.N.push(nn.x, nn.y, nn.z); DV.dUV.push(DG.UV[2 * i], DG.UV[2 * i + 1]); DV.jw.push(jwD(i)); DV.th.push(thOf(s, q)); DV.v.push(vOf(s, q)); local.set(i, dNew); return dNew++; };
  const cuts = new Map();
  const cutAt = (a, b, va, vb, vc, tag) => { const key = (a < b ? `${a},${b}` : `${b},${a}`) + tag; if (cuts.has(key)) return cuts.get(key); const t = (vc - va) / (vb - va), pa = mapped.get(a), pb = mapped.get(b), q = pa.clone().lerp(pb, t);
    const na = nrmD(a), nb = nrmD(b), nn = na.lerp(nb, t).normalize(), jw = new Map(); for (const [j, w] of jwD(a)) jw.set(j, (jw.get(j) || 0) + w * (1 - t)); for (const [j, w] of jwD(b)) jw.set(j, (jw.get(j) || 0) + w * t);
    DV.P.push(q.x, q.y, q.z); DV.N.push(nn.x, nn.y, nn.z); DV.dUV.push(DG.UV[2 * a] + (DG.UV[2 * b] - DG.UV[2 * a]) * t, DG.UV[2 * a + 1] + (DG.UV[2 * b + 1] - DG.UV[2 * a + 1]) * t); DV.jw.push([...jw]); DV.th.push(thOf(s, q)); DV.v.push(vc);
    cuts.set(key, dNew); return dNew++; };
  /* clip every donor triangle of this leg to low <= v <= vTop (two planes: the join's and the top's) */
  for (let t = 0; t < DG.I.length; t += 3) { const tri = [DG.I[t], DG.I[t + 1], DG.I[t + 2]]; if (!tri.every(i => mapped.has(i))) continue;
    const vv = tri.map(i => vOf(s, mapped.get(i))); if (vv.every(x => x < low) || vv.every(x => x > vTop)) continue;
    let poly = tri.map((i, k) => ({ i, v: vv[k], src: 'pt' }));
    for (const [lim, keepAbove, tag] of [[low, true, 'b'], [vTop, false, 't']]) { const out = [], plane = [];
      for (let k = 0; k < poly.length; k++) { const A2 = poly[k], B2 = poly[(k + 1) % poly.length], inA = keepAbove ? A2.v >= lim : A2.v <= lim, inB = keepAbove ? B2.v >= lim : B2.v <= lim;
        if (inA) out.push(A2); if (inA !== inB) { /* the crossing point, between two donor points or a donor point and an earlier crossing */
          const pa = A2.src === 'pt' ? A2.i : null, pb = B2.src === 'pt' ? B2.i : null;
          let id; if (pa !== null && pb !== null) id = cutAt(pa, pb, A2.v, B2.v, lim, tag); else { /* a crossing of a clipped edge: interpolate the kept points */
            const ia = A2.src === 'pt' ? keepPt(A2.i) : A2.k, ib = B2.src === 'pt' ? keepPt(B2.i) : B2.k, tt = (lim - A2.v) / (B2.v - A2.v), key = `${Math.min(ia, ib)}:${Math.max(ia, ib)}${tag}`;
            if (cuts.has(key)) id = cuts.get(key); else { const L3 = (arr, w) => Array.from({ length: w }, (_, m) => arr[ia * w + m] + (arr[ib * w + m] - arr[ia * w + m]) * tt);
              const q = L3(DV.P, 3), nn = V3(...L3(DV.N, 3)).normalize(), jw = new Map(); for (const [j, w] of DV.jw[ia]) jw.set(j, (jw.get(j) || 0) + w * (1 - tt)); for (const [j, w] of DV.jw[ib]) jw.set(j, (jw.get(j) || 0) + w * tt);
              DV.P.push(...q); DV.N.push(nn.x, nn.y, nn.z); DV.dUV.push(...L3(DV.dUV, 2)); DV.jw.push([...jw]); DV.th.push(thOf(s, V3(...q))); DV.v.push(lim); id = dNew++; cuts.set(key, id); } }
          const C = { k: id, v: lim, src: 'new' }; out.push(C); plane.push(C); } }
      if (plane.length === 2) { const i0 = out.indexOf(plane[0]), i1 = out.indexOf(plane[1]), nxt = (i0 + 1) % out.length === i1; (tag === 'b' ? donorBottom : donorTop)[s].push(nxt ? [plane[0].k, plane[1].k] : [plane[1].k, plane[0].k]); }
      poly = out; if (poly.length < 3) break; }
    if (poly.length < 3) continue;
    const ids2 = poly.map(x => x.src === 'pt' ? keepPt(x.i) : x.k); for (let k = 1; k + 1 < ids2.length; k++) donorTris[s].push(ids2[0], ids2[k], ids2[k + 1]); }
  log(`${s} donor leg kept between ${low.toFixed(3)} and ${vTop.toFixed(3)} m up the leg from Pho's cut: ${donorTris[s].length / 3} triangles; its bottom ${donorBottom[s].length} edges, its top ${donorTop[s].length}`); }

/* ------------------------------------------------------------------ 4 · the join: Pho's ring to the donor's bottom, a band of triangles */
/* each loop in order round the axis (by angle; the edges' own order makes the walk) */
/* a loop with a gap (his scan has one tiny hole where the right shin's cut crosses it, 6 mm) is walked from the gap's end
   round to its start, and the join closes over it */
const orderLoop = (edges, keyOf) => { const nxt = new Map(), hasIn = new Set(); for (const [a, b] of edges) { nxt.set(keyOf(a), b); hasIn.add(keyOf(b)); }
  const open = edges.find(([a]) => !hasIn.has(keyOf(a))), first = open || edges[0], start = first[0], out = [start]; let cur = first[1], guard = 0;
  while (keyOf(cur) !== keyOf(start) && guard++ < 100000) { out.push(cur); const nb = nxt.get(keyOf(cur)); if (nb === undefined) break; cur = nb; }
  if (out.length < new Set(edges.flat().map(keyOf)).size) log(`  a loop walked to ${out.length} of its ${new Set(edges.flat().map(keyOf)).size} points: ${open ? 'it has more than one gap' : 'it is more than one loop'}`);
  return out; };
const bridgeTris = { Left: [], Right: [] }, bridgeInfo = {};
if (E('RINGDBG', 0)) for (const s of SIDES) { const outd = new Map(), ind = new Map(); for (const [a, b] of ringEdges[s]) { const ka = gidAny(a), kb = gidAny(b); outd.set(ka, (outd.get(ka) || 0) + 1); ind.set(kb, (ind.get(kb) || 0) + 1); }
  const keys = new Set([...outd.keys(), ...ind.keys()]); let bad = 0; for (const k of keys) if ((outd.get(k) || 0) !== 1 || (ind.get(k) || 0) !== 1) { bad++; if (bad < 12) { const i = ringEdges[s].find(e => gidAny(e[0]) === k || gidAny(e[1]) === k); const p2 = allP(i[0]); log(`  ${s} ring point ${k}: out ${outd.get(k) || 0} in ${ind.get(k) || 0} at ${p2.toArray().map(x => x.toFixed(4))}`); } }
  log(`${s} ring: ${ringEdges[s].length} edges over ${keys.size} positions; ${bad} positions not one in, one out`); }
for (const s of SIDES) {
  const pk = i => gidAny(i), dk = i => `${Math.round(DV.P[3 * i] * 1e5)},${Math.round(DV.P[3 * i + 1] * 1e5)},${Math.round(DV.P[3 * i + 2] * 1e5)}`;
  const LP = orderLoop(ringEdges[s], pk), LD = orderLoop(donorBottom[s], dk);
  const thP = i => { const q = toLocal(allP(i), AX[s].O, RING[s].b); return Math.atan2(q.x, q.z); }, thD = i => DV.th[i];
  /* both loops walked the same way round: Pho's ring is wound with its open side up, the donor's bottom with its open side down */
  const rot = arr => { let k0 = 0, best = 9; arr.forEach((x, k) => { const a = Math.abs(x.th); if (a < best) { best = a; k0 = k; } }); return arr.slice(k0).concat(arr.slice(0, k0)); };
  let A1 = rot(LP.map(i => ({ i, th: thP(i) }))), B1 = rot(LD.map(i => ({ i, th: thD(i) })));
  const dir = arr => { let s2 = 0; for (let k = 0; k < arr.length; k++) { let d = arr[(k + 1) % arr.length].th - arr[k].th; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; s2 += d; } return Math.sign(s2); };
  if (dir(A1) !== dir(B1)) B1 = [B1[0], ...B1.slice(1).reverse()];
  const sgn = dir(A1), unw = arr => { let acc = 0; return arr.map((x, k) => { if (k) { let d = x.th - arr[k - 1].th; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; acc += d; } return { ...x, a: acc * sgn }; }); };
  const A2 = unw(A1), B2 = unw(B1);
  /* zip: advance whichever loop's next point comes first round the axis */
  let ia = 0, ib = 0; const tris = [];
  const PA = k => A2[k % A2.length], PB = k => B2[k % B2.length], aA = k => k < A2.length ? A2[k].a : 2 * Math.PI + A2[k - A2.length].a, aB = k => k < B2.length ? B2[k].a : 2 * Math.PI + B2[k - B2.length].a;
  while (ia < A2.length || ib < B2.length) { const advA = ib >= B2.length || (ia < A2.length && aA(ia + 1) <= aB(ib + 1));
    if (advA) { tris.push(['P', PA(ia).i], ['P', PA(ia + 1).i], ['D', PB(ib).i]); ia++; } else { tris.push(['P', PA(ia).i], ['D', PB(ib + 1).i], ['D', PB(ib).i]); ib++; } }
  /* wound to face out from the leg's axis (the band's triangles, their normals against the way out from the axis) */
  const pOf = ([k, i]) => k === 'D' ? V3(DV.P[3 * i], DV.P[3 * i + 1], DV.P[3 * i + 2]) : allP(i); let out = 0;
  for (let t = 0; t < tris.length; t += 3) { const [a, b, c] = [tris[t], tris[t + 1], tris[t + 2]].map(pOf), nn = new Vector3().crossVectors(b.clone().sub(a), c.clone().sub(a)), m = a.clone().add(b).add(c).multiplyScalar(1 / 3);
    const rad = m.clone().sub(AX[s].O); rad.addScaledVector(AX[s].a, -rad.dot(AX[s].a)); out += Math.sign(nn.dot(rad)); }
  if (out < 0) for (let t = 0; t < tris.length; t += 3) { const x = tris[t + 1]; tris[t + 1] = tris[t + 2]; tris[t + 2] = x; }
  bridgeTris[s] = tris; bridgeInfo[s] = { nP: A2.length, nD: B2.length, sgn }; log(`${s} join: Pho's ring ${A2.length} points, the donor's bottom ${B2.length}; ${tris.length / 3} triangles${out < 0 ? ' (turned to face out)' : ''}`); }

/* ------------------------------------------------------------------ 5 · the pieces of skin: unwrapped, packed into Pho's sheet */
/* every donor triangle (and the join's) to a piece by its middle: front or back, and its height up the leg */
const pieceOf = (th, v) => { const half = Math.abs(th) <= Math.PI / 2 ? 'F' : 'B', band = v < VB1 ? 0 : v < VB2 ? 1 : 2; return `${half}${band}`; };
const thIn = (half, th) => half === 'F' ? th : (th < 0 ? th + 2 * Math.PI : th);   // the back piece runs from 90° through 180° to 270°
const PIECES = new Map();
const pieceTri = (s, key) => { const k = `${s}${key}`; if (!PIECES.has(k)) PIECES.set(k, { s, half: key[0], band: +key[1], tris: [], bb: [1e9, 1e9, -1e9, -1e9] }); return PIECES.get(k); };
for (const s of SIDES) { const T = donorTris[s];
  for (let t = 0; t < T.length; t += 3) { const ids = [T[t], T[t + 1], T[t + 2]], thc = Math.atan2(ids.reduce((a, i) => a + Math.sin(DV.th[i]), 0), ids.reduce((a, i) => a + Math.cos(DV.th[i]), 0)), vc = ids.reduce((a, i) => a + DV.v[i], 0) / 3;
    pieceTri(s, pieceOf(thc, vc)).tris.push({ kind: 'D', ids }); }
  for (let t = 0; t < bridgeTris[s].length; t += 3) { const ids = bridgeTris[s].slice(t, t + 3), th = ids.map(([k, i]) => k === 'D' ? DV.th[i] : (() => { const q = toLocal(allP(i), AX[s].O, RING[s].b); return Math.atan2(q.x, q.z); })());
    const thc = Math.atan2(th.reduce((a, x) => a + Math.sin(x), 0), th.reduce((a, x) => a + Math.cos(x), 0)); pieceTri(s, pieceOf(thc, 0)).tris.push({ kind: 'B', ids, th }); } }
/* a piece's coordinates: s across (angle x RREF), t up the leg; its box from its triangles' points */
const stOf = (pc, th, v) => [(thIn(pc.half, th) - (pc.half === 'F' ? -Math.PI / 2 : Math.PI / 2)) * RREF, v - (pc.band === 0 ? 0 : pc.band === 1 ? VB1 : VB2)];
for (const pc of PIECES.values()) for (const tr of pc.tris) { const pts = tr.kind === 'D' ? tr.ids.map(i => [DV.th[i], DV.v[i]]) : tr.ids.map(([k, i], m) => [tr.th[m], k === 'D' ? DV.v[i] : 0]);
  for (const [th, v] of pts) { let thc = th; if (pc.half === 'F' && Math.abs(thc) > 0.75 * Math.PI) thc = Math.sign(thc) * 0.75 * Math.PI;   // a point across the back seam of a front triangle (never: a triangle is a few millimetres)
    const [a, b] = stOf(pc, thc, v); pc.bb[0] = Math.min(pc.bb[0], a); pc.bb[1] = Math.min(pc.bb[1], b); pc.bb[2] = Math.max(pc.bb[2], a); pc.bb[3] = Math.max(pc.bb[3], b); } }
/* Pho's free squares (his sheet's own triangles, a margin round each), then the pieces packed into them, largest first, at
   the highest density that fits (from DEN down) */
const SH = phoSheet.w, CELL = 8, RES = SH / CELL, used = new Uint8Array(RES * RES);
for (let t = 0; t < triList.length + capTris.length; t += 3) { const ids = t < triList.length ? triList.slice(t, t + 3) : capTris.slice(t - triList.length, t - triList.length + 3), p = ids.map(i => uvOf(i).map(x => x * RES));
  const x0 = Math.max(0, Math.floor(Math.min(...p.map(q => q[0])))), x1 = Math.min(RES - 1, Math.floor(Math.max(...p.map(q => q[0])))), y0 = Math.max(0, Math.floor(Math.min(...p.map(q => q[1])))), y1 = Math.min(RES - 1, Math.floor(Math.max(...p.map(q => q[1]))));
  if ((x1 - x0) * (y1 - y0) > RES * RES / 16) continue; for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) used[y * RES + x] = 1; }
const pack = den => { const blk = new Uint8Array(RES * RES), m = Math.ceil(MARGIN / CELL);
  for (let y = 0; y < RES; y++) for (let x = 0; x < RES; x++) if (used[y * RES + x]) for (let dy = -m; dy <= m; dy++) for (let dx = -m; dx <= m; dx++) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < RES && Y < RES) blk[Y * RES + X] = 1; }
  const list = [...PIECES.values()].map(pc => { const d = pc.band === 2 ? Math.min(den, DENUP) : den; return { pc, d, w: Math.ceil(((pc.bb[2] - pc.bb[0]) * d + 2 * MARGIN) / CELL), h: Math.ceil(((pc.bb[3] - pc.bb[1]) * d + 2 * MARGIN) / CELL) }; }).sort((a, b) => b.w * b.h - a.w * a.h);
  const sat = () => { const S2 = new Int32Array((RES + 1) * (RES + 1)); for (let y = 0; y < RES; y++) for (let x = 0; x < RES; x++) S2[(y + 1) * (RES + 1) + x + 1] = blk[y * RES + x] + S2[y * (RES + 1) + x + 1] + S2[(y + 1) * (RES + 1) + x] - S2[y * (RES + 1) + x]; return S2; };
  for (const it of list) { const S2 = sat(), free = (x, y) => S2[(y + it.h) * (RES + 1) + x + it.w] - S2[y * (RES + 1) + x + it.w] - S2[(y + it.h) * (RES + 1) + x] + S2[y * (RES + 1) + x] === 0;
    let at = null; for (let y = 0; y + it.h <= RES && !at; y++) for (let x = 0; x + it.w <= RES; x++) if (free(x, y)) { at = [x, y]; break; }
    if (!at) return null; it.at = at; for (let y = at[1]; y < at[1] + it.h; y++) for (let x = at[0]; x < at[0] + it.w; x++) blk[y * RES + x] = 1; }
  return list; };
let packed = null, den = DEN; for (; den >= 1200; den -= 100) { packed = pack(den); if (packed) break; }
if (!packed) throw new Error('leggraft: the pieces do not fit Pho\'s sheet even at 1200 texels a metre');
log(`the legs' skin: ${packed.length} pieces packed into Pho's sheet at ${den} texels a metre (the top pieces ${Math.min(den, DENUP)}): ${packed.map(it => `${it.pc.s[0]}${it.pc.half}${it.pc.band} ${it.w * CELL}x${it.h * CELL}@${it.at[0] * CELL},${it.at[1] * CELL}`).join('  ')}`);
for (const it of packed) { const pc = it.pc; pc.d = it.d; pc.ox = it.at[0] * CELL + MARGIN - pc.bb[0] * it.d; pc.oy = it.at[1] * CELL + MARGIN - pc.bb[1] * it.d; pc.rect = [it.at[0] * CELL, it.at[1] * CELL, it.w * CELL, it.h * CELL]; }
const uvIn = (pc, th, v) => { const [a, b] = stOf(pc, th, v); return [(pc.ox + a * pc.d) / SH, (pc.oy + b * pc.d) / SH]; };

/* ------------------------------------------------------------------ 6 · the skin painted: the donor's, in Pho's colour, fading in from his ring */
/* colour statistics: Pho's shin under the cut, the donor's shin in the same place (Lab mean and spread per channel) */
const phoCols = []; for (let i = 0; i < n0; i += 3) if (cls[gid[i]] === 2 && G0.P[3 * i + 1] > 0.12 && G0.P[3 * i + 1] < CUTY) phoCols.push(texel(i));
const donCols = []; for (let k = 0; k < dNew; k += 2) if (DV.v[k] < 0.12) donCols.push(sample(donSheet, DV.dUV[2 * k], DV.dUV[2 * k + 1]));
const SP = stats(phoCols), SD = stats(donCols), ratio = [0, 1, 2].map(k => Math.max(0.6, Math.min(1.6, SP.s[k] / Math.max(1e-3, SD.s[k]))));
const transfer = c => { const L = toLab(c); return fromLab(L.map((x, k) => (x - SD.m[k]) * ratio[k] + SP.m[k])); };
log(`the donor's skin coloured to Pho's: Lab mean ${SD.m.map(x => x.toFixed(1)).join('/')} -> ${SP.m.map(x => x.toFixed(1)).join('/')}, spread x${ratio.map(x => x.toFixed(2)).join('/')} (${phoCols.length} and ${donCols.length} samples)`);
const ringCol = (s, th) => { const k = (th + Math.PI) / (2 * Math.PI) * NB - 0.5, k0 = ((Math.floor(k) % NB) + NB) % NB, k1 = (k0 + 1) % NB, f = k - Math.floor(k); return RING[s].col[k0].map((x, m) => x * (1 - f) + RING[s].col[k1][m] * f); };
const sheetOut = Buffer.from(phoSheet.px), painted = new Uint8Array(SH * SH);
const put = (x, y, c) => { const o = (y * SH + x) * 4; sheetOut[o] = c[0]; sheetOut[o + 1] = c[1]; sheetOut[o + 2] = c[2]; sheetOut[o + 3] = 255; painted[y * SH + x] = 1; };
/* the final vertices of the donor's legs and the join, per piece (a point shared by two pieces is copied, a seam) */
const OUTV = { P: [], N: [], UV: [], J: [], W: [] }, outTris = []; let nOut = 0;
const vkey = new Map();
const outV = (p, nrm, uv, jw) => { const top = jw.filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]).slice(0, 4), sum = top.reduce((a, x) => a + x[1], 0) || 1;
  OUTV.P.push(...p); OUTV.N.push(...nrm); OUTV.UV.push(...uv); for (let k = 0; k < 4; k++) { OUTV.J.push(top[k] ? top[k][0] : 0); OUTV.W.push(top[k] ? top[k][1] / sum : 0); } return nOut++; };
const raster = (pts, shade) => { /* pts: three [x, y] in sheet texels; shade(b0, b1, b2) -> rgb */
  const x0 = Math.max(0, Math.floor(Math.min(...pts.map(p => p[0])))), x1 = Math.min(SH - 1, Math.ceil(Math.max(...pts.map(p => p[0])))), y0 = Math.max(0, Math.floor(Math.min(...pts.map(p => p[1])))), y1 = Math.min(SH - 1, Math.ceil(Math.max(...pts.map(p => p[1]))));
  const [a, b, c] = pts, ar = (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]); if (Math.abs(ar) < 1e-9) return;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const px = x + 0.5, py = y + 0.5;
    let w0 = ((b[0] - px) * (c[1] - py) - (c[0] - px) * (b[1] - py)) / ar, w1 = ((c[0] - px) * (a[1] - py) - (a[0] - px) * (c[1] - py)) / ar, w2 = 1 - w0 - w1;
    if (w0 < -0.02 || w1 < -0.02 || w2 < -0.02) continue; w0 = Math.max(0, w0); w1 = Math.max(0, w1); w2 = Math.max(0, w2); const sm = w0 + w1 + w2; put(x, y, shade(w0 / sm, w1 / sm, w2 / sm)); } };
for (const pc of PIECES.values()) { const s = pc.s;
  for (const tr of pc.tris) {
    if (tr.kind === 'D') { const ids = tr.ids.map(i => { const key = `${pc.s}${pc.half}${pc.band}:${i}`; if (!vkey.has(key)) vkey.set(key, outV([DV.P[3 * i], DV.P[3 * i + 1], DV.P[3 * i + 2]], [DV.N[3 * i], DV.N[3 * i + 1], DV.N[3 * i + 2]], uvIn(pc, DV.th[i], DV.v[i]), DV.jw[i])); return vkey.get(key); });
      outTris.push(...ids);
      const pts = tr.ids.map(i => uvIn(pc, DV.th[i], DV.v[i]).map(x => x * SH));
      raster(pts, (b0, b1, b2) => { const du = b0 * DV.dUV[2 * tr.ids[0]] + b1 * DV.dUV[2 * tr.ids[1]] + b2 * DV.dUV[2 * tr.ids[2]], dv = b0 * DV.dUV[2 * tr.ids[0] + 1] + b1 * DV.dUV[2 * tr.ids[1] + 1] + b2 * DV.dUV[2 * tr.ids[2] + 1];
        const v = b0 * DV.v[tr.ids[0]] + b1 * DV.v[tr.ids[1]] + b2 * DV.v[tr.ids[2]], c = transfer(sample(donSheet, du, dv)); if (v >= BAND + FEATHER) return c;
        const th = Math.atan2(b0 * Math.sin(DV.th[tr.ids[0]]) + b1 * Math.sin(DV.th[tr.ids[1]]) + b2 * Math.sin(DV.th[tr.ids[2]]), b0 * Math.cos(DV.th[tr.ids[0]]) + b1 * Math.cos(DV.th[tr.ids[1]]) + b2 * Math.cos(DV.th[tr.ids[2]]));
        const f = sstep((v - BAND) / FEATHER), rc = ringCol(s, th); return c.map((x, m) => rc[m] * (1 - f) + x * f); });
    } else { /* the join: Pho's ring's points copied (place, normal, weights) and the donor's bottom, all painted in Pho's ring's colour */
      const ids = tr.ids.map(([k, i], m) => { const key = `${pc.s}${pc.half}${pc.band}:${k}${i}`; if (vkey.has(key)) return vkey.get(key);
        const id = k === 'D' ? outV([DV.P[3 * i], DV.P[3 * i + 1], DV.P[3 * i + 2]], [DV.N[3 * i], DV.N[3 * i + 1], DV.N[3 * i + 2]], uvIn(pc, DV.th[i], DV.v[i]), DV.jw[i])
          : outV(allP(i).toArray(), nrmOf(i), uvIn(pc, tr.th[m], 0), jwAny(i)); vkey.set(key, id); return id; });
      outTris.push(...ids);
      const pts = tr.ids.map(([k, i], m) => uvIn(pc, tr.th[m], k === 'D' ? DV.v[i] : 0).map(x => x * SH));
      raster(pts, (b0, b1, b2) => { const th = Math.atan2(b0 * Math.sin(tr.th[0]) + b1 * Math.sin(tr.th[1]) + b2 * Math.sin(tr.th[2]), b0 * Math.cos(tr.th[0]) + b1 * Math.cos(tr.th[1]) + b2 * Math.cos(tr.th[2])); return ringCol(s, th); }); } } }
/* the donor's top: his thigh carried on up THIGHEXT metres toward the hip in one texel of his skin there (widening by
   THIGHTOP), then capped — under the robe, seen only when a running knee lifts it, where a flat-topped thigh 10 cm above
   the knee read as a cut-off leg (THIGHEXT=0: the flat cap alone, as first made) */
let nTopCap = 0;
for (const s of SIDES) { if (!donorTop[s].length) continue; const ids = [...new Set(donorTop[s].flat())], c = ids.reduce((a, i) => a.add(V3(DV.P[3 * i], DV.P[3 * i + 1], DV.P[3 * i + 2])), V3(0, 0, 0)).multiplyScalar(1 / ids.length);
  const pc = PIECES.get(`${s}F2`) || PIECES.get(`${s}B2`) || [...PIECES.values()].find(p => p.s === s); const uv = uvIn(pc, pc.half === 'F' ? 0 : Math.PI, (pc.band === 2 ? VB2 : pc.band === 1 ? VB1 : 0) + 0.01);
  const nrm = GR[s].H.clone().sub(GR[s].K1).normalize(), wm = new Map(); for (const i of ids) for (const [j, w] of DV.jw[i]) wm.set(j, (wm.get(j) || 0) + w);
  const nRings = THIGHEXT > 0 ? Math.max(1, Math.round(THIGHEXT / 0.03)) : 0, rings = [];
  for (let k = 0; k <= nRings; k++) { const f = nRings ? k / nRings : 0, m = new Map();
    for (const i of ids) { const p0 = V3(DV.P[3 * i], DV.P[3 * i + 1], DV.P[3 * i + 2]), rv = p0.clone().sub(c), along = rv.dot(nrm); rv.addScaledVector(nrm, -along);
      const p = k === 0 ? p0 : c.clone().addScaledVector(nrm, along + THIGHEXT * f).addScaledVector(rv, 1 + (THIGHTOP - 1) * f), nr = k === 0 ? [DV.N[3 * i], DV.N[3 * i + 1], DV.N[3 * i + 2]] : rv.clone().normalize().toArray();
      m.set(i, outV(p.toArray(), nr, uv, DV.jw[i])); }
    rings.push(m); }
  for (let k = 0; k < nRings; k++) for (const [a, b] of donorTop[s]) { const A0 = rings[k].get(a), B0 = rings[k].get(b), A1 = rings[k + 1].get(a), B1 = rings[k + 1].get(b); outTris.push(B0, A0, A1, B0, A1, B1); }
  const mid = outV(c.clone().addScaledVector(nrm, THIGHEXT).toArray(), nrm.toArray(), uv, [...wm]), top = rings[nRings];
  for (const [a, b] of donorTop[s]) outTris.push(top.get(b), top.get(a), mid); nTopCap += donorTop[s].length * (2 * nRings + 1); }
/* each piece's paint grown into its margin (bilinear reach, and the halving at prep), and the normal sheet flat under it */
const grow = (rect) => { const [x0, y0, w, h] = rect; for (let pass = 0; pass < MARGIN; pass++) { const add = [];
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) { if (painted[y * SH + x]) continue; let c = [0, 0, 0], k = 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = x + dx, Y = y + dy; if (X < x0 || Y < y0 || X >= x0 + w || Y >= y0 + h || !painted[Y * SH + X]) continue; const o = (Y * SH + X) * 4; c[0] += sheetOut[o]; c[1] += sheetOut[o + 1]; c[2] += sheetOut[o + 2]; k++; }
      if (k) add.push([x, y, c.map(v => v / k)]); }
    if (!add.length) break; for (const [x, y, c] of add) put(x, y, c); } };
for (const pc of PIECES.values()) grow(pc.rect);
const nTex = R.prim.getMaterial().getNormalTexture();
if (nTex) { const ns = await sheetOf(nTex), k = ns.w / SH, nb = Buffer.from(ns.px);
  for (const pc of PIECES.values()) { const [x0, y0, w, h] = pc.rect; for (let y = Math.floor(y0 * k); y < Math.ceil((y0 + h) * k); y++) for (let x = Math.floor(x0 * k); x < Math.ceil((x0 + w) * k); x++) { const o = (y * ns.w + x) * 4; nb[o] = 128; nb[o + 1] = 128; nb[o + 2] = 255; nb[o + 3] = 255; } }
  nTex.setImage(await sharp(nb, { raw: { width: ns.w, height: ns.h, channels: 4 } }).removeAlpha().png({ compressionLevel: 6 }).toBuffer()).setMimeType('image/png'); }
R.prim.getMaterial().getBaseColorTexture().setImage(await sharp(sheetOut, { raw: { width: SH, height: SH, channels: 4 } }).removeAlpha().png({ compressionLevel: 6 }).toBuffer()).setMimeType('image/png');

/* ------------------------------------------------------------------ 7 · the new points' tangents (from the pieces' UVs), and the write */
const NO = nOut, TGo = new Float64Array(NO * 4), tacc = new Float64Array(NO * 3);
for (let t = 0; t < outTris.length; t += 3) { const [a, b, c] = [outTris[t], outTris[t + 1], outTris[t + 2]], p = [a, b, c].map(i => OUTV.P.slice(3 * i, 3 * i + 3)), u = [a, b, c].map(i => OUTV.UV.slice(2 * i, 2 * i + 2));
  const e1 = [0, 1, 2].map(k => p[1][k] - p[0][k]), e2 = [0, 1, 2].map(k => p[2][k] - p[0][k]), du1 = u[1][0] - u[0][0], dv1 = u[1][1] - u[0][1], du2 = u[2][0] - u[0][0], dv2 = u[2][1] - u[0][1], r = du1 * dv2 - du2 * dv1;
  if (Math.abs(r) < 1e-14) continue; const T = [0, 1, 2].map(k => (e1[k] * dv2 - e2[k] * dv1) / r); for (const i of [a, b, c]) for (let k = 0; k < 3; k++) tacc[3 * i + k] += T[k]; }
for (let i = 0; i < NO; i++) { const nn = OUTV.N.slice(3 * i, 3 * i + 3); let T = [tacc[3 * i], tacc[3 * i + 1], tacc[3 * i + 2]]; const d = T[0] * nn[0] + T[1] * nn[1] + T[2] * nn[2]; T = T.map((x, k) => x - nn[k] * d);
  let l = Math.hypot(...T); if (l < 1e-9) { T = Math.abs(nn[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]; const d2 = T[0] * nn[0] + T[1] * nn[1] + T[2] * nn[2]; T = T.map((x, k) => x - nn[k] * d2); l = Math.hypot(...T); }
  TGo.set([T[0] / l, T[1] / l, T[2] / l, 1], 4 * i); }
const NT = n0 + nNew + NO;
const accs = { POSITION: [3, G0.P, NV.P, OUTV.P], NORMAL: [3, G0.N, NV.N, OUTV.N], TEXCOORD_0: [2, G0.UV, NV.UV, OUTV.UV], TANGENT: [4, G0.TG, NV.TG, Array.from(TGo)], JOINTS_0: [4, G0.J, NV.J, OUTV.J], WEIGHTS_0: [4, G0.W, NV.W, OUTV.W] };
for (const [sem, [w, a, b, c]] of Object.entries(accs)) { const acc = R.prim.getAttribute(sem); if (!acc) continue; if (!a) throw new Error('leggraft: his file has no ' + sem);
  const Ctor = sem === 'JOINTS_0' ? Uint16Array : Float32Array, arr = new Ctor(NT * w); arr.set(a); arr.set(b, n0 * w); arr.set(c, (n0 + nNew) * w);
  acc.setArray(arr).setNormalized(false); }
const idx = new Uint32Array(triList.length + capTris.length + outTris.length); idx.set(triList); idx.set(capTris, triList.length); idx.set(outTris.map(i => i + n0 + nNew), triList.length + capTris.length);
R.prim.getIndices().setArray(idx);
await io.write(OUT, doc);
log(`leggraft: ${n0} of his points kept (${reweighted} of his shins' weights on the new shin bones), ${nNew} added at his cut and the robe's caps, ${NO} for the donor's legs and the join; ${idx.length / 3} triangles (his ${triList.length / 3}, caps ${capTris.length / 3}, legs and join ${outTris.length / 3}, ${nTopCap} at the legs' tops)`);
