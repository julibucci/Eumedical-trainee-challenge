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
 * Parsea las fechas en texto libre del dataset mock, que vienen en dos formatos
 * distintos: "12 sep 2024" (historial/recetas) y "Martes 17 de septiembre"
 * (consultas próximas, sin año — se asume `fallbackYear`, el año congelado del mock).
 * Devuelve null si el formato no matchea ninguno de los dos.
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
