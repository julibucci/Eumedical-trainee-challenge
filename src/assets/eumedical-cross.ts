/**
 * Geometría del símbolo "Cruz" (Brand Book sec. 2.1): dos barras idénticas
 * (mismo largo y grosor), centradas en (50,50) y rotadas 90° entre sí, con
 * extremos en semicírculo perfecto (rx = mitad del grosor) — los cuatro
 * brazos quedan exactamente iguales, sin asimetrías.
 */
export const EUMEDICAL_CROSS_VIEWBOX = "0 0 100 100";

const ARM_LENGTH = 92;
const ARM_THICKNESS = 28;
const ARM_OFFSET = (100 - ARM_LENGTH) / 2;
const THICKNESS_OFFSET = (100 - ARM_THICKNESS) / 2;

export const EUMEDICAL_CROSS_BARS = [
  { x: ARM_OFFSET, y: THICKNESS_OFFSET, width: ARM_LENGTH, height: ARM_THICKNESS, rx: ARM_THICKNESS / 2 }, // brazo horizontal
  { x: THICKNESS_OFFSET, y: ARM_OFFSET, width: ARM_THICKNESS, height: ARM_LENGTH, rx: ARM_THICKNESS / 2 }, // brazo vertical
] as const;

export const EUMEDICAL_ORANGE = "#e79f1a";
