import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpenCheck, Clock, Star, Search, Filter, Download, Eye, Users, TrendingUp } from "lucide-react";

const studyGuides = [
  { 
    id: 1, 
    title: "Complete Algebra Mastery", 
    subject: "Mathematics", 
    grade: "Grade 11-12",
    author: "Dr. Sarah Chen",
    length: "48 pages", 
    rating: 4.9, 
    downloads: 2340,
    type: "Comprehensive",
    difficulty: "Intermediate",
    topics: ["Linear equations", "Quadratic functions", "Polynomials", "Logarithms"]
  },
  { 
    id: 2, 
    title: "Essay Writing Excellence", 
    subject: "English", 
    grade: "Grade 10-12",
    author: "Prof. Michael Roberts",
    length: "32 pages", 
    rating: 4.8, 
    downloads: 1890,
    type: "Technique Guide",
    difficulty: "Beginner",
    topics: ["Structure", "Arguments", "Citations", "Style"]
  },
  { 
    id: 3, 
    title: "Organic Chemistry Simplified", 
    subject: "Physical Sciences", 
    grade: "Grade 12",
    author: "Dr. Emily Watson",
    length: "56 pages", 
    rating: 4.7, 
    downloads: 1650,
    type: "Comprehensive",
    difficulty: "Advanced",
    topics: ["Hydrocarbons", "Functional groups", "Reactions", "Mechanisms"]
  },
  { 
    id: 4, 
    title: "Human Biology Quick Review", 
    subject: "Life Sciences", 
    grade: "Grade 11-12",
    author: "Dr. James Kim",
    length: "28 pages", 
    rating: 4.6, 
    downloads: 1420,
    type: "Quick Reference",
    difficulty: "Intermediate",
    topics: ["Circulation", "Respiration", "Nervous system", "Reproduction"]
  },
  { 
    id: 5, 
    title: "Physics Problem Solving", 
    subject: "Physical Sciences", 
    grade: "Grade 11-12",
    author: "Prof. Lisa Anderson",
    length: "44 pages", 
    rating: 4.8, 
    downloads: 1980,
    type: "Problem Guide",
    difficulty: "Intermediate",
    topics: ["Mechanics", "Waves", "Electricity", "Magnetism"]
  },
  { 
    id: 6, 
    title: "History Timeline Mastery", 
    subject: "History", 
    grade: "Grade 10-12",
    author: "Dr. Robert Taylor",
    length: "36 pages", 
    rating: 4.5, 
    downloads: 1230,
    type: "Reference",
    difficulty: "Beginner",
    topics: ["World Wars", "Apartheid", "Democracy", "Global events"]
  }
];

const StudyGuides = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <TrendingUp className="h-4 w-4" />
            Premium Study Materials
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Expert Study Guides
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive, exam-focused guides created by education experts to help you master your subjects and excel in your exams.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search study guides..." 
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="physics">Physical Sciences</SelectItem>
                  <SelectItem value="life-sciences">Life Sciences</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="10">Grade 10</SelectItem>
                  <SelectItem value="11">Grade 11</SelectItem>
                  <SelectItem value="12">Grade 12</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Study Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {studyGuides.map((guide) => (
            <Card key={guide.id} className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg">
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpenCheck className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="secondary" className="text-xs">{guide.type}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{guide.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {guide.title}
                  </CardTitle>
                  <CardDescription className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-primary">{guide.subject}</span>
                      <span className="text-muted-foreground">{guide.grade}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">By {guide.author}</div>
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Topics covered */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Topics Covered:</p>
                  <div className="flex flex-wrap gap-1">
                    {guide.topics.slice(0, 3).map((topic, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {guide.topics.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{guide.topics.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {guide.length}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {guide.downloads.toLocaleString()}
                  </div>
                  <Badge 
                    variant={guide.difficulty === 'Beginner' ? 'secondary' : guide.difficulty === 'Intermediate' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {guide.difficulty}
                  </Badge>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    Preview
                  </Button>
                  <Button size="sm" className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Need a Custom Study Guide?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Can't find what you're looking for? Our expert educators can create personalized study guides tailored to your specific needs and learning style.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80">
                Request Custom Guide
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudyGuides;
