"use client";

/*
  Utilidades OGL compartidas por las landings de gama alta. OGL es la librería WebGL
  ligera y shader-first de la escena Awwwards (epiminds, madeinevolve). Este módulo
  centraliza el ciclo de vida delicado (creación del renderer, cap de DPR, resize,
  pausa por visibilidad, guardas de soporte WebGL y de reduced-motion, limpieza) para
  que cada dirección de arte solo escriba SU shader/escena, sin repetir el andamiaje.

  Dos niveles de API:
  - mountFullscreenShader(): monta un fragment shader a pantalla completa sobre un
    triángulo (fondos de Reflector y Sónica). Inyecta uResolution y uTime.
  - createVisibilityAwareRaf(): loop de rAF que se pausa con la pestaña oculta, para
    escenas OGL a medida (campo de partículas de Cámara Anecoica).
*/

import { Renderer, Program, Mesh, Triangle, Vec2 } from "ogl";

const DEFAULT_DPR_CAP = 2;

/*
  Cache del soporte WebGL. El navegador limita el número de contextos WebGL vivos por
  página; cada probe que no se libera consume uno de ese presupuesto y, al agotarse,
  el navegador dispara webglcontextlost sobre la escena real y el programa OGL queda
  linkeado contra un contexto muerto (uniformLocations undefined → crash en cada frame).
  Por eso el probe se crea UNA sola vez, se libera de inmediato y su resultado se memoiza.
*/
let webglSupportCache: boolean | null = null;

export function isWebglAvailable(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  if (webglSupportCache !== null) {
    return webglSupportCache;
  }
  try {
    const canvas = document.createElement("canvas");
    const probeContext = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    const supported = Boolean(window.WebGLRenderingContext && probeContext);

    if (probeContext) {
      const loseContext = probeContext.getExtension("WEBGL_lose_context");
      loseContext?.loseContext();
    }

    webglSupportCache = supported;
    return supported;
  } catch {
    webglSupportCache = false;
    return false;
  }
}

type VisibilityAwareRaf = {
  start: () => void;
  stop: () => void;
};

export function createVisibilityAwareRaf(
  onFrame: (timeSeconds: number) => void,
): VisibilityAwareRaf {
  let rafId = 0;
  let running = false;

  const tick = (timeMs: number) => {
    if (!running) {
      return;
    }
    onFrame(timeMs * 0.001);
    rafId = requestAnimationFrame(tick);
  };

  const handleVisibility = () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  };

  function start() {
    if (running) {
      return;
    }
    running = true;
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  document.addEventListener("visibilitychange", handleVisibility);

  return {
    start,
    stop: () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    },
  };
}

type FullscreenShaderOptions = {
  canvas: HTMLCanvasElement;
  fragment: string;
  uniforms?: Record<string, { value: unknown }>;
  dprCap?: number;
  onFrame?: (timeSeconds: number, uniforms: Record<string, { value: unknown }>) => void;
};

type FullscreenShaderHandle = {
  uniforms: Record<string, { value: unknown }>;
  destroy: () => void;
};

const PASSTHROUGH_VERTEX = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export function mountFullscreenShader(
  options: FullscreenShaderOptions,
): FullscreenShaderHandle {
  const { canvas, fragment, onFrame } = options;
  const dprCap = options.dprCap ?? DEFAULT_DPR_CAP;

  const renderer = new Renderer({
    canvas,
    alpha: true,
    antialias: false,
    dpr: Math.min(window.devicePixelRatio || 1, dprCap),
  });
  const gl = renderer.gl;

  const uniforms: Record<string, { value: unknown }> = {
    uTime: { value: 0 },
    uResolution: { value: new Vec2(1, 1) },
    ...(options.uniforms ?? {}),
  };

  const geometry = new Triangle(gl);
  const program = new Program(gl, {
    vertex: PASSTHROUGH_VERTEX,
    fragment,
    uniforms,
  });
  const mesh = new Mesh(gl, { geometry, program });

  const resize = () => {
    const parent = canvas.parentElement;
    const width = parent?.clientWidth ?? window.innerWidth;
    const height = parent?.clientHeight ?? window.innerHeight;
    renderer.setSize(width, height);
    (uniforms.uResolution.value as Vec2).set(
      gl.drawingBufferWidth,
      gl.drawingBufferHeight,
    );
  };
  resize();
  window.addEventListener("resize", resize);

  const loop = createVisibilityAwareRaf((timeSeconds) => {
    if (gl.isContextLost()) {
      return;
    }
    uniforms.uTime.value = timeSeconds;
    onFrame?.(timeSeconds, uniforms);
    renderer.render({ scene: mesh });
  });

  const handleContextLost = (event: Event) => {
    event.preventDefault();
    loop.stop();
  };
  canvas.addEventListener("webglcontextlost", handleContextLost);

  loop.start();

  return {
    uniforms,
    destroy: () => {
      loop.stop();
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      window.removeEventListener("resize", resize);
    },
  };
}
