import { journeySteps } from "../../mocks/services";
import { content } from "../../i18n/content";
import { useLanguageStore } from "../../store/languageStore";

const STEP_ACCENTS = ["bg-brand-dark-blue", "bg-brand-medium-aqua", "bg-brand-orange"] as const;

function scrollToExtendedServices() {
  document.getElementById("servicios-extendidos")?.scrollIntoView({ behavior: "smooth" });
}

/** Recorrido horizontal resumen de los servicios (overview): línea conectora + 5 pasos, con acceso directo al catálogo completo de abajo. */
export function ServicesJourney() {
  const language = useLanguageStore((state) => state.language);
  const t = content[language].servicesJourney;

  return (
    <section id="servicios" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">{t.eyebrow}</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold text-brand-dark-blue sm:text-4xl">{t.title}</h2>

        <div className="mt-14 overflow-x-auto pb-2">
          <ol className="relative flex min-w-[640px] items-start justify-between gap-4 sm:min-w-0">
            <div aria-hidden="true" className="absolute left-7 right-7 top-7 h-px bg-brand-pale-sage" />
            {journeySteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.id} className="relative flex flex-1 flex-col items-center gap-3 text-center">
                  <span
                    className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${STEP_ACCENTS[index % STEP_ACCENTS.length]}`}
                  >
                    <Icon aria-hidden="true" size={22} strokeWidth={1.75} className="text-white" />
                  </span>
                  <p className="text-sm font-bold text-brand-dark-blue">{t.steps[step.id]}</p>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-8 text-center">
          <button type="button" onClick={scrollToExtendedServices} className="text-sm font-bold text-brand-orange hover:underline">
            {t.moreLink}
          </button>
        </div>
      </div>
    </section>
  );
}
