type LogoProps = {
  variant?: "color" | "white" | "dark";
  className?: string;
};

/** Wordmark reconstructed from the Brand Book (sec. 1.1/1.2): the "+" sits above the "e" of "eumedical". */
export function Logo({ variant = "color", className = "" }: LogoProps) {
  const textColor =
    variant === "white"
      ? "text-white"
      : variant === "dark"
        ? "text-black"
        : "text-brand-dark-blue";
  const crossColor = variant === "dark" ? "text-black" : "text-brand-orange";

  return (
    <span
      className={`inline-flex items-start font-display text-2xl leading-none ${textColor} ${className}`}
    >
      <span className={`-mr-0.5 -translate-y-1.5 text-xl ${crossColor}`} aria-hidden="true">
        +
      </span>
      eumedical
    </span>
  );
}
