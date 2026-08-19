// Comprobación mínima del mensaje que se le manda al vendedor.
// Correr: node --experimental-strip-types src/lib/whatsapp.test.ts
import assert from "node:assert/strict";
import { armarMensaje, enlaceWhatsApp, TELEFONO } from "./whatsapp.ts";
import type { VialConFragancia } from "./bandeja.tsx";

function vial(nombre: string, ml: number, precio: number, cantidad: number) {
  return {
    slug: nombre.toLowerCase(),
    ml,
    cantidad,
    fragancia: {
      slug: nombre.toLowerCase(),
      casa: "Casa",
      nombre,
      concentracion: "Eau de Parfum",
      familia: "Amaderado",
      genero: "masculino",
      descripcion: "",
      cuandoUsarlo: "",
      notas: { salida: [], corazon: [], fondo: [] },
      imagen: "",
      medidas: [{ ml, precio, disponible: true }],
    },
  } as VialConFragancia;
}

// Con precios cargados, el mensaje lleva el total calculado.
const conPrecio = [vial("Uno", 5, 12, 2), vial("Dos", 10, 20.5, 1)];
const mensaje = armarMensaje(conPrecio, 44.5, false);
assert.match(mensaje, /2 × Casa Uno — 5 ml \(\$24 USD\)/);
assert.match(mensaje, /1 × Casa Dos — 10 ml \(\$20\.50 USD\)/);
assert.match(mensaje, /Total: \$44\.50 USD/);

// Sin precios confirmados, pide el total en vez de inventarlo.
const sinPrecio = [vial("Tres", 5, 0, 1)];
const pendiente = armarMensaje(sinPrecio, 0, true);
assert.match(pendiente, /precio a confirmar/);
assert.match(pendiente, /¿Me pasas el total/);
assert.doesNotMatch(pendiente, /Total: /);

// El enlace apunta al número del negocio y va codificado.
const enlace = enlaceWhatsApp(pendiente);
assert.ok(enlace.startsWith(`https://wa.me/${TELEFONO}?text=`));
assert.equal(decodeURIComponent(enlace.split("?text=")[1]), pendiente);

// Un pedido enorme se recorta para que wa.me lo siga abriendo.
const enorme = Array.from({ length: 120 }, (_, i) =>
  vial(`Fragancia número ${i} con nombre largo`, 10, 0, 3),
);
const enlaceLargo = enlaceWhatsApp(armarMensaje(enorme, 0, true));
assert.ok(enlaceLargo.length <= 1900, `URL de ${enlaceLargo.length} caracteres`);
assert.match(decodeURIComponent(enlaceLargo), /quedó cortado/);

// Un pedido normal no se toca.
assert.doesNotMatch(decodeURIComponent(enlaceWhatsApp(mensaje)), /quedó cortado/);

console.log("whatsapp: 11 comprobaciones OK");
