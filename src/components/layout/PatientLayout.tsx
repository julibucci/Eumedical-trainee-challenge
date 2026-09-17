import { useEffect, useState } from "react";
import { CalendarClock, Folder, Home, LogOut, Menu, MessageCircle, Pill, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { EumedicalLogo } from "../ui/EumedicalLogo";
import { EumedicalCross } from "../ui/EumedicalCross";
import { Badge } from "../ui/Badge";
import { PatientAvatar } from "../ui/PatientAvatar";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { currentPatient, prescriptionsExpiringCount } from "../../mocks/patientData";
import { useAuthStore } from "../../store/authStore";
import { useNotifications } from "../../hooks/useNotifications";

const ICON_SIZE = 20;
const ICON_STROKE_WIDTH = 1.75;

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  end: boolean;
  badge?: number;
};

const NAV_ITEMS: NavItem[] = [
  { to: "/app", label: "Inicio", icon: Home, end: true },
  { to: "/app/consultas", label: "Consultas", icon: MessageCircle, end: false },
  { to: "/app/historial", label: "Historial", icon: CalendarClock, end: false },
  { to: "/app/documentos", label: "Documentos", icon: Folder, end: false },
  { to: "/app/recetas", label: "Recetas", icon: Pill, end: false, badge: prescriptionsExpiringCount },
  { to: "/app/perfil", label: "Perfil y soporte", icon: User, end: false },
];

const SECTION_TITLES: Record<string, string> = {
  "/app": "Inicio",
  "/app/consultas": "Consultas",
  "/app/historial": "Historial",
  "/app/documentos": "Documentos",
  "/app/recetas": "Recetas",
  "/app/perfil": "Perfil y soporte",
};

function SidebarContent({ onNavigate }: { onNavigate: () => void }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    onNavigate();
    // Sesión en memoria (zustand), no hay nada persistido que limpiar — ver README.
    logout();
    navigate("/login");
  }

  return (
    <>
      <EumedicalLogo theme="dark" size={30} />
      <p className="mt-8 font-heading text-xs font-bold uppercase tracking-wide text-brand-light-aqua/70">
        Área de paciente
      </p>

      <nav aria-label="Navegación del área de paciente" className="mt-4 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              // Fill teal + texto blanco no llega a 4.5:1 (AA) — el estado activo se marca con
              // ícono teal + fondo sutil, no con el teal como color de texto/fill de bloque.
              `flex items-center gap-3 rounded-xl px-3 py-2.5 font-heading text-sm transition-colors ${
                isActive ? "bg-white/10 font-bold text-white" : "text-brand-light-aqua hover:bg-white/5"
              }`
            }
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <Icon
                  aria-hidden="true"
                  size={ICON_SIZE}
                  strokeWidth={ICON_STROKE_WIDTH}
                  className={isActive ? "text-brand-medium-aqua" : ""}
                />
                <span className="flex-1">{label}</span>
                {badge ? <Badge variant="orange">{badge}</Badge> : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        aria-label="Cerrar sesión"
        onClick={handleLogout}
        className="mt-auto flex w-full items-center gap-3 rounded-xl border border-white/25 bg-transparent px-3 py-2.5 font-heading text-sm font-bold text-white transition-colors hover:bg-white/10"
      >
        <LogOut aria-hidden="true" size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />
        Cerrar sesión
      </button>
    </>
  );
}

/** Layout compartido por todas las rutas /app/*: sidebar + header + <Outlet /> para el contenido. */
export function PatientLayout() {
  const location = useLocation();
  const sessionUser = useAuthStore((state) => state.user);
  const avatarUrl = useAuthStore((state) => state.avatarUrl);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const sectionTitle = SECTION_TITLES[location.pathname] ?? "Inicio";
  // Sin sesión (ej. se entró directo a /app), se muestra la paciente mock por default.
  const displayInitials = sessionUser?.initials ?? currentPatient.initials;
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    if (!isMobileNavOpen) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMobileNavOpen(false);
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMobileNavOpen]);

  return (
    <div className="min-h-screen bg-brand-grey lg:flex">
      {/* Sidebar: fija en desktop (lg+), drawer off-canvas en mobile. */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col overflow-hidden bg-brand-dark-blue px-5 py-8 transition-transform lg:translate-x-0 ${
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Watermark de marca: la cruz sola, a opacidad baja, como recurso ilustrativo de fondo. */}
        <EumedicalCross
          size={220}
          color="#ffffff"
          className="pointer-events-none absolute -bottom-12 -right-16 opacity-[0.06]"
        />
        <SidebarContent onNavigate={() => setIsMobileNavOpen(false)} />
      </aside>

      {isMobileNavOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:pl-[250px]">
        <header className="flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setIsMobileNavOpen(true)}
              className="rounded-lg p-1.5 hover:bg-brand-grey lg:hidden"
            >
              <Menu aria-hidden="true" size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} className="text-brand-dark-blue" />
            </button>
            <h1 className="font-display text-lg font-medium text-brand-dark-blue sm:text-xl">{sectionTitle}</h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden items-center gap-1.5 sm:flex" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-medium-aqua" />
              <span className="h-2.5 w-2.5 rounded-full border border-gray-300" />
              <span className="h-2.5 w-2.5 rounded-full border border-gray-300" />
              <span className="h-2.5 w-2.5 rounded-full border border-gray-300" />
            </div>

            <NotificationsDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
            />

            <Link to="/app/perfil" aria-label="Ir a mi perfil" className="rounded-full">
              <PatientAvatar initials={displayInitials} avatarUrl={avatarUrl} size="sm" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
