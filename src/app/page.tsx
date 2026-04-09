import NavbarPro from "@/components/NavbarPro";
import HeroRevamped from "@/components/HeroRevamped";
import DashboardShowcase from "@/components/DashboardShowcase";
import HowAIWorks from "@/components/HowAIWorks";
import GetStarted from "@/components/GetStarted";
import PricingSolana from "@/components/PricingSolana";
import FAQ from "@/components/FAQ";
import FooterPro from "@/components/FooterPro";

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <NavbarPro />

      <main className="pt-16">
        {/* 1. Hero - Le beau titre original */}
        <HeroRevamped />

        {/* 2. Dashboard - Le vrai dashboard showcase + What is Buddy */}
        <DashboardShowcase />

        {/* 3. How AI Works - Comment l'IA fonctionne */}
        <HowAIWorks />

        {/* 4. Get Started - Comment commencer */}
        <GetStarted />

        {/* 5. Pricing - Paiement SOL */}
        <PricingSolana />

        {/* 5. FAQ */}
        <FAQ />
      </main>

      {/* Footer */}
      <FooterPro />
    </>
  );
}
