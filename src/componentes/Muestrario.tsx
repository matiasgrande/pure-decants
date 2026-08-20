"use client";

import { useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { CasillaFragancia } from "@/componentes/CasillaFragancia";
import type { Fragancia } from "@/lib/catalogo";

gsap.registerPlugin(useGSAP);

/** Quita acentos para que "citrico" encuentre "Cítrico". */
function plano(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function Muestrario({ fragancias }: { fragancias: Fragancia[] }) {
  const [busqueda, setBusqueda] = useState("");
  const [casa, setCasa] = useState("");
  const [abierto, setAbierto] = useState(false);
  const cajon = useRef<HTMLDivElement>(null);

  const casas = useMemo(
    () =>
      [...new Set(fragancias.map((f) => f.casa))].sort((a, b) =>
        a.localeCompare(b, "es"),
      ),
    [fragancias],
  );

  const visibles = useMemo(() => {
    const texto = plano(busqueda.trim());
    return fragancias.filter((f) => {
      if (casa && f.casa !== casa) return false;
      if (!texto) return true;
      return plano(`${f.casa} ${f.nombre} ${f.acordes.join(" ")}`).includes(texto);
    });
  }, [fragancias, busqueda, casa]);

  const filtrando = Boolean(casa || busqueda.trim());

  // El cajón de casas entra desde arriba en vez de aparecer de golpe.
  useGSAP(
    () => {
      if (!abierto || !cajon.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(cajon.current, {
        autoAlpha: 0,
        y: -10,
        duration: 0.3,
        ease: "power2.out",
      });
    },
    { dependencies: [abierto] },
  );

  return (
    <>
      <div className="mt-10 border-y border-oro-hondo/30 py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="w-full sm:min-w-[13rem] sm:flex-1">
            <span className="sr-only">Buscar una fragancia</span>
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, casa o nota"
              className="w-full border border-oro-hondo/70 bg-tinta-alta px-5 py-4 text-crema transition-colors duration-150 placeholder:text-crema-tenue focus:border-oro"
            />
          </label>

          <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="filtro-casas"
            className="etiqueta flex flex-1 items-center justify-center gap-3 border px-5 py-4 transition-colors duration-150 sm:flex-none"
            style={{
              backgroundColor: casa ? "var(--color-oro)" : "transparent",
              borderColor: casa ? "var(--color-oro)" : "var(--color-oro-hondo)",
              color: casa ? "var(--color-tinta)" : "var(--color-crema)",
            }}
          >
            {casa || "Filtrar por casa"}
            <span
              aria-hidden="true"
              className="text-[0.6rem] transition-transform duration-200"
              style={{ transform: abierto ? "rotate(180deg)" : "none" }}
            >
              ▼
            </span>
          </button>

          <p aria-live="polite" className="cifras shrink-0 text-crema-tenue">
            {visibles.length} de {fragancias.length}
          </p>
          </div>
        </div>

        {abierto && (
          <div id="filtro-casas" ref={cajon} className="mt-5">
            {/* Quince casas apiladas se comen la pantalla del teléfono antes de
                que aparezca el primer frasco: en móvil van en una fila que rueda. */}
            <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
              <Chip activo={!casa} onClick={() => setCasa("")}>
                Todas
              </Chip>
              {casas.map((nombre) => (
                <Chip
                  key={nombre}
                  activo={casa === nombre}
                  onClick={() => {
                    setCasa(casa === nombre ? "" : nombre);
                    setAbierto(false);
                  }}
                >
                  {nombre}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>

      {visibles.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 border-r border-b border-oro-hondo/30 min-[520px]:grid-cols-2 min-[1180px]:grid-cols-3">
          {visibles.map((fragancia, i) => (
            <CasillaFragancia
              key={fragancia.slug}
              fragancia={fragancia}
              prioridad={!filtrando && i < 3}
            />
          ))}
        </div>
      ) : (
        <div className="hueco mt-10 border border-oro-hondo/30 px-6 py-16 text-center">
          <p className="font-display text-2xl text-crema">
            Nada con ese nombre en la bandeja.
          </p>
          <p className="mt-3 text-crema-tenue">
            Prueba con otra casa, o escríbenos: lo que no está aquí a veces se
            consigue.
          </p>
          <button
            type="button"
            onClick={() => {
              setBusqueda("");
              setCasa("");
              setAbierto(false);
            }}
            className="etiqueta mt-8 border border-oro px-6 py-4 text-oro transition-colors duration-150 hover:bg-oro hover:text-tinta"
          >
            Ver las {fragancias.length} fragancias
          </button>
        </div>
      )}
    </>
  );
}

function Chip({
  activo,
  onClick,
  children,
}: {
  activo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activo}
      className="etiqueta shrink-0 border px-4 py-2.5 whitespace-nowrap transition-colors duration-150"
      style={{
        backgroundColor: activo ? "var(--color-oro)" : "transparent",
        borderColor: activo ? "var(--color-oro)" : "var(--color-oro-hondo)",
        color: activo ? "var(--color-tinta)" : "var(--color-crema-tenue)",
      }}
    >
      {children}
    </button>
  );
}
