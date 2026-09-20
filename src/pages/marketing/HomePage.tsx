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

/** Marketing landing (Part A): own reinterpretation of Eumedical's rebranding on top of the real Brand Book. */
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
