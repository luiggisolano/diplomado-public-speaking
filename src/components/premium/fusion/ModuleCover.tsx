/*
  Portada de módulo. Cabecera de imagen a sangre (16:9) con el icono neón oro de cada
  disciplina, en la parte superior de la tarjeta. La entrada la conduce ModuleSlide
  (deslizamiento lateral de la tarjeta completa), así que aquí la imagen es estática y no
  compite con esa animación. Componente sin estado: renderiza solo el marco y la imagen.
*/

type ModuleCoverProps = {
  src: string;
  alt: string;
};

export function ModuleCover({ src, alt }: ModuleCoverProps) {
  return (
    <div className="fus-cover">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="fus-cover-img"
        loading="lazy"
        decoding="async"
        width={1200}
        height={675}
      />
    </div>
  );
}
