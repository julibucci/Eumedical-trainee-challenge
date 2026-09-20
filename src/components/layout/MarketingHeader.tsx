import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import { EumedicalLogo } from "../ui/EumedicalLogo";
import { content } from "../../i18n/content";
import { useLanguageStore, type Language } from "../../store/languageStore";
import { useActiveSection } from "../../hooks/useActiveSection";

/** Flags as own SVG: flag emoji do not render as an image on Windows (Segoe UI Emoji shows the country letters instead of the icon). */
function FlagUS() {
  return (
    <svg width="18" height="12.6" viewBox="0 0 20 14" aria-hidden="true" className="shrink-0 rounded-sm">
      <rect width="20" height="14" fill="#B22234" />
      <rect y="1.08" width="20" height="1.08" fill="#fff" />
      <rect y="3.23" width="20" height="1.08" fill="#fff" />
      <rect y="5.38" width="20" height="1.08" fill="#fff" />
      <rect y="7.54" width="20" height="1.08" fill="#fff" />
      <rect y="9.69" width="20" height="1.08" fill="#fff" />
      <rect y="11.85" width="20" height="1.08" fill="#fff" />
      <rect width="8" height="7.54" fill="#3C3B6E" />
    </svg>
  );
}

function FlagES() {
  return (
    <svg width="18" height="12.6" viewBox="0 0 20 14" aria-hidden="true" className="shrink-0 rounded-sm">
      <rect width="20" height="14" fill="#AA151B" />
      <rect y="3.5" width="20" height="7" fill="#F1BF00" />
    </svg>
  );
}

const LANGUAGE_OPTIONS: { code: Language; label: string; Flag: () => ReactNode }[] = [
  { code: "en", label: "English", Flag: FlagUS },
  { code: "es", label: "Español", Flag: FlagES },
];

/** Selector with dropdown */
function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = LANGUAGE_OPTIONS.find((option) => option.code === language) ?? LANGUAGE_OPTIONS[0];

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Language: ${current.label}`}
        onClick={() => setIsOpen((value) => !value)}
        style={{ width: 142, height: 40, borderRadius: 9 }}
        className="flex items-center justify-between gap-2 bg-white px-3 text-sm text-gray-900 shadow-sm"
      >
        <span className="flex items-center gap-2">
          <current.Flag />
          {current.label}
        </span>
        {isOpen ? (
          <ChevronUp aria-hidden="true" size={16} strokeWidth={2} className="text-gray-500" />
        ) : (
          <ChevronDown aria-hidden="true" size={16} strokeWidth={2} className="text-gray-500" />
        )}
      </button>

      <div
        role="menu"
        aria-label="Language options"
        aria-hidden={!isOpen}
        style={{ width: 142, borderRadius: 9 }}
        className={`absolute left-0 top-full z-20 mt-1 origin-top overflow-hidden bg-white shadow-md transition-all duration-150 ease-out ${
          isOpen ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"
        }`}
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <button
            key={option.code}
            type="button"
            role="menuitem"
            tabIndex={isOpen ? 0 : -1}
            onClick={() => {
              setLanguage(option.code);
              setIsOpen(false);
            }}
            className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-gray-900 hover:bg-gray-50 ${
              option.code === language ? "bg-gray-100" : "bg-white"
            }`}
          >
            <option.Flag />
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Marketing landing header: logo, anchor nav to sections, real language selector (see useLanguageStore) and CTA. */
export function MarketingHeader() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const language = useLanguageStore((state) => state.language);
  const t = content[language].header;

  const sectionIds = useMemo(() => [...new Set(t.nav.map((link) => link.href.slice(1)))], [t.nav]);
  const activeSectionId = useActiveSection(sectionIds);


  function isLinkActive(href: string, index: number) {
    if (activeSectionId === null || href !== `#${activeSectionId}`) return false;
    return t.nav.findIndex((link) => link.href === href) === index;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-[1560px] items-center justify-between gap-4">
        <EumedicalLogo size={44} className="lg:-ml-20" />

        <nav aria-label="Navegación principal" className="hidden flex-1 items-center justify-center gap-2 text-base font-heading font-bold lg:flex">
          {t.nav.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={isLinkActive(link.href, index) ? "true" : undefined}
              className={`rounded-full px-4 py-1.5 transition-colors ${
                isLinkActive(link.href, index)
                  ? "bg-brand-dark-blue text-white"
                  : "text-brand-dark-blue hover:bg-brand-grey"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <LanguageSwitcher />
        </div>

        <button
          type="button"
          aria-label={isMobileNavOpen ? t.closeMenu : t.openMenu}
          aria-expanded={isMobileNavOpen}
          onClick={() => setIsMobileNavOpen((current) => !current)}
          className="rounded-lg p-2 hover:bg-brand-grey lg:hidden"
        >
          {isMobileNavOpen ? (
            <X aria-hidden="true" size={22} strokeWidth={1.75} className="text-brand-dark-blue" />
          ) : (
            <Menu aria-hidden="true" size={22} strokeWidth={1.75} className="text-brand-dark-blue" />
          )}
        </button>
      </div>

      {isMobileNavOpen && (
        <div className="mx-auto mt-4 flex max-w-[1560px] flex-col gap-4 border-t border-gray-100 pt-4 lg:hidden">
          <nav aria-label="Navegación principal" className="flex flex-col items-start gap-2 text-base font-heading font-bold">
            {t.nav.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                aria-current={isLinkActive(link.href, index) ? "true" : undefined}
                onClick={() => setIsMobileNavOpen(false)}
                className={`rounded-full px-4 py-1.5 transition-colors ${
                  isLinkActive(link.href, index) ? "bg-brand-dark-blue text-white" : "text-brand-dark-blue"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col items-start gap-3">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
