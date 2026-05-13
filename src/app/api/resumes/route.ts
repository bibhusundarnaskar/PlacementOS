import { NextRequest } from "next/server";
import { getCurrentStudent } from "@/lib/auth";
import { handleRouteError, fail, ok } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { scoreResume } from "@/lib/ai/resume";
import { parseResumeFile } from "@/lib/resume/parser";

export const runtime = "nodejs";

export async function GET() {
  try {
    const student = await getCurrentStudent();

    if (!student) {
      return fail("Unauthorized", 401);
    }

    const resumes = await prisma.resume.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
    });

    return ok({ resumes });
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

    const { fileUrl, fileName, fileType, targetRole = "Software Engineer" } = await request.json();

    if (!fileUrl) {
      return fail("Resume file URL is required", 422);
    }

    // Fetch the file from the UploadThing URL
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch uploaded file");
    }
    const arrayBuffer = await response.arrayBuffer();
    
    // Create a mock File object for the parser
    const file = new File([arrayBuffer], fileName, { type: fileType });

    const rawText = await parseResumeFile(file);
    const analysis = await scoreResume({ resumeText: rawText, targetRole });

    const resume = await prisma.resume.create({
      data: {
        studentId: student.id,
        fileName: fileName,
        fileType: fileType,
        fileUrl: fileUrl,
        rawText,
        summary: analysis.summary,
        atsScore: analysis.score,
        scoreBreakdown: analysis.breakdown,
        suggestions: analysis.suggestions,
        status: "COMPLETED",
      },
    });

    return ok(
      {
        id: resume.id,
        fileName: resume.fileName,
        fileUrl: resume.fileUrl,
        atsScore: resume.atsScore,
        summary: resume.summary,
        breakdown: resume.scoreBreakdown,
        suggestions: resume.suggestions,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
