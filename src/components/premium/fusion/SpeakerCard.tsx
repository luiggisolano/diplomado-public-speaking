/*
  Tarjeta de especialista de la sección "Quién te forma". Muestra un retrato (foto real
  cuando se provee; si no, un marcador temático con silueta e índice de módulo), el
  nombre, la credencial y la disciplina que imparte. Sin estado: la animación de entrada
  la aporta el envoltorio Reveal desde la página. Diseñada para el sistema oro/negro
  cálido, reutilizando la superficie card-tech.
*/

export type Speaker = {
  module: string;
  discipline: string;
  name: string;
  credential: string;
  photo?: string;
};

export function SpeakerCard({ speaker }: { speaker: Speaker }) {
  return (
    <article className="card-tech flex h-full flex-col">
      <div className="fus-speaker-portrait">
        {speaker.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={speaker.photo}
            alt={speaker.name}
            className="fus-speaker-img"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="fus-speaker-placeholder" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8.2" r="4" stroke="currentColor" strokeWidth="1.1" />
              <path
                d="M4.5 20.5c0-4.1 3.36-7 7.5-7s7.5 2.9 7.5 7"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            </svg>
            <span className="fus-speaker-modnum">{speaker.module}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="tech-label">Módulo {speaker.module}</span>
        <h3 className="mt-4 font-serif text-xl tracking-[-0.01em] text-paper">
          {speaker.name}
        </h3>
        <p className="mt-2 font-mono text-[0.72rem] uppercase leading-relaxed tracking-[0.14em] text-blue-bright">
          {speaker.credential}
        </p>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-mist">
          {speaker.discipline}
        </p>
      </div>
    </article>
  );
}
