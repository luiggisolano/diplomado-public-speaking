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

export const PRIMARY_CTA_HREF = "#inscripcion";
export const PRIMARY_CTA_LABEL = "Asegurar mi cupo";

export const URGENCY_BAR = {
  message: "Inscripciones abiertas hasta fin de junio",
  emphasis: "Cupos limitados por cohorte",
} as const;

export const NAV = {
  brandLead: "Diplomado",
  brandTail: "Public Speaking",
  links: [
    { label: "El momento", href: "#problema" },
    { label: "Módulos", href: "#modulos" },
    { label: "Metodología", href: "#metodologia" },
    { label: "Preguntas", href: "#faq" },
  ],
  cta: PRIMARY_CTA_LABEL,
} as const;

export const FOOTER = {
  brandLead: "UTMACH",
  brandTail: "Centro de Educación Continua",
  description:
    "Formación universitaria interdisciplinaria que eleva la palabra pública de profesionales de la región a la altura de su trabajo.",
  quickLinksTitle: "Recorrido",
  quickLinks: [
    { label: "El momento", href: "#problema" },
    { label: "Los seis módulos", href: "#modulos" },
    { label: "Metodología", href: "#metodologia" },
    { label: "Inscripción", href: "#inscripcion" },
    { label: "Preguntas frecuentes", href: "#faq" },
  ],
  contactTitle: "Contacto directo",
  location: "Campus principal · Machala, El Oro",
  rights: "Universidad Técnica de Machala · Centro de Educación Continua",
} as const;

export const HERO = {
  preTitle: "Diplomado Universitario · 160 horas · Modalidad 100% en línea",
  titleLineOne: "Puedes ser el mejor en lo que haces.",
  titleLineTwo: "Si no sabes comunicarlo,",
  titleAccent: "nadie lo notará.",
  subtitle:
    "Diplomado en Public Speaking y Comunicación Persuasiva de Alto Impacto. Una formación universitaria diseñada para profesionales que entendieron que su voz pública es parte de su trabajo.",
  cta: PRIMARY_CTA_LABEL,
  microcopy:
    "Cupos limitados · Inscripciones abiertas hasta fin de junio · Próxima cohorte: 2027",
  stats: [
    { value: 160, suffix: "h", label: "Horas académicas" },
    { value: 10, suffix: "", label: "Créditos universitarios" },
    { value: 6, suffix: "", label: "Módulos especializados" },
    { value: 100, suffix: "%", label: "En línea" },
  ],
  trust: [
    "Universidad Técnica de Machala",
    "Centro de Educación Continua",
    "Certificación universitaria",
    "10 créditos académicos",
  ],
} as const;

export const PROBLEM_AGITATION = {
  eyebrow: "El momento",
  title: "Hay un momento en la carrera de toda persona profesional",
  intro: "Hay un momento en el que ya no alcanza con saber del tema.",
  scenario:
    "Llega el día en que tienes que defender un proyecto frente a quienes deciden. Responder en una rueda de prensa. Hablar en nombre de una institución. Sostener una idea en un debate público. Convencer a un equipo. Cerrar un negocio que se decide en cinco minutos de exposición.",
  pivot:
    "Y ahí, la diferencia entre saber y comunicar lo que sabes deja de ser un detalle.",
  pivotAccent: "Es lo que define si avanzas o te quedas.",
  painsLead: "Lo que sucede cuando esa habilidad no está entrenada:",
  pains: [
    "Tienes ideas brillantes que en reuniones suenan dubitativas.",
    "Te preparas durante días para presentaciones que olvidan en cuanto entras a la sala.",
    "Sientes que tu voz no proyecta la autoridad que tu trabajo merece.",
    "Las preguntas difíciles te ponen a la defensiva en lugar de al volante.",
    "Tu imagen comunica cosas que tú no decidiste comunicar.",
    "Otros, con menos conocimiento que tú, avanzan más rápido porque sí saben comunicar.",
  ],
  closing: "Comunicar bien no es suficiente. Comunicar con estrategia es liderar.",
} as const;

export const SOLUTION = {
  eyebrow: "La solución",
  title: "Una formación diseñada para que tu palabra esté a la altura de tu trabajo",
  paragraphs: [
    "El Diplomado en Public Speaking y Comunicación Persuasiva de Alto Impacto no es un curso de oratoria.",
    "Es una formación universitaria interdisciplinaria que integra seis campos esenciales del comunicador contemporáneo: psicología, retórica, voz, presencia escénica, imagen y liderazgo aplicado.",
    "Cada módulo está dictado por un especialista en su área. Cada uno entrena una dimensión específica del orador profesional. Y todos confluyen en un objetivo único: que cuando hables, lo que digas pese tanto como lo que sabes.",
  ],
  differentiatorsLead: "Lo que diferencia a este diplomado:",
  differentiators: [
    "Enfoque interdisciplinario real: seis disciplinas, seis especialistas, una sola formación integrada.",
    "Modalidad 100% en línea con sesiones sincrónicas los sábados, asincrónicas complementarias los domingos.",
    "Trabajo práctico desde la primera semana: simulaciones, ejercicios escénicos, construcción progresiva de discurso, análisis de casos.",
    "Proyecto integrador final con aplicación real: cada participante usa la oratoria como herramienta de inserción profesional en su propio campo.",
    "Aval universitario y certificación oficial de la Universidad Técnica de Machala.",
  ],
} as const;

export const MODULES_OVERVIEW = {
  eyebrow: "Los seis módulos",
  title: "Una formación estratégica: seis enfoques, seis especialistas",
  intro:
    "Por qué trabajar solo una dimensión: la voz, la postura, el discurso. Este diplomado entiende que un comunicador profesional se construye desde diferentes dimensiones que operan al mismo tiempo. Entrena cada una con un especialista.",
  mapTitle: "El mapa del comunicador integral",
  map: [
    {
      dimension: "Psicología del orador",
      description: "Quién eres internamente cuando hablas en público",
    },
    {
      dimension: "Retórica y persuasión",
      description: "Cómo construyes ideas que se sostienen y convencen",
    },
    {
      dimension: "Técnica vocal",
      description: "Cómo suenas y qué transmite tu voz antes que tus palabras",
    },
    {
      dimension: "Performance comunicativa",
      description: "Cómo ocupas el espacio escénico con tu cuerpo",
    },
    {
      dimension: "Imagen y semiótica personal",
      description: "Cómo te perciben antes de que digas la primera palabra",
    },
    {
      dimension: "Oratoria aplicada a liderazgo",
      description: "Cómo generas impacto real en contextos de alta exigencia",
    },
  ],
  mapClosing:
    "Cada módulo del diplomado entrena una de esas dimensiones. Y el resultado es la suma: un comunicador que opera con coherencia en todos los planos a la vez.",
} as const;

export const MODULES_DETAIL = {
  title: "Seis módulos. Seis especialistas. Una sola formación.",
  modules: [
    {
      number: "01",
      iconKey: "psicologia",
      area: "Psicología del Orador y Gestión Emocional",
      promise: "Domina lo que tu cuerpo hace cuando se enciende.",
      body: "Entiende qué le pasa a tu sistema nervioso cuando vas a hablar en público. Aprende a regularlo sin pelearte con él. Construye seguridad real, no actuada, desde la base neurocientífica del comportamiento del orador.",
      result: "sostienes cualquier intervención pública sin que el nervio te gane.",
    },
    {
      number: "02",
      iconKey: "retorica",
      area: "Retórica, Persuasión y Arquitectura del Discurso",
      promise: "Construye discursos que se recuerdan.",
      body: "Identifica tu idea fuerza y colócala donde más pesa. Estructura introducciones que enganchan, desarrollos sólidos y cierres memorables. Adapta tu discurso a distintos públicos sin perder lo que quieres decir.",
      result: "pasas de tener buenas ideas a hacer que otros las recuerden y actúen.",
    },
    {
      number: "03",
      iconKey: "voz",
      area: "Técnica Vocal Estratégica y Dominio Expresivo de la Voz",
      promise: "Convierte tu voz en una herramienta profesional.",
      body: "Trabaja respiración, proyección, dicción y modulación con criterio técnico. Aprende a sostener exposiciones prolongadas sin perder presencia. Domina la pausa, el descenso tonal y el silencio como recursos retóricos.",
      result: "tu voz transmite autoridad antes de que tus palabras sean procesadas.",
    },
    {
      number: "04",
      iconKey: "performance",
      area: "Performance Comunicativa: Cuerpo, Presencia y Escena",
      promise: "Habita el escenario como recurso, no como obstáculo.",
      body: "Trabaja postura, gestos, manejo del espacio escénico y conexión con la audiencia. Integra cuerpo, voz y discurso en una sola unidad coherente. Convierte lo que ahora improvisas en recurso disponible cuando más importa.",
      result:
        "dejas de esconderte detrás de tus palabras y empiezas a sostenerlas con todo el cuerpo.",
    },
    {
      number: "05",
      iconKey: "imagen",
      area: "Imagen, Semiótica Personal y Presencia Visual",
      promise: "Controla lo que la gente lee de ti antes de escucharte.",
      body: "Trabaja los códigos visuales que comunican antes que tus palabras: psicología del color, indumentaria estratégica, coherencia entre imagen y discurso. Construye una identidad comunicativa profesional sin disfrazarte.",
      result: "tu imagen empieza a trabajar a favor de tu mensaje, no en su contra.",
    },
    {
      number: "06",
      iconKey: "liderazgo",
      area: "Oratoria Aplicada a Liderazgo y Contextos de Alto Impacto",
      promise: "Pon a prueba todo lo aprendido en escenarios reales.",
      body: "Simulaciones de alta exigencia, manejo de preguntas hostiles, intervenciones en escenarios donde no hay segunda oportunidad. Construcción del proyecto integrador final como herramienta real de inserción profesional.",
      result: "llegas preparado al día en que más importa estar preparado.",
    },
  ],
} as const;

export const AUDIENCE = {
  eyebrow: "Para quién es",
  title: "Si te reconoces en alguno de estos perfiles, este diplomado es para ti",
  profiles: [
    {
      name: "Profesionales y líderes",
      description:
        "Que sienten que su carrera ha llegado a un punto donde la próxima puerta se abre o se cierra dependiendo de cómo comuniquen lo que ya saben hacer.",
    },
    {
      name: "Emprendedores y ejecutivos",
      description:
        "Que necesitan persuadir clientes, inversionistas, equipos o socios estratégicos, y entendieron que improvisar en esos momentos cuesta caro.",
    },
    {
      name: "Figuras públicas en construcción",
      description:
        "Políticos en formación, candidatos, voceros institucionales y líderes de opinión que requieren sostener intervenciones en escenarios de alta exposición.",
    },
    {
      name: "Docentes y académicos",
      description:
        "Que quieren elevar su capacidad comunicativa en aulas, congresos, conferencias y publicaciones, posicionándose con autoridad real en su campo.",
    },
    {
      name: "Profesionales técnicos con vocación de liderazgo",
      description:
        "Ingenieros, médicos, abogados, arquitectos y especialistas que entendieron que ser técnicamente excelente no alcanza si no se comunica con la misma excelencia.",
    },
  ],
} as const;

export const TRANSFORMATION = {
  eyebrow: "La transformación",
  title: "Esto cambia en ti",
  beforeLabel: "Antes del diplomado",
  before: [
    "Te preparas durante horas y sientes que aún así llegas sin dominio real.",
    "Tus ideas suenan más débiles de como las pensaste.",
    "Las preguntas difíciles te desestabilizan.",
    "Tu voz pide permiso cuando debería estar al mando.",
    "Improvisas cada vez que tienes que hablar en público.",
  ],
  afterLabel: "Después del diplomado",
  portraitQuote:
    "El dominio de la palabra abre la puerta que el conocimiento no alcanza.",
  after: [
    "Entras a cualquier sala con seguridad construida, no actuada.",
    "Estructuras discursos que se recuerdan después de que terminas.",
    "Manejas preguntas hostiles desde el control, no desde la defensa.",
    "Tu voz transmite autoridad antes de que las palabras sean procesadas.",
    "Llegas preparado al día en que más importa.",
  ],
  closing: "El comunicador que quieres ser empieza aquí.",
} as const;

export const METHODOLOGY = {
  eyebrow: "Cómo aprenderás",
  title: "Una experiencia formativa diseñada para que apliques lo que aprendes",
  intro: "La metodología del diplomado se construye sobre cuatro pilares prácticos:",
  pillars: [
    {
      number: "1",
      title: "Trabajo aplicado desde la primera sesión",
      body: "No hay teoría desconectada. Cada módulo combina marco conceptual sólido con ejercicios de aplicación inmediata: simulaciones, ejercicios de exposición, trabajo escénico, análisis de casos reales.",
    },
    {
      number: "2",
      title: "Construcción progresiva del discurso personal",
      body: "Desde la segunda semana inicias la construcción de tu discurso estratégico, que se desarrolla y refina a lo largo de todo el diplomado, integrando las capacidades de cada módulo.",
    },
    {
      number: "3",
      title: "Sesiones sincrónicas con interacción real",
      body: "Los sábados se trabaja en vivo con los docentes especialistas. Espacio de práctica, retroalimentación directa y construcción de comunidad profesional con tus pares.",
    },
    {
      number: "4",
      title: "Proyecto integrador final con aplicación real",
      body: "El cierre del diplomado no es una exposición teórica. Es una intervención pública diseñada estratégicamente en tu propio campo profesional. Una herramienta real de inserción y posicionamiento.",
    },
  ],
} as const;

export const ACADEMIC_INFO = {
  eyebrow: "Información académica",
  title: "Lo que necesitas saber para decidir",
  rows: [
    { label: "Duración total", value: "160 horas académicas" },
    { label: "Créditos", value: "10 créditos universitarios" },
    { label: "Módulos", value: "6 módulos especializados" },
    { label: "Modalidad", value: "100% en línea" },
    { label: "Sesiones sincrónicas", value: "Sábados" },
    { label: "Actividades asincrónicas", value: "Domingos" },
    {
      label: "Certificación",
      value: "Universidad Técnica de Machala · Centro de Educación Continua",
    },
    {
      label: "Cupos",
      value: "Limitados (modalidad sincrónica con atención personalizada)",
    },
    {
      label: "Próxima cohorte",
      value: "Inicio julio · Inscripciones abiertas hasta fin de junio",
    },
  ],
} as const;

export const URGENCY = {
  eyebrow: "Urgencia y cierre",
  title: "Por qué inscribirte ahora",
  reasons: [
    {
      title: "Cupos limitados de verdad",
      body: "La modalidad sincrónica con atención personalizada hace que el número de participantes no pueda crecer indefinidamente. Garantizamos calidad de práctica, no volumen de inscritos.",
    },
    {
      title: "La próxima cohorte abre dentro de un año",
      body: "El diseño del diplomado y la coordinación con los seis especialistas hace que abramos una sola cohorte por ciclo. Si esta no es tu fecha, la siguiente oportunidad será dentro de doce meses.",
    },
    {
      title: "Inversión que se recupera con una sola intervención bien hecha",
      body: "Un cierre de negocio. Una entrevista decisiva. Una intervención pública que te posiciona. Una defensa que se gana. Cualquiera de esos momentos paga el diplomado completo.",
    },
  ],
  closing: "Si llegaste hasta aquí, ya sabes si esto es para ti.",
  microcopy: "Inscripciones abiertas hasta fin de junio · Inicio en julio",
  pill: "Inscripciones abiertas",
  closeCardTitle: "Asegura tu lugar en la próxima cohorte",
  closeCtaLabel: "Escribir por WhatsApp",
} as const;

export const FAQ = {
  eyebrow: "Preguntas frecuentes",
  title: "Lo que tal vez te estés preguntando",
  items: [
    {
      question: "¿Necesito experiencia previa hablando en público?",
      answer:
        "No. El diplomado está diseñado para acompañarte desde donde estás. Si nunca hablaste en público, ganas estructura y método. Si ya tienes experiencia, ganas profundidad técnica y refinamiento estratégico.",
    },
    {
      question: "¿Las clases quedan grabadas?",
      answer:
        "Sí. Todas las sesiones sincrónicas quedan disponibles para que puedas revisarlas las veces que necesites durante y después del diplomado.",
    },
    {
      question: "¿Qué pasa si no puedo asistir a una sesión sincrónica?",
      answer:
        "El componente sincrónico es central porque ahí se practica con retroalimentación directa, pero el diplomado contempla flexibilidad: si pierdes una sesión, accedes a la grabación y a actividades asincrónicas equivalentes para mantener el ritmo de aprendizaje.",
    },
    {
      question: "¿La certificación tiene validez oficial?",
      answer:
        "Sí. Es un diplomado universitario avalado por la Universidad Técnica de Machala, a través del Centro de Educación Continua. La certificación tiene valor académico y profesional reconocido.",
    },
    {
      question: "¿Cómo se hace el proyecto final?",
      answer:
        "El proyecto final es una intervención pública diseñada en tu propio campo profesional. Lo construyes a lo largo del diplomado con acompañamiento de los docentes y lo presentas al cierre como herramienta real de aplicación, no como ejercicio académico.",
    },
    {
      question: "¿Cuál es la inversión y hay opciones de pago?",
      answer:
        "Espacio para completar con la información económica oficial del CEC: valor total, opciones de pago, descuentos por pronto pago si aplica.",
      pending: true,
    },
    {
      question: "¿Qué pasa si me inscribo y después no puedo continuar?",
      answer: "Espacio para completar con la política de retiro y reembolso del CEC.",
      pending: true,
    },
  ],
} as const;

export const AUTHOR_SIGNATURE = {
  studioName: "LS",
  craftedLabel: "Crafted by",
  craftedYear: "2026",
  authorNote: "Diseño y desarrollo de autor",
  consoleSignature: "LS — esta pieza la diseñé y construí yo.",
} as const;

export const FINAL_CLOSE = {
  titleLineOne: "Puedes ser el mejor en lo que haces.",
  titleAccent: "Si no sabes comunicarlo, nadie lo notará.",
  microcopy: "Inscripciones abiertas · Cupos limitados · Inicio en julio",
  contactTitle: "Contacto directo",
} as const;
