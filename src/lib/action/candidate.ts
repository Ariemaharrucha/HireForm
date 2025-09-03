"use server";
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

export async function deleteCandidate(candidateId: string) {
  try {
    await prisma.candidate.delete({
      where: { id: candidateId },
    });
    return true;
  } catch (error) {
    console.error("Failed to delete candidate:", error);
    throw new Error("Gagal menghapus kandidat.");
  }
}

export async function updateCandidateStatus(candidateId: string, status: "pending" | "shortlisted" | "rejected") {
  try {
    await prisma.candidate.update({
      where: { id: candidateId },
      data: { status },
    });
    return true;
  } catch (error) {
    console.error("Failed to update candidate status:", error);
    throw new Error("Gagal memperbarui status kandidat.");
  }
}
