import { services } from "../../mocks/services";
import { ServiceIcon } from "../icons/ServiceIcon";
import { content } from "../../i18n/content";
import { useLanguageStore } from "../../store/languageStore";
import type { Service, ServiceCategory } from "../../types/service";

type CategoryStyle = {
  labelColor: string;
  cardBg: string;
  iconColor: string;
};

const CATEGORY_ORDER: ServiceCategory[] = ["atencion-medica", "coordinacion-logistica", "soporte-especializado"];

/**
 * Colores accesibles por categoría: el mismo criterio que ya usan Badge/PrescriptionCard en el resto
 * del proyecto (fondo tinte suave + texto oscuro, nunca el color de marca sólido como texto —
 * ni el verde ni el naranja de marca cumplen AA sobre fondo claro).
 */
const CATEGORY_STYLES: Record<ServiceCategory, CategoryStyle> = {
  "atencion-medica": { labelColor: "text-emerald-800", cardBg: "bg-brand-pale-sage", iconColor: "text-emerald-800" },
  "coordinacion-logistica": { labelColor: "text-brand-dark-blue", cardBg: "bg-brand-dark-blue/10", iconColor: "text-brand-dark-blue" },
  "soporte-especializado": { labelColor: "text-amber-800", cardBg: "bg-brand-yellow/20", iconColor: "text-amber-800" },
};

function ServiceCard({ service, description, style }: { service: Service; description: string; style: CategoryStyle }) {
  return (
    <div
      className={`flex flex-col items-start gap-3 rounded-3xl p-5 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg ${style.cardBg}`}
    >
      <ServiceIcon icon={service.icon} secondaryIcon={service.secondaryIcon} accentClassName={style.iconColor} label={service.title} />
      <div>
        <h4 className="font-heading text-sm font-bold uppercase tracking-wide text-brand-dark-blue">{service.title}</h4>
        <p className="mt-1 text-sm text-brand-dark-blue/70">{description}</p>
      </div>
    </div>
  );
}

/** Grid extendido de los 14 servicios reales, agrupados en las 3 categorías del Brand Book. */
export function ExtendedServicesGrid() {
  const language = useLanguageStore((state) => state.language);
  const t = content[language].extendedServicesGrid;

  return (
    <section id="servicios-extendidos" className="scroll-mt-24 bg-brand-grey px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">{t.eyebrow}</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold text-brand-dark-blue sm:text-4xl">{t.title}</h2>

        <div className="mt-12 flex flex-col gap-12">
          {CATEGORY_ORDER.map((category) => {
            const style = CATEGORY_STYLES[category];
            const categoryServices = services.filter((service) => service.category === category);

            return (
              <div key={category}>
                <h3 className={`text-sm font-bold uppercase tracking-[0.15em] ${style.labelColor}`}>{t.categories[category]}</h3>
                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {categoryServices.map((service) => (
                    <ServiceCard key={service.id} service={service} description={t.descriptions[service.id]} style={style} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
