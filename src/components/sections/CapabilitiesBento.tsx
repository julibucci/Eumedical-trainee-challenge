import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { capabilities } from "../../mocks/services";
import { content } from "../../i18n/content";
import { useLanguageStore } from "../../store/languageStore";
import type { Capability } from "../../types/service";

type CardStyle = {
  container: string;
  heading: string;
  body: string;
  link: string;
  tone: "light" | "dark";
};

/** Estilos por tarjeta: 1 sólida en azul marca + 3 en tintes suaves (mismo criterio que Badge/PrescriptionCard: fondo saturado solo con texto blanco, nunca texto de color sobre fondo saturado). */
const CARD_STYLES: Record<string, CardStyle> = {
  "red-medica": {
    container: "bg-brand-dark-blue",
    heading: "text-white",
    body: "text-brand-light-aqua",
    link: "text-white",
    tone: "light",
  },
  "atencion-digital": {
    container: "bg-brand-pale-sage",
    heading: "text-brand-dark-blue",
    body: "text-brand-dark-blue/70",
    link: "text-brand-dark-blue",
    tone: "dark",
  },
  tecnologia: {
    container: "border border-gray-200 bg-white",
    heading: "text-brand-dark-blue",
    body: "text-gray-500",
    link: "text-brand-dark-blue",
    tone: "dark",
  },
  "medicos-domicilio": {
    container: "bg-brand-yellow/20",
    heading: "text-brand-dark-blue",
    body: "text-brand-dark-blue/70",
    link: "text-brand-dark-blue",
    tone: "dark",
  },
};

type CapabilityText = { title: string; description: string; detail: string };

function CapabilityCard({
  capability,
  text,
  style,
  moreInfoLabel,
  className = "",
}: {
  capability: Capability;
  text: CapabilityText;
  style: CardStyle;
  moreInfoLabel: string;
  className?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailId = useId();
  const Icon = capability.icon;

  return (
    <div
      className={`relative z-0 flex h-full flex-col rounded-3xl p-6 shadow-sm transition-all duration-200 ease-out hover:z-10 hover:-translate-y-1 hover:scale-[1.04] hover:shadow-xl sm:p-8 ${style.container} ${className}`}
    >
      <Icon tone={style.tone} />
      <h3 className={`mt-5 font-display text-xl font-bold ${style.heading}`}>{text.title}</h3>
      <p className={`mt-2 text-sm ${style.body}`}>{text.description}</p>

      <div className="mt-auto pt-4">
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={detailId}
          onClick={() => setIsExpanded((current) => !current)}
          className={`inline-flex w-fit items-center gap-1.5 text-sm font-bold hover:underline ${style.link}`}
        >
          {moreInfoLabel}
          <ChevronDown aria-hidden="true" size={16} strokeWidth={2} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </button>

        {isExpanded && (
          <p id={detailId} className={`mt-3 text-sm ${style.body}`}>
            {text.detail}
          </p>
        )}
      </div>
    </div>
  );
}

/** Bento grid de las 4 capacidades principales: misma altura en todas las tarjetas (la "grande" se distingue por ancho y color, no por desnivel), cada una con acordeón propio de "Más información" y efecto hover de zoom. */
export function CapabilitiesBento() {
  const language = useLanguageStore((state) => state.language);
  const t = content[language].capabilitiesBento;

  return (
    <section id="nosotros" className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">{t.eyebrow}</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold text-brand-dark-blue sm:text-4xl">
          {t.titleLead} <span className="whitespace-nowrap">{t.titleHighlight}</span>
        </h2>

        <div className="mt-10 grid gap-5 lg:grid-cols-5 lg:items-stretch">
          {capabilities.map((capability, index) => (
            <CapabilityCard
              key={capability.id}
              capability={capability}
              text={t.items[capability.id]}
              style={CARD_STYLES[capability.id]}
              moreInfoLabel={t.moreInfo}
              className={index === 0 ? "lg:col-span-2" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
