import type { GlobeMarker } from "../types/globeMarker";

/**
 * Mockeados: España/Portugal/Italia/Francia son los países reales mencionados en "Médicos a
 * domicilio" (ver capabilitiesBento en src/i18n/content.ts). El resto son una muestra razonable
 * de otros continentes para ilustrar "cobertura en más de 80 países" — en producción esta lista
 * debería salir de un dataset real de cobertura de la empresa, si existe. Ver README.
 */
export const globeMarkers: GlobeMarker[] = [
  { id: "es", label: "España", lat: 40.4168, lon: -3.7038 },
  { id: "pt", label: "Portugal", lat: 38.7223, lon: -9.1393 },
  { id: "it", label: "Italia", lat: 41.9028, lon: 12.4964 },
  { id: "fr", label: "Francia", lat: 48.8566, lon: 2.3522 },
  { id: "ar", label: "Argentina", lat: -34.6037, lon: -58.3816 },
  { id: "us", label: "Estados Unidos", lat: 38.9072, lon: -77.0369 },
  { id: "jp", label: "Japón", lat: 35.6762, lon: 139.6503 },
  { id: "za", label: "Sudáfrica", lat: -33.9249, lon: 18.4241 },
];
