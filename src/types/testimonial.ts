export interface Testimonial {
  /** El texto y la ubicación viven en src/i18n/content.ts, keyed por este id. */
  id: string;
  /** Puntuación de 1 a 5. */
  rating: number;
}
