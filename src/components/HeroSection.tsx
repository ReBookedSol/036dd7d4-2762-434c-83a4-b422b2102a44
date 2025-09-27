import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BookOpenCheck, Calendar } from "lucide-react";

const HERO_IMAGE_URL = "https://images.pexels.com/photos/5905959/pexels-photo-5905959.jpeg";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-brand-teal-pale to-accent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <Badge variant="secondary" className="w-fit bg-brand-teal-light text-brand-teal-dark border-brand-teal/20">
              <TrendingUp className="h-3 w-3 mr-1" />
              Trusted by 50,000+ Students
            </Badge>
            
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="text-text-hero">Master Your</span><br />
                <span className="bg-gradient-to-r from-brand-teal to-brand-teal-dark bg-clip-text text-transparent">Exams</span>
                <span className="text-text-hero"> with Past Papers</span>
              </h1>
              
              <p className="text-lg text-text-muted max-w-lg">
                Access thousands of high-quality past exam papers, study guides, and resources. 
                Boost your confidence and excel in your studies with ReBooked Genius.
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex max-w-md space-x-2">
              <Input 
                placeholder="Search by subject, grade, or year..."
                className="flex-1"
              />
              <Button className="bg-primary hover:bg-brand-teal-dark">
                Find Papers
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary">15,000+</div>
                <div className="text-sm text-text-muted">Past Papers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-text-muted">Subjects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-text-muted">Success Rate</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-primary hover:bg-brand-teal-dark">
                <BookOpenCheck className="h-4 w-4 mr-2" />
                Start Learning
              </Button>
              <Button variant="outline" size="lg">
                Browse Subjects
              </Button>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={HERO_IMAGE_URL}
                alt="Kids diligently writing in a classroom setting with notebooks and pencils."
                className="w-full h-[400px] lg:h-[500px] object-cover"
                loading="eager"
              />
              
              {/* Floating Badge - Grade A+ */}
              <div className="absolute bottom-6 left-6 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-semibold text-sm">Grade A+</div>
                    <div className="text-xs text-text-muted">Average improvement</div>
                  </div>
                </div>
              </div>

              {/* Floating Badge - 2024 Papers */}
              <div className="absolute top-6 right-6 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <div className="font-semibold text-sm">2024 Papers</div>
                    <div className="text-xs text-text-muted">Latest available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
