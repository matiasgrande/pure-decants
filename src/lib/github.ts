/**
 * Puente entre el panel de administración y el repositorio.
 *
 * El sitio es estático y no tiene servidor propio, así que los cambios del
 * dueño se guardan como un commit en GitHub: el flujo de Actions reconstruye y
 * publica solo. El token lo pega él y vive en su navegador, nunca en el código.
 */

export const REPO = process.env.NEXT_PUBLIC_REPO ?? "matiasgrande/pure-decants";
export const RAMA = "main";
export const RUTA_CATALOGO = "src/datos/fragancias.json";
export const CARPETA_FOTOS = "public/perfumes";

const API = "https://api.github.com";
export const CLAVE_TOKEN = "puredecants:admin:token";

async function llamar(
  ruta: string,
  token: string,
  init: RequestInit = {},
): Promise<Response> {
  return fetch(`${API}${ruta}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
}

async function fallar(respuesta: Response, queHacia: string): Promise<never> {
  let detalle = respuesta.statusText;
  try {
    const cuerpo = await respuesta.json();
    if (cuerpo?.message) detalle = cuerpo.message;
  } catch {
    // Respuesta sin JSON: queda el statusText.
  }

  if (respuesta.status === 401) {
    throw new Error("El token no es válido o venció. Vuelve a entrar con uno nuevo.");
  }
  if (respuesta.status === 403) {
    throw new Error(
      `GitHub rechazó el permiso al ${queHacia}. Revisa que el token tenga Contents con permiso de lectura y escritura sobre ${REPO}.`,
    );
  }
  if (respuesta.status === 409) {
    throw new Error(
      "Alguien más guardó cambios mientras editabas. Recarga la página para traer la versión nueva.",
    );
  }
  throw new Error(`No se pudo ${queHacia}: ${detalle}`);
}

/** GitHub devuelve base64 con saltos de línea, y el catálogo tiene acentos. */
function desdeBase64(base64: string): string {
  const binario = atob(base64.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binario, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function aBase64(bytes: Uint8Array): string {
  let binario = "";
  for (const byte of bytes) binario += String.fromCharCode(byte);
  return btoa(binario);
}

function textoABase64(texto: string): string {
  return aBase64(new TextEncoder().encode(texto));
}

export type CatalogoRemoto = {
  /** Contenido del JSON tal como está publicado. */
  datos: Record<string, unknown>;
  /** Identificador de la versión: GitHub lo exige para no pisar cambios ajenos. */
  sha: string;
};

/** Confirma que el token abre el repositorio, antes de mostrar el editor. */
export async function verificarAcceso(token: string): Promise<void> {
  const respuesta = await llamar(`/repos/${REPO}`, token);
  if (!respuesta.ok) await fallar(respuesta, "abrir el repositorio");
}

export async function leerCatalogo(token: string): Promise<CatalogoRemoto> {
  const respuesta = await llamar(
    `/repos/${REPO}/contents/${RUTA_CATALOGO}?ref=${RAMA}`,
    token,
  );
  if (!respuesta.ok) await fallar(respuesta, "leer el catálogo");

  const cuerpo = await respuesta.json();
  return { datos: JSON.parse(desdeBase64(cuerpo.content)), sha: cuerpo.sha };
}

export async function guardarCatalogo(
  token: string,
  datos: unknown,
  sha: string,
  mensaje: string,
): Promise<string> {
  const respuesta = await llamar(
    `/repos/${REPO}/contents/${RUTA_CATALOGO}`,
    token,
    {
      method: "PUT",
      body: JSON.stringify({
        message: mensaje,
        content: textoABase64(JSON.stringify(datos, null, 2) + "\n"),
        sha,
        branch: RAMA,
      }),
    },
  );
  if (!respuesta.ok) await fallar(respuesta, "guardar el catálogo");

  const cuerpo = await respuesta.json();
  const nuevoSha = cuerpo?.content?.sha;
  if (typeof nuevoSha !== "string") {
    throw new Error(
      "GitHub aceptó el cambio pero no devolvió la versión nueva. Recarga la página antes de seguir editando.",
    );
  }
  return nuevoSha;
}

/** Devuelve el sha del archivo si ya existe, para poder reemplazarlo. */
async function shaDe(token: string, ruta: string): Promise<string | undefined> {
  const respuesta = await llamar(
    `/repos/${REPO}/contents/${ruta}?ref=${RAMA}`,
    token,
  );
  if (respuesta.status === 404) return undefined;
  if (!respuesta.ok) await fallar(respuesta, "revisar la foto");
  return (await respuesta.json()).sha as string;
}

/** Sube la foto de un frasco y devuelve la ruta pública que va en el catálogo. */
export async function subirFoto(
  token: string,
  slug: string,
  archivo: File,
): Promise<string> {
  const extension = archivo.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const nombre = `${slug}.${extension}`;
  const ruta = `${CARPETA_FOTOS}/${nombre}`;
  const bytes = new Uint8Array(await archivo.arrayBuffer());
  const sha = await shaDe(token, ruta);

  const respuesta = await llamar(`/repos/${REPO}/contents/${ruta}`, token, {
    method: "PUT",
    body: JSON.stringify({
      message: `chore: foto de ${slug}`,
      content: aBase64(bytes),
      branch: RAMA,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!respuesta.ok) await fallar(respuesta, "subir la foto");

  return `/perfumes/${nombre}`;
}
