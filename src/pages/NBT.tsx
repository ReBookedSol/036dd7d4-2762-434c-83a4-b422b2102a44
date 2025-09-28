import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const NBT = () => {
  const navigate = useNavigate();
  const { isPremium } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl font-bold">National Benchmark Tests (NBT)</h1>
          <p className="text-lg text-text-muted">Guidance, tips, and resources to prepare for South Africa's NBT exams.</p>
        </div>

        {!isPremium ? (
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle>Premium Content</CardTitle>
              <CardDescription>Access detailed NBT strategies, practice sets, and curated guides with ReBooked Genius Premium.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div>
                <div className="text-2xl font-bold">Included with Premium</div>
                <ul className="list-disc pl-5 text-sm text-muted-foreground mt-2 space-y-1">
                  <li>Full NBT preparation guide</li>
                  <li>Practice questions with solutions</li>
                  <li>Exam-day checklists and tips</li>
                </ul>
              </div>
              <Button size="lg" onClick={() => navigate('/pricing')}>Upgrade to Premium</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About the NBT</CardTitle>
                <CardDescription>Understand the structure and expectations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>The National Benchmark Tests (NBT) assess academic readiness for university. They include AQL (Academic Literacy and Quantitative Literacy) and MAT (Mathematics).</p>
                <p>We provide focused preparation resources, time management strategies, and worked examples aligned to the test format.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Preparation Tips</CardTitle>
                <CardDescription>Make the most of your study time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Practice under timed conditions.</li>
                  <li>Focus on comprehension and problem solving.</li>
                  <li>Revise core maths concepts: algebra, functions, data.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default NBT;
