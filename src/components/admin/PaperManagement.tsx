import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Check, X, Eye, Loader2, Download } from "lucide-react";
import { BulkUpload } from "./BulkUpload";

interface Paper {
  id: string;
  title: string;
  year: number;
  paper_number: string | null;
  paper_type: 'exam' | 'memo' | 'practice';
  file_url: string;
  approved: boolean;
  download_count: number;
  created_at: string;
  subjects: {
    name: string;
    code: string;
  };
  profiles: {
    full_name: string | null;
    email: string;
  };
}

export const PaperManagement = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const { data, error } = await supabase
        .from("papers")
        .select(`
          *,
          subjects!papers_subject_id_fkey (name, code),
          profiles!papers_uploaded_by_fkey (full_name, email)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPapers(data || []);
    } catch (error) {
      console.error("Error fetching papers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch papers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const approvePaper = async (paperId: string) => {
    setUpdating(paperId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from("papers")
        .update({ 
          approved: true,
          approved_by: session?.user.id,
          approved_at: new Date().toISOString()
        })
        .eq("id", paperId);

      if (error) throw error;

      setPapers(papers.map(paper => 
        paper.id === paperId ? { ...paper, approved: true } : paper
      ));

      toast({
        title: "Success",
        description: "Paper approved successfully",
      });
    } catch (error) {
      console.error("Error approving paper:", error);
      toast({
        title: "Error",
        description: "Failed to approve paper",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const rejectPaper = async (paperId: string) => {
    setUpdating(paperId);
    try {
      const { error } = await supabase
        .from("papers")
        .delete()
        .eq("id", paperId);

      if (error) throw error;

      setPapers(papers.filter(paper => paper.id !== paperId));

      toast({
        title: "Success",
        description: "Paper rejected and removed",
      });
    } catch (error) {
      console.error("Error rejecting paper:", error);
      toast({
        title: "Error",
        description: "Failed to reject paper",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const getPaperTypeBadge = (type: string) => {
    switch (type) {
      case 'exam':
        return <Badge variant="default">Exam</Badge>;
      case 'memo':
        return <Badge variant="secondary">Memo</Badge>;
      case 'practice':
        return <Badge variant="outline">Practice</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <BulkUpload onUploadComplete={fetchPapers} />
      
      <Card>
        <CardHeader>
          <CardTitle>Paper Management</CardTitle>
          <CardDescription>
            Review and manage uploaded papers ({papers.length} total papers)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Title</TableHead>
                  <TableHead className="min-w-[120px]">Subject</TableHead>
                  <TableHead className="min-w-[100px]">Type</TableHead>
                  <TableHead className="min-w-[80px]">Year</TableHead>
                  <TableHead className="min-w-[150px]">Uploaded By</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[80px]">Downloads</TableHead>
                  <TableHead className="min-w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {papers.map((paper) => (
                <TableRow key={paper.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {paper.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{paper.subjects.name}</div>
                      <div className="text-sm text-muted-foreground">{paper.subjects.code}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getPaperTypeBadge(paper.paper_type)}
                  </TableCell>
                  <TableCell>{paper.year}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{paper.profiles.full_name || "No name"}</div>
                      <div className="text-sm text-muted-foreground">{paper.profiles.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {paper.approved ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <Check className="h-3 w-3 mr-1" />
                        Approved
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{paper.download_count}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {!paper.approved && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => approvePaper(paper.id)}
                            disabled={updating === paper.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => rejectPaper(paper.id)}
                            disabled={updating === paper.id}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(paper.file_url, '_blank')}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => window.open(paper.file_url, '_blank', 'noopener,noreferrer')}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
