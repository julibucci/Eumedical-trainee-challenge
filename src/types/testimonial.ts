export interface Testimonial {
  /** The text and location live in src/i18n/content.ts, keyed by this id. */
  id: string;
  /** Score from 1 to 5. */
  rating: number;
}
