import { Link } from "react-router-dom";
import { EumedicalLogo } from "../ui/EumedicalLogo";
import { content } from "../../i18n/content";
import { useLanguageStore } from "../../store/languageStore";

/** Placeholder: no hay un flujo de postulación real en el alcance de esta prueba — ver README. */
const JOIN_US_HREF = "#contacto";

/** Footer de la landing de marketing: logo + dos columnas de links en vertical (navegación / legal), fondo azul marca. */
export function MarketingFooter() {
  const language = useLanguageStore((state) => state.language);
  const t = content[language].footer;

  return (
    <footer className="bg-brand-dark-blue px-6 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <EumedicalLogo theme="dark" size={22} />
        </div>

        <nav aria-label="Navegación del pie de página">
          <p className="text-xs font-bold uppercase tracking-wide text-white/50">{t.navHeading}</p>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-brand-light-aqua">
            {t.nav.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href={JOIN_US_HREF} className="hover:text-white">
                {t.joinUs}
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-white/50">{t.legalHeading}</p>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-brand-light-aqua">
            <li>
              <Link to="/terminos" className="hover:text-white">
                {t.terms}
              </Link>
            </li>
            <li>
              <Link to="/privacidad" className="hover:text-white">
                {t.privacy}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6">
        <p className="text-xs text-white/50">© 2024 eumedical · Atención internacional</p>
      </div>
    </footer>
  );
}
