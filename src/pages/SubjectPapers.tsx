import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Download, Eye, ChevronLeft, FileText, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const SubjectPapers = () => {
  const { gradeId, subjectId } = useParams();
  const [selectedYear, setSelectedYear] = useState("2024");
  const [papers, setPapers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { toast } = useToast();
  
  const years = ["2024", "2023", "2022", "2021"];

  const gradeNames = {
    "grade-8": "Grade 8",
    "grade-9": "Grade 9", 
    "grade-10": "Grade 10",
    "grade-11": "Grade 11",
    "grade-12": "Grade 12",
  };

  const gradeName = gradeNames[gradeId] || "Unknown Grade";
  const gradeNumber = gradeId?.replace("grade-", "");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch subjects
        const { data: subjectsData } = await supabase
          .from("subjects")
          .select("*");
        setSubjects(subjectsData || []);

        // Find the subject by name/slug
        const currentSubject = subjectsData?.find(s => 
          s.name.toLowerCase().replace(/\s+/g, "-") === subjectId ||
          s.code.toLowerCase() === subjectId
        );

        if (currentSubject) {
          // Fetch papers for this subject and grade
          const { data: papersData } = await supabase
            .from("papers")
            .select(`
              *,
              subjects(name, code)
            `)
            .eq("subject_id", currentSubject.id)
            .eq("approved", true)
            .order("year", { ascending: false });

          setPapers(papersData || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load papers",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gradeId, subjectId, toast]);

  const subjectName = papers[0]?.subjects?.name || subjectId?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase());

  const papersByYear = papers.reduce((acc, paper) => {
    const year = paper.year.toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(paper);
    return acc;
  }, {} as Record<string, any[]>);

  const handlePreview = (paper: any) => {
    setPreviewUrl(paper.file_url);
    setPreviewOpen(true);
  };

  const handleDownload = async (paper: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Record download
        await supabase
          .from("downloads")
          .insert({
            user_id: session.user.id,
            paper_id: paper.id
          });

        // Update download count
        await supabase
          .from("papers")
          .update({ download_count: (paper.download_count || 0) + 1 })
          .eq("id", paper.id);
      }

      // Download the file
      const link = document.createElement('a');
      link.href = paper.file_url;
      link.download = paper.title;
      link.target = '_blank';
      link.click();

      toast({
        title: "Download started",
        description: "Your download should begin shortly",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "Failed to download paper",
        variant: "destructive",
      });
    }
  };

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
            Past exam papers organized by year. Click to preview or download papers and memorandums.
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
                {papersByYear[year]?.length > 0 ? papersByYear[year].map((paper) => (
                  <Card key={paper.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="outline">{paper.paper_type}</Badge>
                      </div>
                      <CardTitle className="text-lg">{paper.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {paper.year}
                        {paper.paper_number && ` • ${paper.paper_number}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => handlePreview(paper)}
                        >
                          <Eye className="h-3 w-3" />
                          Preview
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => handleDownload(paper)}
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="col-span-full text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No papers available</h3>
                    <p className="text-muted-foreground">
                      No papers found for {subjectName} in {year}. Check back later for updates.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Paper Preview</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[70vh]">
            {previewUrl && (
              <iframe
                src={previewUrl}
                className="w-full h-full border rounded"
                title="Paper Preview"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default SubjectPapers;