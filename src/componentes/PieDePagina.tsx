import { INSTAGRAM, TELEFONO } from "@/lib/whatsapp";
import { Topografia } from "./Topografia";

/**
 * Los dos únicos enlaces del pie son marcas ajenas, así que sus dibujos son
 * reconocibles por silueta; el trazo de 1.4 y el lienzo de 24 son los mismos
 * de `IconoAcorde` para que no se lean como pegatinas importadas.
 */
const REDES = [
  {
    nombre: "Escribir por WhatsApp",
    url: `https://wa.me/${TELEFONO}`,
    trazo: (
      <>
        <path d="M12 3.3a8.7 8.7 0 0 0-7.4 13.3l-1.2 4.1 4.2-1.2A8.7 8.7 0 1 0 12 3.3Z" />
        <path d="M9.2 8.3c.3-.6.6-.7.9-.7.3 0 .6.05.8.5l.6 1.5c.1.3 0 .5-.2.7l-.5.5c-.2.2-.2.4-.1.6.5 1 1.3 1.8 2.3 2.3.2.1.4.1.6-.1l.5-.5c.2-.2.4-.3.7-.2l1.5.6c.4.2.5.5.5.8 0 .3-.1.6-.7.9-.5.3-1.2.4-1.9.3-2.4-.6-4.5-2.7-5.1-5.1-.2-.7 0-1.5.3-2Z" />
      </>
    ),
  },
  {
    nombre: "Instagram @puredecantsve",
    url: INSTAGRAM,
    trazo: (
      <>
        <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="4.8" />
        <circle cx="12" cy="12" r="3.9" />
        <circle cx="17" cy="7" r=".95" fill="currentColor" stroke="none" />
      </>
    ),
  },
];

export function PieDePagina() {
  return (
    <footer className="relative overflow-hidden border-t border-oro-hondo/35 bg-tinta-hueco">
      <Topografia
        className="pointer-events-none absolute -right-24 -bottom-40 h-[420px] w-[420px]"
        opacidad={0.14}
      />

      <div className="relative mx-auto max-w-[1240px] px-6 py-14 lg:px-12 lg:py-16">
        <p className="font-display text-[clamp(1.9rem,7vw,2.6rem)] leading-[1.05] text-crema">
          Grandes aromas,
          <br />
          <span className="text-oro">pequeñas dosis.</span>
        </p>

        {/* Pegados a la frase y no en la otra punta del pie: los dos enlaces
            son la continuación de "escríbenos", no una barra de servicio. El
            margen negativo alinea el trazo con la G, no la caja de toque. */}
        <nav className="mt-5 -ml-3 flex items-center">
          {REDES.map((red) => (
            <a
              key={red.url}
              href={red.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={red.nombre}
              className="p-3 text-crema-tenue transition-colors duration-150 hover:text-oro"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
                className="h-6 w-6"
              >
                {red.trazo}
              </svg>
            </a>
          ))}
        </nav>

        <div className="mt-12 flex flex-wrap justify-between gap-x-10 gap-y-4 border-t border-oro-hondo/25 pt-6 text-sm text-crema-tenue">
          <p>Isla de Margarita · Envíos a toda Venezuela</p>
          <p className="max-w-[52ch]">
            PureDecants reenvasa fragancias originales. Las marcas mencionadas
            pertenecen a sus respectivos titulares y no patrocinan este sitio.
          </p>
        </div>
      </div>
    </footer>
  );
}
