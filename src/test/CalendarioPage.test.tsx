import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import CalendarioPage from "../pages/app/CalendarioPage";

afterEach(cleanup);

describe("CalendarioPage", () => {
  it("al hacer click en 'Mes siguiente' avanza el calendario a octubre 2024", () => {
    render(<CalendarioPage />);

    expect(screen.getByText("Septiembre 2024")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /mes siguiente/i }));

    expect(screen.getByText("Octubre 2024")).toBeInTheDocument();
  });

  it("al hacer click en 'Hoy' vuelve a mostrar la fecha mockeada (16 de septiembre de 2024)", () => {
    render(<CalendarioPage />);

    // La fecha mockeada arranca marcada como "hoy" en el grilla.
    expect(screen.getByRole("button", { current: "date" })).toBeInTheDocument();

    // Nos alejamos a otro mes: la marca de "hoy" desaparece porque el 16/09 ya no está en la grilla.
    fireEvent.click(screen.getByRole("button", { name: /mes siguiente/i }));
    expect(screen.getByText("Octubre 2024")).toBeInTheDocument();
    expect(screen.queryByRole("button", { current: "date" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Hoy" }));

    expect(screen.getByText("Septiembre 2024")).toBeInTheDocument();
    expect(screen.getByRole("button", { current: "date" })).toBeInTheDocument();
  });
});
