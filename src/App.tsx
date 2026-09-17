import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/marketing/HomePage";
import { PlaceholderPage } from "./pages/legal/PlaceholderPage";
import { PatientLayout } from "./components/layout/PatientLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import PatientHomePage from "./pages/app/HomePage";
import CalendarioPage from "./pages/app/CalendarioPage";
import ConsultasPage from "./pages/app/ConsultasPage";
import HistorialPage from "./pages/app/HistorialPage";
import DocumentosPage from "./pages/app/DocumentosPage";
import RecetasPage from "./pages/app/RecetasPage";
import PerfilPage from "./pages/app/PerfilPage";

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/terminos" element={<PlaceholderPage title="Términos y condiciones" />} />
        <Route path="/privacidad" element={<PlaceholderPage title="Política de privacidad" />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<PatientLayout />}>
            <Route index element={<PatientHomePage />} />
            <Route path="calendario" element={<CalendarioPage />} />
            <Route path="consultas" element={<ConsultasPage />} />
            <Route path="historial" element={<HistorialPage />} />
            <Route path="documentos" element={<DocumentosPage />} />
            <Route path="recetas" element={<RecetasPage />} />
            <Route path="perfil" element={<PerfilPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
