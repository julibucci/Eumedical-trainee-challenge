import { EumedicalCross } from "../ui/EumedicalCross";

type CrossBadgeProps = {
  size?: number;
  className?: string;
};


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
