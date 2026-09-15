import { EumedicalCross } from "../ui/EumedicalCross";
import { content } from "../../i18n/content";
import { useLanguageStore } from "../../store/languageStore";

/** Banner de cierre antes de Contacto: mismo lenguaje visual (contenedor redondeado, cruz decorativa, CTA pill). */
export function ClosingCta() {
  const language = useLanguageStore((state) => state.language);
  const t = content[language].closingCta;

  return (
    <section className="bg-white px-6 py-20 sm:py-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-brand-dark-blue px-8 py-14 text-center sm:px-16 sm:py-16">
        <EumedicalCross
          size={320}
          color="#ffffff"
          className="pointer-events-none absolute -bottom-20 -left-20 rotate-[-12deg] opacity-[0.07]"
        />

        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            {t.titleLead} <span className="text-brand-medium-aqua">{t.titleHighlight}</span>
          </h2>
          <p className="mt-4 text-brand-light-aqua">{t.subtitle}</p>
          <a
            href="#contacto"
            className="mt-8 inline-block rounded-full bg-white px-7 py-3.5 font-heading font-bold text-brand-dark-blue shadow-sm transition-colors hover:bg-brand-grey"
          >
            {t.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
