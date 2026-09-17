import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, Pill } from "lucide-react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "../../components/ui/Badge";
import { consultations } from "../../mocks/consultations";
import { consultationHistory } from "../../mocks/consultationHistory";
import { prescriptions } from "../../mocks/prescriptions";
import { parseMockDate } from "../../utils/parseMockDate";
import type { Consultation, ConsultationStatus } from "../../types/consultation";
import type { PrescriptionStatus } from "../../types/prescription";

const ICON_STROKE_WIDTH = 1.75;
// Mismo "hoy" congelado que el resto del mock (ver mocks/patientData.ts) — si usáramos
// la fecha real, el calendario abriría vacío a años de distancia de todos los eventos.
const MOCK_TODAY = new Date(2024, 8, 16);
const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

type CalendarEvent = {
  id: string;
  date: Date;
  kind: "consulta" | "receta";
  dot: string;
  title: string;
  subtitle: string;
  badgeVariant: ConsultationStatus | PrescriptionStatus;
  badgeLabel: string;
};

const CONSULTATION_STATUS_LABEL: Record<ConsultationStatus, string> = {
  confirmada: "Confirmada",
  pendiente: "Pendiente",
  completada: "Completada",
  cancelada: "Cancelada",
};

const PRESCRIPTION_STATUS_LABEL: Record<PrescriptionStatus, string> = {
  vigente: "Vigente",
  porVencer: "Por vencer",
  vencida: "Vencida",
};

// Color = estado (no tipo de evento): teal = al día, gold = atención pronto,
// navy suave = completado/neutral, rojo = cancelado o vencido (excepción real).
const CONSULTATION_DOT: Record<ConsultationStatus, string> = {
  confirmada: "bg-brand-medium-aqua",
  pendiente: "bg-brand-medium-aqua",
  completada: "bg-brand-dark-blue/30",
  cancelada: "bg-red-500",
};

const PRESCRIPTION_DOT: Record<PrescriptionStatus, string> = {
  vigente: "bg-brand-medium-aqua",
  porVencer: "bg-brand-yellow",
  vencida: "bg-red-500",
};

type DaySeverity = "red" | "gold" | "teal";

// Tinte de fondo del día completo, para verlo de un vistazo sin depender solo
// del puntito: se prioriza el evento más urgente si el día tiene varios.
const DAY_TINT: Record<DaySeverity, string> = {
  red: "bg-red-50 text-brand-dark-blue hover:bg-red-100",
  gold: "bg-brand-yellow/15 text-brand-dark-blue hover:bg-brand-yellow/25",
  teal: "bg-brand-medium-aqua/15 text-brand-dark-blue hover:bg-brand-medium-aqua/25",
};

function getDaySeverity(dayEvents: CalendarEvent[]): DaySeverity | null {
  if (dayEvents.length === 0) return null;
  if (dayEvents.some((event) => event.badgeVariant === "cancelada" || event.badgeVariant === "vencida")) return "red";
  if (dayEvents.some((event) => event.badgeVariant === "porVencer")) return "gold";
  return "teal";
}

function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function buildEvents(): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const allConsultations: Consultation[] = [...consultations, ...consultationHistory];

  for (const consultation of allConsultations) {
    const date = parseMockDate(consultation.date);
    if (!date) continue;
    events.push({
      id: `consulta-${consultation.id}`,
      date,
      kind: "consulta",
      dot: CONSULTATION_DOT[consultation.status],
      title: consultation.doctor,
      subtitle: `${consultation.specialty} · ${consultation.time}`,
      badgeVariant: consultation.status,
      badgeLabel: CONSULTATION_STATUS_LABEL[consultation.status],
    });
  }

  for (const prescription of prescriptions) {
    const date = parseMockDate(prescription.expiresDate);
    if (!date) continue;
    events.push({
      id: `receta-${prescription.id}`,
      date,
      kind: "receta",
      dot: PRESCRIPTION_DOT[prescription.status],
      title: prescription.medication,
      subtitle: `Vence la receta · ${prescription.dosage}`,
      badgeVariant: prescription.status,
      badgeLabel: PRESCRIPTION_STATUS_LABEL[prescription.status],
    });
  }

  return events;
}

/** Calendario mensual con las consultas y vencimientos de recetas del paciente. */
export default function CalendarioPage() {
  const [visibleMonth, setVisibleMonth] = useState(MOCK_TODAY);
  const [selectedDate, setSelectedDate] = useState(MOCK_TODAY);

  const events = useMemo(buildEvents, []);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const key = format(event.date, "yyyy-MM-dd");
      const existing = map.get(key);
      if (existing) existing.push(event);
      else map.set(key, [event]);
    }
    return map;
  }, [events]);

  const gridDays = useMemo(() => {
    const monthStart = startOfMonth(visibleMonth);
    const monthEnd = endOfMonth(visibleMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [visibleMonth]);

  const selectedDayEvents = eventsByDay.get(format(selectedDate, "yyyy-MM-dd")) ?? [];

  function goToPreviousMonth() {
    setVisibleMonth((current) => subMonths(current, 1));
  }

  function goToNextMonth() {
    setVisibleMonth((current) => addMonths(current, 1));
  }

  function goToToday() {
    setVisibleMonth(MOCK_TODAY);
    setSelectedDate(MOCK_TODAY);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-medium text-brand-dark-blue sm:text-3xl">Calendario</h2>
          <p className="mt-1 text-gray-500">Consultas y vencimientos de recetas en un solo lugar</p>
        </div>
        <button
          type="button"
          onClick={goToToday}
          className="self-start rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-brand-dark-blue transition-colors hover:bg-gray-50 sm:self-auto"
        >
          Hoy
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[13fr_7fr]">
        {/* Grilla mensual */}
        <section className="rounded-2xl bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="font-heading text-lg font-bold text-brand-dark-blue">
              {capitalizeFirst(format(visibleMonth, "MMMM yyyy", { locale: es }))}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPreviousMonth}
                aria-label="Mes anterior"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-brand-dark-blue transition-colors hover:bg-gray-50"
              >
                <ChevronLeft aria-hidden="true" size={18} strokeWidth={ICON_STROKE_WIDTH} />
              </button>
              <button
                type="button"
                onClick={goToNextMonth}
                aria-label="Mes siguiente"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-brand-dark-blue transition-colors hover:bg-gray-50"
              >
                <ChevronRight aria-hidden="true" size={18} strokeWidth={ICON_STROKE_WIDTH} />
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1 text-center font-heading text-xs font-bold uppercase tracking-wide text-gray-400">
            {WEEKDAY_LABELS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1">
            {gridDays.map((day) => {
              const key = format(day, "yyyy-MM-dd");
              const dayEvents = eventsByDay.get(key) ?? [];
              const isCurrentMonth = isSameMonth(day, visibleMonth);
              const isSelected = isSameDay(day, selectedDate);
              const isMockToday = isSameDay(day, MOCK_TODAY);
              const severity = getDaySeverity(dayEvents);

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDate(day)}
                  aria-current={isMockToday ? "date" : undefined}
                  aria-pressed={isSelected}
                  className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-xl text-sm transition-colors ${
                    isSelected
                      ? "bg-brand-dark-blue text-white"
                      : severity
                        ? DAY_TINT[severity]
                        : isCurrentMonth
                          ? "text-brand-dark-blue hover:bg-brand-grey"
                          : "text-gray-300 hover:bg-brand-grey"
                  } ${isMockToday && !isSelected ? "ring-2 ring-inset ring-brand-yellow" : ""}`}
                >
                  <span className={isMockToday && !isSelected ? "font-bold" : undefined}>{format(day, "d")}</span>
                  <span className="flex h-1.5 items-center gap-0.5">
                    {dayEvents.slice(0, 3).map((event) => (
                      <span
                        key={event.id}
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : event.dot}`}
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-medium-aqua" />
              Confirmada / vigente
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-yellow" />
              Por vencer
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-dark-blue/30" />
              Completada
            </span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-red-500" />
              Cancelada / vencida
            </span>
          </div>
        </section>

        {/* Eventos del día seleccionado */}
        <section className="rounded-2xl bg-white p-6">
          <h3 className="font-display text-lg font-medium text-brand-dark-blue">
            {capitalizeFirst(format(selectedDate, "EEEE d 'de' MMMM", { locale: es }))}
          </h3>

          {selectedDayEvents.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">No tenés eventos este día.</p>
          ) : (
            <ul className="mt-4 flex flex-col gap-4">
              {selectedDayEvents.map((event) => (
                <li key={event.id} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-grey"
                  >
                    {event.kind === "consulta" ? (
                      <MessageCircle size={18} strokeWidth={ICON_STROKE_WIDTH} className="text-brand-dark-blue" />
                    ) : (
                      <Pill size={18} strokeWidth={ICON_STROKE_WIDTH} className="text-brand-dark-blue" />
                    )}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-heading font-bold text-brand-dark-blue">{event.title}</p>
                      <Badge variant={event.badgeVariant}>{event.badgeLabel}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{event.subtitle}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
