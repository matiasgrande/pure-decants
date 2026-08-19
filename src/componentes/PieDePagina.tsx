import { INSTAGRAM, TELEFONO_LEGIBLE, TELEFONO } from "@/lib/whatsapp";
import { Topografia } from "./Topografia";

export function PieDePagina() {
  return (
    <footer className="relative overflow-hidden border-t border-oro-hondo/35 bg-tinta-hueco">
      <Topografia
        className="pointer-events-none absolute -right-24 -bottom-40 h-[420px] w-[420px]"
        opacidad={0.14}
      />

      <div className="relative mx-auto max-w-[1240px] px-6 py-16 lg:px-12">
        <p className="font-display text-3xl leading-tight text-crema sm:text-4xl">
          Grandes aromas,
          <br />
          <span className="text-oro">pequeñas dosis.</span>
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          <div>
            <h2 className="etiqueta mb-2 text-crema-tenue">Pedidos</h2>
            <a
              href={`https://wa.me/${TELEFONO}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cifras text-crema transition-colors duration-150 hover:text-oro"
            >
              WhatsApp {TELEFONO_LEGIBLE}
            </a>
          </div>

          <div>
            <h2 className="etiqueta mb-2 text-crema-tenue">Catálogo al día</h2>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="text-crema transition-colors duration-150 hover:text-oro"
            >
              @puredecantsve
            </a>
          </div>

          <div>
            <h2 className="etiqueta mb-2 text-crema-tenue">Dónde estamos</h2>
            <p className="text-crema">
              Isla de Margarita
              <br />
              <span className="text-crema-tenue">Envíos a toda Venezuela</span>
            </p>
          </div>
        </div>

        <p className="mt-12 text-xs text-crema-tenue">
          PureDecants reenvasa fragancias originales. Las marcas mencionadas
          pertenecen a sus respectivos titulares y no patrocinan este sitio.
        </p>
      </div>
    </footer>
  );
}
