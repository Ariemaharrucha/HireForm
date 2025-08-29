import prisma from "@/lib/prisma";
import { extractTextFromPdf } from "./text-extract";
import { geminiScreening } from "@/vendor/gemini";

export async function runScreening(candidateId: string, fileUrl: string, criteria: string) {
    try {
      const text = await extractTextFromPdf(fileUrl); 
      const {summary, overallScore, criteriaAnalysis} = await geminiScreening(text, criteria); 
      await prisma.candidate.update({ 
        where: { id: candidateId },
        data: {
          resumeText: text,
          aiSummary: summary,
          aiScore: overallScore,
          aiCriteriaAnalysis: criteriaAnalysis,
          status: "completed",
        },
      });
    } catch (err) {
      console.error("Screening error:", err);
    }
  }