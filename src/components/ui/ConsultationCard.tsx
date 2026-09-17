import { Apple, Bone, Calendar, Clock, HeartPulse, Stethoscope } from "lucide-react";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { EumedicalCross } from "./EumedicalCross";
import type { Consultation, ConsultationStatus, MedicalSpecialty } from "../../types/consultation";

const ICON_SIZE = 22;
const DETAIL_ICON_SIZE = 16;
const ICON_STROKE_WIDTH = 1.75;

const SPECIALTY_CONFIG: Record<MedicalSpecialty, { icon: typeof HeartPulse; bg: string; iconColor: string }> = {
  Cardiología: { icon: HeartPulse, bg: "bg-brand-orange/15", iconColor: "text-brand-orange" },
  "Medicina General": { icon: Stethoscope, bg: "bg-brand-light-aqua/50", iconColor: "text-brand-dark-blue" },
  Nutrición: { icon: Apple, bg: "bg-brand-medium-aqua/20", iconColor: "text-brand-dark-blue" },
  Traumatología: { icon: Bone, bg: "bg-brand-yellow/20", iconColor: "text-brand-dark-blue" },
};

const STATUS_LABEL: Record<ConsultationStatus, string> = {
  confirmada: "Confirmada",
  pendiente: "Pendiente",
  completada: "Completada",
  cancelada: "Cancelada",
};

function pluralDays(days: number): string {
  return days === 1 ? "1 día" : `${days} días`;
}

type ConsultationCardProps = {
  consultation: Consultation;
  /** La consulta más próxima: borde + franja destacada y único lugar donde aparece "Unirme". */
  isFeatured?: boolean;
  onReschedule?: (consultation: Consultation) => void;
  onCancel?: (consultation: Consultation) => void;
  onJoin?: (consultation: Consultation) => void;
};

/** Tarjeta reutilizable de consulta (Consultas hoy; pensada para reusarse en Historial más adelante). */
export function ConsultationCard({
  consultation,
  isFeatured = false,
  onReschedule,
  onCancel,
  onJoin,
}: ConsultationCardProps) {
  const { icon: Icon, bg, iconColor } = SPECIALTY_CONFIG[consultation.specialty];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-white ${
        isFeatured ? "border-2 border-brand-medium-aqua" : "border border-gray-200"
      }`}
    >
      {isFeatured && (
        <EumedicalCross
          size={90}
          color="#1e4865"
          className="pointer-events-none absolute -bottom-6 -right-6 -z-10 opacity-[0.06]"
        />
      )}
      {isFeatured && (
        <div className="bg-brand-medium-aqua/15 px-5 py-2">
          <p className="font-heading text-xs font-bold uppercase tracking-wide text-brand-dark-blue">
            Próxima · En {pluralDays(consultation.daysUntil)}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span aria-hidden="true" className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${bg}`}>
            <Icon size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} className={iconColor} />
          </span>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-heading font-bold text-brand-dark-blue">{consultation.doctor}</p>
              <Badge variant={consultation.status}>{STATUS_LABEL[consultation.status]}</Badge>
            </div>
            <p className="text-sm text-gray-500">{consultation.specialty}</p>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="flex items-center gap-1.5">
                <Calendar aria-hidden="true" size={DETAIL_ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />
                {consultation.date}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <Clock aria-hidden="true" size={DETAIL_ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />
                {consultation.time}
              </span>
              <span aria-hidden="true">·</span>
              <span>{consultation.modality}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
          <button
            type="button"
            onClick={() => onReschedule?.(consultation)}
            aria-label={`Reagendar consulta con ${consultation.doctor}`}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-brand-dark-blue transition-colors hover:bg-gray-50"
          >
            Reagendar
          </button>
          {/* Cancelar es una acción secundaria, no un error — nunca rojo (ver "Cerrar sesión"). */}
          <button
            type="button"
            onClick={() => onCancel?.(consultation)}
            aria-label={`Cancelar consulta con ${consultation.doctor}`}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold text-brand-dark-blue transition-colors hover:bg-gray-50"
          >
            Cancelar
          </button>
          {isFeatured && (
            <Button
              aria-label={`Unirme a la teleconsulta con ${consultation.doctor}`}
              onClick={() => onJoin?.(consultation)}
            >
              Unirme →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
