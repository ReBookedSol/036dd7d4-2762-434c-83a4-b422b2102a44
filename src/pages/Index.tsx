import { Navbar } from "@/components/ui/navbar";
import { HeroSection } from "@/components/HeroSection";
import { SubjectsSection } from "@/components/SubjectsSection";
import { LatestPapersSection } from "@/components/LatestPapersSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SubjectsSection />
      <LatestPapersSection />
    </div>
  );
};

export default Index;
