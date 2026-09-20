import { ArrowRight, Globe, Hand, Home, Monitor, Power, Smartphone, Stethoscope, User, Wifi } from "lucide-react";
import { CrossBadge } from "./CrossBadge";

type CapabilityIconProps = {
  tone?: "light" | "dark";
  className?: string;
};

const TONE_STROKE = {
  light: "text-white",
  dark: "text-brand-dark-blue",
} as const;


/** Red medica propia: globo + 3 profesionales distribuidos alrededor, cada uno con la cruz de marca. */
export function RedMedicaIcon({ tone = "light", className = "" }: CapabilityIconProps) {
  const stroke = TONE_STROKE[tone];
  return (
    <div className={`relative h-16 w-16 ${className}`} role="img" aria-label="Red médica global de profesionales">
      <Globe aria-hidden="true" strokeWidth={1.5} className={`h-16 w-16 ${stroke}`} />
      <span className="absolute -top-1.5 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-brand-orange ring-2 ring-white/70">
        <User aria-hidden="true" strokeWidth={2} className="h-4 w-4 text-white" />
      </span>
      <span className="absolute -bottom-1.5 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange ring-2 ring-white/70">
        <User aria-hidden="true" strokeWidth={2} className="h-4 w-4 text-white" />
      </span>
      <span className="absolute -bottom-1.5 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange ring-2 ring-white/70">
        <User aria-hidden="true" strokeWidth={2} className="h-4 w-4 text-white" />
      </span>
      <CrossBadge size={9} className="absolute -top-2 -right-2" />
      <CrossBadge size={9} className="absolute bottom-0 left-[calc(50%-4px)]" />
    </div>
  );
}

/** Atención médica digital 24/7: mano + smartphone con un médico "en pantalla" y badge 24h. */
export function AtencionDigitalIcon({ tone = "light", className = "" }: CapabilityIconProps) {
  const stroke = TONE_STROKE[tone];
  return (
    <div className={`relative h-16 w-16 ${className}`} role="img" aria-label="Atención médica digital disponible 24/7">
      <Hand aria-hidden="true" strokeWidth={1.5} className={`absolute inset-x-0 bottom-0 h-11 w-11 ${stroke}`} />
      <Smartphone
        aria-hidden="true"
        strokeWidth={1.5}
        className={`absolute left-1/2 top-0 h-11 w-11 -translate-x-1/2 ${stroke}`}
      />
      <Stethoscope
        aria-hidden="true"
        strokeWidth={2}
        className="absolute left-1/2 top-3.5 h-4 w-4 -translate-x-1/2 text-brand-orange"
      />
      <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand-orange text-[9px] font-bold leading-none text-white ring-2 ring-white/70">
        24h
      </span>
    </div>
  );
}

/** Tecnología avanzada: dispositivos (monitor, smartphone, wifi, encendido) conectados entre sí. */
export function TecnologiaIcon({ tone = "light", className = "" }: CapabilityIconProps) {
  const stroke = TONE_STROKE[tone];
  const lineColor = tone === "light" ? "rgba(255,255,255,0.55)" : "rgba(30,72,101,0.35)";
  return (
    <div className={`relative h-16 w-16 ${className}`} role="img" aria-label="Tecnología propia de dispositivos conectados">
      <svg aria-hidden="true" viewBox="0 0 64 64" className="absolute inset-0 h-16 w-16">
        <line x1="14" y1="14" x2="50" y2="14" stroke={lineColor} strokeWidth={1.5} strokeDasharray="3 4" />
        <line x1="14" y1="14" x2="14" y2="50" stroke={lineColor} strokeWidth={1.5} strokeDasharray="3 4" />
        <line x1="50" y1="14" x2="50" y2="50" stroke={lineColor} strokeWidth={1.5} strokeDasharray="3 4" />
        <line x1="14" y1="50" x2="50" y2="50" stroke={lineColor} strokeWidth={1.5} strokeDasharray="3 4" />
      </svg>
      <Monitor aria-hidden="true" strokeWidth={1.5} className={`absolute left-0 top-0 h-6 w-6 ${stroke}`} />
      <Smartphone aria-hidden="true" strokeWidth={1.5} className={`absolute right-0 top-0 h-6 w-6 ${stroke}`} />
      <Wifi aria-hidden="true" strokeWidth={1.5} className={`absolute bottom-0 left-0 h-6 w-6 ${stroke}`} />
      <Power aria-hidden="true" strokeWidth={1.5} className={`absolute bottom-0 right-0 h-6 w-6 ${stroke}`} />
      <CrossBadge size={9} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}

/** Médicos a domicilio: profesional identificado con la cruz de marca, camino a una casa que también la lleva. */
export function MedicosDomicilioIcon({ tone = "light", className = "" }: CapabilityIconProps) {
  const stroke = TONE_STROKE[tone];
  return (
    <div className={`flex h-16 w-16 items-center justify-center gap-1.5 ${className}`} role="img" aria-label="Médicos coordinados a domicilio">
      <span className="relative shrink-0">
        <User aria-hidden="true" strokeWidth={1.5} className={`h-9 w-9 ${stroke}`} />
        <CrossBadge size={9} className="absolute -bottom-1 -right-1.5" />
      </span>
      <ArrowRight aria-hidden="true" strokeWidth={2} className={`h-4 w-4 shrink-0 ${stroke}`} />
      <span className="relative shrink-0">
        <Home aria-hidden="true" strokeWidth={1.5} className={`h-9 w-9 ${stroke}`} />
        <CrossBadge size={9} className="absolute -bottom-1 -right-1.5" />
      </span>
    </div>
  );
}
