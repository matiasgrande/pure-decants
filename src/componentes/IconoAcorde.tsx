import { ilustracionDe } from "@/lib/acordes";
import { rutaPublica } from "@/lib/rutas";

/**
 * El icono de un acorde: la ilustración que el dueño dibujó para él, o la de su
 * familia si no tiene una propia. Decorativo en los dos lugares donde aparece —
 * el nombre del acorde va escrito al lado, así que repetirlo en un `alt` solo
 * se lo diría dos veces a quien usa lector de pantalla.
 *
 * `px` es el lado en píxeles CSS. Manda el `sizes`: hay dos archivos por dibujo
 * y el navegador baja el chico para la casilla del catálogo y el grande para la
 * barra de la ficha, en vez de un solo archivo que sobra en un lado y falta en
 * el otro.
 */
export function IconoAcorde({
  acorde,
  px,
  className = "",
  style,
}: {
  acorde: string;
  px: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const dibujo = ilustracionDe(acorde);
  const grande = rutaPublica(`/aromas/${dibujo}.webp`);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- el export estático
    // no optimiza imágenes, y `next/image` acá solo agregaría un envoltorio.
    <img
      src={grande}
      srcSet={`${rutaPublica(`/aromas/${dibujo}-64.webp`)} 64w, ${grande} 144w`}
      sizes={`${px}px`}
      width={px}
      height={px}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      className={className}
      style={{ width: px, height: px, ...style }}
    />
  );
}
