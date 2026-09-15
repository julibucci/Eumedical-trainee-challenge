import { EumedicalCross } from "../ui/EumedicalCross";
import { content } from "../../i18n/content";
import { useLanguageStore } from "../../store/languageStore";

/** Hero asimétrico: sin foto de fondo, tipografía como protagonista + la cruz de marca como recurso gráfico decorativo (Brand Book sec. 2.1). */
export function Hero() {
  const language = useLanguageStore((state) => state.language);
  const t = content[language].hero;

  const stats = [
    { id: "paises", value: "80+", label: t.stats.paises },
    { id: "idiomas", value: "10+", label: t.stats.idiomas },
    { id: "disponibilidad", value: "24/7", label: t.stats.disponibilidad },
  ] as const;

  return (
    <section id="hero" className="relative overflow-hidden bg-brand-grey px-6 py-20 sm:py-28">
      <EumedicalCross
        size={440}
        color="#1e4865"
        className="pointer-events-none absolute -right-28 -top-32 rotate-[18deg] opacity-[0.07] sm:-right-16 sm:-top-24"
      />

      <div className="relative mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">{t.eyebrow}</p>

        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
          <span className="text-brand-dark-blue">{t.titleBlue}</span> <span className="text-brand-medium-aqua">{t.titleGreen}</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-brand-dark-blue/70">{t.subtitle}</p>
      </div>

      <div className="relative mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-3 sm:items-stretch">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`flex flex-col justify-center rounded-2xl p-6 shadow-sm ${
              stat.id === "disponibilidad" ? "bg-brand-dark-blue text-white" : "bg-white text-brand-dark-blue"
            }`}
          >
            <p className="font-display text-3xl font-bold">{stat.value}</p>
            <p className={`mt-1 text-sm ${stat.id === "disponibilidad" ? "text-brand-light-aqua" : "text-gray-500"}`}>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
