"use client";

import * as React from "react";
import { WandSparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Question = {
  type: string;
  question: string;
  evaluationSignals: string[];
};

export function InterviewGenerator() {
  const [isPending, startTransition] = React.useTransition();
  const [questions, setQuestions] = React.useState<Question[]>([]);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const focusAreas = String(form.get("focusAreas") || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    startTransition(async () => {
      const response = await fetch("/api/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: form.get("company"),
          role: form.get("role"),
          difficulty: form.get("difficulty") || "junior",
          focusAreas,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        toast.error(payload.error?.message || "Question generation failed");
        return;
      }

      setQuestions(payload.data.questions);
      toast.success("Interview set generated");
    });
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="company" placeholder="Company, e.g. Stripe" required />
          <Input name="role" placeholder="Role, e.g. Frontend Engineer" required />
        </div>
        <Input name="difficulty" placeholder="Difficulty: intern, junior, mid, senior" />
        <Textarea
          name="focusAreas"
          placeholder="Focus areas separated by comma, e.g. React, system design, data structures"
        />
        <Button disabled={isPending} type="submit">
          <WandSparkles className="size-4" />
          {isPending ? "Generating..." : "Generate questions"}
        </Button>
      </form>

      {questions.length > 0 ? (
        <div className="grid gap-3">
          {questions.map((item, index) => (
            <div key={`${item.question}-${index}`} className="rounded-lg border bg-card p-4">
              <div className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                {item.type}
              </div>
              <p className="text-sm font-medium">{item.question}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Signals: {item.evaluationSignals.join(", ")}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
