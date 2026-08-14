/**
 * "Last Light" — the generative hero scene.
 *
 * Raw WebGL1, one fullscreen triangle, one fragment shader. No three.js:
 * the whole scene is analytic (fbm ridgelines, gradient sky, hash stars),
 * so a scene graph would be pure overhead — this keeps the lazy-loaded
 * chunk ~8 KB instead of ~150 KB and first paint untouched.
 *
 * The scene: five ridgelines receding into an ember horizon at dusk,
 * stars coming out overhead, drifting valley mist, and a single headlight
 * working its way across the nearest ridge — one rider on the mountain
 * at last light.
 */

export interface DuskSceneOptions {
  /** "low" halves resolution and octaves for weak devices. */
  quality: "high" | "low";
}

export interface DuskSceneHandle {
  /** Begin the render loop (no-op if already running). */
  start(): void;
  /** Stop the render loop (offscreen / tab hidden). */
  stop(): void;
  /** Render exactly one static frame — the reduced-motion poster. */
  renderStill(): void;
  /** Pointer parallax, both axes in [-1, 1]. */
  setPointer(x: number, y: number): void;
  destroy(): void;
}

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;

// Palette — must track the CSS tokens in index.css.
const vec3 NIGHT = vec3(0.078, 0.071, 0.145);  // #141225
const vec3 DUSK  = vec3(0.165, 0.129, 0.251);  // #2A2140
const vec3 ROSE  = vec3(0.478, 0.227, 0.306);  // #7A3A4E
const vec3 EMBER = vec3(0.910, 0.384, 0.235);  // #E8623C
const vec3 GOLD  = vec3(1.000, 0.760, 0.420);

const float HORIZON = 0.42;
const float SUN_X = 0.63;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < OCTAVES; i++) {
    v += a * noise(p);
    p = p * 2.13 + vec2(19.7, 7.3);
    a *= 0.5;
  }
  return v;
}

// Ridged fbm — inverted-abs octaves give sharp alpine crests instead of
// the rolling dunes plain value noise produces.
float rfbm(vec2 p) {
  float v = 0.0;
  float a = 0.55;
  for (int i = 0; i < OCTAVES; i++) {
    float n = 1.0 - abs(2.0 * noise(p) - 1.0);
    v += a * n * n;
    p = p * 2.13 + vec2(19.7, 7.3);
    a *= 0.5;
  }
  return v;
}

// Height of ridge layer fi at screen-x, given its drift offset.
float ridge(float x, float fi, float depth, float drift) {
  float freq = mix(2.3, 1.15, depth);
  float base = mix(0.485, 0.15, depth);
  float amp = mix(0.09, 0.26, depth);
  float h = rfbm(vec2(x * freq + drift + fi * 13.7, fi * 7.1));
  return base + (h - 0.38) * amp;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;

  // ---- sky -------------------------------------------------------------
  float up = clamp((uv.y - HORIZON) / (1.0 - HORIZON), 0.0, 1.0);
  vec3 col = mix(DUSK, NIGHT, pow(up, 0.60));

  // ember band hugging the horizon, strongest near the sun azimuth
  float azim = exp(-pow((uv.x - SUN_X) * 1.7, 2.0));
  float band = exp(-pow(max(uv.y - HORIZON, 0.0) * 7.0, 1.5));
  col = mix(col, ROSE, band * 0.62);
  col += EMBER * band * azim * 0.60;

  // sun glow — the light itself has already dropped behind the far ridge
  vec2 sunD = vec2((uv.x - SUN_X) * aspect, (uv.y - HORIZON) * 1.35);
  float sun = exp(-dot(sunD, sunD) * 18.0);
  col += GOLD * sun * 0.50;
  col += EMBER * exp(-dot(sunD, sunD) * 4.0) * 0.22;

  // ---- stars -----------------------------------------------------------
  float starMask = smoothstep(0.12, 0.75, up);
  if (starMask > 0.0) {
    vec2 sp = uv * vec2(aspect, 1.0) * 160.0;
    vec2 cell = floor(sp);
    float h = hash(cell);
    if (h > 0.994) {
      vec2 centre = cell + 0.5 + (vec2(hash(cell + 1.3), hash(cell + 2.7)) - 0.5) * 0.6;
      float d = length(sp - centre);
      float tw = 0.6 + 0.4 * sin(uTime * (0.8 + h * 2.0) + h * 43.0);
      col += vec3(0.85, 0.87, 1.0) * smoothstep(0.45, 0.0, d) * tw * starMask * 0.8;
    }
  }

  // ---- valley mist -----------------------------------------------------
  float mist = fbm(vec2(uv.x * 3.0 - uTime * 0.012, uv.y * 14.0));
  col += ROSE * mist * exp(-pow((uv.y - HORIZON) * 9.0, 2.0)) * 0.28;

  // ---- ridgelines, far to near ------------------------------------------
  float edge = 1.5 / uRes.y;
  for (int i = 0; i < LAYERS; i++) {
    float fi = float(i);
    float depth = fi / float(LAYERS - 1);
    float drift = uTime * mix(0.006, 0.024, depth)
                + uPointer.x * mix(0.008, 0.05, depth);
    float y = ridge(uv.x, fi, depth, drift)
            + uPointer.y * mix(0.002, 0.012, depth);
    float m = 1.0 - smoothstep(y - edge, y + edge, uv.y);

    // aerial perspective: far ridges dissolve into the warm haze
    vec3 haze = mix(ROSE, DUSK, 0.30) + EMBER * azim * 0.30;
    vec3 rock = vec3(0.022, 0.019, 0.048);
    vec3 lc = mix(haze, rock, pow(smoothstep(0.0, 1.0, depth), 0.65));

    // ember rim where a crest catches the last of the light
    float crest = exp(-max(y - uv.y, 0.0) * 90.0);
    lc += EMBER * crest * (1.0 - depth) * azim * 0.35;

    col = mix(col, lc, m);

    // the rider: one headlight working along the middle ridge, up near the
    // skyline where it reads against the glow. Nearer ridges composite
    // after this, so they occlude the light as it passes behind them.
    if (i == LAYERS / 2) {
      float t = fract(uTime * 0.014);
      float hx = mix(-0.12, 1.12, t);
      float hy = ridge(hx, fi, depth, drift) + 0.009;
      vec2 d = (uv - vec2(hx, hy)) * vec2(aspect, 1.0);
      float glow = 0.00045 / (dot(d, d) + 0.00004);
      // trees between the road and us — the light flickers through them
      float flick = 0.35 + 0.65 * smoothstep(0.28, 0.72, noise(vec2(uTime * 1.9, 5.2)));
      col += vec3(1.0, 0.85, 0.62) * min(glow, 2.4) * flick;
    }
  }

  // breathing-room vignette so the headline corner stays quiet
  float vig = smoothstep(1.45, 0.35, length((uv - vec2(0.5, 0.42)) * vec2(1.15, 1.0)));
  col *= mix(0.72, 1.0, vig);

  // dither kills gradient banding on the big sky
  col += (hash(gl_FragCoord.xy * 0.71) - 0.5) / 160.0;

  gl_FragColor = vec4(col, 1.0);
}
`;

export function createDuskScene(
  canvas: HTMLCanvasElement,
  { quality }: DuskSceneOptions,
): DuskSceneHandle | null {
  const gl =
    canvas.getContext("webgl", { antialias: false, alpha: false }) ??
    (canvas.getContext("experimental-webgl", {
      antialias: false,
      alpha: false,
    }) as WebGLRenderingContext | null);
  if (!gl) return null;

  const defines =
    quality === "high"
      ? "#define OCTAVES 5\n#define LAYERS 5\n"
      : "#define OCTAVES 4\n#define LAYERS 4\n";

  const compile = (type: number, src: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      // A compile failure must degrade to the CSS poster, never throw.
      console.error("duskScene shader:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, defines + FRAG);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("duskScene link:", gl.getProgramInfoLog(program));
    return null;
  }
  gl.useProgram(program);

  // One triangle covering the viewport — cheaper than a quad, no index buffer.
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, "uRes");
  const uTime = gl.getUniformLocation(program, "uTime");
  const uPointer = gl.getUniformLocation(program, "uPointer");

  // Mid-range Androids fall over on full-DPR fullscreen shaders; the scene
  // is soft gradients, so a lower internal resolution is invisible.
  const dprCap = quality === "high" ? 1.75 : 1.25;
  const scale = quality === "high" ? 1 : 0.8;

  let raf = 0;
  let running = false;
  let destroyed = false;
  // Start the clock 33s in: the headlight's crossing is ~71s, and this
  // offset puts it mid-frame the moment the scene fades in, instead of
  // making the first visitor wait ten seconds for it to enter.
  const t0 = performance.now() - 33_000;
  // Pointer eases toward the target so parallax feels weighted, not jittery.
  let px = 0;
  let py = 0;
  let tx = 0;
  let ty = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap) * scale;
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };

  const draw = (elapsedMs: number) => {
    resize();
    px += (tx - px) * 0.045;
    py += (ty - py) * 0.045;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, elapsedMs / 1000);
    gl.uniform2f(uPointer, px, py);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const frame = () => {
    if (!running) return;
    draw(performance.now() - t0);
    raf = requestAnimationFrame(frame);
  };

  const ro = new ResizeObserver(() => {
    if (!running && !destroyed) draw(performance.now() - t0);
  });
  ro.observe(canvas);

  return {
    start() {
      if (running || destroyed) return;
      running = true;
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    renderStill() {
      // A fixed time chosen so the poster catches the headlight mid-ridge.
      draw(38_000);
    },
    setPointer(x: number, y: number) {
      tx = x;
      ty = y;
    },
    destroy() {
      destroyed = true;
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
