import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShieldCheck, Rocket, LibraryBig, Sparkles, Globe } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="secondary" className="bg-brand-teal-light text-brand-teal-dark border-brand-teal/20">About ReBooked Genius</Badge>
          <h1 className="text-4xl font-bold">Helping Students Master Exams</h1>
          <p className="text-lg text-text-muted max-w-3xl mx-auto">
            ReBooked Genius provides high-quality past exam papers, study guides, and practice resources to help you learn faster and score higher.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Trusted by Learners</CardTitle>
              <CardDescription>Thousands of students use our resources to prepare with confidence.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Quality Content</CardTitle>
              <CardDescription>Structured, up-to-date materials to match the current curriculum.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Rocket className="h-5 w-5 text-primary" /> Learn Efficiently</CardTitle>
              <CardDescription>Study paths that help you focus on what matters most.</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>Accessible, effective learning for everyone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>We believe every student deserves access to clear, practical study resources. Our platform brings together past papers, marking guidelines, and curated study guides so you can prepare smarter.</p>
              <p>From first-time users to top performers, we help you build confidence through practice and repetition with modern tools and clean design.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>What We Offer</CardTitle>
              <CardDescription>Tools that support every step</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2"><LibraryBig className="h-4 w-4 mt-1 text-primary" /><div><div className="font-medium">Past Papers Library</div><div className="text-muted-foreground">Browse by year, subject, and type</div></div></div>
              <div className="flex items-start gap-2"><Sparkles className="h-4 w-4 mt-1 text-primary" /><div><div className="font-medium">Study Guides</div><div className="text-muted-foreground">Clear summaries and tips</div></div></div>
              <div className="flex items-start gap-2"><Globe className="h-4 w-4 mt-1 text-primary" /><div><div className="font-medium">Accessible Anywhere</div><div className="text-muted-foreground">Fast, responsive experience</div></div></div>
              <div className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 mt-1 text-primary" /><div><div className="font-medium">Reliable</div><div className="text-muted-foreground">Continuously improved and maintained</div></div></div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
