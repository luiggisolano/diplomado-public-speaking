/*
  Code.gs — Web App receptora de inscripciones del Diplomado Public Speaking.

  Vive fuera del proyecto Next.js porque no lo ejecuta Vercel: se pega tal cual en el editor
  de Apps Script (script.google.com) que cuelga de la hoja de cálculo de destino, y de ahí se
  publica como aplicación web. No participa del build ni del despliegue de la landing; es la
  otra mitad del contrato, la que vive del lado de Google.

  Contrato con src/app/api/inscripcion/route.ts: recibe un POST con cuerpo JSON
  { nombre, correo, telefono, consentimiento, origen, recibidoEn } y añade una fila. No valida
  ni rechaza nada porque la validación real ya ocurrió en el servidor de Vercel antes de
  reenviar aquí; este script solo escribe lo que le llega.
*/

const NOMBRE_DE_LA_HOJA = "Inscripciones";

const ENCABEZADOS = [
  "Recibido en",
  "Nombre",
  "Correo",
  "Teléfono",
  "Consentimiento",
  "Origen",
];

function obtenerOCrearLaHoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName(NOMBRE_DE_LA_HOJA);

  if (!hoja) {
    hoja = libro.insertSheet(NOMBRE_DE_LA_HOJA);
  }

  if (hoja.getLastRow() === 0) {
    hoja.appendRow(ENCABEZADOS);
    hoja.setFrozenRows(1);
  }

  return hoja;
}

function doPost(peticion) {
  try {
    const cuerpo = JSON.parse(peticion.postData.contents);
    const hoja = obtenerOCrearLaHoja();

    hoja.appendRow([
      cuerpo.recibidoEn || new Date().toISOString(),
      cuerpo.nombre || "",
      cuerpo.correo || "",
      cuerpo.telefono || "",
      cuerpo.consentimiento === true ? "Sí" : "No",
      cuerpo.origen || "",
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true }),
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (fallo) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, mensaje: String(fallo) }),
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
