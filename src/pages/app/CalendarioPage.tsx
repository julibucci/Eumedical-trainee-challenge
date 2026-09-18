import { useMemo, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ChevronLeft, ChevronRight, MessageCircle, Pill, X } from "lucide-react";
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

// Cada evento se ve directo dentro del cuadrado del día como una "chip" de
// color (mismo criterio que ya usábamos: teal = al día, gold = atención pronto,
// navy = completado/neutral, rojo = cancelado o vencido — excepción real).
const EVENT_CHIP: Record<ConsultationStatus | PrescriptionStatus, string> = {
  confirmada: "bg-brand-medium-aqua/25 text-brand-dark-blue",
  pendiente: "bg-brand-medium-aqua/25 text-brand-dark-blue",
  vigente: "bg-brand-medium-aqua/25 text-brand-dark-blue",
  completada: "bg-brand-dark-blue/15 text-brand-dark-blue",
  porVencer: "bg-brand-yellow/35 text-brand-dark-blue",
  cancelada: "bg-red-100 text-red-700",
  vencida: "bg-red-100 text-red-700",
};

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
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);

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

  function openDay(day: Date) {
    setSelectedDate(day);
    setIsDayModalOpen(true);
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

      {/* Calendario a ancho completo: sin panel lateral fijo — el detalle del día
          se muestra en un pop-up (ver más abajo) al hacer click. */}
      <section className="flex-1 rounded-2xl bg-white p-5">
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

        <div className="mt-4 grid grid-cols-7 gap-1.5 text-center font-heading text-xs font-bold uppercase tracking-wide text-gray-400">
          {WEEKDAY_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="mt-1.5 grid grid-cols-7 gap-1.5">
          {gridDays.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDay.get(key) ?? [];
            const isCurrentMonth = isSameMonth(day, visibleMonth);
            const isSelected = isSameDay(day, selectedDate);
            const isMockToday = isSameDay(day, MOCK_TODAY);
            const visibleEvents = dayEvents.slice(0, 2);
            const hiddenCount = dayEvents.length - visibleEvents.length;

            return (
              <button
                key={key}
                type="button"
                onClick={() => openDay(day)}
                aria-current={isMockToday ? "date" : undefined}
                aria-pressed={isSelected}
                className={`flex h-20 flex-col items-stretch gap-0.5 overflow-hidden rounded-lg border-2 p-1.5 text-left transition-colors hover:bg-brand-grey ${
                  isSelected
                    ? "border-brand-dark-blue bg-white"
                    : isMockToday
                      ? "border-brand-yellow bg-brand-yellow/10"
                      : "border-gray-200 bg-white"
                }`}
              >
                <span
                  className={`text-xs ${
                    isMockToday || isSelected
                      ? "font-bold text-brand-dark-blue"
                      : isCurrentMonth
                        ? "text-brand-dark-blue"
                        : "text-gray-300"
                  }`}
                >
                  {format(day, "d")}
                </span>
                <span className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                  {visibleEvents.map((event) => (
                    <span
                      key={event.id}
                      className={`block truncate rounded px-1 py-0.5 text-[10px] font-bold leading-tight ${EVENT_CHIP[event.badgeVariant]}`}
                    >
                      {event.title}
                    </span>
                  ))}
                  {hiddenCount > 0 && <span className="text-[10px] font-bold text-gray-400">+{hiddenCount} más</span>}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-brand-medium-aqua" />
            Confirmada / vigente
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-brand-yellow" />
            Por vencer
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-brand-dark-blue/60" />
            Completada
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Cancelada / vencida
          </span>
        </div>
      </section>

      {/* Pop-up con el detalle del día elegido */}
      <Dialog open={isDayModalOpen} onClose={() => setIsDayModalOpen(false)} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/60" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <DialogTitle className="font-display text-lg font-medium text-brand-dark-blue">
                {capitalizeFirst(format(selectedDate, "EEEE d 'de' MMMM", { locale: es }))}
              </DialogTitle>
              <button
                type="button"
                onClick={() => setIsDayModalOpen(false)}
                aria-label="Cerrar"
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-brand-grey hover:text-brand-dark-blue"
              >
                <X aria-hidden="true" size={18} strokeWidth={ICON_STROKE_WIDTH} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
              {selectedDayEvents.length === 0 ? (
                <p className="text-sm text-gray-500">No tenés eventos este día.</p>
              ) : (
                <ul className="flex flex-col gap-4">
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
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
