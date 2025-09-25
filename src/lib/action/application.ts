"use server";

import prisma from "@/lib/prisma";
import { runScreening } from "../screening";

interface ApplyCandidateInput {
  slug: string;
  name: string;
  email: string;
  resumeUrl: string;
  criteria: string;
}

export async function applyCandidate({slug, name, email, resumeUrl, criteria}: ApplyCandidateInput) {
  try {
    const form = await prisma.form.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!form) {
      throw new Error("Form not found");
    }

    const existingCandidate = await prisma.candidate.findFirst({
      where: { formId: form.id, email },
    });
    if (existingCandidate) {
      throw new Error("You have already applied to this form");
    }

    const candidate = await prisma.candidate.create({
      data: {
        name,
        email,
        resumeUrl,
        formId: form.id,
      },
    });

    runScreening(candidate.id, resumeUrl, criteria).catch((err) =>
      console.error("Screening job failed:", err)
    );
    return { success: true, data: candidate };
  } catch (error) {
    console.error("Error in applyCandidate:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
}

export async function checkCandidate(slug: string, email: string) {
  try {
    const form = await prisma.form.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!form) {
      throw new Error("Form not found");
    }

    const existingCandidate = await prisma.candidate.findFirst({
      where: { formId: form.id, email },
    });

    if (existingCandidate) {
      return { exists: true };
    }

    return { exists: false };
  } catch (error) {
    console.error("Error in checkCandidate:", error);
    return {
      exists: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
}
