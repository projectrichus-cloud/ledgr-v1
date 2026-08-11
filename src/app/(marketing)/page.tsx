import { MarketingNav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Features } from "@/components/marketing/features";
import { Testimonials } from "@/components/marketing/testimonials";
import { Pricing } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";
import { CtaBand } from "@/components/marketing/cta-band";
import { MarketingFooter } from "@/components/marketing/footer";

export default function LandingPage() {
  return (
    <>
      <MarketingNav />
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />
      <Faq />
      <CtaBand />
      <MarketingFooter />
    </>
  );
}
