import { ArrowDown } from "lucide-react";
import { journeySteps } from "../../mocks/services";
import { content } from "../../i18n/content";
import { useLanguageStore } from "../../store/languageStore";

const STEP_ACCENTS = ["bg-brand-dark-blue", "bg-brand-medium-aqua", "bg-brand-orange"] as const;

function scrollToExtendedServices() {
  document.getElementById("servicios-extendidos")?.scrollIntoView({ behavior: "smooth" });
}

/** Horizontal overview journey of the services: rounded card with a gradient connector line + 5 numbered steps, zoom hover, and a direct link to the full catalog below. */
export function ServicesJourney() {
  const language = useLanguageStore((state) => state.language);
  const t = content[language].servicesJourney;

  return (
    <section id="servicios" className="scroll-mt-24 bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-[1400px]">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">{t.eyebrow}</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold text-brand-dark-blue sm:text-4xl">{t.title}</h2>

        <div className="mt-10 overflow-x-auto rounded-[2rem] bg-brand-grey p-8 sm:p-12">
          <ol className="relative flex min-w-[640px] items-start justify-between gap-4 sm:min-w-0">
            <div
              aria-hidden="true"
              className="absolute left-8 right-8 top-8 h-0.5 bg-gradient-to-r from-brand-dark-blue via-brand-medium-aqua to-brand-orange opacity-25"
            />
            {journeySteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.id} className="relative flex flex-1 flex-col items-center gap-3 text-center">
                  <span className="relative">
                    <span
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full shadow-md transition-transform duration-200 hover:scale-110 ${STEP_ACCENTS[index % STEP_ACCENTS.length]}`}
                    >
                      <Icon aria-hidden="true" size={24} strokeWidth={1.75} className="text-white" />
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-brand-dark-blue shadow-sm"
                    >
                      {index + 1}
                    </span>
                  </span>
                  <p className="text-sm font-bold text-brand-dark-blue">{t.steps[step.id]}</p>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={scrollToExtendedServices}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-dark-blue/15 px-5 py-2.5 text-sm font-bold text-brand-dark-blue transition-colors hover:bg-brand-grey"
          >
            {t.moreLink}
            <ArrowDown aria-hidden="true" size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
}
