import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/app/HomePage";

function RecetasStub() {
  return <p>Recetas médicas (stub)</p>;
}

describe("HomePage", () => {
  it("clicking 'Ver receta' navigates to /app/recetas", () => {
    render(
      <MemoryRouter initialEntries={["/app"]}>
        <Routes>
          <Route path="/app" element={<HomePage />} />
          <Route path="/app/recetas" element={<RecetasStub />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /ver receta/i }));

    expect(screen.getByText("Recetas médicas (stub)")).toBeInTheDocument();
  });
});
