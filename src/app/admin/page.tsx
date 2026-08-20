import type { Metadata } from "next";
import { EditorCatalogo } from "@/componentes/EditorCatalogo";

export const metadata: Metadata = {
  title: "Panel del muestrario",
  // Es una herramienta interna: no tiene por qué salir en buscadores.
  robots: { index: false, follow: false },
};

export default function Admin() {
  return <EditorCatalogo />;
}
