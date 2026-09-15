import { Link } from "react-router-dom";
import { EumedicalLogo } from "../ui/EumedicalLogo";
import { content } from "../../i18n/content";
import { useLanguageStore } from "../../store/languageStore";

/** Placeholder: no hay un flujo de postulación real en el alcance de esta prueba — ver README. */
const JOIN_US_HREF = "#contacto";

/** Footer de la landing de marketing: logo, navegación ancla y links legales, fondo azul marca. */
export function MarketingFooter() {
  const language = useLanguageStore((state) => state.language);
  const t = content[language].footer;

  return (
    <footer className="bg-brand-dark-blue px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
        <EumedicalLogo theme="dark" size={20} />

        <nav aria-label="Navegación del pie de página" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-brand-light-aqua">
          {t.nav.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </a>
          ))}
          <a href={JOIN_US_HREF} className="hover:text-white">
            {t.joinUs}
          </a>
        </nav>

        <div className="flex items-center gap-6 text-sm text-brand-light-aqua">
          <Link to="/terminos" className="hover:text-white">
            {t.terms}
          </Link>
          <Link to="/privacidad" className="hover:text-white">
            {t.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
