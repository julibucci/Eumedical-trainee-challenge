import type { Testimonial } from "../types/testimonial";

/** Promedio real de la empresa, mostrado arriba del carrusel. */
export const AVERAGE_RATING = 4.9;

/**
 * `testimonial-1` es el testimonio real de la empresa (atención en viajes al exterior).
 * Los siguientes 3 son ilustrativos, en el mismo tono (atención internacional, teleconsulta,
 * tiempo de respuesta) — reemplazar por reseñas reales cuando estén disponibles, ver README.
 * Texto y ubicación (ES/EN) en src/i18n/content.ts, keyed por `id`.
 */
export const testimonials: Testimonial[] = [
  { id: "testimonial-1", rating: 5 },
  { id: "testimonial-2", rating: 5 },
  { id: "testimonial-3", rating: 4 },
  { id: "testimonial-4", rating: 5 },
];
