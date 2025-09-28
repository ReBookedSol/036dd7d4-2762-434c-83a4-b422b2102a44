import { Button as UIButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BookOpenCheck, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const HERO_IMAGE_URL = "https://images.pexels.com/photos/5905959/pexels-photo-5905959.jpeg";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-center bg-cover" style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}>
      <div className="absolute inset-0 bg-gradient-to-br from-black/25 via-brand-teal-pale/20 to-black/20" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-[520px] py-24 px-4">
        <Badge variant="secondary" className="w-fit bg-brand-teal-light text-brand-teal-dark border-brand-teal/20 mb-4">
          <TrendingUp className="h-3 w-3 mr-1" />
          Trusted by 50,000+ Students
        </Badge>

        <h1 className="text-4xl lg:text-6xl font-bold leading-tight max-w-3xl mx-auto drop-shadow-2xl">
          <span className="text-text-hero">Master Your</span><br />
          <span className="bg-gradient-to-r from-brand-teal to-brand-teal-dark bg-clip-text text-transparent">Exams</span>
          <span className="text-text-hero"> with Past Papers</span>
        </h1>

        <p className="text-lg text-text-muted max-w-2xl mx-auto mt-4 drop-shadow-md">
          Access thousands of high-quality past exam papers, study guides, and resources. Boost your confidence and excel in your studies with ReBooked Genius.
        </p>

        <div className="flex gap-4 mt-6">
          <Link to="/study-guides">
            <UIButton size="lg" className="bg-primary hover:bg-brand-teal-dark">
              <BookOpenCheck className="h-4 w-4 mr-2" />
              Start Learning
            </UIButton>
          </Link>
          <Link to="/subjects">
            <UIButton variant="outline" size="lg">
              Browse Subjects
            </UIButton>
          </Link>
        </div>
      </div>

      {/* Floating badges */}
      <div className="absolute bottom-8 left-8 hidden md:block">
        <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <div>
              <div className="font-semibold text-sm">Grade A+</div>
              <div className="text-xs text-text-muted">Average improvement across active learners</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-8 right-8 hidden md:block">
        <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <div className="font-semibold text-sm">2025 Papers</div>
              <div className="text-xs text-text-muted">Now available — latest editions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
