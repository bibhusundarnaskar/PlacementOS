import mammoth from "mammoth";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export async function parseResumeFile(file: File) {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Resume file must be 5MB or smaller.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const type = file.type || inferMimeType(file.name);

  if (type === "application/pdf") {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const parsed = await parser.getText();
    await parser.destroy();
    return normalizeText(parsed.text);
  }

  if (
    type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const parsed = await mammoth.extractRawText({ buffer });
    return normalizeText(parsed.value);
  }

  if (type.startsWith("text/") || file.name.endsWith(".txt")) {
    return normalizeText(buffer.toString("utf8"));
  }

  throw new Error("Unsupported resume type. Upload a PDF, DOCX, or TXT file.");
}

function inferMimeType(fileName: string) {
  const lower = fileName.toLowerCase();

  if (lower.endsWith(".pdf")) {
    return "application/pdf";
  }

  if (lower.endsWith(".docx")) {
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  }

  return "text/plain";
}

function normalizeText(value: string) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length < 100) {
    throw new Error("The uploaded resume does not contain enough readable text.");
  }

  return normalized;
}
