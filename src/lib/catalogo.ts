import datos from "../datos/fragancias.json" with { type: "json" };

export type Medida = {
  ml: number;
  /** 0 significa precio sin confirmar: la web lo muestra como pendiente. */
  precio: number;
  disponible: boolean;
};

export type Fragancia = {
  slug: string;
  casa: string;
  nombre: string;
  concentracion: string;
  familia: string;
  genero: string;
  descripcion: string;
  cuandoUsarlo: string;
  notas: { salida: string[]; corazon: string[]; fondo: string[] };
  imagen: string;
  medidas: Medida[];
};

export const fragancias = datos.fragancias as Fragancia[];
export const moneda = datos.moneda;

export function buscarFragancia(slug: string): Fragancia | undefined {
  return fragancias.find((f) => f.slug === slug);
}

/** Mientras alguna medida siga en 0, la web avisa que los precios los confirma el vendedor. */
export const hayPreciosPendientes = fragancias.some((f) =>
  f.medidas.some((m) => m.precio === 0),
);

export function formatearPrecio(precio: number): string {
  if (precio === 0) return "A confirmar";
  return `$${precio.toFixed(2).replace(/\.00$/, "")}`;
}

/** Cuántas atomizaciones rinde una medida, a ~0,1 ml por pulsación. */
export function atomizaciones(ml: number): number {
  return Math.round((ml / 0.1) / 5) * 5;
}
