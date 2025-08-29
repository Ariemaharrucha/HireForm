import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in environment");
}

const ai = new GoogleGenAI({ apiKey });

export async function geminiScreening(cvText: string, criteria: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `
              Generate an **output in valid JSON format** with the following structure:

              {
                "summary": "", 
                "overallScore": 0,
                "criteriaAnalysis": ""
              }

              ⚠️ Rules:
              - "summary": A concise overview (3–5 sentences) of the candidate’s background, education, and experience based on the CV.
              - "overallScore": A number between 0 and 100 indicating the overall strength of the candidate considering the given recruitment criteria.
              - "criteriaAnalysis": A plain string (not JSON array) that explains how well the candidate meets each recruitment criterion.
                Example: 
                "Criterion: Bachelor's Degree in Computer Science → Met. Candidate holds a B.Sc in Computer Science. 
                 Criterion: 3+ years of experience in backend → Not Met. Candidate only has 1 year of backend experience."

              📎 Use the following CV data:
              ${cvText}

              📋 Recruitment Criteria:
              ${criteria}

              ⚠️ Important
              - Output must be valid JSON as per the structure above.
              - Do not include extra explanations or Markdown fences (like \`\`\`json).
            `,
          },
        ],
      },
    ],
  });

  const result = response.text;
  const clean = result?.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(clean || "{}") as {
      summary: string;
      overallScore: number;
      criteriaAnalysis: string;
    };
  } catch (err) {
    console.error("Failed to parse Gemini output:", result);
    return {
      summary: "Screening failed",
      overallScore: 0,
      criteriaAnalysis: "No analysis available",
    };
  }
}
