"use client";

import * as React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { UploadDropzone } from "@/lib/uploadthing";

export function ResumeUpload() {
  const router = useRouter();
  const [targetRole, setTargetRole] = React.useState("Software Engineer Intern");
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="role" className="text-sm font-medium">Target Role</label>
        <Input
          id="role"
          value={targetRole}
          onChange={(event) => setTargetRole(event.target.value)}
          placeholder="e.g. Frontend Developer"
        />
      </div>
      
      <div className="relative">
        {isAnalyzing && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm">
            <p className="text-sm font-medium animate-pulse">Analyzing resume with Gemini...</p>
          </div>
        )}
        
        <UploadDropzone
          endpoint="resumeUploader"
         onClientUploadComplete={async (
  res: { url: string; name: string; type: string }[]
) => {
            if (!res || res.length === 0) return;
            const file = res[0];
            
            setIsAnalyzing(true);
            try {
              const response = await fetch("/api/resumes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  fileUrl: file.url,
                  fileName: file.name,
                  fileType: file.type,
                  targetRole: targetRole,
                }),
              });
              
              const payload = await response.json();
              if (!response.ok) {
                toast.error(payload.error?.message || "Resume analysis failed");
              } else {
                toast.success(`ATS score: ${payload.data.atsScore}/100`);
                router.refresh();
              }
            } catch (error) {
              toast.error("Failed to connect to the server.");
            } finally {
              setIsAnalyzing(false);
            }
          }}
          onUploadError={(error: Error) => {
            toast.error(`ERROR! ${error.message}`);
          }}
          className="ut-label:text-sm ut-allowed-content:ut-uploading:text-red-300 border-dashed border-2 p-8 border-muted-foreground/25 transition-colors hover:border-primary/50 hover:bg-muted/50 dark:bg-card"
        />
      </div>
    </div>
  );
}

