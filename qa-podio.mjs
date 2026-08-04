/*
  Auditoría instrumentada de la landing Podio, de la sección de cifras hacia abajo.

  Convierte en métrica cada afirmación que la rúbrica lfront exige comprobar, en vez de
  juzgar por captura. Se ejecuta contra el servidor de producción local:

      pnpm exec next start -p 3000
      node qa-podio.mjs

  Cubre, en 1440 / 768 / 390:
    · desborde horizontal real y elementos que se salen de la caja de la página
    · caracteres por línea de todo el texto corrido
    · escala tipográfica y contraste de tamaño entre display y cuerpo
    · contraste WCAG del texto, muestreando los píxeles reales del fondo cuando hay imagen
      detrás (la única forma honesta de medirlo sobre fotografía)
    · que ningún bloque animado quede invisible tras recorrer la página
    · que el motion reversible vuelva a ocultar al subir lo que debe, y solo eso
    · comportamiento con prefers-reduced-motion
    · peso transferido por tipo de recurso
*/

import { createRequire } from "node:module";

const requerir = createRequire(import.meta.url);
const { chromium } = requerir("playwright");

const URL_BASE = process.env.QA_URL ?? "http://localhost:3000";
const RUTA = "/";
const VIEWPORTS = [
  { ancho: 1440, alto: 900, nombre: "1440" },
  { ancho: 768, alto: 1024, nombre: "768" },
  { ancho: 390, alto: 844, nombre: "390" },
];

const MAXIMO_CARACTERES_POR_LINEA = 75;
const CONTRASTE_MINIMO_TEXTO_NORMAL = 4.5;
const CONTRASTE_MINIMO_TEXTO_GRANDE = 3;
const TAMANO_DE_TEXTO_GRANDE_EN_PX = 24;
const MUESTRAS_DE_FONDO_POR_ELEMENTO = 24;

function luminanciaRelativa(r, g, b) {
  const canal = (valor) => {
    const proporcion = valor / 255;
    return proporcion <= 0.03928 ? proporcion / 12.92 : ((proporcion + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
}

function razonDeContraste(colorTexto, colorFondo) {
  const claro = Math.max(luminanciaRelativa(...colorTexto), luminanciaRelativa(...colorFondo));
  const oscuro = Math.min(luminanciaRelativa(...colorTexto), luminanciaRelativa(...colorFondo));
  return (claro + 0.05) / (oscuro + 0.05);
}

async function recorrerLaPaginaEntera(pagina) {
  const alto = await pagina.evaluate(() => document.body.scrollHeight);
  const pasos = Math.ceil(alto / 300);
  for (let paso = 0; paso < pasos; paso += 1) {
    await pagina.mouse.wheel(0, 300);
    await pagina.waitForTimeout(30);
  }
  await pagina.waitForTimeout(2000);
}

async function volverAlPrincipio(pagina) {
  const alto = await pagina.evaluate(() => window.scrollY);
  const pasos = Math.ceil(alto / 400);
  for (let paso = 0; paso < pasos; paso += 1) {
    await pagina.mouse.wheel(0, -400);
    await pagina.waitForTimeout(25);
  }
  await pagina.waitForTimeout(1500);
}

/*
  El contraste sobre fotografía no se puede calcular con el color de fondo computado, porque
  ese color es transparente y detrás hay píxeles distintos en cada punto. Se captura la
  página con el texto oculto, se muestrea la banda que ocupa cada texto y se mide contra el
  peor píxel encontrado, que es el que decide si esa línea se lee o no.
*/
async function medirContrasteSobreImagen(pagina, viewport) {
  const textos = await pagina.evaluate(() => {
    const visible = (elemento) => {
      const caja = elemento.getBoundingClientRect();
      const estilo = getComputedStyle(elemento);
      return (
        caja.width > 0 &&
        caja.height > 0 &&
        estilo.visibility !== "hidden" &&
        parseFloat(estilo.opacity) > 0.5 &&
        caja.top < window.innerHeight &&
        caja.bottom > 0
      );
    };
    const nodos = [...document.querySelectorAll(".pod-root :is(h1,h2,h3,p,li,dt,dd,span,a)")]
      .filter((elemento) => elemento.textContent.trim().length > 2)
      .filter((elemento) => [...elemento.children].every((hijo) => hijo.textContent.trim() === ""))
      .filter(visible);
    return nodos.map((elemento) => {
      const caja = elemento.getBoundingClientRect();
      const estilo = getComputedStyle(elemento);
      return {
        texto: elemento.textContent.trim().slice(0, 40),
        clase: elemento.className?.toString().slice(0, 46) ?? "",
        color: estilo.color,
        tamano: parseFloat(estilo.fontSize),
        peso: estilo.fontWeight,
        caja: { x: caja.x, y: caja.y, w: caja.width, h: caja.height },
      };
    });
  });

  if (textos.length === 0) return [];

  /*
    El texto se oculta con color transparente y NO con visibility: hidden, porque visibility
    esconde el elemento entero: un botón perdería su propio fondo y se acabaría midiendo el
    contraste contra la página que hay detrás en lugar de contra el color sobre el que ese
    texto se lee de verdad.
  */
  const velo = await pagina.addStyleTag({
    content:
      ".pod-root :is(h1,h2,h3,p,li,dt,dd,span,a) { color: transparent !important; text-shadow: none !important; -webkit-text-stroke: 0 !important; }",
  });
  await pagina.waitForTimeout(350);
  const captura = (await pagina.screenshot({ type: "png" })).toString("base64");
  await velo.evaluate((etiqueta) => etiqueta.remove());
  await pagina.waitForTimeout(200);

  /*
    La captura se decodifica dentro del propio Chromium con un canvas fuera de pantalla, en
    vez de con un decodificador de PNG en Node: evita añadir una dependencia solo para el QA
    y el muestreo ocurre en el mismo espacio de coordenadas que midió las cajas.
  */
  const fondos = await pagina.evaluate(
    async ({ capturaEnBase64, cajas, muestras }) => {
      const imagen = new Image();
      imagen.src = `data:image/png;base64,${capturaEnBase64}`;
      await imagen.decode();
      const lienzo = document.createElement("canvas");
      lienzo.width = imagen.naturalWidth;
      lienzo.height = imagen.naturalHeight;
      const contexto = lienzo.getContext("2d", { willReadFrequently: true });
      contexto.drawImage(imagen, 0, 0);
      const escala = imagen.naturalWidth / window.innerWidth;

      return cajas.map((caja) => {
        const puntos = [];
        for (let muestra = 0; muestra < muestras; muestra += 1) {
          const x = Math.round((caja.x + (caja.w * (muestra + 0.5)) / muestras) * escala);
          const y = Math.round((caja.y + caja.h / 2) * escala);
          if (x < 0 || y < 0 || x >= lienzo.width || y >= lienzo.height) continue;
          const pixel = contexto.getImageData(x, y, 1, 1).data;
          puntos.push([pixel[0], pixel[1], pixel[2]]);
        }
        return puntos;
      });
    },
    {
      capturaEnBase64: captura,
      cajas: textos.map((elemento) => elemento.caja),
      muestras: MUESTRAS_DE_FONDO_POR_ELEMENTO,
    },
  );

  return textos.map((elemento, indice) => {
    const partes = elemento.color.match(/[\d.]+/g).map(Number);
    const puntos = fondos[indice] ?? [];
    let peorContraste = Infinity;
    for (const fondo of puntos) {
      peorContraste = Math.min(peorContraste, razonDeContraste(partes.slice(0, 3), fondo));
    }
    const esGrande =
      elemento.tamano >= TAMANO_DE_TEXTO_GRANDE_EN_PX ||
      (elemento.tamano >= 18.66 && Number(elemento.peso) >= 700);
    const minimo = esGrande ? CONTRASTE_MINIMO_TEXTO_GRANDE : CONTRASTE_MINIMO_TEXTO_NORMAL;
    return {
      texto: elemento.texto,
      clase: elemento.clase,
      tamano: Math.round(elemento.tamano),
      contraste: Number.isFinite(peorContraste) ? Number(peorContraste.toFixed(2)) : null,
      minimo,
      pasa: Number.isFinite(peorContraste) ? peorContraste >= minimo : null,
    };
  });
}

async function auditarViewport(navegador, viewport) {
  const contexto = await navegador.newContext({
    viewport: { width: viewport.ancho, height: viewport.alto },
  });
  const pagina = await contexto.newPage();
  const errores = [];
  const fallidas = [];
  const pesos = {};
  pagina.on("console", (mensaje) => mensaje.type() === "error" && errores.push(mensaje.text()));
  pagina.on("pageerror", (error) => errores.push(`pageerror: ${error.message}`));
  pagina.on("requestfailed", (peticion) => fallidas.push(peticion.url()));
  pagina.on("response", async (respuesta) => {
    const tipo = (respuesta.headers()["content-type"] ?? "otro").split(";")[0];
    const largo = Number(respuesta.headers()["content-length"] ?? 0);
    pesos[tipo] = (pesos[tipo] ?? 0) + largo;
  });

  await pagina.goto(`${URL_BASE}${RUTA}`, { waitUntil: "load" });
  await pagina.waitForTimeout(2000);

  await recorrerLaPaginaEntera(pagina);

  const metricas = await pagina.evaluate((maximoCpl) => {
    const anchoVisible = document.documentElement.clientWidth;
    /*
      Solo entra en la medida lo que dibuja texto por sí mismo. Un contenedor cuyo texto
      vive en sus hijos —la fila de rejilla de un síntoma, la lista de sellos del aval—
      tiene el ancho de la retícula y no el de ninguna línea, así que contar sus caracteres
      por línea da una cifra que no describe nada: el aval marcaba 137 y cada síntoma 144
      mientras sus frases medían 58.

      Es una regla general y no una lista de excepciones a dedo, que es lo que evita que
      esta comprobación se vaya relajando bloque a bloque.
    */
    const dibujaTextoPropio = (elemento) =>
      [...elemento.childNodes].some(
        (nodo) => nodo.nodeType === Node.TEXT_NODE && nodo.textContent.trim().length > 0,
      );

    const corridos = [...document.querySelectorAll(".pod-root p, .pod-root li")].filter(
      (elemento) =>
        elemento.offsetParent &&
        elemento.textContent.trim().length > 40 &&
        dibujaTextoPropio(elemento),
    );
    const cpl = corridos.map((elemento) => {
      const tamano = parseFloat(getComputedStyle(elemento).fontSize);
      return Math.round(elemento.getBoundingClientRect().width / (tamano * 0.5));
    });
    const display = [...document.querySelectorAll(".pod-root h2")]
      .filter((elemento) => elemento.offsetParent)
      .map((elemento) => parseFloat(getComputedStyle(elemento).fontSize));
    const cuerpo = corridos.map((elemento) => parseFloat(getComputedStyle(elemento).fontSize));
    const seSalen = [...document.querySelectorAll(".pod-root *")].filter((elemento) => {
      const caja = elemento.getBoundingClientRect();
      return caja.width > 0 && (caja.right > anchoVisible + 1 || caja.left < -1);
    });
    const animados = [...document.querySelectorAll("[class*='reveal'], [class*='pod-anim']")];
    return {
      scrollHorizontal: document.documentElement.scrollWidth - anchoVisible,
      seSalen: seSalen.length,
      seSalenEjemplos: seSalen.slice(0, 5).map((elemento) => ({
        clase: elemento.className?.toString().slice(0, 44),
        derecha: Math.round(elemento.getBoundingClientRect().right),
      })),
      cplMaximo: cpl.length ? Math.max(...cpl) : 0,
      cplSobreMaximo: cpl.filter((valor) => valor > maximoCpl).length,
      parrafos: cpl.length,
      displayMaximo: display.length ? Math.round(Math.max(...display)) : 0,
      cuerpoMediano: cuerpo.length ? Math.round(cuerpo.sort((a, b) => a - b)[Math.floor(cuerpo.length / 2)]) : 0,
      animados: animados.length,
      animadosOcultos: animados.filter((elemento) => parseFloat(getComputedStyle(elemento).opacity) < 0.05).length,
      altoPagina: Math.round(document.body.scrollHeight),
      imagenes: document.querySelectorAll(".pod-root img").length,
      imagenesRotas: [...document.querySelectorAll(".pod-root img")].filter((imagen) => imagen.naturalWidth === 0).length,
    };
  }, MAXIMO_CARACTERES_POR_LINEA);

  const contrastes = await medirContrasteSobreImagen(pagina, viewport);

  await volverAlPrincipio(pagina);
  const trasSubir = await pagina.evaluate(() => {
    const animados = [...document.querySelectorAll("[class*='reveal'], [class*='pod-anim']")];
    return {
      total: animados.length,
      ocultos: animados.filter((elemento) => parseFloat(getComputedStyle(elemento).opacity) < 0.05).length,
    };
  });

  await contexto.close();

  return { viewport: viewport.nombre, metricas, contrastes, trasSubir, errores, fallidas, pesos };
}

async function auditarMovimientoReducido(navegador) {
  const contexto = await navegador.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const pagina = await contexto.newPage();
  await pagina.goto(`${URL_BASE}${RUTA}`, { waitUntil: "load" });
  await pagina.waitForTimeout(2500);
  await recorrerLaPaginaEntera(pagina);
  const resultado = await pagina.evaluate(() => {
    const animados = [...document.querySelectorAll("[class*='reveal'], [class*='pod-anim']")];
    return {
      total: animados.length,
      ocultos: animados.filter((elemento) => parseFloat(getComputedStyle(elemento).opacity) < 0.05).length,
      desplazados: animados.filter((elemento) => getComputedStyle(elemento).transform !== "none").length,
    };
  });
  await contexto.close();
  return resultado;
}

const navegador = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});

let hayFallos = false;

for (const viewport of VIEWPORTS) {
  const informe = await auditarViewport(navegador, viewport);
  const m = informe.metricas;
  const fallosDeContraste = informe.contrastes.filter((elemento) => elemento.pasa === false);
  const pesoTotal = Object.values(informe.pesos).reduce((suma, valor) => suma + valor, 0);

  console.log(`\n${"=".repeat(72)}\n### ${informe.viewport} px\n${"=".repeat(72)}`);
  console.log(`scroll horizontal        ${m.scrollHorizontal} px            ${m.scrollHorizontal === 0 ? "OK" : "FALLA"}`);
  console.log(`elementos fuera de caja  ${m.seSalen}                 ${m.seSalen === 0 ? "OK" : "REVISAR"}`);
  if (m.seSalen > 0) console.log(`   ejemplos: ${JSON.stringify(m.seSalenEjemplos)}`);
  console.log(`cpl máximo               ${m.cplMaximo} (límite ${MAXIMO_CARACTERES_POR_LINEA})   ${m.cplSobreMaximo === 0 ? "OK" : `FALLA en ${m.cplSobreMaximo}/${m.parrafos}`}`);
  console.log(`display / cuerpo         ${m.displayMaximo} / ${m.cuerpoMediano} px = ${(m.displayMaximo / (m.cuerpoMediano || 1)).toFixed(1)}×  (objetivo 3-4×)`);
  console.log(`bloques animados         ${m.animados}, ocultos tras recorrer: ${m.animadosOcultos}   ${m.animadosOcultos === 0 ? "OK" : "FALLA"}`);
  console.log(`al volver arriba         ${informe.trasSubir.ocultos}/${informe.trasSubir.total} ocultos (reversible = >0)`);
  console.log(`imágenes                 ${m.imagenes}, rotas: ${m.imagenesRotas}   ${m.imagenesRotas === 0 ? "OK" : "FALLA"}`);
  console.log(`alto de página           ${m.altoPagina} px`);
  console.log(`peso transferido         ${(pesoTotal / 1024).toFixed(0)} KB`);
  console.log(`errores de consola       ${informe.errores.length}   peticiones fallidas: ${informe.fallidas.length}`);
  console.log(`contraste                ${informe.contrastes.length} textos medidos, ${fallosDeContraste.length} por debajo del mínimo`);
  for (const fallo of fallosDeContraste.slice(0, 8)) {
    console.log(`   ${fallo.contraste}:1 (min ${fallo.minimo}) ${fallo.tamano}px «${fallo.texto}» .${fallo.clase}`);
  }
  for (const error of informe.errores.slice(0, 5)) console.log(`   error: ${error}`);

  if (m.scrollHorizontal !== 0 || m.cplSobreMaximo > 0 || m.animadosOcultos > 0 || m.imagenesRotas > 0 || informe.errores.length > 0 || fallosDeContraste.length > 0) {
    hayFallos = true;
  }
}

const reducido = await auditarMovimientoReducido(navegador);
console.log(`\n${"=".repeat(72)}\n### prefers-reduced-motion: reduce\n${"=".repeat(72)}`);
console.log(`bloques ${reducido.total}, ocultos ${reducido.ocultos}, con transform ${reducido.desplazados}   ${reducido.ocultos === 0 ? "OK" : "FALLA: contenido invisible"}`);
if (reducido.ocultos > 0) hayFallos = true;

console.log(`\n${hayFallos ? "RESULTADO: hay ítems que no convergen." : "RESULTADO: converge, 0 ítems bloqueantes."}`);

await navegador.close();
process.exit(hayFallos ? 1 : 0);
