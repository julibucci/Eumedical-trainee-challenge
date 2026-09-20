import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import RecetasPage from "../pages/app/RecetasPage";

afterEach(cleanup);

describe("RecetasPage", () => {
  it("shows active and about-to-expire prescriptions by default, but not expired ones", () => {
    render(<RecetasPage />);

    expect(screen.getByText("Losartán 50mg")).toBeInTheDocument();
    expect(screen.getByText("Vitamina D 1000 UI")).toBeInTheDocument();
    expect(screen.queryByText("Melatonina 3mg")).not.toBeInTheDocument();
  });

  it("the 'Vencidas' tab shows only expired prescriptions", () => {
    render(<RecetasPage />);

    fireEvent.click(screen.getByRole("tab", { name: /vencidas/i }));

    expect(screen.getByText("Melatonina 3mg")).toBeInTheDocument();
    expect(screen.getByText("Ibuprofeno 400mg")).toBeInTheDocument();
    expect(screen.queryByText("Losartán 50mg")).not.toBeInTheDocument();
  });

  it("the 'Todas' tab shows prescriptions from all three statuses", () => {
    render(<RecetasPage />);

    fireEvent.click(screen.getByRole("tab", { name: /^todas$/i }));

    expect(screen.getByText("Losartán 50mg")).toBeInTheDocument();
    expect(screen.getByText("Vitamina D 1000 UI")).toBeInTheDocument();
    expect(screen.getByText("Melatonina 3mg")).toBeInTheDocument();
  });

  it("marks only the active tab as selected (aria-selected)", () => {
    render(<RecetasPage />);

    expect(
      screen.getByRole("tab", { name: /vigentes y por vencer/i }),
    ).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: /vencidas/i })).toHaveAttribute(
      "aria-selected",
      "false",
    );

    fireEvent.click(screen.getByRole("tab", { name: /vencidas/i }));

    expect(screen.getByRole("tab", { name: /vencidas/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      screen.getByRole("tab", { name: /vigentes y por vencer/i }),
    ).toHaveAttribute("aria-selected", "false");
  });
});
