"use client";

/*
  Fondo del reflector: un fragment shader a pantalla completa (OGL) que dibuja un haz
  volumétrico azul institucional barriendo una atmósfera cálida de galería. El ORIGEN del
  haz se desplaza de izquierda a derecha conforme avanza el scroll (uScroll 0..1), como un
  reflector de escenario que recorre la página. Sobre el hueso (fondo CSS), el haz compone
  con alfa baja para no comprometer el contraste del texto: la luz vive en los márgenes y la
  cabecera, nunca "apaga" la tinta profunda del cuerpo.

  Se monta con mountFullscreenShader del andamiaje compartido (inyecta uTime/uResolution).
  Guardas: solo con WebGL disponible y sin prefers-reduced-motion; si no, no monta y queda
  el degradado estático de .reflector-beam-layer como fallback legible. Lee el progreso de
  scroll desde una ref mutable que actualiza el ScrollTrigger global de la landing.
*/

import { useEffect, useRef, type RefObject } from "react";
import {
  isWebglAvailable,
  mountFullscreenShader,
} from "@/components/premium/_shared/oglScene";
import { prefersReducedMotionNow } from "@/components/premium/_shared/useReducedMotion";

type BeamCanvasProps = {
  progressRef: RefObject<number>;
};

const BEAM_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uScroll;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 3; i++) {
      v += amp * noise(p);
      p *= 2.03;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);

    // Origen del haz: recorre el borde superior con el scroll. Ligera respiración lateral.
    float sweep = mix(0.14, 0.86, clamp(uScroll, 0.0, 1.0));
    sweep += 0.02 * sin(uTime * 0.35);
    vec2 src = vec2(sweep, 1.16);

    // Vector fragmento -> origen, corregido por aspecto para un cono redondo.
    vec2 d = uv - src;
    d.x *= aspect;
    float dist = length(d);

    // Cono radial suave (caída del reflector).
    float cone = smoothstep(1.15, 0.0, dist);
    cone = pow(cone, 1.7);

    // Abanico de godrays: bandas angulares tenues alrededor del eje del haz.
    float ang = atan(d.y, d.x);
    float streak = 0.5 + 0.5 * sin(ang * 13.0 + uTime * 0.18);
    streak = pow(clamp(streak, 0.0, 1.0), 3.0);

    // Bruma de atmósfera de baja frecuencia (polvo en el haz).
    float haze = fbm(uv * 2.4 + vec2(uTime * 0.025, uScroll * 0.6));

    // Envolvente de respiración muy leve.
    float breathe = 0.86 + 0.14 * sin(uTime * 0.4);

    float beam = cone * (0.5 + 0.5 * streak) * (0.72 + 0.55 * haze) * breathe;

    // Charco de luz reflejado abajo, para dar profundidad de escenario.
    float floorGlow = smoothstep(0.55, 0.0, abs(uv.y - 0.04)) *
      smoothstep(0.6, 0.0, abs(uv.x - sweep) * aspect) * 0.35;

    float intensity = clamp(beam * 0.4 + floorGlow, 0.0, 0.46);

    // Azul institucional UTMACH #b4822d en espacio lineal aproximado.
    vec3 beamColor = vec3(0.706, 0.510, 0.176);

    gl_FragColor = vec4(beamColor, intensity);
  }
`;

export function BeamCanvas({ progressRef }: BeamCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    if (!isWebglAvailable() || prefersReducedMotionNow()) {
      return;
    }

    const handle = mountFullscreenShader({
      canvas,
      fragment: BEAM_FRAGMENT,
      uniforms: {
        uScroll: { value: 0 },
      },
      onFrame: (_time, uniforms) => {
        const target = progressRef.current ?? 0;
        const current = (uniforms.uScroll.value as number) ?? 0;
        uniforms.uScroll.value = current + (target - current) * 0.08;
      },
    });

    return () => handle.destroy();
  }, [progressRef]);

  return (
    <div className="reflector-beam-layer" aria-hidden>
      <canvas ref={canvasRef} />
    </div>
  );
}
