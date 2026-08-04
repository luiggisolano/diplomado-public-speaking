# CONTRATO VISUAL — Landing Podio (Diplomado Public Speaking, CEC UTMACH)

| Campo | Valor |
|---|---|
| Artefacto | `src/components/premium/podio/` servido en `/` y `/g/podio` |
| Alcance | De la banda de cifras hacia abajo. El hero (`PodioEscena`, `.pod-capitulo__*`, `.pod-portada__*`) queda fuera |
| Fecha | 2026-08-03 |
| Rúbrica | `~/.claude/skills/lfront/references/evaluation-rubric.md`, 25 ítems binarios |
| Modo lfront | `cinematic-product` con capítulo editorial. Se conserva |
| Línea base | Auditoría instrumentada del equipo (Playwright + muestreo de píxeles) sobre `/` en local, más medición propia de tokens, métricas de Playfair y resolución nativa de los carteles |
| Rol de este documento | Especificación. Quien implemente NO decide valores: si un valor no está aquí, no existe |

**Cómo leer esto.** Las tablas traen valores finales, listos para pegar. «Medido» significa que hay
un número detrás. «Declarado» es una decisión de dirección de arte que no se discute en
implementación.

**Alcance del refactor.** No se renombra ni un token de color: `--color-hueso`, `--color-texto`,
`--color-texto-tenue` y la gama de oro conservan sus nombres y solo cambian de valor donde fallan.
Se añaden únicamente dos familias nuevas, tamaños y espaciado, porque sin ellas no se puede expresar
«valor concreto por clase» sin repetir cuarenta `clamp()`. La nomenclatura `.pod-*` de las 1.915
líneas existentes queda intacta.

---

## 0. Tres correcciones de partida

Tres datos que el implementador necesita exactos porque cambian lo que hay que construir.

1. **`EncabezadoPodio.tsx` NO es del hero: es el encabezado de las secciones del cuerpo.**
   `LandingPodio.tsx` lo instancia **11 veces**, todas por debajo de la banda de cifras (líneas 126,
   164, 193, 226, 269, 307, 326, 362, 388, 407, 437). El hero es `PodioEscena` y usa
   `.pod-capitulo__*`, que no pasa por este componente. Consecuencia práctica: **el SplitText de las
   líneas 80-83 ya se ejecuta hoy en los 11 titulares de sección en alcance**. Lo que falta no es
   crear la animación de letras, es (a) que revierta al subir y (b) extenderla a los remates y al
   cierre, que hoy solo hacen fundido de bloque. Ver §7, que es la mitad del encargo.
2. **Los componentes de motion los importan tres archivos**, verificado con `grep`:
   `src/app/g/camara/page.tsx`, `src/app/g/fusion/page.tsx` y `LandingPodio.tsx`. Siguen sin
   tocarse, pero el radio de impacto son dos rutas ajenas, no cuatro.
3. **Ningún cartel puede ir a sangre.** Seis tienen 1.122 px nativos y `sombra-orador` 928. A
   densidad 2 el techo de ancho CSS es 561 px (los de 1.122), 600 px (los de 1.200) y 464 px
   (`sombra-orador`). Toda la composición de §6 va **en contenedor**, en una columna de 500 px. No
   es una renuncia: coincide exactamente con el hueco que hoy sobra a la derecha (§2).

---

## 1. Diagnóstico lfront de ESTA landing

Score actual: **12/25** (P0 4/6 · P1 5/12 · P2 3/7). **RECHAZADO**: bloquean 2×P0 y 7×P1.

### P0 — Bloqueantes

| Ítem | Estado | Medido hoy | Objetivo |
|---|---|---|---|
| P0-1 Sin overflow horizontal | PASA | Scroll horizontal 0 y 0 elementos fuera de caja en 1440/768/390 | Se conserva. Ver §9 riesgo 1: `.pod-root` lleva `overflow-x: clip`, así que este ítem NO se verifica con `scrollWidth` |
| P0-2 Consola limpia | PASA | 0 errores JS, 0 peticiones fallidas tras recorrer la página entera | Se conserva |
| P0-3 Assets cargan | PASA | 0 imágenes rotas; 6/6 portadas en `public/fusion/modulos/`, 22/22 webp en `public/podio/carteles/` | Se conserva |
| **P0-4 Contraste** | **NO PASA** | 4 elementos bajo 4,5:1, todos el mismo caso: `.tech-label` y `.pod-microcopy` en `rgb(124,118,106)` = **4,34:1** a 10-12 px. Son «WhatsApp», «Correo», «Avala» y «Inscripciones abiertas · Cupos limitados». Sobre `--color-negro-elevado` el mismo token cae a **4,08:1**. Además `.pod-especialista__numero` en `#885825` sobre su radial da **2,44:1** (mínimo 3:1 por ser 44 px) | ≥4,5:1 texto normal, ≥3:1 display. `--color-texto-tenue` pasa a `rgb(243 238 226 / 0.62)` = **6,85:1**, y el numeral a `--color-oro` = **4,35:1** |
| **P0-5 Responsive a 390 px** | **NO PASA** | Maqueta correcta, sin solapes ni recortes. Fallan dos targets: `.pod-barra__cta` mide **32,8 px** de alto a ≤560 px y `.pod-barra__conmutador` **37,6×37,6 px** | ≥44×44 px (§8.5) |
| P0-6 CTA alcanzable | PASA | `.pod-barra__cta` fijo desde que termina el recorrido; `.pod-boton` en `#inscripcion` | Se conserva |

### P1 — Incoherencia grave

| Ítem | Estado | Medido hoy | Objetivo |
|---|---|---|---|
| P1-1 Un solo acento | PASA | Un único hue: oro `#b4822d / #e7b655 / #f0c877 / #885825`, todos en 36–40° | Se conserva, reordenado por roles (§3.2) |
| P1-2 Un solo modo compositivo | PASA | Negro cálido dominante con alternancia declarada abyss / negro-cálido; un solo eje tipográfico | Se conserva. Los carteles NO abren un tercer ambiente: su velo resuelve al color de fondo de SU sección (§6.4) |
| **P1-3 Contraste de escala** | **NO PASA** | 1440: 64/15 = **4,3×** ✓ · 768: 51/15 = **3,4×** ✓ · **390: 36/15 = 2,4× FALLA** (mínimo 2,5×). En móvil el titular no despega del cuerpo | 390 **2,84×** · 768 **3,66×** · 1440 **4,04×** contra el cuerpo de 15 px que midió la auditoría; y 2,51× / 3,30× / 3,71× contra `.pod-seccion__cuerpo`. Pasa con las dos lecturas (§5) |
| **P1-4 ≤1 primario por viewport** | **NO PASA** | En `#inscripcion` coinciden `.pod-barra__cta` y `.pod-boton`, ambos oro macizo: **2 primarios** | La barra se repliega mientras `#inscripcion` interseca el viewport (§8.4) |
| **P1-5 Color de acción reservado** | **NO PASA** | El oro pinta 11 elementos NO clicables: `.pod-encabezado__rotulo`, `.pod-rotulo-lista`, `.pod-seccion__sentencia`, `.pod-remate`, `.pod-cierre__linea`, `.pod-modulo__promesa`, `.pod-especialista__disciplina`, `.pod-aval__rotulo`, `.pod-balanza__rotulo[despues]`, `.pod-cifra__valor`, `.pod-dato__valor` | Sistema declarado de dos alturas (§3.2): relleno oro solo en lo clicable, tinta oro en dos alturas por escena |
| P1-6 Motion con propósito | PASA | 57 bloques animados, 0 ocultos tras recorrer, 0 ocultos al volver arriba, sin scroll-jacking, `prefers-reduced-motion` honrado en JS y CSS | Se conserva y se recalibra (§7) |
| **P1-7 Las secciones respiran** | **NO PASA** | `.pod-seccion` usa `clamp(5rem, 14vh, 9rem)`: en 1440×800 da **112 px**, bajo el mínimo de 120. `.pod-seccion--cifras` da **72 px** | `clamp(4.5rem, 4rem + 5vw, 9.5rem)` → 390: 83,5 · 768: 102 · 1440: **136 px**. La banda de cifras adopta el mismo aire (§3.3) |
| **P1-8 Una idea por escena** | **NO PASA** | La escena de agitación encadena entradilla, cuerpo, giro, sentencia, rótulo, 6 síntomas y remate: 4 afirmaciones apiladas, y además 4 registros tipográficos compitiendo | Se parte en dos escenas hermanas y baja a 3 registros (§8.1) |
| **P1-9 Ancho de lectura** | **NO PASA — el peor incumplimiento** | **cpl máximo 232** a 1440 y **11 de 85 párrafos** sobre 75. A 768 el máximo es 139, mismos 11 párrafos. A 390 el máximo es 69 y cumple | Ninguna clase de texto sin medida. Las ocho culpables están identificadas por nombre abajo |
| **P1-10 Tinta por opacidad** | **NO PASA** | Tres grises independientes horneados a hexadecimal (`#f3eee2`, `#bdb6a8`, `#7c766a`), no una rampa de una tinta | Mismos nombres de token, valores derivados por opacidad (§3.1) |
| P1-11 Radios y sombras | PASA | 0 `border-radius` en toda la hoja (un solo valor: recto) y 4 `box-shadow` funcionales | Se conserva, tokenizado (§3.3) |
| P1-12 Sin emojis | PASA | 0 emojis; SVG lineal de 1–1,5 px | Se conserva |

**Las ocho clases sin `max-width`, verificadas con `grep` sobre `podio.css`.** Son la causa de los
11 párrafos fuera de rango y del máximo de 232 cpl:

| Clase | Ancho real hoy a 1440 | cpl | Medida asignada (§4) |
|---|---|---|---|
| `.pod-rotulo-lista` | 1.152 px a 10,88 px de cuerpo | **≈232** | `40ch` |
| `.pod-aval` | 1.152 px a 9,92 px | ≈232 | `62ch` (revisado 08-03; el filete pasa a `.pod-aval-marco`) |
| `.pod-microcopy` | 1.152 px a 12 px | ≈192 | `44ch` |
| `.pod-faq__respuesta` | 630 px reales (el tope `46rem` no llega a actuar) a 16 px | ≈79 | `60ch` |
| `.pod-balanza__punto` | ≈530 px a 15,2 px | ≈70 | `42ch` |
| `.pod-modulo__resultado` | ancho de tarjeta | ok | `36ch` (declarado igualmente) |
| `.pod-especialista__credencial` | ancho de tarjeta | ok | `34ch` (íd.) |
| `.pod-dato__valor` | ancho de columna | ok | `30ch` (íd.) |

El máximo de 232 sale de rótulos cortos dentro de una caja de 1.152 px: el texto nunca llegó a
partirse, pero la métrica mide la caja. Acotar la caja es el arreglo correcto en los dos casos.

### P2 — Pulido

| Ítem | Estado | Medido hoy | Decisión |
|---|---|---|---|
| P2-1 Hover | PASA | `.pod-modulo`, `.pod-boton`, `.pod-faq__pregunta`, `.pod-barra__enlace`, `.pod-barra__cta` | Se añade `:focus-visible`, hoy ausente en 3 de 5 (§6.5) |
| **P2-2 Tracking negativo en display** | **NO PASA por la letra de la regla** | Los titulares llevan `+0,03em` | **Desviación declarada**: van en caja alta y Playfair aprieta las mayúsculas; con tracking negativo la palabra se lee como bloque macizo. El negativo se aplica solo a display de caja baja ≥40 px: `.pod-seccion__entrada`, `.pod-seccion__giro`, `.pod-seccion__sentencia` y `.pod-remate` en escritorio |
| **P2-3 Interlineado y cuerpo** | **NO PASA** | Interlineados de cuerpo a **1,72** y **1,65**, sobre el techo de 1,6. Cuerpos de tarjeta a **14,4–15,2 px**, bajo el piso de 16 px en escritorio | Cuerpo a 1,58, tarjeta a 1,55, mínimos de §4 |
| **P2-4 Escala de espaciado** | **NO PASA** | Huecos verticales grandes e irregulares, sin ritmo reconocible: 0,3 · 0,35 · 0,5 · 0,6 · 0,62 · 0,66 · 0,68 · 0,7 · 0,75 · 0,85 · 0,9 · 1,05 · 1,1 · 1,15 · 1,35 · 1,4 · 1,75 rem | Escala de 8 pasos base 4 px más un ritmo vertical de 4 alturas (§3.3) |
| **P2-5 Copy telegráfico** | **NO PASA** | Cuatro titulares de 13–14 palabras y 67–73 caracteres | **No se toca**: el copy es del documento oficial del CEC. Mitigación tipográfica en §4.2 |
| P2-6 Full-bleed reservado | PASA | Solo sangran los fondos de sección; el texto siempre respeta `--ancho-maximo-contenido` | Se conserva y se refuerza: **ninguno de los cinco carteles sangra** (§6) |
| P2-7 Iconografía de un estilo | PASA | 2 SVG, mismo trazo | Se conserva |

**Convergencia esperada: 0×P0 · 0×P1 · 2×P2 declarados** (P2-2 por caja alta, P2-5 por copy de
cliente).

---

## 2. El diagnóstico de composición, que manda sobre todo lo demás

A 1440 el contenido ocupa de 145 a 930 px y **la mitad derecha de la pantalla está vacía**. No hay
desborde: sobra medio ancho de página en negro. Eso pesa más en la percepción de «no se ve bien»
que cualquier valor tipográfico, y es lo primero que resuelve este contrato.

La causa es aritmética: `.pod-seccion` centra su contenido en `--ancho-maximo-contenido: 72rem`
(1.152 px, con 144 px de margen a cada lado), pero dentro de esa caja el texto se detiene en sus
propias medidas de lectura, `26ch` el titular y `56ch` el cuerpo, alrededor de los 930 px. Quedan
**222 px muertos dentro del contenedor y 144 px fuera**, en toda la altura de las secciones
narrativas.

Y coincide con la restricción de los carteles: una columna derecha de 500 px es a la vez el hueco
que sobra y el ancho máximo al que las imágenes se ven nítidas a densidad 2. **La solución al
problema de composición y la del reparto de imágenes son la misma retícula** (§6.2).

---

## 3. Tokens

### 3.1 Color: mismos nombres, valores corregidos

```css
.pod-root {
  /* superficies — sin cambios */
  --color-abyss: #080603;
  --color-negro-calido: #100b06;
  --color-negro-elevado: #1a130b;

  /* tinta: los tres nombres de siempre, ahora derivados por opacidad de UNA tinta */
  --color-hueso: #f3eee2;                        /* 100 % */
  --color-texto: rgb(243 238 226 / 0.78);        /* era #bdb6a8 */
  --color-texto-tenue: rgb(243 238 226 / 0.62);  /* era #7c766a — AQUÍ ESTABA EL FALLO */
  --color-adorno: rgb(243 238 226 / 0.45);       /* nuevo, SOLO filetes y separadores */

  --color-linea: rgb(243 238 226 / 0.14);
  --color-linea-fuerte: rgb(180 130 45 / 0.4);

  /* oro: mismos nombres, mismos valores, roles nuevos (§3.2) */
  --color-oro: #b4822d;
  --color-oro-brillo: #e7b655;
  --color-oro-suave: #f0c877;
  --color-oro-sombra: #885825;   /* queda SOLO para filetes; prohibido como texto */
}
```

Contraste medido de la rampa, color compuesto sobre cada superficie:

| Token | sobre `abyss` | sobre `negro-cálido` | sobre `negro-elevado` | Uso permitido |
|---|---|---|---|---|
| `--color-hueso` | **17,48:1** | 16,91:1 | 15,88:1 | Titulares, nombres, valores |
| `--color-texto` | **10,56:1** | 10,36:1 | 9,92:1 | Todo el cuerpo de lectura |
| `--color-texto-tenue` | **6,85:1** | 6,80:1 | 6,64:1 | Etiquetas, rótulos, microcopy. Antes 4,49 / 4,34 / 4,08 |
| `--color-adorno` | 4,01:1 | 4,05:1 | 4,06:1 | **Solo adorno**. Jamás una palabra |
| `--color-oro-brillo` | **10,81:1** | 10,46:1 | 9,83:1 | Énfasis tipográfico |
| `--color-oro` | 5,95:1 | **5,75:1** | 5,40:1 | Numerales 01–06, icono de FAQ |
| `--color-oro-sombra` | 3,34:1 | 3,23:1 | 3,04:1 | **Prohibido como texto** |
| `--color-abyss` sobre `--color-oro-brillo` | **10,81:1** | — | — | Texto del botón primario |

**Regla dura de la tinta tenue:** `--color-texto-tenue` no baja de **12 px** en ningún viewport. Con
el valor nuevo pasa AA a cualquier tamaño, pero el piso de 12 px se mantiene por legibilidad, no por
contraste. `--color-adorno` no toca texto nunca.

### 3.2 Sistema del acento (resuelve P1-5)

1. **Relleno oro = clic.** `background-color: var(--color-oro-brillo)` existe en exactamente dos
   componentes: `.pod-boton` y `.pod-barra__cta`. Ningún elemento no interactivo lleva relleno oro.
2. **Tinta oro = dos alturas por escena, nunca más.** El rótulo que abre y **una sola** línea de
   display que cierra. Si una escena tiene sentencia y remate, la sentencia baja a `--color-hueso`.
3. **Numeral oro.** `--color-oro` en los folios 01–06 y en el icono del acordeón. Nunca es texto
   corrido, así que no compite.

| Clase | Hoy | Contrato | Motivo |
|---|---|---|---|
| `.pod-seccion__sentencia` | `--color-oro-brillo` | `--color-hueso` + peso 700 | La escena gasta su oro de display en `.pod-remate` |
| `.pod-modulo__promesa` | `--color-oro-brillo` | `--color-hueso` | Altura de tarjeta, fuera de las dos permitidas |
| `.pod-especialista__disciplina` | `--color-oro-brillo` | `--color-texto-tenue` | Es una etiqueta, no un énfasis |
| `.pod-balanza__rotulo[despues]` | `--color-oro-brillo` | `--color-hueso` | El contraste antes/después se sostiene con tinta y filete |
| `.pod-especialista__numero` | `--color-oro-sombra` (2,44:1) | `--color-oro` (4,35:1) | Falla P0-4 |
| `.pod-dato__valor` | `--color-oro-brillo` | `--color-oro` | Es una columna de cifras, no un énfasis de display |
| `.pod-cifra__valor` | `--color-oro-brillo` | se queda | La banda de cifras no tiene kicker ni remate: ahí el oro de display son los números |

### 3.3 Espaciado: escala y ritmo vertical

```css
.pod-root {
  --pod-space-1: 0.25rem; --pod-space-2: 0.5rem; --pod-space-3: 0.75rem; --pod-space-4: 1rem;
  --pod-space-5: 1.5rem;  --pod-space-6: 2rem;   --pod-space-7: 3rem;    --pod-space-8: 4rem;

  --pod-aire-seccion: clamp(4.5rem, 4rem + 5vw, 9.5rem);  /* 390: 83,5 · 768: 102 · 1440: 136 */
  --pod-aire-bloque:  clamp(2.5rem, 2rem + 2.5vw, 4rem);  /* 390: 41,8 · 768: 51,2 · 1440: 64 */

  --pod-radio: 0;
  --pod-sombra-halo:   0 0 60px rgb(180 130 45 / 0.12);
  --pod-sombra-filete: 0 1px 10px rgb(8 6 3 / 0.75);
  --pod-sombra-brillo: 0 0 12px rgb(231 182 85 / 0.55);
}
```

`--pod-aire-seccion` se mide contra el **ancho** de la ventana, no contra su alto: los `vh` de hoy
colapsan bajo 120 px en cualquier portátil de 800 px, que es lo que rompe P1-7.

**Ritmo vertical, cuatro alturas y ninguna más.** Esto es lo que hoy no tiene sistema:

| Relación | Valor | Dónde |
|---|---|---|
| Sección ↔ sección | `--pod-aire-seccion` | `padding-block` de `.pod-seccion` y `.pod-seccion--cifras` |
| Encabezado → primer bloque de la escena | `--pod-aire-bloque` | antes de rejillas, listas y balanza |
| Bloque → bloque dentro de la escena | `--pod-space-7` (48) | entre cuerpo y giro, entre lista y remate |
| Párrafo → párrafo, y dentro de tarjeta | `--pod-space-4` (16) · `--pod-space-3` (12) | `.pod-encabezado__entrada > * + *`, numeral → título, título → línea |

Tabla de sustitución obligatoria. Toda separación vertical del archivo pasa por aquí:

| Valores actuales | Token |
|---|---|
| `0.3rem`, `0.35rem` | `--pod-space-1` |
| `0.5rem`, `0.6rem`, `0.62rem` | `--pod-space-2` |
| `0.7rem`, `0.75rem`, `0.85rem`, `0.9rem` | `--pod-space-3` |
| `1rem`, `1.05rem`, `1.1rem`, `1.15rem` | `--pod-space-4` |
| `1.25rem`, `1.35rem`, `1.4rem`, `1.5rem` | `--pod-space-5` |
| `1.75rem`, `2rem` | `--pod-space-6` |
| `clamp(2.5rem, 6vh, 3.5rem)`, `clamp(2.5rem, 6vh, 4rem)` | `--pod-aire-bloque` |
| `clamp(5rem, 14vh, 9rem)`, `clamp(3rem, 8vh, 5rem)` | `--pod-aire-seccion` |

### 3.4 Tamaños

```css
.pod-root {
  --pod-display-xl: clamp(2.625rem, 1.72rem + 3.9vw, 4.25rem);     /* 42,7 · 57,5 · 68 */
  --pod-display-l:  clamp(1.75rem, 1.3rem + 1.85vw, 2.75rem);      /* 28,0 · 35,0 · 44 */
  --pod-display-s:  clamp(1.15rem, 1.05rem + 0.42vw, 1.45rem);     /* 18,4 · 20,0 · 22,9 */
  --pod-cuerpo:     clamp(1.0625rem, 1.02rem + 0.14vw, 1.1875rem); /* 17,0 · 17,4 · 18,3 */
  --pod-cuerpo-s:   clamp(0.9375rem, 0.9rem + 0.17vw, 1.0625rem);  /* 15,1 · 15,7 · 16,9 */
  --pod-etiqueta:   clamp(0.75rem, 0.72rem + 0.1vw, 0.8125rem);    /* 12,0 · 12,3 · 13,0 */
  --pod-cifra:      clamp(3.25rem, 2.1rem + 4.6vw, 5.75rem);       /* 52,0 · 68,9 · 92,0 */
  --pod-numeral:    clamp(1.5rem, 1.3rem + 0.85vw, 2.25rem);       /* 24,1 · 27,3 · 33,0 */
}
```

Los tres valores del comentario son los computados a **390 / 768 / 1440 px**. Cinco escalones y una
etiqueta: `xl` → `l` → `s` → `cuerpo` → `cuerpo-s` → `etiqueta`. No hay un tamaño intermedio más,
justamente porque hoy hay cuatro registros compitiendo dentro de una misma escena.

`--pod-display-xl` sustituye a `var(--text-section)` en `.pod-encabezado__titulo`. **No se edita
`globals.css`**: ese token (línea 41) lo comparten `/telon`, `/galeria` y las cuatro rutas `/v/*`.

**Techo del titular en móvil, calculado y no estimado.** A 390 px el margen lateral deja 342 px
útiles. La palabra más larga en caja alta de toda la página es «ESPECIALISTAS»: con la métrica de
mayúsculas de Playfair son 7,48 em, que a 42,7 px dan 319 px de trazo más 8,3 px de tracking a
`0,015em` = **327,7 px**, con 14,3 px de holgura (4,2 %). A 44 px serían 346 px y **desbordaría**.
Por eso el mínimo del `clamp` es 2,625rem y no más.

---

## 4. Escala tipográfica completa, clase por clase

Todas las clases `pod-*` con texto del alcance. **En negrita las que suben**, con la razón por la
que esa información es la importante. La columna `max-width` es parte de la especificación, no una
verificación posterior: está recalculada para el tamaño nuevo de cada clase.

### 4.1 Banda de cifras y aval

> **Revisado el 2026-08-03** al sustituir la rejilla de cuatro celdas con borde por el renglón
> de cifra y unidad al costado. Cambian la escala de `--pod-cifra`, la medida de la etiqueta y
> el registro entero del aval, que pasa de versalita espaciada a cuerpo de lectura en caja
> baja. La banda tiene ahora tres disposiciones —renglón desde 72rem, dos columnas desde
> 48rem, lista apilada por debajo— y no dos.

| Clase | font-size | line-height | letter-spacing | Peso | Color | max-width | Por qué |
|---|---|---|---|---|---|---|---|
| **`.pod-cifra__valor`** | **`var(--pod-cifra)`** (52 · 68,9 · 92) | 0,86 | `-0.005em` | 400 Playfair | `--color-oro-brillo` | — | **160 h, 10 créditos, 6 módulos, 100 % en línea son los cuatro datos que contestan «qué compro». Con la unidad al costado la banda cabe en un renglón y el alto que sobra lo recoge el número** |
| **`.pod-cifra__etiqueta`** | **`var(--pod-etiqueta)`** (12 · 12,3 · 13) | 1,25 | `0.2em` | 400 | `--color-texto-tenue` | 12ch | **Va al costado y sobre la misma línea base que la cifra. Doce caracteres y no ocho: con ocho, «EN LÍNEA» se partía y una unidad de dos palabras rota se lee como dos datos** |
| **`.pod-aval`**, `.pod-aval__sello` | **`var(--pod-cuerpo-s)`** (15,1 · 15,7 · 16,9) | 1,6 | normal | 400 | `--pod-tinta-2` | **62ch** | **Es el aval universitario, el argumento institucional de toda la oferta. En caja baja: cuatro nombres propios de institución seguidos, en versalita espaciada, se deletrean en vez de leerse** |
| `.pod-aval__rotulo` | `var(--pod-etiqueta)` | 1,6 | `0.26em` | 700 | `--color-oro-brillo` | — | Kicker de la banda. Conserva la versalita que el resto del bloque pierde porque encabeza la enumeración en lugar de formar parte de ella |
| `.pod-aval-marco` | — | — | — | — | — | `--ancho-maximo-contenido` | Envoltorio que lleva el filete dorado. Separa el filete de la medida: aquel cruza el ancho de lectura entero para atarse a la banda, el texto no, porque a 1.440 eso serían 135 caracteres de recorrido |

### 4.2 Encabezado de sección

| Clase | font-size | line-height | letter-spacing | Peso | Color | max-width | Por qué |
|---|---|---|---|---|---|---|---|
| `.pod-encabezado__rotulo` | `var(--pod-etiqueta)` (12 · 12,3 · 13) — hoy 10,9 · 11,3 · 13,6 | 1,4 | `0.28em` | 400 | `--color-oro-brillo` | 30ch | Sube 1,1 px en móvil para llegar al piso de 12 px |
| **`.pod-encabezado__titulo`** | **`var(--pod-display-xl)`** (42,7 · 57,5 · 68) — hoy 36 · 50,8 · 64 | **1,06** (hoy 1,1) | `0.03em`; **`0.015em` a ≤560 px** | 400 Playfair, caja alta | `--color-hueso` | **24ch** (hoy 26ch) | **Es la afirmación de cada escena. A 390 px daba 2,4× el cuerpo y la jerarquía se leía plana justo en el ancho por el que entra la mayoría** |
| `.pod-encabezado__entrada` | contenedor | — | — | — | — | — | `margin-top: var(--pod-space-5)`; `> * + * { margin-top: var(--pod-space-4) }` |

Mitigación de P2-5, que es tipográfica porque el copy no se toca: con `24ch` y 42,7 px los cuatro
titulares largos del documento (67–73 caracteres) caen en **6 líneas de 45,3 px = 272 px** a 390 px,
un 32 % del viewport móvil, y en **4 líneas** a 1440 px. Es el «golpe» que pide el ritmo lfront, no
un accidente.

### 4.3 Cuerpo editorial

Aquí está el arreglo de los cuatro registros que compiten. La escena de agitación pasa a tener
**tres**: titular (68) · display serif (44) · cuerpo sans (18,3). `.pod-seccion__entrada` sube al
mismo escalón que `giro` y `sentencia` en vez de ocupar un cuarto intermedio.

| Clase | font-size | line-height | letter-spacing | Peso | Color | max-width | Por qué |
|---|---|---|---|---|---|---|---|
| **`.pod-seccion__cuerpo`** | **`var(--pod-cuerpo)`** (17 · 17,4 · **18,3**) — hoy 17 fijo | **1,58** (hoy 1,72) | normal | 400 Glacial | `--color-texto` (10,56:1) | **56ch** = 565 px a 1440 → **64 cpl** | **Es el párrafo gris que hoy se lee apagado y pequeño al lado de la entrada y el giro en serif. Sube de cuerpo en escritorio y NO baja en móvil** |
| **`.pod-seccion__entrada`** | **`var(--pod-display-l)`** (28 · 35 · 44) — hoy 18,4 · 21,4 · 25,6 | 1,26 | `-0.01em` desde 40 px | 400 Playfair | `--color-hueso` | 30ch | **Es la frase que abre cada argumento. Sube de escalón y, sobre todo, deja de ser un registro propio** |
| **`.pod-seccion__giro`** | **`var(--pod-display-l)`** — hoy 20 · 23,5 · 30,4 | 1,22 | `-0.01em` desde 40 px | 400 Playfair | `--color-hueso` | 30ch | **«La diferencia entre saber y comunicar lo que sabes deja de ser un detalle»: es el pivote del argumento entero** |
| `.pod-seccion__sentencia` | `var(--pod-display-l)` | 1,22 | `-0.01em` desde 40 px | **700** | `--color-hueso` (deja el oro) | 30ch | Mismo cuerpo que el giro, separada por peso y no por hue |
| `.pod-rotulo-lista` | `var(--pod-etiqueta)` — hoy 10,9 | 1,4 | `0.28em` | 400 | `--color-oro-brillo` | **40ch** (hoy sin medida: **232 cpl**, el peor dato de la página) | Piso de 12 px |
| **`.pod-sintoma`** | **`var(--pod-cuerpo)`** (17 · 17,4 · 18,3) — hoy 16 | 1,55 | normal | 400 | `--color-texto` | **62ch** = 625 px → 71 cpl | **Los seis síntomas son el espejo en el que el visitante se reconoce: la lista que decide si sigue leyendo** |
| **`.pod-remate`** | **`var(--pod-display-l)`** (28 · 35 · 44) — hoy 20,8 · 27,4 · 33,6 | 1,18 | **`-0.01em`** | 400 Playfair | `--color-oro-brillo` | **26ch** | **Las tres frases que el documento escribió como sentencia para recordar. Display en caja baja, así que aquí sí se cumple P2-2 al pie de la letra** |
| `.pod-microcopy` | `var(--pod-etiqueta)` — hoy 12 | 1,5 | `0.1em` | 400 | `--color-texto-tenue` | **44ch** (hoy sin medida: 192 cpl) | Lleva la fecha límite. Sube de 4,34 a 6,80:1 |

### 4.4 Tarjetas (pilares, dimensiones, perfiles, razones)

| Clase | font-size | line-height | letter-spacing | Peso | Color | max-width | Por qué |
|---|---|---|---|---|---|---|---|
| `.pod-pilar__numero` | `var(--pod-numeral)` (24,1 · 27,3 · 33) — hoy 24 | 1 | `0.02em` | 400 Playfair | `--color-oro` | — | Folio, no información |
| **`.pod-pilar__titulo`** | **`var(--pod-display-s)`** (18,4 · 20 · 22,9) — hoy 17 | 1,3 | normal | 700 Glacial | `--color-hueso` | 22ch | **Los cuatro pilares del método y las tres razones de urgencia son el esqueleto argumental** |
| **`.pod-pilar__linea`** | **`var(--pod-cuerpo-s)`** (15,1 · 15,7 · 16,9) — hoy 15 | 1,55 (hoy 1,65) | normal | 400 | `--color-texto` | 40ch | **Cruza el piso de 16 px en escritorio que exige P2-3. Es además el cuerpo que la auditoría tomó como referencia de P1-3** |
| `.pod-dimension__numero` | `var(--pod-numeral)` — hoy 21,6 | 1 | `0.02em` | 400 | `--color-oro` | — | — |
| **`.pod-dimension__titulo`** | **`var(--pod-display-s)`** — hoy 19,2 | 1,2 | normal | 400 Playfair | `--color-hueso` | 20ch | **Las seis dimensiones son el mapa del producto** |
| **`.pod-dimension__linea`** | **`var(--pod-cuerpo-s)`** — hoy 14,7 | 1,55 | normal | 400 | `--color-texto` | 38ch | Piso de cuerpo |
| **`.pod-perfil__titulo`** | **`var(--pod-display-s)`** — hoy 20 | 1,2 | normal | 400 Playfair | `--color-hueso` | 22ch | **El título del perfil es el gancho de autoidentificación** |
| **`.pod-perfil__linea`** | **`var(--pod-cuerpo-s)`** — hoy 15,2 | 1,55 | normal | 400 | `--color-texto` | 44ch | Piso de cuerpo |

### 4.5 Módulos

| Clase | font-size | line-height | letter-spacing | Peso | Color | max-width | Por qué |
|---|---|---|---|---|---|---|---|
| `.pod-modulo__numero` | `var(--pod-numeral)` — hoy 30 | 1 | `0.02em` | 400 Playfair | `--color-oro` | — | Folio |
| **`.pod-modulo__titulo`** | **`var(--pod-display-s)`** (18,4 · 20 · 22,9) — hoy 17 | 1,3 | normal | 700 Glacial | `--color-hueso` | 24ch | **El nombre del módulo es lo que el comprador compara con otras ofertas** |
| `.pod-modulo__promesa` | `var(--pod-cuerpo)` — hoy 16,8 | 1,4 | normal | 400 Playfair | `--color-hueso` (deja el oro) | 32ch | Cambia de hue por §3.2, no de tamaño |
| **`.pod-modulo__linea`** | **`var(--pod-cuerpo-s)`** — hoy 15 | 1,55 | normal | 400 | `--color-texto` | 40ch | Piso de cuerpo |
| **`.pod-modulo__resultado`** | **`var(--pod-cuerpo-s)`** — hoy 14,4 | 1,5 | normal | **700** | `--color-hueso` | **36ch** | **«Sostienes cualquier intervención sin que el nervio te gane» es la promesa medible de cada módulo, el argumento de venta real, y hoy es el texto más pequeño de la tarjeta** |
| **`.pod-modulo__resultado-rotulo`** | **`var(--pod-etiqueta)`** (12) — hoy **9,6** | 1,3 | `0.24em` | 400 | `--color-oro` | — | **9,6 px es el cuerpo más pequeño de toda la página** |

### 4.6 Especialistas

| Clase | font-size | line-height | letter-spacing | Peso | Color | max-width | Por qué |
|---|---|---|---|---|---|---|---|
| `.pod-especialista__numero` | 2,75rem fijo (44) | 1 | normal | 400 Playfair | **`--color-oro`** (era `--color-oro-sombra`) | — | Solo cambia el color: 2,44 → 4,35:1 |
| `.pod-especialista__modulo` | `var(--pod-etiqueta)` — hoy 10,56 | 1,3 | `0.24em` | 400 | `--color-texto-tenue` | — | Piso de 12 px |
| **`.pod-especialista__nombre`** | **`var(--pod-display-s)`** — hoy 20 | 1,2 | normal | 400 Playfair | `--color-texto` | 18ch | **Mientras diga «Nombre por confirmar» va en `--color-texto`, no en hueso: el hueco debe verse como hueco. Cuando el CEC entregue los seis nombres sube a `--color-hueso`** |
| `.pod-especialista__disciplina` | `var(--pod-etiqueta)` — hoy 10,56 | 1,3 | `0.24em` | 400 | `--color-texto-tenue` (deja el oro) | 24ch | Etiqueta, no énfasis |
| **`.pod-especialista__credencial`** | **`var(--pod-cuerpo-s)`** — hoy 14,4 | 1,55 | normal | 400 | `--color-texto` | **34ch** | **Es lo único verificable de la tarjeta mientras falten los nombres** |

### 4.7 Balanza (antes / después)

| Clase | font-size | line-height | letter-spacing | Peso | Color | max-width | Por qué |
|---|---|---|---|---|---|---|---|
| `.pod-balanza__rotulo` | `var(--pod-etiqueta)` — hoy 10,56 | 1,3 | `0.28em` | 400 | `--color-texto-tenue` (antes) · `--color-hueso` (después) | — | El contraste entre lados pasa a ser de tinta y filete, no de hue |
| **`.pod-balanza__punto`** | **`var(--pod-cuerpo-s)`** — hoy 15,2 | 1,55 | normal | 400 | `--color-texto-tenue` (antes) · `--color-hueso` (después) | **42ch** (hoy sin medida: 70 cpl) | **Las diez líneas del antes/después son la promesa de transformación, el corazón de la oferta** |

### 4.8 Ficha de datos

| Clase | font-size | line-height | letter-spacing | Peso | Color | max-width | Por qué |
|---|---|---|---|---|---|---|---|
| `.pod-dato__etiqueta` | `var(--pod-etiqueta)` — hoy 10,56 | 1,3 | `0.24em` | 400 | `--color-texto-tenue` | — | Piso de 12 px y 6,80:1 |
| **`.pod-dato__valor`** | **`clamp(1.375rem, 1.25rem + 0.5vw, 1.75rem)`** (24 · 27,3 · 28) — hoy 20 | 1,25 | `0.01em` | 400 Playfair | `--color-oro` | **30ch** | **«Inicio julio · inscripciones hasta fin de junio», «100 % en línea», «Sábados»: son los datos con los que se decide comprar, en la sección `#inversion` que la barra enlaza** |

### 4.9 Preguntas frecuentes

| Clase | font-size | line-height | letter-spacing | Peso | Color | max-width | Por qué |
|---|---|---|---|---|---|---|---|
| **`.pod-faq__pregunta`** | **`clamp(1.125rem, 1.05rem + 0.3vw, 1.3125rem)`** (18 · 19,3 · 21) — hoy 17 | 1,35 | normal | 700 Glacial | `--color-hueso` | — | **Cada pregunta es una objeción de compra: la última barrera antes del CTA** |
| **`.pod-faq__respuesta`** | **`var(--pod-cuerpo)`** (17 · 17,4 · 18,3) — hoy 16 | 1,58 (hoy 1,72) | normal | 400 | `--color-texto` | **60ch** = 605 px → **69 cpl** (hoy `46rem`, que no llega a actuar: 79 cpl reales) | **Resuelve P1-9 y sube el cuerpo en escritorio** |
| `.pod-faq__icono` | 20×20 px (hoy 18×18) | — | — | — | `--color-oro` | — | `margin-inline-end: 6px` (hoy 4): al girar 45° una cruz de 20 px ocupa 28,3 px |

### 4.10 Cierre, botones y barra

| Clase | font-size | line-height | letter-spacing | Peso | Color | max-width | Por qué |
|---|---|---|---|---|---|---|---|
| **`.pod-cierre__linea`** | **`clamp(1.875rem, 1.35rem + 2.15vw, 3.5rem)`** (38,4 · 46,1 · 56) — hoy 25,6 · 35,4 · 48 | 1,12 | `0.02em` | 400 / **700** en `[data-peso="fuerte"]` | `--color-oro-brillo` / `--color-hueso` | **20ch** | **«Puedes ser el mejor en lo que haces. Si no sabes comunicarlo, nadie lo notará.» Última pantalla y frase que cierra el argumento** |
| **`.pod-boton`** | **`var(--pod-cuerpo)`** (17 · 17,4 · 18,3) — hoy 15,2 | 1,2 | `0.04em` | 700 | `--color-abyss` sobre `--color-oro-brillo` | — | **Es la acción que factura. `min-height: 48px`, `padding: var(--pod-space-4) var(--pod-space-6)`** |
| `.pod-boton--secundario` | igual | igual | igual | 700 | `--color-oro-brillo`, fondo transparente, borde `--color-linea-fuerte` | — | Se mantiene fantasma |
| **`.pod-barra__cta`** | **`var(--pod-etiqueta)`** (12 · 12,3 · 13) — hoy 11,2 y 10,56 a ≤560 px | 1,2 | `0.14em` | 700 | `--color-abyss` sobre `--color-oro-brillo` | — | **`min-height: 44px`. Hoy mide 32,8 px de alto a 390 px: falla P0-5** |
| `.pod-barra__enlace` | `var(--pod-etiqueta)` — hoy 11,2 | 1,3 | `0.18em` | 400 | `--color-texto` (hoy tenue) | — | Es navegación: sube un escalón de tinta |
| `.pod-barra__nombre` | `clamp(0.9rem, 1.5vw, 1.15rem)` | 1,2 | `0.08em` | 700 | `--color-hueso` | — | Sin cambio material |
| `.pod-contacto__fila dt` | `var(--pod-etiqueta)` — hoy 9,92 | 1,3 | `0.24em` | 400 | `--color-texto-tenue` | — | Piso de 12 px. Es uno de los 4 fallos de contraste medidos |
| **`.pod-contacto__fila dd`** | **`var(--pod-cuerpo-s)`** — hoy 13,6 | 1,5 | normal | 400 | `--color-hueso` | — | **Es el número de WhatsApp y el correo: el dato con el que la persona actúa** |

### 4.11 Reglas transversales

- **Interlineado**: display 1,06–1,26 · cuerpo 1,50–1,58 · etiquetas 1,3. Ningún cuerpo sobre 1,6.
- **Tracking**: `-0,01em` solo en display de caja baja ≥40 px. `+0,015…0,03em` en caja alta.
  `0,14…0,28em` en etiquetas. Nunca negativo en cuerpo ni bajo 40 px: el español acentuado se
  degrada.
- **`text-wrap`**: `balance` en titulares y remates, `pretty` en párrafos de más de tres líneas.
- **Piso absoluto**: ningún texto bajo 12 px en ningún viewport. Hoy hay siete clases por debajo.
- **Medida**: ninguna clase de texto sin `max-width`. Hoy hay ocho.

---

## 5. Jerarquía

La auditoría midió el cuerpo en **15 px**, que es el de las tarjetas (`--pod-cuerpo-s`), la familia
de párrafo más numerosa de la página. `.pod-seccion__cuerpo` va a 17 px. La escala nueva pasa el
umbral con **las dos lecturas**, que es lo que hay que garantizar:

| Viewport | Titular | Cuerpo de tarjeta (el medido) | Razón | `.pod-seccion__cuerpo` | Razón |
|---|---|---|---|---|---|
| 390 px | 42,7 px | 15,1 px | **2,84×** | 17,0 px | **2,51×** |
| 768 px | 57,5 px | 15,7 px | **3,66×** | 17,4 px | **3,30×** |
| 1440 px | 68,0 px | 16,9 px | **4,04×** | 18,3 px | **3,71×** |

Hoy: 2,4× / 3,4× / 4,3×. La corrección **sube la separación en móvil sin achatarla en escritorio**,
que es justo lo que pedía la observación: la jerarquía de móvil necesita más separación que la de
escritorio, no la misma proporción.

**Jerarquía por opacidad** (P1-10). Una sola tinta `rgb(243 238 226)` a cuatro opacidades:

- Todo lo que se lee vive entre el 62 % y el 100 %: entre 6,80:1 y 17,48:1.
- El 45 % (`--color-adorno`) existe solo para filetes y separadores, que pueden perderse sin que se
  pierda información. Ninguna palabra lo usa.
- El «antes» y el «después» de la balanza se separan por **dos escalones de la misma tinta** más el
  color del filete, no por dos grises distintos ni por hue.
- El énfasis de peso (700) y el de tamaño hacen el trabajo que hoy hace el oro.

---

## 6. Imágenes y retícula de dos columnas

### 6.1 La restricción que manda

| Grupo | Carteles | Ancho nativo | **Techo de ancho CSS a densidad 2** |
|---|---|---|---|
| A | `microfono-sala`, `mesa-directorio`, `auditorio-orador`, `certificados-microfono` | 1.200 | **600 px** |
| B | `sala-juntas-tarjeta`, `equipo-nocturno`, `umbral-ascensor`, `aula-mano-alzada`, `muro-certificados`, `despacho-vacio` | 1.122 | **561 px** |
| C | `sombra-orador` | 928 | **464 px** |

**Ninguno sangra y ninguno ocupa media pantalla en escritorio.** La columna de media que define este
contrato mide **500 px a 1440**, por debajo del techo de los grupos A y B. El grupo C no se usa.

### 6.2 La retícula (resuelve el medio ancho vacío)

```css
.pod-escena {
  display: grid;
  gap: var(--pod-aire-bloque);
}

@media (min-width: 62rem) {
  .pod-escena {
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
    align-items: start;
  }
}
```

Anchos computados de la columna de media, con `--ancho-maximo-contenido: 72rem` y el `gap` de
`--pod-aire-bloque`:

| Viewport | Contenedor | Gap | Columna de texto | **Columna de media** | ¿Bajo el techo? |
|---|---|---|---|---|---|
| 992 px | 892 px | 51 px | 454 px | **387 px** | sí |
| 1248 px | 1.123 px | 64 px | 572 px | **487 px** | sí |
| 1440 px | 1.152 px | 64 px | 588 px | **500 px** | sí, con 61 px de margen sobre el grupo B |

La columna de texto de 588 px aloja sin conflicto `.pod-seccion__cuerpo` a `56ch` = 565 px. Por
debajo de 62rem la retícula colapsa a una columna y la imagen va **después** del encabezado y antes
de la rejilla de la escena.

### 6.3 Reparto: 5 carteles en 5 de 14 bloques

Orden real de bloques bajo las cifras, con el fondo que ya alterna `podio.css:634`:

| # | Bloque | Fondo | Cartel | Papel de la imagen, o motivo de no llevarla |
|---|---|---|---|---|
| 1 | Cifras + aval | abyss | — | Panel de instrumentos: una foto detrás de cuatro números de 80 px los convierte en decoración |
| 2 | Agitación A · el punto de inflexión | abyss | **`mesa-directorio`** | La silla presidencial vacía junto al texto sobre el momento que define si avanzas o te quedas |
| 3 | Agitación B · los síntomas | abyss | — | Lista de seis filas con filete: escena de lectura, no de contemplación |
| 4 | Solución | cálido | — | Cinco tarjetas de diferenciales, ya tiene densidad |
| 5 | Mapa | abyss | **`auditorio-orador`** | El auditorio como destino al que sirven las seis dimensiones |
| 6 | Módulos | cálido | — | **Ya tiene sus 6 portadas oficiales. Una séptima imagen es exactamente saturar la escena** |
| 7 | Especialistas | abyss | — | Seis retratos con numeral dorado ya son el peso visual. Una foto de escenario sobre seis fichas que dicen «Nombre por confirmar» promete personas que no existen |
| 8 | Público | cálido | **`equipo-nocturno`** | La mujer presentando a su equipo es literalmente el perfil que el copy interpela |
| 9 | Transformación · balanza | abyss | **`umbral-ascensor`** | Va en la fila del encabezado; la balanza ocupa el ancho completo debajo. Cruzar el umbral hacia la luz es el «después» |
| 10 | Método | cálido | — | Cuatro tarjetas de pilares |
| 11 | Ficha `#inversion` | abyss | **`muro-certificados`** | El muro de diplomas junto a la fila «Certificación: UTMACH · Centro de Educación Continua» |
| 12 | Urgencia | cálido | — | Tres razones. Escena corta y seca a propósito: es el momento de decisión |
| 13 | Preguntas | abyss | — | Acordeón. Una imagen compite con la lectura de las objeciones |
| 14 | Cierre `#inscripcion` | abyss | — | **La página termina en tipografía y el oro del CTA. Es el único sitio donde `auditorio-orador` habría querido ir a sangre, y no puede: 600 px de techo contra 1.440 de ancho** |

Posiciones 2 · 5 · 8 · 9 · 11: **ninguna adyacencia salvo 8-9**, y esas dos caen en fondos distintos
(cálido y abyss), con la balanza de diez filas entre medias. Los seis carteles restantes no entran
en ninguna sección.

### 6.4 Reconciliación de los dos ritmos

**Manda la alternancia de fondo.** Es el ritmo de capítulo que ya existe en `podio.css:634` y las
imágenes se subordinan a él, nunca al revés. Tres reglas:

1. **El velo de la imagen resuelve al color de fondo de SU sección.** En abyss funde a
   `rgb(8 6 3 / ·)`; en `--alterna` funde a `rgb(16 11 6 / ·)`. Así la fotografía se lee como parte
   de ese capítulo y no como un tercer ambiente, que es lo que protege P1-2.
2. **La imagen nunca cambia el fondo de su sección** ni introduce una banda de color propia.
3. **Ningún cartel en dos secciones consecutivas del mismo fondo.** Cuando dos imágenes caen
   seguidas (8 y 9), tienen que estar en fondos distintos, como ocurre.

### 6.5 CSS de la composición

```css
.pod-escena__media {
  position: relative;
  aspect-ratio: 4 / 5;              /* ratio nativo 0,80: recorte cero */
  overflow: hidden;
  background-color: var(--color-abyss);
  border: 1px solid var(--color-linea);
}

@media (max-width: 48rem) {
  .pod-escena__media { aspect-ratio: 1 / 1; }   /* 342 px a 390 px de ancho */
}

.pod-escena__imagen { display: block; width: 100%; height: 100%; object-fit: cover; }

.pod-escena__media::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: linear-gradient(180deg, transparent 42%, rgb(8 6 3 / 0.55) 100%);
}

/* regla 1 de §6.4: el velo funde al fondo de la sección */
.pod-seccion--alterna .pod-escena__media::after {
  background-image: linear-gradient(180deg, transparent 42%, rgb(16 11 6 / 0.55) 100%);
}

/* muro-certificados es la más clara del lote (L media 0,161): velo propio, más denso */
.pod-escena__media[data-tono="claro"]::after {
  background-image: linear-gradient(180deg, rgb(8 6 3 / 0.28) 0%, rgb(8 6 3 / 0.62) 100%);
}

/* anillo de foco, hoy ausente en .pod-boton, .pod-faq__pregunta y .pod-barra__conmutador */
.pod-root :is(a, button):focus-visible {
  outline: 2px solid var(--color-oro-brillo);
  outline-offset: 3px;
}
```

**Ningún cartel sostiene texto encima.** Es una regla, no una casualidad: el velo está para asentar
la imagen en el negro de su capítulo, no para rescatar contraste. Con esto P0-4 no depende de
píxeles de fotografía en ningún punto de la página.

### 6.6 Presupuesto técnico por imagen

`public/podio/` ya sirve unos 5 MB de frames del hero, así que el peso de los carteles no es el
problema: lo es que su carga no compita con la precarga de la secuencia. De ahí `loading="lazy"` en
las cinco **y** `fetchpriority="low"`.

```html
<img
  src="/podio/carteles/<slug>-1200.webp"
  srcset="/podio/carteles/<slug>-800.webp 800w, /podio/carteles/<slug>-1200.webp 1200w"
  sizes="(min-width: 78rem) 500px, (min-width: 62rem) 40vw, (min-width: 48rem) 60vw, calc(100vw - 3rem)"
  alt=""
  width="<w>" height="<h>"
  loading="lazy" fetchpriority="low" decoding="async"
/>
```

| Cartel | Bloque | `width`×`height` servido | `object-position` | Peso 800w |
|---|---|---|---|---|
| `mesa-directorio` | 2 | `1200`×`1501` | `50% 45%` | 24,1 KB |
| `auditorio-orador` | 5 | `1200`×`1490` | `50% 38%` | 32,6 KB |
| `equipo-nocturno` | 8 | `1200`×`1499` | `52% 40%` | 29,7 KB |
| `umbral-ascensor` | 9 | `1200`×`1499` | `50% 42%` | 19,9 KB |
| `muro-certificados` | 11 | `1200`×`1499` | `50% 50%` + `data-tono="claro"` | 33,6 KB |

- **`alt=""` en las cinco**: son ilustración editorial y no aportan información que el texto no dé.
- **Cero salto de maqueta**: el contenedor declara `aspect-ratio`; los atributos van igualmente.
- Total diferido: **139,9 KB** en la ruta 800w, 269,2 KB en la 1200w.

### 6.7 Carteles no usados

Seis quedan fuera y **no deben colarse** en ninguna sección: `microfono-sala`,
`sala-juntas-tarjeta` (ratio 0,659, incompatible con la caja 4/5), `aula-mano-alzada`,
`despacho-vacio`, `sombra-orador` (464 px de techo, el más blando del lote) y
`certificados-microfono`. Reserva: `certificados-microfono` para `og:image` y tarjeta social, y
`sombra-orador` para la escena de especialistas **el día que el CEC entregue nombres y fotografías**.

**Escena a sangre en el cierre: descartada, con motivo.** Se evaluó y no procede. El original de
`auditorio-orador` mide **1.856 px** de ancho, así que su techo honesto a densidad 2 son **928 px
CSS**: da para una banda ancha en tablet, no para sangrar a 1440. Pedir más sería ampliar, que es
exactamente el error que este contrato evita. El cierre queda como está especificado, en tipografía
y el oro del CTA, y converge igual. Solo se revisa si el CEC entrega los carteles en resolución
original de impresión.

---

## 7. Motion: la animación de las letras

**Esto es la mitad del encargo.** El usuario pidió literalmente animación de las letras al bajar y
al subir. Hoy la landing tiene 57 bloques que hacen fundido y **0 que reviertan**, medido.

### 7.1 Lo que ya existe y hay que reutilizar

`EncabezadoPodio.tsx` ya parte los 11 titulares de sección con SplitText (`type: "lines,words"`,
`linesClass: "cam-line"`, `wordsClass: "cam-word"`, líneas 80-83) y los levanta palabra a palabra
desde una máscara de línea. **No se escribe otro mecanismo**: se extiende ese, con sus constantes ya
nombradas, a las demás líneas de display, y se le añade la reversión.

Lo que falta, exactamente:

| Falta | Dónde |
|---|---|
| Que el titular revierta al subir | `EncabezadoPodio.tsx:98`, `once: true` → `toggleActions` |
| Letras en las líneas de display que hoy solo hacen fundido de bloque | `.pod-seccion__entrada`, `.pod-seccion__giro`, `.pod-seccion__sentencia`, `.pod-remate`, `.pod-cierre__linea` |
| Reversión de las cifras y de las imágenes | `.pod-cifra`, `.pod-escena__media` |

### 7.2 Granularidad del corte, y por qué

| Elemento | Corte | Motivo |
|---|---|---|
| `.pod-encabezado__titulo` | **palabras** bajo máscara de línea | Ya funciona así. A 68 px y 24ch, cortar por letras daría 24 nodos por línea y se leería como truco |
| `.pod-seccion__entrada`, `.pod-seccion__giro`, `.pod-seccion__sentencia`, `.pod-remate` | **palabras**, sin máscara | 44 px en caja baja. Son de 6 a 14 palabras: el escalonado por palabra las lee como frase |
| `.pod-cierre__linea` | **letras** | Es el único sitio donde se justifica. Las dos líneas suman **83 caracteres**: a `0,018 s` de escalonado son 1,5 s de cascada, y es el último gesto de la página |
| Todo lo demás | sin corte | Fundido de bloque |

### 7.3 Tabla de comportamientos

| Nivel | Elementos | Gesto | Duración | Easing | Disparo | ¿Revierte al subir? |
|---|---|---|---|---|---|---|
| **T1 · Titular** | `.pod-encabezado__rotulo` + `.pod-encabezado__titulo` | Rótulo `opacity 0→1`, `y 14→0`; titular por palabras `yPercent 108→0` + `opacity 0→1` bajo `.cam-line` | rótulo 0,6 s · titular 0,8 s, `stagger: 0.045` | `power4.out` | `start: "top 80%"` | **SÍ.** `toggleActions: "play none none reverse"`, se retira `once: true` |
| **T1b · Display suelto** | `.pod-seccion__entrada`, `.pod-seccion__giro`, `.pod-seccion__sentencia`, `.pod-remate` | Por palabras: `y 22→0` + `opacity 0→1` | 0,7 s, `stagger: 0.04` | `power3.out` | `start: "top 84%"` | **SÍ**, mismos `toggleActions` |
| **T1c · Cierre** | `.pod-cierre__linea` | Por letras: `opacity 0→1`, `yPercent 60→0` | 0,55 s, `stagger: 0.018` | `power2.out` | `start: "top 78%"` | **SÍ** |
| **T1d · Cifras** | `.pod-cifra` (contenedor), `.pod-dato__valor` | Contenedor `opacity 0→1`, `y 18→0`, `stagger 0.06` | 0,7 s | `power3.out` | `start: "top 85%"` | **SÍ el contenedor. NO el número**: el conteo corre una sola vez y al revertir el dígito se queda en su valor final. Un contador que descuenta al subir marea |
| **T1e · Imagen de escena** | `.pod-escena__media` | `opacity 0→1` + `scale 1.04→1` **sobre el `<img>`**, no sobre la caja | 1,1 s | `power2.out` | `start: "top 82%"` | **SÍ, solo la opacidad.** La escala se congela en 1 al revertir, para no producir un zoom inverso |
| **T2 · Cuerpo** | `.pod-seccion__cuerpo`, `.pod-sintoma`, `.pod-rotulo-lista`, `.pod-pilar`, `.pod-dimension`, `.pod-perfil`, `.pod-especialista`, `.pod-balanza__lado`, `.pod-datos`, `.pod-faq`, `.pod-inscripcion`, `.pod-aval`, `.pod-microcopy` | `opacity 0→1`, `y 12→0` (hoy 26) | **0,55 s** (hoy 0,9) | `power2.out` | `start: "top 88%"` | **NO.** `once: true` |
| **T2b · Tarjetas de módulo** | `.pod-modulo` | `opacity 0→1`, `x ±72→0` en zigzag (hoy ±140) | 0,7 s (hoy 1,05) | `power3.out` | `start: "top 85%"`, `delay: (i % 3) * 0.07` | **NO.** `once: true` |

Escalonado de rejilla: `indice * 0.04 s`, tope 6 tarjetas = 0,24 s de cola. Nunca más de 6 elementos
en movimiento de ~57 bloques: **10,5 %**, bajo el techo del 15 % de P1-6.

La reversibilidad se reserva a titulares y display porque reproducir los 57 bloques en las dos
direcciones sobre una página de 19.276 px se lee como nerviosismo y estorba la relectura.

### 7.4 `.cam-reveal` se conserva, pase lo que pase

Los envoltorios nuevos de `premium/podio/` **siguen emitiendo la clase `.cam-reveal` exacta**. No es
estética: sostiene cuatro contratos vivos en `podio.css`.

| Línea | Regla | Qué se rompe sin ella |
|---|---|---|
| 597 | `.pod-root .cam-reveal { opacity: 0 }` | Destello del contenido antes de que GSAP tome el control |
| 1276-1279 | `opacity: 1 !important; transform: none !important` bajo `prefers-reduced-motion` | La sección entera se queda invisible si el JavaScript no corre |
| 1895-1899 | `height: 100%` sobre hijos directos de cinco retículas | Las tarjetas de una fila quedan con los bordes inferiores a distinta altura |
| 1855 | `.pod-cierre__frase > .cam-reveal + .cam-reveal { margin-top: … }` | Las dos frases del cierre se pegan y se leen como un párrafo |

**No se introduce ninguna clase de estado inicial nueva.** Si un envoltorio necesita distinguirse,
lo hace con un `data-*`, nunca sustituyendo `.cam-reveal`.

### 7.5 Envoltorios a crear en `premium/podio/`

Los tres componentes compartidos no se tocan: los importan `src/app/g/camara/page.tsx` y
`src/app/g/fusion/page.tsx`, además de esta landing.

| Archivo | Sustituye a | Nivel | Nota |
|---|---|---|---|
| `EncabezadoPodio.tsx` | se modifica en su sitio | T1 | Es de Podio; solo cambia `once` por `toggleActions` |
| `LineaPodio.tsx` | nuevo | T1b / T1c | SplitText por palabras, o por letras con `data-corte="letras"` |
| `RevelaPodio.tsx` | `Reveal` de `premium/camara` | T2 | Emite `.cam-reveal` |
| `CifraPodio.tsx` | `StatCounter` de `premium/camara` | T1d | Emite `.cam-reveal` |
| `ModuloPodio.tsx` | `ModuleSlide` de `premium/fusion` | T2b | Emite `.cam-reveal h-full` |
| `MediaEscena.tsx` | nuevo | T1e | Sin `transform` en la caja: solo en el `<img>` |

### 7.6 `prefers-reduced-motion: reduce`

1. **Nada se anima**: ni entradas, ni reversiones, ni conteos, ni escalas. Todo se pinta en su
   estado final desde el primer frame.
2. **No se ejecuta SplitText** en ninguno de los seis tipos de línea. El texto conserva su nodo
   intacto, lo que importa para lectores de pantalla y para poder seleccionarlo. Este
   comportamiento ya existe en `EncabezadoPodio` y se replica en `LineaPodio`.
3. `CifraPodio` escribe el valor final directamente.
4. `MediaEscena` pinta la imagen a `opacity: 1`, `scale: 1`.
5. Se anulan las transiciones CSS de `.pod-boton`, `.pod-modulo`, `.pod-faq__panel`,
   `.pod-faq__icono` (ya existen) y se añaden `.pod-escena__media` y `.pod-escena__imagen`.
6. La comprobación se hace **en ejecución con `prefersReducedMotionNow()`**, no solo con la media
   query: el estado inicial oculto lo pone el CSS y sin la comprobación en JS un bloque podría
   quedarse invisible para siempre.

---

## 8. Cambios de markup exigidos

### 8.1 Partir la agitación en dos y bajar a tres registros (P1-8)

La `<section aria-labelledby="pod-agitacion">` se convierte en dos secciones hermanas, ambas con
fondo abyss; el filete superior de la segunda marca el corte y **la alternancia de las secciones
siguientes no se toca**.

- **Bloque 2 · el punto de inflexión**: `.pod-escena` con el encabezado, la entradilla y el cuerpo
  en `.pod-escena__texto` y `mesa-directorio` en `.pod-escena__media`; `giro` y `sentencia` debajo,
  dentro de la columna de texto.
- **Bloque 3 · los síntomas**: `.pod-rotulo-lista` + `.pod-sintomas` + `.pod-remate`, a todo el
  ancho, sin encabezado propio.

Registros resultantes en el bloque 2: **titular 68 · display serif 44 · cuerpo sans 18,3**. Tres, no
cuatro.

### 8.2 Las cuatro secciones con media

Los bloques 5, 8, 9 y 11 envuelven su encabezado en `.pod-escena` y cuelgan la imagen de la columna
derecha. La rejilla de la escena (dimensiones, perfiles, balanza, datos) sigue **fuera** de
`.pod-escena`, a todo el ancho del contenedor. El bloque 11 (`#inversion`) sustituye su
`.pod-columnas` de `0.85fr 1.15fr` por `.pod-escena`, con la lista `.pod-datos` bajo el encabezado
en la columna izquierda.

### 8.3 La ficha se apila en móvil

`.pod-dato` es hoy un `flex` con `justify-content: space-between` sin `flex-wrap`. Con el valor a
24 px en móvil, etiqueta y valor se pelean por 342 px:

```css
@media (max-width: 40rem) {
  .pod-dato { flex-direction: column; align-items: flex-start; gap: var(--pod-space-1); }
}
```

### 8.4 La barra se repliega sobre el cierre (P1-4)

`BarraPodio.tsx` añade una tercera señal, igual que ya combina `data-recorrido-terminado` con el
`IntersectionObserver` de la apertura: un observador sobre `#inscripcion` con `threshold: 0` y
`rootMargin: "-10% 0px -10% 0px"`. Mientras interseca, la barra pierde `data-visible` y se repliega
con su transición actual de 420 ms. Nunca hay dos rellenos oro en pantalla, y el CTA final deja de
tener una barra encima.

### 8.5 Targets táctiles (P0-5)

```css
.pod-barra__cta { min-height: 44px; padding-inline: var(--pod-space-5); }

@media (max-width: 560px) {
  .pod-barra__cta { min-height: 44px; padding: 0 var(--pod-space-4); font-size: var(--pod-etiqueta); }
  .pod-barra__conmutador { width: 44px; height: 44px; }
}

.pod-boton { min-height: 48px; }
```

---

## 9. Riesgos y verificación

| # | Riesgo | Cómo se detecta | Mitigación |
|---|---|---|---|
| 1 | **`.pod-root` lleva `overflow-x: clip`**: cualquier desborde nuevo queda oculto y `scrollWidth == innerWidth` seguirá dando verde con la maqueta rota. Es la trampa AP-34 | No sirve `scrollWidth`. Hay que recorrer cajas: `[...document.querySelectorAll('.pod-root *')].filter(n => { const r = n.getBoundingClientRect(); return r.right > innerWidth + 1 \|\| r.left < -1; })` en 1440/768/390 | Se conserva el `clip` (lo necesita el deslizamiento de módulos), pero P0-1 se verifica con el recorrido de cajas |
| 2 | **Sustituir `.cam-reveal` por una clase nueva** rompe cuatro contratos de `podio.css` a la vez, y el peor es silencioso: las tarjetas de una fila quedan a distinta altura | `grep -c "cam-reveal" src/components/premium/podio/*.tsx` tras el cambio, y captura de las cinco retículas | §7.4. Los envoltorios nuevos emiten la clase exacta |
| 3 | **Titular a 42,7 px en móvil**: «ESPECIALISTAS» ocupa 327,7 px de 342 útiles, un 4,2 % de holgura. Subir el `clamp` a 44 px desborda | Captura a 390 px de las secciones de solución, público, método y módulos, más el recorrido de cajas del riesgo 1 | El mínimo del `clamp` es 2,625rem con `letter-spacing: 0.015em` a ≤560 px. No subirlo sin rehacer la cuenta |
| 4 | **Ampliar un cartel por encima de su techo**: a 561 o 600 px de ancho CSS se ven blandos en pantalla de densidad 2, y a sangre en 1440 se verían mal del todo | Inspeccionar el ancho renderizado del `<img>` a 1440 y compararlo con §6.1 | La columna de media queda en 500 px por construcción. Ningún cartel sangra |
| 5 | **Editar `--text-section` en `globals.css`** en vez de sustituir su uso | `grep -rn "text-section" src/` debe devolver solo `globals.css:41` | El token local es `--pod-display-xl`. `globals.css` lo comparten `/telon`, `/galeria` y `/v/*` |
| 6 | **La reversión T1 con Lenis**: un scroll ascendente muy rápido puede dejar un titular a medio revertir si el `ScrollTrigger` se recalcula durante la animación | Subir de golpe con la rueda desde el cierre hasta las cifras y mirar si alguna palabra queda invisible | `invalidateOnRefresh: true` en los triggers T1, `overwrite: "auto"` en los tweens de palabra |
| 7 | **83 spans de letra en el cierre**: SplitText por caracteres fragmenta el nodo de texto y, si no se revierte al desmontar, deja basura en el DOM y en el árbol de accesibilidad | Inspeccionar `#inscripcion` tras navegar fuera y volver | `corte.revert()` en el `cleanup` del efecto, como ya hace `EncabezadoPodio:125` |
| 8 | **Etiquetas un 13 % más anchas**: de 10,56 a 12 px con `0,24em` de tracking ensancha `.pod-aval`, `.pod-dato__etiqueta` y `.pod-balanza__rotulo` | Captura a 390 px de la banda de cifras y de la ficha | `.pod-aval` ya es `flex-wrap` y ahora tiene medida. La ficha se apila por §8.3. Si algún rótulo parte mal, bajar su tracking a `0,18em`, nunca su tamaño |
| 9 | **Contadores reversibles**: aplicar `toggleActions` con reversión al tween de conteo hace que el número descuente al subir | Subir desde la agitación hasta las cifras y mirar los cuatro números | §7.3 T1d: `once` en el conteo, reversión solo en el contenedor |
| 10 | **La barra que se repliega sobre `#inscripcion`** puede parpadear si la sección es más alta que el viewport | Scroll lento por el cierre | El `rootMargin` de histéresis de §8.4 |
| 11 | **`position: sticky` en la columna de media** no funcionaría: cualquier ancestro con `transform` de GSAP crea bloque contenedor | — | No se usa `sticky` en ninguna parte. La columna va alineada arriba |

### Protocolo de verificación antes de cerrar

1. `npm run build` sin errores ni avisos nuevos de lint.
2. Consola limpia en `/` tras un scroll completo: hoy son 0 errores y 0 peticiones fallidas, y así
   tiene que seguir (P0-2).
3. Recorrido de cajas del riesgo 1 en 1440 / 768 / 390 → lista vacía (P0-1).
4. **Caracteres por línea en los tres viewports → máximo ≤75 y 0 párrafos fuera de rango.** Hoy son
   232 y 11 de 85. Es el ítem que más cambia (P1-9).
5. Contraste computado de todas las clases de §4 contra su fondo real → ≥4,5:1 en texto normal y
   ≥3:1 en display. Los cuatro elementos que hoy dan 4,34:1 deben dar 6,80:1 (P0-4).
6. `getBoundingClientRect()` de `.pod-barra__cta`, `.pod-barra__conmutador`, `.pod-boton` y
   `.pod-faq__pregunta` a 390 px → todos ≥44 px de alto (P0-5).
7. `font-size` computado del titular dividido por el del cuerpo de tarjeta y por el de
   `.pod-seccion__cuerpo`, en los tres viewports → 2,84 / 3,66 / 4,04 y 2,51 / 3,30 / 3,71 (P1-3).
8. Ancho renderizado de los cinco `<img>` a 1440 → ≤500 px (§6.1).
9. Conteo de rellenos oro visibles por pantalla de scroll → nunca más de 1 (P1-4).
10. Recarga con `prefers-reduced-motion: reduce` forzado: 0 `ScrollTrigger` vivos, 0 nodos de texto
    invisibles, los cuatro contadores en su valor final, ningún `<span>` de SplitText en el DOM.
11. **Recorrido de bajada y de subida completo**: al volver arriba, los 11 titulares, las líneas de
    display de cada escena y el cierre deben haber revertido; los ~57 bloques de cuerpo, no. Hoy la
    medición da 0 revertidos, que es el punto de partida (P1-6, §7).
12. `padding-block` computado de `.pod-seccion` a 1440×800 → ≥120 px (P1-7).

---

## 10. Resumen de tokens, para pegar

```css
.pod-root {
  /* tamaños */
  --pod-display-xl: clamp(2.625rem, 1.72rem + 3.9vw, 4.25rem);
  --pod-display-l:  clamp(1.75rem, 1.3rem + 1.85vw, 2.75rem);
  --pod-display-s:  clamp(1.15rem, 1.05rem + 0.42vw, 1.45rem);
  --pod-cuerpo:     clamp(1.0625rem, 1.02rem + 0.14vw, 1.1875rem);
  --pod-cuerpo-s:   clamp(0.9375rem, 0.9rem + 0.17vw, 1.0625rem);
  --pod-etiqueta:   clamp(0.75rem, 0.72rem + 0.1vw, 0.8125rem);
  --pod-cifra:      clamp(3rem, 2rem + 4.1vw, 5rem);
  --pod-numeral:    clamp(1.5rem, 1.3rem + 0.85vw, 2.25rem);

  /* espacio */
  --pod-space-1: 0.25rem; --pod-space-2: 0.5rem; --pod-space-3: 0.75rem; --pod-space-4: 1rem;
  --pod-space-5: 1.5rem;  --pod-space-6: 2rem;   --pod-space-7: 3rem;    --pod-space-8: 4rem;
  --pod-aire-seccion: clamp(4.5rem, 4rem + 5vw, 9.5rem);
  --pod-aire-bloque:  clamp(2.5rem, 2rem + 2.5vw, 4rem);

  /* tinta: mismos nombres de siempre, valores corregidos */
  --color-hueso: #f3eee2;
  --color-texto: rgb(243 238 226 / 0.78);
  --color-texto-tenue: rgb(243 238 226 / 0.62);
  --color-adorno: rgb(243 238 226 / 0.45);
  --color-linea: rgb(243 238 226 / 0.14);
  --color-linea-fuerte: rgb(180 130 45 / 0.4);

  /* oro: sin cambios de valor, con roles nuevos */
  --color-oro: #b4822d;
  --color-oro-brillo: #e7b655;
  --color-oro-suave: #f0c877;
  --color-oro-sombra: #885825;   /* solo filetes */

  /* forma */
  --pod-radio: 0;
  --pod-sombra-halo:   0 0 60px rgb(180 130 45 / 0.12);
  --pod-sombra-filete: 0 1px 10px rgb(8 6 3 / 0.75);
  --pod-sombra-brillo: 0 0 12px rgb(231 182 85 / 0.55);
}
```
