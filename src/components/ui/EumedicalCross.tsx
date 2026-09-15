import {
  EUMEDICAL_CROSS_BARS,
  EUMEDICAL_CROSS_VIEWBOX,
  EUMEDICAL_ORANGE,
} from "../../assets/eumedical-cross";

type EumedicalCrossProps = {
  /** Ancho y alto en px (el símbolo es cuadrado). */
  size?: number;
  /** El Brand Book fija el naranja de marca; solo cambiar para versiones monocromáticas. */
  color?: string;
  className?: string;
};

/**
 * Símbolo suelto de marca: NO es un ícono de librería. Es un asset propio con
 * brazos gruesos y extremos en semicírculo perfecto — ver src/assets/eumedical-cross.ts.
 */
export function EumedicalCross({ size = 24, color = EUMEDICAL_ORANGE, className = "" }: EumedicalCrossProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={EUMEDICAL_CROSS_VIEWBOX}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {EUMEDICAL_CROSS_BARS.map((bar) => (
        <rect key={`${bar.x}-${bar.y}`} {...bar} fill={color} />
      ))}
    </svg>
  );
}
