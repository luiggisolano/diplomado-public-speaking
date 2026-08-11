/*
  Contrato de la inscripción: nombres de campo, límites, patrones y las reglas de validación
  que deciden si una solicitud entra o se rechaza.

  Vive en lib y no dentro del route handler porque lo consumen las dos orillas. El servidor es
  la autoridad y valida siempre, sin excepción y sin confiar en nada que venga del navegador;
  el cliente ejecuta exactamente las mismas reglas antes de la petición solo para que la
  persona vea el error en el propio campo sin esperar un viaje de red. Si las reglas vivieran
  duplicadas, con el tiempo divergirían y el formulario aceptaría en pantalla lo que el
  servidor rechaza, que es el peor de los dos mundos.

  Todo lo que se exporta es puro y sin dependencias: se ejecuta igual en el runtime del
  servidor que en el navegador.
*/

export const CAMPO_TRAMPA = "sitioWeb";

export const TEXTO_DEL_CONSENTIMIENTO =
  "Acepto que mis datos se usen para contactarme sobre este diplomado";

export const LIMITES_DE_LONGITUD = {
  nombre: { minimo: 3, maximo: 80 },
  correo: { minimo: 6, maximo: 120 },
  telefono: { minimo: 7, maximo: 24 },
} as const;

/*
  El nombre acepta letras latinas con sus acentos, la eñe, el apóstrofo, el punto de las
  abreviaturas y el guion de los apellidos compuestos. No acepta dígitos ni signos, que es
  como llega el spam que intenta colar una URL en un campo de texto libre.

  El rango se escribe carácter a carácter en lugar de con \p{L} porque tsconfig apunta a
  ES2017 y las clases de propiedad Unicode exigen ES2018: el compilador rechazaría el archivo.
*/
const PATRON_NOMBRE = /^[A-Za-zÀ-ÖØ-öø-ÿ'’.\- ]+$/;

const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

/*
  Dos formatos, los dos que de verdad escribe la gente aquí:

    · nacional ecuatoriano, con cero inicial: celular de diez dígitos (0991234567) o fijo de
      nueve (072934567).
    · internacional con prefijo, para quien escribe desde fuera o guarda el número como lo
      guarda WhatsApp (+593991234567).

  Los adornos de separación se quitan antes de comparar, así que «099 123 4567»,
  «099-123-4567» y «(07) 293 4567» entran por la misma puerta.
*/
const PATRON_TELEFONO_NACIONAL = /^0[2-9]\d{7,8}$/;
const PATRON_TELEFONO_INTERNACIONAL = /^\+[1-9]\d{7,14}$/;
const ADORNOS_DEL_TELEFONO = /[\s().\- ]/g;

export const MENSAJES_DE_ERROR = {
  nombreVacio: "Escribe tu nombre completo.",
  nombreCorto: `El nombre debe tener al menos ${LIMITES_DE_LONGITUD.nombre.minimo} caracteres.`,
  nombreLargo: `El nombre no puede superar los ${LIMITES_DE_LONGITUD.nombre.maximo} caracteres.`,
  nombreConSignos: "El nombre solo admite letras, espacios, apóstrofos y guiones.",
  correoVacio: "Escribe tu correo electrónico.",
  correoLargo: `El correo no puede superar los ${LIMITES_DE_LONGITUD.correo.maximo} caracteres.`,
  correoMalFormado: "Ese correo no parece válido. Revisa que tenga la forma nombre@dominio.com",
  telefonoVacio: "Escribe tu número de teléfono.",
  telefonoLargo: `El teléfono no puede superar los ${LIMITES_DE_LONGITUD.telefono.maximo} caracteres.`,
  telefonoMalFormado:
    "Ese teléfono no parece válido. Usa 10 dígitos como 0991234567 o el formato internacional +593991234567",
  consentimientoFaltante: "Necesitamos tu autorización para poder contactarte.",
  cuerpoIlegible: "No pudimos leer los datos enviados. Vuelve a intentarlo.",
} as const;

export type CampoDeInscripcion = "nombre" | "correo" | "telefono" | "consentimiento";

export type ErroresDeInscripcion = Partial<Record<CampoDeInscripcion, string>>;

export type DatosDeInscripcion = {
  nombre: string;
  correo: string;
  telefono: string;
  consentimiento: boolean;
};

export type ResultadoDeValidacion =
  | { esValido: true; datos: DatosDeInscripcion }
  | {
      esValido: false;
      errores: ErroresDeInscripcion;
      primerCampoConError: CampoDeInscripcion;
    };

/*
  El orden en que se recorren los campos para decidir a cuál se lleva el foco. Es el mismo
  orden visual del formulario, porque llevar el foco hacia atrás desorienta.
*/
export const ORDEN_DE_LOS_CAMPOS: readonly CampoDeInscripcion[] = [
  "nombre",
  "correo",
  "telefono",
  "consentimiento",
] as const;

function leerTextoDelCampo(origen: Record<string, unknown>, campo: string): string {
  const valor = origen[campo];
  return typeof valor === "string" ? valor.trim() : "";
}

export function normalizarTelefono(valor: string): string {
  return valor.replace(ADORNOS_DEL_TELEFONO, "");
}

function validarNombre(nombre: string): string | undefined {
  if (nombre.length === 0) {
    return MENSAJES_DE_ERROR.nombreVacio;
  }
  if (nombre.length < LIMITES_DE_LONGITUD.nombre.minimo) {
    return MENSAJES_DE_ERROR.nombreCorto;
  }
  if (nombre.length > LIMITES_DE_LONGITUD.nombre.maximo) {
    return MENSAJES_DE_ERROR.nombreLargo;
  }
  if (!PATRON_NOMBRE.test(nombre)) {
    return MENSAJES_DE_ERROR.nombreConSignos;
  }
  return undefined;
}

function validarCorreo(correo: string): string | undefined {
  if (correo.length === 0) {
    return MENSAJES_DE_ERROR.correoVacio;
  }
  if (correo.length > LIMITES_DE_LONGITUD.correo.maximo) {
    return MENSAJES_DE_ERROR.correoLargo;
  }
  if (correo.length < LIMITES_DE_LONGITUD.correo.minimo || !PATRON_CORREO.test(correo)) {
    return MENSAJES_DE_ERROR.correoMalFormado;
  }
  return undefined;
}

function validarTelefono(telefono: string): string | undefined {
  if (telefono.length === 0) {
    return MENSAJES_DE_ERROR.telefonoVacio;
  }
  if (telefono.length > LIMITES_DE_LONGITUD.telefono.maximo) {
    return MENSAJES_DE_ERROR.telefonoLargo;
  }
  const compacto = normalizarTelefono(telefono);
  const esNacional = PATRON_TELEFONO_NACIONAL.test(compacto);
  const esInternacional = PATRON_TELEFONO_INTERNACIONAL.test(compacto);
  if (!esNacional && !esInternacional) {
    return MENSAJES_DE_ERROR.telefonoMalFormado;
  }
  return undefined;
}

/*
  El consentimiento se exige estrictamente booleano y en verdadero. No se acepta la cadena
  «on» ni el número 1 aunque un formulario nativo los enviaría: sin una afirmación explícita
  no hay base legal para tratar el dato, y una coerción laxa es exactamente la vía por la que
  un consentimiento acaba dándose por supuesto.
*/
function validarConsentimiento(consentimiento: unknown): string | undefined {
  return consentimiento === true ? undefined : MENSAJES_DE_ERROR.consentimientoFaltante;
}

export function validarInscripcion(cuerpo: unknown): ResultadoDeValidacion {
  const origen =
    typeof cuerpo === "object" && cuerpo !== null ? (cuerpo as Record<string, unknown>) : {};

  const nombre = leerTextoDelCampo(origen, "nombre");
  const correo = leerTextoDelCampo(origen, "correo");
  const telefono = leerTextoDelCampo(origen, "telefono");
  const consentimiento = origen.consentimiento === true;

  const errores: ErroresDeInscripcion = {};
  const errorDeNombre = validarNombre(nombre);
  const errorDeCorreo = validarCorreo(correo);
  const errorDeTelefono = validarTelefono(telefono);
  const errorDeConsentimiento = validarConsentimiento(origen.consentimiento);

  if (errorDeNombre) errores.nombre = errorDeNombre;
  if (errorDeCorreo) errores.correo = errorDeCorreo;
  if (errorDeTelefono) errores.telefono = errorDeTelefono;
  if (errorDeConsentimiento) errores.consentimiento = errorDeConsentimiento;

  const primerCampoConError = ORDEN_DE_LOS_CAMPOS.find((campo) => errores[campo]);

  if (primerCampoConError) {
    return { esValido: false, errores, primerCampoConError };
  }

  return {
    esValido: true,
    datos: { nombre, correo, telefono: normalizarTelefono(telefono), consentimiento },
  };
}

/*
  Un valor con contenido en el campo trampa significa que quien envió el formulario no vio la
  pantalla. Se comprueba con una función propia porque la decisión que dispara no es de
  validación sino de política: al bot se le responde éxito.
*/
export function pareceUnEnvioAutomatico(cuerpo: unknown): boolean {
  if (typeof cuerpo !== "object" || cuerpo === null) {
    return false;
  }
  const valorDeLaTrampa = (cuerpo as Record<string, unknown>)[CAMPO_TRAMPA];
  return typeof valorDeLaTrampa === "string" && valorDeLaTrampa.trim().length > 0;
}
