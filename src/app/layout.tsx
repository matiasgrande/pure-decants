import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Archivo } from "next/font/google";
import { ProveedorBandeja } from "@/lib/bandeja";
import { Encabezado } from "@/componentes/Encabezado";
import { Armazon } from "@/componentes/Armazon";
import { PieDePagina } from "@/componentes/PieDePagina";
import { DefsVial } from "@/componentes/Vial";
import { rutaPublica, SITIO } from "@/lib/rutas";
import "./globals.css";

const display = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--fuente-display",
  display: "swap",
});

const texto = Archivo({
  subsets: ["latin"],
  variable: "--fuente-texto",
  display: "swap",
});

export const metadata: Metadata = {
  // De esto dependen las URL absolutas de la vista previa al compartir el
  // enlace. Lo define NEXT_PUBLIC_SITE_URL al construir; con dominio propio,
  // se cambia esa variable.
  metadataBase: new URL(SITIO),
  title: {
    default: "PureDecants — Fragancias originales en 5 y 10 ml",
    template: "%s · PureDecants",
  },
  description:
    "Decants de perfume 100% original en frascos de 5 y 10 ml. Arma tu bandeja y envía el pedido por WhatsApp. Isla de Margarita, envíos a toda Venezuela.",
  openGraph: {
    title: "PureDecants — Grandes aromas, pequeñas dosis",
    description:
      "Perfume original reenvasado en 5 y 10 ml. Arma tu bandeja y envía el pedido por WhatsApp.",
    locale: "es_VE",
    type: "website",
    images: [
      {
        url: rutaPublica("/perfumes/le-male-le-parfum.webp"),
        width: 752,
        height: 1000,
        alt: "Decant de Jean Paul Gaultier Le Male Le Parfum",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-VE" className={`${display.variable} ${texto.variable}`}>
      <body className="min-h-dvh antialiased">
        <ProveedorBandeja>
          <DefsVial />
          <a
            href="#contenido"
            className="etiqueta sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-oro focus:px-4 focus:py-3 focus:text-tinta"
          >
            Saltar al contenido
          </a>
          <Armazon encabezado={<Encabezado />} pie={<PieDePagina />}>
            {children}
          </Armazon>
        </ProveedorBandeja>
      </body>
    </html>
  );
}
