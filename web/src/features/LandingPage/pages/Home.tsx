import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import MotivationSection from "../components/MotivationSection";
import TechStackSection from "../components/TechStackSection";
import Footer from "../components/Footer";
import PremiumBackground from "../components/PremiumBackground";
import CursorSpark from "../components/CursorSpark";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full font-sans selection:bg-emerald-700 selection:text-white">
      <PremiumBackground />
      <CursorSpark />
      <Header />
      <HeroSection />
      <FeaturesSection />
      <TechStackSection />
      <MotivationSection />
      <Footer />
    </div>
  );
}
