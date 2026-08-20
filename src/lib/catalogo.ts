import datos from "../datos/fragancias.json" with { type: "json" };

export type Medida = {
  ml: number;
  /** 0 significa precio sin definir: la web lo muestra como pendiente y no lo suma. */
  precio: number;
  disponible: boolean;
};

export type Fragancia = {
  slug: string;
  casa: string;
  nombre: string;
  /** Solo cuando el nombre no la dice ya (Parfum, Eau de Parfum, Tester). */
  concentracion?: string;
  /** Acordes principales tal como los listó el dueño en su catálogo. */
  acordes: string[];
  descripcion?: string;
  cuandoUsarlo?: string;
  /** null mientras no haya foto propia: la ficha muestra el vial dibujado. */
  imagen: string | null;
  medidas: Medida[];
};

export const fragancias = datos.fragancias as unknown as Fragancia[];
export const moneda = datos.moneda;

export function buscarFragancia(slug: string): Fragancia | undefined {
  return fragancias.find((f) => f.slug === slug);
}

export function formatearPrecio(precio: number): string {
  if (precio === 0) return "A confirmar";
  return `$${precio.toFixed(2).replace(/\.00$/, "")}`;
}

/** Cuántas atomizaciones rinde una medida, a ~0,1 ml por pulsación. */
export function atomizaciones(ml: number): number {
  return Math.round((ml / 0.1) / 5) * 5;
}

/** De "Acqua di Gio" + "Giorgio Armani" sale la dirección de su ficha, sin acentos ni signos. */
export function armarSlug(nombre: string, casa: string): string {
  return `${nombre} ${casa}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)
    .replace(/-$/, "");
}
