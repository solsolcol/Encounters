/* v27.0 · SPIRIT VISION — THE PICTURE (Chad, 17 Nov 2026, episode 4 chapter 4: "When turned on, it totally inverts all
   the colours of the entire environment and characters, has a slight motion blur effect when moving the camera around,
   slight vignette effect, but it also allows the player to see spirits or other entities in their glowing coloured
   silohuettes that cannot be seen if the spirit vision is not turned on ... When turning on Sprit Vision, it causes a
   wave of energy and light to spread outwards and tracing the lines and silohuettes of all environment, models,
   characters, etc. ... When turning off, it causes the same effect but in reverse going back to the player.").

   Drawn ONLY while the vision is on or its wave is moving (main.js decides; otherwise the world is drawn straight to the
   screen as it always was, untouched). While it is:
   1. the world is drawn into WORLD, a target of the drawing buffer's size, multisampled as the screen is, in half floats
      (light as it is before the tone mapping), with its DEPTH kept;
   2. his hands into HANDS (their own colour and coverage, so they can be turned with the world);
   3. every spirit into SPIRIT, at half the size, glowing (each spirit's own material: a rim of light round its
      silhouette, its body a faint fill, drawn faint where a wall stands before it), its smaller levels kept for the glow;
   4. one pass to the screen: the world's light tone-mapped and encoded exactly as three draws it to the screen (its own
      toneMapping() and linearToOutputTexel(), so what the wave has not reached looks as it did), then, where the wave has
      passed (the distance from his eyes to what the pixel shows, from the depth, against the wave's radius), the colour
      inverted, the camera's own movement blurred a little (each pixel's world point carried back through last frame's
      camera), the edges of everything (from the depth: silhouettes, corners, creases; and a little from the colour)
      traced in light at the wave's front and faintly behind it, the spirits laid on with their glow, his hands over it
      all (turned with the world once the wave has left him), and a slight vignette.
   The radius is the caller's (main.js runs it out and back on the wall clock; a film may set it from its own clock). */

export const VIS_LAYER = 9;

export function makeVision(THREE, renderer, opts = {}) {
  const gl = renderer.getContext();
  const caps = renderer.capabilities;
  const ext = renderer.extensions;
  const floatOk = caps.isWebGL2 && (ext.has('EXT_color_buffer_float') || ext.has('EXT_color_buffer_half_float'));
  const SAMPLES = Math.min(caps.maxSamples || 0, opts.samples == null ? 4 : opts.samples);
  const V = { ok: !!caps.isWebGL2, w: 0, h: 0, world: null, hands: null, spirit: null, depth: null, frames: 0,
              prevVP: new THREE.Matrix4(), havePrev: false, mats: new Set(), err: null };
  const _sz = new THREE.Vector2(), _eye = new THREE.Vector3(), _vp = new THREE.Matrix4(), _cc = new THREE.Color();

  function targets(w, h) {
    if (V.world && V.w === w && V.h === h) return;
    free();
    V.w = w; V.h = h;
    const type = floatOk ? THREE.HalfFloatType : THREE.UnsignedByteType;
    V.depth = new THREE.DepthTexture(w, h);
    V.depth.type = THREE.UnsignedIntType;
    V.world = new THREE.WebGLRenderTarget(w, h, { type, samples: SAMPLES, depthTexture: V.depth, depthBuffer: true,
                                                   minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
    V.world.texture.colorSpace = THREE.LinearSRGBColorSpace;
    V.hands = new THREE.WebGLRenderTarget(w, h, { type, samples: SAMPLES, depthBuffer: true,
                                                   minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
    const sw = Math.max(2, w >> 1), sh = Math.max(2, h >> 1);
    V.spirit = new THREE.WebGLRenderTarget(sw, sh, { type, depthBuffer: false, generateMipmaps: true,
                                                      minFilter: THREE.LinearMipmapLinearFilter, magFilter: THREE.LinearFilter });
    comp.uniforms.tWorld.value = V.world.texture;
    comp.uniforms.tDepth.value = V.depth;
    comp.uniforms.tHands.value = V.hands.texture;
    comp.uniforms.tSpirit.value = V.spirit.texture;
    comp.uniforms.uRes.value.set(w, h);
    for (const m of V.mats) { m.uniforms.uDepth.value = V.depth; m.uniforms.uRes.value.set(sw, sh); }
    V.havePrev = false;
  }
  function free() {
    for (const k of ['world', 'hands', 'spirit']) if (V[k]) { V[k].dispose(); V[k] = null; }
    if (V.depth) { V.depth.dispose(); V.depth = null; }
    V.w = V.h = 0;
  }

  /* ---- the pass to the screen ---- */
  const comp = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    depthTest: false, depthWrite: false, toneMapped: true,
    uniforms: {
      tWorld: { value: null }, tDepth: { value: null }, tHands: { value: null }, tSpirit: { value: null },
      uRes: { value: new THREE.Vector2(1, 1) },
      uNear: { value: 0.1 }, uFar: { value: 100 },
      uInvProj: { value: new THREE.Matrix4() }, uCamWorld: { value: new THREE.Matrix4() }, uPrevVP: { value: new THREE.Matrix4() },
      uEye: { value: new THREE.Vector3() },
      uR: { value: 0 }, uSoft: { value: 0.35 }, uBand: { value: 0.7 }, uMoving: { value: 0 },
      uK: { value: 0 }, uBlur: { value: 0.45 }, uVig: { value: 0.3 }, uLine: { value: 0.16 }, uSky: { value: 70 },
      uFront: { value: new THREE.Color(0.55, 0.95, 1.0) }, uLineCol: { value: new THREE.Color(0.35, 0.75, 1.0) },
      uHandsAt: { value: 0.45 }, uTime: { value: 0 }, uInvert: { value: 1 }
    },
    vertexShader: /* glsl */`
      out vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: /* glsl */`
      precision highp float;
      in vec2 vUv;
      out vec4 outColor;
      uniform sampler2D tWorld, tDepth, tHands, tSpirit;
      uniform vec2 uRes;
      uniform float uNear, uFar, uR, uSoft, uBand, uMoving, uK, uBlur, uVig, uLine, uSky, uHandsAt, uTime, uInvert;
      uniform mat4 uInvProj, uCamWorld, uPrevVP;
      uniform vec3 uEye, uFront, uLineCol;
      float viewZ(float d) { return (uNear * uFar) / ((uFar - uNear) * d - uFar); }   // negative in front
      vec3 worldAt(vec2 uv, float d) {
        vec4 v = uInvProj * vec4(uv * 2.0 - 1.0, d * 2.0 - 1.0, 1.0);
        v /= v.w;
        return (uCamWorld * v).xyz;
      }
      vec3 disp(vec3 lin) { return linearToOutputTexel(vec4(toneMapping(lin), 1.0)).rgb; }
      float invAt(float dist) { return 1.0 - smoothstep(uR - uSoft, uR + uSoft, dist); }
      float zAt(vec2 uv) { return -viewZ(texture(tDepth, uv).r); }
      void main() {
        vec2 px = 1.0 / uRes;
        float d = texture(tDepth, vUv).r;
        bool sky = d >= 0.99999;
        vec3 wp = worldAt(vUv, sky ? 0.9999 : d);
        float dist = sky ? uSky : distance(wp, uEye);
        float inv = invAt(dist) * uInvert;
        /* the world's light, blurred a little by the camera's own movement where the vision has it */
        vec3 lin = texture(tWorld, vUv).rgb;
        if (inv > 0.01 && uBlur > 0.0 && !sky) {
          vec4 pc = uPrevVP * vec4(wp, 1.0);
          vec2 puv = pc.xy / pc.w * 0.5 + 0.5;
          vec2 vel = (vUv - puv) * uBlur * inv;
          float vl = length(vel);
          if (vl > 0.035) vel *= 0.035 / vl;
          if (vl > 0.0008) {
            vec3 acc = vec3(0.0);
            for (int i = 0; i < 7; i++) { float f = float(i) / 6.0 - 0.5; acc += texture(tWorld, vUv + vel * f).rgb; }
            lin = acc / 7.0;
          }
        }
        vec3 c = disp(lin);
        /* the edges: the depth's slope and its bend (silhouettes, corners, creases), and a little of the colour's */
        float zc = zAt(vUv);
        vec2 o = px * 1.5;
        float zl = zAt(vUv - vec2(o.x, 0.0)), zr = zAt(vUv + vec2(o.x, 0.0)), zd = zAt(vUv - vec2(0.0, o.y)), zu = zAt(vUv + vec2(0.0, o.y));
        float zs = max(zc, 0.05);
        float slope = length(vec2(zr - zl, zu - zd)) / zs;
        float bend = abs(zl + zr + zd + zu - 4.0 * zc) / zs;
        float e = clamp(smoothstep(0.06, 0.32, slope) * 0.7 + smoothstep(0.006, 0.05, bend), 0.0, 1.0);
        vec3 cl = disp(texture(tWorld, vUv - vec2(o.x, 0.0)).rgb), cr = disp(texture(tWorld, vUv + vec2(o.x, 0.0)).rgb);
        vec3 cdn = disp(texture(tWorld, vUv - vec2(0.0, o.y)).rgb), cup = disp(texture(tWorld, vUv + vec2(0.0, o.y)).rgb);
        float lum = length(vec2(dot(cr - cl, vec3(0.299, 0.587, 0.114)), dot(cup - cdn, vec3(0.299, 0.587, 0.114))));
        e = clamp(e + smoothstep(0.10, 0.45, lum) * 0.45, 0.0, 1.0);
        if (sky) e = 0.0;
        /* the colour turned where the wave has passed, the lines kept faintly behind it */
        vec3 col = mix(c, vec3(1.0) - c, inv);
        col += uLineCol * e * uLine * inv;
        /* the front: a band of light where the wave is, every line in it burning */
        /* the FRONT: a thin line of light where the wave is now (12 cm through the room, wider as it runs out), a faint
           glow of its own on every surface it crosses, and every edge it crosses burning in it (second light, 17 Nov: at
           0.05 the front read on a flat floor only as the edge of the negative, not as a wave of light passing) */
        float bw = max(0.05, uBand + uR * 0.02);
        float band = exp(-pow((dist - uR) / bw, 2.0)) * uMoving * uInvert;
        col += uFront * band * (0.22 + 2.6 * e);
        /* the spirits, with their glow (the target's smaller levels), where the vision has them. LAID ON, never added:
           the vision turns a dark room nearly white, and light added to white is lost; a colour laid over by its own
           strength reads on a white room and on a black one alike (the body faint, the outline burning) */
        vec4 hs = textureLod(tSpirit, vUv, 2.5) * 0.8 + textureLod(tSpirit, vUv, 4.0) * 0.7;
        float ha = clamp(hs.a, 0.0, 1.0) * uInvert;
        if (ha > 0.001) col = mix(col, clamp(hs.rgb / max(hs.a, 0.0001), 0.0, 1.0), ha * 0.55);
        vec4 sp = texture(tSpirit, vUv);
        float sa = clamp(sp.a * 1.15, 0.0, 0.94) * uInvert;
        if (sa > 0.001) col = mix(col, clamp(sp.rgb / max(sp.a, 0.0001) * 1.08, 0.0, 1.0), sa);
        /* his hands, over everything: turned with the world once the wave has left him */
        vec4 h = texture(tHands, vUv);
        if (h.a > 0.002) {
          vec3 hc = disp(h.rgb / max(h.a, 0.0001));
          float hinv = invAt(uHandsAt) * uInvert;
          hc = mix(hc, vec3(1.0) - hc, hinv);
          col = mix(col, hc, clamp(h.a, 0.0, 1.0));
        }
        /* a slight vignette */
        vec2 q = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
        float vg = smoothstep(0.38, 1.05, length(q) * 1.15);
        col *= 1.0 - uVig * uK * vg;
        outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
      }`
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), comp);
  quad.frustumCulled = false;
  const compScene = new THREE.Scene();
  compScene.add(quad);
  const compCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  /* ---- a spirit's own material: a glowing silhouette (works on a skinned body: three's normal material underneath) ---- */
  function spiritMaterial(o = {}) {
    const m = new THREE.MeshNormalMaterial({ side: THREE.FrontSide });
    m.transparent = true; m.depthWrite = false; m.depthTest = false;
    m.blending = THREE.CustomBlending; m.blendSrc = THREE.OneFactor; m.blendDst = THREE.OneFactor; m.blendEquation = THREE.AddEquation;
    m.blendSrcAlpha = THREE.OneFactor; m.blendDstAlpha = THREE.OneFactor; m.blendEquationAlpha = THREE.AddEquation;
    m.fog = false; m.toneMapped = false;
    const col = new THREE.Color(o.color == null ? 0xff3344 : o.color);
    const U = {
      uColor: { value: col }, uFill: { value: o.fill == null ? 0.1 : o.fill }, uRim: { value: o.rim == null ? 1.7 : o.rim },
      uPow: { value: o.power == null ? 2.4 : o.power }, uXray: { value: o.xray == null ? 0.3 : o.xray },
      uFlick: { value: o.flicker == null ? 0.25 : o.flicker }, uAlpha: { value: 1 },
      uR: { value: 0 }, uSoft: { value: 0.35 }, uEye: { value: new THREE.Vector3() }, uTime: { value: 0 },
      uDepth: { value: V.depth }, uRes: { value: new THREE.Vector2(Math.max(2, V.w >> 1), Math.max(2, V.h >> 1)) }
    };
    m.uniforms = U;
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, U);
      sh.vertexShader = 'varying vec3 vSvWorld;\n' + sh.vertexShader.replace('#include <project_vertex>',
        '#include <project_vertex>\n  vSvWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      sh.fragmentShader = 'varying vec3 vSvWorld;\nuniform vec3 uColor, uEye;\nuniform float uFill, uRim, uPow, uXray, uFlick, uAlpha, uR, uSoft, uTime;\n'
        + 'uniform sampler2D uDepth;\nuniform vec2 uRes;\n'
        + sh.fragmentShader.replace(/gl_FragColor\s*=\s*vec4\(\s*normalize\(\s*normal\s*\)\s*\*\s*0\.5\s*\+\s*0\.5\s*,\s*diffuseColor\.a\s*\);/,
        `vec3 svN = normalize(normal);
         float sv_f = pow(1.0 - clamp(abs(svN.z), 0.0, 1.0), uPow);
         float sv_reveal = 1.0 - smoothstep(uR - uSoft, uR + uSoft, distance(vSvWorld, uEye));
         float sv_wd = texture2D(uDepth, gl_FragCoord.xy / uRes).r;
         float sv_occ = gl_FragCoord.z > sv_wd + 0.00002 ? uXray : 1.0;
         float sv_n = 0.85 + 0.15 * sin(uTime * 7.3 + vSvWorld.y * 11.0 + vSvWorld.x * 5.0);
         float sv_k = (uFill + uRim * sv_f) * sv_reveal * sv_occ * mix(1.0, sv_n, uFlick) * uAlpha;
         gl_FragColor = vec4(uColor * sv_k, sv_k);`);
    };
    m.customProgramCacheKey = () => 'spiritvision1';
    V.mats.add(m);
    return m;
  }

  /* ---- one frame ---- */
  function render(o) {
    const { scene, camera, vmScene, vmCam, drawHands } = o;
    renderer.getDrawingBufferSize(_sz);
    const w = _sz.x | 0, h = _sz.y | 0;
    if (w < 2 || h < 2) return false;
    targets(w, h);
    const prevTarget = renderer.getRenderTarget();
    const clr = renderer.getClearColor(_cc).getHex(), cla = renderer.getClearAlpha();
    const autoClr = renderer.autoClear, smAuto = renderer.shadowMap.autoUpdate;
    camera.updateMatrixWorld();
    _eye.setFromMatrixPosition(camera.matrixWorld);
    try {
      /* 1 · the world */
      renderer.setRenderTarget(V.world);
      renderer.autoClear = true;
      renderer.render(scene, camera);
      renderer.shadowMap.autoUpdate = false;             // the passes after it never redraw a shadow
      /* 2 · his hands */
      renderer.setRenderTarget(V.hands);
      renderer.setClearColor(0x000000, 0);
      renderer.clear(true, true, false);
      if (drawHands) { renderer.autoClear = false; renderer.render(vmScene, vmCam); renderer.autoClear = true; }
      /* 3 · the spirits */
      renderer.setRenderTarget(V.spirit);
      renderer.clear(true, false, false);
      if (V.mats.size && o.spirits !== false) {
        const bg = scene.background, env = scene.environment, mask = camera.layers.mask;
        scene.background = null;
        camera.layers.set(VIS_LAYER);
        for (const m of V.mats) {
          const U = m.uniforms;
          U.uR.value = o.R; U.uSoft.value = o.soft == null ? 0.35 : o.soft; U.uEye.value.copy(_eye); U.uTime.value = o.time || 0;
          U.uDepth.value = V.depth; U.uRes.value.set(V.spirit.width, V.spirit.height);
        }
        renderer.autoClear = false;
        renderer.render(scene, camera);
        renderer.autoClear = true;
        camera.layers.mask = mask; scene.background = bg; scene.environment = env;
      }
      renderer.setClearColor(clr, cla);
      /* 4 · to the screen */
      const U = comp.uniforms;
      U.uNear.value = camera.near; U.uFar.value = camera.far;
      U.uInvProj.value.copy(camera.projectionMatrixInverse);
      U.uCamWorld.value.copy(camera.matrixWorld);
      _vp.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      U.uPrevVP.value.copy(V.havePrev ? V.prevVP : _vp);
      U.uEye.value.copy(_eye);
      U.uR.value = o.R; U.uSoft.value = o.soft == null ? 0.35 : o.soft;
      U.uBand.value = o.band == null ? 0.7 : o.band; U.uMoving.value = o.moving || 0;
      U.uK.value = o.k || 0; U.uBlur.value = o.blur == null ? 0.45 : o.blur; U.uVig.value = o.vignette == null ? 0.3 : o.vignette;
      U.uLine.value = o.line == null ? 0.16 : o.line; U.uSky.value = o.sky == null ? 70 : o.sky;
      U.uHandsAt.value = o.handsAt == null ? 0.45 : o.handsAt; U.uTime.value = o.time || 0;
      U.uInvert.value = o.invert == null ? 1 : o.invert;
      if (o.front) U.uFront.value.set(o.front);
      if (o.lineColor) U.uLineCol.value.set(o.lineColor);
      renderer.setRenderTarget(prevTarget);
      renderer.render(compScene, compCam);
      V.prevVP.copy(_vp); V.havePrev = true;
      V.frames++;
    } catch (err) {
      V.err = String(err && err.message || err);
      renderer.setRenderTarget(prevTarget);
      renderer.setClearColor(clr, cla);
      throw err;
    } finally {
      renderer.autoClear = autoClr; renderer.shadowMap.autoUpdate = smAuto;
    }
    return true;
  }
  /* the next frame drawn without the vision forgets the last camera, so a blur never reaches across a gap */
  function idle() { V.havePrev = false; }
  function dispose() {
    free();
    comp.dispose(); quad.geometry.dispose();
    for (const m of V.mats) m.dispose();
    V.mats.clear();
  }
  function forget(m) { if (m && V.mats.delete(m)) m.dispose(); }
  return { render, idle, dispose, spiritMaterial, forget, state: V, floatOk, samples: SAMPLES };
}
