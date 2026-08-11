/*
  Recepción de las inscripciones al diplomado. Serverless Function de Vercel, método POST.

  Es la autoridad de validación. El formulario del navegador repite las mismas reglas para
  pintar el error en el campo correcto sin esperar la red, pero ninguna de esas comprobaciones
  cuenta aquí: el atributo `required` del HTML, los patrones del cliente y hasta el propio
  formulario pueden no haber existido nunca, porque a esta ruta se llega igual con curl. Por
  eso el cuerpo entra como `unknown` y no se toca ni un dato hasta que validarInscripcion lo
  aprueba.

  ================================================================================
  AVISO LOPDP (Ley Orgánica de Protección de Datos Personales, Ecuador)
  ================================================================================
  Este endpoint recibe DATOS PERSONALES: nombre, correo y teléfono de una persona
  identificable. Mientras no exista destino final, el único sitio donde quedan es el REGISTRO
  DE LA PLATAFORMA, es decir los logs de Vercel, y eso tiene tres consecuencias que el
  responsable del dato necesita conocer:

    1. Los logs de Vercel no son un almacén de datos personales. Son legibles por cualquier
       miembro del equipo del proyecto, no cifran el contenido y su retención la fija el plan
       contratado, no el responsable del tratamiento.
    2. Ese estado es TRANSITORIO y solo aceptable durante la fase de pruebas de esta landing.
       No debe publicarse a un dominio de producción recogiendo inscripciones reales sin haber
       conectado antes el destino definitivo.
    3. Al conectar el destino real hay que revisar a la vez la RETENCIÓN: cuánto tiempo se
       guarda, quién accede, cómo se atiende una solicitud de eliminación y cómo se deja de
       escribir el dato en el log de la plataforma (registrar solo un identificador de la
       solicitud, nunca el contenido).

  Lo que sí cumple ya: el consentimiento es obligatorio y explícito, sin él la solicitud se
  rechaza con 400 y no se registra absolutamente nada.
  ================================================================================

  TODO (decisión pendiente del cliente, Centro de Educación Continua UTMACH): elegir el
  destino real de la solicitud y sustituir aquí el registro en log por el reenvío. Las tres
  vías sobre la mesa, ninguna cableada todavía porque el destino no está decidido:

    · Hoja de cálculo de Google mediante un Apps Script publicado como aplicación web. Es la
      más barata y la que el equipo administrativo ya sabe leer. Ojo con la redirección 302
      que devuelve Apps Script, que rompe el POST si se espera leer la respuesta.
    · CRM o formulario institucional, si el Centro ya tiene uno donde entran el resto de sus
      programas. Es la única vía que deja la trazabilidad dentro de la universidad.
    · Correo de notificación a educacion_continua@utmachala.edu.ec mediante un proveedor
      transaccional. Sirve de aviso inmediato, pero un buzón no es un registro consultable.

  Sea cual sea, el secreto va en variable de entorno, nunca en este archivo, y la escritura se
  envuelve en su propio try/catch: si el destino falla, la persona debe ver un error honesto y
  la vía de WhatsApp, no una confirmación falsa.
*/

import {
  MENSAJES_DE_ERROR,
  pareceUnEnvioAutomatico,
  validarInscripcion,
  type DatosDeInscripcion,
} from "@/lib/inscripcion";

const MENSAJE_DE_EXITO =
  "Recibimos tu solicitud. El Centro de Educación Continua te contactará para completar la matrícula.";
const MENSAJE_DE_ERROR_DE_VALIDACION = "Revisa los datos marcados y vuelve a enviarlos.";
const CABECERAS_DE_LA_RESPUESTA = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
} as const;

const EVENTO_DE_SOLICITUD_RECIBIDA = "inscripcion.recibida";
const EVENTO_DE_CUERPO_ILEGIBLE = "inscripcion.cuerpo_ilegible";
const EVENTO_DE_VALIDACION_FALLIDA = "inscripcion.validacion_fallida";
const EVENTO_DE_TRAMPA_ACTIVADA = "inscripcion.trampa_activada";

function responder(cuerpo: Record<string, unknown>, estado: number): Response {
  return new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: CABECERAS_DE_LA_RESPUESTA,
  });
}

/*
  Devuelve el cuerpo ya interpretado, o el símbolo de fallo si no había cuerpo o no era JSON.
  Se distingue del `null` legítimo que un cliente podría enviar como cuerpo, que también es
  JSON válido y debe seguir el camino normal de validación hasta ser rechazado por campos.
*/
const CUERPO_ILEGIBLE = Symbol("cuerpo ilegible");

async function leerElCuerpo(peticion: Request): Promise<unknown> {
  try {
    return await peticion.json();
  } catch (fallo) {
    console.warn(
      JSON.stringify({
        evento: EVENTO_DE_CUERPO_ILEGIBLE,
        ocurridoEn: new Date().toISOString(),
        tipoDeContenido: peticion.headers.get("content-type"),
        motivo: fallo instanceof Error ? fallo.message : String(fallo),
      }),
    );
    return CUERPO_ILEGIBLE;
  }
}

/*
  Único destino de los datos a día de hoy. Lleva el nivel `info` y una sola línea de JSON por
  solicitud para que sea filtrable en el panel de la plataforma. Ver el AVISO LOPDP de arriba
  antes de dar por bueno este comportamiento en producción.
*/
function registrarLaSolicitud(datos: DatosDeInscripcion, origen: string | null): void {
  console.info(
    JSON.stringify({
      evento: EVENTO_DE_SOLICITUD_RECIBIDA,
      ocurridoEn: new Date().toISOString(),
      origen,
      nombre: datos.nombre,
      correo: datos.correo,
      telefono: datos.telefono,
      consentimientoOtorgado: datos.consentimiento,
      destinoDefinitivo: "pendiente de decisión del cliente",
    }),
  );
}

export async function POST(peticion: Request): Promise<Response> {
  const cuerpo = await leerElCuerpo(peticion);

  if (cuerpo === CUERPO_ILEGIBLE) {
    return responder({ ok: false, mensaje: MENSAJES_DE_ERROR.cuerpoIlegible }, 400);
  }

  /*
    Al bot se le responde exactamente lo mismo que a una persona, con el mismo código y el
    mismo texto, y no se procesa nada: decirle que fue detectado solo le enseña qué campo
    dejar vacío en el siguiente intento.
  */
  if (pareceUnEnvioAutomatico(cuerpo)) {
    console.warn(
      JSON.stringify({
        evento: EVENTO_DE_TRAMPA_ACTIVADA,
        ocurridoEn: new Date().toISOString(),
        origen: peticion.headers.get("referer"),
      }),
    );
    return responder({ ok: true, mensaje: MENSAJE_DE_EXITO }, 200);
  }

  const resultado = validarInscripcion(cuerpo);

  if (!resultado.esValido) {
    console.warn(
      JSON.stringify({
        evento: EVENTO_DE_VALIDACION_FALLIDA,
        ocurridoEn: new Date().toISOString(),
        camposConError: Object.keys(resultado.errores),
      }),
    );
    return responder(
      {
        ok: false,
        mensaje: MENSAJE_DE_ERROR_DE_VALIDACION,
        errores: resultado.errores,
        primerCampoConError: resultado.primerCampoConError,
      },
      400,
    );
  }

  registrarLaSolicitud(resultado.datos, peticion.headers.get("referer"));

  return responder({ ok: true, mensaje: MENSAJE_DE_EXITO }, 200);
}
