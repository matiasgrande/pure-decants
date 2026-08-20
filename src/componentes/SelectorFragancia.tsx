"use client";

import { useRef, useState } from "react";
import { useBandeja } from "@/lib/bandeja";
import {
  atomizaciones,
  formatearPrecio,
  tienePrecioPendiente,
  type Fragancia,
} from "@/lib/catalogo";

/** El mismo control de la casilla, a escala de ficha: medida, precio y acción. */
export function SelectorFragancia({ fragancia }: { fragancia: Fragancia }) {
  const disponibles = fragancia.medidas.filter((m) => m.disponible);
  const [ml, setMl] = useState(disponibles[0]?.ml ?? fragancia.medidas[0].ml);
  const { agregar } = useBandeja();
  const botonRef = useRef<HTMLButtonElement>(null);

  const medida = fragancia.medidas.find((m) => m.ml === ml);
  const agotada = !medida?.disponible;

  function poner() {
    if (agotada) return;
    agregar(fragancia.slug, ml);
    const caja = botonRef.current?.getBoundingClientRect();
    if (caja) {
      window.dispatchEvent(
        new CustomEvent("pd:vial-agregado", {
          detail: { x: caja.left + caja.width / 2, y: caja.top + caja.height / 2 },
        }),
      );
    }
  }

  return (
    <div className="border border-oro-hondo/40 p-6">
      <fieldset>
        <legend className="etiqueta mb-3 text-crema-tenue">Elige la medida</legend>
        <div className="flex flex-wrap gap-3">
          {fragancia.medidas.map((m) => {
            const activa = m.ml === ml;
            return (
              <label
                key={m.ml}
                className="etiqueta cifras flex cursor-pointer flex-col gap-1 border px-5 py-3 transition-colors duration-150"
                style={{
                  backgroundColor: activa ? "var(--color-oro)" : "transparent",
                  color: activa ? "var(--color-tinta)" : "var(--color-crema-tenue)",
                  borderColor: activa ? "var(--color-oro)" : "var(--color-oro-hondo)",
                  opacity: m.disponible ? 1 : 0.45,
                }}
              >
                <input
                  type="radio"
                  name={`medida-ficha-${fragancia.slug}`}
                  value={m.ml}
                  checked={activa}
                  disabled={!m.disponible}
                  onChange={() => setMl(m.ml)}
                  className="sr-only"
                />
                <span>{m.ml} ml</span>
                <span className="text-[0.7rem] normal-case opacity-80">
                  ≈ {atomizaciones(m.ml)} usos
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-oro-hondo/25 pt-5">
        <p
          className="cifras text-xl"
          style={{
            color:
              medida && medida.precio > 0
                ? "var(--color-crema)"
                : "var(--color-crema-tenue)",
          }}
        >
          {agotada ? "Agotado" : formatearPrecio(medida?.precio ?? 0)}
        </p>

        <button
          ref={botonRef}
          type="button"
          onClick={poner}
          disabled={agotada}
          className="etiqueta border px-8 py-4 transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            backgroundColor: agotada ? "transparent" : "var(--color-oro)",
            borderColor: agotada ? "var(--color-oro-hondo)" : "var(--color-oro)",
            color: agotada ? "var(--color-crema-tenue)" : "var(--color-tinta)",
          }}
        >
          {agotada ? "Agotado" : "A la bandeja"}
        </button>
      </div>

      {tienePrecioPendiente(fragancia) && (
        <p
          className="mt-5 border-t pt-4 text-sm leading-relaxed"
          style={{
            borderColor: "var(--color-oro-hondo)",
            color: "var(--color-aviso)",
          }}
        >
          Este todavía no tiene precio cargado. Lo confirma el vendedor por
          WhatsApp: puedes ponerlo en la bandeja igual.
        </p>
      )}
    </div>
  );
}
