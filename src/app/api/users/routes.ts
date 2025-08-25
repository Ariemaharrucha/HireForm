// src/app/api/users/route.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const clerkUser = await currentUser();
    if (!clerkUser?.emailAddresses[0]?.emailAddress) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {}, // kalau sudah ada, tidak perlu update
      create: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
