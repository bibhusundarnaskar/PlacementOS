import { NextRequest } from "next/server";
import { getCurrentStudent } from "@/lib/auth";
import { fail, handleRouteError, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { progressSchema } from "@/lib/validations/resume";

export async function GET() {
  try {
    const student = await getCurrentStudent();

    if (!student) {
      return fail("Unauthorized", 401);
    }

    const items = await prisma.progressItem.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
    });

    return ok({ items });
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const student = await getCurrentStudent();

    if (!student) {
      return fail("Unauthorized", 401);
    }

    const input = progressSchema.parse(await request.json());
    const item = await prisma.progressItem.create({
      data: {
        studentId: student.id,
        title: input.title,
        description: input.description,
        category: input.category,
        status: input.status,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        completedAt: input.status === "DONE" ? new Date() : undefined,
      },
    });

    return ok({ item }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
