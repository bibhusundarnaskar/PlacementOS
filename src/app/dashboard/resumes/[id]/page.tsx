import { notFound } from "next/navigation";
import { getCurrentStudent } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ResumeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const student = await getCurrentStudent();

  if (!student) {
    return null;
  }

  const resume = await prisma.resume.findUnique({
    where: { id: resolvedParams.id, studentId: student.id },
  });

  if (!resume) {
    notFound();
  }

  const breakdown = resume.scoreBreakdown as Record<string, number> | null;
  const suggestions = resume.suggestions as string[] | null;

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/resumes">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">{resume.fileName}</h1>
          <p className="text-sm text-muted-foreground">
            Uploaded on {resume.createdAt.toLocaleDateString()}
          </p>
        </div>
        {resume.fileUrl && (
          <Button variant="secondary" className="ml-auto" asChild>
            <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">View File</a>
          </Button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>ATS Score</CardTitle>
            <CardDescription>Overall match</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative flex size-32 items-center justify-center rounded-full border-8 border-primary">
                <span className="text-4xl font-bold">{resume.atsScore || 0}</span>
              </div>
            </div>
            {breakdown && (
              <div className="mt-6 grid gap-3">
                {Object.entries(breakdown).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="capitalize text-muted-foreground">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <span className="font-medium">{value}%</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {resume.summary || "No summary available."}
              </p>
            </div>
            
            {suggestions && suggestions.length > 0 && (
              <div>
                <h3 className="mb-3 font-medium">Improvement Suggestions</h3>
                <ul className="grid gap-2 text-sm text-muted-foreground">
                  {suggestions.map((suggestion, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
