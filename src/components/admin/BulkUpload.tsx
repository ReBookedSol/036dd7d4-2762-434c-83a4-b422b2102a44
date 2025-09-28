import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Upload, X, Loader2 } from "lucide-react";

interface BulkUploadProps {
  onUploadComplete: () => void;
}

interface UploadFile {
  file: File;
  title: string;
  year: number;
  paperNumber: string;
  paperType: 'exam' | 'memo' | 'practice';
  subjectId: string;
}

export const BulkUpload = ({ onUploadComplete }: BulkUploadProps) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Fetch subjects when component mounts
  useState(() => {
    const fetchSubjects = async () => {
      const { data } = await supabase.from("subjects").select("*");
      setSubjects(data || []);
    };
    fetchSubjects();
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        year: new Date().getFullYear(),
        paperNumber: "",
        paperType: 'exam' as const,
        subjectId: subjects[0]?.id || "",
      }));
      setFiles([...files, ...newFiles]);
    }
  };

  const updateFile = (index: number, updates: Partial<UploadFile>) => {
    setFiles(files.map((file, i) => i === index ? { ...file, ...updates } : file));
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      for (const uploadFile of files) {
        // Upload file to storage
        const fileExt = uploadFile.file.name.split('.').pop();
        const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;
        
        const { data: storageData, error: storageError } = await supabase.storage
          .from("papers")
          .upload(fileName, uploadFile.file);

        if (storageError) throw storageError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("papers")
          .getPublicUrl(fileName);

        // Insert paper record
        const { error: insertError } = await supabase
          .from("papers")
          .insert({
            title: uploadFile.title,
            subject_id: uploadFile.subjectId,
            year: uploadFile.year,
            paper_number: uploadFile.paperNumber,
            paper_type: uploadFile.paperType,
            file_url: publicUrl,
            file_size: uploadFile.file.size,
            uploaded_by: session.user.id,
            approved: true, // Auto-approve admin uploads
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: `${files.length} files uploaded successfully`,
      });

      setFiles([]);
      onUploadComplete();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Upload Papers
        </CardTitle>
        <CardDescription>
          Upload multiple past papers at once with metadata
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="files">Select Files</Label>
          <Input
            id="files"
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="mt-1"
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium">Files to Upload ({files.length})</h4>
            
            {files.map((file, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={file.title}
                      onChange={(e) => updateFile(index, { title: e.target.value })}
                      placeholder="Paper title"
                    />
                  </div>
                  
                  <div>
                    <Label>Subject</Label>
                    <Select
                      value={file.subjectId}
                      onValueChange={(value) => updateFile(index, { subjectId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Year</Label>
                    <Input
                      type="number"
                      value={file.year}
                      onChange={(e) => updateFile(index, { year: parseInt(e.target.value) })}
                      min="1990"
                      max="2030"
                    />
                  </div>
                  
                  <div>
                    <Label>Paper Number</Label>
                    <Input
                      value={file.paperNumber}
                      onChange={(e) => updateFile(index, { paperNumber: e.target.value })}
                      placeholder="e.g., Paper 1"
                    />
                  </div>
                  
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={file.paperType}
                      onValueChange={(value: 'exam' | 'memo' | 'practice') => 
                        updateFile(index, { paperType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="memo">Memo</SelectItem>
                        <SelectItem value="practice">Practice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
            
            <Button 
              onClick={uploadFiles} 
              disabled={uploading}
              className="w-full"
            >
              {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload {files.length} File{files.length !== 1 ? 's' : ''}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};