import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

/**
 * Wraps the /app/* routes (see App.tsx). Without an active session in useAuthStore
 * it redirects to /login — covers both entering /app/* directly without logging in and
 * going back with the browser's "back" button after logging out.
 */
export function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
