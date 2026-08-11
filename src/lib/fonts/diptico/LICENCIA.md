# Fuentes del díptico promocional — procedencia y licencia

Tipografía tomada del material oficial del diplomado:
`landing DIPLOMADO/drive-download-20260712T235229Z-2-001/Díptico promo diplomado.pdf`
(generado en Canva el 11 de julio de 2026). Las familias se identificaron leyendo las
fuentes embebidas del PDF con `pdffonts`, no por apreciación visual.

Este documento afirmaba que las tres se distribuyen bajo **SIL Open Font License 1.1**,
con su texto en `OFL-1.1.txt`. **Esa afirmación está sin verificar y hay indicios en
contra** (ver «Licencia por confirmar» al final). Los nombres de familia se mantienen tal
cual en los tres archivos. `GlacialIndifference-Bold.woff2` lleva una corrección
tipográfica puntual documentada más abajo; las otras dos conservan el contorno con el que
salieron del subconjunto original.

| Archivo | Familia | Autoría | Uso en la landing |
|---|---|---|---|
| `GlacialIndifference-Regular.woff2` (15,2 KB) | Glacial Indifference Regular | Alfredo Marco Pradil | Cuerpo, kickers, etiquetas |
| `GlacialIndifference-Bold.woff2` (10,1 KB) | Glacial Indifference Bold | Alfredo Marco Pradil | Títulos de módulo, énfasis |
| `DipticoSignos.woff2` (752 B) | Jost, subconjunto de 3 glifos | indestructible type* | Solo `·`, `¿`, `¡` |

Playfair Display, la tercera familia del díptico, no vive aquí: se sirve por
`next/font/google` desde `src/lib/fonts-diptico.ts`.

## Por qué existe DipticoSignos

Glacial Indifference no incluye interpunto (`·`), interrogación de apertura (`¿`) ni
exclamación de apertura (`¡`). El propio díptico topó con el mismo límite y Canva le
embebió `NotoSans-Regular` para salvar los signos de apertura del texto en español.

El copy de la landing usa el interpunto seis veces como separador visible (kicker del
hero, microcopy de cierre y la fila «UTMACH · CEC» de la ficha), y el FAQ compartido
abre cuatro preguntas con `¿`. Antes que dejar esos signos en manos del sans del
sistema, se sirve un subconjunto de Jost recortado a esos tres caracteres: misma
geometría monolineal de linaje Futura y 752 bytes de coste.

## Corrección del glifo «é» en el peso Bold

`GlacialIndifference-Bold.woff2` traía el glifo `eacute` (`é`, U+00E9) con nueve
contornos en lugar de tres: el cuerpo de la «e» y su ojo aparecían dibujados cuatro
veces, superpuestos punto por punto sobre sí mismos, mientras que el acento figuraba una
sola vez. Con relleno de bordes distintos de cero la silueta resultante sigue siendo la
correcta, de modo que el defecto no se ve en el contorno vectorial sino en el
rasterizado: los motores que acumulan la cobertura contorno a contorno antes de
recortarla asignan a cada píxel del borde hasta cuatro veces la cobertura que le toca y
lo saturan a tinta plena. La «é» salía entonces más pesada que las letras vecinas y con
el ojo estrangulado, que es como el cliente lo describió.

El efecto depende del motor, y conviene dejarlo escrito para no repetir la medición. En
Firefox el glifo original gasta un 29 % más de tinta que el corregido a 16 px, un 15 % a
34 px —el cuerpo de los títulos de módulo— y un 3,6 % a 150 px: el exceso decrece con el
tamaño porque es proporcional al perímetro, no al área. En Chromium, en cambio, ambos
binarios rasterizan idénticos píxel a píxel de 16 a 150 px, porque Skia resuelve la
cobertura por regla de giro global y la superposición no le afecta. Ese cero no es un falso
negativo: el mismo arnés, con un control que mueve el acento 25 unidades, sí acusa 286
píxeles de diferencia. La corrección, por tanto, arregla Firefox y los rasterizadores
basados en FreeType, y en Chromium no cambia nada ni para bien ni para mal.

Conviene por eso no prometer de más: **si el defecto se vio en Chrome o Edge, esta
corrección no lo va a cambiar y la causa sigue sin identificar.**

El defecto era exclusivo de ese glifo: los otros 184 del Bold, los 187 del Regular y los
4 de DipticoSignos no tienen contornos duplicados.

La corrección elimina del *charstring* CFF las tres pasadas redundantes y conserva la
primera. No se redibujó nada: los tres contornos que quedan son los originales, punto
por punto, y el acento no se tocó.

Se mantienen sin variación el ancho de avance (572 unidades), el *left side bearing*
(35), la caja del glifo (35, −10, 537, 704), las tablas `hmtx`, `head`, `hhea`, `OS/2`,
`cmap` y `name`, la retícula de 1000 unidades por em y los 184 glifos restantes, que
siguen siendo idénticos punto por punto. La página no sufre por tanto ningún
desplazamiento de maquetación: el texto ocupa exactamente lo mismo que antes.

## Licencia por confirmar (pendiente de decisión, 2026-08-11)

La atribución OFL de este documento no se sostiene sobre lo que dicen los propios
binarios. Leída la tabla `name` de los dos archivos con fontTools:

| Archivo | nameID 0 (copyright) | nameID 13 (licencia) | nameID 14 (URL de licencia) |
|---|---|---|---|
| `GlacialIndifference-Regular.woff2` | `Copyright (c) 2015 by Alfredo Marco Padil. All rights reserved.` | ausente | ausente |
| `GlacialIndifference-Bold.woff2` | `Glacial Indifference is a trademark of Alfredo Marco Pradil` | ausente | ausente |
| `DipticoSignos.woff2` | `Copyright 2020 The Jost Project Authors (https://github.com/indestructible-type/Jost)` | ausente | ausente |

**Las columnas 13 y 14 no son prueba de nada, y conviene dejarlo escrito para que nadie las
use como argumento.** `pyftsubset`, el comando con el que se generaron estos archivos y que
está documentado más abajo, conserva por defecto solo los nameID 0 a 6: fue el propio
subconjunto el que borró la licencia, no su ausencia en el original. Para dictaminar haría
falta el OTF de origen, no estos subconjuntos.

Lo que sí sobrevive al subconjunto es el nameID 0, y ahí ninguno de los dos pesos de Glacial
Indifference declara OFL: el Regular dice «All rights reserved», que es lo contrario de lo
que declara una fuente publicada bajo esa licencia, y el Bold reclama una marca. El
`DipticoSignos.woff2`, en cambio, sí conserva la autoría de Jost, que es OFL de origen.

Y el `OFL-1.1.txt` que acompaña a estos archivos es la **plantilla sin rellenar** del texto
legal: conserva los marcadores `<dates>`, `<Copyright Holder>` y `<Reserved Font Name>` en su
cabecera, así que no concede nada a nadie ni declara ningún Reserved Font Name.

Importa más desde que se corrigió el glifo: parchear un binario lo convierte en obra
derivada conservando el nombre de familia, y una landing institucional de una universidad
pública es el peor sitio para sostener una obra derivada sobre una licencia que no se ha
comprobado. Si algún día se confirmara que sí es OFL y que hay un Reserved Font Name, la
cláusula 3 obligaría además a renombrar la familia de este archivo.

Esto no se resuelve aquí porque no es una decisión técnica. Las salidas razonables son
conseguir del autor la licencia real, sustituir la familia por una equivalente de licencia
verificada, o confirmar que el material del que salió el díptico ya traía los derechos de
uso. Hasta entonces, ni este documento ni el repositorio deben afirmar que la fuente es
OFL.

## Reproducir los archivos

```sh
# Glacial Indifference: OTF original → woff2 con cobertura latin + latin-ext
pyftsubset GlacialIndifference-Regular.otf \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" \
  --layout-features="*" --flavor=woff2 --output-file=GlacialIndifference-Regular.woff2

# DipticoSignos: woff2 de Jost latin → solo los tres signos que faltan
pyftsubset jost-latin.woff2 --unicodes="U+00B7,U+00BF,U+00A1" \
  --flavor=woff2 --output-file=DipticoSignos.woff2
```

La deduplicación del glifo `eacute` en el Bold se rehace con fontTools recortando la
cola redundante del *charstring*. Las banderas `recalcBBoxes` y `recalcTimestamp` van
desactivadas para que el único cambio del binario sea el propio glifo:

```python
from fontTools.ttLib import TTFont

fuente = TTFont("GlacialIndifference-Bold.woff2", recalcBBoxes=False, recalcTimestamp=False)
cff = fuente["CFF "].cff
charstring = cff[cff.fontNames[0]].CharStrings["eacute"]
charstring.decompile()

# El programa repite cuatro veces el par ojo+cuerpo; se conservan el acento y la
# primera pasada, y se corta desde la segunda hasta el final.
corte = charstring.program.index("callsubr", charstring.program.index(-89)) + 1
charstring.program = charstring.program[:corte] + ["endchar"]
charstring.bytecode = None

fuente.flavor = "woff2"
fuente.save("GlacialIndifference-Bold.woff2")
```
