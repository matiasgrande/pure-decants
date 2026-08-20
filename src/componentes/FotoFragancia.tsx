import Image from "next/image";
import { Topografia } from "@/componentes/Topografia";
import { Decant } from "@/componentes/Decant";
import { rutaPublica } from "@/lib/rutas";
import type { Fragancia } from "@/lib/catalogo";

/** Semilla estable por fragancia: dos viales seguidos nunca se ven clonados. */
function semilla(slug: string): number {
  let suma = 0;
  for (const letra of slug) suma += letra.charCodeAt(0);
  return suma;
}

/**
 * La foto del perfume cuando existe; el frasco del negocio cuando todavía no.
 * El dueño sube la foto real desde /admin y esta misma casilla la toma.
 */
export function FotoFragancia({
  fragancia,
  prioridad = false,
  tamanos,
}: {
  fragancia: Fragancia;
  prioridad?: boolean;
  tamanos: string;
}) {
  if (fragancia.imagen) {
    return (
      <Image
        src={rutaPublica(fragancia.imagen)}
        alt={`${fragancia.casa} ${fragancia.nombre}`}
        fill
        sizes={tamanos}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        priority={prioridad}
      />
    );
  }

  const s = semilla(fragancia.slug);
  const alto = 56 + (s % 5) * 2.5;
  const giro = (s % 9) * 40 - 160;
  const desvio = (s % 4) * 26 - 40;

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <Topografia
        className="pointer-events-none absolute h-[340px] w-[340px]"
        opacidad={0.13}
        style={{ right: `${giro}px`, bottom: `${desvio}px` }}
      />
      <Decant
        className="relative w-auto transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        style={{ height: `${alto}%` }}
      />
    </div>
  );
}
