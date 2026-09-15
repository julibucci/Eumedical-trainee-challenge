import { Globe } from "lucide-react";
import { EumedicalCross } from "../ui/EumedicalCross";
import { content } from "../../i18n/content";
import { useLanguageStore } from "../../store/languageStore";

/** Bloque de cobertura global: fondo azul marca sólido + la cruz de marca como recurso decorativo de fondo (mismo criterio que el Hero). */
export function CoverageBlock() {
  const language = useLanguageStore((state) => state.language);
  const t = content[language].coverageBlock;

  return (
    <section id="cobertura" className="relative overflow-hidden bg-brand-dark-blue px-6 py-20 sm:py-24">
      <EumedicalCross
        size={420}
        color="#ffffff"
        className="pointer-events-none absolute -bottom-28 -left-24 rotate-[-15deg] opacity-[0.06]"
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">{t.eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">{t.title}</h2>
          <p className="mt-5 max-w-xl text-brand-light-aqua">{t.paragraph1}</p>
          <p className="mt-4 max-w-xl text-brand-light-aqua">{t.paragraph2}</p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <span aria-hidden="true" className="flex h-40 w-40 items-center justify-center rounded-full bg-white/10 sm:h-48 sm:w-48">
            <Globe strokeWidth={1.25} className="h-24 w-24 text-brand-medium-aqua sm:h-28 sm:w-28" />
          </span>
        </div>
      </div>
    </section>
  );
}
