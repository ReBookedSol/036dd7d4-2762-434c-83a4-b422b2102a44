import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpenCheck, Clock, Star } from "lucide-react";

const guides = [
  { title: "Algebra Essentials", subject: "Mathematics", length: "32 pages", rating: 4.8 },
  { title: "Essay Writing Mastery", subject: "English", length: "24 pages", rating: 4.7 },
  { title: "Organic Chemistry Basics", subject: "Physical Sciences", length: "28 pages", rating: 4.6 },
  { title: "Human Biology Quick Review", subject: "Life Sciences", length: "20 pages", rating: 4.5 },
];

const StudyGuides = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold">Study Guides</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">Concise, exam-focused guides to help you revise efficiently.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((g, i) => (
            <Card key={i} className="group hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookOpenCheck className="h-5 w-5 text-primary" />{g.title}</CardTitle>
                <CardDescription>{g.subject}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Clock className="h-4 w-4" />{g.length}</div>
                <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />{g.rating}</div>
                <Badge variant="secondary">PDF</Badge>
              </CardContent>
              <div className="px-6 pb-6">
                <Button className="w-full">Download Guide</Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudyGuides;
