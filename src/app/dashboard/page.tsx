import { formatDistanceToNow } from "date-fns";
import { getCurrentStudent } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function DashboardPage() {
  const student = await getCurrentStudent();

  if (!student) {
    return null;
  }

  const [resumes, progressItems, interviews] = await Promise.all([
    prisma.resume.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.progressItem.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.interviewSession.count({ where: { studentId: student.id } }),
  ]);

  const done = progressItems.filter((item) => item.status === "DONE").length;
  const completion = progressItems.length ? Math.round((done / progressItems.length) * 100) : 0;
  const latestScore = resumes[0]?.atsScore || 0;

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Student dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Resume readiness, interview preparation, and placement execution.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Latest ATS score</CardDescription>
            <CardTitle className="text-3xl">{latestScore}/100</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={latestScore} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Progress completion</CardDescription>
            <CardTitle className="text-3xl">{completion}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={completion} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Interview sets</CardDescription>
            <CardTitle className="text-3xl">{interviews}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent resumes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {resumes.length ? resumes.map((resume) => (
              <div key={resume.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium">{resume.fileName}</p>
                  <Badge variant="secondary">{resume.atsScore || 0}/100</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDistanceToNow(resume.createdAt, { addSuffix: true })}
                </p>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No resumes uploaded yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active progress</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {progressItems.length ? progressItems.map((item) => (
              <div key={item.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{item.title}</p>
                  <Badge variant={item.status === "DONE" ? "success" : "outline"}>
                    {item.status.replace("_", " ")}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{item.category}</p>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No progress items yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
