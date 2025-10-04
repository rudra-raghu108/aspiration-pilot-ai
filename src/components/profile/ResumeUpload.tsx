import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText, Loader2 } from "lucide-react";
import { parseResume, findJobMatches } from "@/lib/ml-services";

export function ResumeUpload() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.includes('pdf') && !file.type.includes('word')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to upload a resume",
          variant: "destructive",
        });
        return;
      }

      // Upload file to Supabase storage
      const filename = `${user.id}_${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(filename, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filename);

      setResumeUrl(publicUrl);

      // Update user profile with resume URL
      await supabase
        .from('profiles')
        .update({ resume_url: publicUrl } as any)
        .eq('user_id', user.id);

      toast({
        title: "Success",
        description: "Resume uploaded successfully",
      });

      // Trigger resume parsing and analysis
      const parsedResume = await parseResume(publicUrl);
      const jobMatches = await findJobMatches(parsedResume);
      
      // Store parsed resume data and job matches
      await supabase.from('profiles').update({
        parsed_resume: parsedResume,
        job_matches: jobMatches.slice(0, 10) // Store top 10 matches
      } as any).eq('user_id', user.id);

      toast({
        title: "Resume Analyzed",
        description: `Found ${jobMatches.length} potential job matches`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload resume",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="resume-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                  <Loader2 className="w-8 h-8 mb-4 animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                )}
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF or Word Document (MAX. 10MB)
                </p>
              </div>
              <input
                id="resume-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </div>

          {resumeUrl && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <FileText className="w-4 h-4" />
              <span className="text-sm truncate">Resume uploaded</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(resumeUrl, '_blank')}
              >
                View
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}