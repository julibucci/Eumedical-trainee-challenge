import { afterEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import { useAuthStore } from "../store/authStore";

const INITIAL_STATE = useAuthStore.getState();

afterEach(() => {
  cleanup();
  useAuthStore.setState(INITIAL_STATE, true);
});

function renderLoginPage() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/app" element={<p>Patient area (stub)</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

function fillForm(email: string, password: string) {
  fireEvent.change(screen.getByLabelText(/^EMAIL/i), {
    target: { value: email },
  });
  fireEvent.change(screen.getByLabelText(/^CONTRASEÑA/i), {
    target: { value: password },
  });
}

describe("LoginPage", () => {
  it("shows an email error when it is invalid", () => {
    renderLoginPage();

    fillForm("no-es-un-email", "Password1");
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(
      screen.getByText("Email inválido, vuelve a intentarlo"),
    ).toBeInTheDocument();
  });

  it("shows a password error when it lacks an uppercase letter and a number", () => {
    renderLoginPage();

    fillForm("juan@correo.com", "sinnumero");
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(
      screen.getByText("Contraseña incorrecta, vuelve a intentarlo"),
    ).toBeInTheDocument();
  });

  it("prioritizes the email error when both email and password are invalid", () => {
    renderLoginPage();

    fillForm("no-es-un-email", "sinnumero");
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

    expect(
      screen.getByText("Email inválido, vuelve a intentarlo"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Contraseña incorrecta, vuelve a intentarlo"),
    ).not.toBeInTheDocument();
  });

  it("clears the field error when typing in it again", () => {
    renderLoginPage();

    fillForm("no-es-un-email", "Password1");
    fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(
      screen.getByText("Email inválido, vuelve a intentarlo"),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/^EMAIL/i), {
      target: { value: "juan@correo.com" },
    });

    expect(
      screen.queryByText("Email inválido, vuelve a intentarlo"),
    ).not.toBeInTheDocument();
  });

  it("logs the user in and navigates to /app with valid data", () => {
    vi.useFakeTimers();
    try {
      renderLoginPage();

      fillForm("juan@correo.com", "Password1");
      fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

      expect(useAuthStore.getState().user?.firstName).toBe("Juan");

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(screen.getByText("Patient area (stub)")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
