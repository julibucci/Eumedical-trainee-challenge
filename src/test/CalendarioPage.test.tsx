import { afterEach, describe, expect, it } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import CalendarioPage from "../pages/app/CalendarioPage";

afterEach(cleanup);

describe("CalendarioPage", () => {
  it("clicking 'Mes siguiente' advances the calendar to October 2024", () => {
    render(<CalendarioPage />);

    expect(screen.getByText("Septiembre 2024")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /mes siguiente/i }));

    expect(screen.getByText("Octubre 2024")).toBeInTheDocument();
  });

  it("clicking 'Hoy' shows the mocked date again (September 16, 2024)", () => {
    render(<CalendarioPage />);

    // The mocked date starts marked as "today" in the grid.
    expect(screen.getByRole("button", { current: "date" })).toBeInTheDocument();

    // Move to another month: the "today" marker disappears because 09/16 is no longer in the grid.
    fireEvent.click(screen.getByRole("button", { name: /mes siguiente/i }));
    expect(screen.getByText("Octubre 2024")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { current: "date" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Hoy" }));

    expect(screen.getByText("Septiembre 2024")).toBeInTheDocument();
    expect(screen.getByRole("button", { current: "date" })).toBeInTheDocument();
  });

  it("clicking a day with no events shows the empty state in the modal", () => {
    render(<CalendarioPage />);

    // The mocked "today" (09/16/2024) has no consultation or prescription expiring.
    fireEvent.click(screen.getByRole("button", { current: "date" }));

    expect(screen.getByText("No tenés eventos este día.")).toBeInTheDocument();
  });

  it("clicking a day with a consultation shows its details in the modal", () => {
    render(<CalendarioPage />);

    const day17 = screen.getByText("17").closest("button");
    expect(day17).not.toBeNull();
    fireEvent.click(day17 as HTMLElement);

    const dialog = screen.getByRole("dialog");
    expect(
      within(dialog).getByText("Dr. Sebastián Torres"),
    ).toBeInTheDocument();
    expect(within(dialog).getByText("Confirmada")).toBeInTheDocument();
  });

  it("the 'Cerrar' button closes the day modal", () => {
    render(<CalendarioPage />);

    fireEvent.click(screen.getByRole("button", { current: "date" }));
    expect(screen.getByText("No tenés eventos este día.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));

    expect(
      screen.queryByText("No tenés eventos este día."),
    ).not.toBeInTheDocument();
  });
});
