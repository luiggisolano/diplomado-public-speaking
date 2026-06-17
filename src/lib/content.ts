/*
  Fuente única de contenido del landing. Tipado para que cada bloque se consuma
  desde sus componentes sin texto hardcodeado en el JSX. Escalable: las fases
  siguientes agregan sus secciones aquí sin tocar la capa de presentación.
*/

export const SITE_META = {
  title: "Diplomado en Public Speaking y Comunicación Persuasiva | UTMACH",
  description:
    "Formación universitaria interdisciplinaria en oratoria, retórica, voz, presencia escénica e imagen profesional. Aval UTMACH. Modalidad en línea. Inscripciones abiertas.",
  url: "https://utmachala.edu.ec/diplomado-public-speaking",
} as const;

export const CONTACT = {
  whatsapp: "+593 982 932 139",
  whatsappLink: "https://wa.me/593982932139",
  email: "educacion_continua@utmachala.edu.ec",
  institution: "Centro de Educación Continua · Universidad Técnica de Machala",
} as const;

export const HERO = {
  preTitle: "Diplomado Universitario · 160 horas · Modalidad 100% en línea",
  titleLineOne: "Puedes ser el mejor en lo que haces.",
  titleLineTwo: "Si no sabes comunicarlo,",
  titleAccent: "nadie lo notará.",
  subtitle:
    "Diplomado en Public Speaking y Comunicación Persuasiva de Alto Impacto. Una formación universitaria diseñada para profesionales que entendieron que su voz pública es parte de su trabajo.",
  cta: "Asegurar mi cupo",
  microcopy:
    "Cupos limitados · Inscripciones abiertas hasta fin de junio · Próxima cohorte: 2027",
  trust: [
    "Universidad Técnica de Machala",
    "Centro de Educación Continua",
    "Certificación universitaria",
    "10 créditos académicos",
  ],
} as const;
