import { useState } from "react";
import { HistoryItem } from "../../components/ui/HistoryItem";
import { consultationHistory } from "../../mocks/consultationHistory";
import type { MedicalSpecialty } from "../../types/consultation";

const SPECIALTY_FILTERS: Array<MedicalSpecialty | "Todas las especialidades"> = [
  "Todas las especialidades",
  "Medicina General",
  "Cardiología",
  "Nutrición",
  "Traumatología",
];

export default function HistorialPage() {
  const [activeFilter, setActiveFilter] = useState<(typeof SPECIALTY_FILTERS)[number]>("Todas las especialidades");

  const filteredHistory =
    activeFilter === "Todas las especialidades"
      ? consultationHistory
      : consultationHistory.filter((consultation) => consultation.specialty === activeFilter);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-brand-dark-blue sm:text-3xl">Historial de consultas</h2>
        <p className="mt-1 text-gray-500">Registro cronológico de tu atención médica</p>
      </div>

      <div role="tablist" aria-label="Filtrar por especialidad" className="flex gap-2 overflow-x-auto pb-1">
        {SPECIALTY_FILTERS.map((filter) => {
          const isActive = filter === activeFilter;
          return (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                isActive ? "bg-brand-dark-blue text-white" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {filteredHistory.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <p className="font-bold text-brand-dark-blue">No tenés consultas registradas en esta especialidad todavía</p>
          <p className="mt-1 text-sm text-gray-500">Elegí otra especialidad o mirá el historial completo.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredHistory.map((consultation) => (
            <HistoryItem key={consultation.id} consultation={consultation} />
          ))}
        </div>
      )}
    </div>
  );
}
