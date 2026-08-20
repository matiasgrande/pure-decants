import Image from "next/image";
import { rutaPublica } from "@/lib/rutas";

/**
 * El frasco real del negocio, recortado de la foto de producto del dueño.
 *
 * Los dos archivos salieron del mismo original con la misma escala, así que sus
 * dimensiones ya cargan la proporción verdadera: el 5 ml mide el 79% del 10 ml.
 * Si se les da la misma altura en CSS, la comparación deja de ser cierta.
 */
const FRASCOS = {
  5: { archivo: "/decants/dorado-5ml.webp", ancho: 99, alto: 444 },
  10: { archivo: "/decants/dorado-10ml.webp", ancho: 115, alto: 560 },
} as const;

export function Decant({
  ml = 10,
  className = "",
  prioridad = false,
  style,
}: {
  ml?: 5 | 10;
  className?: string;
  prioridad?: boolean;
  style?: React.CSSProperties;
}) {
  const frasco = FRASCOS[ml];

  return (
    <Image
      src={rutaPublica(frasco.archivo)}
      alt=""
      aria-hidden
      width={frasco.ancho}
      height={frasco.alto}
      className={className}
      style={style}
      priority={prioridad}
    />
  );
}
