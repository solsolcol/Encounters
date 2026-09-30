// The temple's materials: a base colour per class, the baked AO from COLOR_0,
// and a world-space pattern per class (no UVs in the model).
const COMMON = `
varying vec3 vWP; varying vec3 vWN;
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h21(i), h21(i+vec2(1,0)), f.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * vnoise(p); p *= 2.03; a *= 0.5; } return s; }
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
`,
  base: `
    vec2 q = tri(vWP, vWN);
    float course = smoothstep(0.0, 0.05, fract(q.y / 2.2)) * smoothstep(0.0, 0.05, 1.0 - fract(q.y / 2.2));
    diffuseColor.rgb *= (0.88 + fbm(q * 0.5) * 0.18) * mix(0.8, 1.0, course);`,
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
    diffuseColor.rgb *= 0.86 + 0.22 * fbm(vWP.xz * 0.9 + vWP.y * 0.3);`,
  // teak planks under the eaves
  soffit: `
    vec2 q = tri(vWP, vWN); float along = abs(vWN.x) > abs(vWN.z) ? q.x : q.y;
    float pl = fract(along / 1.3); float seam = smoothstep(0.0, 0.05, pl) * smoothstep(0.0, 0.05, 1.0 - pl);
    float grain = fbm(vec2(along * 0.6, (abs(vWN.x) > abs(vWN.z) ? q.y : q.x) * 6.0));
    diffuseColor.rgb *= mix(0.55, 1.0, seam) * (0.82 + grain * 0.35) * (0.9 + 0.2 * h21(vec2(floor(along / 1.3), 3.0)));`,
  // stone slabs
  floor: `
    vec2 q = vWP.xz / 3.4; vec2 f = fract(q);
    float seam = smoothstep(0.0, 0.025, f.x) * smoothstep(0.0, 0.025, 1.0 - f.x) * smoothstep(0.0, 0.025, f.y) * smoothstep(0.0, 0.025, 1.0 - f.y);
    diffuseColor.rgb *= mix(0.72, 1.0, seam) * (0.88 + 0.16 * h21(floor(q))) * (0.94 + 0.1 * fbm(vWP.xz * 0.4));`,
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
  m.customProgramCacheKey = () => 'temple_' + k + '_' + AOK + '_' + new URLSearchParams(location.search).has('rowdbg');
  m.onBeforeCompile = sh => {
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vWP; varying vec3 vWN;')
      .replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWP = (modelMatrix * vec4(transformed, 1.0)).xyz; vWN = normalize(mat3(modelMatrix) * objectNormal);');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\n#define AOK ' + AOK + '\n' + (new URLSearchParams(location.search).has('rowdbg') ? '#define ROWDBG\n' : '') + COMMON)
      .replace('#include <color_fragment>', `#include <color_fragment>
        diffuseColor.rgb *= mix(1.0, vColor.r, AOK);   // AO, a curve over the baked value
        // inside the hall (seen through the doorways): no sky reaches it
        if (abs(vWP.x) < 26.0 && vWP.z < -23.6 && vWP.z > -79.7 && vWP.y < 60.0) diffuseColor.rgb *= 0.42;
        ${PAT[k] || ''}`);
  };
  return m;
}
