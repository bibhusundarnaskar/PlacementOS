import { NextRequest } from "next/server";
import { generateInterviewQuestions } from "@/lib/ai/interviews";
import { getCurrentStudent } from "@/lib/auth";
import { fail, handleRouteError, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { interviewQuestionSchema } from "@/lib/validations/resume";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const student = await getCurrentStudent();

    if (!student) {
      return fail("Unauthorized", 401);
    }

    const input = interviewQuestionSchema.parse(await request.json());
    const questions = await generateInterviewQuestions(input);

    const session = await prisma.interviewSession.create({
      data: {
        studentId: student.id,
        company: input.company,
        role: input.role,
        difficulty: input.difficulty,
        questions,
      },
    });

    return ok({ id: session.id, questions }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
