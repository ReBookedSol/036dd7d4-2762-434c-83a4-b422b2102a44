import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Download, Eye, ChevronLeft, FileText } from "lucide-react";

// Mock papers data organized by year
const papersByYear = {
  2024: [
    { id: "1", title: "Mathematics Paper 1", type: "Final Exam", month: "November", memo: true },
    { id: "2", title: "Mathematics Paper 2", type: "Final Exam", month: "November", memo: true },
    { id: "3", title: "Mathematics Paper 1", type: "Trial Exam", month: "September", memo: true },
    { id: "4", title: "Mathematics Paper 2", type: "Trial Exam", month: "September", memo: true },
    { id: "5", title: "Mathematics Paper 1", type: "June Exam", month: "June", memo: true },
  ],
  2023: [
    { id: "6", title: "Mathematics Paper 1", type: "Final Exam", month: "November", memo: true },
    { id: "7", title: "Mathematics Paper 2", type: "Final Exam", month: "November", memo: true },
    { id: "8", title: "Mathematics Paper 1", type: "Trial Exam", month: "September", memo: true },
    { id: "9", title: "Mathematics Paper 2", type: "Trial Exam", month: "September", memo: true },
  ],
  2022: [
    { id: "10", title: "Mathematics Paper 1", type: "Final Exam", month: "November", memo: true },
    { id: "11", title: "Mathematics Paper 2", type: "Final Exam", month: "November", memo: true },
    { id: "12", title: "Mathematics Paper 1", type: "Trial Exam", month: "September", memo: false },
  ],
  2021: [
    { id: "13", title: "Mathematics Paper 1", type: "Final Exam", month: "November", memo: true },
    { id: "14", title: "Mathematics Paper 2", type: "Final Exam", month: "November", memo: true },
  ],
};

const SubjectPapers = () => {
  const { gradeId, subjectId } = useParams();
  const [selectedYear, setSelectedYear] = useState("2024");
  
  const years = Object.keys(papersByYear).sort((a, b) => b.localeCompare(a));
  const papers = papersByYear[selectedYear] || [];

  const gradeNames = {
    "grade-8": "Grade 8",
    "grade-9": "Grade 9",
    "grade-10": "Grade 10", 
    "grade-11": "Grade 11",
    "grade-12": "Grade 12",
  };

  const subjectNames = {
    "mathematics": "Mathematics",
    "english": "English",
    "afrikaans": "Afrikaans",
    "physical-sciences": "Physical Sciences",
    "life-sciences": "Life Sciences",
    // Add more subject mappings as needed
  };

  const gradeName = gradeNames[gradeId] || "Unknown Grade";
  const subjectName = subjectNames[subjectId] || subjectId?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link 
            to={`/grades/${gradeId}/subjects`} 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to {gradeName} Subjects
          </Link>
        </div>

        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold">{gradeName} {subjectName}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Past exam papers organized by year. Click to download or preview papers and memorandums.
          </p>
        </div>

        <Tabs value={selectedYear} onValueChange={setSelectedYear} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {years.map((year) => (
              <TabsTrigger key={year} value={year} className="text-lg font-semibold">
                {year}
              </TabsTrigger>
            ))}
          </TabsList>

          {years.map((year) => (
            <TabsContent key={year} value={year}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {papersByYear[year]?.map((paper) => (
                  <Card key={paper.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="outline">{paper.type}</Badge>
                      </div>
                      <CardTitle className="text-lg">{paper.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {paper.month} {year}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Preview
                        </Button>
                        <Button size="sm" className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                      </div>
                      {paper.memo && (
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            Preview Memo
                          </Button>
                          <Button variant="secondary" size="sm" className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            Download Memo
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default SubjectPapers;