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

      gsap.from(".barra-relleno", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: raiz.current, start: "top 85%" },
      });
    },
    { scope: raiz },
  );

  return (
    <ul ref={raiz} className="mt-7 space-y-5">
      {acordes.map((acorde, i) => {
        const color = colorDe(acorde);
        return (
          <li key={`${i}-${acorde}`}>
            <div className="flex items-baseline gap-3">
              <IconoAcorde
                acorde={acorde}
                className="size-5 shrink-0 translate-y-1"
                // El color es la firma de la familia: repite el de su barra.
                style={{ color }}
              />
              <span className="flex-1 text-crema">{acorde}</span>
            </div>
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
          </li>
        );
      })}
    </ul>
  );
}
