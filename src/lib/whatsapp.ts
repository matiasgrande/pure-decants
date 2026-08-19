import { formatearPrecio, moneda } from "./catalogo.ts";
import type { VialConFragancia } from "./bandeja.tsx";

/** Número del negocio, tomado del enlace wa.link/yy6ya1 que publica en Instagram. */
export const TELEFONO = "584248248160";
export const TELEFONO_LEGIBLE = "+58 424 824 8160";
export const INSTAGRAM = "https://www.instagram.com/puredecantsve/";

export function armarMensaje(
  viales: VialConFragancia[],
  totalPrecio: number,
  preciosIncompletos: boolean,
): string {
  const lineas: string[] = [
    "Hola PureDecants, quiero hacer este pedido:",
    "",
  ];

  for (const vial of viales) {
    const medida = vial.fragancia.medidas.find((m) => m.ml === vial.ml);
    const precio = medida?.precio ?? 0;
    const detallePrecio =
      precio === 0
        ? "precio a confirmar"
        : `${formatearPrecio(precio * vial.cantidad)} ${moneda}`;

    lineas.push(
      `• ${vial.cantidad} × ${vial.fragancia.casa} ${vial.fragancia.nombre} — ${vial.ml} ml (${detallePrecio})`,
    );
  }

  lineas.push("");

  if (preciosIncompletos) {
    lineas.push("¿Me pasas el total, por favor?");
  } else {
    lineas.push(`Total: ${formatearPrecio(totalPrecio)} ${moneda}`);
  }

  lineas.push("También quiero coordinar el envío y la forma de pago.");

  return lineas.join("\n");
}

/**
 * wa.me deja de abrir el chat cuando la URL se pasa de unos 2000 caracteres.
 * Un pedido largo se recorta y avisa, en vez de generar un enlace que no abre.
 */
const LARGO_MAXIMO_URL = 1900;

export function enlaceWhatsApp(mensaje: string): string {
  const base = `https://wa.me/${TELEFONO}?text=`;
  let texto = mensaje;

  if (base.length + encodeURIComponent(texto).length > LARGO_MAXIMO_URL) {
    const cola = "\n\n(El pedido es largo y quedó cortado: te paso el resto por aquí.)";
    const lineas = texto.split("\n");
    while (
      lineas.length > 1 &&
      base.length + encodeURIComponent(lineas.join("\n") + cola).length >
        LARGO_MAXIMO_URL
    ) {
      lineas.pop();
    }
    texto = lineas.join("\n") + cola;
  }

  return base + encodeURIComponent(texto);
}
