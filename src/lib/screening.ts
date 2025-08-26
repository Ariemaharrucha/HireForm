import prisma from "@/lib/prisma";
import { extractTextFromPdf } from "./text-extract";
import { geminiScreening } from "@/vendor/gemini";

export async function runScreening(candidateId: string, fileUrl: string) {
    try {
      const text = await extractTextFromPdf(fileUrl); 
      const {summary, score} = await geminiScreening(text); 
      await prisma.candidate.update({
        where: { id: candidateId },
        data: {
          resumeText: text,
          aiSummary: summary,
          aiScore: score,
          status: "completed",
        },
      });
    } catch (err) {
      console.error("Screening error:", err);
    }
  }