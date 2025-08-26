import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

/**
 * Extract text from PDF using LangChain's PDFLoader.
 *
 * @param filePathOrUrl 
 * @returns
 */
export async function extractTextFromPdf(filePathOrUrl: string): Promise<string> {
    try {
      const loader = new PDFLoader(filePathOrUrl, {
        splitPages: true, // dapatkan tiap halaman
      });
  
      const docs = await loader.load(); // docs = Document[]
      const text = docs.map((doc) => doc.pageContent).join("\n\n");
  
      return text;
    } catch (error) {
      console.error("Error extracting PDF:", error);
      throw new Error("Failed to extract text from PDF");
    }
  }