import { lazy, Suspense, useEffect, useState } from "react";
import { EumedicalCross } from "../ui/EumedicalCross";
import { content } from "../../i18n/content";
import { useLanguageStore } from "../../store/languageStore";
import { globeMarkers } from "../../mocks/globeMarkers";

// d3-geo + topojson-client + el dataset de países (world-atlas) pesan ~130kB gzip — se separan en
// su propio chunk async para no engordar el bundle principal con algo que solo se usa acá abajo.
const InteractiveGlobe = lazy(() => import("../ui/InteractiveGlobe").then((module) => ({ default: module.InteractiveGlobe })));

function getGlobeSize() {
  if (typeof window === "undefined") return 300;
  const width = window.innerWidth;
  if (width < 480) return 240;
  if (width < 1024) return 340;
  return 420;
}

/**
 * Bloque de cobertura global: ocupa el viewport completo (`min-h-screen`) para que al saltar acá
 * desde el nav no se alcance a ver, ni asome, el título de la sección siguiente — fondo azul
 * marca sólido + la cruz de marca como recurso decorativo de fondo (mismo criterio que el Hero).
 */
export function CoverageBlock() {
  const language = useLanguageStore((state) => state.language);
  const t = content[language].coverageBlock;
  const [globeSize, setGlobeSize] = useState(getGlobeSize);

  useEffect(() => {
    function handleResize() {
      setGlobeSize(getGlobeSize());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      id="cobertura"
      className="relative flex min-h-screen scroll-mt-24 items-center overflow-hidden bg-brand-dark-blue px-6 py-24"
    >
      <EumedicalCross
        size={520}
        color="#ffffff"
        className="pointer-events-none absolute -bottom-32 -left-28 rotate-[-15deg] opacity-[0.06]"
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-orange">{t.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">{t.title}</h2>
          <p className="mt-6 max-w-xl text-lg text-brand-light-aqua">{t.paragraph1}</p>
          <p className="mt-5 max-w-xl text-lg text-brand-light-aqua">{t.paragraph2}</p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <Suspense fallback={<div aria-hidden="true" className="rounded-full bg-white/10" style={{ width: globeSize, height: globeSize }} />}>
            <InteractiveGlobe markers={globeMarkers} size={globeSize} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
