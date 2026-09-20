import { afterEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RegisterPage from "../pages/auth/RegisterPage";
import { useAuthStore } from "../store/authStore";

const INITIAL_STATE = useAuthStore.getState();

afterEach(() => {
  cleanup();
  useAuthStore.setState(INITIAL_STATE, true);
});

function renderRegisterPage() {
  return render(
    <MemoryRouter initialEntries={["/registro"]}>
      <Routes>
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/app" element={<p>Patient area (stub)</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

const VALID_VALUES = {
  firstName: "María",
  lastName: "González",
  email: "maria@gmail.com",
  password: "secreta",
};

type InvalidField =
  keyof typeof VALID_VALUES | "confirmPassword" | "acceptedTerms" | "none";

function fillValidFormExcept(field: InvalidField = "none") {
  const values = { ...VALID_VALUES };
  fireEvent.change(screen.getByLabelText(/^NOMBRE/i), {
    target: { value: values.firstName },
  });
  fireEvent.change(screen.getByLabelText(/^APELLIDO/i), {
    target: { value: values.lastName },
  });
  fireEvent.change(screen.getByLabelText(/^EMAIL/i), {
    target: { value: field === "email" ? "maria@outlook.com" : values.email },
  });
  fireEvent.change(screen.getByLabelText(/^CONTRASEÑA/i), {
    target: { value: values.password },
  });
  fireEvent.change(screen.getByLabelText(/^CONFIRMAR CONTRASEÑA/i), {
    target: {
      value: field === "confirmPassword" ? "otra-contraseña" : values.password,
    },
  });
  if (field !== "acceptedTerms") {
    fireEvent.click(screen.getByRole("checkbox"));
  }
}

describe("RegisterPage", () => {
  it("rejects emails outside @gmail.com / @yahoo.com.ar", () => {
    renderRegisterPage();

    fillValidFormExcept("email");
    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(
      screen.getByText(
        "Email inválido. Debe ser una cuenta @gmail.com o @yahoo.com.ar.",
      ),
    ).toBeInTheDocument();
  });

  it("shows an error when the passwords do not match", () => {
    renderRegisterPage();

    fillValidFormExcept("confirmPassword");
    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(
      screen.getByText("Las contraseñas no coinciden."),
    ).toBeInTheDocument();
  });

  it("shows an error when the terms are not accepted", () => {
    renderRegisterPage();

    fillValidFormExcept("acceptedTerms");
    fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

    expect(
      screen.getByText("Tenés que aceptar los términos para continuar."),
    ).toBeInTheDocument();
  });

  it("revalidates the field on onBlur", () => {
    renderRegisterPage();

    const firstNameInput = screen.getByLabelText(/^NOMBRE/i);
    fireEvent.focus(firstNameInput);
    fireEvent.blur(firstNameInput);

    expect(screen.getByText("Este campo es obligatorio.")).toBeInTheDocument();
  });

  it("registers the user and navigates to /app with valid data", () => {
    vi.useFakeTimers();
    try {
      renderRegisterPage();

      fillValidFormExcept("none");
      fireEvent.click(screen.getByRole("button", { name: /crear cuenta/i }));

      expect(useAuthStore.getState().user?.fullName).toBe("María González");

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(screen.getByText("Patient area (stub)")).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
