import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calculator,
  Atom,
  Languages,
  BookText,
  Globe,
  Clock,
  Palette,
  Music,
  Monitor,
  Microscope,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const subjects = [
  {
    icon: Calculator,
    title: "Mathematics",
    description: "Algebra, Calculus, Geometry, Statistics",
    color: "text-blue-600"
  },
  {
    icon: Atom,
    title: "Physical Sciences",
    description: "Physics, Chemistry, Biology",
    color: "text-purple-600"
  },
  {
    icon: Languages,
    title: "Languages",
    description: "English, Afrikaans, Zulu, Xhosa",
    color: "text-green-600"
  },
  {
    icon: BookText,
    title: "Literature",
    description: "Poetry, Novels, Drama, Essays",
    color: "text-orange-600"
  },
  {
    icon: Globe,
    title: "Geography",
    description: "Physical & Human Geography",
    color: "text-teal-600"
  },
  {
    icon: Clock,
    title: "History",
    description: "World & South African History",
    color: "text-amber-600"
  },
  {
    icon: Palette,
    title: "Creative Arts",
    description: "Visual Arts, Design, Drama",
    color: "text-pink-600"
  },
  {
    icon: Music,
    title: "Music",
    description: "Theory, Composition, Performance",
    color: "text-indigo-600"
  },
  {
    icon: Monitor,
    title: "Information Technology",
    description: "Programming, Systems, Networks",
    color: "text-cyan-600"
  },
  {
    icon: Microscope,
    title: "Life Sciences",
    description: "Biology, Human Biology, Ecology",
    color: "text-emerald-600"
  },
  {
    icon: TrendingUp,
    title: "Business Studies",
    description: "Economics, Accounting, Finance",
    color: "text-rose-600"
  }
];

const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export const SubjectsSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Learning Center
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Subject resources, study guides and learning materials for Grade 8 - Grade 12. Click a subject to explore resources, filters and curated content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subjects.map((subject, index) => {
            const IconComponent = subject.icon;
            const slug = slugify(subject.title);
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <IconComponent className={`h-8 w-8 ${subject.color}`} />
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {subject.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {subject.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-end">
                    <Link to={`/subjects/${slug}`}>
                      <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                        View Resources
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/subjects">
            <Button variant="outline" size="lg">
              View Learning Center
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
