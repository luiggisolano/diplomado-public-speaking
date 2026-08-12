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

  DECISIÓN 2026-08-12: el destino elegido es la hoja de cálculo de Google. El reenvío va por
  SHEETS_WEBHOOK_URL, la URL del Apps Script Web App publicado sobre esa hoja (código fuente y
  pasos de despliegue en lib/scripts/apps-script-inscripciones.gs). Ojo con la redirección 302
  que devuelve Apps Script al terminar: seguirla convierte el POST en GET y tira el cuerpo, así
  que reenviarASheets pide `redirect: "manual"` y da por bueno el 302 sin intentar seguirlo.

  Sigue pendiente que el cliente confirme quién tiene acceso a esa hoja y cuánto tiempo se
  conservan las filas: eso no lo decide este archivo. Mientras SHEETS_WEBHOOK_URL no exista en
  el entorno, el comportamiento cae al registro en log de antes, con el mismo aviso LOPDP.
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
const MENSAJE_DE_ERROR_DE_DESTINO =
  "No pudimos registrar tu solicitud en este momento. Escríbenos por WhatsApp y la tomamos de inmediato.";
const CABECERAS_DE_LA_RESPUESTA = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
} as const;

const EVENTO_DE_SOLICITUD_RECIBIDA = "inscripcion.recibida";
const EVENTO_DE_CUERPO_ILEGIBLE = "inscripcion.cuerpo_ilegible";
const EVENTO_DE_VALIDACION_FALLIDA = "inscripcion.validacion_fallida";
const EVENTO_DE_TRAMPA_ACTIVADA = "inscripcion.trampa_activada";
const EVENTO_DE_SHEETS_ENVIADA = "inscripcion.sheets_enviada";
const EVENTO_DE_SHEETS_FALLIDA = "inscripcion.sheets_fallida";
const EVENTO_DE_SHEETS_SIN_CONFIGURAR = "inscripcion.sheets_sin_configurar";

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
  Respaldo transitorio mientras SHEETS_WEBHOOK_URL no exista en el entorno. Lleva el nivel
  `info` y una sola línea de JSON por solicitud para que sea filtrable en el panel de la
  plataforma. Ver el AVISO LOPDP de arriba antes de dar por bueno este comportamiento en
  producción: en cuanto la hoja esté conectada, esta función deja de ser el destino y pasa a
  ser solo la constancia de que no lo era.
*/
function registrarLaSolicitudEnElLog(datos: DatosDeInscripcion, origen: string | null): void {
  console.info(
    JSON.stringify({
      evento: EVENTO_DE_SOLICITUD_RECIBIDA,
      ocurridoEn: new Date().toISOString(),
      origen,
      nombre: datos.nombre,
      correo: datos.correo,
      telefono: datos.telefono,
      consentimientoOtorgado: datos.consentimiento,
      destinoDefinitivo: "log de la plataforma (SHEETS_WEBHOOK_URL sin configurar)",
    }),
  );
}

/*
  Reenvía la inscripción ya validada al Apps Script Web App de la hoja de cálculo. Dos cosas
  que no son evidentes:

  · `redirect: "manual"` porque Apps Script responde con un 302 hacia
    script.googleusercontent.com cuando termina de escribir la fila, y seguir esa redirección
    convierte el POST en GET y descarta el cuerpo antes de completarla; con "manual" el fetch
    no la sigue. El `fetch` del navegador expondría ese 302 como `type: "opaqueredirect"` y
    `status: 0`, pero el runtime Node de las funciones de Vercel no aplica ese velo de
    CORS: entrega el 302 real con `type: "basic"` y el status accesible, verificado en
    logs de producción. Por eso la marca de éxito es cualquier estado menor a 400, no un
    tipo de respuesta que aquí nunca ocurre.
  · No se reenvía DatosDeInscripcion tal cual: se arma un objeto propio para que el contrato
    con Code.gs (lib/scripts/apps-script-inscripciones.gs) no dependa por accidente de cómo se
    llamen los campos internos del tipo de este archivo.
*/
async function reenviarASheets(
  datos: DatosDeInscripcion,
  origen: string | null,
): Promise<boolean> {
  const urlDelWebhook = process.env.SHEETS_WEBHOOK_URL;

  if (!urlDelWebhook) {
    console.warn(
      JSON.stringify({
        evento: EVENTO_DE_SHEETS_SIN_CONFIGURAR,
        ocurridoEn: new Date().toISOString(),
      }),
    );
    return false;
  }

  try {
    const respuesta = await fetch(urlDelWebhook, {
      method: "POST",
      redirect: "manual",
      headers: { "content-type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        nombre: datos.nombre,
        correo: datos.correo,
        telefono: datos.telefono,
        consentimiento: datos.consentimiento,
        origen,
        recibidoEn: new Date().toISOString(),
      }),
    });

    const laEntregaFueBien = respuesta.type === "opaqueredirect" || respuesta.status < 400;

    console[laEntregaFueBien ? "info" : "error"](
      JSON.stringify({
        evento: laEntregaFueBien ? EVENTO_DE_SHEETS_ENVIADA : EVENTO_DE_SHEETS_FALLIDA,
        ocurridoEn: new Date().toISOString(),
        estadoHttp: respuesta.status,
        tipoDeRespuesta: respuesta.type,
      }),
    );

    return laEntregaFueBien;
  } catch (fallo) {
    console.error(
      JSON.stringify({
        evento: EVENTO_DE_SHEETS_FALLIDA,
        ocurridoEn: new Date().toISOString(),
        motivo: fallo instanceof Error ? fallo.message : String(fallo),
      }),
    );
    return false;
  }
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

  const origen = peticion.headers.get("referer");

  /*
    Si SHEETS_WEBHOOK_URL no está configurada, reenviarASheets ya lo registra y devuelve
    false sin lanzar: ese caso cae aquí y usa el log de datos completos como respaldo
    transitorio, igual que antes de conectar la hoja. Si la variable SÍ existe pero el envío
    falla de verdad, es un fallo del destino real y la persona debe verlo: nada de responder
    éxito y perder la solicitud en silencio.
  */
  const laHojaRecibioLaFila = await reenviarASheets(resultado.datos, origen);

  if (!laHojaRecibioLaFila) {
    if (!process.env.SHEETS_WEBHOOK_URL) {
      registrarLaSolicitudEnElLog(resultado.datos, origen);
      return responder({ ok: true, mensaje: MENSAJE_DE_EXITO }, 200);
    }

    return responder({ ok: false, mensaje: MENSAJE_DE_ERROR_DE_DESTINO }, 502);
  }

  return responder({ ok: true, mensaje: MENSAJE_DE_EXITO }, 200);
}
