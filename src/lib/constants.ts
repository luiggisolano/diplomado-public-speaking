export const INSCRIPTION_DEADLINE = new Date("2026-08-15T23:59:59-05:00");

export const PROGRAM_STATS = {
  hours: 160,
  credits: 10,
  modules: 6,
} as const;

export const CONTACT = {
  whatsapp: "+593 982 932 139",
  whatsappLink: "https://wa.me/593982932139",
  email: "educacion_continua@utmachala.edu.ec",
  institution: "Centro de Educación Continua · Universidad Técnica de Machala",
} as const;

export const CTA_LINK = CONTACT.whatsappLink;

export const SEO = {
  title: "Diplomado en Public Speaking y Comunicación Persuasiva | UTMACH",
  description:
    "Formación universitaria interdisciplinaria en oratoria, retórica, voz, presencia escénica e imagen profesional. Aval UTMACH. Modalidad en línea. Inscripciones abiertas.",
} as const;
