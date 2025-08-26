// app/api/forms/[id]/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) {return NextResponse.json({ error: "Unauthorized" }, { status: 401 });}

  try {
    const user = await prisma.user.findUnique({where: {clerkId: userId}});
    if (!user) {return NextResponse.json({ error: "User not found" }, { status: 404 });}

    const form = await prisma.form.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        candidates: true,
      },
    });

    if (!form) {return NextResponse.json({ error: "Form not found" }, { status: 404 });}

    return NextResponse.json(form, { status: 200 });
  } catch (error) {
    console.error("Error fetching form detail:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
