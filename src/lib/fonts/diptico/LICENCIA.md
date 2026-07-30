# Fuentes del díptico promocional — procedencia y licencia

Tipografía tomada del material oficial del diplomado:
`landing DIPLOMADO/drive-download-20260712T235229Z-2-001/Díptico promo diplomado.pdf`
(generado en Canva el 11 de julio de 2026). Las familias se identificaron leyendo las
fuentes embebidas del PDF con `pdffonts`, no por apreciación visual.

Las tres se distribuyen bajo **SIL Open Font License 1.1**, cuyo texto completo está en
`OFL-1.1.txt`. La OFL permite el uso comercial y la incrustación en un sitio web; exige
conservar el aviso de copyright y prohíbe vender las fuentes por separado. Ninguna de
las tres se ha modificado, de modo que los nombres reservados de familia se mantienen
tal cual y no se incurre en la cláusula 3 de la licencia.

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
