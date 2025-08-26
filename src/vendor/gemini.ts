import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in environment");
}

const ai = new GoogleGenAI({ apiKey });

export async function geminiScreening(cvText: string) {
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
                  "score": 0
                }

                ⚠️ Rules:
                - "summary": A concise overview (3–5 sentences) of the candidate’s background, education, and experience based on the CV.
                - "score": A number between 0 and 100 indicating the overall strength of the candidate.

                📎 Use the following CV data:
                ${cvText}

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
    return JSON.parse(clean || "{}") as { summary: string; score: number };
  } catch (err) {
    console.error("Failed to parse Gemini output:", result);
    return { summary: "Screening failed", score: 0 };
  }
}
