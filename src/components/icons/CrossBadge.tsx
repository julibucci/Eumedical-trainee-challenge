import { EumedicalCross } from "../ui/EumedicalCross";

type CrossBadgeProps = {
  size?: number;
  className?: string;
};

/**
 * Insignia circular blanca con el símbolo de marca adentro — el acento "cruz" que se repite en
 * los íconos compuestos de capacidades y servicios (nunca un ícono de librería genérico). Sin
 * sombra ni degradado a propósito: el Brand Book pide el símbolo sin efectos.
 */
export function CrossBadge({ size = 11, className = "" }: CrossBadgeProps) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-white ${className}`}
      style={{ width: size + 8, height: size + 8 }}
    >
      <EumedicalCross size={size} />
    </span>
  );
}
