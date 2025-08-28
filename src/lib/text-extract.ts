import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

/**
 * Extract text from PDF using LangChain's PDFLoader.
 *
 * @param filePathOrUrl 
 * @returns
 */
export async function extractTextFromPdf(url: string) {
  try {
    // LANGKAH 1: Bertindak sebagai kurir untuk mengambil data dari alamat (URL)
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    // LANGKAH 2: Mengubah "kiriman" menjadi bahan mentah (Blob)
    const pdfBlob = await response.blob();

    // LANGKAH 3: Memberikan bahan mentah (Blob) kepada koki (PDFLoader)
    const loader = new PDFLoader(pdfBlob);
    const docs = await loader.load();

    const allText = docs.map((doc) => doc.pageContent).join("\n\n");
    return allText;

  } catch (error) {
    console.error("Error processing PDF from URL:", error);
    throw new Error("Could not extract text from PDF URL.");
  }
}