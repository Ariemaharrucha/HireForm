import prisma from "@/lib/prisma";

export async function filterCandidate(formId: string, minScore?: number, status?: string) {
  try {
    const candidates = await prisma.candidate.findMany({
      where: {
        formId,
        ...(minScore !== undefined ? { aiScore: { gte: minScore } } : {}),
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return candidates;
  } catch (error) {
    console.error("Failed to filter candidates:", error);
    throw new Error("Gagal memfilter kandidat.");
  }
}
