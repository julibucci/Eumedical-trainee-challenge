import { useId, useState } from "react";
import { ChevronDown, MessageCircle, X } from "lucide-react";
import { Badge } from "./Badge";
import type { Consultation } from "../../types/consultation";

const ICON_SIZE = 20;
const ICON_STROKE_WIDTH = 1.75;

type HistoryItemProps = {
  consultation: Consultation;
};

/** Expandable row (accordion) of a past, completed or cancelled consultation. */
export function HistoryItem({ consultation }: HistoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentId = useId();
  const isCancelled = consultation.status === "cancelada";

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        className="flex w-full items-center gap-4 p-5 text-left"
      >
        <span
          aria-hidden="true"
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
            isCancelled ? "bg-red-100" : "bg-gray-100"
          }`}
        >
          {isCancelled ? (
            <X size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} className="text-red-600" />
          ) : (
            <MessageCircle size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} className="text-brand-dark-blue" />
          )}
        </span>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-heading font-bold text-brand-dark-blue">{consultation.doctor}</p>
            <Badge variant={isCancelled ? "cancelada" : "completada"}>
              {isCancelled ? "Cancelada" : "Completada"}
            </Badge>
          </div>
          <p className="text-sm text-gray-500">
            {consultation.specialty} · {consultation.date} · {consultation.time}
          </p>
        </div>

        <ChevronDown
          aria-hidden="true"
          size={18}
          strokeWidth={ICON_STROKE_WIDTH}
          className={`shrink-0 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {isExpanded && (
        <div id={contentId} className="border-t border-gray-100 px-5 py-4">
          <p className="font-bold text-brand-dark-blue">Resumen de la consulta</p>
          <p className="mt-1 text-sm text-gray-500">
            Detalle simulado — en producción este panel mostraría el motivo de consulta, las notas
            del médico y las indicaciones registradas durante la atención real.
          </p>
        </div>
      )}
    </div>
  );
}
