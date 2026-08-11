/*
  Copy de la landing definitiva, transcrito del documento oficial del Centro de Educación
  Continua «Landing Page — Diplomado Public Speaking UTMACH».

  Vive aparte de lib/variants-content.ts y no lo sustituye: aquel es la fuente que comparten
  las rutas de exploración /g/camara, /g/fusion, /g/sonica y /g/reflector, y reescribirlo
  cambiaría el contenido de las cuatro. Podio ya es autónomo en presentación —tokens y clases
  propias en podio.css— y con esto lo es también en contenido.

  Lo que el documento deja abierto se marca como pendiente en lugar de rellenarse: la
  inversión y la política de retiro son datos que fija el CEC, y una landing que los invente
  compromete a la universidad con cifras que nadie aprobó.

  Solo alimenta de la barra de cifras hacia abajo. La secuencia de apertura tiene su copy en
  PodioEscena, atado al recorrido de la cámara, y no se toca desde aquí.
*/

export const PODIO_AVAL = {
  rotulo: "Aval institucional",
  sellos: [
    "Universidad Técnica de Machala",
    "Centro de Educación Continua",
    "Certificación universitaria",
    "10 créditos académicos",
  ],
} as const;

export const PODIO_CIFRAS = [
  { valor: 160, sufijo: "h", etiqueta: "Horas académicas" },
  { valor: 10, sufijo: "", etiqueta: "Créditos" },
  { valor: 6, sufijo: "", etiqueta: "Módulos" },
  { valor: 100, sufijo: "%", etiqueta: "En línea" },
] as const;

export const PODIO_AGITACION = {
  eyebrow: "El punto de inflexión",
  titulo: "Hay un momento en la carrera de toda persona profesional",
  entrada: "Hay un momento en el que ya no alcanza con saber del tema.",
  cuerpo:
    "Llega el día en que tienes que defender un proyecto frente a quienes deciden. Responder en una rueda de prensa. Levantar la mano en un salón para opinar. Hablar en nombre de una institución. Sostener una idea en un debate público. Convencer a un equipo. Cerrar un negocio que se decide en cinco minutos de exposición.",
  giro: "Y ahí, la diferencia entre saber y comunicar lo que sabes deja de ser un detalle.",
  /*
    Fragmento que el cliente pidió resaltar en el oro de la landing dentro del giro. Vive
    aquí y no como marcado en el componente porque LineaPodio parte la frase con SplitText
    para animarla: el texto tiene que seguir llegando como cadena, y el realce se compone
    partiendo esa misma cadena por este fragmento. Si se edita «giro», este literal debe
    seguir apareciendo en él o el realce deja de aplicarse sin romper nada.
  */
  giroAcento: "saber y comunicar",
  sentencia: "Es lo que define si avanzas o te quedas.",
  rotuloSintomas: "Lo que sucede cuando esa habilidad no está entrenada",
  sintomas: [
    "Tienes ideas brillantes que en reuniones suenan dubitativas.",
    "Te preparas durante días para presentaciones que olvidas en cuanto entras a la sala.",
    "Sientes que tu voz no proyecta la autoridad que tu trabajo merece.",
    "Las preguntas difíciles te ponen a la defensiva en lugar de al volante.",
    "Tu imagen comunica cosas que tú no decidiste comunicar.",
    "Otros, con menos conocimiento que tú, avanzan más rápido porque sí saben comunicar.",
  ],
  remate: "Comunicar bien no es suficiente. Comunicar con estrategia es liderar.",
} as const;

export const PODIO_SOLUCION = {
  eyebrow: "La formación",
  titulo: "Una formación diseñada para que tu palabra esté a la altura de tu trabajo",
  cuerpo: [
    "El Diplomado en Public Speaking y Comunicación Persuasiva de Alto Impacto no es un curso de oratoria.",
    "Es una formación universitaria interdisciplinaria que integra seis campos esenciales del comunicador contemporáneo: psicología, retórica, voz, presencia escénica, imagen y liderazgo aplicado.",
    "Cada módulo está dictado por un especialista en su área. Cada uno entrena una dimensión específica del orador profesional. Y todos confluyen en un objetivo único: que cuando hables, lo que digas pese tanto como lo que sabes.",
  ],
  rotuloDiferencia: "Lo que diferencia a este diplomado",
  diferenciales: [
    {
      titulo: "Enfoque interdisciplinario real",
      linea: "Seis disciplinas, seis especialistas, una sola formación integrada.",
    },
    {
      titulo: "Modalidad 100 % en línea",
      linea: "Sesiones sincrónicas los sábados, asincrónicas complementarias los domingos.",
    },
    {
      titulo: "Trabajo práctico desde la primera semana",
      linea: "Simulaciones, ejercicios escénicos, construcción progresiva de discurso, análisis de casos.",
    },
    {
      titulo: "Proyecto integrador final con aplicación real",
      linea: "Cada participante usa la oratoria como herramienta de inserción profesional en su propio campo.",
    },
    {
      titulo: "Aval universitario",
      linea: "Certificación oficial de la Universidad Técnica de Machala.",
    },
  ],
} as const;

export const PODIO_MAPA = {
  eyebrow: "Seis enfoques, seis especialistas",
  titulo: "Una formación estratégica",
  entrada:
    "Por qué trabajar solo una dimensión: la voz, la postura, el discurso. Este diplomado entiende que un comunicador profesional se construye desde diferentes dimensiones que operan al mismo tiempo. Entrena cada una con un especialista.",
  rotulo: "El mapa del comunicador integral",
  dimensiones: [
    {
      titulo: "Psicología del orador",
      linea: "Quién eres internamente cuando hablas en público",
    },
    {
      titulo: "Retórica y persuasión",
      linea: "Cómo construyes ideas que se sostienen y convencen",
    },
    {
      titulo: "Técnica vocal",
      linea: "Cómo suenas y qué transmite tu voz antes que tus palabras",
    },
    {
      titulo: "Performance comunicativa",
      linea: "Cómo ocupas el espacio escénico con tu cuerpo",
    },
    {
      titulo: "Imagen y semiótica personal",
      linea: "Cómo te perciben antes de que digas la primera palabra",
    },
    {
      titulo: "Oratoria aplicada a liderazgo",
      linea: "Cómo generas impacto real en contextos de alta exigencia",
    },
  ],
  remate:
    "Cada módulo del diplomado entrena una de esas dimensiones. Y el resultado es la suma: un comunicador que opera con coherencia en todos los planos a la vez.",
} as const;

export const PODIO_MODULOS = {
  eyebrow: "El programa",
  titulo: "Seis módulos. Seis especialistas. Una sola formación.",
  modulos: [
    {
      n: "01",
      titulo: "Psicología del Orador y Gestión Emocional",
      promesa: "Domina lo que tu cuerpo hace cuando se enciende.",
      cuerpo:
        "Entiende qué le pasa a tu sistema nervioso cuando vas a hablar en público. Aprende a regularlo sin pelearte con él. Construye seguridad real desde la base neurocientífica del comportamiento del orador.",
      /*
        Único resultado de los seis en imperativo. El documento de observaciones lo entrega
        con la etiqueta «Resultado:» delante, que es la misma convención con la que el
        documento original de copy rotula este campo en los seis módulos, así que sustituye
        al resultado y no a la promesa pese a compartir forma verbal con ella.
      */
      resultado: "Domina el miedo escénico y construye seguridad real.",
    },
    {
      n: "02",
      titulo: "Retórica, Persuasión y Arquitectura del Discurso",
      promesa: "Construye discursos que se recuerdan.",
      cuerpo:
        "Identifica tu idea fuerza y colócala donde más pesa. Estructura introducciones que enganchan, desarrollos sólidos y cierres memorables. Adapta tu discurso a distintos públicos sin perder lo que quieres decir.",
      resultado: "Pasas de tener buenas ideas a hacer que otros las recuerden y actúen.",
    },
    {
      n: "03",
      titulo: "Técnica Vocal Estratégica y Dominio Expresivo de la Voz",
      promesa: "Convierte tu voz en una herramienta profesional.",
      cuerpo:
        "Trabaja respiración, proyección, dicción y modulación con criterio técnico. Aprende a sostener exposiciones prolongadas sin perder presencia. Domina la pausa, el descenso tonal y el silencio como recursos retóricos.",
      resultado: "Tu voz transmite autoridad antes de que tus palabras sean procesadas.",
    },
    {
      n: "04",
      titulo: "Performance Comunicativa: Cuerpo, Presencia y Escena",
      promesa: "Habita el escenario como un recurso de tu intervención",
      cuerpo:
        "Trabaja postura, gestos, manejo del espacio escénico y conexión con la audiencia. Integra cuerpo, voz y discurso en una sola unidad coherente. Convierte lo que ahora improvisas en recurso disponible cuando más importa.",
      resultado:
        "Dejas de esconderte detrás de tus palabras y empiezas a sostenerlas con todo el cuerpo.",
    },
    {
      n: "05",
      titulo: "Imagen, Semiótica Personal y Presencia Visual",
      promesa: "Controla lo que la gente lee de ti antes de escucharte.",
      cuerpo:
        "Trabaja los códigos visuales que comunican antes que tus palabras: psicología del color, indumentaria estratégica, coherencia entre imagen y discurso. Construye una identidad comunicativa profesional sin disfrazarte.",
      resultado: "Tu imagen empieza a trabajar a favor de tu mensaje, no en su contra.",
    },
    {
      n: "06",
      titulo: "Oratoria Aplicada a Liderazgo y Contextos de Alto Impacto",
      promesa: "Convierte tu identidad comunicativa en una herramienta real de liderazgo.",
      cuerpo:
        "Fortalece tu voz y tu capacidad de influencia mediante el análisis de casos, la comunicación en escenarios de alta exposición y la ejecución estratégica del discurso. Integra todo lo aprendido en ejercicios prácticos y en un proyecto final aplicable a tu entorno profesional.",
      resultado: "Comunicas con identidad, liderazgo y solvencia",
    },
  ],
} as const;

export const PODIO_PUBLICO = {
  eyebrow: "Para quién es",
  titulo: "Si te reconoces en alguno de estos perfiles, este diplomado es para ti",
  perfiles: [
    {
      titulo: "Profesionales con vocación de liderazgo",
      linea:
        "Que sienten que su carrera ha llegado a un punto donde la próxima oportunidad depende de cómo comunican lo que saben, representan sus ideas y asumen nuevos desafíos.",
    },
    {
      titulo: "Creadores de contenido",
      linea:
        "Que comunican frente a una cámara, representan marcas o construyen comunidades digitales, y necesitan conectar con autenticidad, seguridad y propósito.",
    },
    {
      titulo: "Emprendedores y ejecutivos",
      linea:
        "Que necesitan persuadir a clientes, inversionistas, equipos o aliados estratégicos, conscientes de que improvisar en momentos decisivos puede resultar costoso.",
    },
    {
      titulo: "Figuras públicas en construcción",
      linea:
        "Políticos en formación, candidatos, voceros institucionales o líderes de opinión que necesitan sostener intervenciones claras en escenarios de alta exposición.",
    },
    {
      titulo: "Docentes y académicos",
      linea:
        "Que buscan elevar su capacidad comunicativa en aulas, congresos, conferencias o publicaciones, proyectando mayor claridad y autoridad en su campo.",
    },
  ],
} as const;

export const PODIO_TRANSFORMACION = {
  eyebrow: "La transformación",
  titulo: "Esto cambia en ti",
  antes: {
    rotulo: "Antes del diplomado",
    puntos: [
      "Te preparas durante horas y sientes que aún así llegas sin dominio real.",
      "Tus ideas suenan más débiles de como las pensaste.",
      "Las preguntas difíciles te desestabilizan.",
      "Tu voz pide permiso cuando debería estar al mando.",
      "Improvisas cada vez que tienes que hablar en público.",
    ],
  },
  despues: {
    rotulo: "Después del diplomado",
    puntos: [
      "Entras a cualquier sala con seguridad construida.",
      "Estructuras discursos que se recuerdan después de que terminas.",
      "Manejas preguntas hostiles desde el control, no desde la defensa.",
      "Tu voz transmite autoridad antes de que las palabras sean procesadas.",
      "Llegas preparado al día en que más importa.",
    ],
  },
  remate: "El comunicador que quieres ser empieza aquí.",
} as const;

export const PODIO_METODO = {
  eyebrow: "Cómo aprenderás",
  titulo: "Una experiencia formativa diseñada para que apliques lo que aprendes",
  entrada: "La metodología del diplomado se construye sobre cuatro pilares prácticos.",
  pilares: [
    {
      titulo: "Trabajo aplicado desde la primera sesión",
      linea:
        "No hay teoría desconectada. Cada módulo combina marco conceptual sólido con ejercicios de aplicación inmediata: simulaciones, ejercicios de exposición, trabajo escénico, análisis de casos reales.",
    },
    {
      titulo: "Construcción progresiva del discurso personal",
      linea:
        "Desde la segunda semana inicias la construcción de tu discurso estratégico, que se desarrolla y refina a lo largo de todo el diplomado, integrando las capacidades de cada módulo.",
    },
    {
      titulo: "Sesiones sincrónicas con interacción real",
      linea:
        "Los sábados se trabaja en vivo con los docentes especialistas. Espacio de práctica, retroalimentación directa y construcción de comunidad profesional con tus pares.",
    },
    {
      titulo: "Proyecto integrador final con aplicación real",
      linea:
        "El cierre del diplomado no es una exposición teórica. Es una intervención pública diseñada estratégicamente en tu propio campo profesional. Una herramienta real de inserción y posicionamiento.",
    },
  ],
} as const;

export const PODIO_FICHA = {
  eyebrow: "La ficha",
  titulo: "Lo que necesitas saber para decidir",
  datos: [
    { etiqueta: "Duración total", valor: "160 horas académicas" },
    { etiqueta: "Créditos", valor: "10 créditos universitarios" },
    { etiqueta: "Módulos", valor: "6 módulos especializados" },
    { etiqueta: "Modalidad", valor: "100 % en línea" },
    { etiqueta: "Sesiones sincrónicas", valor: "Sábados" },
    { etiqueta: "Actividades asincrónicas", valor: "Domingos" },
    {
      etiqueta: "Certificación",
      valor: "Universidad Técnica de Machala · Centro de Educación Continua",
    },
    {
      etiqueta: "Cupos",
      valor: "Limitados (modalidad sincrónica con atención personalizada)",
    },
  ],
} as const;

export const PODIO_URGENCIA = {
  eyebrow: "Por qué ahora",
  titulo: "Por qué inscribirte ahora",
  razones: [
    {
      titulo: "Cupos limitados de verdad",
      linea:
        "La modalidad sincrónica con atención personalizada hace que el número de participantes no pueda crecer indefinidamente. Garantizamos calidad de práctica, no volumen de inscritos.",
    },
    {
      titulo: "La próxima cohorte abre dentro de un año",
      linea:
        "El diseño del diplomado y la coordinación con los seis especialistas hace que abramos una sola cohorte por ciclo. Si esta no es tu fecha, la siguiente oportunidad será dentro de doce meses.",
    },
    {
      titulo: "Inversión que se recupera con una sola intervención bien hecha",
      linea:
        "Un cierre de negocio. Una entrevista decisiva. Una intervención pública que te posiciona. Una defensa que se gana. Cualquiera de esos momentos paga el diplomado completo.",
    },
  ],
  /*
    Esta escena cierra en el remate y no lleva letra pequeña debajo. La fecha límite que
    vivía aquí se retiró por pedido del cliente; la del cierre de página es otra frase y
    se mantiene, porque anuncia cupos y no una fecha de corte.
  */
  remate: "Si llegaste hasta aquí, ya sabes si esto es para ti.",
} as const;

/*
  Las dos últimas respuestas quedan pendientes por decisión, no por olvido: el documento las
  entrega como espacios a completar con la información oficial del CEC. Se publican con la
  marca «pendiente» para que se vean en la página y nadie las dé por resueltas, y para que
  quien las complete sepa exactamente dónde van.
*/
export const PODIO_PREGUNTAS = {
  eyebrow: "Preguntas frecuentes",
  titulo: "Lo que tal vez te estés preguntando",
  preguntas: [
    {
      q: "¿Necesito experiencia previa hablando en público?",
      a: "No. El diplomado está diseñado para acompañarte desde donde estás. Si nunca hablaste en público, ganas estructura y método. Si ya tienes experiencia, ganas profundidad técnica y refinamiento estratégico.",
    },
    {
      q: "¿Las clases quedan grabadas?",
      a: "Sí. Todas las sesiones sincrónicas quedan disponibles para que puedas revisarlas las veces que necesites durante y después del diplomado.",
    },
    {
      q: "¿Qué pasa si no puedo asistir a una sesión sincrónica?",
      a: "El componente sincrónico es central porque ahí se practica con retroalimentación directa, pero el diplomado contempla flexibilidad: si pierdes una sesión, accedes a la grabación y a actividades asincrónicas equivalentes para mantener el ritmo de aprendizaje.",
    },
    {
      q: "¿La certificación tiene validez oficial?",
      a: "Sí. Es un diplomado universitario avalado por la Universidad Técnica de Machala, a través del Centro de Educación Continua. La certificación tiene valor académico y profesional reconocido.",
    },
    {
      q: "¿Cómo se hace el proyecto final?",
      a: "El proyecto final es una intervención pública diseñada en tu propio campo profesional. Lo construyes a lo largo del diplomado con acompañamiento de los docentes y lo presentas al cierre como herramienta real de aplicación, no como ejercicio académico.",
    },
    {
      q: "¿Cuál es la inversión y hay opciones de pago?",
      a: "Escríbenos por WhatsApp y te enviamos el detalle actualizado de valor, formas de pago y descuentos vigentes.",
      pendiente: "Falta el valor oficial del CEC, opciones de pago y descuento por pronto pago.",
    },
    {
      q: "¿Qué pasa si me inscribo y después no puedo continuar?",
      a: "Escríbenos por WhatsApp y te detallamos las condiciones vigentes antes de que te inscribas.",
      pendiente: "Falta la política de retiro y reembolso del CEC.",
    },
  ],
} as const;

export const PODIO_CIERRE = {
  lineas: ["Puedes ser el mejor en lo que haces.", "Si no sabes comunicarlo, nadie lo notará."],
  cta: "Asegurar mi cupo",
  microcopy: "Inscripciones abiertas · Cupos limitados · Inicio en julio",
  rotuloContacto: "Contacto directo",
  firma: "Centro de Educación Continua · Universidad Técnica de Machala",
} as const;
