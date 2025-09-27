import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight, ChevronLeft } from "lucide-react";

// Mock subject data - in a real app, this would come from your database
const subjectsByGrade = {
  "grade-8": [
    { id: "afrikaans", name: "Afrikaans", code: "AFR", paperCount: 45 },
    { id: "english", name: "English", code: "ENG", paperCount: 52 },
    { id: "mathematics", name: "Mathematics", code: "MATH", paperCount: 38 },
    { id: "natural-sciences", name: "Natural Sciences", code: "NS", paperCount: 41 },
    { id: "social-sciences", name: "Social Sciences", code: "SS", paperCount: 33 },
    { id: "technology", name: "Technology", code: "TECH", paperCount: 28 },
  ],
  "grade-9": [
    { id: "afrikaans", name: "Afrikaans", code: "AFR", paperCount: 48 },
    { id: "english", name: "English", code: "ENG", paperCount: 55 },
    { id: "mathematics", name: "Mathematics", code: "MATH", paperCount: 42 },
    { id: "natural-sciences", name: "Natural Sciences", code: "NS", paperCount: 44 },
    { id: "social-sciences", name: "Social Sciences", code: "SS", paperCount: 36 },
    { id: "technology", name: "Technology", code: "TECH", paperCount: 31 },
    { id: "ems", name: "Economic & Management Sciences", code: "EMS", paperCount: 25 },
  ],
  "grade-10": [
    { id: "afrikaans", name: "Afrikaans Home Language", code: "AFR", paperCount: 62 },
    { id: "english", name: "English Home Language", code: "ENG", paperCount: 68 },
    { id: "mathematics", name: "Mathematics", code: "MATH", paperCount: 72 },
    { id: "physical-sciences", name: "Physical Sciences", code: "PS", paperCount: 58 },
    { id: "life-sciences", name: "Life Sciences", code: "LS", paperCount: 54 },
    { id: "accounting", name: "Accounting", code: "ACC", paperCount: 45 },
    { id: "business-studies", name: "Business Studies", code: "BS", paperCount: 38 },
    { id: "economics", name: "Economics", code: "ECON", paperCount: 32 },
    { id: "geography", name: "Geography", code: "GEO", paperCount: 41 },
    { id: "history", name: "History", code: "HIST", paperCount: 35 },
    { id: "information-technology", name: "Information Technology", code: "IT", paperCount: 28 },
    { id: "life-orientation", name: "Life Orientation", code: "LO", paperCount: 22 },
  ],
  "grade-11": [
    { id: "afrikaans", name: "Afrikaans Home Language", code: "AFR", paperCount: 78 },
    { id: "english", name: "English Home Language", code: "ENG", paperCount: 85 },
    { id: "mathematics", name: "Mathematics", code: "MATH", paperCount: 92 },
    { id: "mathematical-literacy", name: "Mathematical Literacy", code: "ML", paperCount: 58 },
    { id: "physical-sciences", name: "Physical Sciences", code: "PS", paperCount: 74 },
    { id: "life-sciences", name: "Life Sciences", code: "LS", paperCount: 68 },
    { id: "accounting", name: "Accounting", code: "ACC", paperCount: 62 },
    { id: "business-studies", name: "Business Studies", code: "BS", paperCount: 48 },
    { id: "economics", name: "Economics", code: "ECON", paperCount: 42 },
    { id: "geography", name: "Geography", code: "GEO", paperCount: 52 },
    { id: "history", name: "History", code: "HIST", paperCount: 45 },
    { id: "information-technology", name: "Information Technology", code: "IT", paperCount: 38 },
    { id: "life-orientation", name: "Life Orientation", code: "LO", paperCount: 28 },
    { id: "tourism", name: "Tourism", code: "TOUR", paperCount: 32 },
    { id: "consumer-studies", name: "Consumer Studies", code: "CS", paperCount: 25 },
  ],
  "grade-12": [
    { id: "afrikaans", name: "Afrikaans Home Language", code: "AFR", paperCount: 128 },
    { id: "english", name: "English Home Language", code: "ENG", paperCount: 142 },
    { id: "mathematics", name: "Mathematics", code: "MATH", paperCount: 156 },
    { id: "mathematical-literacy", name: "Mathematical Literacy", code: "ML", paperCount: 98 },
    { id: "physical-sciences", name: "Physical Sciences", code: "PS", paperCount: 134 },
    { id: "life-sciences", name: "Life Sciences", code: "LS", paperCount: 118 },
    { id: "accounting", name: "Accounting", code: "ACC", paperCount: 102 },
    { id: "business-studies", name: "Business Studies", code: "BS", paperCount: 86 },
    { id: "economics", name: "Economics", code: "ECON", paperCount: 78 },
    { id: "geography", name: "Geography", code: "GEO", paperCount: 92 },
    { id: "history", name: "History", code: "HIST", paperCount: 84 },
    { id: "information-technology", name: "Information Technology", code: "IT", paperCount: 68 },
    { id: "life-orientation", name: "Life Orientation", code: "LO", paperCount: 48 },
    { id: "tourism", name: "Tourism", code: "TOUR", paperCount: 58 },
    { id: "consumer-studies", name: "Consumer Studies", code: "CS", paperCount: 42 },
    { id: "agricultural-sciences", name: "Agricultural Sciences", code: "AS", paperCount: 36 },
    { id: "dramatic-arts", name: "Dramatic Arts", code: "DA", paperCount: 28 },
    { id: "visual-arts", name: "Visual Arts", code: "VA", paperCount: 32 },
  ]
};

const gradeNames = {
  "grade-8": "Grade 8",
  "grade-9": "Grade 9", 
  "grade-10": "Grade 10",
  "grade-11": "Grade 11",
  "grade-12": "Grade 12",
};

const GradeSubjects = () => {
  const { gradeId } = useParams();
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (gradeId && subjectsByGrade[gradeId]) {
      // Sort subjects alphabetically
      const sortedSubjects = [...subjectsByGrade[gradeId]].sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      setSubjects(sortedSubjects);
    }
  }, [gradeId]);

  const gradeName = gradeNames[gradeId] || "Unknown Grade";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/grades" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to Grades
          </Link>
        </div>

        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold">{gradeName} Subjects</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse subjects alphabetically to find past papers and study materials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subjects.map((subject) => (
            <Card key={subject.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary">{subject.code}</Badge>
                </div>
                <CardTitle className="text-lg">{subject.name}</CardTitle>
                <CardDescription>
                  {subject.paperCount} papers available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={`/grades/${gradeId}/subjects/${subject.id}/papers`}>
                  <Button className="w-full group">
                    View Papers
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

export default GradeSubjects;