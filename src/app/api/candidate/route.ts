import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ambil semua kandidat milik form HRD ini
    const candidates = await prisma.candidate.findMany({
      where: {
        form: { userId: user.id },
      },
      orderBy: { createdAt: "desc" },
      include: {
        form: { select: { id: true, title: true, slug: true } }, // optional: info form
      },
    });

    return NextResponse.json(candidates, { status: 200 });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

