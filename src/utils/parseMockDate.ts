const MONTH_INDEX: Record<string, number> = {
  ene: 0,
  feb: 1,
  mar: 2,
  abr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  ago: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dic: 11,
};

function normalizeMonth(word: string): string {
  return word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .slice(0, 3);
}

/**
 * Parses the free-text dates of the mock dataset, which come in two
 * different formats: "12 sep 2024" (history/prescriptions) and "Martes 17 de septiembre"
 * (upcoming consultations, no year — `fallbackYear` is assumed, the mock's frozen year).
 * Returns null if the format matches neither.
 */
export function parseMockDate(input: string, fallbackYear = 2024): Date | null {
  const withYear = input.match(/(\d{1,2})\s+([a-záéíóúñ]+)\.?\s+(\d{4})/i);
  if (withYear) {
    const [, day, month, year] = withYear;
    const monthIndex = MONTH_INDEX[normalizeMonth(month)];
    if (monthIndex === undefined) return null;
    return new Date(Number(year), monthIndex, Number(day));
  }

  const withoutYear = input.match(/(\d{1,2})\s+de\s+([a-záéíóúñ]+)/i);
  if (withoutYear) {
    const [, day, month] = withoutYear;
    const monthIndex = MONTH_INDEX[normalizeMonth(month)];
    if (monthIndex === undefined) return null;
    return new Date(fallbackYear, monthIndex, Number(day));
  }

  return null;
}
