import { familiaDe, type Familia } from "@/lib/acordes";

/**
 * Un dibujo por familia de acorde. Son trazos, no pictogramas literales: la
 * página ya es sobria y un set de emojis de frutas la abarataría.
 * Decorativos: el nombre del acorde va escrito al lado.
 */
const TRAZOS: Record<Familia, React.ReactNode> = {
  citrico: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 4.5v15M4.5 12h15M6.7 6.7l10.6 10.6M17.3 6.7L6.7 17.3" />
    </>
  ),
  acuatico: (
    <path d="M2.5 9c2.4-2.2 4.4-2.2 6.8 0s4.4 2.2 6.8 0 4.4-2.2 5.4-1.2M2.5 15c2.4-2.2 4.4-2.2 6.8 0s4.4 2.2 6.8 0 4.4-2.2 5.4-1.2" />
  ),
  fresco: (
    <path d="M3 7h11a2.6 2.6 0 1 0-2.6-2.6M3 12h15a2.6 2.6 0 1 1-2.6 2.6M3 17h9a2.4 2.4 0 1 1-2.4 2.4" />
  ),
  verde: (
    <>
      <path d="M20 4c0 8.3-4.6 13-11.5 13H5C5 8.7 9.6 4 16.5 4H20Z" />
      <path d="M5 20c2.4-4.6 5.4-7.6 9.5-9.7" />
    </>
  ),
  floral: (
    <>
      <circle cx="12" cy="12" r="2.4" />
      <path d="M12 9.6c0-3.6 1-5.6 3.4-6.1 1 2.3.4 4.4-1.6 6.1M14.4 12c3.6 0 5.6 1 6.1 3.4-2.3 1-4.4.4-6.1-1.6M12 14.4c0 3.6-1 5.6-3.4 6.1-1-2.3-.4-4.4 1.6-6.1M9.6 12c-3.6 0-5.6-1-6.1-3.4 2.3-1 4.4-.4 6.1 1.6" />
    </>
  ),
  lavanda: (
    <>
      <path d="M12 21V11" />
      <path d="M12 3.5c2.2 1.7 3 3.6 2.4 5.7-.6 2-1.4 3.3-2.4 3.9-1-.6-1.8-1.9-2.4-3.9C9 7.1 9.8 5.2 12 3.5Z" />
      <path d="M12 12.8c-2 .6-3.4.2-4.2-1.3M12 16c2-.6 3.4-.2 4.2 1.3" />
    </>
  ),
  afrutado: (
    <>
      <path d="M12 8.4c3.6-2.6 8 0 8 4.6 0 3.9-3.2 7.5-8 7.5s-8-3.6-8-7.5c0-4.6 4.4-7.2 8-4.6Z" />
      <path d="M12 8.4V4.6c2.2-.6 3.6.2 4.2 2.4" />
    </>
  ),
  dulce: (
    <>
      <path d="M4 9.5 12 5l8 4.5v5L12 19l-8-4.5v-5Z" />
      <path d="m4 9.5 8 4.5 8-4.5M12 14v5" />
    </>
  ),
  vainilla: (
    <>
      <path d="M8.6 3.4c-2 5.6-1.4 11.8 1.6 17.2" />
      <path d="M15.6 5c-1.8 4.8-1.4 10 1 14.6" />
      <path d="M8.6 3.4c1.4.6 2.2 1.4 2.4 2.4M15.6 5c1.2.5 1.9 1.2 2.1 2.1" />
    </>
  ),
  nuez: (
    <>
      <path d="M12 3.2c3.4 3 5 6 5 9.1 0 4.4-2.2 8.3-5 8.3s-5-3.9-5-8.3c0-3.1 1.6-6.1 5-9.1Z" />
      <path d="M12 6.4v13" />
    </>
  ),
  talco: (
    <>
      <circle cx="7" cy="8" r="1.1" />
      <circle cx="13" cy="5.5" r="1.1" />
      <circle cx="17.5" cy="10" r="1.1" />
      <circle cx="10" cy="13.5" r="1.1" />
      <circle cx="16" cy="17" r="1.1" />
      <circle cx="6.5" cy="18.5" r="1.1" />
    </>
  ),
  ambar: (
    <>
      <path d="M12 3 19.2 8.4 16.6 20.6H7.4L4.8 8.4 12 3Z" />
      <path d="M4.8 8.4h14.4M12 3v17.6" />
    </>
  ),
  especias: (
    <>
      <path d="M12 2.5 14.4 9l6.6.6-5 4.4 1.6 6.5-5.6-3.6-5.6 3.6L8 14 3 9.6 9.6 9 12 2.5Z" />
    </>
  ),
  madera: (
    <path d="M4.5 4.5c3.6 4.6 3.6 10.4 0 15M9.5 4.5c3.6 4.6 3.6 10.4 0 15M14.5 4.5c3.6 4.6 3.6 10.4 0 15M19.5 4.5c1.4 1.8 2.1 3.7 2.1 5.6" />
  ),
  oud: (
    <>
      <path d="M6 20.5 18 3.5M6 20.5c-1.4-4.6.6-9.6 5.4-13.4M18 3.5c1.4 4.6-.6 9.6-5.4 13.4" />
    </>
  ),
  cuero: (
    <>
      <path d="M12 3.5 20.5 12 12 20.5 3.5 12 12 3.5Z" />
      <path d="M12 6.8 17.2 12 12 17.2 6.8 12 12 6.8Z" strokeDasharray="1.6 1.8" />
    </>
  ),
  tierra: (
    <>
      <path d="M2.5 18c2.8-5.6 5.2-8.4 7.2-8.4s3.2 1.8 3.6 5.4" />
      <path d="M9.5 18c2.6-4.2 4.6-6.3 6-6.3s2.8 2.1 4 6.3" />
      <path d="M2 20.5h20" />
    </>
  ),
  cacao: (
    <>
      <ellipse cx="12" cy="12" rx="5" ry="8.2" transform="rotate(28 12 12)" />
      <path d="M8.4 15.6c1.8-3 4-5.2 7.2-6.8" />
    </>
  ),
  humo: (
    <path d="M9 21c-2.6-2.4-2.6-4.6 0-6.6s2.6-4.2 0-6.6c-2-1.8-2-3.4 0-4.8M15 21c-2.6-2.4-2.6-4.6 0-6.6s2.6-4.2 0-6.6c-2-1.8-2-3.4 0-4.8" />
  ),
};

export function IconoAcorde({
  acorde,
  className = "",
  style,
}: {
  acorde: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
    >
      {TRAZOS[familiaDe(acorde)]}
    </svg>
  );
}
