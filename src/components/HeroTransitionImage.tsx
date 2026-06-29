import Image from "next/image";

export default function HeroTransitionImage() {
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden">
      <Image
        src="/transition-stage.jpg"
        alt="Ponente frente a una audiencia en el auditorio de la UTMACH"
        fill
        className="object-cover object-[center_35%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(10,10,10,0.45)_100%)]" />
    </section>
  );
}
