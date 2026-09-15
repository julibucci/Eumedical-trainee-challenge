import {
  Accessibility,
  Ambulance,
  Briefcase,
  Building2,
  ClipboardCheck,
  ClipboardList,
  Footprints,
  Globe,
  Headset,
  BedDouble,
  Clock,
  House,
  Monitor,
  Plane,
  ShieldCheck,
  Search,
  Stethoscope,
  UserCheck,
  Users,
  Video,
} from "lucide-react";
import { RedMedicaIcon, AtencionDigitalIcon, TecnologiaIcon, MedicosDomicilioIcon } from "../components/icons/CapabilityIcons";
import type { Capability, JourneyStep, Metric, Service } from "../types/service";

/** Texto (title/description/detail) en src/i18n/content.ts, keyed por `id`. */
export const capabilities: Capability[] = [
  { id: "red-medica", icon: RedMedicaIcon },
  { id: "atencion-digital", icon: AtencionDigitalIcon },
  { id: "tecnologia", icon: TecnologiaIcon },
  { id: "medicos-domicilio", icon: MedicosDomicilioIcon },
];

/** Título en src/i18n/content.ts, keyed por `id`. */
export const journeySteps: JourneyStep[] = [
  { id: "teleconsulta", icon: Video },
  { id: "coordinacion", icon: Globe },
  { id: "especialistas", icon: UserCheck },
  { id: "soporte-hospitalario", icon: BedDouble },
  { id: "seguimiento", icon: ClipboardCheck },
];

/** `title` es el nombre de marca (ya en inglés, no se traduce); `description` en src/i18n/content.ts. */
export const services: Service[] = [
  // Atención médica
  { id: "fit-to-fly", category: "atencion-medica", title: "Fit to fly", icon: Plane, secondaryIcon: ShieldCheck },
  { id: "house-calls", category: "atencion-medica", title: "House calls", icon: House, secondaryIcon: Stethoscope },
  {
    id: "teleconsultation",
    category: "atencion-medica",
    title: "24/7 Teleconsultation",
    icon: Video,
    secondaryIcon: Stethoscope,
  },
  {
    id: "medical-rounds",
    category: "atencion-medica",
    title: "Medical rounds",
    icon: Users,
    secondaryIcon: ClipboardCheck,
  },
  {
    id: "specialist-doctors",
    category: "atencion-medica",
    title: "Specialist doctors",
    icon: UserCheck,
    secondaryIcon: Stethoscope,
  },
  // Coordinación y logística
  { id: "ambulance-coordination", category: "coordinacion-logistica", title: "Ambulance coordination", icon: Ambulance },
  {
    id: "clinic-coordination",
    category: "coordinacion-logistica",
    title: "Clinic coordination",
    icon: Building2,
    secondaryIcon: Stethoscope,
  },
  {
    id: "medical-escort",
    category: "coordinacion-logistica",
    title: "Medical escort",
    icon: UserCheck,
    secondaryIcon: Footprints,
  },
  {
    id: "medical-operation-center",
    category: "coordinacion-logistica",
    title: "24/7 Medical operation center",
    icon: Headset,
    secondaryIcon: Clock,
  },
  // Soporte especializado
  {
    id: "medical-audits",
    category: "soporte-especializado",
    title: "Medical audits",
    icon: ClipboardList,
    secondaryIcon: Search,
  },
  {
    id: "hospital-support",
    category: "soporte-especializado",
    title: "Hospital support",
    icon: BedDouble,
    secondaryIcon: Stethoscope,
  },
  {
    id: "global-remote-guidance",
    category: "soporte-especializado",
    title: "Global medical remote guidance",
    icon: Monitor,
    secondaryIcon: Globe,
  },
  {
    id: "socio-sanitary-support",
    category: "soporte-especializado",
    title: "Socio-sanitary support",
    icon: Accessibility,
    secondaryIcon: Users,
  },
  {
    id: "medical-support-events",
    category: "soporte-especializado",
    title: "Medical support at events",
    icon: Briefcase,
    secondaryIcon: Stethoscope,
  },
];

/** Label en src/i18n/content.ts, keyed por `id`. */
export const trustMetrics: Metric[] = [
  { id: "pacientes", value: "90k" },
  { id: "medicos", value: "250" },
  { id: "recetas", value: "70k" },
  { id: "especialidades", value: "10" },
];
