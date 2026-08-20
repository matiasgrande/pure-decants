// Comprobación del catálogo publicado y de lo que el panel deriva al editarlo.
// Correr: node --experimental-strip-types src/lib/catalogo.test.ts
import assert from "node:assert/strict";
import { armarSlug, atomizaciones, formatearPrecio, fragancias } from "./catalogo.ts";
import { aBase64 } from "./github.ts";

// El slug es la dirección de la ficha: sin acentos, sin signos, sin colas de guion.
assert.equal(armarSlug("Acqua di Gio", "Giorgio Armani"), "acqua-di-gio-giorgio-armani");
assert.equal(armarSlug("Pi", "Givenchy"), "pi-givenchy");
assert.equal(armarSlug("Ámbar & Cuero", "Maison Alhambra"), "ambar-cuero-maison-alhambra");
assert.equal(armarSlug("", ""), "");
assert.ok(!armarSlug("x".repeat(80), "Casa").endsWith("-"));

// Los acentos del catálogo tienen que sobrevivir el viaje a la API de GitHub.
const texto = '{ "acorde": "Cálido especiado · Ámbar" }';
const vuelta = Buffer.from(
  aBase64(new TextEncoder().encode(texto)),
  "base64",
).toString("utf8");
assert.equal(vuelta, texto);

// Nada de precios inventados: el 0 se muestra, no se suma.
assert.equal(formatearPrecio(0), "A confirmar");
assert.equal(formatearPrecio(22), "$22");
assert.equal(formatearPrecio(20.5), "$20.50");

assert.equal(atomizaciones(5), 50);
assert.equal(atomizaciones(10), 100);

// El catálogo publicado no puede tener slugs repetidos: dos fichas competirían por la URL.
const slugs = fragancias.map((f) => f.slug);
assert.equal(new Set(slugs).size, slugs.length);
for (const fragancia of fragancias) {
  assert.ok(fragancia.casa && fragancia.nombre, `sin nombre: ${fragancia.slug}`);
  assert.ok(fragancia.acordes.length > 0, `sin acordes: ${fragancia.slug}`);
  assert.ok(fragancia.medidas.length > 0, `sin medidas: ${fragancia.slug}`);
  for (const medida of fragancia.medidas) {
    assert.ok(medida.precio >= 0, `precio negativo en ${fragancia.slug}`);
  }
}

console.log(`catálogo: ${fragancias.length} fragancias, comprobaciones OK`);
