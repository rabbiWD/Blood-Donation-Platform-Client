import { BloodDonationFaq } from "@/components/home/BloodDonationFaq";
import { CompatibilityGuide } from "@/components/home/CompatibilityGuide";
import { DonationEligibilityChecker } from "@/components/home/DonationEligibilityChecker";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeCta } from "@/components/home/HomeCta";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ImpactStats } from "@/components/home/ImpactStats";
import { Testimonials } from "@/components/home/Testimonials";
import { TopLifesaverDonors } from "@/components/home/TopLifesaverDonors";
import { UrgentLiveRequests } from "@/components/home/UrgentLiveRequests";
import { UrgentTicker } from "@/components/home/UrgentTicker";
import { WhyDonateBlood } from "@/components/home/WhyDonateBlood";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <UrgentTicker />
      <HeroSection />
      <ImpactStats />
      <UrgentLiveRequests />
      <HowItWorks />
      <TopLifesaverDonors />
      <CompatibilityGuide />
      <DonationEligibilityChecker />
      <WhyDonateBlood />
      <BloodDonationFaq />
      <Testimonials />
      <HomeCta />
    </div>
  );
}
