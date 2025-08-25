// src/app/api/users/route.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    console.log('Starting user sync request');
    
    // 1. Verify authentication
    const { userId } = await auth();
    console.log('Auth userId:', userId);
    
    if (!userId) {
      console.error('No user ID found in session');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get user info from Clerk
    const clerkUser = await currentUser();
    // console.log('Clerk user data:', JSON.stringify(clerkUser, null, 2));
    
    if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
      console.error('No email found in Clerk user data');
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const userEmail = clerkUser.emailAddresses[0].emailAddress;
    // console.log('Processing user with email:', userEmail);

    // 3. Upsert user in database
    try {
      const user = await prisma.user.upsert({
        where: { clerkId: userId },
        update: {},
        create: {
          clerkId: userId,
          email: userEmail,
        },
      });
      
      // console.log('User successfully processed:', JSON.stringify(user, null, 2));
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