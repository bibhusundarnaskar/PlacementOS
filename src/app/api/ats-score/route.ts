import { NextRequest } from "next/server";
import { getCurrentStudent } from "@/lib/auth";
import { scoreResume } from "@/lib/ai/resume";
import { fail, handleRouteError, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { atsScoreSchema } from "@/lib/validations/resume";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const student = await getCurrentStudent();

    if (!student) {
      return fail("Unauthorized", 401);
    }

    const input = atsScoreSchema.parse(await request.json());
    const resumeText = input.resumeId
      ? (
          await prisma.resume.findFirstOrThrow({
            where: { id: input.resumeId, studentId: student.id },
          })
        ).rawText
      : input.resumeText;

    const analysis = await scoreResume({
      resumeText,
      targetRole: input.targetRole,
      jobDescription: input.jobDescription,
    });

    if (input.resumeId) {
      await prisma.resume.update({
        where: { id: input.resumeId },
        data: {
          atsScore: analysis.score,
          summary: analysis.summary,
          scoreBreakdown: analysis.breakdown,
          suggestions: analysis.suggestions,
        },
      });
    }

    return ok(analysis);
  } catch (error) {
    return handleRouteError(error);
  }
}
