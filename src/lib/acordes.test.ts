// Comprobación de que cada acorde del catálogo tiene con qué dibujarse.
// Correr: node --experimental-strip-types src/lib/acordes.test.ts
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { COLOR, familiaDe, ILUSTRACION_FAMILIA, ilustracionDe, type Familia } from "./acordes.ts";
import { fragancias } from "./catalogo.ts";

const familias = Object.keys(COLOR) as Familia[];

/** Los dos tamaños: el chico lo baja la casilla del catálogo y el grande la
 *  barra de la ficha. Si falta uno, el `srcSet` apunta a un 404. */
function comprobarDibujo(dibujo: string, quien: string) {
  for (const archivo of [`${dibujo}-64.webp`, `${dibujo}.webp`]) {
    assert.ok(
      existsSync(`public/aromas/${archivo}`),
      `${quien} apunta al dibujo ${dibujo} pero falta public/aromas/${archivo}`,
    );
  }
}

// El catálogo se edita a mano desde /admin: un acorde escrito de cualquier forma
// tiene que caer igual en alguna familia y no dejar la casilla sin icono.
for (const fragancia of fragancias) {
  for (const acorde of fragancia.acordes) {
    assert.ok(
      familias.includes(familiaDe(acorde)),
      `el acorde "${acorde}" de ${fragancia.slug} no cae en ninguna familia`,
    );
    comprobarDibujo(ilustracionDe(acorde), `el acorde "${acorde}"`);
  }
}

// Y ninguna familia puede quedar sin dibujo, la use hoy el catálogo o no: el
// dueño carga acordes nuevos desde el panel sin pasar por acá.
for (const familia of familias) {
  comprobarDibujo(ILUSTRACION_FAMILIA[familia], `la familia ${familia}`);
}

// Un acorde que nadie previó cae en madera, y madera tiene su dibujo.
comprobarDibujo(ilustracionDe("un acorde que el dueño inventó"), "el acorde desconocido");

console.log(`acordes: ${familias.length} familias, todas ilustradas — comprobaciones OK`);
