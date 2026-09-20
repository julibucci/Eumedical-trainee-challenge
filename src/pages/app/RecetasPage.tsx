import { useState } from "react";
import { Pill, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/Button";
import { PrescriptionCard } from "../../components/ui/PrescriptionCard";
import { EumedicalCross } from "../../components/ui/EumedicalCross";
import { prescriptions } from "../../mocks/prescriptions";
import { groupPrescriptionsByStatus } from "../../utils/groupPrescriptionsByStatus";
import type { Prescription, PrescriptionStatus } from "../../types/prescription";

const ICON_STROKE_WIDTH = 1.75;

// The label text is always navy (teal/gold/red as text color do not reach
// 4.5:1 AA on white): the differentiation by status is resolved with a colored dot.
const SECTIONS: Array<{ status: PrescriptionStatus; label: string; dot: string }> = [
  { status: "vigente", label: "Vigentes", dot: "bg-brand-medium-aqua" },
  { status: "porVencer", label: "Por vencer (próximos 5 días)", dot: "bg-brand-yellow" },
  { status: "vencida", label: "Vencidas", dot: "bg-red-500" },
];

type StatusFilter = "activas" | "vencidas" | "todas";

const FILTERS: Array<{ key: StatusFilter; label: string }> = [
  { key: "activas", label: "Vigentes y por vencer" },
  { key: "vencidas", label: "Vencidas" },
  { key: "todas", label: "Todas" },
];

function handleDownload(prescription: Prescription) {
  // Mock: there is no real PDF. In production it would download the real prescription from the backend — see README.
  toast(`Descargando receta de ${prescription.medication} (mock)`);
}

function handleRequestPrescription() {
  // Mock: there is no real request flow. In production it would be sent to the doctor — see README.
  toast("Solicitud de receta — próximamente");
}

export default function RecetasPage() {
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("activas");
  const groups = groupPrescriptionsByStatus(prescriptions);

  // By default ("activas") active + about-to-expire are shown; "vencidas" isolates the expired ones.
  const visibleSections = SECTIONS.filter(({ status }) => {
    if (activeFilter === "todas") return true;
    if (activeFilter === "vencidas") return status === "vencida";
    return status !== "vencida";
  });
  const hasVisibleItems = visibleSections.some(({ status }) => groups[status].length > 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-medium text-brand-dark-blue sm:text-3xl">Recetas médicas</h2>
          <p className="mt-1 text-gray-500">Prescripciones activas y vencidas</p>
        </div>
        {prescriptions.length > 0 && (
          <Button
            onClick={handleRequestPrescription}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus aria-hidden="true" size={18} strokeWidth={ICON_STROKE_WIDTH} />
            Solicitar receta
          </Button>
        )}
      </div>

      {prescriptions.length === 0 ? (
        <div className="relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <EumedicalCross
            size={140}
            color="#1e4865"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
          />
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-light-aqua/50">
            <Pill aria-hidden="true" size={28} strokeWidth={1.75} className="text-brand-dark-blue" />
          </span>
          <h3 className="font-display text-lg font-medium text-brand-dark-blue">No tenés recetas registradas</h3>
          <p className="max-w-sm text-gray-500">Agendá una consulta con tu médico para recibir tu primera receta digital.</p>
          <Link
            to="/app/consultas"
            className="mt-2 rounded-lg bg-brand-yellow px-4 py-2.5 font-heading font-bold text-brand-dark-blue transition-colors hover:bg-brand-yellow/90"
          >
            Agendar consulta
          </Link>
        </div>
      ) : (
        <>
          <div role="tablist" aria-label="Filtrar por estado" className="flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map(({ key, label }) => {
              const isActive = key === activeFilter;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(key)}
                  className={`shrink-0 rounded-full px-4 py-2 font-heading text-sm font-bold transition-colors ${
                    isActive ? "bg-brand-dark-blue text-white" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {hasVisibleItems ? (
            visibleSections.map(({ status, label, dot }) => {
              const items = groups[status];
              if (items.length === 0) return null;

              return (
                <section key={status}>
                  <p className="flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wide text-brand-dark-blue">
                    <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                    {label}
                  </p>
                  <div className="mt-3 flex flex-col gap-4">
                    {items.map((prescription) => (
                      <PrescriptionCard key={prescription.id} prescription={prescription} onDownload={handleDownload} />
                    ))}
                  </div>
                </section>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
              <p className="font-bold text-brand-dark-blue">No hay recetas para este filtro</p>
              <p className="mt-1 text-sm text-gray-500">Probá con otro filtro para ver el resto de tus recetas.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
