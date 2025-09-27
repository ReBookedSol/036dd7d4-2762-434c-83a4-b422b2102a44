import { Navbar } from "@/components/ui/navbar";
import { HeroSection } from "@/components/HeroSection";
import { SubjectsSection } from "@/components/SubjectsSection";
import { LatestPapersSection } from "@/components/LatestPapersSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SubjectsSection />
      <LatestPapersSection />
      <Footer />
    </div>
  );
};

export default Index;
