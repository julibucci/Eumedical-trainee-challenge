import { describe, expect, it } from "vitest";
import { parseMockDate } from "../utils/parseMockDate";

describe("parseMockDate", () => {
  it("parses the 'DD month YYYY' format (history/prescriptions)", () => {
    expect(parseMockDate("12 sep 2024")).toEqual(new Date(2024, 8, 12));
  });

  it("parses the format with an abbreviated dot ('DD month. YYYY')", () => {
    expect(parseMockDate("5 ago. 2024")).toEqual(new Date(2024, 7, 5));
  });

  it("parses the 'Weekday DD de month' format with no year, using fallbackYear", () => {
    expect(parseMockDate("Martes 17 de septiembre", 2024)).toEqual(
      new Date(2024, 8, 17),
    );
  });

  it("uses 2024 as the default fallbackYear", () => {
    expect(parseMockDate("3 de enero")).toEqual(new Date(2024, 0, 3));
  });

  it("respects a fallbackYear different from the default", () => {
    expect(parseMockDate("3 de enero", 2025)).toEqual(new Date(2025, 0, 3));
  });

  it("returns null when the text does not match any format", () => {
    expect(parseMockDate("fecha inválida")).toBeNull();
  });

  it("returns null when the month is not in the dictionary", () => {
    expect(parseMockDate("12 xyz 2024")).toBeNull();
  });
});
