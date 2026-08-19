import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SelectorFragancia } from "@/componentes/SelectorFragancia";
import { Topografia } from "@/componentes/Topografia";
import { buscarFragancia, fragancias } from "@/lib/catalogo";
import { rutaPublica } from "@/lib/rutas";

export function generateStaticParams() {
  return fragancias.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fragancia = buscarFragancia(slug);
  if (!fragancia) return {};

  return {
    title: `${fragancia.casa} ${fragancia.nombre} en decant de 5 y 10 ml`,
    description: `${fragancia.descripcion} Decant original de ${fragancia.casa} ${fragancia.nombre}, en 5 y 10 ml.`,
    openGraph: { images: [{ url: rutaPublica(fragancia.imagen) }] },
  };
}

export default async function FichaFragancia({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fragancia = buscarFragancia(slug);
  if (!fragancia) notFound();

  const piramide = [
    { titulo: "Salida", notas: fragancia.notas.salida },
    { titulo: "Corazón", notas: fragancia.notas.corazon },
    { titulo: "Fondo", notas: fragancia.notas.fondo },
  ];

  return (
    <article className="relative overflow-hidden">
      <Topografia
        className="pointer-events-none absolute -top-40 -right-32 h-[480px] w-[480px]"
        opacidad={0.12}
      />

      <div className="relative mx-auto max-w-[1240px] px-6 py-10 lg:px-12 lg:py-16">
        <Link
          href="/#muestrario"
          className="etiqueta text-crema-tenue transition-colors duration-150 hover:text-oro"
        >
          ← Volver al muestrario
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="hueco relative aspect-4/5 overflow-hidden border border-oro-hondo/40">
            <Image
              src={rutaPublica(fragancia.imagen)}
              alt={`${fragancia.casa} ${fragancia.nombre}`}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
              priority
            />
          </div>

          <div>
            <p className="grabado text-oro">{fragancia.casa}</p>

            <h1 className="mt-4 font-display text-[clamp(2.2rem,6vw,3.6rem)] leading-[0.95] text-crema">
              {fragancia.nombre}
            </h1>

            <p className="mt-3 text-crema-tenue">
              {fragancia.concentracion} · {fragancia.familia}
            </p>

            <p className="mt-8 max-w-[62ch] leading-relaxed text-crema">
              {fragancia.descripcion}
            </p>

            <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-crema-tenue">
              <span className="text-oro-claro">Cuándo usarlo. </span>
              {fragancia.cuandoUsarlo}
            </p>

            <div className="mt-10">
              <SelectorFragancia fragancia={fragancia} />
            </div>

            <div className="mt-12 border-t border-oro-hondo/30 pt-10">
              <h2 className="font-display text-[clamp(1.6rem,4vw,2.4rem)] leading-tight tracking-[0.02em] text-crema">
                Pirámide olfativa
              </h2>
              <dl className="mt-6 divide-y divide-oro-hondo/25 border-t border-oro-hondo/25">
                {piramide.map((nivel) => (
                  <div
                    key={nivel.titulo}
                    className="grid grid-cols-[104px_1fr] items-baseline gap-4 py-4"
                  >
                    <dt className="grabado text-oro">{nivel.titulo}</dt>
                    <dd className="text-sm text-crema">
                      {nivel.notas.join(" · ")}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
