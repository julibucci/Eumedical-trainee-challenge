import { EumedicalCross } from "../ui/EumedicalCross";

type CrossBadgeProps = {
  size?: number;
  className?: string;
};

/** Insignia circular blanca con el símbolo de marca adentro — el acento "cruz" que se repite en los íconos compuestos de capacidades y servicios (nunca un ícono de librería genérico). */
export function CrossBadge({ size = 11, className = "" }: CrossBadgeProps) {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-white shadow-sm ${className}`}
      style={{ width: size + 8, height: size + 8 }}
    >
      <EumedicalCross size={size} />
    </span>
  );
}
