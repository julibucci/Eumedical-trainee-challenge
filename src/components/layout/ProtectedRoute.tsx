import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

/**
 * Envuelve las rutas /app/* (ver App.tsx). Sin sesión activa en useAuthStore
 * redirige a /login — cubre tanto entrar directo a /app/* sin loguearse como
 * volver con el botón "atrás" del navegador después de cerrar sesión.
 */
export function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
