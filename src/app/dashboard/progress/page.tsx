import { getCurrentStudent } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProgressForm } from "@/components/dashboard/progress-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProgressPage() {
  const student = await getCurrentStudent();

  if (!student) {
    return null;
  }

  const items = await prisma.progressItem.findMany({
    where: { studentId: student.id },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Progress tracking</h1>
        <p className="text-sm text-muted-foreground">
          Track readiness work across resumes, interviews, applications, and follow-ups.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Add task</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {items.length ? items.map((item) => (
              <div key={item.id} className="rounded-md border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Badge variant={item.status === "DONE" ? "success" : "outline"}>
                    {item.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">
                No tracked work yet. Add your first placement task.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
