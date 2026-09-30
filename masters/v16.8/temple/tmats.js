// The temple's materials: a base colour per class, the baked AO from COLOR_0,
// and a world-space pattern per class (no UVs in the model).
const COMMON = `
varying vec3 vWP; varying vec3 vWN;
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h21(i), h21(i+vec2(1,0)), f.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * vnoise(p); p *= 2.03; a *= 0.5; } return s; }
float tH = 0.0; float tHk = 0.0;
vec3 bumpN(vec3 sp, vec3 sn, float h, float k){
  vec3 sx = dFdx(sp), sy = dFdy(sp); vec3 r1 = cross(sy, sn), r2 = cross(sn, sx);
  float det = dot(sx, r1); vec2 dh = vec2(dFdx(h), dFdy(h)) * k;
  vec3 g = sign(det) * (dh.x * r1 + dh.y * r2); return normalize(abs(det) * sn - g); }
/* THE INTERIOR: inside the hall's four walls (measured off the file: the
   inner faces at x ±26.9, z -23.4 and -79.9, the floor at y 33) */
bool inHall(vec3 p){ return abs(p.x) < 27.3 && p.z < -23.1 && p.z > -80.2 && p.y > 32.0; }
float star8(vec2 c, float r){ float a = atan(c.y, c.x); float k = 0.55 + 0.45 * pow(abs(cos(a * 4.0)), 3.0); return 1.0 - smoothstep(r * k - 0.02, r * k + 0.02, length(c)); }
/* a Lanna mural, painted: sky, far hills, a river of ochre ground, trees,
   little pavilions — soft, in the old palette, inside gold frames */
vec3 mural(vec2 q){
  float W = 11.0; vec2 l = vec2(mod(q.x, W), q.y); float px = floor(q.x / W), ph = h21(vec2(px, 9.0));
  float y = l.y;                                   // 0 at the wainscot's top
  vec3 sky = mix(vec3(0.52, 0.64, 0.62), vec3(0.88, 0.84, 0.72), smoothstep(14.5, 5.0, y));
  // soft clouds
  float cl = smoothstep(0.55, 0.75, fbm(vec2(q.x * 0.35, y * 0.9) + ph * 10.0)) * smoothstep(9.0, 12.0, y);
  vec3 c = mix(sky, vec3(0.94, 0.92, 0.86), cl * 0.7);
  // far hills (pale), near hills (green)
  float far = 9.6 + 1.3 * sin(l.x * 0.55 + px * 2.1 + ph * 6.0) + 0.6 * sin(l.x * 1.7 + px);
  if (y < far) c = mix(vec3(0.60, 0.68, 0.62), vec3(0.70, 0.72, 0.62), smoothstep(far, far - 3.0, y));
  float near = 7.6 + 1.2 * sin(l.x * 0.8 + px * 1.3 + 1.0) + 0.5 * sin(l.x * 2.3 + ph * 9.0);
  if (y < near) c = mix(vec3(0.36, 0.48, 0.32), vec3(0.56, 0.54, 0.34), smoothstep(near, near - 4.0, y));
  // the river, with its ripples
  float rv = 4.2 + 0.4 * sin(l.x * 0.9 + px * 4.0);
  if (y < rv && y > rv - 1.1) c = mix(vec3(0.46, 0.60, 0.62), vec3(0.62, 0.72, 0.70), 0.5 + 0.5 * sin(l.x * 9.0 + y * 3.0));
  float ground = rv - 1.1;
  if (y < ground) c = mix(vec3(0.62, 0.47, 0.28), vec3(0.74, 0.60, 0.40), fbm(q * 0.8));
  // birds in the sky: little dark v's
  for (int i = 0; i < 3; i++) {
    vec2 b = vec2(l.x - (2.0 + float(i) * 2.7 + ph * 3.0), y - (12.0 + float(i) * 0.7 - ph));
    float v = abs(abs(b.x) * 0.6 - b.y + 0.05); c = mix(c, vec3(0.25, 0.22, 0.2), (1.0 - smoothstep(0.03, 0.08, v)) * step(abs(b.x), 0.3));
  }
  // trees: round crowns, and palms (a fan of fronds on a tall trunk)
  for (int i = 0; i < 4; i++) {
    float fi = float(i), tx = 1.2 + fi * 2.7 + 0.7 * sin(px * 5.1 + fi), base = (fi < 2.0 ? ground : rv + 0.2);
    bool palm = h21(vec2(px, fi)) > 0.6;
    vec2 tc = vec2(l.x - tx, y - base);
    if (palm) {
      float trunk = step(abs(tc.x + tc.y * 0.06), 0.09) * step(0.0, tc.y) * step(tc.y, 3.2);
      vec2 fc = tc - vec2(-0.2, 3.3); float a = atan(fc.y, fc.x);
      float frond = (1.0 - smoothstep(1.0, 1.2, length(fc))) * smoothstep(0.35, 0.8, abs(sin(a * 4.0))) * step(-0.6, fc.y);
      c = mix(c, vec3(0.36, 0.24, 0.14), trunk); c = mix(c, vec3(0.22, 0.38, 0.22), frond);
    } else {
      vec2 cc = tc - vec2(0.0, 2.2);
      float crown = 1.0 - smoothstep(0.95, 1.1, length(cc * vec2(1.0, 1.2)) + 0.22 * fbm(q * 2.0));
      float trunk = step(abs(tc.x), 0.11) * step(0.0, tc.y) * step(tc.y, 1.6);
      c = mix(c, vec3(0.34, 0.22, 0.14), trunk);
      c = mix(c, vec3(0.20, 0.34, 0.22) * (0.8 + 0.45 * fbm(q * 3.0)), crown);
    }
  }
  // a small pavilion: a red roof on white posts, and a figure beside it in saffron
  vec2 pc = vec2(l.x - 8.2 - 0.6 * sin(px * 1.7), y - ground);
  float body = step(abs(pc.x), 0.9) * step(0.0, pc.y) * step(pc.y, 1.3);
  float roof = step(abs(pc.x) * 0.9, 2.1 - pc.y) * step(1.3, pc.y) * step(pc.y, 2.1);
  c = mix(c, vec3(0.92, 0.88, 0.80), body); c = mix(c, vec3(0.56, 0.12, 0.08), roof);
  vec2 fg = vec2(pc.x + 1.6, pc.y);
  float fig = (1.0 - smoothstep(0.18, 0.22, length(fg - vec2(0.0, 1.05)))) + step(abs(fg.x), 0.22 - fg.y * 0.05) * step(0.0, fg.y) * step(fg.y, 0.9);
  c = mix(c, fg.y > 0.85 ? vec3(0.56, 0.40, 0.30) : vec3(0.82, 0.45, 0.12), clamp(fig, 0.0, 1.0));
  c *= 0.9 + 0.14 * fbm(q * 1.7);                  // the fresco's own unevenness
  // age: candle soot toward the top, damp stains, a little colour gone
  c *= mix(1.0, 0.72, smoothstep(6.0, 15.0, y));
  float stain = smoothstep(0.62, 0.8, fbm(vec2(q.x * 0.35, q.y * 0.9) + 3.1));
  c = mix(c, c * vec3(0.78, 0.70, 0.58), stain);
  c = mix(c, vec3(dot(c, vec3(0.33))), 0.18);
  // the gold frame of each panel
  float fr = step(l.x, 0.25) + step(W - 0.25, l.x) + step(14.6, y);
  return mix(c, vec3(0.78, 0.56, 0.20), clamp(fr, 0.0, 1.0));
}
vec2 tri(vec3 p, vec3 n){ vec3 a = abs(n); return a.y > max(a.x, a.z) ? p.xz : (a.x > a.z ? p.zy : p.xy); }
`;
const PAT = {
  // tiles in rows down the slope, a little per-tile tone
  roof: `
    /* rows are HEIGHT contours (a tile course is level along the roof);
       dividing by the slope to space them along it bunched them into a
       swirl wherever the curved roof changes pitch */
    float row = vWP.y / 0.95; float fr = fract(row);
    float col = (abs(vWN.x) > abs(vWN.z) ? vWP.z : vWP.x) / 1.25 + mod(floor(row), 2.0) * 0.5; float fc = fract(col);
    float tip = 0.30 * (1.0 - abs(fc - 0.5) * 2.0);                       // the pointed foot of each tile
    float body = smoothstep(tip - 0.03, tip + 0.03, fr);                   // below the point: the next tile down, in shadow
    float lip = 1.0 - smoothstep(tip, tip + 0.10, fr) * 0.0;
    float seam = smoothstep(0.0, 0.05, fc) * smoothstep(0.0, 0.05, 1.0 - fc);
    float tone = 0.80 + 0.22 * h21(floor(vec2(col, row)));
    float shade = mix(0.45, 1.0, body) * mix(0.75, 1.0, seam) * mix(1.12, 1.0, smoothstep(tip, tip + 0.18, fr));
    /* where a tile is smaller than a couple of pixels the pattern only
       shimmers (moiré): fade it to its own average there */
    float aa = 1.0 - smoothstep(0.18, 0.45, max(fwidth(row), fwidth(col)));
    shade = mix(0.82, shade, aa); tone = mix(0.9, tone, aa);
    tH = (body * (0.35 + 0.65 * smoothstep(tip, 1.0, fr)) + (1.0 - seam) * -0.25) * aa; tHk = 0.9;
    diffuseColor.rgb *= shade * tone * (0.9 + 0.2 * fbm(vWP.xz * 0.08));
    #ifdef ROWDBG
    diffuseColor.rgb = vec3(fr, fc, vWN.y * 0.5 + 0.5);
    #endif`,
  // limewash: soft mottling, darker weathering near the foot and in streaks under the eaves
  white: `
    vec2 q = tri(vWP, vWN);
    float m = fbm(q * 0.35) * 0.10 + fbm(vec2(q.x * 0.6, q.y * 0.05)) * 0.08;
    float foot = 1.0 - smoothstep(22.0, 30.0, vWP.y) * 0.0 - (1.0 - smoothstep(21.0, 27.0, vWP.y)) * 0.18;
    diffuseColor.rgb *= (0.93 + m) * foot;
    tH = fbm(q * 2.2) * 0.5 + fbm(q * 7.0) * 0.25; tHk = 0.05;
    bool reveal = abs(abs(vWP.x) - 27.65) < 0.8 && vWP.y > 39.4 && vWP.y < 54.8 && vWP.z < -23.1 && vWP.z > -80.2;
    if (reveal) {
      float e = step(0.9, abs(vWN.x)) ;                 // the face toward the room (a mullion's front) keeps a gold edge
      diffuseColor.rgb = mix(vec3(0.38, 0.06, 0.04), vec3(0.78, 0.56, 0.20), e * 0.6) * vColor.r * vec3(0.8, 0.72, 0.62);
      tHk = 0.0;
    } else if (inHall(vWP) && abs(vWN.y) < 0.5) {
      float y = vWP.y - 33.1;                       // up from the hall's floor
      vec2 wq = vec2(abs(vWN.x) > abs(vWN.z) ? vWP.z : vWP.x, y - 6.2);
      if (y < 5.6) {                                // the lacquered wainscot, a gold rule on top
        diffuseColor.rgb = mix(vec3(0.34, 0.05, 0.03), vec3(0.78, 0.56, 0.20), step(5.1, y)) * vColor.r * (0.9 + 0.12 * fbm(wq * 2.0));
      } else if (y < 21.5) {
        diffuseColor.rgb = mural(wq) * mix(1.0, vColor.r, 0.5);
      } else {                                      // the frieze under the ceiling: red, gold lattice
        vec2 c = fract(wq / 2.2) - 0.5; float g = 1.0 - smoothstep(0.04, 0.07, abs(abs(c.x) + abs(c.y) - 0.5));
        diffuseColor.rgb = mix(vec3(0.42, 0.06, 0.04), vec3(0.80, 0.58, 0.22), g) * vColor.r;
      }
      tHk = 0.0;
    }
`,
  base: `
    vec2 q = tri(vWP, vWN);
    float course = smoothstep(0.0, 0.05, fract(q.y / 2.2)) * smoothstep(0.0, 0.05, 1.0 - fract(q.y / 2.2));
    diffuseColor.rgb *= (0.88 + fbm(q * 0.5) * 0.18) * mix(0.8, 1.0, course);
    if (inHall(vWP)) diffuseColor.rgb = vec3(0.30, 0.05, 0.03) * vColor.r;`,
  // red lacquer with a gold stencil lattice (lai kham): diamonds with a rosette at every node
  red: `
    vec2 q = tri(vWP, vWN) / 3.2; vec2 c = fract(q) - 0.5;
    float dia = abs(c.x) + abs(c.y);
    float line = 1.0 - smoothstep(0.035, 0.06, abs(dia - 0.5));
    float ros = 1.0 - smoothstep(0.10, 0.13, length(c));
    float petal = 1.0 - smoothstep(0.03, 0.05, abs(length(c) - 0.22) - 0.035 * cos(atan(c.y, c.x) * 8.0));
    float gold = max(max(line, ros), petal * 0.9);
    diffuseColor.rgb = mix(diffuseColor.rgb * (0.9 + 0.12 * fbm(q * 3.0)), vec3(0.80, 0.58, 0.20) * vColor.r, gold * 0.92);`,
  // gilt: a little tarnish so it is not plastic
  gold: `
    /* gilded carving is gold RELIEF on a lacquered ground: where the bake
       says the surface is deep in the carving (little sky), it is the red
       ground with a coloured-glass chip here and there; where it stands
       out, it is the gilt */
    float ao = vColor.r;
    float raised = smoothstep(0.18, 0.46, ao);
    vec3 cell = floor(vWP * 3.0); float hc = h21(cell.xy + cell.z * 7.13);
    vec3 glass = hc > 0.92 ? vec3(0.10, 0.42, 0.30) : hc > 0.86 ? vec3(0.12, 0.22, 0.52) : vec3(0.36, 0.05, 0.03);
    vec3 gilt = diffuseColor.rgb * (0.86 + 0.22 * fbm(vWP.xz * 0.9 + vWP.y * 0.3));
    diffuseColor.rgb = mix(glass * vColor.r * 2.2, gilt, raised);`,
  // teak planks under the eaves
  soffit: `
    vec2 q = tri(vWP, vWN); float along = abs(vWN.x) > abs(vWN.z) ? q.x : q.y;
    float pl = fract(along / 1.3); float seam = smoothstep(0.0, 0.05, pl) * smoothstep(0.0, 0.05, 1.0 - pl);
    float grain = fbm(vec2(along * 0.6, (abs(vWN.x) > abs(vWN.z) ? q.y : q.x) * 6.0));
    diffuseColor.rgb *= mix(0.55, 1.0, seam) * (0.82 + grain * 0.35) * (0.9 + 0.2 * h21(vec2(floor(along / 1.3), 3.0)));
    if (inHall(vWP)) {                              // the hall's ceiling: red lacquer, gold stars
      vec2 cq = (abs(vWN.x) > abs(vWN.z) ? vWP.zy : vWP.xy) / 3.0; vec2 c = fract(cq) - 0.5;
      float st = max(star8(c, 0.26), star8(fract(cq + 0.5) - 0.5, 0.09));
      diffuseColor.rgb = mix(vec3(0.40, 0.05, 0.035) * (0.85 + 0.2 * fbm(cq * 2.0)), vec3(0.86, 0.64, 0.24), st) * mix(1.0, vColor.r, 0.4);
    }`,
  // stone slabs
  floor: `
    if (inHall(vWP)) {
      float pl = fract(vWP.x / 1.6); float seam = smoothstep(0.0, 0.04, pl) * smoothstep(0.0, 0.04, 1.0 - pl);
      float board = floor(vWP.x / 1.6), endj = fract(vWP.z / 9.0 + h21(vec2(board, 1.0)));
      float grain = fbm(vec2(vWP.x * 3.0, vWP.z * 0.3));
      vec3 teak = vec3(0.26, 0.13, 0.06) * (0.8 + 0.35 * grain) * (0.85 + 0.3 * h21(vec2(board, 2.0)));
      teak *= mix(0.6, 1.0, seam) * mix(0.7, 1.0, smoothstep(0.0, 0.01, endj));
      float run = step(abs(vWP.x - 0.4), 4.2);       // the runner, door to altar
      float rb = step(3.7, abs(vWP.x - 0.4)) * run;
      diffuseColor.rgb = mix(teak, mix(vec3(0.46, 0.06, 0.05), vec3(0.78, 0.56, 0.20), rb), run) * vColor.r;
    } else {
    vec2 q = vWP.xz / 3.4; vec2 f = fract(q);
    float seam = smoothstep(0.0, 0.025, f.x) * smoothstep(0.0, 0.025, 1.0 - f.x) * smoothstep(0.0, 0.025, f.y) * smoothstep(0.0, 0.025, 1.0 - f.y);
    diffuseColor.rgb *= mix(0.72, 1.0, seam) * (0.88 + 0.16 * h21(floor(q))) * (0.94 + 0.1 * fbm(vWP.xz * 0.4));
    }`,
};
const BASE = {
  roof:   { color: 0xa2472a, roughness: 0.62, metalness: 0.0 },
  white:  { color: 0xf1ebdf, roughness: 0.92, metalness: 0.0 },
  base:   { color: 0xd8d0c0, roughness: 0.95, metalness: 0.0 },
  red:    { color: 0x7a1a12, roughness: 0.45, metalness: 0.05 },
  gold:   { color: 0xc98f2e, roughness: 0.38, metalness: 0.6, envMapIntensity: 0.8 },
  soffit: { color: 0x6a4228, roughness: 0.7,  metalness: 0.0 },
  floor:  { color: 0xcfc4b0, roughness: 0.85, metalness: 0.0 },
};
export let AOK = new URLSearchParams(location.search).has('noao') ? '0.0' : '0.6';
export function material(THREE, k, env) {
  const b = BASE[k] || BASE.white;
  const m = new THREE.MeshStandardMaterial({ ...b, vertexColors: true, envMap: env });
  if (b.envMapIntensity === undefined) m.envMapIntensity = 0.35;
  /* one program PER CLASS: three keys its program cache on the
     onBeforeCompile source, which is the same text for every class here,
     so without this every class drew with the first class's pattern */
  const BUMP = `#include <normal_fragment_maps>
        if (tHk > 0.0) normal = bumpN(-vViewPosition, normal, tH, tHk);`;
  m.customProgramCacheKey = () => 'temple_' + k + '_' + AOK + '_' + new URLSearchParams(location.search).has('rowdbg');
  m.onBeforeCompile = sh => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; varying vec3 vWN;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWP = (modelMatrix * vec4(transformed, 1.0)).xyz; vWN = normalize(mat3(modelMatrix) * objectNormal);');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\n#define AOK ' + AOK + '\n' + (new URLSearchParams(location.search).has('rowdbg') ? '#define ROWDBG\n' : '') + COMMON)
      .replace('#include <normal_fragment_maps>', BUMP).replace('#include <color_fragment>', `#include <color_fragment>
        diffuseColor.rgb *= mix(1.0, vColor.r, AOK);   // AO, a curve over the baked value
        // inside the hall (seen through the doorways): no sky reaches it
        ${PAT[k] || ''}
        // a hall is lit by its doors and windows: dimmer and warmer than the day (LAST, over every pattern)
        if (inHall(vWP)) diffuseColor.rgb *= vec3(0.64, 0.56, 0.47);`);
  };
  return m;
}
