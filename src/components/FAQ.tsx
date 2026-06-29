"use client";

import { useState } from "react";
import { Plus, Minus } from "@phosphor-icons/react";
import { faqs } from "@/data/content";
import RevealOnScroll from "./RevealOnScroll";

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-line/50 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-cream font-medium text-[15px] leading-snug">{question}</span>
        <span className="shrink-0 mt-0.5 text-gold/60">
          {open ? <Minus size={18} /> : <Plus size={18} />}
        </span>
      </button>
      {open && (
        <div className="pb-5 pr-8">
          <p className="text-cream-dim/70 text-[14px] leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="section-padding bg-ink">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="max-w-2xl mb-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold/70 mb-4">
            Preguntas frecuentes
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-cream leading-[1.05]">
            Lo que tal vez te estés preguntando
          </h2>
        </RevealOnScroll>

        <RevealOnScroll className="max-w-3xl">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
