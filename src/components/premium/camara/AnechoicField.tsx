"use client";

/*
  Campo de presión sonora — escena OGL a medida de la dirección "Cámara Anecoica".
  Una nube de puntos que representa la huella de la voz dentro de una sala anecoica.
  En reposo (parte alta del scroll) las partículas están dispersas y respiran con
  lentitud, como ruido acústico sin domar. Conforme el usuario desciende, el progreso
  de scroll alimenta el uniform uCoalesce y el campo colapsa desde el ruido disperso
  hacia una onda estacionaria coherente sobre una retícula: la metáfora de ganar el
  dominio de la palabra.

  El ciclo de vida delicado (renderer, cámara perspectiva, resize, pausa por
  visibilidad, limpieza del contexto) se apoya en createVisibilityAwareRaf del módulo
  compartido oglScene. El componente asume que el montador (CamaraFieldMount) ya
  verificó soporte WebGL y ausencia de reduced-motion antes de renderizarlo; aun así
  guarda internamente por seguridad y no toca window fuera del efecto de cliente.
*/

import { useEffect, useRef } from "react";
import { Renderer, Camera, Geometry, Program, Mesh, Vec2, Vec3 } from "ogl";
import {
  createVisibilityAwareRaf,
  isWebglAvailable,
} from "@/components/premium/_shared/oglScene";

const DPR_CAP = 2;
const MOBILE_BREAKPOINT_QUERY = "(max-width: 768px)";
const GRID_COLUMNS_DESKTOP = 150;
const GRID_ROWS_DESKTOP = 84;
const GRID_COLUMNS_MOBILE = 90;
const GRID_ROWS_MOBILE = 52;
const FIELD_SPAN_X = 4.4;
const FIELD_SPAN_Y = 2.8;
const CAMERA_DISTANCE = 4;
const CAMERA_FOV = 45;
const COALESCE_LERP = 0.05;
const POINTER_LERP = 0.05;
const POINTER_INFLUENCE = 0.3;

const COLOR_LOW = new Vec3(0.706, 0.510, 0.176);
const COLOR_HIGH = new Vec3(0.906, 0.714, 0.333);
const COLOR_FOG = new Vec3(0.031, 0.024, 0.012);

const VERTEX_SHADER = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uCoalesce;
  uniform float uSize;
  uniform float uDpr;
  uniform vec2 uPointer;

  varying float vGlow;
  varying float vDepth;
  varying float vEdge;

  void main() {
    float t = uTime;
    float seed = random.w;

    vec3 home = position;
    float wave = sin(home.x * 3.0 + t * 0.6) * cos(home.y * 2.2 - t * 0.4);
    home.z += wave * 0.2 * uCoalesce;
    home.xy *= 1.0 + 0.02 * sin(t * 0.5);

    vec3 drift = vec3(
      sin(t * 0.3 + seed * 6.2831),
      cos(t * 0.24 + seed * 5.0),
      sin(t * 0.2 + seed * 3.1416)
    );
    vec3 dispersed = position + random.xyz * 0.95 + drift * 0.28;

    float k = smoothstep(0.0, 1.0, uCoalesce);
    vec3 pos = mix(dispersed, home, k);
    pos.xy += uPointer * (0.05 + abs(pos.z) * 0.05);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float dist = -mvPosition.z;
    vDepth = dist;
    vGlow = mix(0.3, 1.0, k) * (0.6 + 0.4 * sin(home.x * 3.0 + t * 0.6));
    vEdge = 1.0 - smoothstep(0.55, 1.0, length(position.xy / vec2(2.3, 1.5)));

    float size = uSize * uDpr / max(dist, 0.001);
    gl_PointSize = clamp(size, 1.0, 24.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform vec3 uColorLow;
  uniform vec3 uColorHigh;
  uniform vec3 uColorFog;
  uniform float uOpacity;

  varying float vGlow;
  varying float vDepth;
  varying float vEdge;

  void main() {
    vec2 coord = gl_PointCoord - 0.5;
    float d = length(coord);
    float mask = smoothstep(0.5, 0.0, d);
    if (mask <= 0.001) discard;

    vec3 col = mix(uColorLow, uColorHigh, clamp(vGlow, 0.0, 1.0));
    float fog = smoothstep(2.2, 6.5, vDepth);
    col = mix(col, uColorFog, fog);

    float alpha = mask * uOpacity * vEdge * (1.0 - fog * 0.55);
    gl_FragColor = vec4(col, alpha);
  }
`;

function buildGrid(columns: number, rows: number): {
  positions: Float32Array;
  randoms: Float32Array;
} {
  const count = columns * rows;
  const positions = new Float32Array(count * 3);
  const randoms = new Float32Array(count * 4);

  let positionOffset = 0;
  let randomOffset = 0;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const x = (column / (columns - 1) - 0.5) * FIELD_SPAN_X;
      const y = (row / (rows - 1) - 0.5) * FIELD_SPAN_Y;

      positions[positionOffset] = x;
      positions[positionOffset + 1] = y;
      positions[positionOffset + 2] = 0;
      positionOffset += 3;

      randoms[randomOffset] = Math.random() * 2 - 1;
      randoms[randomOffset + 1] = Math.random() * 2 - 1;
      randoms[randomOffset + 2] = Math.random() * 2 - 1;
      randoms[randomOffset + 3] = Math.random();
      randomOffset += 4;
    }
  }

  return { positions, randoms };
}

export function AnechoicField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isWebglAvailable()) {
      return;
    }

    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    const isMobile = window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches;
    const columns = isMobile ? GRID_COLUMNS_MOBILE : GRID_COLUMNS_DESKTOP;
    const rows = isMobile ? GRID_ROWS_MOBILE : GRID_ROWS_DESKTOP;

    const renderer = new Renderer({
      canvas,
      alpha: true,
      antialias: false,
      dpr: devicePixelRatio,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, {
      fov: CAMERA_FOV,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 100,
    });
    camera.position.z = CAMERA_DISTANCE;

    const { positions, randoms } = buildGrid(columns, rows);
    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
    });

    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uCoalesce: { value: 0 },
        uSize: { value: 18 },
        uDpr: { value: devicePixelRatio },
        uPointer: { value: new Vec2(0, 0) },
        uColorLow: { value: COLOR_LOW },
        uColorHigh: { value: COLOR_HIGH },
        uColorFog: { value: COLOR_FOG },
        uOpacity: { value: 0.92 },
      },
    });

    const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.perspective({ aspect: window.innerWidth / window.innerHeight });
    };
    resize();
    window.addEventListener("resize", resize);

    let coalesce = 0;
    let pointerX = 0;
    let pointerY = 0;
    let pointerTargetX = 0;
    let pointerTargetY = 0;

    const handlePointerMove = (event: PointerEvent) => {
      pointerTargetX = (event.clientX / window.innerWidth) * 2 - 1;
      pointerTargetY = -((event.clientY / window.innerHeight) * 2 - 1);
      pointerTargetX *= POINTER_INFLUENCE;
      pointerTargetY *= POINTER_INFLUENCE;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const loop = createVisibilityAwareRaf((timeSeconds) => {
      if (gl.isContextLost()) {
        return;
      }

      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress =
        scrollable > 0
          ? Math.min(Math.max(window.scrollY / scrollable, 0), 1)
          : 0;

      coalesce += (scrollProgress - coalesce) * COALESCE_LERP;
      pointerX += (pointerTargetX - pointerX) * POINTER_LERP;
      pointerY += (pointerTargetY - pointerY) * POINTER_LERP;

      program.uniforms.uTime.value = timeSeconds;
      program.uniforms.uCoalesce.value = coalesce;
      (program.uniforms.uPointer.value as Vec2).set(pointerX, pointerY);

      renderer.render({ scene: mesh, camera });
    });

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      loop.stop();
    };
    canvas.addEventListener("webglcontextlost", handleContextLost);

    loop.start();

    return () => {
      loop.stop();
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="cam-canvas" />;
}
