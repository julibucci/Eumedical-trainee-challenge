import { EumedicalCross } from "./EumedicalCross";

type EumedicalLogoProps = {
  /** "dark" = logo sobre fondo oscuro (texto blanco); el símbolo "+" siempre es naranja. */
  theme?: "light" | "dark";
  /** Tamaño de fuente en px; el símbolo y el espaciado escalan proporcionalmente. */
  size?: number;
  className?: string;
};

/**
 * Wordmark del Brand Book (sec. 1.1). Tamaño mínimo de reproducción: 140x30px
 * — no usar `size` por debajo de ~24 en contextos reales. El área de seguridad
 * (padding) se calcula en em, en relación al ancho de la "e" del propio texto.
 */
export function EumedicalLogo({ theme = "light", size = 24, className = "" }: EumedicalLogoProps) {
  const textColor = theme === "dark" ? "text-white" : "text-brand-dark-blue";
  const crossSize = Math.round(size * 0.6);

  return (
    <span
      className={`inline-flex items-center font-display leading-none ${className}`}
      style={{ padding: `${size * 0.3}px` }}
    >
      <span
        className="mr-[0.05em] inline-flex shrink-0"
        style={{ transform: `translateY(-${size * 0.32}px)` }}
      >
        <EumedicalCross size={crossSize} />
      </span>
      <span className={textColor} style={{ fontSize: size }}>
        eumedical
      </span>
    </span>
  );
}
