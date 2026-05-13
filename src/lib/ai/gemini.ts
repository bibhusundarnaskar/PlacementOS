import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/lib/env";

export function getGeminiModel() {
  if (!env.GEMINI_API_KEY) {
    return null;
  }

  const client = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  return client.getGenerativeModel({ model: env.GEMINI_MODEL });
}

export function extractJsonPayload(text: string) {
  const trimmed = text.trim();

  if (trimmed.startsWith("```")) {
    const withoutFence = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/```$/, "");
    return withoutFence.trim();
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}
