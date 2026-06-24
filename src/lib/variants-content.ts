/*
  Copy CONDENSADO compartido por las tres landings experimentales (v/voz, v/escenario,
  v/palabra). Deriva de src/lib/content.ts pero recortado a lo esencial: el brief de
  /orquesta pide reducir texto (la versión v1 estaba saturada). Cada variante consume
  estos bloques con su propia capa de presentación e interacción; el copy es la única
  fuente de verdad para que las tres se mantengan coherentes con el diplomado real.
*/

export const SHARED_CONTACT = {
  whatsapp: "+593 982 932 139",
  whatsappLink: "https://wa.me/593982932139?text=Quiero%20info%20del%20Diplomado%20en%20Public%20Speaking",
  email: "educacion_continua@utmachala.edu.ec",
  institution: "Centro de Educación Continua · UTMACH",
} as const;

export const SHARED_CTA = {
  primary: "Asegurar mi cupo",
  whatsapp: "Escribir por WhatsApp",
  href: "#inscripcion",
} as const;

export const SHARED_HERO = {
  kicker: "Diplomado Universitario · 160 h · 100% en línea",
  line1: "Eres el mejor en lo que haces.",
  line2: "Si no sabes comunicarlo,",
  accent: "nadie lo nota.",
  sub: "Formación universitaria de oratoria y comunicación persuasiva para profesionales que entendieron que su voz pública es parte de su trabajo.",
  microcopy: "Cupos limitados · Inscripciones abiertas hasta fin de junio",
} as const;

export const SHARED_STATS = [
  { value: 160, suffix: "h", label: "Horas académicas" },
  { value: 10, suffix: "", label: "Créditos" },
  { value: 6, suffix: "", label: "Módulos" },
  { value: 100, suffix: "%", label: "En línea" },
] as const;

export const SHARED_PROMISE = {
  eyebrow: "La idea",
  headline: "Que tu palabra pese tanto como lo que sabes.",
  body: "No es un curso de oratoria. Seis disciplinas —psicología, retórica, voz, escena, imagen y liderazgo— integradas en una sola formación, cada una con su especialista.",
} as const;

export const SHARED_MODULES = [
  { n: "01", key: "psicologia", title: "Psicología del orador", line: "Domina lo que tu cuerpo hace cuando se enciende." },
  { n: "02", key: "retorica", title: "Retórica y persuasión", line: "Construye discursos que se recuerdan." },
  { n: "03", key: "voz", title: "Técnica vocal", line: "Convierte tu voz en una herramienta profesional." },
  { n: "04", key: "performance", title: "Performance y escena", line: "Habita el escenario como recurso, no como obstáculo." },
  { n: "05", key: "imagen", title: "Imagen y semiótica", line: "Controla lo que leen de ti antes de escucharte." },
  { n: "06", key: "liderazgo", title: "Oratoria de liderazgo", line: "Pruébalo todo en escenarios reales de alto impacto." },
] as const;

export const SHARED_AUDIENCE = {
  eyebrow: "Para quién es",
  headline: "Si lo tuyo se decide cuando abres la boca, es para ti.",
  profiles: [
    "Profesionales y líderes",
    "Emprendedores y ejecutivos",
    "Voceros y figuras públicas",
    "Docentes y académicos",
    "Técnicos con vocación de liderazgo",
  ],
} as const;

export const SHARED_TRANSFORMATION = {
  eyebrow: "La transformación",
  headline: "Esto cambia en ti.",
  before: [
    "Tus ideas suenan más débiles de como las pensaste.",
    "Las preguntas difíciles te desestabilizan.",
    "Improvisas cada vez que hablas en público.",
  ],
  after: [
    "Entras a cualquier sala con seguridad construida, no actuada.",
    "Manejas preguntas hostiles desde el control.",
    "Tu voz transmite autoridad antes de que te procesen.",
  ],
  quote: "El dominio de la palabra abre la puerta que el conocimiento no alcanza.",
} as const;

export const SHARED_METHOD = {
  eyebrow: "Cómo aprenderás",
  headline: "Aplicas desde la primera sesión.",
  pillars: [
    { t: "Trabajo aplicado", d: "Cada módulo combina marco sólido y ejercicios de aplicación inmediata." },
    { t: "Discurso progresivo", d: "Construyes tu discurso estratégico a lo largo de todo el diplomado." },
    { t: "Sincrónico real", d: "Sábados en vivo con los especialistas: práctica y retroalimentación directa." },
    { t: "Proyecto integrador", d: "Cierras con una intervención pública real en tu propio campo." },
  ],
} as const;

export const SHARED_FACTS = [
  { label: "Duración", value: "160 horas" },
  { label: "Créditos", value: "10 universitarios" },
  { label: "Modalidad", value: "100% en línea" },
  { label: "Sincrónico", value: "Sábados" },
  { label: "Certifica", value: "UTMACH · CEC" },
  { label: "Cohorte", value: "Inicio julio" },
] as const;

export const SHARED_URGENCY = {
  eyebrow: "Por qué ahora",
  headline: "Una cohorte por ciclo. La siguiente, en doce meses.",
  reasons: [
    { t: "Cupos reales", d: "Modalidad sincrónica con atención personalizada: calidad de práctica, no volumen." },
    { t: "Una sola cohorte", d: "Coordinar seis especialistas nos permite abrir un grupo por ciclo." },
    { t: "Se paga solo", d: "Un cierre, una entrevista, una defensa bien hecha cubre el diplomado completo." },
  ],
} as const;

export const SHARED_FAQ = [
  { q: "¿Necesito experiencia previa?", a: "No. Si nunca hablaste en público ganas estructura y método; si ya tienes experiencia, ganas profundidad técnica." },
  { q: "¿Las clases quedan grabadas?", a: "Sí. Todas las sesiones sincrónicas quedan disponibles para revisarlas cuando lo necesites." },
  { q: "¿La certificación tiene validez oficial?", a: "Sí. Diplomado universitario avalado por la UTMACH a través del Centro de Educación Continua." },
  { q: "¿Cómo es el proyecto final?", a: "Una intervención pública diseñada en tu propio campo profesional, no un ejercicio académico." },
] as const;

export const SHARED_CLOSE = {
  headline: "Si llegaste hasta aquí, ya sabes si esto es para ti.",
  microcopy: "Inscripciones abiertas · Cupos limitados · Inicio en julio",
} as const;

export const SHARED_AUTHOR = {
  studio: "LS",
  label: "Crafted by",
  year: "2026",
  note: "Diseño y desarrollo de autor",
  console: "LS — esta pieza la diseñé y construí yo.",
} as const;
