import { z } from "zod";
import { extractJsonPayload, getGeminiModel } from "@/lib/ai/gemini";

export type AtsScore = {
  score: number;
  summary: string;
  breakdown: Record<string, number>;
  suggestions: string[];
};

const atsSchema = z.object({
  score: z.number().min(0).max(100),
  summary: z.string(),
  breakdown: z.record(z.string(), z.number().min(0).max(100)),
  suggestions: z.array(z.string()),
});

export async function scoreResume(input: {
  resumeText: string;
  targetRole: string;
  jobDescription?: string;
}): Promise<AtsScore> {
  const model = getGeminiModel();

  if (!model) {
    return heuristicScore(input.resumeText, input.targetRole);
  }

  const response = await model.generateContent(
    `You are an expert ATS and technical recruiting evaluator. Return only strict JSON.

Evaluate this resume for the role "${input.targetRole}".
Job description:
${input.jobDescription || "No job description provided."}

Resume:
${input.resumeText.slice(0, 12000)}

Return JSON with keys: score, summary, breakdown, suggestions. Breakdown values must be 0-100.`,
  );

  const parsed = JSON.parse(extractJsonPayload(response.response.text()));
  return atsSchema.parse(parsed);
}

function heuristicScore(resumeText: string, targetRole: string): AtsScore {
  const text = resumeText.toLowerCase();
  const keywords = targetRole
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 2);
  const keywordHits = keywords.filter((word) => text.includes(word)).length;
  const hasMetrics = /\d+%|\$\d+|\b\d+x\b|\b\d+\+/.test(resumeText);
  const hasProjects = /project|built|implemented|deployed/.test(text);
  const hasSkills = /skills|technologies|tools|frameworks/.test(text);
  const base = 45 + keywordHits * 8 + (hasMetrics ? 15 : 0) + (hasProjects ? 10 : 0) + (hasSkills ? 10 : 0);
  const score = Math.max(35, Math.min(88, base));

  return {
    score,
    summary:
      "Heuristic score generated without GEMINI_API_KEY. Configure Gemini for richer ATS analysis.",
    breakdown: {
      keywordAlignment: Math.min(100, 40 + keywordHits * 15),
      impactMetrics: hasMetrics ? 80 : 45,
      projectDepth: hasProjects ? 78 : 48,
      skillsClarity: hasSkills ? 82 : 52,
    },
    suggestions: [
      "Add measurable outcomes to each major project or internship bullet.",
      `Mirror important keywords for ${targetRole} where they accurately represent your experience.`,
      "Group technical skills by category so recruiters and ATS systems can scan them quickly.",
    ],
  };
}
