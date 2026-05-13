import { z } from "zod";

export const atsScoreSchema = z.object({
  resumeId: z.string().cuid().optional(),
  resumeText: z.string().min(100),
  targetRole: z.string().min(2).max(120),
  jobDescription: z.string().max(8000).optional(),
});

export const interviewQuestionSchema = z.object({
  company: z.string().min(2).max(120),
  role: z.string().min(2).max(120),
  difficulty: z.enum(["intern", "junior", "mid", "senior"]).default("junior"),
  focusAreas: z.array(z.string().min(2).max(80)).max(8).default([]),
});

export const progressSchema = z.object({
  title: z.string().min(2).max(140),
  description: z.string().max(500).optional(),
  category: z.string().min(2).max(80),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  dueDate: z.string().datetime().optional(),
});
