import { z } from "zod";
import { extractJsonPayload, getGeminiModel } from "@/lib/ai/gemini";

const questionsSchema = z.object({
  questions: z.array(
    z.object({
      type: z.enum(["technical", "behavioral", "system-design", "company"]),
      question: z.string(),
      evaluationSignals: z.array(z.string()),
    }),
  ),
});

export async function generateInterviewQuestions(input: {
  company: string;
  role: string;
  difficulty: string;
  focusAreas: string[];
}) {
  const model = getGeminiModel();

  if (!model) {
    return fallbackQuestions(input);
  }

  const response = await model.generateContent(
    `You generate company-specific interview practice sets. Return only strict JSON.

Create 10 interview questions for a ${input.difficulty} ${input.role} interview at ${input.company}.
Focus areas: ${input.focusAreas.join(", ") || "general role readiness"}.
Return JSON: { "questions": [{ "type": "technical|behavioral|system-design|company", "question": string, "evaluationSignals": string[] }] }`,
  );

  return questionsSchema.parse(JSON.parse(extractJsonPayload(response.response.text()))).questions;
}

function fallbackQuestions(input: {
  company: string;
  role: string;
  difficulty: string;
  focusAreas: string[];
}) {
  const focus = input.focusAreas[0] || "core product engineering";

  return [
    {
      type: "company" as const,
      question: `Why do you want to work at ${input.company}, and how does the ${input.role} role connect to your recent work?`,
      evaluationSignals: ["Company research", "Role clarity", "Specific examples"],
    },
    {
      type: "technical" as const,
      question: `Walk through a project where you used ${focus}. What tradeoffs did you make?`,
      evaluationSignals: ["Depth", "Tradeoff reasoning", "Ownership"],
    },
    {
      type: "behavioral" as const,
      question: "Tell me about a time you received hard feedback and changed your approach.",
      evaluationSignals: ["Coachability", "Reflection", "Concrete outcome"],
    },
  ];
}
