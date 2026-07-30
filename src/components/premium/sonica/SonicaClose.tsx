/*
  Escena de cierre e inscripción (ancla #inscripcion, destino del CTA del hero). Última
  afirmación a pantalla completa sobre el fondo vivo, doble vía de contacto (WhatsApp y
  correo) y el bloque institucional. Server Component: los enlaces son nativos, no
  requieren JS. La acción vive en el azul eléctrico institucional.
*/

import { SHARED_CLOSE, SHARED_CTA, SHARED_CONTACT } from "@/lib/variants-content";

export function SonicaClose() {
  return (
    <section
      id="inscripcion"
      className="son-section son-section--immersive son-close"
      aria-labelledby="son-close-heading"
    >
      <div className="son-close__scrim" aria-hidden="true" />
      <div className="son-wrap son-close__inner">
        <p className="son-label" data-son-reveal>
          Inscripción · Cohorte julio
        </p>
        <h2 id="son-close-heading" className="son-h son-h--xl son-close__heading" data-son-reveal>
          {SHARED_CLOSE.headline}
        </h2>

        <div className="son-close__actions" data-son-reveal>
          <a
            href={SHARED_CONTACT.whatsappLink}
            className="son-btn son-btn--primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
              <path
                d="M20.5 11.5a8.5 8.5 0 0 1-12.4 7.5L3.5 20l1-4.5A8.5 8.5 0 1 1 20.5 11.5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 9.5c0 3 2.5 5.5 5.5 5.5.6 0 1-.5 1-1l-.2-1.2-1.6-.5-.8.8c-1-.4-1.8-1.2-2.2-2.2l.8-.8-.5-1.6L9.9 8.5c-.5 0-.9.4-.9 1Z"
                fill="currentColor"
              />
            </svg>
            <span>{SHARED_CTA.primary}</span>
          </a>
          <a href={`mailto:${SHARED_CONTACT.email}`} className="son-btn son-btn--ghost">
            <span>Escribir por correo</span>
          </a>
        </div>

        <p className="son-close__micro son-label" data-son-reveal>
          {SHARED_CLOSE.microcopy}
        </p>

        <div className="son-close__contact" data-son-reveal>
          <a href={SHARED_CONTACT.whatsappLink} className="son-close__link" target="_blank" rel="noopener noreferrer">
            {SHARED_CONTACT.whatsapp}
          </a>
          <span className="son-close__sep" aria-hidden="true" />
          <a href={`mailto:${SHARED_CONTACT.email}`} className="son-close__link">
            {SHARED_CONTACT.email}
          </a>
          <span className="son-close__sep" aria-hidden="true" />
          <span className="son-close__inst">{SHARED_CONTACT.institution}</span>
        </div>
      </div>
    </section>
  );
}
