import { Pill } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { PrescriptionCard } from "../../components/ui/PrescriptionCard";
import { prescriptions } from "../../mocks/prescriptions";
import { groupPrescriptionsByStatus } from "../../utils/groupPrescriptionsByStatus";
import type { Prescription, PrescriptionStatus } from "../../types/prescription";

const SECTIONS: Array<{ status: PrescriptionStatus; label: string; color: string }> = [
  { status: "vigente", label: "Vigentes", color: "text-emerald-700" },
  { status: "porVencer", label: "Por vencer (próximos 5 días)", color: "text-amber-700" },
  { status: "vencida", label: "Vencidas", color: "text-red-700" },
];

function handleDownload(prescription: Prescription) {
  // Mock: no hay PDF real. En producción descargaría la receta real del backend — ver README.
  toast(`Descargando receta de ${prescription.medication} (mock)`);
}

export default function RecetasPage() {
  const groups = groupPrescriptionsByStatus(prescriptions);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-brand-dark-blue sm:text-3xl">Recetas médicas</h2>
        <p className="mt-1 text-gray-500">Prescripciones activas y vencidas</p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-light-aqua/50">
            <Pill aria-hidden="true" size={28} strokeWidth={1.75} className="text-brand-dark-blue" />
          </span>
          <h3 className="font-display text-lg font-bold text-brand-dark-blue">No tenés recetas registradas</h3>
          <p className="max-w-sm text-gray-500">Agendá una consulta con tu médico para recibir tu primera receta digital.</p>
          <Link
            to="/app/consultas"
            className="mt-2 rounded-lg bg-brand-orange px-4 py-2.5 font-heading font-bold text-white transition-colors hover:bg-brand-orange/90"
          >
            Agendar consulta
          </Link>
        </div>
      ) : (
        SECTIONS.map(({ status, label, color }) => {
          const items = groups[status];
          if (items.length === 0) return null;

          return (
            <section key={status}>
              <p className={`text-xs font-bold uppercase tracking-wide ${color}`}>{label}</p>
              <div className="mt-3 flex flex-col gap-4">
                {items.map((prescription) => (
                  <PrescriptionCard key={prescription.id} prescription={prescription} onDownload={handleDownload} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
