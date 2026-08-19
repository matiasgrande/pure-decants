/**
 * Prefijo del sitio cuando no vive en la raíz del dominio (GitHub Pages lo sirve
 * en /pure-decants/). `next/image` con `unoptimized` no lo agrega solo, así que
 * toda ruta de `public/` pasa por acá.
 */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function rutaPublica(ruta: string): string {
  return `${BASE}${ruta}`;
}

/**
 * Origen público del sitio. En GitHub Pages lo pone el flujo de despliegue;
 * cuando haya dominio propio, se cambia esta variable y nada más.
 */
export const SITIO =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
