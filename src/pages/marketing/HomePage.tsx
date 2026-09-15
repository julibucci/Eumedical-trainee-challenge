import { MarketingHeader } from "../../components/layout/MarketingHeader";
import { MarketingFooter } from "../../components/layout/MarketingFooter";
import { Hero } from "../../components/sections/Hero";
import { CapabilitiesBento } from "../../components/sections/CapabilitiesBento";
import { ServicesJourney } from "../../components/sections/ServicesJourney";
import { ExtendedServicesGrid } from "../../components/sections/ExtendedServicesGrid";
import { CoverageBlock } from "../../components/sections/CoverageBlock";
import { TrustMetrics } from "../../components/sections/TrustMetrics";
import { TestimonialsCarousel } from "../../components/sections/TestimonialsCarousel";
import { ClosingCta } from "../../components/sections/ClosingCta";
import { ContactSection } from "../../components/sections/ContactSection";

/** Landing de marketing (Parte A): reinterpretación propia del rebranding de Eumedical sobre el Brand Book real. */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />
      <main>
        <Hero />
        <CapabilitiesBento />
        <ServicesJourney />
        <ExtendedServicesGrid />
        <CoverageBlock />
        <TrustMetrics />
        <TestimonialsCarousel />
        <ClosingCta />
        <ContactSection />
      </main>
      <MarketingFooter />
    </div>
  );
}
