import curvas from "./topografia-paths.json";

/**
 * Las líneas de nivel doradas que la marca usa como ornamento en su catálogo.
 * Decorativa: se oculta a lectores de pantalla y nunca va detrás de texto de lectura.
 */
export function Topografia({
  className = "",
  opacidad = 0.16,
}: {
  className?: string;
  opacidad?: number;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ opacity: opacidad }}
    >
      <g fill="none" stroke="var(--color-oro)" strokeWidth="0.9">
        {curvas.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}
