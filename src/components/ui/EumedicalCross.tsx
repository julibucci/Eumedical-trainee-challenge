import {
  EUMEDICAL_CROSS_BARS,
  EUMEDICAL_CROSS_VIEWBOX,
  EUMEDICAL_ORANGE,
} from "../../assets/eumedical-cross";

type EumedicalCrossProps = {
  size?: number;
  color?: string;
  className?: string;
};


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
