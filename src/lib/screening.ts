import prisma from "@/lib/prisma";
import { extractTextFromPdf } from "./text-extract";
import { geminiScreening } from "@/vendor/gemini";

export async function runScreening(candidateId: string, fileUrl: string, criteria: string) {
    try {
      const text = await extractTextFromPdf(fileUrl); 
      const {summary, overallScore, criteriaAnalysis} = await geminiScreening(text, criteria); 

      let status: "rejected" | "shortlisted" | "pending" = "pending";
        if (overallScore < 50) {
          status = "rejected";
        } else if (overallScore >= 80) {
          status = "shortlisted";
        }
        
      await prisma.candidate.update({ 
        where: { id: candidateId },
        data: {
          resumeText: text,
          aiSummary: summary,
          aiScore: overallScore,
          aiCriteriaAnalysis: criteriaAnalysis,
          status,
        },
      });
    } catch (err) {
      console.error("Screening error:", err);
    }
  }