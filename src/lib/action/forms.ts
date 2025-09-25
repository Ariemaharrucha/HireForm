// lib/data.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { slugify } from "../slugify";

async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = slugify(title);
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (await prisma.form.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

export async function createForm(formData: { title: string; description: string; criteria: string }) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { title, description, criteria } = formData;
  if (!title || !criteria) {
    throw new Error("Validation Error: Judul dan kriteria tidak boleh kosong.");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
  
    if (!user) {
      throw new Error("User not found in database");
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

    revalidatePath("/dashboard/forms");

    return form;
  } catch (error) {
    console.error("Unexpected error in form sync:", error);
    throw new Error("Failed to create form");
  }
} 

export async function getAllForms() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Anda harus login untuk melihat formulir.");
  }
  
  try {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return [];
    }
  
    // 3. Ambil semua formulir milik pengguna tersebut
    const forms = await prisma.form.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  
    return forms;
    
  } catch (error) {
    console.error("Failed to fetch forms:", error);
    throw new Error("Gagal mengambil data formulir.");
  }
}

export async function getFormById(formId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    throw new Error("User not found in database");
  }

  const form = await prisma.form.findFirst({
    where: {
      id: formId,
      userId: user.id,
    },
    include: {
      candidates: true,
    },
  });

  return form;
}

export async function getFormBySlug(slug: string) {
  const form = await prisma.form.findUnique({
    where: { slug },
    select: { title: true, criteria: true },
  });

  if (!form) {
    throw new Error("Form not found");
  }

  return form;
}

