/**
 * Cada acorde del catálogo cae en una familia, y la familia le da su color y su
 * dibujo. Los colores están bajados de saturación a propósito: la página es negra
 * con dorado, y una paleta de fragancia a todo brillo la volvería un semáforo.
 */
export type Familia =
  | "citrico"
  | "acuatico"
  | "fresco"
  | "verde"
  | "floral"
  | "lavanda"
  | "afrutado"
  | "dulce"
  | "vainilla"
  | "talco"
  | "ambar"
  | "especias"
  | "madera"
  | "oud"
  | "cuero"
  | "tierra"
  | "cacao"
  | "humo";

export const COLOR: Record<Familia, string> = {
  citrico: "#C9B84E",
  acuatico: "#5E8CAD",
  fresco: "#7FA8B5",
  verde: "#7C9A66",
  floral: "#C598A6",
  lavanda: "#8E86B8",
  afrutado: "#C4736A",
  dulce: "#BE8798",
  vainilla: "#D8C39A",
  talco: "#ABA79F",
  ambar: "#C9903F",
  especias: "#B96A3C",
  madera: "#8E6C4B",
  oud: "#87694A",
  cuero: "#8A5B42",
  tierra: "#7D6B53",
  cacao: "#8A6149",
  humo: "#8B8379",
};

const FAMILIAS: Record<string, Familia> = {
  cítrico: "citrico",
  acuático: "acuatico",
  marino: "acuatico",
  ozónico: "acuatico",
  fresco: "fresco",
  "fresco especiado": "fresco",
  verde: "verde",
  herbal: "verde",
  aromático: "verde",
  anís: "verde",
  florales: "floral",
  "floral blanco": "floral",
  lavanda: "lavanda",
  afrutado: "afrutado",
  afrutados: "afrutado",
  dulce: "dulce",
  avainillado: "vainilla",
  almendrado: "vainilla",
  nueces: "vainilla",
  atalcado: "talco",
  almizclado: "talco",
  ámbar: "ambar",
  balsámico: "ambar",
  "cálido especiado": "especias",
  "especiado suave": "especias",
  canela: "especias",
  amaderado: "madera",
  oud: "oud",
  cuero: "cuero",
  animálico: "cuero",
  terrosos: "tierra",
  terroso: "tierra",
  cacao: "cacao",
  ahumado: "humo",
};

/** Un acorde que el dueño escriba a mano y no esté en la tabla cae en madera. */
export function familiaDe(acorde: string): Familia {
  return FAMILIAS[acorde.trim().toLowerCase()] ?? "madera";
}

export function colorDe(acorde: string): string {
  return COLOR[familiaDe(acorde)];
}

/**
 * Largo de la barra. El catálogo del dueño lista los acordes de lo que más se
 * siente a lo que menos: la barra lee ese orden, no una medición de laboratorio.
 */
export function intensidad(indice: number, total: number): number {
  if (total <= 1) return 100;
  return Math.round(100 - (indice / (total - 1)) * 55);
}
