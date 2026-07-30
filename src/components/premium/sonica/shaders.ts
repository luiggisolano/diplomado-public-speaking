/*
  Shaders GLSL de la dirección "Sónica". El concepto es la palabra como materia
  que vibra: el fondo no es una imagen, es el MEDIO en el que viaja el sonido.
  Un campo de bandas (registro de espectrograma / onda de voz) sobre navy profundo,
  deformado por dominio (domain warping con fbm) y desplazado en sus canales RGB
  (aberración cromática) según la VELOCIDAD del scroll y la posición del puntero.
  Todo el color energético vive aquí; el texto legible va en HTML encima.

  GLSL ES 1.00 (gl_FragColor / varying): OGL no antepone versión, por lo que el
  shader compila como ES 1.00 incluso sobre un contexto WebGL2 retrocompatible.
*/

export const SONICA_BACKDROP_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uScrollVelocity;
  uniform vec2 uPointer;
  uniform float uReveal;

  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * valueNoise(p);
      p *= 2.02;
      amplitude *= 0.5;
    }
    return value;
  }

  vec3 sonicPalette(float t) {
    vec3 abyss = vec3(0.031, 0.024, 0.012);
    vec3 institutional = vec3(0.706, 0.510, 0.176);
    vec3 electric = vec3(0.906, 0.714, 0.333);
    vec3 col = mix(abyss, institutional, smoothstep(0.18, 0.62, t));
    col = mix(col, electric, smoothstep(0.6, 0.98, t));
    return col;
  }

  float soundField(vec2 uv, float t) {
    vec2 warped = uv + 0.18 * vec2(fbm(uv * 2.1 + t * 0.05), fbm(uv * 2.1 - t * 0.04));
    float bands = sin(warped.y * 6.4 + warped.x * 1.4 + t * 0.55 + fbm(warped * 3.0 + t * 0.1) * 3.2);
    return bands * 0.5 + 0.5;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv - 0.5;
    p.x *= uResolution.x / max(uResolution.y, 1.0);

    float velocity = clamp(uScrollVelocity, 0.0, 1.0);
    float aberration = 0.003 + velocity * 0.028;
    vec2 pointerWarp = uPointer * 0.055;

    vec2 dir = normalize(p + vec2(0.0001));
    vec2 channelOffset = dir * aberration;

    float redField = soundField(p + channelOffset + pointerWarp, uTime);
    float greenField = soundField(p + pointerWarp, uTime);
    float blueField = soundField(p - channelOffset + pointerWarp, uTime);

    vec3 col = vec3(
      sonicPalette(redField).r,
      sonicPalette(greenField).g,
      sonicPalette(blueField).b
    );

    float vignette = smoothstep(1.25, 0.15, length(p));
    col *= mix(0.28, 1.0, vignette);
    col *= 0.62;
    col += velocity * 0.05 * vec3(0.906, 0.714, 0.333);

    float grain = hash(uv * uResolution.xy * 0.5 + uTime);
    col += (grain - 0.5) * 0.028;

    col *= clamp(uReveal, 0.0, 1.0);

    gl_FragColor = vec4(max(col, 0.0), 1.0);
  }
`;
