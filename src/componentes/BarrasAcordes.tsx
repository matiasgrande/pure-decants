"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IconoAcorde } from "@/componentes/IconoAcorde";
import { colorDe, intensidad } from "@/lib/acordes";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Los acordes como barras: el primero es el que más se siente y el que más
 * ocupa. El orden lo puso el dueño en su catálogo; la barra lo hace visible.
 */
export function BarrasAcordes({ acordes }: { acordes: string[] }) {
  const raiz = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const relleno = gsap.timeline({ paused: true });
      relleno.from(".barra-relleno", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
      });

      ScrollTrigger.create({
        trigger: raiz.current,
        start: "top 85%",
        // Al subir, las barras se vacían con la misma animación al revés en vez
        // de saltar a cero: subiendo despacio el salto se veía. Y arrancan
        // desde donde quedaron, así que cambiar de sentido a mitad de camino no
        // reinicia nada.
        onEnter: () => relleno.timeScale(1).play(),
        // Se vacían más rápido de lo que se llenan: lo que entra se toma su
        // tiempo, lo que se va no debe hacerse esperar.
        onLeaveBack: () => relleno.timeScale(2.6).reverse(),
      });
    },
    { scope: raiz },
  );

  return (
    <ul ref={raiz} className="mt-7 space-y-6">
      {acordes.map((acorde, i) => {
        const color = colorDe(acorde);
        return (
          <li key={`${i}-${acorde}`} className="flex items-center gap-4">
            {/* La ilustración manda a la izquierda y el nombre con su barra se
                apoyan contra ella: a este tamaño el dibujo es la etiqueta, y
                colgarlo de la línea de texto lo dejaba flotando. */}
            <IconoAcorde acorde={acorde} px={48} className="shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-crema">{acorde}</span>
              <div
                className="mt-2 h-1.5 w-full"
                style={{ backgroundColor: "rgb(122 95 46 / 0.22)" }}
              >
                <div
                  className="barra-relleno h-full"
                  style={{
                    width: `${intensidad(i, acordes.length)}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
