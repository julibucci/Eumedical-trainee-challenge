/**
 * Geometría del símbolo "Cruz" (Brand Book sec. 2.1). Dos barras con extremos
 * en semicírculo perfecto (rx = mitad del lado corto); el brazo superior es
 * más corto que el resto, replicando la construcción asimétrica del manual
 * (no es un "+" tipográfico centrado).
 */
export const EUMEDICAL_CROSS_VIEWBOX = "0 0 100 100";

export const EUMEDICAL_CROSS_BARS = [
  { x: 4, y: 36, width: 92, height: 28, rx: 14 }, // brazo horizontal (izq./der.)
  { x: 36, y: 20, width: 28, height: 72, rx: 14 }, // brazo vertical (arriba más corto, abajo más largo)
] as const;

export const EUMEDICAL_ORANGE = "#e79f1a";
