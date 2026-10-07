import { CompatibilityGuide } from "@/components/home/CompatibilityGuide";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeCta } from "@/components/home/HomeCta";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ImpactStats } from "@/components/home/ImpactStats";
import { Testimonials } from "@/components/home/Testimonials";
import { UrgentTicker } from "@/components/home/UrgentTicker";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <UrgentTicker />
      <HeroSection />
      <ImpactStats />
      <HowItWorks />
      <CompatibilityGuide />
      <Testimonials />
      <HomeCta />
    </div>
  );
}
