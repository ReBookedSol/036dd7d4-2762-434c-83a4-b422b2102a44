import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, Download, Eye, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Paper {
  id: string;
  title: string;
  year: number;
  paper_type: string;
  download_count: number;
  subjects: {
    name: string;
  };
}

const BrowsePapers = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("papers")
        .select(`
          id,
          title,
          year,
          paper_type,
          download_count,
          subjects (
            name
          )
        `)
        .eq("approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPapers(data || []);
    } catch (error: any) {
      console.error("Error fetching papers:", error);
      toast({
        title: "Error",
        description: "Failed to load papers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPapers = papers.filter((paper) => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.subjects.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !selectedSubject || paper.subjects.name === selectedSubject;
    const matchesYear = !selectedYear || paper.year.toString() === selectedYear;
    const matchesType = !selectedType || paper.paper_type === selectedType;
    
    return matchesSearch && matchesSubject && matchesYear && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold">Browse Papers</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                className="pl-9 w-64" 
                placeholder="Search papers" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filters</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger><SelectValue placeholder="Subject" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Subjects</SelectItem>
              {Array.from(new Set(papers.map(p => p.subjects.name))).map(subject => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
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
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Years</SelectItem>
              {Array.from(new Set(papers.map(p => p.year.toString()))).sort((a, b) => parseInt(b) - parseInt(a)).map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger><SelectValue placeholder="Paper Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              {Array.from(new Set(papers.map(p => p.paper_type))).map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedSubject("");
              setSelectedYear("");
              setSelectedType("");
              setSearchTerm("");
            }}
          >
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.length > 0 ? filteredPapers.map((paper) => (
            <Card key={paper.id} className="group hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">{paper.title}</CardTitle>
                <CardDescription>{paper.subjects.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {paper.year}
                  </div>
                  <Badge variant="outline">{paper.paper_type}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {paper.download_count} downloads
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />Preview
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Download className="h-3 w-3 mr-1" />Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-full text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No papers found</h3>
              <p className="text-sm text-muted-foreground">
                {papers.length === 0 
                  ? "No papers have been uploaded yet." 
                  : "Try adjusting your search filters to find more papers."
                }
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BrowsePapers;
