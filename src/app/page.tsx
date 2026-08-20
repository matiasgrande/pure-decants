import { Muestrario } from "@/componentes/Muestrario";
import { Topografia } from "@/componentes/Topografia";
import { Decant } from "@/componentes/Decant";
import { fragancias } from "@/lib/catalogo";

export default function Inicio() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-oro-hondo/35">
        <Topografia
          className="pointer-events-none absolute -top-32 -left-28 h-[460px] w-[460px]"
          opacidad={0.18}
        />

        <div className="relative mx-auto grid max-w-[1240px] gap-12 px-6 pt-16 pb-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:px-12 lg:pt-24 lg:pb-24">
          <div>
            <p className="grabado text-oro">Muestrario · Isla de Margarita</p>

            <h1 className="mt-6 font-display text-[clamp(2rem,8.5vw,5.6rem)] leading-[0.95] tracking-[0.02em] text-balance text-crema">
              Perfume original,
              <br />
              en la medida
              <br />
              <span className="text-oro">que usas.</span>
            </h1>

            <p className="mt-8 max-w-[62ch] text-crema-tenue">
              Un decant es la misma fragancia del frasco original, reenvasada en 5 o
              10 ml. Armas tu bandeja aquí, la envías por WhatsApp, y el pago y el
              envío se acuerdan en el chat.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#muestrario"
                className="etiqueta border border-oro bg-oro px-8 py-4 text-tinta transition-colors duration-150 hover:bg-oro-claro"
              >
                Ver el muestrario
              </a>
              <a
                href="#como-funciona"
                className="etiqueta border border-oro-hondo px-6 py-4 text-crema transition-colors duration-150 hover:border-oro"
              >
                Qué es un decant
              </a>
            </div>
          </div>

          {/* La bandeja abierta: cada medida en su propio rebaje. */}
          <div className="relative border border-oro-hondo/40 bg-tinta-alta p-3">
            <div className="grid grid-cols-2 gap-3">
              <figure className="hueco flex flex-col items-center justify-end gap-5 px-4 pt-10 pb-6">
                <Decant ml={5} className="h-44 w-auto sm:h-52" prioridad />
                <figcaption className="text-center">
                  <span className="grabado block text-oro-claro">5 ml</span>
                  <span className="cifras text-sm text-crema-tenue">
                    ≈ 50 atomizaciones
                  </span>
                </figcaption>
              </figure>

              <figure className="hueco flex flex-col items-center justify-end gap-5 px-4 pt-4 pb-6">
                <Decant ml={10} className="h-56 w-auto sm:h-66" prioridad />
                <figcaption className="text-center">
                  <span className="grabado block text-oro-claro">10 ml</span>
                  <span className="cifras text-sm text-crema-tenue">
                    ≈ 100 atomizaciones
                  </span>
                </figcaption>
              </figure>
            </div>

            <p className="grabado mt-3 border-t border-oro-hondo/30 px-1 pt-3 text-center text-crema-tenue">
              Mismo perfume · Menos frasco
            </p>
          </div>
        </div>
      </section>

      <section
        id="como-funciona"
        className="border-b border-oro-hondo/35 bg-tinta-hueco"
      >
        <div className="mx-auto max-w-[1240px] px-6 py-16 lg:px-12 lg:py-20">
          <h2 className="rotulo text-oro">Cómo funciona</h2>

          <div className="mt-10 grid gap-10 md:grid-cols-3">
            <div>
              <p className="font-display text-[clamp(1.5rem,5vw,1.9rem)] leading-tight text-crema">
                Sale del frasco original.
              </p>
              <p className="mt-4 leading-relaxed text-crema-tenue">
                No es una imitación ni un &laquo;inspirado en&raquo;. Es el perfume de
                la casa, trasvasado con un proceso limpio a un atomizador más
                pequeño.
              </p>
            </div>

            <div>
              <p className="font-display text-[clamp(1.5rem,5vw,1.9rem)] leading-tight text-crema">
                Eliges cuánto quieres.
              </p>
              <p className="mt-4 leading-relaxed text-crema-tenue">
                5 ml para probar una fragancia sin arriesgar el precio del frasco
                entero. 10 ml para usarla a diario durante semanas.
              </p>
            </div>

            <div>
              <p className="font-display text-[clamp(1.5rem,5vw,1.9rem)] leading-tight text-crema">
                El pedido llega escrito.
              </p>
              <p className="mt-4 leading-relaxed text-crema-tenue">
                Al enviar la bandeja, WhatsApp se abre con tu pedido ya redactado.
                Ahí se confirma el total, el pago y el envío.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="muestrario" className="scroll-mt-20">
        <div className="mx-auto max-w-[1240px] px-6 py-16 lg:px-12 lg:py-20">
          <div>
            <h2 className="rotulo text-oro">El muestrario</h2>
            <p className="mt-4 max-w-[62ch] text-crema-tenue">
              Elige la medida en cada casilla y ponla en tu bandeja. Puedes
              combinar varias fragancias en un mismo pedido.
            </p>
          </div>

          <Muestrario fragancias={fragancias} />
        </div>
      </section>
    </>
  );
}
