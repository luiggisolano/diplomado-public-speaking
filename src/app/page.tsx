import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import HeroTransitionImage from "@/components/HeroTransitionImage";
import ProblemBlock from "@/components/ProblemBlock";
import SolutionBlock from "@/components/SolutionBlock";
import ModulesGrid from "@/components/ModulesGrid";
import AudienceBlock from "@/components/AudienceBlock";
import TransformationBlock from "@/components/TransformationBlock";
import MethodologyBlock from "@/components/MethodologyBlock";
import UrgencyBlock from "@/components/UrgencyBlock";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <HeroTransitionImage />
        <ProblemBlock />
        <SolutionBlock />
        <ModulesGrid />
        <AudienceBlock />
        <TransformationBlock />
        <MethodologyBlock />
        <UrgencyBlock />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
