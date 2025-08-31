// src/app/api/users/route.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const { userId } = await auth();
    console.log('Auth userId:', userId);
    
    if (!userId) {
      console.error('No user ID found in session');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clerkUser = await currentUser();
    
    if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
      console.error('No email found in Clerk user data');
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const userEmail = clerkUser.emailAddresses[0].emailAddress;

    try {
      const user = await prisma.user.upsert({
        where: { clerkId: userId },
        update: {},
        create: {
          clerkId: userId,
          email: userEmail,
        },
      });
      
      return NextResponse.json(user);
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: "Failed to process user in database" },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Unexpected error in user sync:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}