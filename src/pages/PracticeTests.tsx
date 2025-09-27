import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Target, Trophy } from "lucide-react";

const tests = [
  { title: "Mathematics Practice Test A", subject: "Mathematics", duration: "90 min", questions: 30, difficulty: "Intermediate" },
  { title: "Physical Sciences Chemistry A", subject: "Physical Sciences", duration: "120 min", questions: 40, difficulty: "Advanced" },
  { title: "English HL Comprehension", subject: "English", duration: "60 min", questions: 25, difficulty: "Intermediate" },
];

const PracticeTests = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold">Practice Tests</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">Timed tests to simulate real exam conditions and build confidence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((t, i) => (
            <Card key={i} className="group hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-primary" />{t.title}</CardTitle>
                <CardDescription>{t.subject}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Timer className="h-4 w-4" />{t.duration}</span>
                  <span>{t.questions} questions</span>
                  <Badge variant="secondary">{t.difficulty}</Badge>
                </div>
                <Button className="w-full"><Trophy className="h-4 w-4 mr-2" />Start Test</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PracticeTests;
