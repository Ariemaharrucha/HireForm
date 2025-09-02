// src/lib/getCurrentUser.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const clerkUser = await currentUser();

  if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
    throw new Error("No email found");
  }

  const userEmail = clerkUser.emailAddresses[0].emailAddress;

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {},
    create: {
      clerkId: userId,
      email: userEmail,
    },
  });

  return user;
}
