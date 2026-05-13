"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ProgressForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    startTransition(async () => {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.get("title"),
          description: form.get("description"),
          category: form.get("category"),
          status: form.get("status") || "TODO",
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        toast.error(payload.error?.message || "Unable to add progress item");
        return;
      }

      toast.success("Progress item added");
      event.currentTarget.reset();
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <Input name="title" placeholder="Task title" required />
      <Input name="category" placeholder="Category, e.g. Resume, Interview" required />
      <Textarea name="description" placeholder="Short description" />
      <Button disabled={isPending} type="submit">
        <Plus className="size-4" />
        {isPending ? "Adding..." : "Add task"}
      </Button>
    </form>
  );
}
