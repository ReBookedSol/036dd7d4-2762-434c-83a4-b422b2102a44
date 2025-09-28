import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, FileText } from "lucide-react";

const BUCKET = "papers";

const SubjectLesson = () => {
  const { slug, lessonId } = useParams();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug || !lessonId) return;
    const fetchLessonFiles = async () => {
      setLoading(true);
      try {
        const lessonPath = `${slug}/lessons/lesson-${lessonId}/`;
        const { data, error } = await supabase.storage.from(BUCKET).list(lessonPath, { limit: 200, sortBy: { column: "name", order: "asc" } });
        if (error) throw error;
        setFiles(data || []);
      } catch (e) {
        console.error(e);
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLessonFiles();
  }, [slug, lessonId]);

  const titleCase = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const getPublicUrl = (name: string) => supabase.storage.from(BUCKET).getPublicUrl(`${slug}/lessons/lesson-${lessonId}/${name}`).data.publicUrl;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link to={`/subjects/${slug}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to {titleCase(slug || "subject")}
          </Link>
        </div>

        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl font-bold">{titleCase(slug || "")} • Lesson {lessonId}</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">Follow the roadmap and work through these activities. Open files in a new tab to preview or download.</p>
        </div>

        {/* Simple roadmap */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="flex items-center justify-between">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-1 flex items-center">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold ${Number(lessonId) === i + 1 ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                  {i + 1}
                </div>
                {i < 5 && <div className="h-1 w-full bg-muted mx-2" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && <p>Loading lesson resources...</p>}
          {!loading && files.length === 0 && (
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>No resources yet</CardTitle>
                <CardDescription className="text-sm">We haven't uploaded materials for this lesson yet.</CardDescription>
              </CardHeader>
            </Card>
          )}
          {files.map((f) => (
            <Card key={f.name} className="group hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base break-all">{f.name}</CardTitle>
                    <CardDescription className="text-xs text-text-muted">{f.metadata?.size ? `${Math.round(f.metadata.size / 1024)} KB` : ""}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <a href={getPublicUrl(f.name)} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm">Preview</Button>
                  </a>
                  <a href={getPublicUrl(f.name)} target="_blank" rel="noreferrer">
                    <Button size="sm">Download</Button>
                  </a>
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

export default SubjectLesson;
