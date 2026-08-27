/**
 * Cada acorde del catálogo cae en una familia, y la familia le da su color y su
 * dibujo. Los colores están bajados de saturación a propósito: la página es negra
 * con dorado, y una paleta de fragancia a todo brillo la volvería un semáforo.
 */
export type Familia =
  | "citrico"
  | "acuatico"
  | "fresco"
  | "fresco-especiado"
  | "verde"
  | "floral"
  | "lavanda"
  | "afrutado"
  | "dulce"
  | "vainilla"
  | "nuez"
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
  "fresco-especiado": "#8FA69C",
  verde: "#7C9A66",
  floral: "#C598A6",
  lavanda: "#8E86B8",
  afrutado: "#C4736A",
  dulce: "#BE8798",
  vainilla: "#D8C39A",
  nuez: "#C2A177",
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
  "fresco especiado": "fresco-especiado",
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
  almendrado: "nuez",
  nueces: "nuez",
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

/**
 * El dibujo que le toca a cada familia, de los que viven en `public/aromas`.
 * El nombre del archivo es el del dibujo y no el de la familia, porque hay
 * familias con más de uno: `cuero` y `animalico` caen las dos en cuero.
 *
 * Está completo a propósito: si mañana nace una familia, TypeScript no compila
 * hasta que tenga su dibujo, y ningún acorde puede quedarse sin icono.
 */
export const ILUSTRACION_FAMILIA: Record<Familia, string> = {
  acuatico: "marino",
  verde: "aromatico",
  citrico: "citrico",
  "fresco-especiado": "fresco-especiado",
  fresco: "fresco",
  vainilla: "avainillado",
  madera: "amaderado",
  cuero: "cuero",
  ambar: "ambar",
  dulce: "dulce",
  afrutado: "afrutado",
  especias: "calido-especiado",
  lavanda: "lavanda",
  talco: "atalcado",
  oud: "oud",
  cacao: "cacao",
  floral: "florales",
  nuez: "nueces",
  tierra: "terroso",
  humo: "ahumado",
};

/**
 * Acordes que el dueño dibujó aparte aunque compartan familia con otro. El
 * dibujo distingue el acorde; el color sigue siendo el de la familia, porque
 * un segundo verde o un segundo marrón al lado del primero no dirían nada que
 * el dibujo no diga mejor.
 */
const ILUSTRACION_ACORDE: Record<string, string> = {
  verde: "verde",
  ozónico: "ozonico",
  animálico: "animalico",
  balsámico: "balsamico",
  "floral blanco": "floral-blanco",
  almendrado: "almendrado",
};

/**
 * El dibujo de un acorde. Nunca falta: un acorde que el dueño escriba a mano y
 * no esté en la tabla cae en madera, y madera tiene el suyo.
 */
export function ilustracionDe(acorde: string): string {
  const clave = acorde.trim().toLowerCase();
  return ILUSTRACION_ACORDE[clave] ?? ILUSTRACION_FAMILIA[familiaDe(clave)];
}
