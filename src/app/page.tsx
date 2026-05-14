import Link from "next/link";
import { ArrowRight, Brain, FileText, LineChart, Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "Resume intelligence",
    text: "Upload PDF, DOCX, or TXT resumes and receive ATS scoring with improvement suggestions.",
  },
  {
    icon: Brain,
    title: "Interview prep",
    text: "Generate company-specific technical and behavioral questions for target roles.",
  },
  {
    icon: LineChart,
    title: "Progress tracking",
    text: "Track placement tasks, readiness milestones, and completion signals in one workspace.",
  },
];

export default async function Home() {
  const user = await currentUser();

  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            P
          </span>
          PlacementOS
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="secondary" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <>
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get started</Link>
            </Button>
            </>
          )}
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-82px)] max-w-6xl items-center gap-10 px-4 pb-16 pt-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-1 text-sm text-muted-foreground">
            <Sparkles className="size-4" />
            AI career operations for placement season
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-normal text-balance sm:text-6xl">
              PlacementOS
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              A full-stack AI career assistant for students: resume parsing,
              ATS scoring, targeted interview preparation, and placement
              progress tracking.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Open dashboard <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard/interviews">Generate questions</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b pb-3">
            <div>
              <p className="text-sm font-medium">Career readiness</p>
              <p className="text-xs text-muted-foreground">Live student workspace</p>
            </div>
            <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs text-emerald-700 dark:text-emerald-300">
              Active Workspace
            </span>
          </div>
          <div className="grid gap-3">
            {features.map((feature) => (
              <Card key={feature.title} className="shadow-none">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
                  <feature.icon className="size-5 text-muted-foreground" />
                  <CardTitle className="text-sm">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 text-sm text-muted-foreground">
                  {feature.text}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
