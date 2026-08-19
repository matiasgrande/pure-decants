/**
 * Silueta de un decant: atomizador, hombro y cuerpo de vidrio con su etiqueta.
 * Es un dibujo, no una foto: representa el frasco chico sin fingir una imagen real.
 *
 * Los gradientes y el recorte viven una sola vez en <DefsVial />, montado en el
 * layout. Definirlos dentro de cada vial repetiría los mismos id por toda la página.
 */
export function Vial({
  className = "",
  lleno = 0.72,
}: {
  className?: string;
  /** Cuánto líquido muestra el vial, de 0 a 1. */
  lleno?: number;
}) {
  const base = 92;
  const tope = 26;
  const nivel = base - (base - tope) * Math.min(Math.max(lleno, 0), 1);

  return (
    <svg
      viewBox="0 0 34 100"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* atomizador */}
      <rect x="14" y="1" width="6" height="7" rx="1" fill="#e6d2a4" />
      <rect x="12.5" y="8" width="9" height="6" rx="1" fill="#c9a45c" />
      {/* cuello */}
      <rect x="14.5" y="14" width="5" height="4" fill="#7a5f2e" />
      {/* hombro */}
      <path d="M9 20 L13 17.6 H21 L25 20 Z" fill="#8d7a52" opacity="0.75" />

      {/* líquido */}
      <g clipPath="url(#pdCuerpoVial)">
        <rect x="7" y={nivel} width="20" height={base - nivel} fill="url(#pdLiquidoVial)" />
        {lleno > 0 && (
          <ellipse cx="17" cy={nivel} rx="10" ry="1.6" fill="#f2ece0" opacity="0.35" />
        )}
      </g>

      {/* vidrio */}
      <rect
        x="7"
        y="20"
        width="20"
        height="72"
        rx="2.5"
        fill="url(#pdVidrioVial)"
        stroke="#d8cdb8"
        strokeOpacity="0.5"
        strokeWidth="0.9"
      />

      {/* reflejo */}
      <rect x="10" y="25" width="1.6" height="58" rx="0.8" fill="#fff" opacity="0.28" />

      {/* etiqueta */}
      <g clipPath="url(#pdCuerpoVial)">
        <rect x="7" y="60" width="20" height="13" fill="#f2ece0" opacity="0.82" />
        <line x1="10.5" y1="64" x2="23.5" y2="64" stroke="#7a5f2e" strokeWidth="1" />
        <line x1="10.5" y1="68" x2="19.5" y2="68" stroke="#0a0a0b" strokeWidth="0.7" opacity="0.5" />
        <line x1="10.5" y1="70.8" x2="21.5" y2="70.8" stroke="#0a0a0b" strokeWidth="0.7" opacity="0.3" />
      </g>

      {/* base */}
      <rect x="7" y="90" width="20" height="2" fill="#050506" opacity="0.6" />
    </svg>
  );
}

/** Definiciones compartidas por todos los viales de la página. */
export function DefsVial() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
      <defs>
        <linearGradient id="pdVidrioVial" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d8cdb8" stopOpacity="0.5" />
          <stop offset="0.22" stopColor="#d8cdb8" stopOpacity="0.12" />
          <stop offset="0.68" stopColor="#d8cdb8" stopOpacity="0.16" />
          <stop offset="1" stopColor="#d8cdb8" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="pdLiquidoVial" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9a45c" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#e6d2a4" stopOpacity="0.75" />
          <stop offset="1" stopColor="#7a5f2e" stopOpacity="0.95" />
        </linearGradient>
        <clipPath id="pdCuerpoVial">
          <rect x="7" y="20" width="20" height="72" rx="2.5" />
        </clipPath>
      </defs>
    </svg>
  );
}
