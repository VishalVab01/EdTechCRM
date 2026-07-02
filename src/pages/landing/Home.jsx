import BenefitsSection from "../../components/landing/BenefitsSection.jsx";
import BentoFeaturesSection from "../../components/landing/BentoFeaturesSection.jsx";
import FinalCTASection from "../../components/landing/FinalCTASection.jsx";
import HeroSection from "../../components/landing/HeroSection.jsx";
import PricingSection from "../../components/landing/PricingSection.jsx";
import ProductPreviewSection from "../../components/landing/ProductPreviewSection.jsx";
import StatsSection from "../../components/landing/StatsSection.jsx";
import TestimonialSection from "../../components/landing/TestimonialSection.jsx";
import TrustedBySection from "../../components/landing/TrustedBySection.jsx";
import LandingLayout from "./LandingLayout.jsx";

export default function Home() {
  return (
    <LandingLayout>
      <HeroSection />
      <TrustedBySection />
      <TestimonialSection />
      <StatsSection />
      <BenefitsSection />
      <ProductPreviewSection />
      <BentoFeaturesSection />
      <PricingSection />
      <FinalCTASection />
    </LandingLayout>
  );
}
