import type { ReactNode } from "react";
import { FileText, Lock, Monitor } from "lucide-react";
import { EumedicalLogo } from "../ui/EumedicalLogo";

const ICON_SIZE = 22;
const ICON_STROKE_WIDTH = 1.75;

const BENEFITS = [
  { icon: Monitor, title: "Teleconsulta en segundos", description: "Sin filas ni traslados" },
  { icon: FileText, title: "Historial centralizado", description: "Estudios, recetas y consultas" },
  { icon: Lock, title: "100% seguro y privado", description: "Cifrado de extremo a extremo" },
] as const;

type AuthLayoutProps = {
  children: ReactNode;
};

/** Two-column split for authentication screens (login, register, password recovery). */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="flex flex-col gap-8 bg-brand-dark-blue px-6 py-8 lg:w-[38%] lg:justify-between lg:gap-0 lg:px-14 lg:py-14">
        <EumedicalLogo theme="dark" size={26} />

        <div className="lg:my-auto">
          <h1 className="max-w-md font-display text-3xl font-bold leading-tight text-white lg:text-4xl">
            Tu salud en tus manos, siempre.
          </h1>
          <p className="mt-4 max-w-sm font-heading text-brand-light-aqua">
            Accedé a tu historial, consultas y recetas desde un solo lugar.
          </p>

          <ul className="mt-10 hidden flex-col gap-6 lg:flex">
            {BENEFITS.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Icon aria-hidden="true" size={ICON_SIZE} strokeWidth={ICON_STROKE_WIDTH} className="text-brand-light-aqua" />
                </span>
                <div>
                  <p className="font-heading font-bold text-white">{title}</p>
                  <p className="text-sm text-brand-light-aqua">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="hidden text-xs text-white/50 lg:block">© 2024 eumedical · Atención internacional</p>
      </aside>

      <main className="flex flex-1 items-center justify-center bg-white px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
