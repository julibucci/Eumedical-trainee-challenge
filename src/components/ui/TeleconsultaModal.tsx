import { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Mic, MicOff, Phone, Video, VideoOff } from "lucide-react";
import { EumedicalCross } from "./EumedicalCross";

const ICON_SIZE = 20;
const ICON_STROKE_WIDTH = 1.75;

type TeleconsultaModalProps = {
  isOpen: boolean;
  onClose: () => void;
  doctor: string;
  specialty: string;
};

function formatElapsed(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function initialsFromDoctorName(fullName: string): string {
  const words = fullName.replace(/^(Dr\.|Dra\.)\s*/i, "").trim().split(/\s+/);
  const first = words[0]?.charAt(0) ?? "";
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : "";
  return `${first}${last}`.toUpperCase();
}

/** Simula la pantalla de una videoconsulta (mock: no hay video/audio real, solo UI). */
export function TeleconsultaModal({ isOpen, onClose, doctor, specialty }: TeleconsultaModalProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setElapsedSeconds(0);
      setIsMicOn(true);
      setIsCameraOn(true);
      return;
    }
    const intervalId = window.setInterval(() => setElapsedSeconds((current) => current + 1), 1000);
    return () => window.clearInterval(intervalId);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/60" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
          {/* Área de video simulada: mismo degradado 45° navy→teal de marca. */}
          <div className="relative flex h-72 flex-col items-center justify-center gap-2 overflow-hidden bg-[linear-gradient(45deg,#1e4865_0%,#79b19c_200%)] px-6 text-center">
            <EumedicalCross
              size={160}
              color="#ffffff"
              className="pointer-events-none absolute -bottom-8 -right-8 -z-10 opacity-[0.07]"
            />
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-2xl font-bold text-white">
              {initialsFromDoctorName(doctor)}
            </span>
            <DialogTitle className="font-heading text-lg font-bold text-white">{doctor}</DialogTitle>
            <p className="font-heading text-sm text-brand-light-aqua">{specialty}</p>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1 text-xs font-bold text-white">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-red-500" />
              EN VIVO · {formatElapsed(elapsedSeconds)}
            </span>
            {!isCameraOn && !isMicOn ? (
              <p className="text-xs text-white/70">Tu cámara y tu micrófono están apagados</p>
            ) : !isCameraOn ? (
              <p className="text-xs text-white/70">Tu cámara está apagada</p>
            ) : !isMicOn ? (
              <p className="text-xs text-white/70">Tu micrófono está silenciado</p>
            ) : null}
          </div>

          {/* Controles: mic/cámara son decorativos (mock), "Finalizar" cierra el modal. */}
          <div className="flex items-center justify-center gap-4 px-6 py-5">
            <button
              type="button"
              onClick={() => setIsMicOn((current) => !current)}
              aria-label={isMicOn ? "Silenciar micrófono" : "Activar micrófono"}
              aria-pressed={!isMicOn}
              className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${
                isMicOn
                  ? "border-gray-300 text-brand-dark-blue hover:bg-gray-50"
                  : "border-transparent bg-brand-dark-blue text-white"
              }`}
            >
              {isMicOn ? (
                <Mic aria-hidden="true" size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />
              ) : (
                <MicOff aria-hidden="true" size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsCameraOn((current) => !current)}
              aria-label={isCameraOn ? "Apagar cámara" : "Encender cámara"}
              aria-pressed={!isCameraOn}
              className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${
                isCameraOn
                  ? "border-gray-300 text-brand-dark-blue hover:bg-gray-50"
                  : "border-transparent bg-brand-dark-blue text-white"
              }`}
            >
              {isCameraOn ? (
                <Video aria-hidden="true" size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />
              ) : (
                <VideoOff aria-hidden="true" size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} />
              )}
            </button>
            {/* Excepción intencional a "nunca rojo": el botón de colgar es una convención
                universal de videollamada (Zoom/Meet/Teams), no se percibe como un error. */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Finalizar llamada"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700"
            >
              <Phone aria-hidden="true" size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} className="rotate-[135deg]" />
            </button>
          </div>
          <p className="pb-5 text-center text-xs text-gray-400">
            Video simulado — no es una videollamada real (mock).
          </p>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
