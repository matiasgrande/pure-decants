"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CLAVE_TOKEN,
  leerCatalogo,
  guardarCatalogo,
  REPO,
  subirFoto,
  urlFotoEnRepo,
  verificarAcceso,
} from "@/lib/github";
import { armarSlug, atomizaciones, type Fragancia } from "@/lib/catalogo";

type Catalogo = {
  moneda: string;
  nota?: string;
  fragancias: Fragancia[];
};

const MEDIDAS_NUEVAS = [
  { ml: 5, precio: 0, disponible: true },
  { ml: 10, precio: 0, disponible: true },
];

/** Las casillas y las fichas recortan a 4:5, así que la foto se guarda ya recortada. */
const ANCHO_FOTO = 800;
const ALTO_FOTO = 1000;

/**
 * Deja cualquier foto del teléfono en un webp de 800×1000 de unos 60 KB.
 * Sin esto, una foto de 4 MB entraría tal cual al repositorio y la casilla la
 * recortaría igual, pero el visitante la pagaría en datos móviles.
 */
async function prepararFoto(
  archivo: File,
): Promise<{ bytes: Uint8Array; extension: string }> {
  // Sin `imageOrientation`, una foto vertical del teléfono entra acostada.
  const bitmap = await createImageBitmap(archivo, {
    imageOrientation: "from-image",
  });
  const escala = Math.max(ANCHO_FOTO / bitmap.width, ALTO_FOTO / bitmap.height);
  const ancho = bitmap.width * escala;
  const alto = bitmap.height * escala;

  const lienzo = document.createElement("canvas");
  lienzo.width = ANCHO_FOTO;
  lienzo.height = ALTO_FOTO;
  const pincel = lienzo.getContext("2d");
  if (!pincel) throw new Error("Este navegador no puede procesar la foto.");
  pincel.drawImage(
    bitmap,
    (ANCHO_FOTO - ancho) / 2,
    (ALTO_FOTO - alto) / 2,
    ancho,
    alto,
  );
  bitmap.close();

  // Safari viejo ignora el webp y devuelve un PNG, que pesa diez veces más.
  // Si eso pasa, se cae a jpeg, que sí sabe comprimir en todos lados.
  let blob = await new Promise<Blob | null>((r) =>
    lienzo.toBlob(r, "image/webp", 0.8),
  );
  let extension = "webp";
  if (!blob || blob.type !== "image/webp") {
    blob = await new Promise<Blob | null>((r) =>
      lienzo.toBlob(r, "image/jpeg", 0.85),
    );
    extension = "jpg";
  }
  if (!blob) throw new Error("No se pudo convertir la foto.");
  return { bytes: new Uint8Array(await blob.arrayBuffer()), extension };
}

export function EditorCatalogo() {
  const [token, setToken] = useState("");
  const [entrando, setEntrando] = useState(false);
  const [catalogo, setCatalogo] = useState<Catalogo | null>(null);
  const [original, setOriginal] = useState("");
  const [sha, setSha] = useState("");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [abierta, setAbierta] = useState<string | null>(null);

  // Si ya entró antes en este dispositivo, no se le vuelve a pedir el token.
  useEffect(() => {
    const guardado = localStorage.getItem(CLAVE_TOKEN);
    if (guardado) entrar(guardado);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cambiado = catalogo ? JSON.stringify(catalogo) !== original : false;

  // Salir de la pestaña con cambios sin publicar sería perderlos.
  useEffect(() => {
    if (!cambiado) return;
    const avisar = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [cambiado]);

  async function entrar(clave: string) {
    setEntrando(true);
    setError("");
    try {
      await verificarAcceso(clave);
      const remoto = await leerCatalogo(clave);
      const datos = remoto.datos as unknown as Catalogo;
      setCatalogo(datos);
      setOriginal(JSON.stringify(datos));
      setSha(remoto.sha);
      setToken(clave);
      localStorage.setItem(CLAVE_TOKEN, clave);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      localStorage.removeItem(CLAVE_TOKEN);
    } finally {
      setEntrando(false);
    }
  }

  function salir() {
    if (cambiado && !confirm("Tienes cambios sin publicar. ¿Salir igual?")) return;
    localStorage.removeItem(CLAVE_TOKEN);
    setToken("");
    setCatalogo(null);
    setOriginal("");
  }

  function editar(slug: string, cambio: Partial<Fragancia>) {
    setCatalogo((c) =>
      c
        ? {
            ...c,
            fragancias: c.fragancias.map((f) =>
              f.slug === slug ? { ...f, ...cambio } : f,
            ),
          }
        : c,
    );
  }

  function editarMedida(
    slug: string,
    ml: number,
    cambio: { precio?: number; disponible?: boolean },
  ) {
    setCatalogo((c) =>
      c
        ? {
            ...c,
            fragancias: c.fragancias.map((f) =>
              f.slug === slug
                ? {
                    ...f,
                    medidas: f.medidas.map((m) =>
                      m.ml === ml ? { ...m, ...cambio } : m,
                    ),
                  }
                : f,
            ),
          }
        : c,
    );
  }

  function agregar() {
    if (!catalogo) return;
    const slug = `fragancia-${Date.now()}`;
    const nueva: Fragancia = {
      slug,
      casa: "",
      nombre: "",
      acordes: [],
      imagen: null,
      medidas: MEDIDAS_NUEVAS.map((m) => ({ ...m })),
    };
    setCatalogo({ ...catalogo, fragancias: [nueva, ...catalogo.fragancias] });
    setAbierta(slug);
    setFiltro("");
  }

  function eliminar(fragancia: Fragancia) {
    if (!catalogo) return;
    const nombre = `${fragancia.casa} ${fragancia.nombre}`.trim() || "esta fragancia";
    if (!confirm(`¿Quitar ${nombre} del muestrario?`)) return;
    setCatalogo({
      ...catalogo,
      fragancias: catalogo.fragancias.filter((f) => f.slug !== fragancia.slug),
    });
  }

  /** El slug es la dirección de la ficha: se recalcula mientras la fragancia es nueva. */
  function renombrar(fragancia: Fragancia, cambio: Partial<Fragancia>) {
    const esNueva = fragancia.slug.startsWith("fragancia-");
    const combinada = { ...fragancia, ...cambio };
    if (!esNueva) return editar(fragancia.slug, cambio);

    const nuevoSlug = armarSlug(combinada.nombre, combinada.casa);
    const libre =
      nuevoSlug &&
      !catalogo?.fragancias.some(
        (f) => f.slug === nuevoSlug && f.slug !== fragancia.slug,
      );
    editar(fragancia.slug, { ...cambio, ...(libre ? { slug: nuevoSlug } : {}) });
    if (libre && abierta === fragancia.slug) setAbierta(nuevoSlug);
  }

  async function ponerFoto(fragancia: Fragancia, archivo: File) {
    if (!fragancia.casa.trim() || !fragancia.nombre.trim()) {
      setError("Ponle casa y nombre antes de subir la foto: el nombre del archivo sale de ahí.");
      return;
    }
    setAviso(`Preparando la foto de ${fragancia.nombre}…`);
    setError("");
    try {
      const { bytes, extension } = await prepararFoto(archivo);
      const ruta = await subirFoto(token, fragancia.slug, bytes, extension);
      editar(fragancia.slug, { imagen: ruta });
      setAviso("Foto subida. Falta publicar los cambios para que se vea en el sitio.");
    } catch (e) {
      setAviso("");
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  function mover(fragancia: Fragancia, paso: -1 | 1) {
    if (!catalogo) return;
    const lista = [...catalogo.fragancias];
    const i = lista.findIndex((f) => f.slug === fragancia.slug);
    const j = i + paso;
    if (i < 0 || j < 0 || j >= lista.length) return;
    [lista[i], lista[j]] = [lista[j], lista[i]];
    setCatalogo({ ...catalogo, fragancias: lista });
  }

  function agregarMedida(fragancia: Fragancia) {
    const mayor = Math.max(0, ...fragancia.medidas.map((m) => m.ml));
    editar(fragancia.slug, {
      medidas: [
        ...fragancia.medidas,
        { ml: mayor + 5, precio: 0, disponible: true },
      ],
    });
  }

  function quitarMedida(fragancia: Fragancia, ml: number) {
    if (fragancia.medidas.length <= 1) {
      setError("Cada fragancia necesita al menos una medida.");
      return;
    }
    editar(fragancia.slug, {
      medidas: fragancia.medidas.filter((m) => m.ml !== ml),
    });
  }

  function cambiarMl(fragancia: Fragancia, viejo: number, nuevo: number) {
    editar(fragancia.slug, {
      medidas: fragancia.medidas.map((m) =>
        m.ml === viejo ? { ...m, ml: nuevo } : m,
      ),
    });
  }

  function revisar(c: Catalogo): string | null {
    const slugs = new Set<string>();
    for (const f of c.fragancias) {
      const donde = `${f.casa} ${f.nombre}`.trim() || "una fragancia sin nombre";
      if (!f.nombre.trim() || !f.casa.trim())
        return `Falta la casa o el nombre en ${donde}.`;
      if (f.acordes.length === 0) return `${donde} no tiene ningún acorde cargado.`;
      if (f.medidas.some((m) => !Number.isFinite(m.precio) || m.precio < 0))
        return `Hay un precio inválido en ${donde}.`;
      if (f.medidas.length === 0) return `${donde} se quedó sin medidas.`;
      if (f.medidas.some((m) => !Number.isFinite(m.ml) || m.ml <= 0))
        return `Hay una medida sin mililitros en ${donde}.`;
      if (new Set(f.medidas.map((m) => m.ml)).size !== f.medidas.length)
        return `${donde} tiene dos veces la misma medida.`;
      if (slugs.has(f.slug)) return `${donde} está repetida en el muestrario.`;
      slugs.add(f.slug);
    }
    return null;
  }

  async function publicar() {
    if (!catalogo) return;
    const problema = revisar(catalogo);
    if (problema) {
      setError(problema);
      setAviso("");
      return;
    }

    setGuardando(true);
    setError("");
    setAviso("");
    try {
      const nuevoSha = await guardarCatalogo(
        token,
        catalogo,
        sha,
        "chore: actualizar el muestrario desde el panel",
      );
      setSha(nuevoSha);
      setOriginal(JSON.stringify(catalogo));
      setAviso(
        "Publicado. El sitio se reconstruye solo: en un par de minutos se ve el cambio.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setGuardando(false);
    }
  }

  const visibles = useMemo(() => {
    if (!catalogo) return [];
    const busqueda = filtro.trim().toLowerCase();
    if (!busqueda) return catalogo.fragancias;
    return catalogo.fragancias.filter((f) =>
      `${f.casa} ${f.nombre} ${f.acordes.join(" ")}`
        .toLowerCase()
        .includes(busqueda),
    );
  }, [catalogo, filtro]);

  if (!catalogo) {
    return (
      <Acceso
        entrando={entrando}
        error={error}
        onEntrar={(clave) => entrar(clave)}
      />
    );
  }

  const agotadas = catalogo.fragancias.filter((f) =>
    f.medidas.every((m) => !m.disponible),
  ).length;
  const sinPrecio = catalogo.fragancias.filter((f) =>
    f.medidas.some((m) => m.precio === 0),
  ).length;

  return (
    <div className="min-h-dvh bg-tinta">
      <header className="sticky top-0 z-20 border-b border-oro-hondo/35 bg-tinta/95 backdrop-blur-[2px]">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
          <div className="w-full sm:mr-auto sm:w-auto">
            <p className="grabado text-crema">
              Pure<span className="text-oro">Decants</span> · Panel
            </p>
            <p className="cifras mt-1 text-xs text-crema-tenue">
              {catalogo.fragancias.length} fragancias · {sinPrecio} sin precio ·{" "}
              {agotadas} agotadas
            </p>
          </div>

          <button
            type="button"
            onClick={salir}
            className="etiqueta flex-1 border border-oro-hondo px-4 py-3 sm:flex-none text-crema-tenue transition-colors duration-150 hover:border-oro hover:text-crema"
          >
            Salir
          </button>

          <button
            type="button"
            onClick={publicar}
            disabled={!cambiado || guardando}
            className="etiqueta flex-1 border px-5 py-3 transition-colors duration-150 disabled:cursor-not-allowed sm:flex-none"
            style={{
              backgroundColor: cambiado && !guardando ? "var(--color-oro)" : "transparent",
              borderColor:
                cambiado && !guardando ? "var(--color-oro)" : "var(--color-oro-hondo)",
              color:
                cambiado && !guardando ? "var(--color-tinta)" : "var(--color-crema-tenue)",
            }}
          >
            {guardando ? "Publicando…" : cambiado ? "Publicar cambios" : "Todo publicado"}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
        {error && (
          <p
            role="alert"
            className="mb-6 border px-4 py-3 text-sm"
            style={{ borderColor: "var(--color-aviso)", color: "var(--color-aviso)" }}
          >
            {error}
          </p>
        )}
        {aviso && (
          <p
            role="status"
            className="mb-6 border border-oro-hondo px-4 py-3 text-sm text-oro-claro"
          >
            {aviso}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex-1">
            <span className="sr-only">Buscar en el muestrario</span>
            <input
              type="search"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Buscar por casa, nombre o acorde"
              className="w-full border border-oro-hondo bg-tinta-alta px-4 py-3 text-crema placeholder:text-crema-tenue"
            />
          </label>
          <button
            type="button"
            onClick={agregar}
            className="etiqueta border border-oro px-5 py-3 text-oro transition-colors duration-150 hover:bg-oro hover:text-tinta"
          >
            Agregar fragancia
          </button>
        </div>

        <ul className="mt-6 border-t border-oro-hondo/30">
          {visibles.map((fragancia, i) => (
            <Fila
              key={fragancia.slug}
              fragancia={fragancia}
              abierta={abierta === fragancia.slug}
              // Reordenar con la lista filtrada movería la fragancia a un lugar
              // que no es el que se ve. Con filtro puesto, se desactiva.
              orden={
                filtro.trim()
                  ? null
                  : { primera: i === 0, ultima: i === visibles.length - 1 }
              }
              onMover={(paso) => mover(fragancia, paso)}
              onAbrir={() =>
                setAbierta(abierta === fragancia.slug ? null : fragancia.slug)
              }
              onEditar={(cambio) => renombrar(fragancia, cambio)}
              onEditarMedida={(ml, cambio) => editarMedida(fragancia.slug, ml, cambio)}
              onCambiarMl={(viejo, nuevo) => cambiarMl(fragancia, viejo, nuevo)}
              onAgregarMedida={() => agregarMedida(fragancia)}
              onQuitarMedida={(ml) => quitarMedida(fragancia, ml)}
              onFoto={(archivo) => ponerFoto(fragancia, archivo)}
              onQuitarFoto={() => editar(fragancia.slug, { imagen: null })}
              onEliminar={() => eliminar(fragancia)}
            />
          ))}
        </ul>

        {visibles.length === 0 && (
          <p className="mt-8 text-crema-tenue">
            Ninguna fragancia coincide con «{filtro}».
          </p>
        )}
      </div>
    </div>
  );
}

function Fila({
  fragancia,
  abierta,
  orden,
  onMover,
  onAbrir,
  onEditar,
  onEditarMedida,
  onCambiarMl,
  onAgregarMedida,
  onQuitarMedida,
  onFoto,
  onQuitarFoto,
  onEliminar,
}: {
  fragancia: Fragancia;
  abierta: boolean;
  orden: { primera: boolean; ultima: boolean } | null;
  onMover: (paso: -1 | 1) => void;
  onAbrir: () => void;
  onEditar: (cambio: Partial<Fragancia>) => void;
  onEditarMedida: (ml: number, cambio: { precio?: number; disponible?: boolean }) => void;
  onCambiarMl: (viejo: number, nuevo: number) => void;
  onAgregarMedida: () => void;
  onQuitarMedida: (ml: number) => void;
  onFoto: (archivo: File) => void;
  onQuitarFoto: () => void;
  onEliminar: () => void;
}) {
  const titulo = `${fragancia.casa} ${fragancia.nombre}`.trim() || "Fragancia nueva";

  return (
    <li className="border-b border-oro-hondo/30 py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start">
        <div className="min-w-0 sm:min-w-[12rem] sm:flex-1">
          <p className="font-display text-xl leading-tight text-crema">{titulo}</p>
          <p className="mt-1 text-xs text-crema-tenue">
            {fragancia.acordes.slice(0, 3).join(" · ") || "Sin acordes"}
            {!fragancia.imagen && " · sin foto"}
          </p>
        </div>

        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          {fragancia.medidas.map((medida) => (
            <div
              key={medida.ml}
              className="flex w-full items-center justify-between gap-2 border border-oro-hondo/60 px-3 py-2 sm:w-auto sm:justify-start"
              style={{ opacity: medida.disponible ? 1 : 0.5 }}
            >
              <span className="etiqueta cifras text-crema-tenue">{medida.ml} ml</span>
              <label className="flex items-center gap-1">
                <span className="sr-only">
                  Precio de {medida.ml} ml de {titulo}
                </span>
                <span className="cifras text-crema-tenue">$</span>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={medida.precio || ""}
                  placeholder="0"
                  onChange={(e) =>
                    onEditarMedida(medida.ml, { precio: Number(e.target.value) || 0 })
                  }
                  className="cifras w-16 border-b border-oro-hondo bg-transparent py-1 text-crema"
                />
              </label>
              <label className="etiqueta flex cursor-pointer items-center gap-2 text-crema-tenue">
                <input
                  type="checkbox"
                  checked={medida.disponible}
                  onChange={(e) =>
                    onEditarMedida(medida.ml, { disponible: e.target.checked })
                  }
                  className="size-4 accent-[var(--color-oro)]"
                />
                Hay
              </label>
            </div>
          ))}

          {orden && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onMover(-1)}
                disabled={orden.primera}
                aria-label={`Subir ${titulo} en el muestrario`}
                className="border border-oro-hondo px-3 py-2 text-crema-tenue transition-colors duration-150 hover:border-oro hover:text-crema disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => onMover(1)}
                disabled={orden.ultima}
                aria-label={`Bajar ${titulo} en el muestrario`}
                className="border border-oro-hondo px-3 py-2 text-crema-tenue transition-colors duration-150 hover:border-oro hover:text-crema disabled:opacity-30"
              >
                ↓
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onAbrir}
            aria-expanded={abierta}
            className="etiqueta w-full border border-oro-hondo px-4 py-2 text-crema-tenue transition-colors duration-150 hover:border-oro hover:text-crema sm:w-auto"
          >
            {abierta ? "Cerrar" : "Editar"}
          </button>
        </div>
      </div>

      {abierta && (
        <div className="mt-6 grid gap-4 border-l border-oro-hondo/40 pl-4 sm:grid-cols-2">
          <Campo
            etiqueta="Casa"
            valor={fragancia.casa}
            onCambio={(v) => onEditar({ casa: v })}
          />
          <Campo
            etiqueta="Nombre"
            valor={fragancia.nombre}
            onCambio={(v) => onEditar({ nombre: v })}
          />
          <Campo
            etiqueta="Concentración (opcional)"
            valor={fragancia.concentracion ?? ""}
            onCambio={(v) => onEditar({ concentracion: v || undefined })}
          />
          <Campo
            etiqueta="Acordes, separados por coma"
            valor={fragancia.acordes.join(", ")}
            onCambio={(v) =>
              onEditar({
                acordes: v
                  .split(",")
                  .map((a) => a.trim())
                  .filter(Boolean),
              })
            }
          />
          <Campo
            etiqueta="Descripción (opcional)"
            valor={fragancia.descripcion ?? ""}
            largo
            onCambio={(v) => onEditar({ descripcion: v || undefined })}
          />
          <Campo
            etiqueta="Cuándo usarlo (opcional)"
            valor={fragancia.cuandoUsarlo ?? ""}
            largo
            onCambio={(v) => onEditar({ cuandoUsarlo: v || undefined })}
          />

          <fieldset className="sm:col-span-2">
            <legend className="etiqueta text-crema-tenue">Medidas</legend>
            <p className="mt-2 text-xs text-crema-tenue">
              Los mililitros de cada decant. El precio y el stock se cargan arriba.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {fragancia.medidas.map((medida) => (
                <div
                  key={medida.ml}
                  className="flex items-center gap-2 border border-oro-hondo/60 px-3 py-2"
                >
                  <label className="flex items-center gap-2">
                    <span className="sr-only">Mililitros de esta medida</span>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={medida.ml}
                      onChange={(e) =>
                        onCambiarMl(medida.ml, Number(e.target.value) || medida.ml)
                      }
                      className="cifras w-14 border-b border-oro-hondo bg-transparent py-1 text-crema"
                    />
                    <span className="etiqueta text-crema-tenue">ml</span>
                  </label>
                  <span className="cifras text-xs text-crema-tenue">
                    ≈ {atomizaciones(medida.ml)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onQuitarMedida(medida.ml)}
                    aria-label={`Quitar la medida de ${medida.ml} ml`}
                    className="text-crema-tenue transition-colors duration-150 hover:text-[var(--color-aviso)]"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={onAgregarMedida}
                className="etiqueta border border-oro-hondo px-4 py-2 text-crema-tenue transition-colors duration-150 hover:border-oro hover:text-crema"
              >
                Agregar medida
              </button>
            </div>
          </fieldset>

          <div className="sm:col-span-2">
            <p className="etiqueta text-crema-tenue">Foto del frasco</p>
            <div className="mt-3 flex flex-wrap items-start gap-5">
              <div className="hueco flex h-[150px] w-[120px] shrink-0 items-center justify-center overflow-hidden border border-oro-hondo/40">
                {fragancia.imagen ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={urlFotoEnRepo(fragancia.imagen)}
                    alt={`Foto actual de ${titulo}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="etiqueta px-2 text-center text-crema-tenue">
                    Sin foto
                  </span>
                )}
              </div>

              <div className="min-w-[14rem] flex-1">
                <p className="text-xs leading-relaxed text-crema-tenue">
                  {fragancia.imagen
                    ? "Sube otra para reemplazarla."
                    : "Sin foto, la ficha muestra el vial dibujado."}{" "}
                  Se recorta al centro en vertical y se reduce sola: puedes subir
                  la foto tal como salió del teléfono.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const archivo = e.target.files?.[0];
                    if (archivo) onFoto(archivo);
                    e.target.value = "";
                  }}
                  className="mt-3 block w-full text-sm text-crema-tenue file:mr-4 file:border file:border-oro-hondo file:bg-transparent file:px-4 file:py-2 file:text-crema"
                />
                {fragancia.imagen && (
                  <button
                    type="button"
                    onClick={onQuitarFoto}
                    className="etiqueta mt-3 border border-oro-hondo px-4 py-2 text-crema-tenue transition-colors duration-150 hover:border-oro hover:text-crema"
                  >
                    Quitar la foto
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 sm:col-span-2">
            <p className="cifras text-xs text-crema-tenue">/fragancia/{fragancia.slug}/</p>
            <button
              type="button"
              onClick={onEliminar}
              className="etiqueta border px-4 py-2 transition-colors duration-150"
              style={{ borderColor: "var(--color-aviso)", color: "var(--color-aviso)" }}
            >
              Quitar del muestrario
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

function Campo({
  etiqueta,
  valor,
  onCambio,
  largo = false,
}: {
  etiqueta: string;
  valor: string;
  onCambio: (valor: string) => void;
  largo?: boolean;
}) {
  const clases =
    "mt-2 w-full border border-oro-hondo bg-tinta-alta px-3 py-2 text-crema";
  return (
    <label className="block">
      <span className="etiqueta text-crema-tenue">{etiqueta}</span>
      {largo ? (
        <textarea
          rows={3}
          value={valor}
          onChange={(e) => onCambio(e.target.value)}
          className={`${clases} leading-relaxed`}
        />
      ) : (
        <input
          type="text"
          value={valor}
          onChange={(e) => onCambio(e.target.value)}
          className={clases}
        />
      )}
    </label>
  );
}

function Acceso({
  entrando,
  error,
  onEntrar,
}: {
  entrando: boolean;
  error: string;
  onEntrar: (clave: string) => void;
}) {
  const [clave, setClave] = useState("");

  return (
    <div className="mx-auto flex min-h-dvh max-w-[34rem] flex-col justify-center px-6 py-16">
      <p className="grabado text-oro">PureDecants · Panel</p>
      <h1 className="mt-5 font-display text-[clamp(2rem,7vw,3rem)] leading-[1] text-crema">
        Entra para editar el muestrario.
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (clave.trim()) onEntrar(clave.trim());
        }}
        className="mt-10"
      >
        <label className="block">
          <span className="etiqueta text-crema-tenue">Token de GitHub</span>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            autoComplete="off"
            placeholder="github_pat_…"
            className="mt-2 w-full border border-oro-hondo bg-tinta-alta px-4 py-3 text-crema placeholder:text-crema-tenue"
          />
        </label>

        {error && (
          <p
            role="alert"
            className="mt-4 border px-4 py-3 text-sm"
            style={{ borderColor: "var(--color-aviso)", color: "var(--color-aviso)" }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={entrando || !clave.trim()}
          className="etiqueta mt-6 w-full border border-oro bg-oro px-6 py-4 text-tinta transition-colors duration-150 hover:bg-oro-claro disabled:cursor-not-allowed disabled:opacity-50"
        >
          {entrando ? "Verificando…" : "Entrar"}
        </button>
      </form>

      <div className="mt-10 border-t border-oro-hondo/40 pt-6 text-sm leading-relaxed text-crema-tenue">
        <p>
          El token se crea una sola vez en{" "}
          <a
            href="https://github.com/settings/personal-access-tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-oro underline underline-offset-4"
          >
            github.com/settings/personal-access-tokens
          </a>
          : token de acceso fino, solo sobre el repositorio{" "}
          <span className="text-crema">{REPO}</span>, con el permiso{" "}
          <span className="text-crema">Contents</span> en lectura y escritura.
        </p>
        <p className="mt-3">
          Queda guardado en este navegador para no volver a pedirlo. Si usas una
          computadora prestada, sal con el botón «Salir» al terminar.
        </p>
      </div>
    </div>
  );
}
