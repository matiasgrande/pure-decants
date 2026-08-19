"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fragancias, type Fragancia } from "./catalogo";

export type Vial = {
  slug: string;
  ml: number;
  cantidad: number;
};

export type VialConFragancia = Vial & { fragancia: Fragancia };

type ContextoBandeja = {
  viales: Vial[];
  vialesDetallados: VialConFragancia[];
  totalViales: number;
  totalPrecio: number;
  preciosIncompletos: boolean;
  agregar: (slug: string, ml: number) => void;
  quitar: (slug: string, ml: number) => void;
  vaciar: () => void;
};

const CLAVE = "puredecants:bandeja:v1";
const Bandeja = createContext<ContextoBandeja | null>(null);

function leerGuardado(): Vial[] {
  if (typeof window === "undefined") return [];
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (!crudo) return [];
    const parseado: unknown = JSON.parse(crudo);
    if (!Array.isArray(parseado)) return [];
    // Descartamos lo que ya no existe en el catálogo: el JSON manda.
    return parseado.filter(
      (v): v is Vial =>
        typeof v === "object" &&
        v !== null &&
        typeof (v as Vial).slug === "string" &&
        typeof (v as Vial).ml === "number" &&
        Number.isInteger((v as Vial).cantidad) &&
        (v as Vial).cantidad > 0 &&
        fragancias.some(
          (f) =>
            f.slug === (v as Vial).slug &&
            f.medidas.some((m) => m.ml === (v as Vial).ml),
        ),
    );
  } catch {
    return [];
  }
}

export function ProveedorBandeja({ children }: { children: React.ReactNode }) {
  const [viales, setViales] = useState<Vial[]>([]);
  const [hidratada, setHidratada] = useState(false);

  // El servidor no conoce el localStorage: hidratamos después del primer render.
  useEffect(() => {
    setViales(leerGuardado());
    setHidratada(true);
  }, []);

  useEffect(() => {
    if (!hidratada) return;
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(viales));
    } catch {
      // Modo privado o almacenamiento lleno. La bandeja sigue funcionando en
      // esta pestaña, pero no va a sobrevivir a una recarga.
    }
  }, [viales, hidratada]);

  const agregar = useCallback((slug: string, ml: number) => {
    setViales((previos) => {
      const existente = previos.find((v) => v.slug === slug && v.ml === ml);
      if (existente) {
        return previos.map((v) =>
          v === existente ? { ...v, cantidad: v.cantidad + 1 } : v,
        );
      }
      return [...previos, { slug, ml, cantidad: 1 }];
    });
  }, []);

  const quitar = useCallback((slug: string, ml: number) => {
    setViales((previos) =>
      previos
        .map((v) =>
          v.slug === slug && v.ml === ml ? { ...v, cantidad: v.cantidad - 1 } : v,
        )
        .filter((v) => v.cantidad > 0),
    );
  }, []);

  const vaciar = useCallback(() => setViales([]), []);

  const valor = useMemo<ContextoBandeja>(() => {
    const vialesDetallados = viales.flatMap((v) => {
      const fragancia = fragancias.find((f) => f.slug === v.slug);
      return fragancia ? [{ ...v, fragancia }] : [];
    });

    const totalViales = viales.reduce((suma, v) => suma + v.cantidad, 0);

    const totalPrecio = vialesDetallados.reduce((suma, v) => {
      const medida = v.fragancia.medidas.find((m) => m.ml === v.ml);
      return suma + (medida?.precio ?? 0) * v.cantidad;
    }, 0);

    const preciosIncompletos = vialesDetallados.some((v) => {
      const medida = v.fragancia.medidas.find((m) => m.ml === v.ml);
      return !medida || medida.precio === 0;
    });

    return {
      viales,
      vialesDetallados,
      totalViales,
      totalPrecio,
      preciosIncompletos,
      agregar,
      quitar,
      vaciar,
    };
  }, [viales, agregar, quitar, vaciar]);

  return <Bandeja.Provider value={valor}>{children}</Bandeja.Provider>;
}

export function useBandeja(): ContextoBandeja {
  const contexto = useContext(Bandeja);
  if (!contexto) {
    throw new Error("useBandeja necesita estar dentro de ProveedorBandeja");
  }
  return contexto;
}
