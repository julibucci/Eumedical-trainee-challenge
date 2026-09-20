import { Clock, Globe, Users } from "lucide-react";
import { EumedicalCross } from "../ui/EumedicalCross";
import { content } from "../../i18n/content";
import { useLanguageStore } from "../../store/languageStore";

/** Banner de cierre antes de Contacto: degradé a 45° (mismo criterio de ángulo del Brand Book, y misma combinación azul→verde que ya usa la tarjeta de "Próxima consulta" del área de paciente), sello de marca, y 3 puntos de confianza reforzando el mensaje sin repetir las métricas del Hero. */
export function ClosingCta() {
  const language = useLanguageStore((state) => state.language);
  const t = content[language].closingCta;

  const trustPoints = [
    { id: "coverage", icon: Globe, label: t.trustPoints.coverage },
    { id: "availability", icon: Clock, label: t.trustPoints.availability },
    { id: "network", icon: Users, label: t.trustPoints.network },
  ];

  return (
    <section className="bg-white px-6 py-20 sm:py-24">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2.5rem] bg-[linear-gradient(45deg,#1e4865,#153347)] px-8 py-16 text-center sm:px-16 sm:py-20">
        <EumedicalCross
          size={320}
          color="#ffffff"
          className="pointer-events-none absolute -bottom-20 -left-20 rotate-[-12deg] opacity-[0.07]"
        />
        <EumedicalCross
          size={220}
          color="#ffffff"
          className="pointer-events-none absolute -right-16 -top-16 rotate-[15deg] opacity-[0.06]"
        />

        <div className="relative mx-auto max-w-2xl">
          <span aria-hidden="true" className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange">
            <EumedicalCross size={26} color="#ffffff" />
          </span>

          <h2 className="mt-6 font-display text-4xl font-bold text-white sm:text-5xl">
            {t.titleLead} <span className="text-brand-medium-aqua">{t.titleHighlight}</span>
          </h2>
          <p className="mt-5 text-lg text-brand-light-aqua">{t.subtitle}</p>

          <a
            href="#contacto"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 font-heading font-bold text-brand-dark-blue shadow-sm transition-colors hover:bg-brand-grey"
          >
            {t.cta}
          </a>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-white/10 pt-8">
            {trustPoints.map(({ id, icon: Icon, label }) => (
              <div key={id} className="flex items-center gap-2 text-sm font-bold text-white">
                <Icon aria-hidden="true" size={18} strokeWidth={1.75} className="text-brand-medium-aqua" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
