import type { GlobeMarker } from "../types/globeMarker";

/**
 * Mocked: Spain/Portugal/Italy/France are the real countries mentioned in "Médicos a
 * domicilio" (see capabilitiesBento in src/i18n/content.ts). The rest are a reasonable sample
 * of other continents to illustrate "coverage in more than 80 countries" — in production this list
 * should come from a real company coverage dataset, if one exists. See README.
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
