import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  Download, 
  Eye, 
  Calendar,
  GraduationCap,
  Clock
} from "lucide-react";

const papers = [
  {
    title: "Mathematics Paper 1",
    subject: "Mathematics",
    grade: "Grade 12",
    date: "November 2025",
    examType: "NSC",
    paperType: "Final Exam",
    difficulty: "Advanced",
    downloads: "3,420",
    isNew: true
  },
  {
    title: "Physical Sciences Paper 2 - Chemistry",
    subject: "Physical Sciences",
    grade: "Grade 12",
    date: "November 2025",
    examType: "NSC",
    paperType: "Chemistry",
    difficulty: "Intermediate",
    downloads: "2,890",
    isNew: false
  },
  {
    title: "English Home Language Paper 1",
    subject: "English",
    grade: "Grade 12",
    date: "November 2025",
    examType: "NSC",
    paperType: "Literature",
    difficulty: "Intermediate",
    downloads: "4,120",
    isNew: true
  },
  {
    title: "Life Sciences Paper 1",
    subject: "Life Sciences",
    grade: "Grade 12",
    date: "September 2025",
    examType: "Trial Exam",
    paperType: "Biology",
    difficulty: "Advanced",
    downloads: "2,340",
    isNew: false
  },
  {
    title: "Business Studies Paper 1",
    subject: "Business Studies",
    grade: "Grade 12",
    date: "June 2025",
    examType: "Mid-year",
    paperType: "Economics",
    difficulty: "Intermediate",
    downloads: "1,890",
    isNew: false
  },
  {
    title: "Geography Paper 1 - Physical",
    subject: "Geography",
    grade: "Grade 12",
    date: "November 2025",
    examType: "NSC",
    paperType: "Physical Geography",
    difficulty: "Advanced",
    downloads: "1,560",
    isNew: false
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Advanced": return "text-red-600 bg-red-50";
    case "Intermediate": return "text-yellow-600 bg-yellow-50";
    default: return "text-green-600 bg-green-50";
  }
};

export const LatestPapersSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Latest <span className="text-primary">Past Papers</span>
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Recently added past papers from the 2024 academic year. 
            Stay updated with the latest exam formats and question types.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((paper, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {paper.isNew && (
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                          New
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors mb-1">
                      {paper.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm">
                      <span>{paper.subject}</span>
                      <span>•</span>
                      <span>{paper.grade}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-text-muted">
                    <Calendar className="h-3 w-3" />
                    <span>{paper.date}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {paper.examType}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-text-muted">Type:</span>
                    <div className="font-medium">{paper.paperType}</div>
                  </div>
                  <div>
                    <span className="text-text-muted">Topic:</span>
                    <div className="font-medium">{paper.topic}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getDifficultyColor(paper.difficulty)}`}
                  >
                    {paper.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-text-muted">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{paper.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-text-muted">
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span>{paper.downloads}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Recent Papers
          </Button>
        </div>
      </div>
    </section>
  );
};
