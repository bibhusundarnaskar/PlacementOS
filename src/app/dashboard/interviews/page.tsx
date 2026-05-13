import { InterviewGenerator } from "@/components/dashboard/interview-generator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function InterviewsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">Interview generator</h1>
        <p className="text-sm text-muted-foreground">
          Create focused company-specific interview practice sets.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Question set</CardTitle>
          <CardDescription>
            Use real target companies and roles for stronger prompts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InterviewGenerator />
        </CardContent>
      </Card>
    </div>
  );
}
