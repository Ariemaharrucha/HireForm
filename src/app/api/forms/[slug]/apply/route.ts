import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { runScreening } from "@/lib/screening";

export async function POST(req: Request, {  params }: { params: Promise<{ slug: string }> }) {
  try {
    const {slug} = await params;
    const body = await req.json();
    const { name, email, resumeUrl } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const form = await prisma.form.findUnique({
      where: { slug: slug },
    });
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    const existingCandidate = await prisma.candidate.findFirst({
      where: { formId: form.id, email },
    });
    if (existingCandidate) {
      return NextResponse.json(
        { error: "You have already applied to this form" },
        { status: 409 }
      );
    }

    const candidate = await prisma.candidate.create({
      data: {
        formId: form.id,
        name,
        email,
        resumeUrl,
      },
    });

    // 🔥 Fire-and-forget screening (tidak menunggu response)
    runScreening(candidate.id, resumeUrl).catch((err) =>
      console.error("Screening job failed:", err)
    );

    return NextResponse.json(candidate, { status: 201 });
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
