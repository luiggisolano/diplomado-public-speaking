import CountUp from "./CountUp";
import { PROGRAM_STATS } from "@/lib/constants";

const trustItems = [
  { value: PROGRAM_STATS.hours, suffix: "h", label: "de formación intensiva" },
  { value: PROGRAM_STATS.credits, suffix: "", label: "créditos académicos" },
  { value: PROGRAM_STATS.modules, suffix: "", label: "módulos especializados" },
] as const;

export default function TrustBar() {
  return (
    <section id="aval" className="border-y border-line/50 bg-surface/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-line/50">
          {trustItems.map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center py-8 sm:py-10 px-6 text-center"
            >
              <CountUp
                to={item.value}
                suffix={item.suffix}
                className="text-5xl font-semibold text-gold"
              />
              <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.14em] text-muted">
                {item.label}
              </p>
            </div>
          ))}
        </div>
        <div className="py-5 border-t border-line/50 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted/70">
            Aval institucional: Universidad Técnica de Machala · Centro de Educación Continua · Certificación universitaria
          </p>
        </div>
      </div>
    </section>
  );
}
