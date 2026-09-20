import { EumedicalCross } from "./EumedicalCross";

type EumedicalLogoProps = {
  theme?: "light" | "dark";
  size?: number;
  className?: string;
};

/**
 * Brand Book wordmark (sec. 1.1). Minimum reproduction size: 140x30px
 * — do not use `size` below ~24 in real contexts. The safety area
 * (padding) is computed in em, relative to the width of the "e" in the text itself.
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
