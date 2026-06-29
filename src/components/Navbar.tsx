"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { List, X } from "@phosphor-icons/react";
import { CTA_LINK } from "@/lib/constants";

const navLinks = [
  { href: "#programa", label: "El Programa" },
  { href: "#modulos", label: "Módulos" },
  { href: "#para-quien", label: "Para Quién" },
  { href: "#metodologia", label: "Metodología" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-line/60"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          <a href="#inicio" className="flex items-center gap-3 shrink-0">
            <Image
              src="/logo-utmach.png"
              alt="Universidad Técnica de Machala"
              width={40}
              height={40}
              className="h-9 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold leading-none">
                UTMACH
              </p>
              <p className="text-[10px] text-muted tracking-[0.06em] leading-none mt-0.5">
                Public Speaking
              </p>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[12px] font-medium text-cream-dim/70 hover:text-cream transition-colors tracking-[0.04em] uppercase"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={CTA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 bg-gold text-black text-[12px] font-semibold uppercase tracking-[0.08em] px-5 py-2.5 rounded-full hover:-translate-y-px transition-transform duration-150 shadow-[0_2px_16px_rgba(201,168,92,0.3)]"
            >
              Inscribirme
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 text-cream-dim"
              aria-label="Menú"
            >
              {open ? <X size={22} /> : <List size={22} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-ink/95 backdrop-blur-md border-t border-line/60 px-4 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-[13px] font-medium text-cream-dim py-2 border-b border-line/40 last:border-0 uppercase tracking-[0.06em]"
            >
              {link.label}
            </a>
          ))}
          <a
            href={CTA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center justify-center bg-gold text-black text-[13px] font-semibold uppercase tracking-[0.08em] px-6 py-3 rounded-full"
          >
            Inscribirme ahora
          </a>
        </div>
      )}
    </header>
  );
}
