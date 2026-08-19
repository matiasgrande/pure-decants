"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useBandeja } from "@/lib/bandeja";
import { formatearPrecio, moneda } from "@/lib/catalogo";
import { armarMensaje, enlaceWhatsApp } from "@/lib/whatsapp";
import { Vial } from "./Vial";

gsap.registerPlugin(useGSAP);

export function PanelBandeja() {
  const {
    vialesDetallados,
    totalViales,
    totalPrecio,
    preciosIncompletos,
    quitar,
    agregar,
    vaciar,
  } = useBandeja();

  const [abiertaEnMovil, setAbiertaEnMovil] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);

  // La única pieza de movimiento del sitio: el vial viaja hasta la bandeja
  // y la bandeja acusa recibo. Con reduced-motion no viaja nada.
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      function alAgregar(evento: Event) {
        // Hay dos marcas de bandeja (barra en móvil, panel en escritorio):
        // la que corresponde es la que está realmente visible.
        const marcas = [
          ...document.querySelectorAll<HTMLElement>("[data-marca-bandeja]"),
        ].filter((el) => el.offsetParent !== null);
        const marcaEl = marcas.at(-1);
        const marca = marcaEl?.getBoundingClientRect();
        if (!marcaEl || !marca) return;

        const acusar = () =>
          gsap.fromTo(
            marcaEl,
            { scale: 1 },
            { scale: 1.14, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.inOut" },
          );

        // Con movimiento reducido no hay viaje ni pulso: el vial ya aparece
        // en la lista, que es el estado final que importa.
        if (reduce) return;

        const { x, y } = (evento as CustomEvent<{ x: number; y: number }>).detail;
        const viajero = document.createElement("div");
        viajero.className = "pointer-events-none fixed z-50";
        viajero.style.cssText =
          "width:14px;height:42px;border-radius:2px;background:linear-gradient(180deg,var(--color-oro) 0 22%,rgba(216,205,184,.5) 22%);box-shadow:0 6px 18px -6px rgba(0,0,0,.8)";
        document.body.appendChild(viajero);

        gsap
          .timeline({ onComplete: () => viajero.remove() })
          .set(viajero, { left: x - 7, top: y - 21, opacity: 1, scale: 1 })
          .to(viajero, {
            left: marca.left + marca.width / 2 - 7,
            top: marca.top + marca.height / 2 - 21,
            scale: 0.55,
            rotate: -14,
            duration: 0.62,
            ease: "power3.inOut",
          })
          .to(viajero, { opacity: 0, duration: 0.14 }, "-=0.1")
          .add(acusar, "-=0.18");
      }

      window.addEventListener("pd:vial-agregado", alAgregar);
      return () => window.removeEventListener("pd:vial-agregado", alAgregar);
    },
    { scope: raiz },
  );

  const mensaje = armarMensaje(vialesDetallados, totalPrecio, preciosIncompletos);
  const vacia = totalViales === 0;

  return (
    <div ref={raiz}>
      {/* Móvil: barra al alcance del pulgar */}
      <button
        type="button"
        onClick={() => setAbiertaEnMovil((v) => !v)}
        aria-expanded={abiertaEnMovil}
        aria-controls="bandeja"
        aria-label={`${abiertaEnMovil ? "Cerrar" : "Abrir"} tu bandeja, ${totalViales} ${totalViales === 1 ? "vial" : "viales"}`}
        className="etiqueta fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-oro-hondo/60 bg-tinta-alta px-6 py-4 text-crema lg:hidden"
      >
        <span className="flex items-center gap-3">
          <span data-marca-bandeja className="inline-flex">
            <Vial className="h-8 w-auto" lleno={vacia ? 0 : 0.72} />
          </span>
          Bandeja
          <span className="cifras text-oro">{totalViales}</span>
        </span>
        <span className="text-crema-tenue">{abiertaEnMovil ? "Cerrar" : "Ver pedido"}</span>
      </button>

      <aside
        id="bandeja"
        aria-label="Tu bandeja"
        className="fixed z-40 flex flex-col border-oro-hondo/45 bg-tinta-alta transition-transform duration-300 ease-out max-lg:inset-x-0 max-lg:bottom-[68px] max-lg:max-h-[70dvh] max-lg:border-t lg:top-0 lg:right-0 lg:h-dvh lg:w-[366px] lg:border-l"
        data-abierta={abiertaEnMovil}
      >
        <div
          className={
            abiertaEnMovil
              ? "flex min-h-0 flex-1 flex-col"
              : "hidden min-h-0 flex-1 flex-col lg:flex"
          }
        >
          <header className="flex items-center justify-between border-b border-oro-hondo/35 px-6 py-5 max-lg:pt-6">
            <h2 className="grabado text-crema">Tu bandeja</h2>
            <span data-marca-bandeja className="hidden lg:inline-flex">
              <Vial className="h-9 w-auto" lleno={vacia ? 0 : 0.72} />
            </span>
          </header>

          {vacia ? (
            <div className="flex flex-1 flex-col justify-center gap-3 px-6 py-10">
              <p className="font-display text-2xl leading-snug text-crema">
                La bandeja está esperando.
              </p>
              <p className="text-sm text-crema-tenue">
                Elige una fragancia y su medida, y aparecerá aquí. Puedes mezclar
                varias en un mismo pedido.
              </p>
            </div>
          ) : (
            <ul className="flex-1 divide-y divide-oro-hondo/25 overflow-y-auto">
              {vialesDetallados.map((vial) => {
                const medida = vial.fragancia.medidas.find((m) => m.ml === vial.ml);
                return (
                  <li key={`${vial.slug}-${vial.ml}`} className="flex gap-3 px-6 py-4">
                    <span className="hueco flex w-9 shrink-0 items-center justify-center py-1">
                      <Vial className="h-11 w-auto" lleno={0.7} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-crema">
                        {vial.fragancia.nombre}
                      </p>
                      <p className="cifras text-xs text-crema-tenue">
                        {vial.fragancia.casa} · {vial.ml} ml
                      </p>

                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center border border-oro-hondo/50">
                          <button
                            type="button"
                            onClick={() => quitar(vial.slug, vial.ml)}
                            aria-label={`Quitar un ${vial.fragancia.nombre} de ${vial.ml} ml`}
                            className="px-2.5 py-1 text-crema-tenue transition-colors duration-150 hover:text-oro"
                          >
                            −
                          </button>
                          <span className="cifras px-2 text-sm text-crema">
                            {vial.cantidad}
                          </span>
                          <button
                            type="button"
                            onClick={() => agregar(vial.slug, vial.ml)}
                            aria-label={`Agregar otro ${vial.fragancia.nombre} de ${vial.ml} ml`}
                            className="px-2.5 py-1 text-crema-tenue transition-colors duration-150 hover:text-oro"
                          >
                            +
                          </button>
                        </div>

                        <span
                          className="cifras text-sm"
                          style={{
                            color:
                              medida && medida.precio > 0
                                ? "var(--color-crema)"
                                : "var(--color-crema-tenue)",
                          }}
                        >
                          {medida && medida.precio > 0
                            ? formatearPrecio(medida.precio * vial.cantidad)
                            : "A confirmar"}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <footer className="border-t border-oro-hondo/35 px-6 py-5">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="etiqueta text-crema-tenue">
                {preciosIncompletos ? "Total" : `Total (${moneda})`}
              </span>
              <span
                className="cifras text-lg"
                style={{
                  color: vacia
                    ? "var(--color-crema-tenue)"
                    : preciosIncompletos
                      ? "var(--color-aviso)"
                      : "var(--color-crema)",
                }}
              >
                {vacia
                  ? "—"
                  : preciosIncompletos
                    ? "Lo confirma el vendedor"
                    : formatearPrecio(totalPrecio)}
              </span>
            </div>

            {/* Con la bandeja vacía no hay pedido que enviar: en vez de un
                enlace que no lleva a ningún lado, va un botón deshabilitado,
                que es lo que un lector de pantalla sabe anunciar. */}
            {vacia ? (
              <button
                type="button"
                disabled
                className="etiqueta block w-full cursor-not-allowed border border-oro-hondo px-4 py-4 text-center text-crema-tenue"
              >
                Enviar pedido por WhatsApp
              </button>
            ) : (
              <a
                href={enlaceWhatsApp(mensaje)}
                target="_blank"
                rel="noopener noreferrer"
                className="etiqueta block w-full border border-oro bg-oro px-4 py-4 text-center text-tinta transition-colors duration-150 hover:bg-oro-claro"
              >
                Enviar pedido por WhatsApp
              </a>
            )}

            <p className="mt-3 text-xs leading-relaxed text-crema-tenue">
              El envío y la forma de pago se acuerdan en el chat. No se cobra nada
              desde la web.
            </p>

            {!vacia && (
              <button
                type="button"
                onClick={vaciar}
                className="etiqueta mt-3 text-crema-tenue underline underline-offset-4 transition-colors duration-150 hover:text-aviso"
              >
                Vaciar bandeja
              </button>
            )}
          </footer>
        </div>
      </aside>
    </div>
  );
}
