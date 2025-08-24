// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Simulasi user dari Clerk
  const user = await prisma.user.upsert({
    where: { clerkId: "user_test_123" }, // ini dummy, nanti diganti dari Clerk
    update: {},
    create: {
      clerkId: "user_test_123",
      email: "hrd@example.com",
    },
  });

  // 2. Buat form job posting
  const form = await prisma.form.create({
    data: {
      userId: user.id,
      title: "Frontend Developer",
      description: "Mencari kandidat dengan pengalaman React & Tailwind",
      criteria: { skills: ["React", "Tailwind", "Next.js"] },
    },
  });

  // 3. Buat kandidat dummy
  await prisma.candidate.createMany({
    data: [
      {
        formId: form.id,
        name: "Andi Saputra",
        email: "andi@gmail.com",
        phone: "08123456789",
        resumeUrl: "https://example.com/andi_cv.pdf",
      },
      {
        formId: form.id,
        name: "Budi Santoso",
        email: "budi@gmail.com",
        phone: "08987654321",
        resumeUrl: "https://example.com/budi_cv.pdf",
      },
    ],
  });
}

main()
  .then(() => {
    console.log("Seed berhasil 🚀");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
