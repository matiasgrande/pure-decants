"use client";

import { usePathname } from "next/navigation";
import { PanelBandeja } from "@/componentes/PanelBandeja";

/**
 * El sitio público lleva encabezado, pie y la bandeja fija. El panel de
 * administración es una herramienta: se queda con la pantalla entera y sin
 * bandeja, porque el dueño no le arma un pedido a sí mismo.
 */
export function Armazon({
  encabezado,
  pie,
  children,
}: {
  encabezado: React.ReactNode;
  pie: React.ReactNode;
  children: React.ReactNode;
}) {
  const ruta = usePathname();

  if (ruta?.startsWith("/admin")) {
    return <main id="contenido">{children}</main>;
  }

  return (
    <>
      {/* La bandeja es fija: el panel lateral en escritorio y la barra
          inferior en móvil se comen ese espacio, así que todo el documento
          se corre para que nada quede tapado. */}
      <div className="pb-24 lg:pr-[366px] lg:pb-0">
        {encabezado}
        <main id="contenido">{children}</main>
        {pie}
      </div>
      <PanelBandeja />
    </>
  );
}
