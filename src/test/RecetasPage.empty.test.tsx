import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { Prescription } from "../types/prescription";

afterEach(() => {
  cleanup();
  vi.resetModules();
});

describe("RecetasPage with no prescriptions", () => {
  it("shows the empty state when there are no registered prescriptions", async () => {
    vi.doMock("../mocks/prescriptions", () => ({
      prescriptions: [] satisfies Prescription[],
    }));
    const { default: RecetasPage } = await import("../pages/app/RecetasPage");

    render(
      <MemoryRouter>
        <RecetasPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("No tenés recetas registradas"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /agendar consulta/i }),
    ).toBeInTheDocument();
  });
});

describe("RecetasPage with a filter that has no results", () => {
  it("shows the empty-filter message when there are no expired prescriptions", async () => {
    vi.doMock("../mocks/prescriptions", () => ({
      prescriptions: [
        {
          id: "presc-1",
          medication: "Losartán 50mg",
          status: "vigente",
          dosage: "1 comprimido · 1 vez al día",
          doctor: "Dr. S. Torres",
          issuedDate: "1 sep 2024",
          expiresDate: "15 oct 2024",
        },
      ] satisfies Prescription[],
    }));
    const { default: RecetasPage } = await import("../pages/app/RecetasPage");

    render(<RecetasPage />);
    fireEvent.click(screen.getByRole("tab", { name: /vencidas/i }));

    expect(
      screen.getByText("No hay recetas para este filtro"),
    ).toBeInTheDocument();
  });
});
