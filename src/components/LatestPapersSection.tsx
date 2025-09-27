import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Eye, 
  Calendar,
  Loader2
} from "lucide-react";

interface Paper {
  id: string;
  title: string;
  year: number;
  paper_type: string;
  download_count: number;
  created_at: string;
  subjects: {
    name: string;
  };
}

export const LatestPapersSection = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestPapers();
  }, []);

  const fetchLatestPapers = async () => {
    try {
      const { data, error } = await supabase
        .from("papers")
        .select(`
          id,
          title,
          year,
          paper_type,
          download_count,
          created_at,
          subjects (
            name
          )
        `)
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      setPapers(data || []);
    } catch (error) {
      console.error("Error fetching latest papers:", error);
    } finally {
      setLoading(false);
    }
  };

  const isNew = (createdAt: string) => {
    const paperDate = new Date(createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return paperDate > weekAgo;
  };
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Latest <span className="text-primary">Past Papers</span>
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Recently added past papers from the 2025 academic year.
            Stay updated with the latest exam formats and question types.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.length > 0 ? papers.map((paper) => (
              <Card key={paper.id} className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {isNew(paper.created_at) && (
                          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                            New
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors mb-1">
                        {paper.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-sm">
                        <span>{paper.subjects.name}</span>
                        <span>•</span>
                        <span>{paper.year}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{paper.year}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {paper.paper_type}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Download className="h-3 w-3" />
                      <span>{paper.download_count} downloads</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No papers available yet.</p>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Recent Papers
          </Button>
        </div>
      </div>
    </section>
  );
};
