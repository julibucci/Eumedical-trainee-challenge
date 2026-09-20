import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import { useAuthStore } from "../store/authStore";

const INITIAL_STATE = useAuthStore.getState();

afterEach(() => {
  cleanup();
  useAuthStore.setState(INITIAL_STATE, true);
});

function renderProtected() {
  return render(
    <MemoryRouter initialEntries={["/app"]}>
      <Routes>
        <Route path="/login" element={<p>Login (stub)</p>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<p>Protected area</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  it("redirects to /login when there is no active session", () => {
    renderProtected();

    expect(screen.getByText("Login (stub)")).toBeInTheDocument();
    expect(screen.queryByText("Protected area")).not.toBeInTheDocument();
  });

  it("renders the protected content when there is an active session", () => {
    useAuthStore.getState().loginWithEmail("juan@correo.com");

    renderProtected();

    expect(screen.getByText("Protected area")).toBeInTheDocument();
    expect(screen.queryByText("Login (stub)")).not.toBeInTheDocument();
  });
});
