import { useState } from "react";
import { AlertTriangle, Calendar, Camera, Check, Clock, ClipboardList, FileText, Headphones } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ActivityTimeline } from "../../components/ui/ActivityTimeline";
import { Button } from "../../components/ui/Button";
import { EumedicalCross } from "../../components/ui/EumedicalCross";
import { TeleconsultaModal } from "../../components/ui/TeleconsultaModal";
import {
  currentPatient,
  expiringPrescription,
  nextAppointment,
  recentActivity,
  recentDocuments,
  upcomingAppointments,
} from "../../mocks/patientData";
import { useAuthStore } from "../../store/authStore";

const ICON_SIZE = 18;
const ICON_STROKE_WIDTH = 1.75;

const PREP_CHECKLIST = [
  { icon: FileText, label: "Subí tus estudios" },
  { icon: ClipboardList, label: "Completá el formulario" },
  { icon: Camera, label: "Probá cámara y micrófono" },
] as const;

export default function HomePage() {
  const navigate = useNavigate();
  const sessionUser = useAuthStore((state) => state.user);
  // Sin sesión (ej. se entró directo a /app), se muestra la paciente mock por default.
  const firstName = sessionUser?.firstName ?? currentPatient.firstName;
  // Mock: sin backend real, el progreso del checklist solo vive en esta página — ver README.
  const [completedPrep, setCompletedPrep] = useState<Record<string, boolean>>({});
  const [isTeleconsultaOpen, setIsTeleconsultaOpen] = useState(false);

  function togglePrepItem(label: string) {
    setCompletedPrep((current) => ({ ...current, [label]: !current[label] }));
  }

  function handleViewMoreActivity() {
    // Placeholder: no hay una vista dedicada de "toda la actividad" (mezcla consultas,
    // documentos y recetas) — en producción llevaría a un historial unificado. Ver README.
    toast("Vista completa de actividad reciente (próximamente)");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Saludo */}
      <div>
        <h2 className="font-display text-2xl font-medium text-brand-dark-blue sm:text-3xl">Hola, {firstName} 👋</h2>
        <p className="mt-1 text-gray-500">{currentPatient.today}</p>
      </div>

      {/* Próxima consulta */}
      {/* Degradado 45° navy→teal (paleta de marca). El segundo stop se ubica en 200%, no en 100%,
          para que el punto más claro del card nunca pase de una mezcla 50/50 con navy — así el
          texto blanco mantiene ≥4.5:1 (WCAG AA) en cualquier esquina, incluida la más "teal". */}
      <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(45deg,#1e4865_0%,#79b19c_200%)] p-6 sm:p-8">
        <EumedicalCross
          size={180}
          color="#ffffff"
          className="pointer-events-none absolute -bottom-10 -right-10 -z-10 opacity-[0.07]"
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-medium-aqua" />
              <p className="font-heading text-xs font-bold uppercase tracking-wide text-brand-light-aqua">
                Próxima consulta
              </p>
            </div>

            <p className="mt-3 font-heading text-xl font-bold text-white sm:text-2xl">{nextAppointment.doctor}</p>
            <p className="font-heading text-brand-light-aqua">{nextAppointment.specialty}</p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white">
              <span className="flex items-center gap-1.5">
                <Calendar aria-hidden="true" size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />
                {nextAppointment.date}
              </span>
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/40" />
              <span className="flex items-center gap-1.5">
                <Clock aria-hidden="true" size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />
                {nextAppointment.time}
              </span>
            </div>
          </div>

          <Button className="lg:self-center" onClick={() => setIsTeleconsultaOpen(true)}>
            Unirme a la teleconsulta
          </Button>
        </div>

        <hr className="my-6 border-white/15" />

        <p className="font-heading text-xs font-bold uppercase tracking-wide text-brand-light-aqua">
          Preparate tu consulta
        </p>
        <ul className="mt-4 flex flex-col gap-4 sm:flex-row sm:gap-8">
          {PREP_CHECKLIST.map(({ icon: Icon, label }) => {
            const isChecked = completedPrep[label] ?? false;
            return (
              <li key={label}>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isChecked}
                  onClick={() => togglePrepItem(label)}
                  className="flex items-center gap-3 rounded-lg py-1 text-left transition-opacity hover:opacity-80"
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                      isChecked ? "border-white bg-white" : "border-white/40"
                    }`}
                  >
                    {isChecked && <Check size={14} strokeWidth={2.5} className="text-brand-dark-blue" />}
                  </span>
                  <Icon
                    aria-hidden="true"
                    size={ICON_SIZE}
                    strokeWidth={ICON_STROKE_WIDTH}
                    className={isChecked ? "text-white/60" : "text-white"}
                  />
                  <span className={`text-sm ${isChecked ? "text-white/60 line-through" : "text-white"}`}>{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Alerta de receta */}
      <section className="flex flex-col items-start gap-4 rounded-2xl border border-brand-yellow/40 bg-brand-yellow/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <AlertTriangle aria-hidden="true" size={20} strokeWidth={ICON_STROKE_WIDTH} className="mt-0.5 shrink-0 text-brand-orange" />
          <div>
            <p className="font-bold text-brand-dark-blue">
              {expiringPrescription.medication} vence el {expiringPrescription.expiresOn}
            </p>
            <p className="text-sm text-gray-600">
              En {expiringPrescription.daysLeft} días · Solicitá la renovación antes de que expire
            </p>
          </div>
        </div>
        <Button className="w-full shrink-0 sm:w-auto" onClick={() => navigate("/app/recetas")}>
          Ver receta
        </Button>
      </section>

      {/* Grid 65/35 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[13fr_7fr]">
        {/* Actividad reciente */}
        <section className="rounded-2xl bg-white p-6">
          <h3 className="font-display text-lg font-medium text-brand-dark-blue">Actividad reciente</h3>
          <div className="mt-6">
            <ActivityTimeline events={recentActivity} />
          </div>
          <button
            type="button"
            onClick={handleViewMoreActivity}
            className="mt-4 text-sm font-bold text-brand-dark-blue hover:underline"
          >
            Ver más actividad reciente →
          </button>
        </section>

        <div className="flex flex-col gap-6">
          {/* Siguientes consultas */}
          <section className="rounded-2xl bg-white p-6">
            <h3 className="font-display text-lg font-medium text-brand-dark-blue">Siguientes consultas</h3>
            <ul className="mt-4 flex flex-col gap-4">
              {upcomingAppointments.map((appointment) => (
                <li key={appointment.id} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${appointment.isNext ? "bg-brand-orange" : "bg-brand-medium-aqua"}`}
                  />
                  <div>
                    <p className="font-heading font-bold text-brand-dark-blue">{appointment.doctor}</p>
                    <p className="text-sm text-gray-500">
                      {appointment.date} · {appointment.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/app/consultas" className="mt-4 inline-block text-sm font-bold text-brand-dark-blue hover:underline">
              Ver todas →
            </Link>
          </section>

          {/* Documentos recientes */}
          <section className="rounded-2xl bg-white p-6">
            <h3 className="font-display text-lg font-medium text-brand-dark-blue">Documentos recientes</h3>
            <ul className="mt-4 flex flex-col gap-4">
              {recentDocuments.map((doc) => (
                <li key={doc.id} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-light-aqua/40 text-[10px] font-bold text-brand-dark-blue">
                    PDF
                  </span>
                  <div>
                    <p className="font-heading font-bold text-brand-dark-blue">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.date}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/app/documentos" className="mt-4 inline-block text-sm font-bold text-brand-dark-blue hover:underline">
              Ver todos →
            </Link>
          </section>

          {/* Ayuda */}
          <section className="flex items-start gap-3 rounded-2xl bg-brand-light-aqua/25 p-6">
            <Headphones aria-hidden="true" size={22} strokeWidth={ICON_STROKE_WIDTH} className="mt-0.5 shrink-0 text-brand-dark-blue" />
            <div>
              <p className="font-bold text-brand-dark-blue">¿Necesitás ayuda?</p>
              <Link to="/app/perfil" className="text-sm font-bold text-brand-dark-blue hover:underline">
                Contactar soporte →
              </Link>
            </div>
          </section>
        </div>
      </div>

      <TeleconsultaModal
        isOpen={isTeleconsultaOpen}
        onClose={() => setIsTeleconsultaOpen(false)}
        doctor={nextAppointment.doctor}
        specialty={nextAppointment.specialty}
      />
    </div>
  );
}
