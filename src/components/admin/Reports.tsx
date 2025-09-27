import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Flag, Check, X, Loader2 } from "lucide-react";

interface Report {
  id: string;
  report_type: 'paper_issue' | 'website_bug' | 'inappropriate_content' | 'other';
  title: string;
  description: string;
  status: string;
  created_at: string;
  profiles: {
    full_name: string | null;
    email: string;
  };
  papers?: {
    title: string;
  } | null;
}

export const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select(`
          *,
          profiles!reports_reporter_id_fkey (full_name, email),
          papers!reports_paper_id_fkey (title)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast({
        title: "Error",
        description: "Failed to fetch reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, status: string) => {
    setUpdating(reportId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const updates: any = { status };
      if (status === 'resolved') {
        updates.resolved_by = session?.user.id;
        updates.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("reports")
        .update(updates)
        .eq("id", reportId);

      if (error) throw error;

      setReports(reports.map(report => 
        report.id === reportId ? { ...report, status } : report
      ));

      toast({
        title: "Success",
        description: `Report marked as ${status}`,
      });
    } catch (error) {
      console.error("Error updating report:", error);
      toast({
        title: "Error",
        description: "Failed to update report",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const getReportTypeBadge = (type: string) => {
    switch (type) {
      case 'paper_issue':
        return <Badge variant="destructive">Paper Issue</Badge>;
      case 'website_bug':
        return <Badge variant="secondary">Website Bug</Badge>;
      case 'inappropriate_content':
        return <Badge variant="destructive">Inappropriate Content</Badge>;
      case 'other':
        return <Badge variant="outline">Other</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive">Open</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'dismissed':
        return <Badge variant="outline">Dismissed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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

  const openReports = reports.filter(report => report.status === 'open').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5" />
          Reports & Issues
        </CardTitle>
        <CardDescription>
          Manage user reports and platform issues
          {openReports > 0 && (
            <Badge variant="destructive" className="ml-2">
              {openReports} open
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Reporter</TableHead>
              <TableHead>Related Paper</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  {getReportTypeBadge(report.report_type)}
                </TableCell>
                <TableCell className="font-medium">{report.title}</TableCell>
                <TableCell>
                  <div className="max-w-xs truncate" title={report.description}>
                    {report.description}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{report.profiles.full_name || "No name"}</div>
                    <div className="text-sm text-muted-foreground">{report.profiles.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {report.papers?.title || "N/A"}
                </TableCell>
                <TableCell>
                  {getStatusBadge(report.status)}
                </TableCell>
                <TableCell>
                  {new Date(report.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {report.status === 'open' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateReportStatus(report.id, 'in_progress')}
                          disabled={updating === report.id}
                        >
                          In Progress
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateReportStatus(report.id, 'resolved')}
                          disabled={updating === report.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateReportStatus(report.id, 'dismissed')}
                          disabled={updating === report.id}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    {report.status === 'in_progress' && (
                      <Button
                        size="sm"
                        onClick={() => updateReportStatus(report.id, 'resolved')}
                        disabled={updating === report.id}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};