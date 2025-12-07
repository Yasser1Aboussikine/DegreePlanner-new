import HeroSection from "../components/HeroSection";
import GetStarted from "../components/GetStarted";
import FeaturesSection from "../components/FeaturesSection";
import TechStackSection from "../components/TechStackSection";
import Header from "../components/Header";

export default function Home() {
    return (
        <div>
            <Header />
            <HeroSection />
            <FeaturesSection />
            <TechStackSection />
            <GetStarted />
        </div>
    )
}