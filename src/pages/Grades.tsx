import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const grades = [
  { id: "grade-8", name: "Grade 8", description: "Foundation phase papers", subjects: 8 },
  { id: "grade-9", name: "Grade 9", description: "Intermediate phase papers", subjects: 9 },
  { id: "grade-10", name: "Grade 10", description: "Senior phase papers", subjects: 12 },
  { id: "grade-11", name: "Grade 11", description: "FET phase papers", subjects: 15 },
  { id: "grade-12", name: "Grade 12", description: "Matric papers", subjects: 18 },
];

const Grades = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold">Select Your Grade</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your grade level to access relevant past papers and study materials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {grades.map((grade) => (
            <Card key={grade.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">{grade.name}</CardTitle>
                <CardDescription>{grade.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  {grade.subjects} subjects available
                </p>
                <Link to={`/grades/${grade.id}/subjects`}>
                  <Button className="w-full group">
                    Browse Subjects
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Grades;