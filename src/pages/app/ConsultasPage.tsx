import { useState } from "react";
import { MessageCircle, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { ConsultationCard } from "../../components/ui/ConsultationCard";
import { Button } from "../../components/ui/Button";
import { EumedicalCross } from "../../components/ui/EumedicalCross";
import { TeleconsultaModal } from "../../components/ui/TeleconsultaModal";
import { consultations } from "../../mocks/consultations";
import type { Consultation } from "../../types/consultation";

const ICON_STROKE_WIDTH = 1.75;

function handleReschedule(consultation: Consultation) {
  // Mock: en producción abriría el flujo real de reprogramación con confirmación — ver README.
  toast(`Reagendar consulta con ${consultation.doctor} (mock)`);
}

function handleCancel(consultation: Consultation) {
  // Mock: en producción pediría confirmación antes de cancelar — ver README.
  toast(`Consulta con ${consultation.doctor} cancelada (mock)`);
}

function handleNewConsultation() {
  // Mock: no se implementa el flujo completo de reserva en este alcance — ver README.
  toast("Flujo de reserva de consulta — próximamente");
}

export default function ConsultasPage() {
  const [consultationToJoin, setConsultationToJoin] = useState<Consultation | null>(null);
  const featured = consultations.reduce<Consultation | null>(
    (closest, current) => (!closest || current.daysUntil < closest.daysUntil ? current : closest),
    null,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-medium text-brand-dark-blue sm:text-3xl">Mis consultas</h2>
          <p className="mt-1 text-gray-500">Teleconsultas programadas</p>
        </div>
        <Button onClick={handleNewConsultation} className="inline-flex items-center gap-1.5 self-start sm:self-auto">
          <Plus aria-hidden="true" size={18} strokeWidth={ICON_STROKE_WIDTH} />
          Nueva consulta
        </Button>
      </div>

      {consultations.length === 0 ? (
        <div className="relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <EumedicalCross
            size={140}
            color="#1e4865"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
          />
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-light-aqua/50">
            <MessageCircle aria-hidden="true" size={28} strokeWidth={ICON_STROKE_WIDTH} className="text-brand-dark-blue" />
          </span>
          <h3 className="font-display text-lg font-medium text-brand-dark-blue">No tenés consultas programadas</h3>
          <p className="max-w-sm text-gray-500">Reservá tu próxima teleconsulta y la vas a ver acá, lista para unirte cuando llegue el momento.</p>
          <Button onClick={handleNewConsultation} className="mt-2 inline-flex items-center gap-1.5">
            <Plus aria-hidden="true" size={18} strokeWidth={ICON_STROKE_WIDTH} />
            Nueva consulta
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {consultations.map((consultation) => (
            <ConsultationCard
              key={consultation.id}
              consultation={consultation}
              isFeatured={consultation.id === featured?.id}
              onReschedule={handleReschedule}
              onCancel={handleCancel}
              onJoin={setConsultationToJoin}
            />
          ))}
        </div>
      )}

      <TeleconsultaModal
        isOpen={consultationToJoin !== null}
        onClose={() => setConsultationToJoin(null)}
        doctor={consultationToJoin?.doctor ?? ""}
        specialty={consultationToJoin?.specialty ?? ""}
      />
    </div>
  );
}
