import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download, ChevronLeft } from "lucide-react";

const BUCKET = "papers";

const SubjectResources = () => {
  const { slug } = useParams();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchFiles = async () => {
      setLoading(true);
      try {
        // list files in bucket under folder named after slug
        const { data, error } = await supabase.storage.from(BUCKET).list(`${slug}/`, { limit: 100, offset: 0, sortBy: { column: 'name', order: 'asc' } });
        if (error) throw error;
        setFiles(data || []);
      } catch (err) {
        console.error('Error listing files:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [slug]);

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  };

  const handlePreview = (file: any) => {
    const path = `${slug}/${file.name}`;
    const url = getPublicUrl(path);
    setPreviewName(file.name);
    setPreviewUrl(url);
  };

  const handleClosePreview = () => {
    setPreviewUrl(null);
    setPreviewName(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link to="/subjects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to Learning Center
          </Link>
        </div>

        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold">{(slug || '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">Explore available papers and resources. Click Preview to view files or Download to save a copy.</p>
        </div>

        {/* Lessons / Modules section (Duolingo-like progression) */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-center mb-4">Lessons</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => {
              const lessonId = i + 1;
              return (
                <Card key={`lesson-${lessonId}`} className="group hover:shadow-lg transition-all p-4">
                  <CardHeader>
                    <CardTitle className="text-base">Lesson {lessonId}</CardTitle>
                    <CardDescription className="text-xs text-text-muted">Core topic and practice activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Approx. 20 min</div>
                      <Button size="sm" onClick={async () => {
                        // open lesson modal and fetch lesson files
                        const lessonPath = `${slug}/lessons/lesson-${lessonId}/`;
                        setLessonLoading(true);
                        setLessonOpen({ id: lessonId, title: `Lesson ${lessonId}` });
                        try {
                          const { data: lessonFiles, error } = await supabase.storage.from(BUCKET).list(lessonPath, { limit: 100 });
                          if (error) {
                            console.error('Error listing lesson files', error);
                            setLessonFiles([]);
                          } else {
                            setLessonFiles(lessonFiles || []);
                          }
                        } catch (e) {
                          console.error(e);
                          setLessonFiles([]);
                        } finally {
                          setLessonLoading(false);
                        }
                      }}>Start Lesson</Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && <p>Loading resources...</p>}
          {!loading && files.length === 0 && <p className="text-center text-muted-foreground">No resources found for this subject yet.</p>}
          {files.map((file) => (
            <Card key={file.name} className="group hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{file.name}</CardTitle>
                      <CardDescription className="text-xs text-text-muted">{(file.metadata?.size ? `${Math.round(file.metadata.size / 1024)} KB` : '')}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => handlePreview(file)}>
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <a href={getPublicUrl(`${slug}/${file.name}`)} target="_blank" rel="noreferrer" className="inline-block">
                    <Button size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />

      {/* Preview modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-background w-full max-w-4xl h-[80vh] rounded shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <div className="font-semibold">{previewName}</div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={handleClosePreview}>Close</Button>
                <a href={previewUrl} target="_blank" rel="noreferrer">
                  <Button size="sm">Open in new tab</Button>
                </a>
              </div>
            </div>
            <div className="h-full">
              {/* If PDF, render in iframe; otherwise show as image */}
              {previewUrl.endsWith('.pdf') ? (
                <iframe src={previewUrl} title={previewName || 'Preview'} className="w-full h-full" />
              ) : (
                <img src={previewUrl} alt={previewName || 'Preview'} className="w-full h-full object-contain" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectResources;
