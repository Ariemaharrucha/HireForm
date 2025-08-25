import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, criteria } = body;

  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const slug = await generateUniqueSlug(title);

    const form = await prisma.form.create({
      data: {
        userId: user.id,
        title,
        description,
        criteria,
        slug,
      },
    });

    return NextResponse.json(form, { status: 201 });
  } catch (error: any) {
    // Tangani error unik Prisma (P2002 = Unique constraint failed)
    if (error.code === "P2002" && error.meta?.target?.includes("slug")) {
      return NextResponse.json(
        { error: "Slug already exists, please try again" },
        { status: 409 } // 409 Conflict
      );
    }

    console.error("Unexpected error in form sync:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
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

    const forms = await prisma.form.findMany({
      where: { userId: user.id }, // pakai internal cuid, bukan clerkId
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(forms, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in form fetch:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function generateUniqueSlug(title: string) {
  const baseSlug = slugify(title);
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (await prisma.form.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
