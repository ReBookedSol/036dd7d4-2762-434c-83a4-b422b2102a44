import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, Download, Eye } from "lucide-react";

const mockPapers = [
  { title: "Mathematics Paper 1", subject: "Mathematics", grade: "Grade 12", year: 2024, type: "Final Exam", downloads: 3420 },
  { title: "English HL Paper 1", subject: "English", grade: "Grade 12", year: 2024, type: "Final Exam", downloads: 4120 },
  { title: "Physical Sciences Paper 2", subject: "Physical Sciences", grade: "Grade 12", year: 2023, type: "Final Exam", downloads: 2890 },
  { title: "Life Sciences Paper 1", subject: "Life Sciences", grade: "Grade 12", year: 2024, type: "Trial Exam", downloads: 2340 },
];

const BrowsePapers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold">Browse Papers</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9 w-64" placeholder="Search papers" />
            </div>
            <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filters</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <Select>
            <SelectTrigger><SelectValue placeholder="Subject" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="math">Mathematics</SelectItem>
              <SelectItem value="science">Physical Sciences</SelectItem>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="life">Life Sciences</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger><SelectValue placeholder="Grade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10">Grade 10</SelectItem>
              <SelectItem value="11">Grade 11</SelectItem>
              <SelectItem value="12">Grade 12</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger><SelectValue placeholder="Paper Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="exam">Exam</SelectItem>
              <SelectItem value="memo">Memo</SelectItem>
              <SelectItem value="practice">Practice</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Reset</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPapers.map((paper, i) => (
            <Card key={i} className="group hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">{paper.title}</CardTitle>
                <CardDescription>{paper.subject} • {paper.grade}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{paper.year}</div>
                  <Badge variant="outline">{paper.type}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1"><Eye className="h-3 w-3 mr-1" />Preview</Button>
                  <Button size="sm" className="flex-1"><Download className="h-3 w-3 mr-1" />Download</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BrowsePapers;
