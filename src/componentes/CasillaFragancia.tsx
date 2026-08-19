"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useBandeja } from "@/lib/bandeja";
import { rutaPublica } from "@/lib/rutas";
import {
  atomizaciones,
  formatearPrecio,
  type Fragancia,
} from "@/lib/catalogo";

export function CasillaFragancia({
  fragancia,
  prioridad = false,
}: {
  fragancia: Fragancia;
  prioridad?: boolean;
}) {
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
    <article className="casilla group relative flex flex-col border-t border-l border-oro-hondo/30 bg-tinta-alta transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-oro/60">
      <Link
        href={`/fragancia/${fragancia.slug}`}
        className="hueco relative block aspect-4/5 overflow-hidden"
      >
        <Image
          src={rutaPublica(fragancia.imagen)}
          alt={`${fragancia.casa} ${fragancia.nombre}`}
          fill
          sizes="(max-width: 520px) 100vw, (max-width: 1180px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          priority={prioridad}
        />
        <span className="grabado absolute top-3 left-3 bg-tinta/70 px-2 py-1 text-oro-claro">
          {fragancia.casa}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="font-display text-2xl leading-tight text-crema">
            <Link href={`/fragancia/${fragancia.slug}`} className="hover:text-oro-claro">
              {fragancia.nombre}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-crema-tenue">
            {fragancia.familia} · {fragancia.concentracion}
          </p>
        </div>

        <fieldset className="mt-auto">
          <legend className="etiqueta mb-2 text-crema-tenue">Medida</legend>
          <div className="flex gap-2">
            {fragancia.medidas.map((m) => {
              const activa = m.ml === ml;
              return (
                <label
                  key={m.ml}
                  className="etiqueta cifras flex cursor-pointer items-center gap-2 border px-3 py-2 transition-colors duration-150"
                  style={{
                    backgroundColor: activa ? "var(--color-oro)" : "transparent",
                    color: activa ? "var(--color-tinta)" : "var(--color-crema-tenue)",
                    borderColor: activa ? "var(--color-oro)" : "var(--color-oro-hondo)",
                    opacity: m.disponible ? 1 : 0.45,
                  }}
                >
                  <input
                    type="radio"
                    name={`medida-${fragancia.slug}`}
                    value={m.ml}
                    checked={activa}
                    disabled={!m.disponible}
                    onChange={() => setMl(m.ml)}
                    className="sr-only"
                  />
                  {m.ml} ml
                </label>
              );
            })}
          </div>
          <p className="cifras mt-2 text-xs text-crema-tenue">
            ≈ {atomizaciones(ml)} atomizaciones
          </p>
        </fieldset>

        <div className="flex items-end justify-between gap-3 border-t border-oro-hondo/25 pt-4">
          <p
            className="cifras text-lg"
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
            className="etiqueta border px-4 py-3 transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              backgroundColor: agotada ? "transparent" : "var(--color-oro)",
              borderColor: agotada ? "var(--color-oro-hondo)" : "var(--color-oro)",
              color: agotada ? "var(--color-crema-tenue)" : "var(--color-tinta)",
            }}
          >
            {agotada ? "Agotado" : "A la bandeja"}
          </button>
        </div>
      </div>
    </article>
  );
}
