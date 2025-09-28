import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";
import { SubjectsSection } from "@/components/SubjectsSection";

const Subjects = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <SubjectsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Subjects;
