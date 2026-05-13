import Link from "next/link";
import { getCurrentStudent } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ResumeUpload } from "@/components/dashboard/resume-upload";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ResumesPage() {
  const student = await getCurrentStudent();

  if (!student) {
    return null;
  }

  const resumes = await prisma.resume.findMany({
    where: { studentId: student.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Resume lab</h1>
        <p className="text-sm text-muted-foreground">
          Upload, parse, score, and improve resumes for target roles.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Upload resume</CardTitle>
            <CardDescription>PDF, DOCX, and TXT files up to 5MB.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResumeUpload />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Analysis history</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {resumes.length ? resumes.map((resume) => (
              <Link key={resume.id} href={`/dashboard/resumes/${resume.id}`} className="block transition-transform hover:scale-[1.01]">
                <div className="rounded-md border p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium">{resume.fileName}</p>
                    <Badge variant="secondary">{resume.atsScore || 0}/100</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{resume.summary}</p>
                </div>
              </Link>
            )) : (
              <p className="text-sm text-muted-foreground">Upload your first resume to begin.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
