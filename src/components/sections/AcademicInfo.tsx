"use client";

import { SectionHeading } from "@/components/SectionHeading";
import { CountUp } from "@/components/motion/CountUp";
import { useReveal } from "@/components/motion/useReveal";
import { ACADEMIC_INFO } from "@/lib/content";

/*
  Bloque 8 — Información académica esencial, en el sistema "Aula Futura". Ficha del programa
  como panel de instrumentos: banda de encabezado mono y rejilla de datos en celdas con filete,
  con etiquetas en mono técnica azul y valores en serif. Los valores que abren con una cifra
  pura (horas, créditos, módulos) animan ese número con CountUp y conservan el resto como texto;
  los valores no numéricos quedan como texto plano. Semántica de lista de definiciones (dl/dt/dd)
  para que los lectores de pantalla anuncien cada par etiqueta/valor. Revelado on-scroll por celda.
*/

const LEADING_NUMBER_PATTERN = /^(\d+)(.*)$/;

type LeadingNumber = {
  value: number;
  rest: string;
};

function parseLeadingNumber(rawValue: string): LeadingNumber | null {
  const match = rawValue.match(LEADING_NUMBER_PATTERN);
  if (!match) return null;
  return { value: Number(match[1]), rest: match[2] };
}

function AcademicValue({ rawValue }: { rawValue: string }) {
  const leadingNumber = parseLeadingNumber(rawValue);

  if (!leadingNumber) {
    return <>{rawValue}</>;
  }

  return (
    <>
      <CountUp to={leadingNumber.value} className="text-blue-bright" />
      {leadingNumber.rest}
    </>
  );
}

export default function AcademicInfo() {
  const containerRef = useReveal<HTMLDivElement>({ staggerMs: 55 });

  return (
    <section className="stage-b relative py-[var(--space-section)]">
      <div ref={containerRef} className="mx-auto max-w-5xl px-6">
        <SectionHeading
          eyebrow={ACADEMIC_INFO.eyebrow}
          title={ACADEMIC_INFO.title}
        />

        <div className="mt-12 overflow-hidden rounded-xl border border-line-strong">
          <div className="flex items-center justify-between border-b border-line bg-navy-raised/55 px-7 py-6 sm:px-9">
            <h3 className="font-serif text-lg font-semibold text-paper">
              Detalles del programa
            </h3>
            <span className="tech-label text-[0.6rem]">CEC · UTMACH</span>
          </div>
          <dl className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {ACADEMIC_INFO.rows.map((row) => (
              <div
                key={row.label}
                data-reveal="up"
                className="reveal-init flex flex-col gap-2 bg-navy p-7 sm:p-8"
              >
                <dt className="tech-label text-[0.6rem]">{row.label}</dt>
                <dd className="font-serif text-base font-semibold leading-snug text-paper">
                  <AcademicValue rawValue={row.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
